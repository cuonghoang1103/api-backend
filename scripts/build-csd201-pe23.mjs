/**
 * build-csd201-pe23.mjs — sinh content/exams/CSD201-PE23.mjs.
 *
 * Nguồn thật: "Đề 23 - Đề Thi PE CSD201 - PE1 - FA2024" (FUOverflow).
 * Thư mục nguồn có 2 file: paper.pdf + conmeongungocdangyeu.zip.
 *
 * ✅ ARCHIVE KHỚP PAPER (đã đối chiếu, không phải trường hợp zip lạc đề như
 * mấy môn trước). paper.pdf là PDF ẢNH RASTER (pdftotext ra 2 byte) — đọc
 * bằng tool Read (render trang thành ảnh). Zip chỉ có ĐÚNG 1 file
 * `Main.java`, và đó là BÀI LÀM CỦA SINH VIÊN cho chính paper này: cùng 8
 * nhân viên, cùng ID/Name/Department/Seniority, cùng thứ tự chèn, cùng 6
 * method BST mà paper yêu cầu. Vậy đề này KHÔNG có "given project" — paper
 * ghi rõ "Submit 1 Java file only (Main.java)", tức viết từ đầu.
 * → Deck này KHÔNG có attachmentUrl (không có given materials để tải).
 *
 * SỐ LIỆU GỐC (100% từ paper.pdf, không tự chế):
 *   - Bộ 8 nhân viên và ĐÚNG thứ tự chèn:
 *       104 Nam Nguyen  HR      5
 *       102 Linh Phan   IT      1
 *       103 Minh Le     Finance 3
 *       101 Ngoc Nguyen IT      6
 *       107 Huong Pham  Finance 3
 *       106 Tuan Tran   Finance 2
 *       108 Hang Le     IT      4
 *       105 Hung Nguyen IT      5
 *   - Thang điểm: 1.(0.5) Employee · 2.(0.5) Node · 3.(6) BST gồm 6 method
 *     mỗi method 1 điểm · 4.(3) Main gồm 6 bước mỗi bước 0.5 → tổng 10.
 *   - Tên/chữ ký method: insert(Employee e), inOrder(), search(String name),
 *     delete(int id), checkBalance(), findMaxSeniority(); Node có 3 trường
 *     info/left/right; ID là khoá BST duy nhất.
 *   - Nội dung 6 bước của main().
 *
 * TỰ THIẾT KẾ (và vì sao):
 *   - paper KHÔNG quy định định dạng in ra (không có ví dụ output nào).
 *     Deck dùng ĐÚNG định dạng của archive bài làm sinh viên:
 *     `toString()` = "ID: x, Name: y, Department: z, Seniority: w", và các
 *     dòng tiêu đề "List of all employees:", "Search for Minh Le:",
 *     "BST balanced? ", "BST balanced after deleted? ",
 *     "Employee with highest seniority:". Đây là nguồn khả tín nhất có
 *     trong chính thư mục đề, chứ không phải tôi bịa.
 *   - starterCode (skeleton Main.java) là do tôi soạn: đề không phát file
 *     khung nào. Skeleton giữ nguyên tên lớp/chữ ký method của paper,
 *     thân method để trống, và ĐÃ COMPILE ĐƯỢC (javac) để thí sinh không
 *     mất thời gian sửa lỗi cú pháp của khung.
 *
 * ⚠️ HAI CHỖ ARCHIVE LỆCH PAPER — deck theo PAPER, không theo archive:
 *   1. paper: `Node` có trường **info**; archive đặt tên là `employee`,
 *      và còn thêm trường thứ 4 `height` mà paper không nhắc.
 *   2. paper: `boolean checkBalance()`; archive đặt tên `isBalanced()`.
 *
 * ⚠️ LỖI THẬT TRONG BÀI LÀM CỦA ARCHIVE (đã CHỨNG MINH bằng chạy thật, không
 * phải đọc mã rồi đoán): archive lưu `height` vào node lúc insert nhưng
 * KHÔNG cập nhật lại sau `delete` → chiều cao bị cũ. Trên chính dữ liệu của
 * đề nó vẫn ra đúng (true rồi false) nên lỗi không lộ. Probe:
 *   insert 50,30,70,20,40,60,80,10 rồi delete(10), delete(40)
 *   → cây thật là 50(30(20), 70(60,80)) = CÂN BẰNG
 *   → archive `isBalanced()` trả **false** (SAI); bản tham chiếu của deck
 *     tính chiều cao đệ quy trả **true** (ĐÚNG).
 * Vì thế sampleSolution của deck tính height ĐỆ QUY, và rubric câu
 * checkBalance chấm riêng điểm "chiều cao phải đúng sau khi xoá".
 *
 * ĐÃ VERIFY THẬT (javac + java, /usr/bin, không chỉ đọc mắt):
 *   - `javac` skeleton  → OK (compile sạch)
 *   - `javac` + `java` sampleSolution → OK
 *   - `javac` + `java` Main.java gốc trong archive → OK
 *   - `diff` output sampleSolution vs output archive → GIỐNG HỆT (0 dòng lệch)
 *   - probe cấu trúc cây: level-order = 104 / 102 107 / 101 103 106 108 / 105
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE23.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE23.mjs');

// Một trường song ngữ hay được ghép từ những mảnh mà bản thân mảnh đó ĐÃ là
// chuỗi song ngữ — hoặc nhét vào trong B() (`B(scenario + task_en, ...)`), hoặc
// nối ở ngoài (`prompt: SCENARIO + B(task_en, task_vi)`). Cả hai kiểu đều làm
// một trường mang 2-5 dấu "|||", trong khi pickLang() (frontend/src/lib/utils.ts)
// chỉ tách ở dấu ĐẦU TIÊN — hậu quả: người đọc bản tiếng Việt lãnh nguyên cả
// đoạn tiếng Anh, kèm dấu "|||" hiện ra màn hình.
//
// KHÔNG tách được bằng "tiền tố chung của hai vế": phần mở đầu của task tiếng
// Anh và tiếng Việt cũng trùng nhau ("Câu 1: addLast() - 1 " rồi mới mark/điểm)
// nên tách kiểu đó sẽ cắt cụt vế Anh. Nên B() ghi nhớ mọi chuỗi song ngữ chính
// nó đã tạo; gặp lại chuỗi đó ở bất kỳ đâu thì thay bằng đúng vế cần dùng —
// ranh giới biết chính xác, không phải suy đoán. __biNormalize() quét lần cuối
// toàn bộ spec trước khi ghi, bắt nốt kiểu nối ở ngoài B().
const __biReg = [];
const __biResolve = (s, side) => {
  let out = s;
  for (let guard = 0; guard < 40; guard++) {
    const hit = __biReg
      .filter((r) => out.includes(r))
      .sort((a, b) => b.length - a.length)[0];
    if (!hit) return out;
    const k = hit.indexOf('|||');
    out = out.split(hit).join(side === 'en' ? hit.slice(0, k) : hit.slice(k + 3));
  }
  throw new Error('B(): gỡ ||| lồng nhau không hội tụ');
};
const B = (en, vi) => {
  const out = `${__biResolve(en, 'en')}|||${__biResolve(vi, 'vi')}`;
  if ((out.match(/\|\|\|/g) || []).length !== 1) {
    throw new Error('B(): còn dấu ||| lồng nhau chưa gỡ được — kiểm tay chỗ gọi B()');
  }
  __biReg.push(out);
  return out;
};
const __biNormalize = (v) => {
  if (typeof v === 'string') {
    if ((v.match(/\|\|\|/g) || []).length <= 1) return v;
    const out = `${__biResolve(v, 'en')}|||${__biResolve(v, 'vi')}`;
    if ((out.match(/\|\|\|/g) || []).length !== 1) {
      throw new Error('__biNormalize(): trường vẫn còn ||| lồng nhau: ' + v.slice(0, 120));
    }
    return out;
  }
  if (Array.isArray(v)) return v.map(__biNormalize);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, __biNormalize(x)]));
  }
  return v;
};
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

// ---------------------------------------------------------------------------
// Mã nguồn Java — dùng String.raw để KHÔNG nuốt dấu \ trong "\nSearch for..."
// (template literal thường sẽ biến \n thành xuống dòng thật, hỏng mã Java).
// ---------------------------------------------------------------------------

const STARTER = String.raw`/*
 * CSD201 PE - FA2024 - PE1
 * Submit 1 Java file only (Main.java).
 * Luu y: KHONG dung tieng Viet co dau trong bai lam.
 *
 * Dataset (8 employees, insert in exactly this order):
 *   104 Nam Nguyen   HR        5
 *   102 Linh Phan    IT        1
 *   103 Minh Le      Finance   3
 *   101 Ngoc Nguyen  IT        6
 *   107 Huong Pham   Finance   3
 *   106 Tuan Tran    Finance   2
 *   108 Hang Le      IT        4
 *   105 Hung Nguyen  IT        5
 */

