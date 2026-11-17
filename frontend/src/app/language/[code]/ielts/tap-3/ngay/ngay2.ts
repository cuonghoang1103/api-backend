/**
 * IELTS Tập 3 — Ngày 2 (tự soạn 18/11/2026, không chụp sách; mọi câu ví dụ, bài mẫu, câu bài tập VIẾT MỚI):
 *   Bài 1 · Vocab    — AWL sublist 3 (đủ 60 họ từ) + Education & society vòng 2 (40 từ / cụm) [VB3 VC02]
 *   Bài 2 · Writing  — Band 6 trông thế nào: đọc descriptors, bài mẫu band 5 vs band 6 cùng đề, tự chấm,
 *                       sổ lỗi, viết lại qua 3 phiên bản, tái tạo bài mẫu, lịch tự học [W01 W19 X07]
 *   Bài 3 · Speaking — Band 6 Speaking: 4 tiêu chí, so mẫu band 5 vs 6 ở cả ba Part, sổ Speaking [S01]
 *                       🔊 /æ/ /e/ /ʌ/
 *   Bài tập          — 43 câu: dạng từ, collocation, dịch 💡, nhận tiêu chí Writing / Speaking, sửa câu band 5, nguyên âm.
 * Nối Tập 2: N2 (band 5 trông thế nào, P-E-E) · N24 mục 1c (một đoạn qua 3 phiên bản) · N6 mục 4b + N10 (tái tạo bài mẫu)
 *           · N13 (Part 3 bốn bước) · N5 (filler, kéo dài ý) · N8 (/æ/ – /ʌ/ – /ɑː/). Tập 1 N3 (Education vòng 1).
 * Cả ba bài dùng chung chủ đề giáo dục để từ vựng bài 1 được dùng lại ngay trong bài viết và bài nói.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T3D2_VOCAB: Lesson = {
  id: "t3d2-tu-vung",
  kind: "vocab",
  title: "Từ vựng: AWL sublist 3 (60 họ từ) + Giáo dục & xã hội vòng 2",
  goal: "Nhận ra và dùng đúng dạng (danh – động – tính – trạng) của 60 họ từ học thuật AWL sublist 3, cùng 40 từ và cụm chủ đề Giáo dục ở mức band 6 — đủ để viết một bài Task 2 về giáo dục mà không lặp study / learn / school, và để hiểu các từ này khi chúng xuất hiện trong Reading.",
  minutes: 90,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy tiêu chí nào",
      items: [
        "**AWL** (Academic Word List) là danh sách 570 họ từ xuất hiện nhiều nhất trong văn bản học thuật, chia 10 nhóm (sublist) theo tần suất. Tập 2 đã học sublist 1–2. Hôm nay học trọn ==sublist 3== — 60 họ từ.",
        "Mỗi họ từ học **dạng hay gặp nhất** + **các dạng khác** + **một cụm đi kèm** (collocation). Biết một từ mà không biết nó đi với giới từ nào thì chưa dùng được.",
        "Chủ đề **Giáo dục** vòng 2: Tập 1 Ngày 3 dạy từ đời sống (subject, homework, exam). Hôm nay dạy từ **bàn luận** về giáo dục — curriculum, tuition fees, vocational training, critical thinking — đúng loại từ Task 2 và Part 3 cần.",
        "Đẩy band: **Lexical Resource band 6** — “vốn từ đủ rộng, dám dùng từ ít gặp dù còn sai”. Và **Reading**: câu hỏi paraphrase mức ② (đổi loại từ) chính là kiểm tra họ từ.",
        "Từ hôm nay tự vào **Flashcards** bộ “Từ của khoá — Tập 3”. Ôn 15 phút mỗi ngày trong 7 ngày tới.",
      ],
    },

    /* ── 0 ── */
    { t: "h", text: "Cách học 100 từ trong một ngày mà không ngợp" },
    {
      t: "sodo",
      kind: "flow",
      title: "Ba lượt, mỗi lượt một việc",
      caption: "Đừng cố thuộc hết trong một lượt. Mục tiêu hôm nay: NHẬN RA cả 100, DÙNG ĐƯỢC khoảng 30.",
      steps: [
        { label: "**Lượt 1 — lọc** (15 phút)", sub: "Đọc lướt, đánh dấu từ đã biết / lờ mờ / chưa biết." },
        { label: "**Lượt 2 — học** (45 phút)", sub: "Chỉ học nhóm lờ mờ + chưa biết: đọc to từ, câu ví dụ, dòng “more”." },
        { label: "**Lượt 3 — dùng** (30 phút)", sub: "Làm bài luyện; viết 5 câu của riêng bạn về giáo dục." },
        { label: "**7 ngày sau**", sub: "Flashcards mỗi ngày; từ nào quên thì đưa vào sổ lỗi." },
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "60 họ từ sublist 3 — chia theo NGHĨA cho dễ nhớ",
      caption: "Bốn mục 1–4 bên dưới xếp theo bảng chữ cái (đúng thứ tự của danh sách gốc); sơ đồ này gom lại theo việc bạn dùng từ để làm gì.",
      center: "AWL sublist 3",
      branches: [
        { label: "**Lập luận, chứng minh**", items: ["demonstrate · illustrate · imply · deduce", "justify · emphasis · instance · comment", "valid · criteria · specify"] },
        { label: "**Lượng, mức độ**", items: ["considerable · sufficient · maximum", "proportion · volume · minority", "constant · initial · core · dominant"] },
        { label: "**Quan hệ, liên kết**", items: ["link · interact · correspond · rely", "partnership · coordinate · contribute", "sequence · layer · component · framework"] },
        { label: "**Thay đổi, kết quả**", items: ["shift · remove · exclude · ensure", "outcome · reaction · negative", "alternative · compensate · constraint"] },
        { label: "**Xã hội, tổ chức**", items: ["fund · scheme · corporate · register", "immigration · convention · consent", "publish · document · location · circumstance"] },
        { label: "**Khoa học, công việc**", items: ["technology · technical · technique", "task · physical · philosophy · sex"] },
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. AWL sublist 3 — họ từ 1–15 (alternative → correspond)" },
    {
      t: "vocab",
      items: [
        { w: "alternative", pos: "n, adj", ipa: "/ɔːlˈtɜːnətɪv/", vi: "lựa chọn khác; thay thế", ex: "Online courses offer an alternative to traditional classroom teaching.", exVi: "Khoá học trực tuyến đem lại một lựa chọn khác ngoài việc dạy trên lớp truyền thống.", more: "**an alternative to** + N · **alternative energy / methods** · **alternatively** (adv, mở câu: Hoặc là…). Đừng lẫn **alternate** /ˈɔːltəneɪt/ (v, luân phiên)." },
        { w: "circumstance", pos: "n", ipa: "/ˈsɜːkəmstəns/", vi: "hoàn cảnh, tình huống", ex: "Under no circumstances should children be punished physically.", exVi: "Trong bất kỳ hoàn cảnh nào cũng không được phạt trẻ bằng đòn roi.", more: "Gần như luôn **số nhiều**: **in / under these circumstances** · **family circumstances** (hoàn cảnh gia đình)." },
        { w: "comment", pos: "n, v", ipa: "/ˈkɒment/", vi: "lời nhận xét; nhận xét", ex: "Teachers should comment on effort as well as results.", exVi: "Giáo viên nên nhận xét cả sự nỗ lực chứ không chỉ kết quả.", more: "**comment on** sth · **make a comment about** · họ từ: **commentary** (n, bài bình luận), **commentator**." },
        { w: "compensate", pos: "v", ipa: "/ˈkɒmpenseɪt/", vi: "bù đắp; bồi thường", ex: "Nothing can compensate for a lack of sleep before an exam.", exVi: "Không gì bù được việc thiếu ngủ trước kỳ thi.", more: "**compensate for** sth · **compensation** (n, tiền bồi thường — không đếm được): **receive compensation**." },
        { w: "component", pos: "n", ipa: "/kəmˈpəʊnənt/", vi: "thành phần, bộ phận cấu thành", ex: "Group work is a key component of the course.", exVi: "Làm việc nhóm là một thành phần then chốt của khoá học.", more: "**a key / essential component of** · gần nghĩa: **element, part**. Trong Reading: components ↔ parts." },
        { w: "consent", pos: "n, v", ipa: "/kənˈsent/", vi: "sự đồng ý, cho phép; đồng ý", ex: "Schools need parental consent before taking pupils on a trip.", exVi: "Trường cần sự đồng ý của phụ huynh trước khi đưa học sinh đi dã ngoại.", more: "**parental consent** · **give / withhold consent** · **consent to** sth. Không đếm được: ~~a consent~~." },
        { w: "considerable", pos: "adj", ipa: "/kənˈsɪdərəbl/", vi: "đáng kể, khá lớn", ex: "Studying abroad requires a considerable amount of money.", exVi: "Du học đòi hỏi một khoản tiền đáng kể.", more: "**a considerable amount / number / increase** · **considerably** (adv): considerably higher. ⚠️ Khác **considerate** (chu đáo)." },
        { w: "constant", pos: "adj", ipa: "/ˈkɒnstənt/", vi: "liên tục; không đổi", ex: "The figure remained constant at 40% throughout the period.", exVi: "Con số giữ nguyên ở mức 40% trong suốt giai đoạn.", more: "Task 1: **remain constant** = stay the same. **constantly** (adv) = all the time. **constant pressure** (áp lực triền miên)." },
        { w: "constraint", pos: "n", ipa: "/kənˈstreɪnt/", vi: "sự hạn chế, ràng buộc", ex: "Many schools work under severe financial constraints.", exVi: "Nhiều trường hoạt động trong tình trạng bị hạn chế tài chính nặng nề.", more: "**financial / time / budget constraints** (thường số nhiều) · **constrain** (v): be constrained by. Gần nghĩa: limitation." },
        { w: "contribute", pos: "v", ipa: "/kənˈtrɪbjuːt/", vi: "đóng góp; góp phần gây ra", ex: "Poor teaching contributes to low motivation among students.", exVi: "Dạy kém góp phần làm học sinh thiếu động lực.", more: "**contribute to** + N / V-ing (to là giới từ: ~~contribute to improve~~ → contribute to **improving**) · **contribution** (n): **make a contribution to**." },
        { w: "convention", pos: "n", ipa: "/kənˈvenʃn/", vi: "quy ước, tập quán; hội nghị", ex: "By convention, the school year in Vietnam begins in September.", exVi: "Theo thông lệ, năm học ở Việt Nam bắt đầu vào tháng Chín.", more: "Họ từ: **conventional** (adj, thông thường — **conventional teaching methods**) ↔ **unconventional** · **convene** (v, triệu tập)." },
        { w: "coordinate", pos: "v", ipa: "/kəʊˈɔːdɪneɪt/", vi: "điều phối, phối hợp", ex: "A tutor coordinates the work of the four project groups.", exVi: "Một trợ giảng điều phối công việc của bốn nhóm dự án.", more: "**coordination** (n): **hand–eye coordination**, **lack of coordination between** A and B · **coordinator** (n, điều phối viên)." },
        { w: "core", pos: "n, adj", ipa: "/kɔː(r)/", vi: "cốt lõi, trọng tâm", ex: "Maths and science are core subjects in most countries.", exVi: "Toán và khoa học là môn cốt lõi ở hầu hết các nước.", more: "**core subjects / skills / values** · **the core of** the problem. Trái nghĩa trong ngữ cảnh môn học: **optional subjects**." },
        { w: "corporate", pos: "adj", ipa: "/ˈkɔːpərət/", vi: "thuộc doanh nghiệp, công ty", ex: "Some universities now depend on corporate sponsorship.", exVi: "Một số trường đại học giờ phụ thuộc vào tài trợ của doanh nghiệp.", more: "**corporate culture / sponsorship / training** · **corporation** (n, tập đoàn). Chỉ đứng trước danh từ." },
        { w: "correspond", pos: "v", ipa: "/ˌkɒrəˈspɒnd/", vi: "tương ứng, khớp với", ex: "Exam results do not always correspond to real ability.", exVi: "Điểm thi không phải lúc nào cũng tương ứng với năng lực thật.", more: "**correspond to / with** · **corresponding** (adj): the corresponding figure for 2010 (Task 1) · **correspondence** (n, thư từ; sự tương ứng)." },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. AWL sublist 3 — họ từ 16–30 (criteria → instance)" },
    {
      t: "vocab",
      items: [
        { w: "criteria", pos: "n (số nhiều)", ipa: "/kraɪˈtɪəriə/", vi: "các tiêu chí", ex: "IELTS Writing is marked against four criteria.", exVi: "Bài viết IELTS được chấm theo bốn tiêu chí.", more: "Số ít: **criterion** /kraɪˈtɪəriən/. ⚠️ ~~a criteria~~ / ~~criterias~~ → **a criterion**, **several criteria**. **meet / satisfy the criteria**." },
        { w: "deduce", pos: "v", ipa: "/dɪˈdjuːs/", vi: "suy ra, suy luận", ex: "Readers can deduce the writer's opinion from the final paragraph.", exVi: "Người đọc có thể suy ra quan điểm của tác giả từ đoạn cuối.", more: "**deduce sth from** sth · **deduction** (n: sự suy luận; khoản khấu trừ — tax deductions)." },
        { w: "demonstrate", pos: "v", ipa: "/ˈdemənstreɪt/", vi: "chứng minh; cho thấy; trình diễn", ex: "Research demonstrates that smaller classes improve results.", exVi: "Nghiên cứu cho thấy lớp ít người hơn giúp cải thiện kết quả.", more: "**demonstrate that…** / **demonstrate the ability to** · **demonstration** (n) · gần nghĩa: show, prove. Động từ tường thuật đắt giá cho Task 2." },
        { w: "document", pos: "n, v", ipa: "/ˈdɒkjumənt/", vi: "tài liệu; ghi lại bằng tài liệu", ex: "The benefits of reading to children are well documented.", exVi: "Lợi ích của việc đọc sách cho trẻ đã được ghi nhận đầy đủ.", more: "**well documented** (đã được ghi chép kỹ) · **documentation** (n, hồ sơ) · **documentary** (n, phim tài liệu)." },
        { w: "dominant", pos: "adj", ipa: "/ˈdɒmɪnənt/", vi: "chiếm ưu thế, nổi trội", ex: "English is the dominant language of international research.", exVi: "Tiếng Anh là ngôn ngữ chiếm ưu thế trong nghiên cứu quốc tế.", more: "**dominate** (v): Coal dominated energy production in 1990 (Task 1) · **dominance / domination** (n)." },
        { w: "emphasis", pos: "n", ipa: "/ˈemfəsɪs/", vi: "sự nhấn mạnh, chú trọng", ex: "Schools place too much emphasis on exam results.", exVi: "Nhà trường đặt quá nhiều trọng tâm vào điểm thi.", more: "**place / put emphasis on** · số nhiều **emphases** · **emphasise** (v, ⚠️ không có on: ~~emphasise on~~) · **emphatic** (adj)." },
        { w: "ensure", pos: "v", ipa: "/ɪnˈʃɔː(r)/", vi: "bảo đảm, chắc chắn rằng", ex: "Governments must ensure that every child can attend school.", exVi: "Chính phủ phải bảo đảm mọi trẻ em đều được đến trường.", more: "**ensure that** + mệnh đề · **ensure** sth. ⚠️ Khác **insure** (mua bảo hiểm) và **assure** sb (cam đoan với ai)." },
        { w: "exclude", pos: "v", ipa: "/ɪkˈskluːd/", vi: "loại trừ, không cho tham gia", ex: "High fees exclude students from poorer families.", exVi: "Học phí cao loại bỏ cơ hội của sinh viên nhà nghèo hơn.", more: "**exclude sb from** sth · **exclusion** (n) · **exclusive** (adj, độc quyền; dành riêng) · trái nghĩa **include**." },
        { w: "framework", pos: "n", ipa: "/ˈfreɪmwɜːk/", vi: "khuôn khổ, khung", ex: "The national curriculum provides a framework for teachers.", exVi: "Chương trình quốc gia đưa ra một khuôn khổ cho giáo viên.", more: "**a legal / theoretical framework** · **within the framework of** · **provide a framework for**." },
        { w: "fund", pos: "n, v", ipa: "/fʌnd/", vi: "quỹ, tiền vốn; cấp tiền", ex: "The project is funded by the Ministry of Education.", exVi: "Dự án được Bộ Giáo dục cấp kinh phí.", more: "**funds** (số nhiều = tiền) · **funding** (n, không đếm được): **government funding for** schools · **publicly funded** · **raise funds**." },
        { w: "illustrate", pos: "v", ipa: "/ˈɪləstreɪt/", vi: "minh hoạ; cho thấy rõ", ex: "The chart illustrates how spending on education changed.", exVi: "Biểu đồ minh hoạ chi tiêu cho giáo dục đã thay đổi thế nào.", more: "Mở bài Task 1: The graph **illustrates / shows / compares**… · **illustration** (n) · **to illustrate** (để minh hoạ, …)." },
        { w: "immigration", pos: "n", ipa: "/ˌɪmɪˈɡreɪʃn/", vi: "sự nhập cư", ex: "Immigration has changed the make-up of many city schools.", exVi: "Nhập cư đã thay đổi thành phần học sinh của nhiều trường thành phố.", more: "**immigrate** (v, nhập cư VÀO) ↔ **emigrate** (di cư RA khỏi) · **immigrant** (n, người nhập cư) · **immigration policy**." },
        { w: "imply", pos: "v", ipa: "/ɪmˈplaɪ/", vi: "ngụ ý, hàm ý", ex: "The writer implies that homework has little value.", exVi: "Tác giả ngụ ý rằng bài tập về nhà ít giá trị.", more: "**implication** (n): **the implications of** (hệ quả, tác động) · **implicit** (adj, ngầm) ↔ **explicit**. Reading: “What does the writer imply?” = ý ẩn (mức ④)." },
        { w: "initial", pos: "adj, n", ipa: "/ɪˈnɪʃl/", vi: "ban đầu; chữ cái đầu của tên", ex: "After an initial rise, the figure fell steadily.", exVi: "Sau một đợt tăng ban đầu, con số giảm đều.", more: "**initially** (adv) = at first — rất hợp Task 1 · **the initial stage / reaction** · **initiate** (v, khởi xướng)." },
        { w: "instance", pos: "n", ipa: "/ˈɪnstəns/", vi: "ví dụ, trường hợp", ex: "In many instances, students learn more from each other.", exVi: "Trong nhiều trường hợp, học sinh học được nhiều hơn từ nhau.", more: "**for instance** = for example (đổi qua lại để khỏi lặp) · **in this instance** · **an instance of** sth." },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. AWL sublist 3 — họ từ 31–45 (interact → react)" },
    {
      t: "vocab",
      items: [
        { w: "interact", pos: "v", ipa: "/ˌɪntərˈækt/", vi: "tương tác, giao tiếp qua lại", ex: "Children learn social skills by interacting with their peers.", exVi: "Trẻ học kỹ năng xã hội bằng cách tương tác với bạn cùng trang lứa.", more: "**interact with** · **interaction** (n): **face-to-face / social interaction** · **interactive** (adj): interactive whiteboard." },
        { w: "justify", pos: "v", ipa: "/ˈdʒʌstɪfaɪ/", vi: "biện minh, chứng minh là đúng", ex: "It is hard to justify spending so much on school sports.", exVi: "Khó mà biện minh cho việc chi nhiều tiền đến thế cho thể thao học đường.", more: "**justify** + V-ing / N · **justification** (n): there is no justification for… · **justified** ↔ **unjustified** · **justifiable**." },
        { w: "layer", pos: "n", ipa: "/ˈleɪə(r)/", vi: "lớp, tầng", ex: "The process adds another layer of bureaucracy to schools.", exVi: "Quy trình này thêm một tầng thủ tục hành chính nữa cho trường học.", more: "**a layer of** ice / dust / management · **the ozone layer** · Task 1 quy trình: a **layer** of sand is added." },
        { w: "link", pos: "n, v", ipa: "/lɪŋk/", vi: "mối liên hệ; liên kết", ex: "Studies have linked regular reading to better exam results.", exVi: "Các nghiên cứu đã liên hệ việc đọc đều đặn với kết quả thi tốt hơn.", more: "**link A to / with B** · **a link between A and B** · **be closely linked to** · **linkage** (n). Dùng thay cause khi chưa chắc quan hệ nhân quả." },
        { w: "location", pos: "n", ipa: "/ləʊˈkeɪʃn/", vi: "vị trí, địa điểm", ex: "The location of a school affects how pupils travel to it.", exVi: "Vị trí của trường ảnh hưởng tới cách học sinh đi học.", more: "**locate** (v): **be located in / on / near** (Task 1 bản đồ) · **relocate** (v, chuyển chỗ) · **a convenient location**." },
        { w: "maximum", pos: "n, adj", ipa: "/ˈmæksɪməm/", vi: "mức tối đa", ex: "Class sizes should be limited to a maximum of thirty.", exVi: "Sĩ số lớp nên giới hạn ở mức tối đa ba mươi.", more: "**a maximum of** + số · ↔ **minimum** · **maximise** (v): maximise learning time ↔ minimise." },
        { w: "minority", pos: "n", ipa: "/maɪˈnɒrəti/", vi: "thiểu số, phần ít", ex: "Only a small minority of students fail the course.", exVi: "Chỉ một thiểu số nhỏ sinh viên trượt khoá học.", more: "**a (small) minority of** ↔ **the (vast) majority of** — cặp từ vàng cho Task 1 · **ethnic minorities** · **minor** (adj, nhỏ, thứ yếu) ↔ major." },
        { w: "negative", pos: "adj", ipa: "/ˈneɡətɪv/", vi: "tiêu cực; phủ định; âm", ex: "Too much testing has a negative effect on creativity.", exVi: "Kiểm tra quá nhiều có tác động tiêu cực tới sự sáng tạo.", more: "**have a negative effect / impact on** · **negatively** (adv) · **negate** (v, vô hiệu hoá). ↔ positive." },
        { w: "outcome", pos: "n", ipa: "/ˈaʊtkʌm/", vi: "kết quả (sau một quá trình)", ex: "Early education improves learning outcomes later in life.", exVi: "Giáo dục sớm cải thiện kết quả học tập về sau.", more: "**learning outcomes** · **the outcome of** · **a positive / likely outcome**. Gần nghĩa: result, consequence." },
        { w: "partnership", pos: "n", ipa: "/ˈpɑːtnəʃɪp/", vi: "quan hệ đối tác, sự hợp tác", ex: "The college works in partnership with local employers.", exVi: "Trường cao đẳng hợp tác với các nhà tuyển dụng địa phương.", more: "**in partnership with** · **a partnership between A and B** · **partner** (n, v)." },
        { w: "philosophy", pos: "n", ipa: "/fəˈlɒsəfi/", vi: "triết học; triết lý", ex: "The school's philosophy is that every child can succeed.", exVi: "Triết lý của trường là mọi đứa trẻ đều có thể thành công.", more: "**philosopher** (n) · **philosophical** (adj) · **a philosophy of education**. Trọng âm: phi-LO-so-phy." },
        { w: "physical", pos: "adj", ipa: "/ˈfɪzɪkl/", vi: "thuộc thể chất; vật lý", ex: "Physical education should be compulsory at every age.", exVi: "Giáo dục thể chất nên là bắt buộc ở mọi lứa tuổi.", more: "**physical education (PE) / activity / health** ↔ **mental** health · **physically** (adv): physically active · **physics** (n, môn vật lý)." },
        { w: "proportion", pos: "n", ipa: "/prəˈpɔːʃn/", vi: "tỉ lệ, phần", ex: "The proportion of women in engineering rose to 25%.", exVi: "Tỉ lệ nữ trong ngành kỹ thuật tăng lên 25%.", more: "**the proportion of** + N (Task 1: = the percentage of) · **a large / significant proportion** · **proportional to** · **in proportion to**." },
        { w: "publish", pos: "v", ipa: "/ˈpʌblɪʃ/", vi: "xuất bản, công bố", ex: "The results were published in a leading science journal.", exVi: "Kết quả được công bố trên một tạp chí khoa học hàng đầu.", more: "**publication** (n) · **publisher** (n, nhà xuất bản) · **unpublished** · **publish a report / findings**." },
        { w: "reaction", pos: "n", ipa: "/riˈækʃn/", vi: "phản ứng", ex: "Parents' reaction to the new timetable was largely positive.", exVi: "Phản ứng của phụ huynh với thời khoá biểu mới phần lớn là tích cực.", more: "**react to** (v) · **a reaction to / against** · **reactive** (adj) · **chemical reaction** · **reactor** (lò phản ứng)." },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. AWL sublist 3 — họ từ 46–60 (register → volume)" },
    {
      t: "vocab",
      items: [
        { w: "register", pos: "v, n", ipa: "/ˈredʒɪstə(r)/", vi: "đăng ký; sổ điểm danh; văn phong", ex: "Over two thousand students registered for the online course.", exVi: "Hơn hai nghìn sinh viên đã đăng ký khoá học trực tuyến.", more: "**register for** a course · **registration** (n) · **take the register** (điểm danh). Nghĩa thứ ba: **register** = mức trang trọng của ngôn ngữ (formal register)." },
        { w: "rely", pos: "v", ipa: "/rɪˈlaɪ/", vi: "dựa vào, phụ thuộc", ex: "Many students rely on their parents for financial support.", exVi: "Nhiều sinh viên dựa vào cha mẹ về tài chính.", more: "**rely on / upon** · **reliable** (adj, đáng tin) ↔ unreliable · **reliance** (n): **reliance on** technology · **reliability** (n)." },
        { w: "remove", pos: "v", ipa: "/rɪˈmuːv/", vi: "loại bỏ, gỡ bỏ", ex: "Free school meals remove one barrier to learning.", exVi: "Bữa ăn miễn phí ở trường gỡ bỏ một rào cản đối với việc học.", more: "**remove sth from** · **removal** (n): the removal of tuition fees · **remove a barrier / obstacle**." },
        { w: "scheme", pos: "n", ipa: "/skiːm/", vi: "chương trình, kế hoạch (do tổ chức đề ra)", ex: "The government launched a scheme to train more science teachers.", exVi: "Chính phủ khởi động một chương trình đào tạo thêm giáo viên khoa học.", more: "**launch / introduce a scheme** · **a training / pension / loan scheme**. Anh-Anh; Mỹ dùng **program**. Đọc /sk/, không phải /ʃ/." },
        { w: "sequence", pos: "n", ipa: "/ˈsiːkwəns/", vi: "trình tự, chuỗi", ex: "Lessons should follow a logical sequence.", exVi: "Các bài học nên đi theo một trình tự hợp lý.", more: "**a sequence of** events · **in sequence** · **sequential** (adj) · **subsequent** (adj, tiếp theo) — **subsequently** = afterwards (Task 1 quy trình)." },
        { w: "sex", pos: "n", ipa: "/seks/", vi: "giới tính", ex: "The table compares literacy rates by age and sex.", exVi: "Bảng so sánh tỉ lệ biết chữ theo tuổi và giới tính.", more: "**single-sex schools** ↔ **mixed / co-educational schools** · trong văn học thuật hiện nay hay dùng **gender**: gender equality." },
        { w: "shift", pos: "n, v", ipa: "/ʃɪft/", vi: "sự chuyển dịch; chuyển, đổi; ca làm việc", ex: "There has been a shift from textbooks to digital materials.", exVi: "Đã có sự chuyển dịch từ sách giáo khoa sang học liệu số.", more: "**a shift from A to B** · **a shift in** attitudes · **shift towards** · **night shift** (ca đêm). Động từ: shift the focus to…" },
        { w: "specify", pos: "v", ipa: "/ˈspesɪfaɪ/", vi: "nêu rõ, chỉ định cụ thể", ex: "The task specifies a minimum of 250 words.", exVi: "Đề bài nêu rõ tối thiểu 250 từ.", more: "**specific** (adj) — **specifically** (adv) · **specification** (n, đặc tả) · ↔ **unspecified**. Band 6 cần **ví dụ cụ thể**: a specific example." },
        { w: "sufficient", pos: "adj", ipa: "/səˈfɪʃnt/", vi: "đủ", ex: "Schools do not have sufficient resources to teach coding.", exVi: "Các trường không có đủ nguồn lực để dạy lập trình.", more: "= **enough** (trang trọng hơn) · ↔ **insufficient** · **sufficiently** (adv) · **self-sufficient** (tự cung tự cấp)." },
        { w: "task", pos: "n", ipa: "/tɑːsk/", vi: "nhiệm vụ, bài tập được giao", ex: "Group tasks teach students to share responsibility.", exVi: "Nhiệm vụ nhóm dạy học sinh chia sẻ trách nhiệm.", more: "**carry out / complete / perform a task** (do a task cũng đúng nhưng nghe thường; văn viết hay dùng carry out / complete) · **a demanding task** · **multitasking**." },
        { w: "technical", pos: "adj", ipa: "/ˈteknɪkl/", vi: "thuộc kỹ thuật; chuyên môn", ex: "Technical subjects prepare students for skilled jobs.", exVi: "Các môn kỹ thuật chuẩn bị cho học sinh những công việc có tay nghề.", more: "**technical skills / support / college** · **technically** (adv) · **technician** (n, kỹ thuật viên)." },
        { w: "technique", pos: "n", ipa: "/tekˈniːk/", vi: "kỹ thuật, phương pháp thực hiện", ex: "Teachers use a range of techniques to keep pupils interested.", exVi: "Giáo viên dùng nhiều kỹ thuật để giữ cho học sinh hứng thú.", more: "**a technique for** + V-ing · **exam / study techniques**. ⚠️ technique = cách làm; **technology** = công nghệ; **technical** = tính từ. Trọng âm tech-NIQUE." },
        { w: "technology", pos: "n", ipa: "/tekˈnɒlədʒi/", vi: "công nghệ", ex: "Technology has transformed the way students do research.", exVi: "Công nghệ đã thay đổi hoàn toàn cách sinh viên làm nghiên cứu.", more: "Nói chung thì **không** mạo từ: ~~The technology has changed our lives~~ → **Technology** has… · **technological** (adj): technological advances · **information technology**." },
        { w: "valid", pos: "adj", ipa: "/ˈvælɪd/", vi: "có giá trị, hợp lệ; xác đáng", ex: "Both sides of the argument make valid points.", exVi: "Cả hai phía của cuộc tranh luận đều đưa ra những điểm xác đáng.", more: "**a valid point / argument / reason** · **validity** (n) · ↔ **invalid** · **validate** (v, xác nhận). An IELTS certificate is **valid for** two years (theo khuyến nghị chung)." },
        { w: "volume", pos: "n", ipa: "/ˈvɒljuːm/", vi: "khối lượng, lượng; âm lượng; tập sách", ex: "The volume of homework has increased in recent years.", exVi: "Lượng bài tập về nhà đã tăng trong những năm gần đây.", more: "**the volume of** traffic / trade / work (thường đi với danh từ **không đếm được** hoặc lượng lớn; đếm từng cái thì dùng the number of) · **a high / large volume**." },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với họ từ sublist 3",
      items: [
        "**Giới từ đi kèm:** contribute **to** · rely **on** · compensate **for** · comment **on** · correspond **to / with** · exclude **from** · an alternative **to** · emphasis **on** (nhưng động từ **emphasise** không có giới từ).",
        "**to là giới từ → + V-ing:** contribute to **reducing**, an alternative to **driving**. Viết ~~contribute to reduce~~ là lỗi GRA rất hay gặp ở band 5–6.",
        "**Số ít – số nhiều lạ:** criterion → **criteria**; emphasis → **emphases**; circumstance thường dùng **circumstances**; funding, consent, compensation **không đếm được**.",
        "**Ba chữ tech-:** technology (n, công nghệ) · technique (n, cách làm) · technical (adj). ~~modern techniques like smartphones~~ → modern **technology**.",
        "**Cặp dễ lẫn:** considerable (đáng kể) ≠ considerate (chu đáo) · ensure (bảo đảm) ≠ insure (bảo hiểm) · immigrate (vào) ≠ emigrate (ra) · alternative (thay thế) ≠ alternate (luân phiên).",
      ],
    },
    {
      t: "quiz",
      id: "t3d2-tv-ho-tu",
      title: "Điền đúng dạng của từ trong ngoặc (12 câu)",
      kind: "fill",
      items: [
        { q: "1. There is a strong ___ (LINK) between poverty and poor exam results.", answers: ["link"] },
        { q: "2. The new timetable made a real ___ (CONTRIBUTE) to pupils' well-being.", answers: ["contribution"] },
        { q: "3. Spending on universities rose ___ (CONSIDERABLE) between 2000 and 2010.", answers: ["considerably"] },
        { q: "4. Each essay is marked against four ___ (CRITERION).", answers: ["criteria"] },
        { q: "5. The government has increased ___ (FUND) for rural schools.", answers: ["funding", "funds"] },
        { q: "6. Our ___ (RELY) on smartphones is growing every year.", answers: ["reliance"] },
        { q: "7. Face-to-face ___ (INTERACT) is important for young children.", answers: ["interaction"] },
        { q: "8. ___ (INITIAL), the scheme was unpopular, but attitudes soon changed.", answers: ["Initially", "initially"] },
        { q: "9. There is no ___ (JUSTIFY) for charging such high fees.", answers: ["justification"] },
        { q: "10. Many villages have ___ (SUFFICIENT) teachers; some classes have sixty pupils. (dạng trái nghĩa)", answers: ["insufficient"] },
        { q: "11. The ___ (REMOVE) of exams would reduce stress for teenagers.", answers: ["removal"] },
        { q: "12. ___ (TECHNOLOGY) advances have changed the way we learn languages.", answers: ["Technological", "technological"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích — điền dạng từ",
      items: [
        "1 a strong + **danh từ**; link vừa là danh từ vừa là động từ. 2 a real + danh từ → contribution. 3 bổ nghĩa cho động từ rose → trạng từ considerably. 4 four + số nhiều → criteria. 5 funding (không đếm được) hoặc funds. 6 Our + danh từ → reliance (**on**). 7 interaction. 8 trạng từ mở câu. 9 no + danh từ → justification (**for**). 10 nghĩa “không đủ” → insufficient. 11 The … of → danh từ removal. 12 trước danh từ advances → tính từ technological.",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Education & society vòng 2 — 20 từ để BÀN LUẬN về giáo dục" },
    {
      t: "p",
      text: "Tập 1 Ngày 3 dạy từ để **kể** về việc học của bạn. Task 2 và Part 3 hỏi về **hệ thống**: ai trả tiền, dạy gì, đánh giá thế nào, ai bị bỏ lại. Hai mươi từ dưới đây là bộ khung của mọi cuộc bàn luận đó.",
    },
    {
      t: "vocab",
      items: [
        { w: "curriculum", pos: "n", ipa: "/kəˈrɪkjələm/", vi: "chương trình học (toàn bộ các môn)", ex: "Financial skills should be part of the school curriculum.", exVi: "Kỹ năng tài chính nên là một phần của chương trình học phổ thông.", more: "Số nhiều: **curricula** / curriculums · **the national curriculum** · **on the curriculum**. Một môn cụ thể có **syllabus** (đề cương)." },
        { w: "tuition fees", pos: "n (số nhiều)", ipa: "/tjuˈɪʃn fiːz/", vi: "học phí", ex: "Rising tuition fees put many students off university.", exVi: "Học phí tăng khiến nhiều học sinh nản lòng với đại học.", more: "**pay / charge / raise tuition fees** · **tuition** một mình = việc giảng dạy: **private tuition** (học thêm với gia sư)." },
        { w: "scholarship", pos: "n", ipa: "/ˈskɒləʃɪp/", vi: "học bổng", ex: "She won a full scholarship to study engineering in Japan.", exVi: "Cô ấy giành học bổng toàn phần để học kỹ thuật ở Nhật.", more: "**win / be awarded a scholarship** · **a scholarship to** + V / nơi học · khác **grant** (trợ cấp, thường theo hoàn cảnh)." },
        { w: "undergraduate", pos: "n, adj", ipa: "/ˌʌndəˈɡrædʒuət/", vi: "sinh viên đại học (chưa có bằng cử nhân)", ex: "Most undergraduates take three or four years to finish their degree.", exVi: "Phần lớn sinh viên đại học mất ba hoặc bốn năm để hoàn thành bằng.", more: "↔ **postgraduate** (học viên sau đại học) · **graduate** /ˈɡrædʒuət/ (n, người đã tốt nghiệp) – /ˈɡrædʒueɪt/ (v): **graduate from** university." },
        { w: "vocational training", pos: "n", ipa: "/vəʊˈkeɪʃənl ˈtreɪnɪŋ/", vi: "đào tạo nghề", ex: "Vocational training gives young people practical skills for work.", exVi: "Đào tạo nghề cho người trẻ kỹ năng thực hành để đi làm.", more: "**vocational courses / colleges / qualifications** ↔ **academic** subjects. Cặp đối lập academic – vocational là trục của rất nhiều đề Task 2." },
        { w: "higher education", pos: "n", ipa: "/ˌhaɪər edʒuˈkeɪʃn/", vi: "giáo dục đại học", ex: "The number of people entering higher education has tripled.", exVi: "Số người vào đại học đã tăng gấp ba.", more: "= **tertiary education** · chuỗi: **primary → secondary → higher / tertiary education** · **enter / go into higher education**." },
        { w: "compulsory", pos: "adj", ipa: "/kəmˈpʌlsəri/", vi: "bắt buộc", ex: "Education is compulsory until the age of fifteen.", exVi: "Giáo dục là bắt buộc cho tới năm mười lăm tuổi.", more: "**compulsory education / subjects** = mandatory, obligatory ↔ **optional, voluntary**. **make** sth **compulsory**." },
        { w: "literacy", pos: "n", ipa: "/ˈlɪtərəsi/", vi: "khả năng đọc viết", ex: "The adult literacy rate rose from 70% to 95%.", exVi: "Tỉ lệ người lớn biết chữ tăng từ 70% lên 95%.", more: "**literacy rate** · đi cặp với **numeracy** (khả năng tính toán) · **literate** ↔ **illiterate** · **digital / financial literacy** (hiểu biết về số / tài chính)." },
        { w: "assessment", pos: "n", ipa: "/əˈsesmənt/", vi: "sự đánh giá (kết quả học tập)", ex: "Continuous assessment is fairer than a single final exam.", exVi: "Đánh giá thường xuyên công bằng hơn một kỳ thi cuối duy nhất.", more: "**continuous assessment** ↔ **final exam** · **assess** (v) — AWL sublist 1 · **self-assessment** (tự đánh giá — bài viết hôm nay)." },
        { w: "coursework", pos: "n", ipa: "/ˈkɔːswɜːk/", vi: "bài làm trong khoá (tính điểm)", ex: "Half of the final mark comes from coursework.", exVi: "Một nửa điểm cuối cùng đến từ bài làm trong khoá.", more: "Không đếm được: ~~courseworks~~. Liên quan: **assignment** (bài được giao, đếm được) · **dissertation / thesis** (luận văn)." },
        { w: "qualification", pos: "n", ipa: "/ˌkwɒlɪfɪˈkeɪʃn/", vi: "bằng cấp, chứng chỉ", ex: "Employers increasingly look for skills rather than qualifications.", exVi: "Nhà tuyển dụng ngày càng tìm kỹ năng hơn là bằng cấp.", more: "**gain / hold a qualification** · **academic / professional qualifications** · **qualified** (adj) ↔ **unqualified** · **be qualified to** + V." },
        { w: "dropout rate", pos: "n", ipa: "/ˈdrɒpaʊt reɪt/", vi: "tỉ lệ bỏ học", ex: "The dropout rate is highest among students who work part-time.", exVi: "Tỉ lệ bỏ học cao nhất ở nhóm sinh viên đi làm thêm.", more: "**drop out (of school / university)** (v) · **a dropout** (n, người bỏ học). Liên quan: **truancy** (trốn học), **attendance** (sự chuyên cần)." },
        { w: "rote learning", pos: "n", ipa: "/ˈrəʊt lɜːnɪŋ/", vi: "học vẹt, học thuộc lòng máy móc", ex: "Rote learning helps with facts but not with problem-solving.", exVi: "Học vẹt giúp nhớ dữ kiện nhưng không giúp giải quyết vấn đề.", more: "**learn by rote / by heart** · **memorise** (v) · đối lập với **critical thinking** và **learning by doing**." },
        { w: "critical thinking", pos: "n", ipa: "/ˌkrɪtɪkl ˈθɪŋkɪŋ/", vi: "tư duy phản biện", ex: "Universities expect students to develop critical thinking.", exVi: "Đại học kỳ vọng sinh viên phát triển tư duy phản biện.", more: "**develop / encourage critical thinking** · **think critically** · đi cùng: **problem-solving skills**, **creativity**, **independent learning**." },
        { w: "extracurricular activities", pos: "n (số nhiều)", ipa: "/ˌekstrəkəˈrɪkjələ(r) ækˈtɪvətiz/", vi: "hoạt động ngoại khoá", ex: "Extracurricular activities teach teamwork and leadership.", exVi: "Hoạt động ngoại khoá dạy làm việc nhóm và khả năng lãnh đạo.", more: "**take part in extracurricular activities** · ví dụ: clubs, sports teams, volunteering, debating." },
        { w: "peer pressure", pos: "n", ipa: "/ˈpɪə preʃə(r)/", vi: "áp lực từ bạn bè đồng trang lứa", ex: "Teenagers often take up smoking because of peer pressure.", exVi: "Thiếu niên thường bắt đầu hút thuốc vì áp lực từ bạn bè.", more: "**peer** (n, người cùng trang lứa): **learn from their peers** · **peer review / assessment** (bạn chấm bài cho nhau)." },
        { w: "discipline", pos: "n", ipa: "/ˈdɪsəplɪn/", vi: "kỷ luật; ngành học", ex: "Strict discipline does not always lead to better behaviour.", exVi: "Kỷ luật nghiêm không phải lúc nào cũng dẫn tới hành vi tốt hơn.", more: "**self-discipline** · **maintain discipline** · nghĩa 2: **an academic discipline** (một ngành học). Reading hay dùng nghĩa 2." },
        { w: "distance learning", pos: "n", ipa: "/ˌdɪstəns ˈlɜːnɪŋ/", vi: "học từ xa", ex: "Distance learning allows adults to study while working full-time.", exVi: "Học từ xa cho phép người lớn vừa học vừa làm toàn thời gian.", more: "= **online / remote learning** · **blended learning** (kết hợp trực tuyến và trên lớp) · **lifelong learning** (học suốt đời)." },
        { w: "gap year", pos: "n", ipa: "/ˈɡæp jɪə(r)/", vi: "năm nghỉ giữa phổ thông và đại học", ex: "Many students take a gap year to travel or gain work experience.", exVi: "Nhiều học sinh nghỉ một năm để đi du lịch hoặc lấy kinh nghiệm làm việc.", more: "**take a gap year** · đi kèm: **gain work experience**, **do voluntary work**, **become more independent**." },
        { w: "plagiarism", pos: "n", ipa: "/ˈpleɪdʒərɪzəm/", vi: "đạo văn", ex: "Copying a model essay word for word is plagiarism.", exVi: "Chép nguyên văn một bài mẫu là đạo văn.", more: "**plagiarise** (v) · **commit plagiarism**. Trong IELTS, bài học thuộc bị nhận ra và **không được tính** — xem mục “tái tạo bài mẫu” ở bài Viết." },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. 20 cụm ăn điểm (collocation) cho Task 2 và Part 3" },
    {
      t: "p",
      text: "**Collocation** = các từ người bản xứ quen dùng cùng nhau. Người Việt hay nói ~~learn knowledge~~, ~~join an exam~~, ~~make homework~~. Bộ tiêu chí Lexical Resource từ band 7 nhắc thẳng tới collocation (band 6 thì “thử dùng từ ít gặp”), nên học từ theo **cụm** là cách lên điểm nhanh nhất.",
    },
    {
      t: "vocab",
      items: [
        { w: "acquire knowledge / skills", pos: "cụm v", ipa: "/əˈkwaɪə(r) ˈnɒlɪdʒ/", vi: "tiếp thu kiến thức / kỹ năng", ex: "Children acquire language skills faster than adults.", exVi: "Trẻ em tiếp thu kỹ năng ngôn ngữ nhanh hơn người lớn.", more: "⚠️ ~~learn knowledge~~ → **acquire / gain knowledge**. knowledge không đếm được: ~~knowledges~~, ~~a knowledge~~ (trừ a good knowledge of)." },
        { w: "broaden one's horizons", pos: "cụm v", ipa: "/ˈbrɔːdn wʌnz həˈraɪznz/", vi: "mở rộng tầm nhìn", ex: "Studying abroad broadens students' horizons.", exVi: "Du học mở rộng tầm nhìn của sinh viên.", more: "= **broaden / widen one's outlook** · **broaden one's knowledge of**." },
        { w: "sit / take an exam", pos: "cụm v", ipa: "/sɪt ən ɪɡˈzæm/", vi: "dự thi", ex: "Pupils sit national exams at the age of fifteen.", exVi: "Học sinh dự kỳ thi quốc gia năm mười lăm tuổi.", more: "⚠️ ~~join / attend an exam~~ (do an exam là văn nói Anh-Anh, bài viết nên dùng sit / take). **pass** = đỗ (~~pass the exam~~ không có nghĩa là “đi thi”) · **fail** · **resit / retake** (thi lại) · **revise for** an exam." },
        { w: "meet a deadline", pos: "cụm v", ipa: "/miːt ə ˈdedlaɪn/", vi: "kịp hạn chót", ex: "University teaches students to meet deadlines without reminders.", exVi: "Đại học dạy sinh viên kịp hạn chót mà không cần ai nhắc.", more: "↔ **miss a deadline** · **a tight deadline** · **set / extend a deadline**." },
        { w: "fall behind", pos: "cụm v", ipa: "/fɔːl bɪˈhaɪnd/", vi: "tụt lại phía sau", ex: "Pupils who miss lessons quickly fall behind.", exVi: "Học sinh nghỉ học sẽ nhanh chóng tụt lại.", more: "**fall behind with** schoolwork · ↔ **keep up with** (theo kịp) · **catch up** (đuổi kịp)." },
        { w: "enrol on / in a course", pos: "cụm v", ipa: "/ɪnˈrəʊl/", vi: "ghi danh một khoá học", ex: "More adults are enrolling on evening courses.", exVi: "Ngày càng nhiều người lớn ghi danh các khoá buổi tối.", more: "Anh: **enrol on**; Mỹ: **enroll in** · **enrolment** (n) · gần nghĩa: sign up for, register for." },
        { w: "pursue a degree / career", pos: "cụm v", ipa: "/pəˈsjuː/", vi: "theo đuổi tấm bằng / sự nghiệp", ex: "She moved to the city to pursue a degree in medicine.", exVi: "Cô ấy chuyển lên thành phố để theo đuổi tấm bằng y khoa.", more: "**pursue higher education / one's interests** · **pursuit** (n). Trang trọng hơn follow." },
        { w: "hands-on experience", pos: "cụm n", ipa: "/ˌhændz ˈɒn ɪkˈspɪəriəns/", vi: "kinh nghiệm thực hành trực tiếp", ex: "Internships give students hands-on experience of real work.", exVi: "Thực tập cho sinh viên kinh nghiệm thực hành về công việc thật.", more: "= **practical experience** · **gain / provide hands-on experience** · **learning by doing**." },
        { w: "put theory into practice", pos: "cụm v", ipa: "/pʊt ˈθɪəri ˈɪntə ˈpræktɪs/", vi: "đưa lý thuyết vào thực hành", ex: "Laboratory classes let students put theory into practice.", exVi: "Giờ thí nghiệm cho sinh viên đưa lý thuyết vào thực hành.", more: "**theoretical knowledge** ↔ **practical skills** · **in theory… in practice…** (về lý thuyết… trên thực tế…)." },
        { w: "a well-rounded education", pos: "cụm n", ipa: "/ˌwel ˈraʊndɪd/", vi: "nền giáo dục toàn diện", ex: "Art and music are part of a well-rounded education.", exVi: "Mỹ thuật và âm nhạc là một phần của nền giáo dục toàn diện.", more: "**a well-rounded person / student** · gần nghĩa: **a broad / balanced education**." },
        { w: "equal access to education", pos: "cụm n", ipa: "/ˌiːkwəl ˈækses/", vi: "quyền tiếp cận giáo dục bình đẳng", ex: "Scholarships give poorer students equal access to education.", exVi: "Học bổng cho sinh viên nghèo hơn quyền tiếp cận giáo dục bình đẳng.", more: "**have access to** (⚠️ ~~access to~~ làm động từ: access sth, không có to) · **equal opportunities** · **educational inequality**." },
        { w: "bridge the gap", pos: "cụm v", ipa: "/brɪdʒ ðə ɡæp/", vi: "thu hẹp khoảng cách", ex: "Free tutoring helps to bridge the gap between rich and poor pupils.", exVi: "Dạy kèm miễn phí giúp thu hẹp khoảng cách giữa học sinh giàu và nghèo.", more: "**bridge / narrow / close the gap between A and B** ↔ **widen the gap** · **the attainment gap** (khoảng cách thành tích)." },
        { w: "tailor … to individual needs", pos: "cụm v", ipa: "/ˈteɪlə(r)/", vi: "điều chỉnh … theo nhu cầu từng người", ex: "Small classes allow teachers to tailor lessons to individual needs.", exVi: "Lớp ít người cho phép giáo viên điều chỉnh bài học theo nhu cầu từng em.", more: "**tailor sth to / for** · **tailor-made** (adj) · **individual attention** (sự quan tâm tới từng em)." },
        { w: "a heavy workload", pos: "cụm n", ipa: "/ˌhevi ˈwɜːkləʊd/", vi: "khối lượng công việc / bài vở nặng", ex: "A heavy workload leaves students little time to relax.", exVi: "Bài vở nặng khiến học sinh còn ít thời gian thư giãn.", more: "**cope with / reduce the workload** · **academic pressure** · **be under pressure to** + V." },
        { w: "job prospects", pos: "cụm n", ipa: "/ˈdʒɒb prɒspekts/", vi: "triển vọng việc làm", ex: "A degree in computing improves graduates' job prospects.", exVi: "Tấm bằng ngành máy tính cải thiện triển vọng việc làm của người tốt nghiệp.", more: "**improve / damage job prospects** · **career prospects** · **employability** (n, khả năng được tuyển) · **the job market**." },
        { w: "gain a qualification", pos: "cụm v", ipa: "/ɡeɪn/", vi: "đạt được bằng cấp", ex: "Adults return to college to gain new qualifications.", exVi: "Người lớn quay lại trường để lấy thêm bằng cấp mới.", more: "**gain / obtain / acquire a qualification** · **gain experience / confidence / independence** — gain đi được với rất nhiều danh từ trừu tượng." },
        { w: "foster creativity", pos: "cụm v", ipa: "/ˈfɒstə(r) ˌkriːeɪˈtɪvəti/", vi: "nuôi dưỡng sự sáng tạo", ex: "Project work fosters creativity and independence.", exVi: "Làm dự án nuôi dưỡng sự sáng tạo và tính tự lập.", more: "**foster / encourage / stifle creativity** (stifle = bóp nghẹt) · **foster a love of reading**." },
        { w: "academic performance", pos: "cụm n", ipa: "/ˌækəˈdemɪk pəˈfɔːməns/", vi: "kết quả học tập", ex: "Regular exercise is linked to better academic performance.", exVi: "Tập thể dục đều đặn có liên hệ với kết quả học tập tốt hơn.", more: "**improve / affect academic performance** = academic achievement / results · **perform well / badly at school**." },
        { w: "a sense of responsibility", pos: "cụm n", ipa: "/sens əv rɪˌspɒnsəˈbɪləti/", vi: "tinh thần trách nhiệm", ex: "Part-time work gives teenagers a sense of responsibility.", exVi: "Việc làm thêm cho thiếu niên tinh thần trách nhiệm.", more: "**develop / give sb a sense of** responsibility / achievement / belonging." },
        { w: "be equipped with", pos: "cụm v", ipa: "/ɪˈkwɪpt wɪð/", vi: "được trang bị (kỹ năng, kiến thức)", ex: "School leavers should be equipped with basic financial skills.", exVi: "Học sinh ra trường nên được trang bị kỹ năng tài chính cơ bản.", more: "**equip sb with** sth · **equip sb for** adult life / the job market · **school leavers** (học sinh vừa ra trường)." },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Từ band 5 → từ band 6 — cùng một ý",
      caption: "Không phải từ “khó” là hơn. Từ band 6 CHÍNH XÁC hơn và đi đúng cụm.",
      cols: [
        {
          title: "Band 5 — đúng nghĩa nhưng lặp, chung chung",
          items: [
            "learn knowledge",
            "study in university",
            "the money to study",
            "learn by remember",
            "practical learning",
            "good for finding a job",
            "students have too much homework",
            "school subjects",
          ],
        },
        {
          title: "Band 6 — chính xác, đúng collocation",
          items: [
            "**acquire** knowledge",
            "**pursue a degree** / enter **higher education**",
            "**tuition fees**",
            "**rote learning** / learn **by heart**",
            "**hands-on experience** / **vocational training**",
            "improve their **job prospects**",
            "students have **a heavy workload**",
            "the **curriculum** / **core subjects**",
          ],
        },
      ],
    },
    {
      t: "examples",
      items: [
        { en: "A curriculum that places too much emphasis on rote learning does little to foster critical thinking.", vi: "Một chương trình học đặt quá nhiều trọng tâm vào học vẹt thì chẳng giúp gì mấy cho việc nuôi dưỡng tư duy phản biện. — Câu luận điểm Task 2." },
        { en: "Vocational training provides hands-on experience, which considerably improves young people's job prospects.", vi: "Đào tạo nghề đem lại kinh nghiệm thực hành, điều này cải thiện đáng kể triển vọng việc làm của người trẻ. — Câu giải thích (Explain)." },
        { en: "I'd say the main problem is the heavy workload — a lot of my classmates fall behind simply because they can't meet all the deadlines.", vi: "Tôi cho là vấn đề chính là bài vở nặng — nhiều bạn cùng lớp tôi tụt lại đơn giản vì không kịp hết các hạn chót. — Câu trả lời Part 3." },
        { en: "High tuition fees exclude talented students from low-income families, so scholarships are needed to ensure equal access to higher education.", vi: "Học phí cao loại bỏ cơ hội của sinh viên giỏi nhà thu nhập thấp, nên cần học bổng để bảo đảm quyền tiếp cận giáo dục đại học bình đẳng. — Vấn đề → giải pháp." },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Luyện tập" },
    {
      t: "mcq",
      id: "t3d2-tv-colloc",
      title: "Chọn từ đi kèm đúng (collocation) — 8 câu",
      items: [
        { q: "Children ___ knowledge more easily when lessons are fun.", options: ["learn", "acquire", "study", "take"], correct: 1, why: "**acquire / gain knowledge**. learn knowledge là lỗi dịch từ “học kiến thức”." },
        { q: "All students ___ a national exam at the end of Year 12.", options: ["sit", "join", "make", "hold"], correct: 0, why: "**sit / take an exam** = dự thi. join an exam là lỗi dịch từ “tham gia kỳ thi”; hold an exam = tổ chức kỳ thi (việc của nhà trường, không phải học sinh)." },
        { q: "Poor diet ___ to low concentration in class.", options: ["links", "relies", "contributes", "corresponds"], correct: 2, why: "**contribute to** = góp phần gây ra. link cần tân ngữ (link A to B); rely on; correspond to nghĩa là “tương ứng”." },
        { q: "Schools place great ___ on discipline.", options: ["volume", "outcome", "proportion", "emphasis"], correct: 3, why: "**place emphasis on**." },
        { q: "Scholarships help to ___ the gap between rich and poor students.", options: ["bridge", "remove", "fall", "meet"], correct: 0, why: "**bridge / narrow / close the gap**. meet đi với deadline, needs." },
        { q: "Internships give students ___ experience of the workplace.", options: ["hand-in", "hands-on", "hands-up", "handy"], correct: 1, why: "**hands-on experience** = kinh nghiệm thực hành trực tiếp." },
        { q: "Many students ___ on their parents for money.", options: ["contribute", "compensate", "rely", "comment"], correct: 2, why: "**rely on** = dựa vào. comment on = nhận xét về; compensate for; contribute to." },
        { q: "The government ___ a scheme to reduce class sizes.", options: ["published", "registered", "specified", "launched"], correct: 3, why: "**launch / introduce a scheme** = khởi động một chương trình." },
      ],
    },
    {
      t: "mcq",
      id: "t3d2-tv-nghia",
      title: "Chọn từ đúng nghĩa — 6 câu",
      items: [
        { q: "Education that is required by law is ___ education.", options: ["compulsory", "vocational", "higher", "distance"], correct: 0, why: "compulsory = bắt buộc (theo luật)." },
        { q: "All the subjects and content that a school teaches make up its ___.", options: ["coursework", "curriculum", "criteria", "assessment"], correct: 1, why: "curriculum = chương trình học gồm mọi môn. coursework = bài làm tính điểm trong khoá." },
        { q: "Memorising facts without understanding them is called ___ learning.", options: ["distance", "lifelong", "rote", "blended"], correct: 2, why: "rote learning = học vẹt." },
        { q: "“The figure **remained constant**.” = The figure ___.", options: ["rose slightly", "fell sharply", "went up and down", "stayed the same"], correct: 3, why: "constant = không đổi → remained constant = stayed the same (Task 1)." },
        { q: "“**A small minority of** students failed.” = ___ students failed.", options: ["Very few", "Most", "About half of the", "A growing number of"], correct: 0, why: "a small minority of = một phần rất nhỏ ↔ the vast majority of." },
        { q: "A result that comes at the end of a process is an ___.", options: ["instance", "outcome", "alternative", "emphasis"], correct: 1, why: "outcome = kết quả sau một quá trình (learning outcomes)." },
      ],
    },
    {
      t: "quiz",
      id: "t3d2-tv-dich",
      title: "Dịch sang tiếng Anh — dùng từ vựng hôm nay (5 câu)",
      kind: "translate",
      grammar: "Dùng đúng collocation: place emphasis on · contribute to + V-ing / N · acquire skills · have access to · rely on",
      items: [
        { q: "Nhà trường đặt quá nhiều trọng tâm vào điểm thi.", answers: ["Schools place too much emphasis on exam results.", "Schools put too much emphasis on exam results.", "Schools place too much emphasis on exam scores.", "Schools put too much emphasis on exam scores.", "Schools place too much emphasis on test results.", "Schools place too much emphasis on exam grades."], hint: "place too much emphasis on · exam results" },
        { q: "Đào tạo nghề cải thiện triển vọng việc làm của người trẻ.", answers: ["Vocational training improves young people's job prospects.", "Vocational training improves the job prospects of young people.", "Vocational training improves job prospects for young people."], hint: "vocational training · job prospects" },
        { q: "Học phí cao góp phần làm tăng tỉ lệ bỏ học.", answers: ["High tuition fees contribute to a higher dropout rate.", "High tuition fees contribute to a rise in the dropout rate.", "High tuition fees contribute to an increase in the dropout rate.", "High tuition fees contribute to higher dropout rates.", "High tuition fees contribute to increasing the dropout rate.", "High tuition fees contribute to the rising dropout rate."], hint: "contribute to + N / V-ing · dropout rate" },
        { q: "Mọi trẻ em nên được tiếp cận giáo dục một cách bình đẳng.", answers: ["Every child should have equal access to education.", "All children should have equal access to education."], hint: "have equal access to" },
        { q: "Sinh viên cần tiếp thu kỹ năng thực hành, không chỉ kiến thức lý thuyết.", answers: ["Students need to acquire practical skills, not just theoretical knowledge.", "Students need to acquire practical skills, not only theoretical knowledge.", "Students need to gain practical skills, not just theoretical knowledge.", "Students need to acquire practical skills rather than just theoretical knowledge.", "Students need to acquire practical skills, not just theory."], hint: "acquire practical skills · theoretical knowledge" },
      ],
    },
    {
      t: "note",
      title: "Mẹo: 5 câu của riêng bạn",
      items: [
        "Viết **5 câu thật về việc học của bạn**, mỗi câu dùng 2 từ hôm nay. Ví dụ: My university places a lot of emphasis on coursework, so I have a heavy workload every week.",
        "Chép 5 câu đó vào **sổ Speaking** (lập ở bài 3). Từ đã gắn với chuyện thật của bạn thì nhớ lâu gấp nhiều lần từ học trong danh sách.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Viết ─────────────────────────── */

const T3D2_WRITING: Lesson = {
  id: "t3d2-viet",
  kind: "writing",
  title: "Viết: Band 6 trông thế nào — tự chấm theo descriptors, sổ lỗi, viết lại",
  goal: "Đọc được bộ tiêu chí chấm Writing và nói rõ một bài band 5 khác một bài band 6 ở đâu theo TR · CC · LR · GRA; tự chấm bài của mình bằng bảng 12 câu hỏi, ghi lỗi vào sổ lỗi theo mã, và viết lại một bài qua 3 phiên bản có lý do sửa — quy trình bạn sẽ lặp lại với mọi bài viết từ nay tới cuối Tập 3.",
  minutes: 110,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy tiêu chí nào",
      items: [
        "Tập 2 Ngày 2 đã cho bạn thấy **band 5 trông thế nào**. Hôm nay đặt **band 5 cạnh band 6** trên cùng một đề để thấy chính xác **bốn chỗ** phải đổi.",
        "Band 5 → 6 không cần từ khó hơn. Cần: **trả lời đủ mọi vế của đề**, **quan điểm rõ từ đầu đến cuối**, **mỗi đoạn một ý được giải thích**, và **lỗi không còn cản người đọc hiểu**.",
        "Ba công cụ dùng suốt Tập 3: ==bảng tự chấm 12 câu== · ==sổ lỗi theo mã== · ==viết lại 3 phiên bản== (nối Tập 2 Ngày 24, mục “một đoạn qua 3 phiên bản”).",
        "Học từ bài mẫu đúng cách: **tái tạo** chứ không học thuộc (nối Tập 2 Ngày 6 và Ngày 10).",
        "Cuối bài: lịch tự học một tuần và cách **đo tiến độ** để biết mình có đang lên band hay không.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Giám khảo chấm gì? — bốn tiêu chí, band 5 và band 6" },
    {
      t: "p",
      text: "Mỗi bài Writing được chấm theo **bốn tiêu chí**, mỗi tiêu chí chiếm **25 %** điểm bài đó. Task 2 nặng gấp đôi Task 1. Bảng dưới tóm tắt từ **band descriptors công khai** của IELTS — đọc cột band 6 như một danh sách việc phải làm.",
    },
    {
      t: "table",
      caption: "Task 2 — band 5 và band 6 theo bốn tiêu chí (tóm tắt từ band descriptors công khai)",
      head: ["Tiêu chí", "Band 5", "Band 6 (đích Tập 3)", "Việc phải làm để lên 6"],
      rows: [
        ["**TR — Task Response** (trả lời đề)", "Trả lời đề **chỉ một phần**; có quan điểm nhưng **không rõ suốt bài**; ý chính ít, chưa phát triển, có chỗ lạc đề", "Trả lời **đủ mọi phần** của đề (dù phần kỹ phần sơ); **quan điểm rõ**, dù kết luận có thể còn lặp; ý chính liên quan, có giải thích", "Đếm vế đề trước khi viết · thesis nêu rõ lập trường · mỗi ý chính có **vì sao** + **ví dụ**"],
        ["**CC — Coherence & Cohesion** (mạch lạc, liên kết)", "Có tổ chức nhưng **thiếu tiến triển**; từ nối **thiếu, thừa hoặc sai**; lặp từ vì không biết thay thế; chia đoạn chưa hợp lý", "Sắp xếp **logic, có tiến triển rõ**; dùng từ nối hiệu quả dù đôi chỗ máy móc; có dùng đại từ thay thế nhưng chưa luôn rõ; **có chia đoạn**, dù chưa phải lúc nào cũng hợp lý", "Mỗi thân bài mở bằng câu chủ đề, **một đoạn một ý** (descriptors ghi “ý trung tâm mỗi đoạn” ở band 7 — làm được thì band 6 càng chắc) · bớt Firstly / Moreover đầu mọi câu · dùng this / these / such để nối"],
        ["**LR — Lexical Resource** (từ vựng)", "Vốn từ **hạn chế**, vừa đủ cho đề; lỗi chính tả / dạng từ **gây khó hiểu**", "Vốn từ **đủ rộng**; **thử dùng từ ít gặp** dù còn sai; lỗi chính tả / dạng từ **không cản hiểu**", "Dùng từ chủ đề theo cụm (collocation) · không lặp một từ quá 3 lần · soát dạng từ"],
        ["**GRA — Grammatical Range & Accuracy** (ngữ pháp)", "Cấu trúc **hạn chế**; thử câu phức nhưng **sai nhiều hơn câu đơn**; lỗi thường xuyên, có thể gây khó hiểu", "**Trộn câu đơn và câu phức**; có lỗi ngữ pháp, dấu câu nhưng **hiếm khi làm sai nghĩa**", "Mỗi đoạn 1–2 câu phức chắc tay (because, which, if, whereas) · soát -s, mạo từ, thì"],
      ],
    },
    {
      t: "table",
      caption: "Task 1 — khác biệt lớn nhất nằm ở Task Achievement (học kỹ ở Ngày 4)",
      head: ["", "Band 5", "Band 6"],
      rows: [
        ["**Overview** (câu tổng quan)", "Kể số liệu máy móc, **không có overview rõ**", "Có **overview rõ** nêu xu hướng / điểm nổi bật chính"],
        ["**Chọn và so sánh số liệu**", "Liệt kê từng con số; có số sai hoặc thiếu", "**Chọn** số liệu tiêu biểu và **so sánh** ở chỗ cần so"],
      ],
    },
    {
      t: "note",
      title: "Ba điều kéo bài xuống dưới band 6 dù tiếng Anh tốt",
      items: [
        "**Thiếu từ**: dưới 250 từ (Task 2) hoặc 150 từ (Task 1) thì khó phát triển đủ ý → TR tụt.",
        "**Bài học thuộc**: giám khảo nhận ra đoạn văn mẫu thuộc lòng; phần đó **không được tính**.",
        "**Bỏ sót một vế đề**: đề hỏi hai việc mà chỉ trả lời một → TR tối đa band 5, dù ngữ pháp hoàn hảo.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Đọc đề: đếm vế trước khi viết" },
    {
      t: "p",
      text: "Đề hôm nay (tự soạn): **Some people believe that secondary schools should teach practical skills such as managing money and cooking, rather than spending so much time on academic subjects. To what extent do you agree or disagree?** — Viết ít nhất 250 từ.",
    },
    {
      t: "table",
      caption: "Đếm vế đề — ôn từ Tập 2 Ngày 2 (mục 2b), bản band 6",
      head: ["Vế", "Chữ trong đề", "Bài phải làm gì"],
      rows: [
        ["① Nội dung nên dạy", "should teach **practical skills** such as managing money and cooking", "Nói có nên dạy kỹ năng thực hành không, **vì sao**. Ví dụ không bắt buộc phải là tiền và nấu ăn (such as = ví dụ)."],
        ["② Cái bị thay thế", "**rather than** spending **so much** time on **academic subjects**", "Phải nói tới **môn học thuật**: có nên bớt không? Bỏ vế này là trả lời một phần → band 5."],
        ["③ Phạm vi", "**secondary** schools", "Chỉ bàn bậc phổ thông trung học; ví dụ về đại học chỉ dùng làm **hệ quả**."],
        ["④ Câu lệnh", "**To what extent** do you agree or disagree?", "Nêu **mức độ** đồng ý: hoàn toàn / một phần / không. Lập trường phải có ở mở bài và giữ tới kết bài."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi đọc đề này",
      items: [
        "Chỉ viết “kỹ năng thực hành có ích” (vế ①) mà quên **rather than** (vế ②). Chữ rather than biến đề thành **chọn A thay cho B**, không phải “A có tốt không”.",
        "Mở bài “I agree”, thân bài 2 lại viết “academic subjects are also important”, kết bài “both are important” → **lập trường đổi giữa chừng**. Nếu bạn nghĩ cả hai đều cần, hãy nói **ngay từ mở bài**: I partly agree.",
        "Bỏ qua **so much**: đề không nói bỏ hẳn môn học thuật mà nói dành **quá nhiều** thời gian. Lập trường tinh tế hơn: thêm kỹ năng thực hành nhưng giữ lõi học thuật.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Hai bài mẫu cùng đề — band 5 và band 6 đặt cạnh nhau" },
    {
      t: "p",
      text: "Đọc **từng hàng**: mở bài của band 5 rồi mở bài của band 6, và cứ thế. Trước khi xem bảng phân tích ở mục 4, hãy tự gạch trong bài band 5 những chỗ bạn nghĩ làm mất điểm. Band ghi là **ước tính** theo descriptors, không phải điểm chấm chính thức.",
    },
    {
      t: "table",
      caption: "Cùng một đề — bài band 5 (256 từ) và bài band 6 (286 từ)",
      head: ["Đoạn", "Band 5 (ước tính)", "Band 6 (ước tính)"],
      rows: [
        [
          "**Mở bài**",
          "Nowadays, education is very important for everyone in the world. In my country, students study many subjects at school. Some people think that school should teach practical skill like manage money and cooking instead of academic subjects. I agree with this opinion.",
          "It is often argued that secondary schools spend too much time on academic subjects and should instead teach everyday skills such as managing money and cooking. I partly agree: these skills deserve a place in the curriculum, but they should be added to academic subjects rather than replace them.",
        ],
        [
          "**Thân bài 1**",
          "Firstly, practical skills is very useful in the life. For example, many young people don't know how to manage their money. They spend all money and they have no money in the end of month. Moreover, cooking is important too because everyone need to eat every day. If students can cook, they will be more healthy and they will not eat fast food. Furthermore, when they live alone in the university they can cook by themself and save a lot of money.",
          "On the one hand, there are good reasons to teach practical skills at school. Many teenagers leave school without knowing how to plan a budget or prepare a simple meal, because their parents are too busy to teach them. As a result, when they move away to university, they often waste money on fast food and get into debts. A friend of mine, for instance, spent his whole monthly allowance in two weeks during his first term, simply because nobody had ever shown him how to plan his spending. A weekly lesson on these skills would help young people to become independent more quick.",
        ],
        [
          "**Thân bài 2**",
          "Secondly, academic subjects are sometimes boring and not useful. Many students learn maths and history but they forget everything after the exam. Besides, some subjects are too difficult and students feel stress. Also, they have many homeworks and they don't have time to relax or play sport. However, academic subjects are also important because students need them to pass the exam and go to university. In addition, they need knowledge to get a good job. So I think school should teach both of them.",
          "On the other hand, I do not believe that these lessons should take the place of academic subjects. Subjects such as maths, science and literature develop critical thinking, and they are also required for higher education and for the most of skilled jobs. If schools reduced them considerably, students would have fewer choices later in life. Moreover, cooking or budgeting can be learned in a few months at any age, whereas it is much more difficult to catch up on several years of maths.",
        ],
        [
          "**Kết bài**",
          "In conclusion, practical skills and academic subjects are both important for students. School should teach practical skills and academic subjects for students. I think it is good for the students in the future and they can have a better life. Therefore, the government should think about this problem.",
          "In conclusion, I agree that practical skills should be taught, but only as a small, compulsory part of the timetable. In my view, the best curriculum is one that keeps a strong academic core and uses one or two hours a week to prepare students for the daily life.",
        ],
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Khác nhau ở đâu? — chấm hai bài theo bốn tiêu chí" },
    {
      t: "table",
      caption: "Bảng phân tích — vì sao bài thứ hai cao hơn một band",
      head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
      rows: [
        ["**TR**", "Mở bài nói **I agree**; thân bài 2 đổi ý giữa đoạn (“However, academic subjects are also important”); kết bài thành **both are important** → lập trường **không nhất quán**. Vế ② (rather than) chỉ được nhắc lướt. Ý được **liệt kê** (tiền, nấu ăn, khoẻ, tiết kiệm) chứ không phát triển.", "Lập trường **I partly agree** nêu ở mở bài, mỗi thân bài chứng minh **một nửa** của nó, kết bài nhắc lại đúng lập trường đó. Cả hai vế đề đều có một đoạn riêng. Mỗi đoạn một ý, có **vì sao** và **ví dụ**. (Thân bài 2 phát triển chưa sâu bằng thân bài 1 — đó là mức band 6.)"],
        ["**CC**", "Đủ 4 đoạn, nhưng gần như câu nào cũng mở bằng một từ nối: **Firstly, For example, Moreover, Furthermore, Secondly, Besides, Also, However, In addition, So, In conclusion, Therefore** — 12 từ nối đầu câu cho 21 câu, nhiều chỗ chỉ là “thêm ý nữa”. Thân bài 2 chứa hai ý ngược nhau. Lặp students / school / practical skills vì không dùng đại từ.", "Khung **On the one hand / On the other hand** cho thấy bố cục. Liên kết bằng nghĩa: **As a result, for instance, whereas**; thay thế bằng **these skills, these lessons, them**. Mỗi đoạn một ý trung tâm. (Vẫn hơi máy móc: On the one hand… On the other hand… Moreover… In conclusion.)"],
        ["**LR**", "Từ cơ bản, lặp: important ×4, students ×8, money ×5. Sai dạng từ / cụm: ~~practical skill~~, ~~manage money~~ (sau like phải V-ing), ~~feel stress~~, ~~many homeworks~~, ~~by themself~~. Không có từ chủ đề.", "Từ chủ đề đúng cụm: **curriculum, plan a budget, monthly allowance, critical thinking, higher education, skilled jobs, academic core, compulsory**. Có thử cụm ít gặp (**deserve a place in, take the place of, catch up on**). Lỗi nhỏ còn sót: ~~get into debts~~ (debt), ~~more quick~~ (quickly)."],
        ["**GRA**", "Gần như toàn câu đơn nối bằng and / but / because. Lỗi **thường xuyên**: ~~skills is~~, ~~everyone need~~, ~~in the life~~, ~~all money~~, ~~in the end of month~~, ~~more healthy~~, ~~in the university~~. Câu điều kiện loại 1 đúng là điểm sáng duy nhất.", "Trộn câu đơn với câu phức: mệnh đề **because**, **when**, **whereas**, mệnh đề quan hệ (**one that keeps…**), điều kiện loại 2 (**If schools reduced…, students would have…**), quá khứ hoàn thành (**nobody had ever shown him**). Lỗi còn sót không làm sai nghĩa: ~~the most of skilled jobs~~, ~~the daily life~~."],
      ],
    },
    {
      t: "note",
      title: "Điều rút ra — band 6 KHÔNG phải bài hoàn hảo",
      items: [
        "Bài band 6 vẫn có **5 lỗi** (debts, more quick, the most of, the daily life, và bố cục hơi máy móc). Band 6 cho phép lỗi, miễn là **hiếm khi làm sai nghĩa**. Đừng sợ sai đến mức chỉ dám viết câu đơn.",
        "Chênh lệch lớn nhất nằm ở **TR**: lập trường nhất quán và ý được phát triển. Đây cũng là thứ **dễ sửa nhất** — chỉ cần 5 phút lập dàn ý.",
        "Bài band 6 chỉ dài hơn 30 từ nhưng **ít ý hơn**: 2 ý chính được giải thích kỹ, thay vì 6 ý liệt kê. Ít ý, sâu hơn.",
      ],
    },
    {
      t: "mcq",
      id: "t3d2-viet-tieu-chi",
      title: "Lỗi này làm mất điểm ở tiêu chí nào? (6 câu)",
      items: [
        { q: "Mở bài viết “I completely agree”, kết bài viết “both views are reasonable”.", options: ["TR — Task Response", "CC — Coherence & Cohesion", "LR — Lexical Resource", "GRA — Grammar"], correct: 0, why: "Lập trường không nhất quán → **TR**. Band 6 đòi quan điểm rõ; đổi ý ở kết bài kéo TR về band 5." },
        { q: "Mỗi câu trong thân bài mở bằng Firstly / Moreover / Furthermore / Besides / In addition.", options: ["TR — Task Response", "CC — Coherence & Cohesion", "LR — Lexical Resource", "GRA — Grammar"], correct: 1, why: "Lạm dụng từ nối → **CC**. Descriptors band 5 ghi rõ từ nối “thiếu, thừa hoặc sai”." },
        { q: "Viết “learn knowledge”, “join an exam”, “feel stress” và lặp “important” sáu lần.", options: ["TR — Task Response", "CC — Coherence & Cohesion", "LR — Lexical Resource", "GRA — Grammar"], correct: 2, why: "Sai collocation và lặp từ → **LR**." },
        { q: "Viết “Practical skills is useful because everyone need it in the life.”", options: ["TR — Task Response", "CC — Coherence & Cohesion", "LR — Lexical Resource", "GRA — Grammar"], correct: 3, why: "Sai hoà hợp chủ – vị (skills is, everyone need), đại từ (it → them), mạo từ (in the life) → **GRA**." },
        { q: "Đề hỏi “rather than academic subjects” nhưng cả bài chỉ nói kỹ năng thực hành có ích thế nào.", options: ["TR — Task Response", "CC — Coherence & Cohesion", "LR — Lexical Resource", "GRA — Grammar"], correct: 0, why: "Bỏ sót một vế đề → **TR** (trả lời đề chỉ một phần = band 5)." },
        { q: "Một thân bài chứa hai ý ngược nhau: môn học thuật nhàm chán, rồi lại “however, they are important”.", options: ["TR — Task Response", "CC — Coherence & Cohesion", "LR — Lexical Resource", "GRA — Grammar"], correct: 1, why: "Một đoạn không có **một ý trung tâm** → **CC** (và kéo theo TR vì lập trường mờ)." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Bảng tự chấm 12 câu hỏi" },
    {
      t: "p",
      text: "Viết xong một bài, **đừng nộp AI chấm ngay**. Tự chấm trước bằng 12 câu hỏi dưới đây, ghi band bạn đoán cho từng tiêu chí, rồi mới so với điểm AI. Sau 5–6 bài, hai con số sẽ gần nhau — lúc đó bạn đã **nhìn bài như giám khảo**.",
    },
    {
      t: "table",
      caption: "12 câu hỏi tự chấm Task 2 — trả lời Có / Chưa. Mỗi tiêu chí (chấm theo band nguyên): 3 Có ≈ band 6 · 2 Có ≈ ranh giới 5–6 · ≤ 1 Có ≈ band 5 trở xuống",
      head: ["Tiêu chí", "Câu hỏi", "Cách kiểm nhanh"],
      rows: [
        ["**TR 1**", "Mọi vế của đề đều có ít nhất 2–3 câu trả lời?", "Đánh số vế trong đề, tìm đoạn tương ứng trong bài"],
        ["**TR 2**", "Lập trường ở mở bài và kết bài **giống nhau**?", "Đọc riêng câu thesis và câu đầu kết bài"],
        ["**TR 3**", "Mỗi ý chính có **vì sao** và **ví dụ cụ thể**?", "Tìm because / as a result / for instance trong mỗi thân bài"],
        ["**CC 1**", "Mỗi thân bài mở bằng một **câu chủ đề** nói đúng ý của đoạn?", "Đọc riêng câu đầu hai thân bài — có ra dàn ý không?"],
        ["**CC 2**", "Số từ nối đầu câu **≤ một nửa** số câu?", "Khoanh mọi từ nối đầu câu, đếm"],
        ["**CC 3**", "Có dùng **this / these / such / they** để nối thay vì lặp danh từ?", "Tìm danh từ lặp ≥ 4 lần"],
        ["**LR 1**", "Có **≥ 5 từ / cụm chủ đề** đúng collocation?", "Gạch chân từ chủ đề"],
        ["**LR 2**", "Không từ nội dung nào lặp quá **3 lần**?", "Đếm important, good, people, problem"],
        ["**LR 3**", "Đã soát **dạng từ** và chính tả?", "Soát đuôi -tion / -ive / -ly và từ dài"],
        ["**GRA 1**", "Mỗi đoạn có **≥ 1 câu phức đúng**?", "Tìm because, which, if, although, whereas"],
        ["**GRA 2**", "Đã soát **-s** (danh từ số nhiều, động từ ngôi ba) và **mạo từ**?", "Một lượt đọc chỉ nhìn danh từ"],
        ["**GRA 3**", "Không có **câu cụt** (Because… đứng một mình) hay câu **lê thê** (3 lần and)?", "Mỗi câu ≤ 2 từ nối mệnh đề"],
      ],
    },
    {
      t: "rule",
      formula: "Viết → tự chấm 12 câu (đoán band từng tiêu chí) → AI chấm → so hai kết quả → ghi sổ lỗi → viết lại",
      vi: "Tự chấm TRƯỚC khi xem điểm AI. Mục tiêu không phải điểm, mà là học cách nhìn bài của chính mình.",
    },

    /* ── 6 ── */
    { t: "h", text: "6. Sổ lỗi theo mã — biến lỗi thành danh sách việc cần sửa" },
    {
      t: "p",
      text: "Tập 2 đã cho bạn danh sách 12 lỗi mất điểm oan (Ngày 24). Ở Tập 3, bạn lập **sổ lỗi của riêng mình**: mỗi lỗi một dòng, gắn **mã** để đếm được. Sau ba bài, mã nào xuất hiện nhiều nhất là thứ bạn cần ôn — không phải thứ sách bảo ôn.",
    },
    {
      t: "table",
      caption: "Tám mã lỗi — đủ cho band 5 → 6",
      head: ["Mã", "Loại lỗi", "Ví dụ → sửa", "Ôn ở đâu"],
      rows: [
        ["**A**", "Mạo từ (a / an / the / Ø)", "~~in the life~~ → in life · ~~the daily life~~ → daily life", "Tập 2 N1 · Tập 3 N3"],
        ["**S**", "Số ít – số nhiều, hoà hợp chủ – vị", "~~skills is~~ → skills are · ~~everyone need~~ → everyone needs", "Tập 2 N23 mục 5 (bảng ôn tổng) · Tập 1 N1, N5"],
        ["**T**", "Thì", "~~I am learning for 5 years~~ → I have been learning", "Tập 3 N1"],
        ["**P**", "Giới từ", "~~in the end of month~~ → at the end of the month", "Tập 2 N3 · Tập 3 N9"],
        ["**W**", "Từ sai, dạng từ, collocation", "~~feel stress~~ → feel stressed · ~~more quick~~ → more quickly", "Bài từ vựng mỗi ngày chẵn"],
        ["**L**", "Từ nối: thừa, sai vai", "~~Moreover~~ dùng cho ý đối lập → However", "Tập 2 N17"],
        ["**C**", "Câu: câu cụt, câu lê thê, dấu câu", "~~Because it is cheap.~~ → gộp vào câu trước", "Tập 2 N24 mục 1b"],
        ["**I**", "Ý: thiếu vì sao / ví dụ, lạc đề, đổi lập trường", "“Cooking is important.” → thêm because… / for instance…", "Hôm nay, mục 4"],
      ],
    },
    {
      t: "table",
      caption: "Mẫu một trang sổ lỗi — chép khung này vào vở hoặc bảng tính",
      head: ["Ngày · bài", "Câu sai", "Mã", "Sửa", "Quy tắc tự viết"],
      rows: [
        ["N2 · practical skills", "practical skills is very useful", "S", "practical skills **are** very useful", "Chủ ngữ số nhiều → are. Nhìn danh từ chính, không nhìn từ đứng gần."],
        ["N2 · practical skills", "like manage money", "W", "like **managing** money", "Sau like / such as (giới từ) → V-ing."],
        ["N2 · practical skills", "I agree … both are important", "I", "I **partly** agree — nói ngay ở mở bài", "Lập trường mở bài = kết bài."],
      ],
    },
    {
      t: "note",
      title: "Mẹo dùng sổ lỗi cho hiệu quả",
      items: [
        "Cột cuối **tự viết bằng lời của bạn**, bằng tiếng Việt. Chép quy tắc trong sách thì quên; tự diễn đạt thì nhớ.",
        "Cuối mỗi tuần **đếm mã**. Ví dụ: A ×9, S ×6, W ×4 → tuần tới, trước khi nộp bài chỉ soát đúng **A và S**.",
        "Trước mỗi bài viết mới, đọc lại **5 dòng gần nhất**. Câu sai trong **Online Test** thì đã tự vào Sổ lỗi của khoá — sổ giấy này dành cho bài Viết và Nói.",
      ],
    },
    {
      t: "mcq",
      id: "t3d2-viet-ma-loi",
      title: "Gắn mã cho lỗi (6 câu)",
      items: [
        { q: "Many student think that homework are useless.", options: ["A — mạo từ", "S — số ít / số nhiều, chủ – vị", "T — thì", "P — giới từ"], correct: 1, why: "many **students**; homework (không đếm được) **is** → mã S." },
        { q: "Technology has a big effect to education.", options: ["A — mạo từ", "L — từ nối", "T — thì", "P — giới từ"], correct: 3, why: "an effect **on** → mã P." },
        { q: "The government should invest more in the education.", options: ["A — mạo từ", "S — số ít / số nhiều", "W — từ sai", "C — câu"], correct: 0, why: "education nói chung → không the: invest more in **education** → mã A." },
        { q: "Online courses are cheap. Moreover, they are less effective than classroom lessons.", options: ["W — từ sai", "I — ý", "L — từ nối", "T — thì"], correct: 2, why: "Hai ý **đối lập** mà nối bằng Moreover (thêm ý) → phải là **However** → mã L." },
        { q: "Because many parents are too busy to teach their children.", options: ["P — giới từ", "C — câu", "S — số ít / số nhiều", "A — mạo từ"], correct: 1, why: "Mệnh đề because đứng một mình = **câu cụt** → mã C." },
        { q: "Teachers should make lessons more interest.", options: ["T — thì", "A — mạo từ", "L — từ nối", "W — từ sai / dạng từ"], correct: 3, why: "more **interesting** (tính từ) → sai dạng từ → mã W." },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Viết lại qua 3 phiên bản — có lý do cho từng chỗ sửa" },
    {
      t: "p",
      text: "Ôn từ **Tập 2 Ngày 24 (mục 1c)**: ở đó bạn **xem** một đoạn được sửa qua ba bản. Từ hôm nay bạn **tự làm** với bài của mình. Nguyên tắc giữ nguyên: lượt 1 sửa **câu** (bài sạch lỗi), lượt 2 sửa **ý** (bài đủ sâu). Dưới đây là thân bài 1 của bài band 5 ở mục 3, đi qua ba bản.",
    },
    {
      t: "table",
      caption: "Thân bài 1 — ba phiên bản",
      head: ["Bản", "Đoạn văn", "Band (ước tính)"],
      rows: [
        ["**1 — Bản gốc**", "Firstly, practical skills is very useful in the life. For example, many young people don't know how to manage their money. They spend all money and they have no money in the end of month. Moreover, cooking is important too because everyone need to eat every day. If students can cook, they will be more healthy and they will not eat fast food. Furthermore, when they live alone in the university they can cook by themself and save a lot of money.", "~5.0"],
        ["**2 — Sửa câu** (mã A · S · P · W · L · C)", "Practical skills are very useful in everyday life. For example, many young people do not know how to manage their money, so they spend all of it and have nothing left at the end of the month. Cooking is important too, because everyone needs to eat every day. If students can cook, they will be healthier and will eat less fast food. When they live alone at university, they can also cook for themselves and save a lot of money.", "~5.5"],
        ["**3 — Sửa ý** (mã I)", "There are good reasons to teach practical skills at school. Many teenagers leave school without knowing how to plan a budget or prepare a simple meal, because their parents are too busy to teach them. As a result, when they move away to university, they often waste money on fast food and get into debt. A friend of mine, for instance, spent his whole monthly allowance in two weeks during his first term, simply because nobody had ever shown him how to plan his spending. A weekly lesson on these skills would help young people to become independent more quickly.", "~6.5"],
      ],
    },
    {
      t: "table",
      caption: "Chú thích — sửa gì, vì sao",
      head: ["Bước", "Sửa", "Vì sao (mã)"],
      rows: [
        ["1 → 2", "~~skills is~~ → **skills are** · ~~everyone need~~ → **everyone needs**", "Hoà hợp chủ – vị (**S**). everyone đi với động từ số ít."],
        ["1 → 2", "~~in the life~~ → **in everyday life** · ~~in the university~~ → **at university** · ~~all money~~ → **all of it**", "Mạo từ (**A**): life, university nói chung thì không the. Dùng đại từ it để khỏi lặp money."],
        ["1 → 2", "~~in the end of month~~ → **at the end of the month**", "Giới từ (**P**): at the end of + the…; in the end = cuối cùng thì."],
        ["1 → 2", "~~more healthy~~ → **healthier** · ~~by themself~~ → **for themselves**", "Dạng từ (**W**): tính từ ngắn + -er; đại từ phản thân số nhiều là themselves."],
        ["1 → 2", "Bỏ **Firstly, Moreover, Furthermore**; gộp hai câu ngắn bằng **so**", "Từ nối thừa (**L**); bớt câu đơn rời rạc (**C**)."],
        ["2 → 3", "Câu chủ đề: ~~Practical skills are very useful~~ → **There are good reasons to teach practical skills at school.**", "Câu chủ đề phải trả lời **đề** (nên dạy ở trường), không chỉ khen kỹ năng (**I**)."],
        ["2 → 3", "Gộp tiền + nấu ăn thành **một** chuỗi nhân – quả: không biết → **As a result** lãng phí, mắc nợ", "Bản 2 vẫn **liệt kê** 4 lợi ích. Band 6 cần một ý được đẩy tới **hệ quả** (**I**)."],
        ["2 → 3", "Thêm ví dụ **A friend of mine… in two weeks… first term**", "Ví dụ cụ thể: người, thời gian, kết quả — thay cho “many young people” chung chung (**I**)."],
        ["2 → 3", "Câu chốt: **A weekly lesson… would help…**", "Nối ý của đoạn trở lại **lập trường** của bài: nên dạy, ở mức một tiết mỗi tuần (**I**)."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận khi viết lại",
      items: [
        "**Đừng nhảy thẳng tới bản 3.** Nếu sửa ý trước khi sửa câu, bạn sẽ viết thêm câu mới với đúng những lỗi cũ.",
        "Bản 2 dừng ở band 5.5: **sạch lỗi mà thiếu ý thì chưa lên 6**. Nhiều bạn kẹt ở đây nhiều tháng vì chỉ chăm sửa ngữ pháp.",
        "Bản 3 không cần dài gấp đôi. Nó **bớt** ba lợi ích lẻ và **thêm** một chuỗi nhân – quả + một ví dụ.",
      ],
    },
    {
      t: "rule",
      formula: "Bản 1 (gốc) → Bản 2: sửa CÂU theo mã A · S · T · P · W · L · C → Bản 3: sửa Ý theo mã I (câu chủ đề trả lời đề · chuỗi nhân – quả · ví dụ cụ thể · câu chốt)",
      vi: "Mỗi chỗ sửa ghi một dòng vào sổ lỗi kèm lý do. Không có lý do thì lần sau vẫn sai.",
    },

    /* ── 8 ── */
    { t: "h", text: "8. Tái tạo bài mẫu — học KHUNG, không học thuộc" },
    {
      t: "p",
      text: "Ôn từ **Tập 2 Ngày 6 (mục 4b) và Ngày 10**. Học thuộc bài mẫu vừa vô ích (đề thật khác) vừa nguy hiểm (bị coi là bài thuộc lòng). **Tái tạo** là đọc hiểu cách bài được dựng, rồi **tự dựng lại bằng lời của mình**.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Tái tạo một bài mẫu (30 phút)",
      caption: "Làm với bài band 6 ở mục 3 ngay hôm nay.",
      steps: [
        { label: "**Đọc 2 lần**", sub: "Lần 2: gạch thesis, hai câu chủ đề, từ nối nghĩa." },
        { label: "**Ghi khung ≤ 30 chữ**", sub: "Tiếng Việt cũng được: lập trường · ý 1 + ví dụ · ý 2 + lý do." },
        { label: "**Cất bài mẫu**", sub: "Chỉ nhìn khung 30 chữ." },
        { label: "**Viết lại cả bài**", sub: "25 phút, bằng lời của bạn." },
        { label: "**So với bài mẫu**", sub: "Chép 5 cụm bạn muốn dùng lại vào sổ." },
      ],
    },
    {
      t: "table",
      caption: "Khung 30 chữ của bài band 6 — ví dụ",
      head: ["Phần", "Ghi chú của bạn"],
      rows: [
        ["Mở bài", "partly agree — thêm vào, không thay thế"],
        ["Thân 1", "nên dạy: không biết lập ngân sách → nợ; bạn tôi hết tiền 2 tuần"],
        ["Thân 2", "không thay môn học thuật: tư duy, đại học, việc làm; nấu ăn học sau được"],
        ["Kết", "dạy, nhưng 1–2 giờ / tuần; giữ lõi học thuật"],
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Câu khung band 6 dùng lại được" },
    {
      t: "patterns",
      rows: [
        {
          formula: "I partly agree: + ý đồng ý, but + ý giới hạn.",
          vi: "Thesis có mức độ — nói rõ đồng ý phần nào, không đồng ý phần nào (học kỹ ở Ngày 6).",
          examples: [
            { en: "I partly agree: these skills deserve a place in the curriculum, but they should not replace academic subjects.", vi: "Tôi đồng ý một phần: các kỹ năng này xứng đáng có chỗ trong chương trình, nhưng không nên thay thế môn học thuật." },
            { en: "I largely disagree: although online courses are convenient, they cannot replace classroom teaching.", vi: "Tôi phần lớn không đồng ý: dù khoá học trực tuyến tiện lợi, chúng không thể thay thế việc dạy trên lớp." },
          ],
        },
        {
          formula: "S + V … . As a result, S + V … .",
          vi: "Đẩy ý tới hệ quả — bước “Explain” của P-E-E ở mức band 6.",
          examples: [
            { en: "Many teenagers never learn to plan a budget. As a result, they often get into debt at university.", vi: "Nhiều thiếu niên không bao giờ học lập ngân sách. Kết quả là họ thường mắc nợ khi vào đại học." },
          ],
        },
        {
          formula: "S + V …, whereas S + V … .",
          vi: "So sánh đối lập trong một câu phức — thay cho hai câu đơn nối bằng But.",
          examples: [
            { en: "Cooking can be learned in a few months, whereas it takes years to catch up on maths.", vi: "Nấu ăn có thể học trong vài tháng, trong khi phải mất nhiều năm để bù lại môn toán." },
          ],
        },
        {
          formula: "If + S + V-ed …, S + would + V … .",
          vi: "Hệ quả giả định của một đề xuất (điều kiện loại 2 — học kỹ ở Ngày 15).",
          examples: [
            { en: "If schools reduced academic subjects, students would have fewer choices later in life.", vi: "Nếu trường cắt bớt môn học thuật, học sinh sẽ có ít lựa chọn hơn về sau." },
          ],
        },
        {
          formula: "In conclusion, I agree that + S + V, but only + điều kiện.",
          vi: "Kết bài nhắc lại đúng lập trường của mở bài, bằng chữ khác.",
          examples: [
            { en: "In conclusion, I agree that practical skills should be taught, but only as a small part of the timetable.", vi: "Tóm lại, tôi đồng ý rằng nên dạy kỹ năng thực hành, nhưng chỉ như một phần nhỏ của thời khoá biểu." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Thesis có mức độ → câu chủ đề trả lời đề → vì sao (because / As a result) → ví dụ cụ thể (for instance) → câu chốt nối về lập trường",
      vi: "Năm bước này là xương sống của mọi thân bài band 6 trong Tập 3.",
    },
    {
      t: "quiz",
      id: "t3d2-viet-khung-dich",
      title: "Dịch sang tiếng Anh — câu khung band 6 (5 câu)",
      kind: "translate",
      grammar: "I partly agree: …, but … · As a result, … · …, whereas … · If + V-ed, would + V · In conclusion, I agree that …, but only …",
      items: [
        { q: "Tôi đồng ý một phần: bài tập về nhà có ích, nhưng không nên chiếm cả buổi tối.", answers: ["I partly agree: homework is useful, but it should not take up the whole evening.", "I partly agree: homework is useful, but it should not take the whole evening.", "I partly agree: homework is useful, but it shouldn't take up the whole evening.", "I partly agree: homework is helpful, but it should not take up the whole evening.", "I partly agree: homework is useful, but it should not take up the entire evening."], hint: "I partly agree: … , but … · take up the whole evening" },
        { q: "Nhiều sinh viên phải đi làm thêm. Kết quả là họ có ít thời gian học hơn.", answers: ["Many students have to work part-time. As a result, they have less time to study.", "Many students have to work part-time. As a result, they have less time for studying.", "Many students have to work part time. As a result, they have less time to study.", "Many students have to do part-time jobs. As a result, they have less time to study.", "Many students have to work part-time. As a result, they have less time for their studies."], hint: "work part-time · As a result, · less time to study" },
        { q: "Lớp học trực tuyến rẻ, trong khi lớp học truyền thống cho nhiều tương tác hơn.", answers: ["Online classes are cheap, whereas traditional classes offer more interaction.", "Online classes are cheap, whereas traditional classes provide more interaction.", "Online classes are cheap, whereas traditional classes give more interaction.", "Online lessons are cheap, whereas traditional lessons offer more interaction.", "Online classes are cheap, while traditional classes offer more interaction."], hint: "…, whereas … · offer more interaction" },
        { q: "Nếu trường bỏ các kỳ thi, học sinh sẽ ít áp lực hơn.", answers: ["If schools removed exams, students would be under less pressure.", "If schools removed exams, students would have less pressure.", "If schools removed exams, students would feel less pressure.", "If schools abolished exams, students would be under less pressure.", "If schools got rid of exams, students would be under less pressure.", "If schools removed exams, students would feel less stressed."], hint: "If + removed …, would + be under less pressure" },
        { q: "Tóm lại, tôi đồng ý rằng nên dạy kỹ năng thực hành, nhưng chỉ một giờ mỗi tuần.", answers: ["In conclusion, I agree that practical skills should be taught, but only for one hour a week.", "In conclusion, I agree that practical skills should be taught, but only one hour a week.", "In conclusion, I agree that practical skills should be taught, but only for an hour a week.", "In conclusion, I agree that practical skills should be taught, but only for one hour per week.", "In conclusion, I agree that schools should teach practical skills, but only for one hour a week."], hint: "In conclusion, I agree that … should be taught, but only …" },
      ],
    },

    /* ── 10 ── */
    { t: "h", text: "10. Tự học bền: lịch tuần, ôn giãn cách, đo tiến độ" },
    {
      t: "p",
      text: "Tập 3 dài 30 ngày và band 5 → 6 là chặng **đông người bỏ cuộc nhất**. Người đi hết chặng không phải người học nhiều nhất mỗi ngày, mà là người có **nhịp cố định** và **nhìn thấy mình tiến bộ**.",
    },
    {
      t: "table",
      caption: "Một tuần mẫu của Tập 3 (mỗi ngày ~2 giờ) — chỉnh theo lịch của bạn",
      head: ["Việc", "Khi nào", "Bao lâu", "Đo bằng gì"],
      rows: [
        ["**Bài của ngày** (3 bài + bài tập)", "6 ngày / tuần", "~100 phút", "Bài tập ≥ 70 %"],
        ["**Flashcards** (ôn giãn cách — SRS)", "Mỗi ngày, lúc rảnh", "10–15 phút", "Tỉ lệ “nhớ sau 7 ngày”"],
        ["**Viết lại** một bài cũ theo sổ lỗi", "1 lần / tuần (ngày thứ 7)", "40 phút", "Số lỗi mỗi mã giảm so với bản trước"],
        ["**Sổ Speaking** — tự hỏi lại câu hôm qua", "Mỗi ngày", "5 phút", "Nói lại không nhìn sổ"],
        ["**Online Test** một kỹ năng", "2 tuần / lần; đủ 4 kỹ năng ở Ngày 15 và Ngày 30", "60 phút", "Điểm thô /40 · band ước tính"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: ba con số theo dõi mỗi tuần",
      items: [
        "**Reading / Listening:** số câu đúng trên 40 (đích 23). Ghi lại theo ngày làm — đường đi lên chậm nhưng thấy được.",
        "**Writing:** band AI chấm **và** số lỗi mỗi mã trong sổ lỗi. Band có thể đứng yên hai ba tuần trong khi số lỗi giảm — đó vẫn là tiến bộ.",
        "**Từ vựng:** tỉ lệ nhớ sau 7 ngày trong Flashcards. Dưới 70 % nghĩa là bạn đang nạp từ mới quá nhanh — giảm tốc, ôn lại.",
        "**Ôn giãn cách** (spaced repetition — SRS) nghĩa là ôn một từ ngay trước lúc sắp quên: sau 1 ngày, 3 ngày, 7 ngày, 2 tuần. Flashcards của khoá tự xếp lịch đó cho bạn.",
      ],
    },

    /* ── 11 ── */
    { t: "h", text: "11. Viết bài và viết lại — AI chấm 4 tiêu chí" },
    {
      t: "sodo",
      kind: "flow",
      title: "Quy trình cho bài hôm nay",
      steps: [
        { label: "**5 phút**", sub: "Đếm vế đề · chọn lập trường · dàn ý 2 thân bài" },
        { label: "**30 phút**", sub: "Viết ≥ 250 từ" },
        { label: "**5 phút**", sub: "Soát theo 2 mã bạn hay sai nhất" },
        { label: "**Tự chấm**", sub: "12 câu hỏi → đoán band 4 tiêu chí" },
        { label: "**AI chấm → sổ lỗi**", sub: "So hai kết quả, ghi mã lỗi" },
        { label: "**Hôm sau: viết lại**", sub: "Bản 2 sửa câu → bản 3 sửa ý" },
      ],
    },
    {
      t: "essay",
      id: "t3d2-viet-bai",
      task: "Task 2",
      prompt: "Some people think that university students should be required to do a period of unpaid work in their community, such as teaching children or helping the elderly, before they are allowed to graduate. To what extent do you agree or disagree?",
      minWords: 250,
      tips: [
        "Đếm vế: ① unpaid community work · ② be required (bắt buộc, không phải khuyến khích) · ③ before they are allowed to graduate (điều kiện tốt nghiệp) · ④ To what extent.",
        "Lập trường phải có ở mở bài và giống hệt ở kết bài. Nếu thấy “tốt nhưng không nên bắt buộc” → viết I partly agree ngay từ đầu.",
        "Mỗi thân bài: câu chủ đề trả lời đề → vì sao (because / As a result) → một ví dụ cụ thể → câu chốt.",
        "Dùng ít nhất 5 từ của bài từ vựng hôm nay: compulsory, a sense of responsibility, hands-on experience, a heavy workload, contribute to, job prospects…",
        "Trước khi bấm chấm: trả lời 12 câu hỏi tự chấm và ghi band bạn đoán cho từng tiêu chí.",
      ],
    },
    {
      t: "p",
      text: "**Hôm sau (hoặc sau khi nghỉ ít nhất 2 giờ):** mở lại bài, ghi lỗi AI chỉ ra vào sổ lỗi theo mã, rồi viết lại vào ô dưới đây. Bản viết lại phải sửa được **mọi lỗi câu** và thêm **ít nhất một chuỗi nhân – quả + một ví dụ cụ thể** cho thân bài yếu hơn.",
    },
    {
      t: "essay",
      id: "t3d2-viet-lai",
      task: "Task 2",
      prompt: "REWRITE — Viết lại bài của bạn cho đề: Some people think that university students should be required to do a period of unpaid work in their community, such as teaching children or helping the elderly, before they are allowed to graduate. To what extent do you agree or disagree?",
      minWords: 250,
      tips: [
        "Lượt 1 — sửa câu: đi qua từng mã A · S · T · P · W · L · C trong sổ lỗi.",
        "Lượt 2 — sửa ý: câu chủ đề có trả lời đề không? Ý có được đẩy tới hệ quả không? Ví dụ có người / thời gian / kết quả không?",
        "So điểm AI của hai bản. Ghi vào sổ: tiêu chí nào tăng, mã lỗi nào đã hết.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nói ─────────────────────────── */

const T3D2_SPEAKING: Lesson = {
  id: "t3d2-noi",
  kind: "speaking",
  title: "Nói: Band 6 Speaking — bốn tiêu chí, so mẫu band 5 và band 6 ở cả ba Part",
  goal: "Nói rõ được giám khảo chấm Speaking theo bốn tiêu chí nào và band 6 khác band 5 ở đâu; nghe hai câu trả lời cho cùng một câu hỏi và chỉ ra chỗ khác theo FC · LR · GRA · P; tự nâng câu trả lời của mình bằng năm thói quen band 6 và một cuốn sổ Speaking; đọc phân biệt được ba nguyên âm /æ/ – /e/ – /ʌ/.",
  minutes: 85,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy tiêu chí nào",
      items: [
        "Speaking band 6 theo mô tả công khai: **sẵn lòng nói dài**, đôi lúc mất mạch vì lặp hoặc ngập ngừng; từ vựng **đủ để bàn dài về các chủ đề**; **trộn câu đơn và câu phức**; phát âm **nhìn chung dễ hiểu**.",
        "Band 5 → 6 trong Speaking chủ yếu là chuyện **độ dài và độ phát triển** của câu trả lời, không phải giọng hay từ khó. Người band 5 trả lời xong trong 5 giây; người band 6 nói 15–20 giây ở Part 1 và 40 giây ở Part 3.",
        "Hôm nay nghe **cùng một câu hỏi, hai câu trả lời** ở cả Part 1, Part 2 và Part 3, rồi chấm theo bốn tiêu chí — đúng cách bạn vừa làm với bài viết.",
        "**Năm thói quen band 6**: mở rộng câu trả lời · dùng từ nối khi nói · nói vòng khi quên từ · tự sửa gọn · kết câu dứt khoát.",
        "**Sổ Speaking**: chép lại câu trả lời của mình, sửa, và hôm sau tự đóng vai giám khảo hỏi lại.",
        "🔊 Ba nguyên âm ngắn người Việt hay đọc lẫn: ==/æ/== (bad) · ==/e/== (bed) · ==/ʌ/== (bud) — ôn và nâng từ Tập 2 Ngày 8.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Nhắc lại: ba Part và việc của giám khảo" },
    {
      t: "table",
      caption: "Bài thi Speaking — 11 đến 14 phút, một giám khảo, ghi âm toàn bộ",
      head: ["Part", "Thời gian", "Giám khảo làm gì", "Bạn cần làm gì ở band 6"],
      rows: [
        ["**Part 1** — hỏi đáp về bản thân", "4–5 phút", "Hỏi 2–3 chủ đề quen thuộc (học tập, quê, sở thích…), khoảng 10–12 câu", "Mỗi câu trả lời **2–4 câu** (15–20 giây): trả lời + lý do + một chi tiết"],
        ["**Part 2** — nói một mình", "3–4 phút (1 phút chuẩn bị + 1–2 phút nói)", "Đưa thẻ đề, bấm giờ, ngắt bạn ở 2 phút, hỏi 1–2 câu ngắn", "Nói **gần đủ 2 phút**, phủ các ý trên thẻ, có một chuyện nhỏ cụ thể"],
        ["**Part 3** — thảo luận", "4–5 phút", "Hỏi 4–6 câu trừu tượng hơn, nối với chủ đề Part 2; hỏi vặn lại", "Mỗi câu **4–6 câu** (30–45 giây): ý kiến + lý do + ví dụ + nhượng bộ (khung Tập 2 Ngày 13)"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba điều giám khảo KHÔNG chấm",
      items: [
        "**Không chấm ý kiến đúng hay sai**, không chấm kiến thức. Bạn bịa ví dụ cũng được, miễn là tiếng Anh tốt.",
        "**Không chấm giọng Anh hay Mỹ.** Chấm **dễ hiểu** hay không: âm cuối, trọng âm từ, nhịp câu.",
        "**Không cộng điểm cho bài thuộc lòng.** Nói trơn tru bất thường rồi vấp ở câu hỏi phụ là dấu hiệu học thuộc — giám khảo sẽ đổi câu hỏi.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Bốn tiêu chí — band 5 và band 6" },
    {
      t: "table",
      caption: "Speaking theo bốn tiêu chí, mỗi tiêu chí 25 % (tóm tắt từ band descriptors công khai)",
      head: ["Tiêu chí", "Band 5", "Band 6 (đích Tập 3)", "Việc phải làm để lên 6"],
      rows: [
        ["**FC — Fluency & Coherence** (trôi chảy, mạch lạc)", "Giữ được mạch nhưng phải **lặp, tự sửa, nói chậm**; lạm dụng vài từ nối; câu đơn giản thì trôi, câu phức tạp thì vấp", "**Sẵn lòng nói dài**; đôi lúc mất mạch do lặp, tự sửa, ngập ngừng; dùng **nhiều loại từ nối** dù không phải lúc nào cũng đúng", "Không dừng ở câu trả lời một ý · thêm because / for example / but · dùng câu kéo giờ thay cho im lặng"],
        ["**LR — Lexical Resource**", "Nói được về chủ đề quen và lạ nhưng **kém linh hoạt**; thử nói vòng (paraphrase) lúc được lúc không", "Vốn từ **đủ để bàn dài** về các chủ đề, ý vẫn rõ dù có từ dùng chưa chuẩn; **nói vòng nhìn chung thành công**", "Học từ theo chủ đề và theo cụm · tập nói vòng khi quên từ (mục 6)"],
        ["**GRA — Grammatical Range & Accuracy**", "Câu cơ bản khá đúng; câu phức **ít** và thường **sai**", "**Trộn câu đơn và câu phức**, độ linh hoạt còn hạn chế; lỗi hay gặp ở câu phức nhưng **hiếm khi gây hiểu sai**", "Mỗi câu trả lời có 1 mệnh đề phụ (because, when, if, which) · đúng thì — bài 1 hôm qua"],
        ["**P — Pronunciation**", "Có **một số** đặc điểm tốt (vài trọng âm đúng) nhưng kiểm soát hạn chế; phát âm sai khiến người nghe **phải cố gắng**", "Dùng được **nhiều đặc điểm** phát âm với mức kiểm soát lẫn lộn; **nhìn chung dễ hiểu**, đôi chỗ sai âm làm giảm độ rõ", "Âm cuối · trọng âm từ · phân biệt nguyên âm ngắn (mục 8) · nối âm (từ Ngày 3)"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Nghe 10 giây là biết — dấu hiệu band 5 và band 6",
      cols: [
        {
          title: "Band 5",
          items: [
            "Trả lời đúng câu hỏi rồi **dừng**, chờ câu tiếp",
            "Nối ý bằng **and · so · because** lặp lại",
            "Bí từ thì **im** hoặc nói “I don't know how to say”",
            "Kể chuyện quá khứ bằng **thì hiện tại**",
            "Đọc đều đều, **rụng âm cuối**",
          ],
        },
        {
          title: "Band 6",
          items: [
            "Tự **thêm lý do và ví dụ** không cần hỏi",
            "Có **Well · Actually · For example · Having said that**",
            "Bí từ thì **nói vòng**: it's a kind of…",
            "**Đổi thì** theo thời gian đang nói",
            "Có **trọng âm**, âm cuối nghe được, lên xuống giọng",
          ],
        },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Part 1 — cùng ba câu hỏi, hai câu trả lời" },
    {
      t: "p",
      text: "Chủ đề **Study** (ôn từ Tập 2 Ngày 1). Bấm nghe bản band 5 trước, tự hỏi “thiếu gì?”, rồi nghe bản band 6. Band ghi là **ước tính**.",
    },
    {
      t: "dialogue",
      title: "Part 1 — câu trả lời band 5 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you work or are you a student?" },
        { who: "Candidate", role: "candidate", text: "I am student. I study in university. My major is information technology.", vi: "Tôi là sinh viên. Tôi học ở đại học. Ngành của tôi là công nghệ thông tin." },
        { who: "Examiner", role: "examiner", text: "What do you like most about your studies?" },
        { who: "Candidate", role: "candidate", text: "I like programming. Because it is interesting. And I can make many application. Yes.", vi: "Tôi thích lập trình. Vì nó thú vị. Và tôi có thể làm nhiều ứng dụng. Vâng." },
        { who: "Examiner", role: "examiner", text: "Is there anything you find difficult?" },
        { who: "Candidate", role: "candidate", text: "Yes. Maths is difficult. I am not good at maths. So I must study hard.", vi: "Có. Toán khó. Tôi không giỏi toán. Nên tôi phải học chăm." },
      ],
    },
    {
      t: "dialogue",
      title: "Part 1 — câu trả lời band 6 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you work or are you a student?" },
        { who: "Candidate", role: "candidate", text: "I'm a student at the moment. I'm in my third year at a university in Ho Chi Minh City, and I'm majoring in information technology. I've been studying there for just over two years, so I'll graduate in about eighteen months if everything goes well.", vi: "Hiện tôi là sinh viên. Tôi đang học năm ba ở một trường đại học tại Thành phố Hồ Chí Minh, chuyên ngành công nghệ thông tin. Tôi học ở đó được hơn hai năm, nên khoảng mười tám tháng nữa tôi sẽ tốt nghiệp nếu mọi việc suôn sẻ." },
        { who: "Examiner", role: "examiner", text: "What do you like most about your studies?" },
        { who: "Candidate", role: "candidate", text: "Well, the part I enjoy most is programming, because you can see the result of your work straight away. For example, last term my group built a small app for booking football pitches, and it actually worked. That was a great feeling.", vi: "Chà, phần tôi thích nhất là lập trình, vì mình thấy được kết quả công việc ngay lập tức. Ví dụ, học kỳ trước nhóm tôi làm một ứng dụng nhỏ để đặt sân bóng, và nó chạy được thật. Cảm giác đó rất tuyệt." },
        { who: "Examiner", role: "examiner", text: "Is there anything you find difficult?" },
        { who: "Candidate", role: "candidate", text: "Yes, definitely. To be honest, I've always struggled with maths, especially statistics. I understand the lecture, but when I do the exercises on my own, I often get stuck. So I usually study with a friend who's much better at it than me.", vi: "Có, chắc chắn rồi. Thật lòng mà nói, tôi luôn chật vật với môn toán, nhất là thống kê. Tôi hiểu bài giảng, nhưng khi tự làm bài tập thì hay bị bí. Nên tôi thường học cùng một người bạn giỏi môn đó hơn tôi nhiều." },
      ],
    },
    {
      t: "table",
      caption: "Part 1 — khác nhau ở đâu",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**FC**", "Mỗi câu trả lời 3–4 câu cụt, khoảng 5–6 giây; nối bằng Because / And / So đứng đầu câu; “Yes.” để báo hết ý", "Mỗi câu trả lời 15–20 giây; có **Well, For example, To be honest, So**; ý nối nhau: trả lời → lý do → chi tiết"],
        ["**LR**", "study, interesting, difficult, good at — từ nào cũng đúng nhưng rất chung", "**majoring in · straight away · struggled with · get stuck · last term** — từ của người thật sự đang đi học"],
        ["**GRA**", "Toàn câu đơn hiện tại. Lỗi: ~~I am student~~ · ~~in university~~ · ~~many application~~", "**I've been studying there for just over two years** · **I've always struggled** · mệnh đề **because / when / if / who's**; so sánh **much better at it than me**"],
        ["**P**", "Rụng âm cuối: studen(t), application(s); mọi từ đọc đều nhau", "Nhấn từ mang nghĩa: **MOST**, **straight aWAY**, **ALways**; nghe được -s, -t, -d cuối"],
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Part 2 — một thẻ đề, hai bài nói" },
    {
      t: "table",
      caption: "Thẻ đề (cue card)",
      head: ["Describe a subject you enjoyed studying at school."],
      rows: [
        ["You should say:"],
        ["• what the subject was"],
        ["• who taught it"],
        ["• what you did in the lessons"],
        ["and explain why you enjoyed it."],
      ],
    },
    {
      t: "dialogue",
      title: "Part 2 — bài nói band 5 (ước tính) · khoảng 40 giây rồi hết ý",
      lines: [
        { who: "Candidate", role: "candidate", text: "I want to talk about English. I learn English when I was in high school. My teacher is Ms Lan. She is very kind and she teach very good.", vi: "Tôi muốn nói về tiếng Anh. Tôi học tiếng Anh khi tôi học cấp ba. Cô giáo của tôi là cô Lan. Cô rất tốt bụng và cô dạy rất giỏi." },
        { who: "Candidate", role: "candidate", text: "In the lesson we read the book and do exercise. Sometimes we play game.", vi: "Trong giờ học chúng tôi đọc sách và làm bài tập. Thỉnh thoảng chúng tôi chơi trò chơi." },
        { who: "Candidate", role: "candidate", text: "I like English because it is interesting and it is important for my future. I can watch movie and listen music in English. Also I can get a good job. So I like this subject very much. That's all.", vi: "Tôi thích tiếng Anh vì nó thú vị và quan trọng cho tương lai của tôi. Tôi có thể xem phim và nghe nhạc bằng tiếng Anh. Tôi cũng có thể có một công việc tốt. Nên tôi rất thích môn này. Hết rồi ạ." },
      ],
    },
    {
      t: "dialogue",
      title: "Part 2 — bài nói band 6 (ước tính) · khoảng 1 phút 50 giây",
      lines: [
        { who: "Candidate", role: "candidate", text: "I'd like to talk about physics, which was my favourite subject when I was in high school. I studied it for three years, from grade ten to grade twelve.", vi: "Tôi muốn nói về môn vật lý, môn tôi thích nhất hồi cấp ba. Tôi học môn này ba năm, từ lớp mười tới lớp mười hai." },
        { who: "Candidate", role: "candidate", text: "It was taught by a teacher called Mr Hung. He had been an engineer before he became a teacher, so he always explained things with examples from real life: bridges, motorbike engines, that kind of thing.", vi: "Môn này do một thầy tên Hùng dạy. Thầy từng là kỹ sư trước khi thành giáo viên, nên thầy luôn giải thích mọi thứ bằng ví dụ từ đời thật: cầu, động cơ xe máy, đại loại vậy." },
        { who: "Candidate", role: "candidate", text: "In most subjects we just listened and copied from the board, but his lessons were different. He usually started with a question, for example, why doesn't a heavy ship sink, and we had to discuss it in pairs before he gave us the answer.", vi: "Ở phần lớn các môn, chúng tôi chỉ nghe và chép từ bảng, nhưng giờ của thầy thì khác. Thầy thường mở đầu bằng một câu hỏi, ví dụ vì sao một con tàu nặng lại không chìm, và chúng tôi phải thảo luận theo cặp trước khi thầy đưa ra đáp án." },
        { who: "Candidate", role: "candidate", text: "About once a month we also did a small experiment. I remember one lesson when we built a simple electric motor from a battery, a magnet and some wire. Mine didn't work at first, and I was quite frustrated, but when it finally started spinning, the whole class cheered.", vi: "Khoảng mỗi tháng một lần chúng tôi còn làm một thí nghiệm nhỏ. Tôi nhớ có một buổi chúng tôi làm một động cơ điện đơn giản từ một cục pin, một nam châm và ít dây điện. Cái của tôi lúc đầu không chạy, và tôi khá bực, nhưng khi nó cuối cùng cũng quay, cả lớp reo lên." },
        { who: "Candidate", role: "candidate", text: "As for why I enjoyed it, I think there are two reasons. The first is that physics made sense to me. You don't have to memorise a lot if you understand the idea. And the second is the teacher. He never laughed at a wrong answer, so we weren't afraid to speak.", vi: "Còn vì sao tôi thích môn này, tôi nghĩ có hai lý do. Thứ nhất là vật lý dễ hiểu với tôi. Bạn không phải học thuộc nhiều nếu bạn hiểu ý tưởng. Và thứ hai là thầy giáo. Thầy không bao giờ cười một câu trả lời sai, nên chúng tôi không sợ phát biểu." },
        { who: "Candidate", role: "candidate", text: "Actually, he's the reason I chose to study engineering at university. So, looking back, I'd say that subject changed my plans for the future.", vi: "Thật ra, thầy chính là lý do tôi chọn học kỹ thuật ở đại học. Nên nhìn lại, tôi cho là môn học đó đã thay đổi kế hoạch tương lai của tôi." },
      ],
    },
    {
      t: "table",
      caption: "Part 2 — khác nhau ở đâu",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**FC**", "40 giây là hết; mỗi gạch đầu dòng **một câu**; kết bằng “That's all” — giám khảo phải hỏi thêm", "Gần đủ 2 phút; mỗi gạch đầu dòng **một đoạn nhỏ**; chuyển ý bằng **As for why…, The first is…, And the second…, So, looking back…**"],
        ["**LR**", "kind, interesting, important, good job — dùng được cho mọi môn học, tức là không tả được môn nào", "**experiment · electric motor · magnet · made sense to me · memorise · frustrated · cheered** — từ cụ thể của chính câu chuyện"],
        ["**GRA**", "Kể quá khứ bằng hiện tại: ~~I learn~~, ~~My teacher is~~, ~~she teach~~, ~~we read~~. Lỗi số nhiều: ~~exercise, game, movie~~; ~~listen music~~", "Quá khứ đơn làm xương sống; **He had been an engineer before he became a teacher** (quá khứ hoàn thành); **which was…**, **when we built…**; bị động **It was taught by…**. Về hiện tại đúng lúc: he**'s** the reason"],
        ["**P**", "Đều đều; rụng -ed nếu có dùng", "Nghe được **-ed**: studied, explained, started, cheered; ngắt giọng trước as for why; lên giọng khi kể đến đoạn cái mô-tơ quay"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: vì sao bài band 6 nói được 2 phút?",
      items: [
        "Nó có **một chuyện nhỏ cụ thể** (buổi làm mô-tơ điện): 20 giây, có cảm xúc, có kết thúc. Một chuyện nhỏ đáng giá hơn năm tính từ.",
        "Mỗi gạch đầu dòng trả lời thêm **một câu hỏi phụ tự đặt**: môn gì → học mấy năm? · ai dạy → thầy có gì đặc biệt? · làm gì → khác các môn khác thế nào? · vì sao thích → nó dẫn tới điều gì?",
        "Thì động từ chính là công cụ kéo dài: nhờ **had been an engineer** mà có thêm một ý về quá khứ của thầy.",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Part 3 — cùng hai câu hỏi, hai câu trả lời" },
    {
      t: "dialogue",
      title: "Part 3 — câu trả lời band 5 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think schools should teach more practical skills?" },
        { who: "Candidate", role: "candidate", text: "Yes, I think so. Practical skills is important. Student need to know cooking and money. In my country school only teach theory. So I think school should teach more practical skills. It is good for student.", vi: "Vâng, tôi nghĩ vậy. Kỹ năng thực hành quan trọng. Học sinh cần biết nấu ăn và tiền bạc. Ở nước tôi trường chỉ dạy lý thuyết. Nên tôi nghĩ trường nên dạy thêm kỹ năng thực hành. Nó tốt cho học sinh." },
        { who: "Examiner", role: "examiner", text: "How has education changed in your country in the last twenty years?" },
        { who: "Candidate", role: "candidate", text: "Education change a lot. In the past student use book. Now student use computer and internet. They can learn online. It is more convenient. But some student play game.", vi: "Giáo dục thay đổi nhiều. Ngày xưa học sinh dùng sách. Giờ học sinh dùng máy tính và internet. Họ có thể học trực tuyến. Nó tiện hơn. Nhưng một số học sinh chơi game." },
      ],
    },
    {
      t: "dialogue",
      title: "Part 3 — câu trả lời band 6 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think schools should teach more practical skills?" },
        { who: "Candidate", role: "candidate", text: "Yes, I think they should, at least to some extent. The main reason is that a lot of school leavers don't know how to deal with everyday things, like managing a budget. For example, many of my friends ran out of money in their first month at university, because nobody had taught them how to plan their spending. Having said that, I don't think schools should cut academic subjects to make room for this. Maybe one lesson a week would be enough.", vi: "Vâng, tôi nghĩ là nên, ít nhất ở một mức nào đó. Lý do chính là nhiều học sinh ra trường không biết xử lý những việc thường ngày, như quản lý ngân sách. Ví dụ, nhiều bạn tôi hết tiền ngay tháng đầu ở đại học, vì chưa ai dạy họ cách lên kế hoạch chi tiêu. Nói vậy chứ, tôi không nghĩ trường nên cắt môn học thuật để lấy chỗ cho việc này. Có lẽ một tiết mỗi tuần là đủ." },
        { who: "Examiner", role: "examiner", text: "How has education changed in your country in the last twenty years?" },
        { who: "Candidate", role: "candidate", text: "I'd say it has changed quite a lot, mainly because of technology. When my parents were at school, they used to copy everything from the blackboard, whereas now most students have a laptop, or at least a smartphone, so they can look things up straight away. Another change is that English has become much more important. These days children start learning it in primary school. I'm not sure the teaching methods have changed as much, though. There's still a lot of rote learning, I mean, learning things by heart for exams.", vi: "Tôi cho là nó đã thay đổi khá nhiều, chủ yếu do công nghệ. Hồi bố mẹ tôi đi học, họ thường chép mọi thứ từ bảng đen, trong khi giờ phần lớn học sinh có laptop, hoặc ít nhất là điện thoại thông minh, nên họ tra cứu được ngay. Một thay đổi nữa là tiếng Anh đã trở nên quan trọng hơn nhiều. Ngày nay trẻ bắt đầu học nó từ tiểu học. Dù vậy, tôi không chắc phương pháp dạy đã thay đổi nhiều đến thế. Vẫn còn rất nhiều kiểu học vẹt, ý tôi là học thuộc lòng để thi." },
      ],
    },
    {
      t: "table",
      caption: "Part 3 — khác nhau ở đâu",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**FC**", "6 câu cụt, ý **vòng lại** (should teach… → should teach more); không có ví dụ; khoảng 15 giây", "Đủ khung Tập 2 Ngày 13: **ý kiến → lý do → ví dụ → nhượng bộ**; từ nối: **The main reason is that · For example · Having said that · Another change is · though**; 35–40 giây"],
        ["**LR**", "practical skills, theory, convenient — lặp student ×5, school ×2", "**school leavers · managing a budget · ran out of money · make room for · look things up · rote learning · by heart** (school leavers, rote learning, by heart lấy từ bài 1 hôm nay). Nói vòng thành công: rote learning, **I mean, learning things by heart**"],
        ["**GRA**", "Lỗi lặp lại: ~~skills is~~, ~~student need~~, ~~school teach~~, ~~Education change~~ (cần has changed), ~~student use book~~ (cần used to use)", "**has changed** (hiện tại hoàn thành cho thay đổi tới nay) · **used to copy** · **nobody had taught them** (quá khứ hoàn thành) · **whereas** · **would be enough**"],
        ["**P**", "Rụng -s ở mọi danh từ số nhiều nên nghe như lỗi ngữ pháp", "Nhấn từ đối lập: **PArents** … **NOW**; ngắt trước Having said that; hạ giọng dứt khoát ở enough"],
      ],
    },
    {
      t: "mcq",
      id: "t3d2-noi-nhan-band",
      title: "Câu trả lời nào gần band 6 hơn — và vì sao? (6 câu)",
      items: [
        { q: "Examiner: “Do you enjoy reading?”", options: ["A. Yes, I do. I like reading. Reading is good.", "B. Yes, quite a lot, actually. I mostly read on my phone on the bus, because it's the only free time I have. At the moment I'm reading a book about the history of the Internet.", "C. Reading is a very important habit for everyone in the modern society nowadays."], correct: 1, why: "B: trả lời + mức độ + lý do + chi tiết cụ thể; có actually, because, at the moment. A dừng ở một ý, lặp reading. C là câu **học thuộc**, không trả lời về **bạn**." },
        { q: "Bạn quên từ “kính hiển vi” (microscope). Cách xử lý nào của band 6?", options: ["A. Im lặng 5 giây để nhớ từ.", "B. Nói “I don't know this word in English, sorry.” rồi dừng.", "C. Nói “…we used, um, the thing you look through to see very small things, I can't remember the word…” rồi nói tiếp."], correct: 2, why: "C là **nói vòng** (paraphrase) — descriptors band 6 ghi “nói vòng nhìn chung thành công”. Im lặng kéo FC xuống; xin lỗi rồi dừng làm mất ý." },
        { q: "Examiner: “Why do some students drop out of university?”", options: ["A. I think the main reason is money. Tuition fees are quite high, so some students have to work part-time, and then they fall behind with their coursework. A friend of mine left in her second year for exactly that reason.", "B. Because no money. And difficult. And boring.", "C. There are many reasons for this problem. It is a serious problem. We should solve this problem."], correct: 0, why: "A có lý do → chuỗi hệ quả (so… and then…) → ví dụ thật; dùng từ bài 1 (tuition fees, fall behind, coursework). B không thành câu. C nói ba câu mà **không có nội dung**." },
        { q: "Câu nào dùng thì ĐÚNG khi kể về trường cũ?", options: ["A. When I was in high school, my teacher was very strict, but she had worked abroad, so her English was excellent.", "B. When I am in high school, my teacher is very strict.", "C. When I was in high school, my teacher is very strict."], correct: 0, why: "A: quá khứ đơn nhất quán + quá khứ hoàn thành (had worked) cho việc xảy ra trước đó. B, C trượt về hiện tại — lỗi GRA điển hình của band 5." },
        { q: "Bạn nói nhầm “She teach me…” và nhận ra ngay. Nên làm gì?", options: ["A. Dừng lại, xin lỗi, nói lại cả câu từ đầu thật chậm.", "B. Sửa gọn rồi đi tiếp: “She teach — she taught me for two years.”", "C. Bỏ qua mọi lỗi, không bao giờ sửa."], correct: 1, why: "**Tự sửa gọn** một lần cho thấy bạn kiểm soát được ngữ pháp và không làm mất mạch. Dừng xin lỗi làm hỏng FC; không sửa lỗi nào thì mất điểm GRA." },
        { q: "Câu kết nào làm câu trả lời Part 3 “đóng” lại tự nhiên?", options: ["A. That's all.", "B. …and, yes, and so on, I think.", "C. So overall, I'd say it depends on the subject."], correct: 2, why: "C tóm ý bằng một câu chốt, hạ giọng → giám khảo biết bạn đã xong. “That's all” và câu bỏ lửng là dấu hiệu band 5." },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Năm thói quen band 6 — khung câu dùng ngay" },
    {
      t: "patterns",
      rows: [
        {
          formula: "Trả lời + because / since … + For example, … (+ but / although …)",
          vi: "Thói quen 1 — MỞ RỘNG: không bao giờ dừng ở một câu. Part 1: 2–4 câu; Part 3: 4–6 câu.",
          examples: [
            { en: "Yes, quite a lot, because it helps me relax. For example, I read for half an hour before bed, although these days it's mostly on my phone.", vi: "Có, khá nhiều, vì nó giúp tôi thư giãn. Ví dụ, tôi đọc nửa tiếng trước khi ngủ, dù dạo này chủ yếu đọc trên điện thoại." },
          ],
        },
        {
          formula: "Well, … · Actually, … · To be honest, … · I'd say … · The thing is, … · Having said that, …",
          vi: "Thói quen 2 — TỪ NỐI KHI NÓI (discourse markers): mở câu tự nhiên, có thêm 1 giây để nghĩ. Khác từ nối khi viết (Moreover, Furthermore nghe như đọc bài).",
          examples: [
            { en: "To be honest, I've never really enjoyed history. The thing is, we just had to memorise dates.", vi: "Thật lòng mà nói, tôi chưa bao giờ thật sự thích môn sử. Vấn đề là chúng tôi chỉ phải học thuộc ngày tháng." },
          ],
        },
        {
          formula: "It's a kind of + N that … · the thing you use to + V · I'm not sure of the exact word, but it's …",
          vi: "Thói quen 3 — NÓI VÒNG khi quên từ (ôn Tập 2 Ngày 9, mục 2b): tả công dụng, hình dáng, hoặc dùng từ gần nghĩa.",
          examples: [
            { en: "We wore, um, it's a kind of long white coat that scientists wear in the lab.", vi: "Chúng tôi mặc, ừm, đó là một kiểu áo khoác trắng dài mà nhà khoa học mặc trong phòng thí nghiệm. (= lab coat)" },
            { en: "I'm not sure of the exact word, but it's the money the university gives you if you're a good student.", vi: "Tôi không chắc từ chính xác, nhưng đó là khoản tiền trường cấp cho bạn nếu bạn học giỏi. (= scholarship)" },
          ],
        },
        {
          formula: "… — I mean, … · … sorry, … · … or rather, …",
          vi: "Thói quen 4 — TỰ SỬA GỌN: sửa một lần, không xin lỗi dài, đi tiếp.",
          examples: [
            { en: "She teach, I mean, she taught me for two years.", vi: "Cô ấy dạy — ý tôi là, cô ấy đã dạy tôi hai năm." },
          ],
        },
        {
          formula: "So overall, … · So that's why … · So, looking back, I'd say …",
          vi: "Thói quen 5 — KẾT DỨT KHOÁT: một câu chốt, hạ giọng. Không nói That's all.",
          examples: [
            { en: "So that's why I'd choose a small class every time.", vi: "Nên đó là lý do lần nào tôi cũng sẽ chọn lớp ít người." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi cố “nói dài”",
      items: [
        "**Dài bằng cách lặp**: “I like it because I like it very much, it is very good.” Dài phải là **thêm thông tin mới**: lý do, ví dụ, thời gian, đối lập.",
        "**Nhồi từ nối viết**: Moreover, Furthermore, In addition ở Part 1 nghe như đọc thuộc. Dùng **also, and another thing is, plus**.",
        "**Um… à… ờ…** tiếng Việt. Thay bằng **Well… · Let me think… · That's an interesting question…** (filler đã học ở Tập 2 Ngày 5).",
        "**Tự sửa mọi lỗi nhỏ** đến mức câu nào cũng nói hai lần. Chỉ sửa lỗi làm **sai nghĩa** hoặc lỗi bạn bắt được ngay.",
      ],
    },
    {
      t: "rule",
      formula: "Trả lời → because … → For example, … → (Having said that, …) → So overall, …",
      vi: "Một câu trả lời band 6 = câu trả lời band 5 + lý do + ví dụ + câu chốt. Bí từ thì nói vòng, đừng im.",
    },
    {
      t: "quiz",
      id: "t3d2-noi-khung-dich",
      title: "Dịch sang tiếng Anh — khung câu band 6 (5 câu)",
      kind: "translate",
      grammar: "To be honest, … · The main reason is that … · Having said that, … · I'm not sure of the exact word, but … · So overall, I'd say …",
      items: [
        { q: "Thật lòng mà nói, tôi chưa bao giờ giỏi môn toán.", answers: ["To be honest, I have never been good at maths.", "To be honest, I've never been good at maths.", "To be honest, I have never been good at math.", "To be honest, I've never been good at math.", "Honestly, I have never been good at maths.", "Honestly, I've never been good at maths."], hint: "To be honest, · have never been good at" },
        { q: "Lý do chính là học phí quá cao.", answers: ["The main reason is that tuition fees are too high.", "The main reason is that the tuition fees are too high.", "The main reason is that tuition fees are too expensive.", "The main reason is that tuition is too expensive."], hint: "The main reason is that · tuition fees" },
        { q: "Nói vậy chứ, tôi không nghĩ nên bỏ các kỳ thi.", answers: ["Having said that, I don't think exams should be removed.", "Having said that, I do not think exams should be removed.", "Having said that, I don't think we should remove exams.", "Having said that, I don't think exams should be abolished.", "Having said that, I don't think we should get rid of exams.", "Having said that, I don't think schools should remove exams."], hint: "Having said that, I don't think … should be removed" },
        { q: "Tôi không chắc từ chính xác, nhưng đó là một kiểu trường mà học sinh ở lại qua đêm.", answers: ["I'm not sure of the exact word, but it's a kind of school where students stay overnight.", "I am not sure of the exact word, but it is a kind of school where students stay overnight.", "I'm not sure of the exact word, but it's a kind of school where pupils stay overnight.", "I'm not sure of the exact word, but it's a kind of school where students stay at night.", "I'm not sure about the exact word, but it's a kind of school where students stay overnight."], hint: "I'm not sure of the exact word, but it's a kind of school where…" },
        { q: "Nên nhìn chung, tôi cho là còn tuỳ vào giáo viên.", answers: ["So overall, I'd say it depends on the teacher.", "So overall, I would say it depends on the teacher.", "So overall, I'd say it depends on the teachers.", "So overall, I'd say that it depends on the teacher."], hint: "So overall, I'd say it depends on" },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Sổ Speaking — chép, sửa, và tự đóng vai giám khảo hôm sau" },
    {
      t: "p",
      text: "Bài viết thì còn nằm trên giấy để xem lại; bài nói thì bay mất. **Sổ Speaking** giữ lại câu trả lời của bạn để bạn sửa được nó — đây là bản “sổ lỗi + viết lại” dành cho kỹ năng Nói.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Một vòng sổ Speaking (10 phút hôm nay + 5 phút hôm sau)",
      steps: [
        { label: "**Ghi âm**", sub: "Trả lời 1 câu Part 1 hoặc Part 3 ở khối luyện nói." },
        { label: "**Chép nguyên văn**", sub: "Nghe lại, chép đúng những gì bạn đã nói — cả lỗi." },
        { label: "**Sửa bằng bút khác màu**", sub: "Thêm lý do / ví dụ; sửa thì, -s; thay 1–2 từ chung chung." },
        { label: "**Nói lại bản đã sửa**", sub: "Không nhìn sổ, 2 lần." },
        { label: "**Hôm sau: tự hỏi lại**", sub: "Đóng vai giám khảo, hỏi đúng câu đó + 1 câu hỏi vặn." },
      ],
    },
    {
      t: "table",
      caption: "Mẫu một trang sổ Speaking",
      head: ["Mục", "Nội dung"],
      rows: [
        ["**Câu hỏi**", "What do you like most about your studies? (Part 1 · Ngày 2)"],
        ["**Tôi đã nói** (chép nguyên văn)", "I like programming. Because it is interesting. And I can make many application."],
        ["**Bản sửa**", "Well, the part I enjoy most is programming, **because** you can see the result of your work straight away. **For example**, last term my group built a small app…"],
        ["**Đã sửa gì**", "+ lý do cụ thể · + ví dụ có thời gian · many application → a small app · Because đầu câu → gộp"],
        ["**Câu hỏi vặn cho ngày mai**", "Is programming difficult to learn? · What would you like to build next?"],
        ["**Âm cần nhớ** (từ sổ âm Ngày 1)", "result /rɪˈzʌlt/ — âm /ʌ/, có /t/ cuối"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: sổ Speaking KHÔNG phải kho bài để học thuộc",
      items: [
        "Bạn nói lại **ý** của bản sửa, mỗi lần bằng câu hơi khác. Nếu lần nào cũng y nguyên từng chữ là bạn đang học thuộc — đổi câu hỏi vặn để phá.",
        "Mỗi ngày **một câu** là đủ. Sau 30 ngày bạn có 30 câu trả lời đã sửa, phủ gần hết chủ đề Part 1.",
        "Hai trang đầu sổ: **sổ âm** (Ngày 1) và **5 câu thật của bạn** từ bài từ vựng hôm nay.",
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Phát âm: /æ/ – /e/ – /ʌ/" },
    {
      t: "p",
      text: "Ba nguyên âm **ngắn** này phân biệt hàng trăm cặp từ: bad – bed – bud, many – money, match – much. Tiếng Việt có âm gần giống /e/ (“e”) và /ʌ/ (“ă / â”), nhưng **không có /æ/**, nên người Việt hay đọc cả bad lẫn bed thành “bét”. Tập 2 Ngày 8 đã so /æ/ – /ʌ/ – /ɑː/; hôm nay thêm /e/ và luyện thành bộ ba.",
    },
    {
      t: "table",
      caption: "Ba nguyên âm — miệng làm gì",
      head: ["Âm", "Cách đọc", "Chữ viết hay gặp", "Từ chủ đề giáo dục"],
      rows: [
        ["**/æ/**", "Miệng mở **rộng nhất**, kéo hai khoé môi sang ngang, lưỡi thấp ở phía trước. Bắt đầu như “e” rồi há thêm như “a”.", "**a**: bad, exam, class (giọng Mỹ)", "ex**a**m · m**a**ths · pr**a**ctical · **a**cademic · gr**a**duate · h**a**ndbook"],
        ["**/e/**", "Miệng mở **vừa**, môi thả lỏng. Gần chữ “e” tiếng Việt nhưng ngắn hơn.", "**e**: bed, test · **ea**: head, read (quá khứ) · **a**: many, any · **ai**: said", "t**e**st · l**e**sson · t**e**xtbook · **e**ducation · s**e**condary · ass**e**ssment"],
        ["**/ʌ/**", "Miệng mở **ít**, lưỡi ở **giữa**, thả lỏng hoàn toàn. Gần “ă” ngắn. **Không tròn môi**.", "**u**: bud, study · **o**: money, month, some · **ou**: young, enough, country", "st**u**dy · s**u**bject · p**u**blic · res**u**lt · **o**ther · en**ou**gh · c**ou**ntry"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với /æ/ – /e/ – /ʌ/",
      items: [
        "Đọc /æ/ thành /e/: **bad** → “bed”, **man** → “men”, **exam** → “ex-em”. Chữa: há miệng rộng hơn hẳn, giữ dài hơn một chút.",
        "Đọc /ʌ/ theo mặt chữ: **study** → “stu-đi” (âm u), **money** → “mô-ni”, **country** → “cao-tri”. Chữ **u** và **o** ở đây đều là /ʌ/.",
        "**many** /ˈmeni/ và **any** /ˈeni/ đọc /e/ chứ không phải /æ/; **said** /sed/ không phải “sây-đ”.",
      ],
    },
    {
      t: "phatam",
      id: "t3d2-phat-am",
      title: "Luyện phát âm /æ/ – /e/ – /ʌ/",
      note: "Dòng 1–4: bộ ba tối thiểu — đọc chậm, ba từ phải nghe KHÁC nhau (há rộng → vừa → ít). Dòng 5–6: cặp dễ lẫn. Dòng 7–10: câu về việc học — giữ đúng nguyên âm khi nói nhanh.",
      items: [
        { text: "bad, bed, bud", ipa: "bæd bed bʌd", vi: "tệ · cái giường · nụ hoa" },
        { text: "pan, pen, pun", ipa: "pæn pen pʌn", vi: "cái chảo · cái bút · trò chơi chữ" },
        { text: "bag, beg, bug", ipa: "bæɡ beɡ bʌɡ", vi: "cái túi · van xin · con bọ / lỗi phần mềm" },
        { text: "track, trek, truck", ipa: "træk trek trʌk", vi: "đường ray · chuyến đi bộ dài · xe tải" },
        { text: "cap, cup, cat, cut, match, much, ankle, uncle", ipa: "kæp kʌp kæt kʌt mætʃ mʌtʃ æŋkl ʌŋkl", vi: "/æ/ rồi /ʌ/: há rộng → gần như khép" },
        { text: "pen, pan, bet, bat, send, sand, many, money", ipa: "pen pæn bet bæt send sænd meni mʌni", vi: "/e/ rồi /æ/; cặp cuối /e/ – /ʌ/: many ≠ money" },
        { text: "My best subject was maths, but I had to study a lot.", ipa: "maɪ best sʌbdʒɪkt wəz mæθs bʌt aɪ hæd tə stʌdi ə lɒt", vi: "best /e/ · subject, but, study /ʌ/ · maths, had /æ/" },
        { text: "Many young students have enough money for lunch.", ipa: "meni jʌŋ stjuːdnts hæv ɪnʌf mʌni fə lʌntʃ", vi: "many /e/ · young, enough, money, lunch /ʌ/ · have /æ/" },
        { text: "The exam was much better than I had expected.", ipa: "ði ɪɡzæm wəz mʌtʃ betə ðən aɪ hæd ɪkspektɪd", vi: "exam, had /æ/ · much /ʌ/ · better, expected /e/" },
        { text: "My uncle is a maths teacher in a public secondary school.", ipa: "maɪ ʌŋkl ɪz ə mæθs tiːtʃə ɪn ə pʌblɪk sekəndri skuːl", vi: "uncle, public /ʌ/ · maths /æ/ · secondary /e/" },
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Luyện nói — AI chấm 4 tiêu chí" },
    {
      t: "p",
      text: "Làm theo thứ tự thi thật. Mỗi câu Part 1 nói **15–20 giây**; Part 2 chuẩn bị 1 phút rồi nói **gần 2 phút**; mỗi câu Part 3 nói **30–45 giây**. Sau khi AI chấm, chọn **một** câu trả lời để chép vào sổ Speaking.",
    },
    {
      t: "speak",
      id: "t3d2-noi-p1",
      part: "1",
      questions: [
        "Do you work or are you a student?",
        "What do you like most about your studies?",
        "Is there anything about your studies that you find difficult?",
        "How long have you been learning English?",
        "Did you enjoy your time at secondary school? Why or why not?",
        "What would you like to study in the future?",
      ],
    },
    {
      t: "speak",
      id: "t3d2-noi-p2",
      part: "2",
      questions: [
        "Describe a subject you enjoyed studying at school. You should say: what the subject was, who taught it, what you did in the lessons, and explain why you enjoyed it.",
        "Describe a teacher who helped you a lot. You should say: who the teacher was, what he or she taught, how he or she helped you, and explain why you still remember this teacher.",
      ],
    },
    {
      t: "speak",
      id: "t3d2-noi-p3",
      part: "3",
      questions: [
        "Do you think schools should teach more practical skills? Why?",
        "How has education changed in your country in the last twenty years?",
        "Why do some students lose interest in school?",
        "Is it better to study alone or in a group?",
        "Do you think exams are the best way to measure what students have learned?",
      ],
    },
    {
      t: "note",
      title: "Tự chấm sau khi nghe lại bản ghi — 9 câu hỏi",
      items: [
        "**FC:** Mỗi câu Part 1 có ≥ 2 câu không? Part 2 có qua 1 phút 30 không? Có đoạn im quá 3 giây không?",
        "**LR:** Có dùng được ≥ 3 từ / cụm của bài 1 hôm nay không? Có lần nào nói vòng thay vì im không?",
        "**GRA:** Kể chuyện cũ có ở quá khứ không? Có ít nhất một câu với because / when / if / which không?",
        "**P:** Nghe được âm cuối -s, -t, -d không? exam, study, many có đúng nguyên âm không?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập Ngày 2 ─────────────────────────── */

const T3D2_HOMEWORK: Lesson = {
  id: "t3d2-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 2",
  goal: "Ôn trọn Ngày 2: dùng đúng dạng và đúng cụm của họ từ AWL sublist 3 và từ chủ đề giáo dục; nhận ra một câu / một đoạn mất điểm ở tiêu chí nào và gắn mã lỗi; nâng câu band 5 lên band 6; chọn câu trả lời Speaking tốt hơn; phân biệt /æ/ – /e/ – /ʌ/.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (43 câu + 1 đoạn viết + 3 câu nói)",
      items: [
        "**I–III · Từ vựng (24 câu):** dạng từ, collocation, dịch. Sai nhiều ở giới từ đi kèm → đọc lại khung “Người Việt hay sai với họ từ sublist 3”.",
        "**IV–V · Viết (11 câu + 1 đoạn):** tiêu chí, mã lỗi, sửa câu band 5; rồi tự viết lại một thân bài qua bản 2 và bản 3.",
        "**VI · Nói (4 câu + 3 câu ghi âm):** chọn câu trả lời gần band 6; ghi âm và chép vào sổ Speaking.",
        "**VII · Âm (4 câu):** /æ/ – /e/ – /ʌ/.",
        "Đạt khi đúng **≥ 30/43 (70 %)**.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 2 trước khi làm bài",
      center: "Ngày 2",
      branches: [
        { label: "**AWL sublist 3**", items: ["contribute to + V-ing", "rely on · emphasis on", "criterion → criteria", "technology / technique / technical"] },
        { label: "**Giáo dục**", items: ["curriculum · tuition fees", "vocational training", "acquire knowledge · sit an exam", "job prospects · heavy workload"] },
        { label: "**Writing band 6**", items: ["đủ mọi vế đề", "lập trường mở bài = kết bài", "mỗi đoạn 1 ý + vì sao + ví dụ", "lỗi không cản hiểu"] },
        { label: "**Công cụ**", items: ["12 câu tự chấm", "sổ lỗi: A S T P W L C I", "bản 1 → 2 (câu) → 3 (ý)", "tái tạo bài mẫu"] },
        { label: "**Speaking band 6**", items: ["trả lời + lý do + ví dụ + chốt", "Well · Actually · Having said that", "nói vòng khi quên từ", "sổ Speaking"] },
      ],
    },

    { t: "h", text: "I. Điền đúng dạng của từ trong ngoặc (10 câu)" },
    {
      t: "quiz",
      id: "t3d2-bt-ho-tu",
      title: "I. Dạng từ — AWL sublist 3",
      kind: "fill",
      items: [
        { q: "1. There was a ___ (CONSIDER) rise in the number of overseas students.", answers: ["considerable"] },
        { q: "2. Reading for pleasure makes a major ___ (CONTRIBUTE) to vocabulary growth.", answers: ["contribution"] },
        { q: "3. The scheme was ___ (INITIAL) tested in ten schools.", answers: ["initially"] },
        { q: "4. Students need more ___ (INTERACT) with native speakers.", answers: ["interaction"] },
        { q: "5. The ___ (PROPORTION) of graduates in work rose to 85%. (giữ nguyên hay đổi?)", answers: ["proportion"] },
        { q: "6. Information on the Internet is not always ___ (RELY).", answers: ["reliable"] },
        { q: "7. The new library is ___ (LOCATION) next to the science block.", answers: ["located"] },
        { q: "8. The teacher gave a clear ___ (DEMONSTRATE) of the experiment.", answers: ["demonstration"] },
        { q: "9. The report has serious ___ (IMPLY) for rural schools.", answers: ["implications"] },
        { q: "10. Good teachers are ___ (CONSTANT) looking for new ways to motivate their students. (= luôn luôn)", answers: ["constantly"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án I",
      items: [
        "1 a + tính từ + rise → considerable. 2 a major + danh từ → contribution (**to**). 3 trạng từ bổ nghĩa tested → initially. 4 more + danh từ → interaction (**with**). 5 The … of → danh từ; proportion đã là danh từ, giữ nguyên — không phải từ nào trong ngoặc cũng phải đổi. 6 not always + tính từ → reliable. 7 is … next to → bị động located. 8 a clear + danh từ → demonstration. 9 serious + danh từ số nhiều → implications (**for**). 10 trạng từ → constantly.",
      ],
    },

    { t: "h", text: "II. Chọn từ / cụm đúng (8 câu)" },
    {
      t: "mcq",
      id: "t3d2-bt-colloc",
      title: "II. Collocation và nghĩa",
      items: [
        { q: "Regular reading contributes to ___ a wider vocabulary.", options: ["build", "builds", "building", "built"], correct: 2, why: "contribute **to** — to là giới từ → + V-ing: contributes to **building**. ~~contribute to build~~ là lỗi rất hay gặp ở band 5–6." },
        { q: "Universities should place more ___ on practical skills.", options: ["emphasis", "outcome", "criteria", "link"], correct: 0, why: "**place emphasis on**." },
        { q: "She won a ___ to study medicine in Australia.", options: ["tuition", "scholarship", "qualification", "curriculum"], correct: 1, why: "**win a scholarship** = giành học bổng." },
        { q: "Students who miss classes soon ___ behind.", options: ["drop", "keep", "catch", "fall"], correct: 3, why: "**fall behind** = tụt lại. drop out = bỏ học; keep up = theo kịp; catch up = đuổi kịp." },
        { q: "Teachers use a range of ___ to keep pupils interested.", options: ["technologies", "technicals", "techniques", "technicians"], correct: 2, why: "technique = cách làm, phương pháp. technology = công nghệ; technician = kỹ thuật viên; technical là tính từ, không có số nhiều." },
        { q: "The essay did not meet two of the four ___.", options: ["criteria", "criterion", "criterias", "criterions"], correct: 0, why: "two of the four + số nhiều → **criteria** (số ít: criterion)." },
        { q: "A degree does not always ___ a good job.", options: ["insure", "ensure", "assure", "sure"], correct: 1, why: "**ensure** sth = bảo đảm điều gì. insure = mua bảo hiểm; assure sb = cam đoan với ai." },
        { q: "Schools need ___ funding — that is, enough money — to hire more teachers.", options: ["considerate", "constant", "corporate", "sufficient"], correct: 3, why: "**sufficient funding** = đủ kinh phí (= enough money). considerate = chu đáo (dễ lẫn với considerable); constant = liên tục; corporate = của doanh nghiệp — không mang nghĩa “đủ”." },
      ],
    },

    { t: "h", text: "III. Dịch sang tiếng Anh (6 câu)" },
    {
      t: "quiz",
      id: "t3d2-bt-dich",
      title: "III. Dịch Việt → Anh — từ vựng và khung câu hôm nay",
      kind: "translate",
      grammar: "rely on · a heavy workload · gain hands-on experience · I partly agree: …, but … · As a result, … · The main reason is that …",
      items: [
        { q: "Nhiều sinh viên dựa vào cha mẹ để trả học phí.", answers: ["Many students rely on their parents to pay their tuition fees.", "Many students rely on their parents to pay tuition fees.", "Many students rely on their parents to pay the tuition fees.", "Many students rely on their parents for their tuition fees.", "Many students rely on their parents for tuition fees.", "Many students depend on their parents to pay their tuition fees."], hint: "rely on … to pay · tuition fees" },
        { q: "Học sinh cấp ba ở nước tôi có bài vở rất nặng.", answers: ["High school students in my country have a very heavy workload.", "Secondary school students in my country have a very heavy workload.", "High school students in my country have a heavy workload.", "Secondary school students in my country have a heavy workload."], hint: "have a (very) heavy workload" },
        { q: "Thực tập giúp sinh viên có được kinh nghiệm thực hành.", answers: ["Internships help students gain hands-on experience.", "Internships help students to gain hands-on experience.", "Internships help students get hands-on experience.", "Internships help students gain practical experience.", "Internships help students to gain practical experience."], hint: "internships · gain hands-on experience" },
        { q: "Tôi đồng ý một phần: thi cử là cần thiết, nhưng không nên là cách đánh giá duy nhất.", answers: ["I partly agree: exams are necessary, but they should not be the only form of assessment.", "I partly agree: exams are necessary, but they should not be the only way of assessment.", "I partly agree: exams are necessary, but they should not be the only method of assessment.", "I partly agree: exams are necessary, but they should not be the only way to assess students.", "I partly agree: exams are necessary, but they shouldn't be the only form of assessment.", "I partly agree: exams are necessary, but they should not be the only way of assessing students."], hint: "I partly agree: … , but they should not be the only form of assessment" },
        { q: "Học phí đã tăng mạnh. Kết quả là nhiều học sinh quyết định không vào đại học.", answers: ["Tuition fees have risen sharply. As a result, many students decide not to go to university.", "Tuition fees have increased sharply. As a result, many students decide not to go to university.", "Tuition fees have risen sharply. As a result, many students have decided not to go to university.", "Tuition fees have risen sharply. As a result, many students are deciding not to go to university.", "Tuition fees have increased sharply. As a result, many students have decided not to go to university.", "Tuition fees have risen sharply. As a result, many students decide not to enter university."], hint: "have risen sharply · As a result, · decide not to go to university" },
        { q: "Lý do chính là chương trình học đặt quá nhiều trọng tâm vào học vẹt.", answers: ["The main reason is that the curriculum places too much emphasis on rote learning.", "The main reason is that the curriculum puts too much emphasis on rote learning."], hint: "The main reason is that · curriculum · place emphasis on · rote learning" },
      ],
    },

    { t: "h", text: "IV. Viết — tiêu chí, mã lỗi và câu band 6 (6 câu)" },
    {
      t: "mcq",
      id: "t3d2-bt-viet",
      title: "IV. Chọn đáp án đúng",
      items: [
        { q: "Theo band descriptors, điều nào là đặc điểm của **Task Response band 6** (không phải band 5)?", options: ["Trả lời đề chỉ một phần", "Trả lời đủ mọi phần của đề, quan điểm rõ", "Không có lỗi ngữ pháp nào", "Dùng ít nhất mười từ học thuật"], correct: 1, why: "Band 6: “trả lời **đủ mọi phần**… quan điểm rõ”. Band 5: “chỉ một phần”. Không descriptor nào đếm số từ học thuật hay đòi không lỗi." },
        { q: "Theo band descriptors, **GRA band 6** cho phép điều gì?", options: ["Chỉ dùng câu đơn, không lỗi", "Lỗi thường xuyên gây khó hiểu", "Không được có lỗi dấu câu", "Có lỗi, nhưng hiếm khi làm sai nghĩa"], correct: 3, why: "Band 6: trộn câu đơn và câu phức, có lỗi nhưng hiếm khi cản hiểu. Chỉ dám viết câu đơn thì dừng ở band 5." },
        { q: "Câu nào là **thesis có mức độ** cho đề “Children should start school at the age of four. To what extent do you agree?”", options: ["Nowadays, education is very important in our society.", "This essay will discuss this issue.", "I largely disagree: although an early start has some benefits, four is too young for formal lessons.", "There are both advantages and disadvantages."], correct: 2, why: "C nêu **lập trường + mức độ + lý do tóm tắt**. A là câu mở chung chung; B, D không có lập trường — TR band 5." },
        { q: "Lỗi trong câu “Government should spend more money for education.” mang mã nào?", options: ["A (thiếu the) và P (for → on)", "T và S", "L và C", "Chỉ W"], correct: 0, why: "**The** government (mã A) · spend money **on** (mã P)." },
        { q: "Đâu là thứ tự đúng khi viết lại một bài?", options: ["Thêm ý mới → sửa ngữ pháp → đổi lập trường", "Sửa câu (bản 2) → sửa ý (bản 3)", "Sửa ý → sửa câu", "Viết lại từ đầu bằng một đề khác"], correct: 1, why: "Lượt 1 sửa **câu** cho bài sạch lỗi, lượt 2 sửa **ý**. Làm ngược thì câu mới thêm vào lại mang lỗi cũ." },
        { q: "Câu nào phát triển ý tốt nhất sau câu chủ đề “Online learning suits working adults.”?", options: ["It is very good and very convenient for them.", "Moreover, online learning is popular. Furthermore, it is modern.", "Online learning is suitable for adults who work.", "Because lessons are recorded, they can study after work instead of giving up their jobs; a colleague of mine finished her degree this way in three years."], correct: 3, why: "D có **vì sao** (because… recorded), **hệ quả** (study after work instead of giving up their jobs) và **ví dụ cụ thể**. A chỉ khen; B liệt kê; C lặp lại câu chủ đề." },
      ],
    },

    { t: "h", text: "V. Nâng câu band 5 lên band 6 (5 câu) + viết lại một đoạn" },
    {
      t: "quiz",
      id: "t3d2-bt-sua",
      title: "V. Mỗi câu có một lỗi in đậm — gõ lại phần đúng",
      kind: "fill",
      items: [
        { q: "1. Practical skills **is** very useful for teenagers. → Practical skills ___ very useful for teenagers.", answers: ["are"] },
        { q: "2. Part-time jobs contribute to **improve** students' confidence. → contribute to ___ students' confidence.", answers: ["improving"] },
        { q: "3. Schools should put more emphasis **in** teamwork. → more emphasis ___ teamwork.", answers: ["on"] },
        { q: "4. Students **learn knowledge** from many sources. → Students ___ knowledge from many sources. (một động từ)", answers: ["acquire", "gain", "obtain"] },
        { q: "5. Children today are under a lot of **pressures**. → under a lot of ___.", answers: ["pressure"] },
      ],
    },
    {
      t: "p",
      text: "**Viết lại một đoạn.** Dưới đây là một thân bài band 5 cho đề “University education should be free for all students. Do you agree or disagree?”. Viết **bản 3** (sửa câu rồi sửa ý) dài 90–110 từ: một câu chủ đề trả lời đề → vì sao → một ví dụ cụ thể → câu chốt. — **Bản gốc:** Firstly, free university is good for poor student. Because they don't have money to pay. Moreover, they must working part time and they tired. Furthermore, the country will have more educated people and it is good for economy.",
    },
    {
      t: "essay",
      id: "t3d2-bt-viet-lai",
      task: "Task 2",
      prompt: "Rewrite this body paragraph (band 5 → band 6) in 90–110 words. Prompt: “University education should be free for all students. Do you agree or disagree?” — Original: Firstly, free university is good for poor student. Because they don't have money to pay. Moreover, they must working part time and they tired. Furthermore, the country will have more educated people and it is good for economy.",
      minWords: 90,
      tips: [
        "Bản 2 — sửa câu: student → students (S) · Because… đứng một mình (C) · must working → have to work (W) · they tired → they are tired (C — câu thiếu động từ) · bỏ Firstly / Moreover / Furthermore (L) · the economy (A).",
        "Bản 3 — sửa ý: chọn MỘT ý (cơ hội cho sinh viên nghèo HOẶC lợi ích kinh tế), đẩy tới hệ quả bằng As a result / which means that, thêm một ví dụ có người – thời gian – kết quả.",
        "Dùng 3 từ của hôm nay: tuition fees, equal access to, fall behind, drop out, job prospects, exclude…",
      ],
    },

    { t: "h", text: "VI. Nói — chọn câu trả lời gần band 6 (4 câu) + ghi âm" },
    {
      t: "mcq",
      id: "t3d2-bt-noi",
      title: "VI. Chọn A, B hoặc C",
      items: [
        { q: "Examiner: “What was your favourite subject at school?”", options: ["A. My favourite subject is English. It is interesting.", "B. English is an international language which plays an important role in the modern world.", "C. It was probably geography. I had a teacher who had travelled a lot, so her lessons were full of stories, and I've been interested in maps ever since."], correct: 2, why: "C trả lời về **bạn**, đúng thì quá khứ, có lý do và chi tiết; dùng had travelled, I've been interested… ever since. A sai thì (is) và quá ngắn. B là câu thuộc lòng, không trả lời câu hỏi." },
        { q: "Từ nối nào hợp khi NÓI để thêm một ý?", options: ["A. Furthermore,", "B. And another thing is…", "C. In addition to the aforementioned point,"], correct: 1, why: "Khi nói dùng **also / and another thing is / plus**. Furthermore và câu C là văn viết — nghe như đọc bài." },
        { q: "Bạn quên từ “dissertation”. Câu nào là nói vòng tốt?", options: ["A. …I had to write, er, the long piece of research you do in your final year…", "B. …I had to write… sorry, I don't know.", "C. …I had to write a… a… a…"], correct: 0, why: "A tả **nó là gì** (bài nghiên cứu dài làm ở năm cuối) rồi đi tiếp — nói vòng thành công." },
        { q: "Theo band descriptors, đặc điểm nào thuộc **Fluency & Coherence band 6**?", options: ["A. Nói không bao giờ ngập ngừng", "B. Chỉ trả lời rất ngắn để tránh lỗi", "C. Sẵn lòng nói dài, dù đôi lúc mất mạch vì lặp hoặc tự sửa"], correct: 2, why: "Band 6 **cho phép** ngập ngừng và tự sửa; điều cần có là **sẵn lòng nói dài**. Trả lời ngắn để tránh lỗi là chiến thuật kéo điểm xuống." },
      ],
    },
    {
      t: "speak",
      id: "t3d2-bt-noi-ghi",
      part: "3",
      questions: [
        "Some people say that students should be taught how to manage money at school. What do you think?",
        "What are the advantages of studying at a university far from home?",
        "Do you think teachers will be replaced by technology in the future?",
      ],
    },
    {
      t: "note",
      title: "Sau khi ghi âm",
      items: [
        "Chọn **một** trong ba câu, chép nguyên văn vào **sổ Speaking**, sửa bằng bút khác màu theo khung: trả lời → because → For example → Having said that → So overall.",
        "Ghi sẵn **một câu hỏi vặn** để ngày mai tự hỏi lại (vd: “But can't parents teach that at home?”).",
      ],
    },

    { t: "h", text: "VII. /æ/, /e/ hay /ʌ/? (4 câu)" },
    {
      t: "mcq",
      id: "t3d2-bt-am",
      title: "VII. Chọn từ có nguyên âm được hỏi",
      items: [
        { q: "Từ nào có âm **/ʌ/**?", options: ["money", "many", "manner", "menu"], correct: 0, why: "money /ˈmʌni/. many /ˈmeni/ và menu /ˈmenjuː/ có /e/; manner /ˈmænə/ có /æ/." },
        { q: "Từ nào có âm **/æ/**?", options: ["said", "study", "exam", "enough"], correct: 2, why: "exam /ɪɡˈzæm/. said /sed/ có /e/; study /ˈstʌdi/ và enough /ɪˈnʌf/ có /ʌ/." },
        { q: "Từ nào có âm **/e/** ở âm tiết được nhấn?", options: ["subject", "practical", "public", "lesson"], correct: 3, why: "lesson /ˈlesn/. subject /ˈsʌbdʒɪkt/ và public /ˈpʌblɪk/ có /ʌ/; practical /ˈpræktɪkl/ có /æ/." },
        { q: "Cặp nào là hai từ **khác nhau chỉ ở nguyên âm /æ/ – /ʌ/**?", options: ["bed – bad", "match – much", "pen – pan", "many – money"], correct: 1, why: "match /mætʃ/ – much /mʌtʃ/. bed – bad và pen – pan là /e/ – /æ/; many – money là /e/ – /ʌ/." },
      ],
    },
  ],
};

export const NGAY_2: Lesson[] = [T3D2_VOCAB, T3D2_WRITING, T3D2_SPEAKING, T3D2_HOMEWORK];
