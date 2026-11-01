/** PRO192 · 7.1 — Managing many objects: mảng đầy một phần (size), thêm/tìm, xoá dời trái, chèn dời phải, tự nới ×2. */
import { moDun, deJava, c, j } from './_chung.mjs';

const KHONG_COLLECTION = { id: 'R1', en: 'arrays only — no ArrayList/List/Vector in ItemList', vi: 'chỉ dùng mảng — không ArrayList/List/Vector trong ItemList', re: String.raw`\b(ArrayList|LinkedList|Vector|List|Collections|Arrays\s*\.\s*asList)\b`, file: 'ItemList' };

const ITEM = j`
// GIVEN — do not change.
public class Item {
    private final String code;
    private final String name;
    private final int price;

    public Item(String code, String name, int price) {
        this.code = code;
        this.name = name;
        this.price = price;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public int getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return code + ":" + name + ":" + price;
    }
}
`;
const HARNESS = (lenh) => j`
import java.util.Scanner;

// Grader test class (do not edit): drives an ItemList with commands.
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ItemList list = new ItemList(Integer.parseInt(sc.nextLine().trim()));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            String r;
${lenh}
            System.out.println(String.join(";", p) + " -> " + r + " | " + list + " (size " + list.size() + ")");
        }
    }
}
`;

