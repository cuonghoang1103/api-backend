/**
 * CSD201 · 🎯 Luyện PE bằng ĐỀ THẬT (bài 9.1 "The 85-minute PE"): đề SP26 Paper 1 (mới nhất — ShipmentCLL + FruitBST, 4 câu ×
 * 2.5) và ba câu của đề SP26 Block 5 Paper 4 (MyList Drum, BSTree Tiger, Graph). Tệp cho sẵn = bản THẬT trong given materials
 * (nguon/_pe/pe1_*, pe3_*), tệp người học = tệp thật của đề với lời giải chèn đúng chỗ đề cho viết (chenSau) ⇒ khởi đầu = tệp
 * thật. Ca hiện = data.txt của đề (đã đối chiếu output với đáp án trong content/exams/CSD201-PE1/PE3), ca ẩn = data.txt khác.
 */
import { moDun } from './_chung.mjs';
import { dePeFile, PE_THAT, QUEUE_NODE, QUEUE_INT, STACK_INT } from './_pe.mjs';

/** Chèn lời giải (bọc //>> //<<) ngay SAU dòng chứa mốc, lần lượt từ trên xuống; `cuoi` = chèn trước dấu } cuối tệp. */
function chenSau(text, chen, cuoi = '') {
  let t = text;
  let from = 0;
  for (const [moc, code] of chen) {
    const i = t.indexOf(moc, from);
    if (i < 0) throw new Error(`chenSau: không thấy mốc "${moc}"`);
    const eol = t.indexOf('\n', i);
    const block = `    //>>\n${code.replace(/^\n/, '').replace(/\s+$/, '')}\n    //<<\n`;
    t = t.slice(0, eol + 1) + block + t.slice(eol + 1);
    from = eol + 1 + block.length;
  }
  if (cuoi) {
    const k = t.lastIndexOf('}');
    t = `${t.slice(0, k)}//>>\n${cuoi.replace(/^\n/, '').replace(/\s+$/, '')}\n//<<\n${t.slice(k)}`;
  }
  return t;
}
const WELCOME = '// Students are welcomed to use any helper function(s)';
const GAP = 'to complete the question in the exam paper.*/';

// ─── SP26 Paper 1 (ShipmentCLL + FruitBST) ───
const SHIPMENT = chenSau(PE_THAT('pe1_ShipmentCLL.java'), [
  [WELCOME, `
        if (head == null) {
            return 0;
        }
        Node p = head;
        do {
            count++;
            p = p.next;
        } while (p != head);`],
  [WELCOME, `
        if (head == null) {
            return;
        }
        Node last = head;
        while (last.next != head) {
            last = last.next;
        }
        Node prev = last, cur = head;
        do {
            if (cur.info.fruitId.equals(id)) {
                if (cur.next == cur) {
                    head = null; // it was the only node
                } else {
                    prev.next = cur.next;
                    if (cur == head) {
                        head = cur.next; // the last node now points to the new head
                    }
                }
                return;
            }
            prev = cur;
            cur = cur.next;
        } while (cur != head);`],
]);
const FRUIT_BST = chenSau(PE_THAT('pe1_FruitBST.java'), [
  [WELCOME, `
        root = insert(root, fruit);`],
  [WELCOME, `
        count = countInRange(root, minId, maxId);`],
], `
    private Node insert(Node p, Fruit fruit) {
        if (p == null) {
            return new Node(fruit);
        }
        int c = fruit.fruitId.compareTo(p.info.fruitId);
        if (c < 0) {
            p.left = insert(p.left, fruit);
        } else if (c > 0) {
            p.right = insert(p.right, fruit);
        }
        return p; // an existing id: the new fruit is ignored
    }

    private int countInRange(Node p, String lo, String hi) {
        if (p == null) {
            return 0;
        }
        String id = p.info.fruitId;
        if (id.compareTo(lo) < 0) {
            return countInRange(p.right, lo, hi);
        }
        if (id.compareTo(hi) > 0) {
            return countInRange(p.left, lo, hi);
        }
        return 1 + countInRange(p.left, lo, hi) + countInRange(p.right, lo, hi);
    }
`);

