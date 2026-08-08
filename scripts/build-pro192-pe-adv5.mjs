/**
 * build-pro192-pe-adv5.mjs — sinh content/exams/PRO192-PE-ADV5.mjs.
 *
 * ĐÂY LÀ ĐỀ TỰ SOẠN (source: 'SAMPLE'), KHÔNG phải đề thi thật của trường.
 * Bổ sung cho 11 đề PE PRO192 thật đã có trên nền tảng, đào sâu hơn về OOP để
 * bắc cầu sang LAB211 (kỳ 3) — nơi sinh viên phải quản lý collection lồng
 * collection suốt ngày nhưng LẠI KHÔNG bao giờ được dạy tự viết Iterator.
 *
 * Chủ đề: composition (một lớp "container" HAS-A `Map<String, List<T>>`),
 * tổng hợp số liệu xuyên nhóm, và một Iterator TỰ VIẾT làm phẳng cấu trúc
 * lồng nhau, dùng được bằng cú pháp for-each chuẩn Java.
 *
 * Chuỗi lớp (mỗi câu kế thừa câu trước, đúng kiểu given materials của PE thật):
 *   Book                                            (Q1)
 *   Catalog<T>                                      (Q1)
 *   StatCatalog<T>      extends Catalog<T>          (Q2)
 *   IterableCatalog<T>  extends StatCatalog<T> implements Iterable<T>  (Q3)
 *   SmartCatalog<T>     extends IterableCatalog<T>  (Q4)
 *
 * KIỂM CHỨNG: vì không có đề gốc để đối chiếu, toàn bộ `expectedOutput` dưới
 * đây là stdout THẬT, chụp lại từ `javac --release 8` + `java Main` với stdin
 * cố định (KHÔNG suy luận bằng cách đọc code). Đã chạy thêm các biến thể bẫy:
 *   - addItem vào group chưa tồn tại  -> không NullPointerException
 *   - addItem vào group đã addGroup sẵn -> nối vào, không nhân đôi key
 *   - getGroup(key không tồn tại)     -> "Returned null: false / Size: 0"
 *   - totalItems/largestGroup trên catalog rỗng, trên catalog chỉ toàn group rỗng,
 *     và trường hợp hoà (trả về key tạo TRƯỚC)
 *   - duyệt hết rồi gọi next() thêm 1 lần -> java.util.NoSuchElementException
 *   - group rỗng nằm ĐẦU / GIỮA / CUỐI  -> vẫn duyệt đủ, không hụt phần tử cuối
 *   - thêm group mới GIỮA lúc đang duyệt -> không ConcurrentModificationException
 *
 * Given materials đã đóng gói tay (Q1-Q4, chỉ .class, KHÔNG kèm .java lời giải)
 * và upload R2 PRO192/PE-ADV5-Given.zip, verify GET 200 (57 entry).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE-ADV5.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE-ADV5.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE-ADV5-Given.zip';

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Bộ dữ liệu dùng chung cho MỌI sample run (để sinh viên tái lập được) ──
const DATASET_EN = `<p><strong>The data set used by every sample run below</strong> — type exactly this when the harness asks:</p>
<pre>Enter number of empty groups: 1
Enter group key: Poetry
Enter number of books: 5
  Java / Java Core      / Alice / 120
  Java / Effective Java / Bloch / 250
  Web  / HTML5 Basics   / Carol / 90
  Java / Design Patterns/ Bob   / 200
  AI   / Deep Learning  / Ian   / 300</pre>
<p>So the catalog holds 4 groups in creation order — <code>Poetry</code> (created empty, never filled), <code>Java</code> (3 books), <code>Web</code> (1 book), <code>AI</code> (1 book) — 5 items in total.</p>`;

const DATASET_VI = `<p><strong>Bộ dữ liệu dùng cho MỌI sample run bên dưới</strong> — gõ đúng như vậy khi harness hỏi:</p>
<pre>Enter number of empty groups: 1
Enter group key: Poetry
Enter number of books: 5
  Java / Java Core      / Alice / 120
  Java / Effective Java / Bloch / 250
  Web  / HTML5 Basics   / Carol / 90
  Java / Design Patterns/ Bob   / 200
  AI   / Deep Learning  / Ian   / 300</pre>
<p>Kết quả: catalog có 4 nhóm theo thứ tự tạo — <code>Poetry</code> (tạo rỗng, không bao giờ được nạp sách), <code>Java</code> (3 sách), <code>Web</code> (1 sách), <code>AI</code> (1 sách) — tổng cộng 5 phần tử.</p>`;

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS (self-authored advanced practice paper)</strong></p>
   <p><strong>Read this first:</strong> this is NOT an official school exam paper. It was written from scratch for this platform as extra practice, and it is deliberately harder and more OOP-dense than the 11 real PE papers next to it. Treat it exactly like the real thing while you sit it — 120 minutes, no help — but do not report it to anyone as a past paper.</p>
   <ol>
     <li>Software required: NetBeans 13 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Students are ONLY allowed to use their own study materials (sample code, program examples) stored on their own computer.</li>
     <li>Create a folder to save the given projects (e.g. PRO_given), download the given materials into it. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do NOT delete or edit given files, or create a java file with the same name as a given file.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11); for each question create two sub-folders <strong>run</strong> and <strong>src</strong>, copy the built <code>Qx.jar</code> into <strong>run</strong> and the entire project source into <strong>src</strong>.</li>
     <li>Do NOT use accented Vietnamese in code comments. Do NOT change the names of the folders/files specified in the exam, or the marking software cannot find the executable (.jar) to grade. All .java source files use the NetBeans default package.</li>
     <li><strong>This paper is cumulative.</strong> Each question extends the class written in the question before it. To keep every question independently gradable, the given materials of Q2/Q3/Q4 already contain the COMPILED earlier classes (<code>Book.class</code>, <code>Catalog.class</code>, ...), so in each project you only write the ONE new class named in that question.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is a real, buildable NetBeans project (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like the actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192 (đề LUYỆN TẬP NÂNG CAO tự soạn)</strong></p>
   <p><strong>Đọc kỹ trước:</strong> đây KHÔNG phải đề thi chính thức của trường. Đề được soạn mới hoàn toàn cho nền tảng này để luyện thêm, và cố ý khó hơn / đậm OOP hơn 11 đề PE thật nằm cạnh nó. Khi làm thì cứ coi như thi thật — 120 phút, không trợ giúp — nhưng đừng lan truyền nó như đề thi cũ của trường.</p>
   <ol>
     <li>Yêu cầu phần mềm: NetBeans 13 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Sinh viên CHỈ được dùng tài liệu học tập (mã mẫu, ví dụ chương trình) lưu trên máy tính của mình.</li>
     <li>Tạo một thư mục chứa các project given (vd PRO_given), tải given materials vào đó. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11); với mỗi câu tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>, chép file <code>Qx.jar</code> đã build vào <strong>run</strong>, chép toàn bộ mã nguồn project vào <strong>src</strong>.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. KHÔNG đổi tên các thư mục/file đã quy định trong đề, nếu không phần mềm chấm sẽ không tìm thấy file thực thi (.jar) để chấm. Mọi file nguồn .java dùng package mặc định của NetBeans.</li>
     <li><strong>Đề này cộng dồn.</strong> Mỗi câu mở rộng lớp của câu trước. Để mỗi câu vẫn chấm độc lập được, given materials của Q2/Q3/Q4 đã chứa sẵn các lớp trước ĐÃ BIÊN DỊCH (<code>Book.class</code>, <code>Catalog.class</code>, ...), nên trong mỗi project bạn chỉ viết ĐÚNG MỘT lớp mới mà câu đó yêu cầu.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là project NetBeans thật, build được (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

// ─────────────────────────────────────────────────────────────────────────────
// Lời giải tham khảo (đã biên dịch + chạy thật, xem header)
// ─────────────────────────────────────────────────────────────────────────────
const SOL_BOOK = `public class Book {

    private String title;
    private String author;
    private int price;

    public Book() {
    }

    public Book(String title, String author, int price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public int getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return title + ", " + author + ", " + price;
    }
}`;

const SOL_CATALOG = `import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Catalog<T> {

    private Map<String, List<T>> groups;

    public Catalog() {
        // LinkedHashMap keeps the groups in the order they were created,
        // so every traversal in Q2/Q3/Q4 is deterministic.
        groups = new LinkedHashMap<String, List<T>>();
    }

    public void addGroup(String groupKey) {
        if (!groups.containsKey(groupKey)) {
            groups.put(groupKey, new ArrayList<T>());
        }
    }

    public void addItem(String groupKey, T item) {
        // The group's list must exist BEFORE we append, otherwise
        // groups.get(groupKey).add(item) would throw NullPointerException.
        if (!groups.containsKey(groupKey)) {
            groups.put(groupKey, new ArrayList<T>());
        }
        groups.get(groupKey).add(item);
    }

    public List<T> getGroup(String groupKey) {
        if (!groups.containsKey(groupKey)) {
            return new ArrayList<T>();
        }
        return groups.get(groupKey);
    }

    public List<String> getGroupKeys() {
        return new ArrayList<String>(groups.keySet());
    }
}`;

const SOL_STAT = `import java.util.List;

public class StatCatalog<T> extends Catalog<T> {

    public StatCatalog() {
        super();
    }

    public int totalItems() {
        int total = 0;
        for (String key : getGroupKeys()) {
            total += getGroup(key).size();
        }
        return total;
    }

    public String largestGroup() {
        List<String> keys = getGroupKeys();
        if (keys.isEmpty()) {
            return null;
        }
        String best = keys.get(0);
        int bestSize = getGroup(best).size();
        for (int i = 1; i < keys.size(); i++) {
            String key = keys.get(i);
            int size = getGroup(key).size();
            if (size > bestSize) {
                best = key;
                bestSize = size;
            }
        }
        return best;
    }
}`;

const SOL_ITERABLE = `import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

public class IterableCatalog<T> extends StatCatalog<T> implements Iterable<T> {

    public IterableCatalog() {
        super();
    }

    @Override
    public Iterator<T> iterator() {
        return new CatalogIterator();
    }

    private class CatalogIterator implements Iterator<T> {

        private final List<String> keys;
        private int keyIndex;
        private int itemIndex;

        CatalogIterator() {
            keys = getGroupKeys();
            keyIndex = 0;
            itemIndex = 0;
        }

        @Override
        public boolean hasNext() {
            // Skip over every group whose items are already consumed
            // (this also skips groups that were created but left empty).
            while (keyIndex < keys.size()) {
                if (itemIndex < getGroup(keys.get(keyIndex)).size()) {
                    return true;
                }
                keyIndex++;
                itemIndex = 0;
            }
            return false;
        }

        @Override
        public T next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            T item = getGroup(keys.get(keyIndex)).get(itemIndex);
            itemIndex++;
            return item;
        }
    }
}`;

const SOL_SMART = `import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SmartCatalog<T> extends IterableCatalog<T> {

    public SmartCatalog() {
        super();
    }

    public T findMax(Comparator<T> cmp) {
        T best = null;
        for (T item : this) {
            if (best == null || cmp.compare(item, best) > 0) {
                best = item;
            }
        }
        return best;
    }

    public List<T> toSortedList(Comparator<T> cmp) {
        List<T> all = new ArrayList<T>();
        for (T item : this) {
            all.add(item);
        }
        Collections.sort(all, cmp);
        return all;
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Q1 (2 marks) — Book + Catalog<T> (composition over a nested generic map)
// ─────────────────────────────────────────────────────────────────────────────
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to real meaning of objects, variables and their values in the questions below.</p>
<p>Write a class <strong>Book</strong> and a generic class <strong>Catalog&lt;T&gt;</strong> (both in the default package of NetBeans) with the following information:</p>
${table([
  '-title: String<br/>-author: String<br/>-price: int',
  '+Book()<br/>+Book(title: String, author: String, price: int)<br/>+getTitle(): String<br/>+getAuthor(): String<br/>+getPrice(): int<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Book()</code> — default constructor.</li>
  <li><code>Book(title, author, price)</code> — parameterized constructor which sets values to title, author and price.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>title, author, price</strong>.</li>
</ul>
${table([
  '-groups: Map&lt;String, List&lt;T&gt;&gt;',
  '+Catalog()<br/>+addGroup(groupKey: String): void<br/>+addItem(groupKey: String, item: T): void<br/>+getGroup(groupKey: String): List&lt;T&gt;<br/>+getGroupKeys(): List&lt;String&gt;',
])}
<p>Where:</p>
<ul>
  <li><code>Catalog()</code> — default constructor. It must create an empty <code>LinkedHashMap</code> so that groups stay in the order they were created. Every later question depends on that order.</li>
  <li><code>addGroup(groupKey): void</code> — create an EMPTY group under this key. If the key already exists, do nothing (never wipe the books already in it).</li>
  <li><code>addItem(groupKey, item): void</code> — append <code>item</code> to that group's list. If the group does not exist yet, create its list FIRST and then append.</li>
  <li><code>getGroup(groupKey): List&lt;T&gt;</code> — return the list of items of that group. If the key does not exist, return an EMPTY list — <strong>never return null</strong>.</li>
  <li><code>getGroupKeys(): List&lt;String&gt;</code> — return all group keys as a <code>List&lt;String&gt;</code>, in creation order.</li>
</ul>
<p><em>Do not format the result. A Catalog is NOT a Map and does NOT extend one — it HAS-A map inside it (composition).</em></p>`;

const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp <strong>Book</strong> và lớp generic <strong>Catalog&lt;T&gt;</strong> (đều trong package mặc định của NetBeans) với thông tin sau:</p>
${table([
  '-title: String<br/>-author: String<br/>-price: int',
  '+Book()<br/>+Book(title: String, author: String, price: int)<br/>+getTitle(): String<br/>+getAuthor(): String<br/>+getPrice(): int<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Book()</code> — constructor mặc định.</li>
  <li><code>Book(title, author, price)</code> — constructor có tham số, gán giá trị cho title, author và price.</li>
  <li><code>toString(): String</code> — trả về chuỗi theo định dạng: <strong>title, author, price</strong>.</li>
</ul>
${table([
  '-groups: Map&lt;String, List&lt;T&gt;&gt;',
  '+Catalog()<br/>+addGroup(groupKey: String): void<br/>+addItem(groupKey: String, item: T): void<br/>+getGroup(groupKey: String): List&lt;T&gt;<br/>+getGroupKeys(): List&lt;String&gt;',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Catalog()</code> — constructor mặc định. Phải tạo một <code>LinkedHashMap</code> rỗng để các nhóm giữ nguyên thứ tự được tạo. Mọi câu sau đều phụ thuộc vào thứ tự này.</li>
  <li><code>addGroup(groupKey): void</code> — tạo một nhóm RỖNG ứng với key này. Nếu key đã tồn tại thì không làm gì (tuyệt đối không xoá sạch sách đang có trong nhóm).</li>
  <li><code>addItem(groupKey, item): void</code> — thêm <code>item</code> vào cuối danh sách của nhóm đó. Nếu nhóm chưa tồn tại thì phải tạo danh sách TRƯỚC rồi mới thêm.</li>
  <li><code>getGroup(groupKey): List&lt;T&gt;</code> — trả về danh sách phần tử của nhóm. Nếu key không tồn tại, trả về danh sách RỖNG — <strong>tuyệt đối không trả về null</strong>.</li>
  <li><code>getGroupKeys(): List&lt;String&gt;</code> — trả về mọi key nhóm dưới dạng <code>List&lt;String&gt;</code>, theo thứ tự tạo.</li>
</ul>
<p><em>Không định dạng lại kết quả. Catalog KHÔNG phải là một Map và KHÔNG kế thừa Map — nó CHỨA một map bên trong (composition).</em></p>`;

const q1ExplainEn = `<p><strong>Composition, not inheritance.</strong> The lazy way to write <code>Catalog</code> is <code>class Catalog&lt;T&gt; extends LinkedHashMap&lt;String, List&lt;T&gt;&gt;</code>. Don't. Inheritance says "a Catalog IS-A map", which hands every caller <code>put</code>, <code>remove</code>, <code>clear</code> — including <code>put("Java", null)</code>, which breaks every method you are about to write in Q2, Q3 and Q4. Composition says "a Catalog HAS-A map", keeps the map <code>private</code>, and lets the five public methods be the only door into it. That single decision is what makes the class safe to extend three times in this paper.</p>
<p><strong>The two bugs this question exists to catch.</strong></p>
<ul>
  <li><code>groups.get(groupKey).add(item)</code> throws <code>NullPointerException</code> when the key is new, because <code>get</code> returned <code>null</code> and you called <code>.add()</code> on nothing. You must create the list first — either <code>if (!groups.containsKey(k)) groups.put(k, new ArrayList&lt;T&gt;());</code> or, on JDK 8+, <code>groups.computeIfAbsent(k, x -&gt; new ArrayList&lt;T&gt;()).add(item);</code>. Verified: in every sample run below, groups <code>Java</code>, <code>Web</code> and <code>AI</code> are born from <code>addItem</code> alone (no <code>addGroup</code> call), and nothing throws.</li>
  <li><code>getGroup</code> returning <code>null</code> for a missing key pushes a null check onto every caller forever, and one forgotten check is an NPE in production. Returning an empty list means <code>for (T x : c.getGroup("Romance"))</code> just does nothing, which is what the caller wanted anyway. Sample run 3 proves it: <code>Returned null: false</code>, <code>Size: 0</code>.</li>
</ul>
<p><strong>Why LinkedHashMap.</strong> A plain <code>HashMap</code> orders keys by hash, so <code>getGroupKeys()</code> would come back in a jumbled order that changes with the data — and Q3's iterator would then have no testable order at all. <code>LinkedHashMap</code> costs nothing and makes the whole paper deterministic. Sample run 4 shows the keys coming back exactly as created: <code>Poetry|Java|Web|AI</code> — note <code>Poetry</code> is there even though it holds no book, and note the keys are NOT sorted alphabetically.</p>
<p>All outputs below are real stdout captured from <code>javac</code> + <code>java Main</code> against the given <code>Main.class</code> harness.</p>
${DATASET_EN}`;

const q1ExplainVi = `<p><strong>Composition, không phải kế thừa.</strong> Cách lười để viết <code>Catalog</code> là <code>class Catalog&lt;T&gt; extends LinkedHashMap&lt;String, List&lt;T&gt;&gt;</code>. Đừng. Kế thừa nghĩa là "Catalog LÀ MỘT map", tức là trao cho mọi người gọi cả <code>put</code>, <code>remove</code>, <code>clear</code> — kể cả <code>put("Java", null)</code>, thứ sẽ làm hỏng mọi phương thức bạn sắp viết ở Q2, Q3, Q4. Composition nghĩa là "Catalog CÓ MỘT map", giữ map <code>private</code>, và năm phương thức public là cánh cửa duy nhất vào nó. Chính quyết định đó khiến lớp này an toàn để kế thừa ba lần trong đề này.</p>
<p><strong>Hai lỗi mà câu này sinh ra để bắt.</strong></p>
<ul>
  <li><code>groups.get(groupKey).add(item)</code> ném <code>NullPointerException</code> khi key còn mới, vì <code>get</code> trả về <code>null</code> mà bạn lại gọi <code>.add()</code> trên hư vô. Phải tạo danh sách trước — hoặc <code>if (!groups.containsKey(k)) groups.put(k, new ArrayList&lt;T&gt;());</code>, hoặc từ JDK 8 dùng <code>groups.computeIfAbsent(k, x -&gt; new ArrayList&lt;T&gt;()).add(item);</code>. Đã kiểm: trong mọi sample run dưới đây, các nhóm <code>Java</code>, <code>Web</code>, <code>AI</code> đều sinh ra CHỈ từ <code>addItem</code> (không hề gọi <code>addGroup</code>), và không có exception nào.</li>
  <li><code>getGroup</code> trả về <code>null</code> khi key không tồn tại sẽ đẩy gánh nặng kiểm null lên mọi người gọi, mãi mãi — và chỉ cần quên một chỗ là NPE ngoài production. Trả về danh sách rỗng thì <code>for (T x : c.getGroup("Romance"))</code> đơn giản là không chạy vòng nào, đúng ý người gọi. Sample run 3 chứng minh: <code>Returned null: false</code>, <code>Size: 0</code>.</li>
</ul>
<p><strong>Vì sao dùng LinkedHashMap.</strong> <code>HashMap</code> thường sắp key theo hash, nên <code>getGroupKeys()</code> sẽ trả về thứ tự lộn xộn và còn đổi theo dữ liệu — lúc đó iterator ở Q3 chẳng còn thứ tự nào để kiểm được. <code>LinkedHashMap</code> không tốn thêm gì mà làm cả đề trở nên tất định. Sample run 4 cho thấy key trả về đúng thứ tự tạo: <code>Poetry|Java|Web|AI</code> — chú ý <code>Poetry</code> vẫn có mặt dù không chứa cuốn sách nào, và các key KHÔNG hề được sắp theo bảng chữ cái.</p>
<p>Mọi kết quả bên dưới là stdout THẬT, chụp từ <code>javac</code> + <code>java Main</code> chạy cùng harness <code>Main.class</code> trong given materials.</p>
${DATASET_VI}`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `// ===== Q1: write BOTH classes below. =====
// Given materials for this question contain only the compiled Main.class harness.

public class Book {
    private String title;
    private String author;
    private int price;

    public Book() {
    }

    public Book(String title, String author, int price) {
        // TODO
    }

    public String getTitle() {
        // TODO
        return null;
    }

    public String getAuthor() {
        // TODO
        return null;
    }

    public int getPrice() {
        // TODO
        return 0;
    }

    @Override
    public String toString() {
        // TODO: "title, author, price"
        return null;
    }
}

class Catalog<T> {
    private java.util.Map<String, java.util.List<T>> groups;

    public Catalog() {
        // TODO: new LinkedHashMap (keeps creation order)
    }

    public void addGroup(String groupKey) {
        // TODO: create an EMPTY group if the key is not there yet; otherwise do nothing
    }

    public void addItem(String groupKey, T item) {
        // TODO: create the group's list FIRST if missing, then append item
    }

    public java.util.List<T> getGroup(String groupKey) {
        // TODO: return the group's list, or an EMPTY list (never null) if the key is missing
        return null;
    }

    public java.util.List<String> getGroupKeys() {
        // TODO: all keys, in creation order
        return null;
    }
}`,
  sampleSolution: `${SOL_BOOK}\n\n// ===== Catalog.java =====\n${SOL_CATALOG}`,
  expectedOutput:
`Sample run 1 (TC 1 - Book.toString(); title="Java Core", author="Alice", price=120):
OUTPUT:
Java Core, Alice, 120

Sample run 2 (TC 2 - addItem() then getGroup("Java"); 1 empty group "Poetry" + 5 books):
OUTPUT:
Java Core, Alice, 120
Effective Java, Bloch, 250
Design Patterns, Bob, 200
Size: 3

Sample run 3 (TC 3 - getGroup("Romance"), a key that was NEVER created):
OUTPUT:
Returned null: false
Size: 0
Is empty: true

Sample run 4 (TC 4 - addGroup("Poetry") first, then the 5 books in Java/Web/AI):
OUTPUT:
Keys: Poetry|Java|Web|AI
Number of groups: 4

Extra check A (addItem into a group that addGroup already created - must append, not duplicate the key):
  addGroup("Poetry"); addItem("Poetry", "Ode To Java"/Keats/40); addItem("Java", "Java Core"/Alice/120)
OUTPUT:
Keys: Poetry|Java
Number of groups: 2

Extra check B (getGroup on that pre-created group):
OUTPUT:
Ode To Java, Keats, 40
Size: 1`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'book', criterion: B('Book has private fields, both constructors, the three getters, and toString() returning exactly "title, author, price".', 'Book có field private, đủ 2 constructor, 3 getter, và toString() trả về đúng "title, author, price".'), weight: 1, maxScore: 0.5 },
    { id: 'addItem', criterion: B('Catalog HAS-A private Map<String, List<T>> (composition, does not extend a Map) and addItem() creates the group list before appending, so adding to a brand-new key does not throw NullPointerException.', 'Catalog CHỨA một Map<String, List<T>> private (composition, không kế thừa Map) và addItem() tạo danh sách của nhóm trước khi thêm, nên thêm vào key hoàn toàn mới không ném NullPointerException.'), weight: 1, maxScore: 0.75 },
    { id: 'getGroup', criterion: B('getGroup() returns an EMPTY list (never null) for a key that does not exist, and the real list for a key that does.', 'getGroup() trả về danh sách RỖNG (không bao giờ null) với key không tồn tại, và trả về đúng danh sách thật với key có tồn tại.'), weight: 1, maxScore: 0.5 },
    { id: 'order', criterion: B('addGroup() creates an empty group without wiping an existing one, and getGroupKeys() returns the keys in creation order (LinkedHashMap).', 'addGroup() tạo nhóm rỗng mà không xoá nhóm đã có, và getGroupKeys() trả về key theo đúng thứ tự tạo (LinkedHashMap).'), weight: 1, maxScore: 0.25 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Q2 (3 marks) — StatCatalog<T>: aggregate across all groups
// ─────────────────────────────────────────────────────────────────────────────
const q2PromptEn = `<p><strong>(3 marks)</strong> The classes <strong>Book</strong> and <strong>Catalog&lt;T&gt;</strong> from Question 1 are already compiled and given in byte code format in this project, thus you can use them without creating <code>Book.java</code> or <code>Catalog.java</code>.</p>
<p>Write a class <strong>StatCatalog&lt;T&gt;</strong> extending from <strong>Catalog&lt;T&gt;</strong> (i.e. Catalog is a superclass and StatCatalog is a subclass) with the following information:</p>
${table([
  '+StatCatalog()<br/>+totalItems(): int<br/>+largestGroup(): String',
])}
<p>Where:</p>
<ul>
  <li><code>StatCatalog()</code> — default constructor.</li>
  <li><code>totalItems(): int</code> — return the total number of items stored in the WHOLE catalog, i.e. the sum of the sizes of every group. A group that was created by <code>addGroup</code> but never filled contributes 0 and must not be skipped by accident nor counted twice. If the catalog has no group at all, return 0 (do not crash).</li>
  <li><code>largestGroup(): String</code> — return the key of the group that holds the most items. If two groups tie, return the one that was created FIRST. If the catalog has no group at all, return <code>null</code>. Note: if the catalog does have groups but every one of them is empty, you still return the first key (they all tie at 0) — <code>null</code> is reserved for "there is no group".</li>
</ul>
<p><em>The map inside Catalog is private, so reach the data through the inherited <code>getGroupKeys()</code> and <code>getGroup(key)</code>.</em></p>`;

const q2PromptVi = `<p><strong>(3 điểm)</strong> Lớp <strong>Book</strong> và <strong>Catalog&lt;T&gt;</strong> ở Câu 1 đã được biên dịch sẵn dạng byte code trong project này, nên bạn dùng thẳng mà không cần tạo <code>Book.java</code> hay <code>Catalog.java</code>.</p>
<p>Viết lớp <strong>StatCatalog&lt;T&gt;</strong> kế thừa từ <strong>Catalog&lt;T&gt;</strong> (Catalog là lớp cha, StatCatalog là lớp con) với thông tin sau:</p>
${table([
  '+StatCatalog()<br/>+totalItems(): int<br/>+largestGroup(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>StatCatalog()</code> — constructor mặc định.</li>
  <li><code>totalItems(): int</code> — trả về TỔNG số phần tử trong TOÀN BỘ catalog, tức tổng kích thước của mọi nhóm. Nhóm được tạo bằng <code>addGroup</code> nhưng chưa nạp gì thì đóng góp 0, không được vô tình bỏ sót cũng không được đếm hai lần. Nếu catalog không có nhóm nào, trả về 0 (không được crash).</li>
  <li><code>largestGroup(): String</code> — trả về key của nhóm chứa nhiều phần tử nhất. Nếu hai nhóm bằng nhau, trả về nhóm được tạo TRƯỚC. Nếu catalog không có nhóm nào, trả về <code>null</code>. Lưu ý: nếu catalog CÓ nhóm nhưng mọi nhóm đều rỗng, bạn vẫn trả về key đầu tiên (chúng hoà nhau ở mức 0) — <code>null</code> chỉ dành cho trường hợp "không có nhóm nào".</li>
</ul>
<p><em>Map bên trong Catalog là private, nên hãy lấy dữ liệu qua hai phương thức kế thừa <code>getGroupKeys()</code> và <code>getGroup(key)</code>.</em></p>`;

const q2ExplainEn = `<p><strong>Aggregating across a nested collection is a two-level loop, and the outer level is a Map.</strong> There are two correct shapes: <code>for (String key : getGroupKeys()) total += getGroup(key).size();</code>, or, if you own the map directly, <code>for (Map.Entry&lt;String, List&lt;T&gt;&gt; e : map.entrySet()) total += e.getValue().size();</code>. Both are fine. What is NOT fine is <code>map.size()</code> — that counts GROUPS, not items, and on the sample data it returns 4 when the answer is 5. That single confusion is the most common wrong answer to this question.</p>
<p><strong>Empty groups are the trap.</strong> An <code>addGroup</code>-created group holds an empty list, not <code>null</code>, so <code>getGroup(key).size()</code> is a well-behaved 0 — you do not need a special case, and adding one (<code>if (size &gt; 0)</code> before recording a candidate) is exactly how people accidentally break <code>largestGroup()</code> on an all-empty catalog. Verified with a catalog of three empty groups and zero books: it returns <code>Largest group: G1</code>, <code>Total items: 0</code>, with no crash.</p>
<p><strong>Two different "nothing" cases.</strong> <code>totalItems()</code> on a brand-new catalog is 0 — an <code>int</code> can express "none". <code>largestGroup()</code> has no such neutral value, so it returns <code>null</code>, and only for a catalog with zero groups. Getting a method's empty case right is a design decision you make once and then document, not something you discover at run time. Sample run 3 pins it down.</p>
<p><strong>Tie-breaking is why Q1 insisted on LinkedHashMap.</strong> "Return the one created first" is only a meaningful rule because the key order is the creation order. Use a strict <code>&gt;</code> (not <code>&gt;=</code>) when comparing sizes and the first-seen winner survives the tie for free. Verified with Java=2 and Web=2 books: the answer is <code>Java</code>, the group created first.</p>
<p><strong>Why a subclass rather than editing Catalog.</strong> Q1's class is already compiled into <code>Catalog.class</code> here — you literally cannot edit it, which is the same constraint you meet with any library class. Extending it and reaching the data only through its public methods is the normal way out, and it is the exact pattern LAB211 uses when a manager class grows new reports every week.</p>
<p>All outputs below are real stdout captured from <code>javac</code> + <code>java Main</code>.</p>
${DATASET_EN}`;

const q2ExplainVi = `<p><strong>Tổng hợp trên collection lồng nhau là vòng lặp hai tầng, và tầng ngoài là một Map.</strong> Có hai dạng đúng: <code>for (String key : getGroupKeys()) total += getGroup(key).size();</code>, hoặc nếu bạn sở hữu map trực tiếp thì <code>for (Map.Entry&lt;String, List&lt;T&gt;&gt; e : map.entrySet()) total += e.getValue().size();</code>. Cả hai đều ổn. Thứ KHÔNG ổn là <code>map.size()</code> — nó đếm số NHÓM chứ không phải số phần tử, và trên dữ liệu mẫu nó trả 4 trong khi đáp án là 5. Nhầm lẫn đó là câu trả lời sai phổ biến nhất ở câu này.</p>
<p><strong>Nhóm rỗng chính là cái bẫy.</strong> Nhóm do <code>addGroup</code> tạo ra chứa một danh sách rỗng chứ không phải <code>null</code>, nên <code>getGroup(key).size()</code> ngoan ngoãn trả 0 — bạn không cần trường hợp đặc biệt nào, và việc thêm một cái (<code>if (size &gt; 0)</code> trước khi ghi nhận ứng viên) chính là cách người ta vô tình làm hỏng <code>largestGroup()</code> trên catalog toàn nhóm rỗng. Đã kiểm với catalog gồm ba nhóm rỗng và không cuốn sách nào: trả về <code>Largest group: G1</code>, <code>Total items: 0</code>, không crash.</p>
<p><strong>Hai kiểu "không có gì" khác nhau.</strong> <code>totalItems()</code> trên catalog mới tinh là 0 — kiểu <code>int</code> diễn đạt được "không có". <code>largestGroup()</code> không có giá trị trung tính như vậy nên trả <code>null</code>, và chỉ khi catalog không có nhóm nào. Xử lý đúng trường hợp rỗng là một quyết định thiết kế bạn chốt một lần rồi ghi lại, không phải thứ để phát hiện lúc chạy. Sample run 3 chốt điều đó.</p>
<p><strong>Phá hoà là lý do Q1 khăng khăng dùng LinkedHashMap.</strong> Quy tắc "trả về nhóm tạo trước" chỉ có nghĩa khi thứ tự key chính là thứ tự tạo. Dùng dấu <code>&gt;</code> chặt (không phải <code>&gt;=</code>) khi so kích thước thì người thắng đầu tiên tự động giữ ngôi khi hoà. Đã kiểm với Java=2 và Web=2 sách: đáp án là <code>Java</code>, nhóm được tạo trước.</p>
<p><strong>Vì sao viết lớp con thay vì sửa Catalog.</strong> Lớp ở Q1 đã được biên dịch thành <code>Catalog.class</code> trong project này — bạn không thể sửa được, đúng như ràng buộc bạn gặp với bất kỳ lớp thư viện nào. Kế thừa nó và chỉ lấy dữ liệu qua phương thức public là lối ra bình thường, và đó chính xác là mẫu LAB211 dùng khi một lớp manager mỗi tuần lại mọc thêm một báo cáo mới.</p>
<p>Mọi kết quả bên dưới là stdout THẬT, chụp từ <code>javac</code> + <code>java Main</code>.</p>
${DATASET_VI}`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `// ===== ALREADY GIVEN (compiled) - do NOT rewrite these, they are here for reference only =====
// class Book { getTitle(); getAuthor(); getPrice(); toString() -> "title, author, price" }
// class Catalog<T> {
//     Catalog();
//     void addGroup(String groupKey);
//     void addItem(String groupKey, T item);
//     java.util.List<T> getGroup(String groupKey);   // EMPTY list, never null, if absent
//     java.util.List<String> getGroupKeys();         // creation order
// }
// =============================================================================================

// ===== Q2: write ONLY this class. =====
public class StatCatalog<T> extends Catalog<T> {

    public StatCatalog() {
        // TODO
    }

    public int totalItems() {
        // TODO: sum of every group's size; empty groups count 0; 0 when there is no group
        return 0;
    }

    public String largestGroup() {
        // TODO: key of the biggest group; tie -> the one created FIRST; null when there is no group
        return null;
    }
}`,
  sampleSolution: SOL_STAT,
  expectedOutput:
`Sample run 1 (TC 1 - totalItems(); 1 empty group "Poetry" + 5 books):
OUTPUT:
Total items: 5

Sample run 2 (TC 2 - largestGroup(); same data):
OUTPUT:
Largest group: Java
Total items: 5

Sample run 3 (TC 3 - a brand-new catalog with no group at all):
OUTPUT:
Total items: 0
Largest group: null

Extra check A (tie-break: Java=2 books, Web=2 books, no empty group):
OUTPUT:
Largest group: Java
Total items: 4

Extra check B (3 groups G1,G2,G3 created empty, 0 books at all):
OUTPUT:
Largest group: G1
Total items: 0`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'total', criterion: B('totalItems() walks every group and sums getGroup(key).size(); it counts items (not groups) and counts each item exactly once.', 'totalItems() duyệt mọi nhóm và cộng getGroup(key).size(); đếm phần tử (không phải nhóm) và mỗi phần tử đúng một lần.'), weight: 1, maxScore: 1.25 },
    { id: 'largest', criterion: B('largestGroup() returns the key of the group with the most items, breaking a tie in favour of the group created first (strict > comparison over the keys in creation order).', 'largestGroup() trả về key của nhóm nhiều phần tử nhất, khi hoà thì ưu tiên nhóm tạo trước (so sánh > chặt, duyệt key theo thứ tự tạo).'), weight: 1, maxScore: 1.25 },
    { id: 'edges', criterion: B('Edge cases handled without crashing: empty catalog gives 0 and null; groups created empty contribute 0 and are still valid candidates for largestGroup().', 'Xử lý đúng biên mà không crash: catalog rỗng cho 0 và null; nhóm tạo rỗng đóng góp 0 và vẫn là ứng viên hợp lệ của largestGroup().'), weight: 1, maxScore: 0.5 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Q3 (3 marks) — IterableCatalog<T>: hand-written Iterator flattening the map
// ─────────────────────────────────────────────────────────────────────────────
const q3PromptEn = `<p><strong>(3 marks)</strong> The classes <strong>Book</strong>, <strong>Catalog&lt;T&gt;</strong> and <strong>StatCatalog&lt;T&gt;</strong> are already compiled and given in byte code format in this project, thus you can use them without creating their .java files.</p>
<p>Write a class <strong>IterableCatalog&lt;T&gt;</strong> extending from <strong>StatCatalog&lt;T&gt;</strong> and implementing <strong>Iterable&lt;T&gt;</strong>, with the following information:</p>
${table([
  '+IterableCatalog()<br/>+iterator(): Iterator&lt;T&gt;',
])}
<p>Where:</p>
<ul>
  <li><code>IterableCatalog()</code> — default constructor.</li>
  <li><code>iterator(): Iterator&lt;T&gt;</code> — return your OWN iterator, which flattens the whole nested structure into one straight line of items:
    <ul>
      <li>groups are visited in creation order (the order <code>getGroupKeys()</code> gives you); inside a group, items are visited in list order;</li>
      <li>groups that hold no item are simply skipped — including a group sitting at the very start, in the middle, or at the very end;</li>
      <li><code>hasNext(): boolean</code> — <code>true</code> if and only if at least one item is still unvisited;</li>
      <li><code>next(): T</code> — return the next item and advance. When there is nothing left, throw <code>java.util.NoSuchElementException</code>.</li>
    </ul>
  </li>
</ul>
<p><strong>You must write the Iterator yourself</strong> — the usual way is a <code>private class</code> nested inside <code>IterableCatalog</code> that implements <code>Iterator&lt;T&gt;</code> and remembers just two numbers: which group it is on, and which item inside that group it is on. Copying every item into one big <code>ArrayList</code> and returning <code>thatList.iterator()</code> does not answer this question.</p>`;

const q3PromptVi = `<p><strong>(3 điểm)</strong> Các lớp <strong>Book</strong>, <strong>Catalog&lt;T&gt;</strong> và <strong>StatCatalog&lt;T&gt;</strong> đã được biên dịch sẵn dạng byte code trong project này, nên bạn dùng thẳng mà không cần tạo file .java của chúng.</p>
<p>Viết lớp <strong>IterableCatalog&lt;T&gt;</strong> kế thừa từ <strong>StatCatalog&lt;T&gt;</strong> và implement <strong>Iterable&lt;T&gt;</strong>, với thông tin sau:</p>
${table([
  '+IterableCatalog()<br/>+iterator(): Iterator&lt;T&gt;',
])}
<p>Trong đó:</p>
<ul>
  <li><code>IterableCatalog()</code> — constructor mặc định.</li>
  <li><code>iterator(): Iterator&lt;T&gt;</code> — trả về iterator DO BẠN TỰ VIẾT, làm phẳng toàn bộ cấu trúc lồng nhau thành một dòng phần tử duy nhất:
    <ul>
      <li>duyệt các nhóm theo thứ tự tạo (đúng thứ tự <code>getGroupKeys()</code> trả về); trong một nhóm thì duyệt theo thứ tự danh sách;</li>
      <li>nhóm không chứa phần tử nào thì bỏ qua — kể cả nhóm nằm ngay ĐẦU, ở GIỮA, hay ở CUỐI;</li>
      <li><code>hasNext(): boolean</code> — <code>true</code> khi và chỉ khi còn ít nhất một phần tử chưa duyệt;</li>
      <li><code>next(): T</code> — trả về phần tử kế tiếp rồi tiến lên. Khi không còn gì, ném <code>java.util.NoSuchElementException</code>.</li>
    </ul>
  </li>
</ul>
<p><strong>Bạn phải TỰ VIẾT Iterator</strong> — cách thông thường là một <code>private class</code> lồng bên trong <code>IterableCatalog</code>, implement <code>Iterator&lt;T&gt;</code> và chỉ nhớ hai con số: đang ở nhóm nào, và đang ở phần tử thứ mấy trong nhóm đó. Chép mọi phần tử vào một <code>ArrayList</code> to đùng rồi trả <code>thatList.iterator()</code> KHÔNG phải là lời giải của câu này.</p>`;

const q3ExplainEn = `<p><strong>What for-each actually is.</strong> <code>for (Book b : catalog) { ... }</code> is not a language feature that understands your class. The compiler rewrites it into roughly <code>Iterator&lt;Book&gt; it = catalog.iterator(); while (it.hasNext()) { Book b = it.next(); ... }</code>. That is the entire contract: a class becomes for-each-able the moment it implements <code>Iterable&lt;T&gt;</code> and hands back an object with <code>hasNext()</code> and <code>next()</code>. Q4 depends on this, and so does every enhanced-for you have ever written over an <code>ArrayList</code>.</p>
<p><strong>Why the Iterator pattern exists.</strong> The caller wants to say "give me every item"; the container wants to keep its shape private. An iterator is the seam between the two — it turns a map of lists (or a tree, or a file, or a network stream) into one uniform sequence, so the caller's loop never has to know that there were groups at all. Notice what that buys you here: the harness in Q4 sorts and searches your catalog with the same two-level structure completely hidden.</p>
<p><strong>The reference solution is genuinely lazy.</strong> It stores <code>List&lt;String&gt; keys</code> (a snapshot taken in the constructor), an <code>int keyIndex</code> and an <code>int itemIndex</code>. It never builds a flat copy of the items. <code>hasNext()</code> does the real work:</p>
<pre>public boolean hasNext() {
    while (keyIndex &lt; keys.size()) {
        if (itemIndex &lt; getGroup(keys.get(keyIndex)).size()) return true;
        keyIndex++;
        itemIndex = 0;
    }
    return false;
}</pre>
<p>The <code>while</code> — not an <code>if</code> — is the whole trick: several empty groups can sit back to back and it must walk past all of them in one call. <code>next()</code> then reads the item at the current position, advances <code>itemIndex</code>, and lets the next <code>hasNext()</code> roll over to the following group when needed.</p>
<p><strong>Three ways this goes wrong, and how each was actually tested rather than reasoned about.</strong></p>
<ul>
  <li><em>Silently losing the last item.</em> Advancing <code>keyIndex</code> inside <code>next()</code> instead of letting <code>hasNext()</code> do it typically drops the final item of the final group. Sample run 1 traverses manually and prints <code>Visited: 5</code> for 5 inserted books; sample run 2 does the same through a for-each and prints <code>Match: true</code> against <code>totalItems()</code>. Counting the whole traversal is the check — eyeballing the first two <code>next()</code> calls is not.</li>
  <li><em>Looping forever.</em> If <code>hasNext()</code> returns <code>true</code> for an empty group, the loop never terminates. Verified against groups placed at the start (<code>Poetry</code> in the main data set), in the middle, and at the end.</li>
  <li><em>The exception.</em> <code>NoSuchElementException</code> lives in <code>java.util</code> and must be imported and thrown by name; returning <code>null</code> instead is a silent bug that surfaces later as an NPE. Sample run 3 exhausts the iterator and calls <code>next()</code> once more, printing the caught exception's real class name: <code>java.util.NoSuchElementException</code>.</li>
</ul>
<p><strong>About ConcurrentModificationException.</strong> Because the iterator snapshots the key list up front, adding a whole new group in the middle of a traversal does not blow up — the running traversal simply does not see it, and a fresh iterator does. Sample run 4 exercises exactly that: it visits 5, adds a 6th item to a brand-new group mid-loop, finishes cleanly at <code>Visited: 5</code>, then a new for-each reports <code>6</code>. (Iterating a <code>Map</code>'s live <code>keySet()</code> while putting into that map would instead throw <code>ConcurrentModificationException</code> — which is precisely why the snapshot is worth its one line.)</p>
<p>All outputs below are real stdout captured from <code>javac</code> + <code>java Main</code>.</p>
${DATASET_EN}`;

const q3ExplainVi = `<p><strong>for-each thực chất là gì.</strong> <code>for (Book b : catalog) { ... }</code> không phải một tính năng ngôn ngữ hiểu được lớp của bạn. Trình biên dịch viết lại nó thành đại khái <code>Iterator&lt;Book&gt; it = catalog.iterator(); while (it.hasNext()) { Book b = it.next(); ... }</code>. Toàn bộ hợp đồng chỉ có thế: một lớp trở nên dùng được với for-each ngay khi nó implement <code>Iterable&lt;T&gt;</code> và trả về một đối tượng có <code>hasNext()</code> và <code>next()</code>. Q4 dựa vào điều này, và mọi vòng for-each bạn từng viết trên <code>ArrayList</code> cũng vậy.</p>
<p><strong>Vì sao có mẫu Iterator.</strong> Người gọi muốn nói "đưa tôi từng phần tử"; container lại muốn giấu kín hình dạng của nó. Iterator là đường nối giữa hai bên — nó biến một map chứa các list (hoặc một cây, một file, một luồng mạng) thành một dãy đồng nhất, để vòng lặp bên gọi không bao giờ cần biết là đã từng có "nhóm". Hãy để ý cái lợi ngay tại đây: harness ở Q4 sắp xếp và tìm kiếm trên catalog của bạn mà cấu trúc hai tầng bị giấu hoàn toàn.</p>
<p><strong>Lời giải tham khảo lười thật sự.</strong> Nó lưu <code>List&lt;String&gt; keys</code> (một bản chụp lấy trong constructor), một <code>int keyIndex</code> và một <code>int itemIndex</code>. Nó không hề dựng bản sao phẳng của các phần tử. <code>hasNext()</code> mới là nơi làm việc thật:</p>
<pre>public boolean hasNext() {
    while (keyIndex &lt; keys.size()) {
        if (itemIndex &lt; getGroup(keys.get(keyIndex)).size()) return true;
        keyIndex++;
        itemIndex = 0;
    }
    return false;
}</pre>
<p>Dùng <code>while</code> chứ không phải <code>if</code> chính là mấu chốt: nhiều nhóm rỗng có thể nằm liền nhau, và một lần gọi phải bước qua hết tất cả. Sau đó <code>next()</code> đọc phần tử ở vị trí hiện tại, tăng <code>itemIndex</code>, và để lần <code>hasNext()</code> sau tự lăn sang nhóm kế tiếp khi cần.</p>
<p><strong>Ba kiểu sai, và mỗi kiểu đã được CHẠY THẬT để kiểm chứ không phải suy luận.</strong></p>
<ul>
  <li><em>Âm thầm mất phần tử cuối.</em> Tăng <code>keyIndex</code> bên trong <code>next()</code> thay vì để <code>hasNext()</code> làm việc đó thường làm rơi mất phần tử cuối của nhóm cuối. Sample run 1 duyệt tay và in <code>Visited: 5</code> với 5 cuốn sách đã nạp; sample run 2 làm y hệt qua for-each và in <code>Match: true</code> khi đối chiếu <code>totalItems()</code>. Đếm cả lượt duyệt mới là kiểm — liếc hai lời gọi <code>next()</code> đầu thì không.</li>
  <li><em>Lặp vô tận.</em> Nếu <code>hasNext()</code> trả <code>true</code> cho một nhóm rỗng, vòng lặp không bao giờ dừng. Đã kiểm với nhóm rỗng đặt ở ĐẦU (<code>Poetry</code> trong bộ dữ liệu chính), ở GIỮA, và ở CUỐI.</li>
  <li><em>Cái exception.</em> <code>NoSuchElementException</code> nằm trong <code>java.util</code>, phải import và ném đúng tên; trả về <code>null</code> thay thế là một lỗi âm thầm, sau này nổ ra thành NPE ở chỗ khác. Sample run 3 duyệt cạn iterator rồi gọi <code>next()</code> thêm một lần, in ra đúng tên lớp exception bắt được: <code>java.util.NoSuchElementException</code>.</li>
</ul>
<p><strong>Về ConcurrentModificationException.</strong> Vì iterator chụp trước danh sách key, việc thêm hẳn một nhóm mới giữa lúc đang duyệt không làm nổ chương trình — lượt duyệt đang chạy đơn giản là không thấy nó, còn iterator mới thì thấy. Sample run 4 kiểm đúng tình huống đó: duyệt 5 phần tử, giữa vòng lặp thêm phần tử thứ 6 vào một nhóm hoàn toàn mới, kết thúc sạch sẽ ở <code>Visited: 5</code>, rồi một for-each mới báo <code>6</code>. (Ngược lại, duyệt trực tiếp <code>keySet()</code> sống của một <code>Map</code> trong khi put vào chính map đó sẽ ném <code>ConcurrentModificationException</code> — đó chính là lý do một dòng chụp key kia đáng giá.)</p>
<p>Mọi kết quả bên dưới là stdout THẬT, chụp từ <code>javac</code> + <code>java Main</code>.</p>
${DATASET_VI}`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `// ===== ALREADY GIVEN (compiled) - do NOT rewrite these, they are here for reference only =====
// class Book { getTitle(); getAuthor(); getPrice(); toString() -> "title, author, price" }
// class Catalog<T> {
//     void addGroup(String groupKey);
//     void addItem(String groupKey, T item);
//     java.util.List<T> getGroup(String groupKey);   // EMPTY list, never null, if absent
//     java.util.List<String> getGroupKeys();         // creation order
// }
// class StatCatalog<T> extends Catalog<T> { int totalItems(); String largestGroup(); }
// =============================================================================================

import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

// ===== Q3: write ONLY this class (plus its own iterator). =====
public class IterableCatalog<T> extends StatCatalog<T> implements Iterable<T> {

    public IterableCatalog() {
        // TODO
    }

    @Override
    public Iterator<T> iterator() {
        // TODO: return your own iterator over ALL items of ALL groups
        return null;
    }

    private class CatalogIterator implements Iterator<T> {
        // TODO: remember the group keys, the current group index and the current item index

        @Override
        public boolean hasNext() {
            // TODO: skip past every already-consumed / empty group, then report whether an item remains
            return false;
        }

        @Override
        public T next() {
            // TODO: return the item at the current position and advance;
            //       throw new NoSuchElementException() when nothing is left
            return null;
        }
    }
}`,
  sampleSolution: SOL_ITERABLE,
  expectedOutput:
`Sample run 1 (TC 1 - manual hasNext()/next() traversal; 1 empty group "Poetry" + 5 books):
OUTPUT:
1. Java Core, Alice, 120
2. Effective Java, Bloch, 250
3. Design Patterns, Bob, 200
4. HTML5 Basics, Carol, 90
5. Deep Learning, Ian, 300
Visited: 5

Sample run 2 (TC 2 - the same catalog walked by a real for-each loop):
OUTPUT:
Java Core
Effective Java
Design Patterns
HTML5 Basics
Deep Learning
Visited: 5
totalItems(): 5
Match: true
Sum of price: 960

Sample run 3 (TC 3 - exhaust the iterator, then call next() ONE time too many):
OUTPUT:
Visited: 5
hasNext() after the last item: false
Exception: java.util.NoSuchElementException

Sample run 4 (TC 4 - add a brand-new group in the MIDDLE of a traversal):
OUTPUT:
1. Java Core
2. Effective Java
-- added a new group in the middle --
3. Design Patterns
4. HTML5 Basics
5. Deep Learning
Visited: 5
totalItems() now: 6
Visited by a NEW iterator: 6

Extra check A (TC 3 on a catalog with NO group at all):
OUTPUT:
Visited: 0
hasNext() after the last item: false
Exception: java.util.NoSuchElementException

Extra check B (TC 1 with an empty group sitting AFTER the last non-empty one):
OUTPUT:
1. b1, x, 1
2. b2, x, 2
Visited: 2`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'iterable', criterion: B('The class declares implements Iterable<T>, overrides iterator(), and returns a hand-written Iterator<T> that walks the nested Map/List structure with its own indices — NOT the iterator of a flat copy of every item.', 'Lớp khai báo implements Iterable<T>, override iterator(), và trả về một Iterator<T> tự viết duyệt thẳng cấu trúc Map/List lồng nhau bằng chỉ số riêng — KHÔNG phải iterator của một bản sao phẳng chứa mọi phần tử.'), weight: 1, maxScore: 1 },
    { id: 'traverse', criterion: B('hasNext()/next() flatten every group in creation order and every item in list order, skipping empty groups wherever they sit (first, middle, last), never dropping the last item of the last group and never looping forever: a full traversal yields exactly totalItems() items.', 'hasNext()/next() làm phẳng mọi nhóm theo thứ tự tạo và mọi phần tử theo thứ tự danh sách, bỏ qua nhóm rỗng dù nằm ở đâu (đầu, giữa, cuối), không làm rơi phần tử cuối của nhóm cuối và không lặp vô tận: duyệt hết cho ra đúng totalItems() phần tử.'), weight: 1, maxScore: 1.25 },
    { id: 'exception', criterion: B('next() throws java.util.NoSuchElementException (imported and thrown by name) once the traversal is exhausted, instead of returning null or throwing IndexOutOfBoundsException.', 'next() ném java.util.NoSuchElementException (có import và ném đúng tên) khi đã duyệt cạn, thay vì trả null hay ném IndexOutOfBoundsException.'), weight: 1, maxScore: 0.75 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Q4 (2 marks) — SmartCatalog<T>: consume the iterator through for-each
// ─────────────────────────────────────────────────────────────────────────────
const q4PromptEn = `<p><strong>(2 marks)</strong> The classes <strong>Book</strong>, <strong>Catalog&lt;T&gt;</strong>, <strong>StatCatalog&lt;T&gt;</strong> and <strong>IterableCatalog&lt;T&gt;</strong> are already compiled and given in byte code format in this project, thus you can use them without creating their .java files.</p>
<p>Write a class <strong>SmartCatalog&lt;T&gt;</strong> extending from <strong>IterableCatalog&lt;T&gt;</strong> with the following information:</p>
${table([
  '+SmartCatalog()<br/>+findMax(cmp: Comparator&lt;T&gt;): T<br/>+toSortedList(cmp: Comparator&lt;T&gt;): List&lt;T&gt;',
])}
<p>Where:</p>
<ul>
  <li><code>SmartCatalog()</code> — default constructor.</li>
  <li><code>findMax(cmp): T</code> — return the single greatest item of the WHOLE catalog according to <code>cmp</code> (greatest = the one no other item compares greater than). Return <code>null</code> if the catalog holds no item at all — including the case where it holds several groups that are all empty.</li>
  <li><code>toSortedList(cmp): List&lt;T&gt;</code> — return a NEW <code>List&lt;T&gt;</code> containing every item of every group, sorted by <code>cmp</code>. Return an empty list if the catalog holds no item.</li>
</ul>
<p><strong>Both methods must read the items with an enhanced for loop over the catalog itself</strong> — <code>for (T item : this) { ... }</code> — which is legal precisely because Question 3 made the class <code>Iterable&lt;T&gt;</code>. Do NOT go back to <code>getGroupKeys()</code> + <code>getGroup(key)</code> here: the point of this question is that the two-level structure has become invisible.</p>`;

const q4PromptVi = `<p><strong>(2 điểm)</strong> Các lớp <strong>Book</strong>, <strong>Catalog&lt;T&gt;</strong>, <strong>StatCatalog&lt;T&gt;</strong> và <strong>IterableCatalog&lt;T&gt;</strong> đã được biên dịch sẵn dạng byte code trong project này, nên bạn dùng thẳng mà không cần tạo file .java của chúng.</p>
<p>Viết lớp <strong>SmartCatalog&lt;T&gt;</strong> kế thừa từ <strong>IterableCatalog&lt;T&gt;</strong> với thông tin sau:</p>
${table([
  '+SmartCatalog()<br/>+findMax(cmp: Comparator&lt;T&gt;): T<br/>+toSortedList(cmp: Comparator&lt;T&gt;): List&lt;T&gt;',
])}
<p>Trong đó:</p>
<ul>
  <li><code>SmartCatalog()</code> — constructor mặc định.</li>
  <li><code>findMax(cmp): T</code> — trả về phần tử LỚN NHẤT của TOÀN BỘ catalog theo <code>cmp</code> (lớn nhất = phần tử không có phần tử nào khác lớn hơn). Trả về <code>null</code> nếu catalog không có phần tử nào — kể cả khi nó có vài nhóm nhưng nhóm nào cũng rỗng.</li>
  <li><code>toSortedList(cmp): List&lt;T&gt;</code> — trả về một <code>List&lt;T&gt;</code> MỚI chứa mọi phần tử của mọi nhóm, đã sắp theo <code>cmp</code>. Trả về danh sách rỗng nếu catalog không có phần tử nào.</li>
</ul>
<p><strong>Cả hai phương thức phải đọc phần tử bằng vòng for-each trên chính catalog</strong> — <code>for (T item : this) { ... }</code> — điều này hợp lệ chính vì Câu 3 đã làm lớp này thành <code>Iterable&lt;T&gt;</code>. ĐỪNG quay lại dùng <code>getGroupKeys()</code> + <code>getGroup(key)</code> ở đây: ý nghĩa của câu này là cấu trúc hai tầng đã trở nên vô hình.</p>`;

const q4ExplainEn = `<p><strong>This question is the proof that Question 3 actually worked.</strong> An iterator you only ever call by hand is easy to fool yourself about. The moment you write <code>for (T item : this)</code>, the compiler calls <code>this.iterator()</code>, then <code>hasNext()</code> and <code>next()</code> in a loop it wrote itself — if your indices were wrong, <code>findMax</code> silently returns the second-largest item and nobody sees an error. Sample run 1 is designed to catch that: the most expensive book, <code>Deep Learning</code> at 300, is the very LAST item of the very LAST group in traversal order, so an iterator that drops the final element answers <code>Effective Java</code> and fails.</p>
<p><strong>Why a Comparator parameter instead of hard-coding "by price".</strong> <code>SmartCatalog&lt;T&gt;</code> does not know what a <code>T</code> is — it cannot mention <code>getPrice()</code>. Passing the comparison in as a <code>Comparator&lt;T&gt;</code> is what keeps the class generic, and it means one <code>findMax</code> serves every ordering: sample run 1 calls it twice, once with a by-price comparator and once with the reversed one, and gets the most expensive and the cheapest book out of the same method. This is exactly the shape LAB211 asks for when a manager class must sort the same records by name, then by date, then by score.</p>
<p><strong>Handling "no items" without a special case.</strong> Starting <code>best</code> at <code>null</code> and testing <code>best == null || cmp.compare(item, best) &gt; 0</code> means an empty traversal never enters the loop and <code>null</code> falls straight out — no counting, no <code>isEmpty()</code> check, no crash. Verified twice: on a brand-new catalog and on a catalog holding two groups that are both empty, both print <code>null</code>.</p>
<p><strong>toSortedList must return a new list.</strong> Collect into a fresh <code>ArrayList&lt;T&gt;</code>, then <code>Collections.sort(all, cmp)</code>. Sorting a list you got from <code>getGroup()</code> would reorder the catalog's own storage behind its back — a mutation the caller never asked for. The output is one flat run of all 5 books sorted by title, and note the order is nothing like the traversal order: the flattening and the sorting are two separate jobs.</p>
<p><strong>The whole chain, in one sentence.</strong> Q1 chose composition so the map stayed private; Q2 reached the data only through public methods; Q3 turned the private two-level shape into a flat sequence; Q4 consumed that sequence with ordinary Java syntax and never mentioned a group. That is the layered design LAB211 keeps asking for.</p>
<p>All outputs below are real stdout captured from <code>javac</code> + <code>java Main</code>.</p>
${DATASET_EN}`;

const q4ExplainVi = `<p><strong>Câu này là bằng chứng cho thấy Câu 3 thật sự chạy đúng.</strong> Một iterator mà bạn chỉ gọi tay thì rất dễ tự đánh lừa mình. Ngay khi bạn viết <code>for (T item : this)</code>, trình biên dịch gọi <code>this.iterator()</code>, rồi <code>hasNext()</code> và <code>next()</code> trong một vòng lặp do chính nó sinh ra — nếu chỉ số của bạn sai, <code>findMax</code> âm thầm trả về phần tử lớn thứ nhì và chẳng ai thấy lỗi nào. Sample run 1 được thiết kế để bắt đúng điều đó: cuốn đắt nhất, <code>Deep Learning</code> giá 300, chính là phần tử CUỐI CÙNG của nhóm CUỐI CÙNG theo thứ tự duyệt, nên iterator làm rơi phần tử cuối sẽ trả lời <code>Effective Java</code> và trượt.</p>
<p><strong>Vì sao nhận tham số Comparator thay vì chôn cứng "so theo price".</strong> <code>SmartCatalog&lt;T&gt;</code> không biết <code>T</code> là gì — nó không thể gọi <code>getPrice()</code>. Truyền phép so sánh vào dưới dạng <code>Comparator&lt;T&gt;</code> chính là thứ giữ cho lớp này generic, và nhờ vậy một <code>findMax</code> phục vụ mọi thứ tự: sample run 1 gọi nó hai lần, một lần với comparator theo giá và một lần với comparator đảo ngược, lấy ra cuốn đắt nhất và cuốn rẻ nhất từ cùng một phương thức. Đây đúng là dáng dấp LAB211 yêu cầu khi một lớp manager phải sắp cùng bộ hồ sơ theo tên, rồi theo ngày, rồi theo điểm.</p>
<p><strong>Xử lý "không có phần tử nào" mà không cần trường hợp đặc biệt.</strong> Khởi tạo <code>best</code> bằng <code>null</code> và kiểm <code>best == null || cmp.compare(item, best) &gt; 0</code> nghĩa là lượt duyệt rỗng không vào vòng lặp lần nào và <code>null</code> rơi thẳng ra ngoài — không đếm, không cần <code>isEmpty()</code>, không crash. Đã kiểm hai lần: trên catalog mới tinh và trên catalog có hai nhóm nhưng cả hai đều rỗng, cả hai đều in <code>null</code>.</p>
<p><strong>toSortedList phải trả về danh sách MỚI.</strong> Gom vào một <code>ArrayList&lt;T&gt;</code> mới, rồi <code>Collections.sort(all, cmp)</code>. Sắp xếp thẳng trên danh sách lấy từ <code>getGroup()</code> sẽ đảo lộn kho lưu trữ của chính catalog sau lưng nó — một thay đổi mà người gọi không hề yêu cầu. Kết quả là một dãy phẳng đủ 5 cuốn sách sắp theo tiêu đề, và để ý thứ tự đó chẳng giống thứ tự duyệt chút nào: làm phẳng và sắp xếp là hai việc tách biệt.</p>
<p><strong>Cả chuỗi, gói trong một câu.</strong> Q1 chọn composition để map ở lại private; Q2 chạm dữ liệu chỉ qua phương thức public; Q3 biến hình dạng hai tầng riêng tư thành một dãy phẳng; Q4 tiêu thụ dãy đó bằng cú pháp Java bình thường và không hề nhắc tới chữ "nhóm". Đó chính là thiết kế phân tầng mà LAB211 liên tục đòi hỏi.</p>
<p>Mọi kết quả bên dưới là stdout THẬT, chụp từ <code>javac</code> + <code>java Main</code>.</p>
${DATASET_VI}`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `// ===== ALREADY GIVEN (compiled) - do NOT rewrite these, they are here for reference only =====
// class Book { getTitle(); getAuthor(); getPrice(); toString() -> "title, author, price" }
// class Catalog<T> {
//     void addGroup(String groupKey);
//     void addItem(String groupKey, T item);
//     java.util.List<T> getGroup(String groupKey);   // EMPTY list, never null, if absent
//     java.util.List<String> getGroupKeys();         // creation order
// }
// class StatCatalog<T> extends Catalog<T> { int totalItems(); String largestGroup(); }
// class IterableCatalog<T> extends StatCatalog<T> implements Iterable<T> {
//     java.util.Iterator<T> iterator();   // flattens every group -> so for-each works
// }
// =============================================================================================

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

// ===== Q4: write ONLY this class. =====
public class SmartCatalog<T> extends IterableCatalog<T> {

    public SmartCatalog() {
        // TODO
    }

    public T findMax(Comparator<T> cmp) {
        // TODO: use  for (T item : this)  and keep the greatest one; null when there is no item
        return null;
    }

    public List<T> toSortedList(Comparator<T> cmp) {
        // TODO: use  for (T item : this)  to collect into a NEW list, then Collections.sort(list, cmp)
        return null;
    }
}`,
  sampleSolution: SOL_SMART,
  expectedOutput:
`Sample run 1 (TC 1 - findMax() by price, then findMax() with the reversed comparator):
OUTPUT:
Most expensive: Deep Learning, Ian, 300
Cheapest: HTML5 Basics, Carol, 90

Sample run 2 (TC 2 - toSortedList() by title):
OUTPUT:
Deep Learning, Ian, 300
Design Patterns, Bob, 200
Effective Java, Bloch, 250
HTML5 Basics, Carol, 90
Java Core, Alice, 120
Size: 5

Sample run 3 (TC 3 - a brand-new catalog with no group at all):
OUTPUT:
Most expensive: null
Sorted size: 0

Extra check A (a catalog holding 2 groups G1,G2 that are both EMPTY):
OUTPUT:
Most expensive: null
Cheapest: null`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'findMax', criterion: B('findMax() returns the greatest item across ALL groups for the given Comparator, including when the winner is the very last item of the very last group, and returns null when the catalog holds no item.', 'findMax() trả về phần tử lớn nhất trên TOÀN BỘ các nhóm theo Comparator được truyền vào, kể cả khi phần tử thắng là phần tử cuối cùng của nhóm cuối cùng, và trả về null khi catalog không có phần tử nào.'), weight: 1, maxScore: 1 },
    { id: 'sorted', criterion: B('toSortedList() collects every item into a NEW List<T> and sorts it with the given Comparator (e.g. Collections.sort), without reordering the catalog\'s own stored lists; empty catalog gives an empty list.', 'toSortedList() gom mọi phần tử vào một List<T> MỚI rồi sắp bằng Comparator được truyền vào (vd Collections.sort), không làm đảo thứ tự các danh sách lưu bên trong catalog; catalog rỗng cho danh sách rỗng.'), weight: 1, maxScore: 0.75 },
    { id: 'foreach', criterion: B('Both methods read the items via an enhanced for loop over the catalog itself — for (T item : this) — relying on Iterable<T> from Q3, not via getGroupKeys()/getGroup().', 'Cả hai phương thức đọc phần tử bằng vòng for-each trên chính catalog — for (T item : this) — dựa vào Iterable<T> ở Q3, không dùng getGroupKeys()/getGroup().'), weight: 1, maxScore: 0.25 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-ADV5',
      title: B(
        'PRO192 — Advanced Practice 5: Composition, Nested Collections & Custom Iterator (Nâng cao)',
        'PRO192 — Luyện tập Nâng cao 5: Kết Hợp Đối Tượng, Collection Lồng Nhau & Iterator Tự Viết',
      ),
      description: B(
        'Self-authored supplementary practice paper — NOT a real school exam. Four cumulative questions (10 marks) that build one class chain: a Book, a Catalog that HAS-A Map<String, List<T>> (composition, not inheritance), a subclass that aggregates across every group, a subclass implementing Iterable<T> with a hand-written lazy Iterator that flattens the nested map, and a final subclass that consumes it through a plain for-each with a Comparator. It goes deeper into OOP than the standard PE papers on purpose: it is aimed at bridging into LAB211 (semester 3), whose layered systems manage collections-of-collections constantly but never teach you to write your own Iterator. Every sample output shown is real stdout captured by compiling the reference solution against the given Main.class harness and running it, including the NoSuchElementException and full-traversal count proofs.',
        'Đề luyện tập tự soạn — KHÔNG phải đề thi thật của trường. Bốn câu cộng dồn (10 điểm) dựng nên một chuỗi lớp: lớp Book, lớp Catalog CHỨA một Map<String, List<T>> (composition, không phải kế thừa), lớp con tổng hợp số liệu xuyên mọi nhóm, lớp con implement Iterable<T> với Iterator tự viết kiểu lười làm phẳng map lồng nhau, và lớp con cuối tiêu thụ nó bằng for-each thuần cùng một Comparator. Đề cố ý đào sâu OOP hơn các đề PE chuẩn: mục tiêu là bắc cầu sang LAB211 (kỳ 3) — nơi các hệ thống phân tầng quản lý collection lồng collection suốt ngày nhưng không bao giờ dạy bạn tự viết Iterator. Mọi kết quả mẫu hiển thị đều là stdout THẬT, chụp lại bằng cách biên dịch lời giải tham khảo cùng harness Main.class trong given materials rồi chạy thật, gồm cả bằng chứng NoSuchElementException và số phần tử duyệt được của cả lượt for-each.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      source: 'SAMPLE',
      isPublished: true,
      instructions,
      attachmentUrl: ATTACHMENT_URL,
      attachmentName: B(
        'Download given materials (Q1-Q4, buildable NetBeans projects)',
        'Tải given materials (Q1-Q4, project NetBeans build được)',
      ),
      questions: [q1, q2, q3, q4],
    },
  ],
};

fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-pro192-pe-adv5.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`Wrote ${OUT}`);
