/**
 * build-csd201-pe26.mjs — sinh content/exams/CSD201-PE26.mjs.
 *
 * Nguồn thật: "Đề 26 — Đề Thi PE CSD201 — SP 2024 — PE — Fuda"
 *   (PRACTICAL EXAM – CSD201 – SPRING 2024, Duration: 85 minutes).
 * Thư mục gốc có 2 file: paper.pdf và tham-khao.zip.
 *
 * ── paper.pdf ────────────────────────────────────────────────────────────
 * PDF là ẢNH RASTER (pdftotext ra 1 byte) — đã đọc bằng tool Read (render
 * trang thành ảnh). Đề KHÔNG có project NetBeans "given": nó ghi rõ
 * "Note: Submit 1 java file only!". Toàn bộ 5 câu viết trong MỘT file .java.
 *
 * Số liệu LẤY NGUYÊN TỪ ĐỀ (không tự chế):
 *   - Bảng 10 task (Task ID / Description / Priority):
 *       1 Security patch for vulnerability 100 · 2 Add login feature 80
 *       3 Update documentation 40 · 4 Fix email notification bug 90
 *       5 Refactor user management module 70 · 6 Implement data caching 85
 *       7 Optimize database queries 75 · 8 Write unit tests for new features 60
 *       9 Upgrade third-party libraries 50 · 10 Review and merge pull requests 55
 *   - Thang điểm từng câu, cộng đúng 10:
 *       1. Task class + compareTo ........................ 1
 *       2. main + Task[] tasks + in ra ................... 1
 *          + comment ưu/nhược của mảng ................... 1   (câu 2 = 2 điểm)
 *       3. MergeSort dùng compareTo ...................... 2.5
 *          + vì sao MergeSort stable, Quicksort không .... 0.5 (câu 3 = 3 điểm)
 *       4. class MaxHeap: void insert(Task) + Task remove() 2.5
 *          + ưu điểm của heap ............................ 0.5 (câu 4 = 3 điểm)
 *       5. main: tạo MaxHeap, insert từng task, remove & in  1
 *     ⇒ 1 + 2 + 3 + 3 + 1 = 10. Deck giữ ĐÚNG 5 câu theo đúng đánh số của đề.
 *
 * ⚠️ Đề KHÔNG in output mẫu ở đâu cả — nó chỉ mô tả yêu cầu. Vì vậy
 * `expectedOutput` của deck này là output THẬT của lời giải tham chiếu
 * (biên dịch + chạy thật bằng javac/java 21), KHÔNG phải chép từ đề. Thứ tự
 * kết quả thì hoàn toàn bị ép bởi dữ liệu gốc (10 priority đôi một khác nhau
 * ⇒ mảng sắp tăng dần theo priority và dãy remove khỏi max-heap giảm dần đều
 * là DUY NHẤT, đã đối chiếu tay). Thứ TỰ DO duy nhất là format `toString`
 * và mấy dòng tiêu đề "--- Qn: ... ---" — đề không quy định, deck tự chọn và
 * nói rõ trong rubric là không chấm format.
 *
 * ── tham-khao.zip ───────────────────────────────────────────────────────
 * Là BÀI LÀM CỦA SINH VIÊN (project NetBeans/IntelliJ "PE_CSD" gộp nhiều kỳ
 * thi; file của đề này là src/pe_csd/SP_24.java). ĐÃ biên dịch + chạy thật.
 * Nó chạy được, MergeSort và MaxHeap của nó cho kết quả ĐÚNG, nhưng có
 * những lỗi THẬT — deck này KHÔNG chép, đã sửa hết:
 *   1. Sai dữ liệu đề: task 4 gõ thiếu chữ, "Fix email notification" trong
 *      khi paper.pdf ghi "Fix email notification bug".
 *   2. Sai chính tả tên trường: `descreption` (đúng: description) — lỗi này
 *      lộ thẳng ra output vì nằm trong toString().
 *   3. Tiếng Việt CÓ DẤU trong comment (dòng 236, 244 của file gốc:
 *      "Nếu smallest không thay đổi…", "Hoán đổi và cập nhật chỉ số…").
 *      Đã CHỨNG MINH đây là lỗi thật: `javac -encoding US-ASCII` (mô phỏng
 *      máy có platform encoding không phải UTF-8, đúng cảnh báo kinh điển
 *      của đề CSD201) → "error: unmappable character (0xE1)". Lời giải của
 *      deck là ASCII THUẦN, đã kiểm bằng `file` và biên dịch lại với
 *      -encoding US-ASCII vẫn xanh.
 *   4. Nhãn output lẫn lộn ⇒ TRẢ LỜI SAI CÂU 5. Chỗ in dưới nhãn "cau 5:"
 *      thực ra là `maxheap.preOrder(0)` — một hàm duyệt preorder mà ĐỀ
 *      KHÔNG HỀ YÊU CẦU; còn vòng lặp remove-và-in (mới đúng là câu 5) lại
 *      nằm dưới nhãn "Cau 4:". Đã kiểm bằng cách chạy thật: dãy dưới
 *      "cau 5:" là 100,90,80,40,60,85,55,75,50,70 (thứ tự mảng heap, KHÔNG
 *      giảm dần) còn dãy dưới "Cau 4:" mới là 100,90,85,80,75,70,60,55,50,40.
 *   5. `preOrder(int i)` còn tự nó sai: nó dò lại index của node bằng cách
 *      quét tuyến tính so sánh getID() (O(n) mỗi node, hỏng ngay nếu có 2
 *      task trùng ID) và chặn biên bằng `if (i > size)` thay vì `>=`.
 *   6. Thiếu ý ăn điểm ở câu 2: đề bắt bàn về "access, insertion, deletion,
 *      AND SEARCH"; comment của sinh viên không nói gì về search.
 *   7. Lặt vặt: `new MaxHeap(11)` cho 10 task (số 11 vô nghĩa); `remove()`
 *      ném IllegalStateException còn main lại dùng do-while nên gọi remove()
 *      trước khi kiểm rỗng.
 *
 * ── Đã verify những gì ──────────────────────────────────────────────────
 *   - `starterCode` (khung đề, main rỗng): javac OK + java chạy OK (không in gì).
 *   - `sampleSolution`: javac OK + java chạy OK; output khớp đúng
 *     `expectedOutput` của cả 5 câu. Cả hai file đều biên dịch lại xanh với
 *     `-encoding US-ASCII`.
 *   - Bài sinh viên: javac OK + java chạy OK (dùng để soi lỗi ở trên).
 *   - Rà trùng: không deck CSD201-* nào chứa bộ dữ liệu này
 *     (grep "Security patch for vulnerability" → 0 kết quả).
 *
 * Không có attachment: đề không có project given, chỉ nộp 1 file .java.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE26.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE26.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

// ───────────────────────────────────────────────────────────────────────────
// Mã Java. Cả hai đã compile + chạy thật (javac/java 21, và lại với
// -encoding US-ASCII). KHÔNG có ký tự ngoài ASCII, không có backtick / ${ } /
// backslash nên nhúng thẳng vào template literal là an toàn.
// ───────────────────────────────────────────────────────────────────────────

const starterCode = `/**
 * CSD201 - PRACTICAL EXAM - SPRING 2024 (85 minutes)
 *
 * Note: Submit 1 java file only! Everything (the Task class, the MaxHeap class
 * and the main function) must live in THIS single file.
 *
 * Luu y:
 * 1. SV KHONG su dung tieng Viet co dau trong bai lam de tranh Error khi run.
 * 2. Neu khong tuan thu se nhan diem 0 (khong).
 */
