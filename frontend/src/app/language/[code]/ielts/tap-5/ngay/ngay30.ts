/**
 * IELTS Tập 5 — Ngày 30 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, kịch bản nghe, bài đọc, câu bài tập VIẾT MỚI)
 * 🏁 NGÀY CUỐI CỦA CẢ LỘ TRÌNH 0 → 8.0 · 🖥️ ĐỀ 12 “FINAL” (band 8.0) · ✅ KIỂM TRA CHẶNG 5 (Ngày 25–30).
 * Khuôn N mod 4 = 2 ⇒ vocab · writing · SPEAKING · homework · review (docs/ielts-lo-trinh-0-8.md mục 3.5 hàng 30).
 *   Bài 1 (vocab)     Tổng kết từ vựng: “nhớ sau 7 ngày ≥ 90 %” — KHÔNG thêm từ mới: đo bốn mức nhớ (nhận ra · nhớ ra · ghép đúng cụm
 *                     · dùng đúng sắc thái) trên 42 câu lấy từ các khối vocab Tập 5 Ngày 2–22 (đều học cách hôm nay ≥ 7 ngày); bảng 24
 *                     từ / cụm hay quên nhất kèm bẫy; công thức tính tỉ lệ nhớ; lịch ôn cách quãng sau khoá.        [VA5 VB VC VD]
 *   Bài 2 (writing)   Đề 12 “Final” — hướng dẫn làm CẢ BUỔI THI ở Online Test theo đúng thứ tự ngày thi thật (Listening → Reading →
 *                     Writing → Speaking), chỉ nêu DẠNG câu, KHÔNG chép đề, không lộ đề tài; phân giờ + checklist trước / sau. Rồi VIẾT
 *                     LẠI BÀI YẾU NHẤT + TỰ CHẤM [W19]: chọn bài, quy trình 45 phút, mẫu band 7 → band 8 đặt cạnh nhau (đề luyện mới:
 *                     người trẻ ở với bố mẹ khi học / mới đi làm — To what extent) + bảng 4 tiêu chí, phiếu tự chấm 12 dòng.
 *                     — nối Tập 4 Ngày 30 (viết lại ở band 7) · Tập 5 Ngày 2 (band 8 trông thế nào) · 4 · 14 · 23 · 25 · 29.
 *   Bài 3 (speaking)  Giám khảo AI 14 phút lần cuối [S17]: dấu hiệu band 8 theo 4 tiêu chí, khởi động (Part 1 Keys · The night sky;
 *                     Part 2 “unexpected good news”; Part 3), mẫu band 7 và band 8 cạnh nhau, rồi Speaking Đề 12 ở chế độ thi thật;
 *                     đọc phản hồi, so Đề 9 → 12; 🔊 đọc liền một câu trả lời band 8.
 *                     — nối Tập 4 Ngày 30 (phòng nói AI lần đầu) · Tập 5 Ngày 2 · 22 · 27 · 29.
 *   Bài tập Ngày 30   34 câu có đáp án + một trang “kế hoạch sau khoá”.
 *   Kiểm tra chặng 5  `t5d30-kiem-tra` — 8 phần gom Ngày 25–30, mọi câu MỚI (bài đọc ~390 từ về lịch sử gây mê; hai bài nghe; Task 1
 *                     bảng tự đặt; Task 2 Two-part); cuối bài: TỔNG KẾT CẢ LỘ TRÌNH 5 TẬP + cách tự ôn sau khoá + kế hoạch 4 tuần trước
 *                     ngày thi thật. Không có khối phatam (đã có ở Bài 3).
 * Đã grep tap-3…5/ngay + thi-may/de: anaesthe, chloroform, earworm, “stuck in your head”, housemate, adult education, “return to study”
 * = 0 kết quả. Ngày 27–28 có thể đang được soạn song song: chỉ nối theo tiêu đề (Ngày 27 ôn tổng 44 điểm ngữ pháp · Reading 3 passage
 * lần 3 · Sprint Part 3; Ngày 28 100 từ band 8 phần 2 · Two-part + quản lý thời gian · Listening 40 câu).
 * Dữ kiện có thật trong bài đọc kiểm tra (theo trí nhớ, làm tròn): Davy ghi nhận khí cười giảm đau khoảng năm 1800; Crawford Long dùng
 * ether năm 1842, công bố 1849; Horace Wells biểu diễn thất bại ở Boston 1845; Morton gây mê bằng ether ở Bệnh viện Đa khoa
 * Massachusetts tháng 10/1846, tìm cách giữ bí mật để xin bằng sáng chế; Simpson đưa chloroform vào năm 1847; ca tử vong đầu tiên được
 * ghi nhận khi dùng chloroform xảy ra chỉ vài tháng sau; Nữ hoàng Victoria dùng chloroform khi sinh con năm 1853. Bài giảng “earworm”
 * nêu nghiên cứu dạng “one study suggested”, không tên, không năm. Mọi nhân vật trong bài nghe là hư cấu. Mọi id bắt đầu `t5d30-`.
 */
import type { Lesson } from '../data';

