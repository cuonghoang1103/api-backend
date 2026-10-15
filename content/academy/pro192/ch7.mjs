/**
 * PRO192 · Chương 7 — mảng đối tượng (pro12).
 * Bài 📑 học theo từng slide: pro12 (tmp_12.pptx, slide 1–16).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch7.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch7).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 7.A — 📑 Slide by slide · Array of Objects: the antique-shop case study, add/find/update/remove/sort (slides 1–16) ───────── */
const L_pro12_1 = {
  title: '7.A — 📑 Slide by slide · Array of Objects: the antique-shop case study, add/find/update/remove/sort (slides 1–16)|||7.A — 📑 Học theo từng slide · Array of Objects: case study cửa hàng đồ cổ, thêm/tìm/sửa/xoá/sắp xếp (slide 1–16)',
  slug: 'pro192-slide-pro12-1',
  type: 'VIDEO',
  description: 'Giảng đủ 16 slide bộ "ArrayOfObjects" của trường — case study cửa hàng đồ cổ (Item, Vase, Statue, Painting, ItemList): mảng tham chiếu kiểu lớp cha chứa đối tượng lớp con, sơ đồ lớp vẽ lại cho đúng, input() có kiểm tra dữ liệu bằng một Scanner chung, rồi từng thao tác addItem, displayAll, findItem, findItemIndex, updateItem, removeItem, displayItemsByType, sortItems và menu chính — mọi đoạn code của slide đều được biên dịch và chạy thật trên JDK 8: năm chỗ không biên dịch được, xoá phần tử làm sập khi mảng đầy, lọc theo loại in nhầm, sắp xếp nổi bọt không sắp được, bẫy nextInt/nextLine — mỗi chỗ có bản sửa chạy thật, kèm Comparable, Comparator, lambda Java 8 và chương trình hoàn chỉnh chạy với dữ liệu nhập có lỗi.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.A · school deck "ArrayOfObjects", slides 1–16</span>
<h2>From one object to a program that manages many: the antique shop</h2>
<p class="lead">Chapters 2–5 built single classes and hierarchies; Chapter 6 made input safe. This deck puts them together into the shape of almost every PRO192 assignment, PE question 3 and LAB211 program: <strong>one class for the thing</strong> (Item and its subclasses), <strong>one class for the list of things</strong> (ItemList, with an array inside), and <strong>a menu</strong> that calls add, display, find, update, remove, sort. In the syllabus this is Chapter 6, four sessions (35–38), CLO8 "implement a complete program using object array".</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>the problem and its class diagram</td><td>draw the classes of a "manage a list of X" program, with the right arrows</td></tr>
<tr><td>5–8</td><td>Item and its three subclasses, input() and toString()</td><td>write input() that validates every field without crashing</td></tr>
<tr><td>9–14</td><td>ItemList: add, display, find, update, remove, filter by type, sort</td><td>implement each operation on a partly filled array, with its edge cases</td></tr>
<tr><td>15–16</td><td>the menu in main</td><td>write a menu loop that a grader's piped input cannot break</td></tr>
</tbody>
</table>
<div class="callout"><strong>Read this deck with a compiler open.</strong> The slides are templates ("you add more your code") written for reading, not running: five snippets do not compile, three run but give wrong results. Each one was typed exactly as shown, compiled and run on JDK 8, and is followed here by a corrected version that really runs. The complete corrected program is run at slide 16.</div>`,
    `<span class="eyebrow">Chương 7 · Bài 7.A · bộ slide "ArrayOfObjects" của trường, slide 1–16</span>
<h2>Từ một đối tượng tới một chương trình quản lý nhiều đối tượng: cửa hàng đồ cổ</h2>
<p class="lead">Chương 2–5 dựng từng lớp và cây kế thừa; Chương 6 làm cho việc nhập liệu an toàn. Bộ slide này ghép chúng lại thành hình dạng của gần như mọi bài assignment PRO192, câu 3 đề PE và chương trình LAB211: <strong>một lớp cho món đồ</strong> (Item và các lớp con), <strong>một lớp cho danh sách món đồ</strong> (ItemList, bên trong có một mảng), và <strong>một menu</strong> gọi thêm, hiển thị, tìm, sửa, xoá, sắp xếp. Trong đề cương đây là Chapter 6, bốn buổi (35–38), CLO8 "cài đặt một chương trình hoàn chỉnh dùng mảng đối tượng".</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>đề bài và sơ đồ lớp</td><td>vẽ các lớp của một chương trình "quản lý danh sách X", đúng các mũi tên</td></tr>
<tr><td>5–8</td><td>Item và ba lớp con, input() và toString()</td><td>viết input() kiểm tra mọi trường mà không bị sập</td></tr>
<tr><td>9–14</td><td>ItemList: thêm, hiển thị, tìm, sửa, xoá, lọc theo loại, sắp xếp</td><td>cài đặt từng thao tác trên một mảng dùng một phần, kèm các trường hợp biên</td></tr>
<tr><td>15–16</td><td>menu trong main</td><td>viết vòng lặp menu mà dữ liệu nạp qua pipe của máy chấm không phá được</td></tr>
</tbody>
</table>
<div class="callout"><strong>Đọc bộ slide này với trình biên dịch mở sẵn.</strong> Các slide là khung mẫu ("you add more your code") viết để đọc, không phải để chạy: năm đoạn không biên dịch được, ba đoạn chạy được nhưng cho kết quả sai. Từng đoạn đã được gõ đúng như slide, biên dịch và chạy trên JDK 8, và ngay sau đó là bản đã sửa chạy được thật. Chương trình hoàn chỉnh đã sửa được chạy ở slide 16.</div>`),
    walkHead('pro12', 1, 16),
    walk('pro12', [
      [1, 'Array of Objects',
        `<p class="y-chinh">🎯 Title slide: <strong>Array of Objects</strong> — an array whose elements are objects (strictly: references to objects) instead of numbers.</p>
<p>The FU material defines the idea in one sentence worth reading twice: objects of <em>different dynamic types</em> in the same hierarchy can be handled through <strong>an array of their static type</strong>. In code: <code>Item[] list</code> is declared with the parent type (static type <code>Item</code>), and each slot may point to a <code>Vase</code>, a <code>Statue</code> or a <code>Painting</code> (dynamic types). When the program calls <code>list[i].toString()</code> or <code>list[i].input()</code>, the JVM picks the version of the real object — dynamic binding, lesson 4.B.</p>
<p>So this chapter is where Chapters 2–5 pay off: encapsulation decides what each class exposes, inheritance removes the repeated fields, polymorphism lets one loop treat three kinds of objects alike.</p>
<p class="meo">🧠 An array of objects is a row of numbered lockers holding only <strong>address cards</strong>, never the furniture itself. Several lockers — or a locker and a variable — can hold cards with the same address.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: <strong>Array of Objects (mảng đối tượng)</strong> — một mảng mà phần tử là đối tượng (chính xác: tham chiếu tới đối tượng) thay vì là số.</p>
<p>Học liệu FU định nghĩa ý này bằng một câu đáng đọc hai lần: các đối tượng có <em>kiểu động khác nhau</em> trong cùng một cây kế thừa có thể được xử lý qua <strong>một mảng mang kiểu tĩnh của chúng</strong>. Trong code: <code>Item[] list</code> được khai báo bằng kiểu cha (kiểu tĩnh <code>Item</code>), và mỗi ô có thể trỏ tới một <code>Vase</code>, một <code>Statue</code> hay một <code>Painting</code> (kiểu động). Khi chương trình gọi <code>list[i].toString()</code> hay <code>list[i].input()</code>, JVM chọn phiên bản của đối tượng thật — ràng buộc động, bài 4.B.</p>
<p>Nên đây là chương mà Chương 2–5 sinh lời: đóng gói quyết định mỗi lớp lộ ra gì, kế thừa xoá các trường bị lặp, đa hình cho một vòng lặp đối xử với ba loại đối tượng như nhau.</p>
<p class="meo">🧠 Một mảng đối tượng là một dãy tủ đánh số chỉ chứa <strong>thẻ ghi địa chỉ</strong>, không bao giờ chứa chính món đồ. Nhiều tủ — hoặc một tủ và một biến — có thể giữ thẻ cùng một địa chỉ.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 The basic operations supported by an array: <strong>print</strong> all the elements (objects); <strong>add</strong> an object at the given index; <strong>delete</strong> an object at the given index; <strong>search</strong> an object by index or by value; <strong>update</strong> an object at the given index.</p>
<table>
<thead><tr><th>Operation on the slide</th><th>Method in the case study</th><th>Slide</th><th>Note</th></tr></thead>
<tbody>
<tr><td>print all</td><td>displayAll()</td><td>10</td><td>uses each object's toString()</td></tr>
<tr><td>add at the given index</td><td>addItem(item)</td><td>9</td><td>only adds at the END — "at the given index" is never written (practice 7.2 does it)</td></tr>
<tr><td>delete at the given index</td><td>removeItem(index)</td><td>12</td><td>shift left; crashes when the array is full</td></tr>
<tr><td>search by value</td><td>findItem(creator), findItemIndex(creator)</td><td>10–11</td><td>linear search, first match</td></tr>
<tr><td>search by index</td><td>—</td><td>—</td><td>simply list[index], after checking 0 &lt;= index &lt; numOfItem</td></tr>
<tr><td>update at the given index</td><td>updateItem(index)</td><td>11</td><td>calls input() again on that object</td></tr>
<tr><td>➕ filter, sort</td><td>displayItemsByType(type), sortItems()</td><td>13–14</td><td>not in the objectives, but in the deck and in every PE</td></tr>
</tbody>
</table>
<p>The vocabulary is the one of every data-structure course: these five operations are exactly what CSD201 later implements for linked lists, stacks and trees. Here the storage is the simplest one, a fixed-size array plus a counter.</p>`,
        `<p class="y-chinh">🎯 Các thao tác cơ bản trên một mảng: <strong>in</strong> mọi phần tử (đối tượng); <strong>thêm</strong> một đối tượng tại chỉ số cho trước; <strong>xoá</strong> một đối tượng tại chỉ số cho trước; <strong>tìm</strong> một đối tượng theo chỉ số hoặc theo giá trị; <strong>cập nhật</strong> một đối tượng tại chỉ số cho trước.</p>
<table>
<thead><tr><th>Thao tác trên slide</th><th>Phương thức trong case study</th><th>Slide</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>in tất cả</td><td>displayAll()</td><td>10</td><td>dùng toString() của từng đối tượng</td></tr>
<tr><td>thêm tại chỉ số cho trước</td><td>addItem(item)</td><td>9</td><td>chỉ thêm vào CUỐI — "tại chỉ số cho trước" không hề được viết (bài thực hành 7.2 làm việc đó)</td></tr>
<tr><td>xoá tại chỉ số cho trước</td><td>removeItem(index)</td><td>12</td><td>dời sang trái; sập khi mảng đầy</td></tr>
<tr><td>tìm theo giá trị</td><td>findItem(creator), findItemIndex(creator)</td><td>10–11</td><td>tìm tuần tự, lấy kết quả khớp đầu tiên</td></tr>
<tr><td>tìm theo chỉ số</td><td>—</td><td>—</td><td>đơn giản là list[index], sau khi kiểm 0 &lt;= index &lt; numOfItem</td></tr>
<tr><td>cập nhật tại chỉ số cho trước</td><td>updateItem(index)</td><td>11</td><td>gọi lại input() trên đối tượng đó</td></tr>
<tr><td>➕ lọc, sắp xếp</td><td>displayItemsByType(type), sortItems()</td><td>13–14</td><td>không có trong mục tiêu, nhưng có trong slide và trong mọi đề PE</td></tr>
</tbody>
</table>
<p>Bộ từ vựng này là của mọi môn cấu trúc dữ liệu: năm thao tác này đúng là những gì CSD201 về sau cài đặt cho danh sách liên kết, ngăn xếp và cây. Ở đây cách lưu là đơn giản nhất, một mảng kích thước cố định cộng một biến đếm.</p>`],
      [3, 'Case study',
        `<p class="y-chinh">🎯 Problem: an antique shop sells antique items, namely <strong>vases, statues and paintings</strong>. The owner can add items to the inventory; the shop keeps them in a list; the owner can add a new item, search an item, and so on. For now, the list of vases, statues and paintings is managed <strong>in an array</strong>.</p>
<p>This is the same shop as lesson 4.A (deck "Inheritance", slide 7), where the three classes were factored into <code>Item</code>. The deck now adds the missing half: a class that <em>holds many items</em>. Read the problem statement the way a PE paper is read — nouns become classes or fields, verbs become methods:</p>
<table>
<thead><tr><th>Words in the problem</th><th>Becomes</th></tr></thead>
<tbody>
<tr><td>antique item; vase, statue, painting</td><td>class Item; subclasses Vase, Statue, Painting</td></tr>
<tr><td>inventory, list</td><td>class ItemList with an Item[] field</td></tr>
<tr><td>add a new item</td><td>ItemList.addItem(Item)</td></tr>
<tr><td>search the item</td><td>ItemList.findItem(...)</td></tr>
<tr><td>"…." (the slide stops)</td><td>display, update, remove, filter, sort — slides 10–14</td></tr>
</tbody>
</table>
<p>"For now … in an array": an array has a fixed size decided when it is created, so the class must remember how many slots are really used. Chapter 8 replaces it with <code>ArrayList</code>, which grows by itself — and the methods of ItemList stay almost the same.</p>`,
        `<p class="y-chinh">🎯 Đề bài: một cửa hàng đồ cổ bán các món đồ cổ, gồm <strong>bình (vase), tượng (statue) và tranh (painting)</strong>. Chủ cửa hàng có thể thêm món đồ vào kho; cửa hàng giữ chúng trong một danh sách; chủ có thể thêm món mới, tìm một món, v.v. Tạm thời, danh sách bình, tượng, tranh được quản lý <strong>bằng một mảng</strong>.</p>
<p>Đây là đúng cửa hàng ở bài 4.A (bộ "Inheritance", slide 7), nơi ba lớp đã được rút gọn thành <code>Item</code>. Giờ bộ slide thêm nửa còn thiếu: một lớp <em>chứa nhiều món đồ</em>. Đọc đề bài như đọc đề PE — danh từ thành lớp hoặc trường, động từ thành phương thức:</p>
<table>
<thead><tr><th>Chữ trong đề</th><th>Trở thành</th></tr></thead>
<tbody>
<tr><td>món đồ cổ; bình, tượng, tranh</td><td>lớp Item; các lớp con Vase, Statue, Painting</td></tr>
<tr><td>kho, danh sách</td><td>lớp ItemList có một trường Item[]</td></tr>
<tr><td>thêm món mới</td><td>ItemList.addItem(Item)</td></tr>
<tr><td>tìm món đồ</td><td>ItemList.findItem(...)</td></tr>
<tr><td>"…." (slide bỏ lửng)</td><td>hiển thị, sửa, xoá, lọc, sắp xếp — slide 10–14</td></tr>
</tbody>
</table>
<p>"Tạm thời … bằng một mảng": mảng có kích thước cố định quyết định lúc tạo, nên lớp phải nhớ có bao nhiêu ô thật sự đang dùng. Chương 8 thay nó bằng <code>ArrayList</code>, thứ tự lớn lên — và các phương thức của ItemList gần như giữ nguyên.</p>`],
      [4, 'Case study',
        `<p class="y-chinh">🎯 The class diagram: <code>Item</code> (#value, #creator, constructors, getters/setters, input(), toString()); <code>Vase</code>, <code>Statue</code>, <code>Painting</code> extend it; <code>ItemList</code> (-list[]:Item, -numOfItem, -MAX = 100) with addItem, displayAll, findItem, findItemIndex, updateItem, removeItem, displayItemsByType, sortItems.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f9e99708830c35706070b79fa1ca0e5765ba9abc.svg" alt="Slide 4 redrawn: same classes, three mistakes of the picture corrected" loading="lazy" /><p class="chu-thich">🧩 Slide 4 redrawn: same classes, three mistakes of the picture corrected</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 4 redrawn and corrected — the antique shop
' Corrections: Vase's constructors are Vase(...), Painting.width is int, and ItemList holds Items (one aggregation), not three arrows to the subclasses
class Item {
  # value : int
  # creator : String
  + Item()
  + Item(value : int, creator : String)
  + getValue() : int
  + setValue(value : int) : void
  + getCreator() : String
  + setCreator(creator : String) : void
  + input() : void
  + toString() : String
}
class Vase {
  - height : int
  - material : String
  + Vase()
  + Vase(value : int, creator : String, height : int, material : String)
  + input() : void
  + toString() : String
}
class Statue {
  - weight : int
  - colour : String
  + Statue()
  + Statue(value : int, creator : String, weight : int, colour : String)
  + input() : void
  + toString() : String
}
class Painting {
  - height : int
  - width : int
  - isWatercolour : boolean
  - isFramed : boolean
  + Painting()
  + Painting(value : int, creator : String, height : int, width : int, isWatercolour : boolean, isFramed : boolean)
  + input() : void
  + toString() : String
}
class ItemList {
  - list : Item[]
  - numOfItem : int
  - MAX : int = 100 {readOnly}
  + ItemList()
  + addItem(item : Item) : boolean
  + displayAll() : void
  + findItem(creator : String) : Item
  + findItemIndex(creator : String) : int
  + updateItem(index : int) : boolean
  + removeItem(index : int) : boolean
  + displayItemsByType(type : String) : void
  + sortItems() : void
}
class AntiqueShop {
  + {static} main(args : String[]) : void
}
Item &lt;|-- Vase
Item &lt;|-- Statue
Item &lt;|-- Painting
ItemList o--&gt; "0..100" Item : list
AntiqueShop ..&gt; ItemList : uses
@enduml</code></pre></details>
<p>Three mistakes in the slide's picture, all corrected above. <strong>Vase</strong> lists <code>+Item()</code> and <code>+Item(int,String)</code> — a copy-paste: Vase's constructors are <code>Vase()</code> and <code>Vase(int, String, int, String)</code>. <strong>Painting</strong> has <code>-width:String</code> and a constructor <code>(int,String,int,String,boolean,boolean)</code>, while slide 8's code declares <code>int width</code>. And <strong>ItemList</strong> has three arrows to Vase, Statue and Painting: in the code it holds an array of <code>Item</code> and never names a subclass — one aggregation <code>ItemList o--&gt; Item</code> with multiplicity 0..100 says exactly that. That single arrow is the whole point of the deck: ItemList does not care which kind of item it stores.</p>
<p>Symbols to read on a PE diagram: <code>#</code> protected (subclasses read <code>value</code> directly), <code>-</code> private, <code>+</code> public; a hollow triangle = "extends"; a hollow diamond on the container's side = "has a collection of".</p>`,
        `<p class="y-chinh">🎯 Sơ đồ lớp: <code>Item</code> (#value, #creator, constructor, getter/setter, input(), toString()); <code>Vase</code>, <code>Statue</code>, <code>Painting</code> kế thừa nó; <code>ItemList</code> (-list[]:Item, -numOfItem, -MAX = 100) với addItem, displayAll, findItem, findItemIndex, updateItem, removeItem, displayItemsByType, sortItems.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f9e99708830c35706070b79fa1ca0e5765ba9abc.svg" alt="Slide 4 vẽ lại: cùng các lớp, sửa ba lỗi của hình" loading="lazy" /><p class="chu-thich">🧩 Slide 4 vẽ lại: cùng các lớp, sửa ba lỗi của hình</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 4 redrawn and corrected — the antique shop
' Sửa: constructor của Vase là Vase(...), Painting.width là int, và ItemList chứa các Item (một quan hệ tập hợp), không phải ba mũi tên tới các lớp con
class Item {
  # value : int
  # creator : String
  + Item()
  + Item(value : int, creator : String)
  + getValue() : int
  + setValue(value : int) : void
  + getCreator() : String
  + setCreator(creator : String) : void
  + input() : void
  + toString() : String
}
class Vase {
  - height : int
  - material : String
  + Vase()
  + Vase(value : int, creator : String, height : int, material : String)
  + input() : void
  + toString() : String
}
class Statue {
  - weight : int
  - colour : String
  + Statue()
  + Statue(value : int, creator : String, weight : int, colour : String)
  + input() : void
  + toString() : String
}
class Painting {
  - height : int
  - width : int
  - isWatercolour : boolean
  - isFramed : boolean
  + Painting()
  + Painting(value : int, creator : String, height : int, width : int, isWatercolour : boolean, isFramed : boolean)
  + input() : void
  + toString() : String
}
class ItemList {
  - list : Item[]
  - numOfItem : int
  - MAX : int = 100 {readOnly}
  + ItemList()
  + addItem(item : Item) : boolean
  + displayAll() : void
  + findItem(creator : String) : Item
  + findItemIndex(creator : String) : int
  + updateItem(index : int) : boolean
  + removeItem(index : int) : boolean
  + displayItemsByType(type : String) : void
  + sortItems() : void
}
class AntiqueShop {
  + {static} main(args : String[]) : void
}
Item &lt;|-- Vase
Item &lt;|-- Statue
Item &lt;|-- Painting
ItemList o--&gt; "0..100" Item : list
AntiqueShop ..&gt; ItemList : uses
@enduml</code></pre></details>
<p>Ba lỗi trong hình của slide, đều đã sửa ở trên. <strong>Vase</strong> liệt kê <code>+Item()</code> và <code>+Item(int,String)</code> — chép dán nhầm: constructor của Vase là <code>Vase()</code> và <code>Vase(int, String, int, String)</code>. <strong>Painting</strong> có <code>-width:String</code> và constructor <code>(int,String,int,String,boolean,boolean)</code>, trong khi code ở slide 8 khai báo <code>int width</code>. Và <strong>ItemList</strong> có ba mũi tên tới Vase, Statue và Painting: trong code nó giữ một mảng <code>Item</code> và không bao giờ gọi tên một lớp con — một quan hệ tập hợp (aggregation) <code>ItemList o--&gt; Item</code> với bội số 0..100 nói đúng điều đó. Chính mũi tên duy nhất ấy là ý chính của bộ slide: ItemList không quan tâm nó đang chứa loại món đồ nào.</p>
<p>Ký hiệu cần đọc trên sơ đồ đề PE: <code>#</code> protected (lớp con đọc thẳng <code>value</code>), <code>-</code> private, <code>+</code> public; tam giác rỗng = "extends"; hình thoi rỗng ở phía lớp chứa = "có một tập các".</p>`],
      [5, 'Case study — public class Item',
        `<p class="y-chinh">🎯 <code>public class Item</code>: <code>protected int value</code> (the price, &gt;= 0), <code>protected String creator</code> (not empty), <code>Item()</code> setting 0 and "", <code>Item(int value, String creator)</code>; getters and setters to add; <code>input()</code> — "use Scanner class to input fields, use try..catch/throws to handle exceptions"; <code>toString()</code> returning value and creator.</p>
<p>The slide is a template: the two comments in <code>input()</code> are the whole of Chapter 6. Completed, with the validation placed in one small helper class so that every <code>input()</code> stays short:</p>
<pre class="trich"><code class="language-java">class Inputter {                                                 // ONE Scanner for the whole program (lesson 6.A, slide 16)
    private static final Scanner SC = new Scanner(System.in);

    static String readLine(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);                                    // echo the piped input into the transcript
        return s;
    }

    static String readNonEmpty(String prompt) {
        while (true) {
            String s = readLine(prompt);
            if (!s.isEmpty()) return s;
            System.out.println("  must not be empty");
        }
    }

    static int readInt(String prompt, int min, int max) {
        while (true) {
            try {
                int n = Integer.parseInt(readLine(prompt));
                if (n &gt;= min &amp;&amp; n &lt;= max) return n;
                System.out.println("  must be in " + min + ".." + max);
            } catch (NumberFormatException e) {
                System.out.println("  not an integer");
            }
        }
    }

    static boolean readYesNo(String prompt) {
        while (true) {
            String s = readLine(prompt + "(y/n): ");
            if (s.equalsIgnoreCase("y")) return true;
            if (s.equalsIgnoreCase("n")) return false;
            System.out.println("  type y or n");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Item {
    protected int value;          // the price of an item (&gt;= 0)
    protected String creator;     // who made it (not empty)

    public Item() { value = 0; creator = ""; }
    public Item(int value, String creator) { this.value = value; this.creator = creator; }

    public int getValue() { return value; }
    public void setValue(int value) { this.value = value; }
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }

    public void input() {                                         // validation lives in Inputter: the loop asks again, nothing crashes
        value = Inputter.readInt("  value: ", 0, 1000000);
        creator = Inputter.readNonEmpty("  creator: ");
    }

    @Override
    public String toString() { return "value=" + value + ", creator=" + creator; }
}</code></pre>
<p>Why a separate <code>Inputter</code>: four classes need "read an int in a range", "read a non-empty string"; writing the try-catch loop four times invites four slightly different bugs. It also owns the program's <strong>only</strong> <code>Scanner</code> on <code>System.in</code> — the lesson of 6.A, slide 16. The constraints in the slide's comments (<code>&gt;= 0</code>, "is not empty") become the arguments of those calls, so a wrong value is asked again instead of being stored.</p>
<p>Small things on the slide: "a Item" should be "an Item"; the default constructor writes <code>value=0;</code> although an <code>int</code> field is already 0 — harmless, and it states the intent. <code>protected</code> fields are a choice of this deck (subclasses read them); PE diagrams usually make fields <code>-</code> private with getters.</p>`,
        `<p class="y-chinh">🎯 <code>public class Item</code>: <code>protected int value</code> (giá, &gt;= 0), <code>protected String creator</code> (không rỗng), <code>Item()</code> gán 0 và "", <code>Item(int value, String creator)</code>; getter và setter cần viết thêm; <code>input()</code> — "dùng lớp Scanner để nhập các trường, dùng try..catch/throws để xử lý ngoại lệ"; <code>toString()</code> trả về value và creator.</p>
<p>Slide là một khung mẫu: hai dòng chú thích trong <code>input()</code> chính là toàn bộ Chương 6. Viết đầy đủ, với phần kiểm tra dữ liệu đặt trong một lớp phụ nhỏ để mọi <code>input()</code> đều ngắn:</p>
<pre class="trich"><code class="language-java">class Inputter {                                                 // MỘT Scanner cho cả chương trình (bài 6.A, slide 16)
    private static final Scanner SC = new Scanner(System.in);

    static String readLine(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);                                    // in lại dữ liệu nạp vào bản ghi
        return s;
    }

    static String readNonEmpty(String prompt) {
        while (true) {
            String s = readLine(prompt);
            if (!s.isEmpty()) return s;
            System.out.println("  must not be empty");
        }
    }

    static int readInt(String prompt, int min, int max) {
        while (true) {
            try {
                int n = Integer.parseInt(readLine(prompt));
                if (n &gt;= min &amp;&amp; n &lt;= max) return n;
                System.out.println("  must be in " + min + ".." + max);
            } catch (NumberFormatException e) {
                System.out.println("  not an integer");
            }
        }
    }

    static boolean readYesNo(String prompt) {
        while (true) {
            String s = readLine(prompt + "(y/n): ");
            if (s.equalsIgnoreCase("y")) return true;
            if (s.equalsIgnoreCase("n")) return false;
            System.out.println("  type y or n");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Item {
    protected int value;          // giá của món đồ (&gt;= 0)
    protected String creator;     // người làm ra nó (không rỗng)

    public Item() { value = 0; creator = ""; }
    public Item(int value, String creator) { this.value = value; this.creator = creator; }

    public int getValue() { return value; }
    public void setValue(int value) { this.value = value; }
    public String getCreator() { return creator; }
    public void setCreator(String creator) { this.creator = creator; }

    public void input() {                                         // việc kiểm tra nằm trong Inputter: vòng lặp hỏi lại, không gì bị sập
        value = Inputter.readInt("  value: ", 0, 1000000);
        creator = Inputter.readNonEmpty("  creator: ");
    }

    @Override
    public String toString() { return "value=" + value + ", creator=" + creator; }
}</code></pre>
<p>Vì sao tách riêng <code>Inputter</code>: bốn lớp cần "đọc một số nguyên trong khoảng", "đọc một chuỗi không rỗng"; viết vòng try-catch bốn lần là mời gọi bốn lỗi hơi khác nhau. Nó còn sở hữu <code>Scanner</code> <strong>duy nhất</strong> trên <code>System.in</code> của chương trình — bài học của 6.A, slide 16. Các ràng buộc trong chú thích của slide (<code>&gt;= 0</code>, "is not empty") trở thành đối số của các lời gọi đó, nên một giá trị sai bị hỏi lại thay vì bị lưu vào.</p>
<p>Chuyện nhỏ trên slide: "a Item" phải là "an Item"; constructor mặc định ghi <code>value=0;</code> dù trường <code>int</code> vốn đã là 0 — vô hại, và nó nói rõ ý định. Trường <code>protected</code> là lựa chọn của bộ slide này (lớp con đọc thẳng); sơ đồ đề PE thường để trường <code>-</code> private kèm getter.</p>`],
      [6, 'Case study — public class Vase extends Item',
        `<p class="y-chinh">🎯 <code>public class Vase extends Item</code>: <code>private int height</code> (0..2000), <code>private String material</code> (not empty); constructors, getters, setters to add; <code>input()</code> for all fields of a vase; <code>toString()</code> returning value, creator, height, material.</p>
<pre class="trich"><code class="language-java">class Vase extends Item {
    private int height;           // 0..2000
    private String material;      // not empty

    public Vase() { super(); material = ""; }
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);
        this.height = height;
        this.material = material;
    }

    @Override
    public void input() {
        super.input();                                            // value and creator: written once, in Item
        height = Inputter.readInt("  height: ", 0, 2000);
        material = Inputter.readNonEmpty("  material: ");
    }

    @Override
    public String toString() { return "Vase[" + super.toString() + ", height=" + height + ", material=" + material + "]"; }
}</code></pre>
<p>The two lines that carry the design: <code>super.input()</code> reads value and creator with Item's code — Vase adds only what is new — and <code>super.toString()</code> reuses Item's text. If the rule for <code>value</code> changes, one method changes. Both overrides carry <code>@Override</code>, so a typo such as <code>Input()</code> is a compile error instead of a silent new method (lesson 4.B, slide 7).</p>
<p>The four-argument constructor passes <code>value</code> and <code>creator</code> up with <code>super(value, creator)</code> as its first statement: Vase cannot assign Item's constructor work itself, and putting <code>super(...)</code> anywhere else is a compile error (lesson 4.A).</p>`,
        `<p class="y-chinh">🎯 <code>public class Vase extends Item</code>: <code>private int height</code> (0..2000), <code>private String material</code> (không rỗng); constructor, getter, setter cần viết thêm; <code>input()</code> cho mọi trường của một chiếc bình; <code>toString()</code> trả về value, creator, height, material.</p>
<pre class="trich"><code class="language-java">class Vase extends Item {
    private int height;           // 0..2000
    private String material;      // không rỗng

    public Vase() { super(); material = ""; }
    public Vase(int value, String creator, int height, String material) {
        super(value, creator);
        this.height = height;
        this.material = material;
    }

    @Override
    public void input() {
        super.input();                                            // value và creator: viết một lần, trong Item
        height = Inputter.readInt("  height: ", 0, 2000);
        material = Inputter.readNonEmpty("  material: ");
    }

    @Override
    public String toString() { return "Vase[" + super.toString() + ", height=" + height + ", material=" + material + "]"; }
}</code></pre>
<p>Hai dòng mang cả thiết kế: <code>super.input()</code> đọc value và creator bằng code của Item — Vase chỉ thêm cái mới — và <code>super.toString()</code> dùng lại chữ của Item. Nếu luật cho <code>value</code> thay đổi, chỉ một phương thức phải sửa. Cả hai bản ghi đè đều có <code>@Override</code>, nên một lỗi gõ như <code>Input()</code> là lỗi biên dịch thay vì một phương thức mới âm thầm (bài 4.B, slide 7).</p>
<p>Constructor bốn tham số đưa <code>value</code> và <code>creator</code> lên trên bằng <code>super(value, creator)</code> làm câu lệnh đầu tiên: Vase không tự làm thay việc của constructor Item, và đặt <code>super(...)</code> ở bất cứ chỗ nào khác là lỗi biên dịch (bài 4.A).</p>`],
      [7, 'Case study — public class Statue extends Item',
        `<p class="y-chinh">🎯 <code>public class Statue extends Item</code>: <code>private int weight</code> ("weght &gt;= 0 and &lt;= 1000" — a typo of weight), <code>private String colour</code> (not empty); the same list of things to add: constructors, getter, setter, <code>input()</code>, <code>toString()</code>.</p>
<pre class="trich"><code class="language-java">class Statue extends Item {
    private int weight;           // 0..1000
    private String colour;        // not empty

    public Statue() { super(); colour = ""; }
    public Statue(int value, String creator, int weight, String colour) {
        super(value, creator);
        this.weight = weight;
        this.colour = colour;
    }

    @Override
    public void input() {
        super.input();
        weight = Inputter.readInt("  weight: ", 0, 1000);
        colour = Inputter.readNonEmpty("  colour: ");
    }

    @Override
    public String toString() { return "Statue[" + super.toString() + ", weight=" + weight + ", colour=" + colour + "]"; }
}</code></pre>
<p>Compare with Vase: the same skeleton, different fields and ranges. That repetition is normal for sibling classes — what must <em>not</em> be repeated is what lives in Item. If you notice yourself copying <code>value</code>-reading code into Statue, it belongs in the parent.</p>
<p>The slide's comment line starts with four slashes (<code>////the colour…</code>) — legal, since everything after <code>//</code> is a comment, but a sign the template was assembled by copy-paste; read the comments of a given skeleton critically, as you would a PE paper's wording.</p>
<div class="pitfall">PE/LAB211 marking checks the ranges at the edges: weight 0 and 1000 must be accepted, -1 and 1001 rejected. Write <code>n &gt;= min &amp;&amp; n &lt;= max</code> and test both edges.</div>`,
        `<p class="y-chinh">🎯 <code>public class Statue extends Item</code>: <code>private int weight</code> ("weght &gt;= 0 and &lt;= 1000" — gõ nhầm từ weight), <code>private String colour</code> (không rỗng); cùng danh sách việc cần thêm: constructor, getter, setter, <code>input()</code>, <code>toString()</code>.</p>
<pre class="trich"><code class="language-java">class Statue extends Item {
    private int weight;           // 0..1000
    private String colour;        // không rỗng

    public Statue() { super(); colour = ""; }
    public Statue(int value, String creator, int weight, String colour) {
        super(value, creator);
        this.weight = weight;
        this.colour = colour;
    }

    @Override
    public void input() {
        super.input();
        weight = Inputter.readInt("  weight: ", 0, 1000);
        colour = Inputter.readNonEmpty("  colour: ");
    }

    @Override
    public String toString() { return "Statue[" + super.toString() + ", weight=" + weight + ", colour=" + colour + "]"; }
}</code></pre>
<p>So với Vase: cùng một bộ khung, khác trường và khoảng giá trị. Sự lặp lại đó là bình thường giữa các lớp anh em — thứ <em>không</em> được lặp là thứ nằm trong Item. Nếu thấy mình đang chép đoạn đọc <code>value</code> sang Statue, đoạn đó thuộc về lớp cha.</p>
<p>Dòng chú thích của slide bắt đầu bằng bốn dấu gạch chéo (<code>////the colour…</code>) — hợp lệ, vì mọi thứ sau <code>//</code> đều là chú thích, nhưng là dấu hiệu khung mẫu được ghép bằng chép dán; hãy đọc chú thích của bộ khung cho sẵn một cách tỉnh táo, như đọc câu chữ của đề PE.</p>
<div class="pitfall">Chấm PE/LAB211 kiểm khoảng giá trị ở hai đầu mút: weight 0 và 1000 phải được nhận, -1 và 1001 phải bị từ chối. Viết <code>n &gt;= min &amp;&amp; n &lt;= max</code> và thử cả hai đầu.</div>`],
      [8, 'Case study — public class Painting extends Item',
        `<p class="y-chinh">🎯 <code>public class Painting extends Item</code>: <code>private int height</code> (0..2000), <code>private int width</code> (0..3000), <code>private boolean isWatercolour</code>, <code>private boolean isFramed</code>; constructors, getter, setter, <code>input()</code>, and <code>toString()</code> with all fields.</p>
<pre class="trich"><code class="language-java">class Painting extends Item {
    private int height;           // 0..2000
    private int width;            // 0..3000
    private boolean isWatercolour;
    private boolean isFramed;

    public Painting() { super(); }
    public Painting(int value, String creator, int height, int width, boolean isWatercolour, boolean isFramed) {
        super(value, creator);
        this.height = height;
        this.width = width;
        this.isWatercolour = isWatercolour;
        this.isFramed = isFramed;
    }

    @Override
    public void input() {
        super.input();
        height = Inputter.readInt("  height: ", 0, 2000);
        width = Inputter.readInt("  width: ", 0, 3000);
        isWatercolour = Inputter.readYesNo("  watercolour ");
        isFramed = Inputter.readYesNo("  framed ");
    }

    @Override
    public String toString() {
        return "Painting[" + super.toString() + ", " + height + "x" + width
            + (isWatercolour ? ", watercolour" : ", oil") + (isFramed ? ", framed" : ", no frame") + "]";
    }
}</code></pre>
<p>Two new things. A <code>boolean</code> cannot be typed directly in a friendly way, so <code>Inputter.readYesNo</code> accepts "y"/"n" (either case) and asks again otherwise; <code>toString()</code> turns the booleans back into words ("oil, framed") instead of printing <code>true</code>/<code>false</code>. The slide's width comment says "(height&gt;=0 and &lt;=3000)" — another copy-paste: it is the width that must be within 0..3000.</p>
<p>Naming: a boolean field called <code>isFramed</code> leads to the getter <code>isIsFramed()</code> in NetBeans' "Insert Code → Getter" — the JavaBeans convention is a field <code>framed</code> with getter <code>isFramed()</code>. Keep the slide's names when a PE diagram gives them; choose <code>framed</code> in your own code.</p>`,
        `<p class="y-chinh">🎯 <code>public class Painting extends Item</code>: <code>private int height</code> (0..2000), <code>private int width</code> (0..3000), <code>private boolean isWatercolour</code>, <code>private boolean isFramed</code>; constructor, getter, setter, <code>input()</code>, và <code>toString()</code> chứa mọi trường.</p>
<pre class="trich"><code class="language-java">class Painting extends Item {
    private int height;           // 0..2000
    private int width;            // 0..3000
    private boolean isWatercolour;
    private boolean isFramed;

    public Painting() { super(); }
    public Painting(int value, String creator, int height, int width, boolean isWatercolour, boolean isFramed) {
        super(value, creator);
        this.height = height;
        this.width = width;
        this.isWatercolour = isWatercolour;
        this.isFramed = isFramed;
    }

    @Override
    public void input() {
        super.input();
        height = Inputter.readInt("  height: ", 0, 2000);
        width = Inputter.readInt("  width: ", 0, 3000);
        isWatercolour = Inputter.readYesNo("  watercolour ");
        isFramed = Inputter.readYesNo("  framed ");
    }

    @Override
    public String toString() {
        return "Painting[" + super.toString() + ", " + height + "x" + width
            + (isWatercolour ? ", watercolour" : ", oil") + (isFramed ? ", framed" : ", no frame") + "]";
    }
}</code></pre>
<p>Hai điều mới. Một <code>boolean</code> không gõ trực tiếp cho thân thiện được, nên <code>Inputter.readYesNo</code> nhận "y"/"n" (hoa hay thường đều được) và hỏi lại nếu khác; <code>toString()</code> đổi boolean trở lại thành chữ ("oil, framed") thay vì in <code>true</code>/<code>false</code>. Chú thích về width trên slide ghi "(height&gt;=0 and &lt;=3000)" — lại chép dán: chính width mới phải nằm trong 0..3000.</p>
<p>Đặt tên: trường boolean tên <code>isFramed</code> làm NetBeans ("Insert Code → Getter") sinh ra getter <code>isIsFramed()</code> — quy ước JavaBeans là trường <code>framed</code> với getter <code>isFramed()</code>. Giữ tên của slide khi sơ đồ đề PE cho sẵn; trong code của riêng bạn hãy chọn <code>framed</code>.</p>`],
      [9, 'Case study — public class ItemList',
        `<p class="y-chinh">🎯 <code>public class ItemList</code>: <code>Item[] list</code> stores all items, <code>int numOfItem</code> counts the items added, <code>final int MAX=100</code> is the size; the constructor creates <code>new Item[MAX]</code> and sets <code>numOfItem=0</code>; <code>addItem(Item item)</code> returns false if <code>item==null</code> or the list is full, otherwise stores it at <code>list[numOfItem]</code> and increments the counter.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/45d70ea959b7a990d3740be147d85e3ed5a24d08.svg" alt="Slide 9 in memory: the array holds 100 references, three of them used" loading="lazy" /><p class="chu-thich">🧩 Slide 9 in memory: the array holds 100 references, three of them used</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 9 — what lives where after three addItem() calls
' The array holds references only; the objects are elsewhere on the heap and may be Vase, Statue or Painting
object "obj : ItemList" as L {
  numOfItem = 3
  MAX = 100
}
object "Vase" as V {
  value = 300
  creator = "Minh Long"
  height = 1200
}
object "Statue" as S {
  value = 150
  creator = "Rodin"
  weight = 900
}
object "Painting" as P {
  value = 800
  creator = "Bui Xuan Phai"
  isFramed = true
}
map "list : Item[100]" as A {
  [0] *--&gt; V
  [1] *--&gt; S
  [2] *--&gt; P
  [3] =&gt; null
  ... =&gt; null
  [99] =&gt; null
}
L --&gt; A : list
note bottom of A
  used part: [0] .. [numOfItem-1]
  next addItem() writes list[numOfItem]
  list.length is always 100
end note
@enduml</code></pre></details>
<p>The slide's class, run: what <code>new Item[MAX]</code> contains, what <code>addItem</code> changes, and what happens with the wrong loop bound — on JDK 8:</p>
<pre class="trich"><code class="language-java">class ItemList {
    Item[] list;          // an array to store all items
    int numOfItem;        // to store the number of items that added to the list
    final int MAX = 100;  // is the size of the array

    public ItemList() {
        list = new Item[MAX];
        numOfItem = 0;
    }

    public boolean addItem(Item item) {
        if (item == null || numOfItem &gt;= MAX)
            return false;
        list[numOfItem] = item;
        numOfItem++;
        return true;
    }
}</code></pre>
<pre class="trich"><code class="language-java">ItemList obj = new ItemList();
System.out.println("length=" + obj.list.length + " numOfItem=" + obj.numOfItem + " list[0]=" + obj.list[0]);
Item vase = new Item(300, "Minh Long");
obj.addItem(vase);
obj.addItem(new Item(150, "Rodin"));
obj.addItem(new Item(800, "Bui Xuan Phai"));
System.out.println("addItem(null) -&gt; " + obj.addItem(null));
for (int i = 0; i &lt; 4; i++) System.out.println("list[" + i + "] = " + obj.list[i]);
vase.value = 999;                                       // change the object through ANOTHER reference
System.out.println("after vase.value = 999: list[0] = " + obj.list[0] + ", same object? " + (obj.list[0] == vase));
int sum = 0;
try {
    for (int i = 0; i &lt; obj.list.length; i++) sum += obj.list[i].getValue();   // wrong bound: length, not numOfItem
} catch (NullPointerException e) {
    System.out.println("loop to list.length: " + e + " (sum so far " + sum + ")");
}</code></pre>
<div class="out">length=100 numOfItem=0 list[0]=null<br>
addItem(null) -&gt; false<br>
list[0] = Minh Long(300)<br>
list[1] = Rodin(150)<br>
list[2] = Bui Xuan Phai(800)<br>
list[3] = null<br>
after vase.value = 999: list[0] = Minh Long(999), same object? true<br>
loop to list.length: java.lang.NullPointerException (sum so far 1949)</div>
<p>Four facts to keep. <code>new Item[100]</code> creates <strong>no Item at all</strong> — 100 references, all <code>null</code>. <code>list.length</code> is always 100; the number of items is <code>numOfItem</code>, and every loop of ItemList must stop there. The array stores <strong>references</strong>: changing <code>vase.value</code> changed what <code>list[0]</code> shows, because both point to one object (<code>==</code> is true). And a loop to <code>list.length</code> runs into <code>list[3]</code>, which is null — <code>NullPointerException</code> (JDK 8 gives no detail; JDK 17+ would also say which expression was null, see 6.A slide 5).</p>
<p>The design of <code>addItem</code> is the one to copy: check first, then act, and tell the caller with the boolean whether it worked (main prints "added" or "the list is full"). Improvements for your own code: make the fields <code>private</code>, and <code>MAX</code> a <code>static final</code> constant — it is the same for every list.</p>`,
        `<p class="y-chinh">🎯 <code>public class ItemList</code>: <code>Item[] list</code> chứa mọi món đồ, <code>int numOfItem</code> đếm số món đã thêm, <code>final int MAX=100</code> là kích thước; constructor tạo <code>new Item[MAX]</code> và gán <code>numOfItem=0</code>; <code>addItem(Item item)</code> trả về false nếu <code>item==null</code> hoặc danh sách đầy, ngược lại lưu nó vào <code>list[numOfItem]</code> và tăng biến đếm.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/45d70ea959b7a990d3740be147d85e3ed5a24d08.svg" alt="Slide 9 trong bộ nhớ: mảng giữ 100 tham chiếu, dùng ba" loading="lazy" /><p class="chu-thich">🧩 Slide 9 trong bộ nhớ: mảng giữ 100 tham chiếu, dùng ba</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 9 — what lives where after three addItem() calls
' Mảng chỉ chứa tham chiếu; các đối tượng nằm chỗ khác trên heap và có thể là Vase, Statue hay Painting
object "obj : ItemList" as L {
  numOfItem = 3
  MAX = 100
}
object "Vase" as V {
  value = 300
  creator = "Minh Long"
  height = 1200
}
object "Statue" as S {
  value = 150
  creator = "Rodin"
  weight = 900
}
object "Painting" as P {
  value = 800
  creator = "Bui Xuan Phai"
  isFramed = true
}
map "list : Item[100]" as A {
  [0] *--&gt; V
  [1] *--&gt; S
  [2] *--&gt; P
  [3] =&gt; null
  ... =&gt; null
  [99] =&gt; null
}
L --&gt; A : list
note bottom of A
  used part: [0] .. [numOfItem-1]
  next addItem() writes list[numOfItem]
  list.length is always 100
end note
@enduml</code></pre></details>
<p>Lớp của slide, chạy thật: <code>new Item[MAX]</code> chứa gì, <code>addItem</code> thay đổi gì, và điều gì xảy ra với biên vòng lặp sai — trên JDK 8:</p>
<pre class="trich"><code class="language-java">class ItemList {
    Item[] list;          // mảng chứa mọi món đồ
    int numOfItem;        // số món đã thêm vào danh sách
    final int MAX = 100;  // kích thước mảng

    public ItemList() {
        list = new Item[MAX];
        numOfItem = 0;
    }

    public boolean addItem(Item item) {
        if (item == null || numOfItem &gt;= MAX)
            return false;
        list[numOfItem] = item;
        numOfItem++;
        return true;
    }
}</code></pre>
<pre class="trich"><code class="language-java">ItemList obj = new ItemList();
System.out.println("length=" + obj.list.length + " numOfItem=" + obj.numOfItem + " list[0]=" + obj.list[0]);
Item vase = new Item(300, "Minh Long");
obj.addItem(vase);
obj.addItem(new Item(150, "Rodin"));
obj.addItem(new Item(800, "Bui Xuan Phai"));
System.out.println("addItem(null) -&gt; " + obj.addItem(null));
for (int i = 0; i &lt; 4; i++) System.out.println("list[" + i + "] = " + obj.list[i]);
vase.value = 999;                                       // sửa đối tượng qua MỘT tham chiếu khác
System.out.println("after vase.value = 999: list[0] = " + obj.list[0] + ", same object? " + (obj.list[0] == vase));
int sum = 0;
try {
    for (int i = 0; i &lt; obj.list.length; i++) sum += obj.list[i].getValue();   // sai biên: length, không phải numOfItem
} catch (NullPointerException e) {
    System.out.println("loop to list.length: " + e + " (sum so far " + sum + ")");
}</code></pre>
<div class="out">length=100 numOfItem=0 list[0]=null<br>
addItem(null) -&gt; false<br>
list[0] = Minh Long(300)<br>
list[1] = Rodin(150)<br>
list[2] = Bui Xuan Phai(800)<br>
list[3] = null<br>
after vase.value = 999: list[0] = Minh Long(999), same object? true<br>
loop to list.length: java.lang.NullPointerException (sum so far 1949)</div>
<p>Bốn sự thật cần giữ. <code>new Item[100]</code> <strong>không tạo ra Item nào cả</strong> — 100 tham chiếu, tất cả là <code>null</code>. <code>list.length</code> luôn là 100; số món đồ là <code>numOfItem</code>, và mọi vòng lặp của ItemList phải dừng ở đó. Mảng lưu <strong>tham chiếu</strong>: đổi <code>vase.value</code> là đổi luôn thứ <code>list[0]</code> hiện ra, vì cả hai trỏ tới một đối tượng (<code>==</code> là true). Và một vòng lặp tới <code>list.length</code> chạy vào <code>list[3]</code>, vốn là null — <code>NullPointerException</code> (JDK 8 không nói thêm gì; JDK 17+ còn nói rõ biểu thức nào bị null, xem 6.A slide 5).</p>
<p>Thiết kế của <code>addItem</code> là thứ nên chép: kiểm trước, rồi mới làm, và báo cho bên gọi bằng giá trị boolean là có thành công không (main in "added" hoặc "the list is full"). Cải tiến cho code của bạn: để các trường <code>private</code>, và <code>MAX</code> thành hằng <code>static final</code> — danh sách nào cũng như nhau.</p>`],
      [10, 'Case study — displayAll and findItem',
        `<p class="y-chinh">🎯 <code>displayAll()</code> prints "the list is empty" when <code>numOfItem==0</code>, then prints <code>list[i]</code> for i from 0 to numOfItem-1; <code>findItem(String creator)</code> returns the <strong>first</strong> item whose creator equals the given one, or <code>null</code>.</p>
<p>The slide writes <code>pulic</code> instead of <code>public</code> — on this slide and the next two. Typed as shown (with the three methods of slides 10–11), JDK 8 says:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Item.java",
        "public class Item {",
        "    protected int value; protected String creator;",
        "    public int getValue() { return value; }",
        "    public String getCreator() { return creator; }",
        "    public void input() { }",
        "}");
    System.out.println("== slides 10-11 as typed ==");
    viet(d, "ItemList.java",
        "public class ItemList {",
        "    Item [] list = new Item[100];",
        "    int numOfItem;",
        "    pulic Item findItem(String creator){",
        "        for(int i=0; i&lt; numOfItem; i++)",
        "            if( list[i].getCreator().equals(creator))",
        "                return list[i];",
        "        return null;",
        "    }",
        "    pulic int findItemIndex(String creator){",
        "        for(int i=0; i&lt; numOfItem; i++)",
        "            if( list[i].getCreator().equals(creator))",
        "                return i;",
        "        return -1;",
        "    }",
        "    pulic boolean updateItem(int index){",
        "        if( index &gt;= 0 &amp;&amp; index &lt; numOfItem){",
        "            list[i].input();",
        "            return true;",
        "        }",
        "        return false;",
        "    }",
        "}");
    lenh(d, "javac", "ItemList.java");
}</code></pre>
<div class="out">== slides 10-11 as typed ==<br>
&gt; javac ItemList.java<br>
ItemList.java:4: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic Item findItem(String creator){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:4: error: invalid method declaration; return type required<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic Item findItem(String creator){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:10: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic int findItemIndex(String creator){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:10: error: invalid method declaration; return type required<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic int findItemIndex(String creator){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:16: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic boolean updateItem(int index){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:16: error: invalid method declaration; return type required<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic boolean updateItem(int index){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
6 errors<br>
(exit code 1)</div>
<p>Why such strange messages for one typo: javac does not know "pulic" is a misspelt keyword. On line 4 it reads <code>pulic Item</code> as "a field of type <code>pulic</code> named <code>Item</code>", so it expects a <code>;</code> — then sees <code>findItem(</code> and complains about a method without return type. Lesson: when javac reports nonsense, look a few characters <em>before</em> the caret. The corrected methods:</p>
<pre class="trich"><code class="language-java">public void displayAll() {
    if (numOfItem == 0) {
        System.out.println("the list is empty");
        return;
    }
    for (int i = 0; i &lt; numOfItem; i++) System.out.println(i + ": " + list[i]);   // polymorphism: each object's own toString()
}

public Item findItem(String creator) {
    for (int i = 0; i &lt; numOfItem; i++)
        if (list[i].getCreator().equalsIgnoreCase(creator)) return list[i];
    return null;
}</code></pre>
<p>Changes: an empty list returns right after its message; each line shows its index, which the user needs for update and remove; and the search uses <code>equalsIgnoreCase</code>, so "rodin" finds "Rodin" — decide this with the problem statement, PE papers often say "case insensitive". Never compare strings with <code>==</code> (lesson 1.E). Returning <code>null</code> for "not found" obliges every caller to check: <code>found == null ? "not found" : …</code> in main.</p>`,
        `<p class="y-chinh">🎯 <code>displayAll()</code> in "the list is empty" khi <code>numOfItem==0</code>, rồi in <code>list[i]</code> với i từ 0 tới numOfItem-1; <code>findItem(String creator)</code> trả về món đồ <strong>đầu tiên</strong> có creator bằng giá trị cho trước, hoặc <code>null</code>.</p>
<p>Slide viết <code>pulic</code> thay cho <code>public</code> — ở slide này và hai slide sau. Gõ y như vậy (cùng ba phương thức của slide 10–11), JDK 8 báo:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Item.java",
        "public class Item {",
        "    protected int value; protected String creator;",
        "    public int getValue() { return value; }",
        "    public String getCreator() { return creator; }",
        "    public void input() { }",
        "}");
    System.out.println("== slides 10-11 as typed ==");
    viet(d, "ItemList.java",
        "public class ItemList {",
        "    Item [] list = new Item[100];",
        "    int numOfItem;",
        "    pulic Item findItem(String creator){",
        "        for(int i=0; i&lt; numOfItem; i++)",
        "            if( list[i].getCreator().equals(creator))",
        "                return list[i];",
        "        return null;",
        "    }",
        "    pulic int findItemIndex(String creator){",
        "        for(int i=0; i&lt; numOfItem; i++)",
        "            if( list[i].getCreator().equals(creator))",
        "                return i;",
        "        return -1;",
        "    }",
        "    pulic boolean updateItem(int index){",
        "        if( index &gt;= 0 &amp;&amp; index &lt; numOfItem){",
        "            list[i].input();",
        "            return true;",
        "        }",
        "        return false;",
        "    }",
        "}");
    lenh(d, "javac", "ItemList.java");
}</code></pre>
<div class="out">== slides 10-11 as typed ==<br>
&gt; javac ItemList.java<br>
ItemList.java:4: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic Item findItem(String creator){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:4: error: invalid method declaration; return type required<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic Item findItem(String creator){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:10: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic int findItemIndex(String creator){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:10: error: invalid method declaration; return type required<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic int findItemIndex(String creator){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:16: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic boolean updateItem(int index){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
ItemList.java:16: error: invalid method declaration; return type required<br>
&nbsp;&nbsp;&nbsp;&nbsp;pulic boolean updateItem(int index){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
6 errors<br>
(exit code 1)</div>
<p>Vì sao một lỗi gõ lại cho ra những thông báo lạ như vậy: javac không biết "pulic" là từ khoá viết sai. Ở dòng 4 nó đọc <code>pulic Item</code> thành "một trường kiểu <code>pulic</code> tên là <code>Item</code>", nên nó chờ dấu <code>;</code> — rồi gặp <code>findItem(</code> và phàn nàn về một phương thức không có kiểu trả về. Bài học: khi javac báo điều vô lý, hãy nhìn vài ký tự <em>trước</em> dấu mũ ^. Các phương thức đã sửa:</p>
<pre class="trich"><code class="language-java">public void displayAll() {
    if (numOfItem == 0) {
        System.out.println("the list is empty");
        return;
    }
    for (int i = 0; i &lt; numOfItem; i++) System.out.println(i + ": " + list[i]);   // đa hình: toString() riêng của từng đối tượng
}

public Item findItem(String creator) {
    for (int i = 0; i &lt; numOfItem; i++)
        if (list[i].getCreator().equalsIgnoreCase(creator)) return list[i];
    return null;
}</code></pre>
<p>Thay đổi: danh sách rỗng thì trả về ngay sau thông báo; mỗi dòng in kèm chỉ số, thứ người dùng cần cho sửa và xoá; và việc tìm dùng <code>equalsIgnoreCase</code>, nên "rodin" tìm thấy "Rodin" — quyết định điều này theo đề bài, đề PE hay ghi "case insensitive" (không phân biệt hoa thường). Đừng bao giờ so chuỗi bằng <code>==</code> (bài 1.E). Trả về <code>null</code> cho "không tìm thấy" buộc mọi bên gọi phải kiểm: <code>found == null ? "not found" : …</code> trong main.</p>`],
      [11, 'Case study — findItemIndex and updateItem',
        `<p class="y-chinh">🎯 <code>findItemIndex(String creator)</code> returns the zero-based index of the first occurrence, or <code>-1</code>; <code>updateItem(int index)</code> checks <code>index &gt;= 0 &amp;&amp; index &lt; numOfItem</code>, calls <code>input()</code> on that item and returns true, otherwise false.</p>
<p>With <code>pulic</code> corrected, <code>updateItem</code> still does not compile — it writes <code>list[i]</code>, and this method has no <code>i</code> (the variable belongs to the loops of the other methods):</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Item.java",
        "public class Item {",
        "    protected int value; protected String creator;",
        "    public int getValue() { return value; }",
        "    public String getCreator() { return creator; }",
        "    public void input() { }",
        "}");
    System.out.println("== \\"pulic\\" corrected to \\"public\\" ==");
    viet(d, "ItemList.java",
        "public class ItemList {",
        "    Item [] list = new Item[100];",
        "    int numOfItem;",
        "    public boolean updateItem(int index){",
        "        if( index &gt;= 0 &amp;&amp; index &lt; numOfItem){",
        "            list[i].input();",
        "            return true;",
        "        }",
        "        return false;",
        "    }",
        "}");
    lenh(d, "javac", "ItemList.java");
}</code></pre>
<div class="out">== "pulic" corrected to "public" ==<br>
&gt; javac ItemList.java<br>
ItemList.java:6: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;list[i].input();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable i<br>
&nbsp;&nbsp;location: class ItemList<br>
1 error<br>
(exit code 1)</div>
<pre class="trich"><code class="language-java">public int findItemIndex(String creator) {
    for (int i = 0; i &lt; numOfItem; i++)
        if (list[i].getCreator().equalsIgnoreCase(creator)) return i;
    return -1;
}

public boolean updateItem(int index) {
    if (index &gt;= 0 &amp;&amp; index &lt; numOfItem) {
        list[index].input();                                  // slide 11 writes list[i]: there is no i here
        return true;
    }
    return false;
}</code></pre>
<p><code>-1</code> is the conventional "not found" for an index (as <code>String.indexOf</code>), because 0 is a valid index. Why have both find methods: <code>findItem</code> gives you the object to read or modify; <code>findItemIndex</code> gives the position that update and remove need. The FU material's own main mixes them up — <code>Item result = obj.findItemIndex(creator); if (Item == null)</code> — an <code>int</code> stored in an <code>Item</code> variable, and a class name used as a variable: two more compile errors.</p>
<p><code>updateItem</code> shows polymorphism at work: <code>list[index].input()</code> runs <code>Statue.input()</code> for a statue and <code>Painting.input()</code> for a painting — ItemList never asks which. (In the run at slide 16, index 0 is a Statue and the update asks for weight and colour.)</p>`,
        `<p class="y-chinh">🎯 <code>findItemIndex(String creator)</code> trả về chỉ số (tính từ 0) của lần xuất hiện đầu tiên, hoặc <code>-1</code>; <code>updateItem(int index)</code> kiểm <code>index &gt;= 0 &amp;&amp; index &lt; numOfItem</code>, gọi <code>input()</code> trên món đồ đó và trả về true, ngược lại false.</p>
<p>Sửa <code>pulic</code> xong, <code>updateItem</code> vẫn không biên dịch được — nó viết <code>list[i]</code>, mà phương thức này không có <code>i</code> (biến đó thuộc về vòng lặp của các phương thức khác):</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Item.java",
        "public class Item {",
        "    protected int value; protected String creator;",
        "    public int getValue() { return value; }",
        "    public String getCreator() { return creator; }",
        "    public void input() { }",
        "}");
    System.out.println("== \\"pulic\\" corrected to \\"public\\" ==");
    viet(d, "ItemList.java",
        "public class ItemList {",
        "    Item [] list = new Item[100];",
        "    int numOfItem;",
        "    public boolean updateItem(int index){",
        "        if( index &gt;= 0 &amp;&amp; index &lt; numOfItem){",
        "            list[i].input();",
        "            return true;",
        "        }",
        "        return false;",
        "    }",
        "}");
    lenh(d, "javac", "ItemList.java");
}</code></pre>
<div class="out">== "pulic" corrected to "public" ==<br>
&gt; javac ItemList.java<br>
ItemList.java:6: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;list[i].input();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable i<br>
&nbsp;&nbsp;location: class ItemList<br>
1 error<br>
(exit code 1)</div>
<pre class="trich"><code class="language-java">public int findItemIndex(String creator) {
    for (int i = 0; i &lt; numOfItem; i++)
        if (list[i].getCreator().equalsIgnoreCase(creator)) return i;
    return -1;
}

public boolean updateItem(int index) {
    if (index &gt;= 0 &amp;&amp; index &lt; numOfItem) {
        list[index].input();                                  // slide 11 viết list[i]: ở đây không có biến i
        return true;
    }
    return false;
}</code></pre>
<p><code>-1</code> là quy ước "không tìm thấy" cho chỉ số (như <code>String.indexOf</code>), vì 0 là một chỉ số hợp lệ. Vì sao cần cả hai hàm tìm: <code>findItem</code> cho bạn đối tượng để đọc hay sửa; <code>findItemIndex</code> cho vị trí mà sửa và xoá cần. Chính main trong học liệu FU dùng lẫn lộn — <code>Item result = obj.findItemIndex(creator); if (Item == null)</code> — một <code>int</code> gán vào biến kiểu <code>Item</code>, và dùng tên lớp làm biến: thêm hai lỗi biên dịch nữa.</p>
<p><code>updateItem</code> cho thấy đa hình đang làm việc: <code>list[index].input()</code> chạy <code>Statue.input()</code> với tượng và <code>Painting.input()</code> với tranh — ItemList không bao giờ hỏi loại nào. (Trong lần chạy ở slide 16, chỉ số 0 là một Statue và việc sửa hỏi weight và colour.)</p>`],
      [12, 'Case study — removeItem',
        `<p class="y-chinh">🎯 <code>removeItem(int index)</code> removes the item at the given position and <strong>shifts any subsequent elements to the left</strong>: for <code>j</code> from <code>index</code> while <code>j &lt; numOfItem</code>, <code>list[j] = list[j+1]</code>; then <code>numOfItem--</code>; returns true, or false for a bad index.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/63746de6541f0d3fabab4be2c6858fcdb57ecc6d.svg" alt="Slide 12 on a full array: the shift, the cleared slot, and where the slide's loop goes one step too far" loading="lazy" /><p class="chu-thich">🧩 Slide 12 on a full array: the shift, the cleared slot, and where the slide's loop goes one step too far</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 12 — removeItem(1) on a FULL array of 4: shift left, then clear the last slot
' Left: before. Right: after the corrected loop (j &lt; numOfItem - 1) and list[numOfItem] = null
map "before (numOfItem = 4)" as B {
  [0] =&gt; A
  [1] =&gt; B (removed)
  [2] =&gt; C
  [3] =&gt; D
}
map "after (numOfItem = 3)" as F {
  [0] =&gt; A
  [1] =&gt; C (moved from 2)
  [2] =&gt; D (moved from 3)
  [3] =&gt; null (cleared)
}
B -right-&gt; F : j = 1, 2:  list[j] = list[j+1]
note bottom of B
  the slide's loop runs j = 1, 2, 3
  and j = 3 reads list[4]:
  ArrayIndexOutOfBoundsException: 4
end note
@enduml</code></pre></details>
<p>The slide's loop makes one move too many: its last step reads <code>list[numOfItem]</code>. While the array has a free slot, that slot is <code>null</code> and the extra move happens to copy a null — it "works". When the array is <strong>full</strong>, <code>list[numOfItem]</code> is <code>list[MAX]</code>, outside the array. Measured with a capacity of 4:</p>
<pre class="trich"><code class="language-java">class SlideList {
    String[] list;
    int numOfItem;
    SlideList(int max, String... items) { list = Arrays.copyOf(items, max); numOfItem = items.length; }

    boolean removeItem(int index) {                         // as on the slide (String instead of Item)
        if (index &gt;= 0 &amp;&amp; index &lt; numOfItem) {
            for (int j = index; j &lt; numOfItem; j++) {
                list[j] = list[j + 1];
            }
            numOfItem--;
            return true;
        }
        return false;
    }
}</code></pre>
<pre class="trich"><code class="language-java">class FixedList extends SlideList {
    FixedList(int max, String... items) { super(max, items); }

    @Override
    boolean removeItem(int index) {
        if (index &lt; 0 || index &gt;= numOfItem) return false;
        for (int j = index; j &lt; numOfItem - 1; j++) list[j] = list[j + 1];   // last move: list[numOfItem-2] = list[numOfItem-1]
        numOfItem--;
        list[numOfItem] = null;                                 // the old last slot no longer points to anything
        return true;
    }
}</code></pre>
<pre class="trich"><code class="language-java">SlideList a = new SlideList(4, "A", "B", "C");          // capacity 4, 3 used
a.removeItem(0);
show("slide, not full, remove(0):", a);
SlideList b = new SlideList(4, "A", "B", "C", "D");     // full
try {
    b.removeItem(1);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("slide, full, remove(1): " + e);
    show("   and the array is left half-shifted:", b);
}
FixedList c = new FixedList(4, "A", "B", "C", "D");
c.removeItem(1);
show("fixed, full, remove(1):", c);
c.removeItem(2);
show("fixed, remove(2) = the last one:", c);</code></pre>
<div class="out">slide, not full, remove(0): numOfItem=2 array=[B, C, null, null]<br>
slide, full, remove(1): java.lang.ArrayIndexOutOfBoundsException: 4<br>
&nbsp;&nbsp;&nbsp;and the array is left half-shifted: numOfItem=4 array=[A, C, D, D]<br>
fixed, full, remove(1): numOfItem=3 array=[A, C, D, null]<br>
fixed, remove(2) = the last one: numOfItem=2 array=[A, C, null, null]</div>
<p>Note the state after the crash: <code>[A, C, D, D]</code> with <code>numOfItem</code> still 4 — the shift was half done and the counter never decreased, so the list now contains D twice and B is lost. An exception in the middle of a modification leaves data inconsistent; that is why the bound must be right, not caught. The fix stops at <code>numOfItem - 1</code> and then sets the old last slot to <code>null</code>, so the array does not keep a second reference to an item (the FU text says the removed object "becomes garbage" — true only once no slot points to it).</p>
<div class="pitfall">PE "remove all elements that…" (f3 in PE6, PE14): removing inside a forward loop with <code>i++</code> skips the element that shifted into position <code>i</code>. Loop backwards, or do not increase <code>i</code> after a removal. Chapter 7's practice measures it.</div>`,
        `<p class="y-chinh">🎯 <code>removeItem(int index)</code> xoá món đồ ở vị trí cho trước và <strong>dời mọi phần tử phía sau sang trái</strong>: với <code>j</code> từ <code>index</code> khi <code>j &lt; numOfItem</code>, <code>list[j] = list[j+1]</code>; rồi <code>numOfItem--</code>; trả về true, hoặc false nếu chỉ số sai.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/63746de6541f0d3fabab4be2c6858fcdb57ecc6d.svg" alt="Slide 12 trên mảng đầy: việc dời, ô được xoá, và chỗ vòng lặp của slide đi quá một bước" loading="lazy" /><p class="chu-thich">🧩 Slide 12 trên mảng đầy: việc dời, ô được xoá, và chỗ vòng lặp của slide đi quá một bước</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 12 — removeItem(1) on a FULL array of 4: shift left, then clear the last slot
' Trái: trước. Phải: sau vòng lặp đã sửa (j &lt; numOfItem - 1) và list[numOfItem] = null
map "before (numOfItem = 4)" as B {
  [0] =&gt; A
  [1] =&gt; B (removed)
  [2] =&gt; C
  [3] =&gt; D
}
map "after (numOfItem = 3)" as F {
  [0] =&gt; A
  [1] =&gt; C (moved from 2)
  [2] =&gt; D (moved from 3)
  [3] =&gt; null (cleared)
}
B -right-&gt; F : j = 1, 2:  list[j] = list[j+1]
note bottom of B
  the slide's loop runs j = 1, 2, 3
  and j = 3 reads list[4]:
  ArrayIndexOutOfBoundsException: 4
end note
@enduml</code></pre></details>
<p>Vòng lặp của slide dời thừa một lần: bước cuối của nó đọc <code>list[numOfItem]</code>. Khi mảng còn ô trống, ô đó là <code>null</code> và lần dời thừa tình cờ chép một null — nó "chạy được". Khi mảng <strong>đầy</strong>, <code>list[numOfItem]</code> là <code>list[MAX]</code>, nằm ngoài mảng. Đo với sức chứa 4:</p>
<pre class="trich"><code class="language-java">class SlideList {
    String[] list;
    int numOfItem;
    SlideList(int max, String... items) { list = Arrays.copyOf(items, max); numOfItem = items.length; }

    boolean removeItem(int index) {                         // như trên slide (String thay cho Item)
        if (index &gt;= 0 &amp;&amp; index &lt; numOfItem) {
            for (int j = index; j &lt; numOfItem; j++) {
                list[j] = list[j + 1];
            }
            numOfItem--;
            return true;
        }
        return false;
    }
}</code></pre>
<pre class="trich"><code class="language-java">class FixedList extends SlideList {
    FixedList(int max, String... items) { super(max, items); }

    @Override
    boolean removeItem(int index) {
        if (index &lt; 0 || index &gt;= numOfItem) return false;
        for (int j = index; j &lt; numOfItem - 1; j++) list[j] = list[j + 1];   // lần dời cuối: list[numOfItem-2] = list[numOfItem-1]
        numOfItem--;
        list[numOfItem] = null;                                 // ô cuối cũ không còn trỏ tới gì
        return true;
    }
}</code></pre>
<pre class="trich"><code class="language-java">SlideList a = new SlideList(4, "A", "B", "C");          // sức chứa 4, dùng 3
a.removeItem(0);
show("slide, not full, remove(0):", a);
SlideList b = new SlideList(4, "A", "B", "C", "D");     // đầy
try {
    b.removeItem(1);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("slide, full, remove(1): " + e);
    show("   and the array is left half-shifted:", b);
}
FixedList c = new FixedList(4, "A", "B", "C", "D");
c.removeItem(1);
show("fixed, full, remove(1):", c);
c.removeItem(2);
show("fixed, remove(2) = the last one:", c);</code></pre>
<div class="out">slide, not full, remove(0): numOfItem=2 array=[B, C, null, null]<br>
slide, full, remove(1): java.lang.ArrayIndexOutOfBoundsException: 4<br>
&nbsp;&nbsp;&nbsp;and the array is left half-shifted: numOfItem=4 array=[A, C, D, D]<br>
fixed, full, remove(1): numOfItem=3 array=[A, C, D, null]<br>
fixed, remove(2) = the last one: numOfItem=2 array=[A, C, null, null]</div>
<p>Để ý trạng thái sau khi sập: <code>[A, C, D, D]</code> với <code>numOfItem</code> vẫn là 4 — việc dời mới làm nửa chừng và biến đếm chưa hề giảm, nên danh sách giờ chứa D hai lần và mất B. Một ngoại lệ giữa lúc đang sửa dữ liệu để lại dữ liệu không nhất quán; vì thế biên phải đúng, chứ không phải bắt ngoại lệ. Bản sửa dừng ở <code>numOfItem - 1</code> rồi gán ô cuối cũ thành <code>null</code>, để mảng không giữ tham chiếu thứ hai tới một món đồ (học liệu FU nói đối tượng bị xoá "thành rác" — chỉ đúng khi không còn ô nào trỏ tới nó).</p>
<div class="pitfall">Dạng PE "xoá mọi phần tử mà…" (f3 trong PE6, PE14): xoá bên trong vòng lặp tiến với <code>i++</code> sẽ bỏ sót phần tử vừa dời vào vị trí <code>i</code>. Hãy lặp ngược, hoặc không tăng <code>i</code> sau khi xoá. Bài thực hành Chương 7 đo điều này.</div>`],
      [13, 'Case study — displayItemsByType',
        `<p class="y-chinh">🎯 <code>displayItemsByType(String type)</code> prints all items of the given type: if type equals "Vase", print the elements that are <code>instanceof Vase</code>; else if "Statue", the statues; <code>else</code>, the paintings.</p>
<p>The last branch is a plain <code>else</code>, so <em>any</em> other string means "Painting" — including a lowercase "vase" and a type that does not exist:</p>
<pre class="trich"><code class="language-java">public static void displayItemsByType(String type) {
    if (type.equals("Vase")) {
        for (int i = 0; i &lt; numOfItem; i++)
            if (list[i] instanceof Vase) System.out.println("   " + list[i]);
    } else if (type.equals("Statue")) {
        for (int i = 0; i &lt; numOfItem; i++)
            if (list[i] instanceof Statue) System.out.println("   " + list[i]);
    } else {
        for (int i = 0; i &lt; numOfItem; i++)
            if (list[i] instanceof Painting) System.out.println("   " + list[i]);
    }
}</code></pre>
<pre class="trich"><code class="language-java">public static void displayByType(String type) {
    int count = 0;
    for (int i = 0; i &lt; numOfItem; i++)
        if (list[i].getClass().getSimpleName().equalsIgnoreCase(type.trim())) {
            System.out.println("   " + i + ": " + list[i]);
            count++;
        }
    if (count == 0) System.out.println("   no item of type " + type);
}</code></pre>
<pre class="trich"><code class="language-java">for (String t : new String[] { "Vase", "vase", "Car" }) {
    System.out.println("slide, type \\"" + t + "\\":");
    displayItemsByType(t);
}
for (String t : new String[] { "vase", "Car" }) {
    System.out.println("fixed, type \\"" + t + "\\":");
    displayByType(t);
}</code></pre>
<div class="out">slide, type "Vase":<br>
&nbsp;&nbsp;&nbsp;Vase<br>
&nbsp;&nbsp;&nbsp;Vase<br>
slide, type "vase":<br>
&nbsp;&nbsp;&nbsp;Painting<br>
slide, type "Car":<br>
&nbsp;&nbsp;&nbsp;Painting<br>
fixed, type "vase":<br>
&nbsp;&nbsp;&nbsp;0: Vase<br>
&nbsp;&nbsp;&nbsp;3: Vase<br>
fixed, type "Car":<br>
&nbsp;&nbsp;&nbsp;no item of type Car</div>
<p>The fixed version asks each object its class: <code>getClass().getSimpleName()</code> is "Vase", "Statue" or "Painting", compared without case; one loop instead of three, a fourth subclass works without editing the method, and "no item of type Car" replaces a wrong answer. <code>instanceof</code> is still the right tool when subclasses must count too (<code>x instanceof Item</code> is true for every vase); <code>getClass()</code> matches the exact class only.</p>
<p>Design note: needing <code>instanceof</code> often means a method is missing in the parent. Here it is legitimate — the user asks by type name — but "print the price after tax of each item" should be a method <code>getTaxedPrice()</code> overridden in each subclass, not a chain of <code>instanceof</code>.</p>`,
        `<p class="y-chinh">🎯 <code>displayItemsByType(String type)</code> in mọi món đồ thuộc loại cho trước: nếu type bằng "Vase", in các phần tử <code>instanceof Vase</code>; nếu là "Statue", in các tượng; <code>else</code>, in các tranh.</p>
<p>Nhánh cuối là một <code>else</code> trơn, nên chuỗi <em>nào</em> khác cũng có nghĩa là "Painting" — kể cả "vase" chữ thường và một loại không hề tồn tại:</p>
<pre class="trich"><code class="language-java">public static void displayItemsByType(String type) {
    if (type.equals("Vase")) {
        for (int i = 0; i &lt; numOfItem; i++)
            if (list[i] instanceof Vase) System.out.println("   " + list[i]);
    } else if (type.equals("Statue")) {
        for (int i = 0; i &lt; numOfItem; i++)
            if (list[i] instanceof Statue) System.out.println("   " + list[i]);
    } else {
        for (int i = 0; i &lt; numOfItem; i++)
            if (list[i] instanceof Painting) System.out.println("   " + list[i]);
    }
}</code></pre>
<pre class="trich"><code class="language-java">public static void displayByType(String type) {
    int count = 0;
    for (int i = 0; i &lt; numOfItem; i++)
        if (list[i].getClass().getSimpleName().equalsIgnoreCase(type.trim())) {
            System.out.println("   " + i + ": " + list[i]);
            count++;
        }
    if (count == 0) System.out.println("   no item of type " + type);
}</code></pre>
<pre class="trich"><code class="language-java">for (String t : new String[] { "Vase", "vase", "Car" }) {
    System.out.println("slide, type \\"" + t + "\\":");
    displayItemsByType(t);
}
for (String t : new String[] { "vase", "Car" }) {
    System.out.println("fixed, type \\"" + t + "\\":");
    displayByType(t);
}</code></pre>
<div class="out">slide, type "Vase":<br>
&nbsp;&nbsp;&nbsp;Vase<br>
&nbsp;&nbsp;&nbsp;Vase<br>
slide, type "vase":<br>
&nbsp;&nbsp;&nbsp;Painting<br>
slide, type "Car":<br>
&nbsp;&nbsp;&nbsp;Painting<br>
fixed, type "vase":<br>
&nbsp;&nbsp;&nbsp;0: Vase<br>
&nbsp;&nbsp;&nbsp;3: Vase<br>
fixed, type "Car":<br>
&nbsp;&nbsp;&nbsp;no item of type Car</div>
<p>Bản sửa hỏi chính từng đối tượng lớp của nó: <code>getClass().getSimpleName()</code> là "Vase", "Statue" hay "Painting", so không phân biệt hoa thường; một vòng lặp thay cho ba, thêm lớp con thứ tư vẫn chạy mà không phải sửa phương thức, và "no item of type Car" thay cho một câu trả lời sai. <code>instanceof</code> vẫn là công cụ đúng khi lớp con cũng phải được tính (<code>x instanceof Item</code> là true với mọi chiếc bình); <code>getClass()</code> chỉ khớp đúng lớp.</p>
<p>Ghi chú thiết kế: phải dùng tới <code>instanceof</code> thường nghĩa là lớp cha đang thiếu một phương thức. Ở đây là chính đáng — người dùng hỏi theo tên loại — nhưng "in giá sau thuế của từng món" nên là phương thức <code>getTaxedPrice()</code> được ghi đè ở mỗi lớp con, không phải một chuỗi <code>instanceof</code>.</p>`],
      [14, 'Case study — sortItems',
        `<p class="y-chinh">🎯 <code>sortItems()</code> sorts the items in ascending order of value with two nested loops: <code>i</code> from 0, <code>j</code> from <code>numOfItem-1</code> down to <code>i+1</code>; if <code>list[i].getValue() &lt; list[j-1].getValue()</code>, swap <code>list[j]</code> and <code>list[j-1]</code>.</p>
<p>The idea is <strong>bubble sort</strong> (the FU material says so): the inner loop walks from the end to <code>i</code>, swapping neighbours that are in the wrong order, so the smallest remaining value "bubbles up" to position <code>i</code>. But the slide compares <code>list[i]</code> with <code>list[j-1]</code> and then swaps a <em>different</em> pair, <code>list[j]</code> and <code>list[j-1]</code>. Run on five items:</p>
<pre class="trich"><code class="language-java">class Item implements Comparable&lt;Item&gt; {
    private final int value;
    private final String creator;
    Item(int value, String creator) { this.value = value; this.creator = creator; }
    int getValue() { return value; }
    String getCreator() { return creator; }

    @Override
    public int compareTo(Item o) { return Integer.compare(value, o.value); }   // natural order: by value

    @Override
    public String toString() { return creator + "(" + value + ")"; }
}</code></pre>
<pre class="trich"><code class="language-java">public static void sortItems() {
    for (int i = 0; i &lt; numOfItem; i++)
        for (int j = numOfItem - 1; j &gt; i; j--) {
            if (list[i].getValue() &lt; list[j - 1].getValue()) {
                Item tmp = list[j];
                list[j] = list[j - 1];
                list[j - 1] = tmp;
            }
        }
}</code></pre>
<pre class="trich"><code class="language-java">public static void sortFixed() {
    for (int i = 0; i &lt; numOfItem - 1; i++)
        for (int j = numOfItem - 1; j &gt; i; j--)
            if (list[j].getValue() &lt; list[j - 1].getValue()) {   // compare j with j-1, the pair being swapped
                Item tmp = list[j];
                list[j] = list[j - 1];
                list[j - 1] = tmp;
            }
}</code></pre>
<pre class="trich"><code class="language-java">reset();
System.out.println("before:            " + show());
sortItems();
System.out.println("slide sortItems(): " + show());
reset();
sortFixed();
System.out.println("fixed bubble:      " + show());

reset();
Arrays.sort(list, 0, numOfItem);                        // uses compareTo; only the used part
System.out.println("Arrays.sort(list, 0, n):            " + show());
Arrays.sort(list, 0, numOfItem, new Comparator&lt;Item&gt;() {   // another order without touching Item
    @Override
    public int compare(Item a, Item b) { return a.getCreator().compareToIgnoreCase(b.getCreator()); }
});
System.out.println("by creator (anonymous Comparator): " + show());
Arrays.sort(list, 0, numOfItem, (a, b) -&gt; Integer.compare(b.getValue(), a.getValue()));   // Java 8 lambda: descending
System.out.println("by value desc (lambda):            " + show());
try {
    Arrays.sort(list);                                  // the WHOLE array: 5 nulls at the end
} catch (NullPointerException e) {
    System.out.println("Arrays.sort(list) on 10 slots -&gt; " + e.getClass().getName());
}</code></pre>
<div class="out">before: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Minh(300), Rodin(150), Phai(800), Lang(50), Bat Trang(600)]<br>
slide sortItems(): [Minh(300), Rodin(150), Lang(50), Phai(800), Bat Trang(600)]<br>
fixed bubble: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Lang(50), Rodin(150), Minh(300), Bat Trang(600), Phai(800)]<br>
Arrays.sort(list, 0, n): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Lang(50), Rodin(150), Minh(300), Bat Trang(600), Phai(800)]<br>
by creator (anonymous Comparator): [Bat Trang(600), Lang(50), Minh(300), Phai(800), Rodin(150)]<br>
by value desc (lambda): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Phai(800), Bat Trang(600), Minh(300), Rodin(150), Lang(50)]<br>
Arrays.sort(list) on 10 slots -&gt; java.lang.NullPointerException</div>
<p>The slide's version leaves <code>300, 150, 50, 800, 600</code> — not sorted. Compare the pair you swap: <code>list[j]</code> with <code>list[j-1]</code>. The rest of the output is how you sort in practice: give <code>Item</code> a natural order with <code>Comparable&lt;Item&gt;</code>, then <code>Arrays.sort(list, 0, numOfItem)</code> — <strong>only the used part</strong>; any other order with a <code>Comparator</code>, as an anonymous class or a Java 8 lambda (both run on the exam's JDK 8, lesson 5.A). The last line is the trap: <code>Arrays.sort(list)</code> on the whole array meets the five <code>null</code> slots and throws <code>NullPointerException</code>.</p>
<p class="meo">🧠 Compare numbers with <code>Integer.compare(a, b)</code> / <code>Double.compare(a, b)</code>, not <code>a - b</code>: subtraction can overflow for large ints and loses fractions for doubles cast to int.</p>`,
        `<p class="y-chinh">🎯 <code>sortItems()</code> sắp các món đồ tăng dần theo value bằng hai vòng lặp lồng nhau: <code>i</code> từ 0, <code>j</code> từ <code>numOfItem-1</code> lùi xuống tới <code>i+1</code>; nếu <code>list[i].getValue() &lt; list[j-1].getValue()</code> thì hoán đổi <code>list[j]</code> và <code>list[j-1]</code>.</p>
<p>Ý tưởng là <strong>sắp xếp nổi bọt (bubble sort)</strong> (học liệu FU nói vậy): vòng trong đi từ cuối về <code>i</code>, hoán đổi các cặp kề nhau đang sai thứ tự, nên giá trị nhỏ nhất còn lại "nổi" lên vị trí <code>i</code>. Nhưng slide so sánh <code>list[i]</code> với <code>list[j-1]</code> rồi lại hoán đổi một cặp <em>khác</em>, <code>list[j]</code> và <code>list[j-1]</code>. Chạy trên năm món:</p>
<pre class="trich"><code class="language-java">class Item implements Comparable&lt;Item&gt; {
    private final int value;
    private final String creator;
    Item(int value, String creator) { this.value = value; this.creator = creator; }
    int getValue() { return value; }
    String getCreator() { return creator; }

    @Override
    public int compareTo(Item o) { return Integer.compare(value, o.value); }   // thứ tự tự nhiên: theo value

    @Override
    public String toString() { return creator + "(" + value + ")"; }
}</code></pre>
<pre class="trich"><code class="language-java">public static void sortItems() {
    for (int i = 0; i &lt; numOfItem; i++)
        for (int j = numOfItem - 1; j &gt; i; j--) {
            if (list[i].getValue() &lt; list[j - 1].getValue()) {
                Item tmp = list[j];
                list[j] = list[j - 1];
                list[j - 1] = tmp;
            }
        }
}</code></pre>
<pre class="trich"><code class="language-java">public static void sortFixed() {
    for (int i = 0; i &lt; numOfItem - 1; i++)
        for (int j = numOfItem - 1; j &gt; i; j--)
            if (list[j].getValue() &lt; list[j - 1].getValue()) {   // so sánh j với j-1, đúng cặp đang hoán đổi
                Item tmp = list[j];
                list[j] = list[j - 1];
                list[j - 1] = tmp;
            }
}</code></pre>
<pre class="trich"><code class="language-java">reset();
System.out.println("before:            " + show());
sortItems();
System.out.println("slide sortItems(): " + show());
reset();
sortFixed();
System.out.println("fixed bubble:      " + show());

reset();
Arrays.sort(list, 0, numOfItem);                        // dùng compareTo; chỉ phần đang dùng
System.out.println("Arrays.sort(list, 0, n):            " + show());
Arrays.sort(list, 0, numOfItem, new Comparator&lt;Item&gt;() {   // thứ tự khác mà không sửa Item
    @Override
    public int compare(Item a, Item b) { return a.getCreator().compareToIgnoreCase(b.getCreator()); }
});
System.out.println("by creator (anonymous Comparator): " + show());
Arrays.sort(list, 0, numOfItem, (a, b) -&gt; Integer.compare(b.getValue(), a.getValue()));   // lambda Java 8: giảm dần
System.out.println("by value desc (lambda):            " + show());
try {
    Arrays.sort(list);                                  // CẢ mảng: 5 phần tử null ở cuối
} catch (NullPointerException e) {
    System.out.println("Arrays.sort(list) on 10 slots -&gt; " + e.getClass().getName());
}</code></pre>
<div class="out">before: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Minh(300), Rodin(150), Phai(800), Lang(50), Bat Trang(600)]<br>
slide sortItems(): [Minh(300), Rodin(150), Lang(50), Phai(800), Bat Trang(600)]<br>
fixed bubble: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Lang(50), Rodin(150), Minh(300), Bat Trang(600), Phai(800)]<br>
Arrays.sort(list, 0, n): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Lang(50), Rodin(150), Minh(300), Bat Trang(600), Phai(800)]<br>
by creator (anonymous Comparator): [Bat Trang(600), Lang(50), Minh(300), Phai(800), Rodin(150)]<br>
by value desc (lambda): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Phai(800), Bat Trang(600), Minh(300), Rodin(150), Lang(50)]<br>
Arrays.sort(list) on 10 slots -&gt; java.lang.NullPointerException</div>
<p>Phiên bản của slide để lại <code>300, 150, 50, 800, 600</code> — chưa được sắp. Hãy so sánh đúng cặp bạn hoán đổi: <code>list[j]</code> với <code>list[j-1]</code>. Phần còn lại của output là cách sắp xếp trong thực tế: cho <code>Item</code> một thứ tự tự nhiên bằng <code>Comparable&lt;Item&gt;</code>, rồi <code>Arrays.sort(list, 0, numOfItem)</code> — <strong>chỉ phần đang dùng</strong>; thứ tự khác thì dùng <code>Comparator</code>, dạng lớp ẩn danh hoặc lambda Java 8 (cả hai chạy trên JDK 8 của phòng thi, bài 5.A). Dòng cuối là cái bẫy: <code>Arrays.sort(list)</code> trên cả mảng gặp năm ô <code>null</code> và ném <code>NullPointerException</code>.</p>
<p class="meo">🧠 So sánh số bằng <code>Integer.compare(a, b)</code> / <code>Double.compare(a, b)</code>, đừng dùng <code>a - b</code>: phép trừ có thể tràn số với int lớn và mất phần lẻ với double ép sang int.</p>`],
      [15, 'Case study — public class antiqueShop',
        `<p class="y-chinh">🎯 <code>public class antiqueShop</code> with <code>main</code>: one <code>Scanner sc</code>, <code>int choice=0</code>, a <code>do</code> loop printing ten options (1–3 add a vase/statue/painting, 4 display all, 5 find by creator, 6 update by index, 7 remove by index, 8 display vases, 9 sort, 10 exit), then <code>choice=sc.nextInt()</code> and <code>switch(choice)</code>.</p>
<p>The class name starts with a lowercase letter: legal (the file must then be <code>antiqueShop.java</code>), but every Java convention and every PE marker expects <code>AntiqueShop</code>. The real problem is <code>sc.nextInt()</code> followed by any <code>nextLine()</code> — which is what an <code>input()</code> method uses to read a name. With the input "1 ↵ Minh Long ↵":</p>
<pre><code class="language-java">// release: 8
// Slides 15-16: choice = sc.nextInt() followed by a nextLine() read — the empty-string trap of the slide's menu, and the crash on "abc"
import java.util.InputMismatchException;
import java.util.Scanner;

public class NextIntNextLine {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("input your choice:");
        int choice = sc.nextInt();                  // reads "1" — the Enter after it stays in the input
        System.out.print("creator: ");
        String creator = sc.nextLine();             // reads the rest of THAT line: ""
        System.out.println("[" + creator + "]  &lt;- choice " + choice + ", creator is empty");
        System.out.println("input your choice:");
        try {
            choice = sc.nextInt();                  // the next token is "Minh"
        } catch (InputMismatchException e) {
            System.out.println("nextInt() on \\"" + sc.next() + "\\" -&gt; " + e.getClass().getName());
        }
    }
}</code></pre>
<div class="out">input your choice:<br>
creator: [] &nbsp;&lt;- choice 1, creator is empty<br>
input your choice:<br>
nextInt() on "Minh" -&gt; java.util.InputMismatchException</div>
<p><code>nextInt()</code> reads the digits and stops <strong>before</strong> the Enter; the following <code>nextLine()</code> returns the rest of that same line — an empty string — so the creator is stored as "" without the user typing anything. And "Minh Long" is then still waiting, so the next <code>nextInt()</code> throws <code>InputMismatchException</code>; with no try-catch the menu crashes. The cure is the one of 6.A: read every line with <code>nextLine()</code> and convert with <code>Integer.parseInt</code> inside a retry loop — exactly <code>Inputter.readInt</code>, used for the choice in the corrected main.</p>
<p>Also note that the slide's menu header says "8. display the list of vase items" while the method takes any type — the corrected program asks for the type.</p>`,
        `<p class="y-chinh">🎯 <code>public class antiqueShop</code> có <code>main</code>: một <code>Scanner sc</code>, <code>int choice=0</code>, vòng <code>do</code> in mười lựa chọn (1–3 thêm bình/tượng/tranh, 4 hiện tất cả, 5 tìm theo người làm, 6 sửa theo chỉ số, 7 xoá theo chỉ số, 8 hiện các bình, 9 sắp xếp, 10 thoát), rồi <code>choice=sc.nextInt()</code> và <code>switch(choice)</code>.</p>
<p>Tên lớp bắt đầu bằng chữ thường: hợp lệ (khi đó file phải là <code>antiqueShop.java</code>), nhưng mọi quy ước Java và mọi người chấm PE đều chờ <code>AntiqueShop</code>. Vấn đề thật là <code>sc.nextInt()</code> rồi tới bất kỳ <code>nextLine()</code> nào — thứ mà một phương thức <code>input()</code> dùng để đọc tên. Với dữ liệu "1 ↵ Minh Long ↵":</p>
<pre><code class="language-java">// release: 8
// Slide 15-16: choice = sc.nextInt() rồi đọc bằng nextLine() — bẫy chuỗi rỗng của menu trên slide, và cú sập khi gõ "abc"
import java.util.InputMismatchException;
import java.util.Scanner;

public class NextIntNextLine {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("input your choice:");
        int choice = sc.nextInt();                  // đọc "1" — phím Enter sau nó còn nằm lại
        System.out.print("creator: ");
        String creator = sc.nextLine();             // đọc phần còn lại của CHÍNH dòng đó: ""
        System.out.println("[" + creator + "]  &lt;- choice " + choice + ", creator is empty");
        System.out.println("input your choice:");
        try {
            choice = sc.nextInt();                  // token kế tiếp là "Minh"
        } catch (InputMismatchException e) {
            System.out.println("nextInt() on \\"" + sc.next() + "\\" -&gt; " + e.getClass().getName());
        }
    }
}</code></pre>
<div class="out">input your choice:<br>
creator: [] &nbsp;&lt;- choice 1, creator is empty<br>
input your choice:<br>
nextInt() on "Minh" -&gt; java.util.InputMismatchException</div>
<p><code>nextInt()</code> đọc các chữ số và dừng <strong>trước</strong> phím Enter; lời gọi <code>nextLine()</code> ngay sau trả về phần còn lại của chính dòng đó — một chuỗi rỗng — nên creator bị lưu là "" mà người dùng chưa gõ gì. Và "Minh Long" khi đó vẫn đang chờ, nên lần <code>nextInt()</code> tiếp theo ném <code>InputMismatchException</code>; không có try-catch thì menu sập. Cách chữa là cách của 6.A: đọc mọi dòng bằng <code>nextLine()</code> và đổi bằng <code>Integer.parseInt</code> trong một vòng hỏi lại — đúng là <code>Inputter.readInt</code>, được dùng cho lựa chọn menu trong main đã sửa.</p>
<p>Để ý thêm: dòng menu của slide ghi "8. display the list of vase items" trong khi phương thức nhận loại bất kỳ — chương trình đã sửa hỏi người dùng loại nào.</p>`],
      [16, 'Case study — case 1 and the end of main',
        `<p class="y-chinh">🎯 <code>case 1:</code> <code>Item tmp = new Vase(); tmp.input(); if (obj.addItem(tmp)) System.out.println("added"); break;</code> — cases 2, 3, … are "….."; the switch ends, the loop repeats <code>while (choice &lt;= 9)</code>, and the class ends.</p>
<p>Typed as shown (keeping case 1, since the others are dots), the slide's main fails twice:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Item.java",
        "public class Item {",
        "    protected int value; protected String creator;",
        "    public int getValue() { return value; }",
        "    public String getCreator() { return creator; }",
        "    public void input() { }",
        "}");
    System.out.println("== slides 15-16: the menu, keeping only case 1 (the slide writes \\"....\\" for the rest) ==");
    viet(d, "antiqueShop.java",
        "import java.util.Scanner;",
        "public class antiqueShop{",
        "    public static void main(String[] args){",
        "        Scanner sc=new Scanner(System.in);",
        "        int choice=0;",
        "        do{",
        "            System.out.println(\\"1. add a new vase\\");",
        "            System.out.println(\\"10. exit\\");",
        "            System.out.println(\\"input your choice:\\");",
        "            choice=sc.nextInt();",
        "            switch(choice){",
        "            case 1:",
        "                Item tmp=new Item();",
        "                tmp.input();",
        "                if(obj.addItem(tmp)){",
        "                    System.out.println(\\"added\\");",
        "                }",
        "                break;",
        "            }//end switch",
        "        } while(choice&lt;=9);          //end while",
        "    }  //end class");
    lenh(d, "javac", "antiqueShop.java");
    System.out.println("== closing brace added ==");
    viet(d, "antiqueShop.java",
        "import java.util.Scanner;",
        "public class antiqueShop{",
        "    public static void main(String[] args){",
        "        Scanner sc=new Scanner(System.in);",
        "        int choice=0;",
        "        do{",
        "            System.out.println(\\"input your choice:\\");",
        "            choice=sc.nextInt();",
        "            switch(choice){",
        "            case 1:",
        "                Item tmp=new Item();",
        "                tmp.input();",
        "                if(obj.addItem(tmp)){",
        "                    System.out.println(\\"added\\");",
        "                }",
        "                break;",
        "            }//end switch",
        "        } while(choice&lt;=9);          //end while",
        "    }",
        "}  //end class");
    lenh(d, "javac", "antiqueShop.java");
}</code></pre>
<div class="out">== slides 15-16: the menu, keeping only case 1 (the slide writes "...." for the rest) ==<br>
&gt; javac antiqueShop.java<br>
antiqueShop.java:21: error: reached end of file while parsing<br>
&nbsp;&nbsp;&nbsp;&nbsp;} &nbsp;//end class<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== closing brace added ==<br>
&gt; javac antiqueShop.java<br>
antiqueShop.java:13: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(obj.addItem(tmp)){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable obj<br>
&nbsp;&nbsp;location: class antiqueShop<br>
1 error<br>
(exit code 1)</div>
<p>The comments <code>}//end switch</code>, <code>} while…//end while</code>, <code>} //end class</code> account for only three of the four open blocks — <code>main</code>'s closing brace is missing. And <code>obj</code> is used but never declared: <code>ItemList obj = new ItemList();</code> must come before the loop (the FU material has it). Two more silent issues: <code>while (choice &lt;= 9)</code> also exits on 11 or 99; and if cases 2 and 3 declare <code>Item tmp</code> again in the same switch block, javac says "variable tmp is already defined" — one switch is one scope.</p>
<p>The complete, corrected program — all classes of slides 5–14 above, plus this main — run with input that contains mistakes on purpose (a height of 2500, a value of -5, an empty creator, "abc" as a value), then every menu option:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    ItemList obj = new ItemList();                            // the slide's main uses obj without declaring it
    int choice;
    do {
        System.out.println("1.add vase 2.add statue 3.add painting 4.display 5.find by creator");
        System.out.println("6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit");
        choice = Inputter.readInt("input your choice: ", 1, 10);
        switch (choice) {
            case 1: case 2: case 3:
                Item tmp = choice == 1 ? new Vase() : choice == 2 ? new Statue() : new Painting();
                tmp.input();                                  // dynamic binding: Vase.input(), Statue.input()...
                System.out.println(obj.addItem(tmp) ? "added" : "the list is full");
                break;
            case 4:
                obj.displayAll();
                break;
            case 5:
                Item found = obj.findItem(Inputter.readLine("creator: "));
                System.out.println(found == null ? "not found" : "found " + found);
                break;
            case 6:
                if (!obj.updateItem(Inputter.readInt("index: ", 0, 99))) System.out.println("no item at that index");
                break;
            case 7:
                System.out.println(obj.removeItem(Inputter.readInt("index: ", 0, 99)) ? "removed" : "no item at that index");
                break;
            case 8:
                obj.displayItemsByType(Inputter.readLine("type: "));
                break;
            case 9:
                obj.sortItems();
                obj.displayAll();
                break;
        }
    } while (choice != 10);
    System.out.println("bye");
}</code></pre>
<div class="out">1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 1<br>
&nbsp;&nbsp;value: 300<br>
&nbsp;&nbsp;creator: Minh Long<br>
&nbsp;&nbsp;height: 2500<br>
&nbsp;&nbsp;must be in 0..2000<br>
&nbsp;&nbsp;height: 1200<br>
&nbsp;&nbsp;material: glazed porcelain<br>
added<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 2<br>
&nbsp;&nbsp;value: -5<br>
&nbsp;&nbsp;must be in 0..1000000<br>
&nbsp;&nbsp;value: 150<br>
&nbsp;&nbsp;creator:<br>
&nbsp;&nbsp;must not be empty<br>
&nbsp;&nbsp;creator: Rodin<br>
&nbsp;&nbsp;weight: 900<br>
&nbsp;&nbsp;colour: bronze<br>
added<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 3<br>
&nbsp;&nbsp;value: abc<br>
&nbsp;&nbsp;not an integer<br>
&nbsp;&nbsp;value: 800<br>
&nbsp;&nbsp;creator: Bui Xuan Phai<br>
&nbsp;&nbsp;height: 600<br>
&nbsp;&nbsp;width: 900<br>
&nbsp;&nbsp;watercolour (y/n): n<br>
&nbsp;&nbsp;framed (y/n): y<br>
added<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 1<br>
&nbsp;&nbsp;value: 50<br>
&nbsp;&nbsp;creator: Minh Long<br>
&nbsp;&nbsp;height: 40<br>
&nbsp;&nbsp;material: clay<br>
added<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 4<br>
0: Vase[value=300, creator=Minh Long, height=1200, material=glazed porcelain]<br>
1: Statue[value=150, creator=Rodin, weight=900, colour=bronze]<br>
2: Painting[value=800, creator=Bui Xuan Phai, 600x900, oil, framed]<br>
3: Vase[value=50, creator=Minh Long, height=40, material=clay]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 5<br>
creator: rodin<br>
found Statue[value=150, creator=Rodin, weight=900, colour=bronze]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 8<br>
type: vase<br>
0: Vase[value=300, creator=Minh Long, height=1200, material=glazed porcelain]<br>
3: Vase[value=50, creator=Minh Long, height=40, material=clay]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 8<br>
type: Car<br>
no item of type Car<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 7<br>
index: 0<br>
removed<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 4<br>
0: Statue[value=150, creator=Rodin, weight=900, colour=bronze]<br>
1: Painting[value=800, creator=Bui Xuan Phai, 600x900, oil, framed]<br>
2: Vase[value=50, creator=Minh Long, height=40, material=clay]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 6<br>
index: 0<br>
&nbsp;&nbsp;value: 120<br>
&nbsp;&nbsp;creator: Phu Lang<br>
&nbsp;&nbsp;weight: 35<br>
&nbsp;&nbsp;colour: terracotta<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 9<br>
0: Vase[value=50, creator=Minh Long, height=40, material=clay]<br>
1: Statue[value=120, creator=Phu Lang, weight=35, colour=terracotta]<br>
2: Painting[value=800, creator=Bui Xuan Phai, 600x900, oil, framed]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 10<br>
bye</div>
<p>Read the run as a test report: every bad value was asked again with a reason; "rodin" found Rodin; "vase" listed both vases and "Car" listed nothing; removing index 0 shifted the others up; updating index 0 re-ran <code>Statue.input()</code>; sorting gave 50, 120, 800. This is the level a LAB211 reviewer expects.</p>
<div class="callout">🧭 <strong>Go further — LAB211, Chapter 8, PRJ301</strong>: LAB211's first assignments are this program with your own entity (students, products) — plus "ID unique", "ID format", "search by part of name". Chapter 8 replaces <code>Item[]</code> + <code>numOfItem</code> with <code>ArrayList&lt;Item&gt;</code> (add, remove, size, sort built in). In PRJ301 the same operations become SQL — INSERT, SELECT … WHERE, UPDATE, DELETE, ORDER BY — called from a DAO class shaped exactly like ItemList.</div>`,
        `<p class="y-chinh">🎯 <code>case 1:</code> <code>Item tmp = new Vase(); tmp.input(); if (obj.addItem(tmp)) System.out.println("added"); break;</code> — case 2, 3, … là "….."; switch kết thúc, vòng lặp lặp lại <code>while (choice &lt;= 9)</code>, và lớp kết thúc.</p>
<p>Gõ đúng như vậy (giữ case 1, vì các case kia chỉ là dấu chấm), main của slide hỏng hai lần:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Item.java",
        "public class Item {",
        "    protected int value; protected String creator;",
        "    public int getValue() { return value; }",
        "    public String getCreator() { return creator; }",
        "    public void input() { }",
        "}");
    System.out.println("== slides 15-16: the menu, keeping only case 1 (the slide writes \\"....\\" for the rest) ==");
    viet(d, "antiqueShop.java",
        "import java.util.Scanner;",
        "public class antiqueShop{",
        "    public static void main(String[] args){",
        "        Scanner sc=new Scanner(System.in);",
        "        int choice=0;",
        "        do{",
        "            System.out.println(\\"1. add a new vase\\");",
        "            System.out.println(\\"10. exit\\");",
        "            System.out.println(\\"input your choice:\\");",
        "            choice=sc.nextInt();",
        "            switch(choice){",
        "            case 1:",
        "                Item tmp=new Item();",
        "                tmp.input();",
        "                if(obj.addItem(tmp)){",
        "                    System.out.println(\\"added\\");",
        "                }",
        "                break;",
        "            }//end switch",
        "        } while(choice&lt;=9);          //end while",
        "    }  //end class");
    lenh(d, "javac", "antiqueShop.java");
    System.out.println("== closing brace added ==");
    viet(d, "antiqueShop.java",
        "import java.util.Scanner;",
        "public class antiqueShop{",
        "    public static void main(String[] args){",
        "        Scanner sc=new Scanner(System.in);",
        "        int choice=0;",
        "        do{",
        "            System.out.println(\\"input your choice:\\");",
        "            choice=sc.nextInt();",
        "            switch(choice){",
        "            case 1:",
        "                Item tmp=new Item();",
        "                tmp.input();",
        "                if(obj.addItem(tmp)){",
        "                    System.out.println(\\"added\\");",
        "                }",
        "                break;",
        "            }//end switch",
        "        } while(choice&lt;=9);          //end while",
        "    }",
        "}  //end class");
    lenh(d, "javac", "antiqueShop.java");
}</code></pre>
<div class="out">== slides 15-16: the menu, keeping only case 1 (the slide writes "...." for the rest) ==<br>
&gt; javac antiqueShop.java<br>
antiqueShop.java:21: error: reached end of file while parsing<br>
&nbsp;&nbsp;&nbsp;&nbsp;} &nbsp;//end class<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== closing brace added ==<br>
&gt; javac antiqueShop.java<br>
antiqueShop.java:13: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(obj.addItem(tmp)){<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable obj<br>
&nbsp;&nbsp;location: class antiqueShop<br>
1 error<br>
(exit code 1)</div>
<p>Các chú thích <code>}//end switch</code>, <code>} while…//end while</code>, <code>} //end class</code> chỉ đóng ba trong bốn khối đã mở — thiếu ngoặc đóng của <code>main</code>. Và <code>obj</code> được dùng mà chưa hề khai báo: <code>ItemList obj = new ItemList();</code> phải nằm trước vòng lặp (học liệu FU có dòng này). Thêm hai vấn đề âm thầm: <code>while (choice &lt;= 9)</code> cũng thoát khi gõ 11 hay 99; và nếu case 2, 3 lại khai báo <code>Item tmp</code> trong cùng khối switch, javac báo "variable tmp is already defined" (biến tmp đã được định nghĩa) — một switch là một phạm vi.</p>
<p>Chương trình hoàn chỉnh đã sửa — mọi lớp của slide 5–14 ở trên, cộng main này — chạy với dữ liệu cố ý có lỗi (height 2500, value -5, creator rỗng, "abc" ở chỗ value), rồi đi qua mọi lựa chọn menu:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    ItemList obj = new ItemList();                            // main của slide dùng obj mà không khai báo
    int choice;
    do {
        System.out.println("1.add vase 2.add statue 3.add painting 4.display 5.find by creator");
        System.out.println("6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit");
        choice = Inputter.readInt("input your choice: ", 1, 10);
        switch (choice) {
            case 1: case 2: case 3:
                Item tmp = choice == 1 ? new Vase() : choice == 2 ? new Statue() : new Painting();
                tmp.input();                                  // ràng buộc động: Vase.input(), Statue.input()...
                System.out.println(obj.addItem(tmp) ? "added" : "the list is full");
                break;
            case 4:
                obj.displayAll();
                break;
            case 5:
                Item found = obj.findItem(Inputter.readLine("creator: "));
                System.out.println(found == null ? "not found" : "found " + found);
                break;
            case 6:
                if (!obj.updateItem(Inputter.readInt("index: ", 0, 99))) System.out.println("no item at that index");
                break;
            case 7:
                System.out.println(obj.removeItem(Inputter.readInt("index: ", 0, 99)) ? "removed" : "no item at that index");
                break;
            case 8:
                obj.displayItemsByType(Inputter.readLine("type: "));
                break;
            case 9:
                obj.sortItems();
                obj.displayAll();
                break;
        }
    } while (choice != 10);
    System.out.println("bye");
}</code></pre>
<div class="out">1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 1<br>
&nbsp;&nbsp;value: 300<br>
&nbsp;&nbsp;creator: Minh Long<br>
&nbsp;&nbsp;height: 2500<br>
&nbsp;&nbsp;must be in 0..2000<br>
&nbsp;&nbsp;height: 1200<br>
&nbsp;&nbsp;material: glazed porcelain<br>
added<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 2<br>
&nbsp;&nbsp;value: -5<br>
&nbsp;&nbsp;must be in 0..1000000<br>
&nbsp;&nbsp;value: 150<br>
&nbsp;&nbsp;creator:<br>
&nbsp;&nbsp;must not be empty<br>
&nbsp;&nbsp;creator: Rodin<br>
&nbsp;&nbsp;weight: 900<br>
&nbsp;&nbsp;colour: bronze<br>
added<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 3<br>
&nbsp;&nbsp;value: abc<br>
&nbsp;&nbsp;not an integer<br>
&nbsp;&nbsp;value: 800<br>
&nbsp;&nbsp;creator: Bui Xuan Phai<br>
&nbsp;&nbsp;height: 600<br>
&nbsp;&nbsp;width: 900<br>
&nbsp;&nbsp;watercolour (y/n): n<br>
&nbsp;&nbsp;framed (y/n): y<br>
added<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 1<br>
&nbsp;&nbsp;value: 50<br>
&nbsp;&nbsp;creator: Minh Long<br>
&nbsp;&nbsp;height: 40<br>
&nbsp;&nbsp;material: clay<br>
added<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 4<br>
0: Vase[value=300, creator=Minh Long, height=1200, material=glazed porcelain]<br>
1: Statue[value=150, creator=Rodin, weight=900, colour=bronze]<br>
2: Painting[value=800, creator=Bui Xuan Phai, 600x900, oil, framed]<br>
3: Vase[value=50, creator=Minh Long, height=40, material=clay]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 5<br>
creator: rodin<br>
found Statue[value=150, creator=Rodin, weight=900, colour=bronze]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 8<br>
type: vase<br>
0: Vase[value=300, creator=Minh Long, height=1200, material=glazed porcelain]<br>
3: Vase[value=50, creator=Minh Long, height=40, material=clay]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 8<br>
type: Car<br>
no item of type Car<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 7<br>
index: 0<br>
removed<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 4<br>
0: Statue[value=150, creator=Rodin, weight=900, colour=bronze]<br>
1: Painting[value=800, creator=Bui Xuan Phai, 600x900, oil, framed]<br>
2: Vase[value=50, creator=Minh Long, height=40, material=clay]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 6<br>
index: 0<br>
&nbsp;&nbsp;value: 120<br>
&nbsp;&nbsp;creator: Phu Lang<br>
&nbsp;&nbsp;weight: 35<br>
&nbsp;&nbsp;colour: terracotta<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 9<br>
0: Vase[value=50, creator=Minh Long, height=40, material=clay]<br>
1: Statue[value=120, creator=Phu Lang, weight=35, colour=terracotta]<br>
2: Painting[value=800, creator=Bui Xuan Phai, 600x900, oil, framed]<br>
1.add vase 2.add statue 3.add painting 4.display 5.find by creator<br>
6.update by index 7.remove by index 8.display by type 9.sort by value 10.exit<br>
input your choice: 10<br>
bye</div>
<p>Đọc lần chạy như một báo cáo kiểm thử: mọi giá trị sai đều bị hỏi lại kèm lý do; "rodin" tìm thấy Rodin; "vase" liệt kê cả hai chiếc bình còn "Car" không liệt kê gì; xoá chỉ số 0 làm các món còn lại dời lên; sửa chỉ số 0 chạy lại <code>Statue.input()</code>; sắp xếp cho ra 50, 120, 800. Đây là mức mà người chấm LAB211 chờ đợi.</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211, Chương 8, PRJ301</strong>: các bài đầu của LAB211 chính là chương trình này với thực thể của bạn (sinh viên, sản phẩm) — thêm "ID không trùng", "ID đúng định dạng", "tìm theo một phần tên". Chương 8 thay <code>Item[]</code> + <code>numOfItem</code> bằng <code>ArrayList&lt;Item&gt;</code> (thêm, xoá, size, sắp xếp có sẵn). Ở PRJ301 cũng những thao tác đó trở thành SQL — INSERT, SELECT … WHERE, UPDATE, DELETE, ORDER BY — được gọi từ một lớp DAO có hình dạng y như ItemList.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li><code>Item[] list = new Item[50];</code> — how many <code>Item</code> objects exist after this line? What does <code>list[7].getValue()</code> do?</li>
<li>Write the loop of <code>removeItem(index)</code> so that it works when the array is full, and say what the last statement must do and why.</li>
<li>A menu reads the choice with <code>sc.nextInt()</code> and then the name with <code>sc.nextLine()</code>. What name is stored, and what are two ways to fix it?</li>
</ul>
<p>Next: the 🧪 practice of Chapter 7 (insert at an index, a PE question 3 on a list, sort and search, a LAB211 product manager with ID rules, removing while looping, output predictions), then the quiz.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li><code>Item[] list = new Item[50];</code> — sau dòng này có bao nhiêu đối tượng <code>Item</code>? <code>list[7].getValue()</code> làm gì?</li>
<li>Viết vòng lặp của <code>removeItem(index)</code> sao cho chạy đúng khi mảng đầy, và cho biết câu lệnh cuối phải làm gì, vì sao.</li>
<li>Một menu đọc lựa chọn bằng <code>sc.nextInt()</code> rồi đọc tên bằng <code>sc.nextLine()</code>. Tên nào được lưu, và có hai cách sửa nào?</li>
</ul>
<p>Tiếp theo: bài 🧪 thực hành Chương 7 (chèn tại chỉ số, câu 3 đề PE trên danh sách, sắp xếp và tìm kiếm, chương trình quản lý sản phẩm kiểu LAB211 với luật ID, xoá khi đang lặp, đoán output), rồi quiz.</p>`),
    books([
      ['fuOffline', 'part "Array of Objects" — the antique shop: ItemList, addItem, displayAll, findItem, findItemIndex, updateItem, removeItem, displayItemsByType, sortItems, with memory figures', 'phần "Array of Objects" — cửa hàng đồ cổ: ItemList, addItem, displayAll, findItem, findItemIndex, updateItem, removeItem, displayItemsByType, sortItems, kèm hình bộ nhớ'],
      ['horstmann1', 'Ch. 3.10 "Arrays" (arrays of objects, Arrays.sort, Arrays.copyOf), 5.1.10 "Protected Access", 6.1.1 "The Interface Concept" (Comparable and sorting objects)', 'Chương 3.10 "Arrays" (mảng đối tượng, Arrays.sort, Arrays.copyOf), 5.1.10 "Protected Access", 6.1.1 "The Interface Concept" (Comparable và sắp xếp đối tượng)'],
      ['javaTutorial', '"Arrays" (Language Basics), "Object Ordering" (Comparable, Comparator)', '"Arrays" (Language Basics), "Object Ordering" (Comparable, Comparator)'],
      ['jls8', '§10 Arrays (§10.3 array creation: components are initialised to null), §15.20.2 instanceof', '§10 Arrays (§10.3 tạo mảng: phần tử được khởi tạo null), §15.20.2 instanceof'],
    ]),
  ].join('\n'),
};

