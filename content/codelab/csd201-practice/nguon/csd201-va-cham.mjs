/** CSD201 · 7.3 — Xử lý va chạm: dò tuyến tính có dấu đã xoá (in bảng), dò bậc hai với biển số xe (in dãy dò), băm dây chuyền (in từng dây). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-7-3-linear-probing',
  tieuDe: { en: 'Linear probing with "deleted" marks: insert, search, delete', vi: 'Dò tuyến tính với dấu "đã xoá": chèn, tìm, xoá' },
  doKho: 'MEDIUM', phut: 30, dangBai: 'pe',
  khaiNiem: ['h(k) = k mod m, then h+1, h+2, … (wrapping)', 'a deleted slot must not stop a search', 'reusing the first deleted slot on insert'],
  moTa: {
    en: `<p>${c('LinearTable(int m)')} stores non-negative int keys in ${c('Integer[] t')} of size m with the slides’ conventions: ${c('null')} = empty, ${c('DELETED')} (a special Integer object given in the class) = a key was removed here. Complete:</p>
<ul><li>${c('int search(int k)')} — probe h, h+1, … (mod m) until k is found (return its slot) or an <b>empty</b> slot is met (return −1); deleted slots are skipped, not a reason to stop;</li>
<li>${c('boolean insert(int k)')} — false if k is already present or the table is full; otherwise store k in the <b>first</b> deleted-or-empty slot met while probing;</li>
<li>${c('boolean delete(int k)')} — replace k by ${c('DELETED')}.</li></ul>
<p>After every command the grader prints the table (${c('.')} empty, ${c('D')} deleted).</p>`,
    vi: `<p>${c('LinearTable(int m)')} lưu khoá int không âm trong ${c('Integer[] t')} cỡ m theo quy ước của slide: ${c('null')} = trống, ${c('DELETED')} (một đối tượng Integer đặc biệt cho sẵn trong lớp) = từng có khoá bị xoá ở đây. Hoàn thiện ${c('search(k)')} — dò h, h+1, … (mod m) tới khi gặp k (trả ô của nó) hoặc gặp ô <b>trống</b> (trả −1); ô đã xoá thì bỏ qua, không phải lý do dừng; ${c('insert(k)')} — false nếu k đã có hoặc bảng đầy, ngược lại ghi k vào ô đã-xoá-hoặc-trống <b>đầu tiên</b> gặp khi dò; ${c('delete(k)')} — thay k bằng ${c('DELETED')}.</p>
<p>Sau mỗi lệnh máy chấm in bảng (${c('.')} trống, ${c('D')} đã xoá).</p>`,
  },
  yeuCau: { en: ['Compare with DELETED by identity (==), keys by value.', 'Never probe more than m slots.'], vi: ['So với DELETED bằng danh tính (==), so khoá bằng giá trị.', 'Không bao giờ dò quá m ô.'] },
  dauVao: { en: 'Size m on the first line, then INS k · DEL k · FIND k.', vi: 'Cỡ m ở dòng đầu, rồi INS k · DEL k · FIND k.' },
  dauRa: { en: 'Result and the table.', vi: 'Kết quả và bảng.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        LinearTable t = new LinearTable(Integer.parseInt(sc.nextLine().trim()));',
      them: `
    static String table(LinearTable t) {
        Integer[] a = (Integer[]) Kiem.lay(t, "t");
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) {
            sb.append(i > 0 ? " " : "").append(a[i] == null ? "." : a[i] == LinearTable.DELETED ? "D" : String.valueOf(a[i]));
        }
        return sb.append(']').toString();
    }
`,
      lenh: `                if (p[0].equals("INS")) {
                    r = String.valueOf(t.insert(n(1)));
                } else if (p[0].equals("DEL")) {
                    r = String.valueOf(t.delete(n(1)));
                } else {
                    r = String.valueOf(t.search(n(1)));
                }`,
      trangThai: 'table(t)',
    }),
  },
  tep: {
    'LinearTable.java': j`
public class LinearTable {
    @SuppressWarnings("UnnecessaryBoxing")
    static final Integer DELETED = new Integer(-1); // a unique object: compare it with ==
    private final Integer[] t;
    private final int m;

    public LinearTable(int m) {
        this.m = m;
        t = new Integer[m];
    }

    public int search(int k) {
        //>> return -1; // TODO
        int h = k % m;
        for (int i = 0; i < m; i++) {
            int s = (h + i) % m;
            if (t[s] == null) {
                return -1; // an empty slot ends the cluster
            }
            if (t[s] != DELETED && t[s] == k) {
                return s;
            }
        }
        return -1;
        //<<
    }

    public boolean insert(int k) {
        //>> return false; // TODO
        if (search(k) >= 0) {
            return false;
        }
        int h = k % m;
        for (int i = 0; i < m; i++) {
            int s = (h + i) % m;
            if (t[s] == null || t[s] == DELETED) {
                t[s] = k;
                return true;
            }
        }
        return false; // full
        //<<
    }

    public boolean delete(int k) {
        //>> return false; // TODO
        int s = search(k);
        if (s < 0) {
            return false;
        }
        t[s] = DELETED;
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a cluster, a deletion inside it, then searching past the hole', vi: 'một cụm, xoá ở giữa cụm, rồi tìm vượt qua lỗ' }, vao: '7\nINS 10\nINS 17\nINS 24\nINS 5\nFIND 24\nDEL 17\nFIND 24\nFIND 17\nINS 31\nINS 24\n' },
    { ten: { en: 'wrap-around and a full table', vi: 'quay vòng và bảng đầy' }, vao: '5\nINS 4\nINS 9\nINS 14\nINS 0\nINS 1\nINS 2\nFIND 1\nDEL 4\nINS 19\nFIND 14\nDEL 99\n', an: true },
  ],
  goiY: [
    { en: 'search stops only at an EMPTY slot; a DELETED slot means "keep going, the key may be further".', vi: 'search chỉ dừng ở ô TRỐNG; ô ĐÃ XOÁ nghĩa là "đi tiếp, khoá có thể ở xa hơn".' },
    { en: 'insert: first make sure k is not already there (search), then reuse the first deleted-or-empty slot of the probe sequence.', vi: 'insert: trước hết bảo đảm k chưa có (search), rồi dùng lại ô đã-xoá-hoặc-trống đầu tiên trên dãy dò.' },
  ],
  loiHayGap: [
    { en: 'Setting a deleted slot back to null — keys further in the cluster become unreachable (FIND 24 after DEL 17 fails).', vi: 'Đặt ô bị xoá về null — các khoá ở xa hơn trong cụm thành không tìm được (FIND 24 sau DEL 17 trượt).' },
    { en: 'Comparing Integer objects with == for keys above 127.', vi: 'So các đối tượng Integer bằng == với khoá lớn hơn 127.' },
  ],
  giaiThich: { en: '<p>Open addressing keeps all keys in the array; a key’s probe sequence is the cluster starting at h(k). Removing a key must leave a marker, otherwise later keys of the same cluster would look absent. With a low load factor the expected probes are O(1); clusters grow quickly as the table fills (primary clustering).</p>', vi: '<p>Địa chỉ mở giữ mọi khoá trong mảng; dãy dò của một khoá là cụm bắt đầu ở h(k). Xoá một khoá phải để lại dấu, nếu không các khoá sau trong cùng cụm sẽ trông như không có. Hệ số tải thấp thì số lần dò kỳ vọng O(1); cụm lớn nhanh khi bảng đầy dần (gom cụm sơ cấp).</p>' },
});

const de2 = deJava({
  id: 'csd201-7-3-quadratic-probing',
  tieuDe: { en: 'Quadratic probing with car plates: h, h+1, h+4, h+9, …', vi: 'Dò bậc hai với biển số xe: h, h+1, h+4, h+9, …' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['probe i: (h + i²) mod m', 'secondary clustering', 'a prime m and load ≤ 1/2 guarantee a free slot'],
  moTa: {
    en: `<p>${c('CarTable(int m)')} stores ${c('Car(plate, owner)')} objects; the hash of a plate is ${c('Math.floorMod(plate.hashCode(), m)')}. Complete ${c('String insert(Car c)')}: probe ${c('(h + i*i) % m')} for i = 0, 1, 2, … and store the car in the first empty slot; return the probe sequence as ${c('"h=… probes: s0 s1 … -> slot s"')}. If the plate already exists, return ${c('"duplicate"')}; if no slot is found within m probes, ${c('"no slot"')}. Also ${c('String owner(String plate)')} (or ${c('"?"')}).</p>`,
    vi: `<p>${c('CarTable(int m)')} lưu các ${c('Car(plate, owner)')}; băm của biển số là ${c('Math.floorMod(plate.hashCode(), m)')}. Hoàn thiện ${c('insert(c)')}: dò ${c('(h + i*i) % m')} với i = 0, 1, 2, … và ghi xe vào ô trống đầu tiên; trả dãy dò dạng ${c('"h=… probes: s0 s1 … -> slot s"')}. Biển đã có thì trả ${c('"duplicate"')}; dò m lần mà không có ô thì ${c('"no slot"')}. Thêm ${c('owner(plate)')} (hoặc ${c('"?"')}).</p>`,
  },
  yeuCau: { en: ['At most m probes.', 'Compare plates with equals.'], vi: ['Tối đa m lần dò.', 'So biển số bằng equals.'] },
  dauVao: { en: 'Size m, then ADD plate owner · OWNER plate.', vi: 'Cỡ m, rồi ADD biển chủ · OWNER biển.' },
  dauRa: { en: 'Probe sequences and owners.', vi: 'Các dãy dò và chủ xe.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        CarTable t = new CarTable(Integer.parseInt(sc.nextLine().trim()));',
      lenh: `                if (p[0].equals("ADD")) {
                    r = t.insert(new Car(p[1], p[2]));
                } else {
                    r = t.owner(p[1]);
                }`,
    }),
  },
  tep: {
    'Car.java': j`
// GIVEN — do not change.
class Car {
    String plate;
    String owner;

    Car(String plate, String owner) {
        this.plate = plate;
        this.owner = owner;
    }
}
`,
    'CarTable.java': j`
public class CarTable {
    private final Car[] t;
    private final int m;

    public CarTable(int m) {
        this.m = m;
        t = new Car[m];
    }

    private int h(String plate) {
        return Math.floorMod(plate.hashCode(), m);
    }

    public String insert(Car c) {
        //>> return "no slot"; // TODO
        int h = h(c.plate);
        StringBuilder probes = new StringBuilder();
        for (int i = 0; i < m; i++) {
            int s = (int) ((h + (long) i * i) % m);
            probes.append(i > 0 ? " " : "").append(s);
            if (t[s] == null) {
                t[s] = c;
                return "h=" + h + " probes: " + probes + " -> slot " + s;
            }
            if (t[s].plate.equals(c.plate)) {
                return "duplicate";
            }
        }
        return "no slot";
        //<<
    }

    public String owner(String plate) {
        //>> return "?"; // TODO
        int h = h(plate);
        for (int i = 0; i < m; i++) {
            int s = (int) ((h + (long) i * i) % m);
            if (t[s] == null) {
                return "?";
            }
            if (t[s].plate.equals(plate)) {
                return t[s].owner;
            }
        }
        return "?";
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'collisions in a table of 7', vi: 'va chạm trong bảng 7 ô' }, vao: '7\nADD Aa An\nADD BB Binh\nADD C5 Chi\nADD Aa Dup\nOWNER BB\nOWNER ZZ\nADD AaAa Dung\nADD BBBB Em\n' },
    { ten: { en: 'quadratic probing misses free slots when m is not prime', vi: 'dò bậc hai bỏ sót ô trống khi m không nguyên tố' }, vao: '4\nADD Aa x\nADD BB y\nADD AaBB z\nADD BBAa w\nOWNER AaBB\nOWNER BBAa\n', an: true },
  ],
  goiY: [
    { en: 'Probe i is (h + i·i) mod m — compute i·i in long so it cannot overflow for large m.', vi: 'Lần dò thứ i là (h + i·i) mod m — tính i·i bằng long để không tràn với m lớn.' },
    { en: 'Search follows the same sequence and stops at an empty slot.', vi: 'Phép tìm đi theo cùng dãy và dừng ở ô trống.' },
  ],
  loiHayGap: [
    { en: 'h + i (linear) instead of h + i² — different slots.', vi: 'h + i (tuyến tính) thay vì h + i² — ra ô khác.' },
    { en: 'plate.hashCode() % m — negative for some plates.', vi: 'plate.hashCode() % m — âm với một số biển số.' },
  ],
  giaiThich: { en: '<p>Quadratic jumps spread colliding keys away from the original cluster (no primary clustering), but keys with the same h still follow the same sequence (secondary clustering). With a prime m the first ⌈m/2⌉ probes are distinct, so a table at most half full always has room; with m = 4 some free slots are never visited.</p>', vi: '<p>Bước nhảy bậc hai đẩy các khoá va chạm ra xa cụm ban đầu (không gom cụm sơ cấp), nhưng các khoá cùng h vẫn đi cùng một dãy (gom cụm thứ cấp). Với m nguyên tố, ⌈m/2⌉ lần dò đầu là khác nhau, nên bảng đầy không quá một nửa luôn còn chỗ; với m = 4 có những ô trống không bao giờ được ghé.</p>' },
});

const de3 = deJava({
  id: 'csd201-7-3-separate-chaining',
  tieuDe: { en: 'Separate chaining: one linked list per bucket', vi: 'Băm dây chuyền: mỗi ô một danh sách liên kết' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['bucket = k mod m', 'insert at the head of the chain', 'delete from a chain'],
  moTa: {
    en: `<p>${c('ChainTable(int m)')} has ${c('Entry[] buckets')}; ${c('Entry')} (given) is a node with ${c('key')}, ${c('value')}, ${c('next')}. Complete ${c('put(int key, String value)')} (update the value if the key exists, otherwise insert at the <b>head</b> of the chain of bucket ${c('key % m')}), ${c('String get(int key)')} (null if absent) and ${c('boolean remove(int key)')}. The grader prints every chain from your real nodes.</p>`,
    vi: `<p>${c('ChainTable(int m)')} có ${c('Entry[] buckets')}; ${c('Entry')} (cho sẵn) là nút có ${c('key')}, ${c('value')}, ${c('next')}. Hoàn thiện ${c('put(key, value)')} (khoá đã có thì cập nhật giá trị, ngược lại chèn vào <b>đầu</b> dây của ô ${c('key % m')}), ${c('get(key)')} (không có thì null) và ${c('remove(key)')}. Máy chấm in mọi dây từ chính các nút của bạn.</p>`,
  },
  yeuCau: { en: ['Insert at the head (O(1) after the duplicate check).', 'Keys are non-negative.'], vi: ['Chèn ở đầu dây (O(1) sau khi kiểm trùng).', 'Khoá không âm.'] },
  dauVao: { en: 'Size m, then PUT k v · GET k · DEL k.', vi: 'Cỡ m, rồi PUT k v · GET k · DEL k.' },
  dauRa: { en: 'Result and the chains.', vi: 'Kết quả và các dây.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        ChainTable t = new ChainTable(Integer.parseInt(sc.nextLine().trim()));',
      them: `
    static String chains(ChainTable t) {
        Object[] b = (Object[]) Kiem.lay(t, "buckets");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < b.length; i++) {
            sb.append(i > 0 ? " | " : "").append(i).append(": ").append(Kiem.chuoi(b[i], "next", "key", 100));
        }
        return sb.toString();
    }
`,
      lenh: `                if (p[0].equals("PUT")) {
                    t.put(n(1), p[2]);
                } else if (p[0].equals("GET")) {
                    r = String.valueOf(t.get(n(1)));
                } else {
                    r = String.valueOf(t.remove(n(1)));
                }`,
      trangThai: 'chains(t)',
    }),
  },
  tep: {
    'Entry.java': j`
// GIVEN — do not change.
class Entry {
    int key;
    String value;
    Entry next;

    Entry(int key, String value, Entry next) {
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
`,
    'ChainTable.java': j`
public class ChainTable {
    private final Entry[] buckets;

    public ChainTable(int m) {
        buckets = new Entry[m];
    }

    public void put(int key, String value) {
        //>> // TODO
        int b = key % buckets.length;
        for (Entry e = buckets[b]; e != null; e = e.next) {
            if (e.key == key) {
                e.value = value;
                return;
            }
        }
        buckets[b] = new Entry(key, value, buckets[b]);
        //<<
    }

    public String get(int key) {
        //>> return null; // TODO
        for (Entry e = buckets[key % buckets.length]; e != null; e = e.next) {
            if (e.key == key) {
                return e.value;
            }
        }
        return null;
        //<<
    }

    public boolean remove(int key) {
        //>> return false; // TODO
        int b = key % buckets.length;
        Entry prev = null;
        for (Entry e = buckets[b]; e != null; prev = e, e = e.next) {
            if (e.key == key) {
                if (prev == null) {
                    buckets[b] = e.next;
                } else {
                    prev.next = e.next;
                }
                return true;
            }
        }
        return false;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ keys in a table of 5', vi: 'các khoá của slide trong bảng 5 ô' }, vao: '5\nPUT 12 a\nPUT 7 b\nPUT 22 c\nPUT 3 d\nPUT 17 e\nGET 22\nPUT 7 B\nGET 7\nDEL 22\nDEL 17\nDEL 99\nGET 22\n' },
    { ten: { en: 'one bucket, remove the head and the tail', vi: 'một ô, xoá đầu và cuối dây' }, vao: '1\nPUT 1 x\nPUT 2 y\nPUT 3 z\nDEL 3\nDEL 1\nGET 2\nDEL 2\nPUT 4 w\n', an: true },
  ],
  goiY: [
    { en: 'put: walk the chain to update an existing key; if not found, buckets[b] = new Entry(key, value, buckets[b]).', vi: 'put: đi dọc dây để cập nhật khoá đã có; không thấy thì buckets[b] = new Entry(key, value, buckets[b]).' },
    { en: 'remove: keep prev; removing the first entry changes buckets[b] itself.', vi: 'remove: giữ prev; xoá mục đầu tiên thì đổi chính buckets[b].' },
  ],
  loiHayGap: [
    { en: 'Appending at the tail — correct, but the chain order differs from the slides (and costs a walk).', vi: 'Nối vào cuối dây — đúng nhưng thứ tự dây khác slide (và tốn một lượt đi).' },
    { en: 'Inserting a duplicate key instead of updating it — get may return the old value.', vi: 'Chèn trùng khoá thay vì cập nhật — get có thể trả giá trị cũ.' },
  ],
  giaiThich: { en: '<p>Each operation hashes to one bucket and walks its chain: O(1 + α) on average, α = n/m the load factor. Chaining never runs out of slots and deletion is a plain list removal — no "deleted" markers needed, unlike open addressing.</p>', vi: '<p>Mỗi thao tác băm tới một ô và đi dọc dây của nó: trung bình O(1 + α), α = n/m là hệ số tải. Dây chuyền không bao giờ hết chỗ và xoá chỉ là xoá khỏi danh sách — không cần dấu "đã xoá" như địa chỉ mở.</p>' },
});

export default moDun({ slug: 'csd201-va-cham', ten: '7.3 Collision handling in depth', de: [de1, de2, de3] });
