/**
 * IELTS Tập 5 — Ngày 16 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, kịch bản nghe, câu bài tập VIẾT MỚI)
 * 🖥️ NGÀY LÀM ĐỀ 10 (band 7.5): Writing + Listening làm ở Online Test (`/language/en/ielts/thi-may`, bộ Đề 10); bài 2 và bài 3
 * của ngày CHỈ hướng dẫn chiến thuật – phân giờ – checklist trước / sau, KHÔNG chép lại đề, không lộ đề tài hay đáp án.
 *   Bài 1 (vocab)     Ôn 33 chủ đề — 300 từ (Match) [VC01–33]: 6 cụm chủ đề, mỗi chủ đề 8 từ khoá để ôn + 1 cụm band 8 bổ sung
 *                     (33 mục `vocab` mới), kỹ thuật "bắc cầu chủ đề" — nối mọi bài vocab vòng 1 / vòng 2 của Tập 1–5.
 *   Bài 2 (writing)   Advantages / disadvantages band 8 [W05] (đề: bảo tàng đưa bộ sưu tập lên mạng miễn phí — band 7 và band 8
 *                     đặt cạnh nhau) + hướng dẫn Writing Đề 10: Task 1 hai hình (bảng nhiều đơn vị + biểu đồ tròn) và Task 2 hai
 *                     câu hỏi KHÁC LOẠI, ôn bằng đề KHÁC (công viên thị trấn Halden hư cấu; không gian công cộng do tư nhân quản
 *                     lý) — nối Tập 2 Ngày 10 · Tập 3 Ngày 14 · 20 · 22 · Tập 4 Ngày 14 · Tập 5 Ngày 6 · 8 · 14 · 15.
 *   Bài 3 (listening) Listening Đề 10 — hướng dẫn làm đề + bẫy nghe band 8: con số bị đổi, phủ định kép [L15] (mục này bảng 3.5
 *                     ghi cho Ngày 15; khuôn N mod 4 buộc Ngày 15 học Nói nên dạy trọn ở đây) · khởi động tai 3 đoạn tự soạn
 *                     (Úc + Mỹ · Ireland · New Zealand + Canada + Anh) · 🔊 nhấn trong câu phủ định kép — nối Tập 5 Ngày 8 · 9.
 *   Bài tập Ngày 16   40 câu có đáp án
 * Mọi tên cơ sở, số liệu, giá tiền trong ngày này là hư cấu / tự đặt cho bài luyện. Mọi id bắt đầu `t5d16-`.
 */
import type { Lesson } from '../data';