public class TaskManagement {

    public static void main(String[] args) {

        // ================= Question 2 (1 mark) =============================
        // Initialise an array  Task[] tasks  holding the 10 tasks of the
        // dataset given in the exam paper, then demonstrate it by printing
        // out the tasks.
        //
        // ================= Question 2 (1 mark) =============================
        // Discuss - AS COMMENTS IN THE CODE - the advantages and the
        // disadvantages of using an array for task management, focusing on
        // the access, insertion, deletion and search operations.
        // ------------------------------------------------------------------
        // ------ Start your code here --------------------------------------



        // ------ End your code here ----------------------------------------
        // ------------------------------------------------------------------


        // ================= Question 3 (2.5 marks) ==========================
        // Still in the main function: sort this array of Task objects with
        // the MergeSort algorithm, using the compareTo method for comparison
        // (based on task priority). Print the sorted array.
        //
        // ================= Question 3 (0.5 marks) ==========================
        // Answer AS COMMENTS: why is MergeSort stable and why is Quicksort
        // not stable?
        // ------------------------------------------------------------------
        // ------ Start your code here --------------------------------------



        // ------ End your code here ----------------------------------------
        // ------------------------------------------------------------------


        // ================= Question 5 (1 mark) =============================
        // Now in the main function, initialize a MaxHeap object, insert the
        // tasks into the heap one by one, then remove and display each of
        // them using the heap's remove function.
        // ------------------------------------------------------------------
        // ------ Start your code here --------------------------------------



        // ------ End your code here ----------------------------------------
        // ------------------------------------------------------------------
    }

    // ================= Question 3 (2.5 marks) ==============================
    // Write the MergeSort helper method(s) over Task[] here.
    // ----------------------------------------------------------------------
    // ------ Start your code here ------------------------------------------



    // ------ End your code here --------------------------------------------
    // ----------------------------------------------------------------------
}

// ================= Question 1 (1 mark) ====================================
// Implement a Task class holding ID, description and priority attributes.
// Include a compareTo method to compare tasks based on their priority.
// --------------------------------------------------------------------------
// ------ Start your code here ----------------------------------------------



// ------ End your code here ------------------------------------------------
// --------------------------------------------------------------------------


// ================= Question 4 (2.5 marks) =================================
// Implement a max heap data structure  class MaxHeap  for efficient task
// prioritization, with a  void insert(Task element)  method that inserts
// tasks while maintaining the heap's property, and a  Task remove()  method
// that removes and returns the maximum element from the heap.
//
// ================= Question 4 (0.5 marks) =================================
// Answer AS COMMENTS: which are the main advantages of the heap data
// structure?
// --------------------------------------------------------------------------
// ------ Start your code here ----------------------------------------------



// ------ End your code here ------------------------------------------------
// --------------------------------------------------------------------------
`;

const sampleSolution = `/**
 * CSD201 - PRACTICAL EXAM - SPRING 2024 (85 minutes)
 *
 * Note: Submit 1 java file only! Everything (the Task class, the MaxHeap class
 * and the main function) must live in THIS single file.
 *
 * Luu y:
 * 1. SV KHONG su dung tieng Viet co dau trong bai lam de tranh Error khi run.
 * 2. Neu khong tuan thu se nhan diem 0 (khong).
 */
public class TaskManagement {

    public static void main(String[] args) {

        // ================= Question 2 (1 mark) =============================
        // Initialise an array  Task[] tasks  holding the 10 tasks of the
        // dataset given in the exam paper, then demonstrate it by printing
        // out the tasks.
        //
        // ================= Question 2 (1 mark) =============================
        // Discuss - AS COMMENTS IN THE CODE - the advantages and the
        // disadvantages of using an array for task management, focusing on
        // the access, insertion, deletion and search operations.
        // ------------------------------------------------------------------
        // ------ Start your code here --------------------------------------
        Task[] tasks = {
            new Task(1, "Security patch for vulnerability", 100),
            new Task(2, "Add login feature", 80),
            new Task(3, "Update documentation", 40),
            new Task(4, "Fix email notification bug", 90),
            new Task(5, "Refactor user management module", 70),
            new Task(6, "Implement data caching", 85),
            new Task(7, "Optimize database queries", 75),
            new Task(8, "Write unit tests for new features", 60),
            new Task(9, "Upgrade third-party libraries", 50),
            new Task(10, "Review and merge pull requests", 55)
        };

        System.out.println("--- Q2: the task array ---");
        for (Task t : tasks) {
            System.out.println(t);
        }

        // ADVANTAGES of an array for task management:
        //  - ACCESS: random access by index costs O(1); tasks[i] is one
        //    address computation, so reading/updating a known slot is instant.
        //  - MEMORY: elements are stored contiguously, so there is no per-node
        //    pointer overhead and the CPU cache works very well when we scan
        //    the whole task list (which is what sorting and printing do).
        //  - SIMPLICITY: the length is fixed and known, so index arithmetic
        //    (used by MergeSort and by the heap below) is straightforward.
        // DISADVANTAGES of an array for task management:
        //  - INSERTION: inserting at a given position costs O(n) because every
        //    following element must be shifted right; if the array is full we
        //    must allocate a bigger array and copy everything, another O(n).
        //  - DELETION: same problem, O(n) shifting to close the hole.
        //  - SEARCH: an unsorted array needs a linear scan, O(n), to find the
        //    task with a given ID or the task with the highest priority.
        //  - FIXED SIZE: the capacity must be decided in advance; too small
        //    means reallocation, too large means wasted memory.

        // ================= Question 3 (2.5 marks) ==========================
        // Still in the main function: sort this array of Task objects with
        // the MergeSort algorithm, using the compareTo method for comparison
        // (based on task priority). Print the sorted array.
        //
        // ================= Question 3 (0.5 marks) ==========================
        // Answer AS COMMENTS: why is MergeSort stable and why is Quicksort
        // not stable?
        // ------------------------------------------------------------------
        // ------ Start your code here --------------------------------------
        mergeSort(tasks, 0, tasks.length - 1);

        System.out.println("--- Q3: after MergeSort by priority ---");
        for (Task t : tasks) {
            System.out.println(t);
        }

        // WHY IS MERGESORT STABLE?
        //  MergeSort only ever moves elements inside merge(). When the head of
        //  the left half and the head of the right half compare EQUAL, the
        //  merge takes the LEFT one first (the test is  <= 0 , not  < 0 ).
        //  The left half always holds the elements that came earlier in the
        //  original array, so equal elements can never swap their relative
        //  order - and since that is true for every merge, it is true for the
        //  whole sort. Stability is therefore a property of the  <= 0  test.
        // WHY IS QUICKSORT NOT STABLE?
        //  Quicksort partitions by swapping elements that are FAR APART, and
        //  a swap jumps an element across every element between the two
        //  positions. Two equal elements can be thrown to opposite sides of
        //  the pivot, or simply swapped past each other, and nothing in the
        //  algorithm ever restores their original relative order.
        //  Example: 3a 2 3b 1 with pivot 1 - partitioning swaps 3a with 1 and
        //  3a now sits AFTER 3b, although it came first.

        // ================= Question 5 (1 mark) =============================
        // Now in the main function, initialize a MaxHeap object, insert the
        // tasks into the heap one by one, then remove and display each of
        // them using the heap's remove function.
        // ------------------------------------------------------------------
        // ------ Start your code here --------------------------------------
        MaxHeap heap = new MaxHeap(tasks.length);
        for (Task t : tasks) {
            heap.insert(t);
        }

        System.out.println("--- Q5: removing from the MaxHeap ---");
        while (!heap.isEmpty()) {
            System.out.println(heap.remove());
        }
    }

