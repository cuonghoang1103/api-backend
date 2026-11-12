/**
 * IELTS Tập 2 — Ngày 16 (tự soạn 12/11/2026, không chụp sách):
 *   Bài 1 · Vocabulary: Tiền bạc, mua sắm & tiêu dùng + collocation mở đầu   [VC14 VD3 · G07 vòng 2]
 *   Bài 2 · Reading:    Matching information (đoạn nào chứa thông tin)       [R13 · R07 ôn]
 *   Bài 3 · Writing:    Task 1 table — chọn số nổi bật                       [W11 W17 · W02]
 *   Bài tập: 42 câu (từ vựng, collocation, họ từ, dịch 💡, matching information, bảng Task 1, ôn N13/N15).
 *   Phát âm (1 khối): /ʌ/ – /ɑː/ – /æ/ qua từ tiền bạc (bổ sung — đề cương không ghi âm cho Ngày 16).
 *
 * Mọi câu ví dụ, bài đọc, số liệu, câu bài tập đều VIẾT MỚI (xem ../../SOAN-BAI.md).
 * Ranh giới chủ đề: KHÔNG dạy từ quảng cáo / thương hiệu (thuộc Ngày 18).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const T2D16_VOCAB: Lesson = {
  id: "t2d16-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Tiền bạc, mua sắm & tiêu dùng + Collocation (kết hợp từ) mở đầu",
  goal: "Dùng đúng 35 từ và cụm từ về tiền bạc – mua sắm – tiêu dùng, ghép từ theo đúng collocation (make a purchase, take out a loan, high prices…) thay vì dịch từng chữ — đẩy tiêu chí Lexical Resource (LR) của Writing và Speaking từ band 5 lên 5.5–6.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**20 từ cốt lõi** của chủ đề Money & Shopping (đề Task 2 và Speaking Part 1–3 rất hay hỏi): ==budget · debt · afford · bargain · refund · receipt · cashless · impulse buying · consumer…==",
        "**10 cụm động từ / cụm cố định**: pay off, save up, splash out, shop around, run out of, cut back on, get into debt, make ends meet…",
        "**Collocation** (kết hợp từ) = những từ **người bản xứ hay đi cùng nhau**: ==take out a loan==, không phải ~~borrow a loan~~. Học **theo cụm**, không học từ lẻ.",
        "**5 họ từ**: consume → consumer · consumption · consumerism; afford → affordable; economy → economic / economical; finance → financial; spend → spending · spender.",
        "Đẩy band nào: **LR band 5** = \"đủ dùng nhưng hạn chế, có lỗi chọn từ\"; **LR band 6** = \"đủ từ cho đề, dám thử từ ít gặp dù còn sai\"; **band 7** = \"có ý thức về văn phong và collocation\". Bài này là bước đầu tiên để nhảy từ 5 lên 6 và đặt nền cho band 7.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Chủ đề Tiền bạc & Mua sắm trong IELTS" },
    {
      t: "p",
      text: "Tiền bạc và mua sắm xuất hiện ở **cả ba phần thi có chấm từ vựng**: Speaking Part 1 (Do you like shopping? Do you prefer shopping online or in shops?), Part 2 (Describe something expensive you bought), Part 3 (Should children learn to manage money?), Writing Task 2 (đề về **consumerism** — chủ nghĩa tiêu dùng, **cashless society** — xã hội không tiền mặt, **debt** của người trẻ) và Task 1 (bảng **chi tiêu hộ gia đình** — bạn sẽ viết ngay ở bài Viết hôm nay).",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Bản đồ chủ đề Money & Shopping",
      caption: "Ba nhánh lớn của chủ đề. Mỗi nhánh có từ ở mục 2–3 và một câu mẫu ở mục 7.",
      center: "**Money & Shopping**",
      branches: [
        { label: "Quản lý tiền", items: ["income · budget · savings", "loan · debt · instalment", "afford · overspend"], anh: "money-bag" },
        { label: "Đi mua sắm", items: ["bargain · discount", "receipt · refund", "second-hand · cashless"], anh: "shopping-bags" },
        { label: "Người tiêu dùng & xã hội", items: ["consumer · retailer", "essentials · luxury", "impulse buying · materialistic"], anh: "department-store" },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. 20 từ cốt lõi" },
    { t: "p", text: "**Nhóm A — Quản lý tiền (8 từ).** Đây là nhóm dùng nhiều nhất trong Task 2 về tài chính cá nhân và Speaking Part 3." },
    {
      t: "vocab",
      items: [
        { w: "income", pos: "n", ipa: "/ˈɪnkʌm/", vi: "thu nhập (tiền kiếm được đều đặn)", ex: "Families on a low income spend most of their money on food and rent.", exVi: "Các gia đình thu nhập thấp tiêu phần lớn tiền vào thức ăn và tiền thuê nhà.", more: "**a low / high / regular income** · **on** a low income (sống bằng thu nhập thấp) · **disposable income** (thu nhập còn lại sau thuế và chi phí bắt buộc). ~~a cheap income~~ ✗." },
        { w: "budget", pos: "n, v", ipa: "/ˈbʌdʒɪt/", vi: "ngân sách (số tiền định chi); lập ngân sách", ex: "We set a weekly budget of two million dong for food.", exVi: "Chúng tôi đặt ngân sách hai triệu đồng mỗi tuần cho ăn uống.", more: "**set / stick to / go over** a budget · a **tight** budget (eo hẹp) · **on a budget** (tiết kiệm) · **budget airline** (hãng bay giá rẻ). Động từ: **budget for** sth." },
        { w: "savings", pos: "n (số nhiều)", ipa: "/ˈseɪvɪŋz/", vi: "tiền tiết kiệm", ex: "She used all her savings to open a small bakery.", exVi: "Cô ấy dùng toàn bộ tiền tiết kiệm để mở một tiệm bánh nhỏ.", more: "Nghĩa \"tiền dành dụm\" luôn có **-s**: ~~my saving~~ → **my savings** · a **savings account** (tài khoản tiết kiệm) · **life savings** (tiền dành dụm cả đời).", anh: "money-bag" },
        { w: "loan", pos: "n", ipa: "/ləʊn/", vi: "khoản vay", ex: "He took out a loan to pay for his master's degree.", exVi: "Anh ấy vay một khoản để trả tiền học thạc sĩ.", more: "**take out / get** a loan (đi vay) · **pay off / pay back / repay** a loan (trả hết) · a **student / bank** loan. ~~borrow a loan~~ ✗ (borrow **money**, take out a **loan**)." },
        { w: "debt", pos: "n", ipa: "/det/", vi: "nợ, món nợ", ex: "Many graduates start their working lives in debt.", exVi: "Nhiều sinh viên tốt nghiệp bắt đầu đi làm khi đang mắc nợ.", more: "Chữ **b câm**: /det/. **be in debt** (đang nợ) · **get into / run up** debt (mắc nợ) · **heavy debt** · **pay off** a debt. ~~make debt~~ ✗." },
        { w: "afford", pos: "v", ipa: "/əˈfɔːd/", vi: "có đủ tiền (để mua / làm gì)", ex: "Young couples in big cities can rarely afford to buy a flat.", exVi: "Các cặp đôi trẻ ở thành phố lớn hiếm khi đủ tiền mua căn hộ.", more: "Gần như luôn đi với **can / can't / be able to**: I **can't afford** it · **afford to + V** · **afford + N**. ~~I don't afford~~ ✗ → **I can't afford**." },
        { w: "instalment", pos: "n", ipa: "/ɪnˈstɔːlmənt/", vi: "khoản trả góp (một lần trả trong nhiều lần)", ex: "We are paying for the fridge in twelve monthly instalments.", exVi: "Chúng tôi trả góp tủ lạnh làm mười hai lần mỗi tháng.", more: "Chính tả Anh **instalment**, Mỹ **installment** (đều đúng). **pay in / by** instalments · a **monthly** instalment." },
        { w: "overspend", pos: "v", ipa: "/ˌəʊvəˈspend/", vi: "tiêu quá tay, chi vượt mức định", ex: "It is easy to overspend when you pay by card.", exVi: "Trả bằng thẻ thì rất dễ tiêu quá tay.", more: "Bất quy tắc như spend: **overspend – overspent – overspent** · danh từ **overspending** · **overspend on** sth / **overspend by** + số tiền." },
      ],
    },
    { t: "p", text: "**Nhóm B — Đi mua sắm (7 từ).** Hay gặp ở Listening Part 1–2 (cửa hàng, đổi trả hàng) và Speaking Part 1." },
    {
      t: "vocab",
      items: [
        { w: "bargain", pos: "n", ipa: "/ˈbɑːɡɪn/", vi: "món hời (mua được rẻ hơn giá trị thật)", ex: "This coat was half price — a real bargain!", exVi: "Cái áo khoác này giảm nửa giá — đúng là món hời!", more: "**a real / great** bargain · **bargain hunter** (người săn hàng hời). Động từ **bargain (with sb)** = mặc cả (= haggle)." },
        { w: "discount", pos: "n", ipa: "/ˈdɪskaʊnt/", vi: "sự giảm giá, chiết khấu", ex: "Students get a 20% discount on train tickets.", exVi: "Sinh viên được giảm 20% vé tàu.", more: "**get / give / offer** a discount · a discount **on** + món hàng · a discount **for** + người (for students) · **at a discount**. ~~buy a discount~~ ✗.", anh: "label" },
        { w: "receipt", pos: "n", ipa: "/rɪˈsiːt/", vi: "hoá đơn (biên lai) mua hàng", ex: "Keep the receipt in case you need to return the shoes.", exVi: "Giữ hoá đơn phòng khi bạn cần trả lại đôi giày.", more: "Chữ **p câm**: /rɪˈsiːt/. **keep / ask for** a receipt. Phân biệt: **bill** = hoá đơn phải trả (nhà hàng, tiền điện).", anh: "receipt" },
        { w: "refund", pos: "n, v", ipa: "/ˈriːfʌnd/ (n) · /rɪˈfʌnd/ (v)", vi: "tiền hoàn lại; hoàn tiền", ex: "The phone was faulty, so the shop gave me a full refund.", exVi: "Điện thoại bị lỗi nên cửa hàng hoàn lại toàn bộ tiền cho tôi.", more: "Danh từ nhấn **RE**-fund, động từ nhấn re-**FUND** (giống record, increase). **get / ask for / give** a refund · a **full** refund." },
        { w: "second-hand", pos: "adj, adv", ipa: "/ˌsekəndˈhænd/", vi: "đồ cũ, đã qua sử dụng", ex: "Buying second-hand clothes is cheaper and better for the planet.", exVi: "Mua quần áo cũ rẻ hơn và tốt cho Trái Đất hơn.", more: "a **second-hand** car / book · buy sth **second-hand** (trạng từ). Gần nghĩa: **used**, **pre-owned**. Trái nghĩa: **brand new**." },
        { w: "cashless", pos: "adj", ipa: "/ˈkæʃləs/", vi: "không dùng tiền mặt", ex: "Some cafés in Stockholm are completely cashless.", exVi: "Một số quán cà phê ở Stockholm hoàn toàn không nhận tiền mặt.", more: "a **cashless society / payment** · đối lập: **pay in cash** (trả tiền mặt) vs **pay by card** (trả thẻ). ~~pay by cash~~ thường bị coi là sai → **in** cash.", anh: "credit-card" },
        { w: "impulse buying", pos: "n", ipa: "/ˈɪmpʌls ˌbaɪɪŋ/", vi: "mua sắm bốc đồng (mua theo cảm hứng, không định trước)", ex: "Sweets next to the checkout encourage impulse buying.", exVi: "Kẹo đặt cạnh quầy thanh toán khuyến khích mua bốc đồng.", more: "an **impulse buy / purchase** (món mua bốc đồng) · **on impulse**: I bought it **on impulse**.", anh: "shopping-bags" },
      ],
    },
    { t: "p", text: "**Nhóm C — Người tiêu dùng & xã hội (5 từ).** Nhóm \"học thuật\" nhất — dùng cho Writing Task 2 và Speaking Part 3." },
    {
      t: "vocab",
      items: [
        { w: "consumer", pos: "n", ipa: "/kənˈsjuːmə(r)/", vi: "người tiêu dùng", ex: "Consumers today compare prices online before they buy.", exVi: "Người tiêu dùng ngày nay so giá trên mạng trước khi mua.", more: "**consumer spending** (chi tiêu tiêu dùng) · **consumer goods** (hàng tiêu dùng) · **consumer rights** (quyền người tiêu dùng). Xem họ từ ở mục 6.", anh: "shopping-cart" },
        { w: "retailer", pos: "n", ipa: "/ˈriːteɪlə(r)/", vi: "nhà bán lẻ (cửa hàng / công ty bán cho người mua cuối)", ex: "Online retailers can offer lower prices because they do not pay rent for shops.", exVi: "Các nhà bán lẻ trực tuyến có thể bán rẻ hơn vì không phải trả tiền thuê cửa hàng.", more: "**retail** (n, bán lẻ) · **the retail sector** · **an online / a major** retailer. Đối lập: **wholesaler** (nhà bán buôn).", anh: "department-store" },
        { w: "essentials", pos: "n (số nhiều)", ipa: "/ɪˈsenʃlz/", vi: "đồ thiết yếu (thứ bắt buộc phải có: ăn, ở, đi lại…)", ex: "When prices rise, poor families can only afford the essentials.", exVi: "Khi giá tăng, gia đình nghèo chỉ đủ tiền mua đồ thiết yếu.", more: "**daily / basic essentials** · tính từ **essential** (thiết yếu). Đối lập: **luxuries**. (necessity — đã học Tập 1 — gần nghĩa.)" },
        { w: "luxury", pos: "n, adj", ipa: "/ˈlʌkʃəri/", vi: "sự xa xỉ; món xa xỉ; (thuộc) cao cấp", ex: "For my grandparents, eating out was a luxury.", exVi: "Với ông bà tôi, ăn ở ngoài là một sự xa xỉ.", more: "a **luxury** car / hotel · **luxury** goods · **luxurious** /lʌɡˈʒʊəriəs/ (adj, sang trọng — chú ý âm đổi!) · ~~a luxury price~~ → **a high price**." },
        { w: "materialistic", pos: "adj", ipa: "/məˌtɪəriəˈlɪstɪk/", vi: "thực dụng, coi trọng của cải vật chất", ex: "Some people think young people have become too materialistic.", exVi: "Một số người cho rằng giới trẻ đã trở nên quá coi trọng vật chất.", more: "Danh từ **materialism** · **a materialistic society / attitude**. Trái nghĩa gần: **value experiences over possessions** (coi trọng trải nghiệm hơn của cải)." },
      ],
    },
    {
      t: "hinh",
      title: "Đồ vật quanh chuyện tiền — nhìn hình, nói từ (bổ sung để nghe Listening Part 1–2)",
      items: [
        { anh: "credit-card", w: "credit card", ro: "/ˈkredɪt kɑːd/", vi: "thẻ tín dụng" },
        { anh: "coin", w: "coin", ro: "/kɔɪn/", vi: "đồng xu" },
        { anh: "dollar-banknote", w: "banknote (US: bill)", ro: "/ˈbæŋknəʊt/", vi: "tờ tiền giấy" },
        { anh: "purse", w: "purse / wallet", ro: "/pɜːs/ · /ˈwɒlɪt/", vi: "ví (purse: ví nữ / ví tiền xu; wallet: ví nam, ví gấp)" },
        { anh: "shopping-cart", w: "trolley (US: shopping cart)", ro: "/ˈtrɒli/", vi: "xe đẩy siêu thị" },
        { anh: "label", w: "price tag", ro: "/ˈpraɪs tæɡ/", vi: "mác giá" },
        { anh: "bank", w: "bank", ro: "/bæŋk/", vi: "ngân hàng" },
        { anh: "receipt", w: "receipt", ro: "/rɪˈsiːt/", vi: "hoá đơn mua hàng" },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. 10 cụm động từ & cụm cố định về tiền" },
    {
      t: "p",
      text: "Cụm động từ (phrasal verb) làm **Speaking** nghe tự nhiên hẳn; trong **Writing Task 2** dùng được nhưng nên chọn cụm trung tính (pay off, cut back on, save up). Cụm **splash out**, **make ends meet** hợp với văn nói hơn.",
    },
    {
      t: "vocab",
      items: [
        { w: "pay off", pos: "phr v", ipa: "/ˌpeɪ ˈɒf/", vi: "trả hết (nợ, khoản vay)", ex: "It took my parents twenty years to pay off their mortgage.", exVi: "Bố mẹ tôi mất hai mươi năm mới trả hết khoản vay mua nhà.", more: "**pay off** a debt / a loan · tách được: **pay it off** (đại từ đứng giữa). Nghĩa 2: thành công, \"được đền đáp\" — Hard work **pays off**." },
        { w: "pay back", pos: "phr v", ipa: "/ˌpeɪ ˈbæk/", vi: "trả lại (tiền đã mượn) cho ai", ex: "Can you lend me 100,000 dong? I'll pay you back tomorrow.", exVi: "Cho mình mượn 100 nghìn được không? Mai mình trả lại.", more: "**pay sb back** · **pay back** a loan (= repay). pay off nhấn \"trả HẾT\"; pay back nhấn \"trả LẠI cho người cho mượn\"." },
        { w: "save up (for)", pos: "phr v", ipa: "/ˌseɪv ˈʌp/", vi: "dành dụm (cho một món cụ thể)", ex: "I'm saving up for a new laptop.", exVi: "Tôi đang dành dụm để mua máy tính xách tay mới.", more: "**save up for** + N · **save up to** + V. ~~save up money for buy~~ ✗ → save up **to buy** / save up **for** a laptop." },
        { w: "splash out (on)", pos: "phr v", ipa: "/ˌsplæʃ ˈaʊt/", vi: "vung tiền (chi nhiều cho thứ mình thích)", ex: "We splashed out on a nice hotel for our anniversary.", exVi: "Chúng tôi chi đậm cho một khách sạn đẹp nhân dịp kỷ niệm.", more: "Thân mật, hợp Speaking. **splash out on** + N. Gần nghĩa trang trọng hơn: **spend a large amount on**." },
        { w: "shop around", pos: "phr v", ipa: "/ˌʃɒp əˈraʊnd/", vi: "so giá nhiều nơi trước khi mua", ex: "It's worth shopping around before you buy a phone.", exVi: "Nên so giá vài nơi trước khi mua điện thoại.", more: "**shop around for** + N · It's worth **shopping** around (worth + V-ing — nối với gerund Ngày 11)." },
        { w: "run out of", pos: "phr v", ipa: "/ˌrʌn ˈaʊt əv/", vi: "hết, cạn (tiền, thời gian, hàng)", ex: "By the end of the month, many students run out of money.", exVi: "Đến cuối tháng, nhiều sinh viên hết sạch tiền.", more: "**run out of** + N (người là chủ ngữ) · **N + runs out** (vật là chủ ngữ): My money **ran out**. ~~I ran out money~~ ✗ (thiếu **of**)." },
        { w: "cut back (on)", pos: "phr v", ipa: "/ˌkʌt ˈbæk/", vi: "cắt giảm (chi tiêu, thói quen)", ex: "We're cutting back on eating out to save money.", exVi: "Chúng tôi đang cắt giảm ăn ngoài để tiết kiệm.", more: "**cut back on** + N / V-ing · danh từ **cutbacks** (sự cắt giảm ngân sách). Gần nghĩa **cut down on** (Tập 1)." },
        { w: "get into debt", pos: "phrase", ipa: "/ˌɡet ˌɪntə ˈdet/", vi: "mắc nợ, rơi vào cảnh nợ nần", ex: "Credit cards make it easy for young people to get into debt.", exVi: "Thẻ tín dụng khiến người trẻ dễ mắc nợ.", more: "Cũng nói **go / fall / run into** debt · trạng thái: **be in debt** · thoát nợ: **get out of debt**." },
        { w: "make ends meet", pos: "idiom", ipa: "/ˌmeɪk ˌendz ˈmiːt/", vi: "xoay xở đủ sống (thu vừa đủ chi)", ex: "With two children and one salary, they struggle to make ends meet.", exVi: "Hai con mà chỉ một nguồn lương, họ chật vật mới đủ sống.", more: "Luôn là **make** (~~do ends meet~~) · hay đi với **struggle to / find it hard to**." },
        { w: "live within your means", pos: "phrase", ipa: "/ˌlɪv wɪˌðɪn jɔː ˈmiːnz/", vi: "sống trong khả năng tài chính của mình", ex: "The best way to avoid debt is to live within your means.", exVi: "Cách tốt nhất để tránh nợ là sống vừa với khả năng tài chính.", more: "**means** (luôn có -s) = khả năng tài chính. Trái nghĩa: **live beyond your means** (sống quá khả năng). Rất hợp câu kết Task 2." },
      ],
    },
    {
      t: "rule",
      formula: "take out / pay off / pay back a loan · be in / get into debt · save up for + N · splash out on + N · run out of + N · cut back on + N / V-ing",
      vi: "Giới từ là một phần của cụm — thiếu giới từ là sai (~~run out money~~, ~~splash out a hotel~~).",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Collocation là gì? 5 kiểu kết hợp (mở đầu)" },
    {
      t: "p",
      text: "**Collocation** (kết hợp từ) là những từ **thường đi cùng nhau** trong tiếng Anh tự nhiên. Không có luật logic nào bắt buộc — người bản xứ **quen** nói như vậy. Ví dụ tiếng Việt nói \"**vay** tiền\" và \"**mượn** sách\"; tiếng Anh nói **take out a loan** chứ không nói ~~borrow a loan~~, dù nghĩa \"vay\" rất gần borrow. Ở **Tập 1 Ngày 11** bạn đã gặp collocation lần đầu (heavy traffic, make a decision, impact on). Hôm nay ta **hệ thống hoá** thành 5 kiểu và áp vào chủ đề tiền.",
    },
    {
      t: "note",
      title: "Vì sao collocation đẩy band từ vựng?",
      items: [
        "Band descriptor Writing **LR band 7** ghi rõ: dùng từ ít gặp \"with **some awareness of style and collocation**\" (có ý thức về văn phong và kết hợp từ); band 8 chỉ còn \"occasional inaccuracies in word choice and **collocation**\". Band 6 mới là \"attempts to use less common vocabulary but with some inaccuracy\" — tức muốn qua band 6 thì phải ghép từ đúng.",
        "Giám khảo không chỉ hỏi \"bạn biết bao nhiêu từ?\" mà hỏi \"bạn **ghép** chúng có tự nhiên không?\". Một câu toàn từ dễ nhưng đúng collocation (**set a budget**, **heavy debt**) được điểm hơn một câu có từ khó ghép sai (~~make a heavy budget~~).",
        "Collocation sai là lỗi **LR** chứ không phải lỗi ngữ pháp: câu đúng ngữ pháp vẫn bị trừ nếu ~~do a purchase~~, ~~strong prices~~.",
      ],
    },
    {
      t: "table",
      caption: "5 kiểu collocation hay gặp nhất — ví dụ chủ đề tiền bạc",
      head: ["Kiểu", "Ví dụ đúng", "Câu ví dụ", "Dịch"],
      rows: [
        ["**V + N** (động từ + danh từ)", "**make** a purchase · **set** a budget · **take out** a loan · **save / waste** money · **pay** a bill", "We **wasted** a lot of **money** on things we never used.", "Chúng tôi phí rất nhiều tiền vào những thứ không bao giờ dùng."],
        ["**adj + N** (tính từ + danh từ)", "**high / low** prices · **heavy** debt · a **tight** budget · a **full** refund · **disposable** income", "Students often live on a **tight budget**.", "Sinh viên thường sống với ngân sách eo hẹp."],
        ["**adv + adj** (trạng từ + tính từ)", "**reasonably** priced · **ridiculously** expensive · **financially** independent", "The café is small but **reasonably priced**.", "Quán nhỏ nhưng giá cả phải chăng."],
        ["**N + N** (danh từ + danh từ)", "**price** tag · **credit** card · **shopping** habits · **consumer** spending", "Online shopping has changed our **shopping habits**.", "Mua sắm trực tuyến đã thay đổi thói quen mua sắm của chúng ta."],
        ["**V / N / adj + prep** (kèm giới từ)", "spend money **on** · pay **for** · a discount **on** · save **for** · be short **of** money", "I'm a bit **short of money** this week.", "Tuần này tôi hơi thiếu tiền."],
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Một danh từ — một chùm collocation: học \"money\" theo cụm",
      caption: "Thay vì học \"money = tiền\", hãy học cả chùm. Lần sau cần nói về tiền, bạn có sẵn 12 cụm để chọn.",
      center: "**money**",
      branches: [
        { label: "Động từ đứng trước", items: ["save / spend / waste money", "earn / make money", "borrow / lend money"] },
        { label: "Tính từ / danh từ đứng trước", items: ["pocket money", "easy money", "public money"] },
        { label: "Cụm có giới từ", items: ["spend money on sth", "short of money", "value for money"] },
        { label: "Thành ngữ", items: ["money is tight (eo hẹp)", "money doesn't grow on trees"] },
      ],
    },
    {
      t: "note",
      title: "Mẹo học collocation cho người mới",
      items: [
        "**Chép cả cụm**, không chép từ lẻ: trong sổ ghi ==take out a loan== chứ không ghi \"loan = khoản vay\".",
        "Khi đọc / nghe, gặp danh từ quen thì để ý **động từ đứng trước nó** — đó thường là collocation đáng học (a person **runs** a business, **makes** a profit).",
        "Tra từ điển collocation miễn phí: gõ \"**ozdic** + từ\" hoặc xem phần **Collocations** trong Oxford Learner's / Cambridge Dictionary.",
        "Mỗi từ mới chỉ cần **1–2 collocation** hay dùng nhất — đừng cố học hết.",
      ],
    },
    {
      t: "rule",
      formula: "V + N (make a purchase) · adj + N (a tight budget) · adv + adj (reasonably priced) · N + N (price tag) · từ + giới từ (spend money on)",
      vi: "Học từ theo CỤM nó hay đi cùng; câu đúng ngữ pháp mà ghép sai cụm vẫn mất điểm Lexical Resource.",
    },

    /* ── 5 ── */
    { t: "h", text: "5. Lỗi dịch từng chữ của người Việt" },
    {
      t: "sodo",
      kind: "compare",
      title: "Dịch từng chữ → collocation đúng",
      caption: "Cột trái là câu \"nghĩ bằng tiếng Việt rồi dịch\". Cột phải là cách người bản xứ nói.",
      cols: [
        {
          title: "~~Dịch từng chữ~~",
          anh: "cross-mark",
          items: [
            "~~borrow a loan~~ (vay một khoản)",
            "~~buy a discount~~ (mua được giảm giá)",
            "~~spend money to buy clothes~~",
            "~~make debt~~ (gây nợ)",
            "~~a cheap salary~~ (lương rẻ)",
            "~~pay the money for the tickets~~",
          ],
        },
        {
          title: "Collocation đúng",
          anh: "check-mark-button",
          items: [
            "**take out** a loan",
            "**get** a discount (on sth)",
            "spend money **on** clothes",
            "**get into** debt",
            "a **low** salary / wage",
            "**pay for** the tickets",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Hai cặp hay gây tranh cãi",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["**go shopping**", "đi mua sắm (thường cho vui: quần áo, đồ dùng)", "We **go shopping** at the mall on Saturdays."],
        ["**do the shopping**", "đi chợ / mua đồ thiết yếu hằng tuần (có **the**)", "My dad **does the shopping** every Sunday."],
        ["~~do shopping~~", "thiếu **the** — nghe không tự nhiên", "→ **go shopping** hoặc **do the shopping**"],
        ["**borrow** money **from** sb", "MƯỢN (mình nhận tiền)", "I **borrowed** money **from** my sister."],
        ["**lend** money **to** sb / lend sb money", "CHO MƯỢN (mình đưa tiền)", "My sister **lent** me money. / ~~My sister borrowed me money.~~"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: price đi với high / low",
      items: [
        "**price / cost / fee / rent / salary / wage** đi với **high / low** (đã gặp ở Tập 1 Ngày 11 với price). **expensive / cheap** dùng cho **món đồ hoặc dịch vụ**: The flat is **expensive**. / The rent is **high**.",
        "Nói \"giá cả phải chăng\": **affordable** prices / **reasonably priced** — không nói ~~soft prices~~ hay ~~sweet prices~~.",
        "\"Tốn nhiều tiền\": **cost a lot (of money)** / **be costly**: The trip **cost** a lot — không nói ~~The trip took a lot of money~~ (take + thời gian: take time; với tiền chỉ gặp trong khuôn **It takes money to + V**).",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Năm họ từ (word families)" },
    {
      t: "p",
      text: "Đổi **loại từ** (danh từ ↔ động từ ↔ tính từ) là cách paraphrase cấp 2 bạn đã gặp ở Ngày 8 — và là chỗ người viết band 5 hay sai (~~the consume of energy~~). Năm họ từ dưới đây gặp liên tục trong Task 1 (chi tiêu) và Task 2 (tiêu dùng).",
    },
    {
      t: "table",
      caption: "Họ từ — học cả hàng, nhớ trọng âm",
      head: ["Động từ / gốc", "Danh từ", "Tính từ", "Ghi chú"],
      rows: [
        ["consume /kənˈsjuːm/ (tiêu thụ)", "consumer · **consumption** /kənˈsʌmpʃn/ · **consumerism**", "consumerist", "consumption của **energy / food / water**; consumerism = chủ nghĩa tiêu dùng"],
        ["afford /əˈfɔːd/", "affordability", "**affordable** · unaffordable", "affordable housing (nhà ở giá phải chăng)"],
        ["— (economy /ɪˈkɒnəmi/)", "economy · economist", "**economic** (thuộc kinh tế) · **economical** (tiết kiệm)", "economic growth ≠ an economical car — dễ nhầm!"],
        ["finance /ˈfaɪnæns/ (cấp vốn)", "finance · finances (tình hình tiền nong)", "**financial** · financially (adv)", "financial problems · financially independent"],
        ["spend /spend/ (spent)", "**spending** · **spender** · expenditure (trang trọng)", "—", "consumer spending · a big spender (người tiêu hoang)"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "consumerism", pos: "n", ipa: "/kənˈsjuːmərɪzəm/", vi: "chủ nghĩa tiêu dùng (xã hội coi việc mua sắm là trung tâm)", ex: "Critics say consumerism creates huge amounts of waste.", exVi: "Những người phản đối nói chủ nghĩa tiêu dùng tạo ra lượng rác khổng lồ.", more: "Họ: consume (v) · consumer (n, người) · **consumption** (n, sự tiêu thụ — đã gặp Tập 1) · consumerist (adj). ~~the consume of~~ ✗ → **the consumption of**." },
        { w: "affordable", pos: "adj", ipa: "/əˈfɔːdəbl/", vi: "giá phải chăng, đủ tiền mua được", ex: "The government should build more affordable housing.", exVi: "Chính phủ nên xây thêm nhà ở giá phải chăng.", more: "**affordable** housing / prices / childcare · trái nghĩa **unaffordable** · danh từ **affordability**." },
        { w: "economical", pos: "adj", ipa: "/ˌiːkəˈnɒmɪkl/", vi: "tiết kiệm (ít tốn tiền / nhiên liệu)", ex: "Small cars are more economical than large ones.", exVi: "Xe nhỏ tiết kiệm hơn xe lớn.", more: "**economical** = tiết kiệm ≠ **economic** = thuộc về kinh tế (economic growth). Cùng trọng âm **-NO-**: e-co-NO-mic(al). Cũng đọc /ˌekəˈnɒmɪkl/." },
        { w: "financial", pos: "adj", ipa: "/faɪˈnænʃl/", vi: "(thuộc) tài chính", ex: "Many students have financial problems in their first year.", exVi: "Nhiều sinh viên gặp khó khăn tài chính năm thứ nhất.", more: "**financial** problems / support / advice · **financially** independent (tự lập về tài chính). Gốc: **finance** /ˈfaɪnæns/." },
        { w: "spender", pos: "n", ipa: "/ˈspendə(r)/", vi: "người tiêu tiền (theo một kiểu nào đó)", ex: "My brother is a big spender — he buys new clothes every week.", exVi: "Anh tôi tiêu tiền rất mạnh tay — tuần nào cũng mua quần áo mới.", more: "**a big / careful spender** · họ: spend (v) · **spending** (n, sự chi tiêu: consumer spending) · **expenditure** (n, trang trọng, Task 1)." },
      ],
    },
    {
      t: "rule",
      formula: "consume (v) → consumer (người) · consumption (sự tiêu thụ) · consumerism (chủ nghĩa) · economic (kinh tế) ≠ economical (tiết kiệm)",
      vi: "Sau mạo từ / tính từ / giới từ cần DANH TỪ: the consumption of, financial support, consumer spending.",
    },

    /* ── 7 ── */
    { t: "h", text: "7. Bốn câu mẫu ăn điểm (Writing Task 2 · Speaking)" },
    {
      t: "p",
      text: "Mỗi câu gói **3–4 collocation** của bài. Học thuộc **khung**, thay ý theo đề — đừng chép nguyên câu vào bài thi (giám khảo nhận ra câu học thuộc).",
    },
    {
      t: "examples",
      items: [
        { en: "Many young people get into debt because they use credit cards to buy things they cannot afford.", vi: "Nhiều người trẻ mắc nợ vì dùng thẻ tín dụng để mua những thứ họ không đủ tiền mua. (Task 2 — nêu vấn đề)" },
        { en: "Setting a monthly budget is one of the most effective ways to avoid overspending.", vi: "Đặt ngân sách hằng tháng là một trong những cách hiệu quả nhất để tránh tiêu quá tay. (Task 2 — giải pháp)" },
        { en: "Cashless payments are convenient, but they also make it easier to lose track of how much we spend.", vi: "Thanh toán không tiền mặt rất tiện, nhưng cũng khiến ta dễ mất kiểm soát mình đã tiêu bao nhiêu. (Task 2 — nhượng bộ)" },
        { en: "To be honest, I'm quite a careful spender. I usually shop around and wait for a discount before I buy anything expensive.", vi: "Thật ra tôi khá cẩn thận khi tiêu tiền. Tôi thường so giá vài nơi và chờ giảm giá trước khi mua thứ gì đắt. (Speaking Part 1)" },
      ],
    },
    {
      t: "rule",
      formula: "S + get into debt because… · Setting a budget is one of the most effective ways to + V · … are convenient, but they also make it easier to + V",
      vi: "Ba khung câu Task 2 về tiền: nguyên nhân – giải pháp – nhượng bộ.",
    },

    /* ── 8 ── */
    { t: "h", text: "8. Luyện tập" },
    {
      t: "mcq",
      id: "t2d16-tv-colloc",
      title: "Chọn từ tạo collocation đúng (8 câu)",
      items: [
        { q: "I always ___ a budget at the start of the month.", options: ["set", "do", "open"], correct: 0, why: "**set a budget** (đặt ngân sách) — V + N. ~~do a budget~~ / ~~open a budget~~ không phải cách nói của người bản xứ." },
        { q: "Many students ___ a loan to pay their tuition fees.", options: ["make", "take out", "borrow"], correct: 1, why: "**take out a loan** = đi vay. ~~borrow a loan~~ là lỗi dịch \"vay khoản vay\": borrow đi với **money** (borrow money from the bank). make a loan = (ngân hàng) cho vay — sai vai." },
        { q: "House prices in this area are very ___, so most young families can't buy a flat.", options: ["cheap", "expensive", "high"], correct: 2, why: "**price** đi với **high / low**. ~~expensive prices~~ sai collocation (expensive tả món đồ: the flat is expensive). cheap sai cả nghĩa (rẻ thì đã mua được)." },
        { q: "She got a 30% discount ___ her new laptop.", options: ["on", "at", "to"], correct: 0, why: "**a discount on** + món hàng. (a discount **for** + người: for students.) at và to không đi với discount trong nghĩa này." },
        { q: "We had to ___ money from my parents to buy the car.", options: ["lend", "pay", "borrow"], correct: 2, why: "Mình **nhận** tiền → **borrow** money **from** sb. lend = cho mượn (lend money **to** sb) — sai hướng; pay money from… không có nghĩa \"mượn\"." },
        { q: "I'm ___ for a new phone, so I don't eat out any more.", options: ["saving down", "saving up", "spending up"], correct: 1, why: "**save up for** + N = dành dụm cho một món cụ thể. ~~save down~~ / ~~spend up~~ không tồn tại." },
        { q: "The restaurant is ___ priced: good food at a fair price.", options: ["reasonably", "heavily", "deeply"], correct: 0, why: "adv + adj: **reasonably priced** = giá phải chăng. heavily đi với **taxed / in debt**; deeply đi với **worried / concerned**." },
        { q: "After losing his job, he found it hard to ___ ends meet.", options: ["do", "get", "make"], correct: 2, why: "Thành ngữ cố định **make ends meet** (xoay xở đủ sống) — không thay make bằng động từ khác." },
      ],
    },
    {
      t: "quiz",
      id: "t2d16-tv-dien",
      title: "Điền một từ (8 câu)",
      kind: "fill",
      items: [
        { q: "Keep the ___ in case you need to return the shoes. (hoá đơn)", answers: ["receipt"] },
        { q: "The phone was faulty, so the shop gave me a full ___. (tiền hoàn lại)", answers: ["refund"] },
        { q: "These boots were only £15 in the sale — a real ___! (món hời)", answers: ["bargain"] },
        { q: "Credit cards make it easy to ___, or spend more than you planned. (tiêu quá tay)", answers: ["overspend"] },
        { q: "He bought a ___ bike because a new one was too expensive. (cũ, đã qua sử dụng)", answers: ["second-hand", "secondhand", "second hand", "used"] },
        { q: "Sweden is becoming a ___ society: few people use notes and coins. (không tiền mặt)", answers: ["cashless"] },
        { q: "Buying sweets at the checkout is a classic example of ___ buying. (bốc đồng)", answers: ["impulse"] },
        { q: "We are paying for the sofa in twelve monthly ___. (khoản trả góp)", answers: ["instalments", "installments"] },
      ],
    },
    {
      t: "quiz",
      id: "t2d16-tv-dich",
      title: "Dịch sang tiếng Anh — dùng đúng collocation (5 câu)",
      kind: "translate",
      grammar: "can't afford + N / to V · get into debt · shop around · pay off a loan · a tight budget · buy (the) essentials",
      items: [
        { q: "Tôi không đủ tiền mua một chiếc ô tô mới.", hint: "can't afford, a new car", answers: ["I can't afford a new car.", "I can't afford to buy a new car.", "I cannot afford a new car.", "I cannot afford to buy a new car.", "I can't afford to buy a brand new car.", "I can't afford a brand new car."] },
        { q: "Nhiều người trẻ mắc nợ vì họ dùng thẻ tín dụng quá nhiều.", hint: "get into debt, because, use credit cards too much", answers: ["Many young people get into debt because they use credit cards too much.", "Many young people get into debt because they use their credit cards too much.", "Many young people get into debt because they use credit cards too often.", "Many young people get into debt because they use their credit cards too often.", "A lot of young people get into debt because they use credit cards too much.", "Many young people go into debt because they use credit cards too much."] },
        { q: "Bạn nên so giá vài nơi trước khi mua điện thoại.", hint: "should, shop around, before buying / before you buy, a phone", answers: ["You should shop around before buying a phone.", "You should shop around before you buy a phone.", "You should compare prices in a few shops before buying a phone.", "You should compare prices in a few shops before you buy a phone.", "You should shop around before you buy a mobile phone."] },
        { q: "Cô ấy đã trả hết khoản vay trong năm năm.", hint: "paid off, the / her loan, in five years", answers: ["She paid off the loan in five years.", "She paid off her loan in five years.", "She paid the loan off in five years.", "She paid her loan off in five years.", "She paid off the loan within five years.", "She paid off her loan within five years.", "She paid back the loan in five years.", "She paid back her loan in five years."] },
        { q: "Ngân sách tháng này eo hẹp nên chúng tôi chỉ mua đồ thiết yếu.", hint: "Our budget is tight / We have a tight budget, this month, so, only buy, essentials", answers: ["Our budget is tight this month, so we only buy essentials.", "Our budget is tight this month, so we only buy the essentials.", "We have a tight budget this month, so we only buy essentials.", "We have a tight budget this month, so we only buy the essentials.", "This month our budget is tight, so we only buy essentials.", "This month our budget is tight, so we only buy the essentials.", "Our budget is tight this month, so we are only buying essentials.", "Our budget is tight this month, so we're only buying the essentials."] },
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Thêm: phát âm /ʌ/ – /ɑː/ – /æ/ qua từ tiền bạc" },
    {
      t: "p",
      text: "Phần này đề cương không ghi — thêm vì **ba nguyên âm này nằm trong gần hết từ chủ đề hôm nay** (money, budget, bargain, card, cash, tax) và người Việt hay đọc cả ba thành \"a\". Nghe Listening Part 1 cửa hàng, nhầm **cut /kʌt/ – cart /kɑːt/ – cat /kæt/** là điền sai.",
    },
    {
      t: "table",
      head: ["Âm", "Miệng & lưỡi", "Gần với tiếng Việt", "Từ hôm nay"],
      rows: [
        ["**/ʌ/** (ngắn)", "miệng mở vừa, lưỡi ở giữa, **thả lỏng**, rất ngắn", "gần **â / ă** trong \"ân\", \"căn\"", "m**o**ney · b**u**dget · c**u**stomer · l**u**xury · ref**u**nd · m**u**ch"],
        ["**/ɑː/** (dài)", "miệng mở **rộng**, lưỡi hạ thấp và lùi về sau, kéo dài", "\"a\" kéo dài, giọng trầm (\"aaa\" khi bác sĩ khám họng)", "b**a**rgain · c**a**rd · m**a**rket · ch**a**rge · **a**sk (UK)"],
        ["**/æ/** (ngắn)", "miệng mở rộng **sang ngang**, hàm hạ, giữa \"e\" và \"a\"", "**không có** trong tiếng Việt — đọc \"e\" nhưng há miệng to như \"a\"", "c**a**sh · t**a**x · b**a**nk · s**a**lary · c**a**shless"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "Đọc **/æ/** thành \"a\" Việt: cash nghe như ~~\"cát\"~~. Hãy kéo hai khoé miệng sang ngang như sắp cười, hạ hàm: /kæʃ/.",
        "Đọc **/ɑː/** quá ngắn: card nghe như cut. /ɑː/ phải **dài gấp đôi**. Giọng Anh **không đọc r** trong card, market, bargain (/kɑːd/); giọng Mỹ có r.",
        "Bỏ âm cuối: cash → \"ca\", bank → \"ban\", tax → \"tác\". Giữ **/ʃ/**, **/ŋk/**, **/ks/** cuối (Tập 2 Ngày 1: âm cuối).",
        "**money**, **customer**, **luxury** viết bằng chữ **o / u** nhưng đều là **/ʌ/** — đừng đọc \"mô-ni\".",
      ],
    },
    {
      t: "phatam",
      id: "t2d16-phat-am",
      title: "Luyện phát âm — /ʌ/ · /ɑː/ · /æ/",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Ba dòng đầu luyện từng âm, hai dòng giữa là bộ ba dễ nhầm, ba dòng cuối đọc trong câu. Giữ /ɑː/ dài, /ʌ/ và /æ/ ngắn.",
      items: [
        { text: "money, budget, customer, luxury", ipa: "mʌni bʌdʒɪt kʌstəmə lʌkʃəri", vi: "/ʌ/ — ngắn, miệng mở vừa" },
        { text: "bargain, card, market, charge", ipa: "bɑːɡɪn kɑːd mɑːkɪt tʃɑːdʒ", vi: "/ɑː/ — dài, không đọc r (giọng Anh)" },
        { text: "cash, tax, bank, salary", ipa: "kæʃ tæks bæŋk sæləri", vi: "/æ/ — há miệng sang ngang" },
        { text: "cut, cart, cat", ipa: "kʌt kɑːt kæt", vi: "bộ ba /ʌ/ · /ɑː/ · /æ/" },
        { text: "hut, heart, hat", ipa: "hʌt hɑːt hæt", vi: "bộ ba /ʌ/ · /ɑː/ · /æ/" },
        { text: "I paid by card at the market and got a bargain.", ipa: "aɪ peɪd baɪ kɑːd ət ðə mɑːkɪt ənd ɡɒt ə bɑːɡɪn", vi: "/ɑː/ trong card, market, bargain" },
        { text: "The customer paid cash and asked for a refund.", ipa: "ðə kʌstəmə peɪd kæʃ ənd ɑːskt fər ə riːfʌnd", vi: "/ʌ/ customer, refund · /æ/ cash · /ɑː/ asked" },
        { text: "Tax on luxury cars is much higher than last year.", ipa: "tæks ɒn lʌkʃəri kɑːz ɪz mʌtʃ haɪə ðən lɑːst jɪə", vi: "/æ/ tax · /ʌ/ luxury, much · /ɑː/ cars, last" },
      ],
    },
  ],
};

/* ─────────────────────────── Đọc ─────────────────────────── */

const T2D16_READING: Lesson = {
  id: "t2d16-doc",
  kind: "reading",
  title: "Đọc: Matching information — đoạn nào chứa thông tin?",
  goal: "Làm được dạng Matching information (tìm đoạn chứa một chi tiết: ví dụ, lý do, con số, mô tả) với bài đọc ~720 từ: biết loại thông tin cần dò, chịu được thứ tự câu hỏi không theo bài và quy tắc NB — đẩy Reading từ ~13 lên 15+ câu đúng (band 4.5 → 5.0).",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Matching information** hỏi: ==Which paragraph contains the following information?== — đoạn nào **chứa một CHI TIẾT** (một ví dụ, một lý do, một con số, một lời giải thích…).",
        "Khác **Matching headings** (Ngày 12): headings tìm **ý chính cả đoạn**; matching information tìm **một chi tiết nhỏ** nằm đâu đó trong đoạn.",
        "Câu hỏi **KHÔNG theo thứ tự** bài; **NB You may use any letter more than once** = một đoạn có thể là đáp án **nhiều lần**, và có đoạn **không là đáp án** nào.",
        "Chìa khoá: gạch **loại thông tin** (an example of / a reason for / a description of / a reference to…) + **từ khoá nội dung**, rồi dò bài bằng paraphrase.",
        "Đẩy band nào: Reading **band 5.0 = 15–18/40** — làm được mọi dạng ở Passage 1–2. Matching information là dạng nhiều người bỏ trống nhất vì \"tìm mãi không thấy\"; hôm nay có chiến thuật để không bỏ trống.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Matching information là gì?" },
    {
      t: "p",
      text: "Đề cho các **đoạn có nhãn** A, B, C… và một danh sách **câu mô tả thông tin**. Bạn ghi **chữ cái của đoạn** chứa thông tin đó. Lời dẫn thật trong đề:",
    },
    {
      t: "examples",
      items: [
        { en: "Reading Passage 2 has seven paragraphs, A–G. Which paragraph contains the following information? Write the correct letter, A–G, in boxes 1–8 on your answer sheet. NB You may use any letter more than once.", vi: "Bài đọc 2 có bảy đoạn A–G. Đoạn nào chứa thông tin sau? Ghi chữ cái đúng A–G vào ô 1–8 trên phiếu trả lời. Lưu ý: bạn có thể dùng một chữ cái nhiều hơn một lần." },
      ],
    },
    {
      t: "note",
      title: "Ba điều lời dẫn đang nói với bạn",
      items: [
        "**contains the following information** — thông tin chỉ cần **nằm trong** đoạn (có thể chỉ một câu, thậm chí nửa câu), không cần là ý chính.",
        "**NB You may use any letter more than once** — có NB thì chắc chắn **ít nhất một đoạn được dùng hai lần** hoặc **có đoạn không dùng**. Đừng ép mỗi đoạn một câu.",
        "Câu hỏi được xếp **lộn xộn** so với bài: câu 1 có thể nằm ở đoạn F, câu 2 ở đoạn A. Vì thế dạng này **tốn thời gian nhất** — thường làm **sau** các dạng theo thứ tự (TFNG, summary, sentence completion).",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Khác Matching headings ở đâu?" },
    {
      t: "sodo",
      kind: "compare",
      title: "Matching headings (Ngày 12) vs Matching information (hôm nay)",
      caption: "Nhầm hai dạng là sai cách đọc: với headings bạn đọc lướt ý chính; với information bạn phải dò CHI TIẾT.",
      cols: [
        {
          title: "**Matching headings**",
          anh: "newspaper",
          items: [
            "Câu hỏi: **chọn tiêu đề** cho từng đoạn",
            "Tìm **ý chính của cả đoạn**",
            "Mỗi đoạn **một** tiêu đề; thừa tiêu đề",
            "Đọc câu đầu – câu cuối là chủ yếu",
            "Thứ tự: theo đoạn (i → ii …)",
          ],
        },
        {
          title: "**Matching information**",
          anh: "magnifying-glass-tilted-right",
          items: [
            "Câu hỏi: **đoạn nào chứa** chi tiết này",
            "Tìm **một chi tiết** (ví dụ, con số, lý do…)",
            "Một đoạn có thể dùng **nhiều lần** hoặc **không dùng**",
            "Chi tiết có thể nằm **giữa đoạn**",
            "Thứ tự: **không theo bài**",
          ],
        },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Câu hỏi đang hỏi \"loại thông tin\" nào?" },
    {
      t: "p",
      text: "Mỗi câu hỏi mở đầu bằng một **cụm chỉ loại thông tin**. Gạch nó trước — nó cho biết bạn đang dò **cái gì** trong bài. Đây là chỗ nhiều người bỏ qua rồi đọc lan man.",
    },
    {
      t: "table",
      caption: "Cụm mở đầu câu hỏi → dấu hiệu cần dò trong bài",
      head: ["Câu hỏi bắt đầu bằng", "Nghĩa", "Dò trong bài"],
      rows: [
        ["**an example of** …", "một ví dụ về …", "for example, such as, like, tên riêng, một trường hợp cụ thể"],
        ["**a reason for / why** …", "lý do", "because, since, due to, so, this is why"],
        ["**an explanation of** …", "lời giải thích (vì sao / bằng cách nào)", "because, this means, the reason is, as a result"],
        ["**a description of** …", "mô tả (trông thế nào, diễn ra thế nào)", "tính từ, chuỗi hành động, quá trình"],
        ["**a reference to** / **a mention of** …", "có nhắc đến …", "chỉ cần **nhắc tới** — một chữ cũng đủ"],
        ["**a comparison between** …", "so sánh", "more / less than, twice as, whereas, compared with"],
        ["**figures / a number / a date** …", "con số, năm", "chữ số, phần trăm, năm — dò bằng mắt rất nhanh"],
        ["**a suggestion / recommendation** …", "đề xuất", "should, recommend, suggest, it is worth"],
        ["**a prediction** …", "dự đoán", "will, is likely to, in the future, by 2050"],
      ],
    },
    {
      t: "rule",
      formula: "Câu hỏi = LOẠI thông tin (an example of / a reason for / a reference to…) + NỘI DUNG (từ khoá) → dò dấu hiệu của loại + paraphrase của nội dung",
      vi: "Đúng nội dung mà sai loại (đoạn có nhắc chủ đề nhưng không có VÍ DỤ) thì vẫn chưa phải đáp án.",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Chiến thuật 5 bước" },
    {
      t: "sodo",
      kind: "flow",
      title: "Làm Matching information trong ~12 phút (8 câu)",
      caption: "Nếu cùng bài có dạng theo thứ tự (TFNG, summary…), làm dạng đó TRƯỚC — trong lúc đọc kỹ từng đoạn, liếc lại danh sách matching và ghi ngay câu nào khớp.",
      steps: [
        { label: "Gạch câu hỏi", sub: "loại thông tin + 1–2 từ khoá nội dung; câu có SỐ / TÊN để làm trước" },
        { label: "Đọc đoạn A", sub: "đọc kỹ vừa phải (không lướt), xong một đoạn thì quét cả danh sách câu hỏi" },
        { label: "Khớp & ghi", sub: "khớp được thì ghi chữ cái + gạch dòng trong bài làm bằng chứng" },
        { label: "Sang đoạn tiếp", sub: "một đoạn có thể chứa 2 đáp án — đừng dừng sau đáp án đầu tiên" },
        { label: "Còn câu trống", sub: "dò lại bằng từ đồng nghĩa; hết giờ thì ĐOÁN — không bao giờ bỏ trống" },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với dạng này",
      items: [
        "**Dò từ trùng** (keyword matching): câu hỏi có chữ \"bank\" → chọn ngay đoạn có chữ bank. Đề hay đặt **từ trùng ở đoạn sai** và **paraphrase ở đoạn đúng**.",
        "**Đọc lướt như headings**: chi tiết thường nằm **giữa đoạn**, đọc câu đầu – cuối sẽ bỏ sót.",
        "**Ép mỗi đoạn một câu**: thấy đoạn C đã dùng thì không dám chọn C lần hai — quên **NB**.",
        "**Bỏ qua loại thông tin**: câu hỏi \"**an explanation of** why…\" mà chọn đoạn chỉ **nêu sự việc**, không có lời giải thích.",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Luyện nhanh: 4 đoạn ngắn — 4 câu" },
    {
      t: "passage",
      title: "Second-hand Clothes Go Mainstream",
      intro: "Bài ngắn 4 đoạn A–D (~140 từ). Làm 4 câu bên dưới trong 4 phút.",
      paras: [
        { label: "A", text: "Ten years ago, buying used clothes was something most young people in Britain avoided. Second-hand shops were linked with poverty, and their customers were mostly older people looking for low prices." },
        { label: "B", text: "That image has changed. Apps that let people sell clothes directly to each other now have millions of users, and some famous designers have started selling 'pre-loved' versions of their own past collections." },
        { label: "C", text: "One reason is cost. A survey in 2023 found that a jacket bought second-hand costs, on average, about a third of its original price. Another reason is the environment: making a single pair of jeans can use thousands of litres of water." },
        { label: "D", text: "Not everyone is happy about the trend. Some charity shop managers say that the best items are now bought by professional resellers within minutes, leaving fewer bargains for the poor families the shops were created to help." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–4.** Which paragraph contains the following information? Write the correct letter, **A–D**. **NB** You may use any letter more than once.",
    },
    {
      t: "mcq",
      id: "t2d16-doc-nhanh",
      title: "Luyện nhanh — Matching information (4 câu, A–D)",
      items: [
        { q: "(1) a figure comparing the price of used and new items", options: ["A", "B", "C", "D"], correct: 2, why: "Đoạn **C**: \"a jacket bought second-hand costs… about **a third of its original price**\" — một con số so giá cũ với giá gốc (new). Loại thông tin **a figure** → dò số: chỉ C có." },
        { q: "(2) a reference to a negative effect of the trend", options: ["A", "B", "C", "D"], correct: 3, why: "Đoạn **D**: dân buôn đồ cũ mua hết món tốt → \"**fewer bargains for the poor families**\" = tác động xấu. Bẫy: đoạn A nói tới **poverty**, nhưng đó là **hình ảnh cũ** của cửa hàng đồ cũ, không phải tác động của xu hướng mới." },
        { q: "(3) a description of how people saw second-hand shopping in the past", options: ["A", "B", "C", "D"], correct: 0, why: "Đoạn **A**: \"**Ten years ago**… most young people avoided… shops were **linked with poverty**\" = mô tả cách người ta nhìn nhận **trước đây**. Đoạn B nói hình ảnh **đã thay đổi** (hiện tại)." },
        { q: "(4) an explanation linked to natural resources", options: ["A", "B", "C", "D"], correct: 2, why: "Đoạn **C** lần hai (đúng tinh thần **NB**): \"Another reason is the environment: making a single pair of jeans can use **thousands of litres of water**\" — nước = tài nguyên thiên nhiên, \"Another **reason**\" = lời giải thích. Đoạn **B không là đáp án nào** — chuyện bình thường ở dạng này." },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bài luyện đầy đủ (Passage 2 · 13 câu · 20 phút)" },
    {
      t: "p",
      text: "Bấm giờ **20 phút**. Thứ tự gợi ý: đọc lướt tiêu đề + câu đầu các đoạn (1 phút) → làm **Questions 9–13** (summary, theo thứ tự bài) **trong lúc** đọc kỹ → đọc tới đâu quét danh sách **Questions 1–8** tới đó.",
    },
    {
      t: "passage",
      title: "The Invisible Wallet: How Payment Methods Shape Spending",
      intro: "Bài đọc 7 đoạn A–G (~720 từ). Questions 1–13 ở ngay bên dưới. Các mốc lịch sử đã đơn giản hoá; khảo sát và con số trong bài là gần đúng hoặc tự đặt cho bài luyện — đừng trích như dữ kiện thật.",
      paras: [
        { label: "A", text: "In 1949, according to a popular story, a New York businessman named Frank McNamara finished dinner at a restaurant and realised that he had left his wallet at home. His wife had to come and pay the bill. Embarrassed, McNamara came up with an idea: a card that customers could show at a number of restaurants and pay for later. The following year, he and a partner launched the Diners Club card. At first it was accepted by only 14 restaurants in New York and used by around 200 people, most of them friends and business contacts of the founders. Within a few years, however, tens of thousands of members were carrying it. Historians now doubt that the dinner ever happened exactly as described, but the story is still told because it captures a simple truth: people value the freedom to buy now and pay later." },
        { label: "B", text: "The cards that followed changed the way millions of families managed money. Before them, a household that wanted a new fridge or sofa usually had to save up for months, or buy it in instalments from a single shop. Credit cards allowed consumers to borrow small amounts from a bank whenever they wished, and to use the same card in thousands of different places. In the late 1960s, banks in North America and Europe were sending cards by post to people who had never asked for them — a practice that was later banned in the United States because so many people got into debt." },
        { label: "C", text: "Today, the card itself is disappearing. In many cities, customers pay by tapping a phone or a watch, and some cafés no longer accept coins or notes at all. Sweden is often described as one of the most cashless societies in the world: in 2010, nearly 40 per cent of purchases in shops there were paid for in cash, but by 2020 the figure had fallen to under 10 per cent. Supporters of this change point out that digital payments are fast, hygienic and easy to record. Shops save time at the till, and there is less risk of theft." },
        { label: "D", text: "Psychologists, however, have noticed a hidden cost. When we hand over banknotes, we see our money leave and feel a small sense of loss, which some researchers call 'the pain of paying'. With a card or phone, that feeling is much weaker. In a well-known experiment at a US university, published in 2001, students were invited to bid for tickets to a sold-out basketball game. Those who were told they had to pay by credit card offered, on average, roughly twice as much as those who had to pay in cash. The tickets and the game were the same; only the method of payment was different." },
        { label: "E", text: "Shops have learned to use this effect. Supermarkets place sweets and magazines next to the checkout, where tired customers wait in queues and are more likely to make impulse purchases. Online retailers go further. A button that allows 'one-click' ordering removes the moment when a shopper might stop and ask whether they really need the item. Free delivery 'if you spend just £5 more' encourages people to add things to their basket which they had no intention of buying." },
        { label: "F", text: "Not everyone is equally affected. One survey of adults in Britain found that people under 30 were the group most likely to say they had overspent because paying was 'too easy', while people over 65 were the least likely. The researchers suggested that older shoppers had spent most of their lives using cash and still kept a mental record of their spending, even when they paid by card. Younger shoppers, who had rarely held a wage packet in their hands, had never developed this habit." },
        { label: "G", text: "So what can consumers do? Some financial advisers recommend a simple experiment: for one month, pay for daily essentials such as food and transport in cash only, and compare the total with a normal month. Others suggest turning off one-click ordering and waiting 24 hours before any online purchase over a set amount. Banking apps can also help, as many now send a message every time money leaves an account. The aim is not to return to a world without cards, but to bring back a little of the pain of paying — enough to make us think before we buy." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–8.** The reading passage has seven paragraphs, **A–G**. Which paragraph contains the following information? Write the correct letter, **A–G**. **NB** You may use any letter more than once. — **Đoạn nào chứa thông tin sau? Một chữ cái có thể dùng nhiều lần.**",
    },
    {
      t: "mcq",
      id: "t2d16-doc-noi",
      title: "Questions 1–8 — Matching information (A–G)",
      items: [
        { q: "(1) a description of how families bought expensive goods before credit cards existed", options: ["A", "B", "C", "D", "E", "F", "G"], correct: 1, why: "Đoạn **B**: \"**Before them**, a household that wanted **a new fridge or sofa** usually had to **save up for months**, or buy it **in instalments** from a single shop.\" expensive goods = fridge or sofa; before credit cards = before them." },
        { q: "(2) a reference to products placed where shoppers are waiting", options: ["A", "B", "C", "D", "E", "F", "G"], correct: 4, why: "Đoạn **E**: \"Supermarkets **place sweets and magazines next to the checkout**, where tired customers **wait in queues**\". Bẫy: đoạn C có \"save time **at the till**\" (quầy thu ngân) nhưng **không** nói tới món hàng đặt ở đó." },
        { q: "(3) an explanation of why one age group finds it easier to control its spending", options: ["A", "B", "C", "D", "E", "F", "G"], correct: 5, why: "Đoạn **F**: người trên 65 ít tiêu quá tay nhất vì \"had spent most of their lives using cash and **still kept a mental record of their spending**\" — đây là **explanation** (lời giải thích lý do). Từ khoá \"age group\" ↔ people under 30 / over 65." },
        { q: "(4) a reason why a story about the past is still repeated", options: ["A", "B", "C", "D", "E", "F", "G"], correct: 0, why: "Đoạn **A**: \"Historians now doubt that the dinner ever happened… **but the story is still told because** it captures a simple truth\". still told = still repeated; because = reason." },
        { q: "(5) a comparison of how much people offered to pay using two different methods", options: ["A", "B", "C", "D", "E", "F", "G"], correct: 3, why: "Đoạn **D**: sinh viên trả bằng thẻ \"offered… **roughly twice as much as** those who had to pay **in cash**\" — so sánh số tiền theo hai cách trả. Đoạn C có so sánh 2010 – 2020 nhưng đó là **tỉ lệ trả tiền mặt theo năm**, không phải **số tiền người ta sẵn sàng trả**." },
        { q: "(6) a suggestion that technology can warn people when they spend", options: ["A", "B", "C", "D", "E", "F", "G"], correct: 6, why: "Đoạn **G**: \"**Banking apps can also help**, as many now **send a message every time money leaves an account**.\" banking apps = technology; send a message = warn. \"can also help\" nằm trong chuỗi lời khuyên (recommend, suggest) → suggestion." },
        { q: "(7) an example of a business practice that was later made illegal", options: ["A", "B", "C", "D", "E", "F", "G"], correct: 1, why: "Đoạn **B** lần hai (**NB**): ngân hàng gửi thẻ qua bưu điện cho người không hề xin — \"a practice that was **later banned**\". made illegal = banned. Không đoạn nào khác nói tới việc cấm." },
        { q: "(8) a reference to a way of encouraging customers to buy extra items in order to avoid a charge", options: ["A", "B", "C", "D", "E", "F", "G"], correct: 4, why: "Đoạn **E** lần hai: \"**Free delivery** 'if you spend just £5 more' encourages people to **add things** to their basket\" — mua thêm để khỏi trả phí giao hàng (avoid a charge). **Đoạn C không là đáp án nào**." },
      ],
    },
    {
      t: "p",
      text: "**Questions 9–13.** Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer. — **Hoàn thành đoạn tóm tắt. Chọn MỘT TỪ DUY NHẤT trong bài cho mỗi chỗ trống.** (Ôn dạng Summary completion — từ trong bài, Ngày 2.)",
    },
    {
      t: "examples",
      items: [
        { en: "Paying without cash — In Sweden, the share of shop purchases paid in cash dropped from nearly 40 per cent in 2010 to under 10 per cent in 2020. Supporters say digital payment is quick, clean and simple to (9) ______. Businesses spend less time at the (10) ______ and face a lower risk of (11) ______. However, psychologists warn that paying by card reduces what some call 'the (12) ______ of paying'. In one experiment, students who had to pay by credit card bid around (13) ______ as much for tickets as students using cash.", vi: "Trả tiền không dùng tiền mặt — Ở Thuỵ Điển, tỉ lệ mua hàng trả bằng tiền mặt giảm từ gần 40% năm 2010 xuống dưới 10% năm 2020. Người ủng hộ nói thanh toán số nhanh, sạch và dễ (9)… Cửa hàng tốn ít thời gian hơn ở (10)… và ít nguy cơ (11)… Tuy nhiên, các nhà tâm lý học cảnh báo trả bằng thẻ làm giảm cái mà một số người gọi là “(12)… khi trả tiền”. Trong một thí nghiệm, sinh viên phải trả bằng thẻ tín dụng đã trả giá vé khoảng (13)… so với sinh viên trả tiền mặt." },
      ],
    },
    {
      t: "quiz",
      id: "t2d16-doc-tom-tat",
      title: "Questions 9–13 — Summary completion (ONE WORD ONLY)",
      kind: "fill",
      items: [
        { q: "(9) Supporters say digital payment is quick, clean and simple to ___.", answers: ["record"] },
        { q: "(10) Businesses spend less time at the ___", answers: ["till"] },
        { q: "(11) …and face a lower risk of ___.", answers: ["theft"] },
        { q: "(12) …what some call 'the ___ of paying'.", answers: ["pain"] },
        { q: "(13) …students who had to pay by credit card bid around ___ as much…", answers: ["twice"] },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Giải thích đáp án & cách học" },
    {
      t: "note",
      title: "Giải thích Questions 9–13 (đoạn C → D, theo thứ tự)",
      items: [
        "**(9) record** — C: \"digital payments are fast, **hygienic** and **easy to record**\". quick = fast · clean = hygienic · simple to = easy to → chỗ trống là **record** (động từ sau to). Một từ, đúng giới hạn.",
        "**(10) till** — C: \"Shops **save time at the till**\" ↔ spend less time at the ___. till = quầy thu ngân (UK).",
        "**(11) theft** — C: \"there is **less risk of theft**\" ↔ a lower risk of ___. Cần **danh từ** sau of → theft (~~thief~~ là kẻ trộm — sai nghĩa).",
        "**(12) pain** — D: \"which some researchers call **'the pain of paying'**\". Bẫy: ~~loss~~ cũng ở gần đó (a small sense of loss), nhưng cụm có tên gọi là \"the **pain** of paying\".",
        "**(13) twice** — D: \"offered, on average, **roughly twice as much as** those who had to pay in cash\". roughly = around. ~~double~~ không có trong bài — chỉ được **chép từ trong bài**.",
      ],
    },
    {
      t: "table",
      caption: "Paraphrase trong bài luyện — câu hỏi nói A, bài nói B",
      head: ["Câu hỏi", "Bài đọc", "Kiểu paraphrase"],
      rows: [
        ["expensive goods", "a new fridge or sofa", "khái quát → ví dụ cụ thể"],
        ["where shoppers are waiting", "next to the checkout, where tired customers wait in queues", "đồng nghĩa (shoppers = customers)"],
        ["is still repeated", "is still told", "đồng nghĩa động từ"],
        ["made illegal", "banned", "đổi cấu trúc (cụm → một từ)"],
        ["avoid a charge", "free delivery", "ý ẩn — phải hiểu \"miễn phí giao hàng = khỏi trả phí\""],
        ["technology can warn people", "banking apps… send a message", "khái quát → cụ thể"],
      ],
    },
    {
      t: "note",
      title: "Cách học sau khi chữa",
      items: [
        "Đếm: câu nào sai vì **dò từ trùng** (chọn C cho câu 2 vì thấy \"till\")? Câu nào sai vì **quên NB** (không dám chọn B lần hai)? Ghi vào sổ lỗi.",
        "Nhìn lại: đoạn **C chứa toàn bộ đáp án 9–11** nhưng **không** là đáp án matching nào — vì thế làm summary trước rồi mới làm matching sẽ đỡ đọc lại.",
        "Thói quen tốt: mỗi lần chọn một chữ cái, **gạch dòng chứng cứ** trong bài. Không gạch được câu nào thì chưa chắc đáp án.",
      ],
    },
    { t: "p", text: "**Từ vựng hữu ích trong bài** — 5 từ đáng nhớ (tự vào Flashcards Tập 2):" },
    {
      t: "vocab",
      items: [
        { w: "checkout", pos: "n", ipa: "/ˈtʃekaʊt/", vi: "quầy thanh toán (siêu thị); bước thanh toán (mua online)", ex: "There was a long queue at the checkout.", exVi: "Quầy thanh toán xếp hàng dài.", more: "Danh từ viết liền **checkout**; động từ tách rời **check out** (= thanh toán, trả phòng khách sạn)." },
        { w: "till", pos: "n", ipa: "/tɪl/", vi: "quầy thu ngân; ngăn kéo đựng tiền (UK)", ex: "Please pay at the till by the door.", exVi: "Vui lòng thanh toán ở quầy thu ngân cạnh cửa.", more: "**pay at the till** · Mỹ nói **cash register**. Đừng nhầm với **till** = until (cho đến khi)." },
        { w: "theft", pos: "n", ipa: "/θeft/", vi: "vụ trộm, sự trộm cắp", ex: "Cashless shops face a lower risk of theft.", exVi: "Cửa hàng không dùng tiền mặt ít nguy cơ bị trộm hơn.", more: "Họ: **thief** (kẻ trộm, số nhiều thieves) · **steal** (v, stole – stolen). Âm đầu /θ/ (Tập 1)." },
        { w: "hygienic", pos: "adj", ipa: "/haɪˈdʒiːnɪk/", vi: "hợp vệ sinh", ex: "Many people think paying by phone is more hygienic than handling cash.", exVi: "Nhiều người nghĩ trả bằng điện thoại vệ sinh hơn cầm tiền mặt.", more: "Danh từ **hygiene** /ˈhaɪdʒiːn/ — trọng âm **dời** từ HY- sang -GIE-. **food / personal** hygiene." },
        { w: "bid", pos: "v, n", ipa: "/bɪd/", vi: "trả giá (trong đấu giá); lời trả giá", ex: "Three people bid for the old painting.", exVi: "Ba người trả giá cho bức tranh cũ.", more: "**bid for** sth · quá khứ **bid – bid** · **make / place a bid** · a **winning** bid." },
      ],
    },
  ],
};

/* ─────────────────────────── Viết ─────────────────────────── */

const T2D16_WRITING: Lesson = {
  id: "t2d16-viet",
  kind: "writing",
  title: "Viết: Task 1 Table — đọc bảng, chọn số nổi bật, viết trọn bài",
  goal: "Viết trọn một bài Task 1 dạng bảng số liệu (table) 160–190 từ trong 20 phút: đọc đúng hàng – cột – đơn vị, chọn 3–4 điểm nổi bật thay vì kể từng ô, viết overview không số và gom nhóm thân bài — đẩy Task Achievement và Coherence & Cohesion lên band 5.5–6.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Bảng (table) = **nhiều con số nhất** trong 6 dạng Task 1 (đã nhận diện ở Tập 1 Ngày 4). Bẫy lớn nhất: ~~kể hết từng ô~~ → bài dài, lộn xộn, **không có overview**.",
        "Quy trình: **đọc bảng** (tiêu đề, đơn vị, hàng, cột, có năm không) → **chọn 3–4 điểm nổi bật** (cao nhất · thấp nhất · chênh lệch / thay đổi lớn nhất · ngoại lệ) → **overview không số** → **2 đoạn thân bài gom nhóm**.",
        "Ngôn ngữ: so sánh (Tập 2 Ngày 8–9) + số liệu: ==account for · compared with · twice as much as · respectively · ranged from… to…==",
        "Bài mẫu trọn bài ~185 từ (**band ước tính 6.0–6.5**) + bảng phân tích 4 tiêu chí; rồi bạn tự viết một bài với bảng khác.",
        "Đẩy band nào: **Task Achievement band 5** = \"kể chi tiết máy móc, không có overview rõ\"; **band 6** = \"overview rõ, số liệu chọn đúng và đủ\". Hôm nay luyện đúng khoảng cách đó.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Đọc bảng trong 2 phút đầu" },
    {
      t: "p",
      text: "Trước khi viết chữ nào, trả lời **4 câu hỏi** về bảng. Sai một câu là sai cả bài (ví dụ đọc **%** thành **số người**, hoặc tưởng có xu hướng thời gian khi bảng chỉ có một năm).",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "4 câu hỏi khi nhìn một bảng",
      caption: "Câu 4 quyết định thì động từ: một năm trong quá khứ → quá khứ đơn, KHÔNG dùng rose / fell; có nhiều năm → dùng ngôn ngữ xu hướng (Tập 1 Ngày 11–12, Tập 2 Ngày 4).",
      steps: [
        { label: "Bảng nói về gì?", sub: "đọc tiêu đề: ai, cái gì, ở đâu, khi nào" },
        { label: "Đơn vị là gì?", sub: "%, nghìn người, triệu USD, giờ/tuần…" },
        { label: "Hàng & cột là gì?", sub: "hàng = nước / nhóm; cột = hạng mục / năm" },
        { label: "Có thời gian không?", sub: "một mốc → so sánh; nhiều mốc → xu hướng" },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Chọn số nổi bật — đừng kể từng ô" },
    {
      t: "p",
      text: "Bảng hôm nay có **16 con số**. Bài 170 từ không thể và **không nên** nhắc cả 16. Đề luôn ghi \"**selecting and reporting the main features**\" — **chọn** và báo cáo đặc điểm **chính**. Giám khảo chấm việc **chọn**, không chấm việc chép.",
    },
    {
      t: "figure",
      fig: {
        kind: "table",
        title: "Percentage of household spending on four main categories in four countries, 2023",
        note: "Số liệu tự đặt cho bài luyện. Phần còn lại (~30%) là các khoản khác, không có trong bảng.",
        unit: "%",
        categories: ["Housing", "Food", "Transport", "Leisure"],
        series: [
          { name: "Japan", values: [25, 24, 11, 10] },
          { name: "the UK", values: [30, 15, 14, 13] },
          { name: "Vietnam", values: [18, 38, 12, 5] },
          { name: "Canada", values: [29, 18, 16, 9] },
        ],
      },
    },
    {
      t: "table",
      caption: "4 loại điểm nổi bật — tìm trên bảng chi tiêu ở trên",
      head: ["Loại", "Hỏi bảng", "Trên bảng này"],
      rows: [
        ["**Lớn nhất / nhỏ nhất**", "Ô nào cao nhất, thấp nhất cả bảng? Hạng mục nào lớn nhất ở mỗi nước?", "Cao nhất: **food ở Vietnam 38%**. Thấp nhất: **leisure ở Vietnam 5%**."],
        ["**Quy luật chung**", "Có gì đúng với **mọi** hàng không?", "Ở **cả bốn nước**, housing + food là hai khoản lớn nhất; leisure là khoản nhỏ nhất."],
        ["**Chênh lệch lớn**", "Cùng một cột, hàng nào cách xa nhau nhất?", "Food: Vietnam 38% vs UK 15% (**hơn gấp đôi**)."],
        ["**Ngoại lệ**", "Hàng nào đi ngược với các hàng khác?", "Vietnam: food **lớn hơn** housing (ba nước kia ngược lại). Japan: housing 25% ≈ food 24% (gần bằng nhau)."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Kể từng ô (band 4.5–5) vs chọn lọc (band 6)",
      caption: "Hai câu cùng độ dài. Câu phải nói được nhiều hơn vì nó SO SÁNH và GOM NHÓM.",
      cols: [
        {
          title: "~~Kể từng ô~~",
          anh: "cross-mark",
          items: [
            "~~Japan spent 25% on housing, 24% on food, 11% on transport and 10% on leisure.~~",
            "~~The UK spent 30% on housing, 15% on food, 14% on transport and 13% on leisure.~~",
            "→ không so sánh, không có điểm nổi bật, người đọc tự tìm lấy",
          ],
        },
        {
          title: "Chọn lọc + so sánh",
          anh: "check-mark-button",
          items: [
            "Housing **took up** 30% of spending in the UK, **compared with** 25% in Japan.",
            "Vietnamese households spent 38% on food, **more than double** the UK figure (15%).",
            "→ mỗi câu một phép so sánh, số liệu làm bằng chứng",
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Chọn: cao nhất · thấp nhất · quy luật chung · chênh lệch lớn nhất · ngoại lệ → mỗi câu thân bài = 1 phép so sánh + số liệu làm bằng chứng",
      vi: "Bảng 16 ô → nhắc khoảng 10–12 số, nhưng luôn trong câu SO SÁNH; ô \"nhạt\" có thể gom thành khoảng (between 11% and 14%).",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Overview không số" },
    {
      t: "p",
      text: "Overview (tổng quan) là câu **quan trọng nhất** của Task 1: **không có overview rõ thì Task Achievement không vượt band 5**. Overview của bảng = **quy luật chung + ngoại lệ lớn nhất**, viết **không có con số**.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Overall, it is clear that + S + V…, while + S + V…",
          vi: "Overview hai vế: quy luật chung + điểm đối lập.",
          examples: [
            { en: "Overall, it is clear that housing and food were the largest expenses in all four countries, while leisure accounted for the smallest share.", vi: "Nhìn chung, rõ ràng nhà ở và thực phẩm là hai khoản chi lớn nhất ở cả bốn nước, trong khi giải trí chiếm phần nhỏ nhất." },
          ],
        },
        {
          formula: "The most striking feature is that + S + V…",
          vi: "Câu thứ hai của overview: nêu ngoại lệ / điểm nổi bật nhất.",
          examples: [
            { en: "The most striking feature is that Vietnamese households spent far more on food than on anything else.", vi: "Điểm nổi bật nhất là các hộ gia đình Việt Nam chi cho thực phẩm nhiều hơn hẳn mọi khoản khác." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: overview sai thường gặp",
      items: [
        "Có số trong overview: ~~Overall, Vietnam spent 38% on food.~~ → đó là **chi tiết**, để ở thân bài.",
        "Chỉ nhắc một hàng: ~~Overall, the UK spent the most on housing.~~ → overview phải nói về **cả bảng**.",
        "Đặt overview ở **cuối bài** như \"kết luận\" vẫn được chấp nhận, nhưng người mới nên đặt **ngay sau mở bài** — không bao giờ quên, và giám khảo thấy ngay.",
        "Dùng ~~In conclusion~~ cho Task 1: Task 1 không có \"kết luận ý kiến\" — dùng **Overall,**.",
      ],
    },
    {
      t: "rule",
      formula: "Overall, it is clear that + quy luật chung (không số), while + điểm đối lập. The most striking feature is that + ngoại lệ.",
      vi: "Overview = 1–2 câu, không con số, nói về cả bảng.",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Gom nhóm thân bài: theo hàng hay theo cột?" },
    {
      t: "table",
      head: ["Cách gom", "Khi nào dùng", "Bảng hôm nay"],
      rows: [
        ["**Theo cột** (hạng mục)", "Các cột kể những \"câu chuyện\" khác nhau; có cột lớn – cột nhỏ rõ rệt", "✅ Body 1 = **housing + food** (hai khoản lớn, có ngoại lệ Vietnam) · Body 2 = **transport + leisure** (hai khoản nhỏ)"],
        ["**Theo hàng** (nước / nhóm)", "Có một hai hàng rất khác các hàng còn lại", "Cũng được: Body 1 = UK, Canada, Japan (giống nhau) · Body 2 = Vietnam (ngoại lệ)"],
        ["**Theo năm**", "Cột là các năm (bảng có thời gian)", "Không áp dụng — bảng chỉ có 2023"],
        ["~~Mỗi hàng một đoạn~~", "Không bao giờ", "4 nước → 4 đoạn ngắn, không so sánh được với nhau"],
      ],
    },
    {
      t: "rule",
      formula: "Intro (paraphrase đề) → Overview (không số) → Body 1 (nhóm lớn / nổi bật) → Body 2 (nhóm còn lại)",
      vi: "Hai đoạn thân bài, mỗi đoạn gom 2 cột (hoặc một nhóm hàng) và so sánh bên trong nhóm.",
    },

    /* ── 5 ── */
    { t: "h", text: "5. Ngôn ngữ so sánh & số liệu cho bảng" },
    {
      t: "p",
      text: "Bảng tĩnh (một năm) **không dùng** rise / fall. Thay vào đó là ngôn ngữ **chiếm bao nhiêu** và **so với ai**. So sánh hơn / nhất / gấp đôi bạn đã học ở **Tập 2 Ngày 9**; ở đây ghép chúng với số liệu.",
    },
    {
      t: "table",
      caption: "Khung câu số liệu — bảng không có thời gian",
      head: ["Chức năng", "Khung câu", "Ví dụ (bảng chi tiêu)"],
      rows: [
        ["Chiếm bao nhiêu", "N **accounted for / took up / made up** X%", "Food **accounted for** 38% of spending in Vietnam."],
        ["Chi cho cái gì", "S **spent** X% **on** N", "Canadians **spent** 16% **on** transport."],
        ["So với", "X% …, **compared with** Y% in …", "Housing took up 30% in the UK, **compared with** 18% in Vietnam."],
        ["Gấp mấy lần", "**twice / three times as much as** · **more than double** + N", "Food in Vietnam was **more than double** the UK figure."],
        ["Lần lượt", "A and B …, at X% and Y% **respectively**", "Housing and food took up 25% and 24% **respectively** in Japan."],
        ["Khoảng giá trị", "N **ranged from** X% **to** Y% · **between** X% and Y%", "Leisure **ranged from** 13% in the UK **to** 5% in Vietnam."],
        ["Gần bằng", "**almost the same as** · **roughly equal**", "Spending on housing was **almost the same as** spending on food."],
        ["Đối lập", "**By contrast,** … · …, **whereas** …", "**By contrast,** Vietnam spent only 18% on housing."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "N + accounted for + X% of + N (+ in …), compared with + Y% in …",
          vi: "Câu \"vàng\" của bảng: một số liệu + một phép so sánh trong cùng câu.",
          examples: [
            { en: "Transport accounted for 16% of spending in Canada, compared with only 11% in Japan.", vi: "Đi lại chiếm 16% chi tiêu ở Canada, so với chỉ 11% ở Nhật Bản." },
          ],
        },
        {
          formula: "A and B + V + X% and Y% + respectively",
          vi: "Gói hai số vào một câu — respectively đứng cuối, theo đúng thứ tự A rồi B.",
          examples: [
            { en: "In Japan, housing and food took up 25% and 24% respectively.", vi: "Ở Nhật Bản, nhà ở và thực phẩm lần lượt chiếm 25% và 24%." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi viết số liệu",
      items: [
        "~~accounted 38%~~ → **accounted for** 38% (thiếu for). ~~took up for~~ → took up 38% (không có for).",
        "~~The percentage of food is 38%~~ (lủng củng, dịch \"phần trăm của thực phẩm\") → **Food accounted for 38%** / **The proportion spent on food was 38%**.",
        "~~twice than~~ → **twice as much as** / **more than double**. ~~more 2 times~~ ✗.",
        "Sai thì: bảng năm **2023** đã qua → **quá khứ đơn** (spent, accounted for, was). Bảng không ghi năm → hiện tại đơn.",
        "**respectively** chỉ dùng khi thứ tự số **khớp** thứ tự danh từ. Đảo thứ tự là sai số liệu — mất điểm Task Achievement.",
      ],
    },
    {
      t: "rule",
      formula: "N accounted for X% · S spent X% on N · …, compared with Y% · twice as much as / more than double · A and B: X% and Y% respectively · ranged from X% to Y%",
      vi: "Bảng một năm: không rise/fall; mỗi số liệu nên đi kèm một phép so sánh.",
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bài mẫu trọn bài (band ước tính 6.0–6.5) + phân tích" },
    {
      t: "p",
      text: "**Đề:** The table below shows the percentage of household spending on four main categories in Japan, the UK, Vietnam and Canada in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Bảng ở mục 2.)",
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The table compares the proportion of household spending that went on four main categories in Japan, the UK, Vietnam and Canada in 2023.", vi: "[Mở bài] Bảng so sánh tỉ lệ chi tiêu hộ gia đình dành cho bốn hạng mục chính ở Nhật Bản, Anh, Việt Nam và Canada năm 2023." },
        { en: "[Overview] Overall, it is clear that housing and food were the two largest expenses in all four countries, while leisure accounted for the smallest share. The most striking feature is that Vietnamese households spent far more of their budget on food than on anything else.", vi: "[Tổng quan] Nhìn chung, rõ ràng nhà ở và thực phẩm là hai khoản chi lớn nhất ở cả bốn nước, trong khi giải trí chiếm phần nhỏ nhất. Điểm nổi bật nhất là các hộ gia đình Việt Nam chi cho thực phẩm nhiều hơn hẳn mọi khoản khác." },
        { en: "[Body 1] Housing was the biggest category in three of the four countries. It took up 30% of spending in the UK and 29% in Canada, compared with 25% in Japan. In Vietnam, by contrast, the figure was only 18%, whereas food accounted for 38%, which was more than double the proportion in the UK (15%) and Canada (18%). In Japan, spending on housing and food was almost equal, at 25% and 24% respectively.", vi: "[Thân bài 1] Nhà ở là hạng mục lớn nhất ở ba trong bốn nước. Nó chiếm 30% chi tiêu ở Anh và 29% ở Canada, so với 25% ở Nhật. Ngược lại, ở Việt Nam con số này chỉ 18%, trong khi thực phẩm chiếm 38%, hơn gấp đôi tỉ lệ ở Anh (15%) và Canada (18%). Ở Nhật, chi cho nhà ở và thực phẩm gần bằng nhau, lần lượt 25% và 24%." },
        { en: "[Body 2] The figures for transport and leisure were much lower. Canadians spent the most on transport (16%), while the other three countries spent between 11% and 14%. Leisure ranged from 13% in the UK to just 5% in Vietnam, which was the lowest figure in the table.", vi: "[Thân bài 2] Số liệu của đi lại và giải trí thấp hơn nhiều. Người Canada chi cho đi lại nhiều nhất (16%), trong khi ba nước còn lại chi từ 11% đến 14%. Giải trí dao động từ 13% ở Anh xuống chỉ 5% ở Việt Nam — con số thấp nhất trong bảng." },
      ],
    },
    {
      t: "note",
      title: "Soát số — mọi con số đều khớp bảng",
      items: [
        "Housing: UK **30** · Canada **29** · Japan **25** · Vietnam **18** — \"biggest category in three of the four countries\": Japan 25 > 24, UK 30, Canada 29 ✓; Vietnam thì food 38 > 18 ✓.",
        "Food: Vietnam **38** vs UK **15** (38 ÷ 15 ≈ 2,5) và Canada **18** (38 ÷ 18 ≈ 2,1) → \"more than double\" ✓.",
        "Transport: Canada **16** cao nhất; Japan 11 · Vietnam 12 · UK 14 → \"between 11% and 14%\" ✓.",
        "Leisure: UK **13** → Vietnam **5**; Japan 10, Canada 9 nằm giữa → \"ranged from 13% … to 5%\", 5% là ô **thấp nhất cả bảng** ✓.",
      ],
    },
    {
      t: "table",
      caption: "Phân tích bài mẫu theo 4 tiêu chí Task 1 — vì sao ở khoảng 6.0–6.5, chưa lên 7",
      head: ["Tiêu chí", "Bài mẫu làm được gì", "Vì sao chưa lên 7"],
      rows: [
        ["**Task Achievement**", "Overview hai câu, không số, nói về cả bảng; chọn đúng ô cao nhất (38%) và thấp nhất (5%), ngoại lệ Vietnam, trường hợp gần bằng (Japan); ô \"nhạt\" gom thành khoảng (between 11% and 14%).", "Chưa nhận xét tổng các khoản (cả bốn nước dành ~70% cho bốn mục này) — chi tiết chọn lọc ở mức tốt, chưa sắc."],
        ["**Coherence & Cohesion**", "Body 1 = hai khoản lớn, Body 2 = hai khoản nhỏ; từ nối đúng vai: **by contrast · whereas · while · respectively**; \"the figure\", \"which\" thay vì lặp danh từ.", "Liên kết còn khá \"lộ\" (while xuất hiện hai lần); câu đầu Body 2 hơi chung chung."],
        ["**Lexical Resource**", "Paraphrase đề: shows → **compares**, percentage → **proportion**; đa dạng: **took up · accounted for · spent … on · the figure · share**.", "Từ vựng chính xác nhưng phổ thông; chưa có cụm ít gặp hơn (the lion's share, a mere 5%)."],
        ["**Grammatical Range & Accuracy**", "Quá khứ đơn nhất quán; mệnh đề quan hệ **which was more than double…** (Ngày 15); so sánh hơn / nhất đúng; không lỗi.", "Cấu trúc câu còn lặp kiểu \"S + V + X%, compared with Y%\"."],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "Japan spent 25% on housing and 24% on food. The UK spent 30% on housing and 15% on food. Vietnam spent 18% on housing and 38% on food. Canada spent 29% on housing and 18% on food.", vi: "Bản band 4.5–5 của Body 1 (để so sánh với bài mẫu): đúng số, đúng ngữ pháp — nhưng không so sánh, không có điểm nổi bật, câu lặp y hệt nhau. Task Achievement và Coherence đều bị giữ ở band 5." },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Luyện: chọn số nổi bật & sửa câu số liệu" },
    {
      t: "p",
      text: "Bảng dưới đây **có hai mốc năm** — vì thế được dùng thêm ngôn ngữ thay đổi (rose, more than doubled). Đọc bảng theo 4 câu hỏi ở mục 1, rồi trả lời 5 câu. Đây cũng là bảng bạn sẽ viết ở mục 8.",
    },
    {
      t: "figure",
      fig: {
        kind: "table",
        title: "Average monthly spending on online shopping by age group in one country, 2015 and 2025 (£)",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "£ per month",
        categories: ["2015", "2025"],
        series: [
          { name: "18–24", values: [40, 95] },
          { name: "25–34", values: [65, 130] },
          { name: "35–49", values: [70, 120] },
          { name: "50–64", values: [35, 85] },
          { name: "65+", values: [10, 45] },
        ],
      },
    },
    {
      t: "mcq",
      id: "t2d16-viet-chon",
      title: "Chọn điểm nổi bật & cách tổ chức (5 câu)",
      items: [
        { q: "Which is the best overview?", options: ["In 2015, people aged 35–49 spent £70 a month, and in 2025 people aged 25–34 spent £130.", "Spending on online shopping rose in every age group, and people aged 25–34 were the biggest spenders by 2025, while the over-65s spent the least.", "Online shopping is very popular among young people because they like technology."], correct: 1, why: "Overview đúng: **không số**, nói về **cả bảng** (mọi nhóm đều tăng) + điểm nổi bật (nhóm chi nhiều nhất / ít nhất). A là chi tiết có số; C là **ý kiến cá nhân** (because they like technology) — Task 1 không giải thích lý do ngoài số liệu." },
        { q: "Which sentence about the top spenders is accurate?", options: ["The 35–49 group spent the most in both years.", "The 25–34 group spent the most in both years.", "The 35–49 group spent the most in 2015, but the 25–34 group had overtaken it by 2025."], correct: 2, why: "2015: 35–49 = **£70** > 25–34 = £65. 2025: 25–34 = **£130** > 35–49 = £120 → có **vượt** (overtake). A sai ở 2025; B sai ở 2015. Sự đổi ngôi này là một điểm nổi bật đáng viết." },
        { q: "Which statement about the 65+ group is accurate?", options: ["Its spending more than quadrupled.", "It overtook the 50–64 group.", "It had the largest rise in pounds."], correct: 0, why: "£10 → £45 = **gấp 4,5 lần** → more than quadrupled (hơn gấp bốn) ✓. B sai: 45 < 85. C sai: mức tăng £35 là **nhỏ nhất** (25–34 tăng £65 lớn nhất). Nhóm nhỏ nhất nhưng tăng **tương đối** nhanh nhất — rất đáng nêu." },
        { q: "Which way of organising the body paragraphs should you NOT use?", options: ["Body 1 = 2015, Body 2 = 2025", "One short paragraph for each of the five age groups", "Body 1 = the three younger groups, Body 2 = the two older groups"], correct: 1, why: "Năm đoạn cho năm nhóm = **kể từng hàng**, không so sánh được giữa các nhóm, lại thiếu chỗ cho overview. A (theo năm) và C (theo nhóm tuổi) đều gom nhóm hợp lý." },
        { q: "Which sentence is an example of \"listing every cell\"?", options: ["In 2015, 18–24-year-olds spent £40, 25–34-year-olds spent £65, 35–49-year-olds spent £70, 50–64-year-olds spent £35 and the over-65s spent £10.", "Spending by the youngest group more than doubled, from £40 to £95.", "The figure for 50–64-year-olds rose from £35 to £85, an increase of £50."], correct: 0, why: "A chép **cả cột 2015** liền một hơi mà không so sánh hay chọn lọc — đúng kiểu \"kể từng ô\". B và C chọn một hàng và nói rõ **mức thay đổi** (more than doubled, an increase of £50) — đó là báo cáo có chọn lọc." },
      ],
    },
    {
      t: "quiz",
      id: "t2d16-viet-dien",
      title: "Điền một từ cho câu số liệu — bảng chi tiêu ở mục 2 (6 câu)",
      kind: "fill",
      items: [
        { q: "Vietnamese households spent ___ of their budget on food. (viết số kèm %)", answers: ["38%", "38 per cent", "38 percent"] },
        { q: "Housing took up 30% of spending in the UK, ___ with 18% in Vietnam.", answers: ["compared"] },
        { q: "Food in Vietnam (38%) was more than ___ the figure for Canada (18%).", answers: ["double", "twice"] },
        { q: "In Japan, housing and food took up 25% and 24% ___.", answers: ["respectively"] },
        { q: "Leisure accounted ___ the smallest share in every country.", answers: ["for"] },
        { q: "Canadians spent the ___ on transport, at 16%.", answers: ["most"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 6 chỗ trống",
      items: [
        "**38%** — ô food / Vietnam. Viết số + **%** (hoặc per cent); đừng viết ~~38~~ trơn — người đọc không biết đơn vị.",
        "**compared** — khung **…, compared with Y%** (so với). Cũng gặp \"in comparison with\", nhưng chỗ trống một từ → compared.",
        "**double / twice** — 38 ÷ 18 ≈ 2,1 → \"more than **double** / **twice** the figure\".",
        "**respectively** — hai số 25% và 24% theo đúng thứ tự housing, food.",
        "**for** — **account for** + X / the smallest share. Thiếu for là lỗi rất hay gặp.",
        "**most** — the + **most** (so sánh nhất của much) → \"spent the most on\". Canada 16% > UK 14% > Vietnam 12% > Japan 11%.",
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Viết bài của bạn (20 phút)" },
    {
      t: "p",
      text: "Dùng bảng chi tiêu mua sắm trực tuyến ở mục 7. Bảng này **có hai năm** → mỗi nhóm có một **thay đổi**: dùng **rose / increased / more than doubled / an increase of £X**, cộng ngôn ngữ so sánh của mục 5. Nhắm **160–190 từ**.",
    },
    {
      t: "essay",
      id: "t2d16-viet-bai",
      task: "Task 1",
      prompt: "The table shows the average amount of money people in five age groups in one country spent on online shopping each month in 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data, £ per month — 18–24: 2015 £40, 2025 £95 · 25–34: 2015 £65, 2025 £130 · 35–49: 2015 £70, 2025 £120 · 50–64: 2015 £35, 2025 £85 · 65+: 2015 £10, 2025 £45)",
      minWords: 150,
      tips: [
        "Mở bài: shows → **compares**; the average amount of money… spent on online shopping → **average monthly spending on online shopping**; five age groups → **people of different ages**.",
        "Overview (không số): **mọi nhóm đều tăng**; nhóm **25–34** chi nhiều nhất năm 2025 (vượt 35–49), nhóm **65+** thấp nhất cả hai năm.",
        "Body 1 = ba nhóm trẻ hơn (18–24, 25–34, 35–49): so 2015 vs 2025, nêu việc **25–34 overtook 35–49**. Body 2 = hai nhóm lớn tuổi (50–64, 65+): 65+ thấp nhất nhưng **more than quadrupled**.",
        "Mỗi câu một phép so sánh: **rose from £X to £Y · more than doubled · an increase of £X · compared with · the highest / the lowest**.",
        "Soát: mọi số khớp bảng; quá khứ đơn (spent, rose); **respectively** đúng thứ tự; không giải thích lý do ngoài bảng.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D16_HOMEWORK: Lesson = {
  id: "t2d16-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 16",
  goal: "Ôn trọn Ngày 16 bằng 42 câu: từ vựng tiền bạc – mua sắm, collocation (chọn, sửa lỗi), họ từ, dịch có 💡, một bài Matching information ngắn, đọc bảng số liệu Task 1 và 2 câu ôn Ngày 13 / 15 — đạt ≥ 34/42 là đã nắm chắc.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (42 câu)",
      items: [
        "**I.** Từ vựng — điền một từ (8) · **II.** Collocation & cụm động từ — chọn (8) · **III.** Sửa lỗi collocation (5) · **IV.** Họ từ (5).",
        "**V.** Dịch Việt → Anh có 💡 (5).",
        "**VI.** Matching information — bài ngắn 5 đoạn (5) · **VII.** Đọc bảng Task 1 (4).",
        "**VIII.** Ôn xoắn ốc: câu điều kiện loại 1 (Ngày 13) · mệnh đề quan hệ (Ngày 15) (2).",
        "Mục tiêu: **≥ 34/42 (80%)**. Sai phần nào thì mở lại đúng mục của bài hôm nay (ghi ở phần giải thích).",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 16 trước khi làm bài",
      caption: "Mỗi nhánh là điều dễ quên nhất của từng bài hôm nay.",
      center: "**Ngày 16**",
      branches: [
        { label: "Từ vựng & collocation", items: ["take out a loan · get into debt", "high prices (≠ expensive prices)", "spend money ON · pay FOR", "economic ≠ economical"], anh: "money-bag" },
        { label: "Matching information", items: ["tìm CHI TIẾT, không tìm ý chính", "gạch LOẠI thông tin", "NB: chữ cái dùng nhiều lần", "câu hỏi không theo thứ tự"], anh: "magnifying-glass-tilted-right" },
        { label: "Task 1 table", items: ["đọc: tiêu đề · đơn vị · hàng · cột · năm", "chọn 3–4 điểm nổi bật", "overview không số", "accounted for · compared with · respectively"], anh: "clipboard" },
      ],
    },

    /* I */
    { t: "h", text: "I. Từ vựng — điền một từ (8 câu)" },
    {
      t: "quiz",
      id: "t2d16-bt-tu",
      title: "I. Điền một từ của bài Từ vựng (nghĩa trong ngoặc)",
      kind: "fill",
      items: [
        { q: "I can't ___ a holiday this year — my rent has gone up. (đủ tiền)", answers: ["afford"] },
        { q: "Students in the UK often take out a ___ to pay for university. (khoản vay)", answers: ["loan"] },
        { q: "He used all his ___ to open a small café. (tiền tiết kiệm)", answers: ["savings"] },
        { q: "Supermarkets are the biggest food ___ in the country. (nhà bán lẻ — số nhiều)", answers: ["retailers"] },
        { q: "Write a list of ___ like rice, milk and soap before you go to the shop. (đồ thiết yếu)", answers: ["essentials"] },
        { q: "My grandparents think young people are too ___: they only care about owning things. (coi trọng vật chất)", answers: ["materialistic"] },
        { q: "Our monthly ___ is only twelve million dong, so we have to be careful. (thu nhập)", answers: ["income"] },
        { q: "Diamond watches are ___ goods — nobody really needs them. (xa xỉ)", answers: ["luxury"] },
      ],
    },

    /* II */
    { t: "h", text: "II. Collocation & cụm động từ — chọn đáp án đúng (8 câu)" },
    {
      t: "mcq",
      id: "t2d16-bt-colloc",
      title: "II. Chọn từ đúng (8 câu)",
      items: [
        { q: "Before buying a TV, it's a good idea to ___ around.", options: ["shop", "run", "pay"], correct: 0, why: "**shop around** = so giá nhiều nơi (Từ vựng mục 3). run around = chạy lăng xăng; pay around không tồn tại." },
        { q: "I'd love to ___ on a nice dinner for my mum's birthday.", options: ["cut back", "pay back", "splash out"], correct: 2, why: "**splash out on** + N = chi đậm cho thứ mình thích. cut back on = cắt giảm (ngược nghĩa); pay back = trả lại tiền mượn." },
        { q: "It took me three years to ___ my student loan.", options: ["splash out", "pay off", "shop around"], correct: 1, why: "**pay off** a loan = trả hết khoản vay. Hai cụm kia không đi với loan." },
        { q: "We're trying to ___ on eating out to save money.", options: ["splash out", "run out", "cut back"], correct: 2, why: "**cut back on** + V-ing = cắt giảm. run out (of) = hết; splash out = chi mạnh — ngược với save money." },
        { q: "Prices went up, and many families struggled to make ___ meet.", options: ["ends", "money", "both"], correct: 0, why: "Thành ngữ cố định **make ends meet** = xoay xở đủ sống." },
        { q: "The best way to avoid debt is to live ___ your means.", options: ["under", "within", "inside"], correct: 1, why: "**live within your means** = sống trong khả năng tài chính. Trái nghĩa: live **beyond** your means." },
        { q: "Our family has a ___ budget, so we rarely eat out.", options: ["narrow", "tight", "thin"], correct: 1, why: "adj + N: **a tight budget** = ngân sách eo hẹp. narrow / thin là dịch từng chữ \"hẹp, mỏng\"." },
        { q: "___ spending usually rises sharply before Tet.", options: ["Consumer", "Consuming", "Consumed"], correct: 0, why: "N + N: **consumer spending** = chi tiêu của người tiêu dùng (Từ vựng mục 4, 6). Danh từ đứng trước làm \"tính từ\" cho spending." },
      ],
    },

    /* III */
    { t: "h", text: "III. Sửa lỗi collocation (5 câu)" },
    {
      t: "p",
      text: "Mỗi câu có một cụm **dịch từng chữ** (gạch ngang). Gõ **từ / cụm từ đúng** vào chỗ trống.",
    },
    {
      t: "quiz",
      id: "t2d16-bt-sua",
      title: "III. Sửa lỗi collocation — gõ phần đúng",
      kind: "fill",
      items: [
        { q: "~~I borrowed a loan from the bank.~~ → I ___ a loan from the bank.", answers: ["took out", "got"] },
        { q: "~~The salary in this job is cheap.~~ → The salary in this job is ___.", answers: ["low"] },
        { q: "~~She spent all her money to buy clothes.~~ → She spent all her money ___ clothes.", answers: ["on"] },
        { q: "~~I need to pay the money for the tickets.~~ → I need to ___ the tickets.", answers: ["pay for"] },
        { q: "~~He made debt because of gambling.~~ → He ___ into debt because of gambling.", answers: ["got", "went", "fell", "ran"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích phần III",
      items: [
        "**took out / got** a loan — borrow đi với **money**; loan đi với **take out / get** (Từ vựng mục 4–5).",
        "salary / price / wage đi với **high / low**; cheap / expensive dành cho **món đồ** (mục 5).",
        "**spend money on** + N (không phải ~~to buy~~): She spent all her money **on** clothes.",
        "**pay for** + món hàng — tự thân pay đã là \"trả tiền\", không cần ~~the money~~.",
        "**get / go / fall / run into debt** — ~~make debt~~ là dịch \"gây nợ\".",
      ],
    },

    /* IV */
    { t: "h", text: "IV. Họ từ — chọn đúng loại từ (5 câu)" },
    {
      t: "quiz",
      id: "t2d16-bt-ho-tu",
      title: "IV. Điền dạng đúng của từ trong ngoặc",
      kind: "fill",
      items: [
        { q: "Household ___ of electricity rose last winter. (CONSUME)", answers: ["consumption"] },
        { q: "The city needs more ___ housing for young workers. (AFFORD)", answers: ["affordable"] },
        { q: "Small cars are more ___ than large ones: they use less fuel. (ECONOMY)", answers: ["economical"] },
        { q: "Many students face ___ problems in their first year. (FINANCE)", answers: ["financial"] },
        { q: "My brother is a big ___ — he buys new clothes every week. (SPEND)", answers: ["spender"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích phần IV",
      items: [
        "**consumption** — sau tính từ / danh từ bổ nghĩa (household) và trước **of** cần **danh từ chỉ sự việc**. consumer là **người** — sai nghĩa.",
        "**affordable** — trước danh từ housing cần **tính từ**: affordable housing.",
        "**economical** = tiết kiệm (use less fuel). ~~economic~~ = thuộc về kinh tế — lỗi kinh điển.",
        "**financial** — tính từ trước problems.",
        "**spender** — sau \"a big\" cần danh từ chỉ **người**; spending là sự chi tiêu.",
      ],
    },

    /* V */
    { t: "h", text: "V. Dịch sang tiếng Anh (5 câu)" },
    {
      t: "quiz",
      id: "t2d16-bt-dich",
      title: "V. Dịch Việt → Anh — từ vựng & câu Task 1 hôm nay",
      kind: "translate",
      grammar: "set a budget · pay in cash / by card · save up to + V · accounted for X% · more than double / twice as much as",
      items: [
        { q: "Chúng ta nên đặt ngân sách trước khi đi mua sắm.", hint: "should, set a budget, before going shopping / before we go shopping", answers: ["We should set a budget before going shopping.", "We should set a budget before we go shopping.", "We should make a budget before going shopping.", "We should make a budget before we go shopping.", "We should set a budget before shopping."] },
        { q: "Cửa hàng này không nhận tiền mặt; bạn phải trả bằng thẻ.", hint: "This shop doesn't accept cash, have to, pay by card", answers: ["This shop doesn't accept cash; you have to pay by card.", "This shop does not accept cash; you have to pay by card.", "This shop doesn't accept cash, so you have to pay by card.", "This shop doesn't take cash; you have to pay by card.", "This shop doesn't accept cash. You have to pay by card.", "This shop doesn't accept cash; you must pay by card.", "This store doesn't accept cash; you have to pay by card."] },
        { q: "Anh ấy đã dành dụm hai năm để mua một chiếc xe máy.", hint: "saved up, for two years, to buy a motorbike", answers: ["He saved up for two years to buy a motorbike.", "He saved up for two years to buy a motorcycle.", "He saved for two years to buy a motorbike.", "He saved for two years to buy a motorcycle.", "He saved up for two years to buy a scooter.", "He saved money for two years to buy a motorbike."] },
        { q: "Thực phẩm chiếm 38% chi tiêu của các hộ gia đình Việt Nam.", hint: "Food, accounted for, 38%, household spending in Vietnam / of Vietnamese households' spending", answers: ["Food accounted for 38% of household spending in Vietnam.", "Food accounted for 38% of Vietnamese household spending.", "Food accounted for 38% of the spending of Vietnamese households.", "Food took up 38% of household spending in Vietnam.", "Food made up 38% of household spending in Vietnam.", "Food accounts for 38% of household spending in Vietnam.", "Food accounted for 38 per cent of household spending in Vietnam.", "Food accounted for 38 percent of household spending in Vietnam.", "Food accounted for 38% of Vietnamese households' spending.", "Food accounted for 38% of Vietnamese households' total spending.", "Food made up 38% of Vietnamese household spending.", "Food took up 38% of Vietnamese household spending."] },
        { q: "Hộ gia đình Việt Nam chi cho thực phẩm nhiều hơn gấp đôi hộ gia đình Anh.", hint: "Vietnamese households, spent, more than twice as much on food as, British households", answers: ["Vietnamese households spent more than twice as much on food as British households.", "Vietnamese households spent more than twice as much on food as British households did.", "Vietnamese households spent more than double the amount on food that British households did.", "Households in Vietnam spent more than twice as much on food as households in the UK.", "Households in Vietnam spent more than twice as much on food as those in the UK.", "Vietnamese households spent over twice as much on food as British households.", "Vietnamese households spent more than twice as much money on food as British households.", "Vietnamese households spent more than twice as much as British households on food.", "Vietnamese households spent more than two times as much on food as British households.", "Vietnamese households spent more than twice as much on food as UK households.", "Vietnamese households spent more than twice as much on food as households in the UK.", "Vietnamese households spent more than twice as much on food as those in the UK.", "Vietnamese households spent more than twice as much on food as households in Britain.", "Vietnamese households spent more than twice as much on food as British ones.", "Households in Vietnam spent more than twice as much on food as British households.", "Vietnamese households spent more than double what British households spent on food.", "Vietnamese households spent more than double the amount that British households spent on food."] },
      ],
    },

    /* VI */
    { t: "h", text: "VI. Matching information — bài ngắn (5 câu)" },
    {
      t: "passage",
      title: "Should Children Get Pocket Money?",
      intro: "Bài ngắn 5 đoạn A–E (~170 từ).",
      paras: [
        { label: "A", text: "In many countries, parents give children a small amount of money every week, known as pocket money. In one European country, a recent study found that the average child aged 8 to 14 received about €5 a week, almost twice the figure of twenty years earlier." },
        { label: "B", text: "Supporters say pocket money is the best way to teach children how to manage a budget. A child who spends everything on sweets on Monday learns, by Friday, that money runs out." },
        { label: "C", text: "Some parents, however, only pay children for doing jobs at home, such as washing the car. Critics argue that this teaches children to expect payment for helping their own family." },
        { label: "D", text: "Banks have noticed the trend. Several now offer cards for children as young as six, which allow parents to see every purchase on their phone and to block certain shops." },
        { label: "E", text: "Experts agree on one point: the amount matters less than the conversation. Parents who talk regularly about prices and saving tend to raise adults who are less likely to get into debt." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–5.** Which paragraph contains the following information? Write the correct letter, **A–E**. **NB** You may use any letter more than once.",
    },
    {
      t: "mcq",
      id: "t2d16-bt-noi",
      title: "VI. Matching information (5 câu, A–E)",
      items: [
        { q: "(1) a reason why linking money to housework may be a problem", options: ["A", "B", "C", "D", "E"], correct: 2, why: "Đoạn **C**: trả tiền cho việc nhà (jobs at home) → \"teaches children to **expect payment for helping their own family**\" — lý do nó có hại." },
        { q: "(2) a reference to a change in the amount children receive", options: ["A", "B", "C", "D", "E"], correct: 0, why: "Đoạn **A**: €5 a week, \"**almost twice the figure of twenty years earlier**\" — số tiền đã thay đổi theo thời gian." },
        { q: "(3) an example of technology that lets parents control spending", options: ["A", "B", "C", "D", "E"], correct: 3, why: "Đoạn **D**: thẻ cho trẻ em giúp bố mẹ \"see every purchase on their phone and **block certain shops**\" = kiểm soát chi tiêu." },
        { q: "(4) a description of how a child might learn from a mistake", options: ["A", "B", "C", "D", "E"], correct: 1, why: "Đoạn **B**: tiêu hết vào kẹo hôm thứ Hai → đến thứ Sáu **learns that money runs out** — học từ sai lầm." },
        { q: "(5) an example of a household task", options: ["A", "B", "C", "D", "E"], correct: 2, why: "Đoạn **C** lần hai (**NB**): \"such as **washing the car**\" — ví dụ việc nhà. **Đoạn E không là đáp án nào**: E nói về trò chuyện với con, không khớp câu hỏi nào." },
      ],
    },

    /* VII */
    { t: "h", text: "VII. Đọc bảng Task 1 (4 câu)" },
    {
      t: "figure",
      fig: {
        kind: "table",
        title: "Number of cashless payments per person per year in four countries, 2014 and 2024",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "payments per person",
        categories: ["2014", "2024"],
        series: [
          { name: "Norway", values: [380, 520] },
          { name: "Brazil", values: [90, 310] },
          { name: "Germany", values: [110, 180] },
          { name: "India", values: [5, 120] },
        ],
      },
    },
    {
      t: "mcq",
      id: "t2d16-bt-bang",
      title: "VII. Chọn đáp án đúng theo bảng (4 câu)",
      items: [
        { q: "Which country had the highest figure in both years?", options: ["Brazil", "Norway", "India"], correct: 1, why: "Norway: **380** (2014) và **520** (2024) — cao nhất cả hai năm. Brazil tăng mạnh nhưng 310 vẫn dưới 520." },
        { q: "Which country had the largest rise in absolute numbers (số lần tăng thêm)?", options: ["Norway", "Germany", "Brazil"], correct: 2, why: "Brazil: 90 → 310 = **+220**. Norway +140, India +115, Germany +70. \"Tăng nhiều nhất\" (số tuyệt đối) khác \"tăng nhanh nhất\" (số lần) — xem câu 3." },
        { q: "Which statement is accurate?", options: ["Germany's figure doubled.", "India's figure rose to 24 times its 2014 level.", "Brazil overtook Norway."], correct: 1, why: "India: 5 → 120 = **gấp 24 lần** ✓. Germany 110 → 180 chưa gấp đôi (gấp đôi là 220). Brazil 310 < Norway 520 → chưa vượt." },
        { q: "Which is the best overview?", options: ["Cashless payments per person increased in all four countries; Norway had the highest figure in both years, while India had the lowest.", "Norway had 380 cashless payments per person in 2014 and 520 in 2024.", "People in India prefer cash because many shops do not have card machines."], correct: 0, why: "A: không số, nói về **cả bảng** (mọi nước tăng) + cao nhất / thấp nhất. B là chi tiết có số. C là **lý do tự nghĩ ra** — bảng không nói, Task 1 không được thêm." },
      ],
    },

    /* VIII */
    { t: "h", text: "VIII. Ôn xoắn ốc — Ngày 13 & Ngày 15 (2 câu)" },
    {
      t: "mcq",
      id: "t2d16-bt-on",
      title: "VIII. Ôn ngữ pháp chặng 3 (2 câu)",
      items: [
        { q: "If you ___ by card, you will probably spend more.", options: ["pay", "will pay", "paid"], correct: 0, why: "Câu điều kiện **loại 1** (Ngày 13): **If + hiện tại đơn, will + V**. Không dùng will trong mệnh đề if; paid là loại 2 (đi với would)." },
        { q: "The app ___ I use to track my spending is free.", options: ["who", "which", "whose"], correct: 1, why: "Mệnh đề quan hệ **xác định** (Ngày 15): app là **vật** → **which** (hoặc that, hoặc bỏ hẳn vì làm tân ngữ: The app I use…). who dành cho người; whose = của ai." },
      ],
    },
    {
      t: "note",
      title: "Giải thích phần I (từ vựng)",
      items: [
        "**afford** — luôn đi với can / can't: I **can't afford** + N. **loan** — take out a loan. **savings** — luôn có -s khi là tiền dành dụm.",
        "**retailers** — chủ ngữ **Supermarkets are** (số nhiều) nên danh từ sau \"the biggest food\" cũng **số nhiều**: retailers.",
        "**essentials** — danh từ số nhiều (rice, milk and soap). **materialistic** — tính từ sau too. **income** — monthly income. **luxury** — luxury goods (danh từ làm tính từ).",
        "Sai từ 3 câu trở lên ở phần I–IV → mở lại **bài Từ vựng mục 2–6** và dùng nút \"Che nghĩa / Che từ\".",
      ],
    },
  ],
};

export const NGAY_16: Lesson[] = [T2D16_VOCAB, T2D16_READING, T2D16_WRITING, T2D16_HOMEWORK];
