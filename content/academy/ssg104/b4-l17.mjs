/**
 * Buổi 4 · Bài 17 — Professional writing (23 slide).
 *
 * Bám bộ "Session 4_..._Lesson 17_Professional writing.pptx". Syllabus hỏi
 * CQ13.3 về quá trình rà soát (revision); bản Academy cũ chỉ có câu "viết rõ,
 * gọn, chuyên nghiệp" và không có bảng kiểm 12 điểm, không có 4 mục rà tổng
 * quát, 6 mục rà cụ thể, 12 điểm rà văn phong.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's4-l17';

export const b4l17 = [
  walkHead(D, 1, 23,
    'Four checklists in one deck: 12 planning points, 4 general revision categories, 6 specific ones, and 12 style revisions. Together they are the marking scheme for every written thing you hand in.',
    'Bốn bảng kiểm trong một bộ slide: 12 điểm chuẩn bị, 4 nhóm rà tổng quát, 6 mục rà cụ thể, và 12 điểm rà văn phong. Gộp lại, đó chính là phiếu chấm cho mọi thứ bạn nộp bằng chữ.'),

  slide(D, 1, 'Professional Writing — Session IV',
    `<p class="y-chinh">🎯 Title slide.</p>
     <p class="meo">💡 The syllabus places professional writing at session 39, right before business email and letters (40–41) and the report (42). This deck is the foundation for all three.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề.</p>
     <p class="meo">💡 Syllabus xếp phần viết chuyên nghiệp ở buổi 39, ngay trước email và thư công việc (40–41) và báo cáo (42). Bộ slide này là nền cho cả ba.</p>`),

  slide(D, 2, 'Chapter outline (5 parts)',
    `<p class="y-chinh">🎯 Five parts.</p>
     <ol>
       <li>Think, then write: writing preparation</li>
       <li>A planning checklist for business messages</li>
       <li>General revision points to consider</li>
       <li>Specific revision points to consider</li>
       <li>Style revisions</li>
     </ol>
     <p class="meo">💡 Notice three of the five are about revision. Writing in this course is treated as a process whose quality is decided after the first draft.</p>`,
    `<p class="y-chinh">🎯 Năm phần.</p>
     <ol>
       <li>Nghĩ đã, rồi mới viết: chuẩn bị viết</li>
       <li>Bảng kiểm chuẩn bị cho thông điệp công việc</li>
       <li>Các điểm rà soát tổng quát</li>
       <li>Các điểm rà soát cụ thể</li>
       <li>Rà soát văn phong</li>
     </ol>
     <p class="meo">💡 Để ý ba trong năm phần nói về rà soát. Môn này coi viết là một quá trình mà chất lượng được định đoạt sau bản nháp đầu tiên.</p>`),

  slide(D, 3, 'Learning objectives (5)',
    `<p class="y-chinh">🎯 Five objectives, each tied to a countable list.</p>
     <ol>
       <li>Discuss the process of writing preparation.</li>
       <li>List a planning checklist for business messages (<strong>12 items</strong>).</li>
       <li>List <strong>three general elements</strong> of every document that require revision.</li>
       <li>List <strong>six specific elements</strong> to check.</li>
       <li>Discuss and demonstrate <strong>twelve points</strong> for style revision.</li>
     </ol>
     <p class="meo">💡 Objective 3 says three; the slide later gives four (content, organization, style, readability). Learn the four — the extra one is readability.</p>`,
    `<p class="y-chinh">🎯 Năm mục tiêu, mỗi cái gắn với một danh sách đếm được.</p>
     <ol>
       <li>Bàn về quá trình chuẩn bị viết.</li>
       <li>Liệt kê bảng kiểm chuẩn bị cho thông điệp công việc (<strong>12 mục</strong>).</li>
       <li>Liệt kê <strong>ba yếu tố tổng quát</strong> của mọi văn bản cần được rà soát.</li>
       <li>Liệt kê <strong>sáu yếu tố cụ thể</strong> cần kiểm.</li>
       <li>Bàn và thực hành <strong>mười hai điểm</strong> rà soát văn phong.</li>
     </ol>
     <p class="meo">💡 Mục tiêu 3 nói ba; nhưng slide phía sau đưa ra bốn (nội dung, bố cục, văn phong, độ dễ đọc). Hãy học bốn — cái thêm vào là độ dễ đọc.</p>`),

  slide(D, 4, 'Introduction',
    `<p class="y-chinh">🎯 Three framing statements.</p>
     <ul>
       <li>You learned to speak and to write, and your skill can <strong>continue to improve across your lifetime</strong> — which should encourage you to write.</li>
       <li>Writing well enough to succeed in a career needs solid research skills combined with effective preparation — a range of skill sets that require time and practice.</li>
       <li>Regardless of what you write, there is the possibility — even the probability — that <strong>misunderstandings will occur</strong>.</li>
     </ul>
     <p class="meo">💡 The third point sets the standard: you are not writing to be understandable, you are writing to be hard to misunderstand.</p>`,
    `<p class="y-chinh">🎯 Ba câu định khung.</p>
     <ul>
       <li>Bạn đã học nói và học viết, và kỹ năng ấy có thể <strong>tiếp tục tiến bộ suốt đời</strong> — điều đó đáng để bạn bắt tay vào viết.</li>
       <li>Viết đủ tốt để thành công trong nghề cần kỹ năng nghiên cứu vững cộng với sự chuẩn bị hiệu quả — cả một tập kỹ năng cần thời gian và luyện tập.</li>
       <li>Dù bạn viết gì, vẫn luôn có khả năng — thậm chí là xác suất cao — rằng <strong>sẽ có hiểu lầm</strong>.</li>
     </ul>
     <p class="meo">💡 Ý thứ ba đặt ra chuẩn mực: bạn không viết để người ta hiểu được, bạn viết để người ta khó hiểu sai.</p>`),

  slide(D, 5, 'Think, then write — writing preparation',
    `<p class="y-chinh">🎯 Three practical starting rules.</p>
     <ul>
       <li>Know <strong>when you are most productive</strong>.</li>
       <li><strong>Don't wait to be in the "right mood."</strong> If you wait for the right mood to strike, you will probably never start at all.</li>
       <li>Develop a habit of <strong>concentrating</strong> when you write. Our lives involve constant interruption; our minds can multitask, but they also get easily distracted.</li>
     </ul>
     <p class="meo">💡 These three are the same advice as Lesson 13 on stress management, seen from the other side: routine and protected attention are what make hard tasks start.</p>`,
    `<p class="y-chinh">🎯 Ba quy tắc khởi động rất thực dụng.</p>
     <ul>
       <li>Biết <strong>lúc nào mình làm việc năng suất nhất</strong>.</li>
       <li><strong>Đừng đợi tới lúc "có hứng".</strong> Chờ hứng tới thì nhiều khả năng bạn chẳng bao giờ bắt đầu.</li>
       <li>Rèn thói quen <strong>tập trung</strong> khi viết. Đời sống của ta đầy những cú ngắt quãng; đầu óc làm nhiều việc cùng lúc được, nhưng cũng rất dễ bị phân tán.</li>
     </ul>
     <p class="meo">💡 Ba điều này chính là lời khuyên ở Bài 13 về quản lý căng thẳng, nhìn từ phía bên kia: nhịp sinh hoạt đều và sự chú ý được bảo vệ mới là thứ giúp bắt đầu những việc khó.</p>`),

  slide(D, 6, 'Think critically — three biases to name',
    `<p class="y-chinh">🎯 Critical thinking requires acknowledging and addressing your own tendency toward three biases.</p>
     <ul>
       <li>As you read, research and prepare, gather information from a <strong>range of reliable sources — whether or not it leads to conclusions you expected</strong>.</li>
       <li>Reading and writing from an audience-centred view means acknowledging your confirmation bias and moving beyond it to consider multiple frames of reference.</li>
     </ul>
     <p class="meo">💡 This is Lesson 8 applied to writing. There, critical thinking judged other people's claims; here it judges your own draft.</p>`,
    `<p class="y-chinh">🎯 Tư duy phản biện đòi bạn thừa nhận và xử lý ba thiên kiến của chính mình.</p>
     <ul>
       <li>Khi đọc, khi nghiên cứu và chuẩn bị, hãy thu thập thông tin từ <strong>nhiều nguồn đáng tin — bất kể nó có dẫn tới kết luận bạn mong đợi hay không</strong>.</li>
       <li>Đọc và viết theo góc nhìn lấy người đọc làm trung tâm nghĩa là thừa nhận thiên kiến xác nhận của mình rồi vượt qua nó để cân nhắc nhiều hệ quy chiếu khác.</li>
     </ul>
     <p class="meo">💡 Đây là Bài 8 đem áp vào việc viết. Ở đó, tư duy phản biện phán xét khẳng định của người khác; ở đây nó phán xét chính bản nháp của bạn.</p>`),

  slide(D, 7, 'The three biases defined',
    `<p class="y-chinh">🎯 Three named biases, each with the slide's own flat-earth example.</p>
     <ul>
       <li><span class="nhan">Confirmation bias</span> — paying attention only to information that reinforces your existing beliefs, ignoring or discrediting what contradicts them. <em>Example: a person who believes the earth is flat looks for information and finds only what supports that belief.</em></li>
       <li><span class="nhan">Egocentrism</span> — using <strong>self-centred</strong> standards to decide what to believe and what to reject. <em>Example: he believes the earth is flat and never questions it.</em></li>
       <li><span class="nhan">Sociocentrism</span> — using <strong>society-centred</strong> standards. <em>Example: he believes it because everyone in his group does, though he has never checked.</em></li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Phân biệt hai cái cuối:</strong> egocentrism is "I decide"; sociocentrism is "we decide". Both skip the step of checking, which is the actual failure.</p>`,
    `<p class="y-chinh">🎯 Ba thiên kiến được gọi tên, mỗi cái kèm ví dụ "trái đất phẳng" ngay trên slide.</p>
     <ul>
       <li><span class="nhan">Thiên kiến xác nhận</span> — chỉ để ý tới thông tin củng cố niềm tin sẵn có, phớt lờ hoặc bác bỏ thứ trái ngược. <em>Ví dụ: người tin trái đất phẳng đi tìm thông tin và chỉ tìm thấy thứ ủng hộ niềm tin đó.</em></li>
       <li><span class="nhan">Vị kỷ nhận thức</span> — dùng chuẩn <strong>lấy mình làm trung tâm</strong> để quyết tin gì, bác gì. <em>Ví dụ: anh ta tin trái đất phẳng và không bao giờ tự hỏi lại.</em></li>
       <li><span class="nhan">Vị nhóm nhận thức</span> — dùng chuẩn <strong>lấy cộng đồng làm trung tâm</strong>. <em>Ví dụ: anh ta tin vì cả nhóm mình đều tin, dù bản thân chưa từng kiểm chứng.</em></li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Phân biệt hai cái sau:</strong> vị kỷ là "tôi quyết"; vị nhóm là "chúng tôi quyết". Cả hai đều bỏ qua bước kiểm chứng, và đó mới là chỗ hỏng thật sự.</p>`),

  slide(D, 8, 'Overcome fear of writing — the three fears',
    `<p class="y-chinh">🎯 A positive attitude is a key ingredient, so name what is holding you back.</p>
     <p>People often fear writing for three main reasons:</p>
     <ol>
       <li><span class="nhan">Negative orientation</span></li>
       <li><span class="nhan">Risk of failure</span></li>
       <li><span class="nhan">Fear of the unknown</span></li>
     </ol>`,
    `<p class="y-chinh">🎯 Thái độ tích cực là một thành phần then chốt, nên hãy gọi tên thứ đang cản bạn.</p>
     <p>Người ta sợ viết thường vì ba lý do chính:</p>
     <ol>
       <li><span class="nhan">Định kiến tiêu cực sẵn có</span></li>
       <li><span class="nhan">Sợ thất bại</span></li>
       <li><span class="nhan">Sợ cái chưa biết</span></li>
     </ol>`),

  slide(D, 9, 'The three fears and their solutions',
    `<p class="y-chinh">🎯 Each fear, with the remedy the slide gives.</p>
     <p><span class="nhan">1. Negative orientation</span> — a pre-existing negative association with the task. <em>Solution:</em> admit it first, then actively develop skills in ways that show <strong>measurable gain</strong> and lead to positive affirmation.</p>
     <p><span class="nhan">2. Risk of failure</span> — common across public speaking and writing; it leads to not knowing what to write or where to start, and waiting helplessly. <em>Solution:</em> <strong>let go of perfectionism</strong>. Writing is a process: make a rough draft, then take a second or third chance. Save the perfectionism for polishing.</p>
     <p><span class="nhan">3. Fear of the unknown</span> — understandable if you have never written a formal business report. <em>Solution:</em> <strong>make the unknown known</strong> — examine several successful examples until you can see the components and the organisational pattern before you start.</p>
     <p class="meo">💡 Solution 3 is why this Academy course shows real documents: once you have seen two reports, the third stops being mysterious.</p>`,
    `<p class="y-chinh">🎯 Từng nỗi sợ, kèm cách chữa mà slide đưa ra.</p>
     <p><span class="nhan">1. Định kiến tiêu cực</span> — sẵn có ác cảm với công việc này. <em>Cách chữa:</em> thừa nhận trước đã, rồi chủ động rèn kỹ năng theo cách cho thấy <strong>tiến bộ đo được</strong> và dẫn tới sự khẳng định tích cực.</p>
     <p><span class="nhan">2. Sợ thất bại</span> — nỗi sợ phổ biến cả khi nói trước đám đông lẫn khi viết; nó khiến ta không biết viết gì, bắt đầu từ đâu, rồi ngồi chờ bất lực. <em>Cách chữa:</em> <strong>buông cái chủ nghĩa hoàn hảo</strong>. Viết là một quá trình: cứ nháp thô trước, rồi còn lần hai, lần ba. Để dành sự cầu toàn cho khâu đánh bóng.</p>
     <p><span class="nhan">3. Sợ cái chưa biết</span> — dễ hiểu nếu bạn chưa từng viết một báo cáo công việc chính thức. <em>Cách chữa:</em> <strong>biến cái chưa biết thành cái đã biết</strong> — xem vài ví dụ thành công cho tới khi nhìn ra được các thành phần và bố cục trước cả khi đặt bút.</p>
     <p class="meo">💡 Cách chữa số 3 là lý do khoá học này cho bạn xem tài liệu thật: xem xong hai bản báo cáo thì bản thứ ba thôi bí hiểm.</p>`),

  slide(D, 10, 'A planning checklist for business messages (12 items)',
    `<p class="y-chinh">🎯 Twelve checks before you write — objective 2 of the lesson.</p>
     <ol class="hai-cot">
       <li>Determine your general purpose</li>
       <li>Determine your specific purpose (desired outcome)</li>
       <li>Make sure your purpose is realistic</li>
       <li>Make sure your timing is appropriate</li>
       <li>Make sure your sources are credible</li>
       <li>Make sure the message reflects positively on your business</li>
       <li>Determine audience size</li>
       <li>Determine audience composition</li>
       <li>Determine audience knowledge and awareness of the topic</li>
       <li>Anticipate probable responses</li>
       <li>Select the correct channel</li>
       <li>Make sure the information is accurate, ethical and pertinent</li>
     </ol>
     <p class="meo">💡 Items 7–10 are all about the reader. Half of a planning checklist is research into who will read it — which is why "audience-centred" keeps reappearing.</p>`,
    `<p class="y-chinh">🎯 Mười hai điều cần kiểm trước khi viết — mục tiêu 2 của bài.</p>
     <ol class="hai-cot">
       <li>Xác định mục đích tổng quát</li>
       <li>Xác định mục đích cụ thể (kết quả mong muốn)</li>
       <li>Bảo đảm mục đích là khả thi</li>
       <li>Bảo đảm thời điểm là phù hợp</li>
       <li>Bảo đảm nguồn tin đáng tin cậy</li>
       <li>Bảo đảm thông điệp có lợi cho hình ảnh tổ chức</li>
       <li>Xác định quy mô người đọc</li>
       <li>Xác định thành phần người đọc</li>
       <li>Xác định hiểu biết của người đọc về chủ đề</li>
       <li>Lường trước những phản hồi có thể xảy ra</li>
       <li>Chọn đúng kênh truyền đạt</li>
       <li>Bảo đảm thông tin chính xác, có đạo đức và đúng trọng tâm</li>
     </ol>
     <p class="meo">💡 Mục 7–10 đều nói về người đọc. Một nửa bảng kiểm chuẩn bị là việc tìm hiểu ai sẽ đọc — và đó là lý do cụm "lấy người đọc làm trung tâm" cứ quay lại mãi.</p>`),

  slide(D, 11, 'Determining your purpose — general and specific',
    `<p class="y-chinh">🎯 All communication has both, and how well you identify them decides how effective the writing is.</p>
     <ul>
       <li><span class="nhan">General purposes</span> — the overall goal: to inform, persuade, entertain, facilitate interaction, or motivate a reader.</li>
       <li><span class="nhan">Specific purpose</span> — the <strong>intended outcome</strong>: the result that will happen once your writing has been read.</li>
     </ul>
     <p class="meo">💡 Test: write the specific purpose as a sentence starting "After reading this, the reader will…". If you cannot finish that sentence, do not start the document.</p>`,
    `<p class="y-chinh">🎯 Mọi giao tiếp đều có cả hai, và bạn xác định chúng rõ tới đâu sẽ quyết định bài viết hiệu quả tới đâu.</p>
     <ul>
       <li><span class="nhan">Mục đích tổng quát</span> — đích lớn: để thông tin, thuyết phục, giải trí, tạo tương tác, hay thúc đẩy người đọc.</li>
       <li><span class="nhan">Mục đích cụ thể</span> — <strong>kết quả nhắm tới</strong>: điều sẽ xảy ra sau khi người ta đọc xong.</li>
     </ul>
     <p class="meo">💡 Phép thử: viết mục đích cụ thể thành câu bắt đầu bằng "Đọc xong cái này, người đọc sẽ…". Nếu không hoàn thành nổi câu đó thì đừng bắt đầu viết.</p>`),

  slide(D, 12, 'Determining your purpose — the six elements',
    `<p class="y-chinh">🎯 Every piece of writing needs to cover six predictable elements.</p>
     <ul class="hai-cot">
       <li>Who</li>
       <li>What</li>
       <li>When</li>
       <li>Where</li>
       <li>How</li>
       <li>Why</li>
     </ul>
     <p class="meo">💡 Same six as the proposal's core section in Lesson 7. Using them as a checklist on a finished draft catches omissions faster than rereading.</p>`,
    `<p class="y-chinh">🎯 Bài viết nào cũng phải phủ được sáu yếu tố quen thuộc.</p>
     <ul class="hai-cot">
       <li>Ai</li>
       <li>Cái gì</li>
       <li>Khi nào</li>
       <li>Ở đâu</li>
       <li>Bằng cách nào</li>
       <li>Vì sao</li>
     </ul>
     <p class="meo">💡 Vẫn sáu yếu tố như phần lõi của bản đề xuất ở Bài 7. Dùng chúng làm bảng kiểm trên bản nháp đã xong sẽ bắt được chỗ thiếu nhanh hơn là đọc lại từ đầu.</p>`),

  slide(D, 13, 'General revision points — the four categories',
    `<p class="y-chinh">🎯 Four things to evaluate across the whole document.</p>
     <ul>
       <li><span class="nhan">Content</span> — is everything needed there, and nothing that is not?</li>
       <li><span class="nhan">Organization</span> — does the order serve the reader?</li>
       <li><span class="nhan">Style</span> — is the voice right for this audience?</li>
       <li><span class="nhan">Readability</span> — can it be read quickly and correctly?</li>
     </ul>
     <p class="meo">💡 Do these four <em>before</em> the six specific checks on slide 15. Fixing commas in a paragraph you are about to delete is wasted work.</p>`,
    `<p class="y-chinh">🎯 Bốn thứ cần đánh giá trên toàn văn bản.</p>
     <ul>
       <li><span class="nhan">Nội dung</span> — đã có đủ thứ cần và không có thứ thừa chưa?</li>
       <li><span class="nhan">Bố cục</span> — trật tự sắp xếp có phục vụ người đọc không?</li>
       <li><span class="nhan">Văn phong</span> — giọng văn có hợp với người đọc này không?</li>
       <li><span class="nhan">Độ dễ đọc</span> — có đọc nhanh và hiểu đúng được không?</li>
     </ul>
     <p class="meo">💡 Hãy làm bốn việc này <em>trước</em> sáu mục kiểm cụ thể ở slide 15. Sửa dấu phẩy trong đoạn văn sắp bị xoá là công toi.</p>`),

  slide(D, 14, 'Activity — find a good example of writing',
    `<p class="y-chinh">🎯 Find a particularly good example of writing according to the four criteria, review it, and share it with classmates.</p>
     <p class="meo">💡 Say which of the four it does best. "It reads well" is not an analysis; "the organisation puts the decision in the first paragraph" is.</p>`,
    `<p class="y-chinh">🎯 Tìm một ví dụ viết đặc biệt tốt theo bốn tiêu chí trên, phân tích rồi chia sẻ với bạn học.</p>
     <p class="meo">💡 Hãy nói rõ nó làm tốt nhất ở tiêu chí nào. "Đọc trôi lắm" không phải phân tích; "bố cục đặt quyết định ngay ở đoạn đầu" mới là.</p>`),

  slide(D, 15, 'Specific revision points — the six checks',
    `<p class="y-chinh">🎯 Six concrete things to check, in order.</p>
     <ol>
       <li><span class="nhan">Format</span></li>
       <li><span class="nhan">Facts</span></li>
       <li><span class="nhan">Names</span></li>
       <li><span class="nhan">Spelling</span></li>
       <li><span class="nhan">Punctuation</span></li>
       <li><span class="nhan">Grammar</span></li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Vì sao "Names" đứng riêng:</strong> a misspelled name is not a typo to the person who owns it. It is the error that costs the most credibility per character, which is why it gets its own line above spelling.</p>`,
    `<p class="y-chinh">🎯 Sáu thứ cụ thể cần kiểm, theo thứ tự.</p>
     <ol>
       <li><span class="nhan">Định dạng</span></li>
       <li><span class="nhan">Dữ kiện</span></li>
       <li><span class="nhan">Tên riêng</span></li>
       <li><span class="nhan">Chính tả</span></li>
       <li><span class="nhan">Dấu câu</span></li>
       <li><span class="nhan">Ngữ pháp</span></li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Vì sao "Tên riêng" đứng riêng một dòng:</strong> viết sai tên không phải lỗi gõ nhầm trong mắt người mang cái tên đó. Đó là lỗi làm mất uy tín nhiều nhất trên mỗi ký tự, nên nó được tách riêng và đặt trên cả chính tả.</p>`),

  slide(D, 16, 'Activity — find an error in a published document',
    `<p class="y-chinh">🎯 Find an example of an error in a published document and share it with classmates.</p>
     <p class="meo">💡 Classify it against the six checks. Most published errors are facts or names, not grammar — which tells you where to spend your own proofreading time.</p>`,
    `<p class="y-chinh">🎯 Tìm một lỗi trong một tài liệu đã xuất bản và chia sẻ với bạn học.</p>
     <p class="meo">💡 Hãy xếp nó vào một trong sáu mục kiểm. Phần lớn lỗi trên tài liệu đã in là lỗi dữ kiện hoặc tên riêng, không phải ngữ pháp — điều đó cho biết bạn nên dồn thời gian soát lỗi vào đâu.</p>`),

  slide(D, 17, 'Style revisions (1–6)',
    `<p class="y-chinh">🎯 Twelve style revisions; the first six.</p>
     <ul>
       <li><span class="nhan">Break up long sentences</span></li>
       <li><span class="nhan">Revise big words and long phrases</span></li>
       <li><span class="nhan">Evaluate long prepositional phrases</span></li>
       <li><span class="nhan">Delete repetitious words</span></li>
       <li><span class="nhan">Eliminate archaic expressions or references</span></li>
       <li><span class="nhan">Avoid fillers</span></li>
     </ul>
     <p class="meo">💡 Worked example of items 2–3: "in the event that" → "if"; "at this point in time" → "now". Each replacement removes words without removing meaning, which is the whole test.</p>`,
    `<p class="y-chinh">🎯 Mười hai điểm rà văn phong; sáu cái đầu.</p>
     <ul>
       <li><span class="nhan">Chẻ nhỏ câu dài</span></li>
       <li><span class="nhan">Sửa lại từ đao to búa lớn và cụm từ dài dòng</span></li>
       <li><span class="nhan">Xem lại các cụm giới từ dài</span></li>
       <li><span class="nhan">Xoá từ lặp</span></li>
       <li><span class="nhan">Bỏ lối diễn đạt hoặc dẫn chiếu lỗi thời</span></li>
       <li><span class="nhan">Tránh chữ độn</span></li>
     </ul>
     <p class="meo">💡 Ví dụ cho mục 2–3: "trong trường hợp mà" → "nếu"; "tại thời điểm hiện tại" → "hiện nay". Mỗi lần thay là bớt chữ mà không bớt nghĩa, và đó chính là phép thử.</p>`),

  slide(D, 18, 'Style revisions (7–12)',
    `<p class="y-chinh">🎯 The remaining six.</p>
     <ul>
       <li><span class="nhan">Eliminate slang</span></li>
       <li><span class="nhan">Evaluate clichés</span></li>
       <li><span class="nhan">Emphasise precise words</span></li>
       <li><span class="nhan">Evaluate parallel construction</span></li>
       <li><span class="nhan">Obscured verbs</span></li>
       <li><span class="nhan">The "Is it professional?" test</span></li>
     </ul>
     <p class="meo">💡 "Obscured verbs" means a verb hidden inside a noun: "conduct an investigation of" → "investigate", "make a decision" → "decide". It is the single highest-yield edit in business writing.</p>`,
    `<p class="y-chinh">🎯 Sáu điểm còn lại.</p>
     <ul>
       <li><span class="nhan">Bỏ tiếng lóng</span></li>
       <li><span class="nhan">Soi lại các sáo ngữ</span></li>
       <li><span class="nhan">Nhấn vào những từ chính xác</span></li>
       <li><span class="nhan">Kiểm cấu trúc song song</span></li>
       <li><span class="nhan">Động từ bị chôn</span></li>
       <li><span class="nhan">Phép thử "Cái này có chuyên nghiệp không?"</span></li>
     </ul>
     <p class="meo">💡 "Động từ bị chôn" là động từ bị giấu trong một danh từ: "tiến hành việc điều tra" → "điều tra", "đưa ra quyết định" → "quyết định". Đây là cú sửa cho hiệu quả cao nhất trong văn bản công việc.</p>`),

  slide(D, 19, 'Activity — find a bad example of business writing',
    `<p class="y-chinh">🎯 Find a poor example of business writing, review it, and share it with classmates.</p>
     <p class="meo">💡 Name the specific style item it breaks. "It's badly written" teaches nobody; "three obscured verbs in one sentence" is a lesson your classmates can use.</p>`,
    `<p class="y-chinh">🎯 Tìm một ví dụ viết công việc kém, phân tích và chia sẻ với bạn học.</p>
     <p class="meo">💡 Hãy gọi tên đúng điểm văn phong mà nó vi phạm. "Viết dở lắm" thì chẳng dạy ai được gì; "ba động từ bị chôn trong một câu" mới là bài học mà bạn học dùng được.</p>`),

  slide(D, 20, 'Activity — cut a text to half its length',
    `<p class="y-chinh">🎯 Select a piece of writing from a website, book, newspaper or magazine. Edit it to <strong>half its original length</strong>, then share the original and your revised copy.</p>
     <p class="meo">💡 The hardest and most useful exercise in this deck. At 50% you can no longer trim adjectives — you have to decide what the piece is actually for, which is the skill objective 5 is really testing.</p>`,
    `<p class="y-chinh">🎯 Chọn một bài viết từ website, sách, báo hoặc tạp chí. Biên tập lại còn <strong>một nửa độ dài gốc</strong>, rồi chia sẻ cả bản gốc lẫn bản bạn sửa.</p>
     <p class="meo">💡 Bài tập khó nhất và hữu ích nhất trong bộ slide này. Xuống tới 50% thì bạn hết chỗ cắt tính từ — bạn buộc phải quyết xem bài viết này rốt cuộc để làm gì, và đó mới là kỹ năng mà mục tiêu 5 đang thật sự kiểm.</p>`),

  slide(D, 21, 'Key takeaways (5)',
    `<p class="y-chinh">🎯 The lesson in five sentences.</p>
     <ol>
       <li>There are several reasons people fear writing, and several strategies to reduce or eliminate those fears.</li>
       <li>The twelve-item checklist is a reminder of the importance of <strong>preparation</strong>.</li>
       <li>The four categories — content, organization, style, readability — provide a template for <strong>general revision</strong>.</li>
       <li>Revising for format, facts, names, spelling, punctuation and grammar corrects many common errors.</li>
       <li>Revising for style increases a document's <strong>clarity, conciseness and professionalism</strong>.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Cả bài gói trong năm câu.</p>
     <ol>
       <li>Có nhiều lý do khiến người ta sợ viết, và cũng có nhiều cách để giảm hoặc xoá nỗi sợ ấy.</li>
       <li>Bảng kiểm mười hai mục là lời nhắc về tầm quan trọng của <strong>khâu chuẩn bị</strong>.</li>
       <li>Bốn nhóm — nội dung, bố cục, văn phong, độ dễ đọc — là khuôn mẫu cho <strong>rà soát tổng quát</strong>.</li>
       <li>Rà định dạng, dữ kiện, tên riêng, chính tả, dấu câu và ngữ pháp sẽ sửa được nhiều lỗi phổ biến.</li>
       <li>Rà văn phong làm tăng <strong>độ rõ, độ gọn và tính chuyên nghiệp</strong> của văn bản.</li>
     </ol>`),

  slide(D, 22, 'Exercises (3)',
    `<p class="y-chinh">🎯 Three exercises, the third one done in pairs.</p>
     <ol>
       <li>Find an error in a published document and share it.</li>
       <li>Find a good example of effective business writing, review it, and share it.</li>
       <li><strong>Swap a draft assignment with a classmate</strong> and review the spelling, grammar and punctuation, using proofreading marks where applicable.</li>
     </ol>
     <p class="meo">💡 Exercise 3 is worth doing for real before every submission in this course. You cannot proofread your own draft properly — you read what you meant, not what you wrote.</p>`,
    `<p class="y-chinh">🎯 Ba bài tập, bài thứ ba làm theo cặp.</p>
     <ol>
       <li>Tìm một lỗi trong tài liệu đã xuất bản và chia sẻ.</li>
       <li>Tìm một ví dụ viết công việc hiệu quả, phân tích và chia sẻ.</li>
       <li><strong>Đổi bản nháp bài tập với một bạn học</strong> rồi soát chính tả, ngữ pháp, dấu câu, dùng ký hiệu soát lỗi ở chỗ nào phù hợp.</li>
     </ol>
     <p class="meo">💡 Bài tập 3 đáng làm thật trước mỗi lần nộp bài trong môn này. Bạn không thể tự soát bản nháp của mình cho tử tế — bạn đọc ra thứ mình định viết, chứ không phải thứ mình đã viết.</p>`),

  slide(D, 23, 'Q&A',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Three biases to name in your own thinking?</li>
       <li>The four general revision categories?</li>
       <li>The six specific checks — and why "names" has its own line?</li>
       <li>What is an obscured verb, with an example?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Ba thiên kiến cần gọi tên trong chính suy nghĩ của bạn?</li>
       <li>Bốn nhóm rà soát tổng quát?</li>
       <li>Sáu mục kiểm cụ thể — và vì sao "tên riêng" được tách riêng một dòng?</li>
       <li>Động từ bị chôn là gì, cho một ví dụ?</li>
     </ol>`),

  books([
    ['bcs', 'chương Revising and Presenting Your Writing', 'chương Revising and Presenting Your Writing'],
    ['bc7', 'chương về writing process và revision', 'chương về quá trình viết và rà soát'],
  ]),

  bi(
    `<h3>✅ What this replaces</h3>
     <p>The old Academy lesson said business writing should be "clear, concise and professional" and stopped. The syllabus asks about the revision process (CQ13.3); the twelve planning points, four general categories, six specific checks and twelve style revisions were all missing.</p>`,
    `<h3>✅ Bài này thay cho cái gì</h3>
     <p>Bài cũ trên Academy nói viết công việc phải "rõ, gọn, chuyên nghiệp" rồi dừng. Syllabus hỏi về quá trình rà soát (CQ13.3); mười hai điểm chuẩn bị, bốn nhóm rà tổng quát, sáu mục kiểm cụ thể và mười hai điểm rà văn phong đều không có.</p>`),
].join('\n');