// ============ Question 1 (0.5 mark): Employee class ============
// Encapsulate id (int, unique - the BST key), name (String),
// department (String), seniority (int). Add constructor(s),
// getters/setters and toString().
class Employee {
    //------ Start your code here --------------------------------------------

    //------ End your code here ----------------------------------------------
}

// ============ Question 2 (0.5 mark): Node class ============
// Fields: info (an Employee object), left, right (BST links).
class Node {
    //------ Start your code here --------------------------------------------

    //------ End your code here ----------------------------------------------
}

// ============ Question 3 (6 marks): BST class ============
class BST {
    //------ declare the root here -------------------------------------------

    // ---- 3.1 insert (1 mark): insert a new Employee by ID ----
    public void insert(Employee e) {
        //------ Start your code here ----------------------------------------

        //------ End your code here ------------------------------------------
    }

    // ---- 3.2 inOrder (1 mark): traverse in-order and print each employee ----
    public void inOrder() {
        //------ Start your code here ----------------------------------------

        //------ End your code here ------------------------------------------
    }

    // ---- 3.3 search (1 mark): find and return the employee with the given name ----
    public Employee search(String name) {
        //------ Start your code here ----------------------------------------

        //------ End your code here ------------------------------------------
        return null;
    }

    // ---- 3.4 delete (1 mark): remove the node with the given ID ----
    public void delete(int id) {
        //------ Start your code here ----------------------------------------

        //------ End your code here ------------------------------------------
    }

    // ---- 3.5 checkBalance (1 mark): |h(left) - h(right)| <= 1 for ALL nodes ----
    public boolean checkBalance() {
        //------ Start your code here ----------------------------------------

        //------ End your code here ------------------------------------------
        return false;
    }

    // ---- 3.6 findMaxSeniority (1 mark): employee with the highest seniority ----
    public Employee findMaxSeniority() {
        //------ Start your code here ----------------------------------------

        //------ End your code here ------------------------------------------
        return null;
    }
}

// ============ Question 4 (3 marks): Main class ============
public class Main {
    public static void main(String[] args) {
        //------ Start your code here ----------------------------------------
        // 1. build a BST and insert all 8 employees of the dataset above
        // 2. run in-order traversal and print all employees
        // 3. look up the employee named "Minh Le" and print the result
        // 4. call checkBalance() and print whether the BST is balanced
        // 5. delete the employee with ID 108, call checkBalance() again and print
        // 6. call findMaxSeniority() and print the employee with the highest seniority

        //------ End your code here ------------------------------------------
    }
}
`;

const SOLUTION = String.raw`/*
 * CSD201 PE - FA2024 - PE1
 * Submit 1 Java file only (Main.java).
 * Luu y: KHONG dung tieng Viet co dau trong bai lam.
 */

// ============ Question 1 (0.5 mark): Employee class ============
class Employee {
    private int id;
    private String name;
    private String department;
    private int seniority;

    public Employee() {
    }

    public Employee(int id, String name, String department, int seniority) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.seniority = seniority;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getSeniority() {
        return seniority;
    }

    public void setSeniority(int seniority) {
        this.seniority = seniority;
    }

    @Override
    public String toString() {
        return "ID: " + id + ", Name: " + name + ", Department: " + department + ", Seniority: " + seniority;
    }
}

// ============ Question 2 (0.5 mark): Node class ============
class Node {
    Employee info;
    Node left;
    Node right;

    public Node(Employee info) {
        this.info = info;
        this.left = null;
        this.right = null;
    }
}

// ============ Question 3 (6 marks): BST class ============
class BST {
    Node root;

    public BST() {
        this.root = null;
    }

    // ---- 3.1 insert (1 mark) ----
    public void insert(Employee e) {
        root = insertRec(root, e);
    }

    private Node insertRec(Node p, Employee e) {
        if (p == null) return new Node(e);
        if (e.getId() < p.info.getId()) p.left = insertRec(p.left, e);
        else if (e.getId() > p.info.getId()) p.right = insertRec(p.right, e);
        // equal id: the ID is a unique key, so do nothing
        return p;
    }

    // ---- 3.2 inOrder (1 mark) ----
    public void inOrder() {
        inOrderRec(root);
    }

    private void inOrderRec(Node p) {
        if (p == null) return;
        inOrderRec(p.left);
        System.out.println(p.info);
        inOrderRec(p.right);
    }

    // ---- 3.3 search by name (1 mark) ----
    public Employee search(String name) {
        return searchRec(root, name);
    }

    private Employee searchRec(Node p, String name) {
        if (p == null) return null;
        if (p.info.getName().equals(name)) return p.info;
        Employee found = searchRec(p.left, name);
        if (found != null) return found;
        return searchRec(p.right, name);
    }

