/**
 * IELTS Tập 5 — Ngày 29 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 * 🎫 NGÀY THI THẬT — “cách thi chuyên nghiệp” (docs/ielts-lo-trinh-0-8.md mục 3.5 hàng 29 · mã X06 X08 · R01–R16 · L03–L14).
 * Khuôn N mod 4 = 1 ⇒ grammar · reading · LISTENING · homework.
 *   Bài 1 (grammar)   Ngày thi từ A tới Z: đếm ngược 14 ngày · giấy tờ và đồ mang theo · thứ tự các phần thi giấy / thi máy ·
 *                     ba điểm ngôn ngữ của phòng thi (câu hỏi gián tiếp · câu mua giờ có rào đón · câu “kéo về đề” khi viết lạc)
 *                     — mỗi điểm có rule + bài dịch · xử lý khi lỡ câu / lạc đề ở cả 4 kỹ năng · tâm lý · kết quả, cách tính band
 *                     tổng · phúc khảo (Enquiry on Results) · One Skill Retake · 🔊 câu nói ở phòng thi.
 *                     QUY ĐỊNH CÔNG KHAI ghi theo hiểu biết chung tới 2026 (6 tuần cho phúc khảo · 60 ngày cho One Skill Retake ·
 *                     không nghỉ giữa Listening–Reading–Writing · 10 phút chép đáp án chỉ có ở thi giấy · TRF thường được nhận trong
 *                     2 năm). Chỗ hay đổi theo nước / theo năm (phí, số ngày trả kết quả, giấy tờ chấp nhận, quy định hoàn phí, OSR
 *                     có cho thi giấy không) đều ghi “kiểm tra trên trang của IDP / British Council”.
 *                     — nối Tập 1 Ngày 2 (bài thi gồm gì) · Tập 2 Ngày 19 · 24 · Tập 3 Ngày 29 · Tập 4 Ngày 28 mục 8 (sự cố giữa giờ)
 *                       · Tập 5 Ngày 1 (tự học bền) · 21 · 25 (2 phút kiểm).
 *   Bài 2 (reading)   Checklist 16 dạng Reading — bảng “mỗi dạng một câu” + bài đọc mới “Speaking in Whistles” (~1.100 từ, 8 đoạn
 *                     A–H, lập luận có quan điểm tác giả) với ĐÚNG 16 câu, mỗi câu một dạng R01–R16; bảng chẩn đoán sai dạng nào ⇒ ôn
 *                     Ngày nào. DỮ KIỆN soạn THEO TRÍ NHỚ, làm tròn / làm mờ: Silbo Gomero (La Gomera) vào chương trình bắt buộc ở
 *                     trường tiểu học năm 1999, vào danh sách di sản phi vật thể của UNESCO 2009; tiếng Thổ huýt sáo ở một làng gần Biển
 *                     Đen; nghiên cứu nghe hai tai cho thấy bán cầu não phải tham gia nhiều hơn với tiếng huýt; tranh luận “hai hay bốn
 *                     nguyên âm”; “khoảng bảy mươi cộng đồng” là con số của MỘT khảo sát. Không ghi tên nhà nghiên cứu, không ghi năm của
 *                     nghiên cứu não. Bài có ghi chú “không dùng làm tài liệu tra cứu”.
 *   Bài 3 (listening) Checklist 14 dạng Listening — bảng “mỗi dạng một câu” + 4 bài nghe MỚI tốc độ ~175 từ/phút, 15 câu phủ đủ 14
 *                     dạng: Part 1 đặt gian hàng ở hội chợ việc làm (Canada + Úc) · Part 2 ngày mở cửa trung tâm cứu hộ động vật hoang
 *                     dã, map + floor plan (New Zealand) · Part 3 ba người bàn đồ án trực quan hoá dữ liệu mở (Anh + Mỹ + Ireland) ·
 *                     Part 4 bài giảng bơm va thuỷ lực (hydraulic ram) — sơ đồ máy (Úc; dữ kiện làm mờ, “roughly a tenth” là quy tắc
 *                     ước lượng). Luật chép đáp án thi giấy / thi máy.
 *   Bài tập Ngày 29   40 câu có đáp án + 1 kịch bản ngày thi tự viết.
 * Đã grep tap-3…tap-5/ngay + thi-may/de: whistl (chỉ “tin whistle”, “whistle-blower”), Gomera, Kuşköy, hydraulic ram, Montgolfier,
 * careers fair, wildlife rescue, aviary, open data, data visualisation, phúc khảo, One Skill Retake, Enquiry on Results = 0 kết quả.
 * Ngày 27–28 có thể đang được soạn song song — chỉ nối theo tiêu đề bảng 3.5 (ôn tổng ngữ pháp 44 điểm; Reading 3 passage lần 3; Sprint
 * Part 3; 100 từ band 8 phần 2; Two-part; Listening 40 câu). Mọi tên người, công ty, địa điểm trong bài nghe là hư cấu.
 * Mọi id bắt đầu `t5d29-`.
 */
import type { Lesson } from '../data';

