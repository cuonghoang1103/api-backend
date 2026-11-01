/** PRO192 · 8.2 🧪 — Collections kiểu PE: câu 3 IBike (List), XxxList extends ArrayList, săn lỗi equals/hashCode, kho hàng bằng Map (câu 1 10 điểm). */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-on-ch8-ibike',
  tieuDe: { en: 'PE question 3: Bike and MyBike implements the given IBike', vi: 'Câu 3 PE: Bike và MyBike cài IBike đề cho' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['List<T> parameter', 'f1 count / f2 sort / f3 remove', 'Collections.sort', 'removeIf without lambdas (Iterator)'],
  moTa: {
    en: `<p>The most common question 3 shape. ${c('Bike')} (place, price), ${c('IBike')} and ${c('Main')} are given. Write ${c('MyBike implements IBike')}:</p>
<ul><li>${c('int f1(List<Bike> t)')} — how many bikes have a place whose <b>second character is a digit</b> (e.g. ${c('"A1B"')}).</li>
<li>${c('void f2(List<Bike> t)')} — sort by place ascending; equal places by price descending.</li>
<li>${c('void f3(List<Bike> t)')} — remove the <b>first</b> bike with the maximum price (only one, even on a tie).</li></ul>`,
    vi: `<p>Dạng câu 3 phổ biến nhất. ${c('Bike')} (place, price), ${c('IBike')} và ${c('Main')} cho sẵn. Viết ${c('MyBike implements IBike')}: ${c('f1')} đếm xe có place mà <b>ký tự thứ hai là chữ số</b>; ${c('f2')} sắp place tăng dần, cùng place thì price giảm dần; ${c('f3')} xoá xe <b>đầu tiên</b> có price lớn nhất (chỉ một xe, kể cả khi hoà).</p>`,
  },
  yeuCau: { en: ['Do not change Bike.java, IBike.java or Main.java.'], vi: ['Không sửa Bike.java, IBike.java hay Main.java.'] },
  dauVao: { en: 'n, n lines place;price, then TC.', vi: 'n, n dòng place;price, rồi TC.' },
  dauRa: { en: 'OUTPUT of the TC.', vi: 'OUTPUT của TC.' },
  main: 'Main',
  tep: {
    'Bike.java': j`
// GIVEN by the paper — do not change.
public class Bike {
    private final String place;
    private final int price;

    public Bike(String place, int price) {
        this.place = place;
        this.price = price;
    }

    public String getPlace() {
        return place;
    }

    public int getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return "(" + place + "," + price + ")";
    }
}
`,
    'IBike.java': j`
import java.util.List;

// GIVEN by the paper — do not change.
public interface IBike {
    int f1(List<Bike> t);

    void f2(List<Bike> t);

    void f3(List<Bike> t);
}
`,
    'Main.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// GIVEN by the paper — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        List<Bike> t = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().split(";");
            t.add(new Bike(p[0].trim(), Integer.parseInt(p[1].trim())));
        }
        System.out.print("Enter TC (1, 2 or 3): ");
        int tc = Integer.parseInt(sc.nextLine().trim());
        IBike x = new MyBike();
        System.out.println();
        System.out.println("OUTPUT:");
        if (tc == 1) {
            System.out.println(x.f1(t));
        } else if (tc == 2) {
            x.f2(t);
            System.out.println(t);
        } else {
            x.f3(t);
            System.out.println(t);
        }
    }
}
`,
    'MyBike.java': j`
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class MyBike implements IBike {
    @Override
    public int f1(List<Bike> t) {
        //>> return 0; // TODO
        int count = 0;
        for (Bike b : t) {
            String p = b.getPlace();
            if (p.length() >= 2 && Character.isDigit(p.charAt(1))) {
                count++;
            }
        }
        return count;
        //<<
    }

    @Override
    public void f2(List<Bike> t) {
        //>> // TODO
        Collections.sort(t, new Comparator<Bike>() {
            @Override
            public int compare(Bike a, Bike b) {
                int byPlace = a.getPlace().compareTo(b.getPlace());
                return byPlace != 0 ? byPlace : Integer.compare(b.getPrice(), a.getPrice());
            }
        });
        //<<
    }

    @Override
    public void f3(List<Bike> t) {
        //>> // TODO
        if (t.isEmpty()) {
            return;
        }
        int best = 0;
        for (int i = 1; i < t.size(); i++) {
            if (t.get(i).getPrice() > t.get(best).getPrice()) {
                best = i;
            }
        }
        t.remove(best);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'TC1', vi: 'TC1' }, vao: '5\nA1B;10\nBB2;20\nC9;5\nD;7\nx0y;3\n1\n' },
    { ten: { en: 'TC2', vi: 'TC2' }, vao: '5\nB;10\nA;20\nB;30\nA;20\nC;1\n2\n' },
    { ten: { en: 'TC3 with a tie on the maximum', vi: 'TC3 hoà giá trị lớn nhất' }, vao: '4\nA;30\nB;10\nC;30\nD;5\n3\n', an: true },
    { ten: { en: 'TC3 on one bike, TC1 on empty', vi: 'TC3 một xe, TC1 rỗng' }, vao: '1\nZ;1\n3\n', an: true },
  ],
  goiY: [
    { en: 'f3: find the INDEX of the first maximum (update only on a strictly greater price), then t.remove(index).', vi: 'f3: tìm CHỈ SỐ của giá trị lớn nhất đầu tiên (chỉ cập nhật khi giá lớn hơn hẳn), rồi t.remove(chỉ số).' },
    { en: 'f1: check the length before charAt(1) — a one-character place would throw.', vi: 'f1: kiểm độ dài trước charAt(1) — place một ký tự sẽ ném ngoại lệ.' },
  ],
  loiHayGap: [
    { en: 'f3 removing every bike with the maximum price — the paper says the first one only.', vi: 'f3 xoá mọi xe có giá lớn nhất — đề nói chỉ xe đầu tiên.' },
    { en: 'Removing inside a for-each over t — ConcurrentModificationException.', vi: 'Xoá trong vòng for-each trên t — ConcurrentModificationException.' },
    LOI_CHUNG.inThem,
  ],
  giaiThich: { en: '<p>The paper fixes the interface; the list is passed by reference, so f2 and f3 change the caller’s list in place. Finding the index first and removing once avoids modifying the list while iterating.</p>', vi: '<p>Đề cố định interface; list được truyền theo tham chiếu, nên f2 và f3 đổi list của nơi gọi tại chỗ. Tìm chỉ số trước rồi xoá một lần tránh việc sửa list khi đang duyệt.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch8-simcardlist',
  tieuDe: { en: 'PE: SimCardList extends ArrayList<SimCard>', vi: 'PE: SimCardList extends ArrayList<SimCard>' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['extending a collection class', 'this as the list', 'search / remove / statistics methods'],
  moTa: {
    en: `<p>A PE shape where the list <b>is</b> the class: ${c('SimCardList extends ArrayList<SimCard>')}. Inside it, ${c('this')} is the list (${c('size()')}, ${c('get(i)')}, ${c('add')}, iteration). Write:</p>
<ul><li>${c('boolean addSim(SimCard s)')} — refuses a number already in the list.</li>
<li>${c('int countByNetwork(String network)')} — ignoring case.</li>
<li>${c('int removeExpired(int year)')} — removes the SIMs that expire <b>before</b> that year; returns how many.</li>
<li>${c('SimCard cheapest()')} — the lowest price (first on a tie), null when empty.</li></ul>`,
    vi: `<p>Dạng đề PE mà danh sách <b>chính là</b> lớp: ${c('SimCardList extends ArrayList<SimCard>')}. Trong đó ${c('this')} là danh sách (${c('size()')}, ${c('get(i)')}, ${c('add')}, duyệt). Viết: ${c('addSim')} (từ chối số đã có), ${c('countByNetwork')} (không phân biệt hoa thường), ${c('removeExpired(int year)')} (xoá SIM hết hạn <b>trước</b> năm đó, trả số đã xoá), ${c('cheapest()')} (giá thấp nhất, hoà lấy cái đầu, rỗng thì null).</p>`,
  },
  yeuCau: { en: ['SimCard.java and Main.java are given.'], vi: ['SimCard.java và Main.java cho sẵn.'] },
  dauVao: { en: 'Commands ADD;number;network;price;expiry · COUNT;network · EXPIRE;year · CHEAP.', vi: 'Lệnh ADD;số;mạng;giá;năm hết hạn · COUNT;mạng · EXPIRE;năm · CHEAP.' },
  dauRa: { en: 'Result and the list after each command.', vi: 'Kết quả và danh sách sau mỗi lệnh.' },
  main: 'Main',
  tep: {
    'SimCard.java': j`
// GIVEN — do not change.
public class SimCard {
    private final String number;
    private final String network;
    private final int price;
    private final int expiry;

    public SimCard(String number, String network, int price, int expiry) {
        this.number = number;
        this.network = network;
        this.price = price;
        this.expiry = expiry;
    }

    public String getNumber() {
        return number;
    }

    public String getNetwork() {
        return network;
    }

    public int getPrice() {
        return price;
    }

    public int getExpiry() {
        return expiry;
    }

    @Override
    public String toString() {
        return number + "/" + network + "/" + price + "/" + expiry;
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        SimCardList list = new SimCardList();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            Object r;
            if (p[0].equals("ADD")) {
                r = list.addSim(new SimCard(p[1], p[2], Integer.parseInt(p[3]), Integer.parseInt(p[4])));
            } else if (p[0].equals("COUNT")) {
                r = list.countByNetwork(p[1]);
            } else if (p[0].equals("EXPIRE")) {
                r = list.removeExpired(Integer.parseInt(p[1]));
            } else {
                r = list.cheapest();
            }
            System.out.println(String.join(";", p) + " -> " + r + " | " + list);
        }
    }
}
`,
    'SimCardList.java': j`
import java.util.ArrayList;
import java.util.Iterator;

public class SimCardList extends ArrayList<SimCard> {
    public boolean addSim(SimCard s) {
        //>> return add(s); // TODO: refuse a duplicate number
        for (SimCard x : this) {
            if (x.getNumber().equals(s.getNumber())) {
                return false;
            }
        }
        return add(s);
        //<<
    }

    public int countByNetwork(String network) {
        //>> return 0; // TODO
        int count = 0;
        for (SimCard x : this) {
            if (x.getNetwork().equalsIgnoreCase(network)) {
                count++;
            }
        }
        return count;
        //<<
    }

    public int removeExpired(int year) {
        //>> return 0; // TODO: Iterator.remove()
        int removed = 0;
        Iterator<SimCard> it = iterator();
        while (it.hasNext()) {
            if (it.next().getExpiry() < year) {
                it.remove();
                removed++;
            }
        }
        return removed;
        //<<
    }

    public SimCard cheapest() {
        //>> return null; // TODO
        SimCard best = null;
        for (SimCard x : this) {
            if (best == null || x.getPrice() < best.getPrice()) {
                best = x;
            }
        }
        return best;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'add, count, cheapest', vi: 'thêm, đếm, rẻ nhất' }, vao: 'ADD;0901;Viettel;50000;2027\nADD;0902;Mobi;30000;2025\nADD;0901;Vina;1;2030\nADD;0903;viettel;30000;2024\nCOUNT;VIETTEL\nCHEAP\n' },
    { ten: { en: 'remove expired, including neighbours', vi: 'xoá hết hạn, kể cả các SIM liền nhau' }, vao: 'ADD;1;A;5;2020\nADD;2;A;5;2021\nADD;3;B;5;2030\nADD;4;B;5;2019\nEXPIRE;2025\nEXPIRE;2025\nCHEAP\n' },
    { ten: { en: 'empty list', vi: 'danh sách rỗng' }, vao: 'CHEAP\nEXPIRE;2000\nCOUNT;x\n', an: true },
  ],
  goiY: [
    { en: 'Inside SimCardList, for (SimCard x : this) iterates the list itself; add(s) is ArrayList’s own add.', vi: 'Trong SimCardList, for (SimCard x : this) duyệt chính danh sách; add(s) là add của ArrayList.' },
    { en: 'Removing many while iterating: Iterator<SimCard> it = iterator(); … it.remove().', vi: 'Xoá nhiều phần tử khi đang duyệt: Iterator<SimCard> it = iterator(); … it.remove().' },
  ],
  loiHayGap: [
    { en: 'remove(x) inside for (SimCard x : this) — ConcurrentModificationException.', vi: 'remove(x) trong for (SimCard x : this) — ConcurrentModificationException.' },
    { en: 'Declaring a second ArrayList field inside SimCardList and adding to it — the class IS the list, toString prints the empty "real" list.', vi: 'Khai báo thêm một trường ArrayList trong SimCardList rồi thêm vào nó — lớp CHÍNH LÀ danh sách, toString in danh sách "thật" rỗng.' },
  ],
  giaiThich: { en: '<p>Extending ArrayList makes the class a list with extra business methods: they work on <code>this</code>. Iterator.remove() is the safe way to remove during iteration.</p>', vi: '<p>Kế thừa ArrayList biến lớp thành một danh sách có thêm phương thức nghiệp vụ: chúng làm việc trên <code>this</code>. Iterator.remove() là cách an toàn để xoá khi đang duyệt.</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch8-equals-hashcode',
  tieuDe: { en: 'Bug hunt: equals without hashCode', vi: 'Săn lỗi: equals mà thiếu hashCode' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['equals / hashCode contract', 'HashSet and HashMap rely on hashCode', 'Objects.hash', 'identity by id'],
  moTa: {
    en: `<p>${c('Member')} overrides ${c('equals')} (two members are equal when their ids are equal, ignoring case) but not ${c('hashCode')}. The test class shows what goes wrong: a ${c('HashSet')} keeps "duplicates", a ${c('HashMap')} cannot find a member created again from the same id, ${c('List.contains')} works (it only uses equals). Fix ${c('Member')}:</p>
<ul><li>${c('equals')}: same class, ids equal ignoring case; ${c('null')} and other types → false;</li>
<li>${c('hashCode')} consistent with equals (hash the <b>upper-cased</b> id).</li></ul>`,
    vi: `<p>${c('Member')} ghi đè ${c('equals')} (hai thành viên bằng nhau khi mã bằng nhau, không phân biệt hoa thường) nhưng không ghi đè ${c('hashCode')}. Lớp kiểm cho thấy hậu quả: ${c('HashSet')} giữ "bản trùng", ${c('HashMap')} không tìm được thành viên tạo lại từ cùng mã, còn ${c('List.contains')} vẫn đúng (nó chỉ dùng equals). Sửa ${c('Member')}: equals cùng lớp, mã bằng nhau không phân biệt hoa thường, null hay kiểu khác → false; hashCode nhất quán với equals (băm mã đã viết HOA).</p>`,
  },
  yeuCau: { en: ['@Override on both methods.'], vi: ['@Override trên cả hai phương thức.'] },
  dauVao: { en: 'Member ids, one per line.', vi: 'Mã thành viên, mỗi dòng một mã.' },
  dauRa: { en: 'Set size, map lookups, contract checks.', vi: 'Kích thước Set, tra Map, kiểm hợp đồng.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Set<Member> set = new HashSet<>();
        Map<Member, Integer> loans = new HashMap<>();
        List<Member> list = new ArrayList<>();
        List<String> ids = new ArrayList<>();
        while (sc.hasNextLine()) {
            String id = sc.nextLine().trim();
            ids.add(id);
            Member m = new Member(id, "name of " + id);
            set.add(m);
            list.add(m);
            loans.put(m, loans.getOrDefault(m, 0) + 1);
        }
        System.out.println("ids read: " + ids.size() + ", distinct members in HashSet: " + set.size());
        for (String id : ids) {
            Member again = new Member(id.toLowerCase(), "?");
            System.out.println(id + ": loans " + loans.get(again) + ", set contains " + set.contains(again) + ", list contains " + list.contains(again));
        }
        Member a = new Member("M1", "x");
        System.out.println("equals(null) " + a.equals(null) + ", equals(\"M1\") " + a.equals("M1") + ", reflexive " + a.equals(a)
                + ", same hash for M1/m1 " + (new Member("M1", "a").hashCode() == new Member("m1", "b").hashCode()));
    }
}
`,
  },
  tep: {
    'Member.java': j`
// Two members are the same member when their ids are equal, ignoring case.
public class Member {
    private final String id;
    private final String name;

    public Member(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        //>> return id.equalsIgnoreCase(((Member) o).id); // TODO: null, other types
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        return id.equalsIgnoreCase(((Member) o).id);
        //<<
    }
    //>> // TODO: hashCode() consistent with equals

    @Override
    public int hashCode() {
        return id.toUpperCase().hashCode();
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the same members typed in different cases', vi: 'cùng thành viên gõ hoa thường khác nhau' }, vao: 'M001\nm001\nM002\nM001\n' },
    { ten: { en: 'all distinct', vi: 'khác nhau hết' }, vao: 'A\nB\nC\n', an: true },
  ],
  goiY: [
    { en: 'The contract: a.equals(b) ⇒ a.hashCode() == b.hashCode(). HashSet/HashMap first jump to the bucket of the hash, then call equals — a different hash means equals is never even called.', vi: 'Hợp đồng: a.equals(b) ⇒ a.hashCode() == b.hashCode(). HashSet/HashMap nhảy tới ô của hash trước, rồi mới gọi equals — hash khác là equals không bao giờ được gọi.' },
    { en: 'equals ignores case, so the hash must too: hash id.toUpperCase(), never the raw id.', vi: 'equals bỏ qua hoa thường, nên hash cũng phải vậy: băm id.toUpperCase(), không băm id gốc.' },
  ],
  loiHayGap: [
    { en: 'hashCode() returning id.hashCode() — "M001" and "m001" are equal but hash differently.', vi: 'hashCode() trả id.hashCode() — "M001" và "m001" bằng nhau nhưng băm khác nhau.' },
    { en: 'equals(Member other) instead of equals(Object o) — an overload; HashSet still calls Object.equals.', vi: 'equals(Member other) thay vì equals(Object o) — đó là nạp chồng; HashSet vẫn gọi Object.equals.' },
    { en: 'Casting without checking the type — equals("M1") throws ClassCastException.', vi: 'Ép kiểu mà không kiểm loại — equals("M1") ném ClassCastException.' },
  ],
  giaiThich: { en: '<p>Hash-based collections use hashCode to choose a bucket and equals inside the bucket. Overriding equals without a matching hashCode breaks HashSet and HashMap silently, while List (equals only) keeps working — which is why the bug survives simple tests.</p>', vi: '<p>Collection dựa trên băm dùng hashCode để chọn ô và equals bên trong ô. Ghi đè equals mà không có hashCode tương ứng làm HashSet và HashMap hỏng âm thầm, trong khi List (chỉ dùng equals) vẫn chạy — đó là lý do lỗi sống sót qua các phép thử đơn giản.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch8-stock-map',
  tieuDe: { en: 'A 10-mark Q1: the shop’s stock in a Map', vi: 'Câu 1 10 điểm: kho hàng của cửa hàng trong một Map' },
  doKho: 'HARD', phut: 45,
  khaiNiem: ['Map<String, Integer> as a stock', 'validation per command', 'TreeMap report', 'low-stock filter'],
  moTa: {
    en: `<p>Commands change and report a stock kept in a ${c('Map<String, Integer>')} (product code → quantity). Codes are case-insensitive (store upper-case).</p>
<ul><li>${c('IN code qty')} — add (qty 1..1000), new codes allowed → ${c('IN SP01 +20 = 20')}.</li>
<li>${c('OUT code qty')} — remove; unknown code → ${c('ERROR unknown product SP09')}; not enough → ${c('ERROR only 5 of SP01 left')}; when the quantity reaches 0 the product is removed from the map → ${c('OUT SP01 -5 = 0 (removed)')}.</li>
<li>${c('REPORT')} — every product A–Z: ${c('SP01: 15')}, then ${c('total items: 42')}; empty → ${c('stock is empty')}.</li>
<li>${c('LOW n')} — codes with quantity &lt; n, A–Z, comma-separated, or ${c('none')}.</li>
<li>A bad line (wrong command, missing parts, qty not a number or out of range) → ${c('ERROR bad command: <line>')}.</li></ul>`,
    vi: `<p>Các lệnh đổi và báo cáo kho giữ trong ${c('Map<String, Integer>')} (mã → số lượng). Mã không phân biệt hoa thường (lưu viết hoa). IN thêm (1..1000, mã mới được phép); OUT bớt (mã lạ, không đủ hàng → báo lỗi; về 0 thì xoá khỏi map); REPORT liệt kê A–Z và tổng; LOW n liệt kê mã có số lượng &lt; n. Dòng sai (lệnh lạ, thiếu phần, số lượng không phải số hay ngoài khoảng) → ${c('ERROR bad command: <dòng>')}. Câu chữ đúng như bản tiếng Anh.</p>`,
  },
  yeuCau: { en: ['Never crash on a bad line.'], vi: ['Không bao giờ sập vì một dòng sai.'] },
  dauVao: { en: 'Command lines.', vi: 'Các dòng lệnh.' },
  dauRa: { en: 'One or more lines per command.', vi: 'Mỗi lệnh một hoặc vài dòng.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;

public class Main {
    private static final int MAX_QTY = 1000;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Map<String, Integer> stock = new TreeMap<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            //>> System.out.println("ERROR bad command: " + line); // TODO: IN, OUT, REPORT, LOW — with every error message
            try {
                handle(stock, line);
            } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
                System.out.println("ERROR bad command: " + line);
            }
            //<<
        }
    }
    //>> // TODO: helper methods

    private static int qty(String s) {
        int q = Integer.parseInt(s);
        if (q < 1 || q > MAX_QTY) {
            throw new NumberFormatException("out of range");
        }
        return q;
    }

    private static void handle(Map<String, Integer> stock, String line) {
        String[] p = line.split("\\s+");
        String cmd = p[0].toUpperCase();
        if (cmd.equals("IN") && p.length == 3) {
            String code = p[1].toUpperCase();
            int q = qty(p[2]);
            int now = stock.getOrDefault(code, 0) + q;
            stock.put(code, now);
            System.out.println("IN " + code + " +" + q + " = " + now);
        } else if (cmd.equals("OUT") && p.length == 3) {
            String code = p[1].toUpperCase();
            int q = qty(p[2]);
            Integer have = stock.get(code);
            if (have == null) {
                System.out.println("ERROR unknown product " + code);
            } else if (have < q) {
                System.out.println("ERROR only " + have + " of " + code + " left");
            } else if (have == q) {
                stock.remove(code);
                System.out.println("OUT " + code + " -" + q + " = 0 (removed)");
            } else {
                stock.put(code, have - q);
                System.out.println("OUT " + code + " -" + q + " = " + (have - q));
            }
        } else if (cmd.equals("REPORT") && p.length == 1) {
            if (stock.isEmpty()) {
                System.out.println("stock is empty");
                return;
            }
            int total = 0;
            for (Map.Entry<String, Integer> e : stock.entrySet()) {
                System.out.println(e.getKey() + ": " + e.getValue());
                total += e.getValue();
            }
            System.out.println("total items: " + total);
        } else if (cmd.equals("LOW") && p.length == 2) {
            int n = Integer.parseInt(p[1]);
            StringBuilder sb = new StringBuilder();
            for (Map.Entry<String, Integer> e : stock.entrySet()) {
                if (e.getValue() < n) {
                    sb.append(sb.length() == 0 ? "" : ", ").append(e.getKey());
                }
            }
            System.out.println("LOW " + n + ": " + (sb.length() == 0 ? "none" : sb));
        } else {
            System.out.println("ERROR bad command: " + line);
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'in, out, report, low', vi: 'nhập, xuất, báo cáo, sắp hết' }, vao: 'IN sp01 20\nIN SP02 7\nOUT sp01 5\nIN sp03 1\nREPORT\nLOW 10\nOUT SP02 7\nREPORT\n' },
    { ten: { en: 'every kind of error', vi: 'đủ loại lỗi' }, vao: 'OUT SP09 1\nIN SP01 5\nOUT SP01 6\nIN SP01\nIN SP01 abc\nIN SP01 0\nIN SP01 1001\nSELL SP01 1\nLOW\nREPORT now\n' },
    { ten: { en: 'empty stock and case-insensitive codes', vi: 'kho rỗng và mã không phân biệt hoa thường' }, vao: 'REPORT\nLOW 5\nin ab 1000\nIn AB 1000\nout aB 2000\nREPORT\n', an: true },
  ],
  goiY: [
    { en: 'Parse inside try and catch NumberFormatException / ArrayIndexOutOfBoundsException to print "bad command" — or check p.length before using p[1], p[2].', vi: 'Parse trong try và bắt NumberFormatException / ArrayIndexOutOfBoundsException để in "bad command" — hoặc kiểm p.length trước khi dùng p[1], p[2].' },
    { en: 'stock.get(code) returns null for an unknown product — compare with null before doing arithmetic.', vi: 'stock.get(code) trả null với sản phẩm lạ — so với null trước khi làm phép tính.' },
  ],
  loiHayGap: [
    { en: 'Leaving a product with quantity 0 in the map — REPORT then lists "SP02: 0".', vi: 'Để sản phẩm số lượng 0 trong map — REPORT khi đó in "SP02: 0".' },
    { en: 'int have = stock.get(code) for an unknown code — NullPointerException while unboxing.', vi: 'int have = stock.get(code) với mã lạ — NullPointerException khi mở hộp.' },
  ],
  giaiThich: { en: '<p>A TreeMap keyed by the upper-cased code is the whole data model: getOrDefault for adding, null checks for removing, remove() when a quantity reaches 0, and sorted iteration for free in the reports. Parsing errors are turned into one message, so no line can crash the program.</p>', vi: '<p>Một TreeMap với khoá là mã viết hoa là toàn bộ mô hình dữ liệu: getOrDefault khi thêm, kiểm null khi bớt, remove() khi số lượng về 0, và duyệt đã sắp miễn phí cho báo cáo. Lỗi parse được gom về một câu báo, nên không dòng nào làm sập chương trình.</p>' },
});

export default moDun({ slug: 'pro192-on-ch8', ten: '8.2 🧪 Practice — collections the PE way: IBike, XxxList extends ArrayList, equals/hashCode, a stock Map', de: [de1, de2, de3, de4] });
