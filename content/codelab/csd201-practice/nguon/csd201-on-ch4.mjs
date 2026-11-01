/** CSD201 · 4.8 — Thực hành chương 4: thống kê trên BST Car, k-nhỏ-nhất + tổ tiên chung gần nhất, và 🎯 đề PE đúng khuôn BSTree (data.txt → f1..f4.txt). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';
import { dePeFile, QUEUE_NODE } from './_pe.mjs';

const NODE = j`
// GIVEN — do not change.
class Node {
    int key;
    Node left, right;

    Node(int k) {
        key = k;
    }
}
`;
const CHEN = `
    static Node insert(Node t, int k) {
        if (t == null) {
            return new Node(k);
        }
        if (k < t.key) {
            t.left = insert(t.left, k);
        } else if (k > t.key) {
            t.right = insert(t.right, k);
        }
        return t;
    }
`;

const de1 = deJava({
  id: 'csd201-4-8-bst-stats',
  tieuDe: { en: 'PE style: leaves, one-child nodes, height, a price range and the maximum of a BST', vi: 'Kiểu PE: lá, nút một con, chiều cao, một khoảng giá và giá trị lớn nhất của BST' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['counting by recursion', 'the maximum is the rightmost node', 'pruned range counting'],
  moTa: {
    en: `<p>Five classic PE f-functions on a BST of keys (prices). Complete in ${c('Stats')}:</p>
<ul><li>${c('int leaves(Node t)')}, ${c('int oneChild(Node t)')} — nodes with exactly one child;</li>
<li>${c('int height(Node t)')} — the number of levels (empty 0, one node 1 — the PE papers count levels);</li>
<li>${c('int countBetween(Node t, int lo, int hi)')} — keys with lo ≤ key ≤ hi, without visiting subtrees that cannot contain any;</li>
<li>${c('int max(Node t)')} — walk right to the end (t not empty).</li></ul>`,
    vi: `<p>Năm hàm f quen thuộc của đề PE trên BST các khoá (giá). Hoàn thiện trong ${c('Stats')}: ${c('leaves')}, ${c('oneChild')} — số nút có đúng một con; ${c('height')} — số tầng (rỗng 0, một nút 1 — đề PE đếm tầng); ${c('countBetween(t, lo, hi)')} — số khoá lo ≤ key ≤ hi, không ghé cây con không thể chứa khoá nào; ${c('max(t)')} — đi sang phải tới cùng (t khác rỗng).</p>`,
  },
  yeuCau: { en: ['Recursive except max (a loop).', 'Node is given.'], vi: ['Đệ quy, trừ max (vòng lặp).', 'Node cho sẵn.'] },
  dauVao: { en: 'Lines "lo hi : keys in insertion order".', vi: 'Các dòng "lo hi : các khoá theo thứ tự chèn".' },
  dauRa: { en: 'The five answers.', vi: 'Năm câu trả lời.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: CHEN,
      lenh: `                Node t = null;
                for (int i = 3; i < p.length; i++) {
                    t = insert(t, n(i));
                }
                r = "leaves=" + Stats.leaves(t) + " oneChild=" + Stats.oneChild(t) + " height=" + Stats.height(t) + " between=" + Stats.countBetween(t, n(0), n(1)) + " max=" + (t == null ? "-" : String.valueOf(Stats.max(t)));`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'Stats.java': j`
public class Stats {

    static int leaves(Node t) {
        //>> return 0; // TODO
        if (t == null) {
            return 0;
        }
        if (t.left == null && t.right == null) {
            return 1;
        }
        return leaves(t.left) + leaves(t.right);
        //<<
    }

    static int oneChild(Node t) {
        //>> return 0; // TODO
        if (t == null) {
            return 0;
        }
        int me = (t.left == null) != (t.right == null) ? 1 : 0;
        return me + oneChild(t.left) + oneChild(t.right);
        //<<
    }

    static int height(Node t) {
        //>> return 0; // TODO
        return t == null ? 0 : 1 + Math.max(height(t.left), height(t.right));
        //<<
    }

    static int countBetween(Node t, int lo, int hi) {
        //>> return 0; // TODO
        if (t == null) {
            return 0;
        }
        if (t.key < lo) {
            return countBetween(t.right, lo, hi);
        }
        if (t.key > hi) {
            return countBetween(t.left, lo, hi);
        }
        return 1 + countBetween(t.left, lo, hi) + countBetween(t.right, lo, hi);
        //<<
    }

    static int max(Node t) {
        //>> return 0; // TODO
        while (t.right != null) {
            t = t.right;
        }
        return t.key;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s tree', vi: 'cây của bài' }, vao: '4 10 : 8 3 10 1 6 14 4 7 13\n0 100 : 5\n' },
    { ten: { en: 'chains and empty ranges', vi: 'chuỗi và khoảng rỗng' }, vao: '2 3 : 1 2 3 4\n10 20 : 4 3 2 1\n50 60 : 30 20 40\n', an: true },
  ],
  goiY: [
    { en: 'One child: (t.left == null) != (t.right == null).', vi: 'Một con: (t.left == null) != (t.right == null).' },
    { en: 'countBetween: if t.key < lo, only the right subtree can contribute.', vi: 'countBetween: nếu t.key < lo thì chỉ cây con phải đóng góp được.' },
  ],
  loiHayGap: [
    { en: 'Mixing up height conventions: the PE counts levels (one node = 1), the textbook counts edges (one node = 0) — read the paper.', vi: 'Nhầm quy ước chiều cao: đề PE đếm tầng (một nút = 1), giáo trình đếm cạnh (một nút = 0) — đọc kỹ đề.' },
    { en: 'max walking left — that is the minimum.', vi: 'max đi sang trái — đó là giá trị nhỏ nhất.' },
  ],
  giaiThich: { en: '<p>Each statistic is a postorder combination of the children’s answers: O(n). max is one walk down the right spine (O(h)) and the range count skips whole subtrees outside the range.</p>', vi: '<p>Mỗi số liệu là phép kết hợp hậu thứ tự từ đáp án của các con: O(n). max là một lượt đi xuống sống phải (O(h)), còn đếm theo khoảng bỏ qua cả cây con nằm ngoài khoảng.</p>' },
});

const de2 = deJava({
  id: 'csd201-4-8-kth-lca',
  tieuDe: { en: 'k-th smallest key and the lowest common ancestor in a BST', vi: 'Khoá nhỏ thứ k và tổ tiên chung gần nhất trong BST' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['inorder visits keys in increasing order', 'stop early', 'LCA: the first node between the two keys'],
  moTa: {
    en: `<p>Two interview favourites on a BST (keys distinct):</p>
<ul><li>${c('static Integer kthSmallest(Node t, int k)')} — the k-th smallest key (k = 1 is the minimum), ${c('null')} if fewer than k keys; inorder with a counter, <b>stop</b> as soon as you reach it;</li>
<li>${c('static Integer lca(Node t, int a, int b)')} — the deepest node that has both a and b in its subtree (a node is its own ancestor); ${c('null')} if a key is absent. In a BST: walk down from the root; while both keys are smaller go left, both larger go right; otherwise the current node splits them.</li></ul>`,
    vi: `<p>Hai câu phỏng vấn quen thuộc trên BST (khoá khác nhau): ${c('kthSmallest(t, k)')} — khoá nhỏ thứ k (k = 1 là nhỏ nhất), ít hơn k khoá thì ${c('null')}; trung thứ tự kèm bộ đếm, <b>dừng</b> ngay khi tới; ${c('lca(t, a, b)')} — nút sâu nhất có cả a lẫn b trong cây con của nó (một nút là tổ tiên của chính nó), thiếu khoá thì ${c('null')}. Trong BST: đi từ gốc xuống; cả hai khoá nhỏ hơn thì sang trái, cả hai lớn hơn thì sang phải; ngược lại nút hiện tại tách chúng ra.</p>`,
  },
  yeuCau: { en: ['lca in O(h) plus two contains checks.', 'kthSmallest stops early.'], vi: ['lca O(h) cộng hai lần kiểm có khoá.', 'kthSmallest dừng sớm.'] },
  dauVao: { en: 'INS keys…, then K k / LCA a b.', vi: 'INS các khoá…, rồi K k / LCA a b.' },
  dauRa: { en: 'The answers.', vi: 'Các câu trả lời.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      them: CHEN,
      truoc: '        Node t = null;',
      lenh: `                if (p[0].equals("INS")) {
                    for (int i = 1; i < p.length; i++) {
                        t = insert(t, n(i));
                    }
                } else if (p[0].equals("K")) {
                    r = String.valueOf(Queries.kthSmallest(t, n(1)));
                } else {
                    r = String.valueOf(Queries.lca(t, n(1), n(2)));
                }`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'Queries.java': j`
public class Queries {

    static Integer kthSmallest(Node t, int k) {
        //>> return null; // TODO
        int[] left = {k};
        return kth(t, left);
        //<<
    }

    static Integer lca(Node t, int a, int b) {
        //>> return null; // TODO
        if (!contains(t, a) || !contains(t, b)) {
            return null;
        }
        while (t != null) {
            if (a < t.key && b < t.key) {
                t = t.left;
            } else if (a > t.key && b > t.key) {
                t = t.right;
            } else {
                return t.key; // a and b are on different sides (or one of them is t)
            }
        }
        return null;
        //<<
    }
    //>> // TODO: helper(s)

    private static Integer kth(Node t, int[] left) {
        if (t == null) {
            return null;
        }
        Integer r = kth(t.left, left);
        if (r != null) {
            return r;
        }
        if (--left[0] == 0) {
            return t.key;
        }
        return kth(t.right, left);
    }

    private static boolean contains(Node t, int key) {
        while (t != null && t.key != key) {
            t = key < t.key ? t.left : t.right;
        }
        return t != null;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s tree', vi: 'cây của bài' }, vao: 'INS 8 3 10 1 6 14 4 7 13\nK 1\nK 4\nK 9\nK 10\nLCA 4 7\nLCA 4 13\nLCA 6 7\nLCA 1 1\nLCA 5 7\n' },
    { ten: { en: 'empty tree, chains', vi: 'cây rỗng, chuỗi' }, vao: 'K 1\nLCA 1 2\nINS 1 2 3 4 5\nK 5\nLCA 2 5\nLCA 5 4\n', an: true },
  ],
  goiY: [
    { en: 'kthSmallest: a counter shared by the recursion (an int[1] or a field); decrement it when visiting a node in inorder, answer when it reaches 0.', vi: 'kthSmallest: bộ đếm dùng chung cho đệ quy (int[1] hoặc trường); giảm khi thăm nút theo trung thứ tự, trả lời khi về 0.' },
    { en: 'lca: the answer is the first node on the path from the root where a and b go to different sides (or that equals one of them).', vi: 'lca: đáp án là nút đầu tiên trên đường từ gốc mà a và b rẽ khác phía (hoặc bằng một trong hai).' },
  ],
  loiHayGap: [
    { en: 'Building the whole inorder list for every query — correct but O(n) memory and no early stop.', vi: 'Dựng cả danh sách trung thứ tự cho mỗi truy vấn — đúng nhưng O(n) bộ nhớ và không dừng sớm.' },
    { en: 'Answering lca when one key is not in the tree.', vi: 'Trả lời lca khi một khoá không có trong cây.' },
  ],
  giaiThich: { en: '<p>Inorder visits keys in increasing order, so the k-th visited key is the answer: O(h + k). The BST order lets the LCA be found without parent pointers in one O(h) descent — in a general binary tree it needs a full traversal.</p>', vi: '<p>Trung thứ tự ghé các khoá theo thứ tự tăng, nên khoá thứ k được ghé là đáp án: O(h + k). Thứ tự BST cho phép tìm LCA mà không cần con trỏ cha trong một lượt đi xuống O(h) — với cây nhị phân tổng quát phải duyệt cả cây.</p>' },
});

// ─── 🎯 Đề PE đúng khuôn: BSTree các Car theo price ───
const NODE_PE = `// ======= DO NOT EDIT THIS FILE ============
class Node {
   Car info;
   Node left,right;
   int bal,level;
   Node(){
     }
   Node(Car x) {
    info=x;left=right=null;
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
const fPe = (k, dong, chen) => `  void f${k}() throws Exception {
    clear();
    loadData(${dong});
    String fname = "f${k}.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw");
    preOrder(root,f);
    f.writeBytes("\\r\\n");
    //------------------------------------------------------------------------------------
    /*You must keep statements pre-given in this function.
      Your task is to insert statements here, just after this comment,
      to complete the question in the exam paper.*/