export const NGAY_29: Lesson[] = [
  /* ════════════════ BÀI 1 — NGÀY THI THẬT ════════════════ */
  {
    id: "t5d29-ngay-thi",
    kind: "grammar",
    title: "Ngày thi thật: giấy tờ, thứ tự các phần (thi máy và thi giấy), tâm lý, phúc khảo và One Skill Retake — ba mẫu câu cho phòng thi, cách xử lý khi lỡ câu hoặc lạc đề",
    goal: "Bước vào ngày thi IELTS thật như một người đã đi thi nhiều lần: chuẩn bị đúng giấy tờ, biết từng phút của buổi thi máy và thi giấy, nói được câu xin nhắc lại và câu mua giờ đúng ngữ pháp, cứu được một câu lỡ hay một bài viết lạc đề mà không đổ cả bài, và sau khi có điểm biết khi nào nên phúc khảo, khi nào nên One Skill Retake, khi nào nên thi lại cả bài.",
    minutes: 110,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · vì sao người band 8 vẫn mất điểm ở ngày thi",
        items: [
          "Ở band 7.5–8, ==điểm không còn mất vì thiếu kiến thức mà mất vì sự cố==: quên giấy tờ, vào phòng mệt, lỡ một câu Listening rồi lỡ thêm ba câu, phát hiện lạc đề ở phút 45, hoảng trong Part 2. Bài này luyện cho sự cố.",
          "Ba phần: ① **trước ngày thi** (đếm ngược 14 ngày, giấy tờ, thứ tự các phần) · ② **trong phòng thi** (ba mẫu câu, xử lý khi lỡ câu / lạc đề, tâm lý) · ③ **sau ngày thi** (kết quả, phúc khảo, One Skill Retake).",
          "Ba điểm ngôn ngữ, mỗi điểm có công thức và bài dịch: **câu hỏi gián tiếp** (Could you tell me where… is?), **câu mua giờ có rào đón** (That's not something I've given much thought to, but…), **câu kéo về đề** (What this means for… is that…).",
          "Quy định thi có thể đổi theo nước và theo năm. Bài ghi phần ổn định; chỗ nào hay đổi (phí, số ngày trả điểm, giấy tờ được nhận) có dòng ==kiểm tra trên trang của IDP / British Council== — luôn tin thư xác nhận của bạn hơn bài này.",
          "Nối: Tập 1 Ngày 2 (bài thi gồm gì) → Tập 2 Ngày 24 → Tập 4 Ngày 28 mục 8 (sự cố giữa giờ) → hôm nay (bản đầy đủ). Ngày mai, Đề 12 “Final” làm theo đúng thứ tự của một buổi thi thật.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Đếm ngược 14 ngày — việc gì làm lúc nào" },
      { t: "p", text: "Người thi band 8 không “ôn nước rút” vào hai ngày cuối. Hai tuần cuối là để **giữ phong độ và dọn rủi ro**: kiểm giấy tờ, làm quen đường tới điểm thi, ngủ đúng giờ của buổi thi. Học kiến thức mới trong 3 ngày cuối gần như không thêm điểm, nhưng lấy mất giấc ngủ." },
      {
        t: "table", caption: "Lịch đếm ngược — mốc D = ngày thi (D-7 = trước 7 ngày)",
        head: ["Mốc", "Việc phải xong", "Vì sao"],
        rows: [
          ["D-14", "Đọc lại thư xác nhận: loại bài (Academic, thi máy hay thi giấy, có phải IELTS for UKVI không), địa điểm, giờ có mặt, ngày giờ Speaking. Kiểm giấy tờ tuỳ thân còn hạn và **trùng số đã khai khi đăng ký**.", "Sai loại bài hoặc giấy tờ không khớp là lỗi không sửa được ở cửa phòng thi."],
          ["D-10 → D-4", "Mỗi ngày MỘT kỹ năng yếu nhất, đúng giờ của buổi thi (thường là buổi sáng). Một đề đủ 4 kỹ năng theo đúng thứ tự thi thật — Đề 12 ở Ngày 30 là lượt này.", "Não quen làm Reading lúc 9 giờ sáng sau 30 phút nghe, không phải lúc 11 giờ đêm."],
          ["D-3", "Dừng học điều mới. Chỉ đọc lại sổ lỗi, 30 cụm từ hay dùng nhất, phiếu tự soát Writing.", "Ôn cái đã biết thì tăng tự tin; học cái mới thì tăng lo."],
          ["D-2", "Đi thử tới điểm thi đúng giờ của ngày thi (hoặc tra kỹ tuyến đường, chỗ gửi xe). Chuẩn bị túi: giấy tờ, thư xác nhận, nước, áo khoác mỏng.", "Phòng thi thường lạnh; tắc đường 40 phút là đủ làm hỏng tâm trạng Listening."],
          ["D-1", "Nhẹ: một bài Listening Part 1 + một Part 2 Speaking cho “ấm máy”. Ngủ trước 23 giờ. Không thức để “làm nốt một đề”.", "Thiếu ngủ hại nhất ở Reading Passage 3 và Writing Task 2 — hai phần cuối của buổi sáng."],
          ["Sáng D", "Ăn sáng có tinh bột chậm (cơm, bánh mì, trứng), không uống quá nhiều nước. Đi sớm theo giờ ghi trong thư. Nghe 5 phút tiếng Anh trên đường để não “chuyển ngôn ngữ”.", "Từ lúc check-in tới lúc Writing xong có thể hơn 3 giờ, không có giờ nghỉ giữa ba phần."],
        ],
      },
      { t: "rule", formula: "D-14 kiểm giấy tờ · D-3 dừng học mới · D-1 ngủ trước 23 giờ · sáng D đi sớm, ăn đủ", vi: "Hai tuần cuối là để giữ phong độ và dọn rủi ro, không phải để nhồi." },

      /* ── 2 ── */
      { t: "h", text: "2. Giấy tờ và đồ mang theo — mang gì, gửi gì, không được mang gì" },
      {
        t: "table", caption: "Phần ổn định ở hầu hết điểm thi — chi tiết của điểm thi bạn: xem thư xác nhận và trang của IDP / British Council",
        head: ["Nhóm", "Thường gặp", "Ghi chú cho người thi ở Việt Nam"],
        rows: [
          ["**Giấy tờ tuỳ thân**", "BẢN GỐC, còn hạn, ĐÚNG giấy tờ bạn đã khai khi đăng ký.", "Thường là hộ chiếu hoặc căn cước công dân; một số loại bài (ví dụ IELTS for UKVI) có thể chỉ nhận hộ chiếu — kiểm tra trên trang của IDP / British Council. Đổi giấy tờ sau khi đăng ký: báo trung tâm TRƯỚC ngày thi."],
          ["**Check-in**", "Đối chiếu giấy tờ, chụp ảnh; nhiều nơi lấy dấu vân tay hoặc quét sinh trắc.", "Ảnh này in lên phiếu điểm (TRF) — đừng đội mũ, đeo kính râm."],
          ["**Gửi đồ**", "Điện thoại (tắt hẳn), đồng hồ (kể cả đồng hồ thường), ví, túi, giấy tờ ghi chép — gửi khu để đồ.", "Đồng hồ đeo tay thường KHÔNG được mang vào; phòng có đồng hồ treo, bài thi máy có đồng hồ trên màn hình."],
          ["**Mang vào phòng**", "Giấy tờ tuỳ thân; chai nước trong suốt, bóc nhãn; bút chì và tẩy (thi giấy — nhiều nơi phát sẵn).", "Thi máy: giấy nháp và bút do điểm thi phát, nộp lại khi ra. Không mang giấy của mình vào."],
          ["**Trong giờ**", "Muốn đi vệ sinh hoặc cần gì: GIƠ TAY, chờ giám thị. Đồng hồ bài thi vẫn chạy.", "Không nói chuyện với người bên cạnh, kể cả hỏi mượn tẩy."],
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — ba lỗi làm hỏng buổi thi trước khi bắt đầu",
        items: [
          "Mang **bản photo** hoặc giấy tờ **khác** với lúc đăng ký (đăng ký bằng hộ chiếu, mang căn cước). Có điểm thi sẽ không cho vào phòng.",
          "Đến **đúng giờ thi** thay vì **giờ có mặt** ghi trong thư. Giờ có mặt thường sớm hơn giờ thi khá nhiều để làm thủ tục.",
          "Quên rằng **Speaking có thể khác ngày** với ba phần kia — thư xác nhận ghi riêng giờ Speaking. Đọc lại thư vào D-1.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Thứ tự các phần — thi trên máy và thi trên giấy khác nhau ở đâu" },
      { t: "p", text: "Cả hai dạng có **cùng đề, cùng thang chấm, cùng giá trị**. Thứ tự luôn là **Listening → Reading → Writing, liền một mạch, không có giờ nghỉ** giữa ba phần. Speaking thi riêng — cùng ngày hoặc trong khoảng vài ngày trước / sau ba phần kia (thường tối đa 7 ngày; xem thư xác nhận)." },
      {
        t: "sodo", kind: "flow", title: "Một buổi thi — khoảng 2 giờ 40 phút ngồi liền, chưa tính check-in",
        caption: "Thi máy: Listening có ~2 phút soát cuối thay cho 10 phút chép đáp án.",
        steps: [
          { label: "**Check-in**", sub: "giấy tờ · ảnh · gửi đồ · vào phòng" },
          { label: "**Listening ~30 phút**", sub: "4 phần, 40 câu, nghe MỘT lần · giấy: +10 phút chép · máy: +2 phút soát" },
          { label: "**Reading 60 phút**", sub: "3 bài, 40 câu · KHÔNG có thời gian chép thêm, kể cả thi giấy" },
          { label: "**Writing 60 phút**", sub: "Task 1 ≥ 150 từ · Task 2 ≥ 250 từ · tự chia giờ" },
          { label: "**Speaking 11–14 phút**", sub: "Part 1 · 2 · 3 · gặp giám khảo, có ghi âm — có thể khác ngày" },
        ],
      },
      {
        t: "table", caption: "Thi máy vs thi giấy — những chỗ đổi CÁCH LÀM, không đổi đề",
        head: ["Chỗ khác", "Thi trên máy", "Thi trên giấy"],
        rows: [
          ["Listening — chép đáp án", "Gõ thẳng vào ô trong lúc nghe; cuối bài khoảng **2 phút** soát. Không có 10 phút chép.", "Ghi lên đề trong lúc nghe; cuối bài **10 phút** chép sang phiếu trả lời bằng bút chì."],
          ["Listening — âm thanh", "Tai nghe riêng, tự chỉnh âm lượng trước khi bắt đầu.", "Thường là loa chung hoặc tai nghe, tuỳ điểm thi."],
          ["Reading", "Bài đọc và câu hỏi chia đôi màn hình; tô sáng, ghi chú, đánh dấu câu để quay lại.", "Ghi thẳng lên đề; tự quản lý phiếu trả lời — không có giờ chép thêm."],
          ["Writing", "Gõ phím; màn hình đếm từ cho bạn; sửa, chèn, cắt dán dễ.", "Viết tay; tự ước số từ (đếm số từ trung bình một dòng của mình × số dòng); sửa bằng gạch ngang gọn."],
          ["Lỗi hay gặp", "Gõ sai chính tả vì quen máy tự sửa · quên số nhiều khi gõ nhanh.", "Chép lệch dòng (câu 13 ghi vào ô 14) · chữ khó đọc · hết 10 phút chưa chép xong."],
          ["Kết quả", "Thường nhanh — vài ngày.", "Lâu hơn — thường khoảng 2 tuần. Số ngày cụ thể: kiểm tra trên trang của IDP / British Council."],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — chọn dạng thi theo điểm yếu của bạn",
        items: [
          "Gõ phím nhanh, chữ viết tay xấu, hay sửa bài ⇒ **thi máy** lợi cho Writing.",
          "Quen gạch chân, ghi chú lên giấy khi đọc, mắt mỏi khi nhìn màn hình lâu ⇒ **thi giấy** có thể lợi cho Reading.",
          "Listening: thi giấy có 10 phút chép — nhưng đó là thời gian CHÉP, không phải thời gian nghĩ lại. Thi máy bắt bạn chốt đáp án ngay — đúng thói quen bạn đã luyện ở Online Test.",
          "Khoá này luyện chủ yếu trên **Online Test** (giống thi máy). Chọn thi giấy thì làm ít nhất hai đề Listening trên giấy có bấm 10 phút chép trước ngày thi.",
        ],
      },
      {
        t: "quiz", id: "t5d29-thu-tu-kiem", kind: "fill",
        title: "Kiểm nhanh — điền MỘT từ hoặc MỘT số",
        items: [
          { q: "1. On paper, candidates get ___ minutes at the end of Listening to transfer their answers.", answers: ["10", "ten"], hint: "Chỉ thi giấy. Thi máy: khoảng 2 phút soát." },
          { q: "2. In both formats, there is no extra transfer time for ___ .", answers: ["reading", "Reading"], hint: "Reading 60 phút là trọn — kể cả thi giấy." },
          { q: "3. The order of the first three parts is Listening, Reading, ___ .", answers: ["writing", "Writing"], hint: "L → R → W, không nghỉ." },
          { q: "4. The Speaking test lasts between eleven and ___ minutes.", answers: ["14", "fourteen"], hint: "11–14 phút, ba Part." },
          { q: "5. You must bring the same identity document that you used to ___ .", answers: ["register", "book", "enrol", "enroll"], hint: "Giấy tờ phải trùng lúc đăng ký." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Ngữ pháp ① — câu hỏi gián tiếp: hỏi giám thị, xin giám khảo nhắc lại" },
      { t: "p", text: "Ở phòng thi bạn sẽ phải hỏi vài câu thật: phòng nào, khi nào bắt đầu Speaking, có được đổi tai nghe không. Câu hỏi **gián tiếp** lịch sự hơn câu hỏi thẳng, và đây là chỗ người band 7 vẫn sai: ==sau Could you tell me / Do you know / I was wondering, phần câu hỏi trở lại TRẬT TỰ CÂU KỂ== (S + V), không đảo trợ động từ, không có do / does / did." },
      {
        t: "patterns",
        rows: [
          { formula: "Could you tell me + Wh- + S + V ?   (KHÔNG đảo: where the room is, ~~where is the room~~)", vi: "Câu hỏi Wh- gián tiếp: từ để hỏi + chủ ngữ + động từ.", examples: [{ en: "Could you tell me where the Speaking test takes place?", vi: "Anh / chị có thể cho tôi biết bài thi Nói diễn ra ở đâu không?" }, { en: "Do you know how long the check-in usually takes?", vi: "Bạn có biết thủ tục check-in thường mất bao lâu không?" }] },
          { formula: "I was wondering + if / whether + S + V   (câu Yes / No gián tiếp)", vi: "Câu Yes / No gián tiếp dùng if / whether; lịch sự hơn Can I…?", examples: [{ en: "I was wondering whether I could have a different pair of headphones — this one crackles.", vi: "Tôi muốn hỏi liệu tôi có thể đổi tai nghe khác không — cái này bị rè." }] },
          { formula: "Sorry, could you repeat the question?   ·   Sorry, would you mind saying that again?", vi: "Xin nhắc lại câu hỏi (Speaking). would you mind + V-ing / mind saying.", examples: [{ en: "Sorry, would you mind repeating that? I didn't quite catch the last word.", vi: "Xin lỗi, anh / chị nhắc lại được không? Tôi chưa nghe rõ từ cuối." }] },
          { formula: "Do you mean X, or Y?   ·   When you say X, do you mean…?", vi: "Hỏi lại để làm rõ (Part 3 — giám khảo có thể diễn đạt lại).", examples: [{ en: "When you say “technology”, do you mean the internet in general or something more specific, like phones?", vi: "Khi anh / chị nói “công nghệ”, ý là internet nói chung hay cụ thể hơn, như điện thoại?" }] },
        ],
      },
      {
        t: "table", caption: "Giám khảo được làm gì khi bạn xin nhắc lại — theo cách thi Speaking được mô tả công khai",
        head: ["Part", "Bạn có thể", "Giám khảo thường chỉ"],
        rows: [
          ["Part 1", "Xin nhắc lại câu hỏi.", "Nhắc lại đúng câu đó — KHÔNG giải thích từ, không đổi cách hỏi. Không hiểu một từ ⇒ nói thật ngắn rồi trả lời phần bạn hiểu."],
          ["Part 2", "Hỏi ngay khi nhận thẻ nếu không rõ một từ trên thẻ.", "Có thể không giải thích. Hiểu theo cách hợp lý nhất rồi nói — lạc nhẹ ở một ý phụ không làm hỏng Part 2."],
          ["Part 3", "Xin nhắc lại, hoặc hỏi “Do you mean…?”.", "Có thể diễn đạt lại câu hỏi. Đây là Part hỏi lại an toàn nhất."],
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — câu hỏi gián tiếp của người Việt",
        items: [
          "~~Could you tell me where is the room?~~ → **Could you tell me where the room is?**",
          "~~Do you know when does the test start?~~ → **Do you know when the test starts?** (bỏ does, động từ chia lại: starts).",
          "~~I was wondering can I change my headphones.~~ → **I was wondering if I could change my headphones.** (if + lùi thì cho lịch sự).",
          "Xin nhắc lại BA lần trong một bài Speaking không bị trừ điểm vì “phép lịch sự”, nhưng giám khảo nghe được Fluency của bạn qua việc đó. Một hai lần, đúng lúc: hoàn toàn bình thường.",
        ],
      },
      { t: "rule", formula: "Could you tell me / Do you know + Wh- + S + V ?   ·   I was wondering + if / whether + S + could…", vi: "Câu hỏi nằm trong câu khác ⇒ trật tự câu kể: không đảo, không do / does / did." },
      {
        t: "quiz", id: "t5d29-gian-tiep-dich", kind: "translate", grammar: "Could you tell me + Wh- + S + V · I was wondering if + S + could · would you mind + V-ing",
        title: "Dịch sang tiếng Anh — câu hỏi gián tiếp ở phòng thi (5 câu)",
        items: [
          { q: "Anh có thể cho tôi biết phòng thi Nói ở tầng nào không?", answers: ["Could you tell me which floor the Speaking room is on?", "Could you tell me which floor the Speaking test room is on?", "Could you tell me what floor the Speaking room is on?", "Can you tell me which floor the Speaking room is on?"], hint: "which floor + S + is on — không đảo is" },
          { q: "Bạn có biết khi nào bài thi Nói của tôi bắt đầu không?", answers: ["Do you know when my Speaking test starts?", "Do you know when my Speaking test begins?", "Do you know what time my Speaking test starts?", "Do you know when my speaking test starts?"], hint: "bỏ does, chia starts" },
          { q: "Tôi muốn hỏi liệu tôi có thể đổi chỗ ngồi không — màn hình này bị chói.", answers: ["I was wondering if I could change seats — this screen has a glare.", "I was wondering whether I could change seats because this screen is too bright.", "I was wondering if I could change my seat — this screen is too bright.", "I was wondering if I could move to another seat — this screen has a glare."], hint: "I was wondering if + I could" },
          { q: "Xin lỗi, anh nhắc lại câu hỏi được không ạ?", answers: ["Sorry, could you repeat the question?", "Sorry, would you mind repeating the question?", "Sorry, could you say the question again?", "Sorry, would you mind saying that again?"], hint: "would you mind + V-ing" },
          { q: "Khi anh nói “thành công”, ý anh là thành công trong công việc hay trong cuộc sống?", answers: ["When you say “success”, do you mean success at work or in life?", "When you say success, do you mean success at work or in life?", "When you say “success”, do you mean success in your career or in life in general?", "When you say success, do you mean at work or in life?"], hint: "When you say X, do you mean… or…?" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Ngữ pháp ② — câu mua giờ có rào đón: khi chưa biết trả lời gì" },
      { t: "p", text: "Band 8 Fluency không có nghĩa là trả lời ngay lập tức. Nó có nghĩa là ==chỗ ngừng vì đang NGHĨ Ý, không vì đang TÌM TỪ== (Tập 5 Ngày 2). Một câu mua giờ tốt làm hai việc: cho bạn 3–4 giây, và **báo trước hướng** câu trả lời. Ngữ pháp bên trong: hiện tại hoàn thành (I've never really thought about…) + rào đón (I suppose, I'd imagine, I'd probably say)." },
      {
        t: "patterns",
        rows: [
          { formula: "That's not something I've (ever) given much thought to, but I suppose + S + V", vi: "Câu đề hỏi điều bạn chưa từng nghĩ tới (Part 3 lạ).", examples: [{ en: "That's not something I've given much thought to, but I suppose people trust strangers less in big cities.", vi: "Tôi chưa nghĩ nhiều về chuyện đó, nhưng tôi đoán là ở thành phố lớn người ta ít tin người lạ hơn." }] },
          { formula: "It's hard to generalise, but I'd imagine + S + would + V", vi: "Câu hỏi về nhóm người lớn (người già, các nước, xã hội).", examples: [{ en: "It's hard to generalise, but I'd imagine older people would find it more stressful.", vi: "Khó mà nói chung được, nhưng tôi nghĩ người lớn tuổi sẽ thấy căng thẳng hơn." }] },
          { formula: "Off the top of my head, I'd probably say + N / S + V", vi: "Câu hỏi đòi một ví dụ / con số / cái tên mà bạn chưa có sẵn.", examples: [{ en: "Off the top of my head, I'd probably say healthcare, because the delays there are so visible.", vi: "Nghĩ ngay lúc này thì tôi sẽ nói là y tế, vì sự chậm trễ ở đó quá rõ." }] },
          { formula: "I'm honestly not sure — but if I had to guess, + S + would + V", vi: "Thật sự không biết dữ kiện: nói thật, rồi vẫn trả lời bằng suy luận.", examples: [{ en: "I'm honestly not sure, but if I had to guess, I'd say the figure has gone up.", vi: "Tôi thật sự không chắc, nhưng nếu phải đoán thì tôi nghĩ con số đã tăng." }] },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — câu mua giờ thành điểm trừ khi",
        items: [
          "Dùng **cùng một câu** cho mọi câu hỏi (giám khảo nghe ra “câu học thuộc” — trừ Fluency và LR).",
          "Mua giờ rồi **không trả lời gì** (That's a difficult question… well… it depends). Sau câu rào đón phải có ý chính trong 1 câu.",
          "Dùng ở **Part 1** cho câu hỏi dễ (“Do you like mirrors?”) — nghe như né tránh. Câu mua giờ dành cho Part 3, đôi khi Part 2.",
          "~~I have never thought about it before~~ đứng một mình nghe cụt. Thêm **but**: “…, but my first instinct is that…”.",
        ],
      },
      { t: "rule", formula: "câu mua giờ (3–4 giây) + but + ý chính trong MỘT câu + lý do + ví dụ", vi: "Mua giờ mà không có ý chính ngay sau đó thì chỉ là ngừng dài hơn." },
      {
        t: "quiz", id: "t5d29-mua-gio-dich", kind: "translate", grammar: "That's not something I've given much thought to, but… · It's hard to generalise, but I'd imagine… · if I had to guess…",
        title: "Dịch sang tiếng Anh — câu mua giờ có rào đón (4 câu)",
        items: [
          { q: "Tôi chưa nghĩ nhiều về chuyện đó, nhưng tôi đoán là trẻ em học nhanh hơn người lớn.", answers: ["That's not something I've given much thought to, but I suppose children learn faster than adults.", "That's not something I've really thought about, but I suppose children learn faster than adults.", "I haven't given it much thought, but I suppose children learn faster than adults.", "That's not something I've given much thought to, but I'd imagine children learn faster than adults."], hint: "That's not something I've given much thought to, but…" },
          { q: "Khó mà nói chung được, nhưng tôi nghĩ người ở nông thôn sẽ thấy điều đó khó hơn.", answers: ["It's hard to generalise, but I'd imagine people in rural areas would find it harder.", "It's hard to generalise, but I'd imagine people in the countryside would find it harder.", "It's difficult to generalise, but I'd imagine people in rural areas would find it more difficult.", "It's hard to generalize, but I'd imagine people in rural areas would find it harder."], hint: "I'd imagine + S + would + V" },
          { q: "Tôi thật sự không chắc, nhưng nếu phải đoán thì tôi nói là khoảng một nửa.", answers: ["I'm honestly not sure, but if I had to guess, I'd say about half.", "I'm honestly not sure, but if I had to guess, I'd say around half.", "I'm really not sure, but if I had to guess, I'd say about half.", "Honestly, I'm not sure, but if I had to guess, I'd say roughly half."], hint: "if I had to guess, I'd say…" },
          { q: "Nghĩ ngay lúc này thì tôi sẽ nói là giao thông công cộng.", answers: ["Off the top of my head, I'd probably say public transport.", "Off the top of my head, I'd say public transport.", "Off the top of my head, I would probably say public transport.", "Off the top of my head, I'd probably say public transportation."], hint: "Off the top of my head, I'd probably say…" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Khi lỡ câu — Listening và Reading: cắt lỗ trong 5 giây" },
      { t: "p", text: "Nguyên tắc chung cho cả hai: ==một câu lỡ chỉ được phép làm mất ĐÚNG một câu==. Người band 7 lỡ câu 14 rồi mất luôn 15, 16, 17 vì còn đang cố nghe lại câu 14. Người band 8 bỏ câu 14 ngay khi nghe thấy từ khoá của câu 15." },
      {
        t: "table", caption: "Listening — khi nhận ra mình đã lỡ",
        head: ["Tình huống", "Làm ngay (5 giây)", "Đừng làm"],
        rows: [
          ["Nghe thấy từ khoá câu 15 mà câu 14 chưa có đáp án", "Bỏ 14, đặt mắt vào câu 15–16. Ghi một chữ cái nhỏ bên cạnh 14 nếu đã nghe được nửa đáp án.", "Nhìn lên câu 14 thêm một giây nào nữa."],
          ["Mất hẳn mạch — không biết người nói đang ở câu nào", "Nhìn trước 2–3 câu, tìm TÊN RIÊNG / SỐ / TỪ HIẾM trong câu hỏi — đó là thứ dễ nghe lại nhất. Bắt lại mạch ở câu đó.", "Đọc lại từ đầu nhóm câu hỏi."],
          ["Hai đáp án cho cùng một câu (người nói sửa lại)", "Ghi cả hai, gạch cái bị phủ nhận; đáp án là bản CUỐI được xác nhận (Ngày 24 · 25).", "Chọn cái nghe được đầu tiên vì “chắc chắn hơn”."],
          ["Hết bài, còn ô trống", "Đoán theo loại từ và ngữ pháp của câu: số nhiều? danh từ? đơn vị? KHÔNG để trống — không bị trừ điểm khi sai.", "Bỏ trống vì “không chắc”."],
          ["Part 4 nghe mệt, mất tập trung", "Nhìn tiêu đề phần ghi chú (heading) — bài giảng đi theo đúng thứ tự heading. Chờ heading tiếp theo.", "Nghĩ về câu đã lỡ ở Part 3."],
        ],
      },
      {
        t: "table", caption: "Reading — khi bị kẹt",
        head: ["Tình huống", "Làm ngay", "Đừng làm"],
        rows: [
          ["Một câu đã quá 90 giây", "Đánh dấu (máy: nút đánh dấu; giấy: khoanh số), chọn đáp án tạm, đi tiếp.", "Đọc lại cả đoạn lần ba."],
          ["Passage 1 đã quá 20 phút", "Điền tạm hết câu còn lại, sang Passage 2 ngay. Bạn cần thời gian cho Passage 3 hơn là 1 câu ở Passage 1.", "“Làm cho xong” Passage 1."],
          ["TFNG / YNNG phân vân giữa FALSE và NOT GIVEN", "Hỏi: bài có nói ĐIỀU NGƯỢC LẠI không? Có ⇒ FALSE / NO. Bài im lặng về đúng ý đó ⇒ NOT GIVEN (Tập 5 Ngày 3 · 9).", "Chọn NOT GIVEN vì “không tìm thấy” khi chưa tìm đủ."],
          ["Còn 3 phút, còn 6 câu", "Điền hết: matching ⇒ chọn chữ chưa dùng; TFNG ⇒ chọn theo cảm giác đầu; điền từ ⇒ đoán danh từ hợp ngữ pháp.", "Để trống (giấy: không có giờ chép thêm — phiếu trống là điểm 0)."],
        ],
      },
      { t: "rule", formula: "lỡ 1 câu ⇒ chỉ mất 1 câu   ·   không bao giờ để trống", vi: "Mắt luôn ở câu SẮP TỚI, không ở câu ĐÃ LỠ." },

      /* ── 7 ── */
      { t: "h", text: "7. Khi lạc đề — Writing: phát hiện ở phút nào thì làm gì" },
      { t: "p", text: "Lạc đề ở band 8 hiếm khi là viết sai hoàn toàn chủ đề. Nó thường là ==lạc một nửa==: đề hỏi về một QUYỀN mà bạn viết về ưu – nhược của công nghệ; đề hỏi “to what extent” mà bạn viết hai mặt không lập trường; đề Two-part có hai câu hỏi mà bạn trả lời một. Task Response bị giới hạn mạnh khi bài chỉ trả lời một phần đề — dù ngữ pháp và từ vựng đẹp tới đâu." },
      {
        t: "table", caption: "Lạc đề Task 2 — quyết định theo thời điểm phát hiện (nối Tập 4 Ngày 28 mục 8, nâng cho band 8)",
        head: ["Phát hiện lúc", "Làm gì", "Vì sao"],
        rows: [
          ["Phút 0–5 (đang lập dàn)", "Gạch từng vế của đề (Tập 3 Ngày 6: “đếm vế đề”). Viết thesis trả lời ĐÚNG câu hỏi, đọc lại so với đề trước khi viết thân bài.", "Đây là lúc rẻ nhất để sửa — 30 giây."],
          ["Phút 10–25 (đang viết thân bài 1)", "Giữ đoạn đã viết nếu dùng lại được. Viết lại thesis (1 câu). Thêm vào cuối đoạn 1 một câu kéo về đề (mục 8). Thân bài 2 viết đúng trọng tâm.", "Xoá cả bài là mất 15 phút — không còn đủ giờ cho bài 250 từ tốt."],
          ["Phút 30–35 (gần xong)", "Không viết lại. Thêm một đoạn ngắn 3–4 câu trả lời phần bị thiếu (vế thứ hai của Two-part, hoặc lập trường rõ). Sửa thesis và kết bài cho khớp.", "Một bài trả lời đủ các vế, dù một vế mỏng, tốt hơn một bài đẹp trả lời một nửa."],
          ["Còn 3 phút", "Chỉ sửa câu kết bài để nói thẳng lập trường / trả lời vế còn thiếu bằng MỘT câu.", "Kết bài là chỗ giám khảo đọc kỹ để kiểm lập trường."],
        ],
      },
      {
        t: "table", caption: "Lạc đề Task 1 — ba kiểu và cách cứu",
        head: ["Kiểu lạc", "Dấu hiệu", "Cứu"],
        rows: [
          ["Sai đơn vị", "Viết “people” khi hình đo phần trăm; viết “million” khi trục là nghìn.", "Soát đơn vị trong 4 phút cuối — sửa ngay trong câu, không cần viết lại đoạn."],
          ["Thiếu overview", "Bài chỉ liệt kê số liệu từ đầu tới cuối.", "Chèn 2 câu overview sau mở bài (đặc điểm nổi bật nhất + xu hướng chung) — đây là chỗ thêm điểm nhiều nhất trong 2 phút."],
          ["Đưa ý kiến / lý do", "“This is because people are busier now.”", "Xoá câu lý do. Task 1 chỉ mô tả cái hình CÓ."],
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Ngữ pháp ③ — câu “kéo về đề”: nối đoạn lạc một nửa trở lại câu hỏi" },
      { t: "p", text: "Khi một đoạn thân bài đã đi lệch (nói nhiều về nguyên nhân mà đề hỏi về giải pháp, nói về công nghệ mà đề hỏi về quyền), bạn không cần xoá đoạn đó. Bạn cần ==một câu cuối đoạn nói rõ ý vừa viết TRẢ LỜI câu hỏi như thế nào==. Ba khung câu dưới đây dùng câu chẻ giả (What… is that…) và mệnh đề danh ngữ — hai cấu trúc đã học ở Tập 5 Ngày 5 và 13." },
      {
        t: "patterns",
        rows: [
          { formula: "What this means for + [trọng tâm của đề] + is that + S + V", vi: "Câu chẻ giả: đưa trọng tâm của đề lên đầu câu.", examples: [{ en: "What this means for the question of public services is that efficiency alone cannot be the measure of success.", vi: "Điều này có nghĩa với câu hỏi về dịch vụ công là hiệu quả thôi không thể là thước đo thành công." }] },
          { formula: "This matters because + S + V, which is precisely why + [lập trường]", vi: "Nối ví dụ / nguyên nhân về lập trường của bài.", examples: [{ en: "This matters because those least able to complain are the most affected, which is precisely why the right should be guaranteed by law.", vi: "Điều này quan trọng vì người ít khả năng khiếu nại nhất lại bị ảnh hưởng nhiều nhất, và chính vì thế quyền đó nên được luật bảo đảm." }] },
          { formula: "It is for this reason that + S + V   (câu chẻ it is… that)", vi: "Chốt đoạn bằng lập trường.", examples: [{ en: "It is for this reason that I believe the benefits outweigh the costs, at least for younger workers.", vi: "Chính vì lý do này mà tôi tin lợi ích lớn hơn chi phí, ít nhất là với người lao động trẻ." }] },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — câu kéo về đề không phải “câu thần chú”",
        items: [
          "Nó chỉ cứu được đoạn **lạc một nửa** (ý vẫn liên quan). Đoạn nói chuyện hoàn toàn khác đề thì câu cuối không cứu được — phải viết đoạn mới.",
          "Mỗi bài dùng **tối đa một lần**. Hai đoạn cùng kết bằng “What this means for… is that…” là dấu hiệu khuôn mẫu (CC giảm).",
          "Trọng tâm của đề phải được **gọi bằng từ của bạn** (paraphrase), không chép nguyên cụm của đề.",
        ],
      },
      { t: "rule", formula: "What this means for + [trọng tâm đề] + is that + S + V   ·   It is for this reason that + [lập trường]", vi: "Một câu cuối đoạn nói rõ đoạn đó trả lời câu hỏi thế nào — dùng một lần mỗi bài." },
      {
        t: "quiz", id: "t5d29-keo-ve-de-dich", kind: "translate", grammar: "What this means for… is that… · This matters because…, which is precisely why… · It is for this reason that…",
        title: "Dịch sang tiếng Anh — câu kéo về đề (4 câu)",
        items: [
          { q: "Điều này có nghĩa với nhà trường là điểm thi không thể là thước đo duy nhất.", answers: ["What this means for schools is that exam results cannot be the only measure.", "What this means for schools is that test scores cannot be the only measure.", "What this means for schools is that exam results cannot be the sole measure.", "What this means for schools is that exam scores cannot be the only measure of success."], hint: "What this means for + N + is that…" },
          { q: "Chính vì lý do này mà tôi tin chính phủ nên can thiệp.", answers: ["It is for this reason that I believe the government should intervene.", "It is for this reason that I believe governments should intervene.", "It is for this reason that I believe the government should step in.", "It's for this reason that I believe the government should intervene."], hint: "It is for this reason that…" },
          { q: "Điều này quan trọng vì người nghèo bị ảnh hưởng nhiều nhất, và chính vì thế cần có luật.", answers: ["This matters because the poor are the most affected, which is precisely why a law is needed.", "This matters because poor people are affected the most, which is precisely why a law is needed.", "This matters because the poorest are the most affected, which is precisely why legislation is needed.", "This matters because poor people are the most affected, which is precisely why we need a law."], hint: "This matters because…, which is precisely why…" },
          { q: "Điều này có nghĩa với người lao động trẻ là họ phải học suốt đời.", answers: ["What this means for young workers is that they will have to keep learning throughout their lives.", "What this means for young workers is that they must learn throughout their lives.", "What this means for young workers is that they have to learn throughout their lives.", "What this means for young workers is that lifelong learning is essential."], hint: "What this means for + N + is that…" },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Khi lạc trong Speaking — bốn tình huống và câu cứu" },
      {
        t: "table",
        head: ["Tình huống", "Câu cứu (nói tự nhiên)", "Sau đó"],
        rows: [
          ["Part 2: nói được 1 phút đã hết ý", "“Actually, thinking about it now, what strikes me most is…”", "Chuyển sang CẢM NGHĨ bây giờ / so sánh trước – nay. Thẻ nào cũng có chỗ cho ý này."],
          ["Part 2: kể lạc sang chuyện khác", "“But going back to the [người / nơi / việc] itself…”", "Quay về gạch đầu dòng chưa nói trên thẻ."],
          ["Part 3: trả lời xong mới thấy hiểu sai câu hỏi", "“Sorry — I think I've answered a slightly different question. What I meant to say is…”", "Trả lời lại ngắn, đúng câu hỏi. Tự sửa là dấu hiệu tốt, không phải điểm trừ."],
          ["Đầu trống rỗng, quên từ", "“What's the word… the thing you use to…”", "Nói vòng bằng từ đơn giản (Tập 3 Ngày 11). Giám khảo chấm khả năng xoay xở, không chấm từ bạn quên."],
        ],
      },
      {
        t: "dialogue", title: "Mẫu — tự sửa khi hiểu sai câu hỏi Part 3 (band 8)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you think people are more willing to help strangers in small communities?" },
          { who: "Candidate", role: "candidate", text: "I think small communities are much safer, because everyone knows everyone, so crime tends to be lower and— sorry, I think I've drifted onto safety, which isn't quite what you asked.", vi: "Tôi nghĩ cộng đồng nhỏ an toàn hơn nhiều… — xin lỗi, tôi lạc sang chuyện an toàn, không hẳn là điều anh hỏi." },
          { who: "Candidate", role: "candidate", text: "On whether people help strangers — I'd say yes, but for a slightly uncomfortable reason. In a village, a stranger is visible, so helping them is almost a public act; people know they're being watched. In a city, a stranger is invisible, and so, frankly, is the person who walks past.", vi: "Về chuyện có giúp người lạ không — có, nhưng vì một lý do hơi khó chịu. Ở làng, người lạ rất dễ thấy, nên giúp họ gần như là việc làm công khai; ở thành phố, người lạ vô hình, và người đi lướt qua cũng vậy." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Tâm lý phòng thi ở band 8 — năm thói quen" },
      {
        t: "sodo", kind: "mindmap", title: "Tâm lý band 8", center: "Giữ đầu óc ở câu TRƯỚC MẶT",
        branches: [
          { label: "Kịch bản ngày thi", items: ["viết sẵn từng bước từ lúc thức dậy", "không quyết định gì mới trong ngày thi"] },
          { label: "Mỗi phần là một ván mới", items: ["Listening tệ không kéo Reading xuống", "không nghĩ về phần đã xong"] },
          { label: "Không tự chấm giữa giờ", items: ["“chắc mình được 7.5 rồi” = mất tập trung", "chấm khi có kết quả"] },
          { label: "Thở 4 – 4", items: ["hít 4 nhịp, giữ 4 nhịp, thở 4 nhịp", "dùng trước Part 4 và trước Writing"] },
          { label: "Bài khó ≠ bài hỏng", items: ["đề khó thì khó với mọi người", "điểm quy đổi tính cả độ khó"] },
        ],
      },
      { t: "p", text: "Câu cuối hay bị quên nhất: **đề khó là khó với mọi người**. Bảng quy đổi điểm thô → band của Listening và Reading được hiệu chỉnh theo độ khó của từng đề, nên 33/40 ở một đề khó có thể cho cùng band với 35/40 ở một đề dễ. Bạn không cần biết con số chính xác — chỉ cần không hoảng khi gặp Passage 3 khó hơn mọi đề luyện." },

      /* ── 11 ── */
      { t: "h", text: "11. Sau ngày thi — kết quả, band tổng và phiếu điểm" },
      {
        t: "table", caption: "Những điều ổn định — chi tiết hiện hành xem trang của IDP / British Council",
        head: ["Mục", "Nội dung"],
        rows: [
          ["Thời gian có kết quả", "Thi máy thường nhanh (vài ngày); thi giấy lâu hơn (thường khoảng 2 tuần). Số ngày chính xác: kiểm tra trên trang của đơn vị tổ chức."],
          ["Band tổng", "Trung bình cộng 4 kỹ năng, làm tròn tới nửa band gần nhất; số lẻ .25 làm tròn LÊN .5, .75 làm tròn LÊN số nguyên. Ví dụ 8 + 7.5 + 7 + 7 = 29.5 ÷ 4 = 7.375 ⇒ **7.5**; 8 + 8 + 7 + 7.5 = 30.5 ÷ 4 = 7.625 ⇒ **7.5**; 8 + 8 + 7.5 + 7.5 = 31 ÷ 4 = 7.75 ⇒ **8.0**."],
          ["Phiếu điểm (TRF)", "Có ảnh, 4 điểm thành phần và band tổng. Hầu hết trường và tổ chức nhận kết quả trong **2 năm** kể từ ngày thi — nhưng mỗi nơi tự quy định."],
          ["Gửi kết quả", "Thường có thể yêu cầu điểm thi gửi kết quả điện tử tới trường / tổ chức. Số nơi được gửi miễn phí và phí gửi thêm: kiểm tra trên trang của IDP / British Council."],
        ],
      },
      {
        t: "quiz", id: "t5d29-band-tong", kind: "fill", title: "Tính band tổng (4 câu)",
        items: [
          { q: "1. L 8.5 · R 8.0 · W 7.0 · S 7.5 ⇒ band tổng = ?", answers: ["8", "8.0"], hint: "31 ÷ 4 = 7.75 ⇒ làm tròn lên 8.0." },
          { q: "2. L 8.0 · R 7.5 · W 7.0 · S 7.0 ⇒ band tổng = ?", answers: ["7.5"], hint: "29.5 ÷ 4 = 7.375 ⇒ gần 7.5 hơn 7.0 ⇒ 7.5." },
          { q: "3. L 7.5 · R 7.5 · W 7.0 · S 7.0 ⇒ band tổng = ?", answers: ["7.5"], hint: "29 ÷ 4 = 7.25 ⇒ .25 làm tròn LÊN .5 ⇒ 7.5." },
          { q: "4. L 8.0 · R 7.0 · W 6.5 · S 7.0 ⇒ band tổng = ?", answers: ["7", "7.0"], hint: "28.5 ÷ 4 = 7.125 ⇒ gần 7.0 hơn ⇒ 7.0." },
        ],
      },

      /* ── 12 ── */
      { t: "h", text: "12. Phúc khảo (Enquiry on Results — EOR): khi nào đáng làm" },
      {
        t: "table", caption: "Quy định thường gặp — phí và số ngày cụ thể: kiểm tra trên trang của IDP / British Council",
        head: ["Mục", "Nội dung"],
        rows: [
          ["Hạn nộp", "Trong vòng **6 tuần** kể từ ngày thi."],
          ["Chấm lại phần nào", "Bạn chọn một hoặc nhiều kỹ năng (Listening, Reading, Writing, Speaking)."],
          ["Ai chấm", "Giám khảo cấp cao khác, không biết điểm cũ của bạn."],
          ["Kết quả", "Điểm có thể TĂNG, GIỮ NGUYÊN, hoặc GIẢM. Thời gian chờ thường từ vài ngày tới khoảng 3 tuần, tuỳ số kỹ năng và tình huống."],
          ["Phí", "Có phí; thường được hoàn lại nếu điểm thay đổi theo hướng tăng. Mức phí và điều kiện hoàn: kiểm tra trên trang của IDP / British Council."],
        ],
      },
      {
        t: "table", caption: "Có nên phúc khảo? — kinh nghiệm chung của người dạy, KHÔNG phải số liệu chính thức",
        head: ["Tình huống", "Lời khuyên"],
        rows: [
          ["Thiếu ĐÚNG 0.5 ở một kỹ năng so với mục tiêu, và kỹ năng đó lệch hẳn so với 3 kỹ năng kia (ví dụ W 6.5, còn lại 8.0) cùng với điểm luyện đề ổn định cao hơn", "Đáng cân nhắc — nhất là Writing / Speaking, nơi chấm bằng nhận định của giám khảo."],
          ["Band tổng thiếu 0.5 vì một kỹ năng cách ngưỡng làm tròn rất gần", "Tính lại: nếu kỹ năng đó tăng 0.5 thì band tổng có đổi không? Không đổi ⇒ phúc khảo chỉ có ý nghĩa khi trường yêu cầu điểm từng kỹ năng."],
          ["Listening / Reading thấp hơn mong đợi", "Ít khi đổi — đáp án đúng / sai là khách quan. Chỉ cân nhắc nếu nghi ngờ lỗi chép đáp án hay lỗi kỹ thuật cụ thể."],
          ["Thiếu nhiều (1.0 trở lên) so với mục tiêu", "Phúc khảo hiếm khi bù nổi. Dồn sức vào thi lại hoặc One Skill Retake."],
          ["Hạn nộp hồ sơ trường còn rất gần", "Hỏi trường có nhận kết quả đang phúc khảo không, và so thời gian chờ phúc khảo với ngày thi kế tiếp."],
        ],
      },

      /* ── 13 ── */
      { t: "h", text: "13. One Skill Retake (OSR) — thi lại MỘT kỹ năng" },
      {
        t: "table", caption: "Quy định thường gặp — điểm thi nào có, có áp cho thi giấy không, phí, nơi nhận: kiểm tra trên trang của IDP / British Council",
        head: ["Mục", "Nội dung"],
        rows: [
          ["Là gì", "Thi lại đúng MỘT kỹ năng (L, R, W hoặc S) của một bài thi đã có kết quả, thay vì thi lại cả bốn."],
          ["Hạn đăng ký", "Trong vòng **60 ngày** kể từ ngày thi gốc."],
          ["Số lần", "Một lần cho mỗi bài thi gốc."],
          ["Hình thức", "Thường thi trên máy (Speaking vẫn gặp giám khảo). Ban đầu dành cho người thi IELTS trên máy; có thi giấy được không thì tuỳ thời điểm và điểm thi."],
          ["Kết quả", "Nhận phiếu điểm MỚI với điểm kỹ năng thi lại; phiếu cũ vẫn còn hiệu lực. Bạn chọn phiếu nào để nộp."],
          ["Lưu ý lớn nhất", "**Không phải mọi trường / cơ quan nhận** kết quả One Skill Retake. Hỏi nơi nhận TRƯỚC khi đăng ký."],
        ],
      },
      {
        t: "table", caption: "Chọn đường nào khi thiếu điểm",
        head: ["Tình huống", "Phúc khảo", "One Skill Retake", "Thi lại cả bài"],
        rows: [
          ["Thiếu 0.5 ở MỘT kỹ năng, nghi bị chấm chặt", "✅ thử trước", "nếu phúc khảo không đổi", "—"],
          ["Thiếu 0.5–1.0 ở MỘT kỹ năng, biết rõ mình làm dở hôm đó (lạc đề, ốm, lỡ cả Part 4)", "ít tác dụng", "✅", "—"],
          ["Thiếu ở HAI kỹ năng trở lên", "—", "chỉ sửa được một", "✅"],
          ["Nơi nhận không chấp nhận OSR", "có thể", "❌", "✅"],
        ],
      },
      {
        t: "note", title: "📌 Ghi nhớ — trước khi đăng ký bất cứ thứ gì sau ngày thi",
        items: [
          "Đọc lại yêu cầu của nơi nhận: họ cần **band tổng**, **điểm từng kỹ năng**, hay cả hai? Có nhận OSR không?",
          "Muốn vừa phúc khảo vừa OSR: hỏi rõ điểm thi về thứ tự và điều kiện — quy định có thể không cho làm song song trên cùng một bài thi.",
          "Mọi quy định trong mục 11–13 có thể thay đổi. Trang chính thức của **IDP** và **British Council** (và thư xác nhận của bạn) là nguồn đúng duy nhất.",
        ],
      },

      /* ── 14 ── */
      { t: "h", text: "14. Thêm: phát âm — những câu bạn sẽ nói ở điểm thi" },
      {
        t: "phatam", id: "t5d29-phat-am", title: "Luyện phát âm — câu ở phòng thi (8 câu)",
        note: "Đọc như đang nói thật: giọng đi XUỐNG ở cuối câu hỏi Wh- gián tiếp (vì nó là câu kể), giọng đi LÊN ở câu Yes / No. could you → /kʊdʒə/, would you → /wʊdʒə/ khi nói nhanh.",
        items: [
          { text: "Could you tell me where the Speaking test takes place?", ipa: "kʊdʒə tel miː weə ðə spiːkɪŋ test teɪks pleɪs", vi: "Câu Wh- gián tiếp — giọng xuống ở place." },
          { text: "I was wondering if I could have another pair of headphones.", ipa: "aɪ wəz wʌndərɪŋ ɪf aɪ kəd hæv ənʌðə peər əv hedfəʊnz", vi: "was /wəz/ yếu; pair of → /peərəv/ nối r." },
          { text: "Sorry, would you mind repeating the question?", ipa: "sɒri wʊdʒə maɪnd rɪpiːtɪŋ ðə kwestʃən", vi: "would you → /wʊdʒə/; nhấn re-PEAT-ing, giọng lên ở question." },
          { text: "When you say success, do you mean at work or in life?", ipa: "wen juː seɪ səkses duː juː miːn æt wɜːk ɔːr ɪn laɪf", vi: "Câu chọn A or B: lên ở work, xuống ở life." },
          { text: "That's not something I've given much thought to.", ipa: "ðæts nɒt sʌmθɪŋ aɪv ɡɪvn mʌtʃ θɔːt tuː", vi: "thought to — /t/ cuối thought nuốt vào to." },
          { text: "It's hard to generalise, but I'd imagine it varies.", ipa: "ɪts hɑːd tə dʒenrəlaɪz bət aɪd ɪmædʒɪn ɪt veəriz", vi: "generalise ba âm tiết khi nói nhanh: /dʒenrəlaɪz/." },
          { text: "Sorry, I think I've answered a slightly different question.", ipa: "sɒri aɪ θɪŋk aɪv ɑːnsəd ə slaɪtli dɪfrənt kwestʃən", vi: "different hai âm tiết: /dɪfrənt/." },
          { text: "Thank you. Have a good afternoon.", ipa: "θæŋk juː hæv ə ɡʊd ɑːftənuːn", vi: "Câu chào khi rời phòng — giữ giọng ấm, không vội." },
        ],
      },

      /* ── 15 ── */
      { t: "h", text: "15. Kiểm tra cuối bài — ngày thi và sau ngày thi" },
      {
        t: "mcq", id: "t5d29-ngay-thi-chon", title: "Chọn đáp án đúng (8 câu)",
        items: [
          { q: "1. Thi máy, Listening: khi nào bạn ghi đáp án?", options: ["Trong lúc nghe, gõ thẳng vào ô", "Sau khi nghe, trong 10 phút chép", "Cuối buổi, sau Writing"], correct: 0, why: "Thi máy không có 10 phút chép; chỉ khoảng 2 phút soát cuối bài." },
          { q: "2. Thi giấy, Reading: có thời gian chép đáp án thêm không?", options: ["Có, 10 phút", "Có, 2 phút", "Không"], correct: 2, why: "Reading 60 phút là trọn — ghi thẳng vào phiếu trả lời." },
          { q: "3. Part 1 Speaking, bạn không hiểu một từ trong câu hỏi. Giám khảo thường:", options: ["Giải thích từ đó", "Nhắc lại câu hỏi, không giải thích", "Chuyển sang Part 2"], correct: 1, why: "Part 1: nhắc lại, không diễn đạt lại. Part 3 mới có thể diễn đạt lại." },
          { q: "4. Phút 32 của Writing, bạn phát hiện Task 2 (Two-part) mới trả lời một câu hỏi. Làm gì?", options: ["Xoá hết, viết lại bài mới", "Thêm một đoạn ngắn trả lời câu hỏi thứ hai, sửa thesis và kết bài", "Để nguyên, viết kết bài thật hay"], correct: 1, why: "Bài trả lời đủ các vế, dù một vế mỏng, tốt hơn bài đẹp trả lời một nửa." },
          { q: "5. Hạn nộp phúc khảo thường là:", options: ["2 tuần", "6 tuần", "60 ngày"], correct: 1, why: "6 tuần kể từ ngày thi. 60 ngày là hạn đăng ký One Skill Retake." },
          { q: "6. Sau phúc khảo, điểm của bạn:", options: ["Chỉ có thể tăng hoặc giữ nguyên", "Có thể tăng, giữ nguyên hoặc giảm", "Luôn tăng ít nhất 0.5"], correct: 1, why: "Chấm lại độc lập — điểm có thể đổi theo cả hai hướng." },
          { q: "7. Bạn thiếu 1.0 ở Writing và 0.5 ở Speaking. Cách hợp lý nhất?", options: ["One Skill Retake cho Writing", "Phúc khảo cả hai", "Thi lại cả bài sau khi ôn"], correct: 2, why: "OSR chỉ sửa được một kỹ năng; phúc khảo hiếm khi bù 1.0." },
          { q: "8. Trước khi đăng ký One Skill Retake, việc QUAN TRỌNG NHẤT là:", options: ["Hỏi nơi nhận có chấp nhận kết quả OSR không", "Mua sách đề mới", "Đổi sang thi giấy"], correct: 0, why: "Không phải mọi trường / cơ quan nhận OSR." },
        ],
      },
    ],
  },

  /* ════════════════ BÀI 2 — READING: CHECKLIST 16 DẠNG ════════════════ */
  {
    id: "t5d29-doc",
    kind: "reading",
    title: "Đọc: Checklist 16 dạng Reading — mỗi dạng một câu cần nhớ, rồi một bài Passage 3 mới với đúng 16 câu, mỗi câu một dạng",
    goal: "Nhớ được cho từng dạng trong 16 dạng Reading MỘT câu hành động quan trọng nhất (đọc gì trước, tìm gì, bẫy ở đâu), rồi làm một bài đọc khó ~1.100 từ có đúng 16 câu thuộc 16 dạng trong 22 phút, và từ câu sai biết chính xác dạng nào cần ôn lại ở Ngày nào trước Đề 12.",
    minutes: 80,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "Không học dạng mới — **gom 16 dạng thành 16 câu**. Mỗi câu là một hành động bạn làm ngay khi nhìn thấy dạng đó, không phải định nghĩa.",
          "Bài đọc “Speaking in Whistles” (~1.100 từ, 8 đoạn) có **đúng 16 câu hỏi, mỗi câu một dạng**. Làm trong **22 phút** — đúng thời gian của Passage 3.",
          "Chấm xong, bảng chẩn đoán cho biết dạng nào sai ⇒ ôn mục nào, Ngày nào. Đây là danh sách ôn cuối cùng trước Đề 12.",
          "Nối Tập 5 Ngày 3 (TFNG) · 5 (headings) · 7 (short answer, sentence) · 9 (YNNG) · 15 (matching) · 21 (đọc một lượt) và Reading 3 passage lần 3 ở Ngày 27.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Checklist 16 dạng — mỗi dạng MỘT câu" },
      {
        t: "table", caption: "Đọc to từng dòng. Dòng nào bạn không làm theo được ngay ⇒ đánh dấu, ôn ở cột cuối.",
        head: ["Mã", "Dạng", "Câu cần nhớ (làm ngay khi thấy dạng)", "Ôn ở"],
        rows: [
          ["R01", "Sentence completion", "Đọc giới hạn từ trước, đoán loại từ còn thiếu, và chép NGUYÊN chữ trong bài sao cho câu đúng ngữ pháp.", "T5 N7"],
          ["R02", "Flow-chart completion", "Mũi tên là thứ tự trong BÀI, không phải thứ tự đoạn — tìm động từ chỉ bước (then, once, after) để dò.", "T4 N17"],
          ["R03", "Table completion", "Đọc tiêu đề cột và hàng trước: ô trống là giao của MỘT hàng với MỘT cột — tìm cả hai trong bài.", "T3 N15"],
          ["R04", "Matching features", "Gạch mọi tên trong bài trước (người, nhóm, loại), rồi đọc câu quanh từng tên — đáp án không theo thứ tự.", "T5 N15"],
          ["R05", "True / False / Not Given", "FALSE khi bài nói điều NGƯỢC LẠI; NOT GIVEN khi bài im lặng về đúng ý đó — soát từ cực đoan (only, all, first).", "T5 N3"],
          ["R06", "Summary (word box)", "Đoán loại từ của chỗ trống TRƯỚC khi nhìn hộp từ — hộp luôn có từ cùng chủ đề nhưng sai nghĩa.", "T3 N9"],
          ["R07", "Summary (từ trong bài)", "Tóm tắt thường chỉ phủ 1–2 đoạn: tìm đoạn đó bằng từ khoá ở câu đầu tóm tắt, rồi đi theo thứ tự.", "T3 N27"],
          ["R08", "Note completion", "Ghi chú bỏ bớt ngữ pháp — đáp án thường là danh từ; đi theo thứ tự trong bài.", "T4 N11"],
          ["R09", "Short-answer questions", "Từ để hỏi (what / which / how many) quyết định loại đáp án; không chép lại từ đã có trong câu hỏi.", "T5 N7"],
          ["R10", "Multiple choice (1 đáp án)", "Loại từng phương án bằng bằng chứng; phương án chép nhiều chữ của bài nhất thường là bẫy.", "T4 N9"],
          ["R11", "Multiple choice (chọn hai / ba)", "Mỗi chữ cái đúng phải có bằng chứng RIÊNG; đúng sự thật nhưng không trả lời câu hỏi = sai.", "T4 N9"],
          ["R12", "Matching headings", "Đọc câu đầu + câu cuối đoạn, tìm Ý CHÍNH của cả đoạn; heading lấy một chi tiết của đoạn là bẫy.", "T5 N5 · N9"],
          ["R13", "Matching information", "Câu hỏi nói về MỘT chi tiết nằm đâu đó trong đoạn — làm SAU cùng, sau khi đã biết bài.", "T4 N21"],
          ["R14", "Matching sentence endings", "Ghép phải đúng NGHĨA với bài, không chỉ đúng ngữ pháp — luôn có kết thúc hợp ngữ pháp mà sai ý.", "T4 N15"],
          ["R15", "Yes / No / Not Given", "Hỏi ý kiến TÁC GIẢ: tìm từ thái độ (in my view, naive, does little justice); tác giả tránh trả lời ⇒ NOT GIVEN.", "T5 N9"],
          ["R16", "Diagram label completion", "Hình đi theo một đoạn mô tả liền — tìm đoạn có nhiều danh từ chỉ bộ phận / vị trí nhất.", "T4 N17"],
        ],
      },
      { t: "rule", formula: "đọc dạng câu hỏi ⇒ một câu hành động ⇒ bằng chứng trong bài ⇒ chép đúng hình thức", vi: "Mỗi dạng có MỘT việc phải làm trước — làm sai thứ tự là mất thời gian ở Passage 3." },
      {
        t: "table", caption: "Thứ tự làm 16 dạng trong MỘT bài khi bài có nhiều dạng",
        head: ["Làm trước", "Làm sau", "Vì sao"],
        rows: [
          ["Dạng theo thứ tự bài (TFNG, YNNG, completion, MCQ, short answer)", "Matching information · matching headings (nếu đoạn dài)", "Làm dạng theo thứ tự là bạn đã đọc cả bài một lượt; matching information cần biết cả bài."],
          ["Headings khi bài có tiêu đề đoạn rõ", "Summary word box", "Headings cho bạn bản đồ bài; word box cần biết đoạn nào."],
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Bài đọc — Speaking in Whistles (22 phút, 16 câu)" },
      {
        t: "passage", title: "Speaking in Whistles",
        intro: "Bài tự soạn cho khoá học (~1.100 từ). Dữ kiện về Silbo Gomero, tiếng Thổ huýt sáo và nghiên cứu não là có thật, kể gọn và làm tròn con số (số cộng đồng, khoảng cách tiếng huýt đi được) — nhận định là của người viết.",
        paras: [
          { label: "A", text: "On the steep, terraced slopes of La Gomera, one of the smaller Canary Islands, a farmer on one side of a ravine can hold a conversation with a neighbour on the other side without raising her voice at all — or rather, without using it. She places a finger in her mouth, curls her tongue against it, and whistles. What her neighbour hears is not a signal of the kind a shepherd gives a dog, a fixed call meaning “come” or “stop”, but Spanish: words and sentences able to carry a message that neither of them has heard before. The island's whistled speech, known as Silbo Gomero, is the best documented example of a phenomenon that is far more widespread than most linguists once assumed. One survey has put the number of communities that have used some form of whistled speech at around seventy, scattered across at least four continents." },
          { label: "B", text: "These places have something in common, and it is not their language, for the languages involved belong to entirely unrelated families. What they share is terrain. Whistled speech appears where people need to communicate across distances too great for the voice, and where the landscape makes walking over to the other person slow: deep valleys, dense forest, scattered upland pastures. A shouted word loses its shape quickly, because the consonants are the first sounds to fade, and shouting is exhausting. A whistle, concentrated in a narrow band of high frequencies, stands out against the low rumble of wind and running water, and in favourable conditions it can be understood a kilometre or more away." },
          { label: "C", text: "How can a whistle, which has essentially one dimension — pitch — carry a whole language? The answer depends on the language being whistled. In tonal languages, such as Mazatec in Mexico or Hmong in South-East Asia, the meaning of a word depends partly on the melody of its syllables, so whistlers reproduce the tones and the rhythm of speech and simply leave out what a whistle cannot capture. In non-tonal languages like Spanish or Turkish, where pitch carries little meaning at the level of the word, whistlers do something more ingenious: they convert the qualities of vowels into pitch. Vowels pronounced towards the front of the mouth, like the vowel in “see”, become high whistles; those pronounced further back, like the vowel in “do”, become low ones. Consonants appear as the way the pitch rises, falls or breaks off between one vowel and the next. The result is not a code but a transformation of speech, which is why a fluent whistler can whistle any sentence of the language, including words invented on the spot." },
          { label: "D", text: "It is also why whistled speech depends so heavily on context. A great deal is lost in the transformation: in Silbo, many consonants that are clearly distinct in speech become indistinguishable when whistled. Linguists have argued for decades about how many vowels Silbo really keeps apart. An early and influential study concluded that there were only two; later researchers have heard four, and some fieldworkers maintain that skilled whistlers make finer distinctions still. Whatever the answer, listeners rely on knowing who is speaking, where and why, in much the same way that we can follow a conversation on a poor telephone line. A shepherd calling across a valley at dusk is unlikely to be discussing anything other than animals, weather or supper, and it is this predictability that allows the system to work." },
          { label: "E", text: "In the second half of the twentieth century almost every whistled language began to decline, and for broadly the same reasons. Roads reached valleys that had once been isolated; young people left farming for jobs in towns; and, more recently, the mobile phone offered a way to talk across a ravine that required no training at all. On La Gomera, by the 1970s, the number of fluent whistlers had fallen sharply, and most of those who remained were elderly. The island's response has since become a model for other communities. In 1999 the regional government made Silbo a compulsory subject in the island's primary schools, and a decade later it was added to UNESCO's list of the intangible cultural heritage of humanity. Today every child on the island learns at least the basics." },
          { label: "F", text: "Whistled speech has also attracted the attention of neuroscientists, because it offers a rare natural experiment. In most right-handed people, processing spoken language depends far more on the left hemisphere of the brain than on the right, while the right hemisphere is thought to play a larger part in processing melody and pitch. Whistled Turkish, still used by a dwindling number of people in a mountain village near the Black Sea, is the same language as spoken Turkish delivered in a melodic form. A team of researchers tested local whistlers by playing a different syllable into each ear at the same moment and asking which one they had heard. With spoken Turkish, the familiar advantage for the right ear — which reports mainly to the left hemisphere — appeared. With whistled Turkish, it largely disappeared: both hemispheres seemed to be contributing about equally. The study was small, and its authors were careful not to generalise too far, but it suggested that the brain's division of labour for language is less fixed than textbooks imply, and depends partly on the physical form in which language arrives." },
          { label: "G", text: "Not everyone agrees about what whistled languages tell us. To some researchers, they are evidence that language is fundamentally abstract: a system that can be poured into almost any physical channel — sound, gesture, writing, whistle — without losing its structure. Others argue that this underestimates how much is lost, and that whistled speech survives only because it is propped up by the spoken language it imitates; no community, they point out, has ever used whistling as its only language. Both positions can be defended, but the second sometimes slides into a dismissive tone that does the subject little justice." },
          { label: "H", text: "What, then, is worth preserving? It would be naive to expect whistled speech to return to everyday use in communities where everyone now carries a phone. But the knowledge it contains is not easily recovered once lost. Each whistled language records how one community analysed the sounds of its own speech, in some cases long before any linguist arrived to do the same. In my view, recording and teaching these systems is justified not on sentimental grounds, but because they are among the few places where we can watch human beings taking language apart and putting it back together in a different form. Whether that justifies making them compulsory in schools is a separate, and much harder, question." },
        ],
      },
      { t: "p", text: "**Bấm giờ 22 phút.** Làm theo thứ tự gợi ý: câu 1–11 (dạng theo thứ tự bài, nhóm completion và MCQ) → câu 12 (heading) → câu 13–16. Không mở gợi ý trước khi hết giờ." },
      {
        t: "quiz", id: "t5d29-doc-cau-1-3", kind: "fill",
        title: "Questions 1–3 — R01 Sentence · R02 Flow-chart · R03 Table (NO MORE THAN TWO WORDS from the passage)",
        items: [
          { q: "1. [Sentence completion] In tonal languages, whistlers copy the tones and the ______ of spoken words.", answers: ["rhythm", "rhythm of speech"], hint: "Đoạn C: “whistlers reproduce the tones and the **rhythm** of speech” — copy = reproduce. Chỉ cần “rhythm”; “the rhythm” cũng sai vì the đã có trong câu." },
          { q: "2. [Flow-chart] roads reach isolated valleys → young people leave farming → by the 1970s most fluent whistlers are ______ → 1999: Silbo becomes compulsory in primary schools", answers: ["elderly"], hint: "Đoạn E: “most of those who remained were **elderly**”. Mũi tên đi theo thời gian của bài (1970s → 1999), không theo thứ tự câu." },
          { q: "3. [Table] Non-tonal languages (e.g. Spanish, Turkish) — what the whistle reproduces: the qualities of ______, converted into pitch", answers: ["vowels"], hint: "Đoạn C: “they convert the qualities of **vowels** into pitch”. Bẫy: consonants — phụ âm hiện ra ở cách cao độ lên / xuống, KHÔNG phải thứ được đổi thành cao độ." },
        ],
      },
      {
        t: "mcq", id: "t5d29-doc-cau-4-5", title: "Questions 4–5 — R04 Matching features · R05 True / False / Not Given",
        items: [
          { q: "4. [Matching features] Which whistled language has been used to compare how the two halves of the brain process language?", options: ["A  Silbo Gomero", "B  whistled Turkish", "C  Mazatec"], correct: 1, why: "Đoạn F: “Whistled Turkish… A team of researchers tested local whistlers… both hemispheres seemed to be contributing”. the two halves of the brain = the two hemispheres. Silbo xuất hiện ở đoạn E (trường học), Mazatec ở đoạn C (ngôn ngữ thanh điệu)." },
          { q: "5. [TFNG] Silbo Gomero was the first whistled language to be studied by linguists.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn A chỉ nói Silbo là ví dụ “**best documented**” (được ghi chép đầy đủ nhất) — không nói nó được nghiên cứu ĐẦU TIÊN. Từ “first” là từ cực đoan: bài im lặng về thứ tự nghiên cứu ⇒ NOT GIVEN. Người chọn TRUE đã đổi “best documented” thành “first”." },
        ],
      },
      {
        t: "mcq", id: "t5d29-doc-cau-6", title: "Question 6 — R06 Summary completion (word box)",
        items: [
          { q: "6. Because many sounds become identical when whistled, listeners depend on the ______ of what is likely to be said in a given situation.\nA  volume   B  predictability   C  grammar   D  distance   E  variety", options: ["A  volume", "B  predictability", "C  grammar", "D  distance", "E  variety"], correct: 1, why: "Đoạn D: “it is this **predictability** that allows the system to work”. Đoán loại từ trước: the ______ of what is likely = danh từ trừu tượng về khả năng đoán trước. variety ngược nghĩa; distance cùng chủ đề (đoạn B) nhưng sai đoạn." },
        ],
      },
      {
        t: "quiz", id: "t5d29-doc-cau-7-9", kind: "fill",
        title: "Questions 7–9 — R07 Summary (từ trong bài, ONE WORD) · R08 Note (ONE WORD) · R09 Short answer (NO MORE THAN TWO WORDS)",
        items: [
          { q: "7. [Summary] Shouting is a poor way to communicate over distance: it is tiring, and the consonants of a shouted word are the first sounds to ______.", answers: ["fade"], hint: "Đoạn B: “the consonants are the first sounds to **fade**”. Tóm tắt chỉ phủ đoạn B — tìm bằng “shouted word”." },
          { q: "8. [Note] Brain study — method: a different syllable played into each ______ at the same moment", answers: ["ear"], hint: "Đoạn F: “playing a different syllable into each **ear** at the same moment”. Ghi chú bỏ ngữ pháp, đáp án là danh từ số ít (each + N)." },
          { q: "9. [Short answer] What recent invention made it possible to talk across a ravine with no training?", answers: ["mobile phone", "the mobile phone", "a mobile phone", "mobile phones"], hint: "Đoạn E: “the **mobile phone** offered a way to talk across a ravine that required no training at all”. Hai từ là đúng giới hạn." },
        ],
      },
      {
        t: "mcq", id: "t5d29-doc-cau-10", title: "Question 10 — R10 Multiple choice (one answer)",
        items: [
          { q: "10. In paragraph D, the writer compares understanding whistled speech to", options: ["A  listening to a speech in an unfamiliar language.", "B  following a conversation on a poor telephone line.", "C  reading a text in which letters are missing.", "D  recognising a familiar voice in a crowd."], correct: 1, why: "Đoạn D: “in much the same way that we can follow a conversation on a **poor telephone line**”. C nghe hợp lý (âm bị mất) nhưng bài không so với văn bản thiếu chữ." },
        ],
      },
      {
        t: "quiz", id: "t5d29-doc-cau-11", kind: "fill",
        title: "Question 11 — R11 Multiple choice (choose TWO) · gõ hai chữ cái, cách nhau dấu phẩy",
        items: [
          { q: "11. Which TWO reasons for the decline of whistled languages are mentioned in paragraph E?\nA  Roads reached valleys that had been cut off.\nB  Governments discouraged their use.\nC  Young people moved away from farming.\nD  Schools stopped teaching them.\nE  Whistling was found to damage hearing.", answers: ["A, C", "A,C", "AC", "C, A", "C,A", "CA", "A C", "C A"], hint: "Đoạn E: “Roads reached valleys that had once been isolated (A); young people left farming for jobs in towns (C)”. D ngược: trường học BẮT ĐẦU dạy (1999). B, E không có trong bài." },
        ],
      },
      {
        t: "mcq", id: "t5d29-doc-cau-12", title: "Question 12 — R12 Matching headings",
        items: [
          { q: "12. Choose the correct heading for paragraph B.\ni  Why some languages cannot be whistled\nii  The landscapes that call for whistling\niii  Measuring how far a whistle travels\niv  A dispute about vowels\nv  Teaching whistled speech in schools", options: ["i", "ii", "iii", "iv", "v"], correct: 1, why: "Câu chủ đề đoạn B: “What they share is **terrain**” — cả đoạn giải thích vì sao địa hình (thung lũng, rừng, đồng cỏ) cần tiếng huýt. iii là BẪY CHI TIẾT: khoảng cách “a kilometre or more” chỉ là một câu của đoạn. i sai: đoạn B nói các ngôn ngữ không liên quan nhau, không nói ngôn ngữ nào không huýt được." },
        ],
      },
      {
        t: "quiz", id: "t5d29-doc-cau-13", kind: "fill",
        title: "Question 13 — R13 Matching information (gõ chữ cái A–H)",
        items: [
          { q: "13. Which paragraph contains a reference to the claim that whistled speech could not exist on its own?", answers: ["G"], hint: "Đoạn G: “whistled speech survives only because it is propped up by the spoken language it imitates; no community… has ever used whistling as its **only** language”. Đoạn H nói chuyện bảo tồn, không nói chuyện “tự đứng một mình”." },
        ],
      },
      {
        t: "mcq", id: "t5d29-doc-cau-14-15", title: "Questions 14–15 — R14 Matching sentence endings · R15 Yes / No / Not Given",
        items: [
          { q: "14. [Sentence endings] The study of whistled Turkish suggested that the way the brain handles language", options: ["A  depends partly on the form in which language is received.", "B  is the same in whistlers and non-whistlers.", "C  is controlled entirely by the left hemisphere.", "D  changes as people grow older."], correct: 0, why: "Đoạn F (câu cuối): “depends partly on the **physical form in which language arrives**” — received = arrives. C hợp ngữ pháp nhưng NGƯỢC kết quả (với tiếng huýt, hai bán cầu góp ngang nhau). D (thay đổi theo tuổi) không có trong bài — bẫy “nghe hợp lý”." },
          { q: "15. [YNNG] The writer believes that making whistled languages compulsory in schools is clearly justified.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn H: tác giả ủng hộ ghi âm và DẠY (“recording and teaching… is justified”), nhưng việc BẮT BUỘC thì “a separate, and much harder, question” — tác giả cố ý không trả lời ⇒ NOT GIVEN. Người chọn YES đã đổi “teaching” thành “compulsory”; người chọn NO đã đọc “harder” thành “không đồng ý”." },
        ],
      },
      {
        t: "table", caption: "Question 16 — R16 Diagram label: How a whistler on La Gomera produces the sound (hình mô tả bằng chữ)",
        head: ["Bộ phận trên hình", "Nhãn"],
        rows: [
          ["① đặt vào miệng", "a finger"],
          ["② cuộn áp vào ①", "**16** ______ (ONE WORD)"],
          ["③ âm phát ra", "a whistle in a narrow band of high frequencies"],
        ],
      },
      {
        t: "quiz", id: "t5d29-doc-cau-16", kind: "fill",
        title: "Question 16 — điền ONE WORD",
        items: [
          { q: "16. The ______ is curled against the finger.", answers: ["tongue"], hint: "Đoạn A: “She places a finger in her mouth, curls her **tongue** against it”. Hình luôn theo một đoạn mô tả liền có nhiều danh từ bộ phận — ở đây là câu thứ hai của đoạn A." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Chấm và chẩn đoán — sai câu nào ⇒ ôn dạng nào" },
      {
        t: "table",
        head: ["Câu sai", "Dạng", "Lỗi thường gặp ở câu này", "Ôn"],
        rows: [
          ["1", "R01", "Viết “the rhythm” (thừa the) hoặc “rhythm of speech” làm câu thừa chữ", "Tập 5 Ngày 7 mục chép đúng hình thức"],
          ["2", "R02", "Dò theo thứ tự câu trong bài thay vì theo mốc thời gian", "Tập 4 Ngày 17"],
          ["3", "R03", "Chọn consonants vì đứng gần “pitch”", "Tập 3 Ngày 15 · Tập 5 Ngày 25 (bẫy đứng gần ≠ có quan hệ)"],
          ["4", "R04", "Không gạch tên các ngôn ngữ trước, đọc lại cả bài", "Tập 5 Ngày 15"],
          ["5", "R05", "best documented → first (đổi nghĩa từ cực đoan)", "Tập 5 Ngày 3"],
          ["6", "R06", "Chọn distance vì cùng chủ đề", "Tập 3 Ngày 9"],
          ["7–8", "R07 · R08", "Đọc sai đoạn; viết số nhiều “ears” trong khi có each", "Tập 3 Ngày 27 · Tập 4 Ngày 11"],
          ["9", "R09", "Viết “phone” thiếu thông tin hoặc chép cả cụm 5 từ", "Tập 5 Ngày 7"],
          ["10–11", "R10 · R11", "Chọn phương án nghe hợp lý thay vì có bằng chứng", "Tập 4 Ngày 9"],
          ["12", "R12", "Chọn heading theo một chi tiết (khoảng cách)", "Tập 5 Ngày 5 · 9"],
          ["13", "R13", "Làm câu này đầu tiên, đọc lại cả bài", "Tập 4 Ngày 21"],
          ["14", "R14", "Ghép theo ngữ pháp, không theo nghĩa", "Tập 4 Ngày 15"],
          ["15", "R15", "Không nhận ra tác giả cố ý không trả lời", "Tập 5 Ngày 9"],
          ["16", "R16", "Không tìm đoạn mô tả bộ phận", "Tập 4 Ngày 17"],
        ],
      },
      {
        t: "note", title: "📌 Mốc của bạn trước Đề 12",
        items: [
          "**15–16/16 trong 22 phút:** Passage 3 ở mức band 8. Ngày mai làm Reading Đề 12 theo đúng 17–20–23.",
          "**13–14/16:** ghi hai dạng sai vào thẻ “nhìn trước khi đọc” — đặt ngay cạnh màn hình khi làm Đề 12.",
          "**≤ 12/16 hoặc quá 25 phút:** ôn lại Tập 5 Ngày 21 (đọc một lượt, không quay lại) trước Đề 12; dạng sai ⇒ đúng Ngày ở bảng trên.",
        ],
      },
    ],
  },

  /* ════════════════ BÀI 3 — LISTENING: CHECKLIST 14 DẠNG ════════════════ */
  {
    id: "t5d29-nghe",
    kind: "listening",
    title: "Nghe: Checklist 14 dạng Listening — mỗi dạng một câu cần nhớ, bốn bài nghe mới tốc độ thật (15 câu phủ đủ 14 dạng), luật chép đáp án thi giấy và thi máy",
    goal: "Nhớ được cho từng dạng trong 14 dạng Listening MỘT việc phải làm trong 30 giây đọc trước, nghe bốn bài mới ở tốc độ thật với giọng Canada, Úc, New Zealand, Anh, Mỹ, Ireland và trả lời đủ 15 câu thuộc 14 dạng, rồi chép đáp án không mất điểm oan về chính tả, số nhiều hay giới hạn từ.",
    minutes: 75,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "Gom **14 dạng câu hỏi Listening** thành 14 câu hành động — làm ngay trong 30 giây đọc trước mỗi phần.",
          "Bốn bài nghe mới, mỗi bài một Part: Part 1 đặt gian hàng ở hội chợ việc làm (Canada + Úc) · Part 2 ngày mở cửa trung tâm cứu hộ động vật (New Zealand) · Part 3 bàn đồ án dữ liệu (Anh + Mỹ + Ireland) · Part 4 bài giảng về bơm va thuỷ lực (Úc).",
          "**15 câu phủ đủ 14 dạng.** Nghe MỘT lần — như ngày mai ở Đề 12.",
          "Mục cuối: luật chép đáp án — chính tả, số nhiều, gạch nối, số, chữ hoa — khác nhau thế nào giữa thi giấy và thi máy.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Checklist 14 dạng — mỗi dạng MỘT câu" },
      {
        t: "table", caption: "Đọc to. Đây là thứ bạn làm trong 30 giây trước mỗi phần của Đề 12.",
        head: ["#", "Dạng", "Câu cần nhớ", "Hay gặp ở"],
        rows: [
          ["1", "Form completion", "Đoán loại thông tin từng dòng (tên, số, ngày, mã) và chờ ĐÁNH VẦN — chữ cái hay bị nghe nhầm: G/J, A/E/I, M/N, B/V.", "Part 1"],
          ["2", "Note completion", "Heading của ghi chú là thứ tự của bài nói — mất mạch thì chờ heading tiếp theo.", "Part 1 · 4"],
          ["3", "Table completion", "Đọc theo HÀNG hay theo CỘT? Xem ô trống đầu tiên rồi đoán người nói đi theo chiều nào.", "Part 1 · 4"],
          ["4", "Flow-chart completion", "Mũi tên = thứ tự bước; nghe từ chỉ bước (first, once that's done, finally).", "Part 3 · 4"],
          ["5", "Summary completion", "Tóm tắt dùng từ KHÁC bài nói — nghe ý, không chờ cụm y hệt.", "Part 4"],
          ["6", "Sentence completion", "Đáp án phải làm câu đúng ngữ pháp — số nhiều / số ít quyết định chữ cuối.", "Part 2 · 4"],
          ["7", "Short-answer questions", "Từ để hỏi quyết định loại đáp án; không lặp từ đã có trong câu hỏi.", "Part 1 · 2"],
          ["8", "Multiple choice (1 đáp án)", "Cả ba phương án thường được NHẮC tới — đáp án là cái được xác nhận cuối cùng.", "Part 2 · 3"],
          ["9", "Multiple choice (chọn hai)", "Hai đáp án có thể tới theo bất kỳ thứ tự nào; gạch từng phương án bị loại ngay khi nghe.", "Part 2 · 3"],
          ["10", "Matching (người – ý kiến)", "Nhớ GIỌNG của từng người trong 10 giây đầu; ý kiến thường đến sau “I'm not sure about…” / “What worries me…”.", "Part 3"],
          ["11", "Matching (phân loại A / B / C)", "Ba nhóm cố định (ví dụ: tình nguyện viên / nhân viên / cả hai) — nghe từ chỉ ai làm (only, both, we leave that to).", "Part 2 · 3"],
          ["12", "Map labelling", "Xác định điểm đứng + hướng bắc trước; mỗi câu chỉ đường bắt đầu từ chỗ người nói ĐANG đứng.", "Part 2"],
          ["13", "Plan labelling (sơ đồ tầng)", "Đánh dấu cửa vào, cầu thang / hành lang; nghe từ vị trí trong nhà (at the far end, opposite, through the double doors).", "Part 2"],
          ["14", "Diagram labelling (máy, thiết bị)", "Nhìn các bộ phận được nối với nhau thế nào — bài nói đi theo DÒNG CHẢY (nước, khí, điện) qua máy.", "Part 4"],
        ],
      },
      { t: "rule", formula: "30 giây đọc trước = đoán loại từ + đánh dấu từ khoá + nhìn trước câu kế tiếp", vi: "Dạng nào cũng vậy; 14 câu trên chỉ là việc RIÊNG thêm vào cho từng dạng." },

      /* ── 2 ── */
      { t: "h", text: "2. Part 1 — đặt gian hàng ở hội chợ việc làm (Questions 1–4: form · table · short answer · MCQ)" },
      {
        t: "table", caption: "Questions 1–2 — Complete the form and the table. Write ONE WORD AND/OR A NUMBER.",
        head: ["Careers Fair — exhibitor booking", ""],
        rows: [
          ["Company", "Northgate Analytics"],
          ["Contact name", "Tom **1** ______"],
          ["Stand: standard (2 m)", "£180"],
          ["Stand: large (3 m)", "£ **2** ______"],
        ],
      },
      {
        t: "listen", id: "t5d29-nghe-p1", title: "Booking a stand at a careers fair",
        dan: { so: "Day 29, Recording 1", boiCanh: "a careers adviser at a university talking to a company manager who wants to book a stand.", cau: [1, 4] },
        lines: [
          { who: "Adviser", voice: "ca-nu", text: "Careers office, Priya speaking. How can I help?" },
          { who: "Tom", voice: "au-nam", text: "Hi, I'm calling from Northgate Analytics — we're a small data company — about the careers fair in March. We'd like a stand, if there's still room." },
          { who: "Adviser", voice: "ca-nu", text: "There is, yes. Can I take a contact name first?" },
          { who: "Tom", voice: "au-nam", text: "Sure, it's Tom Quayle. That's Q-U-A-Y-L-E." },
          { who: "Adviser", voice: "ca-nu", text: "Q-U-A-Y-L-E. Lovely. Now, we've two sizes of stand. The standard one is two metres wide and that's a hundred and eighty pounds. The large one's three metres, and that's two hundred and forty — oh, hang on, sorry, that's last year's price list. It's two hundred and sixty this year." },
          { who: "Tom", voice: "au-nam", text: "Two-sixty. We'll go with the large one, I think — we're bringing a couple of screens for demos." },
          { who: "Adviser", voice: "ca-nu", text: "Fine. Then the one thing we'll need from you before Friday is your logo, so it can go in the printed guide. The company description we can take any time up to the week before." },
          { who: "Tom", voice: "au-nam", text: "Logo by Friday, got it. And where would we be? Somewhere near the main entrance would be ideal." },
          { who: "Adviser", voice: "ca-nu", text: "I'm afraid the entrance spots went in the first week. I can put you beside the café, which gets a lot of passing traffic." },
          { who: "Tom", voice: "au-nam", text: "Hmm. Is there anything by the lecture theatre? The students we want are mostly coming straight out of computing lectures." },
          { who: "Adviser", voice: "ca-nu", text: "Let me look… yes, there's one large space left right next to the lecture theatre doors." },
          { who: "Tom", voice: "au-nam", text: "Then that's the one. Much better for us than the café." },
        ],
      },
      {
        t: "quiz", id: "t5d29-nghe-p1-dien", kind: "fill", title: "Questions 1–3",
        items: [
          { q: "1. [Form] Contact name: Tom ______", answers: ["Quayle"], hint: "Đánh vần Q-U-A-Y-L-E. Chữ Q /kjuː/ — đừng ghi K; A-Y nghe liền dễ thành “Quail”." },
          { q: "2. [Table] Stand: large (3 m) — £ ______", answers: ["260"], hint: "Bẫy sửa giá: “two hundred and forty — oh, hang on… that's last year's… It's two hundred and sixty this year”. Đáp án là bản CUỐI." },
          { q: "3. [Short answer] What must the company send before Friday? (ONE WORD)", answers: ["logo", "its logo", "their logo", "a logo"], hint: "“the one thing we'll need from you before Friday is your **logo**”. Company description: hạn khác (tuần trước hội chợ) — bẫy cùng nhóm." },
        ],
      },
      {
        t: "mcq", id: "t5d29-nghe-p1-chon", title: "Question 4 — Choose the correct letter, A, B or C",
        items: [
          { q: "4. Where will Northgate Analytics' stand be?", options: ["A  near the main entrance", "B  beside the café", "C  next to the lecture theatre"], correct: 2, why: "A đã hết chỗ; B được đề nghị rồi bị từ chối; “there's one large space left right next to the lecture theatre doors… Then that's the one”. Cả ba phương án đều được nhắc — đáp án là cái được XÁC NHẬN." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Part 2 — ngày mở cửa trung tâm cứu hộ động vật hoang dã (Questions 5–7: map · plan · phân loại)" },
      {
        t: "figure",
        fig: {
          kind: "map", title: "Harrowfield Wildlife Rescue — site map (Question 5)",
          note: "Bản đồ tự đặt cho bài luyện (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 12, rows: 8,
            paths: [
              { x: 0, y: 3.6, w: 12, h: 0.8, label: "Main track" },
            ],
            boxes: [
              { x: 0.5, y: 0.8, w: 2.6, h: 2.2, label: "Car park" },
              { x: 3.6, y: 0.8, w: 2.4, h: 2.2, blank: "A" },
              { x: 6.6, y: 0.8, w: 2.4, h: 2.2, blank: "B" },
              { x: 9.4, y: 0.8, w: 2.2, h: 2.2, label: "Pond" },
              { x: 0.5, y: 5, w: 2.6, h: 2.2, label: "Visitor hut" },
              { x: 3.6, y: 5, w: 2.4, h: 2.2, label: "Treatment building" },
              { x: 6.6, y: 5, w: 2.4, h: 2.2, blank: "C" },
              { x: 9.4, y: 5, w: 2.2, h: 2.2, blank: "D" },
            ],
            pins: [{ x: 1.8, y: 4, label: "You are here" }],
          },
        },
      },
      {
        t: "figure",
        fig: {
          kind: "map", title: "Treatment building — floor plan (Question 6)",
          note: "Sơ đồ tầng tự đặt cho bài luyện. Cửa vào ở phía nam (dưới).",
          map: {
            cols: 10, rows: 7,
            paths: [
              { x: 4.3, y: 0, w: 1.4, h: 7, label: "Corridor" },
            ],
            boxes: [
              { x: 0.4, y: 0.4, w: 3.6, h: 1.8, label: "Isolation unit" },
              { x: 6, y: 0.4, w: 3.6, h: 1.8, blank: "E" },
              { x: 0.4, y: 2.6, w: 3.6, h: 1.8, blank: "F" },
              { x: 6, y: 2.6, w: 3.6, h: 1.8, label: "Laundry" },
              { x: 0.4, y: 4.8, w: 3.6, h: 1.8, label: "Office" },
              { x: 6, y: 4.8, w: 3.6, h: 1.8, blank: "G" },
            ],
            pins: [{ x: 5, y: 6.8, label: "Entrance" }],
          },
        },
      },
      {
        t: "listen", id: "t5d29-nghe-p2", title: "An open day at a wildlife rescue centre",
        dan: { so: "Day 29, Recording 2", boiCanh: "the volunteer coordinator at a wildlife rescue centre talking to people who are thinking of volunteering.", cau: [5, 7] },
        lines: [
          { who: "Coordinator", voice: "nz-nu", text: "Morning, everyone, and thanks for coming out in this weather. We're standing just outside the visitor hut, on the main track. Car park's behind you to the north, and the treatment building's the one right beside us, on this side of the track." },
          { who: "Coordinator", voice: "nz-nu", text: "Now, a lot of people ask to see the aviary first, because that's where the owls are. You might expect it to be next to the car park, which is where it was until last spring, but the noise of the cars was stressing the birds, so we moved it. It's now on the far side of the track, between the old aviary site and the pond — the one right next to the pond, in fact." },
          { who: "Coordinator", voice: "nz-nu", text: "Inside the treatment building — we'll go in shortly — you come in at the south end, into a long corridor. The office is the first door on your left. Keep going and the food preparation room is the next one on the left, so it's between the office and the isolation unit. Please don't confuse it with the room opposite, which is where we wash bowls and bedding; that one's the laundry. And the room at the far end on the right is the vet's room, which volunteers don't go into at all." },
          { who: "Coordinator", voice: "nz-nu", text: "Which brings me to who does what. Feeding is done by everybody — staff and volunteers together, it's simply too big a job otherwise. Cleaning the enclosures is volunteer work. But releasing an animal back into the wild is something only our staff do, because there's a licence involved and a record we're legally required to keep." },
        ],
      },
      {
        t: "quiz", id: "t5d29-nghe-p2-dien", kind: "fill", title: "Questions 5–6 — gõ chữ cái",
        items: [
          { q: "5. [Map] Aviary (A–D)", answers: ["B"], hint: "“on the far side of the track… the one right next to the pond” ⇒ B (phía bắc đường, sát Pond). A = chỗ aviary CŨ (bẫy thời gian “until last spring”)." },
          { q: "6. [Plan] Food preparation room (E–G)", answers: ["F"], hint: "Vào từ nam: Office cửa đầu bên trái; “the next one on the left… between the office and the isolation unit” ⇒ F. Bên phải đối diện = Laundry. E = vet's room (“far end on the right”)." },
        ],
      },
      {
        t: "mcq", id: "t5d29-nghe-p2-phan-loai", title: "Question 7 — Classification: Who does this task? A volunteers only · B staff only · C both",
        items: [
          { q: "7. releasing animals back into the wild", options: ["A  volunteers only", "B  staff only", "C  both staff and volunteers"], correct: 1, why: "“releasing an animal back into the wild is something **only our staff** do”. Feeding = C (both); cleaning = A — hai việc còn lại là bẫy cùng nhóm." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Part 3 — ba người bàn đồ án trực quan hoá dữ liệu (Questions 8–10: matching · chọn hai · flow-chart)" },
      {
        t: "listen", id: "t5d29-nghe-p3", title: "A data visualisation project",
        dan: { so: "Day 29, Recording 3", boiCanh: "two students, Maya and Leo, discussing their project with their tutor.", cau: [8, 10] },
        lines: [
          { who: "Tutor", voice: "ie-nu", text: "So you're using the city's open data on bus punctuality. Talk me through the charts you're considering." },
          { who: "Maya", voice: "uk-nu", text: "We had three ideas. A line chart of average delay by month, a heat map of delays by route and hour, and a simple bar chart ranking the routes." },
          { who: "Leo", voice: "us-nam", text: "I was keen on the heat map at first, but honestly, I think it'll lose people. Our audience is councillors, not analysts, and a grid of two hundred coloured squares is a lot to ask of someone in a five-minute meeting." },
          { who: "Tutor", voice: "ie-nu", text: "That's a fair point about the audience. Though I wouldn't drop it entirely — put it in the appendix for anyone who wants detail." },
          { who: "Maya", voice: "uk-nu", text: "OK. So what changes are we making? I'd say we definitely label the axes in minutes rather than as a percentage of the timetable — the percentages confused everyone in the pilot." },
          { who: "Leo", voice: "us-nam", text: "Agreed. And I'd add the number of journeys under each bar, so people can see which routes have hardly any data. I don't think we need to change the colours, though; the pilot group were fine with them." },
          { who: "Tutor", voice: "ie-nu", text: "And the process? Last time your data cleaning was the weak point." },
          { who: "Maya", voice: "uk-nu", text: "Right. So first we download the raw records, then we remove the duplicates — there are thousands where a bus was logged twice at the same stop — and only after that do we calculate the averages. Then we build the prototype and test it with five councillors." },
        ],
      },
      {
        t: "mcq", id: "t5d29-nghe-p3-chon", title: "Question 8 — Matching (người – ý kiến)",
        items: [
          { q: "8. What is Leo's opinion of the heat map?", options: ["A  It should go in the appendix.", "B  It is too demanding for the intended audience.", "C  It shows the data most accurately."], correct: 1, why: "Leo: “I think it'll lose people. Our audience is councillors, not analysts… a lot to ask” = too demanding for the audience. A là ý của TUTOR — bẫy người nói." },
        ],
      },
      {
        t: "quiz", id: "t5d29-nghe-p3-dien", kind: "fill", title: "Questions 9–10",
        items: [
          { q: "9. [Choose TWO] Which TWO changes will the students make? A label axes in minutes · B change the colours · C remove the line chart · D show the number of journeys · E shorten the presentation (gõ hai chữ cái)", answers: ["A, D", "A,D", "AD", "D, A", "D,A", "DA", "A D", "D A"], hint: "Maya: “label the axes in minutes” (A) · Leo: “add the number of journeys under each bar” (D). B bị bác: “I don't think we need to change the colours”." },
          { q: "10. [Flow-chart] download raw records → remove ______ → calculate averages → build prototype → test with five councillors (ONE WORD)", answers: ["duplicates"], hint: "“then we remove the **duplicates**… and only after that do we calculate the averages”. Số nhiều — “thousands” trong bài." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Part 4 — bài giảng: bơm va thuỷ lực (Questions 11–15: note · summary · sentence · diagram)" },
      {
        t: "table", caption: "Questions 14–15 — Diagram: a hydraulic ram pump (hình mô tả bằng chữ — nước đi theo số thứ tự)",
        head: ["Bộ phận", "Việc nó làm"],
        rows: [
          ["① drive pipe", "đưa nước từ nguồn cao xuống, nước tăng tốc"],
          ["② **14** ______ valve", "mở cho nước thoát ra; khi dòng đủ nhanh thì đóng sập lại"],
          ["③ delivery valve", "mở trong khoảnh khắc áp suất tăng vọt"],
          ["④ **15** ______ chamber", "khí bị nén lại, đẩy nước đi đều lên ống ra"],
          ["⑤ delivery pipe", "đưa nước lên cao"],
        ],
      },
      {
        t: "listen", id: "t5d29-nghe-p4", title: "Lecture: the hydraulic ram pump",
        dan: { so: "Day 29, Recording 4", boiCanh: "part of a lecture on low-technology engineering about a pump that needs no fuel.", cau: [11, 15] },
        lines: [
          { who: "Lecturer", voice: "au-nu", text: "Today's device is one I'm rather fond of, because it does something that sounds impossible: it lifts water uphill using nothing but the energy of water flowing downhill. No fuel, no electricity. It's called the hydraulic ram, and the self-acting version dates from the end of the eighteenth century — one of its inventors was a member of the same French family better known for hot-air balloons." },
          { who: "Lecturer", voice: "au-nu", text: "Here's how it works, and I'd like you to follow the water through the diagram. Water from a stream or spring runs down a long drive pipe and picks up speed. At the bottom it escapes through what's called the waste valve. But as the flow gets faster, the force of the moving water pushes that valve shut — suddenly. And when a fast-moving column of water is stopped dead, you get a sharp rise in pressure. You'll have heard the effect in old houses, when a tap's turned off quickly and the pipes bang." },
          { who: "Lecturer", voice: "au-nu", text: "That pressure surge forces a little water through a second valve, the delivery valve, into an air chamber. The air inside gets squeezed, and as it expands again it pushes the water steadily up the delivery pipe — that's the job of the air: to turn a series of violent pulses into a smooth flow. Then the pressure falls, the waste valve drops open, and the whole cycle starts again, dozens of times a minute, day and night." },
          { who: "Lecturer", voice: "au-nu", text: "Now, the catch. Most of the water is wasted — well, not wasted, it simply returns to the stream. As a rough guide, only around a tenth of the water that enters the pump is delivered uphill, although it can be lifted to a height several times greater than the fall that drives it. So the ram suits places with plenty of water but no power: farms, remote villages, a garden on a hill." },
          { who: "Lecturer", voice: "au-nu", text: "In the twentieth century, cheap electric pumps pushed rams out of use almost everywhere. What's brought them back is not nostalgia but reliability. A ram has two moving parts, and a well-made one can run for decades with nothing more than an occasional new rubber seal. For a community that can't afford a technician, that matters more than efficiency." },
        ],
      },
      {
        t: "quiz", id: "t5d29-nghe-p4-dien", kind: "fill", title: "Questions 11–15 — ONE WORD ONLY",
        items: [
          { q: "11. [Note] Energy source: water flowing ______", answers: ["downhill"], hint: "“lifts water uphill using nothing but the energy of water flowing **downhill**”. Bẫy: uphill (là việc bơm LÀM, không phải nguồn năng lượng)." },
          { q: "12. [Summary] Only about a tenth of the water is delivered uphill; the rest goes back to the ______.", answers: ["stream"], hint: "“it simply returns to the **stream**” — goes back = returns. Bài nói “wasted… well, not wasted” — người nói tự sửa." },
          { q: "13. [Sentence] Rams came back into use because of their ______ rather than their efficiency.", answers: ["reliability"], hint: "“What's brought them back is not nostalgia but **reliability**… that matters more than efficiency.” Cần danh từ sau their." },
          { q: "14. [Diagram] ② ______ valve", answers: ["waste"], hint: "“At the bottom it escapes through what's called the **waste** valve.”" },
          { q: "15. [Diagram] ④ ______ chamber", answers: ["air"], hint: "“forces a little water through… the delivery valve, into an **air** chamber”. Đi theo dòng nước: drive pipe → waste valve → delivery valve → air chamber → delivery pipe." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Chép đáp án — mất điểm oan ở đâu (thi giấy vs thi máy)" },
      {
        t: "table",
        head: ["Luật", "Đúng", "Sai (mất điểm)"],
        rows: [
          ["Chính tả phải đúng", "reliability · Wednesday · accommodation", "reliablity · Wensday · accomodation"],
          ["Số nhiều theo ngữ pháp câu", "remove duplicates · each ear", "remove duplicate · each ears"],
          ["Giới hạn từ: “ONE WORD AND/OR A NUMBER”", "260 (ký hiệu £ đã in sẵn) · logo", "the logo (2 từ — vượt giới hạn)"],
          ["Số viết bằng chữ số hay chữ đều được (theo hướng dẫn thông thường)", "15 · fifteen", "fiveteen (sai chính tả chữ số)"],
          ["Chữ hoa", "Viết thường hoặc IN HOA cả bài đều được chấm", "Lo chữ hoa mà quên chính tả"],
          ["Gạch nối, cụm từ ghép", "well-made (một từ có gạch nối thường được tính là một từ)", "tách thành hai từ khi đề cho ONE WORD"],
          ["Thi giấy — 10 phút chép", "Chép theo nhóm 10 câu, đối số dòng mỗi 5 câu", "Chép lệch dòng từ câu 13"],
          ["Thi máy — 2 phút soát", "Soát ô trống → số nhiều → chính tả tên riêng", "Đổi đáp án vì “nghe lại trong đầu”"],
        ],
      },
      { t: "rule", formula: "đáp án đúng = đúng nghĩa + đúng chính tả + đúng số nhiều + đúng giới hạn từ", vi: "Thiếu một trong bốn là mất điểm — dù bạn đã nghe ra đáp án." },
      {
        t: "note", title: "📌 Sau bài — điền vào sổ trước Đề 12",
        items: [
          "Đếm câu sai theo DẠNG (cột “Dạng” ở mục 1). Hai dạng sai nhiều nhất ⇒ ghi lên thẻ “30 giây đọc trước”.",
          "Sai câu 2, 4, 7 (bẫy sửa lại, bẫy cùng nhóm) ⇒ ôn Tập 5 Ngày 24 · 25 (đáp án là bản CUỐI được xác nhận).",
          "Sai câu 5–6 (map, plan) ⇒ ôn Tập 4 Ngày 6 · Tập 5 Ngày 24 (bẫy thời gian: vị trí CŨ).",
          "Sai câu 11–15 ⇒ ôn Tập 5 Ngày 5 · 12 · 20 (bài giảng dài, theo dòng chảy của sơ đồ).",
        ],
      },
    ],
  },

  /* ════════════════ BÀI TẬP NGÀY 29 ════════════════ */
  {
    id: "t5d29-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 29 — ngày thi, phúc khảo, One Skill Retake · câu hỏi gián tiếp · câu mua giờ · câu kéo về đề · nhận dạng 16 dạng Reading · chép đáp án Listening",
    goal: "Tự kiểm tra rằng bạn nắm chắc quy trình ngày thi và sau ngày thi, nói và viết đúng ba mẫu câu của phòng thi, nhận ra dạng câu Reading chỉ bằng một dòng hướng dẫn, và chép đáp án Listening không mất điểm oan — 40 câu có đáp án + một kịch bản ngày thi của riêng bạn.",
    minutes: 60,
    blocks: [
      {
        t: "recap", title: "Bài tập gồm",
        items: [
          "A. Ngày thi & sau ngày thi — 10 câu chọn.",
          "B. Câu hỏi gián tiếp — 6 câu sửa lỗi.",
          "C. Dịch Việt → Anh (mua giờ · kéo về đề) — 6 câu.",
          "D. Nhận dạng Reading từ dòng hướng dẫn — 8 câu.",
          "E. Chép đáp án Listening — đúng hay sai — 10 câu.",
          "F. Viết kịch bản ngày thi của bạn (không chấm máy).",
        ],
      },
      { t: "h", text: "A. Ngày thi và sau ngày thi (10 câu)" },
      {
        t: "mcq", id: "t5d29-bt-ngay-thi", title: "Chọn đáp án đúng",
        items: [
          { q: "1. Bạn đăng ký bằng hộ chiếu. Sáng ngày thi bạn nên mang:", options: ["Căn cước công dân", "Hộ chiếu bản gốc", "Bản photo hộ chiếu có công chứng"], correct: 1, why: "Giấy tờ BẢN GỐC, đúng loại đã khai khi đăng ký." },
          { q: "2. Giữa Listening, Reading và Writing có:", options: ["15 phút nghỉ", "Không có giờ nghỉ", "Nghỉ tuỳ điểm thi"], correct: 1, why: "Ba phần liền một mạch." },
          { q: "3. Đồng hồ đeo tay trong phòng thi:", options: ["Được đeo nếu là đồng hồ thường", "Thường phải gửi cùng đồ cá nhân", "Chỉ cấm đồng hồ thông minh"], correct: 1, why: "Thường không được mang vào; có đồng hồ treo / trên màn hình." },
          { q: "4. Thi máy — Listening có:", options: ["10 phút chép đáp án", "Khoảng 2 phút soát cuối", "Không có thời gian nào sau bài nghe"], correct: 1, why: "Đáp án gõ trong lúc nghe; khoảng 2 phút soát." },
          { q: "5. L 7.5 · R 8.0 · W 7.0 · S 7.0 ⇒ band tổng:", options: ["7.0", "7.5", "8.0"], correct: 1, why: "29.5 ÷ 4 = 7.375 ⇒ 7.5." },
          { q: "6. Hạn đăng ký One Skill Retake (theo quy định thường gặp):", options: ["6 tuần", "60 ngày", "2 năm"], correct: 1, why: "60 ngày kể từ ngày thi gốc. 6 tuần là hạn phúc khảo." },
          { q: "7. Phúc khảo Writing — người chấm lại:", options: ["Biết điểm cũ để so", "Là giám khảo khác, không biết điểm cũ", "Là chính giám khảo cũ"], correct: 1, why: "Chấm lại độc lập." },
          { q: "8. Kết quả One Skill Retake:", options: ["Thay hẳn phiếu cũ", "Là phiếu mới; phiếu cũ vẫn còn, bạn chọn phiếu để nộp", "Chỉ có giá trị 6 tháng"], correct: 1, why: "Hai phiếu cùng tồn tại." },
          { q: "9. Đề Reading hôm thi khó hơn mọi đề luyện. Điều nên nhớ:", options: ["Mình đã hỏng, nên bỏ qua Writing", "Bảng quy đổi điểm tính cả độ khó của đề", "Nên xin đổi đề"], correct: 1, why: "Đề khó là khó với mọi người; điểm thô → band được hiệu chỉnh." },
          { q: "10. Quy định về phí phúc khảo và số ngày trả kết quả — nguồn đúng nhất là:", options: ["Bài học này", "Trang của IDP / British Council và thư xác nhận của bạn", "Nhóm học trên mạng xã hội"], correct: 1, why: "Quy định thay đổi theo nước và theo năm." },
        ],
      },
      { t: "h", text: "B. Câu hỏi gián tiếp — viết lại câu cho đúng (6 câu)" },
      {
        t: "quiz", id: "t5d29-bt-gian-tiep", kind: "fill", title: "Gõ lại cả câu đúng",
        items: [
          { q: "1. Could you tell me where is the waiting room?", answers: ["Could you tell me where the waiting room is?"], hint: "where + S + is" },
          { q: "2. Do you know when does the Speaking test begin?", answers: ["Do you know when the Speaking test begins?", "Do you know when the speaking test begins?"], hint: "bỏ does, chia begins" },
          { q: "3. I was wondering can I leave my bag here.", answers: ["I was wondering if I could leave my bag here.", "I was wondering whether I could leave my bag here."], hint: "if / whether + I could" },
          { q: "4. Can you tell me how long will the results take?", answers: ["Can you tell me how long the results will take?", "Could you tell me how long the results will take?"], hint: "how long + S + will + V" },
          { q: "5. Would you mind to repeat the question?", answers: ["Would you mind repeating the question?"], hint: "mind + V-ing" },
          { q: "6. Do you know which room should I go to?", answers: ["Do you know which room I should go to?"], hint: "which room + S + should + V" },
        ],
      },
      { t: "h", text: "C. Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz", id: "t5d29-bt-dich", kind: "translate", grammar: "câu mua giờ có rào đón · câu kéo về đề · câu hỏi gián tiếp",
        title: "Dịch sang tiếng Anh",
        items: [
          { q: "Tôi chưa nghĩ nhiều về chuyện đó, nhưng tôi đoán là người trẻ ít đọc báo giấy hơn.", answers: ["That's not something I've given much thought to, but I suppose young people read fewer printed newspapers.", "That's not something I've given much thought to, but I suppose young people read printed newspapers less.", "I haven't given it much thought, but I suppose young people read fewer print newspapers.", "That's not something I've really thought about, but I suppose young people read fewer newspapers on paper."], hint: "That's not something I've given much thought to, but I suppose…" },
          { q: "Khó mà nói chung được, nhưng tôi nghĩ các nước giàu sẽ chịu ảnh hưởng ít hơn.", answers: ["It's hard to generalise, but I'd imagine richer countries would be less affected.", "It's hard to generalise, but I'd imagine wealthier countries would be affected less.", "It's difficult to generalise, but I'd imagine richer countries would be less affected.", "It's hard to generalize, but I'd imagine richer countries would be less affected."], hint: "I'd imagine + S + would…" },
          { q: "Điều này có nghĩa với người cao tuổi là họ có thể bị bỏ lại phía sau.", answers: ["What this means for older people is that they may be left behind.", "What this means for the elderly is that they may be left behind.", "What this means for older people is that they could be left behind.", "What this means for elderly people is that they might be left behind."], hint: "What this means for + N + is that…" },
          { q: "Chính vì lý do này mà tôi phản đối đề xuất đó.", answers: ["It is for this reason that I oppose the proposal.", "It is for this reason that I am against the proposal.", "It's for this reason that I oppose that proposal.", "It is for this reason that I disagree with the proposal."], hint: "It is for this reason that…" },
          { q: "Anh có thể cho tôi biết tôi phải đợi ở đâu không?", answers: ["Could you tell me where I should wait?", "Could you tell me where I have to wait?", "Can you tell me where I should wait?", "Could you tell me where I need to wait?"], hint: "where + S + should + V" },
          { q: "Xin lỗi, tôi nghĩ tôi đã trả lời một câu hỏi hơi khác. Ý tôi muốn nói là…", answers: ["Sorry, I think I've answered a slightly different question. What I meant to say is…", "Sorry, I think I've answered a slightly different question. What I meant to say is", "Sorry, I think I answered a slightly different question. What I meant to say is…", "Sorry, I think I've answered a slightly different question. What I wanted to say is…"], hint: "I think I've answered… · What I meant to say is…" },
        ],
      },
      { t: "h", text: "D. Nhận dạng Reading — đọc dòng hướng dẫn, gõ mã R01–R16 (8 câu)" },
      {
        t: "quiz", id: "t5d29-bt-nhan-dang", kind: "fill", title: "Gõ mã dạng (vd R05)",
        items: [
          { q: "1. “Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.”", answers: ["R15"], hint: "claims of the writer ⇒ YNNG." },
          { q: "2. “Reading Passage 2 has seven paragraphs, A–G. Which paragraph contains the following information?”", answers: ["R13"], hint: "Which paragraph contains… ⇒ matching information." },
          { q: "3. “Choose the correct heading for each paragraph from the list of headings below.”", answers: ["R12"], hint: "list of headings ⇒ R12." },
          { q: "4. “Complete each sentence with the correct ending, A–F, below.”", answers: ["R14"], hint: "correct ending ⇒ sentence endings." },
          { q: "5. “Complete the summary using the list of words, A–I, below.”", answers: ["R06"], hint: "list of words ⇒ word box." },
          { q: "6. “Look at the following people (Questions 20–24) and the list of statements below. Match each statement with the correct person.”", answers: ["R04"], hint: "match… with the correct person ⇒ matching features." },
          { q: "7. “Answer the questions below. Choose NO MORE THAN THREE WORDS from the passage for each answer.”", answers: ["R09"], hint: "Answer the questions ⇒ short answer." },
          { q: "8. “Which TWO of the following statements are made by the writer?”", answers: ["R11"], hint: "Which TWO ⇒ MCQ nhiều đáp án." },
        ],
      },
      { t: "h", text: "E. Chép đáp án Listening — đúng hay sai (10 câu)" },
      {
        t: "mcq", id: "t5d29-bt-chep", title: "Đáp án sau có được chấm đúng không?",
        items: [
          { q: "1. Đề: ONE WORD ONLY. Câu: “remove the ______”. Bài nói: “remove the duplicates”. Bạn ghi: duplicate", options: ["Đúng", "Sai"], correct: 1, why: "Thiếu -s: bài nói số nhiều." },
          { q: "2. Đề: ONE WORD AND/OR A NUMBER. Ô: “£ ______”. Bạn ghi: 260", options: ["Đúng", "Sai"], correct: 0, why: "£ đã in sẵn; 260 là một số." },
          { q: "3. Đề: ONE WORD ONLY. Bạn ghi: the logo", options: ["Đúng", "Sai"], correct: 1, why: "Hai từ — vượt giới hạn." },
          { q: "4. Đề: ONE WORD ONLY. Bài nói: “Wednesday”. Bạn ghi: WEDNESDAY", options: ["Đúng", "Sai"], correct: 0, why: "IN HOA cả từ vẫn được chấm, miễn đúng chính tả." },
          { q: "5. Bạn ghi: accomodation", options: ["Đúng", "Sai"], correct: 1, why: "Sai chính tả: accommodation (hai c, hai m)." },
          { q: "6. Đề: NO MORE THAN TWO WORDS AND/OR A NUMBER. Bạn ghi: 3 metres", options: ["Đúng", "Sai"], correct: 0, why: "Một số + một từ." },
          { q: "7. Bài nói: “fifteen”. Bạn ghi: 15", options: ["Đúng", "Sai"], correct: 0, why: "Chữ số hay chữ đều được." },
          { q: "8. Đánh vần: “Q-U-A-Y-L-E”. Bạn ghi: Quail", options: ["Đúng", "Sai"], correct: 1, why: "Tên đánh vần phải chép đúng từng chữ." },
          { q: "9. Thi giấy: bạn chép câu 13 vào ô 14, câu 14 vào ô 15… Kết quả:", options: ["Giám khảo tự dời lại cho bạn", "Các câu đó bị chấm sai"], correct: 1, why: "Phiếu chấm theo ô — đối số dòng mỗi 5 câu." },
          { q: "10. Đề: ONE WORD ONLY. Bài nói: “a well-made pump”. Bạn ghi: well-made", options: ["Đúng", "Sai"], correct: 0, why: "Từ ghép có gạch nối thường được tính là một từ." },
        ],
      },
      { t: "h", text: "F. Viết — kịch bản ngày thi của BẠN" },
      { t: "p", text: "Viết (tiếng Việt hoặc tiếng Anh) một kịch bản 12–15 dòng cho ngày thi thật của bạn: giờ thức, ăn gì, đi đường nào, giấy tờ nào, câu hỏi gián tiếp bạn sẽ hỏi ở quầy, câu mua giờ bạn sẽ dùng trong Part 3, việc bạn làm ngay khi lỡ một câu Listening, câu kéo về đề bạn sẽ dùng nếu viết lạc. Dán kịch bản cạnh bàn học — ngày mai làm Đề 12 theo đúng kịch bản này." },
    ],
  },
];
