/**
 * PRO192 · Mục 0 — bốn bài ⭐ nền (bắt đầu, cách học, cài môi trường, buổi đầu tiên) + slide pro2 (cài JDK & NetBeans).
 * Bài 📑 học theo từng slide: pro2 (tmp_02.pptx, slide 1–1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 0.A — 📑 Slide by slide · Download and install JDK and NetBeans: the four links seen from 2026 (slide 1) ───────── */
const L_pro2_1 = {
  title: '0.A — 📑 Slide by slide · Download and install JDK and NetBeans: the four links seen from 2026 (slide 1)|||0.A — 📑 Học theo từng slide · Tải và cài JDK, NetBeans: bốn đường link nhìn từ năm 2026 (slide 1)',
  slug: 'pro192-slide-pro2-1',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Giảng slide duy nhất của bộ "Download & Install JDK & NetBeans": bốn đường link (NetBeans 12.0, JDK 8 của Oracle, video cài NetBeans 8.2, video cập nhật Java), cái nào còn dùng được, cái nào đã cũ, vì sao phòng thi vẫn là JDK 8, và nên cài gì ở nhà (JDK 8 + JDK 21, NetBeans mới) — dẫn sang bài ⭐ Cài môi trường có từng bước cho Windows và macOS.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.A · school deck "Download &amp; Install JDK &amp; NetBeans", slide 1 (the whole deck)</span>
<h2>The shortest deck of the course — four links, and what is left of them in 2026</h2>
<p class="lead">This deck is one slide with four links. It tells you <em>what</em> to install (a JDK and the NetBeans IDE) but not <em>which version</em> works with what, and two of its links point at software from 2016–2020. This lesson walks through every link, says plainly which parts are out of date, and gives you the one rule that matters for PRO192: <strong>the exam room runs JDK 8</strong>, so whatever you install at home, your exam code must compile on Java 8.</p>
<div class="callout">The step-by-step installation (Windows and macOS, two JDKs side by side, NetBeans, checking everything with real commands) is the ⭐ lesson <strong>"Installing the environment"</strong> just above this one. This lesson only explains the slide.</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.A · bộ slide "Download &amp; Install JDK &amp; NetBeans" của trường, slide 1 (cả bộ)</span>
<h2>Bộ slide ngắn nhất môn — bốn đường link, và năm 2026 còn lại gì</h2>
<p class="lead">Bộ slide này chỉ có một slide với bốn đường link. Nó cho bạn biết <em>cài gì</em> (một bộ JDK và trình soạn code NetBeans) nhưng không nói <em>bản nào</em> chạy được với bản nào, và hai trong bốn link trỏ tới phần mềm của giai đoạn 2016–2020. Bài này đi qua từng link, nói thẳng phần nào đã cũ, và cho bạn đúng một luật quan trọng nhất của PRO192: <strong>phòng thi chạy JDK 8</strong>, nên ở nhà cài gì thì cài, code đi thi vẫn phải biên dịch được trên Java 8.</p>
<div class="callout">Cách cài từng bước (Windows và macOS, hai JDK song song, NetBeans, kiểm tra bằng lệnh thật) nằm ở bài ⭐ <strong>"Cài môi trường"</strong> ngay phía trên bài này. Bài này chỉ giảng slide.</div>`),
    walkHead('pro2', 1, 1),
    walk('pro2', [
      [1, 'Download and Install JDK and NetBeans',
        `<p class="y-chinh">🎯 To write Java you need two things: a <strong>JDK</strong> (Java Development Kit — the compiler <code>javac</code>, the launcher <code>java</code> and the class library) and an <strong>IDE</strong> (Integrated Development Environment — here NetBeans). The slide gives one link for each, plus two how-to videos.</p>
<table>
<thead><tr><th>Link on the slide</th><th>What it is</th><th>Status in October 2026</th></tr></thead>
<tbody>
<tr><td>Downloading Apache NetBeans 12.0</td><td>NetBeans 12.0, released 4 June 2020; it runs on JDK 8, 11 and 14</td><td>⚠️ outdated and unsupported. The current release is NetBeans 31 (10 Aug 2026), which itself needs JDK 21 or newer to run — but it can still build projects for Java 8</td></tr>
<tr><td>Java SE Development Kit 8 – Downloads (oracle.com)</td><td>Oracle's JDK 8 download page</td><td>✅ JDK 8 is still the exam JDK. Oracle asks you to sign in with an Oracle account before downloading; the free <strong>Eclipse Temurin 8</strong> (adoptium.net, build 8u504 has a Windows .msi installer) is the same OpenJDK code without the sign-in</td></tr>
<tr><td>How to Download and Install NetBeans 8.2 with Java JDK on Windows (Bing video)</td><td>a video for NetBeans 8.2 (2016)</td><td>⚠️ old, but NetBeans 8.2 is exactly what many lab PCs still have — and the PE paper says "NetBean 8.2 or later, JDK 8"</td></tr>
<tr><td>How to update Java version on Windows 10 (Bing video)</td><td>updating the Java <em>runtime</em> that runs programs</td><td>⚠️ a runtime update does not give you <code>javac</code>; a developer installs a JDK</td></tr>
</tbody>
</table>
<p><strong>Why two JDK versions in your life?</strong> The lab and the PE use Java 8 (released March 2014). Everything after PRO192 — PRJ301 on Tomcat 10.1, Spring Boot 3 for your capstone — needs Java 17 or newer. So the setup this course recommends is: <strong>JDK 8 for exam practice + JDK 21 LTS for NetBeans and everything else</strong>, both on the same laptop.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/aeb8c64765245a12664c20099f7f601b785b24d6.svg" alt="Two JDKs on one laptop: NetBeans runs on JDK 21, your PRO192 projects compile with JDK 8 like the lab" loading="lazy" /><p class="chu-thich">🧩 Two JDKs on one laptop: NetBeans runs on JDK 21, your PRO192 projects compile with JDK 8 like the lab</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Two JDKs on one laptop — JDK 8 for the exam room, JDK 21 for everything else
' NetBeans runs on one JDK but can compile projects with another
node "Your laptop" {
  component "NetBeans 31\\n(runs on JDK 21)" as NB
  rectangle "JDK 21 LTS\\n(Temurin)\\njava, javac 21" as J21 #ECFDF5
  rectangle "JDK 8\\n(Temurin 8u / Zulu 8)\\njava, javac 1.8" as J8 #FEF9C3
  folder "PRO192 projects\\n(Source/Binary format 1.8)" as P
}
node "Lab PC (exam)" {
  rectangle "JDK 8 + NetBeans 8.2 or later" as LAB #FEF9C3
}
NB ..&gt; J21 : runs on
NB --&gt; J8 : Java Platform\\nof the project
P --&gt; J8 : compiled and run with
P ..&gt; LAB : copy src → works the same
@enduml</code></pre></details>
<div class="pitfall">Exam trap: code that uses Java 10+ features (<code>var</code>, <code>List.of</code>, <code>String.repeat</code>, switch arrows) compiles at home on JDK 21 and fails in the exam room. The ⭐ lesson "Installing the environment" shows the real JDK 8 error messages and how to make NetBeans compile your projects as Java 8 so you catch this at home.</div>
<p class="meo">🧠 JDK = to <em>make</em> programs (developer). JRE = only to <em>run</em> them (user). Installing "Java" from java.com gives you a runtime, not a compiler.</p>`,
        `<p class="y-chinh">🎯 Muốn viết Java bạn cần hai thứ: một bộ <strong>JDK</strong> (Java Development Kit — bộ công cụ phát triển: trình biên dịch <code>javac</code>, trình chạy <code>java</code> và thư viện lớp) và một <strong>IDE</strong> (Integrated Development Environment — môi trường soạn code tích hợp, ở đây là NetBeans). Slide cho mỗi thứ một link, cộng hai video hướng dẫn.</p>
<table>
<thead><tr><th>Link trên slide</th><th>Là gì</th><th>Tình trạng tháng 10/2026</th></tr></thead>
<tbody>
<tr><td>Downloading Apache NetBeans 12.0</td><td>NetBeans 12.0, ra ngày 04/06/2020; chạy trên JDK 8, 11 và 14</td><td>⚠️ đã cũ, hết hỗ trợ. Bản hiện hành là NetBeans 31 (10/08/2026), bản này tự nó cần JDK 21 trở lên để chạy — nhưng vẫn biên dịch được project cho Java 8</td></tr>
<tr><td>Java SE Development Kit 8 – Downloads (oracle.com)</td><td>trang tải JDK 8 của Oracle</td><td>✅ JDK 8 vẫn là JDK của phòng thi. Oracle bắt đăng nhập tài khoản Oracle trước khi tải; bản miễn phí <strong>Eclipse Temurin 8</strong> (adoptium.net, bản 8u504 có bộ cài .msi cho Windows) là cùng mã nguồn OpenJDK mà không cần đăng nhập</td></tr>
<tr><td>How to Download and Install NetBeans 8.2 with Java JDK on Windows (video Bing)</td><td>video cài NetBeans 8.2 (2016)</td><td>⚠️ cũ, nhưng NetBeans 8.2 đúng là thứ nhiều máy phòng lab vẫn cài — và đề PE ghi "NetBean 8.2 or later, JDK 8"</td></tr>
<tr><td>How to update Java version on Windows 10 (video Bing)</td><td>cập nhật Java <em>runtime</em> (bộ chạy chương trình)</td><td>⚠️ cập nhật runtime không cho bạn <code>javac</code>; người lập trình phải cài JDK</td></tr>
</tbody>
</table>
<p><strong>Vì sao đời bạn có hai bản JDK?</strong> Phòng lab và bài PE dùng Java 8 (ra tháng 3/2014). Mọi thứ sau PRO192 — PRJ301 trên Tomcat 10.1, Spring Boot 3 cho đồ án — cần Java 17 trở lên. Nên cách cài môn này khuyên là: <strong>JDK 8 để luyện thi + JDK 21 LTS (bản hỗ trợ dài hạn) cho NetBeans và mọi thứ khác</strong>, cả hai trên cùng một laptop.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/aeb8c64765245a12664c20099f7f601b785b24d6.svg" alt="Hai JDK trên một laptop: NetBeans chạy trên JDK 21, project PRO192 biên dịch bằng JDK 8 giống phòng lab" loading="lazy" /><p class="chu-thich">🧩 Hai JDK trên một laptop: NetBeans chạy trên JDK 21, project PRO192 biên dịch bằng JDK 8 giống phòng lab</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Two JDKs on one laptop — JDK 8 for the exam room, JDK 21 for everything else
' NetBeans chạy trên một JDK nhưng biên dịch project bằng JDK khác được
node "Your laptop" {
  component "NetBeans 31\\n(runs on JDK 21)" as NB
  rectangle "JDK 21 LTS\\n(Temurin)\\njava, javac 21" as J21 #ECFDF5
  rectangle "JDK 8\\n(Temurin 8u / Zulu 8)\\njava, javac 1.8" as J8 #FEF9C3
  folder "PRO192 projects\\n(Source/Binary format 1.8)" as P
}
node "Lab PC (exam)" {
  rectangle "JDK 8 + NetBeans 8.2 or later" as LAB #FEF9C3
}
NB ..&gt; J21 : runs on
NB --&gt; J8 : Java Platform\\nof the project
P --&gt; J8 : compiled and run with
P ..&gt; LAB : copy src → works the same
@enduml</code></pre></details>
<div class="pitfall">Bẫy phòng thi: code dùng tính năng Java 10+ (<code>var</code>, <code>List.of</code>, <code>String.repeat</code>, switch mũi tên) biên dịch ngon ở nhà trên JDK 21 rồi hỏng trong phòng thi. Bài ⭐ "Cài môi trường" cho xem thông báo lỗi thật của JDK 8 và cách bắt NetBeans biên dịch project của bạn theo Java 8 để phát hiện ngay ở nhà.</div>
<p class="meo">🧠 JDK = để <em>làm ra</em> chương trình (người lập trình). JRE = chỉ để <em>chạy</em> chúng (người dùng). Cài "Java" từ java.com là cài bộ chạy, không có trình biên dịch.</p>`],
    ]),
    bi(`<p>Next in Section 0: the older lessons 0.1–0.4 (course map, passing rules, learning outcomes, materials). Then Chapter 1 starts with the school deck <em>Introduction</em>.</p>`,
    `<p>Tiếp theo trong Mục 0: các bài cũ 0.1–0.4 (bản đồ môn, điều kiện qua môn, chuẩn đầu ra, tài liệu). Sau đó Chương 1 bắt đầu với bộ slide <em>Introduction</em> của trường.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ Start here (1/2) — What PRO192 is, Java's dated history, why it is the base of every later course ───────── */
const L_x_bat_dau_tai_day = {
  title: "⭐ Start here (1/2) — What PRO192 is, Java's dated history, why it is the base of every later course|||⭐ Bắt đầu tại đây (1/2) — PRO192 là gì, lịch sử Java có mốc năm, vì sao nó là nền của mọi môn sau",
  slug: 'pro192-bat-dau-tai-day',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài định hướng tự thêm ngoài giáo trình: Java và lập trình hướng đối tượng là gì (cùng một ngân hàng tí hon viết kiểu PRF192 và kiểu PRO192, chạy thật), lịch sử Java có mốc năm đã tra (Oak 1991, công bố 1995, JDK 1.0 năm 1996, Java 8 năm 2014 là JDK phòng thi, các bản LTS 11/17/21/25), vì sao PRO192 là nền của LAB211, CSD201, PRJ301, SWD392 và đồ án LabFlow trên Spring Boot, câu phỏng vấn hay gặp, Java 8 khác Java hiện đại ở đâu, nói thật phần nào nặng và nên dồn sức vào đâu.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Start here 1/2 · added by this site, not part of the school slides</span>
<h2>Before the slides: what "object-oriented programming in Java" means, and why it is worth your effort</h2>
<p class="lead">PRF192 taught you to give a computer <em>steps</em> in C. PRO192 teaches you to build programs out of <em>objects</em> — small units that keep their own data and their own rules — using <strong>Java</strong>, the language of LAB211, PRJ301, CSD201, SWD392 and your capstone. It is the most "load-bearing" course of the first two years: if objects click here, every later Java course feels like more of the same; if they do not, every later course hurts.</p>
<div class="callout"><p><strong>How Section 0 is arranged.</strong> The four ⭐ lessons at the top (this one, "How to study", "Installing the environment", "First hands-on session") are written for this site. Then comes lesson 0.A, which walks through the school's one-slide deck "Download &amp; Install JDK &amp; NetBeans". Below are the older lessons 0.1–0.4 (course map, passing rules, learning outcomes, materials) — kept unchanged as short summaries.</p></div>`,
    `<span class="eyebrow">Mục 0 · ⭐ Bắt đầu tại đây 1/2 · phần web tự thêm, không có trong slide trường</span>
<h2>Trước khi vào slide: "lập trình hướng đối tượng bằng Java" nghĩa là gì, và vì sao đáng bỏ công</h2>
<p class="lead">PRF192 dạy bạn ra lệnh cho máy tính theo <em>các bước</em> bằng C. PRO192 dạy bạn dựng chương trình từ các <em>đối tượng</em> — những khối nhỏ tự giữ dữ liệu và luật lệ của mình — bằng <strong>Java</strong>, ngôn ngữ của LAB211, PRJ301, CSD201, SWD392 và đồ án tốt nghiệp. Đây là môn "chịu lực" nhất của hai năm đầu: OOP thấm ở đây thì mọi môn Java sau chỉ là làm thêm; không thấm thì môn nào sau cũng khổ.</p>
<div class="callout"><p><strong>Mục 0 được sắp thế nào.</strong> Bốn bài ⭐ ở đầu (bài này, "Học thế nào", "Cài môi trường", "Buổi thực hành đầu tiên") là phần web tự viết. Tiếp theo là bài 0.A giảng bộ slide một trang "Download &amp; Install JDK &amp; NetBeans" của trường. Bên dưới là các bài cũ 0.1–0.4 (bản đồ môn, điều kiện qua môn, chuẩn đầu ra, tài liệu) — giữ nguyên làm bản tóm tắt ngắn.</p></div>`),
    bi(`<h2>1. The difference in one program</h2>
<p>The same tiny bank written twice. First in PRF192 style — data in arrays, functions that change it. Then in PRO192 style — an <code>Account</code> class that keeps its balance <code>private</code> and decides for itself whether a withdrawal is allowed. Both run for real (and on JDK 8, the exam JDK):</p>
<pre><code class="language-java">// release: 8
// The same tiny bank in two styles: PRF192 (C-style procedures over loose data) and PRO192 (objects that guard their own data)

class Account {
    private final String owner;
    private long balance;                                  // nobody outside can write this field

    Account(String owner, long opening) { this.owner = owner; this.balance = opening; }

    boolean withdraw(long amount) {                         // the rule lives WITH the data
        if (amount &lt;= 0 || amount &gt; balance) return false;
        balance -= amount;
        return true;
    }
    void deposit(long amount) { if (amount &gt; 0) balance += amount; }
    @Override
    public String toString() { return owner + ": " + balance; }
}

public class HaiCachViet {
    // PRF192 style: data in arrays, any function may change any balance — including by mistake
    static String[] owners = { "An", "Binh" };
    static long[] balances = { 500000, 200000 };

    static void withdraw(int i, long amount) { balances[i] -= amount; }   // forgot the check

    public static void main(String[] args) {
        System.out.println("procedural:");
        withdraw(1, 300000);                                  // Binh had only 200 000
        balances[0] = -999;                                   // any line anywhere can do this
        for (int i = 0; i &lt; owners.length; i++) System.out.println("  " + owners[i] + ": " + balances[i]);

        System.out.println("object-oriented:");
        Account an = new Account("An", 500000);
        Account binh = new Account("Binh", 200000);
        System.out.println("  Binh withdraws 300000 -&gt; " + binh.withdraw(300000));
        System.out.println("  An withdraws 100000   -&gt; " + an.withdraw(100000));
        // an.balance = -999;   // does not compile: balance has private access in Account
        System.out.println("  " + an);
        System.out.println("  " + binh);
    }
}</code></pre>
<div class="out">procedural:<br>
&nbsp;&nbsp;An: -999<br>
&nbsp;&nbsp;Binh: -100000<br>
object-oriented:<br>
&nbsp;&nbsp;Binh withdraws 300000 -&gt; false<br>
&nbsp;&nbsp;An withdraws 100000 &nbsp;&nbsp;-&gt; true<br>
&nbsp;&nbsp;An: 400000<br>
&nbsp;&nbsp;Binh: 200000</div>
<p>Look at the first half of the output: Binh withdrew more than he had, and some other line set An's balance to -999. Nothing stopped either, because <em>any</em> code can write into the arrays. In the second half the rule lives <strong>inside</strong> the object: <code>withdraw(300000)</code> returns <code>false</code>, and the line <code>an.balance = -999</code> does not even compile. That is the whole course in miniature:</p>
<table>
<thead><tr><th>Idea</th><th>In this program</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>class and object</td><td><code>Account</code> is the class; <code>an</code>, <code>binh</code> are objects</td><td>1–2</td></tr>
<tr><td>encapsulation</td><td><code>private long balance</code> + methods that guard it</td><td>2–3</td></tr>
<tr><td>inheritance and polymorphism</td><td>(next step: <code>SavingAccount extends Account</code>)</td><td>4–5</td></tr>
<tr><td>exceptions</td><td>(next step: throw an exception instead of returning false)</td><td>6</td></tr>
<tr><td>arrays of objects, collections</td><td>(next step: a bank holding many accounts)</td><td>7–8</td></tr>
<tr><td>files</td><td>(next step: save the accounts to a file)</td><td>9</td></tr>
</tbody>
</table>
<p>This is also the shape of the school's sample project <em>Banking</em> (model <code>Account</code>/<code>Bank</code>, a text menu, a Swing window) that you will analyse in a later lesson.</p>`,
    `<h2>1. Khác biệt gói trong một chương trình</h2>
<p>Cùng một ngân hàng tí hon viết hai lần. Lần đầu kiểu PRF192 — dữ liệu trong mảng, hàm sửa nó. Lần sau kiểu PRO192 — lớp <code>Account</code> giữ số dư <code>private</code> và tự quyết định có cho rút tiền hay không. Cả hai chạy thật (và chạy cả trên JDK 8, JDK của phòng thi):</p>
<pre><code class="language-java">// release: 8
// Cùng một ngân hàng tí hon, hai kiểu viết: PRF192 (thủ tục kiểu C trên dữ liệu rời) và PRO192 (đối tượng tự canh dữ liệu của mình)

class Account {
    private final String owner;
    private long balance;                                  // không ai bên ngoài ghi được trường này

    Account(String owner, long opening) { this.owner = owner; this.balance = opening; }

    boolean withdraw(long amount) {                         // luật nằm CÙNG dữ liệu
        if (amount &lt;= 0 || amount &gt; balance) return false;
        balance -= amount;
        return true;
    }
    void deposit(long amount) { if (amount &gt; 0) balance += amount; }
    @Override
    public String toString() { return owner + ": " + balance; }
}

public class HaiCachViet {
    // kiểu PRF192: dữ liệu trong mảng, hàm nào cũng sửa được số dư nào — kể cả do nhầm
    static String[] owners = { "An", "Binh" };
    static long[] balances = { 500000, 200000 };

    static void withdraw(int i, long amount) { balances[i] -= amount; }   // quên kiểm tra

    public static void main(String[] args) {
        System.out.println("procedural:");
        withdraw(1, 300000);                                  // Binh chỉ có 200 000
        balances[0] = -999;                                   // dòng nào ở đâu cũng làm được điều này
        for (int i = 0; i &lt; owners.length; i++) System.out.println("  " + owners[i] + ": " + balances[i]);

        System.out.println("object-oriented:");
        Account an = new Account("An", 500000);
        Account binh = new Account("Binh", 200000);
        System.out.println("  Binh withdraws 300000 -&gt; " + binh.withdraw(300000));
        System.out.println("  An withdraws 100000   -&gt; " + an.withdraw(100000));
        // không biên dịch được: balance là private trong Account
        System.out.println("  " + an);
        System.out.println("  " + binh);
    }
}</code></pre>
<div class="out">procedural:<br>
&nbsp;&nbsp;An: -999<br>
&nbsp;&nbsp;Binh: -100000<br>
object-oriented:<br>
&nbsp;&nbsp;Binh withdraws 300000 -&gt; false<br>
&nbsp;&nbsp;An withdraws 100000 &nbsp;&nbsp;-&gt; true<br>
&nbsp;&nbsp;An: 400000<br>
&nbsp;&nbsp;Binh: 200000</div>
<p>Nhìn nửa đầu output: Binh rút nhiều hơn số mình có, và một dòng code nào đó đặt số dư của An thành -999. Không gì ngăn được, vì code <em>nào</em> cũng ghi được vào mảng. Ở nửa sau, luật nằm <strong>bên trong</strong> đối tượng: <code>withdraw(300000)</code> trả về <code>false</code>, còn dòng <code>an.balance = -999</code> thậm chí không biên dịch được. Cả môn học thu nhỏ lại là thế này:</p>
<table>
<thead><tr><th>Ý tưởng</th><th>Trong chương trình này</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>lớp và đối tượng</td><td><code>Account</code> là lớp; <code>an</code>, <code>binh</code> là đối tượng</td><td>1–2</td></tr>
<tr><td>đóng gói (encapsulation)</td><td><code>private long balance</code> + các phương thức canh giữ nó</td><td>2–3</td></tr>
<tr><td>kế thừa và đa hình</td><td>(bước tiếp: <code>SavingAccount extends Account</code>)</td><td>4–5</td></tr>
<tr><td>ngoại lệ (exception)</td><td>(bước tiếp: ném ngoại lệ thay vì trả false)</td><td>6</td></tr>
<tr><td>mảng đối tượng, collections</td><td>(bước tiếp: một ngân hàng giữ nhiều tài khoản)</td><td>7–8</td></tr>
<tr><td>tệp</td><td>(bước tiếp: lưu các tài khoản ra file)</td><td>9</td></tr>
</tbody>
</table>
<p>Đây cũng chính là hình dạng project mẫu <em>Banking</em> của trường (model <code>Account</code>/<code>Bank</code>, một menu chữ, một cửa sổ Swing) mà bạn sẽ phân tích ở một bài sau.</p>`),
    bi(`<h2>2. A short, dated history — so the versions you meet make sense</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4491883c96390fe59684a94993c67ccb7a57234.svg" alt="From the Oak language to the long-term-support releases; the exam JDK and the Spring Boot JDK highlighted" loading="lazy" /><p class="chu-thich">🧩 From the Oak language to the long-term-support releases; the exam JDK and the Spring Boot JDK highlighted</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 3–4 widened — Java from Oak to the LTS releases
' Dates checked against the Java version history (October 2026)
rectangle "1991\\nGreen Project\\nOak language" as A
rectangle "May 1995\\nJava + HotJava\\nannounced" as B
rectangle "Jan 1996\\nJDK 1.0" as C
rectangle "Sep 2004\\nJ2SE 5.0\\ngenerics" as D
rectangle "Mar 2014\\nJava 8 (LTS)\\nlambdas\\n← the exam JDK" as E #FEF9C3
rectangle "Sep 2018\\nJava 11 (LTS)" as F
rectangle "Sep 2021\\nJava 17 (LTS)\\n← Spring Boot 3" as G #ECFDF5
rectangle "Sep 2023\\nJava 21 (LTS)" as H
rectangle "Sep 2025\\nJava 25 (LTS)" as I
A -right-&gt; B
B -right-&gt; C
C -right-&gt; D
D -right-&gt; E
E -down-&gt; F
F -left-&gt; G
G -left-&gt; H
H -left-&gt; I
@enduml</code></pre></details>
<table>
<thead><tr><th>When</th><th>What happened</th><th>Why you care</th></tr></thead>
<tbody>
<tr><td>June 1991</td><td>James Gosling, Mike Sheridan and Patrick Naughton start Sun's Green Project; Gosling designs the language <strong>Oak</strong> for consumer devices</td><td>Oak's goals (platform-independent, reliable, compact) shaped all of Java</td></tr>
<tr><td>23 May 1995</td><td>Sun announces <strong>Java</strong> and the HotJava browser at SunWorld (Oak was renamed — the name was taken)</td><td>"write once, run anywhere"</td></tr>
<tr><td>23 Jan 1996</td><td><strong>JDK 1.0</strong></td><td>the first official release</td></tr>
<tr><td>1997–1999</td><td>servlets (1997), J2SE 1.2 (Dec 1998, Collections Framework), J2EE (1999)</td><td>Java moves to servers — PRJ301's world; Chapter 8's collections</td></tr>
<tr><td>30 Sep 2004</td><td>J2SE 5.0: generics, enhanced for, autoboxing, enums</td><td>the <code>ArrayList&lt;Student&gt;</code> and <code>for (Student s : list)</code> you write every day</td></tr>
<tr><td>2006–2007</td><td>Sun open-sources Java as <strong>OpenJDK</strong> (GPL)</td><td>free JDKs such as Eclipse Temurin</td></tr>
<tr><td>27 Jan 2010</td><td>Oracle buys Sun</td><td>Oracle now publishes Java</td></tr>
<tr><td>18 Mar 2014</td><td><strong>Java 8</strong> (long-term support): lambdas, streams, java.time</td><td><strong>the JDK of the PRO192 exam room</strong></td></tr>
<tr><td>since 2017</td><td>a feature release every six months; long-term-support releases <strong>11</strong> (2018), <strong>17</strong> (2021), <strong>21</strong> (2023), <strong>25</strong> (Sep 2025)</td><td>Spring Boot 3 needs 17+; this site's examples run on 17/21</td></tr>
<tr><td>2025–2026</td><td>Java 25 lets beginners write <code>void main()</code> without <code>static</code> (JEP 512); Java 26 removes applets for good</td><td>old exam questions about applets are history</td></tr>
</tbody>
</table>
<p class="meo">🧠 Two numbers to remember: <strong>8</strong> (the exam) and <strong>17+</strong> (everything after PRO192). Your OOP is the same in both; only the conveniences differ (section 5 below).</p>`,
    `<h2>2. Lịch sử ngắn có mốc năm — để các phiên bản bạn gặp có nghĩa</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4491883c96390fe59684a94993c67ccb7a57234.svg" alt="Từ ngôn ngữ Oak tới các bản hỗ trợ dài hạn; tô màu JDK phòng thi và JDK của Spring Boot" loading="lazy" /><p class="chu-thich">🧩 Từ ngôn ngữ Oak tới các bản hỗ trợ dài hạn; tô màu JDK phòng thi và JDK của Spring Boot</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 3–4 widened — Java from Oak to the LTS releases
' Mốc năm đối chiếu lịch sử phiên bản Java (10/2026)
rectangle "1991\\nGreen Project\\nOak language" as A
rectangle "May 1995\\nJava + HotJava\\nannounced" as B
rectangle "Jan 1996\\nJDK 1.0" as C
rectangle "Sep 2004\\nJ2SE 5.0\\ngenerics" as D
rectangle "Mar 2014\\nJava 8 (LTS)\\nlambdas\\n← the exam JDK" as E #FEF9C3
rectangle "Sep 2018\\nJava 11 (LTS)" as F
rectangle "Sep 2021\\nJava 17 (LTS)\\n← Spring Boot 3" as G #ECFDF5
rectangle "Sep 2023\\nJava 21 (LTS)" as H
rectangle "Sep 2025\\nJava 25 (LTS)" as I
A -right-&gt; B
B -right-&gt; C
C -right-&gt; D
D -right-&gt; E
E -down-&gt; F
F -left-&gt; G
G -left-&gt; H
H -left-&gt; I
@enduml</code></pre></details>
<table>
<thead><tr><th>Khi nào</th><th>Chuyện gì xảy ra</th><th>Vì sao bạn cần biết</th></tr></thead>
<tbody>
<tr><td>6/1991</td><td>James Gosling, Mike Sheridan và Patrick Naughton mở Green Project ở Sun; Gosling thiết kế ngôn ngữ <strong>Oak</strong> cho thiết bị điện tử tiêu dùng</td><td>mục tiêu của Oak (độc lập nền tảng, đáng tin, gọn nhẹ) định hình cả Java</td></tr>
<tr><td>23/05/1995</td><td>Sun công bố <strong>Java</strong> và trình duyệt HotJava tại SunWorld (Oak đổi tên — tên cũ đã có người dùng)</td><td>"viết một lần, chạy mọi nơi"</td></tr>
<tr><td>23/01/1996</td><td><strong>JDK 1.0</strong></td><td>bản phát hành chính thức đầu tiên</td></tr>
<tr><td>1997–1999</td><td>servlet (1997), J2SE 1.2 (12/1998, có Collections Framework), J2EE (1999)</td><td>Java lên server — thế giới của PRJ301; collections của Chương 8</td></tr>
<tr><td>30/09/2004</td><td>J2SE 5.0: generics, for-each, autoboxing, enum</td><td>cái <code>ArrayList&lt;Student&gt;</code> và <code>for (Student s : list)</code> bạn viết hằng ngày</td></tr>
<tr><td>2006–2007</td><td>Sun mở mã nguồn Java thành <strong>OpenJDK</strong> (giấy phép GPL)</td><td>các JDK miễn phí như Eclipse Temurin</td></tr>
<tr><td>27/01/2010</td><td>Oracle mua Sun</td><td>từ đó Oracle phát hành Java</td></tr>
<tr><td>18/03/2014</td><td><strong>Java 8</strong> (hỗ trợ dài hạn): lambda, stream, java.time</td><td><strong>JDK của phòng thi PRO192</strong></td></tr>
<tr><td>từ 2017</td><td>sáu tháng một bản tính năng; các bản hỗ trợ dài hạn <strong>11</strong> (2018), <strong>17</strong> (2021), <strong>21</strong> (2023), <strong>25</strong> (9/2025)</td><td>Spring Boot 3 cần 17+; ví dụ của web này chạy trên 17/21</td></tr>
<tr><td>2025–2026</td><td>Java 25 cho người mới viết <code>void main()</code> không cần <code>static</code> (JEP 512); Java 26 gỡ hẳn applet</td><td>câu thi cũ về applet giờ là lịch sử</td></tr>
</tbody>
</table>
<p class="meo">🧠 Hai con số cần nhớ: <strong>8</strong> (phòng thi) và <strong>17+</strong> (mọi thứ sau PRO192). OOP của bạn y hệt ở cả hai; chỉ khác các tiện ích (mục 5 bên dưới).</p>`),
    bi(`<h2>3. Why PRO192 matters — four concrete reasons</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/db6286142aced0b5c22d3c0940ec3b8878890935.svg" alt="PRO192 in the curriculum: the courses that stand on it, up to the LabFlow capstone" loading="lazy" /><p class="chu-thich">🧩 PRO192 in the curriculum: the courses that stand on it, up to the LabFlow capstone</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Where PRO192 sits — every later Java course stands on it
' Arrows = "is used by"
left to right direction
rectangle "PRF192\\nC: variables, loops,\\nfunctions, arrays" as PRF
rectangle "&lt;b&gt;PRO192&lt;/b&gt;\\nJava + OOP:\\nclasses, the 4 pillars,\\nexceptions, collections, files" as PRO #FEF9C3
rectangle "LAB211\\nbig console programs\\n(menus, files, validation)" as LAB
rectangle "CSD201\\ndata structures\\nin Java" as CSD
rectangle "PRJ301\\nJava web: servlet,\\nJSP, JDBC, MVC" as PRJ
rectangle "SWD392\\ndesign: UML, patterns,\\nSOLID" as SWD
rectangle "SWP391 / capstone\\nLabFlow AI on\\nSpring Boot 3" as CAP #ECFDF5
PRF --&gt; PRO
PRO --&gt; LAB
PRO --&gt; CSD
PRO --&gt; PRJ
PRO --&gt; SWD
LAB --&gt; CAP
PRJ --&gt; CAP
SWD --&gt; CAP
@enduml</code></pre></details>
<h3>(a) The next Java courses assume it</h3>
<p><strong>LAB211</strong> is a semester of console programs graded line by line (classes, validation, files, menus) — it is PRO192 under a microscope. <strong>CSD201</strong> implements linked lists and trees as Java classes. <strong>PRJ301</strong> turns your classes into a web application on Tomcat. <strong>SWD392</strong> draws them as UML and applies design patterns that only make sense if inheritance and interfaces are second nature.</p>
<h3>(b) The exams: PE 30% + FE 30%</h3>
<p>The practical exam (85 minutes, JDK 8 + NetBeans) gives you a project with a ready <code>Main</code> and typically asks for 4 classes (10 marks): one with encapsulation and formatting rules, one inheritance, one list-based search/count, one interface — exactly Chapters 2–8. The FE (60 minutes, about 50 multiple-choice questions) checks the theory and asks "what does this code print?". Lesson "How to study" shows the real formats.</p>
<h3>(c) It is the foundation of Spring Boot — and of LabFlow</h3>
<p>A Spring Boot application is <em>made of</em> PRO192 ideas: an entity class with private fields and getters (encapsulation), a <code>ReservationService</code> interface with one implementation (Chapter 5), <code>@Override</code> everywhere (Chapter 4), <code>List</code>/<code>Map</code> in every method (Chapter 8), exceptions turned into HTTP errors (Chapter 6). Spring adds annotations on top; it removes none of this.</p>
<h3>(d) Interviews for Java jobs start here</h3>
<table>
<thead><tr><th>Typical fresher interview question</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>"What are the four pillars of OOP? Give an example of each."</td><td>1</td></tr>
<tr><td>"Overloading vs overriding?"</td><td>4</td></tr>
<tr><td>"Abstract class vs interface — when do you use which?"</td><td>5</td></tr>
<tr><td>"Checked vs unchecked exceptions? What does finally do?"</td><td>6</td></tr>
<tr><td>"ArrayList vs LinkedList? HashMap — how does it work? equals and hashCode?"</td><td>8</td></tr>
<tr><td>"Why is String immutable? == vs equals?"</td><td>1–2</td></tr>
</tbody>
</table>`,
    `<h2>3. Vì sao PRO192 quan trọng — bốn lý do cụ thể</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/db6286142aced0b5c22d3c0940ec3b8878890935.svg" alt="PRO192 trong chương trình học: các môn đứng trên nó, tới đồ án LabFlow" loading="lazy" /><p class="chu-thich">🧩 PRO192 trong chương trình học: các môn đứng trên nó, tới đồ án LabFlow</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Where PRO192 sits — every later Java course stands on it
' Mũi tên = "được dùng bởi"
left to right direction
rectangle "PRF192\\nC: variables, loops,\\nfunctions, arrays" as PRF
rectangle "&lt;b&gt;PRO192&lt;/b&gt;\\nJava + OOP:\\nclasses, the 4 pillars,\\nexceptions, collections, files" as PRO #FEF9C3
rectangle "LAB211\\nbig console programs\\n(menus, files, validation)" as LAB
rectangle "CSD201\\ndata structures\\nin Java" as CSD
rectangle "PRJ301\\nJava web: servlet,\\nJSP, JDBC, MVC" as PRJ
rectangle "SWD392\\ndesign: UML, patterns,\\nSOLID" as SWD
rectangle "SWP391 / capstone\\nLabFlow AI on\\nSpring Boot 3" as CAP #ECFDF5
PRF --&gt; PRO
PRO --&gt; LAB
PRO --&gt; CSD
PRO --&gt; PRJ
PRO --&gt; SWD
LAB --&gt; CAP
PRJ --&gt; CAP
SWD --&gt; CAP
@enduml</code></pre></details>
<h3>(a) Các môn Java sau mặc định bạn đã vững nó</h3>
<p><strong>LAB211</strong> là cả học kỳ chương trình console bị chấm từng dòng (lớp, kiểm tra dữ liệu, tệp, menu) — tức PRO192 dưới kính hiển vi. <strong>CSD201</strong> cài danh sách liên kết và cây bằng các lớp Java. <strong>PRJ301</strong> biến các lớp của bạn thành ứng dụng web trên Tomcat. <strong>SWD392</strong> vẽ chúng thành UML và áp dụng design pattern — thứ chỉ hiểu được khi kế thừa và interface đã thành phản xạ.</p>
<h3>(b) Thi cử: PE 30% + FE 30%</h3>
<p>Bài thi thực hành (85 phút, JDK 8 + NetBeans) cho bạn một project có sẵn <code>Main</code> và thường đòi 4 lớp (10 điểm): một lớp đóng gói kèm luật định dạng, một lớp kế thừa, một lớp tìm/đếm trên danh sách, một interface — đúng Chương 2–8. FE (60 phút, khoảng 50 câu trắc nghiệm) kiểm lý thuyết và hỏi "đoạn code này in ra gì?". Bài "Học thế nào" cho xem đúng định dạng đề thật.</p>
<h3>(c) Nó là nền của Spring Boot — và của LabFlow</h3>
<p>Một ứng dụng Spring Boot được <em>làm từ</em> các ý của PRO192: lớp entity có trường private và getter (đóng gói), interface <code>ReservationService</code> với một lớp cài đặt (Chương 5), <code>@Override</code> khắp nơi (Chương 4), <code>List</code>/<code>Map</code> trong mọi phương thức (Chương 8), ngoại lệ biến thành lỗi HTTP (Chương 6). Spring thêm annotation lên trên; nó không bỏ đi thứ gì trong số đó.</p>
<h3>(d) Phỏng vấn việc Java bắt đầu từ đây</h3>
<table>
<thead><tr><th>Câu phỏng vấn fresher hay gặp</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>"Bốn trụ cột của OOP là gì? Cho ví dụ từng cái."</td><td>1</td></tr>
<tr><td>"Overloading khác overriding thế nào?"</td><td>4</td></tr>
<tr><td>"Abstract class khác interface — khi nào dùng cái nào?"</td><td>5</td></tr>
<tr><td>"Checked khác unchecked exception? finally để làm gì?"</td><td>6</td></tr>
<tr><td>"ArrayList khác LinkedList? HashMap hoạt động ra sao? equals và hashCode?"</td><td>8</td></tr>
<tr><td>"Vì sao String bất biến? == khác equals?"</td><td>1–2</td></tr>
</tbody>
</table>`),
    bi(`<h2>4. Honest weights — where to put your effort</h2>
<table>
<thead><tr><th>Part</th><th>Weight for you</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Ch.2–3 classes, constructors, encapsulation</td><td>⭐⭐⭐</td><td>PE question 1 every time; LAB211 entity classes; every Spring entity</td></tr>
<tr><td>Ch.4–5 inheritance, polymorphism, abstract class, interface</td><td>⭐⭐⭐</td><td>PE questions 2 and 4; the most-asked FE and interview topic</td></tr>
<tr><td>Ch.8 collections (ArrayList, HashMap, sorting)</td><td>⭐⭐⭐</td><td>PE question 3; used in every program you will ever write</td></tr>
<tr><td>Ch.1 Java basics, String, Scanner</td><td>⭐⭐</td><td>small but everything stands on it; many "what does it print" FE questions</td></tr>
<tr><td>Ch.6 exceptions</td><td>⭐⭐</td><td>FE questions on try/catch/finally order; LAB211 input validation</td></tr>
<tr><td>Ch.7 arrays of objects</td><td>⭐⭐</td><td>the stepping stone to collections; LAB211 style</td></tr>
<tr><td>Ch.9 files</td><td>⭐</td><td>appears in the Assignment/LAB211 more than in the PE; learn the read/write patterns</td></tr>
<tr><td>JVM memory, history, the JDK tools</td><td>⭐</td><td>a few FE questions; useful when something does not start</td></tr>
</tbody>
</table>
<p class="meo">🧠 If you only had one week before the PE: write, from memory, <strong>one class with private fields, two constructors, getters/setters and a formatted toString; one subclass that overrides a method; one method that searches and counts in an ArrayList; one interface with one implementation</strong>. That is the whole PE paper.</p>`,
    `<h2>4. Nói thật về trọng số — nên dồn sức vào đâu</h2>
<table>
<thead><tr><th>Phần</th><th>Mức quan trọng với bạn</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Ch.2–3 lớp, constructor, đóng gói</td><td>⭐⭐⭐</td><td>câu 1 của đề PE lần nào cũng có; lớp entity của LAB211; entity nào của Spring cũng vậy</td></tr>
<tr><td>Ch.4–5 kế thừa, đa hình, abstract class, interface</td><td>⭐⭐⭐</td><td>câu 2 và câu 4 của đề PE; chủ đề FE và phỏng vấn hỏi nhiều nhất</td></tr>
<tr><td>Ch.8 collections (ArrayList, HashMap, sắp xếp)</td><td>⭐⭐⭐</td><td>câu 3 của đề PE; chương trình nào sau này cũng dùng</td></tr>
<tr><td>Ch.1 Java cơ bản, String, Scanner</td><td>⭐⭐</td><td>ít nhưng mọi thứ đứng trên nó; nhiều câu FE "in ra gì"</td></tr>
<tr><td>Ch.6 ngoại lệ</td><td>⭐⭐</td><td>câu FE về thứ tự try/catch/finally; kiểm tra dữ liệu nhập ở LAB211</td></tr>
<tr><td>Ch.7 mảng đối tượng</td><td>⭐⭐</td><td>bậc thang lên collections; đúng kiểu LAB211</td></tr>
<tr><td>Ch.9 tệp</td><td>⭐</td><td>xuất hiện ở Assignment/LAB211 nhiều hơn ở PE; học thuộc khuôn đọc/ghi</td></tr>
<tr><td>Bộ nhớ JVM, lịch sử, công cụ JDK</td><td>⭐</td><td>vài câu FE; có ích khi chương trình không chịu chạy</td></tr>
</tbody>
</table>
<p class="meo">🧠 Nếu chỉ còn một tuần trước PE: tự viết không nhìn <strong>một lớp có trường private, hai constructor, getter/setter và toString có định dạng; một lớp con ghi đè một phương thức; một phương thức tìm và đếm trong ArrayList; một interface với một lớp cài đặt</strong>. Đó là nguyên cả đề PE.</p>`),
    bi(`<h2>5. Java 8 in the exam, modern Java everywhere else</h2>
<p>This site compiles its examples with Java 17 and runs on JDK 21, because that is where you are heading. But <strong>every program meant for the exam room is also compiled with <code>--release 8</code> and run on a real JDK 8</strong>, and lessons mark the few modern features clearly. The rule for your own code:</p>
<table>
<thead><tr><th>Feature</th><th>Since</th><th>In the PRO192 exam (JDK 8)?</th></tr></thead>
<tbody>
<tr><td><code>List&lt;String&gt; names = new ArrayList&lt;&gt;();</code> (diamond)</td><td>Java 7</td><td>✅ yes</td></tr>
<tr><td>lambdas <code>x -&gt; x * 2</code>, <code>list.forEach(...)</code>, streams</td><td>Java 8</td><td>✅ yes (but not needed for the PE)</td></tr>
<tr><td><code>var name = "An";</code></td><td>Java 10</td><td>❌ compile error on JDK 8</td></tr>
<tr><td><code>List.of(...)</code>, <code>String.repeat</code>, <code>String.isBlank</code></td><td>Java 9–11</td><td>❌ "cannot find symbol" on JDK 8</td></tr>
<tr><td>switch with arrows <code>case 1 -&gt; ...</code></td><td>Java 14</td><td>❌</td></tr>
<tr><td><code>record Student(String id, double gpa)</code></td><td>Java 16</td><td>❌</td></tr>
</tbody>
</table>
<div class="pitfall">The trap is invisible at home: a modern NetBeans on JDK 21 accepts <code>var</code> happily. The ⭐ lesson "Installing the environment" shows the real JDK 8 errors and how to make your PRO192 projects compile as Java 8, so the exam room holds no surprise.</div>`,
    `<h2>5. Java 8 trong phòng thi, Java hiện đại ở mọi nơi khác</h2>
<p>Web này biên dịch ví dụ bằng Java 17 và chạy trên JDK 21, vì đó là nơi bạn đang hướng tới. Nhưng <strong>mọi chương trình dùng cho phòng thi đều được biên dịch thêm với <code>--release 8</code> và chạy trên JDK 8 thật</strong>, và các bài đánh dấu rõ vài tính năng hiện đại. Luật cho code của bạn:</p>
<table>
<thead><tr><th>Tính năng</th><th>Có từ</th><th>Dùng được ở phòng thi PRO192 (JDK 8)?</th></tr></thead>
<tbody>
<tr><td><code>List&lt;String&gt; names = new ArrayList&lt;&gt;();</code> (toán tử kim cương)</td><td>Java 7</td><td>✅ được</td></tr>
<tr><td>lambda <code>x -&gt; x * 2</code>, <code>list.forEach(...)</code>, stream</td><td>Java 8</td><td>✅ được (nhưng PE không cần)</td></tr>
<tr><td><code>var name = "An";</code></td><td>Java 10</td><td>❌ lỗi biên dịch trên JDK 8</td></tr>
<tr><td><code>List.of(...)</code>, <code>String.repeat</code>, <code>String.isBlank</code></td><td>Java 9–11</td><td>❌ "cannot find symbol" trên JDK 8</td></tr>
<tr><td>switch mũi tên <code>case 1 -&gt; ...</code></td><td>Java 14</td><td>❌</td></tr>
<tr><td><code>record Student(String id, double gpa)</code></td><td>Java 16</td><td>❌</td></tr>
</tbody>
</table>
<div class="pitfall">Cái bẫy này vô hình khi ở nhà: NetBeans mới trên JDK 21 vui vẻ nhận <code>var</code>. Bài ⭐ "Cài môi trường" cho xem lỗi thật của JDK 8 và cách bắt project PRO192 của bạn biên dịch theo Java 8, để phòng thi không còn bất ngờ.</div>`),
    bi(`<h2>6. How the lessons on this site work</h2>
<ul>
<li><strong>📑 Slide by slide</strong>: every school slide, shown as in class, with its key idea, a plain explanation, the exam trap, and — whenever there is code — a Java program that was compiled and run for real, with its real output. Where a slide is outdated or wrong (several are: Windows XP screenshots, JDK 1.6, a C++ code box), the lesson says so and fixes it.</li>
<li><strong>🧪 Practice</strong> at the end of each chapter: exercises with solutions that were run for real, a glossary and a summary.</li>
<li><strong>Quiz</strong> per chapter: 10 questions with explanations (the old quizzes had none), inspired by real FE question types.</li>
<li><strong>🧭 Go further</strong> boxes: where the idea reappears in LAB211, PRJ301 or Spring Boot.</li>
</ul>
<p>Next: <strong>⭐ Start here (2/2) — How to study PRO192</strong>, then install everything and write your first class.</p>`,
    `<h2>6. Các bài trên web này vận hành thế nào</h2>
<ul>
<li><strong>📑 Học theo từng slide</strong>: mọi slide của trường, giữ nguyên như trên lớp, kèm ý chính, giải thích dễ hiểu, bẫy thi, và — hễ có code — một chương trình Java đã biên dịch và chạy thật cùng output thật. Slide nào đã cũ hoặc sai (có mấy cái: ảnh Windows XP, JDK 1.6, một khung code C++), bài nói thẳng và sửa lại.</li>
<li><strong>🧪 Thực hành</strong> cuối mỗi chương: bài tập có lời giải đã chạy thật, bảng thuật ngữ và tóm tắt.</li>
<li><strong>Quiz</strong> mỗi chương: 10 câu có giải thích (quiz cũ không có), lấy cảm hứng từ dạng câu FE thật.</li>
<li>Ô <strong>🧭 Đi tiếp</strong>: ý đó xuất hiện lại ở LAB211, PRJ301 hay Spring Boot ra sao.</li>
</ul>
<p>Tiếp theo: <strong>⭐ Bắt đầu tại đây (2/2) — Học PRO192 thế nào</strong>, rồi cài đủ mọi thứ và viết lớp đầu tiên.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ Start here (2/2) — How to study PRO192: the 60-session map, where the marks are, a weekly rhythm, PE and FE preparation ───────── */
const L_x_hoc_the_nao = {
  title: '⭐ Start here (2/2) — How to study PRO192: the 60-session map, where the marks are, a weekly rhythm, PE and FE preparation|||⭐ Bắt đầu tại đây (2/2) — Học PRO192 thế nào: bản đồ 60 buổi, điểm nằm ở đâu, nhịp mỗi tuần, chuẩn bị PE và FE',
  slug: 'pro192-hoc-the-nao',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài định hướng tự thêm: cấu trúc điểm theo đề cương FLM 12038 (Assignment, 6 bài Lab, PE 85 phút, 2 Progress Test, FE 60 phút với ngưỡng 4 điểm, cột nào cũng phải lớn hơn 0), bản đồ 60 buổi ↔ chương đề cương ↔ 14 bộ slide ↔ 9 chương trên web, định dạng đề PE và FE thật trong Exam Room, nhịp học mỗi tuần, bốn luật học code không nản, một bẫy định dạng số đo thật, và dùng AI sao cho có ích.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Start here 2/2 · added by this site</span>
<h2>How to study PRO192 so that the labs, the PE and the FE all go well</h2>
<p class="lead">PRO192 is a <strong>keyboard course</strong>: 70% of the mark (Assignment, labs, PE, progress tests) is code you write and run, and even the FE is full of "what does this print?". Reading slides is necessary, not sufficient. This lesson shows where the marks are, how the 60 sessions map onto the chapters here, and a weekly routine that turns reading into typing.</p>`,
    `<span class="eyebrow">Mục 0 · ⭐ Bắt đầu tại đây 2/2 · phần web tự thêm</span>
<h2>Học PRO192 thế nào để Lab, PE và FE đều ổn</h2>
<p class="lead">PRO192 là <strong>môn của bàn phím</strong>: 70% điểm (Assignment, Lab, PE, Progress Test) là code bạn tự viết và chạy, đến FE cũng đầy câu "đoạn này in ra gì?". Đọc slide là cần, nhưng không đủ. Bài này cho thấy điểm nằm ở đâu, 60 buổi học khớp với các chương ở đây ra sao, và một nhịp học mỗi tuần biến việc đọc thành việc gõ.</p>`),
    bi(`<h2>1. Where the marks are (syllabus 12038)</h2>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>Parts</th><th>Pass condition</th><th>Duration</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>20%</td><td>1</td><td>&gt; 0</td><td>runs over about 28 slots</td></tr>
<tr><td>Lab</td><td>10%</td><td>6</td><td>&gt; 0</td><td>90 minutes each</td></tr>
<tr><td>Practical Exam (PE)</td><td>30%</td><td>1</td><td>&gt; 0</td><td>85 minutes, on a lab PC</td></tr>
<tr><td>Progress Test</td><td>10%</td><td>2</td><td>&gt; 0</td><td>30 minutes each</td></tr>
<tr><td>Final Exam (FE)</td><td>30%</td><td>1</td><td>≥ 4 / 10</td><td>60 minutes</td></tr>
</tbody>
</table>
<p>Three gates, all from the syllabus: attend <strong>at least 80%</strong> of the contact slots to sit the final; <strong>every on-going component must be above 0</strong> — one missing lab or a zero Progress Test fails the course by itself; and the FE must be <strong>at least 4</strong> with an overall average of <strong>at least 5</strong>. Lesson 0.2 below lists the same table.</p>
<p>Time budget: 150 hours in total = 45 hours in class + the two exams + <strong>104 hours of self-study</strong> — about 7 hours a week over a 15-week term.</p>
<div class="pitfall">The most common way to fail PRO192 with good knowledge: skipping one lab or forgetting to submit the Assignment on time. "&gt; 0" means a single zero is fatal.</div>`,
    `<h2>1. Điểm nằm ở đâu (đề cương 12038)</h2>
<table>
<thead><tr><th>Cột điểm</th><th>Trọng số</th><th>Số phần</th><th>Điều kiện</th><th>Thời lượng</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>20%</td><td>1</td><td>&gt; 0</td><td>kéo dài khoảng 28 buổi</td></tr>
<tr><td>Lab</td><td>10%</td><td>6</td><td>&gt; 0</td><td>90 phút mỗi bài</td></tr>
<tr><td>Practical Exam (PE — thi thực hành)</td><td>30%</td><td>1</td><td>&gt; 0</td><td>85 phút, trên máy phòng lab</td></tr>
<tr><td>Progress Test</td><td>10%</td><td>2</td><td>&gt; 0</td><td>30 phút mỗi bài</td></tr>
<tr><td>Final Exam (FE — thi cuối kỳ)</td><td>30%</td><td>1</td><td>≥ 4 / 10</td><td>60 phút</td></tr>
</tbody>
</table>
<p>Ba cửa ải, đều lấy từ đề cương: dự <strong>ít nhất 80%</strong> số buổi mới được thi cuối kỳ; <strong>cột on-going nào cũng phải lớn hơn 0</strong> — thiếu một bài lab hay một Progress Test bằng 0 là trượt môn; và FE phải <strong>từ 4 trở lên</strong> với điểm trung bình <strong>từ 5 trở lên</strong>. Bài 0.2 bên dưới có cùng bảng này.</p>
<p>Ngân sách thời gian: tổng 150 giờ = 45 giờ trên lớp + hai buổi thi + <strong>104 giờ tự học</strong> — khoảng 7 giờ mỗi tuần trong học kỳ 15 tuần.</p>
<div class="pitfall">Cách trượt PRO192 phổ biến nhất dù biết bài: bỏ một bài lab hoặc quên nộp Assignment đúng hạn. "&gt; 0" nghĩa là chỉ một con 0 cũng đủ chết.</div>`),
    bi(`<h2>2. The 60 sessions ↔ the chapters on this site</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7d3226892c98e389f3558355ec5a70a0c670c747.svg" alt="PRO192 on one page: sessions, school decks, web chapters, labs and tests" loading="lazy" /><p class="chu-thich">🧩 PRO192 on one page: sessions, school decks, web chapters, labs and tests</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PRO192 on one page — 60 sessions, 14 school decks, 9 web chapters, where the marks come from
' Session numbers from the FLM syllabus 12038
rectangle "Sessions 1–12\\nIntroduction · Getting Started · Java language\\nNumbers &amp; Strings · Support classes · Memory\\n&lt;b&gt;Web: Section 0 + Chapters 1–2&lt;/b&gt; · Lab 1" as P1
rectangle "Sessions 13–30\\nClass · Encapsulation · Inheritance\\nPolymorphism · Abstract class · Interface\\n&lt;b&gt;Web: Chapters 2–5&lt;/b&gt; · Labs 2–4" as P2
rectangle "Sessions 31–34\\nExceptions\\n&lt;b&gt;Web: Chapter 6&lt;/b&gt;\\n&lt;b&gt;Progress Test 1&lt;/b&gt;" as P3
rectangle "Sessions 35–52\\nArray of objects · Collections · File I/O\\n&lt;b&gt;Web: Chapters 7–9&lt;/b&gt; · Labs 5–6" as P4
rectangle "Sessions 53–60\\n&lt;b&gt;Progress Test 2&lt;/b&gt; · Assignment evaluation\\nReview → &lt;b&gt;PE 85'&lt;/b&gt; (JDK 8) · &lt;b&gt;FE 60'&lt;/b&gt;" as P5
P1 -down-&gt; P2
P2 -down-&gt; P3
P3 -down-&gt; P4
P4 -down-&gt; P5
note right of P2
  Assignment 20% runs
  across these weeks
end note
@enduml</code></pre></details>
<p>The syllabus numbers its chapters differently from this site (it has 8, the site has 9, because "Classes &amp; Objects" and "Encapsulation" are split). Use this table to find the lesson for tomorrow's session:</p>
<table>
<thead><tr><th>Sessions</th><th>Syllabus topic</th><th>School deck(s)</th><th>Chapter here</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>Ch.1 Introduction, object terminology, installing JDK + IDE</td><td>Introduction · Download &amp; Install · Getting Started</td><td>Section 0, Chapter 1</td></tr>
<tr><td>3–9</td><td>Ch.2 Basic Java: variables, control, methods, arrays/ArrayList, String, standard I/O</td><td>Learning the Java Language · Numbers and Strings · Support Classes</td><td>Chapter 1</td></tr>
<tr><td>10–11</td><td>Lab 1</td><td>—</td><td>🧪 Chapter 1</td></tr>
<tr><td>12</td><td>Ch.2.4 Dynamic memory</td><td>Memory Management in Java</td><td>Chapter 2</td></tr>
<tr><td>13–16</td><td>Ch.3 OOP concept, abstraction, class definition, encapsulation</td><td>Encapsulation</td><td>Chapters 2–3</td></tr>
<tr><td>17–18</td><td>Lab 2</td><td>—</td><td>🧪 Chapters 2–3</td></tr>
<tr><td>19–26</td><td>Ch.3.5–3.8 inheritance, polymorphism, overriding; Labs 3–4</td><td>Inheritance · Polymorphism</td><td>Chapter 4</td></tr>
<tr><td>27–30</td><td>Ch.4 abstract class, interface</td><td>Polymorphism (second half)</td><td>Chapter 5</td></tr>
<tr><td>31–32</td><td>Ch.5 exceptions</td><td>Exception Handling</td><td>Chapter 6</td></tr>
<tr><td>33–34</td><td><strong>Progress Test 1</strong> + workshop</td><td>—</td><td>Progress Test 1</td></tr>
<tr><td>35–38</td><td>Ch.6 array of objects (add, update, remove, sort, find)</td><td>ArrayOfObjects</td><td>Chapter 7</td></tr>
<tr><td>39–46</td><td>Ch.7 Collections: List, Set, Map; Lab 5</td><td>Collections</td><td>Chapter 8</td></tr>
<tr><td>47–52</td><td>Ch.8 File I/O; Lab 6</td><td>File IO</td><td>Chapter 9</td></tr>
<tr><td>53–60</td><td><strong>Progress Test 2</strong>, Assignment evaluation, review</td><td>—</td><td>Progress Test 2, Final Exam</td></tr>
</tbody>
</table>`,
    `<h2>2. 60 buổi ↔ các chương trên web</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7d3226892c98e389f3558355ec5a70a0c670c747.svg" alt="PRO192 trên một trang: các buổi, bộ slide trường, chương web, lab và bài kiểm tra" loading="lazy" /><p class="chu-thich">🧩 PRO192 trên một trang: các buổi, bộ slide trường, chương web, lab và bài kiểm tra</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PRO192 on one page — 60 sessions, 14 school decks, 9 web chapters, where the marks come from
' Số buổi theo đề cương FLM 12038
rectangle "Sessions 1–12\\nIntroduction · Getting Started · Java language\\nNumbers &amp; Strings · Support classes · Memory\\n&lt;b&gt;Web: Section 0 + Chapters 1–2&lt;/b&gt; · Lab 1" as P1
rectangle "Sessions 13–30\\nClass · Encapsulation · Inheritance\\nPolymorphism · Abstract class · Interface\\n&lt;b&gt;Web: Chapters 2–5&lt;/b&gt; · Labs 2–4" as P2
rectangle "Sessions 31–34\\nExceptions\\n&lt;b&gt;Web: Chapter 6&lt;/b&gt;\\n&lt;b&gt;Progress Test 1&lt;/b&gt;" as P3
rectangle "Sessions 35–52\\nArray of objects · Collections · File I/O\\n&lt;b&gt;Web: Chapters 7–9&lt;/b&gt; · Labs 5–6" as P4
rectangle "Sessions 53–60\\n&lt;b&gt;Progress Test 2&lt;/b&gt; · Assignment evaluation\\nReview → &lt;b&gt;PE 85'&lt;/b&gt; (JDK 8) · &lt;b&gt;FE 60'&lt;/b&gt;" as P5
P1 -down-&gt; P2
P2 -down-&gt; P3
P3 -down-&gt; P4
P4 -down-&gt; P5
note right of P2
  Assignment 20% runs
  across these weeks
end note
@enduml</code></pre></details>
<p>Đề cương đánh số chương khác web này (đề cương có 8 chương, web có 9, vì tách "Lớp &amp; Đối tượng" và "Đóng gói"). Dùng bảng này để tìm bài cho buổi học ngày mai:</p>
<table>
<thead><tr><th>Buổi</th><th>Chủ đề theo đề cương</th><th>Bộ slide trường</th><th>Chương ở đây</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>Ch.1 Nhập môn, thuật ngữ đối tượng, cài JDK + IDE</td><td>Introduction · Download &amp; Install · Getting Started</td><td>Mục 0, Chương 1</td></tr>
<tr><td>3–9</td><td>Ch.2 Java cơ bản: biến, điều khiển, phương thức, mảng/ArrayList, String, nhập xuất chuẩn</td><td>Learning the Java Language · Numbers and Strings · Support Classes</td><td>Chương 1</td></tr>
<tr><td>10–11</td><td>Lab 1</td><td>—</td><td>🧪 Chương 1</td></tr>
<tr><td>12</td><td>Ch.2.4 Bộ nhớ động</td><td>Memory Management in Java</td><td>Chương 2</td></tr>
<tr><td>13–16</td><td>Ch.3 Khái niệm OOP, trừu tượng, định nghĩa lớp, đóng gói</td><td>Encapsulation</td><td>Chương 2–3</td></tr>
<tr><td>17–18</td><td>Lab 2</td><td>—</td><td>🧪 Chương 2–3</td></tr>
<tr><td>19–26</td><td>Ch.3.5–3.8 kế thừa, đa hình, ghi đè; Lab 3–4</td><td>Inheritance · Polymorphism</td><td>Chương 4</td></tr>
<tr><td>27–30</td><td>Ch.4 abstract class, interface</td><td>Polymorphism (nửa sau)</td><td>Chương 5</td></tr>
<tr><td>31–32</td><td>Ch.5 ngoại lệ</td><td>Exception Handling</td><td>Chương 6</td></tr>
<tr><td>33–34</td><td><strong>Progress Test 1</strong> + workshop</td><td>—</td><td>Progress Test 1</td></tr>
<tr><td>35–38</td><td>Ch.6 mảng đối tượng (thêm, sửa, xoá, sắp xếp, tìm)</td><td>ArrayOfObjects</td><td>Chương 7</td></tr>
<tr><td>39–46</td><td>Ch.7 Collections: List, Set, Map; Lab 5</td><td>Collections</td><td>Chương 8</td></tr>
<tr><td>47–52</td><td>Ch.8 Đọc/ghi tệp; Lab 6</td><td>File IO</td><td>Chương 9</td></tr>
<tr><td>53–60</td><td><strong>Progress Test 2</strong>, chấm Assignment, ôn tập</td><td>—</td><td>Progress Test 2, Thi cuối kỳ</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. How to learn code without giving up</h2>
<h3>Rule 1 — type it, run it, break it</h3>
<p>Never copy-paste an example. Type it into NetBeans, run it, then change one thing and predict the output before you run again. Lesson 1.C's slide 25 ("Try and Explore") is exactly this habit.</p>
<h3>Rule 2 — read the first error message, not the guess</h3>
<p>Java's messages are precise: <code>cannot find symbol … location: class Student</code> tells you the name and the place. Read the <em>first</em> one, fix it, recompile. Lessons 1.A and 1.C show the real messages of the classic mistakes.</p>
<h3>Rule 3 — keep an error notebook</h3>
<p>One line per mistake: the message, the cause, the fix. After four weeks it is the most useful revision document you own — the same twenty mistakes come back in every lab.</p>
<pre><code class="language-plaintext">2026-09-15  "non-static variable count cannot be referenced from a static context"
            cause: used a field inside main  -&gt;  create an object, or make the field static
2026-09-22  name is empty after nextInt()
            cause: nextInt() leaves the Enter key  -&gt;  read lines with nextLine() + parseInt</code></pre>
<h3>Rule 4 — one class finished beats three half-written</h3>
<p>For each concept write a small class <em>and</em> a <code>main</code> that tests it. A tested 30-line class teaches more than a 300-line program that never compiled.</p>`,
    `<h2>3. Học code thế nào cho không nản</h2>
<h3>Luật 1 — gõ, chạy, làm hỏng</h3>
<p>Đừng bao giờ copy-paste ví dụ. Gõ nó vào NetBeans, chạy, rồi sửa một chỗ và đoán output trước khi chạy lại. Slide 25 ("Try and Explore") của bài 1.C chính là thói quen này.</p>
<h3>Luật 2 — đọc thông báo lỗi đầu tiên, đừng đoán</h3>
<p>Thông báo của Java rất chính xác: <code>cannot find symbol … location: class Student</code> cho bạn biết tên và chỗ. Đọc lỗi <em>đầu tiên</em>, sửa, biên dịch lại. Bài 1.A và 1.C cho xem thông báo thật của các lỗi kinh điển.</p>
<h3>Luật 3 — giữ một sổ lỗi</h3>
<p>Mỗi lỗi một dòng: thông báo, nguyên nhân, cách sửa. Sau bốn tuần đó là tài liệu ôn tập có ích nhất bạn có — cùng hai mươi lỗi ấy quay lại ở mọi bài lab.</p>
<pre><code class="language-plaintext">2026-09-15  "non-static variable count cannot be referenced from a static context"
            nguyên nhân: dùng trường bên trong main  -&gt;  tạo đối tượng, hoặc cho trường là static
2026-09-22  name rỗng sau nextInt()
            nguyên nhân: nextInt() bỏ lại phím Enter  -&gt;  đọc cả dòng bằng nextLine() + parseInt</code></pre>
<h3>Luật 4 — một lớp làm xong hơn ba lớp viết dở</h3>
<p>Với mỗi khái niệm, viết một lớp nhỏ <em>và</em> một <code>main</code> để thử nó. Một lớp 30 dòng đã thử kỹ dạy bạn nhiều hơn một chương trình 300 dòng chưa từng biên dịch được.</p>`),
    bi(`<h2>4. A weekly rhythm (about 7 hours outside class)</h2>
<table>
<thead><tr><th>When</th><th>What</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Before the session</td><td>read the 📑 lesson for that deck; run every example once</td><td>1.5 h</td></tr>
<tr><td>After the session</td><td>retype the examples from memory; do the slide's own exercises</td><td>2 h</td></tr>
<tr><td>Lab week</td><td>finish the lab early; then redo it without looking</td><td>2 h</td></tr>
<tr><td>Weekend</td><td>the chapter's 🧪 practice + quiz; update the error notebook</td><td>1.5 h</td></tr>
</tbody>
</table>
<p class="meo">🧠 Start the Assignment the week it is given. It runs over about 28 slots precisely so that it grows with the chapters: entity classes after Chapter 3, inheritance after Chapter 4, a list after Chapter 8, a file after Chapter 9.</p>`,
    `<h2>4. Nhịp mỗi tuần (khoảng 7 giờ ngoài giờ học)</h2>
<table>
<thead><tr><th>Khi nào</th><th>Làm gì</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>Trước buổi học</td><td>đọc bài 📑 của bộ slide đó; chạy mỗi ví dụ một lần</td><td>1,5 giờ</td></tr>
<tr><td>Sau buổi học</td><td>gõ lại ví dụ không nhìn; làm bài tập ngay trên slide</td><td>2 giờ</td></tr>
<tr><td>Tuần có lab</td><td>làm lab sớm; rồi làm lại không nhìn</td><td>2 giờ</td></tr>
<tr><td>Cuối tuần</td><td>🧪 thực hành + quiz của chương; cập nhật sổ lỗi</td><td>1,5 giờ</td></tr>
</tbody>
</table>
<p class="meo">🧠 Bắt đầu Assignment ngay tuần được giao. Nó kéo dài khoảng 28 buổi chính là để lớn dần theo các chương: lớp thực thể sau Chương 3, kế thừa sau Chương 4, danh sách sau Chương 8, tệp sau Chương 9.</p>`),
    bi(`<h2>5. Preparing the PE (85 minutes) and the FE (60 minutes)</h2>
<h3>PE — what the real paper looks like</h3>
<p>From real papers transcribed in this site's Exam Room (19 PRO192 PE papers): software is <strong>NetBeans 8.2 or later and JDK 8</strong> on Windows; you download a given project, write your classes where the paper says (often the default package), and the given <code>Main</code> asks for input and prints <code>OUTPUT:</code> followed by your result. A typical paper has 4 questions for 10 marks: (1) a class with private fields, constructors and methods with formatting rules; (2) a subclass with an overridden method; (3) a class managing a <code>List</code> (search, count, sort); (4) implementing an interface. You submit, per question, a <strong>run</strong> folder with the built <code>.jar</code> and a <strong>src</strong> folder with the project.</p>
<p>A trap that costs marks silently: the expected output uses a dot for decimals, but on a PC set to Vietnamese, <code>String.format("%.2f", …)</code> follows the PC's locale. Measured for real:</p>
<pre><code class="language-java">// release: 8
// A PE trap measured for real: String.format follows the computer's LOCALE — on a Vietnamese Windows "%.2f" writes a comma
import java.util.Locale;

public class DinhDangSo {
    public static void main(String[] args) {
        double gpa = 1234.5;
        System.out.println("en-US       : " + String.format(Locale.US, "%.2f", gpa));
        System.out.println("vi-VN       : " + String.format(new Locale("vi", "VN"), "%.2f", gpa));
        System.out.println("vi-VN, %,.2f: " + String.format(new Locale("vi", "VN"), "%,.2f", gpa));
        System.out.println("safe choice : " + String.format(Locale.US, "%.2f", gpa) + "   (pass Locale.US when the expected output uses a dot)");
    }
}</code></pre>
<div class="out">en-US &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1234.50<br>
vi-VN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1234,50<br>
vi-VN, %,.2f: 1.234,50<br>
safe choice : 1234.50 &nbsp;&nbsp;(pass Locale.US when the expected output uses a dot)</div>
<p>The grader compares text, so <code>1234,50</code> is wrong when the paper expects <code>1234.50</code>. Pass <code>Locale.US</code> (or use the format the given code uses) whenever you format numbers.</p>
<h3>FE — what the real paper looks like</h3>
<p>About 50 multiple-choice questions in 60 minutes, shuffled. Many show 5–15 lines of code and ask what it prints or whether it compiles; the rest are definitions (the four pillars, overloading vs overriding, checked exceptions, List vs Set). This site's Exam Room has 36 real FE papers with explanations — do them after Chapter 8, timed.</p>`,
    `<h2>5. Chuẩn bị PE (85 phút) và FE (60 phút)</h2>
<h3>PE — đề thật trông thế nào</h3>
<p>Theo các đề thật đã chép vào Exam Room của web (19 đề PE PRO192): phần mềm là <strong>NetBeans 8.2 trở lên và JDK 8</strong> trên Windows; bạn tải project đề cho, viết lớp đúng chỗ đề ghi (thường là default package), và lớp <code>Main</code> có sẵn sẽ hỏi dữ liệu rồi in <code>OUTPUT:</code> kèm kết quả của bạn. Một đề điển hình có 4 câu, 10 điểm: (1) một lớp có trường private, constructor và phương thức kèm luật định dạng; (2) một lớp con ghi đè một phương thức; (3) một lớp quản lý <code>List</code> (tìm, đếm, sắp xếp); (4) cài đặt một interface. Mỗi câu bạn nộp thư mục <strong>run</strong> chứa file <code>.jar</code> đã build và thư mục <strong>src</strong> chứa project.</p>
<p>Một cái bẫy mất điểm âm thầm: output mong đợi dùng dấu chấm thập phân, nhưng trên máy cài tiếng Việt, <code>String.format("%.2f", …)</code> làm theo locale (thiết lập vùng) của máy. Đo thật:</p>
<pre><code class="language-java">// release: 8
// Một bẫy PE đo thật: String.format theo LOCALE của máy — trên Windows tiếng Việt "%.2f" viết dấu phẩy
import java.util.Locale;

public class DinhDangSo {
    public static void main(String[] args) {
        double gpa = 1234.5;
        System.out.println("en-US       : " + String.format(Locale.US, "%.2f", gpa));
        System.out.println("vi-VN       : " + String.format(new Locale("vi", "VN"), "%.2f", gpa));
        System.out.println("vi-VN, %,.2f: " + String.format(new Locale("vi", "VN"), "%,.2f", gpa));
        System.out.println("safe choice : " + String.format(Locale.US, "%.2f", gpa) + "   (pass Locale.US when the expected output uses a dot)");
    }
}</code></pre>
<div class="out">en-US &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1234.50<br>
vi-VN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1234,50<br>
vi-VN, %,.2f: 1.234,50<br>
safe choice : 1234.50 &nbsp;&nbsp;(pass Locale.US when the expected output uses a dot)</div>
<p>Máy chấm so sánh chữ, nên <code>1234,50</code> là sai khi đề chờ <code>1234.50</code>. Truyền <code>Locale.US</code> (hoặc dùng đúng cách định dạng mà code đề cho đang dùng) mỗi khi định dạng số.</p>
<h3>FE — đề thật trông thế nào</h3>
<p>Khoảng 50 câu trắc nghiệm trong 60 phút, bị xáo thứ tự. Nhiều câu cho 5–15 dòng code và hỏi in ra gì hay có biên dịch được không; phần còn lại là định nghĩa (bốn trụ cột, overloading khác overriding, checked exception, List khác Set). Exam Room của web có 36 đề FE thật kèm giải thích — làm chúng sau Chương 8, có bấm giờ.</p>`),
    bi(`<h2>6. Using AI the right way in this course</h2>
<ul>
<li><strong>Yes</strong>: ask it to explain an error message you have already read; ask "why does this print 7 and not 8?"; ask for three more exercises like the one you just finished.</li>
<li><strong>No</strong>: asking it to write the lab or the Assignment. The PE is offline, 85 minutes, JDK 8 — the only preparation that works is code you wrote yourself.</li>
<li><strong>Careful</strong>: AI often answers with modern Java (<code>var</code>, <code>List.of</code>, records). Check every suggestion against the Java 8 table in "Start here (1/2)".</li>
</ul>`,
    `<h2>6. Dùng AI cho đúng trong môn này</h2>
<ul>
<li><strong>Nên</strong>: nhờ nó giải thích một thông báo lỗi bạn đã tự đọc; hỏi "sao lại in ra 7 mà không phải 8?"; xin thêm ba bài tập giống bài bạn vừa làm xong.</li>
<li><strong>Không nên</strong>: nhờ nó viết bài lab hay Assignment. PE là thi offline, 85 phút, JDK 8 — cách chuẩn bị duy nhất có tác dụng là code do chính bạn viết.</li>
<li><strong>Cẩn thận</strong>: AI hay trả lời bằng Java hiện đại (<code>var</code>, <code>List.of</code>, record). Soát mọi gợi ý với bảng Java 8 ở bài "Bắt đầu tại đây (1/2)".</li>
</ul>`),
  ].join('\n'),
};

