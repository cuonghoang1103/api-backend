/** CSD201 · ⭐ CS.10 — bộ đề tổng + thiết kế cấu trúc (gen/java/cs10): LRU (HashMap + danh sách kép có lính canh, soi liên kết thật), LFU (nhóm theo tần suất), MinStack O(1), trung vị dòng dữ liệu (hai heap), RandomizedSet O(1), TimeMap (TreeMap.floorEntry), trộn k danh sách (heap, dùng lại nút), tích trừ chính nó (không phép chia). */
import { moDun, c, j } from './_chung.mjs';
import { deCs } from './_cs.mjs';

const LENH_DV = (en, vi) => ({ en: `One command per line: ${en}; RANDOM compares with a simple slow reference on thousands of random operations; PERF is the complexity check.`, vi: `Mỗi dòng một lệnh: ${vi}; RANDOM so với một bản tham chiếu đơn giản, chậm trên hàng nghìn thao tác ngẫu nhiên; PERF là phép kiểm độ phức tạp.` });

const de1 = deCs({
  id: 'csd201-cs10-lru-cache',
  tieuDe: { en: 'LRU cache — a HashMap plus your own doubly linked list with sentinels', vi: 'Bộ nhớ đệm LRU — HashMap cùng danh sách liên kết kép tự viết có lính canh' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['HashMap key → node', 'doubly linked list ordered by recency', 'sentinel head/tail: no null checks', 'O(1) get and put'],
  moTa: {
    en: `<p>Complete ${c('LRUCache')} (capacity ≥ 1): ${c('int get(int key)')} returns the value or −1, and makes the key the most recently used; ${c('void put(int key, int value)')} inserts or updates (also making it most recent); when inserting a new key into a full cache, first evict the <b>least recently used</b> key.</p>
<p>Both operations must be O(1): a ${c('HashMap<Integer, Node>')} finds the node, and a doubly linked list with the given sentinels ${c('head')} (most recent side) and ${c('tail')} keeps the order — unlink a node and re-insert it right after head; evict ${c('tail.prev')}. The grader prints the keys from ${c('head.next')} to ${c('tail')} along your ${c('next')} links and checks every ${c('prev')} link. ${c('LinkedHashMap')} is not allowed — the point is to build it. The complexity check runs a million operations on a cache of 100,000.</p>`,
    vi: `<p>Hoàn thiện ${c('LRUCache')} (sức chứa ≥ 1): ${c('get(key)')} trả giá trị hoặc −1, và biến khoá đó thành dùng gần nhất; ${c('put(key, value)')} thêm hoặc cập nhật (cũng thành gần nhất); khi thêm khoá mới vào bộ đệm đầy, trước hết bỏ khoá <b>lâu không dùng nhất</b>.</p>
<p>Cả hai thao tác phải O(1): ${c('HashMap<Integer, Node>')} tìm nút, còn danh sách kép với các lính canh cho sẵn ${c('head')} (phía gần nhất) và ${c('tail')} giữ thứ tự — gỡ nút rồi chèn lại ngay sau head; bỏ ${c('tail.prev')}. Máy chấm in các khoá từ ${c('head.next')} tới ${c('tail')} theo chính các liên kết ${c('next')} của bạn và kiểm mọi liên kết ${c('prev')}. Không được dùng ${c('LinkedHashMap')} — mục đích là tự dựng nó. Kiểm độ phức tạp chạy một triệu thao tác trên bộ đệm 100.000.</p>`,
  },
  hen: { n: '1,000,000 operations, capacity 100,000', ms: 3000, can: 'O(1) per operation', cham: 'O(n) per operation (a list ordered by recency)' },
  quyTac: [{ id: 'R1', en: 'build the order yourself: no LinkedHashMap / LinkedList / ArrayList in LRUCache', vi: 'tự dựng thứ tự: không LinkedHashMap / LinkedList / ArrayList trong LRUCache', re: String.raw`\b(LinkedHashMap|LinkedList|ArrayList|ArrayDeque)\b`, file: 'LRUCache' }],
  dauVao: LENH_DV('NEW cap · PUT key value · GET key', 'NEW cap · PUT khoá giá-trị · GET khoá'),
  truoc: '        LRUCache c = new LRUCache(2);',
  them: `
    static String order(LRUCache c) {
        StringBuilder sb = new StringBuilder("[");
        List<Integer> fwd = new ArrayList<Integer>();
        int guard = 0;
        for (LRUCache.Node x = c.head.next; x != null && x != c.tail && guard < 1000; x = x.next, guard++) {
            fwd.add(x.key);
        }
        List<Integer> back = new ArrayList<Integer>();
        guard = 0;
        for (LRUCache.Node x = c.tail.prev; x != null && x != c.head && guard < 1000; x = x.prev, guard++) {
            back.add(0, x.key);
        }
        for (int i = 0; i < fwd.size(); i++) {
            sb.append(i > 0 ? " " : "").append(fwd.get(i));
        }
        return sb + "]" + (fwd.equals(back) ? "" : " BROKEN prev LINKS");
    }

    static int bGet(List<int[]> l, int k) {
        for (int i = 0; i < l.size(); i++) {
            if (l.get(i)[0] == k) {
                int[] e = l.remove(i);
                l.add(0, e);
                return e[1];
            }
        }
        return -1;
    }

    static void bPut(List<int[]> l, int cap, int k, int v) {
        for (int i = 0; i < l.size(); i++) {
            if (l.get(i)[0] == k) {
                l.remove(i);
                l.add(0, new int[] {k, v});
                return;
            }
        }
        if (l.size() == cap) {
            l.remove(l.size() - 1);
        }
        l.add(0, new int[] {k, v});
    }

    static String bOrder(List<int[]> l) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < l.size(); i++) {
            sb.append(i > 0 ? " " : "").append(l.get(i)[0]);
        }
        return sb + "]";
    }
`,
  lenh: `                if (p[0].equals("NEW")) {
                    c = new LRUCache(n(1));
                    r = order(c);
                } else if (p[0].equals("PUT")) {
                    c.put(n(1), n(2));
                    r = order(c);
                } else if (p[0].equals("GET")) {
                    r = c.get(n(1)) + " " + order(c);
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(151);
                    String sai = null;
                    int ops = 0;
                    for (int t = 0; t < 300 && sai == null; t++) {
                        int cap = 1 + rnd.nextInt(4);
                        LRUCache x = new LRUCache(cap);
                        List<int[]> l = new ArrayList<int[]>();
                        for (int q = 0; q < 40 && sai == null; q++) {
                            int k = rnd.nextInt(6);
                            String got, want;
                            ops++;
                            if (rnd.nextBoolean()) {
                                int v = rnd.nextInt(100);
                                x.put(k, v);
                                bPut(l, cap, k, v);
                                got = order(x);
                                want = bOrder(l);
                            } else {
                                got = x.get(k) + " " + order(x);
                                want = bGet(l, k) + " " + bOrder(l);
                            }
                            if (!got.equals(want)) {
                                sai = "cap " + cap + ", operation " + (q + 1) + " on key " + k + ": " + got + ", expected " + want;
                            }
                        }
                    }
                    r = ketQua("300 random caches x 40 operations", ops, sai);
                } else {
                    final Random rnd = new Random(153);
                    final long[] s = new long[1];
                    r = Kiem.hen("1,000,000 operations, capacity 100,000", 3000, new Runnable() {
                        public void run() {
                            LRUCache x = new LRUCache(100000);
                            for (int i = 0; i < 1000000; i++) {
                                int k = rnd.nextInt(200000);
                                if (i % 2 == 0) {
                                    x.put(k, i);
                                } else {
                                    s[0] += x.get(k);
                                }
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'LRUCache.java': j`
import java.util.HashMap;
import java.util.Map;

public class LRUCache {

    static class Node {
        int key, val;
        Node prev, next;

        Node(int key, int val) {
            this.key = key;
            this.val = val;
        }
    }

    final int cap;
    final Map<Integer, Node> map = new HashMap<Integer, Node>();
    final Node head = new Node(0, 0), tail = new Node(0, 0); // sentinels: head side = most recent

    public LRUCache(int capacity) {
        cap = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        //>> return -1; // TODO
        Node x = map.get(key);
        if (x == null) {
            return -1;
        }
        unlink(x);
        addFront(x); // used: it becomes the most recent
        return x.val;
        //<<
    }

    public void put(int key, int value) {
        //>> // TODO
        Node x = map.get(key);
        if (x != null) {
            x.val = value;
            unlink(x);
            addFront(x);
            return;
        }
        if (map.size() == cap) { // evict the least recently used
            Node old = tail.prev;
            unlink(old);
            map.remove(old.key);
        }
        x = new Node(key, value);
        map.put(key, x);
        addFront(x);
        //<<
    }
    //>> // TODO: helper(s)

    private void unlink(Node x) {
        x.prev.next = x.next;
        x.next.prev = x.prev;
    }

    private void addFront(Node x) {
        x.next = head.next;
        x.prev = head;
        head.next.prev = x;
        head.next = x;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'capacity 2 (the classic sequence)', vi: 'sức chứa 2 (dãy kinh điển)' }, vao: 'PUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nPUT 4 4\nGET 1\nGET 3\nGET 4\n' },
    { ten: { en: 'updates refresh the order, capacity 1', vi: 'cập nhật làm mới thứ tự, sức chứa 1' }, vao: 'NEW 3\nPUT 1 10\nPUT 2 20\nPUT 3 30\nPUT 1 11\nPUT 4 40\nGET 2\nGET 1\nNEW 1\nPUT 5 5\nPUT 6 6\nGET 5\nGET 6\n' },
    { ten: { en: 'random operations', vi: 'thao tác ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Two private helpers do all the list work: unlink(x) and addFront(x). get and put only call them.', vi: 'Hai hàm phụ làm mọi việc với danh sách: unlink(x) và addFront(x). get và put chỉ gọi chúng.' },
    { en: 'Store the key inside the node — when evicting tail.prev you need its key to remove it from the map.', vi: 'Lưu khoá trong nút — khi bỏ tail.prev bạn cần khoá để xoá nó khỏi map.' },
  ],
  loiHayGap: [
    { en: 'put on an existing key that evicts something — the size did not grow, nothing must be evicted.', vi: 'put lên khoá đã có mà lại bỏ một khoá khác — kích thước không tăng, không được bỏ gì.' },
    { en: 'Forgetting one of the four pointer writes in addFront — the forward order looks right but prev is broken.', vi: 'Quên một trong bốn lệnh gán con trỏ của addFront — thứ tự xuôi trông đúng nhưng prev bị đứt.' },
  ],
  giaiThich: { en: '<p>The map gives O(1) access to a node, the doubly linked list gives O(1) removal from the middle and O(1) insertion at the front; sentinels remove every special case for empty lists and ends. This is exactly what java.util.LinkedHashMap does internally in access-order mode.</p>', vi: '<p>Map cho truy cập nút O(1), danh sách kép cho gỡ ở giữa O(1) và chèn ở đầu O(1); lính canh xoá mọi trường hợp đặc biệt về danh sách rỗng và hai đầu. Đây chính là cách java.util.LinkedHashMap làm bên trong ở chế độ thứ tự truy cập.</p>' },
});

const de2 = deCs({
  id: 'csd201-cs10-lfu-cache',
  tieuDe: { en: 'LFU cache — evict the least FREQUENTLY used, ties by least recent, all in O(1)', vi: 'Bộ nhớ đệm LFU — bỏ khoá ÍT DÙNG nhất, hoà thì lâu không dùng nhất, mọi thao tác O(1)' },
  doKho: 'HARD', phut: 45,
  khaiNiem: ['frequency → keys in order of last use', 'track minFreq', 'a new key always has frequency 1'],
  moTa: {
    en: `<p>Complete ${c('LFUCache')} (capacity ≥ 0): ${c('get(key)')} returns the value or −1 and increases the key’s use count; ${c('put(key, value)')} updates (counting as a use) or inserts with count 1. When a new key arrives and the cache is full, evict the key with the <b>smallest use count</b>; among those, the one used <b>least recently</b>. Capacity 0 stores nothing.</p>
<p>O(1): ${c('val')} and ${c('freq')} maps, plus ${c('Map<Integer, LinkedHashSet<Integer>>')} frequency → keys in order of last use, and ${c('minFreq')}. Touching a key moves it from set f to set f + 1 (and raises minFreq if set f became empty and was the minimum); inserting sets minFreq = 1. The complexity check runs a million operations with capacity 50,000.</p>`,
    vi: `<p>Hoàn thiện ${c('LFUCache')} (sức chứa ≥ 0): ${c('get(key)')} trả giá trị hoặc −1 và tăng số lần dùng của khoá; ${c('put(key, value)')} cập nhật (tính là một lần dùng) hoặc thêm với số lần 1. Khi khoá mới tới mà bộ đệm đầy, bỏ khoá có <b>số lần dùng nhỏ nhất</b>; trong số đó, khoá dùng <b>lâu nhất</b> trước đây. Sức chứa 0 thì không lưu gì.</p>
<p>O(1): các map ${c('val')} và ${c('freq')}, cộng ${c('Map<Integer, LinkedHashSet<Integer>>')} tần suất → các khoá theo thứ tự dùng gần nhất, và ${c('minFreq')}. Chạm vào một khoá chuyển nó từ tập f sang tập f + 1 (và tăng minFreq nếu tập f vừa rỗng và đang là nhỏ nhất); thêm khoá mới đặt minFreq = 1. Kiểm độ phức tạp chạy một triệu thao tác với sức chứa 50.000.</p>`,
  },
  hen: { n: '1,000,000 operations, capacity 50,000', ms: 3000, can: 'O(1) per operation', cham: 'O(n) per eviction (scanning for the minimum)' },
  dauVao: LENH_DV('NEW cap · PUT key value · GET key', 'NEW cap · PUT khoá giá-trị · GET khoá'),
  truoc: '        LFUCache c = new LFUCache(2);',
  them: `
    // reference: entries {key, val, freq, lastUse}; O(n) per operation
    static int tick;

    static int[] find(List<int[]> l, int k) {
        for (int[] e : l) {
            if (e[0] == k) {
                return e;
            }
        }
        return null;
    }

    static int bGet(List<int[]> l, int k) {
        int[] e = find(l, k);
        if (e == null) {
            return -1;
        }
        e[2]++;
        e[3] = ++tick;
        return e[1];
    }

    static void bPut(List<int[]> l, int cap, int k, int v) {
        if (cap == 0) {
            return;
        }
        int[] e = find(l, k);
        if (e != null) {
            e[1] = v;
            e[2]++;
            e[3] = ++tick;
            return;
        }
        if (l.size() == cap) {
            int[] w = l.get(0);
            for (int[] x : l) {
                if (x[2] < w[2] || (x[2] == w[2] && x[3] < w[3])) {
                    w = x;
                }
            }
            l.remove(w);
        }
        l.add(new int[] {k, v, 1, ++tick});
    }
`,
  lenh: `                if (p[0].equals("NEW")) {
                    c = new LFUCache(n(1));
                } else if (p[0].equals("PUT")) {
                    c.put(n(1), n(2));
                } else if (p[0].equals("GET")) {
                    r = String.valueOf(c.get(n(1)));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(155);
                    String sai = null;
                    int ops = 0;
                    for (int t = 0; t < 300 && sai == null; t++) {
                        int cap = rnd.nextInt(4);
                        LFUCache x = new LFUCache(cap);
                        List<int[]> l = new ArrayList<int[]>();
                        for (int q = 0; q < 60 && sai == null; q++) {
                            int k = rnd.nextInt(6);
                            ops++;
                            if (rnd.nextBoolean()) {
                                int v = rnd.nextInt(100);
                                x.put(k, v);
                                bPut(l, cap, k, v);
                            } else {
                                int got = x.get(k), want = bGet(l, k);
                                if (got != want) {
                                    sai = "cap " + cap + ", operation " + (q + 1) + ": get " + k + " -> " + got + ", expected " + want;
                                }
                            }
                        }
                    }
                    r = ketQua("300 random caches x 60 operations", ops, sai);
                } else {
                    final Random rnd = new Random(157);
                    final long[] s = new long[1];
                    r = Kiem.hen("1,000,000 operations, capacity 50,000", 3000, new Runnable() {
                        public void run() {
                            LFUCache x = new LFUCache(50000);
                            for (int i = 0; i < 1000000; i++) {
                                int k = rnd.nextInt(100000);
                                if (i % 3 == 0) {
                                    x.put(k, i);
                                } else {
                                    s[0] += x.get(k);
                                }
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'LFUCache.java': j`
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

public class LFUCache {
    private final int cap;
    private int minFreq = 0;
    private final Map<Integer, Integer> val = new HashMap<Integer, Integer>(), freq = new HashMap<Integer, Integer>();
    private final Map<Integer, LinkedHashSet<Integer>> byFreq = new HashMap<Integer, LinkedHashSet<Integer>>(); // oldest first

    public LFUCache(int capacity) {
        cap = capacity;
    }

    public int get(int key) {
        //>> return -1; // TODO
        if (!val.containsKey(key)) {
            return -1;
        }
        touch(key);
        return val.get(key);
        //<<
    }

    public void put(int key, int value) {
        //>> // TODO
        if (cap == 0) {
            return;
        }
        if (val.containsKey(key)) {
            val.put(key, value);
            touch(key);
            return;
        }
        if (val.size() == cap) { // evict: lowest frequency, then least recent
            int old = byFreq.get(minFreq).iterator().next();
            byFreq.get(minFreq).remove(old);
            val.remove(old);
            freq.remove(old);
        }
        val.put(key, value);
        freq.put(key, 1);
        minFreq = 1;
        bucket(1).add(key);
        //<<
    }
    //>> // TODO: helper(s)

    private LinkedHashSet<Integer> bucket(int f) {
        LinkedHashSet<Integer> s = byFreq.get(f);
        if (s == null) {
            s = new LinkedHashSet<Integer>();
            byFreq.put(f, s);
        }
        return s;
    }

    private void touch(int k) { // frequency f -> f + 1, now the most recent of its group
        int f = freq.get(k);
        byFreq.get(f).remove(k);
        if (f == minFreq && byFreq.get(f).isEmpty()) {
            minFreq++;
        }
        freq.put(k, f + 1);
        bucket(f + 1).add(k);
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'capacity 2', vi: 'sức chứa 2' }, vao: 'PUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nGET 3\nPUT 4 4\nGET 1\nGET 3\nGET 4\n' },
    { ten: { en: 'ties broken by recency, capacity 0', vi: 'hoà thì xét gần đây, sức chứa 0' }, vao: 'NEW 2\nPUT 1 1\nPUT 2 2\nPUT 3 3\nGET 1\nGET 2\nGET 3\nNEW 0\nPUT 0 0\nGET 0\n' },
    { ten: { en: 'random operations', vi: 'thao tác ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A LinkedHashSet keeps insertion order: iterator().next() is the least recently touched key of that frequency.', vi: 'LinkedHashSet giữ thứ tự chèn: iterator().next() là khoá lâu không chạm nhất của tần suất đó.' },
    { en: 'minFreq only ever increases by one in touch, and resets to 1 when a new key arrives.', vi: 'minFreq chỉ tăng một đơn vị trong touch, và về 1 khi có khoá mới.' },
  ],
  loiHayGap: [
    { en: 'Evicting AFTER inserting the new key — the new key (frequency 1) evicts itself.', vi: 'Bỏ khoá SAU khi thêm khoá mới — khoá mới (tần suất 1) tự bỏ chính nó.' },
    { en: 'Searching all keys for the minimum frequency on every eviction — O(n).', vi: 'Tìm tần suất nhỏ nhất trên mọi khoá mỗi lần bỏ — O(n).' },
  ],
  giaiThich: { en: '<p>Grouping keys by frequency, each group kept in recency order, turns "least frequent, then least recent" into "first key of group minFreq". Every map/set operation is O(1) expected, and minFreq can be maintained without scanning because counts only grow by one.</p>', vi: '<p>Gom khoá theo tần suất, mỗi nhóm giữ theo thứ tự gần đây, biến "ít dùng nhất, rồi lâu nhất" thành "khoá đầu tiên của nhóm minFreq". Mọi thao tác map/set là O(1) kỳ vọng, và minFreq duy trì được mà không cần quét vì số đếm chỉ tăng từng một.</p>' },
});

const de3 = deCs({
  id: 'csd201-cs10-min-stack',
  tieuDe: { en: 'A stack with getMin() in O(1) — a second stack of minimums', vi: 'Ngăn xếp có getMin() O(1) — ngăn xếp thứ hai chứa giá trị nhỏ nhất' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['the minimum at every depth', 'push min(x, current min)', 'pop both stacks together'],
  moTa: {
    en: `<p>Complete ${c('MinStack')}: ${c('push(x)')}, ${c('int pop()')}, ${c('int top()')} and ${c('int getMin()')}, every one O(1). On an empty stack ${c('pop')}, ${c('top')} and ${c('getMin')} throw ${c('RuntimeException("empty")')}.</p>
<p>Keep a second stack: when pushing x, push ${c('min(x, mins.peek())')} onto it (or x if empty); pop both together. Then the top of the second stack is always the minimum of the current contents. Scanning the stack for the minimum is O(n) — the complexity check calls getMin after each of a million operations.</p>`,
    vi: `<p>Hoàn thiện ${c('MinStack')}: ${c('push(x)')}, ${c('pop()')}, ${c('top()')} và ${c('getMin()')}, mỗi thao tác O(1). Trên ngăn xếp rỗng, ${c('pop')}, ${c('top')} và ${c('getMin')} ném ${c('RuntimeException("empty")')}.</p>
<p>Giữ một ngăn xếp thứ hai: khi đẩy x, đẩy ${c('min(x, mins.peek())')} vào nó (rỗng thì đẩy x); lấy ra thì lấy cả hai. Khi đó đỉnh ngăn xếp thứ hai luôn là giá trị nhỏ nhất của nội dung hiện tại. Quét ngăn xếp tìm nhỏ nhất là O(n) — kiểm độ phức tạp gọi getMin sau mỗi thao tác trong một triệu thao tác.</p>`,
  },
  hen: { n: '1,000,000 operations', ms: 3000, can: 'O(1) per operation', cham: 'O(n) getMin (scanning)' },
  dauVao: LENH_DV('PUSH x · POP · TOP · MIN', 'PUSH x · POP · TOP · MIN'),
  truoc: '        MinStack s = new MinStack();',
  them: '',
  lenh: `                if (p[0].equals("PUSH")) {
                    s.push(n(1));
                } else if (p[0].equals("POP")) {
                    r = String.valueOf(s.pop());
                } else if (p[0].equals("TOP")) {
                    r = String.valueOf(s.top());
                } else if (p[0].equals("MIN")) {
                    r = String.valueOf(s.getMin());
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(159);
                    String sai = null;
                    int ops = 0;
                    for (int t = 0; t < 200 && sai == null; t++) {
                        MinStack x = new MinStack();
                        List<Integer> l = new ArrayList<Integer>();
                        for (int q = 0; q < 50 && sai == null; q++) {
                            ops++;
                            int op = rnd.nextInt(4);
                            String got, want;
                            if (op == 0 || l.isEmpty()) {
                                int v = rnd.nextInt(21) - 10;
                                x.push(v);
                                l.add(v);
                                got = "";
                                want = "";
                            } else if (op == 1) {
                                got = "" + x.pop();
                                want = "" + l.remove(l.size() - 1);
                            } else if (op == 2) {
                                got = "" + x.top();
                                want = "" + l.get(l.size() - 1);
                            } else {
                                got = "" + x.getMin();
                                want = "" + Collections.min(l);
                            }
                            if (!got.equals(want)) {
                                sai = "operation " + (q + 1) + " on " + l + ": " + got + ", expected " + want;
                            }
                        }
                    }
                    r = ketQua("200 random stacks x 50 operations", ops, sai);
                } else {
                    final Random rnd = new Random(161);
                    final long[] sum = new long[1];
                    r = Kiem.hen("1,000,000 operations + getMin after each", 3000, new Runnable() {
                        public void run() {
                            MinStack x = new MinStack();
                            int size = 0;
                            for (int i = 0; i < 1000000; i++) {
                                if (size == 0 || i % 3 != 0) {
                                    x.push(1000000 - i + rnd.nextInt(1000));
                                    size++;
                                } else {
                                    x.pop();
                                    size--;
                                }
                                sum[0] += x.getMin();
                            }
                        }
                    }) + ", sum " + sum[0];
                }`,
  tep: {
    'MinStack.java': j`
import java.util.ArrayDeque;
import java.util.Deque;

public class MinStack {
    private final Deque<Integer> st = new ArrayDeque<Integer>();
    //>> // TODO: field(s)
    private final Deque<Integer> mins = new ArrayDeque<Integer>(); // the minimum at each depth
    //<<

    public void push(int x) {
        //>> st.push(x); // TODO
        st.push(x);
        mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
        //<<
    }

    public int pop() {
        //>> return st.pop(); // TODO
        if (st.isEmpty()) {
            throw new RuntimeException("empty");
        }
        mins.pop();
        return st.pop();
        //<<
    }

    public int top() {
        //>> return st.peek(); // TODO
        if (st.isEmpty()) {
            throw new RuntimeException("empty");
        }
        return st.peek();
        //<<
    }

    public int getMin() {
        //>> return 0; // TODO
        if (mins.isEmpty()) {
            throw new RuntimeException("empty");
        }
        return mins.peek();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'push, pop and the minimum', vi: 'đẩy, lấy và giá trị nhỏ nhất' }, vao: 'PUSH 5\nPUSH 3\nPUSH 7\nMIN\nPUSH 3\nPOP\nMIN\nPOP\nMIN\nPOP\nMIN\nTOP\n' },
    { ten: { en: 'empty stack', vi: 'ngăn xếp rỗng' }, vao: 'MIN\nPUSH -1\nPOP\nPOP\nTOP\n' },
    { ten: { en: 'random operations', vi: 'thao tác ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Push onto the minimum stack on EVERY push (not only when x is a new minimum) — then both stacks always have the same size.', vi: 'Đẩy vào ngăn xếp nhỏ nhất ở MỌI lần đẩy (không chỉ khi x là nhỏ nhất mới) — khi đó hai ngăn xếp luôn cùng kích thước.' },
    { en: 'ArrayDeque.pop() on an empty deque throws NoSuchElementException — check emptiness yourself to throw the required message.', vi: 'ArrayDeque.pop() trên deque rỗng ném NoSuchElementException — tự kiểm rỗng để ném đúng thông điệp yêu cầu.' },
  ],
  loiHayGap: [
    { en: 'Keeping a single "min" variable — after popping the minimum you do not know the next one.', vi: 'Giữ một biến "min" duy nhất — lấy giá trị nhỏ nhất ra rồi thì không biết giá trị kế.' },
    { en: 'Pushing to mins only when x < min — duplicates of the minimum break it (use ≤ or push every time).', vi: 'Chỉ đẩy vào mins khi x < min — các bản trùng của giá trị nhỏ nhất làm hỏng (dùng ≤ hoặc đẩy mọi lần).' },
  ],
  giaiThich: { en: '<p>The minimum of a stack only changes at the top, so remembering "the minimum so far" at every depth answers getMin in O(1) at the cost of O(n) extra memory (or O(number of new minimums) with the ≤ variant).</p>', vi: '<p>Giá trị nhỏ nhất của ngăn xếp chỉ đổi ở đỉnh, nên nhớ "nhỏ nhất tới đây" ở mọi độ sâu trả lời getMin trong O(1), đổi lại O(n) bộ nhớ phụ (hoặc O(số lần có nhỏ nhất mới) với biến thể ≤).</p>' },
});

const de4 = deCs({
  id: 'csd201-cs10-median-stream',
  tieuDe: { en: 'Median of a data stream — a max-heap and a min-heap', vi: 'Trung vị của dòng dữ liệu — một max-heap và một min-heap' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['lo = max-heap of the smaller half', 'hi = min-heap of the larger half', 'size(lo) = size(hi) or + 1'],
  moTa: {
    en: `<p>Complete ${c('MedianFinder')}: ${c('void addNum(int x)')} and ${c('double findMedian()')} (called only after at least one add). Example: add 5 → 5.0, add 15 → 10.0, add 1 → 5.0, add 3 → 4.0. Average with a long: two values near 2³¹ must not overflow.</p>
<p>Keep the smaller half in a max-heap ${c('lo')} and the larger half in a min-heap ${c('hi')}, with ${c('lo')} holding the extra element when the count is odd. addNum: push x into lo, move lo’s maximum to hi, and if hi became larger move its minimum back. O(log n) per add, O(1) per median. Sorting (or inserting into a sorted list) for every add is too slow for the 200,000-number check.</p>`,
    vi: `<p>Hoàn thiện ${c('MedianFinder')}: ${c('addNum(x)')} và ${c('findMedian()')} (chỉ gọi sau ít nhất một lần thêm). Ví dụ: thêm 5 → 5.0, thêm 15 → 10.0, thêm 1 → 5.0, thêm 3 → 4.0. Lấy trung bình bằng long: hai giá trị gần 2³¹ không được tràn.</p>
<p>Giữ nửa nhỏ trong max-heap ${c('lo')} và nửa lớn trong min-heap ${c('hi')}, ${c('lo')} giữ phần tử dư khi số lượng lẻ. addNum: đẩy x vào lo, chuyển max của lo sang hi, và nếu hi lớn hơn thì chuyển min của nó về. O(log n) mỗi lần thêm, O(1) mỗi lần hỏi trung vị. Sắp xếp (hay chèn vào danh sách đã sắp) mỗi lần thêm là quá chậm cho phép kiểm 200.000 số.</p>`,
  },
  hen: { n: '200,000 numbers, a median after each', ms: 3000, can: 'O(log n) per add, O(1) per median', cham: 'O(n) or O(n log n) per add (sorted list / sorting)' },
  dauVao: LENH_DV('ADD x (prints the median after the add) · MED', 'ADD x (in trung vị sau khi thêm) · MED'),
  truoc: '        MedianFinder m = new MedianFinder();',
  them: '',
  lenh: `                if (p[0].equals("ADD")) {
                    m.addNum(n(1));
                    r = String.valueOf(m.findMedian());
                } else if (p[0].equals("MED")) {
                    r = String.valueOf(m.findMedian());
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(163);
                    String sai = null;
                    int ops = 0;
                    for (int t = 0; t < 200 && sai == null; t++) {
                        MedianFinder x = new MedianFinder();
                        List<Integer> l = new ArrayList<Integer>();
                        for (int q = 0; q < 30 && sai == null; q++) {
                            int v = t % 4 == 0 ? rnd.nextInt() : rnd.nextInt(21) - 10;
                            x.addNum(v);
                            l.add(v);
                            List<Integer> s = new ArrayList<Integer>(l);
                            Collections.sort(s);
                            int k = s.size();
                            double want = k % 2 == 1 ? s.get(k / 2) : ((long) s.get(k / 2 - 1) + s.get(k / 2)) / 2.0, got = x.findMedian();
                            ops++;
                            if (got != want) {
                                sai = "after " + l + ": " + got + ", expected " + want;
                            }
                        }
                    }
                    r = ketQua("200 random streams x 30 numbers", ops, sai);
                } else {
                    final Random rnd = new Random(165);
                    final double[] s = new double[1];
                    r = Kiem.hen("200,000 numbers, a median after each", 3000, new Runnable() {
                        public void run() {
                            MedianFinder x = new MedianFinder();
                            for (int i = 0; i < 200000; i++) {
                                x.addNum(rnd.nextInt(1000000));
                                s[0] += x.findMedian();
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'MedianFinder.java': j`
import java.util.Collections;
import java.util.PriorityQueue;

public class MedianFinder {
    //>> // TODO: field(s)
    private final PriorityQueue<Integer> lo = new PriorityQueue<Integer>(11, Collections.<Integer>reverseOrder()); // max-heap
    private final PriorityQueue<Integer> hi = new PriorityQueue<Integer>(); // min-heap
    //<<

    public void addNum(int x) {
        //>> // TODO
        lo.add(x);
        hi.add(lo.poll()); // the largest of the small half moves up
        if (hi.size() > lo.size()) {
            lo.add(hi.poll()); // lo keeps the extra element
        }
        //<<
    }

    public double findMedian() {
        //>> return 0; // TODO
        return lo.size() > hi.size() ? lo.peek() : ((long) lo.peek() + hi.peek()) / 2.0; // long: no overflow
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'ADD 5\nADD 15\nADD 1\nADD 3\nADD 8\nADD 7\nMED\n' },
    { ten: { en: 'extremes', vi: 'cực trị' }, vao: 'ADD 2147483647\nADD 2147483647\nADD -2147483648\nADD -2147483648\n' },
    { ten: { en: 'random streams', vi: 'dòng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A max-heap in Java: new PriorityQueue<Integer>(11, Collections.reverseOrder()).', vi: 'Max-heap trong Java: new PriorityQueue<Integer>(11, Collections.reverseOrder()).' },
    { en: 'Always passing x through lo and then hi keeps every element of lo ≤ every element of hi.', vi: 'Luôn cho x đi qua lo rồi qua hi giữ mọi phần tử của lo ≤ mọi phần tử của hi.' },
  ],
  loiHayGap: [
    { en: 'Adding x straight to the smaller heap — the halves stop being "smaller" and "larger".', vi: 'Thêm x thẳng vào heap nhỏ hơn — hai nửa không còn là "nửa nhỏ" và "nửa lớn".' },
    { en: '(lo.peek() + hi.peek()) / 2.0 with Integers — overflows for two large values.', vi: '(lo.peek() + hi.peek()) / 2.0 với Integer — tràn với hai giá trị lớn.' },
  ],
  giaiThich: { en: '<p>The median only depends on the boundary between the two halves; heaps keep exactly the two boundary elements at their tops. Each add does a constant number of heap operations, O(log n); the median is read in O(1).</p>', vi: '<p>Trung vị chỉ phụ thuộc ranh giới giữa hai nửa; heap giữ đúng hai phần tử ranh giới ở đỉnh. Mỗi lần thêm làm một số hằng phép heap, O(log n); trung vị đọc trong O(1).</p>' },
});

const de5 = deCs({
  id: 'csd201-cs10-randomized-set',
  tieuDe: { en: 'Insert, delete and getRandom in O(1) — ArrayList + HashMap, move the last into the hole', vi: 'Thêm, xoá và lấy ngẫu nhiên trong O(1) — ArrayList + HashMap, đưa phần tử cuối vào chỗ trống' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['array for uniform random access', 'value → index map', 'remove by swapping with the last element'],
  moTa: {
    en: `<p>Complete ${c('RandomizedSet(Random rnd)')}: ${c('boolean insert(int x)')} (false if present), ${c('boolean remove(int x)')} (false if absent) and ${c('int getRandom()')}, all O(1) on average. To make the results reproducible, follow exactly this layout: the values live in an ${c('ArrayList')} ${c('a')}; insert appends at the end; remove moves the <b>last</b> element into the removed element’s index and then removes the last position; getRandom returns ${c('a.get(rnd.nextInt(a.size()))')} using the given ${c('rnd')}.</p>
<p>A ${c('HashMap')} value → index makes lookups O(1). ${c('ArrayList.remove(Object)')} shifts all later elements (O(n)) and also changes which value sits at which index — the complexity check performs a million operations.</p>`,
    vi: `<p>Hoàn thiện ${c('RandomizedSet(rnd)')}: ${c('insert(x)')} (đã có thì false), ${c('remove(x)')} (không có thì false) và ${c('getRandom()')}, tất cả O(1) trung bình. Để kết quả tái lập được, làm đúng cách bố trí này: các giá trị nằm trong ${c('ArrayList')} ${c('a')}; insert thêm vào cuối; remove đưa phần tử <b>cuối</b> vào chỉ số của phần tử bị xoá rồi bỏ vị trí cuối; getRandom trả ${c('a.get(rnd.nextInt(a.size()))')} bằng ${c('rnd')} cho sẵn.</p>
<p>${c('HashMap')} giá trị → chỉ số cho tra cứu O(1). ${c('ArrayList.remove(Object)')} dời mọi phần tử phía sau (O(n)) và còn đổi giá trị nào nằm ở chỉ số nào — kiểm độ phức tạp thực hiện một triệu thao tác.</p>`,
  },
  hen: { n: '1,000,000 operations', ms: 3000, can: 'O(1) average per operation', cham: 'O(n) remove (indexOf / remove(Object))' },
  dauVao: LENH_DV('NEW seed · INS x · DEL x · RND', 'NEW seed · INS x · DEL x · RND'),
  truoc: '        RandomizedSet s = new RandomizedSet(new Random(1));',
  them: `
    // reference with the same layout, O(n) per remove
    static class Ref {
        List<Integer> a = new ArrayList<Integer>();
        Random rnd;

        Ref(Random rnd) {
            this.rnd = rnd;
        }

        boolean insert(int x) {
            if (a.contains(x)) {
                return false;
            }
            a.add(x);
            return true;
        }

        boolean remove(int x) {
            int i = a.indexOf(x);
            if (i < 0) {
                return false;
            }
            a.set(i, a.get(a.size() - 1));
            a.remove(a.size() - 1);
            return true;
        }

        int getRandom() {
            return a.get(rnd.nextInt(a.size()));
        }
    }
`,
  lenh: `                if (p[0].equals("NEW")) {
                    s = new RandomizedSet(new Random(n(1)));
                } else if (p[0].equals("INS")) {
                    r = String.valueOf(s.insert(n(1)));
                } else if (p[0].equals("DEL")) {
                    r = String.valueOf(s.remove(n(1)));
                } else if (p[0].equals("RND")) {
                    r = String.valueOf(s.getRandom());
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(167);
                    String sai = null;
                    int ops = 0;
                    for (int t = 0; t < 200 && sai == null; t++) {
                        RandomizedSet x = new RandomizedSet(new Random(t));
                        Ref y = new Ref(new Random(t));
                        for (int q = 0; q < 60 && sai == null; q++) {
                            int v = rnd.nextInt(10), op = rnd.nextInt(3);
                            String got, want;
                            ops++;
                            if (op == 0) {
                                got = "" + x.insert(v);
                                want = "" + y.insert(v);
                            } else if (op == 1) {
                                got = "" + x.remove(v);
                                want = "" + y.remove(v);
                            } else if (!y.a.isEmpty()) {
                                got = "" + x.getRandom();
                                want = "" + y.getRandom();
                            } else {
                                continue;
                            }
                            if (!got.equals(want)) {
                                sai = "operation " + (q + 1) + " (" + (op == 0 ? "insert " + v : op == 1 ? "remove " + v : "getRandom") + "): " + got + ", expected " + want;
                            }
                        }
                    }
                    r = ketQua("200 random runs x 60 operations", ops, sai);
                } else {
                    final Random rnd = new Random(169);
                    final long[] sum = new long[1];
                    r = Kiem.hen("1,000,000 operations", 3000, new Runnable() {
                        public void run() {
                            RandomizedSet x = new RandomizedSet(new Random(7));
                            for (int i = 0; i < 300000; i++) {
                                x.insert(i);
                            }
                            for (int i = 0; i < 700000; i++) {
                                int v = rnd.nextInt(400000);
                                if (i % 3 == 0) {
                                    x.insert(v);
                                } else if (i % 3 == 1) {
                                    x.remove(v);
                                } else {
                                    sum[0] += x.getRandom();
                                }
                            }
                        }
                    }) + ", sum " + sum[0];
                }`,
  tep: {
    'RandomizedSet.java': j`
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class RandomizedSet {
    private final List<Integer> a = new ArrayList<Integer>();
    private final Random rnd;
    //>> // TODO: field(s)
    private final Map<Integer, Integer> pos = new HashMap<Integer, Integer>(); // value -> index in a
    //<<

    public RandomizedSet(Random rnd) {
        this.rnd = rnd;
    }

    public boolean insert(int x) {
        //>> return false; // TODO
        if (pos.containsKey(x)) {
            return false;
        }
        pos.put(x, a.size());
        a.add(x);
        return true;
        //<<
    }

    public boolean remove(int x) {
        //>> return false; // TODO
        Integer i = pos.get(x);
        if (i == null) {
            return false;
        }
        int last = a.get(a.size() - 1);
        a.set(i, last); // the last element fills the hole
        pos.put(last, i);
        a.remove(a.size() - 1); // removing at the END is O(1)
        pos.remove(x);
        return true;
        //<<
    }

    public int getRandom() {
        //>> return 0; // TODO
        return a.get(rnd.nextInt(a.size()));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'insert, remove, getRandom with seed 1', vi: 'thêm, xoá, lấy ngẫu nhiên với hạt giống 1' }, vao: 'INS 10\nINS 20\nINS 30\nINS 40\nINS 20\nDEL 20\nDEL 99\nRND\nRND\nRND\nDEL 30\nRND\n' },
    { ten: { en: 'removing the last element and a single element', vi: 'xoá phần tử cuối và phần tử duy nhất' }, vao: 'NEW 5\nINS 1\nINS 2\nDEL 2\nRND\nDEL 1\nINS 7\nRND\nINS 1\nRND\n' },
    { ten: { en: 'random runs vs the reference', vi: 'chạy ngẫu nhiên so với bản tham chiếu' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Update the moved element’s index in the map BEFORE removing x from it — when x is itself the last element, the order matters.', vi: 'Cập nhật chỉ số của phần tử bị dời trong map TRƯỚC khi xoá x khỏi map — khi chính x là phần tử cuối, thứ tự này quan trọng.' },
    { en: 'a.remove(a.size() − 1) with an int argument removes by INDEX — exactly what you want here.', vi: 'a.remove(a.size() − 1) với tham số int là xoá theo CHỈ SỐ — đúng thứ cần ở đây.' },
  ],
  loiHayGap: [
    { en: 'a.remove(Integer.valueOf(x)) — O(n) and it changes the positions, so getRandom no longer matches.', vi: 'a.remove(Integer.valueOf(x)) — O(n) và đổi vị trí các phần tử, nên getRandom không còn khớp.' },
    { en: 'Removing x from the map first and then writing pos.put(last, i) when last == x — x comes back.', vi: 'Xoá x khỏi map trước rồi ghi pos.put(last, i) khi last == x — x quay trở lại.' },
  ],
  giaiThich: { en: '<p>An array gives O(1) uniform random access but O(n) removal in the middle; a hash map gives O(1) membership but no random access. Together — and with "swap the hole with the last element" — every operation is O(1) average.</p>', vi: '<p>Mảng cho truy cập ngẫu nhiên đều O(1) nhưng xoá ở giữa O(n); bảng băm cho kiểm thành viên O(1) nhưng không truy cập ngẫu nhiên. Kết hợp cả hai — cùng "đổi chỗ trống với phần tử cuối" — mọi thao tác đều O(1) trung bình.</p>' },
});

const de6 = deCs({
  id: 'csd201-cs10-time-map',
  tieuDe: { en: 'A time-based key-value store — TreeMap.floorEntry per key', vi: 'Kho khoá-giá trị theo thời gian — TreeMap.floorEntry cho mỗi khoá' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['HashMap key → TreeMap timestamp → value', 'floorEntry(t): latest at or before t', 'O(log n) get'],
  moTa: {
    en: `<p>Complete ${c('TimeMap')}: ${c('void set(String key, String value, int t)')} stores value for key at time t (setting the same key and time again overwrites); ${c('String get(String key, int t)')} returns the value set for key at the <b>latest time ≤ t</b>, or ${c('""')} if there is none. Example: set(foo, bar, 1), set(foo, bar2, 4): get(foo, 0) = "", get(foo, 3) = bar, get(foo, 4) = bar2, get(foo, 9) = bar2.</p>
<p>Keep ${c('HashMap<String, TreeMap<Integer, String>>')}; get is ${c('floorEntry(t)')} — O(log n). Timestamps may arrive in any order. Scanning every set of a key is O(n) per get — the complexity check has 200,000 sets and 200,000 gets on 10 keys.</p>`,
    vi: `<p>Hoàn thiện ${c('TimeMap')}: ${c('set(key, value, t)')} lưu value cho key tại thời điểm t (đặt lại cùng key và thời điểm thì ghi đè); ${c('get(key, t)')} trả value đã đặt cho key ở <b>thời điểm muộn nhất ≤ t</b>, hoặc ${c('""')} nếu không có. Ví dụ: set(foo, bar, 1), set(foo, bar2, 4): get(foo, 0) = "", get(foo, 3) = bar, get(foo, 4) = bar2, get(foo, 9) = bar2.</p>
<p>Giữ ${c('HashMap<String, TreeMap<Integer, String>>')}; get là ${c('floorEntry(t)')} — O(log n). Thời điểm có thể tới theo thứ tự bất kỳ. Quét mọi lần set của một khoá là O(n) mỗi lần get — kiểm độ phức tạp có 200.000 lần set và 200.000 lần get trên 10 khoá.</p>`,
  },
  hen: { n: '200,000 sets + 200,000 gets', ms: 3000, can: 'O(log n) per operation', cham: 'O(n) per get (scanning)' },
  dauVao: LENH_DV('SET key value t · GET key t', 'SET khoá giá-trị t · GET khoá t'),
  truoc: '        TimeMap m = new TimeMap();',
  them: '',
  lenh: `                if (p[0].equals("SET")) {
                    m.set(p[1], p[2], n(3));
                } else if (p[0].equals("GET")) {
                    r = "\\"" + m.get(p[1], n(2)) + "\\"";
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(171);
                    String sai = null;
                    int ops = 0;
                    for (int t = 0; t < 300 && sai == null; t++) {
                        TimeMap x = new TimeMap();
                        List<String[]> log = new ArrayList<String[]>();
                        for (int q = 0; q < 40 && sai == null; q++) {
                            String k = "k" + rnd.nextInt(3);
                            int ts = rnd.nextInt(10);
                            ops++;
                            if (rnd.nextBoolean()) {
                                String v = "v" + rnd.nextInt(100);
                                x.set(k, v, ts);
                                log.add(new String[] {k, v, "" + ts});
                            } else {
                                String want = "";
                                int best = -1;
                                for (String[] e : log) {
                                    int et = Integer.parseInt(e[2]);
                                    if (e[0].equals(k) && et <= ts && et >= best) {
                                        best = et;
                                        want = e[1];
                                    }
                                }
                                String got = x.get(k, ts);
                                if (!want.equals(got)) {
                                    sai = "get(" + k + ", " + ts + ") -> \\"" + got + "\\", expected \\"" + want + "\\"";
                                }
                            }
                        }
                    }
                    r = ketQua("300 random runs x 40 operations (overwrites, unknown keys)", ops, sai);
                } else {
                    final Random rnd = new Random(173);
                    final long[] h = new long[1];
                    r = Kiem.hen("200,000 sets + 200,000 gets", 3000, new Runnable() {
                        public void run() {
                            TimeMap x = new TimeMap();
                            for (int i = 0; i < 200000; i++) {
                                x.set("key" + (i % 10), "v" + i, rnd.nextInt(1000000));
                            }
                            for (int i = 0; i < 200000; i++) {
                                h[0] += x.get("key" + (i % 11), rnd.nextInt(1000000)).hashCode();
                            }
                        }
                    }) + ", hash " + h[0];
                }`,
  tep: {
    'TimeMap.java': j`
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class TimeMap {
    //>> // TODO: field(s)
    private final Map<String, TreeMap<Integer, String>> m = new HashMap<String, TreeMap<Integer, String>>();
    //<<

    public void set(String key, String value, int t) {
        //>> // TODO
        TreeMap<Integer, String> tm = m.get(key);
        if (tm == null) {
            tm = new TreeMap<Integer, String>();
            m.put(key, tm);
        }
        tm.put(t, value);
        //<<
    }

    public String get(String key, int t) {
        //>> return ""; // TODO
        TreeMap<Integer, String> tm = m.get(key);
        if (tm == null) {
            return "";
        }
        Map.Entry<Integer, String> e = tm.floorEntry(t); // latest time <= t, O(log n)
        return e == null ? "" : e.getValue();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'foo / bar', vi: 'foo / bar' }, vao: 'SET foo bar 1\nSET foo bar2 4\nGET foo 0\nGET foo 1\nGET foo 3\nGET foo 4\nGET foo 9\nGET zzz 5\n' },
    { ten: { en: 'out-of-order times and overwrites', vi: 'thời điểm không theo thứ tự và ghi đè' }, vao: 'SET a x 10\nSET a y 5\nGET a 7\nSET a z 5\nGET a 9\nGET a 10\nGET a 4\n' },
    { ten: { en: 'random runs', vi: 'chạy ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'TreeMap.floorEntry(t) returns the entry with the greatest key ≤ t, or null.', vi: 'TreeMap.floorEntry(t) trả mục có khoá lớn nhất ≤ t, hoặc null.' },
    { en: 'An unknown key and a time before the first set both answer "".', vi: 'Khoá chưa biết và thời điểm trước lần set đầu đều trả "".' },
  ],
  loiHayGap: [
    { en: 'A List per key with binary search — fine only if timestamps always increase (here they do not).', vi: 'Một List cho mỗi khoá rồi tìm nhị phân — chỉ đúng khi thời điểm luôn tăng (ở đây không).' },
    { en: 'ceilingEntry instead of floorEntry — returns a FUTURE value.', vi: 'ceilingEntry thay vì floorEntry — trả giá trị ở TƯƠNG LAI.' },
  ],
  giaiThich: { en: '<p>A balanced BST per key turns "latest version at or before t" into one floor query: O(log n) for both set and get. With increasing timestamps a plain ArrayList plus binary search would do the same with less memory.</p>', vi: '<p>Một BST cân bằng cho mỗi khoá biến "phiên bản muộn nhất tới thời điểm t" thành một truy vấn floor: O(log n) cho cả set lẫn get. Nếu thời điểm luôn tăng thì một ArrayList cộng tìm nhị phân cũng làm được với ít bộ nhớ hơn.</p>' },
});

const de7 = deCs({
  id: 'csd201-cs10-merge-k-lists',
  tieuDe: { en: 'Merge k sorted linked lists — a heap of the current heads, relinking the nodes', vi: 'Trộn k danh sách liên kết đã sắp — heap chứa các đầu hiện tại, nối lại chính các nút' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['PriorityQueue of nodes', 'poll the smallest, push its next', 'O(N log k)', 'reuse the nodes'],
  moTa: {
    en: `<p>${c('ListNode')} (given) has ${c('val')} and ${c('next')}. Complete ${c('static ListNode merge(ListNode[] lists)')}: one sorted list containing every node of the k sorted input lists (some may be null). <b>Relink the existing nodes</b> — do not create new ones (a dummy head is fine); the grader checks that the result is made of exactly the original nodes.</p>
<p>Put the head of every non-empty list into a ${c('PriorityQueue')} ordered by ${c('val')}; repeatedly poll the smallest, append it, and push its ${c('next')}. O(N log k). Merging the lists one after another is O(N · k) — the complexity check has 10,000 lists of 100 nodes.</p>`,
    vi: `<p>${c('ListNode')} (cho sẵn) có ${c('val')} và ${c('next')}. Hoàn thiện ${c('merge(lists)')}: một danh sách đã sắp chứa mọi nút của k danh sách đầu vào đã sắp (có thể có null). <b>Nối lại các nút có sẵn</b> — không tạo nút mới (một nút đầu giả thì được); máy chấm kiểm kết quả gồm đúng các nút ban đầu.</p>
<p>Đưa đầu của mọi danh sách khác rỗng vào ${c('PriorityQueue')} sắp theo ${c('val')}; lặp: lấy nút nhỏ nhất, nối vào cuối, đẩy ${c('next')} của nó. O(N log k). Trộn lần lượt từng danh sách là O(N · k) — kiểm độ phức tạp có 10.000 danh sách mỗi cái 100 nút.</p>`,
  },
  hen: { n: '10,000 lists × 100 nodes', ms: 3000, can: 'O(N log k)', cham: 'O(N · k) (merging one list at a time)' },
  dauVao: { en: 'RUN list list … (each 1,4,5 or - for an empty list) · RANDOM · PERF.', vi: 'RUN ds ds … (mỗi cái 1,4,5 hoặc - cho danh sách rỗng) · RANDOM · PERF.' },
  them: `
    static ListNode build(int[] xs) {
        ListNode d = new ListNode(0), t = d;
        for (int x : xs) {
            t.next = new ListNode(x);
            t = t.next;
        }
        return d.next;
    }

    static String check(ListNode[] lists) {
        Set<ListNode> orig = Collections.newSetFromMap(new IdentityHashMap<ListNode, Boolean>());
        for (ListNode h : lists) {
            for (ListNode x = h; x != null; x = x.next) {
                orig.add(x);
            }
        }
        int n = orig.size();
        ListNode res = Merge.merge(lists);
        List<Integer> out = new ArrayList<Integer>();
        boolean reused = true;
        for (ListNode x = res; x != null && out.size() <= n + 1; x = x.next) {
            out.add(x.val);
            reused &= orig.remove(x);
        }
        return out + (reused && orig.isEmpty() ? "" : " (NOT the original nodes)");
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    ListNode[] ls = new ListNode[p.length - 1];
                    for (int i = 1; i < p.length; i++) {
                        ls[i - 1] = build(arr(p[i]));
                    }
                    r = check(ls);
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(175);
                    String sai = null;
                    for (int t = 0; t < 3000 && sai == null; t++) {
                        int k = rnd.nextInt(5);
                        ListNode[] ls = new ListNode[k];
                        List<Integer> all = new ArrayList<Integer>();
                        for (int i = 0; i < k; i++) {
                            int[] xs = new int[rnd.nextInt(5)];
                            for (int q = 0; q < xs.length; q++) {
                                xs[q] = rnd.nextInt(10) - 3;
                            }
                            Arrays.sort(xs);
                            for (int x : xs) {
                                all.add(x);
                            }
                            ls[i] = build(xs);
                        }
                        Collections.sort(all);
                        String got = check(ls), want = all.toString();
                        if (!got.equals(want)) {
                            sai = k + " lists -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("3000 random sets of sorted lists (empty lists, duplicates)", 3000, sai);
                } else {
                    final ListNode[] ls = new ListNode[10000];
                    Random rnd = new Random(177);
                    for (int i = 0; i < ls.length; i++) {
                        int[] xs = new int[100];
                        for (int q = 0; q < 100; q++) {
                            xs[q] = rnd.nextInt(1000000);
                        }
                        Arrays.sort(xs);
                        ls[i] = build(xs);
                    }
                    final long[] s = new long[2];
                    r = Kiem.hen("10,000 lists x 100 nodes", 3000, new Runnable() {
                        public void run() {
                            int prev = Integer.MIN_VALUE;
                            for (ListNode x = Merge.merge(ls); x != null; x = x.next) {
                                s[0]++;
                                if (x.val < prev) {
                                    s[1]++;
                                }
                                prev = x.val;
                            }
                        }
                    }) + ", nodes " + s[0] + ", out of order " + s[1];
                }`,
  tep: {
    'ListNode.java': j`
// GIVEN — do not change.
public class ListNode {
    int val;
    ListNode next;

    ListNode(int v) {
        val = v;
    }
}
`,
    'Merge.java': j`
import java.util.Comparator;
import java.util.PriorityQueue;

public class Merge {

    public static ListNode merge(ListNode[] lists) {
        //>> return null; // TODO
        PriorityQueue<ListNode> pq = new PriorityQueue<ListNode>(11, new Comparator<ListNode>() {
            public int compare(ListNode a, ListNode b) {
                return Integer.compare(a.val, b.val);
            }
        });
        for (ListNode h : lists) {
            if (h != null) {
                pq.add(h); // skip empty lists
            }
        }
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!pq.isEmpty()) {
            ListNode x = pq.poll();
            tail.next = x;
            tail = x;
            if (x.next != null) {
                pq.add(x.next);
            }
        }
        tail.next = null;
        return dummy.next;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples', vi: 'ví dụ' }, vao: 'RUN 1,4,5 1,3,4 - 2,6\nRUN\nRUN - -\nRUN 5\nRUN 1,1,1 1,1\n' },
    { ten: { en: '3000 random sets of lists', vi: '3000 bộ danh sách ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A dummy head node avoids the special case of the first append; return dummy.next.', vi: 'Một nút đầu giả tránh trường hợp riêng của lần nối đầu tiên; trả dummy.next.' },
    { en: 'The heap never holds more than k nodes — one per list.', vi: 'Heap không bao giờ giữ quá k nút — mỗi danh sách một nút.' },
  ],
  loiHayGap: [
    { en: 'Adding null heads to the PriorityQueue — NullPointerException.', vi: 'Thêm đầu null vào PriorityQueue — NullPointerException.' },
    { en: 'Copying the values into new nodes — the grader reports "NOT the original nodes".', vi: 'Chép giá trị sang nút mới — máy chấm báo "NOT the original nodes".' },
  ],
  giaiThich: { en: '<p>The heap always contains the smallest remaining node of every list, so its minimum is the smallest remaining node overall. N polls and pushes on a heap of size ≤ k: O(N log k). Divide and conquer (merge pairs of lists, log k rounds) has the same bound.</p>', vi: '<p>Heap luôn chứa nút nhỏ nhất còn lại của mỗi danh sách, nên nhỏ nhất của heap là nút nhỏ nhất còn lại trên toàn bộ. N lần lấy và đẩy trên heap cỡ ≤ k: O(N log k). Chia để trị (trộn từng cặp, log k vòng) có cùng cận.</p>' },
});

const de8 = deCs({
  id: 'csd201-cs10-product-except-self',
  tieuDe: { en: 'Product of everything except itself — prefix and suffix products, no division', vi: 'Tích mọi phần tử trừ chính nó — tích tiền tố và hậu tố, không phép chia' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['out[i] = (product left of i) · (product right of i)', 'two passes', 'zeros make division wrong'],
  moTa: {
    en: `<p>Complete ${c('static int[] product(int[] a)')}: ${c('out[i]')} = the product of all elements except ${c('a[i]')}, using int arithmetic (overflow wraps as usual). <b>No division</b> — with zeros it fails anyway. Examples: ${c('{1,2,3,4}')} → [24, 12, 8, 6]; ${c('{-1,1,0,-3,3}')} → [0, 0, 9, 0, 0]; ${c('{7}')} → [1].</p>
<p>Pass 1 left → right writes the product of everything to the left into ${c('out[i]')}; pass 2 right → left multiplies it by the product of everything to the right, kept in one variable. O(n) time, no extra array besides the output. The complexity check has 1,000,000 elements.</p>`,
    vi: `<p>Hoàn thiện ${c('product(a)')}: ${c('out[i]')} = tích mọi phần tử trừ ${c('a[i]')}, tính bằng int (tràn thì quay vòng như thường). <b>Không dùng phép chia</b> — có số 0 thì nó sai luôn. Ví dụ: ${c('{1,2,3,4}')} → [24, 12, 8, 6]; ${c('{-1,1,0,-3,3}')} → [0, 0, 9, 0, 0]; ${c('{7}')} → [1].</p>
<p>Lượt 1 trái → phải ghi tích mọi phần tử bên trái vào ${c('out[i]')}; lượt 2 phải → trái nhân nó với tích mọi phần tử bên phải, giữ trong một biến. O(n) thời gian, không mảng phụ ngoài mảng kết quả. Kiểm độ phức tạp có 1.000.000 phần tử.</p>`,
  },
  hen: { n: '1,000,000 elements', ms: 3000, can: 'O(n)', cham: 'O(n²) (a product for every position)' },
  quyTac: [{ id: 'R1', en: 'no division in Product', vi: 'không phép chia trong Product', re: String.raw`[^/*]/[^/*=]|/=`, file: 'Product' }],
  them: `
    static int[] brute(int[] a) {
        int[] o = new int[a.length];
        for (int i = 0; i < a.length; i++) {
            int pr = 1;
            for (int jj = 0; jj < a.length; jj++) {
                if (jj != i) {
                    pr *= a[jj];
                }
            }
            o[i] = pr;
        }
        return o;
    }
`,
  lenh: `                if (p[0].equals("RUN")) {
                    r = str(Product.product(arr(p[1])));
                } else if (p[0].equals("RANDOM")) {
                    Random rnd = new Random(179);
                    String sai = null;
                    for (int t = 0; t < 20000 && sai == null; t++) {
                        int[] a = new int[1 + rnd.nextInt(8)];
                        for (int i = 0; i < a.length; i++) {
                            a[i] = rnd.nextInt(t % 3 == 0 ? 3 : 11) - (t % 3 == 0 ? 1 : 5);
                        }
                        String got = str(Product.product(a.clone())), want = str(brute(a));
                        if (!got.equals(want)) {
                            sai = str(a) + " -> " + got + ", expected " + want;
                        }
                    }
                    r = ketQua("20000 random arrays (zeros, negatives)", 20000, sai);
                } else {
                    final int[] a = new int[1000000];
                    Random rnd = new Random(181);
                    for (int i = 0; i < a.length; i++) {
                        a[i] = rnd.nextInt(3) == 0 ? -1 : 1;
                    }
                    final long[] s = new long[1];
                    r = Kiem.hen("1,000,000 elements", 3000, new Runnable() {
                        public void run() {
                            for (int x : Product.product(a)) {
                                s[0] += x;
                            }
                        }
                    }) + ", sum " + s[0];
                }`,
  tep: {
    'Product.java': j`
public class Product {

    public static int[] product(int[] a) {
        //>> return new int[a.length]; // TODO
        int n = a.length;
        int[] out = new int[n];
        int left = 1;
        for (int i = 0; i < n; i++) { // product of everything on the left
            out[i] = left;
            left *= a[i];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) { // times everything on the right
            out[i] *= right;
            right *= a[i];
        }
        return out;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'examples (zeros)', vi: 'ví dụ (số 0)' }, vao: 'RUN 1,2,3,4\nRUN -1,1,0,-3,3\nRUN 0,0,5\nRUN 7\nRUN 2,-3\n' },
    { ten: { en: '20000 random arrays', vi: '20000 mảng ngẫu nhiên' }, vao: 'RANDOM\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Write out[i] BEFORE multiplying left by a[i] — the product to the left of i excludes a[i].', vi: 'Ghi out[i] TRƯỚC khi nhân left với a[i] — tích bên trái i không gồm a[i].' },
    { en: 'The second pass reuses out[] in place: no second array is needed.', vi: 'Lượt hai dùng lại out[] tại chỗ: không cần mảng thứ hai.' },
  ],
  loiHayGap: [
    { en: 'total / a[i] — divides by zero, and is wrong when exactly one element is 0.', vi: 'total / a[i] — chia cho 0, và sai khi đúng một phần tử bằng 0.' },
    { en: 'Starting left or right at 0 instead of 1.', vi: 'Khởi đầu left hay right bằng 0 thay vì 1.' },
  ],
  giaiThich: { en: '<p>Every answer is a prefix product times a suffix product; computing both incrementally gives two O(n) passes and O(1) extra memory. The same "left pass + right pass" shape solved the candy and trapping-rain-water problems.</p>', vi: '<p>Mỗi đáp án là tích tiền tố nhân tích hậu tố; tính dần cả hai cho hai lượt O(n) và O(1) bộ nhớ phụ. Cùng khuôn "lượt trái + lượt phải" đã giải bài chia kẹo và hứng nước mưa.</p>' },
});

export default moDun({ slug: 'csd201-cs10-on', ten: '10.10 ⭐ CS.10 Final set — design problems and mixed patterns', de: [de1, de2, de3, de4, de5, de6, de7, de8] });