${chen}
    //------------------------------------------------------------------------------------
${k === 2 ? '' : '    preOrder(root,f);\n'}    f.writeBytes("\\r\\n");
    f.close();
   }`;
const BSTREE_PE = `/* This program contains 2 parts: (1) and (2)
   YOUR TASK IS TO COMPLETE THE PART  (2)  ONLY
 */
//(1)==============================================================
import java.io.*;
import java.util.*;

public class BSTree {
   Node root;
   BSTree() {root=null;}
   boolean isEmpty() {
       return(root==null);
      }
   void clear() {
       root=null;
      }
   void visit(Node p) {
      System.out.print("p.info: ");
      if(p != null) System.out.println(p.info + " ");
     }
   void fvisit(Node p, RandomAccessFile f) throws Exception {
      if(p != null) f.writeBytes(p.info + " ");
     }
   void breadth(Node p, RandomAccessFile f) throws Exception {
     if(p==null) return;
     Queue q = new Queue();
     q.enqueue(p);Node r;
     while(!q.isEmpty()) {
        r = q.dequeue();
        fvisit(r,f);
        if(r.left!=null) q.enqueue(r.left);
        if(r.right!=null) q.enqueue(r.right);
       }
    }
   void preOrder(Node p, RandomAccessFile f) throws Exception {
      if(p==null) return;
      fvisit(p,f);
      preOrder(p.left,f);
      preOrder(p.right,f);
     }
   void inOrder(Node p, RandomAccessFile f) throws Exception {
      if(p==null) return;
      inOrder(p.left,f);
      fvisit(p,f);
      inOrder(p.right,f);
     }
   void postOrder(Node p, RandomAccessFile f) throws Exception {
      if(p==null) return;
      postOrder(p.left,f);
      postOrder(p.right,f);
      fvisit(p,f);
     }