    // ================= Question 3 (2.5 marks) ==============================
    // Write the MergeSort helper method(s) over Task[] here.
    // ----------------------------------------------------------------------
    // ------ Start your code here ------------------------------------------
    public static void mergeSort(Task[] a, int left, int right) {
        if (left >= right) return;              // 0 or 1 element: already sorted
        int mid = left + (right - left) / 2;
        mergeSort(a, left, mid);                // sort the left half
        mergeSort(a, mid + 1, right);           // sort the right half
        merge(a, left, mid, right);             // merge the two sorted halves
    }

    public static void merge(Task[] a, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        Task[] L = new Task[n1];
        Task[] R = new Task[n2];
        for (int i = 0; i < n1; i++) L[i] = a[left + i];
        for (int j = 0; j < n2; j++) R[j] = a[mid + 1 + j];

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            // "<= 0" keeps the LEFT element first on ties -> MergeSort is stable
            if (L[i].compareTo(R[j]) <= 0) a[k++] = L[i++];
            else                            a[k++] = R[j++];
        }
        while (i < n1) a[k++] = L[i++];
        while (j < n2) a[k++] = R[j++];
    }
    // ------ End your code here --------------------------------------------
}

// ================= Question 1 (1 mark) ====================================
// Implement a Task class holding ID, description and priority attributes.
// Include a compareTo method to compare tasks based on their priority.
// --------------------------------------------------------------------------
// ------ Start your code here ----------------------------------------------
class Task implements Comparable<Task> {
    private int ID;
    private String description;
    private int priority;

    public Task(int ID, String description, int priority) {
        this.ID = ID;
        this.description = description;
        this.priority = priority;
    }

    public int getID()            { return ID; }
    public String getDescription() { return description; }
    public int getPriority()      { return priority; }

    public void setID(int ID)                        { this.ID = ID; }
    public void setDescription(String description)   { this.description = description; }
    public void setPriority(int priority)            { this.priority = priority; }

    /**
     * Compare two tasks based on their priority.
     * Negative if this task has a lower priority, 0 if equal, positive if higher.
     */
    @Override
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }

    @Override
    public String toString() {
        return "Task{ID=" + ID + ", priority=" + priority + ", description=" + description + "}";
    }
}
// ------ End your code here ------------------------------------------------
// --------------------------------------------------------------------------


// ================= Question 4 (2.5 marks) =================================
// Implement a max heap data structure  class MaxHeap  for efficient task
// prioritization, with a  void insert(Task element)  method that inserts
// tasks while maintaining the heap's property, and a  Task remove()  method
// that removes and returns the maximum element from the heap.
//
// ================= Question 4 (0.5 marks) =================================
// Answer AS COMMENTS: which are the main advantages of the heap data
// structure?
// --------------------------------------------------------------------------
// ------ Start your code here ----------------------------------------------
class MaxHeap {
    private Task[] heap;
    private int size;

    public MaxHeap(int capacity) {
        if (capacity < 1) capacity = 1;
        this.heap = new Task[capacity];
        this.size = 0;
    }

    public int size()        { return size; }
    public boolean isEmpty() { return size == 0; }

    private int parent(int i) { return (i - 1) / 2; }
    private int left(int i)   { return 2 * i + 1; }
    private int right(int i)  { return 2 * i + 2; }

    private void swap(int i, int j) {
        Task t = heap[i];
        heap[i] = heap[j];
        heap[j] = t;
    }

    /** Insert a task, then bubble it up so the max-heap property holds again. O(log n). */
    public void insert(Task element) {
        if (element == null) return;
        if (size == heap.length) grow();
        heap[size] = element;
        int i = size;
        size++;
        while (i > 0 && heap[i].compareTo(heap[parent(i)]) > 0) {
            swap(i, parent(i));
            i = parent(i);
        }
    }

    /** Remove and return the maximum task (the root), then sift the new root down. O(log n). */
    public Task remove() {
        if (size == 0) return null;
        Task max = heap[0];
        heap[0] = heap[size - 1];
        heap[size - 1] = null;
        size--;
        int i = 0;
        while (true) {
            int largest = i;
            int l = left(i), r = right(i);
            if (l < size && heap[l].compareTo(heap[largest]) > 0) largest = l;
            if (r < size && heap[r].compareTo(heap[largest]) > 0) largest = r;
            if (largest == i) break;
            swap(i, largest);
            i = largest;
        }
        return max;
    }

    private void grow() {
        Task[] bigger = new Task[heap.length * 2];
        for (int i = 0; i < size; i++) bigger[i] = heap[i];
        heap = bigger;
    }

