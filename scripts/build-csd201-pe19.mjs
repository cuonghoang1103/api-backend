/**
 * build-csd201-pe19.mjs — sinh content/exams/CSD201-PE19.mjs.
 *
 * Nguồn thật: "Đề 19 - Đề Thi PE CSD201 - PE1 - SP2025"
 *   (paper.pdf = "PRACTICAL EXAM – CSD201 – SPRING 2025", 85 phút)
 *   + q2-q3-q4.rar + 20250323135659_aaaaaazip.zip.
 *
 * ✅ ĐÃ ĐỐI CHIẾU ARCHIVE ↔ paper.pdf: hai archive KHỚP đúng đề này (khác với
 * nhiều môn khác, nơi archive đính kèm là của đề khác). zip chứa
 * `AAAAAA/src/aaaaaa/AAAAAA.java` = `public class PE_SP25_Q1` (singly linked
 * list Motorbike), rar chứa `Q2,Q3,Q4/src/q2/Q2.java` = `public class
 * PE_SP25_Q2` (MaxHeap Motorbike) — đúng 10 chiếc mô tô, đúng ID/tên/model/
 * dung tích như BẢNG trong paper.pdf. Đây là BÀI NỘP của thí sinh, không phải
 * "given project": đề này thuộc dạng VIẾT TỪ ĐẦU (không có project given), y
 * như PE14 cùng loạt "PE_SP25". Vì vậy attachmentUrl = null.
 *
 * paper.pdf là PDF ẢNH (pdftotext ra 2 byte) → đọc bằng tool Read (render
 * trang thành ảnh). Trang 2 trắng, toàn bộ đề nằm ở trang 1.
 *
 * ─── ĐIỂM: LẤY NGUYÊN CỦA ĐỀ, KHÔNG TỰ PHÂN BỔ ───────────────────────────
 * Khác PE14 (đề không ghi điểm thành phần), đề này ghi rõ từng phần:
 *   Q1: [0.5] lớp Motorbike · [1] addFirst + removeLast · [0.5] main   = 2.0
 *   Q2: [1] lớp Motorbike + compareTo
 *       [0.5] 2.1 constructor · [1.5] 2.2 insert · [0.5] 2.3 preOrderTraverse
 *       [1.5] 2.4 delete · [1] 3. heapSort
 *       [0.5] 4.1 · [0.5] 4.2 · [0.5] 4.3 · [0.5] 4.4 (main)          = 8.0
 * Tổng = 10.0 ✓ (cộng tay lại đúng, không phải suy đoán).
 * 7 câu của deck gộp lại đúng theo các mốc trên: 2 + 1 + 2 + 0.5 + 1.5 + 1 + 2.
 *
 * ─── MÂU THUẪN / THIẾU SÓT TÌM THẤY TRONG ĐỀ GỐC ─────────────────────────
 * 1. ⚠️ ĐỀ TỰ TẠO LỖI BIÊN DỊCH. Đề bắt nộp ĐÚNG 2 file (PE_SP25_Q1.java và
 *    PE_SP25_Q2.java) và bắt MỖI file có một lớp `Motorbike`. Để chung một
 *    package (mặc định) thì javac báo `error: duplicate class: Motorbike` —
 *    ĐÃ KIỂM THẬT bằng `javac PE_SP25_Q1.java PE_SP25_Q2.java`, ra đúng lỗi
 *    đó. Bài nộp kèm đề né bằng cách để mỗi file trong một project/package
 *    NetBeans riêng (`aaaaaa` và `q2`). Deck này né bằng cách lồng Motorbike
 *    thành `static class` bên trong lớp public của từng file — đúng cách deck
 *    PE14 (cùng loạt, cùng ràng buộc "nộp đúng 2 file") đã làm, và vẫn thoả
 *    "một lớp Motorbike trong mỗi file". Đã kiểm: hai file biên dịch CHUNG
 *    một thư mục thành công.
 * 2. ⚠️ Đề KHÔNG cho output mẫu, KHÔNG quy định `toString()`, KHÔNG quy định
 *    thứ tự chèn trong main. Deck lấy nguyên của bài nộp kèm đề:
 *      - toString = `id + ". " + name + " - " + model + " - " + enCap + "cc"`
 *      - Q1 main gọi addFirst theo thứ tự NGƯỢC bảng (10→1) để danh sách in
 *        ra đọc xuôi đúng thứ tự bảng của đề;
 *      - Q2 main insert theo đúng thứ tự bảng (1→10).
 *    → Mọi `expectedOutput` dưới đây là KẾT QUẢ CHẠY THẬT của deck này
 *    (javac + java), KHÔNG phải đáp án chính thức (đề này không có).
 * 3. ⚠️ Tên trường: đề viết `enCap`; bài nộp kèm đề viết `engineCapacity`.
 *    Deck theo ĐỀ (`enCap`).
 * 4. ⚠️ `delete`: đề chỉ nói "max heap property must be maintained", không
 *    nói phần tử thay thế có thể phải sift LÊN. Bài nộp kèm đề chỉ sift
 *    XUỐNG (thiếu heapifyUp) — sai về nguyên tắc. ĐÃ CHẠY CẢ HAI BẢN trên
 *    đúng bộ dữ liệu này: kết quả TRÙNG NHAU (mảng heap sau khi xoá
 *    S1000RR-2023 đều là 1103 883 750 765 648 500 373 321 649), nên
 *    expectedOutput không bị ảnh hưởng. sampleSolution của deck vẫn làm
 *    ĐÚNG (heapifyUp + heapifyDown) và explanation nói rõ chỗ này.
 * 5. ⚠️ Đánh số của đề tự lệch: trong Q2, các gạch đầu dòng con đi 2.1, 2.2,
 *    2.3, 2.4 rồi đột ngột "3." và "4." (vẫn thụt vào như mục con của 2).
 *    Chỉ là lỗi trình bày — tổng điểm vẫn đúng 10 nên không gây mơ hồ.
 * 6. ⚠️ heapSort: đề yêu cầu "increasing order" nhưng cấu trúc là MAX heap →
 *    rút gốc liên tiếp cho ra GIẢM DẦN, phải đảo lại. Đã ghi rõ trong đề bài
 *    của câu tương ứng.
 *
 * ─── ĐÃ VERIFY GÌ ────────────────────────────────────────────────────────
 * - COMPILE + CHẠY THẬT (javac/java, /usr/bin) cả 2 sampleSolution và cả 2
 *   starterCode (skeleton) — starter biên dịch sạch (chạy ra rỗng vì thân
 *   method trống, đúng như mong đợi).
 * - Mảng heap sau 10 lần insert (1103 883 999 765 648 500 750 321 649 373)
 *   và toàn bộ 3 khối output đã TÍNH TAY ĐỘC LẬP trước rồi mới đối chiếu với
 *   kết quả chạy — khớp 100%.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE19.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE19.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

/* ─────────────────────────── DỮ LIỆU CHUNG ─────────────────────────── */

const DATA_ROWS = [
  [1, 'Honda CBR500R', 'CBR500R-2024', 500],
  [2, 'Yamaha YZF-R3', 'YZF-R3-2023', 321],
  [3, 'Kawasaki Ninja 650', 'Ninja650-2024', 649],
  [4, 'Suzuki GSX-R750', 'GSX-R750-2023', 750],
  [5, 'KTM Duke 390', 'Duke390-2024', 373],
  [6, 'Ducati Panigale V4', 'PanigaleV4-2024', 1103],
  [7, 'BMW S1000RR', 'S1000RR-2023', 999],
  [8, 'Harley-Davidson Iron 883', 'Iron883-2024', 883],
  [9, 'Triumph Street Triple RS', 'TripleRS-2023', 765],
  [10, 'Royal Enfield Interceptor 650', 'Interceptor650-2024', 648],
];

const dataTable =
  '<table><tr><th>ID</th><th>Name</th><th>Model Number</th><th>Engine Capacity (cc)</th></tr>' +
  DATA_ROWS.map(([id, name, model, cc]) =>
    `<tr><td>${id}</td><td>${name}</td><td>${model}</td><td>${cc}</td></tr>`).join('') +
  '</table>';