   void loadData(int k) { //do not edit this function
      String [] a = Lib.readLineToStrArray("data.txt", k);
      int [] b = Lib.readLineToIntArray("data.txt", k+1);
      int n = a.length;
      for(int i=0;i<n;i++) insert(a[i],b[i]);
     }

//===========================================================================
//(2)===YOU CAN EDIT OR EVEN ADD NEW FUNCTIONS IN THE FOLLOWING PART========
//===========================================================================
  void insert(String xOwner, int xPrice) {
    //You should insert here statements to complete this function
    //>>
    if(xOwner.charAt(0)=='B') return;
    Node q = new Node(new Car(xOwner,xPrice));
    if(root==null) {root=q;return;}
    Node f = null, p = root;
    while(p!=null) {
      if(p.info.price==xPrice) return;   // the key (price) must be unique
      f = p;
      p = xPrice < p.info.price ? p.left : p.right;
     }
    if(xPrice < f.info.price) f.left=q; else f.right=q;
    //<<
   }

//Do not edit this function. Your task is to complete insert function above only.
  void f1() throws Exception {
    clear();
    loadData(1);
    String fname = "f1.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw");
    breadth(root,f);
    f.writeBytes("\\r\\n");
    inOrder(root,f);
    f.writeBytes("\\r\\n");
    f.close();
   }

