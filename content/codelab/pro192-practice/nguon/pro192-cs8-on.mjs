/** PRO192 · ⭐ CS.8 — Đa luồng có output TẤT ĐỊNH: mất cập nhật (synchronized/AtomicLong), khoá chết khi chuyển tiền (thứ tự khoá), chia việc invokeAll, producer–consumer qua BlockingQueue. Ý đề: gen/src/extra/cs8-on.txt + gen/java/cs8/Bt*.java. Không in thứ tự xen kẽ của luồng — chỉ in kết quả cuối. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-cs8-mat-cap-nhat',
  tieuDe: { en: 'Two desks collect fines into one account: the lost update', vi: 'Hai quầy thu tiền phạt vào một tài khoản: mất cập nhật' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['read–modify–write is not atomic', 'synchronized (mutual exclusion + visibility)', 'AtomicLong.addAndGet (compare-and-set)', 'join() before reading the result'],
  moTa: {
    en: `<p>${c('FineAccount')} adds each fine with "read the balance, then write balance + amount" — the starter even yields between the two steps, so with several desks (threads) at once updates get lost. Write two correct implementations of ${c('FineAccount')}: ${c('SyncAccount')} with ${c('synchronized')}, and ${c('AtomicAccount')} with an ${c('AtomicLong')}. The given ${c('Main')} runs T threads × N fines of 1000 on each account and prints the expected and the actual balances — the program prints only final results, never the interleaving of the threads.</p>`,
    vi: `<p>${c('FineAccount')} cộng mỗi khoản phạt bằng "đọc số dư, rồi ghi số dư + khoản" — code khởi đầu còn nhường CPU giữa hai bước, nên khi nhiều quầy (luồng) cùng thu thì cập nhật bị mất. Viết hai cài đặt đúng của ${c('FineAccount')}: ${c('SyncAccount')} dùng ${c('synchronized')}, và ${c('AtomicAccount')} dùng ${c('AtomicLong')}. ${c('Main')} cho sẵn chạy T luồng × N khoản 1000 trên mỗi tài khoản và in số dư mong đợi và số dư thật — chương trình chỉ in kết quả cuối, không bao giờ in thứ tự xen kẽ của các luồng.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java and FineAccount.java.'], vi: ['Không sửa Main.java và FineAccount.java.'] },
  dauVao: { en: 'Two numbers: threads and fines per thread.', vi: 'Hai số: số luồng và số khoản mỗi luồng.' },
  dauRa: { en: 'Expected balance, then the two correct accounts.', vi: 'Số dư mong đợi, rồi hai tài khoản đúng.' },
  main: 'Main',
  timeoutMs: 20000,
  quyTac: [
    { id: 'R1', en: 'SyncAccount uses synchronized', vi: 'SyncAccount dùng synchronized', re: String.raw`\bsynchronized\b`, file: '^SyncAccount\\.java$', need: true },
    { id: 'R2', en: 'AtomicAccount uses an AtomicLong', vi: 'AtomicAccount dùng AtomicLong', re: String.raw`\bAtomicLong\b`, file: '^AtomicAccount\\.java$', need: true },
  ],
  tep: {
    'FineAccount.java': j`
// GIVEN — do not change.
public interface FineAccount {
    void add(long amount);

    long balance();
}
`,
    'Main.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    static long run(FineAccount account, int threads, int fines) throws InterruptedException {
        List<Thread> desks = new ArrayList<>();
        for (int t = 0; t < threads; t++) {
            Thread desk = new Thread(() -> {
                for (int i = 0; i < fines; i++) {
                    account.add(1000);
                }
            });
            desks.add(desk);
            desk.start();
        }
        for (Thread d : desks) {
            d.join();
        }
        return account.balance();
    }

    public static void main(String[] args) throws InterruptedException {
        Scanner sc = new Scanner(System.in);
        int threads = sc.nextInt();
        int fines = sc.nextInt();
        System.out.println("expected: " + (long) threads * fines * 1000);
        System.out.println("synchronized: " + run(new SyncAccount(), threads, fines));
        System.out.println("AtomicLong:   " + run(new AtomicAccount(), threads, fines));
    }
}
`,
    'SyncAccount.java': j`
public class SyncAccount implements FineAccount {
    private long balance;

    //>> @Override ⏎ public void add(long amount) { ⏎     long read = balance; // TODO: make read + write one atomic step ⏎     Thread.yield(); ⏎     balance = read + amount; ⏎ } ⏎  ⏎ @Override ⏎ public long balance() { ⏎     return balance; ⏎ }
    @Override
    public synchronized void add(long amount) {
        long read = balance;
        Thread.yield();
        balance = read + amount;
    }

    @Override
    public synchronized long balance() {
        return balance;
    }
    //<<
}
`,
    'AtomicAccount.java': j`
import java.util.concurrent.atomic.AtomicLong;

public class AtomicAccount implements FineAccount {
    //>> private long balance; ⏎  ⏎ @Override ⏎ public void add(long amount) { ⏎     long read = balance; // TODO: an AtomicLong ⏎     Thread.yield(); ⏎     balance = read + amount; ⏎ } ⏎  ⏎ @Override ⏎ public long balance() { ⏎     return balance; ⏎ }
    private final AtomicLong balance = new AtomicLong();

    @Override
    public void add(long amount) {
        balance.addAndGet(amount);
    }

    @Override
    public long balance() {
        return balance.get();
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: '4 desks × 50,000 fines', vi: '4 quầy × 50.000 khoản' }, vao: '4 50000\n' },
    { ten: { en: '8 desks × 20,000 fines', vi: '8 quầy × 20.000 khoản' }, vao: '8 20000\n', an: true },
  ],
  goiY: [
    { en: 'synchronized on add AND on balance(): the lock also guarantees that the reader sees the latest write.', vi: 'synchronized trên add VÀ trên balance(): khoá còn đảm bảo người đọc thấy lần ghi mới nhất.' },
    { en: 'AtomicLong.addAndGet does the read–add–write as one compare-and-set loop, without a lock.', vi: 'AtomicLong.addAndGet làm đọc–cộng–ghi như một vòng compare-and-set, không cần khoá.' },
  ],
  loiHayGap: [
    { en: 'volatile long balance — makes writes visible but balance = balance + x is still two steps: updates are still lost.', vi: 'volatile long balance — làm lần ghi hiện ra nhưng balance = balance + x vẫn là hai bước: vẫn mất cập nhật.' },
    { en: 'Reading the balance before join() — the desks have not finished yet.', vi: 'Đọc số dư trước join() — các quầy chưa làm xong.' },
  ],
  giaiThich: { en: '<p>Two threads both read 5000, both write 5000 + their fine: one fine vanishes. Either make the whole read–modify–write a critical section (synchronized) or use a hardware compare-and-set (AtomicLong). The starter shows the loss; the safe versions match the expected total every time.</p>', vi: '<p>Hai luồng cùng đọc 5000, cùng ghi 5000 + khoản của mình: một khoản biến mất. Hoặc biến cả đọc–sửa–ghi thành vùng găng (synchronized), hoặc dùng compare-and-set của phần cứng (AtomicLong). Code khởi đầu cho thấy chỗ mất; hai bản an toàn khớp tổng mong đợi mọi lần.</p>' },
});

const de2 = deJava({
  id: 'pro192-cs8-khoa-chet',
  tieuDe: { en: 'A transfer that deadlocks, and a lock order that does not', vi: 'Chuyển tiền bị khoá chết, và thứ tự khoá thì không' },
  doKho: 'HARD', phut: 30, java: 17,
  khaiNiem: ['deadlock = a cycle of threads each holding a lock the next one wants', 'global lock ordering by id', 'nested synchronized blocks', 'ThreadMXBean.findDeadlockedThreads'],
  moTa: {
    en: `<p>${c('Bank.transfer(from, to, amount)')} locks the source account, then the target. Thread 1 pays the club from the library N times, thread 2 refunds the library from the club N times — at the same moment. Each holds one account and waits for the other: a deadlock. The given ${c('Main')} runs both threads, waits up to 5 seconds, and if they are stuck prints ${c('DEADLOCK')} with the help of ${c('ThreadMXBean.findDeadlockedThreads()')}. Rewrite ${c('transfer')} so that it always locks the account with the <b>smaller id first</b>, whatever the direction; then the balances and the total are printed and unchanged.</p>`,
    vi: `<p>${c('Bank.transfer(from, to, amount)')} khoá tài khoản nguồn rồi tới tài khoản đích. Luồng 1 trả câu lạc bộ từ thư viện N lần, luồng 2 hoàn tiền thư viện từ câu lạc bộ N lần — cùng lúc. Mỗi luồng giữ một tài khoản và chờ cái kia: khoá chết. ${c('Main')} cho sẵn chạy hai luồng, chờ tối đa 5 giây, nếu kẹt thì in ${c('DEADLOCK')} nhờ ${c('ThreadMXBean.findDeadlockedThreads()')}. Viết lại ${c('transfer')} để luôn khoá tài khoản có <b>id nhỏ hơn trước</b>, bất kể chiều chuyển; khi đó số dư và tổng được in ra và không đổi.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java and Account.java.', 'Keep one lock per account (no global lock on the whole bank).'], vi: ['Không sửa Main.java và Account.java.', 'Giữ mỗi tài khoản một khoá (không khoá chung cả ngân hàng).'] },
  dauVao: { en: 'The number of transfers in each direction.', vi: 'Số lần chuyển mỗi chiều.' },
  dauRa: { en: 'Balances and total, or DEADLOCK.', vi: 'Số dư và tổng, hoặc DEADLOCK.' },
  main: 'Main',
  timeoutMs: 20000,
  quyTac: [
    { id: 'R1', en: 'no lock on the Bank class itself', vi: 'không khoá trên chính lớp Bank', re: String.raw`synchronized\s*\(\s*(Bank\.class|this)\s*\)|static\s+synchronized`, file: '^Bank\\.java$' },
    { id: 'R2', en: 'the lock order is decided by the account id', vi: 'thứ tự khoá quyết định theo id tài khoản', re: String.raw`\.id\b`, file: '^Bank\\.java$', need: true },
  ],
  tep: {
    'Account.java': j`
// GIVEN — do not change.
public class Account {
    final int id;
    final String name;
    long balance;

    Account(int id, String name, long balance) {
        this.id = id;
        this.name = name;
        this.balance = balance;
    }
}
`,
    'Main.java': j`
import java.lang.management.ManagementFactory;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) throws InterruptedException {
        int n = new Scanner(System.in).nextInt();
        Account library = new Account(1, "library", 1_000_000);
        Account club = new Account(2, "club", 1_000_000);
        Thread pay = new Thread(() -> {
            for (int i = 0; i < n; i++) {
                Bank.transfer(library, club, 1);
            }
        });
        Thread refund = new Thread(() -> {
            for (int i = 0; i < n; i++) {
                Bank.transfer(club, library, 1);
            }
        });
        pay.setDaemon(true);
        refund.setDaemon(true);
        pay.start();
        refund.start();
        pay.join(5000);
        refund.join(5000);
        if (pay.isAlive() || refund.isAlive()) {
            long[] stuck = ManagementFactory.getThreadMXBean().findDeadlockedThreads();
            System.out.println("DEADLOCK: " + (stuck == null ? 0 : stuck.length) + " threads stuck");
            return;
        }
        System.out.println(n + " transfers each way done");
        System.out.println("library " + library.balance + ", club " + club.balance + ", total " + (library.balance + club.balance));
    }
}
`,
    'Bank.java': j`
public class Bank {
    public static void transfer(Account from, Account to, long amount) {
        //>> synchronized (from) { // TODO: always lock the smaller id first ⏎     synchronized (to) { ⏎         from.balance -= amount; ⏎         to.balance += amount; ⏎     } ⏎ }
        Account first = from.id < to.id ? from : to;
        Account second = first == from ? to : from;
        synchronized (first) {
            synchronized (second) {
                from.balance -= amount;
                to.balance += amount;
            }
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: '50,000 transfers each way', vi: '50.000 lần mỗi chiều' }, vao: '50000\n' },
    { ten: { en: '200,000 transfers each way', vi: '200.000 lần mỗi chiều' }, vao: '200000\n', an: true },
  ],
  goiY: [
    { en: 'A deadlock needs a cycle. If every thread takes locks in the same global order (smaller id first), no cycle can form.', vi: 'Khoá chết cần một vòng. Nếu mọi luồng lấy khoá theo cùng một thứ tự toàn cục (id nhỏ trước), không vòng nào hình thành.' },
    { en: 'Pick first/second by id, lock them, but still subtract from "from" and add to "to".', vi: 'Chọn first/second theo id, khoá chúng, nhưng vẫn trừ "from" và cộng "to".' },
  ],
  loiHayGap: [
    { en: 'synchronized static transfer — no deadlock, but every transfer in the bank waits for every other one.', vi: 'synchronized static transfer — hết khoá chết, nhưng mọi lần chuyển trong ngân hàng phải chờ nhau.' },
    { en: 'Swapping from and to to get the order — the money then flows the wrong way.', vi: 'Hoán đổi from và to để có thứ tự — tiền chảy sai chiều.' },
  ],
  giaiThich: { en: '<p>The four conditions of a deadlock are mutual exclusion, hold-and-wait, no preemption and a circular wait. Ordering the locks removes the circular wait while keeping fine-grained locking: transfers between unrelated accounts still run in parallel.</p>', vi: '<p>Bốn điều kiện của khoá chết: loại trừ tương hỗ, giữ-và-chờ, không thu hồi, và chờ vòng tròn. Sắp thứ tự khoá gỡ bỏ chờ vòng tròn mà vẫn giữ khoá mịn: các lần chuyển giữa những tài khoản không liên quan vẫn chạy song song.</p>' },
});

const de3 = deJava({
  id: 'pro192-cs8-chia-viec',
  tieuDe: { en: 'Scan a million loans on four threads with invokeAll', vi: 'Quét một triệu phiếu mượn trên bốn luồng bằng invokeAll' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['ExecutorService (fixed thread pool)', 'Callable<Result> per slice', 'invokeAll + Future.get', 'combine partial results', 'shutdown'],
  moTa: {
    en: `<p>Loan ${c('i')} (0 ≤ i < N) has been out for ${c('(i × 37) mod 30')} days; a loan is overdue after 14 days and every extra day costs 2000. ${c('Scan.sequential(n)')} (given) counts the overdue loans and totals the fees on one thread. Write ${c('Scan.parallel(n, threads)')}: split ${c('[0, n)')} into ${c('threads')} contiguous slices (the last one takes the remainder), one ${c('Callable<Result>')} per slice, run them with ${c('invokeAll')} on a fixed pool, add up the partial results and shut the pool down. The given ${c('Main')} prints both results and whether they are equal.</p>`,
    vi: `<p>Phiếu ${c('i')} (0 ≤ i < N) đã mượn ${c('(i × 37) mod 30')} ngày; quá 14 ngày là quá hạn và mỗi ngày thêm tốn 2000. ${c('Scan.sequential(n)')} (cho sẵn) đếm phiếu quá hạn và cộng tiền phạt trên một luồng. Viết ${c('Scan.parallel(n, threads)')}: chia ${c('[0, n)')} thành ${c('threads')} đoạn liền nhau (đoạn cuối nhận phần dư), mỗi đoạn một ${c('Callable<Result>')}, chạy bằng ${c('invokeAll')} trên pool cố định, cộng các kết quả từng phần rồi tắt pool. ${c('Main')} cho sẵn in cả hai kết quả và chúng có bằng nhau không.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java and Result.java; do not change Scan.sequential.'], vi: ['Không sửa Main.java và Result.java; không sửa Scan.sequential.'] },
  dauVao: { en: 'N and the number of threads.', vi: 'N và số luồng.' },
  dauRa: { en: 'Three lines.', vi: 'Ba dòng.' },
  main: 'Main',
  timeoutMs: 20000,
  quyTac: [{ id: 'R1', en: 'parallel uses an ExecutorService with invokeAll', vi: 'parallel dùng ExecutorService với invokeAll', re: String.raw`\.invokeAll\s*\(`, file: '^Scan\\.java$', need: true }],
  tep: {
    'Result.java': j`
// GIVEN — do not change.
public record Result(long overdue, long fees) {
    Result plus(Result other) {
        return new Result(overdue + other.overdue, fees + other.fees);
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int threads = sc.nextInt();
        Result one = Scan.sequential(n);
        Result many = Scan.parallel(n, threads);
        System.out.println("sequential: " + one);
        System.out.println("parallel (" + threads + " threads): " + many);
        System.out.println("same: " + one.equals(many));
    }
}
`,
    'Scan.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Scan {
    static Result slice(int from, int to) {
        long overdue = 0;
        long fees = 0;
        for (int i = from; i < to; i++) {
            int days = (int) ((i * 37L) % 30);
            if (days > 14) {
                overdue++;
                fees += (days - 14) * 2000L;
            }
        }
        return new Result(overdue, fees);
    }

    public static Result sequential(int n) {
        return slice(0, n);
    }

    public static Result parallel(int n, int threads) throws Exception {
        //>> return new Result(0, 0); // TODO: threads slices, invokeAll, add the futures, shutdown
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        try {
            List<Callable<Result>> jobs = new ArrayList<>();
            int size = n / threads;
            for (int t = 0; t < threads; t++) {
                int from = t * size;
                int to = t == threads - 1 ? n : from + size;
                jobs.add(() -> slice(from, to));
            }
            Result total = new Result(0, 0);
            for (Future<Result> f : pool.invokeAll(jobs)) {
                total = total.plus(f.get());
            }
            return total;
        } finally {
            pool.shutdown();
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a million loans on 4 threads', vi: 'một triệu phiếu trên 4 luồng' }, vao: '1000000 4\n' },
    { ten: { en: 'a remainder slice (1,000,003 on 7 threads), and few loans on many threads', vi: 'đoạn có phần dư (1.000.003 trên 7 luồng)' }, vao: '1000003 7\n', an: true },
    { ten: { en: 'fewer loans than threads', vi: 'ít phiếu hơn số luồng' }, vao: '5 8\n', an: true },
  ],
  goiY: [
    { en: 'The loop variables used in the lambda must be effectively final: copy them into final locals from/to inside the loop.', vi: 'Biến dùng trong lambda phải effectively final: chép vào biến cục bộ from/to bên trong vòng lặp.' },
    { en: 'invokeAll waits for every Callable; Future.get then returns each partial Result (or throws its exception).', vi: 'invokeAll chờ mọi Callable; Future.get rồi trả từng Result từng phần (hoặc ném ngoại lệ của nó).' },
  ],
  loiHayGap: [
    { en: 'n / threads slices without giving the remainder to the last one — some loans are never scanned.', vi: 'Chia n / threads mà không đưa phần dư cho đoạn cuối — vài phiếu không bao giờ được quét.' },
    { en: 'Forgetting shutdown() — the pool’s non-daemon threads keep the JVM alive after main returns.', vi: 'Quên shutdown() — các luồng không phải daemon của pool giữ JVM sống sau khi main kết thúc.' },
  ],
  giaiThich: { en: '<p>Each Callable works on its own slice and returns its own Result — no shared mutable state, so no locks. Combining the partial results after invokeAll gives exactly the sequential answer, which is the property to check before measuring any speed-up.</p>', vi: '<p>Mỗi Callable làm trên đoạn riêng và trả Result riêng — không trạng thái dùng chung, nên không cần khoá. Cộng các kết quả từng phần sau invokeAll ra đúng đáp án tuần tự — tính chất phải kiểm trước khi đo tốc độ.</p>' },
});

const de4 = deJava({
  id: 'pro192-cs8-producer-consumer',
  tieuDe: { en: 'Producer and consumer through a BlockingQueue', vi: 'Producer và consumer qua BlockingQueue' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['ArrayBlockingQueue (bounded)', 'put blocks when full, take blocks when empty', 'poison pill to stop the consumer', 'offer() to detect that the producer had to wait'],
  moTa: {
    en: `<p>The return desk receives books and puts them on a cart that holds ${c('capacity')} books; a shelver takes books from the cart and shelves them, slowly (20 ms each). Write ${c('Shelving.run(books, capacity)')}: an ${c('ArrayBlockingQueue')} of that capacity; the <b>desk</b> (the calling thread) puts every book — first try ${c('offer')}, and if the cart is full remember that it had to wait, then ${c('put')}; the <b>shelver</b> (another thread) takes until it gets the poison pill ${c('"STOP"')} and records the shelved books in order. Return a ${c('Report(shelved, deskWaited)')} after joining the shelver. The given ${c('Main')} prints the shelved order, whether the desk waited, and whether the order is unchanged.</p>`,
    vi: `<p>Quầy trả nhận sách và đặt lên xe đẩy chứa được ${c('capacity')} cuốn; người xếp kệ lấy sách từ xe và xếp, chậm (20 ms mỗi cuốn). Viết ${c('Shelving.run(books, capacity)')}: một ${c('ArrayBlockingQueue')} sức chứa đó; <b>quầy</b> (luồng gọi) đặt từng cuốn — thử ${c('offer')} trước, nếu xe đầy thì ghi nhận đã phải chờ, rồi ${c('put')}; <b>người xếp</b> (một luồng khác) lấy cho tới khi gặp viên thuốc độc ${c('"STOP"')} và ghi lại thứ tự đã xếp. Trả về ${c('Report(shelved, deskWaited)')} sau khi join luồng xếp kệ. ${c('Main')} cho sẵn in thứ tự đã xếp, quầy có phải chờ không, và thứ tự có giữ nguyên không.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java and Report.java.'], vi: ['Không sửa Main.java và Report.java.'] },
  dauVao: { en: 'Line 1: the capacity. Line 2: book codes.', vi: 'Dòng 1: sức chứa. Dòng 2: mã sách.' },
  dauRa: { en: 'Three lines.', vi: 'Ba dòng.' },
  main: 'Main',
  timeoutMs: 20000,
  quyTac: [
    { id: 'R1', en: 'an ArrayBlockingQueue connects the two threads', vi: 'một ArrayBlockingQueue nối hai luồng', re: String.raw`new\s+ArrayBlockingQueue\s*<`, file: '^Shelving\\.java$', need: true },
    { id: 'R2', en: 'the desk sends the poison pill: put(STOP)', vi: 'quầy gửi viên thuốc độc: put(STOP)', re: String.raw`\.put\s*\(\s*STOP\s*\)`, file: '^Shelving\\.java$', need: true },
  ],
  tep: {
    'Report.java': j`
import java.util.List;

// GIVEN — do not change.
public record Report(List<String> shelved, boolean deskWaited) {
}
`,
    'Main.java': j`
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) throws InterruptedException {
        Scanner sc = new Scanner(System.in);
        int capacity = Integer.parseInt(sc.nextLine().trim());
        List<String> books = Arrays.asList(sc.nextLine().trim().split("\\s+"));
        Report r = Shelving.run(books, capacity);
        System.out.println("shelved: " + r.shelved());
        System.out.println("desk had to wait: " + r.deskWaited());
        System.out.println("same order: " + r.shelved().equals(books));
    }
}
`,
    'Shelving.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class Shelving {
    static final String STOP = "STOP";

    public static Report run(List<String> books, int capacity) throws InterruptedException {
        //>> List<String> shelved = new ArrayList<>(books); // TODO: a cart (ArrayBlockingQueue), a shelver thread, a poison pill ⏎ return new Report(shelved, false);
        BlockingQueue<String> cart = new ArrayBlockingQueue<>(capacity);
        List<String> shelved = Collections.synchronizedList(new ArrayList<>());
        Thread shelver = new Thread(() -> {
            try {
                for (String b = cart.take(); !b.equals("STOP"); b = cart.take()) {
                    Thread.sleep(20);
                    shelved.add(b);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        shelver.start();
        boolean waited = false;
        for (String b : books) {
            if (!cart.offer(b)) {
                waited = true;
                cart.put(b);
            }
        }
        cart.put(STOP);
        shelver.join();
        return new Report(new ArrayList<>(shelved), waited);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'six books, a cart of two', vi: 'sáu cuốn, xe chứa hai' }, vao: '2\nB01 B02 B03 B04 B05 B06\n' },
    { ten: { en: 'a cart of one, ten books', vi: 'xe chứa một, mười cuốn' }, vao: '1\nK1 K2 K3 K4 K5 K6 K7 K8 K9 K10\n', an: true },
  ],
  goiY: [
    { en: 'offer(b) returns false immediately when the cart is full — that is how the desk knows it is going to wait; then put(b) blocks until there is room.', vi: 'offer(b) trả false ngay khi xe đầy — đó là cách quầy biết mình sắp phải chờ; rồi put(b) chặn tới khi có chỗ.' },
    { en: 'The poison pill goes through the same queue, after the last book, so the shelver finishes the real books first.', vi: 'Viên thuốc độc đi qua cùng hàng đợi, sau cuốn cuối, nên người xếp kệ làm xong sách thật trước.' },
  ],
  loiHayGap: [
    { en: 'Stopping the shelver with interrupt() — books still on the cart are never shelved.', vi: 'Dừng người xếp kệ bằng interrupt() — sách còn trên xe không bao giờ được xếp.' },
    { en: 'Polling the queue with isEmpty() + sleep in a loop — busy waiting, and a race between the check and the take.', vi: 'Vòng lặp isEmpty() + sleep để hỏi hàng đợi — chờ bận, và có kẽ hở giữa lúc kiểm và lúc lấy.' },
  ],
  giaiThich: { en: '<p>A bounded BlockingQueue gives back-pressure for free: a fast producer is slowed to the consumer’s pace instead of filling memory. A FIFO queue with one consumer keeps the order, and the poison pill ends the consumer cleanly after the last real item.</p>', vi: '<p>BlockingQueue có giới hạn cho sẵn "áp lực ngược": producer nhanh bị kéo chậm theo nhịp consumer thay vì làm đầy bộ nhớ. Hàng đợi FIFO với một consumer giữ nguyên thứ tự, và viên thuốc độc kết thúc consumer gọn gàng sau phần tử thật cuối cùng.</p>' },
});

export default moDun({ slug: 'pro192-cs8-on', ten: '11.8 ⭐ CS.8 Concurrency with deterministic results', de: [de1, de2, de3, de4] });
