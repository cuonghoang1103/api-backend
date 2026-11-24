/**
 * IELTS Tập 5 — Ngày 25 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 * 🔬 NGÀY MỔ ĐỀ 11 (docs/ielts-lo-trinh-0-8.md mục 3.5 hàng 25; khuôn N mod 4 = 1 ⇒ grammar · reading · LISTENING · homework).
 *   Bài 1 (grammar)   Ôn lỗi Writing Đề 11 [G43]: bốn lỗi CỐ Ý của hai bài mẫu (according their · 25 bottles is · the humanity ·
 *                     responsible of) + những “lỗi band 7 cần tránh” mà phần soi của đề đã liệt kê ⇒ năm vùng: giới từ cố định của
 *                     process / discussion · hoà hợp chủ – vị (con số, chủ ngữ dài, mệnh đề làm chủ ngữ) · mạo từ với danh từ trừu
 *                     tượng · sáu lỗi bị động – rút gọn trong process · bốn lỗi “ngữ pháp của lập luận” (Although… but…, not… but…
 *                     lệch song song, like + V-ing, rào đón chồng); lượt soát 4 phút THEO DẠNG ĐỀ + đoạn 12 lỗi biết trước (dầu ăn đã
 *                     dùng → biodiesel; tranh của nhà sưu tập tư nhân — số liệu hư cấu).
 *                     — nối Tập 3 Ngày 27 · Tập 4 Ngày 21 · Tập 5 Ngày 3 · 7 · 12 · 13 · 17 · 23 (bảng tự soát 6 lượt lần 3).
 *   Bài 2 (reading)   Mổ Reading Đề 11 [R18 R19]: đọc `thi-may/de/doc-de11.ts`, chỉ TRÍCH NGẮN chỗ cần mổ; nhãn R1–R5 (Ngày 9); thang 4
 *                     mức paraphrase với 12 cặp của đề; mổ từng nhóm (TFNG · note · table · match-info · match-feature · summary ·
 *                     YNNG · MCQ · endings); ba bẫy lặp lại (đúng chủ đề sai vế · đứng gần ≠ có quan hệ · câu hỏi về CHỮ / CHỨC NĂNG
 *                     chứ không về quan điểm) + nhượng bộ của tác giả; luyện lại bằng câu MỚI (3 bộ mcq đoạn ngắn hư cấu) + bài mới
 *                     “A Code for the Fingers” (~980 từ, lịch sử chữ nổi Braille; 14 câu: Matching information · YNNG · Summary · MCQ).
 *                     DỮ KIỆN Braille soạn THEO TRÍ NHỚ, CHƯA đối chiếu nguồn trong phiên này: Haüy lập trường cho trẻ mù ở Paris 1784,
 *                     sách chữ thường in nổi; Barbier (cựu sĩ quan) mang hệ chấm theo âm, ô cao tới 12 chấm, đầu thập niên 1820 (chuyện
 *                     “viết đêm cho lính” — bài GHI RÕ là bằng chứng mỏng); Louis Braille mù từ nhỏ sau tai nạn ở xưởng của cha, ô 6
 *                     chấm, ấn bản 1829, mất 1852, trường chính thức nhận 1854; “một giám đốc cấm và huỷ sách chấm” viết dạng “according
 *                     to one account”; tranh chấp các hệ chấm ở Mỹ kéo tới thập niên 1930 (không nêu năm cụ thể). Bài có ghi chú “đừng
 *                     dùng làm tài liệu tra cứu”.
 *   Bài 3 (listening) Mổ Listening Đề 11 + 2 phút kiểm [L16]: đọc `thi-may/de/nghe-de11.ts`; nhãn A–E, C1–C3 (Ngày 9); mổ 4 Part (số
 *                     hoá đơn → mã đặt chỗ, hai → bốn → ba, 140 → 125, “You might imagine flags… Instead…”, days → months → weeks…);
 *                     ngân hàng câu tín hiệu “bác rồi mới nói”; QUY TRÌNH 2 PHÚT KIỂM bản máy (7 bước theo giá trị) + bài “sửa đáp án
 *                     trong 2 phút”; 🔊 số và chữ cái trong tiếng ồn (double seven, oh, thirteen / thirty, point); luyện lại bằng 3 bài
 *                     MỚI: Part 1 đăng ký trao đổi ngôn ngữ (Úc + Ireland) · Part 3 chọn ca nghiên cứu năng lượng cộng đồng (Anh + Úc +
 *                     Mỹ) · Part 4 điện báo quang học Chappe (Canada; dữ kiện soạn theo trí nhớ, con số làm tròn / làm mờ).
 *   Bài tập Ngày 25   47 câu có đáp án + 1 đoạn viết tự soát + 1 trang sổ lỗi.
 * Đã grep tap-3…tap-5/ngay + thi-may/de: Braille, Haüy, Barbier, Chappe, semaphore, optical telegraph, language exchange, tandem,
 * biodiesel, cooking oil, private collector = 0 kết quả (barcode, index sách, commons, district heating ĐÃ dùng ⇒ không chọn).
 * Mọi tên người / tổ chức trong bài nghe luyện, đoạn 12 lỗi và bài tập là hư cấu. Mọi id bắt đầu `t5d25-`.
 */
import type { Lesson } from '../data';