const de1 = deJava({
  id: 'pro192-7-1-partly-filled',
  tieuDe: { en: 'A partly filled array: add, find, count', vi: 'Mảng đầy một phần: thêm, tìm, đếm' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['array + size counter', 'capacity vs size', 'linear search', 'returning null when absent'],
  moTa: {
    en: `<p>The antique-shop case study of chapter 7: an ${c('Item[]')} with a ${c('size')} counter — slots ${c('0..size-1')} are used, the rest are ${c('null')}. Write ${c('ItemList')}:</p>
<ul><li>${c('ItemList(int capacity)')}; ${c('int size()')};</li>
<li>${c('boolean add(Item it)')} — refuses (false) when full or when the code already exists (codes compared ignoring case);</li>
<li>${c('Item find(String code)')} — null when absent; ${c('int countCheaperThan(int price)')};</li>
<li>${c('toString()')} → ${c('"[A1:Vase:500, B2:Lamp:300]"')} — only the used slots.</li></ul>`,
    vi: `<p>Case study cửa hàng đồ cổ của chương 7: một ${c('Item[]')} kèm bộ đếm ${c('size')} — ô ${c('0..size-1')} đã dùng, còn lại ${c('null')}. Viết ${c('ItemList')}: ${c('ItemList(int capacity)')}; ${c('size()')}; ${c('add(Item)')} (từ chối khi đầy hoặc mã đã có — so mã không phân biệt hoa thường); ${c('find(String code)')} (null khi không có); ${c('countCheaperThan(int price)')}; ${c('toString()')} → ${c('"[A1:Vase:500, B2:Lamp:300]"')} — chỉ các ô đã dùng.</p>`,
  },
  yeuCau: { en: ['Store the items in an Item[] — no collection classes (rule R1).', 'Item.java is given.'], vi: ['Lưu trong Item[] — không dùng lớp collection (luật R1).', 'Item.java cho sẵn.'] },
  dauVao: { en: 'Capacity, then ADD;code;name;price · FIND;code · CHEAP;price.', vi: 'Sức chứa, rồi ADD;mã;tên;giá · FIND;mã · CHEAP;giá.' },
  dauRa: { en: 'Result and the list after each command.', vi: 'Kết quả và danh sách sau mỗi lệnh.' },
  main: 'KiemTra', quyTac: [KHONG_COLLECTION],
  harness: {
    'KiemTra.java': HARNESS(`            if (p[0].equals("ADD")) {
                r = String.valueOf(list.add(new Item(p[1], p[2], Integer.parseInt(p[3]))));
            } else if (p[0].equals("FIND")) {
                r = String.valueOf(list.find(p[1]));
            } else {
                r = String.valueOf(list.countCheaperThan(Integer.parseInt(p[1])));
            }`),
  },
  tep: {
    'Item.java': ITEM,
    'ItemList.java': j`
// Items kept in a partly filled array: slots 0..size-1 are used.
public class ItemList {
    private final Item[] items;
    private int size;

    public ItemList(int capacity) {
        items = new Item[capacity];
    }

    public int size() {
        return size;
    }

    public boolean add(Item it) {
        //>> return false; // TODO: refuse when full or when the code exists
        if (size == items.length || find(it.getCode()) != null) {
            return false;
        }
        items[size++] = it;
        return true;
        //<<
    }

    public Item find(String code) {
        //>> return null; // TODO: look only at slots 0..size-1
        for (int i = 0; i < size; i++) {
            if (items[i].getCode().equalsIgnoreCase(code)) {
                return items[i];
            }
        }
        return null;
        //<<
    }

    public int countCheaperThan(int price) {
        //>> return 0; // TODO
        int count = 0;
        for (int i = 0; i < size; i++) {
            if (items[i].getPrice() < price) {
                count++;
            }
        }
        return count;
        //<<
    }

    @Override
    public String toString() {
        //>> return "[]"; // TODO
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < size; i++) {
            sb.append(i == 0 ? "" : ", ").append(items[i]);
        }
        return sb.append(']').toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'add until full, find', vi: 'thêm tới đầy, tìm' }, vao: '3\nADD;A1;Vase;500\nADD;B2;Lamp;300\nADD;a1;Copy;1\nADD;C3;Clock;900\nADD;D4;Chair;100\nFIND;b2\nFIND;Z9\nCHEAP;500\n' },
    { ten: { en: 'empty list and capacity 1', vi: 'danh sách rỗng và sức chứa 1' }, vao: '1\nFIND;A1\nCHEAP;1000\nADD;X;Only;5\nADD;Y;Late;6\nCHEAP;6\n', an: true },
  ],
  goiY: [
    { en: 'Loop to size, never to items.length — the slots after size are null and items[i].getCode() would throw NullPointerException.', vi: 'Lặp tới size, không tới items.length — các ô sau size là null và items[i].getCode() sẽ ném NullPointerException.' },
    { en: 'items[size++] = it stores in the first free slot and moves the counter in one statement.', vi: 'items[size++] = it ghi vào ô trống đầu tiên và tăng bộ đếm trong một câu lệnh.' },
  ],
  loiHayGap: [
    { en: 'Looping to items.length — NullPointerException on the first empty slot.', vi: 'Lặp tới items.length — NullPointerException ở ô trống đầu tiên.' },
    { en: 'Comparing codes with == or equals (case-sensitive) — "a1" is not recognised as a duplicate of "A1".', vi: 'So mã bằng == hoặc equals (phân biệt hoa thường) — "a1" không bị coi là trùng với "A1".' },
  ],
  giaiThich: { en: '<p>A fixed array plus a size counter is the simplest list: the invariant "slots 0..size-1 are used, the others are null" makes add O(1) and every search a loop to size.</p>', vi: '<p>Mảng cố định kèm bộ đếm size là danh sách đơn giản nhất: bất biến "ô 0..size-1 đã dùng, còn lại null" làm thao tác thêm O(1) và mọi phép tìm là vòng lặp tới size.</p>' },
});

const de2 = deJava({
  id: 'pro192-7-1-remove-shift',
  tieuDe: { en: 'Remove without holes: shift left, and remove every match', vi: 'Xoá không để lỗ: dời trái, và xoá mọi phần tử khớp' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['shift left', 'clear the last slot', 'remove while looping', 'two-index compaction'],
  moTa: {
    en: `<p>Extend the array list with removal. After a removal the used slots must stay contiguous (no ${c('null')} hole) and the slot that becomes free is set to ${c('null')}.</p>
<ul><li>${c('Item removeAt(int index)')} — returns the removed item; an index outside ${c('0..size-1')} returns null and changes nothing.</li>
<li>${c('boolean remove(String code)')} — the item with that code (ignore case).</li>
<li>${c('int removeCheaperThan(int price)')} — removes <b>every</b> item cheaper than the price in one pass, keeping the order of the others; returns how many were removed.</li></ul>`,
    vi: `<p>Mở rộng danh sách mảng với thao tác xoá. Sau khi xoá, các ô đã dùng phải liền nhau (không lỗ ${c('null')}) và ô vừa trống được gán ${c('null')}: ${c('removeAt(int index)')} (chỉ số ngoài ${c('0..size-1')} trả null, không đổi gì), ${c('remove(String code)')} (không phân biệt hoa thường), ${c('removeCheaperThan(int price)')} — xoá <b>mọi</b> món rẻ hơn giá trong một lượt, giữ thứ tự các món còn lại, trả số món đã xoá.</p>`,
  },
  yeuCau: { en: ['Arrays only (rule R1). add/find/toString are given.'], vi: ['Chỉ dùng mảng (luật R1). add/find/toString cho sẵn.'] },
  dauVao: { en: 'Capacity, then ADD;… · DEL;index · RM;code · CHEAP;price.', vi: 'Sức chứa, rồi ADD;… · DEL;chỉ số · RM;mã · CHEAP;giá.' },
  dauRa: { en: 'Result and the list after each command.', vi: 'Kết quả và danh sách sau mỗi lệnh.' },
  main: 'KiemTra', quyTac: [KHONG_COLLECTION],
  harness: {
    'KiemTra.java': HARNESS(`            if (p[0].equals("ADD")) {
                r = String.valueOf(list.add(new Item(p[1], p[2], Integer.parseInt(p[3]))));
            } else if (p[0].equals("DEL")) {
                r = String.valueOf(list.removeAt(Integer.parseInt(p[1])));
            } else if (p[0].equals("RM")) {
                r = String.valueOf(list.remove(p[1]));
            } else {
                r = String.valueOf(list.removeCheaperThan(Integer.parseInt(p[1]))) + " removed, slot after last = " + list.slotAfterLast();
            }`),
  },
  tep: {
    'Item.java': ITEM,
    'ItemList.java': j`
// Items in a partly filled array; removals keep the used slots contiguous.
public class ItemList {
    private final Item[] items;
    private int size;

    public ItemList(int capacity) {
        items = new Item[capacity];
    }

    public int size() {
        return size;
    }

    // for the grader: what is stored right after the last used slot (must be null)
    public String slotAfterLast() {
        return size < items.length ? String.valueOf(items[size]) : "(full)";
    }

    public boolean add(Item it) {
        if (size == items.length || indexOf(it.getCode()) >= 0) {
            return false;
        }
        items[size++] = it;
        return true;
    }

    private int indexOf(String code) {
        for (int i = 0; i < size; i++) {
            if (items[i].getCode().equalsIgnoreCase(code)) {
                return i;
            }
        }
        return -1;
    }

    public Item removeAt(int index) {
        //>> return null; // TODO: shift items[index+1..size-1] one slot left, clear the last slot
        if (index < 0 || index >= size) {
            return null;
        }
        Item removed = items[index];
        for (int i = index; i < size - 1; i++) {
            items[i] = items[i + 1];
        }
        items[--size] = null;
        return removed;
        //<<
    }

    public boolean remove(String code) {
        //>> return false; // TODO
        int i = indexOf(code);
        return i >= 0 && removeAt(i) != null;
        //<<
    }

    public int removeCheaperThan(int price) {
        //>> return 0; // TODO: one pass, keep the order (copy the kept items forward)
        int kept = 0;
        for (int i = 0; i < size; i++) {
            if (items[i].getPrice() >= price) {
                items[kept++] = items[i];
            }
        }
        int removed = size - kept;
        for (int i = kept; i < size; i++) {
            items[i] = null;
        }
        size = kept;
        return removed;
        //<<
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < size; i++) {
            sb.append(i == 0 ? "" : ", ").append(items[i]);
        }
        return sb.append(']').toString();
    }
}
`,
  },
  ca: [
    { ten: { en: 'remove first, middle, last, by code', vi: 'xoá đầu, giữa, cuối, theo mã' }, vao: '5\nADD;A;Vase;500\nADD;B;Lamp;300\nADD;C;Clock;900\nADD;D;Chair;100\nDEL;1\nDEL;0\nRM;d\nDEL;5\nRM;Z\n' },
    { ten: { en: 'remove every cheap item, adjacent ones included', vi: 'xoá mọi món rẻ, kể cả các món liền nhau' }, vao: '6\nADD;A;a;10\nADD;B;b;5\nADD;C;c;6\nADD;D;d;50\nADD;E;e;1\nADD;F;f;70\nCHEAP;20\nCHEAP;20\n' },
    { ten: { en: 'everything removed, then reuse the space', vi: 'xoá hết, rồi dùng lại chỗ' }, vao: '2\nADD;A;a;1\nADD;B;b;2\nCHEAP;100\nADD;C;c;3\nDEL;-1\nDEL;0\nDEL;0\n', an: true },
  ],
  goiY: [
    { en: 'removeAt: for i from index to size-2: items[i] = items[i+1]; then items[--size] = null.', vi: 'removeAt: với i từ index tới size-2: items[i] = items[i+1]; rồi items[--size] = null.' },
    { en: 'removeCheaperThan in one pass: a second index "kept" — copy every item you keep to items[kept++], then null the tail.', vi: 'removeCheaperThan một lượt: chỉ số thứ hai "kept" — chép mọi món giữ lại vào items[kept++], rồi gán null phần đuôi.' },
  ],
  loiHayGap: [
    { en: 'Calling removeAt(i) inside a for loop that then does i++ — after a shift the next item sits at i and is skipped (two cheap items in a row survive).', vi: 'Gọi removeAt(i) trong vòng for rồi i++ — sau khi dời, món kế nằm ở i và bị bỏ qua (hai món rẻ liền nhau sống sót).' },
    { en: 'Shifting from the end towards index — the items overwrite each other.', vi: 'Dời từ cuối về phía index — các món ghi đè lên nhau.' },
    { en: 'Forgetting items[size] = null — the old reference stays in the array (a memory leak in a long-running program).', vi: 'Quên items[size] = null — tham chiếu cũ vẫn nằm trong mảng (rò bộ nhớ ở chương trình chạy lâu).' },
  ],
  giaiThich: { en: '<p>Removal keeps the invariant by shifting the tail left and clearing the freed slot. Removing many items is done in one pass with a write index, which avoids both the skipping bug and the O(n²) cost of calling removeAt repeatedly.</p>', vi: '<p>Xoá giữ bất biến bằng cách dời phần đuôi sang trái và xoá ô vừa trống. Xoá nhiều món làm trong một lượt với chỉ số ghi, tránh cả lỗi bỏ sót lẫn chi phí O(n²) khi gọi removeAt nhiều lần.</p>' },
});

const de3 = deJava({
  id: 'pro192-7-1-grow-insert',
  tieuDe: { en: 'Grow when full and insert at an index', vi: 'Tự nới khi đầy và chèn vào một vị trí' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['dynamic array', 'Arrays.copyOf / manual copy', 'shift right', 'amortised doubling'],
  moTa: {
    en: `<p>Make the list unlimited, the way ${c('ArrayList')} works inside: start with capacity ${c('2')}, and when an add finds the array full, replace it by an array <b>twice as big</b> holding the same items.</p>
<ul><li>${c('void add(Item it)')} — always succeeds (duplicates allowed here).</li>
<li>${c('boolean insertAt(int index, Item it)')} — ${c('0 ≤ index ≤ size')}; shifts the items from ${c('index')} one slot right; false (nothing changes) for a bad index.</li>
<li>${c('int capacity()')} — the current length of the internal array.</li></ul>`,
    vi: `<p>Cho danh sách không giới hạn, như ${c('ArrayList')} làm bên trong: bắt đầu sức chứa ${c('2')}, khi thêm mà mảng đầy thì thay bằng mảng <b>gấp đôi</b> chứa cùng các món. ${c('add(Item)')} luôn thành công (cho phép trùng); ${c('insertAt(int index, Item it)')} — ${c('0 ≤ index ≤ size')}, dời các món từ ${c('index')} sang phải một ô, sai chỉ số thì trả false và không đổi gì; ${c('capacity()')} — độ dài mảng bên trong hiện tại.</p>`,
  },
  yeuCau: { en: ['Arrays only (rule R1) — Arrays.copyOf or a loop is fine.'], vi: ['Chỉ dùng mảng (luật R1) — Arrays.copyOf hoặc vòng lặp đều được.'] },
  dauVao: { en: 'An ignored first line, then ADD;… · INS;index;code;name;price.', vi: 'Dòng đầu bỏ qua, rồi ADD;… · INS;chỉ số;mã;tên;giá.' },
  dauRa: { en: 'Result, list and capacity after each command.', vi: 'Kết quả, danh sách và sức chứa sau mỗi lệnh.' },
  main: 'KiemTra', quyTac: [KHONG_COLLECTION],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        sc.nextLine();
        ItemList list = new ItemList();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            String r;
            if (p[0].equals("ADD")) {
                list.add(new Item(p[1], p[2], Integer.parseInt(p[3])));
                r = "added";
            } else {
                r = String.valueOf(list.insertAt(Integer.parseInt(p[1]), new Item(p[2], p[3], Integer.parseInt(p[4]))));
            }
            System.out.println(String.join(";", p) + " -> " + r + " | " + list + " (size " + list.size() + ", capacity " + list.capacity() + ")");
        }
    }
}
`,
  },
  tep: {
    'Item.java': ITEM,
    'ItemList.java': j`
// An unlimited list on top of an array that doubles when it is full.
public class ItemList {
    private static final int START = 2;
    private Item[] items = new Item[START];
    private int size;

    public int size() {
        return size;
    }

    public int capacity() {
        return items.length;
    }

    //>> // TODO: a private helper that doubles the array when it is full
    private void growIfFull() {
        if (size == items.length) {
            Item[] bigger = new Item[items.length * 2];
            for (int i = 0; i < size; i++) {
                bigger[i] = items[i];
            }
            items = bigger;
        }
    }
    //<<

    public void add(Item it) {
        //>> if (size < items.length) { ⏎     items[size++] = it; ⏎ } // TODO: grow instead of losing the item
        growIfFull();
        items[size++] = it;
        //<<
    }

    public boolean insertAt(int index, Item it) {
        //>> return false; // TODO: check 0..size, grow, shift right, store
        if (index < 0 || index > size) {
            return false;
        }
        growIfFull();
        for (int i = size; i > index; i--) {
            items[i] = items[i - 1];
        }
        items[index] = it;
        size++;
        return true;
        //<<
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < size; i++) {
            sb.append(i == 0 ? "" : ", ").append(items[i]);
        }
        return sb.append(']').toString();
    }
}
`,
  },
  ca: [
    { ten: { en: 'growing 2 → 4 → 8', vi: 'nới 2 → 4 → 8' }, vao: '-\nADD;A;a;1\nADD;B;b;2\nADD;C;c;3\nADD;D;d;4\nADD;E;e;5\n' },
    { ten: { en: 'insert at the front, middle, end, and bad indexes', vi: 'chèn đầu, giữa, cuối, và chỉ số sai' }, vao: '-\nINS;0;A;a;1\nINS;0;B;b;2\nINS;1;C;c;3\nINS;3;D;d;4\nINS;5;X;x;0\nINS;-1;Y;y;0\n' },
    { ten: { en: 'many items', vi: 'nhiều món' }, vao: '-\n' + Array.from({ length: 17 }, (_, i) => `ADD;K${i};k;${i}`).join('\n') + '\nINS;17;Z;z;0\nINS;8;M;m;0\n', an: true },
  ],
  goiY: [
    { en: 'Grow BEFORE storing: if (size == items.length) items = Arrays.copyOf(items, items.length * 2);', vi: 'Nới TRƯỚC khi ghi: if (size == items.length) items = Arrays.copyOf(items, items.length * 2);' },
    { en: 'Shift right from the END: for (i = size; i > index; i--) items[i] = items[i - 1];', vi: 'Dời phải từ CUỐI: for (i = size; i > index; i--) items[i] = items[i - 1];' },
  ],
  loiHayGap: [
    { en: 'Shifting right from index upwards — every slot gets a copy of items[index].', vi: 'Dời phải từ index đi lên — mọi ô đều thành bản sao của items[index].' },
    { en: 'Growing by +1 instead of ×2 — correct but every add copies the whole array (O(n²) for n adds).', vi: 'Nới thêm +1 thay vì ×2 — đúng nhưng mỗi lần thêm chép cả mảng (O(n²) cho n lần thêm).' },
    { en: 'insertAt accepting index == size + 1 — leaves a null hole.', vi: 'insertAt nhận index == size + 1 — để lại một lỗ null.' },
  ],
  giaiThich: { en: '<p>Doubling makes the average cost of add constant (each item is copied O(1) times on average) — exactly what java.util.ArrayList does. Inserting shifts the tail right starting from the end so nothing is overwritten.</p>', vi: '<p>Nhân đôi làm chi phí trung bình của add là hằng số (mỗi món trung bình chỉ bị chép O(1) lần) — đúng như java.util.ArrayList làm. Chèn thì dời phần đuôi sang phải bắt đầu từ cuối để không ô nào bị ghi đè.</p>' },
});

export default moDun({ slug: 'pro192-7-1-mang-doi-tuong', ten: '7.1 Managing many objects', de: [de1, de2, de3] });
