/**
 * build-csd201-pe47.mjs — sinh content/exams/CSD201-PE47.mjs.
 *
 * Nguồn: "Đề 47 — Đề Thi PE PE CSD SP22 Demo" (paper.pdf + sp22_csd201_demo.rar).
 * Đây là ĐỀ DEMO/ÔN TẬP chính thức của FPT cho kỳ Spring 2022, nhưng cấu trúc
 * ĐẦY ĐỦ như một đề PE thật: Q1 4 điểm (MyList) + Q2 4 điểm (BSTree) + Q3 2 điểm
 * (Graph) = 10 điểm, 10 method phải hoàn thiện. Không phải bản rút gọn.
 *
 * ⚠️⚠️ ARCHIVE ĐI KÈM KHÔNG KHỚP ĐỀ. `sp22_csd201_demo.rar` giải nén ra
 * `SP22_CSD201_DEMO/PaperNo_10` — một ĐỀ KHÁC của cùng bộ, dùng lớp `Boo`
 * (forest/rate/sound) và đã có sẵn BÀI LÀM của một sinh viên (bài làm đó còn
 * SAI ở Q2.f4: phép xoay của em ấy làm mất node G và nhân đôi node F). Trong
 * khi paper.pdf nói về lớp `Bird` (type/rate/wing) và cho những ví dụ minh hoạ
 * KHÁC hẳn (ví dụ f1 của paper có 6 node kết thúc bằng (G,-3,2), archive chỉ
 * có 5 node kết thúc bằng (F,4,7)). Đã đối chiếu từng dòng trước khi kết luận.
 *
 * ✅ DỮ LIỆU DÙNG TRONG DECK NÀY LÀ DỮ LIỆU GỐC CỦA FPT, KHÔNG TỰ THIẾT KẾ.
 * Project given đính kèm (PE47-Given.zip) lấy từ bộ given project FPT
 * `CSD201_PEQN_SU24_L1_171239/PaperNo_6` (nằm ở "Đề 24" trong cùng kho đề) —
 * cùng khuôn sinh đề, cùng file data.txt. Đã KIỂM THẬT: nạp đúng data.txt đó
 * rồi biên dịch + chạy `javac`/`java` cho CẢ 10 method, TẤT CẢ 10 output khớp
 * BYTE-FOR-BYTE với ví dụ in trong paper.pdf của Đề 47 (kể cả những chi tiết
 * chỉ đúng khi dữ liệu đúng: entry "B..." bị bỏ qua, entry X trùng khoá rate=4
 * bị từ chối, cây BSTree 9 node có đúng hình dạng cho ra postorder
 * H K J I F G D E C). Nên KHÔNG có số liệu nào trong deck này là bịa.
 *
 * ⚠️ TRÙNG LẶP CẦN BIẾT: Đề 47 (Demo SP22) và Đề 24 (PEQN SU24 L1) dùng CHUNG
 * bộ data.txt. Hệ quả: 4 câu của Question 1 (addLast/f2/f3/f4) của PE47 TRÙNG
 * HỆT PE24 — cùng đề bài, cùng dữ liệu, cùng output. 6 câu còn lại KHÁC:
 *   - Q2: PE47 lấy `rate` làm KHOÁ BST, PE24 lấy `wing` ⇒ hai cây hoàn toàn
 *     khác nhau, và cả 4 yêu cầu f1..f4 cũng khác (lọc wing>4 vs rate>4;
 *     "xoá CHA của node thứ 4 hậu thứ tự" vs yêu cầu khác; "gán wing = chiều
 *     cao cây con" vs gán rate).
 *   - Q3: PE47 f1 hiện 5 đỉnh (thứ 2 → thứ 6), PE24 hiện 6 đỉnh (thứ 2 → 7);
 *     PE47 f2 in 3 đỉnh đầu vào S, PE24 in 4 đỉnh đầu.
 * Đã rà toàn bộ 41 deck CSD201-PE* hiện có theo NỘI DUNG (grep output đặc
 * trưng của cả 3 câu), không có deck nào trùng hoàn toàn với đề này.
 *
 * 📌 HAI CHI TIẾT PHẢI CHẠY MỚI BIẾT (đã đo, không suy từ mã):
 *   1. Q2.f3 BẮT BUỘC xoá-bằng-copy theo NODE TIỀN NHIỆM (node phải nhất của
 *      cây con trái). Thử biến thể dùng node kế nhiệm (trái nhất của cây con
 *      phải) → ra "(H,1,7) (K,4,6) (J,5,5) (I,3,9) (G,7,8) ..." KHÁC với đáp
 *      án của đề "(K,4,6) (J,5,5) (I,3,9) (H,1,7) (G,7,8) ...".
 *   2. Ma trận Q3.f2 có cạnh THẬT trọng số 0 (H→A). Đã thử biến thể Dijkstra
 *      lọc cạnh bằng `a[u][w] > 0` → với ĐỀ NÀY output vẫn ĐÚNG, vì cạnh 0 chỉ
 *      ảnh hưởng tới đỉnh được chọn THỨ TƯ mà đề chỉ hỏi 3 đỉnh đầu. Bẫy có
 *      thật nhưng nằm im ở đề này (ở PE24 hỏi 4 đỉnh thì nó cắn). Nói đúng
 *      như đo được, không thổi phồng.
 *
 * Given.zip: 3 project NetBeans Q1/Q2/Q3 (src + data.txt + nbproject), thân
 * method để trống đúng như đề phát cho sinh viên. Đã verify biên dịch ĐỘC LẬP
 * cả 3 project (javac) TRƯỚC khi zip và upload.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE47.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE47.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE47-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

// ---------------------------------------------------------------------------
// Mã nguồn given (thân method để trống) và lời giải tham chiếu (đã chạy thật).
// ---------------------------------------------------------------------------
const MYLIST_GIVEN = String.raw`/* This program contains 2 parts: (1) and (2)
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
    f.writeBytes("\r\n");
   }

  void loadData(int k) { //do not edit this function
    String [] a = Lib.readLineToStrArray("data.txt", k);
    int [] b = Lib.readLineToIntArray("data.txt", k+1);
    int [] c = Lib.readLineToIntArray("data.txt", k+2);
    int n = a.length;
    for(int i=0;i<n;i++) addLast(a[i],b[i],c[i]);
   }

//===========================================================================
//(2)===YOU CAN EDIT OR EVEN ADD NEW FUNCTIONS IN THE FOLLOWING PART========
//===========================================================================
/* 
   Khong su dung tieng Viet co dau de viet ghi chu.
   Neu dung khi chay truc tiep se bao loi va nhan 0 diem
*/
  void addLast(String xType, int xRate, int xWing) {
    //You should write here appropriate statements to complete this function.



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
  void f2() throws Exception {
     clear();
     loadData(5);
     String fname = "f2.txt";
     File g123 = new File(fname);
     if(g123.exists()) g123.delete();
     RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
     ftraverse(f);
     Bird x, y;
     x = new Bird("X",1,2);
     y = new Bird("Y",3,4);
     //------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/



    //------------------------------------------------------------------------------------
     ftraverse(f);
     f.close();
    }  

//==================================================================
  void f3() throws Exception {
    clear();
    loadData(9);
    String fname = "f3.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    ftraverse(f);
    //------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/



    //------------------------------------------------------------------------------------
    ftraverse(f);
    f.close();
   }

//==================================================================
  void f4() throws Exception {
    clear();
    loadData(13);
    String fname = "f4.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    ftraverse(f);
    //------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/



    //------------------------------------------------------------------------------------
    ftraverse(f);
    f.close();
   }

 }

