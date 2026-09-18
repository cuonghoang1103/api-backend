/**
 * PRF192 · Slot 05-07 — Basic Logics, học theo từng slide: PHẦN 3 (slide 41–60).
 * Deck 'prf3' (PRF3), 60 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf3/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_05_06_07_Basic_Logics.pptx của trường
 * (/tmp/prf192-text/prf3.txt, slide 41→60) + các ảnh mã nguồn nhúng trong pptx
 * (ppt/media/image34, 47, 48, 49, 50, 51, 53) đã đọc trực tiếp để lấy đúng code.
 *
 * MỌI chương trình và bảng vết dưới đây đã được biên dịch thật bằng `cc -Wall` và chạy:
 *   · slide 51 Walkthrough1.c        → in 41 ✓ (bảng vết 6 dòng khớp)
 *     ⚠ Bảng TRÊN SLIDE ghi a+b = 18 ở dòng a=8, b=8 — đúng ra là 16. Đã nêu rõ trong bài,
 *       không sửa slide. Kết quả cuối vẫn là 41 vì 16 < 20 nên vòng lặp vẫn chạy tiếp.
 *   · slide 52 (S += i khi i%2!=0 && i%3!=0, i+=3, n=15) → S = 21 ✓ khớp slide
 *   · slide 53 scanf("%d%d",&n,&m) với "8 12"  → n=8, m=12 → S = 0 ✓
 *              scanf("%da%d",&n,&m) với "8a12" → n=8, m=12 → S = 0 ✓
 *              bảng Modify/Input (n=12, m=8)   → S = 50 ✓ (cả 4 dòng)
 *              "%d-%d" với "12 -8" → scanf trả 1, m là rác ✓ (bẫy đã nêu)
 *   · slide 55/58 debug_demo.c → "The odd number is: 1/3/5" + "Sum the odd numbers is: 9" ✓
 *   · slide 46/48 `if (x = 5)` + biến thừa → cc -Wall cho -Wparentheses + -Wunused-variable ✓
 *   · slide 47 `for(...);` thân rỗng → sum = 6 thay vì 15, cc -Wall cho -Wempty-body ✓
 *   · slide 47 `while ((c = getchar()) != EOF)` với "banana bread" → 'a' xuất hiện 4 lần ✓
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf3';

export default {
  title: '4.0c — Slide by slide: Programming style, hand-tracing walkthroughs & debugging (slides 41–60)|||4.0c — Slide bài giảng: Phong cách lập trình, chạy tay bằng bảng vết & gỡ lỗi (slide 41–60)',
  slug: 'prf192-4-0c-slides-phong-cach-walkthrough-debug',
  type: 'DOCUMENT',
  description: 'Phần cuối của Slot 05-07 (slide 41–60): bảy slide về phong cách lập trình (đặt tên, thụt lề, chú thích và ba slide guidelines), rồi phần trọng tâm Walkthrough — chạy tay chương trình bằng bảng vết, với lời giải từng bước cho Example 1, Example 2 và bài Exercise về scanf. Khép lại bằng năm slide gỡ lỗi trên Dev-C++ (bật -g, đặt breakpoint, Add watch, F7 Next Line) kèm cách làm tương đương bằng VS Code + gdb, bài Exercise về bốn loại lỗi và slide tổng kết. Mọi chương trình trong bài đã được biên dịch và chạy thật để đối chiếu từng con số.',
  content: [
    walkHead(D, 41, 60),
    walk(D, [
      [41, 'Programming Styles (section divider)',
        `<p class="y-chinh">🎯 A divider slide that changes the question being asked. Everything up to slide 40 answered <em>"how do I make the machine do this?"</em>. From here the question becomes <em>"how do I write it so a human can read it?"</em>.</p>
<ul>
<li><strong>Why style is graded at all</strong> — the compiler accepts any legal C, however ugly. But your assignment, your lab work and your future pull requests are read by people. Slide 42 puts it plainly: a well-written program is <em>a pleasure to read</em>.</li>
<li><strong>Where this sits in the deck</strong> — the objectives on slide 3 listed three questions. Question 1 ("How to develop a C program?") was answered by the logic constructs, slides 5–40. This divider opens question 2 ("What are the things I should follow?"). Slide 49 will open question 3 ("How can I understand a program?").</li>
<li><strong>Four topics only</strong> — naming (slide 43), indentation (slide 44), comments (slide 45), and general guidelines (slides 46–48). That is the whole of the style section; it is short enough to actually memorise.</li>
<li><strong>Style is not decoration</strong> — almost every rule you are about to read exists because breaking it once caused a real bug: a missing brace, a variable named <code>l</code> that looked like <code>1</code>, a <code>=</code> typed where <code>==</code> was meant. Style rules are bug repellent that happens to look tidy.</li>
<li><strong>The habit to build now</strong> — you have written maybe twenty programs so far. Twenty is exactly the right number: big enough that you have a style, small enough that you can still change it.</li>
</ul>
<p class="meo">💡 Practical test for any style rule: could a classmate who has never seen your program find the bug in it in five minutes? If yes, the style is good enough. If they cannot even find <code>main</code>, it is not.</p>`,
        `<p class="y-chinh">🎯 Một slide phân mục, nhưng nó đổi hẳn câu hỏi đang đặt ra. Từ đầu tới slide 40 ta trả lời <em>"làm sao bắt máy làm việc này?"</em>. Từ đây câu hỏi thành <em>"viết thế nào để CON NGƯỜI đọc được?"</em>.</p>
<ul>
<li><strong>Vì sao phong cách lại bị chấm điểm</strong> — trình biên dịch chấp nhận mọi đoạn C hợp lệ, xấu tới đâu cũng nhận. Nhưng bài assignment, bài lab, và sau này là các pull request của bạn thì do <em>người</em> đọc. Slide 42 nói thẳng: một chương trình viết tốt là chương trình <em>đọc lên thấy dễ chịu</em>.</li>
<li><strong>Vị trí của phần này trong deck</strong> — slide 3 nêu ba câu hỏi mục tiêu. Câu 1 ("Phát triển một chương trình C thế nào?") đã trả lời xong bằng phần logic constructs, slide 5–40. Slide phân mục này mở câu 2 ("Khi viết thì nên tuân theo những gì?"). Slide 49 sẽ mở câu 3 ("Làm sao hiểu được một chương trình?").</li>
<li><strong>Chỉ có bốn chủ đề</strong> — đặt tên (slide 43), thụt lề (slide 44), chú thích (slide 45), và guidelines tổng quát (slide 46–48). Toàn bộ phần phong cách chỉ có vậy; ngắn đủ để học thuộc thật.</li>
<li><strong>Phong cách không phải đồ trang trí</strong> — gần như mọi quy tắc sắp đọc đều sinh ra từ một lỗi có thật: thiếu một dấu ngoặc nhọn, một biến tên <code>l</code> nhìn y hệt số <code>1</code>, một dấu <code>=</code> gõ nhầm chỗ đáng lẽ là <code>==</code>. Quy tắc phong cách là thuốc chống lỗi, gọn gàng chỉ là hệ quả.</li>
<li><strong>Thói quen cần dựng ngay lúc này</strong> — tới giờ bạn đã viết chừng hai chục chương trình. Hai chục là con số vừa đẹp: đủ nhiều để bạn đã có một phong cách, đủ ít để còn sửa được.</li>
</ul>
<p class="meo">💡 Phép thử thực dụng cho mọi quy tắc phong cách: một bạn cùng lớp chưa từng đọc chương trình của bạn có tìm ra lỗi trong năm phút không? Có thì phong cách đủ tốt. Còn nếu bạn ấy tìm <code>main</code> cũng không thấy thì chưa đạt.</p>`],

      [42, 'Habits in programming',
        `<p class="y-chinh">🎯 The slide's thesis in one line: <em>"A well-written program is a pleasure to read. Other programmers can understand it without significant effort. The coding style is consistent and clear throughout."</em> Then a demand — <strong>adopt some style</strong>.</p>
<ul>
<li><strong>Read the second sentence again</strong> — <em>"without significant effort"</em>. That is the measurable part. Style is not about beauty, it is about how many minutes a reader burns before they understand your loop.</li>
<li><strong>"Consistent and clear THROUGHOUT"</strong> — consistency beats correctness of choice. Two spaces or four spaces are both fine; two spaces in <code>main</code> and four spaces in the loop below it is not fine. A reader unconsciously uses indentation depth to see nesting, so an inconsistent file lies to them.</li>
<li><strong>"Develop your own style guide OR adopt the one outlined here"</strong> — the slide does not claim its rules are the only correct ones. Real teams pick one (Linux kernel style, Google C++ style, K&amp;R, Allman) and then stop arguing. For PRF192, use the one on slides 43–48 because that is what your lab is marked against.</li>
<li><strong>The four headings preview the next six slides</strong> — Naming → 43 · Indentation → 44 · Comments → 45 · General Guidelines → 46, 47, 48. Nothing else is in the style section, so this slide is a complete table of contents.</li>
<li><strong>Why now and not later</strong> — the deck placed style right after the loops (slides 28–40) on purpose. Loops are the first construct where bad indentation genuinely hides bugs: a misplaced brace can move a statement in or out of a loop body and the program still compiles.</li>
</ul>
<pre><code>/* Same program, two styles. Both compile. Only one is readable. */

/* --- unreadable --- */
#include &lt;stdio.h&gt;
int main(){int i,s=0;for(i=1;i&lt;=5;i++){if(i%2==1){s+=i;}}printf("%d\\n",s);return 0;}

/* --- readable --- */
#include &lt;stdio.h&gt;

int main(void) {
    int i;
    int sumOfOdds = 0;

    for (i = 1; i &lt;= 5; i++) {
        if (i % 2 == 1) {
            sumOfOdds += i;
        }
    }

    printf("%d\\n", sumOfOdds);
    return 0;
}</code></pre>
<p class="dap-an">✅ Both versions print <code>9</code> (1 + 3 + 5). The compiler cannot tell them apart; a human needs about two seconds for the second one and about a minute for the first.</p>
<p class="meo">💡 Let the tool enforce the habit. Dev-C++ has <strong>AStyle</strong> in the menu bar (you can see it in the Dev-C++ screenshots on slides 55–58) — it reformats the whole file to one consistent style with a single click. In VS Code the same key is <code>Shift+Alt+F</code>.</p>`,
        `<p class="y-chinh">🎯 Luận điểm của slide gói trong một câu: <em>"Một chương trình viết tốt là chương trình đọc lên thấy dễ chịu. Lập trình viên khác hiểu được nó mà không tốn nhiều công. Phong cách viết mã nhất quán và rõ ràng từ đầu tới cuối."</em> Rồi một yêu cầu — <strong>hãy chọn lấy MỘT phong cách</strong>.</p>
<ul>
<li><strong>Đọc lại vế thứ hai</strong> — <em>"không tốn nhiều công"</em>. Đó mới là phần đo được. Phong cách không phải chuyện đẹp xấu, mà là chuyện người đọc mất bao nhiêu phút mới hiểu nổi vòng lặp của bạn.</li>
<li><strong>"Nhất quán và rõ ràng TỪ ĐẦU TỚI CUỐI"</strong> — nhất quán quan trọng hơn chọn đúng. Thụt hai dấu cách hay bốn dấu cách đều được; nhưng hai dấu cách trong <code>main</code> rồi bốn dấu cách ở vòng lặp ngay dưới thì không được. Người đọc dùng độ sâu thụt lề để nhìn ra mức lồng nhau một cách vô thức, nên một file không nhất quán là một file đang nói dối họ.</li>
<li><strong>"Tự dựng style guide của mình HOẶC lấy cái nêu ở đây"</strong> — slide không hề nói quy tắc của nó là duy nhất đúng. Đội ngũ thật chọn lấy một bộ (Linux kernel style, Google C++ style, K&amp;R, Allman) rồi thôi tranh cãi. Với PRF192, hãy dùng bộ ở slide 43–48 vì bài lab của bạn được chấm theo đúng bộ đó.</li>
<li><strong>Bốn đề mục chính là mục lục của sáu slide sau</strong> — Naming → 43 · Indentation → 44 · Comments → 45 · General Guidelines → 46, 47, 48. Phần phong cách không còn gì khác, nên slide này là mục lục đầy đủ.</li>
<li><strong>Vì sao đặt ở đây chứ không để sau</strong> — deck cố ý xếp phần phong cách ngay sau phần vòng lặp (slide 28–40). Vòng lặp là cấu trúc đầu tiên mà thụt lề sai thật sự giấu được lỗi: một dấu ngoặc nhọn đặt lệch có thể đẩy một câu lệnh vào trong hay ra ngoài thân vòng lặp mà chương trình vẫn biên dịch trót lọt.</li>
</ul>
<pre><code>/* Cung mot chuong trinh, hai phong cach. Ca hai deu bien dich duoc. */

/* --- kho doc --- */
#include &lt;stdio.h&gt;
int main(){int i,s=0;for(i=1;i&lt;=5;i++){if(i%2==1){s+=i;}}printf("%d\\n",s);return 0;}

/* --- de doc --- */
#include &lt;stdio.h&gt;

int main(void) {
    int i;
    int sumOfOdds = 0;

    for (i = 1; i &lt;= 5; i++) {
        if (i % 2 == 1) {
            sumOfOdds += i;
        }
    }

    printf("%d\\n", sumOfOdds);
    return 0;
}</code></pre>
<p class="dap-an">✅ Cả hai bản đều in <code>9</code> (1 + 3 + 5). Trình biên dịch không phân biệt được; con người thì mất chừng hai giây với bản dưới và chừng một phút với bản trên.</p>
<p class="meo">💡 Hãy để công cụ giữ thói quen giùm bạn. Dev-C++ có mục <strong>AStyle</strong> ngay trên thanh menu (nhìn thấy được trong các ảnh chụp Dev-C++ ở slide 55–58) — bấm một cái là cả file được định dạng lại theo một phong cách thống nhất. Trong VS Code phím tương ứng là <code>Shift+Alt+F</code>.</p>`],

      [43, 'Programming Styles: Naming',
        `<p class="y-chinh">🎯 Five naming rules, and they pull in two opposite directions on purpose: a name must be <strong>complete enough to explain itself</strong>, yet <strong>short enough to read</strong>. The slide tells you where the balance point is for each kind of name.</p>
<ul>
<li><strong>"Self-descriptive so that clarifying comments are unnecessary"</strong> — the strongest rule on the slide. If you need <code>int d; /* number of days */</code>, the comment is a confession: rename it <code>days</code> and delete the comment. A good name is a comment that can never go out of date.</li>
<li><strong>"Describe identifiers completely, avoid cryptic names"</strong> — <code>tmp</code>, <code>val</code>, <code>x1</code>, <code>flag2</code>, <code>data</code> say nothing. Complete means the reader can answer "what is in this box?" without scrolling up.</li>
<li><strong>"Prefer nouns for variable names"</strong> — a variable holds a <em>thing</em>, so it gets a noun: <code>studentName</code>, <code>totalMark</code>, <code>isValid</code> (an adjective is fine for a yes/no). Verbs belong to functions, which you meet in Slot 08–09: <code>computeAverage()</code>, <code>printReport()</code>.</li>
<li><strong>"Keep names short — studentName rather than theNameOfAStudent (camel case rule)"</strong> — the slide's own example. camelCase = first word lowercase, each following word capitalised, no underscores. Aim for one to three words.</li>
<li><strong>"Keep the names of indices VERY short — treat them as mathematical notation"</strong> — the one place where <code>i</code>, <code>j</code>, <code>k</code>, <code>n</code> are not only allowed but preferred. Nobody writes <code>for (loopCounterForRows = 0; ...)</code>; mathematicians have used i and j for centuries and every programmer reads them instantly.</li>
</ul>
<pre><code>/* cryptic - legal C, unreadable */
int d, s, n2;
double t;

/* self-descriptive - same program, same speed */
int    numberOfDays;
int    totalScore;
int    numberOfStudents;
double averageMark;

/* indices stay short on purpose */
int i, j;
for (i = 0; i &lt; numberOfStudents; i++)
    for (j = 0; j &lt; numberOfDays; j++)
        totalScore += 1;</code></pre>
<p class="dap-an">✅ Applying the rules to a bank-account program: <code>a</code> → <code>accountBalance</code> (noun, complete, camelCase) · <code>r</code> → <code>interestRate</code> · <code>theTotalAmountOfMoneyAfterInterest</code> → <code>finalBalance</code> (too long, trim it) · the loop counter stays <code>i</code>. Four renames, zero comments needed.</p>
<p class="pitfall">⚠️ Two real traps beyond the slide: never name a variable <code>l</code> (lowercase L is indistinguishable from <code>1</code> in most fonts), and remember C is case-sensitive — <code>studentName</code> and <code>studentname</code> are two different variables, so a typo in capitalisation creates a silent second variable rather than an error… except in C, where the second one was never declared, so you do get an error. Be grateful for that error.</p>`,
        `<p class="y-chinh">🎯 Năm quy tắc đặt tên, và chúng cố ý kéo về hai phía ngược nhau: tên phải <strong>đủ đầy đủ để tự giải thích</strong>, mà lại <strong>đủ ngắn để đọc</strong>. Slide chỉ rõ điểm cân bằng nằm ở đâu với từng loại tên.</p>