    // MAIN ADVANTAGES OF THE HEAP DATA STRUCTURE:
    //  - The maximum (here: the most urgent task) is ALWAYS at index 0, so
    //    peeking at it costs O(1), while an unsorted array needs O(n).
    //  - insert() and remove() both cost only O(log n): a heap is a COMPLETE
    //    binary tree, so its height is floor(log2 n) and sifting up/down walks
    //    at most that many levels.
    //  - It needs NO extra memory: the complete-tree shape lets us store the
    //    whole tree in a plain array using index arithmetic (children of i are
    //    2i+1 and 2i+2), so there are no child/parent pointers at all.
    //  - Building a heap from n tasks costs O(n) with heapify, and repeatedly
    //    removing gives HeapSort in O(n log n) with O(1) extra space.
    //  - Compared with keeping the array fully sorted, a heap is much cheaper:
    //    a sorted array pays O(n) per insertion, the heap pays O(log n) - and
    //    a priority queue only ever needs the maximum, not a total order.
}
// ------ End your code here ------------------------------------------------
// --------------------------------------------------------------------------
`;

// ───────────────────────────────────────────────────────────────────────────
// Output THẬT của sampleSolution (javac + java). Cắt theo từng câu.
// ───────────────────────────────────────────────────────────────────────────

const OUT_ARRAY = `--- Q2: the task array ---
Task{ID=1, priority=100, description=Security patch for vulnerability}
Task{ID=2, priority=80, description=Add login feature}
Task{ID=3, priority=40, description=Update documentation}
Task{ID=4, priority=90, description=Fix email notification bug}
Task{ID=5, priority=70, description=Refactor user management module}
Task{ID=6, priority=85, description=Implement data caching}
Task{ID=7, priority=75, description=Optimize database queries}
Task{ID=8, priority=60, description=Write unit tests for new features}
Task{ID=9, priority=50, description=Upgrade third-party libraries}
Task{ID=10, priority=55, description=Review and merge pull requests}`;

const OUT_SORTED = `--- Q3: after MergeSort by priority ---
Task{ID=3, priority=40, description=Update documentation}
Task{ID=9, priority=50, description=Upgrade third-party libraries}
Task{ID=10, priority=55, description=Review and merge pull requests}
Task{ID=8, priority=60, description=Write unit tests for new features}
Task{ID=5, priority=70, description=Refactor user management module}
Task{ID=7, priority=75, description=Optimize database queries}
Task{ID=2, priority=80, description=Add login feature}
Task{ID=6, priority=85, description=Implement data caching}
Task{ID=4, priority=90, description=Fix email notification bug}
Task{ID=1, priority=100, description=Security patch for vulnerability}`;

const OUT_HEAP = `--- Q5: removing from the MaxHeap ---
Task{ID=1, priority=100, description=Security patch for vulnerability}
Task{ID=4, priority=90, description=Fix email notification bug}
Task{ID=6, priority=85, description=Implement data caching}
Task{ID=2, priority=80, description=Add login feature}
Task{ID=7, priority=75, description=Optimize database queries}
Task{ID=5, priority=70, description=Refactor user management module}
Task{ID=8, priority=60, description=Write unit tests for new features}
Task{ID=10, priority=55, description=Review and merge pull requests}
Task{ID=9, priority=50, description=Upgrade third-party libraries}
Task{ID=3, priority=40, description=Update documentation}`;

// ───────────────────────────────────────────────────────────────────────────
// Bảng dữ liệu của đề (HTML thuần — KHÔNG markdown, trang render bằng
// dangerouslySetInnerHTML).
// ───────────────────────────────────────────────────────────────────────────

const datasetTable = (headTaskId, headDesc, headPrio) => `<table><thead><tr><th>${headTaskId}</th><th>${headDesc}</th><th>${headPrio}</th></tr></thead><tbody>
<tr><td>1</td><td>Security patch for vulnerability</td><td>100</td></tr>
<tr><td>2</td><td>Add login feature</td><td>80</td></tr>
<tr><td>3</td><td>Update documentation</td><td>40</td></tr>
<tr><td>4</td><td>Fix email notification bug</td><td>90</td></tr>
<tr><td>5</td><td>Refactor user management module</td><td>70</td></tr>
<tr><td>6</td><td>Implement data caching</td><td>85</td></tr>
<tr><td>7</td><td>Optimize database queries</td><td>75</td></tr>
<tr><td>8</td><td>Write unit tests for new features</td><td>60</td></tr>
<tr><td>9</td><td>Upgrade third-party libraries</td><td>50</td></tr>
<tr><td>10</td><td>Review and merge pull requests</td><td>55</td></tr>
</tbody></table>`;

const scenarioEn = `<p><strong>Scenario:</strong> this exam focuses on managing a task dataset inside an application framework. The dataset contains tasks, each identified by an ID, a description, and a numeric priority, as follows:</p>${datasetTable('Task ID', 'Description', 'Priority')}<p><b>Note:</b> Submit 1 java file only! The Task class, the MaxHeap class and the main function all live in the same file. The 5 questions below are graded independently, but they build on one another - the starter skeleton and the reference solution shown are the same single file for every question.</p>`;
const scenarioVi = `<p><strong>Bối cảnh:</strong> đề này xoay quanh việc quản lý một tập dữ liệu công việc (task) trong một khung ứng dụng. Mỗi task gồm một ID, một mô tả và một độ ưu tiên dạng số, như sau:</p>${datasetTable('Task ID', 'Mô tả', 'Độ ưu tiên')}<p><b>Lưu ý:</b> chỉ nộp 1 file java! Lớp Task, lớp MaxHeap và hàm main đều nằm trong cùng một file. 5 câu dưới đây được chấm độc lập nhưng chúng nối tiếp nhau - khung mã và lời giải tham chiếu hiển thị ở mỗi câu là cùng MỘT file.</p>`;

const outputNoteEn = `<p><b>Note on the expected output:</b> the original paper never prints a sample run - it only states the requirements. The expected output shown here is the real output of a reference solution that was actually compiled and run (javac/java). The ORDER of the results is forced by the paper's own data (all 10 priorities are distinct, so both the ascending sorted array and the descending heap-removal sequence are unique); only the toString format and the "--- Qn ---" heading lines are this exam room's own choice and are NOT graded.</p>`;
const outputNoteVi = `<p><b>Lưu ý về output mong đợi:</b> đề gốc KHÔNG in mẫu chạy nào - nó chỉ nêu yêu cầu. Output dưới đây là output THẬT của lời giải tham chiếu đã biên dịch và chạy thật (javac/java). THỨ TỰ kết quả bị ép hoàn toàn bởi chính dữ liệu của đề (10 priority đôi một khác nhau nên mảng sắp tăng dần và dãy lấy ra khỏi max-heap giảm dần đều là duy nhất); chỉ có format toString và các dòng tiêu đề "--- Qn ---" là do phòng thi tự chọn và KHÔNG bị chấm.</p>`;

const instructions = ML(
  `<p><strong>CSD201 PRACTICAL EXAM - SPRING 2024.</strong> Duration: 85 minutes. Software: NetBeans IDE 8.x / any Java IDE, Java JDK 1.8 or later.</p>
   <ol>
     <li>This exam focuses on managing a task dataset inside an application framework. The dataset (10 tasks: ID, description, numeric priority) is repeated in every question below.</li>
     <li><strong>Submit 1 java file only!</strong> There is no given NetBeans project for this paper - you write everything from scratch: the Task class, the MaxHeap class and the main function, all in a single .java file.</li>
     <li>Part of the marks is awarded for DISCUSSION WRITTEN AS COMMENTS IN THE CODE (question 2: advantages/disadvantages of an array; question 3: why MergeSort is stable and Quicksort is not; question 4: the main advantages of a heap). Write those comments inside your answer - they are graded.</li>
     <li>Do not use accented Vietnamese anywhere in the file: on a machine whose platform encoding is not UTF-8, javac rejects it with "unmappable character" and your submission does not even compile.</li>
     <li>This exam room cannot run a JDK in the browser, so type your code directly into each code box - it is graded by AI against the rubric. You can compile and run the same file on your own machine and cross-check against the expected output shown in each question.</li>
   </ol>`,
  `<p><strong>THI THỰC HÀNH CSD201 - SPRING 2024.</strong> Thời gian: 85 phút. Phần mềm: NetBeans IDE 8.x / IDE Java bất kỳ, Java JDK 1.8 trở lên.</p>
   <ol>
     <li>Đề xoay quanh việc quản lý một tập dữ liệu công việc trong một khung ứng dụng. Tập dữ liệu (10 task: ID, mô tả, độ ưu tiên dạng số) được nhắc lại ở mọi câu bên dưới.</li>
     <li><strong>Chỉ nộp 1 file java!</strong> Đề này KHÔNG có project NetBeans cho sẵn - bạn tự viết tất cả từ đầu: lớp Task, lớp MaxHeap và hàm main, tất cả trong một file .java duy nhất.</li>
     <li>Một phần điểm được chấm cho phần LẬP LUẬN VIẾT DƯỚI DẠNG COMMENT TRONG MÃ (câu 2: ưu/nhược điểm của mảng; câu 3: vì sao MergeSort ổn định còn Quicksort thì không; câu 4: các ưu điểm chính của heap). Hãy viết những comment đó ngay trong bài làm - chúng được tính điểm.</li>
     <li>Tuyệt đối không dùng tiếng Việt có dấu trong file: trên máy có platform encoding không phải UTF-8, javac báo "unmappable character" và bài nộp thậm chí không biên dịch được.</li>
     <li>Phòng thi web không chạy được JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí - bạn có thể biên dịch và chạy chính file đó trên máy mình rồi đối chiếu với output mong đợi in ở mỗi câu.</li>
   </ol>`,
);

// ───────────────────────────────────────────────────────────────────────────
// 5 câu, đúng theo đánh số và thang điểm của đề: 1 + 2 + 3 + 3 + 1 = 10.
// ───────────────────────────────────────────────────────────────────────────

const q1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioEn + `<p><strong>Question 1 - 1 mark: the Task class</strong></p><ul><li>Implement a <code>Task</code> class holding <code>ID</code>, <code>description</code> and <code>priority</code> attributes.</li><li>Include a <code>compareTo</code> method to compare tasks based on their priority.</li><li>The class must be usable by MergeSort (question 3) and by MaxHeap (question 4), so make it implement <code>Comparable&lt;Task&gt;</code> and give it a readable <code>toString()</code>.</li></ul>` + outputNoteEn,
    scenarioVi + `<p><strong>Câu 1 - 1 điểm: lớp Task</strong></p><ul><li>Cài đặt lớp <code>Task</code> gồm các thuộc tính <code>ID</code>, <code>description</code> và <code>priority</code>.</li><li>Có method <code>compareTo</code> để so sánh 2 task theo độ ưu tiên (priority).</li><li>Lớp này sẽ được MergeSort (câu 3) và MaxHeap (câu 4) dùng lại, nên hãy cho nó <code>implements Comparable&lt;Task&gt;</code> và một <code>toString()</code> dễ đọc.</li></ul>` + outputNoteVi,
  ),
  starterCode,
  sampleSolution,
  expectedOutput: OUT_ARRAY,
  explanation: B(
    `<p>Verified by compiling and running the reference solution. The Task class itself prints nothing on its own - the block above is the first observable proof that the fields, the constructor and <code>toString()</code> are right (it is the array dump of question 2, in the dataset's original order). The correctness of <code>compareTo</code> becomes observable in question 3 (ascending by priority) and question 5 (descending out of the heap).</p><p><code>Integer.compare(this.priority, other.priority)</code> is preferred over <code>this.priority - other.priority</code>: subtraction overflows for extreme int values and would then return the wrong sign.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu. Bản thân lớp Task không in gì - khối trên là bằng chứng quan sát được đầu tiên cho thấy các trường, constructor và <code>toString()</code> đúng (đó là bản in mảng của câu 2, theo đúng thứ tự gốc của dữ liệu). Tính đúng của <code>compareTo</code> lộ ra ở câu 3 (tăng dần theo priority) và câu 5 (giảm dần khi lấy ra khỏi heap).</p><p>Nên dùng <code>Integer.compare(this.priority, other.priority)</code> thay vì <code>this.priority - other.priority</code>: phép trừ có thể tràn số với giá trị int cực trị và khi đó trả về sai dấu.</p>`,
  ),
  rubric: [
    { id: 'fields', criterion: B('Declares the three attributes ID, description and priority with a constructor that sets all three.', 'Khai báo đủ 3 thuộc tính ID, description, priority cùng constructor gán đủ cả 3.'), weight: 1, maxScore: 0.3 },
    { id: 'compare_to', criterion: B('compareTo compares by priority and returns a correctly signed int (negative / zero / positive); the class implements Comparable&lt;Task&gt; so MergeSort and MaxHeap can call it.', 'compareTo so sánh theo priority và trả về int đúng dấu (âm / 0 / dương); lớp implements Comparable&lt;Task&gt; để MergeSort và MaxHeap gọi được.'), weight: 1, maxScore: 0.4 },
    { id: 'accessors', criterion: B('Provides getters (and/or a toString) that let the tasks be displayed; output format itself is not graded.', 'Có getter (và/hoặc toString) để hiển thị được task; format hiển thị không bị chấm.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    scenarioEn + `<p><strong>Question 2 - 2 marks total</strong></p><ul><li><b>(1 mark)</b> Write a <code>main</code> function that initialises an array <code>Task[] tasks</code> to store this dataset of tasks, then demonstrate it by printing out the tasks.</li><li><b>(1 mark)</b> Discuss the advantages and disadvantages of using an array for task management, focusing on <b>access, insertion, deletion and search</b> operations, <b>by adding comments in the code</b>.</li></ul><p>Both halves are graded: the second mark is for the written discussion inside your comments, not for extra code.</p>` + outputNoteEn,
    scenarioVi + `<p><strong>Câu 2 - tổng 2 điểm</strong></p><ul><li><b>(1 điểm)</b> Viết hàm <code>main</code> khởi tạo mảng <code>Task[] tasks</code> chứa tập dữ liệu trên, rồi minh hoạ bằng cách in các task ra màn hình.</li><li><b>(1 điểm)</b> Bàn về ưu điểm và nhược điểm của việc dùng MẢNG để quản lý task, tập trung vào các thao tác <b>truy cập, chèn, xoá và tìm kiếm</b>, <b>bằng cách viết comment trong mã</b>.</li></ul><p>Cả hai nửa đều được chấm: 1 điểm sau là cho phần lập luận viết trong comment, không phải cho mã thêm.</p>` + outputNoteVi,
  ),
  starterCode,
  sampleSolution,
  expectedOutput: OUT_ARRAY,
  explanation: B(
    `<p>Verified by compiling and running the reference solution - the 10 tasks are printed in the dataset's original order (no sorting has happened yet at this point).</p><p>The discussion half is what most candidates lose marks on. A full answer names <b>all four</b> operations the paper asks for: <b>access</b> O(1) by index (the array's one real strength here); <b>insertion</b> O(n) because everything after the insertion point must shift, plus a full copy when the capacity is exhausted; <b>deletion</b> O(n) for the same shifting reason; <b>search</b> O(n) on an unsorted array, so "find the most urgent task" is a linear scan - which is exactly the weakness the heap in question 4 removes. Mentioning the fixed capacity and the good cache locality of contiguous storage rounds the answer out.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật - 10 task được in theo đúng thứ tự gốc của tập dữ liệu (tại thời điểm này chưa sắp xếp gì).</p><p>Nửa lập luận mới là chỗ thí sinh hay mất điểm. Câu trả lời đầy đủ phải nêu <b>cả bốn</b> thao tác đề yêu cầu: <b>truy cập</b> O(1) theo chỉ số (điểm mạnh thật sự duy nhất của mảng ở đây); <b>chèn</b> O(n) vì mọi phần tử sau vị trí chèn phải dịch, cộng thêm một lần chép toàn bộ khi hết sức chứa; <b>xoá</b> O(n) cũng vì phải dịch; <b>tìm kiếm</b> O(n) trên mảng chưa sắp xếp, nên "tìm task khẩn nhất" là một lượt quét tuyến tính - đúng cái yếu điểm mà heap ở câu 4 xoá bỏ. Nói thêm về sức chứa cố định và tính cục bộ bộ nhớ tốt của lưu trữ liền kề là trọn ý.</p>`,
  ),
  rubric: [
    { id: 'array_init', criterion: B('Initialises Task[] tasks with all 10 tasks of the dataset, with the correct ID, description and priority for each.', 'Khởi tạo Task[] tasks đủ 10 task của tập dữ liệu, đúng ID, mô tả và priority của từng task.'), weight: 1, maxScore: 0.6 },
    { id: 'print_tasks', criterion: B('Iterates the array in main and prints every task (any readable format).', 'Duyệt mảng trong main và in ra mọi task (format nào dễ đọc cũng được).'), weight: 1, maxScore: 0.4 },
    { id: 'array_discussion', criterion: B('Comments in the code discuss BOTH advantages and disadvantages of an array and cover all four operations the paper names - access, insertion, deletion, search - with the right complexity for each (O(1) access, O(n) insert/delete/search).', 'Comment trong mã bàn CẢ ưu lẫn nhược điểm của mảng và phủ đủ bốn thao tác đề nêu - truy cập, chèn, xoá, tìm kiếm - với độ phức tạp đúng cho từng cái (truy cập O(1), chèn/xoá/tìm O(n)).'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(
    scenarioEn + `<p><strong>Question 3 - 3 marks total</strong></p><ul><li><b>(2.5 marks)</b> Still in the main function, implement the <b>MergeSort</b> algorithm to sort this array of <code>Task</code> objects using the <code>compareTo</code> method for comparison (based on task priority).</li><li><b>(0.5 marks)</b> Why is <b>MergeSort</b> stable and why is <b>Quicksort</b> not stable?</li></ul><p>Write your own MergeSort - calling <code>Arrays.sort</code> or <code>Collections.sort</code> does not answer this question.</p>` + outputNoteEn,
    scenarioVi + `<p><strong>Câu 3 - tổng 3 điểm</strong></p><ul><li><b>(2,5 điểm)</b> Vẫn trong hàm main, cài đặt thuật toán <b>MergeSort</b> để sắp xếp mảng các đối tượng <code>Task</code>, dùng method <code>compareTo</code> để so sánh (theo priority của task).</li><li><b>(0,5 điểm)</b> Vì sao <b>MergeSort</b> ổn định (stable) còn <b>Quicksort</b> thì không?</li></ul><p>Phải tự viết MergeSort - gọi <code>Arrays.sort</code> hay <code>Collections.sort</code> không phải là trả lời câu này.</p>` + outputNoteVi,
  ),
  starterCode,
  sampleSolution,
  expectedOutput: OUT_SORTED,
  explanation: B(
    `<p>Verified by compiling and running the reference solution - and hand-checked independently: the 10 priorities are 100, 80, 40, 90, 70, 85, 75, 60, 50, 55, so sorting ascending gives 40, 50, 55, 60, 70, 75, 80, 85, 90, 100, i.e. task IDs 3, 9, 10, 8, 5, 7, 2, 6, 4, 1. That is exactly the run's output. Because <code>compareTo</code> returns a negative value when <code>this</code> has the LOWER priority, the natural order is ascending; sorting the other way round only means flipping the comparison.</p><p><b>Stability.</b> MergeSort's only data movement is inside <code>merge</code>, and on a tie it takes the LEFT element first - the <code>&lt;= 0</code> in <code>if (L[i].compareTo(R[j]) &lt;= 0)</code>. The left half always holds the elements that came earlier in the input, so equal elements can never cross; that invariant holds at every merge, hence for the whole sort. Writing <code>&lt; 0</code> there would silently make the sort unstable while still producing sorted output. Quicksort, by contrast, moves elements with long-distance swaps during partitioning: an element can jump over many others in one step, and two equal elements can end up on opposite sides of the pivot or simply swapped past each other, with nothing in the algorithm ever restoring their original relative order.</p>`,
    `<p>Đã kiểm bằng biên dịch + chạy thật, và tính tay độc lập: 10 priority là 100, 80, 40, 90, 70, 85, 75, 60, 50, 55, nên sắp tăng dần cho 40, 50, 55, 60, 70, 75, 80, 85, 90, 100, tức là các task ID 3, 9, 10, 8, 5, 7, 2, 6, 4, 1 - đúng bằng output của lần chạy. Vì <code>compareTo</code> trả về giá trị âm khi <code>this</code> có priority THẤP hơn nên thứ tự tự nhiên là tăng dần; muốn giảm dần thì chỉ cần đảo chiều so sánh.</p><p><b>Về tính ổn định.</b> MergeSort chỉ di chuyển dữ liệu bên trong <code>merge</code>, và khi bằng nhau thì nó lấy phần tử BÊN TRÁI trước - chính dấu <code>&lt;= 0</code> trong <code>if (L[i].compareTo(R[j]) &lt;= 0)</code>. Nửa trái luôn chứa các phần tử đứng trước trong dữ liệu vào, nên hai phần tử bằng nhau không bao giờ vượt qua nhau; bất biến này đúng ở mọi lần merge nên đúng cho cả thuật toán. Nếu viết <code>&lt; 0</code> ở đó thì thuật toán âm thầm mất tính ổn định mà vẫn cho ra kết quả đã sắp xếp. Ngược lại, Quicksort di chuyển phần tử bằng những cú hoán đổi ở xa nhau trong lúc phân hoạch: một phần tử có thể nhảy qua nhiều phần tử khác chỉ trong một bước, và hai phần tử bằng nhau có thể rơi về hai phía của pivot hoặc bị đổi chỗ cho nhau, mà thuật toán không có gì khôi phục lại thứ tự tương đối ban đầu.</p>`,
  ),
  rubric: [
    { id: 'divide', criterion: B('Recursive split is correct: computes the midpoint, recurses on both halves, and stops when the range holds 0 or 1 element.', 'Chia đệ quy đúng: tính điểm giữa, đệ quy cả hai nửa, dừng khi đoạn còn 0 hoặc 1 phần tử.'), weight: 1, maxScore: 0.7 },
    { id: 'merge', criterion: B('merge() copies both halves out, merges them back in order without losing or duplicating elements, and drains both leftovers.', 'merge() chép ra hai nửa, trộn lại đúng thứ tự mà không mất hay nhân đôi phần tử, và vét hết phần dư của cả hai nửa.'), weight: 1, maxScore: 1 },
    { id: 'uses_compareto', criterion: B('Comparison goes through Task.compareTo (task priority) rather than reading a field directly or calling a library sort; the printed array ends up ordered by priority.', 'So sánh đi qua Task.compareTo (theo priority) chứ không đọc thẳng trường hay gọi hàm sort có sẵn; mảng in ra đúng thứ tự theo priority.'), weight: 1, maxScore: 0.8 },
    { id: 'stability', criterion: B('Explains that MergeSort is stable because merge prefers the left half on ties (the &lt;= 0 test), and that Quicksort is not because partitioning swaps distant elements and can reorder equal keys.', 'Giải thích MergeSort ổn định vì khi bằng nhau merge ưu tiên nửa trái (phép so &lt;= 0), còn Quicksort không ổn định vì phân hoạch hoán đổi các phần tử ở xa nhau và có thể đảo thứ tự các khoá bằng nhau.'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(
    scenarioEn + `<p><strong>Question 4 - 3 marks total</strong></p><ul><li><b>(2.5 marks)</b> Implement a max heap data structure <code>class MaxHeap</code> for efficient task prioritization, with a <code>void insert(Task element)</code> method that inserts tasks while maintaining the heap's property, and a <code>Task remove()</code> method that removes and returns the maximum element from the heap.</li><li><b>(0.5 marks)</b> Which are the main advantages of the heap data structure?</li></ul><p>The two method signatures are fixed by the paper: <code>void insert(Task element)</code> and <code>Task remove()</code>. Do not use <code>java.util.PriorityQueue</code>.</p>` + outputNoteEn,
    scenarioVi + `<p><strong>Câu 4 - tổng 3 điểm</strong></p><ul><li><b>(2,5 điểm)</b> Cài đặt cấu trúc dữ liệu heap cực đại <code>class MaxHeap</code> để ưu tiên task hiệu quả, gồm method <code>void insert(Task element)</code> chèn task mà vẫn giữ tính chất heap, và method <code>Task remove()</code> lấy ra và trả về phần tử lớn nhất của heap.</li><li><b>(0,5 điểm)</b> Các ưu điểm chính của cấu trúc dữ liệu heap là gì?</li></ul><p>Chữ ký hai method do đề quy định: <code>void insert(Task element)</code> và <code>Task remove()</code>. Không dùng <code>java.util.PriorityQueue</code>.</p>` + outputNoteVi,
  ),
  starterCode,
  sampleSolution,
  expectedOutput: OUT_HEAP,
  explanation: B(
    `<p>Verified by compiling and running the reference solution: inserting all 10 tasks and then calling <code>remove()</code> until the heap is empty yields the priorities 100, 90, 85, 80, 75, 70, 60, 55, 50, 40 - strictly descending, which is the definition of a working max-heap and is independent of the insertion order because all 10 priorities are distinct.</p><p><b>insert</b>: put the new task in the first free slot (index <code>size</code>), then sift it UP, swapping with its parent <code>(i-1)/2</code> while it is larger. <b>remove</b>: save <code>heap[0]</code> (the maximum), move the LAST element into the root, shrink the size, then sift DOWN, repeatedly swapping the root with its larger child (<code>2i+1</code> / <code>2i+2</code>) until neither child is bigger. Both walk one root-to-leaf path of a complete binary tree, so both are O(log n). Common mistakes: sifting down by comparing only with the left child; forgetting to null out the vacated last slot; and returning the moved element instead of the saved maximum.</p><p><b>Advantages of a heap</b>: the maximum is always at index 0 so peeking is O(1); insert and remove are O(log n) because a complete binary tree has height floor(log2 n); the complete shape lets the whole tree live in a plain array with index arithmetic, so there are no parent/child pointers at all; heapify builds a heap from n items in O(n); and repeatedly removing gives HeapSort in O(n log n) with O(1) extra space. Against a fully sorted array, a heap pays only O(log n) per insertion instead of O(n) - and a priority queue never needs a total order, only the maximum.</p>`,
    `<p>Đã kiểm bằng biên dịch + chạy thật: chèn cả 10 task rồi gọi <code>remove()</code> tới khi heap rỗng cho dãy priority 100, 90, 85, 80, 75, 70, 60, 55, 50, 40 - giảm dần nghiêm ngặt, đúng định nghĩa của một max-heap chạy đúng, và không phụ thuộc thứ tự chèn vì 10 priority đôi một khác nhau.</p><p><b>insert</b>: đặt task mới vào ô trống đầu tiên (chỉ số <code>size</code>), rồi đẩy LÊN, đổi chỗ với cha <code>(i-1)/2</code> chừng nào nó còn lớn hơn. <b>remove</b>: lưu <code>heap[0]</code> (phần tử lớn nhất), chuyển phần tử CUỐI lên gốc, giảm size, rồi đẩy XUỐNG, liên tục đổi chỗ gốc với đứa con lớn hơn (<code>2i+1</code> / <code>2i+2</code>) cho tới khi không con nào lớn hơn nữa. Cả hai chỉ đi một đường từ gốc xuống lá của cây nhị phân đầy đủ nên đều O(log n). Lỗi hay gặp: đẩy xuống mà chỉ so với con trái; quên gán null cho ô cuối vừa bỏ trống; và trả về phần tử vừa chuyển lên thay vì phần tử lớn nhất đã lưu.</p><p><b>Ưu điểm của heap</b>: phần tử lớn nhất luôn ở chỉ số 0 nên xem đỉnh chỉ tốn O(1); insert và remove chỉ O(log n) vì cây nhị phân đầy đủ có chiều cao floor(log2 n); nhờ hình dạng đầy đủ mà cả cây nằm gọn trong một mảng thường bằng phép tính chỉ số, không cần con trỏ cha/con nào; heapify dựng heap từ n phần tử trong O(n); và lấy ra liên tục cho HeapSort O(n log n) với bộ nhớ phụ O(1). So với giữ mảng luôn được sắp xếp, heap chỉ trả O(log n) mỗi lần chèn thay vì O(n) - và hàng đợi ưu tiên vốn không cần thứ tự toàn phần, chỉ cần phần tử lớn nhất.</p>`,
  ),
  rubric: [
    { id: 'representation', criterion: B('Stores the heap in an array with a size counter and uses the complete-tree index arithmetic: parent (i-1)/2, children 2i+1 and 2i+2.', 'Lưu heap trong mảng kèm biến size và dùng phép tính chỉ số của cây đầy đủ: cha (i-1)/2, con 2i+1 và 2i+2.'), weight: 1, maxScore: 0.5 },
    { id: 'insert', criterion: B('void insert(Task element) appends at index size, increments the size, and sifts up while the new element outranks its parent - restoring the max-heap property.', 'void insert(Task element) đặt vào chỉ số size, tăng size, và đẩy lên chừng nào phần tử mới còn lớn hơn cha - khôi phục đúng tính chất max-heap.'), weight: 1, maxScore: 1 },
    { id: 'remove', criterion: B('Task remove() returns the SAVED root (the maximum), moves the last element to the root, decrements the size, and sifts down comparing against the LARGER of the two children; handles the empty heap.', 'Task remove() trả về gốc ĐÃ LƯU (phần tử lớn nhất), chuyển phần tử cuối lên gốc, giảm size, và đẩy xuống theo con LỚN HƠN trong hai con; xử lý được trường hợp heap rỗng.'), weight: 1, maxScore: 1 },
    { id: 'heap_advantages', criterion: B('Names the main advantages of a heap: O(1) access to the maximum, O(log n) insert and remove thanks to the complete tree\'s height, and array storage with no pointers (bonus: O(n) heapify, in-place HeapSort).', 'Nêu được các ưu điểm chính của heap: lấy phần tử lớn nhất O(1), insert và remove O(log n) nhờ chiều cao của cây đầy đủ, và lưu bằng mảng không cần con trỏ (điểm cộng: heapify O(n), HeapSort tại chỗ).'), weight: 1, maxScore: 0.5 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioEn + `<p><strong>Question 5 - 1 mark: use the heap from main</strong></p><ul><li>Now in the main function, initialize a <code>MaxHeap</code> object, insert the tasks into the heap one by one, then remove and display each of them using the heap's <code>remove()</code> function.</li><li>The point of the exercise is that repeatedly removing from a max-heap hands you the tasks in decreasing priority - the task list in the order a team should actually work through it.</li></ul>` + outputNoteEn,
    scenarioVi + `<p><strong>Câu 5 - 1 điểm: dùng heap từ main</strong></p><ul><li>Trong hàm main, khởi tạo một đối tượng <code>MaxHeap</code>, chèn lần lượt từng task vào heap, rồi lấy ra và hiển thị từng task bằng method <code>remove()</code> của heap.</li><li>Ý nghĩa của bài: lấy ra liên tục từ max-heap sẽ trả về các task theo priority GIẢM DẦN - đúng thứ tự mà một đội nên làm việc.</li></ul>` + outputNoteVi,
  ),
  starterCode,
  sampleSolution,
  expectedOutput: OUT_HEAP,
  explanation: B(
    `<p>Verified by compiling and running the reference solution. Removing from the max-heap until it is empty gives priorities 100, 90, 85, 80, 75, 70, 60, 55, 50, 40 - task IDs 1, 4, 6, 2, 7, 5, 8, 10, 9, 3. Note this is the exact reverse of question 3's MergeSort output, which is a useful self-check: the same 10 tasks, ascending from the sort and descending out of the heap.</p><p>Two details worth getting right: <b>the loop must be driven by the heap's own emptiness</b> (<code>while (!heap.isEmpty())</code> or a counter captured BEFORE the loop) - writing <code>for (int i = 0; i &lt; heap.size(); i++)</code> reads a size that shrinks on every removal and drains only half the heap. And whether you insert the original array or the array already sorted by question 3 makes no difference to the output, since a heap imposes its own order.</p>`,
    `<p>Đã kiểm bằng biên dịch + chạy thật. Lấy ra khỏi max-heap tới khi rỗng cho dãy priority 100, 90, 85, 80, 75, 70, 60, 55, 50, 40 - tức các task ID 1, 4, 6, 2, 7, 5, 8, 10, 9, 3. Để ý dãy này ĐẢO NGƯỢC đúng output MergeSort của câu 3, một phép tự kiểm tra rất tiện: cùng 10 task, sort cho tăng dần còn heap cho giảm dần.</p><p>Hai chi tiết dễ sai: <b>vòng lặp phải điều khiển bằng chính tình trạng rỗng của heap</b> (<code>while (!heap.isEmpty())</code> hoặc một biến đếm lấy TRƯỚC vòng lặp) - viết <code>for (int i = 0; i &lt; heap.size(); i++)</code> là đang đọc một size co lại sau mỗi lần lấy ra, và chỉ vét được nửa heap. Và chèn mảng gốc hay mảng đã sắp xếp ở câu 3 đều cho ra cùng kết quả, vì heap tự áp đặt thứ tự của nó.</p>`,
  ),
  rubric: [
    { id: 'build_heap', criterion: B('Creates a MaxHeap in main with a capacity that fits all 10 tasks and inserts the tasks one by one (not by bulk-copying the array into the heap\'s internal storage).', 'Tạo MaxHeap trong main với sức chứa đủ 10 task và chèn lần lượt từng task (không chép nguyên mảng vào bộ nhớ trong của heap).'), weight: 1, maxScore: 0.4 },
    { id: 'drain_and_print', criterion: B('Loops until the heap is empty, calling remove() and displaying each returned task, so the printed order is by decreasing priority; the loop condition does not use a size that shrinks during iteration.', 'Lặp tới khi heap rỗng, gọi remove() và hiển thị từng task trả về, nên thứ tự in ra là giảm dần theo priority; điều kiện lặp không dùng size đang co lại trong lúc lặp.'), weight: 1, maxScore: 0.6 },
  ],
};

const questions = [q1, q2, q3, q4, q5];

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE26',
    title: 'PE Đề 26 — Practical Exam (Spring 2024)|||PE Đề 26 — Thi thực hành (Spring 2024)',
    description: 'CSD201 PE (CODE): write ONE java file managing a 10-task dataset — Task class with compareTo, array + discussion, MergeSort, MaxHeap (insert/remove), and a heap-driven priority drain. No given project; AI-graded.|||PE CSD201 (viết mã): viết MỘT file java quản lý tập 10 task — lớp Task có compareTo, mảng + lập luận, MergeSort, MaxHeap (insert/remove), và lấy task theo thứ tự ưu tiên bằng heap. Không có project cho sẵn; chấm AI.',
    durationMinutes: 85,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    instructions,
    isPublished: true,
    questions,
  }],
};

// Chốt kiểm: tổng điểm câu phải bằng totalPoints, và maxScore của rubric mỗi
// câu phải bằng points của câu đó (sai số dấu phẩy động cho phép 1e-9).
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const total = sum(questions.map((q) => q.points));
if (Math.abs(total - spec.exams[0].totalPoints) > 1e-9) {
  throw new Error(`Tổng điểm câu = ${total}, khác totalPoints = ${spec.exams[0].totalPoints}`);
}
for (const [i, q] of questions.entries()) {
  const r = sum(q.rubric.map((x) => x.maxScore));
  if (Math.abs(r - q.points) > 1e-9) {
    throw new Error(`Câu ${i + 1}: tổng maxScore rubric = ${r}, khác points = ${q.points}`);
  }
}

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${questions.length} câu, ${total} điểm (${questions.map((q) => q.points).join(' + ')})`);