    // ---- 3.4 delete by id (1 mark) ----
    public void delete(int id) {
        root = deleteRec(root, id);
    }

    private Node deleteRec(Node p, int id) {
        if (p == null) return null;
        if (id < p.info.getId()) {
            p.left = deleteRec(p.left, id);
        } else if (id > p.info.getId()) {
            p.right = deleteRec(p.right, id);
        } else {
            if (p.left == null) return p.right;
            if (p.right == null) return p.left;
            Node successor = getMin(p.right);
            p.info = successor.info;
            p.right = deleteRec(p.right, successor.info.getId());
        }
        return p;
    }

    private Node getMin(Node p) {
        while (p.left != null) p = p.left;
        return p;
    }

    // ---- 3.5 checkBalance (1 mark) ----
    public boolean checkBalance() {
        return checkBalanceRec(root);
    }

    private boolean checkBalanceRec(Node p) {
        if (p == null) return true;
        int diff = height(p.left) - height(p.right);
        if (diff < -1 || diff > 1) return false;
        return checkBalanceRec(p.left) && checkBalanceRec(p.right);
    }

    // height is recomputed from the links every time, so it stays correct
    // after delete() as well (a cached height field would go stale).
    private int height(Node p) {
        if (p == null) return 0;
        int hl = height(p.left);
        int hr = height(p.right);
        return 1 + Math.max(hl, hr);
    }

    // ---- 3.6 findMaxSeniority (1 mark) ----
    public Employee findMaxSeniority() {
        return findMaxSeniorityRec(root);
    }

    private Employee findMaxSeniorityRec(Node p) {
        if (p == null) return null;
        Employee best = p.info;
        Employee leftBest = findMaxSeniorityRec(p.left);
        Employee rightBest = findMaxSeniorityRec(p.right);
        if (leftBest != null && leftBest.getSeniority() > best.getSeniority()) best = leftBest;
        if (rightBest != null && rightBest.getSeniority() > best.getSeniority()) best = rightBest;
        return best;
    }
}

// ============ Question 4 (3 marks): Main class ============
public class Main {
    public static void main(String[] args) {
        BST bst = new BST();

        // 4.1 build the tree from the dataset
        bst.insert(new Employee(104, "Nam Nguyen", "HR", 5));
        bst.insert(new Employee(102, "Linh Phan", "IT", 1));
        bst.insert(new Employee(103, "Minh Le", "Finance", 3));
        bst.insert(new Employee(101, "Ngoc Nguyen", "IT", 6));
        bst.insert(new Employee(107, "Huong Pham", "Finance", 3));
        bst.insert(new Employee(106, "Tuan Tran", "Finance", 2));
        bst.insert(new Employee(108, "Hang Le", "IT", 4));
        bst.insert(new Employee(105, "Hung Nguyen", "IT", 5));

        // 4.2 in-order traversal
        System.out.println("List of all employees:");
        bst.inOrder();

        // 4.3 search "Minh Le"
        System.out.println("\nSearch for Minh Le:");
        Employee found = bst.search("Minh Le");
        if (found != null) System.out.println("Found: " + found);
        else System.out.println("Employee not found");

        // 4.4 check balance
        System.out.println("\nBST balanced? " + bst.checkBalance());

        // 4.5 delete id 108, then check balance again
        System.out.println("\nDelete employee with ID 108 and Print");
        bst.delete(108);
        System.out.println("Updated list of employees:");
        bst.inOrder();
        System.out.println("BST balanced after deleted? " + bst.checkBalance());

        // 4.6 employee with highest seniority
        System.out.println("\nEmployee with highest seniority:");
        Employee maxSeniority = bst.findMaxSeniority();
        if (maxSeniority != null) System.out.println(maxSeniority);
    }
}
`;

// ---------------------------------------------------------------------------
// Các mảnh output đã ĐO THẬT bằng `java Main` (không gõ tay từ trí nhớ)
// ---------------------------------------------------------------------------

const IN_ORDER_8 = `ID: 101, Name: Ngoc Nguyen, Department: IT, Seniority: 6
ID: 102, Name: Linh Phan, Department: IT, Seniority: 1
ID: 103, Name: Minh Le, Department: Finance, Seniority: 3
ID: 104, Name: Nam Nguyen, Department: HR, Seniority: 5
ID: 105, Name: Hung Nguyen, Department: IT, Seniority: 5
ID: 106, Name: Tuan Tran, Department: Finance, Seniority: 2
ID: 107, Name: Huong Pham, Department: Finance, Seniority: 3
ID: 108, Name: Hang Le, Department: IT, Seniority: 4`;

const IN_ORDER_7 = `ID: 101, Name: Ngoc Nguyen, Department: IT, Seniority: 6
ID: 102, Name: Linh Phan, Department: IT, Seniority: 1
ID: 103, Name: Minh Le, Department: Finance, Seniority: 3
ID: 104, Name: Nam Nguyen, Department: HR, Seniority: 5
ID: 105, Name: Hung Nguyen, Department: IT, Seniority: 5
ID: 106, Name: Tuan Tran, Department: Finance, Seniority: 2
ID: 107, Name: Huong Pham, Department: Finance, Seniority: 3`;

const TREE_SHAPE = `Level order after inserting all 8 employees (verified by running):
level 0:  104
level 1:  102  107
level 2:  101  103  106  108
level 3:  105

              104
            /     \\
         102       107
        /   \\     /   \\
     101    103 106    108
                /
             105`;

const FULL_MAIN_OUTPUT = `List of all employees:
${IN_ORDER_8}

Search for Minh Le:
Found: ID: 103, Name: Minh Le, Department: Finance, Seniority: 3

BST balanced? true

Delete employee with ID 108 and Print
Updated list of employees:
${IN_ORDER_7}
BST balanced after deleted? false

