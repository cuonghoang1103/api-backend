/** CSD201 · 4.5 — Xoá trong BST: xoá bằng sao chép (predecessor), xoá bằng hợp nhất, cắt BST về khoảng [lo, hi] — soi hình cây thật sau mỗi lệnh. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

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
const INSERT = j`
    // given: iterative insert without duplicates
    public void insert(int key) {
        if (root == null) {
            root = new Node(key);
            return;
        }
        Node p = root;
        while (key != p.key) {
            if (key < p.key) {
                if (p.left == null) {
                    p.left = new Node(key);
                }
                p = p.left;
            } else {
                if (p.right == null) {
                    p.right = new Node(key);
                }
                p = p.right;
            }
        }
    }
`;
const LENH = (ham) => `                if (p[0].equals("INS")) {
                    for (int i = 1; i < p.length; i++) {
                        t.insert(n(i));
                    }
                } else {
                    r = String.valueOf(t.${ham}(n(1)));
                }`;
const HINH = 'Kiem.cay(Kiem.lay(t, "root"), "left", "right", "key")';

const de1 = deJava({
  id: 'csd201-4-5-delete-by-copying',
  tieuDe: { en: 'Delete by copying: the predecessor takes the place', vi: 'Xoá bằng sao chép: nút liền trước thế chỗ' },
  doKho: 'MEDIUM', phut: 30, dangBai: 'pe',
  khaiNiem: ['three cases: leaf, one child, two children', 'predecessor = rightmost node of the left subtree', 'keep the parent link'],
  moTa: {
    en: `<p>The deletion of the slides (and of the PE papers, "delete by copying"). Complete ${c('boolean deleteByCopying(int key)')} (false if absent):</p>
<ul><li>no child or one child: link the parent (or ${c('root')}) to that child (or ${c('null')});</li>
<li>two children: find the <b>predecessor</b> — the rightmost node of the left subtree — copy its key into the node, then remove the predecessor (it has no right child, so this is the one-child case).</li></ul>
<p>The grader prints the shape of the tree after every deletion.</p>`,
    vi: `<p>Phép xoá của slide (và của đề PE, "delete by copying"). Hoàn thiện ${c('deleteByCopying(key)')} (không có thì false): không con hoặc một con — nối cha (hoặc ${c('root')}) tới con đó (hoặc ${c('null')}); hai con — tìm <b>nút liền trước</b> (predecessor) là nút phải nhất của cây con trái, chép khoá của nó vào nút, rồi gỡ nút liền trước (nó không có con phải, nên rơi vào trường hợp một con).</p>
<p>Máy chấm in hình cây sau mỗi lần xoá.</p>`,
  },
  yeuCau: { en: ['Iterative search with a parent pointer.', 'Predecessor (left subtree), not successor.'], vi: ['Tìm bằng vòng lặp kèm con trỏ cha.', 'Dùng nút liền trước (cây con trái), không dùng nút liền sau.'] },
  dauVao: { en: 'INS keys… · DEL k.', vi: 'INS các khoá… · DEL k.' },
  dauRa: { en: 'Result and the shape.', vi: 'Kết quả và hình cây.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ truoc: '        BSTree t = new BSTree();', lenh: LENH('deleteByCopying'), trangThai: HINH }) },
  tep: {
    'Node.java': NODE,
    'BSTree.java': j`
public class BSTree {
    private Node root;
${INSERT}
    public boolean deleteByCopying(int key) {
        //>> return false; // TODO
        Node p = root;
        Node parent = null;
        while (p != null && p.key != key) {
            parent = p;
            p = key < p.key ? p.left : p.right;
        }
        if (p == null) {
            return false;
        }
        if (p.left != null && p.right != null) {
            Node f = p; // parent of the predecessor
            Node q = p.left;
            while (q.right != null) {
                f = q;
                q = q.right;
            }
            p.key = q.key; // copy
            if (f == p) {
                f.left = q.left;
            } else {
                f.right = q.left;
            }
            return true;
        }
        Node child = p.left != null ? p.left : p.right; // 0 or 1 child
        if (parent == null) {
            root = child;
        } else if (parent.left == p) {
            parent.left = child;
        } else {
            parent.right = child;
        }
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a leaf, one child, two children, the root', vi: 'một lá, một con, hai con, gốc' }, vao: 'INS 8 3 10 1 6 14 4 7 13\nDEL 4\nDEL 10\nDEL 3\nDEL 8\nDEL 99\n' },
    { ten: { en: 'the predecessor is the left child itself', vi: 'nút liền trước chính là con trái' }, vao: 'INS 50 30 70 20 60 80\nDEL 30\nDEL 50\nDEL 20\nDEL 60\nDEL 70\nDEL 80\nDEL 80\n', an: true },
    { ten: { en: 'delete everything, root last', vi: 'xoá hết, gốc sau cùng' }, vao: 'INS 5 2 8 1 3 7 9\nDEL 5\nDEL 3\nDEL 2\nDEL 1\nDEL 9\nDEL 8\nDEL 7\nINS 4\n', an: true },
  ],
  goiY: [
    { en: 'Walk down keeping parent; you need it to relink in the 0/1-child case.', vi: 'Đi xuống và giữ parent; cần nó để nối lại trong trường hợp 0/1 con.' },
    { en: 'Predecessor: one step left, then right as far as possible. Its own left subtree replaces it.', vi: 'Nút liền trước: sang trái một bước, rồi sang phải tới cùng. Cây con trái của nó thế chỗ nó.' },
  ],
  loiHayGap: [
    { en: 'When the predecessor is p.left itself (it has no right child), relinking f.right instead of p.left — the left subtree is lost.', vi: 'Khi nút liền trước chính là p.left (nó không có con phải), lại nối f.right thay vì p.left — mất cây con trái.' },
    { en: 'Deleting the root with 0/1 child without updating root.', vi: 'Xoá gốc có 0/1 con mà không cập nhật root.' },
  ],
  giaiThich: { en: '<p>Copying the predecessor keeps the BST property: it is larger than everything else on the left and smaller than everything on the right. Finding the node and its predecessor are both O(h), the relink is O(1). Repeated copying deletions using only the predecessor tend to unbalance the tree to the right — the textbook mentions alternating with the successor.</p>', vi: '<p>Chép nút liền trước giữ tính chất BST: nó lớn hơn mọi nút còn lại bên trái và nhỏ hơn mọi nút bên phải. Tìm nút và nút liền trước đều O(h), nối lại O(1). Xoá bằng sao chép chỉ dùng nút liền trước lâu dần làm cây lệch sang phải — giáo trình gợi ý luân phiên với nút liền sau.</p>' },
});

const de2 = deJava({
  id: 'csd201-4-5-delete-by-merging',
  tieuDe: { en: 'Delete by merging: hang the right subtree under the predecessor', vi: 'Xoá bằng hợp nhất: treo cây con phải dưới nút liền trước' },
  doKho: 'MEDIUM', phut: 30, dangBai: 'pe',
  khaiNiem: ['merging two subtrees', 'rightmost node of the left subtree', 'height may grow'],
  moTa: {
    en: `<p>The other deletion of the slides. Complete ${c('boolean deleteByMerging(int key)')}: if the node has two children, find the rightmost node of its left subtree, make the node’s <b>right subtree</b> its right child, and replace the node by its left subtree; with 0/1 child, replace it by that child. Return false if the key is absent.</p>
<p>Compare the shapes with the previous exercise: merging keeps the keys in place but can make the tree much taller.</p>`,
    vi: `<p>Phép xoá thứ hai của slide. Hoàn thiện ${c('deleteByMerging(key)')}: nút có hai con thì tìm nút phải nhất của cây con trái, cho <b>cây con phải</b> của nút làm con phải của nó, rồi thay nút bằng cây con trái; có 0/1 con thì thay bằng con đó. Không có khoá thì trả false.</p>
<p>So hình cây với bài trước: hợp nhất giữ nguyên các khoá tại chỗ nhưng có thể làm cây cao lên nhiều.</p>`,
  },
  yeuCau: { en: ['No key is copied: nodes are relinked.', 'Keep the parent link.'], vi: ['Không chép khoá nào: chỉ nối lại nút.', 'Giữ liên kết từ cha.'] },
  dauVao: { en: 'INS keys… · DEL k.', vi: 'INS các khoá… · DEL k.' },
  dauRa: { en: 'Result and the shape.', vi: 'Kết quả và hình cây.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ truoc: '        BSTree t = new BSTree();', lenh: LENH('deleteByMerging'), trangThai: HINH }) },
  tep: {
    'Node.java': NODE,
    'BSTree.java': j`
public class BSTree {
    private Node root;
${INSERT}
    public boolean deleteByMerging(int key) {
        //>> return false; // TODO
        Node p = root;
        Node parent = null;
        while (p != null && p.key != key) {
            parent = p;
            p = key < p.key ? p.left : p.right;
        }
        if (p == null) {
            return false;
        }
        Node replacement;
        if (p.left == null) {
            replacement = p.right;
        } else if (p.right == null) {
            replacement = p.left;
        } else {
            Node q = p.left;
            while (q.right != null) {
                q = q.right;
            }
            q.right = p.right; // merge: the right subtree goes under the predecessor
            replacement = p.left;
        }
        if (parent == null) {
            root = replacement;
        } else if (parent.left == p) {
            parent.left = replacement;
        } else {
            parent.right = replacement;
        }
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the same tree as delete by copying', vi: 'cùng cây với xoá bằng sao chép' }, vao: 'INS 8 3 10 1 6 14 4 7 13\nDEL 4\nDEL 10\nDEL 3\nDEL 8\nDEL 99\n' },
    { ten: { en: 'merging makes the tree taller', vi: 'hợp nhất làm cây cao lên' }, vao: 'INS 50 30 70 20 40 60 80\nDEL 50\nDEL 30\nDEL 40\nDEL 20\nDEL 70\nDEL 60\nDEL 80\n', an: true },
  ],
  goiY: [
    { en: 'Every key of the right subtree is larger than every key of the left subtree, so the right subtree can hang under the largest key on the left.', vi: 'Mọi khoá của cây con phải lớn hơn mọi khoá của cây con trái, nên cây con phải treo được dưới khoá lớn nhất bên trái.' },
    { en: 'After merging, the left subtree takes the deleted node’s place in its parent (or becomes the root).', vi: 'Sau khi hợp nhất, cây con trái thế chỗ nút bị xoá trong cha của nó (hoặc thành gốc).' },
  ],
  loiHayGap: [
    { en: 'Hanging the right subtree under p.left instead of under the rightmost node — keys between them end up on the wrong side.', vi: 'Treo cây con phải dưới p.left thay vì dưới nút phải nhất — các khoá ở giữa nằm sai phía.' },
    { en: 'Forgetting that the deleted node may be the root.', vi: 'Quên nút bị xoá có thể là gốc.' },
  ],
  giaiThich: { en: '<p>Merging is one walk to the rightmost node of the left subtree plus three relinks: O(h). Unlike copying, it can increase the height by the height of the right subtree — the slides show this to motivate delete by copying and, later, balanced trees.</p>', vi: '<p>Hợp nhất là một lượt đi tới nút phải nhất của cây con trái cộng ba phép nối: O(h). Khác với sao chép, nó có thể làm cây cao thêm đúng bằng chiều cao cây con phải — slide nêu điều này để dẫn tới xoá bằng sao chép và sau đó là cây cân bằng.</p>' },
});

const de3 = deJava({
  id: 'csd201-4-5-trim-bst',
  tieuDe: { en: 'Trim a BST to [lo, hi] — a recursion that returns the new subtree', vi: 'Cắt BST về khoảng [lo, hi] — đệ quy trả về cây con mới' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['t.left = trim(t.left)', 'a whole subtree can be dropped at once', 'O(n) worst case, less with pruning'],
  moTa: {
    en: `<p>Complete ${c('static Node trim(Node t, int lo, int hi)')}: remove every key outside [lo, hi] and return the root of what remains; the kept keys keep their relative positions (LeetCode 669).</p>
<ul><li>${c('t.key < lo')}: t and its whole left subtree go; the answer is ${c('trim(t.right, lo, hi)')};</li>
<li>${c('t.key > hi')}: symmetric;</li>
<li>otherwise keep t: ${c('t.left = trim(t.left, …)')}, ${c('t.right = trim(t.right, …)')}.</li></ul>`,
    vi: `<p>Hoàn thiện ${c('static Node trim(Node t, int lo, int hi)')}: bỏ mọi khoá ngoài [lo, hi] và trả gốc của phần còn lại; các khoá được giữ giữ nguyên vị trí tương đối (LeetCode 669). ${c('t.key < lo')}: bỏ t và cả cây con trái, đáp án là ${c('trim(t.right, lo, hi)')}; ${c('t.key > hi')}: đối xứng; ngược lại giữ t: ${c('t.left = trim(t.left, …)')}, ${c('t.right = trim(t.right, …)')}.</p>`,
  },
  yeuCau: { en: ['Recursive, no new nodes (rule R1).', 'The result is still a BST.'], vi: ['Đệ quy, không tạo nút mới (luật R1).', 'Kết quả vẫn là BST.'] },
  dauVao: { en: 'Lines "lo hi : keys in insertion order".', vi: 'Các dòng "lo hi : các khoá theo thứ tự chèn".' },
  dauRa: { en: 'The shape before and after.', vi: 'Hình cây trước và sau.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no new Node in Trim', vi: 'không new Node trong Trim', re: String.raw`\bnew\s+Node\b`, file: 'Trim' }],
  harness: {
    'KiemTra.java': lopKiem({
      them: `
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
`,
      lenh: `                Node t = null;
                for (int i = 3; i < p.length; i++) {
                    t = insert(t, n(i));
                }
                String before = Kiem.cay(t, "left", "right", "key");
                r = before + " => " + Kiem.cay(Trim.trim(t, n(0), n(1)), "left", "right", "key");`,
    }),
  },
  tep: {
    'Node.java': NODE,
    'Trim.java': j`
public class Trim {

    static Node trim(Node t, int lo, int hi) {
        //>> return t; // TODO
        if (t == null) {
            return null;
        }
        if (t.key < lo) {
            return trim(t.right, lo, hi); // t and its left subtree are all < lo
        }
        if (t.key > hi) {
            return trim(t.left, lo, hi);
        }
        t.left = trim(t.left, lo, hi);
        t.right = trim(t.right, lo, hi);
        return t;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'LeetCode examples', vi: 'ví dụ LeetCode' }, vao: '1 2 : 1 0 2\n1 3 : 3 0 4 2 1\n4 10 : 8 3 10 1 6 14 4 7 13\n' },
    { ten: { en: 'nothing left, everything kept, the root goes', vi: 'không còn gì, giữ hết, gốc bị bỏ' }, vao: '20 30 : 8 3 10\n0 100 : 8 3 10\n9 20 : 8 3 10 9 11\n5 5 : 8 3 10 1 6 5 7\n', an: true },
  ],
  goiY: [
    { en: 'If t.key < lo, nothing in t.left can be in range either — return the trimmed right subtree directly.', vi: 'Nếu t.key < lo thì không gì trong t.left nằm trong khoảng — trả thẳng cây con phải đã cắt.' },
    { en: 'When t is kept, reassign both children with the recursive results.', vi: 'Khi giữ t, gán lại cả hai con bằng kết quả đệ quy.' },
  ],
  loiHayGap: [
    { en: 'Calling trim on the children without assigning the result — nothing changes.', vi: 'Gọi trim cho các con mà không gán kết quả — không gì thay đổi.' },
    { en: 'Deleting keys one by one with a delete function — correct but O(n·h).', vi: 'Xoá từng khoá bằng hàm xoá — đúng nhưng O(n·h).' },
  ],
  giaiThich: { en: '<p>"Return the new root of the subtree and let the caller relink it" removes all parent-pointer bookkeeping. Each node is visited at most once, and whole subtrees outside the range are dropped without being visited.</p>', vi: '<p>"Trả gốc mới của cây con và để người gọi nối lại" bỏ hết việc giữ con trỏ cha. Mỗi nút được ghé tối đa một lần, và cả cây con nằm ngoài khoảng bị bỏ đi mà không cần ghé.</p>' },
});

export default moDun({ slug: 'csd201-bst-chen-xoa', ten: '4.5 BST insertion & the three deletion cases', de: [de1, de2, de3] });