/* ─────────────────────────── HƯỚNG DẪN ─────────────────────────── */

const instructions = ML(
  `<p><strong>CSD201 PRACTICAL EXAM — SPRING 2025.</strong> Duration: 85 minutes. Only Apache Netbeans IDE is permitted during examination. You must submit your work in <b>two files</b>: <code>PE_SP25_Q1.java</code> and <code>PE_SP25_Q2.java</code> — a 1-point penalty is applied if this requirement is not met.</p>
   <p>This exam works with a dataset of motorbikes. Each motorbike has an ID, a name, a model number and an engine capacity:</p>
   ${dataTable}
   <p><b>Note 1 — no sample output exists for this paper.</b> The paper gives the marks breakdown and the data table, but prescribes neither a <code>toString()</code> format nor the insertion order used inside <code>main</code>. This exam room adopts both from the student submission that ships alongside this paper, and every "expected output" below is this room's own verified <code>javac</code>/<code>java</code> run on exactly the data table above — not an official answer key (none exists).</p>
   <p><b>Note 2 — the paper as written does not compile.</b> It asks for a <code>Motorbike</code> class inside <b>each</b> of the two submitted files; in one package that is <code>error: duplicate class: Motorbike</code> (verified). Here <code>Motorbike</code> is a <code>static</code> class nested inside each public class, so both files compile side by side. Putting each file in its own package/project works too — that is what the accompanying submission did.</p>
   <p><b>Note 3 — field name.</b> The paper calls the engine capacity <code>enCap</code>; the accompanying submission called it <code>engineCapacity</code>. This deck follows the paper.</p>`,
  `<p><strong>THI THỰC HÀNH CSD201 — SPRING 2025.</strong> Thời gian: 85 phút. Chỉ được dùng Apache Netbeans IDE trong phòng thi. Phải nộp bài trong <b>hai file</b>: <code>PE_SP25_Q1.java</code> và <code>PE_SP25_Q2.java</code> — không đúng yêu cầu này bị trừ 1 điểm.</p>
   <p>Đề làm việc trên tập dữ liệu xe mô tô. Mỗi xe có ID, tên, số hiệu model và dung tích động cơ:</p>
   ${dataTable}
   <p><b>Lưu ý 1 — đề này KHÔNG có output mẫu.</b> Đề cho bảng điểm thành phần và bảng dữ liệu, nhưng không quy định định dạng <code>toString()</code> lẫn thứ tự chèn trong <code>main</code>. Phòng thi lấy cả hai từ bài nộp đi kèm đề, và mọi "expected output" dưới đây là kết quả TỰ CHẠY THẬT (<code>javac</code>/<code>java</code>) trên đúng bảng dữ liệu trên — không phải đáp án chính thức (đề này không có).</p>
   <p><b>Lưu ý 2 — đề viết như vậy thì KHÔNG BIÊN DỊCH ĐƯỢC.</b> Đề bắt mỗi file trong hai file nộp đều có một lớp <code>Motorbike</code>; để chung một package thì javac báo <code>error: duplicate class: Motorbike</code> (đã kiểm thật). Ở đây <code>Motorbike</code> được lồng thành lớp <code>static</code> bên trong lớp public của từng file nên hai file biên dịch chung được. Cách khác: để mỗi file trong một package/project riêng — đúng cách bài nộp đi kèm đã làm.</p>
   <p><b>Lưu ý 3 — tên trường.</b> Đề gọi dung tích động cơ là <code>enCap</code>; bài nộp đi kèm gọi là <code>engineCapacity</code>. Deck này theo ĐỀ.</p>`,
);

/* ─────────────────────────── FILE 1: PE_SP25_Q1.java ─────────────────────────── */

const Q1_STARTER = `public class PE_SP25_Q1 {

    // Q1.1 [0.5 pt] A Motorbike class holding the ID (id - integer),
    // name (name - String), model (model - String) and engine capacity
    // (enCap - integer) of a motorbike, a 4-argument constructor, and a
    // toString() printing:  <id>. <name> - <model> - <enCap>cc
    static class Motorbike {
        //You should write here appropriate statements to complete this class.

    }

    static class Node {
        Motorbike data;
        Node next;

        Node(Motorbike data) {
            this.data = data;
            this.next = null;
        }
    }

    static class MotorbikeList {
        Node head;

        // Q1.2a [part of 1.0 pt] Insert a new node at the HEAD of the list.
        void addFirst(Motorbike m) {
            //You should write here appropriate statements to complete this function.

        }

        // Q1.2b [part of 1.0 pt] Remove the TAIL node of the list.
        // Does nothing when the list is empty.
        void removeLast() {
            //You should write here appropriate statements to complete this function.

        }

        void printList() {
            Node current = head;
            while (current != null) {
                System.out.println(current.data);
                current = current.next;
            }
        }
    }

    // Q1.3 [0.5 pt] A main method to test the implementation: build the list
    // from the 10 motorbikes of the data table, print it, then removeLast()
    // and print it again.
    public static void main(String[] args) {
        //You should write here appropriate statements to complete this function.

    }
}
`;

const Q1_SOLUTION = `public class PE_SP25_Q1 {

    // Q1.1 [0.5 pt] A Motorbike class holding the ID (id - integer),
    // name (name - String), model (model - String) and engine capacity
    // (enCap - integer) of a motorbike.
    static class Motorbike {
        int id;
        String name;
        String model;
        int enCap;

        Motorbike(int id, String name, String model, int enCap) {
            this.id = id;
            this.name = name;
            this.model = model;
            this.enCap = enCap;
        }

        @Override
        public String toString() {
            return id + ". " + name + " - " + model + " - " + enCap + "cc";
        }
    }

    static class Node {
        Motorbike data;
        Node next;

        Node(Motorbike data) {
            this.data = data;
            this.next = null;
        }
    }

    static class MotorbikeList {
        Node head;

        // Q1.2a Insert a new node at the HEAD of the list.
        void addFirst(Motorbike m) {
            Node newNode = new Node(m);
            newNode.next = head;
            head = newNode;
        }

        // Q1.2b Remove the TAIL node of the list.
        void removeLast() {
            if (head == null) return;              // empty list: nothing to do
            if (head.next == null) { head = null; return; }   // single node
            Node current = head;
            while (current.next.next != null) current = current.next;
            current.next = null;                   // current is now the tail
        }

        void printList() {
            Node current = head;
            while (current != null) {
                System.out.println(current.data);
                current = current.next;
            }
        }
    }

    // Q1.3 [0.5 pt] main method testing the implementation. addFirst pushes at
    // the head, so the 10 rows are pushed in REVERSE table order (10 down to 1)
    // and the printed list then reads in the paper's table order.
    public static void main(String[] args) {
        MotorbikeList list = new MotorbikeList();
        list.addFirst(new Motorbike(10, "Royal Enfield Interceptor 650", "Interceptor650-2024", 648));
        list.addFirst(new Motorbike(9, "Triumph Street Triple RS", "TripleRS-2023", 765));
        list.addFirst(new Motorbike(8, "Harley-Davidson Iron 883", "Iron883-2024", 883));
        list.addFirst(new Motorbike(7, "BMW S1000RR", "S1000RR-2023", 999));
        list.addFirst(new Motorbike(6, "Ducati Panigale V4", "PanigaleV4-2024", 1103));
        list.addFirst(new Motorbike(5, "KTM Duke 390", "Duke390-2024", 373));
        list.addFirst(new Motorbike(4, "Suzuki GSX-R750", "GSX-R750-2023", 750));
        list.addFirst(new Motorbike(3, "Kawasaki Ninja 650", "Ninja650-2024", 649));
        list.addFirst(new Motorbike(2, "Yamaha YZF-R3", "YZF-R3-2023", 321));
        list.addFirst(new Motorbike(1, "Honda CBR500R", "CBR500R-2024", 500));

        System.out.println("Original list:");
        list.printList();

        System.out.println();
        System.out.println("After removing last:");
        list.removeLast();
        list.printList();
    }
}
`;