const de1 = dePeFile({
  id: 'csd201-pe-sp26-p1-shipment',
  tieuDe: { en: '🎯 Real paper SP26 Paper 1 — ShipmentCLL (count, remove by id) + FruitBST (insert, count in a range)', vi: '🎯 Đề thật SP26 Paper 1 — ShipmentCLL (đếm, xoá theo mã) + FruitBST (chèn, đếm trong khoảng)' },
  doKho: 'HARD', phut: 60,
  khaiNiem: ['circular singly linked list with head only', 'removing the head of a circular list', 'BST ordered by a String key', 'range counting with compareTo'],
  mainJava: PE_THAT('pe1_Main.java'),
  hoc: { 'ShipmentCLL.java': SHIPMENT, 'FruitBST.java': FRUIT_BST },
  cho: { 'Fruit.java': PE_THAT('pe1_Fruit.java'), 'Assignment.java': PE_THAT('pe1_Assignment.java') },
  soF: 4,
  boiCanh: {
    en: `<p><b>CSD201 PE · SP26 · Paper 1</b> (60 minutes, 4 × 2.5 marks) — the newest paper in the Exam Room (<code>content/exams/CSD201-PE1</code>). A fruit import-export store: today's shipment is a <b>circular linked list</b> (<code>ShipmentCLL</code>, only <code>head</code>, the last node points back to it), the warehouse is a <b>BST ordered by fruitId</b> (<code>FruitBST</code>). <code>Assignment.java</code> (given) loads <code>data.txt</code> (line 1 ids, 2 names, 3 quantities, 4 prices, 5 the id to remove, 6–7 the range) and writes the answers. You complete only the method bodies marked "Student's code starts from here" (helper methods are welcome). The given <code>data.txt</code> of the zip ends with two stray spaces after <code>F08</code>; this copy is trimmed so that f4 prints <code>[F03,F08]</code> exactly as the paper shows.</p>`,
    vi: `<p><b>PE CSD201 · SP26 · Paper 1</b> (60 phút, 4 × 2.5 điểm) — đề mới nhất trong Phòng thi (<code>content/exams/CSD201-PE1</code>). Cửa hàng xuất nhập khẩu trái cây: lô hàng hôm nay là <b>danh sách liên kết vòng</b> (<code>ShipmentCLL</code>, chỉ có <code>head</code>, nút cuối trỏ về head), kho là <b>BST sắp theo fruitId</b> (<code>FruitBST</code>). <code>Assignment.java</code> (cho sẵn) nạp <code>data.txt</code> (dòng 1 mã, 2 tên, 3 số lượng, 4 giá, 5 mã cần xoá, 6–7 khoảng) và ghi đáp án. Bạn chỉ hoàn thiện thân các hàm đánh dấu "Student's code starts from here" (được viết hàm phụ). <code>data.txt</code> trong file zip có hai dấu cách thừa sau <code>F08</code>; bản ở đây đã cắt để f4 in đúng <code>[F03,F08]</code> như đề.</p>`,
  },
  cau: [
    { en: '<code>countFruits()</code> (ShipmentCLL) — walk the circular list and return the number of fruits; 0 for an empty list.', vi: '<code>countFruits()</code> (ShipmentCLL) — duyệt danh sách vòng và trả số trái cây; danh sách rỗng trả 0.' },
    { en: '<code>removeById(String id)</code> (ShipmentCLL) — remove the node with that fruitId; handle every case: the only node, the head (the last node must point to the new head), another node, an id that is not there.', vi: '<code>removeById(String id)</code> (ShipmentCLL) — xoá nút có fruitId đó; xử lý mọi trường hợp: nút duy nhất, nút head (nút cuối phải trỏ tới head mới), nút khác, mã không có.' },
    { en: '<code>insert(Fruit fruit)</code> (FruitBST) — insert by fruitId (String order); an id already in the tree is ignored. f3 prints the in-order traversal.', vi: '<code>insert(Fruit fruit)</code> (FruitBST) — chèn theo fruitId (thứ tự chuỗi); mã đã có thì bỏ qua. f3 in duyệt trung thứ tự.' },
    { en: '<code>countInRange(String minId, String maxId)</code> (FruitBST) — the number of fruits whose id is between minId and maxId inclusive; 0 if none.', vi: '<code>countInRange(String minId, String maxId)</code> (FruitBST) — số trái cây có mã nằm giữa minId và maxId (tính cả hai đầu); không có thì 0.' },
  ],
  data: PE_THAT('pe1_data.txt'),
  dataAn: [`Fruits:
F10 F05 F20 F01
Kiwi Lemon Peach Plum
10 20 30 40
1.0 2.25 0.5 9.99
F10
F02
F15
`, `Fruits:
F07
Fig
5
1.5
F07
A
Z
`, `Fruits:
B2 A1 C3 B1
Pear Apple Cherry Lime
7 8 9 6
2.0 3.5 1.25 4.0
X9
C4
D0
`, `Fruits:
F30 F10 F30 F20 F40
Melon Durian Papaya Guava Lychee
3 4 5 6 7
1.0 2.0 3.0 4.0 5.0
F40
F10
F30
`],
  goiY: [
    { en: 'A circular list has no null: walk with do { … } while (p != head), and treat head == null first.', vi: 'Danh sách vòng không có null: duyệt bằng do { … } while (p != head), và xử lý head == null trước.' },
    { en: 'removeById: start with prev = the LAST node and cur = head; then removing the head is the same unlink (prev.next = cur.next) plus head = cur.next.', vi: 'removeById: cho prev = nút CUỐI và cur = head; khi đó xoá head cũng là cùng phép gỡ (prev.next = cur.next) cộng head = cur.next.' },
  ],
  loiHayGap: [
    { en: 'A while (p != head) loop that starts at head — it stops immediately and counts 0 (or 1).', vi: 'Vòng while (p != head) bắt đầu ở head — dừng ngay và đếm ra 0 (hoặc 1).' },
    { en: 'Removing the head by head = head.next only — the last node still points to the removed node, the ring is broken.', vi: 'Xoá head chỉ bằng head = head.next — nút cuối vẫn trỏ vào nút đã xoá, vòng bị đứt.' },
    { en: 'Comparing ids with == or < — use equals and compareTo.', vi: 'So mã bằng == hay < — dùng equals và compareTo.' },
  ],
  giaiThich: { en: '<p>f1/f2 are the circular-list operations of chapter 1 (O(n)); the trick in f2 is to start from the node before head so that the head is not a special case. f3/f4 are a BST insert and a pruned range count on String keys (O(h) and O(h + k)). Case 1 of each choice reproduces the paper’s expected output.</p>', vi: '<p>f1/f2 là các thao tác danh sách vòng của chương 1 (O(n)); mẹo của f2 là bắt đầu từ nút đứng trước head để head không thành trường hợp riêng. f3/f4 là chèn BST và đếm theo khoảng có tỉa nhánh trên khoá chuỗi (O(h) và O(h + k)). Ca 1 của mỗi lựa chọn tái hiện đúng output mẫu của đề.</p>' },
});

