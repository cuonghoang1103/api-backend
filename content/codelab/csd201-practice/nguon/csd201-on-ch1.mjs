/** CSD201 · 1.6 — Thực hành chương 1: Josephus trên danh sách vòng, palindrome O(1) bộ nhớ, và một đề PE đúng khuôn (MyList Car, data.txt → f1..f4.txt). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';
import { dePeFile } from './_pe.mjs';

const de1 = deJava({
  id: 'csd201-1-6-josephus',
  tieuDe: { en: 'The Josephus circle on a circular linked list', vi: 'Vòng tròn Josephus trên danh sách liên kết vòng' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['circular list', 'unlinking in O(1)', 'keeping the node before the current one'],
  moTa: {
    en: `<p>n people numbered 1..n sit in a circle; counting starts at person 1 and every k-th person leaves. Complete ${c('static String play(int n, int k)')}: build a circular list of ${c('CNode')}s, then repeatedly count k − 1 steps and unlink the next person. Return the leaving order followed by the survivor: ${c('play(7, 3)')} → ${c('"3 6 2 7 5 1 | survivor 4"')}.</p>
<p>Keep a pointer to the node <b>before</b> the person who will leave, so removing is one assignment. Total work O(n·k).</p>`,
    vi: `<p>n người đánh số 1..n ngồi thành vòng; đếm bắt đầu từ người 1 và cứ người thứ k thì rời vòng. Hoàn thiện ${c('static String play(int n, int k)')}: dựng danh sách vòng các ${c('CNode')}, rồi lặp: đếm k − 1 bước và gỡ người kế tiếp. Trả về thứ tự rời vòng kèm người sống sót: ${c('play(7, 3)')} → ${c('"3 6 2 7 5 1 | survivor 4"')}.</p>
<p>Giữ con trỏ tới nút <b>đứng trước</b> người sẽ rời vòng, để việc gỡ chỉ là một phép gán. Tổng công O(n·k).</p>`,
  },
  yeuCau: { en: ['Use CNode — no java.util collections, no arrays (rule R1).', 'Output format exactly "a b c … | survivor s" (with n = 1: "| survivor 1").'], vi: ['Dùng CNode — không collection của java.util, không mảng (luật R1).', 'Định dạng đúng "a b c … | survivor s" (n = 1: "| survivor 1").'] },
  dauVao: { en: 'Lines "n k"; PERF.', vi: 'Các dòng "n k"; PERF.' },
  dauRa: { en: 'The leaving order and the survivor.', vi: 'Thứ tự rời vòng và người sống sót.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'a circular list of CNode only — no collections or arrays in Josephus', vi: 'chỉ danh sách vòng CNode — không collection hay mảng trong Josephus', re: String.raw`\b(List|ArrayList|LinkedList|Deque|ArrayDeque|Queue)\b|\bnew\s+(int|Integer|boolean)\s*\[`, file: 'Josephus' }],
  hen: { n: '300,000 people, k = 3', ms: 3000, can: 'O(n·k)', cham: 'O(n²) (walking from the start for every removal)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final String[] res = new String[1];
                    r = Kiem.hen("n = 300,000, k = 3", 3000, new Runnable() {
                        public void run() {
                            res[0] = Josephus.play(300000, 3);
                        }
                    }) + ", " + (res[0] == null ? "null" : res[0].substring(res[0].indexOf('|')));
                } else {
                    r = Josephus.play(n(0), n(1));
                }`,
    }),
  },
  tep: {
    'CNode.java': j`
// GIVEN — do not change.
class CNode {
    int info;
    CNode next;

    CNode(int x) {
        info = x;
    }
}
`,
    'Josephus.java': j`
public class Josephus {

    static String play(int n, int k) {
        //>> return ""; // TODO: build the ring, then count and unlink
        CNode tail = null;
        for (int i = 1; i <= n; i++) {
            CNode q = new CNode(i);
            if (tail == null) {
                q.next = q;
            } else {
                q.next = tail.next;
                tail.next = q;
            }
            tail = q;
        }
        StringBuilder out = new StringBuilder();
        CNode prev = tail; // the node before the person being counted
        while (prev.next != prev) {
            for (int i = 1; i < k; i++) {
                prev = prev.next;
            }
            CNode gone = prev.next;
            out.append(gone.info).append(' ');
            prev.next = gone.next; // O(1) unlink
        }
        return out.toString() + "| survivor " + prev.info;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the classic n = 7, k = 3, and k = 2', vi: 'bài kinh điển n = 7, k = 3, và k = 2' }, vao: '7 3\n5 2\n4 1\n1 3\n' },
    { ten: { en: 'k larger than n, two people', vi: 'k lớn hơn n, hai người' }, vao: '3 5\n2 2\n2 1\n10 10\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Build the ring with addLast on a tail-only circular list; start with prev = tail, so prev.next is person 1.', vi: 'Dựng vòng bằng addLast trên danh sách vòng chỉ có tail; bắt đầu prev = tail, nên prev.next là người 1.' },
    { en: 'Each round: move prev k − 1 times, record prev.next, then prev.next = prev.next.next. Stop when prev.next == prev (one person left).', vi: 'Mỗi lượt: dời prev k − 1 lần, ghi prev.next, rồi prev.next = prev.next.next. Dừng khi prev.next == prev (còn một người).' },
  ],
  loiHayGap: [
    { en: 'Counting k steps instead of k − 1 — you stand ON the person who must leave, and in a singly list you cannot unlink yourself.', vi: 'Đếm k bước thay vì k − 1 — đứng NGAY trên người phải rời, mà danh sách đơn không tự gỡ chính mình được.' },
    { en: 'Starting prev at the head — the first count is shifted by one person.', vi: 'Cho prev bắt đầu ở head — lần đếm đầu lệch một người.' },
  ],
  giaiThich: { en: '<p>n − 1 removals, each after k − 1 steps: O(n·k) time, and every removal is O(1) because prev is already the node before. An array or ArrayList would also have to shift or skip removed people — the ring removes them for real.</p>', vi: '<p>n − 1 lần gỡ, mỗi lần sau k − 1 bước: O(n·k) thời gian, và mỗi lần gỡ O(1) vì prev đã là nút đứng trước. Mảng hay ArrayList thì còn phải dời hoặc bỏ qua người đã rời — vòng liên kết gỡ họ thật sự.</p>' },
});

const de2 = deJava({
  id: 'csd201-1-6-palindrome-list',
  tieuDe: { en: 'Is the linked list a palindrome? O(n) time, O(1) memory, list restored', vi: 'Danh sách liên kết có đối xứng không? O(n) thời gian, O(1) bộ nhớ, trả lại nguyên trạng' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['middle with slow/fast pointers', 'reverse the second half', 'restore the input'],
  moTa: {
    en: `<p>Complete ${c('static boolean isPalindrome(Node head)')}: true when the values read the same forwards and backwards (${c('1 2 3 2 1')}, ${c('4 4')}, the empty list). No array, no stack, no copy (rule R1): find the middle with slow/fast pointers, reverse the second half in place, compare, then <b>reverse it back</b> — the grader checks that the list is exactly as it was (same node objects, same order) after the call.</p>`,
    vi: `<p>Hoàn thiện ${c('static boolean isPalindrome(Node head)')}: true khi đọc xuôi và ngược giống nhau (${c('1 2 3 2 1')}, ${c('4 4')}, danh sách rỗng). Không mảng, không ngăn xếp, không bản sao (luật R1): tìm giữa bằng con trỏ slow/fast, đảo nửa sau tại chỗ, so sánh, rồi <b>đảo trả lại</b> — máy chấm kiểm danh sách y như cũ (đúng các đối tượng nút, đúng thứ tự) sau lời gọi.</p>`,
  },
  yeuCau: { en: ['O(n) time, O(1) extra memory; no recursion.', 'The list is unchanged after the call.'], vi: ['O(n) thời gian, O(1) bộ nhớ thêm; không đệ quy.', 'Danh sách không đổi sau lời gọi.'] },
  dauVao: { en: 'Lines "P v1 v2 …"; PERF.', vi: 'Các dòng "P v1 v2 …"; PERF.' },
  dauRa: { en: 'true/false and whether the list was restored.', vi: 'true/false và danh sách có được trả lại nguyên trạng không.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'O(1) memory: no array, collection, StringBuilder or new Node in Palin', vi: 'O(1) bộ nhớ: không mảng, collection, StringBuilder hay new Node trong Palin', re: String.raw`\b(List|ArrayList|LinkedList|Deque|Stack|StringBuilder|String\s*\.\s*valueOf)\b|\bnew\s+(Node|\w+\s*\[)`, file: 'Palin' }],
  hen: { n: '2,000,001 nodes', ms: 3000, can: 'O(n) with loops', cham: 'recursive or O(n²)' },
  harness: {
    'KiemTra.java': lopKiem({
      them: `
    static List<Object> made;

    static Node build(int[] v) {
        Node head = null, tail = null;
        made = new ArrayList<>();
        for (int x : v) {
            Node q = new Node(x);
            made.add(q);
            if (head == null) {
                head = q;
            } else {
                tail.next = q;
            }
            tail = q;
        }
        return head;
    }

    static String restored(Node h) {
        int i = 0;
        for (Node q = h; q != null; q = q.next, i++) {
            if (i >= made.size() || made.get(i) != q) {
                return "list CHANGED: " + Kiem.chuoi(h, "next", "info", 30);
            }
        }
        return i == made.size() ? "list restored" : "list CHANGED (nodes lost): " + Kiem.chuoi(h, "next", "info", 30);
    }
`,
      lenh: `                if (p[0].equals("PERF")) {
                    int m = 2000001;
                    int[] v = new int[m];
                    for (int i = 0; i < m; i++) {
                        v[i] = Math.min(i, m - 1 - i) % 1000;
                    }
                    final Node h = build(v);
                    final boolean[] res = new boolean[1];
                    r = Kiem.hen("2,000,001 nodes", 3000, new Runnable() {
                        public void run() {
                            res[0] = Palin.isPalindrome(h);
                        }
                    }) + ", " + res[0] + ", " + (restored(h).startsWith("list restored") ? "list restored" : "list CHANGED");
                } else {
                    int[] v = new int[p.length - 1];
                    for (int i = 1; i < p.length; i++) {
                        v[i - 1] = n(i);
                    }
                    Node h = build(v);
                    r = Palin.isPalindrome(h) + " (" + restored(h) + ")";
                }`,
    }),
  },
  tep: {
    'Node.java': j`
// GIVEN — do not change.
class Node {
    int info;
    Node next;

    Node(int x) {
        info = x;
    }
}
`,
    'Palin.java': j`
public class Palin {

    static boolean isPalindrome(Node head) {
        //>> return false; // TODO: middle, reverse the second half, compare, reverse back
        if (head == null || head.next == null) {
            return true;
        }
        Node slow = head;
        Node fast = head;
        while (fast.next != null && fast.next.next != null) { // slow stops at the end of the first half
            slow = slow.next;
            fast = fast.next.next;
        }
        Node second = reverse(slow.next);
        boolean ok = true;
        for (Node a = head, b = second; b != null; a = a.next, b = b.next) {
            if (a.info != b.info) {
                ok = false;
                break;
            }
        }
        slow.next = reverse(second); // put the list back as it was
        return ok;
        //<<
    }
    //>> // TODO: helper(s)

    private static Node reverse(Node h) {
        Node prev = null;
        while (h != null) {
            Node next = h.next;
            h.next = prev;
            prev = h;
            h = next;
        }
        return prev;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'odd and even palindromes, a near miss', vi: 'đối xứng lẻ và chẵn, một ca suýt đúng' }, vao: 'P 1 2 3 2 1\nP 4 4\nP 1 2 2 1\nP 1 2 3 1\nP\nP 7\n' },
    { ten: { en: 'differences in the middle and at the ends', vi: 'khác ở giữa và ở hai đầu' }, vao: 'P 1 2\nP 1 2 3 3 1\nP 5 1 1 1 5 5\nP 9 8 7 7 8 9\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Loop while (fast.next != null && fast.next.next != null): slow ends on the last node of the first half for both odd and even lengths.', vi: 'Lặp while (fast.next != null && fast.next.next != null): slow dừng ở nút cuối của nửa đầu cho cả độ dài lẻ lẫn chẵn.' },
    { en: 'Reverse slow.next, compare from head and from the reversed half while the second pointer is not null, then slow.next = reverse(that half) again.', vi: 'Đảo slow.next, so từ head và từ nửa đã đảo khi con trỏ thứ hai chưa null, rồi slow.next = reverse(nửa đó) lần nữa.' },
  ],
  loiHayGap: [
    { en: 'Returning as soon as a difference is found, before reversing back — the caller’s list stays broken.', vi: 'Trả về ngay khi thấy khác, trước khi đảo trả lại — danh sách của người gọi bị hỏng.' },
    { en: 'Copying the values into an array or a StringBuilder — O(n) memory (rule R1).', vi: 'Chép giá trị vào mảng hay StringBuilder — O(n) bộ nhớ (luật R1).' },
  ],
  giaiThich: { en: '<p>Finding the middle, reversing half, comparing and reversing back are four linear passes: O(n) time with a handful of references. Restoring the input is part of a correct answer — a function called "isPalindrome" must not change the list it inspects.</p>', vi: '<p>Tìm giữa, đảo nửa, so sánh, đảo trả lại là bốn lượt tuyến tính: O(n) thời gian với vài tham chiếu. Trả lại nguyên trạng là một phần của đáp án đúng — hàm tên "isPalindrome" không được làm đổi danh sách nó kiểm.</p>' },
});

// ─── 🎯 Đề PE đúng khuôn: MyList các Car, data.txt → f1..f4.txt ───
const NODE_PE = `// =========== DO NOT EDIT THE GIVEN CONTENT OF THIS FILE ============
class Node {
  Car info;
  Node next;
  Node() {
   }
  Node(Car x, Node p) {
    info=x;next=p;
   }
  Node(Car x) {
    this(x,null);
   }
 }
`;
const CAR_PE = `// =========== DO NOT EDIT THE GIVEN CONTENT OF THIS FILE ============
class Car {
  String owner;
  int price;
  Car() {
   }
  Car(String xOwner, int xPrice){
    owner=xOwner;price=xPrice;
   }
  public String toString(){
    return("(" +owner+","+price + ")");
   }
 }
`;
const fPe = (k, dong, chen = '', truoc = 'ftraverse(f);') => `  void f${k}() throws Exception {
    clear();
    loadData(${dong});
    String fname = "f${k}.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw");
    ${truoc}
    //------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
${chen}
    //------------------------------------------------------------------------------------
    ftraverse(f);
    f.close();
   }`;
const MYLIST_PE = `/* This program contains 2 parts: (1) and (2)
   YOUR TASK IS TO COMPLETE THE PART  (2)  ONLY
 */
