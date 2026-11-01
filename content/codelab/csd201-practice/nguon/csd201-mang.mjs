/** CSD201 · 1.1 — Mảng & mảng động: chèn/xoá có dời, xoá mọi phần tử khớp trong một lượt, xoay mảng tại chỗ (có kiểm độ phức tạp). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-1-1-array-list-shift',
  tieuDe: { en: 'MyArrayList: insert and remove at an index by shifting', vi: 'MyArrayList: chèn và xoá tại chỉ số bằng cách dời phần tử' },
  doKho: 'EASY', phut: 25,
  khaiNiem: ['array-based list', 'shift right to insert, shift left to remove', 'index checks', 'clearing the freed slot'],
  moTa: {
    en: `<p>${c('MyArrayList')} stores ints in ${c('int[] data')} with ${c('size')}; ${c('ensureCapacity')} (doubling) and ${c('get')} are given. Write:</p>
<ul><li>${c('void insertAt(int i, int x)')} — valid for ${c('0 ≤ i ≤ size')} (i = size appends): shift ${c('data[i..size-1]')} one slot to the right, then store x;</li>
<li>${c('int removeAt(int i)')} — valid for ${c('0 ≤ i < size')}: return the element, shift the rest one slot to the left and set the slot that became free to 0;</li>
<li>an invalid index throws ${c('IndexOutOfBoundsException("index i, size n")')} and changes nothing.</li></ul>
<p>After every command the grader prints the whole backing array through reflection (capacity included), so a missing shift or a forgotten clean-up shows.</p>`,
    vi: `<p>${c('MyArrayList')} lưu số nguyên trong ${c('int[] data')} kèm ${c('size')}; ${c('ensureCapacity')} (gấp đôi) và ${c('get')} cho sẵn. Viết ${c('insertAt(i, x)')} — hợp lệ khi ${c('0 ≤ i ≤ size')} (i = size là thêm cuối): dời ${c('data[i..size-1]')} sang phải một ô rồi ghi x; ${c('removeAt(i)')} — hợp lệ khi ${c('0 ≤ i < size')}: trả về phần tử, dời phần còn lại sang trái một ô và đặt ô vừa trống về 0; chỉ số sai ném ${c('IndexOutOfBoundsException("index i, size n")')} và không đổi gì.</p>
<p>Sau mỗi lệnh máy chấm in toàn bộ mảng bên dưới bằng reflection (cả sức chứa), nên thiếu bước dời hay quên dọn ô đều lộ ra.</p>`,
  },
  yeuCau: { en: ['Shift with a loop in the right direction (right-to-left when inserting).', 'Call ensureCapacity() before inserting.'], vi: ['Dời bằng vòng lặp đúng chiều (chèn thì đi từ phải sang trái).', 'Gọi ensureCapacity() trước khi chèn.'] },
  dauVao: { en: 'INS i x · DEL i · GET i.', vi: 'INS i x · DEL i · GET i.' },
  dauRa: { en: 'Result, then size and the whole backing array.', vi: 'Kết quả, rồi size và toàn bộ mảng bên dưới.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        MyArrayList t = new MyArrayList();',
      lenh: `                if (p[0].equals("INS")) {
                    t.insertAt(n(1), n(2));
                    r = "ok";
                } else if (p[0].equals("DEL")) {
                    r = String.valueOf(t.removeAt(n(1)));
                } else {
                    r = String.valueOf(t.get(n(1)));
                }`,
      trangThai: '"size " + Kiem.lay(t, "size") + " " + Arrays.toString((int[]) Kiem.lay(t, "data"))',
    }),
  },
  tep: {
    'MyArrayList.java': j`
public class MyArrayList {
    private int[] data = new int[2];
    private int size = 0;

    private void ensureCapacity() {
        if (size == data.length) {
            int[] b = new int[2 * data.length];
            System.arraycopy(data, 0, b, 0, size);
            data = b;
        }
    }

    public int get(int i) {
        check(i, size - 1);
        return data[i];
    }

    private void check(int i, int max) {
        if (i < 0 || i > max) {
            throw new IndexOutOfBoundsException("index " + i + ", size " + size);
        }
    }

    // insert x so that it ends up at index i (0 <= i <= size)
    public void insertAt(int i, int x) {
        //>> // TODO: check, grow, shift right, store
        check(i, size);
        ensureCapacity();
        for (int k = size; k > i; k--) {
            data[k] = data[k - 1];
        }
        data[i] = x;
        size++;
        //<<
    }

    // remove and return the element at index i (0 <= i < size)
    public int removeAt(int i) {
        //>> return 0; // TODO: check, keep the value, shift left, clear the freed slot
        check(i, size - 1);
        int x = data[i];
        for (int k = i; k < size - 1; k++) {
            data[k] = data[k + 1];
        }
        size--;
        data[size] = 0;
        return x;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'append, insert at the front and in the middle, remove', vi: 'thêm cuối, chèn đầu và giữa, xoá' }, vao: 'INS 0 10\nINS 1 30\nINS 1 20\nINS 0 5\nINS 4 40\nDEL 0\nDEL 3\nDEL 1\nGET 1\n' },
    { ten: { en: 'invalid indexes change nothing', vi: 'chỉ số sai không đổi gì' }, vao: 'INS 1 7\nINS 0 7\nINS 2 8\nINS -1 9\nDEL 1\nDEL -1\nGET 1\nDEL 0\nDEL 0\n' },
    { ten: { en: 'growing while inserting in the middle', vi: 'nới mảng khi đang chèn giữa' }, vao: 'INS 0 1\nINS 1 2\nINS 1 3\nINS 1 4\nINS 2 5\nINS 0 6\nDEL 5\nDEL 2\nINS 4 9\n', an: true },
  ],
  goiY: [
    { en: 'Insert: walk k from size down to i + 1 doing data[k] = data[k - 1] — going left-to-right would copy the same value everywhere.', vi: 'Chèn: cho k chạy từ size xuống i + 1 với data[k] = data[k - 1] — đi trái sang phải sẽ chép cùng một giá trị khắp nơi.' },
    { en: 'Remove: save data[i] first, shift left, decrease size, then data[size] = 0.', vi: 'Xoá: lưu data[i] trước, dời trái, giảm size, rồi data[size] = 0.' },
  ],
  loiHayGap: [
    { en: 'Shifting right from left to right: every slot after i becomes a copy of data[i].', vi: 'Dời phải từ trái sang phải: mọi ô sau i thành bản sao của data[i].' },
    { en: 'Forgetting to clear the freed slot — the old last value stays in the array (for objects this is a memory leak).', vi: 'Quên dọn ô vừa trống — giá trị cuối cũ vẫn nằm trong mảng (với đối tượng đó là rò bộ nhớ).' },
    { en: 'Allowing insertAt(size + 1, x) — that leaves a hole in the list.', vi: 'Cho phép insertAt(size + 1, x) — để lại một lỗ trong danh sách.' },
  ],
  giaiThich: { en: '<p>Both operations move size − i elements: O(n) in the worst case (index 0), O(1) at the end. That is why an array list is perfect for appending and random access, and poor for inserting at the front — the motivation for linked lists in the next lesson.</p>', vi: '<p>Cả hai thao tác dời size − i phần tử: O(n) ở trường hợp xấu nhất (chỉ số 0), O(1) ở cuối. Vì vậy danh sách mảng rất hợp để thêm cuối và truy cập ngẫu nhiên, kém khi chèn đầu — lý do có danh sách liên kết ở bài sau.</p>' },
});

const de2 = deJava({
  id: 'csd201-1-1-remove-all-one-pass',
  tieuDe: { en: 'Remove every occurrence in one pass (two indexes)', vi: 'Xoá mọi lần xuất hiện trong một lượt (hai chỉ số)' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['in-place compaction', 'read index / write index', 'O(n) instead of O(n²)'],
  moTa: {
    en: `<p>Complete ${c('static int removeAll(int[] a, int size, int x)')}: remove every element equal to ${c('x')} from ${c('a[0..size-1]')}, keep the others <b>in their order</b> at the front of the array, set the slots after the new size to 0 and return the new size.</p>
<p>The naive way — call a "remove at index" (shift everything left) for each match — is O(n²) when many elements match. Use a read index and a write index instead: every kept element is copied at most once.</p>`,
    vi: `<p>Hoàn thiện ${c('static int removeAll(int[] a, int size, int x)')}: xoá mọi phần tử bằng ${c('x')} khỏi ${c('a[0..size-1]')}, giữ các phần tử còn lại <b>đúng thứ tự</b> ở đầu mảng, đặt các ô sau size mới về 0 và trả về size mới.</p>
<p>Cách ngây thơ — gọi "xoá tại chỉ số" (dời hết sang trái) cho mỗi phần tử khớp — là O(n²) khi nhiều phần tử khớp. Hãy dùng một chỉ số đọc và một chỉ số ghi: mỗi phần tử giữ lại được chép tối đa một lần.</p>`,
  },
  yeuCau: { en: ['In place: no second array.', 'One pass over a[0..size-1], then clear the tail.'], vi: ['Tại chỗ: không dùng mảng thứ hai.', 'Một lượt qua a[0..size-1], rồi dọn phần đuôi.'] },
  dauVao: { en: 'Lines "x : a0 a1 …"; PERF runs the big test.', vi: 'Các dòng "x : a0 a1 …"; PERF chạy phép thử lớn.' },
  dauRa: { en: 'New size and the whole array.', vi: 'Size mới và toàn bộ mảng.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no second array (new int[...]) in Compact', vi: 'không tạo mảng thứ hai (new int[...]) trong Compact', re: String.raw`\bnew\s+int\s*\[|copyOf|ArrayList`, file: 'Compact' }],
  hen: { n: '400,000 elements, half of them removed', ms: 3000, can: 'O(n)', cham: 'O(n²)', en: 'Shifting the array once per removed element moves about 4·10¹⁰ elements.', vi: 'Dời mảng một lần cho mỗi phần tử bị xoá là khoảng 4·10¹⁰ lần chép.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[400000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i % 2 == 0 ? 7 : i;
                    }
                    final int[] res = new int[1];
                    r = Kiem.hen("n = 400,000, remove 200,000 sevens", 3000, new Runnable() {
                        public void run() {
                            res[0] = Compact.removeAll(a, a.length, 7);
                        }
                    }) + ", new size " + res[0] + ", a[0..2] = " + a[0] + " " + a[1] + " " + a[2];
                } else {
                    int x = n(0);
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    int s = Compact.removeAll(a, a.length, x);
                    r = "size " + s + " " + Arrays.toString(a);
                }`,
    }),
  },
  tep: {
    'Compact.java': j`
public class Compact {

    // removes every x from a[0..size-1] keeping the order; clears the freed slots; returns the new size
    static int removeAll(int[] a, int size, int x) {
        //>> return size; // TODO: read index + write index
        int w = 0;
        for (int r = 0; r < size; r++) {
            if (a[r] != x) {
                a[w++] = a[r]; // keep: copy forward (once)
            }
        }
        for (int k = w; k < size; k++) {
            a[k] = 0;
        }
        return w;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'matches at the front, middle, end, consecutive', vi: 'khớp ở đầu, giữa, cuối, liên tiếp' }, vao: '3 : 3 1 3 3 2 3\n5 : 1 2 3 4\n9 : 9 9 9\n0 : 0\n' },
    { ten: { en: 'negative values; nothing to remove', vi: 'giá trị âm; không có gì để xoá' }, vao: '-1 : -1 2 -1 2 -1\n2 : -1 2 -1 2 -1\n4 : 4 1 4 1 4 1 4\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Let r read every element and w point at the next free place for a kept element: if a[r] != x then a[w++] = a[r].', vi: 'Cho r đọc mọi phần tử và w trỏ chỗ trống kế tiếp cho phần tử giữ lại: nếu a[r] != x thì a[w++] = a[r].' },
    { en: 'w never passes r, so you never overwrite an element you have not read yet. At the end, w is the new size.', vi: 'w không bao giờ vượt r, nên không ghi đè phần tử chưa đọc. Cuối cùng w chính là size mới.' },
  ],
  loiHayGap: [
    { en: 'Removing inside a for loop with i++ after a shift — two consecutive matches: the second one slides into slot i and is skipped.', vi: 'Xoá trong vòng for rồi i++ sau khi dời — hai phần tử khớp liền nhau: cái thứ hai trượt vào ô i và bị bỏ qua.' },
    { en: 'Forgetting to clear a[w..size-1] — the old values remain after the new end.', vi: 'Quên dọn a[w..size-1] — giá trị cũ còn nằm sau điểm kết thúc mới.' },
  ],
  giaiThich: { en: '<p>The read index visits every element once and each kept element is written once: O(n) time, O(1) extra space. The same "two indexes" idea is how ArrayList.removeIf works and how LeetCode "remove element" / "move zeroes" are solved.</p>', vi: '<p>Chỉ số đọc ghé mỗi phần tử một lần, mỗi phần tử giữ lại được ghi một lần: O(n) thời gian, O(1) bộ nhớ thêm. Ý tưởng "hai chỉ số" này chính là cách ArrayList.removeIf làm, và là lời giải các bài LeetCode "remove element" / "move zeroes".</p>' },
});

const de3 = deJava({
  id: 'csd201-1-1-rotate-in-place',
  tieuDe: { en: 'Rotate an array by k in place: three reversals', vi: 'Xoay mảng k bước tại chỗ: ba lần đảo ngược' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['in-place algorithm', 'reversal trick', 'k mod n', 'O(n) time, O(1) space'],
  moTa: {
    en: `<p>Complete ${c('static void rotateRight(int[] a, int k)')}: every element moves k positions to the right, the last k wrap around to the front. ${c('{1,2,3,4,5,6,7}')} with k = 3 becomes ${c('{5,6,7,1,2,3,4}')}. k can be 0, larger than the length, or negative (rotate left); an empty array stays empty.</p>
<p>Do it in place with O(1) extra memory and O(n) time — rotating by one step k times is O(n·k). Hint from the name: reverse the whole array, then reverse the first k and the rest separately.</p>`,
    vi: `<p>Hoàn thiện ${c('static void rotateRight(int[] a, int k)')}: mọi phần tử dời sang phải k vị trí, k phần tử cuối vòng lên đầu. ${c('{1,2,3,4,5,6,7}')} với k = 3 thành ${c('{5,6,7,1,2,3,4}')}. k có thể bằng 0, lớn hơn độ dài, hoặc âm (xoay trái); mảng rỗng giữ nguyên.</p>
<p>Làm tại chỗ với O(1) bộ nhớ thêm và O(n) thời gian — xoay từng bước một k lần là O(n·k). Gợi ý từ tên đề: đảo ngược cả mảng, rồi đảo riêng k phần tử đầu và phần còn lại.</p>`,
  },
  yeuCau: { en: ['No second array (rule R1).', 'Normalise k with k mod n, keeping it non-negative.'], vi: ['Không mảng thứ hai (luật R1).', 'Chuẩn hoá k bằng k mod n, giữ k không âm.'] },
  dauVao: { en: 'Lines "k : a0 a1 …" ("k :" alone = empty array); PERF.', vi: 'Các dòng "k : a0 a1 …" ("k :" trơn = mảng rỗng); PERF.' },
  dauRa: { en: 'The rotated array.', vi: 'Mảng sau khi xoay.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no second array in Rotate (new int[...], clone, copyOf)', vi: 'không mảng thứ hai trong Rotate (new int[...], clone, copyOf)', re: String.raw`\bnew\s+int\s*\[|\.clone\s*\(|copyOf|arraycopy`, file: 'Rotate' }],
  hen: { n: '2,000,000 elements, k = 999,999', ms: 3000, can: 'O(n)', cham: 'O(n·k)', en: 'Shifting by one position k times is about 2·10¹² moves.', vi: 'Dời từng ô một k lần là khoảng 2·10¹² lần dời.' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[2000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = i;
                    }
                    r = Kiem.hen("n = 2,000,000, k = 999,999", 3000, new Runnable() {
                        public void run() {
                            Rotate.rotateRight(a, 999999);
                        }
                    }) + ", a[0] = " + a[0] + ", a[999999] = " + a[999999] + ", a[1999999] = " + a[1999999];
                } else {
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    Rotate.rotateRight(a, n(0));
                    r = Arrays.toString(a);
                }`,
    }),
  },
  tep: {
    'Rotate.java': j`
public class Rotate {

    // every element moves k places to the right (k < 0: to the left), in place
    static void rotateRight(int[] a, int k) {
        //>> // TODO: normalise k, then three reversals
        int n = a.length;
        if (n == 0) {
            return;
        }
        k = ((k % n) + n) % n; // 0 <= k < n, also for negative k
        reverse(a, 0, n - 1);
        reverse(a, 0, k - 1);
        reverse(a, k, n - 1);
        //<<
    }
    //>> // TODO: helper(s)

    private static void reverse(int[] a, int i, int j) {
        while (i < j) {
            int t = a[i];
            a[i++] = a[j];
            a[j--] = t;
        }
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the example, k = 0, k = n, k > n', vi: 'ví dụ, k = 0, k = n, k > n' }, vao: '3 : 1 2 3 4 5 6 7\n0 : 1 2 3\n3 : 1 2 3\n10 : 1 2 3 4\n' },
    { ten: { en: 'negative k, one element, empty array', vi: 'k âm, một phần tử, mảng rỗng' }, vao: '-1 : 1 2 3 4 5\n-7 : 1 2 3\n5 : 42\n4 :\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Reversing {1..7} gives {7,6,5,4,3,2,1}; reversing the first 3 and the last 4 separately gives {5,6,7,1,2,3,4}.', vi: 'Đảo {1..7} được {7,6,5,4,3,2,1}; đảo riêng 3 phần tử đầu và 4 phần tử cuối được {5,6,7,1,2,3,4}.' },
    { en: 'Java’s % keeps the sign: -1 % 5 = -1. Use ((k % n) + n) % n to get a value in 0..n-1.', vi: '% của Java giữ dấu: -1 % 5 = -1. Dùng ((k % n) + n) % n để được giá trị trong 0..n-1.' },
  ],
  loiHayGap: [
    { en: 'k % n with n = 0 — ArithmeticException on the empty array; return first.', vi: 'k % n khi n = 0 — ArithmeticException với mảng rỗng; trả về trước.' },
    { en: 'Rotating one step at a time inside a loop of k — correct and simple, but O(n·k): the complexity check fails.', vi: 'Xoay từng bước trong vòng lặp k lần — đúng và đơn giản nhưng O(n·k): trượt kiểm độ phức tạp.' },
  ],
  giaiThich: { en: '<p>Each reversal swaps every element of its part once, so the three reversals touch each element twice: O(n) time and O(1) extra memory. After reversing everything, the k elements that must come first are already at the front, only in reverse order — the two partial reversals fix the order inside each part.</p>', vi: '<p>Mỗi lần đảo hoán vị từng phần tử của đoạn một lần, nên ba lần đảo chạm mỗi phần tử hai lần: O(n) thời gian, O(1) bộ nhớ thêm. Sau khi đảo cả mảng, k phần tử cần lên đầu đã ở đầu, chỉ ngược thứ tự — hai lần đảo từng phần sửa thứ tự bên trong mỗi phần.</p>' },
});

export default moDun({ slug: 'csd201-mang', ten: '1.1 Arrays & dynamic arrays', de: [de1, de2, de3] });
