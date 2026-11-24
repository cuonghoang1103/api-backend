/**
 * IELTS Tập 5 — Ngày 28 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, đề, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     100 từ band 8 — PHẦN 2 (50 từ, 5 nhóm × 10: động từ lập luận · tính từ đánh giá · danh từ khái niệm · trạng từ
 *                     và cụm điều tiết · từ đời thường cho Speaking) + bẫy dùng sai + 🔊 trọng âm từ dài hay đặt sai     [VA5]
 *                     — nối Tập 5 Ngày 4 (phần 1, 50 từ — `docs/ielts-tap5-phu/100-tu-band8.txt`). ĐÃ đối chiếu: không trùng phần 1,
 *                     không trùng từ nào trong mọi khối `vocab` của Tập 3–5 (grep 3.150+ mục, kể cả Ngày 25–27); tránh danh sách “Ngày
 *                     28 vẫn nên tránh” của phần 1. Danh sách phần 2 ghi nối vào cuối tệp đó.
 *   Bài 2 (writing)   Two-part question band 8 — năm biến thể, trả lời HAI câu hỏi cân nhau, lập trường xuyên suốt cho câu đánh giá;
 *                     bài mẫu band 7 và band 8 cùng đề (chi tiền cho trải nghiệm thay vì đồ vật); quản lý thời gian lần cuối: hai cách
 *                     chia 60 phút, mốc “nếu trễ”, soát 5 phút cho bài thi máy                                       [W07 W18 X04]
 *                     — nối Tập 3 Ngày 22 (hai câu hỏi) · Tập 4 Ngày 28 (phân giờ) · Tập 5 Ngày 10 · 20 · 27 (soát 4 phút)
 *   Bài 3 (listening) Đề Listening đủ 40 câu, mục tiêu 35+: Part 1 hỏi vào câu lạc bộ định hướng (New Zealand + Anh) · Part 2 hướng dẫn
 *                     đi dạo bãi đá lúc triều xuống (Ireland) · Part 3 thí nghiệm nhạc nền khi gỡ lỗi code (Mỹ + Canada + Anh) ·
 *                     Part 4 bồ câu đưa thư tìm đường thế nào (Úc); ~170–180 từ/phút                                  [L16]
 *                     — nối Tập 5 Ngày 8 · 16 · 24 (làm đề) · Ngày 9 · 25 (mổ đề, 2 phút kiểm)
 *   Bài tập Ngày 28   36 câu có đáp án + 1 đoạn Task 2 + 2 câu Part 1/3 ghi âm
 * Mọi id bắt đầu `t5d28-`. Đã grep tap-3…5/ngay + thi-may/de: orienteering, rock pool, background music + debugging, homing pigeon
 * = 0 kết quả; đề Task 2 “experiences vs material possessions” và “young people not learning to drive” chưa dùng.
 * Dữ kiện có thật trong Part 4 (soạn theo trí nhớ, làm mờ chỗ không chắc): thí nghiệm dịch đồng hồ sinh học 6 giờ ⇒ bay lệch ~90°;
 * nam châm gắn trên bồ câu chỉ làm lạc vào ngày trời u ám (thập niên 1970); giả thuyết tế bào chứa sắt ở mỏ — một nghiên cứu năm 2012
 * cho thấy đó là tế bào miễn dịch; nhóm Ý thập niên 1970 với giả thuyết “bản đồ mùi” mang theo gió; giả thuyết hạ âm từ sóng biển
 * (một nhà địa vật lý Mỹ, giải thích một cuộc đua năm 1997 bị mất nhiều chim — bài nói “một máy bay siêu thanh bay qua”, không nêu
 * tên); dữ liệu GPS cho thấy chim gần nhà bám theo đường bộ và đi lại một tuyến riêng. Nhân vật (Fiona, Daniel Harwood, Siobhán,
 * Maya, Tom, Dr Ferris, Dr Paterson) và mọi con số của Part 1–3 là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_28: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d28-tu-vung",
    kind: "vocab",
    title: "Từ vựng: 100 từ band 8 — phần 2 (50 từ tần suất thấp mà đáng giá: lập luận, đánh giá, gọi tên vấn đề, điều tiết mức chắc, kể chuyện đời thường)",
    goal: "Dùng đúng chỗ 50 từ tần suất thấp ở mức band 8 — mười động từ lập luận (corroborate, obviate, forestall…), mười tính từ đánh giá (spurious, myopic, tantamount to…), mười danh từ gọi tên vấn đề (crux, impasse, dearth…), mười trạng từ và cụm điều tiết mức chắc (purportedly, if anything, on the face of it…) và mười từ đời thường cho Speaking (hectic, impromptu, humdrum…) — với đúng collocation, đúng văn phong, đúng trọng âm, và không “nhồi từ” vào nơi một từ thường làm tốt hơn.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **LR 7 → 8**. Band 8 = ==dùng khéo từ ít gặp, có ý thức về văn phong và collocation; hiếm khi chọn sai từ==. Chữ quan trọng là **khéo** — một từ hiếm đặt sai chỗ bị trừ, không được cộng.",
          "Phần 1 (Ngày 4) có 50 từ: exacerbate, tenuous, caveat, ostensibly, daunting… Phần 2 hôm nay thêm **50 từ mới**, cùng năm nhóm, không trùng từ nào đã học trong Tập 3–5.",
          "Năm nhóm × 10: ==động từ lập luận · tính từ đánh giá · danh từ gọi tên vấn đề · trạng từ & cụm điều tiết · từ đời thường cho Speaking==.",
          "Mỗi từ có ba thứ phải học cùng lúc: **collocation** (obviate the need, a dearth of), **văn phong** (pricey chỉ khi nói; purportedly chỉ khi viết) và **bẫy** (belie ≠ believe; supersede không viết -cede).",
          "Liều dùng: ==Task 2 khoảng 3–5 từ của 100 từ; một câu Part 3 tối đa 1–2 từ==. Nhiều hơn thế là “nhồi”, giám khảo nhận ra ngay.",
          "🔊 Tám từ hay bị đặt sai trọng âm (PLE-thora, IM-passe, co-RRO-borate…) — sai trọng âm làm từ hiếm thành từ không ai hiểu.",
        ],
      },
      { t: "h", text: "0. Kiểm tra đầu bài — phần 1 (Ngày 4) còn nhớ không? (6 câu)" },
      { t: "p", text: "Làm trong 3 phút, không mở Ngày 4. Sai từ 2 câu trở lên ⇒ tối nay ôn lại phần 1 bằng thẻ trước khi học phần 2 — học chồng 50 từ mới lên 50 từ chưa vững là cách nhanh nhất để quên cả hai." },
      {
        t: "quiz",
        id: "t5d28-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — 6 từ của phần 1 (chữ đầu cho sẵn)",
        items: [
          { q: "1. Cutting bus services would only e___ the problem of congestion. (làm trầm trọng thêm)", answers: ["exacerbate"], hint: "exacerbate — Ngày 4 nhóm A." },
          { q: "2. The link between the two events is t___ at best. (mỏng manh)", answers: ["tenuous"], hint: "tenuous — Ngày 4 nhóm B." },
          { q: "3. The results are encouraging, with one c___ : the sample was small. (lưu ý, điều kiện kèm theo)", answers: ["caveat"], hint: "caveat — Ngày 4 nhóm C." },
          { q: "4. The rule is o___ about safety, but it mainly protects the company. (bề ngoài là, danh nghĩa là)", answers: ["ostensibly"], hint: "ostensibly — Ngày 4 nhóm D." },
          { q: "5. Moving to a new country on my own was a d___ prospect. (làm nản lòng, đáng sợ)", answers: ["daunting"], hint: "daunting — Ngày 4 nhóm E." },
          { q: "6. Lack of funding should not p___ students from studying abroad. (ngăn cản hoàn toàn)", answers: ["preclude"], hint: "preclude sb from V-ing — Ngày 4 nhóm A." },
        ],
      },
      { t: "rule", formula: "Từ band 8 = từ + collocation + văn phong + bẫy; thiếu một trong bốn thì đừng dùng trong bài thi", vi: "Học từ hiếm là học bốn thứ cùng lúc — biết nghĩa thôi thì mới đi được một phần tư đường." },

      /* ── A ── */
      { t: "h", text: "1. Nhóm A — mười động từ cho lập luận (Task 2, Part 3)" },
      {
        t: "p",
        text: "Động từ là chỗ người band 7 lặp nhiều nhất: **show, cause, stop, replace, prevent, make worse**. Mười động từ dưới đây không thay được hết — chúng ==chính xác hơn về sắc thái==: corroborate là “xác nhận bằng một nguồn ĐỘC LẬP”, forestall là “chặn TRƯỚC khi xảy ra”, obviate là “làm cho KHÔNG CẦN nữa”. Dùng khi đúng sắc thái đó, không dùng để trang trí.",
      },
      {
        t: "vocab",
        items: [
          { w: "corroborate", pos: "v", ipa: "/kəˈrɒbəreɪt/", vi: "xác nhận, chứng thực (bằng một nguồn độc lập)", ex: "Satellite images corroborate the farmers' reports that the lake is shrinking.", exVi: "Ảnh vệ tinh xác nhận lời kể của nông dân rằng hồ đang thu hẹp.", more: "corroborate a claim / an account / evidence · n corroboration · ⚠️ không dùng cho ý kiến của mình: ~~corroborate my opinion~~ → support" },
          { w: "underscore", pos: "v", ipa: "/ˌʌndəˈskɔː(r)/", vi: "nhấn mạnh, làm nổi bật (tầm quan trọng)", ex: "The recent floods underscore the need for better urban drainage.", exVi: "Những trận lụt gần đây cho thấy rõ sự cần thiết của hệ thống thoát nước đô thị tốt hơn.", more: "underscore the need / importance / risk · = underline (nghĩa bóng) · chủ ngữ thường là sự kiện / số liệu, không phải người" },
          { w: "engender", pos: "v", ipa: "/ɪnˈdʒendə(r)/", vi: "làm nảy sinh, gây ra (cảm xúc, thái độ)", ex: "Secrecy about how decisions are made tends to engender suspicion.", exVi: "Giữ bí mật về cách ra quyết định thường làm nảy sinh nghi ngờ.", more: "engender trust / resentment / loyalty / a sense of… · trang trọng; không dùng cho vật chất: ~~engender pollution~~" },
          { w: "supersede", pos: "v", ipa: "/ˌsuːpəˈsiːd/", vi: "thay thế (cái cũ, lỗi thời)", ex: "The 2010 guidelines were superseded by a far stricter set in 2018.", exVi: "Hướng dẫn năm 2010 đã bị thay thế bằng một bộ nghiêm ngặt hơn nhiều vào năm 2018.", more: "thường dùng bị động: be superseded by · ⚠️ chính tả -SEDE (không phải -cede như precede)" },
          { w: "thwart", pos: "v", ipa: "/θwɔːt/", vi: "phá hỏng, cản trở (kế hoạch, ý đồ)", ex: "Bad weather thwarted repeated attempts to reach the summit.", exVi: "Thời tiết xấu đã phá hỏng nhiều lần cố gắng lên tới đỉnh.", more: "thwart a plan / an attempt / sb's ambitions · khác prevent: nhấn ý đồ của ai đó bị PHÁ" },
          { w: "obviate", pos: "v", ipa: "/ˈɒbvieɪt/", vi: "làm cho không còn cần thiết", ex: "Online renewal obviates the need to queue at the passport office.", exVi: "Gia hạn trực tuyến khiến không cần xếp hàng ở phòng hộ chiếu nữa.", more: "gần như luôn đi với **the need (for / to V)** · rất trang trọng — khi nói dùng means you don't have to" },
          { w: "jeopardise", pos: "v", ipa: "/ˈdʒepədaɪz/", vi: "gây nguy hại, đe doạ (an toàn, cơ hội)", ex: "Cutting the maintenance budget could jeopardise passenger safety.", exVi: "Cắt ngân sách bảo trì có thể đe doạ an toàn của hành khách.", more: "jeopardise safety / chances / the future of… · n jeopardy: put sth in jeopardy · Mỹ: jeopardize" },
          { w: "forestall", pos: "v", ipa: "/fɔːˈstɔːl/", vi: "chặn trước, ngăn ngừa từ sớm", ex: "The bank raised interest rates early to forestall a housing bubble.", exVi: "Ngân hàng tăng lãi suất sớm để chặn trước một bong bóng nhà đất.", more: "forestall criticism / a crisis / a strike · khác prevent: nhấn hành động đi TRƯỚC" },
          { w: "belie", pos: "v", ipa: "/bɪˈlaɪ/", vi: "che giấu bản chất / tạo ấn tượng sai về", ex: "The city's modern skyline belies the poverty of its outer districts.", exVi: "Đường chân trời hiện đại của thành phố che giấu sự nghèo khó ở các quận ven.", more: "belie + appearance / reputation / age · ⚠️ không phải believe; chia belies – belied – belying" },
          { w: "encroach", pos: "v", ipa: "/ɪnˈkrəʊtʃ/", vi: "lấn chiếm, xâm lấn (dần dần)", ex: "New housing estates are encroaching on the region's last farmland.", exVi: "Các khu nhà mới đang lấn dần vào đất nông nghiệp cuối cùng của vùng.", more: "encroach ON / UPON land / privacy / free time · n encroachment · ⚠️ luôn có on / upon" },
        ],
      },
      {
        t: "table",
        head: ["Band 7 viết", "Band 8 viết (khi ĐÚNG sắc thái)", "Sắc thái thêm vào"],
        rows: [
          ["The data **support** the claim.", "Independent data **corroborate** the claim.", "nguồn thứ hai, độc lập"],
          ["This **shows** how important it is.", "This **underscores** the need for…", "sự kiện làm nổi bật một nhu cầu"],
          ["…**so** people don't need to queue.", "…which **obviates the need** to queue.", "cái cần thiết bị loại bỏ"],
          ["to **prevent** a crisis", "to **forestall** a crisis", "hành động sớm, chặn trước"],
          ["The new law **replaced** the old one.", "The old law **was superseded by**…", "cái cũ bị đẩy thành lỗi thời"],
        ],
        caption: "Không có sắc thái đó ⇒ dùng từ thường. support / show / prevent vẫn là từ tốt.",
      },
      {
        t: "quiz",
        id: "t5d28-nhom-a",
        kind: "fill",
        title: "Nhóm A — điền động từ đúng dạng (5 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. Without witnesses to c___ his story, the police could not act.", answers: ["corroborate"], hint: "xác nhận bằng nguồn độc lập — corroborate." },
          { q: "2. Automatic translation may o___ the need for human interpreters in simple situations.", answers: ["obviate"], hint: "obviate the need for." },
          { q: "3. Last year's guidelines have now been s___ by new rules.", answers: ["superseded"], hint: "be superseded by — chính tả -sede." },
          { q: "4. Factories continue to e___ on land that was once forest.", answers: ["encroach"], hint: "encroach on — xâm lấn dần." },
          { q: "5. His relaxed manner b___ how nervous he really was.", answers: ["belied"], hint: "belie — quá khứ belied." },
        ],
      },

      /* ── B ── */
      { t: "h", text: "2. Nhóm B — mười tính từ đánh giá (bài viết phản biện, Part 3)" },
      {
        t: "p",
        text: "Tính từ đánh giá cho người đọc biết ==bạn nghĩ gì về một lập luận hoặc một chính sách== mà không cần câu “I think”. Lưu ý: nhiều từ trong nhóm này mang **sắc thái chê mạnh** (spurious, myopic, insidious). Dùng cho một lập luận bạn đã phản bác bằng lý lẽ — không dùng để công kích người khác.",
      },
      {
        t: "vocab",
        items: [
          { w: "burgeoning", pos: "adj", ipa: "/ˈbɜːdʒənɪŋ/", vi: "đang phát triển mạnh, nở rộ", ex: "The city's burgeoning tech sector has pushed up rents in the centre.", exVi: "Ngành công nghệ đang bùng nổ của thành phố đã đẩy giá thuê ở trung tâm lên.", more: "burgeoning demand / industry / population · chỉ đứng TRƯỚC danh từ · động từ burgeon ít dùng" },
          { w: "ephemeral", pos: "adj", ipa: "/ɪˈfemərəl/", vi: "phù du, chóng tàn", ex: "Most online trends are ephemeral, forgotten within a week.", exVi: "Đa số trào lưu trên mạng đều chóng tàn, bị quên trong vòng một tuần.", more: "ephemeral fame / pleasure / art · khi nói tự nhiên hơn: short-lived" },
          { w: "fraught", pos: "adj", ipa: "/frɔːt/", vi: "đầy (khó khăn, rủi ro); căng thẳng", ex: "Any attempt to change the pension system is fraught with political risk.", exVi: "Mọi nỗ lực thay đổi hệ thống lương hưu đều đầy rủi ro chính trị.", more: "fraught WITH danger / difficulty / risk · đứng một mình = căng thẳng: a fraught meeting" },
          { w: "insidious", pos: "adj", ipa: "/ɪnˈsɪdiəs/", vi: "âm thầm mà nguy hại", ex: "Noise pollution is an insidious threat because people stop noticing it.", exVi: "Ô nhiễm tiếng ồn là mối đe doạ âm thầm vì người ta thôi để ý tới nó.", more: "an insidious effect / influence / disease · nhấn: tác hại tích luỹ chậm, khó nhận ra" },
          { w: "myopic", pos: "adj", ipa: "/maɪˈɒpɪk/", vi: "thiển cận (chỉ nhìn ngắn hạn)", ex: "Cutting research funding to balance one year's budget would be myopic.", exVi: "Cắt kinh phí nghiên cứu để cân đối ngân sách một năm là thiển cận.", more: "a myopic policy / view / approach · nghĩa đen: cận thị (n myopia)" },
          { w: "spurious", pos: "adj", ipa: "/ˈspjʊəriəs/", vi: "giả tạo, không có cơ sở", ex: "Ice-cream sales and drownings rise together — a classic spurious correlation.", exVi: "Doanh số kem và số vụ đuối nước cùng tăng — một tương quan giả kinh điển.", more: "a spurious claim / argument / correlation · ≠ wrong: spurious = trông có lý nhưng không có cơ sở thật" },
          { w: "tacit", pos: "adj", ipa: "/ˈtæsɪt/", vi: "ngầm, không nói ra", ex: "There was a tacit agreement among staff not to discuss salaries.", exVi: "Giữa nhân viên có một thoả thuận ngầm là không bàn về lương.", more: "tacit approval / agreement / knowledge · ⚠️ khác tactful (tế nhị)" },
          { w: "tantamount to", pos: "adj", ipa: "/ˈtæntəmaʊnt tə/", vi: "tương đương với (thường là điều xấu)", ex: "Ignoring the warnings would be tantamount to accepting the risk.", exVi: "Phớt lờ các cảnh báo cũng chẳng khác gì chấp nhận rủi ro.", more: "be tantamount to + N / V-ing · chỉ đứng SAU be, không đứng trước danh từ" },
          { w: "indiscriminate", pos: "adj", ipa: "/ˌɪndɪˈskrɪmɪnət/", vi: "bừa bãi, không phân biệt", ex: "The indiscriminate use of antibiotics has made some infections harder to treat.", exVi: "Việc dùng kháng sinh bừa bãi đã khiến một số bệnh nhiễm trùng khó chữa hơn.", more: "indiscriminate use / felling / killing · adv indiscriminately" },
          { w: "contentious", pos: "adj", ipa: "/kənˈtenʃəs/", vi: "gây tranh cãi", ex: "Road pricing remains one of the most contentious issues in city politics.", exVi: "Thu phí đường bộ vẫn là một trong những vấn đề gây tranh cãi nhất của chính trị đô thị.", more: "a contentious issue / decision / claim · ≈ controversial; dùng xen kẽ để khỏi lặp" },
        ],
      },
      {
        t: "quiz",
        id: "t5d28-nhom-b",
        kind: "fill",
        title: "Nhóm B — điền tính từ (5 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. The link between the two trends turned out to be s___ : both were caused by hot weather.", answers: ["spurious"], hint: "tương quan giả — spurious." },
          { q: "2. Refusing to publish the data is t___ to admitting that it is unfavourable.", answers: ["tantamount"], hint: "be tantamount to + V-ing." },
          { q: "3. The negotiations were f___ with difficulty from the start.", answers: ["fraught"], hint: "fraught with difficulty." },
          { q: "4. A policy that ignores the next generation is, frankly, m___ .", answers: ["myopic"], hint: "thiển cận — myopic." },
          { q: "5. Celebrity is often e___ ; few people remember last year's viral stars.", answers: ["ephemeral"], hint: "chóng tàn — ephemeral." },
        ],
      },

      /* ── C ── */
      { t: "h", text: "3. Nhóm C — mười danh từ gọi tên vấn đề" },
      {
        t: "p",
        text: "Danh từ khái niệm cho phép bạn ==tóm cả một tình huống trong một từ== — đó là “danh hoá mức 2” (G41) ở cấp từ vựng. “The crux of the matter is…” thay cho “The most important point that we need to think about is…”. Đây cũng là nhóm dễ dùng trong Part 3 nhất, vì phần lớn có collocation cố định.",
      },
      {
        t: "vocab",
        items: [
          { w: "conundrum", pos: "n", ipa: "/kəˈnʌndrəm/", vi: "bài toán hóc búa, tình thế khó xử", ex: "How to pay for the care of an ageing population is a genuine conundrum.", exVi: "Trả tiền chăm sóc cho một dân số già hoá thế nào là một bài toán hóc búa thật sự.", more: "face / pose / solve a conundrum · nhẹ hơn dilemma (hai lựa chọn đều tệ)" },
          { w: "crux", pos: "n", ipa: "/krʌks/", vi: "mấu chốt, điểm then chốt", ex: "The crux of the matter is not whether to build the road but who pays for it.", exVi: "Mấu chốt của vấn đề không phải có xây đường hay không mà là ai trả tiền.", more: "the crux of the matter / problem / argument · gần như luôn đi với the… of" },
          { w: "impasse", pos: "n", ipa: "/ˈæmpɑːs/", vi: "thế bế tắc", ex: "Talks between the union and management reached an impasse over pay.", exVi: "Đàm phán giữa công đoàn và ban giám đốc rơi vào bế tắc về lương.", more: "reach / break / end an impasse · đọc /ˈæmpɑːs/ hoặc /ˈɪmpɑːs/ — nhấn âm ĐẦU" },
          { w: "juncture", pos: "n", ipa: "/ˈdʒʌŋktʃə(r)/", vi: "thời điểm (quan trọng, then chốt)", ex: "At this juncture, raising taxes would almost certainly slow the recovery.", exVi: "Ở thời điểm này, tăng thuế gần như chắc chắn sẽ làm chậm đà phục hồi.", more: "at this juncture · a critical / crucial juncture · trang trọng" },
          { w: "misnomer", pos: "n", ipa: "/ˌmɪsˈnəʊmə(r)/", vi: "tên gọi sai, gọi không đúng bản chất", ex: "“Free” apps are something of a misnomer: users pay with their data.", exVi: "Gọi là ứng dụng “miễn phí” có phần sai tên: người dùng trả bằng dữ liệu của mình.", more: "be a misnomer / something of a misnomer" },
          { w: "pretext", pos: "n", ipa: "/ˈpriːtekst/", vi: "cái cớ (lý do giả để che lý do thật)", ex: "Security is sometimes used as a pretext for collecting far more data than necessary.", exVi: "An ninh đôi khi được dùng làm cái cớ để thu thập nhiều dữ liệu hơn mức cần.", more: "on / under the pretext of + N / V-ing · a pretext for + N" },
          { w: "dearth", pos: "n", ipa: "/dɜːθ/", vi: "sự khan hiếm, sự thiếu hụt", ex: "Rural areas suffer from a dearth of qualified doctors.", exVi: "Vùng nông thôn thiếu trầm trọng bác sĩ có chuyên môn.", more: "a dearth OF + N · trang trọng ≈ shortage / lack" },
          { w: "plethora", pos: "n", ipa: "/ˈpleθərə/", vi: "sự quá nhiều, vô số", ex: "Consumers now face a plethora of streaming services, each with its own fee.", exVi: "Người tiêu dùng giờ phải đối mặt với vô số dịch vụ xem phim trực tuyến, mỗi cái một khoản phí.", more: "a plethora OF + N (thường hàm ý QUÁ nhiều) · nhấn âm đầu PLE" },
          { w: "backlash", pos: "n", ipa: "/ˈbæklæʃ/", vi: "làn sóng phản ứng dữ dội", ex: "The tax on delivery apps provoked a backlash from small restaurants.", exVi: "Thuế đánh vào ứng dụng giao đồ ăn đã gây ra làn sóng phản đối từ các nhà hàng nhỏ.", more: "provoke / spark / face a backlash · a backlash against + N / from + người" },
          { w: "linchpin", pos: "n", ipa: "/ˈlɪntʃpɪn/", vi: "trụ cột, mắt xích quan trọng nhất", ex: "Teachers are the linchpin of any successful education reform.", exVi: "Giáo viên là trụ cột của bất kỳ cuộc cải cách giáo dục thành công nào.", more: "the linchpin of + N · cũng viết lynchpin" },
        ],
      },
      {
        t: "mcq",
        id: "t5d28-nhom-c",
        title: "Nhóm C — chọn danh từ đúng (5 câu)",
        items: [
          { q: "1. After six months of talks, the two sides had reached an ___ .", options: ["impasse", "crux", "pretext", "plethora"], correct: 0, why: "reach an impasse = rơi vào bế tắc." },
          { q: "2. There is a ___ of affordable childcare in most big cities.", options: ["dearth", "plethora", "backlash", "juncture"], correct: 0, why: "a dearth of = thiếu. plethora là nghĩa ngược." },
          { q: "3. The minister resigned on the ___ of ill health, but few believed it.", options: ["pretext", "misnomer", "conundrum", "linchpin"], correct: 0, why: "on the pretext of = lấy cớ. “few believed it” ⇒ lý do giả." },
          { q: "4. The ___ of the argument is whether the benefits justify the cost.", options: ["crux", "dearth", "impasse", "backlash"], correct: 0, why: "the crux of the argument = mấu chốt." },
          { q: "5. Calling it a “smart” meter is something of a ___ ; it simply records usage.", options: ["misnomer", "pretext", "linchpin", "juncture"], correct: 0, why: "something of a misnomer = tên gọi không đúng bản chất." },
        ],
      },

      /* ── D ── */
      { t: "h", text: "4. Nhóm D — mười trạng từ và cụm điều tiết mức chắc" },
      {
        t: "p",
        text: "Đây là nhóm nối thẳng với **hedging** (Tập 5 Ngày 1) và **nhượng bộ** (Ngày 6 · 13): mỗi từ đặt câu của bạn ở một mức chắc hoặc một tư thế khác nhau. ==purportedly / on the face of it== = giữ khoảng cách với một tuyên bố; ==demonstrably / categorically== = khẳng định mạnh; ==admittedly== = nhượng bộ; ==if anything== = đảo kỳ vọng; ==in effect== = gọi đúng bản chất.",
      },
      {
        t: "vocab",
        items: [
          { w: "conceivably", pos: "adv", ipa: "/kənˈsiːvəbli/", vi: "có thể hình dung được là (khả năng thấp nhưng có)", ex: "The project could conceivably be finished by May, but nobody is counting on it.", exVi: "Dự án có thể hình dung là xong vào tháng Năm, nhưng chẳng ai trông vào điều đó.", more: "could / might conceivably + V · adj conceivable / inconceivable" },
          { w: "demonstrably", pos: "adv", ipa: "/dɪˈmɒnstrəbli/", vi: "một cách chứng minh được, rõ ràng", ex: "The new system is demonstrably safer: accidents have halved.", exVi: "Hệ thống mới an toàn hơn một cách rõ ràng: tai nạn đã giảm một nửa.", more: "demonstrably false / better / effective · chỉ dùng khi có số liệu đi kèm" },
          { w: "purportedly", pos: "adv", ipa: "/pəˈpɔːtɪdli/", vi: "được cho là (người viết nghi ngờ)", ex: "The supplement purportedly improves memory, although trials have found no effect.", exVi: "Thực phẩm bổ sung này được cho là cải thiện trí nhớ, dù các thử nghiệm không thấy tác dụng.", more: "≈ allegedly · động từ purport to be / to V · giữ khoảng cách với lời quảng cáo" },
          { w: "admittedly", pos: "adv", ipa: "/ədˈmɪtɪdli/", vi: "phải thừa nhận rằng", ex: "Admittedly, the scheme is expensive; however, the cost of doing nothing is higher.", exVi: "Phải thừa nhận là chương trình này tốn kém; tuy nhiên, cái giá của việc không làm gì còn cao hơn.", more: "mở câu nhượng bộ trong Task 2: Admittedly, X; however, Y" },
          { w: "unduly", pos: "adv", ipa: "/ʌnˈdjuːli/", vi: "quá mức, thái quá", ex: "Parents should not be unduly worried about a few hours of gaming a week.", exVi: "Cha mẹ không nên lo lắng thái quá về vài giờ chơi game mỗi tuần.", more: "unduly harsh / concerned / optimistic · hay đi với not" },
          { w: "categorically", pos: "adv", ipa: "/ˌkætəˈɡɒrɪkli/", vi: "một cách dứt khoát, tuyệt đối", ex: "The company categorically denied that customer data had been sold.", exVi: "Công ty dứt khoát phủ nhận việc dữ liệu khách hàng đã bị bán.", more: "categorically deny / reject / state · mạnh — dùng khi thuật lời người khác" },
          { w: "by and large", pos: "phr", ipa: "/ˌbaɪ ən ˈlɑːdʒ/", vi: "nhìn chung, nói chung", ex: "By and large, the reforms have achieved what they set out to do.", exVi: "Nhìn chung, các cải cách đã đạt được mục tiêu đề ra.", more: "đầu câu · thân thiện hơn on the whole; hợp cả Nói lẫn Viết" },
          { w: "on the face of it", pos: "phr", ipa: "/ɒn ðə ˈfeɪs əv ɪt/", vi: "thoạt nhìn thì", ex: "On the face of it, a ban seems sensible, but it would be almost impossible to enforce.", exVi: "Thoạt nhìn thì một lệnh cấm có vẻ hợp lý, nhưng gần như không thể thực thi.", more: "hầu như luôn có **but** theo sau — báo trước một phản bác" },
          { w: "if anything", pos: "phr", ipa: "/ɪf ˈeniθɪŋ/", vi: "nếu có (thay đổi) thì ngược lại mới đúng", ex: "The new road did not reduce traffic; if anything, it made it worse.", exVi: "Con đường mới không giảm kẹt xe; nếu có thì nó còn làm tệ hơn.", more: "dùng để ĐẢO kỳ vọng · đứng giữa câu, giữa hai dấu phẩy hoặc sau ;" },
          { w: "in effect", pos: "phr", ipa: "/ɪn ɪˈfekt/", vi: "trên thực tế, về thực chất", ex: "A flat fee for every driver is, in effect, a tax that falls hardest on the poor.", exVi: "Một khoản phí bằng nhau cho mọi tài xế, về thực chất, là một thứ thuế đè nặng nhất lên người nghèo.", more: "⚠️ khác come into / take effect (có hiệu lực) · in effect = thực chất là" },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Nhóm D theo tư thế của người viết",
        cols: [
          { title: "Giữ khoảng cách", items: ["purportedly", "on the face of it", "(nối Ngày 4) ostensibly"] },
          { title: "Khẳng định mạnh", items: ["demonstrably", "categorically", "(nối Ngày 4) unequivocally"] },
          { title: "Nhượng bộ / làm mềm", items: ["admittedly", "by and large", "unduly (không… quá mức)"] },
          { title: "Đảo / gọi đúng bản chất", items: ["if anything", "in effect", "conceivably (khả năng thấp)"] },
        ],
        caption: "Chọn theo tư thế, không theo độ “sang” của từ",
      },
      {
        t: "quiz",
        id: "t5d28-nhom-d",
        kind: "fill",
        title: "Nhóm D — điền MỘT từ để hoàn chỉnh cụm (5 câu)",
        items: [
          { q: "1. The policy did not cut costs; if ___, it increased them.", answers: ["anything"], hint: "if anything — đảo kỳ vọng." },
          { q: "2. On the ___ of it, the offer looks generous, but the small print tells another story.", answers: ["face"], hint: "on the face of it … but." },
          { q: "3. By and ___, students welcomed the change.", answers: ["large"], hint: "by and large = nhìn chung." },
          { q: "4. The cream ___ reduces wrinkles, but there is no independent evidence. (được cho là)", answers: ["purportedly", "allegedly", "supposedly"], hint: "giữ khoảng cách với lời quảng cáo — purportedly." },
          { q: "5. A ban on part-time contracts would, in ___, force many parents out of work.", answers: ["effect"], hint: "in effect = về thực chất." },
        ],
      },

      /* ── E ── */
      { t: "h", text: "5. Nhóm E — mười từ đời thường cho Speaking (Part 1 · Part 2)" },
      {
        t: "p",
        text: "Part 1 và Part 2 cần từ ==tự nhiên, cụ thể, có màu==, không cần từ học thuật. Người band 7 nói “very busy, very exciting, very boring, quite expensive”. Mười từ dưới đây làm đúng việc đó — và mấy từ có nhãn **khi nói** thì đừng mang vào Task 2.",
      },
      {
        t: "vocab",
        items: [
          { w: "hectic", pos: "adj", ipa: "/ˈhektɪk/", vi: "bận rộn tất bật, dồn dập", ex: "Exam week was absolutely hectic — I barely had time to eat.", exVi: "Tuần thi thật sự tất bật — tôi gần như không có thời gian ăn.", more: "a hectic day / schedule / pace of life · đi được với absolutely" },
          { w: "exhilarating", pos: "adj", ipa: "/ɪɡˈzɪləreɪtɪŋ/", vi: "phấn khích tột độ, làm hồ hởi", ex: "Cycling down the mountain at dawn was exhilarating.", exVi: "Đạp xe xuống núi lúc bình minh thật phấn khích.", more: "-ing (gây cảm xúc) / -ed: I felt exhilarated · Part 2 trải nghiệm đáng nhớ" },
          { w: "impromptu", pos: "adj", ipa: "/ɪmˈprɒmptjuː/", vi: "ngẫu hứng, không chuẩn bị trước", ex: "When the power came back on, we had an impromptu party in the corridor.", exVi: "Khi có điện lại, chúng tôi tổ chức một bữa tiệc ngẫu hứng ngay ở hành lang.", more: "an impromptu party / speech / visit / performance" },
          { w: "nostalgic", pos: "adj", ipa: "/nɒˈstældʒɪk/", vi: "hoài niệm, nhớ về quá khứ", ex: "The smell of street food always makes me nostalgic for my hometown.", exVi: "Mùi đồ ăn đường phố luôn khiến tôi nhớ quê.", more: "feel nostalgic FOR / ABOUT · n nostalgia /nɒˈstældʒə/" },
          { w: "frazzled", pos: "adj", ipa: "/ˈfræzld/", vi: "mệt rã rời, căng thẳng (vì quá nhiều việc)", ex: "By the end of exam week I was completely frazzled and slept for twelve hours.", exVi: "Cuối tuần thi tôi mệt rã rời và ngủ liền mười hai tiếng.", more: "feel / look frazzled · frazzled nerves · thân mật — hợp Part 1, Part 2; Task 2 dùng exhausted / under strain" },
          { w: "pricey", pos: "adj", ipa: "/ˈpraɪsi/", vi: "hơi đắt (thân mật)", ex: "The café near campus is a bit pricey, but the coffee's worth it.", exVi: "Quán cà phê gần trường hơi đắt, nhưng cà phê đáng tiền.", more: "**chỉ khi nói** · Task 2 dùng expensive / costly · so sánh pricier, priciest" },
          { w: "stuffy", pos: "adj", ipa: "/ˈstʌfi/", vi: "ngột ngạt (phòng); cổ hủ, cứng nhắc (người)", ex: "The lecture hall gets really stuffy after lunch, so I sit near the window.", exVi: "Giảng đường rất ngột ngạt sau bữa trưa nên tôi ngồi gần cửa sổ.", more: "a stuffy room / office · a stuffy atmosphere (quá trang trọng) · a stuffy nose (nghẹt mũi)" },
          { w: "rickety", pos: "adj", ipa: "/ˈrɪkəti/", vi: "ọp ẹp, lung lay", ex: "We crossed the stream on a rickety wooden bridge that swayed with every step.", exVi: "Chúng tôi qua suối trên một cây cầu gỗ ọp ẹp lắc lư theo từng bước.", more: "a rickety chair / bridge / old bus · Part 2 nơi chốn / chuyến đi" },
          { w: "jaded", pos: "adj", ipa: "/ˈdʒeɪdɪd/", vi: "chán ngấy, mất hứng (vì quá quen / quá nhiều)", ex: "After two years of the same commute, I'd become a bit jaded.", exVi: "Sau hai năm đi cùng một tuyến đường, tôi đã thấy hơi chán ngấy.", more: "feel / become jaded · a jaded palate (ăn mãi hết thấy ngon)" },
          { w: "humdrum", pos: "adj", ipa: "/ˈhʌmdrʌm/", vi: "đơn điệu, tẻ nhạt", ex: "My daily routine is fairly humdrum, to be honest — classes, the gym, and coding.", exVi: "Thật lòng thì nhịp sống hằng ngày của tôi khá tẻ nhạt — lên lớp, tập gym, rồi viết code.", more: "a humdrum job / life / routine · hợp Part 1 (daily routine)" },
        ],
      },
      {
        t: "quiz",
        id: "t5d28-nhom-e",
        kind: "fill",
        title: "Nhóm E — điền tính từ (5 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. We hadn't planned anything — it was a completely i___ trip to the beach.", answers: ["impromptu"], hint: "ngẫu hứng — impromptu." },
          { q: "2. After three deadlines in one day, I felt completely f___ .", answers: ["frazzled"], hint: "mệt rã rời, căng thẳng — frazzled." },
          { q: "3. Looking at old school photos always makes me feel n___ .", answers: ["nostalgic"], hint: "hoài niệm — nostalgic." },
          { q: "4. The room was so s___ that half the class fell asleep.", answers: ["stuffy"], hint: "ngột ngạt — stuffy." },
          { q: "5. December is always h___ at work because of the year-end reports.", answers: ["hectic"], hint: "tất bật — hectic." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Bẫy dùng sai — tám chỗ người học band 7 hay trượt với 50 từ này" },
      {
        t: "table",
        head: ["Từ", "Sai hay gặp", "Đúng"],
        rows: [
          ["belie", "~~I belie that…~~ (nhầm believe)", "Her smile **belied** her nerves."],
          ["supersede", "~~supercede~~", "**supersede** — đuôi -sede"],
          ["tacit", "~~a tacit person~~ (nhầm tactful)", "a **tacit** agreement · a **tactful** person"],
          ["tantamount", "~~a tantamount problem~~", "be **tantamount to** + N / V-ing"],
          ["encroach", "~~encroach the forest~~", "encroach **on / upon** the forest"],
          ["obviate", "~~obviate the problem of~~ (hiếm)", "obviate **the need** for / to V"],
          ["in effect", "~~The law is in effect expensive.~~ (lẫn nghĩa có hiệu lực)", "The fee is, **in effect**, a tax. · The law **came into effect** in May."],
          ["pricey", "~~Housing is pricey in big cities.~~ (Task 2)", "Housing is **prohibitively expensive**… (Task 2) · It's a bit **pricey**. (khi nói)"],
        ],
        caption: "Từ hiếm dùng sai bị trừ nặng hơn từ thường dùng đúng",
      },
      {
        t: "mcq",
        id: "t5d28-bay",
        title: "Bẫy dùng sai — câu nào đúng? (6 câu)",
        items: [
          { q: "1. Which sentence is correct?", options: ["His cheerful tone belied his disappointment.", "I belie that the plan will work.", "His cheerful tone belied to his disappointment.", "His disappointment was belie by his tone."], correct: 0, why: "belie + tân ngữ trực tiếp; không phải believe." },
          { q: "2. Which sentence is correct?", options: ["Not publishing the results would be tantamount to hiding them.", "It is a tantamount mistake.", "Not publishing the results would be tantamount hiding them.", "Not publishing is tantamount with hiding them."], correct: 0, why: "be tantamount TO + V-ing." },
          { q: "3. Which sentence is correct?", options: ["Tourism is encroaching on the island's last wild beaches.", "Tourism is encroaching the island's last wild beaches.", "Tourism is encroaching into the island's last wild beaches of.", "Tourism encroaches at the beaches."], correct: 0, why: "encroach ON / UPON." },
          { q: "4. Which sentence suits a Task 2 essay best?", options: ["Housing in large cities is often prohibitively expensive for young workers.", "Housing in large cities is pretty pricey for young workers.", "Housing in large cities costs a bomb for young workers.", "Housing in large cities is kind of pricey for young workers."], correct: 0, why: "pricey, cost a bomb, kind of = văn nói. Task 2 cần văn phong trung tính – trang trọng." },
          { q: "5. Which sentence uses “if anything” correctly?", options: ["The warnings did not reduce smoking; if anything, they made it seem more attractive.", "If anything the warnings, smoking fell.", "The warnings reduced smoking, if anything greatly.", "If anything, the warnings reduced smoking as expected."], correct: 0, why: "if anything đảo kỳ vọng: không giảm, mà còn ngược lại." },
          { q: "6. Which sentence is correct?", options: ["Digital tickets obviate the need to print anything.", "Digital tickets obviate to print anything.", "Digital tickets obviate people from printing.", "Digital tickets are obviate for printing."], correct: 0, why: "obviate the need (for / to V)." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. 🔊 Phát âm: tám từ band 8 hay bị đặt sai trọng âm" },
      {
        t: "p",
        text: "Từ hiếm có một rủi ro riêng: bạn học nó qua mắt, nên ==trọng âm thường đoán sai==. Giám khảo Speaking không nhìn chính tả; plethora nhấn âm thứ hai nghe như một từ khác. Tám từ dưới đây là những từ người Việt hay nhấn sai nhất trong 50 từ.",
      },
      {
        t: "table",
        head: ["Từ", "Nhấn đúng", "Hay nhấn sai thành"],
        rows: [
          ["plethora", "**PLE**-tho-ra", "ple-THO-ra"],
          ["impasse", "**IM**-pass / **AM**-pass", "im-PASS"],
          ["corroborate", "co-**RRO**-bo-rate", "co-rro-bo-RATE"],
          ["juncture", "**JUNC**-ture", "junc-TURE"],
          ["misnomer", "mis-**NO**-mer", "MIS-no-mer"],
          ["purportedly", "pur-**POR**-ted-ly", "PUR-por-ted-ly"],
          ["indiscriminate", "in-dis-**CRI**-mi-nate", "in-dis-cri-mi-NATE"],
          ["exhilarating", "ex-**HI**-la-ra-ting", "ex-hi-la-RA-ting"],
        ],
        caption: "Âm in hoa đậm là âm mang trọng âm; các nguyên âm không nhấn yếu đi thành /ə/",
      },
      {
        t: "phatam",
        id: "t5d28-phat-am",
        title: "Luyện phát âm — tám từ band 8 hay đặt sai trọng âm (plethora, impasse, corroborate…)",
        note: "Đọc từng câu hai lần: lần một dừng một nhịp trước từ band 8 và nhấn rõ âm in hoa trong bảng; lần hai đọc liền ở tốc độ nói. Máy chấm từng âm — chú ý nguyên âm KHÔNG nhấn phải yếu đi thành /ə/.",
        items: [
          { text: "There is a plethora of options.", ipa: "ðeər ɪz ə pleθərə əv ɒpʃnz", vi: "Có vô số lựa chọn. (PLE-thora)" },
          { text: "The talks reached an impasse.", ipa: "ðə tɔːks riːtʃt ən æmpɑːs", vi: "Đàm phán rơi vào bế tắc. (IM-pass / AM-pass)" },
          { text: "Two witnesses corroborate her story.", ipa: "tuː wɪtnəsɪz kərɒbəreɪt hə stɔːri", vi: "Hai nhân chứng xác nhận lời kể của cô ấy. (co-RRO-borate)" },
          { text: "At this juncture, we should wait.", ipa: "ət ðɪs dʒʌŋktʃə wiː ʃʊd weɪt", vi: "Vào thời điểm này, chúng ta nên chờ. (JUNC-ture)" },
          { text: "The name is a misnomer.", ipa: "ðə neɪm ɪz ə mɪsnəʊmə", vi: "Cái tên ấy là tên gọi sai. (mis-NO-mer)" },
          { text: "The pill purportedly helps you sleep.", ipa: "ðə pɪl pəpɔːtɪdli helps juː sliːp", vi: "Viên thuốc được cho là giúp bạn ngủ. (pur-POR-tedly)" },
          { text: "The indiscriminate use of pesticides harms bees.", ipa: "ðiː ɪndɪskrɪmɪnət juːs əv pestɪsaɪdz hɑːmz biːz", vi: "Dùng thuốc trừ sâu bừa bãi gây hại cho ong. (indis-CRI-minate)" },
          { text: "The ride was absolutely exhilarating.", ipa: "ðə raɪd wəz æbsəluːtli ɪɡzɪləreɪtɪŋ", vi: "Chuyến đi thật sự phấn khích. (ex-HI-larating)" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Dùng ngay: câu Task 2 và Part 3 với từ hôm nay" },
      {
        t: "examples",
        items: [
          { en: "On the face of it, banning cars from the city centre seems sensible; the crux of the matter, however, is what replaces them.", vi: "Thoạt nhìn thì cấm ô tô khỏi trung tâm có vẻ hợp lý; tuy nhiên, mấu chốt là cái gì sẽ thay thế chúng." },
          { en: "Admittedly, a sugar tax is unpopular, but the backlash it provokes is usually ephemeral.", vi: "Phải thừa nhận thuế đường không được lòng dân, nhưng làn sóng phản đối mà nó gây ra thường chóng tàn." },
          { en: "Cutting the training budget to save money this year would be myopic, and would jeopardise the quality of care for years to come.", vi: "Cắt ngân sách đào tạo để tiết kiệm năm nay là thiển cận, và sẽ đe doạ chất lượng chăm sóc trong nhiều năm tới." },
          { en: "There is a dearth of independent evidence to corroborate the company's claims.", vi: "Thiếu hẳn bằng chứng độc lập để xác nhận những tuyên bố của công ty." },
          { en: "(Part 1) To be honest, my weekdays are fairly humdrum, so the weekends tend to be a bit more impromptu.", vi: "(Part 1) Thật lòng thì các ngày trong tuần của tôi khá tẻ nhạt, nên cuối tuần thường ngẫu hứng hơn một chút." },
        ],
      },
      {
        t: "quiz",
        id: "t5d28-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (5 câu)",
        grammar: "Mỗi câu một từ band 8 — đúng collocation, đúng văn phong",
        items: [
          { q: "1. Ứng dụng ngân hàng trực tuyến khiến không còn cần phải đến chi nhánh.", answers: ["Online banking apps obviate the need to visit a branch.", "Online banking apps obviate the need for branch visits.", "Mobile banking apps have obviated the need to go to a branch."], hint: "obviate the need to V / for N." },
          { q: "2. Về thực chất, khoản phí này là một thứ thuế đánh vào người thuê nhà.", answers: ["In effect, this fee is a tax on tenants.", "This fee is, in effect, a tax on renters.", "In effect, the charge is a tax on tenants."], hint: "in effect · a tax on + N." },
          { q: "3. Mấu chốt của vấn đề là ai sẽ trả tiền cho việc chăm sóc người già.", answers: ["The crux of the matter is who will pay for the care of the elderly.", "The crux of the problem is who will pay for elderly care.", "The crux of the matter is who pays for the care of older people."], hint: "the crux of the matter is + wh-clause." },
          { q: "4. Việc dùng nhựa bừa bãi đã làm ô nhiễm nhiều con sông.", answers: ["The indiscriminate use of plastic has polluted many rivers.", "Indiscriminate use of plastics has polluted many rivers.", "The indiscriminate use of plastic has contaminated many rivers."], hint: "the indiscriminate use of + N." },
          { q: "5. Chính sách này không làm giảm giá nhà; nếu có thì nó còn đẩy giá lên.", answers: ["The policy did not reduce house prices; if anything, it pushed them up.", "This policy has not lowered house prices; if anything, it has driven them up.", "The policy failed to reduce house prices; if anything, it pushed them higher."], hint: "; if anything, + vế ngược kỳ vọng." },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học 100 từ trong ba ngày cuối — và mang được vào phòng thi",
        items: [
          "Mỗi từ một thẻ: mặt trước **câu ví dụ có chỗ trống** (There is a ___ of qualified doctors), mặt sau từ + collocation. Đừng học từ đứng một mình.",
          "Chia 100 từ thành hai chồng: **chồng Viết** (nhóm A–D) và **chồng Nói** (nhóm E của cả hai phần + by and large, admittedly, on the face of it, if anything). Ngày 30 giám khảo AI 14 phút: cố ý dùng 3 từ chồng Nói.",
          "Bài viết lại Ngày 30: thay đúng 3 từ thường bằng từ band 8 — chỉ ở chỗ sắc thái khớp (bảng mục 1). Ba là đủ; năm là bắt đầu nhồi.",
          "Đích “nhớ sau 7 ngày ≥ 90 %” (Ngày 30): tối nay ôn 50 từ phần 2, ngày mai ôn phần 1, ngày kia trộn cả hai.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d28-viet",
    kind: "writing",
    title: "Viết Task 2: Two-part question band 8 — hai câu hỏi, hai nửa cân nhau, một lập trường xuyên suốt (bài mẫu band 7 và band 8 cùng đề “chi tiền cho trải nghiệm”) + quản lý thời gian lần cuối",
    goal: "Viết trọn một bài two-part question 290–330 từ ở mức TR 8: nhận ra đúng biến thể của đề, trả lời HAI câu hỏi với độ sâu ngang nhau, giữ một lập trường rõ cho câu hỏi đánh giá từ mở bài đến kết bài, và nối hai nửa bằng một ý chung — đồng thời chốt cách chia 60 phút của riêng mình (hai phương án, mốc “nếu trễ”, 5 phút soát trên máy) để bước vào phòng thi không còn phải nghĩ về đồng hồ.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **TR 7 → 8**. Band 8 Task 2 = ==trả lời ĐỦ mọi phần của đề; lập trường rõ, ý phát triển và được chống đỡ tốt==. Với đề hai câu hỏi, lỗi số một của band 7 là **một nửa dày, một nửa mỏng**.",
          "Năm biến thể của two-part (Tập 3 Ngày 22 đã nhập): why + positive/negative · why + what can be done · what + how · problem + who should solve · hai câu hỏi trực tiếp không liên quan rõ.",
          "Band 8 thêm ba thứ: ==hai nửa cân nhau== (mỗi nửa một thân bài, 110–140 từ) · **lập trường cho câu đánh giá** nêu ngay mở bài · **một sợi chỉ** nối câu 1 với câu 2 (nguyên nhân bạn nêu ảnh hưởng tới cách bạn đánh giá).",
          "Bài mẫu band 7 và band 8 cùng một đề (chi tiền cho trải nghiệm thay vì đồ vật) + bảng 4 tiêu chí.",
          "**Quản lý thời gian lần cuối** (nối Tập 4 Ngày 28): hai cách chia 60 phút, mốc “nếu trễ”, soát 5 phút cho bài thi trên máy — chọn MỘT cách bằng số liệu của chính bạn ở Đề 9–11.",
          "Dùng 3–5 từ của Bài 1 (admittedly, on the face of it, in effect, if anything…) — đúng chỗ sắc thái.",
        ],
      },
      { t: "h", text: "1. Năm biến thể two-part — mỗi biến thể một bẫy" },
      {
        t: "table",
        head: ["Biến thể", "Ví dụ câu hỏi", "Thân bài 1 / Thân bài 2", "Bẫy band 7"],
        rows: [
          ["① Why + positive / negative", "Why is this happening? Is it a positive or negative development?", "nguyên nhân (2, có cơ chế) / đánh giá có lập trường", "đánh giá kiểu “cả hai mặt” mà không chốt bên nào nặng hơn"],
          ["② Why + what can be done", "Why…? What can be done to…?", "nguyên nhân / giải pháp khớp ĐÚNG nguyên nhân", "giải pháp chung chung không gắn nguyên nhân nào (Ngày 20)"],
          ["③ What + how", "What are the benefits of…? How can… be encouraged?", "lợi ích / cách khuyến khích", "kể lợi ích dài, phần “how” còn hai câu"],
          ["④ Problem + who should solve", "What problems…? Who should be responsible…?", "vấn đề / chủ thể + lý do chọn chủ thể", "trả lời “everyone should” — không chọn"],
          ["⑤ Hai câu hỏi trực tiếp", "What makes a good neighbour? Are neighbours less important today?", "định nghĩa có tiêu chí / so sánh có lập trường", "coi đây là đề Discussion, bỏ mất một câu hỏi"],
        ],
        caption: "Đếm dấu “?” trong đề trước khi làm gì khác — hai dấu hỏi = hai nhiệm vụ ngang nhau",
      },
      {
        t: "note",
        title: "📌 Ba điều band 8 làm ở mọi biến thể",
        items: [
          "**Mở bài trả lời cả hai câu** trong một – hai câu: nêu nguyên nhân chính VÀ lập trường. Giám khảo đọc mở bài là biết bạn đã thấy hai nhiệm vụ.",
          "**Hai nửa cân nhau**: thân bài 1 và thân bài 2 chênh nhau không quá ~30 từ. Một nửa 200 từ, nửa kia 60 từ là dấu hiệu TR 6–7.",
          "**Sợi chỉ nối hai nửa**: nguyên nhân bạn chọn ở câu 1 làm thay đổi câu trả lời ở câu 2 (nếu nguyên nhân là kinh tế, thì đánh giá phải tính tới điều đó).",
        ],
      },

      { t: "h", text: "2. Band 7 và band 8 — năm chỗ khác nhau ở đề hai câu hỏi" },
      {
        t: "table",
        head: ["", "Band 7 (ước tính)", "Band 8 (ước tính)"],
        rows: [
          ["Mở bài", "This essay will explain the reasons and give my opinion.", "nêu sẵn nguyên nhân chính + lập trường có giới hạn trong 2 câu"],
          ["Câu hỏi 1 (why)", "liệt kê 3 nguyên nhân, mỗi cái một câu", "2 nguyên nhân, cái thứ hai SÂU hơn cái thứ nhất (bề mặt → cấu trúc)"],
          ["Câu hỏi 2 (đánh giá)", "kể lợi ích rồi thêm một câu “However…”", "chốt bên nặng hơn, nêu VÌ SAO nặng hơn, và một rủi ro có điều kiện"],
          ["Liên kết hai nửa", "không có — hai bài nhỏ đặt cạnh nhau", "đánh giá dùng lại nguyên nhân: If, as I suggested, …"],
          ["Kết bài", "nhắc lại mở bài", "một câu chốt mới về ý nghĩa: what it has replaced"],
        ],
      },
      { t: "rule", formula: "Đếm “?” → mở bài trả lời cả hai → thân 1 = câu 1, thân 2 = câu 2 (cân nhau) → thân 2 dùng lại ý thân 1 → kết bằng một câu ý nghĩa", vi: "Năm bước cho mọi biến thể two-part." },

      { t: "h", text: "3. Đề hôm nay — đếm nhiệm vụ trước khi đọc bài mẫu" },
      {
        t: "p",
        text: "**These days, many people prefer to spend their money on experiences, such as travel, concerts and eating out, rather than on material possessions. Why is this happening? Is this a positive or negative development?**",
      },
      {
        t: "table",
        head: ["Chữ trong đề", "Nhiệm vụ", "Chỗ trong bài"],
        rows: [
          ["these days … prefer … rather than", "đây là một XU HƯỚNG ⇒ nguyên nhân phải là thứ đã THAY ĐỔI gần đây", "thân bài 1"],
          ["Why is this happening?", "câu hỏi 1 — 2 nguyên nhân có cơ chế", "thân bài 1 (~120 từ)"],
          ["Is this a positive or negative development?", "câu hỏi 2 — lập trường + vì sao + rủi ro", "thân bài 2 (~130 từ)"],
          ["experiences … material possessions", "so sánh ngầm: đánh giá phải nói vì sao trải nghiệm TỐT / XẤU HƠN đồ vật, không chỉ “trải nghiệm tốt”", "thân bài 2"],
        ],
        caption: "Bốn nhiệm vụ, hai câu hỏi",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Bốn phút trước khi viết",
        steps: [
          { label: "Đếm “?” và gạch chân chữ xu hướng", sub: "30 giây" },
          { label: "Hai nguyên nhân: một bề mặt, một cấu trúc", sub: "1 phút · mạng xã hội → nhà ở không mua nổi" },
          { label: "Lập trường + vì sao + một rủi ro", sub: "1 phút · tích cực, NHƯNG có thể là dấu hiệu bất an" },
          { label: "Sợi chỉ: rủi ro dùng lại nguyên nhân cấu trúc", sub: "1 phút" },
          { label: "Chọn 3 từ Bài 1 sẽ dùng", sub: "30 giây · admittedly · in effect · on the face of it" },
        ],
        caption: "Dàn ý 4 phút là thứ cứu TR khi đồng hồ ép",
      },

      { t: "h", text: "4. Hai bài mẫu cùng đề — band 7 và band 8 đặt cạnh nhau" },
      { t: "p", text: "Đọc bài band 7 trước, tự gạch chân: (a) nửa nào mỏng hơn, (b) chỗ nào là liệt kê, (c) hai lỗi ngữ pháp. Rồi mới đọc bài band 8." },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 255 từ",
        paras: [
          { text: "Nowadays, more and more people choose to spend their money on experiences like travelling and concerts instead of buying things. This essay will explain the reasons for this trend, and I believe it is a positive development." },
          { text: "There are several reasons why people prefer experiences. Firstly, social media plays an important role. People like to post photos of their trips and meals online, so experiences help them to show their life to others. Secondly, many young people live in small apartments and they do not have enough space for many possessions. Thirdly, travel has become cheaper than before because of low-cost airlines and online booking. In addition, people are more aware about environmental problems, so they want to buy less things." },
          { text: "In my opinion, this trend is mostly positive. Experiences can make people happier than possessions because they create memories which last for a long time. For example, a trip with friends can be remembered for many years, while a new phone becomes old after a short time. Moreover, spending on experiences supports local businesses such as restaurants and tour companies, which is good for the economy. However, some people spend too much money on travel and they do not save for the future, which can cause financial problems later in life." },
          { text: "In conclusion, people spend more on experiences because of social media, small homes and environmental awareness. I think this is a positive development because it makes people happier and helps the economy, although people should be careful not to spend too much money." },
        ],
      },
      { t: "p", text: "Bây giờ bài band 8 — cùng đề, cùng số ý chính, khác ở **độ sâu, độ cân và sợi chỉ nối**." },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 326 từ",
        paras: [
          { text: "In many countries, spending on travel, live events and dining out has grown faster than spending on goods, particularly among younger adults. I would argue that this shift is driven as much by economic constraint as by changing values, and that, while it is largely positive, it carries a risk that is easy to overlook." },
          { text: "The most frequently cited explanation is social media, and it is true that an experience is far easier to display online than, say, a new washing machine. On its own, however, this explanation misses a more structural cause. For many people under forty, the traditional large purchases — a home, and the furniture and appliances that fill it — have moved out of reach, particularly in cities where rent absorbs a large share of income. When the biggest possessions are unaffordable, smaller and more frequent experiences become the obvious outlet for whatever money is left. Admittedly, environmental concern plays a part as well, although it sits uneasily with the popularity of flying." },
          { text: "On balance, I believe the development is a positive one. There is reasonable evidence that people derive more lasting satisfaction from experiences than from objects, partly because memories, unlike goods, do not become obsolete and are usually shared with others. Spending on restaurants, concerts and local tourism also tends to support labour-intensive businesses, so more of the money stays in the local economy. The danger lies elsewhere. If, as I have suggested, experiences are partly a substitute for assets that people cannot afford, then they may also be a symptom of declining long-term security: a holiday, unlike a home, leaves nothing to fall back on. In effect, a generation may be enjoying its income precisely because it has given up hope of investing it." },
          { text: "In short, the preference for experiences reflects both new priorities and narrowed options. It is a healthy change in itself, but it would be a mistake to celebrate it without asking what it has replaced." },
        ],
      },

      { t: "h", text: "5. Khác nhau ở đâu? — bốn tiêu chí" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["TR", "trả lời đủ hai câu, nhưng câu 1 là danh sách bốn lý do mỏng; đánh giá “mostly positive” + một câu However treo", "mở bài trả lời cả hai; nguyên nhân cấu trúc (nhà không mua nổi) đi sâu; lập trường chốt rõ; rủi ro DÙNG LẠI nguyên nhân (If, as I have suggested…)"],
          ["CC", "Firstly · Secondly · In addition · Moreover · However — từ nối lộ khung", "On its own, however · On balance · The danger lies elsewhere · In effect — chuyển ý bằng nội dung; hai thân bài 112 / 124 từ (cân nhau)"],
          ["LR", "show their life · buy less things · aware about", "an outlet for · absorbs a large share of income · sits uneasily with · derive lasting satisfaction · obsolete · labour-intensive · fall back on"],
          ["GRA", "hai lỗi (aware about → of · less things → fewer) · câu đơn nối bằng so", "câu phức đa dạng: When…, … · If, as I have suggested, … then … · unlike a home, … — không lỗi"],
        ],
        caption: "Độ dài không phải lý do bài band 8 hơn điểm — bài band 7 thêm 70 từ liệt kê vẫn là band 7",
      },
      {
        t: "note",
        title: "📌 Đếm trong bài band 8",
        items: [
          "Mở bài: **một câu** bối cảnh có số liệu ngầm (grown faster than) + **một câu** trả lời cả hai câu hỏi (driven as much by… as by… · largely positive · a risk).",
          "Thân bài 1: bề mặt (social media) → “On its own, however” → cấu trúc (nhà ở) → nhượng bộ ngắn (Admittedly…). Hai nguyên nhân, một nhượng bộ — không phải ba lý do ngang nhau.",
          "Thân bài 2: lập trường → hai lý do có cơ chế → **The danger lies elsewhere** → rủi ro nối về thân bài 1 → câu In effect gọi đúng bản chất.",
          "Ba từ của Bài 1 hôm nay: admittedly · in effect · (outlet, obsolete là từ thường của band 8). Không có từ nào “nhồi”.",
        ],
      },

      { t: "h", text: "6. Sáu khung câu cho đề hai câu hỏi" },
      {
        t: "patterns",
        rows: [
          { formula: "S is driven as much by + N as by + N, and while it is largely + adj, it carries + N", vi: "Mở bài trả lời cả hai câu trong một câu.", examples: [{ en: "This trend is driven as much by cost as by choice, and while it is largely beneficial, it carries risks that are easy to overlook.", vi: "Xu hướng này đến từ chi phí nhiều ngang với lựa chọn, và dù phần lớn có lợi, nó mang những rủi ro dễ bị bỏ qua." }] },
          { formula: "The most frequently cited explanation is + N … On its own, however, this misses + N", vi: "Thân bài 1: nguyên nhân bề mặt → nguyên nhân sâu.", examples: [{ en: "The most frequently cited explanation is convenience. On its own, however, this misses a more structural cause.", vi: "Cách giải thích hay được nêu nhất là sự tiện lợi. Tuy nhiên, đứng một mình, nó bỏ sót một nguyên nhân mang tính cấu trúc hơn." }] },
          { formula: "On balance, I believe … There is reasonable evidence that S + V", vi: "Thân bài 2: lập trường + bằng chứng có rào đón.", examples: [{ en: "On balance, I believe the change is positive. There is reasonable evidence that people who cycle to work are healthier.", vi: "Nhìn chung, tôi tin thay đổi này là tích cực. Có bằng chứng khá vững rằng người đạp xe đi làm khoẻ hơn." }] },
          { formula: "The danger lies elsewhere. If, as I have suggested, S + V, then S may + V", vi: "Sợi chỉ: rủi ro dùng lại nguyên nhân của thân bài 1.", examples: [{ en: "The danger lies elsewhere. If, as I have suggested, people rent because they cannot buy, then renting may also be a sign of insecurity.", vi: "Mối nguy nằm ở chỗ khác. Nếu như tôi đã gợi ý, người ta thuê vì không mua nổi, thì việc thuê nhà cũng có thể là dấu hiệu của sự bất an." }] },
          { formula: "Admittedly, + clause, although + clause", vi: "Nhượng bộ ngắn trong thân bài, không phá lập luận chính.", examples: [{ en: "Admittedly, environmental concern plays a part, although it sits uneasily with the popularity of flying.", vi: "Phải thừa nhận mối lo môi trường có góp phần, dù nó khó dung hoà với sự ưa chuộng đi máy bay." }] },
          { formula: "It is + adj in itself, but it would be a mistake to + V without asking + wh-clause", vi: "Kết bài có ý nghĩa, không nhắc lại mở bài.", examples: [{ en: "It is a welcome change in itself, but it would be a mistake to celebrate it without asking who has been left out.", vi: "Tự thân đó là một thay đổi đáng hoan nghênh, nhưng sẽ là sai lầm nếu ăn mừng mà không hỏi ai đã bị bỏ lại." }] },
        ],
      },
      { t: "rule", formula: "Mở: driven as much by… as by… · Thân 1: cited explanation → On its own, however · Thân 2: On balance → The danger lies elsewhere. If, as I have suggested… · Kết: in itself, but…", vi: "Bốn khung, bốn chỗ — đủ cho mọi đề why + positive / negative." },
      {
        t: "quiz",
        id: "t5d28-viet-khung-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — khung câu đề hai câu hỏi (4 câu)",
        grammar: "driven as much by… as by… · On its own, however · If, as I have suggested, … · in itself, but…",
        items: [
          { q: "1. Xu hướng này đến từ áp lực kinh tế nhiều ngang với thay đổi về giá trị sống.", answers: ["This trend is driven as much by economic pressure as by changing values.", "This trend is driven as much by economic pressure as by a change in values.", "The trend is driven as much by financial pressure as by changing values."], hint: "be driven as much by + N as by + N." },
          { q: "2. Tuy nhiên, đứng một mình, cách giải thích này bỏ sót một nguyên nhân sâu xa hơn.", answers: ["On its own, however, this explanation misses a deeper cause.", "On its own, however, this explanation overlooks a deeper cause.", "Taken on its own, however, this explanation misses a more fundamental cause."], hint: "On its own, however, …" },
          { q: "3. Nếu như tôi đã gợi ý, người trẻ thuê nhà vì không mua nổi, thì đây có thể là dấu hiệu của sự bất an lâu dài.", answers: ["If, as I have suggested, young people rent because they cannot afford to buy, then this may be a sign of long-term insecurity.", "If, as I have suggested, young people rent because buying is unaffordable, this may be a symptom of long-term insecurity.", "If, as I have suggested, young people rent because they cannot afford to buy, then this could be a sign of long-term insecurity."], hint: "If, as I have suggested, S + V, then S may + V." },
          { q: "4. Tự thân đó là một thay đổi lành mạnh, nhưng sẽ là sai lầm nếu ăn mừng nó mà không hỏi nó đã thay thế điều gì.", answers: ["It is a healthy change in itself, but it would be a mistake to celebrate it without asking what it has replaced.", "In itself it is a healthy change, but it would be a mistake to celebrate it without asking what it has replaced.", "It is a healthy development in itself, but it would be wrong to celebrate it without asking what it has replaced."], hint: "in itself, but it would be a mistake to V without asking + wh-clause." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Quản lý thời gian lần cuối — chọn MỘT cách chia 60 phút bằng số liệu của chính bạn" },
      {
        t: "p",
        text: "Tập 4 Ngày 28 đã cho bạn khung phân giờ; Đề 9, 10, 11 cho bạn ba lần đo thật. Hôm nay chốt. Có ==hai cách chia hợp lệ== — không có cách nào “đúng cho mọi người”. Hãy chọn theo một câu hỏi: **ở ba đề vừa rồi, bài nào của bạn bị cắt giờ?**",
      },
      {
        t: "table",
        head: ["Mốc", "Cách A — Task 1 trước", "Cách B — Task 2 trước"],
        rows: [
          ["0:00", "Task 1: đọc hình, overview trong đầu (2 phút)", "Task 2: đếm “?”, dàn ý 4 phút"],
          ["0:02 / 0:04", "Task 1: viết 15 phút", "Task 2: viết 30 phút"],
          ["0:17 / 0:34", "Task 1: soát 2 phút ⇒ dừng ở 0:19 dù chưa ưng", "Task 2: soát 4 phút ⇒ dừng ở 0:38"],
          ["0:19 / 0:38", "Task 2: dàn ý 4 phút → viết 30 → soát 5", "Task 1: overview 2 phút → viết 15 → soát 3"],
          ["0:58 – 1:00", "2 phút đệm", "2 phút đệm"],
          ["Hợp với ai", "người hay bị Task 1 “dính” quá 25 phút nếu để sau", "người từng phải kết Task 2 vội, hoặc viết Task 2 chậm"],
        ],
        caption: "Task 2 = 2/3 điểm Writing. Nếu ở Đề 9–11 bạn từng nộp Task 2 thiếu kết bài, chọn cách B",
      },
      {
        t: "table",
        head: ["Nếu trễ…", "Làm ngay", "Đừng làm"],
        rows: [
          ["Task 1 quá 22 phút", "viết một câu overview nếu chưa có, chuyển Task 2", "viết nốt đoạn số liệu cuối"],
          ["Task 2 còn 8 phút mà chưa có thân bài 2", "thân bài 2 rút còn 3 câu: lập trường · một lý do có cơ chế · một rủi ro; kết bài 1 câu", "bỏ kết bài để viết dài thân bài 2"],
          ["Còn 3 phút, bài đủ ý", "soát theo thứ tự 4 phút của Ngày 27 (động từ chính → danh từ → chỗ nối → giả định), chỉ phần đầu", "sửa từ vựng cho “sang” hơn"],
        ],
        caption: "Bài thiếu kết luận bị trừ TR; bài thiếu một từ hay thì không",
      },
      {
        t: "note",
        title: "💡 Soát 5 phút trên máy — bốn thứ riêng của bài thi máy tính",
        items: [
          "**Bộ đếm từ** ở góc màn hình: Task 1 ≥ 150, Task 2 ≥ 250. Đừng nhìn nó trong lúc viết — chỉ nhìn ở mốc soát.",
          "**Không có kiểm tra chính tả tự động.** Lượt soát danh từ (Ngày 27 mục 5) bắt luôn chính tả: accommodation, government, environment, necessary.",
          "**Cắt – dán** được, nhưng dán cả câu từ đề vào bài thì phần đó không được tính điểm. Paraphrase đề ở mở bài.",
          "**Đoạn văn**: để một dòng trống giữa các đoạn — trên máy, thụt đầu dòng dễ mất khi nộp.",
        ],
      },
      { t: "rule", formula: "Chọn A hoặc B bằng dữ liệu Đề 9–11 → giữ mốc dừng cứng → nếu trễ thì cắt ĐỘ DÀI, không cắt CẤU TRÚC", vi: "Đến ngày thi, đồng hồ phải là thói quen — không phải một quyết định." },

      { t: "h", text: "8. Kiểm tra cuối bài (6 câu)" },
      {
        t: "mcq",
        id: "t5d28-viet-kiem",
        title: "Chọn phương án đúng",
        items: [
          { q: "1. “Why do people move abroad to work? What problems might they face?” — Which plan is best?", options: ["Body 1: two causes with mechanisms; Body 2: two problems linked to those causes.", "Body 1: causes and problems; Body 2: solutions.", "Body 1: advantages; Body 2: disadvantages; give an opinion.", "One long body paragraph covering everything."], correct: 0, why: "Hai câu hỏi ⇒ hai thân bài, mỗi thân một câu hỏi; đề không hỏi giải pháp hay ưu–nhược." },
          { q: "2. Which introduction sentence answers both questions of a why + positive/negative essay?", options: ["This trend reflects falling costs as much as changing tastes, and its effects are, on balance, positive.", "This essay will discuss the reasons and the effects of this trend.", "There are many reasons for this trend, which has both positive and negative sides.", "In recent years, this has become a hot topic all over the world."], correct: 0, why: "A nêu nguyên nhân chính VÀ lập trường. B, C né trả lời; D chỉ là bối cảnh sáo." },
          { q: "3. Body 1 has 190 words and Body 2 has 60 words. What is the most likely effect?", options: ["TR is limited because the second question is not fully developed.", "No effect, because the total is over 250 words.", "Only CC is affected.", "It raises LR because more words are used."], correct: 0, why: "Hai nửa lệch ⇒ câu hỏi 2 chưa được phát triển đủ — điểm TR bị giới hạn." },
          { q: "4. Which sentence links Body 2 back to Body 1 most effectively?", options: ["If, as I have suggested, the trend is driven by high rents, then it may also signal insecurity.", "Moreover, there are also some disadvantages.", "On the other hand, some people disagree.", "Another point is that it is negative."], correct: 0, why: "Dùng lại nguyên nhân đã nêu để đánh giá — đó là sợi chỉ nối hai nửa." },
          { q: "5. You chose plan B (Task 2 first). At 0:38 your Task 2 is finished. What do you do?", options: ["Start Task 1 immediately: overview first.", "Re-read Task 2 for another 10 minutes.", "Replace common words in Task 2 with rarer ones.", "Write a longer conclusion for Task 2."], correct: 0, why: "Mốc dừng cứng: 0:38 sang Task 1, overview trước. Soát lại Task 2 chỉ trong 2 phút đệm cuối nếu còn." },
          { q: "6. With 8 minutes left, you have not started Body 2 of Task 2. What is best?", options: ["Write a 3-sentence Body 2 and a 1-sentence conclusion.", "Write a long Body 2 and skip the conclusion.", "Go back and improve Task 1.", "Rewrite the introduction."], correct: 0, why: "Cắt độ dài, không cắt cấu trúc: bài đủ bốn phần với thân 2 ngắn hơn được TR cao hơn bài thiếu kết." },
        ],
      },

      { t: "h", text: "9. Viết bài — AI chấm 4 tiêu chí (40 phút mỗi bài)" },
      {
        t: "note",
        title: "💡 Cách làm: dàn ý 4 phút, rồi viết theo cách chia bạn đã chọn",
        items: [
          "Bấm giờ 40 phút: 4 phút dàn ý theo mục 3 (sơ đồ bốn phút), 30 phút viết, 5 phút soát, 1 phút đệm.",
          "Mở bài trả lời cả hai câu hỏi. Hai thân bài chênh nhau không quá ~30 từ.",
          "Thân bài 2 có một câu “If, as I have suggested, …” dùng lại nguyên nhân của thân bài 1.",
          "Dùng 3 từ của Bài 1 — đúng sắc thái, không nhồi. Soát lượt cuối theo thứ tự 4 phút của Ngày 27.",
        ],
      },
      {
        t: "essay",
        id: "t5d28-viet-bai",
        task: "Task 2",
        prompt: "These days, many people prefer to spend their money on experiences, such as travel, concerts and eating out, rather than on material possessions. Why is this happening? Is this a positive or negative development? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Viết bài CỦA BẠN — đừng chép bài mẫu. Muốn khác: chọn nguyên nhân cấu trúc khác (thu nhập linh hoạt của gig work, đô thị hoá, chi phí lưu trữ đồ đạc) hoặc lập trường ngược (tiêu cực vì tiêu dùng trải nghiệm tốn tài nguyên hơn ta nghĩ).",
          "Biến thể ①: thân bài 1 = why (2 nguyên nhân, một sâu hơn); thân bài 2 = đánh giá có lập trường + một rủi ro.",
          "Từ Bài 1 dùng được: admittedly · on the face of it · in effect · if anything · ephemeral · burgeoning.",
        ],
      },
      {
        t: "essay",
        id: "t5d28-viet-bai-2",
        task: "Task 2",
        prompt: "(Luyện thêm — biến thể why + effects) In some countries, a growing number of young people are choosing not to learn to drive. Why is this happening? What effects might this have on cities in the future? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Chữ “growing number” = xu hướng ⇒ nguyên nhân là thứ đã thay đổi: chi phí bảo hiểm và học lái, ứng dụng gọi xe, sống ở trung tâm, đổi ý niệm về ô tô như biểu tượng trưởng thành.",
          "Câu 2 hỏi tác động lên THÀNH PHỐ (không phải lên người trẻ): giao thông công cộng, bãi đỗ xe, quy hoạch, dịch vụ giao hàng. Dự đoán phải có điều kiện và mức chắc (is likely to / could conceivably).",
          "Sợi chỉ: nếu nguyên nhân chính là chi phí chứ không phải lựa chọn, tác động có thể đảo chiều khi thu nhập tăng — nói được điều này là TR 8.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d28-nghe",
    kind: "listening",
    title: "Nghe: Đề Listening đủ 40 câu — mục tiêu 35+ (Part 1 câu lạc bộ định hướng · Part 2 đi dạo bãi đá lúc triều xuống · Part 3 thí nghiệm nhạc nền khi gỡ lỗi code · Part 4 bồ câu đưa thư tìm đường)",
    goal: "Làm trọn một đề Listening 40 câu ở tốc độ thật (~170–180 từ/phút), năm giọng (New Zealand, Anh, Ireland, Mỹ, Canada, Úc), tám dạng câu (form · MCQ · matching · Choose TWO · notes), nghe MỘT lần, đạt ít nhất 35/40 (≈ band 8.0); rồi dùng 2 phút kiểm của Ngày 25 và bảng bẫy để biết câu nào mất vì tai, câu nào mất vì chép.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Đề nghe đủ 40 câu cuối cùng trước Đề 12 “Final” (Ngày 30). Mục tiêu của tập: ==Listening ≥ 35/40==.",
          "Bốn phần, bốn đề tài mới: hỏi vào **câu lạc bộ định hướng** (Part 1) · **đi dạo bãi đá** lúc triều xuống (Part 2) · **nhạc nền khi gỡ lỗi code** (Part 3) · **bồ câu đưa thư** tìm đường (Part 4).",
          "Tám dạng: form · MCQ ba lựa chọn · matching địa điểm · MCQ bốn lựa chọn · Choose TWO · matching nguồn tài liệu · notes ONE WORD ONLY.",
          "Bẫy band 8 của đề: ==sửa thông tin giữa câu== (individual → joint, Tuesday → Wednesday) · **phương án được nhắc rồi bị gạt** (wetsuit, supermarket, graph) · **chi tiết đúng của một chỗ KHÁC** (hải cẩu ở bãi đá cũ) · **giả thuyết bị bác** (tế bào ở mỏ).",
          "Nghe MỘT lần, không dừng, như phòng thi trên máy: đọc trước câu hỏi trong thời gian được ghi ở mỗi phần.",
          "Sau khi chấm: 2 phút kiểm (Ngày 25) + nhãn A–E (Ngày 9) cho từng câu sai.",
        ],
      },
      { t: "h", text: "1. Kế hoạch đề — bốn phần, bốn giọng, đọc trước bao lâu" },
      {
        t: "table",
        head: ["Part", "Câu", "Dạng", "Giọng", "Đọc trước"],
        rows: [
          ["1", "1–10", "Form completion — ONE WORD AND/OR A NUMBER", "New Zealand (nữ) + Anh (nam)", "40 giây"],
          ["2", "11–20", "MCQ (11–15) + Matching địa điểm (16–20)", "Ireland (nữ)", "60 giây"],
          ["3", "21–30", "MCQ (21–24) + Choose TWO (25–26) + Matching nguồn (27–30)", "Mỹ (nữ) + Canada (nam) + Anh (nữ)", "60 giây"],
          ["4", "31–40", "Notes — ONE WORD ONLY", "Úc (nam)", "45 giây"],
        ],
        caption: "Bài thi máy: hết bài có 2 phút soát (không có 10 phút chép như bài thi giấy)",
      },
      {
        t: "note",
        title: "💡 Ba việc trong lúc đọc trước — lần cuối nhắc lại",
        items: [
          "**Form / notes:** đoán LOẠI từ cho từng chỗ trống (số? tên riêng? danh từ số nhiều?) và gạch chân chữ đứng ngay trước chỗ trống.",
          "**MCQ:** gạch chân chữ KHÁC nhau giữa các phương án — đó là thứ bạn cần nghe, không phải chữ chung.",
          "**Matching:** đọc danh sách phương án TRƯỚC danh sách câu; nhớ rằng thường có 2 phương án thừa được nhắc tới để gây nhiễu.",
        ],
      },
      { t: "p", text: "Chuẩn bị tai nghe. Bấm nghe từng Recording và làm câu hỏi ngay bên dưới; **không dừng, không tua lại**. Không mở 💡 hay “why” cho tới khi xong câu 40." },

      /* ───────────── PART 1 ───────────── */
      { t: "h", text: "PART 1 — Questions 1–10" },
      { t: "p", text: "**Questions 1–10** — Complete the form below. Write **ONE WORD AND/OR A NUMBER** for each answer." },
      {
        t: "note",
        title: "Riverside Orienteering Club — enquiry form",
        items: [
          "Name: Daniel **1** ___",
          "Membership type: **2** ___",
          "Annual fee: £ **3** ___",
          "First event: Sunday 12th at Ashcombe **4** ___",
          "Start: any time between 10.00 and **5** ___",
          "Recommended course: the **6** ___ course",
          "Must carry: a **7** ___ (sold at the registration tent)",
          "Hire of timing chip: £ **8** ___",
          "Clothing: long **9** ___ must be worn",
          "Training evenings: every **10** ___ , 7–8.30 pm",
        ],
      },
      {
        t: "listen",
        id: "t5d28-nghe-p1",
        title: "Part 1 — A phone call to an orienteering club",
        dan: { so: "Day 28, Recording 1", boiCanh: "a telephone conversation between a club secretary and a man who wants to join an orienteering club.", cau: [1, 10] },
        note: "Khoảng 4 phút, ~170 từ/phút. Fiona: giọng New Zealand; Daniel: giọng Anh.",
        lines: [
          { who: "Fiona", voice: "nz-nu", text: "Good morning, Riverside Orienteering Club, Fiona speaking." },
          { who: "Daniel", voice: "uk-nam", text: "Oh, hi. I saw your stand at the sports fair last weekend, and I wondered if I could get some information about joining." },
          { who: "Fiona", voice: "nz-nu", text: "Of course. Have you done any orienteering before?" },
          { who: "Daniel", voice: "uk-nam", text: "Not really. I did a bit at school, years ago — a map and a compass in a park — but that's about it." },
          { who: "Fiona", voice: "nz-nu", text: "That's more than a lot of our new members have done, honestly. Let me take a few details first, and then I'll tell you about our next events. What's your name?" },
          { who: "Daniel", voice: "uk-nam", text: "It's Daniel Harwood." },
          { who: "Fiona", voice: "nz-nu", text: "Is that H-A-R-D-W-O-O-D?" },
          { who: "Daniel", voice: "uk-nam", text: "No, there's no D in the middle — people always put one in. It's H-A-R-W-O-O-D." },
          { who: "Fiona", voice: "nz-nu", text: "Got it, thanks. And what kind of membership were you thinking of? We have individual, joint — that's for two adults at the same address — and family." },
          { who: "Daniel", voice: "uk-nam", text: "Just individual, I think. Actually, hang on — my partner said she might be interested too, and she's much better with maps than I am. So let's say joint." },
          { who: "Fiona", voice: "nz-nu", text: "Joint it is. That's forty-eight pounds a year. Individual is thirty-six, so it works out cheaper if there are two of you. The family rate's sixty, but that's only if you've got children under eighteen." },
          { who: "Daniel", voice: "uk-nam", text: "Forty-eight for both of us — that's very reasonable. So when's the next event?" },
          { who: "Fiona", voice: "nz-nu", text: "Our next one for beginners is on Sunday the twelfth, at Ashcombe Common. That's the big open area just north of town — not Ashcombe Woods, which is where we were last month. People do get the two mixed up." },
          { who: "Daniel", voice: "uk-nam", text: "Ashcombe Common. C-O-M-M-O-N?" },
          { who: "Fiona", voice: "nz-nu", text: "That's right." },
          { who: "Daniel", voice: "uk-nam", text: "And what time does it start?" },
          { who: "Fiona", voice: "nz-nu", text: "It's not a mass start like a running race. You can start whenever you like between ten and eleven thirty. We used to let people start until twelve, but in winter the light goes quite early, so we brought it forward." },
          { who: "Daniel", voice: "uk-nam", text: "Okay. And how do I know which course to do?" },
          { who: "Fiona", voice: "nz-nu", text: "The courses are colour-coded. White is the shortest, but that's really designed for young children — it follows paths the whole way round. For an adult beginner I'd suggest yellow. Orange is the next step up, but I wouldn't try that on your first outing; it takes you off the paths quite a lot." },
          { who: "Daniel", voice: "uk-nam", text: "Yellow, then. Will I need to buy a compass?" },
          { who: "Fiona", voice: "nz-nu", text: "No, we can lend you one on the day, and to be honest, on the yellow course you'll hardly need it. The one thing everyone must carry, on every course, is a whistle. If you're injured or lost, three long blasts is the signal for help. We sell them at the registration tent for a pound if you forget yours." },
          { who: "Daniel", voice: "uk-nam", text: "Right. And how does the timing work? Do I bring a stopwatch?" },
          { who: "Fiona", voice: "nz-nu", text: "No — we use electronic chips. You wear a small chip on your finger and touch it against a unit at each control point. If you don't own one, you can hire one on the day. It used to cost three pounds, but the committee brought it down to two last year to encourage beginners." },
          { who: "Daniel", voice: "uk-nam", text: "That's good. Anything I should know about clothing?" },
          { who: "Fiona", voice: "nz-nu", text: "Shoes with a decent grip — trainers are fine on yellow. And your legs must be covered, so long trousers or leggings, not shorts. That's a rule at all our events, partly because of brambles and partly because of ticks, which can carry disease." },
          { who: "Daniel", voice: "uk-nam", text: "Fair enough. Is there anything apart from the Sunday events?" },
          { who: "Fiona", voice: "nz-nu", text: "Yes, we run training evenings in the park behind the leisure centre. They used to be on Tuesdays, but the leisure centre needs the car park that night, so they've moved to Wednesdays — seven till half past eight." },
          { who: "Daniel", voice: "uk-nam", text: "Wednesdays, great. And how do I pay?" },
          { who: "Fiona", voice: "nz-nu", text: "Online's easiest. I'll email you a link — can I take an address?" },
        ],
      },
      {
        t: "quiz",
        id: "t5d28-nghe-p1-dien",
        kind: "fill",
        title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1", answers: ["Harwood"], hint: "“No, there's no D in the middle… H-A-R-W-O-O-D.” Bẫy: cách đánh vần sai được đọc TRƯỚC." },
          { q: "2", answers: ["joint"], hint: "“Just individual, I think. Actually, hang on… So let's say joint.” Sửa giữa câu — đáp án là cái đến SAU actually." },
          { q: "3", answers: ["48", "forty-eight"], hint: "“That's forty-eight pounds a year. Individual is thirty-six… family rate's sixty”. Ba con số, chỉ một con của loại thẻ đã chọn." },
          { q: "4", answers: ["Common"], hint: "“at Ashcombe Common… not Ashcombe Woods, which is where we were last month”." },
          { q: "5", answers: ["11.30", "11:30", "eleven thirty", "half past eleven", "11.30 am", "11:30 am"], hint: "“between ten and eleven thirty. We used to let people start until twelve” — twelve là thông tin CŨ." },
          { q: "6", answers: ["yellow"], hint: "“For an adult beginner I'd suggest yellow.” White = trẻ nhỏ; orange = bước sau." },
          { q: "7", answers: ["whistle"], hint: "“The one thing everyone must carry… is a whistle.” Bẫy: compass được nhắc trước nhưng CLB cho mượn." },
          { q: "8", answers: ["2", "two"], hint: "“It used to cost three pounds, but… brought it down to two”." },
          { q: "9", answers: ["trousers", "leggings"], hint: "“long trousers or leggings, not shorts” — đề cho sẵn chữ long; một từ: trousers (hoặc leggings)." },
          { q: "10", answers: ["Wednesday", "Wednesdays"], hint: "“They used to be on Tuesdays… so they've moved to Wednesdays”." },
        ],
      },

      /* ───────────── PART 2 ───────────── */
      { t: "h", text: "PART 2 — Questions 11–20" },
      { t: "p", text: "**Questions 11–15** — Choose the correct letter, **A, B or C**." },
      {
        t: "listen",
        id: "t5d28-nghe-p2",
        title: "Part 2 — An introduction to a guided shore walk",
        dan: { so: "Day 28, Recording 2", boiCanh: "a guide at a marine centre giving information to a group before a walk on the shore.", cau: [11, 20] },
        note: "Khoảng 5 phút, ~175 từ/phút. Siobhán: giọng Ireland.",
        lines: [
          { who: "Siobhán", voice: "ie-nu", text: "Hello everyone, and welcome to Carrigmore Marine Centre. My name's Siobhán, and I'll be leading this afternoon's shore walk. Before we head down, I need to go through a few practical things, and then I'll explain what we'll see on the different parts of the shore." },
          { who: "Siobhán", voice: "ie-nu", text: "First of all, you may have noticed that the poster outside says the walk starts at two o'clock. We're actually starting at a quarter to three today, and that's nothing to do with the weather, which looks fine for now. It's the tide. Low tide this afternoon is at ten past four, a good bit later than the posters assume, and the best time to be down on the rocks is the hour or so before low water. So thank you for your patience." },
          { who: "Siobhán", voice: "ie-nu", text: "Now, safety. The rocks are uneven, and children love them, which is exactly why I have to be a bit strict. Anyone under eight must stay with an adult the whole time. They don't need to hold hands on the sand, but on the rocks I'd like a grown-up within arm's reach. We do have a few child-sized wetsuits in the store, but honestly, wellington boots are all anyone needs today." },
          { who: "Siobhán", voice: "ie-nu", text: "You're very welcome to pick creatures up — gently, and with wet hands, because dry skin can damage them. What I'd really ask you not to do is leave rocks turned over. A lot of animals live on the underside of a stone, in the shade and the damp, and if you lift one to look underneath, please put it back exactly the way it was. A rock left the wrong way up is like taking the roof off someone's house." },
          { who: "Siobhán", voice: "ie-nu", text: "You'll each get a bucket and a small net. People tend to assume the centre bought these, or that the supermarket in the village gave them, since they sponsor our summer events. In fact they were donated by the primary school down the road; the pupils raised the money with a sponsored swim last spring. So please look after them." },
          { who: "Siobhán", voice: "ie-nu", text: "If the weather does turn — and in this part of the world it can turn in about five minutes — we won't come all the way back up here, and there's no need to run for the cars. We'll shelter in the old lifeboat station at the end of the beach, which the council has just restored. There's a roof, a couple of benches, and a little display about the lifeboat crews." },
          { who: "Siobhán", voice: "ie-nu", text: "Right. Let me show you the route on this map. We go down the steps beside the centre onto the upper shore — the strip of sand and pebbles at the top of the beach that's only covered at high tide. That's also the only part of the beach where you're allowed to take anything home: empty shells, bits of sea glass, that sort of thing. Nothing living, of course, and nothing at all from further down." },
          { who: "Siobhán", voice: "ie-nu", text: "From there we cross the sand channel. At the moment it's just a stretch of wet sand with a few centimetres of water in it, and you'll wonder why I'm mentioning it. The reason is that when the tide turns, the channel fills first, and it fills fast — faster than you can walk. So once I say the tide has turned, nobody goes back into the channel, for any reason, even to fetch a lost bucket." },
          { who: "Siobhán", voice: "ie-nu", text: "On the far side of the channel are the lower rock pools. These are the heart of the walk. Because they stay full of water even at low tide, they hold far more kinds of life than anywhere else on this shore — crabs, starfish, anemones, little fish, and if we're lucky, a sea hare or two. We'll spend most of our time there." },
          { who: "Siobhán", voice: "ie-nu", text: "Beyond the pools, at the northern end, you'll see a group of very large boulders under the cliff. Between April and July that whole area is fenced off, because it's where the oystercatchers nest. We won't be going there today simply because there isn't time to get there and back before the tide. I should mention seals, because everyone asks. A few years ago you'd often see them lying on those boulders, but they've moved round to the next bay, and we're lucky to see one here once or twice a year now." },
          { who: "Siobhán", voice: "ie-nu", text: "And finally, the slipway — the concrete ramp at the southern end where the lifeboat used to launch. It looks slippery, I know, but the council scrapes the weed off it every week, so it's actually the easiest way back up to the road, and that's where we'll finish. Right — any questions before we go?" },
        ],
      },
      {
        t: "mcq",
        id: "t5d28-nghe-p2-chon",
        title: "Questions 11–15 — Multiple choice (A, B or C)",
        items: [
          { q: "11. Why does the walk start later than advertised?", options: ["A  Low tide is later than the posters assume.", "B  The weather forecast is poor.", "C  Some visitors have not arrived yet."], correct: 0, why: "“that's nothing to do with the weather… It's the tide. Low tide… a good bit later than the posters assume”. B bị bác thẳng." },
          { q: "12. What does the guide say about children under eight?", options: ["A  They must wear a wetsuit.", "B  They are not allowed on the rocks.", "C  They must stay within reach of an adult on the rocks."], correct: 2, why: "“on the rocks I'd like a grown-up within arm's reach”. A: wetsuit có nhưng “wellington boots are all anyone needs”." },
          { q: "13. Visitors are asked not to", options: ["A  touch any of the animals.", "B  leave rocks the wrong way up.", "C  use the nets in the pools."], correct: 1, why: "“What I'd really ask you not to do is leave rocks turned over”. A ngược: “You're very welcome to pick creatures up — gently”." },
          { q: "14. The buckets and nets were provided by", options: ["A  a supermarket.", "B  the marine centre.", "C  a local primary school."], correct: 2, why: "“People tend to assume the centre bought these, or that the supermarket… In fact they were donated by the primary school”. In fact = đáp án đến sau." },
          { q: "15. If the weather gets worse, the group will", options: ["A  shelter in the old lifeboat station.", "B  return to the marine centre.", "C  wait in their cars."], correct: 0, why: "“we won't come all the way back up here, and there's no need to run for the cars. We'll shelter in the old lifeboat station”." },
        ],
      },
      { t: "p", text: "**Questions 16–20** — What does the guide say about each area of the shore? Choose **FIVE** answers from the box and write the correct letter, **A–G**." },
      {
        t: "table",
        head: ["", "Comments"],
        rows: [
          ["A", "This is where the walk will end."],
          ["B", "Visitors are most likely to slip here."],
          ["C", "It has the greatest variety of wildlife."],
          ["D", "It must not be entered once the tide has turned."],
          ["E", "Seals are regularly seen here."],
          ["F", "It is closed to visitors for part of the year."],
          ["G", "It is the only place where things may be collected."],
        ],
      },
      {
        t: "quiz",
        id: "t5d28-nghe-p2-ghep",
        kind: "fill",
        title: "Questions 16–20 — viết chữ cái A–G",
        items: [
          { q: "16. the upper shore", answers: ["G"], hint: "“That's also the only part of the beach where you're allowed to take anything home: empty shells…”. take home ≈ collect." },
          { q: "17. the sand channel", answers: ["D"], hint: "“once I say the tide has turned, nobody goes back into the channel, for any reason”." },
          { q: "18. the lower rock pools", answers: ["C"], hint: "“they hold far more kinds of life than anywhere else on this shore”. kinds of life ≈ variety of wildlife." },
          { q: "19. the northern boulders", answers: ["F"], hint: "“Between April and July that whole area is fenced off… where the oystercatchers nest”. Bẫy E: hải cẩu TỪNG nằm ở đó, giờ “once or twice a year” ⇒ không phải regularly." },
          { q: "20. the slipway", answers: ["A"], hint: "“that's where we'll finish”. Bẫy B: “It looks slippery… but the council scrapes the weed off it every week” — bị gạt." },
        ],
      },

      /* ───────────── PART 3 ───────────── */
      { t: "h", text: "PART 3 — Questions 21–30" },
      { t: "p", text: "**Questions 21–24** — Choose the correct letter, **A, B, C or D**." },
      {
        t: "listen",
        id: "t5d28-nghe-p3",
        title: "Part 3 — A project on background music and debugging",
        dan: { so: "Day 28, Recording 3", boiCanh: "two computing students, Maya and Tom, discussing their research project with their tutor, Dr Ferris.", cau: [21, 30] },
        note: "Khoảng 4 phút, ~175 từ/phút. Maya: giọng Mỹ; Tom: giọng Canada; Dr Ferris: giọng Anh.",
        lines: [
          { who: "Dr Ferris", voice: "uk-nu", text: "Come in, both of you. So — the music and debugging project. You've finished collecting data?" },
          { who: "Maya", voice: "us-nu", text: "We have. Thirty-two participants in the end, each doing two debugging tasks, one in silence and one with music." },
          { who: "Dr Ferris", voice: "uk-nu", text: "Remind me why you went for debugging. Your original proposal said participants would write a short program." },
          { who: "Tom", voice: "ca-nam", text: "We did think about that. The trouble is that you get such different solutions to the same problem that it's really hard to mark them fairly. With debugging, we planted exactly eight errors in each piece of code, so the score is simply how many they find. It was quicker to run as well, but honestly that wasn't the reason — it was about being able to compare people's scores consistently." },
          { who: "Dr Ferris", voice: "uk-nu", text: "Good. And the pilot study — did that change anything?" },
          { who: "Maya", voice: "us-nu", text: "Quite a lot, actually. In the pilot we used songs from the charts, and a couple of people started humming along. One of them told us afterwards she'd spent half the task trying to remember the name of the band. So for the real study we switched to instrumental tracks that nobody would have heard before. The equipment was fine — we'd been worried about the headphones, but nobody complained — and the tasks seemed about the right difficulty." },
          { who: "Dr Ferris", voice: "uk-nu", text: "Sensible. Now, I know you're worried about the size of the sample, but thirty-two is perfectly respectable for a project like this. What concerns me more is who they are. They're all second-year computing students, aren't they?" },
          { who: "Tom", voice: "ca-nam", text: "Yes, from our year." },
          { who: "Dr Ferris", voice: "uk-nu", text: "So they're all at a very similar level of experience. That's fine for the study itself, but it means you can't say anything about professional programmers, and the report has to make that clear." },
          { who: "Maya", voice: "us-nu", text: "Okay, we'll put that in the limitations. The result that really surprised us, though, was about what people believed. In the questionnaire, we asked whether they normally listen to music while they study. The ones who said music helps them concentrate didn't do any better with music than without. If anything, they found slightly fewer bugs." },
          { who: "Dr Ferris", voice: "uk-nu", text: "That's interesting, and worth a paragraph of its own. Right — the draft report. Two things. Your literature review is nearly half the report; I'd cut it to about a third. And you collected comments from participants after each task, but you haven't used any of them. Quote a few — they'll bring the findings to life." },
          { who: "Tom", voice: "ca-nam", text: "Should we add a graph of how long each task took?" },
          { who: "Dr Ferris", voice: "uk-nu", text: "You've already got that in a table. A graph would just repeat it. And leave the pilot section as it is; it's the right length. The section on volume levels stays too — it's important." },
          { who: "Maya", voice: "us-nu", text: "Can we talk about the sources quickly? We weren't sure about some of them. The textbook chapter on attention is from 2008. Is that too old?" },
          { who: "Dr Ferris", voice: "uk-nu", text: "Not for the basic psychology of attention — that hasn't changed much. But it doesn't say anything about music, so it's only really useful for setting the scene in your introduction." },
          { who: "Tom", voice: "ca-nam", text: "Then there's the podcast interview with the sound designer. It was really interesting, but we realised afterwards that the whole series is paid for by a headphone company, and he works for them." },
          { who: "Dr Ferris", voice: "uk-nu", text: "Then you'll need to say so if you cite it at all. What about the survey of software companies?" },
          { who: "Maya", voice: "us-nu", text: "That one claimed most developers work better with music, but when we looked at the method, they only got responses from about forty people, out of several thousand they contacted." },
          { who: "Dr Ferris", voice: "uk-nu", text: "So I wouldn't lean on it. And the article by the music psychologist?" },
          { who: "Tom", voice: "ca-nam", text: "That's the awkward one. She found that music improved performance, which goes against what we found — although her tasks were things like data entry, not debugging." },
          { who: "Dr Ferris", voice: "uk-nu", text: "That's not awkward; that's a discussion section. Explain why the tasks might matter. None of your sources is perfect, by the way — the most reliable evidence you have is your own data, as long as you're honest about its limits." },
        ],
      },
      {
        t: "mcq",
        id: "t5d28-nghe-p3-chon",
        title: "Questions 21–24 — Multiple choice",
        items: [
          { q: "21. Why did the students choose a debugging task?", options: ["A  It took less time to run.", "B  Participants found it more enjoyable.", "C  It allowed results to be scored consistently.", "D  Their tutor recommended it."], correct: 2, why: "“it was about being able to compare people's scores consistently”. A bị gạt: “It was quicker… but honestly that wasn't the reason”." },
          { q: "22. What did the pilot study show?", options: ["A  The tasks were too difficult.", "B  Familiar songs distracted participants.", "C  The headphones were uncomfortable.", "D  Instrumental music had no effect."], correct: 1, why: "“a couple of people started humming along… trying to remember the name of the band”. C bị gạt: “nobody complained”." },
          { q: "23. What is the tutor's main concern about the participants?", options: ["A  There were too few of them.", "B  Some of them knew the researchers.", "C  They did not all complete both tasks.", "D  They all had a similar level of experience."], correct: 3, why: "“thirty-two is perfectly respectable… What concerns me more is… all at a very similar level of experience”. A là điều SINH VIÊN lo, tutor gạt." },
          { q: "24. What surprised the students?", options: ["A  Music made everyone work faster.", "B  Participants who believed music helped them did not benefit from it.", "C  Most participants preferred to work in silence.", "D  Silence produced the lowest scores."], correct: 1, why: "“The ones who said music helps them concentrate didn't do any better with music than without. If anything, they found slightly fewer bugs.”" },
        ],
      },
      { t: "p", text: "**Questions 25–26** — Choose **TWO** letters, **A–E**. Which **TWO** changes does the tutor want the students to make to their report?" },
      {
        t: "table",
        head: ["", "Options"],
        rows: [
          ["A", "add more detail about the pilot study"],
          ["B", "shorten the literature review"],
          ["C", "add a graph showing the time taken"],
          ["D", "include some participants' comments"],
          ["E", "remove the section on volume levels"],
        ],
      },
      {
        t: "quiz",
        id: "t5d28-nghe-p3-hai",
        kind: "fill",
        title: "Questions 25–26 — Choose TWO (gõ hai chữ cái, thứ tự nào cũng được)",
        items: [
          { q: "25–26. Two letters", answers: ["B D", "D B", "BD", "DB", "B, D", "D, B", "B,D", "D,B", "B and D", "D and B"], hint: "B: “I'd cut it to about a third”. D: “Quote a few”. C bị gạt (“A graph would just repeat it”); A và E bị gạt (“leave the pilot section as it is” · “volume levels stays too”)." },
        ],
      },
      { t: "p", text: "**Questions 27–30** — What do the students and tutor say about each source? Choose **FOUR** answers from the box and write the correct letter, **A–F**." },
      {
        t: "table",
        head: ["", "Comments"],
        rows: [
          ["A", "It is too old to be relevant."],
          ["B", "It is useful only as background."],
          ["C", "It is based on very few responses."],
          ["D", "It was produced with commercial support."],
          ["E", "Its findings conflict with the students' results."],
          ["F", "It is the most reliable source they found."],
        ],
      },
      {
        t: "quiz",
        id: "t5d28-nghe-p3-nguon",
        kind: "fill",
        title: "Questions 27–30 — viết chữ cái A–F",
        items: [
          { q: "27. the textbook chapter", answers: ["B"], hint: "“it's only really useful for setting the scene in your introduction”. Bẫy A: “Is that too old?” — “Not for the basic psychology of attention”." },
          { q: "28. the podcast interview", answers: ["D"], hint: "“the whole series is paid for by a headphone company, and he works for them”." },
          { q: "29. the survey of software companies", answers: ["C"], hint: "“they only got responses from about forty people, out of several thousand”." },
          { q: "30. the music psychologist's article", answers: ["E"], hint: "“She found that music improved performance, which goes against what we found”. Bẫy F: “the most reliable evidence you have is your own data” — không phải nguồn nào trong danh sách." },
        ],
      },

      /* ───────────── PART 4 ───────────── */
      { t: "h", text: "PART 4 — Questions 31–40" },
      { t: "p", text: "**Questions 31–40** — Complete the notes below. Write **ONE WORD ONLY** for each answer." },
      {
        t: "note",
        title: "How homing pigeons navigate",
        items: [
          "**Compass** — a sun compass only works if the bird knows the time · when the birds' internal **31** ___ was shifted by six hours, they flew off about 90° off course",
          "magnets disrupted navigation only on **32** ___ days · iron-containing cells in the **33** ___ were later shown to belong to the immune system",
          "**Map** — Italian studies: birds unable to **34** ___ got lost when released at unfamiliar sites · young birds may learn which smells arrive with each direction of the **35** ___",
          "low-frequency sound from waves on the **36** ___ may give each loft an acoustic signature · losses in a 1997 race were blamed on a passing supersonic **37** ___",
          "**Landmarks** — GPS loggers show birds near home often follow **38** ___ · birds released repeatedly from one site keep to a personal **39** ___",
          "**Conclusion** — several cues give the system a great deal of **40** ___",
        ],
      },
      {
        t: "listen",
        id: "t5d28-nghe-p4",
        title: "Part 4 — Lecture: how do homing pigeons find their way home?",
        dan: { so: "Day 28, Recording 4", boiCanh: "part of a lecture in an animal behaviour course about how homing pigeons navigate.", cau: [31, 40] },
        note: "Khoảng 5 phút, ~175 từ/phút. Giảng viên: giọng Úc.",
        lines: [
          { who: "Lecturer", voice: "au-nam", text: "Good morning. Today I want to look at one of the oldest puzzles in animal behaviour: how a homing pigeon, released hundreds of kilometres from its loft in a place it has never seen, manages to fly home, often within a day. People have relied on this ability for thousands of years — to carry messages in wartime and, more recently, for racing — and yet we still don't fully understand it. What we do know is that a navigating animal needs two separate things. It needs a compass, to tell it which direction is which, and it needs something like a map, to tell it where it is in relation to home. A compass on its own is useless: if you don't know whether you're north or south of home, knowing where north is won't help you." },
          { who: "Lecturer", voice: "au-nam", text: "Let's start with the compass, because that part is reasonably well understood. On sunny days, pigeons use the sun. Now, the sun moves across the sky during the day, so to use it as a compass the bird must also know what time it is. The evidence for this comes from what are called clock-shift experiments. Researchers kept pigeons in a room where the lights came on and went off six hours earlier than the real sunrise and sunset. After a few days, the birds' internal clock had shifted to match. When they were released, they set off in a direction that was wrong by roughly ninety degrees — which is exactly what you'd predict if they were reading the sun with the wrong time in their heads." },
          { who: "Lecturer", voice: "au-nam", text: "But pigeons also get home when the sun is hidden, so there must be a back-up. In the nineteen-seventies an American researcher attached small magnets to pigeons to interfere with any sense of the Earth's magnetic field. On sunny days, the magnets made no difference at all. On overcast days, the birds with magnets were badly disoriented, while birds carrying brass bars of the same weight flew home normally. So the magnetic sense seems to be used mainly when the sun isn't available. Where the magnetic sensor actually is, though, remains a mystery. For a while the favourite answer was the beak, where researchers had found cells containing iron. Unfortunately, a study published in 2012 showed that most of those cells were part of the immune system and had nothing to do with navigation, so the search goes on — some groups are now looking at the inner ear, others at the eye." },
          { who: "Lecturer", voice: "au-nam", text: "So much for the compass. The map is far more controversial. In the nineteen-seventies a group of Italian researchers proposed that pigeons navigate by smell. Their key experiment was simple: they stopped birds from being able to smell, and found that those birds could still find their way home from places they knew well, but got lost when they were released somewhere unfamiliar. The idea was that a young pigeon sitting in its loft learns which smells arrive with which wind. If a particular smell always comes on the wind from the south-east, then when the bird is released and smells it strongly, it knows it's somewhere to the south-east of home and should fly north-west. For a long time, many scientists outside Italy were sceptical, partly because experiments in other countries gave weaker results. The current view is that smell probably does play a part, but how big a part may depend on the region and its winds." },
          { who: "Lecturer", voice: "au-nam", text: "A more recent, and even more controversial, idea involves sound — infrasound, to be precise, which is sound at frequencies far too low for us to hear. An American geophysicist suggested that pigeons can hear the low-frequency sound produced by waves on the ocean. That sound travels enormous distances, and it's shaped by the hills and valleys around a loft, which would give each home a kind of acoustic signature. He used the idea to explain a famous race in 1997, when thousands of pigeons released in France failed to return to England. His argument was that a supersonic aircraft crossing the Channel at the time produced a shock wave that drowned out the birds' acoustic map. It's an ingenious explanation, but I'd treat it with caution — it's extremely hard to test." },
          { who: "Lecturer", voice: "au-nam", text: "Finally, landmarks. Until fairly recently we simply couldn't follow a pigeon's route, but now we can fit birds with tiny GPS loggers. One team expected that birds near home would use rivers or coastlines. What they found most striking, though, was that the birds often followed roads — major roads, even motorways — turning at junctions almost as if they were driving. And when birds were released many times from the same site, each one developed its own personal route, which it then stuck to faithfully, even when that route wasn't the most direct way home." },
          { who: "Lecturer", voice: "au-nam", text: "So where does all this leave us? It seems that pigeons don't depend on any single sense. They have several cues — the sun, magnetism, smell, perhaps sound, and familiar landmarks — and they switch between them depending on the conditions. In engineering terms, the system has a great deal of redundancy: if one cue fails, another takes over. That probably explains why the experiments so often seem to contradict each other. Remove one cue, and the bird simply uses another. Next week, we'll see whether the same is true of sea turtles." },
        ],
      },
      {
        t: "quiz",
        id: "t5d28-nghe-p4-ghi-chu",
        kind: "fill",
        title: "Questions 31–40 — ONE WORD ONLY",
        items: [
          { q: "31", answers: ["clock"], hint: "“After a few days, the birds' internal clock had shifted to match.”" },
          { q: "32", answers: ["overcast"], hint: "“On overcast days, the birds with magnets were badly disoriented”. Bẫy: sunny days = “made no difference at all”. Chỉ chép từ NGHE được: overcast (không đổi thành cloudy)." },
          { q: "33", answers: ["beak"], hint: "“the favourite answer was the beak, where researchers had found cells containing iron”. Bẫy: inner ear / eye là chỗ ĐANG tìm, không phải chỗ có tế bào sắt." },
          { q: "34", answers: ["smell"], hint: "“they stopped birds from being able to smell… got lost when they were released somewhere unfamiliar”." },
          { q: "35", answers: ["wind"], hint: "“learns which smells arrive with which wind”." },
          { q: "36", answers: ["ocean"], hint: "“the low-frequency sound produced by waves on the ocean”." },
          { q: "37", answers: ["aircraft"], hint: "“a supersonic aircraft crossing the Channel at the time”." },
          { q: "38", answers: ["roads"], hint: "“One team expected… rivers or coastlines. What they found most striking, though, was that the birds often followed roads”. Bẫy: rivers là điều được KỲ VỌNG." },
          { q: "39", answers: ["route"], hint: "“each one developed its own personal route, which it then stuck to faithfully”." },
          { q: "40", answers: ["redundancy"], hint: "“the system has a great deal of redundancy: if one cue fails, another takes over”. Chính tả: r-e-d-u-n-d-a-n-c-y." },
        ],
      },

      /* ───────────── CHẤM ───────────── */
      { t: "h", text: "Hết đề — 2 phút kiểm, rồi chấm" },
      {
        t: "table",
        head: ["Bước (2 phút)", "Kiểm gì", "Câu hôm nay"],
        rows: [
          ["① Ô trống", "không để trống câu nào — đoán còn hơn bỏ", "mọi câu"],
          ["② Số từ", "ONE WORD ONLY ⇒ một từ; Part 1 cho số + chữ", "9 (long đã có sẵn) · 31–40"],
          ["③ Chính tả tên & từ khó", "đánh vần đúng như nghe; số nhiều khớp ngữ pháp", "1 Harwood · 40 redundancy · 38 roads (số nhiều)"],
          ["④ Choose TWO", "đủ HAI chữ cái, không trùng", "25–26"],
        ],
        caption: "Quy trình 2 phút của Ngày 25 — bài thi máy không cho thêm thời gian chép",
      },
      {
        t: "table",
        head: ["Đúng / 40", "Band Listening (ước tính)", "Việc tiếp"],
        rows: [
          ["39–40", "9.0", "Ngày 30 làm Đề 12 với cùng nhịp; không cần ôn thêm dạng nào."],
          ["35–38", "8.0–8.5", "Đạt đích của tập. Xem câu sai có cùng một nhãn không."],
          ["32–34", "7.5", "Gần đích. Nếu mất ≥ 2 câu ở Part 1 ⇒ lỗi chép, không phải lỗi nghe."],
          ["30–31", "7.0", "Nghe lại Part bạn sai nhiều nhất, có lời thoại, đánh dấu câu tín hiệu."],
          ["dưới 30", "≤ 6.5", "Làm lại Part 3 và 4 sau hai ngày, không xem đáp án cũ."],
        ],
        caption: "Quy đổi theo bảng công khai của Listening — chỉ là ước tính trên một đề tự soạn",
      },
      {
        t: "table",
        head: ["Kiểu bẫy", "Câu", "Chữ tín hiệu"],
        rows: [
          ["Sửa thông tin giữa câu", "2 · 5 · 8 · 10", "Actually, hang on… · We used to… · It used to cost… · They used to be…"],
          ["Phương án được nhắc rồi bị gạt", "7 · 12 · 14 · 21 · 22 · 23 · 25–26", "but honestly that wasn't the reason · nobody complained · What concerns me more · A graph would just repeat it"],
          ["Đúng nhưng của chỗ khác / thời khác", "19 · 20 · 27 · 30", "A few years ago… now · It looks slippery… but · Not for… · the most reliable… is your own data"],
          ["Giả thuyết bị bác / điều được kỳ vọng", "33 · 38", "For a while the favourite answer… Unfortunately · One team expected… What they found, though"],
        ],
        caption: "Bốn kiểu bẫy band 8 — đều có chữ báo trước; nghe được chữ báo là nghe được đáp án",
      },
      {
        t: "note",
        title: "💡 Mẹo — bốn câu báo hiệu “đáp án là cái đến sau”",
        items: [
          "**Actually / In fact / What… really…** ⇒ cái trước nó thường là nhiễu (câu 2, 14).",
          "**used to… but now** ⇒ thông tin cũ bị thay (câu 5, 8, 10).",
          "**People tend to assume… / You might think…** ⇒ điều đó SAI (câu 14).",
          "**expected… what they found, though** ⇒ đáp án là cái tìm thấy, không phải cái kỳ vọng (câu 38).",
        ],
      },
      { t: "h", text: "Từ vựng hữu ích từ bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "homing", pos: "adj", ipa: "/ˈhəʊmɪŋ/", vi: "có khả năng tìm đường về nhà", ex: "Homing pigeons can find their loft from hundreds of kilometres away.", exVi: "Bồ câu đưa thư có thể tìm về chuồng từ cách xa hàng trăm ki-lô-mét.", more: "a homing pigeon · homing instinct · (kỹ thuật) a homing device / missile" },
          { w: "disoriented", pos: "adj", ipa: "/dɪsˈɔːrientɪd/", vi: "mất phương hướng", ex: "On overcast days, the birds with magnets were badly disoriented.", exVi: "Vào những ngày u ám, chim mang nam châm bị mất phương hướng nặng.", more: "Anh-Anh cũng nói disorientated · feel / become disoriented" },
          { w: "overcast", pos: "adj", ipa: "/ˌəʊvəˈkɑːst/", vi: "(trời) u ám, nhiều mây", ex: "The forecast is overcast with light rain later.", exVi: "Dự báo trời u ám, có mưa nhẹ về sau.", more: "an overcast sky / day · Part 1 Weather: dùng thay cloudy cho đỡ lặp" },
          { w: "cue", pos: "n", ipa: "/kjuː/", vi: "tín hiệu, dấu hiệu (giúp định hướng / nhắc làm gì)", ex: "Pigeons switch between several cues depending on the weather.", exVi: "Bồ câu chuyển qua lại giữa nhiều tín hiệu tuỳ thời tiết.", more: "a visual / social cue · take your cue from sb (làm theo ai) · ⚠️ đồng âm với queue" },
          { w: "pilot study", pos: "n", ipa: "/ˈpaɪlət ˌstʌdi/", vi: "nghiên cứu thử (quy mô nhỏ, trước nghiên cứu chính)", ex: "The pilot study showed that familiar songs distracted participants.", exVi: "Nghiên cứu thử cho thấy những bài hát quen làm người tham gia mất tập trung.", more: "run / conduct a pilot study · a pilot scheme / project" },
          { w: "slipway", pos: "n", ipa: "/ˈslɪpweɪ/", vi: "đường dốc hạ thuyền (bê tông, xuống nước)", ex: "We'll finish the walk beside the old slipway.", exVi: "Chúng ta sẽ kết thúc chuyến đi bên đường dốc hạ thuyền cũ.", more: "a lifeboat slipway · launch a boat from the slipway" },
          { w: "drown out", pos: "phr v", ipa: "/ˌdraʊn ˈaʊt/", vi: "át đi (âm thanh lớn hơn che mất âm thanh khác)", ex: "A shock wave may have drowned out the birds' acoustic map.", exVi: "Một sóng xung kích có thể đã át mất “bản đồ âm thanh” của bầy chim.", more: "drown out the noise / sb's voice · nghĩa bóng: drown out other opinions" },
          { w: "lean on", pos: "phr v", ipa: "/ˈliːn ɒn/", vi: "dựa vào (quá nhiều) — một nguồn, một người", ex: "The survey had very few responses, so I wouldn't lean on it in your report.", exVi: "Khảo sát có rất ít phản hồi, nên tôi sẽ không dựa vào nó trong báo cáo của các em.", more: "lean on a source / sb for support · lean heavily on · nghĩa đen: tựa vào" },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau buổi",
        items: [
          "Ghi điểm hôm nay cạnh điểm Đề 9, 10, 11 trong Sổ lỗi. Ngày 29 (checklist 14 dạng Listening) dùng hàng “dạng sai nhiều nhất” này.",
          "Mở lời thoại Part có nhiều câu sai nhất, tô màu mọi chữ tín hiệu trong bảng bẫy, rồi nghe lại một lần không nhìn chữ.",
          "Câu sai vì chính tả ⇒ chép từ đó 3 lần vào Sổ lỗi (Harwood, redundancy…) — lỗi chép là lỗi rẻ nhất để sửa.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d28-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 28 — 50 từ band 8 phần 2 · bẫy dùng sai · đề hai câu hỏi · chia 60 phút · nghe một tin nhắn có thông tin bị sửa",
    goal: "Ôn trọn Ngày 28: dùng đúng collocation và văn phong của 50 từ band 8 phần 2, tránh tám bẫy dùng sai, nhận ra biến thể của đề hai câu hỏi và chia hai nửa cân nhau, chọn đúng việc cần làm khi trễ giờ, nghe ra thông tin bị sửa trong một tin nhắn — 36 câu có đáp án, một đoạn Task 2 AI chấm và hai câu nói ghi âm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài tập này ôn gì",
        items: [
          "Bài 1: ==50 từ phần 2== theo năm nhóm + tám bẫy dùng sai + văn phong (pricey chỉ khi nói).",
          "Bài 2: năm biến thể two-part · hai nửa cân nhau · sợi chỉ nối · cách chia 60 phút và mốc “nếu trễ”.",
          "Bài 3: bẫy sửa thông tin (used to… now · actually) trong một tin nhắn ngắn.",
          "Làm trong 70 phút; không mở 💡 trước khi xong một phần.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 28 trong một hình",
        center: "100 từ band 8 · Two-part · Đề nghe 40 câu",
        branches: [
          { label: "50 từ phần 2", items: ["động từ: corroborate · obviate · forestall", "tính từ: spurious · myopic · tantamount to", "danh từ: crux · impasse · dearth", "điều tiết: purportedly · if anything · in effect", "nói: hectic · impromptu · humdrum"] },
          { label: "Two-part band 8", items: ["đếm “?”", "mở bài trả lời cả hai", "hai nửa cân nhau", "If, as I have suggested, …"] },
          { label: "60 phút", items: ["cách A hay B — theo Đề 9–11", "mốc dừng cứng", "trễ ⇒ cắt độ dài, giữ cấu trúc"] },
          { label: "Nghe 40 câu", items: ["sửa giữa câu", "nhắc rồi gạt", "đúng của chỗ khác", "kỳ vọng ≠ phát hiện"] },
        ],
      },
      { t: "h", text: "I. Nhóm A + B — điền MỘT từ (8 câu, chữ đầu cho sẵn) — ôn Bài 1 mục 1–2" },
      {
        t: "quiz",
        id: "t5d28-bt-ab",
        kind: "fill",
        title: "I. Điền MỘT từ đúng dạng",
        items: [
          { q: "1. Independent tests have failed to c___ the manufacturer's claims.", answers: ["corroborate"], hint: "xác nhận bằng nguồn độc lập." },
          { q: "2. The accident u___ the need for stricter safety checks.", answers: ["underscores", "underscored"], hint: "underscore the need for." },
          { q: "3. A sudden storm t___ their plan to sail round the island.", answers: ["thwarted"], hint: "phá hỏng kế hoạch — thwart, quá khứ." },
          { q: "4. Talking openly about mistakes tends to e___ trust within a team.", answers: ["engender"], hint: "làm nảy sinh (thái độ) — engender trust." },
          { q: "5. Skipping maintenance to save money could j___ the safety of the whole network.", answers: ["jeopardise", "jeopardize"], hint: "đe doạ an toàn — jeopardise." },
          { q: "6. The i___ felling of trees has left the hills bare.", answers: ["indiscriminate"], hint: "bừa bãi — indiscriminate felling." },
          { q: "7. Water rights are one of the most c___ issues in the region.", answers: ["contentious"], hint: "gây tranh cãi — contentious issue." },
          { q: "8. Air pollution is an i___ threat: its effects build up slowly over years.", answers: ["insidious"], hint: "âm thầm mà nguy hại — insidious." },
        ],
      },
      { t: "h", text: "II. Nhóm C — chọn danh từ đúng (6 câu) — ôn Bài 1 mục 3" },
      {
        t: "mcq",
        id: "t5d28-bt-c",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "1. Supermarkets now offer a ___ of plant-based products.", options: ["plethora", "dearth", "crux", "pretext"], correct: 0, why: "a plethora of = vô số." },
          { q: "2. The new manager is the ___ of the whole project; without her it would collapse.", options: ["linchpin", "misnomer", "impasse", "backlash"], correct: 0, why: "the linchpin of = trụ cột." },
          { q: "3. At this ___, it is too early to say whether the policy has worked.", options: ["juncture", "conundrum", "dearth", "pretext"], correct: 0, why: "at this juncture = vào thời điểm này." },
          { q: "4. The decision to close the library sparked a fierce ___ from residents.", options: ["backlash", "linchpin", "juncture", "plethora"], correct: 0, why: "spark a backlash = gây làn sóng phản đối." },
          { q: "5. Balancing privacy and security is a real ___ for governments.", options: ["conundrum", "misnomer", "pretext", "dearth"], correct: 0, why: "a real conundrum = bài toán hóc búa." },
          { q: "6. Talks have reached an ___ , and neither side will compromise.", options: ["impasse", "crux", "plethora", "outlet"], correct: 0, why: "reach an impasse = bế tắc." },
        ],
      },
      { t: "h", text: "III. Nhóm D + E — điền MỘT từ (6 câu) — ôn Bài 1 mục 4–5" },
      {
        t: "quiz",
        id: "t5d28-bt-de",
        kind: "fill",
        title: "III. Điền MỘT từ (chữ đầu cho sẵn nếu có)",
        items: [
          { q: "1. A___ , the course is expensive; however, most graduates find work quickly.", answers: ["Admittedly"], hint: "nhượng bộ mở câu — Admittedly." },
          { q: "2. The company c___ denied any wrongdoing.", answers: ["categorically"], hint: "dứt khoát phủ nhận — categorically deny." },
          { q: "3. Parents need not be u___ worried about occasional junk food.", answers: ["unduly"], hint: "quá mức — unduly." },
          { q: "4. The new drug is d___ more effective: recovery times have halved.", answers: ["demonstrably"], hint: "chứng minh được (có số liệu đi kèm)." },
          { q: "5. My weekdays are pretty h___ — work, gym, sleep, repeat.", answers: ["humdrum"], hint: "đơn điệu — humdrum (Part 1)." },
          { q: "6. After years of the same job, he'd become rather j___ .", answers: ["jaded"], hint: "chán ngấy — jaded." },
        ],
      },
      { t: "h", text: "IV. Bẫy dùng sai (4 câu) — ôn Bài 1 mục 6" },
      {
        t: "mcq",
        id: "t5d28-bt-bay",
        title: "IV. Câu nào đúng?",
        items: [
          { q: "1. Which sentence is correct?", options: ["The 2015 rules have been superseded.", "The 2015 rules have been superceded.", "The 2015 rules have superseded by new ones.", "The 2015 rules are supersede."], correct: 0, why: "Chính tả -sede; bị động have been superseded." },
          { q: "2. Which sentence is correct?", options: ["There was a tacit understanding between them.", "She is a very tacit person who never offends anyone.", "He tacitly offended everyone.", "They made a tacit loud agreement."], correct: 0, why: "tacit = ngầm; người tế nhị là tactful." },
          { q: "3. Which sentence is correct?", options: ["The new law came into effect in January.", "The new law came in effect in January.", "The new law, in effect in January, came.", "The new law took in effect in January."], correct: 0, why: "come into effect = có hiệu lực (khác in effect = về thực chất)." },
          { q: "4. Which sentence suits a Task 2 essay?", options: ["University fees have become prohibitively expensive for many families.", "University fees are super pricey these days.", "Uni fees cost a fortune, to be honest.", "University fees are kind of pricey for lots of people."], correct: 0, why: "Văn phong Task 2: prohibitively expensive; pricey / super / to be honest là văn nói." },
        ],
      },
      { t: "h", text: "V. Đề hai câu hỏi (5 câu) — ôn Bài 2 mục 1–6" },
      {
        t: "mcq",
        id: "t5d28-bt-hai-cau",
        title: "V. Chọn phương án đúng",
        items: [
          { q: "1. “What are the benefits of learning a musical instrument? How can more children be encouraged to do so?” — This is", options: ["a what + how question.", "an advantages / disadvantages question.", "a discussion question.", "an opinion question."], correct: 0, why: "Hai câu hỏi: what (lợi ích) + how (cách khuyến khích) ⇒ biến thể ③." },
          { q: "2. For the question above, which plan is weakest?", options: ["Body 1: benefits (180 words); Body 2: how (40 words).", "Body 1: two benefits; Body 2: two ways of encouraging children.", "Body 1: benefits with examples; Body 2: roles of schools and parents.", "Body 1: cognitive and social benefits; Body 2: cost barriers and how to remove them."], correct: 0, why: "Hai nửa lệch 180 / 40 ⇒ câu hỏi 2 chưa được trả lời đủ." },
          { q: "3. Which sentence best links Body 2 to Body 1?", options: ["If, as I have argued, cost is the main barrier, then free school lessons would do more than any campaign.", "In addition, there are other ways to encourage children.", "On the other hand, some children do not like music.", "To sum up, music is very beneficial."], correct: 0, why: "Dùng lại nguyên nhân đã nêu (cost) để chọn giải pháp — sợi chỉ nối." },
          { q: "4. “Why is this happening? Is it a positive or negative development?” Which body 2 opening is strongest?", options: ["On balance, I believe the change is largely positive, for two reasons.", "There are both positive and negative sides to this.", "Some people think it is positive, while others disagree.", "This essay will now discuss whether it is positive."], correct: 0, why: "Câu đánh giá cần LẬP TRƯỜNG rõ ngay câu đầu thân bài 2." },
          { q: "5. What does a band-8 introduction to a two-part question do?", options: ["It answers both questions briefly.", "It explains what the essay will do.", "It gives a definition of the topic.", "It lists all the reasons."], correct: 0, why: "Mở bài band 8 trả lời cả hai câu hỏi trong 1–2 câu." },
        ],
      },
      { t: "h", text: "VI. Chia 60 phút (3 câu) — ôn Bài 2 mục 7" },
      {
        t: "mcq",
        id: "t5d28-bt-gio",
        title: "VI. Chọn việc nên làm",
        items: [
          { q: "1. In Tests 9–11 you twice finished Task 2 without a conclusion. Which plan suits you?", options: ["Plan B — Task 2 first.", "Plan A — Task 1 first, with 25 minutes for Task 1.", "Write both tasks at the same time.", "Skip planning Task 2."], correct: 0, why: "Từng thiếu kết bài Task 2 ⇒ làm Task 2 trước để nó có đủ 40 phút." },
          { q: "2. You are on plan A. It is 0:22 and Task 1 still has no overview. What now?", options: ["Write a one-sentence overview and move to Task 2.", "Finish all the details first.", "Start Task 2 and come back later if there is time.", "Rewrite the introduction."], correct: 0, why: "Overview là phần nặng điểm nhất của Task 1; viết một câu rồi đi — đã quá mốc 0:19." },
          { q: "3. Three minutes are left and your essay is complete. What is the best use of the time?", options: ["Check main verbs, then nouns, from the beginning.", "Replace simple words with rare ones.", "Add a new example to Body 2.", "Count the words by hand."], correct: 0, why: "Soát theo thứ tự 4 phút (Ngày 27): động từ chính → danh từ. Máy đã đếm từ cho bạn." },
        ],
      },
      { t: "h", text: "VII. Nghe — một tin nhắn thoại có thông tin bị sửa (4 câu) — ôn Bài 3" },
      {
        t: "listen",
        id: "t5d28-bt-nghe",
        title: "A voicemail message about a study group",
        dan: { so: "Day 28, Recording 5", boiCanh: "a voicemail message from a student about changes to a study group meeting.", cau: [1, 4] },
        note: "Khoảng 1 phút. Giọng Canada.",
        lines: [
          { who: "Leah", voice: "ca-nu", text: "Hi, it's Leah from the statistics study group. Just a quick update about Thursday. We'd booked room 214 in the library, but it turns out it's being used for interviews, so we've moved to room 412 — same building, top floor. The start time's changed too: it was going to be four, but a few people have a lab until then, so let's say half past four. Could you bring the practice paper from week six? I'd said week five in the group chat, but that's the one we've already done. Oh, and Marco can't make it, so Priya's leading the session instead. See you there." },
        ],
      },
      {
        t: "quiz",
        id: "t5d28-bt-nghe-dien",
        kind: "fill",
        title: "VII. ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. New room number: ___", answers: ["412"], hint: "“we've moved to room 412”. 214 là phòng CŨ — hai số đảo chữ số là bẫy kinh điển." },
          { q: "2. New start time: ___", answers: ["4.30", "4:30", "half past four", "4.30 pm", "4:30 pm"], hint: "“it was going to be four… so let's say half past four”." },
          { q: "3. Bring the practice paper from week ___", answers: ["6", "six"], hint: "“I'd said week five… but that's the one we've already done” ⇒ six." },
          { q: "4. Session leader: ___", answers: ["Priya"], hint: "“Marco can't make it, so Priya's leading the session instead”." },
        ],
      },
      { t: "h", text: "VIII. Viết một đoạn thân bài 2 (120–150 từ) — AI chấm — ôn Bài 2" },
      {
        t: "p",
        text: "Đề: **In many countries, more people are choosing to rent rather than buy a home. Why is this happening? Is this a positive or negative development?** Chỉ viết **thân bài 2** (câu hỏi đánh giá). Giả sử thân bài 1 của bạn đã nêu nguyên nhân chính là giá nhà tăng nhanh hơn thu nhập. Câu đầu nêu lập trường; có một câu “If, as I have suggested, …”; dùng 2 từ của Bài 1.",
      },
      {
        t: "essay",
        id: "t5d28-bt-viet-doan",
        task: "Task 2",
        prompt: "Write ONLY the second body paragraph (120–150 words) for this essay: In many countries, more people are choosing to rent rather than buy a home. Why is this happening? Is this a positive or negative development? Assume your first body paragraph argued that house prices have risen much faster than incomes. Begin with a clear position, include one sentence that begins “If, as I have suggested, …”, and use at least two words from today's vocabulary lesson.",
        minWords: 120,
        tips: [
          "Câu 1: lập trường có mức (largely negative / mixed but on balance…).",
          "Hai lý do có cơ chế: linh hoạt khi đổi việc (tích cực) · không tích luỹ tài sản, phụ thuộc chủ nhà (tiêu cực).",
          "Câu sợi chỉ: If, as I have suggested, renting is a result of unaffordability rather than choice, then…",
          "Từ dùng được: on the face of it · in effect · if anything · tantamount to · myopic · jeopardise.",
        ],
      },
      {
        t: "note",
        title: "📌 Một đoạn mẫu để so SAU khi đã viết (band 8, ước tính) — 133 từ",
        items: [
          "On balance, I would regard this development as more negative than positive. On the face of it, renting offers real advantages: it allows people to move quickly for work, and it spares them the costs of repairs and maintenance. If, as I have suggested, however, most people rent because buying has become unaffordable rather than because they prefer flexibility, then the trend is less a free choice than a constraint. Lifelong tenants accumulate no asset to fall back on in old age, and in countries where tenants have little legal protection, a sudden rent increase can jeopardise a family's entire living arrangements. Treating mass renting as a lifestyle preference would therefore be myopic; in effect, it would mean accepting that a growing share of the population will retire with nothing but their pension.",
        ],
      },
      { t: "h", text: "IX. Nói 2 câu — ghi âm, AI chấm — ôn Bài 1 nhóm E và Bài 3" },
      { t: "p", text: "Câu 1 là Part 1 — dùng ít nhất một từ nhóm E (hectic, impromptu, humdrum, nostalgic…). Câu 2 là Part 3 — dùng một cụm nhóm D (on the face of it, if anything, by and large)." },
      { t: "speak", id: "t5d28-bt-noi", part: "3", questions: ["(Part 1) What is a typical weekday like for you at the moment?", "(Part 3) Some people say that spending money on experiences is a waste because nothing is left afterwards. How would you respond to that?"] },
    ],
  },
];