export const NGAY_16: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d16-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Ôn 33 chủ đề — 300 từ trong một buổi (Match) + 33 cụm band 8 bổ sung",
    goal: "Đi một lượt qua cả 33 chủ đề IELTS của khoá: với mỗi chủ đề bật ra được ngay 8 từ khoá đã học và thêm một cụm band 8 mới; biết “bắc cầu” — mang từ của chủ đề này sang đề của chủ đề khác — để không đề Task 2 hay Part 3 nào làm bạn hết từ.",
    minutes: 90,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Hôm nay là **ngày làm Đề 10**. Bài 1 không dạy chủ đề mới: nó ==gọi lại== 33 chủ đề bạn đã học từ Tập 1 tới Tập 5, để từ nằm sẵn ở đầu lưỡi khi vào đề.",
          "Đẩy **Lexical Resource** (Writing Task 2 + Speaking Part 3): band 8 đòi vốn từ đủ rộng cho ==mọi đề tài==, kể cả đề lạ. Rộng không có nghĩa là biết thêm từ; là ==lấy ra kịp== từ đã biết.",
          "33 chủ đề chia **6 cụm**. Mỗi chủ đề: **8 từ khoá để ôn** (bảng) + **1 cụm bổ sung** (khối từ vựng — 33 cụm mới, tự vào Flashcards). 33 × 9 ≈ **300 từ**.",
          "Cách ôn: mở **Flashcards → Match** với bộ “Từ của khoá” từng tập, mỗi lượt 2–3 phút; sau đó làm bài luyện của từng cụm ở đây.",
          "Kỹ thuật mới: **bắc cầu chủ đề** — một đề về người già vẫn cần từ của Health, Housing, Technology. Mục 8 tập đúng việc này.",
          "Thời lượng: 90 phút. Nghỉ 15–20 phút rồi sang Bài 2 (Writing Đề 10).",
        ],
      },

      { t: "h", text: "1. Cách ôn 300 từ trong 90 phút" },
      {
        t: "sodo", kind: "mindmap", title: "33 chủ đề — 6 cụm", center: "33 chủ đề IELTS",
        branches: [
          { label: "① Con người & đời sống", items: ["Family", "Children & parenting", "Personality", "Ageing & migration", "Health", "Psychology"] },
          { label: "② Học & làm", items: ["Education", "Online learning", "Work", "Volunteering", "Business", "Money"] },
          { label: "③ Xã hội & nhà nước", items: ["Crime", "Government", "Social issues", "Media", "Social media"] },
          { label: "④ Thành phố & đời sống", items: ["Transport", "Housing", "Tourism", "Sport & leisure", "Food"] },
          { label: "⑤ Thiên nhiên & khoa học", items: ["Environment", "Animals", "Energy", "Science", "Technology"] },
          { label: "⑥ Văn hoá & Task 1", items: ["History", "Language", "Art", "Books", "Charts", "Maps & processes"] },
        ],
      },
      {
        t: "table",
        head: ["Bước", "Làm gì", "Thời gian"],
        rows: [
          ["1", "Đọc bảng 8 từ khoá của một cụm. Từ nào không bật ra nghĩa trong 2 giây ⇒ chấm một dấu •", "3 phút / cụm"],
          ["2", "Học khối “cụm bổ sung” của cụm đó: đọc to câu ví dụ, che nghĩa, tự nhớ lại", "5 phút / cụm"],
          ["3", "Làm bài luyện 5 câu của cụm", "3 phút / cụm"],
          ["4", "Sau cả 6 cụm: mở Flashcards → **Match**, chơi 3 lượt với bộ của tập có nhiều dấu • nhất", "10 phút"],
          ["5", "Mục 8 — bắc cầu chủ đề + bài dịch", "12 phút"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách học — đừng ôn theo kiểu đọc lại danh sách",
        items: [
          "Đọc lại danh sách cho cảm giác “biết rồi” nhưng không luyện việc ==lấy ra==. Che cột từ, nhìn tên chủ đề, tự nói 5 từ trong 10 giây — đó mới là việc bạn phải làm trong phòng thi.",
          "Bảng dưới ghi **ngày đã học** của từng chủ đề. Chủ đề nào có từ 3 dấu • trở lên ⇒ tối nay mở lại đúng bài vocab đó 10 phút.",
          "Phần lớn từ khoá trong bảng bạn đã gặp ở vòng 1 hoặc vòng 2. Gặp từ lạ: tra ngay, thêm vào thẻ của mình — bảng này là bản đồ, không phải toàn bộ lãnh thổ.",
        ],
      },

      /* ── cụm 1 ── */
      { t: "h", text: "2. Cụm ① Con người & đời sống — 6 chủ đề" },
      {
        t: "table",
        head: ["Chủ đề", "Đã học ở", "8 từ khoá phải bật ra"],
        rows: [
          ["Family & generations", "T2 N22 · T4 N8", "nuclear family · extended family · upbringing · sibling rivalry · generation gap · breadwinner · single-parent household · close-knit"],
          ["Children & parenting", "T4 N22 · T5 N20", "formative years · role model · discipline · peer pressure · screen time · childcare · overprotective · gender stereotype"],
          ["Personality & relationships", "T3 N18 · T4 N8", "conscientious · outgoing · stubborn · open-minded · reliable · get on with · fall out with · a people person"],
          ["Ageing, population & migration", "T4 N16 · T5 N8", "ageing population · birth rate · life expectancy · pension · care home · workforce · remittance · brain drain"],
          ["Health, diet & fitness", "T2 N4 · T4 N8", "sedentary lifestyle · balanced diet · obesity · preventive medicine · mental well-being · chronic disease · health insurance · antibiotic resistance"],
          ["Psychology & behaviour", "T4 N4 · T5 N14", "motivation · self-esteem · mindset · habit · resilience · bias · well-being · delayed gratification"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "blended family", pos: "n", ipa: "/ˌblendɪd ˈfæməli/", vi: "gia đình ghép (cha mẹ tái hôn, có con riêng của mỗi bên)", ex: "Children in a blended family may need time to adjust to new step-siblings.", exVi: "Trẻ trong gia đình ghép có thể cần thời gian để quen với anh chị em kế.", more: "**step-parent · step-sibling · half-brother**. Trung tính, không mang ý chê." },
          { w: "helicopter parenting", pos: "n", ipa: "/ˈhelɪkɒptə ˌpeərəntɪŋ/", vi: "kiểu nuôi con “trực thăng” (bao bọc, kiểm soát từng việc)", ex: "Helicopter parenting can leave young adults unable to cope with setbacks.", exVi: "Kiểu nuôi con bao bọc quá mức có thể khiến người trẻ không biết đối mặt thất bại.", more: "**a helicopter parent** · ngược: **hands-off parenting**. Báo chí, hợp Part 3; trong Task 2 có thể dùng **overprotective parenting**." },
          { w: "self-effacing", pos: "adj", ipa: "/ˌself ɪˈfeɪsɪŋ/", vi: "khiêm nhường, không thích nổi bật", ex: "She is brilliant but self-effacing, so her work often goes unnoticed.", exVi: "Cô ấy rất giỏi nhưng khiêm nhường, nên công sức thường không được để ý.", more: "tích cực hơn **shy**; khác **modest** ở chỗ nhấn việc tự lùi ra sau. Hợp đề Part 2 tả người." },
          { w: "net migration", pos: "n", ipa: "/ˌnet maɪˈɡreɪʃn/", vi: "di cư ròng (số người nhập cư trừ số xuất cư)", ex: "Net migration accounted for most of the city's population growth.", exVi: "Di cư ròng chiếm phần lớn mức tăng dân số của thành phố.", more: "**positive / negative net migration** · Task 1 dân số: **net migration stood at…**" },
          { w: "health literacy", pos: "n", ipa: "/ˈhelθ ˌlɪtərəsi/", vi: "hiểu biết về sức khoẻ (khả năng tìm, hiểu và dùng thông tin y tế)", ex: "Poor health literacy makes it harder for patients to follow treatment.", exVi: "Hiểu biết sức khoẻ kém khiến bệnh nhân khó tuân thủ điều trị.", more: "khuôn **X literacy**: **digital / financial / media literacy** — một khuôn, bốn chủ đề." },
          { w: "cognitive load", pos: "n", ipa: "/ˌkɒɡnətɪv ˈləʊd/", vi: "tải nhận thức (lượng thông tin bộ nhớ làm việc phải xử lý cùng lúc)", ex: "Switching between apps increases cognitive load and slows people down.", exVi: "Chuyển qua lại giữa các ứng dụng làm tăng tải nhận thức và khiến người ta chậm đi.", more: "**reduce / increase cognitive load** · dùng được ở đề học tập, công nghệ, lái xe · ôn kèm: **delayed ↔ instant gratification** (Ngày 14)." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-cum1",
        kind: "fill",
        title: "Cụm ① — điền từ / cụm đã ôn (5 câu; chữ cái đầu cho sẵn)",
        items: [
          { q: "1. An a___ population puts pressure on the pension system. (một từ)", answers: ["ageing", "aging"], hint: "ageing population" },
          { q: "2. Office workers with a s___ lifestyle are at greater risk of heart disease. (một từ)", answers: ["sedentary"], hint: "sedentary lifestyle" },
          { q: "3. Too many notifications add to a learner's cognitive l___. (một từ)", answers: ["load"], hint: "cognitive load" },
          { q: "4. Financial l___ should be taught at secondary school. (một từ)", answers: ["literacy"], hint: "financial literacy — cùng khuôn với health literacy" },
          { q: "5. Teenagers often give in to p___ pressure. (một từ)", answers: ["peer"], hint: "peer pressure" },
        ],
      },

      /* ── cụm 2 ── */
      { t: "h", text: "3. Cụm ② Học & làm — 6 chủ đề" },
      {
        t: "table",
        head: ["Chủ đề", "Đã học ở", "8 từ khoá phải bật ra"],
        rows: [
          ["Education & society", "T1 N3 · T3 N2", "curriculum · tuition fees · rote learning · critical thinking · vocational training · literacy · assessment · higher education"],
          ["Online vs traditional learning", "T1 N13 · T3 N2", "distance learning · face-to-face · blended learning · self-discipline · interaction · drop out · flexibility · digital skills"],
          ["Work & careers", "T1 N5 · N7 · T3 N14", "job security · work–life balance · minimum wage · remote working · job satisfaction · redundancy · internship · career ladder"],
          ["Volunteering & community", "T1 N9 · T4 N14", "voluntary work · charity · give back to · fundraising · civic engagement · grassroots · sense of belonging · unpaid"],
          ["Business & economy", "T3 N16 · T5 N8", "start-up · revenue · supply chain · multinational · market share · economies of scale · recession · a level playing field"],
          ["Money & consumerism", "T2 N16 · T4 N14", "disposable income · cost of living · debt · planned obsolescence · afford · budget · impulse buying · conspicuous consumption"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "attainment gap", pos: "n", ipa: "/əˈteɪnmənt ɡæp/", vi: "khoảng cách kết quả học tập (giữa các nhóm học sinh)", ex: "The attainment gap between rich and poor pupils widens during the long holidays.", exVi: "Khoảng cách kết quả giữa học sinh giàu và nghèo nới rộng trong kỳ nghỉ dài.", more: "**narrow / close / widen the attainment gap** · **educational attainment** = trình độ học vấn đạt được." },
          { w: "self-paced", pos: "adj", ipa: "/ˌself ˈpeɪst/", vi: "tự chọn nhịp độ (học nhanh chậm tuỳ mình)", ex: "Self-paced courses suit people who work irregular hours.", exVi: "Khoá học tự chọn nhịp độ hợp với người làm giờ giấc thất thường.", more: "**a self-paced course / module** · ngược: **instructor-led**. Rủi ro đi kèm: **low completion rates**." },
          { w: "portfolio career", pos: "n", ipa: "/pɔːtˈfəʊliəʊ kəˌrɪə/", vi: "sự nghiệp “đa danh mục” (làm song song vài việc thay vì một nghề cố định)", ex: "Many graduates now expect a portfolio career rather than a job for life.", exVi: "Nhiều sinh viên tốt nghiệp nay hình dung một sự nghiệp gồm nhiều việc song song thay vì một việc suốt đời.", more: "đối: **a job for life** · liên quan: **the gig economy** (Ngày 8), **freelance**." },
          { w: "social capital", pos: "n", ipa: "/ˌsəʊʃl ˈkæpɪtl/", vi: "vốn xã hội (mạng quan hệ và lòng tin trong cộng đồng)", ex: "Volunteering builds social capital in neighbourhoods where people rarely meet.", exVi: "Hoạt động tình nguyện tạo vốn xã hội ở những khu phố mà người ta hiếm khi gặp nhau.", more: "**build / erode social capital** · dùng được ở đề cộng đồng, thành phố, mạng xã hội." },
          { w: "barriers to entry", pos: "n pl", ipa: "/ˌbæriəz tu ˈentri/", vi: "rào cản gia nhập thị trường", ex: "High start-up costs act as barriers to entry and protect established firms.", exVi: "Chi phí khởi nghiệp cao là rào cản gia nhập thị trường và che chắn cho các hãng đã có chỗ đứng.", more: "**lower / raise barriers to entry** · ôn kèm: **a level playing field** (sân chơi bình đẳng — Ngày 14), **monopoly**." },
          { w: "buy now, pay later", pos: "phr", ipa: "/ˌbaɪ naʊ ˌpeɪ ˈleɪtə/", vi: "mua trước trả sau", ex: "Buy now, pay later schemes make it easy for young shoppers to slide into debt.", exVi: "Các chương trình mua trước trả sau khiến người mua trẻ dễ trượt vào nợ nần.", more: "**a buy-now-pay-later scheme** · ôn kèm: **conspicuous consumption** (tiêu dùng phô trương — Tập 4 Ngày 14), **impulse buying**." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-cum2",
        kind: "fill",
        title: "Cụm ② — điền từ / cụm (5 câu)",
        items: [
          { q: "1. Free school meals are one way to narrow the attainment g___. (một từ)", answers: ["gap"], hint: "narrow the attainment gap" },
          { q: "2. Flexible hours improve employees' work–life b___. (một từ)", answers: ["balance"], hint: "work–life balance" },
          { q: "3. Exams that reward r___ learning do little to develop critical thinking. (một từ)", answers: ["rote"], hint: "rote learning" },
          { q: "4. Households with little d___ income cut back on leisure first. (một từ)", answers: ["disposable"], hint: "disposable income" },
          { q: "5. High start-up costs act as b___ to entry. (một từ, số nhiều)", answers: ["barriers"], hint: "barriers to entry" },
        ],
      },

      /* ── cụm 3 ── */
      { t: "h", text: "4. Cụm ③ Xã hội & nhà nước — 5 chủ đề" },
      {
        t: "table",
        head: ["Chủ đề", "Đã học ở", "8 từ khoá phải bật ra"],
        rows: [
          ["Crime & punishment", "T3 N4 · T5 N8", "offender · deterrent · rehabilitation · reoffend · custodial sentence · community service · mitigating circumstances · miscarriage of justice"],
          ["Government & public spending", "T3 N6 · T5 N2", "taxpayer · subsidy · public sector · legislation · accountability · red tape · means-tested · allocate funds"],
          ["Social issues & equality", "T4 N16 · T5 N22", "inequality · discrimination · marginalised · poverty line · social mobility · minority · safety net · homelessness"],
          ["Media, news & advertising", "T2 N18 · T4 N26", "coverage · bias · tabloid · press freedom · target audience · misleading · censorship · breaking news"],
          ["Social media & communication", "T1 N1 · T3 N18", "digital footprint · go viral · privacy settings · cyberbullying · echo chamber · influencer · screen addiction · stay in touch"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "electronic tagging", pos: "n", ipa: "/ɪlekˌtrɒnɪk ˈtæɡɪŋ/", vi: "giám sát bằng vòng điện tử (thay cho giam giữ)", ex: "Electronic tagging allows low-risk offenders to serve their sentence at home.", exVi: "Vòng giám sát điện tử cho phép người phạm tội ít nguy hiểm thi hành án tại nhà.", more: "**be tagged** · **an alternative to custody** · **curfew** (giờ giới nghiêm) · ôn kèm: **mitigating circumstances** (tình tiết giảm nhẹ — Ngày 8)." },
          { w: "public–private partnership", pos: "n", ipa: "/ˌpʌblɪk ˌpraɪvət ˈpɑːtnəʃɪp/", vi: "hợp tác công – tư", ex: "The new hospital was built through a public–private partnership.", exVi: "Bệnh viện mới được xây theo hình thức hợp tác công – tư.", more: "viết tắt **PPP** · lập luận hai mặt: chia rủi ro với tư nhân nhưng nhà nước bớt quyền kiểm soát · ôn kèm: **means-tested ↔ universal** (Ngày 2)." },
          { w: "postcode lottery", pos: "n", ipa: "/ˈpəʊstkəʊd ˌlɒtəri/", vi: "“xổ số mã bưu điện” — dịch vụ công tốt hay kém tuỳ nơi bạn sống", ex: "Access to specialist care has become a postcode lottery.", exVi: "Việc được khám chuyên khoa hay không nay tuỳ vào chỗ bạn sống.", more: "tiếng Anh–Anh, giọng báo chí; trong Task 2 có thể viết **provision varies widely from one area to another** · ôn kèm: **safety net** (lưới an sinh — Ngày 2)." },
          { w: "editorial independence", pos: "n", ipa: "/edɪˌtɔːriəl ˌɪndɪˈpendəns/", vi: "sự độc lập biên tập (toà soạn tự quyết nội dung)", ex: "Public broadcasters must be funded in a way that protects their editorial independence.", exVi: "Đài công phải được cấp kinh phí theo cách bảo vệ sự độc lập biên tập.", more: "**compromise / safeguard editorial independence** · liên quan: **vested interests** (nhóm lợi ích)." },
          { w: "content moderation", pos: "n", ipa: "/ˈkɒntent ˌmɒdəˌreɪʃn/", vi: "kiểm duyệt nội dung (trên nền tảng mạng)", ex: "Platforms spend heavily on content moderation, yet harmful posts still slip through.", exVi: "Các nền tảng chi mạnh cho kiểm duyệt nội dung, vậy mà bài đăng độc hại vẫn lọt.", more: "**a content moderator** · khác **censorship** (kiểm duyệt của nhà nước, sắc thái tiêu cực)." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-cum3",
        kind: "fill",
        title: "Cụm ③ — điền từ / cụm (5 câu)",
        items: [
          { q: "1. Prison is meant to act as a d___ as well as a punishment. (một từ)", answers: ["deterrent"], hint: "act as a deterrent" },
          { q: "2. Small businesses complain about the amount of red t___ involved. (một từ)", answers: ["tape"], hint: "red tape" },
          { q: "3. Whether patients get the new treatment has become a postcode l___. (một từ)", answers: ["lottery"], hint: "a postcode lottery" },
          { q: "4. Recommendation algorithms can trap users in an echo c___. (một từ)", answers: ["chamber"], hint: "echo chamber" },
          { q: "5. Education is still the most reliable route to social m___. (một từ)", answers: ["mobility"], hint: "social mobility" },
        ],
      },

      /* ── cụm 4 ── */
      { t: "h", text: "5. Cụm ④ Thành phố & đời sống — 5 chủ đề" },
      {
        t: "table",
        head: ["Chủ đề", "Đã học ở", "8 từ khoá phải bật ra"],
        rows: [
          ["Transport & urban life", "T2 N8 · T3 N20", "congestion · commute · public transport · cycle lane · rush hour · congestion charge · infrastructure · emissions"],
          ["Housing, architecture & cities", "T2 N24 · T3 N8", "affordable housing · urban sprawl · high-rise · suburb · tenant · landlord · gentrification · amenities"],
          ["Travel, tourism & culture", "T2 N14 · T3 N26", "tourist destination · off the beaten track · heritage site · local economy · package holiday · overcrowding · ecotourism · souvenir"],
          ["Sport, leisure & entertainment", "T2 N20 · T5 N14", "team spirit · spectator · sponsorship · amateur · stamina · sportsmanship · pastime · take up"],
          ["Food & agriculture", "T2 N12 · T4 N26", "processed food · food miles · organic · additive · factory farming · food security · staple · shelf life"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "car dependency", pos: "n", ipa: "/ˈkɑː dɪˌpendənsi/", vi: "sự lệ thuộc vào ô tô", ex: "Low-density suburbs lock residents into car dependency.", exVi: "Vùng ngoại ô mật độ thấp buộc cư dân lệ thuộc vào ô tô.", more: "**reduce car dependency** · adj **car-dependent** · đối: **walkable neighbourhoods**." },
          { w: "green belt", pos: "n", ipa: "/ˈɡriːn belt/", vi: "vành đai xanh (đất quanh đô thị cấm hoặc hạn chế xây dựng)", ex: "Building on the green belt would ease the housing shortage but encourage sprawl.", exVi: "Xây trên vành đai xanh sẽ giảm thiếu nhà nhưng khuyến khích đô thị lan rộng.", more: "**protect / build on the green belt** · đối: **brownfield site** (đất công nghiệp cũ tái sử dụng)." },
          { w: "carrying capacity", pos: "n", ipa: "/ˈkæriɪŋ kəˌpæsəti/", vi: "sức chứa (lượng khách / sinh vật tối đa một nơi chịu được)", ex: "The island's carrying capacity is exceeded every summer.", exVi: "Mỗi mùa hè, lượng khách đều vượt sức chứa của hòn đảo.", more: "**exceed the carrying capacity** · dùng cho du lịch, sinh thái, giao thông." },
          { w: "spectator sport", pos: "n", ipa: "/spekˈteɪtə spɔːt/", vi: "môn thể thao để xem (nhiều khán giả)", ex: "Football is a spectator sport for millions who never kick a ball themselves.", exVi: "Bóng đá là môn để xem với hàng triệu người chẳng bao giờ tự đá.", more: "đối: **participation sport** · lập luận hay dùng: tiền đổ vào **elite sport** thay vì **grassroots sport**." },
          { w: "ultra-processed food", pos: "n", ipa: "/ˌʌltrə ˈprəʊsest fuːd/", vi: "thực phẩm siêu chế biến", ex: "Ultra-processed food is cheap, convenient and heavily advertised to children.", exVi: "Thực phẩm siêu chế biến rẻ, tiện và được quảng cáo dày đặc tới trẻ em.", more: "chính xác hơn **junk food** (khẩu ngữ — Ngày 15: register). Đi với **a diet high in…**" },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-cum4",
        kind: "fill",
        title: "Cụm ④ — điền từ / cụm (5 câu)",
        items: [
          { q: "1. Tourist numbers now exceed the town's carrying c___. (một từ)", answers: ["capacity"], hint: "carrying capacity" },
          { q: "2. Urban s___ makes public transport expensive to run. (một từ)", answers: ["sprawl"], hint: "urban sprawl" },
          { q: "3. Developers prefer greenfield land to b___ sites, which cost more to clean up. (một từ)", answers: ["brownfield"], hint: "brownfield site" },
          { q: "4. Importing fruit by air adds enormously to its food m___. (một từ)", answers: ["miles"], hint: "food miles" },
          { q: "5. A congestion c___ has cut traffic in the city centre by a fifth. (một từ)", answers: ["charge"], hint: "congestion charge" },
        ],
      },

      /* ── cụm 5 ── */
      { t: "h", text: "6. Cụm ⑤ Thiên nhiên & khoa học — 5 chủ đề" },
      {
        t: "table",
        head: ["Chủ đề", "Đã học ở", "8 từ khoá phải bật ra"],
        rows: [
          ["Environment & climate", "T2 N2 · T4 N2", "carbon footprint · greenhouse gas · deforestation · renewable · biodiversity · carbon offsetting · tipping point · sustainable"],
          ["Animals & nature", "T3 N22 · T5 N20", "endangered species · habitat loss · extinction · conservation · captivity · poaching · ecosystem · food chain"],
          ["Energy & resources", "T3 N24 · T5 N26", "fossil fuel · solar panel · wind farm · nuclear power · energy efficiency · the grid · finite resource · consumption"],
          ["Science, research & space", "T3 N10 · T5 N20", "hypothesis · replicate · peer review · funding · breakthrough · space exploration · satellite · ethical"],
          ["Technology & innovation", "T2 N6 · T4 N20", "automation · artificial intelligence · early adopter · digital divide · data privacy · obsolete · cutting-edge · user-friendly"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "carbon sink", pos: "n", ipa: "/ˈkɑːbən sɪŋk/", vi: "bể chứa carbon (rừng, đất than bùn, đại dương — hấp thụ nhiều CO₂ hơn thải ra)", ex: "Forests act as carbon sinks, absorbing more carbon than they release.", exVi: "Rừng hoạt động như bể chứa carbon, hấp thụ nhiều carbon hơn lượng thải ra.", more: "**act as a carbon sink** · đối: **carbon source** · ôn kèm: **tipping point** (điểm tới hạn — Tập 4 Ngày 2)." },
          { w: "habitat fragmentation", pos: "n", ipa: "/ˈhæbɪtæt ˌfræɡmenˌteɪʃn/", vi: "sự chia cắt sinh cảnh (rừng bị xẻ thành mảnh nhỏ)", ex: "New roads cause habitat fragmentation, isolating animal populations.", exVi: "Đường mới chia cắt sinh cảnh, cô lập các quần thể động vật.", more: "chính xác hơn **habitat loss** khi diện tích còn nhưng bị cắt rời · giải pháp: **wildlife corridor**." },
          { w: "intermittent", pos: "adj", ipa: "/ˌɪntəˈmɪtənt/", vi: "không liên tục, lúc có lúc không", ex: "Wind and solar are intermittent sources, so the grid needs storage.", exVi: "Gió và mặt trời là nguồn không liên tục, nên lưới điện cần lưu trữ.", more: "n **intermittency** · **intermittent rain / internet access / fasting** — một từ, nhiều chủ đề." },
          { w: "blue-sky research", pos: "n", ipa: "/ˌbluː skaɪ rɪˈsɜːtʃ/", vi: "nghiên cứu cơ bản thuần tuý (chưa nhắm ứng dụng nào)", ex: "Governments are often reluctant to fund blue-sky research with no obvious pay-off.", exVi: "Chính phủ thường ngại tài trợ nghiên cứu cơ bản chưa thấy lợi ích rõ.", more: "đối: **applied research** · trục lập luận của đề “nhà nước hay doanh nghiệp nên tài trợ khoa học”." },
          { w: "disruptive technology", pos: "n", ipa: "/dɪsˌrʌptɪv tekˈnɒlədʒi/", vi: "công nghệ đột phá (làm đảo lộn cả một ngành)", ex: "Streaming was a disruptive technology for the music industry.", exVi: "Phát trực tuyến là công nghệ đảo lộn ngành âm nhạc.", more: "v **disrupt** an industry · tránh lạm dụng: không phải cái gì mới cũng **disruptive**." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-cum5",
        kind: "fill",
        title: "Cụm ⑤ — điền từ / cụm (5 câu)",
        items: [
          { q: "1. Because solar power is i___, batteries are essential. (một từ)", answers: ["intermittent"], hint: "intermittent" },
          { q: "2. A finding counts for little until other laboratories can r___ it. (một từ)", answers: ["replicate", "reproduce"], hint: "replicate a finding" },
          { q: "3. The digital d___ leaves rural pupils at a disadvantage. (một từ)", answers: ["divide"], hint: "the digital divide" },
          { q: "4. Peatlands act as carbon s___, locking carbon away for centuries. (một từ, số nhiều)", answers: ["sinks"], hint: "carbon sinks" },
          { q: "5. A wildlife corridor is one answer to habitat f___. (một từ)", answers: ["fragmentation"], hint: "habitat fragmentation" },
        ],
      },

      /* ── cụm 6 ── */
      { t: "h", text: "7. Cụm ⑥ Văn hoá & ngôn ngữ Task 1 — 6 chủ đề" },
      {
        t: "table",
        head: ["Chủ đề", "Đã học ở", "8 từ khoá phải bật ra"],
        rows: [
          ["History & heritage", "T3 N12 · T5 N14", "primary source · artefact · excavation · preserve · ancestor · civilisation · heritage · commemorate"],
          ["Language & identity", "T3 N28 · T5 N26", "mother tongue · bilingual · dialect · lingua franca · endangered language · fluency · language barrier · identity"],
          ["Art, music & creativity", "T4 N10 · T5 N2", "exhibition · masterpiece · contemporary · patron · public funding · aesthetic · performing arts · accessible"],
          ["Books & reading", "T3 N28 · T5 N26", "page-turner · genre · fiction · e-reader · literacy · read between the lines · plot · bookworm"],
          ["Charts & trends (Task 1)", "T1 N11 · T2 N10 · T3 N11", "peak · plateau · fluctuate · bottom out · threefold · proportion · respectively · level off"],
          ["Maps & processes (Task 1)", "T1 N15 · T3 N17", "be converted into · be demolished · adjacent to · pedestrianised · subsequently · stage · be replaced by · extend"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "living memory", pos: "n", ipa: "/ˌlɪvɪŋ ˈmeməri/", vi: "ký ức của những người còn sống", ex: "It was the worst flood in living memory.", exVi: "Đó là trận lụt tệ nhất trong ký ức của những người còn sống.", more: "**within / in living memory** · khi nhân chứng mất dần: **pass out of living memory**." },
          { w: "code-switching", pos: "n", ipa: "/ˈkəʊd ˌswɪtʃɪŋ/", vi: "chuyển mã (đổi qua lại giữa hai ngôn ngữ / hai lối nói trong một cuộc nói chuyện)", ex: "Code-switching between Vietnamese and English is common among young professionals.", exVi: "Giới trẻ đi làm hay chuyển qua lại giữa tiếng Việt và tiếng Anh.", more: "v **code-switch** · cũng dùng cho đổi **register** (Ngày 15)." },
          { w: "cultural capital", pos: "n", ipa: "/ˌkʌltʃərəl ˈkæpɪtl/", vi: "vốn văn hoá (hiểu biết, thị hiếu, trải nghiệm văn hoá giúp một người tiến thân)", ex: "Children who are taken to museums and concerts acquire cultural capital that helps them at school.", exVi: "Trẻ được đưa đi bảo tàng và hoà nhạc tích được vốn văn hoá có ích cho việc học.", more: "**acquire / lack cultural capital** · cùng khuôn với **social capital** (cụm ②) · ôn kèm: **accessible to** (dễ tiếp cận — Ngày 2)." },
          { w: "dip into", pos: "phr v", ipa: "/ˈdɪp ɪntə/", vi: "đọc lướt từng đoạn, mở ra đọc chỗ nào hay chỗ đó", ex: "It's the kind of book you dip into rather than read from cover to cover.", exVi: "Đó là kiểu sách mở ra đọc từng đoạn chứ không đọc từ đầu tới cuối.", more: "đối: **read from cover to cover** · nghĩa khác: **dip into your savings** (tiêu lẹm vào tiền tiết kiệm)." },
          { w: "taper off", pos: "phr v", ipa: "/ˌteɪpər ˈɒf/", vi: "giảm dần rồi gần như dừng", ex: "Growth was rapid until 2015 and then tapered off.", exVi: "Tăng trưởng nhanh tới năm 2015 rồi giảm dần.", more: "khác **level off** (đi ngang sau khi tăng / giảm) và **bottom out** (chạm đáy rồi ngừng giảm)." },
          { w: "make way for", pos: "v phr", ipa: "/ˌmeɪk ˈweɪ fə/", vi: "bị dỡ bỏ / dời đi để nhường chỗ cho", ex: "The warehouses were demolished to make way for a riverside park.", exVi: "Các nhà kho bị phá để nhường chỗ cho một công viên ven sông.", more: "khung map: **X was removed to make way for Y** — gộp “mất” và “mới” vào một câu (ôn Ngày 8)." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-cum6",
        kind: "fill",
        title: "Cụm ⑥ — điền từ / cụm (5 câu)",
        items: [
          { q: "1. The car park was removed to make w___ for a new science block. (một từ)", answers: ["way"], hint: "make way for" },
          { q: "2. After rising for a decade, sales l___ off at around two million. (một từ, quá khứ)", answers: ["levelled", "leveled"], hint: "levelled off" },
          { q: "3. English serves as a lingua f___ in international business. (một từ)", answers: ["franca"], hint: "lingua franca" },
          { q: "4. It was the coldest winter in living m___. (một từ)", answers: ["memory"], hint: "in living memory" },
          { q: "5. Regular visits to galleries give children cultural c___. (một từ)", answers: ["capital"], hint: "cultural capital" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Bắc cầu chủ đề — một đề, ba kho từ" },
      {
        t: "p",
        text: "Đề thi không bao giờ thông báo “đây là chủ đề số 17”. Một đề về ==người già sống một mình== chạm tới Ageing, Health, Housing và Technology cùng lúc. Người band 7 chỉ mở một ngăn; người band 8 mở ba. Trước khi viết hay nói, tự hỏi: **đề này mượn được từ của những chủ đề nào?**",
      },
      {
        t: "table",
        head: ["Đề (tóm tắt)", "Chủ đề chính", "Bắc cầu sang", "Từ mang sang"],
        rows: [
          ["Người già sống một mình ngày càng nhiều", "Ageing", "Health · Housing · Technology", "chronic disease · amenities within walking distance · the digital divide"],
          ["Trẻ em ăn quá nhiều đồ chế biến sẵn", "Food", "Media · Children · Government", "heavily advertised to children · peer pressure · a levy on ultra-processed food"],
          ["Khách du lịch làm quá tải phố cổ", "Tourism", "Housing · Environment · Business", "carrying capacity · gentrification · the local economy"],
          ["Sinh viên tốt nghiệp không tìm được việc đúng ngành", "Work", "Education · Business · Social issues", "vocational training · a portfolio career · social mobility"],
          ["Thành phố nên đầu tư đường xe đạp hay đường ô tô", "Transport", "Health · Environment · Government", "a sedentary lifestyle · emissions · allocate funds"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Older people who live alone are doubly exposed: chronic disease makes them less mobile, while the digital divide cuts them off from services that have moved online.", vi: "Người già sống một mình chịu thiệt kép: bệnh mạn tính khiến họ khó đi lại, còn khoảng cách số tách họ khỏi các dịch vụ đã chuyển lên mạng. (Ageing + Health + Technology)" },
          { en: "Once visitor numbers exceed a district's carrying capacity, gentrification tends to follow, as flats are converted into holiday lets.", vi: "Khi lượng khách vượt sức chứa của một khu, quá trình “sang hoá” thường theo sau, vì căn hộ bị chuyển thành nhà cho thuê ngắn ngày. (Tourism + Housing)" },
          { en: "A levy on ultra-processed food would do little unless it were matched by limits on advertising aimed at children.", vi: "Một khoản thuế lên thực phẩm siêu chế biến sẽ chẳng mấy tác dụng nếu không đi kèm giới hạn quảng cáo nhắm vào trẻ em. (Food + Government + Media)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d16-bac-cau",
        title: "Bắc cầu — chọn cụm chính xác nhất cho chỗ trống (6 câu)",
        items: [
          { q: "1. (đề nhà ở) Building on the ___ would provide land for 20,000 homes but encourage further sprawl.", options: ["green belt", "safety net", "tipping point"], correct: 0, why: "green belt = vành đai xanh quanh đô thị. safety net (lưới an sinh) và tipping point (điểm tới hạn) thuộc cụm khác." },
          { q: "2. (đề học phí) A ___ grant targets help at the poorest students, whereas free tuition for all also subsidises the rich.", options: ["self-paced", "means-tested", "intermittent"], correct: 1, why: "means-tested = xét theo thu nhập — mượn từ chủ đề Government sang đề Education." },
          { q: "3. (đề mạng xã hội) Platforms are designed around ___, which is why users find it hard to put their phones down.", options: ["delayed gratification", "instant gratification", "conspicuous consumption"], correct: 1, why: "Mạng xã hội khai thác sự thoả mãn TỨC THÌ; delayed gratification là điều ngược lại. Mượn từ Psychology." },
          { q: "4. (đề thể thao) Public money goes to elite athletes while ___ sport, where most people actually take part, is neglected.", options: ["spectator", "grassroots", "blue-sky"], correct: 1, why: "grassroots sport = thể thao phong trào. spectator sport là môn để xem — ngược ý “take part”." },
          { q: "5. (đề năng lượng) Because wind is ___, a country that relies on it needs either storage or a backup source.", options: ["obsolete", "intermittent", "accessible"], correct: 1, why: "intermittent = lúc có lúc không ⇒ cần lưu trữ. obsolete = lỗi thời (sai nghĩa)." },
          { q: "6. (đề việc làm) Rather than a job for life, many young people now expect a ___.", options: ["portfolio career", "level playing field", "carrying capacity"], correct: 0, why: "portfolio career = làm song song nhiều việc, đối với a job for life." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ trong ngoặc (4 câu)",
        grammar: "collocation của 33 chủ đề",
        items: [
          { q: "Hoạt động tình nguyện tạo vốn xã hội trong cộng đồng. (social capital)", answers: ["Volunteering builds social capital in communities.", "Volunteering builds social capital in the community.", "Voluntary work builds social capital in communities.", "Voluntary work builds social capital in the community.", "Volunteering builds social capital within communities.", "Volunteering creates social capital in communities.", "Volunteering creates social capital in the community."], hint: "build social capital" },
          { q: "Lượng khách đã vượt sức chứa của hòn đảo. (carrying capacity)", answers: ["Visitor numbers have exceeded the island's carrying capacity.", "The number of visitors has exceeded the island's carrying capacity.", "Tourist numbers have exceeded the island's carrying capacity.", "The number of tourists has exceeded the island's carrying capacity.", "Visitor numbers have exceeded the carrying capacity of the island."], hint: "exceed the island's carrying capacity" },
          { q: "Nhiều lao động thời vụ lọt qua lưới an sinh. (safety net)", answers: ["Many seasonal workers fall through the safety net.", "Many temporary workers fall through the safety net.", "Many casual workers fall through the safety net.", "Many seasonal workers slip through the safety net.", "Many seasonal workers fall through the social safety net."], hint: "fall through the safety net" },
          { q: "Nhà máy cũ bị phá để nhường chỗ cho một trung tâm mua sắm. (make way for)", answers: ["The old factory was demolished to make way for a shopping centre.", "The old factory was knocked down to make way for a shopping centre.", "The old factory was demolished to make way for a shopping center.", "The old factory was pulled down to make way for a shopping centre.", "The old factory was demolished to make way for a shopping mall.", "The old factory was removed to make way for a shopping centre."], hint: "was demolished to make way for" },
        ],
      },
      {
        t: "note",
        title: "📌 Trước khi sang Bài 2",
        items: [
          "Mở **Flashcards → Match** ba lượt (10 phút). Bộ nào có nhiều dấu • nhất thì chơi bộ đó.",
          "33 cụm bổ sung hôm nay đã tự vào bộ **“Từ của khoá — Tập 5”**.",
          "Trong Task 2 của Đề 10, trước khi dàn ý hãy dành ==20 giây== tự hỏi: đề này bắc cầu sang những chủ đề nào? Viết ba tên chủ đề ra nháp.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d16-viet",
    kind: "writing",
    title: "Viết: Advantages / disadvantages band 8 + Writing Đề 10 trong 60 phút (hướng dẫn làm đề)",
    goal: "Viết bài advantages / disadvantages ở band 8: CÂN hai phía bằng tiêu chí (ai chịu, bao lâu, đảo ngược được không) thay vì đếm ý, nhận định từng lập luận đối lập, chốt bằng một câu cân rõ ràng — rồi làm trọn phần Writing của Đề 10 ở Online Test đúng 60 phút với Task 1 hai hình (bảng nhiều đơn vị + biểu đồ tròn) và Task 2 hai câu hỏi khác loại.",
    minutes: 120,
    blocks: [
      {
        t: "recap", title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Hai phần. **Phần A (45 phút)**: dạng **advantages / disadvantages** ở band 8 — vòng 4 của dạng này (Tập 2 Ngày 10 → Tập 3 Ngày 14 → Tập 4 Ngày 14 → hôm nay). **Phần B**: làm **Writing Đề 10** ở Online Test (`/language/en/ielts/thi-may`, bộ **Đề 10**, mức band 7.5).",
          "Band 7 ở dạng này: liệt kê ưu, liệt kê nhược, kết “ưu nhiều hơn”. Band 8: ==CÂN== — nói rõ cân bằng tiêu chí gì và vì sao một phía nặng hơn. Đẩy **Task Response** (lập trường phát triển trọn) và **Coherence** (mạch lập luận).",
          "Đề 10 có **Task 1 gồm hai hình: một bảng nhiều đơn vị + một biểu đồ tròn**, và **Task 2 gồm hai câu hỏi khác loại**. Nội dung đề không nằm trong bài này — bạn chỉ thấy nó khi bấm “Bắt đầu”. Ở đây ôn hai dạng bằng ==đề khác==.",
          "Hôm nay Task 2 của đề KHÔNG phải advantages / disadvantages. Phần A vẫn học trước vì kỹ năng **cân hai phía** dùng được cho mọi dạng, và vì dạng này sẽ gặp lại ở bài kiểm tra chặng Ngày 18.",
          "Nối lại: Tập 3 Ngày 20 (bảng có cột khác đơn vị), Ngày 22 (hai câu hỏi trong một đề), Tập 5 Ngày 6 (mixed charts band 8), Ngày 8 (khung giờ 60 phút), Ngày 14 (nhận dạng đề lạ), Ngày 15 (tone đo được).",
        ],
      },

      /* ── PHẦN A ── */
      { t: "h", text: "A1. Ba cách hỏi của dạng advantages / disadvantages — ôn nhanh" },
      {
        t: "table",
        head: ["Lời đề", "Đề đòi gì", "Lập trường", "Lỗi kéo xuống band 6"],
        rows: [
          ["Discuss the advantages and disadvantages.", "trình bày hai phía", "không bắt buộc; có thì đặt ở kết bài", "chỉ viết một phía"],
          ["Do the advantages outweigh the disadvantages?", "trình bày + ==CÂN==", "bắt buộc, nêu ở mở bài và giữ tới kết", "kết luận “both sides are important”"],
          ["Is this a positive or negative development?", "đánh giá chung", "bắt buộc; ba lập trường (tốt / xấu / tốt có điều kiện)", "tả hiện tượng, không đánh giá"],
        ],
      },
      {
        t: "note",
        title: "📌 Outweigh nghĩa là CÂN, không phải ĐẾM",
        items: [
          "Ba ưu điểm nhỏ không tự động nặng hơn một nhược điểm lớn. Giám khảo band 8 chờ bạn nói ==vì sao== phía này nặng hơn.",
          "Muốn cân phải có **quả cân**. Ba quả cân dùng được cho gần như mọi đề: **phạm vi** (bao nhiêu người chịu / hưởng), **thời gian** (một lần hay lặp lại), **khả năng đảo ngược** (sửa được không).",
          "Bạn được phép kết luận nhược điểm nặng hơn. Điểm không nằm ở phía bạn chọn mà ở phép cân.",
        ],
      },

      { t: "h", text: "A2. Ba quả cân — công cụ của band 8" },
      {
        t: "table",
        head: ["Quả cân", "Câu hỏi tự đặt", "Khung câu"],
        rows: [
          ["Phạm vi", "Lợi rơi vào ai, hại rơi vào ai? Bao nhiêu người?", "The benefits are spread across…, whereas the costs fall on a relatively small group."],
          ["Thời gian", "Một lần hay lặp lại? Ngắn hạn hay dài hạn?", "This is a one-off cost set against a permanent benefit."],
          ["Đảo ngược", "Nếu sai, có sửa lại được không?", "The damage, once done, cannot easily be undone."],
          ["Khắc phục", "Nhược điểm có giảm được bằng biện pháp đơn giản không?", "This drawback, though real, can largely be addressed by…"],
          ["Xác suất", "Chắc chắn xảy ra hay chỉ có thể?", "The gain is certain; the risk is merely possible."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Although + S + V (cái giá), + I would argue that + S + be outweighed by + N",
            vi: "Câu lập trường ở mở bài — nhượng bộ rồi cân.",
            examples: [
              { en: "Although the move carries real costs, I would argue that these are outweighed by what it makes possible.", vi: "Dù bước đi này có cái giá thật, tôi cho rằng những gì nó mở ra còn nặng hơn." },
            ],
          },
          {
            formula: "The first concern is + adj, but + S + V; the second is less + adj + than it sounds",
            vi: "Nhận định TỪNG lập luận đối lập thay vì bác cả gói.",
            examples: [
              { en: "The first concern is well founded, but it is a one-off cost; the second is less persuasive than it sounds.", vi: "Mối lo thứ nhất có cơ sở, nhưng đó là chi phí một lần; mối lo thứ hai kém thuyết phục hơn ta tưởng." },
            ],
          },
          {
            formula: "What tips the balance is + N / the fact that + S + V",
            vi: "Câu chỉ ra quả cân quyết định.",
            examples: [
              { en: "What tips the balance is the fact that the harm is reversible, while the benefit is not.", vi: "Điều làm cán cân nghiêng là tác hại thì đảo ngược được, còn lợi ích thì không mất đi." },
            ],
          },
          {
            formula: "Provided that + S + V, + S + be + to be welcomed / is worth the cost",
            vi: "Kết bài có điều kiện — lập trường tinh hơn “tôi đồng ý”.",
            examples: [
              { en: "Provided that funding is not taken from conservation, this is a development to be welcomed.", vi: "Miễn là kinh phí không bị lấy từ công tác bảo tồn, đây là một bước phát triển đáng hoan nghênh." },
            ],
          },
        ],
      },
      { t: "rule", formula: "outweigh = CÂN bằng quả cân (phạm vi · thời gian · đảo ngược · khắc phục · xác suất), không phải ĐẾM số ý", vi: "Mỗi bài chọn MỘT hoặc HAI quả cân, nêu tên nó ở thân bài 2 và nhắc lại ở kết bài." },

      { t: "h", text: "A3. Một đề — band 7 và band 8 đặt cạnh nhau" },
      {
        t: "p",
        text: "**Đề:** A growing number of museums and galleries are making their entire collections available online, free of charge. Do the advantages of this development outweigh the disadvantages? — Đọc bản band 7 trước, tự tìm xem nó ==cân bằng cái gì== (gợi ý: không bằng gì cả), rồi đọc bản band 8.",
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 230 từ",
        paras: [
          { text: "Nowadays, many museums and galleries put their collections on the internet so that people can see them for free. This essay will discuss the advantages and disadvantages of this trend. In my opinion, the advantages are greater." },
          { text: "There are several advantages. Firstly, online collections are convenient. People who live far from big cities cannot travel to famous museums, but now they can see the paintings and objects at home. Secondly, it is good for education. Students and teachers can use the images in their lessons without paying any money. For example, a history teacher can show pupils a real ancient coin on the screen. Thirdly, digital copies help to protect the objects, because if the original is damaged, there is still a record of it." },
          { text: "However, there are also some disadvantages. The first one is that people may stop visiting museums, because they can see everything online. As a result, museums will lose money from tickets and shops. Another disadvantage is the cost. Taking high-quality photographs of thousands of objects is very expensive, and small museums may not have enough money to do it. In addition, looking at a painting on a phone is not the same as seeing the real one." },
          { text: "In conclusion, putting collections online has both advantages and disadvantages. I believe that the advantages outweigh the disadvantages because more people can enjoy art and learn from it." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 314 từ",
        paras: [
          { text: "Museums have traditionally been able to show only a small fraction of what they own, and only to those able to reach them. The decision by a growing number of institutions to publish their entire holdings online, free of charge, removes both limits at once. Although the move carries real costs, I would argue that these are outweighed by what it makes possible." },
          { text: "The principal gain is one of reach. A student in a provincial town who will never visit a national museum can now examine its objects in greater detail than a visitor standing behind a rope. More importantly, the material being released is largely material that was never on display in the first place: most collections spend their lives in storage, and digitisation brings them into view for researchers who would otherwise not know they existed. A digital record also serves as insurance, since an object lost to fire or theft survives at least as an image." },
          { text: "The objections deserve to be taken seriously. Digitising hundreds of thousands of items is expensive, and money spent on scanners is money not spent on conservation or staff. It is also feared that people who can browse from home will no longer come through the doors, depriving museums of ticket and shop income. The first concern is well founded, but it is a one-off cost set against a permanent benefit. The second is less persuasive than it sounds: a photograph conveys neither the scale nor the texture of an original, and familiarity with an image seems as likely to prompt a visit as to replace one." },
          { text: "On balance, then, the advantages clearly prevail. The costs fall once and on the institution; the benefits recur indefinitely and fall on anyone with an internet connection. Provided that funding for digitisation is not taken from the care of the objects themselves, this is a development to be welcomed." },
        ],
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu — theo 4 tiêu chí",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["Task Response", "đủ hai phía, có lập trường; nhưng kết bài chỉ NHẮC lại một ưu điểm (more people can enjoy art) — không cân", "cân bằng hai quả cân nêu rõ: **thời gian** (one-off cost / permanent benefit) và **phạm vi** (fall on the institution / on anyone with a connection); kết có điều kiện (Provided that…)"],
          ["Coherence & Cohesion", "Firstly · Secondly · Thirdly · However · In addition — danh sách; ý “xem trên điện thoại không bằng xem thật” đặt nhầm vào đoạn nhược điểm mà không nối với lập luận nào", "mỗi đoạn một việc: lợi → phản bác + NHẬN ĐỊNH từng phản bác → cân; nối bằng tham chiếu (The first concern… The second…), không cần Firstly"],
          ["Lexical Resource", "convenient · good for education · very expensive — đúng, chung", "holdings · reach · in storage · serves as insurance · well founded · prompt a visit — chính xác; tone đo được (seems as likely to… — Ngày 15)"],
          ["Grammar", "câu đơn và câu ghép là chính; ít lỗi", "mệnh đề rút gọn (depriving museums of…), neither… nor…, as likely to A as to B, chấm phẩy nối hai vế song song (Ngày 9)"],
          ["Điểm then chốt", "ý “ảnh không bằng bản gốc” bị dùng như NHƯỢC điểm", "cùng ý đó được dùng để BÁC nỗi lo mất khách: vì ảnh không thay được bản gốc nên người ta vẫn tới"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — bốn lỗi của dạng này ở band 7",
        items: [
          "**Kết bài không cân**: “has both advantages and disadvantages” rồi chọn một phía mà không nói vì sao.",
          "**Đếm ý**: ba ưu, hai nhược ⇒ ưu thắng. Giám khảo không đếm.",
          "**Bác cả gói**: “These disadvantages are not serious.” Phải nhận định TỪNG cái: cái nào có cơ sở, cái nào không.",
          "**Lập trường đổi giữa bài**: mở bài nói ưu nặng hơn, thân bài 2 viết nhược điểm thuyết phục hơn hẳn mà không phản hồi ⇒ người đọc không biết bạn đứng đâu.",
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Khung 4 đoạn cho “Do the advantages outweigh…?” ở band 8",
        steps: [
          { label: "Mở bài (45–60 từ)", sub: "bối cảnh 1–2 câu (KHÔNG chép đề) · câu lập trường: Although + cái giá, I would argue + outweighed" },
          { label: "Thân bài 1 — phía NẶNG hơn (≈ 100 từ)", sub: "một ý chính phát triển sâu + một ý phụ; ví dụ cụ thể, không số liệu bịa" },
          { label: "Thân bài 2 — phía kia + NHẬN ĐỊNH (≈ 110 từ)", sub: "2 lập luận đối lập nêu công bằng → The first… is well founded, but… → The second is less persuasive…" },
          { label: "Kết bài (40–50 từ)", sub: "On balance + nêu tên quả cân + điều kiện (Provided that…)" },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-viet-can",
        kind: "fill",
        title: "Điền MỘT từ để hoàn thành câu cân (6 câu)",
        items: [
          { q: "1. Although the scheme is costly, its drawbacks are ___ by the benefits. (V3)", answers: ["outweighed"], hint: "be outweighed by" },
          { q: "2. This is a one-___ cost set against a permanent benefit.", answers: ["off"], hint: "a one-off cost" },
          { q: "3. What ___ the balance is the fact that the harm can be reversed.", answers: ["tips"], hint: "tip the balance" },
          { q: "4. The first objection is well ___, but the second is less persuasive than it sounds.", answers: ["founded", "grounded"], hint: "well founded = có cơ sở" },
          { q: "5. On ___, the advantages clearly prevail.", answers: ["balance"], hint: "On balance," },
          { q: "6. ___ that safeguards are in place, this is a development to be welcomed.", answers: ["Provided", "Providing"], hint: "Provided that…" },
        ],
      },
      {
        t: "essay",
        id: "t5d16-viet-adv",
        task: "Task 2",
        prompt: "In some countries, employees now have a legal ‘right to disconnect’: their employer may not contact them about work outside working hours. Do the advantages of such a law outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words. (Luyện SAU khi làm Đề 10, hoặc ngày mai — không viết hai bài Task 2 liền nhau trước đề.)",
        minWords: 250,
        tips: [
          "Chọn một hoặc hai quả cân trước khi viết: phạm vi (mọi người lao động / một số ngành trực 24 giờ), khắc phục (ngoại lệ cho ca trực), thời gian.",
          "Thân bài 2: nêu HAI lập luận đối lập một cách công bằng, rồi nhận định từng cái.",
          "Kết bài: On balance + tên quả cân + Provided that…",
          "Bắc cầu chủ đề (Bài 1): Work + Health (burnout) + Technology (always-on culture) + Government (legislation).",
        ],
      },

      /* ── PHẦN B ── */
      { t: "h", text: "B1. Writing Đề 10 trong một bảng" },
      {
        t: "table", head: ["", "Task 1", "Task 2"],
        rows: [
          ["Dạng", "**Hai hình**: một bảng (hai năm, mỗi hàng một ĐƠN VỊ khác nhau) + một biểu đồ tròn (một năm)", "**Hai câu hỏi khác loại** trong một đề: một câu hỏi nguyên nhân + một câu bắt CHỌN giữa vài đối tượng"],
          ["Thời gian", "20 phút", "40 phút"],
          ["Số từ tối thiểu", "150 (đích 180–200 — hai hình cần thêm chừng 20 từ)", "250 (đích 280–320)"],
          ["Thước đo band 8", "Overview nói được ==điều hai năm khác nhau về bản chất==, không đọc lại từng hàng; có ít nhất một phép TỰ TÍNH (tỉ lệ, số lần)", "Trả lời ĐỦ và CÂN hai câu hỏi; câu chọn đối tượng có lý do loại các lựa chọn kia"],
          ["Lỗi kéo xuống band 6.5", "so ngang các hàng khác đơn vị · chép hết số · giải thích nguyên nhân · bỏ quên biểu đồ tròn", "viết 200 từ cho câu 1, 50 từ cho câu 2 · không chọn ai cả (“everyone should…”) · lập trường chỉ xuất hiện ở kết bài"],
        ],
      },
      {
        t: "note",
        title: "📌 Luật chơi của ngày làm đề (như Ngày 8)",
        items: [
          "**Một mạch 60 phút**, không dừng đồng hồ, không tra từ, không mở bài học.",
          "**Reading** và **Speaking** của Đề 10 cũng làm ở Online Test — hôm nay nếu còn sức, hoặc sáng mai. Ngày 17 mổ Reading Đề 10, Ngày 22 mổ Speaking Đề 10: phải làm xong trước các ngày đó.",
          "Thứ tự gợi ý hôm nay: Bài 1 (từ vựng) → nghỉ → Phần A + B1–B4 của bài này → ==làm Writing Đề 10== → nghỉ 20 phút → Bài 3 mục 1–6 → ==làm Listening Đề 10==.",
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Khung giờ Writing — bản chỉnh cho Task 1 hai hình",
        steps: [
          { label: "0′–4′ · Task 1: đọc HAI hình", sub: "bảng: mũi tên ↑ ↓ cho từng hàng + 1 phép tính; tròn: 2 lát lớn nhất, 1 lát nhỏ nhất" },
          { label: "4′–17′ · viết Task 1", sub: "mở bài 1 câu (cả hai hình) · overview 2 câu · thân 1 = bảng · thân 2 = tròn" },
          { label: "17′–20′ · soát Task 1", sub: "đơn vị từng con số · thì quá khứ · giới từ (from… to… / by / of)" },
          { label: "20′–26′ · Task 2: dàn ý", sub: "gạch chân HAI dấu hỏi · mỗi câu 2 ý · câu chọn: ai + vì sao không phải người kia" },
          { label: "26′–55′ · viết Task 2", sub: "4 đoạn · hai thân bài DÀI NGANG nhau (≈ 105 từ mỗi đoạn)" },
          { label: "55′–60′ · soát Task 2", sub: "3 lượt theo sổ lỗi + lượt register (Ngày 15 mục 6)" },
        ],
      },
      { t: "rule", formula: "Task 1 hai hình: 4′ đọc + 13′ viết + 3′ soát  ·  Task 2 hai câu hỏi: 6′ dàn ý + 29′ viết + 5′ soát", vi: "Đề hai hình và hai câu hỏi đều ăn thêm một phút ở khâu ĐỌC. Lấy phút đó từ khâu viết, không lấy từ khâu soát." },

      { t: "h", text: "B2. Ôn nhanh ① — bảng nhiều đơn vị + biểu đồ tròn (bằng số liệu KHÁC đề)" },
      { t: "p", text: "Số liệu dưới đây về công viên của thị trấn **Halden** là ==hư cấu==, tự đặt cho bài luyện — không phải hình của Đề 10. Dùng nó để nạp lại quy trình: **mũi tên từng hàng → một phép tự tính → chia thân bài theo hình**." },
      {
        t: "table",
        caption: "The public park service in Halden, 2008 and 2023 (số liệu tự đặt)",
        head: ["Measure", "2008", "2023"],
        rows: [
          ["Number of public parks", "14", "17"],
          ["Total area (hectares)", "212", "228"],
          ["Full-time gardeners", "46", "21"],
          ["Annual budget (£ million)", "3.8", "2.9"],
          ["Visits per resident per year", "19", "31"],
        ],
      },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "Main reason for visiting a park in Halden, 2023 (% of residents surveyed)",
          note: "Số liệu tự đặt cho bài luyện; Halden là thị trấn hư cấu.",
          slices: [
            { label: "Exercise", value: 34 },
            { label: "Walking a dog", value: 22 },
            { label: "Children's play", value: 18 },
            { label: "Relaxing or meeting friends", value: 14 },
            { label: "Organised events", value: 7 },
            { label: "Other", value: 5 },
          ],
        },
      },
      {
        t: "table",
        caption: "Bước 1 — đọc bảng nhiều đơn vị: KHÔNG so ngang, chỉ so DỌC theo thời gian",
        head: ["Hàng", "Hướng", "Mức đổi (tự tính)", "Viết thành"],
        rows: [
          ["Số công viên", "↑", "+3", "three new parks opened, taking the total to 17"],
          ["Diện tích", "↑ nhẹ", "+16 ha (khoảng 8%)", "rose slightly, from 212 to 228 hectares"],
          ["Người làm vườn", "↓ mạnh", "46 → 21 (giảm hơn một nửa)", "more than halved"],
          ["Ngân sách", "↓", "3.8 → 2.9 (giảm gần một phần tư)", "was cut by roughly a quarter"],
          ["Lượt tới / người / năm", "↑ mạnh", "19 → 31 (tăng hơn 60%)", "up from 19 to 31"],
          ["==Phép tính nối hàng==", "", "212 ÷ 46 ≈ 4,6 ha / người; 228 ÷ 21 ≈ 10,9 ha / người", "each gardener was responsible for over twice as much land"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — ba cái sai riêng của bảng nhiều đơn vị",
        items: [
          "**So ngang**: ~~The budget (3.8) was lower than the number of parks (14).~~ Hai con số khác đơn vị không so được. (Tập 3 Ngày 20.)",
          "**Quên đơn vị**: ~~The area rose to 228.~~ → 228 **hectares**. ~~The budget fell to 2.9.~~ → **£2.9 million**.",
          "**Đọc lại bảng**: năm hàng, hai năm = mười con số. Chép cả mười là liệt kê. Band 8 nhóm lại: ==cái tăng== (công viên, diện tích, lượt tới) và ==cái giảm== (người, tiền).",
          "**Nối hai hình bằng “because”**: biểu đồ tròn nói LÝ DO tới công viên, không nói vì sao lượt tới tăng. Đừng viết ~~visits rose because more people exercised~~ — số liệu không cho phép.",
        ],
      },
      {
        t: "passage",
        title: "Overview — band 7 (ước tính)",
        paras: [
          { text: "Overall, the number of parks, the area and the visits increased, while the gardeners and the budget decreased. In the pie chart, exercise was the most popular reason." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 210 từ",
        paras: [
          { text: "The table compares five measures of the park service in the town of Halden in 2008 and 2023, while the pie chart breaks down the main reasons residents gave for visiting a park in the latter year." },
          { text: "Overall, the parks became larger and far more heavily used over the period, yet they were maintained with considerably fewer staff and less money. Physical activity of one kind or another was the dominant reason for visiting in 2023." },
          { text: "Between 2008 and 2023 three new parks opened, taking the total to 17, and the area under management rose slightly, from 212 to 228 hectares. Use grew much faster: the average resident made 31 visits a year in 2023, up from 19. Resources moved in the opposite direction. The annual budget was cut by roughly a quarter, to £2.9 million, and the number of full-time gardeners more than halved, from 46 to 21, so that each gardener was responsible for over twice as much land as before." },
          { text: "As for the reasons behind the visits in 2023, exercise was cited by just over a third of respondents (34%) and dog-walking by 22%, together accounting for more than half. Children's play made up 18% and relaxing or meeting friends 14%, whereas organised events attracted only 7%." },
        ],
      },
      {
        t: "table",
        caption: "Overview band 7 và band 8 — khác nhau ở đâu",
        head: ["", "Band 7", "Band 8"],
        rows: [
          ["Nội dung", "đọc lại hướng của từng hàng (5 hàng)", "nói ĐIỀU ĐÁNG NÓI: dùng nhiều hơn mà nguồn lực ít hơn (larger and more heavily used, yet… fewer staff and less money)"],
          ["Biểu đồ tròn", "nêu lát lớn nhất", "gộp hai lát cùng loại thành một ý (physical activity of one kind or another)"],
          ["Ngôn ngữ", "increased / decreased", "became… more heavily used · were maintained with · the dominant reason"],
          ["Thân bài", "(thường đi theo thứ tự hàng trong bảng)", "nhóm theo Ý: cái tăng → cái giảm → phép tính nối (so that each gardener…)"],
        ],
      },
      {
        t: "quiz",
        id: "t5d16-viet-bang",
        kind: "fill",
        title: "Nhìn bảng Halden — điền từ / số (6 câu)",
        items: [
          { q: "1. The number of full-time gardeners more than ___ , from 46 to 21. (một từ, quá khứ)", answers: ["halved"], hint: "more than halved" },
          { q: "2. The annual budget was cut by roughly a ___ . (một từ: phân số)", answers: ["quarter"], hint: "0,9 ÷ 3,8 ≈ 24% ⇒ a quarter" },
          { q: "3. The area under management rose ___ , from 212 to 228 hectares. (một trạng từ)", answers: ["slightly", "marginally", "modestly"], hint: "slightly / marginally" },
          { q: "4. Three new parks opened, ___ the total to 17. (V-ing)", answers: ["taking", "bringing"], hint: "taking / bringing the total to" },
          { q: "5. Exercise and dog-walking together ___ for more than half of all visits. (một từ, quá khứ)", answers: ["accounted"], hint: "accounted for" },
          { q: "6. The average resident made 31 visits a year in 2023, ___ from 19. (một từ)", answers: ["up"], hint: "up from 19" },
        ],
      },
      { t: "rule", formula: "bảng nhiều đơn vị: so DỌC (theo năm), không so NGANG (giữa các hàng)  ·  tự tính 1 tỉ lệ nối hai hàng  ·  hai hình: mỗi hình một thân bài, nối bằng As for…", vi: "Overview của hai hình = một câu cho bảng (điều đáng nói) + một câu cho biểu đồ tròn (nhóm lát lớn nhất)." },

      { t: "h", text: "B3. Ôn nhanh ② — Task 2 hai câu hỏi khác loại (bằng đề KHÁC)" },
      {
        t: "p",
        text: "**Đề luyện (không phải Đề 10):** In many cities, squares, parks and waterfronts are now owned or managed by private companies rather than by local councils. Why has this happened? Who should decide how such spaces are used: the companies, the council or local residents?",
      },
      {
        t: "table",
        head: ["Việc", "Làm thế nào", "Lỗi hay gặp"],
        rows: [
          ["Nhận dạng", "đếm dấu hỏi: HAI. Câu 1 = nguyên nhân (Why). Câu 2 = ==chọn== giữa ba đối tượng (Who should…: A, B or C?)", "tưởng là problem / solution, viết giải pháp"],
          ["Mở bài", "một câu bối cảnh + một câu trả lời NGẮN cho cả hai câu hỏi", "chỉ nhắc lại đề, lập trường đợi tới kết bài"],
          ["Thân bài 1", "2 nguyên nhân, phát triển (ngân sách công thiếu · điều kiện cấp phép xây dựng)", "liệt kê 4 nguyên nhân một dòng"],
          ["Thân bài 2", "chọn MỘT đối tượng giữ quyền quyết định cuối + nói vai của hai đối tượng kia + vì sao không phải họ", "“all three should work together” — không chọn"],
          ["Kết bài", "một câu cho mỗi câu hỏi", "thêm ý mới"],
          ["Cân đối", "hai thân bài dài ngang nhau (lệch không quá 30 từ)", "thân 1 gấp đôi thân 2"],
        ],
      },
      {
        t: "passage",
        title: "Thân bài 2 — band 7 (ước tính), 59 từ",
        paras: [
          { text: "In my opinion, the council should decide how these spaces are used. This is because the council is elected by the people, so it represents them. Companies only care about profit, so they may ban activities that do not make money. Residents should also give their ideas, for example in public meetings. Therefore, the council is the best choice." },
        ],
      },
      {
        t: "passage",
        title: "Thân bài 2 — band 8 (ước tính), 130 từ",
        paras: [
          { text: "As to who should have the final say, I would give it to the council, though not exclusively. A company that maintains a square has a legitimate interest in how it is used, but its instinct will be to exclude whatever does not pay — the busker, the protest, the teenager with a skateboard — and these are precisely the uses that make a space public. Residents, for their part, know the place best, yet they are rarely organised and seldom agree among themselves. An elected council is the only one of the three that can be voted out for getting the balance wrong. The sensible arrangement, therefore, is for the council to set the rules of access, after consulting residents, and to leave day-to-day management to the company on that condition." },
        ],
      },
      {
        t: "table",
        caption: "Band 7 và band 8 — khác nhau ở đâu",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["Task Response", "chọn council, có lý do; hai đối tượng kia mỗi bên một câu", "chọn council ==và== phân vai cho cả ba; mỗi đối tượng có điểm mạnh + giới hạn; lý do chọn là tiêu chí rõ: can be voted out"],
          ["Coherence", "This is because… so… so… Therefore", "đi theo ba đối tượng rồi tổng hợp (The sensible arrangement, therefore, is…)"],
          ["Lexical Resource", "only care about profit (tone gắt — Ngày 15)", "a legitimate interest · its instinct will be to exclude whatever does not pay · day-to-day management"],
          ["Grammar", "câu ghép bằng so", "mệnh đề quan hệ, cụm chêm giữa hai gạch ngang, the only one of the three that…, is for the council to set…"],
        ],
      },
      {
        t: "mcq",
        id: "t5d16-viet-hai-cau",
        title: "Nhận dạng đề hai câu hỏi (4 câu)",
        items: [
          { q: "1. “Fewer young people are choosing to become farmers. What are the reasons? Who should be responsible for reversing this trend: governments, food companies or consumers?” — Câu hỏi thứ hai đòi gì?", options: ["liệt kê giải pháp", "chọn (hoặc phân vai) giữa ba đối tượng và nêu lý do", "nêu ưu và nhược"], correct: 1, why: "Who should… A, B or C? ⇒ phải CHỌN / xếp hạng / phân vai. Liệt kê giải pháp chung chung là lạc sang dạng problem / solution." },
          { q: "2. Mở bài nào tốt nhất cho đề ở câu 1?", options: ["Farming is very important for every country. This essay will discuss this issue.", "Low and uncertain incomes, rather than any dislike of rural life, explain why so few young people now go into farming, and it is governments, I will argue, that are best placed to change this.", "There are many reasons and many people are responsible."], correct: 1, why: "B trả lời ngắn CẢ HAI câu hỏi ngay ở mở bài (nguyên nhân chính + đối tượng được chọn). A vạn năng; C không nói gì." },
          { q: "3. Thân bài 1 dài 170 từ, thân bài 2 dài 60 từ. Hậu quả?", options: ["Không sao, miễn đủ 250 từ.", "Task Response bị hạ vì một phần của đề được trả lời sơ sài.", "Chỉ ảnh hưởng Coherence."], correct: 1, why: "Bảng mô tả Task Response: band 7 trở lên đòi mọi phần của đề được xử lý; phần nào sơ sài hơn hẳn thì bị chặn ở band 6." },
          { q: "4. Câu nào KHÔNG trả lời được câu hỏi “Who should pay for repairing historic buildings: their owners, the local council or the state?”", options: ["Owners, who benefit most directly, should meet the larger share.", "The cost should be shared, with the state helping owners on low incomes.", "Everyone should think carefully about this important issue."], correct: 2, why: "C không chọn ai. A chọn một đối tượng có lý do; B chia có nguyên tắc — đều là câu trả lời." },
        ],
      },
      { t: "rule", formula: "hai câu hỏi → mở bài trả lời NGẮN cả hai → thân 1 = câu hỏi 1 → thân 2 = câu hỏi 2 (CHỌN + vì sao không phải bên kia) → hai thân dài ngang nhau", vi: "Câu hỏi “Who should…: A, B or C?” luôn đòi một lựa chọn có tiêu chí. “Tất cả cùng làm” không phải câu trả lời." },

      { t: "h", text: "B4. Checklist TRƯỚC khi bấm “Bắt đầu”" },
      {
        t: "quiz",
        id: "t5d16-viet-truoc-de",
        kind: "fill",
        title: "Tự kiểm 6 câu — trả lời xong mới vào đề",
        items: [
          { q: "1. Task 1 hai hình: đọc trong bao nhiêu phút? (số)", answers: ["4", "bốn", "four"], hint: "4 phút (một hình: 3 phút)." },
          { q: "2. Bảng nhiều đơn vị: so theo chiều nào? (dọc / ngang)", answers: ["dọc", "doc"], hint: "So DỌC theo năm; không so ngang giữa các hàng." },
          { q: "3. Phút thứ mấy phải bắt đầu Task 2? (số)", answers: ["20", "hai mươi"], hint: "Phút 20 — dù Task 1 chưa ưng." },
          { q: "4. Đề hai câu hỏi: hai thân bài nên lệch nhau không quá bao nhiêu từ? (số)", answers: ["30", "ba mươi"], hint: "Khoảng 30 từ." },
          { q: "5. Câu hỏi “Who should…: A, B or C?” đòi bạn làm gì? (một từ tiếng Việt)", answers: ["chọn", "chon"], hint: "CHỌN (hoặc phân vai có nguyên tắc)." },
          { q: "6. Lượt soát mới thêm từ Ngày 15 tên là gì? (một từ tiếng Anh)", answers: ["register"], hint: "Lượt register: kids · a lot of things · get · pretty · viết tắt." },
        ],
      },
      {
        t: "note",
        title: "📌 Bây giờ: làm Writing Đề 10",
        items: [
          "Mở **Online Test** → bộ **Đề 10** → **Academic Writing — Đề 10**. Bấm “Bắt đầu”. 60 phút, một mạch.",
          "Viết xong: nộp để AI chấm 4 tiêu chí. ==Chưa đọc bài mẫu vội== — làm mục B5 trước.",
        ],
      },

      { t: "h", text: "B5. SAU đề — 15 phút đọc bảng chấm" },
      {
        t: "sodo", kind: "flow", title: "Bốn việc sau khi nộp",
        steps: [
          { label: "① Ghi giờ thật", sub: "Task 1 xong ở phút mấy? Task 2 còn mấy phút soát?" },
          { label: "② Đọc bảng chấm của AI", sub: "tiêu chí THẤP nhất là việc của tuần này" },
          { label: "③ Soi bài mẫu của đề", sub: "tìm 2 lỗi nhỏ cố ý giữ trong mỗi bài mẫu (mục 🔎 Soi lỗi)" },
          { label: "④ Viết lại đoạn yếu nhất", sub: "ô viết dưới đây — chỉ MỘT đoạn" },
        ],
      },
      {
        t: "table",
        caption: "Tự hỏi sau Task 1 và Task 2",
        head: ["Câu hỏi", "Nếu “không”"],
        rows: [
          ["Overview của tôi có nói được một ĐIỀU ĐÁNG NÓI rút từ bảng (không chỉ hướng của từng hàng)?", "làm lại mục B2 — bảng “Bước 1”"],
          ["Tôi có tự tính ít nhất một tỉ lệ / số lần?", "B2 — hàng “phép tính nối hàng”"],
          ["Mỗi con số trong bài có đơn vị?", "B2 — note cẩn thận"],
          ["Mở bài Task 2 đã trả lời ngắn cả hai câu hỏi?", "B3 — bảng việc"],
          ["Câu hỏi thứ hai: tôi có CHỌN và có nói vì sao không phải đối tượng kia?", "B3 — hai thân bài mẫu"],
          ["Hai thân bài dài ngang nhau?", "đếm từ; lần sau dàn ý ghi số từ đích cạnh mỗi đoạn"],
        ],
      },
      {
        t: "essay",
        id: "t5d16-viet-viet-lai",
        task: "Task 2",
        prompt: "AFTER you have finished Writing Test 10 in the Online Test: choose the weaker of your two Task 2 body paragraphs and rewrite it here (110–140 words). On the FIRST line, write which question of the task the paragraph answers (Question 1 or Question 2). If it answers Question 2, make sure you choose between the options and say why the others are less suitable.",
        minWords: 110,
        tips: [
          "Chỉ viết lại MỘT đoạn. Mục đích là sửa đúng thứ bảng chấm chỉ ra, không phải viết bài mới.",
          "Dùng một khung của A2 nếu đoạn có cân hai phía (The first… is well founded, but…).",
          "Soát lượt register trước khi nộp (Ngày 15 mục 6).",
        ],
      },
      {
        t: "note",
        title: "📌 Ghi sổ lỗi — ba dòng",
        items: [
          "**Giờ:** Task 1 xong phút ___ · Task 2 còn ___ phút soát.",
          "**Tiêu chí thấp nhất:** Task 1 ___ · Task 2 ___.",
          "**Một lỗi lặp lại** (mạo từ / số nhiều / giới từ / register): ___ — Ngày 17 sẽ luyện đúng “chuỗi lỗi 7 → 8” này.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d16-nghe",
    kind: "listening",
    title: "Nghe: Listening Đề 10 (hướng dẫn làm đề) + bẫy nghe band 8 — con số bị đổi, phủ định kép",
    goal: "Làm trọn Listening Đề 10 ở Online Test (40 câu, tốc độ thật khoảng 180 từ/phút, bảy giọng) với đích 32–35 câu đúng: biết trước dạng câu của từng Part để dùng đúng giờ đọc trước, không rơi vào hai bẫy band 8 — con số bị sửa / phải tự tính và câu phủ định kép — và sau đề tự phân loại được từng câu sai.",
    minutes: 110,
    blocks: [
      {
        t: "recap", title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Ba chặng: **trước đề** (55 phút: bản đồ dạng câu, hai bẫy band 8, ba đoạn khởi động tai) → **làm Listening Đề 10** (30 phút nghe + 2 phút kiểm) → **sau đề** (20 phút: phân loại lỗi).",
          "Đề 10 nhắm band 7.5: nhanh hơn Đề 9 một nấc (khoảng **180 từ/phút**), ==tỉ lệ câu bẫy cao hơn==. Đích: **32–35 / 40**.",
          "**Bẫy ① — con số bị đổi**: số bị sửa, số phải tự tính (half as many again), số đúng nói TRƯỚC số sai, đơn vị đổi giữa câu.",
          "**Bẫy ② — phủ định kép và gần phủ định**: not uncommon, no shortage of, can't fail to, hardly… without, It's not that I don't…",
          "Hai bẫy này bảng lộ trình ghi cho Ngày 15; vì Ngày 15 học Nói nên dạy trọn ở đây (bạn đã thử trước ở Bài tập Ngày 15, phần V).",
          "🔊 Luyện nhấn câu phủ định kép: nói được thì tai mới bắt kịp ở tốc độ thật. Nối lại: Tập 4 Ngày 12 · 28 (bẫy đổi ý), Tập 5 Ngày 8 (làm Đề 9), Ngày 9 (mổ Đề 9: “con số thứ ba”).",
        ],
      },

      { t: "h", text: "1. Listening Đề 10 trong một bảng" },
      {
        t: "table",
        head: ["Part", "Câu", "Dạng câu", "Người nói · giọng", "Đọc trước"],
        rows: [
          ["1", "1–10", "**Form** completion (1–6) + **Table** completion (7–10)", "2 người · Mỹ (nam) + Úc (nữ)", "30 giây"],
          ["2", "11–20", "**Multiple choice** một đáp án (11–14) + **Matching** (15–20)", "1 người · Ireland (nữ)", "40 giây"],
          ["3", "21–30", "**Multiple choice** (21–25) + **Choose TWO** (26–27) + **Flow-chart** (28–30)", "3 người · New Zealand (nam) + Canada (nữ) + Anh (nam)", "40 giây"],
          ["4", "31–40", "**Note** completion (31–36) + **Summary** completion (37–40)", "1 người · Anh (nữ)", "45 giây"],
        ],
      },
      {
        t: "note",
        title: "📌 Luật chơi (như Ngày 8)",
        items: [
          "Nghe **một lần**, không dừng, không tua. Đeo tai nghe. Bản máy: gõ thẳng đáp án trong lúc nghe; cuối bài có **2 phút kiểm**.",
          "Nội dung đề không nằm trong bài này. Bảng trên chỉ cho bạn biết ==dạng== để chuẩn bị, đúng như thí sinh thật biết cấu trúc bài thi.",
          "So với Đề 9: thêm **matching** ở Part 2 và **flow-chart** ở Part 3 — hai dạng không theo khuôn “một câu hỏi, một đáp án ngay sau”. Mục 5 và 6 luyện đúng hai dạng đó.",
          "Giới hạn từ: đọc dòng lệnh của TỪNG nhóm câu. Part 1 của đề có nhóm cho phép **A NUMBER**, có nhóm chỉ **ONE WORD ONLY**.",
        ],
      },

      { t: "h", text: "2. Giờ đọc trước — làm gì với từng dạng" },
      {
        t: "table",
        head: ["Dạng", "Trong giờ đọc trước", "Trong lúc nghe", "Bẫy band 8"],
        rows: [
          ["Form / Table", "đoán LOẠI từ mỗi ô (số? tên? danh từ?); với bảng: đọc tiêu đề cột trước, hàng sau", "mắt đi trước tai một ô", "con số bị sửa; hai mục cùng loại nói liền nhau, chỉ một cái vào ô"],
          ["Multiple choice", "gạch chân từ KHÁC nhau giữa ba phương án, không đọc cả câu", "cả ba phương án thường đều được nhắc; chờ câu XÁC NHẬN", "phương án có thật nhưng không phải lý do; phủ định kép đảo nghĩa"],
          ["Matching", "đọc HỘP phương án (A–G) hai lần — bạn sẽ không có thời gian đọc lại; ghi 1–2 chữ gợi nhớ cạnh mỗi chữ cái", "các mục 15–20 nói THEO THỨ TỰ; phương án thì lộn xộn và là paraphrase", "một mục nhắc tới hai phương án, một cái bị phủ định"],
          ["Choose TWO", "đếm: 5 phương án, 2 đúng ⇒ 3 cái sẽ bị BÁC thành tiếng", "đánh dấu ✗ ngay khi một phương án bị bác", "phương án được ĐỀ XUẤT rồi bị người khác gạt"],
          ["Flow-chart", "đọc cả lưu đồ như một câu chuyện; chú ý từ đứng ngay TRƯỚC ô trống", "người nói có thể kể bước sai trước (“last year's group…”) rồi mới nói bước đúng", "thứ tự bị đảo: “Not straight away. First…”"],
          ["Note / Summary", "tiêu đề nhỏ của ghi chú = dàn ý bài giảng; với summary: đọc cả đoạn, đoán loại từ", "summary KHÔNG dùng lại từ của bài nói — nghe ý, không chờ từ khoá", "hai danh từ bị bác đứng sát đáp án"],
        ],
      },
      { t: "rule", formula: "giờ đọc trước: Form / Table → loại từ   ·   MCQ → từ KHÁC nhau   ·   Matching → thuộc HỘP   ·   Flow-chart → từ đứng trước ô", vi: "Mỗi dạng một việc. Đọc lại câu hỏi từ đầu tới cuối là việc tốn giờ nhất và ít ích nhất." },

      /* ── 3 ── */
      { t: "h", text: "3. Bẫy band 8 ① — con số bị đổi" },
      {
        t: "p",
        text: "Ở band 6, bẫy số là nghe nhầm fifteen / fifty. Ở band 8, bạn nghe rõ ==mọi== con số — và vẫn sai, vì con số cần điền không phải con số được nói to nhất. Sáu kiểu:",
      },
      {
        t: "table",
        head: ["Kiểu", "Nghe thấy", "Đáp án", "Dấu hiệu"],
        rows: [
          ["① Sửa lại", "the twenty-first… no, hang on, the twenty-second", "22nd", "no · sorry · hang on · actually · I tell a lie"],
          ["② Số đúng nói TRƯỚC", "ninety minutes, not the sixty it says online", "90", "X, not the Y… — đừng ghi con số nghe SAU CÙNG"],
          ["③ Giảm / tăng nhiều bước", "eighty-five… with your card it's sixty… another ten off", "50", "nghe hết cả chuỗi rồi mới ghi"],
          ["④ Tự tính", "a hundred and twenty… half as many again", "180", "half as many again (× 1,5) · double · a third off · split three ways"],
          ["⑤ Phần và tổng", "four hundred households… ninety-six replied", "96 (không phải 400)", "câu hỏi hỏi PHẦN hay TỔNG? đọc lại ô"],
          ["⑥ Mốc bị điều kiện đẩy lùi", "opens at half past eight… can't use it until quarter past nine", "9.15", "but · not until · unless"],
        ],
      },
      {
        t: "table",
        caption: "Cụm tính toán phải hiểu ngay khi nghe",
        head: ["Cụm", "Nghĩa", "Ví dụ: gốc 120"],
        rows: [
          ["half as many / much again", "thêm một nửa (× 1,5)", "180"],
          ["twice as many · double", "gấp đôi", "240"],
          ["half that · half as many", "một nửa", "60"],
          ["a third off · a third less", "bớt một phần ba", "80"],
          ["up by a quarter", "tăng một phần tư", "150"],
          ["just under · just over", "sát dưới · sát trên", "118 · 122"],
          ["a fortnight", "hai tuần", "—"],
          ["the week after next", "tuần sau nữa", "—"],
        ],
      },
      {
        t: "p",
        text: "**Luyện ①.** Sáu đoạn ngắn, mỗi đoạn một câu hỏi. Đọc câu hỏi trong **20 giây**. Nghe **một lần**. Viết **A NUMBER** (giờ viết dạng 9.15).",
      },
      {
        t: "listen",
        id: "t5d16-nghe-so",
        title: "Practice 1 — Six short extracts: which number?",
        dan: { so: "Day 16, Recording 1", boiCanh: "six short extracts. Answer one question for each extract.", cau: [1, 6] },
        note: "Khoảng 1 phút (tính cả quãng nghỉ giữa các đoạn), ~180 từ/phút. Đoạn 1 · 3 · 5: giọng Úc (nữ). Đoạn 2 · 4 · 6: giọng Mỹ (nam). Mọi con số là hư cấu.",
        lines: [
          { who: "1", voice: "au-nu", text: "The workshop's down as costing eighty-five dollars, but that's the non-member rate. With your student card it's sixty, and if you book before Friday we take another ten off." },
          { who: "2", voice: "us-nam", text: "We had a hundred and twenty sign up last year. This year it's half as many again, so we've had to find a bigger hall." },
          { who: "3", voice: "au-nu", text: "The survey went out to four hundred households. Just under a quarter replied, ninety-six to be exact, which is actually not bad for a postal survey." },
          { who: "4", voice: "us-nam", text: "Rent's nine hundred a month, which sounds steep, but that's for the whole apartment. Split three ways, you're each looking at three hundred, plus about forty for bills." },
          { who: "5", voice: "au-nu", text: "The lab opens at half past eight, but the technician doesn't get in till quarter past nine, and you can't use the centrifuge unless she's there." },
          { who: "6", voice: "us-nam", text: "The deadline was the fourteenth. It's been pushed back a week, to the twenty-first. No, hang on, that's a public holiday, so they're taking submissions on the twenty-second instead." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-nghe-so-dien",
        kind: "fill",
        title: "Questions 1–6 — A NUMBER",
        items: [
          { q: "1. Price for a student who books before Friday: $ ___", answers: ["50", "fifty"], hint: "85 (non-member) → 60 (student card) → “another ten off” ⇒ 50. Kiểu ③: ba bước, đáp án không được nói thành tiếng." },
          { q: "2. Number of people who have signed up this year: ___", answers: ["180", "one hundred and eighty", "a hundred and eighty"], hint: "120 + một nửa của 120 = 180 (half as many again). Kiểu ④." },
          { q: "3. Number of households that replied to the survey: ___", answers: ["96", "ninety-six", "ninety six"], hint: "400 là số gửi đi; “ninety-six to be exact” là số trả lời. Kiểu ⑤: phần, không phải tổng." },
          { q: "4. Total each person pays per month, including bills: $ ___", answers: ["340", "three hundred and forty"], hint: "900 ÷ 3 = 300, “plus about forty for bills” ⇒ 340. Câu hỏi có chữ including bills." },
          { q: "5. Earliest time the centrifuge can be used: ___", answers: ["9.15", "9:15", "quarter past nine", "09.15", "09:15", "9.15 am", "9:15 am"], hint: "Phòng mở 8.30, nhưng “can't use the centrifuge unless she's there” — kỹ thuật viên tới 9.15. Kiểu ⑥." },
          { q: "6. New deadline: the ___ (date)", answers: ["22", "22nd", "twenty-second", "twenty second"], hint: "14 → 21 → “No, hang on… the twenty-second instead”. Kiểu ①: con số thứ ba." },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo — ghi nháp thế nào khi số bị đổi",
        items: [
          "Ghi MỌI con số nghe được thành một hàng ngang (85 → 60 → −10), đừng gõ ngay vào ô. Gõ vào ô khi người nói ==chuyển sang ý khác==.",
          "Nghe thấy **again, off, each, split, plus, less** là có phép tính. Dừng gõ, tính.",
          "Trước khi chốt: đọc lại nhãn của ô. Ô hỏi **per person** hay **in total**? **this year** hay **last year**? **including** hay **excluding**?",
        ],
      },
      { t: "rule", formula: "con số đúng = con số có câu XÁC NHẬN (so that's the figure · to be exact · instead) hoặc là KẾT QUẢ của phép tính — không phải con số nói đầu tiên hay cuối cùng", vi: "Ghi cả chuỗi số ra nháp; chốt khi người nói đổi ý khác; đối chiếu nhãn ô." },

      /* ── 4 ── */
      { t: "h", text: "4. Bẫy band 8 ② — phủ định kép và gần phủ định" },
      {
        t: "p",
        text: "Tiếng Anh nói rất hay dùng hai phủ định để diễn tả một ý ==khẳng định có dè dặt== (đây cũng là tone — Ngày 15). Ở 180 từ/phút bạn không kịp “dịch rồi đảo”; phải nhận ra cả cụm như một từ.",
      },
      {
        t: "table",
        head: ["Cụm nghe được", "Nghĩa thật", "Ghi chú"],
        rows: [
          ["It's **not uncommon** / **not unusual** for…", "khá thường gặp", "không mạnh bằng common"],
          ["There's **no shortage of**… / We've **never** had any **shortage** of…", "có rất nhiều", ""],
          ["You **can't fail to** notice…", "chắc chắn sẽ thấy", ""],
          ["**Hardly** a week goes by **without**…", "gần như tuần nào cũng có", "hardly / scarcely / barely = gần phủ định"],
          ["**Nobody** goes on air **without** training.", "ai cũng phải qua đào tạo", "no… without = bắt buộc"],
          ["**It's not that** I **don't** like it; …", "tôi CÓ thích; vấn đề nằm ở vế sau", "đáp án ở sau dấu chấm phẩy"],
          ["I **wouldn't say** it **wasn't** worth it.", "cũng đáng (dè dặt)", ""],
          ["I **can't** remember the last time anyone **failed**.", "gần như không ai trượt", "nghe failed ≠ nhiều người trượt"],
          ["**far from** conclusive · **anything but** simple", "KHÔNG thuyết phục · KHÔNG hề đơn giản", "một phủ định giấu trong cụm"],
          ["She **didn't mind** the length.", "cô ấy thấy độ dài ỔN", "didn't mind ≠ chê"],
          ["It's **not** the size **that's** the issue.", "vấn đề KHÔNG phải kích thước", "cleft phủ định: loại phương án"],
        ],
      },
      {
        t: "mcq",
        id: "t5d16-nghe-phu-dinh",
        title: "Chọn câu ĐÚNG NGHĨA với câu nghe được (8 câu)",
        items: [
          { q: "1. “It's not uncommon for students to change course in the first year.”", options: ["Students rarely change course.", "Quite a few students change course.", "Students are not allowed to change course."], correct: 1, why: "not uncommon = khá phổ biến." },
          { q: "2. “I wouldn't say the trip wasn't worth it.”", options: ["The trip was a waste of time.", "The speaker refuses to comment.", "The trip had some value."], correct: 2, why: "wouldn't say + wasn't ⇒ khẳng định dè dặt: cũng đáng." },
          { q: "3. “We've never had any shortage of people wanting to present.”", options: ["Plenty of people want to present.", "Nobody wants to present.", "They need more presenters."], correct: 0, why: "never + shortage = luôn thừa. Trong MCQ “họ thiếu ai?”, đây là phương án bị LOẠI." },
          { q: "4. “The results were far from conclusive.”", options: ["The results settled the question.", "The results did not settle the question.", "The results arrived from a distant lab."], correct: 1, why: "far from + adj = hoàn toàn không." },
          { q: "5. “It's not that I don't like the design; I just don't think we can afford it.”", options: ["The speaker dislikes the design.", "The speaker's objection is the cost.", "The speaker thinks the design is cheap."], correct: 1, why: "It's not that I don't like = tôi có thích. Lý do thật đứng sau dấu chấm phẩy: afford." },
          { q: "6. “Hardly a week goes by without a complaint about the lift.”", options: ["Complaints are almost weekly.", "There has been no complaint for weeks.", "The lift is hardly ever used."], correct: 0, why: "hardly… without = gần như lần nào cũng có." },
          { q: "7. “The tutor didn't mind the length of the report.”", options: ["She thought it was too long.", "She had no objection to its length.", "She forgot to check the length."], correct: 1, why: "didn't mind = không phản đối. Trong MCQ “giảng viên chê gì?”, phương án về độ dài bị LOẠI." },
          { q: "8. “You can't fail to notice the new building.”", options: ["The building is easy to miss.", "The building is impossible to miss.", "You are not allowed to look at it."], correct: 1, why: "can't fail to = chắc chắn sẽ." },
        ],
      },
      {
        t: "phatam",
        id: "t5d16-phat-am",
        title: "Luyện phát âm — nhấn trong câu phủ định kép: nói được thì nghe kịp",
        note: "Trong cụm phủ định kép, người bản ngữ nhấn TỪ PHỦ ĐỊNH THỨ HAI hoặc từ nội dung (in HOA trong phần dịch) và nuốt từ phủ định đầu. Nói mỗi câu ba lần, lần sau nhanh hơn lần trước, tới khi cả cụm dính thành một khối.",
        items: [
          { text: "It's not uncommon.", ipa: "ɪts nɒt ʌnkɒmən", vi: "Chuyện đó không hiếm. (not unCOMmon — t của not gần như mất)" },
          { text: "I wouldn't say it wasn't worth it.", ipa: "aɪ wʊdnt seɪ ɪt wɒznt wɜːθ ɪt", vi: "Tôi không nói là nó không đáng. (wouldn't SAY | it WASn't WORTH it)" },
          { text: "There's no shortage of volunteers.", ipa: "ðeəz nəʊ ʃɔːtɪdʒ əv vɒləntɪəz", vi: "Tình nguyện viên thì không thiếu. (NO SHORtage of volunTEERS)" },
          { text: "You can't fail to notice it.", ipa: "ju kɑːnt feɪl tə nəʊtɪs ɪt", vi: "Bạn chắc chắn sẽ thấy nó. (CAN'T FAIL to NOtice it — giọng Anh /kɑːnt/, giọng Mỹ /kænt/)" },
          { text: "The results were far from conclusive.", ipa: "ðə rɪzʌlts wə fɑː frəm kənkluːsɪv", vi: "Kết quả còn xa mới thuyết phục. (FAR from conCLUsive)" },
          { text: "Hardly a week goes by without a complaint.", ipa: "hɑːdli ə wiːk ɡəʊz baɪ wɪðaʊt ə kəmpleɪnt", vi: "Hầu như tuần nào cũng có khiếu nại. (HARDly a WEEK goes by | withOUT a comPLAINT)" },
          { text: "It's not that I don't like it.", ipa: "ɪts nɒt ðət aɪ dəʊnt laɪk ɪt", vi: "Không phải là tôi không thích. (not that I DON'T ↘↗LIKE it — xuống–lên, chờ chữ but: Ngày 15)" },
          { text: "Nobody left without a certificate.", ipa: "nəʊbədi left wɪðaʊt ə sətɪfɪkət", vi: "Không ai ra về mà không có chứng chỉ. (NObody left | withOUT a cerTIficate)" },
        ],
      },
      { t: "rule", formula: "not un- · no shortage of · can't fail to · hardly… without · nobody… without  →  KHẲNG ĐỊNH   ·   far from · anything but · didn't mind  →  đọc kỹ: một phủ định giấu", vi: "Nhận cả cụm như một từ. Trong MCQ, phủ định kép thường dùng để LOẠI một phương án nghe rất giống đáp án." },

      /* ── 5 ── */
      { t: "h", text: "5. Khởi động ② — kiểu Part 2: multiple choice + matching (Questions 7–14)" },
      {
        t: "p",
        text: "Bạn nghe quản lý một đài phát thanh sinh viên nói chuyện với tình nguyện viên mới. **40 giây** đọc trước: gạch từ khác nhau ở câu 7–9; đọc HỘP A–G hai lần cho câu 10–14. Nghe **một lần**.",
      },
      {
        t: "table",
        caption: "Questions 10–14 — What does the station manager say about each programme? Choose FIVE answers from the box, A–G.",
        head: ["Chữ", "Phương án"],
        rows: [
          ["A", "It is not broadcast live."],
          ["B", "It requires previous experience at the station."],
          ["C", "It is unlikely to have a place available."],
          ["D", "It involves working with a partner."],
          ["E", "It requires technical experience."],
          ["F", "It is broadcast only during term time."],
          ["G", "It attracts the largest audience."],
        ],
      },
      {
        t: "listen",
        id: "t5d16-nghe-p2",
        title: "Practice 2 — A welcome talk at Tidewater Student Radio",
        dan: { so: "Day 16, Recording 2", boiCanh: "the manager of a student radio station talking to a group of new volunteers.", cau: [7, 14] },
        note: "Khoảng 2 phút, ~180 từ/phút. Giọng Ireland (nữ). Đài Tidewater là hư cấu.",
        lines: [
          { who: "Aoife", voice: "ie-nu", text: "Good evening, everyone, and welcome to Tidewater, the student radio station. I'm Aoife, the station manager, and I'll keep this short, because the best way to learn radio is to do it." },
          { who: "Aoife", voice: "ie-nu", text: "First, a word about who listens. You might assume it's mostly students in halls, and a few years ago you'd have been right. These days the bigger share of our audience is people in the town, listening in shops and cars, with students a fair way behind and, believe it or not, a small but loyal group online from overseas." },
          { who: "Aoife", voice: "ie-nu", text: "Now, nobody goes on air without training, and that's not negotiable. The course used to be three evenings. We've cut it to two, a Tuesday and a Thursday, with a short test at the end of the second. It isn't hard, and I can't remember the last time anyone failed it, but you do have to turn up to both." },
          { who: "Aoife", voice: "ie-nu", text: "People always ask what we're short of. It's not presenters. We've never had any shortage of people wanting to talk. And we're fine for music programmers. What we can never find enough of is people willing to edit, to sit with the recordings and cut them down. If that's you, come and see me afterwards." },
          { who: "Aoife", voice: "ie-nu", text: "Let me run through the slots that have openings this term. The Breakfast Show goes out live at seven, so it suits an early riser. You'll work as one of a pair, never alone." },
          { who: "Aoife", voice: "ie-nu", text: "Campus Report is our news programme. It's recorded rather than live, and you'd be expected to go out and do interviews, so you need to be free in the afternoons." },
          { who: "Aoife", voice: "ie-nu", text: "Night Shift is from eleven till one. There's no one else in the building, so we only give it to people who've done at least a term with us." },
          { who: "Aoife", voice: "ie-nu", text: "The Sports Desk covers Saturday matches, and here I should be honest: it's the one slot with a waiting list, so don't count on it this year." },
          { who: "Aoife", voice: "ie-nu", text: "And finally Open Mic, on Sunday evenings, where local bands play in the studio. That one needs someone who's handled sound equipment before, because there's no engineer at weekends." },
        ],
      },
      {
        t: "mcq",
        id: "t5d16-nghe-p2-chon",
        title: "Questions 7–9 — Choose the correct letter, A, B or C",
        items: [
          { q: "7. Who makes up the largest part of the station's audience?", options: ["A students living in halls", "B people living in the town", "C listeners in other countries"], correct: 1, why: "“You might assume it's mostly students in halls, and a few years ago you'd have been right” (A đúng TRƯỚC ĐÂY). “These days the bigger share… is people in the town” ⇒ B. C: “small but loyal”." },
          { q: "8. What does Aoife say about the training course?", options: ["A It lasts three evenings.", "B Many people have to retake the test.", "C Attendance at every session is compulsory."], correct: 2, why: "“used to be three evenings. We've cut it to two” ⇒ loại A (con số bị đổi). “I can't remember the last time anyone failed it” ⇒ gần như không ai trượt, loại B (phủ định kép). “you do have to turn up to both” ⇒ C." },
          { q: "9. Which kind of volunteer does the station need most?", options: ["A presenters", "B music programmers", "C editors"], correct: 2, why: "“It's not presenters. We've never had any shortage of…” (loại A). “we're fine for music programmers” (loại B). “What we can never find enough of is people willing to edit” ⇒ C." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-nghe-p2-noi",
        kind: "fill",
        title: "Questions 10–14 — gõ chữ cái A–G",
        items: [
          { q: "10. The Breakfast Show", answers: ["D"], hint: "“You'll work as one of a pair, never alone” ⇒ D. Bẫy A: “goes out live at seven” — live, ngược với A." },
          { q: "11. Campus Report", answers: ["A"], hint: "“It's recorded rather than live” ⇒ A (not broadcast live = recorded)." },
          { q: "12. Night Shift", answers: ["B"], hint: "“only… people who've done at least a term with us” ⇒ B. Bẫy D: “no one else in the building” = làm MỘT MÌNH, ngược với partner." },
          { q: "13. The Sports Desk", answers: ["C"], hint: "“the one slot with a waiting list, so don't count on it this year” ⇒ C." },
          { q: "14. Open Mic", answers: ["E"], hint: "“someone who's handled sound equipment before” ⇒ E (technical experience). Khác B: kinh nghiệm KỸ THUẬT, không phải kinh nghiệm ở đài. F và G không được nhắc tới." },
        ],
      },
      {
        t: "note",
        title: "📌 Rút ra cho dạng matching khi nghe",
        items: [
          "Năm chương trình nói ==đúng thứ tự câu hỏi==; mỗi chương trình chỉ 2–3 câu ⇒ bạn có khoảng 8 giây cho mỗi đáp án. Không thuộc hộp thì không kịp.",
          "Mỗi mục có một chi tiết ==chạm vào phương án khác== (live ↔ A; no one else ↔ D). Chờ câu nói về ĐIỀU KIỆN hoặc HỆ QUẢ (so…, because…).",
          "Lỡ một mục: bỏ, nghe tên chương trình kế tiếp. Tên riêng là mốc để bám lại.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Khởi động ③ — kiểu Part 3: ba người, multiple choice + choose TWO + flow-chart (Questions 15–21)" },
      {
        t: "p",
        text: "Ba sinh viên — **Chloe**, **Tama**, **Oliver** — thiết kế một trò chơi cờ bàn dạy thống kê cho học sinh 14 tuổi. **40 giây** đọc trước: khoanh TÊN người trong câu 15–16; với lưu đồ, đọc từ đứng ngay trước mỗi ô. Nghe **một lần**.",
      },
      {
        t: "listen",
        id: "t5d16-nghe-p3",
        title: "Practice 3 — Designing a board game about statistics",
        dan: { so: "Day 16, Recording 3", boiCanh: "three students, Chloe, Tama and Oliver, discussing a board game they are designing for a course project.", cau: [15, 21] },
        note: "Khoảng 2 phút 10 giây, ~180 từ/phút. Chloe: giọng Canada (nữ). Tama: giọng New Zealand (nam). Oliver: giọng Anh (nam).",
        lines: [
          { who: "Chloe", voice: "ca-nu", text: "OK, so the brief says a game that teaches one idea from statistics to fourteen-year-olds. Have we settled on the idea?" },
          { who: "Tama", voice: "nz-nam", text: "I'd assumed we'd do averages. It's the first thing in the school syllabus." },
          { who: "Oliver", voice: "uk-nam", text: "Which is exactly why I'd steer clear of it. They've all done it to death. I was thinking sampling: how a small group can stand in for a big one, and how it can mislead you." },
          { who: "Chloe", voice: "ca-nu", text: "I like that. It's not that averages wouldn't work, Tama, but there's not much of a game in them. With sampling, you can have players drawing cards and betting on what's in the whole pack." },
          { who: "Tama", voice: "nz-nam", text: "Fair enough. Sampling, then." },
          { who: "Chloe", voice: "ca-nu", text: "Now, the tutor's feedback on our outline. Did either of you read it properly?" },
          { who: "Oliver", voice: "uk-nam", text: "She didn't mind the length of the rules. I thought she would. Her worry was that a player who falls behind early can never catch up, so half the table stops caring." },
          { who: "Tama", voice: "nz-nam", text: "Right, and she didn't say a word about the artwork, which I'd been dreading." },
          { who: "Chloe", voice: "ca-nu", text: "So what do we change before the test session? We can't do everything." },
          { who: "Tama", voice: "nz-nam", text: "I'd say cut the number of rounds. Ten's too many. Nobody will sit through that in a lesson." },
          { who: "Oliver", voice: "uk-nam", text: "Agreed, six at most. And I'd add some kind of bonus for whoever's in last place, to deal with the catching-up problem." },
          { who: "Chloe", voice: "ca-nu", text: "Yes to both. I did wonder about making the board bigger, but honestly it isn't the size that's the issue." },
          { who: "Oliver", voice: "uk-nam", text: "And we're not adding dice. I know you like dice, Tama." },
          { who: "Tama", voice: "nz-nam", text: "I never said a word." },
          { who: "Chloe", voice: "ca-nu", text: "Let's fix the order for the test session, then, because last year's group apparently got it wrong. We don't explain the statistics at the start. The players get the rules, nothing else, and they play one round just for practice, which doesn't count." },
          { who: "Oliver", voice: "uk-nam", text: "Then the real game, and while they're playing, one of us writes down every question they ask. Not the scores. The scores don't tell us anything. The questions tell us where the rules are unclear." },
          { who: "Tama", voice: "nz-nam", text: "And after that we hand out the quiz?" },
          { who: "Chloe", voice: "ca-nu", text: "Not straight away. First we get them to say, in their own words, what they think the game was about. A short discussion. Only then the quiz, so we can see whether the idea actually went in." },
          { who: "Oliver", voice: "uk-nam", text: "And we rewrite the rules that same evening, while it's fresh." },
        ],
      },
      {
        t: "mcq",
        id: "t5d16-nghe-p3-chon",
        title: "Questions 15–16 — Choose the correct letter, A, B or C",
        items: [
          { q: "15. What is Chloe's objection to a game about averages?", options: ["A Pupils have studied the topic too many times.", "B The topic does not lend itself to a game.", "C The topic could not be taught in this way."], correct: 1, why: "A là ý của OLIVER (“They've all done it to death”) — câu hỏi hỏi Chloe. Chloe: “It's not that averages wouldn't work” (phủ định kép ⇒ CÓ dạy được, loại C) “but there's not much of a game in them” ⇒ B." },
          { q: "16. What was the tutor's main criticism of the outline?", options: ["A The rules were too long.", "B Players who are losing lose interest.", "C The artwork was poor."], correct: 1, why: "“She didn't mind the length of the rules” (loại A). “didn't say a word about the artwork” (loại C). “a player who falls behind early can never catch up, so half the table stops caring” ⇒ B." },
        ],
      },
      {
        t: "p",
        text: "**Questions 17–18.** Choose **TWO** letters, **A–E**. Which TWO changes do the students agree to make before the test session? — **A** reduce the number of rounds · **B** make the board larger · **C** add dice · **D** give an advantage to the player in last place · **E** shorten the rules",
      },
      {
        t: "quiz",
        id: "t5d16-nghe-p3-hai",
        kind: "fill",
        title: "Questions 17–18 — gõ hai chữ cái (thứ tự nào cũng được), ví dụ: B C",
        items: [
          { q: "17–18. Two letters", answers: ["A D", "D A", "AD", "DA", "A, D", "D, A", "A and D", "D and A", "A,D", "D,A"], hint: "“cut the number of rounds” — “Agreed, six at most” ⇒ A. “a bonus for whoever's in last place” — “Yes to both” ⇒ D. B: “it isn't the size that's the issue”. C: “we're not adding dice”. E: giảng viên không chê độ dài nên không ai đề xuất." },
        ],
      },
      {
        t: "table",
        caption: "Questions 19–21 — Complete the flow-chart. Write ONE WORD ONLY for each answer.",
        head: ["Bước", "The test session"],
        rows: [
          ["1", "Players are given the rules and nothing else."],
          ["2", "↓ They play one round for **19** ………… ; the result is ignored."],
          ["3", "↓ The real game: a team member records every **20** ………… from the players."],
          ["4", "↓ Players take part in a short **21** ………… about the meaning of the game."],
          ["5", "↓ Players complete the quiz."],
          ["6", "↓ The team rewrites the rules the same evening."],
        ],
      },
      {
        t: "quiz",
        id: "t5d16-nghe-p3-luu-do",
        kind: "fill",
        title: "Questions 19–21 — ONE WORD ONLY",
        items: [
          { q: "19. They play one round for ___", answers: ["practice", "practise"], hint: "“they play one round just for practice, which doesn't count” (doesn't count = the result is ignored)." },
          { q: "20. A team member records every ___ from the players.", answers: ["question"], hint: "“writes down every question they ask. Not the scores.” — scores bị bác thành tiếng. Sau every là danh từ số ít: question." },
          { q: "21. Players take part in a short ___", answers: ["discussion"], hint: "Tama đề xuất quiz ngay — “Not straight away. First… A short discussion. Only then the quiz.” Thứ tự bị đảo so với lời đề xuất." },
        ],
      },
      {
        t: "note",
        title: "📌 Rút ra cho Part 3 của đề",
        items: [
          "**Ý của AI**: câu 15 hỏi Chloe; ý của Oliver nói trước và nghe rất “đúng”. Khoanh tên trong câu hỏi.",
          "**Choose TWO**: năm phương án, ba cái bị bác bằng ba kiểu khác nhau — cleft phủ định (it isn't the size…), từ chối thẳng (we're not adding…), và không ai đề xuất.",
          "**Flow-chart**: người nói kể theo thứ tự, nhưng một người có thể ĐỀ XUẤT sai bước (the quiz?) trước khi người khác sửa.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Hai phút kiểm cuối — bản dành cho Đề 10" },
      {
        t: "table",
        head: ["Giây", "Kiểm gì", "Vì sao"],
        rows: [
          ["0–30", "Part 1: chính tả tên riêng · mọi ô số có đúng LOẠI (giá, giờ, ngày) · nhóm ONE WORD ONLY không có ô nào hai từ", "Part 1 là nơi mất điểm oan nhất"],
          ["30–60", "Part 2 và 3: không ô nào trống; matching — có chữ cái nào dùng hai lần không (đề không cho phép thì sai một trong hai)", "trống = chắc chắn 0 điểm"],
          ["60–100", "Part 3 flow-chart + Part 4: đọc lại CẢ CÂU có đáp án — số ít / số nhiều, mạo từ thừa, loại từ", "lỗi ngữ pháp trong ô vẫn bị trừ"],
          ["100–120", "Câu nào còn phân vân: giữ đáp án ĐẦU TIÊN, trừ khi bạn nhớ ra một câu cụ thể trong bài nghe", "đổi theo cảm giác thường đổi đúng thành sai"],
        ],
      },
      {
        t: "note",
        title: "📌 Bây giờ: làm Listening Đề 10",
        items: [
          "Nghỉ ít nhất **20 phút** sau Writing. Uống nước. Đeo tai nghe, thử âm lượng.",
          "Mở **Online Test** → bộ **Đề 10** → **Listening — Đề 10** → chế độ **thi** (không phải luyện). 30 phút + 2 phút kiểm, một mạch.",
          "Để một tờ nháp cạnh bàn: ghi chuỗi số (mục 3) và dấu ✗ cho phương án bị bác (mục 2).",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. SAU đề — tự mổ trong 20 phút" },
      {
        t: "p",
        text: "Lộ trình không có ngày riêng để mổ Listening Đề 10 (Ngày 17 mổ Reading, Ngày 22 mổ Speaking), nên phần mổ Nghe bạn tự làm ngay hôm nay theo đúng cách đã học ở Ngày 9.",
      },
      {
        t: "table",
        head: ["Điểm thô", "Band ước tính", "Nhận định"],
        rows: [
          ["37–40", "8.5–9.0", "Vượt đích của đề. Giữ nhịp; Đề 11 sẽ có nhiễu nền nhẹ."],
          ["35–36", "8.0", "Đúng đích cuối tập."],
          ["32–34", "7.5", "Đúng mức của Đề 10. Tìm 3 câu sai dễ sửa nhất."],
          ["30–31", "7.0", "Xem Part nào dưới 7 / 10 — thường là Part 3."],
          ["≤ 29", "≤ 6.5", "Làm lại mục 3–6 của bài này, rồi Tập 5 Ngày 9 mục 7–9, trước khi sang Đề 11."],
        ],
      },
      {
        t: "table",
        caption: "Sáu nhãn lỗi — gắn cho TỪNG câu sai (mở lời thoại của đề ở chế độ xem lại)",
        head: ["Nhãn", "Dấu hiệu", "Ôn ở đâu"],
        rows: [
          ["**SỐ** — con số bị đổi", "ghi con số đầu tiên / cuối cùng; không tính", "mục 3"],
          ["**PHỦ** — phủ định kép", "chọn phương án bị “not… un-/without/shortage” loại", "mục 4"],
          ["**AI** — nhầm người", "ý đúng nhưng của người khác", "mục 6 · Ngày 9 mục 4"],
          ["**BÁC** — phương án bị gạt", "chọn cái được đề xuất rồi bị từ chối", "mục 6 · Tập 4 Ngày 12"],
          ["**CHỮ** — chính tả / số từ / số ít–nhiều", "nghe đúng, gõ sai", "mục 7"],
          ["**LẠC** — mất dấu", "lỡ một câu rồi lỡ luôn 2–3 câu sau", "mục 5 — bám tên riêng / tiêu đề nhỏ"],
        ],
      },
      {
        t: "mcq",
        id: "t5d16-nghe-phan-loai",
        title: "Tập gắn nhãn — bốn tình huống",
        items: [
          { q: "1. Băng: “It was four pounds fifty, but it's gone up by a pound.” Bạn ghi 4.50.", options: ["SỐ", "CHỮ", "LẠC"], correct: 0, why: "Phải tính: 4,50 + 1 = 5,50. Lỗi con số bị đổi (kiểu ④)." },
          { q: "2. Băng: “We're not short of drivers; it's cooks we can't find.” Câu hỏi: họ cần ai? Bạn chọn drivers.", options: ["AI", "PHỦ", "CHỮ"], correct: 1, why: "not short of = có đủ. Phủ định đảo nghĩa; đáp án ở vế sau (cleft: it's cooks…)." },
          { q: "3. Băng nói “two laboratories”; ô cho phép ONE WORD ONLY và câu là “carried out in two ___”. Bạn gõ laboratory.", options: ["SỐ", "BÁC", "CHỮ"], correct: 2, why: "Nghe đúng, gõ thiếu -ies. Sau two là danh từ số nhiều — đọc lại cả câu trong 2 phút kiểm." },
          { q: "4. Ở Part 4 bạn còn đang nghĩ về câu 33 thì băng đã qua câu 35.", options: ["LẠC", "PHỦ", "AI"], correct: 0, why: "Mất dấu. Cách chữa: bỏ ngay câu lỡ, bám tiêu đề nhỏ kế tiếp của ghi chú." },
        ],
      },
      {
        t: "table",
        caption: "Ghi sổ lỗi — mẫu một dòng",
        head: ["Câu", "Tôi ghi", "Đáp án", "Nhãn", "Câu trong băng làm tôi sai"],
        rows: [
          ["(ví dụ) 8", "60", "90", "SỐ", "“ninety, not the sixty it says online” — số đúng nói trước"],
          ["…", "", "", "", ""],
        ],
      },
      {
        t: "note",
        title: "📌 Việc còn lại của Đề 10",
        items: [
          "**Reading Đề 10** (60 phút) và **Speaking Đề 10** (giám khảo AI, 11–14 phút): làm ở Online Test hôm nay hoặc sáng mai. ==Ngày 17 mổ Reading Đề 10== — chưa làm thì chưa học được.",
          "Đếm nhãn: nhãn nào xuất hiện từ ba lần trở lên là việc của tuần này. SỐ và PHỦ ⇒ làm lại mục 3 và 4 sau ba ngày.",
          "Ghi điểm bốn kỹ năng của Đề 10 cạnh điểm Đề 9. Lên từ 0,5 trở lên ở kỹ năng nào thì ghi lại bạn đã làm khác đi điều gì.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d16-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 16 — 33 chủ đề, câu cân, bảng nhiều đơn vị, bẫy số và phủ định kép (40 câu)",
    goal: "Sau khi làm Đề 10: củng cố trong 55 phút — gọi lại từ của 33 chủ đề, viết câu cân cho bài advantages / disadvantages, đọc một bảng nhiều đơn vị mới, và nghe một cuộc gọi đặt hàng đầy con số bị đổi và phủ định kép — đúng ít nhất 32 / 40.",
    minutes: 55,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay gồm gì",
        items: [
          "Làm **sau** Đề 10 (hoặc sáng mai). Hôm nay bạn đã viết 60 phút và nghe 32 phút — bài tập này ngắn và không có ô viết dài.",
          "**I–III** ôn Bài 1: điền từ theo chủ đề (10), bắc cầu / chọn từ (6), dịch (4).",
          "**IV–V** ôn Bài 2: câu cân (6), đọc bảng nhiều đơn vị mới (4).",
          "**VI** ôn Bài 3: một cuộc gọi đặt áo cho hackathon — giọng New Zealand + Mỹ, tốc độ thật (10 câu).",
          "Đích: ≥ 32 / 40. Còn sức thì viết bài Task 2 ở Bài 2 mục A3 (right to disconnect).",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 16 trong một hình", center: "Ngày làm Đề 10",
        branches: [
          { label: "Từ vựng", items: ["33 chủ đề · 6 cụm", "33 cụm bổ sung", "bắc cầu chủ đề"] },
          { label: "Viết", items: ["outweigh = CÂN", "bảng: so dọc + tự tính", "2 câu hỏi: CHỌN"] },
          { label: "Nghe", items: ["chuỗi số → kết quả", "phủ định kép = khẳng định", "6 nhãn lỗi"] },
          { label: "Còn nợ", items: ["Reading Đề 10", "Speaking Đề 10", "sổ lỗi"] },
        ],
      },

      { t: "h", text: "I. 33 chủ đề — điền MỘT từ (10 câu) — ôn Bài 1 mục 2–7" },
      {
        t: "quiz",
        id: "t5d16-bt-chu-de",
        kind: "fill",
        title: "Chữ cái đầu cho sẵn",
        items: [
          { q: "1. (Family) Children in a b___ family may live with step-siblings.", answers: ["blended"], hint: "blended family" },
          { q: "2. (Children) H___ parenting leaves young adults unable to cope with setbacks.", answers: ["Helicopter"], hint: "helicopter parenting" },
          { q: "3. (Migration) Net m___ accounted for most of the population growth.", answers: ["migration"], hint: "net migration" },
          { q: "4. (Online learning) Self-p___ courses suit people who work shifts.", answers: ["paced"], hint: "self-paced" },
          { q: "5. (Government) The bridge was financed through a public–private p___.", answers: ["partnership"], hint: "public–private partnership" },
          { q: "6. (Media) Funding by advertisers can compromise a newspaper's editorial i___.", answers: ["independence"], hint: "editorial independence" },
          { q: "7. (Housing) Campaigners oppose any building on the green b___.", answers: ["belt"], hint: "green belt" },
          { q: "8. (Science) Blue-s___ research has no immediate commercial use.", answers: ["sky"], hint: "blue-sky research" },
          { q: "9. (Language) C___-switching is common in bilingual families.", answers: ["Code"], hint: "code-switching" },
          { q: "10. (Charts) Sales grew quickly at first and then t___ off. (quá khứ)", answers: ["tapered"], hint: "tapered off" },
        ],
      },

      { t: "h", text: "II. Bắc cầu chủ đề — chọn từ chính xác (6 câu) — ôn Bài 1 mục 8" },
      {
        t: "mcq",
        id: "t5d16-bt-bac-cau",
        title: "Chọn A, B hoặc C",
        items: [
          { q: "1. (đề về chợ làng đóng cửa) Village markets are one of the few places that still build ___ in rural communities.", options: ["social capital", "carrying capacity", "content moderation"], correct: 0, why: "social capital = vốn xã hội — mượn từ Volunteering & community." },
          { q: "2. (đề về mua sắm trực tuyến) Luxury goods bought to be shown off on social media are a form of ___.", options: ["delayed gratification", "conspicuous consumption", "habitat fragmentation"], correct: 1, why: "conspicuous consumption = tiêu dùng phô trương." },
          { q: "3. (đề về toà án) The court reduced the sentence because of ___.", options: ["mitigating circumstances", "a level playing field", "living memory"], correct: 0, why: "mitigating circumstances = tình tiết giảm nhẹ." },
          { q: "4. (đề về đường cao tốc mới) The road would cut the forest in two, causing ___.", options: ["car dependency", "habitat fragmentation", "a tipping point"], correct: 1, why: "Rừng bị cắt đôi ⇒ habitat fragmentation. car dependency là hệ quả với CON NGƯỜI, không phải với rừng." },
          { q: "5. (đề về chữa bệnh) Patients with low ___ often misunderstand the instructions on their medicine.", options: ["health literacy", "attainment gap", "editorial independence"], correct: 0, why: "health literacy = khả năng hiểu thông tin y tế." },
          { q: "6. (đề về sách) It's a reference book, the sort you ___ rather than read from cover to cover.", options: ["taper off", "make way for", "dip into"], correct: 2, why: "dip into = mở ra đọc từng đoạn." },
        ],
      },

      { t: "h", text: "III. Dịch sang tiếng Anh (4 câu) — ôn Bài 1" },
      {
        t: "quiz",
        id: "t5d16-bt-dich",
        kind: "translate",
        title: "Dùng từ trong ngoặc",
        grammar: "collocation của 33 chủ đề",
        items: [
          { q: "Gió là nguồn năng lượng không liên tục. (intermittent)", answers: ["Wind is an intermittent source of energy.", "Wind is an intermittent energy source.", "Wind power is an intermittent source of energy.", "Wind is an intermittent source of power.", "Wind energy is an intermittent source."], hint: "an intermittent source of energy" },
          { q: "Miễn phí vé giúp bảo tàng dễ tiếp cận hơn với mọi người. (accessible)", answers: ["Free admission makes museums more accessible to everyone.", "Free entry makes museums more accessible to everyone.", "Free admission makes museums more accessible to all.", "Free admission makes museums more accessible to everybody.", "Free entry makes museums more accessible to all."], hint: "make museums more accessible to" },
          { q: "Rừng hoạt động như những bể chứa carbon. (carbon sink)", answers: ["Forests act as carbon sinks.", "Forests act as a carbon sink.", "Forests function as carbon sinks.", "Forests serve as carbon sinks.", "Forests work as carbon sinks.", "Forests act like carbon sinks."], hint: "act as carbon sinks" },
          { q: "Chi phí khởi nghiệp cao là rào cản gia nhập thị trường. (barriers to entry)", answers: ["High start-up costs are barriers to entry.", "High start-up costs act as barriers to entry.", "High start-up costs are a barrier to entry.", "High start-up costs act as a barrier to entry.", "High startup costs are barriers to entry.", "High startup costs act as barriers to entry.", "High startup costs are a barrier to entry.", "High startup costs act as a barrier to entry."], hint: "High start-up costs · barriers to entry" },
        ],
      },

      { t: "h", text: "IV. Câu cân — điền MỘT từ (6 câu) — ôn Bài 2 mục A2 · A3" },
      {
        t: "quiz",
        id: "t5d16-bt-can",
        kind: "fill",
        title: "Hoàn thành câu của bài advantages / disadvantages band 8",
        items: [
          { q: "1. The objections deserve to be taken ___.", answers: ["seriously"], hint: "be taken seriously" },
          { q: "2. It is a one-off cost set ___ a permanent benefit.", answers: ["against"], hint: "set against" },
          { q: "3. The second concern is less persuasive than it ___.", answers: ["sounds", "seems", "appears", "looks"], hint: "than it sounds" },
          { q: "4. The costs fall once; the benefits ___ indefinitely. (động từ: lặp lại)", answers: ["recur", "continue"], hint: "recur indefinitely" },
          { q: "5. The benefits are spread across the whole population, ___ the costs fall on a small group. (liên từ đối lập)", answers: ["whereas", "while", "whilst"], hint: "whereas / while" },
          { q: "6. This drawback, ___ real, can largely be addressed by clear rules. (một từ nhượng bộ)", answers: ["though", "although", "while", "albeit"], hint: "though real — mệnh đề nhượng bộ rút gọn" },
        ],
      },

      { t: "h", text: "V. Bảng nhiều đơn vị — bảng mới (4 câu) — ôn Bài 2 mục B2" },
      { t: "p", text: "Số liệu ==hư cấu== về mạng xe buýt của thị trấn **Wexby**. Đọc bảng trong 1 phút: đánh mũi tên từng hàng và tự tính một tỉ lệ." },
      {
        t: "table",
        caption: "The bus network in Wexby, 2010 and 2024 (số liệu tự đặt)",
        head: ["Measure", "2010", "2024"],
        rows: [
          ["Number of routes", "22", "18"],
          ["Buses in service", "140", "96"],
          ["Passengers per day (thousands)", "61", "64"],
          ["Average single fare (£)", "1.80", "2.60"],
          ["Electric buses (% of fleet)", "0", "45"],
        ],
      },
      {
        t: "mcq",
        id: "t5d16-bt-bang",
        title: "Chọn A, B hoặc C",
        items: [
          { q: "1. Overview nào ở mức band 8?", options: ["Overall, routes and buses decreased, while passengers, fares and electric buses increased.", "Overall, a smaller and partly electrified network was carrying slightly more passengers in 2024, at a noticeably higher fare.", "Overall, there were many changes in the bus network of Wexby between 2010 and 2024."], correct: 1, why: "A đọc lại hướng của năm hàng. C không nói gì. B rút ra điều đáng nói: mạng nhỏ hơn mà chở nhiều hơn, giá cao hơn, một phần chạy điện." },
          { q: "2. Câu nào là phép so sánh KHÔNG hợp lệ?", options: ["The number of buses fell by almost a third.", "There were more buses (96) than passengers (64) in 2024.", "The average fare rose by 80 pence."], correct: 1, why: "96 chiếc xe và 64 NGHÌN hành khách — khác đơn vị, không so ngang được. (140 → 96 là giảm 31%: almost a third đúng.)" },
          { q: "3. Số hành khách mỗi ngày trên MỘT xe buýt thay đổi thế nào? (61.000 ÷ 140 và 64.000 ÷ 96)", options: ["gần như không đổi", "tăng khoảng một nửa", "giảm khoảng một nửa"], correct: 1, why: "61.000 ÷ 140 ≈ 436; 64.000 ÷ 96 ≈ 667 ⇒ tăng khoảng 53%: each bus carried roughly half as many passengers again." },
          { q: "4. Câu nào viết ĐÚNG và đủ đơn vị?", options: ["The fare rose to 2.60.", "Electric buses rose to 45.", "Electric vehicles, absent in 2010, made up 45% of the fleet by 2024."], correct: 2, why: "A thiếu £; B thiếu % of the fleet. C có đơn vị và gói được cả hai năm trong một câu (absent in 2010)." },
        ],
      },

      { t: "h", text: "VI. Nghe — đặt áo cho hackathon: con số bị đổi, phủ định kép (10 câu) — ôn Bài 3 mục 3 · 4" },
      {
        t: "p",
        text: "**Dana** gọi tới một xưởng in áo để đặt áo hoodie cho một cuộc thi lập trình của sinh viên. Đọc câu hỏi trong **30 giây**. Nghe **một lần**. Câu 1–6: **ONE WORD AND/OR A NUMBER**.",
      },
      {
        t: "listen",
        id: "t5d16-bt-nghe",
        title: "Ordering hoodies for a student hackathon",
        dan: { so: "Day 16, Recording 4", boiCanh: "a telephone conversation between a student, Dana, and a member of staff at a company that prints clothing.", cau: [1, 10] },
        note: "Khoảng 1 phút 5 giây, ~180 từ/phút. Niko: giọng New Zealand (nam). Dana: giọng Mỹ (nữ). Tên xưởng và giá là hư cấu.",
        lines: [
          { who: "Niko", voice: "nz-nam", text: "Stitchline Custom Wear, Niko speaking." },
          { who: "Dana", voice: "us-nu", text: "Hi, I'm calling about hoodies for a student hackathon. I emailed a quote request for forty." },
          { who: "Niko", voice: "nz-nam", text: "Got it here. Forty at twenty-six dollars each." },
          { who: "Dana", voice: "us-nu", text: "Right, but we've had more sign-ups since then. We need half as many again." },
          { who: "Niko", voice: "nz-nam", text: "Sixty, then. That helps you, actually. Over fifty, the unit price drops to twenty-two." },
          { who: "Dana", voice: "us-nu", text: "Great. And the logo. Is printing on the back extra?" },
          { who: "Niko", voice: "nz-nam", text: "It's not that we don't charge for it, but at your quantity it's hardly worth mentioning. A dollar fifty per hoodie." },
          { who: "Dana", voice: "us-nu", text: "OK. Colors? We were thinking navy." },
          { who: "Niko", voice: "nz-nam", text: "Navy I'd avoid. It's not unavailable, but there's a three-week wait. Charcoal we've no shortage of." },
          { who: "Dana", voice: "us-nu", text: "Charcoal's fine. When would they arrive? The event's on the eighteenth." },
          { who: "Niko", voice: "nz-nam", text: "Normally ten working days. If you confirm by tomorrow, that's the fourteenth. No, sorry, the fifteenth. The fourteenth's a Sunday." },
          { who: "Dana", voice: "us-nu", text: "That works. And sizes. Do we have to give you those now?" },
          { who: "Niko", voice: "nz-nam", text: "Not now, but we can't start printing without them, so no later than Thursday." },
          { who: "Dana", voice: "us-nu", text: "Understood. Do you need a deposit?" },
          { who: "Niko", voice: "nz-nam", text: "A third up front. I'll email you the invoice. What's the name?" },
          { who: "Dana", voice: "us-nu", text: "Dana Okafor. That's O-K-A-F-O-R." },
        ],
      },
      {
        t: "quiz",
        id: "t5d16-bt-nghe-dien",
        kind: "fill",
        title: "Questions 1–6 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Number of hoodies ordered: ___", answers: ["60", "sixty"], hint: "40 + “half as many again” = 60. Niko xác nhận: “Sixty, then.”" },
          { q: "2. Price per hoodie: $ ___", answers: ["22", "twenty-two", "twenty two"], hint: "26 là giá cho 40 chiếc; “Over fifty, the unit price drops to twenty-two.”" },
          { q: "3. Colour chosen: ___", answers: ["charcoal"], hint: "Navy: “not unavailable, but… a three-week wait” (có nhưng phải chờ). “Charcoal's fine.”" },
          { q: "4. Delivery date: the ___", answers: ["15", "15th", "fifteenth"], hint: "“the fourteenth. No, sorry, the fifteenth.” 18 là ngày sự kiện." },
          { q: "5. Sizes must be sent by: ___", answers: ["Thursday"], hint: "“Not now, but we can't start printing without them, so no later than Thursday.”" },
          { q: "6. Customer's surname: ___", answers: ["Okafor"], hint: "O-K-A-F-O-R." },
        ],
      },
      {
        t: "mcq",
        id: "t5d16-bt-nghe-chon",
        title: "Questions 7–10 — Choose the correct letter, A, B or C",
        items: [
          { q: "7. What does Niko say about printing a logo on the back?", options: ["A It is included in the price.", "B There is a small extra charge.", "C It cannot be done on this order."], correct: 1, why: "“It's not that we don't charge for it” = CÓ tính tiền (loại A); “hardly worth mentioning” = rất nhỏ ⇒ B." },
          { q: "8. How much will the back print add to the whole order?", options: ["A $60", "B $90", "C $150"], correct: 1, why: "1,50 × 60 chiếc = 90. Phải tự tính, và phải dùng số lượng ĐÃ SỬA (60, không phải 40)." },
          { q: "9. Why does Niko advise against navy?", options: ["A It is no longer produced.", "B It would arrive too late.", "C It costs more than other colours."], correct: 1, why: "“not unavailable” = vẫn có (loại A); “a three-week wait” trong khi giao thường mười ngày làm việc và sự kiện ngày 18 ⇒ B. Giá không được nhắc." },
          { q: "10. What must Dana pay before the order is printed?", options: ["A the full amount", "B a third of the total", "C nothing until delivery"], correct: 1, why: "“A third up front.” up front = trả trước." },
        ],
      },
      {
        t: "note",
        title: "📌 Tự chấm và việc ngày mai",
        items: [
          "**I–III dưới 14 / 20** ⇒ mở lại khối “cụm bổ sung” của cụm chủ đề sai nhiều nhất; chơi Match thêm 2 lượt.",
          "**IV–V dưới 7 / 10** ⇒ đọc lại hai bài mẫu band 8 ở Bài 2 (A3 và B2), gạch dưới câu cân và câu có phép tính.",
          "**VI dưới 8 / 10** ⇒ gắn nhãn SỐ / PHỦ cho từng câu sai rồi nghe lại, mở lời thoại.",
          "Ngày mai (Ngày 17): chuỗi lỗi 7 → 8 (mạo từ, số nhiều, giới từ, dấu phẩy) và ==mổ Reading Đề 10==. Hãy chắc là bạn đã làm xong Reading Đề 10 ở Online Test.",
        ],
      },
    ],
  },
];