// ─── SP26 Block 5 Paper 4 — Question 1: MyList of Drum ───
const MYLIST = chenSau(PE_THAT('pe3_MyList.java'), [
  ['//You should write here appropriate statements to complete this function.', `
    if (xTower.charAt(0) == 'B') {
      return;
    }
    Node q = new Node(new Drum(xTower, xSound, xType));
    if (isEmpty()) {
      head = tail = q;
    } else {
      tail.next = q;
      tail = q;
    }`],
  [GAP, `
     insertAt(x, 2);
     insertAt(y, 4);`],
  [GAP, `
    Node m = null;
    for (Node p = head; p != null; p = p.next) {
      if (m == null || p.info.sound > m.info.sound) {
        m = p; // the FIRST node with the maximum sound
      }
    }
    if (m != null && m != tail) {
      Node d = m.next;
      m.next = d.next;
      if (d == tail) {
        tail = m;
      }
    }`],
  [GAP, `
    int n = 0;
    for (Node p = head; p != null; p = p.next) {
      n++;
    }
    Node start = head;
    for (int i = 0; i < n - 4; i++) {
      start = start.next;
    }
    for (Node i = start; i != null; i = i.next) { // selection sort of the infos, descending by sound
      Node best = i;
      for (Node j = i.next; j != null; j = j.next) {
        if (j.info.sound > best.info.sound) {
          best = j;
        }
      }
      Drum t = i.info;
      i.info = best.info;
      best.info = t;
    }`],
], `
  // insert d so that it becomes the node at position pos (0-based)
  void insertAt(Drum d, int pos) {
    Node q = new Node(d);
    if (pos == 0 || head == null) {
      q.next = head;
      head = q;
      if (tail == null) {
        tail = q;
      }
      return;
    }
    Node prev = head;
    for (int i = 0; i < pos - 1 && prev.next != null; i++) {
      prev = prev.next;
    }
    q.next = prev.next;
    prev.next = q;
    if (q.next == null) {
      tail = q;
    }
  }
`);

