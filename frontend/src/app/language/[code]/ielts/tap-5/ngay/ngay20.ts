/**
 * IELTS Tập 5 — Ngày 20 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, đề, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Science vòng 2 (phương pháp, liêm chính, khoa học & xã hội) + Animals vòng 2 (xung đột, lợi dụng, đạo đức)
 *                     + Children vòng 2 (tự lập, rủi ro, áp lực) — 48 từ + 6 cặp dễ nhầm + 🔊 trọng âm dời trong họ từ
 *                                                                                                      [VC21 VC24 VC30]
 *                     — nối Tập 3 Ngày 10 (Science vòng 1) · Tập 3 Ngày 22 (Animals vòng 1) · Tập 4 Ngày 22 (Children vòng 1)
 *   Bài 2 (writing)   Problem / solution band 8 — chuỗi cơ chế, giải pháp khớp đúng TẦNG của nguyên nhân, xếp ưu tiên, đánh giá
 *                     cái giá và hệ quả ngoài ý muốn; bài mẫu band 7 và band 8 cùng một đề (cận thị ở trẻ em)          [W06]
 *                     — nối Tập 3 Ngày 18 (giải pháp gắn nguyên nhân) · Tập 4 Ngày 22 (đánh giá khả thi) · Tập 5 Ngày 19
 *                       (giả định ngầm, thức giả định trong câu đề xuất)
 *   Bài 3 (listening) Part 4 kéo dài: bài giảng ~10 phút (~1.700 từ, ~170 từ/phút) về cách theo dấu động vật di cư, giảng viên
 *                     giọng Ireland, chủ toạ giọng New Zealand, hỏi – đáp giọng Úc · Canada; khởi động bốn giọng      [L06 L17]
 *                     — nối Tập 4 Ngày 21 (giọng Ireland) · Tập 5 Ngày 5 · 12 (Part 4) · Ngày 19 (đề nhỏ Part 3 + 4)
 *   Bài tập Ngày 20   42 câu có đáp án + 1 đoạn viết + 2 câu nói
 * Mọi id bắt đầu `t5d20-`. Đã grep tap-3…5/ngay + thi-may/de: myopia / short-sighted children, bird ringing / geolocator / godwit /
 * Arctic tern, wildlife entering cities = chưa dùng làm đề tài chính. Dữ kiện có thật (soạn theo trí nhớ, làm tròn / làm mờ): vòng chân
 * chim của Hans Christian Mortensen (Đan Mạch, 1899, chim sáo đá); geolocator đo ánh sáng (độ dài ngày → vĩ độ, giờ giữa trưa → kinh
 * độ, sai số cỡ một – hai trăm km, mù quanh điểm phân); nhạn biển Bắc Cực ~70.000 km/năm (nghiên cứu 2010); choắt mỏ thẳng đuôi vằn
 * bay thẳng Alaska → New Zealand hơn 11.000 km; quy ước tag ≤ ~3 % khối lượng cơ thể; mạng thu sóng vô tuyến; ăng-ten trên Trạm
 * Vũ trụ Quốc tế ngừng năm 2022; radar thời tiết thấy chim di cư ban đêm; đồng vị trong lông vũ; nghiên cứu vòng cánh chim cánh cụt
 * vua (2011); cận thị ở trẻ em đô thị Đông Á, giả thuyết ánh sáng ngoài trời — số liệu trong bài mẫu viết dạng ước tính.
 * Nhân vật (Dr Cian Moloney, Prof. Rangi…) là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_20: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d20-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Khoa học, Động vật, Trẻ em — vòng 2 (48 từ để bàn về độ tin cậy của khoa học, về con người và động vật, về nuôi dạy trẻ tự lập)",
    goal: "Dùng đúng 48 từ và cụm ở mức band 8 để bàn ba chủ đề hay ra trong Task 2 và Part 3: khoa học như một quy trình có thể trục trặc (replication crisis, confounding factor, conflict of interest), quan hệ giữa người và động vật (keystone species, cull, human–wildlife conflict, sentient), và tuổi thơ trong một xã hội sợ rủi ro (risk-averse, autonomy, hothousing, wrap sb in cotton wool); không nhầm sáu cặp dễ lẫn (sentient / sensitive, childish / childlike…), và đặt đúng trọng âm khi họ từ dời trọng âm.",
    minutes: 105,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **LR 7 → 8**: band 8 dùng ==từ ít gặp một cách khéo léo, collocation chính xác, hiếm khi sai==. Vòng 1 cho bạn từ để NÊU chủ đề; vòng 2 cho từ để LẬP LUẬN về nó.",
          "**Science vòng 2** (16 từ): khoa học không phải kho sự thật mà là một quy trình — mẫu, đối chứng, biến gây nhiễu, liêm chính, đồng thuận.",
          "**Animals vòng 2** (16 từ): không còn “động vật quý hiếm” mà là ==xung đột, lợi dụng và đạo đức==: cull, bycatch, trophy hunting, sentient, zoonotic.",
          "**Children vòng 2** (16 từ): tuổi thơ trong xã hội sợ rủi ro — risk-averse, autonomy, hothousing, latchkey child, safeguarding.",
          "Sáu cặp dễ nhầm, và 🔊 trọng âm DỜI trong họ từ: **pho**tograph → pho**to**graphy → photo**gra**phic.",
          "Bài 2 (problem / solution) và Bài 3 (bài giảng về động vật di cư) dùng lại rất nhiều từ hôm nay.",
        ],
      },
      { t: "h", text: "Vòng 1 đã học gì — kiểm nhanh trước khi lên vòng 2" },
      {
        t: "table",
        head: ["Chủ đề", "Vòng 1 (đã học)", "Vòng 2 (hôm nay) thêm gì"],
        rows: [
          ["Science", "Tập 3 Ngày 10: hypothesis · experiment · peer review · breakthrough · clinical trial · funding", "khoa học **trục trặc thế nào**: replication crisis, confounding factor, conflict of interest, publish or perish"],
          ["Animals", "Tập 3 Ngày 22: habitat · endangered · poaching · conservation · captivity · welfare", "người **va chạm** với động vật: cull, human–wildlife conflict, bycatch, zoonotic, sentient"],
          ["Children", "Tập 4 Ngày 22: upbringing · permissive · role model · peer pressure · resilience · screen time", "trẻ **tự lập** hay được bọc kỹ: risk-averse, autonomy, wrap in cotton wool, hothousing, latchkey child"],
        ],
        caption: "Vòng 2 không thay vòng 1 — nó cho bạn chữ để đi từ “nêu” sang “lập luận”",
      },
      {
        t: "quiz",
        id: "t5d20-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — từ vòng 1 (6 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. Before publication, the study was checked by other experts in a process called peer r___.", answers: ["review"], hint: "Tập 3 Ngày 10 — peer review." },
          { q: "2. Large-scale p___ has pushed the rhino close to extinction.", answers: ["poaching"], hint: "Tập 3 Ngày 22 — poaching: săn trộm." },
          { q: "3. Animals kept in c___ often show signs of stress.", answers: ["captivity"], hint: "Tập 3 Ngày 22 — in captivity: bị nuôi nhốt." },
          { q: "4. A p___ parenting style sets very few rules.", answers: ["permissive"], hint: "Tập 4 Ngày 22 — permissive: dễ dãi." },
          { q: "5. Children need r___ to recover from failure.", answers: ["resilience"], hint: "Tập 4 Ngày 22 — resilience: sức bật." },
          { q: "6. The new drug is now in the third stage of its clinical t___.", answers: ["trial"], hint: "Tập 3 Ngày 10 — clinical trial: thử nghiệm lâm sàng." },
        ],
      },
      { t: "rule", formula: "Vòng 1 = từ để NÊU chủ đề  ·  Vòng 2 = từ để LẬP LUẬN (nguyên nhân, cơ chế, giới hạn, đạo đức)", vi: "Mỗi từ vòng 2 nên đi với một câu “vì sao / đến đâu”, không chỉ một câu “cái gì”." },

      /* ── 1 ── */
      { t: "h", text: "1. Science vòng 2 — phương pháp, liêm chính và khoa học trong đời sống (16 từ)" },
      {
        t: "p",
        text: "Đề Task 2 về khoa học ở band 8 hiếm khi hỏi “khoa học có ích không”. Chúng hỏi: có nên tin chuyên gia không, tiền công có nên trả cho nghiên cứu không có ứng dụng ngay, doanh nghiệp có nên tài trợ nghiên cứu, người dân có cần hiểu khoa học không. Mười sáu từ dưới đây chia ba nhóm theo đúng các câu hỏi đó.",
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Science vòng 2 — ba nhóm",
        center: "**Science** như một quy trình",
        branches: [
          { label: "Phương pháp", items: ["sample size", "double-blind", "confounding factor", "margin of error", "inconclusive", "anecdotal"] },
          { label: "Liêm chính", items: ["peer-reviewed", "reproducible", "replication crisis", "retract", "conflict of interest", "publish or perish"] },
          { label: "Khoa học & xã hội", items: ["paradigm shift", "serendipity", "scientific consensus", "scientific literacy"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "sample size", pos: "n phr", ipa: "/ˈsɑːmpl saɪz/", vi: "cỡ mẫu (số người / vật được nghiên cứu)", ex: "With a sample size of only twenty, the study proves very little.", exVi: "Với cỡ mẫu chỉ hai mươi người, nghiên cứu chứng minh được rất ít.", more: "a large / small sample size · a representative sample · increase the sample size" },
          { w: "double-blind", pos: "adj", ipa: "/ˌdʌbl ˈblaɪnd/", vi: "mù đôi (cả người tham gia lẫn người nghiên cứu đều không biết ai nhận gì)", ex: "Only a double-blind trial can rule out the placebo effect.", exVi: "Chỉ thử nghiệm mù đôi mới loại được hiệu ứng giả dược.", more: "a double-blind trial / study · randomised controlled trial (RCT) · single-blind" },
          { w: "confounding factor", pos: "n phr", ipa: "/kənˈfaʊndɪŋ ˌfæktə(r)/", vi: "yếu tố gây nhiễu (biến thứ ba làm hai thứ trông như có quan hệ nhân quả)", ex: "Income is a confounding factor: richer families both eat better and live longer.", exVi: "Thu nhập là yếu tố gây nhiễu: gia đình giàu vừa ăn uống tốt hơn vừa sống lâu hơn.", more: "control for confounding factors · = confounding variable · ⚠️ không dùng confusing factor" },
          { w: "margin of error", pos: "n phr", ipa: "/ˌmɑːdʒɪn əv ˈerə(r)/", vi: "biên độ sai số", ex: "The difference between the two parties is within the margin of error.", exVi: "Khoảng cách giữa hai đảng nằm trong biên độ sai số.", more: "a margin of error of 3 per cent · within / outside the margin of error · leave no margin for error (không được phép sai)" },
          { w: "inconclusive", pos: "adj", ipa: "/ˌɪnkənˈkluːsɪv/", vi: "chưa đi đến kết luận, chưa ngã ngũ", ex: "The evidence on whether the diet works remains inconclusive.", exVi: "Bằng chứng về việc chế độ ăn này có hiệu quả hay không vẫn chưa ngã ngũ.", more: "inconclusive results / evidence / findings · trái: conclusive, compelling" },
          { w: "anecdotal", pos: "adj", ipa: "/ˌænɪkˈdəʊtl/", vi: "dựa trên giai thoại, chuyện kể cá nhân (không phải dữ liệu hệ thống)", ex: "The claim rests on anecdotal evidence from a handful of users.", exVi: "Khẳng định đó dựa trên bằng chứng kể chuyện của một nhúm người dùng.", more: "anecdotal evidence / reports · anecdote (n) · Part 3: That's only anecdotal, but…" },
          { w: "peer-reviewed", pos: "adj", ipa: "/ˌpɪə rɪˈvjuːd/", vi: "đã qua bình duyệt (được chuyên gia cùng ngành thẩm định)", ex: "Only peer-reviewed studies were included in the analysis.", exVi: "Chỉ những nghiên cứu đã qua bình duyệt mới được đưa vào phân tích.", more: "a peer-reviewed journal / article · peer review (n — vòng 1) · gạch nối khi đứng trước danh từ (Ngày 19 quy tắc ⑦)" },
          { w: "reproducible", pos: "adj", ipa: "/ˌriːprəˈdjuːsəbl/", vi: "tái lập được (người khác làm lại cho cùng kết quả)", ex: "A result that is not reproducible should not shape public policy.", exVi: "Một kết quả không tái lập được thì không nên định hướng chính sách công.", more: "reproducible results · reproducibility (n) · gần nghĩa: replicable · replicate (v — vòng 1)" },
          { w: "replication crisis", pos: "n phr", ipa: "/ˌreplɪˈkeɪʃn ˌkraɪsɪs/", vi: "khủng hoảng tái lập (nhiều kết quả nổi tiếng làm lại không ra)", ex: "The replication crisis has made psychologists far more cautious.", exVi: "Khủng hoảng tái lập khiến các nhà tâm lý học thận trọng hơn nhiều.", more: "thường đi với psychology / medicine · dùng tốt khi bàn “có nên tin chuyên gia không”" },
          { w: "retract", pos: "v", ipa: "/rɪˈtrækt/", vi: "rút lại (bài báo khoa học, lời tuyên bố)", ex: "The journal retracted the paper after the data were found to be faulty.", exVi: "Tạp chí rút bài báo sau khi phát hiện dữ liệu có lỗi.", more: "retract a paper / statement / claim · retraction (n) · khác withdraw (rút đơn, rút quân)" },
          { w: "conflict of interest", pos: "n phr", ipa: "/ˌkɒnflɪkt əv ˈɪntrəst/", vi: "xung đột lợi ích", ex: "Researchers must declare any conflict of interest, such as funding from the manufacturer.", exVi: "Nhà nghiên cứu phải khai báo mọi xung đột lợi ích, ví dụ nhận tiền từ nhà sản xuất.", more: "declare / disclose a conflict of interest · số nhiều: conflicts of interest" },
          { w: "publish or perish", pos: "phr", ipa: "/ˌpʌblɪʃ ɔː ˈperɪʃ/", vi: "“đăng bài hay là chết” — áp lực phải công bố liên tục", ex: "A publish-or-perish culture rewards quantity over quality.", exVi: "Văn hoá “đăng bài hay là chết” thưởng cho số lượng hơn chất lượng.", more: "a publish-or-perish culture (gạch nối khi làm tính từ) · dùng để GIẢI THÍCH nguyên nhân của replication crisis" },
          { w: "paradigm shift", pos: "n phr", ipa: "/ˈpærədaɪm ʃɪft/", vi: "sự thay đổi hệ hình (thay đổi tận gốc cách nghĩ của một ngành)", ex: "The discovery of plate tectonics was a paradigm shift in geology.", exVi: "Phát hiện kiến tạo mảng là một bước đổi hệ hình trong địa chất học.", more: "⚠️ đừng dùng cho mọi thay đổi nhỏ — band 8 dùng đúng sức nặng của từ · paradigm /ˈpærədaɪm/: g câm" },
          { w: "serendipity", pos: "n", ipa: "/ˌserənˈdɪpəti/", vi: "sự tình cờ may mắn (tìm ra điều quý khi không tìm nó)", ex: "Many breakthroughs owe as much to serendipity as to planning.", exVi: "Nhiều đột phá nhờ tình cờ may mắn chẳng kém nhờ kế hoạch.", more: "serendipitous (adj) · lập luận cho blue-sky research: không lên kế hoạch được cho serendipity" },
          { w: "scientific consensus", pos: "n phr", ipa: "/ˌsaɪəntɪfɪk kənˈsensəs/", vi: "sự đồng thuận của giới khoa học", ex: "There is a broad scientific consensus that the climate is warming.", exVi: "Có sự đồng thuận rộng rãi trong giới khoa học rằng khí hậu đang nóng lên.", more: "a broad / overwhelming consensus · reach a consensus · ⚠️ consensus, KHÔNG phải concensus" },
          { w: "scientific literacy", pos: "n phr", ipa: "/ˌsaɪəntɪfɪk ˈlɪtərəsi/", vi: "hiểu biết khoa học phổ thông (đọc hiểu, đánh giá được thông tin khoa học)", ex: "Scientific literacy helps citizens tell a single study from a body of evidence.", exVi: "Hiểu biết khoa học giúp người dân phân biệt một nghiên cứu đơn lẻ với cả một khối bằng chứng.", more: "improve / promote scientific literacy · cũng: data literacy, media literacy, financial literacy" },
        ],
      },
      {
        t: "table",
        head: ["Ý Task 2 / Part 3", "Câu band 8 dùng từ hôm nay"],
        rows: [
          ["Không nên tin một nghiên cứu đơn lẻ", "A single study with a small **sample size** is rarely enough; what matters is whether the result is **reproducible**."],
          ["Khoa học tự sửa sai", "The **replication crisis**, uncomfortable as it is, shows that science can correct itself: flawed papers are **retracted**."],
          ["Doanh nghiệp tài trợ nghiên cứu", "Industry funding is not corrupt in itself, provided that any **conflict of interest** is declared."],
          ["Vì sao kết quả kém tin cậy", "A **publish-or-perish** culture rewards striking findings over careful ones."],
          ["Tài trợ nghiên cứu không có ứng dụng ngay", "Because **serendipity** cannot be planned, cutting funding for basic research is a false economy."],
          ["Người dân cần hiểu khoa học", "**Scientific literacy** is not knowing facts but knowing how much weight a claim deserves."],
        ],
        caption: "Mỗi từ một chỗ đứng trong bài",
      },
      {
        t: "quiz",
        id: "t5d20-khoa-hoc",
        kind: "fill",
        title: "Điền từ / cụm từ của mục 1 (8 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. The results were i___, so the team applied for funding to run a larger trial.", answers: ["inconclusive"], hint: "inconclusive: chưa ngã ngũ." },
          { q: "2. Age is a c___ factor here: older drivers both drive less and have fewer accidents.", answers: ["confounding"], hint: "confounding factor: yếu tố gây nhiễu." },
          { q: "3. Neither the patients nor the doctors knew who received the drug: it was a d___-blind trial.", answers: ["double"], hint: "double-blind." },
          { q: "4. The paper was r___ when other scientists discovered that the images had been altered.", answers: ["retracted"], hint: "retract (v) — chia quá khứ bị động." },
          { q: "5. A researcher paid by the company that makes the product has a clear c___ of interest.", answers: ["conflict"], hint: "conflict of interest." },
          { q: "6. Penicillin is often given as an example of s___: its discoverer was not looking for it.", answers: ["serendipity"], hint: "serendipity: tình cờ may mắn." },
          { q: "7. The poll had a m___ of error of three percentage points.", answers: ["margin"], hint: "margin of error." },
          { q: "8. Most of the evidence for the remedy is a___: stories from satisfied customers rather than controlled studies.", answers: ["anecdotal"], hint: "anecdotal evidence." },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Animals vòng 2 — xung đột, lợi dụng và đạo đức (16 từ)" },
      {
        t: "p",
        text: "Vòng 1 dạy bạn nói “loài này đang nguy cấp, cần bảo tồn”. Đề band 8 khó hơn: thành phố có nên giết bớt động vật hoang dã gây hại không, săn bắn có thể tài trợ cho bảo tồn không, động vật có quyền không, dịch bệnh từ động vật sang người do đâu. Ba nhóm dưới đây đi theo đúng ba kiểu câu hỏi đó.",
      },
      {
        t: "vocab",
        items: [
          { w: "keystone species", pos: "n phr", ipa: "/ˈkiːstəʊn ˌspiːʃiːz/", vi: "loài then chốt (mất nó thì cả hệ sinh thái đổi khác)", ex: "Sea otters are a keystone species: without them, sea urchins destroy the kelp.", exVi: "Rái cá biển là loài then chốt: không có chúng, nhím biển phá trụi tảo bẹ.", more: "số ít = số nhiều: one keystone species / several keystone species · khác ecosystem engineer (Ngày 19)" },
          { w: "apex predator", pos: "n phr", ipa: "/ˌeɪpeks ˈpredətə(r)/", vi: "động vật săn mồi đứng đầu chuỗi thức ăn", ex: "Removing an apex predator can allow deer numbers to explode.", exVi: "Loại bỏ một loài săn mồi đầu bảng có thể khiến số hươu tăng vọt.", more: "= top predator · predator / prey (vòng 1)" },
          { w: "cull", pos: "v / n", ipa: "/kʌl/", vi: "(v) giết bớt có chủ đích để kiểm soát số lượng; (n) đợt giết bớt", ex: "The council decided to cull part of the deer population.", exVi: "Hội đồng quyết định giết bớt một phần đàn hươu.", more: "a badger / deer cull · a controversial cull · khác poach (săn trộm, phạm pháp)" },
          { w: "human–wildlife conflict", pos: "n phr", ipa: "/ˌhjuːmən ˈwaɪldlaɪf ˌkɒnflɪkt/", vi: "xung đột giữa người và động vật hoang dã", ex: "As farms expand into forests, human–wildlife conflict becomes more frequent.", exVi: "Khi nông trại lấn vào rừng, xung đột giữa người và động vật hoang dã xảy ra thường hơn.", more: "reduce / manage human–wildlife conflict · ví dụ: voi phá vườn, khỉ cướp đồ ăn ở khu du lịch" },
          { w: "wildlife corridor", pos: "n phr", ipa: "/ˈwaɪldlaɪf ˌkɒrɪdɔː(r)/", vi: "hành lang động vật hoang dã (dải đất nối hai vùng sống)", ex: "A wildlife corridor under the motorway lets animals cross safely.", exVi: "Một hành lang cho động vật dưới đường cao tốc giúp chúng qua đường an toàn.", more: "create / restore a wildlife corridor · chữa cho habitat fragmentation (manh mún sinh cảnh)" },
          { w: "bycatch", pos: "n", ipa: "/ˈbaɪkætʃ/", vi: "sản lượng đánh bắt phụ (loài bị mắc lưới ngoài ý muốn)", ex: "Dolphins and turtles are common bycatch in drift nets.", exVi: "Cá heo và rùa thường bị mắc lưới ngoài ý muốn ở lưới trôi.", more: "reduce bycatch · không đếm được · cũng viết by-catch" },
          { w: "ecotourism", pos: "n", ipa: "/ˈiːkəʊtʊərɪzəm/", vi: "du lịch sinh thái", ex: "Well-managed ecotourism can give villagers a reason to protect wildlife.", exVi: "Du lịch sinh thái được quản lý tốt có thể cho dân làng lý do để bảo vệ động vật hoang dã.", more: "ecotourism revenue · ⚠️ greenwashing (gắn nhãn xanh giả) là lời phản biện hay đi kèm" },
          { w: "trophy hunting", pos: "n phr", ipa: "/ˈtrəʊfi ˌhʌntɪŋ/", vi: "săn chiến tích (trả tiền săn thú lớn để lấy đầu, sừng làm kỷ niệm)", ex: "Supporters argue that trophy hunting pays for anti-poaching patrols.", exVi: "Người ủng hộ cho rằng săn chiến tích trả tiền cho các đội tuần tra chống săn trộm.", more: "a trophy hunter · đề Task 2 kinh điển: “Can hunting ever help conservation?”" },
          { w: "domesticate", pos: "v", ipa: "/dəˈmestɪkeɪt/", vi: "thuần hoá", ex: "Dogs were domesticated long before any farm animal.", exVi: "Chó được thuần hoá từ rất lâu trước mọi loài vật nuôi trong trại.", more: "domestication (n) · domesticated animals · ⚠️ domestic animal = vật nuôi trong nhà (xem cặp dễ nhầm)" },
          { w: "livestock", pos: "n", ipa: "/ˈlaɪvstɒk/", vi: "gia súc, vật nuôi lấy thịt / sữa", ex: "Livestock farming produces a large share of global emissions.", exVi: "Chăn nuôi gia súc tạo ra một phần lớn lượng phát thải toàn cầu.", more: "⚠️ không đếm được: ~~livestocks~~ · livestock farming / production · khác cattle (bò — danh từ số nhiều)" },
          { w: "sentient", pos: "adj", ipa: "/ˈsentiənt/", vi: "có tri giác, cảm nhận được (đau, sợ…)", ex: "If animals are sentient, their suffering must count in our decisions.", exVi: "Nếu động vật có tri giác thì nỗi đau của chúng phải được tính đến trong quyết định của ta.", more: "sentient beings · sentience (n) · ⚠️ khác sensitive (nhạy cảm) và sensible (hợp lý)" },
          { w: "animal rights", pos: "n phr", ipa: "/ˌænɪml ˈraɪts/", vi: "quyền động vật (quan điểm: không được dùng động vật làm phương tiện)", ex: "Animal rights campaigners oppose all use of animals in research.", exVi: "Những người vận động vì quyền động vật phản đối mọi việc dùng động vật trong nghiên cứu.", more: "khác animal welfare (vòng 1 — được dùng nhưng phải đối xử tử tế) · phân biệt hai chữ này là điểm TR" },
          { w: "enrichment", pos: "n", ipa: "/ɪnˈrɪtʃmənt/", vi: "(trong vườn thú) làm phong phú môi trường sống để con vật vận động, tìm tòi", ex: "Good zoos provide enrichment, such as food hidden in puzzles.", exVi: "Vườn thú tốt có các hoạt động làm phong phú môi trường, như giấu thức ăn trong đồ chơi đố.", more: "environmental enrichment · nghĩa chung: sự làm giàu (enrich)" },
          { w: "zoonotic", pos: "adj", ipa: "/ˌzəʊəˈnɒtɪk/", vi: "(bệnh) lây từ động vật sang người", ex: "Most new infectious diseases are zoonotic.", exVi: "Phần lớn bệnh truyền nhiễm mới là bệnh lây từ động vật.", more: "a zoonotic disease · zoonosis (n, số nhiều zoonoses) · spill over from animals to humans" },
          { w: "instinct", pos: "n", ipa: "/ˈɪnstɪŋkt/", vi: "bản năng", ex: "Young birds migrate by instinct, without being taught the route.", exVi: "Chim non di cư theo bản năng mà không cần ai dạy đường.", more: "by instinct · a survival / maternal instinct · instinctive (adj) · instinctively (adv)" },
          { w: "territorial", pos: "adj", ipa: "/ˌterəˈtɔːriəl/", vi: "có tính lãnh thổ (bảo vệ vùng của mình)", ex: "Many birds become highly territorial in the breeding season.", exVi: "Nhiều loài chim trở nên rất hung hăng bảo vệ lãnh thổ vào mùa sinh sản.", more: "territory (n) · nghĩa bóng: be territorial about one's desk / job · trọng âm dời: TERritory → terriTOrial" },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai cách nhìn về động vật",
        cols: [
          { title: "**Animal welfare** — dùng được, nhưng phải tử tế", items: ["livestock farming with higher standards", "enrichment in zoos", "a humane cull when numbers explode", "câu khung: Animals may be used, provided that…"] },
          { title: "**Animal rights** — không được dùng làm phương tiện", items: ["sentient beings with interests of their own", "no trophy hunting, whatever it funds", "no animals in captivity", "câu khung: No benefit to humans can justify…"] },
        ],
      },
      {
        t: "quiz",
        id: "t5d20-dong-vat",
        kind: "fill",
        title: "Điền từ của mục 2 (8 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. Wolves are an a___ predator: nothing hunts them except humans.", answers: ["apex"], hint: "apex predator." },
          { q: "2. The authorities plan to c___ several hundred feral goats on the island.", answers: ["cull"], hint: "cull (v): giết bớt có chủ đích." },
          { q: "3. New fishing nets have reduced b___ of seabirds by half.", answers: ["bycatch", "by-catch"], hint: "bycatch: loài mắc lưới ngoài ý muốn." },
          { q: "4. Bird flu is a z___ disease that occasionally infects humans.", answers: ["zoonotic"], hint: "zoonotic (adj)." },
          { q: "5. Elephants raiding crops is a classic example of human–wildlife c___.", answers: ["conflict"], hint: "human–wildlife conflict." },
          { q: "6. Most of the region's l___ is kept indoors for at least part of the year.", answers: ["livestock"], hint: "livestock — không đếm được, động từ số ít (is)." },
          { q: "7. Sheep were d___ from wild ancestors around ten thousand years ago.", answers: ["domesticated"], hint: "domesticate — bị động quá khứ." },
          { q: "8. If fish are s___, the way they are caught and killed raises ethical questions.", answers: ["sentient"], hint: "sentient: có tri giác." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Children vòng 2 — tự lập, rủi ro và áp lực (16 từ)" },
      {
        t: "p",
        text: "Vòng 1 (Tập 4 Ngày 22) cho bạn từ về kiểu cha mẹ và vai trò giới. Vòng 2 đi vào đúng câu hỏi gây tranh luận nhất của mười năm qua: ==trẻ em ngày nay được bảo vệ quá kỹ hay chưa đủ?== — tự lập, rủi ro, áp lực học sớm, an toàn trên mạng.",
      },
      {
        t: "vocab",
        items: [
          { w: "risk-averse", pos: "adj", ipa: "/ˌrɪsk əˈvɜːs/", vi: "ngại rủi ro, né rủi ro", ex: "A risk-averse society may produce children who cannot judge danger for themselves.", exVi: "Một xã hội né rủi ro có thể tạo ra những đứa trẻ không tự đánh giá được nguy hiểm.", more: "risk-averse parents / institutions · risk aversion (n) · trái: a risk-taker" },
          { w: "wrap sb in cotton wool", pos: "idiom", ipa: "/ræp ˌsʌmbədi ɪn ˌkɒtn ˈwʊl/", vi: "bọc trong bông, bảo vệ quá kỹ", ex: "Children who are wrapped in cotton wool never learn to fall safely.", exVi: "Trẻ được bọc trong bông sẽ không bao giờ học được cách ngã an toàn.", more: "chủ yếu khi NÓI hoặc bài viết bán trang trọng · Task 2: be overprotected (vòng 1: overprotective)" },
          { w: "mollycoddle", pos: "v", ipa: "/ˈmɒlikɒdl/", vi: "nuông chiều, bao bọc quá mức", ex: "Critics say schools mollycoddle pupils by banning competitive games.", exVi: "Người chỉ trích nói trường học nuông chiều học sinh khi cấm các trò chơi có thi đua.", more: "mang ý chê, thân mật · trang trọng hơn: overprotect, shield sb from" },
          { w: "autonomy", pos: "n", ipa: "/ɔːˈtɒnəmi/", vi: "quyền tự quyết, sự tự chủ", ex: "Walking to school alone gives children a sense of autonomy.", exVi: "Tự đi bộ đến trường cho trẻ cảm giác tự chủ.", more: "a sense of autonomy · give / grant sb autonomy · autonomous (adj) · trọng âm: au**TO**nomy" },
          { w: "latchkey child", pos: "n phr", ipa: "/ˈlætʃkiː ˌtʃaɪld/", vi: "trẻ “chìa khoá cổ” (tự về nhà, ở nhà một mình khi bố mẹ còn đi làm)", ex: "Long working hours have created a generation of latchkey children.", exVi: "Giờ làm việc dài đã tạo ra một thế hệ trẻ tự về nhà, ở nhà một mình.", more: "latchkey kids (thân mật) · nối Children vòng 1: breadwinner, work–life balance" },
          { w: "hothousing", pos: "n", ipa: "/ˈhɒthaʊzɪŋ/", vi: "“nhồi” học sớm, ép trẻ học vượt tuổi", ex: "Hothousing may raise test scores but can damage a child's love of learning.", exVi: "Nhồi học sớm có thể nâng điểm thi nhưng làm hỏng niềm vui học của trẻ.", more: "hothouse (v): hothouse a child · hothouse (n) = nhà kính trồng cây (gốc của hình ảnh)" },
          { w: "early years", pos: "n phr", ipa: "/ˌɜːli ˈjɪəz/", vi: "giai đoạn mầm non (khoảng 0–5 tuổi)", ex: "Spending on the early years has the highest long-term return.", exVi: "Chi tiêu cho giai đoạn mầm non có lợi ích lâu dài cao nhất.", more: "early years education / provision / teachers · formative years (vòng 1) rộng hơn" },
          { w: "toddler", pos: "n", ipa: "/ˈtɒdlə(r)/", vi: "trẻ chập chững (khoảng 1–3 tuổi)", ex: "Toddlers learn language far faster from people than from screens.", exVi: "Trẻ chập chững học ngôn ngữ từ người nhanh hơn nhiều so với từ màn hình.", more: "infant (dưới 1 tuổi) → toddler → preschooler · toddle (v): đi chập chững" },
          { w: "precocious", pos: "adj", ipa: "/prɪˈkəʊʃəs/", vi: "sớm phát triển, khôn trước tuổi", ex: "A precocious reader is not necessarily a better reader at fifteen.", exVi: "Đứa trẻ biết đọc sớm chưa chắc đọc giỏi hơn ở tuổi mười lăm.", more: "a precocious talent / child · có thể mang ý hơi chê (ra vẻ người lớn)" },
          { w: "coming of age", pos: "n phr", ipa: "/ˌkʌmɪŋ əv ˈeɪdʒ/", vi: "tuổi trưởng thành; sự bước vào tuổi trưởng thành", ex: "In many cultures, coming of age is marked by a ceremony.", exVi: "Ở nhiều nền văn hoá, việc bước vào tuổi trưởng thành được đánh dấu bằng một nghi lễ.", more: "come of age (v) · a coming-of-age ceremony / film (gạch nối khi làm tính từ)" },
          { w: "age-appropriate", pos: "adj", ipa: "/ˌeɪdʒ əˈprəʊpriət/", vi: "phù hợp lứa tuổi", ex: "Platforms should show children only age-appropriate content.", exVi: "Các nền tảng chỉ nên hiển thị cho trẻ nội dung phù hợp lứa tuổi.", more: "age-appropriate content / games / tasks · age restriction · age verification" },
          { w: "extracurricular", pos: "adj", ipa: "/ˌekstrəkəˈrɪkjələ(r)/", vi: "ngoại khoá", ex: "Extracurricular activities can matter as much as exam results.", exVi: "Hoạt động ngoại khoá có thể quan trọng ngang kết quả thi.", more: "extracurricular activities / clubs · ⚠️ viết liền, không gạch nối · overscheduled children (lịch kín mít)" },
          { w: "sedentary", pos: "adj", ipa: "/ˈsedntri/", vi: "ít vận động, ngồi nhiều", ex: "A sedentary childhood increases the risk of health problems later.", exVi: "Tuổi thơ ít vận động làm tăng nguy cơ bệnh tật về sau.", more: "a sedentary lifestyle / job · trái: active · nối Health vòng 1" },
          { w: "safeguarding", pos: "n", ipa: "/ˈseɪfɡɑːdɪŋ/", vi: "công tác bảo vệ trẻ (khỏi bạo hành, xâm hại, nguy hiểm)", ex: "Every school must have a member of staff responsible for safeguarding.", exVi: "Mọi trường phải có một nhân viên phụ trách bảo vệ trẻ.", more: "safeguarding policy / procedures · safeguard (v): safeguard children's privacy" },
          { w: "pocket money", pos: "n phr", ipa: "/ˈpɒkɪt ˌmʌni/", vi: "tiền tiêu vặt", ex: "Giving children pocket money teaches them to budget.", exVi: "Cho trẻ tiền tiêu vặt dạy chúng cách lập ngân sách.", more: "không đếm được · Mỹ: allowance · earn pocket money by doing chores" },
          { w: "chores", pos: "n (pl)", ipa: "/tʃɔːz/", vi: "việc nhà (việc vặt hằng ngày)", ex: "Children who do chores develop a sense of responsibility.", exVi: "Trẻ làm việc nhà phát triển ý thức trách nhiệm.", more: "do the chores · household chores · ⚠️ ~~make chores~~" },
        ],
      },
      {
        t: "table",
        head: ["Câu hỏi Part 3 / Task 2", "Khung trả lời có từ hôm nay"],
        rows: [
          ["Are children today overprotected?", "Up to a point. A **risk-averse** culture has taken away much of children's **autonomy**, yet **safeguarding** online is more necessary than ever."],
          ["Should young children have formal lessons?", "**Hothousing** in the **early years** may produce **precocious** readers, but there is little evidence of a lasting advantage."],
          ["Should children be paid for helping at home?", "Linking **pocket money** to **chores** teaches budgeting, although it risks turning family duties into a transaction."],
          ["Why are children less active than before?", "Children's lives have become more **sedentary**, partly because parents prefer to **wrap them in cotton wool** indoors."],
          ["Is it harmful for children to be alone at home?", "Being a **latchkey child** can build independence, provided the child is old enough and has someone to call."],
          ["What should children do outside school?", "**Extracurricular** activities are valuable as long as the child is not **overscheduled**."],
        ],
        caption: "Sáu câu hỏi hay gặp — mỗi câu một khung có giới hạn",
      },
      {
        t: "quiz",
        id: "t5d20-tre-em",
        kind: "fill",
        title: "Điền từ của mục 3 (8 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. Children who walk to school alone develop a sense of a___.", answers: ["autonomy"], hint: "autonomy: sự tự chủ." },
          { q: "2. Some parents are so r___-averse that their children are never allowed to climb a tree.", answers: ["risk"], hint: "risk-averse." },
          { q: "3. Investment in the e___ years has been shown to pay off for decades.", answers: ["early"], hint: "early years: giai đoạn mầm non." },
          { q: "4. Films for this age group must contain only a___-appropriate content.", answers: ["age"], hint: "age-appropriate." },
          { q: "5. After school she went home to an empty flat; she was a l___ child.", answers: ["latchkey"], hint: "latchkey child." },
          { q: "6. Paying children for household c___ may teach them that helping always earns a reward.", answers: ["chores"], hint: "chores (số nhiều): việc nhà." },
          { q: "7. A s___ lifestyle in childhood is linked to obesity in adulthood.", answers: ["sedentary"], hint: "sedentary: ít vận động." },
          { q: "8. The school's s___ policy explains what staff must do if they are worried about a pupil.", answers: ["safeguarding"], hint: "safeguarding policy." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Sáu cặp dễ nhầm trong ba chủ đề" },
      {
        t: "table",
        head: ["Cặp", "Khác nhau", "Ví dụ đúng"],
        rows: [
          ["**sentient** / **sensitive** / sensible", "sentient = có tri giác · sensitive = nhạy cảm · sensible = hợp lý", "Pigs are sentient animals. · a sensitive issue · a sensible policy"],
          ["**childlike** / **childish**", "childlike = hồn nhiên như trẻ (khen) · childish = trẻ con, ấu trĩ (chê)", "her childlike curiosity · a childish argument between politicians"],
          ["**domestic** / **domesticated**", "domestic animal = vật nuôi trong nhà · domesticated = đã được thuần hoá (cả ngựa, bò)", "Horses are domesticated but are not usually domestic pets."],
          ["**inconclusive** / **unconvincing**", "inconclusive = chưa đủ để kết luận (dữ liệu) · unconvincing = không thuyết phục (lập luận)", "The data are inconclusive. · His explanation was unconvincing."],
          ["**consensus** / census", "consensus = sự đồng thuận · census = điều tra dân số", "reach a consensus · the 2019 census"],
          ["**livestock** / cattle", "livestock: không đếm được, động từ số ít · cattle: luôn số nhiều, động từ số nhiều", "Livestock **is** kept indoors. · The cattle **are** grazing."],
        ],
        caption: "Sáu cặp — ba cặp đầu là lỗi LR band 7 hay gặp nhất",
      },
      {
        t: "mcq",
        id: "t5d20-de-nham",
        title: "Cặp dễ nhầm — chọn phương án đúng (6 câu)",
        items: [
          { q: "1. Laws in several countries now recognise animals as ___ beings capable of feeling pain.", options: ["sensible", "sensitive", "sentient"], correct: 2, why: "sentient = có tri giác, cảm nhận được đau. sensitive = nhạy cảm (với điều gì); sensible = hợp lý." },
          { q: "2. The debate descended into ___ name-calling.", options: ["childlike", "childish", "child-friendly"], correct: 1, why: "childish mang nghĩa chê: ấu trĩ. childlike là khen (hồn nhiên)." },
          { q: "3. The results of the pilot study were ___, so no decision has been made.", options: ["inconclusive", "unconvincing", "unconscious"], correct: 0, why: "Dữ liệu chưa đủ để kết luận ⇒ inconclusive. unconvincing dùng cho lập luận, lời giải thích." },
          { q: "4. Most of the farm's livestock ___ sold every autumn.", options: ["are", "is", "were being"], correct: 1, why: "livestock là danh từ không đếm được ⇒ động từ số ít." },
          { q: "5. After months of talks, the committee finally reached a ___.", options: ["census", "consensus", "consent"], correct: 1, why: "reach a consensus = đạt đồng thuận. consent = sự cho phép." },
          { q: "6. Wolves were ___ into dogs many thousands of years ago.", options: ["domestic", "domesticated", "domesticating"], correct: 1, why: "domesticate (v) — bị động: were domesticated." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. 🔊 Phát âm: trọng âm DỜI trong họ từ — khoa học, động vật, trẻ em" },
      {
        t: "p",
        text: "Nhiều từ học thuật đổi trọng âm khi thêm hậu tố: **PHO**tograph → pho**TO**graphy → photo**GRA**phic. Quy luật hay gặp: ==-ic, -ical, -ity, -ion kéo trọng âm về âm tiết NGAY TRƯỚC chúng==. Người Việt hay giữ nguyên trọng âm của từ gốc, nên nói bi**O**logical hoặc **TE**rritorial — giám khảo vẫn hiểu, nhưng điểm P không lên 8.",
      },
      {
        t: "table",
        head: ["Từ gốc", "Dạng dời trọng âm", "Hậu tố kéo trọng âm"],
        rows: [
          ["**PHO**tograph · pho**TO**grapher", "photo**GRA**phic", "-ic"],
          ["bi**O**logy", "bio**LO**gical", "-ical"],
          ["hy**PO**thesis", "hypo**THE**tical", "-ical"],
          ["**TE**rritory", "terri**TO**rial", "-ial"],
          ["**PA**rent", "pa**REN**tal", "-al"],
          ["**SCI**ence", "scien**TI**fic", "-ic"],
          ["e**CO**nomy", "eco**NO**mic", "-ic"],
          ["do**MES**tic", "domes**TI**city", "-ity"],
        ],
        caption: "Chữ in hoa là âm tiết mang trọng âm",
      },
      {
        t: "phatam",
        id: "t5d20-phat-am",
        title: "Luyện phát âm — trọng âm dời trong họ từ",
        note: "Đọc từng câu hai lần: lần một dừng sau mỗi từ in nghiêng trong đầu (từ gốc và từ dời), lần hai đọc liền. Máy chấm từng âm; tự nghe xem âm nhấn đã chuyển chỗ chưa — nguyên âm không nhấn phải yếu đi thành /ə/.",
        items: [
          { text: "A good photographer takes photographic notes.", ipa: "ə ɡʊd fətɒɡrəfə teɪks fəʊtəɡræfɪk nəʊts", vi: "Một nhiếp ảnh gia giỏi ghi chú bằng ảnh. (pho-TO-grapher → photo-GRA-phic)" },
          { text: "Biology is a biological science.", ipa: "baɪɒlədʒi ɪz ə baɪəlɒdʒɪkl saɪəns", vi: "Sinh học là một ngành khoa học sinh vật." },
          { text: "The hypothesis was purely hypothetical.", ipa: "ðə haɪpɒθəsɪs wɒz pjʊəli haɪpəθetɪkl", vi: "Giả thuyết ấy hoàn toàn chỉ là giả định." },
          { text: "Many birds are territorial about their territory.", ipa: "meni bɜːdz ɑː terətɔːriəl əbaʊt ðeə terətri", vi: "Nhiều loài chim rất giữ lãnh thổ của mình." },
          { text: "Good parents give parental support.", ipa: "ɡʊd peərənts ɡɪv pərentl səpɔːt", vi: "Cha mẹ tốt cho con sự hỗ trợ của cha mẹ. (PA-rent → pa-REN-tal)" },
          { text: "Science needs scientific literacy.", ipa: "saɪəns niːdz saɪəntɪfɪk lɪtərəsi", vi: "Khoa học cần hiểu biết khoa học phổ thông." },
          { text: "The economy needs economic reform.", ipa: "ðiː ɪkɒnəmi niːdz iːkənɒmɪk rɪfɔːm", vi: "Nền kinh tế cần cải cách kinh tế." },
          { text: "Children need autonomy to become autonomous.", ipa: "tʃɪldrən niːd ɔːtɒnəmi tə bɪkʌm ɔːtɒnəməs", vi: "Trẻ cần quyền tự chủ để trở nên tự lập. (au-TO-nomy, au-TO-nomous — không dời)" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Dùng ngay: câu Task 2 và Part 3 với từ hôm nay" },
      {
        t: "examples",
        items: [
          { en: "A single striking study, however widely reported, is no substitute for a result that has proved reproducible.", vi: "Một nghiên cứu gây chú ý, dù được đưa tin rộng đến đâu, cũng không thay được một kết quả đã chứng tỏ tái lập được." },
          { en: "Much of the replication crisis can be traced to a publish-or-perish culture that rewards novelty over rigour.", vi: "Phần lớn khủng hoảng tái lập có thể truy về văn hoá “đăng bài hay là chết” thưởng cho cái mới hơn sự chặt chẽ." },
          { en: "Culling may reduce human–wildlife conflict in the short term, but a wildlife corridor addresses its cause.", vi: "Giết bớt có thể giảm xung đột giữa người và động vật trước mắt, nhưng một hành lang động vật mới giải quyết nguyên nhân." },
          { en: "Whether trophy hunting can be justified depends on whether one takes an animal welfare or an animal rights view.", vi: "Săn chiến tích có biện minh được hay không tuỳ vào việc ta theo quan điểm phúc lợi động vật hay quyền động vật." },
          { en: "Children who are wrapped in cotton wool may be safer today but less able to judge risk tomorrow.", vi: "Trẻ được bọc trong bông có thể an toàn hơn hôm nay nhưng kém khả năng đánh giá rủi ro ngày mai." },
          { en: "Hothousing in the early years seems to buy a head start rather than a lasting advantage.", vi: "Nhồi học ở giai đoạn mầm non dường như chỉ mua được một khởi đầu sớm chứ không phải lợi thế lâu dài." },
        ],
      },
      {
        t: "quiz",
        id: "t5d20-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (5 câu)",
        items: [
          { q: "Bằng chứng cho phương pháp này vẫn chưa ngã ngũ, vì cỡ mẫu quá nhỏ.", answers: ["The evidence for this method remains inconclusive because the sample size is too small.", "The evidence for this method is still inconclusive because the sample size is too small.", "Evidence for this method remains inconclusive, as the sample size is too small.", "The evidence for this method remains inconclusive because the sample sizes are too small."], hint: "inconclusive · sample size" },
          { q: "Các nhà nghiên cứu phải khai báo mọi xung đột lợi ích.", answers: ["Researchers must declare any conflict of interest.", "Researchers must declare any conflicts of interest.", "Researchers have to declare any conflict of interest.", "Researchers must disclose any conflict of interest."], hint: "declare / disclose · conflict of interest" },
          { q: "Hầu hết các bệnh truyền nhiễm mới đều lây từ động vật sang người.", answers: ["Most new infectious diseases are zoonotic.", "Most new infectious diseases are transmitted from animals to humans.", "Most emerging infectious diseases are zoonotic.", "The majority of new infectious diseases are zoonotic."], hint: "zoonotic" },
          { q: "Một hành lang động vật hoang dã có thể giảm xung đột giữa người và động vật.", answers: ["A wildlife corridor can reduce human–wildlife conflict.", "A wildlife corridor can reduce human-wildlife conflict.", "A wildlife corridor could reduce human–wildlife conflict.", "A wildlife corridor could reduce human-wildlife conflict."], hint: "wildlife corridor · human–wildlife conflict" },
          { q: "Cha mẹ né rủi ro có thể lấy đi sự tự chủ của trẻ.", answers: ["Risk-averse parents may take away children's autonomy.", "Risk-averse parents can take away children's autonomy.", "Risk-averse parents may deprive children of their autonomy.", "Risk-averse parents may take away their children's autonomy."], hint: "risk-averse · autonomy" },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học 48 từ này trong 7 ngày",
        items: [
          "Ngày 1 (hôm nay): mỗi nhóm chọn 3 từ bạn CHẮC sẽ dùng, viết một câu có “vì sao / đến đâu” (không chỉ câu định nghĩa).",
          "Ngày 3: thẻ nhớ Việt → Anh (nút “Che từ” ở mỗi khối). Ngày 7: dùng ít nhất 4 từ trong một bài Task 2 và 2 từ trong Part 3 ghi âm.",
          "Ba chữ dễ dùng quá đà: paradigm shift (chỉ cho thay đổi tận gốc), mollycoddle / wrap in cotton wool (thân mật — chỉ khi nói), serendipity (một lần mỗi bài là đủ).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d20-viet",
    kind: "writing",
    title: "Viết Task 2: Problem / solution band 8 — chuỗi cơ chế, giải pháp đúng tầng của nguyên nhân, xếp ưu tiên và nói rõ cái giá (bài mẫu band 7 và band 8 cùng đề “cận thị ở trẻ em”)",
    goal: "Viết trọn một bài problem / solution (hoặc cause / solution) 280–320 từ ở mức TR 8 và CC 8: nguyên nhân được giải thích bằng CƠ CHẾ chứ không chỉ gọi tên, mỗi giải pháp khớp đúng tầng của nguyên nhân nó chữa (cá nhân · tổ chức · cấu trúc), các giải pháp được xếp ưu tiên, và giải pháp mạnh nhất có kèm cái giá hoặc giới hạn của nó — bằng các khung câu có giả định ngầm và thức giả định của Ngày 19.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **TR 7 → 8**: band 8 “trả lời đầy đủ mọi phần của đề, ý chính được phát triển, mở rộng và hỗ trợ tốt”. Ở dạng này, chữ quan trọng là ==phát triển==: nguyên nhân phải có CƠ CHẾ, giải pháp phải có LÝ DO hiệu quả.",
          "Ôn: Tập 3 Ngày 18 (giải pháp gắn đúng nguyên nhân) · Tập 4 Ngày 22 (đánh giá khả thi). Hôm nay thêm ba thứ: **tầng** của nguyên nhân, **ưu tiên**, và **cái giá** của giải pháp mạnh nhất.",
          "Ma trận 4 phút trước khi viết: nguyên nhân → tầng → giải pháp đúng tầng → xếp ưu tiên → một giới hạn.",
          "Bài mẫu band 7 và band 8 cùng đề **cận thị ở trẻ em**: cùng ý “điện thoại, học nhiều”, khác ở chỗ band 8 thấy được nguyên nhân thật nằm ở đâu.",
          "Sáu khung câu giải pháp band 8 — dùng lại giả định ngầm, thức giả định và ; however, của Ngày 19.",
          "Cuối bài: hai đề để viết (động vật hoang dã vào thành phố · ít người học khoa học) — dùng từ của Bài 1.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ba biến thể của đề — và cái band 8 thêm vào mỗi biến thể" },
      {
        t: "table",
        head: ["Đề hỏi", "Thân bài 1", "Thân bài 2", "Bẫy band 7"],
        rows: [
          ["What **problems** does this cause? What **solutions**…?", "2 vấn đề, mỗi vấn đề một chuỗi hệ quả", "giải pháp cho CHÍNH hai vấn đề đó", "giải pháp đi lạc sang nguyên nhân chưa từng nêu"],
          ["What are the **causes**? What **measures**…?", "2 nguyên nhân, có cơ chế", "giải pháp đánh vào đúng nguyên nhân", "nêu nguyên nhân như danh sách (technology, stress…) không giải thích"],
          ["What problems…? **Who** should be responsible for solving them?", "2 vấn đề", "ai làm gì, và vì sao chủ thể đó chứ không phải chủ thể khác", "nói “government should…” cho mọi việc"],
        ],
        caption: "Đọc đề, gạch chân hai chữ đầu của hai câu hỏi — đó là hai thân bài (nối Tập 5 Ngày 14: đếm nhiệm vụ)",
      },
      {
        t: "note",
        title: "📌 Ba điều cả ba biến thể có chung ở band 8",
        items: [
          "Mỗi nguyên nhân / vấn đề có ==một câu cơ chế==: “A dẫn đến B vì…”. Không có câu đó, ý chỉ được “nêu”, chưa được “phát triển”.",
          "Mỗi giải pháp ==gọi lại đúng nguyên nhân nó chữa== — bằng từ quy chiếu (This lack of daylight…, To address the first of these…), không bằng Firstly / Secondly.",
          "Ít nhất một giải pháp có ==giới hạn hoặc cái giá== (would help at the margin, but…). Người band 8 không hứa giải pháp nào “solve the problem” trọn vẹn.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Band 7 và band 8 — năm chỗ khác nhau" },
      {
        t: "table",
        head: ["", "Band 7 (ước tính)", "Band 8 (ước tính)"],
        rows: [
          ["**Nguyên nhân**", "gọi tên: technology, pressure, lack of awareness", "giải thích cơ chế: prolonged close work appears to encourage the eye to grow too long"],
          ["**Tầng**", "mọi giải pháp là việc của cá nhân hoặc “the government”", "phân biệt cá nhân (parents) · tổ chức (schools) · cấu trúc (exam system, city planning) — giải pháp đặt ĐÚNG tầng của nguyên nhân"],
          ["**Ưu tiên**", "ba giải pháp ngang nhau: Firstly, Secondly, Finally", "giải pháp mạnh nhất đứng đầu và được nói thẳng: the priority should be…"],
          ["**Cái giá / giới hạn**", "“this problem can be solved”", "would help at the margin, but · would merely move the problem · cannot prevent, yet matters because…"],
          ["**Ai làm**", "the government should… ba lần", "chủ thể cụ thể + vì sao chủ thể đó: since a policy that relies on parents will reach only…"],
        ],
        caption: "Cùng hai thân bài — khác ở chiều sâu của từng ý",
      },
      { t: "rule", formula: "Nguyên nhân + cơ chế  →  giải pháp đúng tầng + vì sao hiệu quả  →  ưu tiên  →  một giới hạn", vi: "Bốn mắt xích của một bài problem / solution band 8." },

      /* ── 3 ── */
      { t: "h", text: "3. Ma trận nguyên nhân ↔ giải pháp — dựng trong 4 phút" },
      {
        t: "sodo",
        kind: "flow",
        title: "Bốn phút trước khi viết",
        steps: [
          { label: "Liệt kê 3–4 nguyên nhân", sub: "30 giây, chưa chọn" },
          { label: "Gắn tầng cho mỗi cái", sub: "cá nhân · tổ chức · cấu trúc" },
          { label: "Chọn 2 nguyên nhân sâu nhất", sub: "cái nào giải thích được nhiều nhất?" },
          { label: "Giải pháp đúng tầng", sub: "nguyên nhân cấu trúc ⇒ giải pháp cấu trúc" },
          { label: "Xếp ưu tiên + một giới hạn", sub: "giải pháp nào mạnh nhất, và nó tốn gì?" },
        ],
      },
      {
        t: "table",
        head: ["Nguyên nhân (đề hôm nay)", "Tầng", "Giải pháp đúng tầng", "Giới hạn"],
        rows: [
          ["Nhìn gần nhiều giờ (sách, màn hình)", "cá nhân + tổ chức", "giới hạn màn hình giải trí; quy tắc nghỉ mắt trong lớp", "cấm màn hình không chạm tới bài tập, học thêm"],
          ["Ít thời gian ngoài trời, thiếu ánh sáng ban ngày", "tổ chức + cấu trúc", "trường học buộc phải có giờ học / giờ chơi ngoài trời", "tốn quỹ thời gian của chương trình; trường thành phố thiếu sân"],
          ["Hệ thống thi cử cạnh tranh, học thêm", "cấu trúc", "giảm áp lực thi ở tiểu học, giới hạn giờ học thêm", "chậm, khó về chính trị"],
          ["Phát hiện muộn", "tổ chức", "khám mắt định kỳ ở trường", "không ngăn được bệnh, chỉ ngăn nó nặng thêm"],
        ],
        caption: "Ma trận cho đề cận thị — chọn hai hàng giữa làm xương sống",
      },
      {
        t: "mcq",
        id: "t5d20-viet-khop",
        title: "Giải pháp nào khớp đúng tầng của nguyên nhân? (6 câu)",
        items: [
          { q: "1. Nguyên nhân: “Ở nhiều thành phố, xe buýt thưa và chậm nên người dân phải đi ô tô.” Giải pháp đúng tầng:", options: ["Campaigns encouraging people to feel guilty about driving.", "Investment in frequent, reliable bus services before charges on cars are introduced.", "Asking drivers to share cars with colleagues."], correct: 1, why: "Nguyên nhân thuộc tầng cấu trúc (thiếu phương án thay thế) ⇒ giải pháp phải tạo phương án thay thế. A và C đặt gánh nặng lên cá nhân." },
          { q: "2. Nguyên nhân: “Nhiều người già cô đơn vì cửa hàng, bưu điện gần nhà đã đóng.” Giải pháp đúng tầng:", options: ["Encouraging older people to make more effort to socialise.", "Giving older people tablets for video calls.", "Planning rules that protect or replace local meeting places."], correct: 2, why: "Mất nơi gặp gỡ là nguyên nhân cấu trúc ⇒ quy hoạch giữ / thay nơi gặp gỡ. B chỉ thay thế một phần, A đổ lỗi cho nạn nhân." },
          { q: "3. Nguyên nhân: “Trẻ em ít vận động vì phụ huynh sợ cho con chơi ngoài đường.” Giải pháp nào gọi lại đúng nguyên nhân?", options: ["Making streets near schools safer, for example by closing them to traffic at certain times.", "Banning video games for children under twelve.", "Adding more PE lessons to the timetable."], correct: 0, why: "Nguyên nhân là nỗi sợ (an toàn đường phố) ⇒ giải pháp đánh vào an toàn. B, C có thể giúp nhưng không chạm tới nguyên nhân đã nêu." },
          { q: "4. Câu nào thể hiện ƯU TIÊN rõ nhất?", options: ["Another solution is to raise awareness.", "The government should also consider other measures.", "Of these measures, the first matters most, because the others depend on it."], correct: 2, why: "Band 8 nói thẳng giải pháp nào quan trọng nhất và vì sao. A, B chỉ cộng thêm." },
          { q: "5. Câu nào nêu GIỚI HẠN của giải pháp theo kiểu band 8?", options: ["This solution will definitely solve the problem.", "Fines would help at the margin, but on their own they would merely punish those with no alternative.", "This solution has some disadvantages."], correct: 1, why: "Giới hạn cụ thể (at the margin, merely punish those with no alternative) + giả định ngầm would. C mơ hồ, A hứa quá mức." },
          { q: "6. Đề hỏi “What problems does this cause? What solutions…?” Thân bài 2 của người band 7 hay mắc lỗi nào?", options: ["Giải pháp nhắm vào nguyên nhân thay vì vào vấn đề đề hỏi.", "Dùng quá nhiều ví dụ.", "Viết giải pháp quá cụ thể."], correct: 0, why: "Biến thể 1 hỏi VẤN ĐỀ (hệ quả) ⇒ giải pháp phải xử lý vấn đề đó. Nhảy sang nguyên nhân chưa nêu là lạc TR." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Đề hôm nay — đếm nhiệm vụ trước khi đọc bài mẫu" },
      {
        t: "p",
        text: "**In many countries, a rapidly growing proportion of children are becoming short-sighted. What are the causes of this, and what measures could be taken to address it?** Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      },
      {
        t: "table",
        head: ["Chữ trong đề", "Nhiệm vụ", "Chỗ trong bài"],
        rows: [
          ["**causes** (số nhiều)", "≥ 2 nguyên nhân, có cơ chế", "Thân bài 1"],
          ["**measures** … **to address it**", "giải pháp cho CHÍNH các nguyên nhân đó", "Thân bài 2"],
          ["**a rapidly growing proportion**", "giải thích vì sao TĂNG (cái gì đã đổi?), không chỉ vì sao có", "Mở bài + Thân bài 1"],
          ["**children**", "giải pháp phải đến được với trẻ — qua trường, gia đình, hệ thống", "Thân bài 2: ai làm"],
        ],
        caption: "Bốn chữ — bốn đòi hỏi",
      },
      {
        t: "note",
        title: "💡 Mẹo: “growing” trong đề là một nhiệm vụ giấu",
        items: [
          "Đề không hỏi vì sao trẻ cận thị, mà vì sao ==ngày càng nhiều trẻ== cận thị. Nguyên nhân bạn nêu phải là thứ ĐÃ THAY ĐỔI trong một hai thế hệ (thời gian ngoài trời, cách học), không phải thứ luôn có (di truyền).",
          "Di truyền có thể nhắc một câu để loại: “Genes cannot explain a change this fast.” — đó là câu cho thấy bạn hiểu đề.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Hai bài mẫu cùng đề — band 7 và band 8 đặt cạnh nhau" },
      { t: "p", text: "Đọc bài band 7 trước. Nó đúng, rõ, đủ hai phần — và vì thế đáng 7. Rồi đọc bài band 8 và tìm năm chỗ khác ở mục 2." },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 260 từ",
        paras: [
          { text: "Nowadays, more and more children in many countries are becoming short-sighted. This is a serious problem because it can affect their studies and their future careers. This essay will discuss the main causes of this problem and suggest some possible solutions." },
          { text: "The main cause of this problem is technology. Children today spend many hours using smartphones, tablets and computers, both for studying and for entertainment. Looking at a screen for a long time is harmful to their eyes, and many children use their phones in bed in the dark, which makes the situation worse. Another cause is the education system. In many Asian countries, students have to study very hard, and they spend most of the day reading books and doing homework. As a result, their eyes become tired and their eyesight gradually becomes worse." },
          { text: "There are several solutions to this problem. Firstly, parents should limit the time their children spend on electronic devices. For example, they could allow their children to use phones for only one hour a day and not at night. Secondly, the government should reduce the amount of homework so that students have more free time to relax and rest their eyes. Finally, schools should organise regular eye tests, so that problems can be found early and children can get glasses before their eyesight becomes very bad." },
          { text: "In conclusion, short-sightedness in children is mainly caused by technology and the pressure of studying. If parents, schools and the government work together, I believe this problem can be solved and children will have healthier eyes in the future." },
        ],
      },
      { t: "p", text: "Bài band 8 dưới đây dài hơn khoảng 70 từ — nhưng không phải vì thêm ý. Đếm: vẫn hai nguyên nhân, ba giải pháp. Phần dài thêm là **cơ chế**, **tầng**, **ưu tiên** và **giới hạn**." },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 333 từ",
        paras: [
          { text: "In many countries, and particularly in the cities of East Asia, short-sightedness has gone from an occasional childhood complaint to something close to the norm. Its causes lie less in any single device than in the way childhood itself is now spent, and the most effective remedies would therefore change the shape of children's days rather than simply ration their screens." },
          { text: "The usual culprit is the smartphone, but the evidence points to something broader. Prolonged close work of any kind, whether reading a textbook or scrolling a feed, appears to encourage the eye to grow too long, and children in highly competitive education systems may spend ten hours or more a day focusing on objects a few centimetres away. Equally important is what they are no longer doing. A growing body of research suggests that time outdoors protects against myopia, probably because bright daylight helps to regulate the eye's growth; a child who moves from classroom to tutoring centre to bedroom may barely see the sun on a school day. Genes, which have not changed in a generation, cannot explain a rise this rapid." },
          { text: "It follows that the priority should be daylight rather than prohibition. It is essential that primary schools be required to hold part of every school day outdoors, since a measure that relies on parents will reach only those families with the time and space to act; where schools have extended outdoor breaks, the number of new cases has reportedly fallen. Limits on recreational screen time would help at the margin, but a rule that ignored homework and private tuition would merely move the close work from one page to another. Regular eye examinations, finally, cannot prevent the condition, yet they matter, because short-sightedness that goes uncorrected in childhood can worsen quickly." },
          { text: "In short, more children are short-sighted largely because they spend their days indoors and close to a page or a screen. Without changes to the school day itself, other measures will treat the symptoms rather than the cause." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Khác nhau ở đâu? — bốn tiêu chí" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["**TR**", "hai nguyên nhân được GỌI TÊN (technology, pressure); “harmful to their eyes” không giải thích; bỏ qua chữ growing; giải pháp ngang hàng, kết “can be solved”", "cơ chế (close work → eye grows too long; daylight regulates growth); trả lời growing (genes cannot explain a rise this rapid); ưu tiên rõ (the priority should be daylight); mỗi giải pháp có giới hạn"],
          ["**CC**", "Firstly / Secondly / Finally · This essay will discuss…", "It follows that · Equally important is what… · finally đặt giữa câu; quy chiếu: a measure that relies on parents · the close work"],
          ["**LR**", "harmful · very bad · healthier eyes · work together", "culprit · prolonged close work · a growing body of research · at the margin · uncorrected · treat the symptoms rather than the cause"],
          ["**GRA**", "câu ghép and / so that đúng; một câu điều kiện loại 1 cuối bài", "thức giả định (be required) · giả định ngầm (a rule that ignored… would merely move) · mệnh đề quan hệ chêm (Genes, which…) · đảo cấu trúc nhấn (Equally important is what…)"],
        ],
        caption: "Band 7 không sai ở đâu cả — nó chỉ dừng ở mức “nêu”",
      },
      {
        t: "note",
        title: "📌 Đếm trong bài band 8",
        items: [
          "**Cơ chế:** 2 câu (close work → eye growth · daylight → regulation) + 1 câu loại nguyên nhân sai (genes).",
          "**Tầng:** trường học (tổ chức) là giải pháp chính; phụ huynh (cá nhân) bị nói rõ là KHÔNG đủ (will reach only those families…).",
          "**Giới hạn:** 3 — at the margin · would merely move · cannot prevent, yet matter.",
          "**Ngữ pháp Ngày 19:** 1 câu thức giả định · 1 giả định ngầm · 1 chấm phẩy nối hai mệnh đề · 0 chữ if.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Sáu khung câu cho phần giải pháp band 8" },
      {
        t: "patterns",
        rows: [
          { formula: "The most effective response would target N, since S V.", vi: "Ưu tiên + lý do hiệu quả.", examples: [{ en: "The most effective response would target the lack of daylight, since that is what has changed most in children's lives.", vi: "Biện pháp hiệu quả nhất sẽ nhắm vào việc thiếu ánh sáng ban ngày, vì đó là điều thay đổi nhiều nhất trong đời sống trẻ." }] },
          { formula: "It follows that the priority should be N rather than M.", vi: "Nối thân bài 1 sang thân bài 2: giải pháp “suy ra” từ nguyên nhân.", examples: [{ en: "It follows that the priority should be prevention rather than treatment.", vi: "Suy ra ưu tiên nên là phòng ngừa chứ không phải chữa trị." }] },
          { formula: "It is essential that N be V3, since S V.", vi: "Thức giả định (Ngày 19) cho giải pháp mạnh nhất — một lần mỗi bài.", examples: [{ en: "It is essential that landlords be required to register, since unregistered flats cannot be inspected.", vi: "Điều cốt yếu là chủ nhà phải bị buộc đăng ký, vì nhà không đăng ký thì không kiểm tra được." }] },
          { formula: "N would help at the margin, but on its own it would merely V.", vi: "Giới hạn của một giải pháp phụ.", examples: [{ en: "Higher fines would help at the margin, but on their own they would merely punish those with no alternative.", vi: "Phạt nặng hơn sẽ giúp được chút ít, nhưng tự nó chỉ trừng phạt những người không có lựa chọn khác." }] },
          { formula: "N cannot V, yet it matters, because S V.", vi: "Giữ một giải pháp yếu nhưng nói đúng vai của nó.", examples: [{ en: "Awareness campaigns cannot change behaviour by themselves, yet they matter, because policies without public support rarely survive.", vi: "Chiến dịch nâng cao nhận thức tự chúng không đổi được hành vi, nhưng vẫn quan trọng, vì chính sách thiếu sự ủng hộ hiếm khi tồn tại." }] },
          { formula: "Responsibility should lie with N rather than M, because S V.", vi: "Ai làm — và vì sao chủ thể đó.", examples: [{ en: "Responsibility should lie with schools rather than parents, because only schools reach every child.", vi: "Trách nhiệm nên thuộc về nhà trường hơn là phụ huynh, vì chỉ nhà trường mới tiếp cận được mọi đứa trẻ." }] },
        ],
      },
      { t: "rule", formula: "The most effective response would target N, since…  ·  It is essential that N be V3  ·  N would help at the margin, but…", vi: "Ba khung đủ cho một thân bài giải pháp: ưu tiên – đề xuất – giới hạn." },
      {
        t: "quiz",
        id: "t5d20-viet-khung-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — khung câu giải pháp (4 câu)",
        grammar: "would target · It is essential that N be V3 · would help at the margin, but… merely · Responsibility should lie with",
        items: [
          { q: "Biện pháp hiệu quả nhất sẽ nhắm vào chi phí nhà ở, vì đó là lý do chính khiến người trẻ rời thành phố.", answers: ["The most effective response would target the cost of housing, since that is the main reason young people leave the city.", "The most effective response would target housing costs, since that is the main reason young people leave the city.", "The most effective measure would target the cost of housing, since that is the main reason young people leave the city.", "The most effective response would target the cost of housing, since this is the main reason why young people leave the city."], hint: "would target · since" },
          { q: "Điều cốt yếu là mọi trường học phải được cấp một nhân viên tư vấn.", answers: ["It is essential that every school be given a counsellor.", "It is essential that every school be provided with a counsellor.", "It is essential that every school should be given a counsellor.", "It is essential that each school be given a counsellor."], hint: "It is essential that + N + be V3" },
          { q: "Thuế đường sẽ giúp được chút ít, nhưng tự nó sẽ chỉ khiến người nghèo trả nhiều hơn.", answers: ["A sugar tax would help at the margin, but on its own it would merely make poorer people pay more.", "A sugar tax would help at the margin, but on its own it would merely make the poor pay more.", "A tax on sugar would help at the margin, but on its own it would merely make poorer people pay more.", "A sugar tax would help at the margin, but by itself it would merely make poorer people pay more."], hint: "would help at the margin, but on its own… merely" },
          { q: "Trách nhiệm nên thuộc về các công ty hơn là người tiêu dùng, vì chỉ các công ty mới kiểm soát được bao bì.", answers: ["Responsibility should lie with companies rather than consumers, because only companies control packaging.", "Responsibility should lie with companies rather than consumers, because only companies can control packaging.", "Responsibility should lie with manufacturers rather than consumers, because only they control packaging.", "Responsibility should lie with companies rather than with consumers, because only companies control packaging."], hint: "Responsibility should lie with N rather than M" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Kiểm tra cuối bài (6 câu)" },
      {
        t: "mcq",
        id: "t5d20-viet-kiem",
        title: "Chọn phương án đúng",
        items: [
          { q: "1. Câu nào là câu CƠ CHẾ (phát triển ý) chứ không chỉ gọi tên nguyên nhân?", options: ["Another cause is stress.", "Stress is a big problem nowadays.", "Chronic stress disrupts sleep, and poor sleep in turn makes stress harder to manage."], correct: 2, why: "C nói A dẫn đến B và vòng lại (in turn) — đó là cơ chế. A, B chỉ gọi tên." },
          { q: "2. Đề: “More young people are moving to big cities. What problems does this cause for rural areas? What can be done?” Thân bài 2 nên nói về:", options: ["giải pháp cho các vấn đề của NÔNG THÔN đã nêu ở thân bài 1", "giải pháp cho tình trạng quá tải của thành phố", "lợi ích của việc sống ở thành phố"], correct: 0, why: "Đề khoanh vùng “for rural areas” ⇒ giải pháp cho vấn đề nông thôn. B lạc đối tượng, C lạc dạng." },
          { q: "3. Câu kết nào hợp với bài band 8?", options: ["If everyone works together, this problem will be solved completely.", "Without changes to how cities are planned, other measures will treat the symptoms rather than the cause.", "In conclusion, there are many causes and many solutions."], correct: 1, why: "B chốt lại ưu tiên và giới hạn bằng giả định ngầm. A hứa quá mức; C rỗng." },
          { q: "4. Giải pháp “Parents should spend more time with their children” cho vấn đề “giờ làm việc dài” thiếu điều gì?", options: ["Ví dụ về một gia đình.", "Nó đặt giải pháp ở tầng cá nhân trong khi nguyên nhân thuộc tầng tổ chức (giờ làm do chủ lao động quy định).", "Một từ nối ở đầu câu."], correct: 1, why: "Nguyên nhân là giờ làm (do công ty / luật lao động) ⇒ giải pháp đúng tầng: luật giờ làm, giờ làm linh hoạt." },
          { q: "5. Trong bài band 8 về cận thị, câu “Genes… cannot explain a rise this rapid” có tác dụng gì?", options: ["Thêm một nguyên nhân thứ ba.", "Trả lời chữ “growing” trong đề bằng cách loại một nguyên nhân không đổi theo thời gian.", "Làm bài dài hơn 250 từ."], correct: 1, why: "Đề hỏi vì sao TĂNG nhanh; di truyền không đổi trong một thế hệ nên bị loại — câu này cho thấy người viết đọc đúng đề." },
          { q: "6. Câu nào dùng thức giả định đúng cho phần đề xuất?", options: ["It is vital that every factory reports its emissions.", "It is vital that every factory report its emissions.", "It is vital for every factory reports its emissions."], correct: 1, why: "It is vital that + S + V nguyên mẫu trần (report, không reports) — Ngày 19 mục 4." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Viết bài — AI chấm 4 tiêu chí (40 phút mỗi bài)" },
      {
        t: "note",
        title: "💡 Cách làm: ma trận trước, viết sau",
        items: [
          "4 phút đầu: dựng ma trận ở mục 3 (nguyên nhân / vấn đề → tầng → giải pháp → giới hạn). Không viết câu nào trước khi ma trận xong.",
          "Thân bài 2 mở bằng ưu tiên (The most effective response would… / It follows that the priority should be…). Ít nhất một giới hạn.",
          "Soát lượt cuối theo Ngày 19: ≤ 2 chữ if, một câu thức giả định, dấu câu tám quy tắc. Dùng ít nhất 4 từ của Bài 1.",
        ],
      },
      {
        t: "essay",
        id: "t5d20-viet-bai",
        task: "Task 2",
        prompt: "In many parts of the world, wild animals such as foxes, monkeys and wild boar are increasingly entering towns and cities. What problems does this cause, and what measures could be taken to solve them? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Biến thể 1: problems → solutions. Thân bài 2 phải giải quyết CHÍNH các vấn đề đã nêu.",
          "Vấn đề có thể có hai phía: cho người (an toàn, bệnh — zoonotic, thiệt hại) và cho động vật (bị giết, phụ thuộc thức ăn thừa).",
          "Giải pháp đúng tầng: rác thải (tổ chức) · hành lang động vật / quy hoạch (cấu trúc — wildlife corridor, habitat) · cull là lựa chọn cuối, nêu rõ cái giá.",
          "Từ Bài 1: human–wildlife conflict · cull · wildlife corridor · zoonotic · territorial · instinct.",
        ],
      },
      {
        t: "essay",
        id: "t5d20-viet-bai-2",
        task: "Task 2",
        prompt: "(Luyện thêm — biến thể cause / solution) In many countries, fewer young people are choosing to study science at university. What are the causes of this, and what measures could be taken to reverse the trend? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Nguyên nhân phải có cơ chế: ví dụ cách dạy khoa học ở phổ thông (học thuộc thay vì thí nghiệm), hình ảnh nghề nghiệp, publish-or-perish và lương nghiên cứu thấp.",
          "Chữ “fewer” = xu hướng ⇒ nguyên nhân là thứ đã thay đổi gần đây.",
          "Từ Bài 1: scientific literacy · serendipity · publish or perish · paradigm shift (chỉ khi thật sự đúng) · inconclusive.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d20-nghe",
    kind: "listening",
    title: "Nghe Part 4 kéo dài: bài giảng ~10 phút giọng vùng (Ireland, có chủ toạ New Zealand và hỏi – đáp giọng Úc · Canada) — theo dấu động vật di cư, 20 câu",
    goal: "Giữ được mạch một bài giảng dài gấp đôi Part 4 thật (~10 phút, ~1.700 từ, ~170 từ/phút) bằng bộ khung ghi chú theo tiêu đề, không bị lạc khi người nói đổi giọng (Ireland, New Zealand, Úc, Canada), và đúng ít nhất 17/20 câu thuộc ba dạng Notes · Table · MCQ — trong đó có những câu đáp án là con số bị nói sai rồi sửa, và những câu hỏi nằm trong phần hỏi – đáp cuối bài.",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Mục tiêu tập: **Listening ≥ 35/40**. Part 4 là nơi mất điểm cuối cùng của người band 7.5 — không vì từ khó mà vì ==mất mạch giữa chừng rồi không bắt lại được==.",
          "Hôm nay bài giảng dài **gấp đôi** Part 4 thật (~10 phút). Thi thật thấy 5 phút là “ngắn” — đó là mục đích của bài tập quá tải này.",
          "Bốn giọng: giảng viên **Ireland** (nam), chủ toạ **New Zealand**, hai sinh viên hỏi **Úc** và **Canada**. Giọng Scotland không có giọng máy — không giả; bảng mục 2 mô tả bằng lời.",
          "Ba dạng: Notes 1–8 · Table 9–14 · MCQ 15–20. Ba câu cuối nằm trong phần **hỏi – đáp** — nhiều người tưởng bài đã hết và thôi nghe.",
          "Bẫy chính: **số bị nói rồi sửa** (“the manufacturers claim fifty… in practice about a hundred and fifty”), **giả định sai bị bác** (“people often assume swallows… it was starlings”).",
          "Từ vựng Bài 1 (Animals, Science) xuất hiện dày trong bài giảng — nghe lại lần hai để bắt chúng.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bài giảng 10 phút — giữ mạch bằng khung, không bằng trí nhớ" },
      {
        t: "table",
        head: ["Vấn đề", "Ở bài 5 phút", "Ở bài 10 phút", "Cách xử lý"],
        rows: [
          ["Số ý", "3–4 phần", "5–6 phần + hỏi – đáp", "chép tiêu đề nhỏ của ghi chú thành cột trái TRƯỚC khi nghe"],
          ["Lạc mạch", "lỡ một câu, câu sau vẫn gần", "lỡ một đoạn, có thể mất 4–5 câu", "nghe câu báo chuyển phần: “Let me turn now to…”, “The third approach…”"],
          ["Mệt", "không đáng kể", "phút 6–8 tập trung tụt rõ", "đặt chấm mốc ở giữa đề; tới đó hít sâu, đọc nhanh 3 câu tiếp theo"],
          ["Phần cuối", "kết luận", "hỏi – đáp, giọng khác", "đọc câu 19–20 trước: tên người hỏi nằm trong câu hỏi"],
        ],
        caption: "Bài dài không khó hơn từng câu — nó khó hơn ở sức bền",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Khung ghi chú cho bài giảng hôm nay — chép trước khi nghe",
        steps: [
          { label: "Early tracking", sub: "rings · ai · năm" },
          { label: "Geolocators", sub: "đo gì → suy ra gì · điểm yếu" },
          { label: "Five methods (table)", sub: "ưu điểm | giới hạn" },
          { label: "Findings & costs", sub: "godwit · penguins · bias" },
          { label: "Q&A", sub: "Maddie · Ethan" },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Bốn giọng hôm nay — nghe ra điều gì" },
      {
        t: "table",
        head: ["Giọng", "Nghe thấy gì", "Từ dễ lỡ"],
        rows: [
          ["**Ireland** (ie)", "r đọc rõ ở cuối từ (như Mỹ); ngữ điệu lên xuống nhiều; th đôi khi gần t / d", "thirty / thirteen, three / tree — nghe cả câu để chọn"],
          ["**New Zealand** (nz)", "i ngắn bị “nuốt” về giữa (six nghe gần “sux”); e gần i (pen ≈ pin)", "six · ten · left · desk"],
          ["**Úc** (au)", "ay → gần “ai” (day ≈ “die”); câu kể hay lên giọng cuối", "today · Monday · eight"],
          ["**Canada** (ca)", "r rõ, t giữa hai nguyên âm thành d nhẹ (metre ≈ “meder”); about hơi tròn", "ninety · thirty · about"],
          ["**Scotland** — không có giọng máy", "r rung đầu lưỡi; nguyên âm ngắn, phẳng; “wee”, “aye” trong lời nói thân mật", "nhận ra bằng mô tả; luyện bằng nguồn người thật (BBC Scotland)"],
        ],
        caption: "Mô tả để nhận ra, không phải để bắt chước",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi gặp giọng lạ",
        items: [
          "Đổi đáp án vì một âm lạ: nghe six giọng New Zealand thành “sex” rồi cho rằng mình nghe nhầm cả câu. Giọng lạ đổi NGUYÊN ÂM, hiếm khi đổi phụ âm — bám vào phụ âm.",
          "Hoảng ở 20 giây đầu. Ai cũng cần 30–40 giây để “chỉnh tai” theo một giọng mới; câu hỏi đầu thường để dành thời gian đó.",
          "Tin rằng giọng Anh-Anh là “chuẩn” nên dễ nhất. Đề thật trộn giọng — và giọng dễ nhất là giọng bạn đã nghe nhiều nhất.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Khởi động — Practice 1: bốn mẩu ngắn, bốn giọng" },
      { t: "p", text: "Nghe MỘT lần. Mỗi mẩu một câu hỏi, **ONE WORD OR A NUMBER**. Mục đích: chỉnh tai trước bài giảng dài." },
      {
        t: "listen",
        id: "t5d20-nghe-khoi-dong",
        title: "Practice 1 — Four short extracts (four accents)",
        dan: { so: "Day 20, Recording 1", boiCanh: "four short extracts, each spoken in a different accent.", cau: [1, 4] },
        note: "Khoảng 1 phút. A: Ireland · B: New Zealand · C: Úc · D: Canada.",
        lines: [
          { who: "A", voice: "ie-nam", text: "Extract A. The field trip's been moved, I'm afraid. It was going to be the thirteenth, but the coach company can't do it, so it's now the thirtieth. Same time, same place." },
          { who: "B", voice: "nz-nu", text: "Extract B. We've only got six places left on the kayaking course, so if you're keen, sign up at the desk today rather than tomorrow." },
          { who: "C", voice: "au-nam", text: "Extract C. Sorry, the reptile house is shut on Mondays for cleaning. Come back on Tuesday and you'll get the morning talk as well." },
          { who: "D", voice: "ca-nu", text: "Extract D. The trail starts behind the visitor centre. Walk about ninety metres past the old mill and you'll see the first marker." },
        ],
      },
      {
        t: "quiz",
        id: "t5d20-nghe-khoi-dong-dien",
        kind: "fill",
        title: "Practice 1 — ONE WORD OR A NUMBER",
        items: [
          { q: "A. The field trip is now on the ___ of the month.", answers: ["30th", "thirtieth", "30"], hint: "“It was going to be the thirteenth… so it's now the thirtieth.” Số bị nói rồi sửa." },
          { q: "B. Number of places left on the kayaking course: ___", answers: ["6", "six"], hint: "“We've only got six places left” — six giọng New Zealand nghe gần “sux”; bám vào phụ âm s…ks." },
          { q: "C. The reptile house will be open again on ___ .", answers: ["Tuesday"], hint: "“shut on Mondays… Come back on Tuesday”. Monday là nhiễu." },
          { q: "D. Distance from the old mill to the first marker: about ___ metres.", answers: ["90", "ninety"], hint: "“about ninety metres past the old mill” — t của ninety giọng Canada nhẹ thành d." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bài chính — Part 4 kéo dài, Questions 1–20 (≈ 10 phút)" },
      { t: "p", text: "Bạn có **1 phút** đọc câu 1–20 (đề thật cho 30–45 giây với 10 câu). Chép khung ở mục 1. Gạch chân: **most** (câu 15), **attitude** (câu 18), tên **Maddie**, **Ethan** (câu 19–20). Nghe MỘT lần, không dừng." },
      {
        t: "listen",
        id: "t5d20-nghe-bai",
        title: "Part 4 (extended) — Following animals across the planet: how migration is tracked",
        dan: { so: "Day 20, Recording 2", boiCanh: "a guest lecture on the methods scientists use to track animal migration, introduced by the course leader and followed by questions from students.", cau: [1, 20] },
        note: "Khoảng 10 phút, ~170 từ/phút. Chủ toạ Dr Rangi: giọng New Zealand; Dr Moloney: giọng Ireland; Maddie: giọng Úc; Ethan: giọng Canada.",
        lines: [
          { who: "Dr Rangi", voice: "nz-nu", text: "Good afternoon, everyone. As you know, this week's guest lecture is part of the animal ecology module, and I'm very pleased to welcome Dr Cian Moloney, who has spent the last fifteen years putting very small devices on very small birds. He'll talk for about forty minutes and then take questions. Cian." },
          { who: "Dr Moloney", voice: "ie-nam", text: "Thanks, Aroha. I'm going to start with a simple question that turned out to be anything but simple: where do animals go? For most of history the honest answer was that we had no idea. Some birds simply vanished in autumn and reappeared in spring, and as late as the eighteenth century serious naturalists suggested that swallows spent the winter asleep at the bottom of ponds." },
          { who: "Dr Moloney", voice: "ie-nam", text: "The first real method was startlingly simple. In 1899 a Danish schoolteacher called Hans Christian Mortensen caught a number of birds near his home, fitted each with a small metal ring stamped with a number and his address, and let them go. People often assume he chose swallows or storks, because those are the birds everyone associates with migration, but in fact they were starlings, which were common and easy to catch. He had tried zinc first, which turned out to be too heavy, and settled on aluminium. Bird ringing, as it's called, is still the backbone of the field. But it has one enormous weakness. A ring tells you something only if somebody finds the bird again, and the great majority of rings that came back in those early decades came from birds that were found dead. You learned where a bird ended up, not how it got there." },
          { who: "Dr Moloney", voice: "ie-nam", text: "So for most of the twentieth century, the routes in between were guesswork. The breakthrough for small birds came with a device called a light-level geolocator. It's a tiny logger that does nothing more than record how bright it is, every few minutes, for a year. From that record you can work out two things. The length of the day tells you your latitude, how far north or south you are. And the time of local noon, the midpoint between sunrise and sunset, tells you your longitude. It's the same principle sailors used centuries ago, carried on the back of a bird weighing less than a teaspoon of sugar." },
          { who: "Dr Moloney", voice: "ie-nam", text: "Geolocators have their weaknesses, though, and they're worth knowing. The manufacturers will tell you the positions are accurate to about fifty kilometres. In practice, on a good day, you're doing well to get within about a hundred and fifty, and shade from vegetation or a cloudy week makes it worse. Then there's the equinox problem. Twice a year, around the equinoxes, day length is roughly the same everywhere on Earth, so for a few weeks you lose your latitude altogether. And, crucially, the device stores its data rather than sending it, so you have to catch the same bird again a year later to download anything. If the bird dies, or simply chooses a different breeding site, the data are lost." },
          { who: "Dr Moloney", voice: "ie-nam", text: "Even so, the results have been astonishing. The best-known example is the Arctic tern, which breeds in the far north and spends the northern winter in the seas around Antarctica. Older textbooks gave figures of around forty thousand kilometres a year for its journey. When a team fitted geolocators to terns breeding in Greenland and Iceland, the birds turned out to travel about seventy thousand kilometres a year, because they don't fly in a straight line. They zigzag across the Atlantic, following the winds." },
          { who: "Dr Moloney", voice: "ie-nam", text: "Let me turn now to the other tools, because no single method does everything. The obvious one is GPS. A GPS tag gives you positions accurate to a few metres, which is wonderful, but it needs far more power, and power means weight. The rule of thumb is that a tag should weigh no more than about three per cent of the animal's body mass. You'll hear people say five, and that's sometimes accepted for larger animals, but three is the guideline most journals expect, and for a twenty-gram songbird that leaves you very little to play with." },
          { who: "Dr Moloney", voice: "ie-nam", text: "A second approach avoids the weight problem by moving the clever part off the animal. Across North America and increasingly elsewhere, there are networks of automatic radio receivers mounted on towers, rooftops and lighthouses. The animal carries only a tiny transmitter, lighter than a paperclip, small enough for bats, songbirds, even some large insects. The limitation, of course, is that you only detect the animal when it passes within range of a receiver. Between receivers, it's invisible." },
          { who: "Dr Moloney", voice: "ie-nam", text: "A third approach went in the opposite direction and put the receiver in space. For a couple of years an antenna on the International Space Station picked up signals from small tags anywhere on the planet. It worked rather well. It was switched off in 2022, and I want to be clear that the reasons were political, not technical. The hardware was fine. The cooperation between the agencies involved was not." },
          { who: "Dr Moloney", voice: "ie-nam", text: "Fourth, and this one surprises people, is ordinary weather radar. Radar designed to see rain also sees large numbers of birds, and on spring and autumn nights you can watch waves of migrants leaving the coast, and estimate how many there are and how high they fly. What radar can't do is tell you which species you're looking at. A cloud of thrushes and a cloud of warblers look much the same." },
          { who: "Dr Moloney", voice: "ie-nam", text: "And fifth, chemistry. A feather records the chemistry of the water in the place where it grew, and that chemistry varies with latitude in a fairly predictable way. Analyse one feather and you can say roughly where the bird spent the previous summer. Its great virtue is that you never have to recapture the bird: one feather, taken once, is enough. Its weakness is precision. You get a broad band of the continent, not a location." },
          { who: "Dr Moloney", voice: "ie-nam", text: "Now, a few findings, and a few costs. My favourite result concerns a wading bird, the bar-tailed godwit, which breeds in Alaska and spends the southern summer here in New Zealand, Aroha, as you'll know. Tracked birds have flown more than eleven thousand kilometres in a single flight of about eight days, and a later bird went further still. The distance alone is remarkable. But what genuinely astonished researchers was that the birds did it non-stop: no landing, no feeding, no drinking, for over a week, over open ocean." },
          { who: "Dr Moloney", voice: "ie-nam", text: "Results like that have changed conservation, not just our sense of wonder. When the godwits fly north again in spring, they don't go straight back to Alaska. Almost all of them stop on the coast of the Yellow Sea, between China and the Korean peninsula, to rest and refuel on the mudflats for several weeks. Nobody knew how completely the population depended on that one stretch of coast until the birds were tracked, and that coast has been losing its mudflats to land reclamation for decades. So a bird that breeds in Alaska and winters in New Zealand turns out to be vulnerable to decisions made thousands of kilometres from either. That's the general lesson tracking keeps teaching us: an animal is only as safe as the least protected place it needs, and very often that place is somewhere we'd never have thought to look. It's also why the same species can be doing perfectly well at both ends of its journey and still be declining." },
          { who: "Dr Moloney", voice: "ie-nam", text: "The costs are less cheerful. We used to assume that a well-fitted tag or band did the animal no harm. That assumption doesn't survive contact with the evidence. In one long-term study of king penguins, birds carrying metal bands on their flippers produced noticeably fewer chicks and were less likely to survive than unbanded birds. The lesson is not that we should stop tagging animals. It's that the effect of the tag has to be measured in every study, not assumed to be zero." },
          { who: "Dr Moloney", voice: "ie-nam", text: "There's a subtler cost too. Because the technology began with devices that only large animals could carry, most of what we know about migration is knowledge about big species, eagles, geese, whales. The small animals, which are the great majority, are under-represented, so our picture of migration is skewed towards a minority that happens to be convenient to study. And one last point. You might think that thousands of amateur birdwatchers logging sightings on their phones would be made redundant by all this technology. Quite the opposite. Their records, on their own, are patchy, but combined with tracking data they're enormously valuable, because tags tell you what a few individuals did and sightings tell you what the population is doing. Thank you." },
          { who: "Dr Rangi", voice: "nz-nu", text: "Thank you, Cian. We've got a few minutes for questions. Maddie, you had your hand up first." },
          { who: "Maddie", voice: "au-nu", text: "Thanks. I volunteer with a small conservation group, and we could never afford GPS tags. Doesn't that mean the most useful research is only open to wealthy universities?" },
          { who: "Dr Moloney", voice: "ie-nam", text: "It's a fair worry, but I'd actually turn it round. Some of the most useful information for conservation decisions still comes from the cheapest methods. An expensive tag tells you, in exquisite detail, where one bird went. A thousand rings, or a season of radar, or a box of feathers, tells you about the population, and it's the population a conservation group is trying to protect. So don't feel you're doing second-class science." },
          { who: "Dr Rangi", voice: "nz-nu", text: "Ethan?" },
          { who: "Ethan", voice: "ca-nam", text: "If you could change one thing about the field tomorrow, what would it be? Lighter batteries?" },
          { who: "Dr Moloney", voice: "ie-nam", text: "Batteries would be lovely, and they'll come. But no, the change I'd make costs nothing. A great deal of tracking data still sits on individual hard drives, and every research group guards its own. If all of it were shared openly, in one place, we'd learn more in a year than we'll learn from the next generation of hardware. Had we started doing that twenty years ago, I suspect we'd now have a far better picture than we do." },
          { who: "Dr Rangi", voice: "nz-nu", text: "On that note, let's thank Cian again." },
        ],
      },
      { t: "p", text: "**Questions 1–8** — Complete the notes below. Write **ONE WORD AND/OR A NUMBER** for each answer." },
      {
        t: "note",
        title: "Tracking migration — notes",
        items: [
          "**Early tracking:** in 1899 a Danish teacher put numbered rings on **1** ___ · the rings were made of **2** ___ · most rings returned in the early years came from birds that were found **3** ___",
          "**Light-level geolocators:** latitude is calculated from the length of the **4** ___ · longitude from the time of local **5** ___",
          "**Weaknesses:** real accuracy about **6** ___ kilometres · latitude cannot be measured near the **7** ___",
          "**Arctic tern:** tracked birds travelled about **8** ___ kilometres a year",
        ],
      },
      {
        t: "quiz",
        id: "t5d20-nghe-ghi-chu",
        kind: "fill",
        title: "Questions 1–8 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1", answers: ["starlings"], hint: "“People often assume he chose swallows or storks… but in fact they were starlings”. Bẫy: giả định sai được nói TRƯỚC." },
          { q: "2", answers: ["aluminium", "aluminum"], hint: "“He had tried zinc first, which turned out to be too heavy, and settled on aluminium.” zinc là nhiễu." },
          { q: "3", answers: ["dead"], hint: "“the great majority of rings… came from birds that were found dead”." },
          { q: "4", answers: ["day"], hint: "“The length of the day tells you your latitude”." },
          { q: "5", answers: ["noon"], hint: "“the time of local noon, the midpoint between sunrise and sunset, tells you your longitude”. Nhiễu: sunrise / sunset — hai mốc dùng để TÍNH noon." },
          { q: "6", answers: ["150", "a hundred and fifty", "one hundred and fifty"], hint: "“The manufacturers will tell you… fifty kilometres. In practice… about a hundred and fifty”. Chữ real trong ghi chú = in practice." },
          { q: "7", answers: ["equinox", "equinoxes"], hint: "“around the equinoxes, day length is roughly the same everywhere”." },
          { q: "8", answers: ["70,000", "70000", "seventy thousand", "70 000"], hint: "“Older textbooks gave figures of around forty thousand… about seventy thousand kilometres a year”. Số cũ bị thay bằng số đo mới." },
        ],
      },
      { t: "p", text: "**Questions 9–14** — Complete the table below. Write **ONE WORD AND/OR A NUMBER** for each answer." },
      {
        t: "table",
        head: ["Method", "Advantage", "Limitation"],
        rows: [
          ["GPS tags", "positions accurate to a few metres", "heavy: should weigh no more than **9** ___ per cent of body mass"],
          ["Radio receiver networks", "transmitter lighter than a **10** ___", "animal detected only when near a **11** ___"],
          ["Receiver in space", "worldwide coverage", "switched off in 2022 for **12** ___ reasons"],
          ["Weather radar", "shows numbers and height of migrants at night", "cannot identify the **13** ___"],
          ["Feather chemistry", "no need to **14** ___ the bird", "gives only a broad region"],
        ],
      },
      {
        t: "quiz",
        id: "t5d20-nghe-bang",
        kind: "fill",
        title: "Questions 9–14 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "9", answers: ["3", "three"], hint: "“no more than about three per cent… You'll hear people say five… but three is the guideline most journals expect”. five là nhiễu." },
          { q: "10", answers: ["paperclip", "paper clip"], hint: "“a tiny transmitter, lighter than a paperclip”." },
          { q: "11", answers: ["receiver"], hint: "“you only detect the animal when it passes within range of a receiver”." },
          { q: "12", answers: ["political"], hint: "“the reasons were political, not technical”. technical bị phủ định." },
          { q: "13", answers: ["species"], hint: "“What radar can't do is tell you which species you're looking at.”" },
          { q: "14", answers: ["recapture"], hint: "“you never have to recapture the bird: one feather, taken once, is enough”. Không viết catch (không có trong cụm của bài)." },
        ],
      },
      { t: "p", text: "**Questions 15–20** — Choose the correct letter, **A, B or C**." },
      {
        t: "mcq",
        id: "t5d20-nghe-chon",
        title: "Questions 15–20 — Multiple choice",
        items: [
          { q: "15. What most surprised researchers about the flights of the bar-tailed godwit?", options: ["A  the distance the birds covered", "B  the fact that the birds did not stop to feed or rest", "C  the speed at which the birds flew"], correct: 1, why: "“The distance alone is remarkable. But what genuinely astonished researchers was that the birds did it non-stop”. A là bẫy: được nhắc trước và được khen, nhưng chữ most rơi vào điều đến sau But." },
          { q: "16. What does Dr Moloney conclude from the study of king penguins?", options: ["A  The effect of a tag on an animal must be measured in each study.", "B  Bands on flippers are safer than other kinds of tag.", "C  Animals should no longer be fitted with tags."], correct: 0, why: "“The lesson is not that we should stop tagging animals. It's that the effect of the tag has to be measured in every study”. C bị bác bằng chính câu đó." },
          { q: "17. Why does Dr Moloney mention eagles, geese and whales?", options: ["A  to show how far large animals travel", "B  to explain why tracking devices have become cheaper", "C  to illustrate a bias in what is known about migration"], correct: 2, why: "“most of what we know about migration is knowledge about big species… our picture of migration is skewed”." },
          { q: "18. What is Dr Moloney's attitude to sightings recorded by amateur birdwatchers?", options: ["A  They have been made unnecessary by modern technology.", "B  They are most valuable when combined with tracking data.", "C  They are more reliable than data from tags."], correct: 1, why: "“on their own, are patchy, but combined with tracking data they're enormously valuable”. A là ý “You might think…” bị bác bằng “Quite the opposite”." },
          { q: "19. In answer to Maddie's question, Dr Moloney says that", options: ["A  cheap methods can provide information that is especially useful for conservation.", "B  GPS tags will soon become affordable for small groups.", "C  small conservation groups should work with universities."], correct: 0, why: "“Some of the most useful information for conservation decisions still comes from the cheapest methods… it's the population a conservation group is trying to protect.”" },
          { q: "20. What change does Dr Moloney say would most help the field?", options: ["A  lighter batteries", "B  more receivers in space", "C  open sharing of tracking data"], correct: 2, why: "“Batteries would be lovely… But no, the change I'd make costs nothing… If all of it were shared openly”. A là gợi ý của Ethan, bị gạt." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Sau khi nghe — bản đồ bài giảng và bẫy" },
      {
        t: "table",
        head: ["Phần", "Câu báo chuyển", "Câu hỏi", "Bẫy"],
        rows: [
          ["Mở đầu + rings", "“The first real method was startlingly simple.”", "1–3", "swallows / storks → starlings · zinc → aluminium"],
          ["Geolocators", "“The breakthrough for small birds came with…”", "4–8", "sunrise / sunset → noon · fifty → a hundred and fifty · forty → seventy thousand"],
          ["Năm phương pháp", "“Let me turn now to the other tools…” · “A second / third / Fourth / And fifth”", "9–14", "five → three · technical → political"],
          ["Phát hiện & cái giá", "“Now, a few findings, and a few costs.”", "15–18", "distance → non-stop · stop tagging → measure · You might think… → Quite the opposite"],
          ["Hỏi – đáp", "“We've got a few minutes for questions.”", "19–20", "batteries → sharing data"],
        ],
        caption: "Năm phần — chép câu báo chuyển vào sổ: chúng lặp lại ở rất nhiều bài giảng thật",
      },
      {
        t: "table",
        head: ["Đúng / 20", "Nghĩa là (ước tính)", "Việc tiếp"],
        rows: [
          ["18–20", "giữ được mạch 10 phút — Part 4 thật sẽ thấy ngắn", "Ngày 21: podcast / tin tức tốc độ thật."],
          ["15–17", "đúng đích band 8 ở Part 4", "Xem câu sai nằm ở phút nào: nếu dồn ở 9–14 là mệt giữa bài."],
          ["12–14", "band 7–7.5", "Nghe lại phần 3 (năm phương pháp) có lời; tập ghi theo bảng, không theo câu."],
          ["dưới 12", "mất mạch sớm", "Chia bài làm hai nửa, nghe từng nửa; Ngày 22 nghe lại cả bài."],
        ],
        caption: "Bài dài gấp đôi nên thang này khắt khe hơn Part 4 thật",
      },
      {
        t: "note",
        title: "💡 Mẹo — bốn câu báo hiệu “đáp án là cái đến sau”",
        items: [
          "“People often assume… but in fact…” (câu 1) · “You might think… Quite the opposite.” (câu 18)",
          "“The manufacturers will tell you… In practice…” (câu 6) · “You'll hear people say five… but three is…” (câu 9)",
          "“The distance alone is remarkable. But what genuinely astonished…” (câu 15)",
          "“X would be lovely, and it'll come. But no, …” (câu 20)",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Từ bài giảng sang nói — một câu Part 3" },
      { t: "p", text: "Dùng ý của bài giảng (không dùng lời) và khung năm bước của Ngày 19: tóm → phản hồi có giới hạn → lý do → giả định → chốt. 40–50 giây mỗi câu." },
      { t: "speak", id: "t5d20-noi-p3", part: "3", questions: ["Is it acceptable to put tracking devices on wild animals if it might harm some of them?", "Why do you think people find small animals and insects less interesting than large animals?"] },

      /* ── 7 ── */
      { t: "h", text: "7. Từ vựng hữu ích từ bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "tag", pos: "n / v", ipa: "/tæɡ/", vi: "(n) thẻ / thiết bị gắn lên con vật; (v) gắn thẻ", ex: "Researchers tagged forty birds before the autumn migration.", exVi: "Các nhà nghiên cứu gắn thiết bị cho bốn mươi con chim trước mùa di cư thu.", more: "a GPS / radio tag · tag an animal · price tag (thẻ giá) · name tag" },
          { w: "recapture", pos: "v / n", ipa: "/ˌriːˈkæptʃə(r)/", vi: "bắt lại (con vật đã thả)", ex: "The logger is useless unless the bird is recaptured a year later.", exVi: "Thiết bị ghi vô dụng nếu không bắt lại được con chim sau một năm.", more: "nghĩa bóng: recapture the spirit / magic of sth (tái hiện)" },
          { w: "rule of thumb", pos: "n phr", ipa: "/ˌruːl əv ˈθʌm/", vi: "quy tắc kinh nghiệm (ước lượng thô, không chính xác tuyệt đối)", ex: "The rule of thumb is that a tag should weigh no more than three per cent of body mass.", exVi: "Quy tắc kinh nghiệm là thiết bị không nên nặng quá ba phần trăm khối lượng cơ thể.", more: "as a rule of thumb, … · dùng tốt ở Part 3 khi đưa con số ước lượng" },
          { w: "non-stop", pos: "adj / adv", ipa: "/ˌnɒn ˈstɒp/", vi: "không nghỉ, liên tục", ex: "The godwit flew non-stop for more than a week.", exVi: "Con chim choắt bay liên tục hơn một tuần.", more: "a non-stop flight · work non-stop · gạch nối luôn có" },
          { w: "flipper", pos: "n", ipa: "/ˈflɪpə(r)/", vi: "chi bơi, vây (của chim cánh cụt, hải cẩu, rùa biển)", ex: "Metal bands on penguins' flippers reduced their breeding success.", exVi: "Vòng kim loại trên cánh bơi của chim cánh cụt làm giảm khả năng sinh sản của chúng.", more: "khác fin (vây cá) · flippers = chân vịt người lặn đeo" },
          { w: "skewed", pos: "adj", ipa: "/skjuːd/", vi: "bị lệch, méo (không đại diện)", ex: "Our picture of migration is skewed towards large animals.", exVi: "Bức tranh của chúng ta về di cư bị lệch về phía các loài lớn.", more: "skewed towards / in favour of · a skewed sample · skew the results (v)" },
          { w: "pool", pos: "v", ipa: "/puːl/", vi: "gộp chung (dữ liệu, tiền, nguồn lực)", ex: "If research groups pooled their data, everyone would learn faster.", exVi: "Nếu các nhóm nghiên cứu gộp dữ liệu, ai cũng học được nhanh hơn.", more: "pool resources / data / knowledge · a car pool · a talent pool (n)" },
          { w: "come at a cost", pos: "phr", ipa: "/ˌkʌm ət ə ˈkɒst/", vi: "phải trả giá, có cái giá đi kèm", ex: "Precise positions come at a cost: more power and more weight.", exVi: "Vị trí chính xác có cái giá của nó: tốn điện hơn và nặng hơn.", more: "come at a price · at the cost of sth · rất hợp phần giới hạn của bài problem / solution (Bài 2)" },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau buổi",
        items: [
          "Ghi số câu đúng của Practice (…/4) và bài chính (…/20), kèm phút bạn bắt đầu mất mạch nếu có.",
          "Nghe lại bài chính một lần CÓ lời thoại, gạch mọi từ của Bài 1 xuất hiện trong đó (sample, species, predator…).",
          "Chép bốn câu báo hiệu ở mục 5 vào sổ Listening.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d20-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 20 — Khoa học · Động vật · Trẻ em vòng 2 · cặp dễ nhầm · trọng âm dời · problem / solution đúng tầng · khung câu giải pháp · nghe giọng vùng",
    goal: "Ôn trọn Ngày 20: dùng đúng 48 từ vòng 2 trong câu Task 2 và Part 3, không nhầm sáu cặp dễ lẫn, đặt đúng trọng âm của họ từ, chọn giải pháp đúng tầng của nguyên nhân, hoàn chỉnh khung câu ưu tiên – đề xuất – giới hạn, nghe một mẩu bài giảng giọng vùng — 42 câu có đáp án, một đoạn giải pháp AI chấm và hai câu Part 3 ghi âm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay",
        items: [
          "Phần I–V ôn Bài 1 (28 câu): Science · Animals · Children vòng 2 · cặp dễ nhầm và trọng âm · dịch.",
          "Phần VI–VII ôn Bài 2 (10 câu): giải pháp đúng tầng, ưu tiên, giới hạn; khung câu giải pháp.",
          "Phần VIII ôn Bài 3 (4 câu): một mẩu bài giảng giọng New Zealand có số bị nói rồi sửa.",
          "Phần IX: viết đoạn giải pháp 120–150 từ (AI chấm). Phần X: hai câu Part 3 ghi âm.",
          "Đạt: ≥ 34/42. Dưới 70 % ở phần nào thì mở lại mục ghi trong tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 20 trong một hình",
        center: "Từ để **lập luận** + giải pháp **đúng tầng**",
        branches: [
          { label: "Science vòng 2", items: ["confounding factor", "replication crisis", "conflict of interest"] },
          { label: "Animals vòng 2", items: ["keystone species · cull", "human–wildlife conflict", "sentient · zoonotic"] },
          { label: "Children vòng 2", items: ["risk-averse · autonomy", "hothousing · early years", "safeguarding"] },
          { label: "Problem / solution band 8", items: ["cơ chế", "đúng tầng + ưu tiên", "một giới hạn"] },
          { label: "Part 4 10 phút", items: ["khung theo tiêu đề", "số bị sửa", "hỏi – đáp cuối bài"] },
        ],
      },

      { t: "h", text: "I. Science vòng 2 — điền MỘT từ (6 câu) — ôn Bài 1 mục 1" },
      {
        t: "quiz",
        id: "t5d20-bt-khoa-hoc",
        kind: "fill",
        title: "I. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. Only p___-reviewed studies were accepted as evidence by the committee.", answers: ["peer"], hint: "peer-reviewed." },
          { q: "2. A result that other laboratories cannot repeat is not r___.", answers: ["reproducible"], hint: "reproducible: tái lập được." },
          { q: "3. The r___ crisis showed that many famous findings in psychology were unreliable.", answers: ["replication"], hint: "replication crisis." },
          { q: "4. A larger s___ size would make the conclusions far more convincing.", answers: ["sample"], hint: "sample size." },
          { q: "5. The theory of evolution was a p___ shift in biology.", answers: ["paradigm"], hint: "paradigm shift — dùng cho thay đổi tận gốc." },
          { q: "6. Without basic scientific l___, citizens cannot judge the claims made in advertisements.", answers: ["literacy"], hint: "scientific literacy." },
        ],
      },

      { t: "h", text: "II. Animals vòng 2 — chọn phương án đúng (6 câu) — ôn Bài 1 mục 2" },
      {
        t: "mcq",
        id: "t5d20-bt-dong-vat",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "1. When wolves returned to the park, the whole ecosystem changed, which shows that they are a ___.", options: ["keystone species", "domestic species", "livestock"], correct: 0, why: "keystone species: mất / có nó thì cả hệ sinh thái đổi khác." },
          { q: "2. Supporters claim that ___ brings money into poor rural areas and pays for anti-poaching patrols.", options: ["bycatch", "trophy hunting", "enrichment"], correct: 1, why: "trophy hunting — lập luận kinh điển của phía ủng hộ." },
          { q: "3. Many zoos now hide food inside puzzles as a form of ___.", options: ["enrichment", "domestication", "culling"], correct: 0, why: "enrichment: làm phong phú môi trường sống." },
          { q: "4. A tunnel under the road allows deer to move between the two forests. It is a ___.", options: ["wildlife corridor", "nature reserve", "breeding programme"], correct: 0, why: "wildlife corridor: dải nối hai vùng sống." },
          { q: "5. Robins attack their own reflection in windows because they are highly ___.", options: ["sentient", "territorial", "endangered"], correct: 1, why: "territorial: bảo vệ lãnh thổ — tấn công “kẻ lạ” trong gương." },
          { q: "6. Newly hatched turtles head towards the sea by ___.", options: ["instinct", "conflict", "welfare"], correct: 0, why: "by instinct: theo bản năng." },
        ],
      },

      { t: "h", text: "III. Children vòng 2 — điền MỘT từ (6 câu) — ôn Bài 1 mục 3" },
      {
        t: "quiz",
        id: "t5d20-bt-tre-em",
        kind: "fill",
        title: "III. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. Critics argue that modern parents wrap their children in cotton w___.", answers: ["wool"], hint: "wrap sb in cotton wool." },
          { q: "2. Teaching four-year-olds to read and do sums early is sometimes called h___.", answers: ["hothousing"], hint: "hothousing." },
          { q: "3. She could read at three; she was a p___ child.", answers: ["precocious"], hint: "precocious: sớm phát triển." },
          { q: "4. Most children start nursery as t___, at around two years old.", answers: ["toddlers"], hint: "toddler — số nhiều." },
          { q: "5. Joining clubs after school is one of the e___ activities that universities look for.", answers: ["extracurricular"], hint: "extracurricular — viết liền." },
          { q: "6. Some schools have been accused of trying to m___ pupils by cancelling sports days.", answers: ["mollycoddle"], hint: "mollycoddle (v): nuông chiều quá mức." },
        ],
      },

      { t: "h", text: "IV. Cặp dễ nhầm và trọng âm (5 câu) — ôn Bài 1 mục 4–5" },
      {
        t: "mcq",
        id: "t5d20-bt-de-nham",
        title: "IV. Chọn phương án đúng",
        items: [
          { q: "1. The topic is politically ___, so the minister avoided it.", options: ["sentient", "sensitive", "sensible"], correct: 1, why: "sensitive = nhạy cảm (chủ đề, vấn đề)." },
          { q: "2. The museum encourages a ___ sense of wonder in visitors of all ages.", options: ["childlike", "childish", "childhood"], correct: 0, why: "childlike = hồn nhiên (nghĩa khen)." },
          { q: "3. Trọng âm của “biological” rơi vào âm tiết nào?", options: ["BI-o-lo-gi-cal", "bi-O-lo-gi-cal", "bi-o-LO-gi-cal"], correct: 2, why: "-ical kéo trọng âm về âm tiết ngay trước nó: bio-LO-gical (khác bi-O-logy)." },
          { q: "4. Trọng âm của “territorial” rơi vào:", options: ["TER-ri-to-ri-al", "ter-ri-TO-ri-al", "ter-RI-to-ri-al"], correct: 1, why: "-ial: terri-TO-rial (khác TER-ritory)." },
          { q: "5. Cattle ___ grazing in the field behind the school.", options: ["is", "are", "was"], correct: 1, why: "cattle luôn số nhiều ⇒ are. (livestock thì số ít)." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 1–3 · 6" },
      {
        t: "quiz",
        id: "t5d20-bt-dich",
        kind: "translate",
        title: "V. Dịch — dùng từ trong gợi ý",
        items: [
          { q: "Thu nhập là một yếu tố gây nhiễu trong nghiên cứu này.", answers: ["Income is a confounding factor in this study.", "Income is a confounding factor in this research.", "Income was a confounding factor in this study.", "In this study, income is a confounding factor."], hint: "confounding factor" },
          { q: "Tạp chí đã rút lại bài báo vì dữ liệu bị làm giả.", answers: ["The journal retracted the paper because the data had been falsified.", "The journal retracted the article because the data had been faked.", "The journal retracted the paper because the data were falsified.", "The journal retracted the paper because the data had been fabricated."], hint: "retract · falsify / fake / fabricate" },
          { q: "Chính quyền quyết định giết bớt đàn khỉ gây hại cho mùa màng.", answers: ["The authorities decided to cull the monkeys that were damaging crops.", "The authorities decided to cull the monkeys damaging the crops.", "The local authorities decided to cull the monkeys that were damaging the crops.", "The authorities decided to cull the monkeys which damaged crops."], hint: "cull · damage crops" },
          { q: "Nếu cá có tri giác, việc đánh bắt chúng đặt ra câu hỏi đạo đức.", answers: ["If fish are sentient, catching them raises ethical questions.", "If fish are sentient, fishing raises ethical questions.", "If fish are sentient, catching them raises moral questions.", "If fish are sentient, the way we catch them raises ethical questions."], hint: "sentient · raise ethical questions" },
          { q: "Trẻ làm việc nhà phát triển ý thức trách nhiệm.", answers: ["Children who do chores develop a sense of responsibility.", "Children who do household chores develop a sense of responsibility.", "Children who do the chores develop a sense of responsibility.", "Children doing chores develop a sense of responsibility."], hint: "do chores · a sense of responsibility" },
        ],
      },

      { t: "h", text: "VI. Giải pháp đúng tầng, ưu tiên, giới hạn (6 câu) — ôn Bài 2 mục 1–3" },
      {
        t: "mcq",
        id: "t5d20-bt-tang",
        title: "VI. Chọn phương án đúng",
        items: [
          { q: "1. Nguyên nhân: “Nhiều sinh viên bỏ học vì phải đi làm thêm trả tiền thuê nhà.” Giải pháp đúng tầng:", options: ["Students should manage their time better.", "Universities could offer affordable accommodation and grants linked to income.", "Students should choose cheaper courses."], correct: 1, why: "Nguyên nhân là chi phí (tầng tổ chức / cấu trúc) ⇒ giải pháp về chi phí. A, C đặt gánh nặng lên cá nhân." },
          { q: "2. Nguyên nhân: “Doanh nghiệp không có động lực giảm bao bì nhựa.” Giải pháp đúng tầng:", options: ["Consumers should bring their own bags.", "A charge on producers for every tonne of packaging they put on the market.", "Schools should teach children about plastic."], correct: 1, why: "Thiếu động lực của doanh nghiệp ⇒ tạo động lực ở chính doanh nghiệp (trách nhiệm nhà sản xuất)." },
          { q: "3. Câu nào nêu ưu tiên?", options: ["There are many ways to solve this problem.", "Of the measures available, reducing the cost of public transport would do most, because it changes the choice people face every day.", "Another way is to build more roads."], correct: 1, why: "Of the measures available… would do most, because… — ưu tiên + lý do." },
          { q: "4. Câu nào nêu GIỚI HẠN đúng kiểu band 8?", options: ["This is a perfect solution.", "Awareness campaigns cannot change habits by themselves, yet they matter, because policies without public support rarely survive.", "This solution might have some problems."], correct: 1, why: "Giới hạn cụ thể + vì sao vẫn giữ — khung số 5 ở Bài 2 mục 7." },
          { q: "5. Đề: “What problems does tourism cause for historic cities? What can be done?” Câu nào LẠC đề?", options: ["Visitor numbers to the old town could be capped during peak months.", "Tourists could be encouraged to visit less famous districts.", "Governments should invest in rural tourism to help farmers."], correct: 2, why: "Đề hỏi giải pháp cho vấn đề của thành phố cổ; nông thôn và nông dân lạc đối tượng." },
          { q: "6. Chữ nào trong đề “Why are more and more people choosing to live alone?” là nhiệm vụ giấu?", options: ["people", "more and more", "live"], correct: 1, why: "more and more = xu hướng ⇒ nguyên nhân phải là thứ đã THAY ĐỔI (như growing ở đề cận thị)." },
        ],
      },

      { t: "h", text: "VII. Khung câu giải pháp — điền MỘT từ (4 câu) — ôn Bài 2 mục 7" },
      {
        t: "quiz",
        id: "t5d20-bt-khung",
        kind: "fill",
        title: "VII. Điền MỘT từ",
        items: [
          { q: "1. The most effective response would ___ the cost of childcare, since that is what keeps many parents out of work.", answers: ["target"], hint: "would target N, since…" },
          { q: "2. It ___ that the priority should be prevention rather than treatment.", answers: ["follows"], hint: "It follows that… — nối từ nguyên nhân sang giải pháp." },
          { q: "3. Higher fines would help at the ___, but on their own they would merely punish the poor.", answers: ["margin"], hint: "help at the margin." },
          { q: "4. Responsibility should ___ with employers rather than individual workers.", answers: ["lie", "rest"], hint: "Responsibility should lie / rest with N." },
        ],
      },

      { t: "h", text: "VIII. Nghe — một mẩu bài giảng giọng New Zealand (4 câu) — ôn Bài 3" },
      {
        t: "listen",
        id: "t5d20-bt-nghe",
        title: "A lecture extract — how scientists count whales",
        dan: { so: "Day 20, Recording 3", boiCanh: "part of a lecture about methods used to estimate the number of whales in an area.", cau: [1, 4] },
        note: "Khoảng 1 phút 15 giây, ~170 từ/phút. Giảng viên: giọng New Zealand (nam).",
        lines: [
          { who: "Lecturer", voice: "nz-nam", text: "Counting whales sounds easy until you try it. The traditional method is a survey from a ship or a small plane, with observers counting every animal that surfaces. The obvious problem is that whales spend most of their time underwater, so you're always counting a fraction of what's there. Researchers correct for that statistically, but the correction can be large." },
          { who: "Lecturer", voice: "nz-nam", text: "A newer approach uses satellite images. At first the resolution was too low to be useful. Today's images can pick out objects about thirty centimetres across, sorry, I mean thirty centimetres per pixel, which is enough to see a large whale lying at the surface. The catch is that a computer still struggles to tell a whale from a wave, so people have to check the images by eye." },
          { who: "Lecturer", voice: "nz-nam", text: "And the third method doesn't use sight at all. Microphones placed on the sea floor record the calls of whales passing by. That works day and night and in any weather, which ships and planes can't manage. Its weakness is that silent whales go unrecorded." },
        ],
      },
      {
        t: "quiz",
        id: "t5d20-bt-nghe-dien",
        kind: "fill",
        title: "VIII. ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Ship and plane surveys only count a ___ of the whales present.", answers: ["fraction"], hint: "“you're always counting a fraction of what's there”." },
          { q: "2. Modern satellite images show about ___ centimetres per pixel.", answers: ["30", "thirty"], hint: "“about thirty centimetres across, sorry, I mean thirty centimetres per pixel” — sửa ĐƠN VỊ, không sửa số." },
          { q: "3. Computers find it hard to distinguish a whale from a ___ .", answers: ["wave"], hint: "“a computer still struggles to tell a whale from a wave”." },
          { q: "4. Underwater microphones cannot detect whales that are ___ .", answers: ["silent"], hint: "“silent whales go unrecorded”." },
        ],
      },

      { t: "h", text: "IX. Viết đoạn giải pháp (120–150 từ) — AI chấm — ôn Bài 2" },
      {
        t: "p",
        text: "Viết **thân bài giải pháp** cho đề dưới đây. Bắt buộc: mở bằng **ưu tiên** (The most effective response would… / It follows that the priority should be…), có **một** giải pháp đặt đúng tầng cấu trúc, **một** giới hạn (would help at the margin, but…), dùng ít nhất **3** từ của Bài 1 mục 3.",
      },
      {
        t: "essay",
        id: "t5d20-bt-viet-doan",
        task: "Task 2",
        prompt: "(Chỉ viết đoạn GIẢI PHÁP, 120–150 từ) In many countries, children spend far less time playing freely outdoors than previous generations did. What are the causes of this, and what can be done to change it?",
        minWords: 120,
        tips: [
          "Nguyên nhân giả định đã nêu ở thân bài 1: phụ huynh né rủi ro, đường phố không an toàn, lịch học thêm kín.",
          "Giải pháp đúng tầng: đường an toàn quanh trường (cấu trúc) · giờ chơi tự do trong trường (tổ chức) · phụ huynh (cá nhân) — nói rõ vì sao chỉ phụ huynh là không đủ.",
          "Từ Bài 1: risk-averse · autonomy · wrap in cotton wool (khi nói) · sedentary · extracurricular.",
        ],
      },
      {
        t: "note",
        title: "📌 Một đoạn mẫu để so SAU khi đã viết (band 8, ước tính) — 136 từ",
        items: [
          "Since much of the decline stems from parents' fears rather than from children's preferences, the most effective response would make the streets around homes and schools less frightening. Closing roads outside primary schools at the start and end of the day, as a growing number of cities have done, would allow children to walk and play without their parents having to judge every car. It is essential, too, that schools protect unstructured breaks, since a timetable filled with extra lessons simply moves sedentary hours from the home to the classroom. Appeals to parents would help at the margin, but on their own they would merely add guilt to the anxiety of risk-averse families. Children regain their autonomy not when they are lectured about it, but when the places they live in make independence a reasonable risk.",
          "Soi: ưu tiên + cơ chế (the most effective response would… since…) · tầng cấu trúc (closing roads) · tầng tổ chức (schools protect breaks) · giới hạn (help at the margin, but… merely) · từ Bài 1: sedentary · risk-averse · autonomy · câu cuối dùng not… but… kết lại nguyên nhân.",
        ],
      },

      { t: "h", text: "X. Nói 2 câu Part 3 — ghi âm, AI chấm" },
      { t: "p", text: "Mỗi câu 40–50 giây. Dùng ít nhất hai từ của Bài 1 mỗi câu, và một giới hạn (“up to a point”, “at the margin”)." },
      { t: "speak", id: "t5d20-bt-noi-p3", part: "3", questions: ["Do you think children today are overprotected by their parents?", "Should the public trust scientists when different studies seem to say different things?"] },
    ],
  },
];
