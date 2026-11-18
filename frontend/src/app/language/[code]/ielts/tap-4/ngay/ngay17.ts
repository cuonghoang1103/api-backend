/**
 * IELTS Tập 4 — Ngày 17 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, số liệu, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Tường thuật học thuật: động từ tường thuật theo lập trường · mẫu câu · According to · thì ·
 *                     It is argued that / X is said to · danh từ tường thuật; Causative band 7 (have / get / make / let /
 *                     enable / prompt…, bị động be made to)   [ôn G27 G34] — nối Tập 3 Ngày 19 (reported speech) · Ngày 29 (causative)
 *                     · Tập 4 Ngày 13 (impersonal passive)
 *   Bài 2 (reading)   Flow-chart + Diagram label completion ở Passage 3 kỹ thuật — “The Machine That Set the News” (~960 từ) [R02 R16]
 *                     — nối Tập 1 Ngày 6 · Tập 2 Ngày 22 · 24 · Tập 3 Ngày 17
 *   Bài 3 (listening) Đề nhỏ Part 3 + Part 4, 20 câu (21–40), nghe một lần [L05 L06] 🔊 trọng âm từ 4–5 âm tiết
 *   Homework 36 câu.
 */
import type { Lesson } from '../data';

export const NGAY_17: Lesson[] = [
  {
    id: "t4d17-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Tường thuật học thuật (It is argued that…, According to X…) + causative band 7",
    goal: "Thuật lại ý kiến và kết quả nghiên cứu của người khác bằng đúng động từ, đúng mẫu câu, đúng thì (Smith argues that… · It is widely claimed that… · The drug is thought to have caused…), và dùng trọn nhóm causative (have sth done · get sb to V · make / let / enable / prompt · be made to V) không còn lỗi “make sb to do”.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **GRA + TR của Writing Task 2** (nêu ý kiến của “một số người” cho đúng văn học thuật) và **Reading Passage 3** (động từ tường thuật cho biết tác giả tin hay ngờ).",
          "**Động từ tường thuật mang lập trường**: note / observe (trung lập) · suggest / imply (dè dặt) · argue / maintain (mạnh) · claim / allege (người viết **chưa tin**).",
          "Mẫu câu đi theo động từ: **argue that** · **question whether** · **describe X as** · **attribute X to Y** · **criticise X for V-ing**. Không có ~~mention about~~, ~~discuss about~~, ~~According to me~~.",
          "Thì: ý kiến còn giá trị ⇒ **hiện tại đơn** (Smith argues); một phát hiện cụ thể ⇒ **quá khứ đơn** (found); cả một mảng nghiên cứu ⇒ **hiện tại hoàn thành** (studies have shown).",
          "Giấu người nói: **It is argued that…** / **X is said to V / to have V3** (nối Ngày 13).",
          "Causative: **have / get sth done** · **have sb V** · **get sb to V** · **make / let sb V** · **enable / allow / prompt / force sb to V** · bị động **be made to V**, **be allowed to V** (let không có bị động).",
        ],
      },

      { t: "h", text: "1. Ôn 90 giây — câu tường thuật (Tập 3 Ngày 19) và have sth done (Tập 3 Ngày 29)" },
      { t: "p", text: "Ở Tập 3 bạn đã học **lùi thì** khi thuật lại lời nói (said that he **was** tired), cách thuật câu hỏi (asked **whether / where** + S + V, không đảo), mệnh lệnh (told sb **to V**) và cấu trúc **have / get + vật + V3** (nhờ người khác làm). Hôm nay ta nâng cả hai lên mức học thuật. Làm 6 câu dưới đây trước; sai từ 2 câu trở lên thì mở lại Tập 3 Ngày 19 mục 2–4 và Ngày 29 mục 2." },
      {
        t: "quiz", id: "t4d17-on-dau-bai", kind: "fill", title: "Kiểm tra đầu bài — điền MỘT từ hoặc dạng đúng của động từ (6 câu)",
        items: [
          { q: "“We are short of staff.” → The manager said that they ___ short of staff.", answers: ["were"], hint: "lùi thì: are → …" },
          { q: "“Where do the samples come from?” → She asked where the samples ___ from.", answers: ["came", "come"], hint: "câu hỏi gián tiếp không dùng do / did" },
          { q: "“Don't touch the equipment.” → The technician told us ___ to touch the equipment.", answers: ["not"], hint: "tell sb + … + to V" },
          { q: "“Have you finished the report?” → He asked ___ I had finished the report.", answers: ["whether", "if"] },
          { q: "The council is going to have the bridge ___ (repair) next year.", answers: ["repaired"], hint: "have + vật + V3" },
          { q: "I got my laptop ___ (fix) at a shop near the campus.", answers: ["fixed"] },
        ],
      },
      { t: "rule", formula: "S + said (that) + S + V lùi thì · asked whether / Wh- + S + V · have / get + O + V3", vi: "Ba khung nền của Tập 3. Mọi thứ hôm nay xây trên ba khung này." },

      { t: "h", text: "2. Động từ tường thuật mang LẬP TRƯỜNG — chọn động từ là đã nêu thái độ" },
      { t: "p", text: "Ở band 6, người viết chỉ dùng **say** và **think**. Ở band 7, động từ tường thuật (reporting verb — động từ dùng để dẫn lời, dẫn ý của người khác) phải nói được hai điều: **người kia chắc tới đâu** và **bạn, người viết, có tin hay không**. Cùng một ý “điện thoại làm giảm sự tập trung”, bốn động từ cho bốn sắc thái khác nhau." },
      {
        t: "table",
        head: ["Nhóm", "Động từ", "Sắc thái", "Ví dụ"],
        rows: [
          ["Trung lập", "state · note · observe · report · point out · explain", "chỉ thuật lại, không bình luận", "The report **notes** that rents have doubled since 2010."],
          ["Dè dặt", "suggest · indicate · imply · propose · speculate", "người kia không nói chắc", "Early results **suggest** that the scheme is working."],
          ["Mạnh", "argue · maintain · contend · insist · assert · emphasise", "người kia nêu quan điểm và bảo vệ nó", "Economists **argue** that the tax would harm small firms."],
          ["Người viết còn NGỜ", "claim · allege · assume", "“họ nói vậy, tôi chưa chắc”", "The company **claims** that its packaging is fully recyclable."],
          ["Đồng ý / nhượng bộ", "acknowledge · accept · concede · admit · confirm", "thừa nhận một điểm (thường là điểm bất lợi)", "Even supporters **concede** that the costs are high."],
          ["Phản bác", "question · challenge · dispute · reject · deny · doubt", "không đồng ý với ý đã có", "Recent studies **challenge** the view that multitasking saves time."],
          ["Chứng minh", "show · demonstrate · find · reveal · establish · prove", "có bằng chứng — người viết **tin**", "The survey **found** that two-thirds of commuters drive alone."],
        ],
      },
      {
        t: "note", title: "Cẩn thận: bốn chỗ người Việt hay chọn sai động từ",
        items: [
          "**claim ≠ “nói” trung lập.** Viết “Scientists claim that smoking causes cancer” là vô tình tỏ ý **nghi ngờ** một sự thật đã được chứng minh. Sự thật đã chứng minh: **show / demonstrate / have established**.",
          "**prove** quá mạnh cho khoa học xã hội. Một khảo sát không “chứng minh” được gì: dùng **suggest / indicate / show**.",
          "**mention** = nhắc qua, không phải ý chính. Đừng viết “The author mentions that…” cho luận điểm trung tâm của bài — dùng **argue / maintain**.",
          "**imply** (người nói ngụ ý) ≠ **infer** (người nghe suy ra). The data **imply** a link; we can **infer** from the data that there is a link.",
        ],
      },
      {
        t: "mcq", id: "t4d17-lap-truong", title: "Chọn động từ tường thuật hợp nhất (6 câu)",
        items: [
          { q: "The manufacturer ______ that the device lasts ten years, but independent tests put the figure closer to four.", options: ["demonstrates", "claims", "establishes", "reveals"], correct: 1, why: "Vế sau cho thấy người viết KHÔNG tin ⇒ claims. Ba động từ còn lại hàm ý điều được thuật là đúng." },
          { q: "A thirty-year study of 12,000 adults has ______ that regular walking lowers the risk of heart disease.", options: ["alleged", "speculated", "shown", "conceded"], correct: 2, why: "Bằng chứng mạnh, người viết tin ⇒ shown. Allege = cáo buộc chưa có chứng cứ; speculate = phỏng đoán; concede = thừa nhận điểm bất lợi." },
          { q: "Although they support the new airport, ministers ______ that it will increase noise for nearby residents.", options: ["acknowledge", "dispute", "deny", "question"], correct: 0, why: "Although they support… ⇒ thừa nhận một điểm bất lợi: acknowledge. Ba từ kia là phản bác." },
          { q: "With only forty participants, the experiment can do no more than ______ that the two factors are linked.", options: ["prove", "confirm", "establish", "suggest"], correct: 3, why: "Mẫu nhỏ, “no more than” ⇒ động từ dè dặt: suggest." },
          { q: "Several historians ______ the traditional view that the famine was caused by weather alone.", options: ["note", "challenge", "explain", "report"], correct: 1, why: "the traditional view ⇒ các sử gia bác quan điểm cũ: challenge + N." },
          { q: "In her book, Okafor ______ that cities, not nations, will drive economic growth this century; the remaining chapters defend this position.", options: ["mentions", "admits", "argues", "doubts"], correct: 2, why: "Luận điểm chính được bảo vệ suốt cuốn sách ⇒ argues. Mentions = chỉ nhắc qua." },
        ],
      },
      { t: "rule", formula: "S + note / suggest / argue / claim / concede / challenge / show + …", vi: "Trung lập → dè dặt → mạnh → còn ngờ → nhượng bộ → phản bác → có bằng chứng. Chọn động từ theo điều BẠN muốn người đọc hiểu về nguồn." },

      { t: "h", text: "3. Mẫu câu đi theo từng động từ — sai mẫu là sai ngữ pháp" },
      { t: "p", text: "Mỗi động từ tường thuật chỉ nhận một số mẫu câu (verb pattern). Đây là chỗ bài band 6.5 rơi nhiều lỗi nhất, vì tiếng Việt “đề cập **về**”, “thảo luận **về**”, “đề nghị ai **làm**” đều dịch sai sang tiếng Anh." },
      {
        t: "patterns",
        rows: [
          { formula: "S + V + that + S + V (argue · claim · suggest · note · maintain · acknowledge · find · show)", vi: "mẫu chung nhất: động từ + mệnh đề that", examples: [{ en: "Critics maintain that the policy widens inequality.", vi: "Giới phê bình giữ quan điểm rằng chính sách này nới rộng bất bình đẳng." }] },
          { formula: "S + V + N (challenge · question · reject · dispute · support · emphasise · discuss · mention)", vi: "động từ + cụm danh từ, KHÔNG giới từ", examples: [{ en: "The article discusses the causes of urban flooding.", vi: "Bài báo bàn về các nguyên nhân ngập đô thị." }, { en: "Few researchers dispute the accuracy of these figures.", vi: "Ít nhà nghiên cứu tranh cãi về độ chính xác của các con số này." }] },
          { formula: "S + question / doubt / examine + whether + S + V", vi: "nghi vấn một điều có đúng không", examples: [{ en: "The authors question whether online degrees have the same value.", vi: "Các tác giả đặt nghi vấn liệu bằng học trực tuyến có cùng giá trị hay không." }] },
          { formula: "S + describe / regard / see / view + O + as + N / adj", vi: "coi / mô tả cái gì là…", examples: [{ en: "The minister described the results as encouraging.", vi: "Bộ trưởng mô tả kết quả là đáng khích lệ." }] },
          { formula: "S + attribute + O + to + N · blame + O + on + N / blame + sb + for + V-ing", vi: "quy nguyên nhân", examples: [{ en: "The report attributes the decline to cheaper imports.", vi: "Báo cáo quy sự sụt giảm cho hàng nhập khẩu rẻ hơn." }] },
          { formula: "S + criticise / praise + O + for + V-ing · accuse + O + of + V-ing", vi: "chê / khen / cáo buộc ai vì việc gì", examples: [{ en: "Campaigners accused the firm of misleading customers.", vi: "Các nhà vận động cáo buộc công ty đánh lừa khách hàng." }] },
          { formula: "S + suggest / recommend / propose + V-ing · + that + S + (should) + V", vi: "đề xuất — KHÔNG có suggest sb to V", examples: [{ en: "The committee recommends that the fee be reduced.", vi: "Uỷ ban khuyến nghị giảm mức phí." }, { en: "She suggested extending the trial by six months.", vi: "Bà ấy đề xuất kéo dài đợt thử thêm sáu tháng." }] },
          { formula: "S + advise / urge / encourage / warn + O + (not) to V", vi: "khuyên / hối thúc / cảnh báo ai làm gì", examples: [{ en: "Doctors urge parents to limit screen time.", vi: "Bác sĩ hối thúc phụ huynh hạn chế thời gian nhìn màn hình." }] },
        ],
      },
      {
        t: "note", title: "Cẩn thận: sáu lỗi mẫu câu hay sai nhất",
        items: [
          "~~The writer mentions about the cost.~~ → The writer **mentions the cost**. (mention / discuss / emphasise / consider + N, không **about**)",
          "~~The report suggests the government to raise taxes.~~ → …**suggests that the government (should) raise** taxes.",
          "~~He explained me the method.~~ → He **explained the method to me**. (explain / describe / suggest + vật + **to** + người)",
          "~~They said me that…~~ → They **told me** that… / They **said** that… (say không nhận tân ngữ người)",
          "~~Experts warn about that prices will rise.~~ → Experts **warn that** prices will rise. (trước that không có giới từ)",
          "~~She denied to copy the data.~~ → She **denied copying** the data. (deny / admit + V-ing; refuse / agree / promise + to V)",
        ],
      },
      { t: "rule", formula: "V + that-clause · V + N · V + whether · describe O as · attribute O to N · accuse O of V-ing · suggest V-ing / that S (should) V", vi: "Học động từ tường thuật là học luôn mẫu câu của nó. Không thêm about, không thêm tân ngữ người sau say / suggest / explain." },
      {
        t: "quiz", id: "t4d17-mau-cau-dich", kind: "translate", title: "Dịch Việt → Anh — đúng mẫu của động từ trong gợi ý (5 câu)", grammar: "V + that · V + N · describe O as · attribute O to · suggest that S (should) V",
        items: [
          { q: "Bài báo bàn về tác động của du lịch.", answers: ["The article discusses the impact of tourism.", "The article discusses the effects of tourism.", "The article discusses the effect of tourism.", "The article discusses the impacts of tourism."], hint: "discuss + N (không about)" },
          { q: "Nhiều chuyên gia đặt nghi vấn liệu kế hoạch này có thực tế không.", answers: ["Many experts question whether this plan is realistic.", "Many experts question whether the plan is realistic.", "Many experts doubt whether this plan is realistic.", "Many experts doubt whether the plan is realistic."], hint: "question whether + S + V" },
          { q: "Báo cáo quy sự gia tăng béo phì cho lối sống ít vận động.", answers: ["The report attributes the rise in obesity to a sedentary lifestyle.", "The report attributes the increase in obesity to a sedentary lifestyle.", "The report attributes the rise in obesity to sedentary lifestyles.", "The report attributes the increase in obesity to sedentary lifestyles.", "The report attributes rising obesity to a sedentary lifestyle.", "The report attributes rising obesity to sedentary lifestyles."], hint: "attribute A to B · sedentary lifestyle" },
          { q: "Các nhà phê bình mô tả chính sách này là thiển cận.", answers: ["Critics describe this policy as short-sighted.", "Critics describe the policy as short-sighted.", "Critics describe this policy as shortsighted.", "Critics describe the policy as shortsighted.", "Critics have described this policy as short-sighted.", "Critics have described the policy as short-sighted."], hint: "describe O as + adj · short-sighted" },
          { q: "Nghiên cứu đề xuất rằng các trường nên bắt đầu muộn hơn.", answers: ["The study suggests that schools should start later.", "The study suggests that schools start later.", "The research suggests that schools should start later.", "The research suggests that schools start later.", "The study proposes that schools should start later.", "The study recommends that schools should start later.", "The study recommends that schools start later."], hint: "suggest that + S + (should) + V" },
        ],
      },

      { t: "h", text: "4. According to X · As X points out · In X's view — dẫn nguồn không cần động từ tường thuật" },
      { t: "p", text: "Có ba cách dẫn nguồn bằng **cụm mở đầu**. Chúng tiện, nhưng mỗi cách có một luật nhỏ mà người học hay phá." },
      {
        t: "table",
        head: ["Cụm", "Dùng khi", "Ví dụ đúng", "Lỗi hay gặp"],
        rows: [
          ["**According to + nguồn,** S + V", "nguồn là người khác / tài liệu / số liệu", "**According to** the World Bank, remittances now exceed foreign aid.", "~~According to me / my opinion~~ → **In my view** · ~~According to the report, it says that…~~ (thừa says)"],
          ["**As + X + V (notes / points out / argues),** S + V", "bạn **đồng ý** với nguồn", "**As** Lee **points out**, cheap flights have a hidden cost.", "~~As Lee points out that…~~ (thừa that)"],
          ["**In X's view / opinion,** · **For X,**", "nêu quan điểm (chưa chắc bạn đồng ý)", "**In the authors' view**, the ban came too late.", "~~In the view of me~~"],
          ["**X's study / survey / findings** + show / suggest", "chủ ngữ là công trình, không phải người", "**Their findings suggest** that noise affects memory.", "~~According to their findings suggest…~~"],
        ],
      },
      {
        t: "note", title: "Mẹo: According to đã là động từ tường thuật rồi",
        items: [
          "Sau **According to X,** viết thẳng nội dung: According to the survey, **most students work part-time**. Không thêm “it says / it shows / X claims”.",
          "**According to** chỉ dùng cho **người khác**. Ý của mình: In my view · I would argue that · It seems to me that.",
          "Trong Task 2 bạn không có nguồn thật để dẫn. Đừng bịa “According to a 2019 Harvard study, 73%…”. Giám khảo không chấm con số; viết **It is often argued that…** hoặc **Many people believe…** là đủ và trung thực.",
        ],
      },
      { t: "rule", formula: "According to + N, S + V · As + S + V (points out), S + V · In + N's view, S + V", vi: "Cụm dẫn nguồn đứng đầu câu, sau đó là mệnh đề chính trọn vẹn — không thêm that, không thêm it says." },

      { t: "h", text: "5. Thì của động từ tường thuật — không phải lúc nào cũng lùi thì" },
      { t: "p", text: "Tập 3 dạy: động từ dẫn ở quá khứ thì mệnh đề sau lùi một thì. Văn học thuật dùng luật rộng hơn: **chọn thì theo việc bạn coi ý đó còn giá trị hay đã thuộc về một thời điểm**." },
      {
        t: "table",
        head: ["Thì của động từ dẫn", "Nghĩa", "Ví dụ"],
        rows: [
          ["**Hiện tại đơn**", "ý kiến / lý thuyết / nội dung văn bản — coi như vẫn đang “nói”", "Keynes **argues** that governments should spend during a recession. · The chart **shows** that sales fell."],
          ["**Quá khứ đơn**", "một nghiên cứu cụ thể, đã làm xong ở một thời điểm", "In 2018, a Dutch team **found** that cyclists **lived** longer."],
          ["**Hiện tại hoàn thành**", "nhiều nghiên cứu / cả một mảng, tới nay", "Numerous studies **have shown** that sleep **affects** learning."],
        ],
      },
      {
        t: "note", title: "Cẩn thận: lùi thì hay không?",
        items: [
          "Động từ dẫn ở **quá khứ** + điều được thuật **vẫn đúng** ⇒ được giữ hiện tại: Researchers **found** that the brain **uses** about 20% of the body's energy. Lùi thì (used) cũng đúng, nhưng giữ hiện tại nhấn rằng đây là sự thật chung.",
          "Động từ dẫn ở **quá khứ** + điều chỉ đúng **lúc đó** ⇒ bắt buộc lùi: The survey found that 40% of staff **were** unhappy with the new rota.",
          "Động từ dẫn ở **hiện tại** ⇒ **không lùi thì**: ~~Smith argues that prices would rise~~ (trừ khi vốn là would) → Smith argues that prices **will** rise.",
          "Đừng đổi thì giữa chừng một đoạn khi vẫn nói về cùng một nguồn.",
        ],
      },
      { t: "rule", formula: "S + argues (ý kiến) / found (một nghiên cứu) / have shown (nhiều nghiên cứu) + that + S + V", vi: "Hiện tại đơn cho ý kiến còn giá trị, quá khứ đơn cho một kết quả cụ thể, hiện tại hoàn thành cho cả mảng nghiên cứu." },
      {
        t: "quiz", id: "t4d17-thi-dich", kind: "translate", title: "Dịch Việt → Anh — chọn đúng thì của động từ dẫn (4 câu)", grammar: "argues / found / have shown + that",
        items: [
          { q: "Nhiều nghiên cứu đã cho thấy rằng tập thể dục cải thiện trí nhớ.", answers: ["Many studies have shown that exercise improves memory.", "Numerous studies have shown that exercise improves memory.", "A number of studies have shown that exercise improves memory.", "Many studies have shown that physical exercise improves memory."], hint: "have shown · improves (sự thật chung)" },
          { q: "Năm 2015, một cuộc khảo sát phát hiện rằng một nửa số nhân viên bị căng thẳng.", answers: ["In 2015, a survey found that half of the employees were stressed.", "In 2015, a survey found that half of employees were stressed.", "In 2015 a survey found that half of the employees were stressed.", "In 2015, a survey found that half of the staff were stressed.", "In 2015, a survey found that half the employees were stressed.", "In 2015 a survey found that half of employees were stressed."], hint: "found · were (chỉ đúng lúc đó)" },
          { q: "Trong chương ba, tác giả lập luận rằng quảng cáo định hình thói quen của chúng ta.", answers: ["In chapter three, the author argues that advertising shapes our habits.", "In Chapter 3, the author argues that advertising shapes our habits.", "In chapter 3, the author argues that advertising shapes our habits.", "In Chapter Three, the author argues that advertising shapes our habits.", "In chapter three the author argues that advertising shapes our habits."], hint: "argues (nội dung sách ⇒ hiện tại đơn)" },
          { q: "Biểu đồ cho thấy doanh số đã giảm mạnh vào năm 2020.", answers: ["The chart shows that sales fell sharply in 2020.", "The graph shows that sales fell sharply in 2020.", "The chart shows that sales dropped sharply in 2020.", "The chart shows that sales declined sharply in 2020.", "The graph shows that sales dropped sharply in 2020.", "The chart shows that sales decreased sharply in 2020."], hint: "shows + fell" },
        ],
      },

      { t: "h", text: "6. Giấu người nói: It is argued that… · X is said to… (ôn nhanh Ngày 13 · mục 4 — điểm mới: dùng để TƯỜNG THUẬT, và động từ nào vào được khung 2)" },
      { t: "p", text: "Ngày 13 bạn đã dùng **impersonal passive** (bị động vô nhân xưng — câu bị động không nêu ai nói) để nói dè dặt. Hôm nay dùng nó để **tường thuật**: khi người nói là “người ta nói chung”, hoặc khi nội dung quan trọng hơn người nói. Có hai khung; khung 2 khó hơn và được điểm GRA cao hơn." },
      {
        t: "patterns",
        rows: [
          { formula: "It + is + V3 (said · argued · believed · claimed · estimated · reported · widely accepted) + that + S + V", vi: "Khung 1 — chủ ngữ giả It", examples: [{ en: "It is often argued that prisons fail to reform offenders.", vi: "Người ta thường lập luận rằng nhà tù không cải tạo được phạm nhân." }, { en: "It is widely accepted that early diagnosis saves lives.", vi: "Người ta thừa nhận rộng rãi rằng chẩn đoán sớm cứu được nhiều mạng người." }] },
          { formula: "S + is / are + V3 + to V (việc hiện tại / chung)", vi: "Khung 2a — đưa chủ ngữ thật lên đầu", examples: [{ en: "Bilingual children are thought to switch tasks more easily.", vi: "Trẻ song ngữ được cho là chuyển việc dễ hơn." }] },
          { formula: "S + is / are + V3 + to have + V3 (việc ĐÃ xảy ra trước)", vi: "Khung 2b — nguyên mẫu hoàn thành", examples: [{ en: "The first settlers are believed to have arrived by sea.", vi: "Những người định cư đầu tiên được cho là đã đến bằng đường biển." }] },
          { formula: "S + is / are + V3 + to be + V-ing (việc đang diễn ra)", vi: "Khung 2c", examples: [{ en: "Several banks are reported to be reviewing their lending rules.", vi: "Một số ngân hàng được đưa tin là đang rà soát quy định cho vay." }] },
          { formula: "There + is / are + V3 + to be + N", vi: "Khung 2d — với There", examples: [{ en: "There are thought to be fewer than 500 of these birds left in the wild.", vi: "Người ta cho rằng loài chim này chỉ còn chưa tới 500 cá thể ngoài tự nhiên." }] },
        ],
      },
      {
        t: "note", title: "Cẩn thận: ba lỗi ở khung 2",
        items: [
          "~~The settlers are believed that they arrived by sea.~~ Sau chủ ngữ thật **không dùng that** → are believed **to have arrived**.",
          "Quên **to have + V3** cho việc quá khứ: ~~The species is thought to disappear 300 years ago~~ → is thought **to have disappeared**.",
          "Không phải động từ nào cũng vào được khung 2. Dùng được: say, believe, think, know, report, expect, consider, estimate, allege, understand. **argue** và **suggest** vào khung 2 rất hiếm và dễ nghe gượng (~~The policy is suggested to work~~) — với hai động từ này, an toàn nhất là khung 1: **It is argued / suggested that…**",
        ],
      },
      { t: "rule", formula: "It is V3 that S + V = S + is V3 + to V / to have V3 / to be V-ing", vi: "Khung 1 mở bài Task 2 an toàn; khung 2 gọn hơn và cho thấy bạn điều khiển được nguyên mẫu hoàn thành." },
      {
        t: "quiz", id: "t4d17-vo-nhan-xung-dich", kind: "translate", title: "Dịch Việt → Anh — bắt buộc bắt đầu bằng từ trong gợi ý (4 câu)", grammar: "It is V3 that… / S is V3 to V / to have V3",
        items: [
          { q: "Người ta tin rộng rãi rằng đọc sách làm giảm căng thẳng.", answers: ["It is widely believed that reading reduces stress.", "It is widely believed that reading books reduces stress."], hint: "It is widely believed that…" },
          { q: "Bức thư được cho là đã được viết trước chiến tranh.", answers: ["The letter is thought to have been written before the war.", "The letter is believed to have been written before the war.", "The letter is said to have been written before the war."], hint: "The letter is thought to have been + V3" },
          { q: "Hai công ty được đưa tin là đang đàm phán sáp nhập.", answers: ["The two companies are reported to be negotiating a merger.", "The two companies are reported to be discussing a merger.", "The two companies are said to be negotiating a merger.", "The two companies are reported to be in talks about a merger."], hint: "The two companies are reported to be + V-ing" },
          { q: "Người ta ước tính có khoảng hai triệu người vô gia cư.", answers: ["There are estimated to be about two million homeless people.", "There are estimated to be around two million homeless people.", "It is estimated that there are about two million homeless people.", "It is estimated that there are around two million homeless people.", "There are estimated to be approximately two million homeless people."], hint: "There are estimated to be… / It is estimated that there are…" },
        ],
      },

      { t: "h", text: "7. Danh từ tường thuật: the claim that… · the finding that… — gói một ý kiến thành chủ ngữ" },
      { t: "p", text: "Động từ tường thuật nào cũng có một danh từ đi cùng. Dùng danh từ, bạn biến cả một ý kiến thành **chủ ngữ hoặc tân ngữ** của câu mới rồi bình luận về nó. Đây là cách văn band 7 “nêu rồi bác” gọn trong một câu (nối Ngày 2 mục phản biện)." },
      {
        t: "table",
        head: ["Động từ", "Danh từ + that", "Ví dụ"],
        rows: [
          ["claim", "the **claim** that", "**The claim that** technology isolates people is not supported by the evidence."],
          ["argue", "the **argument** that", "**The argument that** higher wages cost jobs deserves closer examination."],
          ["assume", "the **assumption** that", "The plan rests on **the assumption that** demand will keep growing."],
          ["suggest", "the **suggestion** that", "She rejected **the suggestion that** the data had been altered."],
          ["find", "the **finding** that", "**The finding that** class size matters little surprised many teachers."],
          ["believe", "the **belief** / the **view** / the **notion** / the **idea** that", "There is a widespread **belief that** natural products are always safe."],
        ],
      },
      { t: "note", title: "Ghi nhớ: đây là that “giải thích nội dung”, không phải that quan hệ", items: ["Sau the claim / the idea / the fact… chỉ dùng **that**, không dùng which: ~~the claim which technology isolates people~~.", "Danh từ tường thuật đi với động từ đánh giá: the claim **is misleading / is hard to sustain / has been widely challenged / is borne out by** the data."] },
      { t: "rule", formula: "The claim / argument / assumption / view + that + S + V + is / has been + adj / V3", vi: "Biến ý của người khác thành chủ ngữ, rồi dành động từ chính cho đánh giá của bạn." },
      {
        t: "quiz", id: "t4d17-danh-tu", kind: "fill", title: "Viết danh từ tường thuật từ động từ trong ngoặc (5 câu)",
        items: [
          { q: "The ___ (assume) that young people prefer city life is increasingly questioned.", answers: ["assumption"] },
          { q: "There is little evidence for the ___ (claim) that the drink improves concentration.", answers: ["claim"] },
          { q: "One surprising ___ (find) was that older staff adapted faster than younger ones.", answers: ["finding"] },
          { q: "I find the ___ (argue) that zoos protect endangered species only partly convincing.", answers: ["argument"] },
          { q: "The minister dismissed any ___ (suggest) that the figures had been manipulated.", answers: ["suggestion"] },
        ],
      },

      { t: "h", text: "8. Causative band 7 — khiến, cho phép, buộc ai / cái gì làm gì" },
      { t: "p", text: "**Causative** (thể sai khiến) là nhóm cấu trúc nói “A làm cho B làm việc gì”. Tập 3 Ngày 29 dạy **have / get sth done** và **make / let / allow**. Ở band 7 bạn cần cả bảng, vì đây chính là ngôn ngữ **nguyên nhân – kết quả** của Task 2: công nghệ **cho phép** người ta…, giá nhà **buộc** thanh niên…, khủng hoảng **khiến** chính phủ…" },
      {
        t: "table",
        head: ["Cấu trúc", "Nghĩa", "Ví dụ"],
        rows: [
          ["**have / get + vật + V3**", "nhờ / thuê người khác làm cho mình", "Most households **have their waste collected** weekly."],
          ["**have + người + V**", "giao việc (mình có quyền)", "The professor **had her assistants check** every figure."],
          ["**get + người + to V**", "thuyết phục để ai chịu làm", "It is hard to **get teenagers to read** for pleasure."],
          ["**make + O + V**", "bắt buộc / gây ra (không to)", "Low pay **makes many nurses leave** the profession."],
          ["**let + O + V**", "cho phép (không to)", "Some firms **let staff choose** their own hours."],
          ["**allow / permit / enable + O + to V**", "cho phép / tạo điều kiện", "Remote access **enables employees to work** from anywhere."],
          ["**cause / lead / prompt / drive / encourage + O + to V**", "khiến / thúc đẩy", "Rising rents **have prompted families to move** further out."],
          ["**force / compel / oblige / require + O + to V**", "buộc", "The drought **forced farmers to sell** their livestock."],
          ["**prevent / stop / discourage + O + from V-ing**", "ngăn", "High fees **discourage poorer students from applying**."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + be + made + to V", vi: "Bị động của make: PHẢI có to", examples: [{ en: "Drivers were made to pay a daily charge.", vi: "Tài xế bị buộc trả một khoản phí hằng ngày." }] },
          { formula: "S + be + allowed / permitted + to V", vi: "let KHÔNG có bị động → mượn allow", examples: [{ en: "Visitors are not allowed to take photographs.", vi: "Khách không được phép chụp ảnh." }] },
          { formula: "S + be + forced / required / encouraged / enabled + to V", vi: "bị động của nhóm + O + to V", examples: [{ en: "Many graduates are forced to accept low-skilled work.", vi: "Nhiều cử nhân buộc phải nhận việc tay nghề thấp." }] },
        ],
      },
      {
        t: "note", title: "Cẩn thận: bảy lỗi causative ở band 6.5",
        items: [
          "~~This makes people to feel lonely.~~ → makes people **feel** lonely. (make / let / have + O + **V trần**)",
          "~~Parents should let children to decide.~~ → let children **decide**.",
          "~~Children are let to play outside.~~ → Children **are allowed to** play outside.",
          "~~He was made work overtime.~~ → He was made **to work** overtime.",
          "~~The internet enables to work from home.~~ → enables **people to work** / **makes it possible to work** from home. (enable / allow cần tân ngữ)",
          "~~I cut my hair yesterday.~~ (tự cắt) → I **had my hair cut**. · ~~I had cut my hair~~ (quá khứ hoàn thành, nghĩa khác).",
          "~~Advertising causes children want more toys.~~ → **causes** children **to want**… · ~~prevent people to drive~~ → prevent people **from driving**.",
        ],
      },
      { t: "rule", formula: "make / let / have + O + V · get / allow / enable / cause / force + O + to V · be made / allowed / forced + to V · prevent + O + from V-ing", vi: "Ba động từ không to (make, let, have); mọi động từ còn lại có to; bị động của make lấy lại to; let mượn be allowed to." },
      {
        t: "quiz", id: "t4d17-causative-dich", kind: "translate", title: "Dịch Việt → Anh — causative (5 câu)", grammar: "make / let + O + V · enable / force + O + to V · have + O + V3 · be made to V",
        items: [
          { q: "Công nghệ cho phép người lớn tuổi sống độc lập lâu hơn.", answers: ["Technology enables older people to live independently for longer.", "Technology allows older people to live independently for longer.", "Technology enables the elderly to live independently for longer.", "Technology allows the elderly to live independently for longer.", "Technology enables older people to live independently longer.", "Technology allows older people to live independently longer."], hint: "enable / allow + O + to V" },
          { q: "Giá nhà cao buộc nhiều người trẻ phải sống với bố mẹ.", answers: ["High house prices force many young people to live with their parents.", "High housing prices force many young people to live with their parents.", "High house prices oblige many young people to live with their parents.", "High house prices compel many young people to live with their parents.", "High property prices force many young people to live with their parents."], hint: "force + O + to V" },
          { q: "Quảng cáo khiến trẻ em muốn những thứ chúng không cần.", answers: ["Advertising makes children want things they do not need.", "Advertising makes children want things they don't need.", "Advertising makes children want things that they do not need.", "Advertising makes children want things that they don't need.", "Advertisements make children want things they do not need.", "Advertisements make children want things they don't need."], hint: "make + O + V (không to)" },
          { q: "Công ty cho kiểm tra thiết bị hai lần một năm.", answers: ["The company has its equipment checked twice a year.", "The company has the equipment checked twice a year.", "The company gets its equipment checked twice a year.", "The company has its equipment inspected twice a year.", "The company has the equipment inspected twice a year.", "The company has its equipment tested twice a year."], hint: "have + O + V3" },
          { q: "Học sinh bị bắt mặc đồng phục.", answers: ["Students are made to wear uniforms.", "Pupils are made to wear uniforms.", "Students are made to wear a uniform.", "Pupils are made to wear a uniform.", "Students are made to wear uniform.", "Students are forced to wear uniforms.", "Students are required to wear uniforms."], hint: "be made to V" },
        ],
      },

      { t: "h", text: "9. Dùng trong bài thi: từ band 6 lên band 7" },
      {
        t: "table",
        head: ["Chỗ dùng", "Band 6", "Band 7"],
        rows: [
          ["Task 2 — nêu quan điểm của “một số người”", "Some people say that zoos are cruel. They think animals are not happy.", "**It is often argued that** zoos are inherently cruel, **on the grounds that** captivity **prevents animals from behaving** naturally."],
          ["Task 2 — nêu rồi bác", "Some people think technology makes us lonely. I don't agree.", "**The claim that** technology isolates people **overlooks** the way it **enables** distant relatives **to stay** in daily contact."],
          ["Task 2 — nguyên nhân", "Because rent is high, young people must live far away.", "Soaring rents **have forced** many young workers **to move** to the outskirts."],
          ["Task 1 — không dùng lời tường thuật", "~~The chart claims / argues / proves that…~~", "The chart **shows / illustrates / compares**… (biểu đồ không có ý kiến)"],
          ["Speaking Part 3", "People say it's bad. I think so too.", "**It's often said that** social media is harmful, and **I'd go along with that to some extent**, but…"],
          ["Reading Passage 3", "đọc claim như say", "thấy **claims / alleges** ⇒ tác giả có thể sẽ bác ở câu sau; thấy **has shown / demonstrates** ⇒ tác giả tin"],
        ],
      },
      { t: "note", title: "Mẹo: đúng liều", items: ["Một bài Task 2 cần khoảng **2–3 câu tường thuật** (mở bài + mỗi thân bài một câu nêu quan điểm đối lập). Câu nào cũng “It is argued that” thì bài mất tiếng nói của chính bạn — TR band 7 đòi **ý kiến của bạn rõ suốt bài**.", "Sau câu tường thuật, câu kế tiếp phải là **lập trường của bạn**: This view is persuasive because… / However, this argument overlooks…"] },

      { t: "h", text: "10. Luyện tổng hợp" },
      {
        t: "mcq", id: "t4d17-np-chon", title: "Chọn đáp án đúng (10 câu)",
        items: [
          { q: "The Roman road ______ around 120 AD.", options: ["is thought to have been built", "is thought that it was built", "is thought to build", "thinks to have been built"], correct: 0, why: "Chủ ngữ thật + is thought + to have been V3 (việc quá khứ, bị động). Sau chủ ngữ thật không dùng that." },
          { q: "The new software ______ small firms to process orders in half the time.", options: ["lets", "makes", "enables", "has"], correct: 2, why: "Sau chỗ trống là O + to V ⇒ enables. Lets / makes / has + O + V trần." },
          { q: "______ the latest census, one in five residents was born abroad.", options: ["As", "According", "In the view", "According to"], correct: 3, why: "According to + nguồn, + mệnh đề. “As” cần thêm S + V (As the census shows)." },
          { q: "In the experiment, volunteers ______ in a brightly lit room for six hours.", options: ["were made sit", "were made to sit", "made to sit", "were let sit"], correct: 1, why: "Bị động của make: be made TO V. Let không có bị động." },
          { q: "Several authors have ______ whether economic growth can continue indefinitely.", options: ["questioned", "claimed", "argued", "maintained"], correct: 0, why: "Chỉ question (và doubt / ask) đi với whether; claim / argue / maintain + that." },
          { q: "The report ______ the fall in bee numbers ______ the use of certain pesticides.", options: ["blames … for", "accuses … of", "attributes … to", "describes … as"], correct: 2, why: "attribute + kết quả + to + nguyên nhân. blame + nguyên nhân + for + kết quả (blames pesticides for the fall)." },
          { q: "It ______ that more than half of the world's population now lives in cities.", options: ["estimates", "is estimating", "has estimated", "is estimated"], correct: 3, why: "It + is + V3 + that: bị động vô nhân xưng." },
          { q: "The committee recommended that the trial ______ for a further year.", options: ["extends", "be extended", "to extend", "extending"], correct: 1, why: "recommend that + S + (should) + V nguyên mẫu; ở đây bị động ⇒ (should) be extended." },
          { q: "Which sentence is correct?", options: ["The article discusses about the causes of migration.", "The article mentions about the causes of migration.", "The article discusses the causes of migration.", "The article explains us the causes of migration."], correct: 2, why: "discuss / mention + N, không about; explain sth TO sb." },
          { q: "A high tuition fee may ______ applying to university.", options: ["discourage poorer students from", "discourage poorer students to", "prevent poorer students to", "stop poorer students for"], correct: 0, why: "discourage / prevent / stop + O + from + V-ing." },
        ],
      },
      {
        t: "quiz", id: "t4d17-np-dien", kind: "fill", title: "Viết lại câu — điền MỘT đến BA từ (8 câu)",
        items: [
          { q: "People say that the island was once joined to the mainland. → The island is said ___ ___ ___ once joined to the mainland.", answers: ["to have been"] },
          { q: "People believe that the company is losing money. → The company is believed ___ ___ ___ money.", answers: ["to be losing"] },
          { q: "“The data are unreliable,” the reviewers said. → The reviewers described the data ___ unreliable.", answers: ["as"] },
          { q: "They made the workers sign a new contract. → The workers were made ___ ___ a new contract.", answers: ["to sign"] },
          { q: "The school doesn't let pupils use phones in class. → Pupils are not ___ ___ use phones in class.", answers: ["allowed to", "permitted to"] },
          { q: "Because of the storm, the airline cancelled forty flights. → The storm forced the airline ___ ___ forty flights.", answers: ["to cancel"] },
          { q: "Some people claim that money buys happiness. This is misleading. → The ___ ___ money buys happiness is misleading.", answers: ["claim that"] },
          { q: "A mechanic services my car every year. → I have my car ___ every year.", answers: ["serviced"], hint: "have + O + V3" },
        ],
      },
    ],
  },
  {
    id: "t4d17-doc",
    kind: "reading",
    title: "Đọc: Flow-chart + Diagram label completion ở Passage 3 kỹ thuật",
    goal: "Làm đúng Flow-chart completion và Diagram label completion trên một bài Passage 3 mô tả máy móc hơn 900 từ: không hoảng trước thuật ngữ lạ (vì bài tự định nghĩa), lần theo từng bước bằng động từ chuyển động, và chép đúng MỘT từ khi sơ đồ đã đổi từ loại và đổi cả trật tự câu.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **Reading Passage 3** — mục tiêu ≥ 9/13. Hai dạng hôm nay là hai dạng “ăn điểm” nhất của Passage 3 **nếu** bạn không sợ thuật ngữ.",
          "Bài kỹ thuật ở Passage 3 **tự định nghĩa** mọi thuật ngữ: “X, **known as** Y”, “Y, **a** … **which**…”, dấu gạch ngang, ngoặc đơn. Bạn không cần biết trước từ nào.",
          "**Flow-chart** đi theo **thời gian** (thường đúng thứ tự bài); **Diagram** đi theo **không gian** (thứ tự nhãn trên hình có thể không theo bài).",
          "Sơ đồ ở band 7 **đổi từ loại và đổi chủ ngữ**: bài viết “a bell rang to tell the operator”, sơ đồ viết “operator is warned by a ______”.",
          "Luôn kiểm ba thứ trước khi chép: **giới hạn từ**, **số ít / số nhiều** đúng như bài, **loại từ** hợp chỗ trống.",
        ],
      },

      { t: "h", text: "1. Ôn 2 phút và điều gì mới ở Passage 3 (nối Tập 1 Ngày 6 · Tập 2 Ngày 22 · 24 · Tập 3 Ngày 17)" },
      { t: "p", text: "Tập 3 Ngày 17 bạn đã làm hai dạng này trên một bài về nhà máy lọc nước biển với **quy trình 6 bước**: đọc đề → đọc sơ đồ, đoán loại từ → tìm vùng bài → dò từng bước → chép nguyên từ → soát. Quy trình đó vẫn đúng. Passage 3 chỉ thêm bốn cái khó dưới đây." },
      {
        t: "table",
        head: ["", "Tập 3 (Passage 1–2)", "Tập 4 (Passage 3)"],
        rows: [
          ["Thuật ngữ", "từ kỹ thuật quen (filter, pump, pipe)", "từ **chưa ai biết** (matrix, spaceband) — bài định nghĩa ngay tại chỗ"],
          ["Paraphrase", "đổi từ đồng nghĩa", "đổi **từ loại + chủ ngữ + chủ động ↔ bị động**; gộp hai câu của bài thành một ô"],
          ["Vùng chứa đáp án", "một đoạn", "trải **2–3 đoạn**, xen thông tin lịch sử và bình luận không thuộc quy trình"],
          ["Nhiễu", "một từ cùng loại ở gần", "**nhiều** danh từ kỹ thuật cùng loại trong cùng câu (a lever, a bell, a belt…)"],
          ["Câu đi kèm", "TFNG dễ", "MCQ hỏi **mục đích / suy luận** của tác giả"],
        ],
      },

      { t: "h", text: "2. Thuật ngữ lạ — năm tín hiệu “bài đang định nghĩa cho bạn”" },
      { t: "p", text: "Người viết học thuật biết người đọc không phải kỹ sư. Mỗi khi đưa ra một bộ phận mới, họ giải thích nó **ngay trong câu đó**. Việc của bạn là nhận ra tín hiệu, rồi coi thuật ngữ như một **cái tên** — không cần dịch." },
      {
        t: "table",
        head: ["Tín hiệu", "Ví dụ", "Bạn hiểu"],
        rows: [
          ["**known as / called / referred to as**", "The moulds, **known as** matrices, were thin pieces of brass.", "matrices = các cái khuôn"],
          ["**dấu phẩy + a / an …** (đồng vị ngữ)", "…the assembler**, a** small holder at eye level…", "assembler = cái giá nhỏ ngang tầm mắt"],
          ["**dấu gạch ngang / ngoặc đơn**", "a pot of molten alloy **—** chiefly lead **—** …", "alloy = hợp kim, chủ yếu là chì"],
          ["**or** + tên khác", "the ‘slug’**, or** ‘line of type’", "slug = một dòng chữ đúc liền"],
          ["**which / that + động từ chức năng**", "a spaceband, a steel device **which** could grow thicker", "spaceband = thứ nới rộng khoảng cách"],
        ],
      },
      { t: "note", title: "Mẹo: đặt tên Việt tạm trong đầu", items: ["Đọc tới “matrix” thì nghĩ “cái khuôn chữ”, “spaceband” thì nghĩ “miếng chêm”. Bạn chỉ cần biết **nó làm gì** và **nó ở đâu** — đúng hai thứ sơ đồ hỏi.", "Từ in nghiêng hoặc trong ngoặc kép ở bài thường **xuất hiện sẵn trong sơ đồ** (không phải đáp án). Dùng chúng làm **mốc định vị**."] },

      { t: "h", text: "3. Flow-chart theo thời gian · Diagram theo không gian — hai bộ từ khoá để dò" },
      {
        t: "sodo", kind: "compare", title: "Dò bằng từ khoá nào?",
        cols: [
          { title: "Flow-chart — dò **trình tự**", items: ["**Từ thời gian**: first, then, next, once, as soon as, at that moment, finally, before, until", "**Động từ chuyển động**: is released, drops, slides, is carried, is delivered, is forced into, is pushed out", "**Phân từ** nén hai bước: **Having been trimmed, the bar is…** (ôn Ngày 5)", "Một ô = một bước; đáp án thường là **vật thực hiện** hoặc **vật bị tác động**"] },
          { title: "Diagram — dò **vị trí**", items: ["**Giới từ vị trí**: at the top of, above, behind, beneath, beside, at eye level, to the left of", "**Hình dáng**: flat, sloping, a slot, a bar, a pair of", "**Số lượng / chất liệu**: ninety keys, brass, steel", "Nhãn = **tên bộ phận**, **chất liệu**, **con số** hoặc **đặc điểm** của nó"] },
        ],
      },

      { t: "h", text: "4. Bốn bẫy band 7 và cách tránh" },
      {
        t: "table",
        head: ["Bẫy", "Trông thế nào", "Cách tránh"],
        rows: [
          ["**Đổi từ loại**", "Bài: “widening every gap until the line was precisely the required **width**” · Sơ đồ: “line adjusted to the correct ______”", "Chỗ trống sau **the correct** ⇒ cần danh từ ⇒ **width**, không phải widening / wide"],
          ["**Chủ động ↔ bị động**", "Bài: “a bell **rang to tell** the operator” · Sơ đồ: “operator **is warned by** a ______”", "Tìm **ai làm – ai nhận**, đừng tìm từ giống hệt"],
          ["**Danh từ nhiễu cùng câu**", "“He then raised a **lever**” đứng ngay sau “a **bell** rang”", "Đọc lại **động từ trong sơ đồ** (warns / is raised) rồi mới chọn danh từ"],
          ["**Số ít / số nhiều · giới hạn từ**", "Bài: “a pair of **knives**” · thí sinh chép “knife” hoặc “a pair of knives”", "Chép **đúng dạng trong bài**; đếm từ: ONE WORD ONLY nghĩa là một"],
        ],
      },
      { t: "rule", formula: "Đọc động từ trong sơ đồ → tìm cùng HÀNH ĐỘNG trong bài → chép danh từ đúng dạng, đúng số từ", vi: "Ở Passage 3, khớp theo hành động và chức năng, không khớp theo từ giống nhau." },

      { t: "h", text: "5. Khởi động — một đoạn 120 từ, 3 câu (3 phút)" },
      {
        t: "passage", title: "How a Canal Lock Lifts a Boat",
        paras: [
          { text: "A canal lock allows a boat to climb a hill. It consists of a chamber with a pair of heavy gates at each end. A boat travelling uphill enters the chamber through the lower gates, which are then closed behind it. The crew next open the sluices — small sliding panels set into the upper gates — so that water from the higher section of the canal pours in. As the chamber fills, the boat rises with it. Only when the water inside has reached the same level as the water above can the upper gates be swung open, since until then the pressure against them is too great to overcome. The boat then moves out, and the lock is ready for a vessel coming downhill." },
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Complete the flow-chart. Write ONE WORD ONLY from the text.",
        steps: [
          { label: "Boat goes into the chamber", sub: "the lower **1 ______** are shut after it" },
          { label: "Water is let in from the upper canal", sub: "by opening panels known as **2 ______**" },
          { label: "Boat floats upwards as the chamber fills" },
          { label: "Levels become equal", sub: "upper gates can now be opened — earlier, water **3 ______** made this impossible" },
        ],
      },
      {
        t: "quiz", id: "t4d17-doc-khoi-dong", kind: "fill", title: "Questions 1–3 — ONE WORD ONLY",
        items: [
          { q: "(1) the lower ______ are shut after it", answers: ["gates"], hint: "“which are then closed behind it” — which thay cho danh từ nào?" },
          { q: "(2) panels known as ______", answers: ["sluices"], hint: "thuật ngữ được định nghĩa bằng dấu gạch ngang" },
          { q: "(3) water ______ made this impossible", answers: ["pressure"], hint: "“too great to overcome” = made this impossible" },
        ],
      },
      { t: "note", title: "Ghi nhớ từ bài khởi động", items: ["Câu 1: bài dùng **which** (lower gates, **which** are then closed) — sơ đồ đổi closed → **shut**.", "Câu 2: bạn không cần biết “sluice” là gì; dấu gạch ngang đã định nghĩa: **small sliding panels**. Sơ đồ đổi thành **panels known as**.", "Câu 3: bài nói “the pressure against them is too great to overcome”; sơ đồ đổi thành danh từ ghép **water pressure** + “made this impossible”."] },

      { t: "h", text: "6. Luyện trọn bài — Questions 1–13 (20 phút)" },
      { t: "p", text: "Bấm giờ **20 phút**. Đọc lướt cả bài 2 phút để biết đoạn nào kể lịch sử (A, B, F) và đoạn nào tả máy (C, D, E). Sau đó đọc sơ đồ trước, bài sau. Không tra từ: mọi thuật ngữ đều được bài giải thích." },
      {
        t: "passage", title: "The Machine That Set the News",
        intro: "Reading Passage 3 — tự soạn cho bài luyện.",
        paras: [
          { label: "A", text: "For four centuries after Gutenberg, the making of a printed page began in the same way. A compositor stood before a wooden case divided into small compartments, picked out individual metal letters one at a time and arranged them, upside down and back to front, in a hand-held tray. A skilled worker could set perhaps 1,500 characters an hour, and when the page had been printed every letter had to be sorted back into its compartment by hand, a task that took almost as long again. Presses, meanwhile, had become enormously faster: by the 1860s the fastest steam-driven machines could turn out more than ten thousand sheets an hour. The industry was thus in the curious position of being able to print far more than it could compose. Daily newspapers rarely ran to more than eight pages, and books remained expensive, not because paper or ink was scarce but because type could not be set fast enough." },
          { label: "B", text: "Inventors had long been aware of this bottleneck, and dozens of typesetting machines were patented in the middle of the nineteenth century. Most attempted to imitate the human compositor, storing ready-made letters in channels and releasing them at the touch of a key. They generally failed for the same reason: the letters still had to be returned to their channels after use, and no mechanism could be made to do this reliably. The writer Mark Twain is said to have lost most of his fortune backing one such machine, which contained some 18,000 parts and seldom ran for long without breaking down. The solution, when it came, lay in abandoning the idea of setting type at all. Ottmar Mergenthaler, a German-born watchmaker who had emigrated to the United States in 1872, realised that a machine did not need to handle finished letters; it could handle moulds of letters instead, and manufacture fresh type for every line." },
          { label: "C", text: "The machine that resulted, first installed at the New York Tribune in 1886, bore little resemblance to anything a printer had seen. The operator sat at a keyboard of ninety keys, arranged not alphabetically but according to how often each letter occurs in English, so that the most frequently used lay within easy reach of the left hand. The moulds themselves, known as matrices, were thin pieces of brass with a letter stamped into one edge, and several hundred of them were stored in the magazine, a flat container which sloped down towards the operator from the top of the machine. Pressing a key released one matrix, which slid out under its own weight, landed on a moving belt and was delivered to the assembler, a small holder at eye level where the line took shape. Between words the operator added not a matrix but a spaceband, a steel device formed of two wedges which could slide against each other, growing thicker as they did so." },
          { label: "D", text: "As the line approached its full length, a bell rang to tell the operator that no further word would fit. He then raised a lever, and from that moment the machine worked unaided. The assembled line was carried across to face a mould, a slot the exact size of a line of type. To avoid the ragged right-hand edge that unequal lines would produce, the spacebands were now driven upwards from below, widening every gap by the same amount until the line was precisely the required width. Behind the mould sat a pot of molten alloy — chiefly lead, with tin and antimony added to harden it — which a gas flame kept at around 280 degrees Celsius. A plunger forced a measured quantity of this metal into the mould and against the row of matrices, where it solidified almost at once into a single bar carrying a whole line of raised letters: the ‘slug’, or ‘line of type’, from which the Linotype took its name. Finally, a pair of knives trimmed the slug to a standard size before it was pushed out, still warm, onto a tray beside the lines cast earlier." },
          { label: "E", text: "What distinguished Mergenthaler's design from its failed predecessors was the fate of the matrices after casting. A long arm swung down, lifted the line to the top of the machine and passed the matrices onto a bar that ran above the magazine. Each matrix had a pattern of notches cut into its upper end, and the pattern was different for every character. As a matrix travelled along the bar, it remained hanging until it reached the one point at which the bar no longer matched its pattern; there it fell, directly into the channel from which it had come. The spacebands, which carried no such pattern, were removed beforehand and returned to a box of their own. The problem that had defeated half a century of inventors had been solved by a principle borrowed from the lock and key." },
          { label: "F", text: "The consequences were swift. A single operator could now do the work of five or six hand compositors, and within a decade many newspapers had doubled in length while falling in price. Compositors understandably regarded the machine as a threat, and there were confident predictions that their trade would be destroyed. Events took a different course. Cheaper printing created so much additional demand for books, magazines and advertising that the number of people employed in the industry actually rose, and the unions ensured that the new keyboards were staffed by retrained compositors rather than by cheaper newcomers. ‘Hot metal’, as the process came to be called, dominated publishing for the best part of a century, until it was displaced in the 1960s and 1970s by photographic and then computerised methods. Its legacy survives, however, in the vocabulary of every word processor: the instruction to ‘justify’ a paragraph describes exactly what a row of steel wedges once did." },
        ],
      },
      { t: "p", text: "**Questions 1–6.** Complete the flow-chart below. Choose **ONE WORD ONLY** from the passage for each answer." },
      {
        t: "sodo", kind: "flow", title: "Producing one line of type",
        caption: "Sơ đồ đi theo thứ tự thời gian — đáp án nằm ở đoạn C và D.",
        steps: [
          { label: "Operator presses a key; one matrix leaves its store", sub: "it falls onto a **1 ______** , which takes it to the assembler" },
          { label: "Operator separates the words with spacebands", sub: "each consists of a pair of **2 ______**" },
          { label: "Line is almost complete", sub: "operator is warned by a **3 ______** and starts the automatic cycle" },
          { label: "Line is positioned in front of the mould", sub: "spacebands are pushed up so that the line reaches the correct **4 ______**" },
          { label: "Hot metal is driven into the mould", sub: "by means of a **5 ______** ; it hardens immediately to form a slug" },
          { label: "Slug is cut to size", sub: "by two **6 ______** , then ejected onto a tray" },
        ],
      },
      {
        t: "quiz", id: "t4d17-doc-flow", kind: "fill", title: "Questions 1–6 — Flow-chart (ONE WORD ONLY)",
        items: [
          { q: "(1) it falls onto a ______, which takes it to the assembler", answers: ["belt"], hint: "đoạn C — “landed on a moving …”" },
          { q: "(2) each spaceband consists of a pair of ______", answers: ["wedges"], hint: "đoạn C, câu cuối — “formed of two …”" },
          { q: "(3) operator is warned by a ______", answers: ["bell"], hint: "đoạn D, câu 1 — cái gì “tell the operator”? (lever là thứ ông ấy kéo, không phải thứ báo)" },
          { q: "(4) the line reaches the correct ______", answers: ["width"], hint: "đoạn D — “precisely the required …”" },
          { q: "(5) hot metal is driven into the mould by means of a ______", answers: ["plunger"], hint: "đoạn D — “… forced a measured quantity of this metal”" },
          { q: "(6) slug is cut to size by two ______", answers: ["knives"], hint: "đoạn D, câu cuối — “a pair of … trimmed”" },
        ],
      },
      { t: "p", text: "**Questions 7–10.** Label the diagram below. Choose **ONE WORD AND/OR A NUMBER** from the passage for each answer. (Hình vẽ máy nhìn từ phía người vận hành; mỗi nhánh là một bộ phận, ghi kèm vị trí trên hình.)" },
      {
        t: "sodo", kind: "mindmap", title: "The Linotype machine — main parts",
        center: "**Linotype** (1886)",
        branches: [
          { label: "Front, at hand height: keyboard", items: ["**7 ______** keys", "letters ordered by frequency"] },
          { label: "Top, sloping towards operator", items: ["the **8 ______**", "holds several hundred brass matrices"] },
          { label: "Behind the mould: pot of alloy", items: ["kept molten by a **9 ______** flame", "about 280 °C"] },
          { label: "Bar above the store (distribution)", items: ["each matrix recognised by its **10 ______**", "drops into its own channel"] },
        ],
      },
      {
        t: "quiz", id: "t4d17-doc-diagram", kind: "fill", title: "Questions 7–10 — Diagram labels (ONE WORD AND/OR A NUMBER)",
        items: [
          { q: "(7) ______ keys", answers: ["90", "ninety"], hint: "đoạn C — “a keyboard of …”" },
          { q: "(8) the ______ — sloping store for the matrices", answers: ["magazine"], hint: "đoạn C — “a flat container which sloped down”" },
          { q: "(9) kept molten by a ______ flame", answers: ["gas"], hint: "đoạn D — “which a … flame kept at around 280 degrees”" },
          { q: "(10) each matrix recognised by its ______", answers: ["notches"], hint: "đoạn E — “a pattern of … cut into its upper end”" },
        ],
      },
      { t: "p", text: "**Questions 11–13.** Choose the correct letter, **A, B, C or D**." },
      {
        t: "mcq", id: "t4d17-doc-mcq", title: "Questions 11–13 — Multiple choice",
        items: [
          { q: "11. According to the writer, most typesetting machines invented before Mergenthaler's were unsuccessful because", options: ["they were too expensive for newspapers to buy.", "they could not put used letters back where they belonged.", "they required more operators than hand composition did.", "they were slower than a skilled compositor."], correct: 1, why: "Đoạn B: “the letters still had to be returned to their channels after use, and no mechanism could be made to do this reliably”. Giá, số người, tốc độ đều không được nêu là lý do (18,000 parts là chi tiết về một máy, không phải “too expensive for newspapers”)." },
          { q: "12. The writer refers to Mark Twain in order to", options: ["show that famous authors welcomed mechanical typesetting.", "explain where Mergenthaler obtained his funding.", "suggest that Twain understood machinery better than printers did.", "illustrate how costly and unreliable the earlier approach proved."], correct: 3, why: "Twain “lost most of his fortune” vì một máy “18,000 parts… seldom ran for long” ⇒ ví dụ cho sự tốn kém, hay hỏng của hướng đi cũ. Không có chỗ nào nói Twain tài trợ Mergenthaler." },
          { q: "13. What point does the writer make about employment in paragraph F?", options: ["Fears that compositors would lose their livelihood proved unfounded.", "The unions failed to protect their members from cheaper workers.", "Fewer people worked in printing once the machine was adopted.", "Compositors were the first to see the benefits of the machine."], correct: 0, why: "“confident predictions that their trade would be destroyed. Events took a different course… the number of people employed… actually rose” ⇒ nỗi sợ không thành sự thật. B và C ngược với bài; D ngược (họ coi máy là mối đe doạ)." },
        ],
      },

      { t: "h", text: "7. Phân tích sau khi làm — câu nào chứa đáp án, paraphrase kiểu gì" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Câu trong bài", "Sơ đồ đã đổi gì"],
        rows: [
          ["1", "belt", "C: landed on a moving **belt** and was delivered to the assembler", "landed on → falls onto · was delivered to → takes it to (bị động → chủ động)"],
          ["2", "wedges", "C: a steel device formed of two **wedges**", "formed of two → consists of a pair of"],
          ["3", "bell", "D: a **bell** rang to tell the operator that no further word would fit", "rang to tell → is warned by (chủ động → bị động) · bẫy: lever"],
          ["4", "width", "D: until the line was precisely the required **width**", "precisely the required → the correct · driven upwards → pushed up"],
          ["5", "plunger", "D: A **plunger** forced a measured quantity of this metal into the mould", "forced → is driven… by means of · solidified almost at once → hardens immediately · bẫy: flame, pot"],
          ["6", "knives", "D: a pair of **knives** trimmed the slug to a standard size", "a pair of → two · trimmed to a standard size → cut to size · pushed out → ejected"],
          ["7", "90 / ninety", "C: a keyboard of **ninety** keys", "bẫy số: 18,000 (đoạn B), 1,500 (đoạn A)"],
          ["8", "magazine", "C: stored in the **magazine**, a flat container which sloped down… from the top", "vị trí “top, sloping” khớp “sloped down… from the top” · bẫy: assembler (ở eye level)"],
          ["9", "gas", "D: which a **gas** flame kept at around 280 degrees", "kept at 280 degrees → kept molten"],
          ["10", "notches", "E: a pattern of **notches** cut into its upper end… different for every character", "different for every character → each matrix recognised by · bẫy: pattern (đã hàm ý trong câu hỏi), channel"],
        ],
      },
      { t: "p", text: "**Tự chấm:** 11–13 đúng = đạt mức band 7 cho dạng này; 9–10 = gần; dưới 9 ⇒ xem lại cột “Sơ đồ đã đổi gì” của từng câu sai và hỏi: mình sai vì **không tìm được vùng**, vì **chọn danh từ nhiễu**, hay vì **chép sai dạng**? Ghi loại lỗi vào sổ lỗi (Ngày 2)." },

      { t: "h", text: "8. Từ vựng hữu ích từ bài đọc (10 từ)" },
      {
        t: "vocab",
        items: [
          { w: "bottleneck", pos: "n", ipa: "/ˈbɒtlnek/", vi: "nút thắt cổ chai, chỗ gây tắc", ex: "A shortage of trained staff is the main bottleneck in the health service.", exVi: "Thiếu nhân viên được đào tạo là nút thắt chính của ngành y tế.", more: "**create / ease / remove a bottleneck** · dùng tốt trong Task 2 về giao thông, hạ tầng." },
          { w: "patent", pos: "v / n", ipa: "/ˈpætnt/", vi: "đăng ký bằng sáng chế; bằng sáng chế", ex: "The design was patented in 1884.", exVi: "Thiết kế được cấp bằng sáng chế năm 1884.", more: "**take out / hold a patent on** sth · Anh-Anh cũng đọc /ˈpeɪtnt/." },
          { w: "reliably", pos: "adv", ipa: "/rɪˈlaɪəbli/", vi: "một cách đáng tin cậy, ổn định", ex: "The system cannot yet reliably distinguish between the two.", exVi: "Hệ thống chưa phân biệt được hai thứ một cách ổn định.", more: "họ từ: **rely (on) · reliable · reliability · unreliable**." },
          { w: "abandon", pos: "v", ipa: "/əˈbændən/", vi: "từ bỏ", ex: "The government abandoned the plan after public protests.", exVi: "Chính phủ bỏ kế hoạch sau các cuộc phản đối.", more: "**abandon an idea / a plan / an attempt** · trang trọng hơn give up." },
          { w: "resemblance", pos: "n", ipa: "/rɪˈzembləns/", vi: "sự giống nhau", ex: "Modern offices bear little resemblance to those of the 1970s.", exVi: "Văn phòng hiện đại chẳng mấy giống văn phòng thập niên 1970.", more: "**bear a (close / little / no) resemblance to** · động từ: **resemble** (không giới từ)." },
          { w: "molten", pos: "adj", ipa: "/ˈməʊltən/", vi: "nóng chảy (kim loại, đá, thuỷ tinh)", ex: "Molten glass is poured into the mould.", exVi: "Thuỷ tinh nóng chảy được rót vào khuôn.", more: "chỉ dùng cho chất nóng chảy ở nhiệt độ rất cao; bơ, kem dùng **melted**." },
          { w: "solidify", pos: "v", ipa: "/səˈlɪdɪfaɪ/", vi: "đông cứng lại", ex: "The liquid solidifies as it cools.", exVi: "Chất lỏng đông cứng khi nguội đi.", more: "trái nghĩa: **melt · liquefy** · họ từ: **solid · solidity**." },
          { w: "predecessor", pos: "n", ipa: "/ˈpriːdəsesə/", vi: "cái / người đi trước", ex: "The new model is lighter than its predecessor.", exVi: "Mẫu mới nhẹ hơn mẫu trước nó.", more: "trái nghĩa: **successor** · dùng cho cả người (my predecessor in the job) và vật." },
          { w: "displace", pos: "v", ipa: "/dɪsˈpleɪs/", vi: "thay thế, chiếm chỗ; buộc rời đi", ex: "Streaming has largely displaced physical media.", exVi: "Phát trực tuyến đã gần như thay thế phương tiện vật lý.", more: "**displaced people** = người phải rời bỏ nơi ở (Ngày 16) · khác **replace**: displace nhấn việc đẩy cái cũ ra." },
          { w: "legacy", pos: "n", ipa: "/ˈleɡəsi/", vi: "di sản, cái để lại", ex: "The Games left a lasting legacy of sports facilities.", exVi: "Thế vận hội để lại di sản lâu dài là các cơ sở thể thao.", more: "**leave a legacy · a lasting / cultural / colonial legacy**." },
        ],
      },
    ],
  },
  {
    id: "t4d17-nghe",
    kind: "listening",
    title: "Nghe: đề nhỏ Part 3 + Part 4 — 20 câu, nghe một lần",
    goal: "Làm liền một mạch nửa sau của đề Listening (câu 21–40) ở tốc độ khoảng 165 từ / phút: Part 3 ba người nói có đổi ý (MCQ + Flow-chart), Part 4 bài giảng không quãng nghỉ (Note completion), đạt ≥ 14/20 — mốc band 7 của Tập 4; và đặt đúng trọng âm các từ học thuật 4–5 âm tiết.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đo **Listening Part 3 + Part 4** — hai phần quyết định band 7 (mục tiêu cuối tập: **≥ 14/20**).",
          "Nghe **một lần**, không tua. Trước mỗi phần có 30–40 giây đọc câu hỏi: gạch từ khoá, đoán loại từ.",
          "Part 3: nghe **người chốt cuối cùng** — ý nêu trước thường bị bác (“I'd said half, but…”).",
          "Part 4: bám **tiêu đề phụ của bảng ghi** để biết giảng viên đang ở đâu; lỡ một câu thì **bỏ**, nhảy sang câu sau.",
          "🔊 Từ 4–5 âm tiết: trọng âm rơi **ngay trước** -tion, -ity, -ic(al); và ở **âm thứ ba từ cuối** với -ate, -graphy, -logy.",
        ],
      },

      { t: "h", text: "1. Luật của đề nhỏ và cách phân sức" },
      {
        t: "table",
        head: ["Phần", "Câu", "Dạng", "Mốc band 7", "Mất điểm ở đâu"],
        rows: [
          ["Part 3 — hai sinh viên và giảng viên bàn kế hoạch đánh giá", "21–25", "Multiple choice (A–C)", "≥ 4/5", "phương án được **nhắc tới rồi bị loại**"],
          ["", "26–30", "Flow-chart — ONE WORD ONLY", "≥ 4/5", "hai danh từ cùng loại, người thứ hai sửa lại"],
          ["Part 4 — bài giảng về thang máy và nhà cao tầng", "31–40", "Note completion — ONE WORD ONLY", "≥ 7/10", "mất dấu sau một câu lỡ; chính tả; số ít / số nhiều"],
        ],
      },
      { t: "note", title: "Mẹo: ba việc làm trong 30 giây đọc đề", items: ["**MCQ**: chỉ đọc **thân câu hỏi**, gạch một từ khoá (report · exam results · questionnaire · how many · risk). Phương án đọc lướt — chúng sẽ bị paraphrase.", "**Flow-chart / Note**: ghi bên lề loại từ cần điền (n số ít? số nhiều? tính từ?). Từ đứng **ngay trước và sau** chỗ trống là mốc để nghe.", "Nối Ngày 12 (Flow-chart Part 3 + bẫy đổi ý) và Ngày 8 · 13 (bảng ghi Part 4)."] },

      { t: "h", text: "2. Part 3 — Questions 21–30" },
      { t: "p", text: "Bạn sẽ nghe **Priya** (giọng Úc), **Daniel** (giọng Canada) và giảng viên **Dr Walsh** (giọng Ireland) bàn về kế hoạch đánh giá một chương trình **peer mentoring** (sinh viên khoá trên kèm sinh viên năm nhất). Đọc sơ đồ câu 26–30 dưới đây trước, rồi bấm nghe. Câu 21–25 nằm ngay dưới bản ghi." },
      {
        t: "sodo", kind: "flow", title: "Questions 26–30 — Evaluation plan. Write ONE WORD ONLY for each answer.",
        steps: [
          { label: "Send application form to the ethics **26 ______**", sub: "by the end of this month" },
          { label: "Carry out a **27 ______** with ten second-year students", sub: "to check the wording of the questions" },
          { label: "Give out the questionnaire in **28 ______**", sub: "students scan a code and answer on their phones" },
          { label: "Arrange about six short **29 ______**", sub: "with students who are willing to say more" },
          { label: "Display results on a **30 ______** at the faculty teaching day", sub: "written report follows in May" },
        ],
      },
      {
        t: "listen", id: "t4d17-nghe-p3", title: "Part 3 — Evaluating a peer-mentoring scheme",
        dan: { so: "Day 17, Mini test, Part 3", boiCanh: "two students, Priya and Daniel, talking to their tutor about their plan to evaluate a peer-mentoring scheme.", cau: [21, 30] },
        note: "Khoảng 3 phút rưỡi, ~165 từ/phút. Ba giọng: Úc (nữ) · Canada (nam) · Ireland (nữ). Nghe một lần.",
        lines: [
          { who: "Dr Walsh", voice: "ie-nu", text: "So, Priya, Daniel, you wanted to talk through your plan for evaluating the peer-mentoring scheme. Where have you got to?", vi: "Nào, Priya, Daniel, hai em muốn bàn kế hoạch đánh giá chương trình sinh viên kèm sinh viên. Các em làm tới đâu rồi?" },
          { who: "Priya", voice: "au-nu", text: "Well, we started with the faculty's own report on the scheme. To be honest, I was expecting a bit of a sales pitch, but it's actually quite balanced, and the figures are from last year, so they're recent enough. What struck me, though, is that every one of those figures comes from the mentors. Nobody seems to have asked the first-years who were being mentored.", vi: "Dạ, bọn em bắt đầu bằng báo cáo của chính khoa về chương trình. Thật lòng em tưởng nó sẽ hơi kiểu quảng cáo, nhưng thật ra khá cân bằng, và số liệu là của năm ngoái nên đủ mới. Điều làm em chú ý là mọi con số đều lấy từ người đi kèm. Có vẻ chưa ai hỏi các bạn năm nhất được kèm." },
          { who: "Daniel", voice: "ca-nam", text: "Right, and that's the gap we want to fill. My first idea was to compare the exam results of students who had a mentor with those who didn't. But we've dropped that.", vi: "Đúng, và đó là khoảng trống bọn em muốn lấp. Ý đầu tiên của em là so điểm thi của sinh viên có người kèm với sinh viên không có. Nhưng bọn em bỏ ý đó rồi." },
          { who: "Priya", voice: "au-nu", text: "I assumed the problem would be getting hold of the marks.", vi: "Em cứ tưởng vấn đề là xin được điểm." },
          { who: "Dr Walsh", voice: "ie-nu", text: "No, the office would release them, provided the names were removed. So what was the objection?", vi: "Không, phòng đào tạo sẽ đưa, miễn là xoá tên. Vậy các em ngại điều gì?" },
          { who: "Daniel", voice: "ca-nam", text: "It's that people choose whether to join. The ones who sign up are probably the keener students to begin with, so even if their marks were higher, we couldn't put that down to the mentoring.", vi: "Là vì sinh viên tự chọn có tham gia hay không. Những bạn đăng ký có lẽ vốn đã là sinh viên chăm hơn, nên dù điểm họ cao hơn, bọn em cũng không thể quy cho việc được kèm." },
          { who: "Dr Walsh", voice: "ie-nu", text: "Good. That's exactly the difficulty. So what will you measure instead?", vi: "Tốt. Đó đúng là cái khó. Vậy các em sẽ đo gì thay vào?" },
          { who: "Priya", voice: "au-nu", text: "How confident first-years feel about academic tasks: writing essays, referencing, speaking up in seminars. Daniel was keen to write our own questions, and I can see the appeal, because we could keep it short. But there's a questionnaire that's already been used at four other universities, and if we use that, we can set our results beside theirs. That's what decided it.", vi: "Mức tự tin của sinh viên năm nhất với các việc học thuật: viết tiểu luận, trích dẫn, phát biểu trong seminar. Daniel muốn tự viết câu hỏi, và em hiểu cái hay của việc đó, vì có thể làm ngắn. Nhưng có một bảng hỏi đã được dùng ở bốn trường khác, và nếu dùng nó, bọn em đặt được kết quả của mình cạnh của họ. Đó là điều quyết định." },
          { who: "Dr Walsh", voice: "ie-nu", text: "And how many responses are you hoping for?", vi: "Thế các em mong được bao nhiêu phiếu trả lời?" },
          { who: "Daniel", voice: "ca-nam", text: "There are two hundred and forty first-years in the faculty. Priya said we should aim for half.", vi: "Khoa có hai trăm bốn mươi sinh viên năm nhất. Priya nói nên nhắm một nửa." },
          { who: "Priya", voice: "au-nu", text: "I did, but I've looked into it since, and student surveys rarely get more than about a third. So eighty is what we're planning for. A hundred and twenty just isn't realistic.", vi: "Em có nói vậy, nhưng sau đó em tìm hiểu thêm, khảo sát sinh viên hiếm khi được quá khoảng một phần ba. Nên bọn em lập kế hoạch cho tám mươi phiếu. Một trăm hai mươi là không thực tế." },
          { who: "Dr Walsh", voice: "ie-nu", text: "Sensible. What do you see as the main risk?", vi: "Hợp lý. Theo các em rủi ro chính là gì?" },
          { who: "Priya", voice: "au-nu", text: "I was worried about time, but we've got until March, so that's fine.", vi: "Em từng lo về thời gian, nhưng bọn em có tới tháng Ba, nên ổn." },
          { who: "Daniel", voice: "ca-nam", text: "For me, it's that the students who had a poor experience simply won't bother to reply, and we'll end up with a much rosier picture than the real one.", vi: "Với em, rủi ro là những bạn có trải nghiệm tệ sẽ chẳng buồn trả lời, và bọn em sẽ có một bức tranh đẹp hơn thực tế nhiều." },
          { who: "Priya", voice: "au-nu", text: "Yes, thinking about it, that's the bigger danger. We can always reword a question that people misread, but we can't make people answer.", vi: "Vâng, nghĩ lại thì đó là nguy cơ lớn hơn. Câu hỏi bị hiểu sai thì lúc nào cũng viết lại được, nhưng không thể bắt người ta trả lời." },
          { who: "Dr Walsh", voice: "ie-nu", text: "Agreed. Now take me through the stages.", vi: "Đồng ý. Giờ kể cho tôi các giai đoạn." },
          { who: "Daniel", voice: "ca-nam", text: "First, the paperwork. The application form goes to the ethics committee, and it has to be with them by the end of this month. Once that's approved, we'll run a pilot. We've got ten second-years who've agreed to fill the questionnaire in and tell us if any of the wording is unclear.", vi: "Đầu tiên là giấy tờ. Đơn gửi lên hội đồng đạo đức, và phải tới tay họ trước cuối tháng này. Khi được duyệt, bọn em sẽ chạy thử. Có mười bạn năm hai đã đồng ý điền bảng hỏi và cho biết chỗ nào diễn đạt chưa rõ." },
          { who: "Dr Walsh", voice: "ie-nu", text: "And how will the real thing reach the first-years? By email?", vi: "Còn bản chính thức tới sinh viên năm nhất bằng cách nào? Qua email à?" },
          { who: "Priya", voice: "au-nu", text: "That was the plan, but emails from the faculty tend to go unread. The mentoring office suggested we go into lectures instead. We put a code on the screen, people scan it and answer on their phones there and then. It takes four minutes.", vi: "Kế hoạch ban đầu là vậy, nhưng email của khoa thường không ai đọc. Văn phòng chương trình gợi ý bọn em vào các buổi giảng. Bọn em chiếu một mã lên màn hình, mọi người quét và trả lời trên điện thoại ngay tại chỗ. Mất bốn phút." },
          { who: "Daniel", voice: "ca-nam", text: "After that, we'd like some detail behind the numbers. I'd suggested a discussion group, but getting eight people into one room at the same time is a nightmare. So it'll be interviews: about six, a quarter of an hour each, with people who tick the box saying they'd be willing to talk.", vi: "Sau đó, bọn em muốn có chi tiết đằng sau các con số. Em từng đề xuất một nhóm thảo luận, nhưng gom tám người vào một phòng cùng lúc là ác mộng. Nên sẽ là phỏng vấn: khoảng sáu cuộc, mỗi cuộc mười lăm phút, với những bạn đánh dấu ô sẵn lòng trao đổi." },
          { who: "Dr Walsh", voice: "ie-nu", text: "Fine. And remember that the written report isn't due until May, but before that, at the faculty teaching day in April, you're expected to show your results on a poster. There's no talk to give; you just stand beside it and answer questions.", vi: "Được. Và nhớ là báo cáo viết tới tháng Năm mới phải nộp, nhưng trước đó, ở ngày hội giảng dạy của khoa vào tháng Tư, các em phải trình bày kết quả trên một tấm poster. Không phải thuyết trình; chỉ đứng cạnh và trả lời câu hỏi." },
        ],
      },
      {
        t: "mcq", id: "t4d17-nghe-p3-mcq", title: "Questions 21–25 — Choose the correct letter, A, B or C",
        items: [
          { q: "21. What does Priya say about the faculty's report on the scheme?", options: ["It reads like an advertisement for the scheme.", "It draws on only one group of people.", "Its statistics are no longer up to date."], correct: 1, why: "“every one of those figures comes from the mentors. Nobody seems to have asked the first-years” ⇒ B. A là điều cô ấy **tưởng** (“I was expecting a bit of a sales pitch, but…”); C bị bác: “from last year, so they're recent enough”." },
          { q: "22. Daniel decided against comparing exam results because", options: ["the university would not provide the marks.", "too few students had been given a mentor.", "students who join the scheme may be different from those who do not."], correct: 2, why: "“people choose whether to join… probably the keener students to begin with” ⇒ C. A là điều Priya tưởng, giảng viên bác ngay (“the office would release them”). B không được nhắc." },
          { q: "23. The students will use an existing questionnaire because", options: ["their findings can be compared with those of other institutions.", "it takes less time to complete.", "their tutor advised them to."], correct: 0, why: "“we can set our results beside theirs. That's what decided it.” ⇒ A. “keep it short” là ưu điểm của bảng hỏi **tự viết** (bẫy B). Giảng viên không khuyên gì." },
          { q: "24. How many completed questionnaires are the students planning for?", options: ["240", "120", "80"], correct: 2, why: "240 = tổng số sinh viên năm nhất; “half” (120) là ý cũ của Priya, cô tự bác: “eighty is what we're planning for. A hundred and twenty just isn't realistic.”" },
          { q: "25. Priya and Daniel agree that the greatest risk to their study is that", options: ["students with negative views will not take part.", "there will not be enough time to finish.", "some questions will be misunderstood."], correct: 0, why: "Daniel: “students who had a poor experience simply won't bother to reply”; Priya: “that's the bigger danger”. B bị bác (“we've got until March”); C: “We can always reword a question”." },
        ],
      },
      {
        t: "quiz", id: "t4d17-nghe-p3-flow", kind: "fill", title: "Questions 26–30 — Flow-chart (ONE WORD ONLY)",
        items: [
          { q: "(26) Send application form to the ethics ______", answers: ["committee"] },
          { q: "(27) Carry out a ______ with ten second-year students", answers: ["pilot"] },
          { q: "(28) Give out the questionnaire in ______", answers: ["lectures"] },
          { q: "(29) Arrange about six short ______", answers: ["interviews"] },
          { q: "(30) Display results on a ______ at the faculty teaching day", answers: ["poster"] },
        ],
      },

      { t: "h", text: "3. Part 4 — Questions 31–40" },
      { t: "p", text: "Một bài giảng môn lịch sử kiến trúc, giọng Anh, không có quãng nghỉ giữa bài. Bạn có 40 giây đọc bảng ghi dưới đây. Điền **ONE WORD ONLY** cho mỗi chỗ trống." },
      {
        t: "table",
        caption: "Questions 31–40 — Complete the notes. Write ONE WORD ONLY for each answer.",
        head: ["The lift and the vertical city"],
        rows: [
          ["**Before the safety lift**"],
          ["• hoists had existed for centuries, but were trusted only with **31 ______**"],
          ["• few buildings rose above six storeys; the highest floors had the lowest **32 ______**"],
          ["**Otis's demonstration (New York, 1854)**"],
          ["• Otis stood on a raised platform and had the **33 ______** cut"],
          ["• his device used a **34 ______** which pushed two bars into toothed rails"],
          ["**Effects on buildings**"],
          ["• 1857: first passenger lift fitted in a five-storey **35 ______**"],
          ["• in very tall towers, a large share of each floor is lost to **36 ______**"],
          ["• upper floors became the most valuable; “penthouse” had once meant a kind of **37 ______**"],
          ["**The psychology of waiting**"],
          ["• 1950s complaints about slow lifts were reduced by fitting **38 ______** beside the doors"],
          ["**Lifts today**"],
          ["• destination control: passengers choose their floor on a **39 ______** in the lobby"],
          ["• the height a lift can travel is limited by the weight of its steel **40 ______**"],
        ],
      },
      {
        t: "listen", id: "t4d17-nghe-p4", title: "Part 4 — The lift and the vertical city",
        dan: { so: "Day 17, Mini test, Part 4", boiCanh: "part of a lecture on the history of architecture, about the passenger lift and its effect on cities.", cau: [31, 40] },
        note: "Gần 5 phút, ~165 từ/phút, giọng Anh (nam). Một người nói, không có quãng nghỉ.",
        lines: [
          { who: "Lecturer", voice: "uk-nam", text: "Good morning. If I asked you which invention made the modern city possible, I suspect most of you would say steel, or electricity, or perhaps the motor car. Today I want to make the case for something we use every day without a second thought: the passenger lift. I'll begin with the situation before it existed, then describe the famous demonstration that changed public opinion, and after that I'll look at what the lift did to buildings, and at one or two things it has taught us about human behaviour.", vi: "Chào cả lớp. Nếu tôi hỏi phát minh nào khiến thành phố hiện đại thành hiện thực, tôi đoán đa số sẽ nói thép, điện, hoặc có lẽ ô tô. Hôm nay tôi muốn biện hộ cho một thứ ta dùng hằng ngày mà chẳng buồn nghĩ: thang máy chở người. Tôi sẽ bắt đầu với tình hình trước khi có nó, rồi tả buổi trình diễn nổi tiếng đã đổi ý công chúng, sau đó xem thang máy đã làm gì với các toà nhà, và một hai điều nó dạy ta về hành vi con người." },
          { who: "Lecturer", voice: "uk-nam", text: "Now, machines for lifting things are extremely old. The Romans had them, and by the eighteen-forties steam-powered hoists were common in mines, mills and warehouses. The trouble was that the ropes broke, and when they did, the platform fell. Owners were prepared to take that risk with goods, but hardly anyone was willing to take it with people. And the result was a practical limit on the height of buildings. Very few rose above six storeys, simply because nobody would climb more stairs than that. It also meant that the cheapest rooms were at the top. In a Paris apartment block of the eighteen-forties, the wealthy family lived on the first floor, and the rents fell with every flight of stairs, until you reached the servants and the students under the roof.", vi: "Máy để nâng đồ thì có từ rất lâu. Người La Mã đã có, và tới thập niên 1840 tời chạy hơi nước đã phổ biến ở mỏ, xưởng và nhà kho. Rắc rối là dây đứt, và khi đứt thì sàn rơi. Chủ xưởng sẵn sàng chịu rủi ro đó với hàng hoá, nhưng hầu như không ai chịu với con người. Kết quả là một giới hạn thực tế cho chiều cao nhà. Rất ít toà cao quá sáu tầng, đơn giản vì không ai chịu leo nhiều thang hơn thế. Điều đó cũng có nghĩa phòng rẻ nhất nằm trên cùng. Ở một khu căn hộ Paris những năm 1840, gia đình giàu sống ở tầng một, và tiền thuê giảm theo từng đợt cầu thang, cho tới người hầu và sinh viên dưới mái." },
          { who: "Lecturer", voice: "uk-nam", text: "The man who changed this was not, strictly speaking, the inventor of the lift. Elisha Otis was a mechanic in a bed factory, and what he invented was a brake. In eighteen fifty-four, at a great exhibition in New York, he had himself raised on an open platform high above the crowd. Then, at his signal, an assistant with an axe cut the rope. The platform dropped a few centimetres, and stopped. The mechanism behind this was remarkably simple. At the top of the platform Otis had fixed a spring, of the kind used on wagons. As long as the rope was pulling, the spring was held flat. The moment the tension disappeared, it straightened and pushed two metal bars outwards into rails with teeth, which ran up either side of the shaft.", vi: "Người thay đổi điều này, nói cho chặt, không phải người phát minh ra thang máy. Elisha Otis là thợ máy ở một xưởng làm giường, và cái ông phát minh là một cái phanh. Năm 1854, tại một triển lãm lớn ở New York, ông cho nâng mình trên một sàn hở lên cao trên đầu đám đông. Rồi theo hiệu của ông, một phụ tá cầm rìu chặt dây. Sàn tụt vài xăng-ti-mét, rồi dừng. Cơ chế đằng sau đơn giản đến lạ. Ở đỉnh sàn Otis gắn một cái lò xo, loại dùng cho xe ngựa chở hàng. Chừng nào dây còn kéo, lò xo bị giữ phẳng. Ngay khi lực căng mất, nó bật thẳng và đẩy hai thanh kim loại ra ngoài, cắm vào các ray có răng chạy dọc hai bên giếng thang." },
          { who: "Lecturer", voice: "uk-nam", text: "Orders were slow at first, but in eighteen fifty-seven the first lift intended for passengers was installed, not in an office or a hotel, as you might expect, but in a store on Broadway, five storeys high, which sold china and glass to fashionable customers. It travelled at less than half a metre a second. Within thirty years, though, lifts had been combined with the steel frame, and the skyscraper had arrived. I should add that the lift doesn't remove limits altogether; it replaces one with another. The taller the tower, the more lifts it needs, and in the very tallest, the shafts can take up a third of every floor, space which earns the owner nothing.", vi: "Ban đầu đơn đặt hàng chậm, nhưng năm 1857 chiếc thang đầu tiên dành cho hành khách được lắp, không phải ở văn phòng hay khách sạn như bạn tưởng, mà ở một cửa hàng trên đại lộ Broadway, cao năm tầng, bán đồ sứ và thuỷ tinh cho khách sành điệu. Nó chạy chưa tới nửa mét một giây. Tuy vậy trong ba mươi năm, thang máy đã kết hợp với khung thép, và nhà chọc trời ra đời. Tôi nên nói thêm là thang máy không xoá hẳn giới hạn; nó thay giới hạn này bằng giới hạn khác. Tháp càng cao càng cần nhiều thang, và ở những toà cao nhất, giếng thang có thể chiếm một phần ba mỗi tầng, chỗ không sinh lợi gì cho chủ." },
          { who: "Lecturer", voice: "uk-nam", text: "The social effect was just as striking, because the lift turned the building upside down. Once height cost no effort, it meant light, quiet and a view, and the top floors became the most expensive. The word ‘penthouse’ tells the story neatly. For centuries it had meant a shed, a rough structure leaning against the wall of a larger building. By the nineteen-twenties it meant the most luxurious apartment in the city.", vi: "Tác động xã hội cũng ấn tượng không kém, vì thang máy lộn ngược toà nhà. Khi độ cao không còn tốn sức, nó có nghĩa là ánh sáng, yên tĩnh và tầm nhìn, và các tầng trên cùng thành đắt nhất. Từ “penthouse” kể lại chuyện đó thật gọn. Suốt nhiều thế kỷ nó nghĩa là cái lán, một kết cấu thô dựa vào tường một toà nhà lớn hơn. Tới thập niên 1920 nó nghĩa là căn hộ sang nhất thành phố." },
          { who: "Lecturer", voice: "uk-nam", text: "Let me turn briefly to psychology. There's a story, often repeated, about an office tower in the nineteen-fifties whose tenants complained endlessly that the lifts were too slow. Engineers were consulted, and quoted an enormous sum for faster motors. The manager, so the story goes, tried something cheaper. He didn't change the lifts at all. He had mirrors fitted beside the doors on every floor, and the complaints almost stopped. People who have something to look at, even if it's only themselves, judge a wait to be shorter than it is. Whether or not every detail is true, designers have applied that lesson ever since.", vi: "Tôi chuyển nhanh sang tâm lý học. Có một câu chuyện hay được kể lại về một tháp văn phòng thập niên 1950 mà người thuê than phiền không dứt rằng thang quá chậm. Người ta hỏi kỹ sư, và họ báo một khoản khổng lồ cho động cơ nhanh hơn. Người quản lý, theo lời kể, thử một cách rẻ hơn. Ông không hề đổi thang. Ông cho gắn gương cạnh cửa thang ở mọi tầng, và lời than gần như dứt. Người có thứ để nhìn, dù chỉ là chính mình, sẽ thấy thời gian chờ ngắn hơn thực tế. Dù từng chi tiết có thật hay không, giới thiết kế đã áp dụng bài học đó từ bấy đến nay." },
          { who: "Lecturer", voice: "uk-nam", text: "Finally, where are we now? In many new towers you no longer press a button inside the lift. Instead, you enter your floor on a keypad in the lobby, and a screen tells you which lift to take. Because the system knows where everyone is going before they get in, it can put people travelling to the same floors together, and each lift makes far fewer stops. As for height, the limit today is not the motor. It's the cable. Steel is so heavy that, beyond about five hundred metres, a cable can barely support its own weight, which is why passengers in the tallest buildings have to change lifts part of the way up. Lighter materials based on carbon fibre are now being introduced, and they may, in time, double that distance.", vi: "Cuối cùng, giờ ta đang ở đâu? Ở nhiều tháp mới bạn không còn bấm nút trong thang. Thay vào đó, bạn nhập tầng của mình trên một bàn phím ở sảnh, và màn hình cho biết đi thang nào. Vì hệ thống biết mọi người đi đâu trước khi họ bước vào, nó xếp những người đi cùng tầng với nhau, và mỗi thang dừng ít hơn hẳn. Còn về độ cao, giới hạn ngày nay không phải động cơ. Đó là dây cáp. Thép nặng tới mức quá khoảng năm trăm mét, cáp gần như không đỡ nổi sức nặng của chính nó, đó là lý do khách ở các toà cao nhất phải đổi thang giữa chừng. Vật liệu nhẹ hơn từ sợi carbon đang được đưa vào, và rồi có thể tăng gấp đôi khoảng cách đó." },
        ],
      },
      {
        t: "quiz", id: "t4d17-nghe-p4-note", kind: "fill", title: "Questions 31–40 — Note completion (ONE WORD ONLY)",
        items: [
          { q: "(31) hoists were trusted only with ______", answers: ["goods"] },
          { q: "(32) the highest floors had the lowest ______", answers: ["rents", "rent"] },
          { q: "(33) Otis had the ______ cut", answers: ["rope"] },
          { q: "(34) his device used a ______", answers: ["spring"] },
          { q: "(35) first passenger lift fitted in a five-storey ______", answers: ["store"] },
          { q: "(36) a large share of each floor is lost to ______", answers: ["shafts"] },
          { q: "(37) “penthouse” had once meant a kind of ______", answers: ["shed"] },
          { q: "(38) complaints were reduced by fitting ______ beside the doors", answers: ["mirrors"] },
          { q: "(39) passengers choose their floor on a ______ in the lobby", answers: ["keypad"] },
          { q: "(40) limited by the weight of its steel ______", answers: ["cable"] },
        ],
      },

      { t: "h", text: "4. Sau khi nghe — đáp án nằm ở câu nào, bẫy ở đâu" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Lời trong bản ghi", "Bẫy / paraphrase"],
        rows: [
          ["26", "committee", "The application form goes to the ethics committee", "nghe được nguyên cụm; chú ý chính tả: co**mm**i**tt**ee"],
          ["27", "pilot", "Once that's approved, we'll run a pilot", "run → carry out · “to check the wording” = “tell us if any of the wording is unclear”"],
          ["28", "lectures", "That was the plan [email], but… go into lectures instead", "**đổi ý**: email bị bác; đáp án số nhiều"],
          ["29", "interviews", "I'd suggested a discussion group, but… So it'll be interviews: about six", "**đổi ý**: discussion group bị bác (và là hai từ)"],
          ["30", "poster", "show your results on a poster… There's no talk to give", "report (tháng Năm) và talk là nhiễu"],
          ["31", "goods", "prepared to take that risk with goods, but hardly anyone… with people", "trusted only with ↔ take that risk with"],
          ["32", "rents", "the rents fell with every flight of stairs", "lowest ↔ fell… until under the roof; số nhiều"],
          ["33", "rope", "an assistant with an axe cut the rope", "had the rope cut = causative (bài 1 mục 8)"],
          ["34", "spring", "Otis had fixed a spring, of the kind used on wagons", "bars, rails, teeth đã có sẵn trong bảng ghi"],
          ["35", "store", "not in an office or a hotel… but in a store on Broadway", "bẫy “not A or B, but C”"],
          ["36", "shafts", "the shafts can take up a third of every floor", "a large share ↔ a third; lifts là nhiễu"],
          ["37", "shed", "it had meant a shed, a rough structure", "once meant ↔ For centuries it had meant"],
          ["38", "mirrors", "He had mirrors fitted beside the doors", "faster motors là phương án bị bỏ"],
          ["39", "keypad", "you enter your floor on a keypad in the lobby", "button (bên trong thang) và screen là nhiễu"],
          ["40", "cable", "the limit today is not the motor. It's the cable.", "“not X. It's Y”; rope là từ của câu 33"],
        ],
      },
      { t: "note", title: "Tự chấm đề nhỏ (20 câu)", items: ["**17–20**: vượt mốc band 7 ở hai phần khó nhất. Giữ nhịp: mỗi tuần một đề nhỏ Part 3 + 4.", "**14–16**: đạt mốc Tập 4. Xem lại câu sai thuộc loại nào: **đổi ý** (24, 28, 29) hay **mất dấu** (ba câu liền ở Part 4).", "**≤ 13**: nghe lại **kèm lời thoại** một lần, rồi nghe lần ba **không lời thoại**. Ôn Ngày 12 (bẫy đổi ý) và Ngày 13 (bảng ghi Part 4).", "Câu 33 và 38 dùng **causative** bạn vừa học: had the rope **cut**, had mirrors **fitted**."] },

      { t: "h", text: "5. Phát âm: trọng âm của từ 4–5 âm tiết" },
      { t: "p", text: "Từ học thuật dài là chỗ người Việt hay nhấn sai, và nhấn sai một từ dài thì người nghe **không nhận ra từ** dù mọi âm đều đúng. Tin tốt: trọng âm của từ dài đi theo **đuôi từ**. Thuộc bốn luật dưới đây là nhấn đúng phần lớn từ trong bài giảng Part 4 và trong câu trả lời Part 3 của chính bạn. (Âm viết HOA là âm mang trọng âm chính.)" },
      {
        t: "table",
        head: ["Đuôi", "Luật", "Ví dụ"],
        rows: [
          ["**-tion · -sion · -cian**", "nhấn âm **ngay trước** đuôi", "evalu**A**tion · partici**PA**tion · investi**GA**tion · communi**CA**tion"],
          ["**-ity · -ety**", "nhấn âm **ngay trước** đuôi", "possi**BI**lity · relia**BI**lity · elec**TRI**city · uni**VER**sity"],
          ["**-ic · -ical**", "nhấn âm **ngay trước** đuôi", "eco**NO**mic · scien**TI**fic · psycho**LO**gical · ana**LY**tical"],
          ["**-graphy · -logy · -nomy · -meter · -ate · -ise (động từ)**", "nhấn âm **thứ ba từ cuối**", "pho**TO**graphy · tech**NO**logy · e**CO**nomy · par**TI**cipate · e**VA**luate"],
        ],
      },
      { t: "note", title: "Cẩn thận: trọng âm DỜI khi đổi đuôi", items: ["**PHO**tograph → pho**TO**grapher → photo**GRA**phic", "**A**nalyse → a**NA**lysis → ana**LY**tical", "par**TI**cipate → partici**PA**tion · e**CO**nomy → eco**NO**mic · **PO**ssible → possi**BI**lity", "Âm không mang trọng âm co lại thành /ə/ hoặc /ɪ/: photography /fəˈtɒɡrəfi/ — âm “pho” không còn là /fəʊ/."] },
      {
        t: "phatam", id: "t4d17-phat-am", title: "Luyện phát âm — trọng âm từ 4–5 âm tiết",
        note: "Đọc chậm lần đầu, gõ tay vào âm viết HOA trong phần dịch; lần hai đọc tốc độ thường. Máy chấm từng từ.",
        items: [
          { text: "We need to evaluate the reliability of the data.", ipa: "wiː niːd tə ɪvæljueɪt ðə rɪlaɪəbɪləti əv ðə deɪtə", vi: "Ta cần đánh giá độ tin cậy của dữ liệu. (eVAluate · reliaBIlity)" },
          { text: "Participation in the questionnaire was voluntary.", ipa: "pɑːtɪsɪpeɪʃn ɪn ðə kwestʃəneə wəz vɒləntri", vi: "Việc tham gia bảng hỏi là tự nguyện. (particiPAtion · questionNAIRE · VOluntary)" },
          { text: "The economy depends on new technology.", ipa: "ði ɪkɒnəmi dɪpendz ɒn njuː teknɒlədʒi", vi: "Nền kinh tế phụ thuộc vào công nghệ mới. (eCOnomy · techNOlogy)" },
          { text: "It was a psychological rather than an economic problem.", ipa: "ɪt wəz ə saɪkəlɒdʒɪkl rɑːðə ðən ən iːkənɒmɪk prɒbləm", vi: "Đó là vấn đề tâm lý hơn là kinh tế. (psychoLOgical · ecoNOmic)" },
          { text: "The photographer studied photography at university.", ipa: "ðə fətɒɡrəfə stʌdid fətɒɡrəfi ət juːnɪvɜːsəti", vi: "Nhiếp ảnh gia học nhiếp ảnh ở đại học. (phoTOgrapher · phoTOgraphy · uniVERsity)" },
          { text: "Our analysis was more analytical than theirs.", ipa: "aʊə ənæləsɪs wəz mɔː ænəlɪtɪkl ðən ðeəz", vi: "Phân tích của chúng tôi mang tính phân tích hơn của họ. (aNAlysis · anaLYtical)" },
          { text: "The investigation revealed an unexpected possibility.", ipa: "ði ɪnvestɪɡeɪʃn rɪviːld ən ʌnɪkspektɪd pɒsəbɪləti", vi: "Cuộc điều tra hé lộ một khả năng bất ngờ. (investiGAtion · unexPECted · possiBIlity)" },
          { text: "Electricity made communication almost instantaneous.", ipa: "ɪlektrɪsəti meɪd kəmjuːnɪkeɪʃn ɔːlməʊst ɪnstənteɪniəs", vi: "Điện khiến liên lạc gần như tức thời. (elecTRIcity · communiCAtion · instanTAneous)" },
        ],
      },
      {
        t: "mcq", id: "t4d17-nghe-trong-am", title: "Âm nào mang trọng âm chính? (5 câu)",
        items: [
          { q: "methodology", options: ["ME-tho-do-lo-gy", "me-THO-do-lo-gy", "me-tho-DO-lo-gy", "me-tho-do-LO-gy"], correct: 2, why: "Đuôi -logy ⇒ âm thứ ba từ cuối: methoDOlogy /ˌmeθəˈdɒlədʒi/." },
          { q: "responsibility", options: ["re-spon-si-BI-li-ty", "re-SPON-si-bi-li-ty", "re-spon-SI-bi-li-ty", "RE-spon-si-bi-li-ty"], correct: 0, why: "Đuôi -ity ⇒ âm ngay trước: responsiBIlity." },
          { q: "investigate (động từ)", options: ["IN-ves-ti-gate", "in-VES-ti-gate", "in-ves-TI-gate", "in-ves-ti-GATE"], correct: 1, why: "Động từ đuôi -ate ⇒ âm thứ ba từ cuối: inVEStigate; danh từ dời: investiGAtion." },
          { q: "characteristic", options: ["CHA-rac-te-ris-tic", "cha-RAC-te-ris-tic", "cha-rac-TE-ris-tic", "cha-rac-te-RIS-tic"], correct: 3, why: "Đuôi -ic ⇒ âm ngay trước: characteRIStic (danh từ gốc: CHAracter)." },
          { q: "Cặp nào ĐỔI vị trí trọng âm?", options: ["possible → possibility", "develop → development", "reliable → reliably", "manage → management"], correct: 0, why: "POssible → possiBIlity (đuôi -ity kéo trọng âm). Các đuôi -ment, -ly không dời trọng âm." },
        ],
      },
    ],
  },
  {
    id: "t4d17-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 17 — tường thuật học thuật · causative · Flow-chart kỹ thuật · bài giảng ngắn · trọng âm từ dài",
    goal: "Tự kiểm lại cả ngày: chọn đúng động từ tường thuật và mẫu câu của nó, viết lại câu bằng It is said that / is said to và causative, điền một flow-chart kỹ thuật mới, nghe một đoạn bài giảng ngắn và đặt đúng trọng âm từ 4–5 âm tiết.",
    minutes: 60,
    blocks: [
      {
        t: "recap", title: "Cách làm",
        items: [
          "34 câu, 6 phần, khoảng 60 phút. Làm xong mới xem đáp án.",
          "Phần I–III ôn **bài 1**; phần IV ôn **bài 2**; phần V–VI ôn **bài 3**.",
          "Sai từ 3 câu trở lên ở một phần ⇒ mở lại đúng mục ghi ở tiêu đề phần đó.",
        ],
      },
      { t: "h", text: "Phần I — Động từ tường thuật và mẫu câu (8 câu · ôn bài 1 mục 2–4)" },
      {
        t: "mcq", id: "t4d17-bt-chon", title: "I. Chọn đáp án đúng",
        items: [
          { q: "The airline ______ that the delay was caused by bad weather, although passengers reported clear skies.", options: ["showed", "claimed", "revealed", "established"], correct: 1, why: "Vế although cho thấy người viết còn ngờ ⇒ claimed." },
          { q: "The lecturer ______ the importance of checking every source.", options: ["emphasised on", "emphasised about", "emphasised", "emphasised to"], correct: 2, why: "emphasise + N, không giới từ (danh từ mới có: put emphasis ON)." },
          { q: "______ the authors point out, the sample included very few rural schools.", options: ["As", "According to", "In the view of", "Like that"], correct: 0, why: "As + S + V, + mệnh đề. According to + danh từ (không + mệnh đề)." },
          { q: "Opponents of the scheme ______ whether it offers value for money.", options: ["maintain", "insist", "claim", "question"], correct: 3, why: "question + whether. Ba động từ kia + that." },
          { q: "The inquiry ______ the accident ______ poor maintenance.", options: ["accused … of", "attributed … to", "criticised … for", "described … as"], correct: 1, why: "attribute + kết quả + to + nguyên nhân." },
          { q: "Although the trial was a success, the team ______ that the long-term effects are still unknown.", options: ["concedes", "disputes", "rejects", "denies"], correct: 0, why: "Thừa nhận một điểm bất lợi ⇒ concede." },
          { q: "Which sentence is correct?", options: ["The report suggests the council to build more cycle lanes.", "The report suggests to build more cycle lanes.", "The report suggests building more cycle lanes.", "The report suggests the council building more cycle lanes to."], correct: 2, why: "suggest + V-ing / suggest that + S + (should) + V. Không có suggest sb to V." },
          { q: "Over the past decade, a growing body of research ______ that air pollution harms children's lungs.", options: ["is showing", "showed", "had shown", "has shown"], correct: 3, why: "Cả một mảng nghiên cứu, tới nay ⇒ hiện tại hoàn thành." },
        ],
      },
      { t: "h", text: "Phần II — Viết lại câu (8 câu · ôn bài 1 mục 6–8)" },
      {
        t: "quiz", id: "t4d17-bt-viet-lai", kind: "fill", title: "II. Điền MỘT đến BA từ để câu thứ hai giữ nguyên nghĩa",
        items: [
          { q: "People think that the painting was stolen in the 1930s. → The painting is thought ___ ___ ___ stolen in the 1930s.", answers: ["to have been"] },
          { q: "People say that the minister is preparing to resign. → The minister is said ___ ___ ___ to resign.", answers: ["to be preparing"] },
          { q: "Experts estimate that the repairs will cost two million pounds. → ___ ___ ___ that the repairs will cost two million pounds.", answers: ["It is estimated"] },
          { q: "The teacher made the class rewrite the essay. → The class was made ___ ___ the essay.", answers: ["to rewrite"] },
          { q: "Her parents didn't let her travel alone. → She was not ___ ___ travel alone.", answers: ["allowed to", "permitted to"] },
          { q: "Because of online banking, customers can pay bills at any hour. → Online banking ___ ___ ___ pay bills at any hour.", answers: ["enables customers to", "allows customers to"], hint: "động từ + O + to" },
          { q: "Someone is going to paint our office next week. → We are going to have our office ___ next week.", answers: ["painted"], hint: "have + O + V3" },
          { q: "Many people assume that older workers resist change. This is unfair. → The ___ ___ older workers resist change is unfair.", answers: ["assumption that"] },
        ],
      },
      { t: "h", text: "Phần III — Dịch Việt → Anh (5 câu · ôn bài 1)" },
      {
        t: "quiz", id: "t4d17-bt-dich", kind: "translate", title: "III. Dịch sang tiếng Anh — bắt buộc dùng cấu trúc trong gợi ý", grammar: "It is often argued that · is believed to have V3 · make / force / prevent · describe O as",
        items: [
          { q: "Người ta thường lập luận rằng đại học nên miễn phí.", answers: ["It is often argued that university should be free.", "It is often argued that universities should be free.", "It is often argued that university education should be free.", "It is often argued that higher education should be free."], hint: "It is often argued that…" },
          { q: "Con tàu được cho là đã chìm trong một cơn bão.", answers: ["The ship is believed to have sunk in a storm.", "The ship is thought to have sunk in a storm.", "The ship is said to have sunk in a storm.", "The ship is believed to have sunk during a storm.", "The ship is thought to have sunk during a storm."], hint: "is believed to have + V3" },
          { q: "Tiếng ồn ngăn nhiều cư dân ngủ ngon.", answers: ["Noise prevents many residents from sleeping well.", "The noise prevents many residents from sleeping well.", "Noise stops many residents from sleeping well.", "The noise stops many residents from sleeping well."], hint: "prevent + O + from + V-ing" },
          { q: "Hạn hán buộc nông dân phải bỏ đất của họ.", answers: ["The drought forced farmers to abandon their land.", "Drought forced farmers to abandon their land.", "The drought forced farmers to leave their land.", "Drought forces farmers to abandon their land.", "The drought forced the farmers to abandon their land.", "The drought has forced farmers to abandon their land."], hint: "force + O + to V · abandon" },
          { q: "Tác giả mô tả thành phố là một nút thắt cổ chai cho thương mại.", answers: ["The author describes the city as a bottleneck for trade.", "The writer describes the city as a bottleneck for trade.", "The author describes the city as a bottleneck for commerce.", "The author described the city as a bottleneck for trade."], hint: "describe O as · bottleneck" },
        ],
      },
      { t: "h", text: "Phần IV — Flow-chart: một cơ cấu mới (5 câu · ôn bài 2 mục 2–4)" },
      { t: "p", text: "Đọc đoạn dưới đây rồi điền sơ đồ. **ONE WORD ONLY** cho mỗi chỗ trống. 6 phút." },
      {
        t: "passage", title: "How a Piano Sounds a Note",
        paras: [
          { text: "Although a piano has a keyboard, it is strictly speaking a percussion instrument, since its sound is produced by striking. Each key is a long lever which pivots near its centre. When the player's finger pushes the front of the key down, the far end rises and throws a hammer, a wooden head covered in felt, towards a tightly stretched steel string. At the same instant, a second part known as the damper, a soft pad which normally rests on the string to keep it silent, is lifted clear. The hammer hits the string and immediately bounces back, so that the string is left free to vibrate. By themselves these vibrations would be almost inaudible. They are therefore carried through a wooden bridge to the soundboard, a broad, thin sheet of spruce which, because of its large surface, sets far more air in motion than a string could. When the key is released, the damper drops back and the note stops." },
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Sounding a note",
        steps: [
          { label: "Front of key is pressed; back of key goes up", sub: "a hammer with a covering of **1 ______** is thrown at the string" },
          { label: "Simultaneously, the **2 ______** is raised off the string" },
          { label: "Hammer strikes, then rebounds at once", sub: "allowing the string to **3 ______** freely" },
          { label: "Movement passes via the **4 ______** to the soundboard", sub: "which is made of **5 ______** and makes the sound louder" },
        ],
      },
      {
        t: "quiz", id: "t4d17-bt-flow", kind: "fill", title: "IV. Questions 1–5 — ONE WORD ONLY",
        items: [
          { q: "(1) a hammer with a covering of ______", answers: ["felt"], hint: "“a wooden head covered in …”" },
          { q: "(2) the ______ is raised off the string", answers: ["damper"], hint: "thuật ngữ sau “known as”; is lifted clear = is raised off" },
          { q: "(3) allowing the string to ______ freely", answers: ["vibrate"], hint: "left free to … = allowing… to … freely" },
          { q: "(4) movement passes via the ______", answers: ["bridge"], hint: "carried through = passes via" },
          { q: "(5) made of ______", answers: ["spruce"], hint: "“a broad, thin sheet of …” — tên một loại gỗ, không cần biết nghĩa" },
        ],
      },
      { t: "h", text: "Phần V — Nghe: một đoạn bài giảng (4 câu · ôn bài 3)" },
      { t: "p", text: "Nghe **một lần** rồi điền **ONE WORD ONLY**." },
      {
        t: "listen", id: "t4d17-bt-nghe", title: "The road stud — a short lecture extract",
        dan: { so: "Day 17, Homework recording", boiCanh: "part of a lecture on design, about a safety device used on roads.", cau: [1, 4] },
        note: "Khoảng 1 phút 20 giây, giọng New Zealand (nữ).",
        lines: [
          { who: "Lecturer", voice: "nz-nu", text: "My last example is so ordinary that most drivers never notice it: the reflecting road stud, which marks the centre of the road at night. It was devised in nineteen thirty-four by Percy Shaw, a road mender from the north of England. Shaw used to say the idea came to him one night when he was driving home in fog, and his headlights were suddenly thrown back at him by the eyes of a cat sitting by the roadside.", vi: "Ví dụ cuối của tôi bình thường tới mức đa số tài xế không hề để ý: đinh phản quang trên đường, thứ đánh dấu tim đường ban đêm. Nó được Percy Shaw, một thợ sửa đường ở miền bắc nước Anh, nghĩ ra năm 1934. Shaw hay kể rằng ý tưởng đến vào một đêm ông lái xe về nhà trong sương mù, và ánh đèn pha bỗng hắt ngược lại từ đôi mắt một con mèo ngồi ven đường." },
          { who: "Lecturer", voice: "nz-nu", text: "His design had two pairs of reflectors, which were not plastic, as they often are today, but glass, and he set them in a dome made of rubber, held in an iron case sunk into the road. And here's the clever part. Whenever a tyre passed over the dome, it was squeezed down, and the reflectors were wiped clean, using rainwater that had collected in the base. So the device looked after itself.", vi: "Thiết kế của ông có hai cặp mắt phản quang, không phải bằng nhựa như ngày nay hay dùng, mà bằng thuỷ tinh, và ông đặt chúng trong một vòm làm bằng cao su, giữ trong một vỏ sắt chôn xuống mặt đường. Và đây là chỗ khéo. Mỗi khi lốp xe lăn qua, vòm bị ép xuống, và mắt phản quang được lau sạch bằng nước mưa đọng ở đáy. Vậy là thiết bị tự chăm sóc mình." },
          { who: "Lecturer", voice: "nz-nu", text: "Sales were poor until the Second World War, when street lighting was switched off at night and car headlights had to be covered. During the blackout, as it was called, the studs were almost the only guide a driver had, and the government ordered them by the million.", vi: "Hàng bán chậm cho tới Thế chiến thứ hai, khi đèn đường bị tắt ban đêm và đèn pha ô tô phải che lại. Trong thời kỳ gọi là blackout (tắt đèn phòng không), những chiếc đinh này gần như là thứ dẫn đường duy nhất của tài xế, và chính phủ đặt mua hàng triệu chiếc." },
        ],
      },
      {
        t: "quiz", id: "t4d17-bt-nghe-cau", kind: "fill", title: "V. Questions 1–4 — ONE WORD ONLY",
        items: [
          { q: "(1) Shaw had the idea while driving in ______", answers: ["fog"] },
          { q: "(2) the reflectors were made of ______", answers: ["glass"], hint: "bẫy “not A… but B”" },
          { q: "(3) the reflectors sat in a dome of ______", answers: ["rubber"] },
          { q: "(4) demand grew during the wartime ______", answers: ["blackout"] },
        ],
      },
      { t: "h", text: "Phần VI — Trọng âm từ 4–5 âm tiết (4 câu · ôn bài 3 mục 5)" },
      {
        t: "mcq", id: "t4d17-bt-trong-am", title: "VI. Chọn đáp án đúng",
        items: [
          { q: "Từ nào nhấn ở âm tiết THỨ HAI?", options: ["population", "economy", "economic", "academic"], correct: 1, why: "eCOnomy (đuôi -nomy ⇒ âm thứ ba từ cuối = âm thứ hai). popuLAtion, ecoNOmic, acaDEmic nhấn âm thứ ba." },
          { q: "Trong “availability”, trọng âm chính rơi vào", options: ["-vai-", "-la-", "-bi-", "-ty"], correct: 2, why: "Đuôi -ity ⇒ âm ngay trước: availaBIlity." },
          { q: "Cặp nào có trọng âm ở CÙNG vị trí?", options: ["photograph – photographer", "analyse – analysis", "participate – participation", "technology – technologist"], correct: 3, why: "techNOlogy – techNOlogist cùng nhấn âm hai. Ba cặp còn lại đều dời trọng âm." },
          { q: "Từ nào nhấn ở âm tiết THỨ BA?", options: ["communicate", "opportunity", "significant", "particular"], correct: 1, why: "opporTUnity (đuôi -ity). comMUnicate, sigNIficant, parTIcular nhấn âm hai." },
        ],
      },
    ],
  },
];