`;
const MYLIST_SOLVED = String.raw`/* This program contains 2 parts: (1) and (2)
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
    f.writeBytes("\r\n");
   }

  void loadData(int k) { //do not edit this function
    String [] a = Lib.readLineToStrArray("data.txt", k);
    int [] b = Lib.readLineToIntArray("data.txt", k+1);
    int [] c = Lib.readLineToIntArray("data.txt", k+2);
    int n = a.length;
    for(int i=0;i<n;i++) addLast(a[i],b[i],c[i]);
   }

//===========================================================================
//(2)===YOU CAN EDIT OR EVEN ADD NEW FUNCTIONS IN THE FOLLOWING PART========
//===========================================================================
/* 
   Khong su dung tieng Viet co dau de viet ghi chu.
   Neu dung khi chay truc tiep se bao loi va nhan 0 diem
*/
  void addLast(String xType, int xRate, int xWing) {
    //You should write here appropriate statements to complete this function.
    if(xType == null || xType.length() == 0) return;
    if(xType.charAt(0) == 'B') return;   // do nothing
    Node q = new Node(new Bird(xType, xRate, xWing));
    if(isEmpty()) { head = tail = q; return; }
    tail.next = q;
    tail = q;
   }

  // Helper: insert the Bird x so that it becomes the k-th node (k = 1, 2, 3, ...)
  void insertAt(Bird x, int k) {
    if(k <= 1 || isEmpty()) {
      Node q = new Node(x, head);
      head = q;
      if(tail == null) tail = q;
      return;
     }
    Node p = head;
    int i = 1;
    while(p.next != null && i < k-1) { p = p.next; i++; }
    Node q = new Node(x, p.next);
    p.next = q;
    if(q.next == null) tail = q;
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
  void f2() throws Exception {
     clear();
     loadData(5);
     String fname = "f2.txt";
     File g123 = new File(fname);
     if(g123.exists()) g123.delete();
     RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
     ftraverse(f);
     Bird x, y;
     x = new Bird("X",1,2);
     y = new Bird("Y",3,4);
     //------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
     insertAt(x, 4);   // x becomes the 4th node
     insertAt(y, 6);   // y becomes the 6th node

    //------------------------------------------------------------------------------------
     ftraverse(f);
     f.close();
    }  

//==================================================================
  void f3() throws Exception {
    clear();
    loadData(9);
    String fname = "f3.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    ftraverse(f);
    //------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
    int cnt = 0;
    Node p = head;
    while(p != null) {
      if(p.info.rate < 6) {
        cnt++;
        if(cnt == 2) { p.info.wing = 99; break; }
       }
      p = p.next;
     }

    //------------------------------------------------------------------------------------
    ftraverse(f);
    f.close();
   }

//==================================================================
  void f4() throws Exception {
    clear();
    loadData(13);
    String fname = "f4.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    ftraverse(f);
    //------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
    if(!isEmpty()) {
      // 1) copy the list into an array
      int n = 0;
      Node p = head;
      while(p != null) { n++; p = p.next; }
      Bird [] arr = new Bird[n];
      p = head;
      for(int i = 0; i < n; i++) { arr[i] = p.info; p = p.next; }
      // 2) position of the FIRST maximum rate
      int m = 0;
      for(int i = 1; i < n; i++) if(arr[i].rate > arr[m].rate) m = i;
      // 3) sort arr[0..m] ascending by rate
      for(int i = 0; i < m; i++)
        for(int j = i+1; j <= m; j++)
          if(arr[j].rate < arr[i].rate) { Bird t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
      // 4) write the array back into the list
      p = head;
      for(int i = 0; i < n; i++) { p.info = arr[i]; p = p.next; }
     }

    //------------------------------------------------------------------------------------
    ftraverse(f);
    f.close();
   }

 }

`;
const BSTREE_GIVEN = String.raw`/* This program contains 2 parts: (1) and (2)
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
      int [] c = Lib.readLineToIntArray("data.txt", k+2);
      int n = a.length;
      for(int i=0;i<n;i++) insert(a[i],b[i],c[i]);
     }

//===========================================================================
//(2)===YOU CAN EDIT OR EVEN ADD NEW FUNCTIONS IN THE FOLLOWING PART========
//===========================================================================
  void insert(String xType, int xRate, int xWing) {
    //You should insert here statements to complete this function



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
    f.writeBytes("\r\n");
    inOrder(root,f);
    f.writeBytes("\r\n");
    f.close();
   }  
  
//=============================================================
  void f2() throws Exception {
    clear();
    loadData(5);
    String fname = "f2.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    breadth(root,f);
    f.writeBytes("\r\n");
    //------------------------------------------------------------------------------------
    /*You must keep statements pre-given in this function.
      Your task is to insert statements here, just after this comment,
      to complete the question in the exam paper.*/



    //------------------------------------------------------------------------------------
    f.writeBytes("\r\n");
    f.close();
   }  

//=============================================================
  void f3() throws Exception {
    clear();
    loadData(9);
    String fname = "f3.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    postOrder(root,f);
    f.writeBytes("\r\n");
    //------------------------------------------------------------------------------------
    /*You must keep statements pre-given in this function.
      Your task is to insert statements here, just after this comment,
      to complete the question in the exam paper.*/



    //------------------------------------------------------------------------------------
    postOrder(root,f);
    f.writeBytes("\r\n");
    f.close();
   }  

//=============================================================
  void f4() throws Exception {
    clear();
    loadData(13);;
    String fname = "f4.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    postOrder(root,f);
    f.writeBytes("\r\n");
    //------------------------------------------------------------------------------------
    /*You must keep statements pre-given in this function.
      Your task is to insert statements here, just after this comment,
      to complete the question in the exam paper.*/
 

     

    //------------------------------------------------------------------------------------
    postOrder(root,f);
    f.writeBytes("\r\n");
    f.close();
   }  

 }
`;
const BSTREE_SOLVED = String.raw`/* This program contains 2 parts: (1) and (2)
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
      int [] c = Lib.readLineToIntArray("data.txt", k+2);
      int n = a.length;
      for(int i=0;i<n;i++) insert(a[i],b[i],c[i]);
     }

//===========================================================================
//(2)===YOU CAN EDIT OR EVEN ADD NEW FUNCTIONS IN THE FOLLOWING PART========
//===========================================================================
  void insert(String xType, int xRate, int xWing) {
    //You should insert here statements to complete this function
    if(xType == null || xType.length() == 0) return;
    if(xType.charAt(0) == 'B') return;              // do nothing
    Bird x = new Bird(xType, xRate, xWing);
    Node q = new Node(x);
    if(isEmpty()) { root = q; return; }
    Node f = null, p = root;
    while(p != null) {
      if(p.info.rate == xRate) return;              // rate is the key, it must be unique
      f = p;
      if(xRate < p.info.rate) p = p.left; else p = p.right;
     }
    if(xRate < f.info.rate) f.left = q; else f.right = q;
   }

  // ---- helpers used by f2, f3 and f4 ------------------------------------------------
  // breadth-first traversal that writes only the nodes with wing > 4
  void breadth2(Node p, RandomAccessFile f) throws Exception {
    if(p == null) return;
    Queue q = new Queue();
    q.enqueue(p); Node r;
    while(!q.isEmpty()) {
      r = q.dequeue();
      if(r.info.wing > 4) fvisit(r,f);
      if(r.left != null) q.enqueue(r.left);
      if(r.right != null) q.enqueue(r.right);
     }
   }

  // collect the post-order traversal into a list
  void postList(Node p, ArrayList<Node> t) {
    if(p == null) return;
    postList(p.left, t);
    postList(p.right, t);
    t.add(p);
   }

  // the father of the node p (null when p is the root or is not in the tree)
  Node father(Node p) {
    if(p == null || p == root) return null;
    Queue q = new Queue();
    q.enqueue(root); Node r;
    while(!q.isEmpty()) {
      r = q.dequeue();
      if(r.left == p || r.right == p) return r;
      if(r.left != null) q.enqueue(r.left);
      if(r.right != null) q.enqueue(r.right);
     }
    return null;
   }

  // classic delete-by-copying of the node holding the key xRate
  void deleteByCopying(int xRate) {
    Node f = null, p = root;
    while(p != null && p.info.rate != xRate) {
      f = p;
      if(xRate < p.info.rate) p = p.left; else p = p.right;
     }
    if(p == null) return;                            // the key does not exist
    if(p.left != null && p.right != null) {          // 2 children: copy the predecessor
      Node fr = p, rp = p.left;
      while(rp.right != null) { fr = rp; rp = rp.right; }
      p.info = rp.info;
      if(fr == p) fr.left = rp.left; else fr.right = rp.left;
      return;
     }
    Node c = (p.left != null) ? p.left : p.right;    // 0 or 1 child
    if(f == null) root = c;
    else if(f.left == p) f.left = c;
    else f.right = c;
   }

  // height of the sub-tree rooted at p (a leaf has height 1)
  int height(Node p) {
    if(p == null) return 0;
    int hl = height(p.left), hr = height(p.right);
    return 1 + (hl > hr ? hl : hr);
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
    f.writeBytes("\r\n");
    inOrder(root,f);
    f.writeBytes("\r\n");
    f.close();
   }  
  
//=============================================================
  void f2() throws Exception {
    clear();
    loadData(5);
    String fname = "f2.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    breadth(root,f);
    f.writeBytes("\r\n");
    //------------------------------------------------------------------------------------
    /*You must keep statements pre-given in this function.
      Your task is to insert statements here, just after this comment,
      to complete the question in the exam paper.*/
    breadth2(root,f);

    //------------------------------------------------------------------------------------
    f.writeBytes("\r\n");
    f.close();
   }  

//=============================================================
  void f3() throws Exception {
    clear();
    loadData(9);
    String fname = "f3.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    postOrder(root,f);
    f.writeBytes("\r\n");
    //------------------------------------------------------------------------------------
    /*You must keep statements pre-given in this function.
      Your task is to insert statements here, just after this comment,
      to complete the question in the exam paper.*/
    ArrayList<Node> t3 = new ArrayList<Node>();
    postList(root, t3);
    if(t3.size() >= 4) {
      Node p = t3.get(3);            // p = the 4th node of the post-order traversal
      Node ff = father(p);           // ff = the father of p
      if(ff != null) deleteByCopying(ff.info.rate);
     }

    //------------------------------------------------------------------------------------
    postOrder(root,f);
    f.writeBytes("\r\n");
    f.close();
   }  

//=============================================================
  void f4() throws Exception {
    clear();
    loadData(13);;
    String fname = "f4.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    postOrder(root,f);
    f.writeBytes("\r\n");
    //------------------------------------------------------------------------------------
    /*You must keep statements pre-given in this function.
      Your task is to insert statements here, just after this comment,
      to complete the question in the exam paper.*/
    ArrayList<Node> t4 = new ArrayList<Node>();
    postList(root, t4);
    if(t4.size() >= 4) {
      Node p = t4.get(3);            // p = the 4th node of the post-order traversal
      int k = height(p);             // height of the sub-tree with root p
      p.info.wing = k;
     }

    //------------------------------------------------------------------------------------
    postOrder(root,f);
    f.writeBytes("\r\n");
    f.close();
   }  

 }