/* ─────────────────────────── FILE 2: PE_SP25_Q2.java ─────────────────────────── */

const Q2_STARTER = `import java.util.ArrayList;

public class PE_SP25_Q2 {

    static class Motorbike implements Comparable<Motorbike> {
        // Q2.1 [1.0 pt] Declare the motorbike ID (id - integer), name
        // (name - String), model (model - String) and engine capacity
        // (enCap - integer), a 4-argument constructor, and a toString()
        // printing:  <id>. <name> - <model> - <enCap>cc
        //You should write here appropriate statements to complete this class.


        // Compare THIS motorbike's engine capacity with another motorbike's.
        @Override
        public int compareTo(Motorbike other) {
            //You should write here appropriate statements to complete this function.

            return 0;
        }
    }

    static class MaxHeap {
        ArrayList<Motorbike> heap;

        // Q2.2 [0.5 pt] Constructor with the parameters needed to manage the
        // array-based max heap.
        MaxHeap() {
            //You should write here appropriate statements to complete this function.

        }

        // Q2.3 [1.5 pts] Add a motorbike to the MaxHeap. compareTo must be used
        // to compare engine capacities so that the max heap property still
        // holds after each insertion.
        void insert(Motorbike m) {
            //You should write here appropriate statements to complete this function.

        }

        // Q2.4 [0.5 pt] Traverse the max heap in pre-order: the node at index
        // "index", then its left child (2*index+1), then its right child
        // (2*index+2).
        void preOrderTraverse(int index) {
            //You should write here appropriate statements to complete this function.

        }

        // Q2.5 [1.5 pts] Remove the motorbike whose model equals the argument.
        // The max heap property must be maintained after the deletion.
        void delete(String model) {
            //You should write here appropriate statements to complete this function.

        }

        // Q2.6 [1.0 pt] Use the constructed MaxHeap to sort the motorbikes in
        // INCREASING order of engine capacity, and print them.
        void heapSort() {
            //You should write here appropriate statements to complete this function.

        }
    }

    // Q2.7 [2.0 pts] main method:
    //   4.1 [0.5] instantiate the maxHeap and add the 10 motorbikes into it
    //   4.2 [0.5] run a pre-order traversal and display the motorbikes
    //   4.3 [0.5] delete the motorbike whose model is "S1000RR-2023",
    //             then run the pre-order traversal again
    //   4.4 [0.5] apply heapSort to the motorbikes stored in the maxHeap
    public static void main(String[] args) {
        //You should write here appropriate statements to complete this function.

    }
}
`;

const Q2_SOLUTION = `import java.util.ArrayList;

public class PE_SP25_Q2 {

    // Q2.1 [1.0 pt] Motorbike with a compareTo on the engine capacity.
    static class Motorbike implements Comparable<Motorbike> {
        int id;
        String name;
        String model;
        int enCap;

        Motorbike(int id, String name, String model, int enCap) {
            this.id = id;
            this.name = name;
            this.model = model;
            this.enCap = enCap;
        }

        @Override
        public int compareTo(Motorbike other) {
            return Integer.compare(this.enCap, other.enCap);
        }

        @Override
        public String toString() {
            return id + ". " + name + " - " + model + " - " + enCap + "cc";
        }
    }

    static class MaxHeap {
        ArrayList<Motorbike> heap;

        // Q2.2 [0.5 pt] Constructor: create the array-based storage.
        MaxHeap() {
            heap = new ArrayList<>();
        }

        private void swap(int i, int j) {
            Motorbike t = heap.get(i);
            heap.set(i, heap.get(j));
            heap.set(j, t);
        }

        // Sift the element at index i UP while it is bigger than its parent.
        private void heapifyUp(int i) {
            while (i > 0) {
                int parent = (i - 1) / 2;
                if (heap.get(i).compareTo(heap.get(parent)) > 0) {
                    swap(i, parent);
                    i = parent;
                } else break;
            }
        }

        // Sift the element at index i DOWN below its bigger child.
        private void heapifyDown(int i) {
            int largest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            if (left < heap.size() && heap.get(left).compareTo(heap.get(largest)) > 0) largest = left;
            if (right < heap.size() && heap.get(right).compareTo(heap.get(largest)) > 0) largest = right;
            if (largest != i) {
                swap(i, largest);
                heapifyDown(largest);
            }
        }

        // Q2.3 [1.5 pts] Append then sift up: O(log n), heap property restored.
        void insert(Motorbike m) {
            heap.add(m);
            heapifyUp(heap.size() - 1);
        }

        // Q2.4 [0.5 pt] Pre-order over the implicit tree of the array.
        void preOrderTraverse(int index) {
            if (index >= heap.size()) return;
            System.out.println(heap.get(index));
            preOrderTraverse(2 * index + 1);
            preOrderTraverse(2 * index + 2);
        }

        // Q2.5 [1.5 pts] Find by model, swap with the last element, drop the
        // last element, then restore the heap at that index. The replacement
        // can be either too big (sift up) or too small (sift down), so BOTH
        // directions are needed for a general-purpose delete.
        void delete(String model) {
            int index = -1;
            for (int i = 0; i < heap.size(); i++) {
                if (heap.get(i).model.equals(model)) { index = i; break; }
            }
            if (index == -1) return;                 // model not found
            int last = heap.size() - 1;
            swap(index, last);
            heap.remove(last);
            if (index < heap.size()) {               // not the removed slot itself
                heapifyUp(index);
                heapifyDown(index);
            }
        }

        // Q2.6 [1.0 pt] Repeatedly taking the root of a MAX heap yields
        // DECREASING order, so collect then print in reverse to get the
        // increasing order the paper asks for. The heap is restored so the
        // caller can keep using it afterwards.
        void heapSort() {
            ArrayList<Motorbike> backup = new ArrayList<>(heap);
            ArrayList<Motorbike> desc = new ArrayList<>();
            while (!heap.isEmpty()) {
                desc.add(heap.get(0));
                delete(heap.get(0).model);
            }
            for (int i = desc.size() - 1; i >= 0; i--) System.out.println(desc.get(i));
            heap = backup;
        }
    }

    // Q2.7 [2.0 pts] main: 4.1 build, 4.2 pre-order, 4.3 delete + pre-order,
    // 4.4 heapSort.
    public static void main(String[] args) {
        MaxHeap heap = new MaxHeap();
        heap.insert(new Motorbike(1, "Honda CBR500R", "CBR500R-2024", 500));
        heap.insert(new Motorbike(2, "Yamaha YZF-R3", "YZF-R3-2023", 321));
        heap.insert(new Motorbike(3, "Kawasaki Ninja 650", "Ninja650-2024", 649));
        heap.insert(new Motorbike(4, "Suzuki GSX-R750", "GSX-R750-2023", 750));
        heap.insert(new Motorbike(5, "KTM Duke 390", "Duke390-2024", 373));
        heap.insert(new Motorbike(6, "Ducati Panigale V4", "PanigaleV4-2024", 1103));
        heap.insert(new Motorbike(7, "BMW S1000RR", "S1000RR-2023", 999));
        heap.insert(new Motorbike(8, "Harley-Davidson Iron 883", "Iron883-2024", 883));
        heap.insert(new Motorbike(9, "Triumph Street Triple RS", "TripleRS-2023", 765));
        heap.insert(new Motorbike(10, "Royal Enfield Interceptor 650", "Interceptor650-2024", 648));

        System.out.println("Pre-order traversal:");
        heap.preOrderTraverse(0);

        System.out.println();
        System.out.println("After deleting S1000RR-2023:");
        heap.delete("S1000RR-2023");
        heap.preOrderTraverse(0);

        System.out.println();
        System.out.println("HeapSort result:");
        heap.heapSort();
    }
}
`;

/* ─────────────────── OUTPUT ĐÃ CHẠY THẬT (javac + java) ─────────────────── */