//(1)==============================================================
import java.util.*;
import java.io.*;

public class MyList {
  Node head,tail;
  MyList() {head=tail=null;}
  boolean isEmpty() {
    return(head==null);
   }
  void clear() {head=tail=null;}

  void fvisit(Node p, RandomAccessFile f) throws Exception {
    if(p != null) f.writeBytes(p.info + " ");
   }

  void ftraverse(RandomAccessFile f) throws Exception {
    Node p = head;
    while(p!=null) {
       fvisit(p,f); // You will use this statement to write information of the node p to the file
       p=p.next;
      }
    f.writeBytes("\\r\\n");
   }

  void loadData(int k) { //do not edit this function
    String [] a = Lib.readLineToStrArray("data.txt", k);
    int [] b = Lib.readLineToIntArray("data.txt", k+1);
    int n = a.length;
    for(int i=0;i<n;i++) addLast(a[i],b[i]);
   }

//===========================================================================
//(2)===YOU CAN EDIT OR EVEN ADD NEW FUNCTIONS IN THE FOLLOWING PART========
//===========================================================================
/*
   Khong su dung tieng Viet co dau de viet ghi chu.
   Neu dung khi chay truc tiep se bao loi va nhan 0 diem
*/
  void addLast(String xOwner, int xPrice) {
    //You should write here appropriate statements to complete this function.
    //>>
    if(xOwner.charAt(0)=='B') return;
    Node q = new Node(new Car(xOwner,xPrice));
    if(isEmpty()) {head=tail=q;}
    else {tail.next=q;tail=q;}
    //<<
   }