Employee with highest seniority:
ID: 101, Name: Ngoc Nguyen, Department: IT, Seniority: 6`;

// ---------------------------------------------------------------------------

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Fall 2024, PE1). Read all the instructions carefully before you start coding.</p>
   <p><strong>Submit 1 Java file only (Main.java).</strong> This paper has NO given NetBeans project — you write every class from scratch in a single file. Software: NetBeans IDE 8.x / Java JDK 1.8. Avoid accented Vietnamese in your code and comments.</p>
   <p>Total: 10 marks. Build a Binary Search Tree (BST) to manage employee records. Each employee has: <b>ID</b> (integer, unique — used as the BST key), <b>Name</b> (String), <b>Department</b> (String), <b>Seniority</b> (integer, in years).</p>
   <p><b>Dataset (insert in exactly this order):</b> 104 Nam Nguyen / HR / 5 &middot; 102 Linh Phan / IT / 1 &middot; 103 Minh Le / Finance / 3 &middot; 101 Ngoc Nguyen / IT / 6 &middot; 107 Huong Pham / Finance / 3 &middot; 106 Tuan Tran / Finance / 2 &middot; 108 Hang Le / IT / 4 &middot; 105 Hung Nguyen / IT / 5.</p>
   <p><b>Note on the printing format:</b> the original paper does not prescribe any output format. This exam room uses the format of the sample answer shipped in the same source folder, i.e. <code>toString()</code> returning "ID: 104, Name: Nam Nguyen, Department: HR, Seniority: 5". A different but consistent format is not wrong; the expected outputs below are shown in this one.</p>
   <p>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into each code box — it is graded by AI against the rubric. You can build and run the same code on your own machine with <code>javac Main.java</code> and <code>java Main</code>, and cross-check against the expected output shown with each question.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Fall 2024, PE1). Đọc kỹ toàn bộ hướng dẫn trước khi bắt đầu viết mã.</p>
   <p><strong>Chỉ nộp 1 file Java duy nhất (Main.java).</strong> Đề này KHÔNG có project NetBeans cho sẵn — bạn tự viết mọi lớp từ đầu trong một file. Phần mềm: NetBeans IDE 8.x / Java JDK 1.8. Không dùng tiếng Việt có dấu trong mã và chú thích.</p>
   <p>Tổng: 10 điểm. Xây dựng cây nhị phân tìm kiếm (BST) để quản lý hồ sơ nhân viên. Mỗi nhân viên có: <b>ID</b> (số nguyên, duy nhất — dùng làm khoá BST), <b>Name</b> (String), <b>Department</b> (String), <b>Seniority</b> (số năm thâm niên).</p>
   <p><b>Dữ liệu (chèn đúng theo thứ tự này):</b> 104 Nam Nguyen / HR / 5 &middot; 102 Linh Phan / IT / 1 &middot; 103 Minh Le / Finance / 3 &middot; 101 Ngoc Nguyen / IT / 6 &middot; 107 Huong Pham / Finance / 3 &middot; 106 Tuan Tran / Finance / 2 &middot; 108 Hang Le / IT / 4 &middot; 105 Hung Nguyen / IT / 5.</p>
   <p><b>Lưu ý về định dạng in:</b> đề gốc không quy định định dạng output nào cả. Phòng thi này dùng định dạng của bài làm mẫu nằm cùng thư mục nguồn, tức <code>toString()</code> trả về "ID: 104, Name: Nam Nguyen, Department: HR, Seniority: 5". Bạn dùng định dạng khác mà nhất quán thì không sai; các output kỳ vọng bên dưới chỉ trình bày theo định dạng này.</p>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build và chạy đúng đoạn mã đó trên máy mình bằng <code>javac Main.java</code> và <code>java Main</code>, rồi đối chiếu với output kỳ vọng đi kèm từng câu.</p>`,
);

const scenario = B(
  `<p><strong>Scenario:</strong> build a Binary Search Tree keyed by employee ID to manage the 8-employee dataset given in the instructions above. Everything goes into one file, Main.java. Each question below is graded independently against its own expected result.</p>`,
  `<p><strong>Bối cảnh:</strong> xây dựng cây nhị phân tìm kiếm khoá theo ID nhân viên để quản lý bộ 8 nhân viên cho ở phần hướng dẫn trên. Tất cả nằm trong một file Main.java. Mỗi câu dưới đây được chấm độc lập theo đúng kết quả kỳ vọng của nó.</p>`,
);

const q1 = {
  kind: 'CODE', points: 0.5, language: 'java',
  prompt: B(
    scenario + `<p><strong>Question 1 – 0.5 mark: the Employee class</strong></p><ul><li>File: Main.java</li><li>Class to write: <code>Employee</code></li><li>Task: create an <code>Employee</code> class that encapsulates the <b>ID</b>, <b>Name</b>, <b>Department</b> and <b>Seniority</b> attributes. "Encapsulates" means the fields are private and are reached through getters/setters. Add a constructor taking all four values (the main method needs it) and a <code>toString()</code> so an employee can be printed.</li></ul>`,
    scenario + `<p><strong>Câu 1 – 0.5 điểm: lớp Employee</strong></p><ul><li>File: Main.java</li><li>Lớp cần viết: <code>Employee</code></li><li>Nhiệm vụ: tạo lớp <code>Employee</code> đóng gói 4 thuộc tính <b>ID</b>, <b>Name</b>, <b>Department</b>, <b>Seniority</b>. "Đóng gói" nghĩa là các trường để private và truy cập qua getter/setter. Thêm hàm dựng nhận đủ 4 giá trị (main cần dùng) và <code>toString()</code> để in được một nhân viên.</li></ul>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: `System.out.println(new Employee(104, "Nam Nguyen", "HR", 5));

ID: 104, Name: Nam Nguyen, Department: HR, Seniority: 5`,
  explanation: B(
    `<p>Verified by compiling and running the reference solution. Note that ID is the BST key and the paper states it is unique, so the class only has to store it — the uniqueness is enforced by the insert method in question 3. The exact wording of toString() is this exam room's choice (the original paper prescribes no output format); any consistent format that shows all four attributes is acceptable.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu. Lưu ý ID là khoá BST và đề nói rõ nó duy nhất, nên lớp này chỉ cần lưu — tính duy nhất do method insert ở câu 3 bảo đảm. Câu chữ chính xác của toString() là lựa chọn của phòng thi này (đề gốc không quy định định dạng output nào); mọi định dạng nhất quán mà hiện đủ 4 thuộc tính đều được chấp nhận.</p>`,
  ),
  rubric: [
    { id: 'fields', criterion: B('Declares the four attributes id, name, department, seniority with correct types (int, String, String, int) and private access.', 'Khai báo đủ 4 thuộc tính id, name, department, seniority đúng kiểu (int, String, String, int) và để private.'), weight: 1, maxScore: 0.25 },
    { id: 'accessors', criterion: B('Provides a full-argument constructor plus getters/setters (and a toString) so the rest of the program can build and print an Employee.', 'Có hàm dựng đủ tham số cùng getter/setter (và toString) để phần còn lại của chương trình dựng và in được Employee.'), weight: 1, maxScore: 0.25 },
  ],
};