export const NGAY_30: Lesson[] = [
  /* ════════════════ BÀI 1 — TỪ VỰNG: NHỚ SAU 7 NGÀY ════════════════ */
  {
    id: "t5d30-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Tổng kết “nhớ sau 7 ngày ≥ 90 %” — đo bốn mức nhớ trên từ của Tập 5, 24 từ hay quên nhất, và lịch ôn để không quên sau khoá",
    goal: "Đo chính xác bạn còn nhớ bao nhiêu phần trăm từ vựng Tập 5 đã học từ một tuần trước trở lên — không chỉ nhận ra nghĩa mà nhớ ra được từ, ghép đúng cụm, dùng đúng sắc thái — đạt ≥ 90 %, biết rõ những từ nào phải đưa lại vào thẻ ôn, và có lịch ôn cách quãng để giữ vốn từ band 8 sau khi khoá kết thúc.",
    minutes: 70,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "**Không có từ mới hôm nay.** Mục tiêu của Tập 5 là ==nhớ sau 7 ngày ≥ 90 %== — và chỉ đo được bằng cách KHÔNG học thêm.",
          "Bốn vòng kiểm, đi từ dễ tới khó: ① nhận ra nghĩa · ② nhớ ra từ khi đọc định nghĩa · ③ ghép đúng cụm cố định · ④ chọn đúng sắc thái. Mọi từ đều lấy từ khối vocab của Tập 5 Ngày 2–22 — đều đã học từ 7 ngày trở lên.",
          "Tính điểm từng vòng. Vòng ③ và ④ mới là mức band 8: Lexical Resource band 8 không chấm “biết nhiều từ” mà chấm ==dùng từ ít gặp chính xác, đúng cụm, đúng sắc thái==.",
          "Cuối bài: 24 từ / cụm hay quên nhất của Tập 5 (kèm bẫy), và lịch ôn cách quãng 1 – 3 – 7 – 21 – 60 ngày cho thời gian sau khoá.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. “Nhớ sau 7 ngày” đo cái gì — bốn mức nhớ" },
      {
        t: "table", caption: "Mức nào mới tính là “nhớ” ở band 8",
        head: ["Mức", "Bạn làm được", "Đủ cho"],
        rows: [
          ["① Nhận ra", "Thấy từ, nhớ nghĩa (exacerbate → làm trầm trọng thêm)", "Reading, Listening"],
          ["② Nhớ ra", "Có nghĩa, tự bật ra từ — đúng chính tả", "Writing ở band 7"],
          ["③ Ghép đúng cụm", "Biết từ đi với gì: pay lip **service** to, a level playing **field**", "Writing, Speaking band 8 — collocation"],
          ["④ Đúng sắc thái", "Biết khi nào khen, khi nào chê, khi nào trang trọng: thrifty ≠ stingy, renowned ≠ notorious", "LR band 8 — “nhận biết sắc thái nghĩa”"],
        ],
      },
      { t: "rule", formula: "tỉ lệ nhớ = câu đúng KHÔNG nhìn ÷ tổng số câu × 100   ·   chỉ tính từ đã học ≥ 7 ngày", vi: "Đếm từng vòng riêng. Đích: cả bốn vòng ≥ 90 %; vòng ③ và ④ là thước đo thật của band 8." },
      { t: "p", text: "Luật làm bài: **không mở lại ngày cũ, không tra từ điển, không xem gợi ý trước khi nộp.** Nhớ mà phải nhìn thì không tính là nhớ." },

      /* ── 2 ── */
      { t: "h", text: "2. Vòng ① — nhận ra nghĩa (12 câu)" },
      {
        t: "mcq", id: "t5d30-vong-1", title: "Chọn nghĩa đúng",
        items: [
          { q: "1. exacerbate (Ngày 4)", options: ["làm giảm bớt", "làm trầm trọng thêm", "che giấu"], correct: 1, why: "exacerbate = make worse. Ngược nghĩa: alleviate / mitigate." },
          { q: "2. tenuous (Ngày 4) — a tenuous link", options: ["mong manh, yếu", "chặt chẽ", "bí mật"], correct: 0, why: "a tenuous link / connection / argument = mối liên hệ / lập luận yếu, khó chứng minh." },
          { q: "3. propensity (Ngày 4)", options: ["tài sản", "xu hướng, thiên hướng", "sự phản đối"], correct: 1, why: "a propensity to / for = thiên hướng (thường là thói quen không tốt)." },
          { q: "4. recidivism (Ngày 8)", options: ["sự tái phạm", "sự ân xá", "án treo"], correct: 0, why: "recidivism = việc người đã chịu án lại phạm tội; repeat offender = người tái phạm." },
          { q: "5. conflate (Ngày 10)", options: ["tách bạch", "đánh đồng, gộp lẫn hai thứ khác nhau", "phóng đại"], correct: 1, why: "conflate A with B = coi A và B là một — lỗi lập luận hay bị chỉ ra ở Discussion." },
          { q: "6. externality (Ngày 12)", options: ["chi phí / lợi ích rơi vào bên thứ ba", "lợi nhuận ròng", "thuế nhập khẩu"], correct: 0, why: "externality = tác động ngoại ứng (ô nhiễm là ngoại ứng tiêu cực)." },
          { q: "7. hindsight (Ngày 14) — with hindsight", options: ["tầm nhìn xa", "nhìn lại sau khi việc đã xảy ra", "sự hối tiếc"], correct: 1, why: "with (the benefit of) hindsight = khi nhìn lại. foresight mới là “tầm nhìn xa”." },
          { q: "8. a postcode lottery (Ngày 16)", options: ["xổ số theo vùng", "chất lượng dịch vụ phụ thuộc vào nơi bạn sống", "phân bổ ngân sách đều"], correct: 1, why: "Thành ngữ báo chí Anh: dịch vụ công tốt hay dở tuỳ “mã bưu chính”." },
          { q: "9. a red herring (Ngày 18)", options: ["chi tiết đánh lạc hướng", "bằng chứng quyết định", "người mới vào nghề"], correct: 0, why: "a red herring = thứ làm phân tâm khỏi vấn đề chính." },
          { q: "10. a confounding factor (Ngày 20)", options: ["yếu tố gây nhiễu kết quả nghiên cứu", "yếu tố quyết định", "sai số đo lường"], correct: 0, why: "Một biến thứ ba làm hai biến trông như có quan hệ nhân quả." },
          { q: "11. paternalistic (Ngày 22)", options: ["gia trưởng — quyết định thay người khác “vì lợi ích của họ”", "thuộc về cha mẹ", "yêu nước"], correct: 0, why: "a paternalistic policy = chính sách “biết điều gì tốt cho dân” mà không hỏi dân." },
          { q: "12. short-termism (Ngày 2)", options: ["nhiệm kỳ ngắn", "tư duy ngắn hạn", "hợp đồng thời vụ"], correct: 1, why: "short-termism = chỉ chạy theo lợi ích trước mắt (của chính trị, doanh nghiệp)." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Vòng ② — nhớ ra từ khi đọc định nghĩa (12 câu)" },
      {
        t: "quiz", id: "t5d30-vong-2", kind: "fill", title: "Gõ từ (chữ cái đầu cho sẵn)",
        items: [
          { q: "1. careful and detailed examination, especially by an official body: s______ (Ngày 2)", answers: ["scrutiny"], hint: "public scrutiny · come under scrutiny." },
          { q: "2. to reduce or limit something, often something people value: c______ (Ngày 4)", answers: ["curtail"], hint: "curtail freedom / spending." },
          { q: "3. a situation in which you accept less of one thing to get more of another: t______-o______ (Ngày 4)", answers: ["trade-off", "tradeoff", "trade off"], hint: "a trade-off between speed and accuracy." },
          { q: "4. people or groups affected by a decision: s______ (số nhiều) (Ngày 8)", answers: ["stakeholders"], hint: "consult all stakeholders." },
          { q: "5. not active or growing at the moment, but able to become active later: d______ (Ngày 12)", answers: ["dormant"], hint: "dormant seeds / a dormant volcano." },
          { q: "6. the tendency to notice only evidence that supports what you already believe: c______ bias (Ngày 14)", answers: ["confirmation"], hint: "confirmation bias." },
          { q: "7. money a company gives a team or event in exchange for advertising: s______ (Ngày 14)", answers: ["sponsorship"], hint: "sponsorship deals." },
          { q: "8. able to produce the same results when the experiment is repeated: r______ (Ngày 20)", answers: ["reproducible"], hint: "reproducible results ↔ replication crisis." },
          { q: "9. (of a disease) able to pass from animals to humans: z______ (Ngày 20)", answers: ["zoonotic"], hint: "zoonotic diseases." },
          { q: "10. able to feel pleasure and pain: s______ (Ngày 20)", answers: ["sentient"], hint: "sentient beings." },
          { q: "11. the legal or moral duty to protect someone you are responsible for: a d______ of care (Ngày 22)", answers: ["duty"], hint: "owe someone a duty of care." },
          { q: "12. the period that follows a war, a disaster or another bad event: a______ (Ngày 14)", answers: ["aftermath"], hint: "in the aftermath of the war." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Vòng ③ — ghép đúng cụm cố định (10 câu)" },
      {
        t: "quiz", id: "t5d30-vong-3", kind: "fill", title: "Điền MỘT từ để trọn cụm",
        items: [
          { q: "1. Many companies pay lip ______ to diversity but change nothing. (Ngày 18)", answers: ["service"], hint: "pay lip service to = nói suông." },
          { q: "2. Strict salary caps are meant to create a level playing ______. (Ngày 14)", answers: ["field"], hint: "a level playing field." },
          { q: "3. Extra funding only papered over the ______. (Ngày 18)", answers: ["cracks"], hint: "paper over the cracks = che lấp vấn đề." },
          { q: "4. Banning phones overnight was a knee-______ reaction. (Ngày 18)", answers: ["jerk"], hint: "a knee-jerk reaction." },
          { q: "5. Larger firms benefit from economies of ______. (Ngày 8)", answers: ["scale"], hint: "economies of scale." },
          { q: "6. Editing the genes of embryos would cross a red ______. (Ngày 22)", answers: ["line"], hint: "cross a red line." },
          { q: "7. The jury is still ______ on whether the scheme works. (Ngày 18)", answers: ["out"], hint: "the jury is still out (on)." },
          { q: "8. Cars are cheaper; it does not ______ that more people should drive. (Ngày 10)", answers: ["follow"], hint: "it does not follow that… = không suy ra được." },
          { q: "9. The start-up raised £2 million in ______ capital. (Ngày 8)", answers: ["venture"], hint: "venture capital." },
          { q: "10. The judge took mitigating ______ into account. (Ngày 8)", answers: ["circumstances"], hint: "mitigating circumstances = tình tiết giảm nhẹ." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Vòng ④ — đúng sắc thái và văn phong (8 câu)" },
      {
        t: "mcq", id: "t5d30-vong-4", title: "Chọn từ đúng sắc thái",
        items: [
          { q: "1. Lời KHEN: “My grandmother was ___ — she never wasted a thing.” (Ngày 6)", options: ["stingy", "thrifty"], correct: 1, why: "thrifty = tiết kiệm (khen); stingy = keo kiệt (chê)." },
          { q: "2. “The junction is ___ for accidents.” (Ngày 6)", options: ["renowned", "notorious"], correct: 1, why: "notorious = khét tiếng (điều xấu); renowned = lừng danh (điều tốt)." },
          { q: "3. “The newspaper ___ that the data had been falsified, but offered no proof.” (Ngày 6)", options: ["refuted", "alleged"], correct: 1, why: "allege = cáo buộc (chưa chứng minh). refute = bác bỏ bằng chứng cứ." },
          { q: "4. Lời khen trẻ con: “She's very ___ — she asks about everything.” (Ngày 6)", options: ["nosy", "inquisitive"], correct: 1, why: "inquisitive = ham hiểu biết (khen); nosy = tọc mạch chuyện người khác (chê)." },
          { q: "5. Khen người nói thẳng có duyên: “I appreciated how ___ he was about the risks.” (Ngày 18)", options: ["candid", "tactless"], correct: 0, why: "candid = thẳng thắn (khen); tactless = vô duyên, thiếu tế nhị (chê)." },
          { q: "6. Câu nào hợp nhất cho Task 2 (trang trọng)?", options: ["Governments just throw money at the problem.", "Governments often increase funding without addressing the underlying causes.", "Governments chuck cash at it and hope for the best."], correct: 1, why: "Thành ngữ “throw money at a problem” (Ngày 18) hợp Speaking Part 3; Task 2 cần câu trung tính, cụ thể." },
          { q: "7. “The building was ___ unsafe and closed.” (Ngày 6, trang trọng)", options: ["deemed", "reckoned"], correct: 0, why: "be deemed + adj = bị xem là (văn bản chính thức). reckon là văn nói." },
          { q: "8. “A ___ child, she was reading novels at five.” (Ngày 20)", options: ["naive", "precocious"], correct: 1, why: "precocious = phát triển sớm so với tuổi. naive = ngây thơ, cả tin." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Tính điểm và quyết định" },
      {
        t: "table",
        head: ["Kết quả (mỗi vòng)", "Ý nghĩa", "Việc tiếp"],
        rows: [
          ["≥ 90 % cả bốn vòng", "Đạt mục tiêu Tập 5.", "Giữ bằng lịch ôn ở mục 8; mỗi tuần dùng 10 từ cũ trong một bài viết / bài nói thật."],
          ["≥ 90 % vòng ①②, dưới 90 % vòng ③④", "Biết từ nhưng chưa dùng được — vùng của band 7.", "Mỗi từ sai: chép CỤM (không chép từ đơn) + một câu của riêng bạn vào thẻ; ôn lại Ngày ghi trong câu."],
          ["75–89 % ở vòng ① hoặc ②", "Đang quên dần — thẻ chưa được ôn đủ lần.", "Mở Flashcards bộ “Từ của khoá — Tập 5”, lọc Ngày 2–22, ôn mỗi ngày 15 phút trong 7 ngày rồi làm lại bài này."],
          ["< 75 % ở bất kỳ vòng nào", "Học từ theo kiểu “đọc qua” — không nhớ được.", "Đổi cách học (mục 8): ít từ hơn, nhiều lần gặp lại hơn, và luôn học theo cụm + câu."],
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. 24 từ / cụm hay quên nhất của Tập 5 — và vì sao" },
      {
        t: "table", caption: "Nhìn cột “Bẫy” trước khi viết Đề 12 — đây là chỗ người band 7.5 hay dùng sai",
        head: ["Từ / cụm", "Ngày", "Bẫy"],
        rows: [
          ["exacerbate · alleviate · mitigate", "4 · 6 · 10", "exacerbate = làm TỆ hơn; hai từ kia ngược nghĩa. Không dùng exacerbate cho điều tốt."],
          ["curtail", "4", "Tân ngữ là thứ có giá trị (freedom, spending) — không “curtail a problem”."],
          ["preclude", "4", "preclude sb FROM V-ing; không dùng preclude to V."],
          ["onus", "4", "the onus is ON sb to V — luôn có the."],
          ["insofar as", "4", "Viết liền ba chữ; nghĩa là “trong chừng mực mà” — không phải “bởi vì”."],
          ["hitherto", "4", "Rất trang trọng — chỉ dùng trong Writing, không nói ở Part 1."],
          ["forgo · forego", "6", "forgo = từ bỏ (thứ mình có quyền có); forego hiếm hơn, nghĩa “đi trước”."],
          ["refute vs deny", "6", "refute = bác bỏ BẰNG chứng cứ; chỉ nói không đúng là deny."],
          ["recidivism", "8", "Danh từ không đếm được; người tái phạm là repeat offender."],
          ["the bottom line", "8", "Hai nghĩa: lợi nhuận cuối cùng / điểm mấu chốt — Task 2 dùng nghĩa sau thận trọng."],
          ["conflate A with B", "10", "Đi với with; không “conflate between”."],
          ["it does not follow that", "10", "Không thêm “this”: ~~this does not follow that~~."],
          ["externality", "12", "Đếm được: negative externalities."],
          ["opportunity cost", "12", "Không phải “cơ hội và chi phí” mà là giá trị của lựa chọn bị bỏ qua."],
          ["hindsight vs foresight", "14", "with hindsight = nhìn lại; foresight = nhìn trước."],
          ["provenance", "14", "Nguồn gốc của hiện vật / dữ liệu — không dùng cho người."],
          ["a postcode lottery", "16", "Thành ngữ báo chí Anh — hợp Task 2 / Part 3 về dịch vụ công; không dùng cho chuyện may rủi nói chung."],
          ["pay lip service to", "18", "Có to; tân ngữ là ý tưởng / giá trị."],
          ["the thin end of the wedge", "18", "Chỉ dùng khi lập luận “dốc trượt” — đừng dùng cho mọi thay đổi nhỏ."],
          ["confounding factor", "20", "Thuật ngữ nghiên cứu — đi với control for (kiểm soát yếu tố gây nhiễu)."],
          ["serendipity", "20", "Danh từ; tính từ là serendipitous."],
          ["sentient", "20", "Tính từ; danh từ là sentience."],
          ["paternalistic", "22", "Chê nhẹ; muốn khen thì dùng protective."],
          ["tokenism", "22", "Chê: làm hình thức cho có — không phải “chính sách ưu tiên”."],
        ],
      },
      {
        t: "quiz", id: "t5d30-tu-vung-dich", kind: "translate", grammar: "chỉ dùng từ / cụm đã học — không thêm từ mới",
        title: "Dịch sang tiếng Anh — dùng đúng cụm đã ôn (5 câu)",
        items: [
          { q: "Việc cắt giảm xe buýt đã làm trầm trọng thêm sự cô lập của người già ở nông thôn.", answers: ["Cuts to bus services have exacerbated the isolation of older people in rural areas.", "Bus service cuts have exacerbated the isolation of elderly people in rural areas.", "Cutting bus services has exacerbated the isolation of older people in the countryside.", "Cuts in bus services have exacerbated the isolation of elderly people in rural areas."], hint: "exacerbate" },
          { q: "Nhiều công ty chỉ nói suông về bình đẳng giới.", answers: ["Many companies only pay lip service to gender equality.", "Many companies pay only lip service to gender equality.", "Many companies merely pay lip service to gender equality.", "Many firms only pay lip service to gender equality."], hint: "pay lip service to" },
          { q: "Khi nhìn lại, quyết định đó rõ ràng là một sai lầm.", answers: ["With hindsight, that decision was clearly a mistake.", "In hindsight, that decision was clearly a mistake.", "With the benefit of hindsight, that decision was clearly a mistake.", "In hindsight, the decision was clearly a mistake."], hint: "with / in hindsight" },
          { q: "Thu nhập cao hơn không có nghĩa là người ta hạnh phúc hơn.", answers: ["It does not follow that people with higher incomes are happier.", "It does not follow that a higher income makes people happier.", "It doesn't follow that people who earn more are happier.", "A higher income does not necessarily mean that people are happier."], hint: "it does not follow that…" },
          { q: "Chất lượng chăm sóc y tế phụ thuộc vào nơi bạn sống.", answers: ["The quality of healthcare is a postcode lottery.", "The quality of health care depends on where you live.", "Healthcare quality is something of a postcode lottery.", "The quality of healthcare depends on where you live."], hint: "a postcode lottery" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Giữ từ sau khoá — lịch ôn cách quãng" },
      {
        t: "sodo", kind: "timeline", title: "Một thẻ từ đi qua các lần ôn (ngày 0 = ngày học)",
        caption: "Mỗi lần ôn ĐÚNG ⇒ sang mốc tiếp; ôn SAI ⇒ quay về mốc 1 ngày. Flashcards của khoá tự làm việc này.",
        marks: [
          { from: -8, label: "Học: cụm + câu của bạn", kieu: "diem", mau: 1 },
          { from: -6, label: "+1 ngày", kieu: "diem", mau: 2 },
          { from: -3, label: "+3 ngày", kieu: "diem", mau: 2 },
          { from: 0, label: "+7 ngày ⇒ kiểm như bài này", kieu: "diem", mau: 3 },
          { from: 4, label: "+21 ngày", kieu: "diem", mau: 2 },
          { from: 8, label: "+60 ngày", kieu: "diem", mau: 2 },
        ],
      },
      {
        t: "note", title: "💡 Cách học từ để nhớ sau 60 ngày (không phải 7 ngày)",
        items: [
          "**Học cụm, không học từ đơn.** Thẻ ghi “pay lip service to + N”, không ghi “lip service”.",
          "**Mỗi thẻ có một câu của bạn** về một chủ đề IELTS bạn hay gặp — câu tự đặt nhớ lâu hơn câu ví dụ có sẵn.",
          "**Dùng trong 48 giờ.** Từ chưa từng được dùng trong một bài viết / bài nói thật thì chưa phải từ của bạn.",
          "**15 phút mỗi ngày tốt hơn 2 giờ mỗi Chủ nhật.** Bộ thẻ: “Từ của khoá — Tập 5” và “AWL 570” trong Flashcards; danh sách 100 từ band 8 ở Ngày 4 và Ngày 28.",
          "**Đừng thêm quá 15 thẻ mới mỗi ngày.** Thẻ mới nhiều hơn khả năng ôn là cách chắc chắn nhất để tụt dưới 90 %.",
        ],
      },
      { t: "rule", formula: "cụm + câu của tôi + ôn 1 – 3 – 7 – 21 – 60 ngày + dùng trong 48 giờ", vi: "Nhớ sau 7 ngày là mục tiêu của khoá; nhớ sau 60 ngày là thứ bạn mang vào phòng thi." },
    ],
  },

  /* ════════════════ BÀI 2 — VIẾT: ĐỀ 12 + VIẾT LẠI BÀI YẾU NHẤT ════════════════ */
  {
    id: "t5d30-viet",
    kind: "writing",
    title: "Viết: Đề 12 “Final” — làm cả buổi thi theo đúng thứ tự ngày thi thật (hướng dẫn, không chép đề), rồi viết lại bài yếu nhất của bạn và tự chấm theo 4 tiêu chí band 8",
    goal: "Làm Đề 12 “Final” trên Online Test như một buổi thi thật — Listening, Reading, Writing liền một mạch rồi Speaking — với phân giờ và checklist đã luyện; sau đó chọn đúng bài viết yếu nhất trong Tập 5, viết lại trong 45 phút lên band 8 và tự chấm theo 4 tiêu chí, lệch không quá 0.5 so với điểm AI.",
    minutes: 120,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · làm gì hôm nay",
        items: [
          "**Đề 12 “Final” (band 8.0)** ở Online Test: `/language/en/ielts/thi-may` → bộ **Đề 12**. Đây là đề tổng duyệt: Reading đủ 16 dạng, Listening đủ các kiểu câu của phòng thi máy. Bài này ==không chép đề, không nêu đề tài== — chỉ nêu dạng và cách làm.",
          "Làm theo **đúng thứ tự ngày thi thật** của Ngày 29: Listening → Reading → Writing liền một mạch (khoảng 2 giờ 35 phút), nghỉ, rồi Speaking (Bài 3 hôm nay).",
          "Sau đề: **viết lại bài yếu nhất** của bạn trong Tập 5 — quy trình 45 phút, mẫu band 7 → band 8 đặt cạnh nhau, phiếu tự chấm 12 dòng.",
          "Nối Tập 4 Ngày 30 (viết lại ở band 7) → hôm nay ở band 8. Kiểm tra chặng cuối và tổng kết cả lộ trình ở bài cuối của ngày.",
        ],
      },

      /* ── B1 ── */
      { t: "h", text: "B1. Đề 12 — một buổi thi thật, đúng thứ tự" },
      {
        t: "table", caption: "Lịch buổi thi — làm vào buổi sáng nếu ngày thi thật của bạn là buổi sáng",
        head: ["Giờ", "Phần", "Ở đâu", "Luật"],
        rows: [
          ["0:00", "Chuẩn bị 10 phút", "Bàn học", "Tắt điện thoại, tai nghe, nước, giấy nháp. Đọc lại kịch bản ngày thi (Ngày 29 bài tập F)."],
          ["0:10", "**Listening** ~30 phút + 2 phút soát", "Online Test → Đề 12 → Listening", "Nghe MỘT lần, không dừng, không tua."],
          ["0:42", "**Reading** 60 phút", "→ Reading", "17 – 20 – 23. Không bỏ trống."],
          ["1:42", "**Writing** 60 phút", "→ Academic Writing", "Task 1 ≈ 18–20 phút, Task 2 ≈ 36–38 phút, soát 4 phút."],
          ["2:42", "Nghỉ 20–40 phút", "", "Đi bộ, ăn nhẹ. KHÔNG xem đáp án Listening / Reading."],
          ["~3:15", "**Speaking** 11–14 phút", "Bài 3 hôm nay → phòng nói, chế độ thi thật", "Một mạch, không dừng, không làm lại."],
        ],
      },
      {
        t: "table", caption: "Đề 12 trong một bảng — chỉ DẠNG, không đề tài",
        head: ["Kỹ năng", "Cấu trúc", "Bạn cần mang theo"],
        rows: [
          ["Listening", "4 Part · 40 câu · tốc độ khoảng 180 từ / phút · giọng trộn (New Zealand, Anh, Canada, Ireland, Mỹ, Úc) · có form, table, short answer, MCQ một và hai đáp án, map, sentence, matching, flow-chart, note, diagram, summary", "Checklist 14 dạng (Ngày 29 Bài 3) · đáp án là bản CUỐI (Ngày 24–25) · 2 phút soát theo thứ tự ô trống → số nhiều → chính tả"],
          ["Reading", "3 passage · 40 câu · đủ 16 dạng R01–R16", "Checklist 16 dạng (Ngày 29 Bài 2) · đọc một lượt (Ngày 21) · matching information làm sau cùng"],
          ["Writing", "Task 1: **mixed** — hai hình khác loại · Task 2: **Opinion** (To what extent…) với một đề **lạ**", "Task 1: đọc kỹ mỗi hình đo CÁI GÌ, của AI (mẫu số) trước khi nối hai hình (Ngày 6 · 26) · Task 2: gạch đúng câu hỏi, đề lạ thì hỏi “đề hỏi về điều gì” trước “tôi biết gì về chủ đề” (Ngày 14 · 22)"],
          ["Speaking", "Part 1 hai chủ đề · Part 2 một thẻ · Part 3 thảo luận", "Bài 3 hôm nay"],
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — ba lỗi làm Đề 12 mất giá trị đo",
        items: [
          "**Mở trước đề để “xem thử”.** Đề 12 là lần đo cuối của cả lộ trình — đã nhìn đề thì kết quả không còn là sức của bạn.",
          "**Dừng giữa chừng** (nghe lại Part 3, nghỉ giữa Reading và Writing). Ngày thi thật không cho dừng.",
          "**Chấm Writing bằng cảm giác.** Đọc điểm AI 4 tiêu chí + bài mẫu + mục “Soi lỗi” của đề, rồi mới so với tự chấm (B6).",
        ],
      },

      /* ── B2 ── */
      { t: "h", text: "B2. Writing Đề 12 — phân giờ và checklist band 8" },
      {
        t: "table", caption: "60 phút — bảng band 8 (nối Tập 4 Ngày 28 · Tập 5 Ngày 23)",
        head: ["Phút", "Task", "Việc"],
        rows: [
          ["0–3", "Task 1", "Đọc hai hình: mỗi hình đo gì, đơn vị gì, của nhóm nào, năm nào. Tìm MỘT điểm nối hai hình (nếu có) và một điểm KHÔNG nối được."],
          ["3–18", "Task 1", "Mở bài 1 câu · overview 2 câu (một ý mỗi hình) · thân bài: mỗi hình một khổ, số liệu có chọn lọc."],
          ["18–20", "Task 1", "Soát đơn vị, thì, số liệu khớp hình. Chuyển Task 2 dù chưa hài lòng."],
          ["20–25", "Task 2", "Gạch câu hỏi; viết thesis có lập trường tinh (đồng ý tới đâu, với điều kiện gì); hai lý do + một nhượng bộ."],
          ["25–56", "Task 2", "Mở bài 2 câu · thân bài 1 (lý do mạnh nhất + ví dụ cụ thể) · thân bài 2 (nhượng bộ thật + phản bác) · kết bài nói lại lập trường."],
          ["56–60", "Cả hai", "Soát “3 + 2” (Ngày 23): 3 lượt chung (hoà hợp, mạo từ, giới từ) + 2 lượt của riêng bạn."],
        ],
      },
      {
        t: "table", caption: "Checklist trước và sau Writing Đề 12",
        head: ["Trước khi bấm Bắt đầu", "Sau khi có điểm"],
        rows: [
          ["Đọc lại hai “lượt của tôi” trong sổ lỗi", "Ghi điểm 4 tiêu chí từng Task vào bảng B7"],
          ["Đọc lại 5 câu khung mở bài / overview của Tập 5 bạn hay dùng", "Đọc bài mẫu của đề + mục “Soi lỗi” — bài mẫu cố ý giữ vài lỗi nhỏ, bạn tìm được mấy cái?"],
          ["Nhắc mình: Task 2 trả lời ĐÚNG câu hỏi (Ngày 29 mục 7)", "Chọn bài yếu nhất để viết lại (B3) — có thể chính là bài Đề 12"],
        ],
      },

      /* ── B3 ── */
      { t: "h", text: "B3. Chọn bài yếu nhất — không phải bài điểm thấp nhất" },
      { t: "p", text: "“Bài yếu nhất” là bài mà ==viết lại sẽ dạy bạn nhiều nhất==. Đôi khi đó là bài điểm thấp nhất; nhưng thường hơn là bài có **tiêu chí thấp nhất lặp lại** ở nhiều bài khác. Lấy mọi bài Task 2 của Tập 5 (Ngày 4, 10, 14, 16, 20, 22, 28 và Đề 9–12), ghi 4 tiêu chí, rồi chọn theo bảng." },
      {
        t: "table",
        head: ["Nếu", "Chọn bài", "Vì sao"],
        rows: [
          ["Một tiêu chí thấp hơn ba tiêu chí kia ở ≥ 3 bài", "Bài có tiêu chí đó thấp nhất", "Đó là lỗi hệ thống — viết lại một bài sửa được thói quen."],
          ["TR thấp do lạc một nửa đề", "Bài lạc đề", "Viết lại là cách duy nhất để thấy bài đúng trọng tâm khác bài lạc ở đâu."],
          ["Điểm đều nhau ~7.0", "Bài thuộc dạng đề bạn ngại nhất (thường Opinion đề lạ hoặc Two-part)", "Đề 12 và đề thật đều có thể ra đúng dạng đó."],
          ["Task 1 luôn thấp hơn Task 2 một bậc", "Bài Task 1 mixed hoặc process yếu nhất", "Task 1 chiếm 1/3 điểm Writing — một bậc ở Task 1 kéo cả band."],
        ],
      },

      /* ── B4 ── */
      { t: "h", text: "B4. Quy trình viết lại — 45 phút" },
      {
        t: "sodo", kind: "flow", title: "Viết lại một bài lên band 8",
        caption: "Không sửa trên bài cũ — viết bài MỚI cùng đề, đặt hai bài cạnh nhau.",
        steps: [
          { label: "**Chẩn đoán (8')**", sub: "đọc phản hồi AI + phiếu B6; khoanh 3 chỗ hỏng nhất: lập trường · lập luận · ngôn ngữ" },
          { label: "**Lập dàn lại (7')**", sub: "thesis mới có điều kiện; mỗi thân bài MỘT ý phát triển sâu, không hai ý mỏng" },
          { label: "**Viết (25')**", sub: "không nhìn bài cũ; giữ lại tối đa 2 câu tốt nhất" },
          { label: "**Soát + tự chấm (5')**", sub: "phiếu B6 · đếm câu có lỗi · so điểm tự chấm với AI" },
        ],
      },

      /* ── B5 ── */
      { t: "h", text: "B5. Mẫu — cùng một đề, band 7 và band 8 đặt cạnh nhau" },
      { t: "p", text: "Đề luyện (không phải đề của Đề 12): **Some people believe that young adults should continue to live with their parents while they study or start work, rather than live independently. To what extent do you agree or disagree?**" },
      {
        t: "passage", title: "Bài gốc — band 7 (ước tính) · khoảng 275 từ",
        paras: [
          { text: "Nowadays, many young people live with their parents when they are studying or starting their first job. Some people think this is the best choice, while others believe young adults should live on their own. In my opinion, I partly agree with this view because it has both advantages and disadvantages." },
          { text: "On the one hand, living with parents can help young people save a lot of money. Rents in big cities are very expensive, and a student or a new worker often cannot afford them. For example, in Ho Chi Minh City a small room can cost half of a graduate's salary. If they live at home, they can save this money for the future, such as buying a house or studying further. Many of my friends have done this, and they could save enough money to pay for a master's degree. In addition, parents can support them when they have problems." },
          { text: "On the other hand, living independently has many benefits. Young people who live alone have to cook, clean and manage their money by themselves, so they become more responsible and mature. For instance, my cousin moved into a rented flat in his first year at university, and he learned how to plan his spending carefully. Moreover, they can make their own decisions without being controlled by their parents, which is important for their development. However, this is not easy and some people feel lonely." },
          { text: "In conclusion, both options have advantages and disadvantages. I believe that young people should choose depending on their situation. If they have enough money, living alone is a good experience, but if not, living with their parents is better." },
        ],
      },
      {
        t: "passage", title: "Bài viết lại — band 8 (ước tính) · khoảng 305 từ",
        paras: [
          { text: "Whether young adults should stay in the family home while they study or begin their careers is often framed as a choice between financial sense and personal growth. I largely agree that living with parents is the wiser option at this stage of life, provided that the arrangement is treated as a deliberate, time-limited plan rather than a default." },
          { text: "The financial argument is stronger than it first appears. In cities such as Ho Chi Minh City, a modest rented room can absorb close to half of a graduate's starting salary, leaving little to save and almost nothing for further training. A young person who avoids that cost for two or three years is not merely saving money; they are buying options — the freedom to accept an unpaid internship, change course, or turn down a poorly paid first job. For many, that flexibility does more for their long-term independence than an early tenancy agreement ever could." },
          { text: "The case for moving out rests on the claim that independence teaches responsibility, and there is some truth in this: running a household does build practical competence. It does not follow, however, that these skills can only be learned by living alone. Young adults at home can contribute to the rent, take charge of their own finances and share domestic work, and parents who insist on this are arguably teaching responsibility more effectively than a distant landlord would. What undermines development is not living with one's parents as such, but an arrangement in which nothing is expected of the young person." },
          { text: "In short, staying at home is usually the better choice during study and the first years of work, but its value depends on how it is organised. A clear agreement about contributions and a rough date for moving out turns a financial convenience into a genuine preparation for adult life." },
        ],
      },
      {
        t: "table", caption: "Khác nhau ở đâu — theo 4 tiêu chí (diễn đạt bằng lời của khoá, không chép mô tả chính thức)",
        head: ["Tiêu chí", "Bài band 7", "Bài band 8"],
        rows: [
          ["**Task Response**", "“I partly agree… both advantages and disadvantages” — lập trường không rõ; kết bài “depending on their situation” né câu hỏi “to what extent”.", "“I largely agree… provided that…” — lập trường rõ VÀ có điều kiện; kết bài nói lại đúng lập trường đó. Cả bài phục vụ một luận điểm."],
          ["**Coherence & Cohesion**", "Khung “On the one hand / On the other hand / Moreover / In conclusion” — nối bằng từ nối có sẵn; thân bài 2 tự phản bác ở câu cuối mà không xử lý.", "Mỗi đoạn mở bằng câu chủ đề nối ý (“The financial argument is stronger than it first appears”); nhượng bộ → phản bác trong cùng một đoạn (“there is some truth in this… It does not follow, however…”)."],
          ["**Lexical Resource**", "save money, very expensive, many benefits, responsible and mature — đúng nhưng phổ thông.", "framed as, absorb close to half of, buying options, practical competence, undermines development — chính xác, tự nhiên, không khoe từ."],
          ["**Grammar Range & Accuracy**", "Đúng gần hết; câu đơn và ghép là chính; “In my opinion, I…” thừa.", "Câu phức nhiều tầng không lỗi: mệnh đề danh ngữ làm chủ ngữ (Whether…), phân từ (leaving…), câu chẻ giả (What undermines… is not…), not merely… but… (biến thể)."],
        ],
      },
      {
        t: "note", title: "📌 Ba thay đổi đáng học nhất — mang vào mọi bài viết lại",
        items: [
          "**Lập trường có điều kiện** (I largely agree…, provided that…) thay cho “partly agree because there are two sides”. “To what extent” hỏi MỨC ĐỘ — trả lời bằng mức độ.",
          "**Một ý phát triển sâu** (tiền → “buying options” → tự lập lâu dài) thay cho ba ý mỏng (tiền, bố mẹ giúp, mua nhà). Band 8 thắng ở chiều sâu, không ở số lượng.",
          "**Nhượng bộ thật rồi phản bác** trong cùng đoạn: thừa nhận phần đúng của phía kia, chỉ ra chỗ lập luận của họ không suy ra được (it does not follow that — Ngày 10).",
        ],
      },
      { t: "rule", formula: "viết lại = cùng đề · lập trường có điều kiện · một ý sâu mỗi đoạn · nhượng bộ thật + phản bác · soát 3 + 2", vi: "Sửa lối nghĩ trước, sửa câu chữ sau — đổi từ đẹp hơn trên một bài lập trường mờ không lên band 8." },

      /* ── B6 ── */
      { t: "h", text: "B6. Phiếu tự chấm band 8 — 12 dòng có / không" },
      {
        t: "table", caption: "Mỗi “không” là một việc phải sửa. 11–12 “có” ≈ band 8 ở bài đó; 8–10 ≈ 7–7.5.",
        head: ["Tiêu chí", "Câu hỏi", "Có / Không"],
        rows: [
          ["TR", "1. Thesis trả lời ĐÚNG câu hỏi (mọi vế), có mức độ / điều kiện?", "…"],
          ["TR", "2. Mỗi thân bài có ít nhất một ví dụ CỤ THỂ (nơi, nhóm người, con số hợp lý), không “for example, many people…”?", "…"],
          ["TR", "3. Kết bài nói lại đúng lập trường của mở bài?", "…"],
          ["CC", "4. Mỗi đoạn có câu chủ đề nói được ý của cả đoạn?", "…"],
          ["CC", "5. Từ nối không lặp, không đứng đầu mọi câu; có nối bằng tham chiếu (this approach, such arrangements)?", "…"],
          ["CC", "6. Nhượng bộ và phản bác nằm trong cùng một mạch, không bỏ lửng?", "…"],
          ["LR", "7. Ít nhất 4 cụm chính xác, tự nhiên của chủ đề (không chỉ từ “to”)?", "…"],
          ["LR", "8. Không từ nào dùng sai sắc thái / sai cụm (Bài 1 vòng ③ ④)?", "…"],
          ["LR", "9. Không lặp một danh từ chính quá 3 lần?", "…"],
          ["GRA", "10. Có ít nhất 3 kiểu câu phức khác nhau, dùng vì ý chứ không vì khoe?", "…"],
          ["GRA", "11. Tối đa 1–2 câu có lỗi (Ngày 25: đếm CÂU có lỗi)?", "…"],
          ["GRA", "12. Dấu câu đúng ở mệnh đề quan hệ, từ nối và câu dài (Ngày 19)?", "…"],
        ],
      },
      { t: "p", text: "So điểm tự chấm với điểm AI. ==Lệch ≤ 0.5 ở mọi tiêu chí== nghĩa là bạn đã có “con mắt giám khảo” — kỹ năng quan trọng nhất để tự học sau khoá. Lệch ≥ 1.0 ở một tiêu chí: đọc lại phần phản hồi AI của tiêu chí đó và mục B5." },

      /* ── B7 ── */
      { t: "h", text: "B7. Đến lượt bạn — viết lại và tự chấm (AI chấm)" },
      {
        t: "essay", id: "t5d30-viet-lai-task2", task: "Task 2", minWords: 250,
        prompt: "Rewrite your weakest Task 2 essay from Tập 5 (chosen with the table in B3). Copy the ORIGINAL question exactly as the first line of your answer, then write a completely new essay of at least 250 words without looking at your old one. Aim for a qualified position, one well-developed idea per body paragraph, and a genuine concession followed by a rebuttal.",
        tips: [
          "Dòng đầu: chép nguyên đề gốc — AI cần đề để chấm Task Response.",
          "Trước khi viết: ghi 3 chỗ hỏng nhất của bài cũ (B4 bước 1).",
          "Sau khi viết: điền phiếu B6, ghi điểm tự chấm, rồi mới bấm chấm.",
        ],
      },
      {
        t: "essay", id: "t5d30-viet-lai-task1", task: "Task 1", minWords: 150,
        prompt: "Rewrite your weakest Task 1 report from Tập 5 (often the mixed-chart or process task). Copy the ORIGINAL task description as the first line, briefly describe the figure(s) in brackets (type, categories, years and the key figures), then write a new report of at least 150 words.",
        tips: [
          "Overview hai câu: mỗi hình một ý nổi bật nhất — không số liệu trong overview.",
          "Mixed: mỗi hình một khổ; nối hai hình bằng đúng một câu (nếu có điểm nối thật).",
          "Soát đơn vị và mẫu số: phần trăm CỦA AI?",
        ],
      },
      {
        t: "table", caption: "Đường đi Writing của bạn qua 4 đề Tập 5 — điền sau Đề 12",
        head: ["Đề", "Task 1 (TA · CC · LR · GRA)", "Task 2 (TR · CC · LR · GRA)", "Writing"],
        rows: [
          ["Đề 9 (Ngày 8)", "…", "…", "…"],
          ["Đề 10 (Ngày 16)", "…", "…", "…"],
          ["Đề 11 (Ngày 24)", "…", "…", "…"],
          ["Đề 12 (Ngày 30)", "…", "…", "…"],
          ["Bài viết lại hôm nay", "…", "…", "…"],
        ],
      },
      {
        t: "note", title: "📌 Đọc bảng thế nào",
        items: [
          "**Tăng đều, Đề 12 ≥ 7.5:** sẵn sàng đặt lịch thi thật — dùng kế hoạch 4 tuần ở cuối bài Kiểm tra chặng.",
          "**Đi ngang ở 7.0:** gần như luôn do MỘT tiêu chí. Bài viết lại hôm nay phải nhắm đúng tiêu chí đó; làm lại phiếu B6 mỗi tuần.",
          "**Bài viết lại cao hơn Đề 12 từ 1.0:** bạn VIẾT được band 8 khi có thời gian nghĩ — điểm nghẽn là 5 phút lập dàn. Luyện riêng lập dàn 5 phút cho 20 đề (chỉ dàn, không viết bài).",
        ],
      },
    ],
  },

  /* ════════════════ BÀI 3 — NÓI: GIÁM KHẢO AI 14 PHÚT LẦN CUỐI ════════════════ */
  {
    id: "t5d30-noi",
    kind: "speaking",
    title: "Nói: Giám khảo AI 14 phút lần cuối — dấu hiệu band 8 theo 4 tiêu chí, khởi động ba Part, mẫu band 7 và band 8 cạnh nhau, rồi Speaking Đề 12 ở chế độ thi thật",
    goal: "Vào phòng nói của Đề 12 sau một lượt khởi động ngắn, nói một mạch 11–14 phút với giám khảo AI như ngày thi thật, rồi đọc phản hồi theo 4 tiêu chí, so với Đề 9–11 để biết mình đã ở band 8 chưa và còn đúng một việc gì phải sửa trước ngày thi.",
    minutes: 75,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "Mục 1: band 8 Speaking khác band 7 ở đâu — bốn tiêu chí, mỗi tiêu chí một dấu hiệu nghe được.",
          "Mục 2: khởi động 10 phút với câu hỏi MỚI (không phải câu của Đề 12) — Part 1, Part 2, Part 3.",
          "Mục 3: một câu Part 3 trả lời ở band 7 và band 8 đặt cạnh nhau.",
          "Mục 4–5: **Speaking Đề 12, chế độ thi thật** — một mạch, không dừng; rồi đọc phản hồi và so với Đề 9–11.",
          "Mục 6: 🔊 đọc liền câu trả lời band 8 — nối âm, âm yếu, nhấn ý. Mục 7: giữ phong độ nói sau khoá.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Band 8 nghe như thế nào — bốn dấu hiệu" },
      {
        t: "table", caption: "Diễn đạt bằng lời của khoá — nối Tập 5 Ngày 2 (ngắt vì nội dung) · Ngày 27 (Part 3)",
        head: ["Tiêu chí", "Band 7 thường nghe thấy", "Band 8 thường nghe thấy"],
        rows: [
          ["**Fluency & Coherence**", "Nói dài được nhưng đôi lúc ngừng để TÌM TỪ; nối bằng firstly / secondly / so.", "Ngừng để NGHĨ Ý, hiếm khi vì thiếu từ; ý đi theo mạch tự nhiên (but I don't think that's the whole story…)."],
          ["**Lexical Resource**", "Từ đủ dùng, có vài cụm hay; đôi khi sai cụm hoặc sắc thái.", "Từ ít gặp dùng đúng chỗ, idiom vừa phải và đúng; paraphrase lại câu hỏi không lặp."],
          ["**Grammatical Range & Accuracy**", "Có câu phức; lỗi nhỏ ở thì, mạo từ khi nói nhanh.", "Câu phức đa dạng, đa số câu không lỗi; ellipsis và câu chẻ tự nhiên khi nói (Ngày 11 · 21)."],
          ["**Pronunciation**", "Dễ hiểu; giọng mẹ đẻ rõ ở âm cuối và trọng âm từ dài.", "Dễ hiểu suốt; ngữ điệu và nhấn ý mang nghĩa; giọng mẹ đẻ ảnh hưởng tối thiểu."],
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Khởi động 10 phút — câu hỏi MỚI (AI chấm từng câu)" },
      { t: "p", text: "Không mở Speaking Đề 12 để khởi động. Dùng bộ câu dưới đây — chủ đề không trùng Đề 12 — để “ấm máy”: Part 1 trả lời 2–3 câu, Part 2 chuẩn bị 1 phút rồi nói 2 phút, Part 3 mỗi câu 40–60 giây." },
      {
        t: "speak", id: "t5d30-khoi-dong-p1", part: "1",
        questions: [
          "Do you carry a lot of keys?",
          "Have you ever lost your keys?",
          "Do you think physical keys will disappear one day?",
          "How often do you look at the night sky?",
          "Is it easy to see the stars where you live?",
        ],
      },
      {
        t: "speak", id: "t5d30-khoi-dong-p2", part: "2",
        questions: [
          "Describe a time when you received some good news that you did not expect. You should say: what the news was; how you received it; who you shared it with; and explain why it was unexpected.",
          "Did the news change any of your plans?",
        ],
      },
      {
        t: "speak", id: "t5d30-khoi-dong-p3", part: "3",
        questions: [
          "Why do you think news reports tend to focus on bad news?",
          "Is it better to receive important news face to face or in writing?",
          "Should newspapers be required to report more positive stories?",
          "So are you saying the public prefers bad news?",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Một câu Part 3 — band 7 và band 8 đặt cạnh nhau" },
      {
        t: "dialogue", title: "Band 7 (ước tính) — “Why do you think news reports tend to focus on bad news?”",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do you think news reports tend to focus on bad news?" },
          { who: "Candidate", role: "candidate", text: "I think there are several reasons. Firstly, bad news is more interesting for people, so the media can attract more viewers and make more money. Secondly, people want to know about dangers so they can protect themselves. For example, if there is a storm, people need to know about it. So I think that's why the news is usually negative." },
        ],
      },
      {
        t: "dialogue", title: "Band 8 (ước tính) — cùng câu hỏi",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do you think news reports tend to focus on bad news?" },
          { who: "Candidate", role: "candidate", text: "Partly it's commercial, obviously — alarm sells, and a headline about a crisis gets far more clicks than one about a slow improvement.", vi: "Một phần là vì thương mại, rõ rồi — sự lo sợ bán được hàng, và tít về khủng hoảng được bấm nhiều hơn hẳn tít về một tiến bộ chậm." },
          { who: "Candidate", role: "candidate", text: "But I don't think that's the whole story. Good news tends to happen gradually — child mortality falling a little every year, say — whereas bad news happens on a particular day, and news is, almost by definition, about what happened today.", vi: "Nhưng tôi không nghĩ đó là tất cả. Tin tốt thường đến từ từ — tỉ lệ tử vong trẻ em giảm một chút mỗi năm chẳng hạn — còn tin xấu xảy ra vào một ngày cụ thể, mà tin tức gần như theo định nghĩa là chuyện xảy ra hôm nay." },
          { who: "Candidate", role: "candidate", text: "So it's less that journalists are drawn to bad news and more that the format itself favours sudden events, which are disproportionately negative.", vi: "Vậy không hẳn là nhà báo bị tin xấu thu hút, mà là chính khuôn dạng tin tức ưu tiên sự kiện đột ngột — vốn nghiêng hẳn về phía tiêu cực." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["FC", "Firstly / Secondly / So — khung liệt kê; ví dụ chung chung (a storm).", "Ý thứ hai PHẢN BIỆN ý thứ nhất (But I don't think that's the whole story) — mạch lập luận, không phải danh sách."],
          ["LR", "interesting, attract more viewers, make more money.", "alarm sells, slow improvement, almost by definition, disproportionately negative (Ngày 4)."],
          ["GRA", "Câu đơn + so / because.", "Câu so sánh “it's less that… and more that…”, mệnh đề quan hệ không xác định (which are…), đối lập whereas."],
          ["P", "(nghe bản ghi của bạn)", "Nhấn GRAdually / particular DAY / TOday — nhấn vào từ mang ý đối lập."],
        ],
      },
      { t: "rule", formula: "ý 1 (hiển nhiên) + But I don't think that's the whole story + ý 2 (sâu hơn) + it's less that… and more that…", vi: "Khung band 8 cho câu hỏi “Why…?” ở Part 3: thừa nhận câu trả lời dễ, rồi đi sâu hơn nó." },

      /* ── 4 ── */
      { t: "h", text: "4. Vào phòng — Speaking Đề 12, chế độ thi thật" },
      { t: "p", text: "Mở `/language/en/ielts/thi-may/noi?de=noi-de12` (Online Test → Speaking → Đề 12). Chế độ mặc định là **thi thật**: giám khảo AI hỏi Part 1, đưa thẻ Part 2 (1 phút chuẩn bị, nói tối đa 2 phút), hỏi câu chốt, rồi Part 3; xong bài mới chấm **FC · LR · GRA · P**." },
      {
        t: "sodo", kind: "flow", title: "Lượt cuối — khoảng 35 phút",
        caption: "Lượt này để ĐO, không để luyện: không dừng, không làm lại câu.",
        steps: [
          { label: "**Chuẩn bị (3')**", sub: "phòng yên, tai nghe có micro, giấy bút cho Part 2, uống nước" },
          { label: "**Thi (11–14')**", sub: "một mạch; không hiểu thì xin nhắc lại đúng cách (Ngày 29 mục 4)" },
          { label: "**Đọc phản hồi (10')**", sub: "ghi 4 tiêu chí vào bảng mục 5; nghe lại 2 câu Part 3 dài nhất" },
          { label: "**Chọn MỘT việc (5')**", sub: "tiêu chí thấp nhất ⇒ việc trong bảng mục 5" },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — đừng phá lần đo cuối",
        items: [
          "Không mở đề trước để “xem thử”, không làm Đề 12 ở chế độ luyện trước chế độ thi.",
          "Không học thuộc câu trả lời khởi động rồi đem vào phòng — Part 1 của Đề 12 là chủ đề khác.",
          "Một câu hỏi lạ ở Part 3 là chuyện bình thường: dùng một câu mua giờ (Ngày 29 mục 5) rồi trả lời — đừng xin đổi câu.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Đọc phản hồi — so với Đề 9 → 11" },
      {
        t: "table", caption: "Điền điểm AI (ước tính) của bốn lần thi nói trong Tập 5",
        head: ["Đề", "FC", "LR", "GRA", "P", "Speaking"],
        rows: [
          ["Đề 9 (Ngày 8)", "…", "…", "…", "…", "…"],
          ["Đề 10 (Ngày 16)", "…", "…", "…", "…", "…"],
          ["Đề 11 (Ngày 24)", "…", "…", "…", "…", "…"],
          ["Đề 12 (Ngày 30)", "…", "…", "…", "…", "…"],
        ],
      },
      {
        t: "table", caption: "Tiêu chí thấp nhất ⇒ MỘT việc cho 2 tuần tới",
        head: ["Thấp nhất", "Dấu hiệu trong bản ghi", "Việc làm"],
        rows: [
          ["**FC**", "Câu Part 3 dưới 40 giây; ngừng giữa cụm danh từ", "Mỗi ngày 3 câu Part 3 theo khung mục 3, ghi âm, nghe lại một lần."],
          ["**LR**", "Lặp good / important / a lot; paraphrase câu hỏi bằng chính từ của câu hỏi", "10 cụm của Bài 1 mục 7, mỗi ngày dùng 5 cụm trong câu trả lời nói."],
          ["**GRA**", "Lỗi thì khi so sánh xưa – nay; mạo từ rơi khi nói nhanh", "Ôn Ngày 27 (bảng 44 điểm) nhóm thì + mạo từ; mỗi câu Part 3 có một câu phức chủ động."],
          ["**P**", "Đều đều, nhấn sai từ dài, rơi âm cuối -s / -ed", "Khối phát âm mục 6 + các khối phatam Ngày 13 · 23 · 29 — ghi âm, so với mẫu."],
        ],
      },
      { t: "rule", formula: "một lần đo ⇒ đúng MỘT việc sửa trong 2 tuần", vi: "Sửa nhiều thứ một lúc thì không thứ nào thành thói quen trước ngày thi thật." },

      /* ── 6 ── */
      { t: "h", text: "6. Thêm: phát âm — đọc liền câu trả lời band 8" },
      {
        t: "phatam", id: "t5d30-phat-am", title: "Luyện phát âm — câu trả lời Part 3 band 8 (8 câu)",
        note: "Đọc như đang nói thật. Từ chức năng đọc yếu (to /tə/, of /əv/, that /ðət/, and /ən/); nhấn vào từ mang ý ĐỐI LẬP. Ghi âm, nghe lại, so với điểm máy chấm.",
        items: [
          { text: "Partly it's commercial, obviously.", ipa: "pɑːtli ɪts kəmɜːʃl ɒbviəsli", vi: "Ngừng ngắn sau commercial; obviously đọc nhẹ, giọng xuống." },
          { text: "Alarm sells.", ipa: "əlɑːm selz", vi: "Hai từ, hai nhịp nhấn: aLARM SELLS." },
          { text: "But I don't think that's the whole story.", ipa: "bət aɪ dəʊnt θɪŋk ðæts ðə həʊl stɔːri", vi: "Nhấn WHOLE; but đọc yếu /bət/." },
          { text: "Good news tends to happen gradually.", ipa: "ɡʊd njuːz tendz tə hæpən ɡrædʒuəli", vi: "news /njuːz/ (giọng Anh); tends to → /tendztə/." },
          { text: "Bad news happens on a particular day.", ipa: "bæd njuːz hæpənz ɒn ə pətɪkjələ deɪ", vi: "Nhấn DAY — đối lập với gradually." },
          { text: "News is, almost by definition, about what happened today.", ipa: "njuːz ɪz ɔːlməʊst baɪ defɪnɪʃn əbaʊt wɒt hæpənd tədeɪ", vi: "Cụm chèn “almost by definition” đọc thấp giọng, nhanh hơn." },
          { text: "It's less that journalists are drawn to bad news.", ipa: "ɪts les ðət dʒɜːnəlɪsts ə drɔːn tə bæd njuːz", vi: "that /ðət/ yếu; are /ə/ yếu." },
          { text: "The format itself favours sudden events.", ipa: "ðə fɔːmæt ɪtself feɪvəz sʌdn ɪvents", vi: "sudden /sʌdn/ — không đọc rõ /ə/ ở giữa." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Giữ phong độ nói sau khoá" },
      {
        t: "note", title: "💡 Mẹo — 15 phút mỗi ngày, không cần bạn nói",
        items: [
          "**Thứ Hai – Thứ Sáu:** mỗi ngày 1 câu Part 1 + 1 câu Part 3, ghi âm, nghe lại MỘT lần, sửa MỘT chỗ, nói lại.",
          "**Thứ Bảy:** một thẻ Part 2 mới, đủ 2 phút, kể bằng một chuyện trong kho 5 chuyện (Tập 4 Ngày 30 · Tập 5 Ngày 26).",
          "**Mỗi 2 tuần:** một lượt phòng nói AI với đề CŨ đã làm cách ≥ 4 tuần — chế độ luyện — để theo dõi 4 tiêu chí.",
          "**Tuần cuối trước ngày thi:** một lượt chế độ thi với đề bạn làm lâu nhất rồi, đúng giờ của buổi Speaking thật.",
        ],
      },
    ],
  },

  /* ════════════════ BÀI TẬP NGÀY 30 ════════════════ */
  {
    id: "t5d30-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 30 — nhớ từ lượt 2 · chẩn đoán bài viết lại · nâng câu band 7 lên band 8 · dấu hiệu band 8 Speaking · Đề 12",
    goal: "Kiểm lại bằng câu mới rằng bạn nhớ được từ Tập 5, nhận ra một chỗ sửa trong bài viết nâng tiêu chí nào, tự nâng câu band 7 lên band 8, phân biệt dấu hiệu band 7 và band 8 khi nói, và nắm chắc cách làm Đề 12 — 34 câu có đáp án + một trang kế hoạch sau khoá.",
    minutes: 50,
    blocks: [
      {
        t: "recap", title: "Bài tập gồm",
        items: [
          "A. Nhớ từ lượt 2 — 10 câu (từ khác Bài 1).",
          "B. Chỗ sửa này nâng tiêu chí nào? — 8 câu.",
          "C. Nâng câu band 7 lên band 8 (dịch) — 6 câu.",
          "D. Band 7 hay band 8 khi nói — 6 câu.",
          "E. Đề 12 và ngày thi — 4 câu.",
          "F. Một trang kế hoạch sau khoá (không chấm máy).",
        ],
      },
      { t: "h", text: "A. Nhớ từ lượt 2 (10 câu)" },
      {
        t: "quiz", id: "t5d30-bt-nho-tu", kind: "fill", title: "Điền MỘT từ (đã học ở Ngày ghi trong ngoặc)",
        items: [
          { q: "1. The new rules have been introduced with very little public ______ (Ngày 2 — sự giám sát kỹ).", answers: ["scrutiny", "oversight"], hint: "public scrutiny / oversight." },
          { q: "2. Cheap flights are no ______ for the problems of regional tourism (Ngày 4 — thuốc chữa bách bệnh).", answers: ["panacea"], hint: "no panacea for." },
          { q: "3. There is a striking ______ between the official figures and what residents report (Ngày 4 — sự chênh lệch).", answers: ["discrepancy"], hint: "a discrepancy between A and B." },
          { q: "4. Many older people rely on a modest state ______ (Ngày 8).", answers: ["pension"], hint: "state pension." },
          { q: "5. People tend to fear losses more than they value gains — this is called loss ______ (Ngày 14).", answers: ["aversion"], hint: "loss aversion." },
          { q: "6. Children who are always protected never learn to take risks — parents shouldn't wrap them in cotton ______ (Ngày 20).", answers: ["wool"], hint: "wrap sb in cotton wool." },
          { q: "7. Patients must give informed ______ before any trial (Ngày 22).", answers: ["consent"], hint: "informed consent." },
          { q: "8. Without proper protection, temporary workers are in a ______ position (Ngày 22 — bấp bênh).", answers: ["precarious"], hint: "precarious work / position." },
          { q: "9. Online sales have caused high-street shops to ______ (Ngày 4 — giảm dần).", answers: ["dwindle"], hint: "numbers dwindle." },
          { q: "10. The scheme was a ______ elephant — expensive and almost unused (Ngày 14).", answers: ["white"], hint: "a white elephant." },
        ],
      },
      { t: "h", text: "B. Chỗ sửa này nâng tiêu chí nào? (8 câu)" },
      {
        t: "mcq", id: "t5d30-bt-tieu-chi", title: "Chọn tiêu chí được nâng NHIỀU NHẤT",
        items: [
          { q: "1. “I partly agree because there are two sides.” → “I largely agree, provided that…”", options: ["Task Response", "Lexical Resource", "Pronunciation"], correct: 0, why: "Lập trường rõ, có mức độ — trả lời đúng “to what extent”." },
          { q: "2. “Firstly… Secondly… Moreover…” → mỗi đoạn mở bằng một câu chủ đề nối với đoạn trước", options: ["Coherence & Cohesion", "Grammar", "Task Response"], correct: 0, why: "Nối bằng ý và tham chiếu thay cho từ nối máy móc." },
          { q: "3. “very expensive” → “can absorb close to half of a graduate's salary”", options: ["Lexical Resource", "Coherence & Cohesion", "Grammar"], correct: 0, why: "Cụm chính xác, có số liệu — LR (đồng thời làm ví dụ cụ thể hơn)." },
          { q: "4. “25 bottles is needed” → “25 bottles are needed”", options: ["Grammar", "Lexical Resource", "Task Response"], correct: 0, why: "Hoà hợp chủ – vị (Ngày 25)." },
          { q: "5. Thêm ví dụ cụ thể (một thành phố, một nhóm người) vào thân bài 1", options: ["Task Response", "Pronunciation", "Grammar"], correct: 0, why: "Ý được phát triển và minh hoạ — TR." },
          { q: "6. “responsible of” → “responsible for”", options: ["Lexical Resource và Grammar", "Task Response", "Coherence"], correct: 0, why: "Giới từ cố định: collocation (LR) và lỗi (GRA) cùng lúc — Ngày 25 mục 2." },
          { q: "7. Thay ba ý mỏng bằng một ý phát triển sâu", options: ["Task Response", "Lexical Resource", "Grammar"], correct: 0, why: "Band 8 TR: ý được mở rộng và chống đỡ đầy đủ." },
          { q: "8. Kết bài “people should choose depending on their situation” → kết bài nói lại lập trường có điều kiện", options: ["Task Response", "Lexical Resource", "Grammar"], correct: 0, why: "Lập trường nhất quán từ đầu tới cuối." },
        ],
      },
      { t: "h", text: "C. Nâng câu band 7 lên band 8 — dịch (6 câu)" },
      {
        t: "quiz", id: "t5d30-bt-nang-cau", kind: "translate", grammar: "provided that · not merely… but… / not merely…; … · It does not follow that… · What… is not X but Y · it's less that… and more that…",
        title: "Dịch sang tiếng Anh — viết ở mức band 8",
        items: [
          { q: "Tôi phần lớn đồng ý, với điều kiện là quy định này chỉ áp dụng tạm thời.", answers: ["I largely agree, provided that the rule is only applied temporarily.", "I largely agree, provided that the regulation is only temporary.", "I largely agree, provided that this rule applies only temporarily.", "I largely agree, provided that the rule is only temporary."], hint: "I largely agree, provided that…" },
          { q: "Tiết kiệm tiền thuê nhà không chỉ là tiết kiệm tiền; đó là mua thêm lựa chọn.", answers: ["Saving on rent is not merely saving money; it is buying options.", "Saving on rent is not just saving money; it is buying options.", "Avoiding rent is not merely saving money; it is buying options.", "Saving on rent is not merely about saving money; it is about buying options."], hint: "not merely…; it is…" },
          { q: "Tuy nhiên, điều đó không có nghĩa là kỹ năng này chỉ học được ở trường.", answers: ["It does not follow, however, that this skill can only be learned at school.", "However, it does not follow that this skill can only be learned at school.", "It does not follow, however, that these skills can only be learned at school.", "However, it does not follow that this skill can only be learnt at school."], hint: "It does not follow, however, that…" },
          { q: "Điều làm hại sự phát triển không phải là công nghệ, mà là cách chúng ta dùng nó.", answers: ["What harms development is not technology but the way we use it.", "What harms development is not technology, but how we use it.", "What undermines development is not technology but the way we use it.", "What damages development is not technology but the way we use it."], hint: "What + V + is not X but Y" },
          { q: "Không hẳn là người trẻ lười đọc, mà là họ đọc theo cách khác.", answers: ["It's less that young people are too lazy to read and more that they read differently.", "It's less that young people are lazy about reading and more that they read in a different way.", "It is less that young people are too lazy to read and more that they read differently.", "It's less that young people don't want to read and more that they read in different ways."], hint: "it's less that… and more that…" },
          { q: "Tôi thừa nhận lập luận này có phần đúng, nhưng nó bỏ qua chi phí.", answers: ["I accept that there is some truth in this argument, but it overlooks the cost.", "There is some truth in this argument, but it overlooks the costs.", "I admit there is some truth in this argument, but it overlooks the cost.", "I accept that this argument is partly true, but it overlooks the cost."], hint: "there is some truth in… · overlook (Ngày 10)" },
        ],
      },
      { t: "h", text: "D. Band 7 hay band 8 khi nói? (6 câu)" },
      {
        t: "mcq", id: "t5d30-bt-noi", title: "Câu trả lời nào gần band 8 hơn?",
        items: [
          { q: "1. “Do you prefer reading on paper or on screen?”", options: ["I prefer paper because it is better for my eyes and I can concentrate better.", "Paper, mostly — I seem to take in more of what I read, though for anything I need to search, a screen wins easily."], correct: 1, why: "Trả lời thẳng + sắc thái (mostly, though…), cụm tự nhiên (take in, wins easily)." },
          { q: "2. Part 3: “Will robots replace teachers?”", options: ["Not entirely, I'd say. They might take over the parts of the job that are about delivering information, but the part that's about noticing when a child is struggling is much harder to automate.", "No, I don't think so. Firstly, robots don't have feelings. Secondly, students need teachers to motivate them. So robots cannot replace teachers."], correct: 0, why: "Lập trường có mức độ, phân tách công việc thành phần — lập luận, không liệt kê." },
          { q: "3. Ngừng giữa câu: “It's… um… the… the thing you use to open tins.”", options: ["Band 8 — ngừng để nghĩ ý", "Dấu hiệu band 7 — ngừng để tìm từ, nhưng xoay xở bằng cách nói vòng tốt"], correct: 1, why: "Ngừng vì thiếu từ (tin opener) là dấu hiệu FC/LR band 7; nói vòng giúp không rơi thấp hơn." },
          { q: "4. Câu mở nào hay hơn cho Part 3 lạ?", options: ["That's a good question.", "That's not something I've given much thought to, but my first instinct is that…"], correct: 1, why: "Mua giờ + báo trước hướng trả lời (Ngày 29 mục 5)." },
          { q: "5. Paraphrase câu hỏi “Why do people move to cities?”", options: ["People move to cities because…", "What draws most people to cities, I think, is…"], correct: 1, why: "Không lặp lại cụm của câu hỏi; câu chẻ giả tự nhiên." },
          { q: "6. Idiom nào dùng đúng chỗ ở Part 3?", options: ["“Raising the fine would just be papering over the cracks — the real problem is that there's no alternative to driving.”", "“My hometown is a piece of cake to live in.”"], correct: 0, why: "paper over the cracks đúng nghĩa, đúng chỗ (Ngày 18); a piece of cake dùng sai ngữ cảnh." },
        ],
      },
      { t: "h", text: "E. Đề 12 và ngày thi (4 câu)" },
      {
        t: "mcq", id: "t5d30-bt-de12", title: "Chọn đáp án đúng",
        items: [
          { q: "1. Thứ tự làm Đề 12 theo ngày thi thật:", options: ["Speaking → Writing → Reading → Listening", "Listening → Reading → Writing, rồi Speaking", "Reading → Listening → Writing → Speaking"], correct: 1, why: "L → R → W liền một mạch; Speaking riêng." },
          { q: "2. Task 1 của Đề 12 là mixed. Việc đầu tiên trong 3 phút đọc hình:", options: ["Viết ngay câu mở bài", "Xác định mỗi hình đo gì, đơn vị gì, của nhóm nào", "Chọn số liệu lớn nhất"], correct: 1, why: "Hai hình có thể dùng hai mẫu số khác nhau — nối sai là mất điểm Task Achievement." },
          { q: "3. Task 2 là Opinion với đề lạ. Câu hỏi đầu tiên tự hỏi:", options: ["Tôi biết gì về chủ đề này?", "Đề thực sự hỏi tôi về điều gì?", "Tôi có từ vựng gì hay?"], correct: 1, why: "Đề lạ hay bị lạc một nửa — xác định câu hỏi trước (Ngày 14 · 29)." },
          { q: "4. Sau Đề 12, việc nên làm NGAY:", options: ["Làm lại Đề 12 để điểm cao hơn", "Ghi điểm 4 kỹ năng, đọc phản hồi, chọn bài yếu nhất để viết lại", "Bỏ qua phản hồi, sang đề mới"], correct: 1, why: "Làm lại đề vừa thi không đo được gì; phản hồi mới là thứ có giá trị." },
        ],
      },
      { t: "h", text: "F. Một trang kế hoạch sau khoá" },
      { t: "p", text: "Viết một trang: ngày thi dự kiến · band mục tiêu từng kỹ năng · kỹ năng thấp nhất ở Đề 12 · MỘT việc sửa cho 2 tuần tới (Bài 3 mục 5) · lịch ôn từ (Bài 1 mục 8) · bạn sẽ dùng kế hoạch 4 tuần ở cuối bài Kiểm tra chặng bắt đầu từ ngày nào. Dán cạnh kịch bản ngày thi của Ngày 29." },
    ],
  },

  /* ════════════════ KIỂM TRA CHẶNG 5 + TỔNG KẾT ════════════════ */
  {
    id: "t5d30-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 25–30) — và tổng kết cả lộ trình IELTS 0 → 8.0",
    goal: "Đo lại chặng cuối của Tập 5 theo 8 phần với ngưỡng đạt ≥ 70 % từng phần, đặt cạnh kết quả Đề 12, biết chính xác ôn lại Ngày nào — rồi nhìn lại cả lộ trình 5 tập, có cách tự ôn sau khoá và kế hoạch 4 tuần trước ngày thi thật.",
    minutes: 180,
    blocks: [
      {
        t: "recap", title: "Cách làm bài kiểm tra này",
        items: [
          "**8 phần**, khoảng 3 giờ. Không làm cùng ngày với Đề 12 nếu đã mệt — làm sáng hôm sau. Có thể chia hai buổi: Phần 1–5 và Phần 6–8.",
          "Không tra từ, không mở lại bài. Nghe **một lần**. Đọc **đúng giờ** (16 phút).",
          "Ngưỡng đạt: ==≥ 70 % từng phần== — không lấy phần này bù phần kia. Viết / Nói: AI ước tính ≥ band 7.5.",
          "Mọi câu ở đây là câu MỚI. Bài đọc dựa trên lịch sử có thật (soạn theo hiểu biết chung, làm tròn); nhân vật trong bài nghe là hư cấu.",
          "Sau bảng kết quả là phần **Tổng kết cả lộ trình 5 tập**, **cách tự ôn sau khoá** và **kế hoạch 4 tuần trước ngày thi thật**.",
        ],
      },

      /* ── Phần 1 ── */
      { t: "h", text: "Phần 1 — Ngữ pháp (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 25, 27, 29)" },
      {
        t: "mcq", id: "t5d30-kt-ngu-phap-chon", title: "1a. Chọn đáp án đúng (12 câu)",
        items: [
          { q: "1. The waste is first shredded ___ small flakes.", options: ["into", "to", "by"], correct: 0, why: "shred / cut / spin INTO — Ngày 25 mục 2." },
          { q: "2. The mixture is heated ___ 80°C and kept ___ that temperature for an hour.", options: ["to · at", "at · to", "in · at"], correct: 0, why: "heated TO (đạt tới) · kept AT (giữ ở) — Ngày 25." },
          { q: "3. Around 2,000 visitors ___ expected at the opening.", options: ["are", "is", "has"], correct: 0, why: "Con số + danh từ đếm từng người ⇒ số nhiều. (Một LƯỢNG như “£400 was spent” mới chia số ít.) — Ngày 25 mục 3." },
          { q: "4. Whether the scheme should continue ___ still unclear.", options: ["is", "are", "were"], correct: 0, why: "Mệnh đề làm chủ ngữ ⇒ số ít — Ngày 25." },
          { q: "5. Museums should be accountable ___ the public ___ what they hold.", options: ["to · for", "for · to", "with · of"], correct: 0, why: "accountable to sb for sth — Ngày 25." },
          { q: "6. ___ had the bridge opened than it began to sway.", options: ["No sooner", "Hardly", "Only"], correct: 0, why: "No sooner had… than… (Hardly đi với when) — ôn tổng Ngày 27." },
          { q: "7. If the town had invested in flood defences, it ___ under water now.", options: ["wouldn't be", "wouldn't have been", "won't be"], correct: 0, why: "Điều kiện hỗn hợp: quá khứ → hiện tại (now) — ôn tổng Ngày 27." },
          { q: "8. The report, ___ in 2019, was largely ignored.", options: ["published", "publishing", "was published"], correct: 0, why: "Rút gọn mệnh đề quan hệ bị động: (which was) published — ôn tổng Ngày 27." },
          { q: "9. It is essential that every candidate ___ the original ID.", options: ["bring", "brings", "brought"], correct: 0, why: "Thức giả định sau It is essential that — ôn tổng Ngày 27." },
          { q: "10. Could you tell me where ___?", options: ["the Speaking room is", "is the Speaking room", "does the Speaking room"], correct: 0, why: "Câu hỏi gián tiếp: trật tự câu kể — Ngày 29 mục 4." },
          { q: "11. I was wondering ___ I could change seats.", options: ["if", "that", "what"], correct: 0, why: "I was wondering if / whether — Ngày 29." },
          { q: "12. ___ this means for older workers is that retraining must be free.", options: ["What", "That", "Which"], correct: 0, why: "Câu chẻ giả kéo về đề: What this means for… is that… — Ngày 29 mục 8." },
        ],
      },
      {
        t: "quiz", id: "t5d30-kt-ngu-phap-dien", kind: "fill", title: "1b. Điền MỘT từ (6 câu)",
        items: [
          { q: "1. The process consists ___ seven stages.", answers: ["of"], hint: "Ngày 25" },
          { q: "2. They refused on the grounds ___ the vase was too fragile.", answers: ["that"], hint: "Ngày 25 — on the grounds that + câu" },
          { q: "3. Great museums protect ___ heritage of humanity. (MỘT từ)", answers: ["the"], hint: "the heritage of humanity — heritage được xác định bởi of humanity ⇒ the; còn humanity nói chung thì không mạo từ. Ngày 25 mục 4." },
          { q: "4. Not only ___ the plan expensive, but it was also unpopular.", answers: ["was"], hint: "Ôn tổng Ngày 27 — đảo ngữ sau Not only" },
          { q: "5. Do you know when the results ___ come out? (MỘT từ)", answers: ["will"], hint: "Ngày 29 — câu hỏi gián tiếp giữ will sau chủ ngữ" },
          { q: "6. It is ___ this reason that I support the proposal.", answers: ["for"], hint: "Ngày 29 — It is for this reason that…" },
        ],
      },

      /* ── Phần 2 ── */
      { t: "h", text: "Phần 2 — Từ vựng (10 + 6 câu · đạt ≥ 12/16 · trượt thì ôn Ngày 26, 28, 30)" },
      {
        t: "mcq", id: "t5d30-kt-tu-vung-chon", title: "2a. Chọn từ đúng (10 câu)",
        items: [
          { q: "1. Households that spend a large share of income just to keep warm are in ___.", options: ["fuel poverty", "energy independence", "peak demand"], correct: 0, why: "fuel poverty — Ngày 26." },
          { q: "2. Coal plants that can no longer be used profitably become ___.", options: ["stranded assets", "baseload", "smart meters"], correct: 0, why: "stranded assets — Ngày 26." },
          { q: "3. When a community gradually stops using its own language in favour of another, this is ___.", options: ["language shift", "code-switching", "immersion"], correct: 0, why: "language shift — Ngày 26 (code-switching: chuyển qua lại trong một cuộc nói)." },
          { q: "4. A shortened version of a book is ___.", options: ["abridged", "out of print", "self-published"], correct: 0, why: "abridged — Ngày 26." },
          { q: "5. Spanish and Italian are partly ___ — speakers can understand each other to some degree.", options: ["mutually intelligible", "monolingual", "vernacular"], correct: 0, why: "mutually intelligible — Ngày 26." },
          { q: "6. Independent tests have failed to ___ the manufacturer's claims.", options: ["alleviate", "corroborate", "engender"], correct: 1, why: "corroborate = xác nhận bằng nguồn độc lập (Ngày 28 nhóm A). alleviate = làm dịu; engender = làm nảy sinh (thái độ, cảm xúc)." },
          { q: "7. The link between the two trends turned out to be ___: both were caused by the hot summer.", options: ["spurious", "tacit", "ephemeral"], correct: 0, why: "spurious = giả, không có thật — tương quan giả do một yếu tố thứ ba (Ngày 28 nhóm B). tacit = ngầm; ephemeral = chóng tàn." },
          { q: "8. After months of talks, the two sides have reached an ___ and neither will compromise.", options: ["crux", "plethora", "impasse"], correct: 2, why: "reach an impasse = rơi vào bế tắc (Ngày 28 nhóm C). the crux = mấu chốt; a plethora of = vô số." },
          { q: "9. Online check-in ___ the need to queue at the airport desk.", options: ["obviates", "belies", "encroaches"], correct: 0, why: "obviate the need (for / to V) = khiến không còn cần (Ngày 28 nhóm A). belie = che giấu, trái với vẻ ngoài; encroach on = xâm lấn dần." },
          { q: "10. Compliment: “He's ___ with money — he saved for years to buy the house.”", options: ["thrifty", "stingy"], correct: 0, why: "Sắc thái khen — Ngày 6 · 30." },
        ],
      },
      {
        t: "quiz", id: "t5d30-kt-tu-vung-dien", kind: "fill", title: "2b. Điền MỘT từ (6 câu)",
        items: [
          { q: "1. Solar power is ______ — it depends on the weather. (Ngày 16)", answers: ["intermittent"], hint: "intermittent" },
          { q: "2. Many firms pay lip ______ to sustainability. (Ngày 18 · 30)", answers: ["service"], hint: "pay lip service to" },
          { q: "3. More money only papered over the ______. (Ngày 18 · 30)", answers: ["cracks"], hint: "paper over the cracks" },
          { q: "4. With ______, the decision was clearly wrong. (Ngày 14 · 30)", answers: ["hindsight"], hint: "with hindsight" },
          { q: "5. A heritage ______ is one spoken at home by a minority family. (Ngày 26)", answers: ["language"], hint: "heritage language" },
          { q: "6. Cheaper cars do not mean more people should drive — it does not ______. (Ngày 10 · 30)", answers: ["follow"], hint: "it does not follow" },
        ],
      },

      /* ── Phần 3 ── */
      { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
      {
        t: "quiz", id: "t5d30-kt-dich", kind: "translate", grammar: "giới từ cố định · hoà hợp · câu hỏi gián tiếp · câu kéo về đề · lập trường có điều kiện",
        title: "Dịch sang tiếng Anh",
        items: [
          { q: "Các chai được phân loại theo màu rồi được cắt thành mảnh nhỏ.", answers: ["The bottles are sorted by colour and then cut into small flakes.", "The bottles are sorted according to colour and then cut into small flakes.", "The bottles are sorted by colour before being cut into small flakes.", "The bottles are sorted by color and then cut into small flakes."], hint: "Ngày 25 — sorted by · cut into" },
          { q: "Cần khoảng 30 chai để làm một chiếc áo.", answers: ["Around 30 bottles are needed to make one jacket.", "About 30 bottles are needed to make one jacket.", "Roughly 30 bottles are needed to make a jacket.", "Around 30 bottles are needed to make a jacket."], hint: "Ngày 25 — bottles are" },
          { q: "Anh có biết khi nào có kết quả không?", answers: ["Do you know when the results will be available?", "Do you know when the results come out?", "Do you know when the results will come out?", "Do you know when the results will be released?"], hint: "Ngày 29 — trật tự câu kể" },
          { q: "Chính vì lý do này mà tôi ủng hộ việc dạy ngôn ngữ đó ở trường.", answers: ["It is for this reason that I support teaching the language at school.", "It is for this reason that I support teaching that language in schools.", "It's for this reason that I support teaching the language in schools.", "It is for this reason that I am in favour of teaching the language at school."], hint: "Ngày 29 — It is for this reason that…" },
          { q: "Tôi phần lớn đồng ý, với điều kiện là sinh viên phải đóng góp vào tiền nhà.", answers: ["I largely agree, provided that students contribute to the rent.", "I largely agree, provided that students contribute towards the rent.", "I largely agree, provided that the students contribute to the rent.", "I largely agree, provided students contribute to the rent."], hint: "Ngày 30 — provided that" },
          { q: "Không hẳn là mọi người không muốn tiết kiệm năng lượng, mà là họ không đủ tiền để cải tạo nhà.", answers: ["It's less that people don't want to save energy and more that they can't afford to retrofit their homes.", "It is less that people don't want to save energy and more that they cannot afford to retrofit their homes.", "It's less that people are unwilling to save energy and more that they can't afford to retrofit their homes.", "It's less that people don't want to save energy and more that they can't afford to renovate their homes."], hint: "Ngày 26 (retrofit) · Ngày 30 (it's less that… and more that…)" },
        ],
      },

      /* ── Phần 4 ── */
      { t: "h", text: "Phần 4 — Nghe (5 + 5 câu · đạt ≥ 7/10 · trượt thì ôn Ngày 25, 28, 29)" },
      { t: "p", text: "Hai đoạn, mỗi đoạn nghe **một lần**. Đọc câu hỏi 30 giây trước mỗi đoạn." },
      {
        t: "listen", id: "t5d30-kt-nghe-nha", title: "A house meeting",
        dan: { so: "Day 30, Review 1", boiCanh: "three people who share a house, Callum, Ruby and Jess, discussing some changes.", cau: [1, 5] },
        lines: [
          { who: "Callum", voice: "uk-nam", text: "Right, house meeting. Three things: the bills, the cleaning, and Jess's idea about the internet." },
          { who: "Ruby", voice: "au-nu", text: "Bills first. At the moment we split everything three ways, but I'm away every other weekend now, so I was going to suggest I pay a bit less for heating." },
          { who: "Jess", voice: "us-nu", text: "I get the logic, but heating's mostly on in the evenings during the week, and you're here for those. I'd rather keep it equal and just make sure nobody leaves it on when the house is empty." },
          { who: "Ruby", voice: "au-nu", text: "That's fair, actually. Equal, then — as long as the timer's set properly." },
          { who: "Callum", voice: "uk-nam", text: "Cleaning. The rota on the fridge isn't working. I'm happy to keep doing the kitchen if someone takes over the bathroom permanently, rather than us rotating every week." },
          { who: "Jess", voice: "us-nu", text: "I'll take the bathroom. Ruby, could you do the bins and the hallway?" },
          { who: "Ruby", voice: "au-nu", text: "Bins, yes. The hallway hardly needs doing — can we just do it together once a month?" },
          { who: "Callum", voice: "uk-nam", text: "Fine by me. And the internet?" },
          { who: "Jess", voice: "us-nu", text: "So, I work from home three days a week and the connection keeps dropping during calls. The faster package is eight pounds a month more. I'm not asking you to pay for it — I'll cover the difference myself." },
          { who: "Callum", voice: "uk-nam", text: "Don't be daft, we'd all use it. Split it three ways." },
          { who: "Ruby", voice: "au-nu", text: "Agreed. But we're signing up for twelve months, not twenty-four, in case one of us moves out." },
        ],
      },
      {
        t: "mcq", id: "t5d30-kt-nghe-nha-cau", title: "Questions 1–5 — Choose the correct letter, A, B or C",
        items: [
          { q: "1. What do they decide about the heating bill?", options: ["A  Ruby will pay less.", "B  It will be split equally.", "C  Jess will pay more."], correct: 1, why: "Ruby đề nghị trả ít hơn → Jess phản bác → Ruby: “That's fair, actually. Equal, then”. Đáp án là bản CUỐI." },
          { q: "2. What condition does Ruby add?", options: ["A  The timer must be set correctly.", "B  Bills must be paid monthly.", "C  The heating must be turned off at weekends."], correct: 0, why: "“as long as the timer's set properly”." },
          { q: "3. Who will clean the bathroom?", options: ["A  Callum", "B  Ruby", "C  Jess"], correct: 2, why: "“I'll take the bathroom.” — Jess. Callum giữ bếp." },
          { q: "4. How will the faster internet be paid for?", options: ["A  Jess will pay the extra cost.", "B  The cost will be shared by all three.", "C  Callum will pay half."], correct: 1, why: "Jess đề nghị tự trả → Callum: “Split it three ways” → Ruby: “Agreed”." },
          { q: "5. Why does Ruby want a twelve-month contract?", options: ["A  It is cheaper.", "B  Someone may leave the house.", "C  The provider requires it."], correct: 1, why: "“in case one of us moves out”." },
        ],
      },
      { t: "p", text: "**Questions 6–10.** Complete the notes. Write **ONE WORD ONLY** for each answer." },
      {
        t: "table", caption: "EARWORMS — lecture notes",
        head: ["", ""],
        rows: [
          ["Scientific name", "involuntary musical **6** ______"],
          ["Common triggers", "recent exposure; a memory; a mind that is **7** ______"],
          ["Songs most likely to stick", "fairly fast **8** ______; a simple melody with an unusual interval"],
          ["Ways to stop one", "listen to the whole song; a task of moderate difficulty; chewing **9** ______"],
          ["Main point of lecture", "earworms are a sign of normal **10** ______, not a disorder"],
        ],
      },
      {
        t: "listen", id: "t5d30-kt-nghe-earworm", title: "Lecture: earworms",
        dan: { so: "Day 30, Review 2", boiCanh: "part of a psychology lecture about songs that get stuck in people's heads.", cau: [6, 10] },
        lines: [
          { who: "Lecturer", voice: "ca-nam", text: "You'll all have had the experience of a tune that simply won't leave your head. Researchers call it involuntary musical imagery — “imagery” because you're hearing music that isn't there — though most of us know it as an earworm." },
          { who: "Lecturer", voice: "ca-nam", text: "What sets one off? The most obvious trigger is recent exposure: you heard the song this morning. But memories can do it — a word, a place — and so can the state of the mind itself. People report earworms most often when their mind is idle: walking, showering, waiting for a bus. A busy mind is a poor host; an idle one is an open door." },
          { who: "Lecturer", voice: "ca-nam", text: "Not all songs are equally sticky. One large study suggested that the most persistent tunes tend to have a fairly fast tempo, and a melody that is mostly simple and predictable but contains one or two unusual leaps. Simple enough to remember, surprising enough to keep the brain interested." },
          { who: "Lecturer", voice: "ca-nam", text: "And getting rid of one? Some people find that listening to the whole song helps — the theory being that the brain is replaying an unfinished fragment. A task of moderate difficulty works better than an easy one or a very hard one. And, rather oddly, one study found that chewing gum reduced earworms, perhaps because it occupies the same systems we use for silent rehearsal of words and sounds." },
          { who: "Lecturer", voice: "ca-nam", text: "But I don't want you to leave thinking this is a problem to be solved. For the vast majority of people, earworms are harmless and short-lived. They're a by-product of perfectly normal memory — the same machinery that lets you rehearse a phone number or a line of a poem." },
        ],
      },
      {
        t: "quiz", id: "t5d30-kt-nghe-earworm-cau", kind: "fill", title: "Questions 6–10",
        items: [
          { q: "6. involuntary musical ______", answers: ["imagery"], hint: "“Researchers call it involuntary musical imagery”." },
          { q: "7. a mind that is ______", answers: ["idle"], hint: "“most often when their mind is idle”. Bẫy: busy (“a poor host”)." },
          { q: "8. fairly fast ______", answers: ["tempo"], hint: "“a fairly fast tempo”." },
          { q: "9. chewing ______", answers: ["gum"], hint: "“chewing gum reduced earworms”." },
          { q: "10. a sign of normal ______", answers: ["memory"], hint: "“a by-product of perfectly normal memory” — by-product ≈ sign. not a disorder = not a problem to be solved." },
        ],
      },

      /* ── Phần 5 ── */
      { t: "h", text: "Phần 5 — Đọc (4 + 5 + 3 câu · đạt ≥ 9/12 · 16 phút · trượt thì ôn Ngày 25, 27, 29)" },
      {
        t: "passage", title: "The End of the Surgeon's Race",
        intro: "Bài tự soạn cho bài kiểm tra (~390 từ). Dữ kiện lịch sử là có thật, kể gọn và làm tròn con số.",
        paras: [
          { label: "A", text: "Before the 1840s, the most admired quality in a surgeon was speed. With no reliable way of preventing pain, operations were performed on conscious patients held down by assistants, and an amputation that took more than a few minutes was considered slow. Alcohol and opium dulled the senses but could not remove the agony, and some patients chose to die rather than face the knife." },
          { label: "B", text: "The means of relief had, in a sense, been available for decades. Around 1800 the English chemist Humphry Davy, experimenting on himself with nitrous oxide, noted that the gas appeared to relieve pain and suggested that it might be useful during surgery. Nobody acted on the suggestion. For the next forty years the gas was better known as an entertainment, inhaled by volunteers at public shows for the amusement of audiences." },
          { label: "C", text: "In 1842 a country doctor in Georgia, Crawford Long, removed a growth from a patient's neck after making him breathe ether. Long repeated the procedure several times but did not publish his results until 1849. Meanwhile, a dentist named Horace Wells began extracting teeth under nitrous oxide; but when he attempted a public demonstration in Boston in 1845, the patient cried out, the audience jeered, and Wells was dismissed as a fraud." },
          { label: "D", text: "The decisive event came the following year. In October 1846, at the Massachusetts General Hospital, another dentist, William Morton, administered ether to a young man while a surgeon removed a tumour from his neck. The patient felt nothing, and news of the operation crossed the Atlantic within weeks. Morton, however, tried to keep the substance secret, giving it a new name and disguising its smell in the hope of profiting from a patent. The dispute over who deserved the credit lasted for the rest of the participants' lives, and it reflects well on none of them." },
          { label: "E", text: "Ether had drawbacks: it irritated the lungs and was highly flammable. In 1847 the Edinburgh doctor James Young Simpson introduced chloroform, which acted faster and was more pleasant to inhale, and its reputation rose further when Queen Victoria was given it during the birth of a child in 1853. Yet it would be a mistake to see chloroform simply as progress. It was also more dangerous, and the first recorded death of a patient under chloroform occurred within months of its introduction." },
        ],
      },
      {
        t: "mcq", id: "t5d30-kt-doc-nguoi", title: "Questions 1–4 — Which person (A–E) …?   A Davy · B Long · C Wells · D Morton · E Simpson",
        items: [
          { q: "1. delayed making his findings public", options: ["A Davy", "B Long", "C Wells", "D Morton", "E Simpson"], correct: 1, why: "Đoạn C: Long dùng ether năm 1842 nhưng “did not publish his results until 1849”." },
          { q: "2. was publicly humiliated when a demonstration failed", options: ["A Davy", "B Long", "C Wells", "D Morton", "E Simpson"], correct: 2, why: "Đoạn C: “the audience jeered, and Wells was dismissed as a fraud”." },
          { q: "3. tried to make money by hiding the identity of a substance", options: ["A Davy", "B Long", "C Wells", "D Morton", "E Simpson"], correct: 3, why: "Đoạn D: “tried to keep the substance secret… in the hope of profiting from a patent”." },
          { q: "4. made a proposal that was not followed for many years", options: ["A Davy", "B Long", "C Wells", "D Morton", "E Simpson"], correct: 0, why: "Đoạn B: Davy “suggested that it might be useful during surgery. Nobody acted on the suggestion. For the next forty years…”." },
        ],
      },
      {
        t: "mcq", id: "t5d30-kt-doc-tfng", title: "Questions 5–9 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "5. Before the 1840s, some patients preferred death to an operation.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn A: “some patients chose to die rather than face the knife”." },
          { q: "6. Davy tested nitrous oxide on patients during surgery.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn B: Davy thử trên CHÍNH MÌNH, chỉ đề xuất dùng trong phẫu thuật; “Nobody acted on the suggestion”." },
          { q: "7. Wells's 1845 demonstration took place in a hospital.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn C chỉ nói “in Boston” — không nói ở đâu trong Boston. Bệnh viện xuất hiện ở đoạn D (Morton 1846) — bẫy đứng gần." },
          { q: "8. News of Morton's operation reached Europe quickly.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn D: “crossed the Atlantic within weeks”." },
          { q: "9. The writer regards chloroform as a straightforward improvement on ether.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn E: “it would be a mistake to see chloroform simply as progress. It was also more dangerous” — ngược lại." },
        ],
      },
      {
        t: "quiz", id: "t5d30-kt-doc-dien", kind: "fill", title: "Questions 10–12 — ONE WORD ONLY from the passage",
        items: [
          { q: "10. Before anaesthesia, the quality most admired in a surgeon was ______.", answers: ["speed"], hint: "Đoạn A." },
          { q: "11. For about forty years, nitrous oxide was known mainly as a form of ______.", answers: ["entertainment"], hint: "Đoạn B." },
          { q: "12. One disadvantage of ether was that it was highly ______.", answers: ["flammable"], hint: "Đoạn E. (irritated the lungs là ý kia — động từ, không vừa chỗ trống)" },
        ],
      },

      /* ── Phần 6 ── */
      { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 25, 28, 29, 30)" },
      {
        t: "quiz", id: "t5d30-kt-viet-sua", kind: "fill", title: "6a. Mỗi câu MỘT lỗi — gõ lại cả câu đúng (6 câu · đạt ≥ 5/6)",
        items: [
          { q: "1. The process is consisted of eight stages.", answers: ["The process consists of eight stages.", "The process is made up of eight stages.", "The process is composed of eight stages."], hint: "consist không có bị động — Ngày 25" },
          { q: "2. Each of the four regions have its own system.", answers: ["Each of the four regions has its own system."], hint: "Each of ⇒ số ít — Ngày 25" },
          { q: "3. Governments are responsible of protecting heritage.", answers: ["Governments are responsible for protecting heritage."], hint: "responsible for — Ngày 25" },
          { q: "4. In my opinion, I strongly believe that the law should change.", answers: ["I strongly believe that the law should change.", "In my opinion, the law should change."], hint: "Thừa “In my opinion, I…” — Ngày 30" },
          { q: "5. Could you tell me when does the test start?", answers: ["Could you tell me when the test starts?"], hint: "Ngày 29" },
          { q: "6. Although the plan is costly, but it is necessary.", answers: ["Although the plan is costly, it is necessary.", "The plan is costly, but it is necessary."], hint: "Although… but… — Ngày 25 mục 6" },
        ],
      },
      {
        t: "essay", id: "t5d30-kt-viet-task1", task: "Task 1", minWords: 150,
        prompt: "The table shows the average number of minutes per day that university students in one country spent on four activities in 2010 and 2025 (figures invented for this test). 2010 — Social media 45, Reading for pleasure 38, Exercise 32, Paid work 50. 2025 — Social media 128, Reading for pleasure 14, Exercise 35, Paid work 88. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview: thời gian cho mạng xã hội và việc làm thêm tăng mạnh; đọc sách giảm; thể dục gần như không đổi. Không số liệu trong overview.",
          "Nhóm: hai hoạt động tăng · một giảm · một ổn định. Một câu bội số (45 → 128: gần gấp ba).",
          "Đơn vị là PHÚT MỖI NGÀY — không viết “students” hay “percent”.",
          "Soát “3 + 2” trước khi nộp.",
        ],
      },
      {
        t: "essay", id: "t5d30-kt-viet-task2", task: "Task 2", minWords: 250,
        prompt: "In many countries, a growing number of adults are returning to full-time or part-time education in their thirties and forties. Why is this happening? Is it a positive or negative development? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        tips: [
          "Two-part: đếm vế — (1) VÌ SAO, (2) tích cực hay tiêu cực. Thesis trả lời CẢ HAI trong một hai câu (Ngày 28).",
          "Lập trường có điều kiện (largely positive, provided that…) — Ngày 30 Bài 2.",
          "Một ý phát triển sâu mỗi đoạn; một nhượng bộ thật + phản bác (it does not follow that…).",
          "Nếu phát hiện lạc một nửa lúc viết: câu kéo về đề (Ngày 29 mục 8) — tối đa một lần.",
        ],
      },

      /* ── Phần 7 ── */
      { t: "h", text: "Phần 7 — Nói (4 câu Part 1 + Part 2 + 4 câu Part 3 · AI ≥ band 7.5 ước tính · trượt thì ôn Ngày 27, 29, 30)" },
      {
        t: "speak", id: "t5d30-kt-noi-p1", part: "1",
        questions: [
          "Do you often borrow things from friends?",
          "Do you like lending your things to other people?",
          "Have you ever forgotten to give something back?",
          "Is it common to borrow books in your country?",
        ],
      },
      {
        t: "speak", id: "t5d30-kt-noi-p2", part: "2",
        questions: [
          "Describe something you borrowed from another person. You should say: what it was; who you borrowed it from; why you needed to borrow it; and explain how you felt about borrowing it.",
          "Have you ever lent that person something in return?",
        ],
      },
      {
        t: "speak", id: "t5d30-kt-noi-p3", part: "3",
        questions: [
          "Why are some people reluctant to lend things, even to friends?",
          "Do you think sharing things within a community will become more common?",
          "Is it the government's job to encourage people to share rather than buy?",
          "But wouldn't that hurt businesses that sell those things?",
        ],
      },
      {
        t: "note", title: "Tự chấm phần Nói — nghe lại bản ghi và trả lời có / không",
        items: [
          "**Part 1:** câu trả lời 2–3 câu, có một chi tiết thật, không dùng câu mua giờ cho câu dễ (Ngày 29 mục 5)?",
          "**Part 2:** đủ bốn ý, đủ gần 2 phút; khi hết ý có chuyển sang cảm nghĩ bây giờ thay vì dừng (Ngày 29 mục 9)?",
          "**Part 3:** câu “Why…?” có khung “ý hiển nhiên + But I don't think that's the whole story + ý sâu hơn” (Ngày 30 Bài 3 mục 3)?",
          "**Câu 4 Part 3 (phản biện của giám khảo):** tôi thừa nhận phần đúng rồi giữ lập trường, không đổi ý chỉ vì bị hỏi vặn (Ngày 27)?",
          "**Paraphrase:** không câu nào lặp nguyên văn câu hỏi?",
        ],
      },

      /* ── Phần 8 ── */
      { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm của Ngày 25–30)" },
      {
        t: "mcq", id: "t5d30-kt-phat-am", title: "8. Chọn đáp án đúng (8 câu)",
        items: [
          { q: "1. “double seven” trong một số điện thoại đọc:", options: ["/dʌbl sevn/ — một cụm, nhấn DOUble", "/duːbl sevn/", "/dʌbl sev ən/ tách ba nhịp"], correct: 0, why: "Ngày 25 mục phát âm số." },
          { q: "2. thirteen vs thirty — trọng âm:", options: ["thirTEEN · THIRty", "THIRteen · thirTY", "giống nhau"], correct: 0, why: "Ngày 25." },
          { q: "3. “Could you tell me…” nói nhanh:", options: ["/kʊdʒə tel miː/", "/kʊd juː tel miː/ tách rõ", "/kəʊld juː/"], correct: 0, why: "d + y ⇒ /dʒ/ — Ngày 29 mục 14." },
          { q: "4. Câu hỏi Wh- GIÁN TIẾP (Could you tell me where the room is?) — giọng cuối câu:", options: ["thường đi xuống như câu kể", "luôn đi lên", "giữ ngang"], correct: 0, why: "Ngày 29." },
          { q: "5. “different” khi nói tự nhiên:", options: ["/dɪfrənt/ hai âm tiết", "/dɪfərent/ bốn âm tiết rõ", "/daɪfrənt/"], correct: 0, why: "Ngày 29." },
          { q: "6. Trong “It's less that journalists are drawn to bad news”, are đọc:", options: ["/ə/ yếu", "/ɑː/ mạnh", "bỏ hẳn cả câu"], correct: 0, why: "Trợ động từ trong câu kể đọc yếu — Ngày 30 Bài 3 mục 6." },
          { q: "7. “Bad news happens on a particular DAY” — nhấn DAY vì:", options: ["nó đối lập với gradually ở câu trước", "nó là từ cuối câu", "nó là danh từ"], correct: 0, why: "Nhấn vào từ mang ý ĐỐI LẬP — Ngày 30." },
          { q: "8. “sudden” đọc:", options: ["/sʌdn/", "/suːden/", "/sʌdɛn/"], correct: 0, why: "Âm /ə/ rơi trước /n/ — Ngày 30." },
        ],
      },

      { t: "h", text: "Xong bài kiểm tra — bảng kết quả" },
      {
        t: "table",
        head: ["Phần", "Ngưỡng đạt", "Trượt thì ôn", "Điểm của bạn"],
        rows: [
          ["1. Ngữ pháp", "≥ 13/18", "Ngày 25 (câu 1–5, 1b.1–3) · Ngày 27 (câu 6–9, 1b.4) · Ngày 29 (câu 10–12, 1b.5–6)", "…… /18"],
          ["2. Từ vựng", "≥ 12/16", "Ngày 26 (câu 1–5, 2b.5) · Ngày 4 · 28 (câu 6–9) · Ngày 30 Bài 1 (câu 10, 2b.2–4, 2b.6) · Ngày 16 (2b.1)", "…… /16"],
          ["3. Dịch", "≥ 5/6", "Câu 1–2 → Ngày 25 · 3–4 → Ngày 29 · 5–6 → Ngày 30 (6 còn Ngày 26)", "…… /6"],
          ["4. Nghe", "≥ 7/10", "Câu 1–5 (ba người, đổi ý) → Ngày 25 · 28 · Câu 6–10 (bài giảng, note) → Ngày 28 · 29", "…… /10"],
          ["5. Đọc", "≥ 9/12", "Câu 1–4 (matching features) → Ngày 29 Bài 2 · Câu 5–9 (TFNG, bẫy đứng gần) → Ngày 25 · 27 · Câu 10–12 → Ngày 29", "…… /12"],
          ["6. Viết", "6a ≥ 5/6 · AI ≥ 7.5", "Task 2 Two-part → Ngày 28 · lập trường + viết lại → Ngày 30 · Task 1 table → Ngày 26 · câu sai → Ngày 25 · 29", "…… /6 · T1 …… · T2 ……"],
          ["7. Nói", "AI ≥ 7.5", "Part 1 · 2 → Ngày 29 · Part 3 → Ngày 27 · 30", "P1 …… · P2 …… · P3 ……"],
          ["8. Phát âm", "≥ 6/8", "Câu 1–2 → Ngày 25 · 3–5 → Ngày 29 · 6–8 → Ngày 30", "…… /8"],
        ],
      },
      {
        t: "note", title: "📌 Đặt kết quả cạnh Đề 12",
        items: [
          "**Đạt cả 8 phần + Đề 12 ≥ 7.5:** bạn đã xong Tập 5. Đọc phần tổng kết bên dưới và chọn ngày thi thật.",
          "**Trượt 1–2 phần:** ôn đúng Ngày ghi trong bảng, làm lại riêng phần đó sau 48 giờ. Không cần chờ để đặt lịch thi nếu Đề 12 đã ≥ 7.5.",
          "**Trượt từ 3 phần hoặc Đề 12 < 7.0:** chưa nên đặt lịch thi trong 4 tuần tới. Dùng kế hoạch 4 tuần bên dưới hai lượt: lượt đầu sửa nền, lượt sau mới tính ngày thi.",
        ],
      },

      /* ── TỔNG KẾT ── */
      { t: "h", text: "🏁 Tổng kết cả lộ trình 5 tập — bạn đã đi qua những gì" },
      {
        t: "table", caption: "Lộ trình IELTS Academic 0 → 8.0 trên cuongthai.com",
        head: ["Tập", "Band", "Số ngày", "Trọng tâm đã học", "Đề"],
        rows: [
          ["Tập 1", "mất gốc → 4.0", "15", "44 âm tiếng Anh, thì cơ bản, câu đơn – câu ghép, đánh vần và số trong Listening, những dạng câu hỏi đầu tiên", "Đề 1"],
          ["Tập 2", "4.0 → 5.0", "24", "đủ 14 dạng Reading lần đầu, paraphrase, khung bài Task 1 và Task 2, Part 1–3 ở mức nhập, email công việc", "Đề 2 · 3"],
          ["Tập 3", "5.0 → 6.0", "30", "Writing là trọng tâm: band 5 vs 6, đếm vế đề, mọi dạng Task 1; Passage ~800 từ, nghe ~150 từ / phút, giọng Canada và New Zealand", "Đề 4 · 5"],
          ["Tập 4", "6.0 → 7.0", "30", "độ chính xác: collocation, lỗi nhỏ, Passage 3 và Part 4, idiom đúng chỗ, phòng nói AI lần đầu, giọng Ireland", "Đề 6 · 7 · 8"],
          ["Tập 5", "7.0 → 8.0", "30", "độ chính xác tuyệt đối, lập trường tinh, 100 từ band 8, AWL 570, đọc một lượt, nghe tốc độ thật giọng trộn, mổ đề, thi như người chuyên nghiệp", "Đề 9 · 10 · 11 · 12"],
        ],
      },
      {
        t: "table", caption: "Mục tiêu đo được cuối Tập 5 — tick những dòng bạn đã đạt",
        head: ["Kỹ năng", "Mục tiêu", "Đo ở đâu", "Đạt?"],
        rows: [
          ["Listening", "≥ 35/40 ở 3 đề liên tiếp", "Đề 10 · 11 · 12 (hoặc 3 đề cũ làm lại cách ≥ 4 tuần)", "…"],
          ["Reading", "≥ 35/40 ở 3 đề liên tiếp", "Đề 10 · 11 · 12 · Reading 3 passage lần 3 (Ngày 27)", "…"],
          ["Writing", "8.0 — mỗi bài 0–1 câu có lỗi, cohesion tự nhiên, từ chính xác", "Đề 12 + bài viết lại hôm nay (AI + phiếu B6)", "…"],
          ["Speaking", "8.0 — ngắt vì ý, idiom khéo, giọng mẹ đẻ ảnh hưởng tối thiểu", "Đề 12 phòng nói AI", "…"],
          ["Từ vựng", "AWL 570 họ chủ động · 100 từ band 8 dùng đúng · nhớ sau 7 ngày ≥ 90 %", "Bài 1 hôm nay · Flashcards", "…"],
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Năm thứ bạn mang ra khỏi khoá học", center: "Tự học được tới band 8",
        branches: [
          { label: "Sổ lỗi", items: ["đếm CÂU có lỗi", "hai “lượt của tôi” khi soát"] },
          { label: "Con mắt giám khảo", items: ["phiếu tự chấm 12 dòng", "lệch AI ≤ 0.5"] },
          { label: "Checklist dạng câu", items: ["16 dạng Reading", "14 dạng Listening"] },
          { label: "Kho ngôn ngữ", items: ["cụm + câu của tôi", "ôn 1 – 3 – 7 – 21 – 60"] },
          { label: "Kịch bản ngày thi", items: ["đếm ngược 14 ngày", "cứu câu lỡ, cứu bài lạc đề"] },
        ],
      },

      { t: "h", text: "Cách tự ôn sau khoá — một tuần mẫu (60–90 phút mỗi ngày)" },
      {
        t: "table",
        head: ["Ngày", "Việc chính (45–60')", "Việc nhỏ (15–30')"],
        rows: [
          ["Thứ Hai", "Reading: 1 passage khó, 20 phút + mổ câu sai theo checklist 16 dạng", "20 thẻ Flashcards"],
          ["Thứ Ba", "Writing Task 2: lập dàn 5 phút + viết 35 phút, AI chấm, điền phiếu B6", "Part 3: 2 câu, ghi âm"],
          ["Thứ Tư", "Listening: 2 Part, nghe một lần, mổ theo checklist 14 dạng", "20 thẻ Flashcards"],
          ["Thứ Năm", "Writing Task 1: 1 dạng (luân phiên 7 dạng), 20 phút", "Part 1: 4 câu, ghi âm"],
          ["Thứ Sáu", "Ôn sổ lỗi: viết lại 5 câu sai cũ cho đúng, không nhìn", "Một khối phatam bất kỳ của Tập 4–5"],
          ["Thứ Bảy", "Part 2: một thẻ mới đủ 2 phút + Part 3 nối theo · hoặc phòng nói AI (2 tuần một lần)", "Đọc / nghe tiếng Anh thật 30 phút (báo, podcast) — ghi 5 cụm"],
          ["Chủ nhật", "Nghỉ — hoặc một đề đủ 4 kỹ năng (mỗi 2–3 tuần)", "Xem lại cả tuần: tiêu chí thấp nhất có nhích không?"],
        ],
      },
      {
        t: "note", title: "💡 Công cụ của khoá dùng tiếp sau Tập 5",
        items: [
          "**Online Test** (`/language/en/ielts/thi-may`): Đề 0–12 làm lại được — chỉ làm lại một đề khi đã cách ≥ 4 tuần, và đọc kết quả như đề mới. Với đề hoàn toàn mới, dùng sách đề luyện thi chính thức bạn tự mua.",
          "**Sổ lỗi tự động** (`/language/en/ielts/so-loi`): mọi câu sai của Online Test tự vào sổ — ôn mỗi Thứ Sáu.",
          "**Flashcards** (`/language/en/ielts/the-tu`): bộ “Từ của khoá — Tập 5”, “AWL 570”.",
          "**Luyện thêm theo chặng** (`/language/en/ielts/luyen-them`) và **Gia sư IELTS** trong khoá khi cần giải thích một câu cụ thể.",
          "Ngày còn yếu ở Tập 4 (6.0 → 7.0) vẫn mở — ôn lại một Ngày Tập 4 tốt hơn học thêm tài liệu mới.",
        ],
      },

      { t: "h", text: "Kế hoạch 4 tuần trước ngày thi thật" },
      {
        t: "table", caption: "Tuần 3–4 trùng với lịch đếm ngược 14 ngày của Ngày 29 Bài 1 mục 1",
        head: ["Tuần", "Mục tiêu", "Việc mỗi ngày (~90')", "Mốc kiểm"],
        rows: [
          ["**Tuần 1** (D-28 → D-22)", "Chẩn đoán lại", "Ngày 1: một đề đủ 4 kỹ năng (đề mới hoặc đề cũ cách ≥ 4 tuần), đúng thứ tự và giờ của buổi thi thật. Ngày 2–7: tuần mẫu ở trên, dồn 60 % thời gian cho kỹ năng thấp nhất của đề đó.", "Kỹ năng thấp nhất + tiêu chí thấp nhất (Writing, Speaking) — viết ra giấy."],
          ["**Tuần 2** (D-21 → D-15)", "Đẩy kỹ năng thấp nhất", "Mỗi ngày một bài đúng kỹ năng đó; Writing: 3 bài Task 2 + 2 Task 1 trong tuần, mỗi bài phiếu B6; Speaking: phòng nói AI chế độ luyện 2 lần. Thẻ từ: chỉ ôn, không thêm thẻ mới quá 10 / ngày.", "Cuối tuần: làm lại riêng kỹ năng đó trên một đề khác — tăng ≥ 0.5 chưa?"],
          ["**Tuần 3** (D-14 → D-8)", "Mô phỏng", "Hai buổi thi thử đủ L → R → W liền mạch vào đúng giờ của ngày thi (ví dụ Thứ Ba và Thứ Bảy) + một lượt phòng nói AI chế độ thi. Ngày còn lại: sửa lỗi của buổi thi thử. Kiểm giấy tờ ngay D-14.", "Hai buổi thi thử ≥ band mục tiêu ở 3/4 kỹ năng."],
          ["**Tuần 4** (D-7 → D)", "Giữ phong độ", "D-7 → D-4: mỗi ngày một kỹ năng, nhẹ dần. D-3: dừng học mới, đọc sổ lỗi + 30 cụm hay dùng. D-2: đi thử đường. D-1: một Part 1 nghe + một Part 2 nói, ngủ trước 23 giờ.", "Kịch bản ngày thi (Ngày 29 bài tập F) đã dán cạnh bàn."],
        ],
      },
      {
        t: "note", title: "📌 Lời cuối của Tập 5",
        items: [
          "Band 8 không phải là “không bao giờ sai” — là ==sai ít, sai nhỏ, và biết tự sửa==. Ba thói quen của khoá (sổ lỗi, phiếu tự chấm, checklist dạng câu) chính là thứ giám khảo không thấy nhưng nhìn ra trong bài của bạn.",
          "Nếu ngày thi còn xa hơn 4 tuần: dùng tuần mẫu ở trên cho tới D-28, rồi bắt đầu kế hoạch 4 tuần.",
          "Sau khi có điểm thật: đọc lại Ngày 29 mục 11–13 trước khi quyết định phúc khảo, One Skill Retake hay thi lại — và kiểm quy định hiện hành trên trang của IDP / British Council.",
          "Chúc bạn thi tốt. Lộ trình 0 → 8.0 kết thúc ở đây; việc tự học thì không.",
        ],
      },
    ],
  },
];
