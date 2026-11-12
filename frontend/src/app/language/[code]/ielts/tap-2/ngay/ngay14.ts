/**
 * IELTS Tập 2 — Ngày 14 (tự soạn 12/11/2026, không chụp sách; mọi câu ví dụ, bài đọc, bài mẫu, câu bài tập đều VIẾT MỚI).
 *   Bài 1 · Từ vựng: AWL sublist 2 (30 họ còn lại, institute → transfer) + Du lịch & lữ hành   [VB2 VC13 VD3]
 *   Bài 2 · Đọc: Sentence completion 2 — mức Passage 2 (+ TFNG ôn)                           [R01 R05 R17 R18 R21]
 *   Bài 3 · Viết: Problem / solution · cause / effect (+ solution) — hai bài mẫu trọn         [W06 W15 W18]
 *   Bài tập Ngày 14 (40 câu + 1 đoạn viết).
 *   Phát âm (thêm, đề cương không ghi âm cho ngày chẵn): nguyên âm dài /ɜː/ — trong bài Từ vựng.
 * Nguồn sự thật: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng 14. AWL sublist 2 chia đôi theo ABC: Ngày 10 dạy achieve → injure,
 * Ngày 14 dạy institute → transfer.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const T2D14_VOCAB: Lesson = {
  id: "t2d14-tu-vung",
  kind: "vocab",
  title: "Từ vựng: AWL sublist 2 (phần 2) + Du lịch & lữ hành",
  goal: "Dùng đúng dạng (danh – động – tính – trạng) của 30 họ từ học thuật AWL sublist 2 phần 2 và 30 từ / cụm chủ đề Du lịch trong câu Task 2 và câu trả lời Speaking — đẩy tiêu chí Lexical Resource từ band 4.5 lên 5.0–5.5.",
  minutes: 80,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**AWL** (Academic Word List) = 570 họ từ hay gặp nhất trong văn bản học thuật. Hôm nay học **30 họ còn lại của sublist 2** (institute → transfer); 30 họ đầu đã học ở **Ngày 10**.",
        "Học **cả họ từ**, không học một chữ: perceive → **perception** · regulate → **regulation** · reside → **resident**. Chú ý **trọng âm dời chỗ** khi đổi dạng (**STRA**tegy → stra**TE**gic).",
        "Chủ đề **Du lịch & lữ hành** (Travel & tourism): 20 từ + 10 cụm từ / cụm động từ + 5 họ từ + 4 câu mẫu ăn điểm — dùng ngay ở bài Viết hôm nay (overtourism) và Speaking Part 1–3 (holidays, travel).",
        "Đẩy band nào? **Lexical Resource** (Writing + Speaking): band 5 = đủ từ cho đề nhưng hạn chế; band 5.5–6 = **dám dùng từ ít gặp** + **collocation đúng** (carry out a survey, impose restrictions, put pressure on infrastructure).",
        "Phát âm (thêm): nguyên âm dài **/ɜː/** — journal, journey, purchase, survey, excursion.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. AWL là gì và học họ từ thế nào cho nhớ" },
    {
      t: "p",
      text: "**AWL — Academic Word List** (Danh sách từ học thuật) do nhà ngôn ngữ học **Averil Coxhead** công bố năm **2000**. Bà đếm từ trong khoảng 3,5 triệu chữ của sách và bài báo đại học, rồi chọn ra **570 họ từ** (word families) xuất hiện nhiều ở **mọi ngành** nhưng **không** nằm trong 2.000 từ thông dụng nhất. Danh sách chia thành **10 sublist** (danh sách con): sublist 1 gặp nhiều nhất, sublist 10 ít nhất; mỗi sublist 60 họ (sublist 10 có 30 họ).",
    },
    {
      t: "p",
      text: "Vì sao người thi IELTS cần AWL? Bài **Reading** Academic được lấy từ sách báo học thuật — AWL chiếm khoảng **10 %** số chữ trong đó. Ở **Writing Task 2**, giám khảo chấm Lexical Resource: một bài chỉ có từ đời thường (get, big, many, thing) khó vượt band 5. Thay **get** bằng **obtain**, **choose** bằng **select**, **main** bằng **primary** đúng chỗ là cách nhanh nhất để văn trông học thuật hơn.",
    },
    {
      t: "table",
      caption: "AWL trong Tập 2 — hôm nay đi tới đâu",
      head: ["Ngày", "Phần AWL", "Số họ"],
      rows: [
        ["Ngày 2 + Ngày 4", "Sublist 1 (analyse, approach, area, assess…)", "60"],
        ["Ngày 10", "Sublist 2 phần 1 (achieve → injure)", "30"],
        ["**Ngày 14 (hôm nay)**", "**Sublist 2 phần 2 (institute → transfer)**", "**30**"],
        ["Tập 3", "Sublist 3 – 6", "240"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Học một họ từ trong 4 bước",
      caption: "Đừng chép nghĩa tiếng Việt rồi thôi: một từ chỉ “dùng được” khi bạn biết nó đi với từ nào và đặt được câu Task 2 với nó.",
      steps: [
        { label: "1. Nhận họ", sub: "perceive (v) → perception (n) → perceptive (adj)" },
        { label: "2. Nghe trọng âm", sub: "per**CEIVE** → per**CEP**tion — đọc to 3 lần" },
        { label: "3. Nhớ collocation", sub: "**public perception of** sth · **perceive sth as** …" },
        { label: "4. Đặt 1 câu Task 2", sub: "Tourism is often **perceived as** an easy way to create jobs." },
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "30 họ từ hôm nay — chia 5 nhóm nghĩa",
      caption: "Học theo nhóm nghĩa dễ nhớ hơn học theo ABC. Mỗi nhánh là một mục 2a–2e bên dưới.",
      center: "**AWL sublist 2 — phần 2**",
      branches: [
        { label: "2a. Nghiên cứu & thông tin", items: ["survey · journal · text", "item · relevant · previous"], anh: "magnifying-glass-tilted-right" },
        { label: "2b. Hành động & lựa chọn", items: ["select · seek · obtain", "purchase · transfer · participate"], anh: "check-mark-button" },
        { label: "2c. Tổ chức & quản lý", items: ["institute · regulate · restrict", "maintain · secure · strategy"], anh: "gear" },
        { label: "2d. Khả năng & đánh giá", items: ["potential · positive · normal", "primary · perceive · range"], anh: "light-bulb" },
        { label: "2e. Nơi chốn & nguồn lực", items: ["region · site · reside", "resource · invest · tradition"], anh: "globe-showing-asia-australia" },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. AWL sublist 2 (phần 2) — 30 họ từ" },
    {
      t: "p",
      text: "Mỗi thẻ dưới đây ghi **một dạng hay dùng nhất** của họ; dòng mở rộng ghi **các dạng còn lại**, **collocation** và **lỗi hay gặp**. Từ nào đã gặp ở Tập 1 thì thẻ ghi rõ — hôm nay học **thêm dạng mới / cách dùng mới**. Bảng tổng ở cuối mục để tra nhanh.",
    },
    { t: "h", text: "2a. Nghiên cứu & thông tin" },
    {
      t: "vocab",
      items: [
        { w: "survey", pos: "n / v", ipa: "/ˈsɜːveɪ/ (n) · /səˈveɪ/ (v)", vi: "cuộc khảo sát; khảo sát", ex: "A recent survey found that most young tourists book their trips on their phones.", exVi: "Một cuộc khảo sát gần đây cho thấy phần lớn du khách trẻ đặt chuyến đi bằng điện thoại.", more: "Danh từ nhấn âm 1 (**SUR**vey), động từ nhấn âm 2 (sur**VEY**). Collocation: **carry out / conduct a survey** · a survey **of** 500 people · the survey **shows / found that** … ~~make a survey~~. Họ: **surveyor** (người khảo sát, đo đạc)." },
        { w: "journal", pos: "n", ipa: "/ˈdʒɜːnl/", vi: "tạp chí chuyên ngành (khoa học); sổ nhật ký", ex: "The study was published in a respected medical journal.", exVi: "Nghiên cứu được đăng trên một tạp chí y khoa có uy tín.", more: "Họ: **journalist** /ˈdʒɜːnəlɪst/ (nhà báo) · **journalism** (nghề báo). Collocation: **an academic / scientific journal** · **publish in** a journal · **keep a journal** (ghi nhật ký). Khác **magazine** (tạp chí giải trí)." },
        { w: "text", pos: "n / v", ipa: "/tekst/", vi: "văn bản; tin nhắn; nhắn tin", ex: "Read the whole text quickly before you look at the questions.", exVi: "Đọc lướt cả văn bản trước khi xem câu hỏi.", more: "Động từ **text** = nhắn tin: I'll **text** you the address. Họ: **textbook** (sách giáo khoa) · **textual** /ˈtekstʃuəl/ (thuộc văn bản, ít dùng). Collocation: **a short text** · **send / receive a text**." },
        { w: "item", pos: "n", ipa: "/ˈaɪtəm/", vi: "món, mục, khoản (trong một danh sách)", ex: "Each passenger may carry one item of hand luggage.", exVi: "Mỗi hành khách được mang một kiện hành lý xách tay.", more: "Dùng **an item of** để đếm danh từ **không đếm được**: ~~a luggage~~ → **an item of luggage** · **an item of clothing / news / furniture**. Họ: **itemise** (liệt kê từng khoản) · **an itemised bill**." },
        { w: "relevant", pos: "adj", ipa: "/ˈreləvənt/", vi: "liên quan, đúng trọng tâm", ex: "Every example in your essay must be relevant to the question.", exVi: "Mọi ví dụ trong bài luận phải liên quan đến câu hỏi.", more: "Luôn **relevant TO** sth (~~relevant with~~). Họ: **relevance** (n) · **irrelevant** (lạc đề — lỗi làm tụt Task Response). Collocation: **highly / directly relevant** · **relevant information / experience**." },
        { w: "previous", pos: "adj", ipa: "/ˈpriːviəs/", vi: "trước đó, lần trước", ex: "Visitor numbers were 20% higher than in the previous year.", exVi: "Số du khách cao hơn 20 % so với năm trước đó.", more: "Họ: **previously** (adv) = trước đây. Collocation: **the previous year / day / owner** · **previous experience**. Task 1: **compared with the previous year**. Luôn có danh từ đi sau: ~~the previous~~ đứng một mình là sai." },
      ],
    },
    { t: "h", text: "2b. Hành động & lựa chọn" },
    {
      t: "vocab",
      items: [
        { w: "select", pos: "v", ipa: "/sɪˈlekt/", vi: "chọn lọc, tuyển chọn (trang trọng hơn choose)", ex: "Only twenty students were selected for the exchange programme.", exVi: "Chỉ hai mươi sinh viên được chọn vào chương trình trao đổi.", more: "(đã gặp Tập 1 — nay học cả họ) **selection** /sɪˈlekʃn/ (sự lựa chọn; tuyển tập) · **selective** (kén chọn). Collocation: **carefully selected** · **a wide selection of** · **be selected for** sth." },
        { w: "seek", pos: "v", ipa: "/siːk/", vi: "tìm kiếm, tìm cách (trang trọng)", ex: "More and more travellers seek quiet places instead of famous sights.", exVi: "Ngày càng nhiều người đi du lịch tìm những nơi yên tĩnh thay vì các thắng cảnh nổi tiếng.", more: "Bất quy tắc: **seek – sought – sought** /sɔːt/. Collocation: **seek help / advice / work** · **seek to** + V (cố gắng): The city **seeks to** reduce traffic. Họ: **seeker** (**job seeker** — người tìm việc). Không cần for: ~~seek for help~~ → **seek help**." },
        { w: "obtain", pos: "v", ipa: "/əbˈteɪn/", vi: "có được, lấy được (trang trọng của get)", ex: "Visitors must obtain a permit before they enter the national park.", exVi: "Du khách phải xin được giấy phép trước khi vào vườn quốc gia.", more: "Họ: **obtainable** (có thể có được). Collocation: **obtain information / permission / data / a visa**. Viết bài thì **obtain**, nói chuyện thường ngày thì **get** cho tự nhiên." },
        { w: "purchase", pos: "v / n", ipa: "/ˈpɜːtʃəs/", vi: "mua; món hàng đã mua", ex: "Tickets can be purchased online or at the station.", exVi: "Vé có thể mua trực tuyến hoặc tại nhà ga.", more: "(đã gặp Tập 1 — nay học thêm) danh từ cùng dạng: **make a purchase** · **purchaser** (người mua). Đọc /ˈpɜːtʃəs/ — đuôi **-chase** đọc /tʃəs/, KHÔNG đọc như chase /tʃeɪs/." },
        { w: "transfer", pos: "v / n", ipa: "/trænsˈfɜː(r)/ (v) · /ˈtrænsfɜː(r)/ (n)", vi: "chuyển (tiền, người, kiến thức); dịch vụ đưa đón", ex: "The hotel offers a free transfer from the airport.", exVi: "Khách sạn có xe đưa đón miễn phí từ sân bay.", more: "Động từ nhấn sau (trans**FER**), danh từ nhấn trước (**TRANS**fer). Quá khứ **transferred** (gấp đôi r). Họ: **transferable** (**transferable skills** — kỹ năng dùng được ở nhiều nghề). Collocation: **transfer money / data / skills**." },
        { w: "participate", pos: "v", ipa: "/pɑːˈtɪsɪpeɪt/", vi: "tham gia", ex: "Over two hundred volunteers participated in the beach clean-up.", exVi: "Hơn hai trăm tình nguyện viên tham gia buổi dọn rác bãi biển.", more: "Luôn **participate IN** sth (~~participate the event~~). Họ: **participant** /pɑːˈtɪsɪpənt/ (người tham gia) · **participation** /pɑːˌtɪsɪˈpeɪʃn/ (sự tham gia). Gần nghĩa đời thường: **take part in**." },
      ],
    },
    { t: "h", text: "2c. Tổ chức & quản lý" },
    {
      t: "vocab",
      items: [
        { w: "institution", pos: "n", ipa: "/ˌɪnstɪˈtjuːʃn/", vi: "cơ sở, tổ chức lớn (trường, ngân hàng, bệnh viện); thể chế", ex: "Universities and museums are important public institutions.", exVi: "Đại học và bảo tàng là những tổ chức công quan trọng.", more: "Họ: **institute** /ˈɪnstɪtjuːt/ (viện — **a research institute**) · **institutional** (adj). Trọng âm dời: **IN**stitute → insti**TU**tion. Collocation: **educational / financial institutions**." },
        { w: "regulate", pos: "v", ipa: "/ˈreɡjuleɪt/", vi: "điều tiết, quản lý bằng quy định", ex: "The council plans to regulate the number of holiday rentals.", exVi: "Hội đồng thành phố dự định điều tiết số căn hộ cho khách du lịch thuê.", more: "Họ: **regulation** /ˌreɡjuˈleɪʃn/ (quy định — đếm được: **strict regulations**) · **regulator** (cơ quan quản lý) · **regulatory**. Collocation: **introduce / tighten regulations** · **strictly regulated**." },
        { w: "restrict", pos: "v", ipa: "/rɪˈstrɪkt/", vi: "hạn chế, giới hạn", ex: "Some islands restrict the number of visitors each day.", exVi: "Một số hòn đảo giới hạn số du khách mỗi ngày.", more: "Họ: **restriction** (n) · **restrictive** (adj). Collocation: **impose / lift restrictions on** sth (áp đặt / dỡ bỏ hạn chế) · **restrict** sth **to** + số: Entry is **restricted to** 500 people a day." },
        { w: "maintain", pos: "v", ipa: "/meɪnˈteɪn/", vi: "duy trì; bảo dưỡng, giữ gìn", ex: "It is expensive to maintain old buildings in good condition.", exVi: "Giữ các toà nhà cổ trong tình trạng tốt rất tốn kém.", more: "(đã gặp **maintenance** ở Tập 1 — nay học động từ) chính tả: maint**ai**n → maint**e**nance /ˈmeɪntənəns/. Collocation: **maintain standards / a balance / a relationship** · **well-maintained** roads." },
        { w: "security", pos: "n", ipa: "/sɪˈkjʊərəti/", vi: "an ninh; sự an toàn, ổn định", ex: "Airport security checks can take more than an hour.", exVi: "Khâu kiểm tra an ninh sân bay có thể mất hơn một giờ.", more: "Họ: **secure** /sɪˈkjʊə(r)/ (adj: an toàn — keep your passport in a **secure** place; v: giành được — **secure a job / funding**) · **securely**. Collocation: **job security** (sự ổn định việc làm) · **security check / guard**. Trọng âm: se**CURE** → se**CU**rity." },
        { w: "strategy", pos: "n", ipa: "/ˈstrætədʒi/", vi: "chiến lược", ex: "The city needs a long-term strategy to manage tourism.", exVi: "Thành phố cần một chiến lược dài hạn để quản lý du lịch.", more: "Họ: **strategic** /strəˈtiːdʒɪk/ · **strategically**. Trọng âm dời: **STRA**tegy → stra**TE**gic. Collocation: **develop / adopt a strategy** · **an effective strategy** · **a strategy for** + N / **to** + V." },
      ],
    },
    { t: "h", text: "2d. Khả năng & đánh giá" },
    {
      t: "vocab",
      items: [
        { w: "potential", pos: "n / adj", ipa: "/pəˈtenʃl/", vi: "tiềm năng; có thể xảy ra", ex: "Tourism has the potential to create thousands of jobs in rural areas.", exVi: "Du lịch có tiềm năng tạo ra hàng nghìn việc làm ở nông thôn.", more: "Họ: **potentially** (adv). Collocation: **have the potential to** + V · **reach your (full) potential** · **potential customers / risks / benefits**." },
        { w: "positive", pos: "adj", ipa: "/ˈpɒzətɪv/", vi: "tích cực; chắc chắn", ex: "Tourism can have a positive impact on local communities.", exVi: "Du lịch có thể tác động tích cực đến cộng đồng địa phương.", more: "Trái nghĩa **negative**. Họ: **positively**. Collocation: **a positive effect / impact ON** · **a positive attitude** · **be positive (that)** = chắc chắn. Task 2: **On the positive side, …**" },
        { w: "normal", pos: "adj", ipa: "/ˈnɔːml/", vi: "bình thường", ex: "It is now normal for families to take two holidays a year.", exVi: "Giờ đây việc các gia đình đi nghỉ hai lần một năm là bình thường.", more: "Họ: **normally** (= usually) · **the norm** /nɔːm/ (điều thường thấy, chuẩn mực): Online booking has become **the norm**. · **abnormal** (bất thường). **return to normal** (trở lại bình thường)." },
        { w: "primary", pos: "adj", ipa: "/ˈpraɪməri/", vi: "chính, chủ yếu; (trường) tiểu học", ex: "The primary reason for the fall in visitors was the rise in air fares.", exVi: "Lý do chính khiến du khách giảm là giá vé máy bay tăng.", more: "Họ: **primarily** /praɪˈmerəli/ (= mainly, văn viết) · **prime** /praɪm/ (hàng đầu: **prime minister**). Collocation: **primary school** · **the primary cause / aim** · **of primary importance**." },
        { w: "perceive", pos: "v", ipa: "/pəˈsiːv/", vi: "nhận thức, cảm nhận, coi là", ex: "Many governments perceive tourism as an easy way to grow the economy.", exVi: "Nhiều chính phủ coi du lịch là cách dễ để phát triển kinh tế.", more: "Họ: **perception** /pəˈsepʃn/ (**public perception of** sth) · **perceptive** (sâu sắc, tinh ý). Cấu trúc **perceive sth as** + N / adj. Chính tả: per**cei**ve → per**cep**tion. Lưu ý: **per-** ở đây đọc /pə/ yếu, KHÔNG phải /ɜː/." },
        { w: "range", pos: "n", ipa: "/reɪndʒ/", vi: "loạt, dãy, phạm vi", ex: "The resort offers a wide range of activities for children.", exVi: "Khu nghỉ dưỡng có rất nhiều loại hoạt động cho trẻ em.", more: "(đã gặp cả danh từ lẫn động từ **range from … to …** ở Tập 1 Ngày 4 — nay ôn + thêm collocation) **a wide / broad range of** + N số nhiều · **price range** (khoảng giá) · **age range** (độ tuổi). ~~a big range~~ / ~~a long range of~~ → **a wide range of**." },
      ],
    },
    { t: "h", text: "2e. Nơi chốn & nguồn lực" },
    {
      t: "vocab",
      items: [
        { w: "region", pos: "n", ipa: "/ˈriːdʒən/", vi: "vùng, khu vực", ex: "The northern region attracts fewer tourists than the coast.", exVi: "Vùng phía bắc thu hút ít du khách hơn vùng ven biển.", more: "Họ: **regional** (adj — **regional airport**) · **regionally**. **in the region of** + số = khoảng: in the region of 2 million. g đọc mềm /dʒ/: **RE**-jən." },
        { w: "site", pos: "n", ipa: "/saɪt/", vi: "địa điểm, khu (di tích, công trường); trang web", ex: "The temple is one of the most visited sites in the country.", exVi: "Ngôi đền là một trong những địa điểm được ghé thăm nhiều nhất cả nước.", more: "Collocation: **a historic site** · **a building / construction site** · **on site** (tại chỗ) · **website**. Đừng nhầm **site** (địa điểm) với **sight** (cảnh đẹp) — cùng đọc /saɪt/: **sightseeing**, ~~siteseeing~~." },
        { w: "resident", pos: "n", ipa: "/ˈrezɪdənt/", vi: "cư dân, người sống ở một nơi", ex: "Most of the island's residents work in fishing or tourism.", exVi: "Phần lớn cư dân trên đảo làm nghề đánh cá hoặc du lịch.", more: "Họ: **reside** /rɪˈzaɪd/ (v, trang trọng: cư trú) · **residence** (nơi ở) · **residential** (adj, đã gặp Tập 1). Trọng âm dời: re**SIDE** → **RE**sident. **local residents** là cụm Task 2 dùng rất nhiều." },
        { w: "resource", pos: "n", ipa: "/rɪˈzɔːs/", vi: "nguồn lực, tài nguyên", ex: "Mass tourism puts pressure on natural resources such as water.", exVi: "Du lịch đại chúng gây áp lực lên tài nguyên thiên nhiên như nước.", more: "Thường số nhiều: **natural / financial / human resources** · **a waste of resources**. Họ: **resourceful** (tháo vát). Anh-Anh đọc /rɪˈzɔːs/ hoặc /rɪˈsɔːs/; Anh-Mỹ /ˈriːsɔːrs/." },
        { w: "investment", pos: "n", ipa: "/ɪnˈvestmənt/", vi: "sự đầu tư; khoản đầu tư", ex: "Foreign investment in hotels has increased rapidly.", exVi: "Đầu tư nước ngoài vào khách sạn tăng nhanh.", more: "(đã gặp **invest** ở Tập 1 — nay học danh từ + người) **invest IN** sth · **investment IN** sth · **investor** (nhà đầu tư). Collocation: **attract investment** · **foreign investment** · **a good investment**." },
        { w: "tradition", pos: "n", ipa: "/trəˈdɪʃn/", vi: "truyền thống", ex: "Visitors should learn about and respect local traditions.", exVi: "Du khách nên tìm hiểu và tôn trọng truyền thống địa phương.", more: "Họ: **traditional** (adj) · **traditionally** (adv). Collocation: **traditional food / dress / festivals** · **a long tradition of** + N / V-ing. Lỗi: ~~a tradition food~~ → **traditional food**." },
      ],
    },
    {
      t: "table",
      caption: "Bảng tổng 30 họ từ — tra nhanh (gạch “—” = dạng đó không thông dụng; in đậm = âm tiết nhấn khi trọng âm dời)",
      head: ["Danh từ", "Động từ", "Tính từ", "Trạng từ"],
      rows: [
        ["survey · surveyor", "survey", "—", "—"],
        ["journal · journalist · journalism", "—", "—", "—"],
        ["text · textbook", "text", "textual", "—"],
        ["item", "itemise", "—", "—"],
        ["relevance", "—", "relevant · irrelevant", "relevantly"],
        ["—", "—", "previous", "previously"],
        ["selection", "select", "selective", "selectively"],
        ["seeker", "seek (sought)", "—", "—"],
        ["—", "obtain", "obtainable", "—"],
        ["purchase · purchaser", "purchase", "—", "—"],
        ["transfer", "transfer", "transferable", "—"],
        ["participant · partici**PA**tion", "par**TI**cipate", "—", "—"],
        ["**IN**stitute · insti**TU**tion", "institute", "institutional", "—"],
        ["regulation · regulator", "regulate", "regulatory", "—"],
        ["restriction", "restrict", "restrictive", "—"],
        ["maintenance", "maintain", "well-maintained", "—"],
        ["se**CU**rity", "secure", "se**CURE**", "securely"],
        ["**STRA**tegy", "—", "stra**TE**gic", "strategically"],
        ["potential", "—", "potential", "potentially"],
        ["—", "—", "positive", "positively"],
        ["norm", "—", "normal · abnormal", "normally"],
        ["—", "—", "primary · prime", "primarily"],
        ["perception", "perceive", "perceptive", "—"],
        ["range", "range (from … to …)", "—", "—"],
        ["region", "—", "regional", "regionally"],
        ["site · website", "—", "—", "—"],
        ["**RE**sident · residence", "re**SIDE**", "residential", "—"],
        ["resource", "—", "resourceful", "—"],
        ["investment · investor", "invest", "—", "—"],
        ["tradition", "—", "traditional", "traditionally"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi dùng họ từ AWL",
      items: [
        "**Dùng sai loại từ**: ~~The perceive of tourists~~ → **The perception** of tourists (sau **the** cần **danh từ**). ~~a tradition festival~~ → **a traditional festival** (trước danh từ cần **tính từ**).",
        "**Quên giới từ đi kèm**: participate **in** · relevant **to** · investment **in** · restrictions **on** · impact **on**. Ghi cả giới từ vào sổ, đừng ghi riêng chữ.",
        "**Đọc sai trọng âm khi đổi dạng**: **STRA**tegy nhưng stra**TE**gic; **IN**stitute nhưng insti**TU**tion; re**SIDE** nhưng **RE**sident. Từ đuôi **-tion / -ic** hầu như luôn nhấn **âm tiết ngay trước đuôi**.",
        "**Nhồi từ học thuật vào Speaking**: “I obtained a souvenir” nghe rất lạ — nói **I got / bought a souvenir**. AWL hợp nhất với **Writing** và Speaking **Part 3**.",
      ],
    },
    {
      t: "quiz",
      id: "t2d14-tv-ho-tu",
      title: "Điền đúng dạng của từ trong ngoặc (10 câu)",
      kind: "fill",
      items: [
        { q: "Over 300 ___ took part in the study. (participate → người, số nhiều)", answers: ["participants"], hint: "người tham gia: -ant + s" },
        { q: "Public ___ of tourism is slowly changing. (perceive → danh từ)", answers: ["perception"], hint: "perceive → percep-…" },
        { q: "The city introduced strict ___ on short-term rentals. (regulate → danh từ số nhiều)", answers: ["regulations"], hint: "-tion + s" },
        { q: "Airport ___ checks can take a long time. (secure → danh từ)", answers: ["security"], hint: "secure → secur-…" },
        { q: "Universities and hospitals are important public ___. (institute → danh từ số nhiều, nghĩa “tổ chức, cơ sở”)", answers: ["institutions"], hint: "-tion + s" },
        { q: "Booking online is ___ cheaper than booking at the counter. (normal → trạng từ)", answers: ["normally"], hint: "+ -ly" },
        { q: "Building a new airport is a ___ decision for the region. (strategy → tính từ)", answers: ["strategic"], hint: "đuôi -ic" },
        { q: "Visitors were ___ interested in the beaches, not the museums. (primary → trạng từ)", answers: ["primarily"], hint: "y → i + ly" },
        { q: "Most of the island's ___ work in fishing or tourism. (reside → người, số nhiều)", answers: ["residents"], hint: "re-SIDE → RE-sident + s" },
        { q: "The government is trying to attract foreign ___ in hotels. (invest → danh từ)", answers: ["investment"], hint: "+ -ment" },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án — điền dạng từ",
      items: [
        "**participants** (người) ≠ participation (sự tham gia): chủ ngữ “took part” là **người**, và **300** → số nhiều. **perception**: sau tính từ **Public** cần danh từ; động từ **is** số ít.",
        "**regulations** — quy định đếm được, **strict regulations** (nhiều quy định). **security** — **airport security checks** (cụm danh từ ba chữ). **institutions** — “cơ sở, tổ chức lớn”; **institutes** chỉ là “viện nghiên cứu”.",
        "**normally** bổ nghĩa cả câu → trạng từ. **strategic** đứng trước danh từ decision → tính từ (nhấn stra**TE**gic). **primarily** bổ nghĩa cho tính từ interested → trạng từ.",
        "**residents** (cư dân) — không dùng ~~residences~~ (nơi ở) vì chủ ngữ “work”. **investment** — **attract investment** là collocation cố định; investment ở đây không đếm được.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Chủ đề Du lịch & lữ hành — 20 từ chính" },
    {
      t: "p",
      text: "Đây là chủ đề rất hay gặp ở **Speaking Part 1** (Do you like travelling? Where did you go on your last holiday?), **Part 2** (Describe a place you visited / a trip you enjoyed) và **Writing Task 2** (tác động của du lịch, overtourism, du lịch sinh thái). Trước hết là đồ vật quen thuộc — nhìn hình, nói to từ:",
    },
    {
      t: "hinh",
      title: "Đồ vật và nơi chốn khi đi du lịch",
      items: [
        { anh: "luggage", w: "luggage", ro: "/ˈlʌɡɪdʒ/", vi: "hành lý (không đếm được — an item of luggage)" },
        { anh: "backpack", w: "backpack", ro: "/ˈbækpæk/", vi: "ba lô" },
        { anh: "passport-control", w: "passport control", ro: "/ˈpɑːspɔːt kənˌtrəʊl/", vi: "quầy kiểm soát hộ chiếu" },
        { anh: "airplane-departure", w: "departure", ro: "/dɪˈpɑːtʃə(r)/", vi: "chuyến khởi hành, chiều đi" },
        { anh: "airplane-arrival", w: "arrivals", ro: "/əˈraɪvlz/", vi: "khu đón khách đến (ở sân bay)" },
        { anh: "ticket", w: "boarding pass", ro: "/ˈbɔːdɪŋ pɑːs/", vi: "thẻ lên máy bay" },
        { anh: "hotel", w: "hotel", ro: "/həʊˈtel/", vi: "khách sạn (nhấn âm 2: ho-TEL)" },
        { anh: "tent", w: "campsite", ro: "/ˈkæmpsaɪt/", vi: "khu cắm trại" },
        { anh: "compass", w: "compass", ro: "/ˈkʌmpəs/", vi: "la bàn" },
        { anh: "world-map", w: "map", ro: "/mæp/", vi: "bản đồ" },
        { anh: "camera", w: "camera", ro: "/ˈkæmərə/", vi: "máy ảnh" },
        { anh: "beach-with-umbrella", w: "seaside resort", ro: "/ˌsiːsaɪd rɪˈzɔːt/", vi: "khu nghỉ dưỡng ven biển" },
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "destination", pos: "n", ipa: "/ˌdestɪˈneɪʃn/", vi: "điểm đến", ex: "Da Nang has become a popular destination for young travellers.", exVi: "Đà Nẵng đã trở thành điểm đến được giới trẻ ưa chuộng.", more: "**a popular / tourist / holiday destination** · **final destination**. Paraphrase trong bài viết: tourist destination ↔ **holiday spot** ↔ **place to visit**.", anh: "globe-showing-asia-australia" },
        { w: "itinerary", pos: "n", ipa: "/aɪˈtɪnərəri/", vi: "lịch trình chuyến đi", ex: "Our itinerary includes three days in Hue and two days in Hoi An.", exVi: "Lịch trình của chúng tôi gồm ba ngày ở Huế và hai ngày ở Hội An.", more: "Nhấn âm 2: i**TI**nerary. Số nhiều **itineraries**. **plan / follow an itinerary** · **a busy / flexible itinerary**.", anh: "spiral-notepad" },
        { w: "accommodation", pos: "n", ipa: "/əˌkɒməˈdeɪʃn/", vi: "chỗ ở (khách sạn, nhà nghỉ…)", ex: "Accommodation in the city centre is very expensive in summer.", exVi: "Chỗ ở trong trung tâm thành phố rất đắt vào mùa hè.", more: "Anh-Anh: **không đếm được** — ~~an accommodation~~, ~~accommodations~~ → **accommodation** / **a place to stay**. Chính tả **2 c, 2 m**. **book / find accommodation** · **cheap / comfortable accommodation**.", anh: "hotel" },
        { w: "landmark", pos: "n", ipa: "/ˈlændmɑːk/", vi: "địa danh, công trình nổi bật (dễ nhận ra)", ex: "The Golden Bridge is now a famous landmark in central Vietnam.", exVi: "Cầu Vàng giờ là một địa danh nổi tiếng ở miền Trung.", more: "**a famous / historic landmark**. Cũng dùng khi chỉ đường: Turn left at the church — it's a good **landmark**.", anh: "statue-of-liberty" },
        { w: "tourist attraction", pos: "n", ipa: "/ˈtʊərɪst əˌtrækʃn/", vi: "điểm thu hút du khách", ex: "The night market is the city's main tourist attraction.", exVi: "Chợ đêm là điểm thu hút du khách chính của thành phố.", more: "Họ: **attract** (v) · **attractive** (adj). **a major / popular tourist attraction**. ~~a tourism attraction~~ → **tourist attraction**. tourist cũng đọc /ˈtɔːrɪst/.", anh: "ferris-wheel" },
        { w: "sightseeing", pos: "n", ipa: "/ˈsaɪtsiːɪŋ/", vi: "việc đi tham quan, ngắm cảnh", ex: "We spent the morning sightseeing and the afternoon at the beach.", exVi: "Chúng tôi đi tham quan buổi sáng và ra biển buổi chiều.", more: "Không đếm được. **go sightseeing** · **a sightseeing tour** · **see the sights** of Hanoi (sight = cảnh đáng xem).", anh: "camera" },
        { w: "excursion", pos: "n", ipa: "/ɪkˈskɜːʃn/", vi: "chuyến tham quan ngắn (thường theo đoàn)", ex: "The school organised a one-day excursion to Ha Long Bay.", exVi: "Trường tổ chức một chuyến tham quan một ngày tới vịnh Hạ Long.", more: "**go on an excursion** · **an excursion to** + nơi · gần nghĩa: **day trip**. Âm /ɜː/ ở âm tiết nhấn: ex**CUR**sion.", anh: "bus" },
        { w: "overtourism", pos: "n", ipa: "/ˌəʊvəˈtʊərɪzəm/", vi: "tình trạng quá tải du lịch", ex: "Overtourism has made life difficult for residents of some old towns.", exVi: "Quá tải du lịch đã khiến cuộc sống của cư dân một số phố cổ trở nên khó khăn.", more: "Không đếm được. Họ: **tourism** (ngành du lịch) · **mass tourism** (du lịch đại chúng). Câu Task 2: Overtourism **puts pressure on** housing and infrastructure.", anh: "busts-in-silhouette" },
        { w: "ecotourism", pos: "n", ipa: "/ˈiːkəʊˌtʊərɪzəm/", vi: "du lịch sinh thái", ex: "Ecotourism can protect forests while creating jobs for local people.", exVi: "Du lịch sinh thái có thể bảo vệ rừng mà vẫn tạo việc làm cho người dân địa phương.", more: "Cũng viết **eco-tourism**. Gần nghĩa: **sustainable tourism** (du lịch bền vững). **eco-friendly** (thân thiện với môi trường).", anh: "national-park" },
        { w: "package holiday", pos: "n", ipa: "/ˈpækɪdʒ ˌhɒlədeɪ/", vi: "kỳ nghỉ / tour trọn gói", ex: "A package holiday usually includes flights, a hotel and some meals.", exVi: "Tour trọn gói thường gồm vé máy bay, khách sạn và vài bữa ăn.", more: "Anh-Mỹ: **package tour**. Đối lập: **independent travel** (du lịch tự túc). **book a package holiday**.", anh: "airplane-departure" },
        { w: "backpacker", pos: "n", ipa: "/ˈbækpækə(r)/", vi: "khách du lịch ba lô (tự túc, tiết kiệm)", ex: "Backpackers usually stay in hostels and travel by bus.", exVi: "Dân du lịch ba lô thường ở nhà nghỉ tập thể và đi xe buýt.", more: "**go backpacking** (đi du lịch bụi) · **hostel** /ˈhɒstl/ (nhà nghỉ giá rẻ, ngủ phòng chung).", anh: "backpack" },
        { w: "jet lag", pos: "n", ipa: "/ˈdʒet læɡ/", vi: "mệt mỏi do lệch múi giờ", ex: "After the twelve-hour flight, I had terrible jet lag for three days.", exVi: "Sau chuyến bay mười hai tiếng, tôi bị lệch múi giờ rất nặng suốt ba ngày.", more: "Thường không dùng a: ~~I had a jet lag~~ → **I had (terrible) jet lag**. **suffer from / get over jet lag** · **jet-lagged** (adj): I'm still jet-lagged.", anh: "sleeping-face" },
        { w: "culture shock", pos: "n", ipa: "/ˈkʌltʃə ʃɒk/", vi: "sốc văn hoá", ex: "Many international students experience culture shock in their first month abroad.", exVi: "Nhiều du học sinh bị sốc văn hoá trong tháng đầu ở nước ngoài.", more: "Không đếm được. **experience / suffer (from) culture shock** · **reverse culture shock** (sốc khi trở về quê nhà).", anh: "face-with-spiral-eyes" },
        { w: "souvenir", pos: "n", ipa: "/ˌsuːvəˈnɪə(r)/", vi: "quà lưu niệm", ex: "I brought back a small souvenir for each of my colleagues.", exVi: "Tôi mang về một món quà lưu niệm nhỏ cho mỗi đồng nghiệp.", more: "Nhấn âm cuối: souve**NIR**. **a souvenir shop / stall** · **keep sth as a souvenir** · **a souvenir of** + nơi.", anh: "wrapped-gift" },
        { w: "cuisine", pos: "n", ipa: "/kwɪˈziːn/", vi: "ẩm thực (cách nấu riêng của một vùng)", ex: "Trying the local cuisine is one of the best parts of travelling.", exVi: "Thử ẩm thực địa phương là một trong những phần thú vị nhất khi đi du lịch.", more: "**local / traditional / Vietnamese cuisine**. Trang trọng hơn **food**. Đọc /kwɪˈziːn/ — **cui** đọc /kwɪ/, nhấn âm 2.", anh: "steaming-bowl" },
        { w: "hospitality", pos: "n", ipa: "/ˌhɒspɪˈtæləti/", vi: "lòng hiếu khách; ngành lưu trú – nhà hàng", ex: "Visitors are often impressed by the hospitality of local people.", exVi: "Du khách thường ấn tượng với lòng hiếu khách của người dân địa phương.", more: "Họ: **hospitable** /hɒˈspɪtəbl/ (hiếu khách). **the hospitality industry** (ngành dịch vụ lưu trú – ăn uống). Nhấn: hospi**TA**lity.", anh: "bellhop-bell" },
        { w: "authentic", pos: "adj", ipa: "/ɔːˈθentɪk/", vi: "chân thực, đúng bản sắc (không làm giả cho khách)", ex: "Homestays give tourists a more authentic experience of village life.", exVi: "Ở nhà dân cho du khách trải nghiệm đời sống làng quê chân thực hơn.", more: "Họ: **authenticity** /ˌɔːθenˈtɪsəti/. **an authentic experience / dish**. Từ ngược nghĩa (nghĩa chê): **touristy** — quá thương mại hoá cho khách." },
        { w: "visa", pos: "n", ipa: "/ˈviːzə/", vi: "thị thực (giấy phép nhập cảnh)", ex: "Citizens of some countries can enter Vietnam without a visa.", exVi: "Công dân một số nước có thể vào Việt Nam không cần thị thực.", more: "**apply for / obtain a visa** · **a tourist / student visa** · **visa-free travel**. Đừng nhầm với **passport** (hộ chiếu).", anh: "passport-control" },
        { w: "infrastructure", pos: "n", ipa: "/ˈɪnfrəstrʌktʃə(r)/", vi: "cơ sở hạ tầng (đường, điện, nước, sân bay…)", ex: "Small towns often lack the infrastructure to deal with large numbers of tourists.", exVi: "Các thị trấn nhỏ thường thiếu hạ tầng để đón lượng lớn du khách.", more: "Không đếm được. **transport / tourist infrastructure** · **invest in infrastructure** · **put pressure on infrastructure** — cụm rất hay dùng ở Task 2.", anh: "building-construction" },
        { w: "peak season", pos: "n", ipa: "/ˌpiːk ˈsiːzn/", vi: "mùa cao điểm", ex: "Hotel prices can double during the peak season.", exVi: "Giá khách sạn có thể tăng gấp đôi vào mùa cao điểm.", more: "(**peak** đã gặp Tập 1 với nghĩa “đạt đỉnh” trong biểu đồ — nay là collocation du lịch) Đối lập: **off-season / low season**. **in / during (the) peak season** · **high season** (= peak season).", anh: "sun-with-face" },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Mười cụm từ & cụm động từ du lịch" },
    {
      t: "p",
      text: "Cụm động từ (phrasal verb) làm câu Speaking **tự nhiên** hơn hẳn — giám khảo Part 1–2 nghe **We set off at dawn** tự nhiên hơn **We started our journey at dawn** (câu sau vẫn đúng ngữ pháp, chỉ cứng và giống văn viết). Các cụm như **put pressure on**, **broaden one's horizons** lại rất hợp Task 2.",
    },
    {
      t: "vocab",
      items: [
        { w: "set off", pos: "phr v", ipa: "/ˌset ˈɒf/", vi: "khởi hành, lên đường", ex: "We set off for the airport at five in the morning.", exVi: "Chúng tôi lên đường ra sân bay lúc năm giờ sáng.", more: "**set off for** + nơi đến · **set off on** a journey. Gần nghĩa: **leave**, **head off**." },
        { w: "check in", pos: "phr v", ipa: "/ˌtʃek ˈɪn/", vi: "làm thủ tục nhận phòng / lên máy bay", ex: "You can check in online 24 hours before your flight.", exVi: "Bạn có thể làm thủ tục trực tuyến 24 giờ trước chuyến bay.", more: "Ngược lại: **check out** (trả phòng). Danh từ có gạch nối: **the check-in desk** · **check-out time**." },
        { w: "get away", pos: "phr v", ipa: "/ˌɡet əˈweɪ/", vi: "đi xa nghỉ ngơi một thời gian", ex: "We try to get away for a few days every summer.", exVi: "Mùa hè nào chúng tôi cũng cố đi nghỉ vài ngày.", more: "**get away from it all** (thoát khỏi mọi bận rộn) · danh từ **a getaway** (chuyến nghỉ ngắn): a weekend getaway." },
        { w: "see off", pos: "phr v", ipa: "/ˌsiː ˈɒf/", vi: "tiễn (ai lên đường)", ex: "My parents came to the station to see me off.", exVi: "Bố mẹ ra ga tiễn tôi.", more: "Tân ngữ là đại từ thì đứng **giữa**: **see me off** (~~see off me~~). Ngược nghĩa: **pick sb up** (đón)." },
        { w: "travel light", pos: "v phr", ipa: "/ˌtrævl ˈlaɪt/", vi: "đi du lịch gọn nhẹ, mang ít đồ", ex: "I always travel light — just one small backpack.", exVi: "Tôi luôn đi gọn nhẹ — chỉ một ba lô nhỏ.", more: "**light** ở đây là trạng từ (= with little luggage), không thêm -ly." },
        { w: "off the beaten track", pos: "idiom", ipa: "/ˌɒf ðə ˌbiːtn ˈtræk/", vi: "ở nơi hẻo lánh, ít khách lui tới", ex: "We wanted to find villages off the beaten track.", exVi: "Chúng tôi muốn tìm những ngôi làng ít người lui tới.", more: "Anh-Mỹ: **off the beaten path**. Hợp Speaking Part 2 (Describe a place): It's a little village **off the beaten track**." },
        { w: "broaden one's horizons", pos: "idiom", ipa: "/ˌbrɔːdn wʌnz həˈraɪznz/", vi: "mở mang tầm hiểu biết", ex: "Travelling abroad can broaden young people's horizons.", exVi: "Đi nước ngoài có thể mở mang tầm hiểu biết cho người trẻ.", more: "Thay **one's** bằng tính từ sở hữu: **broaden my / your / their horizons**. Rất hay dùng ở Task 2 về lợi ích du lịch, du học." },
        { w: "a once-in-a-lifetime experience", pos: "n phr", ipa: "/ə ˌwʌns ɪn ə ˈlaɪftaɪm ɪkˈspɪəriəns/", vi: "trải nghiệm có một không hai trong đời", ex: "Seeing the northern lights was a once-in-a-lifetime experience.", exVi: "Được ngắm cực quang là trải nghiệm có một không hai trong đời.", more: "Gạch nối khi đứng trước danh từ: **a once-in-a-lifetime trip / opportunity**. Hợp phần “explain how you felt” của Part 2." },
        { w: "book in advance", pos: "v phr", ipa: "/ˌbʊk ɪn ədˈvɑːns/", vi: "đặt trước", ex: "It is usually cheaper to book flights well in advance.", exVi: "Đặt vé máy bay sớm từ trước thường rẻ hơn.", more: "**well in advance** (rất sớm từ trước) · **book a room / a table / a flight**. ~~book in before~~ → **book in advance**." },
        { w: "put pressure on", pos: "v phr", ipa: "/ˌpʊt ˈpreʃər ɒn/", vi: "gây áp lực lên", ex: "Large numbers of tourists put pressure on local water supplies.", exVi: "Lượng lớn du khách gây áp lực lên nguồn nước địa phương.", more: "Cụm Task 2 “đắt”: **put pressure on** infrastructure / resources / housing. Mạnh hơn: **put enormous pressure on**." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Năm họ từ du lịch + bốn câu mẫu ăn điểm" },
    {
      t: "table",
      caption: "Năm họ từ chủ đề du lịch",
      head: ["Gốc", "Danh từ", "Tính từ / trạng từ", "Lưu ý"],
      rows: [
        ["**tour**", "tour · **tourist** (người) · **tourism** (ngành)", "**touristy** (chê: quá đông khách, thương mại)", "~~tourism attraction~~ → **tourist** attraction"],
        ["**travel**", "travel (không đếm được) · **traveller** (Anh) / traveler (Mỹ)", "**travelling** (Anh) / traveling (Mỹ)", "~~a travel~~ → **a trip / a journey**"],
        ["**culture**", "culture", "**cultural** · culturally · **multicultural**", "**cultural differences** · **cultural heritage**"],
        ["**environment**", "environment · environmentalist", "**environmental** · environmentally", "**environmentally friendly** (thân thiện môi trường)"],
        ["**explore**", "**exploration** · **explorer**", "—", "**explore** the old town (khám phá)"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "travel · trip · journey · tour — bốn chữ người Việt hay dùng lẫn",
      caption: "travel thường là động từ hoặc danh từ không đếm được; muốn đếm “một chuyến” thì dùng trip / journey / tour.",
      cols: [
        { title: "**travel**", items: ["động từ: I love **travelling**.", "danh từ không đếm: **air travel**", "~~a travel~~ ✗"] },
        { title: "**trip**", items: ["một chuyến đi (đi + về)", "**a business / day trip**", "**go on / take a trip**"] },
        { title: "**journey**", items: ["quãng đường đi từ A tới B", "**a long train journey**", "My **journey to work** takes an hour."] },
        { title: "**tour**", items: ["chuyến đi tham quan nhiều điểm", "**a guided tour** of the museum", "**a tour guide**"] },
      ],
    },
    {
      t: "examples",
      items: [
        { en: "Tourism can bring considerable economic benefits to a region, but it also puts pressure on local infrastructure.", vi: "Du lịch có thể mang lại lợi ích kinh tế đáng kể cho một vùng, nhưng nó cũng gây áp lực lên hạ tầng địa phương." },
        { en: "When tourist numbers are not regulated, popular destinations may suffer from overtourism.", vi: "Khi số lượng du khách không được điều tiết, các điểm đến nổi tiếng có thể bị quá tải du lịch." },
        { en: "Ecotourism allows visitors to enjoy natural sites while helping local residents earn a living.", vi: "Du lịch sinh thái cho phép du khách thưởng thức các địa điểm thiên nhiên đồng thời giúp cư dân địa phương kiếm sống." },
        { en: "Travelling abroad broadens young people's horizons and helps them understand other cultures.", vi: "Đi nước ngoài mở mang tầm hiểu biết cho người trẻ và giúp họ hiểu các nền văn hoá khác." },
      ],
    },
    {
      t: "rule",
      formula: "N (tourism / overtourism) + puts pressure on / has a positive impact on + N · S + should + regulate / restrict + the number of + N",
      vi: "Hai khung Task 2 dùng ngay từ vựng hôm nay: nói tác động (impact / pressure) và nói giải pháp (regulate / restrict).",
    },
    {
      t: "mcq",
      id: "t2d14-tv-colloc",
      title: "Chọn từ đi kèm đúng (collocation) — 8 câu",
      items: [
        { q: "Researchers ___ a survey of 1,000 tourists last year.", options: ["made", "carried out", "did up"], correct: 1, why: "Collocation cố định: **carry out / conduct a survey**. ~~make a survey~~ là dịch từng chữ “làm khảo sát”; **do up** = sửa sang, cài (cúc)." },
        { q: "This example is not relevant ___ the question.", options: ["to", "with", "for"], correct: 0, why: "**relevant TO** sth. ~~relevant with~~ là lỗi người Việt hay mắc (dịch “liên quan **với**”)." },
        { q: "All first-year students must participate ___ the field trip.", options: ["on", "at", "in"], correct: 2, why: "**participate IN** sth. on / at không đi với participate." },
        { q: "The island has ___ strict restrictions on the number of cruise ships.", options: ["done", "made", "imposed"], correct: 2, why: "**impose restrictions on** = áp đặt hạn chế. Ngược lại: **lift restrictions** (dỡ bỏ). do / make không đi với restrictions." },
        { q: "Tourism has the ___ to reduce poverty in rural areas.", options: ["potential", "potentially", "potent"], correct: 0, why: "Sau **the** cần **danh từ**: **have the potential to** + V. potentially là trạng từ; potent (mạnh, công hiệu) là từ khác." },
        { q: "The hotel offers a ___ range of water sports.", options: ["high", "wide", "long"], correct: 1, why: "**a wide range of** + N số nhiều (rất nhiều loại). high range / long range không dùng với nghĩa này." },
        { q: "You need to ___ a visa before you fly to some countries.", options: ["obtain", "receive to", "make"], correct: 0, why: "**obtain a visa** (xin được thị thực). ~~receive to~~ sai ngữ pháp; ~~make a visa~~ là dịch từng chữ." },
        { q: "Hotel prices usually rise ___ the peak season.", options: ["on", "at", "during"], correct: 2, why: "**during / in (the) peak season** — season là một khoảng thời gian → during hoặc in. on dùng cho ngày; at cho giờ / dịp ngắn (at Christmas)." },
      ],
    },
    {
      t: "mcq",
      id: "t2d14-tv-du-lich",
      title: "Chọn từ chủ đề du lịch đúng nghĩa — 6 câu",
      items: [
        { q: "I couldn't sleep properly for days because of ___ after flying from London.", options: ["jet lag", "culture shock", "hospitality"], correct: 0, why: "Không ngủ được sau chuyến bay dài, lệch múi giờ → **jet lag**. culture shock là sốc vì văn hoá lạ; hospitality là lòng hiếu khách." },
        { q: "We only had one day, so we joined a short ___ to the caves.", options: ["itinerary", "excursion", "accommodation"], correct: 1, why: "Chuyến tham quan ngắn theo đoàn → **excursion**. itinerary là lịch trình (không “join” được); accommodation là chỗ ở." },
        { q: "Hostels are popular with ___ who want to save money.", options: ["residents", "landmarks", "backpackers"], correct: 2, why: "Người đi du lịch ba lô, tiết kiệm → **backpackers**. residents là cư dân; landmarks là địa danh (không phải người)." },
        { q: "Finding ___ in Hoi An during Tet is very difficult — every hotel is full.", options: ["an accommodation", "accommodation", "accommodations"], correct: 1, why: "Anh-Anh: **accommodation** là danh từ **không đếm được** → không có an, không thêm -s." },
        { q: "The ancient tower is the best-known ___ in the city.", options: ["landmark", "souvenir", "visa"], correct: 0, why: "Công trình nổi bật, ai cũng nhận ra → **landmark**. souvenir là quà lưu niệm; visa là thị thực." },
        { q: "Many visitors want an ___ experience, not a show made only for tourists.", options: ["overtourism", "touristy", "authentic"], correct: 2, why: "Chân thực, đúng bản sắc → **authentic** (đi với **an** vì bắt đầu bằng nguyên âm /ɔː/). overtourism là danh từ; touristy nghĩa ngược lại và đi với **a**." },
      ],
    },
    {
      t: "quiz",
      id: "t2d14-tv-dich",
      title: "Dịch sang tiếng Anh — dùng từ vựng hôm nay (5 câu)",
      kind: "translate",
      grammar: "have a positive impact on + N · should + restrict / regulate + the number of + N · set off · seek + N · book + N + in advance",
      items: [
        { q: "Du lịch có thể tác động tích cực đến cư dân địa phương.", hint: "Tourism, can have, a positive impact / effect on, local residents", answers: ["Tourism can have a positive impact on local residents.", "Tourism can have a positive effect on local residents.", "Tourism may have a positive impact on local residents.", "Tourism may have a positive effect on local residents.", "Tourism can have positive impacts on local residents.", "Tourism can have positive effects on local residents."] },
        { q: "Chính quyền nên hạn chế số lượng tàu du lịch đến hòn đảo.", hint: "The government / The authorities, should restrict, the number of cruise ships, (that) come to / visiting the island", answers: ["The government should restrict the number of cruise ships that come to the island.", "The government should restrict the number of cruise ships coming to the island.", "The government should restrict the number of cruise ships visiting the island.", "The government should restrict the number of cruise ships that visit the island.", "The authorities should restrict the number of cruise ships that come to the island.", "The authorities should restrict the number of cruise ships coming to the island.", "The authorities should restrict the number of cruise ships visiting the island.", "The government should limit the number of cruise ships that come to the island.", "The government should limit the number of cruise ships visiting the island.", "The local government should restrict the number of cruise ships that come to the island.", "The authorities should restrict the number of cruise ships that visit the island.", "The authorities should limit the number of cruise ships that come to the island.", "The authorities should limit the number of cruise ships coming to the island.", "The authorities should limit the number of cruise ships visiting the island.", "The government should limit the number of cruise ships coming to the island.", "The government should limit the number of cruise ships that visit the island.", "The government should restrict the number of cruise ships arriving at the island.", "The government should restrict the number of cruise ships to the island."] },
        { q: "Chúng tôi lên đường lúc sáu giờ và đến khách sạn vào buổi trưa.", hint: "set off (quá khứ: set off), at six, arrived at the hotel, at noon / at midday", answers: ["We set off at six and arrived at the hotel at noon.", "We set off at six and arrived at the hotel at midday.", "We set off at six o'clock and arrived at the hotel at noon.", "We set off at six o'clock and arrived at the hotel at midday.", "We set off at 6 and arrived at the hotel at noon.", "We set off at 6 and arrived at the hotel at midday.", "We set off at six and got to the hotel at noon.", "We set off at six and reached the hotel at noon.", "We set off at six and reached the hotel at midday.", "We set off at six and got to the hotel at midday.", "We set off at 6 o'clock and arrived at the hotel at noon.", "We set off at 6 a.m. and arrived at the hotel at noon.", "We set off at six and arrived at the hotel at lunchtime."] },
        { q: "Nhiều du khách tìm kiếm những nơi ít người lui tới.", hint: "Many tourists / visitors, seek, places off the beaten track", answers: ["Many tourists seek places off the beaten track.", "Many visitors seek places off the beaten track.", "Many travellers seek places off the beaten track.", "Many tourists look for places off the beaten track.", "Many visitors look for places off the beaten track.", "Many tourists seek out places off the beaten track.", "Many travelers seek places off the beaten track."] },
        { q: "Vào mùa cao điểm, bạn nên đặt chỗ ở trước.", hint: "In / During (the) peak season, you should, book accommodation, in advance", answers: ["In the peak season, you should book accommodation in advance.", "During the peak season, you should book accommodation in advance.", "In peak season, you should book accommodation in advance.", "During peak season, you should book accommodation in advance.", "You should book accommodation in advance in the peak season.", "You should book accommodation in advance during the peak season.", "You should book accommodation in advance during peak season.", "In the peak season, you should book your accommodation in advance.", "During the peak season, you should book your accommodation in advance.", "You should book your accommodation in advance during the peak season."] },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Thêm: phát âm nguyên âm dài /ɜː/ (journal, journey, purchase)" },
    {
      t: "p",
      text: "Phần này đề cương không ghi — thêm vì rất nhiều từ hôm nay chứa âm **/ɜː/**: **jour**nal, **jour**ney, **pur**chase, **sur**vey, ex**cur**sion, re**search**, trans**fer**. Đây là nguyên âm **dài**, giữa miệng, môi **không tròn**, lưỡi nằm thả lỏng ở giữa — giống chữ “ơ” tiếng Việt nhưng **kéo dài gấp đôi** và hơi căng. Chính tả thường là **er, ir, ur, or (sau w), ear, our**.",
    },
    {
      t: "table",
      caption: "/ɜː/ hay bị đọc nhầm thành gì?",
      head: ["Âm", "Ví dụ", "Người Việt hay đọc sai thành", "Cách sửa"],
      rows: [
        ["**/ɜː/** dài, nhấn", "**work** /wɜːk/ · **first** /fɜːst/", "“uốc”, “phớt” (quá ngắn)", "Kéo dài “ơơ”, miệng hé vừa, môi không tròn"],
        ["**/ɔː/** dài, môi tròn", "**walk** /wɔːk/ · **sport** /spɔːt/", "lẫn với /ɜː/ → work = walk", "/ɔː/ môi tròn, hàm hạ thấp; /ɜː/ môi dẹt"],
        ["**/ə/** ngắn, yếu (schwa)", "**per**ceive /pəˈsiːv/ · **sur**prise /səˈpraɪz/", "đọc mạnh thành /ɜː/", "âm tiết KHÔNG nhấn → /ə/ ngắn, nhẹ"],
        ["**/ɑː/** dài, miệng mở rộng", "**heart** /hɑːt/ · **car** /kɑː/", "nhầm heart ↔ hurt", "heart mở miệng to; hurt /hɜːt/ miệng hé"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với /ɜː/",
      items: [
        "**Anh-Anh không đọc /r/** sau /ɜː/ khi phía sau không có nguyên âm: work /wɜːk/, first /fɜːst/. Anh-Mỹ có /r/ (work /wɝːk/) — cả hai đều được chấm đúng, miễn **giữ một giọng**.",
        "Chữ **ur / er / ir** chỉ đọc /ɜː/ ở âm tiết **nhấn**: **sur**vey (n) /ˈsɜːveɪ/ nhưng sur**vey** (v) /səˈveɪ/; **per**fect /ˈpɜːfɪkt/ nhưng **per**ceive /pəˈsiːv/.",
        "Cặp dễ lẫn khi nghe (Listening): **work / walk**, **firm / farm**, **hurt / heart**, **bird / bored**. Đặt câu hỏi: miệng tròn hay dẹt?",
      ],
    },
    {
      t: "phatam",
      id: "t2d14-phat-am",
      title: "Thêm: luyện phát âm /ɜː/",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Kéo dài /ɜː/ ở âm tiết nhấn, môi dẹt, không thêm /r/ (giọng Anh). Ba dòng đầu luyện từ, năm dòng sau luyện trong câu.",
      items: [
        { text: "journal, journey, journalist", ipa: "dʒɜːnl dʒɜːni dʒɜːnəlɪst", vi: "JOUR-nal · JOUR-ney · JOUR-na-list" },
        { text: "purchase, survey, research", ipa: "pɜːtʃəs sɜːveɪ rɪsɜːtʃ", vi: "PUR-chase · SUR-vey (danh từ) · re-SEARCH" },
        { text: "excursion, transfer, return", ipa: "ɪkskɜːʃn trænsfɜː rɪtɜːn", vi: "ex-CUR-sion · trans-FER (động từ) · re-TURN" },
        { text: "My first journey abroad was in Germany.", ipa: "maɪ fɜːst dʒɜːni əbrɔːd wəz ɪn dʒɜːməni", vi: "first · journey · Germany — ba lần /ɜː/" },
        { text: "We reserved seats for the early excursion.", ipa: "wi rɪzɜːvd siːts fə ði ɜːli ɪkskɜːʃn", vi: "reserved · early · excursion" },
        { text: "The survey found that most tourists return.", ipa: "ðə sɜːveɪ faʊnd ðət məʊst tʊərɪsts rɪtɜːn", vi: "survey (danh từ) · return" },
        { text: "Researchers purchased thirty journals.", ipa: "rɪsɜːtʃəz pɜːtʃəst θɜːti dʒɜːnlz", vi: "purchased /t/ cuối · thirty /θɜː/" },
        { text: "I walk to work every morning.", ipa: "aɪ wɔːk tə wɜːk evri mɔːnɪŋ", vi: "walk /ɔː/ môi tròn ≠ work /ɜː/ môi dẹt" },
      ],
    },
  ],
};

/* ─────────────────────────── Đọc ─────────────────────────── */