const q2 = {
  kind: 'CODE', points: 0.5, language: 'java',
  prompt: B(
    `<p><strong>Question 2 – 0.5 mark: the Node class</strong></p><ul><li>File: Main.java</li><li>Class to write: <code>Node</code></li><li>Task: create a <code>Node</code> class with fields <b>info</b> (an Employee object), <b>left</b> and <b>right</b> (the pointers used for BST linking). A constructor taking an Employee and leaving both links null makes the rest of the code much shorter.</li></ul><p><b>Note:</b> the sample answer shipped with this paper names the field <code>employee</code> and adds a fourth field <code>height</code>. The paper itself asks for exactly <code>info</code>, <code>left</code>, <code>right</code>, so that is what this exam room grades — and question 7 explains why the extra cached <code>height</code> field is in fact a trap.</p>`,
    `<p><strong>Câu 2 – 0.5 điểm: lớp Node</strong></p><ul><li>File: Main.java</li><li>Lớp cần viết: <code>Node</code></li><li>Nhiệm vụ: tạo lớp <code>Node</code> với các trường <b>info</b> (một đối tượng Employee), <b>left</b> và <b>right</b> (con trỏ dùng để liên kết BST). Có hàm dựng nhận một Employee và để hai liên kết bằng null sẽ giúp phần mã còn lại ngắn hơn nhiều.</li></ul><p><b>Lưu ý:</b> bài làm mẫu đi kèm đề đặt tên trường là <code>employee</code> và thêm trường thứ tư <code>height</code>. Chính đề gốc yêu cầu đúng ba trường <code>info</code>, <code>left</code>, <code>right</code>, nên phòng thi này chấm theo đề — và câu 7 sẽ giải thích vì sao trường <code>height</code> lưu sẵn kia thực ra là một cái bẫy.</p>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: `After the 8 inserts of question 3, the links must satisfy (verified by running):

root.info       -> ID: 104, Name: Nam Nguyen, Department: HR, Seniority: 5
root.left.info  -> ID: 102, Name: Linh Phan, Department: IT, Seniority: 1
root.right.info -> ID: 107, Name: Huong Pham, Department: Finance, Seniority: 3`,
  explanation: B(
    `<p>Node holds no logic of its own, so it produces no output on its own — its correctness only becomes visible once the tree is built. The three link values above were read back from a real run of the reference solution after inserting the dataset. Keep left and right initialised to null; forgetting that is harmless in Java (fields default to null) but writing an explicit constructor makes insert() cleaner.</p>`,
    `<p>Node không chứa logic nào nên tự nó không in ra gì — tính đúng đắn chỉ lộ ra khi cây đã được dựng. Ba giá trị liên kết ở trên được đọc lại từ một lần chạy thật lời giải tham chiếu sau khi chèn xong bộ dữ liệu. Nên để left và right khởi tạo null; quên cũng không sao trong Java (trường mặc định là null) nhưng viết hàm dựng tường minh sẽ làm insert() gọn hơn.</p>`,
  ),
  rubric: [
    { id: 'info_field', criterion: B('Has a field holding an Employee object (named info, as the paper asks).', 'Có trường chứa đối tượng Employee (đặt tên info đúng như đề yêu cầu).'), weight: 1, maxScore: 0.25 },
    { id: 'links', criterion: B('Has the two BST link fields left and right of type Node.', 'Có hai trường liên kết BST left và right kiểu Node.'), weight: 1, maxScore: 0.25 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Question 3 – 1 mark: BST.insert()</strong></p><ul><li>File: Main.java</li><li>Class: <code>BST</code> (a Binary Search Tree keyed by employee ID)</li><li>Method to complete: <code>void insert(Employee e)</code></li><li>Task: insert a new Employee into the BST according to the ID. Smaller IDs go left, larger IDs go right. The ID is a unique key, so an ID already present must not create a duplicate node.</li></ul>`,
    `<p><strong>Câu 3 – 1 điểm: BST.insert()</strong></p><ul><li>File: Main.java</li><li>Lớp: <code>BST</code> (cây nhị phân tìm kiếm khoá theo ID nhân viên)</li><li>Method cần hoàn thiện: <code>void insert(Employee e)</code></li><li>Nhiệm vụ: chèn một Employee mới vào BST theo ID. ID nhỏ hơn đi sang trái, ID lớn hơn đi sang phải. ID là khoá duy nhất nên một ID đã có không được tạo thêm node trùng.</li></ul>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: TREE_SHAPE,
  explanation: B(
    `<p>Verified by compiling the reference solution and printing the tree level by level. Walk through the insert order 104, 102, 103, 101, 107, 106, 108, 105: 104 becomes the root; 102 goes left of it; 103 is less than 104 then greater than 102, so it is the right child of 102; 101 is the left child of 102; 107 goes right of the root; 106 is less than 107 so it is 107's left child; 108 is greater than 107 so it is 107's right child; and 105 is less than 107 then less than 106, so it is 106's left child. That gives exactly the shape above.</p>`,
    `<p>Đã kiểm bằng cách biên dịch lời giải tham chiếu và in cây theo từng mức. Lần theo thứ tự chèn 104, 102, 103, 101, 107, 106, 108, 105: 104 thành gốc; 102 sang trái gốc; 103 nhỏ hơn 104 rồi lớn hơn 102 nên là con phải của 102; 101 là con trái của 102; 107 sang phải gốc; 106 nhỏ hơn 107 nên là con trái của 107; 108 lớn hơn 107 nên là con phải của 107; còn 105 nhỏ hơn 107 rồi nhỏ hơn 106 nên là con trái của 106. Ra đúng hình dạng ở trên.</p>`,
  ),
  rubric: [
    { id: 'bst_placement', criterion: B('Compares by Employee ID and descends left for a smaller ID, right for a larger ID, attaching the new node at the first empty link.', 'So sánh theo ID của Employee, đi trái khi ID nhỏ hơn, đi phải khi ID lớn hơn, và gắn node mới vào liên kết trống đầu tiên.'), weight: 1, maxScore: 0.6 },
    { id: 'root_and_dup', criterion: B('Handles the empty tree (sets root) and does not create a duplicate node for an ID that already exists.', 'Xử lý được cây rỗng (gán root) và không tạo node trùng cho ID đã tồn tại.'), weight: 1, maxScore: 0.4 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Question 4 – 1 mark: BST.inOrder()</strong></p><ul><li>File: Main.java</li><li>Method to complete: <code>void inOrder()</code></li><li>Task: traverse the tree in in-order (left subtree, then the node, then the right subtree) and print each employee. Because the BST is keyed by ID, this prints the employees in ascending ID order.</li></ul>`,
    `<p><strong>Câu 4 – 1 điểm: BST.inOrder()</strong></p><ul><li>File: Main.java</li><li>Method cần hoàn thiện: <code>void inOrder()</code></li><li>Nhiệm vụ: duyệt cây theo thứ tự giữa (cây con trái, rồi chính node, rồi cây con phải) và in từng nhân viên. Vì BST khoá theo ID nên phép duyệt này in ra nhân viên theo ID tăng dần.</li></ul>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: IN_ORDER_8,
  explanation: B(
    `<p>Verified by compiling and running the reference solution — this is the exact output of bst.inOrder() on the full 8-employee tree. In-order on a BST always yields the keys in ascending order, which is why the IDs come out 101 through 108 even though they were inserted in the scrambled order 104, 102, 103, 101, 107, 106, 108, 105. A quick self-check for your own code: if the IDs are not sorted, your recursion is visiting the node before the left subtree, or skipping one of the two subtrees.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu — đây đúng là output của bst.inOrder() trên cây đủ 8 nhân viên. Duyệt giữa trên BST luôn cho khoá theo thứ tự tăng dần, nên ID ra từ 101 tới 108 dù được chèn theo thứ tự xáo trộn 104, 102, 103, 101, 107, 106, 108, 105. Cách tự kiểm nhanh: nếu ID không sắp thứ tự thì đệ quy của bạn đang thăm node trước cây con trái, hoặc bỏ sót một trong hai cây con.</p>`,
  ),
  rubric: [
    { id: 'order', criterion: B('Recursion visits left subtree, then the current node, then right subtree, in that order.', 'Đệ quy thăm cây con trái, rồi node hiện tại, rồi cây con phải, đúng thứ tự đó.'), weight: 1, maxScore: 0.6 },
    { id: 'base_and_print', criterion: B('Stops correctly at a null node and prints each employee once.', 'Dừng đúng ở node null và in mỗi nhân viên đúng một lần.'), weight: 1, maxScore: 0.4 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Question 5 – 1 mark: BST.search(String name)</strong></p><ul><li>File: Main.java</li><li>Method to complete: <code>Employee search(String name)</code></li><li>Task: find and return the employee with the given name, or null if there is none.</li></ul><p><b>Think before you code:</b> the tree is ordered by ID, not by name. Name is not the search key, so you cannot decide left-or-right from a name comparison — this search must visit the whole tree until it finds a match.</p>`,
    `<p><strong>Câu 5 – 1 điểm: BST.search(String name)</strong></p><ul><li>File: Main.java</li><li>Method cần hoàn thiện: <code>Employee search(String name)</code></li><li>Nhiệm vụ: tìm và trả về nhân viên có tên đã cho, hoặc null nếu không có.</li></ul><p><b>Nghĩ trước khi viết:</b> cây được sắp theo ID chứ không theo tên. Tên không phải khoá tìm kiếm nên bạn không thể dựa vào phép so sánh tên để quyết định rẽ trái hay rẽ phải — phép tìm này phải duyệt toàn cây cho tới khi gặp kết quả.</p>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: `Found: ID: 103, Name: Minh Le, Department: Finance, Seniority: 3`,
  explanation: B(
    `<p>Verified by compiling and running the reference solution with the paper's own query, "Minh Le". The common trap here is writing a normal BST descent that compares the name against the node's name and then goes left or right — that is wrong, because the ordering invariant of this tree is about IDs, and a name comparison tells you nothing about which subtree the name lives in. The correct shape is a full traversal that returns as soon as a node matches: check the current node, then recurse left, and if the left side returned null, recurse right. Also compare strings with equals(), not with ==.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu với đúng truy vấn của đề, "Minh Le". Bẫy hay gặp ở đây là viết kiểu đi xuống BST bình thường: so tên với tên của node rồi rẽ trái hoặc phải — như vậy là SAI, vì bất biến thứ tự của cây này là theo ID, và phép so sánh tên không cho biết gì về việc tên đó nằm ở cây con nào. Dạng đúng là duyệt toàn cây và trả về ngay khi có node khớp: kiểm node hiện tại, rồi đệ quy sang trái, nếu bên trái trả null thì đệ quy sang phải. Ngoài ra hãy so chuỗi bằng equals() chứ không dùng ==.</p>`,
  ),
  rubric: [
    { id: 'full_traversal', criterion: B('Searches the whole tree rather than descending as if name were the BST key, and returns null when no node matches.', 'Duyệt toàn cây thay vì đi xuống như thể name là khoá BST, và trả về null khi không node nào khớp.'), weight: 1, maxScore: 0.6 },
    { id: 'string_compare', criterion: B('Compares names with equals() and returns the matching Employee object itself.', 'So sánh tên bằng equals() và trả về đúng đối tượng Employee khớp.'), weight: 1, maxScore: 0.4 },
  ],
};

const q6 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Question 6 – 1 mark: BST.delete(int id)</strong></p><ul><li>File: Main.java</li><li>Method to complete: <code>void delete(int id)</code></li><li>Task: remove from the BST the node with the given ID, keeping the tree a valid BST afterwards. Handle all three cases: a leaf, a node with one child, and a node with two children (delete by copy — replace the node's info with its in-order successor, then delete that successor from the right subtree).</li></ul><p>The expected output below is the in-order traversal after the paper's own <code>delete(108)</code>.</p>`,
    `<p><strong>Câu 6 – 1 điểm: BST.delete(int id)</strong></p><ul><li>File: Main.java</li><li>Method cần hoàn thiện: <code>void delete(int id)</code></li><li>Nhiệm vụ: xoá khỏi BST node có ID đã cho, sao cho sau khi xoá cây vẫn là BST hợp lệ. Xử lý đủ ba trường hợp: node lá, node có một con, và node có hai con (xoá bằng cách chép — thay info của node bằng phần tử kế tiếp theo thứ tự giữa, rồi xoá phần tử kế tiếp đó khỏi cây con phải).</li></ul><p>Output kỳ vọng bên dưới là phép duyệt giữa sau lệnh <code>delete(108)</code> của chính đề.</p>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: IN_ORDER_7,
  explanation: B(
    `<p>Verified by compiling and running the reference solution. ID 108 is the right child of 107 and has no children of its own, so this particular deletion only exercises the leaf case and the tree shrinks to 7 employees. Do not let that fool you: the mark is for a delete that also handles the one-child and two-children cases, so write the full delete-by-copy version. Note the structural consequence, which question 7 depends on: removing 108 leaves node 107 with a left subtree of height 2 and no right subtree at all.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu. ID 108 là con phải của 107 và không có con nào, nên riêng lần xoá này chỉ chạm tới trường hợp node lá và cây rút còn 7 nhân viên. Đừng để điều đó đánh lừa: điểm chấm là cho một hàm delete xử lý được cả trường hợp một con và hai con, nên hãy viết bản xoá-bằng-cách-chép đầy đủ. Chú ý hệ quả về cấu trúc mà câu 7 sẽ dùng tới: bỏ 108 đi làm node 107 còn cây con trái cao 2 và không còn cây con phải nào.</p>`,
  ),
  rubric: [
    { id: 'locate', criterion: B('Descends by ID to locate the target node and rewires the parent link (or root) correctly for the leaf and one-child cases.', 'Đi xuống theo ID để tìm đúng node cần xoá và nối lại liên kết cha (hoặc root) đúng cho trường hợp node lá và node một con.'), weight: 1, maxScore: 0.5 },
    { id: 'two_children', criterion: B('Handles the two-children case by copying the in-order successor (leftmost node of the right subtree) and then deleting that successor.', 'Xử lý trường hợp hai con bằng cách chép phần tử kế tiếp theo thứ tự giữa (node trái nhất của cây con phải) rồi xoá phần tử kế tiếp đó.'), weight: 1, maxScore: 0.5 },
  ],
};

const q7 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Question 7 – 1 mark: BST.checkBalance()</strong></p><ul><li>File: Main.java</li><li>Method to complete: <code>boolean checkBalance()</code></li><li>Task: check whether the BST is balanced, meaning the height difference between the left and right subtrees is at most 1 <b>for every node</b>, not just for the root. Return true if it is balanced, false otherwise.</li></ul><p>The expected output below shows the two calls the paper asks for: once on the full tree, and once after deleting ID 108.</p><p><b>Warning about a shortcut that looks right:</b> a very common answer caches a height field inside every Node and updates it during insert. That passes on this dataset but is wrong in general, because delete() never refreshes those cached heights. See the explanation for a concrete input where it gives the wrong answer.</p>`,
    `<p><strong>Câu 7 – 1 điểm: BST.checkBalance()</strong></p><ul><li>File: Main.java</li><li>Method cần hoàn thiện: <code>boolean checkBalance()</code></li><li>Nhiệm vụ: kiểm tra BST có cân bằng không, tức chênh lệch chiều cao giữa cây con trái và cây con phải không quá 1 <b>ở MỌI node</b>, chứ không chỉ ở gốc. Trả về true nếu cân bằng, ngược lại false.</li></ul><p>Output kỳ vọng bên dưới cho thấy hai lần gọi mà đề yêu cầu: một lần trên cây đầy đủ, một lần sau khi xoá ID 108.</p><p><b>Cảnh báo về một lối tắt trông có vẻ đúng:</b> một câu trả lời rất phổ biến là lưu sẵn trường height trong mỗi Node và cập nhật nó lúc insert. Cách đó qua được bộ dữ liệu này nhưng sai về tổng quát, vì delete() không bao giờ làm mới các chiều cao đã lưu. Xem phần giải thích để thấy một dữ liệu cụ thể khiến nó cho kết quả sai.</p>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: `BST balanced? true

BST balanced after deleted? false`,
  explanation: B(
    `<p>Verified by compiling and running the reference solution. Before the deletion the subtree heights are: node 102 has 1 and 1, node 106 has 1 and 0, node 107 has 2 and 1, and the root 104 has 2 and 3 — every difference is at most 1, so the answer is true. After delete(108), node 107 keeps a left subtree of height 2 (106 with child 105) and loses its right subtree entirely, so the difference there becomes 2 and the answer turns false.</p><p>About the cached-height shortcut: this was tested, not guessed. Insert the IDs 50, 30, 70, 20, 40, 60, 80, 10 and then delete 10 and 40. The real tree is then 50 with children 30 (holding only 20) and 70 (holding 60 and 80), which is balanced, and a version that recomputes heights returns true. The sample answer that caches height at insert time returns false, because node 20 still carries the stale height 2 it had while 10 was its child. Recompute the height from the links each time and the method stays correct after any deletion.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu. Trước khi xoá, chiều cao hai cây con là: node 102 có 1 và 1, node 106 có 1 và 0, node 107 có 2 và 1, còn gốc 104 có 2 và 3 — mọi chênh lệch đều không quá 1 nên kết quả là true. Sau delete(108), node 107 vẫn giữ cây con trái cao 2 (106 với con 105) và mất hẳn cây con phải, nên chênh lệch ở đó thành 2 và kết quả chuyển thành false.</p><p>Về lối tắt lưu sẵn chiều cao: điều này đã được kiểm bằng cách chạy thật, không phải phỏng đoán. Chèn các ID 50, 30, 70, 20, 40, 60, 80, 10 rồi xoá 10 và 40. Cây thật khi đó là 50 với hai con 30 (chỉ còn 20) và 70 (giữ 60 và 80), tức CÂN BẰNG, và bản tính lại chiều cao trả về true. Còn bài làm mẫu lưu height lúc insert lại trả về false, vì node 20 vẫn mang chiều cao cũ bằng 2 từ hồi 10 còn là con nó. Cứ tính lại chiều cao từ liên kết mỗi lần thì method vẫn đúng sau mọi lần xoá.</p>`,
  ),
  rubric: [
    { id: 'every_node', criterion: B('Checks the height condition at every node, not only at the root.', 'Kiểm điều kiện chiều cao ở mọi node, không chỉ ở gốc.'), weight: 1, maxScore: 0.5 },
    { id: 'fresh_height', criterion: B('Computes subtree height from the actual links (so the result is still correct after a delete) and returns true for an empty subtree.', 'Tính chiều cao cây con từ liên kết thật (nên kết quả vẫn đúng sau khi xoá) và trả về true với cây con rỗng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q8 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Question 8 – 1 mark: BST.findMaxSeniority()</strong></p><ul><li>File: Main.java</li><li>Method to complete: <code>Employee findMaxSeniority()</code></li><li>Task: find and return the employee having the highest seniority value.</li></ul><p><b>Think before you code:</b> as in question 5, seniority is not the BST key — the tree is ordered by ID — so the rightmost node is not the answer. Every node has to be examined.</p><p>The expected output below is the value after the paper's delete(108), which is when main() calls this method.</p>`,
    `<p><strong>Câu 8 – 1 điểm: BST.findMaxSeniority()</strong></p><ul><li>File: Main.java</li><li>Method cần hoàn thiện: <code>Employee findMaxSeniority()</code></li><li>Nhiệm vụ: tìm và trả về nhân viên có thâm niên (seniority) cao nhất.</li></ul><p><b>Nghĩ trước khi viết:</b> giống câu 5, seniority không phải khoá BST — cây sắp theo ID — nên node phải nhất KHÔNG phải đáp án. Phải xét mọi node.</p><p>Output kỳ vọng bên dưới là giá trị sau lệnh delete(108) của đề, vì đó là lúc main() gọi method này.</p>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: `ID: 101, Name: Ngoc Nguyen, Department: IT, Seniority: 6`,
  explanation: B(
    `<p>Verified by compiling and running the reference solution. The seniorities left in the tree at that point are 6, 1, 3, 5, 5, 2 and 3, so the maximum is 6 and it belongs to Ngoc Nguyen (ID 101). Two details worth noticing: the answer happens to be the leftmost node, which is a coincidence of this data and not a rule you may rely on; and the highest seniority is unchanged by the deletion, since the removed employee 108 Hang Le had seniority 4. Guard against the empty tree by returning null.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu. Các giá trị seniority còn lại trong cây lúc đó là 6, 1, 3, 5, 5, 2 và 3, nên lớn nhất là 6 và thuộc về Ngoc Nguyen (ID 101). Hai chi tiết đáng để ý: đáp án tình cờ lại là node trái nhất, đó là ngẫu nhiên của bộ dữ liệu này chứ không phải quy luật để dựa vào; và thâm niên cao nhất không đổi sau khi xoá, vì nhân viên bị xoá là 108 Hang Le chỉ có thâm niên 4. Nhớ phòng trường hợp cây rỗng bằng cách trả về null.</p>`,
  ),
  rubric: [
    { id: 'visit_all', criterion: B('Examines every node (does not assume seniority follows the BST ordering) and returns null on an empty tree.', 'Xét mọi node (không giả định seniority tuân theo thứ tự BST) và trả về null khi cây rỗng.'), weight: 1, maxScore: 0.6 },
    { id: 'max_tracking', criterion: B('Correctly keeps the employee with the largest seniority across the node itself and both subtrees.', 'Giữ đúng nhân viên có seniority lớn nhất khi so giữa chính node và cả hai cây con.'), weight: 1, maxScore: 0.4 },
  ],
};

const q9 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(
    `<p><strong>Question 9 – 3 marks: the Main class</strong></p><ul><li>File: Main.java</li><li>Method to complete: <code>public static void main(String[] args)</code></li><li>Task: write a main method that does the following six things, each worth 0.5 mark:</li></ul><ol><li>Builds a BST and inserts all 8 employees from the dataset, in the given order.</li><li>Runs the in-order traversal and prints all employees.</li><li>Looks up the employee named "Minh Le" and prints the result.</li><li>Calls checkBalance() and prints whether the BST is balanced.</li><li>Deletes the employee with ID 108, calls checkBalance() again, and prints the result.</li><li>Calls findMaxSeniority() and prints the employee who has the highest seniority.</li></ol>`,
    `<p><strong>Câu 9 – 3 điểm: lớp Main</strong></p><ul><li>File: Main.java</li><li>Method cần hoàn thiện: <code>public static void main(String[] args)</code></li><li>Nhiệm vụ: viết hàm main làm đủ sáu việc sau, mỗi việc 0.5 điểm:</li></ul><ol><li>Dựng một BST và chèn đủ 8 nhân viên của bộ dữ liệu, đúng theo thứ tự đã cho.</li><li>Chạy duyệt giữa và in toàn bộ nhân viên.</li><li>Tra cứu nhân viên tên "Minh Le" và in kết quả.</li><li>Gọi checkBalance() và in ra cây có cân bằng hay không.</li><li>Xoá nhân viên có ID 108, gọi lại checkBalance() và in kết quả.</li><li>Gọi findMaxSeniority() và in ra nhân viên có thâm niên cao nhất.</li></ol>`,
  ),
  starterCode: STARTER,
  sampleSolution: SOLUTION,
  expectedOutput: FULL_MAIN_OUTPUT,
  explanation: B(
    `<p>This is the complete console output of the reference solution, captured from a real run of javac Main.java followed by java Main. It was also compared line by line against the sample answer shipped in the same source folder as this paper and the two are identical.</p><p>The order of the six steps matters: findMaxSeniority() is called after the deletion, so it reports the maximum over the 7 remaining employees. Printing the updated list after the delete is not one of the six required steps, but it is included here because it makes the effect of the deletion visible, and the sample answer does the same. The exact headings ("List of all employees:", "Search for Minh Le:" and so on) are this exam room's choice, since the paper prescribes no output format — you will not lose marks for different wording as long as all six results are printed.</p>`,
    `<p>Đây là toàn bộ output console của lời giải tham chiếu, lấy từ một lần chạy thật javac Main.java rồi java Main. Nó cũng đã được so từng dòng với bài làm mẫu nằm cùng thư mục nguồn của đề này và hai bên giống hệt nhau.</p><p>Thứ tự sáu bước có ý nghĩa: findMaxSeniority() được gọi SAU khi xoá, nên nó báo giá trị lớn nhất trên 7 nhân viên còn lại. Việc in lại danh sách sau khi xoá không nằm trong sáu bước bắt buộc, nhưng ở đây có thêm vì nó làm lộ rõ tác dụng của phép xoá, và bài làm mẫu cũng làm vậy. Các dòng tiêu đề chính xác ("List of all employees:", "Search for Minh Le:" v.v.) là lựa chọn của phòng thi này, vì đề không quy định định dạng output — bạn dùng câu chữ khác vẫn không bị trừ điểm, miễn in đủ sáu kết quả.</p>`,
  ),
  rubric: [
    { id: 'build', criterion: B('Builds the BST and inserts all 8 employees of the dataset in the given order (0.5).', 'Dựng BST và chèn đủ 8 nhân viên của bộ dữ liệu theo đúng thứ tự đã cho (0.5).'), weight: 1, maxScore: 0.5 },
    { id: 'inorder', criterion: B('Runs the in-order traversal and prints all employees (0.5).', 'Chạy duyệt giữa và in toàn bộ nhân viên (0.5).'), weight: 1, maxScore: 0.5 },
    { id: 'search', criterion: B('Looks up "Minh Le" and prints the result, including a sensible message when nothing is found (0.5).', 'Tra cứu "Minh Le" và in kết quả, có thông báo hợp lý khi không tìm thấy (0.5).'), weight: 1, maxScore: 0.5 },
    { id: 'balance_before', criterion: B('Calls checkBalance() on the full tree and prints whether it is balanced (0.5).', 'Gọi checkBalance() trên cây đầy đủ và in ra cây có cân bằng hay không (0.5).'), weight: 1, maxScore: 0.5 },
    { id: 'delete_and_balance', criterion: B('Deletes ID 108, calls checkBalance() again and prints the new result (0.5).', 'Xoá ID 108, gọi lại checkBalance() và in kết quả mới (0.5).'), weight: 1, maxScore: 0.5 },
    { id: 'max_seniority', criterion: B('Calls findMaxSeniority() after the deletion and prints the employee with the highest seniority (0.5).', 'Gọi findMaxSeniority() sau khi xoá và in ra nhân viên có thâm niên cao nhất (0.5).'), weight: 1, maxScore: 0.5 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE23',
    title: 'PE Đề 23 — Practical Exam (FA2024, PE1)|||PE Đề 23 — Thi thực hành (FA2024, PE1)',
    description: 'CSD201 PE (CODE): build an employee-record BST from scratch in a single Main.java — Employee/Node classes, insert, in-order, search by name, delete, checkBalance, findMaxSeniority, plus the driver main; AI-graded.|||PE CSD201 (viết mã): tự viết từ đầu cây BST quản lý nhân viên trong một file Main.java — lớp Employee/Node, insert, duyệt giữa, tìm theo tên, xoá, checkBalance, findMaxSeniority, và hàm main điều khiển; chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5, q6, q7, q8, q9],
  }],
};

const sum = spec.exams[0].questions.reduce((a, q) => a + q.points, 0);
if (Math.abs(sum - spec.exams[0].totalPoints) > 1e-9) {
  throw new Error(`Tổng điểm câu = ${sum}, khác totalPoints = ${spec.exams[0].totalPoints}`);
}

fs.writeFileSync(OUT, `export default ${JSON.stringify(__biNormalize(spec), null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${sum} điểm`);