`;
const GRAPH_GIVEN = String.raw`/* This program contains 2 parts: (1) and (2)
   YOUR TASK IS TO COMPLETE THE PART  (2)  ONLY
 */
//(1)============================================
import java.io.*;
import java.util.*;
//-------------------------------------------------------------------------------
public class Graph {
  int [][] a; int n;
  char v[];
  int deg[];
  Graph() {
    v = "ABCDEFGHIJKLMNOP".toCharArray();
    deg = new int[20];
    a = new int[20][20];
    n = 0;
   }

  void loadData(int k) {  //do not edit this function
    RandomAccessFile f;int i,j,x;
    String s;StringTokenizer t;
    a = new int[20][20];
    try {
     f = new RandomAccessFile("data.txt","r");
     for(i=0;i<k;i++) f.readLine();
     s = f.readLine();s = s.trim();
     n = Integer.parseInt(s);
     for(i=0;i<n;i++) {
       s = f.readLine();s = s.trim();
       t = new StringTokenizer(s);
       for(j=0;j<n;j++) { 
         x = Integer.parseInt(t.nextToken().trim());
         a[i][j] = x;
        }
       }
     f.close();
     }
    catch(Exception e) {}

   }

  void dispAdj() {
    int i,j;
    for(i=0;i<n;i++) {
      System.out.println();
      for(j=0;j<n;j++)
        System.out.printf("%4d",a[i][j]);
     }
   }

  void fvisit(int i, RandomAccessFile f) throws Exception {
    f.writeBytes("  "+v[i]);
   }

 void fdispAdj(RandomAccessFile f) throws Exception { 
    int i,j;
    f.writeBytes("n = "+n+"\r\n");
    for(i=0;i<n;i++) {
      f.writeBytes("\r\n");
      for(j=0;j<n;j++)  f.writeBytes("  " + a[i][j]);
     }
    f.writeBytes("\r\n");
   }

  void breadth(boolean [] en, int i, RandomAccessFile f) throws Exception {
    Queue q = new Queue();
    int r,j;
    q.enqueue(i); en[i]=true;
    while(!q.isEmpty()) {
      r = q.dequeue();
      fvisit(r,f);
      for(j=0;j<n;j++) {
        if(!en[j] && a[r][j]>0) {
         q.enqueue(j);en[j]=true;
        }
       }
     }
   }

  void breadth(int  k, RandomAccessFile f) throws Exception {
    boolean [] en = new boolean[20];
    int i;
    for(i=0;i<n;i++) en[i]=false;
    breadth(en,k,f);
    for(i=0;i<n;i++) 
      if(!en[i]) breadth(en,i,f);
   }

 void depth(boolean [] visited,int k, RandomAccessFile f) throws Exception {
    fvisit(k,f);visited[k]=true;
    for(int i=0;i<n;i++) {
      if(!visited[i] && a[k][i]>0) depth(visited,i,f);
     }
   }
  void depth(int k, RandomAccessFile f) throws Exception {
    boolean [] visited = new boolean[20];
    int i;
    for(i=0;i<n;i++) visited[i]=false;
    depth(visited,k,f);
    for(i=0;i<n;i++) 
       if(!visited[i]) depth(visited,i,f);
   }

//===========================================================================
//(2)===YOU CAN EDIT OR EVEN ADD NEW FUNCTIONS IN THE FOLLOWING PART========
//===========================================================================
//====================================================================================
  void f1() throws Exception {
    loadData(1);
    String fname = "f1.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    breadth(2,f);
    f.writeBytes("\r\n");
    //-------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/




    //-------------------------------------------------------------------------------------
    f.writeBytes("\r\n");
    f.close();
   }

//=================================================================================================
  void f2() throws Exception {
    loadData(12);
    String fname = "f2.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    f.writeBytes("\r\n");
    //-------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
      // You can use the statement fvisit(i,f); i = 0, 1, 2,...,n-1 to display the vertex i to file f2.txt 
      //  and statement f.writeBytes(" " + k); to write  variable k to the file f2.txt  




    //-------------------------------------------------------------------------------------
    f.writeBytes("\r\n");
    f.close();
   }

}
`;
const GRAPH_SOLVED = String.raw`/* This program contains 2 parts: (1) and (2)
   YOUR TASK IS TO COMPLETE THE PART  (2)  ONLY
 */
//(1)============================================
import java.io.*;
import java.util.*;
//-------------------------------------------------------------------------------
public class Graph {
  int [][] a; int n;
  char v[];
  int deg[];
  Graph() {
    v = "ABCDEFGHIJKLMNOP".toCharArray();
    deg = new int[20];
    a = new int[20][20];
    n = 0;
   }

  void loadData(int k) {  //do not edit this function
    RandomAccessFile f;int i,j,x;
    String s;StringTokenizer t;
    a = new int[20][20];
    try {
     f = new RandomAccessFile("data.txt","r");
     for(i=0;i<k;i++) f.readLine();
     s = f.readLine();s = s.trim();
     n = Integer.parseInt(s);
     for(i=0;i<n;i++) {
       s = f.readLine();s = s.trim();
       t = new StringTokenizer(s);
       for(j=0;j<n;j++) { 
         x = Integer.parseInt(t.nextToken().trim());
         a[i][j] = x;
        }
       }
     f.close();
     }
    catch(Exception e) {}

   }

  void dispAdj() {
    int i,j;
    for(i=0;i<n;i++) {
      System.out.println();
      for(j=0;j<n;j++)
        System.out.printf("%4d",a[i][j]);
     }
   }

  void fvisit(int i, RandomAccessFile f) throws Exception {
    f.writeBytes("  "+v[i]);
   }

 void fdispAdj(RandomAccessFile f) throws Exception { 
    int i,j;
    f.writeBytes("n = "+n+"\r\n");
    for(i=0;i<n;i++) {
      f.writeBytes("\r\n");
      for(j=0;j<n;j++)  f.writeBytes("  " + a[i][j]);
     }
    f.writeBytes("\r\n");
   }

  void breadth(boolean [] en, int i, RandomAccessFile f) throws Exception {
    Queue q = new Queue();
    int r,j;
    q.enqueue(i); en[i]=true;
    while(!q.isEmpty()) {
      r = q.dequeue();
      fvisit(r,f);
      for(j=0;j<n;j++) {
        if(!en[j] && a[r][j]>0) {
         q.enqueue(j);en[j]=true;
        }
       }
     }
   }

  void breadth(int  k, RandomAccessFile f) throws Exception {
    boolean [] en = new boolean[20];
    int i;
    for(i=0;i<n;i++) en[i]=false;
    breadth(en,k,f);
    for(i=0;i<n;i++) 
      if(!en[i]) breadth(en,i,f);
   }

 void depth(boolean [] visited,int k, RandomAccessFile f) throws Exception {
    fvisit(k,f);visited[k]=true;
    for(int i=0;i<n;i++) {
      if(!visited[i] && a[k][i]>0) depth(visited,i,f);
     }
   }
  void depth(int k, RandomAccessFile f) throws Exception {
    boolean [] visited = new boolean[20];
    int i;
    for(i=0;i<n;i++) visited[i]=false;
    depth(visited,k,f);
    for(i=0;i<n;i++) 
       if(!visited[i]) depth(visited,i,f);
   }

//===========================================================================
//(2)===YOU CAN EDIT OR EVEN ADD NEW FUNCTIONS IN THE FOLLOWING PART========
//===========================================================================
//====================================================================================
  void f1() throws Exception {
    loadData(1);
    String fname = "f1.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    breadth(2,f);
    f.writeBytes("\r\n");
    //-------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
    ArrayList<Integer> order = new ArrayList<Integer>();
    boolean [] en = new boolean[20];
    for(int i=0;i<n;i++) en[i]=false;
    breadth2(en,2,order);
    for(int i=0;i<n;i++) if(!en[i]) breadth2(en,i,order);
    // display 5 vertices only: from the 2nd one up to the 6th one
    for(int i=1;i<=5 && i<order.size();i++) fvisit(order.get(i).intValue(),f);

    //-------------------------------------------------------------------------------------
    f.writeBytes("\r\n");
    f.close();
   }

//=================================================================================================
  void f2() throws Exception {
    loadData(12);
    String fname = "f2.txt";
    File g123 = new File(fname);
    if(g123.exists()) g123.delete();
    RandomAccessFile  f = new RandomAccessFile(fname, "rw"); 
    f.writeBytes("\r\n");
    //-------------------------------------------------------------------------------------
     /*You must keep statements pre-given in this function.
       Your task is to insert statements here, just after this comment,
       to complete the question in the exam paper.*/
      // You can use the statement fvisit(i,f); i = 0, 1, 2,...,n-1 to display the vertex i to file f2.txt 
      //  and statement f.writeBytes(" " + k); to write  variable k to the file f2.txt  
    // (1) shortest path from the vertex 2 (C) to the vertex 5 (F)
    int [] par1 = new int[20];
    ArrayList<Integer> sel1 = new ArrayList<Integer>();
    int [] d1 = dijkstra(2, par1, sel1);
    ArrayList<Integer> path1 = buildPath(par1, 2, 5);
    for(int i=0;i<path1.size();i++) fvisit(path1.get(i).intValue(),f);   // line 1
    f.writeBytes("\r\n");
    f.writeBytes(" " + d1[5]);                                          // line 2
    f.writeBytes("\r\n");
    // (2) from the vertex 1 (B) to the vertex 6 (G): first 3 vertices selected into S
    int [] par2 = new int[20];
    ArrayList<Integer> sel2 = new ArrayList<Integer>();
    dijkstra(1, par2, sel2);
    for(int i=0;i<3 && i<sel2.size();i++) fvisit(sel2.get(i).intValue(),f); // line 3

    //-------------------------------------------------------------------------------------
    f.writeBytes("\r\n");
    f.close();
   }