const T2D14_READING: Lesson = {
  id: "t2d14-doc",
  kind: "reading",
  title: "Đọc: Sentence completion 2 — bài đọc mức Passage 2",
  goal: "Làm dạng Sentence Completion trên một bài đọc dài ~750 từ (mức Passage 2): đọc đúng giới hạn từ, đoán loại từ, tìm vị trí nhờ paraphrase, chép đúng chữ trong bài và tránh 5 bẫy mất điểm — mục tiêu ≥ 6/8 câu, góp phần đạt Reading band 5.0 (15/40).",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Sentence completion** (hoàn thành câu): cho câu tóm ý bài đọc có chỗ trống → **chép đúng từ trong bài** vào chỗ trống. Đã học vòng 1 ở **Tập 1 Ngày 4** với bài ngắn; hôm nay là **vòng 2 — mức Passage 2**: bài dài hơn, câu hỏi **paraphrase** nhiều hơn.",
        "Ba luật vàng: **đúng giới hạn từ** (NO MORE THAN TWO WORDS…) · câu điền xong phải **đúng ngữ pháp** · đáp án **đi theo thứ tự** bài đọc.",
        "Quy trình 6 bước + **5 bẫy** hay mất điểm (vượt số từ, sai số ít / số nhiều, dùng từ đồng nghĩa không có trong bài, chép sai chính tả, chọn từ “đúng chủ đề” nhưng sai chỗ).",
        "Luyện trọn một bài Passage 2 (đánh số **14–26** như đề thật): 8 câu Sentence completion + 5 câu True / False / Not Given ôn lại.",
        "Đẩy band nào? Reading band 5.0 cần ~15/40 câu đúng; Passage 1 + 2 là nơi lấy điểm. Sentence completion là dạng **dễ lấy trọn điểm** nếu cẩn thận chính tả và số từ.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Nhắc lại dạng bài — và Passage 2 khó hơn ở đâu" },
    {
      t: "p",
      text: "Bài thi Reading Academic có **3 đoạn đọc** (Passage 1, 2, 3), tổng **40 câu trong 60 phút**, độ khó tăng dần. Passage 2 thường dài **700–900 từ**, câu 14–26 (13 câu), có **hai hoặc ba dạng câu hỏi**. Dạng Sentence completion trông giống Tập 1, nhưng câu hỏi **ít lặp lại chữ của bài** hơn — bạn phải nhận ra **paraphrase** (cùng ý, khác chữ).",
    },
    {
      t: "table",
      caption: "Sentence completion ở Passage 1 và Passage 2",
      head: ["Điểm", "Passage 1 (Tập 1 Ngày 4)", "Passage 2 (hôm nay)"],
      rows: [
        ["Độ dài bài", "500–700 từ", "700–900 từ"],
        ["Câu hỏi giống chữ trong bài", "khá nhiều chữ trùng → dò (scan) là thấy", "đa số đã **đổi từ / đổi cấu trúc** → phải hiểu ý"],
        ["Đáp án thường là", "tên, số, danh từ đơn", "**cụm danh từ 2 chữ**, danh từ trừu tượng, đôi khi tính từ"],
        ["Bẫy", "ít", "từ đúng chủ đề nhưng **ở câu bên cạnh**; số ít / số nhiều; vượt số từ"],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Đọc lời dẫn: giới hạn từ" },
    {
      t: "p",
      text: "Câu đầu tiên của mỗi nhóm câu hỏi luôn ghi **giới hạn từ** bằng chữ IN HOA. Viết quá giới hạn = **sai cả câu**, dù từ bạn chép đúng ý.",
    },
    {
      t: "table",
      head: ["Lời dẫn", "Được viết", "Ví dụ hợp lệ", "Ví dụ SAI"],
      rows: [
        ["**ONE WORD ONLY**", "đúng 1 từ", "railway", "~~the railway~~"],
        ["**NO MORE THAN TWO WORDS**", "1 hoặc 2 từ", "charter flights", "~~cheap charter flights~~"],
        ["**ONE WORD AND/OR A NUMBER**", "1 từ, hoặc 1 số, hoặc 1 từ + 1 số", "1841 · 500 people", "~~around 500 people~~"],
        ["**NO MORE THAN TWO WORDS AND/OR A NUMBER**", "tối đa 2 từ + 1 số", "25 million", "~~about 25 million tourists~~"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: cái gì tính là một từ?",
      items: [
        "Từ có **gạch nối** tính là **một từ**: **working-class**, **well-known**, **eco-friendly**.",
        "**Con số** viết bằng chữ số không tính là từ (nếu lời dẫn có “AND/OR A NUMBER”): **1950** là một số. Ngày tháng như **25 June** = 1 từ + 1 số.",
        "**a / an / the** CŨNG là từ. Nếu chỗ trống đã có sẵn **a** hoặc **the** phía trước, đừng chép lại mạo từ.",
        "Từ viết tắt quen thuộc (UK, UN) tính là **một từ**.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Quy trình 6 bước" },
    {
      t: "sodo",
      kind: "flow",
      title: "Làm một câu Sentence completion",
      caption: "Bước 2 và 3 làm cho TẤT CẢ câu trước khi đọc bài (khoảng 1–2 phút). Bước 6 là bước người mất điểm hay bỏ qua.",
      steps: [
        { label: "1. Đọc giới hạn từ", sub: "khoanh ONE / TWO / NUMBER" },
        { label: "2. Gạch từ khoá", sub: "tên riêng, năm, số — dễ dò nhất" },
        { label: "3. Đoán loại từ", sub: "sau a/the → danh từ; sau be → tính từ / danh từ" },
        { label: "4. Dò vị trí", sub: "tìm tên / số / từ đồng nghĩa; câu sau nằm SAU câu trước" },
        { label: "5. Đọc kỹ 2–3 câu", sub: "tìm cụm khớp NGHĨA, chép đúng chữ" },
        { label: "6. Đọc lại cả câu", sub: "đúng ngữ pháp? số ít / nhiều? đủ giới hạn từ?" },
      ],
    },
    {
      t: "table",
      caption: "Bước 3 — nhìn chữ quanh chỗ trống để đoán loại từ",
      head: ["Trước / sau chỗ trống", "Cần", "Ví dụ"],
      rows: [
        ["a / an / the / tính từ + ___", "**danh từ** (a: số ít)", "a ______ in Loughborough → **meeting**"],
        ["many / several / these + ___", "**danh từ số nhiều**", "several ______ → **charter flights**"],
        ["was / is / became + ___ (không có danh từ sau)", "**tính từ** hoặc **cụm danh từ**", "The aim was ______ → **educational**"],
        ["___ + have / are (động từ số nhiều)", "**danh từ số nhiều**", "______ have gone up → **rents**"],
        ["to + ___", "**động từ nguyên mẫu** hoặc **danh từ** (nếu to là giới từ)", "advise travellers to use ______ → danh từ"],
      ],
    },
    {
      t: "rule",
      formula: "Đọc giới hạn từ → đoán loại từ → dò bằng tên / số / từ đồng nghĩa → chép NGUYÊN chữ trong bài → đọc lại cả câu (ngữ pháp + số ít / nhiều)",
      vi: "Đáp án luôn là chữ CÓ trong bài; câu hỏi đi theo thứ tự bài đọc.",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Năm bẫy mất điểm" },
    {
      t: "table",
      head: ["Bẫy", "Ví dụ", "Cách tránh"],
      rows: [
        ["1. **Vượt giới hạn từ**", "TWO WORDS: ~~a guided walk~~ (3 từ)", "Bỏ mạo từ / tính từ thừa nếu câu vẫn đúng ngữ pháp: **guided walk**"],
        ["2. **Sai số ít / số nhiều**", "______ have gone up → ~~fee~~", "Nhìn động từ sau chỗ trống (have → số nhiều) và chép đúng dạng trong bài: **fees**"],
        ["3. **Dùng từ đồng nghĩa của mình**", "bài viết “luggage”, bạn viết ~~baggage~~", "Đáp án phải là chữ **trong bài**, không tự diễn đạt lại"],
        ["4. **Chép sai chính tả**", "~~acommodation~~, ~~educationl~~", "Sai một chữ cái = sai cả câu. Chép từng chữ, soát lại"],
        ["5. **Từ đúng chủ đề nhưng sai chỗ**", "câu hỏi về **lý do**, bạn chép **kết quả** ở câu bên cạnh", "Đọc **cả câu chứa đáp án** và câu ngay sau nó"],
      ],
    },
    {
      t: "mcq",
      id: "t2d14-doc-bay",
      title: "Nhận ra bẫy — chọn đáp án HỢP LỆ (5 câu · ngữ liệu riêng, không lấy từ bài luyện mục 5)",
      items: [
        {
          q: "Bài: “Each visitor receives a free map and a guided walk.” — Câu: Every visitor is given a ______ as well as a guided walk. (NO MORE THAN TWO WORDS)",
          options: ["free map", "a free map", "the free map and walk"],
          correct: 0,
          why: "Chỗ trống đã có **a** đứng trước → chỉ điền **free map** (2 từ, hợp lệ). Viết “a free map” thành câu ~~a a free map~~ (bẫy 1); phương án C vừa vượt 2 từ vừa lặp walk.",
        },
        {
          q: "Bài: “Museum staff say that queues have grown longer.” — Câu: According to museum staff, ______ are longer than before. (ONE WORD ONLY)",
          options: ["queue", "lines", "queues"],
          correct: 2,
          why: "Động từ **are** → cần danh từ **số nhiều**, và bài viết **queues** (bẫy 2). ~~queue~~ sai số; lines là từ đồng nghĩa của bạn, không có trong câu bài đọc.",
        },
        {
          q: "Bài: “…visitors are asked to come by bicycle where possible.” — Câu: Visitors are encouraged to arrive by ______ if they can. (ONE WORD ONLY)",
          options: ["bike", "bicycle", "public transport"],
          correct: 1,
          why: "Đáp án phải là chữ **có trong bài**: **bicycle**. bike là từ đồng nghĩa **của bạn** (bẫy 3); public transport vừa không có trong câu này vừa là **2 từ** (vượt ONE WORD ONLY).",
        },
        {
          q: "Bài: “…the night market has become a family-friendly attraction.” — Câu: The night market is now a ______. (NO MORE THAN TWO WORDS)",
          options: ["popular family-friendly attraction", "place for families", "family-friendly attraction"],
          correct: 2,
          why: "**family-friendly** có gạch nối = **1 từ**, nên “family-friendly attraction” = 2 từ — hợp lệ. A có 3 từ (thêm popular không có trong bài); B là diễn đạt của bạn và cũng 3 từ.",
        },
        {
          q: "Bài: “The purpose of the festival is cultural: visitors learn traditional songs and dances.” — Câu: The festival is mainly meant to be ______. (ONE WORD ONLY)",
          options: ["songs", "cultural", "learn"],
          correct: 1,
          why: "Sau **to be** cần **tính từ** chỉ mục đích: **cultural** (purpose = meant to be). songs và learn là chi tiết ở vế sau — đúng chủ đề nhưng sai chỗ (bẫy 5), lại sai loại từ.",
        },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Luyện trọn bài Passage 2 (Questions 14–26)" },
    {
      t: "p",
      text: "Bấm giờ **20 phút** (đúng thời gian gợi ý cho Passage 2). Đọc lướt tiêu đề + câu đầu mỗi đoạn (1 phút), làm bước 2–3 cho câu 14–21, rồi mới đọc kỹ. Câu 22–26 là **True / False / Not Given** (ôn Tập 1 Ngày 12, Tập 2 Ngày 6).",
    },
    {
      t: "passage",
      title: "Holidays for Everyone: A Short History of Mass Tourism",
      intro: "Bài đọc 7 đoạn A–G (~750 từ). Questions 14–26 ở ngay bên dưới. Các mốc lịch sử và con số trong bài là gần đúng, đã đơn giản hoá cho bài luyện — đừng trích như dữ kiện chính xác.",
      paras: [
        {
          label: "A",
          text: "For most of human history, travelling for pleasure was a privilege of the rich. In the seventeenth and eighteenth centuries, young men from wealthy British families went on the so-called Grand Tour, a journey through France and Italy that could last two or three years. The aim was educational: these travellers were expected to study art, learn foreign languages and return home ready to take their place in society. Travel was also slow and uncomfortable: a journey that now takes two hours by plane could last several weeks by coach and boat. Ordinary working people, by contrast, rarely went further than the nearest market town, and a trip to the sea was something most of them would never experience.",
        },
        {
          label: "B",
          text: "The first real change came with the railway. In 1841, a cabinet maker named Thomas Cook organised a train trip for around 500 people from Leicester to a meeting in Loughborough, about 18 kilometres away. Each passenger paid one shilling, and the price included the train ticket and a meal. Cook soon realised that ordinary people would happily pay for trips if someone else took care of the arrangements, and within twenty years his company was taking groups of British tourists across Europe. Historians often describe him as the pioneer of the package tour, because he combined transport, accommodation and food in a single price.",
        },
        {
          label: "C",
          text: "However, it was the aeroplane that turned tourism into a mass industry. After the Second World War, there were many spare aircraft and trained pilots, and some companies began to use them for charter flights to sunny destinations. In 1950, a small British company flew a group of holidaymakers to a camp on the island of Corsica. The holiday, which included the flight, tents and meals, cost far less than the usual price of a return flight. Over the next two decades, similar trips to Spain became extremely popular, and by the 1970s millions of northern Europeans were spending two weeks every summer in resorts along the Spanish coastline. The package holiday had become a normal part of working-class life.",
        },
        {
          label: "D",
          text: "The growth since then has been remarkable. According to the United Nations World Tourism Organization, international tourist arrivals rose from about 25 million in 1950 to around 1.5 billion in 2019. Cheap flights, the internet and rising incomes in Asia all played a part. Tourism has become one of the largest industries in the world, and for some small island nations it is the main source of income. Today, a student can compare hundreds of hotels on a phone and book a weekend in another country in a few minutes, something that would have seemed impossible to Thomas Cook's first customers.",
        },
        {
          label: "E",
          text: "This success, however, has created new problems. In some popular cities, the number of visitors in a year is now many times greater than the number of people who live there. Local people complain that rents have risen because flats are rented to tourists, that small family shops have been replaced by souvenir stalls, and that the streets are too crowded to walk along in the peak season. The term 'overtourism' was created to describe this situation. Environmental damage is another concern: flying produces large amounts of carbon dioxide, and large cruise ships can pollute the water in small harbours. In addition, many jobs in tourism are seasonal and poorly paid, so local workers may earn very little in winter.",
        },
        {
          label: "F",
          text: "Several destinations have started to respond. Venice, for example, began charging an entry fee to day visitors on its busiest days in 2024, while Amsterdam decided in the same year not to allow any new hotels to be built in the city. Other places are trying to spread visitors more evenly, by promoting less famous areas and encouraging people to travel outside the summer months. Not everyone agrees with these measures: some business owners fear that fewer visitors will mean less income for the city.",
        },
        {
          label: "G",
          text: "Supporters of 'sustainable tourism' argue that the answer is not to stop people travelling but to change the way they travel. They encourage tourists to stay longer in one place instead of visiting many cities in a short trip, to use trains where possible, and to spend their money in locally owned businesses rather than international chains. Critics reply that such advice mainly suits wealthy travellers who have time and money to spare. Whoever is right, the history of tourism suggests one lesson: each new form of transport has opened travel to more people, and each time, the places they visit have had to adapt.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 14–21.** Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — **Hoàn thành các câu dưới đây. Chọn KHÔNG QUÁ HAI TỪ trong bài cho mỗi câu trả lời.**",
    },
    {
      t: "quiz",
      id: "t2d14-doc-cau",
      title: "Questions 14–21 — Sentence completion (NO MORE THAN TWO WORDS)",
      kind: "fill",
      items: [
        { q: "(14) The Grand Tour was mainly intended to be ______.", answers: ["educational"] },
        { q: "(15) In the past, most working people did not travel beyond the closest ______.", answers: ["market town"] },
        { q: "(16) The passengers on Thomas Cook's first trip travelled to a ______ in Loughborough.", answers: ["meeting"] },
        { q: "(17) Cook is regarded as the first organiser of package tours because he sold transport, accommodation and food for a ______.", answers: ["single price"] },
        { q: "(18) After 1945, aircraft that were no longer needed were used for ______ to warm places.", answers: ["charter flights"] },
        { q: "(19) By the 1970s, the package holiday had become an ordinary part of ______.", answers: ["working-class life", "working class life"] },
        { q: "(20) Residents say that ______ have gone up because homes are let to visitors.", answers: ["rents"] },
        { q: "(21) Supporters of sustainable tourism tell travellers to use ______ whenever possible.", answers: ["trains"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 14–21 (paraphrase từ câu hỏi → bài đọc)",
      items: [
        "**(14) educational** — đoạn **A**: “The **aim** was **educational**”. mainly intended to be = aim. Sau **to be** cần tính từ. Bẫy: “study art” ở câu sau là **chi tiết**, không phải mục đích chung.",
        "**(15) market town** — đoạn **A**: “rarely went further than the **nearest** market town”. did not travel beyond = rarely went further than · closest = nearest. Hai từ, đúng giới hạn.",
        "**(16) meeting** — đoạn **B**: “from Leicester to a **meeting** in Loughborough”. Chỗ trống có sẵn **a** → chỉ điền meeting. Bẫy: Leicester là nơi **xuất phát**, không phải nơi đến.",
        "**(17) single price** — đoạn **B**: “combined transport, accommodation and food **in a single price**”. regarded as the first organiser = pioneer. Câu hỏi có sẵn **a** → “single price” (2 từ); viết ~~a single price~~ là 3 từ.",
        "**(18) charter flights** — đoạn **C**: “many **spare aircraft**… use them for **charter flights** to **sunny destinations**”. After 1945 = After the Second World War · no longer needed = spare · warm places = sunny destinations. Số nhiều (-s) vì “aircraft” nhiều chiếc, bài cũng viết flights.",
        "**(19) working-class life** — đoạn **C**, câu cuối: “a **normal** part of working-class life” (ordinary = normal). working-class có gạch nối = 1 từ.",
        "**(20) rents** — đoạn **E**: “**rents have risen** because flats are rented to tourists”. gone up = risen · homes are let = flats are rented. Động từ **have** → số nhiều → **rents**, không phải ~~rent~~.",
        "**(21) trains** — đoạn **G**: “to use **trains where possible**”. whenever possible = where possible. Chép đúng dạng số nhiều trong bài; ~~railways~~ là từ của bạn.",
      ],
    },
    {
      t: "p",
      text: "**Questions 22–26.** Do the following statements agree with the information given in the passage? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this.",
    },
    {
      t: "mcq",
      id: "t2d14-doc-tfng",
      title: "Questions 22–26 — True / False / Not Given",
      items: [
        { q: "(22) Passengers on Cook's 1841 trip had to pay for their meal separately.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn **B**: “the price **included** the train ticket **and a meal**” → bữa ăn đã nằm trong giá. Câu hỏi nói “trả riêng” → ngược → **FALSE**." },
        { q: "(23) The 1950 holiday in Corsica included hotel accommodation.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn **C**: “a **camp**… The holiday, which included the flight, **tents** and meals” → ngủ lều, không phải khách sạn → **FALSE**." },
        { q: "(24) International tourist arrivals in 2019 were more than fifty times higher than in 1950.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn **D**: 25 triệu (1950) → khoảng 1,5 tỉ (2019). 1.500 ÷ 25 = **60 lần** > 50 → **TRUE**. Passage 2 đôi khi yêu cầu một phép tính đơn giản như vậy." },
        { q: "(25) Most people who live in Venice support the entry fee.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn **F** chỉ nói Venice **bắt đầu thu phí** và **một số chủ doanh nghiệp** lo mất thu nhập. Bài **không** nói đa số cư dân ủng hộ hay phản đối → **NOT GIVEN**. Bẫy: có chữ Venice + entry fee trùng bài." },
        { q: "(26) Critics believe that sustainable tourism advice is easier for richer people to follow.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn **G**: “Critics reply that such advice **mainly suits wealthy travellers** who have time and money to spare.” richer people = wealthy travellers · easier to follow = suits → **TRUE**." },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại cả bài — rút kinh nghiệm",
      items: [
        "Câu 14–21 trải từ **đoạn A tới đoạn G** theo đúng thứ tự — làm xong câu 17 (đoạn B) thì câu 18 chắc chắn nằm **sau** đó. Không tìm thấy một câu? Đánh dấu, đi tiếp; khoảng giữa hai câu đã tìm được chính là chỗ đáp án.",
        "Năm câu dùng **tên riêng / năm** làm mốc dò (Grand Tour, Thomas Cook, Loughborough, 1945 ↔ Second World War, 1970s). Gạch các mốc này **trước** khi đọc.",
        "Ba câu khó nhất (15, 18, 20) đều là **paraphrase**: closest ↔ nearest · no longer needed ↔ spare · gone up ↔ risen. Đây là kỹ năng chính của Passage 2.",
        "Chưa đạt 6/8? Làm lại mục 3 (6 bước) và mục 4 (5 bẫy), rồi làm lại bài này sau 2 ngày mà không nhìn đáp án.",
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "privilege", pos: "n", ipa: "/ˈprɪvəlɪdʒ/", vi: "đặc quyền", ex: "Travelling abroad was once a privilege of the rich.", exVi: "Đi nước ngoài từng là đặc quyền của người giàu.", more: "Họ: **privileged** (adj, có đặc quyền): a privileged background. **It is a privilege to** + V (vinh dự được…)." },
        { w: "pioneer", pos: "n / v", ipa: "/ˌpaɪəˈnɪə(r)/", vi: "người tiên phong; đi tiên phong", ex: "Thomas Cook was a pioneer of the package tour.", exVi: "Thomas Cook là người tiên phong của tour trọn gói.", more: "**a pioneer of / in** sth · động từ: **pioneer a new method**. Nhấn âm cuối: pio**NEER**." },
        { w: "charter flight", pos: "n", ipa: "/ˈtʃɑːtə flaɪt/", vi: "chuyến bay thuê bao (không theo lịch thường)", ex: "The tour company used charter flights to reduce costs.", exVi: "Công ty du lịch dùng chuyến bay thuê bao để giảm chi phí.", more: "Khác **scheduled flight** (chuyến bay theo lịch cố định). **charter** (v) = thuê nguyên chiếc (máy bay, tàu)." },
        { w: "resort", pos: "n", ipa: "/rɪˈzɔːt/", vi: "khu nghỉ dưỡng", ex: "Many families spend their summer holiday in seaside resorts.", exVi: "Nhiều gia đình nghỉ hè ở các khu nghỉ dưỡng ven biển.", more: "**a seaside / ski / beach resort** · **a resort town**. Cụm khác: **as a last resort** (biện pháp cuối cùng)." },
        { w: "measure", pos: "n", ipa: "/ˈmeʒə(r)/", vi: "biện pháp", ex: "The city introduced several measures to reduce crowds.", exVi: "Thành phố đưa ra một số biện pháp để giảm đông đúc.", more: "Nghĩa “biện pháp” thường **số nhiều**: **take measures to** + V · **introduce / adopt measures**. Rất hay gặp trong đề Task 2 dạng problem / solution: “What **measures** can be taken…?”" },
      ],
    },
  ],
};

/* ─────────────────────────── Viết ─────────────────────────── */

const T2D14_WRITING: Lesson = {
  id: "t2d14-viet",
  kind: "writing",
  title: "Viết Task 2: Problem / solution · Cause / effect (+ solution)",
  goal: "Nhận ra 4 kiểu đề vấn đề – giải pháp / nguyên nhân – kết quả, dựng khung 4 đoạn đúng kiểu, viết thân bài có giải thích + ví dụ, đưa giải pháp gắn đúng vấn đề bằng should / câu điều kiện loại 1, và viết trọn bài ≥ 250 từ ở mức band 5.0–5.5 (Task Response + Coherence & Cohesion).",
  minutes: 80,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Dạng đề **Problem / Solution** và **Cause / Effect** chiếm khoảng một phần tư đề Task 2. Đề có **hai câu hỏi** → bài phải trả lời **cả hai**, mỗi câu một đoạn thân bài.",
        "**4 kiểu đề**: vấn đề + giải pháp · nguyên nhân + giải pháp · nguyên nhân + kết quả · (cho sẵn vấn đề) chỉ hỏi biện pháp. Đọc **câu hỏi cuối đề** để biết kiểu.",
        "Khung **4 đoạn**: Mở bài (paraphrase + nói sẽ bàn gì) → Thân 1 → Thân 2 → Kết bài (tóm lại, không ý mới). **Giải pháp phải gắn đúng vấn đề** đã nêu.",
        "Ngôn ngữ **nguyên nhân – kết quả** mức B1: because / because of · cause · lead to · result in · As a result, · This means that… ; **giải pháp**: should + V · One solution would be to + V · If + hiện tại, S + will + V (Ngày 13).",
        "Đẩy band nào? **Task Response 5 → 5.5**: trả lời đủ hai câu hỏi, ý có giải thích; **Coherence & Cohesion**: mỗi đoạn một ý chính, từ nối đúng vai (không lạm dụng). Hai bài mẫu trọn (band ước tính 5.5–6.0) + so một đoạn band 4.5 với 5.5.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Bốn kiểu đề — đọc câu hỏi cuối để biết mình phải viết gì" },
    {
      t: "p",
      text: "Đề Task 2 dạng này luôn gồm **một câu nêu tình huống** (một xu hướng, một vấn đề) và **một hoặc hai câu hỏi**. Phần tình huống chỉ là bối cảnh; **câu hỏi** mới quyết định thân bài. Lỗi band 4 kinh điển: đề hỏi **nguyên nhân + giải pháp** mà bài lại viết **ưu – nhược điểm**.",
    },
    {
      t: "table",
      caption: "Bốn kiểu đề Problem / Solution · Cause / Effect",
      head: ["Kiểu", "Câu hỏi trong đề thường là", "Thân 1", "Thân 2"],
      rows: [
        ["**A. Vấn đề + giải pháp**", "What **problems** does this cause? What **solutions** can you suggest?", "2 vấn đề", "2 giải pháp (khớp từng vấn đề)"],
        ["**B. Nguyên nhân + giải pháp**", "**Why** is this happening? / What are the **causes**? What **can be done**?", "2 nguyên nhân", "2 giải pháp (đánh vào nguyên nhân)"],
        ["**C. Nguyên nhân + kết quả**", "What are the **reasons** for this? What **effects** does it have?", "2 nguyên nhân", "2 kết quả (cho cá nhân / xã hội)"],
        ["**D. Cho sẵn vấn đề — hỏi biện pháp**", "X is a serious problem. What **measures** could be taken to **tackle** it?", "biện pháp 1 + giải thích", "biện pháp 2 + giải thích"],
      ],
    },
    {
      t: "note",
      title: "Mẹo đọc đề",
      items: [
        "Gạch **từ hỏi**: why / reasons / causes → **nguyên nhân**; effects / impact / consequences → **kết quả**; problems / issues / difficulties → **vấn đề**; solutions / measures / what can be done / how can… be solved → **giải pháp**.",
        "Có biến thể **kết quả + giải pháp** (What are the effects… and how can they be reduced?) — vẫn dùng khung 4 đoạn: Thân 1 kết quả, Thân 2 giải pháp.",
        "Nếu câu hỏi thứ hai là **“Is this a positive or negative development?”** thì đó là **two-part question** (học ở Ngày 18), không phải dạng hôm nay — thân bài 2 phải nêu **quan điểm**.",
      ],
    },
    {
      t: "mcq",
      id: "t2d14-viet-kieu-de",
      title: "Đề này thuộc kiểu nào? (5 câu)",
      items: [
        { q: "Many young people today spend too much time on social media. Why is this the case, and what can be done about it?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 1, why: "**Why is this the case** = hỏi **nguyên nhân**; **what can be done** = hỏi **giải pháp** → kiểu B. Không có chữ effects / problems." },
        { q: "Traffic congestion is a growing problem in many cities. What measures could be taken to reduce it?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 3, why: "Đề **cho sẵn** vấn đề (traffic congestion) và chỉ có **một câu hỏi**: What **measures**… → kiểu D. Thân 1 và Thân 2 đều là biện pháp (có thể nhắc nguyên nhân trong lúc giải thích)." },
        { q: "Fewer people are reading books than in the past. What are the reasons for this, and what effects does it have?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 2, why: "**reasons** = nguyên nhân; **effects** = kết quả → kiểu C. Đừng thêm giải pháp thành một đoạn riêng — đề không hỏi." },
        { q: "Plastic waste is polluting beaches in many tourist areas. What problems does this cause, and what are the possible solutions?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 0, why: "**problems** + **solutions** → kiểu A. Thân 1 nêu 2 vấn đề rác nhựa gây ra (cho du lịch, sinh vật biển…), Thân 2 nêu 2 giải pháp khớp từng vấn đề." },
        { q: "In some cities, the cost of housing has risen sharply. What are the causes of this, and what measures can governments take?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 1, why: "**causes** = nguyên nhân; **measures** = giải pháp → kiểu B. Câu hỏi có hai phần nên không phải kiểu D (D chỉ hỏi biện pháp)." },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Khung 4 đoạn" },
    {
      t: "sodo",
      kind: "flow",
      title: "Bài Problem / Solution · Cause / Effect — 4 đoạn, ~260–290 từ",
      caption: "Mở bài và kết bài ngắn (khoảng 40–50 từ mỗi đoạn); hai thân bài dài (90–100 từ) vì điểm Task Response nằm ở đây.",
      steps: [
        { label: "Mở bài (2–3 câu)", sub: "Paraphrase tình huống + “This essay will discuss … and suggest …”" },
        { label: "Thân 1 (~95 từ)", sub: "Câu chủ đề → vấn đề / nguyên nhân 1 + giải thích + ví dụ → vấn đề / nguyên nhân 2 + giải thích" },
        { label: "Thân 2 (~95 từ)", sub: "Câu chủ đề → giải pháp / kết quả 1 + vì sao hiệu quả → giải pháp / kết quả 2 + ví dụ" },
        { label: "Kết bài (2 câu)", sub: "In conclusion + tóm hai ý chính bằng lời khác — KHÔNG thêm ý mới" },
      ],
    },
    {
      t: "table",
      caption: "Câu mở và câu chủ đề mẫu cho từng kiểu",
      head: ["Chỗ", "Kiểu A / D (vấn đề – giải pháp)", "Kiểu B / C (nguyên nhân – …)"],
      rows: [
        ["Mở bài, câu 2", "This essay will discuss the main problems this causes and suggest some possible solutions.", "This essay will examine the main reasons for this trend and its effects / possible solutions."],
        ["Thân 1, câu chủ đề", "The main problem is that + S + V. / There are two main problems.", "There are two main reasons for this. / The first cause is + N."],
        ["Thân 2, câu chủ đề", "There are several ways to solve these problems.", "This trend has serious effects on… / Several measures could be taken."],
        ["Kết bài", "In conclusion, X causes … ; however, these problems can be reduced if …", "In conclusion, X is mainly caused by … and it leads to …"],
      ],
    },
    {
      t: "rule",
      formula: "Intro (paraphrase + this essay will…) → Body 1 (vấn đề / nguyên nhân ×2) → Body 2 (giải pháp / kết quả ×2) → Conclusion (tóm, không ý mới)",
      vi: "Hai câu hỏi của đề = hai đoạn thân bài. Thiếu một câu hỏi là Task Response tụt xuống band 4–5.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Viết thân bài: giải thích, ví dụ — và giải pháp phải khớp vấn đề" },
    {
      t: "p",
      text: "Ở Ngày 2 bạn đã viết thân bài **P-E-E** (Point – Explanation – Example) cho bài Opinion. Dạng hôm nay dùng đúng khung đó, chỉ đổi **Point** thành **vấn đề / nguyên nhân / giải pháp**. Câu giải thích trả lời **“vì sao / thế nào?”**, câu ví dụ trả lời **“ở đâu, ai, bao nhiêu?”**.",
    },
    {
      t: "table",
      caption: "Một ý trong thân bài = 3 lớp",
      head: ["Lớp", "Vấn đề / nguyên nhân", "Giải pháp"],
      rows: [
        ["**Point** (ý)", "Many owners rent their flats to tourists.", "Local governments **should** limit holiday rentals."],
        ["**Explanation** (vì sao / dẫn tới gì)", "**As a result**, there are fewer homes for local families and rents rise.", "**If** there are clear rules, more homes **will** be available for residents."],
        ["**Example / Result** (ví dụ, kết quả)", "**For example**, young people in some parts of Barcelona cannot afford to live where they grew up.", "**This would** stop prices rising so quickly."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Giải pháp khớp vấn đề vs giải pháp chung chung",
      caption: "Giám khảo đọc Thân 2 và hỏi: giải pháp này giải quyết vấn đề NÀO ở Thân 1? Không trả lời được → ý “không liên quan” (irrelevant), Task Response bị trừ.",
      cols: [
        {
          title: "✅ Khớp (band 5.5+)",
          anh: "check-mark-button",
          items: [
            "Vấn đề: **rents rise** vì căn hộ cho khách thuê",
            "→ Giải pháp: **limit the number of flats** rented to tourists",
            "Vấn đề: **streets crowded** mùa cao điểm",
            "→ Giải pháp: **promote travel in other seasons** and less famous areas",
          ],
        },
        {
          title: "❌ Chung chung (band 4–4.5)",
          anh: "cross-mark",
          items: [
            "“The government **should do something**.”",
            "“People **should be more responsible**.”",
            "“Tourists **should stop travelling**.” (không thực tế)",
            "Giải pháp không nhắc lại vấn đề nào ở Thân 1",
          ],
        },
      ],
    },
    {
      t: "mcq",
      id: "t2d14-viet-khop",
      title: "Chọn giải pháp KHỚP với vấn đề (4 câu)",
      items: [
        { q: "Problem: Rents in the old town are rising because many flats are rented to tourists.", options: ["The city should build more museums.", "The city should limit the number of flats that can be rented to tourists.", "Tourists should learn more about local culture."], correct: 1, why: "Vấn đề là **căn hộ bị chuyển sang cho khách thuê** → giải pháp đánh thẳng vào đó: **hạn chế căn hộ cho khách thuê**. A và C đúng chủ đề du lịch nhưng không giải quyết giá thuê nhà." },
        { q: "Problem: The streets are too crowded in July and August.", options: ["Petrol taxes should be increased.", "All hotels in the city should be closed.", "The city should encourage people to visit in other seasons and explore less famous areas."], correct: 2, why: "Đông vì khách dồn vào **hai tháng hè và vài điểm nổi tiếng** → **giãn khách** theo mùa và theo khu vực. A không liên quan; B cực đoan, không thực tế (mất điểm lập luận)." },
        { q: "Problem: Children spend so much time on screens that they rarely exercise.", options: ["Schools should offer a sports session every day.", "Cities should build more car parks.", "All video games should be banned around the world."], correct: 0, why: "Thiếu vận động → **tạo thời gian vận động bắt buộc** ở trường. B không liên quan; C cực đoan và không thể thực hiện — giám khảo coi là ý thiếu thuyết phục." },
        { q: "Problem: Popular beaches are polluted by plastic bottles and bags.", options: ["Hotels should be made bigger.", "Tourists should be encouraged to travel by train.", "More bins should be provided, and people who drop litter should be fined."], correct: 2, why: "Rác nhựa trên bãi biển → **thêm thùng rác + phạt người xả rác**. B giảm khí thải chứ không giảm rác nhựa; A không liên quan." },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Ngôn ngữ nguyên nhân – kết quả (mức B1)" },
    {
      t: "p",
      text: "Bạn chỉ cần **sáu khung** dưới đây để viết trọn dạng bài hôm nay. Bảng đầy đủ (due to, owing to, consequently, thereby…) học ở **Tập 3 Ngày 21** — dùng ít khung mà **đúng** được điểm cao hơn dùng nhiều khung mà sai.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V + because + S + V · because of + N",
          vi: "Nối nguyên nhân trong cùng câu. because + MỆNH ĐỀ (có S + V); because of + DANH TỪ / cụm danh từ.",
          examples: [
            { en: "Rents are rising because many flats are rented to tourists.", vi: "Giá thuê nhà tăng vì nhiều căn hộ được cho du khách thuê." },
            { en: "Many flights were cancelled because of the storm.", vi: "Nhiều chuyến bay bị huỷ vì cơn bão." },
          ],
        },
        {
          formula: "N (nguyên nhân) + cause / lead to / result in + N (kết quả)",
          vi: "Động từ nối nguyên nhân → kết quả. lead to và result in luôn có giới từ; sau đó là danh từ hoặc V-ing.",
          examples: [
            { en: "Mass tourism can lead to higher prices for local people.", vi: "Du lịch đại chúng có thể dẫn đến giá cả cao hơn cho người dân địa phương." },
            { en: "Long working hours often result in stress and poor sleep.", vi: "Làm việc nhiều giờ thường gây ra căng thẳng và ngủ kém." },
          ],
        },
        {
          formula: "S + V. As a result, / This means that + S + V.",
          vi: "Nối kết quả sang CÂU MỚI — rất hợp để viết lớp Explanation trong thân bài.",
          examples: [
            { en: "Many owners prefer to rent their flats to tourists. As a result, there are fewer homes for local families.", vi: "Nhiều chủ nhà thích cho khách du lịch thuê căn hộ hơn. Kết quả là có ít nhà hơn cho các gia đình địa phương." },
            { en: "Employees can be contacted at any time. This means that they rarely switch off from work.", vi: "Nhân viên có thể bị liên lạc bất cứ lúc nào. Điều đó có nghĩa là họ hiếm khi tách khỏi công việc." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với because / lead to",
      items: [
        "~~Because of tourists come in large numbers, …~~ → **Because** tourists come… (có S + V) hoặc **Because of** the large number of tourists, … (danh từ).",
        "~~lead to increase prices~~ → **lead to higher prices** / **lead to an increase in prices** / lead to prices **rising**. Sau **to** của lead to là danh từ / V-ing, không phải V nguyên mẫu.",
        "~~cause to stress~~ → **cause stress** (cause không có giới từ). Ngược lại ~~result stress~~ → **result in stress**.",
        "**Because** đứng đầu câu thì câu phải có **hai vế**: ~~Because the rent is high.~~ (câu cụt) → Because the rent is high, many young people live with their parents.",
        "Đừng mở **mọi** câu bằng As a result / Moreover — band 5 “lạm dụng từ nối”. Một đoạn 2–3 từ nối là đủ (từ nối học kỹ ở Ngày 17).",
      ],
    },
    {
      t: "rule",
      formula: "because + S + V · because of + N · N + causes / leads to / results in + N · …. As a result, S + V.",
      vi: "because cần mệnh đề, because of cần danh từ; lead to / result in luôn có giới từ, cause thì không.",
    },
    {
      t: "quiz",
      id: "t2d14-viet-nhan-qua-dich",
      title: "Dịch sang tiếng Anh — nguyên nhân & kết quả (5 câu)",
      kind: "translate",
      grammar: "because + S + V · because of / due to + N · N + causes / leads to / results in + N · As a result, S + V.",
      items: [
        { q: "Giá thuê nhà tăng vì nhiều căn hộ được cho du khách thuê.", hint: "Rents (are rising / have risen), because, many flats / apartments, are rented to tourists", answers: ["Rents are rising because many flats are rented to tourists.", "Rents have risen because many flats are rented to tourists.", "Rents rise because many flats are rented to tourists.", "Rents are rising because many apartments are rented to tourists.", "Rents have risen because many apartments are rented to tourists.", "Rents are rising because many flats are rented out to tourists.", "Rents have risen because many flats are rented out to tourists.", "Rent is rising because many flats are rented to tourists.", "Rents are increasing because many flats are rented to tourists.", "Rents are going up because many flats are rented to tourists.", "Rents are rising because many flats are let to tourists.", "Rents are rising because a lot of flats are rented to tourists."] },
        { q: "Ô nhiễm không khí gây ra nhiều bệnh về đường hô hấp.", hint: "Air pollution, causes, many breathing problems / respiratory diseases", answers: ["Air pollution causes many breathing problems.", "Air pollution causes many respiratory diseases.", "Air pollution causes many respiratory illnesses.", "Air pollution causes many respiratory problems.", "Air pollution leads to many respiratory diseases.", "Air pollution leads to many breathing problems.", "Air pollution causes a lot of respiratory diseases.", "Air pollution causes a lot of breathing problems.", "Air pollution causes many diseases of the respiratory system.", "Air pollution results in many respiratory diseases."] },
        { q: "Làm việc quá nhiều có thể dẫn đến căng thẳng.", hint: "Working too much / Overwork, can lead to / can result in, stress", answers: ["Working too much can lead to stress.", "Working too much can result in stress.", "Working too much can cause stress.", "Overwork can lead to stress.", "Overwork can result in stress.", "Overworking can lead to stress.", "Too much work can lead to stress."] },
        { q: "Vì giao thông đông đúc, nhiều người đi làm muộn.", hint: "Because of / Due to, heavy traffic, many people, are late for work", answers: ["Because of heavy traffic, many people are late for work.", "Due to heavy traffic, many people are late for work.", "Because of the heavy traffic, many people are late for work.", "Because of heavy traffic, many people arrive at work late.", "Because of heavy traffic, many people get to work late.", "Many people are late for work because of heavy traffic.", "Many people are late for work due to heavy traffic.", "Because the traffic is heavy, many people are late for work."] },
        { q: "Vé máy bay rẻ hơn. Kết quả là ngày càng nhiều người đi du lịch nước ngoài.", hint: "Flights / Air tickets are cheaper. As a result, more and more people, travel abroad", answers: ["Flights are cheaper. As a result, more and more people travel abroad.", "Air tickets are cheaper. As a result, more and more people travel abroad.", "Plane tickets are cheaper. As a result, more and more people travel abroad.", "Flights are cheaper. As a result, more and more people are travelling abroad.", "Air tickets are cheaper. As a result, more and more people are travelling abroad.", "Flights are cheaper. As a result, more and more people are traveling abroad.", "Flights have become cheaper. As a result, more and more people travel abroad.", "Air fares are cheaper. As a result, more and more people travel abroad."] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Ngôn ngữ giải pháp: should · One solution would be to · If + hiện tại, will" },
    {
      t: "patterns",
      rows: [
        {
          formula: "Governments / Schools / Companies + should + V",
          vi: "Ai nên làm gì — câu giải pháp cơ bản nhất (modal should, Tập 1 Ngày 13). Luôn nói RÕ AI làm.",
          examples: [
            { en: "Local governments should limit the number of flats that can be rented to visitors.", vi: "Chính quyền địa phương nên giới hạn số căn hộ được cho khách thuê." },
          ],
        },
        {
          formula: "One solution would be to + V · Another (possible) solution is to + V",
          vi: "Mở một giải pháp mới, giọng đề xuất mềm hơn should.",
          examples: [
            { en: "Another solution would be to encourage tourists to visit at different times of the year.", vi: "Một giải pháp khác là khuyến khích du khách đến vào các thời điểm khác trong năm." },
          ],
        },
        {
          formula: "If + S + V (hiện tại), S + will + V · This will / would help (to) + V",
          vi: "Nói kết quả của giải pháp — câu điều kiện loại 1 (Ngày 13). Mệnh đề If KHÔNG dùng will.",
          examples: [
            { en: "If there are clear rules, more homes will be available for residents.", vi: "Nếu có quy định rõ ràng, sẽ có nhiều nhà hơn cho cư dân." },
            { en: "This would help to spread the income from tourism more fairly.", vi: "Việc này sẽ giúp chia thu nhập từ du lịch công bằng hơn." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận khi viết giải pháp",
      items: [
        "~~If the government will build more bus lanes, …~~ → **If the government builds** more bus lanes, traffic **will** fall. Không có will trong mệnh đề If.",
        "~~should to limit~~ → **should limit**; ~~One solution would be limit~~ → One solution would be **to limit**.",
        "Giải pháp **thực tế** và **cụ thể**: thay “do something” bằng **ai + làm gì + để làm gì**. ~~Tourists should stop travelling~~ là cực đoan.",
      ],
    },
    {
      t: "rule",
      formula: "S (ai) + should + V · One solution would be to + V · If + S + V(s/es), S + will + V",
      vi: "Giải pháp = AI làm GÌ → giải quyết vấn đề NÀO → kết quả (will).",
    },
    {
      t: "quiz",
      id: "t2d14-viet-giai-phap-dich",
      title: "Dịch sang tiếng Anh — câu giải pháp (4 câu)",
      kind: "translate",
      grammar: "S + should + V · One solution is / would be to + V · If + S + V (hiện tại), S + will + V · This will / would help (to) + V",
      items: [
        { q: "Chính phủ nên đầu tư nhiều hơn vào giao thông công cộng.", hint: "The government, should invest more in, public transport", answers: ["The government should invest more in public transport.", "Governments should invest more in public transport.", "The government should invest more money in public transport.", "The government should invest more in public transportation.", "The authorities should invest more in public transport."] },
        { q: "Một giải pháp là giới hạn số du khách mỗi ngày.", hint: "One solution is / would be, to limit / to restrict, the number of visitors, each day / per day", answers: ["One solution is to limit the number of visitors each day.", "One solution is to limit the number of visitors per day.", "One solution would be to limit the number of visitors each day.", "One solution would be to limit the number of visitors per day.", "One solution is to restrict the number of visitors each day.", "One solution is to restrict the number of visitors per day.", "One solution would be to restrict the number of visitors each day.", "One solution would be to restrict the number of visitors per day.", "One solution is to limit the number of tourists each day.", "One solution is to limit the number of tourists per day."] },
        { q: "Nếu trường học dạy kỹ năng quản lý thời gian, học sinh sẽ bớt căng thẳng.", hint: "If schools teach, time management skills, students will be / feel less stressed", answers: ["If schools teach time management skills, students will be less stressed.", "If schools teach time management skills, students will feel less stressed.", "If schools teach students time management skills, they will be less stressed.", "If schools teach students time management skills, they will feel less stressed.", "If schools teach time management, students will be less stressed.", "If schools teach time-management skills, students will be less stressed.", "Students will be less stressed if schools teach time management skills.", "If schools teach time management skills, students will have less stress."] },
        { q: "Việc này sẽ giúp giảm ô nhiễm ở các bãi biển.", hint: "This will / would help (to) reduce, pollution, on the beaches", answers: ["This will help reduce pollution on the beaches.", "This will help to reduce pollution on the beaches.", "This would help reduce pollution on the beaches.", "This would help to reduce pollution on the beaches.", "This will help reduce pollution on beaches.", "This will help to reduce pollution on beaches.", "This will help reduce beach pollution.", "This would help reduce pollution on beaches.", "This will help reduce pollution at the beaches."] },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bài mẫu 1 — Problems + Solutions (band ước tính 5.5–6.0)" },
    {
      t: "p",
      text: "**Đề:** In some popular cities, the number of tourists has become too large. What problems does this cause for local people, and what can be done to solve them? — **Kiểu A** (vấn đề + giải pháp). Dàn ý 5 phút: Thân 1 = (1) nhà ở đắt vì căn hộ cho khách thuê · (2) phố quá đông mùa cao điểm; Thân 2 = (1) giới hạn căn hộ cho khách thuê · (2) giãn khách theo mùa và khu vực.",
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] Over the last twenty years, cheap flights and the internet have made it possible for millions of people to visit famous cities every year. However, in some places the number of tourists is now so large that it causes serious problems for local residents. This essay will discuss the main problems and suggest some possible solutions.", vi: "[Mở bài] Trong hai mươi năm qua, vé máy bay rẻ và internet đã giúp hàng triệu người có thể đến thăm các thành phố nổi tiếng mỗi năm. Tuy nhiên, ở một số nơi, số du khách giờ lớn đến mức gây ra những vấn đề nghiêm trọng cho cư dân địa phương. Bài luận này sẽ bàn về các vấn đề chính và đề xuất một số giải pháp." },
        { en: "[Body 1] The main problem is that ordinary people find it harder to live in their own city. Firstly, many apartment owners prefer to rent their flats to tourists because they can earn more money. As a result, there are fewer homes for local families, and rents become too expensive. For example, in some parts of Barcelona, young people cannot afford to live in the area where they grew up. Secondly, the city centre becomes extremely crowded, especially in the peak season, and residents often feel that the streets do not belong to them any more.", vi: "[Thân bài 1] Vấn đề chính là người dân bình thường thấy khó sống hơn ngay trong thành phố của mình. Thứ nhất, nhiều chủ căn hộ thích cho khách du lịch thuê vì kiếm được nhiều tiền hơn. Kết quả là có ít nhà hơn cho các gia đình địa phương và giá thuê trở nên quá đắt. Ví dụ, ở một số khu của Barcelona, người trẻ không đủ tiền sống ở chính khu họ lớn lên. Thứ hai, trung tâm thành phố trở nên cực kỳ đông đúc, nhất là vào mùa cao điểm, và cư dân thường cảm thấy những con phố không còn thuộc về họ nữa." },
        { en: "[Body 2] There are several ways to solve these problems. First of all, local governments should limit the number of flats that can be rented to visitors. If there are clear rules, more homes will be available for residents, and prices will not rise so quickly. Another solution would be to encourage tourists to visit at different times of the year and to explore less famous areas. For instance, cities could offer cheaper museum tickets in winter. This would reduce the crowds in summer and spread the income from tourism more fairly.", vi: "[Thân bài 2] Có một số cách để giải quyết những vấn đề này. Trước hết, chính quyền địa phương nên giới hạn số căn hộ được cho khách thuê. Nếu có quy định rõ ràng, sẽ có nhiều nhà hơn cho cư dân và giá sẽ không tăng nhanh như vậy. Một giải pháp khác là khuyến khích du khách đến vào các thời điểm khác trong năm và khám phá những khu ít nổi tiếng hơn. Chẳng hạn, các thành phố có thể bán vé bảo tàng rẻ hơn vào mùa đông. Điều này sẽ giảm đông đúc vào mùa hè và chia thu nhập từ du lịch công bằng hơn." },
        { en: "[Conclusion] In conclusion, overtourism makes housing more expensive and city centres too crowded for local people. However, these problems can be reduced if governments control holiday rentals and encourage visitors to travel outside the busiest months.", vi: "[Kết bài] Tóm lại, quá tải du lịch khiến nhà ở đắt hơn và trung tâm thành phố quá đông đúc với người dân địa phương. Tuy nhiên, những vấn đề này có thể giảm bớt nếu chính quyền kiểm soát việc cho thuê nhà nghỉ và khuyến khích du khách đi vào ngoài những tháng đông nhất." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu 1 ở khoảng band 5.5–6.0 (chưa lên 6.5)?",
      head: ["Tiêu chí", "Điểm mạnh (có trong bài)", "Còn thiếu để lên band cao hơn"],
      rows: [
        ["**Task Response**", "Trả lời **đủ hai câu hỏi** (problems · solutions); mỗi ý có giải thích; ví dụ Barcelona, vé bảo tàng mùa đông", "Ý còn khá quen thuộc; ví dụ chưa có số liệu; giải pháp 2 chưa nói rõ AI thực hiện ngoài “cities”"],
        ["**Coherence & Cohesion**", "4 đoạn rõ; câu chủ đề mở mỗi thân bài; giải pháp **khớp** từng vấn đề (rent ↔ limit rentals; crowds ↔ spread visitors)", "Từ nối còn **máy móc** (Firstly / Secondly / First of all / Another solution); mở bài dùng câu khuôn “This essay will discuss…”"],
        ["**Lexical Resource**", "Từ chủ đề đúng: residents, rents, peak season, overtourism, holiday rentals, spread the income", "Ít từ ít gặp / collocation học thuật (put pressure on infrastructure, impose restrictions); có lặp “tourists / visitors”"],
        ["**Grammar (GRA)**", "Câu phức đúng: because…, If + hiện tại → will, where they grew up, that can be rented; không lỗi", "Cấu trúc câu chưa đa dạng (nhiều câu S + V + O); bị động mới có hai chỗ (can be rented, can be reduced), chưa có mệnh đề phân từ"],
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Bài mẫu 2 — Causes + Effects (band ước tính 5.5–6.0)" },
    {
      t: "p",
      text: "**Đề:** In many countries, people are working longer hours than in the past. Why is this happening? What effects does this have on individuals and society? — **Kiểu C** (nguyên nhân + kết quả). Để ý: đề hỏi kết quả cho **hai đối tượng** (individuals and society) → Thân 2 nói cả hai.",
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] In many countries today, it is common for people to work ten or even twelve hours a day. There are several reasons for this trend, and it has a number of negative effects on both individuals and society as a whole.", vi: "[Mở bài] Ở nhiều nước ngày nay, việc người ta làm việc mười hoặc thậm chí mười hai tiếng một ngày là chuyện bình thường. Có một số lý do cho xu hướng này, và nó gây ra nhiều tác động tiêu cực cho cả cá nhân lẫn toàn xã hội." },
        { en: "[Body 1] There are two main causes of this situation. The first cause is the cost of living. In big cities, rent, food and school fees have increased quickly, so many workers have to do overtime or take a second job to pay their bills. The second cause is technology. Because of smartphones and email, employees can be contacted at any time, and many of them continue working after they leave the office. For example, a lot of office workers answer messages from their managers late in the evening or even at weekends.", vi: "[Thân bài 1] Có hai nguyên nhân chính của tình trạng này. Nguyên nhân thứ nhất là chi phí sinh hoạt. Ở các thành phố lớn, tiền thuê nhà, thức ăn và học phí tăng nhanh, nên nhiều người lao động phải làm thêm giờ hoặc làm thêm một công việc nữa để trả các hoá đơn. Nguyên nhân thứ hai là công nghệ. Vì có điện thoại thông minh và email, nhân viên có thể bị liên lạc bất cứ lúc nào, và nhiều người tiếp tục làm việc sau khi rời văn phòng. Ví dụ, nhiều nhân viên văn phòng trả lời tin nhắn của quản lý vào tối muộn hoặc thậm chí cuối tuần." },
        { en: "[Body 2] Working such long hours has serious effects. For individuals, the biggest effect is on health. People who work too much often sleep badly and do not have time to exercise, and this can lead to stress and illness. For society, long working hours result in weaker family relationships, because parents spend less time with their children. In addition, tired workers usually make more mistakes, so companies may actually become less productive. As a result, the whole economy can suffer.", vi: "[Thân bài 2] Làm việc nhiều giờ như vậy gây ra những tác động nghiêm trọng. Với cá nhân, tác động lớn nhất là lên sức khoẻ. Người làm việc quá nhiều thường ngủ kém và không có thời gian tập thể dục, và điều này có thể dẫn đến căng thẳng và bệnh tật. Với xã hội, giờ làm dài khiến quan hệ gia đình yếu đi, vì cha mẹ dành ít thời gian hơn cho con cái. Ngoài ra, người lao động mệt mỏi thường mắc nhiều lỗi hơn, nên các công ty thực ra có thể làm việc kém hiệu quả hơn. Kết quả là cả nền kinh tế có thể bị ảnh hưởng." },
        { en: "[Conclusion] In conclusion, people work longer hours mainly because life is more expensive and technology keeps them connected to their jobs. This trend damages people's health and family life, and it can also reduce productivity. If nothing changes, these effects are likely to become even more serious in the future.", vi: "[Kết bài] Tóm lại, người ta làm việc nhiều giờ hơn chủ yếu vì cuộc sống đắt đỏ hơn và công nghệ khiến họ luôn kết nối với công việc. Xu hướng này làm hại sức khoẻ và đời sống gia đình, và cũng có thể làm giảm năng suất. Nếu không có gì thay đổi, những tác động này có lẽ sẽ còn nghiêm trọng hơn trong tương lai." },
      ],
    },
    {
      t: "table",
      caption: "Phân tích bài mẫu 2 theo 4 tiêu chí — vì sao ở khoảng 5.5–6.0, chưa lên 6.5",
      head: ["Tiêu chí", "Chỗ làm tốt", "Chỗ nên nâng cấp"],
      rows: [
        ["**Task Response**", "Đủ hai câu hỏi: 2 nguyên nhân (cost of living, technology) + kết quả cho **cả** individuals **và** society như đề yêu cầu", "Ví dụ ở Thân 2 còn chung (“tired workers make more mistakes”) — thêm một tình huống cụ thể sẽ thuyết phục hơn"],
        ["**Coherence & Cohesion**", "Câu chủ đề rõ (There are two main causes… / Working such long hours has serious effects); “For individuals… For society…” chia ý gọn", "As a result / In addition dùng đúng nhưng còn đơn điệu; kết bài câu 3 là dự đoán — được, miễn không thêm lý do mới"],
        ["**Lexical Resource**", "cost of living, do overtime, take a second job, be contacted at any time, productive, the whole economy", "Một số từ lặp (cause ×3, effect ×4); có thể dùng reason, factor, consequence, impact"],
        ["**Grammar (GRA)**", "because of + N, so + mệnh đề, bị động (can be contacted), mệnh đề quan hệ (People who work too much), lead to / result in đúng", "Câu điều kiện ở kết bài đúng; nhìn chung còn ít cấu trúc phức tạp và chưa có câu phân từ / đảo ngữ → giữ ở 5.5–6.0, chưa lên 6.5"],
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Một đoạn band 4.5 và cùng đoạn đó ở band 5.5" },
    {
      t: "sodo",
      kind: "compare",
      title: "Thân bài 1 của đề overtourism — trước và sau khi sửa",
      caption: "Ý giống nhau; khác nhau ở câu chủ đề, lớp giải thích, ví dụ, từ nối và ngữ pháp. Đây chính là khoảng cách giữa band 4.5 và 5.5.",
      cols: [
        {
          title: "Band ~4.5",
          anh: "cross-mark",
          items: [
            "“The problem is tourist is too many. The house is expensive because the owner rent for tourist. People cannot live. Also the street is crowded in summer. It is very bad for people.”",
            "Không có câu chủ đề nói đoạn bàn gì",
            "Ý không được giải thích (vì sao giá tăng?), không ví dụ",
            "Lỗi số ít / số nhiều, chia động từ: ~~tourist is~~, ~~the owner rent~~",
          ],
        },
        {
          title: "Band ~5.5",
          anh: "check-mark-button",
          items: [
            "“The main problem is that ordinary people find it harder to live in their own city. Firstly, many owners prefer to rent their flats to tourists. **As a result**, there are fewer homes for local families…”",
            "Câu chủ đề rõ → 2 ý có thứ tự (Firstly / Secondly)",
            "Mỗi ý có giải thích (As a result…) + ví dụ (Barcelona)",
            "Động từ đúng số; câu phức đúng (because, where they grew up)",
          ],
        },
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Lập dàn ý 5 phút rồi viết trọn bài" },
    {
      t: "sodo",
      kind: "flow",
      title: "40 phút cho Task 2 dạng vấn đề – giải pháp",
      caption: "Dàn ý chỉ ghi từ khoá. Chưa tìm được giải pháp khớp vấn đề thì đừng bắt đầu viết.",
      steps: [
        { label: "Phút 0–2", sub: "Gạch từ hỏi → xác định kiểu A / B / C / D" },
        { label: "Phút 2–5", sub: "Ghi 2 ý cho Thân 1, 2 ý cho Thân 2 — nối mũi tên ý ↔ giải pháp" },
        { label: "Phút 5–35", sub: "Viết 4 đoạn (mở 3′ · thân 12′ + 12′ · kết 3′)" },
        { label: "Phút 35–40", sub: "Soát: hai câu hỏi đủ chưa? -s, will trong If, because / because of, đếm ~260 từ" },
      ],
    },
    {
      t: "essay",
      id: "t2d14-viet-bai",
      task: "Task 2",
      prompt: "Many children today do not get enough physical exercise. Why is this happening, and what can be done to solve this problem? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Kiểu **B** (nguyên nhân + giải pháp): Thân 1 = 2 nguyên nhân (vd. thời gian dùng màn hình, áp lực học thêm / thiếu sân chơi); Thân 2 = 2 giải pháp **khớp** từng nguyên nhân.",
        "Mở bài: paraphrase (do not get enough physical exercise → **are not physically active enough**) + “This essay will examine the main reasons for this and suggest some solutions.”",
        "Nguyên nhân: **because / because of · lead to · As a result,**. Giải pháp: **should + V · One solution would be to + V · If + hiện tại, … will …**.",
        "Mỗi ý có **giải thích + ví dụ** (một trường, một con số, một thành phố). Không viết giải pháp cực đoan (~~ban all phones~~).",
        "Kết bài 2 câu, không thêm ý mới. Soát lỗi: children **are / do** (số nhiều), không có will sau If, đếm 260–290 từ.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D14_HOMEWORK: Lesson = {
  id: "t2d14-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 14",
  goal: "Ôn trọn Ngày 14: dùng đúng dạng họ từ AWL và từ du lịch, collocation, dịch câu nguyên nhân – kết quả – giải pháp, làm Sentence completion trên đoạn đọc mới, nhận diện kiểu đề và ghép giải pháp với vấn đề, rồi viết một đoạn thân bài giải pháp.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (40 câu + 1 đoạn viết)",
      items: [
        "**I. Họ từ AWL** (10 chỗ trống) · **II. Từ du lịch** (6 chỗ trống) · **III. Collocation & cụm động từ** (6 câu chọn).",
        "**IV. Dịch Việt → Anh** (6 câu, có 💡): nguyên nhân – kết quả, giải pháp, từ vựng hôm nay; một câu ôn Tập 1.",
        "**V. Sentence completion** (4 câu) trên một đoạn đọc mới về du lịch cộng đồng.",
        "**VI. Kiểu đề** (4 câu) · **VII. Ghép giải pháp với vấn đề** (4 câu).",
        "**VIII. Viết** một đoạn thân bài nêu **hai giải pháp** (~100 từ) — AI chấm.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 14 trước khi làm bài",
      caption: "Mỗi nhánh là điều dễ quên nhất của từng bài hôm nay.",
      center: "**Ngày 14**",
      branches: [
        { label: "Từ vựng", items: ["đổi dạng: perceive → perception", "trọng âm dời: STRA-tegy → stra-TE-gic", "accommodation không đếm được", "participate IN · relevant TO"], anh: "books" },
        { label: "Sentence completion", items: ["đọc giới hạn từ trước", "a / the có sẵn → đừng chép lại", "số ít / số nhiều theo động từ", "chép đúng chữ trong bài"], anh: "open-book" },
        { label: "Problem / Solution", items: ["2 câu hỏi = 2 thân bài", "giải pháp khớp vấn đề", "because + S + V / because of + N", "If + hiện tại, … will"], anh: "memo" },
      ],
    },

    /* I */
    { t: "h", text: "I. Họ từ AWL — điền đúng dạng (10 câu)" },
    {
      t: "quiz",
      id: "t2d14-bt-ho-tu",
      title: "I. Điền đúng dạng của từ trong ngoặc (10 câu)",
      kind: "fill",
      items: [
        { q: "___ dishes such as pho are very popular with foreign tourists. (tradition → tính từ)", answers: ["Traditional"], hint: "tradition + -al" },
        { q: "A good tour guide is ___ and notices when visitors are tired. (perceive → tính từ, “tinh ý”)", answers: ["perceptive"], hint: "perceive → percep-…" },
        { q: "Student ___ in sports clubs has fallen this year. (participate → danh từ “sự tham gia”)", answers: ["participation"], hint: "-tion" },
        { q: "The new rules are too ___ — small hotels cannot follow them. (restrict → tính từ)", answers: ["restrictive"], hint: "-ive" },
        { q: "Some details in your essay are ___ and should be removed. (relevant → nghĩa ngược lại)", answers: ["irrelevant"], hint: "tiền tố ir-" },
        { q: "She worked as a ___ for a travel magazine for ten years. (journal → người)", answers: ["journalist"], hint: "-ist" },
        { q: "The ___ of old temples costs the city a lot of money. (maintain → danh từ)", answers: ["maintenance"], hint: "chú ý: -ten-ance" },
        { q: "The hotel is ___ located between the airport and the old town. (strategy → trạng từ)", answers: ["strategically"], hint: "strategic + -ally" },
        { q: "Flights leave from a small ___ airport an hour away. (region → tính từ)", answers: ["regional"], hint: "-al" },
        { q: "___, the island could only be reached by boat. (previous → trạng từ)", answers: ["Previously"], hint: "+ -ly" },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án I",
      items: [
        "**Traditional** — đứng trước danh từ dishes → tính từ. **perceptive** — sau **is** và nối với **and notices** → tính từ chỉ tính cách (tinh ý). Đừng nhầm với perception (danh từ).",
        "**participation** — sau Student (danh từ đứng trước để bổ nghĩa) cần **danh từ chỉ sự việc**, động từ **has** số ít → không phải participants (người, số nhiều). **restrictive** — sau **too** cần tính từ.",
        "**irrelevant** — relevant có tiền tố phủ định **ir-** (không phải ~~unrelevant~~). **journalist** — người làm báo (journal + -ist), số ít vì có **a**.",
        "**maintenance** — sau **The** cần danh từ; chính tả đổi **ai → e** (maint**e**nance). **strategically** — bổ nghĩa cho phân từ located → trạng từ.",
        "**regional** — đứng giữa **a small** và **airport** → tính từ. **Previously** — đứng đầu câu, có dấu phẩy, bổ nghĩa cả câu → trạng từ (= In the past).",
      ],
    },

    /* II */
    { t: "h", text: "II. Từ du lịch (6 câu)" },
    {
      t: "quiz",
      id: "t2d14-bt-du-lich",
      title: "II. Điền một từ theo nghĩa tiếng Việt (6 câu)",
      kind: "fill",
      items: [
        { q: "We stayed in a seaside ___ for two weeks. (khu nghỉ dưỡng)", answers: ["resort"], hint: "Ngày 14 · Đọc" },
        { q: "Our ___ was too busy: five cities in six days. (lịch trình)", answers: ["itinerary"], hint: "i-TI-ne-ra-ry" },
        { q: "I always buy a small ___ for my mum when I travel. (quà lưu niệm)", answers: ["souvenir"], hint: "nhấn âm cuối" },
        { q: "Many visitors come for the local ___, especially the street food. (ẩm thực)", answers: ["cuisine"], hint: "/kwɪˈziːn/" },
        { q: "The old town suffers from ___ every summer: too many visitors, too few homes for residents. (quá tải du lịch)", answers: ["overtourism", "over-tourism"], hint: "over + tourism" },
        { q: "Citizens of some countries need a ___ to enter Vietnam. (thị thực)", answers: ["visa"], hint: "khác passport" },
      ],
    },

    /* III */
    { t: "h", text: "III. Collocation & cụm động từ (6 câu)" },
    {
      t: "mcq",
      id: "t2d14-bt-colloc",
      title: "III. Chọn từ / cụm đúng (6 câu)",
      items: [
        { q: "To protect residents' sleep, the council plans to ___ restrictions on noisy bars after midnight.", options: ["lift", "impose", "do"], correct: 1, why: "Mục đích là **bảo vệ giấc ngủ** → **áp đặt** hạn chế: **impose restrictions on**. lift = dỡ bỏ (ngược mục đích); ~~do restrictions~~ không có." },
        { q: "We ___ for the airport at 4 a.m. to catch the early flight.", options: ["set off", "checked out", "saw off"], correct: 0, why: "**set off for** + nơi = lên đường đến. see off cần người làm tân ngữ (see **sb** off = tiễn ai); check out = trả phòng." },
        { q: "Living abroad for a year really helped me ___ my horizons.", options: ["broaden", "raise", "lift"], correct: 0, why: "Thành ngữ cố định: **broaden one's horizons** (mở mang tầm hiểu biết). raise / lift không đi với horizons." },
        { q: "Large numbers of tourists put pressure ___ local water supplies.", options: ["to", "at", "on"], correct: 2, why: "**put pressure ON** sth. Lỗi hay gặp: ~~put pressure to~~ (dịch “gây áp lực **cho**”)." },
        { q: "My grandparents came to the airport to ___.", options: ["see off me", "see me off", "check me in"], correct: 1, why: "Tân ngữ là **đại từ** (me) thì đứng **giữa** cụm động từ: **see me off**. ~~see off me~~ sai; check me in là làm thủ tục, không phải tiễn." },
        { q: "The national park attracts a wide ___ of visitors, from students to retired people.", options: ["item", "region", "range"], correct: 2, why: "**a wide range of** + N số nhiều = nhiều loại khác nhau. region là vùng; item là một món." },
      ],
    },

    /* IV */
    { t: "h", text: "IV. Dịch Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t2d14-bt-dich",
      title: "IV. Dịch sang tiếng Anh (6 câu)",
      kind: "translate",
      grammar: "N + leads to / results in + N · If + S + V (hiện tại), S + will + V · because of + N · to + V (mục đích) · a wide range of + N",
      items: [
        { q: "Du lịch đại chúng có thể dẫn đến giá nhà cao hơn.", hint: "Mass tourism, can lead to / can result in, higher house prices", answers: ["Mass tourism can lead to higher house prices.", "Mass tourism can result in higher house prices.", "Mass tourism can lead to higher housing prices.", "Mass tourism can result in higher housing prices.", "Mass tourism can lead to higher prices for housing.", "Mass tourism can lead to higher property prices.", "Mass tourism may lead to higher house prices.", "Mass tourism can result in higher property prices.", "Mass tourism can lead to higher home prices.", "Mass tourism could lead to higher house prices."] },
        { q: "Nếu thành phố giới hạn số tàu du lịch, nước ở cảng sẽ sạch hơn.", hint: "If the city limits / restricts, the number of cruise ships, the water in the harbour, will be cleaner", answers: ["If the city limits the number of cruise ships, the water in the harbour will be cleaner.", "If the city restricts the number of cruise ships, the water in the harbour will be cleaner.", "If the city limits the number of cruise ships, the water in the port will be cleaner.", "If the city restricts the number of cruise ships, the water in the port will be cleaner.", "If the city limits the number of cruise ships, the harbour water will be cleaner.", "If the city limits the number of cruise ships, the water in the harbor will be cleaner.", "The water in the harbour will be cleaner if the city limits the number of cruise ships.", "If the city restricts the number of cruise ships, the water in the harbor will be cleaner.", "If the city limits the number of cruise ships, the water at the port will be cleaner.", "If the city limits the number of cruise ships, the port water will be cleaner.", "If the city limits the number of cruise ships, the water in the harbour will become cleaner.", "The water in the harbour will be cleaner if the city restricts the number of cruise ships.", "The water in the port will be cleaner if the city limits the number of cruise ships."] },
        { q: "Vì có điện thoại thông minh, nhân viên có thể bị liên lạc bất cứ lúc nào.", hint: "Because of smartphones, employees, can be contacted (bị động), at any time", answers: ["Because of smartphones, employees can be contacted at any time.", "Because of smartphones, employees can be contacted anytime.", "Because of smartphones, workers can be contacted at any time.", "Because of smartphones, staff can be contacted at any time.", "Thanks to smartphones, employees can be contacted at any time.", "Employees can be contacted at any time because of smartphones.", "Because of smart phones, employees can be contacted at any time."] },
        { q: "Nhiều người trẻ đi du lịch để mở mang tầm hiểu biết.", hint: "Many young people, travel, to broaden their horizons", answers: ["Many young people travel to broaden their horizons.", "Many young people travel in order to broaden their horizons.", "Lots of young people travel to broaden their horizons.", "A lot of young people travel to broaden their horizons.", "Many young people travel to widen their horizons."] },
        { q: "Khách sạn này có rất nhiều loại hoạt động cho trẻ em.", hint: "This hotel, offers / provides, a wide range of activities, for children", answers: ["This hotel offers a wide range of activities for children.", "This hotel provides a wide range of activities for children.", "This hotel has a wide range of activities for children.", "This hotel offers a wide range of activities for kids.", "This hotel offers a wide variety of activities for children."] },
        { q: "(ôn Tập 1) Chúng tôi đã lên đường lúc năm giờ sáng để tránh giờ cao điểm.", hint: "set off (quá khứ: set off), at five in the morning / at 5 a.m., to avoid, the rush hour", answers: ["We set off at five in the morning to avoid the rush hour.", "We set off at 5 a.m. to avoid the rush hour.", "We set off at 5 am to avoid the rush hour.", "We set off at five a.m. to avoid the rush hour.", "We set off at five in the morning to avoid rush hour.", "We set off at 5 a.m. to avoid rush hour.", "We set off at five in the morning in order to avoid the rush hour.", "We set off at 5 in the morning to avoid the rush hour."] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án IV",
      items: [
        "(1) **lead to + cụm danh từ**: higher house prices — không viết ~~lead to increase prices~~. (2) Câu điều kiện loại 1: **If + hiện tại (limits — chủ ngữ the city số ít, thêm -s), … will be cleaner**; không có will sau If.",
        "(3) **because of + danh từ** (smartphones); “bị liên lạc” → **bị động với modal**: can **be contacted**. (4) **to + V** chỉ mục đích (= in order to); broaden **their** horizons — đổi one's theo chủ ngữ.",
        "(5) **a wide range of** + danh từ số nhiều. (6) **set off** quá khứ vẫn là set off (set – set – set); **the rush hour** đã học ở Tập 1 Ngày 7 (Remote Work 2).",
      ],
    },

    /* V */
    { t: "h", text: "V. Sentence completion — đoạn đọc mới (4 câu)" },
    {
      t: "passage",
      title: "The Village That Invited Visitors",
      intro: "Đoạn đọc 3 đoạn A–C (~170 từ). Làm câu 1–4 bên dưới trong 6 phút.",
      paras: [
        { label: "A", text: "Fifteen years ago, the mountain village of Doran had almost no visitors. Most young people left to find work in the cities, and the village school was close to shutting down. Then a group of residents decided to try a new idea: they would invite small groups of tourists to stay in their homes." },
        { label: "B", text: "The project had strict rules from the beginning. No more than forty visitors could stay in the village at the same time, and every guest had to be accompanied by a local guide. All the money from accommodation went directly to the families, while ten per cent of the income from guided walks was used to repair the village roads." },
        { label: "C", text: "Today, Doran receives about 3,000 visitors a year. Several young people have returned to work as guides, and the school now has more pupils than it had a decade ago. However, some older residents worry that their traditions are changing too fast, because many young people now spend more time with tourists than with their own families." },
      ],
    },
    {
      t: "quiz",
      id: "t2d14-bt-doc",
      title: "V. Complete the sentences. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage.",
      kind: "fill",
      items: [
        { q: "(1) Before the project began, the village ______ was in danger of closing.", answers: ["school"] },
        { q: "(2) Every tourist had to walk around with a ______.", answers: ["local guide", "guide"] },
        { q: "(3) Families received all the money that visitors paid for ______.", answers: ["accommodation"] },
        { q: "(4) Doran now welcomes around ______ visitors every year.", answers: ["3,000", "3000", "3 000"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án V",
      items: [
        "(1) **school** — đoạn A: “the village school was **close to shutting down**” = in danger of closing. Chỗ trống đứng sau **village** → chỉ cần một danh từ.",
        "(2) **local guide** — đoạn B: “every guest had to be **accompanied by** a local guide”. walk around with = accompanied by. Câu có sẵn **a** → không chép lại.",
        "(3) **accommodation** — đoạn B: “All the money from **accommodation** went directly to the families”. Bẫy: “guided walks” là khoản thu **khác** (chỉ 10 % cho đường làng). Chú ý chính tả 2 c, 2 m.",
        "(4) **3,000** — đoạn C: “receives **about 3,000** visitors a year” (around = about). Chỉ viết con số, không viết ~~about 3,000~~.",
      ],
    },

    /* VI */
    { t: "h", text: "VI. Nhận diện kiểu đề (4 câu)" },
    {
      t: "mcq",
      id: "t2d14-bt-kieu-de",
      title: "VI. Đề này thuộc kiểu nào? (4 câu)",
      items: [
        { q: "Many people in big cities feel lonely. What are the causes of this, and what effects does it have on society?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 2, why: "**causes** + **effects** → kiểu C. Không viết đoạn giải pháp." },
        { q: "Obesity among teenagers is increasing. What measures can be taken to deal with this problem?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 3, why: "Vấn đề cho sẵn, chỉ một câu hỏi về **measures** → kiểu D: hai thân bài là hai biện pháp." },
        { q: "Tourism is damaging coral reefs in many countries. What problems does this cause, and how can they be solved?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 0, why: "**problems** + **how can they be solved** → kiểu A." },
        { q: "Fewer young people want to become teachers. Why is this the case, and what can be done to change it?", options: ["A. Vấn đề + giải pháp", "B. Nguyên nhân + giải pháp", "C. Nguyên nhân + kết quả", "D. Chỉ hỏi biện pháp"], correct: 1, why: "**Why** = nguyên nhân; **what can be done** = giải pháp → kiểu B." },
      ],
    },

    /* VII */
    { t: "h", text: "VII. Ghép giải pháp với vấn đề (4 câu)" },
    {
      t: "mcq",
      id: "t2d14-bt-ghep",
      title: "VII. Giải pháp nào KHỚP vấn đề / nguyên nhân? (4 câu)",
      items: [
        { q: "Problem: Tourists leave rubbish on mountain paths.", options: ["Mountain hotels should lower their prices.", "Visitors should be asked to take their rubbish home, and rangers should fine those who do not.", "More roads should be built to the mountains."], correct: 1, why: "Rác trên đường mòn → yêu cầu **mang rác về** + **phạt**. A không liên quan; C còn đưa thêm khách lên núi (làm vấn đề nặng hơn)." },
        { q: "Cause: Public transport in the city is slow and unreliable, so people drive to work.", options: ["The city should invest in faster and more frequent buses and trains.", "Drivers should buy bigger cars.", "Petrol stations should stay open 24 hours."], correct: 0, why: "Nguyên nhân là **giao thông công cộng kém** → giải pháp **cải thiện giao thông công cộng**. B và C khuyến khích lái xe nhiều hơn." },
        { q: "Problem: Small local shops in the old town are being replaced by souvenir stalls.", options: ["Tourists should be banned from the old town.", "Souvenir stalls should be allowed on every street.", "The council should offer lower rents to traditional shops that serve residents."], correct: 2, why: "Cửa hàng địa phương bị thay vì **tiền thuê / lợi nhuận** → **giảm tiền thuê cho cửa hàng truyền thống**. A cực đoan; B làm vấn đề nặng hơn." },
        { q: "Effect: Tired employees make more mistakes at work.", options: ["Workers should drink more coffee.", "Companies should limit overtime and stop sending work emails late in the evening.", "Companies should hire fewer people."], correct: 1, why: "Mệt vì **làm quá giờ, bị liên lạc buổi tối** → **giới hạn làm thêm + không gửi email muộn**. A chỉ chữa triệu chứng; C khiến mỗi người làm nhiều hơn." },
      ],
    },

    /* VIII */
    { t: "h", text: "VIII. Viết một đoạn thân bài giải pháp (~100 từ)" },
    {
      t: "essay",
      id: "t2d14-bt-viet",
      task: "Task 2",
      prompt: "Viết MỘT đoạn thân bài (90–110 từ) nêu HAI giải pháp cho đề sau: “Many popular beaches are polluted by plastic waste left by tourists. What can be done to solve this problem?” — Không cần mở bài / kết bài.",
      minWords: 90,
      tips: [
        "Câu chủ đề: **There are several ways to tackle this problem.** / **Two measures could make a real difference.**",
        "Giải pháp 1 (ai + làm gì): **Local authorities should** provide more bins and **fine** people who drop litter. Thêm câu kết quả: **If** tourists know they can be fined, they **will** …",
        "Giải pháp 2: **Another solution would be to** reduce plastic at the source — e.g. hotels and beach cafés stop selling single-use bottles.",
        "Ví dụ ngắn (**For example, …**) cho một giải pháp. Dùng ít nhất 2 từ hôm nay: **regulate · restrict · resident · put pressure on · destination**.",
        "Soát: không will sau If; should + V nguyên mẫu; 90–110 từ.",
      ],
    },
  ],
};

export const NGAY_14: Lesson[] = [T2D14_VOCAB, T2D14_READING, T2D14_WRITING, T2D14_HOMEWORK];