export const NGAY_25: Lesson[] = [
  /* ════════════════ BÀI 1 — NGỮ PHÁP: ÔN LỖI WRITING ĐỀ 11 ════════════════ */
  {
    id: "t5d25-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Ôn lỗi Writing Đề 11 — bốn lỗi cố ý của bài mẫu, năm vùng lỗi band 7 còn lọt (giới từ cố định · hoà hợp chủ – vị · mạo từ trừu tượng · bị động trong process · ngữ pháp của lập luận) và lượt soát 4 phút theo dạng đề",
    goal: "Tìm và sửa được trong 4 phút các lỗi nhỏ mà Writing Đề 11 cố ý gài — giới từ cố định (according to, responsible for, heated to, entitled to), hoà hợp chủ – vị ở câu có con số và chủ ngữ dài, mạo từ với danh từ trừu tượng (humanity, history, the public), bị động và rút gọn trong bài process, nhượng bộ và song song trong bài discussion — để bài viết của bạn còn tối đa 1–2 câu có lỗi, đúng mô tả GRA band 8.",
    minutes: 100,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Grammatical Range & Accuracy** (và một phần **Lexical Resource**, vì giới từ cố định là collocation). Hai bài mẫu Đề 11 đạt 8.0–8.5 mà vẫn có ==hai lỗi nhỏ mỗi bài== — giám khảo tha một hai lỗi, không tha năm sáu.",
          "Bài này đi từ ==bài thật của bạn==: mở trang kết quả **Đề 11 — Writing** ở Online Test, đếm số CÂU có lỗi (không đếm lỗi). Rồi học năm vùng lỗi mà bốn lỗi cố ý và mục “Lỗi band 7 cần tránh” của đề chỉ ra.",
          "Năm vùng: ① giới từ cố định của process và discussion · ② hoà hợp chủ – vị ở con số, chủ ngữ dài, mệnh đề làm chủ ngữ · ③ mạo từ với danh từ trừu tượng và lần nhắc thứ hai · ④ sáu lỗi bị động – rút gọn trong process · ⑤ bốn lỗi “ngữ pháp của lập luận”.",
          "Mục 7 gom lại thành **lượt soát 4 phút theo dạng đề**: process soát khác discussion. Luyện trên một đoạn có đúng 12 lỗi biết trước số lượng.",
          "Đây là vòng cuối của chuỗi lỗi: Tập 5 Ngày 3 (lỗi dai dẳng) → Ngày 17 (chuỗi lỗi 7 → 8) → Ngày 23 (bảng tự soát 6 lượt lần 3) → hôm nay (soát theo DẠNG ĐỀ). Đề 12 ở Ngày 30 là bài kiểm tra thật của chuỗi này.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Chấm lại Writing Đề 11 của bạn — đếm câu có lỗi, không đếm lỗi" },
      { t: "p", text: "Mở bài Task 1 và Task 2 bạn đã nộp ở **Ngày 24**. Gạch dưới mỗi câu có ít nhất một lỗi ngữ pháp, giới từ, mạo từ hay chính tả. Một bài process 190 từ có khoảng 10–11 câu; một bài discussion 300 từ có khoảng 14–16 câu. Band 8 nghĩa là ==tối đa 1–2 câu có lỗi mỗi bài==. Band 7: khoảng một phần ba số câu." },
      {
        t: "table", caption: "Bốn lỗi CỐ Ý trong hai bài mẫu Đề 11 — trước khi đọc bảng, bạn đã tự tìm được mấy cái?",
        head: ["Bài", "Chỗ lỗi (trích)", "Loại", "Sửa", "Vì sao người band 7.5 vẫn lọt"],
        rows: [
          ["Task 1", "~~sorted according their colour~~", "giới từ cố định", "sorted **according to** their colour · gọn hơn: sorted **by** colour", "“theo màu” trong tiếng Việt chỉ có một chữ “theo”; according luôn cần to"],
          ["Task 1", "~~roughly 25 bottles is needed~~", "hoà hợp chủ – vị", "roughly 25 bottles **are** needed", "câu cuối, sắp hết giờ; não nghe “25 chai” như “một lượng” nên chọn is"],
          ["Task 2", "~~to see the humanity as a single story~~", "mạo từ", "to see **humanity** as a single story", "danh từ trừu tượng nói chung không có the; nhưng: the heritage of humanity"],
          ["Task 2", "~~responsible of the world's heritage~~", "giới từ sau tính từ", "responsible **for** the world's heritage", "dịch “chịu trách nhiệm CỦA / VỀ” sang of"],
        ],
      },
      {
        t: "quiz", id: "t5d25-on-dau-bai", kind: "fill",
        title: "Kiểm tra đầu bài — sáu câu theo bốn lỗi của Đề 11 (gõ lại phần [trong ngoặc] cho đúng)",
        items: [
          { q: "1. The bottles are then sorted [according] their colour.", answers: ["according to"], hint: "according TO — luôn đi với to. Hoặc viết gọn: sorted by colour." },
          { q: "2. Roughly 25 bottles [is] needed for each jacket.", answers: ["are"], hint: "Chủ ngữ là bottles (số nhiều, đếm từng cái) ⇒ are." },
          { q: "3. A great collection lets visitors see [the humanity] as a single story.", answers: ["humanity"], hint: "humanity = nhân loại nói chung ⇒ không the." },
          { q: "4. Major museums are responsible [of] the world's heritage.", answers: ["for"], hint: "responsible FOR." },
          { q: "5. In the final step of this stage, the flakes [is] dried and melted.", answers: ["are"], hint: "flakes số nhiều ⇒ are." },
          { q: "6. The issue is not where an object is seen, but [who does have] the right to decide.", answers: ["who has"], hint: "Song song với where an object is seen ⇒ mệnh đề wh- thường: who has. Không cần do nhấn mạnh." },
        ],
      },
      { t: "p", text: "Đúng 6/6: lỗi ngữ pháp không phải chỗ bạn mất điểm ở Đề 11 — học nhanh mục 2–6, dồn thời gian vào mục 7. Sai từ 2 câu: học kỹ từng mục, và ghi mỗi câu sai vào **sổ lỗi** (loại · câu sai · câu đúng · luật một dòng)." },
      { t: "rule", formula: "band 8  =  mỗi bài tối đa 1–2 câu có lỗi nhỏ   ·   đếm CÂU có lỗi, không đếm lỗi", vi: "Bốn lỗi cố ý của Đề 11 rơi đúng vào ba loại dày nhất: giới từ cố định, hoà hợp chủ – vị, mạo từ." },

      /* ── 2 ── */
      { t: "h", text: "2. Giới từ cố định của process và discussion — 26 cụm phải đúng tuyệt đối" },
      { t: "p", text: "Ở band 8, giới từ không còn là “ngữ pháp” nữa mà là **collocation**: giám khảo coi một giới từ sai như một từ dùng sai (LR) và một lỗi (GRA) cùng lúc. Hai bảng dưới gom đúng những cụm mà hai đề Đề 11 buộc bạn dùng." },
      {
        t: "table", caption: "Process — động từ quy trình đi với giới từ nào",
        head: ["Cụm đúng", "Sai hay gặp", "Ví dụ"],
        rows: [
          ["sorted **by** colour · sorted **according to** colour · sorted **into** two groups", "~~according their colour~~ · ~~sorted by into~~", "The bottles are sorted by colour into clear and coloured plastic."],
          ["converted / turned / made **into** + sản phẩm", "~~converted to fleece~~ (được nhưng kém tự nhiên khi là sản phẩm cụ thể)", "Waste bottles are turned into fleece jackets."],
          ["made **from** (nguyên liệu biến đổi) · made **of** (vẫn nhìn ra nguyên liệu)", "~~made by plastic~~", "Fleece is made from recycled plastic; the bin is made of steel."],
          ["reduced **to** + dạng nhỏ hơn · cut / shredded **into** flakes", "~~reduced into pellets~~", "The bottles are first reduced to pellets."],
          ["formed / pressed **into** pellets · spun **into** yarn · knitted **into** fabric", "~~spun to yarn~~", "The fibres are spun into yarn."],
          ["heated **to** 60°C (đạt tới) · kept / stored **at** 4°C (giữ ở) · melted **at** 270°C (điểm nóng chảy)", "~~stored in 4°C~~", "The oil is heated to 60°C and kept at that temperature for an hour."],
          ["fed / poured / pumped **into** a tank · passed **through** a filter · forced **through** tiny holes", "~~passed in a filter~~", "The liquid is passed through a fine filter."],
          ["transferred / delivered **to** · collected **from**", "~~delivered at the plant~~ (ở đây cần to)", "The drums are delivered to a processing plant."],
          ["consists **of** (chủ động) · is made up **of** · is composed **of**", "~~is consisted of~~", "The process consists of eleven steps."],
          ["left **to** cool **for** eight hours", "~~left cooling during eight hours~~", "The mixture is left to settle for eight hours."],
        ],
      },
      {
        t: "table", caption: "Discussion — tính từ, danh từ, động từ của đề bảo tàng và hiện vật (dùng được cho mọi đề “ai có quyền quyết định”)",
        head: ["Cụm đúng", "Sai hay gặp", "Ví dụ"],
        rows: [
          ["responsible **for** · accountable **to** sb **for** sth", "~~responsible of~~ · ~~responsible about~~", "Museums are accountable to the public for what they hold."],
          ["return / hand back sth **to** sb · taken **from**", "~~return them their country~~", "Objects should be handed back to the communities they were taken from."],
          ["entitled **to** + N / **to** + V · the right **to** + V · the right **of** + N (quyền của ai)", "~~entitled for~~ · ~~the right of deciding~~", "Governments should be entitled to buy such works."],
          ["access **to** · a threat **to** · a contribution **to** · an objection **to** + V-ing", "~~access into~~ · ~~objection to return~~", "There is an objection to returning objects that were bought legally."],
          ["on the grounds **that** + S V · on the grounds **of** + N", "~~on the ground of they are fragile~~", "They refused on the grounds that the objects were too fragile to travel."],
          ["in dispute · **in** most instances · **with** some justice · **under** one roof · **at** the expense **of**", "~~in most of instances~~ · ~~in one roof~~", "Collections compare civilisations under one roof."],
          ["benefit **from** (động từ) · the benefit **of** (danh từ) · contribute **to**", "~~benefit for~~ · ~~contribute for~~", "Local schools would benefit from the return of these objects."],
          ["point **to** (dẫn ra làm bằng chứng) · argue **for / against** · in favour **of**", "~~point out to~~ · ~~argue that for~~", "Supporters point to the number of visitors."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + be + V3 + into / to / through + N  (động từ quy trình + giới từ đích)", vi: "Mỗi động từ quy trình ĐI KÈM một giới từ chỉ nơi vật liệu đến hoặc thứ nó thành.", examples: [{ en: "The flakes are dried, melted and pressed into pellets, which are then transferred to a textile mill.", vi: "Các mảnh nhựa được sấy, nấu chảy và ép thành viên, rồi được chuyển tới nhà máy dệt." }] },
          { formula: "S + be + adj + giới từ cố định + N / V-ing  (responsible for · entitled to · opposed to)", vi: "Tính từ đi với giới từ của riêng nó — học như một từ.", examples: [{ en: "Those who are opposed to returning the objects are often responsible for their care.", vi: "Những người phản đối trả hiện vật thường là người chịu trách nhiệm chăm sóc chúng." }] },
          { formula: "on the grounds that + S + V   ·   on the grounds of + N", vi: "Hai đuôi khác nhau: that + câu, of + danh từ.", examples: [{ en: "The loan was refused on the grounds that the vase could not travel safely.", vi: "Đề nghị cho mượn bị từ chối với lý do chiếc bình không thể vận chuyển an toàn." }] },
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — giới từ “dịch từng chữ” của người Việt ở hai đề này",
        items: [
          "“chịu trách nhiệm VỀ / CỦA” → ~~responsible of / about~~ → **responsible for**.",
          "“trả lại CHO nước gốc” → ~~return the country~~ / ~~return back~~ → **return them to the country** (return đã có nghĩa “trở lại”, không cần back).",
          "“có quyền LÀM gì” → ~~have the right of deciding~~ → **have the right to decide**.",
          "“đun nóng LÊN 60 độ” → **heated to 60°C**; “giữ Ở 4 độ” → **kept at 4°C**. Nhầm hai cái này làm sai cả nghĩa.",
          "“bao gồm 11 bước” → ~~is consisted of~~ / ~~consists 11 steps~~ → **consists of eleven steps** (consist không có bị động).",
        ],
      },
      { t: "rule", formula: "according TO · responsible FOR · entitled TO · return sth TO sb · consists OF · heated TO / kept AT · turned INTO · passed THROUGH", vi: "Trước khi nộp, khoanh mọi giới từ đứng sau tính từ và sau động từ quy trình — đọc lại cả cụm như một từ." },
      {
        t: "quiz", id: "t5d25-gioi-tu-dich", kind: "translate", grammar: "responsible for · return sth to sb · on the grounds that · heated to · consists of",
        title: "Dịch sang tiếng Anh — giới từ cố định (5 câu)",
        items: [
          { q: "Quy trình gồm chín bước, bắt đầu ở một nhà máy tái chế.", answers: ["The process consists of nine steps, beginning at a recycling plant.", "The process consists of nine steps, starting at a recycling plant.", "The process is made up of nine steps, beginning at a recycling plant.", "The process consists of nine stages, beginning at a recycling plant."], hint: "consists of — không bị động" },
          { q: "Dầu được đun nóng lên 60°C rồi được cho đi qua một bộ lọc.", answers: ["The oil is heated to 60°C and then passed through a filter.", "The oil is heated to 60°C and is then passed through a filter.", "The oil is heated to 60°C, then passed through a filter.", "The oil is heated to 60°C before being passed through a filter."], hint: "heated to · passed through" },
          { q: "Các bảo tàng lớn phải chịu trách nhiệm về những hiện vật mà họ giữ.", answers: ["Major museums must be responsible for the objects they hold.", "Major museums should be responsible for the objects they hold.", "Large museums must be responsible for the objects that they hold.", "Major museums must take responsibility for the objects they hold."], hint: "responsible for — không of" },
          { q: "Nhiều hiện vật nên được trả lại cho những cộng đồng đã làm ra chúng.", answers: ["Many objects should be returned to the communities that made them.", "Many objects should be handed back to the communities that made them.", "Many objects should be returned to the communities which made them.", "Many objects should be given back to the communities that made them."], hint: "return / hand back sth TO sb — không back sau return" },
          { q: "Yêu cầu bị từ chối với lý do bức tranh quá dễ hỏng để vận chuyển.", answers: ["The request was refused on the grounds that the painting was too fragile to travel.", "The request was rejected on the grounds that the painting was too fragile to travel.", "The request was refused on the grounds that the painting was too fragile to be transported.", "The request was turned down on the grounds that the painting was too fragile to travel."], hint: "on the grounds that + câu" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Hoà hợp chủ – vị — năm chỗ band 7.5 còn lọt" },
      { t: "p", text: "Lỗi “25 bottles is” không phải vì bạn không biết luật số nhiều. Nó lọt vì ở năm chỗ dưới đây, ==chủ ngữ thật nằm xa động từ== hoặc ==nghe như số ít==. Học năm chỗ, soát đúng năm chỗ." },
      {
        t: "table",
        head: ["Chỗ", "Sai", "Đúng", "Luật"],
        rows: [
          ["① Con số + danh từ", "~~About 25 bottles is needed.~~", "About 25 bottles **are** needed. · £400 **was** spent. · 270 tonnes of plastic **is** recycled each year.", "đếm TỪNG cái ⇒ số nhiều; một LƯỢNG (tiền, khối lượng, thời gian, khoảng cách) ⇒ số ít"],
          ["② Chủ ngữ dài có of / mệnh đề chen", "~~The number of steps in the two stages are eleven.~~ · ~~Many of the pieces in dispute was taken…~~", "The number … **is** eleven. · Many of the pieces in dispute **were** taken…", "gạch bỏ cụm of / which / chen giữa, đọc lại chủ ngữ gốc + động từ"],
          ["③ each / every / none / neither", "~~Each of the stages end in a product.~~", "Each of the stages **ends** in a product. · None of the objects **has** (trang trọng) / **have** (thông dụng) been returned.", "each / every / neither ⇒ số ít; none of + số nhiều ⇒ cả hai được, viết học thuật chọn số ít"],
          ["④ Mệnh đề / V-ing / to V làm chủ ngữ", "~~Whether museums should return these objects are a difficult question.~~", "Whether museums should return these objects **is** a difficult question. · Returning them **is** costly. · What museums offer **is** access.", "chủ ngữ là cả một mệnh đề hay một việc ⇒ số ít"],
          ["⑤ Mệnh đề quan hệ — động từ theo danh từ được thay thế", "~~short fibres, which is spun into yarn~~ · ~~one of the objects that was taken~~", "short fibres, which **are** spun… · one of the objects that **were** taken", "which / that thay cho danh từ nào thì chia theo danh từ ấy (objects, không phải one)"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "số + N số nhiều (đếm từng cái) + V số nhiều   ·   số + đơn vị đo (một lượng) + V số ít", vi: "Hỏi: tôi đang đếm từng vật hay nói một tổng?", examples: [{ en: "Roughly 25 bottles are needed for each jacket, and about two kilograms of plastic is used in a single duvet.", vi: "Cần khoảng 25 chai cho mỗi áo, và khoảng hai ki-lô-gam nhựa được dùng cho một chiếc chăn." }] },
          { formula: "Whether / What / V-ing / To V … + V số ít", vi: "Mệnh đề hay một việc làm chủ ngữ ⇒ số ít.", examples: [{ en: "What these institutions provide is expertise, and keeping fragile objects stable is expensive.", vi: "Thứ các tổ chức này mang lại là chuyên môn, và giữ cho hiện vật dễ hỏng ổn định thì tốn kém." }] },
          { formula: "one of the + N số nhiều + that / who + V số nhiều", vi: "Bẫy cuối: động từ trong mệnh đề quan hệ theo danh từ số nhiều.", examples: [{ en: "It is one of the few objects that were bought legally.", vi: "Đó là một trong số ít hiện vật được mua hợp pháp." }] },
        ],
      },
      {
        t: "note", title: "💡 Mẹo soát — “che phần giữa”",
        items: [
          "Đặt ngón tay che mọi thứ nằm giữa danh từ chính và động từ (of…, in…, which…, có dấu phẩy…). Đọc to phần còn lại: “The number … are eleven” nghe sai ngay.",
          "Ở câu cuối mỗi bài (lúc mệt nhất), soát RIÊNG động từ chia: is / are, was / were, has / have, đuôi -s.",
        ],
      },
      { t: "rule", formula: "đếm từng cái ⇒ số nhiều · một lượng ⇒ số ít · cụm of / which chen giữa ⇒ che đi rồi đọc · mệnh đề làm chủ ngữ ⇒ số ít", vi: "Ba câu cuối của mỗi bài là nơi hai trong bốn lỗi cố ý của Đề 11 nằm." },
      {
        t: "quiz", id: "t5d25-hoa-hop-dich", kind: "translate", grammar: "số + N · the number of + V số ít · Whether… is · one of the + N + that + V số nhiều",
        title: "Dịch sang tiếng Anh — hoà hợp chủ – vị (5 câu)",
        items: [
          { q: "Cần khoảng 30 chai để làm một chiếc áo khoác.", answers: ["About 30 bottles are needed to make a jacket.", "Around 30 bottles are needed to make a jacket.", "Roughly 30 bottles are needed to make one jacket.", "About 30 bottles are needed to make one jacket.", "Approximately 30 bottles are needed to make a jacket."], hint: "đếm từng chai ⇒ are" },
          { q: "Số hiện vật được trả lại đã tăng trong mười năm qua.", answers: ["The number of objects returned has increased over the past ten years.", "The number of objects that have been returned has increased over the past ten years.", "The number of objects returned has risen over the past ten years.", "The number of returned objects has increased over the last ten years.", "The number of objects returned has increased in the past ten years."], hint: "The number of … has (số ít)" },
          { q: "Việc có nên trả lại những hiện vật này hay không là một câu hỏi khó.", answers: ["Whether these objects should be returned is a difficult question.", "Whether or not these objects should be returned is a difficult question.", "Whether these objects should be returned or not is a difficult question.", "Whether to return these objects is a difficult question."], hint: "Whether… is" },
          { q: "Đó là một trong những bức tranh đã được bán ra nước ngoài.", answers: ["It is one of the paintings that have been sold abroad.", "It is one of the paintings that were sold abroad.", "That is one of the paintings that have been sold abroad.", "It is one of the paintings which have been sold abroad.", "It is one of the paintings which were sold abroad."], hint: "one of the paintings THAT HAVE / WERE" },
          { q: "Mỗi giai đoạn kết thúc bằng một sản phẩm khác nhau.", answers: ["Each stage ends in a different product.", "Each of the stages ends in a different product.", "Each stage ends with a different product.", "Each of the stages ends with a different product."], hint: "each ⇒ ends" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Mạo từ trong hai đề Đề 11 — danh từ trừu tượng và lần nhắc thứ hai" },
      { t: "p", text: "Ngày 17 đã cho bảy tình huống mạo từ khó. Đề 11 đặt bạn vào hai tình huống dày nhất: Task 2 dùng nhiều **danh từ trừu tượng** (humanity, heritage, history, culture, identity), Task 1 process nhắc đi nhắc lại **cùng một vật** qua nhiều bước." },
      {
        t: "table",
        head: ["Danh từ", "Nói chung (Ø)", "Có the khi", "Ví dụ đúng"],
        rows: [
          ["humanity · mankind · society", "luôn Ø", "— (không bao giờ the khi nghĩa “nhân loại / xã hội”)", "the shared story of humanity · society as a whole"],
          ["history · culture · art · heritage", "Ø khi nói chung", "có of-phrase xác định: the history of the object · the culture of the region", "Art belongs to everyone. · the heritage of a nation"],
          ["the public · the past · the world", "—", "luôn the (một cái duy nhất / cụm cố định)", "open to the public · objects from the past"],
          ["museums · objects · visitors", "Ø + số nhiều = nói chung về loại", "the museums where they are now (đã xác định bằng mệnh đề)", "Museums have changed. · the objects in dispute"],
          ["a recycling plant → the plant", "—", "lần nhắc thứ hai, hoặc thứ suy ra được (the flakes, the molten plastic)", "Bottles are taken to a recycling plant. At the plant, they are sorted…"],
          ["a soft surface / the soft surface", "a khi lần đầu, chưa xác định", "the khi có cụm xác định phía sau", "a treatment that raises the soft surface characteristic of fleece"],
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — sáu mạo từ trong bài process và discussion",
        items: [
          "~~the humanity~~ · ~~the society~~ · ~~the history~~ (nói chung) → bỏ the.",
          "~~public~~ (danh từ “công chúng”) → **the public**: open to the public, the public has a right to know.",
          "Process: lần đầu ~~the textile mill~~ khi đề chưa nhắc → **a textile mill**; từ lần hai → **the mill**.",
          "Process: ~~Bottles are washed. Then bottles are shredded.~~ → lần hai dùng **they** hoặc **the bottles** — không lặp danh từ trần.",
          "~~In the conclusion,~~ → **In conclusion,**. ~~at the same time of~~ → **at the same time as**.",
          "Tên bảo tàng có Museum: **the** British Museum, **the** Louvre — nhưng ~~the Vietnam~~ → Vietnam. Không chắc tên riêng ⇒ viết loại hình (a major European museum).",
        ],
      },
      { t: "rule", formula: "danh từ trừu tượng nói chung: Ø (humanity · history · culture)   ·   the public / the past   ·   process: a + N lần đầu → the + N / they từ lần hai", vi: "Hỏi một câu trước mỗi the: người đọc có chỉ ra được ĐÚNG cái nào không?" },
      {
        t: "mcq", id: "t5d25-mao-tu", title: "Mạo từ — chọn phương án đúng (5 câu)",
        items: [
          { q: "1. Such objects belong to ___ rather than to any single nation.", options: ["the humanity", "humanity", "a humanity"], correct: 1, why: "humanity = nhân loại nói chung ⇒ Ø. Đúng lỗi cố ý thứ ba của Đề 11." },
          { q: "2. The collection is open to ___ free of charge.", options: ["public", "a public", "the public"], correct: 2, why: "the public — cụm cố định." },
          { q: "3. Used bottles are first delivered to ___ recycling plant.", options: ["the", "a", "Ø"], correct: 1, why: "Lần đầu nhắc, đề chưa xác định ⇒ a. Từ câu sau: the plant." },
          { q: "4. ___ of the object matters as much as its beauty.", options: ["History", "The history", "A history"], correct: 1, why: "the history OF the object — of-phrase xác định ⇒ the." },
          { q: "5. ___ has always borrowed from other cultures.", options: ["The art", "Art", "An art"], correct: 1, why: "art nói chung ⇒ Ø." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Process — sáu lỗi bị động và rút gọn mà bài band 7 của Đề 11 hay mắc" },
      { t: "p", text: "Phần soi của Đề 11 liệt kê “lỗi band 7 cần tránh” ở Task 1. Bảng dưới biến danh sách đó thành sáu lỗi có công thức sửa. Ôn: bị động + rút gọn ở **Tập 5 Ngày 7**, process hai giai đoạn ở **Ngày 12**." },
      {
        t: "table",
        head: ["Lỗi", "Sai (band 7)", "Sửa (band 8)", "Luật"],
        rows: [
          ["① Câu không có động từ (chép nguyên chữ của sơ đồ)", "~~Then washing in hot water.~~", "The bottles are then washed in hot water.", "mỗi bước một mệnh đề đủ S + be + V3"],
          ["② Bị động thiếu be / sai V3", "~~The bottles washed.~~ · ~~The fibres are spinned.~~", "The bottles are washed. · The fibres are **spun**.", "thuộc V3 bất quy tắc của quy trình (bảng dưới)"],
          ["③ Chủ ngữ treo khi rút gọn", "~~After stretching, the threads are cut.~~ (sợi tự kéo?)", "**After being stretched**, the threads are cut.", "rút gọn bị động: after / before / once + being V3"],
          ["④ Phân từ hoàn thành sai thể", "~~Having collected from bins, the bottles arrive in bales.~~", "**Having been collected** from bins, the bottles arrive in bales.", "vật chịu tác động ⇒ having been V3"],
          ["⑤ Thì lẫn lộn", "~~The flakes were dried and melted.~~", "The flakes **are** dried and melted.", "quy trình lặp lại ⇒ hiện tại đơn từ đầu đến cuối"],
          ["⑥ Chuỗi then… then… after that…", "~~Then… Then… After that… Then…~~", "before being shredded · once dried · which are then spun · In the final step of this stage", "mỗi bài tối đa 2 lần then; còn lại để CẤU TRÚC dẫn trình tự"],
        ],
      },
      {
        t: "table", caption: "V3 bất quy tắc hay gặp trong process — sai một chữ là mất một câu sạch",
        head: ["V", "V3", "V", "V3"],
        rows: [
          ["spin", "**spun**", "sew", "**sewn** (sewed cũng gặp, sewn chuẩn hơn)"],
          ["grind (xay)", "**ground**", "feed", "**fed**"],
          ["freeze", "**frozen**", "shake", "**shaken**"],
          ["weave", "**woven**", "wind (cuộn)", "**wound**"],
          ["lay (đặt)", "**laid**", "dig", "**dug**"],
          ["dry", "**dried** (chính tả: dried, drying)", "cut / put / spread", "**cut / put / spread** (không đổi)"],
        ],
      },
      { t: "rule", formula: "mỗi bước: S + is / are + V3   ·   after / before / once + being + V3   ·   having been + V3   ·   …, which are then + V3", vi: "Vật liệu không tự làm gì cả — mọi động từ rút gọn trong process phải ở dạng bị động." },
      {
        t: "mcq", id: "t5d25-process", title: "Process — chọn câu đúng (6 câu)",
        items: [
          { q: "1. Câu nào đúng?", options: ["Then sorting by colour.", "The bottles are then sorted by colour.", "The bottles then sorted by colour."], correct: 1, why: "Cần S + be + V3 đủ. Phương án 1 thiếu động từ chia; phương án 3 thiếu be (đọc thành “chai tự phân loại”)." },
          { q: "2. ___, the threads are cut into short fibres.", options: ["After stretching", "After being stretched", "After stretched"], correct: 1, why: "Sợi bị kéo ⇒ after being V3. After stretching = sợi tự kéo (chủ ngữ treo)." },
          { q: "3. The yarn is ___ into fabric.", options: ["knitted", "knit up", "knitting"], correct: 0, why: "Bị động: is knitted." },
          { q: "4. ___ from recycling bins, the bottles arrive at the plant in bales.", options: ["Having collected", "Having been collected", "Being collecting"], correct: 1, why: "Phân từ hoàn thành bị động: having been V3." },
          { q: "5. The fibres are ___ into yarn.", options: ["spinned", "spun", "spin"], correct: 1, why: "spin – spun – spun." },
          { q: "6. Câu nào tự nhiên nhất ở band 8?", options: ["The bottles are washed. Then they are shredded. Then the flakes are dried.", "The bottles are washed before being shredded into flakes, which are then dried.", "Washing, shredding and drying are the bottles."], correct: 1, why: "Một câu nối ba bước bằng before being V3 + which are then V3 — trình tự do cấu trúc dẫn, không phải chuỗi then." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Discussion — bốn lỗi “ngữ pháp của lập luận”" },
      { t: "p", text: "Task 2 Đề 11 đòi bạn nhượng bộ rồi phản bác. Ở đúng chỗ đó, người band 7 hay viết bốn lỗi ngữ pháp mà người Việt mang từ cách nói “Tuy… nhưng…”, “không phải… mà là…”. Ôn: cleft / concession vừa đủ ở **Tập 5 Ngày 13**, register ở **Ngày 15**." },
      {
        t: "table",
        head: ["Lỗi", "Sai", "Đúng", "Luật"],
        rows: [
          ["① Although… but…", "~~Although large museums attract more visitors, but this is not the main issue.~~", "Although large museums attract more visitors, this is not the main issue. · Large museums attract more visitors, but this is not…", "một liên từ cho một cặp mệnh đề: hoặc although, hoặc but"],
          ["② not… but… lệch song song", "~~The issue is not where an object can be seen, but the right of deciding.~~", "The issue is not **where** an object can be seen, but **who** has the right to decide.", "hai vế sau not và but phải CÙNG dạng: wh- + wh-, to V + to V, N + N"],
          ["③ like / rather like + V", "~~It is rather like decline to return a book.~~", "It is rather like **declining** to return a book.", "like là giới từ ⇒ + V-ing"],
          ["④ Rào đón chồng / ý kiến kép", "~~In my opinion, I think that it might perhaps be possible that…~~", "In my view, … · I would argue that… · It seems to me that…", "một dấu hiệu ý kiến + một mức rào đón là đủ (Ngày 1, Ngày 23)"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "While I accept that + S + V, I believe that + S + V", vi: "Nhượng bộ trang trọng — không thêm but.", examples: [{ en: "While I accept that major museums care for these objects well, I believe that the right to decide lies elsewhere.", vi: "Dù tôi thừa nhận các bảo tàng lớn chăm sóc hiện vật tốt, tôi tin rằng quyền quyết định nằm ở chỗ khác." }] },
          { formula: "The issue is not + wh- / N …, but + wh- / N (cùng dạng)", vi: "Song song hai vế đối lập.", examples: [{ en: "The question is not how many people can see an object, but who should decide where it belongs.", vi: "Câu hỏi không phải bao nhiêu người được xem, mà là ai nên quyết định nó thuộc về đâu." }] },
          { formula: "These are serious points, but + S + V", vi: "Ghi nhận rồi chuyển hướng bằng một câu riêng — cách band 8 nối thân 1 sang thân 2.", examples: [{ en: "These are serious points, but they answer a different question.", vi: "Đó là những lập luận nghiêm túc, nhưng chúng trả lời một câu hỏi khác." }] },
        ],
      },
      { t: "rule", formula: "Although S V, S V (không but)   ·   not wh-…, but wh-… (song song)   ·   like + V-ing   ·   một dấu hiệu ý kiến cho một ý", vi: "Câu nhượng bộ là câu “đắt” nhất của bài discussion — và cũng là câu hay có lỗi nhất." },
      {
        t: "quiz", id: "t5d25-lap-luan", kind: "fill",
        title: "Sửa lỗi lập luận — gõ lại phần [trong ngoặc] cho đúng (6 câu). Nếu phải bỏ một từ, gõ phần còn lại.",
        items: [
          { q: "1. Although private collectors often lend their paintings, [but this] cannot be relied on.", answers: ["this"], hint: "Although… ⇒ bỏ but." },
          { q: "2. The real question is not who owns a painting, but [the place of showing it].", answers: ["where it is shown", "where it should be shown", "where it is displayed", "where it should be displayed"], hint: "Song song với who owns… ⇒ một mệnh đề wh-: where it is shown." },
          { q: "3. Keeping a borrowed object is rather like [refuse] to pay back a loan.", answers: ["refusing"], hint: "like + V-ing." },
          { q: "4. [In my opinion, I think] museums should share their collections.", answers: ["In my opinion,", "In my opinion", "I think", "In my view,", "In my view"], hint: "Chỉ giữ MỘT dấu hiệu ý kiến." },
          { q: "5. While I accept that these objects are fragile, [but I believe] they should still be returned.", answers: ["I believe"], hint: "While… ⇒ không but." },
          { q: "6. It [might perhaps possibly] be argued that loans are a fair compromise.", answers: ["could", "might", "may"], hint: "Một mức rào đón: It could / might be argued…" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Lượt soát 4 phút theo DẠNG ĐỀ — và một đoạn có đúng 12 lỗi" },
      { t: "p", text: "Bảng tự soát 6 lượt (Ngày 23) dùng cho mọi bài. Trong phòng thi bạn chỉ có khoảng 3 phút cho Task 1 và 4–5 phút cho Task 2, nên hãy chọn **bốn lượt theo dạng đề** — mỗi dạng có “ổ lỗi” riêng." },
      {
        t: "table",
        head: ["Dạng đề", "Lượt 1", "Lượt 2", "Lượt 3", "Lượt 4"],
        rows: [
          ["**Task 1 process**", "mọi động từ: is / are + V3, V3 bất quy tắc", "mọi cụm rút gọn: being / having been (chủ ngữ treo?)", "giới từ sau động từ quy trình: into · to · through · at", "con số + danh từ: số ít hay nhiều; đủ mọi bước?"],
          ["**Task 1 chart / table**", "thì theo năm (quá khứ / dự báo)", "so sánh: than, as… as, twice as many as", "giới từ của con số: rise BY / TO / OF, stand AT", "con số trích có khớp hình không"],
          ["**Task 2 discussion / opinion**", "lập trường: mở bài và kết bài có NÓI CÙNG một điều?", "câu nhượng bộ: Although… but… / While… but…", "danh từ trừu tượng: mạo từ, số ít / nhiều", "giới từ sau tính từ / danh từ: responsible for, access to"],
        ],
      },
      { t: "p", text: "**Luyện:** hai đoạn dưới có ==đúng 12 lỗi== (đoạn A: 6 lỗi process; đoạn B: 6 lỗi discussion). Bấm giờ **4 phút**, tìm trên giấy trước, rồi mới mở bài tập ngay sau. Quy trình và số liệu trong đoạn A là minh hoạ." },
      {
        t: "note", title: "Đoạn A — used cooking oil into biodiesel (process, 6 lỗi)",
        items: [
          "Used cooking oil is first collected from restaurants and deliver to a processing plant in sealed drums. Then filtering to remove food particles. After filtering, the oil is heated to 60°C so that any water evaporates, and it is then mixed by methanol and a catalyst in a large reactor. Having left to settle for eight hours, the mixture separates into two layers, with biodiesel on top and glycerine at the bottom. The glycerine are drained off and sold, while the biodiesel is washed, dried and stored in tanks.",
        ],
      },
      {
        t: "note", title: "Đoạn B — famous paintings and private collectors (discussion, 6 lỗi)",
        items: [
          "Those who defend private ownership point, with some justice, to the history: many great public collections began life as private ones. Although collectors often lend works to exhibitions, but this generosity cannot be relied on. A painting which have been sold abroad may not be seen in public for decades, and the decision rests with one person rather than with public. In my view, governments should be entitled for buy a work of national importance at a fair price before it leaves the country. The issue is not whether collectors love art, but who should decide about it is the question.",
        ],
      },
      {
        t: "quiz", id: "t5d25-muoi-hai-loi", kind: "fill",
        title: "Đáp án 12 lỗi — gõ lại phần [trong ngoặc] cho đúng (nếu phải bỏ từ, gõ phần còn lại)",
        items: [
          { q: "A1. …collected from restaurants and [deliver] to a processing plant", answers: ["delivered"], hint: "bị động song song với is collected: (is) delivered." },
          { q: "A2. [Then filtering] to remove food particles.", answers: ["It is then filtered", "The oil is then filtered", "Then it is filtered", "Then the oil is filtered"], hint: "Câu cần S + be + V3 — lỗi ① mục 5." },
          { q: "A3. [After filtering], the oil is heated to 60°C", answers: ["After being filtered", "Once filtered", "After it has been filtered", "Once it has been filtered"], hint: "Dầu bị lọc ⇒ after being V3 — lỗi ③ mục 5." },
          { q: "A4. it is then mixed [by] methanol and a catalyst", answers: ["with"], hint: "mixed WITH." },
          { q: "A5. [Having left] to settle for eight hours, the mixture separates", answers: ["Having been left"], hint: "Hỗn hợp bị để yên ⇒ having been V3 — lỗi ④." },
          { q: "A6. The glycerine [are] drained off and sold", answers: ["is"], hint: "glycerine không đếm được ⇒ is." },
          { q: "B7. point, with some justice, to [the history]:", answers: ["history"], hint: "history nói chung ⇒ Ø (mục 4)." },
          { q: "B8. Although collectors often lend works to exhibitions, [but this] generosity", answers: ["this"], hint: "Although… ⇒ bỏ but (mục 6 ①)." },
          { q: "B9. A painting which [have] been sold abroad", answers: ["has"], hint: "which thay cho a painting (số ít) ⇒ has (mục 3 ⑤)." },
          { q: "B10. rather than with [public]", answers: ["the public"], hint: "the public — cụm cố định (mục 4)." },
          { q: "B11. governments should be entitled [for] buy", answers: ["to"], hint: "entitled TO + V (mục 2)." },
          { q: "B12. not whether collectors love art, but [who should decide about it is the question].", answers: ["who should decide", "who should decide where it goes", "who should decide what happens to it", "who should decide its fate"], hint: "Song song với whether collectors love art ⇒ một mệnh đề wh- (mục 6 ②)." },
        ],
      },
      {
        t: "table", caption: "Chấm lượt soát 4 phút",
        head: ["Tìm được trong 4 phút", "Nghĩa là", "Việc tiếp theo"],
        rows: [
          ["11–12", "lượt soát theo dạng đề đã thành phản xạ", "dùng nguyên bản 4 lượt cho Đề 12 (Ngày 30)"],
          ["8–10", "còn một ổ lỗi chưa soát tới", "xem lỗi bỏ sót thuộc mục nào (2–6), thêm ổ đó vào lượt 1 của dạng đề tương ứng"],
          ["≤ 7", "đang đọc lướt thay vì soát", "soát lại bằng ngón tay theo từng lượt, mỗi lượt chỉ tìm MỘT loại; làm lại sau 2 ngày"],
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Kiểm tra cuối bài (6 câu)" },
      {
        t: "mcq", id: "t5d25-kiem-cuoi", title: "Chọn câu KHÔNG có lỗi",
        items: [
          { q: "1.", options: ["The process is consisted of seven steps.", "The process consists of seven steps.", "The process consists seven steps."], correct: 1, why: "consist of — không bị động, không bỏ of." },
          { q: "2.", options: ["About £400 were spent on the machine.", "About £400 was spent on the machine.", "About £400 have been spent on the machine."], correct: 1, why: "Một số tiền = một lượng ⇒ was." },
          { q: "3.", options: ["Whether such objects belong to a nation are disputed.", "Whether such objects belong to a nation is disputed.", "Whether such objects belong to a nation, are disputed."], correct: 1, why: "Mệnh đề Whether làm chủ ngữ ⇒ is; không có phẩy giữa chủ ngữ và động từ." },
          { q: "4.", options: ["Although the plan is costly, but it is fair.", "Although the plan is costly, it is fair.", "The plan is costly, although but it is fair."], correct: 1, why: "Một liên từ cho một cặp mệnh đề." },
          { q: "5.", options: ["After being dried, the flakes are melted.", "After drying, the flakes are melted.", "After dried, the flakes are melted."], correct: 0, why: "Vật chịu tác động ⇒ after being V3. After drying ở đây là chủ ngữ treo (mảnh nhựa tự sấy)." },
          { q: "6.", options: ["Museums are responsible of their collections.", "Museums are responsible for their collections.", "Museums are responsible about their collections."], correct: 1, why: "responsible FOR — lỗi cố ý thứ tư của Đề 11." },
        ],
      },
      {
        t: "note", title: "📌 Sau bài — ghi vào sổ lỗi",
        items: [
          "Mỗi câu có lỗi trong Task 1 và Task 2 Đề 11 của bạn: một dòng — loại (giới từ · hoà hợp · mạo từ · bị động · lập luận) · câu sai · câu đúng.",
          "Nếu một loại xuất hiện từ 2 lần, đưa nó lên **lượt 1** trong bản soát 4 phút của dạng đề tương ứng (mục 7). Đây là “lượt của tôi” mà Ngày 23 yêu cầu — giờ bạn có dữ liệu thật của Đề 11 để chọn.",
          "Bài 2 hôm nay mổ Reading Đề 11. Passage 3 là một bài lập luận viết rất sạch — để ý cách tác giả nhượng bộ (“None of this is intended to belittle…”) mà không có lỗi nào của mục 6.",
        ],
      },
    ],
  },
  /* ════════════════ BÀI 2 — ĐỌC: MỔ READING ĐỀ 11 ════════════════ */
  {
    id: "t5d25-doc",
    kind: "reading",
    title: "Đọc: Mổ Reading Đề 11 — paraphrase mức 4 ở từng câu sai, ba bẫy lặp lại (đúng chủ đề sai vế · đứng gần ≠ có quan hệ · câu hỏi về chữ và chức năng), rồi luyện lại bằng bài mới về chữ nổi Braille",
    goal: "Gắn nhãn nguyên nhân R1–R5 cho từng câu sai của Reading Đề 11, chỉ ra đúng chữ trong bài đã được đổi thành chữ nào trong câu hỏi và gọi tên phép đổi, nhận ra ba bẫy lặp lại của đề cùng hai chỗ nhượng bộ của tác giả Passage 3, rồi làm một bài mới khoảng 980 từ với 14 câu (Matching information · YES / NO / NOT GIVEN · Summary · Multiple choice) trong 18 phút, đúng ít nhất 12/14.",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Mở trang kết quả **Đề 11 — Reading** ở Online Test trước khi học. Bài này không chép lại đề; nó chỉ trích vài chữ ở chỗ cần mổ.",
          "Đích của Đề 11 là **35/40** (band 8.0). Đề 10 nhắm 33/40. Hai câu chênh lệch ấy thường nằm ở ==mức paraphrase 4== (ý ẩn) và ở các câu hỏi về ==chức năng== của một đoạn hay một chi tiết.",
          "Dùng lại năm nhãn **R1–R5** của Ngày 9 và thang bốn mức paraphrase của Ngày 17. Việc mới hôm nay: tách bẫy theo ==ba kiểu lặp lại== của Đề 11, và đọc bản đồ lập luận của Passage 3 (hai lần nhượng bộ).",
          "Sau phần mổ: ba bộ câu hỏi ngắn MỚI cùng kỹ năng, rồi bài mới **A Code for the Fingers** (14 câu, 18 phút). Mục tiêu ≥ 12/14.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Chấm Đề 11 theo nhóm câu — và gắn nhãn nguyên nhân" },
      {
        t: "table",
        head: ["Câu", "Passage", "Dạng", "Đã học ở", "Bạn đúng"],
        rows: [
          ["1–6", "1 · The Economy in a Water Tank", "True / False / Not Given", "Tập 5 Ngày 3", "… / 6"],
          ["7–10", "1", "Note completion (ONE WORD)", "Tập 5 Ngày 7", "… / 4"],
          ["11–13", "1", "Table completion (ONE WORD)", "Tập 5 Ngày 7", "… / 3"],
          ["14–18", "2 · The Map Inside the Head", "Matching information (A–G)", "Tập 5 Ngày 15", "… / 5"],
          ["19–22", "2", "Matching features", "Tập 5 Ngày 15", "… / 4"],
          ["23–26", "2", "Summary (từ trong bài)", "Tập 4 Ngày 25", "… / 4"],
          ["27–32", "3 · Discovered or Devised?", "Yes / No / Not Given", "Tập 5 Ngày 9 · 23", "… / 6"],
          ["33–36", "3", "Multiple choice (4 lựa chọn)", "Tập 4 Ngày 7 · Tập 5 Ngày 11", "… / 4"],
          ["37–40", "3", "Matching sentence endings", "Tập 4 Ngày 15", "… / 4"],
        ],
        caption: "Chép bảng vào sổ lỗi, điền cột cuối. Đề 9 + 10 + 11 liên tiếp đã phủ đủ 16 dạng Reading — nhóm nào mất từ 2 câu là nhóm ôn trước Ngày 27 (Reading 3 passage lần 3, mục tiêu 35+).",
      },
      {
        t: "table", caption: "Năm nhãn nguyên nhân (Ngày 9) — ở Đề 11 hay dính câu nào",
        head: ["Nhãn", "Nguyên nhân", "Ở Đề 11 hay dính"],
        rows: [
          ["**R1**", "không tìm ra chỗ trong bài", "câu 14–18 (thông tin nằm rải, câu hỏi không có tên riêng để dò) · câu 22 (hai người cùng bị nghi ngờ ở hai đoạn)"],
          ["**R2**", "tìm đúng chỗ, hiểu sai paraphrase", "câu 1 (scraped through) · 5 · 21 · 31 · 35"],
          ["**R3**", "rơi bẫy “có nhắc nhưng không phải đáp án”", "câu 7 (motor) · 11 (seminar) · 13 (teaching staff) · 23 (graph paper) · 26 (options) · 40 (Cubists)"],
          ["**R4**", "tự suy thêm / dùng kiến thức ngoài", "câu 2 · 4 · 29 · 32"],
          ["**R5**", "hết giờ, chép sai, vượt giới hạn từ", "câu 8 (tax / taxation thay cho taxes) · 12 (computer thiếu -s) · 13 (teaching staff = hai từ)"],
        ],
      },
      {
        t: "note", title: "💡 Cách học: mổ trước, đọc giải thích sau",
        items: [
          "Với mỗi câu sai: mở lại passage, tự gạch câu chứa đáp án, gắn nhãn. Sau đó mới đọc phần giải thích ở trang kết quả và ở bảng dưới.",
          "Câu đúng mà bạn đoán cũng tính là sai: đánh dấu ? và mổ như câu sai.",
          "Mỗi câu sai: một dòng ==“chữ trong bài ↔ chữ trong câu hỏi + tên phép đổi”== (khuôn của Ngày 17).",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Thang bốn mức paraphrase — mười hai cặp của Đề 11" },
      { t: "p", text: "Ở Đề 10, mức 4 chiếm khoảng một nửa số câu. Ở Đề 11 còn nhiều hơn: gần như mọi câu Passage 2 và Passage 3 không giữ lại MỘT từ nội dung nào của bài." },
      {
        t: "table",
        head: ["Mức", "Phép đổi", "Bài viết (trích)", "Câu hỏi", "Câu"],
        rows: [
          ["1", "đồng nghĩa", "a pump **lifted** it to the top", "**raised** from the base to the top", "7"],
          ["1", "đồng nghĩa", "conveys **rank**", "the **relative importance**", "39"],
          ["2", "đổi loại từ", "any obvious **loss** of memory", "any clear **decline** in memory", "24"],
          ["3", "đổi cấu trúc", "**It was in the United States that** the device acquired the name…", "was given its present name **in America**", "6"],
          ["3", "đổi cấu trúc + hai vế", "**more than adequate at a time when** the statistics were far from exact", "accurate enough, **given** the quality of the data", "5"],
          ["4", "ý ẩn (nghĩa của cụm động từ)", "had only just **scraped through** a degree", "had obtained **outstanding results** (FALSE)", "1"],
          ["4", "ý ẩn (đổi góc nhìn)", "There was **a cost**, too: … performed worse", "one ability gained **at the expense of** another", "21"],
          ["4", "gom chuỗi việc thành khái niệm", "Sceptics pointed out… Maguire's team **therefore** followed 79 trainees", "how a **rival explanation was eliminated**", "14"],
          ["4", "gom chuỗi việc thành khái niệm", "which no chain of **remembered turns** could explain", "an explanation **based on habit** was unable to account for", "16"],
          ["4", "đổi hành động thành thể loại", "**It would be rash to conclude**…", "**a warning against** reading too much into…", "17"],
          ["4", "ý ẩn (hệ quả)", "we now **mistake** that assumption **for vision itself**", "**harder** for people **to see** that perspective rests on an assumption", "31"],
          ["4", "ý ẩn (hình ảnh)", "much as **a walker would pass through** it", "as it would **unfold for somebody on the move**", "38"],
        ],
        caption: "Đề 11 = đề của mức 4. Người band 7 dừng ở mức 2–3 rồi chọn NOT GIVEN khi không thấy chữ quen; người band 8 hỏi “câu này NÓI GÌ” chứ không hỏi “câu này DÙNG TỪ GÌ”.",
      },
      { t: "rule", formula: "mỗi câu sai  →  “chữ trong bài” ↔ “chữ trong câu hỏi”  +  tên phép đổi (đồng nghĩa · loại từ · cấu trúc · ý ẩn · gom thành khái niệm · đổi thành thể loại)", vi: "Hai phép đổi MỚI của Đề 11: gom một chuỗi việc thành một khái niệm (câu 14, 16) và gọi tên THỂ LOẠI của một câu (câu 17)." },

      /* ── 3 ── */
      { t: "h", text: "3. Mổ Passage 1 — TFNG 1–6, Note 7–10, Table 11–13" },
      {
        t: "table", caption: "True / False / Not Given",
        head: ["Câu", "Đáp án", "Chữ quyết định trong bài", "Bẫy · kỹ năng"],
        rows: [
          ["1", "FALSE", "“had only just **scraped through** a degree”", "Cả câu xoay quanh một cụm động từ. Không biết scrape through (đỗ sát nút) thì không thấy mâu thuẫn và chọn NOT GIVEN. Bài học: cụm động từ là từ vựng Reading band 8, không chỉ là từ của Speaking."],
          ["2", "NOT GIVEN", "“a radio **small enough to be concealed** from the guards”", "small enough to = đủ nhỏ để CÓ THỂ giấu — nói về khả năng, không nói kết cục. Người chọn FALSE đã tự viết thêm “và nó không bao giờ bị tìm thấy”."],
          ["3", "FALSE", "“could describe… the position in which an economy would **eventually settle**”", "==Đúng chủ đề, sai vế.== Cái khó là “what happened **on the way there**”, không phải điểm cuối. Câu hỏi đổi vế: “no means of working out the **final effect**”."],
          ["4", "NOT GIVEN", "“**With the help of** a friend… at a cost of about £400”", "help không nói là giúp tiền. Hai chi tiết đứng cạnh nhau (người giúp + chi phí) không tạo ra quan hệ “ai trả tiền”."],
          ["5", "TRUE", "“**more than adequate** at a time when the official statistics… were **far from exact**”", "Paraphrase cả hai vế + đổi cấu trúc (mệnh đề thời gian → given…). Đọc ra mức 4 thì câu này dễ."],
          ["6", "TRUE", "“It was in the United States that the device acquired the name…”", "Câu chẻ nhấn nơi chốn. the name by which it is now known = its present name."],
        ],
      },
      {
        t: "table", caption: "Note + Table — mỗi ô có ít nhất một “ứng viên sai” cùng loại",
        head: ["Câu", "Đáp án", "Ứng viên sai", "Cách loại"],
        rows: [
          ["7", "pump", "motor", "motor nằm ở đoạn 1 (phần kể chuyện, nước “was driven by a motor”). Câu tả đúng việc ĐƯA NƯỚC TỪ ĐÁY LÊN ĐỈNH ở đoạn 4 dùng pump. Ghi chú theo trình tự đoạn 4 ⇒ tìm ở đoạn 4."],
          ["8", "taxes", "tax · taxation", "ONE WORD ONLY và phải chép đúng từ của câu chứa thông tin: “drawn off… **as taxes**”. tax (trong “the rate of tax”) và taxation (đoạn 3) đều nằm ở câu khác."],
          ["9", "savings", "investment", "Tiền để dành vào bể savings; investment là cái làm nó QUAY LẠI dòng chảy."],
          ["10", "imports", "exports", "Hai dòng ngược chiều trong cùng một câu: chảy RA vì imports, chảy VÀO nhờ exports. Ghi chú hỏi dòng chảy ra (drained into a tank representing other countries)."],
          ["11", "garage", "seminar · School", "Bảng có hai hàng 1949: lắp ráp (summer) và trình diễn (November). seminar thuộc hàng dưới."],
          ["12", "computers", "computer", "Ô đứng sau “electronic ___” và động từ “are… replaced” ⇒ số nhiều. Thiếu -s là nhãn R5."],
          ["13", "professor", "teaching staff", "teaching staff là mốc 1950 (đoạn 1) và là HAI từ. 1958 đi với became a professor."],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai ở Passage 1",
        items: [
          "**Bỏ qua cụm động từ.** scrape through, set aside, push into storerooms, move on — ở band 8, nghĩa của cả câu nằm trong những cụm này.",
          "**Đọc small enough to / at considerable risk như một kết cục.** Đó là khả năng và hoàn cảnh; kết cục phải được nói ra mới tính.",
          "**Ghi chú theo trình tự nhưng không theo đoạn.** Note 7–10 đi đúng thứ tự đoạn 4. Ai tìm “raised to the top” ở đoạn 1 sẽ gặp motor trước.",
        ],
      },
      {
        t: "mcq", id: "t5d25-doc-p1-luyen", title: "Luyện ngay — bốn đoạn ngắn MỚI, cùng bốn kiểu bẫy của Passage 1 (4 câu · 3 phút)",
        items: [
          { q: "1. Text: “Halvorsen had only narrowly passed his final examinations, yet within two years he was running the laboratory.” — Statement: Halvorsen did very well in his final examinations.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "only narrowly passed = đỗ sát nút ⇒ trái với did very well ⇒ FALSE. Cùng kiểu câu 1 (scraped through)." },
          { q: "2. Text: “She kept the diary in a tin small enough to be buried beneath the floorboards.” — Statement: The diary was never found by the authorities.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "small enough to be buried = có thể chôn được, không nói kết cục ⇒ NOT GIVEN. Cùng kiểu câu 2." },
          { q: "3. Text: “Engineers could predict where the bridge would finally come to rest under a heavy load; what they could not describe was how it would sway on the way there.” — Statement: Engineers were unable to calculate the final position of the bridge under a load.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Họ TÍNH ĐƯỢC điểm cuối; không tả được quãng giữa ⇒ câu hỏi lấy nhầm vế ⇒ FALSE. Cùng kiểu câu 3." },
          { q: "4. Text: “With the help of two neighbours, she rebuilt the boat over a single winter, at a cost of some £900.” — Statement: The neighbours paid part of the cost of the boat.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "help không nói là tiền; chi phí đứng cạnh nhưng không gắn với ai trả ⇒ NOT GIVEN. Cùng kiểu câu 4." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Mổ Passage 2 — Matching information 14–18, Features 19–22, Summary 23–26" },
      { t: "p", text: "Matching information của Đề 11 khó vì năm câu hỏi ==không mô tả NỘI DUNG mà mô tả CHỨC NĂNG== của một đoạn: “an account of how…”, “a warning against…”, “a result that… was unable to account for”. Không có tên riêng để dò. Cách làm: đọc mỗi đoạn và tự gán cho nó một nhãn chức năng trước khi nhìn câu hỏi." },
      {
        t: "table", caption: "Chức năng ↔ chữ báo hiệu trong đoạn",
        head: ["Câu", "Chức năng (câu hỏi)", "Chữ báo hiệu trong đoạn", "Đoạn", "Bẫy"],
        rows: [
          ["14", "an account of how a **rival explanation** was **eliminated**", "Sceptics pointed out… · therefore followed… · at the outset… did not differ", "D", "C cũng có một phát hiện, nhưng không bác giả thuyết nào"],
          ["15", "the suggestion that everyday **expressions** may reflect how knowledge is organised", "close friends, distant relatives… may be rather more than a metaphor", "G", "—"],
          ["16", "a result that an explanation **based on habit** could not account for", "which no chain of remembered turns could explain", "A", "B: kết quả bất ngờ nhưng không đối lập với thuyết thói quen"],
          ["17", "a **warning** against reading too much into a small amount of research", "It would be rash to conclude… too small to settle the matter", "F", "E: cũng nói điều CHƯA biết, nhưng không cảnh báo suy diễn"],
          ["18", "a **change of method** that led to an unexpected observation", "Rather than examining what whole animals did… nobody had predicted", "B", "C: cũng ghi tín hiệu tế bào nhưng không ĐỔI phương pháp"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "Sceptics / Critics pointed out that… + (S) therefore + V (thiết kế mới)   ⇄   a rival explanation was ruled out / eliminated", vi: "Một ý kiến phản bác + một thí nghiệm để loại nó = loại trừ giả thuyết khác.", examples: [{ en: "Critics argued that the pupils were simply brighter to begin with, so the team tested them before the course started.", vi: "Người phê bình cho rằng học sinh vốn đã giỏi hơn, nên nhóm kiểm tra các em trước khoá học." }] },
          { formula: "It would be rash / unwise / premature to conclude that…   ⇄   a warning against over-interpreting", vi: "Tính từ đánh giá + to conclude = câu cảnh báo.", examples: [{ en: "It would be premature to conclude that the drug works; the trial lasted three weeks.", vi: "Kết luận thuốc có tác dụng là quá sớm; thử nghiệm chỉ kéo dài ba tuần." }] },
          { formula: "Rather than / Instead of + V-ing (cách cũ), S + V (cách mới)   ⇄   a change of method", vi: "Hai phương pháp đặt cạnh nhau = đổi phương pháp.", examples: [{ en: "Rather than asking people what they ate, the researchers photographed their plates.", vi: "Thay vì hỏi người ta ăn gì, các nhà nghiên cứu chụp đĩa ăn của họ." }] },
        ],
      },
      {
        t: "table", caption: "Features 19–22 và Summary 23–26 — chỗ dễ sai",
        head: ["Câu", "Đáp án", "Bẫy", "Phản xạ cần có"],
        rows: [
          ["19", "E (Spiers)", "D (Maguire: 79 học viên)", "a very large number of **members of the public** — kiểm CẢ quy mô lẫn loại người: trainees không phải công chúng"],
          ["20", "A (Tolman)", "B (O'Keefe cũng nói về bản đồ)", "from behaviour **alone** — chữ alone loại mọi người có đo trong não"],
          ["21", "D (Maguire)", "—", "gained at the expense of another = There was a cost, too: … performed worse (mức 4)"],
          ["22", "B (O'Keefe)", "A (ý Tolman cũng bị gác lại)", "câu hỏi có HAI điều kiện: bị nghi ngờ + gắn tế bào đơn với vị trí. Tolman chỉ khớp điều kiện thứ nhất"],
          ["23", "triangles", "graph · paper", "“as regular as the pattern on a sheet of graph paper” chỉ là phép SO SÁNH; lattice of triangles mới là thứ được tả"],
          ["25", "game", "boat · mazes", "a ___ **played** by millions — động từ played gọi đúng danh từ game"],
          ["26", "directions", "options", "options thuộc vế TỰ tìm đường; câu hỏi hỏi vế depend on spoken ___"],
        ],
      },
      {
        t: "mcq", id: "t5d25-doc-p2-luyen", title: "Luyện ngay — đoạn này làm CHỨC NĂNG gì? (4 đoạn MỚI · 3 phút)",
        items: [
          { q: "1. “Critics suggested that the children who chose music lessons were simply those who already had good memories. The researchers therefore tested every child's memory before the lessons began, and found no difference between the groups.”", options: ["an alternative explanation being ruled out", "a warning against drawing conclusions from limited evidence", "a new method producing an unexpected observation", "a suggestion that ordinary language may reflect how the mind works"], correct: 0, why: "Critics suggested… + therefore tested… before = loại giả thuyết khác. Cùng kiểu câu 14." },
          { q: "2. “The trial involved twelve volunteers over a single afternoon. It would be unwise to draw firm conclusions about long-term effects from a study of this size.”", options: ["an alternative explanation being ruled out", "a warning against drawing conclusions from limited evidence", "a new method producing an unexpected observation", "a suggestion that ordinary language may reflect how the mind works"], correct: 1, why: "It would be unwise to draw firm conclusions = cảnh báo; twelve volunteers, a single afternoon = ít dữ liệu. Cùng kiểu câu 17." },
          { q: "3. “Instead of asking shoppers what they had bought, the team fitted trolleys with small sensors — and noticed something nobody had predicted: most shoppers turned left the moment they entered.”", options: ["an alternative explanation being ruled out", "a warning against drawing conclusions from limited evidence", "a new method producing an unexpected observation", "a suggestion that ordinary language may reflect how the mind works"], correct: 2, why: "Instead of asking… fitted sensors = đổi phương pháp; nobody had predicted = bất ngờ. Cùng kiểu câu 18." },
          { q: "4. “If the theory is correct, our habit of calling a hard period ‘an uphill struggle’ may be rather more than a figure of speech.”", options: ["an alternative explanation being ruled out", "a warning against drawing conclusions from limited evidence", "a new method producing an unexpected observation", "a suggestion that ordinary language may reflect how the mind works"], correct: 3, why: "habit of calling… = cách nói hằng ngày; more than a figure of speech = có thể phản ánh cách tâm trí vận hành. Cùng kiểu câu 15." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Mổ Passage 3 — đọc bản đồ lập luận trước, câu hỏi sau" },
      { t: "p", text: "Passage 3 của Đề 11 là bài lập luận ngôi thứ nhất có ==hai lần nhượng bộ==. Người đọc lướt nhớ được luận điểm chính (“phối cảnh là phát minh”) rồi trả lời mọi câu theo luận điểm đó — và sai đúng ở hai chỗ tác giả nhượng bộ (câu 30, câu 36 phương án A)." },
      {
        t: "sodo", kind: "flow", title: "Bản đồ lập luận của “Discovered or Devised?”",
        steps: [
          { label: "① Luận đề", sub: "chữ “discovered” chỉ đúng một nửa" },
          { label: "② Sự kiện không ai cãi", sub: "Brunelleschi ~1420 · Alberti 1435" },
          { label: "③ Nhượng bộ 1", sub: "hình học không bác được — phối cảnh KHÔNG tuỳ tiện như bảng chữ cái" },
          { label: "④ Nhưng", sub: "không ai nhìn bằng một mắt bất động" },
          { label: "⑤ Hệ khác = lựa chọn khác", sub: "cuộn tranh Trung Hoa · tranh trung cổ" },
          { label: "⑥ Vì sao ta thấy “đúng”", sub: "máy ảnh dựng trên cùng giả định" },
          { label: "⑦ Nhượng bộ 2", sub: "không coi nhẹ thành tựu" },
          { label: "⑧ Chốt", sub: "chỉ phản đối CHỮ: devised, không discovered" },
        ],
      },
      {
        t: "table", caption: "Yes / No / Not Given 27–32",
        head: ["Câu", "Đáp án", "Chữ quyết định", "Bẫy · kỹ năng"],
        rows: [
          ["27", "YES", "“to imply that… painters outside Europe had somehow **failed to notice** it”", "Câu hỏi về điều CHỮ “discovered” gợi ra, không hỏi tác giả có đồng ý với hàm ý ấy không. Tác giả nói đúng như thế ⇒ YES. Người chọn NO đã trả lời câu hỏi khác."],
          ["28", "NO", "“The story itself is **not in dispute**.”", "Chi tiết “we know of it only from a biography” gợi nghi ngờ, nhưng tác giả nói thẳng là không ai tranh cãi."],
          ["29", "NOT GIVEN", "Alberti “set out the rules in writing” (1435)", "Hai tên đứng trong cùng đoạn ≠ hai người gặp nhau."],
          ["30", "NO", "“Perspective is **not an arbitrary code** like the alphabet”", "Đây là NHƯỢNG BỘ 1. Ai chỉ nhớ luận điểm chính sẽ chọn YES."],
          ["31", "YES", "“we now **mistake** that assumption **for vision itself**”", "Ý ẩn: nhầm giả định với chính sự nhìn ⇒ khó nhận ra đó là giả định."],
          ["32", "NOT GIVEN", "the Cubists “showed an object from several sides at once”", "Kiến thức ngoài (ảnh hưởng nghệ thuật châu lục khác) không được tính."],
        ],
      },
      {
        t: "table", caption: "MCQ 33–36 và Endings 37–40",
        head: ["Câu", "Đáp án", "Vì sao đúng", "Phương án nhiễu mạnh nhất"],
        rows: [
          ["33", "B", "một mắt, giữ yên, đúng một điểm ⇒ phương pháp chỉ đúng với người xem bị ràng buộc", "C: lấy chi tiết tiểu sử ở đoạn 2 — nhưng tác giả không nghi người viết tiểu sử"],
          ["34", "D", "chi tiết đọc ảnh “counts heavily against them” = bằng chứng chống lại thuyết “thói quen văn hoá”", "A: ảnh chính xác hơn tranh — câu hỏi “in order to” hỏi CHỨC NĂNG, không hỏi điều có thể suy ra"],
          ["35", "A", "“is simply forbidden to do so” (sau bức tường, hai bên mặt, chuyện xảy ra tiếp)", "D: vật ở xa nhỏ đi — đúng là đặc điểm của phối cảnh nhưng tác giả không gọi nó là cái giá (đúng chủ đề, sai vế)"],
          ["36", "C", "mở bài “The verb deserves more attention” + kết bài “My objection is only to the word”", "A: tác giả nói rõ “None of this is intended to belittle the achievement” (nhượng bộ 2)"],
          ["37", "C", "chỉ khớp cái thấy từ một vị trí cố định", "F: bài nói hình học không bác được, không nói người xem phải biết hình học"],
          ["38", "D", "“much as a walker would pass through it”", "—"],
          ["39", "A", "“conveys rank at a glance”", "—"],
          ["40", "B", "máy ảnh “has trained us… we now mistake that assumption for vision itself”", "E: thứ bị chê “wrong” là tranh Lập thể, không phải máy ảnh"],
        ],
      },
      {
        t: "mcq", id: "t5d25-doc-p3-luyen", title: "Luyện ngay — YES / NO / NOT GIVEN với nhượng bộ và câu hỏi về chữ (4 đoạn MỚI · 3 phút)",
        items: [
          { q: "1. Text: “To call someone ‘self-made’ is to imply that nobody else contributed to their success. That implication, I shall argue, is almost always false.” — Statement: The term ‘self-made’ suggests that other people played no part in a person's success.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Câu hỏi về điều CHỮ gợi ra — tác giả nói đúng thế (to imply that nobody else contributed) ⇒ YES, dù tác giả không đồng ý với hàm ý ấy. Cùng kiểu câu 27." },
          { q: "2. Text: “The facts of the case are not disputed, although they reach us through a single witness.” — Statement: Historians question whether the events really took place.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "not disputed ⇒ NO. Nguồn mỏng (a single witness) là mồi. Cùng kiểu câu 28." },
          { q: "3. Text: “I am not claiming that league tables are worthless; they measure something real. My complaint is that they measure it too narrowly.” — Statement: The writer believes league tables measure nothing of value.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Nhượng bộ: not claiming… worthless; they measure something real ⇒ NO. Cùng kiểu câu 30." },
          { q: "4. Text: “Among those who rejected the old style were the Impressionists, who preferred to paint outdoors.” — Statement: The Impressionists were influenced by Japanese prints.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Có thể đúng ngoài đời, nhưng tác giả không nói ⇒ NOT GIVEN. Cùng kiểu câu 32." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Ba bẫy lặp lại của Reading Đề 11 — mang sang Đề 12" },
      {
        t: "table",
        head: ["Bẫy", "Ở Đề 11", "Phản xạ cần có"],
        rows: [
          ["**Đúng chủ đề, sai vế**", "câu 3 (điểm cuối ↔ quãng đường) · 10 (imports ↔ exports) · 26 (tự tìm đường ↔ nghe chỉ đường) · 35 phương án D", "câu trong bài có HAI vế (could… / what they could not…; one… the other…) ⇒ viết ra giấy: vế nào là của câu hỏi?"],
          ["**Đứng gần ≠ có quan hệ**", "câu 4 (người giúp + chi phí) · 22 (Tolman cũng bị gác lại) · 29 (Alberti cùng đoạn với Brunelleschi)", "câu hỏi nối hai thứ bằng một quan hệ (paid, met, both…) ⇒ tìm CHỮ nói quan hệ đó, không tìm hai danh từ"],
          ["**Câu hỏi về CHỮ / CHỨC NĂNG, không về quan điểm**", "câu 14–18 (chức năng đoạn) · 27 (chữ gợi ra gì) · 34 (in order to) · 36 (mục đích)", "gạch động từ của câu hỏi: suggests, implies, refers to… in order to, purpose ⇒ trả lời đúng câu đó, không trả lời “tác giả nghĩ gì”"],
          ["(cộng thêm) **Nhượng bộ của tác giả**", "câu 30 · 36 phương án A", "đánh dấu mọi câu not… / None of this is intended to… / I do not deny… — đó là điều tác giả CÔNG NHẬN"],
        ],
      },
      { t: "rule", formula: "hai vế ⇒ vế nào?   ·   hai thứ đứng gần ⇒ chữ nói quan hệ ở đâu?   ·   suggests / in order to / purpose ⇒ trả lời đúng câu hỏi ấy   ·   not… / None of this… ⇒ tác giả công nhận", vi: "Bốn phản xạ này giữ lại được 3–4 câu ở một đề band 8." },

      /* ── 7 ── */
      { t: "h", text: "7. Luyện lại — bài mới, 18 phút, Questions 1–14" },
      { t: "p", text: "Đặt đồng hồ **18:00**. Đọc một lượt, ghi lề 3–5 chữ cho mỗi đoạn — lần này ghi ==chức năng== của đoạn (kể · bênh vực · phản bác · cảnh báo · kết luận), không chỉ nội dung. Không tra từ. Dữ kiện lịch sử trong bài được viết theo hiểu biết phổ thông cho mục đích luyện đọc; đừng dùng làm tài liệu tra cứu." },
      {
        t: "passage", title: "A Code for the Fingers", intro: "Why six raised dots defeated the raised alphabet — and what the story says about who should judge a tool",
        paras: [
          { label: "A", text: "Run a finger across a lift button or a medicine box in many countries and you will feel a small pattern of raised dots. Each cluster, or cell, contains at most six dots, arranged in two columns of three, and the sixty-three possible patterns are enough to represent every letter, number and punctuation mark of a language. The system looks so economical that it is tempting to assume it was always the obvious solution. It was not. For several decades the method favoured by the people who ran schools for the blind was quite different, and the history of how dots displaced it says less about the cleverness of an invention than about the question of who is entitled to judge one." },
          { label: "B", text: "The first school for blind children in Paris was founded in 1784 by Valentin Haüy, who had books printed in large letters of the ordinary alphabet, pressed into thick paper so that they stood up from the page. The books were heavy and expensive, a single volume held only a few pages of text, and reading them was laborious: the pupil traced the outline of each letter in turn, as one might feel the shape of a key in a dark pocket. Haüy's reasoning, however, deserves a fairer hearing than it usually receives. He wanted blind pupils to read the same letters as everyone else, so that a sighted teacher, parent or friend could read alongside them without any special training. That was not a foolish ambition; it was an attempt to keep blind people inside the common culture rather than in a separate world of their own." },
          { label: "C", text: "The challenge to raised letters came from outside the school. In the early 1820s a former army officer, Charles Barbier, brought the pupils a system in which words were broken into sounds and each sound was represented by a pattern of dots within a cell up to twelve dots high. It is often said that he had designed it so that soldiers could pass messages at night without showing a light; the story is attractive, but the evidence for it is thin, and it may have grown in the retelling. What is clear is how the pupils responded. For the first time they could write as well as read, using a simple frame and a pointed tool. Yet the system had serious drawbacks. A cell of that height could not be taken in by a single fingertip, so the reader had to move up and down as well as along the line, and because it recorded only sounds, it had no means of showing spelling, punctuation or numbers." },
          { label: "D", text: "Among the pupils who tried it was a boy of about twelve called Louis Braille, who had lost his sight in early childhood after an accident in his father's workshop. Over the next few years he reworked Barbier's idea with a thoroughness that its inventor never applied to it. He reduced the cell to six dots, small enough to lie beneath one fingertip, so that each character could be recognised at a touch rather than explored. He made the patterns stand for letters, not sounds, which allowed a reader to learn how words were spelt, and he added signs for punctuation and numbers, and later for music. An account of the system was published in 1829, by which time Braille had become a teacher at the school himself." },
          { label: "E", text: "It would be pleasant to report that the method was adopted at once. Instead, the pupils used it among themselves while the institution continued to print books in raised letters, and according to one account a later director went so far as to forbid the dots and had books written in them destroyed. The objection was the one Haüy might have raised: dots were a private code that sighted teachers and families could not read without learning it, and to teach it was to wall blind people off from everyone else. Only in 1854 did the school formally accept the system. Braille had died two years earlier." },
          { label: "F", text: "Elsewhere the argument took longer still. In the United States, schools and publishers spent the second half of the nineteenth century and the early decades of the twentieth divided between rival systems of dots, each with its own defenders and its own libraries, so that a child who had learned to read in one state might be unable to read books produced in another. By then, it should be noticed, nobody seriously proposed going back to raised letters. The quarrel was about which dots, and it was not resolved until agreement on a common standard was reached in the 1930s." },
          { label: "G", text: "Today the position of braille is again uncertain. Screen readers and audiobooks allow blind people to take in a great deal of text without touching a page, and surveys in several countries suggest that only a minority of blind people now read braille. Some argue that it has simply been overtaken, as the telegraph was. I am not persuaded. Listening to a text is a fine way of enjoying a novel, but it is not the same as reading it: it gives no direct access to spelling, to the layout of a table or a mathematical expression, or to the freedom to move back and forth at will. Yet the deeper lesson of the story lies elsewhere. Haüy and his successors were neither cruel nor stupid; they judged a system for blind readers by what made sense to sighted ones. The method that eventually won was devised by someone who would have to read it with his own fingers, and that, more than any single technical detail, explains why it lasted." },
        ],
      },
      { t: "p", text: "**Questions 1–4** — The passage has seven paragraphs, **A–G**. Which paragraph contains the following information? Write the correct letter, **A–G**." },
      {
        t: "quiz", id: "t5d25-doc-info", kind: "fill", title: "Questions 1–4 — gõ chữ cái A–G",
        items: [
          { q: "1. a feature of an earlier system that pupils welcomed", answers: ["C"], hint: "Đoạn C: “For the first time they could write as well as read”. Bẫy D: hệ của Braille được khen, nhưng nó không phải “earlier system” so với hệ của Barbier." },
          { q: "2. a defence of a view that the writer does not ultimately share", answers: ["B"], hint: "Đoạn B: “Haüy's reasoning… deserves a fairer hearing… That was not a foolish ambition” — tác giả BÊNH lập luận của Haüy; đoạn G cho thấy tác giả không theo nó (judged… by what made sense to sighted ones). Bẫy E: đoạn E chỉ THUẬT lại phản đối, không bênh." },
          { q: "3. an account of a decision reached after the death of the person most associated with a system", answers: ["E"], hint: "Đoạn E: “Only in 1854 did the school formally accept the system. Braille had died two years earlier.” Bẫy F: thoả thuận thập niên 1930 cũng muộn, nhưng bài không nói ai đã mất." },
          { q: "4. evidence that a dispute had moved on from its original question", answers: ["F"], hint: "Đoạn F: “nobody seriously proposed going back to raised letters. The quarrel was about which dots” — câu hỏi ban đầu (chấm hay chữ nổi) đã xong; tranh cãi giờ là chấm NÀO. Gom chuỗi thành khái niệm (mức 4), như câu 14 của Đề 11." },
        ],
      },
      { t: "p", text: "**Questions 5–9** — Do the following statements agree with the claims of the writer? Choose **YES**, **NO** or **NOT GIVEN**." },
      {
        t: "mcq", id: "t5d25-doc-ynng", title: "Questions 5–9 — YES / NO / NOT GIVEN",
        items: [
          { q: "5. Haüy's preference for raised letters was based on a reasonable concern.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “That was not a foolish ambition; it was an attempt to keep blind people inside the common culture” ⇒ YES. Phủ định của tính từ chê (not foolish) = khen có chừng mực. Nhượng bộ của tác giả — cùng kiểu câu 30 Đề 11." },
          { q: "6. It is certain that Barbier designed his system for soldiers to use at night.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn C: “the story is attractive, but the evidence for it is thin, and it may have grown in the retelling” — tác giả nói điều đó KHÔNG chắc ⇒ trái với It is certain ⇒ NO. Chữ tuyệt đối trong câu hỏi (certain) là chỗ quyết định." },
          { q: "7. Braille's six-dot cell was easier to read than Barbier's because it was larger.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn D: “small enough to lie beneath one fingertip” — dễ đọc vì NHỎ hơn, không phải lớn hơn ⇒ NO. So sánh bị đảo chiều." },
          { q: "8. Teachers who opposed braille were mainly concerned about losing their jobs.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn E nêu lý do phản đối là sự cách biệt (“to wall blind people off from everyone else”); bài không nói gì về việc làm của giáo viên ⇒ NOT GIVEN. Bẫy R4: tự viết thêm động cơ." },
          { q: "9. The writer thinks audio technology has made braille unnecessary.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn G: “Some argue that it has simply been overtaken… I am not persuaded.” ⇒ NO. Ý kiến được nêu trước rồi bị bác — đọc tới câu ngắn sau nó." },
        ],
      },
      { t: "p", text: "**Questions 10–12** — Complete the summary. Choose **ONE WORD ONLY** from the passage for each answer." },
      {
        t: "note", title: "Braille's improvements",
        items: [
          "Braille reduced Barbier's cell to six dots so that each character could be felt with a single **10** ___. Because his patterns represented letters rather than **11** ___, readers could learn how words were spelt. He also included signs for punctuation and numbers and, at a later stage, for **12** ___.",
        ],
      },
      {
        t: "quiz", id: "t5d25-doc-tom-tat", kind: "fill", title: "Questions 10–12 — ONE WORD ONLY",
        items: [
          { q: "10.", answers: ["fingertip"], hint: "Đoạn D: “small enough to lie beneath one fingertip”. Một từ ghép viết liền. Bẫy “finger” (đoạn A): không phải từ của câu chứa thông tin." },
          { q: "11.", answers: ["sounds"], hint: "Đoạn D: “He made the patterns stand for letters, not sounds”. Số nhiều: sounds." },
          { q: "12.", answers: ["music"], hint: "Đoạn D: “and later for music” — at a later stage = later." },
        ],
      },
      { t: "p", text: "**Questions 13–14** — Choose the correct letter, **A, B, C** or **D**." },
      {
        t: "mcq", id: "t5d25-doc-mcq", title: "Questions 13–14 — Multiple choice",
        items: [
          { q: "13. What point does the writer make about the situation in the United States?", options: ["A It delayed the use of braille in American schools until the 1930s.", "B It showed that the case for dots over raised letters had already been won.", "C It was caused by publishers who wanted to protect their profits.", "D It ended when one state's system was adopted by all the others."], correct: 1, why: "Đoạn F: “nobody seriously proposed going back to raised letters. The quarrel was about which dots” ⇒ B. A sai: trường học Mỹ đã dùng các hệ chấm từ thế kỷ XIX. C, D: bài không nói lợi nhuận hay hệ của một bang thắng (chỉ nói “agreement on a common standard”)." },
          { q: "14. What is the writer's main purpose in the passage?", options: ["A to explain the technical advantages of a six-dot cell", "B to criticise the teachers who resisted braille", "C to argue that those who will use a system should help to shape it", "D to show that braille is being replaced by modern technology"], correct: 2, why: "Mở bài: “who is entitled to judge one”; kết bài: “devised by someone who would have to read it with his own fingers… explains why it lasted” ⇒ C. A là nội dung đoạn D, không phải mục đích. B sai: “neither cruel nor stupid”. D sai: “I am not persuaded”. Cùng kiểu câu 36 Đề 11." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Chấm điểm — và bảng paraphrase của bài mới" },
      {
        t: "table",
        head: ["Điểm", "Nghĩa là", "Việc tiếp theo"],
        rows: [
          ["13–14", "bốn phản xạ của mục 6 đã thành thói quen", "Ngày 27 làm Reading 3 passage lần 3, mục tiêu 35+"],
          ["11–12", "còn dính một kiểu bẫy", "câu sai thuộc bẫy nào ở mục 6 ⇒ làm lại mcq “Luyện ngay” của mục tương ứng (3, 4 hay 5)"],
          ["≤ 10", "paraphrase mức 4 và câu hỏi chức năng chưa vững", "ôn Tập 5 Ngày 15 (matching information) và Ngày 23 (suy luận band 8), làm lại bài này sau 3 ngày"],
        ],
      },
      {
        t: "table", caption: "Tám cặp paraphrase đáng chép vào sổ",
        head: ["Bài viết", "Câu hỏi", "Phép đổi"],
        rows: [
          ["For the first time they could write as well as read", "a feature… that pupils welcomed", "gom chi tiết thành khái niệm (mức 4)"],
          ["deserves a fairer hearing… not a foolish ambition", "a defence of a view", "đổi hành động thành thể loại"],
          ["The quarrel was about which dots", "a dispute had moved on from its original question", "gom thành khái niệm"],
          ["not a foolish ambition", "based on a reasonable concern", "phủ định tính từ chê ⇒ khen chừng mực"],
          ["the evidence for it is thin", "It is certain that… (NO)", "đối lập mức độ chắc chắn"],
          ["small enough to lie beneath one fingertip", "because it was larger (NO)", "đảo chiều so sánh"],
          ["I am not persuaded", "has made braille unnecessary (NO)", "ý kiến bị bác ngay sau khi nêu"],
          ["who would have to read it with his own fingers", "those who will use a system should help to shape it", "từ một trường hợp sang nguyên tắc chung"],
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Từ vựng hữu ích từ Đề 11 và bài mới" },
      {
        t: "vocab",
        items: [
          { w: "scrape through", pos: "phr v", ipa: "/ˌskreɪp ˈθruː/", vi: "vượt qua (kỳ thi, khó khăn) một cách sát nút", ex: "He scraped through the exam with the lowest possible pass mark.", exVi: "Cậu ấy đỗ sát nút với điểm đạt thấp nhất có thể.", more: "scrape through (sth) · scrape a pass · gần nghĩa: just / narrowly pass. Câu 1 Đề 11 đổi thành outstanding results (FALSE)." },
          { w: "salvage", pos: "v", ipa: "/ˈsælvɪdʒ/", vi: "cứu vớt, tận dụng lại (thứ từ đồ bỏ đi, xác tàu)", ex: "The motor was said to have been salvaged from a wartime aircraft.", exVi: "Người ta nói chiếc mô-tơ được tận dụng từ một máy bay thời chiến.", more: "salvage sth from sth · salvage a situation / a relationship (cứu vãn) · N: salvage (sự cứu hộ tài sản)" },
          { w: "overshoot", pos: "v", ipa: "/ˌəʊvəˈʃuːt/", vi: "vượt quá (mức đích) rồi mới dừng lại", ex: "Prices overshot their long-term level before settling.", exVi: "Giá vượt quá mức dài hạn rồi mới ổn định.", more: "overshoot a target / a forecast · trái: undershoot · Passage 1 Đề 11: rise and fall, overshoot and settle" },
          { w: "lattice", pos: "n", ipa: "/ˈlætɪs/", vi: "mạng lưới (các đường, các điểm) đan đều", ex: "The points formed a regular lattice of triangles.", exVi: "Các điểm tạo thành một mạng tam giác đều đặn.", more: "a lattice of + N số nhiều · câu 23 Đề 11: network = lattice" },
          { w: "rash", pos: "adj", ipa: "/ræʃ/", vi: "hấp tấp, liều (khi kết luận, quyết định)", ex: "It would be rash to conclude that the drug is safe.", exVi: "Kết luận rằng thuốc an toàn là hấp tấp.", more: "a rash decision / promise · It would be rash to + V = câu CẢNH BÁO (câu 17 Đề 11). Danh từ rash = phát ban — khác nghĩa." },
          { w: "intriguing", pos: "adj", ipa: "/ɪnˈtriːɡɪŋ/", vi: "hấp dẫn, gợi tò mò (vì lạ, chưa giải thích được)", ex: "The most intriguing possibility is that memory and navigation share one system.", exVi: "Khả năng gợi tò mò nhất là trí nhớ và định hướng dùng chung một hệ.", more: "an intriguing question / idea / possibility · V: intrigue · khác interesting: có thêm sắc thái bí ẩn" },
          { w: "belittle", pos: "v", ipa: "/bɪˈlɪtl/", vi: "coi nhẹ, hạ thấp (giá trị của ai / điều gì)", ex: "None of this is intended to belittle the achievement.", exVi: "Không điều gì ở đây nhằm coi nhẹ thành tựu ấy.", more: "belittle sb's efforts / achievement · khuôn nhượng bộ band 8: None of this is intended to belittle… — câu 36 Đề 11" },
          { w: "fidelity", pos: "n", ipa: "/fɪˈdeləti/", vi: "độ trung thành, độ chính xác so với bản gốc", ex: "The recording reproduces the concert with remarkable fidelity.", exVi: "Bản thu tái hiện buổi hoà nhạc chính xác đến kinh ngạc.", more: "fidelity to the original / to the text · high fidelity (hi-fi) · nghĩa thứ hai: sự chung thuỷ" },
          { w: "gale", pos: "n", ipa: "/ɡeɪl/", vi: "gió rất mạnh, gió giật", ex: "A gale was expected along the west coast by evening.", exVi: "Dự kiến tới tối sẽ có gió mạnh dọc bờ biển phía tây.", more: "a gale warning · gale-force winds · gales of laughter (cười nghiêng ngả)" },
          { w: "hoist", pos: "v", ipa: "/hɔɪst/", vi: "kéo lên (cờ, buồm, tín hiệu) bằng dây", ex: "A canvas cone was hoisted on the mast when a storm was coming.", exVi: "Một hình nón vải được kéo lên cột khi bão sắp tới.", more: "hoist a flag / sail · câu 32 Đề 11: raising… on a mast = hoisted on a mast" },
          { w: "tactile", pos: "adj", ipa: "/ˈtæktaɪl/", vi: "thuộc về xúc giác; đọc / cảm nhận được bằng tay", ex: "Braille is a tactile writing system.", exVi: "Chữ nổi là một hệ chữ đọc bằng xúc giác.", more: "tactile paving (gạch lát dẫn đường cho người khiếm thị) · tactile feedback · gần nghĩa: by touch" },
          { w: "embossed", pos: "adj", ipa: "/ɪmˈbɒst/", vi: "in nổi, dập nổi", ex: "The books were printed in embossed letters that could be traced by hand.", exVi: "Sách được in chữ nổi để có thể dò bằng tay.", more: "embossed paper / letters / logo · V: emboss · bài mới: raised letters = embossed letters" },
        ],
      },
      {
        t: "note", title: "📌 Việc sau buổi mổ",
        items: [
          "Sổ lỗi: mỗi câu sai của Reading Đề 11 một dòng — số câu · nhãn R · cặp paraphrase · phép đổi · bẫy nào ở mục 6.",
          "Nếu nhãn R1 xuất hiện ở câu 14–18: trước Ngày 27, đọc lại Passage 2 Đề 11 và viết bên lề mỗi đoạn MỘT nhãn chức năng (kể · loại giả thuyết · cảnh báo · gợi ý…). Rồi làm lại năm câu đó không nhìn đáp án.",
          "Chép hai câu nhượng bộ của Passage 3 (“None of this is intended to belittle…”, “Those critics who… went too far”) vào sổ Writing — chúng là khuôn câu mục 6 của Bài 1.",
        ],
      },
    ],
  },
  /* ════════════════ BÀI 3 — NGHE: MỔ LISTENING ĐỀ 11 + 2 PHÚT KIỂM ════════════════ */
  {
    id: "t5d25-nghe",
    kind: "listening",
    title: "Nghe: Mổ Listening Đề 11 — từng câu dễ sai của 4 Part, ngân hàng câu tín hiệu “bác rồi mới nói”, quy trình 2 phút kiểm của bài thi máy, rồi luyện lại bằng ba bài mới (giọng Úc · Ireland · Anh · Mỹ · Canada)",
    goal: "Gắn đúng nhãn A–E (C1–C3) cho từng câu sai của Listening Đề 11, nghe ra mười kiểu câu tín hiệu báo đáp án sắp tới hoặc báo một phương án sắp bị bác, dùng 2 phút cuối của bài thi máy theo bảy bước để lấy lại 1–2 câu, rồi làm ba bài mới tốc độ thật (Part 1 · Part 3 · Part 4) đạt ít nhất 16/18.",
    minutes: 90,
    blocks: [
      {
        t: "recap", title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Mở trang kết quả **Đề 11 — Listening** và bật **bản lời thoại**. Hôm nay được nghe lại nhiều lần — mục đích là tìm ra ==vì sao== lỡ, không phải để thuộc đáp án.",
          "Đề 11 dựng “nhiễu nền” bằng tình huống: quán cà phê ồn, bể bơi có lớp học, căng-tin, tiếng khoan. Người nói hỏi lại, đánh vần lại, và ==gần như mọi đáp án đứng sau một phương án bị bác==.",
          "Dùng lại bộ nhãn **A–E** của Ngày 8 và ba nhánh **C1–C3** của Ngày 9 (C1 viết phương án bị bác · C2 nhầm người / nhầm thì · C3 không nối được paraphrase).",
          "Phần mới: **2 phút kiểm** của bài thi máy (L16). Trên máy, bạn gõ đáp án ngay trong lúc nghe và chỉ có 2 phút cuối để soát — không có 10 phút chép như bài giấy. Bảy bước, xếp theo số điểm lấy lại được.",
          "🔊 Số và chữ cái trong tiếng ồn: double seven, oh, thirteen / thirty, point. Sau đó: ba bài MỚI — Part 1 (Úc + Ireland), Part 3 (Anh + Úc + Mỹ), Part 4 (Canada).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Chấm theo Part — và gắn nhãn" },
      {
        t: "table",
        head: ["Part", "Bối cảnh · giọng", "Dạng", "Mục tiêu band 8", "Bạn đúng"],
        rows: [
          ["1", "đổi vé phà, gọi từ quán cà phê ồn · Úc + Ireland", "Form 1–5 · Table 6–10", "10", "… / 10"],
          ["2", "giới thiệu bể bơi ngoài trời mở lại · Anh", "MCQ 11–15 · Map 16–20", "9", "… / 10"],
          ["3", "hai sinh viên + giảng viên bàn chuyến khảo sát thử sinh vật đáy suối · Canada + Mỹ + New Zealand", "MCQ 21–24 · Choose TWO 25–26 · Flow-chart 27–30", "8–9", "… / 10"],
          ["4", "bài giảng lịch sử dự báo thời tiết · Anh", "Note completion 31–40 (ONE WORD)", "8–9", "… / 10"],
        ],
        caption: "Mục tiêu Đề 11: 35/40. Part 1 phải trọn 10 — mỗi câu mất ở Part 1 là một câu “không được phép mất”.",
      },
      {
        t: "table", caption: "Bộ nhãn A–E (Ngày 8) và C1–C3 (Ngày 9) — ở Đề 11 hay dính câu nào",
        head: ["Nhãn", "Chuyện gì đã xảy ra", "Ở Đề 11"],
        rows: [
          ["**A · Không nghe ra âm**", "giọng lạ, chỗ nói nhanh, đúng lúc có tiếng ồn", "câu 6 (Kittiwake, lúc máy pha cà phê chạy) · cách nói Ireland “the half one”"],
          ["**B · Nghe ra, viết sai**", "chính tả, số nhiều, định dạng số", "Gouldthorpe · Kittiwake · permission · invasive · cones · fishermen · probability · 6.4"],
          ["**C1 · Viết phương án bị bác**", "nghe rõ, nhưng đó là cái bị bác", "câu 1 (số hoá đơn) · 3 (four) · 4 (5.9) · 9 (140) · 10 (45 / an hour) · 32 (flags) · 38 (fault)"],
          ["**C2 · Nhầm người / nhầm thì**", "ý đúng nhưng của người khác, hoặc là quy định cũ", "câu 5 (lounge là ý của Lachlan) · 16 (chỗ CŨ của phòng thay đồ) · 23 (mối lo của sinh viên ≠ của thầy)"],
          ["**C3 · Không nối được paraphrase**", "hiểu nhưng không thấy phương án nào “giống”", "câu 11 · 13 · 22 · 24 · 26"],
          ["**D · Lạc chỗ**", "còn nghĩ câu cũ, lỡ luôn câu kế", "Part 4 câu 33–34 (hai câu sát nhau, đáp án 33 đến sau hai nhóm bị bác)"],
          ["**E · Đọc đề không kịp**", "băng chạy mà chưa đọc xong", "Part 2 sơ đồ (đọc la bàn, lối vào ở phía NAM) · Part 4 mười ô một lúc"],
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Mổ Part 1 — “con số đúng là con số SAU câu sửa”" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Cái được nói TRƯỚC", "Câu chốt (trích ngắn)", "Rút ra"],
        rows: [
          ["1", "417706", "774093 — số hoá đơn", "“That's the invoice number. The reference is…”", "Ở tốc độ thật không kịp xoá: ghi cả hai dãy, gạch dãy sai. double seven = 77; oh = 0."],
          ["2", "Gouldthorpe", "—", "“G, O, U, L, D, then T, H…”", "then là chỗ người nói ngắt nhịp, không phải chữ cái. “People always leave out the U” là lời nhắc để KIỂM."],
          ["3", "3", "two → four (“would've made four”)", "“so it's three adults now”", "would've made = giả định, không phải con số thật. Số đổi hai lần — đợi chữ now."],
          ["4", "6.4", "5.9 (chưa có giá xe đạp) · six metres (ngưỡng)", "“With the rack on… six point four”", "Phiếu in sẵn “length with bike rack” — đọc phiếu kỹ là biết trước sẽ có hai con số."],
          ["5", "cabin", "lounge (ý của Lachlan) · reclining seats (ý của vợ)", "“So we'd better have a cabin.”", "Người QUYẾT là người thứ ba (chị vợ say sóng). Mỗi lựa chọn bị bác đi kèm tên người ủng hộ nó."],
          ["6", "Kittiwake", "— (không nghe được vì máy pha cà phê)", "“K, I, double T, I…”", "Chỉ có MỘT lần nghe đánh vần. Nhãn A nếu bạn trượt cả lần ấy."],
          ["7", "lounge", "cabins (đã hết)", "“Every one on that sailing's gone… in the lounge”", "Every one (= mọi cabin) ≠ everyone. Ô 5 và ô 7 dùng chung cặp lounge / cabin — đừng điền ngược."],
          ["8", "breakfast", "wi-fi (phải trả)", "“you all get breakfast included”", "“that you'd pay for” — tân ngữ đưa lên đầu câu là dấu hiệu ý ngược."],
          ["9", "125", "140 (nói HAI lần)", "“So it's just the £125.”", "normally… which would make… But since… = con số sắp bị rút. Đợi số CUỐI."],
          ["10", "75", "45 (ô tô) · an hour (tới năm ngoái)", "“It's seventy-five minutes now.”", "Kiểm bằng phép tính: tàu 7.15, có mặt 6.00 ⇒ 75 phút."],
        ],
      },
      {
        t: "note", title: "💡 Nghe tiếng Anh Ireland và nghe trong tiếng ồn",
        items: [
          "Cách nói Ireland trong Part 1: **You're grand** = không sao đâu · **the half one** = 1 giờ 30 (half past one) · **No bother** = không có gì · **I've cabins free** = tôi còn cabin (I've + danh từ, không got).",
          "Khi người nói “Say that again?” vì ồn, câu được nhắc lại thường ==ngắn hơn và rõ hơn== — đó là cơ hội thứ hai của bạn. Đừng ghi ở lần đầu nếu chưa chắc; đợi lần nhắc lại.",
          "Trên máy, gõ ngay cả khi chưa chắc (ví dụ 7740…), rồi sửa khi nghe câu sửa. Ô trống ở cuối bài là ô bạn không còn nhớ để quay lại.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Mổ Part 2 — hai lời đồn bị bác, rồi mới tới đáp án; trái – phải theo người BƯỚC VÀO" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Bị bác trước", "Câu chốt (trích ngắn)", "Rút ra"],
        rows: [
          ["11", "B", "hết tiền · thời tiết", "“they found the original nineteen-thirties tiles underneath”", "No, the money didn't run out… only lost about a week… What actually happened is… — khuôn “bác lời đồn” của Part 2."],
          ["12", "A", "tắt sưởi mùa hè · tăng mùa đông", "“We do neither… in January and in July alike”", "alike cuối câu = như nhau."],
          ["13", "C", "mở sớm hơn · tăng giá", "“each lane has a board… slow, medium or fast”", "The one difference you'll notice… = câu báo đáp án."],
          ["14", "A", "chỉ cho người bơi · giảm giá", "“It's a separate business, run by a bakery”", "Cả ba phương án đều được nhắc — hai cái ở dạng phủ định."],
          ["15", "C", "quyên tiền · cứu hộ tình nguyện", "“fill in a short online questionnaire”", "Nor am I looking for… = đảo ngữ phủ định, phương án thứ hai bị bác."],
          ["16", "C", "chỗ CŨ: trong cổng bên trái (nay là văn phòng)", "“moved to the south-west corner”", "C2: vị trí cũ là mồi. Nghe moved / now / used to be."],
          ["17", "B", "“down by the changing rooms”", "“up on the sun terrace, right in the middle”", "You might expect… In fact… = khuôn bác kỳ vọng."],
          ["19", "E", "phòng cứu hộ (góc tây bắc) · văn phòng (bên trái)", "“the door immediately on your right”", "Bước vào từ phía NAM, mặt hướng bắc ⇒ tay phải là phía ĐÔNG. Lấy trái – phải theo người đang đi, không theo tờ giấy."],
          ["20", "H", "góc đông nam (kho dây phao)", "“north-east corner… shares a wall with the café”", "Hai góc cùng phía đông — nghe north / south trước chữ east."],
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Mổ Part 3 — nhượng bộ rồi mới nói lý do thật; mối lo của AI" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Bẫy", "Câu chốt (trích ngắn)", "Rút ra"],
        rows: [
          ["21", "B", "A (ít công) · C (sổ tay môn học)", "“has had to survive everything that's come down the river for months”", "It would, and honestly… And I know the handbook lists… But… — hai nhượng bộ, lý do thật ở sau But. Paraphrase mức 4: phương án không có chữ creatures hay months."],
          ["22", "C", "A (dưới thị trấn) · B (không có stonefly)", "“it had more mayfly larvae than anywhere else we looked”", "The thing that really threw us… = điều bất ngờ NHẤT. Hai dự đoán sai được kể trước; “the dirtiest bit of river” ↔ “regarded locally as badly polluted”."],
          ["23", "A", "B (bốn điểm) · C (mượn vợt)", "“What does bother me is the date… You weren't sampling a normal river.”", "Câu hỏi hỏi mối lo của THẦY. Sinh viên lo con số 4; thầy gạt đi (I wouldn't lose sleep over that)."],
          ["24", "B", "A (bỏ điểm) · C (thêm một đoạn giải thích)", "“Do both on the same visit, and you compare.”", "Ý thứ BA thắng sau khi hai ý đầu cùng bị gác (You've no evidence for either)."],
          ["25–26", "A, D", "B (phân loại ở phòng thí nghiệm) · C (hai tuần một lần) · E (đi buổi chiều)", "“exactly three minutes, timed on a phone” · “we photograph every tray”", "Mỗi phương án bị bác có một câu bác riêng: I'd drop that idea · We'd never keep it up · we'll stick to mornings."],
          ["27", "permission", "—", "“you need their permission in writing”", "Lưu đồ ghi “obtain their ___ in writing” — khớp nguyên cụm. Chính tả: đôi s."],
          ["28", "level", "temperature", "“we check the river level online”", "temperature cũng được ghi lại nhưng “that's no reason to call anything off” — thầy chốt: the level decides whether you go."],
          ["29", "invasive", "mud", "“Not just to get the mud off. Rivers carry invasive species”", "Not just… = lý do hời hợt bị gác; ô đứng trước species ⇒ cần TÍNH TỪ."],
          ["30", "score", "list", "“don't simply list what you found… give every site a score”", "Cách làm bị bác đứng ngay trước; Priya nhắc lại “A score for each site.”"],
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Mổ Part 4 — mười ô, gần như ô nào cũng có một “mồi” bị bác" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Mồi", "Câu chốt (trích ngắn)"],
        rows: [
          ["31", "telegraph", "post", "“But by now there was the telegraph.”"],
          ["32", "cones", "flags", "“You might imagine flags… Instead, large canvas cones…”"],
          ["33", "fishermen", "scientists · newspapers", "“didn't come from scientists, or from the newspapers… came from fishermen”"],
          ["34", "ambulance", "mathematician (nghề chính)", "“served in France as an ambulance driver”"],
          ["35", "data", "method", "“his method was essentially sound. What let him down was his data”"],
          ["36", "theatre", "—", "“a vast circular hall like a theatre”"],
          ["37", "day", "twenty-four hours", "“took almost exactly a day to produce”"],
          ["38", "rounding", "fault (in the machine)", "“His first thought was a fault… In fact… Merely rounding the numbers”"],
          ["39", "weeks", "days · months", "“It isn't a matter of days… never be months… about two weeks”"],
          ["40", "probability", "confidence · uncertainty", "“It gives you a probability”"],
        ],
      },
      {
        t: "table", caption: "Ngân hàng câu tín hiệu của Đề 11 — nghe câu bên trái là biết đáp án ở đâu",
        head: ["Kiểu câu tín hiệu", "Ví dụ trong Đề 11", "Đáp án nằm ở…"],
        rows: [
          ["Bác lời đồn", "No, the money didn't run out. · We do neither.", "câu NGAY SAU (What actually happened is…)"],
          ["Bác kỳ vọng", "You might imagine flags… Instead… · You might expect… In fact…", "sau Instead / In fact"],
          ["Chuỗi phủ định", "didn't come from A, or from B… came from C · It isn't days… never months… two weeks", "vế khẳng định CUỐI CÙNG"],
          ["Phỏng đoán đầu bị sửa", "His first thought was… In fact the cause was…", "sau In fact"],
          ["Câu chẻ What… is / was", "What let him down was… · What does bother me is…", "ngay sau is / was"],
          ["Con số sắp bị rút", "normally there'd be… which would make 140. But since…", "con số sau But"],
          ["Giả định", "which would've made four", "con số SAU câu giả định (so it's three now)"],
          ["Quy định cũ", "Some people will tell you an hour, and that was true up to last year.", "câu có now"],
          ["Báo điểm thay đổi", "The one difference you'll notice is…", "ngay sau"],
          ["Nhượng bộ rồi lý do thật", "It would, and honestly… And I know… But…", "sau But"],
        ],
      },
      { t: "rule", formula: "bác lời đồn · bác kỳ vọng · chuỗi phủ định · phỏng đoán đầu · What… is · normally… But · would've · that was true until · The one difference · It would… But", vi: "Mười kiểu câu tín hiệu này gom hơn một nửa số câu khó của Đề 11. Nghe thấy chúng ⇒ GIỮ bút, chưa ghi." },

      /* ── 6 ── */
      { t: "h", text: "6. 2 phút kiểm của bài thi máy — bảy bước theo số điểm lấy lại được" },
      { t: "p", text: "Bài thi giấy cho 10 phút cuối để chép đáp án sang phiếu. Bài thi máy KHÔNG có 10 phút ấy: bạn gõ thẳng trong lúc nghe, và sau Part 4 chỉ có ==2 phút== để soát lại cả 40 câu. Hai phút không đủ để nghĩ lại; chỉ đủ để sửa những lỗi có thể nhìn thấy. Thứ tự dưới đây xếp theo số điểm lấy lại được — làm từ trên xuống, hết giờ ở đâu dừng ở đó." },
      {
        t: "table",
        head: ["Bước", "Soát gì", "Ví dụ ở Đề 11", "Vì sao đáng điểm"],
        rows: [
          ["① Ô trống", "điền đoán theo loại từ của ô; không bao giờ để trống", "ô “spreading ___ species” ⇒ một tính từ", "không bị trừ điểm khi sai; đoán đúng là được điểm"],
          ["② Giới hạn từ", "ONE WORD ONLY ⇒ bỏ mạo từ, bỏ chữ thừa", "~~the telegraph~~ → telegraph · ~~a day~~ → day", "vượt giới hạn = sai dù hiểu đúng"],
          ["③ Số ít / số nhiều", "đọc chữ trước ô và động từ sau ô", "raising ___ on a mast ⇒ cones · pressure from ___ ⇒ fishermen", "lỗi B dày nhất ở band 7.5"],
          ["④ Chính tả từ đã đánh vần và từ khó", "chữ đôi, đuôi -ance / -ence, -or / -er, nguyên âm câm", "Kittiwake · Gouldthorpe · permission · invasive · ambulance · probability · theatre", "từ được đánh vần thì không được phép sai"],
          ["⑤ Định dạng số", "dấu chấm thập phân, không lặp đơn vị đã in, dãy số viết liền", "~~6,4~~ → 6.4 · ô có sẵn £: ~~£125~~ → 125 · 417706", "dấu phẩy thập phân kiểu Việt Nam đọc thành 64"],
          ["⑥ Chọn TWO", "đủ hai chữ, không trùng nhau", "25–26: A và D", "thiếu một chữ = mất một câu"],
          ["⑦ Map / matching", "chữ cái có bị lặp khi đề không cho phép không", "16–20: C, B, F, E, H", "lặp chữ ⇒ chắc chắn sai ít nhất một câu"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "2 phút cuối bài thi máy",
        steps: [
          { label: "0:00–0:20", sub: "ô trống → đoán" },
          { label: "0:20–0:50", sub: "giới hạn từ + số ít / nhiều" },
          { label: "0:50–1:30", sub: "chính tả từ được đánh vần, từ khó" },
          { label: "1:30–1:50", sub: "định dạng số" },
          { label: "1:50–2:00", sub: "Choose TWO · chữ cái lặp" },
        ],
      },
      {
        t: "quiz", id: "t5d25-nghe-hai-phut", kind: "fill",
        title: "Sửa đáp án trong 2 phút — mỗi câu có MỘT lỗi kiểu B (8 câu MỚI). Gõ lại đáp án đúng",
        items: [
          { q: "1. Notes (ONE WORD ONLY): each tower had two movable wooden ___. Bạn nghe: “two movable wooden arms”. Bạn đã gõ: arm", answers: ["arms"], hint: "two ⇒ số nhiều (bước ③)." },
          { q: "2. Notes (ONE WORD ONLY): the figures were checked by an independent ___. Bạn đã gõ: an auditor", answers: ["auditor"], hint: "Bỏ mạo từ — ONE WORD ONLY (bước ②)." },
          { q: "3. Form: Deposit £ ___. Bạn đã gõ: £10", answers: ["10"], hint: "Ô đã in £ ⇒ chỉ gõ số (bước ⑤)." },
          { q: "4. Form: Length ___ metres. Bạn đã gõ: 6,4", answers: ["6.4"], hint: "Dấu chấm thập phân (bước ⑤)." },
          { q: "5. Form: Surname (người nói đánh vần P-E-N-H-A-L-I-G-O-N). Bạn đã gõ: Penhaligan", answers: ["Penhaligon"], hint: "Từ đã được đánh vần thì không được sai (bước ④)." },
          { q: "6. Notes (ONE WORD AND/OR A NUMBER): arrive by ___. Bạn nghe: “a quarter to seven at the latest”. Bạn đã gõ: quarter to seven", answers: ["6.45", "6:45", "18.45", "18:45"], hint: "Ba từ vượt giới hạn ⇒ đổi thành số (bước ②)." },
          { q: "7. Notes (ONE WORD ONLY): the most important quality in a volunteer is ___. Bạn nghe: “what matters most is patience”. Bạn đã gõ: patient", answers: ["patience"], hint: "Sau is + làm “quality” ⇒ danh từ (bước ③ — loại từ của ô)." },
          { q: "8. Notes (ONE WORD ONLY): the first line linked Paris with ___. Bạn nghe: “Lille, L-I-double L-E”. Bạn đã gõ: Lile", answers: ["Lille"], hint: "double L ⇒ LL (bước ④)." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. 🔊 Số và chữ cái trong tiếng ồn — nói đúng để nghe đúng" },
      { t: "p", text: "Ba cặp số hay nhầm khi có tiếng ồn: **-teen / -ty** (trọng âm cuối ở thirTEEN, trọng âm đầu ở THIRty), **oh / zero**, và **double + số / chữ**. Đọc to từng câu dưới: nếu chính bạn đọc rõ, bạn sẽ nghe rõ. IPA trong bài không ghi dấu nhấn — trọng âm ghi bằng CHỮ HOA trong phần dịch." },
      {
        t: "phatam", id: "t5d25-phat-am", title: "Luyện phát âm — số, mã, chữ cái đánh vần (8 câu)",
        note: "Thu âm rồi nghe lại. Câu 2 và 3: phải nghe ra trọng âm khác nhau giữa -teen và -ty. Câu 5 và 8: chữ cái đọc tách rời, có ngừng ngắn sau mỗi chữ.",
        items: [
          { text: "The reference is four, one, double seven, oh, six.", ipa: "ðə refrəns ɪz fɔː wʌn dʌbl sevn əʊ sɪks", vi: "Mã đặt chỗ là 4-1-7-7-0-6. (DOUble SEVen · OH = 0)" },
          { text: "Thirteen, not thirty: one, three.", ipa: "θɜːtiːn nɒt θɜːti wʌn θriː", vi: "Mười ba, không phải ba mươi: một, ba. (thirTEEN · THIRty)" },
          { text: "It's fifteen pounds, or fifty with a cabin.", ipa: "ɪts fɪftiːn paʊndz ɔː fɪfti wɪð ə kæbɪn", vi: "Mười lăm bảng, hoặc năm mươi nếu có cabin. (fifTEEN · FIFty)" },
          { text: "Allow six point four metres with the rack on.", ipa: "əlaʊ sɪks pɔɪnt fɔː miːtəz wɪð ðə ræk ɒn", vi: "Tính sáu phẩy bốn mét khi có giá xe đạp. (POINT — dấu chấm thập phân)" },
          { text: "K, I, double T, I, W, A, K, E.", ipa: "keɪ aɪ dʌbl tiː aɪ dʌbljuː eɪ keɪ iː", vi: "Đánh vần Kittiwake — ngừng ngắn sau mỗi chữ; double T là MỘT nhịp." },
          { text: "A hundred and forty, but just a hundred and twenty-five.", ipa: "ə hʌndrəd ənd fɔːti bʌt dʒʌst ə hʌndrəd ənd twenti faɪv", vi: "Một trăm bốn mươi, nhưng chỉ một trăm hai mươi lăm. (nhấn JUST — con số bị sửa)" },
          { text: "Seventy-five minutes, so six o'clock at the latest.", ipa: "sevnti faɪv mɪnɪts səʊ sɪks əklɒk æt ðə leɪtɪst", vi: "Bảy mươi lăm phút, vậy muộn nhất là sáu giờ." },
          { text: "G for George, J for Juliet, and H, not eight.", ipa: "dʒiː fə dʒɔːdʒ dʒeɪ fə dʒuːliət ənd eɪtʃ nɒt eɪt", vi: "G như George, J như Juliet, và chữ H, không phải số 8. (H /eɪtʃ/ ≠ eight /eɪt/)" },
        ],
      },
      {
        t: "dictation", id: "t5d25-nghe-chinh-ta", title: "Nghe và gõ đúng — tên, mã, số trong câu tốc độ thật (6 câu)",
        items: [
          { label: "1. Booking reference", spell: "Sorry, that's the invoice number. The booking reference is three, nine, double one, oh, four.", answer: "391104", alt: ["39 11 04", "3 9 1 1 0 4"] },
          { label: "2. Surname", spell: "It's Pemberton. That's P, E, M, B, E, R, T, O, N. People always put an N where the M goes.", answer: "Pemberton" },
          { label: "3. Length of the boat (metres)", spell: "The brochure says seven point two, but with the outboard motor it's seven point eight.", answer: "7.8", alt: ["7,8"] },
          { label: "4. Number of guests", spell: "We said twelve, then it looked like eighteen, but in the end it'll be fourteen.", answer: "14", alt: ["fourteen"] },
          { label: "5. Name of the ship", spell: "She's called the Merrow. M, E, double R, O, W.", answer: "Merrow" },
          { label: "6. Final price in pounds", spell: "Normally that would come to ninety, but without the booking fee it's seventy-eight.", answer: "78", alt: ["seventy-eight", "£78"] },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện lại bằng câu MỚI — ba bài, cùng kỹ năng của Đề 11" },
      { t: "p", text: "Ba bài dưới ở tốc độ thật. Mỗi bài nghe MỘT lần, gõ đáp án ngay, rồi dùng **1 phút** soát theo bảy bước của mục 6 trước khi xem đáp án. Mọi tên người, cơ sở trong Practice 1 và 2 là hư cấu; dữ kiện Practice 3 soạn theo hiểu biết phổ thông, con số làm tròn." },
      {
        t: "listen", id: "t5d25-nghe-p1", title: "Practice 1 — Signing up for a language exchange",
        dan: { so: "Day 25, Recording 1", boiCanh: "a student telephoning a college office to join a language exchange scheme.", cau: [1, 8] },
        lines: [
          { who: "Declan", voice: "ie-nam", text: "Language Exchange office, Declan speaking." },
          { who: "Harriet", voice: "au-nu", text: "Hi, I'd like to sign up for the tandem scheme. Sorry if it's loud, I'm on the bus." },
          { who: "Declan", voice: "ie-nam", text: "No bother at all. Can I take your surname first?" },
          { who: "Harriet", voice: "au-nu", text: "It's Penhaligon. P, E, N, H, A, L, I, G, O, N. It's Cornish, so nobody ever gets it first time." },
          { who: "Declan", voice: "ie-nam", text: "P, E, N, H, A, L, I, G, O, N. Lovely. And your student number?" },
          { who: "Harriet", voice: "au-nu", text: "Two, oh, four, four, seven, nine. No, hang on, that's my library card. The student number's two, oh, double four, one, eight." },
          { who: "Declan", voice: "ie-nam", text: "Two oh four four one eight. And which language are you hoping to practise?" },
          { who: "Harriet", voice: "au-nu", text: "Well, I did Spanish at school, and I'd like to pick up Italian one day, but what I actually need this year is Portuguese. I'm going on placement to Coimbra in March." },
          { who: "Declan", voice: "ie-nam", text: "Portuguese. And how would you describe your level?" },
          { who: "Harriet", voice: "au-nu", text: "Honestly, I'd have called myself a beginner, but the placement test put me at intermediate, so you'd better go with that." },
          { who: "Declan", voice: "ie-nam", text: "Intermediate it is. Partners usually meet once a week. Which day suits you?" },
          { who: "Harriet", voice: "au-nu", text: "Not Thursday, I've got labs all afternoon. Monday would work at a push, but Wednesday lunchtime would be ideal." },
          { who: "Declan", voice: "ie-nam", text: "I'll put Wednesday, then. Most of our Portuguese speakers are free that day anyway. Now, most pairs meet in the café, though it gets very loud in there. There's also a roof terrace on the third floor of the Languages building, which is a lot quieter." },
          { who: "Harriet", voice: "au-nu", text: "The terrace sounds better. The café's where I go to work, so I'd never concentrate." },
          { who: "Declan", voice: "ie-nam", text: "Grand. There's no fee for students, but there's a ten-pound deposit for the handbook, which you get back at the end of the year. It's fifteen for people who aren't students." },
          { who: "Harriet", voice: "au-nu", text: "Ten's fine. When do we start?" },
          { who: "Declan", voice: "ie-nam", text: "The welcome evening is on Tuesday the third of October. Ah, no, sorry, I'm looking at last year's calendar. It's Tuesday the thirteenth." },
        ],
      },
      {
        t: "quiz", id: "t5d25-nghe-p1-dien", kind: "fill", title: "Practice 1 — Questions 1–8. Write ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Surname: ___", answers: ["Penhaligon"], hint: "P-E-N-H-A-L-I-G-O-N — được đánh vần hai lần." },
          { q: "2. Student number: ___", answers: ["204418", "20 44 18"], hint: "Dãy đầu (204479) là thẻ thư viện — “that's my library card”. C1." },
          { q: "3. Language to practise: ___", answers: ["Portuguese"], hint: "Spanish (đã học) và Italian (sau này) bị gạt: “what I actually need this year is Portuguese”. Viết hoa chữ đầu không bắt buộc khi chấm máy, nhưng chính tả phải đúng: P-o-r-t-u-g-u-e-s-e." },
          { q: "4. Current level: ___", answers: ["intermediate"], hint: "“I'd have called myself a beginner, but the placement test put me at intermediate” — giả định bị thay bằng kết quả." },
          { q: "5. Preferred day: ___", answers: ["Wednesday"], hint: "Thursday bị loại, Monday “at a push” (miễn cưỡng); Declan chốt Wednesday." },
          { q: "6. Meeting place: roof ___ (Languages building, third floor)", answers: ["terrace"], hint: "café bị loại vì ồn. Phiếu đã in roof ⇒ chỉ gõ terrace." },
          { q: "7. Refundable deposit: £___", answers: ["10", "ten"], hint: "15 là mức cho người không phải sinh viên." },
          { q: "8. Welcome evening: Tuesday ___ October", answers: ["13", "13th", "thirteenth"], hint: "the third là lịch năm ngoái — “I'm looking at last year's calendar”. C1: con số bị sửa." },
        ],
      },
      {
        t: "listen", id: "t5d25-nghe-p2", title: "Practice 2 — Choosing a case study",
        dan: { so: "Day 25, Recording 2", boiCanh: "two students discussing their choice of case study with their tutor.", cau: [9, 12] },
        lines: [
          { who: "Dr Price", voice: "uk-nu", text: "So, you've narrowed it down to two possible case studies for the community energy module. Remind me what they are." },
          { who: "Josh", voice: "au-nam", text: "The first was the wind turbine a village co-op put up on Barrow Hill about fifteen years ago. The second is the scheme where a co-op installed solar panels on the roofs of four primary schools." },
          { who: "Dr Price", voice: "uk-nu", text: "And you've dropped the turbine. Why? It's only an hour on the train." },
          { who: "Kayla", voice: "us-nu", text: "Distance wasn't really the issue. We'd happily have gone. And there's plenty written about it, the local paper covered it for years. The problem is that the co-op wound itself up in 2019, and none of the people who ran it are willing to talk to us. We wrote to three of the founders and got nothing back." },
          { who: "Dr Price", voice: "uk-nu", text: "That's a fair reason. And the school scheme, what struck you when you visited?" },
          { who: "Josh", voice: "au-nam", text: "Well, we'd assumed the parents would complain about the cost of the panels, and they didn't, really. And we thought the savings would be tiny, but they're actually quite respectable. The thing we hadn't expected at all was the pupils. Every Friday one class reads the meters and puts the figures up on the school website." },
          { who: "Dr Price", voice: "uk-nu", text: "Lovely. Now, my worry. I'm not concerned that you've only got four schools, that's the whole scheme. And I don't mind about length, you've got two thousand words to play with. What does concern me is that every figure in your draft comes from the co-op's own annual reports. They've every reason to look good." },
          { who: "Kayla", voice: "us-nu", text: "So we need something independent." },
          { who: "Dr Price", voice: "uk-nu", text: "Exactly. The schools' electricity bills, for a start." },
          { who: "Josh", voice: "au-nam", text: "And the questionnaire? We were going to send it to every parent in all four schools." },
          { who: "Dr Price", voice: "uk-nu", text: "Over a thousand families, at this point in the term? You'd get a handful back." },
          { who: "Kayla", voice: "us-nu", text: "We could scrap it altogether and just do interviews." },
          { who: "Dr Price", voice: "uk-nu", text: "I wouldn't scrap it. The parents' view is part of the story." },
          { who: "Josh", voice: "au-nam", text: "What if we did one school properly, then? The head at Fernlea has offered to send it out with the newsletter." },
          { who: "Dr Price", voice: "uk-nu", text: "That's far more manageable. Do that." },
        ],
      },
      {
        t: "mcq", id: "t5d25-nghe-p2-mcq", title: "Practice 2 — Questions 9–12. Choose A, B or C",
        items: [
          { q: "9. Why did the students reject the wind turbine project?", options: ["A It was too far away to visit.", "B Little had been published about it.", "C The people involved would not be interviewed."], correct: 2, why: "Distance wasn't really the issue (loại A); there's plenty written about it (loại B); “none of the people who ran it are willing to talk to us” ⇒ C. Hai nhượng bộ trước lý do thật — cùng kiểu câu 21 Đề 11." },
          { q: "10. What surprised the students most about the school scheme?", options: ["A the part played by the pupils", "B the parents' reaction to the cost", "C the amount of money saved"], correct: 0, why: "Hai dự đoán sai được kể trước (phụ huynh than chi phí; tiết kiệm ít). “The thing we hadn't expected at all was the pupils” ⇒ A. Cùng kiểu câu 22." },
          { q: "11. What is the tutor's main concern about their draft?", options: ["A the number of schools studied", "B where their figures come from", "C how long the report is"], correct: 1, why: "I'm not concerned… (A) · I don't mind about length (C) · “What does concern me is that every figure… comes from the co-op's own annual reports” ⇒ B. Câu chẻ What… is — cùng kiểu câu 23." },
          { q: "12. What do they decide to do about the questionnaire?", options: ["A send it to all the parents", "B replace it with interviews", "C use it at a single school"], correct: 2, why: "Gửi cả nghìn gia đình bị bác (You'd get a handful back); bỏ hẳn bị bác (I wouldn't scrap it); ý thứ BA: “did one school properly… Do that” ⇒ C. Cùng kiểu câu 24." },
        ],
      },
      {
        t: "listen", id: "t5d25-nghe-p3", title: "Practice 3 — The optical telegraph",
        dan: { so: "Day 25, Recording 3", boiCanh: "part of a lecture on an early communication network.", cau: [13, 18] },
        lines: [
          { who: "Lecturer", voice: "ca-nam", text: "Last week we looked at the electric telegraph. Today I want to go back half a century, to a network that carried messages across France faster than any horse, and without a single wire. In the early 1790s the engineer Claude Chappe and his brothers began experimenting with ways of signalling over long distances. Their early attempts used sounds, then large painted panels, and none of them worked well beyond a few kilometres." },
          { who: "Lecturer", voice: "ca-nam", text: "The design that succeeded was a tall tower with a beam on top and two movable wooden arms, one at each end of the beam. By setting the beam and the arms at different angles, an operator could produce dozens of distinct positions, each standing for a letter, a number or an entry in a code book. People often assume the operators simply looked across at the next tower. In fact the towers stood ten kilometres or more apart, and each operator watched his neighbour through a telescope, copied the position, and set his own arms to match." },
          { who: "Lecturer", voice: "ca-nam", text: "The first line, from Paris to Lille, opened in 1794, and its speed astonished people. News of a military success in the north is said to have reached Paris in under an hour, a journey that would have taken a rider the best part of a day. You might think rain was the system's great enemy, but a tower could still be read through light rain. What stopped it completely was fog, and, of course, darkness." },
          { who: "Lecturer", voice: "ca-nam", text: "It's worth stressing who could use it. It was never open to the public. Merchants asked repeatedly and were refused, and even army commanders had to go through officials. The network belonged to the government, and to nobody else. That monopoly produced one memorable scandal. In the 1830s, two businessmen are reported to have paid operators to slip deliberate errors into official messages, errors that were corrected further down the line, so that an accomplice watching through a telescope could learn which way prices were moving in Paris before anyone else. By the 1850s the electric telegraph had taken over, and the towers were abandoned." },
        ],
      },
      {
        t: "quiz", id: "t5d25-nghe-p3-dien", kind: "fill", title: "Practice 3 — Questions 13–18. Write ONE WORD ONLY",
        items: [
          { q: "13. Each tower had a beam with two movable wooden ___.", answers: ["arms"], hint: "“two movable wooden arms” — số nhiều. Mồi: panels (cách thử ban đầu, đã thất bại)." },
          { q: "14. Operators watched the next tower through a ___.", answers: ["telescope"], hint: "“People often assume… simply looked across… In fact… through a telescope” — bác kỳ vọng." },
          { q: "15. News from the north reached Paris in less than an ___.", answers: ["hour"], hint: "“in under an hour”. Mồi: day (thời gian của người cưỡi ngựa). Mạo từ an đã in sẵn ⇒ hour." },
          { q: "16. The system could not be used at night or in ___.", answers: ["fog"], hint: "“You might think rain… What stopped it completely was fog” — bác kỳ vọng + câu chẻ What… was." },
          { q: "17. Use of the network was limited to the ___.", answers: ["government"], hint: "public, merchants, army bị loại lần lượt; “belonged to the government, and to nobody else”. Chuỗi phủ định." },
          { q: "18. Two businessmen paid operators to add deliberate ___ to messages.", answers: ["errors", "mistakes"], hint: "“slip deliberate errors into official messages” — số nhiều." },
        ],
      },
      {
        t: "table", caption: "Chấm ba bài luyện (18 câu)",
        head: ["Điểm", "Nghĩa là", "Việc tiếp theo"],
        rows: [
          ["17–18", "câu tín hiệu và 2 phút kiểm đã thành phản xạ", "Ngày 28 làm Listening 40 câu, mục tiêu 35+"],
          ["14–16", "còn một kiểu câu tín hiệu chưa nhận ra", "đối chiếu câu sai với bảng mục 5; nghe lại đúng câu đó 5 lần, nói đuổi"],
          ["≤ 13", "đang ghi ngay khi nghe con số đầu tiên", "luyện lại mục 7 (dictation) và mục 2; quy tắc: nghe tín hiệu sửa ⇒ giữ bút"],
        ],
      },
      {
        t: "note", title: "📌 Sổ lỗi Listening — trang Đề 11",
        items: [
          "Mỗi câu sai: số câu · nhãn (A, B, C1, C2, C3, D, E) · câu tín hiệu đã bỏ lỡ (chép nguyên văn từ lời thoại) · đáp án đúng.",
          "Đếm nhãn B: nếu từ 2 trở lên, bảy bước của mục 6 là việc phải làm ở MỌI bài nghe từ nay tới Đề 12 — kể cả bài luyện.",
          "Nối tiếp: Ngày 28 (đề Listening 40 câu, mục tiêu 35+) và Ngày 29 (checklist 14 dạng Listening).",
        ],
      },
    ],
  },
  /* ════════════════ BÀI TẬP NGÀY 25 ════════════════ */
  {
    id: "t5d25-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 25 — giới từ cố định · hoà hợp chủ – vị · mạo từ · bị động trong process · đọc: ba bẫy của Đề 11 · nghe: câu tín hiệu + 2 phút kiểm · từ vựng",
    goal: "Ôn trọn Ngày 25 trong 65 phút: sửa đúng giới từ cố định, hoà hợp chủ – vị, mạo từ và bị động ở những chỗ Writing Đề 11 gài, dịch năm câu Task 2 không lỗi, đọc một đoạn lập luận ngắn có ba bẫy của Reading Đề 11, nghe một tin nhắn thoại có thông tin bị sửa rồi soát bằng bảy bước, và viết một đoạn discussion tự soát bốn lượt.",
    minutes: 65,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay",
        items: [
          "Phần I–V ôn **Bài 1** (năm vùng lỗi của Writing Đề 11). Làm xong, đếm số câu sai theo vùng; vùng nào sai từ 2 câu thì ghi vào sổ lỗi và đưa lên lượt 1 của bản soát 4 phút.",
          "Phần VI ôn **Bài 2**: một đoạn lập luận MỚI 200 từ có đủ ba bẫy của Đề 11.",
          "Phần VII–VIII ôn **Bài 3**: một tin nhắn thoại có con số bị sửa (giọng Anh) và bảy bước 2 phút kiểm.",
          "Phần IX: từ vựng của ngày. Phần X: viết một đoạn discussion rồi tự soát — AI chấm.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 25 trong một hình", center: "Đề 11: sửa đúng chỗ đề gài",
        branches: [
          { label: "Viết sạch", items: ["according TO · responsible FOR", "25 bottles ARE", "Ø humanity · the public", "after BEING V3"] },
          { label: "Đọc mức 4", items: ["đúng chủ đề, sai vế", "đứng gần ≠ quan hệ", "câu hỏi về chữ / chức năng", "nhượng bộ của tác giả"] },
          { label: "Nghe tín hiệu", items: ["You might imagine… Instead", "What… is", "normally… But", "days… months… weeks"] },
          { label: "2 phút kiểm", items: ["ô trống", "giới hạn từ", "số nhiều", "chính tả · số"] },
        ],
      },

      { t: "h", text: "I. Giới từ cố định — điền MỘT giới từ (6 câu) — ôn Bài 1 mục 2" },
      {
        t: "quiz", id: "t5d25-bt-gioi-tu", kind: "fill", title: "I. Điền MỘT giới từ",
        items: [
          { q: "1. The process consists ___ eight stages.", answers: ["of"], hint: "consists OF." },
          { q: "2. The milk is heated ___ 72°C for fifteen seconds.", answers: ["to"], hint: "heated TO (đạt tới nhiệt độ)." },
          { q: "3. The pulp is then passed ___ a series of rollers.", answers: ["through"], hint: "passed THROUGH." },
          { q: "4. Local councils should be accountable ___ residents for how they spend money.", answers: ["to"], hint: "accountable TO sb FOR sth." },
          { q: "5. The statue was finally handed back ___ the city it had been taken from.", answers: ["to"], hint: "hand back sth TO sb." },
          { q: "6. Many objects were acquired ___ circumstances that would not be accepted today.", answers: ["in", "under"], hint: "in / under circumstances." },
        ],
      },

      { t: "h", text: "II. Hoà hợp chủ – vị — chọn phương án đúng (6 câu) — ôn Bài 1 mục 3" },
      {
        t: "mcq", id: "t5d25-bt-hoa-hop", title: "II. is / are · was / were · has / have",
        items: [
          { q: "1. About 40 cans ___ needed to make one bicycle frame.", options: ["is", "are"], correct: 1, why: "Đếm từng lon ⇒ are." },
          { q: "2. Twenty kilograms of waste ___ collected from each street every week.", options: ["is", "are"], correct: 0, why: "Một lượng khối lượng ⇒ is." },
          { q: "3. The number of museums offering free entry ___ fallen.", options: ["has", "have"], correct: 0, why: "The number of… ⇒ số ít." },
          { q: "4. Whether such loans benefit smaller countries ___ open to question.", options: ["is", "are"], correct: 0, why: "Mệnh đề Whether làm chủ ngữ ⇒ is." },
          { q: "5. It is one of the few paintings that ___ never left the country.", options: ["has", "have"], correct: 1, why: "that thay cho paintings ⇒ have." },
          { q: "6. Each of the two stages ___ in a different building.", options: ["takes place", "take place"], correct: 0, why: "Each of… ⇒ số ít." },
        ],
      },

      { t: "h", text: "III. Mạo từ — chọn phương án đúng (4 câu) — ôn Bài 1 mục 4" },
      {
        t: "mcq", id: "t5d25-bt-mao-tu", title: "III. a / an / the / Ø",
        items: [
          { q: "1. Such treasures are part of the shared heritage of ___.", options: ["the humanity", "humanity", "a humanity"], correct: 1, why: "humanity nói chung ⇒ Ø." },
          { q: "2. Museums have a duty to explain ___ of each object they display.", options: ["history", "the history", "a history"], correct: 1, why: "the history OF each object — of-phrase xác định." },
          { q: "3. The reading room will remain open to ___ during the building work.", options: ["the public", "public", "a public"], correct: 0, why: "the public — cụm cố định." },
          { q: "4. Waste glass is taken to ___ recycling centre, where ___ glass is sorted by colour.", options: ["the · the", "a · the", "a · a"], correct: 1, why: "Lần đầu: a recycling centre; lần nhắc thứ hai: the glass." },
        ],
      },

      { t: "h", text: "IV. Process — gõ lại phần [trong ngoặc] cho đúng (5 câu) — ôn Bài 1 mục 5" },
      {
        t: "quiz", id: "t5d25-bt-process", kind: "fill", title: "IV. Bị động và rút gọn",
        items: [
          { q: "1. The beans [roasted] at 220°C for twelve minutes.", answers: ["are roasted"], hint: "Bị động hiện tại đơn: are + V3." },
          { q: "2. The coffee is then [grinded] into a fine powder.", answers: ["ground"], hint: "grind – ground – ground." },
          { q: "3. [After cooling], the bricks are stacked on pallets.", answers: ["After being cooled", "Once cooled", "After they have been cooled", "Once they have been cooled"], hint: "Gạch bị làm nguội ⇒ after being V3 (tránh chủ ngữ treo)." },
          { q: "4. [Having weighed], the parcels are loaded onto lorries.", answers: ["Having been weighed"], hint: "Bưu kiện bị cân ⇒ having been V3." },
          { q: "5. The wool is washed and dried before it [spun] into yarn.", answers: ["is spun"], hint: "Mệnh đề bị động sau before: it is spun." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2–6" },
      {
        t: "quiz", id: "t5d25-bt-dich", kind: "translate", grammar: "responsible for · the number of · Ø + N trừu tượng · While I accept that… · not wh-…, but wh-…",
        title: "V. Dịch sang tiếng Anh — không được có lỗi nhỏ nào",
        items: [
          { q: "Chính phủ phải chịu trách nhiệm bảo vệ di sản của đất nước.", answers: ["The government must be responsible for protecting the country's heritage.", "Governments must be responsible for protecting their country's heritage.", "The government should be responsible for protecting the country's heritage.", "The government must take responsibility for protecting the country's heritage.", "The government is responsible for protecting the country's heritage."], hint: "responsible for + V-ing" },
          { q: "Số người đến thăm bảo tàng đã tăng gấp đôi kể từ năm 2015.", answers: ["The number of people visiting the museum has doubled since 2015.", "The number of visitors to the museum has doubled since 2015.", "The number of people who visit the museum has doubled since 2015.", "The number of museum visitors has doubled since 2015."], hint: "The number of… has" },
          { q: "Lịch sử cho thấy những bộ sưu tập lớn thường bắt đầu từ tay tư nhân.", answers: ["History shows that great collections often began in private hands.", "History shows that large collections often began in private hands.", "History shows that great collections often started in private hands.", "History shows that great collections have often begun in private hands."], hint: "History — Ø" },
          { q: "Dù tôi thừa nhận việc vận chuyển có rủi ro, tôi tin hiện vật vẫn nên được trả lại.", answers: ["While I accept that transporting them is risky, I believe the objects should still be returned.", "While I accept that transport is risky, I believe the objects should still be returned.", "Although I accept that transporting them is risky, I believe the objects should still be returned.", "While I accept that moving them is risky, I believe that the objects should still be returned.", "While I accept that transporting them carries risks, I believe the objects should still be returned."], hint: "While I accept that…, I believe… — không but" },
          { q: "Vấn đề không phải là ai sở hữu bức tranh, mà là ai được xem nó.", answers: ["The issue is not who owns the painting, but who is able to see it.", "The question is not who owns the painting, but who can see it.", "The issue is not who owns the painting but who gets to see it.", "The issue is not who owns the painting, but who can see it.", "The question is not who owns the painting, but who is able to see it."], hint: "not who…, but who… — song song" },
        ],
      },

      { t: "h", text: "VI. Đọc — một đoạn lập luận MỚI có ba bẫy của Đề 11 (5 câu · 5 phút) — ôn Bài 2 mục 3–6" },
      {
        t: "passage", title: "The Clip and the Emblem",
        paras: [
          { text: "The paper clip is often described as a Norwegian invention. The claim rests on a patent filed in 1899 by Johan Vaaler, a Norwegian clerk; during the Second World War, Norwegians reportedly wore clips on their coats as a quiet sign of resistance, and a giant clip was later put up near Oslo in his honour. Yet Vaaler's design, a single loop without the familiar inner turn, held paper poorly and was never manufactured in quantity. The double-loop shape we use today was already on sale in Britain several years before his patent, and nobody is certain who designed it, since it seems never to have been patented at all." },
          { text: "None of this makes the Norwegian story foolish. Symbols are chosen for what they mean rather than for their accuracy, and a small object that holds things together was an apt emblem for an occupied country. The mistake lies only in treating the emblem as evidence." },
        ],
      },
      {
        t: "mcq", id: "t5d25-bt-doc", title: "VI. YES / NO / NOT GIVEN",
        items: [
          { q: "1. Vaaler's clip had the same shape as the clip in common use today.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“a single loop without the familiar inner turn” ≠ “the double-loop shape we use today” ⇒ NO. Hai thứ đứng gần nhau trong bài nhưng KHÁC nhau." },
          { q: "2. Vaaler's design was produced in large numbers.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“never manufactured in quantity” ⇒ NO. Mức 2: in quantity = in large numbers." },
          { q: "3. The double-loop clip was available before 1899.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“already on sale in Britain several years before his patent” (1899) ⇒ YES. Đổi góc nhìn thời gian." },
          { q: "4. The double-loop clip was designed by a British engineer.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "“nobody is certain who designed it” ⇒ NOT GIVEN. Bán ở Anh ≠ thiết kế bởi người Anh (đứng gần ≠ có quan hệ)." },
          { q: "5. The writer believes Norwegians were wrong to adopt the clip as a symbol.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“None of this makes the Norwegian story foolish… an apt emblem” ⇒ NO. Tác giả chỉ phản đối việc coi biểu tượng là BẰNG CHỨNG — nhượng bộ như Passage 3 Đề 11." },
        ],
      },

      { t: "h", text: "VII. Nghe — một tin nhắn thoại có thông tin bị sửa (giọng Anh) — ôn Bài 3 mục 2, 5" },
      {
        t: "listen", id: "t5d25-bt-nghe", title: "A voicemail about a furniture delivery",
        dan: { so: "Day 25, Homework recording", boiCanh: "a voicemail from a furniture shop about a delivery.", cau: [1, 5] },
        lines: [
          { who: "Megan", voice: "uk-nu", text: "Hello, this is Megan from Thornbury Furniture, calling about your sofa. I'm afraid we won't be able to deliver on Friday the twenty-first as we said. The van's booked for Saturday the twenty-second instead, and I hope that's all right." },
          { who: "Megan", voice: "uk-nu", text: "We can't give you an exact time, but the driver will phone you thirty minutes before he arrives. Some people tell us they'd like an hour's notice, but on a Saturday that just isn't possible." },
          { who: "Megan", voice: "uk-nu", text: "One thing to check before then. Most customers measure the front door, but in our experience it's almost never the door that causes problems. It's the staircase. So please measure the width of the staircase at its narrowest point and let us know." },
          { who: "Megan", voice: "uk-nu", text: "You also asked us to take away your old sofa. We used to charge twenty-five pounds for that, but it's thirty-five now, and that's payable to the driver. Oh, and if you need to call us, please quote your order reference, which is double eight, three, one, seven. Not the number at the top of the receipt, that's just the till number. Thanks, bye." },
        ],
      },
      {
        t: "quiz", id: "t5d25-bt-nghe-dien", kind: "fill", title: "VII. Questions 1–5 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. New delivery day: ___ 22nd", answers: ["Saturday"], hint: "Friday the 21st bị huỷ — “won't be able to deliver on Friday… Saturday the twenty-second instead”." },
          { q: "2. The driver will phone ___ minutes before arriving.", answers: ["30", "thirty"], hint: "an hour's notice là điều khách MUỐN — “that just isn't possible”." },
          { q: "3. Customer should measure the width of the ___.", answers: ["staircase", "stairs"], hint: "“Most customers measure the front door, but… It's the staircase.” — bác kỳ vọng." },
          { q: "4. Charge for removing the old sofa: £___", answers: ["35", "thirty-five"], hint: "25 là giá CŨ — “We used to charge… but it's thirty-five now”." },
          { q: "5. Order reference: ___", answers: ["88317", "88 317"], hint: "double eight = 88. Số trên đầu hoá đơn là số máy tính tiền — mồi." },
        ],
      },

      { t: "h", text: "VIII. 2 phút kiểm — mỗi câu một lỗi kiểu B, gõ lại đáp án đúng (5 câu) — ôn Bài 3 mục 6" },
      {
        t: "quiz", id: "t5d25-bt-kiem", kind: "fill", title: "VIII. Sửa đáp án",
        items: [
          { q: "1. Notes (ONE WORD ONLY): warnings were sent by ___. Bạn đã gõ: the telegraph", answers: ["telegraph"], hint: "Bỏ mạo từ — giới hạn từ." },
          { q: "2. Notes (ONE WORD ONLY): storm signals were large canvas ___. Bạn nghe “cones”. Bạn đã gõ: cone", answers: ["cones"], hint: "large canvas ___ (không có a) ⇒ số nhiều." },
          { q: "3. Form: Price £___. Bạn đã gõ: £125", answers: ["125"], hint: "Ô đã in £." },
          { q: "4. Notes: forecasts are given as a ___. Bạn đã gõ: probabilty", answers: ["probability"], hint: "p-r-o-b-a-b-i-l-i-t-y." },
          { q: "5. Notes (ONE WORD ONLY): he worked as an ___ driver. Bạn đã gõ: ambulence", answers: ["ambulance"], hint: "a-m-b-u-l-a-n-c-e (-ance)." },
        ],
      },

      { t: "h", text: "IX. Từ vựng của ngày — điền MỘT từ (6 câu)" },
      {
        t: "quiz", id: "t5d25-bt-tu-vung", kind: "fill", title: "IX. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. She only just s___ through her driving test on the third attempt.", answers: ["scraped"], hint: "scrape through — đỗ sát nút." },
          { q: "2. It would be r___ to draw conclusions from a single afternoon's data.", answers: ["rash"], hint: "rash — hấp tấp." },
          { q: "3. None of this is meant to b___ what the team achieved.", answers: ["belittle"], hint: "belittle — coi nhẹ." },
          { q: "4. Prices o___ their target before settling back.", answers: ["overshot", "overshoot"], hint: "overshoot – overshot." },
          { q: "5. Braille is a t___ system: it is read by touch.", answers: ["tactile"], hint: "tactile — thuộc xúc giác." },
          { q: "6. Parts of the old ship were s___ and used in the new museum.", answers: ["salvaged"], hint: "salvage — tận dụng từ đồ bỏ / xác tàu." },
        ],
      },

      { t: "h", text: "X. Viết một đoạn discussion rồi tự soát bốn lượt (150–180 từ) — AI chấm" },
      { t: "p", text: "Đề: Some people believe that historic ships, trains and aircraft should be kept in working order so that the public can travel on them. Others argue that they should be preserved in museums, where they will not be damaged. — Viết **thân bài thứ hai** của bài discussion: trình bày quan điểm bạn theo, có MỘT câu nhượng bộ và MỘT câu “not… but…” song song. Viết xong, bấm giờ 4 phút và soát theo bản Task 2 của Bài 1 mục 7." },
      {
        t: "essay", id: "t5d25-bt-viet", task: "Task 2", minWords: 150,
        prompt: "Topic: Some people believe that historic ships, trains and aircraft should be kept in working order so that the public can travel on them. Others argue that they should be preserved in museums, where they will not be damaged. Discuss both these views and give your own opinion. — Write ONLY the second body paragraph (150–180 words), presenting the view you agree with. Include one concession (While I accept that… / These are serious points, but…) and one parallel 'not… but…' sentence. Then check it in four passes: position, concession, abstract nouns (articles), prepositions after adjectives and nouns.",
        tips: [
          "Lượt 1 — lập trường: câu chủ đề có nói rõ bạn theo bên nào?",
          "Lượt 2 — nhượng bộ: không có “Although… but…”, không có “While… but…”.",
          "Lượt 3 — danh từ trừu tượng: history, heritage, the public, the past.",
          "Lượt 4 — giới từ: responsible for, access to, at the expense of, on the grounds that.",
          "Đích: không quá MỘT câu có lỗi nhỏ.",
        ],
      },
      {
        t: "note", title: "📌 Một đoạn mẫu để so SAU khi đã viết (band 8, ước tính) — 165 từ",
        items: [
          "These are serious points, but I believe that the case for keeping such machines in working order is the stronger one, at least for the more robust examples. A steam locomotive standing in a hall is a record of what the machine looked like; a locomotive pulling a train is a record of what it actually did, and of the noise, heat and effort that its crews lived with. While I accept that every journey causes some wear, parts can be repaired or replaced in a way that a lost skill cannot, and the engineers who keep these machines running are themselves part of the heritage. The question, in other words, is not whether an object survives unchanged, but what kind of knowledge survives with it. Where a vehicle is the last of its kind, or too fragile to operate safely, the museum is clearly the right place for it; for the rest, I would argue, the public is better served by a ride than by a label.",
          "Soi: nhượng bộ hai lần, không but thừa (These are serious points, but… · While I accept that…, parts can…) · song song: not whether…, but what… · Ø + danh từ trừu tượng: heritage (the heritage — có “part of the” vì xác định), knowledge · the public · giới từ: the case for, in a way that, part of. Rào đón đúng liều: at least, I would argue.",
        ],
      },

      { t: "h", text: "XI. Trang sổ lỗi Đề 11 — điền trước khi đóng bài" },
      {
        t: "table",
        head: ["Kỹ năng", "Số câu / lỗi", "Nhãn dày nhất", "Lượt soát hoặc phản xạ sẽ dùng ở Đề 12"],
        rows: [
          ["Writing Task 1", "… câu có lỗi / … câu", "…", "bản process / chart của Bài 1 mục 7"],
          ["Writing Task 2", "… câu có lỗi / … câu", "…", "bản discussion của Bài 1 mục 7"],
          ["Reading", "… / 40", "R…", "bẫy … của Bài 2 mục 6"],
          ["Listening", "… / 40", "A / B / C1 / C2 / C3 / D / E", "câu tín hiệu … · bước … của 2 phút kiểm"],
        ],
        caption: "Chép bảng vào sổ. Ngày 30 làm Đề 12 “Final”: mở trang này ra đọc lại TRƯỚC khi bấm bắt đầu.",
      },
    ],
  },
];