  //You do not need to edit this function. Your task is to complete the addLast function above only.
  void f1() throws Exception {
     clear();
     loadData(1);
     String fname = "f1.txt";
     File g123 = new File(fname);
     if(g123.exists()) g123.delete();
     RandomAccessFile  f = new RandomAccessFile(fname, "rw");
     ftraverse(f);
     f.close();
    }

//==================================================================
${fPe(2, 4, `     Car x = new Car("X",1);
     //>>
     insertAt(x,2);
     //<<`)}
//>>
  // insert x at position k (0-based); fewer than k nodes: add to the end
  void insertAt(Car x, int k) {
    if(k<=0 || isEmpty()) {
      head = new Node(x,head);
      if(tail==null) tail=head;
      return;
     }
    Node p = head;
    for(int i=1;i<k && p.next!=null;i++) p=p.next;
    p.next = new Node(x,p.next);
    if(p==tail) tail=p.next;
   }
//<<

//==================================================================
${fPe(3, 7, `     //>>
     deleteFirstMax();
     //<<`)}
//>>
  void deleteFirstMax() {
    if(isEmpty()) return;
    Node m = head, pm = null;          // m = first max node, pm = the node before it
    for(Node p=head, prev=null; p!=null; prev=p, p=p.next)
      if(p.info.price > m.info.price) {m=p;pm=prev;}
    if(pm==null) head=head.next; else pm.next=m.next;
    if(m==tail) tail=pm;
   }
//<<

//==================================================================
${fPe(4, 10, `     //>>
     sortByPrice();
     //<<`)}
//>>
  // stable selection sort on the infos: shift instead of swap (equal prices keep their order)
  void sortByPrice() {
    for(Node i=head; i!=null; i=i.next) {
      Node min = i;
      for(Node j=i.next; j!=null; j=j.next)
        if(j.info.price < min.info.price) min=j;
      if(min!=i) { // move min.info to position i, shifting the infos between them one step right
        Car x = min.info;
        for(Node p=i; p!=min; p=p.next) {Car t=p.info; p.info=x; x=t;}
        min.info = x;
       }
     }
   }
//<<

 }