//=============================================================
${fPe(2, 4, `    //>>
    preOrder2(root,f);
    //<<`)}
//>>
  // preorder, but only the cars with price >= 5
  void preOrder2(Node p, RandomAccessFile f) throws Exception {
    if(p==null) return;
    if(p.info.price>=5) fvisit(p,f);
    preOrder2(p.left,f);
    preOrder2(p.right,f);
   }

  // the k-th node (k = 1, 2, ...) in pre-order, or null
  Node kthPre(int k) {
    Node [] st = new Node[1000]; int top = 0, count = 0;
    if(root!=null) st[top++] = root;
    while(top>0) {
      Node p = st[--top];
      if(++count==k) return p;
      if(p.right!=null) st[top++] = p.right;
      if(p.left!=null) st[top++] = p.left;
     }
    return null;
   }

  Node parentOf(Node x) {
    Node f = null, p = root;
    while(p!=null && p!=x) {
      f = p;
      p = x.info.price < p.info.price ? p.left : p.right;
     }
    return f;
   }

  void deleteByCopying(Node p) {
    if(p==null) return;
    if(p.left!=null && p.right!=null) {
      Node f = p, q = p.left;
      while(q.right!=null) {f=q;q=q.right;}
      p.info = q.info;
      if(f==p) f.left=q.left; else f.right=q.left;
      return;
     }
    Node child = p.left!=null ? p.left : p.right;
    Node f = parentOf(p);
    if(f==null) root=child;
    else if(f.left==p) f.left=child; else f.right=child;
   }

  void rotateRight(Node p) {
    if(p==null || p.left==null) return;
    Node f = parentOf(p);
    Node q = p.left;
    p.left = q.right;
    q.right = p;
    if(f==null) root=q;
    else if(f.left==p) f.left=q; else f.right=q;
   }
