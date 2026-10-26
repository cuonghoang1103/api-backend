/**
 * PRO192 · Chương 2 — bộ nhớ, lớp & đối tượng (pro7; pro8 slide 1–25).
 * Bài 📑 học theo từng slide: pro7 (tmp_07.pptx, slide 1–9); pro8 (tmp_08.pptx, slide 1–25).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch2.
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab-2-sach-va-thanh-vien.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch2).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, registerDeck, bi } from './_slides.mjs';

registerDeck('lab2', { code: 'PRO192 Lab 2', en: 'Lab 2 — CT Library: real Book and Member classes', vi: 'Lab 2 — CT Library: lớp Book và Member thật', total: 15, w: 1280, h: 720, ver: 'v2' });

/* ───────── 2.A — 📑 Slide by slide · Memory Management in Java: stack, heap, references, garbage collection (slides 1–9) ───────── */
const L_pro7_1 = {
  title: '2.A — 📑 Slide by slide · Memory Management in Java: stack, heap, references, garbage collection (slides 1–9)|||2.A — 📑 Học theo từng slide · Quản lý bộ nhớ trong Java: stack, heap, tham chiếu, thu gom rác (slide 1–9)',
  slug: 'pro192-slide-pro7-1',
  type: 'VIDEO',
  description: 'Giảng đủ 9 slide bộ "Memory Management in Java": vùng nhớ của chương trình C và chỗ của chúng trong JVM, stack (khung lời gọi, biến cục bộ) với heap (đối tượng, mảng), static heap/dynamic heap của slide so với tên thật trong HotSpot JDK 8 (Metaspace, Eden, Survivor, Old Gen), một lời gọi obj1.m1() đi qua con trỏ lớp và bảng phương thức, phạm vi biến và lúc đối tượng thành rác, bộ thu gom rác chạy khi nào và System.gc() có tác dụng gì — mọi điều đều ĐO bằng chương trình chạy thật (Runtime, WeakReference, -verbose:gc, -Xmx32m, OutOfMemoryError, StackOverflowError trên JDK 8 thật), kèm chỗ slide đã lỗi thời.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.A · school deck "Memory Management in Java", slides 1–9</span>
<h2>Where do your variables and objects actually live — and who cleans up?</h2>
<p class="lead">Chapter 1 used <code>new</code> without asking what it does. This short deck answers it: <strong>local variables</strong> sit in the <strong>stack</strong>, <strong>objects</strong> sit in the <strong>heap</strong>, a variable of a class type holds only a <strong>reference</strong>, and the <strong>garbage collector</strong> frees objects nobody can reach. These four facts explain half of the FE "what is printed?" questions — <code>==</code> versus <code>equals</code>, two variables changing "the same" object, a method that cannot swap two numbers — and the rest of Chapter 2 (constructors, <code>this</code>, passing arguments) builds directly on them.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>the C memory map you know, and the JVM's run-time areas</td><td>say where a local <code>int</code>, a <code>new</code> object and a <code>static</code> field are stored</td></tr>
<tr><td>4–5</td><td>the deck's "static heap / dynamic heap" model; one call obj1.m1() step by step</td><td>explain what a reference is and how an object finds its methods</td></tr>
<tr><td>6</td><td>stack frames versus heap objects</td><td>predict which data disappears when a method returns</td></tr>
<tr><td>7–9</td><td>garbage collection: when data becomes garbage, when the collector really runs</td><td>answer "when is this object eligible for GC?" and explain what <code>System.gc()</code> does</td></tr>
</tbody>
</table>
<div class="callout"><strong>Measured, not described.</strong> Memory is invisible, so it is easy to repeat myths about it. Every claim below comes with a program that was really run — <code>Runtime</code> to measure the heap, a <code>WeakReference</code> to watch an object disappear, <code>-Xmx32m</code> and <code>-verbose:gc</code> on a real <strong>JDK 8</strong> (the exam JDK) to watch the collector work. Where the 2013-era slides no longer match the real JVM, the lesson shows the measurement and says so.</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.A · bộ slide "Memory Management in Java" của trường, slide 1–9</span>
<h2>Biến và đối tượng của bạn thật ra nằm ở đâu — và ai dọn dẹp?</h2>
<p class="lead">Chương 1 dùng <code>new</code> mà chưa hỏi nó làm gì. Bộ slide ngắn này trả lời: <strong>biến cục bộ (local variable)</strong> nằm trong <strong>stack (ngăn xếp)</strong>, <strong>đối tượng (object)</strong> nằm trong <strong>heap (vùng nhớ động)</strong>, một biến kiểu lớp chỉ giữ một <strong>tham chiếu (reference)</strong>, và <strong>bộ thu gom rác (garbage collector — GC)</strong> giải phóng những đối tượng không còn ai với tới. Bốn sự thật này giải thích một nửa số câu FE "in ra gì?" — <code>==</code> với <code>equals</code>, hai biến cùng sửa "một" đối tượng, phương thức không hoán đổi được hai số — và phần còn lại của Chương 2 (constructor, <code>this</code>, truyền tham số) xây thẳng lên đó.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>bản đồ bộ nhớ C bạn đã biết, và các vùng nhớ lúc chạy của JVM</td><td>nói được một biến <code>int</code> cục bộ, một đối tượng tạo bằng <code>new</code> và một trường <code>static</code> nằm ở đâu</td></tr>
<tr><td>4–5</td><td>mô hình "static heap / dynamic heap" của slide; một lời gọi obj1.m1() từng bước</td><td>giải thích tham chiếu là gì và đối tượng tìm ra phương thức của nó thế nào</td></tr>
<tr><td>6</td><td>khung stack so với đối tượng trên heap</td><td>đoán đúng dữ liệu nào biến mất khi phương thức kết thúc</td></tr>
<tr><td>7–9</td><td>thu gom rác: khi nào dữ liệu thành rác, khi nào bộ thu gom thật sự chạy</td><td>trả lời "đối tượng này đủ điều kiện bị thu gom từ khi nào?" và giải thích <code>System.gc()</code> làm gì</td></tr>
</tbody>
</table>
<div class="callout"><strong>Đo, không tả.</strong> Bộ nhớ thì vô hình, nên rất dễ lặp lại những lời đồn về nó. Mọi khẳng định bên dưới đều có một chương trình đã chạy thật — <code>Runtime</code> để đo heap, <code>WeakReference</code> để nhìn một đối tượng biến mất, <code>-Xmx32m</code> và <code>-verbose:gc</code> trên <strong>JDK 8</strong> thật (JDK phòng thi) để xem bộ thu gom làm việc. Chỗ nào slide (soạn khoảng 2013) không còn khớp với JVM thật, bài cho xem số đo và nói thẳng.</div>`),
    walkHead('pro7', 1, 9),
    walk('pro7', [
      [1, 'Memory Management in Java',
        `<p class="y-chinh">🎯 Title slide of the deck that opens Chapter 2: how a running Java program uses memory, and how the memory it no longer needs is given back — automatically.</p>
<p>The syllabus places this before "Classes and Objects" on purpose: you cannot really understand <code>new</code>, constructors, <code>this</code> or "Java passes arguments by value" without a picture of stack and heap. The deck is only 9 slides, so this lesson adds the missing pieces (marked ➕) and a real measurement for each claim.</p>
<p class="meo">🧠 The whole lesson in one line: <em>variables live in method calls (stack), objects live on their own (heap), and an object dies when nobody can reach it any more.</em></p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của bộ slide mở đầu Chương 2: một chương trình Java đang chạy dùng bộ nhớ thế nào, và phần bộ nhớ không còn cần được trả lại ra sao — một cách tự động.</p>
<p>Đề cương đặt bài này trước "Classes and Objects" là có chủ ý: bạn không thể thật sự hiểu <code>new</code>, constructor, <code>this</code> hay câu "Java truyền tham số theo giá trị" nếu chưa có trong đầu bức tranh stack và heap. Bộ slide chỉ có 9 trang, nên bài này bổ sung các mảnh còn thiếu (đánh dấu ➕) và một phép đo thật cho từng khẳng định.</p>
<p class="meo">🧠 Cả bài trong một dòng: <em>biến sống trong lời gọi phương thức (stack), đối tượng sống riêng (heap), và một đối tượng chết khi không còn ai với tới nó.</em></p>`],
      [2, 'Objectives — Study Stack, Static Heap, Dynamic Heap',
        `<p class="y-chinh">🎯 Three goals: know the three memory areas the deck names — <strong>stack, static heap, dynamic heap</strong> — understand <strong>allocation and deallocation</strong>, and understand <strong>garbage collection</strong>.</p>
<p>The deck's three words are a teaching vocabulary. The official names, from <em>The Java Virtual Machine Specification</em> §2.5 "Run-Time Data Areas", are:</p>
<table>
<thead><tr><th>Deck says</th><th>Official name (JVMS)</th><th>Holds</th><th>Created / freed</th></tr></thead>
<tbody>
<tr><td>stack</td><td>Java Virtual Machine stack (one per thread)</td><td>one frame per method call: parameters, local variables, partial results</td><td>frame pushed on call, popped on return</td></tr>
<tr><td>static heap</td><td>method area (HotSpot 8: Metaspace)</td><td>each loaded class: its code, constants, static fields</td><td>when the class is loaded; rarely freed</td></tr>
<tr><td>dynamic heap</td><td>heap</td><td>every object created with <code>new</code> and every array</td><td>allocated by <code>new</code>, freed by the garbage collector</td></tr>
</tbody>
</table>
<p>➕ The JVMS also lists the <strong>pc register</strong> (the next instruction of each thread) and <strong>native method stacks</strong> (for C code) — you met them in lesson 1.B's JVM picture; PRO192 never asks about them.</p>
<div class="pitfall">FE wording: "Where are objects stored in Java?" → <strong>heap</strong>. "Where are local variables stored?" → <strong>stack</strong>. A local variable of a class type is on the stack, but the object it refers to is on the heap — the most common trap of this chapter.</div>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: nắm ba vùng nhớ mà bộ slide gọi tên — <strong>stack, static heap, dynamic heap</strong> — hiểu <strong>cấp phát và thu hồi (allocation and deallocation)</strong>, và hiểu <strong>thu gom rác (garbage collection)</strong>.</p>
<p>Ba từ của bộ slide là từ vựng để dạy. Tên chính thức, theo <em>The Java Virtual Machine Specification</em> mục 2.5 "Run-Time Data Areas" (các vùng dữ liệu lúc chạy), là:</p>
<table>
<thead><tr><th>Slide gọi là</th><th>Tên chính thức (JVMS)</th><th>Chứa gì</th><th>Tạo / giải phóng</th></tr></thead>
<tbody>
<tr><td>stack</td><td>Java Virtual Machine stack (mỗi luồng một cái)</td><td>mỗi lời gọi phương thức một khung (frame): tham số, biến cục bộ, kết quả trung gian</td><td>đẩy khung khi gọi, gỡ khung khi trả về</td></tr>
<tr><td>static heap</td><td>method area — vùng phương thức (HotSpot 8: Metaspace)</td><td>từng lớp đã nạp: code, hằng, trường static</td><td>khi lớp được nạp; hiếm khi giải phóng</td></tr>
<tr><td>dynamic heap</td><td>heap</td><td>mọi đối tượng tạo bằng <code>new</code> và mọi mảng</td><td><code>new</code> cấp phát, bộ thu gom rác giải phóng</td></tr>
</tbody>
</table>
<p>➕ JVMS còn kể <strong>pc register</strong> (thanh ghi lệnh kế tiếp của mỗi luồng) và <strong>native method stacks</strong> (cho code C) — bạn đã gặp chúng trong hình JVM của bài 1.B; PRO192 không hỏi tới.</p>
<div class="pitfall">Cách hỏi của FE: "Đối tượng trong Java được lưu ở đâu?" → <strong>heap</strong>. "Biến cục bộ lưu ở đâu?" → <strong>stack</strong>. Một biến cục bộ kiểu lớp nằm trên stack, nhưng đối tượng mà nó tham chiếu thì nằm trên heap — bẫy phổ biến nhất của chương này.</div>`],
      [3, 'Memory Management in Java — from the 4 regions of C to the Java heap',
        `<p class="y-chinh">🎯 Review of C: a C program has four regions — <strong>code segment</strong> (statements), <strong>data segment</strong> (globals), <strong>stack</strong> (locals of each call), <strong>heap</strong> (dynamic data) — and C/C++ programmers must free the heap themselves. Java gives that job to the <strong>garbage collector</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/57aed3fe0dcb3cddb82dc642ac1705290a6e5619.svg" alt="Slide 3 widened: each C region and the JVM area that took over its job" loading="lazy" /><p class="chu-thich">🧩 Slide 3 widened: each C region and the JVM area that took over its job</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 3 widened — the 4 regions of a C program, and where each one went in the JVM
' Left: the C memory map the slide reviews. Right: the JVM run-time data areas (JVMS 2.5)
left to right direction
package "C program (PRF192)" {
  rectangle "code segment\\n(the statements)" as CCode
  rectangle "data segment\\n(global variables)" as CData
  rectangle "stack\\n(locals of each call)" as CStack
  rectangle "heap\\n(malloc ... free — YOU free it)" as CHeap #FEF2F2
}
package "Java program on the JVM (PRO192)" {
  rectangle "Method Area\\n(class code + static fields)\\nthe slides' 'static heap'" as JMethod #EEF2FF
  rectangle "Java stacks\\n(one per thread; a frame per call)" as JStack
  rectangle "Heap\\n(every object and array — the GC frees it)\\nthe slides' 'dynamic heap'" as JHeap #ECFDF5
}
CCode --&gt; JMethod
CData --&gt; JMethod
CStack --&gt; JStack
CHeap --&gt; JHeap
@enduml</code></pre></details>
<p>In PRF192 every <code>malloc</code> needed a matching <code>free</code>; forget it and memory leaks, call it twice and the program crashes. Java has no <code>free</code> and no <code>delete</code>: you only create objects. The slide adds that the heap is managed with a <em>free block list</em> and an <em>allocated block list</em>, and that after many allocations the free blocks become fragmented (not contiguous).</p>
<p>➕ That list-based description is how a simple C allocator works, and it is a fair picture of the <em>problem</em>. HotSpot's real answer is different: new objects are placed by simply moving a pointer forward ("bump-the-pointer", in a per-thread buffer called a TLAB), and the collector <strong>copies or compacts</strong> live objects so the free space is one contiguous block again. The heap is split into <strong>generations</strong> because most objects die young (slide 4).</p>
<p class="meo">🧠 The slide's link is <code>http://docs.oracle.com/javase/specs/</code> — today it redirects to https; the memory chapter you want is JVMS §2.5.</p>`,
        `<p class="y-chinh">🎯 Ôn lại C: một chương trình C có bốn vùng — <strong>code segment</strong> (đoạn mã — các câu lệnh), <strong>data segment</strong> (đoạn dữ liệu — biến toàn cục), <strong>stack</strong> (biến cục bộ của từng lời gọi), <strong>heap</strong> (dữ liệu động) — và lập trình viên C/C++ phải tự giải phóng heap. Java giao việc đó cho <strong>bộ thu gom rác</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/57aed3fe0dcb3cddb82dc642ac1705290a6e5619.svg" alt="Slide 3 mở rộng: mỗi vùng của C và vùng JVM đã nhận lại việc của nó" loading="lazy" /><p class="chu-thich">🧩 Slide 3 mở rộng: mỗi vùng của C và vùng JVM đã nhận lại việc của nó</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 3 widened — the 4 regions of a C program, and where each one went in the JVM
' Trái: bản đồ bộ nhớ C mà slide ôn lại. Phải: các vùng dữ liệu lúc chạy của JVM (JVMS 2.5)
left to right direction
package "C program (PRF192)" {
  rectangle "code segment\\n(the statements)" as CCode
  rectangle "data segment\\n(global variables)" as CData
  rectangle "stack\\n(locals of each call)" as CStack
  rectangle "heap\\n(malloc ... free — YOU free it)" as CHeap #FEF2F2
}
package "Java program on the JVM (PRO192)" {
  rectangle "Method Area\\n(class code + static fields)\\nthe slides' 'static heap'" as JMethod #EEF2FF
  rectangle "Java stacks\\n(one per thread; a frame per call)" as JStack
  rectangle "Heap\\n(every object and array — the GC frees it)\\nthe slides' 'dynamic heap'" as JHeap #ECFDF5
}
CCode --&gt; JMethod
CData --&gt; JMethod
CStack --&gt; JStack
CHeap --&gt; JHeap
@enduml</code></pre></details>
<p>Ở PRF192 mỗi <code>malloc</code> phải có một <code>free</code> đi kèm; quên thì rò rỉ bộ nhớ (memory leak), gọi hai lần thì chương trình sập. Java không có <code>free</code>, không có <code>delete</code>: bạn chỉ việc tạo đối tượng. Slide nói thêm heap được quản lý bằng một <em>danh sách khối trống (free block list)</em> và một <em>danh sách khối đã cấp (allocated block list)</em>, và sau rất nhiều lần cấp/thu thì các khối trống bị phân mảnh (không liền nhau).</p>
<p>➕ Cách mô tả bằng danh sách đó là cách một bộ cấp phát C đơn giản làm việc, và là bức tranh đúng về <em>vấn đề</em>. Lời giải thật của HotSpot thì khác: đối tượng mới được đặt bằng cách đẩy một con trỏ tiến lên ("bump-the-pointer", trong một vùng đệm riêng của từng luồng gọi là TLAB), còn bộ thu gom <strong>sao chép hoặc dồn (copy/compact)</strong> các đối tượng còn sống để chỗ trống lại liền một khối. Heap được chia thành các <strong>thế hệ (generation)</strong> vì phần lớn đối tượng chết trẻ (slide 4).</p>
<p class="meo">🧠 Link trên slide là <code>http://docs.oracle.com/javase/specs/</code> — nay tự chuyển sang https; chương về bộ nhớ bạn cần là JVMS mục 2.5.</p>`],
      [4, 'Memory Management in Java — how the heap is organised',
        `<p class="y-chinh">🎯 The deck's model: objects are placed by <strong>first fit</strong>; if no free block fits, memory is <strong>compacted</strong>. The <strong>static heap</strong> holds class declarations (no GC needed); the <strong>dynamic heap</strong> has section 1 (the objects, garbage-collected) and section 2 (links from objects to their methods). Every object automatically gets a field that refers to its class.</p>
<p>The last sentence is exactly right and worth remembering: every Java object carries a hidden <strong>class pointer</strong> in its header — that is how <code>getClass()</code> and <code>instanceof</code> can answer at run time. The rest is a teaching model. Here are the real area names inside HotSpot JDK 8, printed by the JVM itself:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "VungNho.java",
        "import java.lang.management.*;\\n" +
        "public class VungNho {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        for (MemoryPoolMXBean p : ManagementFactory.getMemoryPoolMXBeans())   // every memory area the JVM manages\\n" +
        "            System.out.println((p.getType() == MemoryType.HEAP ? \\"HEAP     | \\" : \\"NON-HEAP | \\") + p.getName());\\n" +
        "        for (GarbageCollectorMXBean g : ManagementFactory.getGarbageCollectorMXBeans())\\n" +
        "            System.out.println(\\"GC       | \\" + g.getName());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "VungNho.java");
    lenh(lab, "java", "-version");
    lenh(lab, "java", "VungNho");                       // JDK 8 default collector (Parallel)
    lenh(lab, "java", "-XX:+UseG1GC", "VungNho");       // G1 — the default from JDK 9 on
}</code></pre>
<div class="out">&gt; javac VungNho.java<br>
&gt; java -version<br>
openjdk version "1.8.0_504"<br>
OpenJDK Runtime Environment (Temurin)(build 1.8.0_504-b01)<br>
OpenJDK 64-Bit Server VM (Temurin)(build 25.504-b01, mixed mode)<br>
&gt; java VungNho<br>
NON-HEAP | Code Cache<br>
NON-HEAP | Metaspace<br>
NON-HEAP | Compressed Class Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| PS Eden Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| PS Survivor Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| PS Old Gen<br>
GC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PS Scavenge<br>
GC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PS MarkSweep<br>
&gt; java -XX:+UseG1GC VungNho<br>
NON-HEAP | Code Cache<br>
NON-HEAP | Metaspace<br>
NON-HEAP | Compressed Class Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| G1 Eden Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| G1 Survivor Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| G1 Old Gen<br>
GC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| G1 Young Generation<br>
GC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| G1 Old Generation</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/03260ef0aa9144e3b4d8a12015e490cee0370826.svg" alt="Slide 4's model mapped to the areas JDK 8 really reports" loading="lazy" /><p class="chu-thich">🧩 Slide 4's model mapped to the areas JDK 8 really reports</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 4 — the slide's teaching model, next to what HotSpot JDK 8 really has (names measured by VungNhoJvm)
left to right direction
package "Slide 4 model" {
  rectangle "Static heap\\nclass declarations\\n'invariable, no GC needed'" as SStatic
  rectangle "Dynamic heap — section 1\\nthe objects\\n(GC applied)" as SDyn1
  rectangle "Dynamic heap — section 2\\nobject → method relations" as SDyn2
}
package "HotSpot JDK 8 (Parallel GC)" {
  rectangle "Metaspace + Compressed Class Space\\n(class metadata, method code; JDK 7: PermGen)\\nclasses CAN be unloaded" as HMeta #EEF2FF
  rectangle "Young generation\\nPS Eden Space (new objects)\\nPS Survivor Space (survived 1+ GC)" as HYoung #ECFDF5
  rectangle "Old generation\\nPS Old Gen (long-lived objects)" as HOld #ECFDF5
  rectangle "no separate area:\\neach object header holds a class pointer;\\nthe class keeps the method table (vtable)" as HNone #F8FAFC
}
SStatic --&gt; HMeta
SDyn1 --&gt; HYoung
SDyn1 --&gt; HOld
SDyn2 --&gt; HNone
@enduml</code></pre></details>
<p>Read the output: the "static heap" is <strong>Metaspace</strong> (it replaced the Permanent Generation in JDK 8, JEP 122) and it is <em>not</em> exempt from GC — classes can be unloaded. The "dynamic heap" is split by <strong>age</strong>: new objects go to <strong>Eden</strong>, survivors of a collection move to a <strong>Survivor</strong> space, long-lived ones end in the <strong>Old</strong> generation. G1 (default since JDK 9, JEP 248) keeps the same three names but cuts the heap into equal regions. There is no "section 2": method lookup goes object → class pointer → the class's method table (next slide).</p>
<div class="pitfall">FE trap: "The static heap does not need garbage collection" or "Java uses first fit" may appear as the expected answer because the deck says so. Answer what the course asks in the FE, but know that real HotSpot JVMs allocate by bump-the-pointer and unload classes from Metaspace.</div>`,
        `<p class="y-chinh">🎯 Mô hình của slide: đối tượng được đặt theo kiểu <strong>first fit (khối vừa đầu tiên)</strong>; không khối trống nào vừa thì bộ nhớ được <strong>dồn lại (compact)</strong>. <strong>Static heap</strong> chứa khai báo lớp (không cần GC); <strong>dynamic heap</strong> có section 1 (các đối tượng, có thu gom rác) và section 2 (liên kết từ đối tượng tới phương thức của nó). Mỗi đối tượng được tự động thêm một trường trỏ về lớp của nó.</p>
<p>Câu cuối hoàn toàn đúng và đáng nhớ: mọi đối tượng Java đều mang một <strong>con trỏ lớp (class pointer)</strong> ẩn trong phần đầu (header) — nhờ vậy <code>getClass()</code> và <code>instanceof</code> trả lời được lúc chạy. Phần còn lại là mô hình để dạy. Đây là tên thật của các vùng trong HotSpot JDK 8, do chính JVM in ra:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "VungNho.java",
        "import java.lang.management.*;\\n" +
        "public class VungNho {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        for (MemoryPoolMXBean p : ManagementFactory.getMemoryPoolMXBeans())   // every memory area the JVM manages\\n" +
        "            System.out.println((p.getType() == MemoryType.HEAP ? \\"HEAP     | \\" : \\"NON-HEAP | \\") + p.getName());\\n" +
        "        for (GarbageCollectorMXBean g : ManagementFactory.getGarbageCollectorMXBeans())\\n" +
        "            System.out.println(\\"GC       | \\" + g.getName());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "VungNho.java");
    lenh(lab, "java", "-version");
    lenh(lab, "java", "VungNho");                       // bộ thu gom mặc định của JDK 8 (Parallel)
    lenh(lab, "java", "-XX:+UseG1GC", "VungNho");       // G1 — mặc định từ JDK 9 trở đi
}</code></pre>
<div class="out">&gt; javac VungNho.java<br>
&gt; java -version<br>
openjdk version "1.8.0_504"<br>
OpenJDK Runtime Environment (Temurin)(build 1.8.0_504-b01)<br>
OpenJDK 64-Bit Server VM (Temurin)(build 25.504-b01, mixed mode)<br>
&gt; java VungNho<br>
NON-HEAP | Code Cache<br>
NON-HEAP | Metaspace<br>
NON-HEAP | Compressed Class Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| PS Eden Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| PS Survivor Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| PS Old Gen<br>
GC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PS Scavenge<br>
GC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| PS MarkSweep<br>
&gt; java -XX:+UseG1GC VungNho<br>
NON-HEAP | Code Cache<br>
NON-HEAP | Metaspace<br>
NON-HEAP | Compressed Class Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| G1 Eden Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| G1 Survivor Space<br>
HEAP &nbsp;&nbsp;&nbsp;&nbsp;| G1 Old Gen<br>
GC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| G1 Young Generation<br>
GC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| G1 Old Generation</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/03260ef0aa9144e3b4d8a12015e490cee0370826.svg" alt="Mô hình của slide 4 ghép với các vùng mà JDK 8 thật sự báo" loading="lazy" /><p class="chu-thich">🧩 Mô hình của slide 4 ghép với các vùng mà JDK 8 thật sự báo</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 4 — the slide's teaching model, next to what HotSpot JDK 8 really has (names measured by VungNhoJvm)
left to right direction
package "Slide 4 model" {
  rectangle "Static heap\\nclass declarations\\n'invariable, no GC needed'" as SStatic
  rectangle "Dynamic heap — section 1\\nthe objects\\n(GC applied)" as SDyn1
  rectangle "Dynamic heap — section 2\\nobject → method relations" as SDyn2
}
package "HotSpot JDK 8 (Parallel GC)" {
  rectangle "Metaspace + Compressed Class Space\\n(class metadata, method code; JDK 7: PermGen)\\nclasses CAN be unloaded" as HMeta #EEF2FF
  rectangle "Young generation\\nPS Eden Space (new objects)\\nPS Survivor Space (survived 1+ GC)" as HYoung #ECFDF5
  rectangle "Old generation\\nPS Old Gen (long-lived objects)" as HOld #ECFDF5
  rectangle "no separate area:\\neach object header holds a class pointer;\\nthe class keeps the method table (vtable)" as HNone #F8FAFC
}
SStatic --&gt; HMeta
SDyn1 --&gt; HYoung
SDyn1 --&gt; HOld
SDyn2 --&gt; HNone
@enduml</code></pre></details>
<p>Đọc output: "static heap" chính là <strong>Metaspace</strong> (thay Permanent Generation từ JDK 8, JEP 122) và nó <em>không</em> được miễn GC — lớp có thể bị gỡ (unload). "Dynamic heap" được chia theo <strong>tuổi</strong>: đối tượng mới vào <strong>Eden</strong>, đối tượng sống sót qua một lần thu gom chuyển sang vùng <strong>Survivor</strong>, đối tượng sống lâu về thế hệ <strong>Old</strong>. G1 (mặc định từ JDK 9, JEP 248) giữ ba tên đó nhưng cắt heap thành các vùng (region) bằng nhau. Không có "section 2" nào: việc tìm phương thức đi theo đường đối tượng → con trỏ lớp → bảng phương thức của lớp (slide sau).</p>
<div class="pitfall">Bẫy FE: "Static heap không cần thu gom rác" hay "Java dùng first fit" có thể là đáp án mong đợi vì slide nói vậy. Trong FE cứ trả lời theo môn học, nhưng hãy biết rằng JVM HotSpot thật cấp phát bằng bump-the-pointer và có gỡ lớp khỏi Metaspace.</div>`],
      [5, 'Memory Management in Java — one call, obj1.m1(), step by step',
        `<p class="y-chinh">🎯 The deck's picture of a method call: <code>obj1</code> (at address 10000) points to an object whose first field is 1000 — the address of <strong>Class1</strong>'s definition in the static heap; Class1's <strong>method table</strong> maps <code>m1</code> to its code; steps (1)–(5) follow those links until the code of <code>m1()</code> runs.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/6556040b203b67e2a98935e23b54a0a08b4a4ea7.svg" alt="Slide 5 redrawn: reference → object → class pointer → method table → code" loading="lazy" /><p class="chu-thich">🧩 Slide 5 redrawn: reference → object → class pointer → method table → code</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 5 redrawn — what happens on obj1.m1()
' Numbers follow the slide: (1) find the object, (2) follow its class pointer, (3)(4) look up m1 in the method table, (5) run the code
left to right direction
package "Stack — frame of main" {
  rectangle "obj1 : reference → object A" as R1
  rectangle "obj2 : reference → object B" as R2
}
package "Heap — the objects" {
  rectangle "object A (slide: address 10000)\\n—\\nclass pointer → Class1\\nfields: id = 10000" as OA #ECFDF5
  rectangle "object B (slide: address 8000)\\n—\\nclass pointer → Class2\\nfields: id = 8000" as OB #ECFDF5
}
package "Method area — one copy per class" {
  rectangle "Class1 (slide: 1000)\\n—\\nconstants / static fields\\nmethod table: m1 → code, m2 → code\\n—\\n(3)(4) look up m1 in this table\\n(5) m1's code runs with this = object A,\\n     so 'id' means A's id = 10000" as C1 #EEF2FF
  rectangle "Class2 (slide: 500)\\n—\\nconstants / static fields\\nmethod table: m3 → code, m4 → code" as C2 #EEF2FF
}
R1 --&gt; OA : (1)
R2 --&gt; OB
OA --&gt; C1 : (2) class pointer
OB --&gt; C2
@enduml</code></pre></details>
<p>The essential ideas survive any real JVM: the variable <code>obj1</code> holds a <strong>reference</strong> (the slide's "address"), the object holds its <strong>fields</strong> and a <strong>link to its class</strong>, and the <strong>code exists once per class</strong> and runs on whichever object called it. The same picture as a program:</p>
<pre><code class="language-java">// release: 8
// Slide 5 in plain Java: every object carries a link to its class; the method code exists ONCE per class and runs on the fields of whichever object called it
import java.lang.reflect.Method;
import java.util.Arrays;

class Class1 {
    int id;                                          // fields: stored inside each object
    Class1(int id) { this.id = id; }
    void m1() { System.out.println("  Class1.m1() runs on the object whose id = " + id); }
    void m2() { System.out.println("  Class1.m2() runs on the object whose id = " + id); }
}

class Class2 {
    int id;
    Class2(int id) { this.id = id; }
    void m3() { System.out.println("  Class2.m3() runs on the object whose id = " + id); }
    void m4() { System.out.println("  Class2.m4() runs on the object whose id = " + id); }
}

public class PhuongThucCuaLop {
    public static void main(String[] args) {
        Class1 obj1 = new Class1(10000);             // the slide's "address 10000", kept here as a plain id
        Class2 obj2 = new Class2(8000);
        Class1 obj3 = new Class1(7);                 // a second Class1 object
        System.out.println("obj1.m1():"); obj1.m1();
        System.out.println("obj2.m4():"); obj2.m4();
        System.out.println("obj3.m1():"); obj3.m1();
        System.out.println("obj1 knows its class: " + obj1.getClass().getSimpleName() + ", obj2 knows its class: " + obj2.getClass().getSimpleName());
        System.out.println("obj1 and obj3 point to the SAME class object? " + (obj1.getClass() == obj3.getClass()));
        String[] names = new String[Class1.class.getDeclaredMethods().length];
        int i = 0;
        for (Method m : Class1.class.getDeclaredMethods()) names[i++] = m.getName();
        Arrays.sort(names);
        System.out.println("methods stored once in class Class1: " + Arrays.toString(names));
    }
}</code></pre>
<div class="out">obj1.m1():<br>
&nbsp;&nbsp;Class1.m1() runs on the object whose id = 10000<br>
obj2.m4():<br>
&nbsp;&nbsp;Class2.m4() runs on the object whose id = 8000<br>
obj3.m1():<br>
&nbsp;&nbsp;Class1.m1() runs on the object whose id = 7<br>
obj1 knows its class: Class1, obj2 knows its class: Class2<br>
obj1 and obj3 point to the SAME class object? true<br>
methods stored once in class Class1: [m1, m2]</div>
<p><code>obj1.m1()</code> and <code>obj3.m1()</code> run the <em>same</em> code but print different ids, because inside a method a field name means "the field of the object that made the call" — Java passes that object in silently as <code>this</code> (slide 11 of the next deck). Two objects, one class, one copy of <code>m1</code>.</p>
<p>➕ Java never shows you real addresses: there is no <code>&amp;x</code> and no pointer arithmetic. The numbers 10000, 8000, 1000, 500 on the slide are invented for the picture. What you can observe is <em>identity</em>: <code>==</code> on two references asks "same object?" — measured on slide 6.</p>`,
        `<p class="y-chinh">🎯 Hình của slide về một lời gọi phương thức: <code>obj1</code> (ở địa chỉ 10000) trỏ tới một đối tượng có trường đầu là 1000 — địa chỉ phần định nghĩa <strong>Class1</strong> trong static heap; <strong>bảng phương thức (method table)</strong> của Class1 ánh xạ <code>m1</code> tới code của nó; các bước (1)–(5) đi theo những liên kết đó cho tới khi code của <code>m1()</code> chạy.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/6556040b203b67e2a98935e23b54a0a08b4a4ea7.svg" alt="Slide 5 vẽ lại: tham chiếu → đối tượng → con trỏ lớp → bảng phương thức → code" loading="lazy" /><p class="chu-thich">🧩 Slide 5 vẽ lại: tham chiếu → đối tượng → con trỏ lớp → bảng phương thức → code</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 5 redrawn — what happens on obj1.m1()
' Số theo đúng slide: (1) tìm đối tượng, (2) đi theo con trỏ lớp, (3)(4) tra m1 trong bảng phương thức, (5) chạy code
left to right direction
package "Stack — frame of main" {
  rectangle "obj1 : reference → object A" as R1
  rectangle "obj2 : reference → object B" as R2
}
package "Heap — the objects" {
  rectangle "object A (slide: address 10000)\\n—\\nclass pointer → Class1\\nfields: id = 10000" as OA #ECFDF5
  rectangle "object B (slide: address 8000)\\n—\\nclass pointer → Class2\\nfields: id = 8000" as OB #ECFDF5
}
package "Method area — one copy per class" {
  rectangle "Class1 (slide: 1000)\\n—\\nconstants / static fields\\nmethod table: m1 → code, m2 → code\\n—\\n(3)(4) look up m1 in this table\\n(5) m1's code runs with this = object A,\\n     so 'id' means A's id = 10000" as C1 #EEF2FF
  rectangle "Class2 (slide: 500)\\n—\\nconstants / static fields\\nmethod table: m3 → code, m4 → code" as C2 #EEF2FF
}
R1 --&gt; OA : (1)
R2 --&gt; OB
OA --&gt; C1 : (2) class pointer
OB --&gt; C2
@enduml</code></pre></details>
<p>Các ý cốt lõi đúng với mọi JVM thật: biến <code>obj1</code> giữ một <strong>tham chiếu (reference)</strong> ("địa chỉ" trên slide), đối tượng giữ các <strong>trường</strong> của nó và một <strong>liên kết tới lớp</strong>, còn <strong>code chỉ có một bản cho mỗi lớp</strong> và chạy trên đối tượng nào gọi nó. Cùng bức tranh đó bằng chương trình:</p>
<pre><code class="language-java">// release: 8
// Slide 5 bằng Java thuần: đối tượng nào cũng mang một liên kết tới lớp của nó; code phương thức chỉ có MỘT bản cho mỗi lớp và chạy trên các trường của đối tượng nào gọi nó
import java.lang.reflect.Method;
import java.util.Arrays;

class Class1 {
    int id;                                          // trường: nằm trong từng đối tượng
    Class1(int id) { this.id = id; }
    void m1() { System.out.println("  Class1.m1() runs on the object whose id = " + id); }
    void m2() { System.out.println("  Class1.m2() runs on the object whose id = " + id); }
}

class Class2 {
    int id;
    Class2(int id) { this.id = id; }
    void m3() { System.out.println("  Class2.m3() runs on the object whose id = " + id); }
    void m4() { System.out.println("  Class2.m4() runs on the object whose id = " + id); }
}

public class PhuongThucCuaLop {
    public static void main(String[] args) {
        Class1 obj1 = new Class1(10000);             // "địa chỉ 10000" của slide, ở đây giữ làm id thường
        Class2 obj2 = new Class2(8000);
        Class1 obj3 = new Class1(7);                 // đối tượng Class1 thứ hai
        System.out.println("obj1.m1():"); obj1.m1();
        System.out.println("obj2.m4():"); obj2.m4();
        System.out.println("obj3.m1():"); obj3.m1();
        System.out.println("obj1 knows its class: " + obj1.getClass().getSimpleName() + ", obj2 knows its class: " + obj2.getClass().getSimpleName());
        System.out.println("obj1 and obj3 point to the SAME class object? " + (obj1.getClass() == obj3.getClass()));
        String[] names = new String[Class1.class.getDeclaredMethods().length];
        int i = 0;
        for (Method m : Class1.class.getDeclaredMethods()) names[i++] = m.getName();
        Arrays.sort(names);
        System.out.println("methods stored once in class Class1: " + Arrays.toString(names));
    }
}</code></pre>
<div class="out">obj1.m1():<br>
&nbsp;&nbsp;Class1.m1() runs on the object whose id = 10000<br>
obj2.m4():<br>
&nbsp;&nbsp;Class2.m4() runs on the object whose id = 8000<br>
obj3.m1():<br>
&nbsp;&nbsp;Class1.m1() runs on the object whose id = 7<br>
obj1 knows its class: Class1, obj2 knows its class: Class2<br>
obj1 and obj3 point to the SAME class object? true<br>
methods stored once in class Class1: [m1, m2]</div>
<p><code>obj1.m1()</code> và <code>obj3.m1()</code> chạy <em>cùng</em> một đoạn code nhưng in hai id khác nhau, vì bên trong phương thức, tên trường nghĩa là "trường của đối tượng đã gọi" — Java ngầm truyền đối tượng đó vào dưới tên <code>this</code> (slide 11 của bộ slide sau). Hai đối tượng, một lớp, một bản <code>m1</code>.</p>
<p>➕ Java không bao giờ cho bạn thấy địa chỉ thật: không có <code>&amp;x</code>, không có phép toán con trỏ. Các số 10000, 8000, 1000, 500 trên slide là số bịa để vẽ. Thứ bạn quan sát được là <em>danh tính (identity)</em>: <code>==</code> giữa hai tham chiếu hỏi "cùng một đối tượng không?" — đo ở slide 6.</p>`],
      [6, 'Garbage Collection — stack data and heap data',
        `<p class="y-chinh">🎯 Memory is allocated <strong>directly</strong> by <code>new</code> (an object on the heap) and <strong>indirectly</strong> by calling a method (its parameters and local variables on the stack). Local data is discarded when the method exits; objects live longer.</p>
<p>Watch the stack grow and shrink — each call to <code>factorial</code> pushes a frame with its own <code>n</code> and <code>result</code>, and the frame is popped when the call returns. An object created inside <code>make</code> survives the end of <code>make</code> because a reference to it is returned:</p>
<pre><code class="language-java">// release: 8
// Slide 6: each method call gets its own stack frame (parameters + locals) that is thrown away when the method returns; objects live on the heap and outlive the call
class Box {
    int value;
    Box(int value) { this.value = value; }
}

public class NganXepGoiHam {
    static int depth = 0;

    static int factorial(int n) {                    // n is a parameter = a local of THIS frame
        depth++;
        String pad = spaces(depth * 2);
        System.out.println(pad + "push frame factorial(" + n + ")");
        int result = (n &lt;= 1) ? 1 : n * factorial(n - 1);   // result: another local, one per frame
        System.out.println(pad + "pop  frame factorial(" + n + ") -&gt; returns " + result);
        depth--;
        return result;
    }

    static Box make(int v) {
        Box local = new Box(v);                      // 'local' is in make's frame, the Box object is on the heap
        return local;                                // the frame is discarded, the object survives because main gets a reference
    }

    static int noBaseCase(int n) { return noBaseCase(n + 1) + 1; }   // every call pushes a frame and none ever pops

    static String spaces(int k) { StringBuilder sb = new StringBuilder(); for (int i = 0; i &lt; k; i++) sb.append(' '); return sb.toString(); }

    public static void main(String[] args) {
        System.out.println("factorial(3) = " + factorial(3));
        Box b = make(42);
        System.out.println("make(42) has returned, its frame is gone, the object is still here: b.value = " + b.value);
        try {
            noBaseCase(1);
        } catch (StackOverflowError e) {             // the STACK ran out of room for frames, the heap was fine
            System.out.println("noBaseCase(1) -&gt; " + e.getClass().getName());
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;push frame factorial(3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;push frame factorial(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;push frame factorial(1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pop &nbsp;frame factorial(1) -&gt; returns 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;pop &nbsp;frame factorial(2) -&gt; returns 2<br>
&nbsp;&nbsp;pop &nbsp;frame factorial(3) -&gt; returns 6<br>
factorial(3) = 6<br>
make(42) has returned, its frame is gone, the object is still here: b.value = 42<br>
noBaseCase(1) -&gt; java.lang.StackOverflowError</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e8b1bec8aeb002127d111cc39da92928a599775c.svg" alt="Inside make(42): the frame of make on top of main's frame; the Box object on the heap" loading="lazy" /><p class="chu-thich">🧩 Inside make(42): the frame of make on top of main's frame; the Box object on the heap</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 6 — locals live in stack frames, objects live on the heap (NganXepGoiHam, inside make(42))
left to right direction
package "Stack (one per thread)" {
  rectangle "frame: make(42) ← top, removed on return\\n—\\nv = 42\\nlocal = ref" as F2 #FEF9C3
  rectangle "frame: main\\n—\\nargs = ref\\nb = (not assigned yet)" as F1
}
package "Heap" {
  rectangle "Box object\\n—\\nvalue = 42" as BOX #ECFDF5
  rectangle "String[] args (empty array)" as ARGS #ECFDF5
}
F2 --&gt; BOX : local
F1 --&gt; ARGS : args
note bottom of BOX
  after "return local":
  the frame of make() is gone,
  main's b now points here,
  so the Box lives on
end note
@enduml</code></pre></details>
<p>The last line is the stack's limit: a recursion with no base case keeps pushing frames until the <strong>stack</strong> overflows — a different error from running out of <strong>heap</strong> (<code>OutOfMemoryError</code>, slide 7). Now the most important consequence for the FE — a variable of a class type holds a <em>reference</em>, so copying it copies the arrow, not the object:</p>
<pre><code class="language-java">// release: 8
// Slides 2–4, 6: where each piece of data lives — stack (locals), heap (objects), class area (static) — shown by what the program prints
class Point {
    static int created = 0;          // ONE copy, stored with the class (the slide's "static heap")
    int x, y;                        // one copy PER OBJECT, inside the object on the heap

    Point(int x, int y) { this.x = x; this.y = y; created++; }
}

public class BaVungNho {
    public static void main(String[] args) {
        int a = 5;                   // a primitive local: the VALUE 5 sits in main's stack frame
        int b = a;                   // copies the value
        b = 99;
        System.out.println("a = " + a + ", b = " + b + "   (two separate boxes)");

        Point p = new Point(1, 2);   // new: the object goes on the heap; p (on the stack) keeps a REFERENCE to it
        Point q = p;                 // copies the reference, NOT the object
        q.x = 99;
        System.out.println("p.x = " + p.x + "   (changed through q: one object, two names)");
        Point r = new Point(1, 2);   // a second object with the same values
        System.out.println("p == q ? " + (p == q) + "   p == r ? " + (p == r));
        System.out.println("Point.created = " + Point.created + "   (static: shared by all Point objects)");

        String s1 = "Java";              // a literal: kept once in the string pool
        String s2 = "Java";              // the same pooled object
        String s3 = new String("Java");  // new ALWAYS makes another object on the heap
        System.out.println("s1 == s2 ? " + (s1 == s2) + "   s1 == s3 ? " + (s1 == s3) + "   s1.equals(s3) ? " + s1.equals(s3));
    }
}</code></pre>
<div class="out">a = 5, b = 99 &nbsp;&nbsp;(two separate boxes)<br>
p.x = 99 &nbsp;&nbsp;(changed through q: one object, two names)<br>
p == q ? true &nbsp;&nbsp;p == r ? false<br>
Point.created = 2 &nbsp;&nbsp;(static: shared by all Point objects)<br>
s1 == s2 ? true &nbsp;&nbsp;s1 == s3 ? false &nbsp;&nbsp;s1.equals(s3) ? true</div>
<div class="pitfall">FE/PE trap: <code>Point q = p; q.x = 99;</code> changes <code>p.x</code> too — one object, two names. And <code>s1 == s3</code> is <code>false</code> for two String objects with the same text: <code>==</code> compares references, <code>equals</code> compares contents. Always compare Strings with <code>equals</code> in a PE.</div>`,
        `<p class="y-chinh">🎯 Bộ nhớ được cấp <strong>trực tiếp</strong> bằng <code>new</code> (một đối tượng trên heap) và <strong>gián tiếp</strong> khi gọi một phương thức (tham số và biến cục bộ của nó trên stack). Dữ liệu cục bộ bị bỏ đi khi phương thức kết thúc; đối tượng sống lâu hơn.</p>
<p>Hãy xem stack lớn lên rồi co lại — mỗi lần gọi <code>factorial</code> đẩy vào một khung (frame) có <code>n</code> và <code>result</code> riêng, và khung bị gỡ ra khi lời gọi trả về. Một đối tượng tạo bên trong <code>make</code> vẫn sống sau khi <code>make</code> kết thúc vì tham chiếu tới nó được trả ra ngoài:</p>
<pre><code class="language-java">// release: 8
// Slide 6: mỗi lời gọi phương thức có một khung stack riêng (tham số + biến cục bộ), bị bỏ đi khi phương thức kết thúc; đối tượng nằm trên heap và sống lâu hơn lời gọi
class Box {
    int value;
    Box(int value) { this.value = value; }
}

public class NganXepGoiHam {
    static int depth = 0;

    static int factorial(int n) {                    // n là tham số = biến cục bộ của CHÍNH khung này
        depth++;
        String pad = spaces(depth * 2);
        System.out.println(pad + "push frame factorial(" + n + ")");
        int result = (n &lt;= 1) ? 1 : n * factorial(n - 1);   // result: thêm một biến cục bộ, mỗi khung một bản
        System.out.println(pad + "pop  frame factorial(" + n + ") -&gt; returns " + result);
        depth--;
        return result;
    }

    static Box make(int v) {
        Box local = new Box(v);                      // 'local' nằm trong khung của make, đối tượng Box nằm trên heap
        return local;                                // khung bị bỏ, đối tượng sống tiếp vì main nhận được tham chiếu
    }

    static int noBaseCase(int n) { return noBaseCase(n + 1) + 1; }   // lời gọi nào cũng đẩy thêm khung và không khung nào được gỡ

    static String spaces(int k) { StringBuilder sb = new StringBuilder(); for (int i = 0; i &lt; k; i++) sb.append(' '); return sb.toString(); }

    public static void main(String[] args) {
        System.out.println("factorial(3) = " + factorial(3));
        Box b = make(42);
        System.out.println("make(42) has returned, its frame is gone, the object is still here: b.value = " + b.value);
        try {
            noBaseCase(1);
        } catch (StackOverflowError e) {             // STACK hết chỗ cho khung, heap vẫn ổn
            System.out.println("noBaseCase(1) -&gt; " + e.getClass().getName());
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;push frame factorial(3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;push frame factorial(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;push frame factorial(1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pop &nbsp;frame factorial(1) -&gt; returns 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;pop &nbsp;frame factorial(2) -&gt; returns 2<br>
&nbsp;&nbsp;pop &nbsp;frame factorial(3) -&gt; returns 6<br>
factorial(3) = 6<br>
make(42) has returned, its frame is gone, the object is still here: b.value = 42<br>
noBaseCase(1) -&gt; java.lang.StackOverflowError</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e8b1bec8aeb002127d111cc39da92928a599775c.svg" alt="Bên trong make(42): khung của make nằm trên khung của main; đối tượng Box nằm trên heap" loading="lazy" /><p class="chu-thich">🧩 Bên trong make(42): khung của make nằm trên khung của main; đối tượng Box nằm trên heap</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 6 — locals live in stack frames, objects live on the heap (NganXepGoiHam, inside make(42))
left to right direction
package "Stack (one per thread)" {
  rectangle "frame: make(42) ← top, removed on return\\n—\\nv = 42\\nlocal = ref" as F2 #FEF9C3
  rectangle "frame: main\\n—\\nargs = ref\\nb = (not assigned yet)" as F1
}
package "Heap" {
  rectangle "Box object\\n—\\nvalue = 42" as BOX #ECFDF5
  rectangle "String[] args (empty array)" as ARGS #ECFDF5
}
F2 --&gt; BOX : local
F1 --&gt; ARGS : args
note bottom of BOX
  after "return local":
  the frame of make() is gone,
  main's b now points here,
  so the Box lives on
end note
@enduml</code></pre></details>
<p>Dòng cuối là giới hạn của stack: một phép đệ quy không có điểm dừng cứ đẩy khung mãi cho tới khi <strong>stack</strong> tràn — một lỗi khác hẳn với hết <strong>heap</strong> (<code>OutOfMemoryError</code>, slide 7). Giờ là hệ quả quan trọng nhất cho FE — biến kiểu lớp giữ một <em>tham chiếu</em>, nên chép biến là chép mũi tên, không chép đối tượng:</p>
<pre><code class="language-java">// release: 8
// Slide 2–4, 6: mỗi mẩu dữ liệu nằm ở đâu — stack (biến cục bộ), heap (đối tượng), vùng lớp (static) — thấy qua chính thứ chương trình in ra
class Point {
    static int created = 0;          // MỘT bản, nằm cùng lớp ("static heap" của slide)
    int x, y;                        // mỗi ĐỐI TƯỢNG một bản, nằm trong đối tượng trên heap

    Point(int x, int y) { this.x = x; this.y = y; created++; }
}

public class BaVungNho {
    public static void main(String[] args) {
        int a = 5;                   // biến cục bộ kiểu nguyên thuỷ: GIÁ TRỊ 5 nằm ngay trong khung stack của main
        int b = a;                   // chép giá trị
        b = 99;
        System.out.println("a = " + a + ", b = " + b + "   (two separate boxes)");

        Point p = new Point(1, 2);   // new: đối tượng nằm trên heap; p (trên stack) chỉ giữ THAM CHIẾU tới nó
        Point q = p;                 // chép tham chiếu, KHÔNG chép đối tượng
        q.x = 99;
        System.out.println("p.x = " + p.x + "   (changed through q: one object, two names)");
        Point r = new Point(1, 2);   // đối tượng thứ hai cùng giá trị
        System.out.println("p == q ? " + (p == q) + "   p == r ? " + (p == r));
        System.out.println("Point.created = " + Point.created + "   (static: shared by all Point objects)");

        String s1 = "Java";              // hằng chuỗi: giữ đúng một bản trong string pool
        String s2 = "Java";              // chính đối tượng đó trong pool
        String s3 = new String("Java");  // new LUÔN tạo thêm một đối tượng trên heap
        System.out.println("s1 == s2 ? " + (s1 == s2) + "   s1 == s3 ? " + (s1 == s3) + "   s1.equals(s3) ? " + s1.equals(s3));
    }
}</code></pre>
<div class="out">a = 5, b = 99 &nbsp;&nbsp;(two separate boxes)<br>
p.x = 99 &nbsp;&nbsp;(changed through q: one object, two names)<br>
p == q ? true &nbsp;&nbsp;p == r ? false<br>
Point.created = 2 &nbsp;&nbsp;(static: shared by all Point objects)<br>
s1 == s2 ? true &nbsp;&nbsp;s1 == s3 ? false &nbsp;&nbsp;s1.equals(s3) ? true</div>
<div class="pitfall">Bẫy FE/PE: <code>Point q = p; q.x = 99;</code> làm <code>p.x</code> đổi theo — một đối tượng, hai cái tên. Còn <code>s1 == s3</code> ra <code>false</code> với hai đối tượng String cùng nội dung: <code>==</code> so tham chiếu, <code>equals</code> so nội dung. Trong bài PE luôn so String bằng <code>equals</code>.</div>`],
      [7, 'Garbage Collection — automatic, but when?',
        `<p class="y-chinh">🎯 In Java you never free memory explicitly; the run-time system tracks what is allocated, decides what is still usable, and frees the rest — <strong>automatic garbage collection</strong>. Data becomes garbage when it goes out of scope or its reference is set to <code>null</code>. The slide adds: the collector has the lowest priority and runs only when the heap is exhausted.</p>
<p>First, measure that the collector really gives memory back — <code>Runtime</code> reports the heap in use before and after:</p>
<pre><code class="language-java">// release: 8
// Slides 3–7 measured, not described: Runtime shows the heap grow when we create objects and shrink after a garbage collection
import java.util.ArrayList;
import java.util.List;

public class DoBoNho {
    static final long MB = 1024 * 1024;

    static long used() {                                     // heap in use = what the JVM took from the OS minus what is still free
        Runtime rt = Runtime.getRuntime();
        return rt.totalMemory() - rt.freeMemory();
    }
    static long about(long bytes) {                          // round to the nearest 10 MB so every run prints the same line
        return Math.round(bytes / (double) MB / 10) * 10;
    }

    public static void main(String[] args) {
        System.gc();                                         // start from a clean heap
        long base = used();

        List&lt;byte[]&gt; keep = new ArrayList&lt;byte[]&gt;();
        for (int i = 0; i &lt; 600; i++) keep.add(new byte[100 * 1024]);   // 600 arrays of 100 KB = 58.6 MB, all reachable through keep
        System.out.println("after 600 x new byte[100 KB] : heap use grew by about " + about(used() - base) + " MB");

        keep = null;                                         // nothing points to the list any more: it and its 600 arrays are garbage
        System.out.println("right after keep = null      : heap use grew by about " + about(used() - base) + " MB  (garbage still occupies memory)");

        System.gc();                                         // ask for a collection (slide 9: only a request)
        System.out.println("after System.gc()            : heap use grew by about " + about(used() - base) + " MB");

    }
}</code></pre>
<div class="out">after 600 x new byte[100 KB] : heap use grew by about 60 MB<br>
right after keep = null &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: heap use grew by about 60 MB &nbsp;(garbage still occupies memory)<br>
after System.gc() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: heap use grew by about 0 MB</div>
<p>Second, test "runs only when the system heap becomes exhausted". The program below creates <strong>1000 blocks of 1 MB</strong> through a heap limited to <strong>32 MB</strong> — on a real JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    // Program 1: create 1000 blocks of 1 MB, one after another; "keep" also stores every block in a list
    viet(lab, "Rac.java",
        "import java.lang.management.*;\\n" +
        "import java.util.*;\\n" +
        "public class Rac {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List&lt;byte[]&gt; kept = new ArrayList&lt;byte[]&gt;();\\n" +
        "        for (int i = 1; i &lt;= 1000; i++) {\\n" +
        "            byte[] block = new byte[1024 * 1024];      // 1 MB on the heap\\n" +
        "            if (args[0].equals(\\"keep\\")) kept.add(block);\\n" +
        "        }                                              // \\"drop\\": block is garbage after each turn\\n" +
        "        long runs = 0;\\n" +
        "        for (GarbageCollectorMXBean gc : ManagementFactory.getGarbageCollectorMXBeans()) runs += gc.getCollectionCount();\\n" +
        "        System.out.println(\\"done: 1000 x 1 MB created, \\" + kept.size() + \\" kept\\");\\n" +
        "        System.out.println(\\"the GC ran by itself more than 50 times? \\" + (runs &gt; 50));\\n" +
        "    }\\n" +
        "}\\n");
    // Program 2: make one object garbage, then ASK for a collection
    viet(lab, "HoiGc.java",
        "import java.lang.ref.WeakReference;\\n" +
        "public class HoiGc {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Object o = new Object();\\n" +
        "        WeakReference&lt;Object&gt; watch = new WeakReference&lt;Object&gt;(o);   // watches o without keeping it alive\\n" +
        "        o = null;                                                     // the object is now garbage\\n" +
        "        System.gc();                                                  // a REQUEST, not an order\\n" +
        "        System.out.println(\\"after System.gc(): object collected? \\" + (watch.get() == null));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "Rac.java", "HoiGc.java");
    lenh(lab, "java", "-Xmx32m", "Rac", "drop");                 // 1000 MB through a 32 MB heap
    lenhLog(lab, "java", "-Xmx32m", "-verbose:gc", "Rac", "drop"); // same run, the GC log switched on
    lenh(lab, "java", "-Xmx32m", "Rac", "keep");                 // every block still reachable
    lenhLog(lab, "java", "-verbose:gc", "HoiGc");
    lenh(lab, "java", "-XX:+DisableExplicitGC", "HoiGc");        // the JVM may ignore the request
}</code></pre>
<div class="out">&gt; javac Rac.java HoiGc.java<br>
&gt; java -Xmx32m Rac drop<br>
done: 1000 x 1 MB created, 0 kept<br>
the GC ran by itself more than 50 times? true<br>
&gt; java -Xmx32m -verbose:gc Rac drop<br>
[GC (Allocation Failure) &nbsp;…K-&gt;…K(…K), … secs]<br>
[GC (Allocation Failure) &nbsp;…K-&gt;…K(…K), … secs]<br>
[GC (Allocation Failure) &nbsp;…K-&gt;…K(…K), … secs]<br>
done: 1000 x 1 MB created, 0 kept<br>
the GC ran by itself more than 50 times? true<br>
(… and more GC lines: more than 50 in total)<br>
&gt; java -Xmx32m Rac keep<br>
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
&gt; java -verbose:gc HoiGc<br>
[GC (System.gc()) &nbsp;…K-&gt;…K(…K), … secs]<br>
[Full GC (System.gc()) &nbsp;…K-&gt;…K(…K), … secs]<br>
after System.gc(): object collected? true<br>
&gt; java -XX:+DisableExplicitGC HoiGc<br>
after System.gc(): object collected? false</div>
<p>Three facts from that output. (1) 1000 MB passed through 32 MB without error: the collector ran <strong>by itself, more than 50 times</strong>, each time the small <em>young</em> space was full ("GC (Allocation Failure)" = "this <code>new</code> did not fit") — long before the whole heap was exhausted. (2) When every block stays reachable (<code>keep</code>), no collection can help and the program dies with <code>OutOfMemoryError: Java heap space</code>: the GC frees only <em>unreachable</em> objects. (3) The last two runs belong to slide 9.</p>
<div class="pitfall">So the slide's "lowest priority / only when the heap is exhausted" is outdated: modern collectors run young collections constantly, and G1/ZGC also work concurrently with your threads. FE answer for "role of GC": <strong>it frees heap memory by destroying unreachable objects</strong>.</div>`,
        `<p class="y-chinh">🎯 Trong Java bạn không bao giờ tự giải phóng bộ nhớ; hệ thống lúc chạy theo dõi phần đã cấp, xác định phần nào còn dùng được, và giải phóng phần còn lại — <strong>thu gom rác tự động</strong>. Dữ liệu thành rác khi ra khỏi phạm vi hoặc tham chiếu của nó được gán <code>null</code>. Slide nói thêm: bộ thu gom có độ ưu tiên thấp nhất và chỉ chạy khi heap cạn kiệt.</p>
<p>Trước hết, đo xem bộ thu gom có thật sự trả bộ nhớ lại không — <code>Runtime</code> báo phần heap đang dùng trước và sau:</p>
<pre><code class="language-java">// release: 8
// Slide 3–7 được ĐO chứ không tả: Runtime cho thấy heap tăng khi tạo đối tượng và giảm sau một lần thu gom rác
import java.util.ArrayList;
import java.util.List;

public class DoBoNho {
    static final long MB = 1024 * 1024;

    static long used() {                                     // heap đang dùng = phần JVM đã xin hệ điều hành trừ phần còn trống
        Runtime rt = Runtime.getRuntime();
        return rt.totalMemory() - rt.freeMemory();
    }
    static long about(long bytes) {                          // làm tròn tới 10 MB gần nhất để lần chạy nào cũng in cùng một dòng
        return Math.round(bytes / (double) MB / 10) * 10;
    }

    public static void main(String[] args) {
        System.gc();                                         // bắt đầu từ heap sạch
        long base = used();

        List&lt;byte[]&gt; keep = new ArrayList&lt;byte[]&gt;();
        for (int i = 0; i &lt; 600; i++) keep.add(new byte[100 * 1024]);   // 600 mảng 100 KB = 58,6 MB, tất cả với tới được qua keep
        System.out.println("after 600 x new byte[100 KB] : heap use grew by about " + about(used() - base) + " MB");

        keep = null;                                         // không còn gì trỏ tới danh sách: nó và 600 mảng thành rác
        System.out.println("right after keep = null      : heap use grew by about " + about(used() - base) + " MB  (garbage still occupies memory)");

        System.gc();                                         // xin một lần thu gom (slide 9: chỉ là lời xin)
        System.out.println("after System.gc()            : heap use grew by about " + about(used() - base) + " MB");

    }
}</code></pre>
<div class="out">after 600 x new byte[100 KB] : heap use grew by about 60 MB<br>
right after keep = null &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: heap use grew by about 60 MB &nbsp;(garbage still occupies memory)<br>
after System.gc() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: heap use grew by about 0 MB</div>
<p>Sau đó, kiểm câu "chỉ chạy khi heap cạn kiệt". Chương trình dưới tạo <strong>1000 khối 1 MB</strong> đi qua một heap bị giới hạn chỉ <strong>32 MB</strong> — trên JDK 8 thật:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    // Chương trình 1: tạo lần lượt 1000 khối 1 MB; chế độ "keep" còn cất mọi khối vào một danh sách
    viet(lab, "Rac.java",
        "import java.lang.management.*;\\n" +
        "import java.util.*;\\n" +
        "public class Rac {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List&lt;byte[]&gt; kept = new ArrayList&lt;byte[]&gt;();\\n" +
        "        for (int i = 1; i &lt;= 1000; i++) {\\n" +
        "            byte[] block = new byte[1024 * 1024];      // 1 MB on the heap\\n" +
        "            if (args[0].equals(\\"keep\\")) kept.add(block);\\n" +
        "        }                                              // \\"drop\\": block is garbage after each turn\\n" +
        "        long runs = 0;\\n" +
        "        for (GarbageCollectorMXBean gc : ManagementFactory.getGarbageCollectorMXBeans()) runs += gc.getCollectionCount();\\n" +
        "        System.out.println(\\"done: 1000 x 1 MB created, \\" + kept.size() + \\" kept\\");\\n" +
        "        System.out.println(\\"the GC ran by itself more than 50 times? \\" + (runs &gt; 50));\\n" +
        "    }\\n" +
        "}\\n");
    // Chương trình 2: biến một đối tượng thành rác, rồi XIN một lần thu gom
    viet(lab, "HoiGc.java",
        "import java.lang.ref.WeakReference;\\n" +
        "public class HoiGc {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Object o = new Object();\\n" +
        "        WeakReference&lt;Object&gt; watch = new WeakReference&lt;Object&gt;(o);   // watches o without keeping it alive\\n" +
        "        o = null;                                                     // the object is now garbage\\n" +
        "        System.gc();                                                  // a REQUEST, not an order\\n" +
        "        System.out.println(\\"after System.gc(): object collected? \\" + (watch.get() == null));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "Rac.java", "HoiGc.java");
    lenh(lab, "java", "-Xmx32m", "Rac", "drop");                 // 1000 MB đi qua một heap chỉ 32 MB
    lenhLog(lab, "java", "-Xmx32m", "-verbose:gc", "Rac", "drop"); // cùng lần chạy đó, bật nhật ký GC
    lenh(lab, "java", "-Xmx32m", "Rac", "keep");                 // khối nào cũng còn với tới được
    lenhLog(lab, "java", "-verbose:gc", "HoiGc");
    lenh(lab, "java", "-XX:+DisableExplicitGC", "HoiGc");        // JVM có quyền bỏ qua lời xin
}</code></pre>
<div class="out">&gt; javac Rac.java HoiGc.java<br>
&gt; java -Xmx32m Rac drop<br>
done: 1000 x 1 MB created, 0 kept<br>
the GC ran by itself more than 50 times? true<br>
&gt; java -Xmx32m -verbose:gc Rac drop<br>
[GC (Allocation Failure) &nbsp;…K-&gt;…K(…K), … secs]<br>
[GC (Allocation Failure) &nbsp;…K-&gt;…K(…K), … secs]<br>
[GC (Allocation Failure) &nbsp;…K-&gt;…K(…K), … secs]<br>
done: 1000 x 1 MB created, 0 kept<br>
the GC ran by itself more than 50 times? true<br>
(… and more GC lines: more than 50 in total)<br>
&gt; java -Xmx32m Rac keep<br>
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
&gt; java -verbose:gc HoiGc<br>
[GC (System.gc()) &nbsp;…K-&gt;…K(…K), … secs]<br>
[Full GC (System.gc()) &nbsp;…K-&gt;…K(…K), … secs]<br>
after System.gc(): object collected? true<br>
&gt; java -XX:+DisableExplicitGC HoiGc<br>
after System.gc(): object collected? false</div>
<p>Ba sự thật từ output đó. (1) 1000 MB đi qua 32 MB mà không lỗi: bộ thu gom <strong>tự chạy hơn 50 lần</strong>, mỗi lần vùng <em>young</em> nhỏ bị đầy ("GC (Allocation Failure)" = "lệnh <code>new</code> này không còn chỗ") — từ rất lâu trước khi cả heap cạn. (2) Khi mọi khối vẫn còn với tới được (<code>keep</code>), không lần thu gom nào cứu được và chương trình chết với <code>OutOfMemoryError: Java heap space</code>: GC chỉ giải phóng đối tượng <em>không còn với tới được (unreachable)</em>. (3) Hai lần chạy cuối thuộc về slide 9.</p>
<div class="pitfall">Vậy câu "ưu tiên thấp nhất / chỉ chạy khi heap cạn" của slide đã lỗi thời: bộ thu gom hiện đại chạy thu gom vùng young liên tục, G1/ZGC còn làm song song với các luồng của bạn. Đáp án FE cho "vai trò của GC": <strong>giải phóng bộ nhớ heap bằng cách huỷ các đối tượng không còn với tới được</strong>.</div>`],
      [8, 'Garbage Collection — scope and null',
        `<p class="y-chinh">🎯 The slide's code: <code>obj2</code> and <code>y</code> are declared inside the <code>if</code> block, so they go <strong>out of scope</strong> at its closing brace; <code>obj1 = null</code> means the memory allocated to <code>obj1</code>'s object is no longer used. The scope of a variable runs from its declaration to the closing bracket of the block that contains it.</p>
<p>The same code, with a <code>WeakReference</code> watching each object (a weak reference lets you look at an object without keeping it alive):</p>
<pre class="trich"><code class="language-java">Object obj1 = new Object();
WeakReference&lt;Object&gt; cam1 = new WeakReference&lt;Object&gt;(obj1);      // a weak reference does NOT count as "in use"
WeakReference&lt;Object&gt; cam2 = null;
int x = 5;
if (x &lt; 10) {
    Object obj2 = new Object();
    int y = 3;
    cam2 = new WeakReference&lt;Object&gt;(obj2);
    System.out.println("inside the block : y = " + y + ", obj2's object alive? " + alive(cam2));
}                                                                  // obj2 and y go out of scope here
int t = 7;
obj1 = null;                                                       // the first object loses its last reference
t *= 8;</code></pre>
<pre><code class="language-java">// release: 8
// Slide 8 run for real: the slide's own code, plus a WeakReference "camera" that watches each object without keeping it alive
import java.lang.ref.WeakReference;

public class PhamViVaRac {
    static boolean alive(WeakReference&lt;?&gt; w) { return w.get() != null; }   // is the watched object still in memory?

    public static void main(String[] args) {
        Object obj1 = new Object();
        WeakReference&lt;Object&gt; cam1 = new WeakReference&lt;Object&gt;(obj1);      // a weak reference does NOT count as "in use"
        WeakReference&lt;Object&gt; cam2 = null;
        int x = 5;
        if (x &lt; 10) {
            Object obj2 = new Object();
            int y = 3;
            cam2 = new WeakReference&lt;Object&gt;(obj2);
            System.out.println("inside the block : y = " + y + ", obj2's object alive? " + alive(cam2));
        }                                                                  // obj2 and y go out of scope here
        int t = 7;
        obj1 = null;                                                       // the first object loses its last reference
        t *= 8;
        System.out.println("after the block  : obj2's object still in memory? " + alive(cam2));
        System.out.println("after obj1 = null: obj1's object still in memory? " + alive(cam1));
        System.gc();                                                       // only now does a collection run
        System.out.println("after System.gc(): obj2's object in memory? " + alive(cam2) + ", obj1's object in memory? " + alive(cam1));
        System.out.println("t = " + t + "   (primitives like y and t are never 'collected': they vanish with their stack frame)");
    }
}</code></pre>
<div class="out">inside the block : y = 3, obj2's object alive? true<br>
after the block &nbsp;: obj2's object still in memory? true<br>
after obj1 = null: obj1's object still in memory? true<br>
after System.gc(): obj2's object in memory? false, obj1's object in memory? false<br>
t = 56 &nbsp;&nbsp;(primitives like y and t are never 'collected': they vanish with their stack frame)</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0478cc3b64797f78ad861f423e4dd81e23595763.svg" alt="Right after obj1 = null: both objects are unreachable — eligible, not yet collected" loading="lazy" /><p class="chu-thich">🧩 Right after obj1 = null: both objects are unreachable — eligible, not yet collected</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 8 — the moment after "obj1 = null; t *= 8;"
left to right direction
package "Stack — frame of the method" {
  rectangle "obj1 = null\\nx = 5\\nt = 56\\n(obj2 and y: out of scope, their slots are gone)" as FR
}
package "Heap" {
  rectangle "Object #1 (made by line 1)\\nno reference left → garbage" as O1 #FEF2F2
  rectangle "Object #2 (made inside the if)\\nno reference left → garbage" as O2 #FEF2F2
}
FR -[hidden]-&gt; O1
O1 -[hidden]-&gt; O2
note right of O2
  "garbage" = unreachable,
  i.e. ELIGIBLE for collection.
  The memory comes back only
  when the GC actually runs
  (PhamViVaRac: still in memory
  until System.gc()).
end note
@enduml</code></pre></details>
<p>Two precise corrections to the slide's wording. (1) "Garbage" means <strong>eligible for collection</strong>: both objects were still in memory after the block and after <code>obj1 = null</code>; they disappeared only when a collection ran. (2) It is the <em>objects</em> that become garbage, never <code>y</code> or <code>t</code>: primitives live in the stack frame and vanish with it — the GC does not touch the stack.</p>
<p>➕ The FE classic: <code>String s = "aaa"; String t = new String(s); t += "zzz"; t = t.substring(0); t = null;</code> — when is the String created on line 2 eligible? After <strong>line 3</strong>: <code>t += "zzz"</code> builds a <em>new</em> String and moves <code>t</code> to it, so nothing refers to the line-2 object any more. The chapter quiz verifies this with a running program.</p>`,
        `<p class="y-chinh">🎯 Code của slide: <code>obj2</code> và <code>y</code> khai báo bên trong khối <code>if</code>, nên chúng <strong>ra khỏi phạm vi (out of scope)</strong> ở dấu ngoặc đóng của khối; <code>obj1 = null</code> nghĩa là bộ nhớ cấp cho đối tượng của <code>obj1</code> không còn được dùng. Phạm vi (scope) của một biến chạy từ dòng khai báo tới dấu ngoặc đóng của khối chứa nó.</p>
<p>Cùng đoạn code đó, có một <code>WeakReference</code> theo dõi từng đối tượng (tham chiếu yếu cho bạn nhìn một đối tượng mà không giữ nó sống):</p>
<pre class="trich"><code class="language-java">Object obj1 = new Object();
WeakReference&lt;Object&gt; cam1 = new WeakReference&lt;Object&gt;(obj1);      // tham chiếu yếu KHÔNG tính là "đang dùng"
WeakReference&lt;Object&gt; cam2 = null;
int x = 5;
if (x &lt; 10) {
    Object obj2 = new Object();
    int y = 3;
    cam2 = new WeakReference&lt;Object&gt;(obj2);
    System.out.println("inside the block : y = " + y + ", obj2's object alive? " + alive(cam2));
}                                                                  // obj2 và y ra khỏi phạm vi ở đây
int t = 7;
obj1 = null;                                                       // đối tượng thứ nhất mất tham chiếu cuối cùng
t *= 8;</code></pre>
<pre><code class="language-java">// release: 8
// Slide 8 chạy thật: đúng đoạn code của slide, cộng một "camera" WeakReference theo dõi từng đối tượng mà không giữ nó sống
import java.lang.ref.WeakReference;

public class PhamViVaRac {
    static boolean alive(WeakReference&lt;?&gt; w) { return w.get() != null; }   // đối tượng đang theo dõi còn trong bộ nhớ không?

    public static void main(String[] args) {
        Object obj1 = new Object();
        WeakReference&lt;Object&gt; cam1 = new WeakReference&lt;Object&gt;(obj1);      // tham chiếu yếu KHÔNG tính là "đang dùng"
        WeakReference&lt;Object&gt; cam2 = null;
        int x = 5;
        if (x &lt; 10) {
            Object obj2 = new Object();
            int y = 3;
            cam2 = new WeakReference&lt;Object&gt;(obj2);
            System.out.println("inside the block : y = " + y + ", obj2's object alive? " + alive(cam2));
        }                                                                  // obj2 và y ra khỏi phạm vi ở đây
        int t = 7;
        obj1 = null;                                                       // đối tượng thứ nhất mất tham chiếu cuối cùng
        t *= 8;
        System.out.println("after the block  : obj2's object still in memory? " + alive(cam2));
        System.out.println("after obj1 = null: obj1's object still in memory? " + alive(cam1));
        System.gc();                                                       // chỉ đến lúc này mới có một lần thu gom
        System.out.println("after System.gc(): obj2's object in memory? " + alive(cam2) + ", obj1's object in memory? " + alive(cam1));
        System.out.println("t = " + t + "   (primitives like y and t are never 'collected': they vanish with their stack frame)");
    }
}</code></pre>
<div class="out">inside the block : y = 3, obj2's object alive? true<br>
after the block &nbsp;: obj2's object still in memory? true<br>
after obj1 = null: obj1's object still in memory? true<br>
after System.gc(): obj2's object in memory? false, obj1's object in memory? false<br>
t = 56 &nbsp;&nbsp;(primitives like y and t are never 'collected': they vanish with their stack frame)</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0478cc3b64797f78ad861f423e4dd81e23595763.svg" alt="Ngay sau obj1 = null: cả hai đối tượng không còn với tới được — đủ điều kiện, chưa bị thu gom" loading="lazy" /><p class="chu-thich">🧩 Ngay sau obj1 = null: cả hai đối tượng không còn với tới được — đủ điều kiện, chưa bị thu gom</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 8 — the moment after "obj1 = null; t *= 8;"
left to right direction
package "Stack — frame of the method" {
  rectangle "obj1 = null\\nx = 5\\nt = 56\\n(obj2 and y: out of scope, their slots are gone)" as FR
}
package "Heap" {
  rectangle "Object #1 (made by line 1)\\nno reference left → garbage" as O1 #FEF2F2
  rectangle "Object #2 (made inside the if)\\nno reference left → garbage" as O2 #FEF2F2
}
FR -[hidden]-&gt; O1
O1 -[hidden]-&gt; O2
note right of O2
  "garbage" = unreachable,
  i.e. ELIGIBLE for collection.
  The memory comes back only
  when the GC actually runs
  (PhamViVaRac: still in memory
  until System.gc()).
end note
@enduml</code></pre></details>
<p>Hai chỗ chỉnh cho chính xác lời của slide. (1) "Rác" nghĩa là <strong>đủ điều kiện bị thu gom (eligible for GC)</strong>: cả hai đối tượng vẫn còn trong bộ nhớ sau khối lệnh và sau <code>obj1 = null</code>; chúng chỉ biến mất khi một lần thu gom chạy. (2) Thứ trở thành rác là các <em>đối tượng</em>, không bao giờ là <code>y</code> hay <code>t</code>: biến nguyên thuỷ nằm trong khung stack và biến mất cùng khung — GC không đụng tới stack.</p>
<p>➕ Câu FE kinh điển: <code>String s = "aaa"; String t = new String(s); t += "zzz"; t = t.substring(0); t = null;</code> — String tạo ở dòng 2 đủ điều kiện thu gom từ khi nào? Sau <strong>dòng 3</strong>: <code>t += "zzz"</code> dựng một String <em>mới</em> rồi chuyển <code>t</code> sang nó, nên không còn gì trỏ tới đối tượng của dòng 2. Quiz của chương kiểm câu này bằng chương trình chạy thật.</p>`],
      [9, 'Garbage Collection — can we call the collector?',
        `<p class="y-chinh">🎯 The slide: the garbage collector has the lowest priority, so it runs only when the program's memory is exhausted; it is called by the JVM only — "we can not activate it".</p>
<p>Look again at the last two runs of slide 7's program. With <code>-verbose:gc</code>, a call to <code>System.gc()</code> on JDK 8 produced a real <strong>Full GC (System.gc())</strong> and the watched object was collected. With the switch <code>-XX:+DisableExplicitGC</code> the very same call did <strong>nothing</strong> and the object stayed. Both behaviours are allowed, because the API documentation says <code>System.gc()</code> only <em>"suggests that the Java Virtual Machine expend effort toward recycling unused objects"</em>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9cd4443654533ebee4f2975e0ae15d6ed1a5bd99.svg" alt="The life of an object: reachable → unreachable (eligible) → collected when the GC runs" loading="lazy" /><p class="chu-thich">🧩 The life of an object: reachable → unreachable (eligible) → collected when the GC runs</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 7 and 9 — the life of an object, and what really triggers the garbage collector
[*] --&gt; Reachable : new
Reachable : at least one live reference\\n(local, field, static, array slot)
Reachable --&gt; Unreachable : last reference gone\\n(x = null, x = other object,\\nscope ends, method returns)
Unreachable : "eligible for GC"\\nstill occupies memory
Unreachable --&gt; Collected : the GC runs
Collected : memory reused
Collected --&gt; [*]
note right of Unreachable
  The GC runs when an allocation does not fit
  (young space full: "GC (Allocation Failure)"),
  many times per second in a busy program —
  not only when the WHOLE heap is exhausted.
  System.gc() is a request the JVM may ignore
  (-XX:+DisableExplicitGC).
end note
@enduml</code></pre></details>
<p>So the accurate sentence is: <strong>you can request a collection, you cannot force one</strong>, and well-written programs almost never call <code>System.gc()</code>. The collector decides by itself, mostly when a <code>new</code> does not fit (slide 7). The slide's first bullet is outdated for the reason measured there.</p>
<div class="pitfall">FE: "Which method can be used to request garbage collection?" → <code>System.gc()</code> (or <code>Runtime.getRuntime().gc()</code>). "Does System.gc() guarantee that garbage is collected?" → <strong>No</strong>. Older FE banks also mention <code>finalize()</code>: it is deprecated since Java 9 and may never run — do not put logic in it.</div>
<div class="callout">🧭 <strong>Go further — LAB211, PRJ301, Spring Boot</strong>: you will not tune the GC in school projects, but you will meet its errors. A <code>static List</code> that keeps every record ever read is a "leak" in Java terms (always reachable ⇒ never collected) and ends in <code>OutOfMemoryError</code> in a long-running Spring Boot server. Production servers are started with an explicit heap size, e.g. <code>java -Xmx512m -jar app.jar</code>.</div>`,
        `<p class="y-chinh">🎯 Slide nói: bộ thu gom rác có độ ưu tiên thấp nhất nên chỉ chạy khi bộ nhớ của chương trình cạn; nó chỉ do JVM gọi — "ta không kích hoạt được".</p>
<p>Xem lại hai lần chạy cuối của chương trình ở slide 7. Với <code>-verbose:gc</code>, lời gọi <code>System.gc()</code> trên JDK 8 đã tạo một lần <strong>Full GC (System.gc())</strong> thật và đối tượng đang theo dõi bị thu gom. Với công tắc <code>-XX:+DisableExplicitGC</code>, cùng lời gọi đó <strong>không làm gì</strong> và đối tượng vẫn còn. Cả hai cách đều hợp lệ, vì tài liệu API ghi <code>System.gc()</code> chỉ <em>"gợi ý (suggests) để Java Virtual Machine bỏ công tái chế các đối tượng không dùng"</em>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9cd4443654533ebee4f2975e0ae15d6ed1a5bd99.svg" alt="Vòng đời một đối tượng: còn với tới được → không còn với tới được (đủ điều kiện) → bị thu gom khi GC chạy" loading="lazy" /><p class="chu-thich">🧩 Vòng đời một đối tượng: còn với tới được → không còn với tới được (đủ điều kiện) → bị thu gom khi GC chạy</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 7 and 9 — the life of an object, and what really triggers the garbage collector
[*] --&gt; Reachable : new
Reachable : at least one live reference\\n(local, field, static, array slot)
Reachable --&gt; Unreachable : last reference gone\\n(x = null, x = other object,\\nscope ends, method returns)
Unreachable : "eligible for GC"\\nstill occupies memory
Unreachable --&gt; Collected : the GC runs
Collected : memory reused
Collected --&gt; [*]
note right of Unreachable
  The GC runs when an allocation does not fit
  (young space full: "GC (Allocation Failure)"),
  many times per second in a busy program —
  not only when the WHOLE heap is exhausted.
  System.gc() is a request the JVM may ignore
  (-XX:+DisableExplicitGC).
end note
@enduml</code></pre></details>
<p>Vậy câu chính xác là: <strong>bạn xin được một lần thu gom, nhưng không ép được</strong>, và chương trình viết tốt gần như không bao giờ gọi <code>System.gc()</code>. Bộ thu gom tự quyết, phần lớn là khi một lệnh <code>new</code> không còn chỗ (slide 7). Gạch đầu dòng thứ nhất của slide đã lỗi thời vì lý do đã đo ở đó.</p>
<div class="pitfall">FE: "Phương thức nào dùng để yêu cầu thu gom rác?" → <code>System.gc()</code> (hoặc <code>Runtime.getRuntime().gc()</code>). "System.gc() có bảo đảm rác được thu gom không?" → <strong>Không</strong>. Ngân hàng FE cũ còn nhắc <code>finalize()</code>: nó bị đánh dấu deprecated từ Java 9 và có thể không bao giờ chạy — đừng đặt logic vào đó.</div>
<div class="callout">🧭 <strong>Đi tiếp — LAB211, PRJ301, Spring Boot</strong>: ở dự án trường bạn sẽ không chỉnh GC, nhưng sẽ gặp lỗi của nó. Một <code>static List</code> giữ mọi bản ghi từng đọc là "rò rỉ" theo nghĩa Java (luôn với tới được ⇒ không bao giờ bị thu gom) và kết thúc bằng <code>OutOfMemoryError</code> trên một server Spring Boot chạy lâu ngày. Server thật được khởi động với kích thước heap rõ ràng, ví dụ <code>java -Xmx512m -jar app.jar</code>.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>In <code>void f() { int n = 3; Student s = new Student(); }</code>, what is on the stack and what is on the heap? What is left after <code>f</code> returns?</li>
<li><code>Point a = new Point(1, 2); Point b = a; b = new Point(1, 2);</code> — how many objects exist, and what does <code>a == b</code> print?</li>
<li>Why did 1000 MB fit through a 32 MB heap in slide 7, and why did the <code>keep</code> run crash?</li>
<li>Is an object collected the moment it becomes unreachable? Which program on this page shows the answer?</li>
</ul>
<p>Next: lesson 2.B — the "Encapsulation" deck: identifying classes, constructors, <code>this</code>, getters and setters.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Trong <code>void f() { int n = 3; Student s = new Student(); }</code>, cái gì nằm trên stack, cái gì nằm trên heap? Sau khi <code>f</code> trả về thì còn lại gì?</li>
<li><code>Point a = new Point(1, 2); Point b = a; b = new Point(1, 2);</code> — có bao nhiêu đối tượng, và <code>a == b</code> in ra gì?</li>
<li>Vì sao ở slide 7 1000 MB đi lọt qua một heap 32 MB, và vì sao lần chạy <code>keep</code> lại sập?</li>
<li>Một đối tượng có bị thu gom ngay lúc nó không còn với tới được không? Chương trình nào trên trang này cho thấy câu trả lời?</li>
</ul>
<p>Tiếp theo: bài 2.B — bộ slide "Encapsulation": nhận diện lớp, constructor, <code>this</code>, getter và setter.</p>`),
    books([
      ['jvms8', '§2.5 "Run-Time Data Areas" (pc register, JVM stacks, heap, method area) and §2.6 "Frames"', 'mục 2.5 "Run-Time Data Areas" (pc register, JVM stacks, heap, method area) và mục 2.6 "Frames"'],
      ['horstmann1', 'Ch. 4.2.1 "Objects and Object Variables" (a variable only refers to an object)', 'Chương 4.2.1 "Objects and Object Variables" (biến chỉ tham chiếu tới đối tượng)'],
      ['fuOffline', 'part "Dynamic Memory" — Static and dynamic heap and stack, Dynamic allocation, Garbage collection', 'phần "Dynamic Memory" — static/dynamic heap và stack, cấp phát động, thu gom rác'],
      ['apiDocs', 'java.lang.System.gc(), java.lang.Runtime (totalMemory, freeMemory, maxMemory), java.lang.ref.WeakReference', 'java.lang.System.gc(), java.lang.Runtime (totalMemory, freeMemory, maxMemory), java.lang.ref.WeakReference'],
    ]),
  ].join('\n'),
};

/* ───────── 2.B — 📑 Slide by slide · Encapsulation (1/3): class design, constructors, this, getters/setters (slides 1–15) ───────── */
const L_pro8_1 = {
  title: '2.B — 📑 Slide by slide · Encapsulation (1/3): class design, constructors, this, getters/setters (slides 1–15)|||2.B — 📑 Học theo từng slide · Encapsulation (1/3): thiết kế lớp, constructor, this, getter/setter (slide 1–15)',
  slug: 'pro192-slide-pro8-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–15 bộ "Encapsulation": đóng gói là gì, tìm lớp từ đề bài (danh từ chính, danh từ phụ, động từ), sơ đồ lớp UML, liên kết thấp và kết dính cao bằng code chạy thật, cú pháp khai báo lớp, constructor (code trên slide 10 không biên dịch được — chạy thật 12 lỗi và sửa), this là biến cục bộ số 0 (xem bằng javap), chữ ký phương thức (lỗi already defined thật), getter/setter và vì sao setName của slide ném NullPointerException, phương thức input()/output() và cái bẫy tạo Scanner mới mỗi lần gọi làm hỏng bài khi máy chấm đổ dữ liệu vào.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.B · school deck "Encapsulation", slides 1–15</span>
<h2>From a problem statement to a class you can trust</h2>
<p class="lead">Lesson 2.A showed where objects live. This deck — the longest of the course — shows how to <strong>design</strong> and <strong>write</strong> the class that objects are made from. Lesson 2.B covers slides 1–15: how to pick classes, fields and methods out of a problem statement, two design rules (low coupling, high cohesion), constructors, the keyword <code>this</code>, and getters/setters. Lesson 2.C (slides 16–25) covers passing arguments and the constructor demos; lesson 3.A (slides 26–40) covers packages, access modifiers and the case study.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>what encapsulation means</td><td>list the five rules of slide 3 and recognise them in a PE class</td></tr>
<tr><td>4–7</td><td>finding classes; UML; coupling; cohesion</td><td>turn a problem statement into a UML class box, and judge a design</td></tr>
<tr><td>8–11</td><td>declaring a class; constructors; <code>this</code></td><td>write constructors and explain <code>this.x = x</code></td></tr>
<tr><td>12–15</td><td>member functions; signatures; getters/setters; input/output</td><td>write validated setters and an <code>input()</code> that works with the PE marker</td></tr>
</tbody>
</table>
<div class="callout"><strong>Two warnings before you start.</strong> The code on slide 10 does <em>not</em> compile (curly quotes, a full stop instead of a semicolon, an undefined variable) — it is compiled below on a real JDK 8 so you can see all the errors once. And slide 15's <code>input()</code> hides a trap that costs real PE marks: it is reproduced below with the input piped in exactly as the marking software does.</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.B · bộ slide "Encapsulation" của trường, slide 1–15</span>
<h2>Từ một đề bài tới một lớp bạn tin được</h2>
<p class="lead">Bài 2.A cho thấy đối tượng sống ở đâu. Bộ slide này — dài nhất môn — dạy cách <strong>thiết kế</strong> và <strong>viết</strong> lớp, thứ mà đối tượng được tạo ra từ đó. Bài 2.B giảng slide 1–15: cách nhặt lớp, trường và phương thức ra khỏi đề bài, hai luật thiết kế (liên kết thấp — low coupling, kết dính cao — high cohesion), constructor (hàm khởi tạo), từ khoá <code>this</code>, và getter/setter. Bài 2.C (slide 16–25) giảng truyền tham số và các demo constructor; bài 3.A (slide 26–40) giảng package, access modifier (bổ từ truy cập) và case study.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>đóng gói nghĩa là gì</td><td>kể năm luật của slide 3 và nhận ra chúng trong một lớp đề PE</td></tr>
<tr><td>4–7</td><td>tìm lớp; UML; liên kết; kết dính</td><td>biến đề bài thành một hộp lớp UML, và đánh giá một thiết kế</td></tr>
<tr><td>8–11</td><td>khai báo lớp; constructor; <code>this</code></td><td>viết constructor và giải thích <code>this.x = x</code></td></tr>
<tr><td>12–15</td><td>phương thức thành viên; chữ ký; getter/setter; nhập/xuất</td><td>viết setter có kiểm tra và một <code>input()</code> chạy đúng với máy chấm PE</td></tr>
</tbody>
</table>
<div class="callout"><strong>Hai lưu ý trước khi học.</strong> Code trên slide 10 <em>không</em> biên dịch được (nháy cong, dấu chấm thay dấu chấm phẩy, một biến không tồn tại) — bên dưới nó được biên dịch trên JDK 8 thật để bạn thấy hết lỗi một lần. Còn <code>input()</code> ở slide 15 giấu một cái bẫy làm mất điểm PE thật: bên dưới nó được tái hiện với dữ liệu đổ vào đúng cách phần mềm chấm làm.</div>`),
    walkHead('pro8', 1, 15),
    walk('pro8', [
      [1, 'Encapsulation',
        `<p class="y-chinh">🎯 Title slide. "Encapsulation" here is the name of the whole deck, but the deck covers much more than the pillar of that name: classes and objects, constructors, methods, packages and access modifiers.</p>
<p>In the syllabus this is CLO5–CLO6 ("design and implement classes", "apply encapsulation") and sessions 7–12 — the core of Progress Test 1 and of PE question 1, which always says "write a class X with the following fields, constructors and methods".</p>
<p class="meo">🧠 Remember the deck as one sentence: <em>a class bundles data with the methods that guard it, and decides who outside may touch what.</em></p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề. "Encapsulation" (đóng gói) ở đây là tên của cả bộ slide, nhưng bộ slide nói nhiều hơn trụ cột cùng tên: lớp và đối tượng, constructor, phương thức, package và access modifier.</p>
<p>Trong đề cương đây là CLO5–CLO6 ("thiết kế và cài đặt lớp", "áp dụng đóng gói") và các buổi 7–12 — lõi của Progress Test 1 và của câu 1 đề PE, câu luôn bắt đầu bằng "viết lớp X với các trường, constructor và phương thức sau".</p>
<p class="meo">🧠 Nhớ cả bộ slide bằng một câu: <em>lớp gói dữ liệu cùng các phương thức canh giữ nó, và quyết định ai bên ngoài được đụng vào cái gì.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Nine goals: class and object, identifying classes, class-design hints, declaring and using a class, the current object, member functions, packages, access modifiers ("a way to hide some members in a class"), and a case study.</p>
<table>
<thead><tr><th>Objective (slide 2)</th><th>Slides</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>Class and object · identifying classes · design hints</td><td>3–7</td><td>2.B</td></tr>
<tr><td>Declaring/using a class · current object (this) · member functions</td><td>8–15</td><td>2.B</td></tr>
<tr><td>Passing arguments · creating objects · constructor demos</td><td>16–25</td><td>2.C</td></tr>
<tr><td>Packages · access modifiers · varargs</td><td>26–33</td><td>3.A</td></tr>
<tr><td>Case study (SportCar) · summary</td><td>34–40</td><td>3.A</td></tr>
</tbody>
</table>
<p>The web lessons 2.1 and 3.1 further down this course are short summaries of the same topics; these three lessons go slide by slide and run everything.</p>`,
        `<p class="y-chinh">🎯 Chín mục tiêu: lớp và đối tượng, nhận diện lớp, gợi ý thiết kế lớp, khai báo và dùng lớp, đối tượng hiện tại, phương thức thành viên (member function), package, access modifier ("cách giấu một số thành viên trong lớp"), và một case study (bài phân tích tình huống).</p>
<table>
<thead><tr><th>Mục tiêu (slide 2)</th><th>Slide</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>Lớp và đối tượng · nhận diện lớp · gợi ý thiết kế</td><td>3–7</td><td>2.B</td></tr>
<tr><td>Khai báo/dùng lớp · đối tượng hiện tại (this) · phương thức thành viên</td><td>8–15</td><td>2.B</td></tr>
<tr><td>Truyền tham số · tạo đối tượng · demo constructor</td><td>16–25</td><td>2.C</td></tr>
<tr><td>Package · access modifier · varargs</td><td>26–33</td><td>3.A</td></tr>
<tr><td>Case study (SportCar) · tóm tắt</td><td>34–40</td><td>3.A</td></tr>
</tbody>
</table>
<p>Các bài web 2.1 và 3.1 phía dưới là bản tóm tắt ngắn của cùng chủ đề; ba bài này đi từng slide và chạy thật mọi thứ.</p>`],
      [3, 'Encapsulation',
        `<p class="y-chinh">🎯 Encapsulation = <strong>aggregation of data and behaviour</strong>: Class = Data (fields/properties) + Methods. Data should be hidden from the outside, all behaviour reached only through methods, every method should check its parameters (a <strong>boundary condition</strong>) so the object's data is always valid; a <strong>constructor</strong> runs when an object is created; <strong>getters/setters</strong> are one way to enforce encapsulation.</p>
<table>
<thead><tr><th>Rule on slide 3</th><th>In Java</th><th>Where you see it run</th></tr></thead>
<tbody>
<tr><td>data hidden from the outside</td><td>fields are <code>private</code></td><td>lesson 3.A, slide 32 (<code>weight has private access</code>)</td></tr>
<tr><td>behaviour only via methods</td><td><code>public</code> methods are the only door</td><td>every program below</td></tr>
<tr><td>boundary condition</td><td><code>if</code> checks in setters and constructors</td><td>slide 14 (<code>setName</code>), the SportCar case study</td></tr>
<tr><td>constructor runs at creation</td><td><code>new X(...)</code> calls <code>X(...)</code></td><td>slides 9–10 and 2.C</td></tr>
<tr><td>getters/setters</td><td><code>getName()</code> / <code>setName(...)</code></td><td>slides 13–14</td></tr>
</tbody>
</table>
<p>The word to underline is <em>always valid</em>: a well-encapsulated object can never be put into an impossible state (a negative GPA, a car with 900 HP), because every way in goes through code that checks. That is what PE graders test with their hidden test cases.</p>
<div class="pitfall">FE: "Which is NOT part of encapsulation?" — choices like "making all fields public" or "accessing data directly from another class" are the wrong ones. Encapsulation = <strong>private data + public methods</strong>.</div>`,
        `<p class="y-chinh">🎯 Đóng gói = <strong>gộp dữ liệu và hành vi</strong>: Lớp = Dữ liệu (trường/thuộc tính) + Phương thức. Dữ liệu nên được giấu khỏi bên ngoài, mọi hành vi chỉ được gọi qua phương thức, mỗi phương thức nên kiểm tra tham số (<strong>điều kiện biên — boundary condition</strong>) để dữ liệu của đối tượng luôn hợp lệ; <strong>constructor</strong> chạy khi đối tượng được tạo; <strong>getter/setter</strong> là một cách để thực thi đóng gói.</p>
<table>
<thead><tr><th>Luật trên slide 3</th><th>Trong Java</th><th>Thấy nó chạy ở đâu</th></tr></thead>
<tbody>
<tr><td>dữ liệu giấu khỏi bên ngoài</td><td>trường là <code>private</code></td><td>bài 3.A, slide 32 (<code>weight has private access</code>)</td></tr>
<tr><td>hành vi chỉ qua phương thức</td><td>phương thức <code>public</code> là cửa duy nhất</td><td>mọi chương trình bên dưới</td></tr>
<tr><td>điều kiện biên</td><td>lệnh <code>if</code> kiểm tra trong setter và constructor</td><td>slide 14 (<code>setName</code>), case study SportCar</td></tr>
<tr><td>constructor chạy khi tạo</td><td><code>new X(...)</code> gọi <code>X(...)</code></td><td>slide 9–10 và bài 2.C</td></tr>
<tr><td>getter/setter</td><td><code>getName()</code> / <code>setName(...)</code></td><td>slide 13–14</td></tr>
</tbody>
</table>
<p>Chữ cần gạch chân là <em>luôn hợp lệ</em>: một đối tượng đóng gói tốt không bao giờ bị đưa vào trạng thái vô lý (GPA âm, ô tô 900 mã lực), vì mọi lối vào đều đi qua code có kiểm tra. Đó chính là thứ người chấm PE kiểm bằng các test case ẩn.</p>
<div class="pitfall">FE: "Điều nào KHÔNG thuộc đóng gói?" — các lựa chọn như "để mọi trường public" hay "truy cập dữ liệu trực tiếp từ lớp khác" là sai. Đóng gói = <strong>dữ liệu private + phương thức public</strong>.</div>`],
      [4, 'How to Identify a Class',
        `<p class="y-chinh">🎯 Read the problem statement: the <strong>main noun</strong> becomes the class, the <strong>nouns that describe it</strong> become fields, the <strong>verbs related to it</strong> become methods. Example: "details of a student include code, name, year of birth, address; write a program to input a student and output him/her" → class <code>Student</code>, fields <code>code, name, bYear, address</code>, methods <code>input(), output()</code>.</p>
<p>(The slide's title says "Identity" — a typo for <em>Identify</em>.) This noun/verb trick is exactly how PE and LAB211 statements are written, so do it on paper before typing. The slide's example, written for real (slide 15 explains why the <code>Scanner</code> is <code>static</code>):</p>
<pre class="trich"><code class="language-java">class Student {
    private static final Scanner SC = new Scanner(System.in);   // ONE Scanner shared by every input() call (see slide 15)

    private String code;                     // auxiliary nouns of the problem → fields
    private String name;
    private int bYear;
    private String address;

    public void input() {                    // verb "input" → method
        System.out.print("code: ");          code = SC.nextLine().trim();
        System.out.print("name: ");          name = SC.nextLine().trim();
        System.out.print("year of birth: "); bYear = Integer.parseInt(SC.nextLine().trim());
        System.out.print("address: ");       address = SC.nextLine().trim();
    }

    public void output() {                   // verb "output" → method
        System.out.println(code + " | " + name + " | " + bYear + " | " + address);
    }
}</code></pre>
<p>Run with this keyboard input:</p>
<pre><code class="language-plaintext">SE190123
Tran Minh Hieu
2005
1 Ba Trieu, Ha Noi</code></pre>
<div class="out">code: name: year of birth: address:<br>
SE190123 | Tran Minh Hieu | 2005 | 1 Ba Trieu, Ha Noi</div>
<p class="meo">🧠 Ask three questions of every noun: is it <em>the thing</em> (class), a <em>detail of the thing</em> (field), or <em>another thing it is related to</em> (a second class, linked by a field — Chapter 4)? "Year of birth" is a detail; "the course a student studies" would be another class.</p>`,
        `<p class="y-chinh">🎯 Đọc đề bài: <strong>danh từ chính</strong> thành lớp, <strong>các danh từ mô tả nó</strong> thành trường, <strong>các động từ liên quan tới nó</strong> thành phương thức. Ví dụ: "thông tin một sinh viên gồm mã, tên, năm sinh, địa chỉ; viết chương trình nhập một sinh viên và xuất ra" → lớp <code>Student</code>, các trường <code>code, name, bYear, address</code>, các phương thức <code>input(), output()</code>.</p>
<p>(Tiêu đề slide ghi "Identity" — gõ nhầm từ <em>Identify</em>, nghĩa là nhận diện.) Mẹo danh từ/động từ này đúng là cách đề PE và LAB211 được viết, nên hãy làm trên giấy trước khi gõ. Ví dụ của slide, viết thật (slide 15 giải thích vì sao <code>Scanner</code> là <code>static</code>):</p>
<pre class="trich"><code class="language-java">class Student {
    private static final Scanner SC = new Scanner(System.in);   // MỘT Scanner dùng chung cho mọi lần gọi input() (xem slide 15)

    private String code;                     // danh từ phụ của đề bài → trường
    private String name;
    private int bYear;
    private String address;

    public void input() {                    // động từ "input" → phương thức
        System.out.print("code: ");          code = SC.nextLine().trim();
        System.out.print("name: ");          name = SC.nextLine().trim();
        System.out.print("year of birth: "); bYear = Integer.parseInt(SC.nextLine().trim());
        System.out.print("address: ");       address = SC.nextLine().trim();
    }

    public void output() {                   // động từ "output" → phương thức
        System.out.println(code + " | " + name + " | " + bYear + " | " + address);
    }
}</code></pre>
<p>Chạy với dữ liệu bàn phím này:</p>
<pre><code class="language-plaintext">SE190123
Tran Minh Hieu
2005
1 Ba Trieu, Ha Noi</code></pre>
<div class="out">code: name: year of birth: address:<br>
SE190123 | Tran Minh Hieu | 2005 | 1 Ba Trieu, Ha Noi</div>
<p class="meo">🧠 Hỏi ba câu với mỗi danh từ: nó là <em>chính sự vật</em> (lớp), <em>một chi tiết của sự vật</em> (trường), hay <em>một sự vật khác có liên quan</em> (lớp thứ hai, nối bằng một trường — Chương 4)? "Năm sinh" là chi tiết; "môn học mà sinh viên đang học" sẽ là một lớp khác.</p>`],
      [5, 'Hints for class design',
        `<p class="y-chinh">🎯 A <strong>UML class diagram</strong> represents the Student class as a box of three compartments: the class name, the fields (<code>Code: String, name: String, bYear: int, address: String</code>) and the methods (<code>Input(): void, output(): void</code>). "We can add more functions."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/dfbbc587cbe40cf6ad3a29e887295f117c6766e3.svg" alt="Slide 5 redrawn with the UML visibility marks the slide leaves out" loading="lazy" /><p class="chu-thich">🧩 Slide 5 redrawn with the UML visibility marks the slide leaves out</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 5 redrawn — the Student class in UML: name, fields, methods
' Visibility added: - private, + public (the slide leaves it out)
class Student {
  - code : String
  - name : String
  - bYear : int
  - address : String
  --
  + input() : void
  + output() : void
}
note right of Student
  compartment 1: class name (main noun)
  compartment 2: fields (describing nouns)
  compartment 3: methods (verbs)
  UML writes  name : Type  — Java writes  Type name
end note
@enduml</code></pre></details>
<p>Two details the slide gets loose, and the PE is strict about: Java names fields and methods in <strong>camelCase</strong> — <code>code</code> and <code>input()</code>, not <code>Code</code> and <code>Input()</code>; and every member should carry a visibility mark: <code>-</code> private, <code>+</code> public (<code>#</code> protected and <code>~</code> default come in lesson 3.A).</p>
<p>Reading a PE paper is the reverse of this slide: the paper gives you exactly such a box (<code>-id: int</code>, <code>+getStoreName(): String</code>…), and you translate each line to Java. UML writes <code>name : Type</code>; Java writes <code>Type name</code>.</p>
<div class="pitfall">PE trap: the automatic marker calls your methods by the <strong>exact names</strong> in the diagram. <code>getTotalrevenue()</code> instead of <code>getTotalRevenue()</code> compiles in your project and gets 0 for that test case.</div>`,
        `<p class="y-chinh">🎯 <strong>Sơ đồ lớp UML</strong> biểu diễn lớp Student bằng một hộp ba ngăn: tên lớp, các trường (<code>Code: String, name: String, bYear: int, address: String</code>) và các phương thức (<code>Input(): void, output(): void</code>). "Có thể thêm các hàm khác."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/dfbbc587cbe40cf6ad3a29e887295f117c6766e3.svg" alt="Slide 5 vẽ lại, có các dấu mức truy cập UML mà slide bỏ trống" loading="lazy" /><p class="chu-thich">🧩 Slide 5 vẽ lại, có các dấu mức truy cập UML mà slide bỏ trống</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 5 redrawn — the Student class in UML: name, fields, methods
' Thêm mức truy cập: - private, + public (slide bỏ trống)
class Student {
  - code : String
  - name : String
  - bYear : int
  - address : String
  --
  + input() : void
  + output() : void
}
note right of Student
  compartment 1: class name (main noun)
  compartment 2: fields (describing nouns)
  compartment 3: methods (verbs)
  UML writes  name : Type  — Java writes  Type name
end note
@enduml</code></pre></details>
<p>Hai chi tiết slide viết lỏng mà đề PE thì khắt khe: Java đặt tên trường và phương thức theo <strong>camelCase</strong> — <code>code</code> và <code>input()</code>, không phải <code>Code</code> và <code>Input()</code>; và mỗi thành viên nên mang dấu mức truy cập: <code>-</code> private, <code>+</code> public (<code>#</code> protected và <code>~</code> default học ở bài 3.A).</p>
<p>Đọc đề PE là làm ngược slide này: đề cho bạn đúng một hộp như vậy (<code>-id: int</code>, <code>+getStoreName(): String</code>…), và bạn dịch từng dòng sang Java. UML viết <code>tên : Kiểu</code>; Java viết <code>Kiểu tên</code>.</p>
<div class="pitfall">Bẫy PE: máy chấm tự động gọi phương thức của bạn bằng <strong>đúng tên</strong> trong sơ đồ. Viết <code>getTotalrevenue()</code> thay vì <code>getTotalRevenue()</code> vẫn biên dịch được trong project của bạn nhưng test case đó nhận 0 điểm.</div>`],
      [6, 'Hints for class design',
        `<p class="y-chinh">🎯 Identifying classes — <strong>coupling</strong> is an object's reliance on knowledge of the internals of another entity. When A is <strong>tightly coupled</strong> to B, anyone who wants to use or change A needs too much knowledge of B. The slide: a Head that contains Eye1 and Eye2 inside itself = high coupling (bad); a Head with <code>leftEye</code> and <code>rightEye</code> that refer to two Eye objects = low coupling (good).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f1f56afc0b1bf8f339b607bcce6a8a5da599de3b.svg" alt="Slide 6 redrawn: everything about the eyes inside Head, versus Head talking to two Eye objects" loading="lazy" /><p class="chu-thich">🧩 Slide 6 redrawn: everything about the eyes inside Head, versus Head talking to two Eye objects</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 6 redrawn — high coupling versus low coupling (program GhepNoi)
hide empty members
package "High coupling (bad design)" {
  class HeadTight {
    eye1Sight : double
    eye2Sight : double
    eye1Open : boolean
    eye2Open : boolean
    --
    look() : String
  }
  note bottom of HeadTight
    every detail of both eyes is
    stored and handled by Head
  end note
}
package "Low coupling (good design)" {
  class Head {
    - leftEye : Eye
    - rightEye : Eye
    --
    + look() : String
    + winkLeft() : void
  }
  class Eye {
    - sight : double
    - open : boolean
    --
    + close() : void
    + usefulSight() : double
  }
  Head *-- "2" Eye : leftEye, rightEye
}
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slide 6: coupling. Bad: Head knows the inside of every eye. Good: Head only talks to Eye objects through Eye's methods

class HeadTight {                            // HIGH coupling: the eye's details are spread into Head
    double eye1Sight = 1.0, eye2Sight = 0.6; // every "eye" fact is a field of Head
    boolean eye1Open = true, eye2Open = true;

    String look() {
        double best = 0;
        if (eye1Open &amp;&amp; eye1Sight &gt; best) best = eye1Sight;   // Head must know how sight and open/closed work
        if (eye2Open &amp;&amp; eye2Sight &gt; best) best = eye2Sight;
        return "HeadTight sees with sight " + best;
    }
}

class Eye {                                  // LOW coupling: everything about an eye lives here
    private double sight;
    private boolean open = true;
    Eye(double sight) { this.sight = sight; }
    void close() { open = false; }
    double usefulSight() { return open ? sight : 0; }        // the ONLY thing Head needs to ask
}

class Head {
    private final Eye leftEye = new Eye(1.0);
    private final Eye rightEye = new Eye(0.6);

    String look() { return "Head sees with sight " + Math.max(leftEye.usefulSight(), rightEye.usefulSight()); }
    void winkLeft() { leftEye.close(); }
}

public class GhepNoi {
    public static void main(String[] args) {
        System.out.println(new HeadTight().look());
        Head h = new Head();
        System.out.println(h.look());
        h.winkLeft();
        System.out.println(h.look() + "   (after winking the left eye)");
    }
}</code></pre>
<div class="out">HeadTight sees with sight 1.0<br>
Head sees with sight 1.0<br>
Head sees with sight 0.6 &nbsp;&nbsp;(after winking the left eye)</div>
<p>Both heads "see" the same, but compare what a change costs. Add "an eye can wear glasses": in <code>HeadTight</code> you add two more fields and edit <code>look()</code>; in the good design you change only <code>Eye.usefulSight()</code> — <code>Head</code> does not even recompile its logic. Low coupling = each class knows the others only through their <strong>public methods</strong>.</p>
<p class="meo">🧠 Smell test: if a class has fields named <code>thing1X, thing1Y, thing2X, thing2Y</code>, a class called <code>Thing</code> is missing.</p>`,
        `<p class="y-chinh">🎯 Nhận diện lớp — <strong>độ liên kết (coupling)</strong> là mức một đối tượng phải dựa vào hiểu biết về ruột của một thực thể khác. Khi A <strong>liên kết chặt</strong> với B, ai muốn dùng hay sửa A đều phải biết quá nhiều về B. Slide: một Head chứa Eye1 và Eye2 ngay bên trong nó = liên kết cao (tệ); một Head có <code>leftEye</code> và <code>rightEye</code> tham chiếu tới hai đối tượng Eye = liên kết thấp (tốt).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f1f56afc0b1bf8f339b607bcce6a8a5da599de3b.svg" alt="Slide 6 vẽ lại: mọi thứ về mắt nằm trong Head, so với Head nói chuyện với hai đối tượng Eye" loading="lazy" /><p class="chu-thich">🧩 Slide 6 vẽ lại: mọi thứ về mắt nằm trong Head, so với Head nói chuyện với hai đối tượng Eye</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 6 redrawn — high coupling versus low coupling (program GhepNoi)
hide empty members
package "High coupling (bad design)" {
  class HeadTight {
    eye1Sight : double
    eye2Sight : double
    eye1Open : boolean
    eye2Open : boolean
    --
    look() : String
  }
  note bottom of HeadTight
    every detail of both eyes is
    stored and handled by Head
  end note
}
package "Low coupling (good design)" {
  class Head {
    - leftEye : Eye
    - rightEye : Eye
    --
    + look() : String
    + winkLeft() : void
  }
  class Eye {
    - sight : double
    - open : boolean
    --
    + close() : void
    + usefulSight() : double
  }
  Head *-- "2" Eye : leftEye, rightEye
}
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slide 6: độ liên kết. Tệ: Head biết ruột của từng con mắt. Tốt: Head chỉ nói chuyện với đối tượng Eye qua phương thức của Eye

class HeadTight {                            // liên kết CAO: chi tiết của mắt bị rải vào Head
    double eye1Sight = 1.0, eye2Sight = 0.6; // mọi thông tin "mắt" là trường của Head
    boolean eye1Open = true, eye2Open = true;

    String look() {
        double best = 0;
        if (eye1Open &amp;&amp; eye1Sight &gt; best) best = eye1Sight;   // Head phải biết thị lực và nhắm/mở hoạt động ra sao
        if (eye2Open &amp;&amp; eye2Sight &gt; best) best = eye2Sight;
        return "HeadTight sees with sight " + best;
    }
}

class Eye {                                  // liên kết THẤP: mọi thứ về mắt nằm ở đây
    private double sight;
    private boolean open = true;
    Eye(double sight) { this.sight = sight; }
    void close() { open = false; }
    double usefulSight() { return open ? sight : 0; }        // thứ DUY NHẤT Head cần hỏi
}

class Head {
    private final Eye leftEye = new Eye(1.0);
    private final Eye rightEye = new Eye(0.6);

    String look() { return "Head sees with sight " + Math.max(leftEye.usefulSight(), rightEye.usefulSight()); }
    void winkLeft() { leftEye.close(); }
}

public class GhepNoi {
    public static void main(String[] args) {
        System.out.println(new HeadTight().look());
        Head h = new Head();
        System.out.println(h.look());
        h.winkLeft();
        System.out.println(h.look() + "   (after winking the left eye)");
    }
}</code></pre>
<div class="out">HeadTight sees with sight 1.0<br>
Head sees with sight 1.0<br>
Head sees with sight 0.6 &nbsp;&nbsp;(after winking the left eye)</div>
<p>Hai cái đầu "nhìn" như nhau, nhưng hãy so cái giá của một thay đổi. Thêm ý "mắt có thể đeo kính": ở <code>HeadTight</code> bạn thêm hai trường nữa và sửa <code>look()</code>; ở thiết kế tốt bạn chỉ sửa <code>Eye.usefulSight()</code> — logic của <code>Head</code> không đổi một dòng. Liên kết thấp = mỗi lớp chỉ biết các lớp khác qua <strong>phương thức public</strong> của chúng.</p>
<p class="meo">🧠 Phép thử mùi: nếu một lớp có các trường tên <code>thing1X, thing1Y, thing2X, thing2Y</code>, thì đang thiếu một lớp tên <code>Thing</code>.</p>`],
      [7, 'Hints for class design',
        `<p class="y-chinh">🎯 Implementing methods — <strong>cohesion</strong> is the degree to which a class or method resists being broken into smaller pieces. A method <code>M()</code> that performs Operation 1 and Operation 2 together has <strong>low cohesion</strong> (bad); splitting it into <code>M1()</code> and <code>M2()</code>, with <code>M()</code> calling both, gives <strong>high cohesion</strong> (good).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/1550595aefce6f4a37f4c230ad46cbbc0b241ee4.svg" alt="Slide 7 redrawn: one method doing two jobs, versus one job per method" loading="lazy" /><p class="chu-thich">🧩 Slide 7 redrawn: one method doing two jobs, versus one job per method</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 7 redrawn — low cohesion versus high cohesion (program KetDinh)
hide empty members
class OrderLow {
  prices : double[]
  --
  m() : void
}
note bottom of OrderLow
  m() = operation 1 (compute total)
      + operation 2 (print receipt)
  the total cannot be reused
end note
class OrderHigh {
  prices : double[]
  --
  m1Total() : double
  m2Receipt(total : double) : String
  m() : void
}
note bottom of OrderHigh
  m1Total(): operation 1 only
  m2Receipt(): operation 2 only
  m() just calls m1Total() then m2Receipt()
end note
OrderLow -[hidden]right- OrderHigh
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slide 7: cohesion. M() doing two jobs at once versus M1() + M2() each doing one job, with M() calling both
class OrderLow {                                             // LOW cohesion: one method mixes "compute" and "print"
    double[] prices = {12.5, 8.0, 20.0};
    void m() {
        double total = 0;                                    // operation 1: compute
        for (double p : prices) total += p;
        if (total &gt; 30) total = total * 0.9;
        System.out.println("TOTAL: " + total);               // operation 2: print
    }
}

class OrderHigh {                                            // HIGH cohesion: each method does one thing well
    double[] prices = {12.5, 8.0, 20.0};
    double m1Total() {                                       // operation 1 only
        double total = 0;
        for (double p : prices) total += p;
        return total &gt; 30 ? total * 0.9 : total;
    }
    String m2Receipt(double total) { return "TOTAL: " + total; }   // operation 2 only
    void m() { System.out.println(m2Receipt(m1Total())); }        // M() = M1() then M2(), like the slide
}

public class KetDinh {
    public static void main(String[] args) {
        new OrderLow().m();
        OrderHigh o = new OrderHigh();
        o.m();
        double t = o.m1Total();                              // reuse: the total alone, e.g. for a discount check
        System.out.println("free shipping? " + (t &gt;= 30));   // impossible with OrderLow: its total is trapped inside m()
    }
}</code></pre>
<div class="out">TOTAL: 36.45<br>
TOTAL: 36.45<br>
free shipping? true</div>
<p>Same output, but only <code>OrderHigh</code> can answer a new question ("is shipping free?") without copying code, because the total is computed by a method that does nothing else. A highly cohesive method is short, has a name that says exactly what it does, and returns a value instead of printing it.</p>
<div class="callout">🧭 <strong>Go further — LAB211 and PE</strong>: graders reward exactly this: one method per menu function, input separated from logic (<code>input()</code> reads, <code>calculate()</code> computes, <code>display()</code> prints). PE methods like <code>getTotalRevenue()</code> must <em>return</em> the value — printing inside them breaks the marker's comparison.</div>`,
        `<p class="y-chinh">🎯 Cài đặt phương thức — <strong>độ kết dính (cohesion)</strong> là mức một lớp hay phương thức "khó bị tách" thành các mảnh nhỏ hơn. Một phương thức <code>M()</code> làm cả Thao tác 1 lẫn Thao tác 2 có <strong>kết dính thấp</strong> (tệ); tách nó thành <code>M1()</code> và <code>M2()</code>, rồi <code>M()</code> gọi cả hai, là <strong>kết dính cao</strong> (tốt).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/1550595aefce6f4a37f4c230ad46cbbc0b241ee4.svg" alt="Slide 7 vẽ lại: một phương thức làm hai việc, so với mỗi phương thức một việc" loading="lazy" /><p class="chu-thich">🧩 Slide 7 vẽ lại: một phương thức làm hai việc, so với mỗi phương thức một việc</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 7 redrawn — low cohesion versus high cohesion (program KetDinh)
hide empty members
class OrderLow {
  prices : double[]
  --
  m() : void
}
note bottom of OrderLow
  m() = operation 1 (compute total)
      + operation 2 (print receipt)
  the total cannot be reused
end note
class OrderHigh {
  prices : double[]
  --
  m1Total() : double
  m2Receipt(total : double) : String
  m() : void
}
note bottom of OrderHigh
  m1Total(): operation 1 only
  m2Receipt(): operation 2 only
  m() just calls m1Total() then m2Receipt()
end note
OrderLow -[hidden]right- OrderHigh
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slide 7: độ kết dính. M() làm hai việc một lúc so với M1() + M2() mỗi cái làm một việc, còn M() gọi cả hai
class OrderLow {                                             // kết dính THẤP: một phương thức trộn "tính" và "in"
    double[] prices = {12.5, 8.0, 20.0};
    void m() {
        double total = 0;                                    // thao tác 1: tính
        for (double p : prices) total += p;
        if (total &gt; 30) total = total * 0.9;
        System.out.println("TOTAL: " + total);               // thao tác 2: in
    }
}

class OrderHigh {                                            // kết dính CAO: mỗi phương thức làm tốt một việc
    double[] prices = {12.5, 8.0, 20.0};
    double m1Total() {                                       // chỉ thao tác 1
        double total = 0;
        for (double p : prices) total += p;
        return total &gt; 30 ? total * 0.9 : total;
    }
    String m2Receipt(double total) { return "TOTAL: " + total; }   // chỉ thao tác 2
    void m() { System.out.println(m2Receipt(m1Total())); }        // M() = M1() rồi M2(), như slide
}

public class KetDinh {
    public static void main(String[] args) {
        new OrderLow().m();
        OrderHigh o = new OrderHigh();
        o.m();
        double t = o.m1Total();                              // dùng lại: chỉ lấy tổng, vd để kiểm khuyến mãi
        System.out.println("free shipping? " + (t &gt;= 30));   // với OrderLow là không thể: tổng bị nhốt trong m()
    }
}</code></pre>
<div class="out">TOTAL: 36.45<br>
TOTAL: 36.45<br>
free shipping? true</div>
<p>Cùng output, nhưng chỉ <code>OrderHigh</code> trả lời được một câu hỏi mới ("có miễn phí giao hàng không?") mà không phải chép code, vì tổng tiền được tính bởi một phương thức không làm gì khác. Phương thức kết dính cao thì ngắn, có cái tên nói đúng việc nó làm, và trả về giá trị thay vì in ra.</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211 và PE</strong>: người chấm thưởng điểm đúng cho điều này: mỗi chức năng menu một phương thức, tách nhập khỏi xử lý (<code>input()</code> đọc, <code>calculate()</code> tính, <code>display()</code> in). Phương thức trong đề PE như <code>getTotalRevenue()</code> phải <em>trả về</em> giá trị — in ra bên trong là làm hỏng phép so sánh của máy chấm.</div>`],
      [8, 'Declaring/Using a Java Class',
        `<p class="y-chinh">🎯 The general form: <code>[public] class ClassName [extends FatherClass] { [modifier] Type field [= value]; ... [modifier] ClassName(params) { code } ... [modifier] Type methodName(params) { code } }</code>. How many constructors? <strong>As many as the ways you need to initialise an object.</strong> What goes inside one? Usually code that gives values to the descriptive fields.</p>
<p>Square brackets mean "optional". The same form, filled in — two ways to create a <code>Course</code>, so two constructors:</p>
<pre><code class="language-java">// release: 8
// Slide 8: the general shape of a class, filled in with real names — fields with optional initial values, constructors, methods

class Course {                                   // [public] class ClassName [extends FatherClass] {
    String code;                                 // [modifier] Type field1;
    int credits = 3;                             // [modifier] Type field2 = value;  (initial value)

    Course(String code) {                        // way 1 to initialise: only the code
        this.code = code;
    }
    Course(String code, int credits) {           // way 2: code and credits
        this.code = code;
        this.credits = credits;
    }

    String describe() {                          // [modifier] Type methodName(Type var1, ...) { ... }
        return code + " (" + credits + " credits)";
    }
}

public class KhaiBaoLop {
    public static void main(String[] args) {
        Course a = new Course("PRO192");             // two ways to create a Course ⇒ two constructors
        Course b = new Course("DEMO101", 2);
        System.out.println(a.describe() + "   &lt;- credits kept its initial value 3");
        System.out.println(b.describe());
    }
}</code></pre>
<div class="out">PRO192 (3 credits) &nbsp;&nbsp;&lt;- credits kept its initial value 3<br>
DEMO101 (2 credits)</div>
<table>
<thead><tr><th>Part</th><th>Required?</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>public</code> before <code>class</code></td><td>optional</td><td>a public class must live in a file with the same name (<code>Course.java</code>)</td></tr>
<tr><td><code>extends FatherClass</code></td><td>optional</td><td>Chapter 4; without it the class extends <code>Object</code></td></tr>
<tr><td>field initial value (<code>= 3</code>)</td><td>optional</td><td>without it a field starts at 0 / false / null (lesson 2.C)</td></tr>
<tr><td>constructor</td><td>optional</td><td>none written ⇒ the compiler adds one (slide 9)</td></tr>
</tbody>
</table>
<div class="pitfall">The order inside a class does not matter to the compiler (fields can be declared after the methods that use them), but every PE solution and every NetBeans template uses the order of this slide: fields → constructors → getters/setters → other methods. Keep it — graders read your code.</div>`,
        `<p class="y-chinh">🎯 Dạng tổng quát: <code>[public] class TênLớp [extends LớpCha] { [modifier] Kiểu trường [= giá_trị]; ... [modifier] TênLớp(tham_số) { code } ... [modifier] Kiểu tênPhươngThức(tham_số) { code } }</code>. Cần bao nhiêu constructor? <strong>Bằng số cách bạn cần để khởi tạo một đối tượng.</strong> Bên trong viết gì? Thường là code gán giá trị cho các trường mô tả.</p>
<p>Ngoặc vuông nghĩa là "tuỳ chọn". Cùng dạng đó, điền tên thật — có hai cách tạo <code>Course</code> nên có hai constructor:</p>
<pre><code class="language-java">// release: 8
// Slide 8: hình dạng chung của một lớp, điền tên thật — trường có thể có giá trị khởi đầu, constructor, phương thức

class Course {                                   // [public] class TênLớp [extends LớpCha] {
    String code;                                 // [modifier] Kiểu trường1;
    int credits = 3;                             // [modifier] Kiểu trường2 = giá_trị;  (giá trị khởi đầu)

    Course(String code) {                        // cách khởi tạo 1: chỉ mã môn
        this.code = code;
    }
    Course(String code, int credits) {           // cách 2: mã môn và số tín chỉ
        this.code = code;
        this.credits = credits;
    }

    String describe() {                          // [modifier] Kiểu tênPhươngThức(Kiểu biến1, ...) { ... }
        return code + " (" + credits + " credits)";
    }
}

public class KhaiBaoLop {
    public static void main(String[] args) {
        Course a = new Course("PRO192");             // hai cách tạo Course ⇒ hai constructor
        Course b = new Course("DEMO101", 2);
        System.out.println(a.describe() + "   &lt;- credits kept its initial value 3");
        System.out.println(b.describe());
    }
}</code></pre>
<div class="out">PRO192 (3 credits) &nbsp;&nbsp;&lt;- credits kept its initial value 3<br>
DEMO101 (2 credits)</div>
<table>
<thead><tr><th>Phần</th><th>Bắt buộc?</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>public</code> trước <code>class</code></td><td>tuỳ chọn</td><td>lớp public phải nằm trong file cùng tên (<code>Course.java</code>)</td></tr>
<tr><td><code>extends LớpCha</code></td><td>tuỳ chọn</td><td>Chương 4; không có thì lớp kế thừa <code>Object</code></td></tr>
<tr><td>giá trị khởi đầu của trường (<code>= 3</code>)</td><td>tuỳ chọn</td><td>không có thì trường bắt đầu bằng 0 / false / null (bài 2.C)</td></tr>
<tr><td>constructor</td><td>tuỳ chọn</td><td>không viết cái nào ⇒ trình biên dịch tự thêm một cái (slide 9)</td></tr>
</tbody>
</table>
<div class="pitfall">Thứ tự bên trong lớp không quan trọng với trình biên dịch (trường khai báo sau phương thức dùng nó vẫn được), nhưng mọi lời giải PE và mọi khuôn NetBeans đều dùng thứ tự của slide này: trường → constructor → getter/setter → phương thức khác. Giữ thứ tự đó — người chấm đọc code của bạn.</div>`],
      [9, 'Constructors',
        `<p class="y-chinh">🎯 Constructors are invoked to create objects from the class blueprint. A constructor looks like a method but uses the <strong>name of the class</strong> and has <strong>no return type</strong>. The compiler automatically provides a <strong>no-argument default constructor</strong> for any class <em>without</em> constructors.</p>
<p>The last sentence is visible in the bytecode. Class <code>IntPoint1</code> (slide 20) has no constructor in its source; <code>javap</code> on JDK 8 shows one anyway — <code>public point1.IntPoint1()</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "point1/IntPoint1.java",                       // slide 20, as on the slide: no constructor at all
        "package point1;\\n" +
        "public class IntPoint1 {\\n" +
        "    int x;\\n" +
        "    int y;\\n" +
        "    // If no constructor is implemented, the compiler will insert\\n" +
        "    // automatically a default constructor to the class\\n" +
        "    public void output() {\\n" +
        "        System.out.println(\\"[\\" + x + \\",\\" + y + \\"]\\");\\n" +
        "    }\\n" +
        "}\\n");
    viet(lab, "point1/IntPoint1_Use.java",
        "package point1;\\n" +
        "public class IntPoint1_Use {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        // Create a point using default constructor\\n" +
        "        IntPoint1 p = new IntPoint1();\\n" +
        "        p.output();\\n" +
        "    }\\n" +
        "}\\n");
    new File(lab, "classes").mkdirs();                        // javac 8 does not create the -d folder itself (NetBeans makes build/classes)
    lenh(lab, "javac", "-d", "classes", "point1/IntPoint1.java", "point1/IntPoint1_Use.java");
    lenh(lab, "java", "-cp", "classes", "point1.IntPoint1_Use");
    lenh(lab, "javap", "-c", "-cp", "classes", "point1.IntPoint1");   // what did the compiler put into IntPoint1.class?

    viet(lab, "point1/IntPoint2.java",                       // slides 22–24: we write a constructor ourselves
        "package point1;\\n" +
        "public class IntPoint2 {\\n" +
        "    int x;\\n" +
        "    int y;\\n" +
        "    public IntPoint2(int x, int y) {\\n" +
        "        this.x = x;\\n" +
        "        this.y = y;\\n" +
        "    }\\n" +
        "}\\n");
    viet(lab, "point1/IntPoint2_Use.java",
        "package point1;\\n" +
        "public class IntPoint2_Use {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        IntPoint2 p = new IntPoint2();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "-d", "classes", "point1/IntPoint2.java", "point1/IntPoint2_Use.java");
}</code></pre>
<div class="out">&gt; javac -d classes point1/IntPoint1.java point1/IntPoint1_Use.java<br>
&gt; java -cp classes point1.IntPoint1_Use<br>
[0,0]<br>
&gt; javap -c -cp classes point1.IntPoint1<br>
Compiled from "IntPoint1.java"<br>
public class point1.IntPoint1 {<br>
&nbsp;&nbsp;int x;<br>
<br>
&nbsp;&nbsp;int y;<br>
<br>
&nbsp;&nbsp;public point1.IntPoint1();<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokespecial #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/Object."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: return<br>
<br>
&nbsp;&nbsp;public void output();<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: getstatic &nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field java/lang/System.out:Ljava/io/PrintStream;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class java/lang/StringBuilder<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: dup<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7: invokespecial #4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String [<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12: invokevirtual #6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16: getfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field x:I<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19: invokevirtual #8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String ,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24: invokevirtual #6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28: getfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field y:I<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31: invokevirtual #8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String ]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;36: invokevirtual #6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;39: invokevirtual #12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.toString:()Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;42: invokevirtual #13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/io/PrintStream.println:(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45: return<br>
}<br>
&gt; javac -d classes point1/IntPoint2.java point1/IntPoint2_Use.java<br>
point1/IntPoint2_Use.java:4: error: constructor IntPoint2 in class IntPoint2 cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IntPoint2 p = new IntPoint2();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: int,int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)</div>
<p>Three bytes of code: load <code>this</code>, call the parent's constructor <code>Object.&lt;init&gt;</code>, return. It does not "clear bits" or set any value — keep that in mind for slide 20. The last command is slide 24 in advance: as soon as you write <em>one</em> constructor yourself, the free no-argument one is gone.</p>
<div class="pitfall">FE classics: "Which is a characteristic of constructors?" → <strong>same name as the class</strong>. "Can a constructor be overridden?" → <strong>no</strong> (it is not inherited); it <em>can</em> be overloaded. <code>void Employee() {}</code> is not a constructor — with a return type it is an ordinary method that happens to have the class's name.</div>`,
        `<p class="y-chinh">🎯 Constructor được gọi để tạo đối tượng từ bản thiết kế là lớp. Constructor trông giống phương thức nhưng dùng <strong>tên của lớp</strong> và <strong>không có kiểu trả về</strong>. Trình biên dịch tự cấp một <strong>constructor mặc định không tham số (default constructor)</strong> cho mọi lớp <em>không có</em> constructor nào.</p>
<p>Câu cuối nhìn thấy được trong bytecode. Lớp <code>IntPoint1</code> (slide 20) không có constructor trong mã nguồn; vậy mà <code>javap</code> trên JDK 8 vẫn cho thấy một cái — <code>public point1.IntPoint1()</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "point1/IntPoint1.java",                       // slide 20, đúng như slide: không có constructor nào
        "package point1;\\n" +
        "public class IntPoint1 {\\n" +
        "    int x;\\n" +
        "    int y;\\n" +
        "    // If no constructor is implemented, the compiler will insert\\n" +
        "    // automatically a default constructor to the class\\n" +
        "    public void output() {\\n" +
        "        System.out.println(\\"[\\" + x + \\",\\" + y + \\"]\\");\\n" +
        "    }\\n" +
        "}\\n");
    viet(lab, "point1/IntPoint1_Use.java",
        "package point1;\\n" +
        "public class IntPoint1_Use {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        // Create a point using default constructor\\n" +
        "        IntPoint1 p = new IntPoint1();\\n" +
        "        p.output();\\n" +
        "    }\\n" +
        "}\\n");
    new File(lab, "classes").mkdirs();                        // javac 8 không tự tạo thư mục -d (NetBeans tạo sẵn build/classes)
    lenh(lab, "javac", "-d", "classes", "point1/IntPoint1.java", "point1/IntPoint1_Use.java");
    lenh(lab, "java", "-cp", "classes", "point1.IntPoint1_Use");
    lenh(lab, "javap", "-c", "-cp", "classes", "point1.IntPoint1");   // trình biên dịch đã đặt gì vào IntPoint1.class?

    viet(lab, "point1/IntPoint2.java",                       // slide 22–24: ta tự viết một constructor
        "package point1;\\n" +
        "public class IntPoint2 {\\n" +
        "    int x;\\n" +
        "    int y;\\n" +
        "    public IntPoint2(int x, int y) {\\n" +
        "        this.x = x;\\n" +
        "        this.y = y;\\n" +
        "    }\\n" +
        "}\\n");
    viet(lab, "point1/IntPoint2_Use.java",
        "package point1;\\n" +
        "public class IntPoint2_Use {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        IntPoint2 p = new IntPoint2();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "-d", "classes", "point1/IntPoint2.java", "point1/IntPoint2_Use.java");
}</code></pre>
<div class="out">&gt; javac -d classes point1/IntPoint1.java point1/IntPoint1_Use.java<br>
&gt; java -cp classes point1.IntPoint1_Use<br>
[0,0]<br>
&gt; javap -c -cp classes point1.IntPoint1<br>
Compiled from "IntPoint1.java"<br>
public class point1.IntPoint1 {<br>
&nbsp;&nbsp;int x;<br>
<br>
&nbsp;&nbsp;int y;<br>
<br>
&nbsp;&nbsp;public point1.IntPoint1();<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokespecial #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/Object."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: return<br>
<br>
&nbsp;&nbsp;public void output();<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: getstatic &nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field java/lang/System.out:Ljava/io/PrintStream;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class java/lang/StringBuilder<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: dup<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7: invokespecial #4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String [<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12: invokevirtual #6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16: getfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field x:I<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19: invokevirtual #8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String ,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24: invokevirtual #6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28: getfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field y:I<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31: invokevirtual #8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String ]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;36: invokevirtual #6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;39: invokevirtual #12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/StringBuilder.toString:()Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;42: invokevirtual #13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/io/PrintStream.println:(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45: return<br>
}<br>
&gt; javac -d classes point1/IntPoint2.java point1/IntPoint2_Use.java<br>
point1/IntPoint2_Use.java:4: error: constructor IntPoint2 in class IntPoint2 cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IntPoint2 p = new IntPoint2();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: int,int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)</div>
<p>Ba lệnh: nạp <code>this</code>, gọi constructor của lớp cha <code>Object.&lt;init&gt;</code>, trả về. Nó không "xoá bit" và không gán giá trị nào — nhớ điều này cho slide 20. Lệnh cuối cùng là slide 24 đến sớm: ngay khi bạn tự viết <em>một</em> constructor, cái constructor không tham số miễn phí biến mất.</p>
<div class="pitfall">Câu FE kinh điển: "Đặc điểm nào là của constructor?" → <strong>cùng tên với lớp</strong>. "Constructor có bị override (ghi đè) được không?" → <strong>không</strong> (nó không được kế thừa); nhưng nó <em>được</em> overload (nạp chồng). <code>void Employee() {}</code> không phải constructor — có kiểu trả về thì nó là một phương thức thường tình cờ trùng tên lớp.</div>`],
      [10, 'Constructors',
        `<p class="y-chinh">🎯 Two constructors for Student: a <strong>default constructor</strong> that sets fixed values (<code>code="SE123"; name="Hieu"; bYear=2000; address="1 Ba Trieu, HN"</code>) and a <strong>constructor with parameters</strong> that copies its four parameters into the fields with <code>this.field = field</code>.</p>
<div class="pitfall">The code on this slide does not compile. It uses curly quotes (“ ”, from a word processor), ends two lines with a full stop instead of a semicolon, and writes <code>this.bYear= year;</code> when the parameter is called <code>bYear</code>. Typed exactly as printed and compiled on JDK 8:</div>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "Student.java",
        "public class Student {\\n" +
        "    String code, name, address;\\n" +
        "    int bYear;\\n" +
        "    //default constructor\\n" +
        "    public Student(){\\n" +
        "        code=“SE123”;\\n" +
        "        name=“Hieu”;\\n" +
        "        bYear= 2000;\\n" +
        "        address=“1 Ba Trieu , HN”.\\n" +
        "    }\\n" +
        "    //constructor with parameters\\n" +
        "    public Student(String code, String name, int  bYear, String address){\\n" +
        "        this.code=code;\\n" +
        "        this.name=name;\\n" +
        "        this.bYear= year;\\n" +
        "        this.address=address.\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "-encoding", "UTF-8", "Student.java");     // round 1: syntax errors hide everything else
    // round 2: straight quotes and semicolons fixed, "year" left as on the slide
    viet(lab, "Student.java",
        "public class Student {\\n" +
        "    String code, name, address;\\n" +
        "    int bYear;\\n" +
        "    public Student(){\\n" +
        "        code=\\"SE123\\"; name=\\"Hieu\\"; bYear= 2000; address=\\"1 Ba Trieu , HN\\";\\n" +
        "    }\\n" +
        "    public Student(String code, String name, int  bYear, String address){\\n" +
        "        this.code=code;\\n" +
        "        this.name=name;\\n" +
        "        this.bYear= year;\\n" +
        "        this.address=address;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "-encoding", "UTF-8", "Student.java");
}</code></pre>
<div class="out">&gt; javac -encoding UTF-8 Student.java<br>
Student.java:6: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code=“SE123”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:6: error: illegal character: '\\u201d'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code=“SE123”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:6: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code=“SE123”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:7: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=“Hieu”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:7: error: illegal character: '\\u201d'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=“Hieu”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:7: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=“Hieu”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:9: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address=“1 Ba Trieu , HN”.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:9: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address=“1 Ba Trieu , HN”.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:9: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address=“1 Ba Trieu , HN”.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:9: error: illegal character: '\\u201d'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address=“1 Ba Trieu , HN”.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:16: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.address=address.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:18: error: reached end of file while parsing<br>
}<br>
&nbsp;^<br>
12 errors<br>
(exit code 1)<br>
&gt; javac -encoding UTF-8 Student.java<br>
Student.java:10: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.bYear= year;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable year<br>
&nbsp;&nbsp;location: class Student<br>
1 error<br>
(exit code 1)</div>
<p>Round 1 shows <strong>12 errors</strong> for 3 small mistakes — and none of them mentions <code>year</code>: javac must be able to <em>parse</em> the file before it checks names. Only after the quotes and full stops are fixed does round 2 report <code>cannot find symbol … variable year</code>. Lesson: fix the first error, compile again. The corrected class, plus <code>this(...)</code> so the assignments are written once:</p>
<pre><code class="language-java">// release: 8
// Slide 10 corrected: the two constructors of the slide, compiled and run — plus this(...) so the field assignments are written only once
class Student {
    private String code;
    private String name;
    private int bYear;
    private String address;

    // default constructor (the slide's version, with straight quotes and semicolons)
    public Student() {
        code = "SE123";
        name = "Hieu";
        bYear = 2000;
        address = "1 Ba Trieu, HN";
    }

    // constructor with parameters — the slide wrote "this.bYear = year;" but there is no variable called year
    public Student(String code, String name, int bYear, String address) {
        this.code = code;
        this.name = name;
        this.bYear = bYear;
        this.address = address;
    }

    public String toString() { return code + ", " + name + ", " + bYear + ", " + address; }
}

class Student2 {                                   // ➕ the same two ways, without repeating the assignments
    private String code, name;
    private int bYear;

    public Student2(String code, String name, int bYear) {
        this.code = code;
        this.name = name;
        this.bYear = bYear;
    }
    public Student2() {
        this("UNKNOWN", "no name", 2000);          // this(...) calls the other constructor; it must be the FIRST statement
    }
    public String toString() { return code + ", " + name + ", " + bYear; }
}

public class StudentHaiHamTao {
    public static void main(String[] args) {
        Student a = new Student();                                   // which constructor runs is decided by the arguments
        Student b = new Student("SE190123", "Minh", 2005, "Thach That");
        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println("c = " + new Student2());
        System.out.println("d = " + new Student2("SE190124", "Lan", 2006));
    }
}</code></pre>
<div class="out">a = SE123, Hieu, 2000, 1 Ba Trieu, HN<br>
b = SE190123, Minh, 2005, Thach That<br>
c = UNKNOWN, no name, 2000<br>
d = SE190124, Lan, 2006</div>
<p>➕ <code>this(...)</code> calls another constructor of the same class and must be the <strong>first statement</strong>. Hard-coding a real-looking student ("SE123", "Hieu") in a default constructor is poor style: prefer neutral values (<code>""</code>, 0) or no default constructor at all, unless the PE paper specifies the values.</p>`,
        `<p class="y-chinh">🎯 Hai constructor cho Student: một <strong>constructor mặc định</strong> gán giá trị cố định (<code>code="SE123"; name="Hieu"; bYear=2000; address="1 Ba Trieu, HN"</code>) và một <strong>constructor có tham số</strong> chép bốn tham số vào các trường bằng <code>this.trường = trường</code>.</p>
<div class="pitfall">Code trên slide này không biên dịch được. Nó dùng nháy cong (“ ”, do trình soạn văn bản sinh ra), kết thúc hai dòng bằng dấu chấm thay vì dấu chấm phẩy, và viết <code>this.bYear= year;</code> trong khi tham số tên là <code>bYear</code>. Gõ đúng như in trên slide và biên dịch trên JDK 8:</div>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "Student.java",
        "public class Student {\\n" +
        "    String code, name, address;\\n" +
        "    int bYear;\\n" +
        "    //default constructor\\n" +
        "    public Student(){\\n" +
        "        code=“SE123”;\\n" +
        "        name=“Hieu”;\\n" +
        "        bYear= 2000;\\n" +
        "        address=“1 Ba Trieu , HN”.\\n" +
        "    }\\n" +
        "    //constructor with parameters\\n" +
        "    public Student(String code, String name, int  bYear, String address){\\n" +
        "        this.code=code;\\n" +
        "        this.name=name;\\n" +
        "        this.bYear= year;\\n" +
        "        this.address=address.\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "-encoding", "UTF-8", "Student.java");     // vòng 1: lỗi cú pháp che hết các lỗi khác
    // vòng 2: đã sửa nháy thẳng và dấu chấm phẩy, giữ "year" như slide
    viet(lab, "Student.java",
        "public class Student {\\n" +
        "    String code, name, address;\\n" +
        "    int bYear;\\n" +
        "    public Student(){\\n" +
        "        code=\\"SE123\\"; name=\\"Hieu\\"; bYear= 2000; address=\\"1 Ba Trieu , HN\\";\\n" +
        "    }\\n" +
        "    public Student(String code, String name, int  bYear, String address){\\n" +
        "        this.code=code;\\n" +
        "        this.name=name;\\n" +
        "        this.bYear= year;\\n" +
        "        this.address=address;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "-encoding", "UTF-8", "Student.java");
}</code></pre>
<div class="out">&gt; javac -encoding UTF-8 Student.java<br>
Student.java:6: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code=“SE123”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:6: error: illegal character: '\\u201d'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code=“SE123”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:6: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code=“SE123”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:7: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=“Hieu”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:7: error: illegal character: '\\u201d'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=“Hieu”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:7: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name=“Hieu”;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:9: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address=“1 Ba Trieu , HN”.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:9: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address=“1 Ba Trieu , HN”.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:9: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address=“1 Ba Trieu , HN”.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:9: error: illegal character: '\\u201d'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address=“1 Ba Trieu , HN”.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:16: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.address=address.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Student.java:18: error: reached end of file while parsing<br>
}<br>
&nbsp;^<br>
12 errors<br>
(exit code 1)<br>
&gt; javac -encoding UTF-8 Student.java<br>
Student.java:10: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.bYear= year;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable year<br>
&nbsp;&nbsp;location: class Student<br>
1 error<br>
(exit code 1)</div>
<p>Vòng 1 báo <strong>12 lỗi</strong> cho 3 lỗi nhỏ — và không lỗi nào nhắc tới <code>year</code>: javac phải <em>phân tích cú pháp</em> được file rồi mới kiểm tên. Chỉ khi đã sửa nháy và dấu chấm, vòng 2 mới báo <code>cannot find symbol … variable year</code> (không tìm thấy biến year). Bài học: sửa lỗi đầu tiên, biên dịch lại. Lớp đã sửa, cộng <code>this(...)</code> để các phép gán chỉ viết một lần:</p>
<pre><code class="language-java">// release: 8
// Slide 10 đã sửa: hai constructor của slide, biên dịch và chạy thật — cộng this(...) để các phép gán trường chỉ viết một lần
class Student {
    private String code;
    private String name;
    private int bYear;
    private String address;

    // constructor mặc định (bản của slide, dùng nháy thẳng và dấu chấm phẩy)
    public Student() {
        code = "SE123";
        name = "Hieu";
        bYear = 2000;
        address = "1 Ba Trieu, HN";
    }

    // constructor có tham số — slide viết "this.bYear = year;" nhưng không có biến nào tên year
    public Student(String code, String name, int bYear, String address) {
        this.code = code;
        this.name = name;
        this.bYear = bYear;
        this.address = address;
    }

    public String toString() { return code + ", " + name + ", " + bYear + ", " + address; }
}

class Student2 {                                   // ➕ cùng hai cách, không lặp lại các phép gán
    private String code, name;
    private int bYear;

    public Student2(String code, String name, int bYear) {
        this.code = code;
        this.name = name;
        this.bYear = bYear;
    }
    public Student2() {
        this("UNKNOWN", "no name", 2000);          // this(...) gọi constructor kia; nó phải là câu lệnh ĐẦU TIÊN
    }
    public String toString() { return code + ", " + name + ", " + bYear; }
}

public class StudentHaiHamTao {
    public static void main(String[] args) {
        Student a = new Student();                                   // constructor nào chạy là do đối số quyết định
        Student b = new Student("SE190123", "Minh", 2005, "Thach That");
        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println("c = " + new Student2());
        System.out.println("d = " + new Student2("SE190124", "Lan", 2006));
    }
}</code></pre>
<div class="out">a = SE123, Hieu, 2000, 1 Ba Trieu, HN<br>
b = SE190123, Minh, 2005, Thach That<br>
c = UNKNOWN, no name, 2000<br>
d = SE190124, Lan, 2006</div>
<p>➕ <code>this(...)</code> gọi một constructor khác của cùng lớp và phải là <strong>câu lệnh đầu tiên</strong>. Gán cứng một sinh viên trông như thật ("SE123", "Hieu") trong constructor mặc định là cách viết kém: nên dùng giá trị trung tính (<code>""</code>, 0) hoặc không có constructor mặc định, trừ khi đề PE quy định sẵn giá trị.</p>`],
      [11, 'The current object: this',
        `<p class="y-chinh">🎯 The keyword <code>this</code> refers to the <strong>current object</strong> — the object whose method is running. It exists only while a member method runs and is discarded when the method ends. (The slide says it "returns the address" of the object; in Java it is a <em>reference</em> — Java never exposes addresses.)</p>
<pre><code class="language-java">// release: 8
// Slide 11: "this" is the reference to the object that is running the method — the same value the caller holds
class Person {
    String id;

    void setIdWrong(String id) { id = id; }          // both "id" mean the PARAMETER: the field is never touched
    void setIdRight(String id) { this.id = id; }     // this.id = the field of the current object

    boolean amI(Person p) { return this == p; }       // compare "this" with a reference held by the caller

    Person rename(String id) { this.id = id; return this; }   // ➕ returning this allows call chaining
}

public class ThisLaGi {
    public static void main(String[] args) {
        Person p1 = new Person();
        Person p2 = new Person();
        p1.setIdWrong("FPTU");
        System.out.println("after setIdWrong(\\"FPTU\\"): p1.id = " + p1.id);
        p1.setIdRight("FPTU");
        System.out.println("after setIdRight(\\"FPTU\\"): p1.id = " + p1.id);
        System.out.println("inside p1.amI(p1): this == p1 ? " + p1.amI(p1));
        System.out.println("inside p2.amI(p1): this == p1 ? " + p2.amI(p1));
        System.out.println("chained: " + p2.rename("HCM").rename("HN").id);
    }
}</code></pre>
<div class="out">after setIdWrong("FPTU"): p1.id = null<br>
after setIdRight("FPTU"): p1.id = FPTU<br>
inside p1.amI(p1): this == p1 ? true<br>
inside p2.amI(p1): this == p1 ? false<br>
chained: HN</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/464d0aed4a4f094b775a972140d96401d77f6cc2.svg" alt="During p1.setIdRight(&quot;FPTU&quot;): this and p1 point to the same object" loading="lazy" /><p class="chu-thich">🧩 During p1.setIdRight("FPTU"): this and p1 point to the same object</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 11 — during p1.setIdRight("FPTU"), "this" and p1 hold the same reference
left to right direction
package "Stack" {
  rectangle "frame: main\\n—\\np1 = ref ●\\np2 = ref ○" as M
  rectangle "frame: setIdRight (exists only during the call)\\n—\\nthis = ref ● (local variable 0)\\nid = 'FPTU' (parameter)" as F #FEF9C3
}
package "Heap" {
  rectangle "Person object #1\\nid = null → 'FPTU'" as P1 #ECFDF5
  rectangle "Person object #2\\nid = null" as P2 #ECFDF5
}
M --&gt; P1 : p1
M --&gt; P2 : p2
F --&gt; P1 : this
@enduml</code></pre></details>
<p>Line 1 is a famous FE question: in <code>id = id;</code> both names mean the <strong>parameter</strong> (the nearest declaration wins — the parameter <em>shadows</em> the field), so the field stays <code>null</code>. <code>this.id = id</code> names the field explicitly. Lines 3–4 show that <code>this</code> is literally the same reference the caller used. In the bytecode, <code>this</code> is simply <strong>local variable 0</strong> of every instance method — the <code>aload_0</code> before each <code>putfield</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "Student.java",
        "public class Student {\\n" +
        "    private String code;\\n" +
        "    public Student(String code) { this.code = code; }\\n" +
        "    public void setCode(String code) { this.code = code; }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Student stu = new Student(\\"SE123\\");\\n" +
        "        stu.setCode(\\"SE124\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "Student.java");
    lenh(lab, "javap", "-c", "-p", "Student");
}</code></pre>
<div class="out">&gt; javac Student.java<br>
&gt; javap -c -p Student<br>
Compiled from "Student.java"<br>
public class Student {<br>
&nbsp;&nbsp;private java.lang.String code;<br>
<br>
&nbsp;&nbsp;public Student(java.lang.String);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokespecial #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/Object."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: putfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field code:Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9: return<br>
<br>
&nbsp;&nbsp;public void setCode(java.lang.String);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2: putfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field code:Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: return<br>
<br>
&nbsp;&nbsp;public static void main(java.lang.String[]);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class Student<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3: dup<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String SE123<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: invokespecial #5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method "&lt;init&gt;":(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9: astore_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String SE124<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13: invokevirtual #7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method setCode:(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16: return<br>
}</div>
<div class="pitfall"><code>this</code> does not exist in a <code>static</code> method (there is no current object), so <code>main</code> cannot write <code>this.code</code> — javac says <code>non-static variable this cannot be referenced from a static context</code>.</div>`,
        `<p class="y-chinh">🎯 Từ khoá <code>this</code> chỉ <strong>đối tượng hiện tại (current object)</strong> — đối tượng đang chạy phương thức. Nó chỉ tồn tại trong lúc phương thức thành viên chạy và bị bỏ đi khi phương thức kết thúc. (Slide nói nó "trả về địa chỉ" của đối tượng; trong Java đó là một <em>tham chiếu</em> — Java không bao giờ lộ địa chỉ.)</p>
<pre><code class="language-java">// release: 8
// Slide 11: "this" là tham chiếu tới đối tượng đang chạy phương thức — đúng giá trị mà bên gọi đang giữ
class Person {
    String id;

    void setIdWrong(String id) { id = id; }          // cả hai "id" đều là THAM SỐ: trường không hề bị đụng tới
    void setIdRight(String id) { this.id = id; }     // this.id = trường của đối tượng hiện tại

    boolean amI(Person p) { return this == p; }       // so "this" với một tham chiếu bên gọi đang giữ

    Person rename(String id) { this.id = id; return this; }   // ➕ trả về this cho phép gọi nối chuỗi
}

public class ThisLaGi {
    public static void main(String[] args) {
        Person p1 = new Person();
        Person p2 = new Person();
        p1.setIdWrong("FPTU");
        System.out.println("after setIdWrong(\\"FPTU\\"): p1.id = " + p1.id);
        p1.setIdRight("FPTU");
        System.out.println("after setIdRight(\\"FPTU\\"): p1.id = " + p1.id);
        System.out.println("inside p1.amI(p1): this == p1 ? " + p1.amI(p1));
        System.out.println("inside p2.amI(p1): this == p1 ? " + p2.amI(p1));
        System.out.println("chained: " + p2.rename("HCM").rename("HN").id);
    }
}</code></pre>
<div class="out">after setIdWrong("FPTU"): p1.id = null<br>
after setIdRight("FPTU"): p1.id = FPTU<br>
inside p1.amI(p1): this == p1 ? true<br>
inside p2.amI(p1): this == p1 ? false<br>
chained: HN</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/464d0aed4a4f094b775a972140d96401d77f6cc2.svg" alt="Trong lúc p1.setIdRight(&quot;FPTU&quot;): this và p1 trỏ cùng một đối tượng" loading="lazy" /><p class="chu-thich">🧩 Trong lúc p1.setIdRight("FPTU"): this và p1 trỏ cùng một đối tượng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 11 — during p1.setIdRight("FPTU"), "this" and p1 hold the same reference
left to right direction
package "Stack" {
  rectangle "frame: main\\n—\\np1 = ref ●\\np2 = ref ○" as M
  rectangle "frame: setIdRight (exists only during the call)\\n—\\nthis = ref ● (local variable 0)\\nid = 'FPTU' (parameter)" as F #FEF9C3
}
package "Heap" {
  rectangle "Person object #1\\nid = null → 'FPTU'" as P1 #ECFDF5
  rectangle "Person object #2\\nid = null" as P2 #ECFDF5
}
M --&gt; P1 : p1
M --&gt; P2 : p2
F --&gt; P1 : this
@enduml</code></pre></details>
<p>Dòng 1 là một câu FE nổi tiếng: trong <code>id = id;</code> cả hai tên đều là <strong>tham số</strong> (khai báo gần nhất thắng — tham số <em>che (shadow)</em> trường), nên trường vẫn là <code>null</code>. <code>this.id = id</code> gọi đích danh trường. Dòng 3–4 cho thấy <code>this</code> đúng là cùng tham chiếu mà bên gọi đã dùng. Trong bytecode, <code>this</code> đơn giản là <strong>biến cục bộ số 0</strong> của mọi phương thức thể hiện — lệnh <code>aload_0</code> trước mỗi <code>putfield</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "Student.java",
        "public class Student {\\n" +
        "    private String code;\\n" +
        "    public Student(String code) { this.code = code; }\\n" +
        "    public void setCode(String code) { this.code = code; }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Student stu = new Student(\\"SE123\\");\\n" +
        "        stu.setCode(\\"SE124\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "Student.java");
    lenh(lab, "javap", "-c", "-p", "Student");
}</code></pre>
<div class="out">&gt; javac Student.java<br>
&gt; javap -c -p Student<br>
Compiled from "Student.java"<br>
public class Student {<br>
&nbsp;&nbsp;private java.lang.String code;<br>
<br>
&nbsp;&nbsp;public Student(java.lang.String);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokespecial #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/Object."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: putfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field code:Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9: return<br>
<br>
&nbsp;&nbsp;public void setCode(java.lang.String);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2: putfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field code:Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: return<br>
<br>
&nbsp;&nbsp;public static void main(java.lang.String[]);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class Student<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3: dup<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String SE123<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: invokespecial #5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method "&lt;init&gt;":(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9: astore_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String SE124<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13: invokevirtual #7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method setCode:(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16: return<br>
}</div>
<div class="pitfall"><code>this</code> không tồn tại trong phương thức <code>static</code> (không có đối tượng hiện tại), nên <code>main</code> không viết được <code>this.code</code> — javac báo <code>non-static variable this cannot be referenced from a static context</code>.</div>`],
      [12, 'Member functions',
        `<p class="y-chinh">🎯 <strong>Member functions</strong> (methods) are declared inside the class and work on its data members. Form: <code>[modifier] ReturnType methodName(params) { code }</code>. A <strong>method signature</strong> = <strong>name + the order of parameter types</strong>.</p>
<p>The signature is how Java tells methods apart, so a class may have several methods with the same name as long as their parameter types differ — <strong>overloading</strong>. The return type and the parameter <em>names</em> are not part of the signature; javac on JDK 8 proves both:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "Calc.java",                                      // three methods called add: three DIFFERENT signatures
        "public class Calc {\\n" +
        "    int add(int a, int b)          { return a + b; }\\n" +
        "    double add(double a, double b) { return a + b; }\\n" +
        "    int add(int a, int b, int c)   { return a + b + c; }\\n" +
        "    String add(String s, int n)    { return s + n; }\\n" +
        "    String add(int n, String s)    { return n + s; }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Calc c = new Calc();\\n" +
        "        System.out.println(c.add(2, 3) + \\" \\" + c.add(2.5, 3) + \\" \\" + c.add(1, 2, 3) + \\" \\" + c.add(\\"A\\", 1) + \\" \\" + c.add(1, \\"A\\"));\\n" +
        "    }\\n" +
        "}\\n");
    viet(lab, "Shape.java",                                     // same name + same parameter types: illegal, whatever the return type or parameter name
        "public class Shape {\\n" +
        "    int area(int w)       { return w * w; }\\n" +
        "    double area(int side) { return side * side; }\\n" +
        "}\\n");
    lenh(lab, "javac", "Calc.java");
    lenh(lab, "java", "Calc");
    lenh(lab, "javac", "Shape.java");
}</code></pre>
<div class="out">&gt; javac Calc.java<br>
&gt; java Calc<br>
5 5.5 6 A1 1A<br>
&gt; javac Shape.java<br>
Shape.java:3: error: method area(int) is already defined in class Shape<br>
&nbsp;&nbsp;&nbsp;&nbsp;double area(int side) { return side * side; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Note <code>add(String, int)</code> and <code>add(int, String)</code>: same types, different <em>order</em> ⇒ different signatures, as the slide says. And in <code>Shape</code>, <code>int area(int w)</code> versus <code>double area(int side)</code> differ only in return type and parameter name ⇒ "already defined".</p>
<div class="pitfall">FE: "Which pair can coexist in one class?" — look only at name + parameter types. <code>void m1(String x)</code> and <code>protected void m1(String x, String y)</code> are fine (different count); the access modifier is not part of the signature either.</div>`,
        `<p class="y-chinh">🎯 <strong>Phương thức thành viên (member function)</strong> được khai báo bên trong lớp và làm việc trên dữ liệu của lớp. Dạng: <code>[modifier] KiểuTrảVề tênPhươngThức(tham_số) { code }</code>. <strong>Chữ ký phương thức (method signature)</strong> = <strong>tên + thứ tự các kiểu tham số</strong>.</p>
<p>Chữ ký là cách Java phân biệt các phương thức, nên một lớp có thể có nhiều phương thức cùng tên miễn là kiểu tham số khác nhau — gọi là <strong>nạp chồng (overloading)</strong>. Kiểu trả về và <em>tên</em> tham số không thuộc chữ ký; javac trên JDK 8 chứng minh cả hai:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "Calc.java",                                      // ba phương thức tên add: ba chữ ký KHÁC nhau
        "public class Calc {\\n" +
        "    int add(int a, int b)          { return a + b; }\\n" +
        "    double add(double a, double b) { return a + b; }\\n" +
        "    int add(int a, int b, int c)   { return a + b + c; }\\n" +
        "    String add(String s, int n)    { return s + n; }\\n" +
        "    String add(int n, String s)    { return n + s; }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Calc c = new Calc();\\n" +
        "        System.out.println(c.add(2, 3) + \\" \\" + c.add(2.5, 3) + \\" \\" + c.add(1, 2, 3) + \\" \\" + c.add(\\"A\\", 1) + \\" \\" + c.add(1, \\"A\\"));\\n" +
        "    }\\n" +
        "}\\n");
    viet(lab, "Shape.java",                                     // cùng tên + cùng kiểu tham số: không hợp lệ, dù kiểu trả về hay tên tham số khác
        "public class Shape {\\n" +
        "    int area(int w)       { return w * w; }\\n" +
        "    double area(int side) { return side * side; }\\n" +
        "}\\n");
    lenh(lab, "javac", "Calc.java");
    lenh(lab, "java", "Calc");
    lenh(lab, "javac", "Shape.java");
}</code></pre>
<div class="out">&gt; javac Calc.java<br>
&gt; java Calc<br>
5 5.5 6 A1 1A<br>
&gt; javac Shape.java<br>
Shape.java:3: error: method area(int) is already defined in class Shape<br>
&nbsp;&nbsp;&nbsp;&nbsp;double area(int side) { return side * side; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Để ý <code>add(String, int)</code> và <code>add(int, String)</code>: cùng các kiểu, khác <em>thứ tự</em> ⇒ khác chữ ký, đúng như slide nói. Còn trong <code>Shape</code>, <code>int area(int w)</code> với <code>double area(int side)</code> chỉ khác kiểu trả về và tên tham số ⇒ "already defined" (đã được định nghĩa).</p>
<div class="pitfall">FE: "Cặp nào cùng tồn tại được trong một lớp?" — chỉ nhìn tên + kiểu tham số. <code>void m1(String x)</code> và <code>protected void m1(String x, String y)</code> hợp lệ (khác số tham số); access modifier cũng không thuộc chữ ký.</div>`],
      [13, 'Member functions: Getter/Setter',
        `<p class="y-chinh">🎯 A <strong>getter</strong> returns the value of a property; a <strong>setter</strong> sets it. They exist for the <strong>completeness of encapsulation</strong> and to keep a <strong>consistent interface when internal details change</strong>.</p>
<p>The second use is the important one. If <code>Student</code> stores <code>bYear</code> today and <code>birthDate</code> tomorrow, a method <code>getAge()</code> can keep working for every caller; a public field cannot. Naming is a convention the whole Java world (and every framework) relies on:</p>
<table>
<thead><tr><th>Field</th><th>Getter</th><th>Setter</th></tr></thead>
<tbody>
<tr><td><code>String name</code></td><td><code>public String getName()</code></td><td><code>public void setName(String name)</code></td></tr>
<tr><td><code>int bYear</code></td><td><code>public int getBYear()</code></td><td><code>public void setBYear(int bYear)</code></td></tr>
<tr><td><code>boolean convertible</code></td><td><code>public boolean isConvertible()</code></td><td><code>public void setConvertible(boolean c)</code></td></tr>
</tbody>
</table>
<p>A getter/setter pair that just copies values is not yet "encapsulation" — it is a public field with extra steps. The value comes from what the setter <em>refuses</em> (slide 14) and from fields that get <em>no</em> setter at all, like an id that must never change.</p>
<div class="callout">🧭 <strong>Go further — Spring Boot</strong>: JPA entities, JSON conversion (Jackson) and JSP's <code>&#36;{student.name}</code> in PRJ301 all find your data by calling <code>getName()</code>. Break the naming convention and those tools silently see nothing.</div>`,
        `<p class="y-chinh">🎯 <strong>Getter</strong> trả về giá trị của một thuộc tính; <strong>setter</strong> gán giá trị cho nó. Chúng có mặt để <strong>đóng gói được trọn vẹn</strong> và để <strong>giữ giao diện nhất quán khi chi tiết bên trong thay đổi</strong>.</p>
<p>Công dụng thứ hai mới là quan trọng. Nếu hôm nay <code>Student</code> lưu <code>bYear</code> còn ngày mai lưu <code>birthDate</code>, thì phương thức <code>getAge()</code> vẫn chạy đúng với mọi bên gọi; một trường public thì không. Cách đặt tên là quy ước mà cả thế giới Java (và mọi framework) dựa vào:</p>
<table>
<thead><tr><th>Trường</th><th>Getter</th><th>Setter</th></tr></thead>
<tbody>
<tr><td><code>String name</code></td><td><code>public String getName()</code></td><td><code>public void setName(String name)</code></td></tr>
<tr><td><code>int bYear</code></td><td><code>public int getBYear()</code></td><td><code>public void setBYear(int bYear)</code></td></tr>
<tr><td><code>boolean convertible</code></td><td><code>public boolean isConvertible()</code></td><td><code>public void setConvertible(boolean c)</code></td></tr>
</tbody>
</table>
<p>Một cặp getter/setter chỉ chép giá trị qua lại thì chưa phải "đóng gói" — nó là trường public đi đường vòng. Giá trị thật đến từ những gì setter <em>từ chối</em> (slide 14) và từ những trường <em>không có</em> setter nào, như mã số không bao giờ được đổi.</p>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot</strong>: entity JPA, chuyển đổi JSON (Jackson) và <code>&#36;{student.name}</code> trong JSP ở PRJ301 đều tìm dữ liệu của bạn bằng cách gọi <code>getName()</code>. Phá quy ước đặt tên là các công cụ đó im lặng không thấy gì.</div>`],
      [14, 'Member functions: Getter/Setter',
        `<p class="y-chinh">🎯 The slide's example: <code>getName()</code> returns <code>name</code>; <code>setName(String name)</code> assigns only <code>if (!name.isEmpty())</code> — a setter with a boundary condition.</p>
<p>Good idea, incomplete check. What it really does with an empty string, a string of spaces, and <code>null</code>:</p>
<pre><code class="language-java">// release: 8
// Slides 13–14: getter/setter, and what the slide's setName really does with an empty string, spaces and null
class StudentSlide {
    private String name = "Hieu";
    public String getName() { return name; }
    public void setName(String name) {               // exactly slide 14
        if (!name.isEmpty())
            this.name = name;
    }
}

class StudentSafe {
    private String name = "Hieu";
    public String getName() { return name; }
    public boolean setName(String name) {             // tell the caller whether the value was accepted
        if (name == null || name.trim().isEmpty()) return false;   // check null FIRST, then blank
        this.name = name.trim();
        return true;
    }
}

public class GetterSetter {
    public static void main(String[] args) {
        StudentSlide s = new StudentSlide();
        s.setName("");     System.out.println("slide version, setName(\\"\\")     -&gt; " + s.getName());
        s.setName("   ");  System.out.println("slide version, setName(\\"   \\")  -&gt; [" + s.getName() + "]  (spaces are not empty!)");
        try {
            s.setName(null);
        } catch (NullPointerException e) {
            System.out.println("slide version, setName(null)   -&gt; " + e.getClass().getSimpleName() + " (null.isEmpty() cannot run)");
        }
        StudentSafe t = new StudentSafe();
        System.out.println("safe version,  setName(\\"   \\")  -&gt; accepted? " + t.setName("   ") + ", name = " + t.getName());
        System.out.println("safe version,  setName(null)   -&gt; accepted? " + t.setName(null) + ", name = " + t.getName());
        System.out.println("safe version,  setName(\\" Lan \\") -&gt; accepted? " + t.setName(" Lan ") + ", name = [" + t.getName() + "]");
    }
}</code></pre>
<div class="out">slide version, setName("") &nbsp;&nbsp;&nbsp;&nbsp;-&gt; Hieu<br>
slide version, setName(" &nbsp;&nbsp;") &nbsp;-&gt; [ &nbsp;&nbsp;] &nbsp;(spaces are not empty!)<br>
slide version, setName(null) &nbsp;&nbsp;-&gt; NullPointerException (null.isEmpty() cannot run)<br>
safe version, &nbsp;setName(" &nbsp;&nbsp;") &nbsp;-&gt; accepted? false, name = Hieu<br>
safe version, &nbsp;setName(null) &nbsp;&nbsp;-&gt; accepted? false, name = Hieu<br>
safe version, &nbsp;setName(" Lan ") -&gt; accepted? true, name = [Lan]</div>
<p>Two holes. <code>"   "</code> is not empty (it has three characters), so a blank name is accepted. And <code>null.isEmpty()</code> cannot run at all — the setter <em>itself</em> crashes with a <code>NullPointerException</code>. The safe version checks <code>null</code> first (the <code>||</code> stops before calling a method on <code>null</code>), trims the spaces, and returns <code>boolean</code> so the caller can show "invalid name, try again" — the LAB211 pattern.</p>
<div class="pitfall">PE: when the paper says "if the value is invalid, set it to 0" or "do not change it", implement <em>exactly</em> that rule — the hidden test cases check the boundary (e.g. <code>refresh &lt; 0</code> ⇒ 0, but <code>refresh == 0</code> stays 0 for a different reason). Read <code>&lt;</code> versus <code>&lt;=</code> twice.</div>`,
        `<p class="y-chinh">🎯 Ví dụ của slide: <code>getName()</code> trả về <code>name</code>; <code>setName(String name)</code> chỉ gán <code>if (!name.isEmpty())</code> — một setter có điều kiện biên.</p>
<p>Ý tưởng tốt, kiểm tra chưa đủ. Đây là thứ nó thật sự làm với chuỗi rỗng, chuỗi toàn dấu cách, và <code>null</code>:</p>
<pre><code class="language-java">// release: 8
// Slide 13–14: getter/setter, và setName của slide thật ra làm gì với chuỗi rỗng, dấu cách và null
class StudentSlide {
    private String name = "Hieu";
    public String getName() { return name; }
    public void setName(String name) {               // đúng slide 14
        if (!name.isEmpty())
            this.name = name;
    }
}

class StudentSafe {
    private String name = "Hieu";
    public String getName() { return name; }
    public boolean setName(String name) {             // báo cho bên gọi biết giá trị có được nhận không
        if (name == null || name.trim().isEmpty()) return false;   // kiểm null TRƯỚC, rồi mới kiểm rỗng
        this.name = name.trim();
        return true;
    }
}

public class GetterSetter {
    public static void main(String[] args) {
        StudentSlide s = new StudentSlide();
        s.setName("");     System.out.println("slide version, setName(\\"\\")     -&gt; " + s.getName());
        s.setName("   ");  System.out.println("slide version, setName(\\"   \\")  -&gt; [" + s.getName() + "]  (spaces are not empty!)");
        try {
            s.setName(null);
        } catch (NullPointerException e) {
            System.out.println("slide version, setName(null)   -&gt; " + e.getClass().getSimpleName() + " (null.isEmpty() cannot run)");
        }
        StudentSafe t = new StudentSafe();
        System.out.println("safe version,  setName(\\"   \\")  -&gt; accepted? " + t.setName("   ") + ", name = " + t.getName());
        System.out.println("safe version,  setName(null)   -&gt; accepted? " + t.setName(null) + ", name = " + t.getName());
        System.out.println("safe version,  setName(\\" Lan \\") -&gt; accepted? " + t.setName(" Lan ") + ", name = [" + t.getName() + "]");
    }
}</code></pre>
<div class="out">slide version, setName("") &nbsp;&nbsp;&nbsp;&nbsp;-&gt; Hieu<br>
slide version, setName(" &nbsp;&nbsp;") &nbsp;-&gt; [ &nbsp;&nbsp;] &nbsp;(spaces are not empty!)<br>
slide version, setName(null) &nbsp;&nbsp;-&gt; NullPointerException (null.isEmpty() cannot run)<br>
safe version, &nbsp;setName(" &nbsp;&nbsp;") &nbsp;-&gt; accepted? false, name = Hieu<br>
safe version, &nbsp;setName(null) &nbsp;&nbsp;-&gt; accepted? false, name = Hieu<br>
safe version, &nbsp;setName(" Lan ") -&gt; accepted? true, name = [Lan]</div>
<p>Hai lỗ hổng. <code>"   "</code> không rỗng (nó có ba ký tự), nên một cái tên trắng trơn vẫn được nhận. Còn <code>null.isEmpty()</code> không chạy nổi — <em>chính</em> setter sập vì <code>NullPointerException</code>. Bản an toàn kiểm <code>null</code> trước (toán tử <code>||</code> dừng lại trước khi gọi phương thức trên <code>null</code>), cắt dấu cách, và trả về <code>boolean</code> để bên gọi in được "tên không hợp lệ, nhập lại" — đúng khuôn LAB211.</p>
<div class="pitfall">PE: khi đề ghi "nếu giá trị không hợp lệ thì gán 0" hay "thì giữ nguyên", hãy cài <em>đúng y</em> luật đó — test case ẩn kiểm ở biên (vd <code>refresh &lt; 0</code> ⇒ 0, còn <code>refresh == 0</code> vẫn là 0 vì lý do khác). Đọc <code>&lt;</code> với <code>&lt;=</code> hai lần.</div>`],
      [15, 'Member functions: other methods',
        `<p class="y-chinh">🎯 Besides constructors, getters and setters, a class has <strong>other methods</strong> for its own behaviour — the slide shows empty <code>public void input()</code> and <code>public void output()</code> for Student.</p>
<p>The natural first version of <code>input()</code> creates a <code>Scanner</code> inside the method. Typed by hand in NetBeans it seems to work. Fed by a <strong>pipe</strong> — which is how the PE marking software and LAB211 test scripts give input — it breaks on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    // Version A: input() creates a NEW Scanner every time it is called
    viet(lab, "StudentA.java",
        "import java.util.Scanner;\\n" +
        "public class StudentA {\\n" +
        "    private String code, name;\\n" +
        "    public void input() {\\n" +
        "        Scanner sc = new Scanner(System.in);      // a new Scanner per call\\n" +
        "        System.out.print(\\"code: \\"); code = sc.nextLine();\\n" +
        "        System.out.print(\\"name: \\"); name = sc.nextLine();\\n" +
        "    }\\n" +
        "    public void output() { System.out.println(\\"[\\" + code + \\", \\" + name + \\"]\\"); }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        StudentA s1 = new StudentA(); s1.input();\\n" +
        "        StudentA s2 = new StudentA(); s2.input();\\n" +
        "        System.out.println(); s1.output(); s2.output();\\n" +
        "    }\\n" +
        "}\\n");
    // Version B: ONE Scanner for the whole program, shared by every input()
    viet(lab, "StudentB.java",
        "import java.util.Scanner;\\n" +
        "public class StudentB {\\n" +
        "    private static final Scanner SC = new Scanner(System.in);   // created once\\n" +
        "    private String code, name;\\n" +
        "    public void input() {\\n" +
        "        System.out.print(\\"code: \\"); code = SC.nextLine();\\n" +
        "        System.out.print(\\"name: \\"); name = SC.nextLine();\\n" +
        "    }\\n" +
        "    public void output() { System.out.println(\\"[\\" + code + \\", \\" + name + \\"]\\"); }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        StudentB s1 = new StudentB(); s1.input();\\n" +
        "        StudentB s2 = new StudentB(); s2.input();\\n" +
        "        System.out.println(); s1.output(); s2.output();\\n" +
        "    }\\n" +
        "}\\n");
    String typed = "SE123\\nHieu\\nSE124\\nMinh\\n";
    lenh(lab, "javac", "StudentA.java", "StudentB.java");
    lenhVao(lab, typed, "java", "StudentA");
    lenhVao(lab, typed, "java", "StudentB");
}</code></pre>
<div class="out">&gt; javac StudentA.java StudentB.java<br>
&gt; java StudentA &nbsp;&nbsp;(keyboard input piped in: SE123 / Hieu / SE124 / Minh)<br>
code: name: code: Exception in thread "main" java.util.NoSuchElementException: No line found<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
&gt; java StudentB &nbsp;&nbsp;(keyboard input piped in: SE123 / Hieu / SE124 / Minh)<br>
code: name: code: name:<br>
[SE123, Hieu]<br>
[SE124, Minh]</div>
<p>Why: a <code>Scanner</code> reads <strong>a whole block</strong> of <code>System.in</code> into its own buffer, not just one line. The first Scanner swallowed all four lines; when <code>input()</code> runs again, a brand-new Scanner finds the stream already empty — <code>NoSuchElementException: No line found</code>. When you type by hand, lines arrive one at a time, so the bug hides. Version B creates <strong>one</strong> Scanner for the whole program (<code>private static final</code>) and every call shares it — the version used in slide 4's <code>Student</code>.</p>
<div class="pitfall">Rule for every PE and LAB211 program: <strong>one</strong> <code>Scanner(System.in)</code> per program, never one per method call, and never <code>sc.close()</code> on it in the middle (that closes <code>System.in</code> for good).</div>`,
        `<p class="y-chinh">🎯 Ngoài constructor, getter và setter, một lớp còn có <strong>các phương thức khác</strong> cho hành vi riêng của nó — slide cho <code>public void input()</code> và <code>public void output()</code> rỗng của Student.</p>
<p>Phiên bản đầu tiên tự nhiên nhất của <code>input()</code> tạo một <code>Scanner</code> ngay trong phương thức. Gõ tay trong NetBeans thì có vẻ chạy. Nhưng khi dữ liệu được đổ vào qua <strong>ống (pipe)</strong> — đúng cách phần mềm chấm PE và các script kiểm LAB211 đưa dữ liệu — nó hỏng trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    // Bản A: input() tạo Scanner MỚI mỗi lần được gọi
    viet(lab, "StudentA.java",
        "import java.util.Scanner;\\n" +
        "public class StudentA {\\n" +
        "    private String code, name;\\n" +
        "    public void input() {\\n" +
        "        Scanner sc = new Scanner(System.in);      // a new Scanner per call\\n" +
        "        System.out.print(\\"code: \\"); code = sc.nextLine();\\n" +
        "        System.out.print(\\"name: \\"); name = sc.nextLine();\\n" +
        "    }\\n" +
        "    public void output() { System.out.println(\\"[\\" + code + \\", \\" + name + \\"]\\"); }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        StudentA s1 = new StudentA(); s1.input();\\n" +
        "        StudentA s2 = new StudentA(); s2.input();\\n" +
        "        System.out.println(); s1.output(); s2.output();\\n" +
        "    }\\n" +
        "}\\n");
    // Bản B: MỘT Scanner cho cả chương trình, mọi input() dùng chung
    viet(lab, "StudentB.java",
        "import java.util.Scanner;\\n" +
        "public class StudentB {\\n" +
        "    private static final Scanner SC = new Scanner(System.in);   // created once\\n" +
        "    private String code, name;\\n" +
        "    public void input() {\\n" +
        "        System.out.print(\\"code: \\"); code = SC.nextLine();\\n" +
        "        System.out.print(\\"name: \\"); name = SC.nextLine();\\n" +
        "    }\\n" +
        "    public void output() { System.out.println(\\"[\\" + code + \\", \\" + name + \\"]\\"); }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        StudentB s1 = new StudentB(); s1.input();\\n" +
        "        StudentB s2 = new StudentB(); s2.input();\\n" +
        "        System.out.println(); s1.output(); s2.output();\\n" +
        "    }\\n" +
        "}\\n");
    String typed = "SE123\\nHieu\\nSE124\\nMinh\\n";
    lenh(lab, "javac", "StudentA.java", "StudentB.java");
    lenhVao(lab, typed, "java", "StudentA");
    lenhVao(lab, typed, "java", "StudentB");
}</code></pre>
<div class="out">&gt; javac StudentA.java StudentB.java<br>
&gt; java StudentA &nbsp;&nbsp;(keyboard input piped in: SE123 / Hieu / SE124 / Minh)<br>
code: name: code: Exception in thread "main" java.util.NoSuchElementException: No line found<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
&gt; java StudentB &nbsp;&nbsp;(keyboard input piped in: SE123 / Hieu / SE124 / Minh)<br>
code: name: code: name:<br>
[SE123, Hieu]<br>
[SE124, Minh]</div>
<p>Vì sao: một <code>Scanner</code> đọc <strong>cả một khối</strong> từ <code>System.in</code> vào bộ đệm riêng của nó, không phải chỉ một dòng. Scanner đầu tiên nuốt cả bốn dòng; khi <code>input()</code> chạy lần nữa, một Scanner mới tinh thấy luồng đã cạn — <code>NoSuchElementException: No line found</code> (không còn dòng nào). Khi bạn gõ tay, từng dòng tới một lúc, nên lỗi nấp đi. Bản B tạo <strong>một</strong> Scanner cho cả chương trình (<code>private static final</code>) và mọi lần gọi dùng chung — đúng bản đã dùng trong lớp <code>Student</code> ở slide 4.</p>
<div class="pitfall">Luật cho mọi chương trình PE và LAB211: <strong>một</strong> <code>Scanner(System.in)</code> cho mỗi chương trình, không bao giờ mỗi lần gọi phương thức một cái, và không bao giờ <code>sc.close()</code> nó giữa chừng (lệnh đó đóng luôn <code>System.in</code>).</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>"A library has books; each book has an ISBN, a title and a number of copies; the program lends and returns books." Name the class, the fields and the methods.</li>
<li>Why does <code>public Person(String id) { id = id; }</code> leave the field <code>null</code>? Fix it two ways.</li>
<li>Can a class contain <code>int f(int a)</code> and <code>long f(int b)</code>? Why not?</li>
<li>Your <code>input()</code> works when you type, but the PE marker reports an exception. What is the first thing to check?</li>
</ul>
<p>Continue with <strong>2.B → 2.C</strong>: passing arguments (by value — always), the three steps of <code>new</code>, and the constructor demos of slides 19–25.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>"Thư viện có sách; mỗi cuốn có ISBN, tên và số bản; chương trình cho mượn và nhận trả sách." Hãy kể lớp, các trường và các phương thức.</li>
<li>Vì sao <code>public Person(String id) { id = id; }</code> để trường vẫn <code>null</code>? Sửa bằng hai cách.</li>
<li>Một lớp có chứa được cả <code>int f(int a)</code> và <code>long f(int b)</code> không? Vì sao không?</li>
<li><code>input()</code> của bạn chạy đúng khi gõ tay, nhưng máy chấm PE báo ngoại lệ. Việc đầu tiên cần kiểm là gì?</li>
</ul>
<p>Học tiếp <strong>2.B → 2.C</strong>: truyền tham số (luôn theo giá trị), ba bước của <code>new</code>, và các demo constructor ở slide 19–25.</p>`),
    books([
      ['horstmann1', 'Ch. 4.3 "Defining Your Own Classes" (constructors, implicit and explicit parameters, this, getters/setters) and 4.10 "Class Design Hints"', 'Chương 4.3 "Defining Your Own Classes" (constructor, tham số ngầm và tường minh, this, getter/setter) và 4.10 "Class Design Hints"'],
      ['jls8', '§8.4.2 "Method Signature", §8.8 "Constructor Declarations", §8.8.9 "Default Constructor"', 'mục 8.4.2 "Method Signature", 8.8 "Constructor Declarations", 8.8.9 "Default Constructor"'],
      ['fuOffline', 'part "Encapsulation" — Class and Object, Constructor, The current Object, Member functions', 'phần "Encapsulation" — Class and Object, Constructor, The current Object, Member functions'],
      ['javaTutorial', 'trail "Learning the Java Language" — "Classes and Objects"', 'trail "Learning the Java Language" — "Classes and Objects"'],
    ]),
  ].join('\n'),
};

/* ───────── 2.C — 📑 Slide by slide · Encapsulation (2/3): passing arguments, new, constructor demos (slides 16–25) ───────── */
const L_pro8_2 = {
  title: '2.C — 📑 Slide by slide · Encapsulation (2/3): passing arguments, new, constructor demos (slides 16–25)|||2.C — 📑 Học theo từng slide · Encapsulation (2/3): truyền tham số, new, demo constructor (slide 16–25)',
  slug: 'pro192-slide-pro8-2',
  type: 'VIDEO',
  description: 'Giảng slide 16–25 bộ "Encapsulation": Java luôn truyền theo giá trị (năm thí nghiệm chạy thật — số nguyên, đối tượng, gán lại tham số, hoán đổi không được, String bất biến), ba bước của câu lệnh new (khai báo, tạo thể hiện, khởi tạo — đối chiếu bytecode new/dup/invokespecial), hai loại constructor và cách dùng object.field/object.method, demo IntPoint1/IntPoint2 của slide chạy thật trên JDK 8 (constructor tự sinh, lỗi khi đã tự viết constructor, NetBeans Insert Code), thứ tự khởi tạo thật của đối tượng (0 → giá trị khởi đầu → thân constructor) và giải thích kết quả chương trình slide 25.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.C · school deck "Encapsulation", slides 16–25</span>
<h2>What really happens when you pass an object, and when you write <code>new</code></h2>
<p class="lead">Slides 16–25 are where Chapter 2 meets the memory model of lesson 2.A. One sentence on slide 16 — "Java uses passing by value" — answers a whole family of FE questions, and the demos of slides 19–25 settle when the compiler writes a constructor for you and in which order an object's fields receive their values. Every demo of the slides is rebuilt and run on a real JDK 8.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>16</td><td>passing arguments</td><td>predict what a method can and cannot change in the caller's variables</td></tr>
<tr><td>17–18</td><td>creating and using objects</td><td>name the three parts of <code>Student stu = new Student(...)</code></td></tr>
<tr><td>19–24</td><td>the default-constructor demos (IntPoint1, IntPoint2)</td><td>say when a no-argument constructor exists, and read the javac error when it does not</td></tr>
<tr><td>25</td><td>"explain the result"</td><td>trace the order: zero values → field initializers → constructor body</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.C · bộ slide "Encapsulation" của trường, slide 16–25</span>
<h2>Điều gì thật sự xảy ra khi bạn truyền một đối tượng, và khi bạn viết <code>new</code></h2>
<p class="lead">Slide 16–25 là chỗ Chương 2 gặp mô hình bộ nhớ của bài 2.A. Một câu ở slide 16 — "Java truyền theo giá trị (passing by value)" — trả lời cả một họ câu hỏi FE, còn các demo ở slide 19–25 chốt khi nào trình biên dịch viết constructor hộ bạn và các trường của đối tượng nhận giá trị theo thứ tự nào. Mọi demo của slide đều được dựng lại và chạy trên JDK 8 thật.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>16</td><td>truyền tham số</td><td>đoán đúng một phương thức đổi được và không đổi được gì ở biến của bên gọi</td></tr>
<tr><td>17–18</td><td>tạo và dùng đối tượng</td><td>gọi tên ba phần của <code>Student stu = new Student(...)</code></td></tr>
<tr><td>19–24</td><td>các demo constructor mặc định (IntPoint1, IntPoint2)</td><td>nói được khi nào có constructor không tham số, và đọc được lỗi javac khi không có</td></tr>
<tr><td>25</td><td>"giải thích kết quả"</td><td>lần theo thứ tự: giá trị 0 → giá trị khởi đầu của trường → thân constructor</td></tr>
</tbody>
</table>`),
    walkHead('pro8', 16, 25),
    walk('pro8', [
      [16, 'Passing Arguments to a Constructor/Method',
        `<p class="y-chinh">🎯 Java uses the mechanism <strong>passing by value</strong>. Arguments can be of <strong>primitive data types</strong> or <strong>reference data types</strong> (objects).</p>
<p>The slide stops there; the consequences are what the FE asks. "By value" means the method receives a <strong>copy</strong> of what the caller's variable holds. For an <code>int</code> that is the number; for an object it is the <strong>reference</strong> — so the method can change the object the reference points to, but never the caller's variable itself. Five experiments:</p>
<pre><code class="language-java">// release: 8
// Slide 16: Java passes EVERY argument by value. For a primitive the value is the number; for an object the value is the reference — five experiments
class Wallet {
    int money;
    Wallet(int money) { this.money = money; }
}

public class TruyenThamTri {
    static void addOne(int n)            { n = n + 1; }                       // 1. changes the copy only
    static void spend(Wallet w)          { w.money = w.money - 30; }          // 2. follows the copied reference to the SAME object
    static void replace(Wallet w)        { w = new Wallet(1000); }            // 3. points the copy elsewhere; the caller's variable is untouched
    static void swap(Wallet a, Wallet b) { Wallet t = a; a = b; b = t; }      // 4. swaps two copies — useless
    static void shout(String s)          { s = s.toUpperCase(); }             // 5. String is immutable: toUpperCase makes a NEW String
    static void fill(int[] a)            { a[0] = 99; }                       // an array is an object too

    public static void main(String[] args) {
        int n = 5;
        addOne(n);
        System.out.println("1. primitive  : n = " + n);

        Wallet mine = new Wallet(100);
        spend(mine);
        System.out.println("2. object     : mine.money = " + mine.money);

        replace(mine);
        System.out.println("3. reassign   : mine.money = " + mine.money);

        Wallet x = new Wallet(1), y = new Wallet(2);
        swap(x, y);
        System.out.println("4. swap       : x.money = " + x.money + ", y.money = " + y.money);

        String s = "hello";
        shout(s);
        System.out.println("5. String     : s = " + s);

        int[] arr = {1, 2, 3};
        fill(arr);
        System.out.println("   array      : arr[0] = " + arr[0]);
    }
}</code></pre>
<div class="out">1. primitive &nbsp;: n = 5<br>
2. object &nbsp;&nbsp;&nbsp;&nbsp;: mine.money = 70<br>
3. reassign &nbsp;&nbsp;: mine.money = 70<br>
4. swap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: x.money = 1, y.money = 2<br>
5. String &nbsp;&nbsp;&nbsp;&nbsp;: s = hello<br>
&nbsp;&nbsp;&nbsp;array &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: arr[0] = 99</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/17bad7440869d4fcbc7acf0d5da8c4037ecb19e4.svg" alt="Experiments 2 and 3: the copy of the reference reaches the same Wallet; reassigning the copy does not move mine" loading="lazy" /><p class="chu-thich">🧩 Experiments 2 and 3: the copy of the reference reaches the same Wallet; reassigning the copy does not move mine</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 16 — pass by value: spend(mine) and replace(mine) both receive a COPY of the reference
left to right direction
package "Stack" {
  rectangle "frame: main\\n—\\nn = 5\\nmine = ref ●" as M
  rectangle "frame: spend(w)\\n—\\nw = copy of mine's ref ●" as S #FEF9C3
  rectangle "frame: replace(w)\\n—\\nw = ref to the NEW wallet" as R #FEF9C3
}
package "Heap" {
  rectangle "Wallet\\nmoney = 100 → 70" as W #ECFDF5
  rectangle "Wallet\\nmoney = 1000\\n(garbage after replace returns)" as W2 #FEF2F2
}
M --&gt; W
S --&gt; W : same object:\\nchange is visible
R --&gt; W2 : only the copy moves
@enduml</code></pre></details>
<table>
<thead><tr><th>Experiment</th><th>What the method changed</th><th>Visible to the caller?</th></tr></thead>
<tbody>
<tr><td>1. <code>n = n + 1</code></td><td>its own copy of 5</td><td>no</td></tr>
<tr><td>2. <code>w.money -= 30</code></td><td>the object, through a copied reference</td><td><strong>yes</strong></td></tr>
<tr><td>3. <code>w = new Wallet(1000)</code></td><td>its own copy of the reference</td><td>no</td></tr>
<tr><td>4. swap two references</td><td>two copies</td><td>no — a swap method cannot be written in Java</td></tr>
<tr><td>5. <code>s = s.toUpperCase()</code></td><td>its own copy, pointed at a NEW String</td><td>no — Strings never change</td></tr>
</tbody>
</table>
<div class="pitfall">"Java passes objects by reference" is the classic wrong answer. Correct: <strong>Java passes everything by value; for objects the value is a reference</strong>. Experiment 3 is the proof — with true pass-by-reference, <code>mine</code> would hold 1000.</div>`,
        `<p class="y-chinh">🎯 Java dùng cơ chế <strong>truyền theo giá trị (passing by value)</strong>. Đối số có thể thuộc <strong>kiểu dữ liệu nguyên thuỷ (primitive)</strong> hoặc <strong>kiểu tham chiếu (reference)</strong> — tức đối tượng.</p>
<p>Slide dừng ở đó; hệ quả của nó mới là thứ FE hỏi. "Theo giá trị" nghĩa là phương thức nhận một <strong>bản sao</strong> của thứ mà biến bên gọi đang giữ. Với <code>int</code> đó là con số; với đối tượng đó là <strong>tham chiếu</strong> — nên phương thức đổi được đối tượng mà tham chiếu trỏ tới, nhưng không bao giờ đổi được chính biến của bên gọi. Năm thí nghiệm:</p>
<pre><code class="language-java">// release: 8
// Slide 16: Java truyền MỌI đối số theo giá trị. Với kiểu nguyên thuỷ, giá trị là con số; với đối tượng, giá trị là tham chiếu — năm thí nghiệm
class Wallet {
    int money;
    Wallet(int money) { this.money = money; }
}

public class TruyenThamTri {
    static void addOne(int n)            { n = n + 1; }                       // 1. chỉ đổi bản sao
    static void spend(Wallet w)          { w.money = w.money - 30; }          // 2. đi theo tham chiếu đã chép tới CÙNG đối tượng
    static void replace(Wallet w)        { w = new Wallet(1000); }            // 3. chĩa bản sao đi chỗ khác; biến bên gọi không bị đụng
    static void swap(Wallet a, Wallet b) { Wallet t = a; a = b; b = t; }      // 4. hoán đổi hai bản sao — vô ích
    static void shout(String s)          { s = s.toUpperCase(); }             // 5. String bất biến: toUpperCase tạo String MỚI
    static void fill(int[] a)            { a[0] = 99; }                       // mảng cũng là đối tượng

    public static void main(String[] args) {
        int n = 5;
        addOne(n);
        System.out.println("1. primitive  : n = " + n);

        Wallet mine = new Wallet(100);
        spend(mine);
        System.out.println("2. object     : mine.money = " + mine.money);

        replace(mine);
        System.out.println("3. reassign   : mine.money = " + mine.money);

        Wallet x = new Wallet(1), y = new Wallet(2);
        swap(x, y);
        System.out.println("4. swap       : x.money = " + x.money + ", y.money = " + y.money);

        String s = "hello";
        shout(s);
        System.out.println("5. String     : s = " + s);

        int[] arr = {1, 2, 3};
        fill(arr);
        System.out.println("   array      : arr[0] = " + arr[0]);
    }
}</code></pre>
<div class="out">1. primitive &nbsp;: n = 5<br>
2. object &nbsp;&nbsp;&nbsp;&nbsp;: mine.money = 70<br>
3. reassign &nbsp;&nbsp;: mine.money = 70<br>
4. swap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: x.money = 1, y.money = 2<br>
5. String &nbsp;&nbsp;&nbsp;&nbsp;: s = hello<br>
&nbsp;&nbsp;&nbsp;array &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: arr[0] = 99</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/17bad7440869d4fcbc7acf0d5da8c4037ecb19e4.svg" alt="Thí nghiệm 2 và 3: bản sao tham chiếu tới đúng Wallet đó; gán lại bản sao thì mine không nhúc nhích" loading="lazy" /><p class="chu-thich">🧩 Thí nghiệm 2 và 3: bản sao tham chiếu tới đúng Wallet đó; gán lại bản sao thì mine không nhúc nhích</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 16 — pass by value: spend(mine) and replace(mine) both receive a COPY of the reference
left to right direction
package "Stack" {
  rectangle "frame: main\\n—\\nn = 5\\nmine = ref ●" as M
  rectangle "frame: spend(w)\\n—\\nw = copy of mine's ref ●" as S #FEF9C3
  rectangle "frame: replace(w)\\n—\\nw = ref to the NEW wallet" as R #FEF9C3
}
package "Heap" {
  rectangle "Wallet\\nmoney = 100 → 70" as W #ECFDF5
  rectangle "Wallet\\nmoney = 1000\\n(garbage after replace returns)" as W2 #FEF2F2
}
M --&gt; W
S --&gt; W : same object:\\nchange is visible
R --&gt; W2 : only the copy moves
@enduml</code></pre></details>
<table>
<thead><tr><th>Thí nghiệm</th><th>Phương thức đã đổi gì</th><th>Bên gọi thấy không?</th></tr></thead>
<tbody>
<tr><td>1. <code>n = n + 1</code></td><td>bản sao số 5 của riêng nó</td><td>không</td></tr>
<tr><td>2. <code>w.money -= 30</code></td><td>đối tượng, qua một tham chiếu đã chép</td><td><strong>có</strong></td></tr>
<tr><td>3. <code>w = new Wallet(1000)</code></td><td>bản sao tham chiếu của riêng nó</td><td>không</td></tr>
<tr><td>4. hoán đổi hai tham chiếu</td><td>hai bản sao</td><td>không — trong Java không viết được hàm swap</td></tr>
<tr><td>5. <code>s = s.toUpperCase()</code></td><td>bản sao của nó, chĩa sang một String MỚI</td><td>không — String không bao giờ đổi</td></tr>
</tbody>
</table>
<div class="pitfall">"Java truyền đối tượng theo tham chiếu" là đáp án sai kinh điển. Đúng là: <strong>Java truyền mọi thứ theo giá trị; với đối tượng, giá trị đó là một tham chiếu</strong>. Thí nghiệm 3 là bằng chứng — nếu thật sự truyền theo tham chiếu, <code>mine</code> đã giữ 1000.</div>`],
      [17, 'Creating Objects',
        `<p class="y-chinh">🎯 A class is the blueprint; you create an object from it. <code>Student stu = new Student("SE123", "Minh", 2000, "1 Ba Trieu");</code> has three parts: <strong>declaration</strong> (a variable name associated with an object type), <strong>instantiation</strong> (the <code>new</code> operator creates the object — memory is allocated), <strong>initialization</strong> (<code>new</code> is followed by a call to a constructor, which assigns values to the fields).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/977108f5de3ed69215b827ba7e5d90bf48b408d1.svg" alt="The three parts of slide 17 on the stack/heap picture of lesson 2.A" loading="lazy" /><p class="chu-thich">🧩 The three parts of slide 17 on the stack/heap picture of lesson 2.A</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 17 and 20 — Student stu = new Student(...): declaration, instantiation, initialization
left to right direction
package "Stack — frame of main" {
  rectangle "stu : Student\\n(1) declaration: a variable\\nthat can hold a reference" as V
}
package "Heap" {
  rectangle "Student object\\n—\\n(2) instantiation: new allocates memory,\\nevery field = 0 / null\\n(3) initialization: the constructor\\nruns and sets code, name, bYear, address" as O #ECFDF5
}
V --&gt; O : (4) the reference\\nis stored in stu
@enduml</code></pre></details>
<p>The three parts are visible as separate instructions in the bytecode of lesson 2.B's <code>javap</code> run (method <code>main</code> of <code>Student</code>): <code>new #3 // class Student</code> = <strong>instantiation</strong> (allocate, fields zeroed); <code>dup</code> + <code>ldc "SE123"</code> + <code>invokespecial … "&lt;init&gt;"</code> = <strong>initialization</strong> (run the constructor on the new object); <code>astore_1</code> = store the reference into the declared variable <code>stu</code> (local slot 1).</p>
<div class="out">&gt; javac Student.java<br>
&gt; javap -c -p Student<br>
Compiled from "Student.java"<br>
public class Student {<br>
&nbsp;&nbsp;private java.lang.String code;<br>
<br>
&nbsp;&nbsp;public Student(java.lang.String);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokespecial #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/Object."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: putfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field code:Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9: return<br>
<br>
&nbsp;&nbsp;public void setCode(java.lang.String);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2: putfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field code:Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: return<br>
<br>
&nbsp;&nbsp;public static void main(java.lang.String[]);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class Student<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3: dup<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String SE123<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: invokespecial #5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method "&lt;init&gt;":(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9: astore_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String SE124<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13: invokevirtual #7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method setCode:(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16: return<br>
}</div>
<p class="meo">🧠 The <code>(String)</code> in <code>Method "&lt;init&gt;":(Ljava/lang/String;)V</code> is how the JVM names <em>which</em> constructor runs: by its parameter types — the signature of slide 12. <code>V</code> = void: a constructor returns nothing.</p>`,
        `<p class="y-chinh">🎯 Lớp là bản thiết kế; bạn tạo đối tượng từ nó. <code>Student stu = new Student("SE123", "Minh", 2000, "1 Ba Trieu");</code> có ba phần: <strong>khai báo (declaration)</strong> (một tên biến gắn với một kiểu đối tượng), <strong>tạo thể hiện (instantiation)</strong> (toán tử <code>new</code> tạo đối tượng — bộ nhớ được cấp), <strong>khởi tạo (initialization)</strong> (<code>new</code> đi kèm một lời gọi constructor, gán giá trị cho các trường).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/977108f5de3ed69215b827ba7e5d90bf48b408d1.svg" alt="Ba phần của slide 17 trên bức tranh stack/heap của bài 2.A" loading="lazy" /><p class="chu-thich">🧩 Ba phần của slide 17 trên bức tranh stack/heap của bài 2.A</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 17 and 20 — Student stu = new Student(...): declaration, instantiation, initialization
left to right direction
package "Stack — frame of main" {
  rectangle "stu : Student\\n(1) declaration: a variable\\nthat can hold a reference" as V
}
package "Heap" {
  rectangle "Student object\\n—\\n(2) instantiation: new allocates memory,\\nevery field = 0 / null\\n(3) initialization: the constructor\\nruns and sets code, name, bYear, address" as O #ECFDF5
}
V --&gt; O : (4) the reference\\nis stored in stu
@enduml</code></pre></details>
<p>Ba phần này hiện thành các lệnh riêng trong bytecode ở lần chạy <code>javap</code> của bài 2.B (phương thức <code>main</code> của <code>Student</code>): <code>new #3 // class Student</code> = <strong>tạo thể hiện</strong> (cấp bộ nhớ, các trường về 0); <code>dup</code> + <code>ldc "SE123"</code> + <code>invokespecial … "&lt;init&gt;"</code> = <strong>khởi tạo</strong> (chạy constructor trên đối tượng mới); <code>astore_1</code> = cất tham chiếu vào biến đã khai báo <code>stu</code> (ô cục bộ số 1).</p>
<div class="out">&gt; javac Student.java<br>
&gt; javap -c -p Student<br>
Compiled from "Student.java"<br>
public class Student {<br>
&nbsp;&nbsp;private java.lang.String code;<br>
<br>
&nbsp;&nbsp;public Student(java.lang.String);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokespecial #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/Object."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: putfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field code:Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9: return<br>
<br>
&nbsp;&nbsp;public void setCode(java.lang.String);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2: putfield &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field code:Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: return<br>
<br>
&nbsp;&nbsp;public static void main(java.lang.String[]);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// class Student<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3: dup<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String SE123<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6: invokespecial #5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method "&lt;init&gt;":(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9: astore_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10: aload_1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String SE124<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13: invokevirtual #7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method setCode:(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16: return<br>
}</div>
<p class="meo">🧠 Phần <code>(String)</code> trong <code>Method "&lt;init&gt;":(Ljava/lang/String;)V</code> là cách JVM gọi tên constructor <em>nào</em> sẽ chạy: theo kiểu tham số — đúng chữ ký ở slide 12. <code>V</code> = void: constructor không trả về gì.</p>`],
      [18, 'Types of Constructors — Create/Use an object of a class',
        `<p class="y-chinh">🎯 Two kinds: a <strong>default constructor</strong> (no parameters) and a <strong>parametric constructor</strong> (at least one parameter). Create with <code>ClassName obj1 = new ClassName();</code> or <code>new ClassName(params)</code>; access a field with <code>object.field</code>; call a method with <code>object.method(params)</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 18: two kinds of constructor, creating objects with each, object.field and object.method(params) — and what a null reference does
class Book {
    String title;
    int pages;

    Book() { title = "untitled"; pages = 0; }                          // no-parameter ("default") constructor
    Book(String title, int pages) { this.title = title; this.pages = pages; }   // parametric constructor

    int readingDays(int pagesPerDay) { return (pages + pagesPerDay - 1) / pagesPerDay; }
}

public class DungDoiTuong {
    public static void main(String[] args) {
        Book obj1 = new Book();                         // ClassName obj1 = new ClassName();
        Book obj2 = new Book("Core Java I", 928);       // ClassName obj2 = new ClassName(params);
        obj1.title = "Notes";                           // object.field — allowed here because the field is not private
        System.out.println(obj1.title + ", " + obj1.pages + " pages");
        System.out.println(obj2.title + ": " + obj2.readingDays(40) + " days at 40 pages/day");   // object.method(params)

        Book nothing = null;                            // a reference that points to no object
        try {
            System.out.println(nothing.title);
        } catch (NullPointerException e) {
            System.out.println("nothing.title -&gt; " + e.getClass().getSimpleName() + ": there is no object to read from");
        }
    }
}</code></pre>
<div class="out">Notes, 0 pages<br>
Core Java I: 24 days at 40 pages/day<br>
nothing.title -&gt; NullPointerException: there is no object to read from</div>
<p>The dot is the operator of this whole course: <code>obj2.readingDays(40)</code> means "run <code>readingDays</code> with <code>this</code> = obj2". When the variable holds <code>null</code> there is no object to go to — <code>NullPointerException</code>, the most common run-time error of PRO192.</p>
<p>➕ Terminology, precisely. The Java Language Specification (§8.8.9) uses <strong>default constructor</strong> only for the one the <em>compiler</em> generates when you write none. A no-argument constructor you write yourself is, strictly, a <strong>no-arg constructor</strong>. The slide and most FE questions use "default" for both — answer FE questions in their own sense, but know the difference when you read documentation.</p>
<div class="pitfall"><code>object.field</code> works from another class only if the field is not <code>private</code>. In a PE every field is <code>private</code> (the <code>-</code> in the diagram), so from <code>main</code> you must write <code>obj.getName()</code>, never <code>obj.name</code>.</div>`,
        `<p class="y-chinh">🎯 Hai loại: <strong>constructor mặc định (default constructor)</strong> (không tham số) và <strong>constructor có tham số (parametric constructor)</strong> (ít nhất một tham số). Tạo bằng <code>TênLớp obj1 = new TênLớp();</code> hoặc <code>new TênLớp(tham_số)</code>; truy cập trường bằng <code>object.field</code>; gọi phương thức bằng <code>object.method(params)</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 18: hai loại constructor, tạo đối tượng bằng từng loại, object.field và object.method(params) — và tham chiếu null làm gì
class Book {
    String title;
    int pages;

    Book() { title = "untitled"; pages = 0; }                          // constructor không tham số ("mặc định")
    Book(String title, int pages) { this.title = title; this.pages = pages; }   // constructor có tham số

    int readingDays(int pagesPerDay) { return (pages + pagesPerDay - 1) / pagesPerDay; }
}

public class DungDoiTuong {
    public static void main(String[] args) {
        Book obj1 = new Book();                         // TênLớp obj1 = new TênLớp();
        Book obj2 = new Book("Core Java I", 928);       // TênLớp obj2 = new TênLớp(tham_số);
        obj1.title = "Notes";                           // object.field — được vì trường không private
        System.out.println(obj1.title + ", " + obj1.pages + " pages");
        System.out.println(obj2.title + ": " + obj2.readingDays(40) + " days at 40 pages/day");   // object.method(tham_số)

        Book nothing = null;                            // một tham chiếu không trỏ tới đối tượng nào
        try {
            System.out.println(nothing.title);
        } catch (NullPointerException e) {
            System.out.println("nothing.title -&gt; " + e.getClass().getSimpleName() + ": there is no object to read from");
        }
    }
}</code></pre>
<div class="out">Notes, 0 pages<br>
Core Java I: 24 days at 40 pages/day<br>
nothing.title -&gt; NullPointerException: there is no object to read from</div>
<p>Dấu chấm là toán tử của cả môn học: <code>obj2.readingDays(40)</code> nghĩa là "chạy <code>readingDays</code> với <code>this</code> = obj2". Khi biến giữ <code>null</code> thì không có đối tượng nào để tới — <code>NullPointerException</code>, lỗi lúc chạy hay gặp nhất của PRO192.</p>
<p>➕ Thuật ngữ, cho chính xác. Đặc tả ngôn ngữ Java (JLS mục 8.8.9) chỉ gọi là <strong>default constructor</strong> cái constructor do <em>trình biên dịch</em> sinh ra khi bạn không viết cái nào. Constructor không tham số do bạn tự viết, nói chặt chẽ, là <strong>no-arg constructor</strong>. Slide và phần lớn câu FE dùng "default" cho cả hai — trả lời FE theo nghĩa của đề, nhưng hãy biết sự khác nhau khi đọc tài liệu.</p>
<div class="pitfall"><code>object.field</code> chỉ dùng được từ lớp khác nếu trường không <code>private</code>. Trong đề PE mọi trường đều <code>private</code> (dấu <code>-</code> trong sơ đồ), nên từ <code>main</code> bạn phải viết <code>obj.getName()</code>, không bao giờ <code>obj.name</code>.</div>`],
      [19, 'Demo: If we do not implement any constructor, compiler will insert to the class a system default constructor',
        `<p class="y-chinh">🎯 The demo project <code>FirstPrj</code>, package <code>point1</code>: class <code>IntPoint1</code> represents a point with integer coordinates; class <code>IntPoint1_Use</code> has the <code>main</code> method that uses it.</p>
<p>The screenshot shows the NetBeans project tree: <code>&lt;default package&gt;</code> with <code>Adding.java</code> and <code>HelloWorld.java</code>, package <code>mypkg</code> with <code>PkgDemo.java</code> (slide 27), package <code>point1</code> with the two demo files, and the library <code>JDK 1.8 (Default)</code> — the exam JDK. Putting the "model" class and the class with <code>main</code> in separate files is the shape of every PE project: the paper's given <code>Main</code> uses <em>your</em> classes.</p>
<p>Both files of this demo were rebuilt and run on JDK 8 in lesson 2.B, slide 9 (program <code>HamTaoMacDinh</code>): <code>IntPoint1_Use</code> prints <code>[0,0]</code>, and <code>javap</code> shows the constructor the compiler inserted.</p>
<p class="meo">🧠 In NetBeans: right-click Source Packages → New → Java Package → <code>point1</code>; then right-click <code>point1</code> → New → Java Class. NetBeans writes the <code>package point1;</code> line for you.</p>`,
        `<p class="y-chinh">🎯 Project demo <code>FirstPrj</code>, package <code>point1</code>: lớp <code>IntPoint1</code> biểu diễn một điểm có toạ độ nguyên; lớp <code>IntPoint1_Use</code> có phương thức <code>main</code> dùng lớp kia.</p>
<p>Ảnh chụp cho thấy cây project NetBeans: <code>&lt;default package&gt;</code> có <code>Adding.java</code> và <code>HelloWorld.java</code>, package <code>mypkg</code> có <code>PkgDemo.java</code> (slide 27), package <code>point1</code> có hai file demo, và thư viện <code>JDK 1.8 (Default)</code> — JDK của phòng thi. Đặt lớp "mô hình" và lớp chứa <code>main</code> ở hai file riêng chính là hình dạng của mọi project PE: lớp <code>Main</code> đề cho sẵn dùng các lớp <em>của bạn</em>.</p>
<p>Cả hai file của demo này đã được dựng lại và chạy trên JDK 8 ở bài 2.B, slide 9 (chương trình <code>HamTaoMacDinh</code>): <code>IntPoint1_Use</code> in ra <code>[0,0]</code>, và <code>javap</code> cho thấy constructor mà trình biên dịch đã chèn vào.</p>
<p class="meo">🧠 Trong NetBeans: chuột phải Source Packages → New → Java Package → <code>point1</code>; rồi chuột phải <code>point1</code> → New → Java Class. NetBeans tự viết dòng <code>package point1;</code> cho bạn.</p>`],
      [20, 'Demo: If we do not implement any constructor, compiler will insert to the class a default constructor',
        `<p class="y-chinh">🎯 <code>IntPoint1</code> has fields <code>x</code>, <code>y</code> and a method <code>output()</code>, no constructor; <code>new IntPoint1()</code> still works and <code>p.output()</code> prints <code>[0,0]</code>. The picture: (1) memory allocation at address 100, (2) setup values x = 0, y = 0; <code>p</code> holds 100 — "an object variable is a reference". The green note says the system constructor "will clear all bits in allocated memory".</p>
<p>The output and the picture are right. The green note puts the zeroing in the wrong place. We already saw the inserted constructor in <code>javap</code>: <code>aload_0, invokespecial Object.&lt;init&gt;, return</code> — it does not touch <code>x</code> or <code>y</code>. The zeros come from <strong>step (1)</strong>: the Java Language Specification (§4.12.5, §12.5) requires every new object's fields to hold their <strong>default values</strong> before any constructor runs. Measured, with every kind of field:</p>
<pre><code class="language-java">// release: 8
// Slides 20 and 25: the real order in which a new object gets its values — 0 first, then field initializers, then the constructor body
class Demo {
    int b;                                   // no initializer
    int a = show("step 2 - field initializer a = 5 runs (b is still " + b + ")", 5);
    double d;
    boolean ok;
    String s;

    Demo() {
        show("step 3 - constructor body starts: a=" + a + ", b=" + b + ", d=" + d + ", ok=" + ok + ", s=" + s, 0);
        b = 10;
        show("step 4 - constructor body ends:   a=" + a + ", b=" + b, 0);
    }
    static int show(String msg, int v) { System.out.println(msg); return v; }
}

public class ThuTuKhoiTao {
    public static void main(String[] args) {
        System.out.println("step 1 - new Demo(): memory is allocated and EVERY field is set to 0 / 0.0 / false / null");
        Demo x = new Demo();
        System.out.println("step 5 - the reference is stored in x: x.a=" + x.a + ", x.b=" + x.b);
    }
}</code></pre>
<div class="out">step 1 - new Demo(): memory is allocated and EVERY field is set to 0 / 0.0 / false / null<br>
step 2 - field initializer a = 5 runs (b is still 0)<br>
step 3 - constructor body starts: a=5, b=0, d=0.0, ok=false, s=null<br>
step 4 - constructor body ends: &nbsp;&nbsp;a=5, b=10<br>
step 5 - the reference is stored in x: x.a=5, x.b=10</div>
<table>
<thead><tr><th>Field type</th><th>Default value before any constructor</th></tr></thead>
<tbody>
<tr><td><code>byte short int long</code></td><td><code>0</code></td></tr>
<tr><td><code>float double</code></td><td><code>0.0</code></td></tr>
<tr><td><code>char</code></td><td><code>'\\u0000'</code> (character 0)</td></tr>
<tr><td><code>boolean</code></td><td><code>false</code></td></tr>
<tr><td>any reference (<code>String</code>, arrays, objects)</td><td><code>null</code></td></tr>
</tbody>
</table>
<div class="pitfall">Only <em>fields</em> get default values. A <strong>local variable</strong> has none: <code>int t; System.out.println(t);</code> does not compile ("variable t might not have been initialized"). FE likes to mix the two.</div>`,
        `<p class="y-chinh">🎯 <code>IntPoint1</code> có trường <code>x</code>, <code>y</code> và phương thức <code>output()</code>, không có constructor; vậy mà <code>new IntPoint1()</code> vẫn chạy và <code>p.output()</code> in <code>[0,0]</code>. Hình vẽ: (1) cấp bộ nhớ ở địa chỉ 100, (2) gán giá trị x = 0, y = 0; <code>p</code> giữ 100 — "biến đối tượng là một tham chiếu". Ô ghi chú xanh nói constructor hệ thống "sẽ xoá mọi bit trong vùng nhớ được cấp".</p>
<p>Output và hình vẽ đều đúng. Ô ghi chú xanh đặt việc gán 0 sai chỗ. Ta đã thấy constructor được chèn trong <code>javap</code>: <code>aload_0, invokespecial Object.&lt;init&gt;, return</code> — nó không đụng tới <code>x</code> hay <code>y</code>. Các số 0 đến từ <strong>bước (1)</strong>: đặc tả ngôn ngữ Java (JLS mục 4.12.5, 12.5) bắt buộc mọi trường của đối tượng mới phải mang <strong>giá trị mặc định</strong> trước khi bất kỳ constructor nào chạy. Đo thật, với đủ loại trường:</p>
<pre><code class="language-java">// release: 8
// Slide 20 và 25: thứ tự thật mà một đối tượng mới nhận giá trị — 0 trước, rồi giá trị khởi đầu của trường, rồi thân constructor
class Demo {
    int b;                                   // không có giá trị khởi đầu
    int a = show("step 2 - field initializer a = 5 runs (b is still " + b + ")", 5);
    double d;
    boolean ok;
    String s;

    Demo() {
        show("step 3 - constructor body starts: a=" + a + ", b=" + b + ", d=" + d + ", ok=" + ok + ", s=" + s, 0);
        b = 10;
        show("step 4 - constructor body ends:   a=" + a + ", b=" + b, 0);
    }
    static int show(String msg, int v) { System.out.println(msg); return v; }
}

public class ThuTuKhoiTao {
    public static void main(String[] args) {
        System.out.println("step 1 - new Demo(): memory is allocated and EVERY field is set to 0 / 0.0 / false / null");
        Demo x = new Demo();
        System.out.println("step 5 - the reference is stored in x: x.a=" + x.a + ", x.b=" + x.b);
    }
}</code></pre>
<div class="out">step 1 - new Demo(): memory is allocated and EVERY field is set to 0 / 0.0 / false / null<br>
step 2 - field initializer a = 5 runs (b is still 0)<br>
step 3 - constructor body starts: a=5, b=0, d=0.0, ok=false, s=null<br>
step 4 - constructor body ends: &nbsp;&nbsp;a=5, b=10<br>
step 5 - the reference is stored in x: x.a=5, x.b=10</div>
<table>
<thead><tr><th>Kiểu trường</th><th>Giá trị mặc định trước mọi constructor</th></tr></thead>
<tbody>
<tr><td><code>byte short int long</code></td><td><code>0</code></td></tr>
<tr><td><code>float double</code></td><td><code>0.0</code></td></tr>
<tr><td><code>char</code></td><td><code>'\\u0000'</code> (ký tự số 0)</td></tr>
<tr><td><code>boolean</code></td><td><code>false</code></td></tr>
<tr><td>mọi kiểu tham chiếu (<code>String</code>, mảng, đối tượng)</td><td><code>null</code></td></tr>
</tbody>
</table>
<div class="pitfall">Chỉ <em>trường</em> mới có giá trị mặc định. <strong>Biến cục bộ</strong> thì không: <code>int t; System.out.println(t);</code> không biên dịch được ("variable t might not have been initialized" — biến t có thể chưa được khởi tạo). FE hay trộn hai thứ này.</div>`],
      [21, 'Demo: If we implement a constructor, compiler does not insert default constructor',
        `<p class="y-chinh">🎯 The second demo shows two things: how NetBeans inserts methods for you automatically, and that once you implement your own constructor, the compiler <strong>no longer inserts</strong> the system default constructor. Files: <code>IntPoint2.java</code> and <code>IntPoint2_Use.java</code> in package <code>point1</code>.</p>
<p>The rule in one line (JLS §8.8.9): <strong>a default constructor is generated if and only if the class declares no constructor at all.</strong> It does not matter whether your constructor has one parameter or ten — any constructor switches the free one off.</p>
<table>
<thead><tr><th>Constructors you wrote</th><th>Can you call <code>new X()</code>?</th></tr></thead>
<tbody>
<tr><td>none</td><td>yes — the compiler inserted <code>X()</code></td></tr>
<tr><td><code>X(int x, int y)</code> only</td><td><strong>no</strong> — compile error (slide 24)</td></tr>
<tr><td><code>X(int x, int y)</code> and <code>X()</code></td><td>yes — you wrote both</td></tr>
</tbody>
</table>
<div class="pitfall">PE trap: the paper's UML lists <code>+Screen()</code> and <code>+Screen(diagonal, brightness)</code>. If you write only the second, the given <code>Main</code> that calls <code>new Screen()</code> does not compile — and an uncompilable project scores 0 for that question. Write <strong>every</strong> constructor in the diagram, even the empty one.</div>`,
        `<p class="y-chinh">🎯 Demo thứ hai cho thấy hai điều: NetBeans chèn phương thức hộ bạn thế nào, và một khi bạn tự cài constructor, trình biên dịch <strong>không chèn nữa</strong> constructor mặc định của hệ thống. File: <code>IntPoint2.java</code> và <code>IntPoint2_Use.java</code> trong package <code>point1</code>.</p>
<p>Luật trong một dòng (JLS mục 8.8.9): <strong>constructor mặc định được sinh ra khi và chỉ khi lớp không khai báo constructor nào.</strong> Constructor của bạn có một tham số hay mười tham số cũng vậy — có bất kỳ constructor nào là cái miễn phí bị tắt.</p>
<table>
<thead><tr><th>Constructor bạn đã viết</th><th>Gọi được <code>new X()</code> không?</th></tr></thead>
<tbody>
<tr><td>không có</td><td>được — trình biên dịch đã chèn <code>X()</code></td></tr>
<tr><td>chỉ <code>X(int x, int y)</code></td><td><strong>không</strong> — lỗi biên dịch (slide 24)</td></tr>
<tr><td><code>X(int x, int y)</code> và <code>X()</code></td><td>được — bạn đã viết cả hai</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy PE: sơ đồ UML của đề liệt kê <code>+Screen()</code> và <code>+Screen(diagonal, brightness)</code>. Nếu bạn chỉ viết cái thứ hai, lớp <code>Main</code> đề cho có gọi <code>new Screen()</code> sẽ không biên dịch được — và project không biên dịch được thì câu đó 0 điểm. Viết <strong>đủ mọi</strong> constructor trong sơ đồ, kể cả cái rỗng.</div>`],
      [22, 'Demo: If we implement a constructor, compiler does not insert default constructor',
        `<p class="y-chinh">🎯 Insert a constructor with NetBeans: right-click inside the class → <strong>Insert Code…</strong> (Alt+Insert) → <strong>Constructor…</strong> → tick <code>x : int</code> and <code>y : int</code> → Generate. Parameter names are the same as the field names, so <code>this</code> distinguishes them: <code>this.x</code> means "the x of this object".</p>
<p>The generated constructor is exactly the shadowing situation of slide 11, solved the standard way: inside the constructor, plain <code>x</code> is the parameter, <code>this.x</code> is the field. NetBeans' dialog lists only the fields, so the order of the parameters follows the order of the field declarations — check it against the PE diagram (<code>Screen(diagonal, brightness)</code> must not become <code>Screen(brightness, diagonal)</code>).</p>
<pre class="trich"><code class="language-java">class IntPoint2 {
    int x;
    int y;

    public IntPoint2(int x, int y) {     // Insert Code → Constructor… → tick x and y
        this.x = x;
        this.y = y;
    }

    public int getX() {                  // Insert Code → Getter and Setter… → tick x and y
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}</code></pre>
<p class="meo">🧠 Alt+Insert is the PE time-saver: fields typed by hand, then Constructor, Getter and Setter, <code>toString()</code> generated in seconds. Then <em>edit</em> what the paper asks for (validation in setters, a special <code>toString</code> format).</p>`,
        `<p class="y-chinh">🎯 Chèn constructor bằng NetBeans: chuột phải trong lớp → <strong>Insert Code…</strong> (Alt+Insert) → <strong>Constructor…</strong> → tích <code>x : int</code> và <code>y : int</code> → Generate. Tên tham số trùng tên trường, nên <code>this</code> giúp phân biệt: <code>this.x</code> nghĩa là "x của đối tượng này".</p>
<p>Constructor được sinh ra chính là tình huống che tên (shadowing) ở slide 11, được giải theo cách chuẩn: bên trong constructor, <code>x</code> trơn là tham số, <code>this.x</code> là trường. Hộp thoại của NetBeans chỉ liệt kê các trường, nên thứ tự tham số đi theo thứ tự khai báo trường — hãy đối chiếu với sơ đồ đề PE (<code>Screen(diagonal, brightness)</code> không được thành <code>Screen(brightness, diagonal)</code>).</p>
<pre class="trich"><code class="language-java">class IntPoint2 {
    int x;
    int y;

    public IntPoint2(int x, int y) {     // Insert Code → Constructor… → tích x và y
        this.x = x;
        this.y = y;
    }

    public int getX() {                  // Insert Code → Getter and Setter… → tích x và y
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}</code></pre>
<p class="meo">🧠 Alt+Insert là thứ tiết kiệm thời gian khi thi PE: gõ tay các trường, rồi sinh Constructor, Getter and Setter, <code>toString()</code> trong vài giây. Sau đó <em>sửa</em> theo đúng yêu cầu của đề (kiểm tra trong setter, định dạng <code>toString</code> riêng).</p>`],
      [23, 'Demo: If we implement a constructor, compiler does not insert default constructor',
        `<p class="y-chinh">🎯 Insert getters and setters: Insert Code… → <strong>Getter and Setter…</strong> → tick the fields → Generate. Each field usually gets a <strong>getter</strong> for reading its value and a <strong>setter</strong> for modifying it.</p>
<p>The generated pair for <code>x</code> is <code>public int getX() { return x; }</code> and <code>public void setX(int x) { this.x = x; }</code>, the same for <code>y</code>. Used from a <code>main</code>:</p>
<pre><code class="language-java">// release: 8
// Slides 22–23: the code NetBeans writes for you with Alt+Insert (Constructor…, then Getter and Setter…), used from a main
class IntPoint2 {
    int x;
    int y;

    public IntPoint2(int x, int y) {     // Insert Code → Constructor… → tick x and y
        this.x = x;
        this.y = y;
    }

    public int getX() {                  // Insert Code → Getter and Setter… → tick x and y
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}

public class IntPoint2Demo {
    public static void main(String[] args) {
        IntPoint2 p = new IntPoint2(3, 4);
        p.setX(p.getX() * 10);                 // read with the getter, write with the setter
        System.out.println("x = " + p.getX() + ", y = " + p.getY());
    }
}</code></pre>
<div class="out">x = 30, y = 4</div>
<p>The dialog in the screenshot also offers <strong>Encapsulate Fields</strong> (make the fields private and generate accessors in one go) and, in the Generate menu, <code>equals() and hashCode()…</code>, <code>toString()…</code>, <code>Override Method…</code> — you will use those in Chapters 4 and 8.</p>
<div class="pitfall">Generated code is not checked code: NetBeans' setters accept anything. If the PE says "salary must be ≥ 0", the generated <code>setSalary</code> must be edited. Also note the demo's fields <code>int x; int y;</code> have no modifier (default access) — in a PE make them <code>private</code> as the diagram's <code>-</code> says.</div>`,
        `<p class="y-chinh">🎯 Chèn getter và setter: Insert Code… → <strong>Getter and Setter…</strong> → tích các trường → Generate. Mỗi trường thường có một <strong>getter</strong> để đọc giá trị và một <strong>setter</strong> để sửa nó.</p>
<p>Cặp được sinh cho <code>x</code> là <code>public int getX() { return x; }</code> và <code>public void setX(int x) { this.x = x; }</code>, tương tự cho <code>y</code>. Dùng từ một <code>main</code>:</p>
<pre><code class="language-java">// release: 8
// Slide 22–23: đoạn code NetBeans viết hộ bạn bằng Alt+Insert (Constructor…, rồi Getter and Setter…), được dùng từ một main
class IntPoint2 {
    int x;
    int y;

    public IntPoint2(int x, int y) {     // Insert Code → Constructor… → tích x và y
        this.x = x;
        this.y = y;
    }

    public int getX() {                  // Insert Code → Getter and Setter… → tích x và y
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}

public class IntPoint2Demo {
    public static void main(String[] args) {
        IntPoint2 p = new IntPoint2(3, 4);
        p.setX(p.getX() * 10);                 // đọc bằng getter, ghi bằng setter
        System.out.println("x = " + p.getX() + ", y = " + p.getY());
    }
}</code></pre>
<div class="out">x = 30, y = 4</div>
<p>Hộp thoại trong ảnh còn có ô <strong>Encapsulate Fields</strong> (đổi các trường thành private và sinh hàm truy cập trong một lần), và menu Generate còn có <code>equals() and hashCode()…</code>, <code>toString()…</code>, <code>Override Method…</code> — bạn sẽ dùng chúng ở Chương 4 và 8.</p>
<div class="pitfall">Code được sinh ra không phải code đã kiểm tra: setter của NetBeans nhận mọi thứ. Nếu đề PE ghi "salary phải ≥ 0", <code>setSalary</code> được sinh ra phải được sửa lại. Để ý thêm: các trường <code>int x; int y;</code> của demo không có modifier (truy cập default) — trong bài PE hãy để chúng <code>private</code> đúng như dấu <code>-</code> của sơ đồ.</div>`],
      [24, 'Demo: If we implement a constructor, compiler does not insert system constructor',
        `<p class="y-chinh">🎯 With only <code>IntPoint2(int x, int y)</code> written, <code>IntPoint2 p = new IntPoint2();</code> in <code>IntPoint2_Use</code> is a compile error: the system no-argument constructor was not inserted.</p>
<p>The slide's comment paraphrases the error (and misspells the class as "InPoint2"). The real message from javac 8 — last command of the <code>HamTaoMacDinh</code> run in lesson 2.B, slide 9 — reads:</p>
<pre><code class="language-plaintext">point1/IntPoint2_Use.java:4: error: constructor IntPoint2 in class IntPoint2 cannot be applied to given types;
        IntPoint2 p = new IntPoint2();
                      ^
  required: int,int
  found: no arguments
  reason: actual and formal argument lists differ in length</code></pre>
<p>Learn to read it: <strong>required</strong> = the parameter types of the constructors that exist; <strong>found</strong> = what you passed. Two fixes, choose by meaning: pass the coordinates (<code>new IntPoint2(0, 0)</code>), or add a no-argument constructor yourself if "a point with no coordinates yet" makes sense.</p>
<p class="meo">🧠 NetBeans shows the same error as a red underline and a light-bulb in the margin (the icon at line 7 of the screenshot) before you even build.</p>`,
        `<p class="y-chinh">🎯 Khi chỉ viết <code>IntPoint2(int x, int y)</code>, câu <code>IntPoint2 p = new IntPoint2();</code> trong <code>IntPoint2_Use</code> là lỗi biên dịch: constructor không tham số của hệ thống đã không được chèn.</p>
<p>Chú thích trên slide diễn đạt lại thông báo lỗi (và gõ nhầm tên lớp thành "InPoint2"). Thông báo thật của javac 8 — lệnh cuối cùng của lần chạy <code>HamTaoMacDinh</code> ở bài 2.B, slide 9 — là:</p>
<pre><code class="language-plaintext">point1/IntPoint2_Use.java:4: error: constructor IntPoint2 in class IntPoint2 cannot be applied to given types;
        IntPoint2 p = new IntPoint2();
                      ^
  required: int,int
  found: no arguments
  reason: actual and formal argument lists differ in length</code></pre>
<p>Tập đọc nó: <strong>required</strong> (cần) = kiểu tham số của các constructor đang có; <strong>found</strong> (thấy) = thứ bạn đã truyền. Hai cách sửa, chọn theo ý nghĩa: truyền toạ độ (<code>new IntPoint2(0, 0)</code>), hoặc tự thêm một constructor không tham số nếu "một điểm chưa có toạ độ" là hợp lý.</p>
<p class="meo">🧠 NetBeans báo đúng lỗi này bằng gạch đỏ và bóng đèn ở lề (biểu tượng ở dòng 7 trong ảnh chụp) trước cả khi bạn build.</p>`],
      [25, 'Explain the result of the following program',
        `<p class="y-chinh">🎯 <code>IntPoint2</code> now has field initializers <code>x=7; y=3;</code> and two constructors that each call <code>output()</code> before and after assigning; <code>IntPoint2_Use</code> creates one point with each constructor. Explain the output <code>[7,3] [100,1000] [7,3] [-7,90]</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 25 "Explain the result of the following program" — the slide's two files, run for real
class IntPoint2 {
    int x = 7;
    int y = 3;
    public IntPoint2() {
        output();
        x = 100;
        y = 1000;
        output();
    }
    public IntPoint2(int x, int y) {
        output();
        this.x = x;
        this.y = y;
        output();
    }
    public void output() {
        String S = "[" + x + "," + y + "]";
        System.out.println(S);
    }
}

public class GiaiThichKetQua {           // the slide's IntPoint2_Use
    public static void main(String[] args) {
        System.out.println("Use default constructor:");
        IntPoint2 p1 = new IntPoint2();
        System.out.println("Use parametric constructor:");
        IntPoint2 p2 = new IntPoint2(-7, 90);
    }
}</code></pre>
<div class="out">Use default constructor:<br>
[7,3]<br>
[100,1000]<br>
Use parametric constructor:<br>
[7,3]<br>
[-7,90]</div>
<p>The explanation is the order measured on slide 20: (1) memory is allocated and <code>x</code>, <code>y</code> are 0; (2) the <strong>field initializers</strong> run — <code>x = 7, y = 3</code>; (3) the <strong>constructor body</strong> runs. So the first <code>output()</code> inside either constructor already sees <code>[7,3]</code> — the initializers ran before the body — and the second sees the values the body has just assigned. For <code>new IntPoint2(-7, 90)</code>, the parameters <code>x</code> and <code>y</code> shadow the fields, which is why the body must write <code>this.x = x</code>.</p>
<p>➕ This is also why <code>output()</code> can be called from a constructor at all: by the time the body runs, the object exists and its fields hold valid values. (The dangerous variant belongs to Chapter 4: a constructor calling a method that a subclass overrides runs the subclass's code before the subclass's fields are set.)</p>
<div class="pitfall">FE "what is printed" with constructors: write the three stages on scrap paper — default values, initializers, body — and simulate line by line. Never assume a field is 0 just because no constructor assigned it.</div>`,
        `<p class="y-chinh">🎯 Giờ <code>IntPoint2</code> có giá trị khởi đầu cho trường <code>x=7; y=3;</code> và hai constructor, mỗi cái gọi <code>output()</code> trước và sau khi gán; <code>IntPoint2_Use</code> tạo một điểm bằng mỗi constructor. Giải thích output <code>[7,3] [100,1000] [7,3] [-7,90]</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 25 "Giải thích kết quả của chương trình sau" — hai file của slide, chạy thật
class IntPoint2 {
    int x = 7;
    int y = 3;
    public IntPoint2() {
        output();
        x = 100;
        y = 1000;
        output();
    }
    public IntPoint2(int x, int y) {
        output();
        this.x = x;
        this.y = y;
        output();
    }
    public void output() {
        String S = "[" + x + "," + y + "]";
        System.out.println(S);
    }
}

public class GiaiThichKetQua {           // IntPoint2_Use của slide
    public static void main(String[] args) {
        System.out.println("Use default constructor:");
        IntPoint2 p1 = new IntPoint2();
        System.out.println("Use parametric constructor:");
        IntPoint2 p2 = new IntPoint2(-7, 90);
    }
}</code></pre>
<div class="out">Use default constructor:<br>
[7,3]<br>
[100,1000]<br>
Use parametric constructor:<br>
[7,3]<br>
[-7,90]</div>
<p>Lời giải là thứ tự đã đo ở slide 20: (1) bộ nhớ được cấp và <code>x</code>, <code>y</code> bằng 0; (2) các <strong>giá trị khởi đầu của trường (field initializer)</strong> chạy — <code>x = 7, y = 3</code>; (3) <strong>thân constructor</strong> chạy. Vì vậy lần <code>output()</code> đầu tiên trong constructor nào cũng đã thấy <code>[7,3]</code> — các giá trị khởi đầu chạy trước thân — còn lần thứ hai thấy giá trị mà thân vừa gán. Với <code>new IntPoint2(-7, 90)</code>, tham số <code>x</code> và <code>y</code> che các trường, nên thân phải viết <code>this.x = x</code>.</p>
<p>➕ Đây cũng là lý do gọi được <code>output()</code> ngay trong constructor: lúc thân chạy thì đối tượng đã tồn tại và các trường đã có giá trị hợp lệ. (Biến thể nguy hiểm thuộc Chương 4: constructor gọi một phương thức mà lớp con ghi đè sẽ chạy code của lớp con khi các trường của lớp con chưa được gán.)</p>
<div class="pitfall">Câu FE "in ra gì" có constructor: ghi ba chặng ra giấy nháp — giá trị mặc định, giá trị khởi đầu, thân constructor — rồi mô phỏng từng dòng. Đừng bao giờ mặc định một trường bằng 0 chỉ vì không constructor nào gán nó.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>Write a method that should double the money in a <code>Wallet</code>. Which version works — <code>w.money *= 2</code> or <code>w = new Wallet(w.money * 2)</code>? Why?</li>
<li>Class <code>Box</code> has <code>int size = 5;</code> and a constructor <code>Box() { System.out.println(size); size = 9; }</code>. What does <code>new Box()</code> print?</li>
<li>A PE diagram lists <code>+Laptop()</code> and <code>+Laptop(brand, price)</code>. What happens if you write only the second?</li>
</ul>
<p>Next: the 🧪 practice of Chapter 2 (pro192-on-ch2) puts lessons 2.A–2.C into PE-style exercises, then the rewritten Chapter 2 quiz. Chapter 3 continues the same deck from slide 26 (packages and access modifiers).</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Viết một phương thức nhân đôi tiền trong một <code>Wallet</code>. Bản nào chạy đúng — <code>w.money *= 2</code> hay <code>w = new Wallet(w.money * 2)</code>? Vì sao?</li>
<li>Lớp <code>Box</code> có <code>int size = 5;</code> và constructor <code>Box() { System.out.println(size); size = 9; }</code>. <code>new Box()</code> in ra gì?</li>
<li>Sơ đồ đề PE liệt kê <code>+Laptop()</code> và <code>+Laptop(brand, price)</code>. Chuyện gì xảy ra nếu bạn chỉ viết cái thứ hai?</li>
</ul>
<p>Tiếp theo: bài 🧪 thực hành Chương 2 (pro192-on-ch2) đưa bài 2.A–2.C vào các bài tập kiểu PE, rồi tới quiz Chương 2 đã viết lại. Chương 3 học tiếp cùng bộ slide từ slide 26 (package và access modifier).</p>`),
    books([
      ['horstmann1', 'Ch. 4.5 "Method Parameters" (Java uses call by value — the swap experiment) and 4.6 "Object Construction" (default field initialization, default constructor, explicit field initialization)', 'Chương 4.5 "Method Parameters" (Java gọi theo giá trị — thí nghiệm swap) và 4.6 "Object Construction" (khởi tạo trường mặc định, constructor mặc định, khởi tạo trường tường minh)'],
      ['jls8', '§4.12.5 "Initial Values of Variables", §8.8.9 "Default Constructor", §12.5 "Creation of New Class Instances"', 'mục 4.12.5 "Initial Values of Variables", 8.8.9 "Default Constructor", 12.5 "Creation of New Class Instances"'],
      ['fuOffline', 'part "Encapsulation" — Constructor, Overloading Constructors', 'phần "Encapsulation" — Constructor, Overloading Constructors'],
    ]),
  ].join('\n'),
};

/* ───────── 2.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Memory, classes and constructors: 7 PE and LAB211-style exercises ───────── */
const L_on_ch2 = {
  title: '2.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Memory, classes and constructors: 7 PE and LAB211-style exercises|||2.2 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Bộ nhớ, lớp và constructor: 7 bài kiểu PE và LAB211',
  slug: 'pro192-on-ch2',
  type: 'VIDEO',
  description: '7 bài tập Chương 2 có lời giải chạy thật trên JDK 8: viết lớp theo sơ đồ đúng dạng câu 1 đề PE (kèm driver 5 test case), lần theo đồ thị đối tượng để chỉ ra đối tượng nào là rác (WeakReference xác nhận), bốn cách tăng lương và cách nào thật sự đổi được đối tượng, ba constructor nối bằng this(...) với bộ đếm static, đoán output kiểu FE (giá trị khởi đầu, this, che tên), lỗi so sánh chuỗi bằng == với dữ liệu nhập thật, và chương trình menu quản lý sinh viên kiểu LAB211 có kiểm tra dữ liệu; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.2 · Practice &amp; review</span>
<h2>Seven exercises: from the memory picture to a PE class and a LAB211 menu</h2>
<p class="lead">Chapter 2 gave you the memory model (stack, heap, references, garbage), the anatomy of a class (fields, constructors, <code>this</code>, getters/setters) and the rule "Java passes by value". These exercises practise each one the way it is examined: exercise 1 is a PE question 1, exercises 2, 3 and 5 are FE-style "trace it on paper" questions, exercise 7 is a small LAB211 program. Try each one before opening the solution; every solution was compiled for Java 8 and run on a real JDK 8 — the output shown is the real output.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>1</td><td>write a class from a PE diagram, exactly</td><td>2.B slides 5, 9–14</td></tr>
<tr><td>2</td><td>find the garbage in an object graph</td><td>2.A slides 6–8</td></tr>
<tr><td>3</td><td>pass by value with objects</td><td>2.C slide 16</td></tr>
<tr><td>4</td><td>constructor overloading, <code>this(...)</code>, a <code>static</code> counter</td><td>2.B slides 9–10, 2.A slide 2</td></tr>
<tr><td>5</td><td>predict the output: initializers, constructors, shadowing</td><td>2.B slide 11, 2.C slide 25</td></tr>
<tr><td>6</td><td><code>==</code> versus <code>equals</code> with real input</td><td>2.A slide 6</td></tr>
<tr><td>7</td><td>LAB211 menu: one Scanner, validated input, a list of objects</td><td>2.B slides 14–15</td></tr>
</tbody>
</table>
<p>More questions of the same shape: the PE papers in the <a href="/exam?course=PRO192">Exam Room (PRO192)</a> — paper PE1 (SP26) question 1 (<code>CoffeeShop</code>) is exercise 1's twin.</p>`,
    `<span class="eyebrow">Chương 2 · Bài 2.2 · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: từ bức tranh bộ nhớ tới một lớp đề PE và một menu LAB211</h2>
<p class="lead">Chương 2 cho bạn mô hình bộ nhớ (stack, heap, tham chiếu, rác), cấu tạo của một lớp (trường, constructor, <code>this</code>, getter/setter) và luật "Java truyền theo giá trị". Các bài tập này luyện từng thứ theo đúng cách nó được thi: bài 1 là một câu 1 đề PE, bài 2, 3 và 5 là câu FE dạng "lần theo trên giấy", bài 7 là một chương trình LAB211 nhỏ. Hãy tự làm trước khi mở lời giải; lời giải nào cũng đã biên dịch cho Java 8 và chạy trên JDK 8 thật — output hiện ra là output thật.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>1</td><td>viết lớp theo sơ đồ đề PE, chính xác từng chữ</td><td>2.B slide 5, 9–14</td></tr>
<tr><td>2</td><td>tìm rác trong một đồ thị đối tượng</td><td>2.A slide 6–8</td></tr>
<tr><td>3</td><td>truyền theo giá trị với đối tượng</td><td>2.C slide 16</td></tr>
<tr><td>4</td><td>nạp chồng constructor, <code>this(...)</code>, bộ đếm <code>static</code></td><td>2.B slide 9–10, 2.A slide 2</td></tr>
<tr><td>5</td><td>đoán output: giá trị khởi đầu, constructor, che tên</td><td>2.B slide 11, 2.C slide 25</td></tr>
<tr><td>6</td><td><code>==</code> so với <code>equals</code> với dữ liệu nhập thật</td><td>2.A slide 6</td></tr>
<tr><td>7</td><td>menu LAB211: một Scanner, nhập có kiểm tra, danh sách đối tượng</td><td>2.B slide 14–15</td></tr>
</tbody>
</table>
<p>Thêm câu hỏi cùng dạng: các đề PE trong <a href="/exam?course=PRO192">Exam Room (PRO192)</a> — đề PE1 (SP26) câu 1 (<code>CoffeeShop</code>) là anh em sinh đôi của bài 1.</p>`),
    bi(`<h3>🧪 Exercise 1 — PE question 1: the Laptop class (~20 min)</h3>
<p>Write class <code>Laptop</code> (default package) exactly as the diagram says:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/659f13e5fe13f34ac679b45cbb5c71f5ce7a31b7.svg" alt="The diagram, PE style: every member is required, with these exact names" loading="lazy" /><p class="chu-thich">🧩 The diagram, PE style: every member is required, with these exact names</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — the class diagram as a PE paper gives it
class Laptop {
  - id : String
  - brand : String
  - price : double
  - ram : int
  --
  + Laptop()
  + Laptop(id : String, brand : String, price : double, ram : int)
  + getBrand() : String
  + getPrice() : double
  + setPrice(price : double) : void
  + getDiscountPrice() : double
  + toString() : String
}
@enduml</code></pre></details>
<ul>
<li><code>Laptop()</code> — id and brand <code>""</code>, price 0, ram 0. <code>Laptop(id, brand, price, ram)</code> — initialises all fields, price through <code>setPrice</code>.</li>
<li><code>getBrand()</code> — the brand with the first letter in upper case and the rest in lower case ("asus ROG" → "Asus rog").</li>
<li><code>setPrice(price)</code> — a negative price is stored as 0.</li>
<li><code>getDiscountPrice()</code> — <code>price * 0.9</code> if <code>ram &gt;= 16</code>, otherwise <code>price</code>.</li>
<li><code>toString()</code> — <code>id,BRAND IN UPPER CASE,price</code> with 2 decimals, no spaces.</li>
</ul>
<p>The driver below plays the PE's given <code>Main</code>: it reads a test-case number and the data, then calls one method.</p>
<p class="dap-an">✅ Solution (the class) and the real run of five test cases:</p>
<pre class="trich"><code class="language-java">class Laptop {
    private String id;
    private String brand;
    private double price;
    private int ram;

    public Laptop() {                                    // -&gt; id "", brand "", price 0, ram 0
        this("", "", 0, 0);
    }

    public Laptop(String id, String brand, double price, int ram) {
        this.id = id;
        this.brand = brand;
        setPrice(price);                                 // the constructor reuses the setter's rule
        this.ram = ram;
    }

    public String getBrand() {                           // first letter upper case, the rest lower case
        if (brand == null || brand.isEmpty()) return brand;
        return brand.substring(0, 1).toUpperCase() + brand.substring(1).toLowerCase();
    }

    public double getPrice() { return price; }

    public void setPrice(double price) {                 // a negative price becomes 0
        this.price = price &lt; 0 ? 0 : price;
    }

    public double getDiscountPrice() {                   // 10% off when ram &gt;= 16
        return ram &gt;= 16 ? price * 0.9 : price;
    }

    @Override
    public String toString() {                           // ID,BRAND,price with 2 decimals
        return id + "," + brand.toUpperCase() + "," + String.format("%.2f", price);
    }
}</code></pre>
<pre><code class="language-plaintext">1 / L01 / asus ROG / 1500 / 16
2 / L02 / Dell / 1000 / 16
3 / L03 / Hp / 700 / 8
4 / L04 / lenovo legion / 1234.5 / 32
2 / L05 / Acer / 800 / 8</code></pre>
<div class="out">TC1 OUTPUT: Asus rog<br>
TC2 OUTPUT: 900.00<br>
TC3 OUTPUT: 0.00<br>
TC4 OUTPUT: L04,LENOVO LEGION,1234.50<br>
TC2 OUTPUT: 800.00<br>
TC5 OUTPUT: ,,0.00 &nbsp;&nbsp;(default constructor)</div>
<p>Check the details the marker checks: "asus ROG" → "Asus rog" (not "Asus Rog" — only the <em>first</em> letter); ram 16 counts (<code>&gt;=</code>); TC3 stores 0 for −50; <code>%.2f</code> prints <code>1234.50</code>; the empty constructor gives <code>,,0.00</code>. Writing <code>this("", "", 0, 0)</code> keeps the default values in one line, and the full constructor calls <code>setPrice</code>, so the "negative ⇒ 0" rule also holds for <code>new Laptop("X", "Y", -1, 8)</code>.</p>`,
    `<h3>🧪 Bài 1 — Câu 1 đề PE: lớp Laptop (~20 phút)</h3>
<p>Viết lớp <code>Laptop</code> (default package) đúng như sơ đồ:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/659f13e5fe13f34ac679b45cbb5c71f5ce7a31b7.svg" alt="Sơ đồ kiểu đề PE: mọi thành viên đều bắt buộc, đúng tên này" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ kiểu đề PE: mọi thành viên đều bắt buộc, đúng tên này</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — the class diagram as a PE paper gives it
class Laptop {
  - id : String
  - brand : String
  - price : double
  - ram : int
  --
  + Laptop()
  + Laptop(id : String, brand : String, price : double, ram : int)
  + getBrand() : String
  + getPrice() : double
  + setPrice(price : double) : void
  + getDiscountPrice() : double
  + toString() : String
}
@enduml</code></pre></details>
<ul>
<li><code>Laptop()</code> — id và brand <code>""</code>, price 0, ram 0. <code>Laptop(id, brand, price, ram)</code> — khởi tạo mọi trường, price đi qua <code>setPrice</code>.</li>
<li><code>getBrand()</code> — tên hãng với chữ cái đầu viết hoa, phần còn lại viết thường ("asus ROG" → "Asus rog").</li>
<li><code>setPrice(price)</code> — giá âm thì lưu thành 0.</li>
<li><code>getDiscountPrice()</code> — <code>price * 0.9</code> nếu <code>ram &gt;= 16</code>, ngược lại <code>price</code>.</li>
<li><code>toString()</code> — <code>id,HÃNG VIẾT HOA,price</code> với 2 chữ số thập phân, không có dấu cách.</li>
</ul>
<p>Driver bên dưới đóng vai lớp <code>Main</code> đề cho: nó đọc số test case và dữ liệu, rồi gọi một phương thức.</p>
<p class="dap-an">✅ Lời giải (lớp) và lần chạy thật năm test case:</p>
<pre class="trich"><code class="language-java">class Laptop {
    private String id;
    private String brand;
    private double price;
    private int ram;

    public Laptop() {                                    // -&gt; id "", brand "", price 0, ram 0
        this("", "", 0, 0);
    }

    public Laptop(String id, String brand, double price, int ram) {
        this.id = id;
        this.brand = brand;
        setPrice(price);                                 // constructor dùng lại luật của setter
        this.ram = ram;
    }

    public String getBrand() {                           // chữ đầu viết hoa, còn lại viết thường
        if (brand == null || brand.isEmpty()) return brand;
        return brand.substring(0, 1).toUpperCase() + brand.substring(1).toLowerCase();
    }

    public double getPrice() { return price; }

    public void setPrice(double price) {                 // giá âm thành 0
        this.price = price &lt; 0 ? 0 : price;
    }

    public double getDiscountPrice() {                   // giảm 10% khi ram &gt;= 16
        return ram &gt;= 16 ? price * 0.9 : price;
    }

    @Override
    public String toString() {                           // ID,HÃNG,giá 2 chữ số thập phân
        return id + "," + brand.toUpperCase() + "," + String.format("%.2f", price);
    }
}</code></pre>
<pre><code class="language-plaintext">1 / L01 / asus ROG / 1500 / 16
2 / L02 / Dell / 1000 / 16
3 / L03 / Hp / 700 / 8
4 / L04 / lenovo legion / 1234.5 / 32
2 / L05 / Acer / 800 / 8</code></pre>
<div class="out">TC1 OUTPUT: Asus rog<br>
TC2 OUTPUT: 900.00<br>
TC3 OUTPUT: 0.00<br>
TC4 OUTPUT: L04,LENOVO LEGION,1234.50<br>
TC2 OUTPUT: 800.00<br>
TC5 OUTPUT: ,,0.00 &nbsp;&nbsp;(default constructor)</div>
<p>Soát những chi tiết mà máy chấm soát: "asus ROG" → "Asus rog" (không phải "Asus Rog" — chỉ chữ <em>đầu tiên</em>); ram 16 vẫn được tính (<code>&gt;=</code>); TC3 lưu 0 cho −50; <code>%.2f</code> in <code>1234.50</code>; constructor rỗng cho <code>,,0.00</code>. Viết <code>this("", "", 0, 0)</code> giữ các giá trị mặc định trong một dòng, còn constructor đầy đủ gọi <code>setPrice</code>, nên luật "âm ⇒ 0" cũng đúng với <code>new Laptop("X", "Y", -1, 8)</code>.</p>`),
    bi(`<h3>🧪 Exercise 2 — Where is the garbage? (~10 min, on paper)</h3>
<p>Draw the stack and the heap after each line, then answer: at the marked line, which of the objects A, B, C, D, E are <strong>garbage</strong> (eligible for GC)?</p>
<pre><code class="language-plaintext">Node a = new Node("A");
Node b = new Node("B");
Node c = new Node("C");
a.next = b;          // A -&gt; B
b.next = c;          // B -&gt; C
Node d = new Node("D");
c = null;
b = a;
a.next = null;
d = new Node("E");
// &gt;&gt;&gt; marked line</code></pre>
<p class="dap-an">✅ Answer, confirmed by WeakReference "cameras" and a real collection:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/fa70bffda03cbcde3036330ee4042ddb5ff6f777.svg" alt="The graph at the marked line: only A and E can be reached from a variable" loading="lazy" /><p class="chu-thich">🧩 The graph at the marked line: only A and E can be reached from a variable</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — the object graph at the marked line
left to right direction
package "Stack — main" {
  rectangle "a ●\\nb ●\\nc = null\\nd ●" as F
}
package "Heap" {
  rectangle "A\\nnext = null" as A #ECFDF5
  rectangle "B\\nnext → C" as B #FEF2F2
  rectangle "C\\nnext = null" as C #FEF2F2
  rectangle "D" as D #FEF2F2
  rectangle "E" as E #ECFDF5
}
F --&gt; A : a, b
F --&gt; E : d
B --&gt; C
note bottom of B
  red = unreachable from any
  variable = garbage (B, C, D),
  even though B still points to C
end note
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Chapter 2 practice, exercise 2 — trace by hand, then let WeakReference "cameras" confirm: which objects are garbage at the marked line?
import java.lang.ref.WeakReference;

class Node {
    String name;
    Node next;
    Node(String name) { this.name = name; }
}

public class DemDoiTuongRac {
    static String state(String name, WeakReference&lt;Node&gt; cam) { return name + (cam.get() == null ? " = garbage" : " = alive"); }

    public static void main(String[] args) {
        Node a = new Node("A");
        Node b = new Node("B");
        Node c = new Node("C");
        a.next = b;                  // A -&gt; B
        b.next = c;                  // B -&gt; C
        Node d = new Node("D");
        WeakReference&lt;Node&gt; camA = new WeakReference&lt;Node&gt;(a), camB = new WeakReference&lt;Node&gt;(b),
                            camC = new WeakReference&lt;Node&gt;(c), camD = new WeakReference&lt;Node&gt;(d);   // cameras do not keep anything alive
        c = null;                    // C is still reachable through a.next.next
        b = a;                       // the variable b now also points to A
        a.next = null;               // the chain A -&gt; B is cut
        d = new Node("E");           // D loses its only reference
        WeakReference&lt;Node&gt; camE = new WeakReference&lt;Node&gt;(d);
        // &gt;&gt;&gt; the marked line: which of A, B, C, D, E are garbage here?
        System.gc();
        System.out.println(state("A", camA) + "   (a and b both point to it)");
        System.out.println(state("B", camB) + "   (only A.next pointed to it, and that link was cut)");
        System.out.println(state("C", camC) + "   (only B pointed to it, and B is unreachable)");
        System.out.println(state("D", camD) + "   (d was moved to E)");
        System.out.println(state("E", camE) + "   (d points to it)");
        System.out.println("still used after the check: " + a.name + b.name + d.name);   // keeps a, b, d really in use
    }
}</code></pre>
<div class="out">A = alive &nbsp;&nbsp;(a and b both point to it)<br>
B = garbage &nbsp;&nbsp;(only A.next pointed to it, and that link was cut)<br>
C = garbage &nbsp;&nbsp;(only B pointed to it, and B is unreachable)<br>
D = garbage &nbsp;&nbsp;(d was moved to E)<br>
E = alive &nbsp;&nbsp;(d points to it)<br>
still used after the check: AAE</div>
<p>The trap is C. After <code>c = null</code> it is still reachable (<code>a.next.next</code>), so it is not garbage <em>yet</em>; it becomes garbage at <code>a.next = null</code>, together with B. And B still points to C — a reference <strong>from garbage</strong> keeps nothing alive. Reachability is always measured <em>from the variables</em> (stack, static fields), never between objects.</p>`,
    `<h3>🧪 Bài 2 — Rác nằm ở đâu? (~10 phút, làm trên giấy)</h3>
<p>Vẽ stack và heap sau từng dòng, rồi trả lời: ở dòng đánh dấu, đối tượng nào trong A, B, C, D, E là <strong>rác</strong> (đủ điều kiện bị thu gom)?</p>
<pre><code class="language-plaintext">Node a = new Node("A");
Node b = new Node("B");
Node c = new Node("C");
a.next = b;          // A -&gt; B
b.next = c;          // B -&gt; C
Node d = new Node("D");
c = null;
b = a;
a.next = null;
d = new Node("E");
// &gt;&gt;&gt; dòng đánh dấu</code></pre>
<p class="dap-an">✅ Đáp án, xác nhận bằng các "camera" WeakReference và một lần thu gom thật:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/fa70bffda03cbcde3036330ee4042ddb5ff6f777.svg" alt="Đồ thị ở dòng đánh dấu: chỉ A và E còn với tới được từ một biến" loading="lazy" /><p class="chu-thich">🧩 Đồ thị ở dòng đánh dấu: chỉ A và E còn với tới được từ một biến</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — the object graph at the marked line
left to right direction
package "Stack — main" {
  rectangle "a ●\\nb ●\\nc = null\\nd ●" as F
}
package "Heap" {
  rectangle "A\\nnext = null" as A #ECFDF5
  rectangle "B\\nnext → C" as B #FEF2F2
  rectangle "C\\nnext = null" as C #FEF2F2
  rectangle "D" as D #FEF2F2
  rectangle "E" as E #ECFDF5
}
F --&gt; A : a, b
F --&gt; E : d
B --&gt; C
note bottom of B
  red = unreachable from any
  variable = garbage (B, C, D),
  even though B still points to C
end note
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Thực hành Chương 2, bài 2 — lần theo bằng tay, rồi để các "camera" WeakReference xác nhận: đối tượng nào là rác ở dòng đánh dấu?
import java.lang.ref.WeakReference;

class Node {
    String name;
    Node next;
    Node(String name) { this.name = name; }
}

public class DemDoiTuongRac {
    static String state(String name, WeakReference&lt;Node&gt; cam) { return name + (cam.get() == null ? " = garbage" : " = alive"); }

    public static void main(String[] args) {
        Node a = new Node("A");
        Node b = new Node("B");
        Node c = new Node("C");
        a.next = b;                  // A -&gt; B
        b.next = c;                  // B -&gt; C
        Node d = new Node("D");
        WeakReference&lt;Node&gt; camA = new WeakReference&lt;Node&gt;(a), camB = new WeakReference&lt;Node&gt;(b),
                            camC = new WeakReference&lt;Node&gt;(c), camD = new WeakReference&lt;Node&gt;(d);   // camera không giữ cho ai sống
        c = null;                    // C vẫn với tới được qua a.next.next
        b = a;                       // biến b giờ cũng trỏ tới A
        a.next = null;               // chuỗi A -&gt; B bị cắt
        d = new Node("E");           // D mất tham chiếu duy nhất
        WeakReference&lt;Node&gt; camE = new WeakReference&lt;Node&gt;(d);
        // &gt;&gt;&gt; dòng đánh dấu: ở đây A, B, C, D, E cái nào là rác?
        System.gc();
        System.out.println(state("A", camA) + "   (a and b both point to it)");
        System.out.println(state("B", camB) + "   (only A.next pointed to it, and that link was cut)");
        System.out.println(state("C", camC) + "   (only B pointed to it, and B is unreachable)");
        System.out.println(state("D", camD) + "   (d was moved to E)");
        System.out.println(state("E", camE) + "   (d points to it)");
        System.out.println("still used after the check: " + a.name + b.name + d.name);   // giữ a, b, d thật sự còn dùng
    }
}</code></pre>
<div class="out">A = alive &nbsp;&nbsp;(a and b both point to it)<br>
B = garbage &nbsp;&nbsp;(only A.next pointed to it, and that link was cut)<br>
C = garbage &nbsp;&nbsp;(only B pointed to it, and B is unreachable)<br>
D = garbage &nbsp;&nbsp;(d was moved to E)<br>
E = alive &nbsp;&nbsp;(d points to it)<br>
still used after the check: AAE</div>
<p>Cái bẫy là C. Sau <code>c = null</code> nó vẫn với tới được (<code>a.next.next</code>), nên <em>chưa</em> là rác; nó thành rác ở <code>a.next = null</code>, cùng lúc với B. Và B vẫn trỏ tới C — một tham chiếu <strong>xuất phát từ rác</strong> không giữ được ai sống. Độ "với tới được" luôn được đo <em>từ các biến</em> (stack, trường static), không bao giờ đo giữa các đối tượng với nhau.</p>`),
    bi(`<h3>🧪 Exercise 3 — Four ways to give a 10% raise (~10 min)</h3>
<p>Employee An earns 1000. For each method, predict An's salary after the call (the calls run one after another), then run:</p>
<pre class="trich"><code class="language-java">static void raise1(double salary, double pct) { salary = salary * (1 + pct / 100); }
static void raise2(Employee e, double pct)     { e.setSalary(e.getSalary() * (1 + pct / 100)); }
static void raise3(Employee e, double pct)     { e = new Employee(e.getName(), e.getSalary() * (1 + pct / 100)); }
static Employee raise4(Employee e, double pct) { return new Employee(e.getName(), e.getSalary() * (1 + pct / 100)); }</code></pre>
<p class="dap-an">✅ Real output:</p>
<div class="out">after raise1: 1000.0<br>
after raise2: 1100.0<br>
after raise3: 1100.0<br>
after raise4: an = 1100.0, returned copy = 1210.0, same object? false</div>
<p><code>raise1</code> received a copy of the number 1000. <code>raise2</code> received a copy of the <em>reference</em> and followed it to An's object ⇒ 1100. <code>raise3</code> pointed its copy at a brand-new Employee that nobody keeps ⇒ An unchanged (still 1100). <code>raise4</code> is the honest version of <code>raise3</code>: it <em>returns</em> the new object — the original stays 1100, the copy is 1210, and <code>==</code> says they are two objects. Which one to choose? <code>raise2</code> when the object should change (a payroll update); <code>raise4</code> when the original must stay as it was (a "what if" calculation).</p>`,
    `<h3>🧪 Bài 3 — Bốn cách tăng lương 10% (~10 phút)</h3>
<p>Nhân viên An lương 1000. Với mỗi phương thức, đoán lương của An sau lời gọi (các lời gọi chạy nối tiếp nhau), rồi chạy thử:</p>
<pre class="trich"><code class="language-java">static void raise1(double salary, double pct) { salary = salary * (1 + pct / 100); }
static void raise2(Employee e, double pct)     { e.setSalary(e.getSalary() * (1 + pct / 100)); }
static void raise3(Employee e, double pct)     { e = new Employee(e.getName(), e.getSalary() * (1 + pct / 100)); }
static Employee raise4(Employee e, double pct) { return new Employee(e.getName(), e.getSalary() * (1 + pct / 100)); }</code></pre>
<p class="dap-an">✅ Output thật:</p>
<div class="out">after raise1: 1000.0<br>
after raise2: 1100.0<br>
after raise3: 1100.0<br>
after raise4: an = 1100.0, returned copy = 1210.0, same object? false</div>
<p><code>raise1</code> nhận bản sao của con số 1000. <code>raise2</code> nhận bản sao của <em>tham chiếu</em> và đi theo nó tới đối tượng của An ⇒ 1100. <code>raise3</code> chĩa bản sao của nó sang một Employee mới tinh mà không ai giữ ⇒ An không đổi (vẫn 1100). <code>raise4</code> là bản trung thực của <code>raise3</code>: nó <em>trả về</em> đối tượng mới — bản gốc giữ 1100, bản sao 1210, và <code>==</code> nói đó là hai đối tượng. Chọn cái nào? <code>raise2</code> khi đối tượng cần đổi (cập nhật bảng lương); <code>raise4</code> khi bản gốc phải giữ nguyên (tính thử "nếu như").</p>`),
    bi(`<h3>🧪 Exercise 4 — Three constructors, one place for the rules (~15 min)</h3>
<p>Write class <code>Rectangle</code> with <code>Rectangle()</code> (the unit square), <code>Rectangle(side)</code> (a square) and <code>Rectangle(width, height)</code>; a non-positive size becomes 1×1. Add <code>area()</code>, <code>perimeter()</code>, <code>toString()</code> and a static <code>getCreated()</code> that tells how many rectangles have been created. Rule: the validation and the counter may appear only <strong>once</strong>.</p>
<p class="dap-an">✅ Solution — the two short constructors delegate with <code>this(...)</code>:</p>
<pre><code class="language-java">// release: 8
// Chapter 2 practice, exercise 4 — three constructors chained with this(...), validation in ONE place, and a static counter of created objects
class Rectangle {
    private static int created = 0;          // one copy for the class (method area)
    private double width, height;

    public Rectangle() { this(1); }                          // the unit square
    public Rectangle(double side) { this(side, side); }      // a square
    public Rectangle(double width, double height) {          // the only constructor that does the work
        if (width &lt;= 0 || height &lt;= 0) { width = 1; height = 1; }
        this.width = width;
        this.height = height;
        created++;
    }

    public double area() { return width * height; }
    public double perimeter() { return 2 * (width + height); }
    public static int getCreated() { return created; }
    @Override public String toString() { return "Rectangle[" + width + " x " + height + "]"; }
}

public class HinhChuNhat {
    public static void main(String[] args) {
        Rectangle[] rs = { new Rectangle(), new Rectangle(3), new Rectangle(2, 5), new Rectangle(-4, 2) };
        for (Rectangle r : rs) System.out.println(r + " area=" + r.area() + " perimeter=" + r.perimeter());
        System.out.println("objects created: " + Rectangle.getCreated());
    }
}</code></pre>
<div class="out">Rectangle[1.0 x 1.0] area=1.0 perimeter=4.0<br>
Rectangle[3.0 x 3.0] area=9.0 perimeter=12.0<br>
Rectangle[2.0 x 5.0] area=10.0 perimeter=14.0<br>
Rectangle[1.0 x 1.0] area=1.0 perimeter=4.0<br>
objects created: 4</div>
<p>Because every path ends in <code>Rectangle(width, height)</code>, the check and <code>created++</code> run exactly once per object — 4 objects, counter 4. If each constructor had its own <code>created++</code>, <code>new Rectangle()</code> would count three times. <code>created</code> is <code>static</code>: one copy stored with the class (lesson 2.A), shared by all rectangles.</p>`,
    `<h3>🧪 Bài 4 — Ba constructor, một chỗ cho luật (~15 phút)</h3>
<p>Viết lớp <code>Rectangle</code> có <code>Rectangle()</code> (hình vuông đơn vị), <code>Rectangle(side)</code> (hình vuông) và <code>Rectangle(width, height)</code>; kích thước không dương thì thành 1×1. Thêm <code>area()</code>, <code>perimeter()</code>, <code>toString()</code> và phương thức static <code>getCreated()</code> cho biết đã tạo bao nhiêu hình chữ nhật. Luật: phép kiểm và bộ đếm chỉ được xuất hiện <strong>một lần</strong>.</p>
<p class="dap-an">✅ Lời giải — hai constructor ngắn uỷ quyền bằng <code>this(...)</code>:</p>
<pre><code class="language-java">// release: 8
// Thực hành Chương 2, bài 4 — ba constructor nối nhau bằng this(...), kiểm tra ở MỘT chỗ, và bộ đếm static số đối tượng đã tạo
class Rectangle {
    private static int created = 0;          // một bản cho cả lớp (method area)
    private double width, height;

    public Rectangle() { this(1); }                          // hình vuông đơn vị
    public Rectangle(double side) { this(side, side); }      // hình vuông
    public Rectangle(double width, double height) {          // constructor duy nhất làm việc thật
        if (width &lt;= 0 || height &lt;= 0) { width = 1; height = 1; }
        this.width = width;
        this.height = height;
        created++;
    }

    public double area() { return width * height; }
    public double perimeter() { return 2 * (width + height); }
    public static int getCreated() { return created; }
    @Override public String toString() { return "Rectangle[" + width + " x " + height + "]"; }
}

public class HinhChuNhat {
    public static void main(String[] args) {
        Rectangle[] rs = { new Rectangle(), new Rectangle(3), new Rectangle(2, 5), new Rectangle(-4, 2) };
        for (Rectangle r : rs) System.out.println(r + " area=" + r.area() + " perimeter=" + r.perimeter());
        System.out.println("objects created: " + Rectangle.getCreated());
    }
}</code></pre>
<div class="out">Rectangle[1.0 x 1.0] area=1.0 perimeter=4.0<br>
Rectangle[3.0 x 3.0] area=9.0 perimeter=12.0<br>
Rectangle[2.0 x 5.0] area=10.0 perimeter=14.0<br>
Rectangle[1.0 x 1.0] area=1.0 perimeter=4.0<br>
objects created: 4</div>
<p>Vì mọi đường đều kết thúc ở <code>Rectangle(width, height)</code>, phép kiểm và <code>created++</code> chạy đúng một lần cho mỗi đối tượng — 4 đối tượng, bộ đếm 4. Nếu constructor nào cũng có <code>created++</code> riêng, <code>new Rectangle()</code> sẽ bị đếm ba lần. <code>created</code> là <code>static</code>: một bản cất cùng lớp (bài 2.A), mọi hình chữ nhật dùng chung.</p>`),
    bi(`<h3>🧪 Exercise 5 — Predict the output, FE style (~10 min)</h3>
<p>Write down the three lines this program prints. Watch which <code>label</code> and which <code>value</code> each statement means.</p>
<pre class="trich"><code class="language-java">class Counter {
    int value = 10;
    String label;

    Counter() {
        this("none");
        value = value + 1;
        System.out.println("Counter() -&gt; value=" + value + ", label=" + label);
    }
    Counter(String label) {
        System.out.println("Counter(String) starts -&gt; value=" + value + ", label=" + this.label);
        label = label.toUpperCase();      // which label?
        value *= 2;
    }
    void add(int value) { value += value; this.value += value; }
}

public class DoanKetQua {
    public static void main(String[] args) {
        Counter c = new Counter();
        c.add(5);
        System.out.println("after add(5) -&gt; value=" + c.value + ", label=" + c.label);
    }
}</code></pre>
<p class="dap-an">✅ Real output:</p>
<div class="out">Counter(String) starts -&gt; value=10, label=null<br>
Counter() -&gt; value=21, label=null<br>
after add(5) -&gt; value=31, label=null</div>
<p>Step by step: <code>new Counter()</code> → fields get 0/null, then <code>value = 10</code> → <code>this("none")</code> runs <code>Counter(String)</code> first: it prints 10 and <code>null</code>; <code>label = label.toUpperCase()</code> changes only the <strong>parameter</strong> (it shadows the field), so the field stays <code>null</code>; <code>value *= 2</code> has no parameter called value ⇒ the field becomes 20. Back in <code>Counter()</code>: 20 + 1 = 21. In <code>add(5)</code>, <code>value += value</code> doubles the parameter to 10, then <code>this.value += value</code> adds 10 ⇒ 31.</p>`,
    `<h3>🧪 Bài 5 — Đoán output kiểu FE (~10 phút)</h3>
<p>Viết ra ba dòng mà chương trình này in. Để ý mỗi câu lệnh đang nói tới <code>label</code> nào và <code>value</code> nào.</p>
<pre class="trich"><code class="language-java">class Counter {
    int value = 10;
    String label;

    Counter() {
        this("none");
        value = value + 1;
        System.out.println("Counter() -&gt; value=" + value + ", label=" + label);
    }
    Counter(String label) {
        System.out.println("Counter(String) starts -&gt; value=" + value + ", label=" + this.label);
        label = label.toUpperCase();      // label nào?
        value *= 2;
    }
    void add(int value) { value += value; this.value += value; }
}

public class DoanKetQua {
    public static void main(String[] args) {
        Counter c = new Counter();
        c.add(5);
        System.out.println("after add(5) -&gt; value=" + c.value + ", label=" + c.label);
    }
}</code></pre>
<p class="dap-an">✅ Output thật:</p>
<div class="out">Counter(String) starts -&gt; value=10, label=null<br>
Counter() -&gt; value=21, label=null<br>
after add(5) -&gt; value=31, label=null</div>
<p>Từng bước: <code>new Counter()</code> → các trường nhận 0/null, rồi <code>value = 10</code> → <code>this("none")</code> chạy <code>Counter(String)</code> trước: nó in 10 và <code>null</code>; <code>label = label.toUpperCase()</code> chỉ đổi <strong>tham số</strong> (tham số che trường), nên trường vẫn <code>null</code>; <code>value *= 2</code> không có tham số nào tên value ⇒ trường thành 20. Quay về <code>Counter()</code>: 20 + 1 = 21. Trong <code>add(5)</code>, <code>value += value</code> nhân đôi tham số thành 10, rồi <code>this.value += value</code> cộng thêm 10 ⇒ 31.</p>`),
    bi(`<h3>🧪 Exercise 6 — The login that passes every test and fails in class (~5 min)</h3>
<p><code>loginWrong</code> returns <code>true</code> when tested with the literal <code>"admin"</code>. The user then types <code>admin</code> on the keyboard. Predict both results, run, and explain.</p>
<pre class="trich"><code class="language-java">static boolean loginWrong(String user) { return user == ADMIN; }          // compares references
static boolean loginRight(String user) { return ADMIN.equals(user); }     // compares characters; safe even if user is null</code></pre>
<p class="dap-an">✅ Real output (keyboard input: <code>admin</code>):</p>
<div class="out">literal "admin": wrong=true, right=true<br>
typed &nbsp;&nbsp;"admin": wrong=false, right=true<br>
typed.intern() == ADMIN ? true &nbsp;&nbsp;(intern returns the pooled copy — a curiosity, not a fix)<br>
null: right=false</div>
<p>Two literals <code>"admin"</code> are the <em>same pooled object</em>, so <code>==</code> happens to be true in a quick test. <code>nextLine()</code> builds a <strong>new</strong> String on the heap, so <code>==</code> compares two different references ⇒ false, although the characters are equal. <code>ADMIN.equals(user)</code> compares characters, and writing the constant first also makes <code>null</code> safe. (<code>intern()</code> makes <code>==</code> work again, but it is a curiosity — use <code>equals</code>.)</p>`,
    `<h3>🧪 Bài 6 — Đăng nhập qua mọi phép thử rồi hỏng khi lên lớp (~5 phút)</h3>
<p><code>loginWrong</code> trả về <code>true</code> khi thử bằng hằng chuỗi <code>"admin"</code>. Sau đó người dùng gõ <code>admin</code> từ bàn phím. Đoán cả hai kết quả, chạy, rồi giải thích.</p>
<pre class="trich"><code class="language-java">static boolean loginWrong(String user) { return user == ADMIN; }          // so tham chiếu
static boolean loginRight(String user) { return ADMIN.equals(user); }     // so ký tự; an toàn kể cả khi user là null</code></pre>
<p class="dap-an">✅ Output thật (gõ bàn phím: <code>admin</code>):</p>
<div class="out">literal "admin": wrong=true, right=true<br>
typed &nbsp;&nbsp;"admin": wrong=false, right=true<br>
typed.intern() == ADMIN ? true &nbsp;&nbsp;(intern returns the pooled copy — a curiosity, not a fix)<br>
null: right=false</div>
<p>Hai hằng chuỗi <code>"admin"</code> là <em>cùng một đối tượng trong pool</em>, nên <code>==</code> tình cờ đúng trong phép thử nhanh. <code>nextLine()</code> dựng một String <strong>mới</strong> trên heap, nên <code>==</code> so hai tham chiếu khác nhau ⇒ false, dù các ký tự giống hệt. <code>ADMIN.equals(user)</code> so ký tự, và viết hằng ở trước còn giúp an toàn với <code>null</code>. (<code>intern()</code> làm <code>==</code> đúng trở lại, nhưng đó chỉ là chuyện lạ — hãy dùng <code>equals</code>.)</p>`),
    bi(`<h3>🧪 Exercise 7 — LAB211 style: a student manager with a menu (~40 min)</h3>
<p>Write a console program with the menu <code>1.Add 2.List 3.Search 4.Update GPA 5.Exit</code>. A student has an id (<code>SE</code> + 6 digits, case-insensitive, stored in upper case, never changes), a name (not blank, trimmed) and a GPA (0–10). Invalid input must print a message and <strong>ask again</strong>; a duplicate id is refused. Use one <code>Scanner</code> and an <code>ArrayList</code>.</p>
<p class="dap-an">✅ Solution — the entity guards itself, the input helpers re-ask:</p>
<pre class="trich"><code class="language-java">class Student {
    private final String id;                 // an id never changes: no setter
    private String name;
    private double gpa;

    public Student(String id, String name, double gpa) {
        this.id = id.toUpperCase();
        setName(name);
        setGpa(gpa);
    }
    public String getId() { return id; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }
    public boolean setName(String name) {
        if (name == null || name.trim().isEmpty()) return false;
        this.name = name.trim();
        return true;
    }
    public boolean setGpa(double gpa) {
        if (gpa &lt; 0 || gpa &gt; 10) return false;
        this.gpa = gpa;
        return true;
    }
    @Override public String toString() { return String.format("%-9s| %-18s| %5.2f", id, name, gpa); }
}</code></pre>
<pre class="trich"><code class="language-java">static String readId(String prompt) {
    while (true) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        if (s.matches("[Ss][Ee]\\\\d{6}")) return s.toUpperCase();
        System.out.println("  ! id must look like SE190123");
    }
}
static String readNonBlank(String prompt) {
    while (true) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        if (!s.isEmpty()) return s;
        System.out.println("  ! must not be empty");
    }
}
static double readDouble(String prompt, double min, double max) {
    while (true) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        try {
            double v = Double.parseDouble(s);
            if (v &gt;= min &amp;&amp; v &lt;= max) return v;
        } catch (NumberFormatException e) {   // not a number: fall through to the message
        }
        System.out.println("  ! enter a number from " + min + " to " + max);
    }
}</code></pre>
<p>A real run with mistakes on purpose (a 5-digit id, GPA 11, "abc", a duplicate, a blank name, a wrong menu choice):</p>
<pre><code class="language-plaintext">1 / se19012 / se190123 / Nguyen Van An / 11 / abc / 8.5
1 / SE190123
1 / he190777 / se190777 / (spaces) / "  Tran Thi Binh " / 9
2 · 3 / se190123 · 4 / SE190777 / 9.25 · 2 · 9 · 5</code></pre>
<div class="out">1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id: &nbsp;&nbsp;! id must look like SE190123<br>
id: name: gpa: &nbsp;&nbsp;! enter a number from 0.0 to 10.0<br>
gpa: &nbsp;&nbsp;! enter a number from 0.0 to 10.0<br>
gpa: &nbsp;&nbsp;added SE190123<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id: &nbsp;&nbsp;! SE190123 already exists<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id: &nbsp;&nbsp;! id must look like SE190123<br>
id: name: &nbsp;&nbsp;! must not be empty<br>
name: gpa: &nbsp;&nbsp;added SE190777<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: &nbsp;&nbsp;SE190123 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;8.50<br>
&nbsp;&nbsp;SE190777 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.00<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id to find: &nbsp;&nbsp;SE190123 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;8.50<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id to update: new gpa: &nbsp;&nbsp;SE190777 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.25<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: &nbsp;&nbsp;SE190123 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;8.50<br>
&nbsp;&nbsp;SE190777 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.25<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: &nbsp;&nbsp;! choose 1-5<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: bye</div>
<p>What a LAB211 grader looks for, all present: the id has no setter (<code>final</code>); <code>setGpa</code> refuses out-of-range values even if some future code forgets to validate; the input helpers loop until valid instead of crashing on <code>parseDouble("abc")</code>; search uses <code>equalsIgnoreCase</code>, not <code>==</code>; exactly one <code>Scanner</code>. The prompts run together in the output because input is piped — typed by hand, each answer appears after its prompt.</p>
<div class="callout">🧭 <strong>Go further — LAB211</strong>: split this file the LAB211 way — <code>model/Student.java</code>, <code>controller/StudentManager.java</code> (the list and the operations), <code>view/Menu.java</code>, <code>utils/Inputter.java</code> (the three read methods) — the packages of Chapter 3 make that possible.</div>`,
    `<h3>🧪 Bài 7 — Kiểu LAB211: quản lý sinh viên có menu (~40 phút)</h3>
<p>Viết chương trình console có menu <code>1.Add 2.List 3.Search 4.Update GPA 5.Exit</code>. Một sinh viên có mã (<code>SE</code> + 6 chữ số, không phân biệt hoa thường, lưu dạng viết hoa, không bao giờ đổi), tên (không trống, cắt khoảng trắng) và GPA (0–10). Nhập sai phải in thông báo và <strong>hỏi lại</strong>; mã trùng bị từ chối. Dùng một <code>Scanner</code> và một <code>ArrayList</code>.</p>
<p class="dap-an">✅ Lời giải — lớp thực thể tự canh giữ, các hàm nhập tự hỏi lại:</p>
<pre class="trich"><code class="language-java">class Student {
    private final String id;                 // mã số không bao giờ đổi: không có setter
    private String name;
    private double gpa;

    public Student(String id, String name, double gpa) {
        this.id = id.toUpperCase();
        setName(name);
        setGpa(gpa);
    }
    public String getId() { return id; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }
    public boolean setName(String name) {
        if (name == null || name.trim().isEmpty()) return false;
        this.name = name.trim();
        return true;
    }
    public boolean setGpa(double gpa) {
        if (gpa &lt; 0 || gpa &gt; 10) return false;
        this.gpa = gpa;
        return true;
    }
    @Override public String toString() { return String.format("%-9s| %-18s| %5.2f", id, name, gpa); }
}</code></pre>
<pre class="trich"><code class="language-java">static String readId(String prompt) {
    while (true) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        if (s.matches("[Ss][Ee]\\\\d{6}")) return s.toUpperCase();
        System.out.println("  ! id must look like SE190123");
    }
}
static String readNonBlank(String prompt) {
    while (true) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        if (!s.isEmpty()) return s;
        System.out.println("  ! must not be empty");
    }
}
static double readDouble(String prompt, double min, double max) {
    while (true) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        try {
            double v = Double.parseDouble(s);
            if (v &gt;= min &amp;&amp; v &lt;= max) return v;
        } catch (NumberFormatException e) {   // không phải số: rơi xuống thông báo
        }
        System.out.println("  ! enter a number from " + min + " to " + max);
    }
}</code></pre>
<p>Một lần chạy thật cố tình nhập sai (mã 5 chữ số, GPA 11, "abc", mã trùng, tên trống, chọn menu sai):</p>
<pre><code class="language-plaintext">1 / se19012 / se190123 / Nguyen Van An / 11 / abc / 8.5
1 / SE190123
1 / he190777 / se190777 / (dấu cách) / "  Tran Thi Binh " / 9
2 · 3 / se190123 · 4 / SE190777 / 9.25 · 2 · 9 · 5</code></pre>
<div class="out">1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id: &nbsp;&nbsp;! id must look like SE190123<br>
id: name: gpa: &nbsp;&nbsp;! enter a number from 0.0 to 10.0<br>
gpa: &nbsp;&nbsp;! enter a number from 0.0 to 10.0<br>
gpa: &nbsp;&nbsp;added SE190123<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id: &nbsp;&nbsp;! SE190123 already exists<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id: &nbsp;&nbsp;! id must look like SE190123<br>
id: name: &nbsp;&nbsp;! must not be empty<br>
name: gpa: &nbsp;&nbsp;added SE190777<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: &nbsp;&nbsp;SE190123 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;8.50<br>
&nbsp;&nbsp;SE190777 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.00<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id to find: &nbsp;&nbsp;SE190123 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;8.50<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: id to update: new gpa: &nbsp;&nbsp;SE190777 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.25<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: &nbsp;&nbsp;SE190123 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;8.50<br>
&nbsp;&nbsp;SE190777 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.25<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: &nbsp;&nbsp;! choose 1-5<br>
1.Add 2.List 3.Search 4.Update GPA 5.Exit<br>
choice: bye</div>
<p>Những thứ người chấm LAB211 tìm, đều có đủ: mã không có setter (<code>final</code>); <code>setGpa</code> từ chối giá trị ngoài khoảng kể cả khi code sau này quên kiểm; các hàm nhập lặp tới khi hợp lệ thay vì sập vì <code>parseDouble("abc")</code>; tìm kiếm dùng <code>equalsIgnoreCase</code>, không dùng <code>==</code>; đúng một <code>Scanner</code>. Các lời nhắc dính liền nhau trong output vì dữ liệu được đổ vào qua pipe — khi gõ tay, mỗi câu trả lời hiện sau lời nhắc của nó.</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211</strong>: tách file này theo kiểu LAB211 — <code>model/Student.java</code>, <code>controller/StudentManager.java</code> (danh sách và các thao tác), <code>view/Menu.java</code>, <code>utils/Inputter.java</code> (ba hàm đọc) — package ở Chương 3 cho phép làm điều đó.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>stack</strong></td><td>ngăn xếp (vùng nhớ stack)</td><td>The memory area holding one frame per method call: parameters and local variables, removed when the method returns.</td></tr>
<tr><td><strong>heap</strong></td><td>vùng nhớ động (heap)</td><td>The memory area where every object created with new and every array lives, until the garbage collector frees it.</td></tr>
<tr><td><strong>reference</strong></td><td>tham chiếu</td><td>The value held by a variable of a class type: it leads to an object, it is not the object.</td></tr>
<tr><td><strong>garbage collection</strong></td><td>thu gom rác</td><td>The JVM's automatic freeing of objects that can no longer be reached from any variable.</td></tr>
<tr><td><strong>eligible for GC</strong></td><td>đủ điều kiện thu gom</td><td>Unreachable; the memory is reclaimed only when a collection actually runs.</td></tr>
<tr><td><strong>scope</strong></td><td>phạm vi</td><td>The part of the code where a variable exists: from its declaration to the closing brace of its block.</td></tr>
<tr><td><strong>field</strong></td><td>trường (thuộc tính)</td><td>A variable declared in a class; each object has its own copy unless it is static.</td></tr>
<tr><td><strong>constructor</strong></td><td>hàm khởi tạo</td><td>Special member with the class's name and no return type, run by new to initialise a new object.</td></tr>
<tr><td><strong>default constructor</strong></td><td>constructor mặc định</td><td>The no-argument constructor the compiler adds only when a class declares no constructor at all.</td></tr>
<tr><td><strong>default value</strong></td><td>giá trị mặc định</td><td>What a field holds before any constructor runs: 0, 0.0, false or null. Local variables have none.</td></tr>
<tr><td><strong>this</strong></td><td>đối tượng hiện tại</td><td>A reference to the object whose method or constructor is running; this(...) calls another constructor.</td></tr>
<tr><td><strong>shadowing</strong></td><td>che tên</td><td>A parameter or local with the same name as a field hides the field inside that method; write this.field.</td></tr>
<tr><td><strong>method signature</strong></td><td>chữ ký phương thức</td><td>Name plus the order of parameter types; return type and parameter names are not part of it.</td></tr>
<tr><td><strong>overloading</strong></td><td>nạp chồng</td><td>Several methods or constructors with the same name but different parameter types in one class.</td></tr>
<tr><td><strong>getter / setter</strong></td><td>hàm lấy / hàm gán</td><td>Public methods that read / change a private field; a setter should reject invalid values.</td></tr>
<tr><td><strong>pass by value</strong></td><td>truyền theo giá trị</td><td>Java gives every method a copy of each argument; for an object the copy is of the reference.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>stack</strong></td><td>ngăn xếp (vùng nhớ stack)</td><td>Vùng nhớ chứa mỗi lời gọi phương thức một khung: tham số và biến cục bộ, bị gỡ khi phương thức trả về.</td></tr>
<tr><td><strong>heap</strong></td><td>vùng nhớ động (heap)</td><td>Vùng nhớ chứa mọi đối tượng tạo bằng new và mọi mảng, cho tới khi bộ thu gom rác giải phóng.</td></tr>
<tr><td><strong>reference</strong></td><td>tham chiếu</td><td>Giá trị mà một biến kiểu lớp giữ: nó dẫn tới một đối tượng, nó không phải đối tượng.</td></tr>
<tr><td><strong>garbage collection</strong></td><td>thu gom rác</td><td>Việc JVM tự động giải phóng các đối tượng không còn với tới được từ biến nào.</td></tr>
<tr><td><strong>eligible for GC</strong></td><td>đủ điều kiện thu gom</td><td>Không còn với tới được; bộ nhớ chỉ được thu hồi khi một lần thu gom thật sự chạy.</td></tr>
<tr><td><strong>scope</strong></td><td>phạm vi</td><td>Đoạn code mà biến tồn tại: từ dòng khai báo tới dấu ngoặc đóng của khối chứa nó.</td></tr>
<tr><td><strong>field</strong></td><td>trường (thuộc tính)</td><td>Biến khai báo trong lớp; mỗi đối tượng có bản riêng trừ khi nó là static.</td></tr>
<tr><td><strong>constructor</strong></td><td>hàm khởi tạo</td><td>Thành viên đặc biệt mang tên lớp, không có kiểu trả về, được new gọi để khởi tạo đối tượng mới.</td></tr>
<tr><td><strong>default constructor</strong></td><td>constructor mặc định</td><td>Constructor không tham số mà trình biên dịch chỉ thêm khi lớp không khai báo constructor nào.</td></tr>
<tr><td><strong>default value</strong></td><td>giá trị mặc định</td><td>Giá trị của trường trước khi constructor chạy: 0, 0.0, false hoặc null. Biến cục bộ thì không có.</td></tr>
<tr><td><strong>this</strong></td><td>đối tượng hiện tại</td><td>Tham chiếu tới đối tượng đang chạy phương thức hoặc constructor; this(...) gọi một constructor khác.</td></tr>
<tr><td><strong>shadowing</strong></td><td>che tên</td><td>Tham số hoặc biến cục bộ trùng tên trường sẽ che trường trong phương thức đó; phải viết this.field.</td></tr>
<tr><td><strong>method signature</strong></td><td>chữ ký phương thức</td><td>Tên cộng thứ tự kiểu tham số; kiểu trả về và tên tham số không thuộc chữ ký.</td></tr>
<tr><td><strong>overloading</strong></td><td>nạp chồng</td><td>Nhiều phương thức hoặc constructor cùng tên nhưng khác kiểu tham số trong một lớp.</td></tr>
<tr><td><strong>getter / setter</strong></td><td>hàm lấy / hàm gán</td><td>Phương thức public đọc / đổi một trường private; setter nên từ chối giá trị không hợp lệ.</td></tr>
<tr><td><strong>pass by value</strong></td><td>truyền theo giá trị</td><td>Java đưa cho mỗi phương thức bản sao của từng đối số; với đối tượng, bản sao là của tham chiếu.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 2</h2>
<ol>
<li><strong>Locals on the stack, objects on the heap.</strong> A variable of a class type holds a reference; copying it copies the arrow, not the object (<code>q = p</code> ⇒ one object, two names).</li>
<li><strong>Garbage = unreachable from every variable.</strong> It is freed when a collection runs — automatically, many times per second, mostly when a <code>new</code> does not fit. <code>System.gc()</code> is only a request.</li>
<li><strong><code>==</code> compares references, <code>equals</code> compares contents.</strong> Strings from input are new objects: always <code>equals</code>.</li>
<li><strong>Class from a statement:</strong> main noun → class, describing nouns → fields, verbs → methods, rules → checks in constructors and setters.</li>
<li><strong>Constructors:</strong> class name, no return type; the free no-argument one exists only if you write none; chain with <code>this(...)</code> as the first statement.</li>
<li><strong>Order of creation:</strong> default values (0/false/null) → field initializers → constructor body.</li>
<li><strong><code>this</code></strong> = the current object; <code>this.x = x</code> beats shadowing. A signature is name + parameter types.</li>
<li><strong>Java passes by value.</strong> A method can change the object a reference points to, never the caller's variable; there is no working <code>swap</code>.</li>
</ol>
<p>Then do the rewritten Chapter 2 quiz below.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 2</h2>
<ol>
<li><strong>Biến cục bộ trên stack, đối tượng trên heap.</strong> Biến kiểu lớp giữ một tham chiếu; chép biến là chép mũi tên, không chép đối tượng (<code>q = p</code> ⇒ một đối tượng, hai cái tên).</li>
<li><strong>Rác = không còn với tới được từ biến nào.</strong> Nó được giải phóng khi một lần thu gom chạy — tự động, nhiều lần mỗi giây, phần lớn khi một lệnh <code>new</code> không còn chỗ. <code>System.gc()</code> chỉ là lời xin.</li>
<li><strong><code>==</code> so tham chiếu, <code>equals</code> so nội dung.</strong> Chuỗi nhập vào là đối tượng mới: luôn dùng <code>equals</code>.</li>
<li><strong>Lớp từ đề bài:</strong> danh từ chính → lớp, danh từ mô tả → trường, động từ → phương thức, luật → phép kiểm trong constructor và setter.</li>
<li><strong>Constructor:</strong> tên lớp, không kiểu trả về; constructor không tham số miễn phí chỉ có khi bạn không viết cái nào; nối nhau bằng <code>this(...)</code> ở câu lệnh đầu tiên.</li>
<li><strong>Thứ tự tạo đối tượng:</strong> giá trị mặc định (0/false/null) → giá trị khởi đầu của trường → thân constructor.</li>
<li><strong><code>this</code></strong> = đối tượng hiện tại; <code>this.x = x</code> thắng chuyện che tên. Chữ ký = tên + kiểu tham số.</li>
<li><strong>Java truyền theo giá trị.</strong> Phương thức đổi được đối tượng mà tham chiếu trỏ tới, không bao giờ đổi được biến của bên gọi; không viết được <code>swap</code> nào chạy đúng.</li>
</ol>
<p>Sau đó làm quiz Chương 2 đã viết lại ở bên dưới.</p>`),
  ].join('\n'),
};

/* ───────── Lab 2 — 🏗️ CT Library: real Book and Member classes (constructors, this, ids, reference vs copy) ───────── */
const L_lab2 = {
  title: 'Lab 2 — 🏗️ CT Library: real Book and Member classes (constructors, this, ids, reference vs copy)|||Lab 2 — 🏗️ CT Library: lớp Book và Member thật (constructor, this, mã tự cấp, tham chiếu hay bản sao)',
  slug: 'pro192-lab-2-sach-va-thanh-vien',
  type: 'VIDEO',
  description: 'Lab 2 của dự án CT Library (sau Chương 2), chuẩn review LAB211: tự viết lớp Book (mã, ISBN, tên, tác giả, năm, số bản) và Member theo kiểu JavaBean với constructor và this(...), kho tự cấp mã B001/M001 bằng trường của đối tượng (không static), cập nhật số bản qua tham chiếu và bẫy sửa nhầm bản sao, thêm và liệt kê thành viên, năm phép kiểm mới có thông báo tiếng Việt rõ ràng. Starter 7 nhóm TODO, đáp án tải về, bộ chấm kiểu PE 113 dòng, đáp án qua lint.py + javac --release 8 + JDK 8 thật, sơ đồ stack/heap, bẫy b2 = b1 và quên this có output thật, rubric 10 điểm.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lab 2 · CT Library</span>
<h2>Lab 2 — real Book and Member classes</h2>
<p class="lead">In Lab 1 the classes were given and you wrote logic. Now the classes are yours: <code>Book</code> grows to six fields, <code>Member</code> arrives, the repository hands out ids, and one menu item — "update copies" — tests the single most important idea of Chapter 2: a variable holds a <strong>reference</strong>, and changing an object through a reference is seen by everyone who points to it, while changing a <strong>copy</strong> is seen by no one.</p>
<p>The starter is the Lab 1 solution plus the new skeleton: everything from Lab 1 works, every new method body is a <code>TODO Lab 2.x</code>. Plan about <strong>3–4 hours</strong>.</p>`,
    `<span class="eyebrow">Chương 2 · Lab 2 · CT Library</span>
<h2>Lab 2 — lớp Book và Member thật</h2>
<p class="lead">Ở Lab 1 lớp được cho sẵn, bạn viết phần xử lý. Giờ lớp là của bạn: <code>Book</code> lớn lên thành sáu trường, <code>Member</code> xuất hiện, kho (repository) tự cấp mã, và một mục menu — "cập nhật số bản" — kiểm đúng ý quan trọng nhất của Chương 2: biến giữ một <strong>tham chiếu</strong> (reference — "mũi tên" trỏ tới đối tượng); sửa đối tượng qua tham chiếu thì mọi biến trỏ tới nó đều thấy, còn sửa một <strong>bản sao</strong> thì chẳng ai thấy.</p>
<p>Starter là đáp án Lab 1 cộng bộ khung mới: mọi thứ của Lab 1 chạy được, mọi thân hàm mới là <code>TODO Lab 2.x</code>. Dành khoảng <strong>3–4 giờ</strong>.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 Lab 2 (15 slides)</h2>
<p>The deck of this lab, made for CT Library (it is not a school deck). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project, compiled with <code>javac --release 8</code> and run — the same runs you find in the steps below.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 Lab 2 (15 slide)</h2>
<p>Bộ slide của lab này, dựng riêng cho CT Library (không phải slide của trường). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ dự án thật, biên dịch bằng <code>javac --release 8</code> rồi chạy — đúng những lần chạy bạn gặp lại ở các bước bên dưới.</p>`),
    walk('lab2', [
      [1, 'Lab 2 — CT Library: real Book and Member classes',
        `<p class="y-chinh">🎯 Lab 2 practises Chapter 2 on a real program: classes, constructors and <code>this</code>, objects on the heap, references on the stack — and the question "did I change the object or a copy?".</p>
<p>Everything you add follows the same nine packages as Lab 1. The new parts: two model classes (<code>Book</code>, <code>Member</code>), a second controller/repository/service/view family for members, ids assigned by the repositories, and five new validations.</p>`,
        `<p class="y-chinh">🎯 Lab 2 luyện Chương 2 trên một chương trình thật: lớp, constructor và <code>this</code>, đối tượng trên heap, tham chiếu trên stack — và câu hỏi "mình sửa đối tượng hay sửa bản sao?".</p>
<p>Mọi thứ thêm vào đều theo đúng chín package của Lab 1. Phần mới: hai lớp model (<code>Book</code>, <code>Member</code>), một bộ controller/repository/service/view thứ hai cho thành viên, mã do repository cấp, và năm phép kiểm mới.</p>`],
      [2, 'Ticket CTL-2 — the librarian wants more than a title',
        `<p class="y-chinh">🎯 The ticket adds data (author, year, copies, members) and one behaviour that only works if you understand references: the updated count must appear in the list.</p>
<p>Done means: the grader prints PASS 113/113, <code>lint.py</code> is silent, <code>javac --release 8</code> compiles, <code>Book</code> and <code>Member</code> are JavaBeans you wrote yourself, ids come only from the repository, and "update copies" changes the book that lives in the list.</p>`,
        `<p class="y-chinh">🎯 Ticket thêm dữ liệu (tác giả, năm, số bản, thành viên) và một hành vi chỉ đúng khi bạn hiểu tham chiếu: số bản vừa sửa phải hiện ra trong danh sách.</p>
<p>Xong nghĩa là: bộ chấm in PASS 113/113, <code>lint.py</code> im lặng, <code>javac --release 8</code> biên dịch được, <code>Book</code> và <code>Member</code> là JavaBean do chính bạn viết, mã chỉ do repository cấp, và "cập nhật số bản" sửa đúng cuốn sách đang nằm trong danh sách.</p>`],
      [3, 'Six menu items now — and ids in the table',
        `<p class="y-chinh">🎯 Two new families of features: books get id, author, year and copies; members are added and listed — with the same layers as books.</p>
<p>Look at the table: <code>Id</code> is B001–B004 for the sample books, assigned in the order they were added, while the rows are sorted by title — so B002 comes first. The member side is a copy of the book side: <code>MemberController</code> → <code>MemberRepository</code> / <code>MemberService</code> / <code>MemberView</code>. Names are cleaned exactly like titles, by the same private helper.</p>`,
        `<p class="y-chinh">🎯 Hai nhóm chức năng mới: sách có mã, tác giả, năm và số bản; thành viên được thêm và liệt kê — đi đúng các tầng như sách.</p>
<p>Nhìn bảng: cột <code>Id</code> là B001–B004 cho bốn sách mẫu, cấp theo thứ tự thêm vào, còn các hàng được sắp theo tên — nên B002 đứng đầu. Phía thành viên là bản sao của phía sách: <code>MemberController</code> → <code>MemberRepository</code> / <code>MemberService</code> / <code>MemberView</code>. Họ tên được làm sạch đúng như tên sách, bằng cùng một hàm phụ private.</p>`],
      [4, 'A model is a JavaBean (reviewer rule V10)',
        `<p class="y-chinh">🎯 A model class is a JavaBean: private fields, a public constructor with no parameters, a getter and a setter for each field — plus, if useful, a constructor with every field.</p>
<p>The empty constructor does not repeat the assignments: <code>this("", "", "", "", 0, 0)</code> calls the full constructor, so the fields are set in exactly one place. Inside the full constructor <code>this.title = title</code> is needed because the parameter has the same name as the field and hides it: <code>this.title</code> is the field of the object being built, <code>title</code> alone is the parameter. Constructors are exempt from the "at most two parameters" rule — the reviewer's own sample <code>Doctor(code, name, specialization, availability)</code> has four.</p>`,
        `<p class="y-chinh">🎯 Lớp model là một JavaBean: trường private, một constructor public không tham số, mỗi trường một getter và một setter — cộng thêm, nếu cần, một constructor đủ mọi trường.</p>
<p>Constructor rỗng không chép lại các lệnh gán: <code>this("", "", "", "", 0, 0)</code> gọi constructor đầy đủ, nên trường chỉ được gán ở đúng một chỗ. Trong constructor đầy đủ phải viết <code>this.title = title</code> vì tham số trùng tên với trường và che mất nó: <code>this.title</code> là trường của đối tượng đang dựng, <code>title</code> đứng một mình là tham số. Constructor được miễn luật "tối đa hai tham số" — chính mẫu của thầy <code>Doctor(code, name, specialization, availability)</code> có bốn.</p>`],
      [5, 'Ids come from the repository, not from static',
        `<p class="y-chinh">🎯 The repository assigns ids with a counter that is a field of the repository object: <code>String.format("B%03d", nextBookNumber)</code>, then <code>nextBookNumber++</code>.</p>
<p><code>%03d</code> pads with zeros to three digits: 5 → <code>005</code>, so the fifth book is <code>B005</code>. The counter starts at <code>Constants.FIRST_ID_NUMBER</code> in the constructor. It is <em>not</em> <code>static</code>: the reviewer rejects static outside utils and constants, and Lab 3 shows the bug a static counter causes. The user never types an id when adding — only when choosing a book to update.</p>`,
        `<p class="y-chinh">🎯 Repository cấp mã bằng một bộ đếm là trường của chính đối tượng repository: <code>String.format("B%03d", nextBookNumber)</code>, rồi <code>nextBookNumber++</code>.</p>
<p><code>%03d</code> chèn số 0 cho đủ ba chữ số: 5 → <code>005</code>, nên cuốn thứ năm là <code>B005</code>. Bộ đếm bắt đầu bằng <code>Constants.FIRST_ID_NUMBER</code> trong constructor. Nó <em>không</em> phải <code>static</code>: thầy từ chối static ngoài utils và constants, và Lab 3 sẽ cho thấy lỗi mà bộ đếm static gây ra. Người dùng không bao giờ gõ mã khi thêm — chỉ gõ khi chọn sách để cập nhật.</p>`],
      [6, 'One question for the whole chapter: object or copy?',
        `<p class="y-chinh">🎯 Two arrows, one object: the local variable <code>book</code> and the list slot <code>bookList[1]</code> point to the same <code>Book</code>; the DTO <code>before</code> is a separate object — a copy.</p>
<p>Objects live on the heap; variables (on the stack, inside each method's frame) hold arrows. <code>findBookById</code> returns the arrow that is already in the list, so <code>book</code> points to the real book. <code>findById</code> builds a <strong>new</strong> <code>BookResponseDTO</code> and copies the fields into it — a separate object that only looks the same. Everything in this lab follows from this picture.</p>`,
        `<p class="y-chinh">🎯 Hai mũi tên, một đối tượng: biến cục bộ <code>book</code> và ô danh sách <code>bookList[1]</code> cùng trỏ tới một <code>Book</code>; DTO <code>before</code> là một đối tượng khác — một bản sao.</p>
<p>Đối tượng nằm trên heap; biến (trên stack, trong khung của từng phương thức) giữ mũi tên. <code>findBookById</code> trả về đúng mũi tên đang có trong danh sách, nên <code>book</code> trỏ vào cuốn sách thật. <code>findById</code> dựng một <code>BookResponseDTO</code> <strong>mới</strong> rồi chép các trường sang — một đối tượng riêng chỉ trông giống thôi. Cả lab này đều suy ra từ bức hình đó.</p>`],
      [7, '"4 — update copies" through the reference',
        `<p class="y-chinh">🎯 <code>BookRepository.updateCopies</code> finds the real <code>Book</code> and calls <code>setCopies</code> on it — the list sees the change because it holds an arrow to that same object.</p>
<p>The controller first takes a copy, <code>before</code>, to remember the old count for the message, then asks the repository to update. If the id does not exist, both <code>findById</code> and <code>updateCopies</code> throw an exception with the Vietnamese message, the controller catches it and the view prints it — one call to <code>display()</code> either way.</p>`,
        `<p class="y-chinh">🎯 <code>BookRepository.updateCopies</code> tìm đúng <code>Book</code> thật rồi gọi <code>setCopies</code> trên nó — danh sách thấy thay đổi vì nó giữ mũi tên tới chính đối tượng đó.</p>
<p>Controller lấy trước một bản sao <code>before</code> để nhớ số cũ cho câu thông báo, rồi mới nhờ repository sửa. Nếu mã không tồn tại, cả <code>findById</code> lẫn <code>updateCopies</code> đều ném ngoại lệ kèm câu tiếng Việt, controller bắt lại và view in ra — trường hợp nào cũng gọi <code>display()</code> đúng một lần.</p>`],
      [8, 'After setCopies(7): the list sees it, the copy does not',
        `<p class="y-chinh">🎯 After <code>book.setCopies(7)</code> the real book says 7 — the next listing shows 7 — while <code>before</code> still says 2, which is exactly why the message can print "2 -> 7".</p>
<p>When <code>updateCopies</code> returns, its frame disappears and the variable <code>book</code> with it; the Book object stays alive because the list still points to it. The copy <code>before</code> becomes garbage when the controller's method ends — nothing points to it any more (Chapter 2, 2.A).</p>`,
        `<p class="y-chinh">🎯 Sau <code>book.setCopies(7)</code> cuốn sách thật mang số 7 — lần liệt kê sau hiện 7 — còn <code>before</code> vẫn mang số 2, và nhờ thế câu thông báo in được "2 -> 7".</p>
<p>Khi <code>updateCopies</code> kết thúc, khung của nó biến mất cùng biến <code>book</code>; đối tượng Book vẫn sống vì danh sách còn trỏ tới. Bản sao <code>before</code> thành rác khi phương thức của controller kết thúc — không còn gì trỏ tới nó (Chương 2, bài 2.A).</p>`],
      [9, 'Trap: change a copy and nothing happens',
        `<p class="y-chinh">🎯 Calling <code>setCopies</code> on the DTO returned by <code>findById</code> changes a throw-away copy: the program happily prints "2 -> 7" and the list still shows 2.</p>
<p>This is the line your starter's TODO 2.4 begins with, on purpose. Run the starter once you have finished 2.1–2.3, choose 4 then 2, and see it for yourself before fixing it. It is a classic bug in real projects too: an update that "succeeds" without saving anything.</p>`,
        `<p class="y-chinh">🎯 Gọi <code>setCopies</code> trên DTO mà <code>findById</code> trả về là sửa một bản sao dùng một lần rồi bỏ: chương trình vẫn vui vẻ in "2 -> 7" mà danh sách vẫn ghi 2.</p>
<p>TODO 2.4 trong starter cố ý bắt đầu bằng chính dòng này. Làm xong 2.1–2.3, chạy starter, chọn 4 rồi 2, tự thấy tận mắt rồi mới sửa. Ở dự án thật đây cũng là lỗi kinh điển: một lần cập nhật "thành công" mà chẳng lưu gì.</p>`],
      [10, 'Trap: Book b2 = b1 does not copy the book',
        `<p class="y-chinh">🎯 Assignment between object variables copies the arrow, not the object: after <code>b2 = b1</code> there is still one Book, and <code>b1 == b2</code> is true.</p>
<p>A real copy needs <code>new</code>: <code>b3 = new Book(b1.getTitle(), b1.getCopies())</code> is a second object, and changing it leaves <code>b1</code> alone (<code>b1 == b3</code> is false). <code>toResponseDTO</code> does exactly this for every row the view prints, which is why the screen can never damage the library's data.</p>`,
        `<p class="y-chinh">🎯 Phép gán giữa hai biến đối tượng chép mũi tên, không chép đối tượng: sau <code>b2 = b1</code> vẫn chỉ có một Book, và <code>b1 == b2</code> là true.</p>
<p>Muốn bản sao thật phải có <code>new</code>: <code>b3 = new Book(b1.getTitle(), b1.getCopies())</code> là đối tượng thứ hai, sửa nó không đụng tới <code>b1</code> (<code>b1 == b3</code> là false). <code>toResponseDTO</code> làm đúng việc này cho mọi hàng view in ra, nên màn hình không bao giờ làm hỏng dữ liệu của thư viện.</p>`],
      [11, 'Your starter: Lab 1 done, Lab 2 bodies are TODO',
        `<p class="y-chinh">🎯 Seven TODO groups: constructors (2.1, 2.2), ids (2.3, 2.5), update through the reference (2.4), sorting members (2.6), five validations (2.7).</p>
<p>The first grader run fails at line 1 with a <code>NullPointerException</code> message: the constructors are empty, so every field of the sample books is <code>null</code> and <code>getIsbn().equals(...)</code> explodes. That is your first clue: do 2.1 first. Each TODO comment says which constant and which message to use.</p>`,
        `<p class="y-chinh">🎯 Bảy nhóm TODO: constructor (2.1, 2.2), cấp mã (2.3, 2.5), sửa qua tham chiếu (2.4), sắp thành viên (2.6), năm phép kiểm (2.7).</p>
<p>Lần chạy bộ chấm đầu tiên hỏng ngay dòng 1 với thông báo <code>NullPointerException</code>: constructor đang rỗng, nên mọi trường của sách mẫu là <code>null</code> và <code>getIsbn().equals(...)</code> nổ. Manh mối đầu tiên của bạn: làm 2.1 trước. Mỗi comment TODO đều ghi dùng hằng nào, câu thông báo nào.</p>`],
      [12, 'Every wrong input gets its own sentence',
        `<p class="y-chinh">🎯 Each field has its own rule and its own message that names the field and repeats what was typed — the LAB211 reviewer tests every message.</p>
<p>Year 1450–2100 and copies 0–99 share one message format through the private helper <code>parseInteger(input, fieldName)</code> and the range check; author and member name share <code>getPersonName(input, fieldName)</code>. Helpers with a <code>fieldName</code> parameter keep the messages consistent and the code short — and they are <code>private</code>, because no other class needs them.</p>`,
        `<p class="y-chinh">🎯 Mỗi ô nhập có luật riêng và câu báo riêng, nêu tên ô và nhắc lại chữ vừa gõ — thầy LAB211 thử từng câu một.</p>
<p>Năm 1450–2100 và số bản 0–99 dùng chung một khuôn câu qua hàm phụ private <code>parseInteger(input, fieldName)</code> và phép kiểm khoảng; tác giả và họ tên thành viên dùng chung <code>getPersonName(input, fieldName)</code>. Hàm phụ có tham số <code>fieldName</code> giữ câu báo đồng nhất và code ngắn — và chúng <code>private</code>, vì không lớp nào khác cần tới.</p>`],
      [13, 'One flow, five layers: "5 — add a member"',
        `<p class="y-chinh">🎯 Adding a member walks the same path as adding a book: Main validates and builds a DTO, the controller asks the repository to store it (and get an id), the view prints one sentence.</p>
<p><code>MemberController.addMember</code> is three lines of work: call <code>memberRepository.addMember(dto)</code> — which returns the new id — format the success message with the id, name and count, and hand it to the view. No service is needed for adding: services appear when there is real business work, like sorting.</p>`,
        `<p class="y-chinh">🎯 Thêm thành viên đi đúng con đường của thêm sách: Main kiểm và gom DTO, controller nhờ repository lưu (và cấp mã), view in đúng một câu.</p>
<p><code>MemberController.addMember</code> chỉ có ba việc: gọi <code>memberRepository.addMember(dto)</code> — hàm trả về mã mới — ghép câu thành công với mã, họ tên và số thành viên, rồi đưa cho view. Thêm thì không cần service: service xuất hiện khi có nghiệp vụ thật, như sắp xếp.</p>`],
      [14, 'Green: PASS 113/113',
        `<p class="y-chinh">🎯 113 lines match: every validation, both id sequences, the update through the reference, both sorted lists.</p>
<p>Then do what a reviewer will ask: draw the stack and the heap right after <code>book.setCopies(7)</code> on paper, without looking, and compare with slide 8. Run <code>lint.py</code>, commit, and you are ready for Lab 3.</p>`,
        `<p class="y-chinh">🎯 Khớp đủ 113 dòng: mọi phép kiểm, cả hai dãy mã, lần sửa qua tham chiếu, cả hai danh sách đã sắp.</p>
<p>Rồi làm điều thầy sẽ hỏi: vẽ ra giấy stack và heap ngay sau <code>book.setCopies(7)</code>, không nhìn, rồi so với slide 8. Chạy <code>lint.py</code>, commit, là sẵn sàng cho Lab 3.</p>`],
      [15, 'Rubric — 10 points, PE style',
        `<p class="y-chinh">🎯 Two points each for the JavaBeans, the ids and the update through the reference — the three ideas of Chapter 2; the rest for members, validations and standards.</p>
<p>The self-check questions are the kind of thing a reviewer asks while pointing at your code. Answer them aloud before opening the answers at the end of the page.</p>`,
        `<p class="y-chinh">🎯 Mỗi phần hai điểm cho JavaBean, cấp mã và sửa qua tham chiếu — ba ý của Chương 2; phần còn lại cho thành viên, phép kiểm và chuẩn code.</p>
<p>Các câu tự kiểm đúng kiểu thầy vừa chỉ vào code vừa hỏi. Trả lời thành tiếng trước khi mở đáp án cuối trang.</p>`],
    ]),
    bi(`<h2>1. The ticket</h2>
<div class="callout"><p><strong>CTL-2 · CT Library · priority: high.</strong> "A title and an ISBN are not enough. For each book we need the author, the year it was published and how many copies the club owns. Members must be registered too (name, email). Nobody should type ids: the program gives B001, B002… to books and M001… to members. When a copy is lost, the librarian updates the count — and the list must show the new number." — the team lead</p></div>
<table>
<thead><tr><th>You need</th><th>From</th></tr></thead>
<tbody>
<tr><td>classes, objects, <code>new</code>, fields, methods</td><td>2.B (pro8 slides 1–8)</td></tr>
<tr><td>constructors: default, with parameters, the compiler's default constructor</td><td>2.B–2.C (pro8 slides 9–10, 17–25)</td></tr>
<tr><td><code>this</code> and <code>this(...)</code>, getters and setters</td><td>2.B (pro8 slides 11–15)</td></tr>
<tr><td>pass by value: a reference is copied, the object is shared</td><td>2.C (pro8 slide 16)</td></tr>
<tr><td>stack, heap, garbage</td><td>2.A (pro7)</td></tr>
</tbody>
</table>`,
    `<h2>1. Ticket</h2>
<div class="callout"><p><strong>CTL-2 · CT Library · ưu tiên: cao.</strong> "Tên và ISBN là chưa đủ. Mỗi cuốn cần tác giả, năm xuất bản và câu lạc bộ có bao nhiêu bản. Thành viên cũng phải được đăng ký (họ tên, email). Không ai phải gõ mã: chương trình tự cấp B001, B002… cho sách và M001… cho thành viên. Khi mất một bản, thủ thư cập nhật lại số bản — và danh sách phải hiện số mới." — trưởng nhóm</p></div>
<table>
<thead><tr><th>Bạn cần</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>lớp, đối tượng, <code>new</code>, trường, phương thức</td><td>2.B (pro8 slide 1–8)</td></tr>
<tr><td>constructor: mặc định, có tham số, constructor mặc định do trình biên dịch chèn</td><td>2.B–2.C (pro8 slide 9–10, 17–25)</td></tr>
<tr><td><code>this</code> và <code>this(...)</code>, getter và setter</td><td>2.B (pro8 slide 11–15)</td></tr>
<tr><td>truyền tham trị: tham chiếu được chép, đối tượng dùng chung</td><td>2.C (pro8 slide 16)</td></tr>
<tr><td>stack, heap, rác</td><td>2.A (pro7)</td></tr>
</tbody>
</table>`),
    bi(`<h2>2. Requirements and acceptance criteria</h2>
<ol>
<li><strong>Book</strong> (model, JavaBean): <code>id, isbn, title, author, year, copies</code> — private fields, empty public constructor (via <code>this(...)</code>), full constructor, getters/setters. <strong>Member</strong>: <code>id, name, email</code>, same rules.</li>
<li><strong>Ids</strong>: <code>BookRepository</code> gives B001, B002… and <code>MemberRepository</code> M001, M002… from a counter that is a field of the repository object (not <code>static</code>); the sample data takes B001–B004 and M001–M002.</li>
<li><strong>Add book</strong>: title and ISBN as in Lab 1, plus author (letters and spaces, Title Case), year (integer 1450–2100), copies (integer 0–99). Success message with the new id and the number of books.</li>
<li><strong>Update copies</strong> (menu 4): id typed as <code>B</code> + 3 digits (lower case accepted), new copies 0–99; unknown id → message; success message "old -&gt; new"; the change is visible in the next listing.</li>
<li><strong>Members</strong> (menus 5, 6): add with a name (letters and spaces, Title Case) and an email (<code>name@domain.ext</code>, stored in lower case); list sorted by name, ties by id, numbered after sorting.</li>
<li><strong>Every wrong value</strong> gets its own message naming the field and what was typed; the program asks again and never crashes.</li>
<li><strong>Standards</strong> as in Lab 1 (nine packages, controller holds repositories, services hold none, controllers never import <code>model</code>, Message/Constants, comments, ≤ 2 parameters, ≤ 100 characters, Java 8).</li>
</ol>
<div class="callout ok"><p><strong>Done means:</strong> <code>check.sh</code> prints <code>PASS: 113/113 dong khop expected.txt</code> · <code>lint.py</code> prints <code>✓ … — sạch</code> · <code>javac --release 8</code> compiles · your stack/heap drawing after <code>setCopies(7)</code> matches slide 8 · one more Git commit.</p></div>`,
    `<h2>2. Yêu cầu và tiêu chí đạt</h2>
<ol>
<li><strong>Book</strong> (model, JavaBean): <code>id, isbn, title, author, year, copies</code> — trường private, constructor rỗng public (qua <code>this(...)</code>), constructor đầy đủ, getter/setter. <strong>Member</strong>: <code>id, name, email</code>, cùng luật.</li>
<li><strong>Mã</strong>: <code>BookRepository</code> cấp B001, B002… và <code>MemberRepository</code> cấp M001, M002… từ một bộ đếm là trường của đối tượng repository (không <code>static</code>); dữ liệu mẫu chiếm B001–B004 và M001–M002.</li>
<li><strong>Thêm sách</strong>: tên và ISBN như Lab 1, thêm tác giả (chữ cái và dấu cách, Title Case), năm (số nguyên 1450–2100), số bản (số nguyên 0–99). Câu thành công kèm mã mới và số đầu sách.</li>
<li><strong>Cập nhật số bản</strong> (menu 4): gõ mã dạng <code>B</code> + 3 chữ số (nhận cả chữ thường), số bản mới 0–99; mã không có → thông báo; câu thành công "cũ -&gt; mới"; lần liệt kê sau thấy ngay số mới.</li>
<li><strong>Thành viên</strong> (menu 5, 6): thêm với họ tên (chữ cái và dấu cách, Title Case) và email (<code>ten@ten-mien.duoi</code>, lưu chữ thường); liệt kê theo họ tên, trùng thì theo mã, đánh số sau khi sắp.</li>
<li><strong>Mọi giá trị sai</strong> đều có câu báo riêng nêu tên ô và chữ đã gõ; chương trình hỏi lại và không bao giờ sập.</li>
<li><strong>Chuẩn code</strong> như Lab 1 (chín package, controller giữ repository, service không giữ, controller không import <code>model</code>, Message/Constants, comment, ≤ 2 tham số, ≤ 100 ký tự, Java 8).</li>
</ol>
<div class="callout ok"><p><strong>Xong nghĩa là:</strong> <code>check.sh</code> in <code>PASS: 113/113 dong khop expected.txt</code> · <code>lint.py</code> in <code>✓ … — sạch</code> · <code>javac --release 8</code> biên dịch được · hình vẽ stack/heap sau <code>setCopies(7)</code> của bạn khớp slide 8 · thêm một commit Git.</p></div>`),
    bi(`<h2>3. Files</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab2-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab2-starter.zip</span><span class="lc-sub">Lab 1 solution + the Lab 2 skeleton · 7 TODO groups · harness (113 lines) · CheckHarness · check.sh / check.bat</span></span>
<span class="lc-cta">Download</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab2-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab2-solution.zip</span><span class="lc-sub">the full solution — open it only after your own attempt</span></span>
<span class="lc-cta">Download</span>
</a>
<p>The starter is a fresh project: it does not depend on what you wrote in Lab 1. If you prefer to continue your own Lab 1 project, copy the new files from the starter (<code>model/Member.java</code>, the <code>Member*</code> classes in <code>dto</code>, <code>repository</code>, <code>service</code>, <code>controller</code>, <code>view</code>) and replace <code>Main</code>, <code>Message</code>, <code>Constants</code> and <code>harness/</code>.</p>
<pre><code class="language-plaintext">CTLibrary-Lab2/src/
  model/       Book.java (6 fields)  TODO 2.1 · Member.java  TODO 2.2
  repository/  BookRepository.java   TODO 2.3, 2.4 · MemberRepository.java  TODO 2.5
  service/     BookService.java (Lab 1) · MemberService.java  TODO 2.6
  utils/       Validation.java       TODO 2.7 (getYear, getCopies, getBookId, getEmail, getPersonName)
  controller/  BookController.java · MemberController.java   (given)
  view/        BookView.java · MemberView.java               (given)
  dto/         BookRequestDTO, BookResponseDTO, MemberRequestDTO, MemberResponseDTO (given)
  constants/   Message.java · Constants.java                 (given)
  main/        Main.java (6 menu items)                      (given)</code></pre>`,
    `<h2>3. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab2-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab2-starter.zip</span><span class="lc-sub">đáp án Lab 1 + khung Lab 2 · 7 nhóm TODO · harness (113 dòng) · CheckHarness · check.sh / check.bat</span></span>
<span class="lc-cta">Tải về</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab2-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab2-solution.zip</span><span class="lc-sub">đáp án đầy đủ — chỉ mở sau khi đã tự làm</span></span>
<span class="lc-cta">Tải về</span>
</a>
<p>Starter là một dự án sạch: không phụ thuộc thứ bạn đã viết ở Lab 1. Nếu muốn làm tiếp trên dự án Lab 1 của mình, chép các tệp mới từ starter (<code>model/Member.java</code>, các lớp <code>Member*</code> trong <code>dto</code>, <code>repository</code>, <code>service</code>, <code>controller</code>, <code>view</code>) và thay <code>Main</code>, <code>Message</code>, <code>Constants</code>, <code>harness/</code>.</p>
<pre><code class="language-plaintext">CTLibrary-Lab2/src/
  model/       Book.java (6 trường)  TODO 2.1 · Member.java  TODO 2.2
  repository/  BookRepository.java   TODO 2.3, 2.4 · MemberRepository.java  TODO 2.5
  service/     BookService.java (Lab 1) · MemberService.java  TODO 2.6
  utils/       Validation.java       TODO 2.7 (getYear, getCopies, getBookId, getEmail, getPersonName)
  controller/  BookController.java · MemberController.java   (cho sẵn)
  view/        BookView.java · MemberView.java               (cho sẵn)
  dto/         BookRequestDTO, BookResponseDTO, MemberRequestDTO, MemberResponseDTO (cho sẵn)
  constants/   Message.java · Constants.java                 (cho sẵn)
  main/        Main.java (6 mục menu)                        (cho sẵn)</code></pre>`),
    bi(`<h2>4. Step by step</h2>
<h4>Step 0 — run the starter, read the first failure (10 min)</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 1:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: ========== CT LIBRARY ==========<br>
&nbsp;&nbsp;ban in : Cannot invoke "String.equals(Object)" because the return value of "model.Book.getIsbn()" is null<br>
…</div>
<p>"<code>getIsbn()</code> is null" while loading the sample books: <code>new Book(…)</code> runs an empty constructor, so no field is set. The program does not crash — the controller catches the error and prints it — but nothing after it can be right.</p>

<h4>Step 1 — TODO 2.1 and 2.2: the constructors (20 min)</h4>
<p>In <code>Book</code>: the empty constructor calls the full one with <code>this("", "", "", "", 0, 0)</code>; the full one assigns six fields with <code>this.x = x</code>. Same for <code>Member</code> with three fields.</p>
<details><summary>Solution — Book</summary>
<pre class="trich"><code class="language-java">// Constructor rong (JavaBean): goi constructor day du voi chuoi rong va so 0
public Book() {
    this("", "", "", "", 0, 0);
}</code></pre>
</details>
<p>(The <code>@Book</code> view above shows the empty constructor; the full one follows it in the file:)</p>
<details><summary>Solution — the full constructors</summary>
<pre><code class="language-java">public Book(String id, String isbn, String title, String author, int year, int copies) {
    this.id = id;
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = year;
    this.copies = copies;
}

public Member(String id, String name, String email) {
    this.id = id;
    this.name = name;
    this.email = email;
}</code></pre>
</details>

<h4>Step 2 — TODO 2.3: ids for books (10 min)</h4>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Them 1 sach tu phieu nhap, tra ve ma vua cap; ISBN da co thi nem loi
public String addBook(BookRequestDTO bookRequestDTO) throws Exception {
    // Sach dang giu ISBN nay (null neu chua co) va ma se cap
    Book existingBook = findByIsbn(bookRequestDTO.getIsbn());
    String newId = "";

    // Trung ISBN thi bao ro sach nao dang giu ISBN do
    if (existingBook != null) {
        throw new Exception(String.format(Message.ERROR_DUPLICATE_ISBN,
                existingBook.getIsbn(), existingBook.getId(), existingBook.getTitle()));
    }

    // Cap ma moi roi tang so thu tu cho lan sau
    newId = String.format(Constants.BOOK_ID_FORMAT, nextBookNumber);
    nextBookNumber++;

    // new Book(...) tao 1 doi tuong moi tren heap; danh sach giu tham chieu toi no
    bookList.add(new Book(newId, bookRequestDTO.getIsbn(), bookRequestDTO.getTitle(),
            bookRequestDTO.getAuthor(), bookRequestDTO.getYear(), bookRequestDTO.getCopies()));
    return newId;
}</code></pre>
</details>

<h4>Step 3 — TODO 2.4: update through the reference (20 min)</h4>
<p>First run the starter as it is: choose 4, type <code>b002</code> and <code>7</code>, then choose 2. The message says "2 -&gt; 7" — and the table still says 2. Explain to yourself <em>why</em> using slides 6–9 before you change the line.</p>
<details><summary>Hint</summary><p>The private helper <code>findBookById</code> (given) returns the <code>Book</code> that is in the list. Call <code>setCopies</code> on <em>that</em>.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Sua so ban cua sach mang ma trong phieu; khong co ma thi nem loi
public void updateCopies(BookRequestDTO bookRequestDTO) throws Exception {
    // book va phan tu trong bookList cung tro toi MOT doi tuong Book
    Book book = findBookById(bookRequestDTO.getId());

    // Khong co ma thi bao loi
    if (book == null) {
        throw new Exception(String.format(Message.ERROR_BOOK_NOT_FOUND,
                bookRequestDTO.getId()));
    }

    // Sua qua tham chieu: doi tuong trong danh sach doi theo
    book.setCopies(bookRequestDTO.getCopies());
}</code></pre>
</details>
<p><strong>Draw it.</strong> On paper: the stack frames of <code>BookController.updateCopies</code> and <code>BookRepository.updateCopies</code>, the heap with <code>bookList</code>, the Book B002 and the DTO <code>before</code>, every arrow — right after <code>book.setCopies(7)</code>.</p>
<details><summary>Answer</summary>
<pre><code class="language-plaintext">STACK                                   HEAP
BookController.updateCopies             bookList : ArrayList&lt;Book&gt;
  before  ──────────────┐                 [0] → Book B001   [1] ──┐   [2] → B003   [3] → B004
BookRepository.updateCopies              │                         ▼
  book    ───────────────┼──────────────────────────────►  Book B002  copies = 7
                         └──────────────►  BookResponseDTO (a copy)  copies = 2</code></pre>
<p>Two arrows reach Book B002 (<code>book</code> and <code>bookList[1]</code>); one reaches the copy. When the repository method returns, <code>book</code> disappears but the Book lives on through the list.</p>
</details>

<h4>Step 4 — TODO 2.5 and 2.6: members (25 min)</h4>
<details><summary>Solution — MemberRepository.addMember</summary>
<pre class="trich"><code class="language-java">// Them 1 thanh vien tu phieu nhap, tra ve ma vua cap
public String addMember(MemberRequestDTO memberRequestDTO) {
    // Ma se cap cho thanh vien moi
    String newId = String.format(Constants.MEMBER_ID_FORMAT, nextMemberNumber);

    // Tang so thu tu cho lan sau roi them thanh vien moi
    nextMemberNumber++;
    memberList.add(new Member(newId, memberRequestDTO.getName(), memberRequestDTO.getEmail()));
    return newId;
}</code></pre>
</details>
<details><summary>Solution — MemberService.sortByName</summary>
<pre class="trich"><code class="language-java">// Sap theo ho ten (A-Z, khong phan biet hoa thuong), trung ten thi theo ma; danh so tu 1
public ArrayList&lt;MemberResponseDTO&gt; sortByName(ArrayList&lt;MemberResponseDTO&gt; memberList) {
    // Ban sao de khong lam doi thu tu cua danh sach goc
    ArrayList&lt;MemberResponseDTO&gt; sortedList = new ArrayList&lt;&gt;(memberList);

    // Luat so: ho ten truoc, trung ho ten thi ma
    Collections.sort(sortedList, new Comparator&lt;MemberResponseDTO&gt;() {
        // So ho ten, trung thi so ma
        @Override
        public int compare(MemberResponseDTO first, MemberResponseDTO second) {
            // Ket qua so ho ten (0 = trung ten)
            int byName = first.getName().compareToIgnoreCase(second.getName());

            // Trung ho ten thi ma quyet dinh thu tu
            if (byName == 0) {
                return first.getId().compareTo(second.getId());
            }

            return byName;
        }
    });

    // Danh so thu tu sau khi sap xep
    for (int i = 0; i &lt; sortedList.size(); i++) {
        sortedList.get(i).setNo(i + 1);
    }

    return sortedList;
}</code></pre>
</details>

<h4>Step 5 — TODO 2.7: five validations (40 min)</h4>
<p>Each one turns the typed text into a clean value or throws with a message from <code>Message</code>. Use the private helpers: <code>parseInteger</code> and <code>toTitleCase</code> are given.</p>
<details><summary>Solution — getYear and getCopies</summary>
<pre class="trich"><code class="language-java">// Doi chu thanh nam xuat ban va kiem trong [YEAR_MIN, YEAR_MAX]
public static int getYear(String input) throws Exception {
    // Nam sau khi doi
    int year = parseInteger(input, Message.FIELD_YEAR);

    // Ngoai khoang thi bao khoang dung va so da nhap
    if ((year &lt; Constants.YEAR_MIN) || (year &gt; Constants.YEAR_MAX)) {
        throw new Exception(String.format(Message.ERROR_NUMBER_RANGE, Message.FIELD_YEAR,
                Constants.YEAR_MIN, Constants.YEAR_MAX, year));
    }

    return year;
}</code></pre>
<pre class="trich"><code class="language-java">// Doi chu thanh so ban va kiem trong [COPIES_MIN, COPIES_MAX]
public static int getCopies(String input) throws Exception {
    // So ban sau khi doi
    int copies = parseInteger(input, Message.FIELD_COPIES);

    // Ngoai khoang thi bao khoang dung va so da nhap
    if ((copies &lt; Constants.COPIES_MIN) || (copies &gt; Constants.COPIES_MAX)) {
        throw new Exception(String.format(Message.ERROR_NUMBER_RANGE, Message.FIELD_COPIES,
                Constants.COPIES_MIN, Constants.COPIES_MAX, copies));
    }

    return copies;
}</code></pre>
</details>
<details><summary>Solution — getBookId, getEmail, getPersonName</summary>
<pre class="trich"><code class="language-java">// Kiem ma sach: B + 3 chu so, nhan ca chu thuong (b002 -&gt; B002)
public static String getBookId(String input) throws Exception {
    // Ma da bo dau cach 2 dau va viet hoa
    String bookId = input.trim().toUpperCase();

    // Sai dang thi bao lai dung chu nguoi dung go
    if (!bookId.matches(Constants.REGEX_BOOK_ID)) {
        throw new Exception(String.format(Message.ERROR_BOOK_ID_FORMAT, input.trim()));
    }

    return bookId;
}</code></pre>
<pre class="trich"><code class="language-java">// Kiem email co ban: co phan truoc @, co ten mien co dau cham sau @
public static String getEmail(String input) throws Exception {
    // Email bo dau cach 2 dau, viet thuong
    String email = input.trim().toLowerCase();

    // Sai dang thi bao lai dung chu nguoi dung go
    if (!email.matches(Constants.REGEX_EMAIL)) {
        throw new Exception(String.format(Message.ERROR_EMAIL, input.trim()));
    }

    return email;
}</code></pre>
<pre class="trich"><code class="language-java">// Kiem ten nguoi (chi chu cai khong dau + dau cach) roi chuan hoa Title Case
private static String getPersonName(String input, String fieldName) throws Exception {
    // Ten da chuan hoa
    String name = toTitleCase(input);

    // Rong hoac co ky tu khac chu cai / dau cach thi bao loi kem ten o nhap
    if (!name.matches(Constants.REGEX_PERSON_NAME)) {
        throw new Exception(String.format(Message.ERROR_PERSON_NAME, fieldName));
    }

    return name;
}</code></pre>
</details>
<p>The messages the grader expects for the add-book session (real output):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ten sach: ISBN-13: Tac gia: Tac gia chi gom chu cai khong dau va dau cach (vi du: Nguyen Van An), khong de trong, khong co chu so. Moi nhap lai.<br>
Tac gia: Nam xuat ban: Nam xuat ban phai la 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Nam xuat ban: Nam xuat ban phai tu 1450 den 2100, ban nhap 1200. Moi nhap lai.<br>
Nam xuat ban: So ban: So ban phai tu 0 den 99, ban nhap -1. Moi nhap lai.<br>
So ban: Da them sach B005 "Clean Code". Thu vien co 5 dau sach.<br>
…</div>

<h4>Step 6 — grade, lint, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 113/113 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab2-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab2-Solution — sạch</div>`,
    `<h2>4. Làm từng bước</h2>
<h4>Bước 0 — chạy starter, đọc lỗi đầu tiên (10 phút)</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 1:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: ========== CT LIBRARY ==========<br>
&nbsp;&nbsp;ban in : Cannot invoke "String.equals(Object)" because the return value of "model.Book.getIsbn()" is null<br>
…</div>
<p>"<code>getIsbn()</code> là null" ngay lúc nạp sách mẫu: <code>new Book(…)</code> chạy một constructor rỗng, nên không trường nào được gán. Chương trình không sập — controller bắt lỗi và in ra — nhưng mọi thứ sau đó không thể đúng.</p>

<h4>Bước 1 — TODO 2.1 và 2.2: constructor (20 phút)</h4>
<p>Trong <code>Book</code>: constructor rỗng gọi constructor đầy đủ bằng <code>this("", "", "", "", 0, 0)</code>; constructor đầy đủ gán sáu trường bằng <code>this.x = x</code>. Tương tự <code>Member</code> với ba trường.</p>
<details><summary>Lời giải — Book</summary>
<pre class="trich"><code class="language-java">// Constructor rong (JavaBean): goi constructor day du voi chuoi rong va so 0
public Book() {
    this("", "", "", "", 0, 0);
}</code></pre>
</details>
<p>(Đoạn <code>@Book</code> ở trên là constructor rỗng; constructor đầy đủ nằm ngay sau trong tệp:)</p>
<details><summary>Lời giải — các constructor đầy đủ</summary>
<pre><code class="language-java">public Book(String id, String isbn, String title, String author, int year, int copies) {
    this.id = id;
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = year;
    this.copies = copies;
}

public Member(String id, String name, String email) {
    this.id = id;
    this.name = name;
    this.email = email;
}</code></pre>
</details>

<h4>Bước 2 — TODO 2.3: cấp mã sách (10 phút)</h4>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Them 1 sach tu phieu nhap, tra ve ma vua cap; ISBN da co thi nem loi
public String addBook(BookRequestDTO bookRequestDTO) throws Exception {
    // Sach dang giu ISBN nay (null neu chua co) va ma se cap
    Book existingBook = findByIsbn(bookRequestDTO.getIsbn());
    String newId = "";

    // Trung ISBN thi bao ro sach nao dang giu ISBN do
    if (existingBook != null) {
        throw new Exception(String.format(Message.ERROR_DUPLICATE_ISBN,
                existingBook.getIsbn(), existingBook.getId(), existingBook.getTitle()));
    }

    // Cap ma moi roi tang so thu tu cho lan sau
    newId = String.format(Constants.BOOK_ID_FORMAT, nextBookNumber);
    nextBookNumber++;

    // new Book(...) tao 1 doi tuong moi tren heap; danh sach giu tham chieu toi no
    bookList.add(new Book(newId, bookRequestDTO.getIsbn(), bookRequestDTO.getTitle(),
            bookRequestDTO.getAuthor(), bookRequestDTO.getYear(), bookRequestDTO.getCopies()));
    return newId;
}</code></pre>
</details>

<h4>Bước 3 — TODO 2.4: sửa qua tham chiếu (20 phút)</h4>
<p>Chạy starter nguyên trạng trước: chọn 4, gõ <code>b002</code> và <code>7</code>, rồi chọn 2. Câu báo ghi "2 -&gt; 7" — còn bảng vẫn ghi 2. Tự giải thích <em>tại sao</em> bằng slide 6–9 trước khi sửa dòng đó.</p>
<details><summary>Gợi ý</summary><p>Hàm phụ private <code>findBookById</code> (cho sẵn) trả về chính <code>Book</code> nằm trong danh sách. Gọi <code>setCopies</code> trên <em>nó</em>.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Sua so ban cua sach mang ma trong phieu; khong co ma thi nem loi
public void updateCopies(BookRequestDTO bookRequestDTO) throws Exception {
    // book va phan tu trong bookList cung tro toi MOT doi tuong Book
    Book book = findBookById(bookRequestDTO.getId());

    // Khong co ma thi bao loi
    if (book == null) {
        throw new Exception(String.format(Message.ERROR_BOOK_NOT_FOUND,
                bookRequestDTO.getId()));
    }

    // Sua qua tham chieu: doi tuong trong danh sach doi theo
    book.setCopies(bookRequestDTO.getCopies());
}</code></pre>
</details>
<p><strong>Vẽ ra.</strong> Trên giấy: khung stack của <code>BookController.updateCopies</code> và <code>BookRepository.updateCopies</code>, heap có <code>bookList</code>, Book B002 và DTO <code>before</code>, đủ mọi mũi tên — ngay sau <code>book.setCopies(7)</code>.</p>
<details><summary>Đáp án</summary>
<pre><code class="language-plaintext">STACK                                   HEAP
BookController.updateCopies             bookList : ArrayList&lt;Book&gt;
  before  ──────────────┐                 [0] → Book B001   [1] ──┐   [2] → B003   [3] → B004
BookRepository.updateCopies              │                         ▼
  book    ───────────────┼──────────────────────────────►  Book B002  copies = 7
                         └──────────────►  BookResponseDTO (bản sao)  copies = 2</code></pre>
<p>Hai mũi tên tới Book B002 (<code>book</code> và <code>bookList[1]</code>); một mũi tên tới bản sao. Khi phương thức của repository kết thúc, <code>book</code> biến mất nhưng Book vẫn sống nhờ danh sách.</p>
</details>

<h4>Bước 4 — TODO 2.5 và 2.6: thành viên (25 phút)</h4>
<details><summary>Lời giải — MemberRepository.addMember</summary>
<pre class="trich"><code class="language-java">// Them 1 thanh vien tu phieu nhap, tra ve ma vua cap
public String addMember(MemberRequestDTO memberRequestDTO) {
    // Ma se cap cho thanh vien moi
    String newId = String.format(Constants.MEMBER_ID_FORMAT, nextMemberNumber);

    // Tang so thu tu cho lan sau roi them thanh vien moi
    nextMemberNumber++;
    memberList.add(new Member(newId, memberRequestDTO.getName(), memberRequestDTO.getEmail()));
    return newId;
}</code></pre>
</details>
<details><summary>Lời giải — MemberService.sortByName</summary>
<pre class="trich"><code class="language-java">// Sap theo ho ten (A-Z, khong phan biet hoa thuong), trung ten thi theo ma; danh so tu 1
public ArrayList&lt;MemberResponseDTO&gt; sortByName(ArrayList&lt;MemberResponseDTO&gt; memberList) {
    // Ban sao de khong lam doi thu tu cua danh sach goc
    ArrayList&lt;MemberResponseDTO&gt; sortedList = new ArrayList&lt;&gt;(memberList);

    // Luat so: ho ten truoc, trung ho ten thi ma
    Collections.sort(sortedList, new Comparator&lt;MemberResponseDTO&gt;() {
        // So ho ten, trung thi so ma
        @Override
        public int compare(MemberResponseDTO first, MemberResponseDTO second) {
            // Ket qua so ho ten (0 = trung ten)
            int byName = first.getName().compareToIgnoreCase(second.getName());

            // Trung ho ten thi ma quyet dinh thu tu
            if (byName == 0) {
                return first.getId().compareTo(second.getId());
            }

            return byName;
        }
    });

    // Danh so thu tu sau khi sap xep
    for (int i = 0; i &lt; sortedList.size(); i++) {
        sortedList.get(i).setNo(i + 1);
    }

    return sortedList;
}</code></pre>
</details>

<h4>Bước 5 — TODO 2.7: năm phép kiểm (40 phút)</h4>
<p>Mỗi hàm biến chữ đã gõ thành giá trị sạch, hoặc ném lỗi kèm câu trong <code>Message</code>. Dùng các hàm phụ private: <code>parseInteger</code> và <code>toTitleCase</code> đã cho sẵn.</p>
<details><summary>Lời giải — getYear và getCopies</summary>
<pre class="trich"><code class="language-java">// Doi chu thanh nam xuat ban va kiem trong [YEAR_MIN, YEAR_MAX]
public static int getYear(String input) throws Exception {
    // Nam sau khi doi
    int year = parseInteger(input, Message.FIELD_YEAR);

    // Ngoai khoang thi bao khoang dung va so da nhap
    if ((year &lt; Constants.YEAR_MIN) || (year &gt; Constants.YEAR_MAX)) {
        throw new Exception(String.format(Message.ERROR_NUMBER_RANGE, Message.FIELD_YEAR,
                Constants.YEAR_MIN, Constants.YEAR_MAX, year));
    }

    return year;
}</code></pre>
<pre class="trich"><code class="language-java">// Doi chu thanh so ban va kiem trong [COPIES_MIN, COPIES_MAX]
public static int getCopies(String input) throws Exception {
    // So ban sau khi doi
    int copies = parseInteger(input, Message.FIELD_COPIES);

    // Ngoai khoang thi bao khoang dung va so da nhap
    if ((copies &lt; Constants.COPIES_MIN) || (copies &gt; Constants.COPIES_MAX)) {
        throw new Exception(String.format(Message.ERROR_NUMBER_RANGE, Message.FIELD_COPIES,
                Constants.COPIES_MIN, Constants.COPIES_MAX, copies));
    }

    return copies;
}</code></pre>
</details>
<details><summary>Lời giải — getBookId, getEmail, getPersonName</summary>
<pre class="trich"><code class="language-java">// Kiem ma sach: B + 3 chu so, nhan ca chu thuong (b002 -&gt; B002)
public static String getBookId(String input) throws Exception {
    // Ma da bo dau cach 2 dau va viet hoa
    String bookId = input.trim().toUpperCase();

    // Sai dang thi bao lai dung chu nguoi dung go
    if (!bookId.matches(Constants.REGEX_BOOK_ID)) {
        throw new Exception(String.format(Message.ERROR_BOOK_ID_FORMAT, input.trim()));
    }

    return bookId;
}</code></pre>
<pre class="trich"><code class="language-java">// Kiem email co ban: co phan truoc @, co ten mien co dau cham sau @
public static String getEmail(String input) throws Exception {
    // Email bo dau cach 2 dau, viet thuong
    String email = input.trim().toLowerCase();

    // Sai dang thi bao lai dung chu nguoi dung go
    if (!email.matches(Constants.REGEX_EMAIL)) {
        throw new Exception(String.format(Message.ERROR_EMAIL, input.trim()));
    }

    return email;
}</code></pre>
<pre class="trich"><code class="language-java">// Kiem ten nguoi (chi chu cai khong dau + dau cach) roi chuan hoa Title Case
private static String getPersonName(String input, String fieldName) throws Exception {
    // Ten da chuan hoa
    String name = toTitleCase(input);

    // Rong hoac co ky tu khac chu cai / dau cach thi bao loi kem ten o nhap
    if (!name.matches(Constants.REGEX_PERSON_NAME)) {
        throw new Exception(String.format(Message.ERROR_PERSON_NAME, fieldName));
    }

    return name;
}</code></pre>
</details>
<p>Các câu bộ chấm chờ ở phiên thêm sách (output thật):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ten sach: ISBN-13: Tac gia: Tac gia chi gom chu cai khong dau va dau cach (vi du: Nguyen Van An), khong de trong, khong co chu so. Moi nhap lai.<br>
Tac gia: Nam xuat ban: Nam xuat ban phai la 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Nam xuat ban: Nam xuat ban phai tu 1450 den 2100, ban nhap 1200. Moi nhap lai.<br>
Nam xuat ban: So ban: So ban phai tu 0 den 99, ban nhap -1. Moi nhap lai.<br>
So ban: Da them sach B005 "Clean Code". Thu vien co 5 dau sach.<br>
…</div>

<h4>Bước 6 — chấm, lint, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 113/113 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab2-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab2-Solution — sạch</div>`),
    bi(`<h2>5. The full solution — and the proof it is right</h2>
<p>The solution zip is the complete project: <code>lint.py</code> 0 violations, <code>javac --release 8</code>, the same output on a real JDK 8 (Docker <code>eclipse-temurin:8-jdk</code>), and 113/113 lines on the grader. The complete run:</p>
<details><summary>Full run — java -cp build main.Main &lt; harness/input.txt (113 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
2 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
3 &nbsp;&nbsp;B003 &nbsp;9780321349606 &nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brian Goetz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Java Concurrency In Practice<br>
4 &nbsp;&nbsp;B001 &nbsp;9780135957059 &nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Tac gia: Tac gia chi gom chu cai khong dau va dau cach (vi du: Nguyen Van An), khong de trong, khong co chu so. Moi nhap lai.<br>
Tac gia: Nam xuat ban: Nam xuat ban phai la 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Nam xuat ban: Nam xuat ban phai tu 1450 den 2100, ban nhap 1200. Moi nhap lai.<br>
Nam xuat ban: So ban: So ban phai tu 0 den 99, ban nhap -1. Moi nhap lai.<br>
So ban: Da them sach B005 "Clean Code". Thu vien co 5 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma sach (vi du B001): Ma sach phai la chu B + 3 chu so (vi du B001), ban nhap "b9". Moi nhap lai.<br>
Ma sach (vi du B001): So ban: Khong co sach nao mang ma B009. Hay chon 2 de xem ma sach roi thu lai.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma sach (vi du B001): So ban: Da cap nhat so ban cua B002 "Effective Java": 2 -&gt; 7.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B005 &nbsp;9780132350884 &nbsp;2008 &nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert C Martin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clean Code<br>
2 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
3 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
4 &nbsp;&nbsp;B003 &nbsp;9780321349606 &nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brian Goetz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Java Concurrency In Practice<br>
5 &nbsp;&nbsp;B001 &nbsp;9780135957059 &nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Them thanh vien ---<br>
Ho ten: Ho ten chi gom chu cai khong dau va dau cach (vi du: Nguyen Van An), khong de trong, khong co chu so. Moi nhap lai.<br>
Ho ten: Ho ten chi gom chu cai khong dau va dau cach (vi du: Nguyen Van An), khong de trong, khong co chu so. Moi nhap lai.<br>
Ho ten: Email: Email phai co dang ten@ten-mien (vi du an@ctlib.vn), ban nhap "cuong.le". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien (vi du an@ctlib.vn), ban nhap "cuong.le@ctlib". Moi nhap lai.<br>
Email: Da them thanh vien M003 "Le Van Cuong". Cau lac bo co 3 thanh vien.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Danh sach thanh vien ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email<br>
1 &nbsp;&nbsp;M003 &nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cuong.le@ctlib.vn<br>
2 &nbsp;&nbsp;M002 &nbsp;Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;an.nguyen@ctlib.vn<br>
3 &nbsp;&nbsp;M001 &nbsp;Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;binh.tran@ctlib.vn<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Tim sach theo ten ---<br>
Tu khoa: No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
2 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
3 &nbsp;&nbsp;B003 &nbsp;9780321349606 &nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brian Goetz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Java Concurrency In Practice<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 2 chi nam trong bo nho.</div>
</details>
<details><summary>BookController.java — updateCopies keeps a copy for the message</summary>
<pre><code class="language-java">package controller;

import constants.Constants;
import constants.Message;
import dto.BookRequestDTO;
import dto.BookResponseDTO;
import java.util.ArrayList;
import repository.BookRepository;
import service.BookService;
import view.BookView;

/**
 * Dieu phoi moi yeu cau ve sach: goi Repository de them/tim/sua (CRUD), dua du lieu
 * cho Service sap xep, roi dua ket qua cho View in. Khong import model.
 *
 * @author CuongThai Academy
 */
public class BookController {

    // Kho sach (CRUD nam o Controller, khong o Service)
    private BookRepository bookRepository;

    // Nghiep vu sap xep
    private BookService bookService;

    // Man hinh in ket qua
    private BookView bookView;

    // Tao kho, service, view va nap sach mau
    public BookController() {
        bookRepository = new BookRepository();
        bookService = new BookService();
        bookView = new BookView();

        // Nap sach mau; loi thi in ra (khong xay ra voi du lieu mau dung)
        try {
            loadSampleBooks();
        } catch (Exception e) {
            // Du lieu mau trung ISBN thi bao loi
            showResult(e.getMessage(), new ArrayList&lt;BookResponseDTO&gt;());
        }
    }

    // Them 1 sach, bao ket qua (thanh cong kem ma moi, hoac trung ISBN)
    public void addBook(BookRequestDTO bookRequestDTO) {
        // Cau ket qua se in
        String resultMessage = "";

        // Them vao kho (kho cap ma); trung ISBN thi kho nem loi
        try {
            resultMessage = String.format(Message.SUCCESS_ADD,
                    bookRepository.addBook(bookRequestDTO), bookRequestDTO.getTitle(),
                    bookRepository.countBooks());
        } catch (Exception e) {
            // Trung ISBN thi lay cau bao loi cua kho
            resultMessage = e.getMessage();
        }

        // In ket qua 1 lan
        showResult(resultMessage, new ArrayList&lt;BookResponseDTO&gt;());
    }

    // Sua so ban cua 1 sach (phieu dien ma + so ban moi), bao so cu -&gt; so moi
    public void updateCopies(BookRequestDTO bookRequestDTO) {
        // Cau ket qua se in
        String resultMessage = "";

        // Lay ban sao TRUOC khi sua (giu so cu), roi sua trong kho
        try {
            BookResponseDTO before = bookRepository.findById(bookRequestDTO.getId());

            // Sua trong kho; ban sao "before" KHONG doi theo vi no la doi tuong khac
            bookRepository.updateCopies(bookRequestDTO);
            resultMessage = String.format(Message.SUCCESS_UPDATE_COPIES, before.getId(),
                    before.getTitle(), before.getCopies(), bookRequestDTO.getCopies());
        } catch (Exception e) {
            // Khong co ma sach thi lay cau bao loi cua kho
            resultMessage = e.getMessage();
        }

        // In ket qua 1 lan
        showResult(resultMessage, new ArrayList&lt;BookResponseDTO&gt;());
    }

    // In moi sach, sap theo ten
    public void showAllBooks() {
        // Kho tra ban sao, Service sap xep + danh so
        ArrayList&lt;BookResponseDTO&gt; sortedList = bookService.sortByTitle(bookRepository.findAll());

        // Kho rong thi chi in cau bao rong, nguoc lai chi in bang
        if (sortedList.isEmpty()) {
            showResult(Message.EMPTY_LIST, sortedList);
        } else {
            // Co sach thi in bang, khong kem cau nao
            showResult("", sortedList);
        }
    }

    // Tim sach co ten chua tu khoa (phieu chi dien ten), in ket qua da sap theo ten
    public void searchBooks(BookRequestDTO bookRequestDTO) {
        // Kho tim theo tu khoa, Service sap xep + danh so
        ArrayList&lt;BookResponseDTO&gt; foundList
                = bookService.sortByTitle(bookRepository.findByKeyword(bookRequestDTO.getTitle()));

        // Khong tim thay thi chi in cau bao, nguoc lai chi in bang
        if (foundList.isEmpty()) {
            showResult(String.format(Message.NOT_FOUND, bookRequestDTO.getTitle()), foundList);
        } else {
            // Co ket qua thi in bang
            showResult("", foundList);
        }
    }

    // Dua cau thong bao + cac dong bang cho View roi goi in dung 1 lan
    private void showResult(String message, ArrayList&lt;BookResponseDTO&gt; responseList) {
        bookView.setMessage(message);
        bookView.setResponseList(responseList);
        bookView.display();
    }

    // Nap cac sach mau khai trong Constants
    private void loadSampleBooks() throws Exception {
        // Moi dong mau: { ten sach, ISBN, tac gia, nam, so ban }
        for (String[] rowArray : Constants.SAMPLE_BOOK_ARRAY) {
            bookRepository.addBook(toRequestDTO(rowArray));
        }
    }

    // Doi 1 dong mau (mang chuoi) thanh phieu sach
    private BookRequestDTO toRequestDTO(String[] rowArray) {
        // Phieu sach moi
        BookRequestDTO bookRequestDTO = new BookRequestDTO();

        // Chep tung cot cua dong mau vao phieu
        bookRequestDTO.setTitle(rowArray[Constants.SAMPLE_TITLE_INDEX]);
        bookRequestDTO.setIsbn(rowArray[Constants.SAMPLE_ISBN_INDEX]);
        bookRequestDTO.setAuthor(rowArray[Constants.SAMPLE_AUTHOR_INDEX]);
        bookRequestDTO.setYear(Integer.parseInt(rowArray[Constants.SAMPLE_YEAR_INDEX]));
        bookRequestDTO.setCopies(Integer.parseInt(rowArray[Constants.SAMPLE_COPIES_INDEX]));
        return bookRequestDTO;
    }
}</code></pre>
</details>`,
    `<h2>5. Đáp án đầy đủ — và bằng chứng là đúng</h2>
<p>Tệp zip đáp án là trọn dự án: <code>lint.py</code> 0 vi phạm, <code>javac --release 8</code>, chạy trên JDK 8 thật (Docker <code>eclipse-temurin:8-jdk</code>) ra y hệt, và bộ chấm 113/113 dòng. Trọn lần chạy:</p>
<details><summary>Trọn lần chạy — java -cp build main.Main &lt; harness/input.txt (113 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
2 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
3 &nbsp;&nbsp;B003 &nbsp;9780321349606 &nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brian Goetz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Java Concurrency In Practice<br>
4 &nbsp;&nbsp;B001 &nbsp;9780135957059 &nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Tac gia: Tac gia chi gom chu cai khong dau va dau cach (vi du: Nguyen Van An), khong de trong, khong co chu so. Moi nhap lai.<br>
Tac gia: Nam xuat ban: Nam xuat ban phai la 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Nam xuat ban: Nam xuat ban phai tu 1450 den 2100, ban nhap 1200. Moi nhap lai.<br>
Nam xuat ban: So ban: So ban phai tu 0 den 99, ban nhap -1. Moi nhap lai.<br>
So ban: Da them sach B005 "Clean Code". Thu vien co 5 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma sach (vi du B001): Ma sach phai la chu B + 3 chu so (vi du B001), ban nhap "b9". Moi nhap lai.<br>
Ma sach (vi du B001): So ban: Khong co sach nao mang ma B009. Hay chon 2 de xem ma sach roi thu lai.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma sach (vi du B001): So ban: Da cap nhat so ban cua B002 "Effective Java": 2 -&gt; 7.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B005 &nbsp;9780132350884 &nbsp;2008 &nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert C Martin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clean Code<br>
2 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
3 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
4 &nbsp;&nbsp;B003 &nbsp;9780321349606 &nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brian Goetz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Java Concurrency In Practice<br>
5 &nbsp;&nbsp;B001 &nbsp;9780135957059 &nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Them thanh vien ---<br>
Ho ten: Ho ten chi gom chu cai khong dau va dau cach (vi du: Nguyen Van An), khong de trong, khong co chu so. Moi nhap lai.<br>
Ho ten: Ho ten chi gom chu cai khong dau va dau cach (vi du: Nguyen Van An), khong de trong, khong co chu so. Moi nhap lai.<br>
Ho ten: Email: Email phai co dang ten@ten-mien (vi du an@ctlib.vn), ban nhap "cuong.le". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien (vi du an@ctlib.vn), ban nhap "cuong.le@ctlib". Moi nhap lai.<br>
Email: Da them thanh vien M003 "Le Van Cuong". Cau lac bo co 3 thanh vien.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Danh sach thanh vien ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email<br>
1 &nbsp;&nbsp;M003 &nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cuong.le@ctlib.vn<br>
2 &nbsp;&nbsp;M002 &nbsp;Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;an.nguyen@ctlib.vn<br>
3 &nbsp;&nbsp;M001 &nbsp;Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;binh.tran@ctlib.vn<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Tim sach theo ten ---<br>
Tu khoa: No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
2 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
3 &nbsp;&nbsp;B003 &nbsp;9780321349606 &nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brian Goetz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Java Concurrency In Practice<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 2 chi nam trong bo nho.</div>
</details>
<details><summary>BookController.java — updateCopies giữ một bản sao cho câu báo</summary>
<pre><code class="language-java">package controller;

import constants.Constants;
import constants.Message;
import dto.BookRequestDTO;
import dto.BookResponseDTO;
import java.util.ArrayList;
import repository.BookRepository;
import service.BookService;
import view.BookView;

/**
 * Dieu phoi moi yeu cau ve sach: goi Repository de them/tim/sua (CRUD), dua du lieu
 * cho Service sap xep, roi dua ket qua cho View in. Khong import model.
 *
 * @author CuongThai Academy
 */
public class BookController {

    // Kho sach (CRUD nam o Controller, khong o Service)
    private BookRepository bookRepository;

    // Nghiep vu sap xep
    private BookService bookService;

    // Man hinh in ket qua
    private BookView bookView;

    // Tao kho, service, view va nap sach mau
    public BookController() {
        bookRepository = new BookRepository();
        bookService = new BookService();
        bookView = new BookView();

        // Nap sach mau; loi thi in ra (khong xay ra voi du lieu mau dung)
        try {
            loadSampleBooks();
        } catch (Exception e) {
            // Du lieu mau trung ISBN thi bao loi
            showResult(e.getMessage(), new ArrayList&lt;BookResponseDTO&gt;());
        }
    }

    // Them 1 sach, bao ket qua (thanh cong kem ma moi, hoac trung ISBN)
    public void addBook(BookRequestDTO bookRequestDTO) {
        // Cau ket qua se in
        String resultMessage = "";

        // Them vao kho (kho cap ma); trung ISBN thi kho nem loi
        try {
            resultMessage = String.format(Message.SUCCESS_ADD,
                    bookRepository.addBook(bookRequestDTO), bookRequestDTO.getTitle(),
                    bookRepository.countBooks());
        } catch (Exception e) {
            // Trung ISBN thi lay cau bao loi cua kho
            resultMessage = e.getMessage();
        }

        // In ket qua 1 lan
        showResult(resultMessage, new ArrayList&lt;BookResponseDTO&gt;());
    }

    // Sua so ban cua 1 sach (phieu dien ma + so ban moi), bao so cu -&gt; so moi
    public void updateCopies(BookRequestDTO bookRequestDTO) {
        // Cau ket qua se in
        String resultMessage = "";

        // Lay ban sao TRUOC khi sua (giu so cu), roi sua trong kho
        try {
            BookResponseDTO before = bookRepository.findById(bookRequestDTO.getId());

            // Sua trong kho; ban sao "before" KHONG doi theo vi no la doi tuong khac
            bookRepository.updateCopies(bookRequestDTO);
            resultMessage = String.format(Message.SUCCESS_UPDATE_COPIES, before.getId(),
                    before.getTitle(), before.getCopies(), bookRequestDTO.getCopies());
        } catch (Exception e) {
            // Khong co ma sach thi lay cau bao loi cua kho
            resultMessage = e.getMessage();
        }

        // In ket qua 1 lan
        showResult(resultMessage, new ArrayList&lt;BookResponseDTO&gt;());
    }

    // In moi sach, sap theo ten
    public void showAllBooks() {
        // Kho tra ban sao, Service sap xep + danh so
        ArrayList&lt;BookResponseDTO&gt; sortedList = bookService.sortByTitle(bookRepository.findAll());

        // Kho rong thi chi in cau bao rong, nguoc lai chi in bang
        if (sortedList.isEmpty()) {
            showResult(Message.EMPTY_LIST, sortedList);
        } else {
            // Co sach thi in bang, khong kem cau nao
            showResult("", sortedList);
        }
    }

    // Tim sach co ten chua tu khoa (phieu chi dien ten), in ket qua da sap theo ten
    public void searchBooks(BookRequestDTO bookRequestDTO) {
        // Kho tim theo tu khoa, Service sap xep + danh so
        ArrayList&lt;BookResponseDTO&gt; foundList
                = bookService.sortByTitle(bookRepository.findByKeyword(bookRequestDTO.getTitle()));

        // Khong tim thay thi chi in cau bao, nguoc lai chi in bang
        if (foundList.isEmpty()) {
            showResult(String.format(Message.NOT_FOUND, bookRequestDTO.getTitle()), foundList);
        } else {
            // Co ket qua thi in bang
            showResult("", foundList);
        }
    }

    // Dua cau thong bao + cac dong bang cho View roi goi in dung 1 lan
    private void showResult(String message, ArrayList&lt;BookResponseDTO&gt; responseList) {
        bookView.setMessage(message);
        bookView.setResponseList(responseList);
        bookView.display();
    }

    // Nap cac sach mau khai trong Constants
    private void loadSampleBooks() throws Exception {
        // Moi dong mau: { ten sach, ISBN, tac gia, nam, so ban }
        for (String[] rowArray : Constants.SAMPLE_BOOK_ARRAY) {
            bookRepository.addBook(toRequestDTO(rowArray));
        }
    }

    // Doi 1 dong mau (mang chuoi) thanh phieu sach
    private BookRequestDTO toRequestDTO(String[] rowArray) {
        // Phieu sach moi
        BookRequestDTO bookRequestDTO = new BookRequestDTO();

        // Chep tung cot cua dong mau vao phieu
        bookRequestDTO.setTitle(rowArray[Constants.SAMPLE_TITLE_INDEX]);
        bookRequestDTO.setIsbn(rowArray[Constants.SAMPLE_ISBN_INDEX]);
        bookRequestDTO.setAuthor(rowArray[Constants.SAMPLE_AUTHOR_INDEX]);
        bookRequestDTO.setYear(Integer.parseInt(rowArray[Constants.SAMPLE_YEAR_INDEX]));
        bookRequestDTO.setCopies(Integer.parseInt(rowArray[Constants.SAMPLE_COPIES_INDEX]));
        return bookRequestDTO;
    }
}</code></pre>
</details>`),
    bi(`<h2>6. Traps (with real output)</h2>
<div class="pitfall"><p><strong>Trap 1 — changing a copy.</strong> The project with only <code>updateCopies</code> wrong (it calls <code>setCopies</code> on the DTO from <code>findById</code>): "2 -&gt; 7" is printed, the list still says 2.</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma sach (vi du B001): So ban: Da cap nhat so ban cua B002 "Effective Java": 2 -&gt; 7.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
2 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
3 &nbsp;&nbsp;B003 &nbsp;9780321349606 &nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brian Goetz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Java Concurrency In Practice<br>
4 &nbsp;&nbsp;B001 &nbsp;9780135957059 &nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Pragmatic Programmer<br>
…</div>
<div class="pitfall"><p><strong>Trap 2 — <code>b2 = b1</code> copies the arrow.</strong></p></div>
<pre><code class="language-java">// release: 8
// Lab 2 trap — Book b2 = b1 copies the REFERENCE, not the book
class Book {
    private String title;
    private int copies;

    Book(String title, int copies) {
        this.title = title;
        this.copies = copies;
    }

    String getTitle() { return title; }
    int getCopies() { return copies; }
    void setCopies(int copies) { this.copies = copies; }
}

public class LabBayAlias {
    public static void main(String[] args) {
        Book b1 = new Book("Effective Java", 2);
        Book b2 = b1;                                     // ONE object, two variables
        b2.setCopies(7);
        System.out.println("b1 copies = " + b1.getCopies() + ", b2 copies = " + b2.getCopies());
        System.out.println("b1 == b2 : " + (b1 == b2));

        Book b3 = new Book(b1.getTitle(), b1.getCopies()); // a real COPY: a second object
        b3.setCopies(0);
        System.out.println("b1 copies = " + b1.getCopies() + ", b3 copies = " + b3.getCopies());
        System.out.println("b1 == b3 : " + (b1 == b3));
    }
}</code></pre>
<div class="out">b1 copies = 7, b2 copies = 7<br>
b1 == b2 : true<br>
b1 copies = 7, b3 copies = 0<br>
b1 == b3 : false</div>
<div class="pitfall"><p><strong>Trap 3 — a constructor without <code>this.</code></strong> <code>name = name</code> assigns the parameter to itself; the field stays <code>null</code>, and javac says nothing.</p></div>
<pre><code class="language-java">// release: 8
// Lab 2 trap — a constructor that forgets "this." assigns the parameter to itself
class Member {
    private String name;
    private String email;

    Member(String name, String email) {
        name = name;                                      // both sides are the PARAMETER: the field stays null
        this.email = email;                               // this.email is the FIELD
    }

    String describe() { return name + " &lt;" + email + "&gt;"; }
}

public class LabBayThis {
    public static void main(String[] args) {
        Member member = new Member("Le Van Cuong", "cuong.le@ctlib.vn");
        System.out.println(member.describe());
    }
}</code></pre>
<div class="out">null &lt;cuong.le@ctlib.vn&gt;</div>
<div class="pitfall"><p><strong>Trap 4 — a static id counter.</strong> It compiles and even passes this harness (one repository per run) — and <code>lint.py</code> rejects it: "package 'repository' không được dùng static". Lab 3 shows the real bug it hides.</p></div>`,
    `<h2>6. Bẫy (kèm output thật)</h2>
<div class="pitfall"><p><strong>Bẫy 1 — sửa bản sao.</strong> Dự án chỉ sai đúng <code>updateCopies</code> (gọi <code>setCopies</code> trên DTO lấy từ <code>findById</code>): in "2 -&gt; 7", danh sách vẫn ghi 2.</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma sach (vi du B001): So ban: Da cap nhat so ban cua B002 "Effective Java": 2 -&gt; 7.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Them thanh vien<br>
6. Danh sach thanh vien<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
2 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
3 &nbsp;&nbsp;B003 &nbsp;9780321349606 &nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brian Goetz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Java Concurrency In Practice<br>
4 &nbsp;&nbsp;B001 &nbsp;9780135957059 &nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Pragmatic Programmer<br>
…</div>
<div class="pitfall"><p><strong>Bẫy 2 — <code>b2 = b1</code> chép mũi tên.</strong></p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 2 — Book b2 = b1 chép THAM CHIẾU, không chép cuốn sách
class Book {
    private String title;
    private int copies;

    Book(String title, int copies) {
        this.title = title;
        this.copies = copies;
    }

    String getTitle() { return title; }
    int getCopies() { return copies; }
    void setCopies(int copies) { this.copies = copies; }
}

public class LabBayAlias {
    public static void main(String[] args) {
        Book b1 = new Book("Effective Java", 2);
        Book b2 = b1;                                     // MỘT đối tượng, hai biến
        b2.setCopies(7);
        System.out.println("b1 copies = " + b1.getCopies() + ", b2 copies = " + b2.getCopies());
        System.out.println("b1 == b2 : " + (b1 == b2));

        Book b3 = new Book(b1.getTitle(), b1.getCopies()); // một BẢN SAO thật: đối tượng thứ hai
        b3.setCopies(0);
        System.out.println("b1 copies = " + b1.getCopies() + ", b3 copies = " + b3.getCopies());
        System.out.println("b1 == b3 : " + (b1 == b3));
    }
}</code></pre>
<div class="out">b1 copies = 7, b2 copies = 7<br>
b1 == b2 : true<br>
b1 copies = 7, b3 copies = 0<br>
b1 == b3 : false</div>
<div class="pitfall"><p><strong>Bẫy 3 — constructor quên <code>this.</code></strong> <code>name = name</code> gán tham số cho chính nó; trường vẫn <code>null</code>, và javac không nói gì.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 2 — constructor quên "this." gán tham số cho chính nó
class Member {
    private String name;
    private String email;

    Member(String name, String email) {
        name = name;                                      // hai vế đều là THAM SỐ: trường vẫn null
        this.email = email;                               // this.email là TRƯỜNG
    }

    String describe() { return name + " &lt;" + email + "&gt;"; }
}

public class LabBayThis {
    public static void main(String[] args) {
        Member member = new Member("Le Van Cuong", "cuong.le@ctlib.vn");
        System.out.println(member.describe());
    }
}</code></pre>
<div class="out">null &lt;cuong.le@ctlib.vn&gt;</div>
<div class="pitfall"><p><strong>Bẫy 4 — bộ đếm mã static.</strong> Biên dịch được, thậm chí qua bộ chấm này (mỗi lần chạy chỉ một repository) — và <code>lint.py</code> từ chối: "package 'repository' không được dùng static". Lab 3 cho thấy lỗi thật mà nó che giấu.</p></div>`),
    bi(`<h2>7. Rubric (10 points) and self-check</h2>
<table>
<thead><tr><th>Part</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Book + Member JavaBeans: private fields, empty + full constructor, <code>this(...)</code></td><td>2</td><td>read the classes, <code>lint.py</code> JAVABEAN rule</td></tr>
<tr><td>Ids B001 / M001 from an instance counter in the repository</td><td>2</td><td>grader lines 28, 78 + no <code>static</code></td></tr>
<tr><td>Update copies changes the book in the list</td><td>2</td><td>grader lines 49, 61</td></tr>
<tr><td>Members: add + list sorted by name</td><td>1</td><td>grader lines 87–91</td></tr>
<tr><td>Validation: 5 new checks, precise messages</td><td>2</td><td>grader lines 24–27, 38–39, 74–77</td></tr>
<tr><td><code>lint.py</code> 0 · comments · commit</td><td>1</td><td><code>lint.py</code>, <code>git log</code></td></tr>
</tbody>
</table>
<details><summary>1. After <code>Book b2 = b1;</code> how many Book objects exist?</summary><p class="dap-an">✅ One. The assignment copies the reference; both variables point to the same object, so <code>b1 == b2</code> is true.</p></details>
<details><summary>2. Why does <code>findById</code> return a DTO and not the Book?</summary><p class="dap-an">✅ So that nothing outside the repository can change the library's data by accident: the caller gets a copy. Only the repository's own methods (like <code>updateCopies</code>) change the real objects — and controllers never even import <code>model</code>.</p></details>
<details><summary>3. The club wants a "publisher" for each book. Which files change?</summary><p class="dap-an">✅ <code>model/Book.java</code> (field, constructor, get/set), both book DTOs, <code>BookRepository</code> (copy the field in <code>addBook</code> and <code>toResponseDTO</code>), <code>Validation</code> (a check), <code>Message</code>/<code>Constants</code> (prompt, message, table format), <code>Main</code> (one more question). The controller and the service do not change — DTOs carry the new field through them.</p></details>`,
    `<h2>7. Rubric (10 điểm) và tự kiểm</h2>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Kiểm bằng</th></tr></thead>
<tbody>
<tr><td>JavaBean Book + Member: trường private, constructor rỗng + đầy đủ, <code>this(...)</code></td><td>2</td><td>đọc lớp, luật JAVABEAN của <code>lint.py</code></td></tr>
<tr><td>Mã B001 / M001 từ bộ đếm là trường của repository</td><td>2</td><td>dòng 28, 78 của bộ chấm + không <code>static</code></td></tr>
<tr><td>Cập nhật số bản sửa đúng sách trong danh sách</td><td>2</td><td>dòng 49, 61</td></tr>
<tr><td>Thành viên: thêm + liệt kê theo họ tên</td><td>1</td><td>dòng 87–91</td></tr>
<tr><td>Validation: 5 phép kiểm mới, câu báo rõ</td><td>2</td><td>dòng 24–27, 38–39, 74–77</td></tr>
<tr><td><code>lint.py</code> 0 · comment · commit</td><td>1</td><td><code>lint.py</code>, <code>git log</code></td></tr>
</tbody>
</table>
<details><summary>1. Sau <code>Book b2 = b1;</code> có bao nhiêu đối tượng Book?</summary><p class="dap-an">✅ Một. Phép gán chép tham chiếu; hai biến trỏ cùng một đối tượng, nên <code>b1 == b2</code> là true.</p></details>
<details><summary>2. Vì sao <code>findById</code> trả về DTO chứ không trả Book?</summary><p class="dap-an">✅ Để không thứ gì ngoài repository vô tình sửa được dữ liệu thư viện: nơi gọi nhận bản sao. Chỉ phương thức của chính repository (như <code>updateCopies</code>) mới sửa đối tượng thật — và controller còn không hề import <code>model</code>.</p></details>
<details><summary>3. Câu lạc bộ muốn thêm "nhà xuất bản" cho mỗi cuốn. Sửa những tệp nào?</summary><p class="dap-an">✅ <code>model/Book.java</code> (trường, constructor, get/set), hai DTO của sách, <code>BookRepository</code> (chép trường trong <code>addBook</code> và <code>toResponseDTO</code>), <code>Validation</code> (một phép kiểm), <code>Message</code>/<code>Constants</code> (câu nhắc, câu báo, định dạng bảng), <code>Main</code> (thêm một câu hỏi). Controller và service không đổi — DTO mang trường mới đi qua chúng.</p></details>`),
    bi(`<h2>8. Extra challenges and what comes next</h2>
<ul>
<li>⭐ Menu 7: show one book by id (use <code>findById</code>). Which layers do you touch?</li>
<li>⭐ Count the total number of copies in the library — in the service, from the list the controller gives it.</li>
<li>⭐⭐ Six parameters in <code>Book(…)</code> is a lot. Read about the <strong>Builder</strong> pattern (the LAB211 reviewer likes it for classes with ≥ 6 fields) and sketch <code>new BookBuilder().title(…).author(…).build()</code>.</li>
</ul>
<div class="callout"><p><strong>Next — Lab 3 (after Chapter 3):</strong> encapsulation for real. No book from the future, one email per member, delete without ever reusing an id, a report — and a teammate's pull request in which <code>lint.py</code> finds six mistakes for you to fix.</p></div>`,
    `<h2>8. Thử thách thêm và việc tiếp theo</h2>
<ul>
<li>⭐ Menu 7: xem một cuốn theo mã (dùng <code>findById</code>). Bạn chạm vào những tầng nào?</li>
<li>⭐ Đếm tổng số bản của cả thư viện — làm trong service, từ danh sách controller đưa cho.</li>
<li>⭐⭐ Sáu tham số trong <code>Book(…)</code> là nhiều. Đọc về mẫu <strong>Builder</strong> (thầy LAB211 thích dùng cho lớp có ≥ 6 trường) và phác thảo <code>new BookBuilder().title(…).author(…).build()</code>.</li>
</ul>
<div class="callout"><p><strong>Tiếp theo — Lab 3 (sau Chương 3):</strong> đóng gói làm thật. Không có sách từ tương lai, mỗi thành viên một email, xoá mà không bao giờ cấp lại mã, một bản thống kê — và pull request của bạn cùng nhóm, nơi <code>lint.py</code> tìm ra sáu lỗi để bạn sửa.</p></div>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch2) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) What is the role of the garbage collector in Java?|||(Dạng câu FE) Vai trò của bộ thu gom rác (garbage collector) trong Java là gì?',
      options: ['It deletes the .java and .class files the program no longer needs|||Nó xoá các file .java và .class mà chương trình không còn cần', 'It frees heap memory by destroying objects that can no longer be reached|||Nó giải phóng bộ nhớ heap bằng cách huỷ các đối tượng không còn với tới được', 'It frees the stack frame of a method as soon as the method returns|||Nó giải phóng khung stack của một phương thức ngay khi phương thức trả về', 'It runs only when the programmer calls System.gc()|||Nó chỉ chạy khi lập trình viên gọi System.gc()'],
      correctIndex: 1,
      points: 1,
      explanation: 'The GC works on the heap and frees objects that no variable can reach any more. C describes the stack, which needs no collector: a frame disappears by itself when its method returns. D is wrong twice: the GC runs automatically (lesson 2.A measured more than 50 runs in one small program) and System.gc() is only a request the JVM may ignore.|||GC làm việc trên heap và giải phóng các đối tượng không còn biến nào với tới. C tả stack, nơi không cần bộ thu gom: khung tự biến mất khi phương thức của nó trả về. D sai hai lần: GC chạy tự động (bài 2.A đo được hơn 50 lần chạy trong một chương trình nhỏ) và System.gc() chỉ là lời xin mà JVM có thể bỏ qua.' },
    { id: 'q2',
      question: '(FE question type) When does the String object created on line 2 become eligible for garbage collection?|||(Dạng câu FE) Đối tượng String tạo ở dòng 2 trở nên đủ điều kiện bị thu gom rác từ khi nào?',
      code: `1. String s = "aaa";
2. String t = new String(s);
3. t += "zzz";
4. t = t.substring(0);
5. t = null;`,
      codeLang: 'java',
      options: ['After line 4|||After line 4 (sau dòng 4)', 'After line 5|||After line 5 (sau dòng 5)', 'After line 3|||After line 3 (sau dòng 3)', 'Never in this code|||Never in this code (không bao giờ trong đoạn code này)'],
      correctIndex: 2,
      points: 1,
      explanation: "t += \"zzz\" does not change the String of line 2 (Strings are immutable); it builds a NEW String \"aaazzz\" and moves t to it, so after line 3 nothing refers to the line-2 object. A program that checks a WeakReference after every line prints \"After line 3\". B is the answer for the \"aaazzz\" chain, not for line 2's object. Some FE banks print a different key for this question — trust the run.|||t += \"zzz\" không đổi String của dòng 2 (String bất biến); nó dựng một String MỚI \"aaazzz\" và chuyển t sang đó, nên sau dòng 3 không còn gì trỏ tới đối tượng của dòng 2. Chương trình kiểm WeakReference sau từng dòng in \"After line 3\". B là đáp án cho chuỗi \"aaazzz\", không phải cho đối tượng dòng 2. Vài bộ đề FE in đáp án khác cho câu này — hãy tin lần chạy thật." },
    { id: 'q3',
      question: 'What does this program print?|||Chương trình này in ra gì?',
      code: `static void f(int[] a, int n, StringBuilder sb) {
    a[0]++;
    n++;
    sb.append("!");
    sb = new StringBuilder("new");
}

public static void main(String[] args) {
    int[] a = {1};
    int n = 1;
    StringBuilder sb = new StringBuilder("hi");
    f(a, n, sb);
    System.out.println(a[0] + " " + n + " " + sb);
}`,
      codeLang: 'java',
      options: ['2 1 hi!|||2 1 hi!', '2 2 new|||2 2 new', '1 1 hi|||1 1 hi', '2 1 new|||2 1 new'],
      correctIndex: 0,
      points: 1,
      explanation: "Java passes everything by value. f gets a copy of the array reference and changes the array itself (a[0] becomes 2); a copy of the int (the caller's n stays 1); a copy of the StringBuilder reference — append(\"!\") changes the shared object to \"hi!\", then sb = new StringBuilder(\"new\") only moves the copy. D is the classic \"pass by reference\" mistake.|||Java truyền mọi thứ theo giá trị. f nhận bản sao tham chiếu mảng và đổi chính mảng (a[0] thành 2); bản sao của số int (n bên gọi vẫn là 1); bản sao tham chiếu StringBuilder — append(\"!\") đổi đối tượng dùng chung thành \"hi!\", rồi sb = new StringBuilder(\"new\") chỉ chuyển bản sao đi chỗ khác. D là lỗi kinh điển \"truyền theo tham chiếu\"." },
    { id: 'q4',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `protected String id;

public Q4CheTen(String id) {
    id = id;
}

public static void main(String[] args) {
    Q4CheTen p = new Q4CheTen("FPTU");
    System.out.println(p.id);
}`,
      codeLang: 'java',
      options: ['null|||null', 'FPTU|||FPTU', 'A compile error: id is already defined|||Lỗi biên dịch: id đã được định nghĩa', 'A NullPointerException at run time|||Một NullPointerException lúc chạy'],
      correctIndex: 0,
      points: 1,
      explanation: "Inside the constructor the parameter id shadows the field, so id = id assigns the parameter to itself and the field keeps its default value null. It compiles (a parameter may have a field's name) and nothing is dereferenced, so there is no exception. The fix is this.id = id.|||Trong constructor, tham số id che trường, nên id = id gán tham số cho chính nó và trường giữ giá trị mặc định null. Nó biên dịch được (tham số được phép trùng tên trường) và không có phép truy cập nào trên null, nên không có ngoại lệ. Sửa bằng this.id = id." },
    { id: 'q5',
      question: '(FE question type) Class Person declares String id = "P1"; and only one constructor, Person(String id) { this.id = id; }. In main: Person p = new Person(); System.out.println(p.id); — what happens?|||(Dạng câu FE) Lớp Person khai báo String id = "P1"; và đúng một constructor Person(String id) { this.id = id; }. Trong main: Person p = new Person(); System.out.println(p.id); — điều gì xảy ra?',
      options: ['It prints P1|||In ra P1', 'It prints null|||In ra null', 'It throws an exception at run time|||Ném ngoại lệ lúc chạy', 'Compile error: constructor Person cannot be applied to given types|||Lỗi biên dịch: constructor Person cannot be applied to given types'],
      correctIndex: 3,
      points: 1,
      explanation: 'The compiler adds a no-argument default constructor only when a class declares no constructor at all. Person declares one, so new Person() does not compile — javac 8 says "constructor ... cannot be applied to given types; required: String, found: no arguments" (lesson 2.B, slide 9 ran exactly this). A would be right only if Person had no constructor or an explicit Person().|||Trình biên dịch chỉ thêm constructor mặc định không tham số khi lớp không khai báo constructor nào. Person đã khai báo một cái, nên new Person() không biên dịch được — javac 8 báo "constructor ... cannot be applied to given types; required: String, found: no arguments" (bài 2.B, slide 9 đã chạy đúng việc này). A chỉ đúng nếu Person không có constructor nào hoặc có Person() viết tường minh.' },
    { id: 'q6',
      question: '(FE question type) Which statement about constructors is FALSE?|||(Dạng câu FE) Phát biểu nào về constructor là SAI?',
      options: ['A constructor has the same name as its class|||Constructor có cùng tên với lớp của nó', 'A class may have several constructors with different parameter lists|||Một lớp có thể có nhiều constructor với danh sách tham số khác nhau', 'A constructor can be overridden in a subclass|||Constructor có thể bị ghi đè (override) ở lớp con', 'A constructor may call another constructor of the same class with this(...)|||Constructor có thể gọi constructor khác của cùng lớp bằng this(...)'],
      correctIndex: 2,
      points: 1,
      explanation: "Constructors are not inherited, so there is nothing a subclass could override; a subclass writes its own constructors and may call the parent's with super(...). A, B (overloading) and D (this(...) as the first statement) are all true — lesson 2.B, slides 9–10.|||Constructor không được kế thừa, nên lớp con không có gì để ghi đè; lớp con tự viết constructor của nó và có thể gọi constructor cha bằng super(...). A, B (nạp chồng) và D (this(...) ở câu lệnh đầu tiên) đều đúng — bài 2.B, slide 9–10." },
    { id: 'q7',
      question: 'What does this program print?|||Chương trình này in ra gì?',
      code: `int a = 5;
int b;

Q7ThuTu() {
    System.out.print(a + " " + b + " ");
    a = 9;
    b = a * 2;
}

public static void main(String[] args) {
    Q7ThuTu q = new Q7ThuTu();
    System.out.println(q.a + " " + q.b);
}`,
      codeLang: 'java',
      options: ['0 0 9 18|||0 0 9 18', '5 0 9 18|||5 0 9 18', '5 0 5 10|||5 0 5 10', '9 18 9 18|||9 18 9 18'],
      correctIndex: 1,
      points: 1,
      explanation: 'Order of creation: all fields start at 0, then the field initializer a = 5 runs, then the constructor body. So the body first prints a = 5 and b = 0 (b has no initializer), then sets a = 9 and b = 18, which main prints. A forgets that initializers run before the body; C reads b = a * 2 before a = 9.|||Thứ tự tạo đối tượng: mọi trường bắt đầu bằng 0, rồi giá trị khởi đầu a = 5 chạy, rồi mới tới thân constructor. Vì vậy thân in a = 5 và b = 0 trước (b không có giá trị khởi đầu), rồi gán a = 9 và b = 18, là thứ main in ra. A quên rằng giá trị khởi đầu chạy trước thân; C tính b = a * 2 trước khi a = 9.' },
    { id: 'q8',
      question: 'What does this program print?|||Chương trình này in ra gì?',
      code: `public static void main(String[] args) {
    String a = "Java";
    String b = new String("Java");
    String c = b;
    System.out.println((a == b) + " " + a.equals(b) + " " + (b == c));
}`,
      codeLang: 'java',
      options: ['true true true|||true true true', 'false false true|||false false true', 'true true false|||true true false', 'false true true|||false true true'],
      correctIndex: 3,
      points: 1,
      explanation: 'a is the pooled literal, new String always makes another object, so a == b is false although equals compares the characters and gives true. c = b copies the reference, so b == c is true: one object, two names. Rule for every PE: compare Strings with equals.|||a là hằng chuỗi trong pool, new String luôn tạo thêm một đối tượng, nên a == b là false dù equals so ký tự và cho true. c = b chép tham chiếu, nên b == c là true: một đối tượng, hai cái tên. Luật cho mọi bài PE: so String bằng equals.' },
    { id: 'q9',
      question: 'Which pair of methods can NOT be declared together in the same class?|||Cặp phương thức nào KHÔNG thể khai báo cùng nhau trong một lớp?',
      options: ['int area(int w) and double area(int side)|||int area(int w) và double area(int side)', 'int add(int a, int b) and double add(double a, double b)|||int add(int a, int b) và double add(double a, double b)', 'String add(String s, int n) and String add(int n, String s)|||String add(String s, int n) và String add(int n, String s)', 'void m1(String x) and void m1(String x, String y)|||void m1(String x) và void m1(String x, String y)'],
      correctIndex: 0,
      points: 1,
      explanation: 'A signature is the name plus the order of parameter types. Both area methods are area(int): a different return type and a different parameter name do not make a new signature, and javac 8 says "method area(int) is already defined". B (other types), C (other order) and D (other count) are legal overloads.|||Chữ ký là tên cộng thứ tự kiểu tham số. Cả hai phương thức area đều là area(int): khác kiểu trả về và khác tên tham số không tạo ra chữ ký mới, và javac 8 báo "method area(int) is already defined". B (khác kiểu), C (khác thứ tự) và D (khác số lượng) đều là nạp chồng hợp lệ.' },
    { id: 'q10',
      question: 'In void f() { int n = 5; Student s = new Student(); } — where are n, s and the Student object stored while f runs?|||Trong void f() { int n = 5; Student s = new Student(); } — khi f đang chạy, n, s và đối tượng Student nằm ở đâu?',
      options: ['All three on the heap|||Cả ba trên heap', 'n on the stack; s and the Student object on the heap|||n trên stack; s và đối tượng Student trên heap', 'n and s on the stack; the Student object on the heap|||n và s trên stack; đối tượng Student trên heap', 'n and s in the method area; the Student object on the stack|||n và s trong method area; đối tượng Student trên stack'],
      correctIndex: 2,
      points: 1,
      explanation: "Both n and s are local variables, so both live in f's stack frame — n holds the value 5, s holds only a reference. The object created by new is on the heap. When f returns, the frame (n and s) disappears at once; the Student object becomes garbage and waits for the collector. B is the most common trap: a variable of a class type is still a local variable.|||Cả n và s đều là biến cục bộ, nên đều nằm trong khung stack của f — n giữ giá trị 5, s chỉ giữ một tham chiếu. Đối tượng do new tạo nằm trên heap. Khi f trả về, khung (n và s) biến mất ngay; đối tượng Student thành rác và chờ bộ thu gom. B là bẫy phổ biến nhất: biến kiểu lớp vẫn là biến cục bộ." },
  ],
};

export default {
  slides: [L_pro7_1, L_pro8_1, L_pro8_2],
  practice: L_on_ch2,
  labs: [L_lab2],
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 2 (viết lại, có giải thích song ngữ, lấy cảm hứng từ đề FE thật): vai trò của bộ thu gom rác, đối tượng String thành rác sau dòng nào, truyền theo giá trị với mảng/int/StringBuilder, tham số che trường trong constructor, constructor mặc định biến mất khi tự viết constructor, constructor có override được không, thứ tự khởi tạo đối tượng, == và equals với String, chữ ký phương thức, biến và đối tượng nằm ở stack hay heap — mọi câu "in ra gì" đều đã chạy thật.',
};