  static final int INF = 1000000;

  // Dijkstra from the vertex src. par[] = the predecessor tree,
  // sel = the vertices in the exact order they are selected into the set S.
  int [] dijkstra(int src, int [] par, ArrayList<Integer> sel) {
    int [] d = new int[20];
    boolean [] done = new boolean[20];
    for(int i=0;i<n;i++) { d[i]=INF; par[i]=-1; done[i]=false; }
    d[src]=0;
    for(int it=0; it<n; it++) {
      int u=-1, best=INF;
      for(int i=0;i<n;i++) if(!done[i] && d[i]<best) { best=d[i]; u=i; }
      if(u==-1) break;
      done[u]=true;
      sel.add(u);
      for(int w=0; w<n; w++) {
        // 99 means infinity; w != u skips the diagonal, so a REAL 0-weight edge is kept
        if(w!=u && !done[w] && a[u][w]<99 && d[u]+a[u][w] < d[w]) {
          d[w] = d[u]+a[u][w];
          par[w] = u;
         }
       }
     }
    return d;
   }

  ArrayList<Integer> buildPath(int [] par, int src, int dst) {
    ArrayList<Integer> t = new ArrayList<Integer>();
    int c = dst;
    while(c != -1) { t.add(0, c); if(c==src) break; c = par[c]; }
    return t;
   }

  // breadth-first traversal that records the visiting order instead of writing it
  void breadth2(boolean [] en, int i, ArrayList<Integer> order) {
    Queue q = new Queue();
    int r,j;
    q.enqueue(i); en[i]=true;
    while(!q.isEmpty()) {
      r = q.dequeue().intValue();
      order.add(r);
      for(j=0;j<n;j++) {
        if(!en[j] && a[r][j]>0) { q.enqueue(j); en[j]=true; }
       }
     }
   }

}
`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Spring 2022 — official Demo paper). Read the instructions carefully before starting to code.</p>
   <ol>
     <li>Software tools: <b>NetBeans IDE 8.x</b> and <b>Java JDK 1.8</b>. Create a folder (e.g. CSD_given) and download the given materials above into it — it contains 3 separate NetBeans projects: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>To do question 1 (do the same for questions 2 and 3): open the given Q1 project, then edit the file MyList.java according to the requirements of the exam (edit BSTree.java for Q2 and Graph.java for Q3).</li>
     <li>Write only inside part (2) of each file, right after the marked comment. <b>You must keep every pre-given statement</b> and must not change any method signature.</li>
     <li>Before submission run "Clean and Build Project" (Shift+F11) to make sure the build is SUCCESSFUL — otherwise that question gets 0 mark.</li>
     <li><b>Do not use accented Vietnamese</b> when writing comments, and <b>do not add any new import statement</b> to the given files. If at least one of the requirements is not followed, the exam will get ZERO.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into each code box — it is graded by AI against the rubric. You can build and run the real given projects on your own machine and cross-check with the sample outputs shown in each question.</li>
     <li><i>"Do not pay attention to the real meaning of the objects, variables and their values in the questions below"</i> — as this paper itself states.</li>
   </ol>
   <p><b>Note on the given materials.</b> The .rar file shipped next to this Demo paper is a <i>different</i> paper of the same batch (PaperNo_10, class Boo with forest/rate/sound) and does not match this paper at all. The projects attached above are the FPT given projects whose data.txt reproduces <b>every</b> worked example printed in this paper — confirmed by compiling and running all 10 methods with javac/java.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Spring 2022 — đề Demo chính thức). Đọc kỹ hướng dẫn trước khi bắt đầu viết mã.</p>
   <ol>
     <li>Công cụ: <b>NetBeans IDE 8.x</b> và <b>Java JDK 1.8</b>. Tạo một thư mục (ví dụ CSD_given) rồi tải given materials ở trên vào đó — gồm 3 project NetBeans riêng: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Làm câu 1 (câu 2, 3 tương tự): mở project Q1 given, rồi sửa file MyList.java theo yêu cầu của đề (sửa BSTree.java cho Q2 và Graph.java cho Q3).</li>
     <li>Chỉ viết trong phần (2) của mỗi file, ngay sau chú thích đánh dấu. <b>Phải giữ nguyên mọi câu lệnh cho sẵn</b> và không được đổi chữ ký method.</li>
     <li>Trước khi nộp phải chạy "Clean and Build Project" (Shift+F11) để chắc chắn BUILD SUCCESSFUL — nếu không, câu đó bị 0 điểm.</li>
     <li><b>Không dùng tiếng Việt có dấu</b> khi viết chú thích, và <b>không thêm import mới</b> vào file cho sẵn. Vi phạm dù chỉ một điều là bài thi bị 0 điểm.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên hãy gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build và chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy in trong từng câu.</li>
     <li><i>"Không cần để ý ý nghĩa thật của đối tượng, biến và giá trị của chúng trong các câu dưới đây"</i> — chính đề gốc ghi vậy.</li>
   </ol>
   <p><b>Lưu ý về given materials.</b> File .rar đi kèm đề Demo này thật ra là một đề KHÁC của cùng bộ (PaperNo_10, lớp Boo với forest/rate/sound), không khớp đề này chút nào. Project đính kèm ở trên là project given của FPT có data.txt tái tạo <b>đúng toàn bộ</b> ví dụ minh hoạ in trong đề — đã xác nhận bằng cách biên dịch và chạy thật cả 10 method bằng javac/java.</p>`,
);

const scenarioQ1 = B(
  `<p><strong>Question 1 (4 marks) — file MyList.java.</strong> The class <code>Bird</code> (with 3 data members: <code>type</code>, <code>rate</code> and <code>wing</code>) is given, so you do not need to edit it. <code>MyList</code> is a linked list of Bird objects. Each of the 4 methods below is graded separately, 1 mark each.</p>`,
  `<p><strong>Câu 1 (4 điểm) — file MyList.java.</strong> Lớp <code>Bird</code> (3 thành viên dữ liệu: <code>type</code>, <code>rate</code>, <code>wing</code>) đã cho sẵn, không cần sửa. <code>MyList</code> là danh sách liên kết các đối tượng Bird. Mỗi trong 4 method dưới đây được chấm riêng, mỗi câu 1 điểm.</p>`,
);

const scenarioQ2 = B(
  `<p><strong>Question 2 (4 marks) — file BSTree.java.</strong> The class <code>Bird</code> (with 3 data members: <code>type</code>, <code>rate</code> and <code>wing</code>) is given, so you do not need to edit it. <code>BSTree</code> is a binary search tree of Bird objects. <b>The variable <code>rate</code> is the key of the tree, thus it must be unique.</b> Each of the 4 methods below is graded separately, 1 mark each.</p>`,
  `<p><strong>Câu 2 (4 điểm) — file BSTree.java.</strong> Lớp <code>Bird</code> (3 thành viên dữ liệu: <code>type</code>, <code>rate</code>, <code>wing</code>) đã cho sẵn, không cần sửa. <code>BSTree</code> là cây nhị phân tìm kiếm các đối tượng Bird. <b>Biến <code>rate</code> là KHOÁ của cây, nên nó phải duy nhất.</b> Mỗi trong 4 method dưới đây được chấm riêng, mỗi câu 1 điểm.</p>`,
);

