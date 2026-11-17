/**
 * IELTS Tập 3 · Ngày 4 — Từ vựng: Crime, law & punishment [VC19] · Writing Task 1 band 6: overview chọn 2 điểm,
 * nhóm số liệu [W02] · Listening Part 2: MCQ + Map labelling, giọng Canada [L04 L13 L17] · Bài tập (37 câu).
 * 🔊 Bảng 3.3 không ghi âm riêng cho ngày này ⇒ khối phatam luyện /θ/ · /ð/ · /dʒ/ ngay trong từ chủ đề (theft, judge…).
 *
 * Nguồn đề cương: docs/ielts-lo-trinh-0-8.md mục 3.3 hàng N4. Nối Tập 2: overview 2 câu + chia thân bài theo số hạng mục
 * (T2 N4) · bar chart (T2 N8) · Map labelling + ngôn ngữ vị trí, giọng Mỹ (T2 N7). Mọi số liệu, bài mẫu, kịch bản nghe tự soạn.
 */
import type { Lesson } from "../data";

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T3D4_VOCAB: Lesson = {
  id: "t3d4-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Tội phạm, pháp luật & hình phạt (Crime, law & punishment)",
  goal: "Dùng đúng 48 từ và 14 cụm về tội phạm – toà án – hình phạt để viết một đoạn Task 2 và trả lời Part 3 về chủ đề Crime mà không lẫn steal / rob, crime / criminal, fine / sentence.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này đẩy band nào, tiêu chí nào",
      items: [
        "Đẩy **LR** (Lexical Resource — vốn từ) của **Writing Task 2 và Speaking Part 3** lên band 6: band 6 cần “đủ từ để bàn về chủ đề” và “dám dùng từ ít gặp”. **Crime** là một trong những chủ đề Task 2 ra đều nhất, và là chủ đề người học **thiếu từ** nhiều nhất.",
        "Ba nhóm từ đi theo **đường đi của một vụ án**: ==phạm tội → bị bắt, ra toà → nhận hình phạt, tái hoà nhập==.",
        "**14 cụm** (collocation — các từ hay đi với nhau) phải thuộc nguyên khối: **commit a crime · be sentenced to · act as a deterrent · serve a sentence · the reoffending rate**.",
        "Sáu cặp dễ nhầm: **steal ↔ rob** · **crime ↔ criminal** · **thief ↔ robber ↔ burglar** · **judge ↔ jury** · **fine ↔ sentence** · **prison ↔ jail**.",
        "Cuối bài có khung lập luận **“nhà tù hay cải tạo”** dùng được cho gần như mọi đề Task 2 về tội phạm — và hôm nay bài Viết cũng dùng số liệu về tội phạm.",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Đường đi của một vụ án — học từ theo thứ tự này",
      steps: [
        { label: "① Phạm tội", sub: "commit a crime / an offence · offender · victim · theft, burglary, fraud…" },
        { label: "② Điều tra, bắt giữ", sub: "the police · suspect · arrest · charge sb with · evidence · witness" },
        { label: "③ Xét xử", sub: "court · trial · judge · jury · guilty / innocent · convict" },
        { label: "④ Hình phạt", sub: "sentence · fine · imprisonment · community service · probation" },
        { label: "⑤ Sau hình phạt", sub: "release · rehabilitation · reoffend · law-abiding citizen" },
      ],
      caption: "Task 2 về tội phạm gần như luôn hỏi về bước ④ và ⑤: phạt thế nào, và làm sao để người ta không tái phạm.",
    },

    { t: "h", text: "1. Tội phạm và người phạm tội — 15 từ" },
    {
      t: "vocab",
      items: [
        { w: "crime", pos: "n", ipa: "/kraɪm/", vi: "tội phạm (nói chung); một tội", ex: "Crime has fallen in most large cities.", exVi: "Tội phạm đã giảm ở hầu hết các thành phố lớn.", more: "**U** = tội phạm nói chung (Ø crime — Ngày 3) · **C** = một tội: **commit a crime**. **violent crime** · **petty crime** (tội vặt) · **organised crime**." },
        { w: "offence", pos: "n", ipa: "/əˈfens/", vi: "hành vi phạm pháp, tội (trang trọng)", ex: "Driving without a licence is a criminal offence.", exVi: "Lái xe không bằng là một tội hình sự.", more: "**a minor / serious offence** · **a first offence** (phạm tội lần đầu). Mỹ viết **offense**." },
        { w: "offender", pos: "n", ipa: "/əˈfendə/", vi: "người phạm tội", ex: "Young offenders should be given a second chance.", exVi: "Người phạm tội trẻ tuổi nên được trao cơ hội thứ hai.", more: "**a young / first-time / repeat offender** (tái phạm nhiều lần). Động từ: **offend**, **reoffend**." },
        { w: "criminal", pos: "n, adj", ipa: "/ˈkrɪmɪnl/", vi: "tội phạm (người); thuộc về hình sự", ex: "The police caught the criminal within hours.", exVi: "Cảnh sát bắt được tên tội phạm trong vài giờ.", more: "**crime** = việc · **criminal** = người. **a criminal record** = tiền án · **criminal behaviour**." },
        { w: "theft", pos: "n", ipa: "/θeft/", vi: "tội trộm cắp", ex: "Bicycle theft is common near the station.", exVi: "Trộm xe đạp phổ biến ở gần nhà ga.", more: "Người: **thief** /θiːf/, số nhiều **thieves**. **car / vehicle theft** · **identity theft** (trộm danh tính)." },
        { w: "burglary", pos: "n", ipa: "/ˈbɜːɡləri/", vi: "tội đột nhập vào nhà để trộm", ex: "There were three burglaries in our street last year.", exVi: "Năm ngoái phố tôi có ba vụ đột nhập trộm cắp.", more: "Người: **burglar**. Động từ: The house **was burgled** / **broken into**." },
        { w: "robbery", pos: "n", ipa: "/ˈrɒbəri/", vi: "tội cướp (có đe doạ, dùng vũ lực)", ex: "He was jailed for armed robbery.", exVi: "Hắn bị bỏ tù vì tội cướp có vũ trang.", more: "Người: **robber**. Động từ **rob** + người / nơi: **rob a bank**. (Xem mục 4: steal ↔ rob.)" },
        { w: "fraud", pos: "n", ipa: "/frɔːd/", vi: "tội lừa đảo, gian lận", ex: "Online fraud has increased sharply since 2015.", exVi: "Lừa đảo trực tuyến đã tăng mạnh từ năm 2015.", more: "**credit card fraud** · **commit fraud** · người: **fraudster**. Gần nghĩa: **a scam** (vụ lừa — thân mật)." },
        { w: "vandalism", pos: "n", ipa: "/ˈvændəlɪzəm/", vi: "tội phá hoại tài sản công", ex: "Graffiti and vandalism make the area look unsafe.", exVi: "Vẽ bậy và phá hoại làm khu vực trông mất an toàn.", more: "Người: **vandal** · động từ: **vandalise**. Không đếm được." },
        { w: "shoplifting", pos: "n", ipa: "/ˈʃɒplɪftɪŋ/", vi: "tội ăn cắp hàng trong cửa hàng", ex: "Shoplifting costs retailers millions every year.", exVi: "Trộm hàng trong cửa hiệu làm các nhà bán lẻ thiệt hại hàng triệu mỗi năm.", more: "Người: **shoplifter**. Ví dụ điển hình của **petty crime**." },
        { w: "cybercrime", pos: "n", ipa: "/ˈsaɪbəkraɪm/", vi: "tội phạm mạng", ex: "Cybercrime is harder to detect than street crime.", exVi: "Tội phạm mạng khó phát hiện hơn tội phạm đường phố.", more: "Gồm: **hacking**, **online fraud**, **identity theft**. Người: **cybercriminal**, **hacker**." },
        { w: "assault", pos: "n, v", ipa: "/əˈsɔːlt/", vi: "tội hành hung; tấn công", ex: "He was charged with assault after the fight.", exVi: "Anh ta bị buộc tội hành hung sau vụ ẩu đả.", more: "Một loại **violent crime**. Nặng hơn: **murder** /ˈmɜːdə/ (giết người)." },
        { w: "drug trafficking", pos: "n", ipa: "/ˈdrʌɡ træfɪkɪŋ/", vi: "tội buôn bán ma tuý", ex: "Drug trafficking carries a very heavy sentence.", exVi: "Buôn bán ma tuý chịu mức án rất nặng.", more: "Người: **drug trafficker / dealer**. Gần nghĩa: **smuggling** (buôn lậu)." },
        { w: "juvenile", pos: "adj, n", ipa: "/ˈdʒuːvənaɪl/", vi: "(thuộc) vị thành niên", ex: "Juvenile crime is often linked to poverty.", exVi: "Tội phạm vị thành niên thường gắn với nghèo đói.", more: "**juvenile crime / delinquency** · **a juvenile offender** = **a young offender**." },
        { w: "victim", pos: "n", ipa: "/ˈvɪktɪm/", vi: "nạn nhân", ex: "Victims of fraud rarely get their money back.", exVi: "Nạn nhân của lừa đảo hiếm khi lấy lại được tiền.", more: "**a victim of** + tội · **fall victim to** (trở thành nạn nhân của)." },
      ],
    },

    { t: "h", text: "2. Pháp luật và toà án — 16 từ" },
    {
      t: "vocab",
      items: [
        { w: "legislation", pos: "n", ipa: "/ˌledʒɪsˈleɪʃn/", vi: "luật pháp, văn bản luật (không đếm được)", ex: "New legislation bans smoking in public places.", exVi: "Luật mới cấm hút thuốc ở nơi công cộng.", more: "**introduce / pass legislation** · không nói ~~a legislation~~ → **a law** / **a piece of legislation**." },
        { w: "law enforcement", pos: "n", ipa: "/ˈlɔː ɪnfɔːsmənt/", vi: "việc thực thi pháp luật; lực lượng hành pháp", ex: "Law enforcement agencies share data across borders.", exVi: "Các cơ quan hành pháp chia sẻ dữ liệu xuyên biên giới.", more: "Động từ: **enforce the law**. **break the law** ↔ **obey / respect the law**." },
        { w: "illegal", pos: "adj", ipa: "/ɪˈliːɡl/", vi: "bất hợp pháp", ex: "It is illegal to sell alcohol to children.", exVi: "Bán rượu cho trẻ em là bất hợp pháp.", more: "↔ **legal**. Động từ: **legalise** (hợp pháp hoá) ↔ **ban / outlaw**. Trạng từ: **illegally**." },
        { w: "suspect", pos: "n", ipa: "/ˈsʌspekt/", vi: "nghi phạm", ex: "The police questioned two suspects.", exVi: "Cảnh sát thẩm vấn hai nghi phạm.", more: "Động từ nhấn âm sau: **suspect** /səˈspekt/ sb **of** + V-ing (nghi ai làm gì)." },
        { w: "arrest", pos: "v, n", ipa: "/əˈrest/", vi: "bắt giữ", ex: "She was arrested for shoplifting.", exVi: "Cô ta bị bắt vì ăn cắp ở cửa hàng.", more: "**arrest sb for** + tội · **be under arrest** · **make an arrest**." },
        { w: "charge", pos: "v, n", ipa: "/tʃɑːdʒ/", vi: "buộc tội; lời buộc tội", ex: "He was charged with fraud.", exVi: "Ông ta bị buộc tội lừa đảo.", more: "**charge sb with** + tội (không phải ~~for~~). Gần nghĩa: **accuse sb of** + V-ing." },
        { w: "court", pos: "n", ipa: "/kɔːt/", vi: "toà án", ex: "The case will go to court next month.", exVi: "Vụ án sẽ ra toà tháng sau.", more: "**go to court** · **appear in court** (Ø — như go to prison, Ngày 3) · **take sb to court** (kiện ai)." },
        { w: "trial", pos: "n", ipa: "/ˈtraɪəl/", vi: "phiên toà, vụ xét xử", ex: "The trial lasted three weeks.", exVi: "Phiên toà kéo dài ba tuần.", more: "**be on trial for** + tội · **a fair trial** (xét xử công bằng)." },
        { w: "judge", pos: "n, v", ipa: "/dʒʌdʒ/", vi: "thẩm phán; xét xử, đánh giá", ex: "The judge gave him a two-year sentence.", exVi: "Thẩm phán tuyên anh ta hai năm tù.", more: "Thẩm phán **quyết định hình phạt**. Danh từ: **judgement**." },
        { w: "jury", pos: "n", ipa: "/ˈdʒʊəri/", vi: "bồi thẩm đoàn", ex: "The jury found her not guilty.", exVi: "Bồi thẩm đoàn kết luận cô ấy vô tội.", more: "Bồi thẩm đoàn (12 công dân, ở Anh – Mỹ) **quyết định có tội hay không**; thẩm phán quyết mức án." },
        { w: "evidence", pos: "n", ipa: "/ˈevɪdəns/", vi: "bằng chứng (không đếm được)", ex: "There was not enough evidence to convict him.", exVi: "Không đủ bằng chứng để kết tội anh ta.", more: "~~evidences~~ (Ngày 3) → **a piece of evidence**. **give evidence** (làm chứng) · **strong / clear evidence**." },
        { w: "witness", pos: "n, v", ipa: "/ˈwɪtnəs/", vi: "nhân chứng; chứng kiến", ex: "Two witnesses saw the man leave the shop.", exVi: "Hai nhân chứng thấy người đàn ông rời cửa hàng.", more: "**a witness to** + sự việc · **witness a crime**." },
        { w: "guilty", pos: "adj", ipa: "/ˈɡɪlti/", vi: "có tội", ex: "He was found guilty of theft.", exVi: "Anh ta bị kết luận có tội trộm cắp.", more: "**be found guilty of** + tội · **plead guilty** (nhận tội). Danh từ: **guilt**." },
        { w: "innocent", pos: "adj", ipa: "/ˈɪnəsnt/", vi: "vô tội", ex: "Everyone is innocent until proven guilty.", exVi: "Ai cũng vô tội cho tới khi bị chứng minh là có tội.", more: "**innocent of** + tội. Danh từ: **innocence**. = **not guilty** (lời tuyên của toà)." },
        { w: "convict", pos: "v", ipa: "/kənˈvɪkt/", vi: "kết án, kết tội", ex: "She was convicted of fraud in 2019.", exVi: "Bà ta bị kết tội lừa đảo năm 2019.", more: "**be convicted of** + tội. Danh từ: **conviction**; **a convict** /ˈkɒnvɪkt/ = người tù (nhấn âm đầu)." },
        { w: "sentence", pos: "n, v", ipa: "/ˈsentəns/", vi: "bản án, mức án; tuyên án", ex: "He was sentenced to five years in prison.", exVi: "Hắn bị tuyên năm năm tù.", more: "**be sentenced to** + thời gian / hình phạt · **serve a sentence** (chấp hành án) · **a life sentence** · **a prison sentence**." },
      ],
    },

    { t: "h", text: "3. Hình phạt và phòng ngừa — 17 từ" },
    {
      t: "vocab",
      items: [
        { w: "punishment", pos: "n", ipa: "/ˈpʌnɪʃmənt/", vi: "hình phạt, sự trừng phạt", ex: "The punishment should fit the crime.", exVi: "Hình phạt nên tương xứng với tội.", more: "**a harsh / severe / lenient punishment** · động từ: **punish sb for** + V-ing." },
        { w: "penalty", pos: "n", ipa: "/ˈpenəlti/", vi: "hình phạt, mức phạt (theo luật định)", ex: "The maximum penalty is ten years in prison.", exVi: "Mức phạt tối đa là mười năm tù.", more: "**a heavy / stiff penalty** · **the death penalty** (án tử hình) = **capital punishment**." },
        { w: "fine", pos: "n, v", ipa: "/faɪn/", vi: "tiền phạt; phạt tiền", ex: "Drivers who speed have to pay a fine.", exVi: "Tài xế chạy quá tốc độ phải nộp tiền phạt.", more: "**pay a fine** · **be fined** + số tiền + **for** + V-ing: He **was fined £200 for** speeding." },
        { w: "imprisonment", pos: "n", ipa: "/ɪmˈprɪznmənt/", vi: "sự bỏ tù, án tù", ex: "The crime is punished by up to two years' imprisonment.", exVi: "Tội này bị phạt tới hai năm tù.", more: "Họ từ: **prison** (n) → **prisoner** (tù nhân) → **imprison** (v) → **imprisonment** (n). **life imprisonment** = tù chung thân." },
        { w: "community service", pos: "n", ipa: "/kəˌmjuːnəti ˈsɜːvɪs/", vi: "lao động công ích", ex: "He was given 100 hours of community service.", exVi: "Anh ta nhận 100 giờ lao động công ích.", more: "**do community service** — hình phạt thay thế án tù cho **minor offences**." },
        { w: "probation", pos: "n", ipa: "/prəˈbeɪʃn/", vi: "án treo có giám sát, quản chế", ex: "She was put on probation for a year.", exVi: "Cô ấy bị quản chế một năm.", more: "**be on probation** · **a probation officer** (cán bộ quản chế)." },
        { w: "capital punishment", pos: "n", ipa: "/ˌkæpɪtl ˈpʌnɪʃmənt/", vi: "án tử hình", ex: "Many countries have abolished capital punishment.", exVi: "Nhiều nước đã bãi bỏ án tử hình.", more: "= **the death penalty**. **abolish** (bãi bỏ) ↔ **bring back / reintroduce**." },
        { w: "deterrent", pos: "n", ipa: "/dɪˈterənt/", vi: "biện pháp răn đe", ex: "Long sentences act as a deterrent to others.", exVi: "Án dài có tác dụng răn đe người khác.", more: "**act / serve as a deterrent (to)** · động từ: **deter sb from** + V-ing · tính từ: **a deterrent effect**." },
        { w: "rehabilitation", pos: "n", ipa: "/ˌriːəˌbɪlɪˈteɪʃn/", vi: "sự cải tạo, phục hồi (để tái hoà nhập)", ex: "Prisons should focus on rehabilitation, not just punishment.", exVi: "Nhà tù nên tập trung vào cải tạo chứ không chỉ trừng phạt.", more: "Động từ: **rehabilitate offenders** · **a rehabilitation programme**. Đi cùng: **reintegrate into society** (tái hoà nhập xã hội)." },
        { w: "reoffend", pos: "v", ipa: "/ˌriːəˈfend/", vi: "tái phạm", ex: "Many prisoners reoffend within a year of their release.", exVi: "Nhiều tù nhân tái phạm trong vòng một năm sau khi ra tù.", more: "**the reoffending rate** (tỉ lệ tái phạm). Người: **a repeat offender**." },
        { w: "crime rate", pos: "n", ipa: "/ˈkraɪm reɪt/", vi: "tỉ lệ tội phạm", ex: "The crime rate has fallen for five years in a row.", exVi: "Tỉ lệ tội phạm đã giảm năm năm liên tiếp.", more: "Luôn **the** crime rate (Ngày 3). **a high / low / rising / falling crime rate**." },
        { w: "surveillance", pos: "n", ipa: "/sɜːˈveɪləns/", vi: "sự giám sát (bằng camera…)", ex: "Surveillance cameras have been installed in the car park.", exVi: "Camera giám sát đã được lắp ở bãi xe.", more: "**surveillance cameras** = **CCTV** · **under surveillance**. Đi cùng **crime prevention** (phòng chống tội phạm)." },
        { w: "law-abiding", pos: "adj", ipa: "/ˈlɔː əbaɪdɪŋ/", vi: "tuân thủ pháp luật", ex: "Most people are law-abiding citizens.", exVi: "Hầu hết mọi người là công dân tuân thủ pháp luật.", more: "**a law-abiding citizen** — cụm cố định, hay dùng ở câu kết Task 2." },
        { w: "release", pos: "v, n", ipa: "/rɪˈliːs/", vi: "thả, phóng thích", ex: "He was released from prison after four years.", exVi: "Anh ta được ra tù sau bốn năm.", more: "**be released from prison** · **on release** (khi ra tù) · **early release** (ra tù trước hạn)." },
        { w: "harsh", pos: "adj", ipa: "/hɑːʃ/", vi: "(hình phạt) nặng, khắc nghiệt", ex: "Some people call for harsher punishments.", exVi: "Một số người kêu gọi hình phạt nặng hơn.", more: "= **severe**, **tough**. **be tough on crime** (mạnh tay với tội phạm)." },
        { w: "lenient", pos: "adj", ipa: "/ˈliːniənt/", vi: "(hình phạt) nhẹ, khoan hồng", ex: "Critics said the sentence was too lenient.", exVi: "Người phê bình nói bản án quá nhẹ.", more: "↔ **harsh / severe**. Danh từ: **leniency**. Cặp trái nghĩa này dùng được ở mọi đề về hình phạt." },
        { w: "prevention", pos: "n", ipa: "/prɪˈvenʃn/", vi: "sự phòng ngừa", ex: "Crime prevention is cheaper than punishment.", exVi: "Phòng ngừa tội phạm rẻ hơn trừng phạt.", more: "Động từ: **prevent sb from** + V-ing · **Prevention is better than cure.** (phòng hơn chữa)." },
      ],
    },

    { t: "h", text: "4. Sáu cặp dễ nhầm" },
    {
      t: "table",
      head: ["Cặp từ", "Khác nhau", "Ví dụ đúng", "Hay sai thành"],
      rows: [
        ["**steal** ↔ **rob**", "**steal + vật** (lấy cái gì) · **rob + người / nơi** (cướp của ai, ở đâu)", "Someone **stole my phone**. · Two men **robbed the bank**.", "~~Someone robbed my phone.~~"],
        ["**crime** ↔ **criminal**", "crime = **việc** · criminal = **người** (hoặc tính từ)", "**Crime** is rising. · **Criminals** should be punished.", "~~Crimes should be put in prison.~~"],
        ["**thief** ↔ **robber** ↔ **burglar**", "thief: lấy lén · robber: dùng vũ lực / đe doạ · burglar: **đột nhập nhà**", "A **burglar** broke into our house while we were away.", "Dùng thief cho mọi trường hợp (không sai nhưng thiếu chính xác)."],
        ["**judge** ↔ **jury**", "judge: một người, quyết **mức án** · jury: nhóm công dân, quyết **có tội hay không**", "The **jury** found him guilty and the **judge** sentenced him to six years.", "~~The jury sentenced him.~~"],
        ["**fine** ↔ **sentence**", "fine = phạt **tiền** · sentence = **án** (thường là tù)", "He got a £500 **fine**. · He got a five-year **sentence**.", "~~He was sentenced £500.~~"],
        ["**prison** ↔ **jail**", "Gần như nhau; **prison** trang trọng hơn → dùng trong Writing. Mỹ: jail = tạm giam ngắn hạn.", "**go to prison** · **be sent to prison** · **in prison** (Ø)", "~~go to the prison~~ (khi nói bị đi tù)"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "~~do / make a crime~~ → **commit a crime** / **commit an offence**. Động từ đi với crime là **commit**.",
        "~~He was arrested because steal a car.~~ → He was arrested **for stealing** a car. — arrest / punish / fine sb **for + V-ing**.",
        "~~charged for murder~~ → **charged with** murder · ~~accused for~~ → **accused of** · ~~convicted for~~ → **convicted of** · ~~sentenced for five years~~ → **sentenced to** five years.",
        "~~The criminals rate~~ → **the crime rate**. ~~Crimes rate is increase.~~ → **The crime rate is increasing.**",
        "~~put him to prison~~ → **send him to prison** / **put him in prison**.",
      ],
    },
    {
      t: "rule",
      formula: "steal + vật · rob + người / nơi · arrest sb for · charge sb with · accuse sb of · convict sb of · sentence sb to",
      vi: "Năm động từ pháp lý, bốn giới từ (of dùng cho cả accuse lẫn convict) — thuộc theo cặp, đừng đoán.",
    },

    { t: "h", text: "5. Mười bốn cụm ăn điểm (collocation)" },
    {
      t: "table",
      head: ["Cụm", "Nghĩa", "Câu mẫu dùng được trong Task 2 / Part 3"],
      rows: [
        ["**commit a crime / an offence**", "phạm tội", "People who **commit serious crimes** should lose their freedom."],
        ["**break the law** ↔ **obey the law**", "phạm luật ↔ tuân thủ luật", "Most young people who **break the law** do so only once."],
        ["**tackle / reduce / combat crime**", "giải quyết / giảm / chống tội phạm", "Better street lighting is a cheap way to **tackle crime**."],
        ["**be sentenced to** + thời gian", "bị tuyên án…", "He **was sentenced to** three years in prison for fraud."],
        ["**serve a (prison) sentence**", "chấp hành án (tù)", "After **serving their sentences**, many offenders cannot find work."],
        ["**act as a deterrent**", "có tác dụng răn đe", "Heavy fines **act as a deterrent** to dangerous driving."],
        ["**a harsh / lenient punishment**", "hình phạt nặng / nhẹ", "A **lenient punishment** may encourage others to offend."],
        ["**a repeat offender**", "người tái phạm nhiều lần", "Longer sentences are justified for **repeat offenders**."],
        ["**the reoffending rate**", "tỉ lệ tái phạm", "Education in prison lowers **the reoffending rate**."],
        ["**be released from prison**", "được ra tù", "Prisoners need support when they **are released from prison**."],
        ["**reintegrate into society**", "tái hoà nhập xã hội", "Job training helps offenders **reintegrate into society**."],
        ["**the root causes of crime**", "nguyên nhân gốc rễ của tội phạm", "Poverty and unemployment are among **the root causes of crime**."],
        ["**have a criminal record**", "có tiền án", "Employers are often unwilling to hire people who **have a criminal record**."],
        ["**turn to crime**", "sa vào con đường phạm tội", "Teenagers with nothing to do are more likely to **turn to crime**."],
      ],
    },
    {
      t: "table",
      caption: "Họ từ — đổi loại từ để paraphrase (phép P3 của Ngày 3)",
      head: ["Động từ", "Danh từ (việc)", "Danh từ (người)", "Tính từ"],
      rows: [
        ["—", "crime", "criminal", "criminal"],
        ["offend · reoffend", "offence", "offender", "offensive (xúc phạm — nghĩa khác)"],
        ["punish", "punishment", "—", "punishable (by)"],
        ["imprison", "imprisonment · prison", "prisoner", "—"],
        ["deter", "deterrent · deterrence", "—", "deterrent"],
        ["rehabilitate", "rehabilitation", "—", "—"],
        ["convict", "conviction", "convict", "convicted"],
        ["prevent", "prevention", "—", "preventive · preventable"],
        ["legalise · legislate", "legality · legislation", "legislator", "legal ↔ illegal"],
        ["steal · rob · burgle", "theft · robbery · burglary", "thief · robber · burglar", "stolen"],
      ],
    },

    { t: "h", text: "6. Dùng vào bài thi — khung lập luận “nhà tù hay cải tạo”" },
    {
      t: "p",
      text: "Phần lớn đề Task 2 về tội phạm xoay quanh một câu hỏi: **phạt nặng (nhà tù) hay giáo dục, cải tạo?** Thuộc hai cột ý dưới đây là bạn có nguyên liệu cho đề Opinion, Discussion và cả Problem–Solution. Part 3 cũng hỏi đúng những ý này.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai phía của cùng một đề",
      cols: [
        {
          title: "**Ủng hộ án tù dài**",
          items: [
            "Long sentences **act as a deterrent** — people think twice before **breaking the law**.",
            "Prison **protects the public**: a dangerous **offender** cannot **commit further crimes** while inside.",
            "**Victims** and their families feel that **justice has been done**.",
            "**Repeat offenders** have already been given a chance.",
          ],
        },
        {
          title: "**Ủng hộ cải tạo, hình phạt thay thế**",
          items: [
            "Prison is **expensive** and often a **“school of crime”** — **the reoffending rate** stays high.",
            "**Rehabilitation** (education, job training) helps offenders **reintegrate into society**.",
            "**Community service** lets minor offenders repay society without losing their jobs.",
            "It tackles **the root causes of crime**: poverty, unemployment, lack of education.",
          ],
        },
      ],
      caption: "Lập trường band 6 an toàn: án tù cho tội bạo lực và người tái phạm; cải tạo và lao động công ích cho tội nhẹ, người phạm tội lần đầu.",
    },
    {
      t: "examples",
      items: [
        { en: "While prison is necessary for violent criminals, I believe that community service is a more effective punishment for minor offences.", vi: "Dù nhà tù là cần thiết với tội phạm bạo lực, tôi tin rằng lao động công ích là hình phạt hiệu quả hơn cho các tội nhẹ. (câu luận điểm Task 2)" },
        { en: "Offenders who learn a skill in prison are far less likely to reoffend after they are released.", vi: "Người phạm tội học được một nghề trong tù ít có khả năng tái phạm hơn nhiều sau khi được thả. (câu giải thích thân bài)" },
        { en: "I think the crime rate is fairly low where I live, although petty crime like bag snatching is still a problem.", vi: "Tôi nghĩ tỉ lệ tội phạm ở chỗ tôi khá thấp, dù tội vặt như giật túi vẫn còn là vấn đề. (Part 3)" },
        { en: "In my view, harsher punishments alone won't reduce cybercrime, because most fraudsters never expect to be caught.", vi: "Theo tôi, chỉ riêng hình phạt nặng hơn sẽ không làm giảm tội phạm mạng, vì phần lớn kẻ lừa đảo không bao giờ nghĩ mình sẽ bị bắt. (Part 3)" },
      ],
    },
    {
      t: "rule",
      formula: "While prison is necessary for + nhóm A, I believe that + hình phạt B + is more effective for + nhóm C.",
      vi: "Câu luận điểm có mức độ cho mọi đề Crime: chia theo loại tội (bạo lực ↔ tội nhẹ) hoặc loại người (tái phạm ↔ lần đầu).",
    },

    { t: "h", text: "7. Bài luyện" },
    {
      t: "mcq",
      id: "t3d4-tv-chon",
      title: "Chọn từ đúng (10 câu)",
      items: [
        { q: "Someone ___ my laptop while I was in the library.", options: ["robbed", "stole", "burgled", "arrested"], correct: 1, why: "**steal + vật**: stole my laptop. **rob** đi với người / nơi (rob a bank); **burgle** đi với ngôi nhà." },
        { q: "He was ___ to three years in prison.", options: ["sentenced", "fined", "charged", "accused"], correct: 0, why: "**be sentenced to** + thời gian. fined + số tiền; charged **with**; accused **of**." },
        { q: "People who ___ a crime for the first time should not always go to prison.", options: ["do", "make", "take", "commit"], correct: 3, why: "Động từ đi với crime là **commit**: commit a crime." },
        { q: "The ___ decided that the woman was not guilty.", options: ["witness", "suspect", "jury", "victim"], correct: 2, why: "**jury** (bồi thẩm đoàn) quyết định có tội hay không. witness = nhân chứng; suspect = nghi phạm; victim = nạn nhân." },
        { q: "Long prison sentences are supposed to act as a ___.", options: ["deterrent", "probation", "release", "legislation"], correct: 0, why: "**act as a deterrent** = có tác dụng răn đe." },
        { q: "She was charged ___ fraud after the company collapsed.", options: ["for", "of", "to", "with"], correct: 3, why: "**charge sb with** + tội. (accuse / convict sb **of**; arrest sb **for**; sentence sb **to**.)" },
        { q: "A ___ broke into the house and took all the jewellery.", options: ["shoplifter", "burglar", "vandal", "fraudster"], correct: 1, why: "Đột nhập vào nhà để trộm = **burglar**. shoplifter: trộm trong cửa hàng; vandal: phá hoại; fraudster: lừa đảo." },
        { q: "The main aim of ___ is to help offenders return to normal life.", options: ["surveillance", "vandalism", "rehabilitation", "capital punishment"], correct: 2, why: "**rehabilitation** = cải tạo, giúp tái hoà nhập." },
        { q: "Many people felt that a £100 fine was far too ___ for such a serious offence.", options: ["harsh", "lenient", "illegal", "guilty"], correct: 1, why: "Phạt 100 bảng cho tội nặng là **quá nhẹ** → **lenient**. harsh = nặng (ngược nghĩa)." },
        { q: "After they are ___ from prison, many offenders struggle to find a job.", options: ["convicted", "arrested", "sentenced", "released"], correct: 3, why: "**be released from prison** = được ra tù." },
      ],
    },
    {
      t: "quiz",
      id: "t3d4-tv-dien",
      title: "Điền MỘT từ để hoàn thành cụm (8 câu)",
      kind: "fill",
      items: [
        { q: "Poverty is one of the root ___ of crime.", answers: ["causes"], hint: "nguyên nhân gốc rễ" },
        { q: "Teenagers with no job and no hope may turn ___ crime.", answers: ["to"], hint: "sa vào" },
        { q: "He has already ___ half of his ten-year sentence.", answers: ["served"], hint: "chấp hành án" },
        { q: "It is hard to get a job if you have a criminal ___.", answers: ["record"], hint: "tiền án" },
        { q: "Training programmes help former prisoners reintegrate ___ society.", answers: ["into"], hint: "giới từ" },
        { q: "The reoffending ___ is lower among prisoners who study.", answers: ["rate"], hint: "tỉ lệ" },
        { q: "Drivers who ___ the law should lose their licence.", answers: ["break"], hint: "phạm luật" },
        { q: "She was found ___ of stealing from her employer and fined £2,000.", answers: ["guilty"], hint: "có tội" },
      ],
    },
    {
      t: "quiz",
      id: "t3d4-tv-dich",
      title: "Dịch Việt → Anh (5 câu)",
      kind: "translate",
      grammar: "commit a crime · be sentenced to + thời gian · act as a deterrent · the crime rate · be arrested for + V-ing · reoffend.",
      items: [
        { q: "Hắn bị tuyên án hai năm tù.", hint: "was sentenced to, two years, in prison", answers: ["He was sentenced to two years in prison.", "He was sentenced to two years' imprisonment.", "He was sentenced to two years in jail.", "He was given a two-year prison sentence.", "He was sentenced to two years of imprisonment."] },
        { q: "Tỉ lệ tội phạm đã giảm trong năm năm qua.", hint: "The crime rate, has fallen / decreased, over / in the last five years", answers: ["The crime rate has fallen over the last five years.", "The crime rate has fallen in the last five years.", "The crime rate has decreased over the last five years.", "The crime rate has fallen over the past five years.", "The crime rate has decreased in the last five years.", "The crime rate has dropped over the last five years.", "The crime rate has fallen in the past five years.", "The crime rate has declined over the last five years.", "The crime rate has decreased over the past five years."] },
        { q: "Án tù dài có tác dụng răn đe.", hint: "Long prison sentences, act as a deterrent", answers: ["Long prison sentences act as a deterrent.", "Long sentences act as a deterrent.", "Long prison sentences serve as a deterrent.", "Long jail sentences act as a deterrent."] },
        { q: "Cô ấy bị bắt vì ăn cắp một chiếc điện thoại.", hint: "was arrested for, stealing, a phone", answers: ["She was arrested for stealing a phone.", "She was arrested for stealing a mobile phone.", "She was arrested for stealing a cell phone.", "She was arrested for the theft of a phone."] },
        { q: "Nhiều tù nhân tái phạm sau khi được thả.", hint: "Many prisoners, reoffend, after they are released / after being released", answers: ["Many prisoners reoffend after they are released.", "Many prisoners reoffend after being released.", "Many prisoners reoffend after release.", "Many prisoners reoffend after they are released from prison.", "Many prisoners reoffend after being released from prison.", "Many prisoners reoffend when they are released."] },
      ],
    },

    { t: "h", text: "8. Thêm: phát âm /θ/ · /ð/ · /dʒ/ trong từ pháp luật" },
    {
      t: "table",
      head: ["Âm", "Cách đọc", "Lỗi người Việt", "Từ hôm nay"],
      rows: [
        ["/θ/", "Đầu lưỡi **giữa hai hàm răng**, thổi hơi, **không rung**", "đọc thành “th” tiếng Việt (/tʰ/) hoặc /t/, /s/: theft → “thép”", "**th**eft · **th**ief · dea**th** · you**th** · au**th**orities"],
        ["/ð/", "Như /θ/ nhưng **rung** cổ", "đọc thành /d/ hoặc /z/: the → “đờ”", "**th**e · al**th**ough · **th**erefore · ra**th**er **th**an"],
        ["/dʒ/", "Bật mạnh, **rung**, môi hơi tròn", "đọc thành “gi / ch” nhẹ, mất âm cuối: judge → “giất”", "**j**u**dg**e · **j**ury · **j**uvenile · le**g**islation · char**ge**"],
      ],
    },
    {
      t: "phatam",
      id: "t3d4-phat-am",
      title: "Luyện phát âm — /θ/ · /ð/ · /dʒ/",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. /θ/ và /ð/: đưa đầu lưỡi ra giữa hai hàm răng (soi gương phải thấy lưỡi). judge có HAI âm /dʒ/ — đầu và cuối, đừng bỏ âm cuối.",
      items: [
        { text: "theft, thief, death, youth", ipa: "θeft θiːf deθ juːθ", vi: "/θ/ đầu và cuối từ" },
        { text: "judge, jury, juvenile, legislation", ipa: "dʒʌdʒ dʒʊəri dʒuːvənaɪl ledʒɪsleɪʃn", vi: "/dʒ/" },
        { text: "although, therefore, rather than", ipa: "ɔːlðəʊ ðeəfɔː rɑːðə ðən", vi: "/ð/ — rung cổ" },
        { text: "burglary, robbery, vandalism", ipa: "bɜːɡləri rɒbəri vændəlɪzəm", vi: "trọng âm ở âm tiết đầu" },
        { text: "The thief was sentenced to three months in prison.", ipa: "ðə θiːf wəz sentənst tə θriː mʌnθs ɪn prɪzn", vi: "the /ð/ · thief, three, months /θ/" },
        { text: "The judge thought the punishment was too lenient.", ipa: "ðə dʒʌdʒ θɔːt ðə pʌnɪʃmənt wəz tuː liːniənt", vi: "judge /dʒ/ · thought /θ/" },
        { text: "Both the death penalty and life imprisonment are harsh.", ipa: "bəʊθ ðə deθ penəlti ən laɪf ɪmprɪznmənt ə hɑːʃ", vi: "both, death /θ/ · the /ð/" },
        { text: "Rehabilitation, rather than prison, reduces juvenile crime.", ipa: "riːəbɪlɪteɪʃn rɑːðə ðən prɪzn rɪdjuːsɪz dʒuːvənaɪl kraɪm", vi: "rather than /ð/ · juvenile /dʒ/" },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Writing ─────────────────────────── */

const T3D4_WRITING: Lesson = {
  id: "t3d4-viet",
  kind: "writing",
  title: "Writing Task 1 band 6 — overview chọn 2 điểm, nhóm số liệu",
  goal: "Viết được overview band 6 cho cả hình có thời gian lẫn hình không có thời gian bằng cách chọn đúng 2 điểm nổi bật nhất, và chia thân bài theo NHÓM số liệu (không kể lần lượt từng năm, từng cột) — khác biệt lớn nhất giữa bài Task 1 band 5 và band 6.",
  minutes: 80,
  blocks: [
    {
      t: "recap",
      title: "Bài này đẩy band nào, tiêu chí nào",
      items: [
        "Đẩy **Task Achievement (TA)** của Task 1 từ 5 lên 6. Theo bảng mô tả band công khai: band 5 “kể chi tiết **máy móc**, **không có overview rõ**”; band 6 “**có overview**, thông tin được **chọn lọc** hợp lý”. Hai việc đó là hai nửa của bài hôm nay.",
        "**Overview = 2 điểm** nhìn thấy khi “lùi ra xa” khỏi hình: ==không số · không lý do · nói về CẢ hình==. Tập 2 Ngày 4 đã dạy khung 2 câu; hôm nay học cách **chọn** 2 điểm bằng 4 câu hỏi.",
        "**Nhóm số liệu**: thân bài chia theo **câu chuyện** (nhóm cùng giảm / nhóm đi ngược; nhóm cao / nhóm thấp), không chia theo thứ tự chú thích hay theo từng năm.",
        "**Chọn số**: mỗi đường / mỗi nhóm chỉ cần **điểm đầu – điểm cuối – đỉnh, đáy hoặc chỗ cắt nhau**. Không chép mọi con số.",
        "Có **bài band 5 và bài band 6 cho cùng một đề**, kèm bảng chỉ chỗ khác theo 4 tiêu chí (TA · CC · LR · GRA).",
      ],
    },
    {
      t: "p",
      text: "Số liệu hôm nay nối với bài Từ vựng: đều về **tội phạm** (burglary, vehicle theft, online fraud, shoplifting). Mọi con số là **tự đặt cho bài luyện**.",
    },

    { t: "h", text: "1. Task 1: band 5 và band 6 khác nhau ở đâu" },
    {
      t: "table",
      head: ["Tiêu chí", "Band 5", "Band 6", "Hôm nay luyện"],
      rows: [
        ["**TA** — trả lời đề", "Kể số liệu lần lượt, máy móc; **không có overview rõ**; có số sai hoặc thiếu.", "**Có overview**; chọn được điểm chính; số liệu đúng, có **so sánh**.", "Mục 2, 3"],
        ["**CC** — mạch lạc", "Có chia đoạn nhưng theo thứ tự năm / thứ tự chú thích; lặp một kiểu nối.", "Chia đoạn **theo nhóm có lý do**; có từ nối so sánh – đối lập; có referencing (both figures, the latter).", "Mục 3"],
        ["**LR** — từ vựng", "Lặp increase / decrease / was; gọi sai tên số liệu.", "Xoay vòng: fell, declined, climbed, overtook, remained stable; gọi đúng: the figure for, cases per 1,000 people.", "Mục 4"],
        ["**GRA** — ngữ pháp", "Câu đơn lặp cấu trúc; lỗi thì, lỗi nối câu bằng dấu phẩy.", "Trộn câu đơn – phức: whereas, while, when, V-ing; lỗi ít, không làm sai nghĩa.", "Mục 4"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — không có overview thì TA khó vượt band 5",
      items: [
        "Giám khảo tìm overview **đầu tiên**. Bài tả số rất kỹ mà không có overview vẫn bị giữ ở **band 5 cho TA**.",
        "Overview **không phải kết luận**: không ý kiến, không lý do, không dự đoán ngoài hình.",
        "Đặt overview **ngay sau mở bài** (đoạn 2). Để cuối bài cũng được chấm, nhưng hết giờ là mất.",
      ],
    },

    { t: "h", text: "2. Chọn 2 điểm cho overview — bốn câu hỏi “lùi ra xa”" },
    {
      t: "p",
      text: "Che hết con số, chỉ nhìn **hình dáng**. Hỏi lần lượt bốn câu dưới đây. Thường có 2–3 câu cho ra câu trả lời rõ — lấy **2 câu rõ nhất** làm overview.",
    },
    {
      t: "table",
      caption: "Bốn câu hỏi săn điểm nổi bật",
      head: ["Câu hỏi", "Hình CÓ thời gian (động)", "Hình KHÔNG thời gian (tĩnh)"],
      rows: [
        ["**Q1 — Chiều chung?**", "Phần lớn các đường đi **lên, xuống hay đứng yên**? Có nhóm đi ngược nhau không?", "Số liệu **tăng dần / giảm dần** theo trục hạng mục (tuổi, thu nhập…) không?"],
        ["**Q2 — Ai nhất?**", "Hạng mục nào **cao nhất / thấp nhất** suốt giai đoạn?", "Hạng mục nào **lớn nhất / nhỏ nhất**?"],
        ["**Q3 — Có đổi ngôi?**", "Thứ hạng **đầu và cuối** giai đoạn có khác không? Đường nào **vượt** đường nào?", "Thứ hạng của hai chuỗi có **đảo** giữa các nhóm không (nhóm trẻ A > B, nhóm già B > A)?"],
        ["**Q4 — Có ngoại lệ?**", "Có đường nào **gần như không đổi** trong khi các đường khác đổi mạnh?", "Có nhóm nào **khác hẳn** phần còn lại?"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Từ hình tới overview — 3 phút",
      steps: [
        { label: "① Che số, nhìn hình dáng", sub: "Hình có trục thời gian không? Bao nhiêu hạng mục?" },
        { label: "② Trả lời Q1–Q4 bằng gạch đầu dòng", sub: "Viết nháp bằng tiếng Việt cũng được, mỗi câu 3–5 chữ." },
        { label: "③ Chọn 2 điểm rõ nhất", sub: "Ưu tiên: Q1 (chiều chung) + Q3 (đổi ngôi) hoặc Q2 (ai nhất)." },
        { label: "④ Viết 2 câu, không số", sub: "Overall, … whereas … . As a result / In addition, …" },
      ],
      caption: "Thử nhanh: nếu người đọc CHỈ đọc overview, họ có hình dung được hình không? Có → overview đạt.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Overall, A and B + V (giảm), whereas C + V (tăng).",
          vi: "Hình động — Q1: hai nhóm đi ngược chiều nhau.",
          examples: [{ en: "Overall, burglary and vehicle theft became far less common, whereas online fraud rose dramatically.", vi: "Nhìn chung, đột nhập trộm cắp và trộm xe trở nên ít hơn hẳn, trong khi lừa đảo trực tuyến tăng rất mạnh." }],
        },
        {
          formula: "As a result, C went from being the least… to the most… , while D hardly changed.",
          vi: "Hình động — Q3 (đổi ngôi) + Q4 (ngoại lệ) gộp trong một câu.",
          examples: [{ en: "As a result, online fraud went from being the rarest of the four offences to by far the most frequent, while shoplifting hardly changed.", vi: "Kết quả là lừa đảo trực tuyến đi từ chỗ hiếm nhất trong bốn tội thành tội phổ biến nhất, cách biệt rõ, còn trộm hàng trong cửa hiệu hầu như không đổi." }],
        },
        {
          formula: "Overall, + N + increased with age / was higher among + nhóm, but the rise was much steeper for A.",
          vi: "Hình tĩnh — Q1: số liệu tăng dần theo trục hạng mục.",
          examples: [{ en: "Overall, concern about both crimes increased with age, but the rise was much steeper for online fraud.", vi: "Nhìn chung, nỗi lo về cả hai tội tăng theo tuổi, nhưng mức tăng dốc hơn nhiều ở lừa đảo trực tuyến." }],
        },
        {
          formula: "Consequently, A was the greater… for + nhóm 1, whereas B was the main… in + nhóm 2.",
          vi: "Hình tĩnh — Q3: thứ hạng hai chuỗi đảo nhau giữa các nhóm.",
          examples: [{ en: "Consequently, burglary was the greater worry for adults under 35, whereas fraud was the main concern in every older group.", vi: "Do đó, đột nhập trộm cắp là mối lo lớn hơn với người dưới 35 tuổi, còn lừa đảo là mối lo chính ở mọi nhóm lớn tuổi hơn." }],
        },
        {
          formula: "It is clear that A accounted for the largest share of…, while B made up the smallest.",
          vi: "Hình tĩnh — Q2: ai lớn nhất, ai nhỏ nhất (tròn, cột, bảng).",
          examples: [{ en: "It is clear that fines accounted for the largest share of sentences, while probation made up the smallest.", vi: "Rõ ràng phạt tiền chiếm phần lớn nhất trong các bản án, còn quản chế chiếm phần nhỏ nhất." }],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở overview",
      items: [
        "**Chỉ có một điểm**: ~~Overall, online fraud increased.~~ — mới nói một đường; ba đường còn lại đâu?",
        "**Có số**: ~~Overall, burglary fell from 18 to 6.~~ — số để dành cho thân bài. Được dùng từ chỉ mức độ: dramatically, slightly, by far, roughly.",
        "**Có lý do**: ~~…because more people use the internet.~~ — hình không cho biết nguyên nhân. Task 1 chỉ mô tả.",
        "**Chép lại mở bài**: ~~Overall, the graph shows four types of crime.~~ — đó là nội dung của hình, chưa phải điểm nổi bật.",
        "**Liệt kê cả bốn đường** thành bốn mệnh đề dài dòng. Gộp nhóm bằng một cái tên chung rồi dùng **một** động từ: “two traditional property crimes, burglary and vehicle theft, became far less common”.",
      ],
    },
    {
      t: "rule",
      formula: "Overall, + [Q1 chiều chung của các nhóm], whereas… + As a result / In addition, + [Q2 / Q3 / Q4: ai nhất · đổi ngôi · ngoại lệ].",
      vi: "Overview band 6 = 2 điểm chọn từ 4 câu hỏi; không số, không lý do, nói về cả hình.",
    },
    {
      t: "quiz",
      id: "t3d4-viet-overview-dich",
      title: "Dịch — câu overview (4 câu)",
      kind: "translate",
      grammar: "Overall, A + V, whereas B + V · went from being the least… to the most… · increased with age · accounted for the largest share of.",
      items: [
        { q: "Nhìn chung, trộm xe giảm, trong khi lừa đảo trực tuyến tăng mạnh.", hint: "Overall, vehicle theft, fell / declined, whereas / while, online fraud, rose sharply / dramatically", answers: ["Overall, vehicle theft fell, whereas online fraud rose sharply.", "Overall, vehicle theft fell, while online fraud rose sharply.", "Overall, vehicle theft declined, whereas online fraud rose sharply.", "Overall, vehicle theft fell, whereas online fraud rose dramatically.", "Overall, vehicle theft fell, while online fraud rose dramatically.", "Overall, vehicle theft decreased, whereas online fraud increased sharply.", "Overall, vehicle theft decreased, while online fraud increased sharply.", "Overall, vehicle theft declined, while online fraud rose sharply.", "Overall, vehicle theft fell while online fraud rose sharply.", "Overall, vehicle theft fell, whereas online fraud increased sharply."] },
        { q: "Lừa đảo trực tuyến đi từ chỗ là tội ít phổ biến nhất thành tội phổ biến nhất.", hint: "Online fraud, went from being, the least common crime, to the most common", answers: ["Online fraud went from being the least common crime to the most common.", "Online fraud went from being the least common crime to the most common one.", "Online fraud went from being the least common offence to the most common.", "Online fraud went from being the least common crime to being the most common.", "Online fraud went from the least common crime to the most common.", "Online fraud went from being the least common to the most common crime."] },
        { q: "Nỗi lo về lừa đảo tăng theo tuổi.", hint: "Concern about fraud, increased / rose, with age", answers: ["Concern about fraud increased with age.", "Concern about fraud rose with age.", "Worry about fraud increased with age.", "Concern about fraud grew with age.", "Concerns about fraud increased with age."] },
        { q: "Phạt tiền chiếm phần lớn nhất trong các bản án.", hint: "Fines, accounted for, the largest share / proportion, of sentences", answers: ["Fines accounted for the largest share of sentences.", "Fines accounted for the largest proportion of sentences.", "Fines made up the largest share of sentences.", "Fines made up the largest proportion of sentences.", "Fines accounted for the largest share of the sentences.", "Fines accounted for the biggest share of sentences."] },
      ],
    },

    { t: "h", text: "3. Nhóm số liệu — ba cách chia thân bài" },
    {
      t: "p",
      text: "Ở **Tập 2 Ngày 4** bạn đã học bảng chia thân bài theo **số hạng mục** (2–3 hạng mục → chia theo giai đoạn; 4 → 2 + 2; 5 trở lên → gom tối đa 4 khối). Hôm nay học **gom theo tiêu chí nào**. Luật chung: hai thứ ở cùng một đoạn phải có **một điểm chung nói được thành lời**.",
    },
    {
      t: "table",
      caption: "Ba cách nhóm",
      head: ["Cách nhóm", "Dùng khi", "Ví dụ chia"],
      rows: [
        ["**① Theo chiều xu hướng**", "Hình động, các đường đi **khác chiều**.", "Body 1: các đường **giảm** · Body 2: đường **tăng** + đường **đứng yên**."],
        ["**② Theo độ lớn**", "Hình tĩnh hoặc các đường **cùng chiều** nhưng khác mức.", "Body 1: nhóm **cao** (trên 40 %) · Body 2: nhóm **thấp**."],
        ["**③ Theo điểm đổi ngôi**", "Có một mốc (năm / nhóm tuổi) mà **thứ hạng đảo**.", "Body 1: **trước** mốc (A > B) · Body 2: **từ** mốc trở đi (B > A)."],
      ],
    },
    {
      t: "table",
      caption: "Chọn số nào để viết — mỗi đường / mỗi nhóm tối đa 3 con số",
      head: ["Nên viết", "Bỏ qua", "Cách viết gọn"],
      rows: [
        ["**Điểm đầu** và **điểm cuối**", "Mọi số ở giữa nếu đường đi đều", "fell steadily from 18 to 6"],
        ["**Đỉnh / đáy** (nếu có)", "Dao động nhỏ 1–2 đơn vị", "fluctuating between 8 and 9"],
        ["**Chỗ cắt nhau / đổi ngôi**", "Năm chính xác nếu hình không cho", "overtook burglary before 2015"],
        ["**Một phép so sánh có tính toán**", "Phép trừ từng năm", "roughly a third of their original levels · more than three times the figure for…"],
        ["Hai số của hai hạng mục **cùng lúc**", "Hai câu rời nhau", "…stood at 6 and 5 **respectively**"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — ba kiểu “không nhóm” làm bài thành band 5",
      items: [
        "**Kể theo năm**: “In 2000… In 2005… In 2010…” — người đọc phải tự ghép lại xu hướng của từng đường.",
        "**Kể theo thứ tự chú thích**: mỗi đường một đoạn ngắn, không so sánh với đường nào.",
        "**Nhồi mọi con số**: hình có 20 số, bài viết đủ 20 số. Band 6 cần **chọn** (thường 8–10 số là đủ).",
      ],
    },
    {
      t: "rule",
      formula: "Body 1 = nhóm có chung đặc điểm X · Body 2 = nhóm còn lại · mỗi nhóm: đầu → cuối + đỉnh / đổi ngôi + 1 phép so sánh",
      vi: "Chia theo câu chuyện của số liệu, không theo thứ tự năm hay thứ tự chú thích.",
    },

    { t: "h", text: "4. Đề mẫu 1 (hình có thời gian) — bài band 5 và bài band 6" },
    {
      t: "p",
      text: "**Đề:** The line graph below shows the number of reported cases of four types of crime per 1,000 people in the town of Northdale between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    },
    {
      t: "figure",
      fig: {
        kind: "line",
        title: "Reported crimes per 1,000 people in Northdale, 2000–2020",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "cases per 1,000 people",
        categories: ["2000", "2005", "2010", "2015", "2020"],
        series: [
          { name: "Burglary", values: [18, 16, 12, 9, 6] },
          { name: "Vehicle theft", values: [14, 13, 9, 6, 5] },
          { name: "Online fraud", values: [1, 3, 8, 14, 21] },
          { name: "Shoplifting", values: [8, 9, 8, 9, 8] },
        ],
      },
    },
    {
      t: "table",
      caption: "Bước 1 — bốn câu hỏi (nháp 3 phút)",
      head: ["Câu hỏi", "Trả lời từ hình", "Dùng cho"],
      rows: [
        ["Q1 Chiều chung?", "Burglary + vehicle theft **giảm**; online fraud **tăng mạnh**.", "**Overview câu 1**"],
        ["Q2 Ai nhất?", "Đầu kỳ: burglary cao nhất. Cuối kỳ: online fraud cao nhất.", "(gộp vào Q3)"],
        ["Q3 Đổi ngôi?", "Online fraud từ **thấp nhất** (1) lên **cao nhất** (21); vượt burglary giữa 2010 và 2015.", "**Overview câu 2**"],
        ["Q4 Ngoại lệ?", "Shoplifting **gần như đứng yên** (8–9).", "**Overview câu 2** (vế sau)"],
        ["**Nhóm**", "Cách ① theo chiều: Body 1 = burglary + vehicle theft (cùng giảm) · Body 2 = online fraud (tăng) + shoplifting (phẳng).", "Thân bài"],
      ],
    },
    { t: "p", text: "**Bài A — khoảng band 5 (ước tính), 154 từ.** Đọc và thử tự tìm xem bài thiếu gì trước khi xem bảng so sánh." },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The line graph shows the number of crimes per 1,000 people in Northdale from 2000 to 2020. There are four types of crime: burglary, vehicle theft, online fraud and shoplifting.", vi: "[Mở bài] Chép gần nguyên đề; câu thứ hai chỉ đọc lại chú thích." },
        { en: "[Body 1] In 2000, burglary was 18 and vehicle theft was 14. Shoplifting was 8 and online fraud was 1. In 2005, burglary decreased to 16 and vehicle theft decreased to 13. Shoplifting increased to 9 and online fraud increased to 3. In 2010, burglary was 12, vehicle theft was 9, shoplifting was 8 and online fraud was 8.", vi: "[Thân bài 1] Kể theo NĂM, đủ mọi con số, không so sánh, không nhóm." },
        { en: "[Body 2] After that, in 2015 burglary continued to decrease to 9 and vehicle theft was 6. Online fraud increased to 14 and shoplifting was 9. In 2020, burglary was 6, vehicle theft was 5, shoplifting was 8 and online fraud was 21, it was the highest.", vi: "[Thân bài 2] Vẫn kể theo năm; “…was 21, it was the highest” là lỗi nối hai câu bằng dấu phẩy." },
        { en: "[Conclusion] In conclusion, online fraud increased a lot from 1 to 21 because more people use the internet, and the other crimes decreased.", vi: "[Kết] Overview đặt cuối, có SỐ, có LÝ DO ngoài hình; “the other crimes decreased” SAI — shoplifting không giảm." },
      ],
    },
    { t: "p", text: "**Bài B — khoảng band 6–6.5 (ước tính), 173 từ.** Cùng đề, cùng số liệu." },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The line graph compares how often four kinds of crime were reported per 1,000 residents in the town of Northdale between 2000 and 2020.", vi: "[Mở bài] Một câu, paraphrase đề: shows → compares · the number of reported cases → how often… were reported · people → residents." },
        { en: "[Overview] Overall, two traditional property crimes, burglary and vehicle theft, became far less common, whereas online fraud rose dramatically. As a result, online fraud went from being the rarest of the four offences to by far the most frequent, while shoplifting hardly changed.", vi: "[Tổng quan] Hai câu, không số: Q1 (hai nhóm ngược chiều) + Q3 (đổi ngôi) + Q4 (ngoại lệ)." },
        { en: "[Body 1] In 2000, burglary was the most common crime, at 18 cases per 1,000 people, followed by vehicle theft at 14. Both figures fell steadily over the next two decades, and by 2020 they stood at only 6 and 5 respectively, roughly a third of their original levels.", vi: "[Thân bài 1] Nhóm cùng giảm: điểm đầu → điểm cuối + một phép so sánh có tính toán (khoảng một phần ba)." },
        { en: "[Body 2] Online fraud showed the opposite trend. Starting at just 1 case per 1,000 people, it climbed to 8 in 2010 and then overtook burglary before 2015, when it reached 14. It continued to rise and finished the period at 21, more than three times the figure for burglary. Shoplifting, by contrast, remained stable, fluctuating between 8 and 9 cases throughout.", vi: "[Thân bài 2] Đường tăng: đầu → chỗ vượt → cuối + so sánh bội; rồi đường phẳng trong một câu." },
      ],
    },
    {
      t: "table",
      caption: "Bài A (band 5) và bài B (band 6) — khác nhau theo 4 tiêu chí",
      head: ["Tiêu chí", "Bài A — band 5", "Bài B — band 6", "Bài học"],
      rows: [
        ["**TA**", "Không có overview ở đầu; câu kết có số + lý do; **một thông tin sai** (shoplifting “decreased”); chép đủ 20 số, không so sánh.", "Overview 2 câu rõ, không số; chọn **10 số**; có so sánh (a third of, three times, the most common).", "Overview trước, số sau. Chọn số, đừng chép số."],
        ["**CC**", "Chia đoạn theo **năm**; chỉ nối bằng In 2005… In 2010… After that.", "Chia đoạn theo **nhóm xu hướng**; nối: whereas, as a result, by contrast; referencing: Both figures, they, it.", "Mỗi đoạn một nhóm có điểm chung."],
        ["**LR**", "was × 15 lần; increased / decreased lặp; “crimes” gọi chung mọi thứ.", "became far less common · fell steadily · climbed · overtook · remained stable · fluctuating · offences · cases · the figure for.", "Chuẩn bị 5 động từ xu hướng + 3 cách gọi số liệu."],
        ["**GRA**", "Gần như toàn câu đơn S + was + số; lỗi nối câu bằng dấu phẩy.", "Câu phức: whereas / while / when; cụm V-ing (Starting at…, fluctuating between…); respectively.", "Mỗi đoạn thân bài có ít nhất một câu phức."],
      ],
    },
    {
      t: "table",
      caption: "Soát số — mọi con số trong bài B khớp hình",
      head: ["Câu trong bài B", "Hình", "Khớp?"],
      rows: [
        ["burglary the most common in 2000, at 18 · vehicle theft at 14", "2000: 18 · 14 · 8 · 1", "✓"],
        ["by 2020 they stood at only 6 and 5 respectively", "2020: burglary 6 · vehicle theft 5", "✓"],
        ["roughly a third of their original levels", "6 ÷ 18 = 0,33 · 5 ÷ 14 = 0,36", "✓"],
        ["online fraud: 1 → 8 in 2010 → 14 in 2015 → 21", "1 · 3 · 8 · 14 · 21", "✓"],
        ["overtook burglary before 2015", "2010: 8 < 12 · 2015: 14 > 9", "✓"],
        ["more than three times the figure for burglary", "21 ÷ 6 = 3,5", "✓"],
        ["shoplifting fluctuating between 8 and 9", "8 · 9 · 8 · 9 · 8", "✓"],
        ["rarest of the four → by far the most frequent", "2000: fraud 1 thấp nhất · 2020: fraud 21, kế tiếp shoplifting 8", "✓"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: sửa bài A thành bài B trong 3 bước",
      items: [
        "**Bước 1** — xoá câu kết, viết overview 2 câu đặt sau mở bài (dùng khung mục 2).",
        "**Bước 2** — tô hai màu: các đường **cùng chiều** một màu. Mỗi màu thành một đoạn thân bài.",
        "**Bước 3** — trong mỗi đoạn, giữ lại **đầu – cuối – điểm đặc biệt**, gạch các số giữa; thêm **một** phép so sánh có tính toán.",
        "Đây là cách **viết lại** của Ngày 2 áp vào Task 1: không viết bài mới, mà nâng bài cũ.",
      ],
    },

    { t: "h", text: "5. Đề mẫu 2 (hình không thời gian) — tìm 2 điểm và chia nhóm" },
    {
      t: "p",
      text: "**Đề:** The bar chart below shows the percentage of adults in five age groups in one country who said they were worried about two types of crime in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    },
    {
      t: "figure",
      fig: {
        kind: "bar",
        title: "Adults worried about online fraud and burglary, by age group, 2023 (%)",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "%",
        categories: ["16–24", "25–34", "35–49", "50–64", "65+"],
        series: [
          { name: "Online fraud", values: [22, 31, 44, 58, 67] },
          { name: "Burglary", values: [35, 38, 41, 43, 47] },
        ],
      },
    },
    {
      t: "table",
      caption: "Bốn câu hỏi cho hình tĩnh",
      head: ["Câu hỏi", "Trả lời từ hình", "Dùng cho"],
      rows: [
        ["Q1 Chiều chung?", "Cả hai nỗi lo **tăng theo tuổi**; fraud tăng **dốc hơn nhiều** (22 → 67) so với burglary (35 → 47).", "**Overview câu 1**"],
        ["Q2 Ai nhất?", "Cao nhất: fraud ở nhóm 65+ (67 %). Thấp nhất: fraud ở nhóm 16–24 (22 %).", "Thân bài"],
        ["Q3 Đổi ngôi?", "Dưới 35 tuổi: burglary > fraud. Từ 35 tuổi: fraud > burglary.", "**Overview câu 2**"],
        ["Q4 Ngoại lệ?", "Không có nhóm nào đi ngược.", "—"],
        ["**Nhóm**", "Cách ③ theo điểm đổi ngôi: Body 1 = hai nhóm **dưới 35** · Body 2 = ba nhóm **từ 35**, khoảng cách nới dần (3 → 15 → 20 điểm).", "Thân bài"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Overview cho đề mẫu 2 — band 5 và band 6",
      cols: [
        {
          title: "**Band 5**",
          items: [
            "Overall, the oldest group has the highest percentage, 67%, and old people are worried because they do not understand technology.",
            "✗ Chỉ **một điểm** (ai cao nhất)",
            "✗ Có **số**",
            "✗ Có **lý do** ngoài hình",
            "✗ Sai thì (**has** — số liệu năm 2023 phải dùng quá khứ)",
          ],
        },
        {
          title: "**Band 6**",
          items: [
            "Overall, concern about both crimes increased with age, but the rise was much steeper for online fraud. Consequently, burglary was the greater worry for adults under 35, whereas fraud was the main concern in every older group.",
            "✓ **Hai điểm**: Q1 chiều chung + Q3 đổi ngôi",
            "✓ Không số, không lý do",
            "✓ Nói về **cả hình** (cả hai tội, mọi nhóm tuổi)",
            "✓ Quá khứ đơn; có so sánh (steeper, greater)",
          ],
        },
      ],
      caption: "Hình tĩnh vẫn có “xu hướng” — nhưng là xu hướng THEO HẠNG MỤC (tuổi tăng thì số tăng), không theo thời gian. Viết: increased with age, không viết increased over the period.",
    },
    {
      t: "mcq",
      id: "t3d4-viet-chon",
      title: "Chọn overview và cách nhóm tốt nhất (6 câu)",
      items: [
        {
          q: "Đề mẫu 1 (Northdale). Câu overview nào tốt nhất?",
          options: [
            "Overall, burglary fell from 18 to 6 cases, and online fraud rose from 1 to 21 cases.",
            "Overall, the graph gives information about four different types of crime in Northdale.",
            "Overall, burglary and vehicle theft declined markedly, while online fraud increased to become the most common offence.",
            "Overall, online fraud increased because people shop online more than before.",
          ],
          correct: 2,
          why: "C nêu **hai điểm** (nhóm giảm ↔ đường tăng; đổi ngôi) và **không có số**. (Thiếu shoplifting đứng yên vẫn chấp nhận được — overview chỉ cần 2 điểm nổi bật nhất.) A có số. B chỉ nhắc lại nội dung hình. D đưa lý do ngoài hình.",
        },
        {
          q: "Đề mẫu 1. Cách chia thân bài nào hợp lý nhất?",
          options: [
            "Body 1: burglary + vehicle theft (cùng giảm) · Body 2: online fraud (tăng) + shoplifting (ổn định)",
            "Body 1: năm 2000–2010 · Body 2: năm 2010–2020",
            "Body 1: burglary · Body 2: vehicle theft · Body 3: online fraud · Body 4: shoplifting",
            "Body 1: burglary + shoplifting · Body 2: vehicle theft + online fraud",
          ],
          correct: 0,
          why: "A gom theo **chiều xu hướng** (cách ①). B kể theo năm. C là bốn đoạn rời, không so sánh. D ghép hai đường **không có điểm chung**.",
        },
        {
          q: "Đề mẫu 2 (bar chart). Câu nào KHÔNG nên có trong overview?",
          options: [
            "Worry about both crimes was higher among older adults.",
            "The gap between the two crimes was widest in the oldest groups.",
            "Fraud overtook burglary as the main concern from the age of 35.",
            "Exactly 44% of people aged 35–49 were worried about fraud.",
          ],
          correct: 3,
          why: "D là **một con số chi tiết** — để dành cho thân bài. A, B, C đều là nhận xét tổng thể không số.",
        },
        {
          q: "Đề mẫu 2. Động từ nào đúng cho câu “Concern about fraud ___ with age”?",
          options: ["has been increasing", "increased", "will increase", "is increased"],
          correct: 1,
          why: "Số liệu năm **2023** (đã qua) → **quá khứ đơn**: increased. Không dùng bị động (is increased) vì concern tự tăng.",
        },
        {
          q: "Một hình có 6 đường: 3 đường tăng, 2 đường giảm, 1 đường đứng yên. Chia thân bài thế nào?",
          options: [
            "6 đoạn, mỗi đường một đoạn",
            "Body 1: 3 đường tăng · Body 2: 2 đường giảm + đường đứng yên",
            "Body 1: 3 đường đầu trong chú thích · Body 2: 3 đường sau",
            "Một đoạn duy nhất tả lần lượt 6 đường",
          ],
          correct: 1,
          why: "Gom theo **chiều xu hướng** thành hai đoạn thân bài (ôn T2 N4: 5–6 hạng mục trở lên → gom nhóm, không mỗi đường một đoạn). Đường đứng yên ghép vào nhóm nhỏ hơn, tả trong một câu.",
        },
        {
          q: "Câu nào viết số liệu gọn và đúng nhất?",
          options: [
            "Burglary was 6. Vehicle theft was 5. They are small numbers.",
            "Burglary and vehicle theft were respectively 6 and 5 cases stood at.",
            "By 2020, burglary stood at 6 and 5 respectively.",
            "By 2020, burglary and vehicle theft stood at only 6 and 5 cases respectively.",
          ],
          correct: 3,
          why: "**respectively** đặt **cuối**, sau hai con số, ứng với **hai** chủ ngữ theo đúng thứ tự. C chỉ có một chủ ngữ mà hai số. B sai trật tự từ. A là ba câu cụt.",
        },
      ],
    },

    { t: "h", text: "6. Câu khung dùng lại và bảng soát trước khi nộp" },
    {
      t: "table",
      caption: "Câu khung thân bài band 6",
      head: ["Việc", "Khung", "Ví dụ"],
      rows: [
        ["Mở nhóm", "In + năm, A was the most…, at + số, followed by B at + số.", "In 2000, burglary was the most common crime, at 18 cases, followed by vehicle theft at 14."],
        ["Tả cả nhóm", "Both figures + V + over…, and by + năm they stood at X and Y respectively.", "Both figures fell steadily, and by 2020 they stood at 6 and 5 respectively."],
        ["Chuyển nhóm", "C showed the opposite trend. / The pattern was different for…", "Online fraud showed the opposite trend."],
        ["Tả trọn một đường", "Starting at X, it climbed to Y in + năm and finished the period at Z.", "Starting at just 1 case, it climbed to 8 in 2010 and finished the period at 21."],
        ["So sánh bội / phân số", "…, more than three times the figure for B. / roughly a third of…", "…at 21, more than three times the figure for burglary."],
        ["Đường phẳng", "D, by contrast, remained stable, fluctuating between X and Y.", "Shoplifting, by contrast, remained stable, fluctuating between 8 and 9 cases."],
        ["Hình tĩnh: so hai chuỗi", "Among + nhóm, X % were…, compared with only Y % for…", "Among 16–24-year-olds, 35% were worried about burglary, compared with only 22% for online fraud."],
      ],
    },
    {
      t: "note",
      title: "Bảng soát Task 1 — 6 câu hỏi, 2 phút",
      items: [
        "Có đoạn **Overall** ngay sau mở bài không? Trong đó có **2 điểm**, **không số**, **không because**?",
        "Thân bài chia theo **nhóm** hay theo năm / theo chú thích? Mỗi đoạn có nói được “nhóm này giống nhau ở chỗ…” không?",
        "Mỗi con số có **khớp hình** và có **đơn vị** (%, cases per 1,000 people) không?",
        "Có ít nhất **2 phép so sánh** (higher than, three times, a third of, the most) không?",
        "**Thì**: năm đã qua → quá khứ đơn suốt bài. Có chỗ nào lọt hiện tại đơn không?",
        "**Mạo từ** (Ngày 3): the number of · the figure for · a sharp rise in · in 2020 (Ø).",
      ],
    },

    { t: "h", text: "7. Viết bài — AI chấm 4 tiêu chí (20 phút)" },
    {
      t: "p",
      text: "Viết trọn bài cho **đề mẫu 2** (bar chart về nỗi lo tội phạm theo nhóm tuổi — hình ở mục 5). Overview đã có mẫu ở trên: **đừng chép lại**, hãy tự viết bằng lời của bạn rồi viết hai đoạn thân bài theo cách nhóm ③.",
    },
    {
      t: "essay",
      id: "t3d4-viet-bai",
      task: "Task 1",
      prompt: "The bar chart shows the percentage of adults in five age groups in one country who said they were worried about two types of crime in 2023. Online fraud: 16–24: 22%, 25–34: 31%, 35–49: 44%, 50–64: 58%, 65+: 67%. Burglary: 16–24: 35%, 25–34: 38%, 35–49: 41%, 50–64: 43%, 65+: 47%. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      tips: [
        "4 đoạn: Mở bài (1 câu paraphrase) → Overview (2 câu, không số) → Body 1 (hai nhóm dưới 35) → Body 2 (ba nhóm từ 35).",
        "Overview: tăng theo tuổi + thứ hạng đảo ở mốc 35 tuổi.",
        "Mỗi đoạn thân bài: 3–4 con số + một phép so sánh (the gap, three times, compared with).",
        "Quá khứ đơn suốt bài (số liệu năm 2023). increased with age — không viết over the period.",
        "Soát mạo từ: the percentage of · the 65+ group · a gap of 20 percentage points.",
      ],
    },
    {
      t: "p",
      text: "**Viết xong mới đọc** — bài tham khảo khoảng band 6–6.5 (ước tính), 154 từ:",
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The bar chart shows what proportion of adults in five age groups in one country reported being worried about online fraud and burglary in 2023.", vi: "[Mở bài] percentage → proportion · said they were worried → reported being worried." },
        { en: "[Overview] Overall, concern about both crimes increased with age, but the rise was much steeper for online fraud. Consequently, burglary was the greater worry for adults under 35, whereas fraud was the main concern in every older group.", vi: "[Tổng quan] Q1 + Q3, không số." },
        { en: "[Body 1] Among 16–24-year-olds, 35% were worried about burglary, compared with only 22% for online fraud. The pattern was similar for those aged 25–34, although the gap was narrower: 38% for burglary and 31% for fraud.", vi: "[Thân bài 1] Hai nhóm dưới 35: burglary cao hơn; khoảng cách 13 → 7 điểm." },
        { en: "[Body 2] From the age of 35, the order was reversed. Fraud worried 44% of people aged 35–49, slightly more than burglary (41%), and the difference widened in the two oldest groups. In the 65+ group, about two-thirds of respondents (67%) were concerned about fraud, three times the figure for the youngest adults, while fear of burglary reached only 47%.", vi: "[Thân bài 2] Ba nhóm từ 35: fraud cao hơn, khoảng cách nới rộng; 67 ÷ 22 ≈ 3 lần." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Listening ─────────────────────────── */

const T3D4_LISTENING: Lesson = {
  id: "t3d4-nghe",
  kind: "listening",
  title: "Listening Part 2: Multiple choice + Map labelling (giọng Canada)",
  goal: "Làm đúng ≥ 7/10 câu một bài Part 2 gồm 5 câu trắc nghiệm và 5 câu ghi chữ cái lên bản đồ, nghe một lần, giọng Canada — nhờ biết chờ hết ý trước khi chọn, xoay trái–phải theo hướng đang đi, và nhận ra từ riêng của tiếng Anh Canada.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này đẩy band nào, tiêu chí nào",
      items: [
        "Đẩy **Listening Part 2** lên mức band 6 (mục tiêu cả tập: 23/40). Part 2 là **một người nói** về đời sống (tham quan, hướng dẫn, thông báo) — hai dạng hay đi cùng nhau nhất là **Multiple choice** và **Map / Plan labelling**.",
        "Nối **Tập 2 Ngày 7** (Map labelling + ngôn ngữ vị trí, giọng Mỹ). Hôm nay: bản đồ **ngoài trời có la bàn**, người nói dùng **cả hướng Bắc–Nam lẫn trái–phải**, và có **3 ô thừa đều được nhắc tới**.",
        "MCQ band 6: **cả ba phương án đều xuất hiện** trong lời nói. Đáp án đúng thường được **paraphrase**; hai phương án sai bị **phủ định, hoãn, hoặc thuộc về thứ khác**.",
        "🎧 Giọng mới: **Canada** — nghe gần giống giọng Mỹ, khác ở vài nguyên âm (about, sorry) và một số từ riêng: ==washroom · parkade · loonie · toonie · runners · eh==.",
        "Nghe **một lần** như thi thật. Chưa mở lời thoại cho tới khi làm xong cả 10 câu.",
      ],
    },

    { t: "h", text: "1. Giọng Canada — nghe khác ở đâu?" },
    {
      t: "p",
      text: "Đề IELTS dùng nhiều giọng: Anh, Úc, New Zealand, Mỹ, Canada. Bạn đã nghe giọng Mỹ ở Tập 2 Ngày 7 và giọng Úc ở Tập 2 Ngày 15. Giọng Canada **gần giọng Mỹ nhất** — nếu nghe được giọng Mỹ thì bạn đã nghe được 90 %. Phần còn lại nằm ở bảng dưới.",
    },
    {
      t: "table",
      caption: "Phát âm: Canada so với Anh và Mỹ",
      head: ["Đặc điểm", "Giọng Canada", "Ví dụ", "Giống ai"],
      rows: [
        ["Âm /r/ sau nguyên âm", "**Luôn đọc** /r/", "park · north · visitor · shelter", "Mỹ"],
        ["/t/ giữa hai nguyên âm", "Đọc mềm như /d/ (flap)", "water · city · thirty · a lot of", "Mỹ"],
        ["Nguyên âm trong **out, about, house**", "Lưỡi **nâng cao hơn**: nghe hơi giống “a-boat”, “oat”", "about · out · house · south", "**Riêng Canada**"],
        ["**sorry · tomorrow**", "/ˈsɔːri/ — “so-ri”", "Sorry about that.", "Riêng Canada (Mỹ: “sa-ri”)"],
        ["Chữ **Z**", "đọc **zed**", "postal code M5V 2**Z**4", "Anh"],
        ["Chính tả", "centre · colour · neighbour (kiểu Anh) nhưng organize · tire (kiểu Mỹ)", "Community Centre", "Trộn"],
      ],
    },
    {
      t: "table",
      caption: "Từ riêng của Canada có thể gặp trong Part 1–2",
      head: ["Canada nói", "Anh nói", "Nghĩa"],
      rows: [
        ["**washroom**", "toilet · the toilets", "nhà vệ sinh"],
        ["**parking lot** · **parkade**", "car park · multi-storey car park", "bãi đỗ xe · nhà để xe nhiều tầng"],
        ["**loonie** · **toonie**", "(a one-dollar / two-dollar coin)", "đồng xu 1 đô · 2 đô Canada"],
        ["**runners**", "trainers", "giày thể thao"],
        ["**bank machine**", "cash machine · cashpoint", "máy rút tiền"],
        ["**grade** ten", "year eleven", "lớp (ở trường)"],
        ["**fall**", "autumn", "mùa thu"],
        ["…, **eh**?", "…, isn’t it? / right?", "từ đệm cuối câu: “nhỉ?”"],
      ],
    },
    {
      t: "note",
      title: "Mẹo nghe giọng lạ",
      items: [
        "Đáp án **gần như không bao giờ** là một từ địa phương khó (loonie, toque). Từ địa phương chỉ là “tiếng ồn” — biết để **không hoảng** khi nghe thấy.",
        "Canada dùng **hệ mét** (kilometres, Celsius) và **đô la**; ngày lễ hay nhắc: **Victoria Day** (tháng Năm), **Canada Day** (1 tháng Bảy), **Thanksgiving** (tháng Mười).",
        "Gặp giọng lạ: 10 giây đầu não chưa quen là bình thường. Vì thế **đọc câu hỏi thật kỹ trước** — bạn biết mình đang chờ loại thông tin gì, giọng nào cũng bắt được.",
      ],
    },
    {
      t: "listen",
      id: "t3d4-nghe-ca-1",
      title: "Practice 1 — làm quen giọng Canada: thông báo ở chợ cuối tuần",
      dan: { so: "Day 4, Practice 1", boiCanh: "an announcement at a weekend market in Canada.", cau: [1, 5] },
      note: "Khoảng 45 giây, giọng Canada (nam). Đọc 5 câu bên dưới trước, rồi nghe MỘT lần.",
      lines: [
        { who: "Announcer", voice: "ca-nam", text: "Hi folks, and welcome to the Harbourfront Saturday Market. Just a few quick announcements.", vi: "Chào mọi người, chào mừng đến Chợ thứ Bảy Harbourfront. Chỉ vài thông báo nhanh thôi." },
        { who: "Announcer", voice: "ca-nam", text: "The market is open today from nine until three, not four as it says on some of the older signs.", vi: "Hôm nay chợ mở từ chín giờ tới ba giờ, không phải bốn giờ như ghi trên một số biển cũ." },
        { who: "Announcer", voice: "ca-nam", text: "Parking in the lot behind the arena is free for the first two hours. After that it's a toonie an hour, so have a two-dollar coin ready.", vi: "Đỗ xe ở bãi sau nhà thi đấu miễn phí hai giờ đầu. Sau đó là một toonie mỗi giờ, nên hãy chuẩn bị sẵn đồng xu hai đô." },
        { who: "Announcer", voice: "ca-nam", text: "Washrooms are located beside the information booth, about halfway along the main aisle.", vi: "Nhà vệ sinh nằm cạnh quầy thông tin, khoảng giữa lối đi chính." },
        { who: "Announcer", voice: "ca-nam", text: "If you need cash, the nearest bank machine is in the grocery store across the street.", vi: "Nếu cần tiền mặt, máy rút tiền gần nhất ở trong cửa hàng thực phẩm bên kia đường." },
        { who: "Announcer", voice: "ca-nam", text: "And don't forget, the maple syrup tasting starts at eleven thirty at stall forty-two. Have a great day, eh!", vi: "Và đừng quên, buổi nếm thử si-rô phong bắt đầu lúc mười một rưỡi ở quầy số bốn mươi hai. Chúc một ngày tuyệt vời nhé!" },
      ],
    },
    {
      t: "quiz",
      id: "t3d4-nghe-ca-1-cau",
      title: "Questions 1–5 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "1. The market closes at ___ o’clock today.", answers: ["three", "3"], hint: "cẩn thận con số trên biển cũ" },
        { q: "2. Parking is free for the first ___ hours.", answers: ["two", "2"] },
        { q: "3. The washrooms are beside the information ___.", answers: ["booth"] },
        { q: "4. The nearest bank machine is inside the ___ store.", answers: ["grocery"] },
        { q: "5. The tasting takes place at stall number ___.", answers: ["42", "forty-two", "forty two"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích Practice 1",
      items: [
        "**1 — three.** “from nine until **three**, **not four** as it says on some of the older signs” — bẫy sửa thông tin: số **four** được nhắc nhưng bị phủ định.",
        "**2 — two.** “free for the first **two hours**”. Sau đó nghe “a **toonie** an hour… a **two**-dollar coin” — cùng chữ two nhưng là **tiền**, không phải số giờ.",
        "**3 — booth.** “beside the information **booth**” (quầy). **washrooms** = toilets.",
        "**4 — grocery.** “the nearest **bank machine** is in the **grocery** store” — bank machine = cash machine.",
        "**5 — 42.** “at stall **forty-two**”. Số **eleven thirty** là giờ bắt đầu, không phải số quầy.",
      ],
    },

    { t: "h", text: "2. Multiple choice ở Part 2 — band 6 khó ở đâu?" },
    {
      t: "table",
      caption: "Ba số phận của một phương án",
      head: ["Phương án", "Người nói làm gì với nó", "Tín hiệu nghe được"],
      rows: [
        ["**Đúng**", "Nói ra bằng **lời khác** (paraphrase), thường ở **cuối** đoạn.", "What we do… is… · The one thing… · actually · in fact · What is new is…"],
        ["**Sai kiểu ①** — bị phủ định / hoãn", "Nhắc đúng chữ rồi **bác bỏ**.", "not… · isn’t… either · we had hoped to… but · has been put off · used to"],
        ["**Sai kiểu ②** — thuộc về thứ khác", "Chi tiết **có thật** nhưng trả lời cho **câu hỏi khác**.", "năm khác, sự kiện khác, người khác: “…was added in 1982”"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Ba bước cho mỗi câu MCQ",
      steps: [
        { label: "① Trước khi nghe: gạch **từ khoá của câu hỏi**", sub: "Không phải từ khoá của phương án. Hỏi “first opened to the public”? “on their first day”? “free”? “new this season”?" },
        { label: "② Khi nghe: mỗi phương án được nhắc → đánh dấu ✓ ✗ ?", sub: "Nghe thấy chữ của phương án chưa phải là đáp án. Chờ động từ và từ phủ định đi kèm." },
        { label: "③ Chờ **hết ý** rồi mới chọn", sub: "Đáp án đúng thường đến SAU hai phương án sai. Nghe thấy câu hỏi kế tiếp bắt đầu mới chuyển mắt." },
      ],
      caption: "Lỗi số 1 của band 5: chọn phương án NGHE THẤY ĐẦU TIÊN.",
    },
    {
      t: "rule",
      formula: "Nghe thấy chữ của phương án ≠ đáp án · chờ: not / but / actually / used to / put off · đáp án đúng = paraphrase, hay đến sau cùng",
      vi: "MCQ Part 2: cả ba phương án đều được nhắc; chỉ một cái khớp với CÂU HỎI.",
    },

    { t: "h", text: "3. Map labelling vòng 2 — la bàn + trái–phải + ô thừa" },
    {
      t: "p",
      text: "Ở **Tập 2 Ngày 7** bạn đã học cụm vị trí cơ bản (next to, opposite, on your left, in the corner) với một mặt bằng **trong nhà**. Bản đồ ngoài trời ở band 6 có thêm ba cái khó: người nói trộn **hướng la bàn** với **trái–phải**; phải **đi nhiều chặng** rồi quay lại điểm mốc; và các **ô thừa cũng được gọi tên**.",
    },
    {
      t: "table",
      caption: "Ngôn ngữ vị trí vòng 2 (thêm vào bảng của T2 N7)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["**at the far end of** / **all the way to the end**", "tận cuối", "Follow the path **all the way to** its western end."],
        ["**the last / first building on the north side**", "toà cuối / đầu tiên ở phía bắc (của con đường)", "It’s **the last building on the north side**."],
        ["**directly across the path from** / **facing it**", "đối diện ngay bên kia đường", "**Directly across the path from** it is the office."],
        ["**just past** / **just beyond**", "ngay sau khi qua", "**Just past** the flagpole, on your left, is the shelter."],
        ["**where the two paths cross**", "chỗ hai lối giao nhau", "Stop at the flagpole, **where the two paths cross**."],
        ["**back onto**", "lưng quay ra, giáp phía sau với", "The washrooms **back onto** the parking lot."],
        ["**carry on** / **keep walking** + hướng", "đi tiếp", "**Carry on north** toward the pond."],
        ["**halfway along**", "ở khoảng giữa (lối đi)", "It’s about **halfway along** the main aisle."],
        ["**in the north-east / south-west corner**", "ở góc đông bắc / tây nam", "The parking lot is **in the south-west corner**."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Trái–phải đổi theo hướng bạn đang ĐI",
      cols: [
        { title: "Đi về **Bắc** ↑", items: ["bên **trái** = **Tây**", "bên **phải** = **Đông**"] },
        { title: "Đi về **Tây** ←", items: ["bên **trái** = **Nam**", "bên **phải** = **Bắc**"] },
        { title: "Đi về **Đông** →", items: ["bên **trái** = **Bắc**", "bên **phải** = **Nam**"] },
        { title: "Đi về **Nam** ↓", items: ["bên **trái** = **Đông**", "bên **phải** = **Tây**"] },
      ],
      caption: "Mẹo: xoay tờ đề (hoặc nghiêng đầu) sao cho hướng đang đi chỉ lên trên — khi đó trái–phải trên giấy trùng với trái–phải của người nói.",
    },
    {
      t: "note",
      title: "Cẩn thận — ba bẫy của Map labelling band 6 (và một mẹo cứu câu)",
      items: [
        "**Ô thừa được gọi tên**: bản đồ có 8 chữ cái nhưng chỉ 5 câu hỏi. Ba ô còn lại **cũng được nhắc** (the old schoolhouse, the stables…). Nghe tên một toà nhà → kiểm xem nó **có trong danh sách câu hỏi** không.",
        "**used to be**: “That building **used to be** the gift shop” — tên cũ, không phải đáp án. “It **used to be** in the stables… but it **moved**” — vị trí cũ.",
        "**Quay lại mốc**: “Now **come back to** the flagpole” — bạn phải đưa ngón tay về lại điểm mốc. Mất dấu ở đây là sai liền hai câu.",
        "Câu hỏi đi **theo thứ tự lời nói**. Lỡ một câu → bỏ, bám câu kế tiếp bằng **tên địa điểm** của câu đó.",
      ],
    },
    {
      t: "rule",
      formula: "Tìm lối vào + la bàn → di ngón tay theo từng chặng → xoay trái–phải theo hướng đi → used to be = không phải đáp án → ô thừa cũng được nhắc",
      vi: "Map labelling: nghe TÊN địa điểm trong câu hỏi thì dừng ngón tay ở đó, ghi chữ cái.",
    },

    { t: "h", text: "4. Bài Part 2 trọn vẹn — Questions 11–20 (giọng Canada)" },
    {
      t: "canh",
      anh: ["woman-teacher", "national-park", "world-map"],
      caption: "**Dana Leclair**, điều phối viên tình nguyện của **Cedar Ridge Heritage Park** (một công viên di sản ở Canada, nơi giữ lại các toà nhà cổ), nói chuyện với nhóm tình nguyện viên mới trước buổi tham quan.",
    },
    {
      t: "p",
      text: "**Questions 11–15.** Choose the correct letter, **A, B or C**. — **Questions 16–20.** Label the map below. Write the correct letter, **A–H**, next to Questions 16–20. Bạn có khoảng **1 phút** để đọc cả hai nhóm câu và bản đồ: tìm **Main gate**, **Pond**, **Flagpole**, **Parking lot** và mũi tên hướng Bắc. Rồi nghe **một lần**.",
    },
    {
      t: "table",
      caption: "Questions 11–15 (đọc trước)",
      head: ["Câu", "Câu hỏi", "A", "B", "C"],
      rows: [
        ["11", "The park first opened to the public in", "1967", "1974", "1982"],
        ["12", "On their first day, new volunteers", "lead a short tour", "help in the gardens", "follow an experienced guide"],
        ["13", "Volunteers who work outdoors must bring their own", "boots", "gloves", "rain jacket"],
        ["14", "What do volunteers receive free of charge after 30 hours?", "lunch in the café", "a family pass", "a parking permit"],
        ["15", "What is new at the park this season?", "evening lantern tours", "a children’s farm", "a second entrance"],
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Cedar Ridge Heritage Park — ghi chữ cái A–H cho câu 16–20",
        note: "Bản đồ tự vẽ cho bài luyện. Phía trên là hướng Bắc. Lối chính chạy Bắc–Nam từ cổng tới hồ; lối ngang chạy Đông–Tây; hai lối cắt nhau ở cột cờ (Flagpole).",
        map: {
          cols: 12,
          rows: 9,
          paths: [
            { x: 5.6, y: 1.6, w: 0.8, h: 6.4, label: "main path" },
            { x: 0.4, y: 4.4, w: 11.2, h: 0.8 },
          ],
          boxes: [
            { x: 4.5, y: 0.1, w: 3.0, h: 1.4, label: "Pond" },
            { x: 5.2, y: 8.0, w: 1.6, h: 0.9, label: "Main gate" },
            { x: 0.2, y: 7.3, w: 3.0, h: 1.6, label: "Parking lot" },
            { x: 3.4, y: 6.0, w: 2.0, h: 1.6, blank: "A" },
            { x: 6.6, y: 6.0, w: 2.0, h: 1.6, blank: "B" },
            { x: 9.2, y: 5.4, w: 2.4, h: 1.6, blank: "C" },
            { x: 9.2, y: 2.6, w: 2.4, h: 1.6, blank: "D" },
            { x: 6.6, y: 2.4, w: 2.0, h: 1.8, blank: "E" },
            { x: 3.4, y: 2.4, w: 2.0, h: 1.8, blank: "F" },
            { x: 0.4, y: 2.6, w: 2.4, h: 1.6, blank: "G" },
            { x: 0.4, y: 5.4, w: 2.4, h: 1.6, blank: "H" },
          ],
          pins: [
            { x: 6.0, y: 4.8, label: "Flagpole" },
            { x: 6.0, y: 7.8, label: "You are here" },
          ],
        },
      },
    },
    {
      t: "table",
      caption: "Questions 16–20 (đọc trước)",
      head: ["Câu", "Địa điểm", "Chữ cái"],
      rows: [
        ["16", "Visitor centre", "___"],
        ["17", "Blacksmith’s workshop", "___"],
        ["18", "Washrooms", "___"],
        ["19", "Picnic shelter", "___"],
        ["20", "First-aid station", "___"],
      ],
    },
    {
      t: "listen",
      id: "t3d4-nghe-bai",
      title: "Welcome to Cedar Ridge Heritage Park",
      dan: { so: "Day 4, Recording 1 (Listening Part 2)", boiCanh: "a talk by the volunteer coordinator of a heritage park to a group of new volunteers.", cau: [11, 20] },
      note: "Khoảng 4 phút, giọng Canada (nữ), tốc độ tự nhiên. Nghe MỘT lần như thi thật; chỉ nghe lần hai sau khi đã chấm.",
      lines: [
        { who: "Dana", voice: "ca-nu", text: "Good morning, everyone, and welcome to Cedar Ridge Heritage Park. I'm Dana Leclair, the volunteer coordinator, and I'm really glad so many of you have signed up this season.", vi: "Chào buổi sáng mọi người, chào mừng đến Công viên Di sản Cedar Ridge. Tôi là Dana Leclair, điều phối viên tình nguyện, và tôi rất vui vì mùa này có nhiều bạn đăng ký như vậy." },
        { who: "Dana", voice: "ca-nu", text: "Let me start with a bit of background. The land was donated to the town back in nineteen sixty-seven, but moving and restoring the old buildings took a lot longer than anyone expected, so we didn't actually open our gates to visitors until nineteen seventy-four. The blacksmith's workshop, which you'll see later, was added in nineteen eighty-two.", vi: "Để tôi bắt đầu bằng chút bối cảnh. Khu đất được hiến cho thị trấn từ năm 1967, nhưng việc di dời và phục dựng các toà nhà cổ lâu hơn nhiều so với dự tính, nên thực tế tới năm 1974 chúng tôi mới mở cổng đón khách. Xưởng rèn, mà lát nữa các bạn sẽ thấy, được thêm vào năm 1982." },
        { who: "Dana", voice: "ca-nu", text: "Now, your first day. A lot of new volunteers assume they'll be put straight to work in the gardens, and others are nervous that they'll have to lead a tour. Don't worry. Nobody leads a tour until they've been here at least a month. Your first shift is always spent shadowing one of our experienced guides, just watching and listening.", vi: "Giờ nói về ngày đầu tiên. Nhiều tình nguyện viên mới cho rằng họ sẽ được đưa thẳng ra làm vườn, số khác thì lo phải dẫn một đoàn tham quan. Đừng lo. Không ai dẫn đoàn cho tới khi đã ở đây ít nhất một tháng. Ca đầu tiên của các bạn luôn là đi theo một hướng dẫn viên giàu kinh nghiệm, chỉ quan sát và lắng nghe." },
        { who: "Dana", voice: "ca-nu", text: "If you're going to be working outdoors, there are a few things to know. We supply work gloves, and there's a rack of rain jackets in the volunteers' office that you can borrow any time. What we can't lend you is footwear, so please come in sturdy boots with closed toes. Sandals and runners aren't allowed on site.", vi: "Nếu các bạn làm việc ngoài trời thì có vài điều cần biết. Chúng tôi cấp găng tay lao động, và trong văn phòng tình nguyện viên có một giá áo mưa các bạn mượn lúc nào cũng được. Thứ chúng tôi không cho mượn được là giày dép, nên hãy mang ủng chắc chắn, kín mũi. Xăng-đan và giày thể thao không được phép trong khu vực." },
        { who: "Dana", voice: "ca-nu", text: "People always ask what volunteers get in return. Well, parking is free for everybody, so that's not much of a perk. You do get twenty percent off in the café, though lunch isn't free, I'm afraid. But once you've completed thirty hours, we give you a family pass, good for a whole year, at no charge.", vi: "Mọi người luôn hỏi tình nguyện viên được gì. Đỗ xe thì miễn phí cho tất cả, nên chẳng phải ưu đãi gì. Các bạn được giảm hai mươi phần trăm ở quán cà phê, nhưng tiếc là bữa trưa thì không miễn phí. Còn khi đã làm đủ ba mươi giờ, chúng tôi tặng các bạn một vé gia đình, dùng cả năm, không mất tiền." },
        { who: "Dana", voice: "ca-nu", text: "And one more piece of news. We had hoped to open a second entrance on Mill Road this spring, but that's been put off until next year. The children's farm isn't new either. It's been here for a decade. What is new this season is our lantern tours, which run on Friday evenings after dark. They sold out on the Victoria Day long weekend.", vi: "Thêm một tin nữa. Chúng tôi từng hy vọng mở cổng thứ hai trên đường Mill mùa xuân này, nhưng việc đó đã bị hoãn sang năm sau. Trang trại thiếu nhi cũng không phải là mới. Nó ở đây cả chục năm rồi. Cái mới của mùa này là các tour đèn lồng, chạy vào tối thứ Sáu sau khi trời tối. Dịp nghỉ lễ Victoria Day vừa rồi đã bán hết vé." },
        { who: "Dana", voice: "ca-nu", text: "Okay, let's look at the map so you can find your way around. You come in through the main gate at the bottom of the map, so you're facing north, and the pond is straight ahead of you at the far end of the main path.", vi: "Được rồi, hãy nhìn bản đồ để các bạn biết đường đi lại. Các bạn vào qua cổng chính ở phía dưới bản đồ, tức là đang quay mặt về hướng bắc, và cái hồ ở ngay phía trước, tận cuối lối chính." },
        { who: "Dana", voice: "ca-nu", text: "As soon as you're through the gate, the first building on your right is the visitor centre. That's where tickets are sold and where every shift begins. Directly across the path from it, on your left, is the volunteers' office. That building used to be the gift shop, so you may still see the old sign.", vi: "Vừa qua cổng, toà nhà đầu tiên bên phải là trung tâm đón khách. Đó là nơi bán vé và là nơi mọi ca làm bắt đầu. Đối diện ngay bên kia lối đi, bên trái các bạn, là văn phòng tình nguyện viên. Toà đó trước là cửa hàng quà tặng, nên có thể các bạn vẫn thấy tấm biển cũ." },
        { who: "Dana", voice: "ca-nu", text: "Keep walking north until you reach the flagpole, where the two paths cross. If you turn left there and follow the path all the way to its western end, the last building on the north side, on your right, is the blacksmith's workshop.", vi: "Cứ đi tiếp về hướng bắc cho tới cột cờ, chỗ hai lối giao nhau. Nếu rẽ trái ở đó và đi theo lối ấy tới tận đầu phía tây, toà nhà cuối cùng ở phía bắc, bên phải các bạn, là xưởng rèn." },
        { who: "Dana", voice: "ca-nu", text: "Facing it, on the south side of the path, are the washrooms. They back onto the parking lot. Those are the only public washrooms in the park at the moment, because the ones by the gate are closed for repairs.", vi: "Đối diện nó, ở phía nam lối đi, là nhà vệ sinh. Lưng nhà vệ sinh giáp bãi đỗ xe. Hiện đó là nhà vệ sinh công cộng duy nhất trong công viên, vì khu gần cổng đang đóng để sửa." },
        { who: "Dana", voice: "ca-nu", text: "Now come back to the flagpole and carry on north toward the pond. Just past the flagpole, on your left, is the picnic shelter, which is where most of us eat lunch. The building opposite it, on your right, is the old schoolhouse.", vi: "Giờ quay lại cột cờ và đi tiếp về hướng bắc, phía cái hồ. Ngay sau khi qua cột cờ, bên trái các bạn, là nhà chòi dã ngoại, nơi phần lớn chúng tôi ăn trưa. Toà nhà đối diện nó, bên phải, là ngôi trường làng cũ." },
        { who: "Dana", voice: "ca-nu", text: "Finally, the east side. From the flagpole, take the path to the right and walk to the very end. The first-aid station is the last building on the north side of that path. It used to be in the stables, which are just across the path on the south side, but it moved last fall.", vi: "Cuối cùng là phía đông. Từ cột cờ, đi theo lối bên phải tới tận cuối. Trạm sơ cứu là toà nhà cuối cùng ở phía bắc của lối đó. Trước đây nó ở trong chuồng ngựa, nằm ngay bên kia lối đi ở phía nam, nhưng đã chuyển từ mùa thu năm ngoái." },
        { who: "Dana", voice: "ca-nu", text: "All right. Grab a map from the table, and we'll head out on the tour in about five minutes.", vi: "Được rồi. Các bạn lấy một tấm bản đồ ở bàn, khoảng năm phút nữa chúng ta bắt đầu đi tham quan." },
      ],
    },
    {
      t: "mcq",
      id: "t3d4-nghe-chon",
      title: "Questions 11–15 — Multiple choice",
      items: [
        { q: "(11) The park first opened to the public in", options: ["A 1967", "B 1974", "C 1982"], correct: 1, why: "“we **didn’t actually open our gates to visitors until nineteen seventy-four**.” open our gates to visitors = opened to the public. **1967** là năm đất được **hiến** (sai kiểu ②); **1982** là năm thêm **xưởng rèn** (sai kiểu ②)." },
        { q: "(12) On their first day, new volunteers", options: ["A lead a short tour.", "B help in the gardens.", "C follow an experienced guide."], correct: 2, why: "“Your first shift is always spent **shadowing one of our experienced guides**.” shadow = đi theo quan sát = follow. Làm vườn: nhiều người **assume** (tưởng thế) — không phải sự thật. Dẫn tour: “**Nobody** leads a tour until… at least a month.”" },
        { q: "(13) Volunteers who work outdoors must bring their own", options: ["A boots.", "B gloves.", "C rain jacket."], correct: 0, why: "“**What we can’t lend you is footwear**, so please come in **sturdy boots**.” Găng tay: “**We supply** work gloves.” Áo mưa: có giá áo mưa để **mượn**. Tín hiệu đáp án: cấu trúc **What we… is…**" },
        { q: "(14) What do volunteers receive free of charge after 30 hours?", options: ["A lunch in the café", "B a family pass", "C a parking permit"], correct: 1, why: "“once you’ve completed **thirty hours**, we give you **a family pass**… **at no charge**” = free of charge. Bữa trưa: “lunch **isn’t free**” (chỉ giảm 20 %). Đỗ xe: miễn phí cho **mọi người**, không cần giấy phép." },
        { q: "(15) What is new at the park this season?", options: ["A evening lantern tours", "B a children’s farm", "C a second entrance"], correct: 0, why: "“**What is new this season is our lantern tours**, which run on **Friday evenings**.” Cổng thứ hai: “**had hoped to**… but that’s been **put off until next year**” (sai kiểu ①). Trang trại thiếu nhi: “**isn’t new either**… here for a decade.”" },
      ],
    },
    {
      t: "quiz",
      id: "t3d4-nghe-ban-do",
      title: "Questions 16–20 — ghi MỘT chữ cái (A–H)",
      kind: "fill",
      items: [
        { q: "16. Visitor centre ___", answers: ["B"] },
        { q: "17. Blacksmith’s workshop ___", answers: ["G"] },
        { q: "18. Washrooms ___", answers: ["H"] },
        { q: "19. Picnic shelter ___", answers: ["F"] },
        { q: "20. First-aid station ___", answers: ["D"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 16–20 (di ngón tay theo lời Dana)",
      items: [
        "Vào từ cổng chính ở phía dưới, bạn **quay mặt về Bắc** ⇒ **trái = Tây, phải = Đông**.",
        "**16 — B.** “the **first building on your right** is the visitor centre.” Bên phải (Đông) ngay sau cổng → **B**. Ô **A** đối diện là **văn phòng tình nguyện viên** — “**used to be** the gift shop” (ô thừa, hai cái tên đều không có trong câu hỏi).",
        "**17 — G.** “turn **left** there (ở cột cờ) and follow the path **all the way to its western end**, the **last building on the north side, on your right**.” Đang đi về **Tây** ⇒ bên phải là **Bắc** → ô phía trên ở đầu tây → **G**.",
        "**18 — H.** “**Facing it, on the south side** of the path, are the washrooms. They **back onto the parking lot**.” Đối diện G, phía nam, lưng giáp bãi đỗ xe → **H**. Bẫy: “the ones **by the gate** are closed” — khu vệ sinh gần cổng không dùng được, đừng ghi A hay B.",
        "**19 — F.** “**come back to the flagpole** and carry on **north**… **Just past the flagpole, on your left**, is the picnic shelter.” Đi về Bắc ⇒ trái là Tây → **F**. Ô **E** đối diện là **trường làng cũ** (ô thừa).",
        "**20 — D.** “take the path **to the right** (về Đông) and walk **to the very end**. The first-aid station is the **last building on the north side**.” → **D**. Bẫy: “It **used to be** in the **stables**… on the south side, **but it moved**” — ô **C** là chuồng ngựa (vị trí cũ, ô thừa).",
        "Ba ô thừa **A, E, C** đều được gọi tên. Người nói dùng **north side / south side** nhiều hơn left / right — đó là lý do phải tìm mũi tên hướng Bắc trước khi nghe.",
      ],
    },
    {
      t: "table",
      caption: "Tự chấm bài 11–20",
      head: ["Số câu đúng", "Mức tương đương ở Part 2", "Việc nên làm"],
      rows: [
        ["9–10", "Vững band 6.5 trở lên", "Nghe lại một lần không nhìn hình, tự vẽ bản đồ theo lời nói."],
        ["7–8", "Đạt mục tiêu band 6", "Mở lời thoại, gạch câu chứa đáp án và câu chứa bẫy của từng câu sai."],
        ["5–6", "Khoảng band 5–5.5", "Sai nhiều ở 11–15 → luyện lại mục 2. Sai nhiều ở 16–20 → luyện bảng “trái–phải theo hướng đi” mục 3."],
        ["≤ 4", "Chưa đạt", "Ôn Tập 2 Ngày 7, nghe lại Practice 1, rồi làm lại bài này sau 1 ngày."],
      ],
    },

    { t: "h", text: "5. Soi lại: đáp án đã được paraphrase thế nào" },
    {
      t: "table",
      head: ["Câu", "Lời người nói", "Chữ trong câu hỏi / phương án", "Phép (Ngày 3)"],
      rows: [
        ["11", "open our gates to visitors", "opened to the public", "P1 đồng nghĩa"],
        ["12", "shadowing one of our experienced guides", "follow an experienced guide", "P1 đồng nghĩa"],
        ["13", "What we can’t lend you is footwear… sturdy boots", "must bring their own boots", "P8 ý suy ra + P7 (footwear → boots)"],
        ["14", "at no charge", "free of charge", "P1 đồng nghĩa"],
        ["15", "our lantern tours, which run on Friday evenings", "evening lantern tours", "P7 cụ thể → khái quát (Friday evenings → evening) + gọn mệnh đề which thành từ đứng trước"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "shadow", pos: "v", ipa: "/ˈʃædəʊ/", vi: "đi theo ai để quan sát và học việc", ex: "New staff shadow a senior colleague for a week.", exVi: "Nhân viên mới đi theo học việc một đồng nghiệp lâu năm trong một tuần.", more: "**job shadowing** = kiến tập. Từ hay gặp ở Listening về công việc, tình nguyện." },
        { w: "perk", pos: "n", ipa: "/pɜːk/", vi: "quyền lợi, ưu đãi kèm theo (thân mật)", ex: "Free parking is one of the perks of the job.", exVi: "Đỗ xe miễn phí là một trong các ưu đãi của công việc.", more: "Trang trọng hơn: **benefit**. **not much of a perk** = chẳng phải ưu đãi gì." },
        { w: "put off", pos: "phr v", ipa: "/pʊt ɒf/", vi: "hoãn lại", ex: "The opening has been put off until next year.", exVi: "Việc khai trương đã bị hoãn sang năm sau.", more: "= **postpone** / **delay**. Tín hiệu phương án SAI trong MCQ: việc **chưa** xảy ra." },
        { w: "sturdy", pos: "adj", ipa: "/ˈstɜːdi/", vi: "chắc chắn, bền", ex: "You will need sturdy shoes for the hike.", exVi: "Bạn sẽ cần giày chắc chắn cho chuyến đi bộ đường dài.", more: "**sturdy boots / furniture / bag**. **footwear** = giày dép nói chung (không đếm được)." },
        { w: "heritage", pos: "n", ipa: "/ˈherɪtɪdʒ/", vi: "di sản", ex: "The old market is part of the city's heritage.", exVi: "Khu chợ cũ là một phần di sản của thành phố.", more: "**a heritage site / park / building** · **cultural heritage** · **World Heritage Site**. Gặp lại ở Ngày 12." },
        { w: "at no charge", pos: "phr", ipa: "/ət nəʊ tʃɑːdʒ/", vi: "miễn phí", ex: "Members can borrow tools at no charge.", exVi: "Thành viên được mượn dụng cụ miễn phí.", more: "= **free of charge** = **for free** = **at no cost** — bốn cách nói một ý, đề hay đổi qua lại." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T3D4_HOMEWORK: Lesson = {
  id: "t3d4-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 4",
  goal: "Củng cố cả ngày bằng 37 câu có đáp án — từ và cụm chủ đề Crime, họ từ, overview và cách nhóm số liệu Task 1, nghe giọng Canada — rồi viết trọn một bài Task 1 có hai năm so sánh.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Làm bài tập thế nào",
      items: [
        "**37 câu + 1 bài viết, khoảng 65 phút**: từ vựng 10 · cụm 8 · họ từ 6 · dịch 5 · overview 4 · nghe 4 · viết Task 1 (20 phút).",
        "Làm **không mở lại bài học**. Sai câu nào đọc giải thích, rồi quay lại đúng mục.",
        "Mục tiêu: **≥ 28/37**. Phần từ vựng sai nhiều → ôn bảng “Sáu cặp dễ nhầm” và “14 cụm ăn điểm”.",
        "Bài viết: nhớ **4 câu hỏi** (chiều chung · ai nhất · đổi ngôi · ngoại lệ) → chọn 2 điểm → chia nhóm → chọn số.",
      ],
    },

    { t: "h", text: "Phần I — Chọn từ đúng (10 câu)" },
    {
      t: "mcq",
      id: "t3d4-bt-tu",
      title: "Từ vựng Crime, law & punishment",
      items: [
        { q: "Two armed men ___ a jewellery shop in the city centre yesterday.", options: ["stole", "robbed", "committed", "convicted"], correct: 1, why: "**rob + nơi / người**: robbed a jewellery shop. **steal** + vật bị lấy." },
        { q: "The government plans to introduce new ___ to deal with online fraud.", options: ["legislation", "jury", "probation", "evidence"], correct: 0, why: "**introduce legislation** = ban hành luật." },
        { q: "Instead of going to prison, he had to do 80 hours of ___.", options: ["capital punishment", "surveillance", "vandalism", "community service"], correct: 3, why: "**do community service** = lao động công ích — hình phạt thay thế án tù." },
        { q: "There was not enough ___ to prove that she had taken the money.", options: ["witness", "trial", "evidence", "sentence"], correct: 2, why: "**evidence** = bằng chứng (không đếm được)." },
        { q: "Offenders who receive job training are less likely to ___.", options: ["release", "reoffend", "arrest", "deter"], correct: 1, why: "**reoffend** = tái phạm." },
        { q: "Speeding drivers have to pay a ___ of up to £1,000.", options: ["fine", "fraud", "trial", "verdict"], correct: 0, why: "**pay a fine** = nộp tiền phạt." },
        { q: "The man was ___ of burglary and sent to prison for two years.", options: ["charged", "arrested", "sentenced", "convicted"], correct: 3, why: "**be convicted of** + tội. charged **with**; arrested **for**; sentenced **to**." },
        { q: "___ crime, such as shoplifting, is rarely reported in the news.", options: ["Violent", "Organised", "Petty", "Capital"], correct: 2, why: "**petty crime** = tội vặt; shoplifting là ví dụ điển hình." },
        { q: "Most citizens are ___ and have never been in trouble with the police.", options: ["law-abiding", "lenient", "juvenile", "guilty"], correct: 0, why: "**law-abiding citizens** = công dân tuân thủ pháp luật." },
        { q: "CCTV cameras are a form of ___ that can help prevent crime in public places.", options: ["rehabilitation", "surveillance", "imprisonment", "legislation"], correct: 1, why: "**surveillance** = giám sát; CCTV = surveillance cameras." },
      ],
    },

    { t: "h", text: "Phần II — Hoàn thành cụm (8 câu)" },
    {
      t: "quiz",
      id: "t3d4-bt-cum",
      title: "Điền MỘT từ",
      kind: "fill",
      items: [
        { q: "Young people who ___ a crime should be educated, not just punished.", answers: ["commit"], hint: "động từ đi với crime" },
        { q: "He was arrested ___ selling stolen phones.", answers: ["for"], hint: "giới từ sau arrest" },
        { q: "The woman was accused ___ stealing from her employer.", answers: ["of"], hint: "giới từ sau accuse" },
        { q: "Heavy fines can act ___ a deterrent to drink-driving.", answers: ["as"], hint: "act ___ a deterrent" },
        { q: "The judge ___ him to six months in prison.", answers: ["sentenced"], hint: "tuyên án (quá khứ)" },
        { q: "She was ___ from prison early because of good behaviour.", answers: ["released"], hint: "được thả" },
        { q: "The city has one of the lowest crime ___ in the country.", answers: ["rates"], hint: "tỉ lệ (số nhiều sau one of the)" },
        { q: "The jury found him not ___, and he walked free.", answers: ["guilty"], hint: "vô tội = not ___" },
      ],
    },

    { t: "h", text: "Phần III — Họ từ: viết dạng đúng của từ trong ngoặc (6 câu)" },
    {
      t: "quiz",
      id: "t3d4-bt-ho-tu",
      title: "Đổi loại từ",
      kind: "fill",
      items: [
        { q: "The ___ (punish) for this offence is a fine of £500.", answers: ["punishment"], hint: "danh từ" },
        { q: "Prisons should focus more on the ___ (rehabilitate) of offenders.", answers: ["rehabilitation"], hint: "danh từ" },
        { q: "He already had two previous ___ (convict) for theft.", answers: ["convictions"], hint: "danh từ số nhiều" },
        { q: "Crime ___ (prevent) costs far less than building new prisons.", answers: ["prevention"], hint: "danh từ" },
        { q: "It is ___ (legal) to drive without insurance in most countries.", answers: ["illegal"], hint: "tính từ trái nghĩa" },
        { q: "Life ___ (prison) is the most severe penalty in many countries.", answers: ["imprisonment"], hint: "danh từ chỉ án tù" },
      ],
    },

    { t: "h", text: "Phần IV — Dịch Việt → Anh (5 câu)" },
    {
      t: "quiz",
      id: "t3d4-bt-dich",
      title: "Dùng cụm của bài Từ vựng và khung overview của bài Viết",
      kind: "translate",
      grammar: "commit a crime · be charged with · reintegrate into society · Overall, A + V, whereas B + V · accounted for the largest share of.",
      items: [
        { q: "Anh ta bị buộc tội trộm cắp.", hint: "was charged with, theft", answers: ["He was charged with theft.", "He was charged with stealing."] },
        { q: "Nghèo đói là một trong những nguyên nhân gốc rễ của tội phạm.", hint: "Poverty (Ø), one of the root causes of, crime (Ø)", answers: ["Poverty is one of the root causes of crime.", "Poverty is one of the root causes of crimes."] },
        { q: "Giáo dục giúp người phạm tội tái hoà nhập xã hội.", hint: "Education (Ø), helps, offenders, reintegrate into society (Ø)", answers: ["Education helps offenders reintegrate into society.", "Education helps offenders to reintegrate into society.", "Education helps criminals reintegrate into society.", "Education helps offenders re-integrate into society."] },
        { q: "Nhìn chung, đột nhập trộm cắp giảm, trong khi tội phạm mạng tăng.", hint: "Overall, burglary, fell / declined, whereas / while, cybercrime, rose / increased", answers: ["Overall, burglary fell, whereas cybercrime rose.", "Overall, burglary fell, while cybercrime rose.", "Overall, burglary declined, whereas cybercrime increased.", "Overall, burglary decreased, whereas cybercrime increased.", "Overall, burglary decreased, while cybercrime increased.", "Overall, burglary declined, while cybercrime rose.", "Overall, burglary fell, whereas cybercrime increased.", "Overall, burglary fell, while cybercrime increased.", "Overall, burglary declined, whereas cybercrime rose.", "Overall, burglary declined, while cybercrime increased.", "Overall, burglary fell while cybercrime rose."] },
        { q: "Phạt tiền chiếm tỉ lệ lớn nhất trong cả hai năm.", hint: "Fines, accounted for / made up, the largest proportion / share, in both years", answers: ["Fines accounted for the largest proportion in both years.", "Fines accounted for the largest share in both years.", "Fines made up the largest proportion in both years.", "Fines made up the largest share in both years.", "Fines accounted for the largest percentage in both years.", "Fines accounted for the largest proportion of sentences in both years.", "Fines accounted for the largest share of sentences in both years.", "Fines made up the largest proportion of sentences in both years.", "Fines made up the largest share of sentences in both years.", "In both years, fines accounted for the largest proportion.", "In both years, fines accounted for the largest share.", "In both years, fines accounted for the largest proportion of sentences.", "In both years, fines accounted for the largest share of sentences."] },
      ],
    },

    { t: "h", text: "Phần V — Overview và nhóm số liệu (4 câu)" },
    {
      t: "p",
      text: "Dùng biểu đồ dưới đây cho Phần V và Phần VII. **Đề:** The bar chart shows the percentage of sentences of five types given by courts in one European country in 2003 and 2023.",
    },
    {
      t: "chart",
      kind: "bar",
      title: "Types of sentence given by courts, 2003 and 2023 (% of all sentences)",
      unit: "%",
      labels: ["Fine", "Prison", "Community service", "Probation", "Other"],
      series: [
        { name: "2003", values: [52, 21, 9, 12, 6] },
        { name: "2023", values: [38, 19, 22, 15, 6] },
      ],
    },
    {
      t: "mcq",
      id: "t3d4-bt-overview",
      title: "Chọn câu trả lời tốt nhất",
      items: [
        {
          q: "Trả lời Q1–Q4 cho hình trên. Hai điểm nào đáng đưa vào overview nhất?",
          options: [
            "Prison giảm 2 điểm phần trăm · Other giữ 6 %",
            "Fine là hình phạt phổ biến nhất ở cả hai năm dù giảm mạnh · Community service tăng hơn gấp đôi",
            "Probation tăng từ 12 % lên 15 % · Prison là 19 % năm 2023",
            "Toà án ngày càng nhân đạo hơn · chính phủ muốn tiết kiệm tiền",
          ],
          correct: 1,
          why: "B = **Q2 (ai nhất)** + **Q1 / thay đổi lớn nhất**. A và C là chi tiết nhỏ. D là **lý do / nhận xét ngoài hình**.",
        },
        {
          q: "Câu overview nào đạt mức band 6?",
          options: [
            "Overall, fines fell from 52% to 38% and community service rose from 9% to 22%.",
            "Overall, the chart shows five types of sentence in two years.",
            "Overall, community service became more popular because prisons are too expensive.",
            "Overall, fines remained the most common sentence in both years despite a marked fall, while the use of community service more than doubled.",
          ],
          correct: 3,
          why: "D có **hai điểm**, không số, không lý do. A có số. B nhắc lại nội dung hình. C đưa lý do.",
        },
        {
          q: "Chia thân bài thế nào hợp lý nhất?",
          options: [
            "Body 1: hình phạt **giảm** tỉ trọng (fine, prison) · Body 2: hình phạt **tăng** (community service, probation) + Other không đổi",
            "Body 1: năm 2003 · Body 2: năm 2023",
            "Năm đoạn, mỗi hình phạt một đoạn",
            "Body 1: fine + other · Body 2: prison + community service + probation",
          ],
          correct: 0,
          why: "A gom theo **chiều thay đổi** (cách ①). B tách hai năm làm mất phép so sánh trước–sau. C rời rạc. D không có tiêu chí chung.",
        },
        {
          q: "Câu nào so sánh ĐÚNG với số liệu?",
          options: [
            "In 2023, community service was the most common sentence.",
            "Prison sentences rose slightly between 2003 and 2023.",
            "By 2023, community service had overtaken prison as the second most common sentence.",
            "Fines accounted for less than a third of sentences in 2023.",
          ],
          correct: 2,
          why: "2003: prison 21 > community service 9; 2023: community service 22 > prison 19 → **đã vượt**, đứng thứ hai sau fine (38). A sai (fine 38 cao nhất). B sai (21 → 19 là giảm). D sai (38 % > một phần ba)." ,
        },
      ],
    },

    { t: "h", text: "Phần VI — Nghe giọng Canada (4 câu)" },
    {
      t: "listen",
      id: "t3d4-bt-nghe",
      title: "Thông báo của ban quản lý chung cư Maple Court",
      dan: { so: "Day 4, Homework recording", boiCanh: "an announcement to the residents of an apartment building in Canada.", cau: [1, 4] },
      note: "Khoảng 50 giây, giọng Canada (nam). Đọc 4 câu trước, nghe MỘT lần.",
      lines: [
        { who: "Manager", voice: "ca-nam", text: "Attention, residents of Maple Court. This is a reminder about Saturday's community clean-up.", vi: "Xin chú ý, cư dân Maple Court. Đây là lời nhắc về buổi dọn vệ sinh chung ngày thứ Bảy." },
        { who: "Manager", voice: "ca-nam", text: "We'll meet at eight thirty in the parkade, on level two, not in the lobby as we did last year.", vi: "Chúng ta gặp nhau lúc tám rưỡi ở nhà để xe, tầng hai, không phải ở sảnh như năm ngoái." },
        { who: "Manager", voice: "ca-nam", text: "Please bring your own gloves. Garbage bags and litter pickers will be provided.", vi: "Vui lòng tự mang găng tay. Túi rác và kẹp nhặt rác sẽ được phát." },
        { who: "Manager", voice: "ca-nam", text: "The city will collect everything at noon, so we need to be done by eleven forty-five at the latest.", vi: "Thành phố sẽ thu gom mọi thứ lúc mười hai giờ trưa, nên chúng ta cần xong muộn nhất là mười một giờ bốn mươi lăm." },
        { who: "Manager", voice: "ca-nam", text: "Afterwards there's a barbecue in the courtyard, behind the recycling depot. It's free for volunteers, but guests are asked to pay five dollars, and a loonie from each guest goes to the food bank.", vi: "Sau đó có tiệc nướng ở sân trong, phía sau trạm tái chế. Tình nguyện viên được miễn phí, còn khách mời vui lòng đóng năm đô, và một đô của mỗi khách sẽ được chuyển cho ngân hàng thực phẩm." },
        { who: "Manager", voice: "ca-nam", text: "If it rains, the clean-up moves to the following Saturday. Thanks, everyone.", vi: "Nếu trời mưa, buổi dọn dẹp chuyển sang thứ Bảy kế tiếp. Cảm ơn mọi người." },
      ],
    },
    {
      t: "quiz",
      id: "t3d4-bt-nghe-cau",
      title: "Questions 1–4 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "1. Volunteers will meet on level ___ of the parkade.", answers: ["two", "2"], hint: "không phải ở sảnh" },
        { q: "2. Volunteers should bring their own ___.", answers: ["gloves"], hint: "thứ KHÔNG được phát" },
        { q: "3. The work must be finished by ___.", answers: ["11.45", "11:45", "eleven forty-five", "eleven forty five", "11h45", "11.45 am", "11:45 am", "quarter to twelve", "a quarter to twelve"], hint: "trước giờ thành phố tới thu gom" },
        { q: "4. Each guest at the barbecue pays ___ dollars.", answers: ["five", "5"], hint: "loonie là phần trích ra, không phải giá" },
      ],
    },
    {
      t: "note",
      title: "Giải thích phần nghe",
      items: [
        "**1 — two.** “in the **parkade**, on **level two**, **not in the lobby**” — parkade = nhà để xe nhiều tầng (từ Canada).",
        "**2 — gloves.** “bring your own **gloves**. Garbage bags and litter pickers **will be provided**” — hai thứ sau được phát, không phải đáp án.",
        "**3 — 11.45.** “collect everything **at noon**, so we need to be done **by eleven forty-five**” — noon (12 giờ) là giờ thu gom, không phải hạn xong việc.",
        "**4 — five.** “guests are asked to pay **five dollars**, and **a loonie** (1 đô) from each guest goes to the food bank” — loonie là phần trích ra từ 5 đô.",
      ],
    },

    { t: "h", text: "Phần VII — Viết Task 1 (20 phút)" },
    {
      t: "essay",
      id: "t3d4-bt-viet",
      task: "Task 1",
      prompt: "The bar chart shows the percentage of sentences of five types given by courts in one European country in 2003 and 2023. 2003: fine 52%, prison 21%, community service 9%, probation 12%, other 6%. 2023: fine 38%, prison 19%, community service 22%, probation 15%, other 6%. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Overview 2 điểm: fine vẫn phổ biến nhất dù giảm mạnh · community service tăng hơn gấp đôi.",
        "Body 1: hai hình phạt giảm tỉ trọng (fine −14 điểm, prison −2 điểm). Body 2: hai hình phạt tăng (community service, probation) + other không đổi.",
        "Dùng từ của bài Từ vựng: fines, prison sentences, community service, probation, courts, offenders.",
        "So sánh có tính toán: more than doubled (9 → 22) · just over half (52 %) · overtook prison.",
        "Quá khứ đơn; by 2023 … had overtaken (quá khứ hoàn thành — Ngày 1).",
      ],
    },
  ],
};

export const NGAY_4: Lesson[] = [T3D4_VOCAB, T3D4_WRITING, T3D4_LISTENING, T3D4_HOMEWORK];