const OUT_Q1 = `Original list:
1. Honda CBR500R - CBR500R-2024 - 500cc
2. Yamaha YZF-R3 - YZF-R3-2023 - 321cc
3. Kawasaki Ninja 650 - Ninja650-2024 - 649cc
4. Suzuki GSX-R750 - GSX-R750-2023 - 750cc
5. KTM Duke 390 - Duke390-2024 - 373cc
6. Ducati Panigale V4 - PanigaleV4-2024 - 1103cc
7. BMW S1000RR - S1000RR-2023 - 999cc
8. Harley-Davidson Iron 883 - Iron883-2024 - 883cc
9. Triumph Street Triple RS - TripleRS-2023 - 765cc
10. Royal Enfield Interceptor 650 - Interceptor650-2024 - 648cc

After removing last:
1. Honda CBR500R - CBR500R-2024 - 500cc
2. Yamaha YZF-R3 - YZF-R3-2023 - 321cc
3. Kawasaki Ninja 650 - Ninja650-2024 - 649cc
4. Suzuki GSX-R750 - GSX-R750-2023 - 750cc
5. KTM Duke 390 - Duke390-2024 - 373cc
6. Ducati Panigale V4 - PanigaleV4-2024 - 1103cc
7. BMW S1000RR - S1000RR-2023 - 999cc
8. Harley-Davidson Iron 883 - Iron883-2024 - 883cc
9. Triumph Street Triple RS - TripleRS-2023 - 765cc`;

const OUT_PREORDER = `Pre-order traversal:
6. Ducati Panigale V4 - PanigaleV4-2024 - 1103cc
8. Harley-Davidson Iron 883 - Iron883-2024 - 883cc
9. Triumph Street Triple RS - TripleRS-2023 - 765cc
2. Yamaha YZF-R3 - YZF-R3-2023 - 321cc
3. Kawasaki Ninja 650 - Ninja650-2024 - 649cc
10. Royal Enfield Interceptor 650 - Interceptor650-2024 - 648cc
5. KTM Duke 390 - Duke390-2024 - 373cc
7. BMW S1000RR - S1000RR-2023 - 999cc
1. Honda CBR500R - CBR500R-2024 - 500cc
4. Suzuki GSX-R750 - GSX-R750-2023 - 750cc`;

const OUT_AFTER_DELETE = `After deleting S1000RR-2023:
6. Ducati Panigale V4 - PanigaleV4-2024 - 1103cc
8. Harley-Davidson Iron 883 - Iron883-2024 - 883cc
9. Triumph Street Triple RS - TripleRS-2023 - 765cc
2. Yamaha YZF-R3 - YZF-R3-2023 - 321cc
3. Kawasaki Ninja 650 - Ninja650-2024 - 649cc
10. Royal Enfield Interceptor 650 - Interceptor650-2024 - 648cc
4. Suzuki GSX-R750 - GSX-R750-2023 - 750cc
1. Honda CBR500R - CBR500R-2024 - 500cc
5. KTM Duke 390 - Duke390-2024 - 373cc`;

const OUT_HEAPSORT = `HeapSort result:
2. Yamaha YZF-R3 - YZF-R3-2023 - 321cc
5. KTM Duke 390 - Duke390-2024 - 373cc
1. Honda CBR500R - CBR500R-2024 - 500cc
10. Royal Enfield Interceptor 650 - Interceptor650-2024 - 648cc
3. Kawasaki Ninja 650 - Ninja650-2024 - 649cc
4. Suzuki GSX-R750 - GSX-R750-2023 - 750cc
9. Triumph Street Triple RS - TripleRS-2023 - 765cc
8. Harley-Davidson Iron 883 - Iron883-2024 - 883cc
6. Ducati Panigale V4 - PanigaleV4-2024 - 1103cc`;

const OUT_Q2_FULL = `${OUT_PREORDER}\n\n${OUT_AFTER_DELETE}\n\n${OUT_HEAPSORT}`;

/* ─────────────────────────── CÁC CÂU ─────────────────────────── */

