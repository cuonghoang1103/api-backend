/** CSD201 · A.2 (Nâng cao) — Union-Find & phân tích khấu hao: hợp theo hạng + nén đường đi lặp (⏱ dãy xấu 10⁶), đếm phép chép của mảng động (gấp đôi vs cộng k, dự đoán không mô phỏng), co mảng ở 1/4 chống dao động (⏱). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-a-2-union-find',
  tieuDe: { en: 'Union-Find with union by rank and iterative path compression', vi: 'Union-Find với hợp theo hạng và nén đường đi không đệ quy' },
  doKho: 'MEDIUM', phut: 35,
  khaiNiem: ['disjoint sets as a parent forest', 'union by rank', 'path compression', 'O(α(n)) amortized'],
  moTa: {
    en: `<p>${c('UnionFind(n)')} (constructor given) has ${c('parent[]')} (a root points to itself), ${c('rank[]')} (all 0) and ${c('count')} = number of sets. Complete:</p>
<ul>
<li>${c('int find(int x)')} — return the root of x and <b>compress</b> the path: every node visited on the way gets ${c('parent = root')}. Write it <b>without recursion</b> (two passes: find the root, then walk again re-pointing) — the grader also builds a chain of 1,000,000 parents directly.</li>
<li>${c('boolean union(int a, int b)')} — roots ra, rb; same root → false. Otherwise the root of <b>smaller rank</b> goes under the other; equal ranks → ${c('parent[rb] = ra')} and ${c('rank[ra]++')}. Decrease ${c('count')}, return true.</li>
<li>${c('boolean connected(int a, int b)')}.</li>
</ul>
<p>Quiz A.2: the chain 1 → 2 → 3 → 4 → 5 (root 5); one ${c('find(1)')} with path compression leaves parent[1..4] = 5. The grader prints ${c('parent')}, ${c('rank')} and ${c('count')} after every command (${c('LINK a b')} writes ${c('parent[a] = b')} directly, like the quiz).</p>`,
    vi: `<p>${c('UnionFind(n)')} (hàm dựng cho sẵn) có ${c('parent[]')} (gốc trỏ về chính nó), ${c('rank[]')} (toàn 0) và ${c('count')} = số tập. Hoàn thiện:</p>
<ul>
<li>${c('find(x)')} — trả gốc của x và <b>nén</b> đường đi: mọi nút đi qua được gán ${c('parent = gốc')}. Viết <b>không đệ quy</b> (hai lượt: tìm gốc, rồi đi lại để trỏ thẳng) — máy chấm còn dựng trực tiếp một chuỗi 1.000.000 cha.</li>
<li>${c('union(a, b)')} — gốc ra, rb; cùng gốc → false. Ngược lại gốc có <b>hạng nhỏ hơn</b> về dưới gốc kia; hạng bằng nhau → ${c('parent[rb] = ra')} và ${c('rank[ra]++')}. Giảm ${c('count')}, trả true.</li>
<li>${c('connected(a, b)')}.</li>
</ul>
<p>Câu hỏi A.2: chuỗi 1 → 2 → 3 → 4 → 5 (gốc 5); một lần ${c('find(1)')} có nén để lại parent[1..4] = 5. Máy chấm in ${c('parent')}, ${c('rank')} và ${c('count')} sau mỗi lệnh (${c('LINK a b')} ghi thẳng ${c('parent[a] = b')}, như câu hỏi).</p>`,
  },
  yeuCau: { en: ['find without recursion, with full path compression.', 'union by rank exactly as described (ties: the first argument’s root stays root).'], vi: ['find không đệ quy, nén đường đi trọn vẹn.', 'union theo hạng đúng như mô tả (hạng bằng nhau: gốc của tham số thứ nhất giữ vai gốc).'] },
  dauVao: { en: 'NEW n · LINK a b · FIND x · UNION a b · SAME a b · DEEP · PERF.', vi: 'NEW n · LINK a b · FIND x · UNION a b · SAME a b · DEEP · PERF.' },
  dauRa: { en: 'The result, then parent, rank and count.', vi: 'Kết quả, rồi parent, rank và count.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 elements, 2,000,000 operations', ms: 3000, can: 'O(α(n)) amortized per operation', cham: 'O(n) per operation (no rank and no compression: a chain of length n)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        UnionFind u = new UnionFind(6);',
      lenh: `                if (p[0].equals("NEW")) {
                    u = new UnionFind(n(1));
                } else if (p[0].equals("LINK")) {
                    u.parent[n(1)] = n(2);
                } else if (p[0].equals("FIND")) {
                    r = String.valueOf(u.find(n(1)));
                } else if (p[0].equals("UNION")) {
                    r = String.valueOf(u.union(n(1), n(2)));
                } else if (p[0].equals("SAME")) {
                    r = String.valueOf(u.connected(n(1), n(2)));
                } else if (p[0].equals("DEEP")) {
                    final UnionFind d = new UnionFind(1000000);
                    for (int i = 0; i + 1 < 1000000; i++) {
                        d.parent[i] = i + 1;
                    }
                    final int[] got = new int[2];
                    r = Kiem.hen("find(0) on a chain of 1,000,000 parents", 3000, new Runnable() {
                        public void run() {
                            got[0] = d.find(0);
                            got[1] = d.parent[500000];
                        }
                    }) + ", root " + got[0] + ", parent[500000] = " + got[1];
                } else {
                    final UnionFind w = new UnionFind(1000000);
                    final int[] yes = new int[1];
                    r = Kiem.hen("union(i, i+1) + connected(0, i+1) for every i", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i + 1 < 1000000; i++) {
                                w.union(i, i + 1);
                                if (w.connected(0, i + 1)) {
                                    yes[0]++;
                                }
                            }
                        }
                    }) + ", connected " + yes[0] + ", count " + w.count;
                }`,
      trangThai: '(p[0].equals("PERF") || p[0].equals("DEEP") ? "" : "parent " + Arrays.toString(u.parent) + " rank " + Arrays.toString(u.rank) + " count " + u.count)',
    }),
  },
  tep: {
    'UnionFind.java': j`
public class UnionFind {
    int[] parent;
    int[] rank;
    int count;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        //>> return x; // TODO
        int root = x;
        while (parent[root] != root) {
            root = parent[root];
        }
        while (parent[x] != root) { // second pass: point every node on the path at the root
            int next = parent[x];
            parent[x] = root;
            x = next;
        }
        return root;
        //<<
    }

    public boolean union(int a, int b) {
        //>> return false; // TODO
        int ra = find(a), rb = find(b);
        if (ra == rb) {
            return false;
        }
        if (rank[ra] < rank[rb]) {
            parent[ra] = rb;
        } else if (rank[ra] > rank[rb]) {
            parent[rb] = ra;
        } else {
            parent[rb] = ra;
            rank[ra]++;
        }
        count--;
        return true;
        //<<
    }

    public boolean connected(int a, int b) {
        //>> return false; // TODO
        return find(a) == find(b);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the chain of quiz A.2, then unions by rank', vi: 'chuỗi của câu hỏi A.2, rồi hợp theo hạng' }, vao: 'LINK 1 2\nLINK 2 3\nLINK 3 4\nLINK 4 5\nFIND 1\nNEW 6\nUNION 0 1\nUNION 2 3\nUNION 0 2\nUNION 4 1\nSAME 3 4\nSAME 3 5\nUNION 3 4\n' },
    { ten: { en: 'a deep chain without recursion', vi: 'chuỗi sâu không đệ quy' }, vao: 'DEEP\n' },
    { ten: { en: 'rank decides who goes under', vi: 'hạng quyết định ai ở dưới' }, vao: 'NEW 8\nUNION 0 1\nUNION 2 3\nUNION 2 0\nUNION 5 4\nUNION 4 0\nUNION 6 7\nUNION 7 2\nFIND 1\nSAME 6 1\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Pass 1: root = x; while (parent[root] != root) root = parent[root]. Pass 2: walk from x again, saving parent[x] before overwriting it with root.', vi: 'Lượt 1: root = x; while (parent[root] != root) root = parent[root]. Lượt 2: đi lại từ x, lưu parent[x] trước khi ghi đè bằng root.' },
    { en: 'union works on the ROOTS (find(a), find(b)), never on a and b themselves.', vi: 'union làm việc trên các GỐC (find(a), find(b)), không bao giờ trên chính a và b.' },
  ],
  loiHayGap: [
    { en: 'parent[a] = b in union — links non-roots and silently splits sets apart.', vi: 'parent[a] = b trong union — nối các nút không phải gốc và âm thầm tách rời các tập.' },
    { en: 'The one-line recursive find (parent[x] = find(parent[x])) — correct, but a chain of a million parents overflows the stack (DEEP).', vi: 'find đệ quy một dòng (parent[x] = find(parent[x])) — đúng, nhưng chuỗi một triệu cha làm tràn ngăn xếp (DEEP).' },
  ],
  giaiThich: { en: '<p>Union by rank alone keeps every tree height ≤ log₂ n; path compression alone gives O(log n) amortized; together they give O(α(n)) amortized per operation, where α (inverse Ackermann) is at most 4 for any realistic n. The PERF sequence is the worst case for the naive version: union(i, i+1) always hangs the old chain under a new root, so connected(0, i+1) walks i nodes — about 5·10¹¹ steps in total.</p>', vi: '<p>Chỉ hợp theo hạng đã giữ mọi cây cao ≤ log₂ n; chỉ nén đường đi cho O(log n) khấu hao; kết hợp cả hai cho O(α(n)) khấu hao mỗi phép, với α (nghịch đảo Ackermann) không quá 4 cho mọi n thực tế. Dãy PERF là trường hợp xấu nhất của bản ngây thơ: union(i, i+1) luôn treo chuỗi cũ dưới gốc mới, nên connected(0, i+1) đi qua i nút — tổng cộng khoảng 5·10¹¹ bước.</p>' },
});

const de2 = deJava({
  id: 'csd201-a-2-dynamic-array-copies',
  tieuDe: { en: 'Amortized analysis by counting: element copies of a dynamic array, doubling vs growing by k', vi: 'Phân tích khấu hao bằng cách đếm: số phép chép của mảng động, gấp đôi vs cộng thêm k' },
  doKho: 'EASY', phut: 25,
  khaiNiem: ['aggregate method', 'geometric growth: total copies < 2n', 'arithmetic growth: Θ(n²/k) copies'],
  moTa: {
    en: `<p>${c('IntList(cap, doubling, step)')} (constructor given) appends ints to ${c('int[] data')}. When ${c('add')} finds the array full it grows to ${c('2·capacity')} (doubling) or ${c('capacity + step')}, copying the ${c('size')} existing elements one by one — add that number to ${c('long copies')}. Complete ${c('add')}, and ${c('static long predict(int cap, boolean doubling, int step, long n)')}: the number of copies after n appends, <b>computed without allocating any array</b> (walk the capacities only) — it must answer for n = 10⁹ instantly.</p>
<p>Quiz A.2: 16 appends from capacity 1 with doubling copy 1 + 2 + 4 + 8 = 15 elements. The grader compares your simulation with your prediction and with a 10,000,000-append run.</p>`,
    vi: `<p>${c('IntList(cap, doubling, step)')} (hàm dựng cho sẵn) thêm số nguyên vào ${c('int[] data')}. Khi ${c('add')} thấy mảng đầy thì nới thành ${c('2·sức chứa')} (gấp đôi) hoặc ${c('sức chứa + step')}, chép từng phần tử trong ${c('size')} phần tử đang có — cộng số đó vào ${c('long copies')}. Hoàn thiện ${c('add')}, và ${c('predict(cap, doubling, step, n)')}: số phép chép sau n lần thêm, <b>tính mà không cấp phát mảng nào</b> (chỉ đi qua các sức chứa) — phải trả lời tức thì với n = 10⁹.</p>
<p>Câu hỏi A.2: 16 lần thêm từ sức chứa 1, gấp đôi, chép 1 + 2 + 4 + 8 = 15 phần tử. Máy chấm so mô phỏng của bạn với dự đoán của bạn và với một lượt 10.000.000 lần thêm.</p>`,
  },
  yeuCau: { en: ['Copy element by element (or with System.arraycopy) and count every copied element.', 'predict must not allocate arrays.'], vi: ['Chép từng phần tử (hoặc System.arraycopy) và đếm mọi phần tử được chép.', 'predict không được cấp phát mảng.'] },
  dauVao: { en: 'DOUBLE cap n · STEP cap k n · PREDICT D|S cap k n · PERF.', vi: 'DOUBLE cap n · STEP cap k n · PREDICT D|S cap k n · PERF.' },
  dauRa: { en: 'Capacity, copies, copies per append and the prediction.', vi: 'Sức chứa, số phép chép, số chép mỗi lần thêm và dự đoán.' },
  main: 'KiemTra',
  hen: { n: '10,000,000 appends', ms: 3000, can: 'O(1) amortized per append (doubling)', cham: 'growing by a constant: Θ(n) per append' },
  harness: {
    'KiemTra.java': lopKiem({
      them: `
    static String sim(int cap, boolean doubling, int step, int n) {
        IntList a = new IntList(cap, doubling, step);
        for (int i = 0; i < n; i++) {
            a.add(i);
        }
        boolean ok = a.size == n;
        for (int i = 0; ok && i < n; i++) {
            ok = a.data[i] == i;
        }
        return "capacity " + a.data.length + ", copies " + a.copies + String.format(", per append %.2f", (double) a.copies / n)
                + (ok ? "" : ", CONTENT WRONG") + ", predicted " + IntList.predict(cap, doubling, step, n);
    }
`,
      lenh: `                if (p[0].equals("DOUBLE")) {
                    r = sim(n(1), true, 0, n(2));
                } else if (p[0].equals("STEP")) {
                    r = sim(n(1), false, n(2), n(3));
                } else if (p[0].equals("PREDICT")) {
                    final long[] got = new long[1];
                    final boolean d = p[1].equals("D");
                    final int cap = n(2), k = n(3);
                    final long nn = Long.parseLong(p[4]);
                    r = Kiem.hen("predict", 2000, new Runnable() {
                        public void run() {
                            got[0] = IntList.predict(cap, d, k, nn);
                        }
                    }) + ", copies " + got[0];
                } else {
                    final String[] res = new String[1];
                    r = Kiem.hen("10,000,000 appends (doubling)", 3000, new Runnable() {
                        public void run() {
                            res[0] = sim(1, true, 0, 10000000);
                        }
                    }) + ", " + res[0];
                }`,
    }),
  },
  tep: {
    'IntList.java': j`
public class IntList {
    int[] data;
    int size;
    long copies;
    final boolean doubling;
    final int step;

    public IntList(int cap, boolean doubling, int step) {
        this.data = new int[cap];
        this.doubling = doubling;
        this.step = step;
    }

    public void add(int x) {
        //>> data[size++] = x; // TODO: grow when full
        if (size == data.length) {
            int[] bigger = new int[doubling ? 2 * data.length : data.length + step];
            for (int i = 0; i < size; i++) {
                bigger[i] = data[i];
            }
            copies += size;
            data = bigger;
        }
        data[size++] = x;
        //<<
    }

    public static long predict(int cap, boolean doubling, int step, long n) {
        //>> return 0; // TODO
        long copies = 0, c = cap;
        while (c < n) { // the array is full at size c and the next append copies c elements
            copies += c;
            c = doubling ? 2 * c : c + step;
        }
        return copies;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'quiz A.2 and small growth policies', vi: 'câu hỏi A.2 và các cách nới nhỏ' }, vao: 'DOUBLE 1 16\nDOUBLE 1 17\nSTEP 1 1 16\nSTEP 4 4 100\nDOUBLE 4 100\n' },
    { ten: { en: 'predicting a billion appends', vi: 'dự đoán một tỉ lần thêm' }, vao: 'PREDICT D 1 0 1000000000\nPREDICT S 1000 1000 1000000000\nPREDICT S 1 1000000 1000000000\n' },
    { ten: { en: 'boundaries: exactly full, capacity larger than n', vi: 'biên: vừa đầy, sức chứa lớn hơn n' }, vao: 'DOUBLE 8 8\nDOUBLE 8 9\nSTEP 10 3 5\nSTEP 2 3 30\nDOUBLE 3 1000\nPREDICT D 3 0 1000\nPREDICT S 7 5 7\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'The copy happens when an append finds size == capacity; the number of copied elements is that capacity.', vi: 'Phép chép xảy ra khi một lần thêm thấy size == sức chứa; số phần tử được chép đúng bằng sức chứa đó.' },
    { en: 'predict: start with c = cap; while c < n, add c and grow c — about log₂ n steps for doubling, n/k steps for +k.', vi: 'predict: bắt đầu c = cap; khi c < n thì cộng c và nới c — khoảng log₂ n bước khi gấp đôi, n/k bước khi cộng k.' },
  ],
  loiHayGap: [
    { en: 'Counting the new capacity instead of the elements copied.', vi: 'Đếm sức chứa mới thay vì số phần tử được chép.' },
    { en: 'In predict, using c <= n — when n equals a capacity the array is full but nobody appends again, so nothing is copied.', vi: 'Trong predict dùng c <= n — khi n bằng đúng một sức chứa thì mảng đầy nhưng không ai thêm nữa, nên không chép gì.' },
  ],
  giaiThich: { en: '<p>Aggregate method: with doubling the copies are 1 + 2 + 4 + … + 2^k < 2n, so n appends cost O(n) in total — O(1) amortized, even though a single append can cost O(n). Growing by a constant k copies k + 2k + 3k + … ≈ n²/(2k): with k = 1000 and n = 10⁹ that is about 5·10¹⁴ copies against roughly 10⁹ for doubling. This is why ArrayList grows by 1.5× and never by a fixed amount.</p>', vi: '<p>Phương pháp gộp: khi gấp đôi, số phép chép là 1 + 2 + 4 + … + 2^k < 2n, nên n lần thêm tốn O(n) tổng cộng — O(1) khấu hao, dù một lần thêm riêng lẻ có thể tốn O(n). Nới thêm hằng số k thì chép k + 2k + 3k + … ≈ n²/(2k): với k = 1000 và n = 10⁹ là khoảng 5·10¹⁴ phép chép, so với chừng 10⁹ khi gấp đôi. Đó là lý do ArrayList nới 1,5 lần chứ không bao giờ cộng một lượng cố định.</p>' },
});

const de3 = deJava({
  id: 'csd201-a-2-shrink-quarter',
  tieuDe: { en: 'A stack that grows and shrinks: halve at one quarter, not at one half', vi: 'Ngăn xếp nới và co: co một nửa khi còn một phần tư, không phải một nửa' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['thrashing at the boundary', 'shrink when size = capacity / 4', 'potential method intuition'],
  moTa: {
    en: `<p>${c('IntStack')} starts with capacity 4. ${c('push')} doubles the array when it is full. Complete ${c('int pop()')}: take the top element, then if ${c('capacity > 4')} and ${c('size == capacity / 4')}, <b>halve</b> the array (copy the ${c('size')} elements, add them to ${c('copies')}). Popping an empty stack throws ${c('RuntimeException("empty")')}.</p>
<p>Why a quarter: with "halve at one half", a full array of 2^20 elements that receives push, pop, pop, push … doubles and halves on every operation — each costs 2^20 copies. Shrinking at a quarter leaves the array half full after every resize, so at least capacity/4 cheap operations happen before the next one. The complexity check runs exactly that oscillation a million times.</p>`,
    vi: `<p>${c('IntStack')} bắt đầu với sức chứa 4. ${c('push')} gấp đôi mảng khi đầy. Hoàn thiện ${c('pop()')}: lấy phần tử đỉnh, rồi nếu ${c('capacity > 4')} và ${c('size == capacity / 4')} thì <b>co một nửa</b> mảng (chép ${c('size')} phần tử, cộng vào ${c('copies')}). Lấy từ ngăn xếp rỗng ném ${c('RuntimeException("empty")')}.</p>
<p>Vì sao một phần tư: với luật "co khi còn một nửa", một mảng đầy 2^20 phần tử nhận push, pop, pop, push … sẽ gấp đôi rồi co lại ở MỌI phép — mỗi phép tốn 2^20 lần chép. Co ở một phần tư thì sau mỗi lần đổi cỡ mảng còn đầy một nửa, nên phải có ít nhất capacity/4 phép rẻ trước lần đổi cỡ tiếp theo. Kiểm độ phức tạp chạy đúng kiểu dao động đó một triệu lần.</p>`,
  },
  yeuCau: { en: ['Shrink exactly at size == capacity / 4 (and only when capacity > 4).', 'Count copied elements in copies (push already does).'], vi: ['Co đúng khi size == capacity / 4 (và chỉ khi capacity > 4).', 'Đếm số phần tử được chép vào copies (push đã làm).'] },
  dauVao: { en: 'PUSH n (pushes 1..n) · POP n · PERF.', vi: 'PUSH n (đẩy 1..n) · POP n · PERF.' },
  dauRa: { en: 'Last popped value, size, capacity, copies.', vi: 'Giá trị lấy ra cuối, size, sức chứa, số phép chép.' },
  main: 'KiemTra',
  hen: { n: '2^20 elements, 1,000,000 operations at the boundary', ms: 3000, can: 'O(1) amortized per push/pop', cham: 'O(n) per operation (shrinking at one half)' },
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        IntStack s = new IntStack();',
      lenh: `                if (p[0].equals("PUSH")) {
                    for (int i = 1; i <= n(1); i++) {
                        s.push(i);
                    }
                } else if (p[0].equals("POP")) {
                    int last = 0;
                    for (int i = 0; i < n(1); i++) {
                        last = s.pop();
                    }
                    r = "last " + last;
                } else {
                    final IntStack t = new IntStack();
                    final long[] sum = new long[1];
                    for (int i = 0; i < (1 << 20); i++) {
                        t.push(i);
                    }
                    final long before = t.copies;
                    r = Kiem.hen("push, pop, pop, push x 250,000 at a full array of 2^20", 3000, new Runnable() {
                        public void run() {
                            for (int i = 0; i < 250000; i++) {
                                t.push(i);
                                sum[0] += t.pop();
                                sum[0] += t.pop();
                                t.push(i);
                            }
                        }
                    }) + ", copies during the loop " + (t.copies - before) + ", size " + t.size + ", sum " + sum[0];
                }`,
      trangThai: '(p[0].equals("PERF") ? "" : "size " + s.size + ", capacity " + s.data.length + ", copies " + s.copies)',
    }),
  },
  tep: {
    'IntStack.java': j`
public class IntStack {
    int[] data = new int[4];
    int size;
    long copies;

    public void push(int x) {
        if (size == data.length) {
            resize(2 * data.length);
        }
        data[size++] = x;
    }

    public int pop() {
        //>> return data[--size]; // TODO: shrink at one quarter, throw when empty
        if (size == 0) {
            throw new RuntimeException("empty");
        }
        int x = data[--size];
        if (data.length > 4 && size == data.length / 4) {
            resize(data.length / 2);
        }
        return x;
        //<<
    }

    private void resize(int cap) {
        int[] d = new int[cap];
        for (int i = 0; i < size; i++) {
            d[i] = data[i];
        }
        copies += size;
        data = d;
    }
}
`,
  },
  ca: [
    { ten: { en: 'grow to 16, shrink back to 4', vi: 'nới tới 16, co lại về 4' }, vao: 'PUSH 9\nPOP 4\nPOP 1\nPOP 2\nPOP 1\nPOP 1\n' },
    { ten: { en: 'empty stack', vi: 'ngăn xếp rỗng' }, vao: 'PUSH 2\nPOP 2\nPOP 1\nPUSH 1\n' },
    { ten: { en: 'a long ride down from 1000 elements', vi: 'đi xuống từ 1000 phần tử' }, vao: 'PUSH 1000\nPOP 743\nPOP 129\nPOP 64\nPOP 63\nPOP 1\nPUSH 5\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Decrease size first, then test size == data.length / 4.', vi: 'Giảm size trước, rồi mới kiểm size == data.length / 4.' },
    { en: 'resize(cap) is already written for you — reuse it.', vi: 'resize(cap) đã viết sẵn — dùng lại.' },
  ],
  loiHayGap: [
    { en: 'Shrinking at size == capacity / 2 — correct contents, but the boundary oscillation copies a million elements per operation.', vi: 'Co khi size == capacity / 2 — nội dung đúng, nhưng dao động ở biên chép một triệu phần tử mỗi phép.' },
    { en: 'Shrinking below the initial capacity 4.', vi: 'Co xuống dưới sức chứa ban đầu 4.' },
  ],
  giaiThich: { en: '<p>Potential method: let Φ = |2·size − capacity|. Right after any resize the array is exactly half full, so Φ = 0; each push or pop changes Φ by at most 2, and a resize of k copies happens only when Φ has climbed to about k. Charging every operation 3 units therefore pays for all copies: O(1) amortized. With the one-half rule Φ is still large right after a resize — that is the thrashing the PERF case shows.</p>', vi: '<p>Phương pháp thế năng: đặt Φ = |2·size − capacity|. Ngay sau mỗi lần đổi cỡ mảng đầy đúng một nửa nên Φ = 0; mỗi push hay pop đổi Φ nhiều nhất 2, và một lần đổi cỡ chép k phần tử chỉ xảy ra khi Φ đã tăng tới khoảng k. Vậy tính mỗi phép 3 đơn vị là đủ trả mọi phép chép: O(1) khấu hao. Với luật một nửa, Φ vẫn lớn ngay sau khi đổi cỡ — chính là hiện tượng dao động mà ca PERF cho thấy.</p>' },
});

export default moDun({ slug: 'csd201-dijkstra-mst', ten: '9.2 Union-Find and amortized analysis', de: [de1, de2, de3] });