//<<

//=============================================================
${fPe(3, 7, `    //>>
    deleteByCopying(kthPre(4));
    //<<`)}

//=============================================================
${fPe(4, 10, `    //>>
    rotateRight(kthPre(4));
    //<<`)}

 }
`;

const DATA = `Line 0 - The next line is line 1 (f1)
 A  B  C  D  E  F  G
 7  5  3  9  6  2  8
Line 3 - The next line is line 4 (f2)
 C  D  E  F  G  H  I
 6  3  8  2  5  9  4
Line 6 - The next line is line 7 (f3)
 C   D   E  F  G  H  I
 10  5  15  3  7  6  8
Line 9 - The next line is line 10 (f4)
 J   K   L  M   N   O   P
 20  10 30  5  15  12  18
END
`;
const DATA_AN = [`Line 0 - The next line is line 1 (f1)
 Bo A  C  D  B  E
 1  4  4  2  9  6
Line 3 - The next line is line 4 (f2)
 X  Y  Z
 1  2  3
Line 6 - The next line is line 7 (f3)
 P  Q  R  S  T
 50 40 30 45 60
Line 9 - The next line is line 10 (f4)
 P  Q  R  S
 50 40 30 45
END
`, `Line 0 - The next line is line 1 (f1)
 Z
 5
Line 3 - The next line is line 4 (f2)
 M  N  O  P  Q
 9  7  8  6  5
Line 6 - The next line is line 7 (f3)
 A  C  D
 2  1  3
Line 9 - The next line is line 10 (f4)
 A  C  D  E  F  G
 8  4  12 2  6  5
