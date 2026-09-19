/**
 * SSL101c · Mooc 1 (deck 'ssl1') — slide 83→109, hết deck.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). File /tmp/ssl101c-text/ssl1.txt báo "không có chữ" cho CẢ 27 slide của
 * đoạn này — nó KHÔNG dùng được. Toàn bộ 27 slide 083–109 đã được ĐỌC THẲNG TỪ
 * ẢNH /tmp/ssl101c-slides/ssl1/NNN.webp, chữ chép lại đúng từng dòng.
 *
 * ⚠️ NỘI DUNG THẬT KHÁC VỚI PHỎNG ĐOÁN BAN ĐẦU. Đoạn 83–109 KHÔNG bắt đầu ở
 * bản quyền. Nó gồm:
 *   · 83–90: NỐT phần 4.3 — đưa nguồn vào bài viết (trích dẫn nguyên văn ngắn/
 *     dài, danh mục tài liệu, diễn giải & tóm tắt)
 *   · 91–93: 4.4a — phần mềm quản lý tài liệu tham khảo (EndNote/Mendeley/Zotero)
 *   · 94–97: 5.1a/5.1b — bản quyền & giấy phép Creative Commons
 *   · 98–99: 5.2 — mạng số cho học tập và nghiên cứu (PLN)
 *   · 100–103: 5.3a/5.3b — quản lý danh tính số & thể hiện bản thân trực tuyến
 *   · 104–109: 5.4a–5.4d — giao tiếp trực tuyến, email cho giảng viên, diễn đàn
 *
 * Quy ước của deck (đã đối chiếu 27 ảnh): mỗi tiểu mục mở đầu bằng một slide
 * TIÊU ĐỀ chỉ chép lại CHUẨN ĐẦU RA của cả cụm — nên các slide 83/84/89, 100/102,
 * 104/106/107/108 LẶP nguyên văn nhau. Đó là lỗi/đặc tính của chính file .pptx,
 * KHÔNG phải nội dung mới. Bài này nói thẳng chỗ nào lặp thay vì giả vờ khác.
 *
 * Slide 93 là slide DUY NHẤT nền trắng trong đoạn (bảng so sánh phần mềm) —
 * bảng đã chép lại đủ 9 dòng × 3 cột, kể cả các ô KHÔNG có dấu ✓.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl1';

export default {
  title: '1.0d — Slide by slide: Quoting, paraphrasing, referencing software, copyright and digital identity (slides 83–109)|||1.0d — Slide bài giảng: Trích dẫn, diễn giải, phần mềm tài liệu, bản quyền & danh tính số (slide 83–109)',
  slug: 'ssl101c-1-0d-slides-trich-dan-ban-quyen-danh-tinh-so',
  type: 'DOCUMENT',
  description: 'Đoạn cuối Mooc 1 của SSL101c (slide 83–109), đọc thẳng từ ảnh slide gốc University of Sydney. Nửa đầu khép lại Module 4: ba cách đưa nguồn vào bài (trích nguyên văn ngắn "trong ngoặc kép" / trích dài THỤT LỀ / diễn giải / tóm tắt), bốn cách sửa một câu trích (ellipses, information prominent, author prominent, [word]), cách bẻ một tài liệu APA ra từng mảnh, năm bước diễn giải của Swales & Feak, và bảng so sánh EndNote · Mendeley · Zotero. Nửa sau là trọn Module 5: bản quyền là quyền tinh thần + quyền kinh tế (chỉ dùng được khi CÓ PHÉP hoặc CÓ NGOẠI LỆ), đủ 6 giấy phép Creative Commons cộng CC0, mạng học tập cá nhân, quản lý danh tính số (nhà tuyển dụng CÓ tìm tên bạn — LinkedIn/GitHub), netiquette, và email gửi giảng viên có mẫu XẤU/TỐT cùng một tình huống.',
  content: [
    walkHead(D, 83, 109),
    walk(D, [

      [83, '4.3a Incorporating Sources (module objectives)',
        `<p class="y-chinh">🎯 The slide opens section 4.3 with three learning outcomes: <strong>incorporate ideas from sources without plagiarizing</strong>, <strong>use direct quotes appropriately</strong>, and <strong>use paraphrasing &amp; summarizing appropriately</strong>. Everything from slide 83 to slide 90 is one of those three skills.</p>
<ul>
<li><strong>What the section is actually for.</strong> Slide 74 defined plagiarism as using other people's ideas, arguments and opinions and claiming them as your own. This section is the constructive answer: here are the <em>legal</em> ways to put someone else's thinking inside your own paragraph.</li>
<li><strong>There are exactly THREE techniques, and the exam expects you to name them.</strong> Direct quotation (their words, marked), paraphrase (their idea, your words, same length), summary (their idea, your words, much shorter). Every one of the three requires a citation — that is the point people forget.</li>
<li><strong>Why it is worth marks and not just etiquette.</strong> Sources are how you show you did the reading. An essay with no sources reads as opinion; an essay that is all quotation reads as a scrapbook. The skill being assessed is <em>proportion</em>: your voice leading, their evidence supporting.</li>
<li><strong>At FPTU this is immediate.</strong> Report and assignment work in SSG104, SWP391, SWR302 and every capstone requires a reference list. Turnitin-style similarity checking flags copied strings — a paraphrase done properly drops the similarity score, a "paraphrase" that only swaps a few synonyms does not.</li>
<li><strong>Note the repeated objective block.</strong> Slides 83, 84 and 89 print <em>the same three bullets</em>. That is how this deck signposts a new sub-section, not three different lists. Do not waste memory trying to tell them apart.</li>
</ul>
<table>
<tr><th>Technique</th><th>Whose words</th><th>Length vs original</th><th>Citation needed?</th></tr>
<tr><td>Direct quote</td><td>THEIRS, exactly</td><td>Same</td><td>Yes — plus quote marks or indent</td></tr>
<tr><td>Paraphrase</td><td>YOURS</td><td>About the same</td><td>Yes</td></tr>
<tr><td>Summary</td><td>YOURS</td><td>Much shorter</td><td>Yes</td></tr>
</table>
<p class="meo">💡 Exam shortcut: if an option says a technique "does not need a citation", it is wrong. All three do. The only thing that changes is the <em>formatting</em>.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu mục 4.3 bằng ba chuẩn đầu ra: <strong>đưa ý từ nguồn vào bài mà KHÔNG đạo văn</strong>, <strong>dùng trích dẫn nguyên văn đúng cách</strong>, và <strong>dùng diễn giải &amp; tóm tắt đúng cách</strong>. Từ slide 83 tới slide 90, mọi thứ đều là một trong ba kỹ năng đó.</p>
<ul>
<li><strong>Mục này để làm gì.</strong> Slide 74 đã định nghĩa đạo văn là lấy ý tưởng, lập luận, quan điểm của người khác rồi nhận là của mình. Mục này là câu trả lời XÂY DỰNG: đây là những cách HỢP LỆ để đặt suy nghĩ của người khác vào trong đoạn văn của chính bạn.</li>
<li><strong>Có ĐÚNG BA kỹ thuật, và đề thi bắt bạn gọi tên được.</strong> Trích nguyên văn (chữ của họ, có đánh dấu), diễn giải — paraphrase (ý của họ, chữ của bạn, độ dài xấp xỉ), tóm tắt — summary (ý của họ, chữ của bạn, ngắn hơn nhiều). Cả ba đều PHẢI trích nguồn — đây là chỗ người ta hay quên.</li>
<li><strong>Vì sao nó ăn điểm chứ không chỉ là phép lịch sự.</strong> Nguồn là bằng chứng bạn đã đọc. Bài không có nguồn đọc như ý kiến cá nhân; bài toàn trích dẫn đọc như một quyển sổ dán. Thứ đang được chấm là TỈ LỆ: giọng bạn dẫn dắt, dẫn chứng của họ đỡ phía sau.</li>
<li><strong>Ở FPTU dùng được ngay.</strong> Báo cáo và assignment của SSG104, SWP391, SWR302 và mọi đồ án đều đòi danh mục tài liệu. Công cụ kiểu Turnitin bắt các chuỗi chữ trùng — diễn giải đúng cách làm tụt tỉ lệ trùng, còn "diễn giải" kiểu thay vài từ đồng nghĩa thì KHÔNG.</li>
<li><strong>Để ý khối chuẩn đầu ra bị LẶP.</strong> Slide 83, 84 và 89 in <em>y hệt ba gạch đầu dòng đó</em>. Đây là cách deck báo hiệu sang tiểu mục mới, không phải ba danh sách khác nhau. Đừng tốn trí nhớ phân biệt chúng.</li>
</ul>
<table>
<tr><th>Kỹ thuật</th><th>Chữ của ai</th><th>Độ dài so với gốc</th><th>Có phải trích nguồn?</th></tr>
<tr><td>Trích nguyên văn</td><td>CỦA HỌ, y nguyên</td><td>Bằng</td><td>Có — cộng thêm ngoặc kép hoặc thụt lề</td></tr>
<tr><td>Diễn giải (paraphrase)</td><td>CỦA BẠN</td><td>Xấp xỉ bằng</td><td>Có</td></tr>
<tr><td>Tóm tắt (summary)</td><td>CỦA BẠN</td><td>Ngắn hơn nhiều</td><td>Có</td></tr>
</table>
<p class="meo">💡 Mẹo thi: phương án nào bảo một kỹ thuật "không cần trích nguồn" thì SAI. Cả ba đều cần. Thứ duy nhất thay đổi là CÁCH TRÌNH BÀY.</p>`],

      [84, '4.3b Incorporating Sources: Quotes (module objectives, repeated)',
        `<p class="y-chinh">🎯 The same three objectives again, now under the heading <strong>Quotes</strong>. Slides 85–88 are the detail: what a short quote looks like, what a long quote looks like, how the citation ties back to the reference list, and the four legitimate ways to alter a quotation.</p>
<ul>
<li><strong>Spot the spelling, it tells you something.</strong> Slide 83 wrote "plagiarizing" and "summarizing"; slide 84 writes "plagiarising" but keeps "summarizing". The deck mixes British and American spelling. Both are correct English — but <em>pick one and be consistent inside a single assignment</em>, which is itself an academic-writing rule.</li>
<li><strong>A direct quote is the narrowest tool of the three.</strong> Use it only when the exact wording matters: a definition, a legal clause, a striking phrase you intend to analyse, or a claim you are about to disagree with. If the wording does not matter, paraphrase instead — it reads better and proves you understood.</li>
<li><strong>Two formats, decided purely by LENGTH.</strong> Short quote → inside your sentence, in quotation marks (slide 85). Long quote → introduced, then set off as an indented block with NO quotation marks (slide 86). That length/format pairing is the single most exam-likely fact in this whole sub-section.</li>
<li><strong>Quoting never removes the need to cite.</strong> Quote marks say "these are not my words"; the citation says "and here is whose they are". Doing the first without the second is still plagiarism.</li>
<li><strong>FPTU angle for IT students.</strong> The same rule reaches code. Pasting a Stack Overflow function into your assignment is a direct quote: it needs a comment naming the source and the licence. Ripping it silently is exactly the behaviour this slide is trying to prevent.</li>
</ul>
<p class="pitfall">⚠️ Trap: "if I change a few words inside the quotation marks, it is more honest." No — anything inside quotation marks must be <strong>verbatim</strong>. Changes are allowed only through the four marked devices on slide 88 (ellipsis, square brackets, and the two prominence patterns).</p>`,
        `<p class="y-chinh">🎯 Vẫn ba chuẩn đầu ra ấy, lần này dưới tiêu đề <strong>Quotes</strong> (trích dẫn nguyên văn). Slide 85–88 mới là phần chi tiết: trích ngắn trông thế nào, trích dài trông thế nào, trích dẫn nối về danh mục tài liệu ra sao, và bốn cách SỬA một câu trích được phép.</p>
<ul>
<li><strong>Để ý chính tả, nó nói lên một điều.</strong> Slide 83 viết "plagiarizing" và "summarizing"; slide 84 viết "plagiarising" nhưng vẫn giữ "summarizing". Deck TRỘN chính tả Anh-Anh với Anh-Mỹ. Cả hai đều đúng — nhưng <em>chọn một kiểu và giữ nhất quán trong một bài</em>, đó tự nó đã là một luật viết học thuật.</li>
<li><strong>Trích nguyên văn là công cụ HẸP nhất trong ba cái.</strong> Chỉ dùng khi chữ nghĩa CHÍNH NÓ quan trọng: một định nghĩa, một điều khoản luật, một câu đắt bạn sắp phân tích, hoặc một khẳng định bạn sắp phản bác. Nếu câu chữ không quan trọng thì hãy diễn giải — đọc mượt hơn và chứng minh bạn đã hiểu.</li>
<li><strong>Hai định dạng, phân biệt thuần bằng ĐỘ DÀI.</strong> Trích ngắn → nằm trong câu của bạn, có ngoặc kép (slide 85). Trích dài → có câu dẫn, rồi tách ra thành khối THỤT LỀ, KHÔNG ngoặc kép (slide 86). Cặp độ-dài ↔ định-dạng này là chi tiết dễ ra đề nhất của cả tiểu mục.</li>
<li><strong>Trích nguyên văn KHÔNG miễn cho bạn việc ghi nguồn.</strong> Ngoặc kép nói "đây không phải chữ tôi"; trích dẫn nói "và đây là chữ của ai". Làm vế đầu mà bỏ vế sau thì vẫn là đạo văn.</li>
<li><strong>Góc FPTU cho dân CNTT.</strong> Luật này chạm cả tới MÃ NGUỒN. Dán một hàm từ Stack Overflow vào assignment chính là một lần trích nguyên văn: phải có comment ghi nguồn và giấy phép. Bê im lặng đúng là hành vi mà slide này đang muốn chặn.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: "tôi đổi vài chữ bên trong ngoặc kép cho nó thật hơn." KHÔNG — mọi thứ trong ngoặc kép phải <strong>Y NGUYÊN</strong>. Chỉ được sửa qua bốn công cụ có đánh dấu ở slide 88 (dấu lược, ngoặc vuông, và hai kiểu nhấn mạnh).</p>`],

      [85, 'Shorter Direct Quote — quotation marks + (author & publication details)',
        `<p class="y-chinh">🎯 The template, printed on the slide: <code>"Author's original phrase or sentence" (author &amp; publication details).</code> And the rule underneath it: <strong>putting quotation marks around a phrase or sentence indicates that it has been taken directly from another information source.</strong></p>
<ul>
<li><strong>Read the template as four obligatory parts.</strong> (1) opening quote mark, (2) the author's words unchanged, (3) closing quote mark, (4) the citation in brackets. Drop part 4 and you have plagiarism; drop parts 1 and 3 and you also have plagiarism, even with the citation present, because the reader cannot tell where the borrowed words stop.</li>
<li><strong>The quotation marks are a SIGNAL, not decoration.</strong> They carry a precise meaning to an academic reader: "every character between these marks is somebody else's, verbatim". That is why they cannot be used for emphasis, for irony, or to soften a word you are unsure about.</li>
<li><strong>Punctuation order that markers notice.</strong> In the slide's pattern the full stop comes <em>after</em> the closing bracket, not before the closing quote mark. The bracketed citation belongs to your sentence, so your sentence ends after it.</li>
<li><strong>Short means short.</strong> The deck does not give a number here, but the standard APA threshold is roughly <strong>40 words</strong>: under it, use this in-line form; over it, use the indented block of slide 86. Remember the ~40-word line as the switch between the two formats.</li>
<li><strong>Weave it in, do not drop it in.</strong> A quotation standing alone as a whole sentence ("dropped quote") is weak writing. Introduce it with your own clause — <em>As Noda et al. (2013) put it, "…"</em> — so the reader knows why it is there before they read it.</li>
</ul>
<p class="dap-an">✅ Worked example, FPTU style. Original sentence in a paper: <em>Robotic assistance significantly improved positioning accuracy.</em> Correct short quote: According to one trial, robotic assistance "significantly improved positioning accuracy" (Noda et al., 2013). Quote marks around the borrowed words only, citation attached, your own words carrying the sentence.</p>
<p class="pitfall">⚠️ Very common failure: quoting correctly in the body but never adding the full entry to the reference list. An in-text citation is a <strong>pointer</strong>; if it points nowhere, the source is effectively unattributed. Slide 87 is about exactly that pairing.</p>`,
        `<p class="y-chinh">🎯 Khuôn mẫu in ngay trên slide: <code>"Author's original phrase or sentence" (author &amp; publication details).</code> Và luật ngay dưới: <strong>đặt ngoặc kép quanh một cụm từ hay một câu là dấu hiệu cho biết nó được lấy TRỰC TIẾP từ một nguồn thông tin khác.</strong></p>
<ul>
<li><strong>Đọc khuôn mẫu này thành BỐN phần bắt buộc.</strong> (1) ngoặc kép mở, (2) chữ của tác giả giữ nguyên, (3) ngoặc kép đóng, (4) trích dẫn trong ngoặc đơn. Thiếu phần 4 là đạo văn; thiếu phần 1 và 3 cũng vẫn là đạo văn dù có trích dẫn, vì người đọc không biết chữ đi mượn dừng ở đâu.</li>
<li><strong>Ngoặc kép là TÍN HIỆU, không phải trang trí.</strong> Với người đọc học thuật nó mang nghĩa rất chính xác: "mọi ký tự nằm giữa hai dấu này là của người khác, y nguyên". Vì thế KHÔNG được dùng ngoặc kép để nhấn mạnh, để mỉa mai, hay để làm nhẹ một từ bạn chưa chắc.</li>
<li><strong>Thứ tự dấu câu mà người chấm để ý.</strong> Theo mẫu của slide, dấu chấm đứng SAU ngoặc đơn đóng, không đứng trước ngoặc kép đóng. Cụm trích dẫn thuộc về câu CỦA BẠN, nên câu của bạn kết thúc sau nó.</li>
<li><strong>Ngắn nghĩa là ngắn.</strong> Slide không cho con số, nhưng ngưỡng chuẩn của APA là khoảng <strong>40 từ</strong>: dưới ngưỡng thì dùng dạng nằm trong câu này; trên ngưỡng thì dùng khối thụt lề của slide 86. Nhớ cái mốc ~40 từ như cái công tắc chuyển giữa hai định dạng.</li>
<li><strong>ĐAN vào, đừng THẢ rơi.</strong> Một câu trích đứng một mình thành nguyên một câu ("dropped quote") là văn yếu. Hãy dẫn bằng mệnh đề của chính bạn — <em>Như Noda và cộng sự (2013) viết, "…"</em> — để người đọc biết vì sao nó có mặt trước khi đọc nó.</li>
</ul>
<p class="dap-an">✅ Ví dụ giải mẫu, kiểu FPTU. Câu gốc trong bài báo: <em>Robotic assistance significantly improved positioning accuracy.</em> Trích ngắn đúng cách: Theo một thử nghiệm, hỗ trợ robot "significantly improved positioning accuracy" (Noda et al., 2013). Ngoặc kép chỉ ôm phần chữ đi mượn, trích dẫn dính kèm, phần còn lại là chữ của bạn gánh câu.</p>
<p class="pitfall">⚠️ Lỗi cực phổ biến: trích trong thân bài thì đúng nhưng KHÔNG bao giờ thêm mục đầy đủ vào danh mục tài liệu. Trích dẫn trong bài chỉ là một CON TRỎ; trỏ vào hư không thì nguồn coi như không được ghi công. Slide 87 nói đúng về cặp đôi này.</p>`],

      [86, 'Longer Direct Quote — introductory text, indented block, no quote marks',
        `<p class="y-chinh">🎯 The long-quote layout, printed as a dummy on the slide: an <strong>introductory text in your own words</strong>, a colon, then the author's sentences set in an <strong>indented block</strong> ending with <code>(Author &amp; publication details)</code>. The rule underneath: <strong>indenting lines of text indicates that it is a longer direct quote.</strong></p>
<table>
<tr><th></th><th>Shorter quote (slide 85)</th><th>Longer quote (slide 86)</th></tr>
<tr><td>Position</td><td>Inside your own sentence</td><td>Own block, on its own lines</td></tr>
<tr><td>Quotation marks</td><td><strong>Yes</strong></td><td><strong>No</strong> — the indent replaces them</td></tr>
<tr><td>Indentation</td><td>No</td><td><strong>Yes</strong> — this is the signal</td></tr>
<tr><td>Introduction</td><td>Optional but preferred</td><td><strong>Required</strong> — "introductory text in your own words"</td></tr>
<tr><td>Typical threshold</td><td>Under ~40 words</td><td>Over ~40 words</td></tr>
</table>
<ul>
<li><strong>The indent and the quote marks do the SAME job, so you never use both.</strong> Each is a visual claim of "borrowed text starts here". Doubling them looks like you do not know the convention. This is the classic multiple-choice pair — expect an option that keeps the quotation marks on an indented block, and reject it.</li>
<li><strong>"Introductory text in your own words" is not optional garnish.</strong> A block quote arriving with no lead-in is the most jarring thing in student writing. The lead-in states whose voice is about to speak and why it matters, so the reader can judge the quotation instead of merely receiving it.</li>
<li><strong>Long quotes are a budget you should mostly not spend.</strong> A 60-word block is 60 words of somebody else's writing occupying your word count. Markers read a page of block quotes as padding. Reserve it for text you are going to dissect line by line.</li>
<li><strong>What follows a block quote matters more than the quote.</strong> Never end a paragraph on a block quote. Add a sentence in your own voice that says what it proves for <em>your</em> argument — that sentence is where your marks live.</li>
<li><strong>FPTU application.</strong> Quoting a full clause from an RFC, an ISO standard, or a licence text in a SWR302/SWP391 report is a legitimate use of the long form: the wording is legally exact and must not be reworded. Introduce it, indent it, cite it, then explain what your team did about it.</li>
</ul>
<p class="meo">💡 One-line memory hook: <strong>short = "in quotes", long = indented</strong>. Slide 88 prints exactly those two lines as the section summary, so the deck itself tells you this is the examinable pair.</p>`,
        `<p class="y-chinh">🎯 Bố cục trích dài, in dạng mẫu giả trên slide: một <strong>câu dẫn bằng chữ của chính bạn</strong>, dấu hai chấm, rồi các câu của tác giả đặt thành một <strong>khối THỤT LỀ</strong>, kết bằng <code>(Author &amp; publication details)</code>. Luật ở dưới: <strong>thụt lề các dòng chữ là dấu hiệu cho biết đây là trích dẫn nguyên văn DÀI.</strong></p>
<table>
<tr><th></th><th>Trích NGẮN (slide 85)</th><th>Trích DÀI (slide 86)</th></tr>
<tr><td>Vị trí</td><td>Nằm trong câu của bạn</td><td>Khối riêng, xuống dòng riêng</td></tr>
<tr><td>Ngoặc kép</td><td><strong>CÓ</strong></td><td><strong>KHÔNG</strong> — thụt lề thay thế nó</td></tr>
<tr><td>Thụt lề</td><td>Không</td><td><strong>CÓ</strong> — đây chính là tín hiệu</td></tr>
<tr><td>Câu dẫn</td><td>Không bắt buộc nhưng nên có</td><td><strong>BẮT BUỘC</strong> — "introductory text in your own words"</td></tr>
<tr><td>Ngưỡng thông dụng</td><td>Dưới ~40 từ</td><td>Trên ~40 từ</td></tr>
</table>
<ul>
<li><strong>Thụt lề và ngoặc kép làm CÙNG một việc, nên không bao giờ dùng cả hai.</strong> Mỗi thứ là một lời tuyên bố bằng mắt rằng "chữ đi mượn bắt đầu từ đây". Dùng chồng lên nhau trông như bạn không biết quy ước. Đây là cặp trắc nghiệm kinh điển — sẽ có phương án giữ ngoặc kép trên khối thụt lề, và bạn phải loại nó.</li>
<li><strong>"Câu dẫn bằng chữ của bạn" không phải đồ trang trí tuỳ chọn.</strong> Một khối trích ập tới mà không có câu dẫn là thứ chướng nhất trong bài sinh viên. Câu dẫn cho biết giọng của AI sắp cất lên và vì sao nó đáng nghe, để người đọc ĐÁNH GIÁ được câu trích thay vì chỉ hứng lấy.</li>
<li><strong>Trích dài là một khoản ngân sách mà phần lớn thời gian bạn KHÔNG nên tiêu.</strong> Một khối 60 từ là 60 từ của người khác chiếm chỗ trong giới hạn từ của bạn. Người chấm đọc một trang toàn khối trích như là độn bài. Hãy để dành nó cho đoạn văn bạn sắp mổ từng dòng.</li>
<li><strong>Câu ĐỨNG SAU khối trích quan trọng hơn chính khối trích.</strong> Đừng bao giờ kết đoạn bằng một khối trích. Hãy thêm một câu bằng giọng của bạn nói nó chứng minh điều gì cho lập luận CỦA BẠN — điểm nằm ở câu đó.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trích trọn một điều khoản từ RFC, từ chuẩn ISO, hay từ một văn bản giấy phép trong báo cáo SWR302/SWP391 là chỗ dùng đúng của dạng dài: câu chữ mang tính pháp lý chính xác, không được viết lại. Dẫn vào, thụt lề, ghi nguồn, rồi giải thích nhóm bạn đã làm gì với nó.</li>
</ul>
<p class="meo">💡 Câu nhớ một dòng: <strong>ngắn = "trong ngoặc kép", dài = thụt lề</strong>. Slide 88 in đúng hai dòng đó làm phần tóm tắt, tức là chính deck đang bảo bạn đây là cặp sẽ ra đề.</p>`],

      [87, 'Reference List and In-text Author Citation — the Noda et al. (2013) example',
        `<p class="y-chinh">🎯 One source shown in both of its forms at once. The <strong>reference list</strong> entry is the long, complete record; the <strong>in-text author citation</strong> is the two-word pointer <code>(Noda et al., 2013)</code> that sends the reader to it. Learn to read the long form as a sequence of slots.</p>
<table>
<tr><th>Slot</th><th>Value on the slide</th><th>Punctuation that follows it</th></tr>
<tr><td>Authors (surname, initials)</td><td>Noda, Y., Ida, Y., Tanaka, S., Toyama, T., Roggia, M.F., Tamaki, Y., Sugita, N., Mitsuishi, M., &amp; Ueta, T.</td><td>Ampersand before the LAST author, then a full stop</td></tr>
<tr><td>Year</td><td>(2013).</td><td>In round brackets, then a full stop</td></tr>
<tr><td>Article title</td><td>Impact of robotic assistance on precision of vitreoretinal surgical procedures.</td><td>Sentence case — only the first word capitalised</td></tr>
<tr><td>Journal</td><td>PLoS ONE</td><td>Journal name kept in its own capitalisation</td></tr>
<tr><td>Volume(issue): pages</td><td>8(1): 1–6.</td><td>Volume 8, issue 1, pages 1 to 6</td></tr>
<tr><td>DOI</td><td>doi:10.1371/journal.pone.0054116.</td><td>The permanent address of the article</td></tr>
</table>
<ul>
<li><strong>Why "et al." appears in the body but not in the list.</strong> Nine authors is unreadable inside a sentence, so the in-text form keeps the first surname and replaces the rest with <em>et al.</em> (Latin, "and others"). The reference list keeps everyone, because that is the record. Same source, two lengths, one job.</li>
<li><strong>The pointer must match the list entry's first word.</strong> The reader finds the entry by looking up <em>Noda</em> alphabetically. If your in-text citation says one name and the list is alphabetised under another, the pointer is broken — the most common referencing error after simply forgetting the entry.</li>
<li><strong>The DOI is the part IT students should care about most.</strong> URLs rot; a DOI is a permanent identifier that resolves to the article forever. Pasting <code>10.1371/journal.pone.0054116</code> into a search box, or after <code>https://doi.org/</code>, lands on the paper. Prefer a DOI to any link you copied out of the browser bar.</li>
<li><strong>Sentence case versus title case is a real mark.</strong> APA article titles take sentence case ("Impact of robotic assistance on…"), while the journal name keeps its own capitalisation (PLoS ONE). Getting this backwards is the classic sign that a reference list was typed by hand in a hurry.</li>
<li><strong>Connect back to slide 25.</strong> Earlier in this deck the task was to "list part of a journal article" — authors, year, title, journal, volume, issue, pages, DOI. This slide is that anatomy lesson turned into a finished reference. Recognising the parts is what lets referencing software (slides 91–93) do the typing for you.</li>
</ul>
<p class="dap-an">✅ If an exam asks "what is the in-text citation for a nine-author 2013 paper by Noda and colleagues?" the answer is <strong>(Noda et al., 2013)</strong> — first surname, et al., comma, year. Not all nine names; not the journal; not the DOI.</p>`,
        `<p class="y-chinh">🎯 Một nguồn duy nhất hiện ra ở CẢ HAI dạng cùng lúc. Mục trong <strong>danh mục tài liệu</strong> là bản ghi dài và đầy đủ; <strong>trích dẫn trong bài</strong> là cái con trỏ hai chữ <code>(Noda et al., 2013)</code> đẩy người đọc tới đó. Hãy tập đọc bản dài như một dãy Ô.</p>
<table>
<tr><th>Ô</th><th>Giá trị trên slide</th><th>Dấu đi kèm</th></tr>
<tr><td>Tác giả (họ, chữ cái tên)</td><td>Noda, Y., Ida, Y., Tanaka, S., Toyama, T., Roggia, M.F., Tamaki, Y., Sugita, N., Mitsuishi, M., &amp; Ueta, T.</td><td>Dấu &amp; trước tác giả CUỐI, rồi dấu chấm</td></tr>
<tr><td>Năm</td><td>(2013).</td><td>Trong ngoặc đơn, rồi dấu chấm</td></tr>
<tr><td>Tên bài báo</td><td>Impact of robotic assistance on precision of vitreoretinal surgical procedures.</td><td>Viết hoa kiểu CÂU — chỉ hoa chữ đầu</td></tr>
<tr><td>Tạp chí</td><td>PLoS ONE</td><td>Tên tạp chí giữ nguyên cách viết hoa của nó</td></tr>
<tr><td>Tập(số): trang</td><td>8(1): 1–6.</td><td>Tập 8, số 1, trang 1 đến 6</td></tr>
<tr><td>DOI</td><td>doi:10.1371/journal.pone.0054116.</td><td>Địa chỉ VĨNH VIỄN của bài báo</td></tr>
</table>
<ul>
<li><strong>Vì sao "et al." có trong thân bài mà không có trong danh mục.</strong> Chín tác giả nhét vào giữa câu thì không đọc nổi, nên dạng trong bài giữ họ đầu tiên và thay phần còn lại bằng <em>et al.</em> (tiếng Latin, "và những người khác"). Danh mục giữ đủ mọi người, vì đó là BẢN GHI. Cùng một nguồn, hai độ dài, một nhiệm vụ.</li>
<li><strong>Con trỏ phải KHỚP với chữ đầu tiên của mục trong danh mục.</strong> Người đọc tìm mục đó bằng cách tra chữ <em>Noda</em> theo bảng chữ cái. Nếu trích dẫn trong bài ghi một tên mà danh mục lại xếp theo tên khác thì con trỏ gãy — đây là lỗi trích dẫn phổ biến thứ hai, chỉ sau việc quên hẳn mục đó.</li>
<li><strong>DOI là phần dân CNTT nên quan tâm nhất.</strong> URL mục nát theo thời gian; DOI là định danh vĩnh viễn luôn dẫn về bài báo. Dán <code>10.1371/journal.pone.0054116</code> vào ô tìm kiếm, hoặc sau <code>https://doi.org/</code>, là ra đúng bài. Hãy ưu tiên DOI hơn bất cứ đường dẫn nào chép từ thanh địa chỉ trình duyệt.</li>
<li><strong>Viết hoa kiểu câu hay kiểu tiêu đề là điểm thật.</strong> APA cho tên bài báo viết hoa kiểu CÂU ("Impact of robotic assistance on…"), còn tên tạp chí giữ cách viết hoa riêng (PLoS ONE). Làm ngược lại là dấu hiệu kinh điển của một danh mục gõ tay lúc vội.</li>
<li><strong>Nối ngược về slide 25.</strong> Trước đó trong deck có bài tập "liệt kê các thành phần của một bài báo tạp chí" — tác giả, năm, tên bài, tạp chí, tập, số, trang, DOI. Slide này là bài giải phẫu đó biến thành một tài liệu hoàn chỉnh. Nhận ra từng bộ phận chính là thứ cho phép phần mềm quản lý tài liệu (slide 91–93) gõ hộ bạn.</li>
</ul>
<p class="dap-an">✅ Nếu đề hỏi "trích dẫn trong bài cho bài báo chín tác giả năm 2013 của Noda và cộng sự là gì?" thì đáp án là <strong>(Noda et al., 2013)</strong> — họ đầu tiên, et al., dấu phẩy, năm. Không phải cả chín tên; không phải tên tạp chí; không phải DOI.</p>`],

      [88, 'Summary: Incorporating Ideas from Sources — four ways of changing quotations',
        `<p class="y-chinh">🎯 The section summary, and the densest examinable slide in this stretch. Two formatting rules you already know, plus <strong>four legitimate Ways of Changing Quotations</strong>: ellipses, information prominent, author prominent, and <code>"[word] or [l]etter"</code>. Adapted from Cargill &amp; O'Connor (2013).</p>
<table>
<tr><th>Device</th><th>What it does</th><th>Example</th></tr>
<tr><td><strong>Ellipsis …</strong></td><td>Marks words you CUT out of the middle of a quotation</td><td>"Robotic assistance … improved positioning accuracy" (Noda et al., 2013)</td></tr>
<tr><td><strong>Information prominent</strong></td><td>The IDEA leads the sentence; the source sits in brackets at the end</td><td>Robotic assistance improves surgical precision (Noda et al., 2013).</td></tr>
<tr><td><strong>Author prominent</strong></td><td>The AUTHOR leads the sentence; only the year sits in brackets</td><td>Noda et al. (2013) found that robotic assistance improves surgical precision.</td></tr>
<tr><td><strong>[word] or [l]etter</strong></td><td>Square brackets mark words or letters YOU inserted or altered so the quote fits your grammar</td><td>"[Robotic] assistance … improved [the] accuracy"; "[T]he results were clear"</td></tr>
</table>
<ul>
<li><strong>The unifying principle: every change must be VISIBLE.</strong> You may shorten a quotation and you may adjust it grammatically — but the reader must be able to see exactly where you intervened. Ellipsis marks a deletion, square brackets mark an insertion or a changed letter. A silent change is falsification.</li>
<li><strong>Information prominent vs author prominent is a genuine choice, not a coin toss.</strong> Use <em>information prominent</em> when the finding matters and the person does not — it keeps your paragraph flowing and lets you stack several sources behind one claim. Use <em>author prominent</em> when the person matters: you are comparing researchers, tracing who said what first, or about to disagree with someone by name.</li>
<li><strong>Notice where the year goes — this is the trap.</strong> Author prominent puts <strong>only the year</strong> in brackets, because the name is already in your sentence. Information prominent puts <strong>name and year together</strong> in brackets at the end. Writing "Noda et al. (Noda et al., 2013) found…" is the duplicated-name error markers see constantly.</li>
<li><strong>Why "[l]etter" is written so oddly.</strong> It demonstrates itself: the original sentence began with a capital "Letter", and because the quote is now mid-sentence the capital had to become lowercase, so the changed letter is bracketed. That one bracket is the whole convention in miniature.</li>
<li><strong>Ellipsis has limits.</strong> You may cut for brevity; you may not cut to reverse the meaning. Removing "not" or deleting the author's qualifying clause and hiding it behind "…" is academic misconduct even though the punctuation is technically correct.</li>
</ul>
<p class="dap-an">✅ Quick self-test. Rewrite <em>"The new compiler reduced build times dramatically in most of our test projects" (Tran, 2021)</em> in both prominence styles. <strong>Information prominent:</strong> The new compiler reduced build times dramatically in most test projects (Tran, 2021). <strong>Author prominent:</strong> Tran (2021) reported that the new compiler reduced build times dramatically in most test projects. Same content, different first word, different bracket contents.</p>
<p class="meo">💡 Memorise the summary as <strong>2 + 4</strong>: two formats (in quotes / indented) plus four change devices (…, information prominent, author prominent, [brackets]). That structure is exactly how a multiple-choice question about this slide will be built.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt của mục, và là slide đặc nhất về khả năng ra đề trong cả đoạn này. Hai luật định dạng bạn đã biết, cộng <strong>bốn cách SỬA câu trích được phép</strong>: dấu lược (ellipses), information prominent, author prominent, và <code>"[word] or [l]etter"</code>. Phỏng theo Cargill &amp; O'Connor (2013).</p>
<table>
<tr><th>Công cụ</th><th>Nó làm gì</th><th>Ví dụ</th></tr>
<tr><td><strong>Dấu lược …</strong></td><td>Đánh dấu phần chữ bạn CẮT BỎ ở giữa câu trích</td><td>"Robotic assistance … improved positioning accuracy" (Noda et al., 2013)</td></tr>
<tr><td><strong>Information prominent</strong><br/>(nhấn vào THÔNG TIN)</td><td>Ý TƯỞNG dẫn đầu câu; nguồn nằm trong ngoặc ở cuối</td><td>Hỗ trợ robot làm tăng độ chính xác phẫu thuật (Noda et al., 2013).</td></tr>
<tr><td><strong>Author prominent</strong><br/>(nhấn vào TÁC GIẢ)</td><td>TÁC GIẢ dẫn đầu câu; chỉ có NĂM nằm trong ngoặc</td><td>Noda et al. (2013) nhận thấy hỗ trợ robot làm tăng độ chính xác phẫu thuật.</td></tr>
<tr><td><strong>[word] hoặc [l]etter</strong></td><td>Ngoặc vuông đánh dấu chữ hoặc ký tự do CHÍNH BẠN thêm/sửa để câu trích khớp ngữ pháp của bạn</td><td>"[Robotic] assistance … improved [the] accuracy"; "[T]he results were clear"</td></tr>
</table>
<ul>
<li><strong>Nguyên tắc chung: mọi thay đổi phải NHÌN THẤY ĐƯỢC.</strong> Bạn được rút ngắn câu trích và được chỉnh cho hợp ngữ pháp — nhưng người đọc phải thấy chính xác bạn đã can thiệp ở đâu. Dấu lược đánh dấu chỗ xoá, ngoặc vuông đánh dấu chỗ thêm hoặc sửa. Sửa mà giấu là LÀM SAI LỆCH.</li>
<li><strong>Information prominent với author prominent là một LỰA CHỌN thật, không phải tung đồng xu.</strong> Dùng <em>information prominent</em> khi kết quả mới quan trọng còn ai nói thì không — nó giữ đoạn văn trôi và cho phép xếp nhiều nguồn sau một khẳng định. Dùng <em>author prominent</em> khi CON NGƯỜI quan trọng: bạn đang so sánh các nhà nghiên cứu, truy ai nói trước, hoặc sắp phản bác đích danh một người.</li>
<li><strong>Để ý NĂM nằm ở đâu — đây là cái bẫy.</strong> Author prominent chỉ để <strong>MỖI NĂM</strong> trong ngoặc, vì tên đã nằm sẵn trong câu. Information prominent để <strong>tên VÀ năm</strong> cùng trong ngoặc ở cuối. Viết "Noda et al. (Noda et al., 2013) nhận thấy…" là lỗi lặp tên mà người chấm gặp liên tục.</li>
<li><strong>Vì sao "[l]etter" viết kỳ cục vậy.</strong> Nó TỰ MINH HOẠ chính nó: câu gốc mở đầu bằng chữ "Letter" viết hoa, mà bây giờ câu trích nằm giữa câu nên chữ hoa phải hạ thành thường, vậy nên ký tự bị sửa được đóng ngoặc vuông. Một cái ngoặc đó gói trọn cả quy ước.</li>
<li><strong>Dấu lược có GIỚI HẠN.</strong> Bạn được cắt cho gọn; bạn KHÔNG được cắt để lật ngược nghĩa. Xoá chữ "not", hoặc xoá mệnh đề dè dặt của tác giả rồi giấu sau dấu "…", là gian lận học thuật dù dấu câu về mặt kỹ thuật vẫn đúng.</li>
</ul>
<p class="dap-an">✅ Tự kiểm nhanh. Hãy viết lại <em>"The new compiler reduced build times dramatically in most of our test projects" (Tran, 2021)</em> theo cả hai kiểu nhấn. <strong>Information prominent:</strong> Trình biên dịch mới giảm mạnh thời gian build ở phần lớn dự án thử nghiệm (Tran, 2021). <strong>Author prominent:</strong> Tran (2021) cho biết trình biên dịch mới giảm mạnh thời gian build ở phần lớn dự án thử nghiệm. Cùng nội dung, khác chữ đầu câu, khác thứ nằm trong ngoặc.</p>
<p class="meo">💡 Nhớ slide tóm tắt này theo công thức <strong>2 + 4</strong>: hai định dạng (ngoặc kép / thụt lề) cộng bốn công cụ sửa (…, information prominent, author prominent, [ngoặc vuông]). Câu trắc nghiệm về slide này sẽ được dựng đúng theo cấu trúc đó.</p>`],

      [89, '4.3c Paraphrasing & Summarising (module objectives, repeated a third time)',
        `<p class="y-chinh">🎯 The third and last appearance of the same three objectives, now heading the sub-section on <strong>paraphrasing and summarising</strong> — the two techniques where the words become yours and only the idea stays borrowed.</p>
<table>
<tr><th></th><th>Paraphrase</th><th>Summary</th></tr>
<tr><td>Scope</td><td>ONE sentence or a short passage</td><td>A whole section, chapter or article</td></tr>
<tr><td>Length</td><td>Roughly the SAME as the original</td><td>MUCH shorter — the main points only</td></tr>
<tr><td>Detail</td><td>All of it, restated</td><td>Detail deliberately dropped</td></tr>
<tr><td>Words</td><td>Yours</td><td>Yours</td></tr>
<tr><td>Citation</td><td>Required</td><td>Required</td></tr>
<tr><td>Typical use</td><td>Reporting one specific finding</td><td>Giving the reader background in two lines</td></tr>
</table>
<ul>
<li><strong>The one-line distinction to memorise.</strong> A paraphrase <em>restates</em>; a summary <em>condenses</em>. Length is the giveaway: same length → paraphrase, far shorter → summary. An exam option describing "a shortened restatement of an entire article" is a summary, not a paraphrase.</li>
<li><strong>Both are harder than quoting, and that is why they are worth more.</strong> You cannot paraphrase a sentence you do not understand — the act of rewriting proves comprehension. This is precisely why lecturers prefer paraphrase to quotation in student work.</li>
<li><strong>Changing words alone is NOT paraphrasing.</strong> Keeping the original sentence structure and swapping in synonyms is called patchwriting, and similarity checkers flag it because the word order survives. A real paraphrase changes structure, word order and word forms — that is why slide 90 lists all three as separate steps.</li>
<li><strong>Citation is still compulsory.</strong> The most expensive misconception in this whole MOOC: "I wrote it in my own words so it is mine now." The <em>idea</em> is still theirs. No quotation marks are needed, but the citation is.</li>
<li><strong>FPTU application.</strong> Literature-review sections of a capstone are mostly summary (one or two sentences per source), while the method and discussion sections use paraphrase (one specific finding, restated precisely). Learning which gear to be in saves an enormous amount of rewriting.</li>
</ul>
<p class="pitfall">⚠️ Trap pair the exam likes: "a paraphrase needs quotation marks" (FALSE — the words are yours) and "a paraphrase does not need a citation" (FALSE — the idea is theirs). Exactly one thing is dropped and exactly one thing is kept.</p>`,
        `<p class="y-chinh">🎯 Lần thứ ba và cũng là lần cuối ba chuẩn đầu ra ấy xuất hiện, giờ đứng đầu tiểu mục về <strong>diễn giải và tóm tắt</strong> — hai kỹ thuật mà CHỮ trở thành của bạn, chỉ còn Ý là đi mượn.</p>
<table>
<tr><th></th><th>Diễn giải (paraphrase)</th><th>Tóm tắt (summary)</th></tr>
<tr><td>Phạm vi</td><td>MỘT câu hoặc một đoạn ngắn</td><td>Cả một mục, một chương, một bài báo</td></tr>
<tr><td>Độ dài</td><td>XẤP XỈ bằng bản gốc</td><td>NGẮN HƠN NHIỀU — chỉ còn ý chính</td></tr>
<tr><td>Chi tiết</td><td>Giữ đủ, chỉ nói lại</td><td>Cố ý BỎ bớt chi tiết</td></tr>
<tr><td>Câu chữ</td><td>Của bạn</td><td>Của bạn</td></tr>
<tr><td>Trích nguồn</td><td>Bắt buộc</td><td>Bắt buộc</td></tr>
<tr><td>Dùng khi nào</td><td>Thuật lại một kết quả cụ thể</td><td>Dựng bối cảnh cho người đọc trong hai dòng</td></tr>
</table>
<ul>
<li><strong>Câu phân biệt một dòng cần thuộc.</strong> Diễn giải là <em>NÓI LẠI</em>; tóm tắt là <em>NÉN LẠI</em>. Độ dài là dấu hiệu tố cáo: bằng nhau → diễn giải, ngắn hơn hẳn → tóm tắt. Phương án mô tả "một bản nói lại đã rút gọn của cả bài báo" là tóm tắt, không phải diễn giải.</li>
<li><strong>Cả hai khó hơn trích nguyên văn, và vì thế mới đáng điểm hơn.</strong> Bạn không thể diễn giải một câu mà bạn không hiểu — chính hành động viết lại là bằng chứng của việc hiểu. Đó đúng là lý do giảng viên chuộng diễn giải hơn trích dẫn trong bài sinh viên.</li>
<li><strong>Đổi chữ KHÔNG PHẢI là diễn giải.</strong> Giữ nguyên cấu trúc câu gốc rồi thay từ đồng nghĩa gọi là patchwriting, và công cụ kiểm trùng vẫn bắt được vì TRẬT TỰ TỪ còn nguyên. Diễn giải thật phải đổi cấu trúc, đổi trật tự và đổi dạng từ — đó là lý do slide 90 tách cả ba thành các bước riêng.</li>
<li><strong>Vẫn BẮT BUỘC trích nguồn.</strong> Ngộ nhận đắt nhất của cả MOOC này: "tôi viết bằng chữ của tôi nên giờ nó là của tôi." <em>Ý TƯỞNG</em> vẫn là của họ. Không cần ngoặc kép, nhưng trích dẫn thì phải có.</li>
<li><strong>Áp dụng ở FPTU.</strong> Phần tổng quan tài liệu của đồ án chủ yếu là TÓM TẮT (một hai câu cho mỗi nguồn), còn phần phương pháp và thảo luận dùng DIỄN GIẢI (một kết quả cụ thể, nói lại thật chính xác). Biết mình đang ở số nào tiết kiệm rất nhiều công viết lại.</li>
</ul>
<p class="pitfall">⚠️ Cặp bẫy đề thi hay dùng: "diễn giải cần ngoặc kép" (SAI — chữ là của bạn) và "diễn giải không cần trích nguồn" (SAI — ý là của họ). Bỏ đúng một thứ và giữ đúng một thứ.</p>`],

      [90, 'Summary: Strategies for Paraphrasing and Summarizing — the five steps (Swales & Feak, 2012)',
        `<p class="y-chinh">🎯 A five-step procedure, printed in order on the slide. It is deliberately a <strong>process</strong>, not a trick — you never paraphrase by looking at the original sentence and typing over it.</p>
<table>
<tr><th>Step</th><th>Slide wording</th><th>What you physically do</th></tr>
<tr><td>1</td><td>Note the key information</td><td>Read, then write the facts down in note form — not sentences</td></tr>
<tr><td>2</td><td>Identify relationships between the key pieces of information</td><td>Decide: cause? contrast? sequence? condition?</td></tr>
<tr><td>3</td><td>Brainstorm linking phrases and expressions</td><td>because / whereas / as a result / although / once</td></tr>
<tr><td>4</td><td>Brainstorm synonyms and/or different word forms for key terms &amp; different word order</td><td>analyse → analysis; improve → improvement; active ↔ passive</td></tr>
<tr><td>5</td><td>Think about what you want to say about the claim in the original text</td><td>Add YOUR angle — agree, qualify, use it as evidence</td></tr>
</table>
<ul>
<li><strong>Step 1 is the anti-plagiarism step, and it works mechanically.</strong> Taking notes forces the original sentence out of your short-term memory. Writing the paraphrase <em>from your notes with the source closed</em> is the single most reliable habit in this entire module — the original wording cannot leak back in if it is not on screen.</li>
<li><strong>Steps 3 and 4 are why patchwriting fails.</strong> Notice the slide asks for <em>linking phrases</em>, <em>different word forms</em> AND <em>different word order</em> — three separate levers. Synonym-swapping alone touches only one of them, which is exactly why it still reads as copied.</li>
<li><strong>Step 5 is the one students skip, and it is where the marks are.</strong> A paraphrase that only reports is a transcription service. The sentence after it — "this matters here because…" — is your contribution. Swales &amp; Feak put it last because it is the purpose of the other four.</li>
<li><strong>Length check as a safety net.</strong> Finished paraphrase roughly the same length as the original → good. Much shorter → you actually wrote a summary, which may be fine but label it correctly. Almost identical wording → go back to step 1.</li>
<li><strong>FPTU application.</strong> This is the exact workflow for a capstone literature review: read a paper, close it, write four lines of notes, then build the paragraph from notes. It also survives a Turnitin check, which reading-and-retyping does not.</li>
</ul>
<p class="dap-an">✅ Worked example. <strong>Original:</strong> "Because the dataset was small, the authors could not confirm the effect in older patients." <strong>Step 1 notes:</strong> dataset small · effect unconfirmed · older patients. <strong>Step 2:</strong> the relationship is CAUSE → LIMITATION. <strong>Steps 3–4:</strong> "because" → "the limited size … meant that"; "confirm" → "confirmation"; reorder so the limitation leads. <strong>Result:</strong> Confirmation of the effect in older patients was not possible, as the limited size of the dataset restricted the analysis (Author, Year). <strong>Step 5 addition:</strong> This limitation matters for our project, since our own target users are in exactly that age group.</p>
<p class="meo">💡 Remember the five steps as <strong>notes → relationships → linkers → word forms → your angle</strong>. If a question asks for the FIRST step of paraphrasing, the answer is noting the key information, not looking for synonyms.</p>`,
        `<p class="y-chinh">🎯 Một quy trình năm bước, in đúng thứ tự trên slide. Nó cố ý là một <strong>QUY TRÌNH</strong>, không phải mẹo — bạn không bao giờ diễn giải bằng cách nhìn câu gốc rồi gõ đè lên.</p>
<table>
<tr><th>Bước</th><th>Chữ trên slide</th><th>Bạn thật sự làm gì</th></tr>
<tr><td>1</td><td>Note the key information</td><td>Đọc, rồi ghi các dữ kiện ra dạng GẠCH Ý — không viết thành câu</td></tr>
<tr><td>2</td><td>Identify relationships between the key pieces of information</td><td>Xác định: nhân quả? tương phản? trình tự? điều kiện?</td></tr>
<tr><td>3</td><td>Brainstorm linking phrases and expressions</td><td>vì / trong khi / kết quả là / mặc dù / một khi</td></tr>
<tr><td>4</td><td>Brainstorm synonyms and/or different word forms for key terms &amp; different word order</td><td>analyse → analysis; improve → improvement; chủ động ↔ bị động</td></tr>
<tr><td>5</td><td>Think about what you want to say about the claim in the original text</td><td>Thêm GÓC NHÌN CỦA BẠN — đồng tình, dè dặt, hay dùng nó làm bằng chứng</td></tr>
</table>
<ul>
<li><strong>Bước 1 là bước CHỐNG ĐẠO VĂN, và nó hiệu quả một cách cơ học.</strong> Việc ghi chú đẩy câu gốc ra khỏi trí nhớ ngắn hạn. Viết bản diễn giải <em>từ ghi chú, với nguồn ĐÃ ĐÓNG</em> là thói quen đáng tin nhất trong cả module này — câu chữ gốc không thể rò ngược vào nếu nó không nằm trên màn hình.</li>
<li><strong>Bước 3 và 4 giải thích vì sao patchwriting thất bại.</strong> Để ý slide đòi <em>cụm từ nối</em>, <em>dạng từ khác</em> VÀ <em>trật tự từ khác</em> — ba đòn bẩy riêng biệt. Thay từ đồng nghĩa chỉ chạm được một cái, nên nó vẫn đọc ra là chép.</li>
<li><strong>Bước 5 là bước sinh viên hay bỏ, mà điểm nằm ở đó.</strong> Bản diễn giải chỉ thuật lại thì chẳng khác dịch vụ chép chính tả. Câu đứng ngay sau — "điều này quan trọng ở đây vì…" — mới là đóng góp của bạn. Swales &amp; Feak đặt nó cuối cùng vì nó là MỤC ĐÍCH của bốn bước kia.</li>
<li><strong>Kiểm độ dài như lưới an toàn.</strong> Bản diễn giải xong dài xấp xỉ bản gốc → tốt. Ngắn hơn hẳn → thật ra bạn vừa viết một bản TÓM TẮT, cũng được nhưng phải gọi đúng tên. Câu chữ gần y hệt → quay lại bước 1.</li>
<li><strong>Áp dụng ở FPTU.</strong> Đây đúng là quy trình cho phần tổng quan tài liệu của đồ án: đọc một bài, ĐÓNG nó lại, ghi bốn dòng ghi chú, rồi dựng đoạn văn từ ghi chú. Nó cũng sống sót qua Turnitin, thứ mà lối vừa-đọc-vừa-gõ-lại thì không.</li>
</ul>
<p class="dap-an">✅ Ví dụ giải mẫu. <strong>Gốc:</strong> "Because the dataset was small, the authors could not confirm the effect in older patients." <strong>Ghi chú bước 1:</strong> dữ liệu nhỏ · chưa khẳng định được hiệu ứng · bệnh nhân lớn tuổi. <strong>Bước 2:</strong> quan hệ là NGUYÊN NHÂN → HẠN CHẾ. <strong>Bước 3–4:</strong> "because" → "kích thước hạn chế … khiến cho"; "confirm" → "sự khẳng định"; đảo để hạn chế đứng trước. <strong>Kết quả:</strong> Việc khẳng định hiệu ứng ở nhóm bệnh nhân lớn tuổi đã không thực hiện được, do kích thước hạn chế của tập dữ liệu bó hẹp khả năng phân tích (Tác giả, Năm). <strong>Thêm bước 5:</strong> Hạn chế này đáng chú ý với dự án của nhóm, vì người dùng mục tiêu của chúng tôi nằm đúng nhóm tuổi đó.</p>
<p class="meo">💡 Nhớ năm bước theo chuỗi <strong>ghi chú → quan hệ → từ nối → dạng từ → góc nhìn của bạn</strong>. Đề hỏi bước ĐẦU TIÊN của diễn giải thì đáp án là ghi lại thông tin then chốt, không phải đi tìm từ đồng nghĩa.</p>`],

      [91, '4.4a Referencing Software (module objectives)',
        `<p class="y-chinh">🎯 A new sub-section with two objectives: <strong>be familiar with different referencing software (open source &amp; institutionally supported)</strong>, and <strong>be able to evaluate referencing software for your own purposes</strong>. Note the second one — the MOOC does not tell you which tool to use, it teaches you to compare.</p>
<ul>
<li><strong>What this software actually is.</strong> A personal database of sources. You capture a source once; the tool stores its metadata (authors, year, title, journal, DOI) and can then print it in any referencing style on demand, plus insert the matching in-text citation as you type.</li>
<li><strong>The distinction the slide draws: open source vs institutionally supported.</strong> Open source (Zotero) is free, community-built, and yours forever. Institutionally supported (EndNote) is paid, but a university may hold a site licence — which also means access ends when your enrolment does. That trade-off is the whole reason slide 93 exists.</li>
<li><strong>Why it belongs in a digital-literacy course at all.</strong> Referencing by hand is exactly the kind of repetitive, error-prone, rule-bound task a computer should do. Recognising such tasks and delegating them is a digital-literacy skill in itself — the same instinct as writing a script instead of editing 200 files by hand.</li>
<li><strong>"Evaluate for your own purposes" means your criteria will differ.</strong> A student writing one report cares about being free and fast to set up. A researcher with 2,000 PDFs cares about storage and file renaming. There is no universally best tool, which is why the exam will ask about a <em>feature</em>, not a winner.</li>
<li><strong>FPTU reality check.</strong> For a semester report with 8–15 sources, Zotero plus its browser connector is enough and costs nothing. Install the Word plug-in, set the style once, and the reference list builds and re-sorts itself — including when you delete a source at 2 a.m. the night before the deadline.</li>
</ul>
<p class="meo">💡 Careful in the exam: the tool does NOT decide whether you must cite. It only formats. Every rule from slides 83–90 still applies with the software installed.</p>`,
        `<p class="y-chinh">🎯 Một tiểu mục mới với hai chuẩn đầu ra: <strong>biết các phần mềm quản lý tài liệu tham khảo khác nhau (mã nguồn mở &amp; do trường hỗ trợ)</strong>, và <strong>tự đánh giá được phần mềm nào hợp với mục đích của mình</strong>. Để ý cái thứ hai — MOOC KHÔNG bảo bạn dùng công cụ nào, nó dạy bạn cách SO SÁNH.</p>
<ul>
<li><strong>Phần mềm này thực chất là gì.</strong> Một cơ sở dữ liệu nguồn của riêng bạn. Bạn thu một nguồn MỘT lần; công cụ lưu siêu dữ liệu của nó (tác giả, năm, tên bài, tạp chí, DOI) rồi in ra theo bất kỳ kiểu trích dẫn nào khi cần, đồng thời chèn trích dẫn trong bài ngay lúc bạn gõ.</li>
<li><strong>Phân biệt mà slide vạch ra: mã nguồn mở với do trường hỗ trợ.</strong> Mã nguồn mở (Zotero) miễn phí, do cộng đồng làm, và là của bạn mãi mãi. Do trường hỗ trợ (EndNote) mất tiền, nhưng trường có thể mua bản quyền chung — kéo theo hệ quả là bạn mất quyền dùng khi hết là sinh viên. Chính sự đánh đổi đó là lý do slide 93 tồn tại.</li>
<li><strong>Vì sao nó nằm trong một môn về năng lực số.</strong> Trích dẫn bằng tay đúng là loại việc lặp đi lặp lại, dễ sai, đầy quy tắc mà máy tính nên làm. Nhận ra những việc như vậy và GIAO cho máy tự nó đã là một năng lực số — cùng bản năng với việc viết một script thay vì sửa tay 200 file.</li>
<li><strong>"Đánh giá theo mục đích của mình" nghĩa là tiêu chí mỗi người mỗi khác.</strong> Sinh viên viết một báo cáo quan tâm tới miễn phí và cài nhanh. Nhà nghiên cứu với 2.000 file PDF quan tâm tới dung lượng và đổi tên file. Không có công cụ tốt nhất cho tất cả — nên đề thi sẽ hỏi một <em>TÍNH NĂNG</em>, không hỏi ai thắng.</li>
<li><strong>Thực tế ở FPTU.</strong> Với một báo cáo học kỳ 8–15 nguồn thì Zotero cộng tiện ích trình duyệt là đủ và không tốn đồng nào. Cài plug-in cho Word, đặt kiểu trích dẫn một lần, danh mục tài liệu tự dựng và tự sắp lại — kể cả khi bạn xoá một nguồn lúc 2 giờ sáng trước hạn nộp.</li>
</ul>
<p class="meo">💡 Cẩn thận khi thi: công cụ KHÔNG quyết định việc bạn có phải trích nguồn hay không. Nó chỉ ĐỊNH DẠNG. Mọi luật từ slide 83–90 vẫn nguyên giá trị dù đã cài phần mềm.</p>`],

      [92, 'Summary: Referencing Software — the four things it does for you',
        `<p class="y-chinh">🎯 Four bullets, which is the complete functional definition of this category of tool: it <strong>manages files and references</strong>, <strong>automatically generates bibliographies and reference lists</strong>, <strong>links directly with word processors</strong>, and <strong>saves time &amp; ensures accuracy</strong>.</p>
<table>
<tr><th>Feature on the slide</th><th>What it replaces</th><th>Why it matters to you</th></tr>
<tr><td>Manages files and references</td><td>A folder of pdfs named "paper(3).pdf"</td><td>Every PDF is attached to its own metadata record and is searchable by author or keyword</td></tr>
<tr><td>Automatically generates bibliographies and reference lists</td><td>Typing APA punctuation by hand</td><td>Switching APA → IEEE becomes a dropdown, not a rewrite</td></tr>
<tr><td>Links directly with word processors</td><td>Copy-pasting citations into Word</td><td>Insert a citation and the list updates and re-sorts itself instantly</td></tr>
<tr><td>Saves time &amp; ensures accuracy</td><td>Proofreading 30 entries at 1 a.m.</td><td>Consistency is guaranteed — every entry is built by the same rule</td></tr>
</table>
<ul>
<li><strong>"Ensures accuracy" needs one honest asterisk.</strong> The tool guarantees consistent FORMAT, not correct DATA. If the metadata it scraped says the author is "J. Smith" when the paper says "Smith, J. A.", the output is beautifully formatted and wrong. Always eyeball a freshly imported record before trusting it.</li>
<li><strong>The word-processor plug-in is the feature that changes your behaviour.</strong> Without it, citing feels expensive so you postpone it to the end and then rush. With it, citing costs two clicks mid-sentence — so you actually cite as you write, which is the habit that prevents accidental plagiarism.</li>
<li><strong>Bullet 1 is bigger than it looks.</strong> "Manages files" means the PDF itself lives inside the library, attached to its record. Your reading, your highlights and your citation data stop being three separate piles.</li>
<li><strong>The real payoff is style switching.</strong> APA today, IEEE for a conference paper, Harvard for another course. Reformatting 40 references by hand is an evening; with a reference manager it is a dropdown. That single capability justifies the setup cost.</li>
<li><strong>FPTU note.</strong> Start a library in semester 1 and keep adding to it. By capstone you will have several hundred sources that are searchable, deduplicated and instantly citable — while classmates start a fresh folder for every course.</li>
</ul>
<p class="pitfall">⚠️ Do not let the tool make the intellectual decisions. It cannot tell you whether a source is credible, whether this sentence needs a citation, or whether your paraphrase is far enough from the original. It is a typist with a perfect memory, not a co-author.</p>`,
        `<p class="y-chinh">🎯 Bốn gạch đầu dòng, và đó là định nghĩa CHỨC NĂNG đầy đủ của loại công cụ này: nó <strong>quản lý file và tài liệu tham khảo</strong>, <strong>tự động sinh thư mục và danh mục tài liệu</strong>, <strong>nối thẳng vào trình soạn thảo văn bản</strong>, và <strong>tiết kiệm thời gian &amp; bảo đảm chính xác</strong>.</p>
<table>
<tr><th>Tính năng trên slide</th><th>Nó thay cho việc gì</th><th>Vì sao nó quan trọng với bạn</th></tr>
<tr><td>Quản lý file và tài liệu</td><td>Một thư mục PDF tên "paper(3).pdf"</td><td>Mỗi PDF gắn với bản ghi siêu dữ liệu của chính nó, tìm được theo tác giả hay từ khoá</td></tr>
<tr><td>Tự sinh thư mục &amp; danh mục</td><td>Gõ tay từng dấu chấm phẩy theo APA</td><td>Đổi APA → IEEE thành một ô chọn, không phải viết lại</td></tr>
<tr><td>Nối thẳng vào trình soạn thảo</td><td>Chép-dán trích dẫn vào Word</td><td>Chèn một trích dẫn là danh mục tự cập nhật và tự sắp lại ngay</td></tr>
<tr><td>Tiết kiệm thời gian &amp; chính xác</td><td>Dò lại 30 mục lúc 1 giờ sáng</td><td>Bảo đảm nhất quán — mọi mục đều dựng bằng cùng một luật</td></tr>
</table>
<ul>
<li><strong>"Bảo đảm chính xác" cần một dấu sao thành thật.</strong> Công cụ bảo đảm ĐỊNH DẠNG nhất quán, không bảo đảm DỮ LIỆU đúng. Nếu siêu dữ liệu nó cào về ghi tác giả là "J. Smith" trong khi bài báo ghi "Smith, J. A." thì kết quả in ra đẹp đẽ và SAI. Luôn liếc lại một bản ghi vừa nhập trước khi tin nó.</li>
<li><strong>Plug-in cho trình soạn thảo mới là tính năng đổi HÀNH VI của bạn.</strong> Không có nó, việc trích dẫn thấy tốn kém nên bạn hoãn tới cuối rồi làm vội. Có nó, trích dẫn tốn hai cú nhấp giữa câu — nên bạn thật sự trích NGAY LÚC VIẾT, và đó chính là thói quen chặn đạo văn vô tình.</li>
<li><strong>Gạch đầu dòng 1 lớn hơn vẻ ngoài của nó.</strong> "Quản lý file" nghĩa là chính file PDF nằm TRONG thư viện, gắn vào bản ghi của nó. Bài bạn đọc, chỗ bạn tô sáng, và dữ liệu trích dẫn thôi nằm ở ba đống rời nhau.</li>
<li><strong>Phần thưởng thật nằm ở việc ĐỔI KIỂU TRÍCH DẪN.</strong> Hôm nay APA, mai IEEE cho bài hội thảo, môn khác lại Harvard. Định dạng lại 40 tài liệu bằng tay mất cả buổi tối; với phần mềm nó là một ô chọn. Riêng khả năng đó đã bù đủ công cài đặt.</li>
<li><strong>Ghi chú cho FPTU.</strong> Hãy lập thư viện ngay kỳ 1 và cứ bồi vào. Tới đồ án tốt nghiệp bạn sẽ có vài trăm nguồn tìm được, đã khử trùng lặp, trích được tức thì — trong khi bạn cùng lớp lại mở một thư mục mới cho từng môn.</li>
</ul>
<p class="pitfall">⚠️ Đừng để công cụ quyết định giúp những việc thuộc về TRÍ TUỆ. Nó không nói được nguồn này có đáng tin không, câu này có cần trích dẫn không, hay bản diễn giải của bạn đã đủ xa bản gốc chưa. Nó là một người đánh máy có trí nhớ hoàn hảo, không phải đồng tác giả.</p>`],

      [93, 'Referencing software comparison chart — EndNote vs Mendeley vs Zotero (the deck\'s only white slide)',
        `<p class="y-chinh">🎯 The section's payload: a nine-row comparison chart from the University of Sydney Centre for English Teaching. It is the only white-background slide in this whole stretch, and the only slide here that carries hard facts you could be asked to recall.</p>
<table>
<tr><th></th><th>EndNote</th><th>Mendeley</th><th>Zotero</th></tr>
<tr><td><strong>Cost</strong></td><td>Not Free (Universities sometimes have a license for all students)</td><td>Free</td><td>Free</td></tr>
<tr><td><strong>Automatically generate bibliographies</strong></td><td>✔</td><td>✔</td><td>✔</td></tr>
<tr><td><strong>Plug-in for in-text referencing</strong></td><td>✔ Word (Microsoft and Mac) and Apple Pages</td><td>✔ Word (Microsoft and Mac)</td><td>✔ Word (Microsoft and Mac)</td></tr>
<tr><td><strong>Collaborative</strong></td><td>✔</td><td>✔</td><td>✔</td></tr>
<tr><td><strong>Capture bibliographic data</strong></td><td>✔ most databases have an "endnote" import button</td><td>✔ automatic scraping for PDF files, but can add sources manually fairly easily</td><td>✔ imports data from websites and pdfs</td></tr>
<tr><td><strong>Access from anywhere</strong></td><td>Syncing through web-application, desktop application <em>(no tick on the chart)</em></td><td>✔ Website, desktop application and iPhone/iPad/Android app</td><td>Firefox add-on, desktop application and iPhone/iPad/Android app <em>(no tick on the chart)</em></td></tr>
<tr><td><strong>Storage</strong></td><td>1GB</td><td>2GB</td><td>300MB</td></tr>
<tr><td><strong>Renames files</strong></td><td>No</td><td>✔</td><td>Partly</td></tr>
<tr><td><strong>Compatible with</strong></td><td>Windows, OS X and Linux</td><td>Windows, OS X and Linux</td><td>Windows, OS X and Linux</td></tr>
</table>
<ul>
<li><strong>Read the chart by DIFFERENCES, because four rows are identical.</strong> All three generate bibliographies, all three have a Word plug-in, all three are collaborative, all three run on Windows, OS X and Linux. Those rows can never be the answer to "which one…". The rows that actually separate them are <strong>cost, storage, renaming files, and access from anywhere</strong>.</li>
<li><strong>The four facts most likely to be tested.</strong> EndNote is the only one that is <em>not free</em>. Mendeley has the <em>most storage</em> (2GB) and is the only one that fully <em>renames files</em>. Zotero has the <em>least storage</em> (300MB) and renames only <em>partly</em>. Learn those four and you can answer almost any question drawn from this chart.</li>
<li><strong>Only EndNote supports Apple Pages.</strong> Every plug-in row mentions Word for Microsoft and Mac; EndNote alone adds Apple Pages. It is a small detail, which is exactly the kind of thing a multiple-choice writer reaches for.</li>
<li><strong>Two cells deliberately have no tick.</strong> "Access from anywhere" is ticked for Mendeley only, even though the EndNote and Zotero cells describe syncing and mobile apps. The chart reflects a judgement made at the time it was drawn — report what the chart says, do not silently "fix" it.</li>
<li><strong>Storage is smaller than it sounds.</strong> 300MB of PDFs is roughly 100–300 articles; 2GB is a few thousand. Library <em>records</em> cost almost nothing — it is attached PDFs that eat the quota. Keeping the record and dropping the attachment is the standard trick when you run out.</li>
</ul>
<p class="dap-an">✅ Sample question and answer. "A student has no budget, a Mac, and thousands of PDFs to organise and rename automatically. Which tool best fits?" → <strong>Mendeley</strong>: free, largest storage (2GB), the only full "renames files", and a Word (Microsoft and Mac) plug-in.</p>
<p class="meo">💡 Memory hook for the storage row: <strong>1 — 2 — 0,3 GB</strong> in the chart's left-to-right order EndNote · Mendeley · Zotero. The free tool with the most space is Mendeley; the free tool with the least is Zotero.</p>`,
        `<p class="y-chinh">🎯 Phần ruột của tiểu mục: bảng so sánh chín dòng của University of Sydney Centre for English Teaching. Đây là slide nền TRẮNG duy nhất trong cả đoạn này, và cũng là slide duy nhất ở đây mang dữ kiện cứng có thể bị hỏi thuộc.</p>
<table>
<tr><th></th><th>EndNote</th><th>Mendeley</th><th>Zotero</th></tr>
<tr><td><strong>Chi phí</strong></td><td>KHÔNG miễn phí (trường đôi khi mua bản quyền cho toàn bộ sinh viên)</td><td>Miễn phí</td><td>Miễn phí</td></tr>
<tr><td><strong>Tự sinh thư mục tài liệu</strong></td><td>✔</td><td>✔</td><td>✔</td></tr>
<tr><td><strong>Plug-in trích dẫn trong bài</strong></td><td>✔ Word (Microsoft và Mac) và Apple Pages</td><td>✔ Word (Microsoft và Mac)</td><td>✔ Word (Microsoft và Mac)</td></tr>
<tr><td><strong>Cộng tác nhóm</strong></td><td>✔</td><td>✔</td><td>✔</td></tr>
<tr><td><strong>Thu siêu dữ liệu</strong></td><td>✔ phần lớn CSDL có nút nhập "endnote"</td><td>✔ tự cào từ file PDF, nhưng thêm tay cũng khá dễ</td><td>✔ nhập dữ liệu từ website và pdf</td></tr>
<tr><td><strong>Truy cập từ mọi nơi</strong></td><td>Đồng bộ qua bản web, bản máy tính <em>(bảng KHÔNG đánh dấu ✔)</em></td><td>✔ Website, bản máy tính và app iPhone/iPad/Android</td><td>Tiện ích Firefox, bản máy tính và app iPhone/iPad/Android <em>(bảng KHÔNG đánh dấu ✔)</em></td></tr>
<tr><td><strong>Dung lượng lưu trữ</strong></td><td>1GB</td><td>2GB</td><td>300MB</td></tr>
<tr><td><strong>Đổi tên file</strong></td><td>Không</td><td>✔</td><td>Một phần</td></tr>
<tr><td><strong>Chạy trên</strong></td><td>Windows, OS X và Linux</td><td>Windows, OS X và Linux</td><td>Windows, OS X và Linux</td></tr>
</table>
<ul>
<li><strong>Đọc bảng theo chỗ KHÁC NHAU, vì bốn dòng giống hệt nhau.</strong> Cả ba đều sinh thư mục tài liệu, đều có plug-in Word, đều cộng tác được, đều chạy Windows/OS X/Linux. Những dòng đó không bao giờ là đáp án cho câu "cái nào…". Dòng thật sự tách chúng ra là <strong>chi phí, dung lượng, đổi tên file, và truy cập từ mọi nơi</strong>.</li>
<li><strong>Bốn dữ kiện dễ ra đề nhất.</strong> EndNote là cái duy nhất <em>không miễn phí</em>. Mendeley có <em>dung lượng lớn nhất</em> (2GB) và là cái duy nhất <em>đổi tên file</em> trọn vẹn. Zotero có <em>dung lượng nhỏ nhất</em> (300MB) và chỉ đổi tên <em>một phần</em>. Thuộc bốn cái đó là trả lời được gần như mọi câu rút ra từ bảng này.</li>
<li><strong>Chỉ EndNote hỗ trợ Apple Pages.</strong> Mọi ô ở dòng plug-in đều ghi Word cho Microsoft và Mac; riêng EndNote thêm Apple Pages. Một chi tiết nhỏ, và đó đúng là loại chi tiết người ra đề trắc nghiệm hay với tay lấy.</li>
<li><strong>Hai ô CỐ Ý không có dấu ✔.</strong> Dòng "truy cập từ mọi nơi" chỉ đánh dấu cho Mendeley, dù ô của EndNote và Zotero vẫn mô tả đồng bộ và app di động. Bảng phản ánh đánh giá tại thời điểm nó được vẽ — hãy thuật đúng cái bảng nói, đừng âm thầm "sửa hộ".</li>
<li><strong>Dung lượng nhỏ hơn bạn tưởng.</strong> 300MB PDF vào khoảng 100–300 bài; 2GB thì vài nghìn. Bản GHI trong thư viện gần như không tốn gì — thứ ngốn hạn mức là file PDF đính kèm. Giữ bản ghi và bỏ file đính kèm là mẹo chuẩn khi hết chỗ.</li>
</ul>
<p class="dap-an">✅ Câu hỏi mẫu và đáp án. "Một sinh viên không có ngân sách, dùng máy Mac, có hàng nghìn file PDF cần sắp xếp và đổi tên tự động. Công cụ nào hợp nhất?" → <strong>Mendeley</strong>: miễn phí, dung lượng lớn nhất (2GB), là cái duy nhất "đổi tên file" trọn vẹn, và có plug-in Word (Microsoft và Mac).</p>
<p class="meo">💡 Mẹo nhớ dòng dung lượng: <strong>1 — 2 — 0,3 GB</strong> theo đúng thứ tự trái sang phải của bảng EndNote · Mendeley · Zotero. Công cụ miễn phí rộng nhất là Mendeley; miễn phí chật nhất là Zotero.</p>`],

      [94, '5.1a Copyright (opens Module 5 — intellectual property and licensing)',
        `<p class="y-chinh">🎯 Module 5 begins. Three objectives: <strong>gain a basic understanding of intellectual property in relation to university students</strong>, <strong>understand new forms of licensing for online content (e.g. Creative Commons)</strong>, and <strong>apply new forms of licensing to your own work</strong>.</p>
<ul>
<li><strong>The shift in the question being asked.</strong> Module 4 asked "have you given credit?" — an ethical and academic question. Module 5 asks "do you have permission?" — a legal question. Citing a photo correctly satisfies academic integrity and still leaves you infringing copyright if you had no right to use it. Two separate tests, both must pass.</li>
<li><strong>Copyright is automatic and unregistered.</strong> The moment a work is fixed in material form — a photo taken, a blog post saved, a source file committed — copyright exists. No © symbol, no registration, no fee. Consequence: <em>"there was no copyright notice on it" is not a defence.</em> Assume everything online is protected unless it says otherwise.</li>
<li><strong>Objective 3 is the one students overlook.</strong> "Apply new forms of licensing to <em>your own</em> work." You are a copyright owner too — your assignments, your photos, your repositories. Choosing a licence is how you decide what others may do with them, and doing nothing means "all rights reserved" by default.</li>
<li><strong>What copyright does NOT cover.</strong> Facts, ideas, methods and titles are not protected — the <em>expression</em> of them is. That is exactly why paraphrasing is legal where copying is not, and why an idea can be free to reuse while still requiring citation for academic integrity.</li>
<li><strong>Link to CSI106 Chapter 12.</strong> That chapter covers copyright, ethics and privacy from the computing side: software licensing, patents, trade secrets, the ethics of data collection. This module is the same terrain approached as a user and creator of content rather than a systems designer — worth revising the two together.</li>
</ul>
<table>
<tr><th>Protected by copyright</th><th>NOT protected</th></tr>
<tr><td>A photo, a song, a video, an article</td><td>A fact ("Hanoi is the capital")</td></tr>
<tr><td>Source code as written</td><td>The algorithm's underlying idea</td></tr>
<tr><td>A diagram you drew</td><td>The data plotted in it</td></tr>
<tr><td>A blog post</td><td>Its title alone, or a short slogan</td></tr>
</table>
<p class="pitfall">⚠️ Two myths to kill now: "it is on Google Images so it is free" and "I credited the photographer so it is legal". Credit answers plagiarism; it does not answer copyright. Permission — through a licence or an exception — is what makes use lawful.</p>`,
        `<p class="y-chinh">🎯 Module 5 bắt đầu. Ba chuẩn đầu ra: <strong>hiểu căn bản về sở hữu trí tuệ ở góc độ sinh viên đại học</strong>, <strong>hiểu các hình thức cấp phép mới cho nội dung trực tuyến (ví dụ Creative Commons)</strong>, và <strong>áp dụng các hình thức cấp phép mới cho chính tác phẩm của mình</strong>.</p>
<ul>
<li><strong>Câu hỏi được đặt ra đã ĐỔI.</strong> Module 4 hỏi "bạn đã ghi công chưa?" — câu hỏi đạo đức và học thuật. Module 5 hỏi "bạn có được PHÉP không?" — câu hỏi pháp lý. Trích dẫn đúng một tấm ảnh thì thoả liêm chính học thuật nhưng vẫn có thể đang xâm phạm bản quyền nếu bạn không có quyền dùng nó. Hai phép thử riêng, phải qua CẢ HAI.</li>
<li><strong>Bản quyền phát sinh TỰ ĐỘNG, không cần đăng ký.</strong> Ngay khi tác phẩm định hình dưới dạng vật chất — chụp xong tấm ảnh, lưu bài blog, commit một file mã — bản quyền đã tồn tại. Không cần ký hiệu ©, không cần đăng ký, không mất phí. Hệ quả: <em>"nó không ghi bản quyền" KHÔNG phải là lý lẽ bào chữa.</em> Cứ coi mọi thứ trên mạng là được bảo hộ trừ khi nó nói khác.</li>
<li><strong>Chuẩn đầu ra thứ 3 là cái sinh viên hay bỏ qua.</strong> "Áp dụng hình thức cấp phép mới cho <em>chính tác phẩm của bạn</em>." Bạn CŨNG là chủ bản quyền — bài tập của bạn, ảnh của bạn, repo của bạn. Chọn giấy phép là cách bạn quyết định người khác được làm gì với chúng, và không làm gì cả thì mặc định là "giữ toàn bộ quyền".</li>
<li><strong>Bản quyền KHÔNG bảo hộ cái gì.</strong> Sự kiện, ý tưởng, phương pháp và nhan đề thì không được bảo hộ — thứ được bảo hộ là <em>CÁCH THỂ HIỆN</em> chúng. Đó đúng là lý do diễn giải thì hợp pháp còn chép thì không, và vì sao một ý tưởng có thể tự do dùng lại mà vẫn phải trích nguồn vì liêm chính học thuật.</li>
<li><strong>Nối sang CSI106 chương 12.</strong> Chương đó bàn bản quyền, đạo đức và quyền riêng tư từ phía máy tính: giấy phép phần mềm, bằng sáng chế, bí mật kinh doanh, đạo đức thu thập dữ liệu. Module này đi trên cùng địa hình nhưng từ tư cách NGƯỜI DÙNG và NGƯỜI SÁNG TẠO nội dung thay vì người thiết kế hệ thống — nên ôn hai phần cùng nhau.</li>
</ul>
<table>
<tr><th>Được bản quyền bảo hộ</th><th>KHÔNG được bảo hộ</th></tr>
<tr><td>Một tấm ảnh, bài hát, video, bài báo</td><td>Một sự kiện ("Hà Nội là thủ đô")</td></tr>
<tr><td>Mã nguồn như đã viết ra</td><td>Ý tưởng thuật toán nằm bên dưới</td></tr>
<tr><td>Sơ đồ bạn tự vẽ</td><td>Dữ liệu vẽ nên sơ đồ đó</td></tr>
<tr><td>Một bài blog</td><td>Riêng cái tiêu đề, hay một khẩu hiệu ngắn</td></tr>
</table>
<p class="pitfall">⚠️ Hai lầm tưởng cần giết ngay: "nó nằm trên Google Images nên nó miễn phí" và "tôi đã ghi tên nhiếp ảnh gia nên hợp pháp". Ghi công trả lời cho ĐẠO VĂN; nó không trả lời cho BẢN QUYỀN. Thứ làm việc sử dụng hợp pháp là SỰ CHO PHÉP — qua giấy phép, hoặc qua một ngoại lệ.</p>`],

      [95, 'Summary: Copyright and Licensing — a moral and economic right (WIPO, 2016a)',
        `<p class="y-chinh">🎯 The whole of copyright compressed into two questions. <strong>What is it?</strong> — "A moral and economic right" that "governs our ability to use a work that someone owns the copyright to". <strong>When can you use a copyrighted work?</strong> — "When you have permission" or "When there is an exception". Adapted from the World Intellectual Property Organization (2016a).</p>
<table>
<tr><th>The two halves of the right</th><th>What it protects</th><th>Can it be sold?</th></tr>
<tr><td><strong>Moral right</strong></td><td>To be named as the author, and to have the work not distorted or mistreated</td><td>No — it stays with the creator</td></tr>
<tr><td><strong>Economic right</strong></td><td>To copy, publish, adapt, perform and license the work for money</td><td>Yes — it can be sold or transferred</td></tr>
</table>
<ul>
<li><strong>Two halves explains a lot of real situations.</strong> An author who sells the economic right to a publisher must still be named as author — that is the moral right, and it survives the sale. It is also why an employer may own the code you wrote at work while you remain the person who wrote it.</li>
<li><strong>"Governs our ABILITY TO USE" is the phrase to remember.</strong> Copyright is not primarily about punishing — it is the rule that decides what you may do with something you did not make. Every question in this module reduces to it.</li>
<li><strong>Only TWO doors, and the slide names both.</strong> <em>Permission</em> — the owner has said yes, either personally or in advance through a licence (which is exactly what Creative Commons is). <em>Exception</em> — the law itself allows a use without asking: quotation, criticism and review, research and study, news reporting. This is called fair dealing in Australia and the UK, fair use in the US; Vietnam's Intellectual Property Law has its own list of permitted uses.</li>
<li><strong>Academic quoting lives in the "exception" door.</strong> That is why slides 85–88 are not a copyright problem: quoting a short passage for study and criticism, with attribution, is a recognised exception almost everywhere. Copying an entire chapter for your report is not.</li>
<li><strong>FPTU application.</strong> Before dropping an image, a font, a music track or a code library into an assignment, ask the slide's own question: do I have permission (a licence), or is there an exception? If neither answer is yes, find a replacement — slide 97 says where.</li>
</ul>
<p class="dap-an">✅ Likely exam item: "When may you use a copyrighted work?" → <strong>When you have permission, OR when there is an exception.</strong> Two conditions, either one is enough, and "when you cite it" is NOT one of them.</p>
<p class="meo">💡 Mnemonic: copyright = <strong>moral + economic</strong>; use = <strong>permission or exception</strong>. Four words carry the whole slide.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ chuyện bản quyền nén vào hai câu hỏi. <strong>Nó là gì?</strong> — "Một quyền TINH THẦN và KINH TẾ", nó "chi phối khả năng chúng ta sử dụng một tác phẩm mà người khác đang giữ bản quyền". <strong>Khi nào bạn được dùng tác phẩm có bản quyền?</strong> — "Khi bạn CÓ PHÉP" hoặc "Khi có NGOẠI LỆ". Phỏng theo World Intellectual Property Organization (2016a).</p>
<table>
<tr><th>Hai nửa của quyền</th><th>Nó bảo vệ điều gì</th><th>Bán được không?</th></tr>
<tr><td><strong>Quyền tinh thần (moral)</strong></td><td>Được đứng tên tác giả, và tác phẩm không bị bóp méo hay xúc phạm</td><td>Không — luôn ở lại với người sáng tạo</td></tr>
<tr><td><strong>Quyền kinh tế (economic)</strong></td><td>Được sao chép, xuất bản, chuyển thể, biểu diễn và cấp phép để lấy tiền</td><td>Có — bán hoặc chuyển nhượng được</td></tr>
</table>
<ul>
<li><strong>Chia hai nửa giải thích được rất nhiều tình huống thật.</strong> Tác giả bán quyền kinh tế cho nhà xuất bản thì vẫn phải được ghi tên tác giả — đó là quyền tinh thần, và nó sống sót qua vụ mua bán. Đó cũng là lý do công ty có thể sở hữu đoạn mã bạn viết lúc đi làm trong khi bạn vẫn là người đã viết ra nó.</li>
<li><strong>Cụm cần thuộc là "chi phối KHẢ NĂNG SỬ DỤNG".</strong> Bản quyền trước hết không phải để trừng phạt — nó là luật quyết định bạn được làm gì với thứ mình không tạo ra. Mọi câu hỏi của module này đều quy về đó.</li>
<li><strong>Chỉ có HAI CÁNH CỬA, và slide gọi tên cả hai.</strong> <em>Được phép</em> — chủ sở hữu đã đồng ý, hoặc trực tiếp, hoặc đồng ý TRƯỚC qua một giấy phép (đó đúng là Creative Commons). <em>Ngoại lệ</em> — chính luật cho phép dùng mà không cần hỏi: trích dẫn, phê bình và điểm sách, nghiên cứu và học tập, đưa tin. Cái này gọi là fair dealing ở Úc và Anh, fair use ở Mỹ; Luật Sở hữu trí tuệ Việt Nam cũng có danh sách các trường hợp sử dụng không phải xin phép của riêng mình.</li>
<li><strong>Trích dẫn học thuật đi qua cửa "ngoại lệ".</strong> Vì thế slide 85–88 không phải là vấn đề bản quyền: trích một đoạn ngắn để học tập và phê bình, có ghi nguồn, là ngoại lệ được công nhận gần như ở mọi nơi. Chép nguyên một chương vào báo cáo thì KHÔNG.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trước khi thả một tấm ảnh, một bộ phông chữ, một bản nhạc hay một thư viện mã vào bài tập, hãy hỏi đúng câu của slide: tôi có phép (có giấy phép) không, hay có ngoại lệ không? Không cái nào đúng thì đi tìm thứ thay thế — slide 97 chỉ chỗ.</li>
</ul>
<p class="dap-an">✅ Câu dễ ra đề: "Khi nào được dùng một tác phẩm có bản quyền?" → <strong>Khi CÓ PHÉP, HOẶC khi có NGOẠI LỆ.</strong> Hai điều kiện, chỉ cần một là đủ, và "khi đã trích nguồn" KHÔNG nằm trong đó.</p>
<p class="meo">💡 Câu thần chú: bản quyền = <strong>tinh thần + kinh tế</strong>; được dùng = <strong>có phép hoặc có ngoại lệ</strong>. Bốn chữ gánh trọn cả slide.</p>`],

      [96, '5.1b Creative Commons Licensing — the six licences and CC0',
        `<p class="y-chinh">🎯 The same three Module 5 objectives, now heading the Creative Commons sub-section. Creative Commons is the practical answer to the "permission" door of slide 95: <strong>permission granted in advance, in writing, to everybody</strong>, so nobody has to email the author.</p>
<ul>
<li><strong>The system is built from four blocks.</strong> <strong>BY</strong> = you must credit the author. <strong>SA</strong> (ShareAlike) = anything you build on it must carry the same licence. <strong>NC</strong> (NonCommercial) = no commercial use. <strong>ND</strong> (NoDerivatives) = no modified versions. Combine them and you get the six licences — and note that SA and ND can never appear together, because one governs derivatives and the other forbids them.</li>
</ul>
<table>
<tr><th>Licence</th><th>You MAY</th><th>You MAY NOT</th><th>Typical use</th></tr>
<tr><td><strong>CC BY</strong></td><td>Copy, modify, remix, use commercially — just credit the author</td><td>Omit the attribution</td><td>The most open licence; open textbooks, open-access journals</td></tr>
<tr><td><strong>CC BY-SA</strong></td><td>Everything CC BY allows</td><td>Release your derivative under a stricter licence</td><td>Wikipedia; anything meant to stay open forever</td></tr>
<tr><td><strong>CC BY-ND</strong></td><td>Copy and redistribute whole and unchanged, even commercially</td><td>Crop, edit, translate, remix, or excerpt into a new work</td><td>Reports, position statements — texts that must not be altered</td></tr>
<tr><td><strong>CC BY-NC</strong></td><td>Copy, modify, remix — for non-commercial purposes</td><td>Any commercial use, including ads on the page</td><td>Teaching material the author does not want resold</td></tr>
<tr><td><strong>CC BY-NC-SA</strong></td><td>Modify and share non-commercially</td><td>Commercial use; releasing derivatives under another licence</td><td>Community course material, non-profit OER</td></tr>
<tr><td><strong>CC BY-NC-ND</strong></td><td>Download and share unchanged, non-commercially, with credit</td><td>Modify anything; any commercial use</td><td>The most restrictive of the six — preprints, portfolios</td></tr>
<tr><td><strong>CC0</strong></td><td>Anything at all — the creator waived their rights (public domain)</td><td>Nothing is forbidden legally</td><td>Datasets, public-domain photo banks. <em>Academic citation is still expected.</em></td></tr>
</table>
<ul>
<li><strong>How to read any licence code in two seconds.</strong> Start from "you can do everything, with credit" and subtract: every extra suffix removes a freedom. BY is the floor (all six include it); each of NC, ND, SA narrows the deal further.</li>
<li><strong>CC0 is NOT a licence in the same sense.</strong> It is a waiver — the creator gives the work to the public domain. Legally you owe nothing, not even attribution. Academically you still cite it, because citation and copyright are different systems (see slide 95).</li>
<li><strong>The distinction the exam loves: ND versus SA.</strong> ND says "do not change it at all". SA says "change it freely, but your version must stay just as open". They are opposite philosophies, and they can never be combined in the same licence.</li>
<li><strong>Open-source software licences are the same story with different names.</strong> <strong>MIT</strong> and <strong>Apache-2.0</strong> behave like CC BY — do what you like, keep the notice. <strong>GPL</strong> behaves like CC BY-SA — derivatives must stay under GPL, which is why it is called "copyleft". If your capstone links a GPL library into a product you intend to sell, that is a real decision, not a formality.</li>
</ul>
<p class="pitfall">⚠️ "Non-commercial" is broader than students expect. A YouTube video with ads, a paid workshop, a startup demo day — all commercial. If any money touches the project, treat NC material as off-limits.</p>`,
        `<p class="y-chinh">🎯 Vẫn ba chuẩn đầu ra của Module 5, giờ đứng đầu tiểu mục Creative Commons. Creative Commons là câu trả lời thực dụng cho cánh cửa "có phép" ở slide 95: <strong>sự cho phép được cấp TRƯỚC, bằng văn bản, cho TẤT CẢ MỌI NGƯỜI</strong>, để không ai phải đi email hỏi tác giả.</p>
<ul>
<li><strong>Hệ thống dựng từ BỐN viên gạch.</strong> <strong>BY</strong> = phải ghi công tác giả. <strong>SA</strong> (ShareAlike) = thứ bạn làm ra từ nó phải mang CÙNG giấy phép. <strong>NC</strong> (NonCommercial) = không dùng cho mục đích thương mại. <strong>ND</strong> (NoDerivatives) = không được tạo bản sửa đổi. Ghép lại ra sáu giấy phép — và để ý SA với ND KHÔNG BAO GIỜ đi cùng nhau, vì một cái quản bản phái sinh còn cái kia cấm hẳn bản phái sinh.</li>
</ul>
<table>
<tr><th>Giấy phép</th><th>ĐƯỢC làm gì</th><th>KHÔNG được làm gì</th><th>Dùng cho việc gì</th></tr>
<tr><td><strong>CC BY</strong></td><td>Sao chép, sửa, phối lại, dùng thương mại — chỉ cần ghi công tác giả</td><td>Bỏ phần ghi công</td><td>Giấy phép mở nhất; giáo trình mở, tạp chí truy cập mở</td></tr>
<tr><td><strong>CC BY-SA</strong></td><td>Mọi thứ CC BY cho phép</td><td>Phát hành bản phái sinh dưới giấy phép chặt hơn</td><td>Wikipedia; thứ muốn giữ mở mãi mãi</td></tr>
<tr><td><strong>CC BY-ND</strong></td><td>Sao chép và phát lại NGUYÊN VẸN, kể cả thương mại</td><td>Cắt, sửa, dịch, phối lại, hay trích vào tác phẩm mới</td><td>Báo cáo, tuyên bố quan điểm — văn bản không được phép sửa</td></tr>
<tr><td><strong>CC BY-NC</strong></td><td>Sao chép, sửa, phối lại — cho mục đích PHI thương mại</td><td>Mọi dùng thương mại, kể cả trang có gắn quảng cáo</td><td>Tài liệu giảng dạy tác giả không muốn bị bán lại</td></tr>
<tr><td><strong>CC BY-NC-SA</strong></td><td>Sửa và chia sẻ, phi thương mại</td><td>Dùng thương mại; phát hành phái sinh dưới giấy phép khác</td><td>Tài liệu học cộng đồng, OER phi lợi nhuận</td></tr>
<tr><td><strong>CC BY-NC-ND</strong></td><td>Tải về và chia sẻ nguyên vẹn, phi thương mại, có ghi công</td><td>Sửa bất cứ thứ gì; mọi dùng thương mại</td><td>Chặt nhất trong sáu cái — bản thảo, hồ sơ năng lực</td></tr>
<tr><td><strong>CC0</strong></td><td>Làm gì cũng được — tác giả đã TỪ BỎ quyền (phạm vi công cộng)</td><td>Về pháp lý không cấm gì cả</td><td>Tập dữ liệu, kho ảnh phạm vi công cộng. <em>Học thuật thì vẫn phải trích nguồn.</em></td></tr>
</table>
<ul>
<li><strong>Cách đọc bất kỳ mã giấy phép nào trong hai giây.</strong> Xuất phát từ "được làm mọi thứ, chỉ cần ghi công" rồi TRỪ dần: mỗi hậu tố thêm vào lấy đi một quyền tự do. BY là sàn (cả sáu đều có); mỗi cái NC, ND, SA lại bó hẹp thêm.</li>
<li><strong>CC0 KHÔNG phải giấy phép theo nghĩa như trên.</strong> Nó là một sự TỪ BỎ QUYỀN — tác giả trao tác phẩm cho phạm vi công cộng. Về pháp lý bạn không nợ gì, kể cả việc ghi công. Về học thuật thì vẫn phải trích nguồn, vì trích dẫn và bản quyền là hai hệ thống khác nhau (xem slide 95).</li>
<li><strong>Phân biệt mà đề thi mê nhất: ND với SA.</strong> ND nói "đừng đổi gì hết". SA nói "đổi thoải mái, nhưng bản của bạn phải mở y như vậy". Hai triết lý NGƯỢC nhau, và không bao giờ ghép chung trong một giấy phép.</li>
<li><strong>Giấy phép phần mềm mã nguồn mở là CÙNG câu chuyện, khác tên gọi.</strong> <strong>MIT</strong> và <strong>Apache-2.0</strong> hành xử như CC BY — làm gì tuỳ bạn, giữ lại dòng ghi công. <strong>GPL</strong> hành xử như CC BY-SA — bản phái sinh phải ở lại GPL, vì thế nó được gọi là "copyleft". Nếu đồ án của bạn nhúng một thư viện GPL vào sản phẩm định đem bán, đó là một quyết định THẬT, không phải thủ tục.</li>
</ul>
<p class="pitfall">⚠️ "Phi thương mại" rộng hơn sinh viên tưởng. Video YouTube có bật quảng cáo, một buổi workshop thu phí, một buổi demo day của startup — đều là thương mại. Hễ có đồng tiền nào chạm vào dự án thì coi tư liệu NC là vùng cấm.</p>`],

      [97, 'Summary: Creative Commons Licensing — what it is, and what it means for you as a student',
        `<p class="y-chinh">🎯 Two halves. What CC <em>is</em>: "a not-for-profit organization dedicated to making it easier for creators and authors to share their work online", and — crucially — it <strong>does not replace copyright law</strong>. What it means <strong>As a Student</strong>: use CC-licensed photos, videos and other material; if you did not create it or do not own the copyright, understand the licence; and <strong>cite it properly!</strong></p>
<ul>
<li><strong>"Does not replace copyright law" is the sentence that gets tested.</strong> CC sits ON TOP of copyright and works only because copyright exists. A CC licence is the owner exercising their rights by granting permission in advance. Ignore the licence terms and you are back to ordinary infringement — CC did not make the work free of rules, it made the rules readable.</li>
<li><strong>Three student obligations, in order.</strong> (1) Prefer material that carries a licence. (2) READ the licence before using it — NC? ND? SA? (3) Cite it properly. The slide ends on the citation with an exclamation mark because it is the step people drop once they believe the material is "free".</li>
</ul>
<table>
<tr><th>Where to find usable material</th><th>Typical terms</th><th>Watch out for</th></tr>
<tr><td><strong>Unsplash</strong></td><td>Own licence — free use including commercial, credit appreciated not required</td><td>Not CC0 any more; recognisable faces and logos still need care</td></tr>
<tr><td><strong>Pexels</strong></td><td>Free for commercial and non-commercial use, no attribution required</td><td>Do not resell the photo itself as a standalone item</td></tr>
<tr><td><strong>Wikimedia Commons</strong></td><td>Mostly CC BY or CC BY-SA, some public domain</td><td>The licence is PER FILE — check each one, and SA is contagious</td></tr>
<tr><td><strong>Google Images → Tools → Usage rights</strong></td><td>Filters to Creative Commons licences</td><td>The filter is a starting point; always open the source page and confirm</td></tr>
<tr><td><strong>Flickr, Openverse, Pixabay</strong></td><td>Per-item CC licences</td><td>Same rule — read the badge on the individual item</td></tr>
</table>
<ul>
<li><strong>How to attribute a CC image — the TASL habit.</strong> <strong>T</strong>itle, <strong>A</strong>uthor, <strong>S</strong>ource (a link), <strong>L</strong>icence (named, e.g. CC BY-SA 4.0). Example caption: <em>Figure 3. "Hanoi Old Quarter" by A. Nguyen, via Wikimedia Commons, CC BY-SA 4.0.</em> That one line satisfies both the licence and the academic citation.</li>
<li><strong>The same discipline applies to code and to fonts.</strong> A library on npm or PyPI carries a licence file; a font carries one too. IT students hit this earlier and harder than anyone else: MIT/Apache is CC BY, GPL is CC BY-SA, and "no licence file at all" means all rights reserved — the least free option, not the most.</li>
<li><strong>Objective 3 comes back here: license your OWN work.</strong> Putting CC BY on your portfolio site, or an MIT LICENSE file in your GitHub repository, tells recruiters and classmates exactly what they may do. An unlicensed public repo is legally "look but do not touch", which is rarely what the author intended.</li>
<li><strong>Link to CSI106 Chapter 12.</strong> Same subject from the computing side — software licensing, patents, privacy and professional ethics. Revising the two together is efficient, because the multiple-choice questions overlap heavily.</li>
</ul>
<p class="dap-an">✅ Situation: you need a photo for a SWP391 report and find one on Google Images with no licence information. <strong>Correct action:</strong> do not use it. Re-search with the usage-rights filter, or go to Pexels/Unsplash/Wikimedia, pick a licensed image, check the terms, and caption it with title, author, source and licence.</p>
<p class="meo">💡 Three-word summary of the student half of this slide: <strong>use · understand · cite</strong>. If an option says CC material "does not need to be cited", it is wrong — that is true of the LICENCE only for CC0, and never true of academic practice.</p>`,
        `<p class="y-chinh">🎯 Hai nửa. CC <em>LÀ GÌ</em>: "một tổ chức phi lợi nhuận với sứ mệnh làm cho việc chia sẻ tác phẩm trực tuyến của người sáng tạo và tác giả dễ hơn", và — điểm mấu chốt — nó <strong>KHÔNG thay thế luật bản quyền</strong>. Nó có nghĩa gì <strong>VỚI TƯ CÁCH SINH VIÊN</strong>: dùng ảnh, video và tư liệu có giấy phép Creative Commons; nếu bạn không tạo ra nó hoặc không giữ bản quyền thì phải HIỂU giấy phép; và <strong>trích dẫn cho đúng!</strong></p>
<ul>
<li><strong>Câu "không thay thế luật bản quyền" chính là câu sẽ bị hỏi.</strong> CC nằm BÊN TRÊN bản quyền và chỉ chạy được vì có bản quyền. Giấy phép CC là việc chủ sở hữu THỰC THI quyền của mình bằng cách cho phép trước. Phớt lờ điều khoản giấy phép là quay lại xâm phạm thông thường — CC không làm tác phẩm hết luật, nó làm cho luật ĐỌC ĐƯỢC.</li>
<li><strong>Ba nghĩa vụ của sinh viên, theo thứ tự.</strong> (1) Ưu tiên tư liệu CÓ giấy phép. (2) ĐỌC giấy phép trước khi dùng — NC? ND? SA? (3) Trích dẫn đàng hoàng. Slide kết ở bước trích dẫn kèm dấu chấm than, vì đó đúng là bước người ta buông ngay khi tin rằng tư liệu là "miễn phí".</li>
</ul>
<table>
<tr><th>Tìm tư liệu dùng được ở đâu</th><th>Điều khoản thường gặp</th><th>Cần coi chừng</th></tr>
<tr><td><strong>Unsplash</strong></td><td>Giấy phép riêng — dùng tự do kể cả thương mại, ghi công được hoan nghênh chứ không bắt buộc</td><td>Không còn là CC0; mặt người và logo nhận diện được thì vẫn phải cẩn thận</td></tr>
<tr><td><strong>Pexels</strong></td><td>Miễn phí cho cả thương mại và phi thương mại, không bắt ghi công</td><td>Đừng bán lại chính tấm ảnh như một món hàng riêng</td></tr>
<tr><td><strong>Wikimedia Commons</strong></td><td>Chủ yếu CC BY hoặc CC BY-SA, một số thuộc phạm vi công cộng</td><td>Giấy phép tính theo TỪNG FILE — phải kiểm từng cái, và SA thì "lây"</td></tr>
<tr><td><strong>Google Images → Tools → Usage rights</strong></td><td>Lọc theo giấy phép Creative Commons</td><td>Bộ lọc chỉ là điểm xuất phát; luôn mở trang nguồn ra xác nhận lại</td></tr>
<tr><td><strong>Flickr, Openverse, Pixabay</strong></td><td>Giấy phép CC theo từng mục</td><td>Cùng một luật — đọc cái huy hiệu giấy phép trên từng mục</td></tr>
</table>
<ul>
<li><strong>Ghi công một ảnh CC thế nào — thói quen TASL.</strong> <strong>T</strong>itle (tên), <strong>A</strong>uthor (tác giả), <strong>S</strong>ource (đường dẫn nguồn), <strong>L</strong>icence (gọi tên giấy phép, ví dụ CC BY-SA 4.0). Ví dụ chú thích: <em>Hình 3. "Hanoi Old Quarter" của A. Nguyen, qua Wikimedia Commons, CC BY-SA 4.0.</em> Một dòng đó thoả cả giấy phép lẫn trích dẫn học thuật.</li>
<li><strong>Cùng kỷ luật đó áp cho MÃ NGUỒN và PHÔNG CHỮ.</strong> Một thư viện trên npm hay PyPI có file giấy phép; một bộ phông cũng vậy. Sinh viên CNTT đụng chuyện này sớm hơn và nặng hơn mọi người: MIT/Apache là CC BY, GPL là CC BY-SA, còn "không có file giấy phép nào" nghĩa là GIỮ TOÀN BỘ QUYỀN — lựa chọn ít tự do nhất, chứ không phải nhiều nhất.</li>
<li><strong>Chuẩn đầu ra số 3 quay lại ở đây: cấp phép cho tác phẩm CỦA BẠN.</strong> Gắn CC BY lên trang portfolio, hay đặt file LICENSE kiểu MIT vào repo GitHub, là nói thẳng với nhà tuyển dụng và bạn học rằng họ được làm gì. Một repo public không có giấy phép, về pháp lý, nghĩa là "nhìn thôi đừng đụng" — hiếm khi đó là ý của tác giả.</li>
<li><strong>Nối sang CSI106 chương 12.</strong> Cùng chủ đề nhìn từ phía máy tính — giấy phép phần mềm, bằng sáng chế, quyền riêng tư và đạo đức nghề nghiệp. Ôn hai phần cùng nhau rất lợi, vì câu trắc nghiệm chồng lên nhau nhiều.</li>
</ul>
<p class="dap-an">✅ Tình huống: bạn cần một tấm ảnh cho báo cáo SWP391 và tìm thấy trên Google Images, không có thông tin giấy phép. <strong>Hành động đúng:</strong> ĐỪNG dùng. Tìm lại bằng bộ lọc usage rights, hoặc sang Pexels/Unsplash/Wikimedia, chọn ảnh có giấy phép, đọc điều khoản, rồi chú thích đủ tên · tác giả · nguồn · giấy phép.</p>
<p class="meo">💡 Tóm nửa "sinh viên" của slide bằng ba chữ: <strong>dùng · hiểu · trích</strong>. Phương án nào bảo tư liệu CC "không cần trích dẫn" là sai — điều đó chỉ đúng với GIẤY PHÉP của riêng CC0, và không bao giờ đúng với thực hành học thuật.</p>`],

      [98, '5.2 Digital Networks for Learning & Research (module objectives)',
        `<p class="y-chinh">🎯 Two objectives: <strong>keep up-to-date with information from relevant sources in your field</strong>, and <strong>develop &amp; use digital networks to advance learning</strong>. This is the section on building a <em>personal learning network</em> — the deliberate version of "following people online".</p>
<ul>
<li><strong>The problem it solves.</strong> Everything you learn from a textbook is at least a year old, and in computing often three. Journals, conference feeds, maintainer blogs and release notes are where a field actually moves. A network is how you receive that movement without having to go looking every day.</li>
<li><strong>"Relevant sources in your field" is the operative phrase.</strong> This is not about being online more; it is about <em>curating</em>. A feed of ten people who actually build the things you study beats a thousand accounts posting hot takes.</li>
<li><strong>Networks are two-directional, which is the part students miss.</strong> You read, but you also ask, answer, and publish. Answering a question badly in public and being corrected is one of the fastest learning loops that exists — and it builds the professional identity that slides 100–103 are about.</li>
<li><strong>Concrete channels for an FPTU IT student.</strong> GitHub (watch the repositories of libraries you use — release notes are a curriculum), Stack Overflow tags, an RSS reader over a handful of engineering blogs, arXiv cs categories, a Discord or Zalo group for your specialisation, LinkedIn for the Vietnamese industry side.</li>
<li><strong>This connects directly back to Module 1–3 of this MOOC.</strong> Evaluating sources, judging credibility and searching effectively were taught earlier; a personal learning network is where you apply them every single day rather than only when an assignment is due.</li>
</ul>
<p class="meo">💡 Do not confuse this section with social media use in general. The exam framing is always <strong>learning and research</strong>: the network exists to keep you current in your field, not to keep you entertained.</p>`,
        `<p class="y-chinh">🎯 Hai chuẩn đầu ra: <strong>cập nhật thông tin từ các nguồn liên quan trong lĩnh vực của mình</strong>, và <strong>xây dựng &amp; dùng mạng số để đẩy việc học đi lên</strong>. Đây là mục về dựng một <em>mạng học tập cá nhân</em> — phiên bản CÓ CHỦ ĐÍCH của việc "theo dõi người ta trên mạng".</p>
<ul>
<li><strong>Vấn đề nó giải quyết.</strong> Mọi thứ bạn học từ giáo trình đều đã ít nhất một năm tuổi, trong ngành máy tính thường là ba. Tạp chí, luồng tin hội thảo, blog của người bảo trì thư viện và ghi chú phát hành mới là nơi ngành thật sự chuyển động. Một mạng lưới là cách bạn NHẬN được chuyển động đó mà không phải ngày nào cũng đi lùng.</li>
<li><strong>Cụm then chốt là "nguồn LIÊN QUAN trong lĩnh vực của bạn".</strong> Đây không phải chuyện lên mạng nhiều hơn; đây là chuyện CHỌN LỌC. Một luồng tin gồm mười người thật sự làm ra thứ bạn đang học ăn đứt một nghìn tài khoản chuyên phán.</li>
<li><strong>Mạng lưới đi HAI CHIỀU, và đây là phần sinh viên bỏ sót.</strong> Bạn đọc, nhưng bạn cũng hỏi, cũng trả lời, cũng công bố. Trả lời sai trước đám đông rồi bị sửa là một trong những vòng học nhanh nhất từng có — và nó dựng lên cái danh tính nghề nghiệp mà slide 100–103 sẽ bàn.</li>
<li><strong>Kênh cụ thể cho sinh viên CNTT ở FPTU.</strong> GitHub (theo dõi repo của những thư viện bạn dùng — ghi chú phát hành chính là một giáo trình), các tag trên Stack Overflow, một trình đọc RSS gom vài blog kỹ thuật, các mục cs trên arXiv, một nhóm Discord hay Zalo theo chuyên ngành, LinkedIn cho mảng doanh nghiệp Việt Nam.</li>
<li><strong>Chỗ này nối thẳng về Module 1–3 của chính MOOC này.</strong> Đánh giá nguồn, phán đoán độ tin cậy và tìm kiếm hiệu quả đã dạy ở trước; mạng học tập cá nhân là nơi bạn dùng chúng MỖI NGÀY chứ không chỉ lúc sắp tới hạn nộp bài.</li>
</ul>
<p class="meo">💡 Đừng lẫn mục này với chuyện dùng mạng xã hội nói chung. Khung đề thi luôn là <strong>HỌC TẬP và NGHIÊN CỨU</strong>: mạng lưới tồn tại để giữ bạn cập nhật trong ngành, không phải để giữ bạn vui.</p>`],

      [99, 'Summary: Developing a Personal Learning Network (Dabbagh & Kitsantis, 2011; Rheingold, 2012)',
        `<p class="y-chinh">🎯 Five instructions, in order: <strong>Find areas of interest</strong> → <strong>Follow writers you like</strong> → <strong>Follow people they follow</strong> → <strong>Prune your network</strong> → <strong>It should be enjoyable!</strong></p>
<table>
<tr><th>Step</th><th>What you do</th><th>Why the order matters</th></tr>
<tr><td>Find areas of interest</td><td>Name 2–4 specific topics, not a whole discipline</td><td>"Backend performance" gives usable search terms; "IT" gives none</td></tr>
<tr><td>Follow writers you like</td><td>Start with a handful whose work you already value</td><td>Quality seeds produce quality recommendations</td></tr>
<tr><td>Follow people they follow</td><td>Expand outward through their networks</td><td>Experts curate each other better than any algorithm does</td></tr>
<tr><td>Prune your network</td><td>Unfollow what has stopped being useful</td><td>Without this step the feed decays into noise and you abandon it</td></tr>
<tr><td>It should be enjoyable!</td><td>Keep it something you want to open</td><td>A network you dread is a network you stop reading</td></tr>
</table>
<ul>
<li><strong>Step 3 is the actual engine.</strong> "Follow people they follow" grows the network through <em>human</em> curation rather than an engagement algorithm. Experts in a niche know who else is worth reading — you inherit years of their filtering for free.</li>
<li><strong>Step 4 is the one nobody does, and it is why most feeds die.</strong> A network is a living thing: interests move, accounts go quiet, someone starts posting about something else entirely. Pruning is maintenance, not disloyalty. Put a 20-minute review in the calendar once a semester.</li>
<li><strong>Step 5 sounds soft but is a design constraint.</strong> Rheingold's point is that attention is voluntary. A network built purely out of duty gets abandoned within weeks, so the one you enjoy and actually keep reading beats the theoretically optimal one you do not.</li>
<li><strong>Why two citations sit under this slide.</strong> Dabbagh &amp; Kitsantis (2011) come from the research on <em>personal learning environments</em> — learner-controlled, self-regulated learning. Rheingold (2012) comes from the practitioner side (<em>Net Smart</em>) — attention and crap detection. The five steps are theory plus practice welded together.</li>
<li><strong>FPTU version of the five steps.</strong> (1) Pick "React performance" and "PostgreSQL indexing", not "web". (2) Follow four maintainers and one researcher. (3) Open their following lists and take five more. (4) Each semester, drop anyone you have not learned from. (5) Keep one fun account in there so you keep opening the app.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: the fourth step is <strong>prune</strong>, not "grow as large as possible". The slide explicitly frames network quality as a matter of curation. Any option praising a bigger follower count is wrong.</p>`,
        `<p class="y-chinh">🎯 Năm chỉ dẫn, đúng thứ tự: <strong>Tìm những mảng mình quan tâm</strong> → <strong>Theo dõi những người viết mình thích</strong> → <strong>Theo dõi những người mà HỌ theo dõi</strong> → <strong>TỈA bớt mạng lưới</strong> → <strong>Nó phải VUI!</strong></p>
<table>
<tr><th>Bước</th><th>Bạn làm gì</th><th>Vì sao thứ tự quan trọng</th></tr>
<tr><td>Tìm mảng quan tâm</td><td>Gọi tên 2–4 chủ đề CỤ THỂ, không phải cả một ngành</td><td>"Hiệu năng backend" cho ra từ khoá dùng được; "CNTT" thì không</td></tr>
<tr><td>Theo dõi người viết mình thích</td><td>Bắt đầu bằng dăm người mà bạn vốn đã quý bài của họ</td><td>Hạt giống tốt sinh ra gợi ý tốt</td></tr>
<tr><td>Theo dõi người mà họ theo dõi</td><td>Toả rộng ra qua mạng lưới của họ</td><td>Chuyên gia lọc lẫn nhau giỏi hơn mọi thuật toán</td></tr>
<tr><td>Tỉa bớt mạng lưới</td><td>Bỏ theo dõi thứ đã hết hữu ích</td><td>Thiếu bước này thì luồng tin mục thành nhiễu và bạn bỏ luôn</td></tr>
<tr><td>Nó phải VUI!</td><td>Giữ nó là thứ bạn MUỐN mở ra</td><td>Mạng lưới mà bạn ngán là mạng lưới bạn ngừng đọc</td></tr>
</table>
<ul>
<li><strong>Bước 3 mới là ĐỘNG CƠ thật.</strong> "Theo dõi người mà họ theo dõi" làm mạng lưới lớn lên bằng chọn lọc của CON NGƯỜI chứ không phải thuật toán tương tác. Chuyên gia trong một ngách biết ai khác đáng đọc — bạn thừa hưởng miễn phí nhiều năm sàng lọc của họ.</li>
<li><strong>Bước 4 là bước không ai làm, và đó là lý do phần lớn luồng tin chết.</strong> Mạng lưới là thứ SỐNG: mối quan tâm dịch chuyển, tài khoản im tiếng, có người quay sang đăng thứ hoàn toàn khác. Tỉa là BẢO TRÌ, không phải bội bạc. Hãy đặt lịch 20 phút rà lại mỗi học kỳ một lần.</li>
<li><strong>Bước 5 nghe mềm nhưng là một RÀNG BUỘC THIẾT KẾ.</strong> Ý của Rheingold là sự chú ý mang tính tự nguyện. Mạng lưới dựng thuần bằng nghĩa vụ sẽ bị bỏ trong vài tuần, nên cái bạn thấy vui và thật sự còn đọc ăn đứt cái tối ưu trên lý thuyết mà bạn không mở.</li>
<li><strong>Vì sao có HAI trích dẫn dưới slide này.</strong> Dabbagh &amp; Kitsantis (2011) đến từ nghiên cứu về <em>môi trường học tập cá nhân</em> — học do người học điều khiển, tự điều chỉnh. Rheingold (2012) đến từ phía thực hành (<em>Net Smart</em>) — sự chú ý và khả năng phát hiện rác. Năm bước này là lý thuyết hàn với thực hành.</li>
<li><strong>Bản FPTU của năm bước.</strong> (1) Chọn "hiệu năng React" và "đánh index PostgreSQL", đừng chọn "web". (2) Theo dõi bốn người bảo trì thư viện và một nhà nghiên cứu. (3) Mở danh sách họ đang theo dõi và lấy thêm năm người. (4) Mỗi học kỳ bỏ những ai bạn không học được gì. (5) Giữ lại một tài khoản vui để bạn còn chịu mở ứng dụng.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề: bước thứ tư là <strong>TỈA BỚT</strong>, không phải "phình to hết cỡ". Slide đóng khung chất lượng mạng lưới ở việc CHỌN LỌC. Phương án nào ca ngợi số người theo dõi lớn là sai.</p>`],

      [100, '5.3a Managing Digital Identity (module objectives)',
        `<p class="y-chinh">🎯 Three objectives: <strong>make informed choices about how you are represented online</strong>, <strong>manage digital identity across different domains (social, academic, professional)</strong>, and <strong>use digital networks to cultivate professional identity</strong>.</p>
<ul>
<li><strong>Digital identity is not what you post — it is what can be FOUND.</strong> It includes what you published, what others tagged you in, what old accounts still hold, and what services expose by default. You do not fully control it, which is exactly why the slide says "manage", not "create".</li>
<li><strong>The three domains, and why they differ.</strong> <em>Social</em> — friends, informal, jokes. <em>Academic</em> — classmates and lecturers, semi-formal, ideas. <em>Professional</em> — recruiters and colleagues, formal, evidence of competence. Each has its own audience, register and acceptable content, and the same photo can be fine in one and damaging in another.</li>
<li><strong>Separate them on purpose, because the internet will not.</strong> Use different accounts, different privacy settings, and a different tone. The common failure is one account doing all three jobs — which means the audience with the highest standards sees the content written for the lowest.</li>
<li><strong>"Cultivate" in objective 3 is deliberate.</strong> A professional identity is grown, slowly and on purpose: a repository with a README, a写 blog post explaining something you learned, an answer to someone's question. None of it happens by accident, and the compounding only starts once you begin.</li>
<li><strong>The FPTU-specific stake.</strong> Vietnamese employers and internship coordinators absolutely search candidate names. For an IT student the search result you most want them to find is a GitHub profile with real commits and a LinkedIn that matches your CV — not an abandoned Facebook album from year 10.</li>
</ul>
<table>
<tr><th>Domain</th><th>Audience</th><th>Register</th><th>Typical platform</th></tr>
<tr><td>Social</td><td>Friends, family</td><td>Informal</td><td>Facebook, Instagram, Zalo</td></tr>
<tr><td>Academic</td><td>Classmates, lecturers</td><td>Semi-formal</td><td>University email, LMS forums, Google Scholar</td></tr>
<tr><td>Professional</td><td>Recruiters, colleagues</td><td>Formal</td><td>LinkedIn, GitHub, a personal site</td></tr>
</table>
<p class="pitfall">⚠️ Note that slides 100 and 102 print these exact same three bullets. The sub-section split is 5.3a "Managing Digital Identity" (audit and control) and 5.3b "Presenting Yourself Online" (build and project) — the objectives do not change, only the emphasis does.</p>`,
        `<p class="y-chinh">🎯 Ba chuẩn đầu ra: <strong>đưa ra lựa chọn có hiểu biết về việc mình được thể hiện thế nào trên mạng</strong>, <strong>quản lý danh tính số qua các miền khác nhau (xã hội, học thuật, nghề nghiệp)</strong>, và <strong>dùng mạng số để BỒI ĐẮP danh tính nghề nghiệp</strong>.</p>
<ul>
<li><strong>Danh tính số không phải thứ bạn ĐĂNG — mà là thứ người ta TÌM ĐƯỢC.</strong> Nó gồm cả thứ bạn đã đăng, thứ người khác gắn thẻ bạn, thứ các tài khoản cũ còn giữ, và thứ dịch vụ mặc định phơi ra. Bạn KHÔNG kiểm soát trọn vẹn nó, nên slide mới dùng chữ "quản lý" chứ không phải "tạo ra".</li>
<li><strong>Ba miền, và vì sao chúng khác nhau.</strong> <em>Xã hội</em> — bạn bè, thân mật, đùa giỡn. <em>Học thuật</em> — bạn học và giảng viên, bán trang trọng, bàn ý tưởng. <em>Nghề nghiệp</em> — nhà tuyển dụng và đồng nghiệp, trang trọng, trưng bằng chứng năng lực. Mỗi miền có khán giả, giọng điệu và nội dung chấp nhận được riêng, và cùng một tấm ảnh có thể vô hại ở miền này mà gây hại ở miền kia.</li>
<li><strong>Hãy TÁCH chúng ra một cách chủ động, vì internet sẽ không tách hộ.</strong> Dùng tài khoản khác nhau, thiết lập riêng tư khác nhau, giọng khác nhau. Lỗi phổ biến là một tài khoản gánh cả ba việc — nghĩa là nhóm khán giả khó tính nhất lại đọc thứ viết cho nhóm dễ tính nhất.</li>
<li><strong>Chữ "bồi đắp" ở chuẩn đầu ra 3 là cố ý.</strong> Danh tính nghề nghiệp được NUÔI, chậm rãi và có chủ đích: một repo có README tử tế, một bài viết giải thích thứ bạn vừa học, một câu trả lời cho thắc mắc của ai đó. Không cái nào xảy ra tình cờ, và lãi kép chỉ bắt đầu từ lúc bạn bắt đầu.</li>
<li><strong>Điều đáng giá riêng ở FPTU.</strong> Nhà tuyển dụng và người điều phối thực tập ở Việt Nam CHẮC CHẮN tra tên ứng viên. Với sinh viên CNTT, kết quả tìm kiếm bạn muốn họ thấy nhất là một hồ sơ GitHub có commit thật và một LinkedIn khớp với CV — không phải album Facebook bỏ hoang từ hồi lớp 10.</li>
</ul>
<table>
<tr><th>Miền</th><th>Khán giả</th><th>Giọng điệu</th><th>Nền tảng thường dùng</th></tr>
<tr><td>Xã hội</td><td>Bạn bè, người thân</td><td>Thân mật</td><td>Facebook, Instagram, Zalo</td></tr>
<tr><td>Học thuật</td><td>Bạn học, giảng viên</td><td>Bán trang trọng</td><td>Email trường, diễn đàn LMS, Google Scholar</td></tr>
<tr><td>Nghề nghiệp</td><td>Nhà tuyển dụng, đồng nghiệp</td><td>Trang trọng</td><td>LinkedIn, GitHub, trang cá nhân</td></tr>
</table>
<p class="pitfall">⚠️ Để ý slide 100 và 102 in Y HỆT ba gạch đầu dòng này. Tiểu mục chia thành 5.3a "Managing Digital Identity" (rà soát và kiểm soát) và 5.3b "Presenting Yourself Online" (xây dựng và phóng chiếu) — chuẩn đầu ra không đổi, chỉ trọng tâm đổi.</p>`],

      [101, 'Summary: Managing Online Identity — know, update, take ownership',
        `<p class="y-chinh">🎯 Three imperatives, and they are a procedure in order: <strong>Know what is on the internet about you</strong> → <strong>Update your privacy settings</strong> → <strong>Take ownership of your online identity</strong>. Audit, then control, then build.</p>
<table>
<tr><th>Step</th><th>Concretely</th><th>How often</th></tr>
<tr><td><strong>Know</strong></td><td>Search your own name — signed out, in a private window — in Google, Bing, Facebook, YouTube, image search. Include name variants and old usernames.</td><td>Once a semester, and before every application</td></tr>
<tr><td><strong>Update</strong></td><td>Review privacy settings per platform: who can see old posts, who can tag you, whether your profile is indexed by search engines, which apps still have access</td><td>Whenever a platform changes its settings — which is often</td></tr>
<tr><td><strong>Take ownership</strong></td><td>Publish things you WANT found: LinkedIn, GitHub, a portfolio page, a technical blog post</td><td>Continuously — this is the long game</td></tr>
</table>
<ul>
<li><strong>Search signed out, or the result is meaningless.</strong> Logged in, Google personalises what you see and you get a flattering, familiar picture. A private window with no account approximates what a recruiter sees — which is the only view that matters here.</li>
<li><strong>"Take ownership" is a positive strategy, not a cleanup.</strong> You often cannot delete what others posted, but you can outrank it. Three or four active, well-named professional profiles will dominate the first page of results for your name. Crowding out is more achievable than erasing.</li>
<li><strong>Privacy settings are a moving target.</strong> Platforms change defaults and add features, and changes usually default to more sharing rather than less. A setting you configured two years ago may no longer mean what you think. Re-check rather than assume.</li>
<li><strong>What recruiters actually look for.</strong> Research on hiring consistently reports two things: screening out (evidence of dishonesty, abusive posts, discriminatory language, badmouthing an employer) and screening in (evidence of skill, communication, real projects). Both effects are real, so both halves of the strategy pay.</li>
<li><strong>For an FPTU IT student, the highest-return single action.</strong> Make your GitHub profile presentable: a real name, a one-line bio, pinned repositories, and a README on each pinned repo saying what it does and how to run it. An unexplained repository proves nothing; an explained one is a portfolio piece.</li>
</ul>
<p class="dap-an">✅ Ten-minute self-audit you can run today. 1) Private window → search your full name, then name + "FPT". 2) Repeat in image search. 3) Open Facebook privacy check-up → limit past posts, turn off tag auto-approve. 4) Google yourself again and note the first three results. 5) If any of them is not something you would show an interviewer, publish something better and link it from your other profiles.</p>
<p class="meo">💡 Remember the slide as three verbs — <strong>know · update · own</strong>. An exam option about "deleting everything you have ever posted" is not what the slide says; the third step is to <em>take ownership</em>, which means producing, not erasing.</p>`,
        `<p class="y-chinh">🎯 Ba mệnh lệnh, và chúng là một quy trình theo thứ tự: <strong>Biết trên internet đang có gì về bạn</strong> → <strong>Cập nhật thiết lập riêng tư</strong> → <strong>LÀM CHỦ danh tính trực tuyến của mình</strong>. Rà soát, rồi kiểm soát, rồi xây dựng.</p>
<table>
<tr><th>Bước</th><th>Cụ thể là gì</th><th>Bao lâu một lần</th></tr>
<tr><td><strong>Biết</strong></td><td>Tự tra tên mình — ĐÃ ĐĂNG XUẤT, trong cửa sổ ẩn danh — trên Google, Bing, Facebook, YouTube, tìm ảnh. Tra cả biến thể tên và tên tài khoản cũ.</td><td>Mỗi học kỳ một lần, và trước mỗi lần nộp hồ sơ</td></tr>
<tr><td><strong>Cập nhật</strong></td><td>Rà thiết lập riêng tư từng nền tảng: ai xem được bài cũ, ai gắn thẻ được bạn, hồ sơ có bị công cụ tìm kiếm lập chỉ mục không, ứng dụng nào còn quyền truy cập</td><td>Mỗi khi nền tảng đổi thiết lập — tức là rất thường xuyên</td></tr>
<tr><td><strong>Làm chủ</strong></td><td>Công bố những thứ bạn MUỐN người ta tìm thấy: LinkedIn, GitHub, trang hồ sơ năng lực, một bài viết kỹ thuật</td><td>Liên tục — đây là ván cờ dài</td></tr>
</table>
<ul>
<li><strong>Phải tra khi ĐÃ ĐĂNG XUẤT, không thì kết quả vô nghĩa.</strong> Lúc đang đăng nhập, Google cá nhân hoá kết quả và bạn nhận về một bức tranh quen thuộc, dễ chịu. Cửa sổ ẩn danh không tài khoản mới xấp xỉ thứ nhà tuyển dụng nhìn thấy — và đó là góc nhìn duy nhất có ý nghĩa ở đây.</li>
<li><strong>"Làm chủ" là chiến lược TIẾN CÔNG, không phải dọn dẹp.</strong> Bạn thường không xoá được thứ người khác đăng, nhưng bạn ĐẨY nó xuống được. Ba bốn hồ sơ nghề nghiệp đang hoạt động, đặt tên tử tế, sẽ chiếm trọn trang kết quả đầu tiên cho tên bạn. Lấn chỗ khả thi hơn xoá sạch.</li>
<li><strong>Thiết lập riêng tư là mục tiêu DI ĐỘNG.</strong> Nền tảng đổi mặc định và thêm tính năng, và các thay đổi thường nghiêng về chia sẻ NHIỀU hơn chứ không ít hơn. Một thiết lập bạn chỉnh hai năm trước có thể đã không còn mang nghĩa bạn tưởng. Hãy kiểm lại thay vì mặc định tin.</li>
<li><strong>Nhà tuyển dụng thật sự tìm gì.</strong> Nghiên cứu về tuyển dụng liên tục báo hai chiều: LOẠI RA (dấu hiệu gian dối, bài xúc phạm, ngôn từ phân biệt, nói xấu nơi làm cũ) và CHỌN VÀO (bằng chứng kỹ năng, khả năng giao tiếp, dự án thật). Cả hai hiệu ứng đều có thật, nên cả hai nửa của chiến lược đều sinh lời.</li>
<li><strong>Với sinh viên CNTT FPTU, một hành động có lãi nhất.</strong> Làm cho hồ sơ GitHub coi được: tên thật, một dòng tiểu sử, ghim vài repo, và mỗi repo ghim có README nói nó làm gì và chạy thế nào. Một repo không lời giải thích chẳng chứng minh điều gì; một repo có giải thích là một sản phẩm trong hồ sơ.</li>
</ul>
<p class="dap-an">✅ Bài tự rà 10 phút làm được ngay hôm nay. 1) Cửa sổ ẩn danh → tra họ tên đầy đủ, rồi tra tên + "FPT". 2) Lặp lại ở phần tìm ảnh. 3) Mở phần kiểm tra riêng tư của Facebook → giới hạn bài cũ, tắt tự động duyệt gắn thẻ. 4) Tra lại tên mình và ghi ra ba kết quả đầu. 5) Nếu có cái nào bạn không dám đưa cho người phỏng vấn xem, hãy công bố thứ tốt hơn và liên kết nó từ các hồ sơ còn lại.</p>
<p class="meo">💡 Nhớ slide bằng ba động từ — <strong>biết · cập nhật · làm chủ</strong>. Phương án nói về "xoá sạch mọi thứ từng đăng" không phải điều slide nói; bước thứ ba là <em>làm chủ</em>, tức là SẢN XUẤT ra, chứ không phải xoá đi.</p>`],

      [102, '5.3b Presenting Yourself Online (module objectives, repeated)',
        `<p class="y-chinh">🎯 The same three objectives as slide 100, now under the constructive heading <strong>Presenting Yourself Online</strong>. Slide 101 was defence (audit, privacy); this half is offence — deciding what you want found and then putting it there.</p>
<ul>
<li><strong>The core idea: a profile is an ARGUMENT, not a form.</strong> Every field is a chance to say "here is what I can do and here is the evidence". Filling fields with job titles and dates is the minimum; the version that works states outcomes and links to proof.</li>
<li><strong>Consistency across platforms is what makes it believable.</strong> Same name, same photo, same one-line description on LinkedIn, GitHub and your CV. A recruiter cross-checking three profiles that agree forms trust; three that disagree raises the question of which one is honest.</li>
<li><strong>Evidence beats adjectives, especially in IT.</strong> "Passionate about backend development" is unfalsifiable and everybody writes it. "Built and deployed a REST API for a 40-user class project, PostgreSQL + Express, code here" is checkable — and checkable claims are the ones that get read.</li>
<li><strong>Build it BEFORE you need it.</strong> A profile assembled the night before an internship deadline shows. One that accumulated over four semesters has real repositories with real commit histories, which is itself evidence of persistence that no adjective can supply.</li>
<li><strong>Vietnamese-context note.</strong> Keep an English profile as well as a Vietnamese one if you want to work for outsourcing companies or international teams; many recruiters search in English. It also forces the concision that slide 103 is about.</li>
</ul>
<table>
<tr><th>Platform</th><th>What it should show</th><th>The commonest mistake</th></tr>
<tr><td>LinkedIn</td><td>Headline, one-paragraph summary, skills, projects, education</td><td>An empty profile with just a school name</td></tr>
<tr><td>GitHub</td><td>Real name, bio, pinned repos, README in each</td><td>Repos full of unmodified tutorial code, no README</td></tr>
<tr><td>Personal site / portfolio</td><td>Three projects explained, a CV, a contact route</td><td>A beautiful landing page with nothing behind it</td></tr>
</table>
<p class="meo">💡 If an exam question asks what "presenting yourself online" means in this MOOC, the answer is <strong>making informed, deliberate choices</strong> about representation across social, academic and professional domains — not "posting more".</p>`,
        `<p class="y-chinh">🎯 Vẫn ba chuẩn đầu ra như slide 100, giờ dưới tiêu đề mang tính xây dựng <strong>Presenting Yourself Online</strong> (thể hiện bản thân trực tuyến). Slide 101 là PHÒNG THỦ (rà soát, riêng tư); nửa này là TẤN CÔNG — quyết định bạn muốn người ta tìm thấy gì rồi đặt nó ở đó.</p>
<ul>
<li><strong>Ý cốt lõi: một hồ sơ là một LẬP LUẬN, không phải một tờ khai.</strong> Mỗi ô là một cơ hội nói "đây là thứ tôi làm được và đây là bằng chứng". Điền chức danh với mốc thời gian là mức tối thiểu; bản có hiệu lực thì nêu KẾT QUẢ và dẫn tới bằng chứng.</li>
<li><strong>Nhất quán giữa các nền tảng mới làm cho nó ĐÁNG TIN.</strong> Cùng tên, cùng ảnh, cùng một dòng mô tả trên LinkedIn, GitHub và CV. Nhà tuyển dụng đối chiếu ba hồ sơ khớp nhau thì sinh lòng tin; ba hồ sơ vênh nhau thì sinh câu hỏi cái nào mới thật.</li>
<li><strong>Bằng chứng thắng tính từ, nhất là trong CNTT.</strong> "Đam mê phát triển backend" là thứ không kiểm chứng được và ai cũng viết. "Đã xây và triển khai một REST API cho bài tập nhóm 40 người dùng, PostgreSQL + Express, mã ở đây" thì KIỂM ĐƯỢC — và những khẳng định kiểm được mới là thứ người ta chịu đọc.</li>
<li><strong>Dựng nó TRƯỚC khi cần tới.</strong> Một hồ sơ ráp vội đêm trước hạn nộp thực tập thì nhìn ra ngay. Một hồ sơ bồi qua bốn học kỳ thì có repo thật với lịch sử commit thật, và bản thân điều đó đã là bằng chứng về sự bền bỉ mà không tính từ nào cấp được.</li>
<li><strong>Ghi chú bối cảnh Việt Nam.</strong> Hãy giữ một bản hồ sơ TIẾNG ANH bên cạnh bản tiếng Việt nếu bạn muốn làm cho công ty gia công hay đội ngũ quốc tế; nhiều nhà tuyển dụng tìm bằng tiếng Anh. Nó cũng ép bạn vào sự cô đọng mà slide 103 sắp nói.</li>
</ul>
<table>
<tr><th>Nền tảng</th><th>Nó cần cho thấy gì</th><th>Lỗi thường gặp nhất</th></tr>
<tr><td>LinkedIn</td><td>Dòng tiêu đề, một đoạn tóm tắt, kỹ năng, dự án, học vấn</td><td>Hồ sơ trống trơn chỉ có tên trường</td></tr>
<tr><td>GitHub</td><td>Tên thật, tiểu sử, repo ghim, README trong từng repo</td><td>Toàn repo chép nguyên mã bài hướng dẫn, không README</td></tr>
<tr><td>Trang cá nhân / portfolio</td><td>Ba dự án có giải thích, một CV, một đường liên hệ</td><td>Một trang chủ rất đẹp mà phía sau không có gì</td></tr>
</table>
<p class="meo">💡 Đề hỏi "thể hiện bản thân trực tuyến" nghĩa là gì trong MOOC này thì đáp án là <strong>đưa ra lựa chọn có hiểu biết và có chủ đích</strong> về cách mình được thể hiện ở cả ba miền xã hội · học thuật · nghề nghiệp — không phải "đăng nhiều hơn".</p>`],

      [103, 'Summary: Managing Online Identity — writing your bio (Blagg 2011; Braun 2014; Fineman 2015; Fisher 2015; Wayne 2013)',
        `<p class="y-chinh">🎯 Six rules for the single most reused piece of text you will ever write: your <strong>bio</strong>. A short description of yourself — <strong>be professional but show humanity</strong>, <strong>be concise, but not too simple</strong>, <strong>avoid buzzwords</strong>, <strong>offer examples</strong>, <strong>avoid clichés</strong>.</p>
<table>
<tr><th>Rule on the slide</th><th>What it rules out</th><th>What it asks for instead</th></tr>
<tr><td>Short description of yourself</td><td>A three-paragraph life story</td><td>Two to four sentences that travel across platforms</td></tr>
<tr><td>Be professional but show humanity</td><td>A robotic list of qualifications</td><td>Competence plus one genuine human detail</td></tr>
<tr><td>Be concise, but not too simple</td><td>"CS student." — true, useless</td><td>Short AND specific enough to distinguish you</td></tr>
<tr><td>Avoid buzzwords</td><td>synergy, ninja, guru, rockstar, disruptive</td><td>Plain words naming what you actually do</td></tr>
<tr><td>Offer examples</td><td>Unsupported adjectives</td><td>A named project, a number, a link</td></tr>
<tr><td>Avoid clichés</td><td>"hard-working team player, passionate about technology"</td><td>Anything that would not fit on 10,000 other profiles</td></tr>
</table>
<ul>
<li><strong>Rules 3, 4 and 6 fight the same enemy from three sides.</strong> Too simple, buzzword-stuffed and cliché-ridden bios all fail for one reason: they could belong to anybody. The test to apply to every sentence you write is <em>"could a hundred classmates copy this line verbatim?"</em> If yes, cut it.</li>
<li><strong>"Professional but show humanity" is a genuine balance, not a contradiction.</strong> All competence and no person reads like a CV fragment; all personality and no competence reads like a dating profile. One concrete human line at the end — a hobby, a home town, what got you into the field — does the whole job.</li>
<li><strong>"Offer examples" is the rule with the highest payoff.</strong> One specific project with a number beats five adjectives. It is also the only rule that produces something a reader can verify, and verifiable claims are what build trust.</li>
</ul>
<p class="dap-an">✅ <strong>Weak bio (breaks rules 3, 4, 5 and 6):</strong> "I am a hard-working and passionate IT student at FPT University. I am a fast learner, a good team player and always ready to take on new challenges in the dynamic world of technology. My dream is to become a professional developer." — nothing here is false and nothing is usable: no evidence, five clichés, no way to tell this person from a thousand others.<br/><br/><strong>Strong bio (follows all six):</strong> "Third-year Software Engineering student at FPT University, working mostly in TypeScript and PostgreSQL. I built the booking backend for our SWP391 project — an Express API with 30 endpoints, now used by two student clubs — and I write short posts about database indexing at [link]. Outside class I repair old mechanical keyboards, which is how I got interested in firmware." — same length, but every claim is specific and two of them are checkable.</p>
<p class="meo">💡 Write ONE bio and reuse it everywhere, trimming as needed: full version for a personal site, one paragraph for LinkedIn, one line for GitHub. Consistency across platforms is itself part of the impression.</p>`,
        `<p class="y-chinh">🎯 Sáu luật cho đoạn văn bạn sẽ tái sử dụng nhiều nhất đời mình: phần <strong>bio</strong> (giới thiệu bản thân). Một mô tả ngắn về chính bạn — <strong>chuyên nghiệp nhưng vẫn ra con người</strong>, <strong>cô đọng, nhưng đừng quá sơ sài</strong>, <strong>tránh từ thời thượng</strong>, <strong>đưa ví dụ</strong>, <strong>tránh sáo ngữ</strong>.</p>
<table>
<tr><th>Luật trên slide</th><th>Nó loại bỏ điều gì</th><th>Nó đòi thứ gì thay vào</th></tr>
<tr><td>Mô tả NGẮN về bản thân</td><td>Ba đoạn tự truyện</td><td>Hai tới bốn câu dùng được ở mọi nền tảng</td></tr>
<tr><td>Chuyên nghiệp nhưng vẫn ra con người</td><td>Danh sách bằng cấp khô như máy</td><td>Năng lực cộng một chi tiết người thật</td></tr>
<tr><td>Cô đọng nhưng đừng quá sơ sài</td><td>"Sinh viên CNTT." — đúng, vô dụng</td><td>Vừa ngắn VỪA đủ cụ thể để phân biệt bạn</td></tr>
<tr><td>Tránh từ thời thượng</td><td>synergy, ninja, guru, rockstar, đột phá</td><td>Từ ngữ giản dị gọi đúng việc bạn làm</td></tr>
<tr><td>Đưa ví dụ</td><td>Tính từ không có gì đỡ</td><td>Một dự án có tên, một con số, một đường dẫn</td></tr>
<tr><td>Tránh sáo ngữ</td><td>"chăm chỉ, teamwork tốt, đam mê công nghệ"</td><td>Bất cứ thứ gì KHÔNG dán vừa vào 10.000 hồ sơ khác</td></tr>
</table>
<ul>
<li><strong>Luật 3, 4 và 6 đánh cùng một kẻ thù từ ba phía.</strong> Bio quá sơ sài, bio nhồi từ thời thượng và bio đầy sáo ngữ đều hỏng vì MỘT lý do: nó có thể là của bất kỳ ai. Phép thử đặt lên từng câu bạn viết là <em>"một trăm bạn cùng lớp có chép nguyên câu này được không?"</em> Được thì cắt.</li>
<li><strong>"Chuyên nghiệp nhưng vẫn ra con người" là một thế CÂN BẰNG thật, không phải mâu thuẫn.</strong> Toàn năng lực mà không có con người thì đọc như một mẩu CV; toàn cá tính mà không có năng lực thì đọc như hồ sơ hẹn hò. Một dòng người thật ở cuối — một sở thích, quê quán, thứ đã kéo bạn vào ngành — là đủ gánh hết việc.</li>
<li><strong>"Đưa ví dụ" là luật có lãi cao nhất.</strong> Một dự án cụ thể kèm con số ăn đứt năm cái tính từ. Nó cũng là luật duy nhất đẻ ra thứ người đọc KIỂM CHỨNG được, và những khẳng định kiểm được mới dựng nên lòng tin.</li>
</ul>
<p class="dap-an">✅ <strong>Bio YẾU (phạm luật 3, 4, 5 và 6):</strong> "Tôi là một sinh viên CNTT chăm chỉ và đầy đam mê tại Đại học FPT. Tôi học nhanh, làm việc nhóm tốt và luôn sẵn sàng đón nhận thử thách mới trong thế giới công nghệ đầy năng động. Ước mơ của tôi là trở thành một lập trình viên chuyên nghiệp." — không câu nào sai và không câu nào dùng được: không bằng chứng, năm sáo ngữ, không có cách nào phân biệt người này với một nghìn người khác.<br/><br/><strong>Bio MẠNH (theo đủ sáu luật):</strong> "Sinh viên năm ba ngành Kỹ thuật phần mềm tại Đại học FPT, làm chủ yếu với TypeScript và PostgreSQL. Tôi đã xây phần backend đặt lịch cho đồ án SWP391 — một Express API 30 endpoint, hiện hai câu lạc bộ sinh viên đang dùng — và tôi viết các bài ngắn về đánh index cơ sở dữ liệu ở [đường dẫn]. Ngoài giờ học tôi sửa bàn phím cơ cũ, và đó là lý do tôi quan tâm tới firmware." — cùng độ dài, nhưng mọi khẳng định đều cụ thể và hai trong số đó kiểm chứng được.</p>
<p class="meo">💡 Viết MỘT bio rồi dùng lại ở mọi nơi, cắt bớt khi cần: bản đầy đủ cho trang cá nhân, một đoạn cho LinkedIn, một dòng cho GitHub. Sự nhất quán giữa các nền tảng tự nó đã là một phần của ấn tượng.</p>`],

      [104, '5.4a Communicating Online (module objectives)',
        `<p class="y-chinh">🎯 The last sub-section of Mooc 1 opens with two objectives: <strong>communicate effectively in different digital modes</strong>, and <strong>observe the appropriate conventions of a particular mode of communication</strong>. Slides 104–109 are those conventions, mode by mode.</p>
<ul>
<li><strong>"Different digital modes" is the key word — MODE.</strong> An email, a discussion-board post, a chat message and a comment on a pull request are four different modes with four different sets of expectations. Writing one of them in the register of another is the mistake this whole section exists to prevent.</li>
<li><strong>Conventions are not politeness rules; they are how meaning gets across.</strong> Online text has no tone of voice, no face and no pause. Everything that would have carried your intention in person has to be rebuilt out of structure, wording and punctuation — which is why a bare "no" reads as hostile in writing and did not in the corridor.</li>
<li><strong>Two modes dominate university, and slide 105 names them.</strong> Emails and discussion boards. Every remaining slide in the deck (106, 107, 108, 109) drills into one of those two.</li>
<li><strong>Everything you send is a record.</strong> Email and forum posts are archived, forwardable, quotable and timestamped. That changes what is sensible to write: never send in anger, and never write what you would not want read aloud by a third party.</li>
<li><strong>FPTU application, immediately.</strong> LMS announcements, lecturer email, group Zalo, and project discussion threads are your daily modes. A message that gets an answer the same day is usually just one that made the answer easy to give — which is precisely what slides 106–107 teach.</li>
</ul>
<table>
<tr><th>Mode</th><th>Register</th><th>Speed expected</th><th>Audience</th></tr>
<tr><td>Email to a lecturer</td><td>Formal</td><td>1–3 working days</td><td>One person, on the record</td></tr>
<tr><td>Discussion board post</td><td>Semi-formal, referenced</td><td>Within the week's window</td><td>The whole class, permanently</td></tr>
<tr><td>Group chat</td><td>Informal</td><td>Minutes to hours</td><td>Teammates</td></tr>
</table>
<p class="pitfall">⚠️ Slides 104, 106, 107 and 108 all print these SAME two objectives. They are section markers, not new content — the real material is on the summary slides 105 and 109.</p>`,
        `<p class="y-chinh">🎯 Tiểu mục cuối cùng của Mooc 1 mở ra với hai chuẩn đầu ra: <strong>giao tiếp hiệu quả ở các phương thức số khác nhau</strong>, và <strong>tuân theo quy ước phù hợp của từng phương thức giao tiếp</strong>. Slide 104–109 chính là những quy ước đó, đi từng phương thức.</p>
<ul>
<li><strong>Từ khoá là "các PHƯƠNG THỨC số khác nhau".</strong> Một email, một bài đăng trên diễn đàn học phần, một tin nhắn chat và một bình luận trong pull request là BỐN phương thức với bốn bộ kỳ vọng khác nhau. Viết cái này bằng giọng của cái kia chính là lỗi mà cả mục này sinh ra để chặn.</li>
<li><strong>Quy ước không phải luật lịch sự; nó là cách NGHĨA đi tới được người nhận.</strong> Chữ trên mạng không có ngữ điệu, không có nét mặt, không có khoảng lặng. Mọi thứ lẽ ra chuyển tải ý định của bạn khi gặp mặt đều phải dựng lại bằng cấu trúc, từ ngữ và dấu câu — vì thế một chữ "không" trơ trọi đọc ra thù địch trên văn bản trong khi ngoài hành lang thì không.</li>
<li><strong>Hai phương thức thống trị đại học, và slide 105 gọi tên chúng.</strong> Email và diễn đàn thảo luận. Mọi slide còn lại của deck (106, 107, 108, 109) đều khoan sâu vào một trong hai cái đó.</li>
<li><strong>Mọi thứ bạn gửi đều là một BẢN GHI.</strong> Email và bài diễn đàn được lưu trữ, chuyển tiếp được, trích được, có dấu thời gian. Điều đó thay đổi thứ nên viết: đừng bao giờ gửi lúc đang giận, và đừng viết thứ bạn không muốn bị người thứ ba đọc to lên.</li>
<li><strong>Áp dụng ở FPTU, ngay lập tức.</strong> Thông báo trên LMS, email giảng viên, Zalo nhóm, và luồng thảo luận đồ án là những phương thức hằng ngày của bạn. Một tin nhắn được trả lời trong ngày thường chỉ đơn giản là tin nhắn đã làm cho việc trả lời trở nên DỄ — và đó đúng là thứ slide 106–107 dạy.</li>
</ul>
<table>
<tr><th>Phương thức</th><th>Giọng điệu</th><th>Tốc độ kỳ vọng</th><th>Khán giả</th></tr>
<tr><td>Email cho giảng viên</td><td>Trang trọng</td><td>1–3 ngày làm việc</td><td>Một người, và được lưu lại</td></tr>
<tr><td>Bài đăng diễn đàn</td><td>Bán trang trọng, có trích nguồn</td><td>Trong khung thời gian của tuần</td><td>Cả lớp, vĩnh viễn</td></tr>
<tr><td>Chat nhóm</td><td>Thân mật</td><td>Vài phút tới vài giờ</td><td>Bạn cùng nhóm</td></tr>
</table>
<p class="pitfall">⚠️ Slide 104, 106, 107 và 108 đều in Y HỆT hai chuẩn đầu ra này. Chúng là mốc đánh dấu tiểu mục, không phải nội dung mới — chất liệu thật nằm ở hai slide tóm tắt 105 và 109.</p>`],

      [105, 'Summary: Communicating Online — two forms, and the rules of netiquette (Shea, 2005)',
        `<p class="y-chinh">🎯 The slide names the <strong>two main forms of digital communication at university</strong> — <strong>emails</strong> and <strong>discussion boards</strong> — and then lists <strong>the rules of netiquette</strong>: remember the human · don't behave differently online · forgive others' mistakes · present yourself well online · respect other people's time · respect other people's privacy.</p>
<table>
<tr><th>Rule</th><th>What it means in practice</th><th>What breaking it looks like</th></tr>
<tr><td><strong>Remember the human</strong></td><td>There is a person reading, who will feel what you wrote</td><td>Writing something you would never say to their face</td></tr>
<tr><td><strong>Don't behave differently online</strong></td><td>One standard of behaviour, on and offline</td><td>"It's just the internet, it doesn't count"</td></tr>
<tr><td><strong>Forgive others' mistakes</strong></td><td>Overlook typos and beginner questions; correct kindly and privately</td><td>Public pile-ons over a spelling error</td></tr>
<tr><td><strong>Present yourself well online</strong></td><td>Write clearly, spell-check, be someone worth reading</td><td>All-lowercase, no structure, unreadable</td></tr>
<tr><td><strong>Respect other people's time</strong></td><td>Be brief, be specific, put the question first, do not reply-all needlessly</td><td>A six-paragraph email whose request is in the last line</td></tr>
<tr><td><strong>Respect other people's privacy</strong></td><td>Do not forward, screenshot or repost what was written for another audience</td><td>Screenshotting a group chat into a public post</td></tr>
</table>
<ul>
<li><strong>Shea's original list has TEN rules; the slide keeps six.</strong> Learn the six as printed, since that is what the deck presents — but be aware an exam question may draw on the full list ("share expert knowledge", "help keep flame wars under control", "know where you are in cyberspace", "make yourself look good online").</li>
<li><strong>"Remember the human" is rule 1 for a reason, and it explains the other five.</strong> Every online-communication failure — flaming, careless sarcasm, forwarding a private message — comes from forgetting that the text arrives at a person, not at a screen.</li>
<li><strong>"Respect other people's time" is the most practical one for students.</strong> A lecturer teaching four courses receives dozens of messages a day. The message that is short, specific and answerable in one line is the one that gets answered first — this is not favouritism, it is arithmetic.</li>
<li><strong>"Don't behave differently online" pushes back on the anonymity effect.</strong> Distance and a screen lower inhibition, which is exactly why abuse is easier to type than to say. The rule sets a single standard and removes the excuse.</li>
<li><strong>This slide connects straight back to 5.3.</strong> "Present yourself well online" IS digital identity management: every forum post and every email is a small deposit into the impression that slides 100–103 told you to curate.</li>
</ul>
<p class="meo">💡 Compress the six into three pairs: <strong>the human</strong> (remember them, forgive them) · <strong>yourself</strong> (same standard, present well) · <strong>their resources</strong> (their time, their privacy). Much easier to reproduce under exam pressure.</p>`,
        `<p class="y-chinh">🎯 Slide gọi tên <strong>hai hình thức giao tiếp số chính ở đại học</strong> — <strong>email</strong> và <strong>diễn đàn thảo luận</strong> — rồi liệt kê <strong>các luật netiquette</strong>: nhớ rằng có CON NGƯỜI ở đầu kia · đừng cư xử khác đi khi lên mạng · tha thứ lỗi của người khác · thể hiện bản thân tử tế trên mạng · tôn trọng thời gian của người khác · tôn trọng quyền riêng tư của người khác.</p>
<table>
<tr><th>Luật</th><th>Trong thực tế nghĩa là gì</th><th>Phạm luật trông ra sao</th></tr>
<tr><td><strong>Nhớ rằng có con người</strong></td><td>Có một NGƯỜI đang đọc, và người đó sẽ cảm thấy thứ bạn viết</td><td>Viết thứ mà bạn không bao giờ dám nói thẳng mặt</td></tr>
<tr><td><strong>Đừng cư xử khác khi lên mạng</strong></td><td>Một chuẩn hành xử duy nhất, trên mạng lẫn ngoài đời</td><td>"Mạng ảo mà, có tính gì đâu"</td></tr>
<tr><td><strong>Tha thứ lỗi của người khác</strong></td><td>Bỏ qua lỗi gõ và câu hỏi của người mới; góp ý tử tế và riêng tư</td><td>Xúm vào dập một người vì một lỗi chính tả</td></tr>
<tr><td><strong>Thể hiện bản thân tử tế</strong></td><td>Viết rõ, soát chính tả, là người đáng đọc</td><td>Viết thường tất, không xuống dòng, không đọc nổi</td></tr>
<tr><td><strong>Tôn trọng thời gian người khác</strong></td><td>Ngắn, cụ thể, đặt câu hỏi lên đầu, đừng reply-all vô cớ</td><td>Email sáu đoạn mà yêu cầu nằm ở dòng cuối</td></tr>
<tr><td><strong>Tôn trọng riêng tư người khác</strong></td><td>Đừng chuyển tiếp, chụp màn hình hay đăng lại thứ viết cho khán giả khác</td><td>Chụp màn hình chat nhóm rồi đăng công khai</td></tr>
</table>
<ul>
<li><strong>Danh sách gốc của Shea có MƯỜI luật; slide giữ sáu.</strong> Hãy thuộc sáu luật đúng như in, vì đó là thứ deck trình bày — nhưng biết trước rằng đề có thể lấy từ danh sách đầy đủ ("chia sẻ kiến thức chuyên môn", "góp phần dập các cuộc cãi vã", "biết mình đang ở đâu trong không gian mạng", "làm cho mình trông tử tế trên mạng").</li>
<li><strong>"Nhớ rằng có con người" đứng đầu là có lý do, và nó giải thích năm luật còn lại.</strong> Mọi thất bại giao tiếp trên mạng — chửi bới, mỉa mai vô ý, chuyển tiếp tin nhắn riêng — đều đến từ việc quên rằng dòng chữ ấy cập bến ở một CON NGƯỜI, không phải một cái màn hình.</li>
<li><strong>"Tôn trọng thời gian người khác" là luật thực dụng nhất với sinh viên.</strong> Một giảng viên dạy bốn môn nhận hàng chục tin mỗi ngày. Tin ngắn, cụ thể, trả lời được trong một dòng là tin được trả lời trước — đây không phải thiên vị, đây là số học.</li>
<li><strong>"Đừng cư xử khác khi lên mạng" đẩy lùi hiệu ứng ẩn danh.</strong> Khoảng cách và cái màn hình làm hạ ức chế, nên chửi thì GÕ dễ hơn NÓI. Luật này đặt một chuẩn duy nhất và gỡ mất cái cớ.</li>
<li><strong>Slide này nối thẳng về 5.3.</strong> "Thể hiện bản thân tử tế trên mạng" CHÍNH LÀ quản lý danh tính số: mỗi bài diễn đàn và mỗi email là một khoản gửi nhỏ vào cái ấn tượng mà slide 100–103 bảo bạn chăm chút.</li>
</ul>
<p class="meo">💡 Nén sáu luật thành ba cặp: <strong>con người kia</strong> (nhớ tới họ, tha thứ họ) · <strong>bản thân</strong> (cùng một chuẩn, thể hiện tử tế) · <strong>tài nguyên của họ</strong> (thời gian, riêng tư). Dễ tái hiện hơn hẳn lúc căng thẳng phòng thi.</p>`],

      [106, '5.4b Emailing Lecturers — a bad email and a good email, same situation',
        `<p class="y-chinh">🎯 The objectives repeat, but the topic is the one skill from this MOOC you will use this week: <strong>writing an email to a lecturer</strong>. Below are two emails for the same situation — asking for an extension on an assignment — and everything that separates them.</p>
<p class="nhan">📧 <strong>Version 1 — the bad email</strong></p>
<pre>Subject: help
hi teacher
i am student in your class. i cant submit the assignment tomorrow
because i have many things to do and my laptop have problem. can u
give me more time?? also what is the assignment about exactly.
thanks u
sent from my iPhone</pre>
<table>
<tr><th>#</th><th>The error</th><th>Why it costs you</th></tr>
<tr><td>1</td><td>Subject line "help"</td><td>Says nothing; sinks in an inbox of 60 messages and cannot be found later</td></tr>
<tr><td>2</td><td>"hi teacher"</td><td>Too informal for a first contact, and does not name the person</td></tr>
<tr><td>3</td><td>"student in your class"</td><td>The lecturer teaches several hundred students — no name, no ID, no course code, so the request is unactionable</td></tr>
<tr><td>4</td><td>Lower case, "u", "??", spelling errors</td><td>Breaks "present yourself well online" (slide 105) and signals the request is not serious</td></tr>
<tr><td>5</td><td>"many things to do"</td><td>A vague reason invites a no; it also gives the lecturer no ground to approve anything</td></tr>
<tr><td>6</td><td>"what is the assignment about exactly"</td><td>Asks the lecturer to re-teach what is already on the LMS — breaks "respect other people's time"</td></tr>
<tr><td>7</td><td>No proposed new date</td><td>Forces the lecturer to do your planning; an unanswerable question gets postponed</td></tr>
<tr><td>8</td><td>No signature</td><td>Even if they want to help, they cannot look up your record</td></tr>
</table>
<p class="nhan">📧 <strong>Version 2 — the good email, same request</strong></p>
<pre>Subject: SWP391 - Extension request for Assignment 2 - Nguyen Van A (HE170123)

Dear Mr Tran,

I am Nguyen Van A (HE170123), a student in your SWP391 class, group SE1705.

I am writing to ask whether it would be possible to submit Assignment 2
two days later than the deadline, on Friday 22 September instead of
Wednesday 20 September. I was ill on 17-18 September and have a medical
certificate, which I can attach or bring to class.

I have already completed the API and the database design; the remaining
work is the test report. If a two-day extension is not possible, I will
submit what I have by the original deadline.

Thank you for considering this.

Best regards,
Nguyen Van A
Student ID HE170123 - SE1705 - SWP391</pre>
<ul>
<li><strong>Why version 2 works: it can be answered with one word.</strong> Everything the lecturer needs — who, which course, what is being asked, the new date, the reason, the evidence, the fallback — is present, so the reply is "Yes, Friday is fine." That is the whole design goal of a request email.</li>
<li><strong>The subject line is doing four jobs at once.</strong> Course code, topic, action needed, and your name and ID. It is searchable in three months, it sorts correctly in an inbox, and it tells the reader whether to open it now or later.</li>
<li><strong>Naming a fallback ("if not possible, I will submit what I have") is the professional move.</strong> It shows you have a plan that does not depend on the favour, which paradoxically makes the favour much easier to grant.</li>
<li><strong>Never put the request last.</strong> Lead with it in the subject and again in the first line of the body. A reader who has to hunt for the ask is a reader who defers the email — and then forgets it.</li>
<li><strong>FPTU specifics.</strong> Use your university email, not a personal one; include your student ID and class code every time; allow 1–3 working days before following up; and if you follow up, reply in the SAME thread rather than starting a new email.</li>
</ul>
<p class="dap-an">✅ Minimum checklist for every email to a lecturer: <strong>(1)</strong> specific subject line with course code · <strong>(2)</strong> proper salutation with their name and title · <strong>(3)</strong> your full name, student ID and course/class · <strong>(4)</strong> the request stated briefly and early · <strong>(5)</strong> the relevant reason and any evidence · <strong>(6)</strong> a thank-you · <strong>(7)</strong> a signature block. Seven items, every time.</p>`,
        `<p class="y-chinh">🎯 Chuẩn đầu ra lặp lại, nhưng chủ đề là kỹ năng của MOOC này mà bạn sẽ dùng ngay tuần nay: <strong>viết email cho giảng viên</strong>. Dưới đây là hai email cho CÙNG một tình huống — xin gia hạn nộp bài — và mọi thứ tách biệt chúng.</p>
<p class="nhan">📧 <strong>Bản 1 — email XẤU</strong></p>
<pre>Subject: help
hi teacher
i am student in your class. i cant submit the assignment tomorrow
because i have many things to do and my laptop have problem. can u
give me more time?? also what is the assignment about exactly.
thanks u
sent from my iPhone</pre>
<table>
<tr><th>#</th><th>Lỗi</th><th>Nó khiến bạn mất gì</th></tr>
<tr><td>1</td><td>Tiêu đề "help"</td><td>Không nói gì cả; chìm nghỉm trong hộp thư 60 tin và sau này không tìm lại được</td></tr>
<tr><td>2</td><td>"hi teacher"</td><td>Quá suồng sã cho lần liên hệ đầu, và không gọi tên người nhận</td></tr>
<tr><td>3</td><td>"student in your class"</td><td>Giảng viên dạy vài trăm sinh viên — không tên, không mã SV, không mã môn, nên yêu cầu KHÔNG xử lý được</td></tr>
<tr><td>4</td><td>Viết thường tất, "u", "??", sai chính tả</td><td>Phạm luật "thể hiện bản thân tử tế trên mạng" (slide 105) và báo hiệu yêu cầu này không nghiêm túc</td></tr>
<tr><td>5</td><td>"many things to do"</td><td>Lý do mơ hồ mời gọi một chữ "không"; nó cũng chẳng cho giảng viên căn cứ nào để duyệt</td></tr>
<tr><td>6</td><td>"what is the assignment about exactly"</td><td>Bắt giảng viên giảng lại thứ đã có sẵn trên LMS — phạm luật "tôn trọng thời gian người khác"</td></tr>
<tr><td>7</td><td>Không đề xuất ngày mới</td><td>Đẩy việc lập kế hoạch sang giảng viên; câu hỏi không trả lời được thì bị hoãn lại</td></tr>
<tr><td>8</td><td>Không có chữ ký</td><td>Dù muốn giúp, họ cũng không tra được hồ sơ của bạn</td></tr>
</table>
<p class="nhan">📧 <strong>Bản 2 — email TỐT, cùng một yêu cầu</strong></p>
<pre>Subject: SWP391 - Xin gia hạn nộp Assignment 2 - Nguyen Van A (HE170123)

Kính gửi thầy Trần Văn B,

Em là Nguyễn Văn A (HE170123), sinh viên lớp SE1705, môn SWP391 của thầy.

Em viết email này để xin phép nộp Assignment 2 muộn hai ngày, vào thứ Sáu
ngày 22/9 thay vì thứ Tư ngày 20/9. Em bị ốm trong hai ngày 17-18/9 và có
giấy khám của bệnh viện, em có thể đính kèm hoặc mang tới lớp cho thầy xem.

Em đã hoàn thành phần API và thiết kế cơ sở dữ liệu; phần còn lại là báo cáo
kiểm thử. Nếu không thể gia hạn, em sẽ nộp phần đã làm xong đúng hạn cũ.

Em cảm ơn thầy đã xem xét.

Trân trọng,
Nguyễn Văn A
MSSV HE170123 - SE1705 - SWP391</pre>
<ul>
<li><strong>Vì sao bản 2 hiệu quả: nó trả lời được bằng MỘT chữ.</strong> Mọi thứ giảng viên cần — ai, môn nào, xin gì, ngày mới, lý do, bằng chứng, phương án dự phòng — đều có mặt, nên câu trả lời chỉ là "Được, thứ Sáu nhé." Đó là toàn bộ mục tiêu thiết kế của một email yêu cầu.</li>
<li><strong>Dòng tiêu đề đang làm BỐN việc cùng lúc.</strong> Mã môn, chủ đề, hành động cần, cùng tên và mã sinh viên. Ba tháng sau vẫn tìm được, sắp xếp đúng trong hộp thư, và cho người đọc biết nên mở ngay hay để lát nữa.</li>
<li><strong>Nêu phương án dự phòng ("nếu không được, em sẽ nộp phần đã làm") là nước đi chuyên nghiệp.</strong> Nó cho thấy bạn có kế hoạch KHÔNG phụ thuộc vào sự ưu ái — và nghịch lý là điều đó khiến sự ưu ái dễ được ban hơn nhiều.</li>
<li><strong>Đừng bao giờ để yêu cầu ở CUỐI.</strong> Nêu nó ngay ở tiêu đề rồi nhắc lại ở dòng đầu thân thư. Người đọc phải đi săn tìm xem bạn muốn gì là người đọc sẽ hoãn email đó lại — rồi quên.</li>
<li><strong>Chi tiết riêng cho FPTU.</strong> Dùng email của trường chứ không dùng mail cá nhân; luôn kèm MSSV và mã lớp; chờ 1–3 ngày làm việc rồi mới nhắc lại; và khi nhắc lại thì trả lời TRONG CÙNG luồng thư, đừng mở email mới.</li>
</ul>
<p class="dap-an">✅ Checklist tối thiểu cho mọi email gửi giảng viên: <strong>(1)</strong> tiêu đề cụ thể có mã môn · <strong>(2)</strong> lời chào đàng hoàng, gọi đúng tên và chức danh · <strong>(3)</strong> họ tên đầy đủ, MSSV và môn/lớp · <strong>(4)</strong> nêu yêu cầu NGẮN và SỚM · <strong>(5)</strong> lý do liên quan cùng bằng chứng nếu có · <strong>(6)</strong> lời cảm ơn · <strong>(7)</strong> khối chữ ký. Bảy mục, lần nào cũng đủ.</p>`],

      [107, '5.4c Writing an Email — the anatomy, and a second worked example (asking about a grade)',
        `<p class="y-chinh">🎯 Same objectives, now on the structure of the email itself. Every academic email has <strong>seven parts</strong>, and each part has one job. Learn the skeleton once and you can write any of them in two minutes.</p>
<table>
<tr><th>Part</th><th>Its one job</th><th>Good</th><th>Bad</th></tr>
<tr><td>Subject line</td><td>Let the reader triage without opening</td><td>"CSI106 - Question about Quiz 3 marking - Le Thi C (HE170456)"</td><td>"question", "urgent!!!", blank</td></tr>
<tr><td>Salutation</td><td>Address the right person at the right distance</td><td>"Dear Ms Nguyen," / "Kính gửi cô Nguyễn,"</td><td>"Hey", "Dear teacher", "Dear Sir/Madam" to someone you know</td></tr>
<tr><td>Self-identification</td><td>Let them find your record</td><td>Full name + student ID + class + course</td><td>"I'm a student in your class"</td></tr>
<tr><td>Purpose</td><td>Say what you want, early and once</td><td>"I am writing to ask about…"</td><td>Three paragraphs of context first</td></tr>
<tr><td>Detail / evidence</td><td>Give exactly what is needed to decide</td><td>Question number, date, what you already checked</td><td>Your whole week</td></tr>
<tr><td>Closing courtesy</td><td>Acknowledge their time</td><td>"Thank you for your time."</td><td>"Reply ASAP"</td></tr>
<tr><td>Signature</td><td>Make replying and record-checking easy</td><td>Name, ID, class, course</td><td>"Sent from my iPhone"</td></tr>
</table>
<p class="nhan">📧 <strong>Second situation — asking about a grade. The weak version:</strong></p>
<pre>Subject: my mark
teacher why i got only 6 for the quiz? i think i answered correctly.
other students got higher. please check again.</pre>
<p class="nhan">📧 <strong>And the version that gets a real answer:</strong></p>
<pre>Subject: CSI106 - Question about Quiz 3 marking (Q7) - Le Thi C (HE170456)

Dear Ms Nguyen,

I am Le Thi C (HE170456), class SE1706, in your CSI106 course.

I would like to ask about question 7 of Quiz 3, taken on 12 September.
I answered "two's complement" and it was marked incorrect. In the lecture
slides for Chapter 3 (slide 18) and in the textbook section 3.2, that
representation is given for signed integers, so I may have misunderstood
how the question was framed.

Could you help me see where my reasoning went wrong? I am not asking for
the mark to be changed - I would like to understand it before the final exam.

Thank you for your time.

Best regards,
Le Thi C
Student ID HE170456 - SE1706 - CSI106</pre>
<ul>
<li><strong>The single most important difference: one asks for a grade, the other asks for an EXPLANATION.</strong> "Why did I only get 6" puts the lecturer on the defensive. "Could you help me see where my reasoning went wrong" invites teaching, which is what they are there for — and it very often produces the mark correction anyway.</li>
<li><strong>Specific beats general, every time.</strong> "The quiz" is unsearchable; "question 7 of Quiz 3, taken on 12 September" can be looked up in thirty seconds. The more precise your reference, the higher the chance of a same-day reply.</li>
<li><strong>Never compare yourself to other students.</strong> "Other students got higher" is both a privacy problem and an argument the lecturer cannot act on. Argue from the content, not from the distribution.</li>
<li><strong>Showing what you already checked is what marks you as serious.</strong> Citing the lecture slide and the textbook section proves you did the work before asking — the single fastest way to make a lecturer want to help you.</li>
<li><strong>Tone rules that carry everywhere.</strong> No ALL CAPS, no multiple exclamation marks, no "urgent" unless it truly is, no demand for an immediate reply. If you are angry, write the email, save it as a draft, and re-read it tomorrow — it is a permanent record (slide 104).</li>
</ul>
<p class="meo">💡 Remember the skeleton with a mnemonic: <strong>Subject · Salutation · Self · Purpose · Proof · Please/Thanks · Signature</strong>. If a multiple-choice question asks which element a student email is missing, it is almost always the student ID/course identification or a meaningful subject line.</p>`,
        `<p class="y-chinh">🎯 Vẫn chuẩn đầu ra đó, giờ nói về CẤU TRÚC của chính lá email. Mọi email học thuật đều có <strong>BẢY phần</strong>, và mỗi phần làm đúng một việc. Thuộc bộ xương này một lần là viết được bất kỳ lá nào trong hai phút.</p>
<table>
<tr><th>Phần</th><th>Việc duy nhất của nó</th><th>Tốt</th><th>Xấu</th></tr>
<tr><td>Dòng tiêu đề</td><td>Cho người nhận phân loại mà không cần mở</td><td>"CSI106 - Hỏi về cách chấm Quiz 3 - Le Thi C (HE170456)"</td><td>"hỏi tí", "gấp!!!", để trống</td></tr>
<tr><td>Lời chào</td><td>Gọi đúng người, đúng khoảng cách</td><td>"Kính gửi cô Nguyễn," / "Dear Ms Nguyen,"</td><td>"Hey", "Dear teacher", "Kính gửi quý thầy cô" với người bạn đã biết tên</td></tr>
<tr><td>Tự giới thiệu</td><td>Để họ tra được hồ sơ của bạn</td><td>Họ tên đầy đủ + MSSV + lớp + môn</td><td>"Em là sinh viên lớp thầy"</td></tr>
<tr><td>Mục đích</td><td>Nói bạn muốn gì, SỚM và một lần</td><td>"Em viết email này để hỏi về…"</td><td>Ba đoạn bối cảnh trước đã</td></tr>
<tr><td>Chi tiết / bằng chứng</td><td>Đưa đúng thứ cần để họ ra quyết định</td><td>Số câu, ngày tháng, thứ bạn đã tự kiểm</td><td>Cả tuần vừa rồi của bạn</td></tr>
<tr><td>Lời cảm ơn</td><td>Ghi nhận thời gian của họ</td><td>"Em cảm ơn thầy/cô đã dành thời gian."</td><td>"Trả lời em gấp nhé"</td></tr>
<tr><td>Chữ ký</td><td>Làm việc trả lời và tra hồ sơ dễ đi</td><td>Tên, MSSV, lớp, môn</td><td>"Sent from my iPhone"</td></tr>
</table>
<p class="nhan">📧 <strong>Tình huống thứ hai — hỏi về điểm. Bản YẾU:</strong></p>
<pre>Subject: điểm của em
thầy ơi sao em chỉ được 6 điểm bài quiz? em nghĩ em làm đúng mà.
các bạn khác điểm cao hơn. thầy chấm lại giúp em.</pre>
<p class="nhan">📧 <strong>Và bản thật sự nhận được câu trả lời:</strong></p>
<pre>Subject: CSI106 - Hỏi về cách chấm Quiz 3 (câu 7) - Le Thi C (HE170456)

Kính gửi cô Nguyễn Thị D,

Em là Lê Thị C (HE170456), lớp SE1706, môn CSI106 của cô.

Em muốn hỏi về câu 7 của Quiz 3, làm ngày 12/9. Em chọn đáp án
"bù hai" (two's complement) và bị tính sai. Trong slide bài giảng
Chương 3 (slide 18) và mục 3.2 của giáo trình, cách biểu diễn đó được
nêu cho số nguyên có dấu, nên có thể em đã hiểu sai cách đề đặt vấn đề.

Cô có thể chỉ giúp em chỗ lập luận của em sai ở đâu không ạ? Em không
xin sửa điểm - em muốn hiểu cho đúng trước kỳ thi cuối kỳ.

Em cảm ơn cô đã dành thời gian.

Trân trọng,
Lê Thị C
MSSV HE170456 - SE1706 - CSI106</pre>
<ul>
<li><strong>Khác biệt lớn nhất: một bên xin ĐIỂM, một bên xin LỜI GIẢI THÍCH.</strong> "Sao em chỉ được 6" đẩy giảng viên vào thế phòng thủ. "Cô chỉ giúp em lập luận sai ở đâu" là lời mời DẠY, mà dạy đúng là việc của họ — và rất thường thì nó vẫn dẫn tới việc điểm được sửa.</li>
<li><strong>Cụ thể luôn thắng chung chung.</strong> "Bài quiz" thì không tra được; "câu 7 của Quiz 3, làm ngày 12/9" thì tra ra trong ba mươi giây. Bạn chỉ càng chính xác thì khả năng được trả lời trong ngày càng cao.</li>
<li><strong>Đừng bao giờ đem mình so với sinh viên khác.</strong> "Các bạn khác điểm cao hơn" vừa là chuyện riêng tư của người khác, vừa là lý lẽ giảng viên không thể hành động dựa vào. Hãy tranh luận từ NỘI DUNG, không từ bảng phân bố điểm.</li>
<li><strong>Cho thấy thứ bạn đã TỰ KIỂM mới là dấu hiệu nghiêm túc.</strong> Dẫn slide bài giảng và mục giáo trình chứng minh bạn đã làm phần việc của mình trước khi hỏi — đó là cách nhanh nhất khiến giảng viên MUỐN giúp bạn.</li>
<li><strong>Luật về giọng, dùng được ở mọi nơi.</strong> Không VIẾT HOA TẤT, không nhiều dấu chấm than, không gắn "gấp" trừ khi thật sự gấp, không đòi trả lời ngay lập tức. Nếu đang giận thì viết xong lưu nháp, mai đọc lại — nó là một bản ghi vĩnh viễn (slide 104).</li>
</ul>
<p class="meo">💡 Nhớ bộ xương bằng chuỗi: <strong>Tiêu đề · Lời chào · Bản thân · Mục đích · Bằng chứng · Cảm ơn · Chữ ký</strong>. Câu trắc nghiệm hỏi email sinh viên đang THIẾU thành phần nào thì gần như luôn là phần MSSV/định danh môn học, hoặc một dòng tiêu đề có nghĩa.</p>`],

      [108, '5.4d Discussion Board Netiquette (module objectives)',
        `<p class="y-chinh">🎯 The last objectives slide, introducing the second of the two university modes: the <strong>discussion board</strong>. It is neither an email nor a chat, and treating it as either is the standard mistake.</p>
<table>
<tr><th></th><th>Email</th><th>Discussion board</th><th>Group chat</th></tr>
<tr><td>Audience</td><td>One or a few</td><td>The whole class, permanently</td><td>Teammates</td></tr>
<tr><td>Register</td><td>Formal</td><td>Semi-formal</td><td>Informal</td></tr>
<tr><td>Expected length</td><td>As short as possible</td><td>A developed paragraph (see slide 109)</td><td>A line or two</td></tr>
<tr><td>Sources</td><td>Rarely</td><td><strong>Referenced</strong></td><td>Never</td></tr>
<tr><td>Obligation to others</td><td>None</td><td><strong>You must reply to other posts</strong></td><td>Informal</td></tr>
</table>
<ul>
<li><strong>A discussion board is a public, assessed conversation.</strong> That single fact explains all its conventions: it is public (so netiquette matters more), it is a conversation (so you must respond to others), and it is assessed (so it must be referenced and developed, not a one-line reaction).</li>
<li><strong>Read the thread before posting.</strong> Posting a point three people already made wastes everyone's time — "respect other people's time", from slide 105. Read first, then add or extend.</li>
<li><strong>"I agree" is not a response.</strong> Adding value means giving a reason, an example, a counter-case, or a source. The convention on forums is to quote or name the specific point you are responding to, so the thread stays followable.</li>
<li><strong>Disagreement is expected and welcome — the target is the ARGUMENT.</strong> "I read that claim differently because…" is academic debate. "You are wrong" is not, and it also breaks "remember the human". This is the online version of the critical thinking valued from slide 9 of this deck.</li>
<li><strong>FPTU application.</strong> LMS forums, project channels and code review comments all run on these conventions. A pull-request comment saying "this loop re-queries inside the iteration, maybe move it out?" gets a fix; one saying "bad code" gets a defensive teammate. Identical information, opposite outcomes.</li>
</ul>
<p class="pitfall">⚠️ Careful: a discussion board post is <strong>semi-formal</strong>, not formal. Writing it as a mini-essay with no personal voice is as much of a mismatch as writing it as a chat message. Slide 109 gives the exact specification.</p>`,
        `<p class="y-chinh">🎯 Slide chuẩn đầu ra cuối cùng, giới thiệu phương thức thứ hai trong hai phương thức ở đại học: <strong>diễn đàn thảo luận</strong>. Nó không phải email, cũng không phải chat, và coi nó là một trong hai thứ đó chính là lỗi kinh điển.</p>
<table>
<tr><th></th><th>Email</th><th>Diễn đàn thảo luận</th><th>Chat nhóm</th></tr>
<tr><td>Khán giả</td><td>Một hoặc vài người</td><td>Cả lớp, vĩnh viễn</td><td>Bạn cùng nhóm</td></tr>
<tr><td>Giọng điệu</td><td>Trang trọng</td><td>Bán trang trọng</td><td>Thân mật</td></tr>
<tr><td>Độ dài kỳ vọng</td><td>Càng ngắn càng tốt</td><td>Một đoạn có triển khai (xem slide 109)</td><td>Một hai dòng</td></tr>
<tr><td>Nguồn tham khảo</td><td>Hiếm khi</td><td><strong>PHẢI có trích nguồn</strong></td><td>Không bao giờ</td></tr>
<tr><td>Nghĩa vụ với người khác</td><td>Không có</td><td><strong>PHẢI phản hồi bài của người khác</strong></td><td>Không chính thức</td></tr>
</table>
<ul>
<li><strong>Diễn đàn là một cuộc trò chuyện CÔNG KHAI và ĐƯỢC CHẤM ĐIỂM.</strong> Chỉ một sự thật đó giải thích mọi quy ước của nó: công khai (nên netiquette quan trọng hơn), là trò chuyện (nên phải phản hồi người khác), và được chấm (nên phải có trích nguồn và có triển khai, không phải một dòng cảm thán).</li>
<li><strong>ĐỌC hết luồng rồi hãy đăng.</strong> Đăng lại ý mà ba người đã nói là phí thời gian của tất cả — đúng luật "tôn trọng thời gian người khác" ở slide 105. Đọc trước, rồi bổ sung hoặc mở rộng.</li>
<li><strong>"Em đồng ý" KHÔNG phải là một phản hồi.</strong> Tạo giá trị nghĩa là đưa ra lý do, ví dụ, trường hợp ngược lại, hoặc một nguồn. Quy ước diễn đàn là trích lại hoặc gọi tên ĐÚNG ý bạn đang phản hồi, để luồng còn theo dõi được.</li>
<li><strong>Bất đồng là điều được mong đợi và hoan nghênh — mục tiêu là LẬP LUẬN.</strong> "Em đọc khẳng định đó theo hướng khác, vì…" là tranh luận học thuật. "Bạn sai rồi" thì không, và nó còn phạm luật "nhớ rằng có con người". Đây là bản trực tuyến của tư duy phản biện mà slide 9 của chính deck này đề cao.</li>
<li><strong>Áp dụng ở FPTU.</strong> Diễn đàn LMS, kênh dự án và bình luận review mã đều chạy trên đúng những quy ước này. Một bình luận pull request viết "vòng lặp này truy vấn lại bên trong mỗi vòng, đưa ra ngoài được không?" thì được sửa; viết "code dở" thì nhận về một đồng đội phòng thủ. Cùng một thông tin, kết quả ngược nhau.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận: bài diễn đàn là <strong>BÁN trang trọng</strong>, không phải trang trọng. Viết nó thành một bài luận nhỏ không có giọng cá nhân cũng lệch y như viết nó thành tin nhắn chat. Slide 109 đưa ra quy cách chính xác.</p>`],

      [109, 'Summary: Reflection/debate forums — the specification (Lehmann & Chamberlin, 2009; Stodel et al., 2006)',
        `<p class="y-chinh">🎯 The final slide of the deck, and it is a specification you can be marked against. Responses should be: <strong>between 150–200 words</strong>, <strong>reflective</strong>, <strong>semi-formal</strong>, <strong>referenced</strong>, and <strong>must respond to other posts</strong>.</p>
<table>
<tr><th>Requirement</th><th>What it means</th><th>Failing it looks like</th></tr>
<tr><td><strong>150–200 words</strong></td><td>Long enough to develop one idea, short enough that classmates read it</td><td>"I agree with you." / a 700-word essay</td></tr>
<tr><td><strong>Reflective</strong></td><td>Connect the material to your own experience and thinking</td><td>Restating the lecture with no "I"</td></tr>
<tr><td><strong>Semi-formal</strong></td><td>Complete sentences and real punctuation, but a personal voice is allowed</td><td>Chat abbreviations at one end; stiff third-person prose at the other</td></tr>
<tr><td><strong>Referenced</strong></td><td>Support claims with sources, cited as in Module 4</td><td>Opinion presented as fact, no citation</td></tr>
<tr><td><strong>Must respond to other posts</strong></td><td>Engage with a named classmate's specific point</td><td>Posting your own piece and never returning</td></tr>
</table>
<ul>
<li><strong>The word count is the deck's only number here, so expect it in the exam.</strong> <strong>150–200 words.</strong> Not 50, not 500. If a question offers several ranges, this is the one.</li>
<li><strong>"Reflective" plus "referenced" is the pair that looks contradictory and is not.</strong> Reflection supplies your experience and judgement; referencing supplies the evidence. The best forum posts alternate: here is what the source says, here is how it matches or clashes with what I have seen, here is what I now think.</li>
<li><strong>"Must respond to other posts" is the requirement students underestimate.</strong> A forum is assessed as a CONVERSATION. Posting once and leaving typically scores poorly no matter how good the post was, because half the specification is untouched. Budget time for a second visit two days later.</li>
<li><strong>A structure that satisfies all five in 150–200 words.</strong> (1) One sentence naming the classmate and the specific point you are responding to. (2) Two or three sentences developing your own position. (3) One piece of evidence with a citation. (4) One sentence of reflection — how it relates to your own experience. (5) One open question back to the thread, which keeps the conversation alive and gives the next person something to answer.</li>
<li><strong>This closes Mooc 1, and the arc is worth seeing.</strong> Slides 1–2 asked you to recall and reflect. The middle taught academic culture, integrity, plagiarism, evaluating and citing sources. Slides 83–93 taught how to fold sources into your own writing. Slides 94–109 moved outward: the law around content (copyright, CC), then your presence in it (networks, identity), then how you speak inside it (netiquette, email, forums).</li>
</ul>
<p class="dap-an">✅ Exam recap for slides 83–109, the five facts most likely to be asked. <strong>(1)</strong> Short quote → quotation marks; long quote → indented, no quotation marks. <strong>(2)</strong> The four ways of changing quotations: ellipses · information prominent · author prominent · [word]/[l]etter. <strong>(3)</strong> Copyright = a moral AND economic right; you may use a work with PERMISSION or under an EXCEPTION. <strong>(4)</strong> Creative Commons does NOT replace copyright law. <strong>(5)</strong> Forum responses: 150–200 words, reflective, semi-formal, referenced, and must respond to other posts.</p>
<p class="meo">💡 Mooc 1 ends here. Remember the assessment structure of SSL101c: the course grade is one 60-minute multiple-choice exam at the university, you need certificates from all five MOOCs to sit it, and finishing early earns a bonus point. Definitions and the pairs that are easy to confuse — quote vs paraphrase, ND vs SA, permission vs exception — are where the marks are decided.</p>`,
        `<p class="y-chinh">🎯 Slide cuối cùng của deck, và nó là một QUY CÁCH mà bạn sẽ bị chấm theo. Bài phản hồi cần: <strong>dài 150–200 từ</strong>, <strong>có tính phản tư (reflective)</strong>, <strong>bán trang trọng</strong>, <strong>có trích nguồn</strong>, và <strong>PHẢI phản hồi bài của người khác</strong>.</p>
<table>
<tr><th>Yêu cầu</th><th>Nghĩa là gì</th><th>Trượt nó trông ra sao</th></tr>
<tr><td><strong>150–200 từ</strong></td><td>Đủ dài để triển khai một ý, đủ ngắn để bạn học chịu đọc</td><td>"Em đồng ý với bạn." / một bài luận 700 từ</td></tr>
<tr><td><strong>Phản tư</strong></td><td>Nối tài liệu với trải nghiệm và suy nghĩ của chính bạn</td><td>Chép lại bài giảng, không có chữ "tôi/em" nào</td></tr>
<tr><td><strong>Bán trang trọng</strong></td><td>Câu đủ thành phần, dấu câu đàng hoàng, nhưng được có giọng cá nhân</td><td>Một đầu là viết tắt kiểu chat; đầu kia là văn ngôi ba cứng đờ</td></tr>
<tr><td><strong>Có trích nguồn</strong></td><td>Chống lưng cho khẳng định bằng nguồn, trích như Module 4 đã dạy</td><td>Ý kiến trình bày như sự thật, không trích dẫn</td></tr>
<tr><td><strong>Phải phản hồi bài khác</strong></td><td>Tương tác với một ý CỤ THỂ của một bạn học có tên</td><td>Đăng bài của mình rồi không bao giờ quay lại</td></tr>
</table>
<ul>
<li><strong>Con số độ dài là CON SỐ DUY NHẤT của deck ở đây, nên hãy chờ nó trong đề.</strong> <strong>150–200 từ.</strong> Không phải 50, không phải 500. Đề đưa ra vài khoảng thì đây là khoảng đúng.</li>
<li><strong>Cặp "phản tư" cộng "có trích nguồn" nhìn như mâu thuẫn mà không mâu thuẫn.</strong> Phản tư cấp trải nghiệm và phán đoán của bạn; trích nguồn cấp bằng chứng. Bài diễn đàn hay nhất đan xen: đây là điều nguồn nói, đây là chỗ nó khớp hoặc chỏi với thứ tôi đã thấy, đây là điều tôi nghĩ sau khi cân hai bên.</li>
<li><strong>"Phải phản hồi bài của người khác" là yêu cầu sinh viên coi nhẹ nhất.</strong> Diễn đàn được chấm như một CUỘC TRÒ CHUYỆN. Đăng một lần rồi biến mất thường bị điểm thấp dù bài đó hay tới đâu, vì nửa quy cách còn chưa đụng tới. Hãy để dành thời gian quay lại lần hai sau hai ngày.</li>
<li><strong>Một bố cục thoả cả năm yêu cầu trong 150–200 từ.</strong> (1) Một câu gọi tên bạn học và ý cụ thể bạn đang phản hồi. (2) Hai ba câu triển khai quan điểm của chính mình. (3) Một mẩu bằng chứng kèm trích dẫn. (4) Một câu phản tư — nó liên hệ thế nào với trải nghiệm của bạn. (5) Một câu hỏi mở ném lại cho luồng, giữ cuộc trò chuyện sống và cho người sau thứ để trả lời.</li>
<li><strong>Đây là chỗ Mooc 1 khép lại, và nên nhìn trọn vòng cung của nó.</strong> Slide 1–2 bảo bạn nhớ lại và phản tư. Phần giữa dạy văn hoá học thuật, liêm chính, đạo văn, đánh giá và trích dẫn nguồn. Slide 83–93 dạy cách gấp nguồn vào chính bài viết của mình. Slide 94–109 đi ra ngoài: luật quanh nội dung (bản quyền, CC), rồi sự hiện diện của bạn trong đó (mạng lưới, danh tính), rồi cách bạn NÓI bên trong nó (netiquette, email, diễn đàn).</li>
</ul>
<p class="dap-an">✅ Ôn thi cho slide 83–109, năm dữ kiện dễ bị hỏi nhất. <strong>(1)</strong> Trích ngắn → ngoặc kép; trích dài → thụt lề, KHÔNG ngoặc kép. <strong>(2)</strong> Bốn cách sửa câu trích: dấu lược · information prominent · author prominent · [word]/[l]etter. <strong>(3)</strong> Bản quyền = quyền tinh thần VÀ quyền kinh tế; được dùng tác phẩm khi CÓ PHÉP hoặc có NGOẠI LỆ. <strong>(4)</strong> Creative Commons KHÔNG thay thế luật bản quyền. <strong>(5)</strong> Bài diễn đàn: 150–200 từ, phản tư, bán trang trọng, có trích nguồn, và phải phản hồi bài của người khác.</p>
<p class="meo">💡 Mooc 1 kết thúc ở đây. Nhớ cấu trúc đánh giá của SSL101c: điểm môn là MỘT bài thi trắc nghiệm 60 phút tại trường, phải có chứng chỉ đủ cả năm MOOC mới được thi, và xong sớm trước hạn thì được cộng một điểm thưởng. Định nghĩa và những cặp dễ lẫn — trích dẫn với diễn giải, ND với SA, có phép với ngoại lệ — mới là chỗ định đoạt điểm số.</p>`],

    ]),
  ].join('\n'),
};
