/**
 * IELTS Tập 5 — Ngày 14 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, đề, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Sport vòng 2 (quản trị, tiền, công bằng) + History vòng 2 (sử liệu, cách kể, ký ức) + Psychology vòng 2
 *                     (thiên kiến, tự chủ, đối phó) — 48 từ + collocation + cặp dễ nhầm                         [VC16 VC22 VC27]
 *                     — nối Tập 2 Ngày 20 (Sport) · Tập 3 Ngày 12 (History) · Tập 4 Ngày 4 (Psychology)
 *   Bài 2 (writing)   Task 2 trộn dạng — nhận dạng đề lạ trong 2 phút, đếm NHIỆM VỤ, chọn khung; bài mẫu band 7 và band 8
 *                     cùng một đề “nguyên nhân + đánh giá”                                                       [W03–W07]
 *                     — nối Tập 3 Ngày 6 (đếm vế đề) · Tập 4 Ngày 28 (two-part) · Tập 5 Ngày 4 · 10 · 13 (liều cấu trúc)
 *   Bài 3 (speaking)  Part 2 band 8 đề hiếm — giải mã thẻ, mượn chuyện từ kho, khung bốn chặng có “nhìn lại”; thẻ chính:
 *                     a time when you were given incorrect information (KHÔNG dùng thẻ “changed your mind” — Tập 4 Ngày 30
 *                     đã dùng; Đề 9 dùng thẻ “persuaded someone”)                                                                            [S05]
 *                     — nối Tập 3 Ngày 22 · 26 (đề lạ, mượn khung) · Tập 4 Ngày 30 (kho 5 chuyện) · Tập 5 Ngày 7 (giọng kể)
 *                     🔊 nhấn tương phản khi sửa thông tin
 *   Bài tập Ngày 14   43 câu có đáp án + 1 bài viết ngắn + 1 thẻ Part 2
 * Mọi id bắt đầu `t5d14-`. Không có số liệu thật cần kiểm; các nhân vật và tình huống trong bài mẫu (chị Thảo, công ty Lumen…)
 * là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_14: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d14-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Thể thao, Lịch sử, Tâm lý — vòng 2 (48 từ để bàn về tiền và công bằng trong thể thao, về cách viết sử, về thiên kiến và tự chủ)",
    goal: "Dùng đúng 48 từ và cụm ở mức band 8 để bàn ba chủ đề hay ra trong Task 2 và Part 3: thể thao như một ngành kinh doanh và một vấn đề công bằng (doping, a level playing field, white elephant), lịch sử như một cách kể còn tranh cãi (hindsight, anachronism, contested, romanticise), và tâm lý ra quyết định (confirmation bias, loss aversion, delayed gratification); không nhầm sáu cặp dễ lẫn (historic / historical, sanction hai nghĩa…).",
    minutes: 105,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **LR 7 → 8** của Writing Task 2 và Speaking Part 3: band 8 cần từ ==ít gặp, chính xác, đúng collocation== cho cả những chủ đề tưởng là dễ.",
          "**Vòng 2** nghĩa là: vòng 1 đã cho bạn từ để TẢ (play a sport, an ancient ruin, feel stressed); vòng 2 cho từ để ==LẬP LUẬN== (ai được lợi, bằng chứng nào, vì sao người ta hành xử như vậy).",
          "Thể thao (16 từ): quản trị – công bằng · tiền · đỉnh cao và phong trào. Lịch sử (16 từ): sử liệu · cách kể · ký ức. Tâm lý (16 từ): thiên kiến · tự chủ · đối phó.",
          "Mỗi nhóm có bảng “muốn nói → collocation đúng → lỗi hay gặp” và một bài kiểm 8 câu.",
          "Hai bài còn lại của ngày dùng ngay các từ này: đề Task 2 về người xem thể thao; thẻ Part 2 có chặng “nhìn lại” (hindsight, confirmation bias).",
          "Mọi từ trong khối từ vựng tự vào Flashcards — ôn theo lịch nhắc.",
        ],
      },

      { t: "h", text: "Vòng 1 đã học gì — kiểm nhanh trước khi lên vòng 2" },
      {
        t: "table",
        head: ["Chủ đề", "Vòng 1 — để TẢ", "Học ở", "Vòng 2 hôm nay — để LẬP LUẬN"],
        rows: [
          ["Sport", "môn thể thao, thi đấu, sức khoẻ, giải trí", "Tập 2 Ngày 20", "ai quản, ai trả tiền, có công bằng không, tiền công nên vào đâu"],
          ["History", "di tích, khai quật, hiện vật, bảo tồn", "Tập 3 Ngày 12", "nguồn nào đáng tin, ai kể câu chuyện, ta nhớ và quên gì"],
          ["Psychology", "hạnh phúc, căng thẳng, động lực, hành vi", "Tập 4 Ngày 4", "vì sao người ta quyết định sai, kiểm soát bản thân, đối phó"],
        ],
      },
      {
        t: "quiz",
        id: "t5d14-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — từ vòng 1 (6 câu, chữ đầu cho sẵn)",
        items: [
          { q: "The stadium was full: sixty thousand s___ had come to watch the final.", answers: ["spectators"], hint: "khán giả xem trực tiếp (Tập 2 Ngày 20)" },
          { q: "Archaeologists have begun to e___ the site of the old harbour.", answers: ["excavate"], hint: "khai quật (Tập 3 Ngày 12)" },
          { q: "The museum's oldest a___ is a bronze drum.", answers: ["artefact", "artifact"], hint: "hiện vật (Tập 3 Ngày 12)" },
          { q: "Children who are praised only for results may develop low self-e___ .", answers: ["esteem"], hint: "self-esteem = lòng tự trọng (Tập 4 Ngày 4)" },
          { q: "Teenagers often start smoking because of p___ pressure.", answers: ["peer"], hint: "peer pressure = áp lực bạn bè" },
          { q: "R___ is the ability to recover quickly from difficulties.", answers: ["Resilience"], hint: "sức bật tinh thần (Tập 4 Ngày 4)" },
        ],
      },
      { t: "rule", formula: "vòng 1: N để tả   →   vòng 2: N trừu tượng + collocation để lập luận (ai · vì sao · với giá nào)", vi: "Hôm nay không học thêm tên môn thể thao hay tên cảm xúc; học từ để tranh luận về chúng." },

      /* ── 1 ── */
      { t: "h", text: "1. Sport vòng 2 — quản trị, công bằng và tiền (16 từ)" },
      {
        t: "p",
        text: "Đề Task 2 về thể thao hiếm khi hỏi “thể thao có tốt không”. Chúng hỏi: vận động viên có được trả quá cao không, nhà nước nên tài trợ đỉnh cao hay phong trào, đăng cai sự kiện lớn có đáng không, có nên cấm suốt đời người dùng chất cấm. Mười sáu từ dưới đây chia ba nhóm theo đúng các câu hỏi đó.",
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Sport vòng 2 — ba nhóm",
        center: "**Sport** như một vấn đề xã hội",
        branches: [
          { label: "Công bằng & quản trị", items: ["doping", "match-fixing", "sportsmanship", "a level playing field", "governing body", "sanction"] },
          { label: "Tiền", items: ["commercialisation", "broadcasting rights", "sponsorship", "endorsement", "host city", "white elephant"] },
          { label: "Đỉnh cao & phong trào", items: ["elite", "mass participation", "amateur", "underdog"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "doping", pos: "n", ipa: "/ˈdəʊpɪŋ/", vi: "việc dùng chất cấm để tăng thành tích", ex: "Several medals were withdrawn after a doping scandal.", exVi: "Vài tấm huy chương bị thu hồi sau một bê bối doping.", more: "a doping scandal / test / ban · anti-doping rules · test positive for a banned substance" },
          { w: "match-fixing", pos: "n", ipa: "/ˈmætʃ fɪksɪŋ/", vi: "dàn xếp tỉ số", ex: "Two players were banned for life for match-fixing.", exVi: "Hai cầu thủ bị cấm thi đấu suốt đời vì dàn xếp tỉ số.", more: "be involved in match-fixing · fix a match · thường đi với illegal betting" },
          { w: "sportsmanship", pos: "n", ipa: "/ˈspɔːtsmənʃɪp/", vi: "tinh thần thể thao (chơi đẹp, tôn trọng đối thủ)", ex: "Team sports are said to teach children sportsmanship.", exVi: "Người ta cho rằng thể thao đồng đội dạy trẻ tinh thần thể thao.", more: "show / display good sportsmanship · trái: unsporting behaviour · gần nghĩa: fair play" },
          { w: "a level playing field", pos: "idiom", ipa: "/ə ˌlevl ˈpleɪɪŋ fiːld/", vi: "sân chơi bình đẳng (điều kiện cạnh tranh như nhau)", ex: "Without spending limits there is no level playing field between rich and poor clubs.", exVi: "Không có giới hạn chi tiêu thì không có sân chơi bình đẳng giữa câu lạc bộ giàu và nghèo.", more: "create / ensure a level playing field · dùng được ngoài thể thao: for small businesses, for applicants" },
          { w: "governing body", pos: "n phr", ipa: "/ˈɡʌvənɪŋ bɒdi/", vi: "cơ quan quản lý (một môn thể thao, một ngành)", ex: "The sport's governing body introduced stricter testing.", exVi: "Cơ quan quản lý môn này đã áp dụng kiểm tra nghiêm ngặt hơn.", more: "the governing body of / for + môn · số nhiều: governing bodies" },
          { w: "sanction", pos: "n / v", ipa: "/ˈsæŋkʃn/", vi: "(n) hình phạt chính thức; (v) trừng phạt — hoặc chính thức cho phép", ex: "Clubs that break the rules face financial sanctions.", exVi: "Câu lạc bộ phạm luật sẽ chịu hình phạt tài chính.", more: "impose sanctions on · ⚠️ động từ có HAI nghĩa trái nhau: sanction a club (phạt) / sanction a competition (cho phép) — xem mục 4" },
          { w: "commercialisation", pos: "n", ipa: "/kəˌmɜːʃəlaɪˈzeɪʃn/", vi: "sự thương mại hoá", ex: "Critics blame the commercialisation of football for rising ticket prices.", exVi: "Giới phê bình đổ lỗi cho việc thương mại hoá bóng đá làm giá vé tăng.", more: "the commercialisation of sport / education / festivals · commercialise (v) · mang ý chê" },
          { w: "broadcasting rights", pos: "n phr", ipa: "/ˈbrɔːdkɑːstɪŋ raɪts/", vi: "bản quyền phát sóng", ex: "Most of the league's income comes from the sale of broadcasting rights.", exVi: "Phần lớn thu nhập của giải đến từ việc bán bản quyền phát sóng.", more: "sell / buy / bid for the broadcasting rights to + sự kiện" },
          { w: "sponsorship", pos: "n", ipa: "/ˈspɒnsəʃɪp/", vi: "sự tài trợ (của doanh nghiệp, đổi lấy quảng bá)", ex: "Minority sports struggle to attract sponsorship.", exVi: "Các môn ít người chơi khó thu hút tài trợ.", more: "attract / secure sponsorship · a sponsorship deal · corporate sponsorship · khác funding (tiền cấp, không đòi quảng bá)" },
          { w: "endorsement", pos: "n", ipa: "/ɪnˈdɔːsmənt/", vi: "hợp đồng quảng cáo của người nổi tiếng; sự tán thành công khai", ex: "Top athletes often earn more from endorsements than from prize money.", exVi: "Vận động viên hàng đầu thường kiếm từ quảng cáo nhiều hơn từ tiền thưởng.", more: "an endorsement deal · endorse a product / a candidate (v)" },
          { w: "host city", pos: "n phr", ipa: "/ˈhəʊst sɪti/", vi: "thành phố đăng cai", ex: "Host cities are usually left with large debts.", exVi: "Các thành phố đăng cai thường bị bỏ lại với những khoản nợ lớn.", more: "host the Games / a tournament (v) · bid to host · the host nation" },
          { w: "white elephant", pos: "n phr", ipa: "/ˌwaɪt ˈelɪfənt/", vi: "công trình tốn kém mà hầu như vô dụng", ex: "The stadium became a white elephant once the tournament was over.", exVi: "Sân vận động trở thành của nợ ngay khi giải đấu kết thúc.", more: "become / turn into a white elephant · thành ngữ dùng được cả trong bài viết trang trọng vừa phải" },
          { w: "elite", pos: "adj / n", ipa: "/ɪˈliːt/", vi: "đỉnh cao, thuộc nhóm giỏi nhất; giới tinh hoa", ex: "Public money for elite sport is hard to justify when local pitches are closing.", exVi: "Tiền công cho thể thao đỉnh cao khó biện minh khi sân bãi địa phương đang đóng cửa.", more: "elite athletes / sport / universities · the political elite · elitist (adj, ý chê)" },
          { w: "mass participation", pos: "n phr", ipa: "/ˌmæs pɑːˌtɪsɪˈpeɪʃn/", vi: "sự tham gia của đông đảo người dân (thể thao phong trào)", ex: "Investment should favour mass participation over a handful of medals.", exVi: "Đầu tư nên ưu tiên thể thao phong trào hơn là vài tấm huy chương.", more: "a mass-participation event (chạy phong trào) · raise / boost participation rates · gần nghĩa: grassroots sport" },
          { w: "amateur", pos: "adj / n", ipa: "/ˈæmətə/", vi: "nghiệp dư (không nhận lương)", ex: "Rugby remained an amateur sport for most of the twentieth century.", exVi: "Bóng bầu dục vẫn là môn nghiệp dư trong phần lớn thế kỷ XX.", more: "trái: professional · ⚠️ amateurish = vụng về, thiếu chuyên nghiệp (ý chê) — xem mục 4" },
          { w: "underdog", pos: "n", ipa: "/ˈʌndədɒɡ/", vi: "bên bị đánh giá yếu hơn", ex: "Neutral supporters nearly always back the underdog.", exVi: "Khán giả trung lập gần như luôn ủng hộ bên yếu hơn.", more: "back / support the underdog · trái: the favourite · dùng được cho doanh nghiệp, ứng viên" },
        ],
      },
      {
        t: "table",
        head: ["Muốn nói", "Collocation đúng", "⚠️ Lỗi hay gặp"],
        rows: [
          ["tạo sân chơi bình đẳng", "**create / ensure** a level playing field", "~~make an equal playground~~"],
          ["áp hình phạt lên", "**impose** sanctions **on** a club", "~~give sanctions to~~"],
          ["thu hút tài trợ", "**attract / secure** sponsorship", "~~get sponsor~~ (sponsor là người / công ty)"],
          ["có kết quả dương tính", "**test positive for** a banned substance", "~~be positive with doping~~"],
          ["đăng cai", "**host** the Games · **bid to host**", "~~organise the Olympic~~ (the Olympics / the Games)"],
          ["tăng tỉ lệ tham gia", "**raise / boost** participation rates", "~~increase the number of joining sport~~"],
        ],
        caption: "Sáu collocation của nhóm Sport",
      },
      {
        t: "quiz",
        id: "t5d14-the-thao",
        kind: "fill",
        title: "Điền từ / cụm từ của mục 1 (8 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. The new arena was used for three weeks and has stood empty ever since — a classic white e___ .", answers: ["elephant"], hint: "white elephant = công trình tốn kém vô dụng" },
          { q: "2. A salary cap is meant to give smaller clubs a level p___ field.", answers: ["playing"], hint: "a level playing field" },
          { q: "3. The cyclist was stripped of his titles after a d___ investigation.", answers: ["doping"], hint: "dùng chất cấm" },
          { q: "4. The league sold the b___ rights to an online platform.", answers: ["broadcasting"], hint: "bản quyền phát sóng" },
          { q: "5. The governing b___ fined both teams for the incident.", answers: ["body"], hint: "governing body" },
          { q: "6. Shaking hands with your opponent after losing is a sign of good s___ .", answers: ["sportsmanship"], hint: "tinh thần thể thao" },
          { q: "7. Nobody expected the u___ to win, which made the victory all the sweeter.", answers: ["underdog", "underdogs"], hint: "bên bị đánh giá yếu hơn" },
          { q: "8. Her e___ deal with a sportswear brand is worth more than her prize money.", answers: ["endorsement"], hint: "hợp đồng quảng cáo" },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. History vòng 2 — sử liệu, cách kể và ký ức (16 từ)" },
      {
        t: "p",
        text: "Bài đọc Passage 3 và đề Task 2 về lịch sử ở mức band 8 không hỏi “chuyện gì đã xảy ra” mà hỏi ==ta biết bằng cách nào, và ai là người kể==. Vì vậy từ vựng vòng 2 xoay quanh ba câu hỏi: nguồn có đáng tin không (sử liệu), câu chuyện được dựng ra sao (cách kể), xã hội chọn nhớ gì (ký ức).",
      },
      {
        t: "vocab",
        items: [
          { w: "historiography", pos: "n", ipa: "/hɪˌstɒriˈɒɡrəfi/", vi: "việc nghiên cứu cách lịch sử được viết ra; toàn bộ trước tác sử học về một đề tài", ex: "The historiography of the war has changed with each generation.", exVi: "Cách viết sử về cuộc chiến đã thay đổi theo từng thế hệ.", more: "the historiography of + đề tài · historian (người) · từ của Reading; khi viết chỉ dùng nếu thật cần" },
          { w: "revisionism", pos: "n", ipa: "/rɪˈvɪʒənɪzəm/", vi: "việc xét lại cách hiểu đã được chấp nhận về quá khứ", ex: "Not all revisionism is dishonest; new evidence can demand it.", exVi: "Không phải mọi sự xét lại đều thiếu trung thực; bằng chứng mới có thể đòi hỏi điều đó.", more: "historical revisionism · a revisionist account (adj) · sắc thái tuỳ ngữ cảnh: trung tính trong học thuật, chê trong chính trị" },
          { w: "anachronism", pos: "n", ipa: "/əˈnækrənɪzəm/", vi: "thứ đặt sai thời; lỗi lấy chuẩn nay áp cho xưa", ex: "Judging medieval rulers by modern standards is an anachronism.", exVi: "Phán xét các vị vua trung cổ theo chuẩn hiện đại là sai niên đại.", more: "anachronistic (adj) · cũng dùng: The rule is an anachronism (đã lỗi thời)" },
          { w: "hindsight", pos: "n", ipa: "/ˈhaɪndsaɪt/", vi: "sự sáng suốt khi nhìn lại việc đã rồi", ex: "With hindsight, the warning signs were obvious.", exVi: "Nhìn lại thì các dấu hiệu cảnh báo đã rõ ràng.", more: "with / in hindsight · with the benefit of hindsight · hindsight bias (ảo tưởng “tôi đã biết trước”) · trái: foresight" },
          { w: "contemporary account", pos: "n phr", ipa: "/kənˌtemprəri əˈkaʊnt/", vi: "ghi chép của người cùng thời", ex: "Contemporary accounts of the flood differ on the number of dead.", exVi: "Các ghi chép đương thời về trận lụt khác nhau về số người chết.", more: "⚠️ contemporary ở đây = cùng thời với sự kiện, KHÔNG phải “hiện đại” — xem mục 4" },
          { w: "testimony", pos: "n", ipa: "/ˈtestɪməni/", vi: "lời chứng, lời kể của người trong cuộc", ex: "The project recorded the testimony of the last surviving workers.", exVi: "Dự án ghi lại lời kể của những công nhân cuối cùng còn sống.", more: "eyewitness / oral testimony · give testimony · testify (v)" },
          { w: "provenance", pos: "n", ipa: "/ˈprɒvənəns/", vi: "lai lịch, nguồn gốc (của tài liệu, hiện vật)", ex: "The letter's provenance is uncertain, so historians treat it with caution.", exVi: "Lai lịch bức thư không rõ nên các sử gia thận trọng với nó.", more: "of unknown / doubtful provenance · establish the provenance of" },
          { w: "collective memory", pos: "n phr", ipa: "/kəˌlektɪv ˈmeməri/", vi: "ký ức tập thể", ex: "The famine still has a powerful place in the country's collective memory.", exVi: "Nạn đói vẫn có vị trí sâu đậm trong ký ức tập thể của đất nước.", more: "live on in / fade from collective memory · shape collective memory" },
          { w: "commemoration", pos: "n", ipa: "/kəˌmeməˈreɪʃn/", vi: "việc / lễ tưởng niệm", ex: "The commemoration of the battle draws thousands of visitors each year.", exVi: "Lễ tưởng niệm trận đánh thu hút hàng nghìn người mỗi năm.", more: "in commemoration of · commemorate (v, đã học Tập 3 Ngày 12) · commemorative (adj)" },
          { w: "narrative", pos: "n", ipa: "/ˈnærətɪv/", vi: "câu chuyện, cách kể mang một cách hiểu nhất định", ex: "Textbooks tend to present a single national narrative.", exVi: "Sách giáo khoa thường trình bày một câu chuyện dân tộc duy nhất.", more: "the dominant / official narrative · challenge a narrative · khác story: narrative hàm ý có người dựng" },
          { w: "contested", pos: "adj", ipa: "/kənˈtestɪd/", vi: "còn bị tranh cãi", ex: "The causes of the collapse remain contested.", exVi: "Nguyên nhân của sự sụp đổ vẫn còn tranh cãi.", more: "a contested claim / history / territory · hotly / fiercely contested · gần nghĩa: disputed" },
          { w: "upheaval", pos: "n", ipa: "/ʌpˈhiːvl/", vi: "biến động lớn, xáo trộn", ex: "The invention arrived during a period of social upheaval.", exVi: "Phát minh này ra đời trong một thời kỳ xã hội biến động.", more: "political / social / economic upheaval · a time of upheaval" },
          { w: "aftermath", pos: "n", ipa: "/ˈɑːftəmæθ/", vi: "thời kỳ ngay sau (một biến cố) và hậu quả của nó", ex: "In the aftermath of the war, millions were left homeless.", exVi: "Sau chiến tranh, hàng triệu người mất nhà cửa.", more: "in the aftermath of + biến cố xấu · luôn số ít" },
          { w: "continuity", pos: "n", ipa: "/ˌkɒntɪˈnjuːəti/", vi: "tính liên tục, sự tiếp nối", ex: "Historians now stress continuity rather than a sudden break.", exVi: "Các sử gia nay nhấn mạnh sự tiếp nối hơn là một đứt gãy đột ngột.", more: "continuity and change (cặp khái niệm của sử học) · a sense of continuity · trái: rupture, break" },
          { w: "romanticise", pos: "v", ipa: "/rəʊˈmæntɪsaɪz/", vi: "lãng mạn hoá, tô hồng", ex: "It is easy to romanticise village life and forget how hard it was.", exVi: "Rất dễ tô hồng cuộc sống làng quê mà quên nó từng vất vả thế nào.", more: "romanticise the past / poverty / war · a romanticised view · gần nghĩa: idealise" },
          { w: "partisan", pos: "adj", ipa: "/ˌpɑːtɪˈzæn/", vi: "thiên vị một phe", ex: "A partisan source is not useless, but it must be read against others.", exVi: "Một nguồn thiên vị không vô dụng, nhưng phải đọc đối chiếu với nguồn khác.", more: "a partisan account / crowd · trái: impartial, non-partisan" },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai cách nói về quá khứ",
        cols: [
          { title: "Band 7 — kể sự kiện", items: ["History is written by the winners.", "People think the past was better.", "The information is not reliable.", "After the war, life was difficult."] },
          { title: "Band 8 — bàn cách kể", items: ["The dominant **narrative** reflects the interests of those who prevailed.", "We tend to **romanticise** a past we did not have to live through.", "The source is **partisan** and of doubtful **provenance**.", "**In the aftermath of** the war, hardship was the norm."] },
        ],
      },
      {
        t: "quiz",
        id: "t5d14-lich-su",
        kind: "fill",
        title: "Điền từ của mục 2 (8 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. With h___ , it is easy to say that the bank should never have lent the money.", answers: ["hindsight"], hint: "with hindsight = nhìn lại thì…" },
          { q: "2. A clock striking in a play set in ancient Rome is a famous a___ .", answers: ["anachronism"], hint: "thứ đặt sai thời" },
          { q: "3. In the a___ of the earthquake, thousands slept in tents.", answers: ["aftermath"], hint: "in the aftermath of" },
          { q: "4. The diary is of doubtful p___ : nobody knows where it was kept for a century.", answers: ["provenance"], hint: "lai lịch" },
          { q: "5. Whether the reform helped the poor is still hotly c___ .", answers: ["contested"], hint: "còn tranh cãi" },
          { q: "6. Films tend to r___ the age of steam and leave out the smoke and the accidents.", answers: ["romanticise", "romanticize"], hint: "tô hồng" },
          { q: "7. The oral t___ of former miners was recorded before the pit closed.", answers: ["testimony"], hint: "lời kể của người trong cuộc" },
          { q: "8. The newspaper was openly p___ and reported only one side's victories.", answers: ["partisan"], hint: "thiên vị một phe" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Psychology vòng 2 — thiên kiến, tự chủ và đối phó (16 từ)" },
      {
        t: "p",
        text: "Tập 4 Ngày 4 cho bạn từ về trạng thái (well-being, resilience, burnout). Vòng 2 cho từ về ==cơ chế==: vì sao người thông minh vẫn tin điều sai, vì sao biết có hại mà vẫn làm, và người ta xoay xở thế nào. Đây là kho lý do tuyệt vời cho Task 2 dạng nguyên nhân và cho mọi câu Part 3 bắt đầu bằng “Why do people…?”.",
      },
      {
        t: "vocab",
        items: [
          { w: "confirmation bias", pos: "n phr", ipa: "/ˌkɒnfəˈmeɪʃn baɪəs/", vi: "thiên kiến xác nhận: chỉ để ý thông tin hợp với điều mình đã tin", ex: "Confirmation bias leads people to trust only the news they already agree with.", exVi: "Thiên kiến xác nhận khiến người ta chỉ tin những tin tức họ vốn đã đồng ý.", more: "be prone to / fall victim to confirmation bias · bias (đã học) + tên: hindsight bias, optimism bias" },
          { w: "cognitive dissonance", pos: "n phr", ipa: "/ˌkɒɡnətɪv ˈdɪsənəns/", vi: "bất hoà nhận thức: khó chịu khi hành vi trái với niềm tin", ex: "Smokers who know the risks often reduce cognitive dissonance by doubting the research.", exVi: "Người hút thuốc biết rủi ro thường giảm bất hoà nhận thức bằng cách nghi ngờ nghiên cứu.", more: "experience / reduce / resolve cognitive dissonance" },
          { w: "rationalise", pos: "v", ipa: "/ˈræʃnəlaɪz/", vi: "tự tìm lý do nghe hợp lý để biện minh", ex: "We rationalise expensive purchases by calling them investments.", exVi: "Ta biện minh cho món đồ đắt tiền bằng cách gọi nó là khoản đầu tư.", more: "rationalise a decision / behaviour · rationalisation (n) · ⚠️ khác reason (lập luận thật sự) — xem mục 4" },
          { w: "heuristic", pos: "n", ipa: "/hjuˈrɪstɪk/", vi: "lối tắt tư duy, quy tắc ước chừng", ex: "“Expensive means good” is a common heuristic among shoppers.", exVi: "“Đắt là tốt” là một lối tắt tư duy phổ biến của người mua hàng.", more: "a mental heuristic · rely on heuristics · khi Nói dùng a rule of thumb / a mental shortcut" },
          { w: "loss aversion", pos: "n phr", ipa: "/ˈlɒs əˌvɜːʃn/", vi: "ác cảm mất mát: sợ mất nhiều hơn mong được", ex: "Loss aversion explains why people hold on to failing investments.", exVi: "Ác cảm mất mát giải thích vì sao người ta giữ khư khư khoản đầu tư đang lỗ.", more: "be loss-averse (adj) · aversion to risk / change · risk-averse" },
          { w: "overconfidence", pos: "n", ipa: "/ˌəʊvəˈkɒnfɪdəns/", vi: "sự tự tin thái quá", ex: "Overconfidence, not ignorance, causes most accidents among young drivers.", exVi: "Chính sự tự tin thái quá, chứ không phải thiếu hiểu biết, gây ra phần lớn tai nạn ở lái xe trẻ.", more: "overconfident (adj) · overconfidence in one's own judgement" },
          { w: "wishful thinking", pos: "n phr", ipa: "/ˌwɪʃfl ˈθɪŋkɪŋ/", vi: "suy nghĩ viển vông: tin điều mình mong là thật", ex: "Hoping that traffic will solve itself is wishful thinking.", exVi: "Hy vọng giao thông tự hết tắc là viển vông.", more: "be (pure / mere) wishful thinking · dùng rất tốt để bác một giải pháp trong Task 2" },
          { w: "conformity", pos: "n", ipa: "/kənˈfɔːməti/", vi: "sự làm theo chuẩn của nhóm", ex: "School uniforms are sometimes criticised for encouraging conformity.", exVi: "Đồng phục đôi khi bị chê là khuyến khích sự rập khuôn.", more: "conform to (v) · social conformity · pressure to conform · trái: individuality" },
          { w: "herd behaviour", pos: "n phr", ipa: "/ˈhɜːd bɪˌheɪvjə/", vi: "hành vi bầy đàn", ex: "Panic buying is a textbook case of herd behaviour.", exVi: "Mua tích trữ hoảng loạn là ví dụ kinh điển của hành vi bầy đàn.", more: "follow the herd · herd mentality · herd instinct" },
          { w: "delayed gratification", pos: "n phr", ipa: "/dɪˌleɪd ˌɡrætɪfɪˈkeɪʃn/", vi: "trì hoãn sự thoả mãn (chịu chờ để được nhiều hơn)", ex: "Saving for a pension demands delayed gratification.", exVi: "Tiết kiệm cho lương hưu đòi hỏi biết trì hoãn sự thoả mãn.", more: "trái: instant gratification · the ability to delay gratification" },
          { w: "self-control", pos: "n", ipa: "/ˌself kənˈtrəʊl/", vi: "sự tự chủ", ex: "Shops place sweets by the till because self-control is weakest there.", exVi: "Cửa hàng đặt kẹo cạnh quầy thu ngân vì ở đó sự tự chủ yếu nhất.", more: "exercise / lose self-control · gần nghĩa: willpower, self-discipline" },
          { w: "procrastination", pos: "n", ipa: "/prəˌkræstɪˈneɪʃn/", vi: "thói trì hoãn", ex: "Procrastination is less about laziness than about avoiding discomfort.", exVi: "Trì hoãn không hẳn là lười mà là né cảm giác khó chịu.", more: "procrastinate (v) · a habit of procrastination · chronic procrastinator (người)" },
          { w: "coping mechanism", pos: "n phr", ipa: "/ˈkəʊpɪŋ ˌmekənɪzəm/", vi: "cơ chế đối phó (cách xoay xở với căng thẳng)", ex: "For many students, humour is a coping mechanism during exams.", exVi: "Với nhiều sinh viên, hài hước là một cách đối phó trong mùa thi.", more: "a healthy / unhealthy coping mechanism · cope with (v) · coping strategy · ↺ Ôn lại — đã học ở Tập 5 Ngày 12" },
          { w: "rumination", pos: "n", ipa: "/ˌruːmɪˈneɪʃn/", vi: "sự nghĩ đi nghĩ lại một chuyện tiêu cực", ex: "Rumination keeps a small mistake alive for days.", exVi: "Việc nghĩ đi nghĩ lại giữ một lỗi nhỏ sống dai nhiều ngày.", more: "ruminate on / about (v) · khi Nói: dwell on sth, go over and over sth" },
          { w: "introspection", pos: "n", ipa: "/ˌɪntrəˈspekʃn/", vi: "sự tự xét mình, nhìn vào bên trong", ex: "A period of introspection followed the team's defeat.", exVi: "Sau thất bại, cả đội có một thời gian tự xét lại mình.", more: "introspective (adj) · a moment of introspection · gần nghĩa: self-reflection" },
          { w: "predisposition", pos: "n", ipa: "/ˌpriːdɪspəˈzɪʃn/", vi: "khuynh hướng sẵn có (do gen hoặc tính cách)", ex: "Some people have a genetic predisposition to anxiety.", exVi: "Một số người có khuynh hướng di truyền dễ lo âu.", more: "a predisposition to / towards sth · be predisposed to (adj) · khác habit (do lặp lại mà thành)" },
        ],
      },
      {
        t: "table",
        head: ["Đề hỏi “Why do people…?”", "Lý do band 7", "Lý do band 8 — gọi tên cơ chế"],
        rows: [
          ["…believe false news?", "because they don't check", "because **confirmation bias** makes us less critical of claims we already agree with"],
          ["…save too little for old age?", "because they like spending", "because saving demands **delayed gratification**, and the reward is decades away"],
          ["…keep doing a job they dislike?", "because they are afraid", "partly out of **loss aversion**: a certain salary feels safer than an uncertain gain"],
          ["…buy what everyone else buys?", "because of fashion", "**herd behaviour**: we treat other people's choices as evidence"],
          ["…put off important work?", "because they are lazy", "**procrastination** is often a **coping mechanism** for tasks that make us anxious"],
          ["…think the plan will work?", "because they hope", "a mixture of **overconfidence** and **wishful thinking**"],
        ],
        caption: "Gọi đúng tên cơ chế = một câu lý do đáng giá bằng ba câu chung chung",
      },
      {
        t: "quiz",
        id: "t5d14-tam-ly",
        kind: "fill",
        title: "Điền từ của mục 3 (8 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. Expecting drivers to slow down without any enforcement is w___ thinking.", answers: ["wishful"], hint: "wishful thinking = viển vông" },
          { q: "2. People r___ their failure to exercise by saying they are too busy.", answers: ["rationalise", "rationalize"], hint: "tự biện minh" },
          { q: "3. Credit cards weaken self-c___ because the cost is not felt at once.", answers: ["control"], hint: "self-control" },
          { q: "4. Because of loss a___ , a fine works better than a reward of the same size.", answers: ["aversion"], hint: "loss aversion" },
          { q: "5. Investors who buy only because prices are rising are showing h___ behaviour.", answers: ["herd"], hint: "herd behaviour" },
          { q: "6. Checking your phone every few minutes can become a c___ mechanism for boredom.", answers: ["coping"], hint: "coping mechanism" },
          { q: "7. Social media rewards instant g___ rather than patience.", answers: ["gratification"], hint: "instant gratification" },
          { q: "8. He searched only for studies that supported his view — a clear case of c___ bias.", answers: ["confirmation"], hint: "confirmation bias" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Sáu cặp dễ nhầm trong ba chủ đề" },
      {
        t: "table",
        head: ["Cặp", "Từ 1", "Từ 2"],
        rows: [
          ["historic / historical", "**historic** = có ý nghĩa lịch sử, trọng đại: a historic victory", "**historical** = thuộc về lịch sử / quá khứ: historical records, a historical novel"],
          ["contemporary", "cùng thời với sự kiện đang nói: contemporary accounts **of the fire**", "hiện đại, thời nay: contemporary art — nhìn ngữ cảnh để biết nghĩa nào"],
          ["sanction (v)", "trừng phạt: The body **sanctioned** the club.", "chính thức cho phép: The body **sanctioned** the new format. — danh từ số nhiều sanctions gần như luôn là hình phạt"],
          ["amateur / amateurish", "**amateur** = không nhận lương, trung tính: an amateur choir", "**amateurish** = vụng, thiếu chuyên nghiệp, ý chê: an amateurish website"],
          ["rationalise / reason", "**rationalise** = bịa lý do cho việc đã làm", "**reason** = suy luận thật để đi tới kết luận"],
          ["conformity / compliance", "**conformity** = tự làm theo nhóm (áp lực xã hội)", "**compliance** = làm theo luật / yêu cầu chính thức: compliance with safety rules"],
        ],
      },
      {
        t: "mcq",
        id: "t5d14-de-nham",
        title: "Cặp dễ nhầm — chọn phương án đúng (6 câu)",
        items: [
          { q: "1. The signing of the treaty was a ___ moment for the region.", options: ["A  historic", "B  historical", "C  history"], correct: 0, why: "Trọng đại, có ý nghĩa lịch sử → historic." },
          { q: "2. The film is not a documentary; it is a ___ drama set in the 1850s.", options: ["A  historic", "B  historical", "C  contemporary"], correct: 1, why: "Thuộc về / lấy bối cảnh quá khứ → historical." },
          { q: "3. “___ accounts of the eruption describe a sky dark at noon.” Ở đây từ cần điền nghĩa là:", options: ["A  Contemporary — viết bởi người sống cùng thời vụ phun trào", "B  Contemporary — viết bởi các nhà khoa học ngày nay", "C  Temporary — tạm thời"], correct: 0, why: "contemporary accounts of + sự kiện quá khứ = ghi chép đương thời với sự kiện." },
          { q: "4. The website looked ___ : blurred photos, spelling mistakes, broken links.", options: ["A  amateur", "B  amateurish", "C  elite"], correct: 1, why: "Ý chê, vụng về → amateurish. amateur chỉ nói “không chuyên”, không chê." },
          { q: "5. “The federation refused to sanction the new league.” nghĩa là:", options: ["A  từ chối trừng phạt giải mới", "B  từ chối công nhận / cho phép giải mới", "C  từ chối tài trợ giải mới"], correct: 1, why: "sanction + một hoạt động / kế hoạch = chính thức cho phép. Với sanction + người / tổ chức vi phạm mới là phạt." },
          { q: "6. Inspectors visit factories to make sure that they are fully ___ with safety law.", options: ["A  conformist", "B  compliant", "C  commemorative"], correct: 1, why: "be compliant with + luật / quy định = tuân thủ. conformist tả NGƯỜI hay a dua theo số đông (họ hàng với conformity của mục 3), không đi với “with safety law”; commemorative = để tưởng niệm." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Dùng ngay: câu Task 2 và Part 3 với từ hôm nay" },
      {
        t: "examples",
        items: [
          { en: "Hosting a major tournament is defended as an investment, yet many host cities are left with white elephants and no lasting rise in participation.", vi: "Đăng cai giải lớn được bênh vực như một khoản đầu tư, nhưng nhiều thành phố đăng cai chỉ còn lại của nợ và không có mức tăng lâu dài nào về số người chơi thể thao." },
          { en: "A lifetime ban for doping may seem harsh, but without credible sanctions there is no level playing field for clean athletes.", vi: "Cấm suốt đời vì doping có vẻ nặng, nhưng không có hình phạt đủ sức răn đe thì không có sân chơi bình đẳng cho vận động viên sạch." },
          { en: "School history should teach pupils to ask who produced a source and why, rather than to memorise a single national narrative.", vi: "Môn sử ở trường nên dạy học sinh hỏi ai tạo ra nguồn sử liệu và vì sao, thay vì thuộc lòng một câu chuyện dân tộc duy nhất." },
          { en: "We tend to romanticise the past, partly because hindsight makes its dangers look smaller than they felt at the time.", vi: "Ta hay tô hồng quá khứ, một phần vì nhìn lại thì hiểm nguy của nó trông nhỏ hơn cảm giác lúc bấy giờ." },
          { en: "Public health campaigns fail when they assume that information is enough; they underestimate loss aversion and the pull of instant gratification.", vi: "Chiến dịch y tế công thất bại khi cho rằng thông tin là đủ; chúng đánh giá thấp ác cảm mất mát và sức hút của sự thoả mãn tức thì." },
          { en: "I think a lot of it is herd behaviour, to be honest — nobody wants to be the only one who didn't buy a ticket.", vi: "Thật lòng tôi nghĩ phần nhiều là hành vi bầy đàn — không ai muốn là người duy nhất không mua vé. (Part 3)" },
        ],
      },
      {
        t: "quiz",
        id: "t5d14-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (5 câu)",
        grammar: "Dùng đúng collocation của mục 1–3",
        items: [
          { q: "Nhìn lại thì quyết định đăng cai giải đấu là một sai lầm.", answers: ["With hindsight, the decision to host the tournament was a mistake.", "In hindsight, the decision to host the tournament was a mistake.", "With hindsight, deciding to host the tournament was a mistake."], hint: "With hindsight · host the tournament" },
          { q: "Nếu không có hình phạt nghiêm khắc, sẽ không có sân chơi bình đẳng.", answers: ["Without strict sanctions, there will be no level playing field.", "Without tough sanctions, there will be no level playing field.", "Without strict sanctions, there is no level playing field.", "Without severe sanctions, there will be no level playing field."], hint: "sanctions · a level playing field" },
          { q: "Chúng ta thường tô hồng quá khứ và quên những khó khăn của nó.", answers: ["We often romanticise the past and forget its hardships.", "We tend to romanticise the past and forget its hardships.", "We often romanticize the past and forget its hardships.", "We often romanticise the past and forget its difficulties."], hint: "romanticise the past · hardships" },
          { q: "Thiên kiến xác nhận khiến người ta bỏ qua những bằng chứng trái với niềm tin của mình.", answers: ["Confirmation bias leads people to ignore evidence that contradicts their beliefs.", "Confirmation bias makes people ignore evidence that contradicts their beliefs.", "Confirmation bias causes people to ignore evidence that contradicts their beliefs."], hint: "Confirmation bias · contradict their beliefs" },
          { q: "Tin rằng công nghệ sẽ tự giải quyết vấn đề là viển vông.", answers: ["Believing that technology will solve the problem by itself is wishful thinking.", "Believing that technology will solve the problem on its own is wishful thinking.", "To believe that technology will solve the problem by itself is wishful thinking.", "It is wishful thinking to believe that technology will solve the problem by itself."], hint: "wishful thinking · by itself / on its own" },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học 48 từ này trong 7 ngày",
        items: [
          "Hôm nay: làm ba bài kiểm, đánh dấu từ sai. Ngày mai: mở Flashcards, bộ “Từ của khoá — Tập 5”, lọc Ngày 14.",
          "Mỗi nhóm chọn 5 từ bạn thấy hợp với mình nhất và viết cho mỗi từ MỘT câu về Việt Nam hoặc về ngành IT — từ gắn với chuyện của mình thì ở lại.",
          "Khi Nói, đừng dùng heuristic, historiography, cognitive dissonance trừ khi chủ đề thật sự gọi; dùng bản nói: a rule of thumb, the way history gets written, that uncomfortable feeling when….",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d14-viet",
    kind: "writing",
    title: "Viết Task 2: Trộn dạng — nhận dạng đề lạ trong 2 phút, đếm nhiệm vụ, chọn khung (bài mẫu band 7 và band 8 cùng một đề “nguyên nhân + đánh giá”)",
    goal: "Đọc bất kỳ đề Task 2 nào, kể cả đề không khớp năm dạng quen thuộc, và trong 2 phút xác định được đề giao MẤY nhiệm vụ, nhiệm vụ nào ẩn trong chữ tuyệt đối hoặc chữ so sánh, rồi dựng khung thân bài sao cho mỗi nhiệm vụ có chỗ riêng và thesis trả lời đủ tất cả; viết trọn một bài 280–310 từ cho đề trộn “Why…? Should this concern us?” ở mức TR band 8.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **TR 7 → 8**. Mô tả công khai: band 8 ==sufficiently addresses all parts of the task==; trả lời lệch nặng nhẹ giữa các phần là dấu hiệu band 6; bỏ hẳn một phần thì khó qua band 5 ở tiêu chí này.",
          "Năm khung bạn đã có (Opinion · Discussion · Advantages/Disadvantages · Problem/Solution · Two-part) không phải năm cái hộp để nhét đề vào. Chúng là ==năm bộ linh kiện==; đề lạ là đề cần ghép linh kiện.",
          "Kỹ năng hôm nay: **đếm nhiệm vụ**. Mỗi dấu hỏi, mỗi động từ lệnh (discuss, give your opinion, suggest), mỗi chữ tuyệt đối hoặc so sánh (the best, only, more important than) là một nhiệm vụ.",
          "Luật dựng khung: ==một nhiệm vụ lớn = một thân bài==; ba nhiệm vụ = hai thân bài + một nhiệm vụ gộp vào đoạn hợp nhất, không viết ba thân bài mỏng.",
          "Thesis của đề trộn có **hai vế**, mỗi vế trả lời một nhiệm vụ. Người chấm đọc xong mở bài phải biết bạn sẽ trả lời gì cho TỪNG câu hỏi.",
          "Nối Tập 3 Ngày 6 (đếm vế đề), Tập 4 Ngày 28 (two-part), Tập 5 Ngày 4 · 10 (Opinion, Discussion band 8) và Bài 1 Ngày 13 (liều cấu trúc).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Năm bộ linh kiện đã có — ôn trong một bảng" },
      {
        t: "table",
        head: ["Dạng", "Câu lệnh điển hình", "Nhiệm vụ", "Khung thân bài", "Đã học"],
        rows: [
          ["Opinion", "To what extent do you agree or disagree?", "nêu lập trường + chống đỡ", "lý do của tôi → phía bên kia + bác", "T3 N6 · T4 N4 · T5 N4"],
          ["Discussion", "Discuss both views and give your own opinion.", "thuật A · thuật B · lập trường", "A (có đánh giá) → B (có đánh giá)", "T3 N10 · T5 N10"],
          ["Adv / Disadv", "Do the advantages outweigh the disadvantages?", "nêu hai phía + CÂN", "phía nhẹ → phía nặng", "T3 N14 · T4 N14"],
          ["Problem / Solution", "What problems…? What can be done?", "vấn đề (hoặc nguyên nhân) + giải pháp khớp", "vấn đề → giải pháp gắn từng vấn đề", "T3 N18 · T4 N22"],
          ["Two-part", "Why…? Is this a positive or negative development?", "hai câu hỏi khác loại", "câu hỏi 1 → câu hỏi 2", "T3 N22 · T4 N28"],
        ],
      },
      {
        t: "note",
        title: "📌 Ba điều năm khung này có chung",
        items: [
          "4 đoạn: mở bài (paraphrase + thesis) · hai thân bài · kết bài. Đề lạ đến đâu cũng không cần đoạn thứ năm.",
          "Mỗi thân bài làm MỘT việc và mở bằng câu nói rõ việc đó.",
          "Lập trường xuất hiện ở mở bài và nhất quán tới kết bài — kể cả khi đề không có chữ opinion.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Bảy kiểu đề “lạ” — thật ra là trộn linh kiện nào" },
      {
        t: "table",
        head: ["Kiểu", "Ví dụ (đề tự soạn)", "Nhiệm vụ thật", "Khung"],
        rows: [
          ["**A. Nguyên nhân + đánh giá**", "More people follow professional sport than play it. Why is this the case? Is this a trend that should concern us?", "① vì sao ② có đáng lo không (lập trường)", "TB1 nguyên nhân · TB2 đánh giá có cân nhắc"],
          ["**B. Opinion có câu hỏi phụ**", "Schools should teach history mainly through local stories. To what extent do you agree? What else should history lessons include?", "① lập trường ② đề xuất thêm", "TB1 lập trường + lý do · TB2 phần còn thiếu + đề xuất"],
          ["**C. Discussion ngầm**", "Is success in life due more to effort or to luck?", "① xét effort ② xét luck ③ chọn", "như Discussion: hai thân bài có đánh giá, thesis chọn phía"],
          ["**D. Adv / Disadv ngầm**", "Many cities bid to host major sporting events. Is this a good use of public money?", "① lợi ② hại ③ cân", "phía nhẹ → phía nặng; thesis nói phía nào thắng"],
          ["**E. Ba câu hỏi**", "Many adults know little about their country's past. Why? What are the effects? How could this be changed?", "① nguyên nhân ② hệ quả ③ giải pháp", "TB1 nguyên nhân + hệ quả (chuỗi) · TB2 giải pháp khớp nguyên nhân"],
          ["**F. Chữ tuyệt đối / so sánh**", "The best way to improve public health is to make sport compulsory at school. Do you agree?", "① sport có giúp không ② có phải cách TỐT NHẤT không", "TB1 nó giúp đến đâu · TB2 so với cách khác"],
          ["**G. Mệnh đề có tiền đề ẩn**", "Since people can never learn from history, it should no longer be a school subject. Do you agree?", "① tiền đề có đúng không ② kết luận có theo sau không", "TB1 xét tiền đề · TB2 dù tiền đề đúng, kết luận có đứng không"],
        ],
        caption: "Đề lạ = đề quen trộn lại. Nhìn nhiệm vụ, đừng nhìn hình dáng câu.",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — ba chỗ người band 7 mất TR ở đề trộn",
        items: [
          "**Viết theo khung thuộc lòng:** thấy “Why…?” là viết bài Problem/Solution, bỏ quên câu hỏi “Is this a concern?”.",
          "**Lệch nặng nhẹ:** 180 từ cho câu hỏi 1, 40 từ cho câu hỏi 2. Hai nhiệm vụ lớn cần hai thân bài gần bằng nhau.",
          "**Bỏ chữ tuyệt đối:** đề nói the best way mà bài chỉ chứng minh a good way. Phải so với ít nhất MỘT cách khác.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Quy trình 2 phút — đếm nhiệm vụ rồi mới chọn khung" },
      {
        t: "sodo",
        kind: "flow",
        title: "Từ đề tới khung — năm bước",
        steps: [
          { label: "① Gạch chân lệnh", sub: "mọi dấu ? và mọi động từ lệnh: discuss · agree · why · what · how · suggest · is this…" },
          { label: "② Khoanh chữ “gài”", sub: "the best · the only · always · never · more… than · rather than · since / because (tiền đề)" },
          { label: "③ Đánh số nhiệm vụ", sub: "① ② (③). Mỗi nhiệm vụ viết lại thành một câu hỏi ngắn của riêng bạn." },
          { label: "④ Xếp vào hai thân bài", sub: "2 nhiệm vụ → mỗi thân bài một cái. 3 nhiệm vụ → ghép hai cái có quan hệ nhân quả vào một đoạn." },
          { label: "⑤ Viết thesis hai vế", sub: "mỗi vế trả lời một nhiệm vụ. Đọc lại đề: còn dấu ? nào chưa có câu trả lời trong thesis không?" },
        ],
      },
      { t: "rule", formula: "số nhiệm vụ = số dấu ? + số động từ lệnh + số chữ “gài”   →   mỗi nhiệm vụ lớn = một thân bài   →   thesis trả lời TỪNG nhiệm vụ", vi: "Công thức nhận dạng mọi đề Task 2, quen hay lạ." },
      {
        t: "mcq",
        id: "t5d14-viet-nhan-dang",
        title: "Nhận dạng — đề này giao những nhiệm vụ nào? (8 câu)",
        items: [
          { q: "1. “In many countries, traditional sports are disappearing. Why is this happening? Should governments try to preserve them?”", options: ["A  nguyên nhân + giải pháp", "B  nguyên nhân + lập trường (có nên hay không)", "C  ưu điểm + nhược điểm"], correct: 1, why: "Câu hỏi 2 là Should…? = hỏi lập trường, không hỏi “làm cách nào”. Viết danh sách giải pháp là lệch đề." },
          { q: "2. “Some people say that studying history is a waste of time because the past cannot be changed. To what extent do you agree?”", options: ["A  chỉ cần nói có đồng ý history is a waste of time không", "B  xét cả kết luận (waste of time) lẫn lý do đề đưa ra (because…)", "C  thuật hai quan điểm rồi không chọn"], correct: 1, why: "Kiểu G: mệnh đề có tiền đề. Bài band 8 nói: tiền đề đúng (không đổi được quá khứ) nhưng kết luận không theo sau." },
          { q: "3. “The only way to stop doping is to ban offenders for life. Do you agree or disagree?”", options: ["A  lifetime ban có hiệu quả không", "B  lifetime ban có hiệu quả không + có phải cách DUY NHẤT không", "C  nguyên nhân của doping"], correct: 1, why: "the only way là chữ gài: phải xét ít nhất một cách khác (testing, giáo dục, phạt đội)." },
          { q: "4. “Is it better for children to play team sports or individual sports?”", options: ["A  Discussion ngầm: xét từng loại rồi chọn", "B  Problem / Solution", "C  chỉ nêu ưu điểm của team sports"], correct: 0, why: "Kiểu C: câu hỏi A or B = hai quan điểm + lập trường." },
          { q: "5. “Many museums now charge for entry. What are the reasons for this? What effects does it have on society? What alternatives are there?”", options: ["A  ba nhiệm vụ → ba thân bài ngắn", "B  ba nhiệm vụ → TB1 nguyên nhân + hệ quả, TB2 phương án thay thế", "C  chỉ trả lời câu hỏi mình có nhiều ý nhất"], correct: 1, why: "Kiểu E: ghép hai nhiệm vụ có quan hệ nhân quả; vẫn hai thân bài đủ dày." },
          { q: "6. “People today are more anxious than previous generations, despite being wealthier. Do you think this is true? What might explain it?”", options: ["A  lập trường về một nhận định + giải thích", "B  ưu / nhược của sự giàu có", "C  giải pháp cho lo âu"], correct: 0, why: "Kiểu B đảo: câu hỏi 1 hỏi nhận định có đúng không (cho phép đồng ý một phần), câu 2 hỏi nguyên nhân." },
          { q: "7. “Watching sport on television is replacing playing sport. Is this a welcome development?”", options: ["A  nguyên nhân", "B  Adv / Disadv ngầm: lợi, hại, và cân", "C  giải pháp"], correct: 1, why: "Kiểu D: Is this a welcome / positive development? = cân hai phía và nói phía nào thắng." },
          { q: "8. “Governments spend large sums commemorating historical events. Some say this money would be better spent on the living. Discuss this view and give your opinion.”", options: ["A  Discuss both views: thuật hai quan điểm ngang nhau", "B  đánh giá MỘT quan điểm đã cho (chỗ đúng, chỗ yếu) rồi nêu lập trường", "C  liệt kê các lễ tưởng niệm"], correct: 1, why: "Discuss this view (số ít): xét kỹ một quan điểm — phần đúng của nó và giới hạn của nó — chứ không cần dựng thêm một “phe kia” ngang hàng." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Đề hôm nay — đếm nhiệm vụ trước khi đọc bài mẫu" },
      {
        t: "p",
        text: "**In many countries, people now spend far more time and money following professional sport than taking part in sport themselves. Why is this the case? Is this a trend that should concern us?** Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      },
      {
        t: "table",
        head: ["Chữ trong đề", "Nhiệm vụ", "Bài phải làm gì"],
        rows: [
          ["far more time **and money**", "(phạm vi)", "nói về cả thời gian lẫn tiền; đừng chỉ nói “xem tivi”"],
          ["following… **than** taking part", "(phạm vi — một phép so sánh)", "giải thích cả hai nửa: vì sao XEM nhiều, vì sao CHƠI ít"],
          ["**Why** is this the case?", "① nguyên nhân", "một thân bài: 1–2 nguyên nhân có cơ chế, không phải danh sách"],
          ["Is this a trend that **should concern us**?", "② lập trường có cân nhắc", "một thân bài: lo hay không, lo ở ĐIỂM nào, với AI"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: “than” trong đề là một nhiệm vụ giấu",
        items: [
          "Đề so sánh hai thứ (following… than taking part). Bài chỉ giải thích vì sao người ta thích xem mới trả lời một nửa.",
          "Câu hỏi “should concern us” không đòi bạn trả lời Yes hoặc No tuyệt đối. Lập trường band 8 thường là: đáng lo ==trong chừng mực== việc xem THAY THẾ việc chơi.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Hai bài mẫu cùng đề — band 7 và band 8 đặt cạnh nhau" },
      { t: "p", text: "Đọc bài band 7 trước. Tự hỏi: thesis đã trả lời cả hai câu hỏi chưa? Thân bài 1 có giải thích nửa “chơi ít” không? Thân bài 2 nói lo cho AI?" },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 258 từ",
        paras: [
          { text: "Nowadays, many people prefer watching professional sport to playing sport themselves. This essay will discuss the reasons for this trend and explain why I think it is a negative development." },
          { text: "There are several reasons why people follow sport instead of playing it. Firstly, professional sport is very easy to access. People can watch matches on television or on their phones at any time, and they do not need any equipment or skill. Secondly, modern life is very busy. Many people work long hours and feel too tired to exercise in the evening, so watching a match is a way to relax. Moreover, sports clubs spend a lot of money on advertising, which makes fans want to buy shirts and tickets. For example, many football fans in my country buy a new shirt every season." },
          { text: "In my opinion, this trend should concern us for two reasons. The first reason is health. If people only sit and watch sport, they will not get enough exercise, and this can cause obesity and heart disease. As a result, governments must spend more money on hospitals. The second reason is money. Following a team is expensive, and some families spend too much on tickets and subscriptions. However, watching sport also has some benefits, because it brings people together and makes them happy." },
          { text: "In conclusion, people follow professional sport because it is convenient and because they are busy, and I believe this is a worrying trend because it is bad for people's health and their money. Governments should encourage people to play more sport." },
        ],
      },
      { t: "p", text: "Giờ đọc bài band 8. Cùng lập trường tổng (có đáng lo), nhưng để ý: thesis hai vế; thân bài 1 giải thích CẢ hai nửa của phép so sánh; thân bài 2 nói rõ lo cho ai và không lo cho ai." },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 313 từ",
        paras: [
          { text: "In many countries the audience for professional sport has never been larger, while the proportion of adults who play any sport regularly remains stubbornly low. I would argue that this gap owes less to laziness than to the way sport is now sold and the way cities are built, and that it is a cause for concern only in so far as watching has come to replace playing rather than accompany it." },
          { text: "The main reason is that following sport has become effortless while taking part has not. A match can be streamed on a phone at any hour, and broadcasters and sponsors invest heavily in making every fixture feel unmissable. Playing, by contrast, requires a pitch, a team and a free evening, and in many crowded cities all three are in short supply. An office worker who finishes at seven can watch a game on the train home; joining one would mean finding a club with space and a timetable that suits. It is hardly surprising that the former wins." },
          { text: "Whether this should worry us depends on what spectating displaces. For the supporter who also plays at the weekend, following a club is a harmless pleasure and often a source of belonging. The concern is the growing number of people for whom sport is something that others do. Their inactivity carries well-documented risks to health, the cost of which eventually falls on public services. There is also a quieter loss: public money that might have paid for local pitches is too often spent on attracting elite events, on the assumption that watching champions inspires participation. Appealing as that assumption is, the evidence for it is thin." },
          { text: "In short, people watch because watching has been made easy, and do not play because playing has not. The trend deserves concern, but the remedy lies in making participation as convenient as spectating, not in discouraging fans." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Khác nhau ở đâu? — bốn tiêu chí" },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 7", "Bài band 8", "Động tác tạo khác biệt"],
        rows: [
          ["**TR**", "trả lời cả hai câu hỏi nhưng: chỉ giải thích “xem nhiều”, không giải thích “chơi ít”; “bad for health and money” khái quát; câu benefits lạc cuối đoạn", "giải thích cả hai nửa phép so sánh; lập trường có điều kiện (only in so far as); phân biệt người xem có chơi và người chỉ xem", "đếm nhiệm vụ kể cả chữ than; lập trường nói rõ PHẠM VI"],
          ["**CC**", "Firstly · Secondly · Moreover · The first reason · The second reason · However · In conclusion", "by contrast · the former · Their inactivity · that assumption · In short — hai từ nối lộ", "this / that + danh từ tóm tắt; câu chủ đề nói việc của đoạn"],
          ["**LR**", "easy to access · very busy · a lot of money · bad for", "effortless · unmissable · in short supply · displaces · elite events · the evidence is thin", "collocation chính xác; từ của Bài 1 dùng đúng chỗ (elite, participation)"],
          ["**GRA**", "câu đơn + and / so / because; không lỗi nặng nhưng ít loại cấu trúc", "less… than… · while · mệnh đề quan hệ (the cost of which…) · Appealing as… — MỘT nhượng bộ hiếm, không đảo ngữ", "liều cấu trúc của Ngày 13: đủ, không khoe"],
        ],
        caption: "Cùng một lập trường — khác nhau ở độ khớp với đề",
      },
      {
        t: "note",
        title: "📌 Đếm trong bài band 8",
        items: [
          "Thesis: 2 vế — vế 1 trả lời Why (the way sport is sold + the way cities are built), vế 2 trả lời Should it concern us (only in so far as…).",
          "Thân bài 1: 5 câu, một nguyên nhân duy nhất được đào sâu qua một ví dụ (người đi làm tan ca lúc bảy giờ).",
          "Thân bài 2: câu chủ đề là một câu ĐIỀU KIỆN (depends on what spectating displaces) → nhóm không đáng lo → nhóm đáng lo → hệ quả → mất mát thứ hai → bác một giả định.",
          "Cấu trúc nổi: 1 nhượng bộ (Appealing as…). Không câu chẻ, không đảo ngữ — bài không cần.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Thesis hai vế cho đề trộn — sáu khuôn" },
      {
        t: "patterns",
        rows: [
          {
            formula: "I would argue that + (trả lời ①), and that + (trả lời ②)",
            vi: "Khuôn gốc: hai mệnh đề that song song.",
            examples: [{ en: "I would argue that traditional sports are fading mainly because schools no longer teach them, and that governments should support them only where local people still take part.", vi: "Tôi cho rằng thể thao truyền thống mai một chủ yếu vì trường học không còn dạy, và chính phủ chỉ nên hỗ trợ ở nơi người dân còn tham gia." }],
          },
          {
            formula: "This (trend) is largely the result of + N; while …, I believe …",
            vi: "Nguyên nhân bằng cụm danh từ + lập trường có nhượng bộ.",
            examples: [{ en: "This shift is largely the result of cheaper streaming; while it has made sport more accessible, I believe it has done little for public health.", vi: "Sự dịch chuyển này phần lớn là kết quả của dịch vụ phát trực tuyến rẻ hơn; tuy nó làm thể thao dễ tiếp cận hơn, tôi tin nó chẳng giúp gì nhiều cho sức khoẻ cộng đồng." }],
          },
          {
            formula: "Although S V (phần đồng ý), I disagree that + (chữ tuyệt đối)",
            vi: "Cho đề có the best / the only.",
            examples: [{ en: "Although compulsory sport would benefit many pupils, I disagree that it is the best way to improve public health.", vi: "Dù thể thao bắt buộc có lợi cho nhiều học sinh, tôi không đồng ý rằng đó là cách tốt nhất để cải thiện sức khoẻ cộng đồng." }],
          },
          {
            formula: "While the premise is true / sound, the conclusion does not follow",
            vi: "Cho đề có tiền đề (since / because…).",
            examples: [{ en: "While it is true that the past cannot be changed, it does not follow that studying it is pointless.", vi: "Dù đúng là không thể thay đổi quá khứ, điều đó không có nghĩa là học về nó là vô ích." }],
          },
          {
            formula: "S V only in so far as / to the extent that + S V",
            vi: "Lập trường có điều kiện — dấu hiệu band 8.",
            examples: [{ en: "Such spending is justified only to the extent that the facilities remain in public use afterwards.", vi: "Khoản chi như vậy chỉ chính đáng trong chừng mực các công trình vẫn được công chúng dùng về sau." }],
          },
          {
            formula: "Both N and N play a part, but the latter / the former is decisive",
            vi: "Cho câu hỏi A or B.",
            examples: [{ en: "Both effort and luck play a part in success, but I would argue that the former matters more over a whole career.", vi: "Cả nỗ lực lẫn may mắn đều góp phần vào thành công, nhưng tôi cho rằng nỗ lực quan trọng hơn khi xét cả sự nghiệp." }],
          },
        ],
      },
      { t: "rule", formula: "I would argue that + (① vì sao / đúng đến đâu), and that + (② nên / không nên — only in so far as …)", vi: "Thesis hai vế: đọc xong mở bài, người chấm biết câu trả lời cho từng câu hỏi của đề." },
      {
        t: "quiz",
        id: "t5d14-viet-thesis-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — thesis hai vế (4 câu)",
        grammar: "I would argue that…, and that… · Although…, I disagree that… · only to the extent that… · While it is true that…, it does not follow that…",
        items: [
          { q: "Tôi cho rằng xu hướng này chủ yếu do giá vé tăng, và rằng nó đáng lo đối với các gia đình thu nhập thấp.", answers: ["I would argue that this trend is mainly caused by rising ticket prices, and that it is worrying for low-income families.", "I would argue that this trend is mainly due to rising ticket prices, and that it is a concern for low-income families.", "I would argue that this trend is mainly the result of rising ticket prices, and that it is worrying for low-income families."], hint: "I would argue that…, and that… · rising ticket prices · low-income families" },
          { q: "Dù lệnh cấm suốt đời có thể răn đe một số vận động viên, tôi không đồng ý rằng đó là cách duy nhất để chấm dứt doping.", answers: ["Although lifetime bans may deter some athletes, I disagree that they are the only way to stop doping.", "Although a lifetime ban may deter some athletes, I disagree that it is the only way to stop doping.", "Although a lifetime ban may deter some athletes, I disagree that it is the only way to end doping."], hint: "deter · I disagree that · the only way" },
          { q: "Việc đăng cai chỉ chính đáng trong chừng mực các sân vận động vẫn được sử dụng về sau.", answers: ["Hosting is justified only to the extent that the stadiums remain in use afterwards.", "Hosting is justified only in so far as the stadiums remain in use afterwards.", "Hosting is justified only to the extent that the stadiums are still used afterwards."], hint: "is justified only to the extent that · remain in use" },
          { q: "Dù đúng là quá khứ không thể thay đổi, điều đó không có nghĩa là lịch sử vô dụng.", answers: ["While it is true that the past cannot be changed, it does not follow that history is useless.", "Although it is true that the past cannot be changed, it does not follow that history is useless.", "While it is true that the past cannot be changed, it does not follow that history is pointless."], hint: "While it is true that · it does not follow that" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Dựng khung nhanh cho ba đề lạ" },
      {
        t: "table",
        head: ["Đề", "Nhiệm vụ", "Thesis mẫu", "TB1 · TB2"],
        rows: [
          ["The best way to improve public health is to make sport compulsory at school. Do you agree?", "① sport giúp đến đâu ② có phải TỐT NHẤT", "Although compulsory sport would help, I disagree that it is the best way: diet and urban design reach far more people.", "TB1: nó giúp ai, giúp gì (thừa nhận thật) · TB2: so với hai cách khác — phạm vi rộng hơn, bền hơn"],
          ["Since people never learn from history, it should no longer be a school subject. Do you agree?", "① tiền đề đúng không ② kết luận có theo sau không", "The premise is only partly true, and even if it were wholly true the conclusion would not follow.", "TB1: người ta CÓ học, dù không hoàn hảo (ví dụ) · TB2: môn sử còn dạy cách đánh giá nguồn — giá trị không phụ thuộc tiền đề"],
          ["Many adults know little about their country's past. Why? What are the effects? How could this be changed?", "① vì sao ② hệ quả ③ thay đổi thế nào", "This ignorance stems from how history is taught, leaves citizens open to partisan narratives, and could be reduced by teaching through sources rather than dates.", "TB1: nguyên nhân → hệ quả (một chuỗi) · TB2: giải pháp nhắm đúng nguyên nhân"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: khi thật sự không biết đề thuộc dạng nào",
        items: [
          "Đừng cố gọi tên dạng. Viết lại từng nhiệm vụ thành câu hỏi của bạn, rồi dành cho mỗi câu hỏi một thân bài.",
          "Câu chủ đề của mỗi thân bài = câu trả lời ngắn cho đúng một câu hỏi của đề. Nếu ghép hai câu chủ đề lại mà thành thesis thì khung đúng.",
          "Phân giờ không đổi: 2 phút đếm nhiệm vụ + 3 phút dàn ý, 30 phút viết, 5 phút soát (lượt đầu tiên của soát: “mỗi dấu ? của đề có đoạn riêng chưa?”).",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Kiểm tra cuối bài (6 câu)" },
      {
        t: "mcq",
        id: "t5d14-viet-kiem",
        title: "Chọn phương án đúng",
        items: [
          { q: "1. Đề có hai câu hỏi; bài viết 190 từ cho câu 1 và 45 từ cho câu 2. Hệ quả về TR?", options: ["A  Không sao, miễn có nhắc tới câu 2.", "B  Trả lời lệch: “some parts more fully than others” — dấu hiệu band 6.", "C  Được cộng điểm vì đào sâu câu 1."], correct: 1, why: "Band 7 trở lên đòi addresses all parts of the task; lệch nặng nhẹ kéo TR xuống 6." },
          { q: "2. Thesis nào trả lời đủ đề “Why are traditional sports disappearing? Should governments try to preserve them?”", options: ["A  This essay will discuss the reasons and give my opinion.", "B  Traditional sports are disappearing for many reasons, which is a serious problem.", "C  They are fading chiefly because schools and media ignore them, and I believe public support is justified where communities still practise them."], correct: 2, why: "Hai vế, mỗi vế một câu trả lời cụ thể. A chỉ báo trước; B không trả lời Should." },
          { q: "3. Đề: “The only way to… is…”. Thân bài 2 nên làm gì?", options: ["A  Thêm ưu điểm thứ ba của biện pháp trong đề.", "B  So biện pháp trong đề với ít nhất một cách khác.", "C  Kể lịch sử của vấn đề."], correct: 1, why: "Chữ only là một nhiệm vụ: phải xét cách khác thì mới nói được có phải duy nhất không." },
          { q: "4. Ba câu hỏi trong đề. Khung nào tốt nhất?", options: ["A  Ba thân bài, mỗi cái 60 từ.", "B  Hai thân bài: ghép hai câu hỏi có quan hệ nhân quả, câu còn lại một đoạn.", "C  Một thân bài 200 từ trả lời lần lượt."], correct: 1, why: "Giữ hai thân bài đủ dày để phát triển ý; không câu hỏi nào bị bỏ." },
          { q: "5. “Discuss this view and give your opinion.” khác “Discuss both views…” ở chỗ:", options: ["A  không cần nêu ý kiến", "B  chỉ có MỘT quan điểm cần xét kỹ: phần đúng và giới hạn của nó", "C  phải viết ba thân bài"], correct: 1, why: "this view số ít → đánh giá một quan điểm; không bắt buộc dựng một phe đối lập ngang hàng." },
          { q: "6. Lập trường nào là lập trường có điều kiện kiểu band 8?", options: ["A  I totally agree with this statement.", "B  There are both advantages and disadvantages.", "C  It is a concern only in so far as watching replaces playing."], correct: 2, why: "only in so far as nêu rõ phạm vi mà lập trường đúng. B không phải lập trường." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Viết bài — AI chấm 4 tiêu chí (40 phút mỗi bài)" },
      {
        t: "note",
        title: "💡 Cách làm: đếm trước, viết sau",
        items: [
          "2 phút đầu: gạch lệnh, khoanh chữ gài, đánh số nhiệm vụ NGAY TRÊN ĐỀ. Viết thesis hai vế ra nháp trước khi viết mở bài.",
          "Dùng 4–6 từ của Bài 1 đúng chỗ (không ép): ở đề 1 có thể là continuity, collective memory, romanticise, narrative.",
          "Soát lượt 1: mỗi dấu ? có một đoạn chưa? Lượt 2: liều cấu trúc theo Ngày 13 (≤ 4 cấu trúc nổi).",
        ],
      },
      {
        t: "essay",
        id: "t5d14-viet-bai",
        task: "Task 2",
        prompt: "In many countries, growing numbers of people are researching their family history and visiting places connected with their ancestors. Why is this the case? Is this a worthwhile use of people's time and money? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Hai nhiệm vụ: ① Why ② worthwhile hay không (lập trường — có thể có điều kiện).",
          "Thesis hai vế: I would argue that… , and that… (only in so far as…).",
          "TB1: 1–2 nguyên nhân có cơ chế (hồ sơ số hoá, xét nghiệm gen rẻ, cảm giác mất gốc ở đô thị…).",
          "TB2: đáng với ai, ở mức nào; thừa nhận phía ngược lại bằng MỘT nhượng bộ.",
          "280–310 từ là vừa; kết bài 2 câu, trả lời lại cả hai câu hỏi.",
        ],
      },
      {
        t: "essay",
        id: "t5d14-viet-bai-2",
        task: "Task 2",
        prompt: "(Luyện thêm — đề có chữ tuyệt đối) Some people believe that the best way to help people make better decisions about their health and money is simply to give them more information. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Chữ gài: the best way · simply. Nhiệm vụ: ① thông tin giúp đến đâu ② có phải cách TỐT NHẤT, và có ĐỦ không.",
          "Dùng từ của Bài 1 mục 3 để nêu cơ chế: confirmation bias, loss aversion, instant gratification, wishful thinking.",
          "TB2 phải so với ít nhất một cách khác (đổi mặc định, thuế, thiết kế môi trường).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d14-noi",
    kind: "speaking",
    title: "Nói Part 2 band 8 — đề hiếm: giải mã thẻ trong 1 phút, mượn chuyện từ kho, kể bốn chặng có “nhìn lại” (thẻ chính: a time when you were given incorrect information); nhấn tương phản",
    goal: "Gặp một thẻ Part 2 chưa từng luyện (tình huống hẹp, trạng thái, khái niệm trừu tượng) vẫn nói trọn 2 phút không hụt ý: trong 1 phút chuẩn bị xác định được chữ “hẹp” của thẻ, chọn một chuyện có sẵn rồi xoay góc cho khớp, ghi bốn chặng (cảnh → chỗ rẽ → phản ứng bên trong → nhìn lại); chặng cuối có suy ngẫm thật bằng ngôn ngữ band 8; nhấn tương phản đúng từ khi sửa một thông tin sai.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **FC + LR Speaking 7 → 8** ở Part 2. Band 8: ==speaks fluently with only occasional repetition or self-correction; develops topics coherently and appropriately==. Đề hiếm là chỗ band 7 lộ ra: hết ý ở giây 70.",
          "Đề hiếm không đòi chuyện hiếm. Nó đòi bạn ==khớp một chuyện quen với một góc lạ==. Kho 5 chuyện của Tập 4 Ngày 30 vẫn dùng; hôm nay học cách xoay.",
          "1 phút chuẩn bị: 15 giây giải mã thẻ → 15 giây chọn chuyện → 30 giây ghi bốn chặng, mỗi chặng một từ đắt.",
          "Khung bốn chặng: **cảnh → chỗ rẽ → phản ứng bên trong → nhìn lại**. Band 7 dừng ở chặng 2 rồi kể lể; band 8 dành 30–40 giây cho chặng 3–4.",
          "Chặng “nhìn lại” dùng từ của Bài 1: with hindsight, what I hadn't realised was…, I'd seen what I wanted to see (confirmation bias nói bằng lời thường).",
          "Bảng lộ trình gợi ý thẻ “a time you changed your mind”; thẻ đó đã dùng ở Tập 4 Ngày 30 (và thẻ gần nó, “persuaded someone to look at a decision differently”, là Part 2 của Đề 9), nên hôm nay luyện ba thẻ hiếm khác. 🔊 Nhấn tương phản khi sửa thông tin.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Đề hiếm là gì — bốn kiểu, và chữ “hẹp” nằm ở đâu" },
      {
        t: "table",
        head: ["Kiểu", "Ví dụ thẻ", "Chữ hẹp", "Bẫy"],
        rows: [
          ["**Tình huống hẹp**", "a time when you were given incorrect information", "incorrect information — phải có MỘT thông tin sai, và hệ quả của nó", "kể chung chung một ngày xui"],
          ["**Trạng thái / cảm xúc**", "a time when you felt out of place · an occasion when you had to stay silent", "trạng thái đó — phải TẢ được nó từ bên trong", "kể sự kiện mà quên cảm giác"],
          ["**Khái niệm trừu tượng**", "a period of history you would like to know more about · an ambition you have not yet achieved", "would like to know · not yet — điều CHƯA có", "kể kiến thức như bài sử; phải nói về mình"],
          ["**Phủ định / thất bại**", "a plan you made but never carried out · something you decided not to do", "but never · not to do", "sửa đề thành chuyện thành công"],
        ],
        caption: "Chữ hẹp là chữ phân biệt thẻ này với thẻ quen gần nó nhất",
      },
      {
        t: "note",
        title: "📌 Ba điều cần nhớ về đề hiếm",
        items: [
          "Giám khảo không kiểm sự thật. Chuyện có thể mượn, ghép, thêm chi tiết — miễn kể mạch lạc và đúng thẻ.",
          "Lạc thẻ không bị trừ điểm “nội dung” (Speaking không có tiêu chí Task Response), nhưng lạc thẻ làm bạn hụt ý, ngập ngừng, và câu hỏi nối của giám khảo sẽ không khớp — FC rơi.",
          "Thẻ có bốn gạch đầu dòng là GỢI Ý. Gạch cuối (and explain…) luôn là chỗ lấy điểm: dành ít nhất 30 giây.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Một phút chuẩn bị — giải mã, mượn chuyện, ghi bốn chặng" },
      {
        t: "sodo",
        kind: "flow",
        title: "60 giây",
        steps: [
          { label: "① 0–15 giây: giải mã", sub: "Gạch chữ hẹp. Tự hỏi: thẻ quen nào gần nhất? Khác ở đâu?" },
          { label: "② 15–30 giây: chọn chuyện", sub: "Lướt kho 5 chuyện (Tập 4 Ngày 30). Chuyện nào CÓ SẴN yếu tố của chữ hẹp? Không có → ghép thêm một chi tiết." },
          { label: "③ 30–55 giây: ghi bốn chặng", sub: "mỗi chặng 2–3 từ khoá + MỘT từ đắt: cảnh · chỗ rẽ · bên trong · nhìn lại." },
          { label: "④ 55–60 giây: câu mở", sub: "Nhẩm câu đầu tiên. Không mở bằng “I'd like to talk about…” nếu nghĩ ra câu vào thẳng chuyện." },
        ],
      },
      {
        t: "table",
        head: ["Thẻ hiếm", "Chuyện quen trong kho", "Xoay thế nào"],
        rows: [
          ["given incorrect information", "lần đi phỏng vấn thực tập / lần lạc đường", "đưa thông tin sai lên làm chỗ rẽ; thêm chặng “tôi cũng có phần”"],
          ["felt out of place", "ngày đầu ở câu lạc bộ / ngày đầu đi làm thêm", "chậm lại ở cảm giác: ai nhìn, mình đứng đâu, tay để đâu"],
          ["a period of history you'd like to know more about", "chuyện ông bà kể / một chuyến thăm bảo tàng", "mở bằng lúc mình nhận ra mình KHÔNG biết; nói mình sẽ tìm hiểu bằng cách nào"],
          ["a plan you never carried out", "lần học gấp một kỹ năng (thức khuya, trì hoãn)", "kể ba lần định bắt đầu, lần nào cũng hoãn; kết bằng điều mình hiểu về bản thân"],
          ["decided not to do something", "một lời mời / một cơ hội đã từ chối", "chỗ rẽ là quyết định KHÔNG; nhìn lại: có tiếc không"],
        ],
        caption: "Mượn chuyện — xoay cho chữ hẹp thành trung tâm",
      },
      { t: "rule", formula: "chuyện quen + chữ hẹp của thẻ làm “chỗ rẽ” + 30 giây nhìn lại  =  câu trả lời cho thẻ hiếm", vi: "Không cần chuyện mới; cần đặt đúng thứ thẻ hỏi vào giữa chuyện." },

      /* ── 3 ── */
      { t: "h", text: "3. Khung bốn chặng band 8 — và ngôn ngữ của chặng “nhìn lại”" },
      {
        t: "table",
        head: ["Chặng", "Thời lượng", "Việc", "Ngôn ngữ"],
        rows: [
          ["① Cảnh", "20–25 giây", "khi nào, ở đâu, đang làm gì — MỘT chi tiết nhìn thấy được", "I'd just… · I was sitting… · quá khứ tiếp diễn + quá khứ hoàn thành"],
          ["② Chỗ rẽ", "30–35 giây", "việc xảy ra — chữ hẹp của thẻ nằm ở đây", "Then, at about… · It turned out that… · sure enough"],
          ["③ Phản ứng bên trong", "20–25 giây", "nghĩ gì, cảm gì NGAY lúc đó — cả phản ứng chưa đẹp", "My stomach dropped. · I was convinced that… · To begin with, I was furious."],
          ["④ Nhìn lại", "30–40 giây", "bây giờ hiểu khác gì; mình có phần nào; đổi thói quen gì", "Looking back, … · What I hadn't done was… · So these days I…"],
        ],
        caption: "Tổng 1 phút 45 – 2 phút. Band 7 thường dồn 80 % vào chặng ① ②.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "Looking back, / With hindsight, S V", vi: "Mở chặng nhìn lại.", examples: [{ en: "Looking back, I'm not sure the email was the whole story.", vi: "Nhìn lại, tôi không chắc bức thư là toàn bộ câu chuyện." }] },
          { formula: "What I hadn't done / realised was (that) S V", vi: "Câu chẻ + quá khứ hoàn thành: phần lỗi của mình.", examples: [{ en: "What I hadn't done was read past the first line.", vi: "Điều tôi đã không làm là đọc quá dòng đầu tiên." }] },
          { formula: "I'd seen / heard what I wanted to see / hear", vi: "Confirmation bias nói bằng lời thường.", examples: [{ en: "I'd seen the word “online”, which was what I wanted to see, and stopped.", vi: "Tôi thấy chữ “online”, đúng thứ tôi muốn thấy, rồi dừng lại." }] },
          { formula: "Had I + V3, I would (probably) have + V3", vi: "Điều kiện loại 3 đảo ngữ — MỘT lần, ở chặng ④.", examples: [{ en: "Had I checked the address, I would probably have noticed.", vi: "Nếu tôi đã kiểm địa chỉ thì có lẽ tôi đã nhận ra." }] },
          { formula: "It feels / felt a bit …, but …", vi: "Câu kết nhẹ, có chút tự giễu.", examples: [{ en: "It feels a bit fussy, but it's cheaper than a motorbike taxi.", vi: "Nghe hơi kỹ tính, nhưng rẻ hơn một cuốc xe ôm." }] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở chặng “nhìn lại”",
        items: [
          "Kết bằng bài học đạo đức chung: ~~So I think we should always be careful.~~ Band 8 nói điều RIÊNG: mình đã sai ở đâu, đổi việc gì cụ thể.",
          "Dùng thì hiện tại cho việc trước chỗ rẽ: ~~I don't read the email carefully~~ → I **hadn't read** the email carefully.",
          "Nói feel thay vì tả: ~~I felt very surprised and very angry.~~ → My stomach dropped. / I was furious, to begin with.",
          "Lặp lại nguyên văn thẻ ở câu cuối: ~~So that was the time when I was given incorrect information.~~ Bỏ; kết bằng câu của mình.",
        ],
      },
      {
        t: "quiz",
        id: "t5d14-noi-nhin-lai-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu của chặng “nhìn lại” (4 câu)",
        grammar: "Looking back, … · What I hadn't realised was that… · Had I + V3, I would have + V3 · So these days I…",
        items: [
          { q: "Nhìn lại, tôi nghĩ một phần là lỗi của tôi.", answers: ["Looking back, I think it was partly my fault.", "Looking back, I think it was partly my own fault.", "With hindsight, I think it was partly my fault.", "Looking back, I think part of it was my fault."], hint: "Looking back · partly my fault" },
          { q: "Điều tôi đã không nhận ra là lịch đã thay đổi.", answers: ["What I hadn't realised was that the schedule had changed.", "What I hadn't realised was that the timetable had changed.", "What I hadn't realized was that the schedule had changed.", "What I had not realised was that the schedule had changed."], hint: "What I hadn't realised was that · had changed" },
          { q: "Nếu tôi hỏi lại thì tôi đã không lỡ chuyến tàu. (Had I…)", answers: ["Had I asked again, I would not have missed the train.", "Had I asked again, I wouldn't have missed the train.", "Had I checked again, I would not have missed the train.", "Had I checked again, I wouldn't have missed the train."], hint: "Had I asked again · would not have missed" },
          { q: "Vì vậy dạo này tôi luôn xác nhận giờ và địa điểm từ tối hôm trước.", answers: ["So these days I always confirm the time and place the evening before.", "So these days I always confirm the time and the place the evening before.", "So these days I always confirm the time and place the night before.", "So nowadays I always confirm the time and place the evening before."], hint: "these days · confirm · the evening before" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Thẻ chính — cùng một chuyện, band 7 và band 8" },
      {
        t: "table",
        head: ["Thẻ đề (cue card)"],
        rows: [
          ["**Describe a time when you were given incorrect information.**"],
          ["You should say:"],
          ["• what the information was"],
          ["• who gave it to you"],
          ["• what happened as a result"],
          ["and explain how you felt about the experience."],
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ghi chú 1 phút — bốn chặng, mỗi chặng một từ đắt",
        center: "wrong email — **interview**",
        branches: [
          { label: "① Cảnh", items: ["internship, final round", "at home, 1 pm", "==pyjama bottoms=="] },
          { label: "② Chỗ rẽ", items: ["2nd email: “at reception”", "reused ==template==", "other side of river"] },
          { label: "③ Bên trong", items: ["==stomach dropped==", "furious — not my fault", "rehearsing through helmet"] },
          { label: "④ Nhìn lại", items: ["didn't read past line 1", "saw what I ==wanted to see==", "now: confirm evening before"] },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 7 (ước tính) — khoảng 1 phút 35 giây, 213 từ",
        lines: [
          { who: "Candidate", role: "a", text: "I'd like to talk about a time when I got wrong information about a job interview. Last year I applied for an internship at a software company called Lumen. A person from the HR department sent me an email, and she said the interview would be online at two p.m. So I stayed at home and prepared my laptop.", vi: "Tôi muốn nói về một lần tôi nhận thông tin sai về buổi phỏng vấn… Tôi ở nhà chuẩn bị máy tính." },
          { who: "Candidate", role: "a", text: "But about forty minutes before the interview, I received another email. It said “See you at our reception desk”. I was very surprised, and I read the first email again. Actually the first email was wrong, because they used an old template. The interview was at their office, and the office was very far from my house. I called a motorbike taxi immediately and I went there very fast. I arrived fifteen minutes late and I was sweating a lot. The interviewer said sorry to me because it was their mistake.", vi: "Nhưng khoảng bốn mươi phút trước giờ phỏng vấn tôi nhận thư khác… Tôi đến muộn mười lăm phút." },
          { who: "Candidate", role: "a", text: "The interview was OK, but I didn't get the job. I felt angry at first because it was not my fault. But later I thought I should check information more carefully. Now I always confirm the time and place before an important meeting. So that was the time when I was given incorrect information.", vi: "Buổi phỏng vấn tạm ổn nhưng tôi không được nhận… Đó là lần tôi nhận thông tin sai." },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 8 (ước tính) — khoảng 2 phút, 300 từ",
        lines: [
          { who: "Candidate", role: "candidate", text: "The one that comes to mind happened about a year ago, when I was applying for internships. I'd got through to the final interview at a small software firm called Lumen, and the email from their recruiter, a woman called Thảo, said quite plainly that it would be held online at two o'clock. So at one, I was sitting at home in a shirt and my pyjama bottoms, testing my microphone.", vi: "Chuyện tôi nghĩ tới ngay xảy ra khoảng một năm trước, lúc tôi đang xin thực tập. Tôi vào tới vòng cuối ở một công ty phần mềm nhỏ tên Lumen, và thư của chị Thảo bên tuyển dụng ghi rõ là phỏng vấn online lúc hai giờ. Nên lúc một giờ, tôi ngồi nhà, áo sơ mi quần ngủ, thử micro." },
          { who: "Candidate", role: "candidate", text: "Then, at about twenty past one, a second email arrived, just one line: “Looking forward to seeing you at reception.” My stomach dropped. I scrolled back, and sure enough, the first message did say online. It turned out she'd reused a template from the previous round. And the office wasn't round the corner, either. It was on the other side of the river, a good forty minutes away.", vi: "Rồi khoảng một giờ hai mươi, thư thứ hai tới, đúng một dòng: “Mong gặp bạn ở quầy lễ tân.” Tim tôi thắt lại. Tôi kéo lên xem, đúng là thư đầu ghi online — hoá ra chị ấy dùng lại mẫu thư của vòng trước. Mà văn phòng cũng chẳng gần: bên kia sông, phải bốn mươi phút." },
          { who: "Candidate", role: "candidate", text: "I've never got dressed so fast. I booked a motorbike taxi, and I remember rehearsing my answers out loud through the helmet while the driver wove through the lunchtime traffic. I walked in a quarter of an hour late, soaked. To be fair, the interviewer apologised before I could. She knew exactly whose mistake it was.", vi: "Tôi chưa bao giờ thay đồ nhanh thế. Tôi đặt xe ôm, và còn nhớ mình lẩm nhẩm câu trả lời qua mũ bảo hiểm trong khi tài xế luồn lách giữa dòng xe giờ trưa. Tôi bước vào muộn mười lăm phút, ướt đẫm. Công bằng mà nói, người phỏng vấn xin lỗi trước cả tôi." },
          { who: "Candidate", role: "candidate", text: "How did I feel? Furious, to begin with. It wasn't my fault, and I was convinced it had cost me the job, which in the end I didn't get. Looking back, though, I'm not sure the email was the whole story. What I hadn't done was read past the first line. I'd seen the word “online”, which was what I wanted to see, and stopped. There'd been an office address in the signature the whole time. So these days, the evening before anything important, I send a two-line message confirming the time and the place. It feels a bit fussy, but it's cheaper than a motorbike taxi.", vi: "Tôi thấy thế nào ư? Ban đầu thì điên tiết: không phải lỗi của tôi, và tôi tin chắc nó làm tôi mất việc — cuối cùng tôi không được nhận thật. Nhưng nhìn lại, tôi không chắc bức thư là toàn bộ câu chuyện. Tôi đã không đọc quá dòng đầu. Tôi thấy chữ “online”, đúng thứ tôi muốn thấy, rồi dừng. Địa chỉ văn phòng nằm trong chữ ký suốt từ đầu. Nên giờ, tối hôm trước việc gì quan trọng, tôi gửi hai dòng xác nhận giờ và địa điểm. Hơi kỹ tính, nhưng rẻ hơn một cuốc xe ôm." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8", "Chỗ tạo khác biệt"],
        rows: [
          ["**FC**", "kể đủ, đúng thứ tự; hết ý sớm (1'35); kết bằng câu chép lại thẻ", "đủ 2 phút; bốn chặng rõ; câu hỏi tự đặt “How did I feel?” để chuyển chặng", "40 giây cuối dành cho phản ứng + nhìn lại"],
          ["**LR**", "got wrong information · very surprised · very far · said sorry", "said quite plainly · my stomach dropped · sure enough · a good forty minutes · wove through · it had cost me the job", "collocation và cụm tự nhiên; không từ nào “to tát”"],
          ["**GRA**", "quá khứ đơn gần như toàn bài; câu ghép bằng and / but / because", "I'd got through · she'd reused · had cost me · What I hadn't done was… · There'd been…; câu ngắn xen câu dài", "quá khứ hoàn thành cho mọi việc xảy ra TRƯỚC chỗ rẽ"],
          ["**Phát âm**", "đều giọng", "nhấn tương phản: did SAY online · at RECEPTION · whose MISTAKE", "mục 7 bên dưới"],
        ],
        caption: "Cùng một chuyện, cùng các sự kiện — khác ở chặng ③ ④ và ở thì quá khứ hoàn thành",
      },
      {
        t: "note",
        title: "💡 Mẹo: ba thứ kéo dài bài nói mà không lan man",
        items: [
          "**Một chi tiết nhìn thấy được ở mỗi chặng:** pyjama bottoms · just one line · through the helmet · the signature. Chi tiết cụ thể mua thời gian và nghe thật.",
          "**Một câu hỏi tự đặt** để chuyển chặng: How did I feel? / Why didn't I check? — đúng kỹ thuật Ngày 2.",
          "**Một câu công bằng với người kia:** To be fair, she apologised before I could. Câu này cho thấy bạn kể có cân nhắc, không chỉ than.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Câu hỏi nối và Part 3 đi kèm — tin sai, tin ai" },
      { t: "p", text: "Hết 2 phút, giám khảo hỏi một câu nối ngắn (trả lời 1–2 câu), rồi sang Part 3 cùng chủ đề. Dùng năm bước của Ngày 13 (khoanh lại → nguyên tắc → giới hạn → ví dụ → chốt) và từ của Bài 1 mục 3." },
      {
        t: "dialogue",
        title: "Câu nối + một câu Part 3 mẫu (band 8, ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you usually check information that people give you?", vi: "Bạn có thường kiểm tra thông tin người khác đưa không?" },
          { who: "Candidate", role: "candidate", text: "More than I used to, yes, at least when something depends on it. For everyday things I still just take people's word for it.", vi: "Nhiều hơn trước, ít nhất là khi có việc phụ thuộc vào nó. Chuyện thường ngày thì tôi vẫn tin lời người ta." },
          { who: "Examiner", role: "examiner", text: "Why do you think people sometimes pass on information without checking it?", vi: "Theo bạn vì sao đôi khi người ta chuyển tiếp thông tin mà không kiểm tra?" },
          { who: "Candidate", role: "candidate", text: "I think it depends on the kind of information. If it's something practical, a time or an address, it's usually just haste. But with news and opinions I'd say it's closer to confirmation bias. If a story fits what we already believe, checking it feels unnecessary, almost disloyal. And sharing costs nothing, whereas checking takes effort. So the things that travel fastest aren't the things that are true. They're the things people wanted to be true.", vi: "Tôi nghĩ còn tuỳ loại thông tin. Chuyện thực tế như giờ giấc, địa chỉ thì thường chỉ do vội. Còn tin tức, quan điểm thì gần với thiên kiến xác nhận hơn: chuyện khớp với điều ta tin sẵn thì kiểm tra có vẻ thừa. Chia sẻ thì không tốn gì, kiểm tra thì tốn công. Nên thứ lan nhanh nhất không phải thứ đúng, mà là thứ người ta muốn nó đúng." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Hai thẻ hiếm nữa — dàn ý bốn chặng" },
      {
        t: "table",
        head: ["", "Thẻ A — khái niệm trừu tượng", "Thẻ B — việc không xảy ra"],
        rows: [
          ["Thẻ", "**Describe a period of history that you would like to know more about.** You should say: which period it is · how you first heard about it · what you already know about it · and explain why you would like to know more.", "**Describe a plan you made that you did not carry out.** You should say: what the plan was · when and why you made it · what stopped you · and explain how you feel about it now."],
          ["Chữ hẹp", "would like to know MORE — điều chưa biết", "did NOT carry out — việc không xảy ra"],
          ["① Cảnh", "bữa cơm, bà kể chuyện thời bao cấp: tem phiếu, xếp hàng từ bốn giờ sáng", "đầu năm hai: định mỗi sáng dậy 5 rưỡi học thuật toán một tiếng trước giờ lên lớp; mua cả sổ"],
          ["② Chỗ rẽ", "nhận ra sách giáo khoa chỉ có vài dòng; những gì mình biết đều là **testimony** của một người", "ba lần bắt đầu: được bốn ngày · được hai ngày · chuông reo rồi tắt; 1 giờ sáng vẫn lướt điện thoại"],
          ["③ Bên trong", "tò mò + hơi ngượng vì không biết gì về thời bố mẹ mình lớn lên", "bực với chính mình; tự **rationalise**: “mình vốn là người của ban đêm”"],
          ["④ Nhìn lại", "muốn đọc **contemporary accounts**, xem ảnh; sợ mình đang **romanticise** qua lời bà; sẽ hỏi thêm ông trước khi quá muộn", "hiểu ra kế hoạch đó là **wishful thinking**: nó đòi **self-control** lúc mình yếu nhất; giờ học 20 phút sau bữa tối — nhỏ hơn nhưng có thật"],
          ["Từ của Bài 1", "testimony · contemporary accounts · romanticise · collective memory · upheaval", "procrastination · self-control · instant gratification · rationalise · wishful thinking"],
        ],
        caption: "Hai dàn ý mẫu — thay bằng chuyện của bạn, giữ bốn chặng",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với thẻ lịch sử và thẻ kế hoạch dang dở",
        items: [
          "Thẻ A không phải bài thuyết trình sử. Tối đa 20 giây cho “what you already know”; phần còn lại là về BẠN và điều bạn muốn biết.",
          "Không chắc năm tháng thì nói mờ: sometime in the eighties, before my parents were married. Nói sai một con số không mất điểm, nhưng ngập ngừng để nhớ số thì mất.",
          "Thẻ B: đừng cứu câu chuyện bằng kết có hậu giả. “I still haven't managed it” nghe thật hơn “and in the end I did it perfectly”.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phát âm: nhấn tương phản — khi sửa một thông tin sai" },
      {
        t: "p",
        text: "Kể chuyện “thông tin sai” là liên tục đặt hai thứ cạnh nhau: điều được báo và điều có thật. Tiếng Anh đánh dấu việc đó bằng ==trọng âm tương phản==: từ MANG THÔNG TIN MỚI HOẶC ĐƯỢC SỬA nhận trọng âm chính, cao và dài hơn, dù bình thường nó không được nhấn (giới từ, trợ động từ, đại từ đều có thể được nhấn). Người Việt hay nhấn đều mọi từ nội dung, nên người nghe không biết cái gì vừa được sửa.",
      },
      {
        t: "table",
        head: ["Kiểu", "Ví dụ (CHỮ HOA = nhấn)", "Ghi chú"],
        rows: [
          ["Sửa một chi tiết", "Not Gate fourTEEN. Gate FORty.", "số -teen / -ty: nhấn đúng âm tiết khác nhau"],
          ["Sửa địa điểm / cách thức", "It wasn't onLINE. It was at their OFfice.", "hai từ đối nhau cùng được nhấn"],
          ["Nhấn trợ động từ để xác nhận", "The first message DID say online.", "did / do / was được nhấn = “đúng là như vậy”"],
          ["Sửa người", "I wasn't angry with HER. I was angry with mySELF.", "đại từ bình thường yếu, ở đây mạnh"],
          ["Sửa cách hiểu", "It wasn't WHAT he said. It was HOW he said it.", "từ để hỏi mang tương phản"],
          ["Phủ nhận ngắn", "I thought it was free. It WASn't.", "câu hai từ, nhấn trợ động từ phủ định"],
        ],
      },
      { t: "rule", formula: "Not X. Y.   ·   It wasn't X. It was Y.   →   nhấn X và Y; mọi từ khác nói nhẹ, nhanh", vi: "Chỉ hai từ đối nhau được nhấn; nhấn thêm từ thứ ba là mất tương phản." },
      {
        t: "phatam",
        id: "t5d14-phat-am",
        title: "Luyện phát âm — nhấn tương phản: chỉ hai từ đối nhau được nhấn",
        note: "Đọc mỗi câu hai lần. Lần hai, thu âm và tự nghe: hai từ đối nhau có cao và dài hơn hẳn phần còn lại không? Máy chấm từng âm; phần nhấn bạn tự so với bảng trên.",
        items: [
          { text: "It wasn't online. It was at their office.", ipa: "ɪt wɒznt ɒnlaɪn ɪt wɒz æt ðeər ɒfɪs", vi: "Không phải online. Mà là ở văn phòng của họ. (nhấn onLINE · OFfice)" },
          { text: "Not Gate fourteen. Gate forty.", ipa: "nɒt ɡeɪt fɔːtiːn ɡeɪt fɔːti", vi: "Không phải cổng mười bốn. Cổng bốn mươi. (fourTEEN · FORty)" },
          { text: "She said Tuesday, not Thursday.", ipa: "ʃiː sed tjuːzdeɪ nɒt θɜːzdeɪ", vi: "Cô ấy nói thứ Ba, không phải thứ Năm." },
          { text: "I wasn't angry with her. I was angry with myself.", ipa: "aɪ wɒznt æŋɡri wɪð hɜː aɪ wɒz æŋɡri wɪð maɪself", vi: "Tôi không giận cô ấy. Tôi giận chính mình. (HER · mySELF)" },
          { text: "The email said two, but the meeting was at ten.", ipa: "ði iːmeɪl sed tuː bʌt ðə miːtɪŋ wɒz æt ten", vi: "Thư ghi hai giờ, nhưng cuộc họp lúc mười giờ. (TWO · TEN)" },
          { text: "It wasn't what he said. It was how he said it.", ipa: "ɪt wɒznt wɒt hiː sed ɪt wɒz haʊ hiː sed ɪt", vi: "Không phải điều anh ấy nói. Mà là cách anh ấy nói. (WHAT · HOW)" },
          { text: "I thought it was free. It wasn't.", ipa: "aɪ θɔːt ɪt wɒz friː ɪt wɒznt", vi: "Tôi tưởng miễn phí. Không phải vậy. (nhấn WASn't)" },
          { text: "They told me the left door. It was the right one.", ipa: "ðeɪ təʊld miː ðə left dɔː ɪt wɒz ðə raɪt wʌn", vi: "Họ bảo tôi cửa bên trái. Hoá ra là cửa bên phải. (LEFT · RIGHT)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d14-noi-nhan",
        title: "Nhấn tương phản — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. “The first message did say online.” — nhấn từ nào để có nghĩa “đúng là nó ghi thế thật”?", options: ["A  first", "B  did", "C  message"], correct: 1, why: "Nhấn trợ động từ did = xác nhận điều đang bị nghi ngờ." },
          { q: "2. A: “So the interview was on Thursday?” B sửa lại. Câu nào nhấn đúng?", options: ["A  No, it was on TUESday.", "B  No, IT was on Tuesday.", "C  No, it WAS on Tuesday."], correct: 0, why: "Thông tin được sửa là ngày → nhấn TUESday." },
          { q: "3. “I didn't say he STOLE the money.” (nhấn stole) ngụ ý:", options: ["A  Người khác nói câu đó.", "B  Anh ta làm việc khác với số tiền (mượn, làm mất…).", "C  Anh ta lấy thứ khác."], correct: 1, why: "Từ được nhấn là từ bị phủ nhận / đối chiếu: không phải “trộm”, mà là hành động khác." },
          { q: "4. Trong “Not fourTEEN. FORty.”, vì sao nhấn âm tiết khác nhau?", options: ["A  Vì đó là quy tắc trọng âm từ + tương phản rơi đúng phần khác nhau của hai số.", "B  Vì số nào cũng nhấn âm cuối.", "C  Vì giám khảo yêu cầu."], correct: 0, why: "-teen mang trọng âm khi đối chiếu; -ty không. Nhấn đúng phần khác nhau giúp người nghe phân biệt 14 / 40." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Kiểm tra — Part 2 đề hiếm (6 câu)" },
      {
        t: "mcq",
        id: "t5d14-noi-chon",
        title: "Chọn phương án đúng",
        items: [
          { q: "1. Việc đầu tiên trong 1 phút chuẩn bị với thẻ lạ?", options: ["A  Viết trọn câu mở bài.", "B  Tìm chữ hẹp của thẻ và thẻ quen gần nó nhất.", "C  Nghĩ một chuyện hoàn toàn mới."], correct: 1, why: "Giải mã trước; chuyện thì mượn từ kho." },
          { q: "2. Thẻ “a plan you made that you did not carry out”. Câu kết nào hợp nhất?", options: ["A  And in the end I carried it out perfectly.", "B  So I think everyone should make good plans.", "C  I never did get up at half past five, but at least I know now what kind of plan I can keep."], correct: 2, why: "Giữ đúng chữ hẹp (không thực hiện) + một nhận ra riêng. A sửa đề; B là bài học chung." },
          { q: "3. Chặng nào band 7 hay bỏ?", options: ["A  Cảnh", "B  Chỗ rẽ", "C  Phản ứng bên trong + nhìn lại"], correct: 2, why: "Band 7 kể sự kiện; band 8 dành 30–40 giây cho bên trong và nhìn lại." },
          { q: "4. Câu nào dùng thì đúng cho việc xảy ra TRƯỚC chỗ rẽ?", options: ["A  She reused a template, so the email is wrong.", "B  It turned out she'd reused a template from the previous round.", "C  It turns out she reuses a template."], correct: 1, why: "Việc dùng lại mẫu xảy ra trước lúc mình phát hiện → quá khứ hoàn thành." },
          { q: "5. “To be fair, the interviewer apologised before I could.” Câu này làm gì cho bài nói?", options: ["A  Cho thấy người nói kể có cân nhắc, công bằng với người kia.", "B  Kéo dài thời gian vô ích.", "C  Trả lời gạch đầu dòng thứ nhất của thẻ."], correct: 0, why: "Một câu công bằng làm chuyện đáng tin và tạo chỗ chuyển sang nhìn lại." },
          { q: "6. Thẻ “a period of history you would like to know more about”: phần nào nên dài nhất?", options: ["A  what you already know — kể càng nhiều sự kiện càng tốt", "B  why you would like to know more — về bạn và điều bạn chưa biết", "C  how you first heard about it"], correct: 1, why: "Chữ hẹp là would like to know more; gạch “and explain” luôn là chỗ lấy điểm." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện: 1 phút ghi chú thật, 2 phút nói thật",
        items: [
          "Bấm giờ 60 giây, ghi bốn chặng lên giấy (không viết câu). Nói 2 phút, không dừng ghi âm kể cả khi bí — dùng kỹ thuật Ngày 2.",
          "Nghe lại: chặng ③ ④ có đủ 30 giây không? Có ít nhất ba động từ quá khứ hoàn thành không? Hai từ đối nhau có được nhấn không?",
          "Nói lại lần hai với cùng thẻ sau khi sửa. Lần ba: đổi sang thẻ A hoặc B với cùng khung.",
        ],
      },
      { t: "speak", id: "t5d14-noi-p2", part: "2", questions: ["Describe a time when you were given incorrect information. You should say: what the information was; who gave it to you; what happened as a result; and explain how you felt about the experience."] },
      {
        t: "speak",
        id: "t5d14-noi-p2-them",
        part: "2",
        questions: [
          "Describe a period of history that you would like to know more about. You should say: which period it is; how you first heard about it; what you already know about it; and explain why you would like to know more.",
          "Describe a plan you made that you did not carry out. You should say: what the plan was; when and why you made it; what stopped you; and explain how you feel about it now.",
        ],
      },
      {
        t: "speak",
        id: "t5d14-noi-p3",
        part: "3",
        questions: [
          "Why do you think people sometimes pass on information without checking it?",
          "Is it harder to know what is true today than it was in the past?",
          "When wrong information causes harm, who is more responsible: the person who shared it or the platform that carried it?",
          "Do you think people trust official sources too easily, or not enough?",
        ],
      },
      {
        t: "note",
        title: "📌 Ghi vào sổ Speaking",
        items: [
          "Thêm vào kho chuyện một dòng cho mỗi thẻ hiếm vừa luyện: chuyện gốc + cách xoay + từ đắt của từng chặng.",
          "Chép ba câu “nhìn lại” bạn nói tốt nhất. Ngày 17 (Part 2 nơi chốn, sự kiện band 8) và Ngày 26 (sprint 12 thẻ) sẽ dùng lại đúng khung này.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 14 ═══════════════════════════ */
  {
    id: "t5d14-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 14 — Thể thao · Lịch sử · Tâm lý vòng 2 · cặp dễ nhầm · nhận dạng đề trộn · thesis hai vế · Part 2 đề hiếm · nhấn tương phản",
    goal: "Ôn trọn Ngày 14: dùng đúng 48 từ vòng 2 trong câu Task 2 và Part 3, không nhầm sáu cặp dễ lẫn, đếm đúng nhiệm vụ của sáu đề trộn và chọn khung, hoàn chỉnh thesis hai vế, nhận ra bốn chặng và câu “nhìn lại” trong bài nói Part 2, nhấn đúng từ tương phản — 43 câu có đáp án, một mở bài + dàn ý AI chấm và một thẻ Part 2 ghi âm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay",
        items: [
          "Phần I–V ôn Bài 1 (28 câu): ba nhóm từ → cặp dễ nhầm → dịch.",
          "Phần VI–VII ôn Bài 2 (10 câu): đếm nhiệm vụ, chọn khung, thesis hai vế.",
          "Phần VIII ôn Bài 3 (5 câu): bốn chặng, câu nhìn lại, nhấn tương phản.",
          "Phần IX: viết mở bài + dàn ý cho một đề trộn (AI chấm). Phần X: nói một thẻ hiếm 2 phút.",
          "Đạt: ≥ 35/43. Dưới 70 % ở phần nào thì mở lại mục ghi trong tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 14 trong một hình",
        center: "Từ để **lập luận** + đề **lạ**",
        branches: [
          { label: "Sport vòng 2", items: ["a level playing field", "white elephant", "elite ↔ mass participation"] },
          { label: "History vòng 2", items: ["hindsight · anachronism", "narrative · contested", "romanticise"] },
          { label: "Psychology vòng 2", items: ["confirmation bias", "loss aversion", "delayed gratification"] },
          { label: "Task 2 trộn dạng", items: ["đếm nhiệm vụ", "một nhiệm vụ = một thân bài", "thesis hai vế"] },
          { label: "Part 2 đề hiếm", items: ["chữ hẹp", "cảnh → rẽ → bên trong → nhìn lại", "nhấn tương phản"] },
        ],
      },

      { t: "h", text: "I. Sport vòng 2 — điền MỘT từ (6 câu) — ôn Bài 1 mục 1" },
      {
        t: "quiz",
        id: "t5d14-bt-the-thao",
        kind: "fill",
        title: "I. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. The federation imposed heavy s___ on the club for breaking the spending rules.", answers: ["sanctions"], hint: "impose sanctions on" },
          { q: "2. Critics say the c___ of the Games has pushed ticket prices beyond ordinary families.", answers: ["commercialisation", "commercialization"], hint: "thương mại hoá" },
          { q: "3. Funding e___ athletes wins medals; funding local clubs gets people moving.", answers: ["elite"], hint: "đỉnh cao" },
          { q: "4. Small sports find it hard to attract s___ because they are rarely on television.", answers: ["sponsorship"], hint: "attract sponsorship" },
          { q: "5. Three referees were arrested in a match-f___ inquiry.", answers: ["fixing"], hint: "match-fixing" },
          { q: "6. The h___ city spent more on security than on the stadiums themselves.", answers: ["host"], hint: "host city" },
        ],
      },

      { t: "h", text: "II. History vòng 2 — chọn phương án đúng (6 câu) — ôn Bài 1 mục 2" },
      {
        t: "mcq",
        id: "t5d14-bt-lich-su",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "1. Blaming nineteenth-century doctors for not using antibiotics is ___ .", options: ["A  an aftermath", "B  an anachronism", "C  a testimony"], correct: 1, why: "Lấy chuẩn / hiểu biết nay áp cho xưa = anachronism." },
          { q: "2. The official ___ presents the reform as a triumph; local records tell a different story.", options: ["A  narrative", "B  provenance", "C  upheaval"], correct: 0, why: "narrative = cách kể mang một cách hiểu." },
          { q: "3. The event still has a strong place in the nation's ___ memory.", options: ["A  contested", "B  partisan", "C  collective"], correct: 2, why: "collective memory = ký ức tập thể." },
          { q: "4. Historians now emphasise ___ : many old customs survived the change of regime.", options: ["A  continuity", "B  revisionism", "C  commemoration"], correct: 0, why: "continuity (tiếp nối) đối với break / rupture." },
          { q: "5. The decade was one of political ___ , with four governments in six years.", options: ["A  hindsight", "B  upheaval", "C  historiography"], correct: 1, why: "political upheaval = biến động chính trị." },
          { q: "6. The painting was withdrawn from sale because its ___ could not be established.", options: ["A  provenance", "B  aftermath", "C  narrative"], correct: 0, why: "establish the provenance of = xác lập lai lịch." },
        ],
      },

      { t: "h", text: "III. Psychology vòng 2 — điền MỘT từ (6 câu) — ôn Bài 1 mục 3" },
      {
        t: "quiz",
        id: "t5d14-bt-tam-ly",
        kind: "fill",
        title: "III. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. P___ is rarely cured by a better timetable; the task itself has to feel less threatening.", answers: ["Procrastination"], hint: "thói trì hoãn" },
          { q: "2. Young drivers suffer less from lack of skill than from o___ .", answers: ["overconfidence"], hint: "tự tin thái quá" },
          { q: "3. Wearing what everyone else wears is a mild form of c___ .", answers: ["conformity"], hint: "làm theo nhóm" },
          { q: "4. Lying awake going over the same mistake is known as r___ .", answers: ["rumination"], hint: "nghĩ đi nghĩ lại chuyện tiêu cực" },
          { q: "5. Some children seem to have a natural p___ towards shyness.", answers: ["predisposition"], hint: "khuynh hướng sẵn có" },
          { q: "6. “If it's popular, it must be good” is a mental shortcut, or h___ .", answers: ["heuristic"], hint: "lối tắt tư duy" },
        ],
      },

      { t: "h", text: "IV. Cặp dễ nhầm (5 câu) — ôn Bài 1 mục 4" },
      {
        t: "mcq",
        id: "t5d14-bt-de-nham",
        title: "IV. Chọn phương án đúng",
        items: [
          { q: "1. The archive holds thousands of ___ documents from the colonial period.", options: ["A  historic", "B  historical", "C  historian"], correct: 1, why: "Thuộc về quá khứ → historical documents." },
          { q: "2. The election of the country's first female president was a ___ event.", options: ["A  historic", "B  historical", "C  contemporary"], correct: 0, why: "Trọng đại → historic." },
          { q: "3. The orchestra is ___ : none of the players is paid, but the standard is high.", options: ["A  amateurish", "B  amateur", "C  elite"], correct: 1, why: "Không nhận lương, không chê → amateur." },
          { q: "4. “The committee sanctioned the use of video replays.” nghĩa là uỷ ban:", options: ["A  cấm dùng video", "B  phạt người dùng video", "C  chính thức cho phép dùng video"], correct: 2, why: "sanction + một việc làm = chính thức cho phép." },
          { q: "5. He did not reason his way to the decision; he made it first and ___ it afterwards.", options: ["A  rationalised", "B  romanticised", "C  commemorated"], correct: 0, why: "Quyết trước rồi tìm lý do sau = rationalise." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 1–3 · 5" },
      {
        t: "quiz",
        id: "t5d14-bt-dich",
        kind: "translate",
        title: "V. Dịch — dùng từ trong gợi ý",
        grammar: "Collocation của Bài 1: become a white elephant · in the aftermath of · delayed gratification · remain contested · follow the herd",
        items: [
          { q: "Nhiều sân vận động trở thành của nợ sau khi giải đấu kết thúc.", answers: ["Many stadiums become white elephants after the tournament ends.", "Many stadiums become white elephants once the tournament is over.", "Many stadiums turn into white elephants after the tournament ends.", "Many stadiums become white elephants after the tournament is over."], hint: "become white elephants · the tournament" },
          { q: "Sau chiến tranh, hàng nghìn gia đình phải xây lại nhà cửa.", answers: ["In the aftermath of the war, thousands of families had to rebuild their homes.", "In the aftermath of the war, thousands of families had to rebuild their houses."], hint: "In the aftermath of · rebuild" },
          { q: "Tiết kiệm đòi hỏi khả năng trì hoãn sự thoả mãn.", answers: ["Saving requires the ability to delay gratification.", "Saving demands the ability to delay gratification.", "Saving requires delayed gratification.", "Saving money requires the ability to delay gratification."], hint: "the ability to delay gratification" },
          { q: "Nguyên nhân của cuộc khủng hoảng vẫn còn tranh cãi.", answers: ["The causes of the crisis remain contested.", "The causes of the crisis are still contested.", "The cause of the crisis remains contested."], hint: "remain contested" },
          { q: "Hầu hết các nhà đầu tư chỉ làm theo đám đông.", answers: ["Most investors simply follow the herd.", "Most investors just follow the herd.", "Most investors only follow the herd."], hint: "follow the herd" },
        ],
      },

      { t: "h", text: "VI. Đếm nhiệm vụ — chọn khung (6 câu) — ôn Bài 2 mục 2–3" },
      {
        t: "mcq",
        id: "t5d14-bt-nhan-dang",
        title: "VI. Chọn phương án đúng",
        items: [
          { q: "1. “Professional athletes are paid far more than nurses or teachers. Why is this the case? Is it justified?” — khung?", options: ["A  TB1 nguyên nhân · TB2 lập trường về tính chính đáng", "B  TB1 vấn đề · TB2 giải pháp", "C  TB1 ưu điểm · TB2 nhược điểm"], correct: 0, why: "Kiểu A: Why + câu hỏi đánh giá. Không ai hỏi giải pháp." },
          { q: "2. “The most important reason to study history is to avoid repeating mistakes. Do you agree?” — chữ gài?", options: ["A  study", "B  the most important", "C  mistakes"], correct: 1, why: "Chữ so sánh nhất → phải xét ít nhất một lý do khác để học sử." },
          { q: "3. “Should school sport be about winning or about taking part?” — thuộc kiểu nào?", options: ["A  Discussion ngầm (A or B)", "B  Ba câu hỏi", "C  Nguyên nhân + giải pháp"], correct: 0, why: "A or B = hai quan điểm + lập trường." },
          { q: "4. “Many people make poor financial decisions. What are the causes? What can individuals and governments do?” — có mấy nhiệm vụ?", options: ["A  một", "B  hai", "C  ba: nguyên nhân · việc của cá nhân · việc của chính phủ"], correct: 2, why: "individuals AND governments là hai đối tượng: giải pháp phải có cả hai (nối Tập 3 Ngày 22)." },
          { q: "5. “Because history is written by the winners, it cannot be trusted. Discuss.” — bài band 8 nên:", options: ["A  đồng ý ngay với cả câu", "B  xét tiền đề (ai viết sử) rồi xét kết luận (có vì thế mà không tin được không)", "C  kể tên các cuộc chiến"], correct: 1, why: "Kiểu G: tiền đề + kết luận là hai nhiệm vụ." },
          { q: "6. “Hosting international sporting events brings more problems than benefits. To what extent do you agree?” — thân bài 2 nên:", options: ["A  nêu phía bạn cho là nhẹ hơn rồi nói vì sao nó không lật được cán cân", "B  liệt kê thêm ba vấn đề", "C  bỏ qua phía lợi ích"], correct: 0, why: "more… than là phép cân: phải có cả hai phía và nói phía nào nặng." },
        ],
      },

      { t: "h", text: "VII. Thesis hai vế — điền MỘT từ (4 câu) — ôn Bài 2 mục 7" },
      {
        t: "quiz",
        id: "t5d14-bt-thesis",
        kind: "fill",
        title: "VII. Điền MỘT từ",
        items: [
          { q: "1. I would argue that the decline is caused mainly by cost, ___ that it should worry anyone who cares about public health.", answers: ["and"], hint: "that…, and that… — hai vế song song" },
          { q: "2. Such spending is justified only to the ___ that local people continue to use the facilities.", answers: ["extent"], hint: "only to the extent that" },
          { q: "3. While it is true that the past cannot be changed, it does not ___ that studying it is pointless.", answers: ["follow"], hint: "it does not follow that" },
          { q: "4. Although tougher penalties would help, I ___ that they are the only solution.", answers: ["disagree"], hint: "I disagree that + chữ tuyệt đối" },
        ],
      },

      { t: "h", text: "VIII. Part 2 đề hiếm và nhấn tương phản (5 câu) — ôn Bài 3 mục 1–3 · 7" },
      {
        t: "mcq",
        id: "t5d14-bt-noi",
        title: "VIII. Chọn phương án đúng",
        items: [
          { q: "1. Thẻ: “Describe an occasion when you had to stay silent.” Chữ hẹp là:", options: ["A  an occasion", "B  had to stay silent", "C  describe"], correct: 1, why: "Trạng thái phải im lặng — bài phải tả được cảm giác muốn nói mà không được nói." },
          { q: "2. Câu nào thuộc chặng ④ “nhìn lại”?", options: ["A  I was sitting at home testing my microphone.", "B  Then a second email arrived.", "C  What I hadn't done was read past the first line."], correct: 2, why: "Câu chẻ + quá khứ hoàn thành, nói phần lỗi của mình khi nhìn lại." },
          { q: "3. Thứ tự bốn chặng?", options: ["A  nhìn lại → cảnh → chỗ rẽ → bên trong", "B  cảnh → chỗ rẽ → phản ứng bên trong → nhìn lại", "C  chỗ rẽ → cảnh → nhìn lại → bên trong"], correct: 1, why: "Khung của Bài 3 mục 3." },
          { q: "4. “She said the THIRD floor, not the first.” Người nói đang:", options: ["A  sửa ai là người nói", "B  sửa thông tin về tầng", "C  hỏi lại"], correct: 1, why: "Từ được nhấn (THIRD) là thông tin được sửa." },
          { q: "5. Với thẻ lạ, nên lấy chuyện ở đâu?", options: ["A  Bịa một chuyện hoàn toàn mới trong 1 phút.", "B  Mượn một chuyện trong kho, đặt chữ hẹp của thẻ vào chỗ rẽ.", "C  Nói rằng mình chưa từng gặp tình huống đó."], correct: 1, why: "Chuyện quen + góc mới = an toàn và trôi chảy." },
        ],
      },

      { t: "h", text: "IX. Viết mở bài + dàn ý cho một đề trộn (90–130 từ) — AI chấm" },
      {
        t: "p",
        text: "Đề: **In many countries, schools are spending less time on history and more on science and technology. Why is this happening? Is it a change for the better?** Viết (1) một mở bài 2 câu có thesis hai vế, rồi (2) câu chủ đề của thân bài 1 và thân bài 2, mỗi câu kèm MỘT câu phát triển. Dùng ít nhất ba từ của Bài 1 (ví dụ narrative, hindsight, contested, continuity, collective memory).",
      },
      {
        t: "essay",
        id: "t5d14-bt-viet-mo-bai",
        task: "Task 2",
        prompt: "Topic: In many countries, schools are spending less time on history and more on science and technology. Why is this happening? Is it a change for the better? — Write (1) a two-sentence introduction with a two-part thesis that answers BOTH questions, then (2) the topic sentence of body paragraph 1 and of body paragraph 2, each followed by ONE supporting sentence. 90–130 words in total. Use at least three words from today's vocabulary lesson.",
        minWords: 90,
        tips: [
          "Thesis: I would argue that… (vì sao), and that… (tốt hơn hay không — có thể có điều kiện: only in so far as…).",
          "Câu chủ đề TB1 trả lời Why; câu chủ đề TB2 trả lời Is it a change for the better.",
          "Ghép hai câu chủ đề lại phải ra đúng thesis — đó là phép thử khung.",
        ],
      },
      {
        t: "note",
        title: "📌 Một bản mẫu để so SAU khi đã viết (band 8, ước tính) — 118 từ",
        items: [
          "**Mở bài:** In many school systems the hours given to history have shrunk as those devoted to science and technology have grown. I would argue that this shift is driven chiefly by anxiety about employment, and that it is a change for the better only in so far as history is trimmed rather than abandoned.",
          "**TB1:** The main cause is the belief, shared by parents and ministers alike, that technical subjects lead to jobs and history does not. Timetables follow that belief, since every extra hour of coding has to be taken from somewhere.",
          "**TB2:** Whether the change is welcome depends on what is lost. A pupil who has never weighed a partisan source against a contemporary account is poorly equipped to judge the contested claims that fill the news.",
        ],
      },

      { t: "h", text: "X. Nói một thẻ hiếm — 1 phút ghi chú, 2 phút nói — AI chấm — ôn Bài 3" },
      { t: "p", text: "Gạch chữ hẹp, mượn một chuyện trong kho, ghi bốn chặng. Chặng ④ phải có ít nhất một câu Looking back… hoặc What I hadn't realised was…" },
      {
        t: "speak",
        id: "t5d14-bt-noi-p2",
        part: "2",
        questions: [
          "Describe an occasion when you decided not to do something that other people expected you to do. You should say: what it was; who expected you to do it; why you decided not to; and explain how you feel about that decision now.",
        ],
      },
    ],
  },
];
