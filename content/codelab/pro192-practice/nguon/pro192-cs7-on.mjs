/** PRO192 · ⭐ CS.7 — SOLID & mẫu thiết kế: Strategy + registry (mở rộng không sửa code cũ), LSP (Stack extends Vector ⇒ bọc Deque), Observer tự huỷ đăng ký khi đang được báo, Template Method với run() final. Ý đề: gen/src/extra/cs7-on.txt + gen/java/cs7/Bt*.java. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-cs7-registry-chinh-sach',
  tieuDe: { en: 'A fee-policy registry: add VIP and HOLIDAY without touching old code', vi: 'Registry chính sách phí: thêm VIP và HOLIDAY không sửa code cũ' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['Strategy as a functional interface', 'registry = a small factory keyed by type', 'open/closed: new behaviour = new registration', 'fallback + warning for an unknown key'],
  moTa: {
    en: `<p>${c('FeePolicy')} is a one-method interface ${c('long fee(int days)')}. Write ${c('PolicyRegistry')}: ${c('register(type, policy)')} — a type registered twice is refused with ${c('IllegalStateException("policy already registered: VIP")')}; ${c('find(type)')} — an unknown type must not crash: it returns the ${c('GUEST')} policy and remembers the type; ${c('unknownTypes()')} — those types, sorted. Write also ${c('FreeDaysPolicy(freeDays, perDay)')}: the first ${c('freeDays')} days are free, then ${c('perDay')} per day.</p>
<p>The given ${c('Main')} registers GUEST (2000/day), MEMBER (1000/day) and STAFF (0) as lambdas, then VIP = ${c('new FreeDaysPolicy(3, 1000)')} and HOLIDAY = always 0, tries to register VIP again, prints a fee table for 1, 4 and 9 days for the types in the input, and finally the warnings.</p>`,
    vi: `<p>${c('FeePolicy')} là interface một hàm ${c('long fee(int days)')}. Viết ${c('PolicyRegistry')}: ${c('register(type, policy)')} — đăng ký một loại hai lần bị từ chối bằng ${c('IllegalStateException("policy already registered: VIP")')}; ${c('find(type)')} — loại lạ không được làm sập: trả chính sách ${c('GUEST')} và ghi nhớ loại đó; ${c('unknownTypes()')} — các loại đó, đã sắp. Viết thêm ${c('FreeDaysPolicy(freeDays, perDay)')}: ${c('freeDays')} ngày đầu miễn phí, sau đó ${c('perDay')} mỗi ngày.</p>
<p>${c('Main')} cho sẵn đăng ký GUEST (2000/ngày), MEMBER (1000/ngày) và STAFF (0) bằng lambda, rồi VIP = ${c('new FreeDaysPolicy(3, 1000)')} và HOLIDAY = luôn 0, thử đăng ký VIP lần nữa, in bảng phí 1, 4, 9 ngày cho các loại trong input, cuối cùng in cảnh báo.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java and FeePolicy.java.', 'No switch/if on the type names inside PolicyRegistry.'], vi: ['Không sửa Main.java và FeePolicy.java.', 'Không switch/if theo tên loại trong PolicyRegistry.'] },
  dauVao: { en: 'Policy types, one per line.', vi: 'Các loại chính sách, mỗi dòng một loại.' },
  dauRa: { en: 'The duplicate-registration line, the table, the warnings.', vi: 'Dòng đăng ký trùng, bảng phí, cảnh báo.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no type names hard-coded in the registry (except the GUEST fallback)', vi: 'không viết cứng tên loại trong registry (trừ GUEST dự phòng)', re: String.raw`"(MEMBER|STAFF|VIP|HOLIDAY)"`, file: '^PolicyRegistry\\.java$' }],
  tep: {
    'FeePolicy.java': j`
// GIVEN — do not change.
@FunctionalInterface
public interface FeePolicy {
    long fee(int days);
}
`,
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        PolicyRegistry registry = new PolicyRegistry();
        registry.register("GUEST", days -> 2000L * days);
        registry.register("MEMBER", days -> 1000L * days);
        registry.register("STAFF", days -> 0);
        registry.register("VIP", new FreeDaysPolicy(3, 1000));
        registry.register("HOLIDAY", days -> 0);
        try {
            registry.register("VIP", days -> 1);
            System.out.println("VIP registered twice!");
        } catch (IllegalStateException e) {
            System.out.println("refused: " + e.getMessage());
        }
        Scanner sc = new Scanner(System.in);
        System.out.printf("%-8s %6s %6s %6s%n", "type", "1d", "4d", "9d");
        while (sc.hasNextLine()) {
            String type = sc.nextLine().trim();
            if (type.isEmpty()) {
                continue;
            }
            FeePolicy p = registry.find(type);
            System.out.printf("%-8s %6d %6d %6d%n", type, p.fee(1), p.fee(4), p.fee(9));
        }
        System.out.println("unknown types charged as GUEST: " + registry.unknownTypes());
    }
}
`,
    'FreeDaysPolicy.java': j`
public class FreeDaysPolicy implements FeePolicy {
    private final int freeDays;
    private final long perDay;

    public FreeDaysPolicy(int freeDays, long perDay) {
        this.freeDays = freeDays;
        this.perDay = perDay;
    }

    @Override
    public long fee(int days) {
        //>> return 0; // TODO
        return Math.max(0, days - freeDays) * perDay;
        //<<
    }
}
`,
    'PolicyRegistry.java': j`
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class PolicyRegistry {
    private final Map<String, FeePolicy> policies = new HashMap<>();
    private final Set<String> unknown = new TreeSet<>();

    public void register(String type, FeePolicy policy) {
        //>> policies.put(type, policy); // TODO: refuse a second registration
        if (policies.putIfAbsent(type, policy) != null) {
            throw new IllegalStateException("policy already registered: " + type);
        }
        //<<
    }

    public FeePolicy find(String type) {
        //>> return policies.get(type); // TODO: unknown ⇒ GUEST + remember it
        FeePolicy p = policies.get(type);
        if (p == null) {
            unknown.add(type);
            return policies.get("GUEST");
        }
        return p;
        //<<
    }

    public Set<String> unknownTypes() {
        return unknown;
    }
}
`,
  },
  ca: [
    { ten: { en: 'every registered type and one unknown', vi: 'mọi loại đã đăng ký và một loại lạ' }, vao: 'GUEST\nMEMBER\nSTAFF\nVIP\nHOLIDAY\nALUMNI\n' },
    { ten: { en: 'unknown types only, twice, lower case', vi: 'chỉ loại lạ, lặp lại, chữ thường' }, vao: 'vip\nRESEARCHER\nvip\nALUMNI\n', an: true },
  ],
  goiY: [
    { en: 'putIfAbsent returns the previous value — non-null means the type was already there.', vi: 'putIfAbsent trả giá trị cũ — khác null nghĩa là loại đã có.' },
    { en: 'FreeDaysPolicy: Math.max(0, days - freeDays) * perDay.', vi: 'FreeDaysPolicy: Math.max(0, days - freeDays) * perDay.' },
  ],
  loiHayGap: [
    { en: 'A switch on the type inside the registry — every new policy edits the registry again (the problem we are removing).', vi: 'Switch theo loại trong registry — mỗi chính sách mới lại sửa registry (đúng vấn đề đang gỡ).' },
    { en: 'Silently overwriting a registered policy with put — two modules registering "VIP" would fight without anyone noticing.', vi: 'Lặng lẽ ghi đè bằng put — hai mô-đun cùng đăng ký "VIP" sẽ giành nhau mà không ai biết.' },
  ],
  giaiThich: { en: '<p>Each policy is a Strategy; the registry maps a key to a strategy. Adding VIP or HOLIDAY is a new registration and, at most, a new class — no existing line changes (open/closed). The fallback keeps the desk working when data contains a type nobody configured, while the warning list makes it visible.</p>', vi: '<p>Mỗi chính sách là một Strategy; registry ánh xạ khoá tới strategy. Thêm VIP hay HOLIDAY là một lần đăng ký và, nhiều nhất, một lớp mới — không dòng cũ nào đổi (mở/đóng). Phương án dự phòng giữ quầy hoạt động khi dữ liệu có loại chưa ai cấu hình, còn danh sách cảnh báo làm nó hiện ra.</p>' },
});

const de2 = deJava({
  id: 'pro192-cs7-lsp-stack',
  tieuDe: { en: 'Liskov in the JDK: java.util.Stack extends Vector — write a pile that cannot be misused', vi: 'Liskov trong JDK: java.util.Stack extends Vector — viết chồng sách không thể dùng sai' },
  doKho: 'MEDIUM', phut: 20, java: 17,
  khaiNiem: ['LSP: a subtype must keep the parent’s promises — and the parent’s methods leak into the subtype', 'composition over inheritance', 'ArrayDeque as a stack', 'expose only push / pop / peek'],
  moTa: {
    en: `<p>Returned books pile up on a cart: the newest on top. The first version is ${c('class ReturnPile extends Stack<String>')} — and because ${c('Stack extends Vector')}, any caller can ${c('add(0, …)')} under the pile or ${c('remove("B002")')} from the middle. Rewrite ${c('ReturnPile')} so that it <b>is not</b> a ${c('List')}/${c('Vector')} and offers only: ${c('push(code)')}, ${c('pop()')}, ${c('peek()')} (both throw ${c('IllegalStateException("pile is empty")')} on an empty pile), ${c('size()')}, and ${c('toString()')} listing the pile from the top: ${c('[B003, B002, B001]')}. Keep the books in an ${c('ArrayDeque')} inside.</p>`,
    vi: `<p>Sách trả xếp thành chồng trên xe đẩy: cuốn mới nhất trên cùng. Bản đầu là ${c('class ReturnPile extends Stack<String>')} — và vì ${c('Stack extends Vector')}, ai cũng có thể ${c('add(0, …)')} xuống đáy chồng hay ${c('remove("B002")')} ở giữa. Viết lại ${c('ReturnPile')} để nó <b>không phải</b> ${c('List')}/${c('Vector')} và chỉ có: ${c('push(code)')}, ${c('pop()')}, ${c('peek()')} (chồng rỗng thì cả hai ném ${c('IllegalStateException("pile is empty")')}), ${c('size()')}, và ${c('toString()')} liệt kê từ trên xuống: ${c('[B003, B002, B001]')}. Bên trong giữ sách trong một ${c('ArrayDeque')}.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'ReturnPile extends nothing (except Object) and implements no collection interface.'], vi: ['Không sửa Main.java.', 'ReturnPile không extends gì (ngoài Object) và không implements interface collection nào.'] },
  dauVao: { en: 'Commands: push CODE · pop · peek · show.', vi: 'Lệnh: push CODE · pop · peek · show.' },
  dauRa: { en: 'One line per command, then the type check.', vi: 'Mỗi lệnh một dòng, rồi dòng kiểm kiểu.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'ReturnPile does not extend Stack/Vector or implement a collection', vi: 'ReturnPile không extends Stack/Vector, không implements collection', re: String.raw`class\s+ReturnPile\s+(extends|implements)`, file: '^ReturnPile\\.java$' }],
  tep: {
    'Main.java': j`
import java.util.Collection;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ReturnPile pile = new ReturnPile();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            try {
                switch (p[0]) {
                    case "push" -> {
                        pile.push(p[1]);
                        System.out.println("pushed " + p[1] + ", size " + pile.size());
                    }
                    case "pop" -> System.out.println("popped " + pile.pop());
                    case "peek" -> System.out.println("top " + pile.peek());
                    case "show" -> System.out.println("pile " + pile);
                    default -> {
                    }
                }
            } catch (RuntimeException e) {
                System.out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
            }
        }
        Object o = pile;
        System.out.println("is a List: " + (o instanceof List) + ", is a Collection: " + (o instanceof Collection));
    }
}
`,
    'ReturnPile.java': j`
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Stack;

//>> public class ReturnPile extends Stack<String> { // TODO: compose, do not inherit ⏎ }
public class ReturnPile {
    private final Deque<String> books = new ArrayDeque<>();

    public void push(String code) {
        books.push(code);
    }

    public String pop() {
        if (books.isEmpty()) {
            throw new IllegalStateException("pile is empty");
        }
        return books.pop();
    }

    public String peek() {
        if (books.isEmpty()) {
            throw new IllegalStateException("pile is empty");
        }
        return books.peek();
    }

    public int size() {
        return books.size();
    }

    @Override
    public String toString() {
        return books.toString();
    }
}
//<<
`,
  },
  ca: [
    { ten: { en: 'three books, peek, pop, show', vi: 'ba cuốn, peek, pop, show' }, vao: 'push B001\npush B002\npush B003\nshow\npeek\npop\nshow\n' },
    { ten: { en: 'empty pile', vi: 'chồng rỗng' }, vao: 'pop\npeek\nshow\npush X\npop\npop\n', an: true },
  ],
  goiY: [
    { en: 'ArrayDeque.push adds at the head and its toString lists from the head — exactly "from the top".', vi: 'ArrayDeque.push thêm ở đầu và toString của nó liệt kê từ đầu — đúng "từ trên xuống".' },
    { en: 'Stack’s own toString lists from the bottom: [B001, B002, B003].', vi: 'toString của Stack liệt kê từ đáy: [B001, B002, B003].' },
  ],
  loiHayGap: [
    { en: 'Overriding add/remove in the subclass to throw — the class still claims to be a List, and every List user is surprised (that IS the Liskov violation).', vi: 'Ghi đè add/remove trong lớp con để ném lỗi — lớp vẫn tự nhận là List, và mọi nơi dùng List bị bất ngờ (đó CHÍNH là vi phạm Liskov).' },
    { en: 'Returning the inner Deque from a getter — callers can again change the middle of the pile.', vi: 'Trả Deque bên trong qua getter — nơi gọi lại sửa được giữa chồng.' },
  ],
  giaiThich: { en: '<p>Stack inherits ~40 Vector methods it never wanted, so it cannot keep the stack promise. A class that HAS a Deque and exposes three operations keeps its invariant by construction; the JDK itself recommends Deque over Stack.</p>', vi: '<p>Stack thừa hưởng khoảng 40 hàm của Vector mà nó không hề muốn, nên không giữ được lời hứa của một ngăn xếp. Lớp CÓ một Deque và chỉ mở ba thao tác giữ được bất biến ngay từ thiết kế; chính JDK khuyên dùng Deque thay cho Stack.</p>' },
});

const de3 = deJava({
  id: 'pro192-cs7-observer-tu-huy',
  tieuDe: { en: 'A listener that unsubscribes itself while being notified', vi: 'Listener tự huỷ đăng ký khi đang được báo' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['Observer: subject + listeners', 'ConcurrentModificationException while iterating', 'iterate over a snapshot or use CopyOnWriteArrayList', 'one-shot listener'],
  moTa: {
    en: `<p>${c('ReturnDesk')} notifies its ${c('ReturnListener')}s when a book comes back. A ${c('OneShotHold')} ("tell M007 when B001 comes back, then stop listening") prints ${c('notify M007: B001 is back')} and calls ${c('desk.unsubscribe(this)')} <b>inside</b> ${c('onReturned')}. With the listeners in an ${c('ArrayList')} and a for-each loop, that crashes with ${c('ConcurrentModificationException')} (or silently skips the next listener). Fix ${c('ReturnDesk')} so that every listener registered at the moment of a return is notified exactly once, and a listener that unsubscribed is not called for later returns. The given ${c('Main')} also has a ${c('LogListener')} that never unsubscribes.</p>`,
    vi: `<p>${c('ReturnDesk')} báo cho các ${c('ReturnListener')} khi một cuốn sách được trả. Một ${c('OneShotHold')} ("báo M007 khi B001 về, rồi thôi nghe") in ${c('notify M007: B001 is back')} và gọi ${c('desk.unsubscribe(this)')} <b>ngay trong</b> ${c('onReturned')}. Với listener để trong ${c('ArrayList')} và vòng for-each, việc đó sập vì ${c('ConcurrentModificationException')} (hoặc lặng lẽ bỏ qua listener kế tiếp). Sửa ${c('ReturnDesk')} để mọi listener đã đăng ký tại lúc trả sách được báo đúng một lần, và listener đã huỷ thì không bị gọi ở các lần trả sau. ${c('Main')} cho sẵn còn có ${c('LogListener')} không bao giờ huỷ.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java, ReturnListener.java, OneShotHold.java.'], vi: ['Không sửa Main.java, ReturnListener.java, OneShotHold.java.'] },
  dauVao: { en: 'Lines "hold MEMBER BOOK" (subscribe a one-shot hold) and "return BOOK".', vi: 'Các dòng "hold MEMBER BOOK" (đăng ký một lần) và "return BOOK".' },
  dauRa: { en: 'Notifications, then how many listeners are left.', vi: 'Các thông báo, rồi số listener còn lại.' },
  main: 'Main',
  tep: {
    'ReturnListener.java': j`
// GIVEN — do not change.
public interface ReturnListener {
    void onReturned(String book);
}
`,
    'OneShotHold.java': j`
// GIVEN — do not change.
public class OneShotHold implements ReturnListener {
    private final String member;
    private final String book;
    private final ReturnDesk desk;

    public OneShotHold(String member, String book, ReturnDesk desk) {
        this.member = member;
        this.book = book;
        this.desk = desk;
    }

    @Override
    public void onReturned(String returned) {
        if (returned.equals(book)) {
            System.out.println("  notify " + member + ": " + book + " is back");
            desk.unsubscribe(this);
        }
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ReturnDesk desk = new ReturnDesk();
        desk.subscribe(book -> System.out.println("  log: " + book));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            if (p[0].equals("hold")) {
                desk.subscribe(new OneShotHold(p[1], p[2], desk));
            } else if (p[0].equals("return")) {
                System.out.println("return " + p[1] + ":");
                desk.bookReturned(p[1]);
            }
        }
        System.out.println("listeners left: " + desk.listenerCount());
    }
}
`,
    'ReturnDesk.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ReturnDesk {
    //>> private final List<ReturnListener> listeners = new ArrayList<>(); // TODO: safe when a listener unsubscribes during the notification
    private final List<ReturnListener> listeners = new CopyOnWriteArrayList<>();
    //<<

    public void subscribe(ReturnListener l) {
        listeners.add(l);
    }

    public void unsubscribe(ReturnListener l) {
        listeners.remove(l);
    }

    public void bookReturned(String book) {
        for (ReturnListener l : listeners) {
            l.onReturned(book);
        }
    }

    public int listenerCount() {
        return listeners.size();
    }
}
`,
  },
  ca: [
    { ten: { en: 'three holds, two returns', vi: 'ba lượt chờ, hai lần trả' }, vao: 'hold M007 B001\nhold M012 B002\nhold M020 B001\nreturn B001\nreturn B001\nreturn B002\n' },
    { ten: { en: 'the last listener unsubscribes; nothing to notify', vi: 'listener cuối huỷ đăng ký; không có gì để báo' }, vao: 'return X\nhold A Z\nreturn Z\nreturn Z\nhold B Z\nhold C Z\nreturn Z\n', an: true },
  ],
  goiY: [
    { en: 'CopyOnWriteArrayList: every iteration walks a snapshot, so remove() during the loop is safe — good when listeners change rarely and notifications are frequent.', vi: 'CopyOnWriteArrayList: mỗi lần duyệt đi trên một bản chụp, nên remove() trong vòng lặp an toàn — hợp khi listener ít đổi mà thông báo nhiều.' },
    { en: 'Or: for (ReturnListener l : new ArrayList<>(listeners)) — the same idea by hand.', vi: 'Hoặc: for (ReturnListener l : new ArrayList<>(listeners)) — cùng ý tưởng làm tay.' },
  ],
  loiHayGap: [
    { en: 'An index loop for (int i = 0; i < size(); i++) — no exception, but the listener after the removed one is skipped.', vi: 'Vòng chỉ số for (int i = 0; i < size(); i++) — không ngoại lệ, nhưng listener ngay sau cái bị xoá bị bỏ qua.' },
    { en: 'Catching ConcurrentModificationException — the rest of the listeners are never notified.', vi: 'Bắt ConcurrentModificationException — các listener còn lại không bao giờ được báo.' },
  ],
  giaiThich: { en: '<p>The subject must not assume listeners are passive. Notifying over a snapshot separates "who was registered when the event happened" from "who is registered now" — exactly the semantics a one-shot listener needs.</p>', vi: '<p>Subject không được giả định listener thụ động. Báo trên một bản chụp tách "ai đã đăng ký lúc sự kiện xảy ra" khỏi "ai đang đăng ký bây giờ" — đúng ngữ nghĩa mà listener một lần cần.</p>' },
});

const de4 = deJava({
  id: 'pro192-cs7-template-method',
  tieuDe: { en: 'Template Method: one import job, two file formats', vi: 'Template Method: một việc nhập, hai định dạng tệp' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['abstract class with a final template method', 'abstract steps + a hook with a default', 'validation the subclasses cannot weaken (private)', 'Hollywood principle'],
  moTa: {
    en: `<p>Members arrive as CSV (a header line, fields separated by ${c(',')}) or as pipe text (no header, fields separated by ${c('|')}). Write the abstract ${c('ImportJob')} whose <b>final</b> ${c('run(List<String> lines)')} fixes the steps: skip the first line if ${c('hasHeader()')} (a hook, default ${c('false')}), skip blank lines, ${c('split(line)')} (abstract), validate (exactly 3 fields ${c('id, name, email')}, none blank, the email contains ${c('@')} — in a <b>private</b> method), count, and return ${c('"CSV: 2 imported, 1 rejected [line 3]"')} — ${c('name()')} is abstract, line numbers count every line of the input. Then write ${c('CsvImport')} and ${c('PipeImport')} that only supply ${c('name')}, ${c('split')} and (CSV) the hook.</p>`,
    vi: `<p>Thành viên đến dưới dạng CSV (một dòng tiêu đề, các trường ngăn bằng ${c(',')}) hoặc văn bản ống (không tiêu đề, ngăn bằng ${c('|')}). Viết lớp trừu tượng ${c('ImportJob')} có ${c('run(List<String> lines)')} <b>final</b> cố định các bước: bỏ dòng đầu nếu ${c('hasHeader()')} (hook, mặc định ${c('false')}), bỏ dòng trống, ${c('split(line)')} (trừu tượng), kiểm (đúng 3 trường ${c('id, name, email')}, không trường nào trống, email chứa ${c('@')} — trong một hàm <b>private</b>), đếm, và trả ${c('"CSV: 2 imported, 1 rejected [line 3]"')} — ${c('name()')} trừu tượng, số dòng đếm mọi dòng của input. Rồi viết ${c('CsvImport')} và ${c('PipeImport')} chỉ cung cấp ${c('name')}, ${c('split')} và (CSV) hook.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'run is final; the validation is private in ImportJob.'], vi: ['Không sửa Main.java.', 'run là final; phần kiểm là private trong ImportJob.'] },
  dauVao: { en: 'Line 1: csv or pipe. Then the lines of the file.', vi: 'Dòng 1: csv hoặc pipe. Rồi các dòng của tệp.' },
  dauRa: { en: 'One summary line.', vi: 'Một dòng tổng kết.' },
  main: 'Main',
  quyTac: [
    { id: 'R1', en: 'run() is final', vi: 'run() là final', re: String.raw`\bfinal\s+[\w<>]+\s+run\s*\(`, file: '^ImportJob\\.java$', need: true },
    { id: 'R2', en: 'the subclasses do not override run or validate', vi: 'lớp con không ghi đè run hay validate', re: String.raw`\b(run|validate)\s*\(`, file: '^(CsvImport|PipeImport)\\.java$' },
  ],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String kind = sc.nextLine().trim();
        List<String> lines = new ArrayList<>();
        while (sc.hasNextLine()) {
            lines.add(sc.nextLine());
        }
        ImportJob job = kind.equals("csv") ? new CsvImport() : new PipeImport();
        System.out.println(job.run(lines));
    }
}
`,
    'ImportJob.java': j`
import java.util.ArrayList;
import java.util.List;

public abstract class ImportJob {
    //>> public String run(List<String> lines) { ⏎     return name() + ": 0 imported, 0 rejected []"; // TODO: the template ⏎ }
    public final String run(List<String> lines) {
        int ok = 0;
        List<Integer> rejected = new ArrayList<>();
        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            if ((i == 0 && hasHeader()) || line.trim().isEmpty()) {
                continue;
            }
            if (valid(split(line))) {
                ok++;
            } else {
                rejected.add(i + 1);
            }
        }
        return name() + ": " + ok + " imported, " + rejected.size() + " rejected " + rejected.toString().replace(", ", ", line ").replace("[", rejected.isEmpty() ? "[" : "[line ");
    }

    private boolean valid(String[] f) {
        if (f.length != 3) {
            return false;
        }
        for (String x : f) {
            if (x.trim().isEmpty()) {
                return false;
            }
        }
        return f[2].contains("@");
    }
    //<<

    protected boolean hasHeader() {
        return false;
    }

    protected abstract String name();

    protected abstract String[] split(String line);
}
`,
    'CsvImport.java': j`
public class CsvImport extends ImportJob {
    @Override
    protected String name() {
        return "CSV";
    }

    @Override
    protected String[] split(String line) {
        //>> return new String[0]; // TODO
        return line.split(",", -1);
        //<<
    }
    //>> // TODO: the header hook
    @Override
    protected boolean hasHeader() {
        return true;
    }
    //<<
}
`,
    'PipeImport.java': j`
public class PipeImport extends ImportJob {
    @Override
    protected String name() {
        return "PIPE";
    }

    @Override
    protected String[] split(String line) {
        //>> return new String[0]; // TODO: | is a regex metacharacter
        return line.split("\\|", -1);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'CSV with a header and one bad email', vi: 'CSV có tiêu đề và một email sai' }, vao: 'csv\nid,name,email\nM1,An,an@ct.vn\nM2,Binh,binh.ct.vn\nM3,Chi,chi@ct.vn\n' },
    { ten: { en: 'pipe text, no header', vi: 'văn bản ống, không tiêu đề' }, vao: 'pipe\nM1|An|an@ct.vn\nM2|Binh|binh@ct.vn\nM3|Chi\n', an: true },
    { ten: { en: 'CSV with blank lines, a blank field and an extra field', vi: 'CSV có dòng trống, trường trống và thừa trường' }, vao: 'csv\nid,name,email\n\nM1, ,a@b\nM2,Ha,ha@b,x\nM3,Lan,lan@b\n\n', an: true },
  ],
  goiY: [
    { en: 'final on run() means no subclass can reorder or skip the steps; private validate() means no subclass can weaken the rules.', vi: 'final trên run() nghĩa là không lớp con nào đổi thứ tự hay bỏ bước; private validate() nghĩa là không lớp con nào nới lỏng luật.' },
    { en: 'split("\\\\|", -1): escape the pipe, and keep trailing empty fields.', vi: 'split("\\\\|", -1): thoát ký tự ống, và giữ các trường trống ở cuối.' },
  ],
  loiHayGap: [
    { en: 'Each subclass writing its own loop — two copies of the validation drift apart the first time one is fixed.', vi: 'Mỗi lớp con tự viết vòng lặp — hai bản kiểm dữ liệu lệch nhau từ lần sửa đầu tiên.' },
    { en: 'Making validate protected "for flexibility" — a subclass can then return true for everything.', vi: 'Cho validate là protected "cho linh hoạt" — lớp con có thể trả true cho mọi thứ.' },
  ],
  giaiThich: { en: '<p>The abstract class owns the algorithm and calls the subclasses for the parts that vary ("don’t call us, we’ll call you"). Only the format-specific pieces are overridable; the invariant parts are final or private.</p>', vi: '<p>Lớp trừu tượng nắm thuật toán và gọi lớp con cho những phần thay đổi ("đừng gọi chúng tôi, chúng tôi sẽ gọi bạn"). Chỉ phần riêng của định dạng được ghi đè; phần bất biến là final hoặc private.</p>' },
});

export default moDun({ slug: 'pro192-cs7-on', ten: '11.7 ⭐ CS.7 SOLID & design patterns: Strategy, Liskov, Observer, Template Method', de: [de1, de2, de3, de4] });