/* ───────── ⭐ Installing the environment — JDK 8 for the exam + JDK 21, NetBeans, Windows and macOS, the version errors seen for real ───────── */
const L_x_cai_moi_truong = {
  title: '⭐ Installing the environment — JDK 8 for the exam + JDK 21, NetBeans, Windows and macOS, the version errors seen for real|||⭐ Cài môi trường — JDK 8 cho phòng thi + JDK 21, NetBeans, Windows và macOS, các lỗi phiên bản xem tận mắt',
  slug: 'pro192-cai-moi-truong',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình, thay cho bộ slide cài đặt đã cũ: vì sao cần hai JDK (8 cho phòng thi, 21 LTS cho mọi thứ khác), cài trên Windows (Temurin 8 và 21, PATH, JAVA_HOME) và macOS (chip Apple: Zulu 8 + Temurin 21, java_home), cài NetBeans 31 ở nhà và nhận NetBeans 8.2 ở phòng lab, gắn JDK 8 vào project để biên dịch đúng như phòng thi, kiểm tra bằng lệnh thật, và các lỗi hay gặp — var, List.of, UnsupportedClassVersionError tạo ra thật trên JDK 8.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Installing the environment · added by this site</span>
<h2>Install once, check with two commands, and never be surprised by the exam room</h2>
<p class="lead">The school deck (lesson 0.A) gives four old links. This lesson gives the setup that works in October 2026 and matches the exam: <strong>two JDKs</strong> side by side — <strong>JDK 8</strong>, because the lab PCs and the PE run Java 8, and <strong>JDK 21</strong> (a long-term-support release), because modern NetBeans needs it and everything after PRO192 (PRJ301, Spring Boot) needs Java 17+ — plus <strong>NetBeans</strong> configured so your PRO192 projects compile as Java 8.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/aeb8c64765245a12664c20099f7f601b785b24d6.svg" alt="The target setup: NetBeans runs on JDK 21, your PRO192 projects are compiled and run with JDK 8, exactly like the lab PC" loading="lazy" /><p class="chu-thich">🧩 The target setup: NetBeans runs on JDK 21, your PRO192 projects are compiled and run with JDK 8, exactly like the lab PC</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Two JDKs on one laptop — JDK 8 for the exam room, JDK 21 for everything else
' NetBeans runs on one JDK but can compile projects with another
node "Your laptop" {
  component "NetBeans 31\\n(runs on JDK 21)" as NB
  rectangle "JDK 21 LTS\\n(Temurin)\\njava, javac 21" as J21 #ECFDF5
  rectangle "JDK 8\\n(Temurin 8u / Zulu 8)\\njava, javac 1.8" as J8 #FEF9C3
  folder "PRO192 projects\\n(Source/Binary format 1.8)" as P
}
node "Lab PC (exam)" {
  rectangle "JDK 8 + NetBeans 8.2 or later" as LAB #FEF9C3
}
NB ..&gt; J21 : runs on
NB --&gt; J8 : Java Platform\\nof the project
P --&gt; J8 : compiled and run with
P ..&gt; LAB : copy src → works the same
@enduml</code></pre></details>
<table>
<thead><tr><th>Piece</th><th>Version to install</th><th>Why</th></tr></thead>
<tbody>
<tr><td>JDK 8</td><td>Eclipse Temurin 8 (Windows, Intel Mac) or Azul Zulu 8 (Apple-chip Mac)</td><td>the exam JDK — test your code on it</td></tr>
<tr><td>JDK 21</td><td>Eclipse Temurin 21 (LTS)</td><td>runs NetBeans 31; used by PRJ301/Spring Boot later</td></tr>
<tr><td>NetBeans</td><td>31 at home (needs JDK 21+); the lab has 8.2 or later</td><td>the course's IDE; the PE paper says "NetBean 8.2 or later"</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · ⭐ Cài môi trường · phần web tự thêm</span>
<h2>Cài một lần, kiểm tra bằng hai lệnh, và không bao giờ bị phòng thi làm bất ngờ</h2>
<p class="lead">Bộ slide của trường (bài 0.A) cho bốn đường link cũ. Bài này cho bạn cách cài chạy được ở thời điểm tháng 10/2026 và khớp với phòng thi: <strong>hai JDK</strong> song song — <strong>JDK 8</strong>, vì máy phòng lab và bài PE chạy Java 8, và <strong>JDK 21</strong> (một bản hỗ trợ dài hạn — LTS), vì NetBeans mới cần nó và mọi thứ sau PRO192 (PRJ301, Spring Boot) cần Java 17+ — cộng với <strong>NetBeans</strong> được cấu hình để project PRO192 của bạn biên dịch theo Java 8.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/aeb8c64765245a12664c20099f7f601b785b24d6.svg" alt="Cách cài đích: NetBeans chạy trên JDK 21, project PRO192 được biên dịch và chạy bằng JDK 8, y như máy phòng lab" loading="lazy" /><p class="chu-thich">🧩 Cách cài đích: NetBeans chạy trên JDK 21, project PRO192 được biên dịch và chạy bằng JDK 8, y như máy phòng lab</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Two JDKs on one laptop — JDK 8 for the exam room, JDK 21 for everything else
' NetBeans chạy trên một JDK nhưng biên dịch project bằng JDK khác được
node "Your laptop" {
  component "NetBeans 31\\n(runs on JDK 21)" as NB
  rectangle "JDK 21 LTS\\n(Temurin)\\njava, javac 21" as J21 #ECFDF5
  rectangle "JDK 8\\n(Temurin 8u / Zulu 8)\\njava, javac 1.8" as J8 #FEF9C3
  folder "PRO192 projects\\n(Source/Binary format 1.8)" as P
}
node "Lab PC (exam)" {
  rectangle "JDK 8 + NetBeans 8.2 or later" as LAB #FEF9C3
}
NB ..&gt; J21 : runs on
NB --&gt; J8 : Java Platform\\nof the project
P --&gt; J8 : compiled and run with
P ..&gt; LAB : copy src → works the same
@enduml</code></pre></details>
<table>
<thead><tr><th>Thành phần</th><th>Bản nên cài</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>JDK 8</td><td>Eclipse Temurin 8 (Windows, Mac chip Intel) hoặc Azul Zulu 8 (Mac chip Apple)</td><td>JDK của phòng thi — thử code của bạn trên nó</td></tr>
<tr><td>JDK 21</td><td>Eclipse Temurin 21 (LTS)</td><td>chạy NetBeans 31; PRJ301/Spring Boot dùng về sau</td></tr>
<tr><td>NetBeans</td><td>bản 31 ở nhà (cần JDK 21+); phòng lab có 8.2 trở lên</td><td>IDE của môn; đề PE ghi "NetBean 8.2 or later"</td></tr>
</tbody>
</table>`),
    bi(`<h2>1. Windows (the lab's system)</h2>
<ol>
<li>Go to <strong>adoptium.net</strong> → "Other platforms and versions" → Windows x64, JDK, version <strong>8</strong> → download the <code>.msi</code> (in October 2026: <code>OpenJDK8U-jdk_x64_windows_hotspot_8u504b01.msi</code>). Do the same for version <strong>21</strong>. (Oracle's own JDK 8 download asks you to sign in with an Oracle account; Temurin is the same OpenJDK code, free, no sign-in.)</li>
<li>Install <strong>JDK 8 first, then JDK 21</strong>. In the installer's Custom Setup, for JDK 21 set <em>Add to PATH</em> and <em>Set JAVA_HOME variable</em> to "will be installed"; for JDK 8 you may leave PATH off — NetBeans finds it by folder, not by PATH.</li>
<li>Open a <strong>new</strong> Command Prompt (old windows keep the old PATH) and check:</li>
</ol>
<pre><code class="language-powershell">java -version
javac -version
where java
echo %JAVA_HOME%</code></pre>
<p>Both versions must answer, and <code>where java</code> shows which <code>java.exe</code> is first on the PATH. If you want to try the exam JDK from the command line, call it by its full path, for example <code>"C:\\Program Files\\Eclipse Adoptium\\jdk-8.0.504.1-hotspot\\bin\\java" -version</code> (the exact folder name changes with each update).</p>
<p>To edit PATH by hand on Windows 10/11: Settings → System → About → Advanced system settings → Environment Variables → (System variables) Path → Edit → New → paste the JDK's <code>bin</code> folder → move it to the top. Do <strong>not</strong> create a CLASSPATH variable (lesson 1.B, slide 10 shows why).</p>`,
    `<h2>1. Windows (hệ điều hành của phòng lab)</h2>
<ol>
<li>Vào <strong>adoptium.net</strong> → "Other platforms and versions" → Windows x64, JDK, version <strong>8</strong> → tải file <code>.msi</code> (tháng 10/2026: <code>OpenJDK8U-jdk_x64_windows_hotspot_8u504b01.msi</code>). Làm tương tự với version <strong>21</strong>. (Trang tải JDK 8 của chính Oracle bắt đăng nhập tài khoản Oracle; Temurin là cùng mã nguồn OpenJDK, miễn phí, không cần đăng nhập.)</li>
<li>Cài <strong>JDK 8 trước, JDK 21 sau</strong>. Ở bước Custom Setup của bộ cài, với JDK 21 chọn <em>Add to PATH</em> và <em>Set JAVA_HOME variable</em> thành "will be installed"; với JDK 8 có thể bỏ PATH — NetBeans tìm nó theo thư mục, không theo PATH.</li>
<li>Mở một Command Prompt <strong>mới</strong> (cửa sổ cũ vẫn giữ PATH cũ) rồi kiểm tra:</li>
</ol>
<pre><code class="language-powershell">java -version
javac -version
where java
echo %JAVA_HOME%</code></pre>
<p>Cả hai lệnh phiên bản phải trả lời, và <code>where java</code> cho biết <code>java.exe</code> nào đứng đầu PATH. Muốn thử JDK của phòng thi từ dòng lệnh thì gọi theo đường dẫn đầy đủ, ví dụ <code>"C:\\Program Files\\Eclipse Adoptium\\jdk-8.0.504.1-hotspot\\bin\\java" -version</code> (tên thư mục chính xác đổi theo từng bản cập nhật).</p>
<p>Sửa PATH bằng tay trên Windows 10/11: Settings → System → About → Advanced system settings → Environment Variables → (System variables) Path → Edit → New → dán thư mục <code>bin</code> của JDK → đưa nó lên đầu. <strong>Đừng</strong> tạo biến CLASSPATH (bài 1.B, slide 10 cho thấy vì sao).</p>`),
    bi(`<h2>2. macOS</h2>
<p>On an <strong>Apple-chip</strong> Mac (M1–M4), Temurin publishes JDK 8 only for Intel Macs, so use <strong>Azul Zulu 8</strong> (azul.com/downloads, macOS ARM 64-bit, JDK 8, <code>.dmg</code> — in October 2026 Zulu 8.0.504) and <strong>Temurin 21</strong> (adoptium.net, macOS aarch64 <code>.pkg</code>). On an Intel Mac, Temurin 8 and 21 both have <code>.pkg</code> installers. Then, in Terminal:</p>
<pre><code class="language-bash">/usr/libexec/java_home -V          # lists every installed JDK
java -version                      # the default one (the newest)
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)   # this Terminal only: switch to JDK 8
java -version</code></pre>
<p><code>/usr/libexec/java_home</code> is macOS's built-in JDK picker. Putting the <code>export</code> line in <code>~/.zshrc</code> would make JDK 8 the default everywhere — not recommended, since NetBeans 31 itself needs 21.</p>`,
    `<h2>2. macOS</h2>
<p>Trên Mac <strong>chip Apple</strong> (M1–M4), Temurin chỉ phát hành JDK 8 cho Mac chip Intel, nên dùng <strong>Azul Zulu 8</strong> (azul.com/downloads, macOS ARM 64-bit, JDK 8, file <code>.dmg</code> — tháng 10/2026 là Zulu 8.0.504) và <strong>Temurin 21</strong> (adoptium.net, macOS aarch64, file <code>.pkg</code>). Trên Mac chip Intel, Temurin 8 và 21 đều có bộ cài <code>.pkg</code>. Sau đó, trong Terminal:</p>
<pre><code class="language-bash">/usr/libexec/java_home -V          # liệt kê mọi JDK đã cài
java -version                      # JDK mặc định (bản mới nhất)
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)   # chỉ trong cửa sổ Terminal này: đổi sang JDK 8
java -version</code></pre>
<p><code>/usr/libexec/java_home</code> là công cụ chọn JDK có sẵn của macOS. Đưa dòng <code>export</code> vào <code>~/.zshrc</code> sẽ biến JDK 8 thành mặc định ở mọi nơi — không nên, vì chính NetBeans 31 cần JDK 21.</p>`),
    bi(`<h2>3. What "it works" looks like</h2>
<p>The two version commands, as printed by the JDKs used to build this site (your build numbers may be newer):</p>
<pre><code class="language-plaintext">&gt; java -version                                   (JDK 8 — Temurin)
openjdk version "1.8.0_504"
OpenJDK Runtime Environment (Temurin)(build 1.8.0_504-b01)
OpenJDK 64-Bit Server VM (Temurin)(build 25.504-b01, mixed mode)
&gt; javac -version
javac 1.8.0_504

&gt; java -version                                   (JDK 21)
openjdk version "21.0.9" 2025-10-21
&gt; javac -version
javac 21.0.9</code></pre>
<p class="meo">🧠 Java 8 still calls itself <strong>"1.8"</strong> (the old numbering); from Java 9 on, the version starts with the real number. In NetBeans and in FE questions, "JDK 1.8" and "Java 8" are the same thing.</p>`,
    `<h2>3. "Chạy rồi" trông như thế nào</h2>
<p>Hai lệnh phiên bản, đúng như các JDK dùng để dựng web này in ra (số bản dựng của bạn có thể mới hơn):</p>
<pre><code class="language-plaintext">&gt; java -version                                   (JDK 8 — Temurin)
openjdk version "1.8.0_504"
OpenJDK Runtime Environment (Temurin)(build 1.8.0_504-b01)
OpenJDK 64-Bit Server VM (Temurin)(build 25.504-b01, mixed mode)
&gt; javac -version
javac 1.8.0_504

&gt; java -version                                   (JDK 21)
openjdk version "21.0.9" 2025-10-21
&gt; javac -version
javac 21.0.9</code></pre>
<p class="meo">🧠 Java 8 vẫn tự gọi mình là <strong>"1.8"</strong> (kiểu đánh số cũ); từ Java 9 trở đi, phiên bản bắt đầu bằng con số thật. Trong NetBeans và trong câu FE, "JDK 1.8" và "Java 8" là một.</p>`),
    bi(`<h2>4. NetBeans — at home and in the lab</h2>
<p><strong>At home: NetBeans 31</strong> (released 10 August 2026; it runs on JDK 21, 25 or 26). From netbeans.apache.org → Download, pick one of the installer packages for Windows or macOS (published by Codelerity or the Friends of Apache NetBeans; they can bundle a Temurin JDK), or the platform-independent zip. Then teach it about JDK 8 once:</p>
<ol>
<li><strong>Tools → Java Platforms → Add Platform…</strong> → Java Standard Edition → select the JDK 8 folder → Finish. NetBeans now lists "JDK 1.8".</li>
<li>For every PRO192 project: right-click the project → <strong>Properties → Libraries → Java Platform: JDK 1.8</strong>, and <strong>Sources → Source/Binary Format: 1.8</strong> (or JDK 8).</li>
<li>New projects: <strong>File → New Project → Java with Ant → Java Application</strong> — the same project type as the lab's NetBeans 8.2, so a project opens in both.</li>
</ol>
<p><strong>In the lab: NetBeans 8.2 or later on JDK 8.</strong> The menus are the same (lesson 1.C walks through NetBeans 8.0.2 screenshots). NetBeans 8.2 itself only runs well on JDK 8 — which is one reason the lab still has it.</p>
<div class="callout">🧭 <strong>Go further — IntelliJ IDEA</strong>: many companies (and many Spring Boot tutorials) use IntelliJ IDEA Community Edition. It works for PRO192 too (File → Project Structure → SDK: 1.8, Language level: 8), but practise the PE in NetBeans — that is what the exam PC has.</div>`,
    `<h2>4. NetBeans — ở nhà và ở phòng lab</h2>
<p><strong>Ở nhà: NetBeans 31</strong> (ra ngày 10/08/2026; chạy trên JDK 21, 25 hoặc 26). Từ netbeans.apache.org → Download, chọn một bộ cài cho Windows hoặc macOS (do Codelerity hoặc Friends of Apache NetBeans phát hành; có bản kèm sẵn Temurin JDK), hoặc bản zip độc lập nền tảng. Rồi dạy nó biết JDK 8 một lần:</p>
<ol>
<li><strong>Tools → Java Platforms → Add Platform…</strong> → Java Standard Edition → chọn thư mục JDK 8 → Finish. NetBeans giờ liệt kê "JDK 1.8".</li>
<li>Với mỗi project PRO192: chuột phải project → <strong>Properties → Libraries → Java Platform: JDK 1.8</strong>, và <strong>Sources → Source/Binary Format: 1.8</strong> (hoặc JDK 8).</li>
<li>Project mới: <strong>File → New Project → Java with Ant → Java Application</strong> — cùng loại project với NetBeans 8.2 của phòng lab, nên project mở được ở cả hai nơi.</li>
</ol>
<p><strong>Ở phòng lab: NetBeans 8.2 trở lên trên JDK 8.</strong> Menu y như nhau (bài 1.C đi qua ảnh chụp NetBeans 8.0.2). Bản thân NetBeans 8.2 chỉ chạy ổn trên JDK 8 — đó là một lý do phòng lab vẫn giữ nó.</p>
<div class="callout">🧭 <strong>Đi tiếp — IntelliJ IDEA</strong>: nhiều công ty (và nhiều hướng dẫn Spring Boot) dùng IntelliJ IDEA Community Edition. Nó dùng cho PRO192 cũng được (File → Project Structure → SDK: 1.8, Language level: 8), nhưng hãy luyện PE trong NetBeans — máy phòng thi có thứ đó.</div>`),
    bi(`<h2>5. The version errors you WILL meet — produced for real on JDK 8</h2>
<p>If your project is set to JDK 21 at home and you take the code to the lab, three things go wrong. Here they are, run on a real JDK 8 so you recognise them in two seconds:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== 1. Java 10+ syntax (var) given to the JDK 8 compiler ==");
    viet(d, "Modern.java",
        "public class Modern {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        var name = \\"An\\";\\n" +
        "        System.out.println(name);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Modern.java");
    System.out.println("== 2. Java 9+ API (List.of, String.repeat) on JDK 8 ==");
    viet(d, "Modern.java",
        "import java.util.List;\\n" +
        "public class Modern {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List&lt;String&gt; names = List.of(\\"An\\", \\"Binh\\");\\n" +
        "        System.out.println(\\"-\\".repeat(10));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Modern.java");
    System.out.println("== 3. a .class built by JDK 17 (class file version 61) run on JDK 8 ==");
    viet(d, "Hi.java", "public class Hi { public static void main(String[] a) { System.out.println(\\"hi\\"); } }\\n");
    lenh(d, "javac", "Hi.java");
    sua(new File(d, "Hi.class"), 7, 61);   // bytes 6-7 hold the major version: 52 = Java 8, 61 = Java 17
    lenh(d, "java", "Hi");
}</code></pre>
<div class="out">== 1. Java 10+ syntax (var) given to the JDK 8 compiler ==<br>
&gt; javac Modern.java<br>
Modern.java:3: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var name = "An";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class var<br>
&nbsp;&nbsp;location: class Modern<br>
1 error<br>
(exit code 1)<br>
== 2. Java 9+ API (List.of, String.repeat) on JDK 8 ==<br>
&gt; javac Modern.java<br>
Modern.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;String&gt; names = List.of("An", "Binh");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of(String,String)<br>
&nbsp;&nbsp;location: interface List<br>
Modern.java:5: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println("-".repeat(10));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method repeat(int)<br>
&nbsp;&nbsp;location: class String<br>
2 errors<br>
(exit code 1)<br>
== 3. a .class built by JDK 17 (class file version 61) run on JDK 8 ==<br>
&gt; javac Hi.java<br>
&gt; java Hi<br>
Error: A JNI error has occurred, please check your installation and try again<br>
Exception in thread "main" java.lang.UnsupportedClassVersionError: Hi has been compiled by a more recent version of the Java Runtime (class file version 61.0), this version of the Java Runtime only recognizes class file versions up to 52.0<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)</div>
<table>
<thead><tr><th>Message</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>cannot find symbol … symbol: class var</code></td><td><code>var</code> exists only since Java 10; JDK 8 thinks <code>var</code> is a class name</td><td>write the type: <code>String name = "An";</code></td></tr>
<tr><td><code>cannot find symbol … method of(String,String) … interface List</code></td><td><code>List.of</code> is Java 9, <code>String.repeat</code> Java 11</td><td><code>Arrays.asList(...)</code> / a loop</td></tr>
<tr><td><code>UnsupportedClassVersionError … class file version 61.0 … only recognizes … up to 52.0</code></td><td>a <code>.class</code> built by JDK 17 (61) run on Java 8 (52)</td><td>rebuild with JDK 8 (or Source/Binary Format 1.8) — Clean and Build</td></tr>
</tbody>
</table>
<div class="pitfall">Exam-room trap: you copy only your <code>.java</code> files, so the third error cannot happen there — but the first two can, and in the PE a class that does not compile scores zero for that question. Setting Java Platform = JDK 1.8 at home (section 4) makes NetBeans underline <code>var</code> in red before you ever reach the lab.</div>`,
    `<h2>5. Các lỗi phiên bản bạn SẼ gặp — tạo ra thật trên JDK 8</h2>
<p>Nếu project của bạn ở nhà đặt JDK 21 rồi mang code lên phòng lab, có ba thứ hỏng. Chúng đây, chạy trên JDK 8 thật để bạn nhận ra trong hai giây:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== 1. Java 10+ syntax (var) given to the JDK 8 compiler ==");
    viet(d, "Modern.java",
        "public class Modern {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        var name = \\"An\\";\\n" +
        "        System.out.println(name);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Modern.java");
    System.out.println("== 2. Java 9+ API (List.of, String.repeat) on JDK 8 ==");
    viet(d, "Modern.java",
        "import java.util.List;\\n" +
        "public class Modern {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List&lt;String&gt; names = List.of(\\"An\\", \\"Binh\\");\\n" +
        "        System.out.println(\\"-\\".repeat(10));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Modern.java");
    System.out.println("== 3. a .class built by JDK 17 (class file version 61) run on JDK 8 ==");
    viet(d, "Hi.java", "public class Hi { public static void main(String[] a) { System.out.println(\\"hi\\"); } }\\n");
    lenh(d, "javac", "Hi.java");
    sua(new File(d, "Hi.class"), 7, 61);   // byte 6-7 chứa major version: 52 = Java 8, 61 = Java 17
    lenh(d, "java", "Hi");
}</code></pre>
<div class="out">== 1. Java 10+ syntax (var) given to the JDK 8 compiler ==<br>
&gt; javac Modern.java<br>
Modern.java:3: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var name = "An";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class var<br>
&nbsp;&nbsp;location: class Modern<br>
1 error<br>
(exit code 1)<br>
== 2. Java 9+ API (List.of, String.repeat) on JDK 8 ==<br>
&gt; javac Modern.java<br>
Modern.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;String&gt; names = List.of("An", "Binh");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of(String,String)<br>
&nbsp;&nbsp;location: interface List<br>
Modern.java:5: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println("-".repeat(10));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method repeat(int)<br>
&nbsp;&nbsp;location: class String<br>
2 errors<br>
(exit code 1)<br>
== 3. a .class built by JDK 17 (class file version 61) run on JDK 8 ==<br>
&gt; javac Hi.java<br>
&gt; java Hi<br>
Error: A JNI error has occurred, please check your installation and try again<br>
Exception in thread "main" java.lang.UnsupportedClassVersionError: Hi has been compiled by a more recent version of the Java Runtime (class file version 61.0), this version of the Java Runtime only recognizes class file versions up to 52.0<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)</div>
<table>
<thead><tr><th>Thông báo</th><th>Nguyên nhân</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><code>cannot find symbol … symbol: class var</code></td><td><code>var</code> chỉ có từ Java 10; JDK 8 tưởng <code>var</code> là tên một lớp</td><td>viết rõ kiểu: <code>String name = "An";</code></td></tr>
<tr><td><code>cannot find symbol … method of(String,String) … interface List</code></td><td><code>List.of</code> là Java 9, <code>String.repeat</code> là Java 11</td><td><code>Arrays.asList(...)</code> / một vòng lặp</td></tr>
<tr><td><code>UnsupportedClassVersionError … class file version 61.0 … only recognizes … up to 52.0</code></td><td>file <code>.class</code> dựng bằng JDK 17 (61) đem chạy trên Java 8 (52)</td><td>dựng lại bằng JDK 8 (hoặc Source/Binary Format 1.8) — Clean and Build</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy phòng thi: bạn chỉ chép các file <code>.java</code>, nên lỗi thứ ba không xảy ra ở đó — nhưng hai lỗi đầu thì có, và trong PE một lớp không biên dịch được là câu đó 0 điểm. Đặt Java Platform = JDK 1.8 ở nhà (mục 4) giúp NetBeans gạch đỏ <code>var</code> trước khi bạn lên tới phòng lab.</div>`),
    bi(`<h2>6. The other common setup errors</h2>
<table>
<thead><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>'javac' is not recognized as an internal or external command</code></td><td>the JDK's <code>bin</code> is not on PATH (or you installed only a JRE)</td><td>add <code>…\\bin</code> to PATH, open a NEW Command Prompt (lesson 1.B slide 10)</td></tr>
<tr><td><code>java -version</code> works, <code>javac</code> does not</td><td>an old Oracle installer put only <code>java.exe</code> in a shortcut folder on the PATH</td><td>put the real JDK <code>bin</code> first on PATH</td></tr>
<tr><td>NetBeans says it "cannot find java.exe in specified jdkhome"</td><td>the JDK NetBeans was installed with has been removed</td><td>edit <code>netbeans_jdkhome</code> in <code>&lt;NetBeans folder&gt;/etc/netbeans.conf</code> to an existing JDK 21</td></tr>
<tr><td>NetBeans 31 does not start on a PC with only JDK 8</td><td>NetBeans 31 needs JDK 21+ to run</td><td>install JDK 21, or use the installer package that bundles a JDK</td></tr>
<tr><td><code>Error: Could not find or load main class …</code></td><td>wrong class name/case, or wrong <code>-cp</code></td><td>lesson 1.C, slides 19 and 24</td></tr>
<tr><td>Vietnamese letters show as <code>?</code> or garbage in the Windows console</td><td>the console's code page is not UTF-8</td><td>run the program inside NetBeans; in exam programs print without Vietnamese accents</td></tr>
</tbody>
</table>
<p>Next: <strong>⭐ First hands-on session</strong> — your first real class, objects, a list and keyboard input, then the jar the PE asks for.</p>`,
    `<h2>6. Các lỗi cài đặt hay gặp khác</h2>
<table>
<thead><tr><th>Triệu chứng</th><th>Nguyên nhân</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><code>'javac' is not recognized as an internal or external command</code></td><td>thư mục <code>bin</code> của JDK chưa có trong PATH (hoặc chỉ cài JRE)</td><td>thêm <code>…\\bin</code> vào PATH, mở Command Prompt MỚI (bài 1.B slide 10)</td></tr>
<tr><td><code>java -version</code> chạy, <code>javac</code> thì không</td><td>bộ cài Oracle cũ chỉ đặt <code>java.exe</code> vào một thư mục lối tắt trong PATH</td><td>đưa thư mục <code>bin</code> thật của JDK lên đầu PATH</td></tr>
<tr><td>NetBeans báo "cannot find java.exe in specified jdkhome"</td><td>JDK mà NetBeans được cài cùng đã bị gỡ</td><td>sửa <code>netbeans_jdkhome</code> trong <code>&lt;thư mục NetBeans&gt;/etc/netbeans.conf</code> thành một JDK 21 đang có</td></tr>
<tr><td>NetBeans 31 không khởi động trên máy chỉ có JDK 8</td><td>NetBeans 31 cần JDK 21+ để chạy</td><td>cài JDK 21, hoặc dùng bộ cài có kèm sẵn JDK</td></tr>
<tr><td><code>Error: Could not find or load main class …</code></td><td>sai tên lớp/chữ hoa thường, hoặc sai <code>-cp</code></td><td>bài 1.C, slide 19 và 24</td></tr>
<tr><td>Chữ tiếng Việt hiện thành <code>?</code> hay ký tự lạ trong console Windows</td><td>trang mã (code page) của console không phải UTF-8</td><td>chạy chương trình trong NetBeans; trong bài thi in chữ không dấu</td></tr>
</tbody>
</table>
<p>Tiếp theo: <strong>⭐ Buổi thực hành đầu tiên</strong> — lớp thật đầu tiên của bạn, các đối tượng, một danh sách và nhập từ bàn phím, rồi file jar mà đề PE đòi.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ First hands-on session — your first class in NetBeans: Student objects, a list, keyboard input, a PE-style jar ───────── */
const L_x_buoi_dau_tien = {
  title: '⭐ First hands-on session — your first class in NetBeans: Student objects, a list, keyboard input, a PE-style jar|||⭐ Buổi thực hành đầu tiên — lớp đầu tiên trong NetBeans: đối tượng Student, danh sách, nhập bàn phím, file jar kiểu PE',
  slug: 'pro192-buoi-dau-tien',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình, làm theo từng bước: tạo project NetBeans biên dịch theo Java 8, viết lớp Student (trường private, hai constructor, getter/setter có kiểm tra dữ liệu, toString có định dạng), chương trình main nhập danh sách sinh viên bằng Scanner, tìm người điểm cao nhất và tìm theo mã — chạy thật với dữ liệu nhập thật; đóng file jar và chạy bằng java -jar đúng như máy chấm PE; ba bài tập nhỏ có lời giải chạy thật (xếp loại, thống kê, bẫy nextInt).',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ First hands-on session · added by this site</span>
<h2>From an empty folder to a class, three objects and a runnable jar — in about an hour</h2>
<p class="lead">Lesson 1.C runs Hello World. This lesson builds the thing every PE question and every LAB211 exercise is made of: <strong>one entity class</strong> (fields + constructors + getters/setters + <code>toString</code>) and a <strong>main</strong> that creates objects from keyboard input, keeps them in a list and searches them. You do not need to understand every keyword yet — Chapters 2–3 explain them — but you will have typed and run the whole shape once.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/773b1b8fb12f7dfac7f535e357a64b1af3feabf3.svg" alt="What you will write: the Student class, and the main class that creates and uses Student objects" loading="lazy" /><p class="chu-thich">🧩 What you will write: the Student class, and the main class that creates and uses Student objects</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title First session — the two classes you write, and how main uses them
' The same shape as a PE question: one entity class + a main that drives it
class Student {
  - id : String
  - name : String
  - gpa : double
  --
  + Student()
  + Student(id : String, name : String, gpa : double)
  + getId() : String
  + getName() : String
  + getGpa() : double
  + setId(id : String) : void
  + setName(name : String) : void
  + setGpa(gpa : double) : void
  + toString() : String
}
class QuanLySinhVien {
  + {static} main(args : String[]) : void
  ~ {static} ask(sc : Scanner, prompt : String) : String
}
class "ArrayList&lt;Student&gt;" as AL
QuanLySinhVien ..&gt; Student : creates n objects
QuanLySinhVien ..&gt; AL : keeps them in
AL o-- "0..*" Student
@enduml</code></pre></details>
<p>Every program on this page was compiled with <code>--release 8</code> and run on a real JDK 8 as well, so all of it is valid in the exam room.</p>`,
    `<span class="eyebrow">Mục 0 · ⭐ Buổi thực hành đầu tiên · phần web tự thêm</span>
<h2>Từ một thư mục trống tới một lớp, ba đối tượng và một file jar chạy được — trong khoảng một giờ</h2>
<p class="lead">Bài 1.C chạy Hello World. Bài này dựng thứ mà mọi câu PE và mọi bài LAB211 được làm nên: <strong>một lớp thực thể (entity)</strong> (trường + constructor + getter/setter + <code>toString</code>) và một <strong>main</strong> tạo đối tượng từ dữ liệu nhập bàn phím, giữ chúng trong danh sách và tìm kiếm. Chưa cần hiểu mọi từ khoá — Chương 2–3 sẽ giải thích — nhưng bạn sẽ gõ và chạy trọn hình dạng đó một lần.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/773b1b8fb12f7dfac7f535e357a64b1af3feabf3.svg" alt="Thứ bạn sẽ viết: lớp Student, và lớp main tạo và dùng các đối tượng Student" loading="lazy" /><p class="chu-thich">🧩 Thứ bạn sẽ viết: lớp Student, và lớp main tạo và dùng các đối tượng Student</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title First session — the two classes you write, and how main uses them
' Đúng hình dạng một câu PE: một lớp thực thể + một main điều khiển nó
class Student {
  - id : String
  - name : String
  - gpa : double
  --
  + Student()
  + Student(id : String, name : String, gpa : double)
  + getId() : String
  + getName() : String
  + getGpa() : double
  + setId(id : String) : void
  + setName(name : String) : void
  + setGpa(gpa : double) : void
  + toString() : String
}
class QuanLySinhVien {
  + {static} main(args : String[]) : void
  ~ {static} ask(sc : Scanner, prompt : String) : String
}
class "ArrayList&lt;Student&gt;" as AL
QuanLySinhVien ..&gt; Student : creates n objects
QuanLySinhVien ..&gt; AL : keeps them in
AL o-- "0..*" Student
@enduml</code></pre></details>
<p>Mọi chương trình trên trang này đều được biên dịch thêm với <code>--release 8</code> và chạy trên JDK 8 thật, nên tất cả hợp lệ trong phòng thi.</p>`),
    bi(`<h2>Step 1 — create the project</h2>
<ol>
<li>File → New Project → <strong>Java with Ant → Java Application</strong> (NetBeans 8.2: Java → Java Application) → Next.</li>
<li>Project Name <code>FirstOOP</code>; <strong>untick</strong> "Create Main Class" (we write our own) → Finish.</li>
<li>Right-click FirstOOP → Properties → Libraries → Java Platform <strong>JDK 1.8</strong> (see "Installing the environment"); Sources → Source/Binary Format <strong>1.8</strong>.</li>
<li>Right-click Source Packages → New → Java Class → name <code>Student</code>, package empty (default package, as in most PE papers) → Finish. Do the same for <code>QuanLySinhVien</code>.</li>
</ol>
<p class="meo">🧠 On this page both classes sit in one file so the generator can run them together; in NetBeans make <strong>two files</strong> <code>Student.java</code> and <code>QuanLySinhVien.java</code> and write <code>public class Student</code>.</p>`,
    `<h2>Bước 1 — tạo project</h2>
<ol>
<li>File → New Project → <strong>Java with Ant → Java Application</strong> (NetBeans 8.2: Java → Java Application) → Next.</li>
<li>Project Name <code>FirstOOP</code>; <strong>bỏ tích</strong> "Create Main Class" (ta tự viết) → Finish.</li>
<li>Chuột phải FirstOOP → Properties → Libraries → Java Platform <strong>JDK 1.8</strong> (xem bài "Cài môi trường"); Sources → Source/Binary Format <strong>1.8</strong>.</li>
<li>Chuột phải Source Packages → New → Java Class → tên <code>Student</code>, để trống package (default package, như phần lớn đề PE) → Finish. Làm tương tự với <code>QuanLySinhVien</code>.</li>
</ol>
<p class="meo">🧠 Trên trang này hai lớp nằm chung một file để bộ sinh bài chạy được cả hai; trong NetBeans hãy tạo <strong>hai file</strong> <code>Student.java</code> và <code>QuanLySinhVien.java</code> và viết <code>public class Student</code>.</p>`),
    bi(`<h2>Step 2 — the entity class: <code>Student</code></h2>
<p>Type the three fields, then let NetBeans write the boring parts: put the cursor inside the class, press <strong>Alt+Insert</strong> (Code → Insert Code) → Constructor (tick all three fields), then Getter and Setter, then <code>toString()</code>. Finally edit the setters to <em>check</em> their input:</p>
<pre class="trich"><code class="language-java">class Student {
    private String id;
    private String name;
    private double gpa;

    public Student() {                                    // default constructor: a safe empty object
        this("", "", 0);
    }

    public Student(String id, String name, double gpa) {  // full constructor: goes through the setters, so the rules apply here too
        setId(id);
        setName(name);
        setGpa(gpa);
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }

    public void setId(String id) { this.id = id.trim().toUpperCase(); }
    public void setName(String name) { this.name = name.trim(); }
    public void setGpa(double gpa) {
        if (gpa &gt;= 0 &amp;&amp; gpa &lt;= 10) this.gpa = gpa;       // reject impossible values
    }

    @Override
    public String toString() {                            // Locale.US: always a dot, whatever the PC's language
        return String.format(Locale.US, "%-9s| %-18s| %5.2f", id, name, gpa);
    }
}</code></pre>
<table>
<thead><tr><th>Part</th><th>Why it is written this way</th></tr></thead>
<tbody>
<tr><td><code>private</code> fields</td><td>nobody outside can put an impossible GPA in — Chapter 3</td></tr>
<tr><td>two constructors</td><td><code>new Student()</code> gives a safe empty object; the full one fills everything — Chapter 2</td></tr>
<tr><td>full constructor calls the setters</td><td>the validation rules live in ONE place and also apply when objects are created</td></tr>
<tr><td><code>setGpa</code> ignores values outside 0–10</td><td>the object protects its own integrity (lesson 1.A, slide 9)</td></tr>
<tr><td><code>toString()</code> with <code>Locale.US</code></td><td><code>println(s)</code> prints a neat line, with a dot as decimal separator on any PC</td></tr>
</tbody>
</table>`,
    `<h2>Bước 2 — lớp thực thể: <code>Student</code></h2>
<p>Gõ ba trường, rồi để NetBeans viết phần nhàm chán: đặt con trỏ trong lớp, bấm <strong>Alt+Insert</strong> (Code → Insert Code) → Constructor (tích cả ba trường), rồi Getter and Setter, rồi <code>toString()</code>. Cuối cùng sửa các setter để chúng <em>kiểm tra</em> dữ liệu vào:</p>
<pre class="trich"><code class="language-java">class Student {
    private String id;
    private String name;
    private double gpa;

    public Student() {                                    // constructor mặc định: một đối tượng rỗng an toàn
        this("", "", 0);
    }

    public Student(String id, String name, double gpa) {  // constructor đầy đủ: đi qua setter, nên luật cũng áp dụng ở đây
        setId(id);
        setName(name);
        setGpa(gpa);
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }

    public void setId(String id) { this.id = id.trim().toUpperCase(); }
    public void setName(String name) { this.name = name.trim(); }
    public void setGpa(double gpa) {
        if (gpa &gt;= 0 &amp;&amp; gpa &lt;= 10) this.gpa = gpa;       // từ chối giá trị vô lý
    }

    @Override
    public String toString() {                            // Locale.US: luôn dấu chấm, dù máy cài ngôn ngữ gì
        return String.format(Locale.US, "%-9s| %-18s| %5.2f", id, name, gpa);
    }
}</code></pre>
<table>
<thead><tr><th>Phần</th><th>Vì sao viết như vậy</th></tr></thead>
<tbody>
<tr><td>trường <code>private</code></td><td>không ai bên ngoài nhét được GPA vô lý vào — Chương 3</td></tr>
<tr><td>hai constructor</td><td><code>new Student()</code> cho một đối tượng rỗng an toàn; constructor đầy đủ điền mọi thứ — Chương 2</td></tr>
<tr><td>constructor đầy đủ gọi setter</td><td>luật kiểm tra nằm ở MỘT chỗ và áp dụng cả lúc tạo đối tượng</td></tr>
<tr><td><code>setGpa</code> bỏ qua giá trị ngoài 0–10</td><td>đối tượng tự bảo vệ tính toàn vẹn của nó (bài 1.A, slide 9)</td></tr>
<tr><td><code>toString()</code> với <code>Locale.US</code></td><td><code>println(s)</code> in một dòng gọn, dấu chấm thập phân trên mọi máy</td></tr>
</tbody>
</table>`),
    bi(`<h2>Step 3 — the main class: create, store, search</h2>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = Integer.parseInt(ask(sc, "How many students? ").trim());
    ArrayList&lt;Student&gt; list = new ArrayList&lt;&gt;();
    for (int i = 1; i &lt;= n; i++) {
        String id = ask(sc, "Student " + i + " - id: ");
        String name = ask(sc, "Student " + i + " - name: ");
        double gpa = Double.parseDouble(ask(sc, "Student " + i + " - gpa: ").trim());
        list.add(new Student(id, name, gpa));             // a NEW object each time
    }

    System.out.println("ID       | Name              |   GPA");
    for (Student s : list) System.out.println(s);         // println calls toString() for us

    Student best = list.get(0);
    for (Student s : list) if (s.getGpa() &gt; best.getGpa()) best = s;
    System.out.println("Best: " + best.getName() + " (" + best.getGpa() + ")");

    String key = ask(sc, "Search id: ").trim().toUpperCase();
    Student found = null;
    for (Student s : list) if (s.getId().equals(key)) found = s;   // equals, never == for Strings
    System.out.println(found == null ? "Not found" : "Found: " + found);
}

// Print the prompt, read one line, and echo it — so this page shows exactly what the console shows
static String ask(Scanner sc, String prompt) {
    System.out.print(prompt);
    String line = sc.nextLine();
    System.out.println(line);
    return line;
}</code></pre>
<p>Three habits from the PE are already here: read <strong>whole lines</strong> with <code>nextLine()</code> and convert with <code>Integer.parseInt</code>/<code>Double.parseDouble</code> (exercise 3 shows why); compare Strings with <code>equals</code>, never <code>==</code>; and create a <strong>new</strong> object in each loop turn.</p>
<h2>Step 4 — run it (F6) with this keyboard input</h2>
<pre><code class="language-plaintext">3
he190001
Nguyen Van An
7.5
HE190002
  Tran Thi Binh
9.25
he190003
Le Van Cuong
12
HE190002</code></pre>
<div class="out">How many students? 3<br>
Student 1 - id: he190001<br>
Student 1 - name: Nguyen Van An<br>
Student 1 - gpa: 7.5<br>
Student 2 - id: HE190002<br>
Student 2 - name: &nbsp;&nbsp;Tran Thi Binh<br>
Student 2 - gpa: 9.25<br>
Student 3 - id: he190003<br>
Student 3 - name: Le Van Cuong<br>
Student 3 - gpa: 12<br>
ID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;GPA<br>
HE190001 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;7.50<br>
HE190002 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.25<br>
HE190003 | Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;0.00<br>
Best: Tran Thi Binh (9.25)<br>
Search id: HE190002<br>
Found: HE190002 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.25</div>
<p>Check each rule in the real output: <code>he190001</code> became <code>HE190001</code> (<code>setId</code> upper-cases), the spaces around "Tran Thi Binh" are gone (<code>setName</code> trims), and Cuong's GPA of 12 was <strong>rejected</strong> — he shows <code>0.00</code>. That last line is encapsulation doing its job; Chapter 6 will make it louder with an exception.</p>`,
    `<h2>Bước 3 — lớp main: tạo, cất, tìm</h2>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = Integer.parseInt(ask(sc, "How many students? ").trim());
    ArrayList&lt;Student&gt; list = new ArrayList&lt;&gt;();
    for (int i = 1; i &lt;= n; i++) {
        String id = ask(sc, "Student " + i + " - id: ");
        String name = ask(sc, "Student " + i + " - name: ");
        double gpa = Double.parseDouble(ask(sc, "Student " + i + " - gpa: ").trim());
        list.add(new Student(id, name, gpa));             // mỗi vòng một đối tượng MỚI
    }

    System.out.println("ID       | Name              |   GPA");
    for (Student s : list) System.out.println(s);         // println tự gọi toString()

    Student best = list.get(0);
    for (Student s : list) if (s.getGpa() &gt; best.getGpa()) best = s;
    System.out.println("Best: " + best.getName() + " (" + best.getGpa() + ")");

    String key = ask(sc, "Search id: ").trim().toUpperCase();
    Student found = null;
    for (Student s : list) if (s.getId().equals(key)) found = s;   // equals, không bao giờ == với String
    System.out.println(found == null ? "Not found" : "Found: " + found);
}

// In lời nhắc, đọc một dòng, rồi in lại — để trang này hiện y như console
static String ask(Scanner sc, String prompt) {
    System.out.print(prompt);
    String line = sc.nextLine();
    System.out.println(line);
    return line;
}</code></pre>
<p>Ba thói quen của bài PE đã có sẵn ở đây: đọc <strong>cả dòng</strong> bằng <code>nextLine()</code> rồi chuyển đổi bằng <code>Integer.parseInt</code>/<code>Double.parseDouble</code> (bài tập 3 cho thấy vì sao); so sánh String bằng <code>equals</code>, không bao giờ bằng <code>==</code>; và mỗi vòng lặp tạo một đối tượng <strong>mới</strong>.</p>
<h2>Bước 4 — chạy (F6) với dữ liệu bàn phím này</h2>
<pre><code class="language-plaintext">3
he190001
Nguyen Van An
7.5
HE190002
  Tran Thi Binh
9.25
he190003
Le Van Cuong
12
HE190002</code></pre>
<div class="out">How many students? 3<br>
Student 1 - id: he190001<br>
Student 1 - name: Nguyen Van An<br>
Student 1 - gpa: 7.5<br>
Student 2 - id: HE190002<br>
Student 2 - name: &nbsp;&nbsp;Tran Thi Binh<br>
Student 2 - gpa: 9.25<br>
Student 3 - id: he190003<br>
Student 3 - name: Le Van Cuong<br>
Student 3 - gpa: 12<br>
ID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;GPA<br>
HE190001 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;7.50<br>
HE190002 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.25<br>
HE190003 | Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;0.00<br>
Best: Tran Thi Binh (9.25)<br>
Search id: HE190002<br>
Found: HE190002 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.25</div>
<p>Soát từng luật trong output thật: <code>he190001</code> thành <code>HE190001</code> (<code>setId</code> viết hoa), dấu cách quanh "Tran Thi Binh" biến mất (<code>setName</code> cắt khoảng trắng), còn GPA 12 của Cuong bị <strong>từ chối</strong> — anh ấy hiện <code>0.00</code>. Dòng cuối đó là tính đóng gói đang làm việc; Chương 6 sẽ cho nó "lên tiếng" bằng một ngoại lệ.</p>`),
    bi(`<h2>Step 5 — build the jar, run it like the grader</h2>
<p>The PE asks you to submit, per question, a <strong>run</strong> folder with the built <code>.jar</code>. In NetBeans that is <strong>Clean and Build</strong> (Shift+F11) → <code>dist/FirstOOP.jar</code>. Here is the same thing done by hand on a real JDK 8 — a two-class project with a <code>Main</code> that prints <code>OUTPUT:</code> like the exam's given code:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("FirstOOP");
    viet(new File(prj, "src"), "Student.java",
        "public class Student {\\n" +
        "    private String name;\\n" +
        "    private double gpa;\\n" +
        "    public Student(String name, double gpa) { this.name = name; this.gpa = gpa; }\\n" +
        "    @Override public String toString() { return name + \\" - \\" + gpa; }\\n" +
        "}\\n");
    viet(new File(prj, "src"), "Main.java",
        "import java.util.Scanner;\\n" +
        "public class Main {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Scanner sc = new Scanner(System.in);\\n" +
        "        String name = sc.nextLine();\\n" +
        "        double gpa = Double.parseDouble(sc.nextLine());\\n" +
        "        System.out.println(\\"OUTPUT:\\");\\n" +
        "        System.out.println(new Student(name, gpa));\\n" +
        "    }\\n" +
        "}\\n");
    new File(prj, "dist").mkdirs();
    new File(prj, "build/classes").mkdirs();     // javac 8 does NOT create the -d folder (javac 9+ does) — NetBeans creates it for you
    lenh(prj, "javac", "-d", "build/classes", "src/Student.java", "src/Main.java");   // Build: compile every file
    lenh(prj, "jar", "cfe", "dist/FirstOOP.jar", "Main", "-C", "build/classes", "."); // pack + record the main class
    lenh(prj, "jar", "tf", "dist/FirstOOP.jar");                                     // what is inside
    lenhVao(prj, "Tran Thi Binh\\n9.25\\n", "java", "-jar", "dist/FirstOOP.jar");      // run it like the grader does
}</code></pre>
<div class="out">&gt; javac -d build/classes src/Student.java src/Main.java<br>
&gt; jar cfe dist/FirstOOP.jar Main -C build/classes .<br>
&gt; jar tf dist/FirstOOP.jar<br>
META-INF/<br>
META-INF/MANIFEST.MF<br>
Main.class<br>
Student.class<br>
&gt; java -jar dist/FirstOOP.jar &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: Tran Thi Binh / 9.25)<br>
OUTPUT:<br>
Tran Thi Binh - 9.25</div>
<p><code>jar cfe</code> = create a file, with an <strong>e</strong>ntry point (<code>Main</code>) written into <code>META-INF/MANIFEST.MF</code>; that is why <code>java -jar</code> knows which <code>main</code> to start. A real detail measured here: JDK 8's <code>javac -d</code> does not create the output folder (JDK 9+ does) — NetBeans creates it for you.</p>
<div class="pitfall">PE trap: a jar built <em>before</em> your last edit contains the old code. Always Clean and Build right before copying <code>dist/*.jar</code> into the run folder, then run it once with <code>java -jar</code> to be sure.</div>`,
    `<h2>Bước 5 — đóng file jar, chạy như máy chấm</h2>
<p>Đề PE bắt nộp, cho mỗi câu, một thư mục <strong>run</strong> chứa file <code>.jar</code> đã build. Trong NetBeans đó là <strong>Clean and Build</strong> (Shift+F11) → <code>dist/FirstOOP.jar</code>. Đây là cùng việc đó làm bằng tay trên JDK 8 thật — project hai lớp với một <code>Main</code> in <code>OUTPUT:</code> giống code đề cho:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("FirstOOP");
    viet(new File(prj, "src"), "Student.java",
        "public class Student {\\n" +
        "    private String name;\\n" +
        "    private double gpa;\\n" +
        "    public Student(String name, double gpa) { this.name = name; this.gpa = gpa; }\\n" +
        "    @Override public String toString() { return name + \\" - \\" + gpa; }\\n" +
        "}\\n");
    viet(new File(prj, "src"), "Main.java",
        "import java.util.Scanner;\\n" +
        "public class Main {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Scanner sc = new Scanner(System.in);\\n" +
        "        String name = sc.nextLine();\\n" +
        "        double gpa = Double.parseDouble(sc.nextLine());\\n" +
        "        System.out.println(\\"OUTPUT:\\");\\n" +
        "        System.out.println(new Student(name, gpa));\\n" +
        "    }\\n" +
        "}\\n");
    new File(prj, "dist").mkdirs();
    new File(prj, "build/classes").mkdirs();     // javac 8 KHÔNG tự tạo thư mục -d (javac 9+ thì có) — NetBeans tạo sẵn cho bạn
    lenh(prj, "javac", "-d", "build/classes", "src/Student.java", "src/Main.java");   // Build: biên dịch mọi file
    lenh(prj, "jar", "cfe", "dist/FirstOOP.jar", "Main", "-C", "build/classes", "."); // đóng gói + ghi lớp main
    lenh(prj, "jar", "tf", "dist/FirstOOP.jar");                                     // bên trong có gì
    lenhVao(prj, "Tran Thi Binh\\n9.25\\n", "java", "-jar", "dist/FirstOOP.jar");      // chạy như máy chấm chạy
}</code></pre>
<div class="out">&gt; javac -d build/classes src/Student.java src/Main.java<br>
&gt; jar cfe dist/FirstOOP.jar Main -C build/classes .<br>
&gt; jar tf dist/FirstOOP.jar<br>
META-INF/<br>
META-INF/MANIFEST.MF<br>
Main.class<br>
Student.class<br>
&gt; java -jar dist/FirstOOP.jar &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: Tran Thi Binh / 9.25)<br>
OUTPUT:<br>
Tran Thi Binh - 9.25</div>
<p><code>jar cfe</code> = tạo (c) một file (f), có điểm vào — <strong>e</strong>ntry point (<code>Main</code>) ghi vào <code>META-INF/MANIFEST.MF</code>; nhờ vậy <code>java -jar</code> biết khởi động <code>main</code> nào. Một chi tiết thật đo được ở đây: <code>javac -d</code> của JDK 8 không tự tạo thư mục đích (JDK 9+ thì có) — NetBeans tạo sẵn cho bạn.</p>
<div class="pitfall">Bẫy PE: file jar build <em>trước</em> lần sửa cuối cùng vẫn chứa code cũ. Luôn Clean and Build ngay trước khi chép <code>dist/*.jar</code> vào thư mục run, rồi chạy thử một lần bằng <code>java -jar</code> cho chắc.</div>`),
    bi(`<h2>Three small exercises (10–15 minutes each)</h2>
<h3>🧪 Exercise 1 — rank a student</h3>
<p>Add <code>getRank()</code> to <code>Student</code>: Excellent (≥ 9), Very good (≥ 8), Good (≥ 6.5), Average (≥ 5), Weak. Test it on the <strong>edges</strong> of every rule.</p>
<details><summary>Solution (run for real)</summary>
<pre class="trich"><code class="language-java">public String getRank() {
    if (gpa &gt;= 9) return "Excellent";
    if (gpa &gt;= 8) return "Very good";
    if (gpa &gt;= 6.5) return "Good";
    if (gpa &gt;= 5) return "Average";
    return "Weak";
}</code></pre>
<div class="out">HE900 9.0 -&gt; Excellent<br>
HE899 8.99 -&gt; Very good<br>
HE800 8.0 -&gt; Very good<br>
HE650 6.5 -&gt; Good<br>
HE649 6.49 -&gt; Average<br>
HE500 5.0 -&gt; Average<br>
HE499 4.99 -&gt; Weak<br>
HE0 0.0 -&gt; Weak</div>
<p>Why test 8.99 and 9.0, 6.49 and 6.5? Because "&gt;" instead of "&gt;=" is the most common bug in rule-based PE questions, and it only shows at the edge.</p>
</details>
<h3>🧪 Exercise 2 — statistics over the list</h3>
<p>Print how many students have GPA ≥ 8 (and their names) and the average GPA with two decimals.</p>
<details><summary>Solution (run for real)</summary>
<pre class="trich"><code class="language-java">int count = 0;
double sum = 0;
List&lt;String&gt; good = new ArrayList&lt;&gt;();
for (Student s : list) {
    sum += s.getGpa();
    if (s.getGpa() &gt;= 8) {
        count++;
        good.add(s.getName());
    }
}
double avg = list.isEmpty() ? 0 : sum / list.size();   // guard: an empty list must not divide by zero
System.out.println("students with gpa &gt;= 8: " + count + " " + good);
System.out.println("average gpa: " + String.format(Locale.US, "%.2f", avg));</code></pre>
<div class="out">students with gpa &gt;= 8: 2 [Binh, Cuong]<br>
average gpa: 7.63</div>
<p>The guard <code>list.isEmpty() ? 0 : …</code> matters: dividing a <code>double</code> by 0 does not crash, it prints <code>NaN</code> — and the grader's expected output never contains NaN.</p>
</details>
<h3>🧪 Exercise 3 — why read whole lines?</h3>
<p>Read an age with <code>nextInt()</code> and then a name with <code>nextLine()</code>. What does the name contain? Then fix it.</p>
<details><summary>Solution (run for real, input <code>20 / Nguyen Van An / 21 / Tran Thi Binh</code>)</summary>
<pre class="trich"><code class="language-java">System.out.println("-- wrong: nextInt() then nextLine() --");
int age = sc.nextInt();
String name = sc.nextLine();                    // reads the rest of the "20" line: nothing
System.out.println("age=" + age + ", name=[" + name + "]");
String waiting = sc.nextLine();                  // the real name is still waiting in the input
System.out.println("still unread: [" + waiting + "]");

System.out.println("-- right: read whole lines, then convert --");
int age2 = Integer.parseInt(sc.nextLine().trim());
String name2 = sc.nextLine();
System.out.println("age=" + age2 + ", name=[" + name2 + "]");</code></pre>
<div class="out">-- wrong: nextInt() then nextLine() --<br>
age=20, name=[]<br>
still unread: [Nguyen Van An]<br>
-- right: read whole lines, then convert --<br>
age=21, name=[Tran Thi Binh]</div>
<p><code>nextInt()</code> reads the digits "20" but leaves the Enter key in the input, so the next <code>nextLine()</code> returns the empty rest of that line — and the real name is still waiting, ready to break the next read. Reading every value as a whole line and converting it avoids the trap completely.</p>
</details>`,
    `<h2>Ba bài tập nhỏ (mỗi bài 10–15 phút)</h2>
<h3>🧪 Bài 1 — xếp loại sinh viên</h3>
<p>Thêm <code>getRank()</code> vào <code>Student</code>: Excellent (≥ 9), Very good (≥ 8), Good (≥ 6.5), Average (≥ 5), Weak. Thử nó đúng ở <strong>biên</strong> của từng luật.</p>
<details><summary>Lời giải (chạy thật)</summary>
<pre class="trich"><code class="language-java">public String getRank() {
    if (gpa &gt;= 9) return "Excellent";
    if (gpa &gt;= 8) return "Very good";
    if (gpa &gt;= 6.5) return "Good";
    if (gpa &gt;= 5) return "Average";
    return "Weak";
}</code></pre>
<div class="out">HE900 9.0 -&gt; Excellent<br>
HE899 8.99 -&gt; Very good<br>
HE800 8.0 -&gt; Very good<br>
HE650 6.5 -&gt; Good<br>
HE649 6.49 -&gt; Average<br>
HE500 5.0 -&gt; Average<br>
HE499 4.99 -&gt; Weak<br>
HE0 0.0 -&gt; Weak</div>
<p>Vì sao thử 8.99 và 9.0, 6.49 và 6.5? Vì viết "&gt;" thay cho "&gt;=" là lỗi hay gặp nhất trong các câu PE có luật, và nó chỉ lộ ra ở biên.</p>
</details>
<h3>🧪 Bài 2 — thống kê trên danh sách</h3>
<p>In số sinh viên có GPA ≥ 8 (kèm tên) và GPA trung bình với hai chữ số thập phân.</p>
<details><summary>Lời giải (chạy thật)</summary>
<pre class="trich"><code class="language-java">int count = 0;
double sum = 0;
List&lt;String&gt; good = new ArrayList&lt;&gt;();
for (Student s : list) {
    sum += s.getGpa();
    if (s.getGpa() &gt;= 8) {
        count++;
        good.add(s.getName());
    }
}
double avg = list.isEmpty() ? 0 : sum / list.size();   // canh: danh sách rỗng không được chia cho 0
System.out.println("students with gpa &gt;= 8: " + count + " " + good);
System.out.println("average gpa: " + String.format(Locale.US, "%.2f", avg));</code></pre>
<div class="out">students with gpa &gt;= 8: 2 [Binh, Cuong]<br>
average gpa: 7.63</div>
<p>Câu canh <code>list.isEmpty() ? 0 : …</code> quan trọng: chia một số <code>double</code> cho 0 không làm sập chương trình mà in ra <code>NaN</code> — và output mong đợi của máy chấm không bao giờ có NaN.</p>
</details>
<h3>🧪 Bài 3 — vì sao phải đọc cả dòng?</h3>
<p>Đọc tuổi bằng <code>nextInt()</code> rồi đọc tên bằng <code>nextLine()</code>. Tên chứa gì? Rồi sửa lại.</p>
<details><summary>Lời giải (chạy thật, dữ liệu nhập <code>20 / Nguyen Van An / 21 / Tran Thi Binh</code>)</summary>
<pre class="trich"><code class="language-java">System.out.println("-- wrong: nextInt() then nextLine() --");
int age = sc.nextInt();
String name = sc.nextLine();                    // đọc phần còn lại của dòng "20": chẳng có gì
System.out.println("age=" + age + ", name=[" + name + "]");
String waiting = sc.nextLine();                  // tên thật vẫn còn nằm chờ trong input
System.out.println("still unread: [" + waiting + "]");

System.out.println("-- right: read whole lines, then convert --");
int age2 = Integer.parseInt(sc.nextLine().trim());
String name2 = sc.nextLine();
System.out.println("age=" + age2 + ", name=[" + name2 + "]");</code></pre>
<div class="out">-- wrong: nextInt() then nextLine() --<br>
age=20, name=[]<br>
still unread: [Nguyen Van An]<br>
-- right: read whole lines, then convert --<br>
age=21, name=[Tran Thi Binh]</div>
<p><code>nextInt()</code> đọc các chữ số "20" nhưng bỏ lại phím Enter trong dữ liệu nhập, nên <code>nextLine()</code> kế tiếp trả về phần còn lại (rỗng) của dòng đó — còn tên thật vẫn nằm chờ, sẵn sàng làm hỏng lần đọc tiếp theo. Đọc mọi giá trị thành cả dòng rồi chuyển đổi là tránh được hẳn cái bẫy này.</p>
</details>`),
    bi(`<h2>The same Student in Spring Boot (for LabFlow, later)</h2>
<div class="callout">🧭 <strong>Go further — Spring Boot</strong> (illustration, Java 17 — not for the PE): in LabFlow an entity looks almost the same — private fields, a no-argument constructor, getters/setters — with annotations that let JPA store it in PostgreSQL. Validation moves from <code>if</code> in the setter to annotations checked by Spring, but the idea "the object guards its data" is identical.
<pre><code class="language-java">@Entity
public class LabMember {
    @Id @GeneratedValue
    private Long id;

    @NotBlank
    private String fullName;

    @DecimalMin("0.0") @DecimalMax("10.0")
    private double gpa;

    protected LabMember() { }          // JPA needs a no-argument constructor
    // getters and setters as in Student
}</code></pre>
</div>
<p>Next: Chapter 1 starts with the school deck <em>Introduction</em> (lesson 1.A) — the ideas behind what you just typed.</p>`,
    `<h2>Cùng lớp Student trong Spring Boot (cho LabFlow, về sau)</h2>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot</strong> (ví dụ minh hoạ, Java 17 — không dùng cho PE): trong LabFlow một entity trông gần như y hệt — trường private, constructor không tham số, getter/setter — cộng thêm các annotation để JPA lưu nó vào PostgreSQL. Phần kiểm tra dữ liệu chuyển từ câu <code>if</code> trong setter sang annotation do Spring kiểm, nhưng ý "đối tượng tự canh dữ liệu của mình" vẫn y nguyên.
<pre><code class="language-java">@Entity
public class LabMember {
    @Id @GeneratedValue
    private Long id;

    @NotBlank
    private String fullName;

    @DecimalMin("0.0") @DecimalMax("10.0")
    private double gpa;

    protected LabMember() { }          // JPA cần constructor không tham số
    // getter và setter như Student
}</code></pre>
</div>
<p>Tiếp theo: Chương 1 bắt đầu với bộ slide <em>Introduction</em> của trường (bài 1.A) — các ý tưởng đứng sau thứ bạn vừa gõ.</p>`),
  ].join('\n'),
};

export default {
  slides: [L_pro2_1],
  extrasStart: [L_x_bat_dau_tai_day, L_x_hoc_the_nao, L_x_cai_moi_truong, L_x_buoi_dau_tien],
};
