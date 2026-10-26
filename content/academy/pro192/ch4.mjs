/**
 * PRO192 · Chương 4 — kế thừa & đa hình (pro9; pro10 slide 1–11).
 * Bài 📑 học theo từng slide: pro9 (tmp_09.pptx, slide 1–17); pro10 (tmp_10.pptx, slide 1–11).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch4.
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab-4-ke-thua-va-da-hinh.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch4).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, registerDeck, bi } from './_slides.mjs';

registerDeck('lab4', { code: 'PRO192 Lab 4', en: 'Lab 4 — CT Library: inheritance and polymorphism', vi: 'Lab 4 — CT Library: kế thừa và đa hình', total: 16, w: 1280, h: 720 });

/* ───────── 4.A — 📑 Slide by slide · Inheritance: is-a vs has-a, super, constructors, hiding, instanceof, casting (slides 1–17) ───────── */
const L_pro9_1 = {
  title: '4.A — 📑 Slide by slide · Inheritance: is-a vs has-a, super, constructors, hiding, instanceof, casting (slides 1–17)|||4.A — 📑 Học theo từng slide · Inheritance: is-a, has-a, super, constructor, che giấu, ép kiểu (slide 1–17)',
  slug: 'pro192-slide-pro9-1',
  type: 'VIDEO',
  description: 'Giảng đủ 17 slide bộ "Inheritance" của trường: lớp cha/lớp con và cây từ trừu tượng tới cụ thể, quan hệ is-a (extends) và has-a (trường tham chiếu) vẽ lại bằng UML chuẩn, cách tìm lớp cha bằng "giao" các thuộc tính chung (Rectangle/Box, cửa hàng đồ cổ Item/Vase/Statue/Painting — đúng dạng câu 2 đề PE), bốn luật của extends, từ khoá super cho constructor và cho phương thức, thứ tự chạy constructor, che giấu phương thức static, kiểu tĩnh/kiểu động với instanceof, ép kiểu xuống và ClassCastException — mỗi ý có chương trình Java chạy thật trên JDK 8 (cả lỗi biên dịch thật), và chỉ rõ các chỗ slide gõ sai.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.A · school deck "Inheritance", slides 1–17</span>
<h2>One class built on top of another — the third pillar, and question 2 of every PE paper</h2>
<p class="lead">Chapter 1 named the four pillars; Chapters 2–3 built single classes with private fields and constructors. This deck connects classes: a <strong>subclass</strong> takes the whole structure of a <strong>superclass</strong> with one word, <code>extends</code>, and adds or changes only what is its own. It is the most exam-heavy topic of PRO192: almost every real PE paper has a question "write class X and class SpecX extending X" (Exam Room: PE10 <em>Car/SpecCar</em>, PE11 <em>Ladder/SpecLadder</em>, PE14 <em>Chair/SpecChair</em>, PE2 <em>Employee/Manager</em>…), and the new single-question papers build an abstract class with two subclasses. Every slide below has a program compiled and run for real on <strong>JDK 8</strong>, the exam-room JDK.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>superclass, subclass; is-a vs has-a</td><td>say whether two classes need <code>extends</code> or a field, and draw both in UML</td></tr>
<tr><td>6–7</td><td>building a hierarchy by "intersection"</td><td>find the common fields of several classes and move them into a superclass</td></tr>
<tr><td>8–11</td><td>the rules of <code>extends</code>; <code>super(...)</code>; the Rectangle/Box program</td><td>write a subclass constructor that calls the right parent constructor, and read the compile errors when you do not</td></tr>
<tr><td>12–14</td><td>methods in inheritance; <code>super.method()</code>; hiding a static method</td><td>extend a parent method instead of copying it, and predict static versus instance calls</td></tr>
<tr><td>15–17</td><td>static/dynamic type; <code>instanceof</code>; casting</td><td>call a subclass-only method safely and explain <code>ClassCastException</code></td></tr>
</tbody>
</table>
<div class="callout"><strong>How this lesson relates to the older ones.</strong> The web lesson 4.1 "Inheritance" further down stays as a short summary with the Animal/Dog example; this lesson walks the school's own slides one by one. Overriding and polymorphism get their own deck next (lesson 4.B).</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.A · bộ slide "Inheritance" của trường, slide 1–17</span>
<h2>Một lớp xây trên một lớp khác — trụ cột thứ ba, và là câu 2 của mọi đề PE</h2>
<p class="lead">Chương 1 gọi tên bốn trụ cột; Chương 2–3 dựng từng lớp riêng lẻ với trường private và constructor. Bộ slide này nối các lớp lại: một <strong>lớp con (subclass)</strong> nhận trọn cấu trúc của một <strong>lớp cha (superclass)</strong> chỉ bằng một từ, <code>extends</code>, rồi chỉ thêm hoặc sửa phần của riêng nó. Đây là chủ đề nặng điểm nhất của PRO192: gần như đề PE thật nào cũng có câu "viết lớp X và lớp SpecX kế thừa X" (Exam Room: PE10 <em>Car/SpecCar</em>, PE11 <em>Ladder/SpecLadder</em>, PE14 <em>Chair/SpecChair</em>, PE2 <em>Employee/Manager</em>…), còn dạng đề một câu 10 điểm mới thì dựng một lớp trừu tượng với hai lớp con. Mỗi slide bên dưới có chương trình đã biên dịch và chạy thật trên <strong>JDK 8</strong>, JDK của phòng thi.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>lớp cha, lớp con; is-a và has-a</td><td>nói được hai lớp cần <code>extends</code> hay cần một trường, và vẽ cả hai bằng UML</td></tr>
<tr><td>6–7</td><td>dựng cây phân cấp bằng cách "lấy giao"</td><td>tìm trường chung của vài lớp và đưa chúng lên một lớp cha</td></tr>
<tr><td>8–11</td><td>luật của <code>extends</code>; <code>super(...)</code>; chương trình Rectangle/Box</td><td>viết constructor lớp con gọi đúng constructor của cha, và đọc được lỗi biên dịch khi không làm vậy</td></tr>
<tr><td>12–14</td><td>phương thức trong kế thừa; <code>super.method()</code>; che giấu phương thức static</td><td>mở rộng phương thức của cha thay vì chép lại, và đoán đúng lời gọi static so với lời gọi thể hiện</td></tr>
<tr><td>15–17</td><td>kiểu tĩnh/kiểu động; <code>instanceof</code>; ép kiểu</td><td>gọi an toàn một phương thức chỉ lớp con mới có và giải thích <code>ClassCastException</code></td></tr>
</tbody>
</table>
<div class="callout"><strong>Bài này liên quan thế nào tới các bài cũ.</strong> Bài web cũ 4.1 "Kế thừa" phía dưới vẫn giữ làm bản tóm tắt ngắn với ví dụ Animal/Dog; bài này đi theo từng slide của chính trường. Ghi đè (overriding) và đa hình có bộ slide riêng ngay sau (bài 4.B).</div>`),
    walkHead('pro9', 1, 17),
    walk('pro9', [
      [1, 'Inheritance',
        `<p class="y-chinh">🎯 Inheritance is the third of the four pillars from lesson 1.A: one class is built on another and <strong>reuses its whole structure</strong> — fields and methods — instead of copying it.</p>
<p>In the syllabus this is CLO6 ("implement inheritance and polymorphism"), sessions 23–28, and it is the base for Chapter 5 (abstract classes, interfaces). In lesson 1.A you met the idea as "is a kind of": a <code>SpecialOrder</code> is a kind of <code>Order</code>. Now you learn the exact Java rules behind that sentence.</p>
<p>➕ Why it matters beyond PRO192: every Spring Boot controller, every JUnit test class and every Swing window in the school's Banking project is a class that <code>extends</code> or <code>implements</code> something written by someone else. Reading inheritance quickly is reading real code.</p>
<p class="meo">🧠 One sentence for the deck: <em>write the common part once in a parent class; each child class adds only what makes it different.</em></p>`,
        `<p class="y-chinh">🎯 Kế thừa (inheritance) là trụ cột thứ ba trong bốn trụ cột của bài 1.A: một lớp được xây trên một lớp khác và <strong>dùng lại trọn cấu trúc của nó</strong> — trường và phương thức — thay vì chép lại.</p>
<p>Trong đề cương đây là CLO6 ("hiện thực kế thừa và đa hình"), buổi 23–28, và là nền cho Chương 5 (lớp trừu tượng, interface). Ở bài 1.A bạn đã gặp ý này dưới dạng "là một loại": <code>SpecialOrder</code> là một loại <code>Order</code>. Giờ bạn học đúng các luật Java đứng sau câu nói đó.</p>
<p>➕ Vì sao nó quan trọng ngoài PRO192: mọi controller Spring Boot, mọi lớp test JUnit và mọi cửa sổ Swing trong project Banking của trường đều là một lớp <code>extends</code> hoặc <code>implements</code> thứ người khác đã viết. Đọc nhanh được kế thừa là đọc được code thật.</p>
<p class="meo">🧠 Một câu cho cả bộ slide: <em>viết phần chung một lần ở lớp cha; mỗi lớp con chỉ thêm đúng phần làm nó khác đi.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Five goals: the concepts <strong>superclass/subclass</strong>, the two common <strong>relationships</strong> (is-a, has-a), <strong>methods</strong> in inheritance, the <strong>instanceof</strong> operator, and <strong>casting</strong>.</p>
<table>
<thead><tr><th>Objective</th><th>Slides</th><th>Typical exam question</th></tr></thead>
<tbody>
<tr><td>superclass, subclass</td><td>3, 6–11</td><td>PE: "write class Car and class SpecCar extending Car"; FE: "which keyword creates a subclass?"</td></tr>
<tr><td>is-a / has-a</td><td>4–5</td><td>FE: "Student is a Person, Student has an Address — which is inheritance?"</td></tr>
<tr><td>functions in inheritance</td><td>12–14</td><td>FE: "what is printed?" with <code>super.method()</code> or a static method</td></tr>
<tr><td>instanceof</td><td>15</td><td>FE: "<code>a instanceof Date</code> prints?"</td></tr>
<tr><td>casting</td><td>16</td><td>FE: "which line compiles: <code>a2.dojob2()</code> or <code>((B) a2).dojob2()</code>?"</td></tr>
</tbody>
</table>
<p>Overriding — a subclass replacing a parent's method — appears here only briefly (slide 13); deck "Polymorphism" (lesson 4.B) explains it fully.</p>`,
        `<p class="y-chinh">🎯 Năm mục tiêu: khái niệm <strong>lớp cha/lớp con</strong>, hai <strong>quan hệ</strong> phổ biến (is-a, has-a), <strong>phương thức</strong> trong kế thừa, toán tử <strong>instanceof</strong>, và <strong>ép kiểu (casting)</strong>.</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Slide</th><th>Câu thi điển hình</th></tr></thead>
<tbody>
<tr><td>lớp cha, lớp con</td><td>3, 6–11</td><td>PE: "viết lớp Car và lớp SpecCar kế thừa Car"; FE: "từ khoá nào tạo lớp con?"</td></tr>
<tr><td>is-a / has-a</td><td>4–5</td><td>FE: "Student là một Person, Student có một Address — cái nào là kế thừa?"</td></tr>
<tr><td>phương thức trong kế thừa</td><td>12–14</td><td>FE: "in ra gì?" với <code>super.method()</code> hoặc phương thức static</td></tr>
<tr><td>instanceof</td><td>15</td><td>FE: "<code>a instanceof Date</code> in ra gì?"</td></tr>
<tr><td>ép kiểu</td><td>16</td><td>FE: "dòng nào biên dịch được: <code>a2.dojob2()</code> hay <code>((B) a2).dojob2()</code>?"</td></tr>
</tbody>
</table>
<p>Ghi đè (overriding) — lớp con thay phương thức của cha — chỉ xuất hiện thoáng qua ở đây (slide 13); bộ slide "Polymorphism" (bài 4.B) giải thích đầy đủ.</p>`],
      [3, 'Derived and Super Classes',
        `<p class="y-chinh">🎯 Inheritance is how OO languages <strong>reuse the coding structure</strong>: one class inherits the entire structure of another. The root is a relatively <strong>abstract</strong> entity; we build progressively more <strong>concrete</strong> entities on it — the higher ones are "parent", "base" or "super" classes, the lower ones "child", "derived" or "sub" classes.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/81dd410abe3a8447dc5176c29a04e464d54eb338.svg" alt="Slide 3 redrawn: a shop's hierarchy from Item (abstract) down to Cheese and Peas (concrete)" loading="lazy" /><p class="chu-thich">🧩 Slide 3 redrawn: a shop's hierarchy from Item (abstract) down to Cheese and Peas (concrete)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 3 redrawn — from relatively abstract (top) to concrete (bottom)
' Every arrow reads "is a": Cheese is a Perishable is a Food is an Item
hide empty members
class Item
class Food
class Perishable
class Frozen
class Cheese
class Peas
Item &lt;|-- Food
Food &lt;|-- Perishable
Food &lt;|-- Frozen
Perishable &lt;|-- Cheese
Frozen &lt;|-- Peas
note right of Item
  relatively abstract:
  "parent", "base", "super" class
end note
note right of Peas
  concrete:
  "child", "derived", "sub" class
end note
@enduml</code></pre></details>
<p>The picture is a retail shop. Nobody walks in and buys "an item" — the shop assistant would ask "which item?". You buy a cheese or a bag of peas. Yet <code>Item</code> is useful: everything the shop sells has a price and a code, and that is written <strong>once</strong>, at the top. Real run — the program walks up from each object to its superclasses:</p>
<pre><code class="language-java">// release: 8
// Slide 3: a hierarchy goes from relatively abstract (Item) to concrete (Cheese, Peas); every class also is-a Object

class Item { }                          // relatively abstract: you cannot buy "an item"
class Food extends Item { }
class Perishable extends Food { }       // goes bad quickly
class Frozen extends Food { }           // kept in the freezer
class Cheese extends Perishable { }     // concrete: you can buy a cheese
class Peas extends Frozen { }

public class ThucPhamPhanCap {
    static void printChain(Object o) {
        StringBuilder sb = new StringBuilder();
        for (Class&lt;?&gt; c = o.getClass(); c != null; c = c.getSuperclass()) {   // walk up: class -&gt; superclass -&gt; ... -&gt; Object
            if (sb.length() &gt; 0) sb.append(" is-a ");
            sb.append(c.getSimpleName());
        }
        System.out.println(sb);
    }

    public static void main(String[] args) {
        printChain(new Cheese());
        printChain(new Peas());
        Item basket = new Cheese();                       // a Cheese can stand where an Item is expected
        System.out.println("basket instanceof Food   : " + (basket instanceof Food));
        System.out.println("basket instanceof Frozen : " + (basket instanceof Frozen));
    }
}</code></pre>
<div class="out">Cheese is-a Perishable is-a Food is-a Item is-a Object<br>
Peas is-a Frozen is-a Food is-a Item is-a Object<br>
basket instanceof Food &nbsp;&nbsp;: true<br>
basket instanceof Frozen : false</div>
<p>Note the last word of each chain: <code>Object</code>. Every Java class has a parent; if you write none, it is <code>java.lang.Object</code> (slide 8). And a <code>Cheese</code> stored in an <code>Item</code> variable is a <code>Food</code> but not a <code>Frozen</code> — an object is an instance of its class and of every class above it, never of a sibling branch.</p>
<p class="meo">🧠 Three pairs of names, one meaning: parent = base = <strong>super</strong>class; child = derived = <strong>sub</strong>class. Java's keywords use "super" (<code>super(...)</code>) and the API uses "superclass" (<code>getSuperclass()</code>).</p>`,
        `<p class="y-chinh">🎯 Kế thừa là cách các ngôn ngữ hướng đối tượng <strong>dùng lại cấu trúc code</strong>: một lớp nhận trọn cấu trúc của một lớp khác. Gốc là một thực thể tương đối <strong>trừu tượng</strong>; ta xây trên nó các thực thể ngày càng <strong>cụ thể</strong> — lớp ở trên gọi là lớp "cha", "cơ sở" hay "super", lớp ở dưới gọi là lớp "con", "dẫn xuất" hay "sub".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/81dd410abe3a8447dc5176c29a04e464d54eb338.svg" alt="Slide 3 vẽ lại: cây phân cấp của một cửa hàng từ Item (trừu tượng) xuống Cheese và Peas (cụ thể)" loading="lazy" /><p class="chu-thich">🧩 Slide 3 vẽ lại: cây phân cấp của một cửa hàng từ Item (trừu tượng) xuống Cheese và Peas (cụ thể)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 3 redrawn — from relatively abstract (top) to concrete (bottom)
' Mỗi mũi tên đọc là "là một": Cheese là Perishable là Food là Item
hide empty members
class Item
class Food
class Perishable
class Frozen
class Cheese
class Peas
Item &lt;|-- Food
Food &lt;|-- Perishable
Food &lt;|-- Frozen
Perishable &lt;|-- Cheese
Frozen &lt;|-- Peas
note right of Item
  relatively abstract:
  "parent", "base", "super" class
end note
note right of Peas
  concrete:
  "child", "derived", "sub" class
end note
@enduml</code></pre></details>
<p>Hình trên slide là một cửa hàng bán lẻ. Không ai bước vào và mua "một món hàng" — nhân viên sẽ hỏi "món nào?". Bạn mua một miếng phô mai hay một túi đậu Hà Lan. Vậy mà <code>Item</code> vẫn có ích: mọi thứ cửa hàng bán đều có giá và mã, và điều đó được viết <strong>một lần</strong>, ở trên cùng. Chạy thật — chương trình đi ngược từ mỗi đối tượng lên các lớp cha:</p>
<pre><code class="language-java">// release: 8
// Slide 3: cây phân cấp đi từ tương đối trừu tượng (Item) tới cụ thể (Cheese, Peas); lớp nào cũng là một Object

class Item { }                          // tương đối trừu tượng: không ai mua "một món hàng" chung chung
class Food extends Item { }
class Perishable extends Food { }       // mau hỏng
class Frozen extends Food { }           // bảo quản đông lạnh
class Cheese extends Perishable { }     // cụ thể: mua được một miếng phô mai
class Peas extends Frozen { }

public class ThucPhamPhanCap {
    static void printChain(Object o) {
        StringBuilder sb = new StringBuilder();
        for (Class&lt;?&gt; c = o.getClass(); c != null; c = c.getSuperclass()) {   // đi ngược lên: lớp -&gt; lớp cha -&gt; ... -&gt; Object
            if (sb.length() &gt; 0) sb.append(" is-a ");
            sb.append(c.getSimpleName());
        }
        System.out.println(sb);
    }

    public static void main(String[] args) {
        printChain(new Cheese());
        printChain(new Peas());
        Item basket = new Cheese();                       // Cheese đứng được ở chỗ cần Item
        System.out.println("basket instanceof Food   : " + (basket instanceof Food));
        System.out.println("basket instanceof Frozen : " + (basket instanceof Frozen));
    }
}</code></pre>
<div class="out">Cheese is-a Perishable is-a Food is-a Item is-a Object<br>
Peas is-a Frozen is-a Food is-a Item is-a Object<br>
basket instanceof Food &nbsp;&nbsp;: true<br>
basket instanceof Frozen : false</div>
<p>Để ý chữ cuối của mỗi chuỗi: <code>Object</code>. Lớp Java nào cũng có cha; không viết gì thì cha là <code>java.lang.Object</code> (slide 8). Và một <code>Cheese</code> cất trong biến <code>Item</code> là một <code>Food</code> nhưng không phải một <code>Frozen</code> — một đối tượng là thể hiện của lớp của nó và của mọi lớp phía trên, không bao giờ của một nhánh anh em.</p>
<p class="meo">🧠 Ba cặp tên, một nghĩa: cha = cơ sở = lớp <strong>super</strong>; con = dẫn xuất = lớp <strong>sub</strong>. Từ khoá Java dùng chữ "super" (<code>super(...)</code>) và API dùng chữ "superclass" (<code>getSuperclass()</code>).</p>`],
      [4, 'Object-Oriented Relationships',
        `<p class="y-chinh">🎯 Two common relationships between classes: <strong>"is-a / a kind of"</strong> (Student is a Person) and <strong>"has-a"</strong> (a home has a family). One sentence can contain both: "A home <em>is a</em> house that <em>has a</em> family and a pet."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/13d49262396d1dcd0af759c75a2ae1be86f502e9.svg" alt="Slide 4 in UML: Home is a House (triangle) and has a Family and a Pet (diamonds); Invoice and Product, many to many" loading="lazy" /><p class="chu-thich">🧩 Slide 4 in UML: Home is a House (triangle) and has a Family and a Pet (diamonds); Invoice and Product, many to many</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 4 in UML — one "is-a" and three "has-a"
' Left: Home is a House that has a Family and a Pet. Right: Invoice and Product, many to many
hide empty members
package "A home is a house that has a family and a pet" {
  class House {
    # address : String
  }
  class Home
  class Family
  class Pet
  House &lt;|-- Home : is-a
  Home o-- "1" Family : has-a
  Home o-- "0..1" Pet : has-a
}
package "An invoice contains some products" {
  class Invoice
  class Product
  Invoice "*" -- "*" Product : contains &gt;
}
@enduml</code></pre></details>
<p>The third example is a different kind of has-a: "an invoice contains some products, and a product can be contained in some invoices" — a <strong>many-to-many</strong> association, each side keeping a list of the other. In Java, is-a becomes <code>extends</code>; has-a becomes a <strong>field</strong>:</p>
<pre class="trich"><code class="language-java">class House {
    protected String address;
    House(String address) { this.address = address; }
}

class Family {
    private final String surname;
    Family(String surname) { this.surname = surname; }
    String getSurname() { return surname; }
}

class Pet {
    private final String name;
    Pet(String name) { this.name = name; }
    String getName() { return name; }
}

class Home extends House {              // is-a: a Home IS a House
    private Family family;              // has-a: a field
    private Pet pet;                    // has-a: another field
    Home(String address, Family family, Pet pet) {
        super(address);                 // the House part is built by House
        this.family = family;
        this.pet = pet;
    }
    String describe() {
        return "Home at " + address + ": the " + family.getSurname() + " family and their pet " + pet.getName();
    }
}</code></pre>
<pre><code class="language-java">// release: 8
// Slide 4: "A home is a house that has a family and a pet" = one is-a + two has-a; invoice-product = many-to-many has-a
import java.util.ArrayList;
import java.util.List;

class House {
    protected String address;
    House(String address) { this.address = address; }
}

class Family {
    private final String surname;
    Family(String surname) { this.surname = surname; }
    String getSurname() { return surname; }
}

class Pet {
    private final String name;
    Pet(String name) { this.name = name; }
    String getName() { return name; }
}

class Home extends House {              // is-a: a Home IS a House
    private Family family;              // has-a: a field
    private Pet pet;                    // has-a: another field
    Home(String address, Family family, Pet pet) {
        super(address);                 // the House part is built by House
        this.family = family;
        this.pet = pet;
    }
    String describe() {
        return "Home at " + address + ": the " + family.getSurname() + " family and their pet " + pet.getName();
    }
}

class Product {
    private final String name;
    private final List&lt;Invoice&gt; invoices = new ArrayList&lt;&gt;();   // a product can be in SOME invoices
    Product(String name) { this.name = name; }
    String getName() { return name; }
    void addInvoice(Invoice i) { invoices.add(i); }
    int countInvoices() { return invoices.size(); }
}

class Invoice {
    private final String no;
    private final List&lt;Product&gt; products = new ArrayList&lt;&gt;();   // an invoice contains SOME products
    Invoice(String no) { this.no = no; }
    void add(Product p) {
        products.add(p);
        p.addInvoice(this);                                      // keep both sides in step
    }
    String describe() {
        StringBuilder sb = new StringBuilder(no + " contains");
        for (Product p : products) sb.append(" ").append(p.getName());
        return sb.toString();
    }
}

public class QuanHeIsAHasA {
    public static void main(String[] args) {
        Home h = new Home("12 Tran Phu", new Family("Nguyen"), new Pet("Milu"));
        System.out.println(h.describe());
        System.out.println("h instanceof House: " + (h instanceof House));

        Product pen = new Product("Pen"), book = new Product("Book");
        Invoice i1 = new Invoice("INV-1"), i2 = new Invoice("INV-2");
        i1.add(pen); i1.add(book);
        i2.add(pen);
        System.out.println(i1.describe());
        System.out.println(i2.describe());
        System.out.println("Pen is in " + pen.countInvoices() + " invoices, Book in " + book.countInvoices());
    }
}</code></pre>
<div class="out">Home at 12 Tran Phu: the Nguyen family and their pet Milu<br>
h instanceof House: true<br>
INV-1 contains Pen Book<br>
INV-2 contains Pen<br>
Pen is in 2 invoices, Book in 1</div>
<p><code>Invoice.add</code> also tells the product about the invoice, so both sides stay consistent — the code version of "a product can be contained in some invoices".</p>
<div class="pitfall">Design trap: never use <code>extends</code> just to "get" some fields. "A home is a family" is false, so <code>Home extends Family</code> is wrong even though it would compile. Interviewers call this rule <strong>composition over inheritance</strong>: if the sentence "X is a Y" sounds wrong, Y must be a field.</div>`,
        `<p class="y-chinh">🎯 Hai quan hệ phổ biến giữa các lớp: <strong>"is-a / là một loại"</strong> (Student là một Person) và <strong>"has-a / có một"</strong> (một tổ ấm có một gia đình). Một câu có thể chứa cả hai: "Tổ ấm <em>là một</em> ngôi nhà <em>có một</em> gia đình và một thú cưng."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/13d49262396d1dcd0af759c75a2ae1be86f502e9.svg" alt="Slide 4 bằng UML: Home là một House (tam giác) và có một Family và một Pet (hình thoi); Invoice và Product, nhiều-nhiều" loading="lazy" /><p class="chu-thich">🧩 Slide 4 bằng UML: Home là một House (tam giác) và có một Family và một Pet (hình thoi); Invoice và Product, nhiều-nhiều</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 4 in UML — one "is-a" and three "has-a"
' Trái: Home là House có Family và Pet. Phải: Invoice và Product, nhiều-nhiều
hide empty members
package "A home is a house that has a family and a pet" {
  class House {
    # address : String
  }
  class Home
  class Family
  class Pet
  House &lt;|-- Home : is-a
  Home o-- "1" Family : has-a
  Home o-- "0..1" Pet : has-a
}
package "An invoice contains some products" {
  class Invoice
  class Product
  Invoice "*" -- "*" Product : contains &gt;
}
@enduml</code></pre></details>
<p>Ví dụ thứ ba là một kiểu has-a khác: "một hoá đơn chứa vài sản phẩm, và một sản phẩm có thể nằm trong vài hoá đơn" — một <strong>liên kết nhiều-nhiều (many-to-many association)</strong>, mỗi bên giữ một danh sách bên kia. Trong Java, is-a thành <code>extends</code>; has-a thành một <strong>trường (field)</strong>:</p>
<pre class="trich"><code class="language-java">class House {
    protected String address;
    House(String address) { this.address = address; }
}

class Family {
    private final String surname;
    Family(String surname) { this.surname = surname; }
    String getSurname() { return surname; }
}

class Pet {
    private final String name;
    Pet(String name) { this.name = name; }
    String getName() { return name; }
}

class Home extends House {              // is-a: Home LÀ MỘT House
    private Family family;              // has-a: một trường
    private Pet pet;                    // has-a: thêm một trường
    Home(String address, Family family, Pet pet) {
        super(address);                 // phần House do House dựng
        this.family = family;
        this.pet = pet;
    }
    String describe() {
        return "Home at " + address + ": the " + family.getSurname() + " family and their pet " + pet.getName();
    }
}</code></pre>
<pre><code class="language-java">// release: 8
// Slide 4: "Tổ ấm là một ngôi nhà có một gia đình và một thú cưng" = một is-a + hai has-a; hoá đơn - sản phẩm = has-a nhiều-nhiều
import java.util.ArrayList;
import java.util.List;

class House {
    protected String address;
    House(String address) { this.address = address; }
}

class Family {
    private final String surname;
    Family(String surname) { this.surname = surname; }
    String getSurname() { return surname; }
}

class Pet {
    private final String name;
    Pet(String name) { this.name = name; }
    String getName() { return name; }
}

class Home extends House {              // is-a: Home LÀ MỘT House
    private Family family;              // has-a: một trường
    private Pet pet;                    // has-a: thêm một trường
    Home(String address, Family family, Pet pet) {
        super(address);                 // phần House do House dựng
        this.family = family;
        this.pet = pet;
    }
    String describe() {
        return "Home at " + address + ": the " + family.getSurname() + " family and their pet " + pet.getName();
    }
}

class Product {
    private final String name;
    private final List&lt;Invoice&gt; invoices = new ArrayList&lt;&gt;();   // một sản phẩm có thể nằm trong VÀI hoá đơn
    Product(String name) { this.name = name; }
    String getName() { return name; }
    void addInvoice(Invoice i) { invoices.add(i); }
    int countInvoices() { return invoices.size(); }
}

class Invoice {
    private final String no;
    private final List&lt;Product&gt; products = new ArrayList&lt;&gt;();   // một hoá đơn chứa VÀI sản phẩm
    Invoice(String no) { this.no = no; }
    void add(Product p) {
        products.add(p);
        p.addInvoice(this);                                      // giữ hai phía khớp nhau
    }
    String describe() {
        StringBuilder sb = new StringBuilder(no + " contains");
        for (Product p : products) sb.append(" ").append(p.getName());
        return sb.toString();
    }
}

public class QuanHeIsAHasA {
    public static void main(String[] args) {
        Home h = new Home("12 Tran Phu", new Family("Nguyen"), new Pet("Milu"));
        System.out.println(h.describe());
        System.out.println("h instanceof House: " + (h instanceof House));

        Product pen = new Product("Pen"), book = new Product("Book");
        Invoice i1 = new Invoice("INV-1"), i2 = new Invoice("INV-2");
        i1.add(pen); i1.add(book);
        i2.add(pen);
        System.out.println(i1.describe());
        System.out.println(i2.describe());
        System.out.println("Pen is in " + pen.countInvoices() + " invoices, Book in " + book.countInvoices());
    }
}</code></pre>
<div class="out">Home at 12 Tran Phu: the Nguyen family and their pet Milu<br>
h instanceof House: true<br>
INV-1 contains Pen Book<br>
INV-2 contains Pen<br>
Pen is in 2 invoices, Book in 1</div>
<p><code>Invoice.add</code> còn báo cho sản phẩm biết về hoá đơn, nên hai phía luôn khớp — bản code của câu "một sản phẩm có thể nằm trong vài hoá đơn".</p>
<div class="pitfall">Bẫy thiết kế: đừng bao giờ dùng <code>extends</code> chỉ để "lấy" vài trường. "Tổ ấm là một gia đình" là sai, nên <code>Home extends Family</code> là sai dù vẫn biên dịch được. Người phỏng vấn gọi luật này là <strong>composition over inheritance</strong> (ưu tiên kết hợp hơn kế thừa): câu "X là một Y" nghe sai thì Y phải là một trường.</div>`],
      [5, 'Object-Oriented Relationships…',
        `<p class="y-chinh">🎯 The slide's diagram: Professor and Student <strong>are</strong> Persons — "is-a" is implemented as a <strong>subclass</strong>, and subclasses inherit the structure of the superclass; Professor <strong>teaches</strong> Students — "has-a" is implemented as a <strong>reference</strong>: Professor has the field <code>Student[] students</code>, Student has the field <code>Professor pr</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/68e77b018d81fa73778793514913b285f5ccb205.svg" alt="Slide 5 in standard UML: two generalizations and one association with multiplicities" loading="lazy" /><p class="chu-thich">🧩 Slide 5 in standard UML: two generalizations and one association with multiplicities</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 5 in standard UML — generalization (is a) and association (teach)
' Hollow triangle = extends; plain line with multiplicities = each side holds references
class Person {
  - name : String
  - address : String
  - birthDate : String
  + getName() : String
  + setName(n : String) : void
}
class Professor {
  - department : String
  - students : Student[]
  + getDepartment() : String
  + setDepartment(d : String) : void
  + teach(s : Student) : void
}
class Student {
  - studentId : String
  - majorField : String
  - degreeSought : String
  - pr : Professor
  + getStudentId() : String
  + setStudentId(id : String) : void
}
Person &lt;|-- Professor
Person &lt;|-- Student
Professor "pr 0..1" -- "students 0..*" Student : teach &gt;
@enduml</code></pre></details>
<p>Two differences from the slide's picture: UML draws the "teach" link as a plain line with <strong>multiplicities</strong> (one professor, many students) instead of a filled dot, and the slide's <code>getStudentId()</code>/<code>setStudentID()</code> mix two spellings — Java names are case-sensitive, so pick one (<code>setStudentId</code>). The code:</p>
<pre class="trich"><code class="language-java">class Person {
    private String name, address;           // "-" in the diagram = private
    private String birthDate;
    Person(String name, String address, String birthDate) {
        this.name = name; this.address = address; this.birthDate = birthDate;
    }
    public String getName() { return name; }
    public void setName(String n) { name = n; }
}

class Professor extends Person {
    private String department;
    private Student[] students = new Student[10];   // has-a: "The class Professor has the field Student[] students"
    private int count = 0;
    Professor(String name, String address, String birthDate, String department) {
        super(name, address, birthDate);
        this.department = department;
    }
    public String getDepartment() { return department; }
    public void teach(Student s) {                  // the "teach" link of the diagram
        students[count++] = s;
        s.setProfessor(this);                       // keep the other side consistent
    }
    public void printClass() {
        System.out.println(getName() + " (" + department + ") teaches " + count + " students:");
        for (int i = 0; i &lt; count; i++) System.out.println("  - " + students[i].getStudentId() + " " + students[i].getName());
    }
}

class Student extends Person {
    private String studentId, majorField;
    private String degreeSought;
    private Professor pr;                           // has-a: "The class Student has the field Professor pr"
    Student(String name, String address, String birthDate, String studentId, String majorField) {
        super(name, address, birthDate);
        this.studentId = studentId; this.majorField = majorField; this.degreeSought = "Bachelor";
    }
    public String getStudentId() { return studentId; }
    public void setStudentId(String id) { studentId = id; }
    void setProfessor(Professor p) { pr = p; }
    public Professor getProfessor() { return pr; }
}</code></pre>
<pre><code class="language-java">// release: 8
// Slide 5: Professor and Student are-a Person (is-a = extends); Professor teaches Students (has-a = references both ways)

class Person {
    private String name, address;           // "-" in the diagram = private
    private String birthDate;
    Person(String name, String address, String birthDate) {
        this.name = name; this.address = address; this.birthDate = birthDate;
    }
    public String getName() { return name; }
    public void setName(String n) { name = n; }
}

class Professor extends Person {
    private String department;
    private Student[] students = new Student[10];   // has-a: "The class Professor has the field Student[] students"
    private int count = 0;
    Professor(String name, String address, String birthDate, String department) {
        super(name, address, birthDate);
        this.department = department;
    }
    public String getDepartment() { return department; }
    public void teach(Student s) {                  // the "teach" link of the diagram
        students[count++] = s;
        s.setProfessor(this);                       // keep the other side consistent
    }
    public void printClass() {
        System.out.println(getName() + " (" + department + ") teaches " + count + " students:");
        for (int i = 0; i &lt; count; i++) System.out.println("  - " + students[i].getStudentId() + " " + students[i].getName());
    }
}

class Student extends Person {
    private String studentId, majorField;
    private String degreeSought;
    private Professor pr;                           // has-a: "The class Student has the field Professor pr"
    Student(String name, String address, String birthDate, String studentId, String majorField) {
        super(name, address, birthDate);
        this.studentId = studentId; this.majorField = majorField; this.degreeSought = "Bachelor";
    }
    public String getStudentId() { return studentId; }
    public void setStudentId(String id) { studentId = id; }
    void setProfessor(Professor p) { pr = p; }
    public Professor getProfessor() { return pr; }
}

public class NguoiGiaoSuSinhVien {
    public static void main(String[] args) {
        Professor p = new Professor("Dr. Lan", "Ha Noi", "1980-02-01", "Software Engineering");
        Student a = new Student("An", "Hue", "2006-05-10", "HE190001", "SE");
        Student b = new Student("Binh", "Da Nang", "2006-09-21", "HE190002", "SE");
        p.teach(a);
        p.teach(b);
        p.printClass();
        System.out.println(b.getName() + "'s professor: " + b.getProfessor().getName());   // getName() inherited from Person
        Person[] people = { p, a, b };                       // both subclasses fit in a Person[]
        System.out.println("people in the Person[]: " + people.length);
    }
}</code></pre>
<div class="out">Dr. Lan (Software Engineering) teaches 2 students:<br>
&nbsp;&nbsp;- HE190001 An<br>
&nbsp;&nbsp;- HE190002 Binh<br>
Binh's professor: Dr. Lan<br>
people in the Person[]: 3</div>
<p>Look at what each subclass did <em>not</em> write: <code>name</code>, <code>address</code>, <code>getName()</code>. They come from <code>Person</code>. Because <code>name</code> is <code>private</code> ("-" in the diagram), <code>Professor</code> reaches it only through the inherited <code>getName()</code>; and its constructor passes the three values up with <code>super(...)</code> (slide 9).</p>
<p class="meo">🧠 Count fields like the FU material does: a <code>Student</code> object holds <strong>7</strong> fields — 3 inherited from <code>Person</code> + 4 of its own — even though its class declares only 4.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ trên slide: Professor và Student <strong>là</strong> Person — "is-a" được hiện thực bằng <strong>lớp con</strong>, và lớp con kế thừa cấu trúc của lớp cha; Professor <strong>dạy (teach)</strong> các Student — "has-a" được hiện thực bằng <strong>tham chiếu (reference)</strong>: Professor có trường <code>Student[] students</code>, Student có trường <code>Professor pr</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/68e77b018d81fa73778793514913b285f5ccb205.svg" alt="Slide 5 bằng UML chuẩn: hai quan hệ tổng quát hoá và một liên kết có bội số" loading="lazy" /><p class="chu-thich">🧩 Slide 5 bằng UML chuẩn: hai quan hệ tổng quát hoá và một liên kết có bội số</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 5 in standard UML — generalization (is a) and association (teach)
' Tam giác rỗng = extends; đường thẳng có bội số = mỗi bên giữ tham chiếu
class Person {
  - name : String
  - address : String
  - birthDate : String
  + getName() : String
  + setName(n : String) : void
}
class Professor {
  - department : String
  - students : Student[]
  + getDepartment() : String
  + setDepartment(d : String) : void
  + teach(s : Student) : void
}
class Student {
  - studentId : String
  - majorField : String
  - degreeSought : String
  - pr : Professor
  + getStudentId() : String
  + setStudentId(id : String) : void
}
Person &lt;|-- Professor
Person &lt;|-- Student
Professor "pr 0..1" -- "students 0..*" Student : teach &gt;
@enduml</code></pre></details>
<p>Hai chỗ khác hình trên slide: UML vẽ đường "teach" là một đường thẳng có <strong>bội số (multiplicity)</strong> (một giảng viên, nhiều sinh viên) chứ không phải chấm tròn đặc, và slide trộn hai cách viết <code>getStudentId()</code>/<code>setStudentID()</code> — tên Java phân biệt hoa thường, nên chọn một (<code>setStudentId</code>). Code:</p>
<pre class="trich"><code class="language-java">class Person {
    private String name, address;           // dấu "-" trên sơ đồ = private
    private String birthDate;
    Person(String name, String address, String birthDate) {
        this.name = name; this.address = address; this.birthDate = birthDate;
    }
    public String getName() { return name; }
    public void setName(String n) { name = n; }
}

class Professor extends Person {
    private String department;
    private Student[] students = new Student[10];   // has-a: Professor có trường Student[] students
    private int count = 0;
    Professor(String name, String address, String birthDate, String department) {
        super(name, address, birthDate);
        this.department = department;
    }
    public String getDepartment() { return department; }
    public void teach(Student s) {                  // đường "teach" trên sơ đồ
        students[count++] = s;
        s.setProfessor(this);                       // giữ phía bên kia khớp
    }
    public void printClass() {
        System.out.println(getName() + " (" + department + ") teaches " + count + " students:");
        for (int i = 0; i &lt; count; i++) System.out.println("  - " + students[i].getStudentId() + " " + students[i].getName());
    }
}

class Student extends Person {
    private String studentId, majorField;
    private String degreeSought;
    private Professor pr;                           // has-a: Student có trường Professor pr
    Student(String name, String address, String birthDate, String studentId, String majorField) {
        super(name, address, birthDate);
        this.studentId = studentId; this.majorField = majorField; this.degreeSought = "Bachelor";
    }
    public String getStudentId() { return studentId; }
    public void setStudentId(String id) { studentId = id; }
    void setProfessor(Professor p) { pr = p; }
    public Professor getProfessor() { return pr; }
}</code></pre>
<pre><code class="language-java">// release: 8
// Slide 5: Professor và Student là Person (is-a = extends); Professor dạy Student (has-a = tham chiếu hai chiều)

class Person {
    private String name, address;           // dấu "-" trên sơ đồ = private
    private String birthDate;
    Person(String name, String address, String birthDate) {
        this.name = name; this.address = address; this.birthDate = birthDate;
    }
    public String getName() { return name; }
    public void setName(String n) { name = n; }
}

class Professor extends Person {
    private String department;
    private Student[] students = new Student[10];   // has-a: Professor có trường Student[] students
    private int count = 0;
    Professor(String name, String address, String birthDate, String department) {
        super(name, address, birthDate);
        this.department = department;
    }
    public String getDepartment() { return department; }
    public void teach(Student s) {                  // đường "teach" trên sơ đồ
        students[count++] = s;
        s.setProfessor(this);                       // giữ phía bên kia khớp
    }
    public void printClass() {
        System.out.println(getName() + " (" + department + ") teaches " + count + " students:");
        for (int i = 0; i &lt; count; i++) System.out.println("  - " + students[i].getStudentId() + " " + students[i].getName());
    }
}

class Student extends Person {
    private String studentId, majorField;
    private String degreeSought;
    private Professor pr;                           // has-a: Student có trường Professor pr
    Student(String name, String address, String birthDate, String studentId, String majorField) {
        super(name, address, birthDate);
        this.studentId = studentId; this.majorField = majorField; this.degreeSought = "Bachelor";
    }
    public String getStudentId() { return studentId; }
    public void setStudentId(String id) { studentId = id; }
    void setProfessor(Professor p) { pr = p; }
    public Professor getProfessor() { return pr; }
}

public class NguoiGiaoSuSinhVien {
    public static void main(String[] args) {
        Professor p = new Professor("Dr. Lan", "Ha Noi", "1980-02-01", "Software Engineering");
        Student a = new Student("An", "Hue", "2006-05-10", "HE190001", "SE");
        Student b = new Student("Binh", "Da Nang", "2006-09-21", "HE190002", "SE");
        p.teach(a);
        p.teach(b);
        p.printClass();
        System.out.println(b.getName() + "'s professor: " + b.getProfessor().getName());   // getName() kế thừa từ Person
        Person[] people = { p, a, b };                       // cả hai lớp con vừa với một Person[]
        System.out.println("people in the Person[]: " + people.length);
    }
}</code></pre>
<div class="out">Dr. Lan (Software Engineering) teaches 2 students:<br>
&nbsp;&nbsp;- HE190001 An<br>
&nbsp;&nbsp;- HE190002 Binh<br>
Binh's professor: Dr. Lan<br>
people in the Person[]: 3</div>
<p>Nhìn thứ mỗi lớp con <em>không</em> phải viết: <code>name</code>, <code>address</code>, <code>getName()</code>. Chúng đến từ <code>Person</code>. Vì <code>name</code> là <code>private</code> (dấu "-" trên sơ đồ), <code>Professor</code> chỉ chạm tới nó qua <code>getName()</code> được kế thừa; còn constructor của nó đẩy ba giá trị lên cha bằng <code>super(...)</code> (slide 9).</p>
<p class="meo">🧠 Đếm trường như học liệu FU: một đối tượng <code>Student</code> giữ <strong>7</strong> trường — 3 kế thừa từ <code>Person</code> + 4 của riêng nó — dù lớp của nó chỉ khai báo 4.</p>`],
      [6, 'Inheritance…',
        `<p class="y-chinh">🎯 How to construct a class hierarchy? Take the <strong>intersection</strong>: Rectangle has ⟨length, width⟩, Box has ⟨length, width, height⟩; the common part ⟨length, width⟩ is Rectangle itself, so Box = Rectangle + height.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/3daf3e67a0180d366e3b25cb59cff8d8d63d8d66.svg" alt="Slides 6, 10, 11: Rectangle and Box with all their members, as the code of slides 10–11 writes them" loading="lazy" /><p class="chu-thich">🧩 Slides 6, 10, 11: Rectangle and Box with all their members, as the code of slides 10–11 writes them</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 6, 10, 11 — Box keeps only what Rectangle does not have
' Box inherits length and width; it adds height and volumn(), and overrides toString() and area()
class Rectangle {
  - length : int = 0
  - width : int = 0
  + Rectangle()
  + Rectangle(l : int, w : int)
  + getLength() : int
  + setLength(length : int) : void
  + getWidth() : int
  + setWidth(width : int) : void
  + area() : int
  + toString() : String
}
class Box {
  - height : int = 0
  + Box()
  + Box(l : int, w : int, h : int)
  + getHeight() : int
  + setHeight(height : int) : void
  + area() : int
  + volumn() : int
  + toString() : String
}
Rectangle &lt;|-- Box
note right of Box
  area() and toString() are overridden;
  volumn() is new (the slide's spelling)
end note
@enduml</code></pre></details>
<p>The method is mechanical, which is why it works in an exam: (1) list the fields of each class; (2) the fields that appear in <strong>all</strong> of them form the superclass; (3) each subclass keeps the rest. If the intersection is itself one of the classes (as here — Rectangle), that class becomes the parent; otherwise you invent a new one (slide 7's <code>Item</code>).</p>
<div class="pitfall">Mathematically a box is not "a kind of rectangle" — it is a 3D solid. The slide's hierarchy is a <strong>code-reuse</strong> choice, and it shows: <code>Box.area()</code> in slide 11 has to change meaning (surface area). Many textbooks prefer <code>Box</code> <em>has a</em> base <code>Rectangle</code>. For the PE, follow the class diagram you are given exactly.</div>`,
        `<p class="y-chinh">🎯 Dựng cây phân cấp thế nào? Lấy <strong>phần giao (intersection)</strong>: Rectangle có ⟨length, width⟩, Box có ⟨length, width, height⟩; phần chung ⟨length, width⟩ chính là Rectangle, nên Box = Rectangle + height.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/3daf3e67a0180d366e3b25cb59cff8d8d63d8d66.svg" alt="Slide 6, 10, 11: Rectangle và Box đầy đủ thành viên, đúng như code slide 10–11 viết" loading="lazy" /><p class="chu-thich">🧩 Slide 6, 10, 11: Rectangle và Box đầy đủ thành viên, đúng như code slide 10–11 viết</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 6, 10, 11 — Box keeps only what Rectangle does not have
' Box kế thừa length và width; nó thêm height và volumn(), và ghi đè toString(), area()
class Rectangle {
  - length : int = 0
  - width : int = 0
  + Rectangle()
  + Rectangle(l : int, w : int)
  + getLength() : int
  + setLength(length : int) : void
  + getWidth() : int
  + setWidth(width : int) : void
  + area() : int
  + toString() : String
}
class Box {
  - height : int = 0
  + Box()
  + Box(l : int, w : int, h : int)
  + getHeight() : int
  + setHeight(height : int) : void
  + area() : int
  + volumn() : int
  + toString() : String
}
Rectangle &lt;|-- Box
note right of Box
  area() and toString() are overridden;
  volumn() is new (the slide's spelling)
end note
@enduml</code></pre></details>
<p>Cách làm này máy móc, nên dùng được trong phòng thi: (1) liệt kê trường của từng lớp; (2) các trường xuất hiện ở <strong>tất cả</strong> các lớp tạo thành lớp cha; (3) mỗi lớp con giữ phần còn lại. Nếu phần giao trùng đúng một lớp (như ở đây — Rectangle), lớp đó làm cha; nếu không, bạn đặt ra một lớp mới (<code>Item</code> ở slide 7).</p>
<div class="pitfall">Về toán học hình hộp không phải "một loại hình chữ nhật" — nó là khối 3 chiều. Cây phân cấp trên slide là lựa chọn để <strong>dùng lại code</strong>, và hậu quả lộ ra ngay: <code>Box.area()</code> ở slide 11 phải đổi nghĩa (thành diện tích toàn phần). Nhiều sách thích cách <code>Box</code> <em>có một</em> đáy <code>Rectangle</code> hơn. Với PE, cứ theo đúng sơ đồ lớp đề cho.</div>`],
      [7, 'Inheritance…',
        `<p class="y-chinh">🎯 The same method on a bigger example: a shop sells antique <strong>vases, statues and paintings</strong>. Written separately, all three repeat <code>value</code> and <code>creator</code>; the intersection becomes the superclass <code>Item</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7ac299800ef2945e9f2d00a4465ad4e0a5cbba94.svg" alt="Slide 7, top half: three separate classes — value and creator written three times" loading="lazy" /><p class="chu-thich">🧩 Slide 7, top half: three separate classes — value and creator written three times</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 7, step 1 — three classes written separately (value and creator repeated three times)
' Before factoring: every class repeats value and creator
class Vase {
  value : int
  height : int
  material : String
  creator : String
}
class Statue {
  value : int
  weight : int
  creator : String
  colour : String
}
class Painting {
  value : int
  height : int
  width : int
  isWatercolour : boolean
  isFramed : boolean
  creator : String
}
hide methods
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/3d4eac41c0501346f126b6da80cff04923c752ee.svg" alt="Slide 7, bottom half: value and creator moved up into Item; each subclass keeps only its own fields" loading="lazy" /><p class="chu-thich">🧩 Slide 7, bottom half: value and creator moved up into Item; each subclass keeps only its own fields</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 7, step 2 — the intersection becomes the superclass Item
' After factoring: value and creator live once, in Item
class Item {
  - value : int
  - creator : String
  + Item(value : int, creator : String)
  + getValue() : int
  + getCreator() : String
  + toString() : String
}
class Vase {
  - height : int
  - material : String
}
class Statue {
  - weight : int
  - colour : String
}
class Painting {
  - height : int
  - width : int
  - isWatercolour : boolean
  - isFramed : boolean
}
Item &lt;|-- Vase
Item &lt;|-- Statue
Item &lt;|-- Painting
hide Vase methods
hide Statue methods
hide Painting methods
@enduml</code></pre></details>
<p>This is the exact shape of PE question 2 and of the new 10-mark papers (an abstract <code>Device</code> with <code>SmartPhone</code> — PE3; <code>Task</code> with <code>WorkTask</code>/<code>PersonalTask</code> — PE5). In code, each subclass constructor hands the common values to <code>Item</code>, and each <code>toString()</code> reuses Item's part with <code>super.toString()</code>:</p>
<pre class="trich"><code class="language-java">class Vase extends Item {
    private int height;
    private String material;
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);                       // Item fills value and creator
        this.height = height;
        this.material = material;
    }
    @Override
    public String toString() { return "Vase[" + super.toString() + ", height=" + height + ", material=" + material + "]"; }
}

class Statue extends Item {
    private int weight;
    private String colour;
    public Statue(int value, String creator, int weight, String colour) {
        super(value, creator);
        this.weight = weight;
        this.colour = colour;
    }
    @Override
    public String toString() { return "Statue[" + super.toString() + ", weight=" + weight + ", colour=" + colour + "]"; }
}

class Painting extends Item {
    private int height, width;
    private boolean isWatercolour, isFramed;
    public Painting(int value, String creator, int height, int width, boolean isWatercolour, boolean isFramed) {
        super(value, creator);
        this.height = height; this.width = width;
        this.isWatercolour = isWatercolour; this.isFramed = isFramed;
    }
    @Override
    public String toString() {
        return "Painting[" + super.toString() + ", " + height + "x" + width
            + (isWatercolour ? ", watercolour" : ", oil") + (isFramed ? ", framed" : "") + "]";
    }
}</code></pre>
<pre><code class="language-java">// release: 8
// Slide 7: the antique shop — the common fields (value, creator) go up into Item; each subclass keeps only what is its own

class Item {
    private int value;
    private String creator;
    public Item(int value, String creator) {
        this.value = value;
        this.creator = creator;
    }
    public int getValue() { return value; }
    public String getCreator() { return creator; }
    @Override
    public String toString() { return "value=" + value + ", creator=" + creator; }
}

class Vase extends Item {
    private int height;
    private String material;
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);                       // Item fills value and creator
        this.height = height;
        this.material = material;
    }
    @Override
    public String toString() { return "Vase[" + super.toString() + ", height=" + height + ", material=" + material + "]"; }
}

class Statue extends Item {
    private int weight;
    private String colour;
    public Statue(int value, String creator, int weight, String colour) {
        super(value, creator);
        this.weight = weight;
        this.colour = colour;
    }
    @Override
    public String toString() { return "Statue[" + super.toString() + ", weight=" + weight + ", colour=" + colour + "]"; }
}

class Painting extends Item {
    private int height, width;
    private boolean isWatercolour, isFramed;
    public Painting(int value, String creator, int height, int width, boolean isWatercolour, boolean isFramed) {
        super(value, creator);
        this.height = height; this.width = width;
        this.isWatercolour = isWatercolour; this.isFramed = isFramed;
    }
    @Override
    public String toString() {
        return "Painting[" + super.toString() + ", " + height + "x" + width
            + (isWatercolour ? ", watercolour" : ", oil") + (isFramed ? ", framed" : "") + "]";
    }
}

public class CuaHangCoVat {
    public static void main(String[] args) {
        Item[] shop = {
            new Vase(100, "Paris", 200, "rock"),
            new Statue(200, "VN", 1000, "white"),
            new Painting(300, "USA", 2000, 1500, true, true)
        };
        int total = 0;
        for (Item it : shop) {
            System.out.println(it);                  // println calls each object's own toString()
            total += it.getValue();                  // getValue() is written ONCE, in Item
        }
        System.out.println("Total value: " + total);
    }
}</code></pre>
<div class="out">Vase[value=100, creator=Paris, height=200, material=rock]<br>
Statue[value=200, creator=VN, weight=1000, colour=white]<br>
Painting[value=300, creator=USA, 2000x1500, watercolour, framed]<br>
Total value: 600</div>
<p>The loop works on an <code>Item[]</code> yet prints three different formats, and <code>getValue()</code> — written once in <code>Item</code> — serves all three. Both are the payoff of the hierarchy; the 🧪 practice lesson turns this into a full menu program.</p>`,
        `<p class="y-chinh">🎯 Cùng cách đó trên ví dụ lớn hơn: một cửa hàng bán đồ cổ gồm <strong>bình (vase), tượng (statue) và tranh (painting)</strong>. Viết riêng thì cả ba đều lặp lại <code>value</code> và <code>creator</code>; phần giao trở thành lớp cha <code>Item</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7ac299800ef2945e9f2d00a4465ad4e0a5cbba94.svg" alt="Slide 7, nửa trên: ba lớp viết riêng — value và creator viết ba lần" loading="lazy" /><p class="chu-thich">🧩 Slide 7, nửa trên: ba lớp viết riêng — value và creator viết ba lần</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 7, step 1 — three classes written separately (value and creator repeated three times)
' Trước khi rút gọn: lớp nào cũng lặp lại value và creator
class Vase {
  value : int
  height : int
  material : String
  creator : String
}
class Statue {
  value : int
  weight : int
  creator : String
  colour : String
}
class Painting {
  value : int
  height : int
  width : int
  isWatercolour : boolean
  isFramed : boolean
  creator : String
}
hide methods
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/3d4eac41c0501346f126b6da80cff04923c752ee.svg" alt="Slide 7, nửa dưới: value và creator đưa lên Item; mỗi lớp con chỉ giữ trường của riêng nó" loading="lazy" /><p class="chu-thich">🧩 Slide 7, nửa dưới: value và creator đưa lên Item; mỗi lớp con chỉ giữ trường của riêng nó</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 7, step 2 — the intersection becomes the superclass Item
' Sau khi rút gọn: value và creator chỉ nằm một chỗ, trong Item
class Item {
  - value : int
  - creator : String
  + Item(value : int, creator : String)
  + getValue() : int
  + getCreator() : String
  + toString() : String
}
class Vase {
  - height : int
  - material : String
}
class Statue {
  - weight : int
  - colour : String
}
class Painting {
  - height : int
  - width : int
  - isWatercolour : boolean
  - isFramed : boolean
}
Item &lt;|-- Vase
Item &lt;|-- Statue
Item &lt;|-- Painting
hide Vase methods
hide Statue methods
hide Painting methods
@enduml</code></pre></details>
<p>Đây đúng là hình dạng của câu 2 đề PE và của dạng đề mới 10 điểm (lớp trừu tượng <code>Device</code> với <code>SmartPhone</code> — PE3; <code>Task</code> với <code>WorkTask</code>/<code>PersonalTask</code> — PE5). Trong code, constructor của mỗi lớp con giao các giá trị chung cho <code>Item</code>, và mỗi <code>toString()</code> dùng lại phần của Item bằng <code>super.toString()</code>:</p>
<pre class="trich"><code class="language-java">class Vase extends Item {
    private int height;
    private String material;
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);                       // Item điền value và creator
        this.height = height;
        this.material = material;
    }
    @Override
    public String toString() { return "Vase[" + super.toString() + ", height=" + height + ", material=" + material + "]"; }
}

class Statue extends Item {
    private int weight;
    private String colour;
    public Statue(int value, String creator, int weight, String colour) {
        super(value, creator);
        this.weight = weight;
        this.colour = colour;
    }
    @Override
    public String toString() { return "Statue[" + super.toString() + ", weight=" + weight + ", colour=" + colour + "]"; }
}

class Painting extends Item {
    private int height, width;
    private boolean isWatercolour, isFramed;
    public Painting(int value, String creator, int height, int width, boolean isWatercolour, boolean isFramed) {
        super(value, creator);
        this.height = height; this.width = width;
        this.isWatercolour = isWatercolour; this.isFramed = isFramed;
    }
    @Override
    public String toString() {
        return "Painting[" + super.toString() + ", " + height + "x" + width
            + (isWatercolour ? ", watercolour" : ", oil") + (isFramed ? ", framed" : "") + "]";
    }
}</code></pre>
<pre><code class="language-java">// release: 8
// Slide 7: cửa hàng đồ cổ — trường chung (value, creator) đưa lên Item; mỗi lớp con chỉ giữ phần riêng của nó

class Item {
    private int value;
    private String creator;
    public Item(int value, String creator) {
        this.value = value;
        this.creator = creator;
    }
    public int getValue() { return value; }
    public String getCreator() { return creator; }
    @Override
    public String toString() { return "value=" + value + ", creator=" + creator; }
}

class Vase extends Item {
    private int height;
    private String material;
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);                       // Item điền value và creator
        this.height = height;
        this.material = material;
    }
    @Override
    public String toString() { return "Vase[" + super.toString() + ", height=" + height + ", material=" + material + "]"; }
}

class Statue extends Item {
    private int weight;
    private String colour;
    public Statue(int value, String creator, int weight, String colour) {
        super(value, creator);
        this.weight = weight;
        this.colour = colour;
    }
    @Override
    public String toString() { return "Statue[" + super.toString() + ", weight=" + weight + ", colour=" + colour + "]"; }
}

class Painting extends Item {
    private int height, width;
    private boolean isWatercolour, isFramed;
    public Painting(int value, String creator, int height, int width, boolean isWatercolour, boolean isFramed) {
        super(value, creator);
        this.height = height; this.width = width;
        this.isWatercolour = isWatercolour; this.isFramed = isFramed;
    }
    @Override
    public String toString() {
        return "Painting[" + super.toString() + ", " + height + "x" + width
            + (isWatercolour ? ", watercolour" : ", oil") + (isFramed ? ", framed" : "") + "]";
    }
}

public class CuaHangCoVat {
    public static void main(String[] args) {
        Item[] shop = {
            new Vase(100, "Paris", 200, "rock"),
            new Statue(200, "VN", 1000, "white"),
            new Painting(300, "USA", 2000, 1500, true, true)
        };
        int total = 0;
        for (Item it : shop) {
            System.out.println(it);                  // println gọi toString() của chính từng đối tượng
            total += it.getValue();                  // getValue() chỉ viết MỘT lần, trong Item
        }
        System.out.println("Total value: " + total);
    }
}</code></pre>
<div class="out">Vase[value=100, creator=Paris, height=200, material=rock]<br>
Statue[value=200, creator=VN, weight=1000, colour=white]<br>
Painting[value=300, creator=USA, 2000x1500, watercolour, framed]<br>
Total value: 600</div>
<p>Vòng lặp chạy trên một <code>Item[]</code> mà in ra ba định dạng khác nhau, còn <code>getValue()</code> — viết một lần trong <code>Item</code> — phục vụ cả ba. Đó là hai món lời của cây phân cấp; bài 🧪 thực hành biến ví dụ này thành một chương trình menu đầy đủ.</p>`],
      [8, 'Inheritance',
        `<p class="y-chinh">🎯 Four rules: (1) <code>extends</code> creates a subclass; (2) a class can be directly derived from <strong>only one</strong> class — Java is single-inheritance; (3) a class with no superclass is implicitly derived from <code>Object</code>; (4) unlike other members, <strong>constructors are not inherited</strong>.</p>
<p>Each rule, checked by the real javac and java of JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== rule 1: a class extends ONE class only ==");
    viet(d, "Shapes.java",
        "class Rectangle { }\\n" +
        "class Shape { }\\n" +
        "class Box extends Rectangle, Shape { }\\n");
    lenh(d, "javac", "Shapes.java");

    System.out.println("== rule 2: no extends means extends Object ==");
    viet(d, "Plain.java",
        "public class Plain {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Plain p = new Plain();\\n" +
        "        System.out.println(p.getClass().getSuperclass());\\n" +
        "        System.out.println(p.toString().startsWith(\\"Plain@\\"));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Plain.java");
    lenh(d, "java", "Plain");

    System.out.println("== rule 3: constructors are NOT inherited ==");
    viet(d, "NoInherit.java",
        "class Rectangle {\\n" +
        "    Rectangle(int l, int w) { }\\n" +
        "}\\n" +
        "class Box extends Rectangle {\\n" +
        "    Box(int l, int w, int h) { super(l, w); }\\n" +
        "}\\n" +
        "public class NoInherit {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Box b = new Box(2, 5);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "NoInherit.java");

    System.out.println("== rule 4: private fields exist in the Box object, but Box code cannot name them ==");
    viet(d, "PrivateField.java",
        "class Rectangle {\\n" +
        "    private int length = 2;\\n" +
        "    public int getLength() { return length; }\\n" +
        "}\\n" +
        "class Box extends Rectangle {\\n" +
        "    int twice() { return length * 2; }\\n" +
        "}\\n");
    lenh(d, "javac", "PrivateField.java");
}</code></pre>
<div class="out">== rule 1: a class extends ONE class only ==<br>
&gt; javac Shapes.java<br>
Shapes.java:3: error: '{' expected<br>
class Box extends Rectangle, Shape { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== rule 2: no extends means extends Object ==<br>
&gt; javac Plain.java<br>
&gt; java Plain<br>
class java.lang.Object<br>
true<br>
== rule 3: constructors are NOT inherited ==<br>
&gt; javac NoInherit.java<br>
NoInherit.java:9: error: constructor Box in class Box cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Box b = new Box(2, 5);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: int,int,int<br>
&nbsp;&nbsp;found: int,int<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)<br>
== rule 4: private fields exist in the Box object, but Box code cannot name them ==<br>
&gt; javac PrivateField.java<br>
PrivateField.java:6: error: length has private access in Rectangle<br>
&nbsp;&nbsp;&nbsp;&nbsp;int twice() { return length * 2; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Read the messages: two parents is a <strong>syntax</strong> error (javac expects <code>{</code> right after one class name); <code>getSuperclass()</code> of a class with no <code>extends</code> is <code>java.lang.Object</code>, which is also where <code>toString()</code> comes from; <code>new Box(2, 5)</code> fails because Box has no two-argument constructor of its own — Rectangle's does not count. Rule 4's sibling: a <code>private</code> field <em>is</em> inside every Box object (it uses memory, <code>getLength()</code> returns it) but Box's own code cannot name it.</p>
<div class="callout">🧭 <strong>Go further — Chapter 5</strong>: "only one superclass" does not mean "only one type". A class can <code>implements</code> many interfaces (deck "Polymorphism", slide 13). That is Java's answer to multiple inheritance.</div>`,
        `<p class="y-chinh">🎯 Bốn luật: (1) <code>extends</code> tạo lớp con; (2) một lớp chỉ được dẫn xuất trực tiếp từ <strong>đúng một</strong> lớp — Java là ngôn ngữ đơn kế thừa (single inheritance); (3) lớp không ghi lớp cha thì ngầm kế thừa <code>Object</code>; (4) khác các thành viên khác, <strong>constructor không được kế thừa</strong>.</p>
<p>Từng luật, kiểm bằng javac và java thật của JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== rule 1: a class extends ONE class only ==");
    viet(d, "Shapes.java",
        "class Rectangle { }\\n" +
        "class Shape { }\\n" +
        "class Box extends Rectangle, Shape { }\\n");
    lenh(d, "javac", "Shapes.java");

    System.out.println("== rule 2: no extends means extends Object ==");
    viet(d, "Plain.java",
        "public class Plain {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Plain p = new Plain();\\n" +
        "        System.out.println(p.getClass().getSuperclass());\\n" +
        "        System.out.println(p.toString().startsWith(\\"Plain@\\"));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Plain.java");
    lenh(d, "java", "Plain");

    System.out.println("== rule 3: constructors are NOT inherited ==");
    viet(d, "NoInherit.java",
        "class Rectangle {\\n" +
        "    Rectangle(int l, int w) { }\\n" +
        "}\\n" +
        "class Box extends Rectangle {\\n" +
        "    Box(int l, int w, int h) { super(l, w); }\\n" +
        "}\\n" +
        "public class NoInherit {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Box b = new Box(2, 5);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "NoInherit.java");

    System.out.println("== rule 4: private fields exist in the Box object, but Box code cannot name them ==");
    viet(d, "PrivateField.java",
        "class Rectangle {\\n" +
        "    private int length = 2;\\n" +
        "    public int getLength() { return length; }\\n" +
        "}\\n" +
        "class Box extends Rectangle {\\n" +
        "    int twice() { return length * 2; }\\n" +
        "}\\n");
    lenh(d, "javac", "PrivateField.java");
}</code></pre>
<div class="out">== rule 1: a class extends ONE class only ==<br>
&gt; javac Shapes.java<br>
Shapes.java:3: error: '{' expected<br>
class Box extends Rectangle, Shape { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== rule 2: no extends means extends Object ==<br>
&gt; javac Plain.java<br>
&gt; java Plain<br>
class java.lang.Object<br>
true<br>
== rule 3: constructors are NOT inherited ==<br>
&gt; javac NoInherit.java<br>
NoInherit.java:9: error: constructor Box in class Box cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Box b = new Box(2, 5);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: int,int,int<br>
&nbsp;&nbsp;found: int,int<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)<br>
== rule 4: private fields exist in the Box object, but Box code cannot name them ==<br>
&gt; javac PrivateField.java<br>
PrivateField.java:6: error: length has private access in Rectangle<br>
&nbsp;&nbsp;&nbsp;&nbsp;int twice() { return length * 2; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Đọc các thông báo: hai lớp cha là lỗi <strong>cú pháp</strong> (javac chờ dấu <code>{</code> ngay sau một tên lớp); <code>getSuperclass()</code> của lớp không có <code>extends</code> là <code>java.lang.Object</code>, cũng là nơi <code>toString()</code> từ đó mà ra; <code>new Box(2, 5)</code> hỏng vì Box không có constructor hai tham số của riêng nó — của Rectangle không tính. Luật anh em của luật 4: một trường <code>private</code> <em>có</em> nằm trong mọi đối tượng Box (nó chiếm bộ nhớ, <code>getLength()</code> trả về nó) nhưng code của chính Box không gọi tên nó được.</p>
<div class="callout">🧭 <strong>Đi tiếp — Chương 5</strong>: "chỉ một lớp cha" không có nghĩa là "chỉ một kiểu". Một lớp <code>implements</code> được nhiều interface (bộ "Polymorphism", slide 13). Đó là câu trả lời của Java cho đa kế thừa.</div>`],
      [9, '"super" Keyword',
        `<p class="y-chinh">🎯 Constructors are not inherited, so a subclass constructor <strong>must invoke a superclass constructor</strong> with <code>super(arguments)</code>, and the call <strong>must be the first statement</strong>. If you write no call, the compiler inserts <code>super()</code> — the <strong>no-argument</strong> one; if the parent has none, you get a compile-time error.</p>
<p>The order this produces — top of the hierarchy first, your class last (summary, slide 17):</p>
<pre class="trich"><code class="language-java">class Item {
    protected int value;
    Item() {                                   // no super() written: the compiler inserts super() -&gt; Object()
        System.out.println("1. Item()            value=" + value);
    }
    Item(int value) {
        this.value = value;
        System.out.println("1. Item(int)         value=" + value);
    }
}

class Vase extends Item {
    protected String material;
    Vase() {                                   // = super(); then the body
        System.out.println("2. Vase()            material=" + material);
    }
    Vase(int value, String material) {
        super(value);                          // choose WHICH parent constructor
        this.material = material;
        System.out.println("2. Vase(int,String)  material=" + material);
    }
}

class GreekVase extends Vase {
    GreekVase() {
        this(500, "clay");                     // this(...) calls another constructor of the SAME class
        System.out.println("3. GreekVase()");
    }
    GreekVase(int value, String material) {
        super(value, material);
        System.out.println("3. GreekVase(int,String)");
    }
}</code></pre>
<div class="out">-- new Vase() --<br>
1. Item() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value=0<br>
2. Vase() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;material=null<br>
-- new GreekVase() --<br>
1. Item(int) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value=500<br>
2. Vase(int,String) &nbsp;material=clay<br>
3. GreekVase(int,String)<br>
3. GreekVase()</div>
<p><code>new Vase()</code> wrote no <code>super</code>, yet <code>Item()</code> ran first — the inserted <code>super()</code>. <code>GreekVase()</code> first jumps sideways with <code>this(...)</code> (another constructor of the same class), which calls <code>super(value, material)</code>, which calls <code>super(value)</code>: the lines print top-down while the calls go bottom-up. The slide's note, run on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 11: 'Try swapping these statements' ==");
    viet(d, "Swap.java",
        "class Rectangle {\\n" +
        "    private int length, width;\\n" +
        "    public Rectangle() { }\\n" +
        "    public Rectangle(int l, int w) { length = l; width = w; }\\n" +
        "}\\n" +
        "class Box extends Rectangle {\\n" +
        "    private int height;\\n" +
        "    public Box(int l, int w, int h) {\\n" +
        "        height = h &gt; 0 ? h : 0;\\n" +
        "        super(l, w);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Swap.java");

    System.out.println("== slide 9 note: no super(...) written, and the parent has NO no-argument constructor ==");
    viet(d, "NoDefault.java",
        "class Item {\\n" +
        "    int value; String creator;\\n" +
        "    Item(int value, String creator) { this.value = value; this.creator = creator; }\\n" +
        "}\\n" +
        "class Vase extends Item {\\n" +
        "    int height;\\n" +
        "    Vase(int height) { this.height = height; }\\n" +
        "}\\n");
    lenh(d, "javac", "NoDefault.java");

    System.out.println("== the same trap with NO constructor in Vase at all ==");
    viet(d, "NoCtor.java",
        "class Item {\\n" +
        "    Item(int value) { }\\n" +
        "}\\n" +
        "class Vase extends Item { }\\n");
    lenh(d, "javac", "NoCtor.java");
}</code></pre>
<div class="out">== slide 11: 'Try swapping these statements' ==<br>
&gt; javac Swap.java<br>
Swap.java:10: error: call to super must be first statement in constructor<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super(l, w);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== slide 9 note: no super(...) written, and the parent has NO no-argument constructor ==<br>
&gt; javac NoDefault.java<br>
NoDefault.java:7: error: constructor Item in class Item cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;Vase(int height) { this.height = height; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: int,String<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)<br>
== the same trap with NO constructor in Vase at all ==<br>
&gt; javac NoCtor.java<br>
NoCtor.java:4: error: constructor Item in class Item cannot be applied to given types;<br>
class Vase extends Item { }<br>
^<br>
&nbsp;&nbsp;required: int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)</div>
<div class="pitfall">PE trap #1 of question 2: the paper gives the parent only <code>Item(int value, String creator)</code> — no default constructor — and you write <code>SpecItem()</code> without <code>super(...)</code>. The whole project fails to build, so the marker gets no jar and the question scores 0. Either call <code>super(...)</code> with values, or add the default constructor the diagram asks for (<code>+Car()</code> in PE10).</div>`,
        `<p class="y-chinh">🎯 Constructor không được kế thừa, nên constructor lớp con <strong>phải gọi một constructor của lớp cha</strong> bằng <code>super(đối số)</code>, và lời gọi đó <strong>phải là câu lệnh đầu tiên</strong>. Không viết lời gọi nào thì trình biên dịch tự chèn <code>super()</code> — bản <strong>không tham số</strong>; nếu cha không có bản đó, bạn nhận lỗi biên dịch.</p>
<p>Thứ tự sinh ra từ luật này — đỉnh cây chạy trước, lớp của bạn chạy sau cùng (tóm tắt, slide 17):</p>
<pre class="trich"><code class="language-java">class Item {
    protected int value;
    Item() {                                   // không viết super(): trình biên dịch chèn super() -&gt; Object()
        System.out.println("1. Item()            value=" + value);
    }
    Item(int value) {
        this.value = value;
        System.out.println("1. Item(int)         value=" + value);
    }
}

class Vase extends Item {
    protected String material;
    Vase() {                                   // = super(); rồi tới thân
        System.out.println("2. Vase()            material=" + material);
    }
    Vase(int value, String material) {
        super(value);                          // chọn constructor NÀO của cha
        this.material = material;
        System.out.println("2. Vase(int,String)  material=" + material);
    }
}

class GreekVase extends Vase {
    GreekVase() {
        this(500, "clay");                     // this(...) gọi constructor khác của CHÍNH lớp này
        System.out.println("3. GreekVase()");
    }
    GreekVase(int value, String material) {
        super(value, material);
        System.out.println("3. GreekVase(int,String)");
    }
}</code></pre>
<div class="out">-- new Vase() --<br>
1. Item() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value=0<br>
2. Vase() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;material=null<br>
-- new GreekVase() --<br>
1. Item(int) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value=500<br>
2. Vase(int,String) &nbsp;material=clay<br>
3. GreekVase(int,String)<br>
3. GreekVase()</div>
<p><code>new Vase()</code> không viết <code>super</code> nào, vậy mà <code>Item()</code> vẫn chạy trước — chính là <code>super()</code> được chèn vào. <code>GreekVase()</code> trước hết nhảy ngang bằng <code>this(...)</code> (một constructor khác của cùng lớp), constructor đó gọi <code>super(value, material)</code>, rồi tới <code>super(value)</code>: các dòng in ra từ trên xuống trong khi lời gọi đi từ dưới lên. Ghi chú của slide, chạy trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 11: 'Try swapping these statements' ==");
    viet(d, "Swap.java",
        "class Rectangle {\\n" +
        "    private int length, width;\\n" +
        "    public Rectangle() { }\\n" +
        "    public Rectangle(int l, int w) { length = l; width = w; }\\n" +
        "}\\n" +
        "class Box extends Rectangle {\\n" +
        "    private int height;\\n" +
        "    public Box(int l, int w, int h) {\\n" +
        "        height = h &gt; 0 ? h : 0;\\n" +
        "        super(l, w);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Swap.java");

    System.out.println("== slide 9 note: no super(...) written, and the parent has NO no-argument constructor ==");
    viet(d, "NoDefault.java",
        "class Item {\\n" +
        "    int value; String creator;\\n" +
        "    Item(int value, String creator) { this.value = value; this.creator = creator; }\\n" +
        "}\\n" +
        "class Vase extends Item {\\n" +
        "    int height;\\n" +
        "    Vase(int height) { this.height = height; }\\n" +
        "}\\n");
    lenh(d, "javac", "NoDefault.java");

    System.out.println("== the same trap with NO constructor in Vase at all ==");
    viet(d, "NoCtor.java",
        "class Item {\\n" +
        "    Item(int value) { }\\n" +
        "}\\n" +
        "class Vase extends Item { }\\n");
    lenh(d, "javac", "NoCtor.java");
}</code></pre>
<div class="out">== slide 11: 'Try swapping these statements' ==<br>
&gt; javac Swap.java<br>
Swap.java:10: error: call to super must be first statement in constructor<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super(l, w);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== slide 9 note: no super(...) written, and the parent has NO no-argument constructor ==<br>
&gt; javac NoDefault.java<br>
NoDefault.java:7: error: constructor Item in class Item cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;Vase(int height) { this.height = height; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: int,String<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)<br>
== the same trap with NO constructor in Vase at all ==<br>
&gt; javac NoCtor.java<br>
NoCtor.java:4: error: constructor Item in class Item cannot be applied to given types;<br>
class Vase extends Item { }<br>
^<br>
&nbsp;&nbsp;required: int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)</div>
<div class="pitfall">Bẫy PE số 1 của câu 2: đề chỉ cho cha <code>Item(int value, String creator)</code> — không có constructor mặc định — và bạn viết <code>SpecItem()</code> không có <code>super(...)</code>. Cả project không build được, máy chấm không có file jar, câu đó 0 điểm. Hoặc gọi <code>super(...)</code> kèm giá trị, hoặc thêm constructor mặc định mà sơ đồ yêu cầu (<code>+Car()</code> ở PE10).</div>`],
      [10, 'Inheritance…',
        `<p class="y-chinh">🎯 The superclass of the demo: <code>Rectangle</code> with private <code>length</code>/<code>width</code>, two <strong>overloaded</strong> constructors (default and with parameters), getters/setters, <code>area()</code>, and a <code>toString()</code> that <strong>overrides</strong> the one from <code>java.lang.Object</code>.</p>
<p>Typed exactly as on the slide (NetBeans screenshot, lines 1–20):</p>
<pre class="trich"><code class="language-java">class Rectangle {
    private int length = 0;
    private int width = 0;
    // Overloading constructors
    public Rectangle() // Default constructor
    {   }
    public Rectangle(int l, int w)
    {   length = l&gt;0? l: 0;    width= w&gt;0? w: 0;
    }
    // Overriding the toString method of the java.lang.Object class
    public String toString()
    {  return "[" + getLength() + "," + getWidth() + "]}";
    }
    // Getters, Setters
    public int getLength() { return length;  }
    public void setLength(int length) { this.length = length;  }
    public int getWidth() {  return width;  }
    public void setWidth(int width) { this.width = width;  }
    public int area() {  return length*width;  }
}</code></pre>
<p>Three remarks before the run on the next slide. (1) The parameter constructor <strong>validates</strong> (<code>l&gt;0? l: 0</code>) but <code>setLength</code>/<code>setWidth</code> do not — so <code>setLength(-5)</code> slips through; a well-encapsulated class checks in one place and calls it from both. (2) The green circle with an arrow in NetBeans' margin next to <code>toString()</code> means "this overrides a method of a superclass" — here <code>Object.toString()</code>. (3) Look at the string: <code>"]}"</code>. That closing brace is a typo, and it will appear in the output.</p>
<p class="meo">🧠 <code>private</code> fields + public getters in the parent is exactly what PE diagrams ask for (<code>-length: int</code>, <code>+getLength(): int</code>). It forces the subclass to use the getters — which slide 11 does.</p>`,
        `<p class="y-chinh">🎯 Lớp cha của bản demo: <code>Rectangle</code> với <code>length</code>/<code>width</code> private, hai constructor <strong>nạp chồng (overloaded)</strong> (mặc định và có tham số), getter/setter, <code>area()</code>, và một <code>toString()</code> <strong>ghi đè (override)</strong> bản của <code>java.lang.Object</code>.</p>
<p>Gõ đúng như trên slide (ảnh chụp NetBeans, dòng 1–20):</p>
<pre class="trich"><code class="language-java">class Rectangle {
    private int length = 0;
    private int width = 0;
    // Overloading constructors
    public Rectangle() // Default constructor
    {   }
    public Rectangle(int l, int w)
    {   length = l&gt;0? l: 0;    width= w&gt;0? w: 0;
    }
    // Overriding the toString method of the java.lang.Object class
    public String toString()
    {  return "[" + getLength() + "," + getWidth() + "]}";
    }
    // Getters, Setters
    public int getLength() { return length;  }
    public void setLength(int length) { this.length = length;  }
    public int getWidth() {  return width;  }
    public void setWidth(int width) { this.width = width;  }
    public int area() {  return length*width;  }
}</code></pre>
<p>Ba nhận xét trước khi chạy ở slide sau. (1) Constructor có tham số <strong>kiểm tra dữ liệu</strong> (<code>l&gt;0? l: 0</code>) nhưng <code>setLength</code>/<code>setWidth</code> thì không — nên <code>setLength(-5)</code> lọt qua; một lớp đóng gói tốt kiểm ở một chỗ và gọi chỗ đó từ cả hai nơi. (2) Vòng tròn xanh có mũi tên ở lề NetBeans cạnh <code>toString()</code> nghĩa là "phương thức này ghi đè một phương thức của lớp cha" — ở đây là <code>Object.toString()</code>. (3) Nhìn chuỗi: <code>"]}"</code>. Dấu ngoặc nhọn đóng đó là lỗi gõ, và nó sẽ lộ ra trong output.</p>
<p class="meo">🧠 Trường <code>private</code> + getter public ở lớp cha đúng là thứ sơ đồ đề PE yêu cầu (<code>-length: int</code>, <code>+getLength(): int</code>). Nó buộc lớp con phải dùng getter — đúng như slide 11 làm.</p>`],
      [11, 'Inheritance…',
        `<p class="y-chinh">🎯 The subclass: <code>Box extends Rectangle</code> adds <code>height</code>, its getter/setter and <code>volumn()</code>; its constructors call <code>super()</code> / <code>super(l, w)</code>; it <strong>overrides</strong> <code>toString()</code> and <code>area()</code>. <code>Demo_1</code> uses both classes.</p>
<pre class="trich"><code class="language-java">class Box extends Rectangle {
    private int height=0; // additional data
    public Box()  {  super(); }
    public Box (int l, int w, int h)
    {  super(l, w); // Try swapping these statements
       height = h&gt;0? h: 0;
    }
    // Additional Getter, Setter
    public int getHeight() { return height; }
    public void setHeight(int height)
        {  this.height = height; }
    // Overriding methods
    public String toString()
    {  return "[" + getLength() + "," +
            getWidth() + "," + getHeight() + "]";
    }
    public int area(){
        int l = this.getLength();
        int w = this.getWidth();
        int h = this.getHeight();
        return 2*(l*w + w*h + h*l);
    }
    // additional method
    public int volumn(){
        return this.getLength()*this.getWidth()*height;
    }
}</code></pre>
<pre class="trich"><code class="language-java">public class HopVaChuNhat {      // Demo_1 on the slide
    public static void main(String[] args)
    {   Rectangle r= new Rectangle(2,5);
        System.out.println("Rectangle: " + r.toString());
        System.out.println("   Area: " + r.area());
        Box b= new Box(2,2,2);
        System.out.println("Box " + b.toString());
        System.out.println("   Area: " + b.area());
        System.out.println("   Volumn: " + b.volumn());
    }
}</code></pre>
<div class="out">Rectangle: [2,5]}<br>
&nbsp;&nbsp;&nbsp;Area: 10<br>
Box [2,2,2]<br>
&nbsp;&nbsp;&nbsp;Area: 24<br>
&nbsp;&nbsp;&nbsp;Volumn: 8</div>
<p>Same output as the slide's window, including the stray <code>}</code> after <code>[2,5]</code> (Box's toString does not have it). Box has no access to the private <code>length</code>, so it calls <code>this.getLength()</code> — inherited, public. <code>Box.area()</code> returns the <strong>surface area</strong> 2(2·2 + 2·2 + 2·2) = 24, not 2·2 = 4: same name, different meaning. The comment "Try swapping these statements" was answered on slide 9 — the compiler refuses it.</p>
<div class="pitfall">Slide typos not to copy into a PE: <code>volumn</code> (English: <em>volume</em>) and <code>"]}"</code>. In the PE the marker compares your output <strong>character by character</strong> with the expected one, so one extra <code>}</code> costs the test case.</div>`,
        `<p class="y-chinh">🎯 Lớp con: <code>Box extends Rectangle</code> thêm <code>height</code>, getter/setter của nó và <code>volumn()</code>; các constructor gọi <code>super()</code> / <code>super(l, w)</code>; nó <strong>ghi đè</strong> <code>toString()</code> và <code>area()</code>. <code>Demo_1</code> dùng cả hai lớp.</p>
<pre class="trich"><code class="language-java">class Box extends Rectangle {
    private int height=0; // additional data
    public Box()  {  super(); }
    public Box (int l, int w, int h)
    {  super(l, w); // Try swapping these statements
       height = h&gt;0? h: 0;
    }
    // Additional Getter, Setter
    public int getHeight() { return height; }
    public void setHeight(int height)
        {  this.height = height; }
    // Overriding methods
    public String toString()
    {  return "[" + getLength() + "," +
            getWidth() + "," + getHeight() + "]";
    }
    public int area(){
        int l = this.getLength();
        int w = this.getWidth();
        int h = this.getHeight();
        return 2*(l*w + w*h + h*l);
    }
    // additional method
    public int volumn(){
        return this.getLength()*this.getWidth()*height;
    }
}</code></pre>
<pre class="trich"><code class="language-java">public class HopVaChuNhat {      // Demo_1 trên slide
    public static void main(String[] args)
    {   Rectangle r= new Rectangle(2,5);
        System.out.println("Rectangle: " + r.toString());
        System.out.println("   Area: " + r.area());
        Box b= new Box(2,2,2);
        System.out.println("Box " + b.toString());
        System.out.println("   Area: " + b.area());
        System.out.println("   Volumn: " + b.volumn());
    }
}</code></pre>
<div class="out">Rectangle: [2,5]}<br>
&nbsp;&nbsp;&nbsp;Area: 10<br>
Box [2,2,2]<br>
&nbsp;&nbsp;&nbsp;Area: 24<br>
&nbsp;&nbsp;&nbsp;Volumn: 8</div>
<p>Output y như cửa sổ trên slide, kể cả dấu <code>}</code> lạc sau <code>[2,5]</code> (toString của Box không có). Box không truy cập được <code>length</code> private, nên nó gọi <code>this.getLength()</code> — được kế thừa, public. <code>Box.area()</code> trả <strong>diện tích toàn phần</strong> 2(2·2 + 2·2 + 2·2) = 24, không phải 2·2 = 4: cùng tên, khác nghĩa. Câu chú thích "Try swapping these statements" (thử đổi chỗ hai câu này) đã có đáp án ở slide 9 — trình biên dịch từ chối.</p>
<div class="pitfall">Lỗi gõ trên slide đừng chép vào bài PE: <code>volumn</code> (tiếng Anh đúng: <em>volume</em>) và <code>"]}"</code>. Ở PE máy chấm so output của bạn với output mong đợi <strong>từng ký tự</strong>, nên một dấu <code>}</code> thừa là mất test case đó.</div>`],
      [12, 'Functions in inheritance',
        `<p class="y-chinh">🎯 A derived class inherits the <strong>ordinary member methods</strong> of its superclass and calls them as if it had written them; to reach the superclass's own version of a method, use <code>super.methodName(arguments)</code>. Re-implementing a <strong>static</strong> method of the superclass is called <strong>hiding</strong>.</p>
<p>"Ordinary" needs a precise reading. What a subclass gets, and what it does not:</p>
<table>
<thead><tr><th>Member of the superclass</th><th>Inherited?</th><th>Note</th></tr></thead>
<tbody>
<tr><td>public / protected method</td><td>yes</td><td>callable as if declared in the subclass</td></tr>
<tr><td>package (no modifier) method</td><td>yes, if the subclass is in the same package</td><td></td></tr>
<tr><td>private method or field</td><td>no (not accessible)</td><td>the field still exists inside the object</td></tr>
<tr><td>static method</td><td>yes, through either class name</td><td>redefining it = hiding (slide 14)</td></tr>
<tr><td>constructor</td><td>never</td><td>use <code>super(...)</code> (slide 9)</td></tr>
</tbody>
</table>
<pre class="trich"><code class="language-java">class Item {
    private static int created = 0;
    protected int value;
    Item(int value) { this.value = value; created++; }
    public String describe() { return "item worth " + value; }        // inherited
    protected double discountRate() { return 0.10; }                  // inherited, visible to subclasses
    private String secret() { return "cost price"; }                  // NOT visible in Vase
    public static int howMany() { return created; }                   // static: belongs to the class
}

class Vase extends Item {
    Vase(int value) { super(value); }
    double salePrice() {
        return value * (1 - discountRate());       // inherited field + inherited method, used as if declared here
    }
    String label() {
        return "Vase: " + super.describe();        // super. = "the version written in Item"
    }
}</code></pre>
<div class="out">item worth 200<br>
Vase: item worth 200<br>
sale price: 180.0<br>
Item.howMany() = 2<br>
Vase.howMany() = 2 &nbsp;(the same static method, reached through the subclass name)</div>
<p>➕ About <code>protected</code>: the FU material says protected members are "available from within the class itself and any class extended from it". Java's rule is wider — protected is also visible to <strong>every class in the same package</strong>. In a default-package PE project that means everywhere, so protected fields give no real protection there; the PE diagrams use <code>-</code> (private) for that reason.</p>`,
        `<p class="y-chinh">🎯 Lớp dẫn xuất kế thừa các <strong>phương thức thành viên bình thường</strong> của lớp cha và gọi chúng như thể chính nó viết; muốn gọi đúng phiên bản của lớp cha, dùng <code>super.tenPhuongThuc(đối số)</code>. Viết lại một phương thức <strong>static</strong> của lớp cha gọi là <strong>che giấu (hiding)</strong>.</p>
<p>Chữ "bình thường" cần đọc cho chính xác. Lớp con nhận được gì và không nhận gì:</p>
<table>
<thead><tr><th>Thành viên của lớp cha</th><th>Có kế thừa?</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>phương thức public / protected</td><td>có</td><td>gọi được như khai báo trong lớp con</td></tr>
<tr><td>phương thức package (không ghi gì)</td><td>có, nếu lớp con cùng package</td><td></td></tr>
<tr><td>phương thức hoặc trường private</td><td>không (không truy cập được)</td><td>trường vẫn nằm trong đối tượng</td></tr>
<tr><td>phương thức static</td><td>có, gọi qua tên lớp nào cũng được</td><td>định nghĩa lại = che giấu (slide 14)</td></tr>
<tr><td>constructor</td><td>không bao giờ</td><td>dùng <code>super(...)</code> (slide 9)</td></tr>
</tbody>
</table>
<pre class="trich"><code class="language-java">class Item {
    private static int created = 0;
    protected int value;
    Item(int value) { this.value = value; created++; }
    public String describe() { return "item worth " + value; }        // được kế thừa
    protected double discountRate() { return 0.10; }                  // được kế thừa, lớp con thấy
    private String secret() { return "cost price"; }                  // Vase KHÔNG thấy
    public static int howMany() { return created; }                   // static: thuộc về lớp
}

class Vase extends Item {
    Vase(int value) { super(value); }
    double salePrice() {
        return value * (1 - discountRate());       // trường + phương thức kế thừa, dùng như thể khai báo ở đây
    }
    String label() {
        return "Vase: " + super.describe();        // super. = "phiên bản viết trong Item"
    }
}</code></pre>
<div class="out">item worth 200<br>
Vase: item worth 200<br>
sale price: 180.0<br>
Item.howMany() = 2<br>
Vase.howMany() = 2 &nbsp;(the same static method, reached through the subclass name)</div>
<p>➕ Về <code>protected</code>: học liệu FU viết thành viên protected "chỉ dùng được trong chính lớp đó và mọi lớp kế thừa nó". Luật của Java rộng hơn — protected còn thấy được từ <strong>mọi lớp cùng package</strong>. Trong project PE dùng default package thì nghĩa là ở đâu cũng thấy, nên trường protected chẳng bảo vệ được gì ở đó; vì vậy sơ đồ PE dùng <code>-</code> (private).</p>`],
      [13, 'Functions in inheritance',
        `<p class="y-chinh">🎯 <code>Vase.displayDiscount()</code> has the same signature (name + number and types of parameters) and return type as <code>Item.displayDiscount()</code> — that is <strong>overriding</strong>. Inside it, <code>super.displayDiscount()</code> runs the version the superclass defined, so the output is "discounting …" then "and taking …".</p>
<pre class="trich"><code class="language-java">class Item {
    void displayDiscount() { System.out.println("discounting ..."); }
}

class Vase extends Item {
    @Override
    void displayDiscount() {
        super.displayDiscount();               // the version defined by the superclass
        System.out.println("and taking ...");
    }
}</code></pre>
<p>The real run, plus two variants the slide does not show — a subclass that forgets <code>super.</code> (the parent's line disappears) and a note on what happens if you write the call without <code>super.</code>:</p>
<pre class="trich"><code class="language-java">class Statue extends Item {
    @Override
    void displayDiscount() {                   // forgot super.displayDiscount(): the parent's line is gone
        System.out.println("statue sale only");
    }
}

class Painting extends Item {
    @Override
    void displayDiscount() {
        // displayDiscount();                  // WITHOUT super. this would call itself forever -&gt; StackOverflowError
        super.displayDiscount();
        System.out.println("and framing for free");
    }
}</code></pre>
<div class="out">-- Vase --<br>
discounting ...<br>
and taking ...<br>
-- Statue --<br>
statue sale only<br>
-- Painting --<br>
discounting ...<br>
and framing for free</div>
<p>This "extend, don't replace" pattern — call <code>super.x()</code>, then add — is the standard way to write <code>toString()</code> in a PE subclass: <code>return super.toString() + ", " + model;</code> gives exactly the "color, seat, model" format that PE10's SpecCar asks for.</p>
<div class="pitfall">Writing <code>displayDiscount();</code> instead of <code>super.displayDiscount();</code> inside the override calls <strong>itself</strong> — endless recursion, <code>StackOverflowError</code>. The word <code>super</code> is what points one level up.</div>`,
        `<p class="y-chinh">🎯 <code>Vase.displayDiscount()</code> có cùng chữ ký (tên + số lượng và kiểu tham số) và cùng kiểu trả về với <code>Item.displayDiscount()</code> — đó là <strong>ghi đè (overriding)</strong>. Bên trong nó, <code>super.displayDiscount()</code> chạy phiên bản lớp cha đã định nghĩa, nên output là "discounting …" rồi "and taking …".</p>
<pre class="trich"><code class="language-java">class Item {
    void displayDiscount() { System.out.println("discounting ..."); }
}

class Vase extends Item {
    @Override
    void displayDiscount() {
        super.displayDiscount();               // phiên bản do lớp cha định nghĩa
        System.out.println("and taking ...");
    }
}</code></pre>
<p>Chạy thật, kèm hai biến thể slide không cho xem — lớp con quên <code>super.</code> (dòng của cha biến mất) và lời nhắc chuyện gì xảy ra nếu viết lời gọi mà thiếu <code>super.</code>:</p>
<pre class="trich"><code class="language-java">class Statue extends Item {
    @Override
    void displayDiscount() {                   // quên super.displayDiscount(): dòng của cha biến mất
        System.out.println("statue sale only");
    }
}

class Painting extends Item {
    @Override
    void displayDiscount() {
        // KHÔNG có super. thì gọi lại chính nó mãi -&gt; StackOverflowError
        super.displayDiscount();
        System.out.println("and framing for free");
    }
}</code></pre>
<div class="out">-- Vase --<br>
discounting ...<br>
and taking ...<br>
-- Statue --<br>
statue sale only<br>
-- Painting --<br>
discounting ...<br>
and framing for free</div>
<p>Kiểu "mở rộng, đừng thay thế" này — gọi <code>super.x()</code> rồi thêm — là cách chuẩn để viết <code>toString()</code> trong lớp con của bài PE: <code>return super.toString() + ", " + model;</code> cho đúng định dạng "color, seat, model" mà SpecCar của PE10 yêu cầu.</p>
<div class="pitfall">Viết <code>displayDiscount();</code> thay vì <code>super.displayDiscount();</code> bên trong bản ghi đè là gọi <strong>chính nó</strong> — đệ quy không dừng, <code>StackOverflowError</code>. Chính chữ <code>super</code> mới chỉ lên một tầng.</div>`],
      [14, 'Functions in inheritance: Hiding Method',
        `<p class="y-chinh">🎯 <code>Son1</code> redefines the <strong>static</strong> method <code>m()</code> of <code>Father1</code>: that is <strong>hiding</strong>, not overriding. A static method is chosen by the <strong>declared type</strong> of the variable at compile time, so <code>obj.m()</code> with <code>Father1 obj = new Son1()</code> still prints "I am a father".</p>
<pre class="trich"><code class="language-java">class Father1 {
    public static void m() {
        System.out.println("I am a father");
    }
    public void who() {                        // instance method, for comparison
        System.out.println("  who(): father");
    }
}
class Son1 extends Father1 {
    public static void m() {                   // Hiding
        System.out.println("I am a son");
    }
    @Override
    public void who() {                        // Overriding
        System.out.println("  who(): son");
    }
}</code></pre>
<pre class="trich"><code class="language-java">Father1 obj = new Father1();
obj.m();
obj.who();
obj = new Son1();
obj.m();                               // declared Father1 -&gt; Father1.m(), although the object is a Son1
obj.who();                             // the object decides -&gt; Son1.who()
Son1 obj2 = new Son1();
obj2.m();
Father1.m();                           // the honest way to call a static method: through the class name
Son1.m();</code></pre>
<div class="out">I am a father<br>
&nbsp;&nbsp;who(): father<br>
I am a father<br>
&nbsp;&nbsp;who(): son<br>
I am a son<br>
I am a father<br>
I am a son</div>
<p>The first three lines are the slide's output. The <code>who()</code> lines are added for contrast: an <strong>instance</strong> method follows the object (son), a <strong>static</strong> method follows the variable (father). Calling a static method through a variable is legal but misleading — javac compiles <code>obj.m()</code> as <code>Father1.m()</code>; write the class name, as in the last two lines.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== @Override on a static method ==");
    viet(d, "A.java",
        "class Father1 { public static void m() { } }\\n" +
        "class Son1 extends Father1 {\\n" +
        "    @Override\\n" +
        "    public static void m() { }\\n" +
        "}\\n");
    lenh(d, "javac", "A.java");

    System.out.println("== an instance method cannot replace a static one ==");
    viet(d, "B.java",
        "class Father1 { public static void m() { } }\\n" +
        "class Son1 extends Father1 { public void m() { } }\\n");
    lenh(d, "javac", "B.java");

    System.out.println("== a static method cannot hide an instance one ==");
    viet(d, "C.java",
        "class Father1 { public void m() { } }\\n" +
        "class Son1 extends Father1 { public static void m() { } }\\n");
    lenh(d, "javac", "C.java");
}</code></pre>
<div class="out">== @Override on a static method ==<br>
&gt; javac A.java<br>
A.java:3: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== an instance method cannot replace a static one ==<br>
&gt; javac B.java<br>
B.java:2: error: m() in Son1 cannot override m() in Father1<br>
class Son1 extends Father1 { public void m() { } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;overridden method is static<br>
1 error<br>
(exit code 1)<br>
== a static method cannot hide an instance one ==<br>
&gt; javac C.java<br>
C.java:2: error: m() in Son1 cannot override m() in Father1<br>
class Son1 extends Father1 { public static void m() { } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;overriding method is static<br>
1 error<br>
(exit code 1)</div>
<div class="pitfall">FE favourite (FE1 q22, FE12 q29, FE13 q22 in the Exam Room): <code>A a = new B(); a.show();</code> with <code>static</code> show in both classes prints <strong>A's</strong> version. Remove the word <code>static</code> from both and the answer flips to B's. Read the modifiers before you read the bodies.</div>`,
        `<p class="y-chinh">🎯 <code>Son1</code> định nghĩa lại phương thức <strong>static</strong> <code>m()</code> của <code>Father1</code>: đó là <strong>che giấu (hiding)</strong>, không phải ghi đè. Phương thức static được chọn theo <strong>kiểu khai báo</strong> của biến ngay lúc biên dịch, nên <code>obj.m()</code> với <code>Father1 obj = new Son1()</code> vẫn in "I am a father".</p>
<pre class="trich"><code class="language-java">class Father1 {
    public static void m() {
        System.out.println("I am a father");
    }
    public void who() {                        // phương thức thể hiện, để so sánh
        System.out.println("  who(): father");
    }
}
class Son1 extends Father1 {
    public static void m() {                   // Che giấu
        System.out.println("I am a son");
    }
    @Override
    public void who() {                        // Ghi đè
        System.out.println("  who(): son");
    }
}</code></pre>
<pre class="trich"><code class="language-java">Father1 obj = new Father1();
obj.m();
obj.who();
obj = new Son1();
obj.m();                               // khai báo Father1 -&gt; Father1.m(), dù đối tượng là Son1
obj.who();                             // đối tượng quyết định -&gt; Son1.who()
Son1 obj2 = new Son1();
obj2.m();
Father1.m();                           // cách gọi static đúng nghĩa: qua tên lớp
Son1.m();</code></pre>
<div class="out">I am a father<br>
&nbsp;&nbsp;who(): father<br>
I am a father<br>
&nbsp;&nbsp;who(): son<br>
I am a son<br>
I am a father<br>
I am a son</div>
<p>Ba dòng đầu là output trên slide. Các dòng <code>who()</code> được thêm để so sánh: phương thức <strong>thể hiện</strong> đi theo đối tượng (son), phương thức <strong>static</strong> đi theo biến (father). Gọi phương thức static qua một biến là hợp lệ nhưng dễ hiểu lầm — javac biên dịch <code>obj.m()</code> thành <code>Father1.m()</code>; hãy viết tên lớp, như hai dòng cuối.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== @Override on a static method ==");
    viet(d, "A.java",
        "class Father1 { public static void m() { } }\\n" +
        "class Son1 extends Father1 {\\n" +
        "    @Override\\n" +
        "    public static void m() { }\\n" +
        "}\\n");
    lenh(d, "javac", "A.java");

    System.out.println("== an instance method cannot replace a static one ==");
    viet(d, "B.java",
        "class Father1 { public static void m() { } }\\n" +
        "class Son1 extends Father1 { public void m() { } }\\n");
    lenh(d, "javac", "B.java");

    System.out.println("== a static method cannot hide an instance one ==");
    viet(d, "C.java",
        "class Father1 { public void m() { } }\\n" +
        "class Son1 extends Father1 { public static void m() { } }\\n");
    lenh(d, "javac", "C.java");
}</code></pre>
<div class="out">== @Override on a static method ==<br>
&gt; javac A.java<br>
A.java:3: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== an instance method cannot replace a static one ==<br>
&gt; javac B.java<br>
B.java:2: error: m() in Son1 cannot override m() in Father1<br>
class Son1 extends Father1 { public void m() { } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;overridden method is static<br>
1 error<br>
(exit code 1)<br>
== a static method cannot hide an instance one ==<br>
&gt; javac C.java<br>
C.java:2: error: m() in Son1 cannot override m() in Father1<br>
class Son1 extends Father1 { public static void m() { } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;overriding method is static<br>
1 error<br>
(exit code 1)</div>
<div class="pitfall">Câu FE ưa thích (FE1 câu 22, FE12 câu 29, FE13 câu 22 trong Exam Room): <code>A a = new B(); a.show();</code> với show <code>static</code> ở cả hai lớp in ra bản của <strong>A</strong>. Bỏ chữ <code>static</code> ở cả hai thì đáp án lật sang bản của B. Đọc từ khoá trước khi đọc thân phương thức.</div>`],
      [15, 'Using an "instanceof" operator',
        `<p class="y-chinh">🎯 A variable of the superclass type can hold the address of a subclass object. Its <strong>static type</strong> is the type written in the declaration (checked by the compiler); its <strong>dynamic type</strong> is the class of the object it points to at run time. <code>instanceof</code> checks the dynamic type and returns true or false.</p>
<p>The slide words the definitions loosely ("a reference variable … is called to be dynamic type"). The precise version: a <em>variable</em> has a static type that never changes; an <em>object</em> has a class that never changes; what changes is <em>which object</em> the variable points to. So "the dynamic type of obj1" means "the class of the object obj1 points to right now".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/c093d1d92ff7eac1a3baa5f1561d962bc92bd504.svg" alt="Slide 15: the variable's type versus the object's class" loading="lazy" /><p class="chu-thich">🧩 Slide 15: the variable's type versus the object's class</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 15 — two variables, two static types, objects with their own dynamic types
' The variable's type is checked by the compiler; the object's class is what instanceof and getClass() see
object "obj1 : Rectangle" as v1 #EEF2FF
object "obj2 : Box" as v2 #EEF2FF
object ":Box" as o1 {
  length = 0
  width = 0
  height = 0
}
object ":Box " as o2 {
  length = 0
  width = 0
  height = 0
}
v1 --&gt; o1 : static type Rectangle\\ndynamic type Box
v2 --&gt; o2 : static type Box\\ndynamic type Box
note bottom of o1
  obj1 instanceof Box: true
  obj1 instanceof Rectangle: true
  obj1.setHeight(300): compile error
  ((Box) obj1).setHeight(300): OK
end note
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">Rectangle obj1 = new Box();     // static type Rectangle, dynamic type Box
Box obj2 = new Box();           // static type Box, dynamic type Box
Rectangle obj3 = new Rectangle();
Rectangle obj4 = null;          // points to no object at all

System.out.println("obj1 dynamic type: " + obj1.getClass().getSimpleName());
if (obj1 instanceof Box)
    System.out.println("obj1 is pointing to the Box object");
System.out.println("obj1 instanceof Rectangle: " + (obj1 instanceof Rectangle));
System.out.println("obj1 instanceof Object   : " + (obj1 instanceof Object));
System.out.println("obj2 instanceof Box      : " + (obj2 instanceof Box));
System.out.println("obj3 instanceof Box      : " + (obj3 instanceof Box));
System.out.println("obj4 instanceof Rectangle: " + (obj4 instanceof Rectangle));
obj1 = obj3;                    // the same variable now points to another object
System.out.println("after obj1 = obj3, obj1 instanceof Box: " + (obj1 instanceof Box));</code></pre>
<div class="out">obj1 dynamic type: Box<br>
obj1 is pointing to the Box object<br>
obj1 instanceof Rectangle: true<br>
obj1 instanceof Object &nbsp;&nbsp;: true<br>
obj2 instanceof Box &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: true<br>
obj3 instanceof Box &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: false<br>
obj4 instanceof Rectangle: false<br>
after obj1 = obj3, obj1 instanceof Box: false</div>
<p><code>instanceof</code> is true for the object's class <strong>and every superclass</strong> (Box, Rectangle, Object), false for <code>null</code> (no object, no class), and its answer changes when the variable is reassigned. The slide's own code line <code>If ( obj1 instanceof Box)</code> with curly quotes would not compile — Java keywords are lower case (<code>if</code>) and string quotes must be straight <code>"</code>.</p>
<div class="callout">🧭 <strong>Go further — Java 16+ (not for the PE)</strong>: <code>if (obj1 instanceof Box b) b.setHeight(300);</code> checks and casts in one step (pattern matching). It does not compile on JDK 8; in the exam write the check and the cast separately, as on slide 16.</div>`,
        `<p class="y-chinh">🎯 Một biến kiểu lớp cha có thể giữ địa chỉ của một đối tượng lớp con. <strong>Kiểu tĩnh (static type)</strong> của nó là kiểu viết trong khai báo (trình biên dịch kiểm); <strong>kiểu động (dynamic type)</strong> là lớp của đối tượng mà nó trỏ tới lúc chạy. <code>instanceof</code> kiểm kiểu động và trả true hoặc false.</p>
<p>Slide diễn đạt định nghĩa hơi lẫn ("một biến tham chiếu … được gọi là kiểu động"). Bản chính xác: một <em>biến</em> có kiểu tĩnh không bao giờ đổi; một <em>đối tượng</em> có lớp không bao giờ đổi; thứ thay đổi là <em>đối tượng nào</em> mà biến đang trỏ tới. Nên "kiểu động của obj1" nghĩa là "lớp của đối tượng mà obj1 đang trỏ tới lúc này".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/c093d1d92ff7eac1a3baa5f1561d962bc92bd504.svg" alt="Slide 15: kiểu của biến so với lớp của đối tượng" loading="lazy" /><p class="chu-thich">🧩 Slide 15: kiểu của biến so với lớp của đối tượng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 15 — two variables, two static types, objects with their own dynamic types
' Kiểu của biến do trình biên dịch kiểm; lớp của đối tượng là thứ instanceof và getClass() nhìn thấy
object "obj1 : Rectangle" as v1 #EEF2FF
object "obj2 : Box" as v2 #EEF2FF
object ":Box" as o1 {
  length = 0
  width = 0
  height = 0
}
object ":Box " as o2 {
  length = 0
  width = 0
  height = 0
}
v1 --&gt; o1 : static type Rectangle\\ndynamic type Box
v2 --&gt; o2 : static type Box\\ndynamic type Box
note bottom of o1
  obj1 instanceof Box: true
  obj1 instanceof Rectangle: true
  obj1.setHeight(300): compile error
  ((Box) obj1).setHeight(300): OK
end note
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">Rectangle obj1 = new Box();     // kiểu tĩnh Rectangle, kiểu động Box
Box obj2 = new Box();           // kiểu tĩnh Box, kiểu động Box
Rectangle obj3 = new Rectangle();
Rectangle obj4 = null;          // không trỏ tới đối tượng nào

System.out.println("obj1 dynamic type: " + obj1.getClass().getSimpleName());
if (obj1 instanceof Box)
    System.out.println("obj1 is pointing to the Box object");
System.out.println("obj1 instanceof Rectangle: " + (obj1 instanceof Rectangle));
System.out.println("obj1 instanceof Object   : " + (obj1 instanceof Object));
System.out.println("obj2 instanceof Box      : " + (obj2 instanceof Box));
System.out.println("obj3 instanceof Box      : " + (obj3 instanceof Box));
System.out.println("obj4 instanceof Rectangle: " + (obj4 instanceof Rectangle));
obj1 = obj3;                    // cùng biến giờ trỏ sang đối tượng khác
System.out.println("after obj1 = obj3, obj1 instanceof Box: " + (obj1 instanceof Box));</code></pre>
<div class="out">obj1 dynamic type: Box<br>
obj1 is pointing to the Box object<br>
obj1 instanceof Rectangle: true<br>
obj1 instanceof Object &nbsp;&nbsp;: true<br>
obj2 instanceof Box &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: true<br>
obj3 instanceof Box &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: false<br>
obj4 instanceof Rectangle: false<br>
after obj1 = obj3, obj1 instanceof Box: false</div>
<p><code>instanceof</code> ra true với lớp của đối tượng <strong>và mọi lớp cha</strong> của nó (Box, Rectangle, Object), ra false với <code>null</code> (không có đối tượng thì không có lớp), và kết quả đổi khi biến được gán lại. Chính dòng code trên slide <code>If ( obj1 instanceof Box)</code> với ngoặc kép cong sẽ không biên dịch được — từ khoá Java viết thường (<code>if</code>) và dấu nháy của chuỗi phải là nháy thẳng <code>"</code>.</p>
<div class="callout">🧭 <strong>Đi tiếp — Java 16+ (không dùng cho PE)</strong>: <code>if (obj1 instanceof Box b) b.setHeight(300);</code> vừa kiểm vừa ép kiểu trong một bước (pattern matching). Nó không biên dịch được trên JDK 8; trong phòng thi hãy viết phép kiểm và phép ép riêng, như slide 16.</div>`],
      [16, 'Casting',
        `<p class="y-chinh">🎯 A variable of the superclass type can only call methods of the superclass. To call a method of the subclass you must <strong>cast explicitly</strong>: <code>((Box) obj).setHeight(300);</code></p>
<p>Four cases, run on the real JDK 8 — the compile error without a cast, the slide's cast, a wrong cast, and a cast that can never work:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String classes =
        "class Rectangle { int area() { return 0; } }\\n" +
        "class Box extends Rectangle {\\n" +
        "    int height;\\n" +
        "    void setHeight(int h) { height = h; }\\n" +
        "}\\n" +
        "class Square extends Rectangle { }\\n";
    System.out.println("== 1. no cast: the compiler only knows the static type Rectangle ==");
    viet(d, "NoCast.java", classes +
        "public class NoCast {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Rectangle obj = new Box();\\n" +
        "        obj.setHeight(300);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "NoCast.java");

    System.out.println("== 2. the slide's cast: compiles and runs ==");
    viet(d, "SlideCast.java", classes +
        "public class SlideCast {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Rectangle obj = new Box();\\n" +
        "        ((Box) obj).setHeight(300);\\n" +
        "        System.out.println(\\"height = \\" + ((Box) obj).height);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "SlideCast.java");
    lenh(d, "java", "SlideCast");

    System.out.println("== 3. a wrong cast: compiles, then fails at run time ==");
    viet(d, "BadCast.java", classes +
        "public class BadCast {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Rectangle obj = new Square();\\n" +
        "        ((Box) obj).setHeight(300);\\n" +
        "        System.out.println(\\"never printed\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "BadCast.java");
    lenh(d, "java", "BadCast");

    System.out.println("== 4. a cast between unrelated classes does not even compile ==");
    viet(d, "Unrelated.java", classes +
        "public class Unrelated {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Box b = new Box();\\n" +
        "        Square s = (Square) b;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Unrelated.java");
}</code></pre>
<div class="out">== 1. no cast: the compiler only knows the static type Rectangle ==<br>
&gt; javac NoCast.java<br>
NoCast.java:10: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;obj.setHeight(300);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method setHeight(int)<br>
&nbsp;&nbsp;location: variable obj of type Rectangle<br>
1 error<br>
(exit code 1)<br>
== 2. the slide's cast: compiles and runs ==<br>
&gt; javac SlideCast.java<br>
&gt; java SlideCast<br>
height = 300<br>
== 3. a wrong cast: compiles, then fails at run time ==<br>
&gt; javac BadCast.java<br>
&gt; java BadCast<br>
Exception in thread "main" java.lang.ClassCastException: Square cannot be cast to Box<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
== 4. a cast between unrelated classes does not even compile ==<br>
&gt; javac Unrelated.java<br>
Unrelated.java:10: error: incompatible types: Box cannot be converted to Square<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Square s = (Square) b;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<table>
<thead><tr><th>Direction</th><th>Written</th><th>Checked</th><th>Can fail?</th></tr></thead>
<tbody>
<tr><td>upcast (Box → Rectangle)</td><td>implicit: <code>Rectangle r = box;</code></td><td>compile time</td><td>never</td></tr>
<tr><td>downcast (Rectangle → Box)</td><td>explicit: <code>(Box) r</code></td><td>run time</td><td>yes: <code>ClassCastException</code></td></tr>
<tr><td>unrelated (Box → Square)</td><td><code>(Square) box</code></td><td>compile time</td><td>always a compile error</td></tr>
</tbody>
</table>
<p>Notice the brackets in <code>((Box) obj).setHeight(300)</code>: the method call binds tighter than the cast, so <code>(Box) obj.setHeight(300)</code> would try to cast the <em>result</em> of the call (FE22 q33 asks exactly this). On newer JDKs the run-time message is longer — <em>class Square cannot be cast to class Box (… in unnamed module of loader 'app')</em> — but the exception is the same.</p>
<div class="pitfall">The summary's last line is the rule: <strong>check with instanceof before you cast</strong>. In a PE list of mixed objects, <code>if (it instanceof Vase) { Vase v = (Vase) it; … }</code> never throws.</div>`,
        `<p class="y-chinh">🎯 Biến kiểu lớp cha chỉ gọi được phương thức của lớp cha. Muốn gọi phương thức của lớp con bạn phải <strong>ép kiểu tường minh (cast explicitly)</strong>: <code>((Box) obj).setHeight(300);</code></p>
<p>Bốn trường hợp, chạy trên JDK 8 thật — lỗi biên dịch khi không ép, phép ép của slide, một phép ép sai, và một phép ép không bao giờ hợp lệ:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String classes =
        "class Rectangle { int area() { return 0; } }\\n" +
        "class Box extends Rectangle {\\n" +
        "    int height;\\n" +
        "    void setHeight(int h) { height = h; }\\n" +
        "}\\n" +
        "class Square extends Rectangle { }\\n";
    System.out.println("== 1. no cast: the compiler only knows the static type Rectangle ==");
    viet(d, "NoCast.java", classes +
        "public class NoCast {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Rectangle obj = new Box();\\n" +
        "        obj.setHeight(300);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "NoCast.java");

    System.out.println("== 2. the slide's cast: compiles and runs ==");
    viet(d, "SlideCast.java", classes +
        "public class SlideCast {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Rectangle obj = new Box();\\n" +
        "        ((Box) obj).setHeight(300);\\n" +
        "        System.out.println(\\"height = \\" + ((Box) obj).height);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "SlideCast.java");
    lenh(d, "java", "SlideCast");

    System.out.println("== 3. a wrong cast: compiles, then fails at run time ==");
    viet(d, "BadCast.java", classes +
        "public class BadCast {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Rectangle obj = new Square();\\n" +
        "        ((Box) obj).setHeight(300);\\n" +
        "        System.out.println(\\"never printed\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "BadCast.java");
    lenh(d, "java", "BadCast");

    System.out.println("== 4. a cast between unrelated classes does not even compile ==");
    viet(d, "Unrelated.java", classes +
        "public class Unrelated {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Box b = new Box();\\n" +
        "        Square s = (Square) b;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Unrelated.java");
}</code></pre>
<div class="out">== 1. no cast: the compiler only knows the static type Rectangle ==<br>
&gt; javac NoCast.java<br>
NoCast.java:10: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;obj.setHeight(300);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method setHeight(int)<br>
&nbsp;&nbsp;location: variable obj of type Rectangle<br>
1 error<br>
(exit code 1)<br>
== 2. the slide's cast: compiles and runs ==<br>
&gt; javac SlideCast.java<br>
&gt; java SlideCast<br>
height = 300<br>
== 3. a wrong cast: compiles, then fails at run time ==<br>
&gt; javac BadCast.java<br>
&gt; java BadCast<br>
Exception in thread "main" java.lang.ClassCastException: Square cannot be cast to Box<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
== 4. a cast between unrelated classes does not even compile ==<br>
&gt; javac Unrelated.java<br>
Unrelated.java:10: error: incompatible types: Box cannot be converted to Square<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Square s = (Square) b;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<table>
<thead><tr><th>Chiều</th><th>Cách viết</th><th>Kiểm khi nào</th><th>Có thể hỏng?</th></tr></thead>
<tbody>
<tr><td>ép lên (upcast, Box → Rectangle)</td><td>ngầm: <code>Rectangle r = box;</code></td><td>lúc biên dịch</td><td>không bao giờ</td></tr>
<tr><td>ép xuống (downcast, Rectangle → Box)</td><td>tường minh: <code>(Box) r</code></td><td>lúc chạy</td><td>có: <code>ClassCastException</code></td></tr>
<tr><td>không liên quan (Box → Square)</td><td><code>(Square) box</code></td><td>lúc biên dịch</td><td>luôn là lỗi biên dịch</td></tr>
</tbody>
</table>
<p>Để ý cặp ngoặc trong <code>((Box) obj).setHeight(300)</code>: lời gọi phương thức gắn chặt hơn phép ép, nên <code>(Box) obj.setHeight(300)</code> sẽ cố ép <em>kết quả</em> của lời gọi (FE22 câu 33 hỏi đúng điều này). Trên JDK mới thông báo lúc chạy dài hơn — <em>class Square cannot be cast to class Box (… in unnamed module of loader 'app')</em> — nhưng vẫn là cùng ngoại lệ đó.</p>
<div class="pitfall">Dòng cuối của phần tóm tắt chính là luật: <strong>kiểm bằng instanceof trước khi ép</strong>. Trong một danh sách PE chứa đối tượng lẫn lộn, <code>if (it instanceof Vase) { Vase v = (Vase) it; … }</code> không bao giờ ném ngoại lệ.</div>`],
      [17, 'Summary',
        `<p class="y-chinh">🎯 Inheritance is how OO languages reuse coding structure; a derived class does <strong>not</strong> inherit constructors; constructors run from the superclass down to the derived class; use <code>instanceof</code> to check the type of a reference and <strong>check before casting</strong>.</p>
<table>
<thead><tr><th>Idea</th><th>Java</th><th>Evidence in this lesson</th></tr></thead>
<tbody>
<tr><td>reuse the structure</td><td><code>class Box extends Rectangle</code></td><td>Box uses getLength(), never re-declares length</td></tr>
<tr><td>one parent, Object by default</td><td><code>getSuperclass()</code></td><td>"class java.lang.Object" (slide 8)</td></tr>
<tr><td>constructors not inherited</td><td><code>super(...)</code> first, or an automatic <code>super()</code></td><td>real javac errors (slides 8, 9)</td></tr>
<tr><td>order of constructors</td><td>top-down</td><td>"1. Item … 2. Vase … 3. GreekVase" (slide 9)</td></tr>
<tr><td>reuse a parent method</td><td><code>super.method()</code></td><td>"discounting … and taking …" (slide 13)</td></tr>
<tr><td>static methods are hidden</td><td>chosen by the declared type</td><td>"I am a father" twice (slide 14)</td></tr>
<tr><td>instanceof, then cast</td><td><code>if (o instanceof Box) ((Box) o)…</code></td><td>ClassCastException when skipped (slide 16)</td></tr>
</tbody>
</table>
<p>Next, lesson 4.B (deck "Polymorphism", slides 1–11): overloading, overriding in depth, and how the JVM picks the overridden method at run time. The 🧪 practice of Chapter 4 then rebuilds PE question 2 from scratch.</p>`,
        `<p class="y-chinh">🎯 Kế thừa là cách ngôn ngữ hướng đối tượng dùng lại cấu trúc code; lớp dẫn xuất <strong>không</strong> kế thừa constructor; constructor chạy từ lớp cha xuống lớp dẫn xuất; dùng <code>instanceof</code> để kiểm kiểu của một tham chiếu và <strong>kiểm trước khi ép kiểu</strong>.</p>
<table>
<thead><tr><th>Ý</th><th>Java</th><th>Bằng chứng trong bài</th></tr></thead>
<tbody>
<tr><td>dùng lại cấu trúc</td><td><code>class Box extends Rectangle</code></td><td>Box dùng getLength(), không khai báo lại length</td></tr>
<tr><td>một lớp cha, mặc định Object</td><td><code>getSuperclass()</code></td><td>"class java.lang.Object" (slide 8)</td></tr>
<tr><td>constructor không kế thừa</td><td><code>super(...)</code> đầu tiên, hoặc <code>super()</code> tự chèn</td><td>lỗi javac thật (slide 8, 9)</td></tr>
<tr><td>thứ tự constructor</td><td>từ trên xuống</td><td>"1. Item … 2. Vase … 3. GreekVase" (slide 9)</td></tr>
<tr><td>dùng lại phương thức cha</td><td><code>super.method()</code></td><td>"discounting … and taking …" (slide 13)</td></tr>
<tr><td>static bị che giấu</td><td>chọn theo kiểu khai báo</td><td>"I am a father" hai lần (slide 14)</td></tr>
<tr><td>instanceof rồi mới ép</td><td><code>if (o instanceof Box) ((Box) o)…</code></td><td>ClassCastException khi bỏ qua (slide 16)</td></tr>
</tbody>
</table>
<p>Tiếp theo, bài 4.B (bộ "Polymorphism", slide 1–11): nạp chồng, ghi đè cho thật kỹ, và cách JVM chọn phương thức bị ghi đè lúc chạy. Sau đó bài 🧪 thực hành của Chương 4 dựng lại câu 2 đề PE từ đầu.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>Shop items Book (title, price, author) and DVD (title, price, minutes): which fields go into the superclass, and what is the constructor of DVD?</li>
<li>Why does <code>class Vase extends Item { }</code> fail to compile when <code>Item</code> has only <code>Item(int value)</code>? Give two different fixes.</li>
<li><code>Item it = new Vase(...);</code> — which of these compile: <code>it.getValue()</code>, <code>it.putFlowers()</code>, <code>((Vase) it).putFlowers()</code>? Which one can throw at run time if <code>it</code> held a Statue?</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Hàng hoá Book (title, price, author) và DVD (title, price, minutes): trường nào đưa lên lớp cha, và constructor của DVD viết thế nào?</li>
<li>Vì sao <code>class Vase extends Item { }</code> không biên dịch được khi <code>Item</code> chỉ có <code>Item(int value)</code>? Nêu hai cách sửa khác nhau.</li>
<li><code>Item it = new Vase(...);</code> — câu nào biên dịch được: <code>it.getValue()</code>, <code>it.putFlowers()</code>, <code>((Vase) it).putFlowers()</code>? Câu nào có thể ném ngoại lệ lúc chạy nếu <code>it</code> đang giữ một Statue?</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 5.1 "Classes, Superclasses, and Subclasses" (super, constructors, casts, instanceof)', 'Chương 5.1 "Classes, Superclasses, and Subclasses" (super, constructor, ép kiểu, instanceof)'],
      ['fuOffline', 'part "Inheritance" — the antique shop Item/Vase/Statue/Painting, displayDiscount, instanceof, casting', 'phần "Inheritance" — cửa hàng đồ cổ Item/Vase/Statue/Painting, displayDiscount, instanceof, ép kiểu'],
      ['javaTutorial', '"Inheritance", "Using the Keyword super", "Hiding Fields", "Object as a Superclass"', '"Inheritance", "Using the Keyword super", "Hiding Fields", "Object as a Superclass"'],
      ['jls8', '§8.1.4 Superclasses, §8.8.7 Constructor Body (the implicit super()), §8.4.8 Inheritance, Overriding, and Hiding', '§8.1.4 Superclasses, §8.8.7 Constructor Body (super() ngầm), §8.4.8 Inheritance, Overriding, and Hiding'],
    ]),
  ].join('\n'),
};

/* ───────── 4.B — 📑 Slide by slide · Polymorphism (1/2): overloading, overriding, dynamic binding (slides 1–11) ───────── */
const L_pro10_1 = {
  title: '4.B — 📑 Slide by slide · Polymorphism (1/2): overloading, overriding, dynamic binding (slides 1–11)|||4.B — 📑 Học theo từng slide · Polymorphism (1/2): nạp chồng, ghi đè, ràng buộc động (slide 1–11)',
  slug: 'pro192-slide-pro10-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–11 bộ "Polymorphism" của trường: đa hình là gì, nạp chồng (overloading — trình biên dịch chọn theo kiểu tĩnh của đối số, nới rộng trước đóng hộp, lỗi chỉ khác kiểu trả về, lời gọi mơ hồ) và ghi đè (overriding — đủ luật: chữ ký, kiểu trả về, không hẹp quyền truy cập, final), @Override và lỗi "@override" chữ thường trên slide, toString ghi đè hai tầng với super.toString(), chương trình Demo_1 của trường chạy thật, và cách JVM chọn phương thức bị ghi đè lúc chạy (bảng phương thức, javap cho thấy invokevirtual) — kèm điều KHÔNG đa hình: trường, phương thức static, chọn bản nạp chồng.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.B · school deck "Polymorphism", slides 1–11</span>
<h2>Same name, many bodies — who chooses, and when?</h2>
<p class="lead">Lesson 4.A built hierarchies. This deck asks what happens when one method name has <strong>several versions</strong>: several in one class with different parameters (<strong>overloading</strong>), or one per class down a hierarchy with the same signature (<strong>overriding</strong>). The answer to "which version runs?" is different for each — the compiler decides one, the JVM decides the other — and FE papers test exactly that difference. Slides 1–11 are taught here; slides 12–27 (interfaces, abstract classes, anonymous classes) open Chapter 5 as lesson 5.A.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>what polymorphism means; its two techniques</td><td>say which of two methods is overloaded and which is overridden</td></tr>
<tr><td>5–6</td><td>overloading</td><td>predict which overload the compiler picks, including char, byte and Object arguments</td></tr>
<tr><td>7–9</td><td>overriding and its rules; toString; the school's Demo_1</td><td>write a correct override with @Override and read the compiler's refusals</td></tr>
<tr><td>10–11</td><td>dynamic binding, the method table</td><td>explain why the object decides — and name the three things that do NOT follow the object</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.B · bộ slide "Polymorphism" của trường, slide 1–11</span>
<h2>Cùng một tên, nhiều thân — ai chọn, và chọn lúc nào?</h2>
<p class="lead">Bài 4.A dựng cây phân cấp. Bộ slide này hỏi điều gì xảy ra khi một tên phương thức có <strong>nhiều phiên bản</strong>: nhiều bản trong cùng một lớp với tham số khác nhau (<strong>nạp chồng — overloading</strong>), hoặc mỗi lớp dọc theo cây một bản với cùng chữ ký (<strong>ghi đè — overriding</strong>). Câu trả lời cho "bản nào chạy?" khác nhau ở hai trường hợp — trình biên dịch quyết một bên, JVM quyết bên kia — và đề FE hỏi đúng chỗ khác nhau đó. Bài này giảng slide 1–11; slide 12–27 (interface, lớp trừu tượng, lớp ẩn danh) mở đầu Chương 5 thành bài 5.A.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>đa hình nghĩa là gì; hai kỹ thuật của nó</td><td>chỉ ra trong hai phương thức cái nào nạp chồng, cái nào ghi đè</td></tr>
<tr><td>5–6</td><td>nạp chồng</td><td>đoán đúng bản nạp chồng trình biên dịch chọn, kể cả với đối số char, byte và Object</td></tr>
<tr><td>7–9</td><td>ghi đè và các luật của nó; toString; Demo_1 của trường</td><td>viết bản ghi đè đúng với @Override và đọc được các lời từ chối của trình biên dịch</td></tr>
<tr><td>10–11</td><td>ràng buộc động, bảng phương thức</td><td>giải thích vì sao đối tượng quyết định — và kể ra ba thứ KHÔNG đi theo đối tượng</td></tr>
</tbody>
</table>`),
    walkHead('pro10', 1, 11),
    walk('pro10', [
      [1, 'Polymorphism',
        `<p class="y-chinh">🎯 The fourth pillar: <strong>polymorphism</strong> — "many forms". One call written once in your code can run different bodies depending on what it is called with or on.</p>
<p>This deck is split across two chapters on this site, at the natural seam of the slides: slides 1–11 (overloading, overriding, dynamic binding) finish Chapter 4 "Inheritance &amp; Polymorphism"; slides 12–27 (interfaces, abstract classes, nested and anonymous classes) are lesson 5.A in Chapter 5. In the syllabus this is still CLO6, and it is the idea every later framework is built on: Spring calls <em>your</em> overridden method without knowing your class.</p>
<p class="meo">🧠 A TV remote's power button is "one call, many forms": the same press turns on a Samsung, an LG or an air conditioner — each device decides what "on" means. Slides 14–17 use exactly that example.</p>`,
        `<p class="y-chinh">🎯 Trụ cột thứ tư: <strong>đa hình (polymorphism)</strong> — "nhiều hình dạng". Một lời gọi viết một lần trong code có thể chạy những thân khác nhau tuỳ vào nó được gọi với cái gì hoặc trên cái gì.</p>
<p>Trên trang web này bộ slide được chia cho hai chương, đúng ở đường nối tự nhiên của slide: slide 1–11 (nạp chồng, ghi đè, ràng buộc động) khép lại Chương 4 "Kế thừa &amp; Đa hình"; slide 12–27 (interface, lớp trừu tượng, lớp lồng và lớp ẩn danh) là bài 5.A của Chương 5. Trong đề cương vẫn là CLO6, và đây là ý tưởng mà mọi framework về sau xây lên: Spring gọi phương thức ghi đè của <em>bạn</em> mà không cần biết lớp của bạn.</p>
<p class="meo">🧠 Nút nguồn của cái điều khiển TV là "một lời gọi, nhiều hình dạng": cùng một lần bấm bật được Samsung, LG hay máy lạnh — mỗi thiết bị tự quyết "bật" nghĩa là gì. Slide 14–17 dùng đúng ví dụ đó.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three objectives: <strong>overloading and overriding</strong>, <strong>interfaces</strong>, <strong>abstract classes</strong>.</p>
<table>
<thead><tr><th>Objective</th><th>Slides</th><th>Lesson on this site</th></tr></thead>
<tbody>
<tr><td>overloading and overriding</td><td>3–11</td><td>4.B (this lesson)</td></tr>
<tr><td>interface</td><td>12–17</td><td>5.A</td></tr>
<tr><td>abstract class</td><td>18–22</td><td>5.A</td></tr>
<tr><td>nested and anonymous classes (marked "optional")</td><td>23–26</td><td>5.A</td></tr>
</tbody>
</table>
<p>The order matters: interfaces and abstract classes only make sense once you know overriding, because what they really do is <em>force</em> subclasses to override.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: <strong>nạp chồng và ghi đè</strong>, <strong>interface</strong>, <strong>lớp trừu tượng (abstract class)</strong>.</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Slide</th><th>Bài trên trang này</th></tr></thead>
<tbody>
<tr><td>nạp chồng và ghi đè</td><td>3–11</td><td>4.B (bài này)</td></tr>
<tr><td>interface</td><td>12–17</td><td>5.A</td></tr>
<tr><td>lớp trừu tượng</td><td>18–22</td><td>5.A</td></tr>
<tr><td>lớp lồng và lớp ẩn danh (slide ghi "optional")</td><td>23–26</td><td>5.A</td></tr>
</tbody>
</table>
<p>Thứ tự này có lý do: interface và lớp trừu tượng chỉ có nghĩa khi bạn đã biết ghi đè, vì việc thật sự của chúng là <em>buộc</em> lớp con phải ghi đè.</p>`],
      [3, 'Polymorphism',
        `<p class="y-chinh">🎯 In biology, polymorphism means an organism or species can have many forms or stages. Object-oriented languages "perfected" the idea as the ability to have <strong>many versions of a method</strong>, using two techniques: <strong>overloading</strong> and <strong>overriding</strong>.</p>
<p>➕ The two techniques have names you will hear in interviews:</p>
<table>
<thead><tr><th>Technique</th><th>Other name</th><th>Decided by</th><th>When</th></tr></thead>
<tbody>
<tr><td>overloading</td><td>compile-time (static) polymorphism</td><td>the compiler, from the argument types</td><td>when you build</td></tr>
<tr><td>overriding</td><td>run-time (dynamic) polymorphism</td><td>the JVM, from the object's class</td><td>when the line runs</td></tr>
</tbody>
</table>
<p>Be aware that books disagree on the word. The FU slides count both. Core Java (Horstmann) uses "polymorphism" only for the second: "an object variable can refer to multiple actual types", with <strong>dynamic binding</strong> choosing the method. If an interviewer asks "what is polymorphism?", give the second meaning first and mention overloading as the compile-time kind.</p>`,
        `<p class="y-chinh">🎯 Trong sinh học, đa hình nghĩa là một sinh vật hay loài có thể có nhiều dạng hoặc giai đoạn. Ngôn ngữ hướng đối tượng "hoàn thiện" ý đó thành khả năng có <strong>nhiều phiên bản của một phương thức</strong>, bằng hai kỹ thuật: <strong>nạp chồng (overloading)</strong> và <strong>ghi đè (overriding)</strong>.</p>
<p>➕ Hai kỹ thuật này có tên mà bạn sẽ nghe trong phỏng vấn:</p>
<table>
<thead><tr><th>Kỹ thuật</th><th>Tên khác</th><th>Ai quyết định</th><th>Khi nào</th></tr></thead>
<tbody>
<tr><td>nạp chồng</td><td>đa hình lúc biên dịch (tĩnh)</td><td>trình biên dịch, theo kiểu của đối số</td><td>lúc build</td></tr>
<tr><td>ghi đè</td><td>đa hình lúc chạy (động)</td><td>JVM, theo lớp của đối tượng</td><td>lúc dòng đó chạy</td></tr>
</tbody>
</table>
<p>Lưu ý các sách không thống nhất chữ này. Slide FU tính cả hai. Core Java (Horstmann) chỉ gọi cái thứ hai là "polymorphism": "một biến đối tượng có thể trỏ tới nhiều kiểu thật khác nhau", và <strong>ràng buộc động (dynamic binding)</strong> chọn phương thức. Nếu người phỏng vấn hỏi "đa hình là gì?", hãy nói nghĩa thứ hai trước rồi nhắc nạp chồng là loại lúc biên dịch.</p>`],
      [4, 'Polymorphism',
        `<p class="y-chinh">🎯 <strong>Overloading</strong>: a class can have several methods with the same name but different parameter types. <strong>Overriding</strong>: a method of the father class can be overridden in its derived classes — the body is replaced in the subclass.</p>
<pre class="trich"><code class="language-java">class Printer {
    void print(int n)       { System.out.println("print(int)    " + n); }        // overloading: 3 methods, one name
    void print(double d)    { System.out.println("print(double) " + d); }
    void print(String s)    { System.out.println("print(String) " + s); }
    String brand()          { return "generic printer"; }
}

class ColorPrinter extends Printer {
    @Override
    String brand()          { return "color printer"; }                         // overriding: same signature, new body
}</code></pre>
<div class="out">print(int) &nbsp;&nbsp;&nbsp;7<br>
print(double) 7.5<br>
print(String) A4<br>
color printer</div>
<p>One program, both techniques: the three <code>print</code> methods are overloads — the compiler looked at <code>7</code>, <code>7.5</code> and <code>"A4"</code> and wired each call to a different method; <code>brand()</code> is overridden — the variable is a <code>Printer</code>, the object is a <code>ColorPrinter</code>, and the JVM ran the object's version.</p>
<table>
<thead><tr><th></th><th>Overloading</th><th>Overriding</th></tr></thead>
<tbody>
<tr><td>where</td><td>same class (or added in a subclass)</td><td>subclass versus superclass</td></tr>
<tr><td>name</td><td>same</td><td>same</td></tr>
<tr><td>parameter list</td><td>must differ</td><td>must be identical</td></tr>
<tr><td>return type</td><td>free</td><td>same (or a subtype)</td></tr>
<tr><td>chosen</td><td>at compile time, by argument types</td><td>at run time, by the object</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 <strong>Nạp chồng (overloading)</strong>: một lớp có thể có vài phương thức cùng tên nhưng khác kiểu tham số. <strong>Ghi đè (overriding)</strong>: một phương thức của lớp cha có thể bị ghi đè ở các lớp dẫn xuất — thân phương thức được thay ở lớp con.</p>
<pre class="trich"><code class="language-java">class Printer {
    void print(int n)       { System.out.println("print(int)    " + n); }        // nạp chồng: 3 phương thức, một tên
    void print(double d)    { System.out.println("print(double) " + d); }
    void print(String s)    { System.out.println("print(String) " + s); }
    String brand()          { return "generic printer"; }
}

class ColorPrinter extends Printer {
    @Override
    String brand()          { return "color printer"; }                         // ghi đè: cùng chữ ký, thân mới
}</code></pre>
<div class="out">print(int) &nbsp;&nbsp;&nbsp;7<br>
print(double) 7.5<br>
print(String) A4<br>
color printer</div>
<p>Một chương trình, cả hai kỹ thuật: ba phương thức <code>print</code> là các bản nạp chồng — trình biên dịch nhìn <code>7</code>, <code>7.5</code> và <code>"A4"</code> rồi nối mỗi lời gọi tới một phương thức khác nhau; <code>brand()</code> bị ghi đè — biến là <code>Printer</code>, đối tượng là <code>ColorPrinter</code>, và JVM chạy phiên bản của đối tượng.</p>
<table>
<thead><tr><th></th><th>Nạp chồng</th><th>Ghi đè</th></tr></thead>
<tbody>
<tr><td>ở đâu</td><td>cùng một lớp (hoặc thêm ở lớp con)</td><td>lớp con so với lớp cha</td></tr>
<tr><td>tên</td><td>giống</td><td>giống</td></tr>
<tr><td>danh sách tham số</td><td>phải khác</td><td>phải y hệt</td></tr>
<tr><td>kiểu trả về</td><td>tuỳ ý</td><td>giống (hoặc kiểu con)</td></tr>
<tr><td>được chọn</td><td>lúc biên dịch, theo kiểu đối số</td><td>lúc chạy, theo đối tượng</td></tr>
</tbody>
</table>`],
      [5, 'Overloading',
        `<p class="y-chinh">🎯 Overloading addresses variations in a function's <strong>signature</strong>: calls with the same identifier but different argument types are bound to different definitions, and <strong>the compiler</strong> binds each call to the matching definition.</p>
<p>"Signature" = name + the number, types and order of the parameters. Not the return type, not the parameter names, not the modifiers. "Matching" follows fixed steps: an exact type match first, then <strong>widening</strong> (byte → int → long → double, char → int), then <strong>boxing</strong> (int → Integer), then varargs — and always using the <strong>static</strong> type of each argument:</p>
<pre class="trich"><code class="language-java">static void show(int x)     { System.out.println("show(int)     &lt;- " + x); }
static void show(long x)    { System.out.println("show(long)    &lt;- " + x); }
static void show(double x)  { System.out.println("show(double)  &lt;- " + x); }
static void show(Integer x) { System.out.println("show(Integer) &lt;- " + x); }
static void show(String x)  { System.out.println("show(String)  &lt;- " + x); }
static void show(Object x)  { System.out.println("show(Object)  &lt;- " + x); }</code></pre>
<pre class="trich"><code class="language-java">show(5);                    // exact match int
show(5L);                   // exact match long
show('A');                  // char widens to int (65), not String
byte b = 3;
show(b);                    // byte widens to int — widening wins over boxing
show(2.5f);                 // float widens to double
Integer boxed = 9;
show(boxed);                // exact match Integer
Object o = "hello";
show(o);                    // STATIC type Object -&gt; show(Object), even though it holds a String
show("hello");</code></pre>
<div class="out">show(int) &nbsp;&nbsp;&nbsp;&nbsp;&lt;- 5<br>
show(long) &nbsp;&nbsp;&nbsp;&lt;- 5<br>
show(int) &nbsp;&nbsp;&nbsp;&nbsp;&lt;- 65<br>
show(int) &nbsp;&nbsp;&nbsp;&nbsp;&lt;- 3<br>
show(double) &nbsp;&lt;- 2.5<br>
show(Integer) &lt;- 9<br>
show(Object) &nbsp;&lt;- hello<br>
show(String) &nbsp;&lt;- hello</div>
<p>The surprises are the FE questions: <code>'A'</code> goes to <code>show(int)</code> and prints 65 (a char is a number); a <code>byte</code> widens to <code>int</code> rather than being boxed; and <code>Object o = "hello"</code> calls <code>show(Object)</code> — overloads are chosen from the declared type, the object inside is ignored. What overloading cannot do, on the real JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== only the return type differs ==");
    viet(d, "ReturnOnly.java",
        "class Rectangle {\\n" +
        "    int area() { return 1; }\\n" +
        "    double area() { return 1.0; }\\n" +
        "}\\n");
    lenh(d, "javac", "ReturnOnly.java");

    System.out.println("== an ambiguous call: null fits String and Integer equally ==");
    viet(d, "Ambiguous.java",
        "public class Ambiguous {\\n" +
        "    static void show(String s)  { }\\n" +
        "    static void show(Integer i) { }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        show(null);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Ambiguous.java");
}</code></pre>
<div class="out">== only the return type differs ==<br>
&gt; javac ReturnOnly.java<br>
ReturnOnly.java:3: error: method area() is already defined in class Rectangle<br>
&nbsp;&nbsp;&nbsp;&nbsp;double area() { return 1.0; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== an ambiguous call: null fits String and Integer equally ==<br>
&gt; javac Ambiguous.java<br>
Ambiguous.java:5: error: reference to show is ambiguous<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;show(null);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;both method show(String) in Ambiguous and method show(Integer) in Ambiguous match<br>
1 error<br>
(exit code 1)</div>`,
        `<p class="y-chinh">🎯 Nạp chồng xử lý các biến thể trong <strong>chữ ký (signature)</strong> của một hàm: các lời gọi cùng tên nhưng khác kiểu đối số được gắn với các định nghĩa khác nhau, và <strong>trình biên dịch</strong> gắn mỗi lời gọi với định nghĩa khớp.</p>
<p>"Chữ ký" = tên + số lượng, kiểu và thứ tự tham số. Không gồm kiểu trả về, không gồm tên tham số, không gồm từ khoá phạm vi. "Khớp" đi theo các bước cố định: khớp đúng kiểu trước, rồi <strong>nới rộng (widening)</strong> (byte → int → long → double, char → int), rồi <strong>đóng hộp (boxing)</strong> (int → Integer), rồi varargs — và luôn dùng kiểu <strong>tĩnh</strong> của từng đối số:</p>
<pre class="trich"><code class="language-java">static void show(int x)     { System.out.println("show(int)     &lt;- " + x); }
static void show(long x)    { System.out.println("show(long)    &lt;- " + x); }
static void show(double x)  { System.out.println("show(double)  &lt;- " + x); }
static void show(Integer x) { System.out.println("show(Integer) &lt;- " + x); }
static void show(String x)  { System.out.println("show(String)  &lt;- " + x); }
static void show(Object x)  { System.out.println("show(Object)  &lt;- " + x); }</code></pre>
<pre class="trich"><code class="language-java">show(5);                    // khớp đúng int
show(5L);                   // khớp đúng long
show('A');                  // char nới rộng thành int (65), không phải String
byte b = 3;
show(b);                    // byte nới rộng thành int — nới rộng thắng đóng hộp
show(2.5f);                 // float nới rộng thành double
Integer boxed = 9;
show(boxed);                // khớp đúng Integer
Object o = "hello";
show(o);                    // kiểu TĨNH Object -&gt; show(Object), dù nó chứa một String
show("hello");</code></pre>
<div class="out">show(int) &nbsp;&nbsp;&nbsp;&nbsp;&lt;- 5<br>
show(long) &nbsp;&nbsp;&nbsp;&lt;- 5<br>
show(int) &nbsp;&nbsp;&nbsp;&nbsp;&lt;- 65<br>
show(int) &nbsp;&nbsp;&nbsp;&nbsp;&lt;- 3<br>
show(double) &nbsp;&lt;- 2.5<br>
show(Integer) &lt;- 9<br>
show(Object) &nbsp;&lt;- hello<br>
show(String) &nbsp;&lt;- hello</div>
<p>Các chỗ bất ngờ chính là câu hỏi FE: <code>'A'</code> đi vào <code>show(int)</code> và in 65 (char là một con số); <code>byte</code> được nới rộng thành <code>int</code> chứ không bị đóng hộp; và <code>Object o = "hello"</code> gọi <code>show(Object)</code> — bản nạp chồng được chọn theo kiểu khai báo, đối tượng bên trong bị bỏ qua. Điều nạp chồng không làm được, trên JDK 8 thật:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== only the return type differs ==");
    viet(d, "ReturnOnly.java",
        "class Rectangle {\\n" +
        "    int area() { return 1; }\\n" +
        "    double area() { return 1.0; }\\n" +
        "}\\n");
    lenh(d, "javac", "ReturnOnly.java");

    System.out.println("== an ambiguous call: null fits String and Integer equally ==");
    viet(d, "Ambiguous.java",
        "public class Ambiguous {\\n" +
        "    static void show(String s)  { }\\n" +
        "    static void show(Integer i) { }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        show(null);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Ambiguous.java");
}</code></pre>
<div class="out">== only the return type differs ==<br>
&gt; javac ReturnOnly.java<br>
ReturnOnly.java:3: error: method area() is already defined in class Rectangle<br>
&nbsp;&nbsp;&nbsp;&nbsp;double area() { return 1.0; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== an ambiguous call: null fits String and Integer equally ==<br>
&gt; javac Ambiguous.java<br>
Ambiguous.java:5: error: reference to show is ambiguous<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;show(null);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;both method show(String) in Ambiguous and method show(Integer) in Ambiguous match<br>
1 error<br>
(exit code 1)</div>`],
      [6, 'Overloading',
        `<p class="y-chinh">🎯 Overloading with <strong>constructors</strong> — <code>Rectangle()</code> and <code>Rectangle(int length, int width)</code> — and with <strong>general methods</strong> — <code>setValue(int)</code> and <code>setValue(int, int)</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/919b0b7bf38c2c6303e83170d16b851187f2a9fe.svg" alt="Slide 6: the Rectangle class box, with # for protected" loading="lazy" /><p class="chu-thich">🧩 Slide 6: the Rectangle class box, with # for protected</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 6 — one class, two overloaded constructors, two overloaded setValue
' Same name, different parameter lists: the compiler picks by the arguments
class Rectangle {
  # length : int
  # width : int
  + Rectangle()
  + Rectangle(length : int, width : int)
  + setValue(len : int) : void
  + setValue(len : int, wi : int) : void
}
note right of Rectangle
  "#" = protected
  setValue(5) calls setValue(int)
  setValue(10, 20) calls setValue(int, int)
end note
@enduml</code></pre></details>
<p>Constructors are the most common overloads: they all must carry the class name, so the parameter list is the only thing that can differ (the FU material's <code>Vase()</code>, <code>Vase(int, String)</code>, <code>Vase(int, String, int, String)</code>). Now look closely at the slide's <code>setValue</code>: <code>length= (len&gt;0)?1:0;</code> — the digit <strong>1</strong>, not <code>len</code>. Typed as on the slide and run:</p>
<pre class="trich"><code class="language-java">class Rectangle {
    protected int length;
    protected int width;
    public Rectangle() { }
    public Rectangle(int length, int width) { this.length = length; this.width = width; }
    public void setValue(int len) {
        length = (len &gt; 0) ? 1 : 0;             // as on the slide: 1, not len
    }
    public void setValue(int len, int wi) {
        length = (len &gt; 0) ? 1 : 0;             // the same copy-paste bug
        width = (wi &gt; 0) ? wi : 0;
    }
}</code></pre>
<pre class="trich"><code class="language-java">class FixedRectangle extends Rectangle {
    @Override
    public void setValue(int len) {
        length = (len &gt; 0) ? len : 0;
    }
    @Override
    public void setValue(int len, int wi) {
        setValue(len);                           // reuse the one-argument version
        width = (wi &gt; 0) ? wi : 0;
    }
}</code></pre>
<div class="out">slide version: setValue(10, 20) -&gt; length=1, width=20<br>
fixed version: setValue(10, 20) -&gt; length=10, width=20<br>
fixed version: setValue(-4) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; length=0</div>
<p>The slide version stores length 1 for any positive input. The fixed version also shows a good overloading habit: the two-argument <code>setValue</code> <strong>calls</strong> the one-argument one, so the rule "negative becomes 0" lives in one place. For constructors the same habit uses <code>this(...)</code> (lesson 4.A, slide 9).</p>
<p class="meo">🧠 Overloads that differ only by the order of two parameters of different types — <code>f(int, String)</code> and <code>f(String, int)</code> — are legal but a trap for whoever calls them. Prefer different names.</p>`,
        `<p class="y-chinh">🎯 Nạp chồng với <strong>constructor</strong> — <code>Rectangle()</code> và <code>Rectangle(int length, int width)</code> — và với <strong>phương thức thường</strong> — <code>setValue(int)</code> và <code>setValue(int, int)</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/919b0b7bf38c2c6303e83170d16b851187f2a9fe.svg" alt="Slide 6: hộp lớp Rectangle, dấu # là protected" loading="lazy" /><p class="chu-thich">🧩 Slide 6: hộp lớp Rectangle, dấu # là protected</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 6 — one class, two overloaded constructors, two overloaded setValue
' Cùng tên, khác danh sách tham số: trình biên dịch chọn theo đối số
class Rectangle {
  # length : int
  # width : int
  + Rectangle()
  + Rectangle(length : int, width : int)
  + setValue(len : int) : void
  + setValue(len : int, wi : int) : void
}
note right of Rectangle
  "#" = protected
  setValue(5) calls setValue(int)
  setValue(10, 20) calls setValue(int, int)
end note
@enduml</code></pre></details>
<p>Constructor là các bản nạp chồng hay gặp nhất: chúng đều phải mang tên lớp, nên chỉ danh sách tham số là khác được (<code>Vase()</code>, <code>Vase(int, String)</code>, <code>Vase(int, String, int, String)</code> trong học liệu FU). Giờ nhìn kỹ <code>setValue</code> trên slide: <code>length= (len&gt;0)?1:0;</code> — chữ số <strong>1</strong>, không phải <code>len</code>. Gõ đúng như slide và chạy:</p>
<pre class="trich"><code class="language-java">class Rectangle {
    protected int length;
    protected int width;
    public Rectangle() { }
    public Rectangle(int length, int width) { this.length = length; this.width = width; }
    public void setValue(int len) {
        length = (len &gt; 0) ? 1 : 0;             // như trên slide: 1, không phải len
    }
    public void setValue(int len, int wi) {
        length = (len &gt; 0) ? 1 : 0;             // cùng lỗi chép-dán
        width = (wi &gt; 0) ? wi : 0;
    }
}</code></pre>
<pre class="trich"><code class="language-java">class FixedRectangle extends Rectangle {
    @Override
    public void setValue(int len) {
        length = (len &gt; 0) ? len : 0;
    }
    @Override
    public void setValue(int len, int wi) {
        setValue(len);                           // dùng lại bản một tham số
        width = (wi &gt; 0) ? wi : 0;
    }
}</code></pre>
<div class="out">slide version: setValue(10, 20) -&gt; length=1, width=20<br>
fixed version: setValue(10, 20) -&gt; length=10, width=20<br>
fixed version: setValue(-4) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; length=0</div>
<p>Bản trên slide lưu length bằng 1 với mọi giá trị dương. Bản đã sửa còn cho thấy một thói quen nạp chồng tốt: <code>setValue</code> hai tham số <strong>gọi</strong> bản một tham số, nên luật "số âm thành 0" chỉ nằm một chỗ. Với constructor, thói quen đó dùng <code>this(...)</code> (bài 4.A, slide 9).</p>
<p class="meo">🧠 Các bản nạp chồng chỉ khác thứ tự hai tham số khác kiểu — <code>f(int, String)</code> và <code>f(String, int)</code> — là hợp lệ nhưng là cái bẫy cho người gọi. Nên đặt tên khác nhau.</p>`],
      [7, 'Overriding',
        `<p class="y-chinh">🎯 Overriding: a subclass provides the <strong>specific implementation</strong> of a method that one of its parent classes ("pare" on the slide is cut off: <em>parents</em>) has declared. Subclasses define their own unique behaviour and still share the functionality of the parent.</p>
<p>The slide gives the idea; the compiler enforces the rules. An override must have the <strong>same signature</strong>, a <strong>compatible return type</strong> (the same, or a subclass of it — a "covariant" return), an access level that is <strong>not more restrictive</strong> (FU material: "must not be more restrictive"), and it cannot override a <code>final</code> method or extend a <code>final</code> class. Each broken rule on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== rule: do not make it MORE restrictive (public -&gt; default) ==");
    viet(d, "Weaker.java",
        "class Rectangle { public int area() { return 0; } }\\n" +
        "class Box extends Rectangle { int area() { return 1; } }\\n");
    lenh(d, "javac", "Weaker.java");

    System.out.println("== rule: keep a compatible return type ==");
    viet(d, "ReturnType.java",
        "class Rectangle { public int area() { return 0; } }\\n" +
        "class Box extends Rectangle { public double area() { return 1.0; } }\\n");
    lenh(d, "javac", "ReturnType.java");

    System.out.println("== rule: a final method cannot be overridden ==");
    viet(d, "FinalMethod.java",
        "class Rectangle { public final int area() { return 0; } }\\n" +
        "class Box extends Rectangle { public int area() { return 1; } }\\n");
    lenh(d, "javac", "FinalMethod.java");

    System.out.println("== rule: a final class cannot be extended at all ==");
    viet(d, "FinalClass.java",
        "final class Rectangle { }\\n" +
        "class Box extends Rectangle { }\\n");
    lenh(d, "javac", "FinalClass.java");

    System.out.println("== @Override catches a misspelt name (tostring instead of toString) ==");
    viet(d, "Typo.java",
        "class Box {\\n" +
        "    @Override\\n" +
        "    public String tostring() { return \\"Box\\"; }\\n" +
        "}\\n");
    lenh(d, "javac", "Typo.java");
}</code></pre>
<div class="out">== rule: do not make it MORE restrictive (public -&gt; default) ==<br>
&gt; javac Weaker.java<br>
Weaker.java:2: error: area() in Box cannot override area() in Rectangle<br>
class Box extends Rectangle { int area() { return 1; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;attempting to assign weaker access privileges; was public<br>
1 error<br>
(exit code 1)<br>
== rule: keep a compatible return type ==<br>
&gt; javac ReturnType.java<br>
ReturnType.java:2: error: area() in Box cannot override area() in Rectangle<br>
class Box extends Rectangle { public double area() { return 1.0; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;return type double is not compatible with int<br>
1 error<br>
(exit code 1)<br>
== rule: a final method cannot be overridden ==<br>
&gt; javac FinalMethod.java<br>
FinalMethod.java:2: error: area() in Box cannot override area() in Rectangle<br>
class Box extends Rectangle { public int area() { return 1; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;overridden method is final<br>
1 error<br>
(exit code 1)<br>
== rule: a final class cannot be extended at all ==<br>
&gt; javac FinalClass.java<br>
FinalClass.java:2: error: cannot inherit from final Rectangle<br>
class Box extends Rectangle { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== @Override catches a misspelt name (tostring instead of toString) ==<br>
&gt; javac Typo.java<br>
Typo.java:2: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>The last case is why <code>@Override</code> exists. Without it, <code>tostring()</code> with a small s is just a new method; <code>println(box)</code> still calls <code>Object.toString()</code> and prints something like <code>Box@1b6d3586</code> — no error, wrong output. With it, javac stops you.</p>
<div class="pitfall">PE trap: the given interface or parent declares <code>public String toString()</code>; you type <code>String toString()</code> (no <code>public</code>) in your class. That is a "weaker access" error and the project does not build. Always copy the signature exactly, including <code>public</code>.</div>`,
        `<p class="y-chinh">🎯 Ghi đè: lớp con cung cấp <strong>cài đặt cụ thể</strong> cho một phương thức mà một trong các lớp cha của nó ("pare" trên slide bị cắt chữ: <em>parents</em>) đã khai báo. Lớp con định nghĩa hành vi riêng mà vẫn dùng chung chức năng của lớp cha.</p>
<p>Slide đưa ra ý tưởng; trình biên dịch canh các luật. Bản ghi đè phải có <strong>cùng chữ ký</strong>, <strong>kiểu trả về tương thích</strong> (giống hệt, hoặc là lớp con của nó — trả về "hiệp biến", covariant), mức truy cập <strong>không hẹp hơn</strong> (học liệu FU: "must not be more restrictive"), và không ghi đè được phương thức <code>final</code> hay kế thừa lớp <code>final</code>. Từng luật bị vi phạm, trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== rule: do not make it MORE restrictive (public -&gt; default) ==");
    viet(d, "Weaker.java",
        "class Rectangle { public int area() { return 0; } }\\n" +
        "class Box extends Rectangle { int area() { return 1; } }\\n");
    lenh(d, "javac", "Weaker.java");

    System.out.println("== rule: keep a compatible return type ==");
    viet(d, "ReturnType.java",
        "class Rectangle { public int area() { return 0; } }\\n" +
        "class Box extends Rectangle { public double area() { return 1.0; } }\\n");
    lenh(d, "javac", "ReturnType.java");

    System.out.println("== rule: a final method cannot be overridden ==");
    viet(d, "FinalMethod.java",
        "class Rectangle { public final int area() { return 0; } }\\n" +
        "class Box extends Rectangle { public int area() { return 1; } }\\n");
    lenh(d, "javac", "FinalMethod.java");

    System.out.println("== rule: a final class cannot be extended at all ==");
    viet(d, "FinalClass.java",
        "final class Rectangle { }\\n" +
        "class Box extends Rectangle { }\\n");
    lenh(d, "javac", "FinalClass.java");

    System.out.println("== @Override catches a misspelt name (tostring instead of toString) ==");
    viet(d, "Typo.java",
        "class Box {\\n" +
        "    @Override\\n" +
        "    public String tostring() { return \\"Box\\"; }\\n" +
        "}\\n");
    lenh(d, "javac", "Typo.java");
}</code></pre>
<div class="out">== rule: do not make it MORE restrictive (public -&gt; default) ==<br>
&gt; javac Weaker.java<br>
Weaker.java:2: error: area() in Box cannot override area() in Rectangle<br>
class Box extends Rectangle { int area() { return 1; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;attempting to assign weaker access privileges; was public<br>
1 error<br>
(exit code 1)<br>
== rule: keep a compatible return type ==<br>
&gt; javac ReturnType.java<br>
ReturnType.java:2: error: area() in Box cannot override area() in Rectangle<br>
class Box extends Rectangle { public double area() { return 1.0; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;return type double is not compatible with int<br>
1 error<br>
(exit code 1)<br>
== rule: a final method cannot be overridden ==<br>
&gt; javac FinalMethod.java<br>
FinalMethod.java:2: error: area() in Box cannot override area() in Rectangle<br>
class Box extends Rectangle { public int area() { return 1; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;overridden method is final<br>
1 error<br>
(exit code 1)<br>
== rule: a final class cannot be extended at all ==<br>
&gt; javac FinalClass.java<br>
FinalClass.java:2: error: cannot inherit from final Rectangle<br>
class Box extends Rectangle { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== @Override catches a misspelt name (tostring instead of toString) ==<br>
&gt; javac Typo.java<br>
Typo.java:2: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Trường hợp cuối là lý do <code>@Override</code> tồn tại. Không có nó, <code>tostring()</code> chữ s thường chỉ là một phương thức mới; <code>println(box)</code> vẫn gọi <code>Object.toString()</code> và in ra kiểu như <code>Box@1b6d3586</code> — không báo lỗi, chỉ sai output. Có nó, javac chặn bạn lại.</p>
<div class="pitfall">Bẫy PE: interface hoặc lớp cha đề cho khai báo <code>public String toString()</code>; bạn gõ <code>String toString()</code> (thiếu <code>public</code>) trong lớp của mình. Đó là lỗi "weaker access" (quyền truy cập hẹp hơn) và project không build được. Luôn chép chữ ký y nguyên, kể cả <code>public</code>.</div>`],
      [8, 'Overriding',
        `<p class="y-chinh">🎯 The slide's example: <code>Rectangle</code> overrides <code>toString()</code> to return <code>length + "@" + width</code>; <code>Box extends Rectangle</code> overrides it again and returns <code>super.toString() + "@" + height</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/d718f2fc9e4ef342d69f90a23df1a85fb9206dc9.svg" alt="Slide 8 with Object added: toString() is overridden twice down the hierarchy" loading="lazy" /><p class="chu-thich">🧩 Slide 8 with Object added: toString() is overridden twice down the hierarchy</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 8 — toString() appears in Object, Rectangle and Box: overridden twice
' The deepest version wins at run time; super.toString() reaches one level up
class Object {
  + toString() : String
}
class Rectangle {
  # length : int
  # width : int
  + Rectangle()
  + Rectangle(int, int)
  + setValue(int) : void
  + setValue(int, int) : void
  + toString() : String
}
class Box {
  # height : int
  + Box()
  + Box(int, int, int)
  + set(int, int, int) : void
  + toString() : String
}
Object &lt;|-- Rectangle
Rectangle &lt;|-- Box
note right of Rectangle
  return length + "@" + width
end note
note right of Box
  return super.toString() + "@" + height
end note
@enduml</code></pre></details>
<p>The slide writes the annotation as <code>@override</code>, with a small o, and uses curly quotes. Java is case-sensitive — the annotation type is <code>java.lang.Override</code> — so the slide's code does not compile:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== as on the slide: @override ==");
    viet(d, "Rectangle.java",
        "public class Rectangle {\\n" +
        "    protected int length = 2, width = 5;\\n" +
        "    @override\\n" +
        "    public String toString() {\\n" +
        "        return length + \\"@\\" + width;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Rectangle.java");
    System.out.println("== fixed: @Override ==");
    viet(d, "Rectangle.java",
        "public class Rectangle {\\n" +
        "    protected int length = 2, width = 5;\\n" +
        "    @Override\\n" +
        "    public String toString() {\\n" +
        "        return length + \\"@\\" + width;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Rectangle.java");
    System.out.println("(compiled without errors)");
}</code></pre>
<div class="out">== as on the slide: @override ==<br>
&gt; javac Rectangle.java<br>
Rectangle.java:3: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;@override<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class override<br>
&nbsp;&nbsp;location: class Rectangle<br>
1 error<br>
(exit code 1)<br>
== fixed: @Override ==<br>
&gt; javac Rectangle.java<br>
(compiled without errors)</div>
<p>With the spelling fixed, the slide's two classes run like this:</p>
<pre class="trich"><code class="language-java">class Rectangle {
    protected int length, width;
    public Rectangle() { }
    public Rectangle(int length, int width) { this.length = length; this.width = width; }
    @Override
    public String toString() {
        return length + "@" + width;
    }
}

class Box extends Rectangle {
    protected int height;
    public Box() { }
    public Box(int length, int width, int height) { super(length, width); this.height = height; }
    @Override
    public String toString() {
        return super.toString() + "@" + height;
    }
}</code></pre>
<pre class="trich"><code class="language-java">Rectangle r = new Rectangle(2, 5);
Rectangle b = new Box(2, 5, 3);
System.out.println(r);                   // same as r.toString()
System.out.println(b);                   // Box.toString(), although b is declared Rectangle
System.out.println("text: " + b);        // string concatenation also calls toString()
String def = new Plain().toString();
System.out.println("Object's toString starts with \\"Plain@\\": " + def.startsWith("Plain@"));</code></pre>
<div class="out">2@5<br>
2@5@3<br>
text: 2@5@3<br>
Object's toString starts with "Plain@": true</div>
<p><code>System.out.println(x)</code> and <code>"text: " + x</code> both call <code>x.toString()</code> — and because <code>toString</code> is overridden, the version chosen is the <strong>object's</strong>: <code>b</code> is declared <code>Rectangle</code>, prints the Box format. A class that overrides nothing gets <code>Object</code>'s format, "ClassName@hexHashCode".</p>`,
        `<p class="y-chinh">🎯 Ví dụ trên slide: <code>Rectangle</code> ghi đè <code>toString()</code> để trả về <code>length + "@" + width</code>; <code>Box extends Rectangle</code> ghi đè thêm lần nữa và trả về <code>super.toString() + "@" + height</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/d718f2fc9e4ef342d69f90a23df1a85fb9206dc9.svg" alt="Slide 8 có thêm Object: toString() bị ghi đè hai lần dọc theo cây" loading="lazy" /><p class="chu-thich">🧩 Slide 8 có thêm Object: toString() bị ghi đè hai lần dọc theo cây</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 8 — toString() appears in Object, Rectangle and Box: overridden twice
' Bản sâu nhất thắng lúc chạy; super.toString() với lên đúng một tầng
class Object {
  + toString() : String
}
class Rectangle {
  # length : int
  # width : int
  + Rectangle()
  + Rectangle(int, int)
  + setValue(int) : void
  + setValue(int, int) : void
  + toString() : String
}
class Box {
  # height : int
  + Box()
  + Box(int, int, int)
  + set(int, int, int) : void
  + toString() : String
}
Object &lt;|-- Rectangle
Rectangle &lt;|-- Box
note right of Rectangle
  return length + "@" + width
end note
note right of Box
  return super.toString() + "@" + height
end note
@enduml</code></pre></details>
<p>Slide viết annotation là <code>@override</code>, chữ o thường, và dùng ngoặc kép cong. Java phân biệt hoa thường — kiểu annotation là <code>java.lang.Override</code> — nên code trên slide không biên dịch được:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== as on the slide: @override ==");
    viet(d, "Rectangle.java",
        "public class Rectangle {\\n" +
        "    protected int length = 2, width = 5;\\n" +
        "    @override\\n" +
        "    public String toString() {\\n" +
        "        return length + \\"@\\" + width;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Rectangle.java");
    System.out.println("== fixed: @Override ==");
    viet(d, "Rectangle.java",
        "public class Rectangle {\\n" +
        "    protected int length = 2, width = 5;\\n" +
        "    @Override\\n" +
        "    public String toString() {\\n" +
        "        return length + \\"@\\" + width;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Rectangle.java");
    System.out.println("(compiled without errors)");
}</code></pre>
<div class="out">== as on the slide: @override ==<br>
&gt; javac Rectangle.java<br>
Rectangle.java:3: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;@override<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class override<br>
&nbsp;&nbsp;location: class Rectangle<br>
1 error<br>
(exit code 1)<br>
== fixed: @Override ==<br>
&gt; javac Rectangle.java<br>
(compiled without errors)</div>
<p>Sửa chính tả xong, hai lớp của slide chạy như sau:</p>
<pre class="trich"><code class="language-java">class Rectangle {
    protected int length, width;
    public Rectangle() { }
    public Rectangle(int length, int width) { this.length = length; this.width = width; }
    @Override
    public String toString() {
        return length + "@" + width;
    }
}

class Box extends Rectangle {
    protected int height;
    public Box() { }
    public Box(int length, int width, int height) { super(length, width); this.height = height; }
    @Override
    public String toString() {
        return super.toString() + "@" + height;
    }
}</code></pre>
<pre class="trich"><code class="language-java">Rectangle r = new Rectangle(2, 5);
Rectangle b = new Box(2, 5, 3);
System.out.println(r);                   // giống r.toString()
System.out.println(b);                   // Box.toString(), dù b khai báo kiểu Rectangle
System.out.println("text: " + b);        // nối chuỗi cũng gọi toString()
String def = new Plain().toString();
System.out.println("Object's toString starts with \\"Plain@\\": " + def.startsWith("Plain@"));</code></pre>
<div class="out">2@5<br>
2@5@3<br>
text: 2@5@3<br>
Object's toString starts with "Plain@": true</div>
<p><code>System.out.println(x)</code> và <code>"text: " + x</code> đều gọi <code>x.toString()</code> — và vì <code>toString</code> bị ghi đè nên bản được chọn là của <strong>đối tượng</strong>: <code>b</code> khai báo kiểu <code>Rectangle</code> mà in theo định dạng của Box. Lớp không ghi đè gì thì nhận định dạng của <code>Object</code>, "TênLớp@mãBămHệ16".</p>`],
      [9, 'Overriding Inherited Methods',
        `<p class="y-chinh">🎯 Two words side by side: an <strong>overridden</strong> method is an inherited method re-written (<code>toString</code> in Rectangle and again in Box); <strong>overloaded</strong> methods have the same name but different parameters in a class (<code>setValue(int)</code>, <code>setValue(int, int)</code>).</p>
<p>The school's Demo_1 (project Chapter06, three files in the default package), typed as in the screenshot:</p>
<pre class="trich"><code class="language-java">class Rectangle {
    protected int length=0, width=0;
    // Overloading methods
    public void setValue(int l)
    {  length = l&gt;0?l:0; }
    public void setValue(int l, int w)
    {  length = l&gt;0? l: 0;
       width= w&gt;0? w: 0;
    }
    // Overriding the toString method of the java.lang.Object class
    public String toString()
    {  return "[" + length + "," + width + "]}";
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Box extends Rectangle {
    int height=0;
    public void set (int l, int w, int h)
    {  super.setValue(l, w);
       height = h&gt;0? h: 0;
    }
    // Overriding the toString method
    // of the Rectangle class
    public String toString()
    {  return "[" + length + "," + width +
           "," + height + "]";
    }
}</code></pre>
<pre class="trich"><code class="language-java">public class Demo1GhiDe {        // Demo_1 on the slide
    public static void main(String[] args)
    {   Rectangle r= new Rectangle();
        r.setValue(5);
        System.out.println(r.toString());
        r.setValue(10,20);
        System.out.println(r.toString());
        Box b= new Box();
        b.set(5,10,15);
        System.out.println(b.toString());
    }
}</code></pre>
<div class="out">[5,0]}<br>
[10,20]}<br>
[5,10,15]</div>
<p>Same three lines as the slide's Output window — <code>[5,0]}</code> and <code>[10,20]}</code> with the same stray brace as deck "Inheritance", <code>[5,10,15]</code> without. Two details: <code>length</code> and <code>width</code> are <code>protected</code> here, so Box reads them directly (compare lesson 4.A, where they were private and Box needed getters); and <code>Box.set</code> calls <code>super.setValue(l, w)</code> although plain <code>setValue(l, w)</code> would reach the same method — <code>super.</code> is only <em>needed</em> when the subclass has overridden the method.</p>
<p>➕ Overloading also works across a hierarchy: if Box declared <code>setValue(int, int, int)</code> it would <strong>overload</strong> the inherited two versions, not override them — different parameter list.</p>`,
        `<p class="y-chinh">🎯 Hai từ đặt cạnh nhau: phương thức <strong>bị ghi đè (overridden)</strong> là phương thức kế thừa được viết lại (<code>toString</code> trong Rectangle rồi lại trong Box); các phương thức <strong>nạp chồng (overloaded)</strong> cùng tên nhưng khác tham số trong một lớp (<code>setValue(int)</code>, <code>setValue(int, int)</code>).</p>
<p>Demo_1 của trường (project Chapter06, ba file trong default package), gõ đúng như ảnh chụp:</p>
<pre class="trich"><code class="language-java">class Rectangle {
    protected int length=0, width=0;
    // Overloading methods
    public void setValue(int l)
    {  length = l&gt;0?l:0; }
    public void setValue(int l, int w)
    {  length = l&gt;0? l: 0;
       width= w&gt;0? w: 0;
    }
    // Overriding the toString method of the java.lang.Object class
    public String toString()
    {  return "[" + length + "," + width + "]}";
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Box extends Rectangle {
    int height=0;
    public void set (int l, int w, int h)
    {  super.setValue(l, w);
       height = h&gt;0? h: 0;
    }
    // Overriding the toString method
    // of the Rectangle class
    public String toString()
    {  return "[" + length + "," + width +
           "," + height + "]";
    }
}</code></pre>
<pre class="trich"><code class="language-java">public class Demo1GhiDe {        // Demo_1 trên slide
    public static void main(String[] args)
    {   Rectangle r= new Rectangle();
        r.setValue(5);
        System.out.println(r.toString());
        r.setValue(10,20);
        System.out.println(r.toString());
        Box b= new Box();
        b.set(5,10,15);
        System.out.println(b.toString());
    }
}</code></pre>
<div class="out">[5,0]}<br>
[10,20]}<br>
[5,10,15]</div>
<p>Đúng ba dòng như cửa sổ Output của slide — <code>[5,0]}</code> và <code>[10,20]}</code> với cùng dấu ngoặc lạc như bộ "Inheritance", <code>[5,10,15]</code> thì không có. Hai chi tiết: ở đây <code>length</code> và <code>width</code> là <code>protected</code>, nên Box đọc thẳng được (so với bài 4.A, nơi chúng là private và Box cần getter); và <code>Box.set</code> gọi <code>super.setValue(l, w)</code> dù chỉ viết <code>setValue(l, w)</code> cũng tới đúng phương thức đó — <code>super.</code> chỉ <em>cần thiết</em> khi lớp con đã ghi đè phương thức.</p>
<p>➕ Nạp chồng cũng xảy ra xuyên cây: nếu Box khai báo <code>setValue(int, int, int)</code> thì nó <strong>nạp chồng</strong> hai bản được kế thừa, không ghi đè chúng — vì danh sách tham số khác.</p>`],
      [10, 'How Can Overridden Method be Determined?',
        `<p class="y-chinh">🎯 One variable <code>obj</code> of type <code>Father</code> calls <code>m1()</code> and <code>m2()</code> twice: first on a Father object, then on a Son object. The output is m1, m2, m1, <strong>m2-overriden</strong> — the second <code>m2()</code> ran Son's body.</p>
<pre><code class="language-java">// release: 8
// Slide 10: the same variable obj calls m2() twice and gets two different bodies — the object, not the variable, decides

class Father {
    int x=0;
    void m1() { System.out.println("m1"); }
    void m2() { System.out.println("m2"); }
}
class Son extends Father {
    int y=2;
    void m2() { System.out.println("m2-overriden"); }
}
public class CallOverriddenMethod {
    public static void main(String[] args) {
        Father obj= new Father();
        obj.m1();
        obj.m2();
        obj= new Son();
        obj.m1();
        obj.m2();
    }
}</code></pre>
<div class="out">m1<br>
m2<br>
m1<br>
m2-overriden</div>
<p>Follow the arrows on the slide: the source line <code>obj.m2()</code> is the same text both times, and the compiler checked it only against <code>Father</code> (does Father have an <code>m2()</code>? yes). Which body runs is decided each time the line executes, from the object <code>obj</code> points to at that moment. <code>m1()</code> prints "m1" both times because Son did not override it — Son <em>inherits</em> Father's <code>m1</code>.</p>
<div class="pitfall">FE pattern (FE2 q28 in the Exam Room): <code>Food.getInfo()</code> returns <code>this.getFood()</code>, and <code>Order extends Food</code> overrides only <code>getFood()</code>. <code>new Order().getInfo()</code> prints "Taco", Order's food — even though <code>getInfo</code> is written in Food. A call inside the parent's code is still dynamic.</div>`,
        `<p class="y-chinh">🎯 Một biến <code>obj</code> kiểu <code>Father</code> gọi <code>m1()</code> và <code>m2()</code> hai lần: lần đầu trên đối tượng Father, lần sau trên đối tượng Son. Output là m1, m2, m1, <strong>m2-overriden</strong> — lần <code>m2()</code> thứ hai chạy thân của Son.</p>
<pre><code class="language-java">// release: 8
// Slide 10: cùng biến obj gọi m2() hai lần và nhận hai thân khác nhau — đối tượng quyết định, không phải biến

class Father {
    int x=0;
    void m1() { System.out.println("m1"); }
    void m2() { System.out.println("m2"); }
}
class Son extends Father {
    int y=2;
    void m2() { System.out.println("m2-overriden"); }
}
public class CallOverriddenMethod {
    public static void main(String[] args) {
        Father obj= new Father();
        obj.m1();
        obj.m2();
        obj= new Son();
        obj.m1();
        obj.m2();
    }
}</code></pre>
<div class="out">m1<br>
m2<br>
m1<br>
m2-overriden</div>
<p>Lần theo các mũi tên trên slide: dòng nguồn <code>obj.m2()</code> giống hệt nhau cả hai lần, và trình biên dịch chỉ kiểm nó với <code>Father</code> (Father có <code>m2()</code> không? có). Thân nào chạy được quyết định mỗi lần dòng đó thực thi, theo đối tượng mà <code>obj</code> đang trỏ tới lúc ấy. <code>m1()</code> in "m1" cả hai lần vì Son không ghi đè nó — Son <em>kế thừa</em> <code>m1</code> của Father.</p>
<div class="pitfall">Dạng câu FE (FE2 câu 28 trong Exam Room): <code>Food.getInfo()</code> trả về <code>this.getFood()</code>, và <code>Order extends Food</code> chỉ ghi đè <code>getFood()</code>. <code>new Order().getInfo()</code> in "Taco", món của Order — dù <code>getInfo</code> viết trong Food. Lời gọi nằm trong code của cha vẫn là lời gọi động.</div>`],
      [11, 'How Can Overridden Methods be Determined?',
        `<p class="y-chinh">🎯 Each loaded class has a <strong>method table</strong>: Father's says (m1 → 600, m2 → 650); Son's says (m1 → 600, m2 → 800) — m1 copied from Father, m2 replaced. Each object knows its class. A call follows object → class → table → code: <strong>dynamic binding</strong>, bound at run time from the object's dynamic type.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/6d87d1f4fda12f4e75c768c77128574716df757d.svg" alt="Slide 11 redrawn: the variable, the two objects, their classes and method tables" loading="lazy" /><p class="chu-thich">🧩 Slide 11 redrawn: the variable, the two objects, their classes and method tables</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 11 redrawn — each class has a method table; each object knows its class
' obj.m2() = follow the object to its class, look up m2 in that class's table, jump there
map "Father (class data)" as F {
  m1 =&gt; Father.m1 code
  m2 =&gt; Father.m2 code
}
map "Son (class data)" as S {
  m1 =&gt; Father.m1 code (inherited)
  m2 =&gt; Son.m2 code (overridden)
}
object "first object : Father" as o1 {
  x = 0
}
object "second object : Son" as o2 {
  x = 0
  y = 2
}
object "obj : Father (variable)" as v #EEF2FF
v ..&gt; o1 : obj = new Father()
v --&gt; o2 : obj = new Son()
o1 --&gt; F : class
o2 --&gt; S : class
S --&gt; F : superclass
note bottom of S
  obj.m1() -&gt; Father.m1 (only one version)
  obj.m2() -&gt; Son.m2, chosen at run time
end note
@enduml</code></pre></details>
<p>Evidence that the compiler does not choose: javap shows the bytecode of a method <code>run(Father obj) { obj.m2(); }</code> on JDK 8 — javac recorded only "invoke the virtual method <code>Father.m2</code>":</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Call.java",
        "class Father { void m2() { System.out.println(\\"m2\\"); } }\\n" +
        "class Son extends Father { void m2() { System.out.println(\\"m2-overriden\\"); } }\\n" +
        "public class Call {\\n" +
        "    static void run(Father obj) { obj.m2(); }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        run(new Father());\\n" +
        "        run(new Son());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Call.java");
    lenh(d, "java", "Call");
    lenhLoc(d, "static void run", "return", "javap", "-c", "Call");
}</code></pre>
<div class="out">&gt; javac Call.java<br>
&gt; java Call<br>
m2<br>
m2-overriden<br>
&gt; javap -c Call &nbsp;&nbsp;(only the method run)<br>
&nbsp;&nbsp;static void run(Father);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokevirtual #2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method Father.m2:()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: return</div>
<p>The same bytecode printed "m2" for one object and "m2-overriden" for the other — the JVM picked. Now the three things that are <strong>not</strong> dynamic, each a classic FE question:</p>
<pre class="trich"><code class="language-java">class Father {
    int x = 0;
    static String kind() { return "Father.kind (static)"; }
    void m2() { System.out.println("Father.m2"); }
    void call() { m2(); }                       // inside Father, but still dynamic
}
class Son extends Father {
    int x = 2;                                  // a SECOND field named x (hides Father.x)
    static String kind() { return "Son.kind (static)"; }
    @Override
    void m2() { System.out.println("Son.m2"); }
}</code></pre>
<pre class="trich"><code class="language-java">Father obj = new Son();
obj.m2();                                // dynamic binding -&gt; Son.m2
obj.call();                              // m2() inside Father's code still goes to Son.m2
System.out.println("obj.x = " + obj.x);  // fields are not polymorphic -&gt; Father's x
System.out.println("((Son) obj).x = " + ((Son) obj).x);
System.out.println(obj.kind());          // static -&gt; chosen by the declared type Father
greet(obj);                              // overload chosen at compile time by the declared type</code></pre>
<div class="out">Son.m2<br>
Son.m2<br>
obj.x = 0<br>
((Son) obj).x = 2<br>
Father.kind (static)<br>
greet(Father)</div>
<p>Fields (<code>obj.x</code> is Father's 0), static methods, and the choice between overloads all follow the <strong>declared</strong> type. Only instance methods follow the object. Two corrections to the slide's wording: "bonded" means <em>bound</em>; and "classes are loaded to static heap" is a simplification — on HotSpot since Java 8 class metadata lives in <strong>Metaspace</strong> (before Java 8: PermGen), and method tables ("vtables") are how HotSpot implements dynamic binding, not something the Java specification requires.</p>`,
        `<p class="y-chinh">🎯 Mỗi lớp đã nạp có một <strong>bảng phương thức (method table)</strong>: bảng của Father ghi (m1 → 600, m2 → 650); bảng của Son ghi (m1 → 600, m2 → 800) — m1 chép từ Father, m2 bị thay. Mỗi đối tượng biết lớp của nó. Một lời gọi đi theo đối tượng → lớp → bảng → code: <strong>ràng buộc động (dynamic binding)</strong>, gắn lúc chạy theo kiểu động của đối tượng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/6d87d1f4fda12f4e75c768c77128574716df757d.svg" alt="Slide 11 vẽ lại: biến, hai đối tượng, lớp của chúng và bảng phương thức" loading="lazy" /><p class="chu-thich">🧩 Slide 11 vẽ lại: biến, hai đối tượng, lớp của chúng và bảng phương thức</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 11 redrawn — each class has a method table; each object knows its class
' obj.m2() = đi theo đối tượng tới lớp của nó, tra m2 trong bảng của lớp đó, nhảy tới đó
map "Father (class data)" as F {
  m1 =&gt; Father.m1 code
  m2 =&gt; Father.m2 code
}
map "Son (class data)" as S {
  m1 =&gt; Father.m1 code (inherited)
  m2 =&gt; Son.m2 code (overridden)
}
object "first object : Father" as o1 {
  x = 0
}
object "second object : Son" as o2 {
  x = 0
  y = 2
}
object "obj : Father (variable)" as v #EEF2FF
v ..&gt; o1 : obj = new Father()
v --&gt; o2 : obj = new Son()
o1 --&gt; F : class
o2 --&gt; S : class
S --&gt; F : superclass
note bottom of S
  obj.m1() -&gt; Father.m1 (only one version)
  obj.m2() -&gt; Son.m2, chosen at run time
end note
@enduml</code></pre></details>
<p>Bằng chứng trình biên dịch không chọn: javap cho xem bytecode của phương thức <code>run(Father obj) { obj.m2(); }</code> trên JDK 8 — javac chỉ ghi "gọi phương thức ảo <code>Father.m2</code>":</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Call.java",
        "class Father { void m2() { System.out.println(\\"m2\\"); } }\\n" +
        "class Son extends Father { void m2() { System.out.println(\\"m2-overriden\\"); } }\\n" +
        "public class Call {\\n" +
        "    static void run(Father obj) { obj.m2(); }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        run(new Father());\\n" +
        "        run(new Son());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Call.java");
    lenh(d, "java", "Call");
    lenhLoc(d, "static void run", "return", "javap", "-c", "Call");
}</code></pre>
<div class="out">&gt; javac Call.java<br>
&gt; java Call<br>
m2<br>
m2-overriden<br>
&gt; javap -c Call &nbsp;&nbsp;(only the method run)<br>
&nbsp;&nbsp;static void run(Father);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokevirtual #2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method Father.m2:()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: return</div>
<p>Cùng một đoạn bytecode đó in "m2" với đối tượng này và "m2-overriden" với đối tượng kia — JVM đã chọn. Giờ là ba thứ <strong>không</strong> động, mỗi thứ là một câu FE kinh điển:</p>
<pre class="trich"><code class="language-java">class Father {
    int x = 0;
    static String kind() { return "Father.kind (static)"; }
    void m2() { System.out.println("Father.m2"); }
    void call() { m2(); }                       // nằm trong Father nhưng vẫn động
}
class Son extends Father {
    int x = 2;                                  // một trường x THỨ HAI (che Father.x)
    static String kind() { return "Son.kind (static)"; }
    @Override
    void m2() { System.out.println("Son.m2"); }
}</code></pre>
<pre class="trich"><code class="language-java">Father obj = new Son();
obj.m2();                                // ràng buộc động -&gt; Son.m2
obj.call();                              // m2() trong code của Father vẫn tới Son.m2
System.out.println("obj.x = " + obj.x);  // trường không đa hình -&gt; x của Father
System.out.println("((Son) obj).x = " + ((Son) obj).x);
System.out.println(obj.kind());          // static -&gt; chọn theo kiểu khai báo Father
greet(obj);                              // nạp chồng chọn lúc biên dịch theo kiểu khai báo</code></pre>
<div class="out">Son.m2<br>
Son.m2<br>
obj.x = 0<br>
((Son) obj).x = 2<br>
Father.kind (static)<br>
greet(Father)</div>
<p>Trường (<code>obj.x</code> là 0 của Father), phương thức static, và việc chọn giữa các bản nạp chồng đều đi theo kiểu <strong>khai báo</strong>. Chỉ phương thức thể hiện đi theo đối tượng. Hai chỗ đính chính cách viết của slide: "bonded" ý là <em>bound</em> (được gắn); và "classes are loaded to static heap" là cách nói đơn giản hoá — trên HotSpot từ Java 8, siêu dữ liệu của lớp nằm ở <strong>Metaspace</strong> (trước Java 8: PermGen), còn bảng phương thức ("vtable") là cách HotSpot cài đặt ràng buộc động, không phải thứ đặc tả Java bắt buộc.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li><code>void f(long x)</code> and <code>void f(Integer x)</code> — which one does <code>f(5)</code> call, and why?</li>
<li>A parent declares <code>public double getPrice()</code>. Which of these compile in a subclass: <code>double getPrice()</code>, <code>public double getPrice()</code>, <code>public int getPrice()</code>, <code>public double getPrice(int qty)</code>? Which one is an overload?</li>
<li><code>Father obj = new Son();</code> — what do <code>obj.x</code>, <code>obj.m2()</code> and <code>obj.kind()</code> print if Son redeclares all three (field, instance method, static method)?</li>
</ul>
<p>Next: Chapter 4's 🧪 practice (PE question 2 from scratch, hiding/overriding predictions), then the quiz. Chapter 5 continues this deck at slide 12.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li><code>void f(long x)</code> và <code>void f(Integer x)</code> — <code>f(5)</code> gọi bản nào, vì sao?</li>
<li>Lớp cha khai báo <code>public double getPrice()</code>. Câu nào biên dịch được ở lớp con: <code>double getPrice()</code>, <code>public double getPrice()</code>, <code>public int getPrice()</code>, <code>public double getPrice(int qty)</code>? Câu nào là nạp chồng?</li>
<li><code>Father obj = new Son();</code> — <code>obj.x</code>, <code>obj.m2()</code> và <code>obj.kind()</code> in gì nếu Son khai báo lại cả ba (trường, phương thức thể hiện, phương thức static)?</li>
</ul>
<p>Tiếp theo: bài 🧪 thực hành Chương 4 (dựng câu 2 PE từ đầu, đoán kết quả che giấu/ghi đè), rồi quiz. Chương 5 đi tiếp bộ slide này từ slide 12.</p>`),
    books([
      ['horstmann1', 'Ch. 5.1.5 "Polymorphism", 5.1.6 "Understanding Method Calls" (overloading resolution, dynamic binding, method tables)', 'Chương 5.1.5 "Polymorphism", 5.1.6 "Understanding Method Calls" (chọn bản nạp chồng, ràng buộc động, bảng phương thức)'],
      ['fuOffline', 'part "Polymorphism" — Overloading and Overriding, "How can overridden methods be determined?", function bindings', 'phần "Polymorphism" — Overloading và Overriding, "How can overridden methods be determined?", ràng buộc hàm'],
      ['jls8', '§15.12.2 Compile-Time Step 2: Determine Method Signature (the three phases), §8.4.8.3 Requirements in Overriding and Hiding', '§15.12.2 bước biên dịch 2: xác định chữ ký phương thức (ba pha), §8.4.8.3 yêu cầu khi ghi đè và che giấu'],
      ['jvms8', "§6.5 invokevirtual — how the JVM selects the method from the object's class", '§6.5 invokevirtual — cách JVM chọn phương thức theo lớp của đối tượng'],
    ]),
  ].join('\n'),
};

/* ───────── 4.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Inheritance the PE way: SpecX classes, a menu over Item, predict output ───────── */
const L_on_ch4 = {
  title: '4.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Inheritance the PE way: SpecX classes, a menu over Item, predict output|||4.3 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Kế thừa kiểu đề PE: lớp SpecX, menu trên Item, đoán output',
  slug: 'pro192-on-ch4',
  type: 'VIDEO',
  description: '7 bài tập Chương 4 có lời giải chạy thật trên JDK 8 và sơ đồ lớp cho từng bài: hai câu 2 đề PE dựng từ đầu (Laptop/SpecLaptop với setData/getValue sửa chuỗi, Ticket/VipTicket ghi đè getFinalPrice dùng lại luật cha bằng super), chương trình menu kiểu LAB211 quản lý bình/tượng/tranh trong một ArrayList<Item> có kiểm tra dữ liệu nhập, sáu câu đoán output kiểu FE (thứ tự constructor, gọi phương thức ghi đè trong constructor, static, trường, nạp chồng, this), đọc và sửa bảy lỗi javac thật, xử lý danh sách lẫn lộn bằng instanceof và ép kiểu, và sửa một thiết kế kế thừa sai; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.3 · Practice &amp; review</span>
<h2>Inheritance and polymorphism the way the PE asks for them</h2>
<p class="lead">Lessons 4.A and 4.B walked the school's two decks. These seven exercises turn them into the skills that score marks: question 2 of a PE paper ("write class X and class SpecX extending X"), a LAB211-style program that keeps different subclasses in one list, and the "what is printed?" questions of the FE. Every solution compiled with <code>--release 8</code> and ran on a real JDK 8; every exercise has its class diagram, because that is how the PE states its requirements. Try each one in NetBeans before opening the solution.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Exam link</th></tr></thead>
<tbody>
<tr><td>1</td><td>SpecLaptop extends Laptop: constructors, toString, setData, getValue</td><td>PE question 2 (PE10, PE14, PE4 in the Exam Room)</td></tr>
<tr><td>2</td><td>a menu over an ArrayList of Vase/Statue/Painting, validated input</td><td>LAB211, PE3/PE5 "list" commands</td></tr>
<tr><td>3</td><td>predict six outputs: constructor order, overriding, static, fields, overloads</td><td>FE "what is printed?"</td></tr>
<tr><td>4</td><td>read and fix seven real compile errors</td><td>the build must pass or the PE question scores 0</td></tr>
<tr><td>5</td><td>instanceof + safe downcast over a mixed list</td><td>FE casting questions, PE filters</td></tr>
<tr><td>6</td><td>VipTicket overrides getFinalPrice() and reuses the parent's rule</td><td>PE7 NetworkDevice/Router</td></tr>
<tr><td>7</td><td>is-a or has-a? fix a wrong hierarchy</td><td>design questions, interviews</td></tr>
</tbody>
</table>
<p>The real papers are in the <a href="/exam?course=PRO192">Exam Room</a> (filter PRO192). Do at least two question 2s there after this lesson, timed: 20 minutes each.</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.3 · Thực hành &amp; ôn tập</span>
<h2>Kế thừa và đa hình theo đúng cách đề PE hỏi</h2>
<p class="lead">Bài 4.A và 4.B đã đi hết hai bộ slide của trường. Bảy bài tập này biến chúng thành những kỹ năng ra điểm: câu 2 của đề PE ("viết lớp X và lớp SpecX kế thừa X"), một chương trình kiểu LAB211 giữ nhiều lớp con khác nhau trong một danh sách, và các câu "in ra gì?" của FE. Mọi lời giải đều biên dịch với <code>--release 8</code> và chạy trên JDK 8 thật; bài nào cũng có sơ đồ lớp, vì đề PE nêu yêu cầu đúng bằng cách đó. Hãy làm thử từng bài trong NetBeans trước khi mở lời giải.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Liên hệ đề thi</th></tr></thead>
<tbody>
<tr><td>1</td><td>SpecLaptop extends Laptop: constructor, toString, setData, getValue</td><td>câu 2 PE (PE10, PE14, PE4 trong Exam Room)</td></tr>
<tr><td>2</td><td>menu trên một ArrayList chứa Vase/Statue/Painting, kiểm tra dữ liệu nhập</td><td>LAB211, các lệnh "list" của PE3/PE5</td></tr>
<tr><td>3</td><td>đoán sáu output: thứ tự constructor, ghi đè, static, trường, nạp chồng</td><td>FE "in ra gì?"</td></tr>
<tr><td>4</td><td>đọc và sửa bảy lỗi biên dịch thật</td><td>build phải qua, không thì câu PE đó 0 điểm</td></tr>
<tr><td>5</td><td>instanceof + ép kiểu xuống an toàn trên danh sách lẫn lộn</td><td>câu FE về ép kiểu, các bộ lọc trong PE</td></tr>
<tr><td>6</td><td>VipTicket ghi đè getFinalPrice() và dùng lại luật của cha</td><td>PE7 NetworkDevice/Router</td></tr>
<tr><td>7</td><td>is-a hay has-a? sửa một cây kế thừa sai</td><td>câu hỏi thiết kế, phỏng vấn</td></tr>
</tbody>
</table>
<p>Đề thật nằm trong <a href="/exam?course=PRO192">Exam Room</a> (lọc PRO192). Sau bài này hãy làm ít nhất hai câu 2 ở đó, có bấm giờ: mỗi câu 20 phút.</p>`),
    bi(`<h3>🧪 Exercise 1 — PE question 2: Laptop and SpecLaptop (~20 min)</h3>
<p>(3 marks, PE style) Write a class <code>Laptop</code> and a class <code>SpecLaptop</code> extending <code>Laptop</code>, in the default package, with exactly these members:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0e811f6c5dfe7f81a767c98cbe770f369326707a.svg" alt="Exercise 1: the class diagram of the question" loading="lazy" /><p class="chu-thich">🧩 Exercise 1: the class diagram of the question</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — the class diagram as a PE paper gives it
' Write exactly these members; "-" private, "+" public
class Laptop {
  - brand : String
  - ram : int
  + Laptop()
  + Laptop(brand : String, ram : int)
  + getBrand() : String
  + getRam() : int
  + setBrand(brand : String) : void
  + toString() : String
}
class SpecLaptop {
  - model : String
  + SpecLaptop()
  + SpecLaptop(brand : String, ram : int, model : String)
  + getModel() : String
  + toString() : String
  + setData() : void
  + getValue() : String
}
Laptop &lt;|-- SpecLaptop
@enduml</code></pre></details>
<ul>
<li><code>Laptop.toString()</code> — "brand, ram"; <code>SpecLaptop.toString()</code> — "brand, ram, model".</li>
<li><code>setData()</code> — remove every space in brand and convert it to upper case.</li>
<li><code>getValue()</code> — if ram is even, return model without the characters at even positions (1-based: the first character is position 1); otherwise return model reversed.</li>
</ul>
<p>The given <code>Main</code> asks for brand, ram, model and a test case, then prints <code>OUTPUT:</code> and the result. TC1 prints a Laptop then a SpecLaptop; TC2 calls setData() and prints; TC3 prints getValue().</p>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Laptop {
    private String brand;
    private int ram;

    public Laptop() {
    }

    public Laptop(String brand, int ram) {
        this.brand = brand;
        this.ram = ram;
    }

    public String getBrand() { return brand; }

    public int getRam() { return ram; }

    public void setBrand(String brand) { this.brand = brand; }

    @Override
    public String toString() {
        return brand + ", " + ram;               // format: brand, ram
    }
}</code></pre>
<pre class="trich"><code class="language-java">class SpecLaptop extends Laptop {
    private String model;

    public SpecLaptop() {
    }

    public SpecLaptop(String brand, int ram, String model) {
        super(brand, ram);                       // the parent fills brand and ram
        this.model = model;
    }

    public String getModel() { return model; }

    @Override
    public String toString() {
        return super.toString() + ", " + model;  // format: brand, ram, model
    }

    // setData(): remove every space in brand and convert it to upper case
    public void setData() {
        setBrand(getBrand().replace(" ", "").toUpperCase());   // brand is private in Laptop: go through the setter
    }

    // getValue(): ram even -&gt; model without the characters at even positions (1-based); ram odd -&gt; model reversed
    public String getValue() {
        if (getRam() % 2 == 0) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i &lt; model.length(); i++) {
                if ((i + 1) % 2 != 0) sb.append(model.charAt(i));   // keep positions 1, 3, 5...
            }
            return sb.toString();
        }
        return new StringBuilder(model).reverse().toString();
    }
}</code></pre>
<p>Four sample runs, produced by a stand-in for the given Main (it prints each prompt with the value "typed"):</p>
<pre class="trich"><code class="language-java">// what the given Main prints for one run: prompts + typed values, then OUTPUT:
static void run(String brand, int ram, String model, int tc) {
    System.out.println("Enter brand: " + brand);
    System.out.println("Enter ram: " + ram);
    System.out.println("Enter model: " + model);
    System.out.println("Enter TC (1, 2 or 3): " + tc);
    System.out.println("OUTPUT:");
    SpecLaptop s = new SpecLaptop(brand, ram, model);
    if (tc == 1) {
        System.out.println(new Laptop(brand, ram));
        System.out.println(s);
    } else if (tc == 2) {
        s.setData();
        System.out.println(s);
    } else {
        System.out.println(s.getValue());
    }
    System.out.println();
}</code></pre>
<div class="out">Enter brand: dell<br>
Enter ram: 16<br>
Enter model: latitude<br>
Enter TC (1, 2 or 3): 1<br>
OUTPUT:<br>
dell, 16<br>
dell, 16, latitude<br>
<br>
Enter brand: hp pro book<br>
Enter ram: 8<br>
Enter model: x360<br>
Enter TC (1, 2 or 3): 2<br>
OUTPUT:<br>
HPPROBOOK, 8, x360<br>
<br>
Enter brand: asus<br>
Enter ram: 16<br>
Enter model: zenbook<br>
Enter TC (1, 2 or 3): 3<br>
OUTPUT:<br>
znok<br>
<br>
Enter brand: acer<br>
Enter ram: 7<br>
Enter model: swift<br>
Enter TC (1, 2 or 3): 3<br>
OUTPUT:<br>
tfiws</div>
<p>The three things graders check first: <code>super(brand, ram)</code> as the first line of the 3-argument constructor; <code>toString()</code> reusing the parent with <code>super.toString()</code>; and <code>setData()</code> going through <code>getBrand()</code>/<code>setBrand()</code> because <code>brand</code> is private in Laptop. Check getValue by hand: "zenbook" → positions 1 3 5 7 = z n o k.</p>
</details>
<div class="pitfall">Three traps from the real papers: PE14 says "color,quantity (<strong>no space after comma</strong>)" — one extra space fails the test case; PE4 declares <code>SpecCala(color: int, owner: String, price: int)</code> — the subclass's parameter order differs from <code>Cala(owner, price)</code>, so write <code>super(owner, price); this.color = color;</code>, not the parameters in order; and a missing <code>+SpecX()</code> default constructor breaks the given Main at compile time.</div>`,
    `<h3>🧪 Bài 1 — Câu 2 đề PE: Laptop và SpecLaptop (~20 phút)</h3>
<p>(3 điểm, kiểu PE) Viết lớp <code>Laptop</code> và lớp <code>SpecLaptop</code> kế thừa <code>Laptop</code>, trong default package, với đúng các thành viên sau:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0e811f6c5dfe7f81a767c98cbe770f369326707a.svg" alt="Bài 1: sơ đồ lớp của đề" loading="lazy" /><p class="chu-thich">🧩 Bài 1: sơ đồ lớp của đề</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — the class diagram as a PE paper gives it
' Viết đúng các thành viên này; "-" private, "+" public
class Laptop {
  - brand : String
  - ram : int
  + Laptop()
  + Laptop(brand : String, ram : int)
  + getBrand() : String
  + getRam() : int
  + setBrand(brand : String) : void
  + toString() : String
}
class SpecLaptop {
  - model : String
  + SpecLaptop()
  + SpecLaptop(brand : String, ram : int, model : String)
  + getModel() : String
  + toString() : String
  + setData() : void
  + getValue() : String
}
Laptop &lt;|-- SpecLaptop
@enduml</code></pre></details>
<ul>
<li><code>Laptop.toString()</code> — "brand, ram"; <code>SpecLaptop.toString()</code> — "brand, ram, model".</li>
<li><code>setData()</code> — bỏ mọi dấu cách trong brand rồi đổi sang chữ hoa.</li>
<li><code>getValue()</code> — nếu ram chẵn, trả về model đã bỏ các ký tự ở vị trí chẵn (đếm từ 1: ký tự đầu là vị trí 1); ngược lại trả về model đảo ngược.</li>
</ul>
<p><code>Main</code> đề cho hỏi brand, ram, model và một test case, rồi in <code>OUTPUT:</code> kèm kết quả. TC1 in một Laptop rồi một SpecLaptop; TC2 gọi setData() rồi in; TC3 in getValue().</p>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Laptop {
    private String brand;
    private int ram;

    public Laptop() {
    }

    public Laptop(String brand, int ram) {
        this.brand = brand;
        this.ram = ram;
    }

    public String getBrand() { return brand; }

    public int getRam() { return ram; }

    public void setBrand(String brand) { this.brand = brand; }

    @Override
    public String toString() {
        return brand + ", " + ram;               // định dạng: brand, ram
    }
}</code></pre>
<pre class="trich"><code class="language-java">class SpecLaptop extends Laptop {
    private String model;

    public SpecLaptop() {
    }

    public SpecLaptop(String brand, int ram, String model) {
        super(brand, ram);                       // cha điền brand và ram
        this.model = model;
    }

    public String getModel() { return model; }

    @Override
    public String toString() {
        return super.toString() + ", " + model;  // định dạng: brand, ram, model
    }

    // setData(): bỏ mọi dấu cách trong brand và đổi sang chữ hoa
    public void setData() {
        setBrand(getBrand().replace(" ", "").toUpperCase());   // brand là private trong Laptop: đi qua setter
    }

    // getValue(): ram chẵn -&gt; model bỏ các ký tự ở vị trí chẵn (đếm từ 1); ram lẻ -&gt; model đảo ngược
    public String getValue() {
        if (getRam() % 2 == 0) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i &lt; model.length(); i++) {
                if ((i + 1) % 2 != 0) sb.append(model.charAt(i));   // giữ vị trí 1, 3, 5...
            }
            return sb.toString();
        }
        return new StringBuilder(model).reverse().toString();
    }
}</code></pre>
<p>Bốn lần chạy mẫu, tạo bởi một bản thay cho Main đề cho (nó in mỗi lời nhắc kèm giá trị "đã gõ"):</p>
<pre class="trich"><code class="language-java">// thứ Main đề cho in ra trong một lần chạy: lời nhắc + giá trị gõ vào, rồi OUTPUT:
static void run(String brand, int ram, String model, int tc) {
    System.out.println("Enter brand: " + brand);
    System.out.println("Enter ram: " + ram);
    System.out.println("Enter model: " + model);
    System.out.println("Enter TC (1, 2 or 3): " + tc);
    System.out.println("OUTPUT:");
    SpecLaptop s = new SpecLaptop(brand, ram, model);
    if (tc == 1) {
        System.out.println(new Laptop(brand, ram));
        System.out.println(s);
    } else if (tc == 2) {
        s.setData();
        System.out.println(s);
    } else {
        System.out.println(s.getValue());
    }
    System.out.println();
}</code></pre>
<div class="out">Enter brand: dell<br>
Enter ram: 16<br>
Enter model: latitude<br>
Enter TC (1, 2 or 3): 1<br>
OUTPUT:<br>
dell, 16<br>
dell, 16, latitude<br>
<br>
Enter brand: hp pro book<br>
Enter ram: 8<br>
Enter model: x360<br>
Enter TC (1, 2 or 3): 2<br>
OUTPUT:<br>
HPPROBOOK, 8, x360<br>
<br>
Enter brand: asus<br>
Enter ram: 16<br>
Enter model: zenbook<br>
Enter TC (1, 2 or 3): 3<br>
OUTPUT:<br>
znok<br>
<br>
Enter brand: acer<br>
Enter ram: 7<br>
Enter model: swift<br>
Enter TC (1, 2 or 3): 3<br>
OUTPUT:<br>
tfiws</div>
<p>Ba chỗ người chấm nhìn đầu tiên: <code>super(brand, ram)</code> là dòng đầu của constructor 3 tham số; <code>toString()</code> dùng lại cha bằng <code>super.toString()</code>; và <code>setData()</code> đi qua <code>getBrand()</code>/<code>setBrand()</code> vì <code>brand</code> là private trong Laptop. Tự kiểm getValue bằng tay: "zenbook" → vị trí 1 3 5 7 = z n o k.</p>
</details>
<div class="pitfall">Ba cái bẫy từ đề thật: PE14 ghi "color,quantity (<strong>không có dấu cách sau dấu phẩy</strong>)" — thừa một dấu cách là trượt test case; PE4 khai báo <code>SpecCala(color: int, owner: String, price: int)</code> — thứ tự tham số của lớp con khác <code>Cala(owner, price)</code>, nên viết <code>super(owner, price); this.color = color;</code>, đừng chép tham số theo thứ tự; và thiếu constructor mặc định <code>+SpecX()</code> là Main đề cho báo lỗi biên dịch.</div>`),
    bi(`<h3>🧪 Exercise 2 — A LAB211-style menu over one list of Items (~40 min)</h3>
<p>Build the antique shop of deck "Inheritance" (slide 7) as a console program. One <code>ArrayList&lt;Item&gt;</code> holds Vase, Statue and Painting objects. Menu: 1–3 add a vase/statue/painting; 4 list all; 5 list one type; 6 total value and the most valuable item; 7 search by part of the creator's name (ignore case); 0 exit. Invalid input (a word instead of a number, a value outside its range, an empty text) must be asked again, not crash.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2bd6b6f59cf0e82a298b879bdae2d72923b6273d.svg" alt="Exercise 2: the menu class has a list of Items; three subclasses override getType() and toString()" loading="lazy" /><p class="chu-thich">🧩 Exercise 2: the menu class has a list of Items; three subclasses override getType() and toString()</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — the antique shop menu program
' The menu class HAS a list of Items; the list holds Vase, Statue and Painting objects
class CuaHangMenu {
  - {static} SC : Scanner
  - items : ArrayList&lt;Item&gt;
  ~ add(choice : int) : void
  ~ listAll() : void
  ~ listByType(type : String) : void
  ~ statistics() : void
  ~ searchByCreator(key : String) : void
  ~ run() : void
}
class Item {
  - value : int
  - creator : String
  + getValue() : int
  + getCreator() : String
  + getType() : String
  + toString() : String
}
class Vase {
  - height : int
  - material : String
}
class Statue {
  - weight : int
  - colour : String
}
class Painting {
  - height : int
  - width : int
  - isFramed : boolean
}
CuaHangMenu o-- "0..*" Item : items
Item &lt;|-- Vase
Item &lt;|-- Statue
Item &lt;|-- Painting
note right of Item
  getType() and toString()
  are overridden in every subclass
end note
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8, with the keyboard input below)</summary>
<pre class="trich"><code class="language-java">class Item {
    private int value;
    private String creator;
    public Item(int value, String creator) { this.value = value; this.creator = creator; }
    public int getValue() { return value; }
    public String getCreator() { return creator; }
    public String getType() { return "Item"; }               // overridden by every subclass
    @Override
    public String toString() { return String.format("%-8s|%6d | %-10s", getType(), value, creator); }
}

class Vase extends Item {
    private int height;
    private String material;
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);
        this.height = height; this.material = material;
    }
    @Override public String getType() { return "Vase"; }
    @Override public String toString() { return super.toString() + " | h=" + height + ", " + material; }
}

class Statue extends Item {
    private int weight;
    private String colour;
    public Statue(int value, String creator, int weight, String colour) {
        super(value, creator);
        this.weight = weight; this.colour = colour;
    }
    @Override public String getType() { return "Statue"; }
    @Override public String toString() { return super.toString() + " | " + weight + "kg, " + colour; }
}

class Painting extends Item {
    private int height, width;
    private boolean isFramed;
    public Painting(int value, String creator, int height, int width, boolean isFramed) {
        super(value, creator);
        this.height = height; this.width = width; this.isFramed = isFramed;
    }
    @Override public String getType() { return "Painting"; }
    @Override public String toString() { return super.toString() + " | " + height + "x" + width + (isFramed ? ", framed" : ""); }
}</code></pre>
<pre class="trich"><code class="language-java">static String readText(String msg) {
    while (true) {
        System.out.print(msg);
        String s = SC.nextLine().trim();
        System.out.println(s);                                 // echo, so the transcript shows what was typed
        if (!s.isEmpty()) return s;
        System.out.println("  ! must not be empty");
    }
}
static int readInt(String msg, int min, int max) {
    while (true) {
        String s = readText(msg);
        try {
            int n = Integer.parseInt(s);
            if (n &gt;= min &amp;&amp; n &lt;= max) return n;
            System.out.println("  ! must be from " + min + " to " + max);
        } catch (NumberFormatException e) {
            System.out.println("  ! not an integer");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">void add(int choice) {
    int value = readInt("  value: ", 1, 1000000);
    String creator = readText("  creator: ");
    if (choice == 1) {
        items.add(new Vase(value, creator, readInt("  height: ", 1, 500), readText("  material: ")));
    } else if (choice == 2) {
        items.add(new Statue(value, creator, readInt("  weight: ", 1, 5000), readText("  colour: ")));
    } else {
        items.add(new Painting(value, creator, readInt("  height: ", 1, 500), readInt("  width: ", 1, 500),
                readText("  framed (y/n): ").equalsIgnoreCase("y")));
    }
    System.out.println("  added: " + items.get(items.size() - 1).getType());
}

void listAll() {
    if (items.isEmpty()) { System.out.println("  (empty)"); return; }
    for (Item it : items) System.out.println("  " + it);      // each object's own toString()
}

void listByType(String type) {
    int n = 0;
    for (Item it : items) {
        boolean match = (type.equalsIgnoreCase("Vase") &amp;&amp; it instanceof Vase)
                     || (type.equalsIgnoreCase("Statue") &amp;&amp; it instanceof Statue)
                     || (type.equalsIgnoreCase("Painting") &amp;&amp; it instanceof Painting);
        if (match) { System.out.println("  " + it); n++; }
    }
    System.out.println("  " + n + " " + type + "(s)");
}

void statistics() {
    if (items.isEmpty()) { System.out.println("  (empty)"); return; }
    long total = 0;
    Item max = items.get(0);
    for (Item it : items) {
        total += it.getValue();
        if (it.getValue() &gt; max.getValue()) max = it;
    }
    System.out.println("  total value: " + total);
    System.out.println("  most valuable: " + max);
}

void searchByCreator(String key) {
    boolean found = false;
    for (Item it : items) {
        if (it.getCreator().toLowerCase().contains(key.toLowerCase())) { System.out.println("  " + it); found = true; }
    }
    if (!found) System.out.println("  not found");
}</code></pre>
<pre class="trich"><code class="language-java">void run() {
    while (true) {
        System.out.println("== ANTIQUE SHOP ==  1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit");
        int c = readInt("Choose: ", 0, 7);
        switch (c) {                                           // classic switch: Java 8 has no "-&gt;" cases
            case 1: case 2: case 3: add(c); break;
            case 4: listAll(); break;
            case 5: listByType(readText("  type (Vase/Statue/Painting): ")); break;
            case 6: statistics(); break;
            case 7: searchByCreator(readText("  creator contains: ")); break;
            default: System.out.println("Bye"); return;
        }
    }
}</code></pre>
<p>Input typed (one value per line): <code>1, 1500, Paris, abc, 35, porcelain, 2, -20, 2000, Rodin, 800, bronze, 3, 900, Monet, 60, 90, y, 1, 700, Ming, 25, clay, 4, 5, Vase, 6, 7, mo, 9, 0</code>.</p>
<div class="out">== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 1<br>
&nbsp;&nbsp;value: 1500<br>
&nbsp;&nbsp;creator: Paris<br>
&nbsp;&nbsp;height: abc<br>
&nbsp;&nbsp;! not an integer<br>
&nbsp;&nbsp;height: 35<br>
&nbsp;&nbsp;material: porcelain<br>
&nbsp;&nbsp;added: Vase<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 2<br>
&nbsp;&nbsp;value: -20<br>
&nbsp;&nbsp;! must be from 1 to 1000000<br>
&nbsp;&nbsp;value: 2000<br>
&nbsp;&nbsp;creator: Rodin<br>
&nbsp;&nbsp;weight: 800<br>
&nbsp;&nbsp;colour: bronze<br>
&nbsp;&nbsp;added: Statue<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 3<br>
&nbsp;&nbsp;value: 900<br>
&nbsp;&nbsp;creator: Monet<br>
&nbsp;&nbsp;height: 60<br>
&nbsp;&nbsp;width: 90<br>
&nbsp;&nbsp;framed (y/n): y<br>
&nbsp;&nbsp;added: Painting<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 1<br>
&nbsp;&nbsp;value: 700<br>
&nbsp;&nbsp;creator: Ming<br>
&nbsp;&nbsp;height: 25<br>
&nbsp;&nbsp;material: clay<br>
&nbsp;&nbsp;added: Vase<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 4<br>
&nbsp;&nbsp;Vase &nbsp;&nbsp;&nbsp;| &nbsp;1500 | Paris &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| h=35, porcelain<br>
&nbsp;&nbsp;Statue &nbsp;| &nbsp;2000 | Rodin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 800kg, bronze<br>
&nbsp;&nbsp;Painting| &nbsp;&nbsp;900 | Monet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 60x90, framed<br>
&nbsp;&nbsp;Vase &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;700 | Ming &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| h=25, clay<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 5<br>
&nbsp;&nbsp;type (Vase/Statue/Painting): Vase<br>
&nbsp;&nbsp;Vase &nbsp;&nbsp;&nbsp;| &nbsp;1500 | Paris &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| h=35, porcelain<br>
&nbsp;&nbsp;Vase &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;700 | Ming &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| h=25, clay<br>
&nbsp;&nbsp;2 Vase(s)<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 6<br>
&nbsp;&nbsp;total value: 5100<br>
&nbsp;&nbsp;most valuable: Statue &nbsp;| &nbsp;2000 | Rodin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 800kg, bronze<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 7<br>
&nbsp;&nbsp;creator contains: mo<br>
&nbsp;&nbsp;Painting| &nbsp;&nbsp;900 | Monet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 60x90, framed<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 9<br>
&nbsp;&nbsp;! must be from 0 to 7<br>
Choose: 0<br>
Bye</div>
<p>Where polymorphism does the work: <code>listAll()</code> prints four different formats with one line <code>println(it)</code>; <code>statistics()</code> uses only <code>getValue()</code> from Item. Only <code>listByType</code> needs <code>instanceof</code> — and even that could be <code>it.getType().equalsIgnoreCase(type)</code>, since every subclass overrides <code>getType()</code>.</p>
</details>
<div class="pitfall">Make ONE <code>Scanner</code> for the whole program (here a <code>static final</code> field). A method that does <code>new Scanner(System.in)</code> on every call works when you type by hand, but when input is piped — as LAB211 graders and PE markers do — the first Scanner swallows the buffered lines and the next one finds nothing (<code>NoSuchElementException</code>). The school's own Banking project has exactly this bug in <code>Menu.getSelected()</code>; Chapter 5's practice measures it.</div>`,
    `<h3>🧪 Bài 2 — Menu kiểu LAB211 trên một danh sách Item (~40 phút)</h3>
<p>Dựng cửa hàng đồ cổ của bộ "Inheritance" (slide 7) thành một chương trình console. Một <code>ArrayList&lt;Item&gt;</code> chứa các đối tượng Vase, Statue và Painting. Menu: 1–3 thêm bình/tượng/tranh; 4 liệt kê tất cả; 5 liệt kê một loại; 6 tổng giá trị và món giá trị nhất; 7 tìm theo một phần tên người tạo (không phân biệt hoa thường); 0 thoát. Dữ liệu nhập sai (gõ chữ thay vì số, giá trị ngoài khoảng, chuỗi rỗng) phải được hỏi lại, không được sập.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2bd6b6f59cf0e82a298b879bdae2d72923b6273d.svg" alt="Bài 2: lớp menu có một danh sách Item; ba lớp con ghi đè getType() và toString()" loading="lazy" /><p class="chu-thich">🧩 Bài 2: lớp menu có một danh sách Item; ba lớp con ghi đè getType() và toString()</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — the antique shop menu program
' Lớp menu CÓ một danh sách Item; danh sách chứa đối tượng Vase, Statue, Painting
class CuaHangMenu {
  - {static} SC : Scanner
  - items : ArrayList&lt;Item&gt;
  ~ add(choice : int) : void
  ~ listAll() : void
  ~ listByType(type : String) : void
  ~ statistics() : void
  ~ searchByCreator(key : String) : void
  ~ run() : void
}
class Item {
  - value : int
  - creator : String
  + getValue() : int
  + getCreator() : String
  + getType() : String
  + toString() : String
}
class Vase {
  - height : int
  - material : String
}
class Statue {
  - weight : int
  - colour : String
}
class Painting {
  - height : int
  - width : int
  - isFramed : boolean
}
CuaHangMenu o-- "0..*" Item : items
Item &lt;|-- Vase
Item &lt;|-- Statue
Item &lt;|-- Painting
note right of Item
  getType() and toString()
  are overridden in every subclass
end note
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8, với dữ liệu bàn phím bên dưới)</summary>
<pre class="trich"><code class="language-java">class Item {
    private int value;
    private String creator;
    public Item(int value, String creator) { this.value = value; this.creator = creator; }
    public int getValue() { return value; }
    public String getCreator() { return creator; }
    public String getType() { return "Item"; }               // mọi lớp con ghi đè
    @Override
    public String toString() { return String.format("%-8s|%6d | %-10s", getType(), value, creator); }
}

class Vase extends Item {
    private int height;
    private String material;
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);
        this.height = height; this.material = material;
    }
    @Override public String getType() { return "Vase"; }
    @Override public String toString() { return super.toString() + " | h=" + height + ", " + material; }
}

class Statue extends Item {
    private int weight;
    private String colour;
    public Statue(int value, String creator, int weight, String colour) {
        super(value, creator);
        this.weight = weight; this.colour = colour;
    }
    @Override public String getType() { return "Statue"; }
    @Override public String toString() { return super.toString() + " | " + weight + "kg, " + colour; }
}

class Painting extends Item {
    private int height, width;
    private boolean isFramed;
    public Painting(int value, String creator, int height, int width, boolean isFramed) {
        super(value, creator);
        this.height = height; this.width = width; this.isFramed = isFramed;
    }
    @Override public String getType() { return "Painting"; }
    @Override public String toString() { return super.toString() + " | " + height + "x" + width + (isFramed ? ", framed" : ""); }
}</code></pre>
<pre class="trich"><code class="language-java">static String readText(String msg) {
    while (true) {
        System.out.print(msg);
        String s = SC.nextLine().trim();
        System.out.println(s);                                 // in lại để bản ghi thấy được thứ đã gõ
        if (!s.isEmpty()) return s;
        System.out.println("  ! must not be empty");
    }
}
static int readInt(String msg, int min, int max) {
    while (true) {
        String s = readText(msg);
        try {
            int n = Integer.parseInt(s);
            if (n &gt;= min &amp;&amp; n &lt;= max) return n;
            System.out.println("  ! must be from " + min + " to " + max);
        } catch (NumberFormatException e) {
            System.out.println("  ! not an integer");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">void add(int choice) {
    int value = readInt("  value: ", 1, 1000000);
    String creator = readText("  creator: ");
    if (choice == 1) {
        items.add(new Vase(value, creator, readInt("  height: ", 1, 500), readText("  material: ")));
    } else if (choice == 2) {
        items.add(new Statue(value, creator, readInt("  weight: ", 1, 5000), readText("  colour: ")));
    } else {
        items.add(new Painting(value, creator, readInt("  height: ", 1, 500), readInt("  width: ", 1, 500),
                readText("  framed (y/n): ").equalsIgnoreCase("y")));
    }
    System.out.println("  added: " + items.get(items.size() - 1).getType());
}

void listAll() {
    if (items.isEmpty()) { System.out.println("  (empty)"); return; }
    for (Item it : items) System.out.println("  " + it);      // toString() của chính từng đối tượng
}

void listByType(String type) {
    int n = 0;
    for (Item it : items) {
        boolean match = (type.equalsIgnoreCase("Vase") &amp;&amp; it instanceof Vase)
                     || (type.equalsIgnoreCase("Statue") &amp;&amp; it instanceof Statue)
                     || (type.equalsIgnoreCase("Painting") &amp;&amp; it instanceof Painting);
        if (match) { System.out.println("  " + it); n++; }
    }
    System.out.println("  " + n + " " + type + "(s)");
}

void statistics() {
    if (items.isEmpty()) { System.out.println("  (empty)"); return; }
    long total = 0;
    Item max = items.get(0);
    for (Item it : items) {
        total += it.getValue();
        if (it.getValue() &gt; max.getValue()) max = it;
    }
    System.out.println("  total value: " + total);
    System.out.println("  most valuable: " + max);
}

void searchByCreator(String key) {
    boolean found = false;
    for (Item it : items) {
        if (it.getCreator().toLowerCase().contains(key.toLowerCase())) { System.out.println("  " + it); found = true; }
    }
    if (!found) System.out.println("  not found");
}</code></pre>
<pre class="trich"><code class="language-java">void run() {
    while (true) {
        System.out.println("== ANTIQUE SHOP ==  1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit");
        int c = readInt("Choose: ", 0, 7);
        switch (c) {                                           // switch kiểu cũ: Java 8 chưa có case "-&gt;"
            case 1: case 2: case 3: add(c); break;
            case 4: listAll(); break;
            case 5: listByType(readText("  type (Vase/Statue/Painting): ")); break;
            case 6: statistics(); break;
            case 7: searchByCreator(readText("  creator contains: ")); break;
            default: System.out.println("Bye"); return;
        }
    }
}</code></pre>
<p>Dữ liệu đã gõ (mỗi giá trị một dòng): <code>1, 1500, Paris, abc, 35, porcelain, 2, -20, 2000, Rodin, 800, bronze, 3, 900, Monet, 60, 90, y, 1, 700, Ming, 25, clay, 4, 5, Vase, 6, 7, mo, 9, 0</code>.</p>
<div class="out">== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 1<br>
&nbsp;&nbsp;value: 1500<br>
&nbsp;&nbsp;creator: Paris<br>
&nbsp;&nbsp;height: abc<br>
&nbsp;&nbsp;! not an integer<br>
&nbsp;&nbsp;height: 35<br>
&nbsp;&nbsp;material: porcelain<br>
&nbsp;&nbsp;added: Vase<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 2<br>
&nbsp;&nbsp;value: -20<br>
&nbsp;&nbsp;! must be from 1 to 1000000<br>
&nbsp;&nbsp;value: 2000<br>
&nbsp;&nbsp;creator: Rodin<br>
&nbsp;&nbsp;weight: 800<br>
&nbsp;&nbsp;colour: bronze<br>
&nbsp;&nbsp;added: Statue<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 3<br>
&nbsp;&nbsp;value: 900<br>
&nbsp;&nbsp;creator: Monet<br>
&nbsp;&nbsp;height: 60<br>
&nbsp;&nbsp;width: 90<br>
&nbsp;&nbsp;framed (y/n): y<br>
&nbsp;&nbsp;added: Painting<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 1<br>
&nbsp;&nbsp;value: 700<br>
&nbsp;&nbsp;creator: Ming<br>
&nbsp;&nbsp;height: 25<br>
&nbsp;&nbsp;material: clay<br>
&nbsp;&nbsp;added: Vase<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 4<br>
&nbsp;&nbsp;Vase &nbsp;&nbsp;&nbsp;| &nbsp;1500 | Paris &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| h=35, porcelain<br>
&nbsp;&nbsp;Statue &nbsp;| &nbsp;2000 | Rodin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 800kg, bronze<br>
&nbsp;&nbsp;Painting| &nbsp;&nbsp;900 | Monet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 60x90, framed<br>
&nbsp;&nbsp;Vase &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;700 | Ming &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| h=25, clay<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 5<br>
&nbsp;&nbsp;type (Vase/Statue/Painting): Vase<br>
&nbsp;&nbsp;Vase &nbsp;&nbsp;&nbsp;| &nbsp;1500 | Paris &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| h=35, porcelain<br>
&nbsp;&nbsp;Vase &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;700 | Ming &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| h=25, clay<br>
&nbsp;&nbsp;2 Vase(s)<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 6<br>
&nbsp;&nbsp;total value: 5100<br>
&nbsp;&nbsp;most valuable: Statue &nbsp;| &nbsp;2000 | Rodin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 800kg, bronze<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 7<br>
&nbsp;&nbsp;creator contains: mo<br>
&nbsp;&nbsp;Painting| &nbsp;&nbsp;900 | Monet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 60x90, framed<br>
== ANTIQUE SHOP == &nbsp;1.Add vase 2.Add statue 3.Add painting 4.List 5.List by type 6.Statistics 7.Search 0.Exit<br>
Choose: 9<br>
&nbsp;&nbsp;! must be from 0 to 7<br>
Choose: 0<br>
Bye</div>
<p>Chỗ đa hình gánh việc: <code>listAll()</code> in bốn định dạng khác nhau chỉ bằng một dòng <code>println(it)</code>; <code>statistics()</code> chỉ dùng <code>getValue()</code> của Item. Chỉ <code>listByType</code> cần <code>instanceof</code> — và kể cả nó cũng có thể viết <code>it.getType().equalsIgnoreCase(type)</code>, vì lớp con nào cũng ghi đè <code>getType()</code>.</p>
</details>
<div class="pitfall">Tạo MỘT <code>Scanner</code> cho cả chương trình (ở đây là một trường <code>static final</code>). Phương thức nào cũng <code>new Scanner(System.in)</code> mỗi lần gọi thì chạy được khi bạn gõ tay, nhưng khi dữ liệu được nạp qua đường ống (pipe) — như người chấm LAB211 và máy chấm PE làm — Scanner đầu tiên nuốt hết các dòng đã đệm và Scanner sau chẳng còn gì (<code>NoSuchElementException</code>). Chính project Banking của trường dính đúng lỗi này ở <code>Menu.getSelected()</code>; bài thực hành Chương 5 đo thật nó.</div>`),
    bi(`<h3>🧪 Exercise 3 — Predict six outputs (~15 min)</h3>
<p>FE style: write down what each line prints <em>before</em> opening the answer. Each small hierarchy hides one rule.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/36ee90e5d7d437ccde3a2079b64a8e8efd5d0260.svg" alt="Exercise 3: the six hierarchies; note which methods are static and which fields are redeclared" loading="lazy" /><p class="chu-thich">🧩 Exercise 3: the six hierarchies; note which methods are static and which fields are redeclared</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — the six small hierarchies (a) to (f)
' Each package hides one rule; read the modifiers before the bodies
hide empty members
package "(a) constructors" {
  class A
  class B
  class C
  A &lt;|-- B
  B &lt;|-- C
}
package "(b) call in constructor" {
  class Base {
    ~ show() : void
  }
  class Derived {
    ~ x : int = 5
    ~ show() : void
  }
  Base &lt;|-- Derived
}
package "(c) static vs instance" {
  class P {
    ~ {static} who() : String
    ~ me() : String
  }
  class Q {
    ~ {static} who() : String
    ~ me() : String
  }
  P &lt;|-- Q
}
package "(d) fields" {
  class M {
    ~ i : int = 100
    ~ printValue() : void
  }
  class N {
    ~ i : int = 120
    ~ printValue() : void
  }
  M &lt;|-- N
}
package "(e) overloads" {
  class Animal
  class Dog
  Animal &lt;|-- Dog
}
package "(f) a call inside the parent" {
  class Food {
    ~ getFood() : String
    ~ getInfo() : String
  }
  class Order {
    ~ getFood() : String
  }
  Food &lt;|-- Order
}
' two rows of three packages
C -[hidden]down- M
Derived -[hidden]down- Animal
Q -[hidden]down- Food
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">class A { A() { System.out.print("A,"); } }
class B extends A { B() { System.out.print("B,"); } }
class C extends B { C() { System.out.println("C"); } }</code></pre>
<pre class="trich"><code class="language-java">class Base {
    Base() { show(); }                                   // calls an overridable method from a constructor
    void show() { System.out.println("Base.show"); }
}
class Derived extends Base {
    int x = 5;
    Derived() { super(); show(); }
    @Override
    void show() { System.out.println("Derived.show x=" + x); }
}</code></pre>
<pre class="trich"><code class="language-java">class P { static String who() { return "P"; } String me() { return "P"; } }
class Q extends P { static String who() { return "Q"; } @Override String me() { return "Q"; } }</code></pre>
<pre class="trich"><code class="language-java">class M { int i = 100; void printValue() { System.out.print("M"); } }
class N extends M { int i = 120; @Override void printValue() { System.out.print("N"); } }</code></pre>
<pre class="trich"><code class="language-java">class Food {
    String getFood() { return "Pizza"; }
    String getInfo() { return this.getFood(); }
}
class Order extends Food {
    @Override String getFood() { return "Taco"; }
}</code></pre>
<pre class="trich"><code class="language-java">static String meet(Animal a) { return "meet(Animal)"; }
static String meet(Dog d)    { return "meet(Dog)"; }</code></pre>
<pre class="trich"><code class="language-java">System.out.print("(a) "); new C();
System.out.println("(b)"); new Derived();
P p = new Q();
System.out.println("(c) " + p.who() + " " + p.me());
M m = new N();
System.out.print("(d) "); m.printValue(); System.out.println(m.i);
Animal a = new Dog();
System.out.println("(e) " + meet(a) + " " + meet(new Dog()));
System.out.println("(f) " + new Order().getInfo());</code></pre>
<details><summary>Answer (real output) and the rule behind each line</summary>
<div class="out">(a) A,B,C<br>
(b)<br>
Derived.show x=0<br>
Derived.show x=5<br>
(c) P Q<br>
(d) N100<br>
(e) meet(Animal) meet(Dog)<br>
(f) Taco</div>
<ul>
<li><strong>(a)</strong> constructors run top-down: <code>A,B,C</code>.</li>
<li><strong>(b)</strong> the trap of the chapter: <code>Base()</code> calls <code>show()</code>, which is overridden, so <code>Derived.show</code> runs — <em>before</em> Derived's field initialiser <code>x = 5</code> has run. It prints <code>x=0</code>. Never call an overridable method from a constructor.</li>
<li><strong>(c)</strong> <code>who()</code> is static → chosen by the declared type P; <code>me()</code> is an instance method → the object Q.</li>
<li><strong>(d)</strong> methods are dynamic (N), fields are not (<code>m.i</code> is M's 100) → <code>N100</code> (FE14 q33).</li>
<li><strong>(e)</strong> overloads are chosen at compile time from the static type: <code>Animal a</code> → <code>meet(Animal)</code>.</li>
<li><strong>(f)</strong> <code>this.getFood()</code> inside Food is still dynamic → Order's "Taco" (FE2 q28).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — Đoán sáu output (~15 phút)</h3>
<p>Kiểu FE: ghi ra mỗi dòng in gì <em>trước khi</em> mở đáp án. Mỗi cây nhỏ giấu một luật.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/36ee90e5d7d437ccde3a2079b64a8e8efd5d0260.svg" alt="Bài 3: sáu cây kế thừa; để ý phương thức nào là static và trường nào bị khai báo lại" loading="lazy" /><p class="chu-thich">🧩 Bài 3: sáu cây kế thừa; để ý phương thức nào là static và trường nào bị khai báo lại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — the six small hierarchies (a) to (f)
' Mỗi gói giấu một luật; đọc từ khoá trước khi đọc thân
hide empty members
package "(a) constructors" {
  class A
  class B
  class C
  A &lt;|-- B
  B &lt;|-- C
}
package "(b) call in constructor" {
  class Base {
    ~ show() : void
  }
  class Derived {
    ~ x : int = 5
    ~ show() : void
  }
  Base &lt;|-- Derived
}
package "(c) static vs instance" {
  class P {
    ~ {static} who() : String
    ~ me() : String
  }
  class Q {
    ~ {static} who() : String
    ~ me() : String
  }
  P &lt;|-- Q
}
package "(d) fields" {
  class M {
    ~ i : int = 100
    ~ printValue() : void
  }
  class N {
    ~ i : int = 120
    ~ printValue() : void
  }
  M &lt;|-- N
}
package "(e) overloads" {
  class Animal
  class Dog
  Animal &lt;|-- Dog
}
package "(f) a call inside the parent" {
  class Food {
    ~ getFood() : String
    ~ getInfo() : String
  }
  class Order {
    ~ getFood() : String
  }
  Food &lt;|-- Order
}
' hai hàng, mỗi hàng ba gói
C -[hidden]down- M
Derived -[hidden]down- Animal
Q -[hidden]down- Food
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">class A { A() { System.out.print("A,"); } }
class B extends A { B() { System.out.print("B,"); } }
class C extends B { C() { System.out.println("C"); } }</code></pre>
<pre class="trich"><code class="language-java">class Base {
    Base() { show(); }                                   // gọi phương thức ghi đè được ngay trong constructor
    void show() { System.out.println("Base.show"); }
}
class Derived extends Base {
    int x = 5;
    Derived() { super(); show(); }
    @Override
    void show() { System.out.println("Derived.show x=" + x); }
}</code></pre>
<pre class="trich"><code class="language-java">class P { static String who() { return "P"; } String me() { return "P"; } }
class Q extends P { static String who() { return "Q"; } @Override String me() { return "Q"; } }</code></pre>
<pre class="trich"><code class="language-java">class M { int i = 100; void printValue() { System.out.print("M"); } }
class N extends M { int i = 120; @Override void printValue() { System.out.print("N"); } }</code></pre>
<pre class="trich"><code class="language-java">class Food {
    String getFood() { return "Pizza"; }
    String getInfo() { return this.getFood(); }
}
class Order extends Food {
    @Override String getFood() { return "Taco"; }
}</code></pre>
<pre class="trich"><code class="language-java">static String meet(Animal a) { return "meet(Animal)"; }
static String meet(Dog d)    { return "meet(Dog)"; }</code></pre>
<pre class="trich"><code class="language-java">System.out.print("(a) "); new C();
System.out.println("(b)"); new Derived();
P p = new Q();
System.out.println("(c) " + p.who() + " " + p.me());
M m = new N();
System.out.print("(d) "); m.printValue(); System.out.println(m.i);
Animal a = new Dog();
System.out.println("(e) " + meet(a) + " " + meet(new Dog()));
System.out.println("(f) " + new Order().getInfo());</code></pre>
<details><summary>Đáp án (output thật) và luật đứng sau mỗi dòng</summary>
<div class="out">(a) A,B,C<br>
(b)<br>
Derived.show x=0<br>
Derived.show x=5<br>
(c) P Q<br>
(d) N100<br>
(e) meet(Animal) meet(Dog)<br>
(f) Taco</div>
<ul>
<li><strong>(a)</strong> constructor chạy từ trên xuống: <code>A,B,C</code>.</li>
<li><strong>(b)</strong> cái bẫy của chương: <code>Base()</code> gọi <code>show()</code>, mà show bị ghi đè, nên <code>Derived.show</code> chạy — <em>trước khi</em> câu khởi tạo trường <code>x = 5</code> của Derived kịp chạy. Nó in <code>x=0</code>. Đừng bao giờ gọi phương thức ghi đè được từ trong constructor.</li>
<li><strong>(c)</strong> <code>who()</code> là static → chọn theo kiểu khai báo P; <code>me()</code> là phương thức thể hiện → theo đối tượng Q.</li>
<li><strong>(d)</strong> phương thức là động (N), trường thì không (<code>m.i</code> là 100 của M) → <code>N100</code> (FE14 câu 33).</li>
<li><strong>(e)</strong> bản nạp chồng được chọn lúc biên dịch theo kiểu tĩnh: <code>Animal a</code> → <code>meet(Animal)</code>.</li>
<li><strong>(f)</strong> <code>this.getFood()</code> bên trong Food vẫn là lời gọi động → "Taco" của Order (FE2 câu 28).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — Fix a classmate's SpecCar (~15 min)</h3>
<p>A classmate wrote this <code>SpecCar</code> for the design below and the project does not build. Read the real JDK 8 messages, list the five mistakes, and fix them so that <code>new SpecCar("blue", 4, "vios")</code> prints <code>blue, 4, vios</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7f19996fcd207035f8e26245910871a66c6b20b1.svg" alt="Exercise 4: the design to implement — note that Car has no default constructor" loading="lazy" /><p class="chu-thich">🧩 Exercise 4: the design to implement — note that Car has no default constructor</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — the design the classmate was asked to build
' Car has no default constructor, so every SpecCar constructor must call super(color, seat)
class Car {
  - color : String
  - seat : int
  + Car(color : String, seat : int)
  + getColor() : String
  + getSeat() : int
  + toString() : String
}
class SpecCar {
  - model : String
  + SpecCar()
  + SpecCar(color : String, seat : int, model : String)
  + getModel() : String
  + toString() : String
}
Car &lt;|-- SpecCar
note right of SpecCar
  toString(): "color, seat, model"
end note
@enduml</code></pre></details>
<details><summary>The broken code, the real errors, the fix</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String car =
        "public class Car {\\n" +
        "    private String color;\\n" +
        "    private int seat;\\n" +
        "    public Car(String color, int seat) { this.color = color; this.seat = seat; }\\n" +
        "    public String getColor() { return color; }\\n" +
        "    public int getSeat() { return seat; }\\n" +
        "    public String toString() { return color + \\", \\" + seat; }\\n" +
        "}\\n";
    viet(d, "Car.java", car);
    System.out.println("== the classmate's SpecCar ==");
    viet(d, "SpecCar.java",
        "public class SpecCar extends Car {\\n" +
        "    private String model;\\n" +
        "    public SpecCar() { }\\n" +
        "    public SpecCar(String color, int seat, String model) {\\n" +
        "        this.model = model;\\n" +
        "        super(color, seat);\\n" +
        "    }\\n" +
        "    String toString() { return color + \\", \\" + seat + \\", \\" + model; }\\n" +
        "    @Override\\n" +
        "    public String getmodel() { return model; }\\n" +
        "}\\n");
    lenh(d, "javac", "Car.java", "SpecCar.java");

    System.out.println("== fixed ==");
    viet(d, "SpecCar.java",
        "public class SpecCar extends Car {\\n" +
        "    private String model;\\n" +
        "    public SpecCar() { super(\\"\\", 0); }\\n" +
        "    public SpecCar(String color, int seat, String model) {\\n" +
        "        super(color, seat);\\n" +
        "        this.model = model;\\n" +
        "    }\\n" +
        "    @Override\\n" +
        "    public String toString() { return super.toString() + \\", \\" + model; }\\n" +
        "    public String getModel() { return model; }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(new SpecCar(\\"blue\\", 4, \\"vios\\"));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Car.java", "SpecCar.java");
    lenh(d, "java", "SpecCar");
}</code></pre>
<div class="out">== the classmate's SpecCar ==<br>
&gt; javac Car.java SpecCar.java<br>
SpecCar.java:3: error: constructor Car in class Car cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;public SpecCar() { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: String,int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
SpecCar.java:4: error: constructor Car in class Car cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;public SpecCar(String color, int seat, String model) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: String,int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
SpecCar.java:6: error: call to super must be first statement in constructor<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super(color, seat);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
SpecCar.java:8: error: toString() in SpecCar cannot override toString() in Car<br>
&nbsp;&nbsp;&nbsp;&nbsp;String toString() { return color + ", " + seat + ", " + model; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;attempting to assign weaker access privileges; was public<br>
SpecCar.java:8: error: color has private access in Car<br>
&nbsp;&nbsp;&nbsp;&nbsp;String toString() { return color + ", " + seat + ", " + model; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
SpecCar.java:8: error: seat has private access in Car<br>
&nbsp;&nbsp;&nbsp;&nbsp;String toString() { return color + ", " + seat + ", " + model; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
SpecCar.java:9: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
7 errors<br>
(exit code 1)<br>
== fixed ==<br>
&gt; javac Car.java SpecCar.java<br>
&gt; java SpecCar<br>
blue, 4, vios</div>
<p>Five mistakes behind seven messages: (1) <code>SpecCar()</code> has no <code>super(...)</code> and Car has no no-argument constructor → the inserted <code>super()</code> fails; (2) in the 3-argument constructor <code>super(...)</code> is not first — javac reports both the missing first call <em>and</em> the misplaced one; (3) <code>toString()</code> without <code>public</code> narrows access; (4) <code>color</code>/<code>seat</code> are private in Car — use <code>super.toString()</code> or the getters; (5) <code>@Override</code> on <code>getmodel</code>, which overrides nothing (and the name should be <code>getModel</code>).</p>
</details>
<div class="pitfall">Fix errors <strong>from the top</strong>. One mistake often causes several messages (here, mistake 2 caused two), and later messages sometimes disappear once the first is fixed. In NetBeans, the red marks in the left margin and the Output window show the same text.</div>`,
    `<h3>🧪 Bài 4 — Sửa SpecCar của một bạn cùng lớp (~15 phút)</h3>
<p>Một bạn viết <code>SpecCar</code> này theo thiết kế bên dưới và project không build được. Đọc các thông báo thật của JDK 8, liệt kê năm chỗ sai, rồi sửa sao cho <code>new SpecCar("blue", 4, "vios")</code> in ra <code>blue, 4, vios</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7f19996fcd207035f8e26245910871a66c6b20b1.svg" alt="Bài 4: thiết kế cần hiện thực — để ý Car không có constructor mặc định" loading="lazy" /><p class="chu-thich">🧩 Bài 4: thiết kế cần hiện thực — để ý Car không có constructor mặc định</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — the design the classmate was asked to build
' Car không có constructor mặc định, nên mọi constructor của SpecCar phải gọi super(color, seat)
class Car {
  - color : String
  - seat : int
  + Car(color : String, seat : int)
  + getColor() : String
  + getSeat() : int
  + toString() : String
}
class SpecCar {
  - model : String
  + SpecCar()
  + SpecCar(color : String, seat : int, model : String)
  + getModel() : String
  + toString() : String
}
Car &lt;|-- SpecCar
note right of SpecCar
  toString(): "color, seat, model"
end note
@enduml</code></pre></details>
<details><summary>Code hỏng, lỗi thật, bản sửa</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String car =
        "public class Car {\\n" +
        "    private String color;\\n" +
        "    private int seat;\\n" +
        "    public Car(String color, int seat) { this.color = color; this.seat = seat; }\\n" +
        "    public String getColor() { return color; }\\n" +
        "    public int getSeat() { return seat; }\\n" +
        "    public String toString() { return color + \\", \\" + seat; }\\n" +
        "}\\n";
    viet(d, "Car.java", car);
    System.out.println("== the classmate's SpecCar ==");
    viet(d, "SpecCar.java",
        "public class SpecCar extends Car {\\n" +
        "    private String model;\\n" +
        "    public SpecCar() { }\\n" +
        "    public SpecCar(String color, int seat, String model) {\\n" +
        "        this.model = model;\\n" +
        "        super(color, seat);\\n" +
        "    }\\n" +
        "    String toString() { return color + \\", \\" + seat + \\", \\" + model; }\\n" +
        "    @Override\\n" +
        "    public String getmodel() { return model; }\\n" +
        "}\\n");
    lenh(d, "javac", "Car.java", "SpecCar.java");

    System.out.println("== fixed ==");
    viet(d, "SpecCar.java",
        "public class SpecCar extends Car {\\n" +
        "    private String model;\\n" +
        "    public SpecCar() { super(\\"\\", 0); }\\n" +
        "    public SpecCar(String color, int seat, String model) {\\n" +
        "        super(color, seat);\\n" +
        "        this.model = model;\\n" +
        "    }\\n" +
        "    @Override\\n" +
        "    public String toString() { return super.toString() + \\", \\" + model; }\\n" +
        "    public String getModel() { return model; }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(new SpecCar(\\"blue\\", 4, \\"vios\\"));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Car.java", "SpecCar.java");
    lenh(d, "java", "SpecCar");
}</code></pre>
<div class="out">== the classmate's SpecCar ==<br>
&gt; javac Car.java SpecCar.java<br>
SpecCar.java:3: error: constructor Car in class Car cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;public SpecCar() { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: String,int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
SpecCar.java:4: error: constructor Car in class Car cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;public SpecCar(String color, int seat, String model) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: String,int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
SpecCar.java:6: error: call to super must be first statement in constructor<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super(color, seat);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
SpecCar.java:8: error: toString() in SpecCar cannot override toString() in Car<br>
&nbsp;&nbsp;&nbsp;&nbsp;String toString() { return color + ", " + seat + ", " + model; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;attempting to assign weaker access privileges; was public<br>
SpecCar.java:8: error: color has private access in Car<br>
&nbsp;&nbsp;&nbsp;&nbsp;String toString() { return color + ", " + seat + ", " + model; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
SpecCar.java:8: error: seat has private access in Car<br>
&nbsp;&nbsp;&nbsp;&nbsp;String toString() { return color + ", " + seat + ", " + model; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
SpecCar.java:9: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
7 errors<br>
(exit code 1)<br>
== fixed ==<br>
&gt; javac Car.java SpecCar.java<br>
&gt; java SpecCar<br>
blue, 4, vios</div>
<p>Năm chỗ sai đứng sau bảy thông báo: (1) <code>SpecCar()</code> không có <code>super(...)</code> mà Car không có constructor không tham số → <code>super()</code> tự chèn bị hỏng; (2) trong constructor 3 tham số, <code>super(...)</code> không đứng đầu — javac báo cả việc thiếu lời gọi đầu tiên <em>lẫn</em> lời gọi đặt sai chỗ; (3) <code>toString()</code> thiếu <code>public</code> là thu hẹp quyền truy cập; (4) <code>color</code>/<code>seat</code> là private trong Car — dùng <code>super.toString()</code> hoặc getter; (5) <code>@Override</code> trên <code>getmodel</code>, phương thức này chẳng ghi đè gì (và tên phải là <code>getModel</code>).</p>
</details>
<div class="pitfall">Sửa lỗi <strong>từ trên xuống</strong>. Một chỗ sai thường sinh ra vài thông báo (ở đây chỗ sai 2 sinh ra hai), và các thông báo sau đôi khi tự biến mất khi sửa xong cái đầu. Trong NetBeans, dấu đỏ ở lề trái và cửa sổ Output hiện cùng một nội dung.</div>`),
    bi(`<h3>🧪 Exercise 5 — One list, three kinds of object (~15 min)</h3>
<p>An <code>Item[]</code> holds vases, statues and paintings. Count each kind; put 3 flowers into every vase (<code>putFlowers</code> exists only in Vase); frame every painting that is not framed yet (<code>frame()</code> exists only in Painting). Then explain what goes wrong if you skip the type check.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/44a0e575e2fb3e470b7c84b7228283e8ea2e107b.svg" alt="Exercise 5: putFlowers() and frame() exist in one subclass each" loading="lazy" /><p class="chu-thich">🧩 Exercise 5: putFlowers() and frame() exist in one subclass each</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — methods that only one subclass has
' putFlowers() exists only in Vase, frame() only in Painting: an Item variable needs instanceof + cast
class Item {
  - value : int
  ~ getValue() : int
}
class Vase {
  - flowers : int
  ~ putFlowers(n : int) : void
  ~ getFlowers() : int
}
class Statue
class Painting {
  - framed : boolean
  ~ isFramed() : boolean
  ~ frame() : void
}
Item &lt;|-- Vase
Item &lt;|-- Statue
Item &lt;|-- Painting
hide Statue members
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Item {
    private final int value;
    Item(int value) { this.value = value; }
    int getValue() { return value; }
}
class Vase extends Item {
    private int flowers = 0;
    Vase(int value) { super(value); }
    void putFlowers(int n) { flowers += n; }                     // only a Vase can do this
    int getFlowers() { return flowers; }
}
class Statue extends Item {
    Statue(int value) { super(value); }
}
class Painting extends Item {
    private boolean framed;
    Painting(int value, boolean framed) { super(value); this.framed = framed; }
    boolean isFramed() { return framed; }
    void frame() { framed = true; }                              // only a Painting can do this
}</code></pre>
<pre class="trich"><code class="language-java">int vases = 0, statues = 0, paintings = 0, framedNow = 0;
for (Item it : stock) {
    if (it instanceof Vase) {
        vases++;
        Vase v = (Vase) it;                              // safe: the check just passed
        v.putFlowers(3);
    } else if (it instanceof Painting) {
        paintings++;
        Painting p = (Painting) it;
        if (!p.isFramed()) { p.frame(); framedNow++; }
    } else if (it instanceof Statue) {
        statues++;
    }
}
System.out.println("vases=" + vases + ", statues=" + statues + ", paintings=" + paintings);
System.out.println("paintings framed now: " + framedNow);
System.out.println("flowers in the first vase: " + ((Vase) stock[0]).getFlowers());</code></pre>
<pre class="trich"><code class="language-java">try {
    for (Item it : stock) {
        ((Vase) it).putFlowers(1);                       // assumes every item is a Vase
        System.out.println("ok: a Vase worth " + it.getValue());
    }
} catch (ClassCastException e) {
    System.out.println("stopped by " + e.getClass().getName());
}</code></pre>
<div class="out">vases=2, statues=1, paintings=2<br>
paintings framed now: 1<br>
flowers in the first vase: 3<br>
ok: a Vase worth 100<br>
stopped by java.lang.ClassCastException</div>
<p>The safe loop checks with <code>instanceof</code> and only then casts, so it never throws. The unsafe loop works for the first object (a Vase) and stops at the second (a Painting) with <code>ClassCastException</code> — a run-time error the compiler could not see, because <code>(Vase) it</code> is legal for any Item.</p>
</details>`,
    `<h3>🧪 Bài 5 — Một danh sách, ba loại đối tượng (~15 phút)</h3>
<p>Một <code>Item[]</code> chứa bình, tượng và tranh. Đếm từng loại; cắm 3 bông hoa vào mỗi bình (<code>putFlowers</code> chỉ có trong Vase); đóng khung mọi bức tranh chưa có khung (<code>frame()</code> chỉ có trong Painting). Rồi giải thích chuyện gì hỏng nếu bỏ phép kiểm kiểu.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/44a0e575e2fb3e470b7c84b7228283e8ea2e107b.svg" alt="Bài 5: putFlowers() và frame() mỗi cái chỉ có trong một lớp con" loading="lazy" /><p class="chu-thich">🧩 Bài 5: putFlowers() và frame() mỗi cái chỉ có trong một lớp con</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — methods that only one subclass has
' putFlowers() chỉ có trong Vase, frame() chỉ có trong Painting: biến Item cần instanceof + ép kiểu
class Item {
  - value : int
  ~ getValue() : int
}
class Vase {
  - flowers : int
  ~ putFlowers(n : int) : void
  ~ getFlowers() : int
}
class Statue
class Painting {
  - framed : boolean
  ~ isFramed() : boolean
  ~ frame() : void
}
Item &lt;|-- Vase
Item &lt;|-- Statue
Item &lt;|-- Painting
hide Statue members
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Item {
    private final int value;
    Item(int value) { this.value = value; }
    int getValue() { return value; }
}
class Vase extends Item {
    private int flowers = 0;
    Vase(int value) { super(value); }
    void putFlowers(int n) { flowers += n; }                     // chỉ Vase làm được
    int getFlowers() { return flowers; }
}
class Statue extends Item {
    Statue(int value) { super(value); }
}
class Painting extends Item {
    private boolean framed;
    Painting(int value, boolean framed) { super(value); this.framed = framed; }
    boolean isFramed() { return framed; }
    void frame() { framed = true; }                              // chỉ Painting làm được
}</code></pre>
<pre class="trich"><code class="language-java">int vases = 0, statues = 0, paintings = 0, framedNow = 0;
for (Item it : stock) {
    if (it instanceof Vase) {
        vases++;
        Vase v = (Vase) it;                              // an toàn: phép kiểm vừa đúng
        v.putFlowers(3);
    } else if (it instanceof Painting) {
        paintings++;
        Painting p = (Painting) it;
        if (!p.isFramed()) { p.frame(); framedNow++; }
    } else if (it instanceof Statue) {
        statues++;
    }
}
System.out.println("vases=" + vases + ", statues=" + statues + ", paintings=" + paintings);
System.out.println("paintings framed now: " + framedNow);
System.out.println("flowers in the first vase: " + ((Vase) stock[0]).getFlowers());</code></pre>
<pre class="trich"><code class="language-java">try {
    for (Item it : stock) {
        ((Vase) it).putFlowers(1);                       // giả định mọi món đều là Vase
        System.out.println("ok: a Vase worth " + it.getValue());
    }
} catch (ClassCastException e) {
    System.out.println("stopped by " + e.getClass().getName());
}</code></pre>
<div class="out">vases=2, statues=1, paintings=2<br>
paintings framed now: 1<br>
flowers in the first vase: 3<br>
ok: a Vase worth 100<br>
stopped by java.lang.ClassCastException</div>
<p>Vòng lặp an toàn kiểm bằng <code>instanceof</code> rồi mới ép kiểu, nên không bao giờ ném ngoại lệ. Vòng lặp không an toàn chạy được với đối tượng đầu (một Vase) và dừng ở đối tượng thứ hai (một Painting) với <code>ClassCastException</code> — lỗi lúc chạy mà trình biên dịch không thấy được, vì <code>(Vase) it</code> hợp lệ với mọi Item.</p>
</details>`),
    bi(`<h3>🧪 Exercise 6 — PE question 2 with numbers: Ticket and VipTicket (~20 min)</h3>
<p>(3 marks, PE style, modelled on PE7 <em>NetworkDevice/Router</em>) <code>Ticket.getFinalPrice()</code> returns price, minus 10% when the code starts with "S" (student). <code>VipTicket.getFinalPrice()</code> returns the ticket's final price plus a 50% surcharge, plus 20000 for seat rows 1–3. <code>Ticket.toString()</code> returns "code, finalPrice" with one decimal. TC1 prints a Ticket and a VipTicket built from the same input; TC2 prints the sum of the final prices of both, one decimal.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/c0e251f16717a6441057ef8d7fac3f93cb3f0c3e.svg" alt="Exercise 6: only getFinalPrice() is overridden" loading="lazy" /><p class="chu-thich">🧩 Exercise 6: only getFinalPrice() is overridden</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — VipTicket overrides getFinalPrice() and reuses Ticket's rule
' toString() in Ticket calls getFinalPrice(), so a VipTicket prints its own price without overriding toString()
class Ticket {
  - code : String
  - price : double
  + Ticket()
  + Ticket(code : String, price : double)
  + getCode() : String
  + getPrice() : double
  + setPrice(price : double) : void
  + getFinalPrice() : double
  + toString() : String
}
class VipTicket {
  - seatRow : int
  + VipTicket()
  + VipTicket(code : String, price : double, seatRow : int)
  + getSeatRow() : int
  + getFinalPrice() : double
}
Ticket &lt;|-- VipTicket
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Ticket {
    private String code;
    private double price;

    public Ticket() {
    }

    public Ticket(String code, double price) {
        this.code = code;
        this.price = price;
    }

    public String getCode() { return code; }

    public double getPrice() { return price; }

    public void setPrice(double price) { this.price = price; }

    // getFinalPrice(): price, minus 10% when the code starts with "S" (student)
    public double getFinalPrice() {
        return code.startsWith("S") ? price * 0.9 : price;
    }

    @Override
    public String toString() {
        return String.format("%s, %.1f", code, getFinalPrice());   // getFinalPrice() is dynamic: a VipTicket prints ITS price
    }
}</code></pre>
<pre class="trich"><code class="language-java">class VipTicket extends Ticket {
    private int seatRow;

    public VipTicket() {
    }

    public VipTicket(String code, double price, int seatRow) {
        super(code, price);
        this.seatRow = seatRow;
    }

    public int getSeatRow() { return seatRow; }

    // getFinalPrice(): the parent's final price + 50% surcharge; rows 1-3 add another 20000
    @Override
    public double getFinalPrice() {
        double p = super.getFinalPrice() * 1.5;      // reuse the student-discount rule, do not copy it
        if (seatRow &gt;= 1 &amp;&amp; seatRow &lt;= 3) p += 20000;
        return p;
    }
}</code></pre>
<div class="out">Enter code: A01<br>
Enter price: 100000.0<br>
Enter seat row: 5<br>
Enter TC (1 or 2): 1<br>
OUTPUT:<br>
A01, 100000.0<br>
A01, 150000.0<br>
<br>
Enter code: S02<br>
Enter price: 100000.0<br>
Enter seat row: 2<br>
Enter TC (1 or 2): 1<br>
OUTPUT:<br>
S02, 90000.0<br>
S02, 155000.0<br>
<br>
Enter code: S02<br>
Enter price: 100000.0<br>
Enter seat row: 2<br>
Enter TC (1 or 2): 2<br>
OUTPUT:<br>
245000.0</div>
<p>Check S02 in row 2 by hand: Ticket 100000 × 0.9 = 90000; VipTicket 90000 × 1.5 + 20000 = 155000 — the student discount is applied <em>through</em> <code>super.getFinalPrice()</code>, not re-typed. VipTicket did not override <code>toString()</code>, yet it prints its own price: Ticket's <code>toString()</code> calls <code>getFinalPrice()</code>, which is dynamic (exercise 3f again).</p>
</details>
<div class="pitfall">Rounding trap: <code>String.format("%.1f", x)</code> rounds; <code>(int) x</code> cuts. Use exactly what the paper's sample output shows. PE7 even writes "Do not format the result" for one value and "formatted to 2 decimal places" for another — read each method's line.</div>`,
    `<h3>🧪 Bài 6 — Câu 2 đề PE với số: Ticket và VipTicket (~20 phút)</h3>
<p>(3 điểm, kiểu PE, dựa theo PE7 <em>NetworkDevice/Router</em>) <code>Ticket.getFinalPrice()</code> trả về price, trừ 10% khi code bắt đầu bằng "S" (sinh viên). <code>VipTicket.getFinalPrice()</code> trả về giá cuối của vé thường cộng phụ thu 50%, cộng thêm 20000 với hàng ghế 1–3. <code>Ticket.toString()</code> trả về "code, finalPrice" với một chữ số thập phân. TC1 in một Ticket và một VipTicket dựng từ cùng dữ liệu nhập; TC2 in tổng giá cuối của cả hai, một chữ số thập phân.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/c0e251f16717a6441057ef8d7fac3f93cb3f0c3e.svg" alt="Bài 6: chỉ getFinalPrice() bị ghi đè" loading="lazy" /><p class="chu-thich">🧩 Bài 6: chỉ getFinalPrice() bị ghi đè</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — VipTicket overrides getFinalPrice() and reuses Ticket's rule
' toString() của Ticket gọi getFinalPrice(), nên VipTicket in giá của chính nó mà không cần ghi đè toString()
class Ticket {
  - code : String
  - price : double
  + Ticket()
  + Ticket(code : String, price : double)
  + getCode() : String
  + getPrice() : double
  + setPrice(price : double) : void
  + getFinalPrice() : double
  + toString() : String
}
class VipTicket {
  - seatRow : int
  + VipTicket()
  + VipTicket(code : String, price : double, seatRow : int)
  + getSeatRow() : int
  + getFinalPrice() : double
}
Ticket &lt;|-- VipTicket
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Ticket {
    private String code;
    private double price;

    public Ticket() {
    }

    public Ticket(String code, double price) {
        this.code = code;
        this.price = price;
    }

    public String getCode() { return code; }

    public double getPrice() { return price; }

    public void setPrice(double price) { this.price = price; }

    // getFinalPrice(): price, trừ 10% khi code bắt đầu bằng "S" (sinh viên)
    public double getFinalPrice() {
        return code.startsWith("S") ? price * 0.9 : price;
    }

    @Override
    public String toString() {
        return String.format("%s, %.1f", code, getFinalPrice());   // getFinalPrice() là động: VipTicket in giá CỦA NÓ
    }
}</code></pre>
<pre class="trich"><code class="language-java">class VipTicket extends Ticket {
    private int seatRow;

    public VipTicket() {
    }

    public VipTicket(String code, double price, int seatRow) {
        super(code, price);
        this.seatRow = seatRow;
    }

    public int getSeatRow() { return seatRow; }

    // getFinalPrice(): giá cuối của cha + phụ thu 50%; hàng 1-3 cộng thêm 20000
    @Override
    public double getFinalPrice() {
        double p = super.getFinalPrice() * 1.5;      // dùng lại luật giảm giá sinh viên, đừng chép lại
        if (seatRow &gt;= 1 &amp;&amp; seatRow &lt;= 3) p += 20000;
        return p;
    }
}</code></pre>
<div class="out">Enter code: A01<br>
Enter price: 100000.0<br>
Enter seat row: 5<br>
Enter TC (1 or 2): 1<br>
OUTPUT:<br>
A01, 100000.0<br>
A01, 150000.0<br>
<br>
Enter code: S02<br>
Enter price: 100000.0<br>
Enter seat row: 2<br>
Enter TC (1 or 2): 1<br>
OUTPUT:<br>
S02, 90000.0<br>
S02, 155000.0<br>
<br>
Enter code: S02<br>
Enter price: 100000.0<br>
Enter seat row: 2<br>
Enter TC (1 or 2): 2<br>
OUTPUT:<br>
245000.0</div>
<p>Tự kiểm S02 ở hàng 2: Ticket 100000 × 0.9 = 90000; VipTicket 90000 × 1.5 + 20000 = 155000 — giảm giá sinh viên được áp <em>qua</em> <code>super.getFinalPrice()</code>, không gõ lại. VipTicket không ghi đè <code>toString()</code>, vậy mà vẫn in giá của chính nó: <code>toString()</code> của Ticket gọi <code>getFinalPrice()</code>, mà lời gọi đó là động (lại bài 3f).</p>
</details>
<div class="pitfall">Bẫy làm tròn: <code>String.format("%.1f", x)</code> làm tròn; <code>(int) x</code> cắt bỏ. Dùng đúng thứ mà output mẫu của đề cho thấy. PE7 thậm chí ghi "Do not format the result" cho giá trị này và "formatted to 2 decimal places" cho giá trị khác — đọc kỹ từng dòng mô tả phương thức.</div>`),
    bi(`<h3>🧪 Exercise 7 — Is-a or has-a? Fix the design (~15 min)</h3>
<p>A team wrote <code>class Car extends Engine</code> "so that Car gets <code>power</code> and <code>start()</code>". Then they need an electric car with a battery. Explain why the first design is wrong, redraw it, and implement the fixed version: a car <em>has</em> an engine; an electric car <em>is</em> a car that refuses to start below 5% battery.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4ac026bdfafd521e507681954dd9bce061c1c10.svg" alt="Exercise 7: left, the wrong hierarchy; right, composition for the part and inheritance for the kind" loading="lazy" /><p class="chu-thich">🧩 Exercise 7: left, the wrong hierarchy; right, composition for the part and inheritance for the kind</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 7 — the wrong design and the fixed one
' Left: "a car is an engine" (wrong). Right: a car has an engine, an electric car is a car
package "wrong: Car extends Engine" {
  class "Engine" as E1 {
    ~ power : int
    ~ start() : String
  }
  class "Car" as C1 {
    ~ plate : String
  }
  E1 &lt;|-- C1
}
package "fixed: composition + inheritance" {
  class Engine {
    - power : int
    ~ start() : String
  }
  class Car {
    - plate : String
    - engine : Engine
    ~ start() : String
    ~ describe() : String
  }
  class ElectricCar {
    - battery : int
    ~ start() : String
    ~ describe() : String
  }
  Car *-- "1" Engine : has-a
  Car &lt;|-- ElectricCar : is-a
}
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Engine {
    private final int power;                     // kW
    Engine(int power) { this.power = power; }
    int getPower() { return power; }
    String start() { return "engine " + power + "kW started"; }
}

class Car {
    private final String plate;
    private final Engine engine;                 // has-a: composition
    Car(String plate, Engine engine) { this.plate = plate; this.engine = engine; }
    String getPlate() { return plate; }
    String start() { return plate + ": " + engine.start(); }      // delegate to the part
    String describe() { return "Car " + plate + " (" + engine.getPower() + "kW)"; }
}

class ElectricCar extends Car {                  // is-a: an electric car IS a car
    private int battery;                         // percent
    ElectricCar(String plate, Engine engine, int battery) { super(plate, engine); this.battery = battery; }
    @Override
    String start() {
        if (battery &lt; 5) return getPlate() + ": battery too low";
        return super.start() + " silently";
    }
    @Override
    String describe() { return super.describe() + ", battery " + battery + "%"; }
}</code></pre>
<div class="out">Car 29A-123.45 (90kW)<br>
&nbsp;&nbsp;29A-123.45: engine 90kW started<br>
Car 30F-678.90 (150kW), battery 80%<br>
&nbsp;&nbsp;30F-678.90: engine 150kW started silently<br>
Car 51K-111.22 (150kW), battery 3%<br>
&nbsp;&nbsp;51K-111.22: battery too low</div>
<p>"A car is an engine" is false, so <code>extends</code> is wrong even though it compiles: every Car would also be usable wherever an Engine is expected (put a whole car into a generator?), and a car could never change its engine. The fix uses each tool for its sentence: <code>Car</code> keeps an <code>Engine</code> field and <strong>delegates</strong> <code>start()</code> to it (has-a); <code>ElectricCar extends Car</code> (is-a) and extends <code>start()</code> and <code>describe()</code> with <code>super</code>.</p>
</details>
<div class="callout">🧭 <strong>Go further — LAB211, PRJ301, Spring Boot</strong>: LAB211 projects are graded on exactly this split — entity classes with a small inheritance tree, and manager classes that <em>have</em> lists of entities. In PRJ301 your DAO <em>has</em> a connection; in Spring Boot a service <em>has</em> its repositories injected into fields. Inheritance stays for true "is a kind of" — the JPA entity hierarchy, or <code>extends HttpServlet</code>.</div>`,
    `<h3>🧪 Bài 7 — Is-a hay has-a? Sửa thiết kế (~15 phút)</h3>
<p>Một nhóm viết <code>class Car extends Engine</code> "để Car có sẵn <code>power</code> và <code>start()</code>". Rồi họ cần một chiếc xe điện có pin. Giải thích vì sao thiết kế đầu sai, vẽ lại, và hiện thực bản đã sửa: xe <em>có</em> một động cơ; xe điện <em>là</em> một chiếc xe không chịu khởi động khi pin dưới 5%.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4ac026bdfafd521e507681954dd9bce061c1c10.svg" alt="Bài 7: trái là cây kế thừa sai; phải là kết hợp cho bộ phận và kế thừa cho loại" loading="lazy" /><p class="chu-thich">🧩 Bài 7: trái là cây kế thừa sai; phải là kết hợp cho bộ phận và kế thừa cho loại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 7 — the wrong design and the fixed one
' Trái: "xe là một động cơ" (sai). Phải: xe có một động cơ, xe điện là một chiếc xe
package "wrong: Car extends Engine" {
  class "Engine" as E1 {
    ~ power : int
    ~ start() : String
  }
  class "Car" as C1 {
    ~ plate : String
  }
  E1 &lt;|-- C1
}
package "fixed: composition + inheritance" {
  class Engine {
    - power : int
    ~ start() : String
  }
  class Car {
    - plate : String
    - engine : Engine
    ~ start() : String
    ~ describe() : String
  }
  class ElectricCar {
    - battery : int
    ~ start() : String
    ~ describe() : String
  }
  Car *-- "1" Engine : has-a
  Car &lt;|-- ElectricCar : is-a
}
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Engine {
    private final int power;                     // kW
    Engine(int power) { this.power = power; }
    int getPower() { return power; }
    String start() { return "engine " + power + "kW started"; }
}

class Car {
    private final String plate;
    private final Engine engine;                 // has-a: kết hợp (composition)
    Car(String plate, Engine engine) { this.plate = plate; this.engine = engine; }
    String getPlate() { return plate; }
    String start() { return plate + ": " + engine.start(); }      // uỷ quyền cho bộ phận
    String describe() { return "Car " + plate + " (" + engine.getPower() + "kW)"; }
}

class ElectricCar extends Car {                  // is-a: xe điện LÀ một chiếc xe
    private int battery;                         // phần trăm
    ElectricCar(String plate, Engine engine, int battery) { super(plate, engine); this.battery = battery; }
    @Override
    String start() {
        if (battery &lt; 5) return getPlate() + ": battery too low";
        return super.start() + " silently";
    }
    @Override
    String describe() { return super.describe() + ", battery " + battery + "%"; }
}</code></pre>
<div class="out">Car 29A-123.45 (90kW)<br>
&nbsp;&nbsp;29A-123.45: engine 90kW started<br>
Car 30F-678.90 (150kW), battery 80%<br>
&nbsp;&nbsp;30F-678.90: engine 150kW started silently<br>
Car 51K-111.22 (150kW), battery 3%<br>
&nbsp;&nbsp;51K-111.22: battery too low</div>
<p>"Xe là một động cơ" là sai, nên <code>extends</code> là sai dù vẫn biên dịch được: mọi Car sẽ dùng được ở bất cứ chỗ nào cần Engine (lắp nguyên chiếc xe vào máy phát điện?), và một chiếc xe không bao giờ thay được động cơ. Bản sửa dùng mỗi công cụ cho đúng câu của nó: <code>Car</code> giữ một trường <code>Engine</code> và <strong>uỷ quyền (delegate)</strong> <code>start()</code> cho nó (has-a); <code>ElectricCar extends Car</code> (is-a) và mở rộng <code>start()</code>, <code>describe()</code> bằng <code>super</code>.</p>
</details>
<div class="callout">🧭 <strong>Đi tiếp — LAB211, PRJ301, Spring Boot</strong>: project LAB211 được chấm đúng ở cách chia này — các lớp thực thể với một cây kế thừa nhỏ, và các lớp quản lý <em>có</em> danh sách thực thể. Ở PRJ301 DAO của bạn <em>có</em> một kết nối; ở Spring Boot một service <em>có</em> các repository được tiêm vào trường. Kế thừa để dành cho đúng quan hệ "là một loại" — cây thực thể JPA, hoặc <code>extends HttpServlet</code>.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>inheritance</strong></td><td>kế thừa</td><td>One class takes the whole structure (fields, methods) of another and adds or changes its own part.</td></tr>
<tr><td><strong>superclass / subclass</strong></td><td>lớp cha / lớp con</td><td>The class being extended / the class that extends it; also base/derived, parent/child.</td></tr>
<tr><td><strong><code>extends</code></strong></td><td>kế thừa (từ khoá)</td><td>Keyword that names the one direct superclass of a class.</td></tr>
<tr><td><strong>is-a / has-a</strong></td><td>là một / có một</td><td>Is-a becomes <code>extends</code>; has-a becomes a field that references another object.</td></tr>
<tr><td><strong>composition</strong></td><td>kết hợp</td><td>Building a class from parts it holds in fields, instead of inheriting from them.</td></tr>
<tr><td><strong><code>super(...)</code></strong></td><td>gọi constructor cha</td><td>First statement of a subclass constructor; chooses which parent constructor runs.</td></tr>
<tr><td><strong><code>super.method()</code></strong></td><td>gọi phương thức của cha</td><td>Runs the superclass version of a method, usually inside the override.</td></tr>
<tr><td><strong>overriding</strong></td><td>ghi đè</td><td>A subclass method with the same signature replaces the inherited one; chosen at run time.</td></tr>
<tr><td><strong>overloading</strong></td><td>nạp chồng</td><td>Several methods with one name and different parameter lists; chosen at compile time.</td></tr>
<tr><td><strong>signature</strong></td><td>chữ ký phương thức</td><td>Name plus the number, types and order of parameters — not the return type.</td></tr>
<tr><td><strong><code>@Override</code></strong></td><td>chú thích ghi đè</td><td>Annotation that makes javac check the method really overrides something.</td></tr>
<tr><td><strong>method hiding</strong></td><td>che giấu phương thức</td><td>Redefining a static method in a subclass; chosen by the declared type, not the object.</td></tr>
<tr><td><strong>static / dynamic type</strong></td><td>kiểu tĩnh / kiểu động</td><td>The declared type of a variable / the class of the object it points to at run time.</td></tr>
<tr><td><strong>dynamic binding</strong></td><td>ràng buộc động</td><td>The JVM picks the method body from the object's class each time the call runs.</td></tr>
<tr><td><strong><code>instanceof</code></strong></td><td>toán tử kiểm kiểu</td><td>True if the object belongs to the type or any of its subclasses; false for null.</td></tr>
<tr><td><strong>downcast / <code>ClassCastException</code></strong></td><td>ép kiểu xuống / ngoại lệ ép kiểu</td><td>An explicit cast to a subclass, checked at run time; fails with ClassCastException on the wrong object.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>inheritance</strong></td><td>kế thừa</td><td>Một lớp nhận trọn cấu trúc (trường, phương thức) của lớp khác rồi thêm hoặc sửa phần của riêng nó.</td></tr>
<tr><td><strong>superclass / subclass</strong></td><td>lớp cha / lớp con</td><td>Lớp được kế thừa / lớp kế thừa nó; còn gọi là lớp cơ sở/dẫn xuất, cha/con.</td></tr>
<tr><td><strong><code>extends</code></strong></td><td>kế thừa (từ khoá)</td><td>Từ khoá ghi tên lớp cha trực tiếp duy nhất của một lớp.</td></tr>
<tr><td><strong>is-a / has-a</strong></td><td>là một / có một</td><td>Is-a thành <code>extends</code>; has-a thành một trường tham chiếu tới đối tượng khác.</td></tr>
<tr><td><strong>composition</strong></td><td>kết hợp</td><td>Dựng một lớp từ các bộ phận nó giữ trong trường, thay vì kế thừa chúng.</td></tr>
<tr><td><strong><code>super(...)</code></strong></td><td>gọi constructor cha</td><td>Câu lệnh đầu của constructor lớp con; chọn constructor nào của cha chạy.</td></tr>
<tr><td><strong><code>super.method()</code></strong></td><td>gọi phương thức của cha</td><td>Chạy phiên bản của lớp cha, thường dùng bên trong bản ghi đè.</td></tr>
<tr><td><strong>overriding</strong></td><td>ghi đè</td><td>Phương thức lớp con cùng chữ ký thay bản được kế thừa; được chọn lúc chạy.</td></tr>
<tr><td><strong>overloading</strong></td><td>nạp chồng</td><td>Nhiều phương thức cùng tên, khác danh sách tham số; được chọn lúc biên dịch.</td></tr>
<tr><td><strong>signature</strong></td><td>chữ ký phương thức</td><td>Tên cộng số lượng, kiểu và thứ tự tham số — không gồm kiểu trả về.</td></tr>
<tr><td><strong><code>@Override</code></strong></td><td>chú thích ghi đè</td><td>Annotation buộc javac kiểm phương thức thật sự ghi đè một phương thức nào đó.</td></tr>
<tr><td><strong>method hiding</strong></td><td>che giấu phương thức</td><td>Định nghĩa lại phương thức static ở lớp con; chọn theo kiểu khai báo, không theo đối tượng.</td></tr>
<tr><td><strong>static / dynamic type</strong></td><td>kiểu tĩnh / kiểu động</td><td>Kiểu khai báo của biến / lớp của đối tượng mà nó trỏ tới lúc chạy.</td></tr>
<tr><td><strong>dynamic binding</strong></td><td>ràng buộc động</td><td>JVM chọn thân phương thức theo lớp của đối tượng mỗi lần lời gọi chạy.</td></tr>
<tr><td><strong><code>instanceof</code></strong></td><td>toán tử kiểm kiểu</td><td>True nếu đối tượng thuộc kiểu đó hoặc một lớp con của nó; false với null.</td></tr>
<tr><td><strong>downcast / <code>ClassCastException</code></strong></td><td>ép kiểu xuống / ngoại lệ ép kiểu</td><td>Ép tường minh sang lớp con, kiểm lúc chạy; gặp đối tượng sai thì ném ClassCastException.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 4</h2>
<ol>
<li><strong>is-a → <code>extends</code>, has-a → a field.</strong> If "X is a Y" sounds wrong, do not inherit (exercise 7).</li>
<li><strong>One superclass, <code>Object</code> by default;</strong> private members and constructors are not inherited.</li>
<li><strong><code>super(...)</code> first, or the compiler inserts <code>super()</code></strong> — which fails when the parent has no default constructor (PE trap #1).</li>
<li><strong>Constructors run top-down,</strong> and an overridden method called from a parent constructor sees the child's fields still at 0/null.</li>
<li><strong>Override with the same signature, a compatible return type, never narrower access</strong> — and write <code>@Override</code> (not <code>@override</code>).</li>
<li><strong>Extend, don't copy:</strong> <code>super.toString() + ", " + model</code>, <code>super.getFinalPrice() * 1.5</code>.</li>
<li><strong>Only instance methods follow the object.</strong> Fields, static methods and overload choice follow the declared type.</li>
<li><strong><code>instanceof</code> before every downcast</strong> — a wrong cast compiles and fails at run time with <code>ClassCastException</code>.</li>
</ol>
<p>Next: the Chapter 4 quiz (10 questions in FE style, with explanations), then Chapter 5 — interfaces and abstract classes, where the PE's 10-mark papers live.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 4</h2>
<ol>
<li><strong>is-a → <code>extends</code>, has-a → một trường.</strong> Câu "X là một Y" nghe sai thì đừng kế thừa (bài 7).</li>
<li><strong>Một lớp cha, mặc định là <code>Object</code>;</strong> thành viên private và constructor không được kế thừa.</li>
<li><strong><code>super(...)</code> đứng đầu, không thì trình biên dịch chèn <code>super()</code></strong> — và nó hỏng khi cha không có constructor mặc định (bẫy PE số 1).</li>
<li><strong>Constructor chạy từ trên xuống,</strong> và phương thức ghi đè được gọi từ constructor của cha thấy các trường của con vẫn còn 0/null.</li>
<li><strong>Ghi đè với cùng chữ ký, kiểu trả về tương thích, không bao giờ hẹp quyền truy cập hơn</strong> — và viết <code>@Override</code> (không phải <code>@override</code>).</li>
<li><strong>Mở rộng, đừng chép:</strong> <code>super.toString() + ", " + model</code>, <code>super.getFinalPrice() * 1.5</code>.</li>
<li><strong>Chỉ phương thức thể hiện đi theo đối tượng.</strong> Trường, phương thức static và việc chọn bản nạp chồng đi theo kiểu khai báo.</li>
<li><strong><code>instanceof</code> trước mọi phép ép kiểu xuống</strong> — ép sai vẫn biên dịch được và hỏng lúc chạy với <code>ClassCastException</code>.</li>
</ol>
<p>Tiếp theo: quiz Chương 4 (10 câu dạng FE, có giải thích), rồi tới Chương 5 — interface và lớp trừu tượng, nơi có các đề PE 10 điểm.</p>`),
  ].join('\n'),
};

/* ───────── Lab 4 — 🏗️ CT Library: inheritance and polymorphism (LibraryItem → Book, Magazine, Dvd; @Override; late fees without instanceof) ───────── */
const L_lab4 = {
  title: 'Lab 4 — 🏗️ CT Library: inheritance and polymorphism (LibraryItem → Book, Magazine, Dvd; @Override; late fees without instanceof)|||Lab 4 — 🏗️ CT Library: kế thừa và đa hình (LibraryItem → Book, Magazine, Dvd; @Override; phí trễ không cần instanceof)',
  slug: 'pro192-lab-4-ke-thua-va-da-hinh',
  type: 'VIDEO',
  description: 'Lab 4 của dự án CT Library (sau Chương 4), chuẩn review LAB211: câu lạc bộ cho mượn thêm tạp chí và DVD; LibraryItem thành lớp cha của Book, Magazine, Dvd với constructor protected gọi qua super(...), mỗi lớp con ghi đè sáu phương thức (loại, tiền tố mã, hạn mượn, phí trễ/ngày, chi tiết, khoá chống trùng); một danh sách ArrayList<LibraryItem> in ba loại dòng khác nhau bằng đa hình; tính phí trễ ở service bằng một công thức, không một instanceof nào. Kèm lỗi javac thật khi ghi đè hẹp quyền hay gõ sai tên, bẫy quên super(...), che giấu trường/static, chuỗi instanceof và ép kiểu sai (ClassCastException trên JDK 8 thật). Starter + đáp án tải về, bộ chấm kiểu PE 199 dòng, rubric 10 điểm.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lab 4 · CT Library</span>
<h2>Lab 4 — inheritance and polymorphism</h2>
<p class="lead">Chapter 4 taught you to write the common part of several classes once (inheritance) and to let one line of code behave differently for each object (polymorphism). Lab 4 puts both to work: the club now lends magazines and DVDs, so <code>LibraryItem</code> becomes the parent of <code>Book</code>, <code>Magazine</code> and <code>Dvd</code>, each class answers six questions its own way, and the late fee is computed without a single <code>instanceof</code>.</p>
<p>The starter is a fresh project: Lab 3 finished, the hierarchy in place, five bodies marked <code>TODO Lab 4.x</code>. Plan about <strong>3 hours</strong>.</p>`,
    `<span class="eyebrow">Chương 4 · Lab 4 · CT Library</span>
<h2>Lab 4 — kế thừa và đa hình</h2>
<p class="lead">Chương 4 dạy bạn viết phần chung của nhiều lớp đúng một lần (kế thừa) và để một dòng code chạy khác nhau với từng đối tượng (đa hình). Lab 4 dùng cả hai: câu lạc bộ giờ cho mượn thêm tạp chí và DVD, nên <code>LibraryItem</code> thành lớp cha của <code>Book</code>, <code>Magazine</code> và <code>Dvd</code>, mỗi lớp trả lời sáu câu hỏi theo cách riêng, và phí trễ hạn được tính mà không cần một <code>instanceof</code> nào.</p>
<p>Starter là một dự án sạch: Lab 3 đã xong, cây lớp đã dựng sẵn, năm thân hàm đánh dấu <code>TODO Lab 4.x</code>. Dành khoảng <strong>3 giờ</strong>.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 Lab 4 (16 slides)</h2>
<p>The deck of this lab, made for CT Library (it is not a school deck). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project, compiled with <code>javac --release 8</code> and run — the same runs you find in the steps below.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 Lab 4 (16 slide)</h2>
<p>Bộ slide của lab này, dựng riêng cho CT Library (không phải slide của trường). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ dự án thật, biên dịch bằng <code>javac --release 8</code> rồi chạy — đúng những lần chạy bạn gặp lại ở các bước bên dưới.</p>`),
    walk('lab4', [
      [1, 'Lab 4 — CT Library: inheritance and polymorphism',
        `<p class="y-chinh">🎯 Lab 4 = Chapter 4 on a real codebase: one parent class holds what every item shares, three child classes answer the questions that differ.</p>
<p>By the end, one loop over one list prints books, magazines and DVDs — each row with its own loan days, fee and detail — and the code that prints it never asks "what are you?".</p>`,
        `<p class="y-chinh">🎯 Lab 4 = Chương 4 trên một bộ mã thật: một lớp cha giữ thứ mọi tài liệu cùng có, ba lớp con trả lời những câu hỏi khác nhau.</p>
<p>Cuối lab, một vòng lặp trên một danh sách in ra cả sách, tạp chí và DVD — mỗi dòng có hạn mượn, mức phí và chi tiết riêng — mà đoạn code in không bao giờ hỏi "bạn là loại gì?".</p>`],
      [2, 'Ticket CTL-4 — "we lend magazines and DVDs now"',
        `<p class="y-chinh">🎯 The ticket adds two kinds of item with their own rules (7 days / 1,000 đ, 3 days / 5,000 đ) next to books (14 days / 2,000 đ) and a new menu item: 9 — late fee.</p>
<p>Done means: PASS 199/199, <code>lint.py</code> still silent, <code>@Override</code> on every overriding method, and <code>grep -rn instanceof src/</code> prints nothing. The last line of the slide is the real goal: a fourth kind of item later must be <em>a new class</em>, not a new <code>if</code> somewhere.</p>`,
        `<p class="y-chinh">🎯 Ticket thêm hai loại tài liệu có luật riêng (7 ngày / 1.000 đ, 3 ngày / 5.000 đ) bên cạnh sách (14 ngày / 2.000 đ) và một mục menu mới: 9 — tính phí trễ hạn.</p>
<p>Xong nghĩa là: PASS 199/199, <code>lint.py</code> vẫn im lặng, <code>@Override</code> trên mọi phương thức ghi đè, và <code>grep -rn instanceof src/</code> không in gì. Dòng cuối slide mới là mục tiêu thật: sau này thêm loại thứ tư phải là <em>thêm một lớp</em>, không phải thêm một câu <code>if</code> ở đâu đó.</p>`],
      [3, 'The class tree — one parent, three children',
        `<p class="y-chinh">🎯 <code>LibraryItem</code> holds the common part (id, title, year, copies) and the six questions; <code>Book</code>, <code>Magazine</code> and <code>Dvd</code> each add one or two fields and answer the six questions.</p>
<p>Each arrow is an <strong>is-a</strong>: a Magazine is a library item, so it can go wherever a <code>LibraryItem</code> is expected. The parent's full constructor is <code>protected</code> — the first real use of that modifier in CT Library: only subclasses may call it, through <code>super(...)</code>. Fields stay <code>private</code>, exactly as the reviewer demands; the children read them through the inherited getters.</p>`,
        `<p class="y-chinh">🎯 <code>LibraryItem</code> giữ phần chung (mã, tên, năm, số bản) và sáu câu hỏi; <code>Book</code>, <code>Magazine</code>, <code>Dvd</code> mỗi lớp thêm một hai trường và trả lời sáu câu hỏi đó.</p>
<p>Mỗi mũi tên là một quan hệ <strong>is-a</strong> (là một): tạp chí là một tài liệu, nên nó đứng được ở mọi chỗ cần <code>LibraryItem</code>. Constructor đầy đủ của lớp cha là <code>protected</code> — lần đầu modifier này có chỗ dùng thật trong CT Library: chỉ lớp con được gọi, qua <code>super(...)</code>. Trường vẫn <code>private</code> đúng như thầy yêu cầu; lớp con đọc chúng qua getter được kế thừa.</p>`],
      [4, 'Six questions, three different answers',
        `<p class="y-chinh">🎯 Overriding = the child gives its own body to a method it inherited, with the same name and the same parameters; the table is the whole specification of Lab 4.</p>
<p>Every value comes from <code>Constants</code> or <code>Message</code>. Look at what the parent itself answers: "Tai lieu", "I", 0 days, 0 đ. A "generic item" makes no sense in a library — Lab 4 keeps it because Chapter 4 has no better tool yet; Lab 5 makes the class <code>abstract</code> so that nobody can create one.</p>`,
        `<p class="y-chinh">🎯 Ghi đè (override) = lớp con viết thân riêng cho một phương thức nó được thừa kế, cùng tên, cùng tham số; bảng này là toàn bộ đặc tả của Lab 4.</p>
<p>Mọi giá trị lấy từ <code>Constants</code> hoặc <code>Message</code>. Nhìn xem chính lớp cha trả lời gì: "Tai lieu", "I", 0 ngày, 0 đồng. Một "tài liệu chung chung" vô nghĩa trong thư viện — Lab 4 giữ nó vì Chương 4 chưa có công cụ tốt hơn; Lab 5 biến lớp này thành <code>abstract</code> để không ai tạo được.</p>`],
      [5, 'TODO 4.1 — super(...) comes first',
        `<p class="y-chinh">🎯 The child's constructor builds the parent part first: <code>super(id, title, year, copies)</code> on the first line, then its own fields.</p>
<p>The trap is that forgetting it is <em>not</em> a compile error here. Our parent has an empty JavaBean constructor, so javac silently inserts <code>super()</code> — and every book loses its title and year. The real run of <code>LabBayQuenSuper</code> shows <code>title=""</code> and <code>year=0</code>; the starter does exactly that to the four sample books. (In 4.A-2 you saw the other case: a parent with no empty constructor makes javac stop.)</p>`,
        `<p class="y-chinh">🎯 Constructor của lớp con dựng phần cha trước: <code>super(id, title, year, copies)</code> ở dòng đầu, rồi mới tới trường của chính nó.</p>
<p>Cái bẫy là quên dòng đó ở đây <em>không</em> phải lỗi biên dịch. Lớp cha của ta có constructor rỗng kiểu JavaBean, nên javac lặng lẽ chèn <code>super()</code> — và mọi cuốn sách mất tên, mất năm. Lần chạy thật <code>LabBayQuenSuper</code> in <code>title=""</code> và <code>year=0</code>; starter làm đúng như vậy với bốn cuốn sách mẫu. (Ở 4.A-2 bạn đã gặp trường hợp kia: lớp cha không có constructor rỗng thì javac dừng luôn.)</p>`],
      [6, 'TODO 4.2 and 4.3 — @Override six methods',
        `<p class="y-chinh">🎯 Each override is three lines: <code>@Override</code>, the same signature as the parent (still <code>public</code>), and a body that returns this class's constant.</p>
<p><code>getDetail</code> and <code>getUniqueKey</code> format a <code>Message</code> pattern. The magazine's key uses <code>getTitle()</code>, not <code>title</code>: the field is private to <code>LibraryItem</code>, so the child reads it through the inherited getter. <code>Dvd</code> is the same work with <code>DVD_…</code> constants and <code>minutes</code>; its key is title + year.</p>`,
        `<p class="y-chinh">🎯 Mỗi phương thức ghi đè gồm ba phần: <code>@Override</code>, đúng chữ ký của lớp cha (vẫn <code>public</code>), và thân trả về hằng của lớp này.</p>
<p><code>getDetail</code> và <code>getUniqueKey</code> định dạng một mẫu trong <code>Message</code>. Khoá của tạp chí dùng <code>getTitle()</code>, không phải <code>title</code>: trường đó private của <code>LibraryItem</code>, nên lớp con đọc qua getter được thừa kế. <code>Dvd</code> làm y vậy với hằng <code>DVD_…</code> và <code>minutes</code>; khoá của nó là tên + năm.</p>`],
      [7, 'Why @Override: two mistakes javac now catches',
        `<p class="y-chinh">🎯 With <code>@Override</code>, a misspelled name and a narrower access are compile errors instead of silent bugs.</p>
<p>The project <code>bay/ghi-de-sai</code> plants both in the solution. Dropping <code>public</code> gives "attempting to assign weaker access privileges; was public": an override may never be less visible than the parent, because code holding a <code>LibraryItem</code> must be able to call it. Writing <code>getLoanDay()</code> gives "method does not override or implement a method from a supertype". Without the annotation, that second mistake compiles — and the parent's 0 days runs.</p>`,
        `<p class="y-chinh">🎯 Có <code>@Override</code>, gõ sai tên hay thu hẹp quyền truy cập đều thành lỗi biên dịch thay vì lỗi âm thầm.</p>
<p>Dự án <code>bay/ghi-de-sai</code> cài cả hai vào đáp án. Bỏ <code>public</code> ra "attempting to assign weaker access privileges; was public": bản ghi đè không bao giờ được hẹp quyền hơn lớp cha, vì code đang cầm một <code>LibraryItem</code> phải gọi được nó. Gõ <code>getLoanDay()</code> ra "method does not override or implement a method from a supertype". Không có chú thích đó, lỗi thứ hai vẫn biên dịch — và 0 ngày của lớp cha sẽ chạy.</p>`],
      [8, 'One list, three classes — one place knows them',
        `<p class="y-chinh">🎯 The repository keeps one <code>ArrayList&lt;LibraryItem&gt;</code>; <code>createItem</code> — given in the starter — is the only code that names the three child classes.</p>
<p><code>return new Magazine(...)</code> from a method declared to return <code>LibraryItem</code> is <strong>upcasting</strong>: a child object stored in a parent-type variable, automatic and always safe. Creating needs to know the exact class; <em>using</em> never does. That split — one switch where objects are born, polymorphism everywhere else — is the Factory idea LAB211 reviewers like to hear about.</p>`,
        `<p class="y-chinh">🎯 Repository giữ một <code>ArrayList&lt;LibraryItem&gt;</code>; <code>createItem</code> — cho sẵn trong starter — là đoạn code duy nhất gọi tên ba lớp con.</p>
<p><code>return new Magazine(...)</code> từ một phương thức khai trả về <code>LibraryItem</code> là <strong>upcasting</strong> (ép lên): đối tượng lớp con nằm trong biến kiểu cha, tự động và luôn an toàn. Lúc <em>tạo</em> thì phải biết đúng lớp; lúc <em>dùng</em> thì không bao giờ cần. Cách chia đó — một switch nơi đối tượng ra đời, đa hình ở mọi chỗ khác — chính là ý Factory mà thầy LAB211 thích nghe.</p>`],
      [9, 'TODO 4.4 — every object answers for itself',
        `<p class="y-chinh">🎯 <code>toResponseDTO</code> copies the common part, then asks the item for its loan days, fee and detail — no <code>if</code>, no cast.</p>
<p>In the real output of option 2, one loop prints three kinds of rows: books with 14 / 2000 and "author, ISBN", the magazine with 7 / 1000 and "Ky so 118", the DVD with 3 / 5000 and "120 phut". The starter prints <code>0</code>, <code>0</code> and <code>null</code> in those columns — nobody set them yet.</p>`,
        `<p class="y-chinh">🎯 <code>toResponseDTO</code> chép phần chung, rồi hỏi chính tài liệu hạn mượn, phí và chi tiết của nó — không <code>if</code>, không ép kiểu.</p>
<p>Trong output thật của lựa chọn 2, một vòng lặp in ba kiểu dòng: sách 14 / 2000 và "tác giả, ISBN", tạp chí 7 / 1000 và "Ky so 118", DVD 3 / 5000 và "120 phut". Starter in <code>0</code>, <code>0</code> và <code>null</code> ở các cột đó — chưa ai gán.</p>`],
      [10, 'How a polymorphic call is decided — two gates',
        `<p class="y-chinh">🎯 javac checks a call against the <em>declared</em> type; the JVM runs the body of the <em>object</em> — the two-gate model of 4.A-3 and 4.B.</p>
<p>So <code>item.getLoanDays()</code> compiles because <code>LibraryItem</code> declares it, and at run time gives 14, 7 or 3. The flip side: <code>item.getIsbn()</code> does not compile, even when the object is a Book, because the declared type has no such method. That is why the six questions live in the parent.</p>`,
        `<p class="y-chinh">🎯 javac kiểm lời gọi theo kiểu <em>khai báo</em>; JVM chạy thân của <em>đối tượng</em> — mô hình hai cửa ở 4.A-3 và 4.B.</p>
<p>Vì vậy <code>item.getLoanDays()</code> biên dịch được vì <code>LibraryItem</code> có khai nó, và lúc chạy cho ra 14, 7 hoặc 3. Mặt kia: <code>item.getIsbn()</code> không biên dịch được, kể cả khi đối tượng là Book, vì kiểu khai báo không có phương thức đó. Đó là lý do sáu câu hỏi phải nằm ở lớp cha.</p>`],
      [11, 'TODO 4.5 — the late fee: one formula for every type',
        `<p class="y-chinh">🎯 <code>BookService.calculateLateFee</code> uses one formula — days late = days kept − loan days (never negative), fee = days late × fee per day — because the row already carries the right numbers for its type.</p>
<p>Real output: a book kept 20 days is 6 days late, 12,000 đ; the magazine kept 10 days is 3 days late, 3,000 đ; a DVD returned on day 3 costs 0; the new DVD kept 5 days costs 10,000 đ. The service still never sees the repository: the controller hands it a copy from <code>findById</code>.</p>`,
        `<p class="y-chinh">🎯 <code>BookService.calculateLateFee</code> dùng một công thức — ngày trễ = ngày giữ − hạn mượn (không âm), phí = ngày trễ × phí mỗi ngày — vì dòng dữ liệu đã mang đúng con số của loại nó.</p>
<p>Output thật: một cuốn sách giữ 20 ngày là trễ 6 ngày, 12.000 đ; tạp chí giữ 10 ngày trễ 3 ngày, 3.000 đ; DVD trả đúng ngày thứ 3 thì 0 đồng; DVD mới giữ 5 ngày thì 10.000 đ. Service vẫn không bao giờ thấy repository: controller đưa cho nó bản sao từ <code>findById</code>.</p>`],
      [12, 'Trap: computing the fee with an instanceof chain',
        `<p class="y-chinh">🎯 An <code>if (item instanceof Book) … else if (item instanceof Dvd) …</code> chain must be edited for every new class — and when someone forgets, the new class costs 0 đ silently.</p>
<p>In the real run, a teammate's <code>AudioBook</code> gets 0 from the instanceof version and 6,000 from the polymorphic one. That is the Open/Closed principle in one output: the polymorphic line is closed for change and open for extension — the new class brings its own fee.</p>`,
        `<p class="y-chinh">🎯 Chuỗi <code>if (item instanceof Book) … else if (item instanceof Dvd) …</code> phải sửa mỗi lần có lớp mới — và khi ai đó quên, lớp mới lặng lẽ bị tính 0 đồng.</p>
<p>Trong lần chạy thật, <code>AudioBook</code> của bạn cùng nhóm nhận 0 từ bản instanceof và 6.000 từ bản đa hình. Đó là nguyên lý Open/Closed trong một output: dòng đa hình đóng với sửa đổi và mở với mở rộng — lớp mới tự mang mức phí của nó.</p>`],
      [13, 'Trap: hiding is not overriding',
        `<p class="y-chinh">🎯 Only instance methods are overridden; a re-declared field and a static method are <em>hidden</em> and chosen by the declared type.</p>
<p>With <code>LibraryItem item = new Dvd()</code>, the real output gives <code>item.typeName = Tai lieu</code> (the parent's field), <code>item.shelf() = ke chung</code> (the parent's static method), but <code>item.getLoanDays() = 3</code> (the Dvd override). CT Library avoids the trap by rule: fields private, no static in model — and FE questions love this exact output.</p>`,
        `<p class="y-chinh">🎯 Chỉ phương thức thể hiện (instance method) mới được ghi đè; trường khai lại và phương thức static thì bị <em>che giấu</em> (hiding) và được chọn theo kiểu khai báo.</p>
<p>Với <code>LibraryItem item = new Dvd()</code>, output thật cho <code>item.typeName = Tai lieu</code> (trường của cha), <code>item.shelf() = ke chung</code> (static của cha), nhưng <code>item.getLoanDays() = 3</code> (bản ghi đè của Dvd). CT Library tránh bẫy bằng luật: trường private, không static trong model — còn đề FE thì rất thích hỏi đúng output này.</p>`],
      [14, 'Trap: the downcast that compiles and still fails',
        `<p class="y-chinh">🎯 A downcast <code>(Book) item</code> compiles because a <code>LibraryItem</code> <em>might</em> be a Book; the JVM checks the real object and throws <code>ClassCastException</code> when it is not.</p>
<p>On a real JDK 8 (the exam machine) the message is "Magazine cannot be cast to Book"; newer JDKs add module details. CT Library needs no cast at all: asking <code>item.getDetail()</code> works for every kind. If you ever must cast, check with <code>instanceof</code> first — but in this lab, needing a cast is a sign the method belongs in the parent.</p>`,
        `<p class="y-chinh">🎯 Ép kiểu xuống <code>(Book) item</code> biên dịch được vì một <code>LibraryItem</code> <em>có thể</em> là Book; JVM kiểm đối tượng thật và ném <code>ClassCastException</code> khi không phải.</p>
<p>Trên JDK 8 thật (máy phòng thi) thông báo là "Magazine cannot be cast to Book"; JDK mới hơn thêm chi tiết module. CT Library không cần ép kiểu: hỏi <code>item.getDetail()</code> là được với mọi loại. Nếu buộc phải ép, kiểm bằng <code>instanceof</code> trước — nhưng trong lab này, cần ép kiểu là dấu hiệu phương thức đó phải nằm ở lớp cha.</p>`],
      [15, 'Green: PASS 199/199, a silent reviewer, zero instanceof',
        `<p class="y-chinh">🎯 Three green lights: the grader (199/199), <code>lint.py</code> (✓ sạch) and a <code>grep</code> that finds no <code>instanceof</code>.</p>
<p>Work in the order of the symptoms: 4.1 brings the titles back, 4.2 and 4.3 turn "Tai lieu" and ids I005… into "Tap chi", "DVD", T005, D006, 4.4 fills the Days / Fee / Detail columns, 4.5 makes option 9 right. Run <code>check.sh</code> after each TODO.</p>`,
        `<p class="y-chinh">🎯 Ba đèn xanh: bộ chấm (199/199), <code>lint.py</code> (✓ sạch) và một lệnh <code>grep</code> không tìm thấy <code>instanceof</code> nào.</p>
<p>Làm theo thứ tự triệu chứng: 4.1 trả lại tên sách, 4.2 và 4.3 đổi "Tai lieu" và mã I005… thành "Tap chi", "DVD", T005, D006, 4.4 lấp các cột Days / Fee / Detail, 4.5 làm đúng lựa chọn 9. Chạy <code>check.sh</code> sau mỗi TODO.</p>`],
      [16, 'Rubric — 10 points, PE style',
        `<p class="y-chinh">🎯 Points follow the TODOs, plus one oral question the LAB211 reviewer always asks: "overloading or overriding?".</p>
<p>Overloading: same name, different parameters, in one class, decided by javac. Overriding: same signature, in a subclass, decided by the JVM. Answer the three self-check questions aloud before you open the solution.</p>`,
        `<p class="y-chinh">🎯 Điểm đi theo các TODO, cộng một câu vấn đáp thầy LAB211 luôn hỏi: "nạp chồng hay ghi đè?".</p>
<p>Nạp chồng (overloading): cùng tên, khác tham số, trong một lớp, javac quyết. Ghi đè (overriding): cùng chữ ký, ở lớp con, JVM quyết. Trả lời thành tiếng ba câu tự kiểm trước khi mở đáp án.</p>`],
    ]),
    bi(`<h2>1. The ticket</h2>
<div class="callout"><p><strong>CTL-4 · CT Library · priority: high.</strong> "From next week the club lends magazines (7 days, 1,000 đ per late day) and DVDs (3 days, 5,000 đ per late day) as well as books (14 days, 2,000 đ). Keep everything in one catalogue with ids B…, T…, D…, show the loan days and the fee in the list, and add option 9 to compute the late fee of an item. Next year we will surely add audiobooks — adding a type must not mean editing ten places." — the team lead</p></div>
<table>
<thead><tr><th>You need</th><th>From</th></tr></thead>
<tbody>
<tr><td><code>extends</code>, is-a vs has-a, what a subclass inherits</td><td>4.A (pro9 slides 1–6)</td></tr>
<tr><td><code>super(...)</code> and the constructor chain</td><td>4.A-2 (pro9 slides 7–10)</td></tr>
<tr><td>overriding, hiding, <code>instanceof</code>, casting</td><td>4.A-3, 4.A-4 (pro9 slides 11–17)</td></tr>
<tr><td>polymorphism: declared type vs object</td><td>4.B, 4.B-2 (pro10 slides 1–11)</td></tr>
</tbody>
</table>`,
    `<h2>1. Ticket</h2>
<div class="callout"><p><strong>CTL-4 · CT Library · ưu tiên: cao.</strong> "Từ tuần sau câu lạc bộ cho mượn cả tạp chí (7 ngày, trễ 1.000 đ/ngày) và DVD (3 ngày, trễ 5.000 đ/ngày) bên cạnh sách (14 ngày, 2.000 đ). Giữ tất cả trong một danh mục với mã B…, T…, D…, danh sách hiện hạn mượn và mức phí, và thêm lựa chọn 9 để tính phí trễ của một tài liệu. Sang năm chắc chắn sẽ có sách nói — thêm một loại không được là sửa mười chỗ." — trưởng nhóm</p></div>
<table>
<thead><tr><th>Bạn cần</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td><code>extends</code>, is-a và has-a, lớp con được thừa kế gì</td><td>4.A (pro9 slide 1–6)</td></tr>
<tr><td><code>super(...)</code> và chuỗi constructor</td><td>4.A-2 (pro9 slide 7–10)</td></tr>
<tr><td>ghi đè, che giấu, <code>instanceof</code>, ép kiểu</td><td>4.A-3, 4.A-4 (pro9 slide 11–17)</td></tr>
<tr><td>đa hình: kiểu khai báo và đối tượng</td><td>4.B, 4.B-2 (pro10 slide 1–11)</td></tr>
</tbody>
</table>`),
    bi(`<h2>2. Requirements and acceptance criteria</h2>
<ol>
<li><strong>Hierarchy</strong>: <code>model.LibraryItem</code> holds id, title, year, copies (private, getters/setters, a <code>protected</code> full constructor); <code>Book</code> (isbn, author), <code>Magazine</code> (issueNumber 1–999), <code>Dvd</code> (minutes 1–600) extend it, each with an empty public constructor (JavaBean).</li>
<li><strong>Six overrides</strong> in every child, each with <code>@Override</code> and <code>public</code>: type name, id prefix (B/T/D), loan days (14/7/3), late fee per day (2000/1000/5000), detail, duplicate key (ISBN · title + issue · title + year).</li>
<li><strong>One list</strong>: the repository keeps <code>ArrayList&lt;LibraryItem&gt;</code>; ids come from one counter with the item's own prefix (B001…B004, T005, D006, then T007, D008).</li>
<li><strong>List and search</strong> show Type, Days, Fee and Detail for every row — produced without <code>if</code> on the type and without casts.</li>
<li><strong>Option 9 — late fee</strong>: id + days kept (0–365) ⇒ two lines: the item with its loan days, days kept, days late and fee per day; then the total. Unknown id ⇒ the not-found message.</li>
<li>The fee is computed in <code>BookService</code> with one formula; <code>grep -rn instanceof src/</code> prints nothing.</li>
</ol>
<div class="callout ok"><p><strong>Done means:</strong> <code>check.sh</code> prints <code>PASS: 199/199 dong khop expected.txt</code> · <code>lint.py</code> 0 violations · <code>javac --release 8</code> compiles · no <code>instanceof</code> · you can say in one sentence why each method is in the parent.</p></div>`,
    `<h2>2. Yêu cầu và tiêu chí đạt</h2>
<ol>
<li><strong>Cây lớp</strong>: <code>model.LibraryItem</code> giữ mã, tên, năm, số bản (private, getter/setter, constructor đầy đủ <code>protected</code>); <code>Book</code> (isbn, author), <code>Magazine</code> (issueNumber 1–999), <code>Dvd</code> (minutes 1–600) kế thừa nó, mỗi lớp có constructor rỗng public (JavaBean).</li>
<li><strong>Sáu phương thức ghi đè</strong> ở mỗi lớp con, đều có <code>@Override</code> và <code>public</code>: tên loại, tiền tố mã (B/T/D), hạn mượn (14/7/3), phí trễ mỗi ngày (2000/1000/5000), chi tiết, khoá chống trùng (ISBN · tên + kỳ số · tên + năm).</li>
<li><strong>Một danh sách</strong>: repository giữ <code>ArrayList&lt;LibraryItem&gt;</code>; mã lấy từ một bộ đếm với tiền tố của chính tài liệu (B001…B004, T005, D006, rồi T007, D008).</li>
<li><strong>Danh sách và tìm kiếm</strong> hiện Type, Days, Fee và Detail cho mọi dòng — tạo ra mà không có <code>if</code> theo loại, không ép kiểu.</li>
<li><strong>Lựa chọn 9 — phí trễ</strong>: mã + số ngày đã giữ (0–365) ⇒ hai dòng: tài liệu kèm hạn mượn, số ngày giữ, số ngày trễ và phí mỗi ngày; rồi tổng phí. Mã không có ⇒ câu báo không tìm thấy.</li>
<li>Phí tính ở <code>BookService</code> bằng một công thức; <code>grep -rn instanceof src/</code> không in gì.</li>
</ol>
<div class="callout ok"><p><strong>Xong nghĩa là:</strong> <code>check.sh</code> in <code>PASS: 199/199 dong khop expected.txt</code> · <code>lint.py</code> 0 vi phạm · <code>javac --release 8</code> biên dịch được · không có <code>instanceof</code> · bạn nói được bằng một câu vì sao mỗi phương thức nằm ở lớp cha.</p></div>`),
    bi(`<h2>3. Files</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab4-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab4-starter.zip</span><span class="lc-sub">Lab 3 solution + the LibraryItem tree · TODO 4.1–4.5 · harness (199 lines) · CheckHarness</span></span>
<span class="lc-cta">Download</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab4-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab4-solution.zip</span><span class="lc-sub">the full solution — open it only after your own attempt</span></span>
<span class="lc-cta">Download</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab4/src/  (new or changed since Lab 3)
  model/LibraryItem.java           parent: common fields, protected constructor, 6 questions (given)
  model/Book.java                  TODO 4.1 the constructor: super(...) first
  model/Magazine.java              TODO 4.2 six @Override methods
  model/Dvd.java                   TODO 4.3 six @Override methods
  repository/BookRepository.java   ArrayList&lt;LibraryItem&gt;, createItem (given) · TODO 4.4 toResponseDTO
  service/BookService.java         TODO 4.5 calculateLateFee
  dto/LateFeeDTO.java, view/LateFeeView.java, main/Main.java (option 9)   (given)</code></pre>`,
    `<h2>3. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab4-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab4-starter.zip</span><span class="lc-sub">đáp án Lab 3 + cây LibraryItem · TODO 4.1–4.5 · harness (199 dòng) · CheckHarness</span></span>
<span class="lc-cta">Tải về</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab4-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab4-solution.zip</span><span class="lc-sub">đáp án đầy đủ — chỉ mở sau khi đã tự làm</span></span>
<span class="lc-cta">Tải về</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab4/src/  (mới hoặc đổi so với Lab 3)
  model/LibraryItem.java           lớp cha: trường chung, constructor protected, 6 câu hỏi (cho sẵn)
  model/Book.java                  TODO 4.1 constructor: super(...) trước
  model/Magazine.java              TODO 4.2 sáu phương thức @Override
  model/Dvd.java                   TODO 4.3 sáu phương thức @Override
  repository/BookRepository.java   ArrayList&lt;LibraryItem&gt;, createItem (cho sẵn) · TODO 4.4 toResponseDTO
  service/BookService.java         TODO 4.5 calculateLateFee
  dto/LateFeeDTO.java, view/LateFeeView.java, main/Main.java (lựa chọn 9)   (cho sẵn)</code></pre>`),
    bi(`<h2>4. Step by step</h2>
<h4>Step 0 — run the starter and read the symptoms (10 min)</h4>
<p>Before touching anything, run it. Every wrong column points at one TODO:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
2 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
4 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
5 &nbsp;&nbsp;I005 &nbsp;Tai lieu 2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
6 &nbsp;&nbsp;I006 &nbsp;Tai lieu 2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
…</div>
<p>Empty titles and year 0 ⇒ the parent part was never built (4.1). "Tai lieu" and ids I005, I006 ⇒ the parent's generic answers are running (4.2, 4.3). Days 0, Fee 0, Detail <code>null</code> ⇒ nobody copied them (4.4).</p>

<h4>Step 1 — TODO 4.1 super(...) first (10 min)</h4>
<details><summary>Hint</summary><p>The parent's fields are private: <code>Book</code> cannot write <code>this.title = title</code>. It must pass them to <code>LibraryItem(id, title, year, copies)</code> — and that call must be the <em>first</em> statement.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Constructor day du; super(...) PHAI la dong dau: dung phan cha truoc, phan con sau
public Book(String id, String isbn, String title, String author, int year, int copies) {
    super(id, title, year, copies);
    this.isbn = isbn;
    this.author = author;
}</code></pre>
</details>

<h4>Step 2 — TODO 4.2 and 4.3 twelve overrides (40 min)</h4>
<details><summary>Hint</summary><p>Copy the signature from <code>LibraryItem</code>, keep <code>public</code>, put <code>@Override</code> above. Values: <code>Message.TYPE_MAGAZINE</code>, <code>Constants.MAGAZINE_ID_PREFIX</code>, <code>MAGAZINE_LOAN_DAYS</code>, <code>MAGAZINE_LATE_FEE</code>, <code>String.format(Message.DETAIL_MAGAZINE, issueNumber)</code>, <code>String.format(Message.KEY_MAGAZINE, getTitle(), issueNumber)</code>.</p></details>
<details><summary>Solution — Magazine (Dvd is the same with DVD_… and minutes)</summary>
<pre class="trich"><code class="language-java">
    // Loai: Tap chi
    @Override
    public String getTypeName() {
        return Message.TYPE_MAGAZINE;
    }

    // Ma tap chi bat dau bang T
    @Override
    public String getIdPrefix() {
        return Constants.MAGAZINE_ID_PREFIX;
    }

    // Tap chi muon 7 ngay
    @Override
    public int getLoanDays() {
        return Constants.MAGAZINE_LOAN_DAYS;
    }

    // Tap chi tre 1000 dong/ngay
    @Override
    public int getLateFeePerDay() {
        return Constants.MAGAZINE_LATE_FEE;
    }

    // Chi tiet: ky so
    @Override
    public String getDetail() {
        return String.format(Message.DETAIL_MAGAZINE, issueNumber);
    }

    // Cung ten + cung ky so la trung; ten lay qua getter vi truong title la private cua cha
    @Override
    public String getUniqueKey() {
        return String.format(Message.KEY_MAGAZINE, getTitle(), issueNumber);
    }
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: Ky so: Ky so phai tu 1 den 999, ban nhap 0. Moi nhap lai.<br>
Ky so: Ky so phai la 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Ky so: Trung Tech Weekly ky 118 voi Tap chi T005 "Tech Weekly". Moi tai lieu chi them 1 lan.<br>
…</div>

<h4>Step 3 — TODO 4.4 toResponseDTO (15 min)</h4>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Chep 1 tai lieu sang 1 dong bang MOI; khong hoi "ban la lop nao": doi tuong tu tra loi
private BookResponseDTO toResponseDTO(LibraryItem item) {
    // Phan chung doc qua getter cua lop cha
    BookResponseDTO responseDTO = new BookResponseDTO(item.getId(), item.getTypeName(),
            item.getTitle(), item.getYear(), item.getCopies());

    // Phan rieng: JVM chon ban ghi de theo doi tuong that (Book, Magazine hay Dvd)
    responseDTO.setLoanDays(item.getLoanDays());
    responseDTO.setLateFeePerDay(item.getLateFeePerDay());
    responseDTO.setDetail(item.getDetail());
    return responseDTO;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
6 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
…</div>

<h4>Step 4 — TODO 4.5 the late fee (20 min)</h4>
<details><summary>Hint</summary><p><code>Math.max(0, daysKept - item.getLoanDays())</code> keeps the days late from going negative. Copy id, title, type, loan days and fee per day into the <code>LateFeeDTO</code>, then days kept, days late and the total.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Tinh phi tre: so ngay tre = so ngay giu - han muon (khong am), phi = ngay tre x phi/ngay.
// Khong co nhanh nao theo loai: dong bang da mang han muon + phi/ngay cua dung loai do
public LateFeeDTO calculateLateFee(BookResponseDTO item, int daysKept) {
    // Ket qua; so ngay tre (am nghia la tra som/dung han thi tinh 0)
    LateFeeDTO lateFee = new LateFeeDTO();
    int daysLate = Math.max(0, daysKept - item.getLoanDays());

    // Chep thong tin tai lieu de View in
    lateFee.setId(item.getId());
    lateFee.setTitle(item.getTitle());
    lateFee.setTypeName(item.getTypeName());
    lateFee.setLoanDays(item.getLoanDays());
    lateFee.setLateFeePerDay(item.getLateFeePerDay());

    // So ngay giu, so ngay tre va tong phi
    lateFee.setDaysKept(daysKept);
    lateFee.setDaysLate(daysLate);
    lateFee.setTotalFee(daysLate * item.getLateFeePerDay());
    return lateFee;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Phi tre han: 12000 dong.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: D006 "The Social Network" (DVD): han muon 3 ngay, da giu 3 ngay, tre 0 ngay x 5000 dong/ngay.<br>
Phi tre han: 0 dong.<br>
…</div>

<h4>Step 5 — grade, lint, grep, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 199/199 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab4-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab4-Solution — sạch</div>`,
    `<h2>4. Làm từng bước</h2>
<h4>Bước 0 — chạy starter và đọc triệu chứng (10 phút)</h4>
<p>Trước khi sửa gì, chạy thử. Mỗi cột sai chỉ đúng vào một TODO:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
2 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
4 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
5 &nbsp;&nbsp;I005 &nbsp;Tai lieu 2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
6 &nbsp;&nbsp;I006 &nbsp;Tai lieu 2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;null<br>
…</div>
<p>Tên rỗng và năm 0 ⇒ phần cha chưa từng được dựng (4.1). "Tai lieu" và mã I005, I006 ⇒ câu trả lời chung chung của lớp cha đang chạy (4.2, 4.3). Days 0, Fee 0, Detail <code>null</code> ⇒ chưa ai chép chúng sang (4.4).</p>

<h4>Bước 1 — TODO 4.1 super(...) trước (10 phút)</h4>
<details><summary>Gợi ý</summary><p>Trường của lớp cha là private: <code>Book</code> không viết được <code>this.title = title</code>. Nó phải chuyển chúng cho <code>LibraryItem(id, title, year, copies)</code> — và lời gọi đó phải là câu lệnh <em>đầu tiên</em>.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Constructor day du; super(...) PHAI la dong dau: dung phan cha truoc, phan con sau
public Book(String id, String isbn, String title, String author, int year, int copies) {
    super(id, title, year, copies);
    this.isbn = isbn;
    this.author = author;
}</code></pre>
</details>

<h4>Bước 2 — TODO 4.2 và 4.3 mười hai phương thức ghi đè (40 phút)</h4>
<details><summary>Gợi ý</summary><p>Chép chữ ký từ <code>LibraryItem</code>, giữ <code>public</code>, đặt <code>@Override</code> phía trên. Giá trị: <code>Message.TYPE_MAGAZINE</code>, <code>Constants.MAGAZINE_ID_PREFIX</code>, <code>MAGAZINE_LOAN_DAYS</code>, <code>MAGAZINE_LATE_FEE</code>, <code>String.format(Message.DETAIL_MAGAZINE, issueNumber)</code>, <code>String.format(Message.KEY_MAGAZINE, getTitle(), issueNumber)</code>.</p></details>
<details><summary>Lời giải — Magazine (Dvd y vậy với DVD_… và minutes)</summary>
<pre class="trich"><code class="language-java">
    // Loai: Tap chi
    @Override
    public String getTypeName() {
        return Message.TYPE_MAGAZINE;
    }

    // Ma tap chi bat dau bang T
    @Override
    public String getIdPrefix() {
        return Constants.MAGAZINE_ID_PREFIX;
    }

    // Tap chi muon 7 ngay
    @Override
    public int getLoanDays() {
        return Constants.MAGAZINE_LOAN_DAYS;
    }

    // Tap chi tre 1000 dong/ngay
    @Override
    public int getLateFeePerDay() {
        return Constants.MAGAZINE_LATE_FEE;
    }

    // Chi tiet: ky so
    @Override
    public String getDetail() {
        return String.format(Message.DETAIL_MAGAZINE, issueNumber);
    }

    // Cung ten + cung ky so la trung; ten lay qua getter vi truong title la private cua cha
    @Override
    public String getUniqueKey() {
        return String.format(Message.KEY_MAGAZINE, getTitle(), issueNumber);
    }
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: Ky so: Ky so phai tu 1 den 999, ban nhap 0. Moi nhap lai.<br>
Ky so: Ky so phai la 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Ky so: Trung Tech Weekly ky 118 voi Tap chi T005 "Tech Weekly". Moi tai lieu chi them 1 lan.<br>
…</div>

<h4>Bước 3 — TODO 4.4 toResponseDTO (15 phút)</h4>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Chep 1 tai lieu sang 1 dong bang MOI; khong hoi "ban la lop nao": doi tuong tu tra loi
private BookResponseDTO toResponseDTO(LibraryItem item) {
    // Phan chung doc qua getter cua lop cha
    BookResponseDTO responseDTO = new BookResponseDTO(item.getId(), item.getTypeName(),
            item.getTitle(), item.getYear(), item.getCopies());

    // Phan rieng: JVM chon ban ghi de theo doi tuong that (Book, Magazine hay Dvd)
    responseDTO.setLoanDays(item.getLoanDays());
    responseDTO.setLateFeePerDay(item.getLateFeePerDay());
    responseDTO.setDetail(item.getDetail());
    return responseDTO;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
6 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
…</div>

<h4>Bước 4 — TODO 4.5 phí trễ hạn (20 phút)</h4>
<details><summary>Gợi ý</summary><p><code>Math.max(0, daysKept - item.getLoanDays())</code> giữ cho số ngày trễ không âm. Chép mã, tên, loại, hạn mượn và phí mỗi ngày vào <code>LateFeeDTO</code>, rồi số ngày giữ, số ngày trễ và tổng phí.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Tinh phi tre: so ngay tre = so ngay giu - han muon (khong am), phi = ngay tre x phi/ngay.
// Khong co nhanh nao theo loai: dong bang da mang han muon + phi/ngay cua dung loai do
public LateFeeDTO calculateLateFee(BookResponseDTO item, int daysKept) {
    // Ket qua; so ngay tre (am nghia la tra som/dung han thi tinh 0)
    LateFeeDTO lateFee = new LateFeeDTO();
    int daysLate = Math.max(0, daysKept - item.getLoanDays());

    // Chep thong tin tai lieu de View in
    lateFee.setId(item.getId());
    lateFee.setTitle(item.getTitle());
    lateFee.setTypeName(item.getTypeName());
    lateFee.setLoanDays(item.getLoanDays());
    lateFee.setLateFeePerDay(item.getLateFeePerDay());

    // So ngay giu, so ngay tre va tong phi
    lateFee.setDaysKept(daysKept);
    lateFee.setDaysLate(daysLate);
    lateFee.setTotalFee(daysLate * item.getLateFeePerDay());
    return lateFee;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Phi tre han: 12000 dong.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: D006 "The Social Network" (DVD): han muon 3 ngay, da giu 3 ngay, tre 0 ngay x 5000 dong/ngay.<br>
Phi tre han: 0 dong.<br>
…</div>

<h4>Bước 5 — chấm, lint, grep, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 199/199 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab4-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab4-Solution — sạch</div>`),
    bi(`<h2>5. The full solution — and the proof it is right</h2>
<p>The solution zip is the complete project: <code>lint.py</code> 0 violations, <code>javac --release 8</code>, the same output on a real JDK 8, and 199/199 on the grader.</p>
<details><summary>Full run — java -cp build main.Main &lt; harness/input.txt (199 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
6 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: Ky so: Ky so phai tu 1 den 999, ban nhap 0. Moi nhap lai.<br>
Ky so: Ky so phai la 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Ky so: Trung Tech Weekly ky 118 voi Tap chi T005 "Tech Weekly". Moi tai lieu chi them 1 lan.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: Ky so: Da them T007 "Tech Weekly". Thu vien co 7 tai lieu.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: So phut: So phut phai tu 1 den 600, ban nhap 0. Moi nhap lai.<br>
So phut: So phut phai tu 1 den 600, ban nhap 700. Moi nhap lai.<br>
So phut: Da them D008 "The Imitation Game". Thu vien co 8 tai lieu.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Phi tre han: 12000 dong.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: T005 "Tech Weekly" (Tap chi): han muon 7 ngay, da giu 10 ngay, tre 3 ngay x 1000 dong/ngay.<br>
Phi tre han: 3000 dong.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: D006 "The Social Network" (DVD): han muon 3 ngay, da giu 3 ngay, tre 0 ngay x 5000 dong/ngay.<br>
Phi tre han: 0 dong.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: So ngay da giu phai tu 0 den 365, ban nhap -1. Moi nhap lai.<br>
So ngay da giu: D008 "The Imitation Game" (DVD): han muon 3 ngay, da giu 5 ngay, tre 2 ngay x 5000 dong/ngay.<br>
Phi tre han: 10000 dong.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): Ma tai lieu phai la B, T hoac D + 3 chu so (vi du B001, T005, D006), ban nhap "x001". Moi nhap lai.<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Khong co tai lieu nao mang ma B009. Hay chon 2 de xem ma roi thu lai.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tim tai lieu theo ten ---<br>
Tu khoa: No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;D008 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2014 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Imitation Game &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;114 phut<br>
2 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
3 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;T007 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 119<br>
6 &nbsp;&nbsp;D008 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2014 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Imitation Game &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;114 phut<br>
7 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
8 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Thong ke thu vien ---<br>
So tai lieu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 8<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 16<br>
Tai lieu het ban : 0<br>
Cu nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Head First Java (2005)<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 4 chi nam trong bo nho.</div>
</details>
<details><summary>LibraryItem.java — the parent with its six generic answers</summary>
<pre><code class="language-java">package model;

import constants.Constants;
import constants.Message;

/**
 * Lop CHA cua moi tai lieu trong thu vien (Lab 4): sach, tap chi, DVD.
 * Giu phan chung (ma, ten, nam, so ban); moi lop con GHI DE (override) phan rieng:
 * loai, tien to ma, han muon, phi tre/ngay, chi tiet, khoa chong trung.
 * Lab 4 de lop nay la lop thuong nen phai co gia tri mac dinh "chung chung" (0 ngay, 0 dong);
 * Lab 5 se bien no thanh abstract de javac buoc moi lop con tu khai.
 *
 * @author CuongThai Academy
 */
public class LibraryItem {

    // Ma tai lieu do kho cap (B001, T005, D006...)
    private String id;

    // Ten da chuan hoa (Title Case)
    private String title;

    // Nam xuat ban / phat hanh
    private int year;

    // So ban dang co tren ke
    private int copies;

    // Constructor rong (JavaBean): goi constructor day du voi chuoi rong va so 0
    public LibraryItem() {
        this("", "", 0, 0);
    }

    // Constructor day du phan chung; protected: chi lop con goi qua super(...)
    protected LibraryItem(String id, String title, int year, int copies) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.copies = copies;
    }

    // Tra ve ma tai lieu
    public String getId() {
        return id;
    }

    // Gan ma tai lieu
    public void setId(String id) {
        this.id = id;
    }

    // Tra ve ten
    public String getTitle() {
        return title;
    }

    // Gan ten
    public void setTitle(String title) {
        this.title = title;
    }

    // Tra ve nam
    public int getYear() {
        return year;
    }

    // Gan nam
    public void setYear(int year) {
        this.year = year;
    }

    // Tra ve so ban
    public int getCopies() {
        return copies;
    }

    // Gan so ban
    public void setCopies(int copies) {
        this.copies = copies;
    }

    // Ten loai tai lieu; lop con ghi de ("Sach", "Tap chi", "DVD")
    public String getTypeName() {
        return Message.TYPE_ITEM;
    }

    // Chu cai dau cua ma; lop con ghi de (B, T, D)
    public String getIdPrefix() {
        return Constants.ITEM_ID_PREFIX;
    }

    // So ngay duoc muon; tai lieu "chung chung" khong co han that (Lab 5: abstract)
    public int getLoanDays() {
        return Constants.UNKNOWN_LOAN_DAYS;
    }

    // Phi tre moi ngay (dong); tai lieu "chung chung" khong co muc phi that (Lab 5: abstract)
    public int getLateFeePerDay() {
        return Constants.UNKNOWN_LATE_FEE;
    }

    // Thong tin rieng cua tung loai (tac gia, ky so, so phut); mac dinh rong
    public String getDetail() {
        return "";
    }

    // Khoa chong trung (2 tai lieu cung khoa la trung); mac dinh la ma
    public String getUniqueKey() {
        return id;
    }
}</code></pre>
</details>
<details><summary>createItem — the only switch on the item type (given in the starter)</summary>
<pre class="trich"><code class="language-java">// NOI DUY NHAT biet ten cac lop con: tao doi tuong dung loai tu phieu (ma gan sau)
private LibraryItem createItem(BookRequestDTO bookRequestDTO) throws Exception {
    // Loai trong phieu quyet dinh lop con; bien kieu cha giu duoc ca ba (upcasting)
    switch (bookRequestDTO.getItemType()) {
        // 1: sach can them ISBN + tac gia
        case Constants.TYPE_BOOK:
            return new Book("", bookRequestDTO.getIsbn(), bookRequestDTO.getTitle(),
                    bookRequestDTO.getAuthor(), bookRequestDTO.getYear(),
                    bookRequestDTO.getCopies());
        // 2: tap chi can them ky so
        case Constants.TYPE_MAGAZINE:
            return new Magazine("", bookRequestDTO.getTitle(), bookRequestDTO.getYear(),
                    bookRequestDTO.getCopies(), bookRequestDTO.getIssueNumber());
        // 3: DVD can them so phut
        case Constants.TYPE_DVD:
            return new Dvd("", bookRequestDTO.getTitle(), bookRequestDTO.getYear(),
                    bookRequestDTO.getCopies(), bookRequestDTO.getMinutes());
        // Loai khac: khong xay ra voi du lieu da kiem o utils
        default:
            throw new Exception(Message.ERROR_ITEM_TYPE);
    }
}</code></pre>
</details>`,
    `<h2>5. Đáp án đầy đủ — và bằng chứng là đúng</h2>
<p>Tệp zip đáp án là trọn dự án: <code>lint.py</code> 0 vi phạm, <code>javac --release 8</code>, chạy trên JDK 8 thật ra y hệt, và bộ chấm 199/199.</p>
<details><summary>Trọn lần chạy — java -cp build main.Main &lt; harness/input.txt (199 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
6 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: Ky so: Ky so phai tu 1 den 999, ban nhap 0. Moi nhap lai.<br>
Ky so: Ky so phai la 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Ky so: Trung Tech Weekly ky 118 voi Tap chi T005 "Tech Weekly". Moi tai lieu chi them 1 lan.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: Ky so: Da them T007 "Tech Weekly". Thu vien co 7 tai lieu.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: So phut: So phut phai tu 1 den 600, ban nhap 0. Moi nhap lai.<br>
So phut: So phut phai tu 1 den 600, ban nhap 700. Moi nhap lai.<br>
So phut: Da them D008 "The Imitation Game". Thu vien co 8 tai lieu.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Phi tre han: 12000 dong.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: T005 "Tech Weekly" (Tap chi): han muon 7 ngay, da giu 10 ngay, tre 3 ngay x 1000 dong/ngay.<br>
Phi tre han: 3000 dong.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: D006 "The Social Network" (DVD): han muon 3 ngay, da giu 3 ngay, tre 0 ngay x 5000 dong/ngay.<br>
Phi tre han: 0 dong.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: So ngay da giu phai tu 0 den 365, ban nhap -1. Moi nhap lai.<br>
So ngay da giu: D008 "The Imitation Game" (DVD): han muon 3 ngay, da giu 5 ngay, tre 2 ngay x 5000 dong/ngay.<br>
Phi tre han: 10000 dong.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): Ma tai lieu phai la B, T hoac D + 3 chu so (vi du B001, T005, D006), ban nhap "x001". Moi nhap lai.<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Khong co tai lieu nao mang ma B009. Hay chon 2 de xem ma roi thu lai.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Tim tai lieu theo ten ---<br>
Tu khoa: No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;D008 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2014 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Imitation Game &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;114 phut<br>
2 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
3 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;T007 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 119<br>
6 &nbsp;&nbsp;D008 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2014 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Imitation Game &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;114 phut<br>
7 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
8 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: --- Thong ke thu vien ---<br>
So tai lieu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 8<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 16<br>
Tai lieu het ban : 0<br>
Cu nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Head First Java (2005)<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 4 chi nam trong bo nho.</div>
</details>
<details><summary>LibraryItem.java — lớp cha với sáu câu trả lời chung chung</summary>
<pre><code class="language-java">package model;

import constants.Constants;
import constants.Message;

/**
 * Lop CHA cua moi tai lieu trong thu vien (Lab 4): sach, tap chi, DVD.
 * Giu phan chung (ma, ten, nam, so ban); moi lop con GHI DE (override) phan rieng:
 * loai, tien to ma, han muon, phi tre/ngay, chi tiet, khoa chong trung.
 * Lab 4 de lop nay la lop thuong nen phai co gia tri mac dinh "chung chung" (0 ngay, 0 dong);
 * Lab 5 se bien no thanh abstract de javac buoc moi lop con tu khai.
 *
 * @author CuongThai Academy
 */
public class LibraryItem {

    // Ma tai lieu do kho cap (B001, T005, D006...)
    private String id;

    // Ten da chuan hoa (Title Case)
    private String title;

    // Nam xuat ban / phat hanh
    private int year;

    // So ban dang co tren ke
    private int copies;

    // Constructor rong (JavaBean): goi constructor day du voi chuoi rong va so 0
    public LibraryItem() {
        this("", "", 0, 0);
    }

    // Constructor day du phan chung; protected: chi lop con goi qua super(...)
    protected LibraryItem(String id, String title, int year, int copies) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.copies = copies;
    }

    // Tra ve ma tai lieu
    public String getId() {
        return id;
    }

    // Gan ma tai lieu
    public void setId(String id) {
        this.id = id;
    }

    // Tra ve ten
    public String getTitle() {
        return title;
    }

    // Gan ten
    public void setTitle(String title) {
        this.title = title;
    }

    // Tra ve nam
    public int getYear() {
        return year;
    }

    // Gan nam
    public void setYear(int year) {
        this.year = year;
    }

    // Tra ve so ban
    public int getCopies() {
        return copies;
    }

    // Gan so ban
    public void setCopies(int copies) {
        this.copies = copies;
    }

    // Ten loai tai lieu; lop con ghi de ("Sach", "Tap chi", "DVD")
    public String getTypeName() {
        return Message.TYPE_ITEM;
    }

    // Chu cai dau cua ma; lop con ghi de (B, T, D)
    public String getIdPrefix() {
        return Constants.ITEM_ID_PREFIX;
    }

    // So ngay duoc muon; tai lieu "chung chung" khong co han that (Lab 5: abstract)
    public int getLoanDays() {
        return Constants.UNKNOWN_LOAN_DAYS;
    }

    // Phi tre moi ngay (dong); tai lieu "chung chung" khong co muc phi that (Lab 5: abstract)
    public int getLateFeePerDay() {
        return Constants.UNKNOWN_LATE_FEE;
    }

    // Thong tin rieng cua tung loai (tac gia, ky so, so phut); mac dinh rong
    public String getDetail() {
        return "";
    }

    // Khoa chong trung (2 tai lieu cung khoa la trung); mac dinh la ma
    public String getUniqueKey() {
        return id;
    }
}</code></pre>
</details>
<details><summary>createItem — switch duy nhất theo loại tài liệu (cho sẵn trong starter)</summary>
<pre class="trich"><code class="language-java">// NOI DUY NHAT biet ten cac lop con: tao doi tuong dung loai tu phieu (ma gan sau)
private LibraryItem createItem(BookRequestDTO bookRequestDTO) throws Exception {
    // Loai trong phieu quyet dinh lop con; bien kieu cha giu duoc ca ba (upcasting)
    switch (bookRequestDTO.getItemType()) {
        // 1: sach can them ISBN + tac gia
        case Constants.TYPE_BOOK:
            return new Book("", bookRequestDTO.getIsbn(), bookRequestDTO.getTitle(),
                    bookRequestDTO.getAuthor(), bookRequestDTO.getYear(),
                    bookRequestDTO.getCopies());
        // 2: tap chi can them ky so
        case Constants.TYPE_MAGAZINE:
            return new Magazine("", bookRequestDTO.getTitle(), bookRequestDTO.getYear(),
                    bookRequestDTO.getCopies(), bookRequestDTO.getIssueNumber());
        // 3: DVD can them so phut
        case Constants.TYPE_DVD:
            return new Dvd("", bookRequestDTO.getTitle(), bookRequestDTO.getYear(),
                    bookRequestDTO.getCopies(), bookRequestDTO.getMinutes());
        // Loai khac: khong xay ra voi du lieu da kiem o utils
        default:
            throw new Exception(Message.ERROR_ITEM_TYPE);
    }
}</code></pre>
</details>`),
    bi(`<h2>6. Traps (with real output)</h2>
<div class="pitfall"><p><strong>Trap 1 — forgetting super(...).</strong> It compiles: javac inserts <code>super()</code>, the parent part stays empty.</p></div>
<pre><code class="language-java">// release: 8
// Lab 4 trap — forgetting super(...) still compiles: javac inserts super() and the parent part stays empty
class LibraryItem {
    private String title;
    private int year;

    public LibraryItem() {                                  // the JavaBean empty constructor
        this("", 0);
    }

    protected LibraryItem(String title, int year) {
        this.title = title;
        this.year = year;
    }

    public String getTitle() { return title; }
    public int getYear() { return year; }
}

class ForgetfulBook extends LibraryItem {
    private String isbn;

    public ForgetfulBook(String title, int year, String isbn) {
        // no super(title, year) here: javac silently calls super()
        this.isbn = isbn;
    }

    public String getIsbn() { return isbn; }
}

class Book extends LibraryItem {
    private String isbn;

    public Book(String title, int year, String isbn) {
        super(title, year);                                 // parent part first
        this.isbn = isbn;
    }

    public String getIsbn() { return isbn; }
}

public class LabBayQuenSuper {
    public static void main(String[] args) {
        ForgetfulBook wrong = new ForgetfulBook("Effective Java", 2018, "9780134685991");
        System.out.println("forgot super : title=\\"" + wrong.getTitle() + "\\" year=" + wrong.getYear() + " isbn=" + wrong.getIsbn());
        Book right = new Book("Effective Java", 2018, "9780134685991");
        System.out.println("with super   : title=\\"" + right.getTitle() + "\\" year=" + right.getYear() + " isbn=" + right.getIsbn());
    }
}</code></pre>
<div class="out">forgot super : title="" year=0 isbn=9780134685991<br>
with super &nbsp;&nbsp;: title="Effective Java" year=2018 isbn=9780134685991</div>
<div class="pitfall"><p><strong>Trap 2 — an override without public, or with a typo.</strong> With <code>@Override</code>, both are real compile errors (the project <code>bay/ghi-de-sai</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/model/Dvd.java:52: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/model/Magazine.java:52: error: getLoanDays() in Magazine cannot override getLoanDays() in LibraryItem<br>
&nbsp;&nbsp;&nbsp;&nbsp;int getLoanDays() {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;attempting to assign weaker access privileges; was public<br>
2 errors</div>
<div class="pitfall"><p><strong>Trap 3 — hiding is not overriding.</strong> A re-declared field and a static method follow the declared type.</p></div>
<pre><code class="language-java">// release: 8
// Lab 4 trap — HIDING is not overriding: a re-declared field and a static method are chosen by the DECLARED type
class LibraryItem {
    protected String typeName = "Tai lieu";                 // a field (fields are never overridden)

    public static String shelf() { return "ke chung"; }     // static: belongs to the class

    public int getLoanDays() { return 0; }                  // instance method: can be overridden
}

class Dvd extends LibraryItem {
    protected String typeName = "DVD";                      // HIDES the parent field: now there are TWO fields

    public static String shelf() { return "ke DVD"; }       // HIDES, does not override

    @Override
    public int getLoanDays() { return 3; }                  // OVERRIDES
}

public class LabBayCheGiau {
    public static void main(String[] args) {
        LibraryItem item = new Dvd();                       // declared LibraryItem, object Dvd
        Dvd dvd = (Dvd) item;
        System.out.println("item.typeName    = " + item.typeName + "   (field: declared type wins)");
        System.out.println("dvd.typeName     = " + dvd.typeName);
        System.out.println("item.shelf()     = " + item.shelf() + "   (static: declared type wins)");
        System.out.println("item.getLoanDays = " + item.getLoanDays() + "          (override: the object wins)");
    }
}</code></pre>
<div class="out">item.typeName &nbsp;&nbsp;&nbsp;= Tai lieu &nbsp;&nbsp;(field: declared type wins)<br>
dvd.typeName &nbsp;&nbsp;&nbsp;&nbsp;= DVD<br>
item.shelf() &nbsp;&nbsp;&nbsp;&nbsp;= ke chung &nbsp;&nbsp;(static: declared type wins)<br>
item.getLoanDays = 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(override: the object wins)</div>
<div class="pitfall"><p><strong>Trap 4 — the fee by an instanceof chain.</strong> A new class costs 0 silently.</p></div>
<pre><code class="language-java">// release: 8
// Lab 4 trap — computing the fee with an instanceof chain: a new kind of item silently costs 0
import java.util.ArrayList;

class LibraryItem {
    public String getTypeName() { return "Tai lieu"; }
    public int getLateFeePerDay() { return 0; }
}
class Book extends LibraryItem {
    @Override public String getTypeName() { return "Sach"; }
    @Override public int getLateFeePerDay() { return 2000; }
}
class Dvd extends LibraryItem {
    @Override public String getTypeName() { return "DVD"; }
    @Override public int getLateFeePerDay() { return 5000; }
}
class AudioBook extends LibraryItem {                       // added next month by a teammate
    @Override public String getTypeName() { return "Sach noi"; }
    @Override public int getLateFeePerDay() { return 3000; }
}

public class LabBayInstanceof {
    // the "if by type" version: every new class must be added here by hand
    static int feeByInstanceof(LibraryItem item, int daysLate) {
        if (item instanceof Book) {
            return daysLate * 2000;
        } else if (item instanceof Dvd) {
            return daysLate * 5000;
        }
        return 0;                                           // AudioBook falls here
    }

    // the polymorphic version: one line, every class answers for itself
    static int feeByPolymorphism(LibraryItem item, int daysLate) {
        return daysLate * item.getLateFeePerDay();
    }

    public static void main(String[] args) {
        ArrayList&lt;LibraryItem&gt; itemList = new ArrayList&lt;LibraryItem&gt;();
        itemList.add(new Book());
        itemList.add(new Dvd());
        itemList.add(new AudioBook());
        for (LibraryItem item : itemList) {
            System.out.println(item.getTypeName() + ", 2 days late: instanceof = " + feeByInstanceof(item, 2)
                    + " | polymorphism = " + feeByPolymorphism(item, 2));
        }
    }
}</code></pre>
<div class="out">Sach, 2 days late: instanceof = 4000 | polymorphism = 4000<br>
DVD, 2 days late: instanceof = 10000 | polymorphism = 10000<br>
Sach noi, 2 days late: instanceof = 0 | polymorphism = 6000</div>
<div class="pitfall"><p><strong>Trap 5 — a wrong downcast.</strong> It compiles; the JVM throws <code>ClassCastException</code> (real JDK 8 message).</p></div>
<pre><code class="language-java">// release: 8
// chay: jdk8
// Lab 4 trap — a downcast is checked at RUN time: casting a Magazine to Book throws ClassCastException (JDK 8 message)
import java.util.ArrayList;

class LibraryItem {
    public String getDetail() { return ""; }
}
class Book extends LibraryItem {
    public String getIsbn() { return "9780134685991"; }
    @Override public String getDetail() { return "ISBN " + getIsbn(); }
}
class Magazine extends LibraryItem {
    @Override public String getDetail() { return "Ky so 118"; }
}

public class LabBayEpKieu {
    public static void main(String[] args) {
        ArrayList&lt;LibraryItem&gt; itemList = new ArrayList&lt;LibraryItem&gt;();
        itemList.add(new Book());
        itemList.add(new Magazine());
        for (LibraryItem item : itemList) {
            try {
                Book book = (Book) item;                    // javac accepts: a LibraryItem MIGHT be a Book
                System.out.println("cast ok   : " + book.getIsbn());
            } catch (ClassCastException e) {
                System.out.println("cast fails: " + e.getMessage());
            }
        }
        for (LibraryItem item : itemList) {
            System.out.println("no cast   : " + item.getDetail());   // what CT Library does
        }
    }
}</code></pre>
<div class="out">cast ok &nbsp;&nbsp;: 9780134685991<br>
cast fails: Magazine cannot be cast to Book<br>
no cast &nbsp;&nbsp;: ISBN 9780134685991<br>
no cast &nbsp;&nbsp;: Ky so 118</div>`,
    `<h2>6. Bẫy (kèm output thật)</h2>
<div class="pitfall"><p><strong>Bẫy 1 — quên super(...).</strong> Vẫn biên dịch: javac chèn <code>super()</code>, phần cha để trống.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 4 — quên super(...) vẫn biên dịch: javac tự chèn super() và phần cha để trống
class LibraryItem {
    private String title;
    private int year;

    public LibraryItem() {                                  // constructor rỗng của JavaBean
        this("", 0);
    }

    protected LibraryItem(String title, int year) {
        this.title = title;
        this.year = year;
    }

    public String getTitle() { return title; }
    public int getYear() { return year; }
}

class ForgetfulBook extends LibraryItem {
    private String isbn;

    public ForgetfulBook(String title, int year, String isbn) {
        // không có super(title, year): javac lặng lẽ gọi super()
        this.isbn = isbn;
    }

    public String getIsbn() { return isbn; }
}

class Book extends LibraryItem {
    private String isbn;

    public Book(String title, int year, String isbn) {
        super(title, year);                                 // phần cha trước
        this.isbn = isbn;
    }

    public String getIsbn() { return isbn; }
}

public class LabBayQuenSuper {
    public static void main(String[] args) {
        ForgetfulBook wrong = new ForgetfulBook("Effective Java", 2018, "9780134685991");
        System.out.println("forgot super : title=\\"" + wrong.getTitle() + "\\" year=" + wrong.getYear() + " isbn=" + wrong.getIsbn());
        Book right = new Book("Effective Java", 2018, "9780134685991");
        System.out.println("with super   : title=\\"" + right.getTitle() + "\\" year=" + right.getYear() + " isbn=" + right.getIsbn());
    }
}</code></pre>
<div class="out">forgot super : title="" year=0 isbn=9780134685991<br>
with super &nbsp;&nbsp;: title="Effective Java" year=2018 isbn=9780134685991</div>
<div class="pitfall"><p><strong>Bẫy 2 — ghi đè thiếu public, hoặc gõ sai tên.</strong> Có <code>@Override</code>, cả hai là lỗi biên dịch thật (dự án <code>bay/ghi-de-sai</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/model/Dvd.java:52: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/model/Magazine.java:52: error: getLoanDays() in Magazine cannot override getLoanDays() in LibraryItem<br>
&nbsp;&nbsp;&nbsp;&nbsp;int getLoanDays() {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;attempting to assign weaker access privileges; was public<br>
2 errors</div>
<div class="pitfall"><p><strong>Bẫy 3 — che giấu không phải ghi đè.</strong> Trường khai lại và phương thức static đi theo kiểu khai báo.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 4 — CHE GIẤU không phải ghi đè: trường khai lại và phương thức static được chọn theo kiểu KHAI BÁO
class LibraryItem {
    protected String typeName = "Tai lieu";                 // một trường (trường không bao giờ được ghi đè)

    public static String shelf() { return "ke chung"; }     // static: thuộc về lớp

    public int getLoanDays() { return 0; }                  // phương thức thể hiện: ghi đè được
}

class Dvd extends LibraryItem {
    protected String typeName = "DVD";                      // CHE trường của cha: giờ có HAI trường

    public static String shelf() { return "ke DVD"; }       // CHE, không ghi đè

    @Override
    public int getLoanDays() { return 3; }                  // GHI ĐÈ
}

public class LabBayCheGiau {
    public static void main(String[] args) {
        LibraryItem item = new Dvd();                       // khai báo LibraryItem, đối tượng Dvd
        Dvd dvd = (Dvd) item;
        System.out.println("item.typeName    = " + item.typeName + "   (field: declared type wins)");
        System.out.println("dvd.typeName     = " + dvd.typeName);
        System.out.println("item.shelf()     = " + item.shelf() + "   (static: declared type wins)");
        System.out.println("item.getLoanDays = " + item.getLoanDays() + "          (override: the object wins)");
    }
}</code></pre>
<div class="out">item.typeName &nbsp;&nbsp;&nbsp;= Tai lieu &nbsp;&nbsp;(field: declared type wins)<br>
dvd.typeName &nbsp;&nbsp;&nbsp;&nbsp;= DVD<br>
item.shelf() &nbsp;&nbsp;&nbsp;&nbsp;= ke chung &nbsp;&nbsp;(static: declared type wins)<br>
item.getLoanDays = 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(override: the object wins)</div>
<div class="pitfall"><p><strong>Bẫy 4 — tính phí bằng chuỗi instanceof.</strong> Lớp mới lặng lẽ bị tính 0 đồng.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 4 — tính phí bằng chuỗi instanceof: thêm loại mới là lặng lẽ ra 0 đồng
import java.util.ArrayList;

class LibraryItem {
    public String getTypeName() { return "Tai lieu"; }
    public int getLateFeePerDay() { return 0; }
}
class Book extends LibraryItem {
    @Override public String getTypeName() { return "Sach"; }
    @Override public int getLateFeePerDay() { return 2000; }
}
class Dvd extends LibraryItem {
    @Override public String getTypeName() { return "DVD"; }
    @Override public int getLateFeePerDay() { return 5000; }
}
class AudioBook extends LibraryItem {                       // tháng sau bạn cùng nhóm thêm vào
    @Override public String getTypeName() { return "Sach noi"; }
    @Override public int getLateFeePerDay() { return 3000; }
}

public class LabBayInstanceof {
    // bản "if theo loại": lớp mới nào cũng phải tự thêm vào đây
    static int feeByInstanceof(LibraryItem item, int daysLate) {
        if (item instanceof Book) {
            return daysLate * 2000;
        } else if (item instanceof Dvd) {
            return daysLate * 5000;
        }
        return 0;                                           // AudioBook rơi vào đây
    }

    // bản đa hình: một dòng, mỗi lớp tự trả lời
    static int feeByPolymorphism(LibraryItem item, int daysLate) {
        return daysLate * item.getLateFeePerDay();
    }

    public static void main(String[] args) {
        ArrayList&lt;LibraryItem&gt; itemList = new ArrayList&lt;LibraryItem&gt;();
        itemList.add(new Book());
        itemList.add(new Dvd());
        itemList.add(new AudioBook());
        for (LibraryItem item : itemList) {
            System.out.println(item.getTypeName() + ", 2 days late: instanceof = " + feeByInstanceof(item, 2)
                    + " | polymorphism = " + feeByPolymorphism(item, 2));
        }
    }
}</code></pre>
<div class="out">Sach, 2 days late: instanceof = 4000 | polymorphism = 4000<br>
DVD, 2 days late: instanceof = 10000 | polymorphism = 10000<br>
Sach noi, 2 days late: instanceof = 0 | polymorphism = 6000</div>
<div class="pitfall"><p><strong>Bẫy 5 — ép kiểu xuống sai.</strong> Biên dịch được; JVM ném <code>ClassCastException</code> (thông báo thật của JDK 8).</p></div>
<pre><code class="language-java">// release: 8
// chay: jdk8
// Bẫy Lab 4 — ép kiểu xuống được kiểm lúc CHẠY: ép Magazine thành Book ném ClassCastException (thông báo của JDK 8)
import java.util.ArrayList;

class LibraryItem {
    public String getDetail() { return ""; }
}
class Book extends LibraryItem {
    public String getIsbn() { return "9780134685991"; }
    @Override public String getDetail() { return "ISBN " + getIsbn(); }
}
class Magazine extends LibraryItem {
    @Override public String getDetail() { return "Ky so 118"; }
}

public class LabBayEpKieu {
    public static void main(String[] args) {
        ArrayList&lt;LibraryItem&gt; itemList = new ArrayList&lt;LibraryItem&gt;();
        itemList.add(new Book());
        itemList.add(new Magazine());
        for (LibraryItem item : itemList) {
            try {
                Book book = (Book) item;                    // javac cho qua: một LibraryItem CÓ THỂ là Book
                System.out.println("cast ok   : " + book.getIsbn());
            } catch (ClassCastException e) {
                System.out.println("cast fails: " + e.getMessage());
            }
        }
        for (LibraryItem item : itemList) {
            System.out.println("no cast   : " + item.getDetail());   // CT Library làm vậy
        }
    }
}</code></pre>
<div class="out">cast ok &nbsp;&nbsp;: 9780134685991<br>
cast fails: Magazine cannot be cast to Book<br>
no cast &nbsp;&nbsp;: ISBN 9780134685991<br>
no cast &nbsp;&nbsp;: Ky so 118</div>`),
    bi(`<h2>7. Rubric (10 points) and self-check</h2>
<table>
<thead><tr><th>Part</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Book constructor with <code>super(...)</code> (4.1)</td><td>1</td><td>grader lines 14–19: titles and years back</td></tr>
<tr><td>Magazine + Dvd: 12 overrides, <code>@Override public</code> (4.2, 4.3)</td><td>3</td><td>grader lines 17, 19, 35, 48, 63 · javac</td></tr>
<tr><td><code>toResponseDTO</code> without if or cast (4.4)</td><td>2</td><td>grader lines 13–19, 147–150, 163–171</td></tr>
<tr><td>Late fee in the service, one formula (4.5)</td><td>2</td><td>grader lines 76–77, 90–91, 104–105, 119–120</td></tr>
<tr><td><code>lint.py</code> ✓ and <code>grep -rn instanceof src/</code> empty</td><td>1</td><td>two commands</td></tr>
<tr><td>Oral: "overloading or overriding?"</td><td>1</td><td>one question</td></tr>
</tbody>
</table>
<details><summary>1. Why does the starter compile without super(...)?</summary><p class="dap-an">✅ When a constructor does not start with <code>super(...)</code> or <code>this(...)</code>, javac inserts <code>super()</code>. <code>LibraryItem</code> has an empty public constructor (JavaBean), so the call is legal — and the parent's fields keep "" and 0.</p></details>
<details><summary>2. LibraryItem item = new Dvd(); — which getLoanDays() runs, and what can javac refuse here?</summary><p class="dap-an">✅ The Dvd override (3 days): the JVM looks at the object. javac only allows methods <code>LibraryItem</code> declares — <code>item.getMinutes()</code> would be "cannot find symbol".</p></details>
<details><summary>3. Where is the only switch on the item type, and why is it allowed there?</summary><p class="dap-an">✅ In <code>BookRepository.createItem</code> (and the input form in <code>Main</code>): to <em>create</em> an object you must name its class. Once created, every use goes through <code>LibraryItem</code> and polymorphism.</p></details>`,
    `<h2>7. Rubric (10 điểm) và tự kiểm</h2>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Kiểm bằng</th></tr></thead>
<tbody>
<tr><td>Constructor Book có <code>super(...)</code> (4.1)</td><td>1</td><td>dòng 14–19 của bộ chấm: tên và năm trở lại</td></tr>
<tr><td>Magazine + Dvd: 12 phương thức ghi đè, <code>@Override public</code> (4.2, 4.3)</td><td>3</td><td>dòng 17, 19, 35, 48, 63 · javac</td></tr>
<tr><td><code>toResponseDTO</code> không if, không ép kiểu (4.4)</td><td>2</td><td>dòng 13–19, 147–150, 163–171</td></tr>
<tr><td>Phí trễ ở service, một công thức (4.5)</td><td>2</td><td>dòng 76–77, 90–91, 104–105, 119–120</td></tr>
<tr><td><code>lint.py</code> ✓ và <code>grep -rn instanceof src/</code> rỗng</td><td>1</td><td>hai lệnh</td></tr>
<tr><td>Vấn đáp: "nạp chồng hay ghi đè?"</td><td>1</td><td>một câu hỏi</td></tr>
</tbody>
</table>
<details><summary>1. Vì sao starter biên dịch được dù thiếu super(...)?</summary><p class="dap-an">✅ Khi constructor không mở đầu bằng <code>super(...)</code> hay <code>this(...)</code>, javac tự chèn <code>super()</code>. <code>LibraryItem</code> có constructor rỗng public (JavaBean), nên lời gọi hợp lệ — và các trường của cha giữ "" và 0.</p></details>
<details><summary>2. LibraryItem item = new Dvd(); — getLoanDays() nào chạy, và javac có thể từ chối gì ở đây?</summary><p class="dap-an">✅ Bản ghi đè của Dvd (3 ngày): JVM nhìn đối tượng. javac chỉ cho gọi phương thức mà <code>LibraryItem</code> có khai — <code>item.getMinutes()</code> sẽ báo "cannot find symbol".</p></details>
<details><summary>3. Switch duy nhất theo loại tài liệu nằm ở đâu, và vì sao được phép ở đó?</summary><p class="dap-an">✅ Ở <code>BookRepository.createItem</code> (và form nhập trong <code>Main</code>): muốn <em>tạo</em> đối tượng thì phải gọi tên lớp. Tạo xong, mọi chỗ dùng đều đi qua <code>LibraryItem</code> và đa hình.</p></details>`),
    bi(`<h2>8. Extra challenges and what comes next</h2>
<ul>
<li>⭐ Add <code>AudioBook</code> (loan 10 days, 3,000 đ, detail "n phut, narrator"): count the files you touch. The goal is: one new class, one new case in <code>createItem</code>, a few constants, one menu line.</li>
<li>⭐ <strong>Overloading</strong> (4.B): give <code>BookService</code> a second <code>calculateLateFee</code> that takes only a <code>BookResponseDTO</code> and uses today's 0 days kept — which one does javac pick for <code>calculateLateFee(item, 5)</code>?</li>
<li>⭐⭐ Use <code>super.getDetail()</code>: let <code>LibraryItem.getDetail()</code> return the year, and have each child append its own part to it.</li>
<li>⭐⭐ The class names <code>BookRepository</code>, <code>BookController</code>… now hold magazines and DVDs too. Would you rename them to <code>Item…</code>? List the pros and cons (CT Library keeps "Book" = the library's catalogue, to match Lab 5's interface).</li>
</ul>
<div class="callout"><p><strong>Next — Lab 5 (after Chapter 5):</strong> <code>LibraryItem</code> becomes <code>abstract</code> (no more "0 days"), the repository is split into the interface <code>BookRepository</code> and its first implementation <code>InMemoryBookRepository</code> — the seam Lab 9 plugs a file into — and late fees depend on who borrows, through a <code>FeePolicy</code> interface.</p></div>`,
    `<h2>8. Thử thách thêm và việc tiếp theo</h2>
<ul>
<li>⭐ Thêm <code>AudioBook</code> (sách nói: mượn 10 ngày, 3.000 đ, chi tiết "n phut, người đọc"): đếm số tệp bạn phải chạm. Mục tiêu: một lớp mới, một case mới trong <code>createItem</code>, vài hằng, một dòng menu.</li>
<li>⭐ <strong>Nạp chồng</strong> (4.B): cho <code>BookService</code> thêm một <code>calculateLateFee</code> chỉ nhận <code>BookResponseDTO</code> và coi số ngày giữ là 0 — javac chọn bản nào cho <code>calculateLateFee(item, 5)</code>?</li>
<li>⭐⭐ Dùng <code>super.getDetail()</code>: cho <code>LibraryItem.getDetail()</code> trả về năm, và mỗi lớp con nối phần riêng của nó vào sau.</li>
<li>⭐⭐ Các lớp <code>BookRepository</code>, <code>BookController</code>… giờ giữ cả tạp chí và DVD. Bạn có đổi tên thành <code>Item…</code> không? Liệt kê lợi và hại (CT Library giữ "Book" = danh mục sách của thư viện, để khớp interface ở Lab 5).</li>
</ul>
<div class="callout"><p><strong>Tiếp theo — Lab 5 (sau Chương 5):</strong> <code>LibraryItem</code> thành <code>abstract</code> (hết "0 ngày"), repository tách thành interface <code>BookRepository</code> và bản cài đầu tiên <code>InMemoryBookRepository</code> — đường nối mà Lab 9 cắm kho tệp vào — và phí trễ phụ thuộc người mượn, qua interface <code>FeePolicy</code>.</p></div>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch4) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `class A {
    public static void show() { System.out.println("A::show"); }
}
class B extends A {
    public static void show() { System.out.println("B::show"); }
}
public class Q1 {
    public static void main(String[] args) {
        A a = new B();
        a.show();
    }
}`,
      codeLang: 'java',
      options: ['B::show|||B::show', 'A::show|||A::show', 'A::show then B::show|||A::show rồi B::show', 'Compile error: a static method cannot be redefined|||Lỗi biên dịch: không định nghĩa lại được phương thức static'],
      correctIndex: 1,
      points: 1,
      explanation: 'Both show() methods are static, so B.show() HIDES A.show() instead of overriding it. A static call is chosen at compile time from the declared type of a — A — so A.show() runs even though the object is a B. Redefining a static method is legal (D is wrong); only one method runs (C). Remove both "static" words and the answer becomes B::show.|||Cả hai show() đều static, nên B.show() CHE GIẤU A.show() chứ không ghi đè nó. Lời gọi static được chọn lúc biên dịch theo kiểu khai báo của a — là A — nên A.show() chạy dù đối tượng là B. Định nghĩa lại phương thức static là hợp lệ (D sai); chỉ một phương thức chạy (C sai). Bỏ cả hai chữ "static" thì đáp án thành B::show.' },
    { id: 'q2',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `class A { A() { System.out.print("A,"); } }
class B extends A { B() { System.out.print("B,"); } }
class C extends B { C() { System.out.println("C"); } }
public class Q2 {
    public static void main(String[] args) {
        new C();
    }
}`,
      codeLang: 'java',
      options: ['C,B,A|||C,B,A', 'C|||C', 'B,A,C|||B,A,C', 'A,B,C|||A,B,C'],
      correctIndex: 3,
      points: 1,
      explanation: 'Every constructor starts with an implicit super(), so new C() first runs B(), which first runs A(): the bodies print top-down, A then B then C. Constructors are never skipped (B is wrong) and the order is never bottom-up (A, C).|||Constructor nào cũng bắt đầu bằng một super() ngầm, nên new C() chạy B() trước, B() lại chạy A() trước: các thân in từ trên xuống, A rồi B rồi C. Constructor không bao giờ bị bỏ qua (B sai) và thứ tự không bao giờ từ dưới lên (A, C sai).' },
    { id: 'q3',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `class A {
    int i = 100;
    public void printValue() { System.out.print("A"); }
}
class B extends A {
    int i = 120;
    public void printValue() { System.out.print("B"); }
}
public class Q3 {
    public static void main(String[] args) {
        A a = new B();
        a.printValue();
        System.out.println(a.i);
    }
}`,
      codeLang: 'java',
      options: ['B100|||B100', 'B120|||B120', 'A100|||A100', 'A120|||A120'],
      correctIndex: 0,
      points: 1,
      explanation: 'printValue() is an instance method overridden in B, so the object decides: "B". But fields are not polymorphic: B declares a SECOND field named i, and a.i is resolved from the declared type A, giving 100. Methods follow the object, fields follow the variable.|||printValue() là phương thức thể hiện bị ghi đè trong B, nên đối tượng quyết định: "B". Nhưng trường thì không đa hình: B khai báo một trường i THỨ HAI, và a.i được xác định theo kiểu khai báo A, ra 100. Phương thức đi theo đối tượng, trường đi theo biến.' },
    { id: 'q4',
      question: 'Which statement about super(...) in a constructor is TRUE?|||Câu nào về super(...) trong constructor là ĐÚNG?',
      options: ['It may be placed anywhere in the constructor body.|||Nó có thể đặt ở bất kỳ đâu trong thân constructor.', 'If it is not written, the compiler inserts super(); this fails when the superclass has no no-argument constructor.|||Nếu không viết, trình biên dịch chèn super(); việc đó hỏng khi lớp cha không có constructor không tham số.', "It is optional because a subclass inherits the superclass's constructors.|||Nó là tuỳ chọn vì lớp con kế thừa các constructor của lớp cha.", "It can be called from any method of the subclass to reset the parent's fields.|||Nó có thể gọi từ bất kỳ phương thức nào của lớp con để đặt lại các trường của cha."],
      correctIndex: 1,
      points: 1,
      explanation: 'Constructors are NOT inherited (C is wrong), so every subclass constructor must call one parent constructor — explicitly with super(...) as the FIRST statement (A is wrong: "call to super must be first statement in constructor"), or implicitly with an inserted super(). super(...) is only legal as the first line of a constructor (D).|||Constructor KHÔNG được kế thừa (C sai), nên mọi constructor lớp con phải gọi một constructor của cha — tường minh bằng super(...) ở câu lệnh ĐẦU TIÊN (A sai: "call to super must be first statement in constructor"), hoặc ngầm bằng super() được chèn vào. super(...) chỉ hợp lệ ở dòng đầu của constructor (D sai).' },
    { id: 'q5',
      question: '(FE question type) class A { void dojob1() { } } and class B extends A { void dojob2() { } }. Given A a2 = new B(); which statement calls dojob2() and compiles?|||(Dạng câu FE) class A { void dojob1() { } } và class B extends A { void dojob2() { } }. Cho A a2 = new B(); câu lệnh nào gọi dojob2() và biên dịch được?',
      options: ['a2.dojob2();|||a2.dojob2();', '(B)a2.dojob2();|||(B)a2.dojob2();', '((B)a2).dojob2();|||((B)a2).dojob2();', 'None of them compiles|||Không câu nào biên dịch được'],
      correctIndex: 2,
      points: 1,
      explanation: 'The compiler only knows the static type A, which has no dojob2(), so A fails with "cannot find symbol". In B the method call binds tighter than the cast — it means (B)(a2.dojob2()) — and JDK 8 rejects it ("not a statement": a cast alone is not a statement; inside an expression it is again "cannot find symbol"). Only C casts a2 first and then calls the method on the B.|||Trình biên dịch chỉ biết kiểu tĩnh A, mà A không có dojob2(), nên A hỏng với "cannot find symbol". Ở B lời gọi phương thức gắn chặt hơn phép ép — nghĩa là (B)(a2.dojob2()) — và JDK 8 từ chối ("not a statement": một phép ép đứng riêng không phải câu lệnh; đặt trong biểu thức thì lại là "cannot find symbol"). Chỉ C ép a2 trước rồi mới gọi phương thức trên đối tượng B.' },
    { id: 'q6',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `public class Q6 {
    static void show(Object o) { System.out.println("Object"); }
    static void show(String s) { System.out.println("String"); }
    public static void main(String[] args) {
        Object o = "hi";
        show(o);
    }
}`,
      codeLang: 'java',
      options: ['Object|||Object', 'String|||String', 'Compile error: the call is ambiguous|||Lỗi biên dịch: lời gọi mơ hồ', 'ClassCastException at run time|||ClassCastException lúc chạy'],
      correctIndex: 0,
      points: 1,
      explanation: 'Overloads are chosen by the COMPILER from the static type of the argument. o is declared Object, so show(Object) is the only match — the String inside is not looked at. That is the difference from overriding, where the object decides at run time. There is exactly one applicable method, so nothing is ambiguous.|||Bản nạp chồng do TRÌNH BIÊN DỊCH chọn theo kiểu tĩnh của đối số. o khai báo là Object, nên show(Object) là bản khớp duy nhất — String bên trong không được nhìn tới. Đó là chỗ khác với ghi đè, nơi đối tượng quyết định lúc chạy. Chỉ có đúng một phương thức áp dụng được nên không có gì mơ hồ.' },
    { id: 'q7',
      question: '(FE question type) Mammal extends Animal; Dog and Cat extend Mammal. What happens?|||(Dạng câu FE) Mammal extends Animal; Dog và Cat extends Mammal. Điều gì xảy ra?',
      code: `Dog fido;
Animal anim;
anim = new Cat();
fido = (Dog) anim;`,
      codeLang: 'java',
      options: ['Line 3 does not compile: a Cat cannot be stored in an Animal variable|||Dòng 3 không biên dịch: không cất được Cat vào biến Animal', 'Line 4 does not compile: an explicit cast is not allowed|||Dòng 4 không biên dịch: không được ép kiểu tường minh', 'It compiles and runs; fido refers to a Mammal|||Biên dịch và chạy được; fido trỏ tới một Mammal', 'It compiles, then throws ClassCastException at line 4|||Biên dịch được, rồi ném ClassCastException ở dòng 4'],
      correctIndex: 3,
      points: 1,
      explanation: 'Line 3 is an upcast (a Cat is an Animal), always legal. Line 4 is a downcast from Animal to Dog — legal at compile time because an Animal MIGHT be a Dog — so the check moves to run time, where the object turns out to be a Cat: ClassCastException (the real run printed it). Check with instanceof before casting.|||Dòng 3 là ép lên (Cat là một Animal), luôn hợp lệ. Dòng 4 là ép xuống từ Animal sang Dog — hợp lệ lúc biên dịch vì một Animal CÓ THỂ là Dog — nên phép kiểm dời sang lúc chạy, khi đó đối tượng hoá ra là Cat: ClassCastException (lần chạy thật đã in ra). Kiểm bằng instanceof trước khi ép.' },
    { id: 'q8',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `class Parent {
    private void greet() { System.out.println("Parent"); }
    void call() { greet(); }
}
class Child extends Parent {
    void greet() { System.out.println("Child"); }
}
public class Q8 {
    public static void main(String[] args) {
        new Child().call();
    }
}`,
      codeLang: 'java',
      options: ['Child|||Child', 'ParentChild|||ParentChild', 'Parent|||Parent', 'Compile error: greet() in Child cannot override a private method|||Lỗi biên dịch: greet() trong Child không ghi đè được phương thức private'],
      correctIndex: 2,
      points: 1,
      explanation: "A private method is not inherited, so Child.greet() does not override anything — it is a new, unrelated method (and it compiles, so D is wrong). Inside Parent.call(), the call greet() can only mean Parent's private greet(), bound at compile time. The FE asks this as \"can a subclass override a private method?\" — no.|||Phương thức private không được kế thừa, nên Child.greet() không ghi đè gì cả — nó là một phương thức mới, không liên quan (và vẫn biên dịch được, nên D sai). Bên trong Parent.call(), lời gọi greet() chỉ có thể là greet() private của Parent, gắn lúc biên dịch. Đề FE hỏi điều này dưới dạng \"lớp con có ghi đè được phương thức private không?\" — không." },
    { id: 'q9',
      question: 'The superclass declares public void report() { }. Which declaration in a subclass compiles as an override?|||Lớp cha khai báo public void report() { }. Khai báo nào trong lớp con biên dịch được như một bản ghi đè?',
      options: ['public void report() { }|||public void report() { }', 'protected void report() { }|||protected void report() { }', 'void report() { }|||void report() { }', 'public int report() { return 0; }|||public int report() { return 0; }'],
      correctIndex: 0,
      points: 1,
      explanation: 'An override must keep the signature, use a compatible return type and must not be MORE restrictive. B (protected) and C (package access) narrow public access: "attempting to assign weaker access privileges; was public". D changes the return type from void to int: "return type int is not compatible with void". Only A is legal.|||Bản ghi đè phải giữ chữ ký, dùng kiểu trả về tương thích và không được HẸP quyền hơn. B (protected) và C (quyền package) thu hẹp quyền public: "attempting to assign weaker access privileges; was public". D đổi kiểu trả về từ void sang int: "return type int is not compatible with void". Chỉ A hợp lệ.' },
    { id: 'q10',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `class Base {
    Base() { show(); }
    void show() { System.out.println("Base"); }
}
class Derived extends Base {
    int x = 5;
    void show() { System.out.println(x); }
}
public class Q10 {
    public static void main(String[] args) {
        new Derived();
    }
}`,
      codeLang: 'java',
      options: ['5|||5', '0|||0', 'Base|||Base', 'Nothing: show() is not called|||Không in gì: show() không được gọi'],
      correctIndex: 1,
      points: 1,
      explanation: "new Derived() runs Base() first, and Base() calls show(). show() is overridden, so Derived.show() runs — but Derived's field initialiser x = 5 runs only AFTER super() returns, so x still holds its default 0. Lesson: never call an overridable method from a constructor.|||new Derived() chạy Base() trước, và Base() gọi show(). show() bị ghi đè nên Derived.show() chạy — nhưng câu khởi tạo trường x = 5 của Derived chỉ chạy SAU KHI super() trả về, nên x vẫn mang giá trị mặc định 0. Bài học: đừng bao giờ gọi phương thức ghi đè được từ trong constructor." },
  ],
};

export default {
  slides: [L_pro9_1, L_pro10_1],
  practice: L_on_ch4,
  labs: [L_lab4],
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 4 viết lại theo dạng câu FE PRO192, mỗi câu có giải thích song ngữ và câu "in ra gì" đều đã chạy thật trên JDK 8: phương thức static bị che giấu, thứ tự constructor, trường không đa hình, luật super(...), vị trí dấu ngoặc khi ép kiểu, nạp chồng chọn theo kiểu tĩnh, ép xuống sai gây ClassCastException, phương thức private không ghi đè được, luật quyền truy cập khi ghi đè, và gọi phương thức ghi đè trong constructor của lớp cha.',
};