END
`];

const de3 = dePeFile({
  id: 'csd201-4-8-pe-bstree-car',
  tieuDe: { en: '🎯 PE format — BSTree of Cars: f1 insert + breadth/inorder, f2 filtered preorder, f3 delete by copying, f4 rotate right', vi: '🎯 Đúng khuôn PE — BSTree các Car: f1 chèn + theo tầng/trung thứ tự, f2 tiền thứ tự có lọc, f3 xoá bằng sao chép, f4 quay phải' },
  khaiNiem: ['PE project layout (BSTree, Node, Queue, Lib, data.txt)', 'BST insert with a condition', 'k-th node in preorder', 'delete by copying', 'rotation keeping the parent link'],
  lop: 'BSTree', tepHoc: 'BSTree.java', soF: 4,
  cho: { 'Node.java': NODE_PE, 'Car.java': CAR_PE, 'Queue.java': QUEUE_NODE },
  giai: BSTREE_PE,
  boiCanh: {
    en: `<p><b>Question 2 (4 marks) — a binary search tree of cars.</b> <code>BSTree</code> stores <code>Car(owner, price)</code> objects keyed by <b>price</b> (prices are unique: a car whose price is already in the tree is not inserted). Part (1) — traversals writing to the file, the <code>Queue</code> for breadth-first — is given exactly as in the real papers; the questions are this course’s own, in the style of SP26 Block 5 Paper 4.</p>`,
    vi: `<p><b>Câu 2 (4 điểm) — cây nhị phân tìm kiếm các xe.</b> <code>BSTree</code> lưu các <code>Car(owner, price)</code> theo khoá <b>price</b> (giá không trùng: xe có giá đã có trong cây thì không chèn). Phần (1) — các phép duyệt ghi ra tệp, <code>Queue</code> cho duyệt theo tầng — cho sẵn y như đề thật; câu hỏi là của khoá, theo phong cách đề SP26 Block 5 Paper 4.</p>`,
  },
  cau: [
    { en: '<code>insert(xOwner, xPrice)</code>: if <code>xOwner.charAt(0) == \'B\'</code> do nothing; otherwise insert a new car keyed by price (a price already in the tree is ignored). The file gets the breadth-first traversal, then the inorder traversal.', vi: '<code>insert(xOwner, xPrice)</code>: nếu <code>xOwner.charAt(0) == \'B\'</code> thì không làm gì; ngược lại chèn xe mới theo khoá price (giá đã có thì bỏ qua). Tệp ghi duyệt theo tầng, rồi duyệt trung thứ tự.' },
    { en: 'Pre-order traversal again, but write only the cars with <code>price &gt;= 5</code>. Hint: copy <code>preOrder(...)</code> to <code>preOrder2(...)</code> and modify it.', vi: 'Duyệt tiền thứ tự lần nữa, nhưng chỉ ghi các xe có <code>price &gt;= 5</code>. Gợi ý: chép <code>preOrder(...)</code> thành <code>preOrder2(...)</code> rồi sửa.' },
    { en: 'Let p be the <b>4th node</b> in pre-order traversal. Delete p by the "delete by copying" technique (two children: the predecessor — the rightmost node of the left subtree — is copied). Fewer than 4 nodes: nothing changes.', vi: 'Gọi p là <b>nút thứ 4</b> trong duyệt tiền thứ tự. Xoá p bằng kỹ thuật "xoá bằng sao chép" (hai con: chép nút liền trước — nút phải nhất của cây con trái). Ít hơn 4 nút: không đổi gì.' },
    { en: 'Let p be the 4th node in pre-order traversal. If p has a left child, rotate p to the <b>right</b> about its left child (p’s parent must point to the new subtree root).', vi: 'Gọi p là nút thứ 4 trong duyệt tiền thứ tự. Nếu p có con trái thì quay p sang <b>phải</b> quanh con trái (cha của p phải trỏ tới gốc mới của cây con).' },
  ],
  data: DATA, dataAn: DATA_AN,
  goiY: [
    { en: 'Write two helpers you reuse in f3 and f4: kthPre(k) (the k-th node in pre-order — an explicit stack or a counter in a recursion) and parentOf(p) (walk down from the root by price).', vi: 'Viết hai hàm phụ dùng lại ở f3 và f4: kthPre(k) (nút thứ k theo tiền thứ tự — ngăn xếp tường minh hoặc bộ đếm trong đệ quy) và parentOf(p) (đi từ gốc xuống theo price).' },
    { en: 'f2 only needs one if in front of fvisit — the rest of preOrder stays the same.', vi: 'f2 chỉ cần một câu if trước fvisit — phần còn lại của preOrder giữ nguyên.' },
  ],
  loiHayGap: [
    { en: 'Counting the k-th node in inorder or breadth-first order — the paper says pre-order.', vi: 'Đếm nút thứ k theo trung thứ tự hay theo tầng — đề nói tiền thứ tự.' },
    { en: 'Rotating p without relinking its parent — the rotated subtree disappears from the tree.', vi: 'Quay p mà không nối lại cha — cây con vừa quay biến mất khỏi cây.' },
    { en: 'Accepting duplicate prices in insert — the inorder shows the same price twice.', vi: 'Chấp nhận giá trùng trong insert — trung thứ tự hiện cùng một giá hai lần.' },
  ],
  giaiThich: { en: '<p>Every f is a composition of the chapter’s building blocks: insert by walking down, a filtered traversal, "find the k-th node" + "find its parent", then a deletion or a rotation — each O(h) or O(n). Keeping these helpers ready (and tested) is the fastest way through a real BST question.</p>', vi: '<p>Mỗi f là sự kết hợp các viên gạch của chương: chèn bằng cách đi xuống, một phép duyệt có lọc, "tìm nút thứ k" + "tìm cha của nó", rồi một phép xoá hoặc quay — mỗi việc O(h) hoặc O(n). Chuẩn bị sẵn (và đã thử) các hàm phụ này là cách nhanh nhất để làm câu BST của đề thật.</p>' },
});

export default moDun({ slug: 'csd201-on-ch4', ten: '4.8 🧪 Practice — BST statistics, k-th smallest & LCA, and a 🎯 PE-format BSTree paper', de: [de1, de2, de3] });
