/**
 * CSI106 · Chương 12 — Security and Ethical Issues, học theo từng slide (slide 1–27).
 * Deck 'csi12' (CSI12), 27 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi12/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_12.pptx của trường (/tmp/csi106-text/csi12.txt).
 * Các slide chỉ có tiêu đề + hình (8, 12, 13, 14, 16, 19, 22, 23, 25) đã được đọc thẳng từ ảnh
 * đã render để lấy đúng từng nhãn trong sơ đồ.
 *
 * MỌI PHÉP TÍNH TRONG BÀI ĐÃ CHẠY THẬT trước khi viết:
 *   · Caesar dịch 3 và Vigenère khoá "CSI" — python3 (bảng từng chữ cái, cả mã lẫn giải mã).
 *   · RSA đồ chơi p=7, q=11, n=77, e=13, d=37, P=5 → C=26 → P=5 — python3 (kể cả từng luỹ thừa
 *     bình phương liên tiếp 5^2, 5^4, 5^8 và 26^1…26^32 mod 77).
 *   · Sinh khoá RSA 2048 bit, ký và kiểm chữ ký thật — openssl 3.6.4 (Verified OK / Verification failure).
 *   · Mã hoá đối xứng AES-256-CBC thật — openssl enc (giải đúng khoá ra chữ, sai khoá "bad decrypt").
 *   · Hiệu ứng tuyết lở SHA-256 — shasum -a 256 trên hai chuỗi lệch một ký tự, và cùng mật khẩu
 *     với hai salt khác nhau.
 *   · 26! = 403.291.461.126.605.635.584.000.000 và n(n−1)/2 — python3.
 *
 * Những chỗ SLIDE GỐC SAI hoặc tự mâu thuẫn — đã nêu rõ trong bài, KHÔNG im lặng chép lại
 * và KHÔNG tự ý sửa slide:
 *   · slide 3 "Objectives" chép NHẦM TOÀN BỘ mục tiêu của Chương 11 (cơ sở dữ liệu: DBMS,
 *     ANSI/SPARC, mô hình quan hệ, ERM, chuẩn hoá). Mục tiêu THẬT của chương nằm ở slide 4.
 *   · slide 6, 8, 11 dẫn "Figure 16.1", "Figure 16.2" trong thân bài nhưng chú thích hình lại ghi
 *     "Figure 12.1", "Figure 12.2" — dấu vết chương 16 của Forouzan được đánh số lại thành 12.
 *   · slide 14 tiêu đề gõ nhầm "R4. SA cryptosystem", đúng phải là "4. RSA cryptosystem".
 *   · slide 21 đánh số "1.", slide 22 "2.", rồi slide 23 nhảy thẳng sang "4." — thiếu mục 3.
 *   · slide 26 định nghĩa Grey Hat là "công bố các tập dữ liệu lớn có lợi cho mọi người" — đó là
 *     hacktivism, không phải định nghĩa chuẩn của mũ xám.
 *   · slide 25 thu hẹp "hacker" thành người "sao chép thông tin bí mật", bỏ qua phá huỷ/tống tiền.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi12';

export default {
  title: '12.0 — Slide by slide: Security goals, confidentiality, ethics, privacy and hackers (27 slides)|||12.0 — Slide bài giảng: Mục tiêu an toàn, tính bí mật, đạo đức, quyền riêng tư & hacker (27 slide)',
  slug: 'csi106-12-0-slides-an-toan-dao-duc',
  type: 'DOCUMENT',
  description: 'Chương 12 của CSI106 đi theo đúng bộ slide của trường: ba mục tiêu an toàn thông tin (bí mật, toàn vẹn, sẵn sàng), bảng phân loại tấn công, mật mã đối xứng và bất đối xứng với RSA, ba nguyên tắc đạo đức, quyền riêng tư và thoả thuận bảo mật NDA, rồi sáu loại hacker. Mọi phép mã hoá trong bài đều được chạy tay trọn vẹn — Caesar dịch 3 và Vigenère từng chữ cái một, RSA đồ chơi p=7·q=11 tính đến từng luỹ thừa mod 77 — và được kiểm lại bằng python3, openssl và shasum trước khi viết, kèm phần đối chiếu luật Việt Nam (Luật An ninh mạng 2018, Nghị định 13/2023, Điều 289 Bộ luật Hình sự) và ranh giới pháp lý của kiểm thử xâm nhập.',
  content: [
    walkHead(D, 1, 27),
    walk(D, [

      [1, '12. Security and Ethical Issues',
        `<p class="y-chinh">🎯 The title slide of the last chapter of CSI106. Two words are joined here that most courses keep apart: <strong>security</strong> (a technical subject — keys, ciphers, attacks) and <strong>ethical issues</strong> (a human subject — what you <em>should</em> do with the power the technical part gives you).</p>
<ul>
<li><strong>Where the material comes from</strong> — Forouzan, <em>Foundations of Computer Science</em>, Chapter 16 "Security", plus material on ethics and privacy from <em>Fundamentals of Information Systems Security</em>. That is why several slides still carry Forouzan's original figure numbers ("Figure 16.1", "Figure 16.2") while the captions have been renumbered to 12.x.</li>
<li><strong>What it maps to in the syllabus</strong> — this chapter is the whole of <strong>CLO12</strong> and is taught across sessions 50–53. In a 4-session block the examiner cannot ask you to break ciphers; they ask you to <em>name, define, classify and justify</em>.</li>
<li><strong>The single sentence the chapter is built on</strong> — information is an <em>asset</em>. Once you accept that, everything follows: assets have owners, owners have rights, rights need protection, and protection needs rules that people agree to.</li>
<li><strong>Three technical goals, three ethical principles</strong> — the symmetry is deliberate. Confidentiality / integrity / availability on the machine side; moral rules / utilisation / social contract on the human side. Six items, and the exam loves both triples.</li>
<li><strong>Why this chapter is the easiest to write badly</strong> — every sentence in it sounds obvious ("information should be protected"). The way to actually learn it is to attach each abstract word to one concrete mechanism and one concrete attack. This walkthrough does that on every slide.</li>
</ul>
<p class="meo">💡 Build one A4 sheet for this chapter with exactly four boxes: <em>3 security goals · 7 attack names · 2 cipher families · 6 hacker hats</em>. Those four lists are 80% of the marks available.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của chương cuối cùng trong CSI106. Ở đây hai thứ mà phần lớn môn học để riêng lại được ghép làm một: <strong>an toàn</strong> (chuyện kỹ thuật — khoá, mật mã, tấn công) và <strong>vấn đề đạo đức</strong> (chuyện con người — bạn <em>nên</em> làm gì với cái quyền lực mà phần kỹ thuật vừa trao cho bạn).</p>
<ul>
<li><strong>Nội dung lấy từ đâu</strong> — Forouzan, <em>Foundations of Computer Science</em>, Chương 16 "Security", cộng phần đạo đức và quyền riêng tư lấy từ <em>Fundamentals of Information Systems Security</em>. Vì thế nhiều slide vẫn còn số hình gốc của Forouzan ("Figure 16.1", "Figure 16.2") trong khi chú thích đã đánh lại thành 12.x.</li>
<li><strong>Ứng với chỗ nào trong đề cương</strong> — chương này là trọn <strong>CLO12</strong>, dạy trong các buổi 50–53. Trong một khối bốn buổi, người ra đề không thể bắt bạn phá mã; họ bắt bạn <em>gọi tên, định nghĩa, phân loại và biện luận</em>.</li>
<li><strong>Một câu duy nhất mà cả chương đứng lên</strong> — thông tin là một <em>tài sản</em>. Khi đã chấp nhận câu ấy thì mọi thứ đi theo: tài sản có chủ, chủ có quyền, quyền cần được bảo vệ, và bảo vệ thì cần những luật lệ mà mọi người đồng thuận.</li>
<li><strong>Ba mục tiêu kỹ thuật, ba nguyên tắc đạo đức</strong> — sự đối xứng ấy là cố ý. Bí mật / toàn vẹn / sẵn sàng ở phía cỗ máy; luật đạo đức / lợi ích / khế ước xã hội ở phía con người. Sáu mục, và đề thi thích cả hai bộ ba.</li>
<li><strong>Vì sao đây là chương dễ học suông nhất</strong> — câu nào trong đó cũng nghe hiển nhiên ("thông tin thì phải được bảo vệ"). Cách học thật là gắn mỗi chữ trừu tượng với MỘT cơ chế cụ thể và MỘT kiểu tấn công cụ thể. Loạt bài này làm đúng việc đó ở từng slide.</li>
</ul>
<p class="meo">💡 Làm một tờ A4 cho chương này với đúng bốn ô: <em>3 mục tiêu an toàn · 7 tên tấn công · 2 họ mật mã · 6 chiếc mũ hacker</em>. Bốn danh sách ấy chiếm 80% số điểm có thể lấy.</p>`],

      [2, 'Content',
        `<p class="y-chinh">🎯 Five sections, and notice the shape: the chapter goes <em>machine → human → machine</em>. Sections 12.1–12.2 are technical, 12.3–12.4 are ethical and legal, 12.5 comes back to the people who attack the machine.</p>
<ul>
<li><strong>12.1 Introduction</strong> (slides 5–9) — information as an asset, the three security goals, the taxonomy of attacks, and the two defensive techniques (cryptography and steganography).</li>
<li><strong>12.2 Confidentiality</strong> (slides 10–14) — the only section with mathematics in it: symmetric-key ciphers, asymmetric-key ciphers, and RSA. Roughly half the technical marks of the chapter live here.</li>
<li><strong>12.3 Ethical Principles</strong> (15–19) — three theories of what makes an act right: moral rules, utilisation (consequences), social contract (majority agreement).</li>
<li><strong>12.4 Privacy</strong> (20–23) — what data may be collected about a citizen, the six codes of ethics for data collection, and the NDA as the legal instrument for keeping information confidential.</li>
<li><strong>12.5 Hackers</strong> (24–27) — how the word changed meaning, the six "hats", and the three commonest motives (money, corporate espionage, state sponsorship).</li>
<li><strong>Balance of weight</strong> — only 5 of the 27 slides are technical, yet they carry the hardest questions. Do not let the easy reading of sections 12.3–12.5 fool you into skipping RSA.</li>
</ul>
<p class="pitfall">⚠️ The section on <em>integrity</em> and <em>availability</em> gets one slide of theory (slide 7) and then never returns. Confidentiality gets five slides. If an exam asks "how do we <strong>achieve</strong> integrity?" the answer is not on any slide — it is hashing and digital signatures, which this walkthrough adds on slides 9 and 14 so that you can answer it.</p>`,
        `<p class="y-chinh">🎯 Năm mục, và hãy để ý hình dạng của nó: chương này đi theo đường <em>cỗ máy → con người → cỗ máy</em>. Mục 12.1–12.2 thuần kỹ thuật, 12.3–12.4 là đạo đức và pháp lý, 12.5 quay lại chính những con người tấn công cỗ máy.</p>
<ul>
<li><strong>12.1 Introduction</strong> (slide 5–9) — thông tin là tài sản, ba mục tiêu an toàn, bảng phân loại tấn công, và hai kỹ thuật phòng thủ (mật mã học và giấu tin).</li>
<li><strong>12.2 Confidentiality</strong> (10–14) — mục duy nhất có toán: mật mã khoá đối xứng, mật mã khoá bất đối xứng, và RSA. Khoảng một nửa số điểm kỹ thuật của chương nằm ở đây.</li>
<li><strong>12.3 Ethical Principles</strong> (15–19) — ba lý thuyết trả lời "thế nào là một hành vi đúng": luật đạo đức, lợi ích (hệ quả), khế ước xã hội (đa số đồng thuận).</li>
<li><strong>12.4 Privacy</strong> (20–23) — dữ liệu nào được phép thu thập về một công dân, sáu quy tắc đạo đức khi thu thập dữ liệu, và NDA với tư cách công cụ pháp lý giữ bí mật thông tin.</li>
<li><strong>12.5 Hackers</strong> (24–27) — chữ "hacker" đã đổi nghĩa ra sao, sáu chiếc "mũ", và ba động cơ phổ biến nhất (tiền, gián điệp doanh nghiệp, nhà nước bảo trợ).</li>
<li><strong>Tỷ trọng</strong> — chỉ 5 trong 27 slide là kỹ thuật, nhưng chúng gánh những câu hỏi khó nhất. Đừng vì mục 12.3–12.5 đọc trôi mà bỏ qua RSA.</li>
</ul>
<p class="pitfall">⚠️ Phần <em>toàn vẹn</em> và <em>sẵn sàng</em> chỉ có đúng một slide lý thuyết (slide 7) rồi không bao giờ quay lại. Trong khi tính bí mật được năm slide. Nếu đề hỏi "làm thế nào <strong>đạt được</strong> tính toàn vẹn?" thì câu trả lời không nằm trên slide nào cả — nó là hàm băm và chữ ký số, thứ mà loạt bài này bổ sung ở slide 9 và slide 14 để bạn trả lời được.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Read this slide carefully, then read it again: <strong>every single objective on it belongs to Chapter 11, not Chapter 12.</strong> DBMS, ANSI/SPARC, hierarchical/network/relational models, SQL, E-R diagrams, normalisation — that is the database chapter, copied here by accident.</p>
<ul>
<li><strong>The evidence, line by line</strong> — "Define a database and a database management system (DBMS)", "Describe the architecture of a DBMS based on the ANSI/SPARC definition", "Define the three traditional database models", "Understand operations … based on commands available in SQL", "Define ERM and E-R diagrams", "Define the hierarchical levels of normalization". Nine objectives, nine database topics, zero mention of security.</li>
<li><strong>What actually happened</strong> — the deck for Chapter 12 was built from the Chapter 11 deck and the objectives slide was never replaced. Slide 4, labelled "Objectives (cont)", carries the <em>real</em> objectives of this chapter, which is why it looks like a continuation of nothing.</li>
<li><strong>What you must do about it</strong> — treat slide 4 as the objectives slide of Chapter 12, and treat slide 3 as revision material for Chapter 11. Do not memorise slide 3 as if it described this chapter; you would answer a completely different question.</li>
<li><strong>Why we are not silently "fixing" it</strong> — the picture above is the real slide your lecturer will project. When you see the same slide in class and it disagrees with your notes, you need to know <em>which</em> of the two is wrong and why, not have the discrepancy hidden from you.</li>
<li><strong>Is it worth reading anyway?</strong> — yes, once. Chapter 11 is examinable too, and "define ERM", "define the levels of normalisation" are cheap marks if the final paper covers the whole syllabus.</li>
</ul>
<p class="pitfall">⚠️ This is the most common accident in a reused slide deck, and it teaches a real habit: <strong>an objectives slide that does not mention a single word from the chapter title is a copy-paste error, not a hidden lesson.</strong> Compare the slide title with the slide content before you trust it.</p>`,
        `<p class="y-chinh">🎯 Hãy đọc kỹ slide này, rồi đọc lại lần nữa: <strong>từng mục tiêu một trên đó đều thuộc về Chương 11, không phải Chương 12.</strong> DBMS, ANSI/SPARC, mô hình phân cấp/mạng/quan hệ, SQL, sơ đồ E-R, chuẩn hoá — đó là chương cơ sở dữ liệu, bị chép nhầm sang đây.</p>
<ul>
<li><strong>Bằng chứng, từng dòng một</strong> — "Định nghĩa cơ sở dữ liệu và hệ quản trị CSDL (DBMS)", "Mô tả kiến trúc DBMS theo định nghĩa ANSI/SPARC", "Định nghĩa ba mô hình CSDL truyền thống", "Hiểu các thao tác … dựa trên các lệnh có trong SQL", "Định nghĩa ERM và sơ đồ E-R", "Định nghĩa các mức chuẩn hoá". Chín mục tiêu, chín chủ đề cơ sở dữ liệu, không một chữ nào về an toàn thông tin.</li>
<li><strong>Chuyện gì đã xảy ra</strong> — bộ slide Chương 12 được dựng từ bộ slide Chương 11 và slide mục tiêu không bao giờ được thay. Slide 4, gắn nhãn "Objectives (cont)", mới mang mục tiêu <em>thật</em> của chương này — đó cũng là lý do nó trông như phần nối tiếp của hư không.</li>
<li><strong>Bạn phải làm gì</strong> — coi slide 4 là slide mục tiêu của Chương 12, và coi slide 3 là tài liệu ôn lại Chương 11. Đừng học thuộc slide 3 như thể nó mô tả chương này; bạn sẽ trả lời một câu hỏi hoàn toàn khác.</li>
<li><strong>Vì sao chúng tôi không lặng lẽ "sửa" nó</strong> — bức ảnh phía trên là slide thật mà giảng viên sẽ chiếu. Khi bạn thấy đúng slide ấy trên lớp mà nó trái với ghi chép của mình, bạn cần biết <em>cái nào</em> trong hai cái là sai và sai vì sao, chứ không phải để chỗ vênh bị giấu đi.</li>
<li><strong>Vậy có nên đọc không?</strong> — có, một lần. Chương 11 cũng nằm trong phạm vi thi, và "định nghĩa ERM", "định nghĩa các mức chuẩn hoá" là điểm rẻ nếu đề cuối kỳ phủ cả môn.</li>
</ul>
<p class="pitfall">⚠️ Đây là tai nạn phổ biến nhất của một bộ slide dùng lại, và nó dạy một thói quen thật: <strong>một slide mục tiêu không nhắc nổi một chữ nào trong tiêu đề chương thì đó là lỗi chép dán, không phải bài học ẩn.</strong> Hãy đối chiếu tiêu đề slide với nội dung slide trước khi tin nó.</p>`],

      [4, 'Objectives (cont)',
        `<p class="y-chinh">🎯 <em>These</em> are the real objectives of Chapter 12 — five of them, and each is a ready-made exam question. Notice the verbs again: define, distinguish, define, give the definition + discuss, define. Recall and classification, almost no calculation.</p>
<ul>
<li><strong>"Define three ethical principles related to the use of computers"</strong> — moral rules, utilisation, social contract. Slides 16–19. Three names plus one sentence each is a full answer.</li>
<li><strong>"Distinguish between physical and intellectual property and list some types"</strong> — physical property is rivalrous (if I take your laptop you no longer have it); intellectual property is not (if I copy your program you still have it, which is exactly why it needs a special law). Types: copyright (software, text, music — automatic on creation, life + 50 years in Vietnam under the Intellectual Property Law), patents (inventions, 20 years), trademarks, trade secrets (protected by NDA — slide 23).</li>
<li><strong>"Define privacy as related to the use of computers"</strong> — the right of an individual to control what personal data is collected, and how it is used. Slides 21–22.</li>
<li><strong>"Give the definition of a computer crime and discuss types of attacks, motivation for attacks, and how to protect against attacks"</strong> — the longest objective, and the one that draws on slides 8, 26 and 27 at once. Types → the taxonomy on slide 8; motivation → slide 27 (money, espionage, state); protection → cryptography, steganography, and the legal instruments.</li>
<li><strong>"Define hackers and the damage done by them"</strong> — slides 25–27.</li>
<li><strong>Note what is NOT an objective</strong> — nowhere are you asked to encrypt or decrypt anything. RSA appears on slide 14 as a named example, not as a computation you must perform. That said, a numeric RSA question is standard in past CSI106 papers, so this walkthrough works one out completely on slide 14.</li>
</ul>
<p class="meo">💡 Turn these five sentences verbatim into five flashcards tonight. If you can answer all five out loud in under four minutes, the non-technical two-thirds of the chapter is done.</p>`,
        `<p class="y-chinh">🎯 <em>Đây</em> mới là mục tiêu thật của Chương 12 — năm mục, và mỗi mục là một câu hỏi thi dọn sẵn. Lại để ý các động từ: định nghĩa, phân biệt, định nghĩa, nêu định nghĩa + thảo luận, định nghĩa. Thuần nhớ lại và phân loại, gần như không tính toán.</p>
<ul>
<li><strong>"Định nghĩa ba nguyên tắc đạo đức liên quan tới việc dùng máy tính"</strong> — luật đạo đức, lợi ích, khế ước xã hội. Slide 16–19. Ba cái tên cộng mỗi cái một câu là đã đủ điểm.</li>
<li><strong>"Phân biệt tài sản vật chất với tài sản trí tuệ và kể vài loại"</strong> — tài sản vật chất có tính loại trừ (tôi lấy cái laptop của bạn thì bạn hết laptop); tài sản trí tuệ thì không (tôi chép chương trình của bạn thì bạn vẫn còn nó — chính vì thế nó mới cần một đạo luật riêng). Các loại: quyền tác giả (phần mềm, văn bản, nhạc — tự động phát sinh khi sáng tạo, ở Việt Nam là suốt đời tác giả cộng 50 năm theo Luật Sở hữu trí tuệ), sáng chế (20 năm), nhãn hiệu, bí mật kinh doanh (bảo vệ bằng NDA — slide 23).</li>
<li><strong>"Định nghĩa quyền riêng tư trong liên hệ với việc dùng máy tính"</strong> — quyền của một cá nhân được kiểm soát dữ liệu cá nhân nào bị thu thập và dùng vào việc gì. Slide 21–22.</li>
<li><strong>"Nêu định nghĩa tội phạm máy tính và thảo luận các loại tấn công, động cơ tấn công, cách phòng vệ"</strong> — mục tiêu dài nhất, và là mục rút từ cả slide 8, 26 và 27 cùng lúc. Các loại → bảng phân loại ở slide 8; động cơ → slide 27 (tiền, gián điệp, nhà nước); phòng vệ → mật mã học, giấu tin, và các công cụ pháp lý.</li>
<li><strong>"Định nghĩa hacker và thiệt hại họ gây ra"</strong> — slide 25–27.</li>
<li><strong>Để ý cái KHÔNG phải mục tiêu</strong> — không chỗ nào bắt bạn mã hoá hay giải mã. RSA xuất hiện ở slide 14 như một ví dụ được gọi tên, không phải một phép tính bạn phải làm. Dù vậy, câu RSA bằng số là chuyện thường gặp trong đề CSI106 các kỳ trước, nên loạt bài này giải trọn một bài ở slide 14.</li>
</ul>
<p class="meo">💡 Tối nay hãy biến năm câu này, nguyên văn, thành năm tấm thẻ. Nếu nói thành tiếng được cả năm trong dưới bốn phút thì hai phần ba phi kỹ thuật của chương coi như xong.</p>`],

      [5, '1 - Introduction',
        `<p class="y-chinh">🎯 A section divider opening the part that defines the vocabulary of the whole chapter. Everything after it — ciphers, ethics, hackers — is either an attack on one of the three goals introduced here, or a defence of one of them.</p>
<ul>
<li><strong>The four slides ahead</strong> — slide 6: information is an asset and the three goals; slide 7: each goal spelled out with a banking example; slide 8: the taxonomy of attacks mapped onto the goals; slide 9: the two techniques used to defend (cryptography, steganography).</li>
<li><strong>The logical order is worth noticing</strong> — goals first, attacks second, defences third. That is the correct order for any security discussion and the one a good exam answer follows: <em>what am I protecting → what can go wrong → what do I deploy.</em></li>
<li><strong>The three-letter acronym you will meet everywhere</strong> — <strong>CIA</strong>: Confidentiality, Integrity, Availability. The slides do not use the acronym, but every security textbook, certification and job interview does. Learn both forms.</li>
<li><strong>A fourth goal exists in the literature</strong> — non-repudiation (you cannot later deny that you sent a message). Forouzan folds it into integrity via the "repudiation" attack on slide 8. If you name it as a fourth goal in an exam, say where it comes from.</li>
<li><strong>Keep the scope in mind</strong> — this is <em>information</em> security, not just computer security. A printed payroll left on a photocopier is a confidentiality failure with no computer involved at all.</li>
</ul>
<p class="meo">💡 One sentence that holds the whole section: <strong>confidentiality = nobody unauthorised can READ it; integrity = nobody unauthorised can CHANGE it; availability = anyone authorised can GET it.</strong> Read, change, get. Three verbs.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục mở ra phần định nghĩa từ vựng cho cả chương. Mọi thứ phía sau — mật mã, đạo đức, hacker — đều hoặc là một cuộc tấn công vào một trong ba mục tiêu nêu ở đây, hoặc là một cách phòng vệ cho một trong ba mục tiêu ấy.</p>
<ul>
<li><strong>Bốn slide sắp tới</strong> — slide 6: thông tin là tài sản và ba mục tiêu; slide 7: từng mục tiêu được nói rõ kèm ví dụ ngân hàng; slide 8: bảng phân loại tấn công gắn vào ba mục tiêu; slide 9: hai kỹ thuật dùng để phòng vệ (mật mã học, giấu tin).</li>
<li><strong>Thứ tự lập luận đáng để ý</strong> — mục tiêu trước, tấn công sau, phòng vệ sau cùng. Đó là thứ tự đúng cho mọi cuộc bàn về an toàn, và cũng là thứ tự mà một bài thi viết tốt đi theo: <em>tôi đang bảo vệ cái gì → cái gì có thể hỏng → tôi triển khai cái gì.</em></li>
<li><strong>Cụm ba chữ cái bạn sẽ gặp ở mọi nơi</strong> — <strong>CIA</strong>: Confidentiality, Integrity, Availability. Slide không dùng cụm viết tắt này, nhưng mọi giáo trình an toàn, mọi chứng chỉ và mọi buổi phỏng vấn đều dùng. Học cả hai dạng.</li>
<li><strong>Trong tài liệu còn một mục tiêu thứ tư</strong> — chống chối bỏ (non-repudiation: bạn không thể sau đó chối rằng mình đã gửi thông điệp). Forouzan gộp nó vào tính toàn vẹn thông qua kiểu tấn công "repudiation" ở slide 8. Nếu bạn nêu nó thành mục tiêu thứ tư trong bài thi thì hãy nói rõ nó đến từ đâu.</li>
<li><strong>Nhớ phạm vi</strong> — đây là an toàn <em>thông tin</em>, không chỉ an toàn máy tính. Một bảng lương in ra bỏ quên trên máy photocopy là một sự cố mất tính bí mật mà chẳng có cái máy tính nào dính vào.</li>
</ul>
<p class="meo">💡 Một câu giữ trọn cả mục: <strong>bí mật = không ai không phận sự ĐỌC được; toàn vẹn = không ai không phận sự SỬA được; sẵn sàng = ai có phận sự cũng LẤY được.</strong> Đọc, sửa, lấy. Ba động từ.</p>`],

      [6, '1. Introduction',
        `<p class="y-chinh">🎯 The founding claim: <em>"information is an asset that has a value like any other asset"</em> — and therefore it needs to be secured, in three specific ways: hidden from unauthorised access, protected from unauthorised change, and available when needed.</p>
<ul>
<li><strong>Why "asset" is the key word</strong> — an asset can be valued, owned, insured, stolen and destroyed. Calling information an asset lets a company put a number on it, and that number is what justifies a security budget. It is also what makes theft of information a <em>crime</em> and not merely bad manners.</li>
<li><strong>The three requirements, in the slide's own words</strong> — hidden from unauthorised access (<strong>confidentiality</strong>), protected from unauthorised change (<strong>integrity</strong>), available to an authorised entity when needed (<strong>availability</strong>). Memorise the bracketed word next to each phrase; exams give you the phrase and ask for the word, or the reverse.</li>
<li><strong>Note the word "unauthorised" twice</strong> — security is never about stopping <em>all</em> access or <em>all</em> change. A bank whose balances could never change would be useless. Security is about who is allowed, which is why authentication and authorisation come before encryption in any real system.</li>
<li><strong>"We are living in the information age"</strong> — not decoration. In 2024–2025 the reported average cost of a data breach worldwide was around USD 4.4–4.9 million per incident, and the largest single categories of loss were lost business and detection cost, not the ransom. The asset framing is literal.</li>
<li><strong>The three goals are in tension, always</strong> — every step you take for confidentiality (more encryption, more passwords, more approvals) costs availability. This tension is the reason security is an engineering trade-off and not a checklist.</li>
</ul>
<p class="pitfall">⚠️ Careful with the figure reference. This slide's body says "Figure 16.1" in some versions of the deck while the caption on slide 8 reads "Figure 12.1". Same picture — Forouzan's Chapter 16 renumbered as Chapter 12 for this course. If an exam cites "Figure 16.1", it means the attack taxonomy on slide 8.</p>`,
        `<p class="y-chinh">🎯 Luận điểm nền móng: <em>"thông tin là một tài sản có giá trị như mọi tài sản khác"</em> — và vì thế nó cần được bảo vệ, theo đúng ba cách: giấu khỏi truy cập trái phép, bảo vệ khỏi thay đổi trái phép, và sẵn sàng khi cần.</p>
<ul>
<li><strong>Vì sao "tài sản" là chữ chốt</strong> — tài sản thì định giá được, sở hữu được, bảo hiểm được, trộm được và huỷ được. Gọi thông tin là tài sản cho phép doanh nghiệp gán cho nó một con số, và chính con số ấy biện minh cho ngân sách an toàn thông tin. Nó cũng là thứ biến việc lấy cắp thông tin thành <em>tội phạm</em> chứ không chỉ là hành vi kém lịch sự.</li>
<li><strong>Ba yêu cầu, theo đúng chữ của slide</strong> — giấu khỏi truy cập trái phép (<strong>confidentiality</strong> — tính bí mật), bảo vệ khỏi thay đổi trái phép (<strong>integrity</strong> — tính toàn vẹn), sẵn sàng cho thực thể hợp lệ khi cần (<strong>availability</strong> — tính sẵn sàng). Hãy thuộc chữ trong ngoặc đi kèm từng cụm; đề thi cho cụm và hỏi chữ, hoặc ngược lại.</li>
<li><strong>Để ý chữ "trái phép" xuất hiện hai lần</strong> — an toàn thông tin không bao giờ là chặn <em>mọi</em> truy cập hay <em>mọi</em> thay đổi. Một ngân hàng mà số dư không bao giờ đổi được thì vô dụng. An toàn là chuyện AI được phép, vì thế xác thực và phân quyền đi trước mã hoá trong mọi hệ thống thật.</li>
<li><strong>"Chúng ta đang sống trong thời đại thông tin"</strong> — không phải câu trang trí. Các báo cáo 2024–2025 ghi nhận chi phí trung bình toàn cầu cho một vụ lộ lọt dữ liệu vào khoảng 4,4–4,9 triệu đô la mỗi vụ, và khoản mất lớn nhất là mất khách hàng cùng chi phí phát hiện, chứ không phải tiền chuộc. Cách nói "tài sản" ở đây là nghĩa đen.</li>
<li><strong>Ba mục tiêu LUÔN xung đột nhau</strong> — mỗi bước bạn làm cho tính bí mật (mã hoá thêm, mật khẩu thêm, phê duyệt thêm) đều lấy đi một phần tính sẵn sàng. Chính sự giằng co ấy khiến an toàn thông tin là một bài toán đánh đổi kỹ thuật, không phải một bảng tick.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận chỗ dẫn hình. Thân slide này ở vài bản ghi "Figure 16.1" trong khi chú thích ở slide 8 lại ghi "Figure 12.1". Cùng một bức hình — Chương 16 của Forouzan được đánh lại số thành Chương 12 cho môn này. Nếu đề thi trích "Figure 16.1" thì nó đang nói tới bảng phân loại tấn công ở slide 8.</p>`],

      [7, '2. Security goals',
        `<p class="y-chinh">🎯 The three goals, one paragraph each. This is the single most examinable slide of the chapter: expect "define the three security goals and give an example of an attack on each".</p>
<ul>
<li><strong>Confidentiality — "probably the most common aspect"</strong> — protecting information from being read by the wrong people. It applies both to <em>stored</em> data (a database on disk) and to data <em>in transit</em> (a login travelling over Wi-Fi). Defence: encryption, access control, and physical security.</li>
<li><strong>Integrity — the bank example the slide gives</strong> — when a customer deposits or withdraws, the balance <em>must</em> change. Integrity does not mean "never changes"; it means changes happen <strong>only by authorised entities and only through authorised mechanisms</strong>. Both halves matter: an authorised teller editing the database table directly with SQL instead of through the banking application violates integrity even though the person was authorised.</li>
<li><strong>Availability — "information is useless if it is not available"</strong> — the goal people forget until it fails. Defence: backups, redundancy, capacity planning, DDoS mitigation.</li>
<li><strong>One attack per goal, to make it concrete</strong> —</li>
</ul>
<table>
<tr><td><strong>Goal</strong></td><td><strong>Real attack that breaks it</strong></td><td><strong>Typical defence</strong></td></tr>
<tr><td>Confidentiality</td><td>Packet sniffing on an open Wi-Fi network reads a session cookie sent over plain HTTP</td><td>TLS/HTTPS, disk encryption, access control</td></tr>
<tr><td>Integrity</td><td>SQL injection changes a grade from 3.0 to 9.0 in the university database</td><td>Parameterised queries, hashes, digital signatures, audit logs</td></tr>
<tr><td>Availability</td><td>A DDoS flood saturates a web server so real students cannot register for courses</td><td>Rate limiting, CDN, redundant servers, backups</td></tr>
</table>
<p class="meo">💡 The <strong>CIA triangle</strong> is drawn as a triangle for a reason: push one corner out and the other two move. Encrypt every field in a database (confidentiality ↑) and reporting queries slow to a crawl (availability ↓).</p>
<p class="pitfall">⚠️ The classic exam trap: "integrity means the data never changes." Wrong, and the slide itself refutes it with the deposit example. Integrity is about <em>who</em> changes it and <em>how</em>, not about whether it changes.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu, mỗi mục tiêu một đoạn. Đây là slide dễ ra đề nhất cả chương: hãy chờ câu "định nghĩa ba mục tiêu an toàn và cho ví dụ một cuộc tấn công vào từng mục tiêu".</p>
<ul>
<li><strong>Tính bí mật — "có lẽ là khía cạnh thường gặp nhất"</strong> — bảo vệ thông tin khỏi bị đọc bởi người không đúng. Nó áp cho cả dữ liệu <em>đang lưu</em> (một cơ sở dữ liệu nằm trên đĩa) lẫn dữ liệu <em>đang truyền</em> (một lượt đăng nhập đi qua Wi-Fi). Phòng vệ: mã hoá, kiểm soát truy cập, và an ninh vật lý.</li>
<li><strong>Tính toàn vẹn — ví dụ ngân hàng mà slide đưa ra</strong> — khi khách gửi hay rút tiền, số dư <em>bắt buộc</em> phải đổi. Toàn vẹn không có nghĩa "không bao giờ đổi"; nó có nghĩa việc đổi chỉ xảy ra <strong>bởi thực thể được phép và qua cơ chế được phép</strong>. Cả hai vế đều quan trọng: một giao dịch viên có quyền nhưng sửa thẳng vào bảng dữ liệu bằng SQL thay vì qua ứng dụng ngân hàng thì vẫn là vi phạm tính toàn vẹn, dù người ấy có quyền.</li>
<li><strong>Tính sẵn sàng — "thông tin là vô dụng nếu không lấy được"</strong> — mục tiêu mà người ta quên cho tới lúc nó hỏng. Phòng vệ: sao lưu, dự phòng, hoạch định năng lực, chống DDoS.</li>
<li><strong>Mỗi mục tiêu một cuộc tấn công, cho cụ thể</strong> —</li>
</ul>
<table>
<tr><td><strong>Mục tiêu</strong></td><td><strong>Tấn công thật phá đúng nó</strong></td><td><strong>Phòng vệ điển hình</strong></td></tr>
<tr><td>Bí mật</td><td>Nghe lén gói tin trên Wi-Fi mở, đọc được cookie phiên gửi qua HTTP trần</td><td>TLS/HTTPS, mã hoá ổ đĩa, kiểm soát truy cập</td></tr>
<tr><td>Toàn vẹn</td><td>SQL injection sửa điểm từ 3.0 thành 9.0 trong CSDL của trường</td><td>Truy vấn tham số hoá, hàm băm, chữ ký số, nhật ký kiểm toán</td></tr>
<tr><td>Sẵn sàng</td><td>Một trận lụt DDoS làm nghẽn máy chủ web khiến sinh viên thật không đăng ký được môn</td><td>Giới hạn tần suất, CDN, máy chủ dự phòng, sao lưu</td></tr>
</table>
<p class="meo">💡 <strong>Tam giác CIA</strong> được vẽ thành tam giác là có lý do: đẩy một đỉnh ra thì hai đỉnh kia dịch theo. Mã hoá mọi trường trong cơ sở dữ liệu (bí mật ↑) thì các truy vấn báo cáo bò như rùa (sẵn sàng ↓).</p>
<p class="pitfall">⚠️ Bẫy thi kinh điển: "toàn vẹn nghĩa là dữ liệu không bao giờ thay đổi". Sai, và chính slide bác bỏ điều đó bằng ví dụ gửi tiền. Toàn vẹn là chuyện <em>ai</em> đổi và đổi <em>bằng cách nào</em>, không phải chuyện có đổi hay không.</p>`],

      [8, '3. Attacks',
        `<p class="y-chinh">🎯 Figure 12.1 — the taxonomy. Seven named attacks in three columns, one column per security goal. This is the picture the exam asks you to reproduce, so learn it as <strong>2 + 4 + 1</strong>.</p>
<ul>
<li><strong>Threat to confidentiality (2)</strong> — <em>Snooping</em>: unauthorised access to or interception of data (reading someone's e-mail in transit). <em>Traffic analysis</em>: the attacker cannot read the content but learns from the pattern — who talks to whom, how often, how long. Traffic analysis still works against encrypted traffic, which is why it is listed separately.</li>
<li><strong>Threat to integrity (4)</strong> — <em>Modification</em>: the attacker changes the message (alter an amount on a transfer). <em>Masquerading / spoofing</em>: the attacker impersonates somebody else (a fake bank login page). <em>Replaying</em>: the attacker captures a legitimate message and sends it again later (replaying a valid transfer request to move the money twice). <em>Repudiation</em>: performed by one of the two legitimate parties — the sender denies having sent, or the receiver denies having received.</li>
<li><strong>Threat to availability (1)</strong> — <em>Denial of service</em>: slow down or stop the service. Note it is a single box, and it is the only one of the seven that does not require the attacker to understand a single byte of your data.</li>
<li><strong>The distinction the figure hides — passive vs active</strong> — snooping and traffic analysis are <strong>passive</strong> (the attacker only listens; nothing is altered, so it is hard to detect and must be <em>prevented</em>, by encryption). The other five are <strong>active</strong> (something is changed or injected; harder to prevent but detectable, so you <em>detect and recover</em>). This pairing is a favourite exam question.</li>
<li><strong>Repudiation is the odd one out</strong> — every other attack comes from outside the conversation; repudiation comes from inside it. That is why its defence is different too: a digital signature, which binds a message to a private key only one person holds (slide 14).</li>
</ul>
<table>
<tr><td><strong>Attack</strong></td><td><strong>Goal broken</strong></td><td><strong>Passive/Active</strong></td><td><strong>Everyday example</strong></td></tr>
<tr><td>Snooping</td><td>Confidentiality</td><td>Passive</td><td>Reading packets on a shared café Wi-Fi</td></tr>
<tr><td>Traffic analysis</td><td>Confidentiality</td><td>Passive</td><td>Seeing that a company keeps contacting a law firm before a merger</td></tr>
<tr><td>Modification</td><td>Integrity</td><td>Active</td><td>Changing "transfer 1,000,000" to "transfer 10,000,000"</td></tr>
<tr><td>Masquerading</td><td>Integrity</td><td>Active</td><td>A phishing page that looks like the university portal</td></tr>
<tr><td>Replaying</td><td>Integrity</td><td>Active</td><td>Re-sending a captured payment request</td></tr>
<tr><td>Repudiation</td><td>Integrity</td><td>Active (insider)</td><td>"I never authorised that order"</td></tr>
<tr><td>Denial of service</td><td>Availability</td><td>Active</td><td>Flooding a registration site at 8:00 on enrolment day</td></tr>
</table>
<p class="pitfall">⚠️ Two traps. (1) Students routinely put <em>denial of service</em> under integrity — it is availability, always. (2) They put <em>masquerading</em> under confidentiality because it "steals a password" — but in this taxonomy masquerading is classified by what the attacker then <em>does to the message stream</em>, which is integrity.</p>`,
        `<p class="y-chinh">🎯 Hình 12.1 — bảng phân loại. Bảy cuộc tấn công có tên, chia ba cột, mỗi cột một mục tiêu an toàn. Đây là bức hình mà đề thi bắt vẽ lại, nên hãy học nó theo nhịp <strong>2 + 4 + 1</strong>.</p>
<ul>
<li><strong>Đe doạ tính bí mật (2)</strong> — <em>Snooping</em> (nghe trộm): truy cập hoặc chặn bắt dữ liệu trái phép (đọc email của người khác khi nó đang trên đường). <em>Traffic analysis</em> (phân tích lưu lượng): kẻ tấn công không đọc được nội dung nhưng học được từ dáng hình — ai nói với ai, bao lâu một lần, kéo dài bao nhiêu. Phân tích lưu lượng vẫn hiệu quả với lưu lượng ĐÃ mã hoá, nên nó mới được liệt riêng.</li>
<li><strong>Đe doạ tính toàn vẹn (4)</strong> — <em>Modification</em> (sửa đổi): kẻ tấn công đổi thông điệp (sửa số tiền trên một lệnh chuyển khoản). <em>Masquerading / spoofing</em> (giả danh): kẻ tấn công đóng vai người khác (trang đăng nhập ngân hàng giả). <em>Replaying</em> (phát lại): bắt lấy một thông điệp hợp lệ rồi gửi lại về sau (phát lại một lệnh chuyển tiền hợp lệ để tiền đi hai lần). <em>Repudiation</em> (chối bỏ): do chính một trong hai bên hợp lệ gây ra — người gửi chối là mình đã gửi, hoặc người nhận chối là mình đã nhận.</li>
<li><strong>Đe doạ tính sẵn sàng (1)</strong> — <em>Denial of service</em> (từ chối dịch vụ): làm chậm hoặc làm chết dịch vụ. Để ý nó chỉ có một ô, và là cái duy nhất trong bảy cái mà kẻ tấn công không cần hiểu nổi một byte dữ liệu nào của bạn.</li>
<li><strong>Phép chia mà hình giấu đi — thụ động và chủ động</strong> — nghe trộm và phân tích lưu lượng là <strong>thụ động</strong> (kẻ tấn công chỉ nghe; không sửa gì nên rất khó phát hiện, và phải <em>ngăn chặn</em> bằng mã hoá). Năm cái còn lại là <strong>chủ động</strong> (có thứ bị đổi hoặc bị chèn vào; khó ngăn hơn nhưng phát hiện được, nên ta <em>phát hiện rồi khôi phục</em>). Cặp khái niệm này là câu hỏi thi rất được ưa dùng.</li>
<li><strong>Chối bỏ là cái lạc loài</strong> — mọi tấn công khác đến từ bên ngoài cuộc hội thoại; chối bỏ đến từ bên trong nó. Vì thế cách phòng vệ cũng khác: chữ ký số, thứ ràng buộc một thông điệp với một khoá riêng mà chỉ đúng một người giữ (slide 14).</li>
</ul>
<table>
<tr><td><strong>Tấn công</strong></td><td><strong>Phá mục tiêu</strong></td><td><strong>Thụ động/Chủ động</strong></td><td><strong>Ví dụ đời thường</strong></td></tr>
<tr><td>Snooping</td><td>Bí mật</td><td>Thụ động</td><td>Đọc gói tin trên Wi-Fi quán cà phê dùng chung</td></tr>
<tr><td>Traffic analysis</td><td>Bí mật</td><td>Thụ động</td><td>Thấy một công ty liên tục liên hệ hãng luật ngay trước một thương vụ sáp nhập</td></tr>
<tr><td>Modification</td><td>Toàn vẹn</td><td>Chủ động</td><td>Sửa "chuyển 1.000.000" thành "chuyển 10.000.000"</td></tr>
<tr><td>Masquerading</td><td>Toàn vẹn</td><td>Chủ động</td><td>Trang lừa đảo trông y hệt cổng thông tin của trường</td></tr>
<tr><td>Replaying</td><td>Toàn vẹn</td><td>Chủ động</td><td>Gửi lại một yêu cầu thanh toán đã bắt được</td></tr>
<tr><td>Repudiation</td><td>Toàn vẹn</td><td>Chủ động (nội bộ)</td><td>"Tôi chưa từng duyệt đơn hàng đó"</td></tr>
<tr><td>Denial of service</td><td>Sẵn sàng</td><td>Chủ động</td><td>Làm nghẽn trang đăng ký lúc 8:00 ngày mở cổng</td></tr>
</table>
<p class="pitfall">⚠️ Hai cái bẫy. (1) Sinh viên rất hay xếp <em>từ chối dịch vụ</em> vào tính toàn vẹn — nó là tính SẴN SÀNG, luôn luôn. (2) Và xếp <em>giả danh</em> vào tính bí mật vì nó "ăn cắp mật khẩu" — nhưng trong bảng phân loại này, giả danh được xếp theo việc kẻ tấn công sau đó <em>làm gì với dòng thông điệp</em>, và đó là tính toàn vẹn.</p>`],

      [9, '4. Services and techniques',
        `<p class="y-chinh">🎯 From goals and attacks to <em>defences</em>. ITU-T defines security services; the slide names two techniques that implement them: <strong>cryptography</strong> (general) and <strong>steganography</strong> (specific).</p>
<ul>
<li><strong>Cryptography — "secret writing"</strong> — from Greek <em>kryptós</em> (hidden) + <em>gráphein</em> (to write). The message is visible but unreadable. The slide is careful: "in the past cryptography referred only to encryption and decryption using secret keys" — today it is much wider, covering hash functions, digital signatures and key agreement, none of which hide anything.</li>
<li><strong>Steganography — "covered writing"</strong> — from <em>steganós</em> (covered). The message is readable but <em>invisible</em>: nobody knows there is a message at all. Historical examples: invisible ink, a tattoo under regrown hair. Modern: changing the least significant bit of each pixel in an image, which shifts a colour value by 1 out of 256 — invisible to the eye, and a 1920×1080 photo can carry about 777 KB of hidden text that way.</li>
<li><strong>The crucial contrast</strong> — cryptography hides the <em>meaning</em>; steganography hides the <em>existence</em>. They compose: encrypt first, then hide the ciphertext in an image, and the attacker must both notice and break it.</li>
<li><strong>Hash functions — the service the slide never names, and you need it</strong> — a hash turns any input into a fixed-size fingerprint. The property that matters is the <strong>avalanche effect</strong>: change one character and the whole output changes. Measured here with <code>shasum -a 256</code>:</li>
</ul>
<pre>$ printf 'CSI106' | shasum -a 256
4bc85ba8afb7da19f02ab5a47c9eef02c278f1178a2126e8dcbce29c04deddf6
$ printf 'CSI107' | shasum -a 256
9af962875cc7128c6bbaeeef35c6fa409c380572f8cbe7e159e5fe13cca3fe12</pre>
<p class="dap-an">✅ Result: one character changed (6 → 7) and <strong>every</strong> hex digit of the 64-character output is different. That is what makes a hash usable for integrity: a single flipped bit in a downloaded file gives a completely different checksum, so tampering cannot hide.</p>
<ul>
<li><strong>Why passwords must never be stored in plain form</strong> — anyone who reads the database (an attacker, or a curious administrator) instantly owns every account, on <em>every other site</em> where the user reused the password. Store the hash instead: to check a login you hash what was typed and compare.</li>
<li><strong>And why the hash alone is not enough — salt</strong> — if two users choose the same password, their stored hashes are identical, and an attacker can precompute hashes of common passwords once and look them all up. A <em>salt</em> is a random string stored next to each user and mixed into the hash. Measured:</li>
</ul>
<pre>$ printf 'matkhau123'      | shasum -a 256 → fc8d5c17ee6bd893ac3d47583df509da68ada40070b9c9e1890cae52bc62de28
$ printf 'x7Kq9matkhau123'  | shasum -a 256 → 1c993083cb89dfa6655a285db8e77f447632b36d9e4600c5945debf26c7b68dc
$ printf 'zP2vmatkhau123'   | shasum -a 256 → b256d1a2c310dd10eee2f51f6d767ed31dbd4a982cfc5e5c5fd10e2f308f2c9b</pre>
<p class="dap-an">✅ Same password, two different salts, two unrelated hashes. The precomputed table is now useless — it would have to be rebuilt for every salt. In production you go one step further and use a <em>slow</em> password hash (bcrypt, scrypt, Argon2) so that each guess costs real time; plain SHA-256 is far too fast for this job.</p>
<p class="meo">💡 Mnemonic for the two Greek words: <strong>crypt</strong>o = crypt = a hidden <em>tomb</em>, the content is sealed; <strong>stegan</strong>o = a <em>cover</em> laid on top, you do not even see there is a tomb.</p>`,
        `<p class="y-chinh">🎯 Từ mục tiêu và tấn công chuyển sang <em>phòng vệ</em>. ITU-T định nghĩa các dịch vụ an toàn; slide gọi tên hai kỹ thuật hiện thực hoá chúng: <strong>mật mã học</strong> (tổng quát) và <strong>giấu tin</strong> (chuyên biệt).</p>
<ul>
<li><strong>Cryptography — "chữ viết bí mật"</strong> — từ tiếng Hy Lạp <em>kryptós</em> (giấu kín) + <em>gráphein</em> (viết). Thông điệp thì nhìn thấy nhưng không đọc được. Slide nói khá cẩn thận: "trước đây mật mã học chỉ nói tới mã hoá và giải mã bằng khoá bí mật" — ngày nay nó rộng hơn nhiều, gồm cả hàm băm, chữ ký số và thoả thuận khoá, mà không cái nào trong đó giấu gì cả.</li>
<li><strong>Steganography — "chữ viết bị phủ"</strong> — từ <em>steganós</em> (bị phủ). Thông điệp thì đọc được nhưng <em>vô hình</em>: không ai biết là có một thông điệp. Ví dụ lịch sử: mực vô hình, hình xăm trên da đầu rồi để tóc mọc phủ lên. Hiện đại: đổi bit thấp nhất của mỗi điểm ảnh, tức dịch một giá trị màu đi 1 trên 256 — mắt không thấy, và một tấm ảnh 1920×1080 có thể chở khoảng 777 KB chữ giấu theo cách ấy.</li>
<li><strong>Chỗ tương phản then chốt</strong> — mật mã học giấu <em>ý nghĩa</em>; giấu tin giấu <em>sự tồn tại</em>. Hai thứ ghép được với nhau: mã hoá trước, rồi giấu bản mã vào trong ảnh, thế là kẻ tấn công vừa phải nhận ra vừa phải phá được.</li>
<li><strong>Hàm băm — dịch vụ mà slide không gọi tên, nhưng bạn cần nó</strong> — hàm băm biến mọi đầu vào thành một dấu vân tay có độ dài cố định. Tính chất đáng kể là <strong>hiệu ứng tuyết lở</strong>: đổi một ký tự thì toàn bộ đầu ra đổi. Đo thật bằng <code>shasum -a 256</code>:</li>
</ul>
<pre>$ printf 'CSI106' | shasum -a 256
4bc85ba8afb7da19f02ab5a47c9eef02c278f1178a2126e8dcbce29c04deddf6
$ printf 'CSI107' | shasum -a 256
9af962875cc7128c6bbaeeef35c6fa409c380572f8cbe7e159e5fe13cca3fe12</pre>
<p class="dap-an">✅ Kết quả: đổi đúng một ký tự (6 → 7) và <strong>mọi</strong> chữ số hex trong 64 ký tự đầu ra đều khác. Chính điều đó khiến hàm băm dùng được cho tính toàn vẹn: một bit bị lật trong file vừa tải xuống cho ra một checksum hoàn toàn khác, nên việc can thiệp không giấu được.</p>
<ul>
<li><strong>Vì sao TUYỆT ĐỐI không lưu mật khẩu dạng thô</strong> — ai đọc được cơ sở dữ liệu (kẻ tấn công, hoặc một quản trị viên tò mò) là lập tức sở hữu mọi tài khoản, kể cả trên <em>mọi trang khác</em> mà người dùng xài lại mật khẩu ấy. Hãy lưu bản băm: muốn kiểm tra đăng nhập thì băm cái vừa gõ rồi so sánh.</li>
<li><strong>Và vì sao chỉ băm thôi vẫn chưa đủ — cần salt</strong> — nếu hai người chọn cùng mật khẩu thì hai bản băm lưu lại giống hệt nhau, và kẻ tấn công chỉ cần tính trước bảng băm của các mật khẩu phổ biến một lần rồi tra hàng loạt. <em>Salt</em> là một chuỗi ngẫu nhiên lưu cạnh từng người dùng và trộn vào trước khi băm. Đo thật:</li>
</ul>
<pre>$ printf 'matkhau123'      | shasum -a 256 → fc8d5c17ee6bd893ac3d47583df509da68ada40070b9c9e1890cae52bc62de28
$ printf 'x7Kq9matkhau123'  | shasum -a 256 → 1c993083cb89dfa6655a285db8e77f447632b36d9e4600c5945debf26c7b68dc
$ printf 'zP2vmatkhau123'   | shasum -a 256 → b256d1a2c310dd10eee2f51f6d767ed31dbd4a982cfc5e5c5fd10e2f308f2c9b</pre>
<p class="dap-an">✅ Cùng một mật khẩu, hai salt khác nhau, hai bản băm chẳng liên quan gì nhau. Bảng tính trước trở thành vô dụng — muốn dùng thì phải dựng lại cho từng salt. Trong hệ thống thật người ta còn đi thêm một bước nữa: dùng hàm băm mật khẩu <em>CHẬM</em> (bcrypt, scrypt, Argon2) để mỗi lần đoán đều tốn thời gian thật; SHA-256 trần quá nhanh cho việc này.</p>
<p class="meo">💡 Mẹo nhớ hai chữ Hy Lạp: <strong>crypt</strong>o = crypt = cái <em>hầm mộ</em> kín, nội dung bị niêm phong; <strong>stegan</strong>o = một <em>tấm phủ</em> đặt lên trên, bạn thậm chí không thấy là có cái hầm mộ nào.</p>`],

      [10, '2 - CONFIDENTIALITY',
        `<p class="y-chinh">🎯 Section divider for the only mathematical part of the chapter. Four slides, one question: <strong>how do you make a message unreadable to everyone except the person you meant it for?</strong></p>
<ul>
<li><strong>The vocabulary you need before slide 11</strong> — <em>plaintext</em> (P) is the readable message; <em>ciphertext</em> (C) is the scrambled one; the <em>cipher</em> is the algorithm; the <em>key</em> is the secret parameter. Encryption is C = E(P, key); decryption is P = D(C, key).</li>
<li><strong>Kerckhoffs's principle, 1883 — the rule that decides everything that follows</strong> — a cryptosystem must stay secure even if <em>everything about the system except the key</em> is public knowledge. That is why real algorithms (AES, RSA) are published, standardised and attacked by the whole world for decades: a secret algorithm is one leak away from worthless, a secret key can be changed in a second.</li>
<li><strong>The two families ahead</strong> — symmetric-key (slide 11): one shared key, fast, but how do you share it? Asymmetric-key (slides 12–14): two mathematically linked keys, one public and one private, slow, but no sharing problem.</li>
<li><strong>How they are used together in reality</strong> — every HTTPS connection you have ever made does both: asymmetric cryptography to agree on a fresh random key, then symmetric cryptography (AES) to encrypt the actual traffic. Asymmetric for the handshake, symmetric for the bulk. Say that sentence in an exam and you have shown you understand both.</li>
<li><strong>What "breaking" a cipher means</strong> — recovering the plaintext (or the key) faster than trying all keys. A cipher with a 128-bit key has 2<sup>128</sup> ≈ 3,4 × 10<sup>38</sup> possibilities; brute force is not the threat. Bad key management is.</li>
</ul>
<p class="meo">💡 Keep the two words straight by their prefix: <strong>sym</strong>metric = same (one key both ways); <strong>a</strong>symmetric = not the same (encrypt with one, decrypt with the other).</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho phần duy nhất có toán của chương. Bốn slide, một câu hỏi: <strong>làm sao khiến một thông điệp không đọc được với tất cả mọi người trừ đúng người bạn muốn gửi?</strong></p>
<ul>
<li><strong>Từ vựng cần có trước slide 11</strong> — <em>bản rõ</em> (P) là thông điệp đọc được; <em>bản mã</em> (C) là bản đã xáo; <em>cipher</em> là thuật toán; <em>khoá</em> là tham số bí mật. Mã hoá là C = E(P, khoá); giải mã là P = D(C, khoá).</li>
<li><strong>Nguyên lý Kerckhoffs, 1883 — luật quyết định mọi thứ phía sau</strong> — một hệ mật phải an toàn ngay cả khi <em>mọi thứ về hệ thống trừ cái khoá</em> đều được công khai. Vì thế các thuật toán thật (AES, RSA) đều được công bố, chuẩn hoá và bị cả thế giới đánh phá suốt hàng chục năm: một thuật toán bí mật chỉ cách sự vô dụng đúng một lần rò rỉ, còn một cái khoá bí mật thì đổi trong một giây.</li>
<li><strong>Hai họ sắp tới</strong> — khoá đối xứng (slide 11): một khoá dùng chung, nhanh, nhưng chia khoá bằng cách nào? Khoá bất đối xứng (slide 12–14): hai khoá gắn với nhau bằng toán, một công khai một riêng tư, chậm, nhưng không còn bài toán chia khoá.</li>
<li><strong>Thực tế người ta dùng CẢ HAI cùng lúc</strong> — mọi kết nối HTTPS bạn từng tạo đều làm cả hai: mật mã bất đối xứng để thoả thuận một khoá ngẫu nhiên mới, rồi mật mã đối xứng (AES) để mã hoá lưu lượng thật. Bất đối xứng cho lúc bắt tay, đối xứng cho phần lớn dữ liệu. Nói được câu đó trong bài thi là bạn đã chứng tỏ hiểu cả hai.</li>
<li><strong>"Phá" một hệ mật nghĩa là gì</strong> — lấy lại được bản rõ (hoặc khoá) nhanh hơn việc thử hết mọi khoá. Một hệ mật khoá 128 bit có 2<sup>128</sup> ≈ 3,4 × 10<sup>38</sup> khả năng; vét cạn không phải mối đe doạ. Quản lý khoá cẩu thả mới là.</li>
</ul>
<p class="meo">💡 Giữ hai chữ khỏi lẫn bằng tiền tố: <strong>sym</strong>metric = giống nhau (một khoá cho cả hai chiều); <strong>a</strong>symmetric = không giống (mã bằng cái này, giải bằng cái kia).</p>`],

      [11, '1. Symmetric-key ciphers',
        `<p class="y-chinh">🎯 Figure 12.2: Alice encrypts, Bob decrypts, and between them runs a dotted line labelled <strong>"Secure key-exchange channel"</strong>. Everything that is right and everything that is wrong with symmetric cryptography is in that dotted line.</p>
<ul>
<li><strong>The definition, from the slide</strong> — "the same key for both encryption and decryption, and the key can be used for bidirectional communication, which is why it is called symmetric."</li>
<li><strong>Read the figure properly</strong> — the ciphertext travels over the fat grey pipe labelled <em>insecure channel</em>; the shared secret key travels over a <em>separate, secure</em> channel. That second channel is drawn dotted because the figure cannot say how you get it. If you already had a secure channel, why would you need the cipher at all? That is the key-distribution problem.</li>
<li><strong>Worked example — the Caesar cipher, shift 3</strong>. Letters are numbered A=0 … Z=25, and each letter becomes (value + 3) mod 26. Encrypt <code>SECURITY</code>:</li>
</ul>
<table>
<tr><td><strong>Plain</strong></td><td><strong>Value</strong></td><td><strong>(value + 3) mod 26</strong></td><td><strong>Cipher</strong></td></tr>
<tr><td>S</td><td>18</td><td>(18+3) mod 26 = 21</td><td>V</td></tr>
<tr><td>E</td><td>4</td><td>(4+3) mod 26 = 7</td><td>H</td></tr>
<tr><td>C</td><td>2</td><td>(2+3) mod 26 = 5</td><td>F</td></tr>
<tr><td>U</td><td>20</td><td>(20+3) mod 26 = 23</td><td>X</td></tr>
<tr><td>R</td><td>17</td><td>(17+3) mod 26 = 20</td><td>U</td></tr>
<tr><td>I</td><td>8</td><td>(8+3) mod 26 = 11</td><td>L</td></tr>
<tr><td>T</td><td>19</td><td>(19+3) mod 26 = 22</td><td>W</td></tr>
<tr><td>Y</td><td>24</td><td>(24+3) mod 26 = <strong>1</strong></td><td>B</td></tr>
</table>
<p class="dap-an">✅ Ciphertext = <code>VHFXULWB</code>. Decrypting is the same machine run backwards, (value − 3) mod 26: V(21)→18=S, H(7)→4=E, F(5)→2=C, X(23)→20=U, U(20)→17=R, L(11)→8=I, W(22)→19=T, B(1)→(1−3) mod 26 = 24 = Y ⇒ <code>SECURITY</code>. Verified with python3.</p>
<ul>
<li><strong>Watch the wrap-around</strong> — Y is the only letter here that goes past Z. 24 + 3 = 27, and 27 mod 26 = 1 = B. In decryption the same row goes the other way: 1 − 3 = −2, and −2 mod 26 = 24 = Y. Losing marks on negative modulo is the single commonest error in this question type.</li>
<li><strong>How weak is it?</strong> — the key is one number from 1 to 25. Twenty-five tries and you are in. A monoalphabetic substitution cipher (any permutation of the alphabet) does better: 26! = 403.291.461.126.605.635.584.000.000 ≈ 4,03 × 10<sup>26</sup> keys — but it still falls to frequency analysis in minutes, because E stays the commonest letter whatever you call it.</li>
<li><strong>Real symmetric ciphers</strong> — DES (1977, 56-bit key, broken by brute force in 1998 in 56 hours) and AES (2001, 128/192/256-bit keys, still unbroken). Run for real with <code>openssl</code>:</li>
</ul>
<pre>$ printf 'Diem thi CSI106: 9.0' &gt; diem.txt
$ openssl enc -aes-256-cbc -pbkdf2 -in diem.txt -out diem.enc -pass pass:khoabimat
$ xxd -p diem.enc
53616c7465645f5fdb5091689805dac49b144863d39a47860a27f37907fc1cfe45ee5a184b1a1edda3e81d0c6cb326bd
$ openssl enc -d -aes-256-cbc -pbkdf2 -in diem.enc -pass pass:khoabimat
Diem thi CSI106: 9.0
$ openssl enc -d -aes-256-cbc -pbkdf2 -in diem.enc -pass pass:khoasai
bad decrypt</pre>
<p class="dap-an">✅ Same key both ways → the text comes back exactly. One character wrong in the key → <code>bad decrypt</code> and nothing readable. That is "symmetric" demonstrated, not asserted.</p>
<p class="pitfall">⚠️ The fatal arithmetic of symmetric keys: <em>n</em> people who all need to talk privately in pairs need n(n−1)/2 different keys. For 10 people that is 45; for 1.000 people it is <strong>499.500</strong> keys, every one of which must be delivered over a secure channel and then kept secret. That number is the reason asymmetric cryptography had to be invented.</p>`,
        `<p class="y-chinh">🎯 Hình 12.2: Alice mã hoá, Bob giải mã, và giữa hai người có một đường nét đứt ghi <strong>"Secure key-exchange channel"</strong> (kênh trao khoá an toàn). Mọi cái hay và mọi cái dở của mật mã đối xứng đều nằm trong cái đường nét đứt ấy.</p>
<ul>
<li><strong>Định nghĩa, theo slide</strong> — "dùng CÙNG một khoá cho cả mã hoá lẫn giải mã, và khoá ấy dùng được cho liên lạc hai chiều, đó là lý do nó được gọi là đối xứng."</li>
<li><strong>Đọc hình cho đúng</strong> — bản mã đi qua cái ống xám to ghi <em>insecure channel</em> (kênh không an toàn); còn khoá bí mật dùng chung đi qua một kênh <em>riêng, an toàn</em>. Kênh thứ hai ấy được vẽ nét đứt vì bức hình không nói nổi bạn lấy nó ở đâu ra. Mà nếu đã có sẵn một kênh an toàn thì cần gì tới hệ mật nữa? Đó chính là bài toán phân phối khoá.</li>
<li><strong>Bài giải mẫu — mã Caesar, dịch 3</strong>. Đánh số chữ cái A=0 … Z=25, mỗi chữ thành (giá trị + 3) mod 26. Mã hoá <code>SECURITY</code>:</li>
</ul>
<table>
<tr><td><strong>Chữ gốc</strong></td><td><strong>Số thứ tự</strong></td><td><strong>(số + 3) mod 26</strong></td><td><strong>Chữ mã</strong></td></tr>
<tr><td>S</td><td>18</td><td>(18+3) mod 26 = 21</td><td>V</td></tr>
<tr><td>E</td><td>4</td><td>(4+3) mod 26 = 7</td><td>H</td></tr>
<tr><td>C</td><td>2</td><td>(2+3) mod 26 = 5</td><td>F</td></tr>
<tr><td>U</td><td>20</td><td>(20+3) mod 26 = 23</td><td>X</td></tr>
<tr><td>R</td><td>17</td><td>(17+3) mod 26 = 20</td><td>U</td></tr>
<tr><td>I</td><td>8</td><td>(8+3) mod 26 = 11</td><td>L</td></tr>
<tr><td>T</td><td>19</td><td>(19+3) mod 26 = 22</td><td>W</td></tr>
<tr><td>Y</td><td>24</td><td>(24+3) mod 26 = <strong>1</strong></td><td>B</td></tr>
</table>
<p class="dap-an">✅ Bản mã = <code>VHFXULWB</code>. Giải mã là chạy đúng cỗ máy ấy theo chiều ngược, (số − 3) mod 26: V(21)→18=S, H(7)→4=E, F(5)→2=C, X(23)→20=U, U(20)→17=R, L(11)→8=I, W(22)→19=T, B(1)→(1−3) mod 26 = 24 = Y ⇒ <code>SECURITY</code>. Đã kiểm lại bằng python3.</p>
<ul>
<li><strong>Để ý chỗ quay vòng</strong> — Y là chữ duy nhất ở đây vượt qua Z. 24 + 3 = 27, và 27 mod 26 = 1 = B. Lúc giải mã thì đúng dòng ấy đi ngược: 1 − 3 = −2, và −2 mod 26 = 24 = Y. Mất điểm vì modulo số âm là lỗi phổ biến nhất của dạng bài này.</li>
<li><strong>Nó yếu tới mức nào?</strong> — khoá chỉ là một số từ 1 tới 25. Thử hai mươi lăm lần là vào. Mã thay thế đơn (một hoán vị bất kỳ của bảng chữ cái) khá hơn: 26! = 403.291.461.126.605.635.584.000.000 ≈ 4,03 × 10<sup>26</sup> khoá — nhưng vẫn gục trước phân tích tần suất trong vài phút, vì E vẫn là chữ hay gặp nhất dù bạn gọi nó là gì.</li>
<li><strong>Các hệ mật đối xứng thật</strong> — DES (1977, khoá 56 bit, bị vét cạn phá trong 56 giờ năm 1998) và AES (2001, khoá 128/192/256 bit, tới nay chưa bị phá). Chạy thật bằng <code>openssl</code>:</li>
</ul>
<pre>$ printf 'Diem thi CSI106: 9.0' &gt; diem.txt
$ openssl enc -aes-256-cbc -pbkdf2 -in diem.txt -out diem.enc -pass pass:khoabimat
$ xxd -p diem.enc
53616c7465645f5fdb5091689805dac49b144863d39a47860a27f37907fc1cfe45ee5a184b1a1edda3e81d0c6cb326bd
$ openssl enc -d -aes-256-cbc -pbkdf2 -in diem.enc -pass pass:khoabimat
Diem thi CSI106: 9.0
$ openssl enc -d -aes-256-cbc -pbkdf2 -in diem.enc -pass pass:khoasai
bad decrypt</pre>
<p class="dap-an">✅ Cùng một khoá cho cả hai chiều → chữ trở về nguyên vẹn. Sai một ký tự trong khoá → <code>bad decrypt</code> và không còn gì đọc được. "Đối xứng" được CHỨNG MINH chứ không phải được khẳng định suông.</p>
<p class="pitfall">⚠️ Phép tính chí mạng của khoá đối xứng: <em>n</em> người muốn nói riêng với nhau từng đôi một thì cần n(n−1)/2 khoá khác nhau. Mười người là 45; <strong>một nghìn người là 499.500</strong> khoá, mà cái nào cũng phải giao qua kênh an toàn rồi giữ bí mật. Chính con số ấy là lý do mật mã bất đối xứng buộc phải ra đời.</p>`],

      [12, '2. Asymmetric-key ciphers',
        `<p class="y-chinh">🎯 The conceptual leap of the whole chapter, and the slide states it in one red banner: <strong>"Symmetric-key cryptography is based on sharing secrecy; asymmetric-key cryptography is based on personal secrecy."</strong></p>
<ul>
<li><strong>Read the two red banners on the slide</strong> — the second one is just as important: <em>"In symmetric-key cryptography, symbols are permuted or substituted; in asymmetric-key cryptography, numbers are manipulated."</em> That is the real technical difference. Caesar moves letters around; RSA does arithmetic modulo a large number.</li>
<li><strong>"The secret is personal (unshared)"</strong> — this one phrase dissolves the key-distribution problem. Nobody has to carry a key to anybody. Each person generates a pair, publishes one half to the world, and keeps the other half forever.</li>
<li><strong>Why publishing a key is safe</strong> — the pair is built so that the public half only <em>locks</em> and the private half only <em>unlocks</em>. Knowing the public key does not let you compute the private key in any practical time, because that would mean factoring a 2048-bit number (slide 14).</li>
<li><strong>Do the arithmetic of the improvement</strong> — for 1.000 people: symmetric needs n(n−1)/2 = 499.500 shared keys; asymmetric needs 2n = <strong>2.000</strong> keys (one pair each), and only half of them are secret. Two hundred and fifty times fewer keys, and nothing to transport.</li>
<li><strong>"Will exist in parallel and continue to serve the community"</strong> — the slide's first line, and it is correct, not a hedge. Asymmetric is slow — on the same machine RSA is on the order of a thousand times slower per byte than AES — so nobody encrypts a video call with RSA.</li>
</ul>
<table>
<tr><td><strong></strong></td><td><strong>Symmetric-key</strong></td><td><strong>Asymmetric-key</strong></td></tr>
<tr><td>Number of keys</td><td>1 shared key per pair of people</td><td>1 pair per person (public + private)</td></tr>
<tr><td>Keys for n = 1.000</td><td>n(n−1)/2 = 499.500</td><td>2n = 2.000</td></tr>
<tr><td>Where the secret lives</td><td>Shared between two people</td><td>Personal, never leaves its owner</td></tr>
<tr><td>Operation</td><td>Symbols permuted / substituted</td><td>Numbers manipulated (modular arithmetic)</td></tr>
<tr><td>Speed</td><td>Fast (AES: gigabytes per second)</td><td>Slow (RSA: thousands of times slower)</td></tr>
<tr><td>Key distribution</td><td>Needs a secure channel first — the hard problem</td><td>Public key can be shouted in public</td></tr>
<tr><td>Typical use</td><td>Bulk data: files, disks, the body of a TLS session</td><td>Handshake, key agreement, digital signatures</td></tr>
<tr><td>Examples</td><td>DES, 3DES, AES</td><td>RSA, Diffie–Hellman, ECC</td></tr>
</table>
<p class="meo">💡 The padlock picture that makes it stick: I post thousands of <em>open padlocks</em> with my name on them, and keep the only key. Anyone can snap one shut on a box and send it to me; nobody — including the person who locked it — can open it again. The padlock is the public key.</p>
<p class="pitfall">⚠️ "Asymmetric is more secure than symmetric" is false and it is a marked-down answer. AES-256 is at least as strong as RSA-2048 against brute force; asymmetric solves a <em>key-distribution</em> problem, not a strength problem. Say "solves key distribution", never "is more secure".</p>`,
        `<p class="y-chinh">🎯 Bước nhảy khái niệm của cả chương, và slide phát biểu nó ngay trên một dải băng đỏ: <strong>"Mật mã khoá đối xứng dựa trên việc CHIA SẺ bí mật; mật mã khoá bất đối xứng dựa trên bí mật CÁ NHÂN."</strong></p>
<ul>
<li><strong>Đọc cả hai dải băng đỏ trên slide</strong> — dải thứ hai cũng quan trọng ngang: <em>"Trong mật mã đối xứng, các ký hiệu bị HOÁN VỊ hoặc THAY THẾ; trong mật mã bất đối xứng, người ta THAO TÁC TRÊN SỐ."</em> Đó mới là khác biệt kỹ thuật thật. Caesar xê dịch chữ cái; RSA làm số học theo modulo một số rất lớn.</li>
<li><strong>"Bí mật là của riêng (không chia sẻ)"</strong> — đúng một cụm ấy hoá giải bài toán phân phối khoá. Không ai phải mang khoá tới cho ai. Mỗi người sinh một cặp, công bố một nửa cho cả thế giới, và giữ nửa kia mãi mãi.</li>
<li><strong>Vì sao công bố một cái khoá lại an toàn</strong> — cặp khoá được dựng sao cho nửa công khai chỉ <em>khoá lại</em> được còn nửa riêng tư mới <em>mở ra</em> được. Biết khoá công khai không cho phép bạn tính ra khoá riêng trong thời gian có ý nghĩa, vì làm được thế nghĩa là phân tích được thừa số một số 2048 bit (slide 14).</li>
<li><strong>Hãy làm phép tính của cái lợi ấy</strong> — với 1.000 người: đối xứng cần n(n−1)/2 = 499.500 khoá dùng chung; bất đối xứng cần 2n = <strong>2.000</strong> khoá (mỗi người một cặp), mà chỉ một nửa trong đó là bí mật. Ít hơn hai trăm năm mươi lần, và không phải vận chuyển gì cả.</li>
<li><strong>"Sẽ tồn tại song song và tiếp tục phục vụ cộng đồng"</strong> — dòng đầu của slide, và đó là câu đúng chứ không phải câu nói nước đôi. Bất đối xứng chậm — trên cùng một máy, RSA chậm hơn AES cỡ hàng nghìn lần trên mỗi byte — nên không ai mã hoá một cuộc gọi video bằng RSA.</li>
</ul>
<table>
<tr><td><strong></strong></td><td><strong>Khoá đối xứng</strong></td><td><strong>Khoá bất đối xứng</strong></td></tr>
<tr><td>Số khoá</td><td>1 khoá chung cho mỗi CẶP người</td><td>1 cặp cho mỗi NGƯỜI (công khai + riêng tư)</td></tr>
<tr><td>Với n = 1.000 người</td><td>n(n−1)/2 = 499.500</td><td>2n = 2.000</td></tr>
<tr><td>Bí mật nằm ở đâu</td><td>Chia sẻ giữa hai người</td><td>Của riêng, không bao giờ rời chủ</td></tr>
<tr><td>Thao tác</td><td>Hoán vị / thay thế ký hiệu</td><td>Thao tác trên số (số học modulo)</td></tr>
<tr><td>Tốc độ</td><td>Nhanh (AES: hàng gigabyte mỗi giây)</td><td>Chậm (RSA: chậm hơn hàng nghìn lần)</td></tr>
<tr><td>Phân phối khoá</td><td>Phải có kênh an toàn trước — chính là chỗ khó</td><td>Khoá công khai có thể rao giữa chợ</td></tr>
<tr><td>Dùng điển hình</td><td>Dữ liệu khối: file, ổ đĩa, phần thân phiên TLS</td><td>Bắt tay, thoả thuận khoá, chữ ký số</td></tr>
<tr><td>Ví dụ</td><td>DES, 3DES, AES</td><td>RSA, Diffie–Hellman, ECC</td></tr>
</table>
<p class="meo">💡 Hình ảnh cái ổ khoá giúp nhớ mãi: tôi rải khắp nơi hàng nghìn <em>ổ khoá đang mở</em> có khắc tên tôi, và giữ cái chìa duy nhất. Ai cũng bấm được một cái vào thùng hàng rồi gửi cho tôi; không ai — kể cả chính người vừa bấm khoá — mở lại được. Cái ổ khoá chính là khoá công khai.</p>
<p class="pitfall">⚠️ "Bất đối xứng an toàn hơn đối xứng" là câu SAI và là câu bị trừ điểm. AES-256 mạnh ít nhất ngang RSA-2048 trước vét cạn; bất đối xứng giải bài toán <em>phân phối khoá</em>, không phải bài toán độ mạnh. Hãy nói "giải được bài toán phân phối khoá", đừng bao giờ nói "an toàn hơn".</p>`],

      [13, '3. General idea',
        `<p class="y-chinh">🎯 Figure 12.3 — the mechanism behind the promise on slide 12. Read the picture in the right order: <strong>Bob generates the pair first</strong>, publishes the public key, and only then can Alice send him anything.</p>
<ul>
<li><strong>Follow the arrows</strong> — on the right, Bob runs a <em>key-generation procedure</em>, which produces a <strong>private key</strong> (red, stays inside Bob's box) and a public key that goes out along the dotted <em>public-key distribution channel</em> marked "To public". On the left Alice takes that public key, encrypts her plaintext, and pushes the ciphertext down the <em>insecure channel</em>. Bob decrypts with his private key.</li>
<li><strong>The direction is fixed and it is the whole point</strong> — <em>encrypt with the receiver's PUBLIC key, decrypt with the receiver's PRIVATE key</em>. Not the sender's. A student who writes "Alice encrypts with her own private key" has described a digital <em>signature</em>, not encipherment, and loses the mark.</li>
<li><strong>Compare with Figure 12.2 on slide 11</strong> — the dotted channel is still there, but its label changed from "secure key-exchange" to "public-key distribution", and that word "secure" has vanished. The public key does not need to be kept secret. That single difference is the entire advance of asymmetric cryptography.</li>
<li><strong>But the channel still needs one property: authenticity</strong> — nobody may <em>substitute</em> a different public key. If Eve convinces Alice that Eve's public key belongs to Bob, Alice encrypts to Eve, who reads the message, re-encrypts it with Bob's real key and forwards it. Neither party notices. That is the <strong>man-in-the-middle</strong> attack, and it is the reason certificates and certificate authorities exist: a certificate is a signed statement that "this public key really belongs to this name".</li>
<li><strong>Where you see this every day</strong> — click the padlock in your browser on any HTTPS site and you are looking at exactly this figure: the site's public key, inside a certificate, signed by an authority your browser already trusts.</li>
<li><strong>Note what asymmetric encipherment is NOT used for</strong> — Alice does not encrypt a 2 GB file this way. She encrypts a short random AES key and sends the file under AES. That construction is called a <em>hybrid</em> or <em>digital envelope</em>, and it is what every real protocol does.</li>
</ul>
<p class="meo">💡 One line to fix the direction forever: <strong>the public key locks, the private key unlocks — so you always encrypt with the key of the person you are writing TO.</strong></p>`,
        `<p class="y-chinh">🎯 Hình 12.3 — cơ chế đứng sau lời hứa ở slide 12. Đọc bức hình theo đúng thứ tự: <strong>Bob sinh cặp khoá TRƯỚC</strong>, công bố khoá công khai, rồi Alice mới gửi được gì cho anh ta.</p>
<ul>
<li><strong>Đi theo các mũi tên</strong> — phía phải, Bob chạy <em>thủ tục sinh khoá</em>, cho ra một <strong>khoá riêng</strong> (màu đỏ, nằm lì trong hộp của Bob) và một khoá công khai đi ra theo đường nét đứt <em>public-key distribution channel</em> có ghi "To public". Phía trái, Alice lấy khoá công khai ấy, mã hoá bản rõ, rồi đẩy bản mã xuống <em>kênh không an toàn</em>. Bob giải mã bằng khoá riêng của mình.</li>
<li><strong>Chiều là cố định và đó chính là toàn bộ vấn đề</strong> — <em>mã hoá bằng khoá CÔNG KHAI của người nhận, giải mã bằng khoá RIÊNG của người nhận</em>. Không phải của người gửi. Sinh viên viết "Alice mã hoá bằng khoá riêng của chính cô ấy" là đã mô tả <em>chữ ký số</em>, không phải mã hoá bảo mật, và mất điểm.</li>
<li><strong>So với Hình 12.2 ở slide 11</strong> — đường nét đứt vẫn còn đó, nhưng nhãn của nó đổi từ "secure key-exchange" thành "public-key distribution", và chữ "secure" đã biến mất. Khoá công khai không cần giữ bí mật. Đúng một khác biệt ấy là toàn bộ bước tiến của mật mã bất đối xứng.</li>
<li><strong>Nhưng cái kênh ấy vẫn cần một tính chất: tính xác thực</strong> — không ai được phép <em>tráo</em> một khoá công khai khác vào. Nếu Eve thuyết phục được Alice rằng khoá công khai của Eve là của Bob thì Alice mã hoá cho Eve, Eve đọc xong, mã hoá lại bằng khoá thật của Bob rồi chuyển tiếp. Không bên nào phát hiện ra. Đó là tấn công <strong>người-ở-giữa</strong> (man-in-the-middle), và là lý do chứng thư số cùng các tổ chức chứng thực tồn tại: một chứng thư là lời tuyên bố có ký rằng "khoá công khai này đúng là của cái tên này".</li>
<li><strong>Bạn gặp nó mỗi ngày ở đâu</strong> — bấm vào cái ổ khoá trên thanh địa chỉ của bất kỳ trang HTTPS nào là bạn đang nhìn đúng bức hình này: khoá công khai của trang, nằm trong một chứng thư, được ký bởi một tổ chức mà trình duyệt của bạn đã tin sẵn.</li>
<li><strong>Để ý cái mà mã hoá bất đối xứng KHÔNG dùng để làm</strong> — Alice không mã hoá một file 2 GB theo cách này. Cô ấy mã hoá một khoá AES ngẫu nhiên ngắn rồi gửi file dưới lớp AES. Cách ghép đó gọi là <em>lai</em> (hybrid) hay <em>phong bì số</em>, và mọi giao thức thật đều làm vậy.</li>
</ul>
<p class="meo">💡 Một dòng ghim cứng cái chiều: <strong>khoá công khai KHOÁ lại, khoá riêng MỞ ra — nên bạn luôn mã hoá bằng khoá của người mà bạn viết GỬI TỚI.</strong></p>`],

      [14, 'R4. SA cryptosystem (RSA)',
        `<p class="y-chinh">🎯 Figure 12.4 — the actual algorithm, in four boxes: Bob picks p and q, computes n = p × q, selects e and d; publishes (e, n); Alice computes <strong>C = P<sup>e</sup> mod n</strong>; Bob recovers <strong>P = C<sup>d</sup> mod n</strong>.</p>
<ul>
<li><strong>The title on the slide is a typo</strong> — it reads "R4. SA cryptosystem". It should be "4. RSA cryptosystem": the R migrated from RSA to the item number. The body text is correct — Rivest, Shamir and Adleman, published 1977 at MIT.</li>
<li><strong>Key generation, the five steps the figure compresses</strong> — (1) choose two large primes p and q; (2) n = p × q; (3) compute φ(n) = (p−1)(q−1); (4) choose e coprime with φ(n); (5) compute d such that e × d ≡ 1 (mod φ(n)). Publish (e, n), keep d secret, and destroy p and q.</li>
<li><strong>Worked example — Forouzan's own numbers.</strong> Take p = 7, q = 11, e = 13, and the message P = 5.</li>
</ul>
<table>
<tr><td><strong>Step</strong></td><td><strong>Computation</strong></td><td><strong>Result</strong></td></tr>
<tr><td>n = p × q</td><td>7 × 11</td><td>n = 77</td></tr>
<tr><td>φ(n) = (p−1)(q−1)</td><td>6 × 10</td><td>φ = 60</td></tr>
<tr><td>Check e</td><td>gcd(13, 60) = 1 ✓</td><td>e = 13 is valid</td></tr>
<tr><td>Find d with e·d ≡ 1 (mod 60)</td><td>13 × 37 = 481 = 8 × 60 + 1</td><td>d = 37</td></tr>
<tr><td>Public key / private key</td><td>—</td><td>(e, n) = (13, 77) · d = 37</td></tr>
</table>
<ul>
<li><strong>Encryption: C = 5<sup>13</sup> mod 77</strong>, done by repeated squaring so you never write a huge number. 13 = 8 + 4 + 1:</li>
</ul>
<table>
<tr><td>5<sup>1</sup> mod 77</td><td>= 5</td></tr>
<tr><td>5<sup>2</sup> mod 77</td><td>= 25</td></tr>
<tr><td>5<sup>4</sup> mod 77</td><td>= 25<sup>2</sup> mod 77 = 625 mod 77 = 9</td></tr>
<tr><td>5<sup>8</sup> mod 77</td><td>= 9<sup>2</sup> mod 77 = 81 mod 77 = 4</td></tr>
<tr><td>5<sup>13</sup> = 5<sup>8</sup>·5<sup>4</sup>·5<sup>1</sup></td><td>= 4 × 9 × 5 = 180 mod 77 = <strong>26</strong></td></tr>
</table>
<ul>
<li><strong>Decryption: P = 26<sup>37</sup> mod 77</strong>. 37 = 32 + 4 + 1:</li>
</ul>
<table>
<tr><td>26<sup>1</sup></td><td>26</td></tr>
<tr><td>26<sup>2</sup></td><td>676 mod 77 = 60</td></tr>
<tr><td>26<sup>4</sup></td><td>60<sup>2</sup> = 3600 mod 77 = 58</td></tr>
<tr><td>26<sup>8</sup></td><td>58<sup>2</sup> = 3364 mod 77 = 53</td></tr>
<tr><td>26<sup>16</sup></td><td>53<sup>2</sup> = 2809 mod 77 = 37</td></tr>
<tr><td>26<sup>32</sup></td><td>37<sup>2</sup> = 1369 mod 77 = 60</td></tr>
<tr><td>26<sup>37</sup> = 26<sup>32</sup>·26<sup>4</sup>·26<sup>1</sup></td><td>60 × 58 × 26 mod 77 = <strong>5</strong></td></tr>
</table>
<p class="dap-an">✅ P = 5 → C = 26 → P = 5. The message came back. Every line above was verified with python3 (<code>pow(5,13,77)</code> = 26, <code>pow(26,37,77)</code> = 5).</p>
<ul>
<li><strong>Why it is hard to break</strong> — an attacker sees (e, n) = (13, 77) and C = 26. To find d they need φ(n), and to find φ(n) they need p and q, which means <em>factoring n</em>. Factoring 77 takes a second; factoring a 2048-bit n (617 decimal digits) has never been done. The security of RSA is exactly the difficulty of factoring, no more and no less.</li>
<li><strong>The same machine run backwards is a digital signature</strong> — sign with the <em>private</em> key, verify with the <em>public</em> key. That gives integrity, authentication and non-repudiation in one move, which is the answer to the "repudiation" attack of slide 8. Run for real with openssl 3.6.4:</li>
</ul>
<pre>$ openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out private.pem
$ openssl rsa -in private.pem -pubout -out public.pem
$ printf 'Bai nop cuoi ky CSI106 - Nguyen Van A' &gt; baiviet.txt
$ openssl dgst -sha256 -sign private.pem -out chuky.bin baiviet.txt
$ openssl dgst -sha256 -verify public.pem -signature chuky.bin baiviet.txt
Verified OK
# now change ONE character of the document (A → B) and verify again:
$ openssl dgst -sha256 -verify public.pem -signature chuky.bin baiviet_sua.txt
Verification failure</pre>
<p class="dap-an">✅ <code>Verified OK</code> on the original, <code>Verification failure</code> after a single letter changed — and the signature file is 256 bytes, exactly 2048 bits, the size of the modulus. Notice the command signs a SHA-256 <em>hash</em>, not the document: hashing first is what lets a 256-byte signature cover a file of any size.</p>
<p class="pitfall">⚠️ Two exam traps. (1) <strong>P must be smaller than n.</strong> With n = 77 you cannot encrypt 100 — modular arithmetic would map it onto 100 mod 77 = 23 and decryption returns 23, not 100. Real RSA splits the message into blocks smaller than n. (2) Do not confuse the two directions: <em>encrypt</em> = public key of the receiver; <em>sign</em> = private key of the sender. Same algebra, opposite keys, completely different purpose.</p>`,
        `<p class="y-chinh">🎯 Hình 12.4 — thuật toán thật, gói trong bốn ô: Bob chọn p và q, tính n = p × q, chọn e và d; công bố (e, n); Alice tính <strong>C = P<sup>e</sup> mod n</strong>; Bob lấy lại <strong>P = C<sup>d</sup> mod n</strong>.</p>
<ul>
<li><strong>Tiêu đề slide gõ nhầm</strong> — nó ghi "R4. SA cryptosystem". Đúng phải là "4. RSA cryptosystem": chữ R chạy từ RSA sang dính vào số thứ tự. Phần thân thì đúng — Rivest, Shamir và Adleman, công bố năm 1977 tại MIT.</li>
<li><strong>Sinh khoá, năm bước mà bức hình nén lại</strong> — (1) chọn hai số nguyên tố lớn p và q; (2) n = p × q; (3) tính φ(n) = (p−1)(q−1); (4) chọn e nguyên tố cùng nhau với φ(n); (5) tìm d sao cho e × d ≡ 1 (mod φ(n)). Công bố (e, n), giữ kín d, và huỷ p cùng q.</li>
<li><strong>Bài giải mẫu — đúng bộ số của Forouzan.</strong> Lấy p = 7, q = 11, e = 13, và thông điệp P = 5.</li>
</ul>
<table>
<tr><td><strong>Bước</strong></td><td><strong>Phép tính</strong></td><td><strong>Kết quả</strong></td></tr>
<tr><td>n = p × q</td><td>7 × 11</td><td>n = 77</td></tr>
<tr><td>φ(n) = (p−1)(q−1)</td><td>6 × 10</td><td>φ = 60</td></tr>
<tr><td>Kiểm e</td><td>ƯCLN(13, 60) = 1 ✓</td><td>e = 13 hợp lệ</td></tr>
<tr><td>Tìm d với e·d ≡ 1 (mod 60)</td><td>13 × 37 = 481 = 8 × 60 + 1</td><td>d = 37</td></tr>
<tr><td>Khoá công khai / khoá riêng</td><td>—</td><td>(e, n) = (13, 77) · d = 37</td></tr>
</table>
<ul>
<li><strong>Mã hoá: C = 5<sup>13</sup> mod 77</strong>, làm bằng bình phương liên tiếp để không bao giờ phải viết ra một số khổng lồ. 13 = 8 + 4 + 1:</li>
</ul>
<table>
<tr><td>5<sup>1</sup> mod 77</td><td>= 5</td></tr>
<tr><td>5<sup>2</sup> mod 77</td><td>= 25</td></tr>
<tr><td>5<sup>4</sup> mod 77</td><td>= 25<sup>2</sup> mod 77 = 625 mod 77 = 9</td></tr>
<tr><td>5<sup>8</sup> mod 77</td><td>= 9<sup>2</sup> mod 77 = 81 mod 77 = 4</td></tr>
<tr><td>5<sup>13</sup> = 5<sup>8</sup>·5<sup>4</sup>·5<sup>1</sup></td><td>= 4 × 9 × 5 = 180 mod 77 = <strong>26</strong></td></tr>
</table>
<ul>
<li><strong>Giải mã: P = 26<sup>37</sup> mod 77</strong>. 37 = 32 + 4 + 1:</li>
</ul>
<table>
<tr><td>26<sup>1</sup></td><td>26</td></tr>
<tr><td>26<sup>2</sup></td><td>676 mod 77 = 60</td></tr>
<tr><td>26<sup>4</sup></td><td>60<sup>2</sup> = 3600 mod 77 = 58</td></tr>
<tr><td>26<sup>8</sup></td><td>58<sup>2</sup> = 3364 mod 77 = 53</td></tr>
<tr><td>26<sup>16</sup></td><td>53<sup>2</sup> = 2809 mod 77 = 37</td></tr>
<tr><td>26<sup>32</sup></td><td>37<sup>2</sup> = 1369 mod 77 = 60</td></tr>
<tr><td>26<sup>37</sup> = 26<sup>32</sup>·26<sup>4</sup>·26<sup>1</sup></td><td>60 × 58 × 26 mod 77 = <strong>5</strong></td></tr>
</table>
<p class="dap-an">✅ P = 5 → C = 26 → P = 5. Thông điệp đã trở về. Từng dòng ở trên đều được kiểm lại bằng python3 (<code>pow(5,13,77)</code> = 26, <code>pow(26,37,77)</code> = 5).</p>
<ul>
<li><strong>Vì sao khó phá</strong> — kẻ tấn công thấy (e, n) = (13, 77) và C = 26. Muốn tìm d thì cần φ(n), muốn có φ(n) thì cần p và q, tức là phải <em>phân tích n ra thừa số</em>. Phân tích 77 mất một giây; phân tích một n 2048 bit (617 chữ số thập phân) thì chưa ai làm được. Độ an toàn của RSA đúng bằng độ khó của bài toán phân tích thừa số, không hơn không kém.</li>
<li><strong>Chạy đúng cỗ máy ấy theo chiều ngược thì thành chữ ký số</strong> — ký bằng khoá <em>riêng</em>, kiểm bằng khoá <em>công khai</em>. Một nước đi mà được cả tính toàn vẹn, tính xác thực và chống chối bỏ — tức là câu trả lời cho kiểu tấn công "repudiation" ở slide 8. Chạy thật bằng openssl 3.6.4:</li>
</ul>
<pre>$ openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out private.pem
$ openssl rsa -in private.pem -pubout -out public.pem
$ printf 'Bai nop cuoi ky CSI106 - Nguyen Van A' &gt; baiviet.txt
$ openssl dgst -sha256 -sign private.pem -out chuky.bin baiviet.txt
$ openssl dgst -sha256 -verify public.pem -signature chuky.bin baiviet.txt
Verified OK
# bây giờ đổi MỘT ký tự của tài liệu (A → B) rồi kiểm lại:
$ openssl dgst -sha256 -verify public.pem -signature chuky.bin baiviet_sua.txt
Verification failure</pre>
<p class="dap-an">✅ <code>Verified OK</code> với bản gốc, <code>Verification failure</code> sau khi đổi đúng một chữ cái — và file chữ ký nặng 256 byte, đúng 2048 bit, bằng kích thước modulus. Để ý lệnh ký lên một <em>bản băm</em> SHA-256 chứ không lên tài liệu: chính việc băm trước mới cho phép một chữ ký 256 byte phủ được file lớn tuỳ ý.</p>
<p class="pitfall">⚠️ Hai bẫy thi. (1) <strong>P phải NHỎ HƠN n.</strong> Với n = 77 bạn không mã hoá được số 100 — số học modulo sẽ ánh xạ nó thành 100 mod 77 = 23 và giải mã trả về 23 chứ không phải 100. RSA thật chia thông điệp thành các khối nhỏ hơn n. (2) Đừng lẫn hai chiều: <em>mã hoá</em> = khoá công khai của người NHẬN; <em>ký</em> = khoá riêng của người GỬI. Cùng một đại số, khoá ngược nhau, mục đích khác hẳn nhau.</p>`],

      [15, '3 - Ethical Principles',
        `<p class="y-chinh">🎯 The chapter changes register here. Slides 5–14 asked "what <em>can</em> we do?"; from now on the question is "what <em>should</em> we do?" — and no amount of RSA answers it.</p>
<ul>
<li><strong>Why an ethics section sits inside a computer science course</strong> — because the technical half you just learned is neutral. The same packet capture that a network engineer uses to debug a router is the snooping attack of slide 8. The tool does not decide; the person does.</li>
<li><strong>The five slides ahead</strong> — slide 16 introduces the three principles; 17 moral rules; 18 utilisation; 19 social contract. Three theories, three slides, one example each.</li>
<li><strong>Ethics is not law</strong> — law is what the state will punish; ethics is what you judge to be right. They overlap but neither contains the other: some legal acts are unethical (selling user data with a buried consent checkbox), and a few ethical acts are illegal. The exam wants you to keep the two words apart.</li>
<li><strong>Nor is ethics the same as a company policy</strong> — a policy tells you what the organisation will tolerate. The three principles ahead are tools for deciding when a policy itself is wrong.</li>
<li><strong>A practical reason to care, right now</strong> — this is the section that directly touches your student life: plagiarism, sharing assignment code, using someone else's account. FPTU's academic integrity rules are exactly the "social contract" principle of slide 19 written down and enforced, and you meet the same material in SSL101c this semester.</li>
</ul>
<p class="meo">💡 Three principles, three questions to ask yourself: <strong>Is the act itself wrong? (moral rules) · Who gets hurt and who benefits? (utilisation) · Would society agree? (social contract).</strong> Any decent answer in an ethics exam question walks through all three.</p>`,
        `<p class="y-chinh">🎯 Chương đổi giọng ở đây. Slide 5–14 hỏi "chúng ta <em>làm được</em> gì?"; từ đây câu hỏi là "chúng ta <em>nên</em> làm gì?" — và không lượng RSA nào trả lời được câu ấy.</p>
<ul>
<li><strong>Vì sao một mục đạo đức lại nằm trong môn khoa học máy tính</strong> — vì nửa kỹ thuật bạn vừa học là trung tính. Đúng cái phép bắt gói mà kỹ sư mạng dùng để soi lỗi router chính là cuộc tấn công nghe trộm ở slide 8. Công cụ không quyết định; con người quyết định.</li>
<li><strong>Năm slide sắp tới</strong> — slide 16 giới thiệu ba nguyên tắc; 17 luật đạo đức; 18 lợi ích; 19 khế ước xã hội. Ba lý thuyết, ba slide, mỗi cái một ví dụ.</li>
<li><strong>Đạo đức không phải luật pháp</strong> — luật là thứ nhà nước sẽ trừng phạt; đạo đức là thứ bạn phán xét là đúng. Hai cái chồng lấn nhưng không cái nào chứa cái nào: có hành vi hợp pháp mà phi đạo đức (bán dữ liệu người dùng nhờ một ô tích đồng ý giấu tận đáy trang), và có vài hành vi đạo đức mà phạm luật. Đề thi muốn bạn giữ hai chữ ấy tách bạch.</li>
<li><strong>Cũng không phải chính sách công ty</strong> — chính sách nói cho bạn biết tổ chức chấp nhận tới đâu. Ba nguyên tắc sắp tới là công cụ để phán xét khi CHÍNH cái chính sách ấy sai.</li>
<li><strong>Một lý do thiết thực ngay lúc này</strong> — đây là mục chạm thẳng vào đời sinh viên của bạn: đạo văn, chia code bài tập, dùng tài khoản của người khác. Quy định liêm chính học thuật của FPTU chính là nguyên tắc "khế ước xã hội" ở slide 19 được viết ra và được thi hành, và bạn gặp đúng nội dung ấy ở môn SSL101c cùng kỳ này.</li>
</ul>
<p class="meo">💡 Ba nguyên tắc, ba câu tự hỏi: <strong>Bản thân hành vi ấy có sai không? (luật đạo đức) · Ai thiệt và ai lợi? (lợi ích) · Xã hội có đồng ý không? (khế ước xã hội).</strong> Một bài thi đạo đức tử tế đều đi qua cả ba.</p>`],

      [16, '1. ETHICAL PRINCIPLES',
        `<p class="y-chinh">🎯 Figure 12.5: one box labelled "Ethical Principles" branching into three red boxes — <strong>Moral Rules · Utilization · Social Contract</strong>. Three names to memorise verbatim, because the objective on slide 4 asks for exactly them.</p>
<ul>
<li><strong>What the slide honestly admits</strong> — "Ethics is a very complex subject that would take several books to describe in detail. In this chapter, we discuss only three principles." That is a real limitation, not modesty: these three are a simplification of centuries of moral philosophy.</li>
<li><strong>Where each one comes from</strong> — <em>Moral rules</em> is deontology, the tradition of Immanuel Kant (1785): an act is right or wrong in itself, regardless of outcome. <em>Utilisation</em> is utilitarianism, Bentham and Mill (19th century): judge by consequences, maximise overall good. <em>Social contract</em> is Hobbes, Locke and Rousseau (17th–18th century): rules are what rational people would agree to live under.</li>
<li><strong>Why three and not one</strong> — because each fails somewhere. A rule ("never lie") gives the wrong answer in an extreme case; pure consequence-counting can justify harming one person for the benefit of many; majority agreement can be simply mistaken. Using all three as cross-checks is more robust than trusting any one.</li>
<li><strong>Applying them to one computing case</strong> — you find a security hole in the university portal. <em>Moral rules</em>: exploiting it means deceiving and trespassing — wrong in itself. <em>Utilisation</em>: quietly reporting it helps thousands of students; exploiting it helps one. <em>Social contract</em>: nobody would agree to a society where anyone who finds a key may enter any house. All three converge: report it, do not exploit it.</li>
<li><strong>The professional codes this becomes</strong> — the ACM Code of Ethics (1992, revised 2018) and the IEEE-CS/ACM Software Engineering Code are these principles turned into specific rules for people who write software, and they are what a professional body would judge you against.</li>
</ul>
<p class="meo">💡 Remember the three by the question each one asks: <strong>rules → "what kind of act is this?" · utilisation → "what happens next?" · social contract → "who agreed to this?"</strong></p>`,
        `<p class="y-chinh">🎯 Hình 12.5: một ô ghi "Ethical Principles" rẽ ra ba ô đỏ — <strong>Moral Rules · Utilization · Social Contract</strong>. Ba cái tên phải thuộc nguyên văn, vì mục tiêu ở slide 4 hỏi đúng chúng.</p>
<ul>
<li><strong>Điều slide thành thật thừa nhận</strong> — "Đạo đức là một chủ đề rất phức tạp, mô tả cho kỹ phải mất vài cuốn sách. Trong chương này chúng ta chỉ bàn ba nguyên tắc." Đó là một giới hạn thật, không phải lời khiêm tốn: ba cái này là bản rút gọn của hàng thế kỷ triết học đạo đức.</li>
<li><strong>Mỗi cái đến từ đâu</strong> — <em>Moral rules</em> là thuyết nghĩa vụ, truyền thống của Immanuel Kant (1785): một hành vi tự nó đúng hoặc sai, bất kể kết quả. <em>Utilization</em> là thuyết vị lợi, Bentham và Mill (thế kỷ 19): xét theo hệ quả, tối đa hoá điều tốt chung. <em>Social contract</em> là Hobbes, Locke và Rousseau (thế kỷ 17–18): luật lệ là thứ mà những con người có lý trí sẽ đồng thuận sống dưới nó.</li>
<li><strong>Vì sao ba chứ không phải một</strong> — vì cái nào cũng hỏng ở đâu đó. Một luật cứng ("không bao giờ nói dối") cho câu trả lời sai trong tình huống cực đoan; chỉ đếm hệ quả thì có thể biện minh cho việc hại một người để lợi cho nhiều người; còn đa số đồng thuận thì đơn giản là có thể sai. Dùng cả ba làm phép kiểm chéo thì vững hơn tin vào một cái.</li>
<li><strong>Áp cả ba vào một tình huống tin học</strong> — bạn phát hiện một lỗ hổng bảo mật trên cổng thông tin của trường. <em>Luật đạo đức</em>: khai thác nó là lừa dối và xâm nhập — tự thân đã sai. <em>Lợi ích</em>: lặng lẽ báo cáo thì giúp hàng nghìn sinh viên; khai thác thì lợi cho một người. <em>Khế ước xã hội</em>: không ai đồng ý sống trong một xã hội mà hễ ai nhặt được chìa là vào được nhà người khác. Cả ba cùng chỉ một hướng: báo cáo, đừng khai thác.</li>
<li><strong>Chúng trở thành bộ quy tắc nghề nghiệp nào</strong> — Bộ quy tắc đạo đức của ACM (1992, sửa 2018) và bộ quy tắc Kỹ nghệ phần mềm IEEE-CS/ACM chính là ba nguyên tắc này được viết thành luật cụ thể cho người làm phần mềm, và đó là thứ một hiệp hội nghề nghiệp sẽ dùng để phán xét bạn.</li>
</ul>
<p class="meo">💡 Nhớ ba cái bằng câu hỏi mà mỗi cái đặt ra: <strong>luật đạo đức → "đây là loại hành vi gì?" · lợi ích → "sau đó chuyện gì xảy ra?" · khế ước xã hội → "ai đã đồng ý điều này?"</strong></p>`],

      [17, '2. Moral rules',
        `<p class="y-chinh">🎯 The first principle: an act is ethical if it agrees with a <strong>universally accepted principle of morality</strong> — one that holds regardless of who you are, who is watching, or what you gain.</p>
<ul>
<li><strong>The slide's own example</strong> — "if we want to illegally access a computer to get some information, we need to ask ourselves if this act is moral." Note the test: not "will I be caught", not "is it useful", but "is the act itself right".</li>
<li><strong>The universality test, made operational</strong> — Kant's formulation is: could this become a rule that <em>everyone</em> follows? Ask it about unauthorised access, and the answer is immediate: if everybody entered every computer they could, there would be no confidential data anywhere, and the very information the intruder wanted would no longer exist. The rule destroys itself, so it fails.</li>
<li><strong>Two more tests that are easy to apply in a hurry</strong> — the <em>reversibility test</em> ("would I accept this being done to me?") and the <em>publicity test</em> ("would I be comfortable if this appeared on the front page under my name?"). Both are practical versions of the same idea.</li>
<li><strong>Applied to student life, where it actually bites</strong> — copying an assignment and submitting it as your own fails all three tests at once: you would not accept a classmate stealing your work; you would not want it announced; and if everyone did it a degree would certify nothing.</li>
<li><strong>The honest weakness of this principle</strong> — who decides what is "universally accepted"? Moral rules give clean answers in clear cases (do not steal, do not deceive) and go quiet in hard ones. That is exactly why slides 18 and 19 add two more lenses.</li>
<li><strong>Where the principle is strongest</strong> — precisely in security, because most attacks require the attacker to <em>deceive</em>: pretend to be someone else, pretend to have permission, pretend the message is genuine. Deception is the clearest case a moral rule can rule on.</li>
</ul>
<p class="pitfall">⚠️ A frequent wrong answer: "it is ethical because it is legal." Legality is not the test here — slavery was legal, and downloading someone's public data at scale may be legal while remaining a clear breach of the reversibility test. Answer with the principle, then mention the law separately.</p>`,
        `<p class="y-chinh">🎯 Nguyên tắc thứ nhất: một hành vi là đạo đức nếu nó phù hợp với một <strong>nguyên lý luân lý được thừa nhận phổ quát</strong> — thứ đúng bất kể bạn là ai, ai đang nhìn, hay bạn được lợi gì.</p>
<ul>
<li><strong>Ví dụ của chính slide</strong> — "nếu ta muốn truy cập trái phép vào một máy tính để lấy thông tin, ta cần tự hỏi hành vi ấy có hợp luân lý không." Để ý phép thử: không phải "có bị bắt không", không phải "có ích không", mà là "bản thân hành vi ấy có đúng không".</li>
<li><strong>Phép thử phổ quát, biến thành thao tác được</strong> — cách phát biểu của Kant là: điều này có trở thành một luật mà <em>mọi người</em> đều theo được không? Hỏi câu ấy về việc truy cập trái phép thì câu trả lời đến ngay: nếu ai cũng vào mọi máy tính mà mình vào được thì chẳng còn dữ liệu bí mật nào trên đời, và chính cái thông tin kẻ xâm nhập muốn lấy cũng không còn tồn tại. Luật ấy tự huỷ chính nó, nên nó trượt.</li>
<li><strong>Hai phép thử nữa, dễ áp dụng khi vội</strong> — phép <em>đảo chiều</em> ("tôi có chấp nhận nếu điều này bị làm với chính tôi không?") và phép <em>công khai</em> ("tôi có thoải mái không nếu chuyện này lên trang nhất kèm tên tôi?"). Cả hai là bản thực dụng của cùng một ý.</li>
<li><strong>Áp vào đời sinh viên, chỗ nó cắn thật</strong> — chép bài tập rồi nộp như của mình trượt cả ba phép thử cùng lúc: bạn sẽ không chấp nhận nếu bạn cùng lớp lấy cắp bài của bạn; bạn không muốn chuyện đó được công bố; và nếu ai cũng làm thế thì tấm bằng chẳng chứng nhận điều gì.</li>
<li><strong>Điểm yếu thành thật của nguyên tắc này</strong> — ai quyết định cái gì là "được thừa nhận phổ quát"? Luật đạo đức cho câu trả lời sạch sẽ trong các trường hợp rõ ràng (đừng trộm, đừng lừa) và im lặng trong các trường hợp khó. Chính vì thế slide 18 và 19 thêm hai lăng kính nữa.</li>
<li><strong>Nguyên tắc này mạnh nhất ở đâu</strong> — đúng ở lĩnh vực an toàn thông tin, vì phần lớn tấn công đều đòi kẻ tấn công phải <em>lừa dối</em>: giả làm người khác, giả là có quyền, giả rằng thông điệp là thật. Lừa dối là ca rõ ràng nhất mà một luật đạo đức có thể phán.</li>
</ul>
<p class="pitfall">⚠️ Một câu trả lời sai rất hay gặp: "nó đạo đức vì nó hợp pháp". Hợp pháp không phải phép thử ở đây — chế độ nô lệ từng hợp pháp, và việc thu gom hàng loạt dữ liệu công khai của người khác có thể hợp pháp mà vẫn vi phạm rõ ràng phép thử đảo chiều. Hãy trả lời bằng nguyên tắc, rồi nhắc tới luật như một ý riêng.</p>`],

      [18, '3. Utilization',
        `<p class="y-chinh">🎯 The second principle judges an act by its <strong>consequences</strong>: an act is ethical if it results in consequences which are useful for society. The name on the slide is "Utilization"; the standard philosophical term is <em>utilitarianism</em>.</p>
<ul>
<li><strong>The slide's example, worked through its own logic</strong> — a person accesses a bank's computer and erases customer records. Question: is this useful for society? Step 1 — who is affected: every customer whose record vanished, the bank, and everyone who now trusts banks less. Step 2 — what do they gain or lose: customers may lose proof of their money; the bank pays for recovery; trust in the banking system drops. Step 3 — net result: heavily negative.</li>
<li><p class="dap-an">✅ Answer, in the slide's own words: "it is detrimental to society. It does not bring about a good result. It is not ethical."</p></li>
<li><strong>Note that this is a different <em>kind</em> of argument from slide 17</strong> — slide 17 would say erasing records is wrong because destroying what is not yours is wrong, full stop. Slide 18 says it is wrong because it produces more harm than good. Two roads, same destination here — but not always.</li>
<li><strong>Where the two roads diverge, which is the interesting case</strong> — a researcher publishes a working exploit for an unpatched flaw. Moral rules: publishing true information is not in itself deceitful. Utilisation: it depends entirely on the arithmetic — how many attackers gain a weapon versus how many defenders are pushed to patch. This is why the industry settled on <em>coordinated disclosure</em>: tell the vendor, agree a deadline (commonly 90 days), then publish. It is an explicitly utilitarian compromise.</li>
<li><strong>The two known weaknesses, worth one sentence in an exam</strong> — (1) you must predict consequences you cannot actually know; (2) counting only the total can justify sacrificing a minority for a majority. Say this and you have shown you understand the principle rather than merely repeating it.</li>
<li><strong>A computing application you will meet at work</strong> — "should we collect this extra field of user data?" Utilisation asks what it is worth to the company against the risk to every user if the database leaks. Under this principle, data you do not collect is the safest data there is.</li>
</ul>
<p class="meo">💡 To apply it in three moves: <strong>list who is affected → for each, write the gain or the loss → add them up.</strong> Writing the list is what separates a real answer from "it harms society".</p>`,
        `<p class="y-chinh">🎯 Nguyên tắc thứ hai xét hành vi theo <strong>hệ quả</strong>: một hành vi là đạo đức nếu nó dẫn tới những hệ quả có ích cho xã hội. Tên trên slide là "Utilization"; thuật ngữ triết học chuẩn là <em>thuyết vị lợi</em> (utilitarianism).</p>
<ul>
<li><strong>Ví dụ của slide, giải theo đúng logic của nó</strong> — một người truy cập vào máy tính của ngân hàng và xoá hồ sơ khách hàng. Câu hỏi: việc này có ích cho xã hội không? Bước 1 — ai bị ảnh hưởng: mọi khách hàng có hồ sơ bị bay mất, chính ngân hàng, và tất cả những người từ nay bớt tin ngân hàng. Bước 2 — họ được gì mất gì: khách có thể mất bằng chứng về tiền của mình; ngân hàng trả chi phí khôi phục; niềm tin vào hệ thống ngân hàng tụt xuống. Bước 3 — tổng kết: âm nặng.</li>
<li><p class="dap-an">✅ Đáp án, theo đúng chữ của slide: "nó có hại cho xã hội. Nó không mang lại kết quả tốt. Nó không đạo đức."</p></li>
<li><strong>Để ý đây là một <em>kiểu</em> lập luận khác với slide 17</strong> — slide 17 sẽ nói xoá hồ sơ là sai vì huỷ hoại thứ không phải của mình là sai, chấm hết. Slide 18 nói nó sai vì nó gây hại nhiều hơn lợi. Hai con đường, ở đây cùng một đích — nhưng không phải lúc nào cũng vậy.</li>
<li><strong>Chỗ hai con đường tách nhau, và đó mới là ca thú vị</strong> — một nhà nghiên cứu công bố mã khai thác chạy được cho một lỗ hổng chưa có bản vá. Luật đạo đức: công bố thông tin đúng sự thật tự nó không phải lừa dối. Lợi ích: hoàn toàn phụ thuộc vào phép cộng — bao nhiêu kẻ tấn công có thêm vũ khí so với bao nhiêu người phòng thủ bị thúc đi vá. Chính vì thế ngành này chốt lại ở <em>công bố có phối hợp</em>: báo cho nhà cung cấp, hẹn một hạn (thường 90 ngày), rồi mới công bố. Đó là một thoả hiệp vị lợi rõ rành rành.</li>
<li><strong>Hai điểm yếu đã biết, đáng viết một câu trong bài thi</strong> — (1) bạn buộc phải dự đoán những hệ quả mà bạn thật ra không biết được; (2) chỉ đếm tổng số thì có thể biện minh cho việc hy sinh thiểu số vì đa số. Nói được điều này là bạn đã chứng tỏ mình HIỂU nguyên tắc chứ không chỉ chép lại nó.</li>
<li><strong>Một ứng dụng tin học bạn sẽ gặp khi đi làm</strong> — "có nên thu thập thêm trường dữ liệu này của người dùng không?". Thuyết vị lợi hỏi nó đáng giá bao nhiêu với công ty, so với rủi ro cho từng người dùng nếu cơ sở dữ liệu bị rò. Dưới nguyên tắc này, dữ liệu mà bạn KHÔNG thu thập là loại dữ liệu an toàn nhất.</li>
</ul>
<p class="meo">💡 Áp dụng nó bằng ba nước: <strong>liệt kê ai bị ảnh hưởng → với từng người, ghi cái được hoặc cái mất → cộng lại.</strong> Chính việc viết ra cái danh sách ấy mới tách một bài làm thật khỏi câu "nó có hại cho xã hội".</p>`],

      [19, '4. Social contract',
        `<p class="y-chinh">🎯 The third principle: an act is ethical when <strong>a majority of people in society agrees with it</strong>. The slide's test case is burglary — does breaking into a house and robbing it have the approval of most people? No. Therefore not ethical.</p>
<ul>
<li><strong>Read Figure 12.6 properly</strong> — it is a loop, not a list. Government (Kings) and People sit at the two ends, with "Social Contract" between them. The inner arrows read <em>protect their rights</em> (government → people) and <em>give power</em> (people → government). The outer red arrows are what happens when the deal breaks: <em>misuse power</em> and <em>replace or overthrow it</em>.</li>
<li><strong>That loop is the whole theory in one picture</strong> — authority is not natural, it is <em>granted</em>, and it is granted in exchange for protection. A government that misuses the power forfeits the claim. Hobbes (<em>Leviathan</em>, 1651), Locke (1689) and Rousseau (<em>Du contrat social</em>, 1762) argue the variants.</li>
<li><strong>Why this belongs in a computing chapter</strong> — every rule that governs your computing life is a social contract of this shape: the terms of service you accept, the university's IT regulations, the licence on the software you install, and the law itself. You surrendered some freedom in exchange for a service, and both sides can break the deal.</li>
<li><strong>The immediate application: academic integrity</strong> — FPTU's rules on plagiarism and assignment sharing are exactly this. You gain a degree whose value depends on everyone else's work being genuine; in exchange you agree not to submit work that is not yours. If a majority defected, the certificate would be worth nothing — which is the social-contract argument for why cheating harms the cheat too. You study the same reasoning in SSL101c this semester; this slide is its philosophical root.</li>
<li><strong>The weakness you should name</strong> — a majority can agree to something unjust. "Most people approve" is evidence, not proof. This is why the three principles are used together: a majority view that fails the moral-rules test (slide 17) should worry you, not reassure you.</li>
<li><strong>Applied to the hacker section ahead</strong> — the reason unauthorised penetration testing is a crime even when the tester means well is a social contract: society agreed that permission must be given <em>in advance and in writing</em>, precisely because good intentions cannot be verified from outside. Slide 26 returns to this.</li>
</ul>
<p class="pitfall">⚠️ Do not reduce the principle to "whatever most people do is fine". The slide says a majority <em>agrees with the act</em>, not that a majority <em>performs</em> it. Half the class copying an assignment is not evidence that the class approves of copying.</p>`,
        `<p class="y-chinh">🎯 Nguyên tắc thứ ba: một hành vi là đạo đức khi <strong>đa số người trong xã hội đồng ý với nó</strong>. Ca thử của slide là trộm cắp — đột nhập vào nhà người ta rồi cướp thì có được đa số tán thành không? Không. Vậy nên không đạo đức.</p>
<ul>
<li><strong>Đọc Hình 12.6 cho đúng</strong> — nó là một vòng lặp, không phải một danh sách. Chính quyền (Kings) và Nhân dân (People) ở hai đầu, ở giữa là "Social Contract". Hai mũi tên trong đọc là <em>protect their rights</em> — bảo vệ quyền của dân (chính quyền → dân) và <em>give power</em> — trao quyền lực (dân → chính quyền). Hai mũi tên đỏ vòng ngoài là điều xảy ra khi giao kèo bị phá: <em>misuse power</em> (lạm quyền) và <em>replace or overthrow it</em> (thay thế hoặc lật đổ).</li>
<li><strong>Cái vòng ấy là cả lý thuyết gói trong một bức hình</strong> — quyền lực không phải thứ tự nhiên mà có, nó được <em>trao</em>, và trao để đổi lấy sự bảo vệ. Một chính quyền lạm dụng quyền ấy thì mất đi cơ sở đòi hỏi. Hobbes (<em>Leviathan</em>, 1651), Locke (1689) và Rousseau (<em>Khế ước xã hội</em>, 1762) tranh luận các biến thể.</li>
<li><strong>Vì sao nó thuộc về một chương tin học</strong> — mọi luật lệ chi phối đời sống số của bạn đều là một khế ước xã hội có hình dạng ấy: điều khoản dịch vụ bạn bấm đồng ý, quy chế công nghệ thông tin của trường, giấy phép của phần mềm bạn cài, và cả luật pháp. Bạn nhường một phần tự do để đổi lấy một dịch vụ, và cả hai phía đều có thể phá giao kèo.</li>
<li><strong>Ứng dụng ngay lập tức: liêm chính học thuật</strong> — quy định của FPTU về đạo văn và chia sẻ bài tập chính là cái này. Bạn nhận một tấm bằng mà giá trị của nó phụ thuộc vào việc bài của mọi người khác là thật; đổi lại bạn đồng ý không nộp thứ không phải của mình. Nếu đa số phá kèo thì tấm bằng thành vô giá trị — đó là lập luận khế ước xã hội cho việc gian lận làm hại chính kẻ gian lận. Bạn học đúng lập luận này ở SSL101c cùng kỳ; slide này là cái gốc triết học của nó.</li>
<li><strong>Điểm yếu nên gọi tên</strong> — đa số có thể đồng ý với một điều bất công. "Phần lớn người ta tán thành" là bằng chứng, không phải chứng minh. Vì thế ba nguyên tắc mới phải dùng cùng nhau: một ý kiến đa số mà trượt phép thử luật đạo đức (slide 17) thì phải làm bạn lo, chứ không phải làm bạn yên tâm.</li>
<li><strong>Áp vào phần hacker sắp tới</strong> — lý do kiểm thử xâm nhập không được phép vẫn là tội phạm kể cả khi người thử có ý tốt chính là một khế ước xã hội: xã hội đã thống nhất rằng sự cho phép phải được trao <em>trước</em> và <em>bằng văn bản</em>, đúng vì ý tốt là thứ không kiểm chứng được từ bên ngoài. Slide 26 quay lại chỗ này.</li>
</ul>
<p class="pitfall">⚠️ Đừng rút gọn nguyên tắc thành "đa số làm gì thì cái đó ổn". Slide nói đa số <em>đồng ý với hành vi</em>, chứ không nói đa số <em>thực hiện</em> nó. Nửa lớp chép bài không phải bằng chứng rằng cả lớp tán thành việc chép bài.</p>`],

      [20, '4 - Privacy',
        `<p class="y-chinh">🎯 Section divider. Ethics asked what is <em>right</em>; privacy asks a narrower and more practical question: <strong>who may hold data about you, and what may they do with it?</strong></p>
<ul>
<li><strong>The working definition for this course</strong> — privacy is the right of an individual to control which personal information is collected, who holds it, and what it is used for. Note it is about <em>control</em>, not about secrecy: giving your address to a delivery company is not a loss of privacy; that company selling it is.</li>
<li><strong>The three slides ahead</strong> — slide 21: why the collection is risky and the six codes of ethics for collecting data; slide 22: seven reasons data privacy matters to an organisation; slide 23: the NDA, the legal instrument that binds a party to keep information confidential.</li>
<li><strong>Privacy and confidentiality are not the same word</strong> — and the exam can exploit it. <em>Confidentiality</em> (slide 7) is a property of a system: unauthorised parties cannot read the data. <em>Privacy</em> is a right of a person about their own data. You can have perfect confidentiality and still destroy privacy — a company that encrypts your location history flawlessly and then sells it has a confidential system and no respect for privacy.</li>
<li><strong>Where the law now lives, in Vietnam</strong> — the Law on Cybersecurity (Luật An ninh mạng số 24/2018/QH14, in force 01/01/2019) and Decree 13/2023/NĐ-CP on the protection of personal data (in force 01/07/2023), which introduced consent requirements, data-subject rights and an impact-assessment dossier. A dedicated Law on Personal Data Protection has since been passed with effect from 01/01/2026; check the version currently in force before quoting it.</li>
<li><strong>And abroad</strong> — the EU's GDPR (in force 25/05/2018) is the reference text worldwide, with fines up to 4% of global annual turnover or €20 million, whichever is higher. It applies to any organisation processing data of people in the EU, including a Vietnamese company with EU users.</li>
</ul>
<p class="meo">💡 The sentence that keeps the two apart: <strong>confidentiality = "nobody else can read it"; privacy = "I decide who gets it in the first place".</strong></p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Đạo đức hỏi cái gì là <em>đúng</em>; quyền riêng tư hỏi một câu hẹp hơn và thực tế hơn: <strong>ai được phép giữ dữ liệu về bạn, và được làm gì với nó?</strong></p>
<ul>
<li><strong>Định nghĩa dùng cho môn này</strong> — quyền riêng tư là quyền của một cá nhân được kiểm soát thông tin cá nhân nào bị thu thập, ai giữ nó, và nó được dùng vào việc gì. Để ý: nó nói về <em>quyền kiểm soát</em>, không phải về sự bí mật. Đưa địa chỉ cho hãng giao hàng không phải là mất riêng tư; hãng ấy đem bán nó đi thì mới là.</li>
<li><strong>Ba slide sắp tới</strong> — slide 21: vì sao việc thu thập tiềm ẩn rủi ro và sáu quy tắc đạo đức khi thu thập dữ liệu; slide 22: bảy lý do quyền riêng tư dữ liệu quan trọng với một tổ chức; slide 23: NDA, công cụ pháp lý ràng buộc một bên phải giữ bí mật thông tin.</li>
<li><strong>Riêng tư và bí mật KHÔNG phải một chữ</strong> — và đề thi khai thác được chỗ đó. <em>Tính bí mật</em> (slide 7) là một tính chất của hệ thống: bên không phận sự không đọc được dữ liệu. <em>Quyền riêng tư</em> là một quyền của con người đối với dữ liệu của chính họ. Có thể có tính bí mật hoàn hảo mà vẫn phá nát quyền riêng tư — một công ty mã hoá lịch sử vị trí của bạn không chê vào đâu được rồi đem bán nó là công ty có hệ thống bí mật và không có chút tôn trọng riêng tư nào.</li>
<li><strong>Luật hiện nằm ở đâu, tại Việt Nam</strong> — Luật An ninh mạng (số 24/2018/QH14, hiệu lực 01/01/2019) và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân (hiệu lực 01/07/2023), văn bản đưa ra yêu cầu về sự đồng ý, các quyền của chủ thể dữ liệu và hồ sơ đánh giá tác động. Sau đó một Luật Bảo vệ dữ liệu cá nhân riêng đã được thông qua, hiệu lực từ 01/01/2026; hãy kiểm lại văn bản đang có hiệu lực trước khi trích dẫn.</li>
<li><strong>Và ở nước ngoài</strong> — GDPR của EU (hiệu lực 25/05/2018) là văn bản tham chiếu toàn cầu, mức phạt tới 4% doanh thu toàn cầu hằng năm hoặc 20 triệu euro, lấy mức cao hơn. Nó áp cho mọi tổ chức xử lý dữ liệu của người ở EU, kể cả một công ty Việt Nam có người dùng EU.</li>
</ul>
<p class="meo">💡 Câu giữ hai khái niệm tách nhau: <strong>bí mật = "không ai khác đọc được nó"; riêng tư = "tôi là người quyết định ngay từ đầu ai được cầm nó".</strong></p>`],

      [21, '1. Introduction (privacy)',
        `<p class="y-chinh">🎯 The core tension in one sentence: collecting personal data is often <em>necessary</em>, and it always <em>poses risks</em>. The slide's answer is not "collect nothing" but six codes of ethics that constrain how you collect.</p>
<ul>
<li><strong>The six codes, verbatim from the slide</strong> — (1) collect only data that are needed; (2) be sure the collected data are accurate; (3) allow individuals to know what data have been collected; (4) allow individuals to correct the collected data if necessary; (5) be sure collected data are used only for the original purpose; (6) use encryption techniques.</li>
<li><strong>They are not a random list — they are the skeleton of modern data-protection law</strong>. (1) is <em>data minimisation</em>; (2) is <em>accuracy</em>; (3) is the <em>right of access</em>; (4) is the <em>right to rectification</em>; (5) is <em>purpose limitation</em>; (6) is <em>security of processing</em>. Those six terms are, almost word for word, Article 5 of GDPR and the corresponding obligations in Decree 13/2023/NĐ-CP.</li>
<li><strong>Rule 1 is the one engineers break first and it is the strongest</strong> — every field you do not store cannot leak, cannot be subpoenaed, cannot be sold by a future owner of the company, and needs no encryption. "Do we need the date of birth, or only 'is over 18'?" is a real design question with a real security consequence.</li>
<li><strong>Rule 5 is the one companies break most often</strong> — data given for delivery being used for advertising is a purpose-limitation breach, and it is the mechanism behind most privacy scandals. It is also the clearest link back to slide 19: the user agreed to <em>one</em> contract, not to every later use somebody thought of.</li>
<li><strong>Rule 6 is where sections 12.2 and 12.4 meet</strong> — the codes are ethics, but the last one is pure engineering: it points straight back at the ciphers of slides 11–14. Ethics says "protect it"; cryptography is <em>how</em>.</li>
<li><strong>"A citizen's right to privacy is mentioned in the nation's constitution"</strong> — true in Vietnam: the 2013 Constitution, Article 21, states that everyone has the inviolable right to privacy of personal life, personal secrets and family secrets, and to the safety and confidentiality of correspondence, telephone and telegraph communications.</li>
</ul>
<p class="meo">💡 Remember the six as three pairs: <strong>what you take (1 minimal, 2 accurate) · what the person may do (3 see it, 4 fix it) · what you may do (5 original purpose only, 6 encrypt it).</strong></p>`,
        `<p class="y-chinh">🎯 Căng thẳng cốt lõi gói trong một câu: thu thập dữ liệu cá nhân thường là <em>cần thiết</em>, và luôn luôn <em>kèm rủi ro</em>. Câu trả lời của slide không phải "đừng thu thập gì" mà là sáu quy tắc đạo đức ràng buộc cách thu thập.</p>
<ul>
<li><strong>Sáu quy tắc, nguyên văn theo slide</strong> — (1) chỉ thu thập dữ liệu thật sự cần; (2) bảo đảm dữ liệu thu thập là chính xác; (3) cho cá nhân biết dữ liệu nào đã bị thu thập; (4) cho cá nhân sửa lại dữ liệu khi cần; (5) bảo đảm dữ liệu chỉ dùng cho đúng mục đích ban đầu; (6) dùng các kỹ thuật mã hoá.</li>
<li><strong>Đó không phải một danh sách ngẫu nhiên — nó là bộ xương của luật bảo vệ dữ liệu hiện đại</strong>. (1) là <em>tối thiểu hoá dữ liệu</em>; (2) là <em>tính chính xác</em>; (3) là <em>quyền được biết/truy cập</em>; (4) là <em>quyền chỉnh sửa</em>; (5) là <em>giới hạn mục đích</em>; (6) là <em>an toàn khi xử lý</em>. Sáu thuật ngữ ấy gần như nguyên văn Điều 5 của GDPR và các nghĩa vụ tương ứng trong Nghị định 13/2023/NĐ-CP.</li>
<li><strong>Quy tắc 1 là thứ kỹ sư phá đầu tiên và cũng là thứ mạnh nhất</strong> — mỗi trường dữ liệu bạn KHÔNG lưu thì không rò được, không bị trưng thu được, không bị chủ mới của công ty đem bán được, và cũng chẳng cần mã hoá. "Ta cần ngày sinh, hay chỉ cần biết 'có trên 18 tuổi không'?" là một câu hỏi thiết kế thật với hệ quả an toàn thật.</li>
<li><strong>Quy tắc 5 là thứ doanh nghiệp phá nhiều nhất</strong> — dữ liệu đưa ra để giao hàng bị dùng để quảng cáo là vi phạm giới hạn mục đích, và đó là cơ chế đứng sau hầu hết các vụ bê bối riêng tư. Nó cũng là mối nối rõ nhất về slide 19: người dùng đã đồng ý với <em>một</em> giao kèo, không phải với mọi cách dùng mà về sau ai đó nghĩ ra.</li>
<li><strong>Quy tắc 6 là chỗ mục 12.2 và 12.4 gặp nhau</strong> — sáu quy tắc là đạo đức, nhưng cái cuối thuần kỹ thuật: nó chỉ thẳng về các hệ mật ở slide 11–14. Đạo đức nói "hãy bảo vệ nó"; mật mã học là <em>bảo vệ bằng cách nào</em>.</li>
<li><strong>"Quyền riêng tư của công dân được ghi trong hiến pháp"</strong> — đúng với Việt Nam: Hiến pháp 2013, Điều 21, quy định mọi người có quyền bất khả xâm phạm về đời sống riêng tư, bí mật cá nhân và bí mật gia đình, và có quyền bí mật thư tín, điện thoại, điện tín.</li>
</ul>
<p class="meo">💡 Nhớ sáu quy tắc theo ba cặp: <strong>bạn lấy cái gì (1 tối thiểu, 2 chính xác) · người ta được làm gì (3 xem được, 4 sửa được) · bạn được làm gì (5 chỉ đúng mục đích ban đầu, 6 mã hoá nó).</strong></p>`],

      [22, '2. Why Data Privacy is important?',
        `<p class="y-chinh">🎯 A slide made of one picture, and the picture carries seven bullets. They answer the question from the <em>organisation's</em> side: why should a business spend money on privacy?</p>
<ul>
<li><strong>"Trust is the key"</strong> — the one that subsumes the rest. Trust takes years to build and one breach notification to destroy; and unlike a server, it cannot be restored from backup.</li>
<li><strong>"It is the responsibility of business to protect data"</strong> — the ethical argument of slides 16–19, now addressed to a company rather than a person. The data was handed over for a purpose; holding it creates a duty.</li>
<li><strong>"Investing in privacy converts into higher ROI"</strong> — the commercial argument, and the one a manager listens to. Privacy work is cheaper before the incident than after: an access control designed in advance costs days; a breach costs notification, forensics, regulatory fines, churn and years of reputational drag.</li>
<li><strong>"Data breaches on rise"</strong> — the empirical argument. Reported average cost per breach worldwide has sat in the USD 4–5 million range through the mid-2020s, with the largest contributions from lost business and detection, not ransom payments.</li>
<li><strong>"Involvement of Government"</strong> — the regulatory argument: GDPR, Vietnam's Decree 13/2023/NĐ-CP and the Law on Cybersecurity have turned privacy from a preference into a legal obligation with penalties attached.</li>
<li><strong>"Third-Party Apps"</strong> — the supply-chain argument, and the one students underestimate. Your data does not sit in one company: every analytics SDK, payment gateway and CDN in the stack is another party with access. A breach at any of them is your breach, and you remain the one answerable to the user.</li>
<li><strong>"Right to Privacy"</strong> — the constitutional argument, which closes the loop back to Article 21 of Vietnam's 2013 Constitution.</li>
</ul>
<p class="pitfall">⚠️ Exam note: this slide has no body text of its own, only an embedded image. If you are revising from the extracted text file, you will see nothing but the title — and you will miss seven bullets. Any slide of this chapter that looks empty in your notes is a slide you must open the picture for.</p>
<p class="meo">💡 Grouping to remember them: <strong>two arguments about the customer (trust, right), two about money (ROI, breach cost), two about outsiders (government, third parties), one about duty (responsibility).</strong></p>`,
        `<p class="y-chinh">🎯 Một slide chỉ gồm một bức ảnh, và bức ảnh mang bảy gạch đầu dòng. Chúng trả lời câu hỏi từ phía <em>tổ chức</em>: vì sao doanh nghiệp phải bỏ tiền cho quyền riêng tư?</p>
<ul>
<li><strong>"Trust is the key" — niềm tin là chìa khoá</strong> — cái bao trùm những cái còn lại. Niềm tin xây mất nhiều năm và chỉ cần một thông báo lộ lọt là tan; và khác với máy chủ, nó không khôi phục được từ bản sao lưu.</li>
<li><strong>"It is the responsibility of business to protect data"</strong> — lập luận đạo đức của slide 16–19, giờ nói với một công ty thay vì một con người. Dữ liệu được trao cho một mục đích; việc giữ nó tạo ra một nghĩa vụ.</li>
<li><strong>"Investing in privacy converts into higher ROI"</strong> — lập luận thương mại, và là cái mà người quản lý chịu nghe. Làm việc về quyền riêng tư rẻ hơn khi làm TRƯỚC sự cố: một cơ chế kiểm soát truy cập thiết kế từ đầu tốn vài ngày; một vụ lộ lọt tốn tiền thông báo, điều tra số, phạt của cơ quan quản lý, mất khách và nhiều năm tổn hại danh tiếng.</li>
<li><strong>"Data breaches on rise"</strong> — lập luận thực nghiệm. Chi phí trung bình mỗi vụ lộ lọt được báo cáo trên toàn cầu nằm quanh mức 4–5 triệu đô la suốt giữa thập niên 2020, mà phần đóng góp lớn nhất là mất khách hàng và chi phí phát hiện, chứ không phải tiền chuộc.</li>
<li><strong>"Involvement of Government"</strong> — lập luận pháp lý: GDPR, Nghị định 13/2023/NĐ-CP và Luật An ninh mạng của Việt Nam đã biến quyền riêng tư từ một sở thích thành nghĩa vụ pháp lý có chế tài kèm theo.</li>
<li><strong>"Third-Party Apps"</strong> — lập luận chuỗi cung ứng, và là cái sinh viên hay coi nhẹ. Dữ liệu của bạn không nằm trong một công ty: mỗi SDK phân tích, mỗi cổng thanh toán, mỗi CDN trong hệ thống đều là một bên nữa có quyền truy cập. Một vụ rò ở bất kỳ bên nào cũng là vụ rò của bạn, và bạn vẫn là người phải trả lời người dùng.</li>
<li><strong>"Right to Privacy"</strong> — lập luận hiến định, khép vòng trở lại Điều 21 Hiến pháp 2013 của Việt Nam.</li>
</ul>
<p class="pitfall">⚠️ Lưu ý khi ôn: slide này không có chữ thân bài nào của riêng nó, chỉ có một ảnh nhúng. Nếu bạn ôn từ file chữ trích ra thì sẽ chỉ thấy mỗi cái tiêu đề — và bỏ mất bảy gạch đầu dòng. Slide nào của chương này mà trong ghi chép của bạn trông trống rỗng thì đó là slide bạn BẮT BUỘC phải mở ảnh ra xem.</p>
<p class="meo">💡 Cách gom để nhớ: <strong>hai lập luận về khách hàng (niềm tin, quyền), hai về tiền (ROI, chi phí sự cố), hai về bên ngoài (nhà nước, bên thứ ba), một về bổn phận (trách nhiệm).</strong></p>`],

      [23, '4. Non-Disclosure Agreement',
        `<p class="y-chinh">🎯 From principle to paperwork. An <strong>NDA is a legally binding contract between parties that requires them to keep certain information confidential</strong> — the mechanism that turns "please do not tell anyone" into something a court will enforce.</p>
<ul>
<li><strong>Its other names, from the slide</strong> — confidentiality agreement, non-use agreement, trade secret agreement. Same instrument, different emphasis; "non-use" stresses that you may not <em>use</em> the information either, not merely that you may not repeat it.</li>
<li><strong>Read Figure 12.7 — it is a real clause 1, "CONFIDENTIAL INFORMATION"</strong>, and it is worth noticing how wide it is drawn: documents, records, data "whether verbal, electronic or written", drawings, models, schedules, product plans, marketing plans, technical procedures, manufacturing processes, analyses, software, prototypes, formulas, know-how, experimental results — and then it extends to anything the recipient <em>derives</em> from that information. The breadth is deliberate: a narrow definition is a loophole.</li>
<li><strong>Note one phrase in the figure that students miss</strong> — the information is covered "regardless of whether such Confidential Information has been expressly designated as confidential". In other words, forgetting to stamp a document does not make it fair game.</li>
<li><strong>Why an NDA exists at all — the nature of a trade secret</strong> — a patent protects you <em>because</em> it is published; a trade secret is protected only for as long as it stays secret. Once out, it is gone forever and no law can put it back. The NDA is the only fence around it, which is why companies ask for one before an interview, a demo, or an internship.</li>
<li><strong>What it means for you concretely</strong> — during an internship or your Capstone with a partner company, code, data and even the fact that a project exists may be covered. Putting a screenshot of an internship project on a public GitHub repository is one of the commonest, and most damaging, student NDA breaches.</li>
<li><strong>The limits an NDA does not have</strong> — it cannot cover information that was already public, that you already knew, or that you developed independently; and it cannot legally gag you from reporting a crime. A well-drafted NDA lists those exclusions itself.</li>
</ul>
<p class="pitfall">⚠️ Slide numbering: this slide is labelled "4." although slide 21 was "1." and slide 22 was "2." — item 3 of section 12.4 is missing from the deck. Nothing is wrong with the content; just do not waste exam time hunting for a slide that is not there.</p>`,
        `<p class="y-chinh">🎯 Từ nguyên tắc chuyển sang giấy tờ. <strong>NDA là một hợp đồng có hiệu lực pháp lý giữa các bên, buộc họ phải giữ bí mật một số thông tin nhất định</strong> — cơ chế biến câu "xin đừng kể với ai" thành thứ mà toà án sẽ cưỡng chế.</p>
<ul>
<li><strong>Các tên gọi khác, theo slide</strong> — thoả thuận bảo mật, thoả thuận không sử dụng, thoả thuận bí mật kinh doanh. Cùng một công cụ, khác chỗ nhấn; chữ "không sử dụng" nhấn rằng bạn cũng không được <em>DÙNG</em> thông tin ấy, chứ không chỉ là không được kể lại.</li>
<li><strong>Đọc Hình 12.7 — đó là một điều khoản 1 thật, "CONFIDENTIAL INFORMATION"</strong>, và đáng để ý là nó được viết rộng tới mức nào: tài liệu, hồ sơ, dữ liệu "dù bằng lời, điện tử hay văn bản", bản vẽ, mô hình, lịch trình, kế hoạch sản phẩm, kế hoạch tiếp thị, quy trình kỹ thuật, quy trình sản xuất, phân tích, phần mềm, nguyên mẫu, công thức, bí quyết, kết quả thí nghiệm — rồi còn mở rộng sang mọi thứ mà bên nhận <em>tạo ra từ</em> thông tin ấy. Sự rộng ấy là cố ý: một định nghĩa hẹp chính là một kẽ hở.</li>
<li><strong>Một cụm trong hình mà sinh viên hay bỏ sót</strong> — thông tin vẫn được bảo vệ "bất kể thông tin đó có được ghi rõ là mật hay không". Nói cách khác, quên đóng dấu MẬT lên tài liệu không biến nó thành thứ tự do khai thác.</li>
<li><strong>Vì sao NDA tồn tại — bản chất của bí mật kinh doanh</strong> — bằng sáng chế bảo vệ bạn <em>chính nhờ</em> việc được công bố; còn bí mật kinh doanh chỉ được bảo vệ chừng nào nó còn bí mật. Đã lộ ra là mất vĩnh viễn, không luật nào nhét lại được. NDA là hàng rào duy nhất quanh nó, vì thế các công ty đòi ký trước cả một buổi phỏng vấn, một buổi demo hay một kỳ thực tập.</li>
<li><strong>Nó có nghĩa gì với bạn, rất cụ thể</strong> — trong kỳ thực tập hoặc đồ án Capstone với công ty đối tác, mã nguồn, dữ liệu và thậm chí cả việc dự án ấy tồn tại đều có thể thuộc diện bảo mật. Đưa ảnh chụp màn hình dự án thực tập lên một kho GitHub công khai là một trong những vi phạm NDA phổ biến nhất — và gây hại nhất — của sinh viên.</li>
<li><strong>Những giới hạn mà NDA KHÔNG có</strong> — nó không bao trùm thông tin vốn đã công khai, thông tin bạn đã biết từ trước, hay thứ bạn tự phát triển độc lập; và nó không có quyền bịt miệng bạn trong việc tố giác tội phạm. Một bản NDA soạn tử tế tự liệt kê những ngoại lệ ấy.</li>
</ul>
<p class="pitfall">⚠️ Về số thứ tự slide: slide này đánh "4." trong khi slide 21 là "1." và slide 22 là "2." — mục 3 của phần 12.4 bị thiếu khỏi bộ slide. Nội dung không có gì sai; chỉ là đừng mất thời gian đi tìm một slide không tồn tại.</p>`],

      [24, '5 - Hackers',
        `<p class="y-chinh">🎯 The final section, and the one where all the earlier material meets a person. Everything from here should be read as <em>defence and understanding</em> — knowing how attackers are classified and what motivates them, not a set of instructions.</p>
<ul>
<li><strong>The three slides ahead</strong> — slide 25: how the meaning of the word changed; slide 26: the six "hats"; slide 27: the three commonest motives (financial gain, corporate espionage, state sponsorship).</li>
<li><strong>Say the boundary out loud before you start</strong> — in Vietnam, unauthorised access to a computer network is a criminal offence under Article 289 of the 2015 Penal Code (as amended in 2017), with penalties running to twelve years for aggravated cases; spreading harmful programs (Article 286) and illegally putting information on a network (Article 288) are separate offences. There is no "I only looked" defence and no "I meant well" defence.</li>
<li><strong>The one thing that makes the same action legal</strong> — a written authorisation, agreed <em>in advance</em>, that names the systems, the time window and the limits. That document is what separates a penetration tester from a defendant; the technique on the keyboard can be identical.</li>
<li><strong>Why the course teaches this at all</strong> — you cannot defend a system whose attackers you cannot describe. Every defence in slides 9–14 exists because of somebody in this section, and a security engineer who has never thought like an attacker builds defences against imagined threats.</li>
<li><strong>Connect it back to section 12.3</strong> — the hats of slide 26 are, in effect, the three ethical principles applied to one profession: white hat = act within the rules; grey hat = judge by consequences and go around the rules; black hat = reject the social contract entirely.</li>
</ul>
<p class="meo">💡 One line to carry through the section: <strong>the technique does not decide legality — the authorisation does.</strong> Same scan, same tool: with a signed scope it is work, without one it is a crime.</p>`,
        `<p class="y-chinh">🎯 Mục cuối cùng, và là chỗ mọi thứ phía trước gặp một con người. Từ đây trở đi hãy đọc theo tinh thần <em>phòng thủ và hiểu biết</em> — biết kẻ tấn công được phân loại ra sao và động cơ của họ là gì, chứ không phải một bộ hướng dẫn làm theo.</p>
<ul>
<li><strong>Ba slide sắp tới</strong> — slide 25: chữ "hacker" đã đổi nghĩa thế nào; slide 26: sáu chiếc "mũ"; slide 27: ba động cơ phổ biến nhất (kiếm tiền, gián điệp doanh nghiệp, nhà nước bảo trợ).</li>
<li><strong>Hãy nói rõ ranh giới trước khi bắt đầu</strong> — tại Việt Nam, truy cập trái phép vào mạng máy tính là tội hình sự theo Điều 289 Bộ luật Hình sự 2015 (sửa đổi 2017), khung hình phạt lên tới mười hai năm với trường hợp tăng nặng; phát tán chương trình tin học gây hại (Điều 286) và đưa trái phép thông tin lên mạng (Điều 288) là các tội riêng. Không có lý do bào chữa "tôi chỉ xem thôi", cũng không có lý do "tôi có ý tốt".</li>
<li><strong>Đúng một thứ khiến cùng hành vi ấy trở nên hợp pháp</strong> — một văn bản uỷ quyền, thoả thuận <em>TRƯỚC</em>, ghi rõ hệ thống nào, khoảng thời gian nào và giới hạn tới đâu. Chính tờ giấy ấy phân biệt một kiểm thử viên xâm nhập với một bị cáo; kỹ thuật gõ trên bàn phím có thể y hệt nhau.</li>
<li><strong>Vì sao môn học dạy chuyện này</strong> — bạn không thể bảo vệ một hệ thống mà bạn không mô tả nổi kẻ tấn công nó. Mọi cách phòng vệ ở slide 9–14 tồn tại là vì một ai đó trong mục này, và một kỹ sư an toàn chưa bao giờ nghĩ như kẻ tấn công thì sẽ dựng hàng rào chống lại những mối đe doạ do mình tưởng tượng ra.</li>
<li><strong>Nối ngược về mục 12.3</strong> — sáu chiếc mũ ở slide 26 thực chất là ba nguyên tắc đạo đức áp vào một nghề: mũ trắng = hành động trong luật lệ; mũ xám = xét theo hệ quả rồi đi vòng qua luật lệ; mũ đen = chối bỏ hoàn toàn khế ước xã hội.</li>
</ul>
<p class="meo">💡 Một dòng mang theo suốt mục này: <strong>kỹ thuật không quyết định tính hợp pháp — sự uỷ quyền mới quyết định.</strong> Cùng một lượt quét, cùng một công cụ: có phạm vi đã ký thì là công việc, không có thì là tội phạm.</p>`],

      [25, '1. Introduction (hackers)',
        `<p class="y-chinh">🎯 The word changed meaning, and the slide says so plainly: <em>previously</em> a hacker was a person with a lot of knowledge who could <strong>improve</strong> a system; <em>today</em> a hacker is someone who gains unauthorised access to someone else's computer.</p>
<ul>
<li><strong>Where the older meaning comes from</strong> — the MIT Tech Model Railroad Club and the MIT AI Lab in the late 1950s and 1960s, where a "hack" was an ingenious solution and a "hacker" was someone who understood a system deeply enough to make it do more than it was designed to. That sense survives today in "hackathon" and in job titles like "growth hacker".</li>
<li><strong>The word the security profession prefers for the modern sense</strong> — <em>cracker</em>, coined in 1985 precisely because practitioners objected to losing the older word. The distinction never won in the press, but knowing it is a mark of someone who knows the field.</li>
<li><strong>Be careful with the slide's second definition</strong> — "in order to copy secret information" is too narrow. It captures theft of confidentiality but leaves out the other two goals of slide 7 entirely: ransomware encrypts data to destroy <em>availability</em>, and defacement or database tampering attacks <em>integrity</em>. A complete definition is: unauthorised access to a system, whatever the attacker then does with it.</li>
<li><strong>Read Figure 12.8 — "The Six Types of Hackers"</strong> — a left-to-right arrow with White Hat, Grey Hat, Black Hat, Blue Hat, Green Hat, Red Hat. Note the picture is a <em>spectrum</em>, which is slightly misleading: the six are not points on one line from good to evil. The first three are about <em>authorisation</em>; the last three are about <em>role and experience</em>. Slide 26 defines each.</li>
<li><strong>The hat metaphor itself</strong> — it comes from mid-20th-century Western films, where the hero wore a white hat and the villain a black one. It is a convention, not a technical taxonomy, and different sources assign the minor colours differently. The three you can rely on in any exam or interview are white, grey and black.</li>
</ul>
<p class="pitfall">⚠️ If a question asks "define a hacker", quote the slide's modern definition <em>and</em> note the historical one. If a question asks for the damage they do, do not stop at copying information — name all three goals: stolen data (confidentiality), altered data (integrity), destroyed or held-to-ransom systems (availability).</p>`,
        `<p class="y-chinh">🎯 Chữ này đã đổi nghĩa, và slide nói thẳng: <em>trước kia</em> hacker là người có rất nhiều hiểu biết, có thể <strong>cải tiến</strong> một hệ thống; <em>ngày nay</em> hacker là kẻ giành quyền truy cập trái phép vào máy tính của người khác.</p>
<ul>
<li><strong>Nghĩa cũ đến từ đâu</strong> — Câu lạc bộ Mô hình đường sắt MIT và Phòng thí nghiệm Trí tuệ nhân tạo MIT cuối thập niên 1950–1960, nơi một "hack" là một lời giải tài tình và "hacker" là người hiểu hệ thống sâu tới mức bắt nó làm được nhiều hơn thiết kế ban đầu. Nghĩa ấy còn sống tới hôm nay trong chữ "hackathon" và trong các chức danh kiểu "growth hacker".</li>
<li><strong>Chữ mà giới an toàn thông tin thích dùng cho nghĩa hiện đại</strong> — <em>cracker</em>, được đặt ra năm 1985 đúng vì những người trong nghề phản đối việc mất đi chữ cũ. Phân biệt ấy chưa bao giờ thắng trên báo chí, nhưng biết nó là dấu hiệu của người rành nghề.</li>
<li><strong>Cẩn thận với định nghĩa thứ hai của slide</strong> — cụm "để sao chép thông tin bí mật" là quá hẹp. Nó bắt được việc đánh cắp tính bí mật nhưng bỏ sót hoàn toàn hai mục tiêu còn lại ở slide 7: mã độc tống tiền mã hoá dữ liệu để phá <em>tính sẵn sàng</em>, còn bôi xấu trang web hay sửa cơ sở dữ liệu là tấn công <em>tính toàn vẹn</em>. Một định nghĩa đầy đủ là: truy cập trái phép vào một hệ thống, bất kể sau đó kẻ tấn công làm gì với nó.</li>
<li><strong>Đọc Hình 12.8 — "The Six Types of Hackers"</strong> — một mũi tên trái sang phải với White Hat, Grey Hat, Black Hat, Blue Hat, Green Hat, Red Hat. Để ý bức hình vẽ thành một <em>dải liên tục</em>, và điều đó hơi gây hiểu lầm: sáu loại không phải sáu điểm trên một đường từ thiện tới ác. Ba loại đầu nói về <em>sự cho phép</em>; ba loại sau nói về <em>vai trò và kinh nghiệm</em>. Slide 26 định nghĩa từng loại.</li>
<li><strong>Bản thân phép ẩn dụ cái mũ</strong> — nó đến từ phim cao bồi Mỹ giữa thế kỷ 20, nơi người hùng đội mũ trắng còn kẻ xấu đội mũ đen. Đó là một quy ước, không phải một bảng phân loại kỹ thuật, và các nguồn khác nhau gán các màu phụ khác nhau. Ba màu bạn tin được trong mọi bài thi hay buổi phỏng vấn là trắng, xám và đen.</li>
</ul>
<p class="pitfall">⚠️ Nếu đề hỏi "định nghĩa hacker", hãy dẫn định nghĩa hiện đại của slide <em>và</em> nhắc định nghĩa lịch sử. Nếu đề hỏi thiệt hại họ gây ra, đừng dừng ở việc sao chép thông tin — hãy gọi tên cả ba mục tiêu: dữ liệu bị đánh cắp (bí mật), dữ liệu bị sửa (toàn vẹn), hệ thống bị phá hoặc bị bắt làm con tin (sẵn sàng).</p>`],

      [26, '2. Types of Hackers',
        `<p class="y-chinh">🎯 Six definitions to learn, but only after you have grasped the one thing that actually separates them: <strong>was there authorisation, in writing, in advance?</strong></p>
<table>
<tr><td><strong>Hat</strong></td><td><strong>The slide's definition</strong></td><td><strong>Authorised?</strong></td><td><strong>What it means in practice</strong></td></tr>
<tr><td>Black</td><td>"the bad guys" — break into networks with purely negative motives such as monetary gain or reputation</td><td>No</td><td>Criminal. Ransomware, data theft, selling access</td></tr>
<tr><td>White</td><td>"the good guys" — ethical hackers who find the loopholes in order to solve them</td><td><strong>Yes, in writing</strong></td><td>Penetration tester, red teamer, bug-bounty participant working inside a published scope</td></tr>
<tr><td>Grey</td><td>hackers who exploit systems in order to make public datasets that would benefit everyone</td><td>No — but not for personal gain</td><td>Finds a hole without permission, then discloses it. Still illegal in Vietnam under Article 289</td></tr>
<tr><td>Blue</td><td>"the amateur" — techniques deployed out of ill motives such as revenge</td><td>No</td><td>Low skill, personal grudge. (Some sources use "blue hat" for an outside tester invited before a product launch — the slide does not)</td></tr>
<tr><td>Red</td><td>aims to find black hat hackers, intercept and destroy their schemes</td><td>No</td><td>Vigilante. Attacking an attacker is still an attack, and still a crime</td></tr>
<tr><td>Green</td><td>individuals who simply want to observe and learn about hacking</td><td>n/a</td><td>Beginner. Legal as long as they practise on systems they own or on deliberately vulnerable labs</td></tr>
</table>
<ul>
<li><strong>The three that matter — white, grey, black</strong> — and the boundary is not skill, intent or outcome. It is a document. A white hat with a signed scope and a black hat may run the identical scan against the identical server; one is doing a job and the other is committing a crime.</li>
<li><strong>What the authorisation must actually contain</strong> — which systems and IP ranges, which time window, which techniques are excluded (usually denial-of-service and social engineering against staff), what happens to any data found, and who to call if something breaks. A verbal "sure, have a look" protects nobody.</li>
<li><strong>Where the slide's grey-hat definition is off</strong> — "exploit systems only to make public vast datasets of information that would be of benefit to everyone" describes <em>hacktivism</em>. The standard definition of a grey hat is narrower: someone who probes without permission but without malicious intent, and who typically reports the flaw to the owner afterwards — sometimes asking for a fee, which is where it slides towards extortion.</li>
<li><strong>Why "I meant well" is not a defence</strong> — intent cannot be verified from outside. From the defender's logs, a grey hat and a black hat are indistinguishable at the moment of the intrusion, and the law therefore judges the act, not the story told afterwards.</li>
<li><strong>The legal route if you want to do this professionally</strong> — bug bounty programmes (HackerOne, Bugcrowd, and the programmes many Vietnamese banks and platforms now run) publish a scope and grant permission in advance; deliberately vulnerable practice labs (DVWA, OWASP Juice Shop, TryHackMe, Hack The Box) are systems you are invited to attack; and a home lab you own is always yours to break.</li>
</ul>
<p class="pitfall">⚠️ The exam question is almost always "distinguish white, grey and black hat". Answer with authorisation and intent, in that order, and give one sentence each. Do not write that a white hat is "a hacker who does good things" — that is the grey hat's own description of itself.</p>`,
        `<p class="y-chinh">🎯 Sáu định nghĩa phải học, nhưng chỉ sau khi bạn nắm được đúng một thứ thật sự phân biệt chúng: <strong>có sự cho phép hay không, bằng văn bản, và từ TRƯỚC?</strong></p>
<table>
<tr><td><strong>Mũ</strong></td><td><strong>Định nghĩa của slide</strong></td><td><strong>Có uỷ quyền?</strong></td><td><strong>Nghĩa thực tế</strong></td></tr>
<tr><td>Đen</td><td>"kẻ xấu" — đột nhập mạng với động cơ hoàn toàn tiêu cực như tiền bạc hoặc danh tiếng</td><td>Không</td><td>Tội phạm. Mã độc tống tiền, trộm dữ liệu, bán quyền truy cập</td></tr>
<tr><td>Trắng</td><td>"người tốt" — hacker có đạo đức, tìm ra lỗ hổng để vá chúng</td><td><strong>Có, bằng văn bản</strong></td><td>Kiểm thử viên xâm nhập, đội đỏ, người tham gia bug bounty trong phạm vi đã công bố</td></tr>
<tr><td>Xám</td><td>khai thác hệ thống để công bố những tập dữ liệu có lợi cho mọi người</td><td>Không — nhưng không vì lợi riêng</td><td>Tìm ra lỗ hổng mà không xin phép, rồi công bố. Ở Việt Nam vẫn phạm Điều 289</td></tr>
<tr><td>Xanh dương</td><td>"kẻ nghiệp dư" — dùng kỹ thuật vì động cơ xấu như trả thù</td><td>Không</td><td>Kỹ năng thấp, thù cá nhân. (Vài nguồn dùng "blue hat" để chỉ người thử bên ngoài được mời trước khi ra mắt sản phẩm — slide này thì không)</td></tr>
<tr><td>Đỏ</td><td>mục tiêu là tìm ra hacker mũ đen, chặn và phá âm mưu của họ</td><td>Không</td><td>Tự xử. Tấn công một kẻ tấn công thì vẫn là tấn công, và vẫn là tội phạm</td></tr>
<tr><td>Xanh lá</td><td>những người chỉ muốn quan sát và học về thế giới hacking</td><td>không áp dụng</td><td>Người mới. Hợp pháp chừng nào họ luyện trên hệ thống của chính mình hoặc trên các phòng thí nghiệm cố ý để lỗ hổng</td></tr>
</table>
<ul>
<li><strong>Ba loại đáng kể — trắng, xám, đen</strong> — và ranh giới không phải kỹ năng, không phải ý định, cũng không phải kết quả. Nó là một tờ giấy. Một mũ trắng có phạm vi đã ký và một mũ đen có thể chạy đúng một lượt quét vào đúng một máy chủ; một bên đang làm việc, bên kia đang phạm tội.</li>
<li><strong>Văn bản uỷ quyền thật sự phải chứa gì</strong> — hệ thống nào và dải IP nào, khoảng thời gian nào, kỹ thuật nào bị loại trừ (thường là từ chối dịch vụ và tấn công phi kỹ thuật vào nhân viên), dữ liệu tìm thấy sẽ xử lý ra sao, và gọi ai khi có thứ gì hỏng. Một câu nói miệng "ừ, cứ xem thử đi" không bảo vệ được ai.</li>
<li><strong>Chỗ định nghĩa mũ xám của slide bị lệch</strong> — "khai thác hệ thống chỉ để công bố những tập dữ liệu khổng lồ có lợi cho mọi người" là mô tả <em>hacktivism</em> (tấn công vì mục đích chính trị - xã hội). Định nghĩa chuẩn của mũ xám hẹp hơn: người dò xét mà không xin phép nhưng không có ác ý, và thường báo lại lỗ hổng cho chủ hệ thống sau đó — đôi khi kèm đòi thù lao, và đó là chỗ nó trượt dần sang tống tiền.</li>
<li><strong>Vì sao "tôi có ý tốt" không phải lý do bào chữa</strong> — ý định là thứ không kiểm chứng được từ bên ngoài. Nhìn vào nhật ký của người phòng thủ, một mũ xám và một mũ đen là không phân biệt nổi tại thời điểm xâm nhập, nên luật phán xét hành vi chứ không phán xét câu chuyện kể lại sau đó.</li>
<li><strong>Con đường hợp pháp nếu bạn muốn làm nghề này</strong> — các chương trình bug bounty (HackerOne, Bugcrowd, và các chương trình mà nhiều ngân hàng, nền tảng Việt Nam nay đã có) công bố phạm vi và trao quyền từ trước; các phòng luyện cố ý để lỗ hổng (DVWA, OWASP Juice Shop, TryHackMe, Hack The Box) là những hệ thống mời bạn tấn công; và một phòng lab tại nhà do chính bạn dựng thì luôn là của bạn để phá.</li>
</ul>
<p class="pitfall">⚠️ Câu hỏi thi hầu như luôn là "phân biệt mũ trắng, mũ xám và mũ đen". Hãy trả lời bằng SỰ UỶ QUYỀN rồi tới Ý ĐỊNH, theo đúng thứ tự ấy, mỗi loại một câu. Đừng viết mũ trắng là "hacker làm việc tốt" — đó là cách mũ xám tự mô tả về mình.</p>`],

      [27, '3. Common types of hacking',
        `<p class="y-chinh">🎯 The last slide of the chapter moves from <em>who</em> to <em>why</em>: three motives — <strong>financial gain, corporate espionage, state-sponsored hacking</strong> — and the objective on slide 4 asks for exactly this ("motivation for attacks").</p>
<ul>
<li><strong>Hacking for financial gain</strong> — the slide is blunt: "lone black hat hackers as well as hacking collectives are typically thieves." Three revenue models are named — stealing money directly, hijacking data to enable later theft, and selling stolen data to other criminals. Add the fourth that now dominates: <em>ransomware</em>, which sells the victim their own data back, and which attacks availability rather than confidentiality.</li>
<li><strong>Corporate espionage</strong> — "the commercial application of hacking, malware, phishing and other spying techniques to obtain privileged insider information from a business competitor." Note what is being stolen here: not money but <em>advantage</em> — designs, pricing, client lists, source code. This is exactly the trade-secret material that slide 23's NDA is written to protect, which is why those two slides belong together.</li>
<li><strong>State-sponsored hacking</strong> — "countries all across the world are constantly playing games of cat-and-mouse cyber warfare with one another. Everyone knows that everyone else is doing it, and everyone acts surprised and offended when they get caught." The slide's tone is wry but the description is accurate. What distinguishes state actors technically is patience and budget: they will stay undetected inside a network for months, which is why the industry calls them <em>advanced persistent threats</em> (APT).</li>
<li><strong>Two motives the slide leaves out, worth one line each</strong> — <em>hacktivism</em> (attacks for a political or social cause, which is what the slide mistakenly called grey hat on slide 26) and <em>ego / curiosity</em>, which was historically the commonest motive of all and is still what starts most careers, in both directions.</li>
<li><strong>Map the motives onto the goals of slide 7 and the chapter closes</strong> —</li>
</ul>
<table>
<tr><td><strong>Motive</strong></td><td><strong>Goal usually attacked</strong></td><td><strong>Typical technique</strong></td><td><strong>Main defence</strong></td></tr>
<tr><td>Financial gain</td><td>Availability (ransomware) or confidentiality (data theft)</td><td>Phishing, stolen credentials, unpatched servers</td><td>Backups, MFA, patching, least privilege</td></tr>
<tr><td>Corporate espionage</td><td>Confidentiality</td><td>Phishing of key staff, insiders, malware</td><td>NDA + access control + encryption + monitoring</td></tr>
<tr><td>State-sponsored</td><td>All three, over long periods</td><td>Zero-days, supply chain, long-dwell intrusion</td><td>Segmentation, logging, threat hunting</td></tr>
</table>
<p class="dap-an">✅ The whole chapter in one chain, worth reciting before the exam: <em>information is an asset (slide 6) → it needs confidentiality, integrity and availability (7) → seven attacks threaten those (8) → cryptography and steganography defend them (9–14) → three ethical principles tell us what we ought to do (16–19) → privacy rules and the NDA turn that into obligations (21–23) → and the hackers of 25–27 are why any of it was necessary.</em></p>
<p class="pitfall">⚠️ A common weak answer on the final exam: listing attack <em>techniques</em> (phishing, SQL injection, DDoS) when the question asked for <em>motivations</em>. Motivation is money, advantage, politics, ego. Technique is how. Read the verb in the question before you start writing.</p>`,
        `<p class="y-chinh">🎯 Slide cuối của chương chuyển từ <em>ai</em> sang <em>vì sao</em>: ba động cơ — <strong>kiếm tiền, gián điệp doanh nghiệp, tấn công do nhà nước bảo trợ</strong> — và mục tiêu ở slide 4 hỏi đúng cái này ("động cơ của các cuộc tấn công").</p>
<ul>
<li><strong>Tấn công để kiếm tiền</strong> — slide nói thẳng tuột: "các hacker mũ đen đơn lẻ cũng như các nhóm hacker về cơ bản là những kẻ trộm." Ba mô hình kiếm tiền được gọi tên — trộm tiền trực tiếp, chiếm giữ dữ liệu để dọn đường cho vụ trộm sau, và bán dữ liệu ăn cắp cho tội phạm khác. Hãy thêm mô hình thứ tư nay đang chiếm ưu thế: <em>mã độc tống tiền</em>, thứ bán lại cho nạn nhân chính dữ liệu của họ, và tấn công vào tính SẴN SÀNG chứ không phải tính bí mật.</li>
<li><strong>Gián điệp doanh nghiệp</strong> — "việc áp dụng hacking, mã độc, lừa đảo và các kỹ thuật do thám khác vào mục đích thương mại, để lấy thông tin nội bộ đặc quyền từ một đối thủ cạnh tranh." Để ý thứ bị lấy ở đây: không phải tiền mà là <em>lợi thế</em> — bản thiết kế, bảng giá, danh sách khách hàng, mã nguồn. Đó đúng là loại bí mật kinh doanh mà bản NDA ở slide 23 được viết ra để bảo vệ, nên hai slide ấy thuộc về nhau.</li>
<li><strong>Tấn công do nhà nước bảo trợ</strong> — "các quốc gia khắp thế giới liên tục chơi trò mèo vờn chuột trong chiến tranh mạng với nhau. Ai cũng biết những người khác đang làm điều đó, và ai cũng tỏ ra ngạc nhiên rồi phẫn nộ khi bị bắt quả tang." Giọng của slide có phần châm biếm nhưng mô tả thì chính xác. Cái phân biệt tác nhân nhà nước về mặt kỹ thuật là SỰ KIÊN NHẪN và NGÂN SÁCH: họ nằm im không bị phát hiện trong mạng suốt nhiều tháng, vì thế ngành này gọi họ là <em>mối đe doạ thường trực tinh vi</em> (APT).</li>
<li><strong>Hai động cơ slide bỏ sót, mỗi cái đáng một dòng</strong> — <em>hacktivism</em> (tấn công vì một mục tiêu chính trị hay xã hội, mà slide 26 đã gọi nhầm thành mũ xám) và <em>cái tôi / sự tò mò</em>, vốn trong lịch sử là động cơ phổ biến nhất và tới nay vẫn là thứ khởi đầu phần lớn sự nghiệp, theo cả hai hướng.</li>
<li><strong>Gióng các động cơ vào ba mục tiêu của slide 7 là chương khép lại</strong> —</li>
</ul>
<table>
<tr><td><strong>Động cơ</strong></td><td><strong>Mục tiêu thường bị đánh</strong></td><td><strong>Kỹ thuật điển hình</strong></td><td><strong>Phòng vệ chính</strong></td></tr>
<tr><td>Kiếm tiền</td><td>Sẵn sàng (tống tiền) hoặc bí mật (trộm dữ liệu)</td><td>Lừa đảo, thông tin đăng nhập bị đánh cắp, máy chủ chưa vá</td><td>Sao lưu, xác thực nhiều yếu tố, vá lỗi, quyền tối thiểu</td></tr>
<tr><td>Gián điệp doanh nghiệp</td><td>Bí mật</td><td>Lừa đảo nhắm nhân sự chủ chốt, người trong nội bộ, mã độc</td><td>NDA + kiểm soát truy cập + mã hoá + giám sát</td></tr>
<tr><td>Nhà nước bảo trợ</td><td>Cả ba, kéo dài nhiều tháng</td><td>Lỗ hổng chưa ai biết, chuỗi cung ứng, nằm vùng lâu</td><td>Phân vùng mạng, ghi nhật ký, săn tìm mối đe doạ</td></tr>
</table>
<p class="dap-an">✅ Cả chương gói trong một chuỗi, đáng đọc thầm trước khi vào phòng thi: <em>thông tin là tài sản (slide 6) → nó cần tính bí mật, toàn vẹn và sẵn sàng (7) → bảy cuộc tấn công đe doạ ba thứ ấy (8) → mật mã học và giấu tin bảo vệ chúng (9–14) → ba nguyên tắc đạo đức nói cho ta biết nên làm gì (16–19) → các quy tắc riêng tư và bản NDA biến điều đó thành nghĩa vụ (21–23) → và những hacker ở slide 25–27 chính là lý do tất cả những thứ trên là cần thiết.</em></p>
<p class="pitfall">⚠️ Một bài làm yếu rất hay gặp ở đề cuối kỳ: liệt kê các <em>kỹ thuật</em> tấn công (phishing, SQL injection, DDoS) trong khi câu hỏi hỏi về <em>động cơ</em>. Động cơ là tiền, lợi thế, chính trị, cái tôi. Kỹ thuật là cách làm. Hãy đọc kỹ động từ trong đề trước khi đặt bút.</p>`],

    ]),
  ].join('\n'),
};