const scenarioQ3 = B(
  `<p><strong>Question 3 (2 marks) — file Graph.java.</strong> The class <code>Graph</code> is the implementation of a graph: adjacency matrix <code>a</code>, <code>n</code> vertices labelled A, B, C, ... through the array <code>v[]</code>. Each of the 2 methods below is graded separately, 1 mark each.</p>`,
  `<p><strong>Câu 3 (2 điểm) — file Graph.java.</strong> Lớp <code>Graph</code> là cài đặt của một đồ thị: ma trận kề <code>a</code>, <code>n</code> đỉnh gắn nhãn A, B, C, ... qua mảng <code>v[]</code>. Mỗi trong 2 method dưới đây được chấm riêng, mỗi câu 1 điểm.</p>`,
);

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1.split('|||')[0] + `<p><strong>void addLast(String xType, int xRate, int xWing) — 1 mark</strong></p><ul><li>Check if <code>xType.charAt(0) == 'B'</code> then <b>do nothing</b>; otherwise add a new node with type=xType, rate=xRate, wing=xWing to the <b>end</b> of the list. (rate and wing can get arbitrary, even negative values.)</li><li><code>f1()</code> is pre-given and must not be edited — your task is to complete <code>addLast(...)</code> only. It loads the first data block and writes the whole list to f1.txt.</li></ul>`,
    scenarioQ1.split('|||')[1] + `<p><strong>void addLast(String xType, int xRate, int xWing) — 1 điểm</strong></p><ul><li>Kiểm tra nếu <code>xType.charAt(0) == 'B'</code> thì <b>không làm gì</b>; ngược lại thêm một node mới với type=xType, rate=xRate, wing=xWing vào <b>CUỐI</b> danh sách. (rate và wing có thể nhận giá trị bất kỳ, kể cả âm.)</li><li><code>f1()</code> đã cho sẵn và không được sửa — nhiệm vụ của bạn chỉ là hoàn thiện <code>addLast(...)</code>. Nó nạp khối dữ liệu đầu tiên rồi ghi toàn bộ danh sách ra f1.txt.</li></ul>`,
  ),
  starterCode: MYLIST_GIVEN,
  sampleSolution: MYLIST_SOLVED,
  expectedOutput: `(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 1 — the output matches this paper's own worked example byte-for-byte.</p><p>The data block holds 7 birds A, B, C, D, E, F, G. The one whose type starts with 'B' is skipped, which is exactly why the printed list has 6 nodes and the letter B is missing from an otherwise consecutive A..G run. Note that F has a negative wing (-7) and G a negative rate (-3): the filter is on the <b>type</b> only, never on the sign of rate/wing.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 1 — output khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Khối dữ liệu có 7 con chim A, B, C, D, E, F, G. Con có type bắt đầu bằng 'B' bị bỏ qua, đó chính là lý do danh sách in ra chỉ có 6 node và thiếu đúng chữ B trong dãy A..G liên tục. Chú ý F có wing âm (-7) và G có rate âm (-3): điều kiện lọc chỉ xét <b>type</b>, không bao giờ xét dấu của rate/wing.</p>`,
  ),
  rubric: [
    { id: 'type_filter', criterion: B("Correctly does nothing when xType.charAt(0) == 'B', and does not filter on rate/wing being negative.", "Không làm gì đúng khi xType.charAt(0) == 'B', và không lọc theo rate/wing âm."), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list (updates tail), handling both the empty and the non-empty list cases.', 'Nối đúng node mới vào cuối danh sách (cập nhật tail), xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>void f2() — 1 mark: insert x as the 4th node and y as the 6th node</strong></p><ul><li>This function has 2 given Bird objects x = ("X",1,2) and y = ("Y",3,4), already created for you.</li><li>Assume the list contains at least 5 elements. Write statements to insert x and y into the list so that <b>x will be the 4th node</b> and <b>y will be the 6th node</b>.</li><li>Keep every pre-given statement; write only after the marked comment. The first line of f2.txt is the list before the insertion, the second line is the list after it.</li></ul>`,
    `<p><strong>void f2() — 1 điểm: chèn x làm node thứ 4 và y làm node thứ 6</strong></p><ul><li>Hàm này có sẵn 2 đối tượng Bird x = ("X",1,2) và y = ("Y",3,4), đã được tạo sẵn cho bạn.</li><li>Giả sử danh sách có ít nhất 5 phần tử. Viết các lệnh chèn x và y vào danh sách sao cho <b>x là node thứ 4</b> và <b>y là node thứ 6</b>.</li><li>Giữ nguyên mọi lệnh cho sẵn; chỉ viết sau chú thích đánh dấu. Dòng đầu của f2.txt là danh sách trước khi chèn, dòng thứ hai là sau khi chèn.</li></ul>`,
  ),
  starterCode: MYLIST_GIVEN,
  sampleSolution: MYLIST_SOLVED,
  expectedOutput: `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9)
(C,9,8) (D,6,3) (E,8,5) (X,1,2) (F,5,4) (Y,3,4) (I,4,9)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 2 — the output matches this paper's own worked example byte-for-byte.</p><p>The positions are counted <b>on the list as it is at that moment</b>, so the order of the two insertions matters. Inserting x first turns C D E F I into C D E X F I (x is the 4th). Inserting y after that puts it behind F, i.e. as the 6th of the final 7-node list: C D E X F Y I. Doing it in the other order, or counting both positions against the original list, gives a different result.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 2 — output khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Vị trí được đếm <b>trên danh sách tại đúng thời điểm chèn</b>, nên thứ tự hai lần chèn có ý nghĩa. Chèn x trước biến C D E F I thành C D E X F I (x là node thứ 4). Chèn y sau đó đặt nó ngay sau F, tức node thứ 6 của danh sách 7 phần tử cuối cùng: C D E X F Y I. Làm ngược thứ tự, hoặc đếm cả hai vị trí trên danh sách ban đầu, sẽ ra kết quả khác.</p>`,
  ),
  rubric: [
    { id: 'insert_x_4th', criterion: B('Correctly inserts x so that it becomes the 4th node (relinks the 3rd node to x and x to the old 4th).', 'Chèn đúng x để nó thành node thứ 4 (nối lại node thứ 3 tới x và x tới node thứ 4 cũ).'), weight: 1, maxScore: 0.5 },
    { id: 'insert_y_6th', criterion: B('Correctly inserts y so that it becomes the 6th node of the list as it stands after x was inserted.', 'Chèn đúng y để nó thành node thứ 6 của danh sách sau khi x đã được chèn.'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>void f3() — 1 mark: find the second node having rate &lt; 6</strong></p><ul><li>Find the <b>second</b> node having <code>rate &lt; 6</code> then change its <code>wing</code> to 99. Leave every other node untouched.</li><li>Keep every pre-given statement; write only after the marked comment. The first line of f3.txt is the list before the change, the second line is the list after it.</li></ul>`,
    `<p><strong>void f3() — 1 điểm: tìm node THỨ HAI có rate &lt; 6</strong></p><ul><li>Tìm node <b>thứ hai</b> có <code>rate &lt; 6</code> rồi đổi <code>wing</code> của nó thành 99. Giữ nguyên mọi node khác.</li><li>Giữ nguyên mọi lệnh cho sẵn; chỉ viết sau chú thích đánh dấu. Dòng đầu của f3.txt là danh sách trước khi sửa, dòng thứ hai là sau khi sửa.</li></ul>`,
  ),
  starterCode: MYLIST_GIVEN,
  sampleSolution: MYLIST_SOLVED,
  expectedOutput: `(C,8,6) (D,3,5) (E,9,2) (F,5,8) (G,9,7) (H,6,8) (I,7,3)
(C,8,6) (D,3,5) (E,9,2) (F,5,99) (G,9,7) (H,6,8) (I,7,3)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 3 — the output matches this paper's own worked example byte-for-byte.</p><p>The rates in order are 8, 3, 9, 5, 9, 6, 7. Only D (rate 3) and F (rate 5) satisfy rate &lt; 6, so F is the second one and its wing 8 becomes 99. The counter must be over the <b>matching</b> nodes, not over list positions, and the loop must stop at the second match — otherwise a later node would be overwritten as well.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 3 — output khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Dãy rate theo thứ tự là 8, 3, 9, 5, 9, 6, 7. Chỉ D (rate 3) và F (rate 5) thoả rate &lt; 6, nên F là node thứ hai và wing 8 của nó thành 99. Bộ đếm phải đếm trên các node <b>THOẢ ĐIỀU KIỆN</b>, không phải đếm theo vị trí trong danh sách, và vòng lặp phải dừng ngay ở node thứ hai — nếu không sẽ ghi đè nhầm cả node phía sau.</p>`,
  ),
  rubric: [
    { id: 'count_matches', criterion: B('Counts only the nodes satisfying rate < 6 (not list positions) and identifies the SECOND of them.', 'Chỉ đếm các node thoả rate < 6 (không phải đếm vị trí) và xác định đúng node THỨ HAI trong số đó.'), weight: 1, maxScore: 0.6 },
    { id: 'set_wing_stop', criterion: B('Sets wing = 99 on that node only and stops (does not modify any later matching node).', 'Chỉ gán wing = 99 cho đúng node đó rồi dừng (không sửa các node thoả điều kiện phía sau).'), weight: 1, maxScore: 0.4 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>void f4() — 1 mark: sort ascendingly by rate, up to the first max rate</strong></p><ul><li>Sort the list <b>ascendingly by rate</b>, from the beginning up to <b>the first node holding the maximum rate</b> (that node included). Every node after it keeps its place.</li><li>Keep every pre-given statement; write only after the marked comment. The first line of f4.txt is the list before sorting, the second line is the list after it.</li></ul>`,
    `<p><strong>void f4() — 1 điểm: sắp tăng dần theo rate, tới node có rate lớn nhất đầu tiên</strong></p><ul><li>Sắp xếp danh sách <b>tăng dần theo rate</b>, từ đầu danh sách cho tới <b>node ĐẦU TIÊN có rate lớn nhất</b> (tính cả node đó). Mọi node phía sau giữ nguyên vị trí.</li><li>Giữ nguyên mọi lệnh cho sẵn; chỉ viết sau chú thích đánh dấu. Dòng đầu của f4.txt là danh sách trước khi sắp, dòng thứ hai là sau khi sắp.</li></ul>`,
  ),
  starterCode: MYLIST_GIVEN,
  sampleSolution: MYLIST_SOLVED,
  expectedOutput: `(C,1,2) (D,10,3) (E,2,15) (F,11,6) (I,6,14) (J,11,15) (K,7,9)
(C,1,2) (E,2,15) (D,10,3) (F,11,6) (I,6,14) (J,11,15) (K,7,9)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 4 — the output matches this paper's own worked example byte-for-byte.</p><p>The rates are 1, 10, 2, 11, 6, 11, 7. The maximum rate is 11 and it occurs <b>twice</b>, at F (4th) and at J (6th) — the boundary is the <b>first</b> one, F. So only the first 4 nodes are sorted: 1, 10, 2, 11 becomes 1, 2, 10, 11, i.e. C, E, D, F. The tail I, J, K is untouched, which is why J (also rate 11) stays where it is. Sorting up to the last maximum instead would reorder I, J, K as well and no longer match.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 4 — output khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Dãy rate là 1, 10, 2, 11, 6, 11, 7. Rate lớn nhất là 11 và nó xuất hiện <b>HAI lần</b>, ở F (thứ 4) và ở J (thứ 6) — mốc dừng là lần xuất hiện <b>ĐẦU TIÊN</b>, tức F. Nên chỉ 4 node đầu được sắp: 1, 10, 2, 11 thành 1, 2, 10, 11, tức C, E, D, F. Đuôi I, J, K giữ nguyên, đó là lý do J (cũng rate 11) đứng yên tại chỗ. Nếu sắp tới lần xuất hiện CUỐI của giá trị lớn nhất thì I, J, K cũng bị xáo và không còn khớp đáp án.</p>`,
  ),
  rubric: [
    { id: 'find_first_max', criterion: B('Correctly locates the boundary: the FIRST node holding the maximum rate (not the last occurrence of that value).', 'Xác định đúng mốc dừng: node ĐẦU TIÊN có rate lớn nhất (không phải lần xuất hiện cuối của giá trị đó).'), weight: 1, maxScore: 0.4 },
    { id: 'sort_prefix', criterion: B('Correctly sorts that prefix ascendingly by rate while leaving every node after the boundary in place.', 'Sắp đúng đoạn đầu đó tăng dần theo rate, đồng thời giữ nguyên mọi node phía sau mốc dừng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2.split('|||')[0] + `<p><strong>void insert(String xType, int xRate, int xWing) — 1 mark</strong></p><ul><li>Check if <code>xType.charAt(0) == 'B'</code> then <b>do nothing</b>; otherwise insert a new Bird object with type=xType, rate=xRate, wing=xWing into the tree. (rate and wing can get arbitrary, even negative values.)</li><li>Remember that <code>rate</code> is the key and must be unique: a candidate whose rate already exists in the tree must not be inserted.</li><li><code>f1()</code> is pre-given and must not be edited — your task is to complete <code>insert(...)</code> only. It writes the breadth-first traversal on line 1 and the in-order traversal on line 2.</li></ul>`,
    scenarioQ2.split('|||')[1] + `<p><strong>void insert(String xType, int xRate, int xWing) — 1 điểm</strong></p><ul><li>Kiểm tra nếu <code>xType.charAt(0) == 'B'</code> thì <b>không làm gì</b>; ngược lại chèn một Bird mới với type=xType, rate=xRate, wing=xWing vào cây. (rate và wing có thể nhận giá trị bất kỳ, kể cả âm.)</li><li>Nhớ rằng <code>rate</code> là KHOÁ và phải duy nhất: một ứng viên có rate đã tồn tại trong cây thì không được chèn.</li><li><code>f1()</code> đã cho sẵn và không được sửa — nhiệm vụ của bạn chỉ là hoàn thiện <code>insert(...)</code>. Nó ghi dãy duyệt theo chiều rộng ở dòng 1 và dãy duyệt in-order ở dòng 2.</li></ul>`,
  ),
  starterCode: BSTREE_GIVEN,
  sampleSolution: BSTREE_SOLVED,
  expectedOutput: `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)
(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (A,7,9) (D,8,6)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 1 — both lines match this paper's own worked example byte-for-byte.</p><p>This one data block exercises <b>both</b> rejection rules at once. It holds 8 candidates A(7), B(9), C(4), D(8), E(2), F(-6), X(4), Y(6) but only 6 nodes come out: B is dropped because its type starts with 'B', and <b>X is dropped because its rate 4 duplicates C's key</b>. A solution that skips the 'B' test, or that inserts duplicate keys, prints 7 or 8 nodes and fails. The resulting tree is A(7) at the root, C(4) and D(8) as its children, E(2) and Y(6) under C, F(-6) under E — the in-order line is then just the rates in ascending order: -6, 2, 4, 6, 7, 8, which is a free self-check that the key really is rate.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 1 — cả hai dòng khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Riêng khối dữ liệu này kiểm <b>CẢ HAI</b> luật từ chối cùng lúc. Nó có 8 ứng viên A(7), B(9), C(4), D(8), E(2), F(-6), X(4), Y(6) nhưng chỉ 6 node ra được: B bị loại vì type bắt đầu bằng 'B', và <b>X bị loại vì rate 4 trùng khoá với C</b>. Lời giải quên kiểm 'B', hoặc cho chèn khoá trùng, sẽ in ra 7 hoặc 8 node và sai. Cây kết quả là A(7) ở gốc, C(4) và D(8) là hai con, E(2) và Y(6) dưới C, F(-6) dưới E — dòng in-order khi đó đúng bằng dãy rate tăng dần: -6, 2, 4, 6, 7, 8, một phép tự kiểm miễn phí rằng khoá đúng là rate.</p>`,
  ),
  rubric: [
    { id: 'type_filter', criterion: B("Correctly does nothing when xType.charAt(0) == 'B'.", "Không làm gì đúng khi xType.charAt(0) == 'B'."), weight: 1, maxScore: 0.25 },
    { id: 'unique_key', criterion: B('Correctly refuses to insert when the rate already exists anywhere in the tree (rate is the unique key).', 'Từ chối chèn đúng khi rate đã tồn tại ở bất kỳ đâu trong cây (rate là khoá duy nhất).'), weight: 1, maxScore: 0.3 },
    { id: 'bst_order', criterion: B('Correctly walks down from the root comparing on rate and links the new node as the left/right child of the last visited node.', 'Đi xuống từ gốc, so sánh theo rate và nối node mới làm con trái/phải của node cuối cùng đi qua.'), weight: 1, maxScore: 0.45 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>void f2() — 1 mark: breadth-first traversal filtered by wing</strong></p><ul><li>Perform a <b>breadth-first traversal from the root</b> but write to f2.txt <b>only the nodes with wing &gt; 4</b>.</li><li>Hint: copy the given function <code>breadth(...)</code> to a new function <code>breadth2(...)</code> and modify it.</li><li>Keep every pre-given statement; write only after the marked comment. Line 1 of f2.txt is the full breadth-first traversal, line 2 is your filtered one.</li></ul>`,
    `<p><strong>void f2() — 1 điểm: duyệt theo chiều rộng có lọc theo wing</strong></p><ul><li>Duyệt <b>theo chiều rộng từ gốc</b> nhưng chỉ ghi ra f2.txt <b>các node có wing &gt; 4</b>.</li><li>Gợi ý: copy hàm <code>breadth(...)</code> cho sẵn thành hàm mới <code>breadth2(...)</code> rồi sửa lại.</li><li>Giữ nguyên mọi lệnh cho sẵn; chỉ viết sau chú thích đánh dấu. Dòng 1 của f2.txt là dãy duyệt theo chiều rộng đầy đủ, dòng 2 là dãy đã lọc của bạn.</li></ul>`,
  ),
  starterCode: BSTREE_GIVEN,
  sampleSolution: BSTREE_SOLVED,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,3) (G,7,8) (H,1,7) (I,3,9) (J,5,5) (K,4,6)
(G,7,8) (H,1,7) (I,3,9) (J,5,5) (K,4,6)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 2 — both lines match this paper's own worked example byte-for-byte.</p><p>The wings are C=2, D=1, E=4, F=3, G=8, H=7, I=9, J=5, K=6, so the four nodes dropped are exactly C, D, E and F. Note that E has wing 4 and is dropped: the test is <b>strictly greater</b> than 4. The important part is <i>where</i> the filter goes — the node must still be <b>enqueued</b> even when it is not printed, otherwise the whole sub-tree under a filtered-out node disappears (here dropping C, the root, would empty the line completely).</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 2 — cả hai dòng khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Các wing là C=2, D=1, E=4, F=3, G=8, H=7, I=9, J=5, K=6, nên đúng bốn node bị loại là C, D, E và F. Chú ý E có wing 4 và vẫn bị loại: điều kiện là <b>lớn hơn nghiêm ngặt</b> 4. Điều quan trọng là đặt bộ lọc ở <i>đâu</i> — node vẫn phải được <b>đưa vào hàng đợi</b> dù không in ra, nếu không cả cây con dưới một node bị lọc sẽ biến mất (ở đây loại C là gốc thì dòng kết quả sẽ trống trơn).</p>`,
  ),
  rubric: [
    { id: 'breadth_copy', criterion: B('Performs a real breadth-first traversal with a queue, still enqueueing the children of nodes that are filtered out.', 'Duyệt theo chiều rộng thật bằng hàng đợi, vẫn đưa con của các node bị lọc vào hàng đợi.'), weight: 1, maxScore: 0.6 },
    { id: 'wing_filter', criterion: B('Writes only the nodes whose wing is strictly greater than 4.', 'Chỉ ghi ra các node có wing lớn hơn nghiêm ngặt 4.'), weight: 1, maxScore: 0.4 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>void f3() — 1 mark: delete the father of the 4th post-order node, by copying</strong></p><ul><li>Suppose <b>p is the 4th node in the post-order traversal</b> of the tree and <b>f is the father of p</b>. Delete the node <b>f</b> by copying.</li><li>Keep every pre-given statement; write only after the marked comment. Line 1 of f3.txt is the post-order traversal before the deletion, line 2 is the post-order traversal after it.</li></ul>`,
    `<p><strong>void f3() — 1 điểm: xoá CHA của node thứ 4 trong hậu thứ tự, bằng phương pháp copy</strong></p><ul><li>Giả sử <b>p là node thứ 4 trong dãy duyệt hậu thứ tự (post-order)</b> của cây và <b>f là cha của p</b>. Xoá node <b>f</b> bằng phương pháp copy.</li><li>Giữ nguyên mọi lệnh cho sẵn; chỉ viết sau chú thích đánh dấu. Dòng 1 của f3.txt là dãy hậu thứ tự trước khi xoá, dòng 2 là dãy hậu thứ tự sau khi xoá.</li></ul>`,
  ),
  starterCode: BSTREE_GIVEN,
  sampleSolution: BSTREE_SOLVED,
  expectedOutput: `(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (G,7,8) (D,6,1) (E,9,4) (C,8,2)
(K,4,6) (J,5,5) (I,3,9) (H,1,7) (G,7,8) (D,6,1) (E,9,4) (C,8,2)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 3 — both lines match this paper's own worked example byte-for-byte.</p><p>The post-order sequence is H, K, J, I, F, G, D, E, C, so p is <b>I</b> (the 4th) and its father is <b>F</b>. F has two children (H on the left, I on the right), which is the interesting case of delete-by-copying.</p><p><b>Careful — the variant matters here, and it was checked by running both.</b> The expected output is only produced by copying from the <b>in-order predecessor</b>, i.e. the right-most node of the left sub-tree (here H, a leaf): F's info is overwritten by H's, then H is unlinked. Using the in-order successor instead (the left-most node of the right sub-tree) also produces a valid BST but prints "(H,1,7) (K,4,6) (J,5,5) (I,3,9) (G,7,8) ..." — a different line 2, which does not match this paper.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 3 — cả hai dòng khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Dãy hậu thứ tự là H, K, J, I, F, G, D, E, C, nên p là <b>I</b> (node thứ 4) và cha của nó là <b>F</b>. F có hai con (H bên trái, I bên phải), đúng trường hợp thú vị của xoá-bằng-copy.</p><p><b>Cẩn thận — chọn biến thể nào là quan trọng, và điều này đã được kiểm bằng cách CHẠY CẢ HAI.</b> Đáp án của đề chỉ ra được khi copy từ <b>node tiền nhiệm in-order</b>, tức node phải nhất của cây con trái (ở đây là H, một lá): info của F bị ghi đè bằng info của H, rồi H bị tháo khỏi cây. Nếu dùng node kế nhiệm in-order (node trái nhất của cây con phải) thì cây vẫn là BST hợp lệ nhưng in ra "(H,1,7) (K,4,6) (J,5,5) (I,3,9) (G,7,8) ..." — dòng 2 khác, không khớp đề này.</p>`,
  ),
  rubric: [
    { id: 'find_p_and_father', criterion: B('Correctly computes the post-order traversal, takes its 4th node as p, and finds the father f of p.', 'Tính đúng dãy hậu thứ tự, lấy node thứ 4 làm p, và tìm đúng cha f của p.'), weight: 1, maxScore: 0.4 },
    { id: 'delete_by_copying', criterion: B('Deletes f by copying: for a node with 2 children it copies the info of the right-most node of the left sub-tree (the in-order predecessor) and unlinks that node, correctly relinking its left child.', 'Xoá f bằng copy: với node có 2 con thì chép info của node phải nhất trong cây con trái (tiền nhiệm in-order) rồi tháo node đó ra, nối lại đúng con trái của nó.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>void f4() — 1 mark: height of the sub-tree rooted at the 4th post-order node</strong></p><ul><li>Suppose <b>p is the 4th node in the post-order traversal</b> of the tree. Calculate the <b>height of the sub-tree whose root is p</b>; call that height k, then set <code>p.info.wing = k</code>.</li><li>Keep every pre-given statement; write only after the marked comment. Line 1 of f4.txt is the post-order traversal before the change, line 2 is the post-order traversal after it.</li></ul>`,
    `<p><strong>void f4() — 1 điểm: chiều cao của cây con gốc là node thứ 4 trong hậu thứ tự</strong></p><ul><li>Giả sử <b>p là node thứ 4 trong dãy duyệt hậu thứ tự</b> của cây. Tính <b>chiều cao của cây con có gốc là p</b>; gọi chiều cao đó là k, rồi gán <code>p.info.wing = k</code>.</li><li>Giữ nguyên mọi lệnh cho sẵn; chỉ viết sau chú thích đánh dấu. Dòng 1 của f4.txt là dãy hậu thứ tự trước khi sửa, dòng 2 là dãy hậu thứ tự sau khi sửa.</li></ul>`,
  ),
  starterCode: BSTREE_GIVEN,
  sampleSolution: BSTREE_SOLVED,
  expectedOutput: `(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (G,7,8) (D,6,1) (E,9,4) (C,8,2)
(H,1,7) (K,4,6) (J,5,5) (I,3,3) (F,2,3) (G,7,8) (D,6,1) (E,9,4) (C,8,2)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 4 — both lines match this paper's own worked example byte-for-byte.</p><p>The post-order sequence is H, K, J, I, F, G, D, E, C, so p is <b>I</b>. Only I changes, from (I,3,9) to (I,3,3), and the tree shape is not touched at all — that single changed number is what the whole mark hangs on.</p><p>The sub-tree rooted at I is I → J → K, a chain of 3 nodes, and the expected answer is 3. So this paper counts height as the <b>number of nodes</b> on the longest downward path (a leaf has height 1, an empty tree 0). The other common convention — counting edges, where a leaf has height 0 — would give 2 here and fail. The paper's own expected output is what settles the convention.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 4 — cả hai dòng khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Dãy hậu thứ tự là H, K, J, I, F, G, D, E, C, nên p là <b>I</b>. Chỉ I thay đổi, từ (I,3,9) thành (I,3,3), và hình dạng cây không hề bị đụng tới — cả điểm số của câu này treo vào đúng một con số đó.</p><p>Cây con gốc I là I → J → K, một chuỗi 3 node, và đáp án của đề là 3. Vậy đề này tính chiều cao theo <b>SỐ NODE</b> trên đường đi xuống dài nhất (lá có chiều cao 1, cây rỗng là 0). Quy ước phổ biến còn lại — đếm số CẠNH, lá có chiều cao 0 — sẽ cho 2 ở đây và sai. Chính đáp án in trong đề là thứ quyết định quy ước.</p>`,
  ),
  rubric: [
    { id: 'find_p', criterion: B('Correctly computes the post-order traversal and takes its 4th node as p.', 'Tính đúng dãy hậu thứ tự và lấy node thứ 4 làm p.'), weight: 1, maxScore: 0.35 },
    { id: 'height', criterion: B('Correctly computes the height of the sub-tree rooted at p, counting nodes (a leaf has height 1), and assigns it to p.info.wing without changing the tree structure.', 'Tính đúng chiều cao cây con gốc p theo SỐ NODE (lá có chiều cao 1) và gán vào p.info.wing mà không đổi cấu trúc cây.'), weight: 1, maxScore: 0.65 },
  ],
};

const q3_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ3.split('|||')[0] + `<p><strong>void f1() — 1 mark: breadth-first traversal displaying a range of vertices</strong></p><ul><li>Perform a <b>breadth-first traversal</b> (to the file f1.txt) from the vertex <code>i = 2</code> (the vertex C) but display only <b>5 vertices, from the 2nd vertex to the 6th vertex</b>.</li><li>Hint: copy the given <code>breadth(...)</code> to <code>breadth2(...)</code> and modify the latter one.</li><li>Keep every pre-given statement; write only after the marked comment. Line 1 of f1.txt is the full traversal, line 2 is your 5-vertex range.</li></ul>`,
    scenarioQ3.split('|||')[1] + `<p><strong>void f1() — 1 điểm: duyệt theo chiều rộng, hiện một đoạn đỉnh</strong></p><ul><li>Duyệt <b>theo chiều rộng</b> (ghi vào file f1.txt) từ đỉnh <code>i = 2</code> (đỉnh C) nhưng chỉ hiện <b>5 đỉnh, từ đỉnh thứ 2 tới đỉnh thứ 6</b>.</li><li>Gợi ý: copy hàm <code>breadth(...)</code> cho sẵn thành <code>breadth2(...)</code> rồi sửa hàm mới.</li><li>Giữ nguyên mọi lệnh cho sẵn; chỉ viết sau chú thích đánh dấu. Dòng 1 của f1.txt là dãy duyệt đầy đủ, dòng 2 là đoạn 5 đỉnh của bạn.</li></ul>`,
  ),
  starterCode: GRAPH_GIVEN,
  sampleSolution: GRAPH_SOLVED,
  expectedOutput: `C A H B D E I G F
A H B D E`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 1 — both lines match this paper's own worked example byte-for-byte.</p><p>The breadth-first traversal from C visits C, A, H, B, D, E, I, G — and then stops, because no visited vertex has an out-edge into F (the only edge touching F in this matrix is F → C). The pre-given <code>breadth(int k, ...)</code> handles that by restarting from every still-unvisited vertex, which is what appends F at the end. Your <code>breadth2(...)</code> must keep that restart loop, otherwise the numbering of the vertices shifts and the range is wrong.</p><p>"From the 2nd to the 6th" means positions 2, 3, 4, 5, 6 of that 9-vertex sequence, i.e. A, H, B, D, E — 5 vertices, matching the count the paper states. A counter that starts at 0 instead of 1 is the classic way to be off by one here.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 1 — cả hai dòng khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Dãy duyệt theo chiều rộng từ C thăm C, A, H, B, D, E, I, G — rồi dừng, vì không đỉnh nào đã thăm có cung đi vào F (cạnh duy nhất chạm F trong ma trận này là F → C). Hàm <code>breadth(int k, ...)</code> cho sẵn xử lý chuyện đó bằng cách khởi động lại từ mọi đỉnh chưa thăm, và đó là thứ nối F vào cuối. Hàm <code>breadth2(...)</code> của bạn phải giữ vòng khởi động lại đó, nếu không thứ tự đánh số đỉnh sẽ lệch và đoạn lấy ra bị sai.</p><p>"Từ đỉnh thứ 2 tới đỉnh thứ 6" nghĩa là vị trí 2, 3, 4, 5, 6 của dãy 9 đỉnh đó, tức A, H, B, D, E — 5 đỉnh, đúng số lượng đề nói. Bộ đếm bắt đầu từ 0 thay vì 1 là cách kinh điển để lệch một nhịp ở đây.</p>`,
  ),
  rubric: [
    { id: 'breadth_full', criterion: B('Reproduces the same breadth-first order as the given breadth(...), including the restart loop over the still-unvisited vertices.', 'Tái tạo đúng thứ tự duyệt chiều rộng như breadth(...) cho sẵn, kể cả vòng khởi động lại trên các đỉnh chưa thăm.'), weight: 1, maxScore: 0.5 },
    { id: 'range', criterion: B('Displays exactly the 2nd through 6th vertices of that order (5 vertices), with no off-by-one.', 'Hiện đúng đỉnh thứ 2 tới thứ 6 của dãy đó (5 đỉnh), không lệch một nhịp.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>void f2() — 1 mark: two Dijkstra queries</strong></p><ul><li>Apply <b>Dijkstra's shortest path algorithm</b> to find (1) the shortest path from vertex 2 (C) to vertex 5 (F), then (2) from vertex 1 (B) to vertex 6 (G).</li><li>Write <b>3 lines</b> to the file f2.txt: line 1 contains the vertices in the shortest path of (1); line 2 contains the shortest distance in (1); line 3 contains the <b>first 3 vertices selected into the set S</b> in (2).</li><li>Note that in the weighted matrix, the value <b>99 is considered as infinity</b>.</li><li>You can use <code>fvisit(i,f)</code> to display the vertex i, and <code>f.writeBytes(" " + k)</code> to write the variable k.</li></ul>`,
    `<p><strong>void f2() — 1 điểm: hai lượt Dijkstra</strong></p><ul><li>Áp dụng <b>thuật toán đường đi ngắn nhất Dijkstra</b> để tìm (1) đường đi ngắn nhất từ đỉnh 2 (C) tới đỉnh 5 (F), rồi (2) từ đỉnh 1 (B) tới đỉnh 6 (G).</li><li>Ghi <b>3 dòng</b> vào file f2.txt: dòng 1 là các đỉnh trên đường đi ngắn nhất của (1); dòng 2 là độ dài ngắn nhất trong (1); dòng 3 là <b>3 đỉnh ĐẦU TIÊN được chọn vào tập S</b> trong (2).</li><li>Lưu ý trong ma trận trọng số, giá trị <b>99 được coi là vô cùng</b>.</li><li>Có thể dùng <code>fvisit(i,f)</code> để hiện đỉnh i, và <code>f.writeBytes(" " + k)</code> để ghi biến k.</li></ul>`,
  ),
  starterCode: GRAPH_GIVEN,
  sampleSolution: GRAPH_SOLVED,
  expectedOutput: `C E D F
12
B C H`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 2 — all 3 lines match this paper's own worked example byte-for-byte.</p><p>Query (1), from C: the labels become E = 3, then D = 3 + 4 = 7 (better than the direct C → D = 8), then F = 7 + 5 = 12 (better than the direct C → F = 20). So the path is C → E → D → F with total 12 — line 1 and line 2. Reporting the path requires keeping a predecessor array while relaxing, then walking it backwards from F.</p><p>Query (2), from B: B is selected first with label 0; relaxing B gives C = 2, H = 2, D = 10. C and H are tied at 2, and the vertex with the smaller index wins, so C is second and H is third — the answer B C H. Only the first 3 selections are asked for, so the search does not even need to reach G.</p><p><b>One trap worth knowing about, measured rather than assumed:</b> this matrix contains a genuine off-diagonal edge of weight 0 (H → A). Filtering edges with <code>a[u][w] &gt; 0</code> would silently drop it. Re-running the whole question with that broken filter still prints the same 3 correct lines here, because the 0-weight edge only changes which vertex is selected <i>fourth</i> — and this paper stops at three. It is safer to skip the diagonal by index (<code>w != u</code>) anyway; sibling papers that ask for 4 selected vertices do get it wrong.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 2 — cả 3 dòng khớp từng byte với ví dụ minh hoạ của chính đề.</p><p>Lượt (1), từ C: nhãn lần lượt thành E = 3, rồi D = 3 + 4 = 7 (tốt hơn cung thẳng C → D = 8), rồi F = 7 + 5 = 12 (tốt hơn cung thẳng C → F = 20). Nên đường đi là C → E → D → F, tổng 12 — chính là dòng 1 và dòng 2. Muốn in được đường đi thì phải giữ mảng đỉnh-cha trong lúc nới lỏng, rồi lần ngược từ F.</p><p>Lượt (2), từ B: B được chọn đầu tiên với nhãn 0; nới lỏng từ B cho C = 2, H = 2, D = 10. C và H hoà nhau ở 2, đỉnh có chỉ số nhỏ hơn thắng, nên C là thứ hai và H là thứ ba — đáp án B C H. Đề chỉ hỏi 3 đỉnh đầu nên thuật toán thậm chí chưa cần chạm tới G.</p><p><b>Một cái bẫy nên biết, và là ĐO CHỨ KHÔNG ĐOÁN:</b> ma trận này có một cạnh thật ngoài đường chéo với trọng số 0 (H → A). Lọc cạnh bằng <code>a[u][w] &gt; 0</code> sẽ âm thầm vứt mất nó. Chạy lại nguyên câu này với bộ lọc hỏng đó thì <i>vẫn</i> ra đúng 3 dòng, vì cạnh trọng số 0 chỉ đổi đỉnh được chọn THỨ TƯ — mà đề này dừng ở đỉnh thứ ba. Dù vậy vẫn nên bỏ qua đường chéo theo chỉ số (<code>w != u</code>): những đề anh em hỏi tới 4 đỉnh thì bộ lọc kia sai thật.</p>`,
  ),
  rubric: [
    { id: 'dijkstra_core', criterion: B('Implements Dijkstra correctly: labels start at infinity except the source, the unselected vertex with the smallest label is selected each round, and 99 is treated as infinity (no edge).', 'Cài Dijkstra đúng: nhãn khởi tạo vô cùng trừ đỉnh nguồn, mỗi vòng chọn đỉnh chưa chọn có nhãn nhỏ nhất, và coi 99 là vô cùng (không có cạnh).'), weight: 1, maxScore: 0.4 },
    { id: 'path_and_distance', criterion: B('Line 1 lists the vertices of the shortest path from C to F in order (needs a predecessor array), and line 2 is its total distance.', 'Dòng 1 liệt kê đúng thứ tự các đỉnh của đường đi ngắn nhất từ C tới F (cần mảng đỉnh-cha), và dòng 2 là tổng độ dài của nó.'), weight: 1, maxScore: 0.35 },
    { id: 'first3_selected', criterion: B('Line 3 lists the first 3 vertices selected into S for the run starting at B, in selection order and including B itself.', 'Dòng 3 liệt kê 3 đỉnh đầu tiên được chọn vào S của lượt chạy từ B, theo đúng thứ tự chọn và tính cả chính B.'), weight: 1, maxScore: 0.25 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE47',
    title: 'PE Đề 47 — Practical Exam (SP22 Demo)|||PE Đề 47 — Thi thực hành (SP22 Demo)',
    description: 'CSD201 PE (CODE): official Spring-2022 Demo paper, full 10-mark structure — MyList<Bird> (4), BSTree<Bird> keyed on rate (4), Graph BFS + Dijkstra (2). All 10 worked examples reproduced from the original FPT given projects by compiling and running javac/java. AI-graded.|||PE CSD201 (viết mã): đề Demo chính thức Spring 2022, cấu trúc đủ 10 điểm — MyList<Bird> (4), BSTree<Bird> khoá rate (4), Graph BFS + Dijkstra (2). Cả 10 ví dụ minh hoạ đã tái tạo từ project given gốc của FPT bằng cách biên dịch và chạy thật javac/java. Chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE47-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q2_1, q2_2, q2_3, q2_4, q3_1, q3_2],
  }],
};

const total = spec.exams[0].questions.reduce((s, q) => s + q.points, 0);
if (total !== spec.exams[0].totalPoints) throw new Error(`points ${total} != totalPoints ${spec.exams[0].totalPoints}`);
for (const q of spec.exams[0].questions) {
  const sum = q.rubric.reduce((s, r) => s + r.maxScore, 0);
  if (Math.abs(sum - 1) > 1e-9) throw new Error(`rubric maxScore sum ${sum} != 1`);
}

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