const q1 = {
  kind: 'CODE',
  points: 2,
  language: 'java',
  prompt: B(
    `<p><strong>Q1 — PE_SP25_Q1.java — 2 marks</strong></p>
     <p>Create a class named <code>PE_SP25_Q1</code> (saved in <code>PE_SP25_Q1.java</code>) that uses a <b>singly linked list</b> to manage the motorbike data of the table in the instructions. The singly linked list consists of:</p>
     <ol>
       <li><b>[0.5 points]</b> A <code>Motorbike</code> class that holds the ID (<code>id</code> - integer), name (<code>name</code> - String), model (<code>model</code> - String), and engine capacity (<code>enCap</code> - integer) of a motorbike.</li>
       <li><b>[1 point]</b> <code>addFirst</code> and <code>removeLast</code> methods: the former inserts a new node at the head of the list, while the latter removes the tail node.</li>
       <li><b>[0.5 points]</b> Provide a <code>main</code> method to test the implementation.</li>
     </ol>
     <p><b>Note:</b> the paper prescribes no <code>toString()</code> format and no insertion order for <code>main</code>. The skeleton and expected output below use the format <code>&lt;id&gt;. &lt;name&gt; - &lt;model&gt; - &lt;enCap&gt;cc</code>, and push the 10 rows with <code>addFirst</code> in reverse table order (10 down to 1) so the printed list reads in the table's order.</p>`,
    `<p><strong>Câu 1 — PE_SP25_Q1.java — 2 điểm</strong></p>
     <p>Tạo lớp tên <code>PE_SP25_Q1</code> (lưu trong <code>PE_SP25_Q1.java</code>) dùng <b>danh sách liên kết đơn</b> để quản lý dữ liệu xe mô tô trong bảng ở phần hướng dẫn. Danh sách liên kết đơn gồm:</p>
     <ol>
       <li><b>[0,5 điểm]</b> Lớp <code>Motorbike</code> giữ ID (<code>id</code> - int), tên (<code>name</code> - String), model (<code>model</code> - String) và dung tích động cơ (<code>enCap</code> - int) của một chiếc xe.</li>
       <li><b>[1 điểm]</b> Hai method <code>addFirst</code> và <code>removeLast</code>: cái đầu chèn node mới vào ĐẦU danh sách, cái sau xoá node CUỐI.</li>
       <li><b>[0,5 điểm]</b> Viết method <code>main</code> để kiểm thử phần cài đặt.</li>
     </ol>
     <p><b>Lưu ý:</b> đề không quy định định dạng <code>toString()</code> lẫn thứ tự chèn trong <code>main</code>. Khung mã và output mong đợi dưới đây dùng định dạng <code>&lt;id&gt;. &lt;name&gt; - &lt;model&gt; - &lt;enCap&gt;cc</code>, và gọi <code>addFirst</code> theo thứ tự NGƯỢC bảng (10 xuống 1) để danh sách in ra đọc xuôi đúng thứ tự bảng.</p>`,
  ),
  starterCode: Q1_STARTER,
  sampleSolution: Q1_SOLUTION,
  expectedOutput: OUT_Q1,
  explanation: B(
    `<p>Verified by compiling and running this exact file with <code>javac</code>/<code>java</code>. <code>addFirst</code> is O(1): the new node points at the old head, then becomes the head. <code>removeLast</code> must walk to the <b>second-to-last</b> node (the <code>current.next.next != null</code> test) and cut its <code>next</code> — a singly linked list has no back-pointer, so the tail cannot be reached directly. Two edge cases decide the mark: an empty list (do nothing) and a one-node list (set <code>head = null</code>; the walk loop would dereference <code>head.next.next</code> on a null <code>head.next</code> otherwise).</p><p>Because the pushes run in reverse table order, the printed list reads 1 to 10; <code>removeLast()</code> then drops the tail, motorbike 10 (Royal Enfield Interceptor 650).</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật đúng file này bằng <code>javac</code>/<code>java</code>. <code>addFirst</code> là O(1): node mới trỏ vào head cũ rồi trở thành head. <code>removeLast</code> phải đi tới node <b>áp chót</b> (điều kiện <code>current.next.next != null</code>) rồi cắt <code>next</code> của nó — danh sách liên kết đơn không có con trỏ ngược nên không tới thẳng được node cuối. Hai trường hợp biên quyết định điểm: danh sách rỗng (không làm gì) và danh sách một node (gán <code>head = null</code>; nếu không, vòng lặp sẽ truy cập <code>head.next.next</code> trong khi <code>head.next</code> là null).</p><p>Vì các lần chèn chạy ngược thứ tự bảng nên danh sách in ra đọc từ 1 tới 10; <code>removeLast()</code> sau đó bỏ node cuối là xe số 10 (Royal Enfield Interceptor 650).</p>`,
  ),
  rubric: [
    { id: 'motorbike_class', criterion: B('Motorbike class declares all four attributes (id, name, model, enCap) with a constructor and a readable toString().', 'Lớp Motorbike khai báo đủ 4 thuộc tính (id, name, model, enCap), có constructor và toString() đọc được.'), weight: 1, maxScore: 0.5 },
    { id: 'add_first', criterion: B('addFirst correctly links the new node in front of the current head and updates head (works on an empty list too).', 'addFirst nối đúng node mới vào trước head hiện tại và cập nhật head (chạy đúng cả khi danh sách rỗng).'), weight: 1, maxScore: 0.5 },
    { id: 'remove_last', criterion: B('removeLast walks to the second-to-last node and cuts its next; handles the empty list and the single-node list without a NullPointerException.', 'removeLast đi tới node áp chót rồi cắt next của nó; xử lý đúng danh sách rỗng và danh sách một node, không ném NullPointerException.'), weight: 1, maxScore: 0.5 },
    { id: 'main_test', criterion: B('main builds the list from the 10 rows of the data table, prints it, calls removeLast() and prints it again.', 'main dựng danh sách từ 10 dòng dữ liệu, in ra, gọi removeLast() rồi in lại.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'CODE',
  points: 1,
  language: 'java',
  prompt: B(
    `<p><strong>Q2.1 — the Motorbike class of PE_SP25_Q2.java — 1 mark</strong></p>
     <p>Create a class named <code>PE_SP25_Q2</code> (saved in <code>PE_SP25_Q2.java</code>) containing a <code>Motorbike</code> class that stores the following information:</p>
     <ul>
       <li>Motorbike ID (<code>id</code> - integer)</li>
       <li>Motorbike name (<code>name</code> - String)</li>
       <li>Motorbike model (<code>model</code> - String)</li>
       <li>Motorbike engine capacity (<code>enCap</code> - integer)</li>
       <li>A <code>compareTo</code> method used to compare the engine capacity with another motorbike.</li>
     </ul>
     <p>The whole file's skeleton is given below; this question grades the <code>Motorbike</code> class only. Note that <code>compareTo</code> must return a negative number, zero, or a positive number when this motorbike's engine capacity is respectively smaller than, equal to, or larger than the other's — the <code>MaxHeap</code> in the following questions depends on that contract.</p>`,
    `<p><strong>Câu 2 — lớp Motorbike trong PE_SP25_Q2.java — 1 điểm</strong></p>
     <p>Tạo lớp tên <code>PE_SP25_Q2</code> (lưu trong <code>PE_SP25_Q2.java</code>) chứa lớp <code>Motorbike</code> lưu các thông tin:</p>
     <ul>
       <li>ID xe (<code>id</code> - int)</li>
       <li>Tên xe (<code>name</code> - String)</li>
       <li>Model xe (<code>model</code> - String)</li>
       <li>Dung tích động cơ (<code>enCap</code> - int)</li>
       <li>Method <code>compareTo</code> dùng để so sánh dung tích động cơ với một xe khác.</li>
     </ul>
     <p>Khung của cả file cho bên dưới; câu này chỉ chấm phần lớp <code>Motorbike</code>. Lưu ý <code>compareTo</code> phải trả về số âm, 0 hoặc số dương khi dung tích của xe này lần lượt nhỏ hơn, bằng hoặc lớn hơn xe kia — lớp <code>MaxHeap</code> ở các câu sau phụ thuộc vào đúng giao kèo đó.</p>`,
  ),
  starterCode: Q2_STARTER,
  sampleSolution: Q2_SOLUTION,
  expectedOutput: B(
    `(No isolated output — the class produces none on its own. Its correctness is proved by the heap questions: the pre-order traversal below is only reachable if compareTo orders motorbikes by enCap.)`,
    `(Không có output riêng — lớp này tự nó không in gì. Tính đúng đắn được chứng minh qua các câu về heap: kết quả duyệt pre-order chỉ ra đúng khi compareTo sắp theo enCap.)`,
  ),
  explanation: B(
    `<p><code>Integer.compare(this.enCap, other.enCap)</code> is the safe form: writing <code>this.enCap - other.enCap</code> works for these values but overflows on extreme ints, and a heap that silently mis-compares is very hard to debug in an exam.</p><p>Verified indirectly but rigorously: <code>insert</code>, <code>delete</code> and <code>heapSort</code> all route every comparison through <code>compareTo</code>, so the verified heap array after the 10 insertions (1103 883 999 765 648 500 750 321 649 373) is only reachable when <code>compareTo</code> orders by <code>enCap</code> ascending.</p>`,
    `<p><code>Integer.compare(this.enCap, other.enCap)</code> là dạng an toàn: viết <code>this.enCap - other.enCap</code> vẫn chạy với dữ liệu này nhưng tràn số với int cực trị, mà heap so sánh sai âm thầm thì rất khó dò trong phòng thi.</p><p>Đã kiểm gián tiếp nhưng chặt chẽ: <code>insert</code>, <code>delete</code> và <code>heapSort</code> đều đi qua <code>compareTo</code> cho mọi phép so sánh, nên mảng heap đã verify sau 10 lần chèn (1103 883 999 765 648 500 750 321 649 373) chỉ ra được khi <code>compareTo</code> sắp tăng dần theo <code>enCap</code>.</p>`,
  ),
  rubric: [
    { id: 'attributes', criterion: B('Declares all four attributes with the right types: id (int), name (String), model (String), enCap (int), plus a usable constructor.', 'Khai báo đủ 4 thuộc tính đúng kiểu: id (int), name (String), model (String), enCap (int), kèm constructor dùng được.'), weight: 1, maxScore: 0.4 },
    { id: 'compare_to', criterion: B('compareTo compares this motorbike\'s engine capacity against the other\'s and returns a negative / zero / positive value accordingly.', 'compareTo so dung tích động cơ của xe này với xe kia và trả về giá trị âm / 0 / dương tương ứng.'), weight: 1, maxScore: 0.4 },
    { id: 'to_string', criterion: B('Provides a toString() that displays the motorbike readably, so the traversals can print objects directly.', 'Có toString() hiển thị xe đọc được, để các phép duyệt in thẳng đối tượng ra.'), weight: 1, maxScore: 0.2 },
  ],
};

const q3 = {
  kind: 'CODE',
  points: 2,
  language: 'java',
  prompt: B(
    `<p><strong>Q2.2 + Q2.3 — MaxHeap constructor and insert — 2 marks</strong></p>
     <p>A <code>MaxHeap</code> class, implemented with an <b>array-based</b> structure, stores and manages motorbikes according to their engine capacities.</p>
     <ul>
       <li><b>2.1 [0.5 point]</b> Build the constructor together with the parameters needed to manage the array-based max heap.</li>
       <li><b>2.2 [1.5 points]</b> Implement an <code>insert</code> method that adds a motorbike to the MaxHeap. The <code>compareTo</code> method must be used to compare the motorbikes' engine capacities so that the max heap property is maintained after each insertion.</li>
     </ul>
     <p>The expected output below is the pre-order traversal of the heap after all 10 motorbikes of the data table have been inserted in table order (ID 1 first, ID 10 last) — it is the observable proof that <code>insert</code> kept the heap property.</p>`,
    `<p><strong>Câu 3 — constructor và insert của MaxHeap — 2 điểm</strong></p>
     <p>Lớp <code>MaxHeap</code>, cài đặt bằng cấu trúc <b>mảng</b>, lưu và quản lý các xe theo dung tích động cơ.</p>
     <ul>
       <li><b>2.1 [0,5 điểm]</b> Viết constructor cùng các tham số cần thiết để quản lý max heap dạng mảng.</li>
       <li><b>2.2 [1,5 điểm]</b> Cài method <code>insert</code> thêm một xe vào MaxHeap. Phải dùng <code>compareTo</code> để so dung tích động cơ sao cho tính chất max heap được giữ sau mỗi lần chèn.</li>
     </ul>
     <p>Output mong đợi bên dưới là kết quả duyệt pre-order của heap sau khi chèn đủ 10 xe trong bảng theo đúng thứ tự bảng (ID 1 trước, ID 10 sau cùng) — đó là bằng chứng quan sát được rằng <code>insert</code> đã giữ đúng tính chất heap.</p>`,
  ),
  starterCode: Q2_STARTER,
  sampleSolution: Q2_SOLUTION,
  expectedOutput: OUT_PREORDER,
  explanation: B(
    `<p>Verified by compiling and running the file: the internal array after the 10 insertions is <code>1103 883 999 765 648 500 750 321 649 373</code> (hand-computed independently first, then confirmed by the run).</p><p><code>insert</code> appends at the end of the array and sifts the new element UP: while it is bigger than its parent at index <code>(i-1)/2</code>, swap and continue. That is O(log n) and is the only place the heap property can be violated after an append. Two frequent mistakes cost the mark: comparing with <code>&gt;=</code> instead of <code>&gt;</code> (needless swaps, still correct but not what compareTo's contract asks), and sifting DOWN instead of up — sifting down from the last index does nothing, so the heap silently degrades into an unsorted array.</p><p>Note the array is <b>not</b> sorted: a max heap only guarantees every parent is bigger than its children, which is why 999 sits at index 2 while 883 sits at index 1.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật: mảng bên trong sau 10 lần chèn là <code>1103 883 999 765 648 500 750 321 649 373</code> (đã tính tay độc lập trước rồi mới đối chiếu với kết quả chạy).</p><p><code>insert</code> thêm vào cuối mảng rồi đẩy phần tử mới LÊN: chừng nào nó lớn hơn cha ở chỉ số <code>(i-1)/2</code> thì hoán vị và đi tiếp. Đó là O(log n) và là chỗ duy nhất tính chất heap có thể bị vi phạm sau khi thêm. Hai lỗi hay gặp làm mất điểm: so bằng <code>&gt;=</code> thay vì <code>&gt;</code> (hoán vị thừa, vẫn đúng nhưng không đúng giao kèo của compareTo), và đẩy XUỐNG thay vì lên — đẩy xuống từ chỉ số cuối thì không làm gì cả, heap âm thầm thành mảng lộn xộn.</p><p>Chú ý mảng <b>không</b> được sắp xếp: max heap chỉ bảo đảm mọi cha lớn hơn con, nên 999 nằm ở chỉ số 2 trong khi 883 nằm ở chỉ số 1.</p>`,
  ),
  rubric: [
    { id: 'constructor', criterion: B('Constructor creates the array-based storage (e.g. an ArrayList or an array plus a size counter) in a usable empty state.', 'Constructor tạo vùng lưu dạng mảng (ArrayList, hoặc mảng kèm biến đếm kích thước) ở trạng thái rỗng dùng được.'), weight: 1, maxScore: 0.5 },
    { id: 'append', criterion: B('insert appends the new motorbike at the end of the array-based structure.', 'insert thêm xe mới vào cuối cấu trúc mảng.'), weight: 1, maxScore: 0.5 },
    { id: 'sift_up', criterion: B('Sifts the new element up while it compares greater than its parent at index (i-1)/2, stopping at the root.', 'Đẩy phần tử mới lên chừng nào nó lớn hơn cha ở chỉ số (i-1)/2, dừng tại gốc.'), weight: 1, maxScore: 0.7 },
    { id: 'uses_compareto', criterion: B('Every comparison goes through Motorbike.compareTo, as the paper requires — not a raw field comparison.', 'Mọi phép so sánh đi qua Motorbike.compareTo đúng như đề yêu cầu, không so trực tiếp trường dữ liệu.'), weight: 1, maxScore: 0.3 },
  ],
};

const q4 = {
  kind: 'CODE',
  points: 0.5,
  language: 'java',
  prompt: B(
    `<p><strong>Q2.3 — preOrderTraverse — 0.5 mark</strong></p>
     <ul>
       <li>File: <code>PE_SP25_Q2.java</code>, class <code>MaxHeap</code></li>
       <li>Method to complete: <code>preOrderTraverse(int index)</code></li>
       <li>Task: traverse the max heap in pre-order and print each motorbike.</li>
     </ul>
     <p>The heap is array-based, so the tree is implicit: the node stored at <code>index</code> has its left child at <code>2*index+1</code> and its right child at <code>2*index+2</code>. Pre-order visits the node first, then the left subtree, then the right subtree. The recursion stops when the index runs past the end of the array.</p>`,
    `<p><strong>Câu 4 — preOrderTraverse — 0,5 điểm</strong></p>
     <ul>
       <li>File: <code>PE_SP25_Q2.java</code>, lớp <code>MaxHeap</code></li>
       <li>Method cần hoàn thiện: <code>preOrderTraverse(int index)</code></li>
       <li>Nhiệm vụ: duyệt max heap theo pre-order và in từng chiếc xe.</li>
     </ul>
     <p>Heap cài bằng mảng nên cây là ngầm định: node ở <code>index</code> có con trái ở <code>2*index+1</code> và con phải ở <code>2*index+2</code>. Pre-order thăm node trước, rồi cây con trái, rồi cây con phải. Đệ quy dừng khi chỉ số vượt quá cuối mảng.</p>`,
  ),
  starterCode: Q2_STARTER,
  sampleSolution: Q2_SOLUTION,
  expectedOutput: OUT_PREORDER,
  explanation: B(
    `<p>Verified by compiling and running the file. With the heap array <code>1103 883 999 765 648 500 750 321 649 373</code>, pre-order from index 0 visits indices 0, 1, 3, 7, 8, 4, 9, 2, 5, 6 — that is 1103, 883, 765, 321, 649, 648, 373, 999, 500, 750, exactly the order printed.</p><p>The base case matters: <code>if (index &gt;= heap.size()) return;</code> must come first, otherwise the recursion indexes past the array and throws <code>IndexOutOfBoundsException</code>. Printing after the recursive calls gives post-order and printing between them gives in-order — both are wrong here.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật. Với mảng heap <code>1103 883 999 765 648 500 750 321 649 373</code>, pre-order từ chỉ số 0 thăm các chỉ số 0, 1, 3, 7, 8, 4, 9, 2, 5, 6 — tức 1103, 883, 765, 321, 649, 648, 373, 999, 500, 750, đúng thứ tự đã in.</p><p>Trường hợp cơ sở rất quan trọng: <code>if (index &gt;= heap.size()) return;</code> phải đặt đầu tiên, nếu không đệ quy sẽ truy cập vượt mảng và ném <code>IndexOutOfBoundsException</code>. In sau hai lời gọi đệ quy là post-order, in xen giữa là in-order — cả hai đều sai ở đây.</p>`,
  ),
  rubric: [
    { id: 'base_case', criterion: B('Stops the recursion when index is past the end of the array, before touching the element.', 'Dừng đệ quy khi index vượt quá cuối mảng, trước khi truy cập phần tử.'), weight: 1, maxScore: 0.2 },
    { id: 'preorder_shape', criterion: B('Prints the current node first, then recurses on 2*index+1 and 2*index+2 in that order.', 'In node hiện tại trước, rồi đệ quy 2*index+1 và 2*index+2 theo đúng thứ tự đó.'), weight: 1, maxScore: 0.3 },
  ],
};

const q5 = {
  kind: 'CODE',
  points: 1.5,
  language: 'java',
  prompt: B(
    `<p><strong>Q2.4 — delete — 1.5 marks</strong></p>
     <ul>
       <li>File: <code>PE_SP25_Q2.java</code>, class <code>MaxHeap</code></li>
       <li>Method to complete: <code>delete(String model)</code></li>
       <li>Task: remove a motorbike by its model. The max heap property must be maintained after each deletion.</li>
     </ul>
     <p>The model is not the heap's ordering key (the engine capacity is), so the target can sit anywhere — it has to be found by a linear scan. The standard removal then swaps the target with the last element, drops the last slot, and repairs the heap at that index.</p>
     <p>The expected output below is the pre-order traversal after deleting the motorbike whose model is <code>"S1000RR-2023"</code> (BMW S1000RR, 999cc) from the full 10-element heap.</p>`,
    `<p><strong>Câu 5 — delete — 1,5 điểm</strong></p>
     <ul>
       <li>File: <code>PE_SP25_Q2.java</code>, lớp <code>MaxHeap</code></li>
       <li>Method cần hoàn thiện: <code>delete(String model)</code></li>
       <li>Nhiệm vụ: xoá một xe theo model. Tính chất max heap phải được giữ sau mỗi lần xoá.</li>
     </ul>
     <p>Model KHÔNG phải khoá sắp xếp của heap (dung tích động cơ mới là), nên phần tử cần xoá có thể nằm bất cứ đâu — phải tìm bằng cách quét tuyến tính. Cách xoá chuẩn sau đó hoán vị phần tử cần xoá với phần tử cuối, bỏ ô cuối, rồi sửa lại heap tại chỉ số đó.</p>
     <p>Output mong đợi bên dưới là kết quả duyệt pre-order sau khi xoá chiếc xe có model <code>"S1000RR-2023"</code> (BMW S1000RR, 999cc) khỏi heap đủ 10 phần tử.</p>`,
  ),
  starterCode: Q2_STARTER,
  sampleSolution: Q2_SOLUTION,
  expectedOutput: OUT_AFTER_DELETE,
  explanation: B(
    `<p>Verified by compiling and running the file. 999 sits at index 2; the last element 373 (index 9) takes its place, the array shrinks to 9, and index 2's children are 500 and 750 — so 373 sinks below 750. The array becomes <code>1103 883 750 765 648 500 373 321 649</code>, whose pre-order is exactly the output above.</p>
     <p><b>Both repair directions are needed in general.</b> The element pulled in from the end can be larger than its new parent (sift up) or smaller than a child (sift down); a correct <code>delete</code> tries both. The submission that ships with this paper only sifts down, which is incorrect in principle. Both variants were compiled and run on this dataset and produced the identical array <code>1103 883 750 765 648 500 373 321 649</code> — deleting 999 happens to be a case where sift-up does nothing — so the expected output above is unaffected either way.</p>
     <p>Two more marks-losing details: the linear scan must stop at the first match and return quietly when the model is absent, and the repair must be skipped when the deleted element <i>was</i> the last slot (nothing was moved in).</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật. 999 nằm ở chỉ số 2; phần tử cuối 373 (chỉ số 9) thế chỗ, mảng co còn 9, và hai con của chỉ số 2 là 500 với 750 — nên 373 chìm xuống dưới 750. Mảng thành <code>1103 883 750 765 648 500 373 321 649</code>, duyệt pre-order ra đúng output trên.</p>
     <p><b>Nói chung phải sửa theo CẢ HAI hướng.</b> Phần tử kéo từ cuối về có thể lớn hơn cha mới (phải đẩy lên) hoặc nhỏ hơn con (phải đẩy xuống); <code>delete</code> đúng thì thử cả hai. Bài nộp đi kèm đề chỉ đẩy xuống, về nguyên tắc là sai. Đã biên dịch và chạy CẢ HAI bản trên bộ dữ liệu này, cho ra mảng giống hệt nhau <code>1103 883 750 765 648 500 373 321 649</code> — xoá 999 tình cờ rơi vào trường hợp đẩy-lên không làm gì — nên output mong đợi ở trên không bị ảnh hưởng theo hướng nào.</p>
     <p>Hai chi tiết nữa hay mất điểm: quét tuyến tính phải dừng ở kết quả khớp đầu tiên và trả về im lặng khi không có model đó, và phải bỏ qua bước sửa heap khi phần tử bị xoá CHÍNH LÀ ô cuối (không có gì được chuyển vào).</p>`,
  ),
  rubric: [
    { id: 'find_by_model', criterion: B('Locates the element by a linear scan comparing model with equals(), stops at the first match, and returns harmlessly when no motorbike has that model.', 'Tìm phần tử bằng quét tuyến tính, so model bằng equals(), dừng ở kết quả khớp đầu tiên và trả về vô hại khi không có xe nào mang model đó.'), weight: 1, maxScore: 0.5 },
    { id: 'swap_remove', criterion: B('Swaps the target with the last element and physically removes the last slot (shrinking the heap by one), rather than leaving a hole.', 'Hoán vị phần tử cần xoá với phần tử cuối rồi xoá hẳn ô cuối (heap giảm 1 phần tử), không để lại lỗ hổng.'), weight: 1, maxScore: 0.4 },
    { id: 'restore_heap', criterion: B('Restores the max heap property at the affected index — sifting the moved element down below a bigger child, and up above a smaller parent when needed.', 'Khôi phục tính chất max heap tại chỉ số bị ảnh hưởng — đẩy phần tử vừa chuyển vào xuống dưới con lớn hơn, và đẩy lên trên cha nhỏ hơn khi cần.'), weight: 1, maxScore: 0.6 },
  ],
};

const q6 = {
  kind: 'CODE',
  points: 1,
  language: 'java',
  prompt: B(
    `<p><strong>Q2 part 3 — heapSort — 1 mark</strong></p>
     <ul>
       <li>File: <code>PE_SP25_Q2.java</code>, class <code>MaxHeap</code></li>
       <li>Method to complete: <code>heapSort()</code></li>
       <li>Task: implement a <code>heapSort</code> method that uses the constructed <code>MaxHeap</code> class to sort the motorbike array in <b>increasing</b> order of engine capacities.</li>
     </ul>
     <p><b>Watch the direction.</b> This is a MAX heap, so repeatedly taking the root gives <b>decreasing</b> order — the increasing order the paper asks for needs that sequence reversed (or the elements written into the array back-to-front).</p>
     <p>The expected output below is <code>heapSort()</code> called on the 9-motorbike heap that remains after <code>"S1000RR-2023"</code> has been deleted, i.e. the state <code>main</code> reaches at step 4.4.</p>`,
    `<p><strong>Câu 6 — heapSort — 1 điểm</strong></p>
     <ul>
       <li>File: <code>PE_SP25_Q2.java</code>, lớp <code>MaxHeap</code></li>
       <li>Method cần hoàn thiện: <code>heapSort()</code></li>
       <li>Nhiệm vụ: cài method <code>heapSort</code> dùng chính lớp <code>MaxHeap</code> đã dựng để sắp mảng xe theo dung tích động cơ <b>tăng dần</b>.</li>
     </ul>
     <p><b>Chú ý chiều sắp xếp.</b> Đây là MAX heap nên rút gốc liên tiếp cho ra thứ tự <b>giảm dần</b> — muốn tăng dần như đề yêu cầu thì phải đảo dãy đó lại (hoặc ghi ngược từ cuối mảng về đầu).</p>
     <p>Output mong đợi bên dưới là <code>heapSort()</code> gọi trên heap 9 xe còn lại sau khi đã xoá <code>"S1000RR-2023"</code>, tức đúng trạng thái <code>main</code> đạt tới ở bước 4.4.</p>`,
  ),
  starterCode: Q2_STARTER,
  sampleSolution: Q2_SOLUTION,
  expectedOutput: OUT_HEAPSORT,
  explanation: B(
    `<p>Verified by compiling and running the file: the 9 remaining motorbikes come out 321, 373, 500, 648, 649, 750, 765, 883, 1103 cc — ascending, as required.</p>
     <p>The classic max-heap sort takes the root nine times (1103, 883, 765, 750, 649, 648, 500, 373, 321) and then prints that list backwards. Printing it forwards is the single most common way to lose this mark — it satisfies "heapSort" but contradicts "increasing order".</p>
     <p>The sample solution also keeps a backup of the array and restores it at the end, so the object is still a usable heap after sorting. That is not required by the paper, but it is what lets <code>main</code> call <code>heapSort</code> last without destroying anything, and it costs one extra list copy.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật: 9 xe còn lại ra theo thứ tự 321, 373, 500, 648, 649, 750, 765, 883, 1103 cc — tăng dần, đúng yêu cầu.</p>
     <p>Cách sắp xếp max-heap kinh điển là rút gốc chín lần (1103, 883, 765, 750, 649, 648, 500, 373, 321) rồi in ngược danh sách đó. In xuôi là cách mất điểm phổ biến nhất ở câu này — vẫn là "heapSort" nhưng trái với yêu cầu "tăng dần".</p>
     <p>Lời giải mẫu còn giữ một bản sao lưu của mảng và khôi phục ở cuối, để đối tượng vẫn là một heap dùng được sau khi sắp. Đề không bắt buộc, nhưng nhờ đó <code>main</code> gọi <code>heapSort</code> ở cuối mà không phá hỏng gì, đổi lại tốn thêm một lần chép danh sách.</p>`,
  ),
  rubric: [
    { id: 'uses_heap', criterion: B('Sorts by using the MaxHeap itself (repeatedly taking/removing the root), not by calling a library sort or an unrelated algorithm.', 'Sắp xếp bằng chính MaxHeap (rút/xoá gốc liên tiếp), không gọi hàm sắp xếp thư viện hay thuật toán không liên quan.'), weight: 1, maxScore: 0.4 },
    { id: 'increasing_order', criterion: B('Produces INCREASING order of engine capacity — the descending extraction sequence is reversed (or written back-to-front).', 'Kết quả TĂNG DẦN theo dung tích động cơ — dãy rút ra giảm dần đã được đảo lại (hoặc ghi ngược từ cuối).'), weight: 1, maxScore: 0.4 },
    { id: 'complete_output', criterion: B('Every element currently in the heap appears exactly once in the output.', 'Mọi phần tử đang có trong heap xuất hiện đúng một lần trong kết quả.'), weight: 1, maxScore: 0.2 },
  ],
};

const q7 = {
  kind: 'CODE',
  points: 2,
  language: 'java',
  prompt: B(
    `<p><strong>Q2 part 4 — the main method — 2 marks</strong></p>
     <p>A <code>main</code> method to test the implementation by carrying out the following tasks:</p>
     <ul>
       <li><b>4.1 [0.5 point]</b> Instantiate the maxHeap and add the motorbikes into it.</li>
       <li><b>4.2 [0.5 point]</b> Run a pre-order traversal and display the motorbikes on the screen.</li>
       <li><b>4.3 [0.5 point]</b> Delete the motorbike whose model is <code>"S1000RR-2023"</code>, then run the pre-order traversal again.</li>
       <li><b>4.4 [0.5 point]</b> Apply the <code>heapSort</code> method to the motorbikes stored in the maxHeap.</li>
     </ul>
     <p>Insert the 10 motorbikes in the data table's order (ID 1 first, ID 10 last). The expected output below is the complete console output of the finished <code>PE_SP25_Q2.java</code>.</p>`,
    `<p><strong>Câu 7 — method main — 2 điểm</strong></p>
     <p>Viết method <code>main</code> kiểm thử phần cài đặt, thực hiện các việc sau:</p>
     <ul>
       <li><b>4.1 [0,5 điểm]</b> Khởi tạo maxHeap và thêm các xe vào.</li>
       <li><b>4.2 [0,5 điểm]</b> Chạy duyệt pre-order và hiển thị các xe ra màn hình.</li>
       <li><b>4.3 [0,5 điểm]</b> Xoá chiếc xe có model là <code>"S1000RR-2023"</code>, rồi chạy lại duyệt pre-order.</li>
       <li><b>4.4 [0,5 điểm]</b> Áp dụng method <code>heapSort</code> lên các xe đang lưu trong maxHeap.</li>
     </ul>
     <p>Chèn 10 chiếc xe theo đúng thứ tự bảng dữ liệu (ID 1 trước, ID 10 sau cùng). Output mong đợi bên dưới là toàn bộ output console của file <code>PE_SP25_Q2.java</code> hoàn chỉnh.</p>`,
  ),
  starterCode: Q2_STARTER,
  sampleSolution: Q2_SOLUTION,
  expectedOutput: OUT_Q2_FULL,
  explanation: B(
    `<p>Verified by compiling and running the finished file — this is its exact console output, byte for byte.</p>
     <p>The order of the four steps is what makes the output readable, and it is also what the marks are for: the first traversal shows the heap built by 10 insertions, the second shows the same heap after one deletion (9 elements, and 750 has risen into index 2 where 999 used to be), and <code>heapSort</code> then prints those same 9 motorbikes in ascending capacity.</p>
     <p>One trap: <code>preOrderTraverse</code> takes a starting index, so it must be called as <code>preOrderTraverse(0)</code>. Calling it with no argument will not compile, and starting anywhere but 0 silently prints only a subtree.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật file hoàn chỉnh — đây đúng là output console của nó, từng byte một.</p>
     <p>Thứ tự bốn bước là thứ làm output đọc được, và cũng chính là chỗ ăn điểm: lần duyệt đầu cho thấy heap dựng từ 10 lần chèn, lần duyệt sau cho thấy vẫn heap đó sau một lần xoá (còn 9 phần tử, và 750 đã lên chỉ số 2 chỗ 999 từng nằm), rồi <code>heapSort</code> in đúng 9 chiếc xe đó theo dung tích tăng dần.</p>
     <p>Một cái bẫy: <code>preOrderTraverse</code> nhận chỉ số bắt đầu nên phải gọi là <code>preOrderTraverse(0)</code>. Gọi không tham số sẽ không biên dịch được, còn bắt đầu từ chỉ số khác 0 sẽ âm thầm chỉ in ra một cây con.</p>`,
  ),
  rubric: [
    { id: 'build', criterion: B('4.1 — instantiates the MaxHeap and inserts all 10 motorbikes of the data table with the correct id / name / model / enCap values.', '4.1 — khởi tạo MaxHeap và chèn đủ 10 xe trong bảng dữ liệu với đúng giá trị id / name / model / enCap.'), weight: 1, maxScore: 0.5 },
    { id: 'first_traversal', criterion: B('4.2 — runs the pre-order traversal from index 0 and displays the motorbikes.', '4.2 — chạy duyệt pre-order từ chỉ số 0 và hiển thị các xe.'), weight: 1, maxScore: 0.5 },
    { id: 'delete_then_traverse', criterion: B('4.3 — deletes the motorbike with model "S1000RR-2023" and then runs the pre-order traversal again.', '4.3 — xoá xe có model "S1000RR-2023" rồi chạy lại duyệt pre-order.'), weight: 1, maxScore: 0.5 },
    { id: 'heapsort_call', criterion: B('4.4 — applies heapSort to the motorbikes stored in the maxHeap, with the output clearly labelled.', '4.4 — áp dụng heapSort lên các xe đang lưu trong maxHeap, output có nhãn rõ ràng.'), weight: 1, maxScore: 0.5 },
  ],
};

/* ─────────────────────────── SPEC ─────────────────────────── */

const questions = [q1, q2, q3, q4, q5, q6, q7];

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE19',
    title: 'PE Đề 19 — Practical Exam (Spring 2025, PE1)|||PE Đề 19 — Thi thực hành (Spring 2025, PE1)',
    description: 'CSD201 PE (CODE): singly linked list of motorbikes + an array-based MaxHeap with insert/pre-order/delete-by-model/heapSort, written from scratch (no given project), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn các xe mô tô + MaxHeap dạng mảng với insert/pre-order/xoá-theo-model/heapSort, viết từ đầu (không có project given), chấm AI.',
    durationMinutes: 85,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions,
  }],
};

const sum = questions.reduce((s, q) => s + q.points, 0);
if (Math.abs(sum - spec.exams[0].totalPoints) > 1e-9) {
  throw new Error(`Tổng điểm các câu = ${sum}, khác totalPoints = ${spec.exams[0].totalPoints}`);
}

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${questions.length} câu, ${sum} điểm`);