<ul>
<li><strong>"Tự mô tả tới mức không cần chú thích giải nghĩa"</strong> — quy tắc mạnh nhất trên slide. Nếu bạn phải viết <code>int d; /* so ngay */</code> thì cái chú thích ấy là một lời thú nhận: đổi tên thành <code>days</code> rồi xoá chú thích đi. Một cái tên tốt là một chú thích không bao giờ lỗi thời được.</li>
<li><strong>"Mô tả định danh cho trọn vẹn, tránh tên bí hiểm"</strong> — <code>tmp</code>, <code>val</code>, <code>x1</code>, <code>flag2</code>, <code>data</code> chẳng nói lên điều gì. Trọn vẹn nghĩa là người đọc trả lời được "trong ô này đựng cái gì?" mà không phải cuộn lên xem lại.</li>
<li><strong>"Ưu tiên danh từ cho tên biến"</strong> — biến đựng một <em>vật</em>, nên nó mang tên danh từ: <code>studentName</code>, <code>totalMark</code>, <code>isValid</code> (tính từ dùng cho biến đúng/sai thì được). Động từ để dành cho hàm — thứ bạn gặp ở Slot 08–09: <code>computeAverage()</code>, <code>printReport()</code>.</li>
<li><strong>"Giữ tên ngắn — studentName chứ đừng theNameOfAStudent (quy tắc camel case)"</strong> — chính ví dụ của slide. camelCase = từ đầu viết thường, mỗi từ sau viết hoa chữ cái đầu, không gạch dưới. Nhắm tới một đến ba từ.</li>
<li><strong>"Tên chỉ số thì phải RẤT ngắn — coi chúng như ký hiệu toán học"</strong> — đây là chỗ duy nhất mà <code>i</code>, <code>j</code>, <code>k</code>, <code>n</code> không chỉ được phép mà còn được ưu tiên. Chẳng ai viết <code>for (loopCounterForRows = 0; ...)</code>; nhà toán học đã dùng i và j hàng thế kỷ và mọi lập trình viên đọc ra ngay lập tức.</li>
</ul>
<pre><code>/* bi hiem - hop le nhung kho doc */
int d, s, n2;
double t;

/* tu mo ta - cung chuong trinh, cung toc do */
int    numberOfDays;
int    totalScore;
int    numberOfStudents;
double averageMark;

/* chi so thi co y giu ngan */
int i, j;
for (i = 0; i &lt; numberOfStudents; i++)
    for (j = 0; j &lt; numberOfDays; j++)
        totalScore += 1;</code></pre>
<p class="dap-an">✅ Áp năm quy tắc vào một chương trình tài khoản ngân hàng: <code>a</code> → <code>accountBalance</code> (danh từ, trọn nghĩa, camelCase) · <code>r</code> → <code>interestRate</code> · <code>theTotalAmountOfMoneyAfterInterest</code> → <code>finalBalance</code> (dài quá, cắt bớt) · biến đếm vòng lặp giữ nguyên <code>i</code>. Bốn lần đổi tên, không cần một dòng chú thích nào.</p>
<p class="pitfall">⚠️ Hai cái bẫy thật nằm ngoài slide: đừng bao giờ đặt tên biến là <code>l</code> (chữ L thường nhìn y hệt số <code>1</code> trong hầu hết phông chữ), và nhớ rằng C phân biệt HOA–thường — <code>studentName</code> và <code>studentname</code> là hai biến khác nhau. Gõ nhầm chữ hoa tạo ra một biến thứ hai; may là trong C biến thứ hai ấy chưa được khai báo nên bạn nhận được lỗi biên dịch. Hãy biết ơn cái lỗi đó.</p>`],

      [44, 'Programming Styles: Indentation',
        `<p class="y-chinh">🎯 One rule and one warning. The rule: <em>"Indent the body of any construct that is embedded within another construct."</em> The warning: <em>"Use in-line opening braces OR start opening braces on a newline — but don't mix the two styles."</em></p>