const de2 = dePeFile({
  id: 'csd201-pe-sp26-b5p4-q1-mylist',
  tieuDe: { en: '🎯 Real paper SP26 Block 5 Paper 4, Q1 — MyList of Drum: conditional addLast, insert as 3rd and 5th, delete after the first max, sort the last 4', vi: '🎯 Đề thật SP26 Block 5 Paper 4, câu 1 — MyList các Drum: addLast có điều kiện, chèn làm nút 3 và 5, xoá sau max đầu tiên, sắp 4 phần tử cuối' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['PE MyList layout', 'insert at a position, applied twice', 'delete the node after a given one', 'sort only the tail of a list'],
  lop: 'MyList', tepHoc: 'MyList.java', soF: 4,
  cho: { 'Node.java': PE_THAT('pe3_Node0.java'), 'Drum.java': PE_THAT('pe3_Drum.java') },
  giai: MYLIST,
  boiCanh: {
    en: '<p><b>CSD201 PE · SP26 · Block 5 · Paper 4 · Question 1 (4 marks)</b> — the real files of the given zip (Q1/ folder): <code>Drum(tower, sound, type)</code>, <code>Node</code>, <code>Lib</code>, <code>Main</code>, and <code>MyList.java</code> whose part (2) you complete. The paper’s own sample outputs (Exam Room <code>CSD201-PE3</code>) are reproduced by case 1 of every choice.</p>',
    vi: '<p><b>PE CSD201 · SP26 · Block 5 · Paper 4 · Câu 1 (4 điểm)</b> — các tệp thật của file zip (thư mục Q1/): <code>Drum(tower, sound, type)</code>, <code>Node</code>, <code>Lib</code>, <code>Main</code>, và <code>MyList.java</code> mà bạn hoàn thiện phần (2). Output mẫu của chính đề (Phòng thi <code>CSD201-PE3</code>) được tái hiện ở ca 1 của mỗi lựa chọn.</p>',
  },
  cau: [
    { en: '<code>addLast(xTower, xSound, xType)</code> — if <code>xTower.charAt(0) == \'B\'</code> do nothing, otherwise append a new node. Paper: <code>(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,7)</code>.', vi: '<code>addLast(xTower, xSound, xType)</code> — nếu <code>xTower.charAt(0) == \'B\'</code> thì không làm gì, ngược lại thêm nút vào cuối. Đề: <code>(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,7)</code>.' },
    { en: 'Given x = (X,1,2) and y = (Y,3,4): insert them so that x is the 3rd node and y the 5th (insert x at position 2 first, then y at position 4 of the new list).', vi: 'Cho x = (X,1,2) và y = (Y,3,4): chèn để x là nút thứ 3 và y là nút thứ 5 (chèn x ở vị trí 2 trước, rồi y ở vị trí 4 của danh sách mới).' },
    { en: 'Let p be the FIRST node with the maximum sound, if it is not the tail: delete the node right after p.', vi: 'Gọi p là nút ĐẦU TIÊN có sound lớn nhất, nếu nó không phải tail: xoá nút ngay sau p.' },
    { en: 'Assuming at least 4 elements, sort the LAST 4 elements in descending order of sound; the earlier nodes are untouched.', vi: 'Giả sử có ít nhất 4 phần tử, sắp 4 phần tử CUỐI giảm dần theo sound; các nút trước giữ nguyên.' },
  ],
  data: PE_THAT('pe3_data0.txt'),
  dataAn: [`Line 0 - The next line is line 1 (f1)
 Bx  A  Bo  C
 1   2  3   4
 5   6  7   8
Line 4 - The next line is line 5 (f2)
 C  D  E
 1  2  3
 4  5  6
Line 8 - The next line is line 9 (f3)
 C  D  E  F
 2  9  9  1
 1  1  1  1
Line 12 - The next line is line 13 (f4)
 C  D  E  F
 4  3  2  1
 1  1  1  1
END
`, `Line 0 - The next line is line 1 (f1)
 A  C
 1  2
 3  4
Line 4 - The next line is line 5 (f2)
 C  D  E  F  G  H
 1  2  3  4  5  6
 1  1  1  1  1  1
Line 8 - The next line is line 9 (f3)
 C  D  E
 1  2  9
 1  1  1
Line 12 - The next line is line 13 (f4)
 C  D  E  F  G  H
 9  8  1  5  3  7
 1  2  3  4  5  6
END
`],
  goiY: [
    { en: 'A helper insertAt(Drum d, int pos) used twice keeps f2 short — remember that after inserting x the positions of the later nodes shift by one.', vi: 'Một hàm phụ insertAt(Drum d, int pos) dùng hai lần giúp f2 gọn — nhớ rằng sau khi chèn x, vị trí các nút phía sau lệch đi một.' },
    { en: 'f4: walk to node n − 4, then sort the infos of the last four nodes (swapping infos keeps all links).', vi: 'f4: đi tới nút thứ n − 4, rồi sắp các info của bốn nút cuối (đổi info giữ nguyên mọi liên kết).' },
  ],
  loiHayGap: [
    { en: 'f3 with >= — the LAST maximum is taken and the wrong node is deleted.', vi: 'f3 dùng >= — lấy max CUỐI và xoá nhầm nút.' },
    { en: 'f3 deleting the tail’s successor when the max is the tail — there is none; nothing must change.', vi: 'f3 khi max là tail — không có nút sau; không được thay đổi gì.' },
  ],
  giaiThich: { en: '<p>Every question reuses chapter 1: append with a guard, insert at a position (walking to the node before it), delete after a node (relinking and moving tail when needed), and a selection sort restricted to the last four infos. Writing two or three helpers in part (2) and calling them from the gaps is the fastest and safest way through a MyList question.</p>', vi: '<p>Mọi câu đều dùng lại chương 1: thêm cuối có điều kiện, chèn tại vị trí (đi tới nút đứng trước), xoá sau một nút (nối lại và dời tail khi cần), và sắp chọn giới hạn ở bốn info cuối. Viết hai, ba hàm phụ ở phần (2) rồi gọi từ các chỗ trống là cách nhanh và chắc nhất để làm câu MyList.</p>' },
});

// ─── SP26 Block 5 Paper 4 — Question 2: BSTree of Tiger ───
const BSTREE = chenSau(PE_THAT('pe3_BSTree.java'), [
  ['//You should insert here statements to complete this function', `
    if (xForest.charAt(0) == 'A') {
      return;
    }
    Node q = new Node(new Tiger(xForest, xRate, xSound));
    if (root == null) {
      root = q;
      return;
    }
    Node f = null, p = root;
    while (p != null) {
      if (p.info.sound == xSound) {
        return; // the key (sound) must be unique
      }
      f = p;
      p = xSound < p.info.sound ? p.left : p.right;
    }
    if (xSound < f.info.sound) {
      f.left = q;
    } else {
      f.right = q;
    }`],
  [GAP, `
    preOrder2(root, f);`],
  [GAP, `
    deleteByCopying(kthPre(4));`],
  [GAP, `
    rotateLeft(kthPre(4));`],
], `
  // pre-order, only the tigers with rate < 6
  void preOrder2(Node p, RandomAccessFile f) throws Exception {
    if (p == null) {
      return;
    }
    if (p.info.rate < 6) {
      fvisit(p, f);
    }
    preOrder2(p.left, f);
    preOrder2(p.right, f);
  }

  // the k-th node (k = 1, 2, ...) in pre-order, or null
  Node kthPre(int k) {
    java.util.ArrayDeque<Node> st = new java.util.ArrayDeque<Node>();
    int count = 0;
    if (root != null) {
      st.push(root);
    }
    while (!st.isEmpty()) {
      Node p = st.pop();
      if (++count == k) {
        return p;
      }
      if (p.right != null) {
        st.push(p.right);
      }
      if (p.left != null) {
        st.push(p.left);
      }
    }
    return null;
  }

  Node parentOf(Node x) {
    Node f = null, p = root;
    while (p != null && p != x) {
      f = p;
      p = x.info.sound < p.info.sound ? p.left : p.right;
    }
    return f;
  }

  void deleteByCopying(Node p) {
    if (p == null) {
      return;
    }
    if (p.left != null && p.right != null) {
      Node f = p, q = p.left;
      while (q.right != null) {
        f = q;
        q = q.right;
      }
      p.info = q.info;
      if (f == p) {
        f.left = q.left;
      } else {
        f.right = q.left;
      }
      return;
    }
    Node child = p.left != null ? p.left : p.right;
    Node f = parentOf(p);
    if (f == null) {
      root = child;
    } else if (f.left == p) {
      f.left = child;
    } else {
      f.right = child;
    }
  }

  void rotateLeft(Node p) {
    if (p == null || p.right == null) {
      return;
    }
    Node f = parentOf(p);
    Node q = p.right;
    p.right = q.left;
    q.left = p;
    if (f == null) {
      root = q;
    } else if (f.left == p) {
      f.left = q;
    } else {
      f.right = q;
    }
  }
`);

const de3 = dePeFile({
  id: 'csd201-pe-sp26-b5p4-q2-bstree',
  tieuDe: { en: '🎯 Real paper SP26 Block 5 Paper 4, Q2 — BSTree of Tiger: insert by sound, filtered pre-order, delete by copying, rotate left', vi: '🎯 Đề thật SP26 Block 5 Paper 4, câu 2 — BSTree các Tiger: chèn theo sound, tiền thứ tự có lọc, xoá bằng sao chép, quay trái' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['PE BSTree layout', 'a BST keyed by a field that must be unique', 'the 4th node in pre-order', 'delete by copying', 'left rotation with the parent link'],
  lop: 'BSTree', tepHoc: 'BSTree.java', soF: 4,
  cho: { 'Node.java': PE_THAT('pe3_Node1.java'), 'Tiger.java': PE_THAT('pe3_Tiger.java'), 'Queue.java': QUEUE_NODE },
  giai: BSTREE,
  boiCanh: {
    en: '<p><b>CSD201 PE · SP26 · Block 5 · Paper 4 · Question 2 (4 marks)</b> — the real files of the Q2/ folder: <code>Tiger(forest, rate, sound)</code>, <code>Node</code> (with unused <code>bal</code>, <code>level</code>), <code>Queue</code> for breadth-first, <code>Lib</code>, <code>Main</code>, and <code>BSTree.java</code> whose part (2) you complete. The BST is keyed by <b>sound</b>, which must be unique.</p>',
    vi: '<p><b>PE CSD201 · SP26 · Block 5 · Paper 4 · Câu 2 (4 điểm)</b> — các tệp thật của thư mục Q2/: <code>Tiger(forest, rate, sound)</code>, <code>Node</code> (có <code>bal</code>, <code>level</code> không dùng), <code>Queue</code> cho duyệt theo tầng, <code>Lib</code>, <code>Main</code>, và <code>BSTree.java</code> mà bạn hoàn thiện phần (2). BST có khoá là <b>sound</b>, không được trùng.</p>',
  },
  cau: [
    { en: '<code>insert(xForest, xRate, xSound)</code> — if <code>xForest.charAt(0) == \'A\'</code> do nothing; otherwise insert keyed by sound (a sound already in the tree is ignored). The file gets breadth-first and in-order.', vi: '<code>insert(xForest, xRate, xSound)</code> — nếu <code>xForest.charAt(0) == \'A\'</code> thì không làm gì; ngược lại chèn theo khoá sound (sound đã có thì bỏ qua). Tệp ghi duyệt theo tầng và trung thứ tự.' },
    { en: 'Pre-order traversal, but display only the nodes with <code>rate &lt; 6</code> (copy <code>preOrder</code> to <code>preOrder2</code> and modify it).', vi: 'Duyệt tiền thứ tự nhưng chỉ ghi các nút có <code>rate &lt; 6</code> (chép <code>preOrder</code> thành <code>preOrder2</code> rồi sửa).' },
    { en: 'Let p be the 4th node in pre-order traversal. Delete p by copying.', vi: 'Gọi p là nút thứ 4 theo tiền thứ tự. Xoá p bằng sao chép.' },
    { en: 'Let p be the 4th node in pre-order traversal. If p has a right child, rotate p to the LEFT about its right child.', vi: 'Gọi p là nút thứ 4 theo tiền thứ tự. Nếu p có con phải, quay p sang TRÁI quanh con phải.' },
  ],
  data: PE_THAT('pe3_data1.txt'),
  dataAn: [`line 0 - The next line is line 1 (f1)
 A  B  C  Ab  D
 1  2  3  4   5
 5  4  3  2   1
line 4 - The next line is line 5 (f2)
 C  D  E
 6  7  8
 2  1  3
line 8 - The next line is line 9 (f3)
 C  D  E  F
 1  2  3  4
 40 20 60 10
line 12 - The next line is line 13 (f4)
 C  D  E  F  G
 1  2  3  4  5
 50 40 30 20 25
END OF DATA
`, `line 0 - The next line is line 1 (f1)
 Z
 1
 1
line 4 - The next line is line 5 (f2)
 C  D  E  F  G
 1  9  2  9  3
 5  4  3  2  1
line 8 - The next line is line 9 (f3)
 C  D  E  F  G  H  I
 1  1  1  1  1  1  1
 50 30 70 20 40 35 45
line 12 - The next line is line 13 (f4)
 C  D  E  F  G  H
 1  1  1  1  1  1
 50 30 20 40 45 70
END OF DATA
`],
  goiY: [
    { en: 'Two helpers serve f3 and f4: the k-th node in pre-order (an explicit stack: push right, then left) and the parent of a node (walk down by sound).', vi: 'Hai hàm phụ phục vụ f3 và f4: nút thứ k theo tiền thứ tự (ngăn xếp tường minh: đẩy phải rồi trái) và cha của một nút (đi xuống theo sound).' },
    { en: 'Left rotation at p: q = p.right; p.right = q.left; q.left = p; the parent of p now points to q.', vi: 'Quay trái tại p: q = p.right; p.right = q.left; q.left = p; cha của p giờ trỏ tới q.' },
  ],
  loiHayGap: [
    { en: 'Keying the tree by rate (the 2nd number) instead of sound (the 3rd).', vi: 'Lấy khoá cây là rate (số thứ 2) thay vì sound (số thứ 3).' },
    { en: 'Counting the 4th node in breadth-first order — the paper says pre-order.', vi: 'Đếm nút thứ 4 theo tầng — đề nói tiền thứ tự.' },
  ],
  giaiThich: { en: '<p>The four questions are chapter 4 in exam form: insert with a guard and a unique key, a filtered traversal, delete by copying and a rotation — each O(h) or O(n). Case 1 of every choice reproduces the paper’s own expected file.</p>', vi: '<p>Bốn câu là chương 4 dưới dạng đề thi: chèn có điều kiện và khoá duy nhất, phép duyệt có lọc, xoá bằng sao chép và phép quay — mỗi việc O(h) hoặc O(n). Ca 1 của mỗi lựa chọn tái hiện đúng tệp đáp án của đề.</p>' },
});

// ─── SP26 Block 5 Paper 4 — Question 3: Graph ───
const GRAPH = chenSau(PE_THAT('pe3_Graph.java'), [
  [GAP, `
    breadth2(1, 3, 7, f);`],
  [GAP, `
    dijkstra(0, 6, true, f);
    f.writeBytes("\\r\\n");
    dijkstra(1, 5, false, f);`],
], `
  // the vertices from the from-th to the to-th (1-based) of the breadth-first order of breadth(k, f)
  void breadth2(int k, int from, int to, RandomAccessFile f) throws Exception {
    boolean[] en = new boolean[20];
    int[] order = new int[20];
    int cnt = 0;
    for (int s = -1; s < n; s++) {
      int start = s < 0 ? k : s;
      if (en[start]) {
        continue;
      }
      Queue q = new Queue();
      q.enqueue(start);
      en[start] = true;
      while (!q.isEmpty()) {
        int r = q.dequeue();
        order[cnt++] = r;
        for (int j = 0; j < n; j++) {
          if (!en[j] && a[r][j] > 0) {
            q.enqueue(j);
            en[j] = true;
          }
        }
      }
    }
    for (int i = from - 1; i < to && i < cnt; i++) {
      fvisit(order[i], f);
    }
  }

  // Dijkstra from s (99 = no edge); line 1: the path s -> t; when last4: line 2 the last 4 vertices added to S (label|dist)
  void dijkstra(int s, int t, boolean last4, RandomAccessFile f) throws Exception {
    int INF = 99;
    int[] d = new int[n];
    int[] prev = new int[n];
    boolean[] inS = new boolean[n];
    int[] added = new int[n];
    int na = 0;
    for (int i = 0; i < n; i++) {
      d[i] = a[s][i];
      prev[i] = a[s][i] < INF ? s : -1;
    }
    d[s] = 0;
    prev[s] = -1;
    inS[s] = true;
    added[na++] = s;
    while (!inS[t]) {
      int u = -1;
      for (int i = 0; i < n; i++) {
        if (!inS[i] && d[i] < INF && (u == -1 || d[i] < d[u])) {
          u = i;
        }
      }
      if (u == -1) {
        break;
      }
      inS[u] = true;
      added[na++] = u;
      for (int i = 0; i < n; i++) {
        if (!inS[i] && a[u][i] < INF && d[u] + a[u][i] < d[i]) {
          d[i] = d[u] + a[u][i];
          prev[i] = u;
        }
      }
    }
    int[] path = new int[n];
    int len = 0;
    for (int v = t; v != -1; v = prev[v]) {
      path[len++] = v;
    }
    for (int i = len - 1; i >= 0; i--) {
      fvisit(path[i], f);
    }
    if (last4) {
      f.writeBytes("\\r\\n");
      for (int i = Math.max(0, na - 4); i < na; i++) {
        f.writeBytes("  " + v[added[i]] + "|" + d[added[i]]);
      }
    }
  }
`);

const de4 = dePeFile({
  id: 'csd201-pe-sp26-b5p4-q3-graph',
  tieuDe: { en: '🎯 Real paper SP26 Block 5 Paper 4, Q3 — Graph: part of a BFS order, Dijkstra paths and the last vertices added to S', vi: '🎯 Đề thật SP26 Block 5 Paper 4, câu 3 — Graph: một đoạn của thứ tự BFS, đường đi Dijkstra và các đỉnh cuối vào S' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['PE Graph layout (adjacency matrix, 99 = infinity)', 'copy breadth to breadth2', 'Dijkstra with prev[] and the order of S'],
  lop: 'Graph', tepHoc: 'Graph.java', soF: 2,
  cho: { 'Queue.java': QUEUE_INT, 'Stack.java': STACK_INT },
  giai: GRAPH,
  boiCanh: {
    en: '<p><b>CSD201 PE · SP26 · Block 5 · Paper 4 · Question 3 (2 marks)</b> — the real files of the Q3/ folder: <code>Graph.java</code> (labels A…P, <code>loadData(k)</code>, <code>fvisit</code> writing <code>"  X"</code>, <code>breadth</code>/<code>depth</code> with restarts), <code>Queue</code>, <code>Stack</code>, <code>Lib</code>, <code>Main</code>. The f1 matrix of the paper is <b>not symmetric</b> in one cell (row F has C, row C has no F): follow the rows exactly, as the given <code>breadth</code> does.</p>',
    vi: '<p><b>PE CSD201 · SP26 · Block 5 · Paper 4 · Câu 3 (2 điểm)</b> — các tệp thật của thư mục Q3/: <code>Graph.java</code> (nhãn A…P, <code>loadData(k)</code>, <code>fvisit</code> ghi <code>"  X"</code>, <code>breadth</code>/<code>depth</code> có bắt đầu lại), <code>Queue</code>, <code>Stack</code>, <code>Lib</code>, <code>Main</code>. Ma trận f1 của đề <b>không đối xứng</b> ở một ô (hàng F có C, hàng C không có F): hãy đi đúng theo hàng, như <code>breadth</code> cho sẵn làm.</p>',
  },
  cau: [
    { en: 'The breadth-first traversal from vertex 1 (B) is already written by <code>breadth(1,f)</code>. On the next line write only the <b>3rd to the 7th</b> vertices of that same order (copy <code>breadth</code> to <code>breadth2</code> and modify it). Paper: <code>B A E C D H G I F</code> / <code>E C D H G</code>.', vi: 'Duyệt theo chiều rộng từ đỉnh 1 (B) đã được ghi bởi <code>breadth(1,f)</code>. Ở dòng kế tiếp chỉ ghi các đỉnh <b>thứ 3 tới thứ 7</b> của chính thứ tự đó (chép <code>breadth</code> thành <code>breadth2</code> rồi sửa). Đề: <code>B A E C D H G I F</code> / <code>E C D H G</code>.' },
    { en: 'Dijkstra on the weighted matrix of line 12 (99 = no edge). Line 1: the shortest path from A (0) to G (6). Line 2: the last 4 vertices put into S up to and including G (stop once G is in S), each as <code>label|distance</code>. Line 3: the shortest path from B (1) to F (5). Paper: <code>A B C E D G</code> / <code>E|15 D|19 F|24 G|29</code> / <code>B C E D F</code>.', vi: 'Dijkstra trên ma trận trọng số ở dòng 12 (99 = không có cạnh). Dòng 1: đường đi ngắn nhất từ A (0) tới G (6). Dòng 2: 4 đỉnh cuối được đưa vào S tính tới cả G (dừng khi G vào S), mỗi đỉnh dạng <code>nhãn|khoảng cách</code>. Dòng 3: đường đi ngắn nhất từ B (1) tới F (5). Đề: <code>A B C E D G</code> / <code>E|15 D|19 F|24 G|29</code> / <code>B C E D F</code>.' },
  ],
  data: PE_THAT('pe3_data2.txt'),
  dataAn: [`line 0 - The next line is line 1 (f1)
9
0  1  0  0  0  0  0  0  1
1  0  1  0  0  0  0  0  0
0  1  0  1  1  0  0  0  0
0  0  1  0  0  0  0  0  0
0  0  1  0  0  1  1  0  0
0  0  0  0  1  0  0  0  0
0  0  0  0  1  0  0  1  0
0  0  0  0  0  0  1  0  0
1  0  0  0  0  0  0  0  0
line 11 - The next line is line 12 (f2)
7
 0   4  99   1  99  99  99
99   0   2  99  99   9  99
99  99   0  99   1  99   7
99   1  99   0   8  99  99
99  99  99  99   0   1   2
99  99  99  99  99   0   3
99  99  99  99  99  99   0
END OF DATA
`],
  goiY: [
    { en: 'f1: breadth2 must produce exactly the order of breadth(1, f), restarts included — collect it into an array, then write positions 3..7.', vi: 'f1: breadth2 phải ra đúng thứ tự của breadth(1, f), kể cả các lần bắt đầu lại — gom vào một mảng rồi ghi các vị trí 3..7.' },
    { en: 'f2: keep the order in which vertices enter S; stop the main loop as soon as the target is in S, then print the last four of that order.', vi: 'f2: giữ thứ tự các đỉnh vào S; dừng vòng chính ngay khi đích vào S, rồi in bốn đỉnh cuối của thứ tự đó.' },
  ],
  loiHayGap: [
    { en: 'Treating 99 as a weight — "paths" through missing edges appear.', vi: 'Coi 99 là trọng số — xuất hiện "đường đi" qua cạnh không tồn tại.' },
    { en: 'Making the matrix symmetric "to fix the paper" — the expected output follows the given rows.', vi: 'Làm cho ma trận đối xứng "để sửa đề" — đáp án đi theo đúng các hàng cho sẵn.' },
  ],
  giaiThich: { en: '<p>f1 is the PE’s favourite trick — copy a given traversal and change what it writes. f2 is the O(n²) matrix Dijkstra of chapter 5 with two extras the paper asks for: the predecessor array for the path, and the selection order of S for the "last four vertices" line.</p>', vi: '<p>f1 là mẹo quen thuộc của đề PE — chép một phép duyệt cho sẵn rồi đổi thứ nó ghi ra. f2 là Dijkstra ma trận O(n²) của chương 5 kèm hai thứ đề yêu cầu: mảng đỉnh trước để dựng đường đi, và thứ tự chọn vào S cho dòng "bốn đỉnh cuối".</p>' },
});

export default moDun({ slug: 'csd201-on-pe', ten: '11.1 🎯 PE practice — the real papers SP26 Paper 1 and SP26 Block 5 Paper 4', de: [de1, de2, de3, de4] });