`;

const DATA = `Line 0 - The next line is line 1 (f1)
 A  B  C  D  E  F
 9  5  6  2  7  4
Line 3 - The next line is line 4 (f2)
 C  D  E  F  I
 9  6  8  5  4
Line 6 - The next line is line 7 (f3)
 C  D  E  F  G  H  I
 8  3  9  5  9  6  7
Line 9 - The next line is line 10 (f4)
 C   D   E   F   I  J  K
 1  10   2   5   2 11  7
END
`;
const DATA_AN = [`Line 0 - The next line is line 1 (f1)
 B  A  Bo  C  D  Bi
 1  2  3  4  5  6
Line 3 - The next line is line 4 (f2)
 P  Q
 3  4
Line 6 - The next line is line 7 (f3)
 M  N  O  P
 9  1  2  3
Line 9 - The next line is line 10 (f4)
 Z  Y  W  V  U
 9  7  5  3  1
END
`, `Line 0 - The next line is line 1 (f1)
 Ba  Bb  Bc
 1   2   3
Line 3 - The next line is line 4 (f2)
 R
 6
Line 6 - The next line is line 7 (f3)
 S  T  U  V
 2  4  6  8
Line 9 - The next line is line 10 (f4)
 A  C  D  E  F  G
 5  5  1  5  1  5