<ul>
<li><strong>Indentation encodes nesting depth</strong> — it is the only visual signal of <em>which body a statement belongs to</em>. C itself does not care (unlike Python), so indentation is a promise you make to the reader. A lying promise is worse than none.</li>
<li><strong>The slide's example</strong> — a triple-nested <code>for</code> with an <code>if…else</code> inside. Each level moves right by one step, and the closing brace lines up vertically with the <code>for</code> that opened it. You can count the depth with your eyes instead of counting braces with your finger.</li>
<li><strong>Two legal brace styles</strong> — <em>in-line / K&amp;R</em>: <code>for (…) {</code> on one line, closing brace alone. <em>Newline / Allman</em>: <code>for (…)</code> then <code>{</code> alone on the next line. Both are professional; the slide's second code image itself uses the in-line style.</li>
<li><strong>Why mixing is banned</strong> — the eye learns one pattern and then stops re-reading. Halfway through a mixed file you will misread a brace as belonging to the wrong construct, and that is exactly the bug class that indentation was supposed to prevent.</li>
<li><strong>One step = 4 spaces (or one tab, not both)</strong> — the slide does not fix a number, but mixing tabs and spaces is the classic way a file looks aligned on your machine and ragged on your lecturer's.</li>
</ul>
<pre><code>/* the slide's nested example, indentation carrying the structure */
for ( i = 0; i &lt; n; i++ ) {
    for ( j = 0; j &lt; n; j++ ) {
        for ( k = 0; k &lt; n; k++ ) {
            if ( i * j * k != 0 )
                printf(" %4d", i*j*k);
            else
                printf("     ");
        }
        printf("\\n");
    }
    printf("\\n");
}
printf("That's all folks!!!\\n");</code></pre>
<p class="dap-an">✅ Run it with <code>n = 4</code>: it prints four blocks of four lines. Any row or column containing 0 prints only blanks (because <code>i*j*k == 0</code>), so the first block and the first line/column of every block are empty; block <code>i = 2</code> shows <code>2 4 6 / 4 8 12 / 6 12 18</code>. The last line is <code>That's all folks!!!</code>. Indentation is what lets you see that the two bare <code>printf("\\n")</code> calls belong to two <em>different</em> loops — one ends a row, the other ends a block.</p>
<p class="pitfall">⚠️ The dangerous case is a body with <strong>no braces</strong>. <code>if (x &gt; 0)</code> followed by two indented lines executes only the <em>first</em> one — the indentation says "both", the compiler says "one". Always brace a multi-line body, and prefer bracing even a one-line body.</p>`,
        `<p class="y-chinh">🎯 Một quy tắc và một lời cảnh báo. Quy tắc: <em>"Thụt vào thân của mọi cấu trúc nằm lồng trong một cấu trúc khác."</em> Cảnh báo: <em>"Dùng ngoặc mở cùng dòng HOẶC ngoặc mở xuống dòng riêng — nhưng đừng trộn hai kiểu."</em></p>
<ul>
<li><strong>Thụt lề mã hoá độ sâu lồng nhau</strong> — đó là tín hiệu thị giác duy nhất cho biết <em>câu lệnh này thuộc thân nào</em>. Bản thân C không quan tâm (khác Python), nên thụt lề là một lời hứa bạn đưa cho người đọc. Một lời hứa dối còn tệ hơn là không hứa.</li>
<li><strong>Ví dụ trên slide</strong> — ba vòng <code>for</code> lồng nhau, trong cùng là một <code>if…else</code>. Mỗi mức lùi sang phải một nấc, và dấu ngoặc đóng thẳng hàng dọc với <code>for</code> đã mở nó. Bạn đếm độ sâu bằng mắt thay vì lần ngón tay theo từng dấu ngoặc.</li>
<li><strong>Hai kiểu ngoặc đều hợp lệ</strong> — <em>cùng dòng / K&amp;R</em>: <code>for (…) {</code> chung một dòng, ngoặc đóng đứng riêng. <em>Xuống dòng / Allman</em>: <code>for (…)</code> rồi <code>{</code> nằm riêng dòng dưới. Cả hai đều chuyên nghiệp; ảnh mã thứ hai trên slide dùng kiểu cùng dòng.</li>
<li><strong>Vì sao cấm trộn</strong> — mắt học thuộc một mẫu rồi thôi không đọc kỹ nữa. Đi được nửa file trộn kiểu, bạn sẽ đọc nhầm một dấu ngoặc thành của cấu trúc khác — đúng cái loại lỗi mà thụt lề sinh ra để ngăn.</li>
<li><strong>Một nấc = 4 dấu cách (hoặc một tab, đừng cả hai)</strong> — slide không chốt con số, nhưng trộn tab với dấu cách là cách kinh điển khiến file thẳng hàng trên máy bạn mà so le trên máy thầy.</li>
</ul>
<pre><code>/* vi du long nhau cua slide, thut le ganh phan cau truc */
for ( i = 0; i &lt; n; i++ ) {
    for ( j = 0; j &lt; n; j++ ) {
        for ( k = 0; k &lt; n; k++ ) {
            if ( i * j * k != 0 )
                printf(" %4d", i*j*k);
            else
                printf("     ");
        }
        printf("\\n");
    }
    printf("\\n");
}
printf("That's all folks!!!\\n");</code></pre>
<p class="dap-an">✅ Chạy thật với <code>n = 4</code>: in ra bốn khối, mỗi khối bốn dòng. Hàng nào hay cột nào chứa 0 thì chỉ in khoảng trắng (vì <code>i*j*k == 0</code>), nên cả khối đầu tiên và dòng/cột đầu của mọi khối đều trống; khối <code>i = 2</code> cho <code>2 4 6 / 4 8 12 / 6 12 18</code>. Dòng cuối là <code>That's all folks!!!</code>. Chính thụt lề cho bạn thấy hai lệnh <code>printf("\\n")</code> trơ trọi thuộc về hai vòng lặp <em>khác nhau</em> — một cái kết thúc hàng, một cái kết thúc khối.</p>
<p class="pitfall">⚠️ Trường hợp nguy hiểm là thân <strong>không có ngoặc nhọn</strong>. <code>if (x &gt; 0)</code> rồi hai dòng thụt vào thì chỉ dòng <em>đầu</em> được thực thi — thụt lề nói "cả hai", trình biên dịch nói "một". Luôn đóng ngoặc cho thân nhiều dòng, và nên đóng ngoặc cả với thân một dòng.</p>`],

      [45, 'Programming Styles: Comment',
        `<p class="y-chinh">🎯 Three rules, and the first one is the whole philosophy: <em>"Use comments to declare WHAT is done, rather than describe HOW it is done."</em> The code already says how. Only a human can say why.</p>
<ul>
<li><strong>What vs how</strong> — <code>i++; /* add 1 to i */</code> is noise: the reader can see <code>i++</code>. <code>/* skip the header line of the file */</code> is information: it explains the <em>purpose</em> of the statement, which the code cannot express.</li>
<li><strong>"Comments introduce what follows"</strong> — a comment sits <em>above</em> the block it describes, like a heading, not trailing behind it. The reader then knows what to expect before reading the code, which is how skimming works.</li>
<li><strong>"Keep them brief and avoid decoration"</strong> — no boxes of asterisks, no ASCII art banners, no <code>/*******/</code> separators every five lines. Decoration takes space, breaks the 80-column rule (slide 46) and has to be repaired every time the text changes.</li>
<li><strong>The two comment syntaxes in C</strong> — <code>/* … */</code> spans any number of lines and is valid in every C standard, including the C89 this course targets; <code>// …</code> runs to the end of the line and was standardised in C99. Dev-C++ accepts both; for portability in exam answers <code>/* … */</code> is always safe.</li>
<li><strong>The one comment that never rots</strong> — the file header: what the program does, who wrote it, when. Slide 51's own example starts with exactly that: <code>/*Walkthrough1.c*/</code>.</li>
</ul>
<pre><code>/* BAD - describes HOW, and decorates */
/**********************************/
/*  s = s + i;  add i into s      */
/**********************************/
s = s + i;                /* increase s by i */

/* GOOD - declares WHAT, sits above the block, brief */

/* Sum of the odd numbers in 1..n */
sumOfOdds = 0;
for (i = 1; i &lt;= n; i++)
    if (i % 2 == 1)
        sumOfOdds += i;</code></pre>
<p class="dap-an">✅ Rewrite exercise — given <code>c += 2*a-b;  /* c plus equals 2 times a minus b */</code>, the comment is pure translation of the syntax, so it earns nothing. A "what" comment for the same line in the slide-51 program would be <code>/* accumulate one step of the series into c */</code>. Better still: rename <code>c</code> to <code>runningTotal</code> and delete the comment entirely (slide 43).</p>
<p class="meo">💡 A useful self-check: cover the code with your hand and read only the comments. If they read like a summary of the program, they are good comments. If they read like the code spelled out in English, delete them.</p>`,
        `<p class="y-chinh">🎯 Ba quy tắc, và quy tắc đầu là toàn bộ triết lý: <em>"Dùng chú thích để nói LÀM GÌ, chứ đừng mô tả LÀM NHƯ THẾ NÀO."</em> Phần "như thế nào" thì mã đã nói rồi. Chỉ con người mới nói được "để làm gì".</p>
<ul>
<li><strong>Làm gì với làm thế nào</strong> — <code>i++; /* cong 1 vao i */</code> là rác: người đọc nhìn <code>i++</code> là thấy. Còn <code>/* bo qua dong tieu de cua file */</code> mới là thông tin: nó giải thích <em>mục đích</em> của câu lệnh, thứ mà mã không diễn đạt được.</li>
<li><strong>"Chú thích giới thiệu cho phần đi ngay sau nó"</strong> — chú thích nằm <em>phía trên</em> khối mà nó mô tả, như một tiêu đề, chứ không lẽo đẽo phía sau. Người đọc nhờ đó biết trước sắp gặp gì, và đó chính là cách người ta đọc lướt.</li>
<li><strong>"Giữ ngắn gọn, tránh trang trí"</strong> — không khung dấu sao, không chữ nghệ thuật ASCII, không dải <code>/*******/</code> cứ năm dòng một lần. Trang trí chiếm chỗ, phá quy tắc 80 cột (slide 46), và cứ đổi chữ một lần là phải căn lại.</li>
<li><strong>Hai cú pháp chú thích của C</strong> — <code>/* … */</code> trải bao nhiêu dòng cũng được và hợp lệ ở mọi chuẩn C, kể cả chuẩn C89 mà môn này bám theo; <code>// …</code> chạy tới hết dòng và mới được chuẩn hoá từ C99. Dev-C++ nhận cả hai; để an toàn khi làm bài thi thì <code>/* … */</code> luôn chắc ăn.</li>
<li><strong>Chú thích duy nhất không bao giờ hỏng</strong> — phần đầu file: chương trình làm gì, ai viết, viết khi nào. Ví dụ ở slide 51 mở đầu đúng bằng thứ đó: <code>/*Walkthrough1.c*/</code>.</li>
</ul>
<pre><code>/* DO - mo ta LAM NHU THE NAO, lai con trang tri */
/**********************************/
/*  s = s + i;  cong i vao s      */
/**********************************/
s = s + i;                /* tang s them i */

/* TOT - noi LAM GI, dat phia tren khoi, ngan gon */

/* Tong cac so le trong 1..n */
sumOfOdds = 0;
for (i = 1; i &lt;= n; i++)
    if (i % 2 == 1)
        sumOfOdds += i;</code></pre>
<p class="dap-an">✅ Bài tập viết lại — cho dòng <code>c += 2*a-b;  /* c cong them 2 nhan a tru b */</code>, chú thích chỉ dịch lại cú pháp nên chẳng được điểm nào. Chú thích kiểu "làm gì" cho đúng dòng ấy trong chương trình ở slide 51 sẽ là <code>/* dồn một bước của dãy vào c */</code>. Tốt hơn nữa: đổi tên <code>c</code> thành <code>runningTotal</code> rồi xoá hẳn chú thích đi (slide 43).</p>
<p class="meo">💡 Một phép tự kiểm rất hiệu quả: lấy tay che phần mã, chỉ đọc các chú thích. Nếu chúng đọc lên như một bản tóm tắt chương trình thì đó là chú thích tốt. Nếu đọc lên như mã được đánh vần bằng tiếng Việt thì xoá đi.</p>`],

      [46, 'Programming Styles: Guidelines (1 of 3)',
        `<p class="y-chinh">🎯 The first of three guideline slides — eight rules about <strong>the shape of a line and the lifetime of a variable</strong>.</p>
<ul>
<li><strong>"Limit line length to 80 characters — both comments and code"</strong> — 80 is the width of a classic terminal and of a printed page. Past it, a reviewer's editor either wraps your line into an unreadable mess or hides its right half.</li>
<li><strong>"Avoid global variables"</strong> — a global can be written from anywhere, so when it holds a wrong value there is no short list of suspects. Keep every variable inside the smallest block that needs it. This rule becomes critical in Slot 08–09 when functions arrive.</li>
<li><strong>"Select data types wisely and carefully"</strong> — a countable thing is <code>int</code>; money and measurements are <code>double</code>; a single symbol is <code>char</code>. Picking <code>int</code> for an average silently truncates 3.8 to 3 (see slide 59's semantic errors).</li>
<li><strong>"Initialize a variable when declaring it ONLY if the initial value is part of the semantic of the variable. If the initial value is part of an algorithm, use a separate assignment."</strong> — the subtlest rule here. <code>int count = 0;</code> is semantic: an empty counter <em>is</em> zero. But <code>int i = 1;</code> written at the top, far from the <code>for</code> that uses it, is algorithmic — it belongs in <code>for (i = 1; …)</code>, which slide 47 repeats as its own rule.</li>
<li><strong>"Avoid goto, continue, break — except in switch"</strong> — this is the style consequence of slides 36–40. Every one of those jumps has one entry and more than one exit, which breaks the structured-programming promise of slide 7. <code>break</code> inside <code>switch</code> is exempt because there it is not a jump, it is the case terminator.</li>
<li><strong>"Avoid using the character encodings for a particular machine"</strong> — write <code>'A'</code>, never <code>65</code>; write <code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code>, never <code>c &gt;= 97 &amp;&amp; c &lt;= 122</code>. ASCII is not the only encoding in the world, and <code>'A'</code> is readable on every machine.</li>
<li><strong>"Use a single space or no spaces either side of an operator"</strong> — <code>a + b</code> or <code>a+b</code>, consistently. Never <code>a +b</code>, which reads as "a" followed by "positive b".</li>
</ul>
<pre><code>/* violates 4 guidelines at once */
int total;                    /* global - suspect list = the whole file */
int main(void) {
    int i = 1;                /* algorithmic init, far from its loop    */
    char c = 65;              /* machine encoding instead of 'A'        */
    for (i = 1; i &lt;= 10; i++) total = total+ i;   /* spacing, line too long */
    return 0;
}

/* fixed */
int main(void) {
    int total = 0;            /* semantic: an empty sum IS zero */
    int i;
    char firstGrade = 'A';    /* portable, self-explaining      */

    for (i = 1; i &lt;= 10; i++)
        total = total + i;
    return 0;
}</code></pre>
<p class="dap-an">✅ Which rule does each line break? <code>int total;</code> at file scope → "avoid global variables" (and it is the reason <code>total</code> starts at 0 by luck rather than by intent). <code>int i = 1;</code> → "initial value is part of an algorithm, use a separate assignment". <code>char c = 65;</code> → "avoid machine character encodings". <code>total = total+ i;</code> → "single space or no spaces either side of an operator". Four lines, four different guidelines.</p>
<p class="meo">💡 The 80-column rule has a free enforcer: in VS Code set <code>"editor.rulers": [80]</code> and a thin vertical line appears at column 80. You stop guessing and start seeing.</p>`,
        `<p class="y-chinh">🎯 Slide guidelines đầu tiên trong ba slide — tám quy tắc về <strong>hình dạng của một dòng và vòng đời của một biến</strong>.</p>
<ul>
<li><strong>"Giới hạn độ dài dòng ở 80 ký tự — cả chú thích lẫn mã"</strong> — 80 là bề ngang của một terminal cổ điển và của một trang in. Vượt qua đó, trình soạn thảo của người review hoặc bẻ dòng của bạn thành một mớ rối, hoặc giấu mất nửa phải.</li>
<li><strong>"Tránh biến toàn cục"</strong> — biến toàn cục có thể bị ghi từ bất cứ đâu, nên khi nó mang giá trị sai thì không có một danh sách nghi phạm ngắn nào cả. Hãy giữ mọi biến trong khối nhỏ nhất cần tới nó. Quy tắc này trở nên sống còn ở Slot 08–09 khi có hàm.</li>
<li><strong>"Chọn kiểu dữ liệu một cách khôn ngoan và cẩn thận"</strong> — thứ đếm được thì <code>int</code>; tiền bạc và số đo thì <code>double</code>; một ký hiệu đơn thì <code>char</code>. Chọn <code>int</code> cho điểm trung bình sẽ âm thầm cắt 3,8 thành 3 (đúng loại lỗi semantic ở slide 59).</li>
<li><strong>"Chỉ khởi tạo lúc khai báo NẾU giá trị ban đầu thuộc về ngữ nghĩa của biến. Nếu giá trị ban đầu thuộc về thuật toán thì dùng một câu lệnh gán riêng."</strong> — quy tắc tinh tế nhất ở đây. <code>int count = 0;</code> là ngữ nghĩa: một bộ đếm rỗng <em>chính là</em> 0. Còn <code>int i = 1;</code> viết trên đầu, cách xa vòng <code>for</code> dùng nó, là thuật toán — nó thuộc về <code>for (i = 1; …)</code>, và slide 47 nhắc lại điều này thành một quy tắc riêng.</li>
<li><strong>"Tránh goto, continue, break — trừ trong switch"</strong> — đây là hệ quả về phong cách của slide 36–40. Mỗi lệnh nhảy ấy đều có một lối vào và nhiều hơn một lối ra, phá vỡ lời hứa lập trình có cấu trúc ở slide 7. <code>break</code> trong <code>switch</code> được miễn vì ở đó nó không phải lệnh nhảy, nó là dấu kết thúc của một case.</li>
<li><strong>"Tránh dùng mã ký tự riêng của một máy cụ thể"</strong> — viết <code>'A'</code>, đừng viết <code>65</code>; viết <code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code>, đừng viết <code>c &gt;= 97 &amp;&amp; c &lt;= 122</code>. ASCII không phải bảng mã duy nhất trên đời, còn <code>'A'</code> thì đọc được trên mọi máy.</li>
<li><strong>"Dùng một dấu cách hoặc không dấu cách nào ở hai bên toán tử"</strong> — <code>a + b</code> hoặc <code>a+b</code>, nhất quán. Đừng bao giờ <code>a +b</code>, vì nó đọc thành "a" rồi "b dương".</li>
</ul>
<pre><code>/* pham 4 guideline cung luc */
int total;                    /* toan cuc - nghi pham la ca file      */
int main(void) {
    int i = 1;                /* khoi tao thuat toan, xa vong lap cua no */
    char c = 65;              /* ma may thay vi 'A'                   */
    for (i = 1; i &lt;= 10; i++) total = total+ i;   /* khoang trang, dong dai */
    return 0;
}

/* da sua */
int main(void) {
    int total = 0;            /* ngu nghia: mot tong rong CHINH LA 0 */
    int i;
    char firstGrade = 'A';    /* kha chuyen, tu giai thich           */

    for (i = 1; i &lt;= 10; i++)
        total = total + i;
    return 0;
}</code></pre>
<p class="dap-an">✅ Mỗi dòng phạm quy tắc nào? <code>int total;</code> ở phạm vi file → "tránh biến toàn cục" (và đó cũng là lý do <code>total</code> bằng 0 do may mắn chứ không do chủ ý). <code>int i = 1;</code> → "giá trị ban đầu thuộc thuật toán thì dùng lệnh gán riêng". <code>char c = 65;</code> → "tránh mã ký tự của máy". <code>total = total+ i;</code> → "một dấu cách hoặc không dấu cách nào ở hai bên toán tử". Bốn dòng, bốn guideline khác nhau.</p>
<p class="meo">💡 Quy tắc 80 cột có một người canh miễn phí: trong VS Code đặt <code>"editor.rulers": [80]</code> là hiện một vạch dọc mảnh ở cột 80. Bạn thôi đoán và bắt đầu nhìn thấy.</p>`],

      [47, 'Programming Styles: Guidelines (2 of 3)',
        `<p class="y-chinh">🎯 Six more rules, and this time all six are about <strong>loops and conditions</strong> — the constructs you just spent thirty slides learning.</p>
<ul>
<li><strong>"Use in-line opening braces or start them on a newline, but don't mix"</strong> — repeated from slide 44 because it is the rule most often broken between the top and the bottom of one file, once the author gets tired.</li>
<li><strong>"Initialize iteration variables in the context of the iteration"</strong> — write <code>for (i = 0; i &lt; n; i++)</code>, not <code>i = 0;</code> twenty lines earlier. The three clauses of <code>for</code> exist precisely so that start, stop and step sit side by side where a reader checks them in one glance.</li>
<li><strong>"Avoid assignments nested inside logical expressions"</strong> — <code>if (x = getValue())</code> assigns and tests in one breath; the reader sees <code>==</code> because that is what they expected. Split it: <code>x = getValue();</code> then <code>if (x)</code>. Slide 48 allows the compact form only with an extra pair of parentheses.</li>
<li><strong>"Avoid iterations with empty bodies — reserve the body for the algorithm"</strong> — a loop whose whole work hides in the <code>i++</code> clause, or worse, a stray semicolon after <code>for(…)</code>. The stray semicolon is the single most expensive typo in beginner C.</li>
<li><strong>"Limit the initialization and iteration clauses of a for statement to the iteration variables"</strong> — <code>for (i = 0, sum = 0; i &lt; n; i++, sum += i)</code> is legal and unreadable. The <code>for</code> header is about <em>counting</em>; the accumulation belongs in the body.</li>
<li><strong>"Distribute and nest complexity"</strong> — do not build one monstrous condition. Split a hard test into a nested <code>if</code> or into named intermediate variables, so each line asks one simple question.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    int i, n = 5, sum = 0;

    for (i = 1; i &lt;= n; i++);   /* &lt;-- stray ';' : the loop body is EMPTY */
        sum += i;               /*     this line runs ONCE, with i = 6   */
    printf("sum = %d  (i = %d)\\n", sum, i);

    sum = 0;
    for (i = 1; i &lt;= n; i++)    /* no semicolon: the body is the next line */
        sum += i;
    printf("sum = %d  (i = %d)\\n", sum, i);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: the first block prints <code>sum = 6  (i = 6)</code> — the loop spun five times doing nothing, left <code>i</code> at 6, and then the indented line executed exactly once adding 6. The second block prints <code>sum = 15  (i = 6)</code>, the answer you wanted. Note that the indentation lied in the first block, which is why slide 44 and this slide reinforce each other. <code>cc -Wall</code> catches it: <em>warning: for loop has empty body [-Wempty-body]</em>.</p>
<p class="meo">💡 "Distribute complexity" in practice: instead of <code>if (age &gt;= 18 &amp;&amp; score &gt;= 50 &amp;&amp; absences &lt; 3 &amp;&amp; fee == 1)</code>, write <code>int isAdult = age &gt;= 18;</code> / <code>int hasPassed = score &gt;= 50;</code> / <code>int isRegular = absences &lt; 3 &amp;&amp; fee == 1;</code> then <code>if (isAdult &amp;&amp; hasPassed &amp;&amp; isRegular)</code>. Same machine code, and now the debugger on slides 57–58 can show you <em>which</em> of the three failed.</p>`,
        `<p class="y-chinh">🎯 Sáu quy tắc nữa, và lần này cả sáu đều nói về <strong>vòng lặp và điều kiện</strong> — đúng những cấu trúc bạn vừa học suốt ba chục slide.</p>
<ul>
<li><strong>"Dùng ngoặc mở cùng dòng hoặc xuống dòng riêng, nhưng đừng trộn"</strong> — nhắc lại từ slide 44 vì đây là quy tắc hay bị phá nhất giữa đầu file và cuối file, khi người viết bắt đầu mỏi.</li>
<li><strong>"Khởi tạo biến lặp ngay trong ngữ cảnh của vòng lặp"</strong> — viết <code>for (i = 0; i &lt; n; i++)</code>, đừng viết <code>i = 0;</code> ở trên cách đó hai chục dòng. Ba mệnh đề của <code>for</code> sinh ra chính là để điểm bắt đầu, điểm dừng và bước nhảy nằm cạnh nhau, chỗ mà người đọc liếc một cái là kiểm được cả ba.</li>
<li><strong>"Tránh phép gán lồng trong biểu thức logic"</strong> — <code>if (x = getValue())</code> vừa gán vừa kiểm trong một hơi; người đọc nhìn ra <code>==</code> vì đó là thứ họ chờ đợi. Hãy tách ra: <code>x = getValue();</code> rồi <code>if (x)</code>. Slide 48 chỉ cho phép dạng gọn khi có thêm một cặp ngoặc đơn.</li>
<li><strong>"Tránh vòng lặp có thân rỗng — hãy để dành thân cho thuật toán"</strong> — vòng lặp mà toàn bộ công việc giấu trong mệnh đề <code>i++</code>, hoặc tệ hơn, một dấu chấm phẩy lạc sau <code>for(…)</code>. Dấu chấm phẩy lạc ấy là lỗi gõ đắt đỏ nhất của người mới học C.</li>
<li><strong>"Giới hạn mệnh đề khởi tạo và mệnh đề lặp của for trong phạm vi các biến lặp"</strong> — <code>for (i = 0, sum = 0; i &lt; n; i++, sum += i)</code> hợp lệ nhưng không đọc nổi. Phần đầu <code>for</code> là chuyện <em>đếm</em>; phần cộng dồn thuộc về thân vòng lặp.</li>
<li><strong>"Phân tán và lồng độ phức tạp"</strong> — đừng dựng một điều kiện khổng lồ. Hãy chẻ một phép kiểm khó thành <code>if</code> lồng nhau hoặc thành các biến trung gian có tên, để mỗi dòng chỉ hỏi một câu đơn giản.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    int i, n = 5, sum = 0;

    for (i = 1; i &lt;= n; i++);   /* &lt;-- ';' lac : than vong lap RONG  */
        sum += i;               /*     dong nay chay MOT lan, i = 6  */
    printf("sum = %d  (i = %d)\\n", sum, i);

    sum = 0;
    for (i = 1; i &lt;= n; i++)    /* khong co ';': than la dong ke duoi */
        sum += i;
    printf("sum = %d  (i = %d)\\n", sum, i);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy thật: khối đầu in <code>sum = 6  (i = 6)</code> — vòng lặp quay năm lượt mà không làm gì, để lại <code>i</code> bằng 6, rồi dòng thụt vào chạy đúng một lần cộng thêm 6. Khối sau in <code>sum = 15  (i = 6)</code>, mới là đáp số bạn muốn. Chú ý thụt lề đã nói dối ở khối đầu — đó là lý do slide 44 và slide này bổ trợ cho nhau. <code>cc -Wall</code> bắt được: <em>warning: for loop has empty body [-Wempty-body]</em>.</p>
<p class="meo">💡 "Phân tán độ phức tạp" trong thực tế: thay vì <code>if (age &gt;= 18 &amp;&amp; score &gt;= 50 &amp;&amp; absences &lt; 3 &amp;&amp; fee == 1)</code>, hãy viết <code>int isAdult = age &gt;= 18;</code> / <code>int hasPassed = score &gt;= 50;</code> / <code>int isRegular = absences &lt; 3 &amp;&amp; fee == 1;</code> rồi <code>if (isAdult &amp;&amp; hasPassed &amp;&amp; isRegular)</code>. Mã máy sinh ra như nhau, mà giờ trình gỡ lỗi ở slide 57–58 chỉ được cho bạn <em>cái nào</em> trong ba cái đã hỏng.</p>`],

      [48, 'Programming Styles: Guidelines (3 of 3)',
        `<p class="y-chinh">🎯 The last five rules are about <strong>what you leave behind</strong> — the state a program should be in when you hand it to somebody else.</p>
<ul>
<li><strong>"Avoid fancy algorithms that may be efficient but are difficult to read"</strong> — <code>x ^= y; y ^= x; x ^= y;</code> swaps two ints without a temporary and looks clever. It also takes a reader a minute, and a plain <code>t = x; x = y; y = t;</code> costs nothing measurable on a modern machine. Clarity first; optimise only when a measurement says you must.</li>
<li><strong>"Add additional comments where code HAS been fine tuned for efficient execution"</strong> — the exception to the previous rule. If you genuinely had to write the fast-but-ugly version, you owe the next reader an explanation of why, otherwise they will "simplify" it back.</li>
<li><strong>"Add an extra pair of parentheses where an assignment is also used as a condition"</strong> — <code>while ((c = getchar()) != EOF)</code>. The inner parentheses are not required by the grammar; they are a signed statement that you meant <code>=</code> and did not mistype <code>==</code>. Every C compiler warns when they are missing.</li>
<li><strong>"Remove unreferenced variables"</strong> — a declared-but-never-used variable is a leftover from a deleted idea. It costs a reader real time ("where is this used? … nowhere?") and hides typos, because the variable you <em>meant</em> to update may be the unused one.</li>
<li><strong>"Remove all commented code and debugging statements from release and production code"</strong> — the <code>printf("here 1\\n")</code> lines you sprinkled while hunting a bug, and the blocks you commented out instead of deleting. Version control remembers deleted code; your reader does not need to.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    int x = 3;
    int unused;                     /* rule 4: unreferenced - delete it */

    if (x = 5)                      /* rule 3 broken: is this = or ==?  */
        printf("x = %d -&gt; condition is TRUE\\n", x);

    /* the intended, honest forms: */
    /*   if (x == 5)       ... to COMPARE                */
    /*   if ((x = 5))      ... to ASSIGN, and say so     */
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code>, this file produces exactly the two warnings the slide predicts: <em>warning: using the result of an assignment as a condition without parentheses [-Wparentheses]</em> and <em>warning: unused variable 'unused' [-Wunused-variable]</em>. At run time it prints <code>x = 5 -&gt; condition is TRUE</code> — the <code>if</code> was always going to be true, because <code>x = 5</code> evaluates to 5, and 5 is non-zero. That is the bug the extra parentheses rule exists to prevent.</p>
<p class="pitfall">⚠️ Compile with warnings turned ON or these guidelines are invisible. Dev-C++: Tools → Compiler Options → add <code>-Wall</code> next to the <code>-g</code> you will add on slide 56. Command line: <code>gcc -Wall -g prog.c -o prog</code>. A clean <code>-Wall</code> build is the cheapest quality gate in the whole course.</p>`,
        `<p class="y-chinh">🎯 Năm quy tắc cuối nói về <strong>thứ bạn để lại</strong> — trạng thái mà chương trình phải ở trong đó khi bạn giao nó cho người khác.</p>
<ul>
<li><strong>"Tránh thuật toán màu mè, có thể hiệu quả nhưng khó đọc"</strong> — <code>x ^= y; y ^= x; x ^= y;</code> hoán đổi hai số nguyên mà không cần biến tạm, trông rất khôn. Nó cũng khiến người đọc mất một phút, trong khi <code>t = x; x = y; y = t;</code> bình thường chẳng tốn gì đo được trên máy hiện đại. Rõ ràng trước đã; chỉ tối ưu khi có phép đo bắt buộc phải tối ưu.</li>
<li><strong>"Thêm chú thích ở chỗ mã ĐÃ được tinh chỉnh cho chạy nhanh"</strong> — ngoại lệ của quy tắc trên. Nếu bạn thật sự buộc phải viết bản nhanh-mà-xấu thì bạn nợ người đọc sau một lời giải thích vì sao, không thì họ sẽ "đơn giản hoá" nó về như cũ.</li>
<li><strong>"Thêm một cặp ngoặc đơn nữa ở chỗ phép gán được dùng làm điều kiện"</strong> — <code>while ((c = getchar()) != EOF)</code>. Cặp ngoặc bên trong không phải yêu cầu của ngữ pháp; nó là một lời ký tên rằng bạn cố ý viết <code>=</code> chứ không gõ nhầm <code>==</code>. Mọi trình biên dịch C đều cảnh báo khi thiếu nó.</li>
<li><strong>"Xoá các biến không được tham chiếu"</strong> — một biến khai báo mà chẳng bao giờ dùng là tàn dư của một ý tưởng đã bỏ. Nó ngốn thời gian thật của người đọc ("chỗ nào dùng nhỉ… không chỗ nào à?") và còn che lỗi gõ, vì cái biến bạn <em>định</em> cập nhật rất có thể chính là cái đang bị bỏ không.</li>
<li><strong>"Xoá hết mã bị comment và các câu lệnh gỡ lỗi khỏi bản phát hành"</strong> — mấy dòng <code>printf("here 1\\n")</code> bạn rắc ra lúc truy lỗi, và những khối bạn comment lại thay vì xoá. Hệ quản lý phiên bản nhớ giùm mã đã xoá; người đọc của bạn thì không cần nhớ.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    int x = 3;
    int unused;                     /* quy tac 4: khong dung - xoa di */

    if (x = 5)                      /* pham quy tac 3: la = hay ==?   */
        printf("x = %d -&gt; dieu kien DUNG\\n", x);

    /* hai dang trung thuc dang le phai viet: */
    /*   if (x == 5)       ... de SO SANH               */
    /*   if ((x = 5))      ... de GAN, va noi ro la gan */
    return 0;
}</code></pre>
<p class="dap-an">✅ Biên dịch bằng <code>cc -Wall</code>, file này cho ra đúng hai cảnh báo mà slide dự đoán: <em>warning: using the result of an assignment as a condition without parentheses [-Wparentheses]</em> và <em>warning: unused variable 'unused' [-Wunused-variable]</em>. Lúc chạy nó in <code>x = 5 -&gt; dieu kien DUNG</code> — lệnh <code>if</code> chắc chắn luôn đúng, vì <code>x = 5</code> cho ra giá trị 5, mà 5 thì khác 0. Đó chính là con bọ mà quy tắc thêm cặp ngoặc sinh ra để chặn.</p>
<p class="pitfall">⚠️ Phải BẬT cảnh báo khi biên dịch, không thì mấy guideline này vô hình. Dev-C++: Tools → Compiler Options → thêm <code>-Wall</code> bên cạnh cái <code>-g</code> mà slide 56 sắp bảo bạn thêm. Dòng lệnh: <code>gcc -Wall -g prog.c -o prog</code>. Một lần build sạch <code>-Wall</code> là cổng chất lượng rẻ nhất trong cả môn học.</p>`],

      [49, 'Walkthroughs (section divider)',
        `<p class="y-chinh">🎯 The third and last section of the deck, and it answers objective 3 from slide 3: <em>"How can I understand a program?"</em> The answer is not "read it harder" — it is <strong>execute it yourself, on paper</strong>.</p>
<ul>
<li><strong>Why this section exists at all</strong> — you can write a program by imitation without ever knowing what it does. A walkthrough is the test that tells the difference between <em>copying</em> and <em>understanding</em>.</li>
<li><strong>This is the exam skill</strong> — "what does the following program print?" is the single most common question type in the PRF192 multiple-choice paper, and the only reliable way to answer it is a walkthrough table. Guessing from the shape of the loop is how people lose those marks.</li>
<li><strong>Two tools, one idea</strong> — slides 50–53 teach the <em>manual</em> walkthrough (you are the CPU, paper is the memory). Slides 54–59 teach the <em>automatic</em> one (the debugger is the CPU, the Watch window is the memory). Both produce the same table; only the speed differs.</li>
<li><strong>It also finds bugs</strong> — when your hand-trace and the real output disagree, one of the two is wrong, and either way you have learned something: either your model of C is wrong, or your code is.</li>
<li><strong>What comes next</strong> — slide 50 defines the term, slide 51 works Example 1, slide 52 works Example 2, slide 53 is your exercise, and then the debugger section begins.</li>
</ul>
<p class="meo">💡 Do the trace with a pen, not in your head. The whole point is that human working memory holds about four items, and a loop with three variables and a condition is already five. The table is an external memory.</p>`,
        `<p class="y-chinh">🎯 Phần thứ ba và cũng là phần cuối của deck, trả lời mục tiêu số 3 ở slide 3: <em>"Làm sao hiểu được một chương trình?"</em> Câu trả lời không phải "đọc kỹ hơn" — mà là <strong>tự mình chạy nó, trên giấy</strong>.</p>
<ul>
<li><strong>Vì sao phải có hẳn một phần cho việc này</strong> — bạn hoàn toàn có thể viết được chương trình nhờ bắt chước mà chẳng biết nó làm gì. Walkthrough chính là phép thử phân biệt <em>chép lại</em> với <em>hiểu</em>.</li>
<li><strong>Đây là kỹ năng đi thi</strong> — "chương trình sau in ra gì?" là dạng câu hỏi phổ biến nhất trong đề trắc nghiệm PRF192, và cách duy nhất trả lời chắc chắn là lập bảng vết. Đoán theo hình dáng vòng lặp chính là cách người ta mất những điểm ấy.</li>
<li><strong>Hai công cụ, một ý tưởng</strong> — slide 50–53 dạy walkthrough <em>thủ công</em> (bạn là CPU, tờ giấy là bộ nhớ). Slide 54–59 dạy walkthrough <em>tự động</em> (trình gỡ lỗi là CPU, cửa sổ Watch là bộ nhớ). Cả hai cho ra cùng một bảng; chỉ khác tốc độ.</li>
<li><strong>Nó còn tìm ra lỗi</strong> — khi bảng chạy tay của bạn và kết quả thật không khớp, một trong hai cái sai, và đằng nào bạn cũng học được: hoặc hình dung của bạn về C sai, hoặc mã của bạn sai.</li>
<li><strong>Sắp tới là gì</strong> — slide 50 định nghĩa thuật ngữ, slide 51 giải Example 1, slide 52 giải Example 2, slide 53 là bài tập của bạn, rồi mở sang phần trình gỡ lỗi.</li>
</ul>
<p class="meo">💡 Hãy vẽ bảng bằng bút, đừng chạy trong đầu. Toàn bộ vấn đề nằm ở chỗ trí nhớ làm việc của con người giữ được chừng bốn món, mà một vòng lặp ba biến kèm một điều kiện đã là năm. Cái bảng chính là bộ nhớ ngoài.</p>`],

      [50, 'Walkthroughs — definition and the three ways',
        `<p class="y-chinh">🎯 The slide builds a chain of four sentences: understanding code is a programmer's skill → to understand it you must know how it executes → to know how it executes you must <strong>perform each instruction yourself</strong> → that performance, written down, is a <strong>walkthrough</strong>.</p>
<ul>
<li><strong>The formal definition — two parts, both required</strong> — a walkthrough is (1) <em>a record of the changes that occur in the values of program variables as the program executes</em>, and (2) <em>a listing of the output, if any, produced by the program</em>. Students routinely do part 1 and forget part 2, then answer "what does it print?" with the final value of a variable instead of the text that was printed.</li>
<li><strong>Way 1 — Memory Map ("you knew that")</strong> — the picture from Slot 02–04: each variable is a labelled box at an address, and you rub out and rewrite the contents as the program runs. Accurate, but slow, and it shows only the present, never the history.</li>
<li><strong>Way 2 — Walkthrough Tables ("a simpler way")</strong> — one column per variable, one row per step. It keeps the <em>whole history</em> visible, which is exactly what you need to spot the step where a loop went wrong. This is the method slides 51–53 use, and the one to use in the exam.</li>
<li><strong>Way 3 — Debug a program</strong> — let the machine do it. The slide previews the two questions answered on slide 54: <em>what is debugging?</em> and <em>why use debugging?</em></li>
<li><strong>How to lay out the table</strong> — one column for the loop/step number, one column per variable that changes, one column for the condition being tested, and a final column for anything printed. Then fill it in <em>row by row, never column by column</em>: the CPU executes in time order, and so must you.</li>
</ul>
<table>
<thead><tr><th>Method</th><th>Shows history?</th><th>Speed</th><th>Needs a computer?</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>Memory map</td><td>No — only the current state</td><td>Slow</td><td>No</td><td>Understanding addresses and types</td></tr>
<tr><td>Walkthrough table</td><td><strong>Yes — every step</strong></td><td>Medium</td><td>No</td><td><strong>Exams, and finding the exact step a loop breaks</strong></td></tr>
<tr><td>Debugger</td><td>Yes, but one step at a time</td><td>Fast</td><td>Yes</td><td>Long programs, real bugs, unknown code</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ The commonest walkthrough mistake: updating two variables "at the same time". C executes one statement at a time, in order. If the body is <code>c += 2*a-b; a++; b+=2;</code> then <code>c</code> is computed with the <em>old</em> a and b — the increments have not happened yet. Slide 51 is exactly this trap.</p>`,
        `<p class="y-chinh">🎯 Slide dựng một chuỗi bốn câu: hiểu mã là kỹ năng của lập trình viên → muốn hiểu thì phải biết nó chạy thế nào → muốn biết nó chạy thế nào thì phải <strong>tự mình thực hiện từng lệnh</strong> → lần thực hiện ấy, viết ra giấy, chính là <strong>walkthrough</strong>.</p>
<ul>
<li><strong>Định nghĩa chính thức — hai phần, bắt buộc cả hai</strong> — walkthrough gồm (1) <em>bản ghi những thay đổi xảy ra với giá trị các biến trong lúc chương trình chạy</em>, và (2) <em>danh sách phần xuất ra, nếu có, mà chương trình tạo ra</em>. Sinh viên thường làm phần 1 rồi quên phần 2, rồi trả lời "nó in ra gì?" bằng giá trị cuối của một biến thay vì bằng đoạn chữ đã được in.</li>
<li><strong>Cách 1 — Memory Map ("cái này bạn biết rồi")</strong> — bức hình từ Slot 02–04: mỗi biến là một ô có nhãn ở một địa chỉ, và bạn tẩy đi ghi lại nội dung theo tiến trình chạy. Chính xác, nhưng chậm, và nó chỉ cho thấy hiện tại chứ không cho thấy lịch sử.</li>
<li><strong>Cách 2 — Bảng vết ("cách đơn giản hơn")</strong> — mỗi biến một cột, mỗi bước một dòng. Nó giữ <em>toàn bộ lịch sử</em> trước mắt, đúng thứ bạn cần để chỉ ra bước nào vòng lặp đi sai. Đây là cách slide 51–53 dùng, và là cách nên dùng trong phòng thi.</li>
<li><strong>Cách 3 — Gỡ lỗi chương trình</strong> — để máy làm hộ. Slide nêu trước hai câu hỏi sẽ được trả lời ở slide 54: <em>gỡ lỗi là gì?</em> và <em>vì sao phải gỡ lỗi?</em></li>
<li><strong>Kẻ bảng như thế nào</strong> — một cột cho số thứ tự bước/vòng, mỗi biến thay đổi một cột, một cột cho điều kiện đang được kiểm, và một cột cuối cho mọi thứ được in ra. Rồi điền <em>theo từng dòng, tuyệt đối không điền theo cột</em>: CPU chạy theo trục thời gian, bạn cũng phải vậy.</li>
</ul>
<table>
<thead><tr><th>Cách</th><th>Thấy lịch sử?</th><th>Tốc độ</th><th>Cần máy tính?</th><th>Hợp nhất với</th></tr></thead>
<tbody>
<tr><td>Memory map</td><td>Không — chỉ thấy trạng thái hiện tại</td><td>Chậm</td><td>Không</td><td>Hiểu địa chỉ và kiểu dữ liệu</td></tr>
<tr><td>Bảng vết</td><td><strong>Có — từng bước một</strong></td><td>Vừa</td><td>Không</td><td><strong>Đi thi, và tìm đúng bước vòng lặp hỏng</strong></td></tr>
<tr><td>Trình gỡ lỗi</td><td>Có, nhưng mỗi lần một bước</td><td>Nhanh</td><td>Có</td><td>Chương trình dài, lỗi thật, mã lạ chưa đọc bao giờ</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Lỗi chạy tay phổ biến nhất: cập nhật hai biến "cùng một lúc". C thực hiện từng câu lệnh một, theo thứ tự. Nếu thân vòng lặp là <code>c += 2*a-b; a++; b+=2;</code> thì <code>c</code> được tính bằng a và b <em>cũ</em> — hai phép tăng chưa hề xảy ra. Slide 51 chính là cái bẫy này.</p>`],

      [51, 'Walkthroughs (cont.) — Example 1: Walkthrough1.c',
        `<p class="y-chinh">🎯 The first worked walkthrough. The program on the slide is short but every one of its five lines matters, and the table beside it is the model answer you are expected to reproduce in the exam.</p>
<pre><code>/*Walkthrough1.c*/
#include &lt;stdio.h&gt;
int main()
{   int a=5, b=2, c=1;
    while (a+b&lt;20)
    {   c += 2*a-b;
        a++;
        b+=2;
    }
    printf("%d", c);
    getchar();
    return 0;
}</code></pre>
<ul>
<li><strong>Step 0 — set up the table</strong> — the changing variables are <code>a</code>, <code>b</code>, <code>c</code>; the tested expression is <code>a+b</code>; there is one output at the very end. So: one row per <em>test of the while condition</em>, showing the values as they stand <em>at that test</em>.</li>
<li><strong>Step 1 — initial row</strong> — <code>a=5, b=2, c=1</code>, so <code>a+b = 7</code>. 7 &lt; 20 is true, enter the body.</li>
<li><strong>Step 2 — execute the body in order</strong> — <code>c += 2*a-b</code> uses the CURRENT a and b: <code>2*5-2 = 8</code>, so <code>c = 1+8 = 9</code>. Only then <code>a++</code> → 6, and <code>b+=2</code> → 4.</li>
<li><strong>Step 3 — repeat</strong> — each pass adds 1 to a and 2 to b, so <code>2*a-b</code> changes by <code>2*1 - 2 = 0</code>: it is <strong>always 8</strong>. That is the hidden structure of this exercise, and it is why c climbs by a constant 8 every pass.</li>
<li><strong>Step 4 — the exit</strong> — a+b grows by 3 per pass: 7, 10, 13, 16, 19, 22. The first value that is <em>not</em> &lt; 20 is 22, so the loop runs exactly 5 times and <code>c = 1 + 5×8 = 41</code>.</li>
</ul>
<table>
<thead><tr><th>Test #</th><th>a</th><th>b</th><th>a+b</th><th>a+b &lt; 20 ?</th><th>2*a-b</th><th>c before</th><th>c after</th></tr></thead>
<tbody>
<tr><td>1</td><td>5</td><td>2</td><td>7</td><td>true → enter</td><td>8</td><td>1</td><td>9</td></tr>
<tr><td>2</td><td>6</td><td>4</td><td>10</td><td>true → enter</td><td>8</td><td>9</td><td>17</td></tr>
<tr><td>3</td><td>7</td><td>6</td><td>13</td><td>true → enter</td><td>8</td><td>17</td><td>25</td></tr>
<tr><td>4</td><td>8</td><td>8</td><td><strong>16</strong></td><td>true → enter</td><td>8</td><td>25</td><td>33</td></tr>
<tr><td>5</td><td>9</td><td>10</td><td>19</td><td>true → enter</td><td>8</td><td>33</td><td>41</td></tr>
<tr><td>6</td><td>10</td><td>12</td><td>22</td><td><strong>false → exit</strong></td><td>—</td><td>41</td><td>41</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Output: <code>41</code> — exactly what the slide's Output box shows, and confirmed by compiling and running the program. <strong>One correction to the slide, however:</strong> in the printed table the row with <code>a = 8, b = 8</code> gives <code>a+b = 18</code>. That is a typo — 8 + 8 = <strong>16</strong>. The final answer is unaffected, because 16 is still less than 20, so the loop continues either way and c still ends at 41. Write 16 in your own table; if a marker's answer key repeats 18, the value is still under 20 and the conclusion stands.</p>
<p class="pitfall">⚠️ <code>getchar()</code> on the second-to-last line is not part of the algorithm. It is there so the console window stays open on Windows until you press Enter — the same job as <code>system("pause")</code> in the debug program on slide 55. Never let it into your walkthrough table as a step that changes a value.</p>`,
        `<p class="y-chinh">🎯 Bài walkthrough mẫu đầu tiên. Chương trình trên slide ngắn nhưng cả năm dòng đều có vai trò, và cái bảng bên cạnh chính là bài giải mẫu mà bạn được chờ đợi sẽ dựng lại trong phòng thi.</p>
<pre><code>/*Walkthrough1.c*/
#include &lt;stdio.h&gt;
int main()
{   int a=5, b=2, c=1;
    while (a+b&lt;20)
    {   c += 2*a-b;
        a++;
        b+=2;
    }
    printf("%d", c);
    getchar();
    return 0;
}</code></pre>
<ul>
<li><strong>Bước 0 — dựng bảng</strong> — các biến thay đổi là <code>a</code>, <code>b</code>, <code>c</code>; biểu thức được kiểm là <code>a+b</code>; có đúng một lần xuất ở cuối cùng. Vậy: mỗi <em>lần kiểm điều kiện while</em> một dòng, ghi các giá trị đúng tại thời điểm kiểm.</li>
<li><strong>Bước 1 — dòng khởi đầu</strong> — <code>a=5, b=2, c=1</code>, nên <code>a+b = 7</code>. 7 &lt; 20 đúng, vào thân.</li>
<li><strong>Bước 2 — thực hiện thân theo đúng thứ tự</strong> — <code>c += 2*a-b</code> dùng a và b HIỆN TẠI: <code>2*5-2 = 8</code>, nên <code>c = 1+8 = 9</code>. Xong rồi mới tới <code>a++</code> → 6, và <code>b+=2</code> → 4.</li>
<li><strong>Bước 3 — lặp lại</strong> — mỗi lượt a tăng 1 còn b tăng 2, nên <code>2*a-b</code> thay đổi một lượng <code>2*1 - 2 = 0</code>: nó <strong>luôn bằng 8</strong>. Đó là cấu trúc ngầm của bài này, và là lý do c leo đều đặn 8 đơn vị mỗi lượt.</li>
<li><strong>Bước 4 — lúc thoát</strong> — a+b tăng 3 mỗi lượt: 7, 10, 13, 16, 19, 22. Giá trị đầu tiên <em>không</em> còn &lt; 20 là 22, nên vòng lặp chạy đúng 5 lượt và <code>c = 1 + 5×8 = 41</code>.</li>
</ul>
<table>
<thead><tr><th>Lần kiểm</th><th>a</th><th>b</th><th>a+b</th><th>a+b &lt; 20 ?</th><th>2*a-b</th><th>c trước</th><th>c sau</th></tr></thead>
<tbody>
<tr><td>1</td><td>5</td><td>2</td><td>7</td><td>đúng → vào</td><td>8</td><td>1</td><td>9</td></tr>
<tr><td>2</td><td>6</td><td>4</td><td>10</td><td>đúng → vào</td><td>8</td><td>9</td><td>17</td></tr>
<tr><td>3</td><td>7</td><td>6</td><td>13</td><td>đúng → vào</td><td>8</td><td>17</td><td>25</td></tr>
<tr><td>4</td><td>8</td><td>8</td><td><strong>16</strong></td><td>đúng → vào</td><td>8</td><td>25</td><td>33</td></tr>
<tr><td>5</td><td>9</td><td>10</td><td>19</td><td>đúng → vào</td><td>8</td><td>33</td><td>41</td></tr>
<tr><td>6</td><td>10</td><td>12</td><td>22</td><td><strong>sai → thoát</strong></td><td>—</td><td>41</td><td>41</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Kết quả in ra: <code>41</code> — đúng như khung Output trên slide, và đã được xác nhận bằng cách biên dịch rồi chạy thật chương trình. <strong>Tuy nhiên có một chỗ slide ghi sai:</strong> ở dòng <code>a = 8, b = 8</code>, bảng in trên slide ghi <code>a+b = 18</code>. Đó là lỗi đánh máy — 8 + 8 = <strong>16</strong>. Đáp số cuối không bị ảnh hưởng, vì 16 vẫn nhỏ hơn 20 nên vòng lặp vẫn chạy tiếp và c vẫn dừng ở 41. Hãy ghi 16 vào bảng của mình; nếu đáp án chấm có chép lại số 18 thì nó vẫn dưới 20 nên kết luận không đổi.</p>
<p class="pitfall">⚠️ Lệnh <code>getchar()</code> ở dòng gần cuối không thuộc về thuật toán. Nó nằm đó để cửa sổ console trên Windows không tắt ngay cho tới khi bạn bấm Enter — cùng nhiệm vụ với <code>system("pause")</code> trong chương trình gỡ lỗi ở slide 55. Đừng bao giờ đưa nó vào bảng vết như một bước làm đổi giá trị.</p>`],

      [52, 'Walkthroughs (cont.) — Example 2: for + if, input 15',
        `<p class="y-chinh">🎯 A harder trace, because now three things vary at once: the loop counter jumps by 3, an <code>if</code> filters which values are used, and the accumulator only sometimes changes. The question is fixed: <em>what is the output if the input is 15?</em></p>
<pre><code>int n, i, S=0;
scanf("%d", &amp;n);
for (i=1; i&lt;=n; i+=3)
    if (i%2!=0 &amp;&amp; i%3!=0) S+=i;
printf("%d", S);</code></pre>
<ul>
<li><strong>Step 1 — the input row</strong> — <code>n = 15</code> and it never changes again. The slide's table gives <code>n</code> its own one-cell row for exactly that reason: a constant deserves one cell, not a column.</li>
<li><strong>Step 2 — the i sequence</strong> — <code>i</code> starts at 1 and the step is <code>i+=3</code>, not <code>i++</code>. So i takes 1, 4, 7, 10, 13, then 16. The condition <code>i&lt;=15</code> fails at 16, so <strong>six values are tested and five bodies run</strong>.</li>
<li><strong>Step 3 — the filter</strong> — <code>i%2!=0 &amp;&amp; i%3!=0</code> means "i is odd AND i is not a multiple of 3". Because <code>&amp;&amp;</code> short-circuits (slide 25), when i is even the second test is never evaluated at all.</li>
<li><strong>Step 4 — apply it value by value</strong> — 1: odd ✓, 1%3=1 ✓ → take. 4: even ✗ → skip. 7: odd ✓, 7%3=1 ✓ → take. 10: even ✗ → skip. 13: odd ✓, 13%3=1 ✓ → take.</li>
<li><strong>Step 5 — accumulate</strong> — S = 0+1 = 1, then 1+7 = 8, then 8+13 = 21. Nothing after that, because i = 16 leaves the loop.</li>
</ul>
<table>
<thead><tr><th>i</th><th>i &lt;= 15 ?</th><th>i % 2</th><th>i % 3</th><th>i%2!=0 &amp;&amp; i%3!=0</th><th>S before</th><th>S after</th></tr></thead>
<tbody>
<tr><td>1</td><td>yes</td><td>1</td><td>1</td><td><strong>true</strong> → S += 1</td><td>0</td><td>1</td></tr>
<tr><td>4</td><td>yes</td><td>0</td><td>1</td><td>false (even)</td><td>1</td><td>1</td></tr>
<tr><td>7</td><td>yes</td><td>1</td><td>1</td><td><strong>true</strong> → S += 7</td><td>1</td><td>8</td></tr>
<tr><td>10</td><td>yes</td><td>0</td><td>1</td><td>false (even)</td><td>8</td><td>8</td></tr>
<tr><td>13</td><td>yes</td><td>1</td><td>1</td><td><strong>true</strong> → S += 13</td><td>8</td><td>21</td></tr>
<tr><td>16</td><td><strong>no → exit</strong></td><td>—</td><td>—</td><td>—</td><td>21</td><td>21</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Output: <code>21</code>. This matches the slide's own table (<code>0+1→1</code>, <code>1+7→8</code>, <code>8+13→21</code>, <code>S=21</code>), and was confirmed by compiling the program and feeding it 15 on standard input. Notice the printed value is 21, <em>not</em> the value of i (16) and <em>not</em> the count of matches (3) — the second half of the walkthrough definition on slide 50 is what keeps you honest here.</p>
<p class="meo">💡 Sanity check without the table: with step 3 starting from 1, every i is ≡ 1 (mod 3), so <code>i%3</code> can never be 0 and the second test is <em>always</em> true. The condition therefore reduces to "i is odd", and the odd members of 1, 4, 7, 10, 13 are 1, 7, 13 → 21. If your table and your shortcut disagree, trust the table.</p>`,
        `<p class="y-chinh">🎯 Một bài chạy tay khó hơn, vì giờ ba thứ cùng biến thiên: biến đếm nhảy 3 đơn vị, một lệnh <code>if</code> lọc xem giá trị nào được dùng, và biến tích luỹ chỉ đôi khi mới đổi. Câu hỏi thì cố định: <em>in ra gì nếu nhập 15?</em></p>
<pre><code>int n, i, S=0;
scanf("%d", &amp;n);
for (i=1; i&lt;=n; i+=3)
    if (i%2!=0 &amp;&amp; i%3!=0) S+=i;
printf("%d", S);</code></pre>
<ul>
<li><strong>Bước 1 — dòng dữ liệu vào</strong> — <code>n = 15</code> và từ đó không đổi nữa. Bảng trên slide cho <code>n</code> hẳn một dòng một ô đúng vì lý do ấy: hằng số thì xứng một ô, không xứng cả một cột.</li>
<li><strong>Bước 2 — dãy giá trị của i</strong> — <code>i</code> bắt đầu từ 1 và bước nhảy là <code>i+=3</code>, không phải <code>i++</code>. Nên i lần lượt là 1, 4, 7, 10, 13, rồi 16. Điều kiện <code>i&lt;=15</code> sai ở 16, vậy <strong>sáu giá trị được kiểm và năm lần thân chạy</strong>.</li>
<li><strong>Bước 3 — bộ lọc</strong> — <code>i%2!=0 &amp;&amp; i%3!=0</code> nghĩa là "i lẻ VÀ i không chia hết cho 3". Vì <code>&amp;&amp;</code> có tính ngắn mạch (slide 25), khi i chẵn thì vế thứ hai không hề được tính.</li>
<li><strong>Bước 4 — áp vào từng giá trị</strong> — 1: lẻ ✓, 1%3=1 ✓ → lấy. 4: chẵn ✗ → bỏ. 7: lẻ ✓, 7%3=1 ✓ → lấy. 10: chẵn ✗ → bỏ. 13: lẻ ✓, 13%3=1 ✓ → lấy.</li>
<li><strong>Bước 5 — cộng dồn</strong> — S = 0+1 = 1, rồi 1+7 = 8, rồi 8+13 = 21. Sau đó hết, vì i = 16 làm vòng lặp thoát.</li>
</ul>
<table>
<thead><tr><th>i</th><th>i &lt;= 15 ?</th><th>i % 2</th><th>i % 3</th><th>i%2!=0 &amp;&amp; i%3!=0</th><th>S trước</th><th>S sau</th></tr></thead>
<tbody>
<tr><td>1</td><td>có</td><td>1</td><td>1</td><td><strong>đúng</strong> → S += 1</td><td>0</td><td>1</td></tr>
<tr><td>4</td><td>có</td><td>0</td><td>1</td><td>sai (chẵn)</td><td>1</td><td>1</td></tr>
<tr><td>7</td><td>có</td><td>1</td><td>1</td><td><strong>đúng</strong> → S += 7</td><td>1</td><td>8</td></tr>
<tr><td>10</td><td>có</td><td>0</td><td>1</td><td>sai (chẵn)</td><td>8</td><td>8</td></tr>
<tr><td>13</td><td>có</td><td>1</td><td>1</td><td><strong>đúng</strong> → S += 13</td><td>8</td><td>21</td></tr>
<tr><td>16</td><td><strong>không → thoát</strong></td><td>—</td><td>—</td><td>—</td><td>21</td><td>21</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Kết quả in ra: <code>21</code>. Khớp với chính bảng trên slide (<code>0+1→1</code>, <code>1+7→8</code>, <code>8+13→21</code>, <code>S=21</code>), và đã được xác nhận bằng cách biên dịch chương trình rồi nạp 15 vào đầu vào chuẩn. Để ý giá trị in ra là 21, <em>không phải</em> giá trị của i (16) và cũng <em>không phải</em> số lần khớp điều kiện (3) — nửa sau của định nghĩa walkthrough ở slide 50 chính là thứ giữ bạn khỏi nhầm chỗ này.</p>
<p class="meo">💡 Cách kiểm nhanh không cần bảng: bước nhảy 3 xuất phát từ 1 nên mọi i đều đồng dư 1 theo modulo 3, vậy <code>i%3</code> không bao giờ bằng 0 và vế thứ hai <em>luôn</em> đúng. Điều kiện rút gọn thành "i lẻ", mà các số lẻ trong 1, 4, 7, 10, 13 là 1, 7, 13 → 21. Nếu bảng và mẹo nhanh mâu thuẫn, hãy tin cái bảng.</p>`],

      [53, 'Walkthroughs — Exercise (scanf order and format matching)',
        `<p class="y-chinh">🎯 The exercise looks like another sum, but the real subject is <strong>scanf</strong>: which variable receives which number, and what happens when the format string contains literal characters.</p>
<pre><code>int m, n, i, S=0;
scanf("%d%d", &amp;n, &amp;m);          /* note the ORDER: n first, then m */
for (i=m; i&lt;=n; i++) S+=i;
printf("%d", S);</code></pre>
<ul>
<li><strong>Step 1 — read the scanf argument order, not the declaration order</strong> — the variables are declared <code>m, n</code> but read <code>&amp;n, &amp;m</code>. With input <code>8 12</code>: the first number goes to <strong>n = 8</strong>, the second to <strong>m = 12</strong>. This deliberate mismatch is the whole trick of the question.</li>
<li><strong>Step 2 — trace the loop</strong> — <code>for (i = m; i &lt;= n; i++)</code> becomes <code>for (i = 12; i &lt;= 8; i++)</code>. The condition is tested <em>before</em> the first body (slide 30), 12 &lt;= 8 is false, so the body runs <strong>zero</strong> times.</li>
<li><strong>Step 3 — S never changes</strong> — it keeps its initial value 0, and that is what gets printed.</li>
<li><strong>Step 4 — the second program, <code>scanf("%da%d", &amp;n, &amp;m)</code> with input <code>8a12</code></strong> — a non-whitespace character in a format string must be matched <em>literally</em> by the input. Here the input really does contain <code>a</code> between the numbers, so the match succeeds: n = 8, m = 12 again, and the output is again 0.</li>
<li><strong>Step 5 — the "Test the program" table</strong> — four modifications, and every one of them ends up with n = 12 and m = 8, which finally makes the loop run: i = 8, 9, 10, 11, 12 → S = 50.</li>
</ul>
<table>
<thead><tr><th>Format</th><th>Input typed</th><th>n</th><th>m</th><th>Loop <code>i = m … n</code></th><th>Output</th></tr></thead>
<tbody>
<tr><td><code>"%d%d"</code></td><td><code>8 12</code></td><td>8</td><td>12</td><td>12 &lt;= 8 false → 0 passes</td><td><strong>0</strong></td></tr>
<tr><td><code>"%da%d"</code></td><td><code>8a12</code></td><td>8</td><td>12</td><td>12 &lt;= 8 false → 0 passes</td><td><strong>0</strong></td></tr>
<tr><td><code>"%d %d"</code></td><td><code>12 8</code></td><td>12</td><td>8</td><td>8,9,10,11,12</td><td><strong>50</strong></td></tr>
<tr><td><code>"%d%d"</code></td><td><code>12 8</code></td><td>12</td><td>8</td><td>8,9,10,11,12</td><td><strong>50</strong></td></tr>
<tr><td><code>"%d%d"</code></td><td><code>12</code> ⏎ <code>8</code> (two lines)</td><td>12</td><td>8</td><td>8,9,10,11,12</td><td><strong>50</strong></td></tr>
<tr><td><code>"%d-%d"</code></td><td><code>12-8</code></td><td>12</td><td>8</td><td>8,9,10,11,12</td><td><strong>50</strong></td></tr>
</tbody>
</table>
<p class="dap-an">✅ Answers, all verified by compiling and running: input <code>8 12</code> → <strong>0</strong>; input <code>8a12</code> with <code>"%da%d"</code> → <strong>0</strong>; every row of the Test table → <strong>50</strong> (8+9+10+11+12 = 50). The lesson the table is teaching: <code>%d</code> itself already skips leading whitespace, so <code>"%d%d"</code> and <code>"%d %d"</code> behave identically, and a newline between the two numbers is just more whitespace. A <em>non</em>-whitespace literal such as <code>-</code> or <code>a</code>, however, must appear in the input exactly where the format says.</p>
<p class="pitfall">⚠️ Measured trap: <code>scanf("%d-%d", &amp;n, &amp;m)</code> with the input <code>12 -8</code> (a space before the minus) returns <strong>1</strong>, not 2 — the literal <code>-</code> does not skip the space, so the second conversion never happens and <code>m</code> keeps whatever garbage was in its memory. Running it printed a nonsense sum. Always check the <em>return value</em> of <code>scanf</code>: it is the number of items successfully read.</p>`,
        `<p class="y-chinh">🎯 Bài tập trông như lại một bài tính tổng, nhưng chủ đề thật của nó là <strong>scanf</strong>: biến nào nhận số nào, và chuyện gì xảy ra khi chuỗi định dạng chứa ký tự nguyên văn.</p>
<pre><code>int m, n, i, S=0;
scanf("%d%d", &amp;n, &amp;m);          /* chu y THU TU: n truoc, roi moi m */
for (i=m; i&lt;=n; i++) S+=i;
printf("%d", S);</code></pre>
<ul>
<li><strong>Bước 1 — đọc thứ tự đối số của scanf, đừng đọc thứ tự khai báo</strong> — các biến khai báo là <code>m, n</code> nhưng đọc vào là <code>&amp;n, &amp;m</code>. Với dữ liệu <code>8 12</code>: số thứ nhất vào <strong>n = 8</strong>, số thứ hai vào <strong>m = 12</strong>. Cái lệch cố ý này chính là toàn bộ mẹo của câu hỏi.</li>
<li><strong>Bước 2 — chạy tay vòng lặp</strong> — <code>for (i = m; i &lt;= n; i++)</code> trở thành <code>for (i = 12; i &lt;= 8; i++)</code>. Điều kiện được kiểm <em>trước</em> lần thân đầu tiên (slide 30), 12 &lt;= 8 là sai, nên thân chạy <strong>không</strong> lần nào.</li>
<li><strong>Bước 3 — S không hề đổi</strong> — nó giữ nguyên giá trị khởi tạo 0, và đó là thứ được in ra.</li>
<li><strong>Bước 4 — chương trình thứ hai, <code>scanf("%da%d", &amp;n, &amp;m)</code> với dữ liệu <code>8a12</code></strong> — một ký tự không phải khoảng trắng trong chuỗi định dạng phải được đầu vào khớp <em>nguyên văn</em>. Ở đây đầu vào đúng là có chữ <code>a</code> nằm giữa hai số nên khớp thành công: lại n = 8, m = 12, và kết quả lại là 0.</li>
<li><strong>Bước 5 — bảng "Test the program"</strong> — bốn cách sửa, và cả bốn đều dẫn tới n = 12, m = 8, khiến vòng lặp cuối cùng cũng chạy: i = 8, 9, 10, 11, 12 → S = 50.</li>
</ul>
<table>
<thead><tr><th>Định dạng</th><th>Gõ vào</th><th>n</th><th>m</th><th>Vòng lặp <code>i = m … n</code></th><th>In ra</th></tr></thead>
<tbody>
<tr><td><code>"%d%d"</code></td><td><code>8 12</code></td><td>8</td><td>12</td><td>12 &lt;= 8 sai → 0 lượt</td><td><strong>0</strong></td></tr>
<tr><td><code>"%da%d"</code></td><td><code>8a12</code></td><td>8</td><td>12</td><td>12 &lt;= 8 sai → 0 lượt</td><td><strong>0</strong></td></tr>
<tr><td><code>"%d %d"</code></td><td><code>12 8</code></td><td>12</td><td>8</td><td>8,9,10,11,12</td><td><strong>50</strong></td></tr>
<tr><td><code>"%d%d"</code></td><td><code>12 8</code></td><td>12</td><td>8</td><td>8,9,10,11,12</td><td><strong>50</strong></td></tr>
<tr><td><code>"%d%d"</code></td><td><code>12</code> ⏎ <code>8</code> (hai dòng)</td><td>12</td><td>8</td><td>8,9,10,11,12</td><td><strong>50</strong></td></tr>
<tr><td><code>"%d-%d"</code></td><td><code>12-8</code></td><td>12</td><td>8</td><td>8,9,10,11,12</td><td><strong>50</strong></td></tr>
</tbody>
</table>
<p class="dap-an">✅ Đáp án, tất cả đã kiểm bằng biên dịch và chạy thật: nhập <code>8 12</code> → <strong>0</strong>; nhập <code>8a12</code> với <code>"%da%d"</code> → <strong>0</strong>; mọi dòng của bảng Test → <strong>50</strong> (8+9+10+11+12 = 50). Bài học mà cái bảng đang dạy: bản thân <code>%d</code> đã tự bỏ qua khoảng trắng đứng trước, nên <code>"%d%d"</code> và <code>"%d %d"</code> hành xử y hệt nhau, và một dấu xuống dòng giữa hai số cũng chỉ là khoảng trắng. Nhưng một ký tự nguyên văn <em>không phải</em> khoảng trắng như <code>-</code> hay <code>a</code> thì bắt buộc phải xuất hiện trong đầu vào đúng chỗ mà định dạng chỉ ra.</p>
<p class="pitfall">⚠️ Bẫy đã đo thật: <code>scanf("%d-%d", &amp;n, &amp;m)</code> với đầu vào <code>12 -8</code> (có dấu cách trước dấu trừ) trả về <strong>1</strong> chứ không phải 2 — ký tự nguyên văn <code>-</code> không bỏ qua dấu cách, nên phép chuyển đổi thứ hai không hề xảy ra và <code>m</code> giữ nguyên đống rác sẵn có trong ô nhớ. Chạy thử thì in ra một cái tổng vô nghĩa. Luôn kiểm <em>giá trị trả về</em> của <code>scanf</code>: đó là số mục đọc vào thành công.</p>`],

      [54, 'Debug a program — what and why',
        `<p class="y-chinh">🎯 The slide defines debugging and then gives five reasons to do it. The definition is worth reading slowly: <em>"the process of identifying, analyzing, and fixing errors (or bugs) in the source code of a program."</em> Three verbs, in that order.</p>
<ul>
<li><strong>Identify → analyse → fix, and never skip a step</strong> — beginners jump straight to "fix", changing lines until the output looks right. That produces a program that works for the one input you tried. Identify means "which line", analyse means "why", and only then may you edit.</li>
<li><strong>"To identify and fix errors"</strong> — the obvious reason. A debugger shows you the actual value of a variable at an actual moment, instead of the value you assumed it had.</li>
<li><strong>"To save time and effort"</strong> — this is the real argument. Adding <code>printf</code> lines means edit → recompile → run → read → delete, for every guess. A breakpoint answers the same question once, with no edit and no recompile.</li>
<li><strong>"To understand program behavior"</strong> — which connects this section straight back to slides 50–53. Stepping through code with F7 <em>is</em> a walkthrough; the Watch window <em>is</em> the walkthrough table. This is why the deck put the two topics in one section.</li>
<li><strong>"To improve software quality" and "to prevent future issues"</strong> — a bug you understood teaches you a pattern; a bug you patched by guessing teaches you nothing and will come back in your next assignment.</li>
</ul>
<table>
<thead><tr><th>Error type</th><th>Found by</th><th>Symptom</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Syntax</td><td>The compiler</td><td>Program does not build</td><td><code>printf("hi")</code> with no <code>;</code></td></tr>
<tr><td>Runtime</td><td>The operating system, while running</td><td>Crash, freeze, "has stopped working"</td><td>Division by zero, infinite loop</td></tr>
<tr><td>Logical</td><td><strong>You — with a walkthrough or a debugger</strong></td><td>Builds, runs, prints the wrong answer</td><td><code>i &lt; n</code> where <code>i &lt;= n</code> was meant</td></tr>
<tr><td>Semantic</td><td>You, by re-reading the requirement</td><td>Right answer to the wrong question</td><td><code>sum / n</code> in <code>int</code> giving 3 instead of 3.8</td></tr>
</tbody>
</table>
<p class="meo">💡 Choose your tool by error type. Syntax errors: read the <em>first</em> compiler message only, then rebuild — later messages are usually the same error echoing. Runtime crashes: a breakpoint just before the suspicious line. Logical and semantic errors: a walkthrough table first, the debugger second, because for those two the machine cannot tell you what you <em>meant</em>.</p>`,
        `<p class="y-chinh">🎯 Slide định nghĩa gỡ lỗi rồi nêu năm lý do nên làm. Định nghĩa đáng đọc chậm: <em>"quá trình nhận diện, phân tích và sửa các lỗi (bug) trong mã nguồn của chương trình."</em> Ba động từ, theo đúng thứ tự ấy.</p>
<ul>
<li><strong>Nhận diện → phân tích → sửa, và tuyệt đối không bỏ bước</strong> — người mới học thường nhảy thẳng tới "sửa", đổi lung tung cho tới khi kết quả trông đúng. Cách đó cho ra một chương trình chạy đúng với đúng một bộ dữ liệu bạn đã thử. Nhận diện là "ở dòng nào", phân tích là "vì sao", xong rồi mới được phép sửa.</li>
<li><strong>"Để nhận diện và sửa lỗi"</strong> — lý do hiển nhiên. Trình gỡ lỗi cho bạn thấy giá trị thật của một biến tại một thời điểm thật, thay vì giá trị mà bạn đinh ninh nó đang có.</li>
<li><strong>"Để tiết kiệm thời gian và công sức"</strong> — đây mới là lý lẽ thật. Rắc thêm dòng <code>printf</code> nghĩa là sửa → dịch lại → chạy → đọc → xoá, cho từng lần đoán. Một cái breakpoint trả lời đúng câu hỏi ấy một lần, không phải sửa mã, không phải dịch lại.</li>
<li><strong>"Để hiểu hành vi của chương trình"</strong> — chỗ này nối thẳng về slide 50–53. Bước từng dòng bằng F7 <em>chính là</em> một walkthrough; cửa sổ Watch <em>chính là</em> bảng vết. Đó là lý do deck xếp hai chủ đề vào chung một phần.</li>
<li><strong>"Để nâng chất lượng phần mềm" và "để ngăn sự cố về sau"</strong> — một con bọ bạn hiểu ra sẽ dạy bạn một khuôn mẫu; một con bọ bạn vá bằng cách đoán mò chẳng dạy gì và sẽ quay lại trong bài assignment kế tiếp.</li>
</ul>
<table>
<thead><tr><th>Loại lỗi</th><th>Ai phát hiện</th><th>Triệu chứng</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Cú pháp (syntax)</td><td>Trình biên dịch</td><td>Không dịch được</td><td><code>printf("hi")</code> thiếu dấu <code>;</code></td></tr>
<tr><td>Lúc chạy (runtime)</td><td>Hệ điều hành, khi đang chạy</td><td>Sập, treo, "has stopped working"</td><td>Chia cho 0, vòng lặp vô tận</td></tr>
<tr><td>Logic</td><td><strong>Chính bạn — bằng bảng vết hoặc trình gỡ lỗi</strong></td><td>Dịch được, chạy được, in ra sai</td><td><code>i &lt; n</code> trong khi ý là <code>i &lt;= n</code></td></tr>
<tr><td>Ngữ nghĩa (semantic)</td><td>Bạn, khi đọc lại đề bài</td><td>Trả lời đúng cho một câu hỏi sai</td><td><code>sum / n</code> kiểu <code>int</code> cho 3 thay vì 3,8</td></tr>
</tbody>
</table>
<p class="meo">💡 Chọn công cụ theo loại lỗi. Lỗi cú pháp: chỉ đọc thông báo <em>đầu tiên</em> của trình biên dịch rồi dịch lại — mấy thông báo sau thường chỉ là tiếng vọng của cùng một lỗi. Sập lúc chạy: đặt breakpoint ngay trước dòng khả nghi. Lỗi logic và ngữ nghĩa: bảng vết trước, trình gỡ lỗi sau, vì với hai loại này máy không thể nói cho bạn biết bạn <em>định</em> làm gì.</p>`],

      [55, 'How to debug (Dev-C++) — Step 1: Write Your Code',
        `<p class="y-chinh">🎯 Step 1 of four. The screenshot shows Embarcadero Dev-C++ 6.3 with the file <code>debug_demo.c</code> open — a deliberately tiny program, because a debugging lesson must not also be a reading lesson.</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(){
    int i, sum = 0;

    for(i=1; i&lt;=5; i++){
        if(i % 2 == 1){
            printf("The odd number is: %d\\n", i);
            sum += i;
        }
    }

    printf("Sum the odd numbers is: %d\\n", sum);

    system("pause");
    return 0;
}</code></pre>
<ul>
<li><strong>What the program does</strong> — walks i from 1 to 5, and for each odd i prints it and adds it to <code>sum</code>. The odd values are 1, 3, 5, so it prints three lines and then the total 9.</li>
<li><strong>Why this program was chosen</strong> — it has exactly the two things a debugger is good at showing: a counter that changes every pass (<code>i</code>) and an accumulator that changes only sometimes (<code>sum</code>). You will watch both on slides 57–58.</li>
<li><strong>Line numbers matter from here on</strong> — the screenshot shows line 5 = the declaration, line 7 = the <code>for</code>, line 8 = the <code>if</code>, line 10 = <code>sum += i;</code>, line 14 = the final <code>printf</code>. Slide 57 sets breakpoints at 7 and 10, so keep the layout as shown.</li>
<li><strong>The toolbar says "TDM-GCC 9.2.0 64-bit Release"</strong> — note the word <strong>Release</strong>. That is the compiler profile with no debug information, which is precisely the thing Step 2 (slide 56) has to change. Debugging a Release build gives you a Watch window full of "Execute to evaluate" that never resolves.</li>
<li><strong><code>system("pause")</code> and <code>&lt;stdlib.h&gt;</code></strong> — <code>system</code> is declared in <code>stdlib.h</code>, which is why the second <code>#include</code> is there. It is a Windows-only console convenience (the same role as <code>getchar()</code> on slide 51); on macOS or Linux drop that line, and in production code drop it always (slide 48).</li>
</ul>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> (minus the Windows-only <code>system("pause")</code>) and run, the program prints exactly four lines: <code>The odd number is: 1</code> · <code>The odd number is: 3</code> · <code>The odd number is: 5</code> · <code>Sum the odd numbers is: 9</code>. Keep that expected output in mind — the whole point of Steps 2–4 is to watch <em>how</em> those four lines come to exist.</p>
<p class="meo">💡 On macOS or Linux the equivalent of Step 1 is the same file plus one compile flag: <code>gcc -Wall -g debug_demo.c -o debug_demo</code>. The <code>-g</code> is the whole of Step 2 in a single character.</p>`,
        `<p class="y-chinh">🎯 Bước 1 trong bốn bước. Ảnh chụp là Embarcadero Dev-C++ 6.3 đang mở file <code>debug_demo.c</code> — một chương trình cố ý làm thật nhỏ, vì một bài học gỡ lỗi không nên kiêm luôn bài học đọc hiểu.</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(){
    int i, sum = 0;

    for(i=1; i&lt;=5; i++){
        if(i % 2 == 1){
            printf("The odd number is: %d\\n", i);
            sum += i;
        }
    }

    printf("Sum the odd numbers is: %d\\n", sum);

    system("pause");
    return 0;
}</code></pre>
<ul>
<li><strong>Chương trình làm gì</strong> — cho i chạy từ 1 tới 5, gặp i lẻ thì in ra và cộng vào <code>sum</code>. Các giá trị lẻ là 1, 3, 5, nên nó in ba dòng rồi in tổng 9.</li>
<li><strong>Vì sao chọn đúng chương trình này</strong> — nó có đúng hai thứ mà trình gỡ lỗi giỏi phô bày: một biến đếm đổi mỗi lượt (<code>i</code>) và một biến tích luỹ chỉ thỉnh thoảng mới đổi (<code>sum</code>). Bạn sẽ theo dõi cả hai ở slide 57–58.</li>
<li><strong>Từ đây trở đi số dòng có ý nghĩa</strong> — ảnh chụp cho thấy dòng 5 là phần khai báo, dòng 7 là <code>for</code>, dòng 8 là <code>if</code>, dòng 10 là <code>sum += i;</code>, dòng 14 là <code>printf</code> cuối. Slide 57 đặt breakpoint ở dòng 7 và 10, nên hãy giữ nguyên cách trình bày như trong ảnh.</li>
<li><strong>Thanh công cụ ghi "TDM-GCC 9.2.0 64-bit Release"</strong> — chú ý chữ <strong>Release</strong>. Đó là hồ sơ biên dịch không kèm thông tin gỡ lỗi, đúng thứ mà Bước 2 (slide 56) phải đổi. Gỡ lỗi trên bản Release cho bạn một cửa sổ Watch đầy dòng "Execute to evaluate" không bao giờ hiện ra giá trị.</li>
<li><strong><code>system("pause")</code> và <code>&lt;stdlib.h&gt;</code></strong> — <code>system</code> được khai báo trong <code>stdlib.h</code>, đó là lý do có dòng <code>#include</code> thứ hai. Nó là tiện ích console chỉ dành cho Windows (cùng vai trò với <code>getchar()</code> ở slide 51); trên macOS hay Linux thì bỏ dòng ấy, còn trong mã sản phẩm thì bỏ luôn mãi mãi (slide 48).</li>
</ul>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> (bỏ dòng <code>system("pause")</code> vốn chỉ chạy trên Windows) và chạy thật, chương trình in đúng bốn dòng: <code>The odd number is: 1</code> · <code>The odd number is: 3</code> · <code>The odd number is: 5</code> · <code>Sum the odd numbers is: 9</code>. Hãy giữ kết quả mong đợi ấy trong đầu — toàn bộ mục đích của Bước 2–4 là xem <em>bằng cách nào</em> bốn dòng đó thành hình.</p>
<p class="meo">💡 Trên macOS hay Linux, Bước 1 tương đương là đúng file đó cộng một cờ biên dịch: <code>gcc -Wall -g debug_demo.c -o debug_demo</code>. Cái <code>-g</code> chính là toàn bộ Bước 2, gói trong một ký tự.</p>`],

      [56, 'How to debug (cont.) — Step 2: Enable Debugging',
        `<p class="y-chinh">🎯 Step 2, and it is the step everybody skips and then wonders why the debugger shows nothing. <em>Tools → Compiler Options</em>, and change three things, numbered ①②③ on the slide.</p>
<ul>
<li><strong>① Switch the compiler set to a Debug profile</strong> — the dropdown "Compiler set to configure" changes from <em>TDM-GCC 9.2.0 64-bit Release</em> to <em>TDM-GCC 9.2.0 64-bit <strong>Debug</strong></em>. This alone changes which flags every build uses.</li>
<li><strong>② Tick "Add the following commands when calling the compiler" and type <code>-g</code></strong> — <code>-g</code> tells gcc to keep the <em>debug symbols</em>: the table that maps machine addresses back to your line numbers and variable names. Without it the executable still runs perfectly but has no idea what "i" means.</li>
<li><strong>③ Tick "Add the following commands when calling the linker" and type <code>-static-libgcc</code></strong> — links the gcc runtime into the .exe instead of relying on a DLL. On the lab machines this avoids the "libgcc_s_seh-1.dll not found" failure that stops the debugger before it starts.</li>
<li><strong>Why a separate Debug profile instead of always using -g</strong> — debug builds are bigger and skip optimisation. You debug with <code>-g</code>, you ship without it. Keeping two profiles means one dropdown switch instead of editing flags twice a day.</li>
<li><strong>How to check it worked</strong> — rebuild (F9) and look at the Compile Log tab: the gcc command line shown there must contain <code>-g</code>. If it does not, the option was typed into the wrong compiler set — a very common slip, because the dialog configures <em>the set selected in ①</em>, not the one currently active.</li>
</ul>
<pre><code># the same two settings, on the command line

gcc -Wall -g  debug_demo.c -o debug_demo      # -g = keep debug symbols
gcc -Wall -O2 debug_demo.c -o debug_demo      # release: optimised, no symbols

# proof that -g did something (macOS / Linux):
#   with -g    -> the binary contains a __debug_info / .debug_info section
#   without -g -> that section is absent, and gdb says "no debugging symbols found"</code></pre>
<p class="dap-an">✅ What each flag actually buys you: <code>-g</code> → breakpoints can be placed by line number, and <code>i</code> and <code>sum</code> appear in the Watch window with real values. <code>-static-libgcc</code> → the .exe runs on a machine with no matching gcc DLL. <code>-O2</code> (release) → faster code, but the optimiser may merge or reorder lines, so single-stepping jumps around apparently at random. That last point is the real reason the slide insists on a Debug profile.</p>
<p class="pitfall">⚠️ Optimisation and debugging fight each other. If you ever step through code and the highlighted line jumps backwards, or a variable shows <code>&lt;optimized out&gt;</code>, you are debugging an optimised build. Go back to ① and pick the Debug set; do not conclude that "the debugger is broken".</p>`,
        `<p class="y-chinh">🎯 Bước 2, và đây là bước ai cũng bỏ qua rồi thắc mắc sao trình gỡ lỗi chẳng hiện gì. Vào <em>Tools → Compiler Options</em>, đổi ba thứ, đánh số ①②③ trên slide.</p>
<ul>
<li><strong>① Chuyển bộ biên dịch sang hồ sơ Debug</strong> — ô "Compiler set to configure" đổi từ <em>TDM-GCC 9.2.0 64-bit Release</em> sang <em>TDM-GCC 9.2.0 64-bit <strong>Debug</strong></em>. Chỉ riêng việc này đã đổi bộ cờ mà mọi lần dựng sử dụng.</li>
<li><strong>② Tích ô "Add the following commands when calling the compiler" rồi gõ <code>-g</code></strong> — <code>-g</code> bảo gcc giữ lại <em>ký hiệu gỡ lỗi</em>: cái bảng ánh xạ địa chỉ máy ngược về số dòng và tên biến của bạn. Thiếu nó thì tệp thực thi vẫn chạy ngon lành nhưng chẳng biết "i" là cái gì.</li>
<li><strong>③ Tích ô "Add the following commands when calling the linker" rồi gõ <code>-static-libgcc</code></strong> — nhúng thẳng thư viện chạy của gcc vào tệp .exe thay vì phụ thuộc vào một DLL bên ngoài. Trên máy phòng lab, điều này tránh được lỗi "libgcc_s_seh-1.dll not found" vốn chặn trình gỡ lỗi ngay trước khi nó kịp khởi động.</li>
<li><strong>Vì sao phải có hồ sơ Debug riêng thay vì luôn bật -g</strong> — bản debug nặng hơn và bỏ tối ưu. Bạn gỡ lỗi với <code>-g</code>, bạn giao hàng thì không. Giữ hai hồ sơ nghĩa là chỉ cần đổi một ô chọn thay vì sửa cờ hai lần mỗi ngày.</li>
<li><strong>Kiểm xem đã ăn chưa</strong> — dựng lại (F9) rồi nhìn tab Compile Log: dòng lệnh gcc hiện ở đó phải có <code>-g</code>. Nếu không có thì tuỳ chọn đã bị gõ vào nhầm bộ biên dịch — cú trượt rất hay gặp, vì hộp thoại cấu hình cho <em>bộ được chọn ở ô ①</em>, chứ không phải bộ đang hoạt động.</li>
</ul>
<pre><code># dung hai thiet lap do, nhung tren dong lenh

gcc -Wall -g  debug_demo.c -o debug_demo      # -g = giu ky hieu go loi
gcc -Wall -O2 debug_demo.c -o debug_demo      # ban phat hanh: toi uu, khong ky hieu

# bang chung -g da co tac dung (macOS / Linux):
#   co -g    -> tep nhi phan chua muc __debug_info / .debug_info
#   khong -g -> khong co muc do, va gdb bao "no debugging symbols found"</code></pre>
<p class="dap-an">✅ Mỗi cờ mua cho bạn cái gì: <code>-g</code> → đặt được breakpoint theo số dòng, và <code>i</code> với <code>sum</code> hiện ra trong cửa sổ Watch kèm giá trị thật. <code>-static-libgcc</code> → tệp .exe chạy được trên máy không có DLL gcc tương ứng. <code>-O2</code> (bản phát hành) → mã nhanh hơn, nhưng bộ tối ưu có thể gộp hoặc đảo thứ tự các dòng, nên khi bước từng dòng thì con trỏ nhảy loạn xạ. Chính ý cuối này mới là lý do thật khiến slide nhất định bắt dùng hồ sơ Debug.</p>
<p class="pitfall">⚠️ Tối ưu và gỡ lỗi đá nhau. Nếu có lúc bạn bước từng dòng mà vạch sáng nhảy ngược lên trên, hoặc một biến hiện <code>&lt;optimized out&gt;</code>, thì bạn đang gỡ lỗi trên bản đã tối ưu. Quay lại ô ① chọn bộ Debug; đừng kết luận rằng "trình gỡ lỗi hỏng rồi".</p>`],

      [57, 'How to debug (cont.) — Step 3: Set Breakpoints & Add watch',
        `<p class="y-chinh">🎯 Step 3 gives you the two instruments of every debugger: a <strong>breakpoint</strong> says <em>where</em> to stop, and a <strong>watch</strong> says <em>what</em> to look at when you are stopped.</p>
<ul>
<li><strong>Setting a breakpoint, exactly as the slide says</strong> — "click on the margin (left of the line numbers) next to the line of code where you want the program to pause ⇒ a red dot will appear". In the screenshot two whole lines have turned red: line 7 (the <code>for</code>) and line 10 (<code>sum += i;</code>). The keyboard shortcut visible in the context menu is <strong>F4 — Toggle Breakpoint</strong>.</li>
<li><strong>Where to put them, and why those two lines</strong> — line 7 stops you at the top of the loop so you can see <code>i</code> just before each pass; line 10 stops you only on the passes where the <code>if</code> was true, so you catch each change of <code>sum</code>. Two breakpoints, and the whole behaviour of the program is visible.</li>
<li><strong>Adding a watch, exactly as the slide says</strong> — "to watch the changes of each variable ⇒ right click on the variable ⇒ Add watch". The screenshot shows the context menu open on the word <code>sum</code> in line 5, with <strong>Add watch</strong> as the last-but-two item.</li>
<li><strong>Reading the Debug panel before you run</strong> — on the left it shows <code>i = Execute to evaluate</code> and <code>sum = Execute to evaluate</code>. That is not an error: the watches exist but the program has not started, so the variables have no storage yet. On slide 58 the same panel will read <code>i = 1</code> and <code>sum = 0</code>.</li>
<li><strong>The watch list IS the walkthrough table</strong> — this is the sentence to remember from the whole debugging section. Columns of the paper table on slide 51 = rows of the Watch panel. The debugger does not replace the skill, it automates it.</li>
</ul>
<pre><code># the same two instruments in VS Code + gdb (macOS / Linux)

gcc -Wall -g debug_demo.c -o debug_demo
gdb ./debug_demo
(gdb) break 7          # breakpoint on line 7   -- Dev-C++: click the margin / F4
(gdb) break 10         # breakpoint on line 10
(gdb) run              # start                  -- Dev-C++: Execute -> Debug / F5
(gdb) display i        # a permanent watch      -- Dev-C++: right click -> Add watch
(gdb) display sum
(gdb) info breakpoints # list them
(gdb) delete 1         # remove breakpoint #1   -- Dev-C++: click the red dot again</code></pre>
<p class="dap-an">✅ Mapping table for the exam and for real life: <em>margin click / F4</em> ↔ <code>break &lt;line&gt;</code> ↔ VS Code: click left of the line number (a red dot appears in the gutter). <em>Right click → Add watch</em> ↔ <code>display &lt;var&gt;</code> ↔ VS Code: the WATCH pane in the Run and Debug sidebar, "+". Same three concepts, three interfaces.</p>
<p class="meo">💡 A breakpoint you cannot hit teaches you something too. If execution never stops at line 10, the <code>if</code> on line 8 is never true — and you have just located a logical error without reading a single line of the condition.</p>`,
        `<p class="y-chinh">🎯 Bước 3 trao cho bạn hai nhạc cụ của mọi trình gỡ lỗi: <strong>breakpoint</strong> nói <em>dừng ở đâu</em>, còn <strong>watch</strong> nói <em>nhìn cái gì</em> khi đã dừng.</p>
<ul>
<li><strong>Đặt breakpoint, đúng như slide viết</strong> — "bấm vào lề (bên trái số dòng) cạnh dòng mã mà bạn muốn chương trình tạm dừng ⇒ một chấm đỏ sẽ hiện ra". Trong ảnh chụp có hai dòng đã đỏ rực: dòng 7 (lệnh <code>for</code>) và dòng 10 (<code>sum += i;</code>). Phím tắt nhìn thấy được trong menu chuột phải là <strong>F4 — Toggle Breakpoint</strong>.</li>
<li><strong>Đặt ở đâu, và vì sao là đúng hai dòng đó</strong> — dòng 7 giữ bạn lại ở đầu vòng lặp để thấy <code>i</code> ngay trước mỗi lượt; dòng 10 chỉ giữ bạn lại ở những lượt mà <code>if</code> đúng, nên bạn bắt được từng lần <code>sum</code> đổi. Hai breakpoint, và toàn bộ hành vi của chương trình hiện ra.</li>
<li><strong>Thêm watch, đúng như slide viết</strong> — "để theo dõi thay đổi của từng biến ⇒ bấm chuột phải vào biến ⇒ Add watch". Ảnh chụp cho thấy menu ngữ cảnh đang mở trên chữ <code>sum</code> ở dòng 5, với mục <strong>Add watch</strong> nằm gần cuối.</li>
<li><strong>Đọc bảng Debug trước khi chạy</strong> — bên trái hiện <code>i = Execute to evaluate</code> và <code>sum = Execute to evaluate</code>. Đó không phải lỗi: watch đã có nhưng chương trình chưa khởi động nên biến chưa có ô nhớ nào. Sang slide 58, đúng bảng ấy sẽ hiện <code>i = 1</code> và <code>sum = 0</code>.</li>
<li><strong>Danh sách watch CHÍNH LÀ bảng vết</strong> — đây là câu đáng nhớ nhất của cả phần gỡ lỗi. Các cột của bảng giấy ở slide 51 = các dòng của bảng Watch. Trình gỡ lỗi không thay thế kỹ năng, nó chỉ tự động hoá kỹ năng ấy.</li>
</ul>
<pre><code># dung hai nhac cu do trong VS Code + gdb (macOS / Linux)

gcc -Wall -g debug_demo.c -o debug_demo
gdb ./debug_demo
(gdb) break 7          # breakpoint dong 7    -- Dev-C++: bam le / F4
(gdb) break 10         # breakpoint dong 10
(gdb) run              # bat dau chay         -- Dev-C++: Execute -> Debug / F5
(gdb) display i        # mot watch thuong truc -- Dev-C++: chuot phai -> Add watch
(gdb) display sum
(gdb) info breakpoints # liet ke
(gdb) delete 1         # xoa breakpoint so 1  -- Dev-C++: bam lai vao cham do</code></pre>
<p class="dap-an">✅ Bảng đối chiếu để đi thi và để dùng thật: <em>bấm lề / F4</em> ↔ <code>break &lt;dòng&gt;</code> ↔ VS Code: bấm bên trái số dòng (một chấm đỏ hiện ở máng lề). <em>Chuột phải → Add watch</em> ↔ <code>display &lt;biến&gt;</code> ↔ VS Code: khung WATCH trong thanh bên Run and Debug, bấm dấu "+". Cùng ba khái niệm, ba giao diện.</p>
<p class="meo">💡 Một breakpoint không bao giờ dừng lại cũng dạy bạn điều gì đó. Nếu chương trình chẳng lần nào dừng ở dòng 10 thì lệnh <code>if</code> ở dòng 8 chưa từng đúng — và bạn vừa khoanh trúng một lỗi logic mà chưa cần đọc một chữ nào trong điều kiện.</p>`],

      [58, 'How to debug (cont.) — Step 4: Run the Debugger',
        `<p class="y-chinh">🎯 Step 4 finally runs it: <em>Execute → Debug (or the Debug icon on the toolbar) → Next Line (or F7)</em>. The screenshot catches the program mid-loop, and everything you need for a walkthrough is on screen at once.</p>
<ul>
<li><strong>What the screenshot shows</strong> — the red line 7 is the breakpoint at the <code>for</code>; the blue line 10 is the <strong>current</strong> statement, about to execute <code>sum += i;</code>. The Debug panel on the left reads <code>i = 1</code> and <code>sum = 0</code>, and the console window on the left has already printed <code>The odd number is: 1</code>.</li>
<li><strong>Read those three panes together and the whole machine state is visible</strong> — where execution is (blue line), what the variables hold (watch list), and what the user has seen so far (console). That is exactly the two-part definition of a walkthrough from slide 50: variable history plus output listing.</li>
<li><strong>The buttons across the bottom, and what each one means</strong> — <em>Next line (F7)</em> executes the current line and stops at the next one in the same function; <em>Next instruction</em> steps by machine instruction; <em>Into function</em> descends into a called function (Slot 08–09); <em>Skip function</em> runs a call to completion without entering it; <em>Continue</em> runs until the next breakpoint; <em>Stop Execution</em> ends the session.</li>
<li><strong>Why sum is still 0 while i is already 1</strong> — the blue line has <em>not yet run</em>. A debugger always highlights the statement it is <em>about to</em> execute, never the one it just finished. Misreading this is the number-one confusion in a first debugging session.</li>
<li><strong>"Send command to GDB"</strong> — the box on the right proves what is underneath. Dev-C++ is a friendly face on gdb; the field currently contains <code>next</code>, which is literally the gdb command that the F7 button sends.</li>
</ul>
<table>
<thead><tr><th>Stop #</th><th>Line (blue)</th><th>i</th><th>sum</th><th>Console so far</th></tr></thead>
<tbody>
<tr><td>1</td><td>7 — <code>for</code></td><td>1</td><td>0</td><td>(empty)</td></tr>
<tr><td>2</td><td>10 — <code>sum += i;</code></td><td>1</td><td>0</td><td><code>The odd number is: 1</code></td></tr>
<tr><td>3</td><td>10 — <code>sum += i;</code></td><td>3</td><td>1</td><td>… + <code>The odd number is: 3</code></td></tr>
<tr><td>4</td><td>10 — <code>sum += i;</code></td><td>5</td><td>4</td><td>… + <code>The odd number is: 5</code></td></tr>
<tr><td>5</td><td>14 — final <code>printf</code></td><td>6</td><td>9</td><td>… + <code>Sum the odd numbers is: 9</code></td></tr>
</tbody>
</table>
<p class="dap-an">✅ The table above is the debugger session written out as a walkthrough table, and its last row matches the real output of the compiled program: three "odd number" lines and <code>Sum the odd numbers is: 9</code>. Note stop #3: <code>sum</code> shows 1, not 4 — because line 10 is about to run, not finished. At stop #4 it shows 4 (= 1 + 3), and only after the loop ends does it reach 9.</p>
<p class="meo">💡 The VS Code / gdb equivalents of the four buttons: <code>next</code> (F10) = Next line · <code>step</code> (F11) = Into function · <code>finish</code> (Shift+F11) = run out of the current function · <code>continue</code> (F5) = Continue. Learn the four verbs once and every debugger you ever meet is already familiar.</p>`,
        `<p class="y-chinh">🎯 Bước 4 mới thật sự chạy: <em>Execute → Debug (hoặc biểu tượng Debug trên thanh công cụ) → Next Line (hoặc F7)</em>. Ảnh chụp bắt được chương trình đang giữa vòng lặp, và mọi thứ cần cho một walkthrough đều hiện ra cùng lúc trên màn hình.</p>
<ul>
<li><strong>Ảnh chụp cho thấy gì</strong> — dòng 7 màu đỏ là breakpoint ở lệnh <code>for</code>; dòng 10 màu xanh là câu lệnh <strong>hiện tại</strong>, sắp thực thi <code>sum += i;</code>. Bảng Debug bên trái ghi <code>i = 1</code> và <code>sum = 0</code>, còn cửa sổ console phía trái đã in <code>The odd number is: 1</code>.</li>
<li><strong>Đọc ba khung ấy cùng nhau là thấy trọn trạng thái máy</strong> — đang chạy tới đâu (vạch xanh), các biến đang mang gì (danh sách watch), và người dùng đã nhìn thấy gì (console). Đó đúng là định nghĩa hai phần của walkthrough ở slide 50: lịch sử biến cộng với danh sách phần xuất.</li>
<li><strong>Dãy nút phía dưới, và ý nghĩa từng nút</strong> — <em>Next line (F7)</em> chạy dòng hiện tại rồi dừng ở dòng kế trong cùng hàm; <em>Next instruction</em> bước theo từng lệnh máy; <em>Into function</em> đi vào bên trong hàm được gọi (Slot 08–09); <em>Skip function</em> chạy hết lời gọi mà không bước vào; <em>Continue</em> chạy tới breakpoint kế tiếp; <em>Stop Execution</em> kết thúc phiên.</li>
<li><strong>Vì sao sum vẫn là 0 trong khi i đã là 1</strong> — dòng xanh <em>chưa chạy</em>. Trình gỡ lỗi luôn tô sáng câu lệnh <em>sắp</em> thực thi, không bao giờ tô câu vừa xong. Đọc nhầm chỗ này là nỗi hoang mang số một trong phiên gỡ lỗi đầu đời.</li>
<li><strong>Ô "Send command to GDB"</strong> — cái ô bên phải để lộ thứ nằm bên dưới. Dev-C++ chỉ là bộ mặt thân thiện của gdb; ô ấy đang chứa chữ <code>next</code>, đúng là câu lệnh gdb mà nút F7 gửi đi.</li>
</ul>
<table>
<thead><tr><th>Lần dừng</th><th>Dòng (xanh)</th><th>i</th><th>sum</th><th>Console tới lúc đó</th></tr></thead>
<tbody>
<tr><td>1</td><td>7 — <code>for</code></td><td>1</td><td>0</td><td>(trống)</td></tr>
<tr><td>2</td><td>10 — <code>sum += i;</code></td><td>1</td><td>0</td><td><code>The odd number is: 1</code></td></tr>
<tr><td>3</td><td>10 — <code>sum += i;</code></td><td>3</td><td>1</td><td>… + <code>The odd number is: 3</code></td></tr>
<tr><td>4</td><td>10 — <code>sum += i;</code></td><td>5</td><td>4</td><td>… + <code>The odd number is: 5</code></td></tr>
<tr><td>5</td><td>14 — <code>printf</code> cuối</td><td>6</td><td>9</td><td>… + <code>Sum the odd numbers is: 9</code></td></tr>
</tbody>
</table>
<p class="dap-an">✅ Bảng trên chính là phiên gỡ lỗi được viết ra dưới dạng bảng vết, và dòng cuối của nó khớp với kết quả thật của chương trình đã biên dịch: ba dòng "odd number" rồi <code>Sum the odd numbers is: 9</code>. Để ý lần dừng số 3: <code>sum</code> hiện 1 chứ không phải 4 — vì dòng 10 mới sắp chạy chứ chưa chạy xong. Tới lần dừng số 4 nó hiện 4 (= 1 + 3), và chỉ sau khi vòng lặp kết thúc nó mới tới 9.</p>
<p class="meo">💡 Bốn nút ấy trong VS Code / gdb: <code>next</code> (F10) = Next line · <code>step</code> (F11) = Into function · <code>finish</code> (Shift+F11) = chạy ra khỏi hàm hiện tại · <code>continue</code> (F5) = Continue. Học thuộc bốn động từ này một lần, rồi mọi trình gỡ lỗi bạn gặp về sau đều thành quen mặt.</p>`],

      [59, 'Exercise — the four types of errors',
        `<p class="y-chinh">🎯 Two tasks on this slide. <strong>(a)</strong> Explain the four types of errors: syntax, logical, runtime, semantic. <strong>(b)</strong> Write a small program containing them, then use the Dev-C++ debugger to find and fix them.</p>
<ul>
<li><strong>Syntax errors — the compiler refuses to build</strong> — a missing <code>;</code>, an unclosed <code>{</code>, <code>Int</code> instead of <code>int</code>. These are free: the compiler names the file and the line. Fix the <em>first</em> message and rebuild; the rest are often echoes of it.</li>
<li><strong>Runtime errors — it builds, then dies while running</strong> — division by zero, an infinite loop, reading a file that is not there. The program stops or freezes, and nothing on the screen tells you which line. A breakpoint just before the suspect line is the right tool.</li>
<li><strong>Logical errors — it builds, it runs, the answer is wrong</strong> — <code>i &lt; n</code> where you meant <code>i &lt;= n</code>, <code>+</code> where you meant <code>*</code>, an accumulator reset inside the loop instead of before it. No tool will report these; only a walkthrough table or a debugger will.</li>
<li><strong>Semantic errors — it builds, it runs, the answer is "right" but answers the wrong question</strong> — computing an average with integer division, or summing marks when the requirement said average of marks. The code is faultless; your reading of the problem was not.</li>
<li><strong>How to do part (b)</strong> — write the program with all four planted deliberately. Fix the syntax error first (nothing runs until you do), then run under the debugger with a watch on every variable, and compare what you see against a walkthrough table you wrote <em>before</em> running. Wherever the two diverge is the logical error.</li>
</ul>
<pre><code>/* Planted bugs - can you name each type before reading the fix? */
#include &lt;stdio.h&gt;
int main(void) {
    int i, sum = 0, n = 5, zero = 0;
    for (i = 1; i &lt; n; i++)          /* BUG 1: logical  - drops i = 5   */
        sum += i
                                     /* BUG 2: syntax   - missing ';'   */
    printf("average = %d\\n", sum / n);   /* BUG 3: semantic - int division */
    printf("%d\\n", sum / zero);      /* BUG 4: runtime  - divide by zero */
    return 0;
}

/* Fixed */
#include &lt;stdio.h&gt;
int main(void) {
    int i, sum = 0, n = 5, divisor = 0;
    for (i = 1; i &lt;= n; i++)         /* 1 fixed: &lt;= keeps i = 5          */
        sum += i;                    /* 2 fixed: ';' added               */
    printf("sum     = %d\\n", sum);
    printf("average = %.2f\\n", (double)sum / n);  /* 3 fixed: cast first */
    if (divisor != 0)                /* 4 fixed: guard before dividing   */
        printf("%d\\n", sum / divisor);
    else
        printf("cannot divide by zero\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Answers, verified by compiling and running the fixed version: <code>sum = 15</code> (1+2+3+4+5) and <code>average = 3.00</code>. The buggy version would have given <code>sum = 10</code> (logical error: it stopped at 4) and printed <code>average = 2</code> — integer division of 10 by 5 (semantic error), so <em>two</em> wrong answers reinforcing each other into something that looks plausible. That is why both must be hunted separately. Running the same test with <code>int</code> average of 15/5 prints 3 while the true mean of 1..5 is 3.00 exactly — try it with n = 4 (sum 10, true mean 2.5, <code>int</code> prints 2) to see the semantic bug bite.</p>
<p class="pitfall">⚠️ Ranked by how much they cost you: syntax errors cost minutes, runtime errors cost hours, logical errors cost marks, semantic errors cost the whole assignment — because the program runs perfectly and nobody notices until the requirement is re-read. Read the problem statement twice before you write, and once more before you submit.</p>`,
        `<p class="y-chinh">🎯 Slide này có hai nhiệm vụ. <strong>(a)</strong> Giải thích bốn loại lỗi: cú pháp, logic, lúc chạy, ngữ nghĩa. <strong>(b)</strong> Viết một chương trình nhỏ chứa đủ các loại đó, rồi dùng trình gỡ lỗi Dev-C++ để tìm và sửa.</p>
<ul>
<li><strong>Lỗi cú pháp — trình biên dịch từ chối dựng</strong> — thiếu dấu <code>;</code>, thiếu dấu <code>}</code>, viết <code>Int</code> thay vì <code>int</code>. Loại này được cho không: trình biên dịch nêu rõ tên file và số dòng. Hãy sửa thông báo <em>đầu tiên</em> rồi dựng lại; những thông báo sau thường chỉ là tiếng vọng của nó.</li>
<li><strong>Lỗi lúc chạy — dựng được, rồi chết giữa chừng</strong> — chia cho 0, vòng lặp vô tận, đọc một file không tồn tại. Chương trình dừng hoặc treo, và trên màn hình không có gì chỉ ra dòng nào. Đặt breakpoint ngay trước dòng khả nghi là công cụ đúng.</li>
<li><strong>Lỗi logic — dựng được, chạy được, đáp số sai</strong> — viết <code>i &lt; n</code> trong khi ý là <code>i &lt;= n</code>, viết <code>+</code> trong khi ý là <code>*</code>, đặt lệnh khởi tạo biến tích luỹ bên trong vòng lặp thay vì trước nó. Không công cụ nào báo cho bạn; chỉ bảng vết hoặc trình gỡ lỗi mới tìm ra.</li>
<li><strong>Lỗi ngữ nghĩa — dựng được, chạy được, đáp số "đúng" nhưng trả lời sai câu hỏi</strong> — tính trung bình bằng phép chia số nguyên, hoặc cộng tổng điểm trong khi đề bài đòi điểm trung bình. Mã thì không sai một chữ; chỗ sai là cách bạn đọc đề.</li>
<li><strong>Làm phần (b) thế nào</strong> — viết chương trình có cố ý cài đủ bốn loại. Sửa lỗi cú pháp trước (chưa sửa thì chưa chạy được gì), rồi chạy dưới trình gỡ lỗi với watch đặt lên mọi biến, và đối chiếu với một bảng vết bạn đã viết ra <em>trước khi</em> chạy. Chỗ nào hai bên lệch nhau chính là lỗi logic.</li>
</ul>
<pre><code>/* Loi cai san - ban goi ten duoc tung loai truoc khi doc phan sua khong? */
#include &lt;stdio.h&gt;
int main(void) {
    int i, sum = 0, n = 5, zero = 0;
    for (i = 1; i &lt; n; i++)          /* LOI 1: logic  - bo mat i = 5    */
        sum += i
                                     /* LOI 2: cu phap - thieu ';'      */
    printf("average = %d\\n", sum / n);   /* LOI 3: ngu nghia - chia nguyen */
    printf("%d\\n", sum / zero);      /* LOI 4: luc chay - chia cho 0    */
    return 0;
}

/* Da sua */
#include &lt;stdio.h&gt;
int main(void) {
    int i, sum = 0, n = 5, divisor = 0;
    for (i = 1; i &lt;= n; i++)         /* sua 1: &lt;= giu lai i = 5          */
        sum += i;                    /* sua 2: them ';'                  */
    printf("sum     = %d\\n", sum);
    printf("average = %.2f\\n", (double)sum / n);  /* sua 3: ep kieu truoc */
    if (divisor != 0)                /* sua 4: chan truoc khi chia       */
        printf("%d\\n", sum / divisor);
    else
        printf("khong the chia cho 0\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án, đã kiểm bằng cách biên dịch và chạy bản đã sửa: <code>sum = 15</code> (1+2+3+4+5) và <code>average = 3.00</code>. Bản còn lỗi sẽ cho <code>sum = 10</code> (lỗi logic: dừng ở 4) rồi in <code>average = 2</code> — phép chia nguyên 10 cho 5 (lỗi ngữ nghĩa), tức là <em>hai</em> cái sai bù cho nhau thành một kết quả trông rất hợp lý. Đó chính là lý do phải săn hai loại này riêng rẽ. Thử lại với n = 4 (tổng 10, trung bình thật là 2,5, kiểu <code>int</code> in ra 2) là thấy ngay lỗi ngữ nghĩa cắn.</p>
<p class="pitfall">⚠️ Xếp hạng theo cái giá phải trả: lỗi cú pháp tốn vài phút, lỗi lúc chạy tốn vài giờ, lỗi logic tốn điểm, còn lỗi ngữ nghĩa tốn cả bài assignment — vì chương trình chạy hoàn hảo và không ai nhận ra cho tới lúc đọc lại đề. Hãy đọc đề hai lần trước khi viết, và thêm một lần nữa trước khi nộp.</p>`],

      [60, 'Summary (cont.)',
        `<p class="y-chinh">🎯 The closing slide compresses Slot 05-07 into two sentences: <em>logic constructs = the statements you can use in a program</em>, and <em>a walkthrough = executing the code yourself, recording variable changes and listing the output</em>.</p>
<ul>
<li><strong>Three basic constructs, and there are no others</strong> — <strong>sequence</strong> (a simple statement or a code block, slide 12), <strong>selection</strong> (<code>if</code>, <code>if…else</code>, <code>if…else if…else</code>, the <code>? :</code> operator, <code>switch</code>, slides 13–27), and <strong>iteration</strong> (<code>for</code>, <code>while</code>, <code>do…while</code>, slides 28–40). Structured programming (slide 7) is the claim that every program that can be written can be written with just these three, each with one entry and one exit.</li>
<li><strong>Selection: how to choose between them</strong> — <code>if</code> for one branch, <code>if…else</code> for two, <code>else if</code> chains for ranges, <code>? :</code> only when the whole thing fits on one readable line, <code>switch</code> when you are comparing one <em>integral</em> expression against a list of constants.</li>
<li><strong>Iteration: how to choose between them</strong> — <code>for</code> when you know the number of passes, <code>while</code> when you do not and the body may run zero times, <code>do…while</code> when the body must run at least once (menus, input validation).</li>
<li><strong>Walkthrough — the two deliverables again</strong> — the slide insists on both halves: <em>a record of the changes in the values of program variables</em> AND <em>a listing of the output, if any</em>. Then: <em>debug &amp; fix code in the program</em> — the skill from slides 54–59.</li>
<li><strong>What this slot enables next</strong> — Slot 08–09 wraps these constructs into functions, and everything you learned about style (slides 42–48) becomes more valuable there, because a function is the unit other people reuse.</li>
</ul>
<table>
<thead><tr><th>Question in the exam</th><th>Tool from this slot</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>"Which construct should I use?"</td><td>The three logic constructs</td><td>6–40</td></tr>
<tr><td>"Why did I lose style marks?"</td><td>Naming · indentation · comments · guidelines</td><td>42–48</td></tr>
<tr><td>"What does this program print?"</td><td><strong>Walkthrough table</strong></td><td>50–53</td></tr>
<tr><td>"It compiles but the answer is wrong"</td><td>Breakpoint + watch, or a walkthrough</td><td>54–59</td></tr>
</tbody>
</table>
<p class="meo">💡 Revision plan that fits one evening: redraw the walkthrough table for slide 51 from memory (answer 41), then slide 52 (answer 21), then slide 53 (answer 0, and 50 after the fix). If all three come out right without looking, you are ready for the logic-construct half of the exam.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại nén cả Slot 05-07 vào hai câu: <em>logic constructs = những câu lệnh có thể dùng trong một chương trình</em>, và <em>walkthrough = tự mình thực hiện mã, ghi lại thay đổi của các biến và liệt kê phần xuất ra</em>.</p>
<ul>
<li><strong>Ba cấu trúc cơ bản, và không có cái thứ tư</strong> — <strong>tuần tự</strong> (một câu lệnh đơn hoặc một khối mã, slide 12), <strong>rẽ nhánh</strong> (<code>if</code>, <code>if…else</code>, <code>if…else if…else</code>, toán tử <code>? :</code>, <code>switch</code>, slide 13–27), và <strong>lặp</strong> (<code>for</code>, <code>while</code>, <code>do…while</code>, slide 28–40). Lập trình có cấu trúc (slide 7) chính là khẳng định rằng mọi chương trình viết được đều viết được bằng đúng ba thứ này, mỗi thứ một lối vào và một lối ra.</li>
<li><strong>Rẽ nhánh: chọn cái nào</strong> — <code>if</code> khi có một nhánh, <code>if…else</code> khi có hai, chuỗi <code>else if</code> khi phân khoảng, <code>? :</code> chỉ khi cả biểu thức gọn trong một dòng đọc được, còn <code>switch</code> khi so một biểu thức <em>nguyên</em> với một danh sách hằng.</li>
<li><strong>Lặp: chọn cái nào</strong> — <code>for</code> khi biết trước số lượt, <code>while</code> khi không biết và thân có thể chạy không lần nào, <code>do…while</code> khi thân buộc phải chạy ít nhất một lần (menu, kiểm tra dữ liệu nhập).</li>
<li><strong>Walkthrough — nhắc lại hai sản phẩm phải nộp</strong> — slide nhấn mạnh cả hai nửa: <em>bản ghi thay đổi giá trị các biến</em> VÀ <em>danh sách phần xuất ra, nếu có</em>. Rồi tới: <em>gỡ lỗi và sửa mã trong chương trình</em> — kỹ năng của slide 54–59.</li>
<li><strong>Slot này mở đường cho cái gì</strong> — Slot 08–09 gói những cấu trúc này vào trong hàm, và mọi thứ bạn học về phong cách (slide 42–48) trở nên đáng giá hơn ở đó, vì hàm mới là đơn vị mà người khác đem đi dùng lại.</li>
</ul>
<table>
<thead><tr><th>Câu hỏi trong đề thi</th><th>Công cụ từ slot này</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>"Nên dùng cấu trúc nào?"</td><td>Ba logic construct</td><td>6–40</td></tr>
<tr><td>"Sao mình bị trừ điểm trình bày?"</td><td>Đặt tên · thụt lề · chú thích · guidelines</td><td>42–48</td></tr>
<tr><td>"Chương trình này in ra gì?"</td><td><strong>Bảng vết</strong></td><td>50–53</td></tr>
<tr><td>"Dịch được mà đáp số sai"</td><td>Breakpoint + watch, hoặc bảng vết</td><td>54–59</td></tr>
</tbody>
</table>
<p class="meo">💡 Kế hoạch ôn gói gọn trong một buổi tối: vẽ lại bảng vết của slide 51 từ trí nhớ (đáp số 41), rồi slide 52 (đáp số 21), rồi slide 53 (đáp số 0, và 50 sau khi sửa). Nếu cả ba ra đúng mà không phải nhìn lại thì bạn đã sẵn sàng cho nửa đề về logic construct.</p>`],
    ]),
  ].join('\n'),
};