/* ───────── 7.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Arrays of objects the PE way: CRUD, PE Q3, a LAB211 manager ───────── */
const L_on_ch7 = {
  title: '7.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Arrays of objects the PE way: CRUD, PE Q3, a LAB211 manager|||7.2 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Mảng đối tượng kiểu PE: CRUD, câu 3 PE, quản lý LAB211',
  slug: 'pro192-on-ch7',
  type: 'VIDEO',
  description: '6 bài tập Chương 7 có lời giải chạy thật trên JDK 8: đủ năm thao tác trên mảng dùng một phần kể cả chèn tại chỉ số (thứ slide không viết), một câu 3 đề PE với interface cho sẵn trên List thô (tìm lớn nhất, sắp xếp hai khoá, xoá tại chỗ), năm cách xoá khi đang lặp được đo thật (bỏ sót, ConcurrentModificationException, lặp ngược, Iterator.remove, removeIf), chương trình Product Manager kiểu LAB211 với ID dạng P000 không trùng chạy với dữ liệu có lỗi, sáu câu đoán output về mảng đối tượng, và báo cáo thống kê trên mảng đa hình; 14 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.2 · Practice &amp; review</span>
<h2>Arrays of objects — the shape of PE question 3 and of every LAB211 program</h2>
<p class="lead">Lesson 7.A corrected the school's antique shop line by line. Now the exam shapes. In the classic PE, question 3 hands you a class and an interface on a <code>List</code> and asks for three operations — find, sort, remove (Exam Room PE6, PE10, PE14); LAB211's first assignments are a menu over an array or list of your own objects with format and uniqueness rules; the FE asks what an array of objects really contains. Six exercises, each run for real on JDK 8.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Exam link</th></tr></thead>
<tbody>
<tr><td>1</td><td>the five operations of slide 2, including insert at an index</td><td>CSD201 foundations, LAB211</td></tr>
<tr><td>2</td><td>PE question 3: a given interface on a raw List — f1 find, f2 sort, f3 remove</td><td>PE6, PE10, PE14</td></tr>
<tr><td>3</td><td>removing while looping: five loops measured</td><td>PE "remove all elements that…"</td></tr>
<tr><td>4</td><td>a LAB211 product manager: ID format, unique ID, search, sort, update, remove</td><td>LAB211</td></tr>
<tr><td>5</td><td>predict six outputs: null slots, shared references, copies, ==</td><td>FE "what is printed?"</td></tr>
<tr><td>6</td><td>one-pass reports over a polymorphic array</td><td>PE aggregates, interviews</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.2 · Thực hành &amp; ôn tập</span>
<h2>Mảng đối tượng — hình dạng của câu 3 đề PE và của mọi chương trình LAB211</h2>
<p class="lead">Bài 7.A đã sửa từng dòng cửa hàng đồ cổ của trường. Giờ là các dạng đề. Trong đề PE kiểu cũ, câu 3 đưa sẵn một lớp và một interface trên <code>List</code> rồi hỏi ba thao tác — tìm, sắp xếp, xoá (Exam Room PE6, PE10, PE14); các bài đầu của LAB211 là một menu trên mảng hoặc danh sách đối tượng của chính bạn, kèm luật định dạng và không trùng; đề FE hỏi một mảng đối tượng thật ra chứa gì. Sáu bài tập, bài nào cũng chạy thật trên JDK 8.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Liên hệ đề thi</th></tr></thead>
<tbody>
<tr><td>1</td><td>năm thao tác của slide 2, kể cả chèn tại chỉ số</td><td>nền cho CSD201, LAB211</td></tr>
<tr><td>2</td><td>câu 3 đề PE: interface cho sẵn trên List thô — f1 tìm, f2 sắp xếp, f3 xoá</td><td>PE6, PE10, PE14</td></tr>
<tr><td>3</td><td>xoá khi đang lặp: đo thật năm vòng lặp</td><td>PE "xoá mọi phần tử mà…"</td></tr>
<tr><td>4</td><td>chương trình quản lý sản phẩm LAB211: định dạng ID, ID không trùng, tìm, sắp xếp, sửa, xoá</td><td>LAB211</td></tr>
<tr><td>5</td><td>đoán sáu output: ô null, tham chiếu dùng chung, bản sao, ==</td><td>FE "in ra gì?"</td></tr>
<tr><td>6</td><td>báo cáo một lượt trên mảng đa hình</td><td>phép tổng hợp trong PE, phỏng vấn</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — All five operations on a partly filled array, including "add at the given index" (~30 min)</h3>
<p>Slide 2 promises "adds an object at the given index", but <code>addItem</code> only appends. Write <code>StudentArray</code> (capacity fixed at creation, a <code>count</code>) with <code>indexOf(id)</code> (case-insensitive, -1 if absent), <code>add(s)</code>, <code>insertAt(index, s)</code> (0..count; rejects null, full list, bad index, duplicate id — returning a message), <code>removeAt(index)</code> (returns the removed object or null), <code>get(index)</code> and <code>updateGpa(id, gpa)</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/20b5e4e13d664efb47c347ab1b127c6ecb731b2d.svg" alt="Exercise 1: inserting moves the tail one step right, starting from the END" loading="lazy" /><p class="chu-thich">🧩 Exercise 1: inserting moves the tail one step right, starting from the END</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — insertAt(2, HE04): shift RIGHT from the end, then write the gap
' Moving from the end keeps every element; moving from the front would copy a[2] into every slot
map "before (count = 3)" as B {
  [0] =&gt; HE03
  [1] =&gt; HE01
  [2] =&gt; HE02
  [3] =&gt; null
  [4] =&gt; null
}
map "after (count = 4)" as F {
  [0] =&gt; HE03
  [1] =&gt; HE01
  [2] =&gt; HE04 (inserted)
  [3] =&gt; HE02 (moved from 2)
  [4] =&gt; null
}
B -right-&gt; F : j = count down to k+1 (here only j = 3):  a[3] = a[2];  then a[2] = s
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Student {
    private final String id;
    private String name;
    private double gpa;

    Student(String id, String name, double gpa) { this.id = id; this.name = name; this.gpa = gpa; }
    String getId() { return id; }
    double getGpa() { return gpa; }
    void setGpa(double gpa) { this.gpa = gpa; }

    @Override
    public String toString() { return id + "(" + gpa + ")"; }
}</code></pre>
<pre class="trich"><code class="language-java">class StudentArray {
    private final Student[] a;
    private int count;

    StudentArray(int capacity) { a = new Student[capacity]; }

    int indexOf(String id) {                                      // search by value: -1 when absent
        for (int i = 0; i &lt; count; i++) if (a[i].getId().equalsIgnoreCase(id)) return i;
        return -1;
    }

    String add(Student s) {                                       // add at the end
        return insertAt(count, s);
    }

    String insertAt(int index, Student s) {                       // add at the given index: shift RIGHT, from the end
        if (s == null) return "rejected: null";
        if (count == a.length) return "rejected: full";
        if (index &lt; 0 || index &gt; count) return "rejected: index " + index + " not in 0.." + count;
        if (indexOf(s.getId()) &gt;= 0) return "rejected: duplicate " + s.getId();
        for (int j = count; j &gt; index; j--) a[j] = a[j - 1];      // from the end, or every element becomes a copy of a[index]
        a[index] = s;
        count++;
        return "added at " + index;
    }

    Student removeAt(int index) {                                 // delete at the given index: shift LEFT
        if (index &lt; 0 || index &gt;= count) return null;
        Student removed = a[index];
        for (int j = index; j &lt; count - 1; j++) a[j] = a[j + 1];
        a[--count] = null;
        return removed;
    }

    Student get(int index) {                                      // search by index
        return index &gt;= 0 &amp;&amp; index &lt; count ? a[index] : null;
    }

    boolean updateGpa(String id, double gpa) {                    // update the object found
        int i = indexOf(id);
        if (i &lt; 0) return false;
        a[i].setGpa(gpa);
        return true;
    }

    @Override
    public String toString() { return count + "/" + a.length + " " + Arrays.toString(a); }
}</code></pre>
<pre class="trich"><code class="language-java">StudentArray list = new StudentArray(5);
System.out.println(list.add(new Student("HE01", "An", 8)) + "  " + list);
System.out.println(list.add(new Student("HE02", "Binh", 7)) + "  " + list);
System.out.println(list.insertAt(0, new Student("HE03", "Chi", 9)) + "  " + list);
System.out.println(list.insertAt(2, new Student("HE04", "Dung", 6)) + "  " + list);
System.out.println(list.insertAt(9, new Student("HE05", "Em", 5)));
System.out.println(list.add(new Student("he02", "Binh again", 5)));
System.out.println(list.add(new Student("HE05", "Em", 5)) + "  " + list);
System.out.println(list.add(new Student("HE06", "Giang", 4)));
System.out.println("get(1) = " + list.get(1) + ", get(7) = " + list.get(7));
System.out.println("removeAt(1) -&gt; " + list.removeAt(1) + "  " + list);
System.out.println("updateGpa(HE04, 7.5) -&gt; " + list.updateGpa("HE04", 7.5) + "  " + list);
System.out.println("removeAt(4) -&gt; " + list.removeAt(4));</code></pre>
<div class="out">added at 0 &nbsp;1/5 [HE01(8.0), null, null, null, null]<br>
added at 1 &nbsp;2/5 [HE01(8.0), HE02(7.0), null, null, null]<br>
added at 0 &nbsp;3/5 [HE03(9.0), HE01(8.0), HE02(7.0), null, null]<br>
added at 2 &nbsp;4/5 [HE03(9.0), HE01(8.0), HE04(6.0), HE02(7.0), null]<br>
rejected: index 9 not in 0..4<br>
rejected: duplicate he02<br>
added at 4 &nbsp;5/5 [HE03(9.0), HE01(8.0), HE04(6.0), HE02(7.0), HE05(5.0)]<br>
rejected: full<br>
get(1) = HE01(8.0), get(7) = null<br>
removeAt(1) -&gt; HE01(8.0) &nbsp;4/5 [HE03(9.0), HE04(6.0), HE02(7.0), HE05(5.0), null]<br>
updateGpa(HE04, 7.5) -&gt; true &nbsp;4/5 [HE03(9.0), HE04(7.5), HE02(7.0), HE05(5.0), null]<br>
removeAt(4) -&gt; null</div>
<p>Insert and remove are mirror images. Insert shifts <strong>right</strong> and must go <strong>from the end</strong> (<code>j = count</code> down to <code>index+1</code>): going from the front would copy <code>a[index]</code> over every later slot. Remove shifts <strong>left</strong>, from <code>index</code> up to <code>count-2</code>, then clears the old last slot. <code>add</code> is just <code>insertAt(count, s)</code> — one place holds the rules (null, full, duplicate). Valid indexes differ: insert accepts <code>0..count</code> (inserting at <code>count</code> = appending), get and remove accept <code>0..count-1</code>.</p>
</details>
<div class="callout">🧭 <strong>Go further — CSD201</strong>: this is the "array list" of the data-structures course: get is O(1), but insert and remove at the front are O(n) because of the shifting. CSD201's linked list makes them O(1) and get O(n) — now you know what it trades.</div>`,
    `<h3>🧪 Bài 1 — Đủ năm thao tác trên mảng dùng một phần, kể cả "thêm tại chỉ số cho trước" (~30 phút)</h3>
<p>Slide 2 hứa "thêm một đối tượng tại chỉ số cho trước", nhưng <code>addItem</code> chỉ thêm vào cuối. Viết <code>StudentArray</code> (sức chứa cố định khi tạo, một biến <code>count</code>) với <code>indexOf(id)</code> (không phân biệt hoa thường, -1 nếu không có), <code>add(s)</code>, <code>insertAt(index, s)</code> (0..count; từ chối null, danh sách đầy, chỉ số sai, id trùng — trả về một thông báo), <code>removeAt(index)</code> (trả về đối tượng đã xoá hoặc null), <code>get(index)</code> và <code>updateGpa(id, gpa)</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/20b5e4e13d664efb47c347ab1b127c6ecb731b2d.svg" alt="Bài 1: chèn làm phần đuôi dời sang phải một bước, bắt đầu từ CUỐI" loading="lazy" /><p class="chu-thich">🧩 Bài 1: chèn làm phần đuôi dời sang phải một bước, bắt đầu từ CUỐI</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — insertAt(2, HE04): shift RIGHT from the end, then write the gap
' Dời từ cuối giữ được mọi phần tử; dời từ đầu sẽ chép a[2] vào mọi ô
map "before (count = 3)" as B {
  [0] =&gt; HE03
  [1] =&gt; HE01
  [2] =&gt; HE02
  [3] =&gt; null
  [4] =&gt; null
}
map "after (count = 4)" as F {
  [0] =&gt; HE03
  [1] =&gt; HE01
  [2] =&gt; HE04 (inserted)
  [3] =&gt; HE02 (moved from 2)
  [4] =&gt; null
}
B -right-&gt; F : j = count down to k+1 (here only j = 3):  a[3] = a[2];  then a[2] = s
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Student {
    private final String id;
    private String name;
    private double gpa;

    Student(String id, String name, double gpa) { this.id = id; this.name = name; this.gpa = gpa; }
    String getId() { return id; }
    double getGpa() { return gpa; }
    void setGpa(double gpa) { this.gpa = gpa; }

    @Override
    public String toString() { return id + "(" + gpa + ")"; }
}</code></pre>
<pre class="trich"><code class="language-java">class StudentArray {
    private final Student[] a;
    private int count;

    StudentArray(int capacity) { a = new Student[capacity]; }

    int indexOf(String id) {                                      // tìm theo giá trị: -1 khi không có
        for (int i = 0; i &lt; count; i++) if (a[i].getId().equalsIgnoreCase(id)) return i;
        return -1;
    }

    String add(Student s) {                                       // thêm vào cuối
        return insertAt(count, s);
    }

    String insertAt(int index, Student s) {                       // thêm tại chỉ số cho trước: dời sang PHẢI, đi từ cuối
        if (s == null) return "rejected: null";
        if (count == a.length) return "rejected: full";
        if (index &lt; 0 || index &gt; count) return "rejected: index " + index + " not in 0.." + count;
        if (indexOf(s.getId()) &gt;= 0) return "rejected: duplicate " + s.getId();
        for (int j = count; j &gt; index; j--) a[j] = a[j - 1];      // đi từ cuối, không thì mọi phần tử thành bản sao của a[index]
        a[index] = s;
        count++;
        return "added at " + index;
    }

    Student removeAt(int index) {                                 // xoá tại chỉ số cho trước: dời sang TRÁI
        if (index &lt; 0 || index &gt;= count) return null;
        Student removed = a[index];
        for (int j = index; j &lt; count - 1; j++) a[j] = a[j + 1];
        a[--count] = null;
        return removed;
    }

    Student get(int index) {                                      // tìm theo chỉ số
        return index &gt;= 0 &amp;&amp; index &lt; count ? a[index] : null;
    }

    boolean updateGpa(String id, double gpa) {                    // cập nhật đối tượng tìm thấy
        int i = indexOf(id);
        if (i &lt; 0) return false;
        a[i].setGpa(gpa);
        return true;
    }

    @Override
    public String toString() { return count + "/" + a.length + " " + Arrays.toString(a); }
}</code></pre>
<pre class="trich"><code class="language-java">StudentArray list = new StudentArray(5);
System.out.println(list.add(new Student("HE01", "An", 8)) + "  " + list);
System.out.println(list.add(new Student("HE02", "Binh", 7)) + "  " + list);
System.out.println(list.insertAt(0, new Student("HE03", "Chi", 9)) + "  " + list);
System.out.println(list.insertAt(2, new Student("HE04", "Dung", 6)) + "  " + list);
System.out.println(list.insertAt(9, new Student("HE05", "Em", 5)));
System.out.println(list.add(new Student("he02", "Binh again", 5)));
System.out.println(list.add(new Student("HE05", "Em", 5)) + "  " + list);
System.out.println(list.add(new Student("HE06", "Giang", 4)));
System.out.println("get(1) = " + list.get(1) + ", get(7) = " + list.get(7));
System.out.println("removeAt(1) -&gt; " + list.removeAt(1) + "  " + list);
System.out.println("updateGpa(HE04, 7.5) -&gt; " + list.updateGpa("HE04", 7.5) + "  " + list);
System.out.println("removeAt(4) -&gt; " + list.removeAt(4));</code></pre>
<div class="out">added at 0 &nbsp;1/5 [HE01(8.0), null, null, null, null]<br>
added at 1 &nbsp;2/5 [HE01(8.0), HE02(7.0), null, null, null]<br>
added at 0 &nbsp;3/5 [HE03(9.0), HE01(8.0), HE02(7.0), null, null]<br>
added at 2 &nbsp;4/5 [HE03(9.0), HE01(8.0), HE04(6.0), HE02(7.0), null]<br>
rejected: index 9 not in 0..4<br>
rejected: duplicate he02<br>
added at 4 &nbsp;5/5 [HE03(9.0), HE01(8.0), HE04(6.0), HE02(7.0), HE05(5.0)]<br>
rejected: full<br>
get(1) = HE01(8.0), get(7) = null<br>
removeAt(1) -&gt; HE01(8.0) &nbsp;4/5 [HE03(9.0), HE04(6.0), HE02(7.0), HE05(5.0), null]<br>
updateGpa(HE04, 7.5) -&gt; true &nbsp;4/5 [HE03(9.0), HE04(7.5), HE02(7.0), HE05(5.0), null]<br>
removeAt(4) -&gt; null</div>
<p>Chèn và xoá là hình soi gương của nhau. Chèn dời sang <strong>phải</strong> và phải đi <strong>từ cuối</strong> (<code>j = count</code> lùi tới <code>index+1</code>): đi từ đầu sẽ chép <code>a[index]</code> đè lên mọi ô phía sau. Xoá dời sang <strong>trái</strong>, từ <code>index</code> tới <code>count-2</code>, rồi xoá ô cuối cũ. <code>add</code> chỉ là <code>insertAt(count, s)</code> — các luật (null, đầy, trùng) chỉ nằm một chỗ. Chỉ số hợp lệ khác nhau: chèn nhận <code>0..count</code> (chèn ở <code>count</code> = thêm vào cuối), lấy và xoá nhận <code>0..count-1</code>.</p>
</details>
<div class="callout">🧭 <strong>Đi tiếp — CSD201</strong>: đây là "array list" của môn cấu trúc dữ liệu: lấy theo chỉ số là O(1), nhưng chèn và xoá ở đầu là O(n) vì phải dời. Danh sách liên kết của CSD201 làm chúng thành O(1) và lấy theo chỉ số thành O(n) — giờ bạn biết nó đánh đổi cái gì.</div>`),
    bi(`<h3>🧪 Exercise 2 — PE question 3: Laptop, the given ILaptop, MyLaptop (~35 min)</h3>
<p>(3 marks, PE6/PE10/PE14 shape) Write the class <code>Laptop</code> (name, price, two constructors, getters, setters, <code>toString()</code> returning <code>(name, price)</code>). The interface <code>ILaptop</code> is given compiled — do not create it. Write <code>MyLaptop implements ILaptop</code>: <strong>f1</strong> returns the laptop with the highest price (the first one if several); <strong>f2</strong> sorts the list by price ascending, equal prices by name A–Z ignoring case; <strong>f3</strong> removes, in place, every laptop whose name contains a digit.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/6e2573734d25f784992081d7c7b0ca6446e83a81.svg" alt="Exercise 2: you write Laptop and MyLaptop; ILaptop and Main are given" loading="lazy" /><p class="chu-thich">🧩 Exercise 2: you write Laptop and MyLaptop; ILaptop and Main are given</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — PE question 3: the given interface and the class you write
' ILaptop is given compiled (byte code); you write Laptop and MyLaptop only
interface ILaptop &lt;&lt;given&gt;&gt; {
  + f1(t : List) : Laptop
  + f2(t : List) : void
  + f3(t : List) : void
}
class Laptop {
  - name : String
  - price : int
  + Laptop()
  + Laptop(name : String, price : int)
  + getName() : String
  + getPrice() : int
  + setName(name : String) : void
  + setPrice(price : int) : void
  + toString() : String
}
class MyLaptop {
  + f1(t : List) : Laptop
  + f2(t : List) : void
  + f3(t : List) : void
}
class "Main" as M &lt;&lt;given harness&gt;&gt;
ILaptop &lt;|.. MyLaptop
MyLaptop ..&gt; Laptop : works on a List of
M ..&gt; ILaptop : calls f1/f2/f3
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8 with a harness like the given Main)</summary>
<pre class="trich"><code class="language-java">interface ILaptop {                                    // given as byte code in the exam: do NOT create ILaptop.java
    public Laptop f1(List t);
    public void f2(List t);
    public void f3(List t);
}</code></pre>
<pre class="trich"><code class="language-java">class Laptop {
    private String name;
    private int price;

    public Laptop() { }
    public Laptop(String name, int price) { this.name = name; this.price = price; }
    public String getName() { return name; }
    public int getPrice() { return price; }
    public void setName(String name) { this.name = name; }
    public void setPrice(int price) { this.price = price; }

    @Override
    public String toString() { return "(" + name + ", " + price + ")"; }
}</code></pre>
<pre class="trich"><code class="language-java">class MyLaptop implements ILaptop {
    // f1: the laptop with the highest price; the first one if several
    @Override
    public Laptop f1(List t) {
        List&lt;Laptop&gt; list = (List&lt;Laptop&gt;) t;          // the interface uses a raw List: cast once
        if (list.isEmpty()) return null;
        Laptop max = list.get(0);
        for (Laptop x : list) if (x.getPrice() &gt; max.getPrice()) max = x;   // &gt; keeps the FIRST maximum
        return max;
    }

    // f2: sort by price ascending; equal prices by name A-Z
    @Override
    public void f2(List t) {
        List&lt;Laptop&gt; list = (List&lt;Laptop&gt;) t;
        Collections.sort(list, new Comparator&lt;Laptop&gt;() {
            @Override
            public int compare(Laptop a, Laptop b) {
                int c = Integer.compare(a.getPrice(), b.getPrice());
                return c != 0 ? c : a.getName().compareToIgnoreCase(b.getName());
            }
        });
    }

    // f3: remove, in place, every laptop whose name contains a digit
    @Override
    public void f3(List t) {
        Iterator&lt;Laptop&gt; it = ((List&lt;Laptop&gt;) t).iterator();
        while (it.hasNext())
            if (it.next().getName().matches(".*\\\\d.*")) it.remove();   // Iterator.remove: safe while looping
    }
}</code></pre>
<pre class="trich"><code class="language-java">static List&lt;Laptop&gt; start() {                      // like the given Main: a hard-coded list
    List&lt;Laptop&gt; t = new ArrayList&lt;&gt;();
    t.add(new Laptop("Dell XPS13", 1500));
    t.add(new Laptop("MacBook Air", 1200));
    t.add(new Laptop("ThinkPad", 1500));
    t.add(new Laptop("Asus G14", 1100));
    return t;
}

public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Add how many elements: ");
    int n = Integer.parseInt(sc.nextLine().trim());
    System.out.println(n);
    List&lt;Laptop&gt; extra = new ArrayList&lt;&gt;();
    for (int i = 0; i &lt; n; i++) {
        String name = sc.nextLine().trim();
        int price = Integer.parseInt(sc.nextLine().trim());
        extra.add(new Laptop(name, price));
        System.out.println("  added " + extra.get(i));
    }
    ILaptop m = new MyLaptop();
    for (String tc : sc.nextLine().trim().split(" ")) {   // the real harness runs ONE TC per run; here all three
        List&lt;Laptop&gt; t = start();
        t.addAll(extra);
        System.out.println("TC" + tc + " on " + t);
        System.out.println("OUTPUT:");
        if (tc.equals("1")) System.out.println(m.f1(t));
        else if (tc.equals("2")) { m.f2(t); System.out.println(t); }
        else { m.f3(t); System.out.println(t); }
    }
}</code></pre>
<p>Input: <code>1</code> extra element <code>Acer Swift / 1100</code>, then TC 1, 2, 3.</p>
<div class="out">Add how many elements: 1<br>
&nbsp;&nbsp;added (Acer Swift, 1100)<br>
TC1 on [(Dell XPS13, 1500), (MacBook Air, 1200), (ThinkPad, 1500), (Asus G14, 1100), (Acer Swift, 1100)]<br>
OUTPUT:<br>
(Dell XPS13, 1500)<br>
TC2 on [(Dell XPS13, 1500), (MacBook Air, 1200), (ThinkPad, 1500), (Asus G14, 1100), (Acer Swift, 1100)]<br>
OUTPUT:<br>
[(Acer Swift, 1100), (Asus G14, 1100), (MacBook Air, 1200), (Dell XPS13, 1500), (ThinkPad, 1500)]<br>
TC3 on [(Dell XPS13, 1500), (MacBook Air, 1200), (ThinkPad, 1500), (Asus G14, 1100), (Acer Swift, 1100)]<br>
OUTPUT:<br>
[(MacBook Air, 1200), (ThinkPad, 1500), (Acer Swift, 1100)]</div>
<p>Points the marker checks. The interface uses a <strong>raw</strong> <code>List</code> (as in the real papers), so cast once — <code>(List&lt;Laptop&gt;) t</code> — and javac prints the note "uses unchecked or unsafe operations": a warning, not an error, the project builds. f1 uses <code>&gt;</code>, not <code>&gt;=</code>, so the <em>first</em> 1500 (Dell) wins over ThinkPad. f2 compares the second key only when the first is equal. f3 must change the list it was given ("in place") — <code>Iterator.remove</code> does; building a new list and assigning it to the parameter does not (the caller would still see the old list).</p>
</details>
<div class="pitfall">Copy the output format character by character: <code>(name, price)</code> with a space after the comma here, while the PE14 Q1–Q2 classes use no space. The marker compares strings exactly.</div>`,
    `<h3>🧪 Bài 2 — Câu 3 đề PE: Laptop, ILaptop cho sẵn, MyLaptop (~35 phút)</h3>
<p>(3 điểm, dạng PE6/PE10/PE14) Viết lớp <code>Laptop</code> (name, price, hai constructor, getter, setter, <code>toString()</code> trả về <code>(name, price)</code>). Interface <code>ILaptop</code> cho sẵn dạng đã biên dịch — không tạo lại. Viết <code>MyLaptop implements ILaptop</code>: <strong>f1</strong> trả về laptop giá cao nhất (cái đầu tiên nếu có nhiều); <strong>f2</strong> sắp danh sách theo giá tăng dần, giá bằng nhau thì theo tên A–Z không phân biệt hoa thường; <strong>f3</strong> xoá tại chỗ mọi laptop có tên chứa chữ số.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/6e2573734d25f784992081d7c7b0ca6446e83a81.svg" alt="Bài 2: bạn viết Laptop và MyLaptop; ILaptop và Main cho sẵn" loading="lazy" /><p class="chu-thich">🧩 Bài 2: bạn viết Laptop và MyLaptop; ILaptop và Main cho sẵn</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — PE question 3: the given interface and the class you write
' ILaptop cho sẵn dạng đã biên dịch (byte code); bạn chỉ viết Laptop và MyLaptop
interface ILaptop &lt;&lt;given&gt;&gt; {
  + f1(t : List) : Laptop
  + f2(t : List) : void
  + f3(t : List) : void
}
class Laptop {
  - name : String
  - price : int
  + Laptop()
  + Laptop(name : String, price : int)
  + getName() : String
  + getPrice() : int
  + setName(name : String) : void
  + setPrice(price : int) : void
  + toString() : String
}
class MyLaptop {
  + f1(t : List) : Laptop
  + f2(t : List) : void
  + f3(t : List) : void
}
class "Main" as M &lt;&lt;given harness&gt;&gt;
ILaptop &lt;|.. MyLaptop
MyLaptop ..&gt; Laptop : works on a List of
M ..&gt; ILaptop : calls f1/f2/f3
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8 với harness giống Main cho sẵn)</summary>
<pre class="trich"><code class="language-java">interface ILaptop {                                    // đề cho dạng byte code: KHÔNG tạo ILaptop.java
    public Laptop f1(List t);
    public void f2(List t);
    public void f3(List t);
}</code></pre>
<pre class="trich"><code class="language-java">class Laptop {
    private String name;
    private int price;

    public Laptop() { }
    public Laptop(String name, int price) { this.name = name; this.price = price; }
    public String getName() { return name; }
    public int getPrice() { return price; }
    public void setName(String name) { this.name = name; }
    public void setPrice(int price) { this.price = price; }

    @Override
    public String toString() { return "(" + name + ", " + price + ")"; }
}</code></pre>
<pre class="trich"><code class="language-java">class MyLaptop implements ILaptop {
    // f1: laptop giá cao nhất; lấy cái đầu nếu có nhiều
    @Override
    public Laptop f1(List t) {
        List&lt;Laptop&gt; list = (List&lt;Laptop&gt;) t;          // interface dùng List thô: ép kiểu một lần
        if (list.isEmpty()) return null;
        Laptop max = list.get(0);
        for (Laptop x : list) if (x.getPrice() &gt; max.getPrice()) max = x;   // &gt; giữ lại giá trị lớn nhất ĐẦU TIÊN
        return max;
    }

    // f2: sắp giá tăng dần; giá bằng nhau thì theo tên A-Z
    @Override
    public void f2(List t) {
        List&lt;Laptop&gt; list = (List&lt;Laptop&gt;) t;
        Collections.sort(list, new Comparator&lt;Laptop&gt;() {
            @Override
            public int compare(Laptop a, Laptop b) {
                int c = Integer.compare(a.getPrice(), b.getPrice());
                return c != 0 ? c : a.getName().compareToIgnoreCase(b.getName());
            }
        });
    }

    // f3: xoá tại chỗ mọi laptop có tên chứa chữ số
    @Override
    public void f3(List t) {
        Iterator&lt;Laptop&gt; it = ((List&lt;Laptop&gt;) t).iterator();
        while (it.hasNext())
            if (it.next().getName().matches(".*\\\\d.*")) it.remove();   // Iterator.remove: an toàn khi đang lặp
    }
}</code></pre>
<pre class="trich"><code class="language-java">static List&lt;Laptop&gt; start() {                      // như Main cho sẵn: danh sách viết cứng
    List&lt;Laptop&gt; t = new ArrayList&lt;&gt;();
    t.add(new Laptop("Dell XPS13", 1500));
    t.add(new Laptop("MacBook Air", 1200));
    t.add(new Laptop("ThinkPad", 1500));
    t.add(new Laptop("Asus G14", 1100));
    return t;
}

public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Add how many elements: ");
    int n = Integer.parseInt(sc.nextLine().trim());
    System.out.println(n);
    List&lt;Laptop&gt; extra = new ArrayList&lt;&gt;();
    for (int i = 0; i &lt; n; i++) {
        String name = sc.nextLine().trim();
        int price = Integer.parseInt(sc.nextLine().trim());
        extra.add(new Laptop(name, price));
        System.out.println("  added " + extra.get(i));
    }
    ILaptop m = new MyLaptop();
    for (String tc : sc.nextLine().trim().split(" ")) {   // harness thật chạy MỘT TC mỗi lần; ở đây chạy cả ba
        List&lt;Laptop&gt; t = start();
        t.addAll(extra);
        System.out.println("TC" + tc + " on " + t);
        System.out.println("OUTPUT:");
        if (tc.equals("1")) System.out.println(m.f1(t));
        else if (tc.equals("2")) { m.f2(t); System.out.println(t); }
        else { m.f3(t); System.out.println(t); }
    }
}</code></pre>
<p>Dữ liệu vào: <code>1</code> phần tử thêm <code>Acer Swift / 1100</code>, rồi TC 1, 2, 3.</p>
<div class="out">Add how many elements: 1<br>
&nbsp;&nbsp;added (Acer Swift, 1100)<br>
TC1 on [(Dell XPS13, 1500), (MacBook Air, 1200), (ThinkPad, 1500), (Asus G14, 1100), (Acer Swift, 1100)]<br>
OUTPUT:<br>
(Dell XPS13, 1500)<br>
TC2 on [(Dell XPS13, 1500), (MacBook Air, 1200), (ThinkPad, 1500), (Asus G14, 1100), (Acer Swift, 1100)]<br>
OUTPUT:<br>
[(Acer Swift, 1100), (Asus G14, 1100), (MacBook Air, 1200), (Dell XPS13, 1500), (ThinkPad, 1500)]<br>
TC3 on [(Dell XPS13, 1500), (MacBook Air, 1200), (ThinkPad, 1500), (Asus G14, 1100), (Acer Swift, 1100)]<br>
OUTPUT:<br>
[(MacBook Air, 1200), (ThinkPad, 1500), (Acer Swift, 1100)]</div>
<p>Những điểm người chấm kiểm. Interface dùng <code>List</code> <strong>thô</strong> (như đề thật), nên ép kiểu một lần — <code>(List&lt;Laptop&gt;) t</code> — và javac in ghi chú "uses unchecked or unsafe operations": là cảnh báo, không phải lỗi, project vẫn build được. f1 dùng <code>&gt;</code> chứ không phải <code>&gt;=</code>, nên chiếc 1500 <em>đầu tiên</em> (Dell) thắng ThinkPad. f2 chỉ so khoá thứ hai khi khoá thứ nhất bằng nhau. f3 phải thay đổi chính danh sách được đưa vào ("tại chỗ") — <code>Iterator.remove</code> làm được; dựng danh sách mới rồi gán vào tham số thì không (bên gọi vẫn thấy danh sách cũ).</p>
</details>
<div class="pitfall">Chép định dạng output đúng từng ký tự: ở đây <code>(name, price)</code> có khoảng trắng sau dấu phẩy, trong khi các lớp ở câu 1–2 của PE14 không có. Người chấm so chuỗi chính xác.</div>`),
    bi(`<h3>🧪 Exercise 3 — "Remove every element that…": five loops, measured (~15 min)</h3>
<p>Remove every 8 from <code>[5, 8, 8, 3, 8, 1]</code>. Predict what each loop leaves, then compare with the real run.</p>
<pre class="trich"><code class="language-java">// remove every 8
List&lt;Integer&gt; a = data();
for (int i = 0; i &lt; a.size(); i++)
    if (a.get(i) == 8) a.remove(i);                  // the next 8 shifts into i, then i++ skips it
System.out.println("1 forward index loop: " + a);

List&lt;Integer&gt; b = data();
try {
    for (Integer x : b)
        if (x == 8) b.remove(x);                     // remove(Object) inside for-each
    System.out.println("2 for-each: " + b);
} catch (java.util.ConcurrentModificationException e) {
    System.out.println("2 for-each: " + e.getClass().getSimpleName() + ", list now " + b);
}

List&lt;Integer&gt; c = data();
for (int i = c.size() - 1; i &gt;= 0; i--)
    if (c.get(i) == 8) c.remove(i);                  // backwards: shifting only moves elements already checked
System.out.println("3 backward index loop: " + c);

List&lt;Integer&gt; d = data();
for (Iterator&lt;Integer&gt; it = d.iterator(); it.hasNext(); )
    if (it.next() == 8) it.remove();
System.out.println("4 Iterator.remove: " + d);

List&lt;Integer&gt; e = data();
e.removeIf(x -&gt; x == 8);                             // Java 8
System.out.println("5 removeIf: " + e);

Integer[] arr = { 5, 8, 8, 3, 8, 1 };                // the same on an array + count
int n = arr.length, k = 0;
for (int i = 0; i &lt; n; i++)
    if (arr[i] != 8) arr[k++] = arr[i];              // keep-and-compact: one pass, no shifting inside a loop
for (int i = k; i &lt; n; i++) arr[i] = null;
System.out.println("6 array, keep-and-compact: count=" + k + " " + Arrays.toString(arr));</code></pre>
<details><summary>Real output and why</summary>
<div class="out">1 forward index loop: [5, 8, 3, 1]<br>
2 for-each: ConcurrentModificationException, list now [5, 8, 3, 8, 1]<br>
3 backward index loop: [5, 3, 1]<br>
4 Iterator.remove: [5, 3, 1]<br>
5 removeIf: [5, 3, 1]<br>
6 array, keep-and-compact: count=3 [5, 3, 1, null, null, null]</div>
<ul>
<li><strong>1</strong> — after removing index 1, the second 8 slides into index 1, and <code>i++</code> jumps over it: one 8 survives. No error, wrong answer — the worst kind.</li>
<li><strong>2</strong> — removing from an <code>ArrayList</code> while a for-each walks it makes the hidden iterator throw <code>ConcurrentModificationException</code> on its next step; the list is left half-changed.</li>
<li><strong>3, 4, 5</strong> — correct: backwards (shifting only touches elements already checked), <code>Iterator.remove()</code> (the iterator knows about the removal), <code>removeIf</code> (Java 8, legal in the exam).</li>
<li><strong>6</strong> — on an array, "keep and compact": copy every element to keep forward to position <code>k</code>, then null the tail — one pass, no repeated shifting.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — "Xoá mọi phần tử mà…": năm vòng lặp, đo thật (~15 phút)</h3>
<p>Xoá mọi số 8 khỏi <code>[5, 8, 8, 3, 8, 1]</code>. Đoán xem mỗi vòng lặp để lại gì, rồi so với lần chạy thật.</p>
<pre class="trich"><code class="language-java">// xoá mọi số 8
List&lt;Integer&gt; a = data();
for (int i = 0; i &lt; a.size(); i++)
    if (a.get(i) == 8) a.remove(i);                  // số 8 kế tiếp dời vào i, rồi i++ bỏ qua nó
System.out.println("1 forward index loop: " + a);

List&lt;Integer&gt; b = data();
try {
    for (Integer x : b)
        if (x == 8) b.remove(x);                     // remove(Object) bên trong for-each
    System.out.println("2 for-each: " + b);
} catch (java.util.ConcurrentModificationException e) {
    System.out.println("2 for-each: " + e.getClass().getSimpleName() + ", list now " + b);
}

List&lt;Integer&gt; c = data();
for (int i = c.size() - 1; i &gt;= 0; i--)
    if (c.get(i) == 8) c.remove(i);                  // lặp ngược: việc dời chỉ đụng các phần tử đã kiểm
System.out.println("3 backward index loop: " + c);

List&lt;Integer&gt; d = data();
for (Iterator&lt;Integer&gt; it = d.iterator(); it.hasNext(); )
    if (it.next() == 8) it.remove();
System.out.println("4 Iterator.remove: " + d);

List&lt;Integer&gt; e = data();
e.removeIf(x -&gt; x == 8);                             // Java 8
System.out.println("5 removeIf: " + e);

Integer[] arr = { 5, 8, 8, 3, 8, 1 };                // cùng việc đó trên mảng + biến đếm
int n = arr.length, k = 0;
for (int i = 0; i &lt; n; i++)
    if (arr[i] != 8) arr[k++] = arr[i];              // giữ-và-dồn: một lượt, không dời trong vòng lặp
for (int i = k; i &lt; n; i++) arr[i] = null;
System.out.println("6 array, keep-and-compact: count=" + k + " " + Arrays.toString(arr));</code></pre>
<details><summary>Output thật và lý do</summary>
<div class="out">1 forward index loop: [5, 8, 3, 1]<br>
2 for-each: ConcurrentModificationException, list now [5, 8, 3, 8, 1]<br>
3 backward index loop: [5, 3, 1]<br>
4 Iterator.remove: [5, 3, 1]<br>
5 removeIf: [5, 3, 1]<br>
6 array, keep-and-compact: count=3 [5, 3, 1, null, null, null]</div>
<ul>
<li><strong>1</strong> — sau khi xoá chỉ số 1, số 8 thứ hai trượt vào chỉ số 1, và <code>i++</code> nhảy qua nó: một số 8 sống sót. Không báo lỗi, chỉ sai kết quả — loại tệ nhất.</li>
<li><strong>2</strong> — xoá khỏi <code>ArrayList</code> trong lúc for-each đang duyệt làm bộ lặp ẩn ném <code>ConcurrentModificationException</code> ở bước kế tiếp; danh sách bị bỏ lại ở trạng thái sửa dở.</li>
<li><strong>3, 4, 5</strong> — đúng: lặp ngược (việc dời chỉ đụng các phần tử đã kiểm), <code>Iterator.remove()</code> (bộ lặp biết việc xoá), <code>removeIf</code> (Java 8, dùng được trong phòng thi).</li>
<li><strong>6</strong> — trên mảng, "giữ và dồn": chép mọi phần tử cần giữ dồn về vị trí <code>k</code>, rồi gán null phần đuôi — một lượt, không phải dời nhiều lần.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — A LAB211 product manager on an array (~60 min)</h3>
<p>The FU material's "Product Manager", on an array (files come in Chapter 9, so the six initial products are created in the constructor). Rules: ID in the format P000 (any case), unique; name not blank and without extra blanks; price 1..100000. Menu: add, search by ID, search by part of the name (case-insensitive), print all by price descending, update name and price by ID, remove by ID, exit. Every wrong value is asked again.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7b360abef91df471f121a0bb35e92a1c62a91677.svg" alt="Exercise 4: four classes, four jobs — the shape LAB211 reviewers expect" loading="lazy" /><p class="chu-thich">🧩 Exercise 4: four classes, four jobs — the shape LAB211 reviewers expect</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — the LAB211 shape: entity, list, input helper, menu
' Four classes, four jobs: data, storage and rules, validated input, the conversation with the user
class Product {
  - id : String {readOnly}
  - name : String
  - price : int
  + toString() : String
}
class ProductList {
  - list : Product[50]
  - count : int
  + indexOf(id : String) : int
  + add(p : Product) : boolean
  + find(id : String) : Product
  + printByName(part : String) : int
  + printByPriceDesc() : void
  + remove(id : String) : boolean
}
class Inputter {
  - {static} SC : Scanner
  + {static} readPattern(prompt, regex, rule) : String
  + {static} readName(prompt) : String
  + {static} readInt(prompt, min, max) : int
}
class QuanLySanPham {
  + {static} main(args : String[]) : void
}
ProductList o--&gt; "0..50" Product
QuanLySanPham ..&gt; ProductList : menu calls
QuanLySanPham ..&gt; Inputter : reads with
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8 with input full of mistakes)</summary>
<pre class="trich"><code class="language-java">class Inputter {
    private static final Scanner SC = new Scanner(System.in);

    static String line(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);
        return s;
    }

    static String readPattern(String prompt, String regex, String rule) {
        while (true) {
            String s = line(prompt);
            if (s.matches(regex)) return s.toUpperCase();
            System.out.println("  ! " + rule);
        }
    }

    static String readName(String prompt) {
        while (true) {
            String s = line(prompt).replaceAll("\\\\s+", " ");     // "no extra blank"
            if (!s.isEmpty()) return s;
            System.out.println("  ! name must not be blank");
        }
    }

    static int readInt(String prompt, int min, int max) {
        while (true) {
            String s = line(prompt);
            try {
                int n = Integer.parseInt(s);
                if (n &gt;= min &amp;&amp; n &lt;= max) return n;
                System.out.println("  ! must be " + min + ".." + max);
            } catch (NumberFormatException e) {
                System.out.println("  ! not an integer");
            }
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Product {
    private final String id;
    private String name;
    private int price;

    Product(String id, String name, int price) { this.id = id; this.name = name; this.price = price; }
    String getId() { return id; }
    String getName() { return name; }
    int getPrice() { return price; }
    void setName(String name) { this.name = name; }
    void setPrice(int price) { this.price = price; }

    @Override
    public String toString() { return String.format("%-5s| %-22s| %5d", id, name, price); }
}</code></pre>
<pre class="trich"><code class="language-java">class ProductList {
    private final Product[] list = new Product[50];
    private int count;

    ProductList() {                                              // the material's products.txt — Chapter 9 reads it from a file
        add(new Product("P001", "Sony TV 65", 850));
        add(new Product("P006", "Sharp TV 40", 210));
        add(new Product("P003", "TCL TV 55", 310));
        add(new Product("P007", "Bose sounddock 30 III", 500));
        add(new Product("P002", "Bose soundbar 230 I", 800));
        add(new Product("P004", "Denon soundbar S330", 1100));
    }

    int indexOf(String id) {
        for (int i = 0; i &lt; count; i++) if (list[i].getId().equalsIgnoreCase(id)) return i;
        return -1;
    }

    boolean add(Product p) {
        if (count == list.length || indexOf(p.getId()) &gt;= 0) return false;
        list[count++] = p;
        return true;
    }

    Product find(String id) {
        int i = indexOf(id);
        return i &lt; 0 ? null : list[i];
    }

    int printByName(String part) {
        int found = 0;
        for (int i = 0; i &lt; count; i++)
            if (list[i].getName().toLowerCase().contains(part.toLowerCase())) { System.out.println("  " + list[i]); found++; }
        return found;
    }

    void printByPriceDesc() {                                    // sort a COPY: the stored order is not changed
        Product[] copy = Arrays.copyOf(list, count);
        Arrays.sort(copy, new Comparator&lt;Product&gt;() {
            @Override
            public int compare(Product a, Product b) { return Integer.compare(b.getPrice(), a.getPrice()); }
        });
        for (Product p : copy) System.out.println("  " + p);
    }

    boolean remove(String id) {
        int i = indexOf(id);
        if (i &lt; 0) return false;
        for (int j = i; j &lt; count - 1; j++) list[j] = list[j + 1];
        list[--count] = null;
        return true;
    }

    int size() { return count; }
}</code></pre>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    ProductList pl = new ProductList();
    final String ID = "[pP]\\\\d{3}", RULE = "ID must be P + 3 digits, e.g. P010";
    while (true) {
        System.out.println("1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit");
        int c = Inputter.readInt("choice: ", 0, 6);
        if (c == 0) break;
        switch (c) {
            case 1: {
                String id = Inputter.readPattern("  ID: ", ID, RULE);
                if (pl.find(id) != null) { System.out.println("  ! ID " + id + " already exists"); break; }
                String name = Inputter.readName("  name: ");
                int price = Inputter.readInt("  price: ", 1, 100000);
                System.out.println(pl.add(new Product(id, name, price)) ? "  added, " + pl.size() + " products" : "  ! list is full");
                break;
            }
            case 2: {
                Product p = pl.find(Inputter.readPattern("  ID: ", ID, RULE));
                System.out.println(p == null ? "  not found" : "  " + p);
                break;
            }
            case 3:
                if (pl.printByName(Inputter.readName("  part of name: ")) == 0) System.out.println("  no product matches");
                break;
            case 4:
                pl.printByPriceDesc();
                break;
            case 5: {
                Product p = pl.find(Inputter.readPattern("  ID: ", ID, RULE));
                if (p == null) { System.out.println("  not found"); break; }
                p.setName(Inputter.readName("  new name: "));
                p.setPrice(Inputter.readInt("  new price: ", 1, 100000));
                System.out.println("  updated: " + p);
                break;
            }
            default:
                System.out.println(pl.remove(Inputter.readPattern("  ID: ", ID, RULE)) ? "  removed" : "  not found");
        }
    }
    System.out.println("bye");
}</code></pre>
<p>Input: add with "P01" then the existing "p003"; add P010 with a messy name, -5 and "abc" as prices; search "soundbar" and "phone"; print by price; update P007; remove "p006" and the unknown P099; search P006; choice 7; exit.</p>
<div class="out">1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 1<br>
&nbsp;&nbsp;ID: P01<br>
&nbsp;&nbsp;! ID must be P + 3 digits, e.g. P010<br>
&nbsp;&nbsp;ID: p003<br>
&nbsp;&nbsp;! ID P003 already exists<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 1<br>
&nbsp;&nbsp;ID: P010<br>
&nbsp;&nbsp;name: LG &nbsp;&nbsp;OLED &nbsp;C3<br>
&nbsp;&nbsp;price: -5<br>
&nbsp;&nbsp;! must be 1..100000<br>
&nbsp;&nbsp;price: abc<br>
&nbsp;&nbsp;! not an integer<br>
&nbsp;&nbsp;price: 1990<br>
&nbsp;&nbsp;added, 7 products<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 3<br>
&nbsp;&nbsp;part of name: soundbar<br>
&nbsp;&nbsp;P002 | Bose soundbar 230 I &nbsp;&nbsp;| &nbsp;&nbsp;800<br>
&nbsp;&nbsp;P004 | Denon soundbar S330 &nbsp;&nbsp;| &nbsp;1100<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 3<br>
&nbsp;&nbsp;part of name: phone<br>
&nbsp;&nbsp;no product matches<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 4<br>
&nbsp;&nbsp;P010 | LG OLED C3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;1990<br>
&nbsp;&nbsp;P004 | Denon soundbar S330 &nbsp;&nbsp;| &nbsp;1100<br>
&nbsp;&nbsp;P001 | Sony TV 65 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;850<br>
&nbsp;&nbsp;P002 | Bose soundbar 230 I &nbsp;&nbsp;| &nbsp;&nbsp;800<br>
&nbsp;&nbsp;P007 | Bose sounddock 30 III | &nbsp;&nbsp;500<br>
&nbsp;&nbsp;P003 | TCL TV 55 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;310<br>
&nbsp;&nbsp;P006 | Sharp TV 40 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;210<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 5<br>
&nbsp;&nbsp;ID: P007<br>
&nbsp;&nbsp;new name: Bose SoundLink Max<br>
&nbsp;&nbsp;new price: 399<br>
&nbsp;&nbsp;updated: P007 | Bose SoundLink Max &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;399<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 6<br>
&nbsp;&nbsp;ID: p006<br>
&nbsp;&nbsp;removed<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 6<br>
&nbsp;&nbsp;ID: P099<br>
&nbsp;&nbsp;not found<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 2<br>
&nbsp;&nbsp;ID: P006<br>
&nbsp;&nbsp;not found<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 7<br>
&nbsp;&nbsp;! must be 0..6<br>
choice: 0<br>
bye</div>
<p>What makes it LAB211-grade: the uniqueness check happens <strong>right after the ID is read</strong>, not after the user typed everything; "  LG   OLED  C3  " is stored as "LG OLED C3"; "p006" removes P006 (IDs compared ignoring case, stored in upper case); printing by price sorts a <strong>copy</strong>, so the stored order is untouched; a choice out of range is asked again instead of falling into <code>default</code>. <code>String.format("%-5s| %-22s| %5d")</code> gives aligned columns: <code>-</code> = left-aligned, the number = width.</p>
</details>`,
    `<h3>🧪 Bài 4 — Chương trình quản lý sản phẩm LAB211 trên mảng (~60 phút)</h3>
<p>Chương trình "Product Manager" của học liệu FU, chạy trên mảng (file thuộc Chương 9, nên sáu sản phẩm ban đầu được tạo trong constructor). Luật: ID dạng P000 (hoa thường đều được), không trùng; tên không rỗng và không thừa khoảng trắng; giá 1..100000. Menu: thêm, tìm theo ID, tìm theo một phần tên (không phân biệt hoa thường), in tất cả theo giá giảm dần, sửa tên và giá theo ID, xoá theo ID, thoát. Mọi giá trị sai đều bị hỏi lại.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7b360abef91df471f121a0bb35e92a1c62a91677.svg" alt="Bài 4: bốn lớp, bốn việc — hình dạng mà người chấm LAB211 chờ đợi" loading="lazy" /><p class="chu-thich">🧩 Bài 4: bốn lớp, bốn việc — hình dạng mà người chấm LAB211 chờ đợi</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — the LAB211 shape: entity, list, input helper, menu
' Bốn lớp, bốn việc: dữ liệu, lưu trữ và luật, nhập liệu có kiểm tra, giao tiếp với người dùng
class Product {
  - id : String {readOnly}
  - name : String
  - price : int
  + toString() : String
}
class ProductList {
  - list : Product[50]
  - count : int
  + indexOf(id : String) : int
  + add(p : Product) : boolean
  + find(id : String) : Product
  + printByName(part : String) : int
  + printByPriceDesc() : void
  + remove(id : String) : boolean
}
class Inputter {
  - {static} SC : Scanner
  + {static} readPattern(prompt, regex, rule) : String
  + {static} readName(prompt) : String
  + {static} readInt(prompt, min, max) : int
}
class QuanLySanPham {
  + {static} main(args : String[]) : void
}
ProductList o--&gt; "0..50" Product
QuanLySanPham ..&gt; ProductList : menu calls
QuanLySanPham ..&gt; Inputter : reads with
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8 với dữ liệu đầy lỗi)</summary>
<pre class="trich"><code class="language-java">class Inputter {
    private static final Scanner SC = new Scanner(System.in);

    static String line(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);
        return s;
    }

    static String readPattern(String prompt, String regex, String rule) {
        while (true) {
            String s = line(prompt);
            if (s.matches(regex)) return s.toUpperCase();
            System.out.println("  ! " + rule);
        }
    }

    static String readName(String prompt) {
        while (true) {
            String s = line(prompt).replaceAll("\\\\s+", " ");     // "không thừa khoảng trắng"
            if (!s.isEmpty()) return s;
            System.out.println("  ! name must not be blank");
        }
    }

    static int readInt(String prompt, int min, int max) {
        while (true) {
            String s = line(prompt);
            try {
                int n = Integer.parseInt(s);
                if (n &gt;= min &amp;&amp; n &lt;= max) return n;
                System.out.println("  ! must be " + min + ".." + max);
            } catch (NumberFormatException e) {
                System.out.println("  ! not an integer");
            }
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Product {
    private final String id;
    private String name;
    private int price;

    Product(String id, String name, int price) { this.id = id; this.name = name; this.price = price; }
    String getId() { return id; }
    String getName() { return name; }
    int getPrice() { return price; }
    void setName(String name) { this.name = name; }
    void setPrice(int price) { this.price = price; }

    @Override
    public String toString() { return String.format("%-5s| %-22s| %5d", id, name, price); }
}</code></pre>
<pre class="trich"><code class="language-java">class ProductList {
    private final Product[] list = new Product[50];
    private int count;

    ProductList() {                                              // products.txt của học liệu — Chương 9 sẽ đọc từ file
        add(new Product("P001", "Sony TV 65", 850));
        add(new Product("P006", "Sharp TV 40", 210));
        add(new Product("P003", "TCL TV 55", 310));
        add(new Product("P007", "Bose sounddock 30 III", 500));
        add(new Product("P002", "Bose soundbar 230 I", 800));
        add(new Product("P004", "Denon soundbar S330", 1100));
    }

    int indexOf(String id) {
        for (int i = 0; i &lt; count; i++) if (list[i].getId().equalsIgnoreCase(id)) return i;
        return -1;
    }

    boolean add(Product p) {
        if (count == list.length || indexOf(p.getId()) &gt;= 0) return false;
        list[count++] = p;
        return true;
    }

    Product find(String id) {
        int i = indexOf(id);
        return i &lt; 0 ? null : list[i];
    }

    int printByName(String part) {
        int found = 0;
        for (int i = 0; i &lt; count; i++)
            if (list[i].getName().toLowerCase().contains(part.toLowerCase())) { System.out.println("  " + list[i]); found++; }
        return found;
    }

    void printByPriceDesc() {                                    // sắp một BẢN SAO: thứ tự lưu không đổi
        Product[] copy = Arrays.copyOf(list, count);
        Arrays.sort(copy, new Comparator&lt;Product&gt;() {
            @Override
            public int compare(Product a, Product b) { return Integer.compare(b.getPrice(), a.getPrice()); }
        });
        for (Product p : copy) System.out.println("  " + p);
    }

    boolean remove(String id) {
        int i = indexOf(id);
        if (i &lt; 0) return false;
        for (int j = i; j &lt; count - 1; j++) list[j] = list[j + 1];
        list[--count] = null;
        return true;
    }

    int size() { return count; }
}</code></pre>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    ProductList pl = new ProductList();
    final String ID = "[pP]\\\\d{3}", RULE = "ID must be P + 3 digits, e.g. P010";
    while (true) {
        System.out.println("1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit");
        int c = Inputter.readInt("choice: ", 0, 6);
        if (c == 0) break;
        switch (c) {
            case 1: {
                String id = Inputter.readPattern("  ID: ", ID, RULE);
                if (pl.find(id) != null) { System.out.println("  ! ID " + id + " already exists"); break; }
                String name = Inputter.readName("  name: ");
                int price = Inputter.readInt("  price: ", 1, 100000);
                System.out.println(pl.add(new Product(id, name, price)) ? "  added, " + pl.size() + " products" : "  ! list is full");
                break;
            }
            case 2: {
                Product p = pl.find(Inputter.readPattern("  ID: ", ID, RULE));
                System.out.println(p == null ? "  not found" : "  " + p);
                break;
            }
            case 3:
                if (pl.printByName(Inputter.readName("  part of name: ")) == 0) System.out.println("  no product matches");
                break;
            case 4:
                pl.printByPriceDesc();
                break;
            case 5: {
                Product p = pl.find(Inputter.readPattern("  ID: ", ID, RULE));
                if (p == null) { System.out.println("  not found"); break; }
                p.setName(Inputter.readName("  new name: "));
                p.setPrice(Inputter.readInt("  new price: ", 1, 100000));
                System.out.println("  updated: " + p);
                break;
            }
            default:
                System.out.println(pl.remove(Inputter.readPattern("  ID: ", ID, RULE)) ? "  removed" : "  not found");
        }
    }
    System.out.println("bye");
}</code></pre>
<p>Dữ liệu vào: thêm với "P01" rồi "p003" đã có; thêm P010 với tên lộn xộn, giá -5 và "abc"; tìm "soundbar" và "phone"; in theo giá; sửa P007; xoá "p006" và P099 không tồn tại; tìm P006; lựa chọn 7; thoát.</p>
<div class="out">1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 1<br>
&nbsp;&nbsp;ID: P01<br>
&nbsp;&nbsp;! ID must be P + 3 digits, e.g. P010<br>
&nbsp;&nbsp;ID: p003<br>
&nbsp;&nbsp;! ID P003 already exists<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 1<br>
&nbsp;&nbsp;ID: P010<br>
&nbsp;&nbsp;name: LG &nbsp;&nbsp;OLED &nbsp;C3<br>
&nbsp;&nbsp;price: -5<br>
&nbsp;&nbsp;! must be 1..100000<br>
&nbsp;&nbsp;price: abc<br>
&nbsp;&nbsp;! not an integer<br>
&nbsp;&nbsp;price: 1990<br>
&nbsp;&nbsp;added, 7 products<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 3<br>
&nbsp;&nbsp;part of name: soundbar<br>
&nbsp;&nbsp;P002 | Bose soundbar 230 I &nbsp;&nbsp;| &nbsp;&nbsp;800<br>
&nbsp;&nbsp;P004 | Denon soundbar S330 &nbsp;&nbsp;| &nbsp;1100<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 3<br>
&nbsp;&nbsp;part of name: phone<br>
&nbsp;&nbsp;no product matches<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 4<br>
&nbsp;&nbsp;P010 | LG OLED C3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;1990<br>
&nbsp;&nbsp;P004 | Denon soundbar S330 &nbsp;&nbsp;| &nbsp;1100<br>
&nbsp;&nbsp;P001 | Sony TV 65 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;850<br>
&nbsp;&nbsp;P002 | Bose soundbar 230 I &nbsp;&nbsp;| &nbsp;&nbsp;800<br>
&nbsp;&nbsp;P007 | Bose sounddock 30 III | &nbsp;&nbsp;500<br>
&nbsp;&nbsp;P003 | TCL TV 55 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;310<br>
&nbsp;&nbsp;P006 | Sharp TV 40 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;210<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 5<br>
&nbsp;&nbsp;ID: P007<br>
&nbsp;&nbsp;new name: Bose SoundLink Max<br>
&nbsp;&nbsp;new price: 399<br>
&nbsp;&nbsp;updated: P007 | Bose SoundLink Max &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;399<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 6<br>
&nbsp;&nbsp;ID: p006<br>
&nbsp;&nbsp;removed<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 6<br>
&nbsp;&nbsp;ID: P099<br>
&nbsp;&nbsp;not found<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 2<br>
&nbsp;&nbsp;ID: P006<br>
&nbsp;&nbsp;not found<br>
1-Add 2-Search ID 3-Search name 4-Price desc 5-Update 6-Remove 0-Exit<br>
choice: 7<br>
&nbsp;&nbsp;! must be 0..6<br>
choice: 0<br>
bye</div>
<p>Điều làm nó đạt chuẩn LAB211: việc kiểm trùng diễn ra <strong>ngay sau khi đọc ID</strong>, không phải sau khi người dùng đã gõ hết; "  LG   OLED  C3  " được lưu thành "LG OLED C3"; "p006" xoá được P006 (ID so không phân biệt hoa thường, lưu dạng viết hoa); in theo giá sắp xếp một <strong>bản sao</strong>, nên thứ tự lưu không bị đụng tới; lựa chọn ngoài khoảng bị hỏi lại thay vì rơi vào <code>default</code>. <code>String.format("%-5s| %-22s| %5d")</code> cho các cột thẳng hàng: <code>-</code> = canh trái, con số = độ rộng.</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — Predict six outputs about arrays of objects (~15 min)</h3>
<p>FE style. <code>Box</code> has one field <code>v</code> and <code>toString()</code> "Box" + v; it does not override <code>equals</code>.</p>
<pre class="trich"><code class="language-java">Box[] a = new Box[3];
int[] n = new int[3];
String[] s = new String[3];
System.out.println("(a) " + a[0] + " " + n[0] + " " + s[0] + " " + a.length);

Box[] b = { new Box(1), new Box(2) };
Box[] c = b;
c[0] = new Box(9);
c[1].v = 7;
System.out.println("(b) " + Arrays.toString(b));

Box[] d = { new Box(1), new Box(2) };
Box[] e = Arrays.copyOf(d, 3);
e[0] = new Box(5);
e[1].v = 6;
System.out.println("(c) " + Arrays.toString(d) + " " + Arrays.toString(e));

Box x = new Box(4), y = new Box(4);
Box[] f = { x };
System.out.println("(d) " + (f[0] == x) + " " + (f[0] == y) + " " + f[0].equals(y));

String[] g = { new String("An"), "Binh" };
System.out.println("(e) " + (g[0] == "An") + " " + g[0].equals("An"));

Object[] h = new String[2];
try {
    h[0] = "ok";
    h[1] = Integer.valueOf(1);
    System.out.println("(f) stored");
} catch (ArrayStoreException ex) {
    System.out.println("(f) " + ex.getClass().getSimpleName() + " after h[0]=" + h[0]);
}</code></pre>
<details><summary>Answer (real output) and the rule behind each line</summary>
<div class="out">(a) null 0 null 3<br>
(b) [Box9, Box7]<br>
(c) [Box1, Box6] [Box5, Box6, null]<br>
(d) true false false<br>
(e) false true<br>
(f) ArrayStoreException after h[0]=ok</div>
<ul>
<li><strong>(a)</strong> a new array of a class type holds <code>null</code>s, of <code>int</code> zeros; <code>length</code> is the capacity, 3.</li>
<li><strong>(b)</strong> <code>c = b</code> copies the reference to the <em>array</em>: one array, two names. Both changes show through <code>b</code>.</li>
<li><strong>(c)</strong> <code>Arrays.copyOf</code> makes a new array (length 3, padded with null) but copies the <strong>references</strong> inside — a shallow copy. Replacing <code>e[0]</code> does not touch <code>d</code>; changing the object <code>e[1]</code> does.</li>
<li><strong>(d)</strong> <code>==</code> compares references; <code>equals</code> not overridden is <code>==</code> too — so a search with equals on Box would never find an equal-looking box.</li>
<li><strong>(e)</strong> <code>new String("An")</code> is a different object from the literal "An": compare strings with <code>equals</code>.</li>
<li><strong>(f)</strong> a <code>String[]</code> may be referenced as <code>Object[]</code> (arrays are covariant), but storing an Integer in it is checked at run time: <code>ArrayStoreException</code>. Generics (<code>List&lt;String&gt;</code>) catch this at compile time instead.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — Đoán sáu output về mảng đối tượng (~15 phút)</h3>
<p>Kiểu FE. <code>Box</code> có một trường <code>v</code> và <code>toString()</code> là "Box" + v; nó không ghi đè <code>equals</code>.</p>
<pre class="trich"><code class="language-java">Box[] a = new Box[3];
int[] n = new int[3];
String[] s = new String[3];
System.out.println("(a) " + a[0] + " " + n[0] + " " + s[0] + " " + a.length);

Box[] b = { new Box(1), new Box(2) };
Box[] c = b;
c[0] = new Box(9);
c[1].v = 7;
System.out.println("(b) " + Arrays.toString(b));

Box[] d = { new Box(1), new Box(2) };
Box[] e = Arrays.copyOf(d, 3);
e[0] = new Box(5);
e[1].v = 6;
System.out.println("(c) " + Arrays.toString(d) + " " + Arrays.toString(e));

Box x = new Box(4), y = new Box(4);
Box[] f = { x };
System.out.println("(d) " + (f[0] == x) + " " + (f[0] == y) + " " + f[0].equals(y));

String[] g = { new String("An"), "Binh" };
System.out.println("(e) " + (g[0] == "An") + " " + g[0].equals("An"));

Object[] h = new String[2];
try {
    h[0] = "ok";
    h[1] = Integer.valueOf(1);
    System.out.println("(f) stored");
} catch (ArrayStoreException ex) {
    System.out.println("(f) " + ex.getClass().getSimpleName() + " after h[0]=" + h[0]);
}</code></pre>
<details><summary>Đáp án (output thật) và luật đứng sau mỗi dòng</summary>
<div class="out">(a) null 0 null 3<br>
(b) [Box9, Box7]<br>
(c) [Box1, Box6] [Box5, Box6, null]<br>
(d) true false false<br>
(e) false true<br>
(f) ArrayStoreException after h[0]=ok</div>
<ul>
<li><strong>(a)</strong> mảng mới kiểu lớp chứa toàn <code>null</code>, kiểu <code>int</code> chứa toàn 0; <code>length</code> là sức chứa, 3.</li>
<li><strong>(b)</strong> <code>c = b</code> chép tham chiếu tới <em>mảng</em>: một mảng, hai tên. Cả hai thay đổi đều hiện ra qua <code>b</code>.</li>
<li><strong>(c)</strong> <code>Arrays.copyOf</code> tạo mảng mới (dài 3, phần thiếu là null) nhưng chép các <strong>tham chiếu</strong> bên trong — bản sao nông (shallow copy). Thay <code>e[0]</code> không đụng tới <code>d</code>; sửa đối tượng <code>e[1]</code> thì có.</li>
<li><strong>(d)</strong> <code>==</code> so tham chiếu; <code>equals</code> chưa ghi đè cũng chính là <code>==</code> — nên tìm bằng equals trên Box sẽ không bao giờ thấy một hộp trông giống hệt.</li>
<li><strong>(e)</strong> <code>new String("An")</code> là đối tượng khác với hằng chuỗi "An": so chuỗi bằng <code>equals</code>.</li>
<li><strong>(f)</strong> một <code>String[]</code> có thể được tham chiếu dưới dạng <code>Object[]</code> (mảng có tính hiệp biến), nhưng việc cất một Integer vào đó bị kiểm lúc chạy: <code>ArrayStoreException</code>. Generics (<code>List&lt;String&gt;</code>) bắt lỗi này ngay lúc biên dịch.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — Reports in one pass over a polymorphic array (~20 min)</h3>
<p>An array of 10 slots holds 5 items (Vase, Statue, Painting; <code>Item</code> is abstract). In <strong>one loop</strong> over the used part, compute the total value, the most valuable item, the count per type and the total tax — Vase 5 %, Statue 10 %, Painting 8 % — without <code>instanceof</code> for the tax. Print the average with two decimals.</p>
<pre class="trich"><code class="language-java">abstract class Item {
    protected final String creator;
    protected final int value;
    Item(String creator, int value) { this.creator = creator; this.value = value; }
    int getValue() { return value; }
    abstract double taxRate();                          // each subclass answers for itself
    double tax() { return value * taxRate(); }
    public String toString() { return getClass().getSimpleName() + "(" + creator + ", " + value + ")"; }
}
class Vase extends Item {
    Vase(String c, int v) { super(c, v); }
    double taxRate() { return 0.05; }
}
class Statue extends Item {
    Statue(String c, int v) { super(c, v); }
    double taxRate() { return 0.10; }
}
class Painting extends Item {
    Painting(String c, int v) { super(c, v); }
    double taxRate() { return 0.08; }
}</code></pre>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">Item[] list = new Item[10];
Item[] data = { new Vase("Minh Long", 300), new Statue("Rodin", 150), new Painting("Phai", 800),
                new Vase("Bat Trang", 52), new Painting("Lang", 600) };
int n = 0;
for (Item it : data) list[n++] = it;

long total = 0;
Item max = null;
double taxTotal = 0;
String[] types = { "Vase", "Statue", "Painting" };
int[] counts = new int[types.length];
for (int i = 0; i &lt; n; i++) {                   // ONE pass over the used part
    Item it = list[i];
    total += it.getValue();
    if (max == null || it.getValue() &gt; max.getValue()) max = it;
    taxTotal += it.tax();                       // dynamic binding picks the right rate
    for (int k = 0; k &lt; types.length; k++)
        if (it.getClass().getSimpleName().equals(types[k])) counts[k]++;
}
System.out.println("items: " + n + ", total value: " + total);
System.out.printf("average: %.2f%n", n == 0 ? 0.0 : (double) total / n);   // cast BEFORE dividing
System.out.println("most valuable: " + max);
for (int k = 0; k &lt; types.length; k++) System.out.println("  " + types[k] + ": " + counts[k]);
System.out.printf("total tax: %.2f%n", taxTotal);
System.out.println("integer average without the cast: " + total / n);</code></pre>
<div class="out">items: 5, total value: 1902<br>
average: 380.40<br>
most valuable: Painting(Phai, 800)<br>
&nbsp;&nbsp;Vase: 2<br>
&nbsp;&nbsp;Statue: 1<br>
&nbsp;&nbsp;Painting: 2<br>
total tax: 144.60<br>
integer average without the cast: 380</div>
<p>The tax needs no type test: <code>taxRate()</code> is abstract in Item and each subclass answers — adding a fourth kind means adding a class, not editing the report. <code>max == null</code> handles the first item without inventing a "minimum value". The last line is the classic bug: <code>total / n</code> with two integers is integer division (380, not 380.4); cast one side to <code>double</code> <em>before</em> dividing.</p>
</details>
<div class="callout">🧭 <strong>Go further — Chapter 8 and PRJ301</strong>: with Java 8 streams the same report is <code>list.stream().mapToInt(Item::getValue).sum()</code> and <code>Collectors.groupingBy</code>; in PRJ301 it becomes one SQL query, <code>SELECT type, COUNT(*), SUM(value) … GROUP BY type</code>. The one-pass loop is what both do underneath.</div>`,
    `<h3>🧪 Bài 6 — Báo cáo trong một lượt trên mảng đa hình (~20 phút)</h3>
<p>Một mảng 10 ô chứa 5 món (Vase, Statue, Painting; <code>Item</code> là lớp trừu tượng). Trong <strong>một vòng lặp</strong> qua phần đang dùng, tính tổng giá trị, món giá trị nhất, số lượng theo loại và tổng thuế — Vase 5 %, Statue 10 %, Painting 8 % — mà không dùng <code>instanceof</code> cho thuế. In trung bình với hai chữ số thập phân.</p>
<pre class="trich"><code class="language-java">abstract class Item {
    protected final String creator;
    protected final int value;
    Item(String creator, int value) { this.creator = creator; this.value = value; }
    int getValue() { return value; }
    abstract double taxRate();                          // mỗi lớp con tự trả lời
    double tax() { return value * taxRate(); }
    public String toString() { return getClass().getSimpleName() + "(" + creator + ", " + value + ")"; }
}
class Vase extends Item {
    Vase(String c, int v) { super(c, v); }
    double taxRate() { return 0.05; }
}
class Statue extends Item {
    Statue(String c, int v) { super(c, v); }
    double taxRate() { return 0.10; }
}
class Painting extends Item {
    Painting(String c, int v) { super(c, v); }
    double taxRate() { return 0.08; }
}</code></pre>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">Item[] list = new Item[10];
Item[] data = { new Vase("Minh Long", 300), new Statue("Rodin", 150), new Painting("Phai", 800),
                new Vase("Bat Trang", 52), new Painting("Lang", 600) };
int n = 0;
for (Item it : data) list[n++] = it;

long total = 0;
Item max = null;
double taxTotal = 0;
String[] types = { "Vase", "Statue", "Painting" };
int[] counts = new int[types.length];
for (int i = 0; i &lt; n; i++) {                   // MỘT lượt qua phần đang dùng
    Item it = list[i];
    total += it.getValue();
    if (max == null || it.getValue() &gt; max.getValue()) max = it;
    taxTotal += it.tax();                       // ràng buộc động chọn đúng thuế suất
    for (int k = 0; k &lt; types.length; k++)
        if (it.getClass().getSimpleName().equals(types[k])) counts[k]++;
}
System.out.println("items: " + n + ", total value: " + total);
System.out.printf("average: %.2f%n", n == 0 ? 0.0 : (double) total / n);   // ép kiểu TRƯỚC khi chia
System.out.println("most valuable: " + max);
for (int k = 0; k &lt; types.length; k++) System.out.println("  " + types[k] + ": " + counts[k]);
System.out.printf("total tax: %.2f%n", taxTotal);
System.out.println("integer average without the cast: " + total / n);</code></pre>
<div class="out">items: 5, total value: 1902<br>
average: 380.40<br>
most valuable: Painting(Phai, 800)<br>
&nbsp;&nbsp;Vase: 2<br>
&nbsp;&nbsp;Statue: 1<br>
&nbsp;&nbsp;Painting: 2<br>
total tax: 144.60<br>
integer average without the cast: 380</div>
<p>Thuế không cần kiểm kiểu: <code>taxRate()</code> là trừu tượng trong Item và mỗi lớp con tự trả lời — thêm loại thứ tư nghĩa là thêm một lớp, không phải sửa báo cáo. <code>max == null</code> xử lý món đầu tiên mà không phải bịa ra một "giá trị nhỏ nhất". Dòng cuối là lỗi kinh điển: <code>total / n</code> với hai số nguyên là phép chia nguyên (380, không phải 380.4); hãy ép một vế sang <code>double</code> <em>trước</em> khi chia.</p>
</details>

<div class="callout">🧭 <strong>Đi tiếp — Chương 8 và PRJ301</strong>: với stream của Java 8, cùng báo cáo đó là <code>list.stream().mapToInt(Item::getValue).sum()</code> và <code>Collectors.groupingBy</code>; ở PRJ301 nó thành một câu SQL, <code>SELECT type, COUNT(*), SUM(value) … GROUP BY type</code>. Vòng lặp một lượt chính là thứ cả hai làm bên dưới.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>array of objects</strong></td><td>mảng đối tượng</td><td>An array whose elements are references to objects, all null when the array is created.</td></tr>
<tr><td><strong>reference</strong></td><td>tham chiếu</td><td>A value that points to an object; copying it gives a second name for the same object.</td></tr>
<tr><td><strong>static type / dynamic type</strong></td><td>kiểu tĩnh / kiểu động</td><td>The declared type (Item) versus the class of the object really stored (Vase).</td></tr>
<tr><td><strong>capacity / count</strong></td><td>sức chứa / số phần tử</td><td><code>length</code> is fixed at creation; a counter tells how many slots are in use.</td></tr>
<tr><td><strong>CRUD</strong></td><td>thêm–đọc–sửa–xoá</td><td>Create, Read, Update, Delete — the four operations of every management program.</td></tr>
<tr><td><strong>linear search</strong></td><td>tìm tuần tự</td><td>Checking elements one by one from the start; returns the first match, -1 or null if none.</td></tr>
<tr><td><strong>shift left / shift right</strong></td><td>dời trái / dời phải</td><td>Moving elements one slot to close a gap (remove) or open one (insert).</td></tr>
<tr><td><strong>bubble sort</strong></td><td>sắp xếp nổi bọt</td><td>Repeatedly swapping neighbours that are out of order; simple, O(n²).</td></tr>
<tr><td><strong><code>Comparable</code> / <code>Comparator</code></strong></td><td>so sánh được / bộ so sánh</td><td>compareTo gives a class its natural order; a Comparator object gives any other order.</td></tr>
<tr><td><strong><code>instanceof</code></strong></td><td>là thể hiện của</td><td>Tests whether an object is of a class or any subclass of it.</td></tr>
<tr><td><strong>shallow copy</strong></td><td>bản sao nông</td><td>A new array holding the same references; the objects themselves are shared.</td></tr>
<tr><td><strong><code>ConcurrentModificationException</code></strong></td><td>ngoại lệ sửa đổi đồng thời</td><td>Thrown when a collection is changed while a for-each iterates over it.</td></tr>
<tr><td><strong>in place</strong></td><td>tại chỗ</td><td>Changing the given list or array itself, not building a new one.</td></tr>
<tr><td><strong><code>NullPointerException</code></strong></td><td>ngoại lệ con trỏ null</td><td>Thrown when a method or field is used through a null reference, e.g. an unused array slot.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>array of objects</strong></td><td>mảng đối tượng</td><td>Mảng mà phần tử là tham chiếu tới đối tượng, tất cả là null khi mảng vừa tạo.</td></tr>
<tr><td><strong>reference</strong></td><td>tham chiếu</td><td>Giá trị trỏ tới một đối tượng; chép nó là có thêm một tên cho cùng đối tượng.</td></tr>
<tr><td><strong>static type / dynamic type</strong></td><td>kiểu tĩnh / kiểu động</td><td>Kiểu được khai báo (Item) so với lớp của đối tượng thật sự được lưu (Vase).</td></tr>
<tr><td><strong>capacity / count</strong></td><td>sức chứa / số phần tử</td><td><code>length</code> cố định khi tạo; một biến đếm cho biết bao nhiêu ô đang dùng.</td></tr>
<tr><td><strong>CRUD</strong></td><td>thêm–đọc–sửa–xoá</td><td>Create, Read, Update, Delete — bốn thao tác của mọi chương trình quản lý.</td></tr>
<tr><td><strong>linear search</strong></td><td>tìm tuần tự</td><td>Kiểm từng phần tử từ đầu; trả về kết quả khớp đầu tiên, -1 hoặc null nếu không có.</td></tr>
<tr><td><strong>shift left / shift right</strong></td><td>dời trái / dời phải</td><td>Dời các phần tử một ô để lấp chỗ trống (xoá) hoặc mở chỗ trống (chèn).</td></tr>
<tr><td><strong>bubble sort</strong></td><td>sắp xếp nổi bọt</td><td>Lặp lại việc hoán đổi các cặp kề nhau sai thứ tự; đơn giản, O(n²).</td></tr>
<tr><td><strong><code>Comparable</code> / <code>Comparator</code></strong></td><td>so sánh được / bộ so sánh</td><td>compareTo cho lớp một thứ tự tự nhiên; một đối tượng Comparator cho mọi thứ tự khác.</td></tr>
<tr><td><strong><code>instanceof</code></strong></td><td>là thể hiện của</td><td>Kiểm tra một đối tượng có thuộc một lớp hay lớp con bất kỳ của nó không.</td></tr>
<tr><td><strong>shallow copy</strong></td><td>bản sao nông</td><td>Một mảng mới chứa cùng các tham chiếu; bản thân các đối tượng vẫn dùng chung.</td></tr>
<tr><td><strong><code>ConcurrentModificationException</code></strong></td><td>ngoại lệ sửa đổi đồng thời</td><td>Bị ném khi một tập hợp bị thay đổi trong lúc for-each đang duyệt nó.</td></tr>
<tr><td><strong>in place</strong></td><td>tại chỗ</td><td>Thay đổi chính danh sách hay mảng được đưa vào, không dựng cái mới.</td></tr>
<tr><td><strong><code>NullPointerException</code></strong></td><td>ngoại lệ con trỏ null</td><td>Bị ném khi gọi phương thức hay trường qua một tham chiếu null, ví dụ một ô mảng chưa dùng.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 7</h2>
<ol>
<li><strong><code>new Item[100]</code> creates 100 null references, no Item</strong> — every loop stops at the count, never at <code>length</code>.</li>
<li><strong>An array stores references</strong>: two slots or a slot and a variable can name the same object; <code>Arrays.copyOf</code> copies references (shallow).</li>
<li><strong>Declare the array with the parent type</strong> (<code>Item[]</code>) and let overriding (<code>toString</code>, <code>input</code>, <code>taxRate</code>) do the work.</li>
<li><strong>Insert shifts right from the end; remove shifts left and nulls the old last slot</strong>; check the index range first (0..count for insert, 0..count-1 otherwise).</li>
<li><strong>Search returns -1 or null when absent</strong> — and the caller must check it; compare strings with equals / equalsIgnoreCase.</li>
<li><strong>Sort only the used part</strong>: <code>Arrays.sort(a, 0, count, cmp)</code>; compare with <code>Integer.compare</code>, second key only on ties.</li>
<li><strong>Remove while looping: backwards, Iterator.remove or removeIf</strong> — a forward index loop skips, a for-each throws ConcurrentModificationException.</li>
<li><strong>A LAB211 program = entity + list + Inputter + menu</strong>, with one Scanner, every value validated and asked again.</li>
</ol>
<p>Next: the Chapter 7 quiz, then Chapter 8 — <code>ArrayList</code>, <code>HashSet</code>, <code>HashMap</code>: the same operations without managing the count yourself.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 7</h2>
<ol>
<li><strong><code>new Item[100]</code> tạo 100 tham chiếu null, không tạo Item nào</strong> — mọi vòng lặp dừng ở biến đếm, không bao giờ ở <code>length</code>.</li>
<li><strong>Mảng lưu tham chiếu</strong>: hai ô hoặc một ô và một biến có thể cùng chỉ một đối tượng; <code>Arrays.copyOf</code> chép tham chiếu (bản sao nông).</li>
<li><strong>Khai báo mảng bằng kiểu cha</strong> (<code>Item[]</code>) và để việc ghi đè (<code>toString</code>, <code>input</code>, <code>taxRate</code>) làm phần việc.</li>
<li><strong>Chèn dời phải từ cuối; xoá dời trái và gán null ô cuối cũ</strong>; kiểm khoảng chỉ số trước (0..count khi chèn, 0..count-1 các trường hợp khác).</li>
<li><strong>Tìm kiếm trả về -1 hoặc null khi không có</strong> — và bên gọi phải kiểm; so chuỗi bằng equals / equalsIgnoreCase.</li>
<li><strong>Chỉ sắp xếp phần đang dùng</strong>: <code>Arrays.sort(a, 0, count, cmp)</code>; so bằng <code>Integer.compare</code>, khoá thứ hai chỉ khi bằng nhau.</li>
<li><strong>Xoá khi đang lặp: lặp ngược, Iterator.remove hoặc removeIf</strong> — vòng chỉ số tiến bị bỏ sót, for-each ném ConcurrentModificationException.</li>
<li><strong>Một chương trình LAB211 = thực thể + danh sách + Inputter + menu</strong>, một Scanner, mọi giá trị đều được kiểm và hỏi lại.</li>
</ol>
<p>Tiếp theo: quiz Chương 7, rồi Chương 8 — <code>ArrayList</code>, <code>HashSet</code>, <code>HashMap</code>: cùng các thao tác đó mà không phải tự quản lý biến đếm.</p>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch7) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Item[] list = new Item[100]; Which statement is correct right after this line?|||(Dạng câu FE) Item[] list = new Item[100]; Câu nào đúng ngay sau dòng này?',
      options: ['100 Item objects have been created|||100 đối tượng Item đã được tạo', 'list[0] is null|||list[0] là null', 'list[100] is the last element|||list[100] là phần tử cuối', 'list.length is 0 until items are added|||list.length là 0 cho tới khi thêm phần tử'],
      correctIndex: 1,
      points: 1,
      explanation: 'The array holds 100 references, all null — no Item exists yet (measured in lesson 7.A, slide 9). list.length is 100 from the start; valid indexes are 0..99, so list[100] throws ArrayIndexOutOfBoundsException. That is why a list class keeps its own counter (numOfItem).|||Mảng giữ 100 tham chiếu, tất cả là null — chưa có Item nào (đo thật ở bài 7.A, slide 9). list.length là 100 ngay từ đầu; chỉ số hợp lệ là 0..99, nên list[100] ném ArrayIndexOutOfBoundsException. Vì thế lớp danh sách phải giữ biến đếm riêng (numOfItem).' },
    { id: 'q2',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `class Box {
    int v;
    Box(int v) { this.v = v; }
}
public class Q2 {
    public static void main(String[] args) {
        Box[] b = { new Box(1), new Box(2) };
        Box[] c = b;
        c[0] = new Box(9);
        c[1].v = 7;
        System.out.println(b[0].v + " " + b[1].v);
    }
}`,
      codeLang: 'java',
      options: ['9 7|||9 7', '1 2|||1 2', '1 7|||1 7', '9 2|||9 2'],
      correctIndex: 0,
      points: 1,
      explanation: 'c = b copies the reference to the array, not the array: b and c are two names for one array. c[0] = new Box(9) replaces slot 0 of that array, c[1].v = 7 changes the object in slot 1 — both are visible through b.|||c = b chép tham chiếu tới mảng, không chép mảng: b và c là hai tên của một mảng. c[0] = new Box(9) thay ô 0 của mảng đó, c[1].v = 7 sửa đối tượng ở ô 1 — cả hai đều thấy được qua b.' },
    { id: 'q3',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Q3 {
    public static void main(String[] args) {
        List<Integer> a = new ArrayList<>(Arrays.asList(5, 8, 8, 3, 8, 1));
        for (int i = 0; i < a.size(); i++)
            if (a.get(i) == 8) a.remove(i);
        System.out.println(a);
    }
}`,
      codeLang: 'java',
      options: ['[5, 3, 1]|||[5, 3, 1]', '[5, 8, 8, 3, 1]|||[5, 8, 8, 3, 1]', '[5, 8, 3, 1]|||[5, 8, 3, 1]', 'ConcurrentModificationException|||ConcurrentModificationException'],
      correctIndex: 2,
      points: 1,
      explanation: 'When the 8 at index 1 is removed, the next 8 shifts into index 1 and i++ moves on to index 2, skipping it. The last 8 is removed normally. An index loop does not throw — only a for-each would (ConcurrentModificationException). Loop backwards, or use Iterator.remove / removeIf.|||Khi số 8 ở chỉ số 1 bị xoá, số 8 kế tiếp dời vào chỉ số 1 và i++ chuyển sang chỉ số 2, bỏ qua nó. Số 8 cuối bị xoá bình thường. Vòng lặp theo chỉ số không ném gì — chỉ for-each mới ném (ConcurrentModificationException). Hãy lặp ngược, hoặc dùng Iterator.remove / removeIf.' },
    { id: 'q4',
      question: "The school's removeItem shifts with for (int j = index; j < numOfItem; j++) list[j] = list[j + 1]; What happens when the array is FULL (numOfItem == list.length) and you remove index 1?|||removeItem của trường dời bằng for (int j = index; j < numOfItem; j++) list[j] = list[j + 1]; Điều gì xảy ra khi mảng ĐẦY (numOfItem == list.length) và xoá chỉ số 1?",
      options: ['It works: the last slot becomes null|||Chạy đúng: ô cuối thành null', 'It works but the last element is lost|||Chạy được nhưng mất phần tử cuối', 'It does not compile|||Không biên dịch được', 'The last step reads list[numOfItem], outside the array: ArrayIndexOutOfBoundsException|||Bước cuối đọc list[numOfItem], nằm ngoài mảng: ArrayIndexOutOfBoundsException'],
      correctIndex: 3,
      points: 1,
      explanation: 'The loop makes one move too many: with j = numOfItem - 1 it reads list[numOfItem]. While a free slot exists that slot is null and the bug is hidden; on a full array it is list[length]. Measured on JDK 8 with capacity 4: "ArrayIndexOutOfBoundsException: 4", array left half-shifted. Stop at j < numOfItem - 1, then set list[--numOfItem] = null.|||Vòng lặp dời thừa một lần: với j = numOfItem - 1 nó đọc list[numOfItem]. Khi còn ô trống thì ô đó là null và lỗi bị che; với mảng đầy đó là list[length]. Đo trên JDK 8 với sức chứa 4: "ArrayIndexOutOfBoundsException: 4", mảng bị dời dở dang. Dừng ở j < numOfItem - 1, rồi gán list[--numOfItem] = null.' },
    { id: 'q5',
      question: 'An Item[] of 10 slots holds 5 items (slots 5..9 are null) and Item implements Comparable. What does Arrays.sort(list) do?|||Một Item[] 10 ô chứa 5 món (ô 5..9 là null) và Item implements Comparable. Arrays.sort(list) làm gì?',
      options: ['It throws NullPointerException when it compares an item with a null slot|||Ném NullPointerException khi so sánh một món với một ô null', 'It sorts the 5 items and moves the nulls to the end|||Sắp 5 món và đẩy các ô null về cuối', 'It sorts the 5 items and ignores the nulls|||Sắp 5 món và bỏ qua các ô null', 'It does not compile: arrays of objects cannot be sorted|||Không biên dịch được: mảng đối tượng không sắp được'],
      correctIndex: 0,
      points: 1,
      explanation: 'Arrays.sort(list) sorts the WHOLE array; comparing a real item with a null fails with NullPointerException (measured in lesson 7.A, slide 14). Sort only the used part: Arrays.sort(list, 0, numOfItem), or with a comparator Arrays.sort(list, 0, numOfItem, cmp).|||Arrays.sort(list) sắp CẢ mảng; so một món thật với một ô null sẽ hỏng với NullPointerException (đo thật ở bài 7.A, slide 14). Chỉ sắp phần đang dùng: Arrays.sort(list, 0, numOfItem), hoặc kèm comparator Arrays.sort(list, 0, numOfItem, cmp).' },
    { id: 'q6',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `import java.util.Arrays;

class Box {
    int v;
    Box(int v) { this.v = v; }
}
public class Q6 {
    public static void main(String[] args) {
        Box[] d = { new Box(1), new Box(2) };
        Box[] e = Arrays.copyOf(d, 2);
        e[0] = new Box(5);
        e[1].v = 6;
        System.out.println(d[0].v + " " + d[1].v);
    }
}`,
      codeLang: 'java',
      options: ['5 6|||5 6', '1 6|||1 6', '1 2|||1 2', '5 2|||5 2'],
      correctIndex: 1,
      points: 1,
      explanation: 'Arrays.copyOf creates a NEW array but copies the references inside it (a shallow copy). e[0] = new Box(5) replaces a slot of the new array only, so d[0] is still Box 1. e[1] and d[1] point to the same object, so e[1].v = 6 is seen through d.|||Arrays.copyOf tạo một mảng MỚI nhưng chép các tham chiếu bên trong (bản sao nông). e[0] = new Box(5) chỉ thay một ô của mảng mới, nên d[0] vẫn là Box 1. e[1] và d[1] trỏ cùng một đối tượng, nên e[1].v = 6 thấy được qua d.' },
    { id: 'q7',
      question: 'To insert s at index k in an array a with count used elements (count less than a.length), which loop opens the gap correctly before a[k] = s; count++;?|||Để chèn s vào chỉ số k của mảng a đang dùng count phần tử (count nhỏ hơn a.length), vòng lặp nào mở chỗ trống đúng trước a[k] = s; count++;?',
      options: ['for (int j = k; j < count; j++) a[j + 1] = a[j];|||for (int j = k; j < count; j++) a[j + 1] = a[j];', 'for (int j = k; j < count - 1; j++) a[j] = a[j + 1];|||for (int j = k; j < count - 1; j++) a[j] = a[j + 1];', 'for (int j = count; j > k; j--) a[j] = a[j - 1];|||for (int j = count; j > k; j--) a[j] = a[j - 1];', 'for (int j = count; j > k; j--) a[j - 1] = a[j];|||for (int j = count; j > k; j--) a[j - 1] = a[j];'],
      correctIndex: 2,
      points: 1,
      explanation: 'Inserting shifts RIGHT and must start from the END, so each element is moved before it is overwritten. A goes from the front: a[k] is copied into every later slot. B shifts left (that is remove). D moves in the wrong direction, from a[count] (null) downwards. Measured in practice 7.2, exercise 1.|||Chèn là dời sang PHẢI và phải bắt đầu từ CUỐI, để mỗi phần tử được dời đi trước khi bị ghi đè. A đi từ đầu: a[k] bị chép vào mọi ô phía sau. B dời sang trái (đó là xoá). D dời ngược chiều, từ a[count] (null) đi xuống. Đo thật ở bài thực hành 7.2, bài 1.' },
    { id: 'q8',
      question: 'findItemIndex(creator) searches an array of items. By convention, what should it return when no item matches?|||findItemIndex(creator) tìm trong một mảng món đồ. Theo quy ước, nó nên trả về gì khi không món nào khớp?',
      options: ['0|||0', 'null|||null', 'It should throw ArrayIndexOutOfBoundsException|||Nó nên ném ArrayIndexOutOfBoundsException', '-1|||-1'],
      correctIndex: 3,
      points: 1,
      explanation: '0 is a valid index, so it cannot mean "not found"; an int method cannot return null. -1 is the convention used by String.indexOf and List.indexOf, and the caller tests it before using the index. A method returning the object itself (findItem) returns null instead.|||0 là chỉ số hợp lệ, nên không thể mang nghĩa "không tìm thấy"; phương thức trả về int không trả null được. -1 là quy ước mà String.indexOf và List.indexOf dùng, và bên gọi kiểm nó trước khi dùng chỉ số. Phương thức trả về chính đối tượng (findItem) thì trả null thay vào đó.' },
    { id: 'q9',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `class Item {
    public String toString() { return "Item"; }
}
class Vase extends Item {
    public String toString() { return "Vase"; }
}
class Statue extends Item { }

public class Q9 {
    public static void main(String[] args) {
        Item[] list = { new Vase(), new Statue(), new Item() };
        String s = "";
        for (Item it : list) s += it + " ";
        System.out.println(s.trim());
    }
}`,
      codeLang: 'java',
      options: ['Item Item Item|||Item Item Item', 'Vase Item Item|||Vase Item Item', 'Vase Statue Item|||Vase Statue Item', 'It does not compile: Vase and Statue cannot be stored in an Item[]|||Không biên dịch được: không cất Vase và Statue vào Item[] được'],
      correctIndex: 1,
      points: 1,
      explanation: "An Item[] may hold any subclass object. String concatenation calls toString() on each element, and the version is chosen at run time from the object: Vase overrides it (Vase), Statue does not, so it inherits Item's (Item), and the plain Item prints Item.|||Một Item[] chứa được đối tượng của mọi lớp con. Phép nối chuỗi gọi toString() trên từng phần tử, và phiên bản được chọn lúc chạy theo đối tượng: Vase ghi đè nó (Vase), Statue thì không nên kế thừa của Item (Item), và Item thường in Item." },
    { id: 'q10',
      question: 'A menu reads choice = sc.nextInt(); and then creator = sc.nextLine(); The user types 1, presses Enter, types Minh Long, presses Enter. What is stored in creator?|||Một menu đọc choice = sc.nextInt(); rồi creator = sc.nextLine(); Người dùng gõ 1, Enter, gõ Minh Long, Enter. creator chứa gì?',
      options: ['An empty string|||Chuỗi rỗng', 'Minh Long|||Minh Long', '1|||1', 'Minh|||Minh'],
      correctIndex: 0,
      points: 1,
      explanation: 'nextInt() reads the digits and stops BEFORE the Enter; the next nextLine() returns the rest of that same line, which is empty (measured in lesson 7.A, slide 15). "Minh Long" stays in the input and makes the next nextInt() throw InputMismatchException. Read every value with nextLine() and convert with Integer.parseInt.|||nextInt() đọc các chữ số và dừng TRƯỚC phím Enter; lời gọi nextLine() tiếp theo trả về phần còn lại của chính dòng đó, là chuỗi rỗng (đo thật ở bài 7.A, slide 15). "Minh Long" còn nằm lại và làm lần nextInt() kế tiếp ném InputMismatchException. Hãy đọc mọi giá trị bằng nextLine() và đổi bằng Integer.parseInt.' },
  ],
};

export default {
  slides: [L_pro12_1],
  practice: L_on_ch7,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 7 viết lại theo dạng câu FE PRO192, mỗi câu có giải thích song ngữ và câu "in ra gì" đã chạy thật trên JDK 8: mảng đối tượng mới tạo chứa gì, hai biến cùng một mảng, xoá trong vòng lặp tiến, removeItem của slide khi mảng đầy, sắp xếp cả mảng có ô null, bản sao nông bằng Arrays.copyOf, vòng lặp chèn tại chỉ số, giá trị -1 khi không tìm thấy, mảng kiểu cha với toString đa hình, và bẫy nextInt rồi nextLine.',
};