END
`];

const de3 = dePeFile({
  id: 'csd201-1-6-pe-mylist-car',
  tieuDe: { en: '🎯 PE format — MyList of Cars: f1 addLast with a condition, f2 insert as 3rd, f3 delete the first max, f4 stable sort', vi: '🎯 Đúng khuôn PE — MyList các Car: f1 addLast có điều kiện, f2 chèn làm nút thứ 3, f3 xoá max đầu tiên, f4 sắp ổn định' },
  khaiNiem: ['PE project layout (Main, Lib, data.txt, f1.txt…)', 'singly linked list with head and tail', 'insert at a position', 'delete the first maximum', 'stable sort on a linked list'],
  lop: 'MyList', tepHoc: 'MyList.java', soF: 4,
  cho: { 'Node.java': NODE_PE, 'Car.java': CAR_PE },
  giai: MYLIST_PE,
  boiCanh: {
    en: `<p><b>Question 1 (4 marks) — a singly linked list of cars.</b> <code>Car(owner, price)</code> is given, <code>MyList</code> keeps <code>head</code> and <code>tail</code>. This paper copies the layout of the real CSD201 papers (Main with a menu, <code>Lib.readLineToStrArray</code>, <code>loadData(k)</code>, <code>fvisit</code>/<code>ftraverse</code> writing to the file) — the questions are this course’s own.</p>`,
    vi: `<p><b>Câu 1 (4 điểm) — danh sách liên kết đơn các xe.</b> <code>Car(owner, price)</code> cho sẵn, <code>MyList</code> giữ <code>head</code> và <code>tail</code>. Đề này chép đúng bố cục đề CSD201 thật (Main có menu, <code>Lib.readLineToStrArray</code>, <code>loadData(k)</code>, <code>fvisit</code>/<code>ftraverse</code> ghi ra tệp) — câu hỏi là của khoá.</p>`,
  },
  cau: [
    { en: '<code>addLast(xOwner, xPrice)</code>: if <code>xOwner.charAt(0) == \'B\'</code> do nothing, otherwise add a new car to the END of the list. <code>loadData</code> calls it for every column of the data — f2…f4 depend on it too. Paper data → <code>(A,9) (C,6) (D,2) (E,7) (F,4)</code>.', vi: '<code>addLast(xOwner, xPrice)</code>: nếu <code>xOwner.charAt(0) == \'B\'</code> thì không làm gì, ngược lại thêm xe mới vào CUỐI danh sách. <code>loadData</code> gọi nó cho mọi cột dữ liệu — f2…f4 cũng phụ thuộc nó. Dữ liệu đề → <code>(A,9) (C,6) (D,2) (E,7) (F,4)</code>.' },
    { en: 'Given <code>x = (X,1)</code>: insert x so that it becomes the <b>3rd</b> node of the list; if the list has fewer than 2 nodes, add x to the end. The file gets the list before and after.', vi: 'Cho <code>x = (X,1)</code>: chèn x để nó thành nút <b>thứ 3</b> của danh sách; danh sách có ít hơn 2 nút thì thêm x vào cuối. Tệp ghi danh sách trước và sau.' },
    { en: 'Delete the <b>first</b> node having the maximum price (keep <code>tail</code> right when it is the last node).', vi: 'Xoá nút <b>đầu tiên</b> có giá lớn nhất (giữ <code>tail</code> đúng khi đó là nút cuối).' },
    { en: 'Sort the list ascending by price; cars with the same price keep their relative order (stable).', vi: 'Sắp danh sách tăng dần theo giá; các xe cùng giá giữ nguyên thứ tự tương đối (ổn định).' },
  ],
  data: DATA, dataAn: DATA_AN,
  goiY: [
    { en: 'Finish addLast first — every fK calls loadData, which calls addLast; a wrong addLast makes all four choices fail.', vi: 'Làm addLast trước — mọi fK gọi loadData, mà loadData gọi addLast; addLast sai thì cả bốn lựa chọn đều trượt.' },
    { en: 'Write helpers in part (2) (insertAt, deleteFirstMax, sortByPrice) and call them from the marked gap of each fK — the given statements around the gap stay untouched.', vi: 'Viết hàm phụ ở phần (2) (insertAt, deleteFirstMax, sortByPrice) rồi gọi chúng ở chỗ trống đánh dấu của mỗi fK — các câu lệnh cho sẵn quanh chỗ trống giữ nguyên.' },
  ],
  loiHayGap: [
    { en: 'Deleting the max that is the tail without moving tail — harmless in this file, but a following addLast would attach to a removed node (the examiners test it in other questions).', vi: 'Xoá max là nút tail mà không dời tail — trong tệp này vô hại, nhưng addLast sau đó sẽ gắn vào nút đã xoá (giám khảo kiểm ở câu khác).' },
    { en: 'Writing Vietnamese with accents in a comment — the real exam machine reports an error and gives 0 (rule P1).', vi: 'Viết tiếng Việt có dấu trong chú thích — máy chấm thật báo lỗi và cho 0 điểm (luật P1).' },
    { en: 'An unstable sort (swapping the min into place) — (I,2) jumps before (E,2).', vi: 'Sắp không ổn định (hoán đổi min vào chỗ) — (I,2) nhảy lên trước (E,2).' },
  ],
  giaiThich: { en: '<p>f1 is the classic append with a guard; f2 walks to the 2nd node and links x after it; f3 finds the first maximum together with the node before it, then unlinks it (head and tail cases); f4 is a stable selection by shifting the infos between i and the minimum one step right instead of swapping. Every f is O(n) except f4 (O(n²), fine for a PE).</p>', vi: '<p>f1 là thêm cuối có điều kiện; f2 đi tới nút thứ 2 rồi nối x sau nó; f3 tìm max đầu tiên cùng nút đứng trước nó rồi gỡ ra (trường hợp head và tail); f4 là chọn ổn định: dời các info giữa i và nút nhỏ nhất sang phải một bước thay vì hoán đổi. Mọi f đều O(n) trừ f4 (O(n²), đủ cho PE).</p>' },
});

export default moDun({ slug: 'csd201-on-ch1', ten: '1.6 🧪 Practice — Josephus, palindrome list and a 🎯 PE-format MyList paper', de: [de1, de2, de3] });
