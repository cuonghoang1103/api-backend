/**
 * CSD201 · Chương 4 — cây, BST, AVL, heap.
 * Bài 📑 học theo từng slide: csd8 (4A-Trees1.ppt, 34 slide); csd9 (4B-Trees2.ppt, 33 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch4.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-ch4).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 4.A — 📑 Slide by slide · Trees, part 1a: terminology & traversals (4A-Trees1, slides 1–17) ───────── */
const L_csd8_1 = {
  title: '4.A — 📑 Slide by slide · Trees, part 1a: terminology & traversals (4A-Trees1, slides 1–17)|||4.A — 📑 Học theo từng slide · Cây, phần 1a: thuật ngữ & phép duyệt (4A-Trees1, slide 1–17)',
  slug: 'csd201-slide-csd8-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–17 của bộ 4A-Trees1: cây và định nghĩa đệ quy, thuật ngữ (gốc, lá, mức, chiều cao — hai quy ước), bậc và đường đi, cây có thứ tự, duyệt tiền/hậu thứ tự và theo chiều rộng trên cây tổng quát, các loại cây nhị phân, cây biểu thức, bốn phép duyệt cây nhị phân và dựng lại cây từ hai dãy duyệt — 15 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.A · 4A-Trees1, slides 1–17</span>
<h2>Trees, part 1a — what a tree is and how to walk through one</h2>
<p class="lead">This is the first half of the deck shown when chapter 4 starts (syllabus sessions 15–16, CLO4). Read it before lessons 4.1–4.3 below: every slide is explained, the vocabulary is pinned to one example tree, each traversal is run in Java and redrawn step by step, and the two different definitions of "level" and "height" are kept apart — they cost marks every semester.</p>
<div class="callout"><strong>CLO4 in the syllabus:</strong> explain the general tree, the binary tree and the binary search tree (BST); implement a BST with its basic operations. This half builds the vocabulary and the traversals; lesson 4.B (slides 18–34) turns them into the <code>BSTree</code> class you type in the PE (practical exam). FE (final exam) questions on this part are mostly "which order does this traversal print?", "what is the height / level?" and "which kind of binary tree is this?".</div>
<h3>Slides 1–17 in one table</h3>
<table>
<thead><tr><th>Idea</th><th>Slides</th><th>In one line</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Tree, root, parent, child</td><td>3</td><td>a hierarchy; every node except the root has exactly one parent</td><td>—</td></tr>
<tr><td>Level (depth), height</td><td>4</td><td>slide: root level 1, one-node tree height 1 · textbook: both start at 0</td><td>height: O(n)</td></tr>
<tr><td>Degree, path, path length</td><td>5</td><td>degree = number of children; the path from the root is unique; length = number of arcs</td><td>—</td></tr>
<tr><td>Ordered tree</td><td>7</td><td>the children of a node have a first, second, third…</td><td>—</td></tr>
<tr><td>Preorder / postorder (general tree)</td><td>8–9</td><td>node before / after its descendants</td><td>O(n)</td></tr>
<tr><td>Breadth-first (level order)</td><td>10, 14</td><td>level by level, with a queue</td><td>O(n) time, queue up to one level wide</td></tr>
<tr><td>Binary tree, proper, complete</td><td>11–12</td><td>at most 2 children; proper = 0 or 2 children; slide's "complete" = all leaves on one level</td><td>—</td></tr>
<tr><td>Expression tree</td><td>13</td><td>operators inside, operands on the leaves; binary operators give a proper tree</td><td>evaluate: O(n)</td></tr>
<tr><td>Preorder NLR, inorder LNR, postorder LRN</td><td>15–16</td><td>where the node (N) sits relative to left (L) and right (R)</td><td>O(n) time, O(h) call stack</td></tr>
<tr><td>Rebuild from inorder + preorder</td><td>17</td><td>preorder gives the root, inorder splits left from right</td><td>O(n²) simple, O(n) with a map</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.A · 4A-Trees1, slide 1–17</span>
<h2>Cây, phần 1a — cây là gì và đi qua một cây như thế nào</h2>
<p class="lead">Đây là nửa đầu bộ slide được chiếu khi bắt đầu chương 4 (buổi 15–16 theo syllabus, CLO4). Hãy đọc bài này trước các bài 4.1–4.3 bên dưới: slide nào cũng được giảng, mọi thuật ngữ gắn vào một cây ví dụ, mỗi phép duyệt (traversal) đều chạy bằng Java và vẽ lại từng bước, còn hai định nghĩa khác nhau của "mức" (level) và "chiều cao" (height) được tách bạch — học kỳ nào cũng có người mất điểm vì chúng.</p>
<div class="callout"><strong>CLO4 trong syllabus:</strong> giải thích cây tổng quát (general tree), cây nhị phân (binary tree) và cây nhị phân tìm kiếm (binary search tree — BST); cài đặt BST với các thao tác cơ bản. Nửa này xây từ vựng và các phép duyệt; bài 4.B (slide 18–34) biến chúng thành lớp <code>BSTree</code> mà bạn sẽ gõ trong PE (thi thực hành). Câu hỏi FE (thi cuối kỳ) về phần này chủ yếu là "phép duyệt này in ra thứ tự nào?", "chiều cao / mức bằng bao nhiêu?" và "đây là loại cây nhị phân nào?".</div>
<h3>Slide 1–17 trong một bảng</h3>
<table>
<thead><tr><th>Ý</th><th>Slide</th><th>Một dòng</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>Cây, gốc (root), cha (parent), con (child)</td><td>3</td><td>một hệ phân cấp; mọi nút trừ gốc có đúng một cha</td><td>—</td></tr>
<tr><td>Mức (level, depth), chiều cao (height)</td><td>4</td><td>slide: gốc ở mức 1, cây một nút cao 1 · sách: cả hai bắt đầu từ 0</td><td>tính chiều cao: O(n)</td></tr>
<tr><td>Bậc (degree), đường đi (path), độ dài đường đi</td><td>5</td><td>bậc = số con; đường đi từ gốc là duy nhất; độ dài = số cạnh (arc)</td><td>—</td></tr>
<tr><td>Cây có thứ tự (ordered tree)</td><td>7</td><td>các con của một nút có thứ nhất, thứ hai, thứ ba…</td><td>—</td></tr>
<tr><td>Tiền thứ tự / hậu thứ tự (preorder / postorder) trên cây tổng quát</td><td>8–9</td><td>thăm nút trước / sau các con cháu của nó</td><td>O(n)</td></tr>
<tr><td>Duyệt theo chiều rộng (breadth-first, level order)</td><td>10, 14</td><td>từng mức một, dùng hàng đợi (queue)</td><td>O(n) thời gian, hàng đợi rộng tối đa cỡ một mức</td></tr>
<tr><td>Cây nhị phân, cây proper, cây complete</td><td>11–12</td><td>tối đa 2 con; proper = mỗi nút 0 hoặc 2 con; "complete" của slide = mọi lá cùng một mức</td><td>—</td></tr>
<tr><td>Cây biểu thức (expression tree)</td><td>13</td><td>toán tử ở nút trong, toán hạng ở lá; toán tử hai ngôi cho cây proper</td><td>tính giá trị: O(n)</td></tr>
<tr><td>Tiền thứ tự NLR (preorder), trung thứ tự LNR (inorder), hậu thứ tự LRN (postorder)</td><td>15–16</td><td>vị trí của nút (N) so với trái (L) và phải (R)</td><td>O(n) thời gian, O(h) ngăn xếp lời gọi</td></tr>
<tr><td>Dựng lại cây từ inorder + preorder</td><td>17</td><td>preorder cho biết gốc, inorder tách trái khỏi phải</td><td>O(n²) cách đơn giản, O(n) khi dùng bảng băm (map)</td></tr>
</tbody>
</table>`),
    walkHead('csd8', 1, 17),
    walk('csd8', [
      [1, '4. Trees - Part 1',
        `<p class="y-chinh">🎯 Chapter 4 leaves the straight line behind: after lists, stacks and queues (one item after another), a tree lets one item branch into several.</p>
<p>Part 1 (this deck, 34 slides) covers general trees, binary trees, traversals and the binary search tree with insertion and deletion; part 2 (deck 4B-Trees2) continues with balancing, AVL trees and heaps.</p>`,
        `<p class="y-chinh">🎯 Chương 4 rời khỏi "đường thẳng": sau danh sách, ngăn xếp, hàng đợi (phần tử nọ nối tiếp phần tử kia), cây (tree) cho một phần tử rẽ nhánh ra nhiều phần tử.</p>
<p>Phần 1 (bộ slide này, 34 slide) học cây tổng quát (general tree), cây nhị phân (binary tree), các phép duyệt (traversal) và cây nhị phân tìm kiếm (binary search tree — BST) với thao tác chèn, xoá; phần 2 (bộ 4B-Trees2) học tiếp cân bằng cây, cây AVL và đống (heap).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Ten topics, in the order the deck teaches them — from "what is a tree" to deleting a key from a binary search tree.</p>
<ol>
<li><strong>What is a tree, terminology, examples</strong> — slides 3–6 (root, leaf, level, height, degree, path).</li>
<li><strong>Ordered trees and tree traversals</strong> — slides 7–10 (preorder, postorder and breadth-first on a general tree).</li>
<li><strong>Binary trees</strong> — slides 11–17 (kinds of binary trees, expression trees, the four traversals, rebuilding a tree from two traversals).</li>
<li><strong>Implementing binary trees</strong> — slides 18–21 (array or linked nodes, the traversal code).</li>
<li><strong>Binary search tree: search, insertion, deletion</strong> — slides 22–32.</li>
</ol>
<p>This lesson (4.A) walks through slides 1–17; lesson 4.B continues with slides 18–34.</p>
<p class="meo">🧠 <strong>Remember:</strong> the deck climbs one rule at a time — tree → binary tree (at most two children) → binary <em>search</em> tree (left smaller, right larger).</p>`,
        `<p class="y-chinh">🎯 Mười chủ đề, theo đúng thứ tự bộ slide dạy — từ "cây là gì" tới xoá một khoá khỏi cây nhị phân tìm kiếm.</p>
<ol>
<li><strong>Cây là gì, thuật ngữ, ví dụ</strong> — slide 3–6 (gốc — root, lá — leaf, mức — level, chiều cao — height, bậc — degree, đường đi — path).</li>
<li><strong>Cây có thứ tự (ordered tree) và các phép duyệt cây (tree traversal)</strong> — slide 7–10 (tiền thứ tự — preorder, hậu thứ tự — postorder và duyệt theo chiều rộng — breadth-first trên cây tổng quát).</li>
<li><strong>Cây nhị phân (binary tree)</strong> — slide 11–17 (các loại cây nhị phân, cây biểu thức, bốn phép duyệt, dựng lại cây từ hai dãy duyệt).</li>
<li><strong>Cài đặt cây nhị phân</strong> — slide 18–21 (bằng mảng hay bằng các nút liên kết, code duyệt cây).</li>
<li><strong>Cây nhị phân tìm kiếm (binary search tree — BST): tìm kiếm, chèn (insertion), xoá (deletion)</strong> — slide 22–32.</li>
</ol>
<p>Bài này (4.A) đi qua slide 1–17; bài 4.B học tiếp slide 18–34.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bộ slide leo từng bậc, mỗi bậc thêm một luật — cây → cây nhị phân (tối đa hai con) → cây nhị phân <em>tìm kiếm</em> (trái nhỏ hơn, phải lớn hơn).</p>`],
      [3, 'What is a Tree?',
        `<p class="y-chinh">🎯 A tree models a hierarchy: nodes linked by parent–child relations, in which every node except one — the root — has exactly one parent.</p>
<ul>
<li><strong>Abstract model</strong>: like the list ADT of chapter 1, "tree" says what the structure looks like, not how it is stored.</li>
<li><strong>Where you meet it</strong> (slide): family trees — the inspiration — organization charts, file systems, programming environments.</li>
<li><strong>The slide's picture</strong> is the organization chart of a company called Computers"R"Us, with the units Sales, R&amp;D, Manufacturing, Laptops, Desktops, US, International, Europe, Asia and Canada.</li>
<li><strong>Exact definition (recursive)</strong>: an empty structure is an empty tree; a non-empty tree is a root plus its children, and <em>each child is again a tree</em>.</li>
</ul>
<p>The program is the lesson's own example, built from the names on the slide (compare it with the picture). Each node keeps its one parent and a list of children, and <code>size()</code> follows the recursive definition word for word:</p>
<pre><code class="language-java">import java.util.ArrayList;

class TNode {
    String name;
    TNode parent;                                    // the unique parent (null only for the root)
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(String name) { this.name = name; }

    TNode add(String childName) {                    // make a child, link it both ways
        TNode c = new TNode(childName);
        c.parent = this;
        children.add(c);
        return c;
    }
}

public class GeneralTree {
    // a tree is empty, or a root whose children are trees -&gt; recursion
    static int size(TNode t) {
        if (t == null) return 0;                     // the empty tree
        int s = 1;                                   // the root itself
        for (TNode c : t.children) s += size(c);     // plus every child tree
        return s;
    }

    static void families(TNode t) {                  // print "children -&gt; parent" for every node that has children
        if (t.children.isEmpty()) return;
        StringBuilder s = new StringBuilder();
        for (TNode c : t.children) s.append(s.length() == 0 ? "" : ", ").append(c.name);
        System.out.println(s + "  -&gt; parent " + t.name);
        for (TNode c : t.children) families(c);
    }

    public static void main(String[] args) {
        TNode root = new TNode("Computers\\"R\\"Us");
        TNode sales = root.add("Sales");
        root.add("R&amp;D");
        TNode manu = root.add("Manufacturing");
        sales.add("US");
        TNode intl = sales.add("International");
        manu.add("Laptops");
        manu.add("Desktops");
        intl.add("Europe");
        intl.add("Asia");
        TNode canada = intl.add("Canada");

        System.out.println(root.name + " has parent " + root.parent + "  -&gt; it is the root");
        families(root);
        StringBuilder up = new StringBuilder(canada.name);
        for (TNode p = canada.parent; p != null; p = p.parent) up.append(" -&gt; ").append(p.name);
        System.out.println("Canada up to the root: " + up);
        System.out.println("size(" + root.name + ") = " + size(root) + " nodes");
        System.out.println("size(Sales) = " + size(sales) + " nodes: a child of a tree is a tree too");
    }
}</code></pre>
<div class="out">Computers"R"Us has parent null &nbsp;-&gt; it is the root<br>
Sales, R&amp;D, Manufacturing &nbsp;-&gt; parent Computers"R"Us<br>
US, International &nbsp;-&gt; parent Sales<br>
Europe, Asia, Canada &nbsp;-&gt; parent International<br>
Laptops, Desktops &nbsp;-&gt; parent Manufacturing<br>
Canada up to the root: Canada -&gt; International -&gt; Sales -&gt; Computers"R"Us<br>
size(Computers"R"Us) = 11 nodes<br>
size(Sales) = 6 nodes: a child of a tree is a tree too</div>
<p><strong>Why the recursive definition matters:</strong> almost every algorithm of this chapter — size, height, traversals, search — is "do something at the root, then call yourself on each subtree". <code>size()</code> touches each node once, so it is O(n).</p>
<p class="dap-an">✅ <strong>Answer to the title question:</strong> a tree is a set of nodes with a parent–child relation such that exactly one node (the root) has no parent and every other node has exactly one — so from the root there is one and only one way down to each node.</p>
<div class="pitfall">"Every node of a tree has exactly one parent" is false — the root has none. The correct wording, and a favourite FE option, is "every node <em>except the root</em> has a unique parent".</div>`,
        `<p class="y-chinh">🎯 Cây (tree) mô hình hoá một hệ phân cấp (hierarchy): các nút (node) nối nhau bằng quan hệ cha–con (parent–child), trong đó mọi nút trừ một nút duy nhất — gốc (root) — đều có đúng một cha.</p>
<ul>
<li><strong>Mô hình trừu tượng (abstract model)</strong>: giống ADT danh sách ở chương 1, "cây" nói cấu trúc trông như thế nào, không nói lưu trữ ra sao.</li>
<li><strong>Gặp ở đâu</strong> (theo slide): cây gia phả (family tree — nguồn cảm hứng), sơ đồ tổ chức (organization chart), hệ thống tệp (file system), môi trường lập trình (programming environment).</li>
<li><strong>Hình trên slide</strong> là sơ đồ tổ chức của công ty Computers"R"Us, gồm các đơn vị Sales, R&amp;D, Manufacturing, Laptops, Desktops, US, International, Europe, Asia và Canada.</li>
<li><strong>Định nghĩa chính xác (đệ quy — recursive)</strong>: cấu trúc rỗng là cây rỗng (empty tree); cây khác rỗng gồm một gốc cùng các con của nó, và <em>mỗi con lại là một cây</em>.</li>
</ul>
<p>Chương trình dưới là ví dụ của bài, dựng từ chính các tên trên slide (hãy đối chiếu với hình). Mỗi nút giữ một cha duy nhất và danh sách các con, còn <code>size()</code> (đếm số nút) làm đúng từng chữ của định nghĩa đệ quy:</p>
<pre><code class="language-java">import java.util.ArrayList;

class TNode {
    String name;
    TNode parent;                                    // cha duy nhất (chỉ gốc có cha = null)
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(String name) { this.name = name; }

    TNode add(String childName) {                    // tạo một con, nối cả hai chiều
        TNode c = new TNode(childName);
        c.parent = this;
        children.add(c);
        return c;
    }
}

public class GeneralTree {
    // cây là rỗng, hoặc một gốc mà các con đều là cây -&gt; đệ quy
    static int size(TNode t) {
        if (t == null) return 0;                     // cây rỗng
        int s = 1;                                   // chính gốc
        for (TNode c : t.children) s += size(c);     // cộng mọi cây con
        return s;
    }

    static void families(TNode t) {                  // in "các con -&gt; cha" cho mọi nút có con
        if (t.children.isEmpty()) return;
        StringBuilder s = new StringBuilder();
        for (TNode c : t.children) s.append(s.length() == 0 ? "" : ", ").append(c.name);
        System.out.println(s + "  -&gt; parent " + t.name);
        for (TNode c : t.children) families(c);
    }

    public static void main(String[] args) {
        TNode root = new TNode("Computers\\"R\\"Us");
        TNode sales = root.add("Sales");
        root.add("R&amp;D");
        TNode manu = root.add("Manufacturing");
        sales.add("US");
        TNode intl = sales.add("International");
        manu.add("Laptops");
        manu.add("Desktops");
        intl.add("Europe");
        intl.add("Asia");
        TNode canada = intl.add("Canada");

        System.out.println(root.name + " has parent " + root.parent + "  -&gt; it is the root");
        families(root);
        StringBuilder up = new StringBuilder(canada.name);
        for (TNode p = canada.parent; p != null; p = p.parent) up.append(" -&gt; ").append(p.name);
        System.out.println("Canada up to the root: " + up);
        System.out.println("size(" + root.name + ") = " + size(root) + " nodes");
        System.out.println("size(Sales) = " + size(sales) + " nodes: a child of a tree is a tree too");
    }
}</code></pre>
<div class="out">Computers"R"Us has parent null &nbsp;-&gt; it is the root<br>
Sales, R&amp;D, Manufacturing &nbsp;-&gt; parent Computers"R"Us<br>
US, International &nbsp;-&gt; parent Sales<br>
Europe, Asia, Canada &nbsp;-&gt; parent International<br>
Laptops, Desktops &nbsp;-&gt; parent Manufacturing<br>
Canada up to the root: Canada -&gt; International -&gt; Sales -&gt; Computers"R"Us<br>
size(Computers"R"Us) = 11 nodes<br>
size(Sales) = 6 nodes: a child of a tree is a tree too</div>
<p><strong>Vì sao định nghĩa đệ quy quan trọng:</strong> gần như mọi thuật toán trong chương — đếm nút, tính chiều cao, duyệt, tìm kiếm — đều là "làm gì đó ở gốc, rồi tự gọi lại chính mình trên từng cây con (subtree)". <code>size()</code> chạm mỗi nút đúng một lần nên tốn O(n).</p>
<p class="dap-an">✅ <strong>Trả lời câu hỏi ở tiêu đề:</strong> cây là một tập nút có quan hệ cha–con sao cho đúng một nút (gốc) không có cha và mọi nút còn lại có đúng một cha — vì vậy từ gốc chỉ có một và chỉ một con đường đi xuống tới mỗi nút.</p>
<div class="pitfall">"Mọi nút của cây đều có đúng một cha" là SAI — gốc không có cha. Câu đúng, cũng là phương án FE rất hay gặp, là "mọi nút <em>trừ gốc</em> đều có duy nhất một cha".</div>`],
      [4, 'Tree Terminology - 1',
        `<p class="y-chinh">🎯 The basic vocabulary — root, internal node, leaf, ancestor, descendant, subtree, level, height — pinned to one tree with the nodes A to K.</p>
<p>The slide lists the internal nodes A, B, C, F and the leaves E, I, J, K, G, H, D. Those lists match the classic textbook tree below (check it against the picture):</p>
<pre><code class="language-plaintext">          A
   /      |      \\
  B       C       D
 / \\     / \\
E   F   G   H
   /|\\
  I J K</code></pre>
<ul>
<li><strong>Root</strong>: the unique node without a parent (A). <strong>Internal node</strong>: at least one child (A, B, C, F). <strong>External node = leaf</strong>: no children (E, I, J, K, G, H, D).</li>
<li><strong>Ancestors</strong> of a node: parent, grandparent, great-grandparent… — for I: F, B, A. <strong>Descendants</strong>: child, grandchild… — for B: E, F, I, J, K.</li>
<li><strong>Subtree</strong>: a node together with all its descendants.</li>
<li><strong>Level</strong> (also called depth): the slide gives the root level 1, and children of a level-i node are on level i + 1. Some documents — the textbook among them — start at 0.</li>
<li><strong>Height of a tree</strong>: the maximum level, i.e. the number of nodes on the longest root-to-leaf path. So a one-node tree has height 1 and the empty tree height 0. <strong>Height of a node p</strong> = height of the subtree rooted at p. The textbook counts edges instead, so its heights are one smaller.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class TNode {
    char name;
    TNode parent;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(char name, TNode parent) {
        this.name = name;
        this.parent = parent;
        if (parent != null) parent.children.add(this);
    }
}

public class TreeTerms {
    static int level(TNode v) {                      // slide: the root has level 1
        return v.parent == null ? 1 : level(v.parent) + 1;
    }

    static int height(TNode v) {                     // slide: a single node has height 1
        int h = 0;
        for (TNode c : v.children) h = Math.max(h, height(c));
        return h + 1;
    }

    static String descendants(TNode v) {             // children, grandchildren, ...
        String s = "";
        for (TNode c : v.children) s += c.name + " " + descendants(c);
        return s;
    }

    public static void main(String[] args) {
        char[] parentOf = {' ', 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'F', 'F', 'F'};   // parent of B, C, ..., K
        TNode[] t = new TNode[11];                   // t[0] = A, t[1] = B, ..., t[10] = K
        for (int i = 0; i &lt; 11; i++)
            t[i] = new TNode((char) ('A' + i), i == 0 ? null : t[parentOf[i] - 'A']);

        System.out.println("node  kind            level  depth  height(slide)  height(book)");
        for (TNode v : t) {
            String kind = v.children.isEmpty() ? "leaf (external)" : (v.parent == null ? "root, internal" : "internal");
            System.out.printf("%-5s %-15s %-6d %-6d %-14d %d%n", v.name, kind, level(v), level(v) - 1, height(v), height(v) - 1);
        }
        String anc = "";
        for (TNode p = t[8].parent; p != null; p = p.parent) anc += p.name + " ";
        System.out.println("ancestors of I: " + anc);
        System.out.println("descendants of B: " + descendants(t[1]));
        System.out.println("height of the tree = " + height(t[0]) + " (slide: count nodes) = " + (height(t[0]) - 1) + " (book: count edges)");
    }
}</code></pre>
<div class="out">node &nbsp;kind &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;level &nbsp;depth &nbsp;height(slide) &nbsp;height(book)<br>
A &nbsp;&nbsp;&nbsp;&nbsp;root, internal &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
B &nbsp;&nbsp;&nbsp;&nbsp;internal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
C &nbsp;&nbsp;&nbsp;&nbsp;internal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
D &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
E &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
F &nbsp;&nbsp;&nbsp;&nbsp;internal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
G &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
H &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
I &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
J &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
K &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
ancestors of I: F B A<br>
descendants of B: E F I J K<br>
height of the tree = 4 (slide: count nodes) = 3 (book: count edges)</div>
<p><strong>Big-O:</strong> the program computes <code>height()</code> by recursion on every child — each node once, O(n). <code>level()</code> walks up the parents, O(level).</p>
<p class="meo">🧠 <strong>Remember:</strong> the slide numbers levels like floors in Hà Nội (the floor at street level is floor 1); the textbook numbers them like a European lift (street level = 0). Same building, numbers shifted by one.</p>
<div class="pitfall">"What is the height of this tree?" has two correct answers: 4 by the slide, 3 by the textbook. Read what the question says about the root (level 0 or 1) or a single node (height 0 or 1) before you pick — the distractor with the other convention is always among the options. Also: the root of a one-node tree is a <em>leaf</em>, not an internal node.</div>`,
        `<p class="y-chinh">🎯 Bộ từ vựng cơ bản — gốc, nút trong, lá, tổ tiên, con cháu, cây con, mức, chiều cao — gắn vào một cây có các nút từ A tới K.</p>
<p>Slide liệt kê các nút trong A, B, C, F và các lá E, I, J, K, G, H, D. Hai danh sách đó khớp với cây kinh điển của sách vẽ dưới đây (hãy đối chiếu với hình):</p>
<pre><code class="language-plaintext">          A
   /      |      \\
  B       C       D
 / \\     / \\
E   F   G   H
   /|\\
  I J K</code></pre>
<ul>
<li><strong>Gốc (root)</strong>: nút duy nhất không có cha (A). <strong>Nút trong (internal node)</strong>: có ít nhất một con (A, B, C, F). <strong>Nút ngoài (external node) = lá (leaf)</strong>: không có con (E, I, J, K, G, H, D).</li>
<li><strong>Tổ tiên (ancestors)</strong> của một nút: cha, ông, cụ… — của I là F, B, A. <strong>Con cháu (descendants)</strong>: con, cháu… — của B là E, F, I, J, K.</li>
<li><strong>Cây con (subtree)</strong>: một nút cùng toàn bộ con cháu của nó.</li>
<li><strong>Mức (level)</strong>, còn gọi là độ sâu (depth): slide cho gốc ở mức 1, con của nút ở mức i thì ở mức i + 1. Một số tài liệu — trong đó có sách giáo trình — bắt đầu từ 0.</li>
<li><strong>Chiều cao của cây (height)</strong>: mức lớn nhất, tức là số nút trên đường đi dài nhất từ gốc xuống lá. Vì vậy cây một nút cao 1, cây rỗng cao 0. <strong>Chiều cao của nút p</strong> = chiều cao của cây con có gốc p. Sách đếm số cạnh (edge) thay vì số nút, nên chiều cao theo sách nhỏ hơn 1.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class TNode {
    char name;
    TNode parent;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(char name, TNode parent) {
        this.name = name;
        this.parent = parent;
        if (parent != null) parent.children.add(this);
    }
}

public class TreeTerms {
    static int level(TNode v) {                      // slide: gốc có level 1
        return v.parent == null ? 1 : level(v.parent) + 1;
    }

    static int height(TNode v) {                     // slide: cây một nút cao 1
        int h = 0;
        for (TNode c : v.children) h = Math.max(h, height(c));
        return h + 1;
    }

    static String descendants(TNode v) {             // con, cháu, chắt...
        String s = "";
        for (TNode c : v.children) s += c.name + " " + descendants(c);
        return s;
    }

    public static void main(String[] args) {
        char[] parentOf = {' ', 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'F', 'F', 'F'};   // cha của B, C, ..., K
        TNode[] t = new TNode[11];                   // t[0] = A, t[1] = B, ..., t[10] = K
        for (int i = 0; i &lt; 11; i++)
            t[i] = new TNode((char) ('A' + i), i == 0 ? null : t[parentOf[i] - 'A']);

        System.out.println("node  kind            level  depth  height(slide)  height(book)");
        for (TNode v : t) {
            String kind = v.children.isEmpty() ? "leaf (external)" : (v.parent == null ? "root, internal" : "internal");
            System.out.printf("%-5s %-15s %-6d %-6d %-14d %d%n", v.name, kind, level(v), level(v) - 1, height(v), height(v) - 1);
        }
        String anc = "";
        for (TNode p = t[8].parent; p != null; p = p.parent) anc += p.name + " ";
        System.out.println("ancestors of I: " + anc);
        System.out.println("descendants of B: " + descendants(t[1]));
        System.out.println("height of the tree = " + height(t[0]) + " (slide: count nodes) = " + (height(t[0]) - 1) + " (book: count edges)");
    }
}</code></pre>
<div class="out">node &nbsp;kind &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;level &nbsp;depth &nbsp;height(slide) &nbsp;height(book)<br>
A &nbsp;&nbsp;&nbsp;&nbsp;root, internal &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
B &nbsp;&nbsp;&nbsp;&nbsp;internal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
C &nbsp;&nbsp;&nbsp;&nbsp;internal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
D &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
E &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
F &nbsp;&nbsp;&nbsp;&nbsp;internal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
G &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
H &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
I &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
J &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
K &nbsp;&nbsp;&nbsp;&nbsp;leaf (external) 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
ancestors of I: F B A<br>
descendants of B: E F I J K<br>
height of the tree = 4 (slide: count nodes) = 3 (book: count edges)</div>
<p><strong>Big-O:</strong> chương trình tính <code>height()</code> bằng đệ quy trên mọi con — mỗi nút một lần, O(n). <code>level()</code> đi ngược lên các cha, tốn O(level).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> slide đánh số mức như cách gọi tầng ở Hà Nội (tầng sát mặt đường là tầng 1); sách đánh số như thang máy châu Âu (sát mặt đường là tầng 0). Cùng một toà nhà, con số lệch nhau 1.</p>
<div class="pitfall">"Chiều cao của cây này là bao nhiêu?" có hai đáp án đúng: 4 theo slide, 3 theo sách. Đọc kỹ đề nói gì về gốc (mức 0 hay 1) hoặc về cây một nút (cao 0 hay 1) rồi mới chọn — phương án theo quy ước còn lại luôn nằm sẵn trong các lựa chọn. Thêm nữa: gốc của cây chỉ có một nút là <em>lá</em>, không phải nút trong.</div>`],
      [5, 'Tree Terminology - 2',
        `<p class="y-chinh">🎯 Three more words: the degree of a node (how many children it has), the path from the root to a node (always unique) and the length of a path (the number of arcs on it).</p>
<ul>
<li><strong>Degree (order) of a node</strong>: the number of its non-empty children. In the A…K tree: A and F have degree 3, B and C degree 2, every leaf degree 0. Many books also call the largest node degree the degree of the tree (here 3; a binary tree has degree at most 2).</li>
<li><strong>Path</strong>: every node is reached from the root by a <em>unique</em> sequence of arcs (edges). It is unique because each node has only one parent: walking up can never branch.</li>
<li><strong>Length of a path</strong> = the number of arcs, not the number of nodes: A → B → F → J has 4 nodes and length 3.</li>
<li>So a node's level on the slide = (length of its path from the root) + 1.</li>
<li><strong>The picture</strong> shows a university's hierarchy as a tree. The lesson's own example of the same idea: university → faculties → departments → study programmes; the degree of the university node is its number of faculties.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class TNode {
    char name;
    TNode parent;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(char name, TNode parent) {
        this.name = name;
        this.parent = parent;
        if (parent != null) parent.children.add(this);
    }
}

public class DegreePath {
    public static void main(String[] args) {
        char[] parentOf = {' ', 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'F', 'F', 'F'};
        TNode[] t = new TNode[11];                   // the tree of slide 4: A ... K
        for (int i = 0; i &lt; 11; i++)
            t[i] = new TNode((char) ('A' + i), i == 0 ? null : t[parentOf[i] - 'A']);

        StringBuilder deg = new StringBuilder("degree:");
        int maxDeg = 0, sumDeg = 0;
        for (TNode v : t) {
            int d = v.children.size();               // degree = number of non-empty children
            deg.append(" ").append(v.name).append("=").append(d);
            maxDeg = Math.max(maxDeg, d);
            sumDeg += d;
        }
        System.out.println(deg);
        System.out.println("degree of the tree (largest node degree) = " + maxDeg);

        TNode j = t[9];                              // walk up from J: each node has ONE parent, so the path is unique
        String path = "" + j.name;
        int arcs = 0;
        for (TNode p = j.parent; p != null; p = p.parent) {
            path = p.name + " -&gt; " + path;
            arcs++;
        }
        System.out.println("path from the root to J: " + path + "   length = " + arcs + " arcs");
        System.out.println("nodes = " + t.length + ", arcs = " + sumDeg + " (= nodes - 1: every node except the root has one arc to its parent)");
    }
}</code></pre>
<div class="out">degree: A=3 B=2 C=2 D=0 E=0 F=3 G=0 H=0 I=0 J=0 K=0<br>
degree of the tree (largest node degree) = 3<br>
path from the root to J: A -&gt; B -&gt; F -&gt; J &nbsp;&nbsp;length = 3 arcs<br>
nodes = 11, arcs = 10 (= nodes - 1: every node except the root has one arc to its parent)</div>
<p><strong>Counting fact:</strong> a tree with n nodes has exactly n − 1 arcs, because every node except the root owns exactly one arc (the one going up to its parent). The sum of all degrees counts the same arcs from the parent side, so it is also n − 1.</p>
<div class="pitfall">When a question asks for the length of a path, count the <em>arcs</em>. Counting nodes gives an answer one too large — and that wrong number is usually one of the options.</div>`,
        `<p class="y-chinh">🎯 Thêm ba khái niệm: bậc của một nút (có bao nhiêu con), đường đi từ gốc tới một nút (luôn duy nhất) và độ dài của đường đi (số cạnh trên đó).</p>
<ul>
<li><strong>Bậc (degree, order) của một nút</strong>: số con khác rỗng của nó. Trong cây A…K: A và F bậc 3, B và C bậc 2, mọi lá bậc 0. Nhiều sách còn gọi bậc lớn nhất trong các nút là bậc của cây (ở đây là 3; cây nhị phân có bậc tối đa 2).</li>
<li><strong>Đường đi (path)</strong>: mọi nút đều đi tới được từ gốc bằng một dãy cạnh (arc, edge) <em>duy nhất</em>. Duy nhất vì mỗi nút chỉ có một cha: đi ngược lên thì không bao giờ gặp ngã rẽ.</li>
<li><strong>Độ dài đường đi (length of a path)</strong> = số cạnh, không phải số nút: A → B → F → J có 4 nút nhưng độ dài 3.</li>
<li>Vì vậy mức (level) của một nút theo slide = (độ dài đường đi từ gốc tới nó) + 1.</li>
<li><strong>Hình trên slide</strong> là cơ cấu của một trường đại học vẽ thành cây. Ví dụ của bài cho cùng ý đó: trường → các khoa → các bộ môn → các chương trình đào tạo; bậc của nút "trường" chính là số khoa.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class TNode {
    char name;
    TNode parent;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(char name, TNode parent) {
        this.name = name;
        this.parent = parent;
        if (parent != null) parent.children.add(this);
    }
}

public class DegreePath {
    public static void main(String[] args) {
        char[] parentOf = {' ', 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'F', 'F', 'F'};
        TNode[] t = new TNode[11];                   // cây của slide 4: A ... K
        for (int i = 0; i &lt; 11; i++)
            t[i] = new TNode((char) ('A' + i), i == 0 ? null : t[parentOf[i] - 'A']);

        StringBuilder deg = new StringBuilder("degree:");
        int maxDeg = 0, sumDeg = 0;
        for (TNode v : t) {
            int d = v.children.size();               // bậc = số con khác rỗng
            deg.append(" ").append(v.name).append("=").append(d);
            maxDeg = Math.max(maxDeg, d);
            sumDeg += d;
        }
        System.out.println(deg);
        System.out.println("degree of the tree (largest node degree) = " + maxDeg);

        TNode j = t[9];                              // đi ngược từ J: mỗi nút có MỘT cha nên đường đi là duy nhất
        String path = "" + j.name;
        int arcs = 0;
        for (TNode p = j.parent; p != null; p = p.parent) {
            path = p.name + " -&gt; " + path;
            arcs++;
        }
        System.out.println("path from the root to J: " + path + "   length = " + arcs + " arcs");
        System.out.println("nodes = " + t.length + ", arcs = " + sumDeg + " (= nodes - 1: every node except the root has one arc to its parent)");
    }
}</code></pre>
<div class="out">degree: A=3 B=2 C=2 D=0 E=0 F=3 G=0 H=0 I=0 J=0 K=0<br>
degree of the tree (largest node degree) = 3<br>
path from the root to J: A -&gt; B -&gt; F -&gt; J &nbsp;&nbsp;length = 3 arcs<br>
nodes = 11, arcs = 10 (= nodes - 1: every node except the root has one arc to its parent)</div>
<p><strong>Sự thật về số cạnh:</strong> cây có n nút thì có đúng n − 1 cạnh, vì mọi nút trừ gốc sở hữu đúng một cạnh (cạnh nối lên cha của nó). Tổng bậc của mọi nút đếm lại chính các cạnh đó từ phía cha, nên cũng bằng n − 1.</p>
<div class="pitfall">Đề hỏi độ dài đường đi thì đếm <em>cạnh</em>. Đếm nút sẽ ra con số lớn hơn 1 — và con số sai đó thường nằm sẵn trong các phương án.</div>`],
      [6, 'Tree examples',
        `<p class="y-chinh">🎯 Trees are everywhere in computing — whenever each item belongs to exactly one "container" or "boss", the data forms a tree.</p>
<p class="ghi-chu">This slide is a picture (its text is only the title and the credit "Image Source: JEDI"), so the examples below are the lesson's own.</p>
<ul>
<li><strong>File system</strong>: folders contain files and folders; every file sits in one folder (slide 9 computes disk space on such a tree).</li>
<li><strong>Organization chart</strong>: every employee has one direct manager (slide 3).</li>
<li><strong>Book / web page</strong>: chapters → sections → paragraphs; an HTML page is a tree of nested tags (the DOM).</li>
<li><strong>Arithmetic expressions</strong>: operators with their operands (slide 13).</li>
<li><strong>Java classes</strong>: every class except <code>Object</code> has exactly one superclass, so all classes form one tree with <code>Object</code> at the root — the program walks up that tree:</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.LinkedList;

public class ClassTree {
    // every Java class except Object has exactly ONE superclass (its parent)
    static String upToRoot(Class&lt;?&gt; c) {
        StringBuilder s = new StringBuilder(c.getSimpleName());
        for (Class&lt;?&gt; p = c.getSuperclass(); p != null; p = p.getSuperclass())
            s.append(" -&gt; ").append(p.getSimpleName());
        return s.toString();
    }

    public static void main(String[] args) {
        System.out.println(upToRoot(Integer.class));
        System.out.println(upToRoot(Double.class));
        System.out.println(upToRoot(ArrayList.class));
        System.out.println(upToRoot(LinkedList.class));
        System.out.println(upToRoot(RuntimeException.class));
        System.out.println("superclass of Object = " + Object.class.getSuperclass() + "  -&gt; Object is the root");
    }
}</code></pre>
<div class="out">Integer -&gt; Number -&gt; Object<br>
Double -&gt; Number -&gt; Object<br>
ArrayList -&gt; AbstractList -&gt; AbstractCollection -&gt; Object<br>
LinkedList -&gt; AbstractSequentialList -&gt; AbstractList -&gt; AbstractCollection -&gt; Object<br>
RuntimeException -&gt; Exception -&gt; Throwable -&gt; Object<br>
superclass of Object = null &nbsp;-&gt; Object is the root</div>
<p>Each line is a path from a node up to the root — unique, exactly as slide 5 promised. Walking it costs O(depth).</p>
<div class="pitfall">Interfaces break the tree: a class may implement several interfaces and an interface may extend several, so "types including interfaces" form a graph, not a tree. Only the <code>extends</code> chain of classes is a tree. Likewise, any structure in which a node can have two parents, or with a cycle, is not a tree.</div>`,
        `<p class="y-chinh">🎯 Cây có mặt khắp nơi trong tin học — hễ mỗi phần tử thuộc về đúng một "vật chứa" hay một "sếp" là dữ liệu tạo thành cây.</p>
<p class="ghi-chu">Slide này là hình (chữ trích ra chỉ có tiêu đề và dòng ghi nguồn "Image Source: JEDI"), nên các ví dụ dưới đây là ví dụ của bài.</p>
<ul>
<li><strong>Hệ thống tệp (file system)</strong>: thư mục (folder) chứa tệp và thư mục con; mỗi tệp nằm trong đúng một thư mục (slide 9 tính dung lượng đĩa trên chính loại cây này).</li>
<li><strong>Sơ đồ tổ chức (organization chart)</strong>: mỗi nhân viên có đúng một quản lý trực tiếp (slide 3).</li>
<li><strong>Sách / trang web</strong>: chương → mục → đoạn; trang HTML là một cây các thẻ lồng nhau (gọi là DOM — mô hình đối tượng tài liệu).</li>
<li><strong>Biểu thức số học (arithmetic expression)</strong>: toán tử cùng các toán hạng của nó (slide 13).</li>
<li><strong>Các lớp Java</strong>: mọi lớp trừ <code>Object</code> có đúng một lớp cha (superclass), nên tất cả các lớp tạo thành một cây có gốc là <code>Object</code> — chương trình đi ngược lên cây đó:</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.LinkedList;

public class ClassTree {
    // mọi lớp Java trừ Object có đúng MỘT lớp cha
    static String upToRoot(Class&lt;?&gt; c) {
        StringBuilder s = new StringBuilder(c.getSimpleName());
        for (Class&lt;?&gt; p = c.getSuperclass(); p != null; p = p.getSuperclass())
            s.append(" -&gt; ").append(p.getSimpleName());
        return s.toString();
    }

    public static void main(String[] args) {
        System.out.println(upToRoot(Integer.class));
        System.out.println(upToRoot(Double.class));
        System.out.println(upToRoot(ArrayList.class));
        System.out.println(upToRoot(LinkedList.class));
        System.out.println(upToRoot(RuntimeException.class));
        System.out.println("superclass of Object = " + Object.class.getSuperclass() + "  -&gt; Object is the root");
    }
}</code></pre>
<div class="out">Integer -&gt; Number -&gt; Object<br>
Double -&gt; Number -&gt; Object<br>
ArrayList -&gt; AbstractList -&gt; AbstractCollection -&gt; Object<br>
LinkedList -&gt; AbstractSequentialList -&gt; AbstractList -&gt; AbstractCollection -&gt; Object<br>
RuntimeException -&gt; Exception -&gt; Throwable -&gt; Object<br>
superclass of Object = null &nbsp;-&gt; Object is the root</div>
<p>Mỗi dòng là một đường đi (path) từ một nút lên tới gốc — duy nhất, đúng như slide 5 đã nói. Đi hết đường đó tốn O(độ sâu).</p>
<div class="pitfall">Giao diện (interface) làm hỏng hình cây: một lớp có thể cài đặt (implements) nhiều interface và một interface có thể kế thừa (extends) nhiều interface, nên "các kiểu kể cả interface" tạo thành đồ thị (graph), không phải cây. Chỉ chuỗi <code>extends</code> giữa các lớp mới là cây. Tương tự, cấu trúc nào có nút mang hai cha, hoặc có chu trình (cycle), đều không phải cây.</div>`],
      [7, 'Ordered Trees',
        `<p class="y-chinh">🎯 A tree is ordered when the children of every node have a meaningful order — first, second, third… — usually drawn from left to right.</p>
<ul>
<li>The slide's example is an ordered tree associated with a book — the chapters and sections of a book only make sense in their order.</li>
<li>In code, an ordered tree keeps each node's children in a <code>List</code> or an array (position = order). A <code>Set</code> of children would give an unordered tree.</li>
<li>A binary tree (slide 11) is ordered by nature: "left child" and "right child" are different roles.</li>
</ul>
<p>The lesson's own example: a table of contents whose section numbers are computed from the children's positions. Reversing the order of the three chapters keeps the same parent–child pairs, yet the document — and every number — changes:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Collections;

class TNode {
    String title;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();   // a List keeps the order: 1st, 2nd, 3rd child

    TNode(String title) { this.title = title; }

    TNode add(String t) {
        TNode c = new TNode(t);
        children.add(c);
        return c;
    }
}

public class OrderedToc {
    // the section number of a child is its POSITION among its siblings
    static void toc(TNode v, String number) {
        for (int i = 0; i &lt; v.children.size(); i++) {
            TNode c = v.children.get(i);
            String num = number.isEmpty() ? "" + (i + 1) : number + "." + (i + 1);
            String pad = number.isEmpty() ? "" : "    ";
            System.out.println(pad + num + " " + c.title);
            toc(c, num);
        }
    }

    public static void main(String[] args) {
        TNode book = new TNode("CSD201 notes");
        TNode lists = book.add("Lists");
        lists.add("Arrays");
        lists.add("Linked lists");
        TNode trees = book.add("Trees");
        trees.add("Binary trees");
        trees.add("Binary search trees");
        book.add("Graphs");
        toc(book, "");
        Collections.reverse(book.children);          // same children, other order
        System.out.println("--- the same three chapters in reverse order ---");
        toc(book, "");
    }
}</code></pre>
<div class="out">1 Lists<br>
&nbsp;&nbsp;&nbsp;&nbsp;1.1 Arrays<br>
&nbsp;&nbsp;&nbsp;&nbsp;1.2 Linked lists<br>
2 Trees<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.1 Binary trees<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.2 Binary search trees<br>
3 Graphs<br>
--- the same three chapters in reverse order ---<br>
1 Graphs<br>
2 Trees<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.1 Binary trees<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.2 Binary search trees<br>
3 Lists<br>
&nbsp;&nbsp;&nbsp;&nbsp;3.1 Arrays<br>
&nbsp;&nbsp;&nbsp;&nbsp;3.2 Linked lists</div>
<p>Printing a table of contents like this visits a node before its children — that is exactly the preorder traversal of the next slide. It costs O(n).</p>
<p class="meo">🧠 <strong>Remember:</strong> ordered = "siblings have seats with numbers"; unordered = "siblings just stand in a group".</p>
<div class="pitfall">As ordered trees, A(B, C) and A(C, B) are two different trees even though A has the same two children. Tree questions in this course assume ordered trees unless they say otherwise — so traversal answers depend on the left-to-right order in the picture.</div>`,
        `<p class="y-chinh">🎯 Cây có thứ tự (ordered tree) là cây mà các con của mỗi nút có một thứ tự có ý nghĩa — thứ nhất, thứ hai, thứ ba… — thường vẽ từ trái sang phải.</p>
<ul>
<li>Ví dụ trên slide là một cây có thứ tự gắn với một cuốn sách — chương, mục của một cuốn sách chỉ có nghĩa khi đứng đúng thứ tự.</li>
<li>Trong code, cây có thứ tự lưu các con của mỗi nút trong một <code>List</code> hoặc mảng (vị trí = thứ tự). Nếu lưu các con trong một <code>Set</code> (tập hợp) thì ta được cây không thứ tự (unordered tree).</li>
<li>Cây nhị phân (binary tree, slide 11) vốn đã có thứ tự: "con trái" (left child) và "con phải" (right child) là hai vai khác nhau.</li>
</ul>
<p>Ví dụ của bài: một mục lục có số mục được tính từ vị trí của các con. Đảo thứ tự ba chương thì các cặp cha–con vẫn y nguyên, nhưng tài liệu — và mọi con số — đều đổi:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Collections;

class TNode {
    String title;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();   // List giữ thứ tự: con thứ 1, 2, 3

    TNode(String title) { this.title = title; }

    TNode add(String t) {
        TNode c = new TNode(t);
        children.add(c);
        return c;
    }
}

public class OrderedToc {
    // số mục của một con chính là VỊ TRÍ của nó giữa các anh em
    static void toc(TNode v, String number) {
        for (int i = 0; i &lt; v.children.size(); i++) {
            TNode c = v.children.get(i);
            String num = number.isEmpty() ? "" + (i + 1) : number + "." + (i + 1);
            String pad = number.isEmpty() ? "" : "    ";
            System.out.println(pad + num + " " + c.title);
            toc(c, num);
        }
    }

    public static void main(String[] args) {
        TNode book = new TNode("CSD201 notes");
        TNode lists = book.add("Lists");
        lists.add("Arrays");
        lists.add("Linked lists");
        TNode trees = book.add("Trees");
        trees.add("Binary trees");
        trees.add("Binary search trees");
        book.add("Graphs");
        toc(book, "");
        Collections.reverse(book.children);          // cùng các con, khác thứ tự
        System.out.println("--- the same three chapters in reverse order ---");
        toc(book, "");
    }
}</code></pre>
<div class="out">1 Lists<br>
&nbsp;&nbsp;&nbsp;&nbsp;1.1 Arrays<br>
&nbsp;&nbsp;&nbsp;&nbsp;1.2 Linked lists<br>
2 Trees<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.1 Binary trees<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.2 Binary search trees<br>
3 Graphs<br>
--- the same three chapters in reverse order ---<br>
1 Graphs<br>
2 Trees<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.1 Binary trees<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.2 Binary search trees<br>
3 Lists<br>
&nbsp;&nbsp;&nbsp;&nbsp;3.1 Arrays<br>
&nbsp;&nbsp;&nbsp;&nbsp;3.2 Linked lists</div>
<p>In mục lục như thế này là thăm một nút trước các con của nó — chính là phép duyệt tiền thứ tự (preorder) ở slide sau. Chi phí O(n).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> có thứ tự = "anh em ngồi ghế có đánh số"; không thứ tự = "anh em chỉ đứng thành một nhóm".</p>
<div class="pitfall">Xét như cây có thứ tự, A(B, C) và A(C, B) là hai cây khác nhau dù A có cùng hai con. Câu hỏi về cây trong môn này mặc định là cây có thứ tự nếu đề không nói gì khác — nên kết quả duyệt phụ thuộc vào thứ tự trái–phải trong hình.</div>`],
      [8, 'Pre-order Traversal of a tree',
        `<p class="y-chinh">🎯 Traversing a tree means visiting every node exactly once; in preorder a node is visited before its descendants — the order in which you read a structured document.</p>
<ul>
<li><strong>Algorithm</strong> (slide): <code>preOrder(v)</code>: <code>visit(v)</code>; then for each child w of v, from first to last: <code>preOrder(w)</code>.</li>
<li><strong>Application</strong> (slide): print a structured document — the title, then part 1 with all its sections, then part 2…</li>
<li><strong>The slide's example</strong> is the outline of "Make Money Fast!": two numbered parts (1. Motivations with 1.1 Greed and 1.2 Avidity; 2. Methods with 2.1 Stock Fraud, 2.2 Ponzi Scheme, 2.3 Bank Robbery) and References. The numbers 1–9 on the picture are the preorder visiting order.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class TNode {
    String name;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(String name) { this.name = name; }

    TNode add(String n) {
        TNode c = new TNode(n);
        children.add(c);
        return c;
    }
}

public class MoneyPreorder {
    static int count = 0;

    static void preOrder(TNode v, int depth) {
        count++;                                     // visit(v) FIRST ...
        String pad = "";
        for (int i = 0; i &lt; depth; i++) pad += "    ";
        System.out.println(count + "  " + pad + v.name);
        for (TNode w : v.children)                   // ... then each child, first to last
            preOrder(w, depth + 1);
    }

    public static void main(String[] args) {
        TNode doc = new TNode("Make Money Fast!");
        TNode m = doc.add("1. Motivations");
        TNode me = doc.add("2. Methods");
        doc.add("References");
        m.add("1.1 Greed");
        m.add("1.2 Avidity");
        me.add("2.1 Stock Fraud");
        me.add("2.2 Ponzi Scheme");
        me.add("2.3 Bank Robbery");
        preOrder(doc, 0);                            // the indent = how many calls are open above v
    }
}</code></pre>
<div class="out">1 &nbsp;Make Money Fast!<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Motivations<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.1 Greed<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.2 Avidity<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Methods<br>
6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1 Stock Fraud<br>
7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2 Ponzi Scheme<br>
8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.3 Bank Robbery<br>
9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;References</div>
<p class="nhan">Step by step — what is on the call stack when each node is visited</p>
<table>
<thead><tr><th>Visit</th><th>Node</th><th>Calls still open (root → current)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Make Money Fast!</td><td>preOrder(MMF)</td></tr>
<tr><td>2</td><td>1. Motivations</td><td>MMF → Motivations</td></tr>
<tr><td>3</td><td>1.1 Greed</td><td>MMF → Motivations → Greed</td></tr>
<tr><td>4</td><td>1.2 Avidity</td><td>MMF → Motivations → Avidity (the call for Greed has returned)</td></tr>
<tr><td>5</td><td>2. Methods</td><td>MMF → Methods (Motivations is finished)</td></tr>
<tr><td>6</td><td>2.1 Stock Fraud</td><td>MMF → Methods → Stock Fraud</td></tr>
<tr><td>7</td><td>2.2 Ponzi Scheme</td><td>MMF → Methods → Ponzi Scheme</td></tr>
<tr><td>8</td><td>2.3 Bank Robbery</td><td>MMF → Methods → Bank Robbery</td></tr>
<tr><td>9</td><td>References</td><td>MMF → References</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> one call per node, and the <code>for</code> loops together run n − 1 times (each node except the root is somebody's child once) → O(n). The call stack is at most as deep as the tree.</p>
<p class="meo">🧠 <strong>Remember:</strong> <strong>pre</strong> = the parent speaks <strong>before</strong> its children — like a table of contents, where a chapter title comes before its sections.</p>`,
        `<p class="y-chinh">🎯 Duyệt cây (tree traversal) là thăm mọi nút đúng một lần; theo tiền thứ tự (preorder), một nút được thăm trước các con cháu (descendants) của nó — đúng thứ tự ta đọc một tài liệu có cấu trúc.</p>
<ul>
<li><strong>Thuật toán</strong> (slide): <code>preOrder(v)</code>: thăm <code>visit(v)</code>; rồi với từng con w của v, từ con đầu tới con cuối: <code>preOrder(w)</code>.</li>
<li><strong>Ứng dụng</strong> (slide): in một tài liệu có cấu trúc (structured document) — tiêu đề, rồi phần 1 cùng mọi mục của nó, rồi phần 2…</li>
<li><strong>Ví dụ trên slide</strong> là dàn ý của "Make Money Fast!": hai phần có đánh số (1. Motivations gồm 1.1 Greed và 1.2 Avidity; 2. Methods gồm 2.1 Stock Fraud, 2.2 Ponzi Scheme, 2.3 Bank Robbery) và References. Các số 1–9 trên hình chính là thứ tự thăm theo preorder.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class TNode {
    String name;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(String name) { this.name = name; }

    TNode add(String n) {
        TNode c = new TNode(n);
        children.add(c);
        return c;
    }
}

public class MoneyPreorder {
    static int count = 0;

    static void preOrder(TNode v, int depth) {
        count++;                                     // thăm v TRƯỚC ...
        String pad = "";
        for (int i = 0; i &lt; depth; i++) pad += "    ";
        System.out.println(count + "  " + pad + v.name);
        for (TNode w : v.children)                   // ... rồi tới từng con, từ con đầu tới con cuối
            preOrder(w, depth + 1);
    }

    public static void main(String[] args) {
        TNode doc = new TNode("Make Money Fast!");
        TNode m = doc.add("1. Motivations");
        TNode me = doc.add("2. Methods");
        doc.add("References");
        m.add("1.1 Greed");
        m.add("1.2 Avidity");
        me.add("2.1 Stock Fraud");
        me.add("2.2 Ponzi Scheme");
        me.add("2.3 Bank Robbery");
        preOrder(doc, 0);                            // thụt lề = số lời gọi đang mở phía trên v
    }
}</code></pre>
<div class="out">1 &nbsp;Make Money Fast!<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Motivations<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.1 Greed<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.2 Avidity<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Methods<br>
6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1 Stock Fraud<br>
7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2 Ponzi Scheme<br>
8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.3 Bank Robbery<br>
9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;References</div>
<p class="nhan">Từng bước — những lời gọi nào còn trên ngăn xếp lời gọi (call stack) khi mỗi nút được thăm</p>
<table>
<thead><tr><th>Lần thăm</th><th>Nút</th><th>Các lời gọi còn mở (gốc → nút hiện tại)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Make Money Fast!</td><td>preOrder(MMF)</td></tr>
<tr><td>2</td><td>1. Motivations</td><td>MMF → Motivations</td></tr>
<tr><td>3</td><td>1.1 Greed</td><td>MMF → Motivations → Greed</td></tr>
<tr><td>4</td><td>1.2 Avidity</td><td>MMF → Motivations → Avidity (lời gọi cho Greed đã trả về)</td></tr>
<tr><td>5</td><td>2. Methods</td><td>MMF → Methods (Motivations đã xong)</td></tr>
<tr><td>6</td><td>2.1 Stock Fraud</td><td>MMF → Methods → Stock Fraud</td></tr>
<tr><td>7</td><td>2.2 Ponzi Scheme</td><td>MMF → Methods → Ponzi Scheme</td></tr>
<tr><td>8</td><td>2.3 Bank Robbery</td><td>MMF → Methods → Bank Robbery</td></tr>
<tr><td>9</td><td>References</td><td>MMF → References</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> mỗi nút một lời gọi, và các vòng <code>for</code> cộng lại chạy n − 1 lần (mỗi nút trừ gốc là con của ai đó đúng một lần) → O(n). Ngăn xếp lời gọi sâu tối đa bằng chiều cao cây.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <strong>pre</strong> (trước) = cha lên tiếng <strong>trước</strong> các con — như mục lục, tên chương đứng trước các mục của chương.</p>`],
      [9, 'Post-order Traversal of a tree',
        `<p class="y-chinh">🎯 In postorder a node is visited after all its descendants — the order to use whenever a node's answer depends on its children's answers.</p>
<ul>
<li><strong>Algorithm</strong> (slide): <code>postOrder(v)</code>: for each child w of v: <code>postOrder(w)</code>; only then <code>visit(v)</code>.</li>
<li><strong>Application</strong> (slide): compute the space used by the files in a directory and all its subdirectories — a folder's total is known only after everything inside it has been added up.</li>
<li><strong>The slide's example</strong>: folder cs16/ holding homeworks/ (h1c.doc 3K, h1nc.doc 2K), programs/ (DDR.java 10K, Stocks.java 25K, Robot.java 20K) and todo.txt 1K. The numbers 1–9 on the picture are the postorder visiting order.</li>
</ul>
<pre><code class="language-plaintext">                      cs16/
          /             |               \\
    homeworks/       programs/        todo.txt 1K
     /      \\        /    |    \\
h1c.doc  h1nc.doc  DDR  Stocks  Robot
  3K       2K      10K   25K     20K</code></pre>
<pre><code class="language-java">import java.util.ArrayList;

class FNode {
    String name;
    int size;                                        // file size in K; 0 for a folder (its own entry is ignored)
    ArrayList&lt;FNode&gt; children = new ArrayList&lt;FNode&gt;();

    FNode(String name, int size) { this.name = name; this.size = size; }

    FNode add(String n, int s) {
        FNode c = new FNode(n, s);
        children.add(c);
        return c;
    }
}

public class DiskSpace {
    static int order = 0;

    static int diskSpace(FNode v) {                  // postorder: all children first, v last
        int total = v.size;
        for (FNode w : v.children) total += diskSpace(w);
        order++;                                     // visit(v): the children's totals are known now
        if (v.children.isEmpty()) System.out.println(order + ". " + v.name + "  " + v.size + "K");
        else System.out.println(order + ". " + v.name + "  total = " + total + "K");
        return total;
    }

    public static void main(String[] args) {
        FNode root = new FNode("cs16/", 0);
        FNode hw = root.add("homeworks/", 0);
        FNode pr = root.add("programs/", 0);
        root.add("todo.txt", 1);
        hw.add("h1c.doc", 3);
        hw.add("h1nc.doc", 2);
        pr.add("DDR.java", 10);
        pr.add("Stocks.java", 25);
        pr.add("Robot.java", 20);
        diskSpace(root);
    }
}</code></pre>
<div class="out">1. h1c.doc &nbsp;3K<br>
2. h1nc.doc &nbsp;2K<br>
3. homeworks/ &nbsp;total = 5K<br>
4. DDR.java &nbsp;10K<br>
5. Stocks.java &nbsp;25K<br>
6. Robot.java &nbsp;20K<br>
7. programs/ &nbsp;total = 55K<br>
8. todo.txt &nbsp;1K<br>
9. cs16/ &nbsp;total = 61K</div>
<p class="nhan">Step by step — a folder reports its total only when all its children have reported</p>
<table>
<thead><tr><th>Visit</th><th>Node</th><th>Returns</th><th>Why now</th></tr></thead>
<tbody>
<tr><td>1</td><td>h1c.doc</td><td>3K</td><td>a file: nothing below it</td></tr>
<tr><td>2</td><td>h1nc.doc</td><td>2K</td><td>a file</td></tr>
<tr><td>3</td><td>homeworks/</td><td>3 + 2 = 5K</td><td>both of its files are done</td></tr>
<tr><td>4</td><td>DDR.java</td><td>10K</td><td>a file</td></tr>
<tr><td>5</td><td>Stocks.java</td><td>25K</td><td>a file</td></tr>
<tr><td>6</td><td>Robot.java</td><td>20K</td><td>a file</td></tr>
<tr><td>7</td><td>programs/</td><td>10 + 25 + 20 = 55K</td><td>its three files are done</td></tr>
<tr><td>8</td><td>todo.txt</td><td>1K</td><td>a file</td></tr>
<tr><td>9</td><td>cs16/</td><td>5 + 55 + 1 = 61K</td><td>every child has reported</td></tr>
</tbody>
</table>
<p>The program adds up files only; on a real disk a folder entry also takes a little space of its own, which the lesson ignores to keep the numbers clean.</p>
<p><strong>Big-O:</strong> O(n) — one call per node, and each child's total is added exactly once.</p>
<p class="meo">🧠 <strong>Remember:</strong> <strong>post</strong> = the parent speaks <strong>after</strong> its children — like a manager who writes the department report only when every team has sent theirs.</p>
<div class="pitfall">"Which traversal computes the size of every folder?" — postorder. Preorder would visit cs16/ first, before any size inside it is known. Deleting a whole tree safely (children before their parent) is the other classic postorder job.</div>`,
        `<p class="y-chinh">🎯 Theo hậu thứ tự (postorder), một nút được thăm sau mọi con cháu của nó — thứ tự phải dùng mỗi khi kết quả của một nút phụ thuộc vào kết quả của các con.</p>
<ul>
<li><strong>Thuật toán</strong> (slide): <code>postOrder(v)</code>: với từng con w của v: <code>postOrder(w)</code>; xong hết rồi mới <code>visit(v)</code>.</li>
<li><strong>Ứng dụng</strong> (slide): tính dung lượng các tệp trong một thư mục (directory) và mọi thư mục con (subdirectory) của nó — tổng của một thư mục chỉ biết được sau khi mọi thứ bên trong đã được cộng xong.</li>
<li><strong>Ví dụ trên slide</strong>: thư mục cs16/ chứa homeworks/ (h1c.doc 3K, h1nc.doc 2K), programs/ (DDR.java 10K, Stocks.java 25K, Robot.java 20K) và todo.txt 1K. Các số 1–9 trên hình là thứ tự thăm theo postorder.</li>
</ul>
<pre><code class="language-plaintext">                      cs16/
          /             |               \\
    homeworks/       programs/        todo.txt 1K
     /      \\        /    |    \\
h1c.doc  h1nc.doc  DDR  Stocks  Robot
  3K       2K      10K   25K     20K</code></pre>
<pre><code class="language-java">import java.util.ArrayList;

class FNode {
    String name;
    int size;                                        // cỡ file (K); thư mục để 0 (bỏ qua cỡ riêng của thư mục)
    ArrayList&lt;FNode&gt; children = new ArrayList&lt;FNode&gt;();

    FNode(String name, int size) { this.name = name; this.size = size; }

    FNode add(String n, int s) {
        FNode c = new FNode(n, s);
        children.add(c);
        return c;
    }
}

public class DiskSpace {
    static int order = 0;

    static int diskSpace(FNode v) {                  // hậu thứ tự: mọi con trước, v sau cùng
        int total = v.size;
        for (FNode w : v.children) total += diskSpace(w);
        order++;                                     // thăm v: lúc này đã biết tổng của các con
        if (v.children.isEmpty()) System.out.println(order + ". " + v.name + "  " + v.size + "K");
        else System.out.println(order + ". " + v.name + "  total = " + total + "K");
        return total;
    }

    public static void main(String[] args) {
        FNode root = new FNode("cs16/", 0);
        FNode hw = root.add("homeworks/", 0);
        FNode pr = root.add("programs/", 0);
        root.add("todo.txt", 1);
        hw.add("h1c.doc", 3);
        hw.add("h1nc.doc", 2);
        pr.add("DDR.java", 10);
        pr.add("Stocks.java", 25);
        pr.add("Robot.java", 20);
        diskSpace(root);
    }
}</code></pre>
<div class="out">1. h1c.doc &nbsp;3K<br>
2. h1nc.doc &nbsp;2K<br>
3. homeworks/ &nbsp;total = 5K<br>
4. DDR.java &nbsp;10K<br>
5. Stocks.java &nbsp;25K<br>
6. Robot.java &nbsp;20K<br>
7. programs/ &nbsp;total = 55K<br>
8. todo.txt &nbsp;1K<br>
9. cs16/ &nbsp;total = 61K</div>
<p class="nhan">Từng bước — một thư mục chỉ báo tổng của nó khi mọi con đã báo xong</p>
<table>
<thead><tr><th>Lần thăm</th><th>Nút</th><th>Trả về</th><th>Vì sao lúc này</th></tr></thead>
<tbody>
<tr><td>1</td><td>h1c.doc</td><td>3K</td><td>là tệp: bên dưới không có gì</td></tr>
<tr><td>2</td><td>h1nc.doc</td><td>2K</td><td>là tệp</td></tr>
<tr><td>3</td><td>homeworks/</td><td>3 + 2 = 5K</td><td>cả hai tệp của nó đã xong</td></tr>
<tr><td>4</td><td>DDR.java</td><td>10K</td><td>là tệp</td></tr>
<tr><td>5</td><td>Stocks.java</td><td>25K</td><td>là tệp</td></tr>
<tr><td>6</td><td>Robot.java</td><td>20K</td><td>là tệp</td></tr>
<tr><td>7</td><td>programs/</td><td>10 + 25 + 20 = 55K</td><td>ba tệp của nó đã xong</td></tr>
<tr><td>8</td><td>todo.txt</td><td>1K</td><td>là tệp</td></tr>
<tr><td>9</td><td>cs16/</td><td>5 + 55 + 1 = 61K</td><td>mọi con đã báo xong</td></tr>
</tbody>
</table>
<p>Chương trình chỉ cộng dung lượng tệp; trên ổ đĩa thật, bản thân mục thư mục cũng chiếm một ít chỗ, bài bỏ qua phần đó cho số liệu gọn.</p>
<p><strong>Big-O:</strong> O(n) — mỗi nút một lời gọi, tổng của mỗi con được cộng đúng một lần.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <strong>post</strong> (sau) = cha lên tiếng <strong>sau</strong> các con — như trưởng phòng chỉ viết báo cáo của phòng khi mọi nhóm đã nộp báo cáo của mình.</p>
<div class="pitfall">"Phép duyệt nào tính được dung lượng của mọi thư mục?" — hậu thứ tự. Tiền thứ tự (preorder) thăm cs16/ đầu tiên, khi chưa biết dung lượng nào bên trong nó. Xoá an toàn cả một cây (xoá các con trước rồi mới tới cha) là việc kinh điển còn lại của hậu thứ tự.</div>`],
      [10, 'Breadth-first Traversal of a tree',
        `<p class="y-chinh">🎯 Breadth-first traversal visits a node, then all its children, then all its grandchildren — generation by generation; a queue is what makes it work.</p>
<ul>
<li><strong>The slide's algorithm</strong>: visit v; visit all the children v1, v2, … of v; then all the children of v1, then all the children of v2, …</li>
<li><strong>Application</strong> (slide): visit a family tree by generations.</li>
<li><strong>Why a queue</strong>: the children of v1 must wait until v2, v3… have been visited. A queue (first in, first out — chapter 2) gives exactly that: take a node from the front, put its children at the back.</li>
<li><strong>On "Make Money Fast!"</strong> the order becomes: the title, 1. Motivations, 2. Methods, References, 1.1 Greed, 1.2 Avidity, 2.1 Stock Fraud, 2.2 Ponzi Scheme, 2.3 Bank Robbery — the numbers 1–9 on the picture. (The slide's "breadth-firth" is a typo for breadth-first.)</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.ArrayList;

class TNode {
    String name;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(String name) { this.name = name; }

    TNode add(String n) {
        TNode c = new TNode(n);
        children.add(c);
        return c;
    }
}

public class MoneyBfs {
    static String shortName(TNode v) { return v.name.replaceFirst("^[0-9.]+ ", ""); }

    public static void main(String[] args) {
        TNode doc = new TNode("Make Money Fast!");
        TNode m = doc.add("1. Motivations");
        TNode me = doc.add("2. Methods");
        doc.add("References");
        m.add("1.1 Greed");
        m.add("1.2 Avidity");
        me.add("2.1 Stock Fraud");
        me.add("2.2 Ponzi Scheme");
        me.add("2.3 Bank Robbery");

        ArrayDeque&lt;TNode&gt; q = new ArrayDeque&lt;TNode&gt;();
        q.addLast(doc);
        int count = 0;
        while (!q.isEmpty()) {
            TNode v = q.pollFirst();                 // the node that has waited longest
            count++;                                 // visit(v)
            for (TNode w : v.children) q.addLast(w); // its children wait at the back
            StringBuilder s = new StringBuilder();
            for (TNode w : q) s.append(s.length() == 0 ? "" : ", ").append(shortName(w));
            System.out.printf("visit %d: %-17s queue: [%s]%n", count, v.name, s);
        }
    }
}</code></pre>
<div class="out">visit 1: Make Money Fast! &nbsp;queue: [Motivations, Methods, References]<br>
visit 2: 1. Motivations &nbsp;&nbsp;&nbsp;queue: [Methods, References, Greed, Avidity]<br>
visit 3: 2. Methods &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue: [References, Greed, Avidity, Stock Fraud, Ponzi Scheme, Bank Robbery]<br>
visit 4: References &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue: [Greed, Avidity, Stock Fraud, Ponzi Scheme, Bank Robbery]<br>
visit 5: 1.1 Greed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue: [Avidity, Stock Fraud, Ponzi Scheme, Bank Robbery]<br>
visit 6: 1.2 Avidity &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue: [Stock Fraud, Ponzi Scheme, Bank Robbery]<br>
visit 7: 2.1 Stock Fraud &nbsp;&nbsp;queue: [Ponzi Scheme, Bank Robbery]<br>
visit 8: 2.2 Ponzi Scheme &nbsp;queue: [Bank Robbery]<br>
visit 9: 2.3 Bank Robbery &nbsp;queue: []</div>
<p>Each output line is one step: the node taken from the front and visited, then the queue after its children have joined the back. The nodes of one generation always stand together in the queue.</p>
<p><strong>Big-O:</strong> every node enters and leaves the queue once → O(n) time. Memory: the queue holds about one level at a time (plus part of the next one).</p>
<div class="pitfall">Breadth-first needs a <strong>queue</strong>. With a stack in its place you get a depth-first order; with plain recursion you get preorder. An FE option that describes breadth-first traversal "using a stack" is wrong.</div>`,
        `<p class="y-chinh">🎯 Duyệt theo chiều rộng (breadth-first traversal) thăm một nút, rồi mọi con của nó, rồi mọi cháu — lần lượt từng thế hệ; hàng đợi (queue) là thứ làm nó chạy được.</p>
<ul>
<li><strong>Thuật toán trên slide</strong>: thăm v; thăm mọi con v1, v2, … của v; rồi mọi con của v1, rồi mọi con của v2, …</li>
<li><strong>Ứng dụng</strong> (slide): duyệt cây gia phả (family tree) theo từng thế hệ.</li>
<li><strong>Vì sao cần hàng đợi</strong>: các con của v1 phải chờ tới khi v2, v3… được thăm xong. Hàng đợi (vào trước ra trước — FIFO, chương 2) cho đúng điều đó: lấy một nút ở đầu hàng, xếp các con của nó vào cuối hàng.</li>
<li><strong>Trên "Make Money Fast!"</strong> thứ tự thăm thành: tiêu đề, 1. Motivations, 2. Methods, References, 1.1 Greed, 1.2 Avidity, 2.1 Stock Fraud, 2.2 Ponzi Scheme, 2.3 Bank Robbery — chính là các số 1–9 trên hình. (Chữ "breadth-firth" trên slide là lỗi gõ của breadth-first.)</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.ArrayList;

class TNode {
    String name;
    ArrayList&lt;TNode&gt; children = new ArrayList&lt;TNode&gt;();

    TNode(String name) { this.name = name; }

    TNode add(String n) {
        TNode c = new TNode(n);
        children.add(c);
        return c;
    }
}

public class MoneyBfs {
    static String shortName(TNode v) { return v.name.replaceFirst("^[0-9.]+ ", ""); }

    public static void main(String[] args) {
        TNode doc = new TNode("Make Money Fast!");
        TNode m = doc.add("1. Motivations");
        TNode me = doc.add("2. Methods");
        doc.add("References");
        m.add("1.1 Greed");
        m.add("1.2 Avidity");
        me.add("2.1 Stock Fraud");
        me.add("2.2 Ponzi Scheme");
        me.add("2.3 Bank Robbery");

        ArrayDeque&lt;TNode&gt; q = new ArrayDeque&lt;TNode&gt;();
        q.addLast(doc);
        int count = 0;
        while (!q.isEmpty()) {
            TNode v = q.pollFirst();                 // nút đã chờ lâu nhất
            count++;                                 // thăm v
            for (TNode w : v.children) q.addLast(w); // các con xếp hàng ở cuối
            StringBuilder s = new StringBuilder();
            for (TNode w : q) s.append(s.length() == 0 ? "" : ", ").append(shortName(w));
            System.out.printf("visit %d: %-17s queue: [%s]%n", count, v.name, s);
        }
    }
}</code></pre>
<div class="out">visit 1: Make Money Fast! &nbsp;queue: [Motivations, Methods, References]<br>
visit 2: 1. Motivations &nbsp;&nbsp;&nbsp;queue: [Methods, References, Greed, Avidity]<br>
visit 3: 2. Methods &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue: [References, Greed, Avidity, Stock Fraud, Ponzi Scheme, Bank Robbery]<br>
visit 4: References &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue: [Greed, Avidity, Stock Fraud, Ponzi Scheme, Bank Robbery]<br>
visit 5: 1.1 Greed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue: [Avidity, Stock Fraud, Ponzi Scheme, Bank Robbery]<br>
visit 6: 1.2 Avidity &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue: [Stock Fraud, Ponzi Scheme, Bank Robbery]<br>
visit 7: 2.1 Stock Fraud &nbsp;&nbsp;queue: [Ponzi Scheme, Bank Robbery]<br>
visit 8: 2.2 Ponzi Scheme &nbsp;queue: [Bank Robbery]<br>
visit 9: 2.3 Bank Robbery &nbsp;queue: []</div>
<p>Mỗi dòng đầu ra (output) là một bước: nút được lấy ra ở đầu hàng và thăm, rồi tới hàng đợi sau khi các con của nó đã vào cuối hàng. Các nút cùng một thế hệ luôn đứng liền nhau trong hàng đợi.</p>
<p><strong>Big-O:</strong> mỗi nút vào và ra khỏi hàng đợi đúng một lần → O(n) thời gian. Bộ nhớ: hàng đợi chứa khoảng một mức (level) cùng lúc (cộng thêm một phần của mức kế tiếp).</p>
<div class="pitfall">Duyệt theo chiều rộng cần <strong>hàng đợi</strong>. Thay bằng ngăn xếp (stack) là ra một thứ tự theo chiều sâu (depth-first); dùng đệ quy thuần tuý thì ra tiền thứ tự (preorder). Phương án FE mô tả duyệt theo chiều rộng "dùng ngăn xếp" là sai.</div>`],
      [11, 'Binary Trees',
        `<p class="y-chinh">🎯 A binary tree is a tree in which every node has at most two children, and each child is designated either a left child or a right child.</p>
<ul>
<li>"At most two": 0, 1 or 2 children. The empty tree is a binary tree as well (slide).</li>
<li>Each child is designated <strong>left</strong> or <strong>right</strong>, even when it is the only child: a node with only a left child is a different binary tree from the same node with only a right child.</li>
<li>Each subtree of a node is again a binary tree — the recursive definition once more, now with exactly two "slots" per node.</li>
</ul>
<pre><code class="language-java">class Node {
    char info;
    Node left, right;

    Node(char x) { info = x; left = right = null; }
}

public class LeftRight {
    static String show(Node p) {                     // A(left,right); "-" = empty child
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static boolean same(Node a, Node b) {            // same shape, same keys, same sides
        if (a == null || b == null) return a == b;
        return a.info == b.info &amp;&amp; same(a.left, b.left) &amp;&amp; same(a.right, b.right);
    }

    public static void main(String[] args) {
        Node t1 = new Node('A');
        t1.left = new Node('B');                     // B is the LEFT child
        Node t2 = new Node('A');
        t2.right = new Node('B');                    // B is the RIGHT child
        System.out.println("t1 = " + show(t1) + "   t2 = " + show(t2) + "   same binary tree? " + same(t1, t2));
        System.out.println("as general trees both are just \\"A has one child B\\"");
        System.out.println("level i (root = 1) | max nodes on level i = 2^(i-1) | max nodes when height = i: 2^i - 1");
        for (int i = 1; i &lt;= 5; i++)
            System.out.printf("%-18d | %-31d | %d%n", i, 1 &lt;&lt; (i - 1), (1 &lt;&lt; i) - 1);
        System.out.println("empty tree: no node, height 0 - still a binary tree");
    }
}</code></pre>
<div class="out">t1 = A(B,-) &nbsp;&nbsp;t2 = A(-,B) &nbsp;&nbsp;same binary tree? false<br>
as general trees both are just "A has one child B"<br>
level i (root = 1) | max nodes on level i = 2^(i-1) | max nodes when height = i: 2^i - 1<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 1<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 3<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 7<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 15<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 31<br>
empty tree: no node, height 0 - still a binary tree</div>
<p><strong>Counting</strong> (slide convention, root on level 1): level i holds at most 2<sup>i−1</sup> nodes, so a binary tree of height h holds at most 1 + 2 + … + 2<sup>h−1</sup> = 2<sup>h</sup> − 1 nodes. Turned around: n nodes need a height of at least log₂(n + 1) — about 20 levels for a million nodes. In the textbook's convention (depth from 0) the same facts read: depth d holds at most 2<sup>d</sup> nodes, height h at most 2<sup>h+1</sup> − 1 nodes.</p>
<p class="meo">🧠 <strong>Remember:</strong> binary = every node has two seats named "left" and "right"; a seat may stay empty, but it never loses its name.</p>
<div class="pitfall">"In a binary tree every node has exactly two children" — false: <em>at most</em> two. "Exactly 0 or 2 children" is the definition of a <em>proper</em> binary tree (next slide).</div>`,
        `<p class="y-chinh">🎯 Cây nhị phân (binary tree) là cây mà mỗi nút có nhiều nhất hai con, và mỗi con được chỉ định là con trái (left child) hoặc con phải (right child).</p>
<ul>
<li>"Nhiều nhất hai": 0, 1 hoặc 2 con. Cây rỗng (empty tree) cũng là một cây nhị phân (slide).</li>
<li>Mỗi con được chỉ định là <strong>trái</strong> hoặc <strong>phải</strong>, kể cả khi nó là con duy nhất: nút chỉ có con trái là một cây nhị phân khác với chính nút đó nhưng chỉ có con phải.</li>
<li>Mỗi cây con (subtree) của một nút lại là một cây nhị phân — vẫn là định nghĩa đệ quy, giờ với đúng hai "chỗ" cho mỗi nút.</li>
</ul>
<pre><code class="language-java">class Node {
    char info;
    Node left, right;

    Node(char x) { info = x; left = right = null; }
}

public class LeftRight {
    static String show(Node p) {                     // A(trái,phải); "-" = con rỗng
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static boolean same(Node a, Node b) {            // cùng hình, cùng khoá, cùng phía
        if (a == null || b == null) return a == b;
        return a.info == b.info &amp;&amp; same(a.left, b.left) &amp;&amp; same(a.right, b.right);
    }

    public static void main(String[] args) {
        Node t1 = new Node('A');
        t1.left = new Node('B');                     // B là con TRÁI
        Node t2 = new Node('A');
        t2.right = new Node('B');                    // B là con PHẢI
        System.out.println("t1 = " + show(t1) + "   t2 = " + show(t2) + "   same binary tree? " + same(t1, t2));
        System.out.println("as general trees both are just \\"A has one child B\\"");
        System.out.println("level i (root = 1) | max nodes on level i = 2^(i-1) | max nodes when height = i: 2^i - 1");
        for (int i = 1; i &lt;= 5; i++)
            System.out.printf("%-18d | %-31d | %d%n", i, 1 &lt;&lt; (i - 1), (1 &lt;&lt; i) - 1);
        System.out.println("empty tree: no node, height 0 - still a binary tree");
    }
}</code></pre>
<div class="out">t1 = A(B,-) &nbsp;&nbsp;t2 = A(-,B) &nbsp;&nbsp;same binary tree? false<br>
as general trees both are just "A has one child B"<br>
level i (root = 1) | max nodes on level i = 2^(i-1) | max nodes when height = i: 2^i - 1<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 1<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 3<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 7<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 15<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 31<br>
empty tree: no node, height 0 - still a binary tree</div>
<p><strong>Đếm số nút</strong> (quy ước của slide, gốc ở mức 1): mức i chứa tối đa 2<sup>i−1</sup> nút, nên cây nhị phân cao h chứa tối đa 1 + 2 + … + 2<sup>h−1</sup> = 2<sup>h</sup> − 1 nút. Nói ngược lại: n nút thì chiều cao ít nhất là log₂(n + 1) — khoảng 20 mức cho một triệu nút. Theo quy ước của sách (độ sâu — depth — tính từ 0), cùng các sự thật đó đọc là: độ sâu d chứa tối đa 2<sup>d</sup> nút, chiều cao h chứa tối đa 2<sup>h+1</sup> − 1 nút.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nhị phân = mỗi nút có hai "ghế" tên là trái và phải; ghế có thể bỏ trống nhưng không bao giờ mất tên.</p>
<div class="pitfall">"Trong cây nhị phân, mọi nút có đúng hai con" — SAI: <em>nhiều nhất</em> hai. "Đúng 0 hoặc 2 con" là định nghĩa của cây nhị phân <em>proper</em> (mọi nút trong đủ hai con — slide sau).</div>`],
      [12, 'Types of Binary Trees',
        `<p class="y-chinh">🎯 Two special shapes: in a proper (full) binary tree every non-leaf node has two children; in the slide's complete binary tree, in addition, all leaves are on the same level.</p>
<ul>
<li><strong>Proper binary tree</strong> (also full binary tree or 2-tree): every node other than the leaves has two children — no node has exactly one child.</li>
<li><strong>Complete binary tree</strong> as this slide defines it: all non-terminal nodes have both children <em>and</em> all leaves are on the same level — every level is completely full. Such a tree of height h has exactly 2<sup>h</sup> − 1 nodes.</li>
<li>Books disagree on the names: many (and the old lesson 4.2) call the slide's complete tree <strong>perfect</strong> and keep "complete" for the heap shape — every level full except possibly the last, which is filled from the left. Deck 4B-Trees2 calls that heap shape <strong>nearly complete</strong>.</li>
<li><strong>A fact about proper trees</strong>: leaves = internal nodes + 1 (the textbook proves it in §8.2.2).</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class TreeKinds {
    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }
    static int size(Node p) { return p == null ? 0 : 1 + size(p.left) + size(p.right); }
    static int leaves(Node p) {
        if (p == null) return 0;
        if (p.left == null &amp;&amp; p.right == null) return 1;
        return leaves(p.left) + leaves(p.right);
    }

    static boolean proper(Node p) {                  // proper / full: every node has 0 or 2 children
        if (p == null) return true;
        if ((p.left == null) != (p.right == null)) return false;
        return proper(p.left) &amp;&amp; proper(p.right);
    }

    static boolean slideComplete(Node p) {           // slide's "complete" (= perfect): 2 children everywhere, leaves on one level
        return size(p) == (1 &lt;&lt; height(p)) - 1;      // exactly 2^h - 1 nodes
    }

    static boolean fits(Node p, int i, int n) {      // number nodes like a heap array: root 0, children 2i+1, 2i+2
        if (p == null) return true;
        if (i &gt;= n) return false;                    // a gap appeared before this node
        return fits(p.left, 2 * i + 1, n) &amp;&amp; fits(p.right, 2 * i + 2, n);
    }

    public static void main(String[] args) {
        Node[] trees = {
            new Node(1, new Node(2, new Node(4), new Node(5)), new Node(3, new Node(6), new Node(7))),
            new Node(1, new Node(2, new Node(4), new Node(5)), new Node(3)),
            new Node(1, new Node(2, new Node(4), null), new Node(3)),
            new Node(1, new Node(2), new Node(3, null, new Node(7))),
        };
        System.out.println("tree              proper  complete(slide)  nearly complete  leaves  internal");
        for (Node t : trees)
            System.out.printf("%-17s %-7b %-16b %-16b %-7d %d%n", show(t), proper(t), slideComplete(t),
                    fits(t, 0, size(t)), leaves(t), size(t) - leaves(t));
    }
}</code></pre>
<div class="out">tree &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proper &nbsp;complete(slide) &nbsp;nearly complete &nbsp;leaves &nbsp;internal<br>
1(2(4,5),3(6,7)) &nbsp;true &nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
1(2(4,5),3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
1(2(4,-),3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
1(2,3(-,7)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2</div>
<p>The program checks the three shapes on the lesson's four trees. "Nearly complete" is tested by numbering the nodes like a heap array (root 0, children 2i + 1 and 2i + 2): the shape has no gap exactly when every number stays below n. Each check is O(n). The last column confirms leaves = internal + 1 for the two proper trees only.</p>
<div class="pitfall">A classic FE trap is the name itself. By this slide, "complete" means every level is full; in the heap chapter (and in the textbook), "complete" allows a last level filled only from the left. "Full" is used for "proper" by some authors and for "every level full" by others. Take the definition given in the question; without one, use this slide's names for this deck and "nearly complete" for heaps.</div>`,
        `<p class="y-chinh">🎯 Hai hình dạng đặc biệt: trong cây nhị phân proper (full) mọi nút không phải lá đều có hai con; trong cây "complete" theo slide, thêm vào đó, mọi lá nằm trên cùng một mức.</p>
<ul>
<li><strong>Cây nhị phân proper</strong> (còn gọi là full binary tree hay 2-tree — cây mỗi nút trong đủ hai con): mọi nút không phải lá đều có hai con — không nút nào có đúng một con.</li>
<li><strong>Cây nhị phân complete</strong> theo định nghĩa của slide này: mọi nút không phải lá (non-terminal) có đủ hai con <em>và</em> mọi lá nằm cùng một mức — mức nào cũng đầy kín. Cây như vậy cao h thì có đúng 2<sup>h</sup> − 1 nút.</li>
<li>Các sách gọi tên khác nhau: nhiều sách (và bài cũ 4.2) gọi cây complete của slide là <strong>perfect</strong> (hoàn hảo), còn dành chữ "complete" cho hình dạng của đống (heap) — mọi mức đều đầy trừ có thể mức cuối, và mức cuối được lấp từ trái sang. Bộ 4B-Trees2 gọi hình dạng heap đó là <strong>nearly complete</strong> (gần đầy đủ).</li>
<li><strong>Một tính chất của cây proper</strong>: số lá = số nút trong + 1 (sách chứng minh ở §8.2.2).</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class TreeKinds {
    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }
    static int size(Node p) { return p == null ? 0 : 1 + size(p.left) + size(p.right); }
    static int leaves(Node p) {
        if (p == null) return 0;
        if (p.left == null &amp;&amp; p.right == null) return 1;
        return leaves(p.left) + leaves(p.right);
    }

    static boolean proper(Node p) {                  // proper / full: mọi nút có 0 hoặc 2 con
        if (p == null) return true;
        if ((p.left == null) != (p.right == null)) return false;
        return proper(p.left) &amp;&amp; proper(p.right);
    }

    static boolean slideComplete(Node p) {           // "complete" của slide (= perfect): đủ 2 con, lá cùng mức
        return size(p) == (1 &lt;&lt; height(p)) - 1;      // đúng 2^h - 1 nút
    }

    static boolean fits(Node p, int i, int n) {      // đánh số như mảng heap: gốc 0, con 2i+1, 2i+2
        if (p == null) return true;
        if (i &gt;= n) return false;                    // có lỗ hổng xuất hiện trước nút này
        return fits(p.left, 2 * i + 1, n) &amp;&amp; fits(p.right, 2 * i + 2, n);
    }

    public static void main(String[] args) {
        Node[] trees = {
            new Node(1, new Node(2, new Node(4), new Node(5)), new Node(3, new Node(6), new Node(7))),
            new Node(1, new Node(2, new Node(4), new Node(5)), new Node(3)),
            new Node(1, new Node(2, new Node(4), null), new Node(3)),
            new Node(1, new Node(2), new Node(3, null, new Node(7))),
        };
        System.out.println("tree              proper  complete(slide)  nearly complete  leaves  internal");
        for (Node t : trees)
            System.out.printf("%-17s %-7b %-16b %-16b %-7d %d%n", show(t), proper(t), slideComplete(t),
                    fits(t, 0, size(t)), leaves(t), size(t) - leaves(t));
    }
}</code></pre>
<div class="out">tree &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;proper &nbsp;complete(slide) &nbsp;nearly complete &nbsp;leaves &nbsp;internal<br>
1(2(4,5),3(6,7)) &nbsp;true &nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
1(2(4,5),3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
1(2(4,-),3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
1(2,3(-,7)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2</div>
<p>Chương trình kiểm ba hình dạng trên bốn cây của bài. "Nearly complete" được kiểm bằng cách đánh số các nút như mảng heap (gốc số 0, hai con 2i + 1 và 2i + 2): hình dạng không có lỗ hổng khi và chỉ khi mọi số đều nhỏ hơn n. Mỗi phép kiểm là O(n). Cột cuối xác nhận số lá = số nút trong + 1 chỉ đúng với hai cây proper.</p>
<div class="pitfall">Bẫy FE kinh điển nằm ngay ở cái tên. Theo slide này, "complete" là mọi mức đều đầy; ở chương heap (và trong sách), "complete" cho phép mức cuối chỉ đầy một phần, lấp từ trái. Còn "full" thì có tác giả dùng như "proper", có tác giả dùng như "mọi mức đều đầy". Hãy dùng định nghĩa cho trong đề; đề không cho thì dùng tên theo slide này cho bộ này và "nearly complete" cho heap.</div>`],
      [13, 'Binary Tree example - Expression Tree',
        `<p class="y-chinh">🎯 An arithmetic expression is a binary tree — operators in the internal nodes, numbers and variables on the leaves — and because +, −, ∗, / take exactly two operands, the tree is proper.</p>
<ul>
<li>Every binary operator node has exactly two children (its operands) and every operand is a leaf → no node has one child → a proper binary tree.</li>
<li>A unary operator such as negation (−x) has one operand only, so it creates a node with one child — the tree becomes <em>improper</em> (slide).</li>
<li>No parentheses are stored: the shape decides what is computed first — a deeper operator is evaluated before the operators above it.</li>
<li>The slide shows an expression tree as a picture; the lesson's own examples are (2 + 5) ∗ (9 − 3) and −(2 + 5) ∗ 3, where "neg" is the unary minus.</li>
</ul>
<pre><code class="language-plaintext">(2 + 5) * (9 - 3)            -(2 + 5) * 3
       *                          *
     /   \\                      /   \\
    +     -                   neg    3
   / \\   / \\                   |
  2   5 9   3                  +
                              / \\
                             2   5</code></pre>
<pre><code class="language-java">class Node {
    String info;                                     // an operator or a number
    Node left, right;

    Node(String x, Node p, Node q) { info = x; left = p; right = q; }
    Node(String x) { this(x, null, null); }
}

public class ExprTree {
    static int eval(Node p) {                        // operands first, operator last = postorder
        if (p.left == null &amp;&amp; p.right == null) return Integer.parseInt(p.info);   // a leaf is a number
        if (p.info.equals("neg")) return -eval(p.left);                           // unary minus: ONE child
        int a = eval(p.left), b = eval(p.right);
        switch (p.info.charAt(0)) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            default:  return a / b;
        }
    }

    static String infix(Node p) {                    // fully parenthesised
        if (p.left == null &amp;&amp; p.right == null) return p.info;
        if (p.info.equals("neg")) return "-" + infix(p.left);
        return "(" + infix(p.left) + " " + p.info + " " + infix(p.right) + ")";
    }

    static boolean proper(Node p) {
        if (p == null) return true;
        if ((p.left == null) != (p.right == null)) return false;
        return proper(p.left) &amp;&amp; proper(p.right);
    }

    public static void main(String[] args) {
        // (2 + 5) * (9 - 3)
        Node t1 = new Node("*", new Node("+", new Node("2"), new Node("5")),
                                new Node("-", new Node("9"), new Node("3")));
        // -(2 + 5) * 3 : "neg" has only a left child
        Node t2 = new Node("*", new Node("neg", new Node("+", new Node("2"), new Node("5")), null),
                                new Node("3"));
        for (Node t : new Node[] {t1, t2})
            System.out.println(infix(t) + " = " + eval(t) + "   proper binary tree? " + proper(t));
    }
}</code></pre>
<div class="out">((2 + 5) * (9 - 3)) = 42 &nbsp;&nbsp;proper binary tree? true<br>
(-(2 + 5) * 3) = -21 &nbsp;&nbsp;proper binary tree? false</div>
<p><strong>Evaluation</strong> is a postorder job (slide 9 again): compute both operands, then apply the operator — every node once, O(n). Reading the same tree in the orders of slide 15 gives the prefix form (∗ + 2 5 − 9 3), the infix form and the postfix form (2 5 + 9 3 − ∗); deck 4B-Trees2 comes back to this as Polish notation.</p>
<div class="pitfall">"Every arithmetic expression tree is a proper binary tree" holds only for binary operators. The slide itself gives the counter-example: allow unary minus and a node gets a single child.</div>`,
        `<p class="y-chinh">🎯 Một biểu thức số học là một cây nhị phân — toán tử (operator) ở nút trong, số và biến ở lá — và vì +, −, ∗, / đều nhận đúng hai toán hạng (operand) nên cây là cây proper (mọi nút trong có đủ hai con).</p>
<ul>
<li>Mỗi nút toán tử hai ngôi (binary operator) có đúng hai con (hai toán hạng của nó) và mỗi toán hạng là một lá → không nút nào có một con → cây nhị phân proper.</li>
<li>Toán tử một ngôi (unary operator) như phép đổi dấu (−x) chỉ có một toán hạng, nên tạo ra một nút có một con — cây trở thành <em>không proper</em> (improper) (slide).</li>
<li>Cây không lưu dấu ngoặc: chính hình dạng cây quyết định phép nào tính trước — toán tử nằm sâu hơn được tính trước các toán tử phía trên nó.</li>
<li>Slide vẽ một cây biểu thức (expression tree) bằng hình; ví dụ của bài là (2 + 5) ∗ (9 − 3) và −(2 + 5) ∗ 3, trong đó "neg" là dấu trừ một ngôi.</li>
</ul>
<pre><code class="language-plaintext">(2 + 5) * (9 - 3)            -(2 + 5) * 3
       *                          *
     /   \\                      /   \\
    +     -                   neg    3
   / \\   / \\                   |
  2   5 9   3                  +
                              / \\
                             2   5</code></pre>
<pre><code class="language-java">class Node {
    String info;                                     // toán tử hoặc một số
    Node left, right;

    Node(String x, Node p, Node q) { info = x; left = p; right = q; }
    Node(String x) { this(x, null, null); }
}

public class ExprTree {
    static int eval(Node p) {                        // toán hạng trước, toán tử sau = hậu thứ tự
        if (p.left == null &amp;&amp; p.right == null) return Integer.parseInt(p.info);   // lá là một số
        if (p.info.equals("neg")) return -eval(p.left);                           // trừ một ngôi: MỘT con
        int a = eval(p.left), b = eval(p.right);
        switch (p.info.charAt(0)) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            default:  return a / b;
        }
    }

    static String infix(Node p) {                    // có ngoặc đầy đủ
        if (p.left == null &amp;&amp; p.right == null) return p.info;
        if (p.info.equals("neg")) return "-" + infix(p.left);
        return "(" + infix(p.left) + " " + p.info + " " + infix(p.right) + ")";
    }

    static boolean proper(Node p) {
        if (p == null) return true;
        if ((p.left == null) != (p.right == null)) return false;
        return proper(p.left) &amp;&amp; proper(p.right);
    }

    public static void main(String[] args) {
        // (2 + 5) * (9 - 3)
        Node t1 = new Node("*", new Node("+", new Node("2"), new Node("5")),
                                new Node("-", new Node("9"), new Node("3")));
        // "neg" chỉ có con trái
        Node t2 = new Node("*", new Node("neg", new Node("+", new Node("2"), new Node("5")), null),
                                new Node("3"));
        for (Node t : new Node[] {t1, t2})
            System.out.println(infix(t) + " = " + eval(t) + "   proper binary tree? " + proper(t));
    }
}</code></pre>
<div class="out">((2 + 5) * (9 - 3)) = 42 &nbsp;&nbsp;proper binary tree? true<br>
(-(2 + 5) * 3) = -21 &nbsp;&nbsp;proper binary tree? false</div>
<p><strong>Tính giá trị</strong> là việc của hậu thứ tự (postorder, lại là slide 9): tính xong hai toán hạng rồi mới áp toán tử — mỗi nút một lần, O(n). Đọc cùng cây đó theo các thứ tự của slide 15 sẽ ra dạng tiền tố (prefix: ∗ + 2 5 − 9 3), trung tố (infix) và hậu tố (postfix: 2 5 + 9 3 − ∗); bộ 4B-Trees2 quay lại chuyện này dưới tên ký pháp Ba Lan (Polish notation).</p>
<div class="pitfall">"Mọi cây biểu thức số học đều là cây nhị phân proper" chỉ đúng khi chỉ có toán tử hai ngôi. Chính slide đưa phản ví dụ: cho phép dấu trừ một ngôi là xuất hiện nút chỉ có một con.</div>`],
      [14, 'Binary Tree Traversals',
        `<p class="y-chinh">🎯 Breadth-first traversal of a binary tree visits the nodes level by level — top-down or bottom-up, and on each level left to right or right to left.</p>
<ul>
<li>The usual choice, and the result printed on the slide, is top-down and left to right: A, B, C, D, E, F, G, H, I — the letters of the slide's tree read one level after another.</li>
<li>The slide allows four variants: start at the highest level (top) or at the lowest (bottom), and read each level from left to right or from right to left.</li>
<li>The program collects the levels with a queue — at the start of each round the queue holds exactly one level — and prints the four variants for the lesson's own tree:</li>
</ul>
<pre><code class="language-plaintext">     1
   /   \\
  2     3
 / \\     \\
4   5     6
   /
  7</code></pre>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;

class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class BfsVariants {
    public static void main(String[] args) {
        Node root = new Node(1, new Node(2, new Node(4), new Node(5, new Node(7), null)),
                                new Node(3, null, new Node(6)));
        ArrayList&lt;ArrayList&lt;Integer&gt;&gt; levels = new ArrayList&lt;ArrayList&lt;Integer&gt;&gt;();
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        q.add(root);
        while (!q.isEmpty()) {
            int k = q.size();                        // the queue now holds exactly one whole level
            ArrayList&lt;Integer&gt; lv = new ArrayList&lt;Integer&gt;();
            for (int i = 0; i &lt; k; i++) {
                Node p = q.poll();
                lv.add(p.info);
                if (p.left != null) q.add(p.left);
                if (p.right != null) q.add(p.right);
            }
            levels.add(lv);
        }
        System.out.println("levels, top to bottom, each left to right: " + levels);
        String[] names = {"top-down,  left to right", "top-down,  right to left", "bottom-up, left to right", "bottom-up, right to left"};
        for (int v = 0; v &lt; 4; v++) {
            StringBuilder s = new StringBuilder();
            for (int i = 0; i &lt; levels.size(); i++) {
                ArrayList&lt;Integer&gt; lv = new ArrayList&lt;Integer&gt;(levels.get(v &lt; 2 ? i : levels.size() - 1 - i));
                if (v % 2 == 1) Collections.reverse(lv);
                for (int x : lv) s.append(x).append(' ');
            }
            System.out.println(names[v] + ": " + s);
        }
    }
}</code></pre>
<div class="out">levels, top to bottom, each left to right: [[1], [2, 3], [4, 5, 6], [7]]<br>
top-down, &nbsp;left to right: 1 2 3 4 5 6 7<br>
top-down, &nbsp;right to left: 1 3 2 6 5 4 7<br>
bottom-up, left to right: 7 4 5 6 2 3 1<br>
bottom-up, right to left: 7 6 5 4 3 2 1</div>
<p><strong>Big-O:</strong> O(n) — every node enters and leaves the queue once; the four variants only re-read the collected levels.</p>
<p class="meo">🧠 <strong>Remember:</strong> <em>breadth</em> goes across a level, <em>depth</em> goes down a branch.</p>
<div class="pitfall">Bottom-up, left to right (7 4 5 6 2 3 1) is <em>not</em> the reverse of the usual order. The reverse of top-down left-to-right is bottom-up <em>right-to-left</em> (7 6 5 4 3 2 1). Check the direction inside each level separately.</div>`,
        `<p class="y-chinh">🎯 Duyệt theo chiều rộng (breadth-first traversal) trên cây nhị phân thăm các nút theo từng mức — từ trên xuống hoặc từ dưới lên, và trong mỗi mức từ trái sang phải hoặc từ phải sang trái.</p>
<ul>
<li>Cách thường dùng, cũng là kết quả in trên slide, là từ trên xuống và trái sang phải: A, B, C, D, E, F, G, H, I — các chữ của cây trên slide được đọc hết mức này tới mức khác.</li>
<li>Slide cho phép bốn biến thể: bắt đầu ở mức cao nhất (trên cùng) hoặc thấp nhất (dưới cùng), và đọc mỗi mức từ trái sang phải hoặc từ phải sang trái.</li>
<li>Chương trình gom các mức bằng hàng đợi (queue) — đầu mỗi vòng, hàng đợi chứa đúng một mức — rồi in bốn biến thể cho cây của bài:</li>
</ul>
<pre><code class="language-plaintext">     1
   /   \\
  2     3
 / \\     \\
4   5     6
   /
  7</code></pre>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;

class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class BfsVariants {
    public static void main(String[] args) {
        Node root = new Node(1, new Node(2, new Node(4), new Node(5, new Node(7), null)),
                                new Node(3, null, new Node(6)));
        ArrayList&lt;ArrayList&lt;Integer&gt;&gt; levels = new ArrayList&lt;ArrayList&lt;Integer&gt;&gt;();
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        q.add(root);
        while (!q.isEmpty()) {
            int k = q.size();                        // hàng đợi lúc này chứa đúng một mức
            ArrayList&lt;Integer&gt; lv = new ArrayList&lt;Integer&gt;();
            for (int i = 0; i &lt; k; i++) {
                Node p = q.poll();
                lv.add(p.info);
                if (p.left != null) q.add(p.left);
                if (p.right != null) q.add(p.right);
            }
            levels.add(lv);
        }
        System.out.println("levels, top to bottom, each left to right: " + levels);
        String[] names = {"top-down,  left to right", "top-down,  right to left", "bottom-up, left to right", "bottom-up, right to left"};
        for (int v = 0; v &lt; 4; v++) {
            StringBuilder s = new StringBuilder();
            for (int i = 0; i &lt; levels.size(); i++) {
                ArrayList&lt;Integer&gt; lv = new ArrayList&lt;Integer&gt;(levels.get(v &lt; 2 ? i : levels.size() - 1 - i));
                if (v % 2 == 1) Collections.reverse(lv);
                for (int x : lv) s.append(x).append(' ');
            }
            System.out.println(names[v] + ": " + s);
        }
    }
}</code></pre>
<div class="out">levels, top to bottom, each left to right: [[1], [2, 3], [4, 5, 6], [7]]<br>
top-down, &nbsp;left to right: 1 2 3 4 5 6 7<br>
top-down, &nbsp;right to left: 1 3 2 6 5 4 7<br>
bottom-up, left to right: 7 4 5 6 2 3 1<br>
bottom-up, right to left: 7 6 5 4 3 2 1</div>
<p><strong>Big-O:</strong> O(n) — mỗi nút vào và ra hàng đợi đúng một lần; bốn biến thể chỉ đọc lại các mức đã gom.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>chiều rộng</em> (breadth) đi ngang một mức, <em>chiều sâu</em> (depth) đi dọc xuống một nhánh.</p>
<div class="pitfall">Từ dưới lên, trái sang phải (7 4 5 6 2 3 1) <em>không</em> phải là đảo ngược của thứ tự thường dùng. Đảo ngược của "trên xuống, trái sang phải" là "dưới lên, <em>phải sang trái</em>" (7 6 5 4 3 2 1). Hãy kiểm chiều đọc bên trong từng mức một.</div>`],
      [15, 'Depth-First Traversals',
        `<p class="y-chinh">🎯 The three depth-first traversals of a binary tree differ only in when the node itself is visited: before (preorder, NLR), between (inorder, LNR) or after (postorder, LRN) its left and right subtrees.</p>
<ul>
<li><strong>N</strong> = visit the node, <strong>L</strong> = traverse the left subtree, <strong>R</strong> = traverse the right subtree (slide).</li>
<li><strong>Preorder (NLR)</strong>: visit(v); preOrder(left child); preOrder(right child).</li>
<li><strong>Inorder (LNR)</strong>: inOrder(left child); visit(v); inOrder(right child) — a binary-tree traversal, where "between the left and the right" is well defined; for general trees the deck uses only preorder and postorder (slides 8–9).</li>
<li><strong>Postorder (LRN)</strong>: postOrder(left child); postOrder(right child); visit(v).</li>
<li>Three letters can be arranged in 3! = 6 ways; the other three (NRL, RNL, RLN) are mirror images with right before left. On a binary search tree, RNL lists the keys in decreasing order.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class DepthFirst {
    // order = three letters: N = visit the node, L = go left, R = go right
    static void walk(Node p, String order, StringBuilder out) {
        if (p == null) return;
        for (char c : order.toCharArray()) {
            if (c == 'N') out.append(p.info).append(' ');
            else if (c == 'L') walk(p.left, order, out);
            else walk(p.right, order, out);
        }
    }

    public static void main(String[] args) {
        Node root = new Node(4, new Node(2, new Node(1), new Node(3)),
                                new Node(6, new Node(5), new Node(7)));
        String[] orders = {"NLR", "LNR", "LRN", "NRL", "RNL", "RLN"};
        String[] names = {"preorder ", "inorder  ", "postorder", "(mirror) ", "(mirror) ", "(mirror) "};
        for (int i = 0; i &lt; 6; i++) {
            StringBuilder out = new StringBuilder();
            walk(root, orders[i], out);
            System.out.println(orders[i] + " " + names[i] + ": " + out);
        }
    }
}</code></pre>
<div class="out">NLR preorder : 4 2 1 3 6 5 7<br>
LNR inorder &nbsp;: 1 2 3 4 5 6 7<br>
LRN postorder: 1 3 2 5 7 6 4<br>
NRL (mirror) : 4 6 7 5 2 3 1<br>
RNL (mirror) : 7 6 5 4 3 2 1<br>
RLN (mirror) : 7 5 6 3 1 2 4</div>
<p class="nhan">Step by step on the same tree 4(2(1,3),6(5,7)) — walk around the tree once; every node is passed three times: on its left, from below, on its right</p>
<table>
<thead><tr><th>Step</th><th>The walk is at</th><th>Preorder prints (1st pass)</th><th>Inorder prints (2nd pass)</th><th>Postorder prints (3rd pass)</th></tr></thead>
<tbody>
<tr><td>1</td><td>4, left side</td><td>4</td><td></td><td></td></tr>
<tr><td>2</td><td>2, left side</td><td>2</td><td></td><td></td></tr>
<tr><td>3</td><td>leaf 1 (all three passes)</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>4</td><td>2, from below</td><td></td><td>2</td><td></td></tr>
<tr><td>5</td><td>leaf 3</td><td>3</td><td>3</td><td>3</td></tr>
<tr><td>6</td><td>2, right side</td><td></td><td></td><td>2</td></tr>
<tr><td>7</td><td>4, from below</td><td></td><td>4</td><td></td></tr>
<tr><td>8</td><td>6, left side</td><td>6</td><td></td><td></td></tr>
<tr><td>9</td><td>leaf 5</td><td>5</td><td>5</td><td>5</td></tr>
<tr><td>10</td><td>6, from below</td><td></td><td>6</td><td></td></tr>
<tr><td>11</td><td>leaf 7</td><td>7</td><td>7</td><td>7</td></tr>
<tr><td>12</td><td>6, right side</td><td></td><td></td><td>6</td></tr>
<tr><td>13</td><td>4, right side</td><td></td><td></td><td>4</td></tr>
</tbody>
</table>
<p>Read each column from top to bottom and you get the first three lines of the output.</p>
<p><strong>Big-O:</strong> each node is visited once → O(n) time; the recursion keeps one open call per level → O(h) extra memory, which becomes O(n) for a degenerate "stick".</p>
<p class="meo">🧠 <strong>Remember:</strong> the name says where N goes — <strong>pre</strong> = N first, <strong>in</strong> = N in the middle, <strong>post</strong> = N last; L always comes before R.</p>
<div class="pitfall">Quick elimination in the FE: a preorder always <em>starts</em> with the root and a postorder always <em>ends</em> with it. An option that starts with a leaf cannot be a preorder; one that ends with a leaf cannot be a postorder.</div>`,
        `<p class="y-chinh">🎯 Ba phép duyệt theo chiều sâu (depth-first) của cây nhị phân chỉ khác nhau ở lúc thăm chính nút đó: trước (tiền thứ tự — preorder, NLR), giữa (trung thứ tự — inorder, LNR) hay sau (hậu thứ tự — postorder, LRN) hai cây con trái và phải.</p>
<ul>
<li><strong>N</strong> = thăm nút (node), <strong>L</strong> = duyệt cây con trái (left), <strong>R</strong> = duyệt cây con phải (right) (slide).</li>
<li><strong>Preorder (NLR)</strong>: visit(v); preOrder(con trái); preOrder(con phải).</li>
<li><strong>Inorder (LNR)</strong>: inOrder(con trái); visit(v); inOrder(con phải) — phép duyệt dành cho cây nhị phân, nơi "ở giữa trái và phải" có nghĩa rõ ràng; với cây tổng quát, bộ slide chỉ dùng preorder và postorder (slide 8–9).</li>
<li><strong>Postorder (LRN)</strong>: postOrder(con trái); postOrder(con phải); visit(v).</li>
<li>Ba chữ cái xếp được 3! = 6 cách; ba thứ tự còn lại (NRL, RNL, RLN) là ảnh gương (mirror) với phải đi trước trái. Trên cây nhị phân tìm kiếm (binary search tree — BST), RNL liệt kê các khoá theo thứ tự giảm dần.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class DepthFirst {
    // order = ba chữ: N = thăm nút, L = sang trái, R = sang phải
    static void walk(Node p, String order, StringBuilder out) {
        if (p == null) return;
        for (char c : order.toCharArray()) {
            if (c == 'N') out.append(p.info).append(' ');
            else if (c == 'L') walk(p.left, order, out);
            else walk(p.right, order, out);
        }
    }

    public static void main(String[] args) {
        Node root = new Node(4, new Node(2, new Node(1), new Node(3)),
                                new Node(6, new Node(5), new Node(7)));
        String[] orders = {"NLR", "LNR", "LRN", "NRL", "RNL", "RLN"};
        String[] names = {"preorder ", "inorder  ", "postorder", "(mirror) ", "(mirror) ", "(mirror) "};
        for (int i = 0; i &lt; 6; i++) {
            StringBuilder out = new StringBuilder();
            walk(root, orders[i], out);
            System.out.println(orders[i] + " " + names[i] + ": " + out);
        }
    }
}</code></pre>
<div class="out">NLR preorder : 4 2 1 3 6 5 7<br>
LNR inorder &nbsp;: 1 2 3 4 5 6 7<br>
LRN postorder: 1 3 2 5 7 6 4<br>
NRL (mirror) : 4 6 7 5 2 3 1<br>
RNL (mirror) : 7 6 5 4 3 2 1<br>
RLN (mirror) : 7 5 6 3 1 2 4</div>
<p class="nhan">Từng bước trên chính cây 4(2(1,3),6(5,7)) — đi vòng quanh cây một lượt; mỗi nút được đi ngang qua ba lần: bên trái, phía dưới, bên phải</p>
<table>
<thead><tr><th>Bước</th><th>Đang ở</th><th>Preorder in ra (lần 1)</th><th>Inorder in ra (lần 2)</th><th>Postorder in ra (lần 3)</th></tr></thead>
<tbody>
<tr><td>1</td><td>4, phía trái</td><td>4</td><td></td><td></td></tr>
<tr><td>2</td><td>2, phía trái</td><td>2</td><td></td><td></td></tr>
<tr><td>3</td><td>lá 1 (cả ba lần cùng lúc)</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>4</td><td>2, từ phía dưới</td><td></td><td>2</td><td></td></tr>
<tr><td>5</td><td>lá 3</td><td>3</td><td>3</td><td>3</td></tr>
<tr><td>6</td><td>2, phía phải</td><td></td><td></td><td>2</td></tr>
<tr><td>7</td><td>4, từ phía dưới</td><td></td><td>4</td><td></td></tr>
<tr><td>8</td><td>6, phía trái</td><td>6</td><td></td><td></td></tr>
<tr><td>9</td><td>lá 5</td><td>5</td><td>5</td><td>5</td></tr>
<tr><td>10</td><td>6, từ phía dưới</td><td></td><td>6</td><td></td></tr>
<tr><td>11</td><td>lá 7</td><td>7</td><td>7</td><td>7</td></tr>
<tr><td>12</td><td>6, phía phải</td><td></td><td></td><td>6</td></tr>
<tr><td>13</td><td>4, phía phải</td><td></td><td></td><td>4</td></tr>
</tbody>
</table>
<p>Đọc từng cột từ trên xuống là ra đúng ba dòng đầu của đầu ra (output).</p>
<p><strong>Big-O:</strong> mỗi nút được thăm một lần → O(n) thời gian; đệ quy giữ một lời gọi đang mở cho mỗi mức → O(h) bộ nhớ phụ, thành O(n) với cây suy biến hình "que".</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> tên gọi cho biết N đứng đâu — <strong>pre</strong> = N đầu tiên, <strong>in</strong> = N ở giữa, <strong>post</strong> = N cuối cùng; L luôn đi trước R.</p>
<div class="pitfall">Loại trừ nhanh trong FE: preorder luôn <em>bắt đầu</em> bằng gốc, postorder luôn <em>kết thúc</em> bằng gốc. Phương án nào bắt đầu bằng một lá thì không thể là preorder; phương án nào kết thúc bằng một lá thì không thể là postorder.</div>`],
      [16, 'Binary Tree Traversal example',
        `<p class="y-chinh">🎯 One tree, four traversals: the slide prints the preorder, inorder, postorder and level order of the same nine-node tree — a perfect self-check.</p>
<ul>
<li>The slide's sequences: preorder F, B, A, D, C, E, G, I, H · inorder A, B, C, D, E, F, G, H, I · postorder A, C, E, D, B, H, I, G, F · level order F, B, G, A, D, I, C, E, H.</li>
<li>The preorder and the inorder alone (the method of slide 17) force the tree below: F is the root, B heads the left subtree, G the right one; G has only a <em>right</em> child I, and I has only a <em>left</em> child H.</li>
</ul>
<pre><code class="language-plaintext">     F
   /   \\
  B     G
 / \\     \\
A   D     I
   / \\   /
  C   E H</code></pre>
<pre><code class="language-java">import java.util.ArrayDeque;

class Node {
    char info;
    Node left, right;

    Node(char x, Node p, Node q) { info = x; left = p; right = q; }
    Node(char x) { this(x, null, null); }
}

public class SlideTraversals {
    static String s;

    static void preOrder(Node p)  { if (p == null) return; s += p.info; preOrder(p.left); preOrder(p.right); }
    static void inOrder(Node p)   { if (p == null) return; inOrder(p.left); s += p.info; inOrder(p.right); }
    static void postOrder(Node p) { if (p == null) return; postOrder(p.left); postOrder(p.right); s += p.info; }
    static void levelOrder(Node root) {
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s += p.info;
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
    }

    static void check(String name, String slide) {   // compare with the sequence printed on slide 16
        System.out.printf("%-11s %s   slide: %s   %s%n", name, s, slide, s.equals(slide) ? "same" : "DIFFERENT");
    }

    public static void main(String[] args) {
        Node root = new Node('F', new Node('B', new Node('A'), new Node('D', new Node('C'), new Node('E'))),
                                  new Node('G', null, new Node('I', new Node('H'), null)));
        s = ""; preOrder(root);   check("preorder", "FBADCEGIH");
        s = ""; inOrder(root);    check("inorder", "ABCDEFGHI");
        s = ""; postOrder(root);  check("postorder", "ACEDBHIGF");
        s = ""; levelOrder(root); check("level-order", "FBGADICEH");
    }
}</code></pre>
<div class="out">preorder &nbsp;&nbsp;&nbsp;FBADCEGIH &nbsp;&nbsp;slide: FBADCEGIH &nbsp;&nbsp;same<br>
inorder &nbsp;&nbsp;&nbsp;&nbsp;ABCDEFGHI &nbsp;&nbsp;slide: ABCDEFGHI &nbsp;&nbsp;same<br>
postorder &nbsp;&nbsp;ACEDBHIGF &nbsp;&nbsp;slide: ACEDBHIGF &nbsp;&nbsp;same<br>
level-order FBGADICEH &nbsp;&nbsp;slide: FBGADICEH &nbsp;&nbsp;same</div>
<p>The program builds that tree and prints the four traversals next to the slide's sequences — all four agree. The inorder is sorted: this tree happens to be a binary search tree on the letters (slide 22).</p>
<p class="nhan">Checking a sequence by hand in seconds</p>
<ul>
<li>The preorder starts with the root (F), the postorder ends with it (F), and in the inorder the root separates the left part (A–E) from the right part (G–I).</li>
<li>Level order is the picture read row by row: F | B G | A D I | C E H.</li>
</ul>
<div class="pitfall">A single child keeps its side. Draw H as the <em>right</em> child of I and the inorder becomes "… G I H" instead of "… G H I", while preorder and postorder do not change — an easy way to lose the marks of a traversal question.</div>`,
        `<p class="y-chinh">🎯 Một cây, bốn phép duyệt: slide in tiền thứ tự (preorder), trung thứ tự (inorder), hậu thứ tự (postorder) và thứ tự theo mức (level order) của cùng một cây chín nút — bài tự kiểm tra lý tưởng.</p>
<ul>
<li>Các dãy trên slide: preorder F, B, A, D, C, E, G, I, H · inorder A, B, C, D, E, F, G, H, I · postorder A, C, E, D, B, H, I, G, F · level order F, B, G, A, D, I, C, E, H.</li>
<li>Chỉ riêng preorder và inorder (cách làm của slide 17) đã buộc cây phải là cây dưới đây: F là gốc, B đứng đầu cây con trái, G đứng đầu cây con phải; G chỉ có con <em>phải</em> là I, còn I chỉ có con <em>trái</em> là H.</li>
</ul>
<pre><code class="language-plaintext">     F
   /   \\
  B     G
 / \\     \\
A   D     I
   / \\   /
  C   E H</code></pre>
<pre><code class="language-java">import java.util.ArrayDeque;

class Node {
    char info;
    Node left, right;

    Node(char x, Node p, Node q) { info = x; left = p; right = q; }
    Node(char x) { this(x, null, null); }
}

public class SlideTraversals {
    static String s;

    static void preOrder(Node p)  { if (p == null) return; s += p.info; preOrder(p.left); preOrder(p.right); }
    static void inOrder(Node p)   { if (p == null) return; inOrder(p.left); s += p.info; inOrder(p.right); }
    static void postOrder(Node p) { if (p == null) return; postOrder(p.left); postOrder(p.right); s += p.info; }
    static void levelOrder(Node root) {
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s += p.info;
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
    }

    static void check(String name, String slide) {   // so với dãy in trên slide 16
        System.out.printf("%-11s %s   slide: %s   %s%n", name, s, slide, s.equals(slide) ? "same" : "DIFFERENT");
    }

    public static void main(String[] args) {
        Node root = new Node('F', new Node('B', new Node('A'), new Node('D', new Node('C'), new Node('E'))),
                                  new Node('G', null, new Node('I', new Node('H'), null)));
        s = ""; preOrder(root);   check("preorder", "FBADCEGIH");
        s = ""; inOrder(root);    check("inorder", "ABCDEFGHI");
        s = ""; postOrder(root);  check("postorder", "ACEDBHIGF");
        s = ""; levelOrder(root); check("level-order", "FBGADICEH");
    }
}</code></pre>
<div class="out">preorder &nbsp;&nbsp;&nbsp;FBADCEGIH &nbsp;&nbsp;slide: FBADCEGIH &nbsp;&nbsp;same<br>
inorder &nbsp;&nbsp;&nbsp;&nbsp;ABCDEFGHI &nbsp;&nbsp;slide: ABCDEFGHI &nbsp;&nbsp;same<br>
postorder &nbsp;&nbsp;ACEDBHIGF &nbsp;&nbsp;slide: ACEDBHIGF &nbsp;&nbsp;same<br>
level-order FBGADICEH &nbsp;&nbsp;slide: FBGADICEH &nbsp;&nbsp;same</div>
<p>Chương trình dựng đúng cây đó và in bốn phép duyệt cạnh các dãy của slide — cả bốn đều khớp. Dãy inorder đã được sắp xếp: cây này tình cờ là một cây nhị phân tìm kiếm (binary search tree) trên các chữ cái (slide 22).</p>
<p class="nhan">Kiểm một dãy bằng tay trong vài giây</p>
<ul>
<li>Preorder bắt đầu bằng gốc (F), postorder kết thúc bằng gốc (F), còn trong inorder thì gốc tách phần trái (A–E) khỏi phần phải (G–I).</li>
<li>Level order là hình vẽ đọc theo từng hàng: F | B G | A D I | C E H.</li>
</ul>
<div class="pitfall">Con duy nhất vẫn giữ nguyên phía của nó. Vẽ H thành con <em>phải</em> của I là inorder thành "… G I H" thay vì "… G H I", trong khi preorder và postorder không đổi — cách mất điểm rất dễ ở câu hỏi duyệt cây.</div>`],
      [17, 'Construct Binary Tree from given traversals',
        `<p class="y-chinh">🎯 A binary tree can be rebuilt from its inorder together with its preorder (or its postorder): the preorder names the root, the inorder splits the remaining nodes into left and right.</p>
<ul>
<li>Given on the slide: inorder D B E A F C, preorder A B D E C F.</li>
<li>The leftmost element of the preorder, A, is the root. In the inorder, everything left of A (D B E) forms the left subtree, everything right of it (F C) the right subtree.</li>
<li>Repeat on each part with the next unused letters of the preorder: B splits D | E, then C splits F | –. Result: A(B(D, E), C(F, –)).</li>
<li>With the postorder instead, the <em>last</em> element is the root, and reading the postorder backwards you must build the right subtree before the left one.</li>
</ul>
<pre><code class="language-java">class Node {
    char info;
    Node left, right;

    Node(char x) { info = x; left = right = null; }
}

public class BuildFromTraversals {
    static char[] pre, in;
    static int next = 0;                             // next unused letter of the preorder

    static String part(int lo, int hi) {
        if (lo &gt; hi) return "-";
        return new String(in, lo, hi - lo + 1).replace("", " ").trim();
    }

    // build the tree whose inorder is in[lo..hi]
    static Node build(int lo, int hi, String pad) {
        if (lo &gt; hi) return null;                    // empty part -&gt; empty subtree
        char r = pre[next++];                        // the first unused preorder letter is the root
        int k = lo;
        while (in[k] != r) k++;                      // find the root inside the inorder part
        System.out.println(pad + "root " + r + ": left = " + part(lo, k - 1) + ",  right = " + part(k + 1, hi));
        Node t = new Node(r);
        t.left = build(lo, k - 1, pad + "    ");     // left part first: preorder is N, L, R
        t.right = build(k + 1, hi, pad + "    ");
        return t;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        in = "DBEAFC".toCharArray();
        pre = "ABDECF".toCharArray();
        Node t = build(0, in.length - 1, "");
        System.out.println("tree = " + show(t));
        System.out.println("pre + post are NOT enough: A(B,-) and A(-,B) both have preorder A B, postorder B A");
    }
}</code></pre>
<div class="out">root A: left = D B E, &nbsp;right = F C<br>
&nbsp;&nbsp;&nbsp;&nbsp;root B: left = D, &nbsp;right = E<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root D: left = -, &nbsp;right = -<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root E: left = -, &nbsp;right = -<br>
&nbsp;&nbsp;&nbsp;&nbsp;root C: left = F, &nbsp;right = -<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root F: left = -, &nbsp;right = -<br>
tree = A(B(D,E),C(F,-))<br>
pre + post are NOT enough: A(B,-) and A(-,B) both have preorder A B, postorder B A</div>
<p class="nhan">Step by step (one row per indented output line)</p>
<table>
<thead><tr><th>Step</th><th>Root = next preorder letter</th><th>Inorder part being split</th><th>Left part</th><th>Right part</th></tr></thead>
<tbody>
<tr><td>1</td><td>A</td><td>D B E A F C</td><td>D B E</td><td>F C</td></tr>
<tr><td>2</td><td>B</td><td>D B E</td><td>D</td><td>E</td></tr>
<tr><td>3</td><td>D</td><td>D</td><td>–</td><td>–</td></tr>
<tr><td>4</td><td>E</td><td>E</td><td>–</td><td>–</td></tr>
<tr><td>5</td><td>C</td><td>F C</td><td>F</td><td>–</td></tr>
<tr><td>6</td><td>F</td><td>F</td><td>–</td><td>–</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">     A
   /   \\
  B     C
 / \\   /
D   E F</code></pre>
<p><strong>Big-O:</strong> each step looks for the root inside its inorder part — O(n) per step, O(n²) in the worst case (a stick). Storing every letter's inorder position in a <code>HashMap</code> first makes each lookup O(1), and the whole rebuild O(n).</p>
<div class="pitfall">Preorder + postorder is <em>not</em> enough when a node has a single child: A(B, –) and A(–, B) both give preorder A B and postorder B A (last line of the output). That is why the slide says "inorder &amp; preorder or inorder &amp; postorder".</div>`,
        `<p class="y-chinh">🎯 Có thể dựng lại một cây nhị phân từ dãy trung thứ tự (inorder) cùng với dãy tiền thứ tự (preorder) — hoặc hậu thứ tự (postorder) — của nó: preorder chỉ ra gốc, inorder chia các nút còn lại thành phần trái và phần phải.</p>
<ul>
<li>Đề trên slide: inorder D B E A F C, preorder A B D E C F.</li>
<li>Phần tử trái nhất của preorder, A, là gốc. Trong inorder, mọi thứ bên trái A (D B E) tạo thành cây con trái (left subtree), mọi thứ bên phải (F C) tạo thành cây con phải.</li>
<li>Lặp lại trên từng phần với các chữ tiếp theo chưa dùng của preorder: B chia D | E, rồi C chia F | –. Kết quả: A(B(D, E), C(F, –)).</li>
<li>Nếu dùng postorder thay cho preorder thì phần tử <em>cuối</em> là gốc, và khi đọc postorder từ cuối lên phải dựng cây con phải trước cây con trái.</li>
</ul>
<pre><code class="language-java">class Node {
    char info;
    Node left, right;

    Node(char x) { info = x; left = right = null; }
}

public class BuildFromTraversals {
    static char[] pre, in;
    static int next = 0;                             // chữ tiếp theo chưa dùng của dãy preorder

    static String part(int lo, int hi) {
        if (lo &gt; hi) return "-";
        return new String(in, lo, hi - lo + 1).replace("", " ").trim();
    }

    // dựng cây có inorder là in[lo..hi]
    static Node build(int lo, int hi, String pad) {
        if (lo &gt; hi) return null;                    // đoạn rỗng -&gt; cây con rỗng
        char r = pre[next++];                        // chữ preorder đầu tiên chưa dùng là gốc
        int k = lo;
        while (in[k] != r) k++;                      // tìm gốc trong đoạn inorder
        System.out.println(pad + "root " + r + ": left = " + part(lo, k - 1) + ",  right = " + part(k + 1, hi));
        Node t = new Node(r);
        t.left = build(lo, k - 1, pad + "    ");     // đoạn trái trước: preorder là N, L, R
        t.right = build(k + 1, hi, pad + "    ");
        return t;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        in = "DBEAFC".toCharArray();
        pre = "ABDECF".toCharArray();
        Node t = build(0, in.length - 1, "");
        System.out.println("tree = " + show(t));
        System.out.println("pre + post are NOT enough: A(B,-) and A(-,B) both have preorder A B, postorder B A");
    }
}</code></pre>
<div class="out">root A: left = D B E, &nbsp;right = F C<br>
&nbsp;&nbsp;&nbsp;&nbsp;root B: left = D, &nbsp;right = E<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root D: left = -, &nbsp;right = -<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root E: left = -, &nbsp;right = -<br>
&nbsp;&nbsp;&nbsp;&nbsp;root C: left = F, &nbsp;right = -<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root F: left = -, &nbsp;right = -<br>
tree = A(B(D,E),C(F,-))<br>
pre + post are NOT enough: A(B,-) and A(-,B) both have preorder A B, postorder B A</div>
<p class="nhan">Từng bước (mỗi hàng ứng với một dòng thụt lề của đầu ra — output)</p>
<table>
<thead><tr><th>Bước</th><th>Gốc = chữ preorder kế tiếp</th><th>Đoạn inorder đang chia</th><th>Phần trái</th><th>Phần phải</th></tr></thead>
<tbody>
<tr><td>1</td><td>A</td><td>D B E A F C</td><td>D B E</td><td>F C</td></tr>
<tr><td>2</td><td>B</td><td>D B E</td><td>D</td><td>E</td></tr>
<tr><td>3</td><td>D</td><td>D</td><td>–</td><td>–</td></tr>
<tr><td>4</td><td>E</td><td>E</td><td>–</td><td>–</td></tr>
<tr><td>5</td><td>C</td><td>F C</td><td>F</td><td>–</td></tr>
<tr><td>6</td><td>F</td><td>F</td><td>–</td><td>–</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">     A
   /   \\
  B     C
 / \\   /
D   E F</code></pre>
<p><strong>Big-O:</strong> mỗi bước tìm gốc trong đoạn inorder của nó — O(n) mỗi bước, O(n²) trong trường hợp xấu nhất (cây "que"). Lưu trước vị trí inorder của mỗi chữ vào một <code>HashMap</code> (bảng băm) thì mỗi lần tìm chỉ O(1), cả quá trình dựng lại là O(n).</p>
<div class="pitfall">Preorder + postorder là <em>không</em> đủ khi có nút chỉ một con: A(B, –) và A(–, B) đều cho preorder A B và postorder B A (dòng cuối của đầu ra — output). Vì thế slide mới nói "inorder &amp; preorder hoặc inorder &amp; postorder".</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>In the A…K tree of slide 4, what are the level of J and the height of the tree — by the slide, and by the textbook?</li>
<li>Which traversal adds up the folder sizes of slide 9, and why not preorder?</li>
<li>Preorder A B D E C F and inorder D B E A F C (slide 17): what is the postorder?</li>
<li>A binary tree in which every internal node has two children — is it "complete" in the slide's sense?</li>
<li>Which data structure turns breadth-first traversal into a simple loop?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) By the slide: J is on level 4 and the height is 4; by the textbook: depth 3 and height 3. (2) Postorder — a folder's total needs its children's totals first, while preorder visits the folder before them. (3) D E B F C A. (4) Not necessarily: that is a <em>proper</em> tree; the slide's "complete" also needs every leaf on one level — 1(2(4,5),3) is proper but not complete. (5) A queue.</p>
<p><strong>Next:</strong> lesson 4.B (slides 18–34: implementing binary trees, the traversal code, and the binary search tree — search, insertion, deletion by merging and by copying), then the deep-dive lessons 4.1 Trees &amp; traversals, 4.2 Binary trees: properties &amp; two implementations and 4.3 The four traversals &amp; expression trees.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Trong cây A…K của slide 4, mức (level) của J và chiều cao (height) của cây là bao nhiêu — theo slide, và theo sách?</li>
<li>Phép duyệt nào cộng dồn được dung lượng thư mục ở slide 9, vì sao không dùng tiền thứ tự (preorder)?</li>
<li>Preorder A B D E C F và inorder (trung thứ tự) D B E A F C (slide 17): postorder (hậu thứ tự) là gì?</li>
<li>Một cây nhị phân mà mọi nút trong đều có hai con — nó có "complete" (đầy đủ) theo nghĩa của slide không?</li>
<li>Cấu trúc dữ liệu nào biến duyệt theo chiều rộng (breadth-first) thành một vòng lặp đơn giản?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Theo slide: J ở mức 4 và cây cao 4; theo sách: độ sâu 3 và chiều cao 3. (2) Hậu thứ tự (postorder) — tổng của một thư mục cần tổng của các con trước, còn preorder lại thăm thư mục trước các con. (3) D E B F C A. (4) Chưa chắc: đó là cây <em>proper</em> (mọi nút trong đủ hai con); "complete" của slide còn đòi mọi lá cùng một mức — 1(2(4,5),3) là proper nhưng không complete. (5) Hàng đợi (queue).</p>
<p><strong>Học tiếp:</strong> bài 4.B (slide 18–34: cài đặt cây nhị phân, code các phép duyệt, và cây nhị phân tìm kiếm — tìm kiếm, chèn, xoá bằng hợp nhất (merging) và bằng sao chép (copying)), rồi các bài đào sâu 4.1 Cây &amp; phép duyệt, 4.2 Cây nhị phân: tính chất &amp; hai cách cài đặt và 4.3 Bốn phép duyệt &amp; cây biểu thức.</p>`),
    books([
      ['goodrich', 'Ch.8 Trees p.307 — §8.1 General Trees p.308 (§8.1.1 Tree Definitions and Properties p.309, §8.1.2 The Tree Abstract Data Type p.312) · §8.2 Binary Trees p.317 (§8.2.1 The Binary Tree Abstract Data Type p.319, §8.2.2 Properties of Binary Trees p.321) · §8.4 Tree Traversal Algorithms p.334', 'Chương 8 Trees tr.307 — §8.1 General Trees tr.308 (§8.1.1 Tree Definitions and Properties tr.309, §8.1.2 The Tree Abstract Data Type tr.312) · §8.2 Binary Trees tr.317 (§8.2.1 The Binary Tree Abstract Data Type tr.319, §8.2.2 Properties of Binary Trees tr.321) · §8.4 Tree Traversal Algorithms tr.334'],
    ]),
  ].join('\n'),
};

/* ───────── 4.B — 📑 Slide by slide · Trees, part 1b: implementing binary trees & the BST (4A-Trees1, slides 18–34) ───────── */
const L_csd8_2 = {
  title: '4.B — 📑 Slide by slide · Trees, part 1b: implementing binary trees & the BST (4A-Trees1, slides 18–34)|||4.B — 📑 Học theo từng slide · Cây, phần 1b: cài đặt cây nhị phân & BST (4A-Trees1, slide 18–34)',
  slug: 'csd201-slide-csd8-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 18–34 của bộ 4A-Trees1: cài cây nhị phân bằng mảng chỉ số và bằng nút liên kết, code duyệt theo chiều rộng (hàng đợi) và theo chiều sâu (đệ quy), cây nhị phân tìm kiếm — tìm kiếm, chèn (con trỏ cha f), ba trường hợp xoá, xoá bằng hợp nhất (merging) và bằng sao chép (copying) vẽ lại từng bước — 15 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.B · 4A-Trees1, slides 18–34</span>
<h2>Trees, part 1b — binary trees in Java and the binary search tree</h2>
<p class="lead">The second half of the deck (syllabus sessions 16 and 19–20, CLO4) turns the ideas of lesson 4.A into code: two ways to store a binary tree, the traversal methods, and the <code>BSTree</code> class with search, insertion and the two deletion methods. Every method runs here in Java, every pointer move is traced step by step, and the special cases that break PE programs are tested one by one.</p>
<div class="callout"><strong>Why this half matters most for the PE:</strong> tree questions in the practical exam are typically built on a <code>BSTree</code> like the one on slide 23 — insert objects by a key, traverse, count, search, delete by copying or by merging. Slides 20–21, 24, 26 and 29–31 are the code to be able to type from memory; the FE asks the same things on paper ("which tree results after deleting 30 by copying?").</div>
<h3>Slides 18–34 in one table</h3>
<table>
<thead><tr><th>Operation</th><th>Slides</th><th>How</th><th>Cost (h = height)</th></tr></thead>
<tbody>
<tr><td>Store a binary tree</td><td>18–19</td><td>array with child indexes (size fixed in advance), or linked nodes (<code>info</code>, <code>left</code>, <code>right</code>)</td><td>O(1) per node</td></tr>
<tr><td>Breadth-first traversal</td><td>20</td><td>queue: dequeue, enqueue the non-null children, visit</td><td>O(n)</td></tr>
<tr><td>Preorder / inorder / postorder</td><td>21</td><td>recursion with the base case <code>p == null</code></td><td>O(n) time, O(h) stack</td></tr>
<tr><td>Search</td><td>24</td><td>compare, then go left or right: one path</td><td>O(h)</td></tr>
<tr><td>Insert</td><td>25–26</td><td>search for the empty link, hang a new leaf there, reject duplicates</td><td>O(h)</td></tr>
<tr><td>Delete a leaf / a node with one child</td><td>27–28</td><td>the parent's link becomes null / the only child</td><td>O(h)</td></tr>
<tr><td>Delete a node with two children by merging</td><td>29–30</td><td>right subtree goes below the rightmost node of the left subtree</td><td>O(h); the height may grow or shrink</td></tr>
<tr><td>Delete a node with two children by copying</td><td>31–32</td><td>copy the predecessor's key, delete the predecessor's node</td><td>O(h); the height never grows</td></tr>
</tbody>
</table>
<p>h is about log₂ n for a balanced tree and up to n for a degenerate one (keys inserted in sorted order) — so "O(h)" is not automatically "O(log n)".</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.B · 4A-Trees1, slide 18–34</span>
<h2>Cây, phần 1b — cây nhị phân bằng Java và cây nhị phân tìm kiếm</h2>
<p class="lead">Nửa sau của bộ slide (buổi 16 và 19–20 theo syllabus, CLO4) biến các ý của bài 4.A thành code: hai cách lưu một cây nhị phân (binary tree), các phương thức duyệt (traversal), và lớp <code>BSTree</code> với tìm kiếm (search), chèn (insertion) cùng hai cách xoá (deletion). Phương thức nào cũng chạy bằng Java ngay trong bài, mỗi lần đổi con trỏ đều được lần theo từng bước, và các trường hợp đặc biệt hay làm hỏng bài PE được thử từng cái một.</p>
<div class="callout"><strong>Vì sao nửa này quan trọng nhất cho PE (thi thực hành):</strong> câu hỏi về cây trong đề PE thường dựng trên một <code>BSTree</code> giống slide 23 — chèn các đối tượng theo một khoá (key), duyệt, đếm, tìm, xoá bằng sao chép (copying) hoặc bằng hợp nhất (merging). Slide 20–21, 24, 26 và 29–31 là phần code phải gõ lại được mà không nhìn; FE (thi cuối kỳ) hỏi đúng những điều đó trên giấy ("xoá 30 bằng copying thì ra cây nào?").</div>
<h3>Slide 18–34 trong một bảng</h3>
<table>
<thead><tr><th>Thao tác</th><th>Slide</th><th>Làm thế nào</th><th>Chi phí (h = chiều cao)</th></tr></thead>
<tbody>
<tr><td>Lưu một cây nhị phân</td><td>18–19</td><td>mảng có trường chỉ số của con (kích thước cố định từ trước), hoặc các nút liên kết (<code>info</code>, <code>left</code>, <code>right</code>)</td><td>O(1) mỗi nút</td></tr>
<tr><td>Duyệt theo chiều rộng (breadth-first)</td><td>20</td><td>hàng đợi (queue): lấy ra, xếp các con khác null vào, thăm</td><td>O(n)</td></tr>
<tr><td>Tiền / trung / hậu thứ tự (pre / in / postorder)</td><td>21</td><td>đệ quy với điều kiện dừng <code>p == null</code></td><td>O(n) thời gian, O(h) ngăn xếp</td></tr>
<tr><td>Tìm kiếm</td><td>24</td><td>so sánh rồi rẽ trái hoặc phải: một con đường</td><td>O(h)</td></tr>
<tr><td>Chèn</td><td>25–26</td><td>tìm liên kết rỗng, treo lá mới vào đó, từ chối khoá trùng</td><td>O(h)</td></tr>
<tr><td>Xoá lá / xoá nút có một con</td><td>27–28</td><td>liên kết của cha thành null / thành đứa con duy nhất</td><td>O(h)</td></tr>
<tr><td>Xoá nút có hai con bằng hợp nhất (merging)</td><td>29–30</td><td>cây con phải treo xuống dưới nút phải nhất của cây con trái</td><td>O(h); chiều cao có thể tăng hoặc giảm</td></tr>
<tr><td>Xoá nút có hai con bằng sao chép (copying)</td><td>31–32</td><td>chép khoá của nút liền trước (predecessor), rồi xoá nút đó</td><td>O(h); chiều cao không bao giờ tăng</td></tr>
</tbody>
</table>
<p>h vào khoảng log₂ n với cây cân bằng (balanced) và có thể lên tới n với cây suy biến (degenerate — khoá được chèn theo thứ tự đã sắp) — nên "O(h)" không tự động là "O(log n)".</p>`),
    walkHead('csd8', 18, 34),
    walk('csd8', [
      [18, 'Implementing Binary Trees - 1',
        `<p class="y-chinh">🎯 A binary tree can live in an array or in linked nodes; in the array version each node stores the indexes of its children — but nobody knows in advance how big the array must be.</p>
<ul>
<li><strong>Two ways</strong> (slide): as arrays, or as linked structures (slide 19).</li>
<li><strong>Array version</strong>: a node is an object with an information field and two "reference" fields; these hold the <em>indexes</em> of the array cells where the left and right children are stored, if there are any (the program uses −1 for "none").</li>
<li><strong>The problem</strong> (slide): it is hard to predict how many nodes a program will create — so how many cells should the array reserve?</li>
</ul>
<pre><code class="language-java">public class ArrayTree {
    static final int CAP = 6;                        // the size must be chosen BEFORE the tree grows
    static char[] info = new char[CAP];
    static int[] left = new int[CAP];                // index of the left child, -1 = no child
    static int[] right = new int[CAP];
    static int n = 0;                                // cells used so far

    static int newNode(char x) {
        if (n == CAP) {
            System.out.println("new node " + x + ": array full (capacity " + CAP + ") -&gt; not added");
            return -1;
        }
        info[n] = x;
        left[n] = right[n] = -1;
        return n++;
    }

    static void preOrder(int i) {                    // follow the index fields instead of references
        if (i == -1) return;
        System.out.print(info[i] + " ");
        preOrder(left[i]);
        preOrder(right[i]);
    }

    public static void main(String[] args) {
        int a = newNode('A'), b = newNode('B'), c = newNode('C');
        left[a] = b;
        right[a] = c;
        left[b] = newNode('D');
        right[b] = newNode('E');
        left[c] = newNode('F');
        int g = newNode('G');                        // the 7th node does not fit
        if (g != -1) right[c] = g;
        System.out.println("cell  info  left  right");
        for (int i = 0; i &lt; n; i++) System.out.printf("%-5d %-5s %-5d %d%n", i, info[i], left[i], right[i]);
        System.out.print("preorder from cell " + a + ": ");
        preOrder(a);
        System.out.println();
    }
}</code></pre>
<div class="out">new node G: array full (capacity 6) -&gt; not added<br>
cell &nbsp;info &nbsp;left &nbsp;right<br>
0 &nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;2<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;4<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;-1<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;-1 &nbsp;&nbsp;&nbsp;-1<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;E &nbsp;&nbsp;&nbsp;&nbsp;-1 &nbsp;&nbsp;&nbsp;-1<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;F &nbsp;&nbsp;&nbsp;&nbsp;-1 &nbsp;&nbsp;&nbsp;-1<br>
preorder from cell 0: A B D E C F</div>
<p>The lesson's own tree A(B(D, E), C(F, –)) fills the 6 cells; the 7th node G is refused. Following index fields instead of references, the preorder is the same as with linked nodes.</p>
<p class="dap-an">✅ <strong>Answer to the slide's question</strong> (how many cells to reserve?): no fixed number is right. Too few and the array fills up, as above; too many and memory is wasted. Growing means allocating a bigger array and copying every cell — O(n) each time. That is why the next slide switches to linked nodes, created one by one when needed.</p>
<p>Do not confuse this with the heap layout of deck 4B-Trees2 (the children of cell i at 2i + 1 and 2i + 2): there the positions are computed, no index is stored, and it only suits the nearly-complete shape.</p>
<div class="pitfall">In the index version a link is just an <code>int</code>. Forget to set a new cell's child fields to −1 and they keep Java's default 0 — every "child" then points at cell 0, the root, and the traversal goes round in circles until a <code>StackOverflowError</code>.</div>`,
        `<p class="y-chinh">🎯 Cây nhị phân (binary tree) có thể nằm trong một mảng hoặc trong các nút liên kết; ở bản mảng, mỗi nút lưu chỉ số (index) của các con — nhưng không ai biết trước mảng phải lớn cỡ nào.</p>
<ul>
<li><strong>Hai cách</strong> (slide): bằng mảng (array), hoặc bằng cấu trúc liên kết (linked structure — slide 19).</li>
<li><strong>Bản mảng</strong>: mỗi nút là một đối tượng có một trường thông tin và hai trường "tham chiếu" (reference); hai trường này giữ <em>chỉ số</em> của các ô mảng đang chứa con trái và con phải, nếu có (chương trình dùng −1 cho "không có").</li>
<li><strong>Vấn đề</strong> (slide): khó đoán trước chương trình sẽ tạo bao nhiêu nút — vậy mảng nên dành sẵn bao nhiêu ô?</li>
</ul>
<pre><code class="language-java">public class ArrayTree {
    static final int CAP = 6;                        // kích thước phải chọn TRƯỚC khi cây lớn lên
    static char[] info = new char[CAP];
    static int[] left = new int[CAP];                // chỉ số của con trái, -1 = không có con
    static int[] right = new int[CAP];
    static int n = 0;                                // số ô đã dùng

    static int newNode(char x) {
        if (n == CAP) {
            System.out.println("new node " + x + ": array full (capacity " + CAP + ") -&gt; not added");
            return -1;
        }
        info[n] = x;
        left[n] = right[n] = -1;
        return n++;
    }

    static void preOrder(int i) {                    // đi theo trường chỉ số thay cho tham chiếu
        if (i == -1) return;
        System.out.print(info[i] + " ");
        preOrder(left[i]);
        preOrder(right[i]);
    }

    public static void main(String[] args) {
        int a = newNode('A'), b = newNode('B'), c = newNode('C');
        left[a] = b;
        right[a] = c;
        left[b] = newNode('D');
        right[b] = newNode('E');
        left[c] = newNode('F');
        int g = newNode('G');                        // nút thứ 7 không vừa
        if (g != -1) right[c] = g;
        System.out.println("cell  info  left  right");
        for (int i = 0; i &lt; n; i++) System.out.printf("%-5d %-5s %-5d %d%n", i, info[i], left[i], right[i]);
        System.out.print("preorder from cell " + a + ": ");
        preOrder(a);
        System.out.println();
    }
}</code></pre>
<div class="out">new node G: array full (capacity 6) -&gt; not added<br>
cell &nbsp;info &nbsp;left &nbsp;right<br>
0 &nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;2<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;4<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;-1<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;-1 &nbsp;&nbsp;&nbsp;-1<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;E &nbsp;&nbsp;&nbsp;&nbsp;-1 &nbsp;&nbsp;&nbsp;-1<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;F &nbsp;&nbsp;&nbsp;&nbsp;-1 &nbsp;&nbsp;&nbsp;-1<br>
preorder from cell 0: A B D E C F</div>
<p>Cây của bài A(B(D, E), C(F, –)) lấp đầy 6 ô; nút thứ 7 là G bị từ chối. Đi theo trường chỉ số thay cho tham chiếu, thứ tự preorder (tiền thứ tự) vẫn y như với nút liên kết.</p>
<p class="dap-an">✅ <strong>Trả lời câu hỏi trên slide</strong> (nên dành bao nhiêu ô?): không có con số cố định nào đúng. Ít quá thì mảng đầy, như ở trên; nhiều quá thì phí bộ nhớ. Muốn nới thì phải cấp mảng lớn hơn rồi chép mọi ô sang — mỗi lần tốn O(n). Vì thế slide sau chuyển sang nút liên kết, cần nút nào thì tạo nút đó.</p>
<p>Đừng nhầm với cách xếp của đống (heap) ở bộ 4B-Trees2 (con của ô i nằm ở 2i + 1 và 2i + 2): ở đó vị trí được tính ra, không lưu chỉ số nào, và chỉ hợp với hình dạng gần đầy đủ (nearly complete).</p>
<div class="pitfall">Ở bản chỉ số, một liên kết chỉ là một số <code>int</code>. Quên gán −1 cho hai trường con của ô mới thì chúng giữ giá trị mặc định 0 của Java — mọi "con" đều trỏ về ô 0 là gốc, và phép duyệt chạy vòng quanh cho tới khi văng <code>StackOverflowError</code> (lỗi tràn ngăn xếp).</div>`],
      [19, 'Implementing Binary Trees - 2',
        `<p class="y-chinh">🎯 The linked version: a node is an object with an information field and two reference fields, <code>left</code> and <code>right</code> — the form used by every CSD201 tree program from here on.</p>
<ul>
<li><strong>Version 1</strong> (the first class on the slide): <code>Node(int x)</code> sets <code>info = x</code> and <code>left = right = null</code>; the links are set afterwards, one assignment each.</li>
<li><strong>Version 2</strong> (the second class): a full constructor <code>Node(int x, Node p, Node q)</code> sets all three fields; the short <code>Node(int x)</code> calls it with <code>this(x, null, null)</code> — constructor chaining, so the set-up code is written once.</li>
<li>The labels on the picture — key (data), left child, right child — name the three fields, and the line "Different types of implementations of Binary tree node" says what the two classes are.</li>
<li>The slide's text for the second class also contains a line <code>Node(int x) { }</code> beside the <code>this(x,null,null)</code> version. Whatever that line is on the picture, one class cannot declare two constructors with the same parameter list — javac stops with "constructor Node(int) is already defined". Keep only the <code>this(x,null,null)</code> one.</li>
</ul>
<pre><code class="language-java">class Node1 {                                        // slide version 1 (renamed: one file cannot have two classes named Node)
    int info;
    Node1 left, right;

    Node1(int x) { info = x; left = right = null; }
}

class Node2 {                                        // slide version 2: a full constructor + a short one that calls it
    int info;
    Node2 left, right;

    Node2(int x, Node2 p, Node2 q) { info = x; left = p; right = q; }
    Node2(int x) { this(x, null, null); }            // this(...) = call the other constructor
}

public class NodeVersions {
    static String show1(Node1 p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show1(p.left) + "," + show1(p.right) + ")";
    }

    static String show2(Node2 p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show2(p.left) + "," + show2(p.right) + ")";
    }

    static int nullLinks(Node2 p) { return p == null ? 1 : nullLinks(p.left) + nullLinks(p.right); }

    public static void main(String[] args) {
        Node1 r1 = new Node1(8);                     // version 1: create, then link, one statement per link
        r1.left = new Node1(3);
        r1.right = new Node1(10);
        r1.left.right = new Node1(6);
        Node2 r2 = new Node2(8, new Node2(3, null, new Node2(6)), new Node2(10));   // version 2: one expression
        System.out.println("version 1: " + show1(r1));
        System.out.println("version 2: " + show2(r2));
        System.out.println("4 nodes have 8 reference fields: 3 used, " + nullLinks(r2) + " null (always n + 1)");
    }
}</code></pre>
<div class="out">version 1: 8(3(-,6),10)<br>
version 2: 8(3(-,6),10)<br>
4 nodes have 8 reference fields: 3 used, 5 null (always n + 1)</div>
<p>The two classes are renamed <code>Node1</code> and <code>Node2</code> only because one Java file cannot hold two classes called <code>Node</code>. Version 2 builds the whole tree 8(3(–, 6), 10) in a single expression.</p>
<p><strong>Cost:</strong> creating a node is O(1) and there is no capacity limit. Memory: two references per node — and n nodes always leave exactly n + 1 of their 2n reference fields <code>null</code> (5 for the 4 nodes above).</p>
<div class="pitfall"><code>this(x, null, null)</code> must be the <em>first</em> statement of the constructor; writing <code>info = x;</code> before it is a compile error. And a constructor has no return type — <code>void Node(int x)</code> compiles, but as an ordinary method, so <code>new Node(5)</code> then fails to compile.</div>`,
        `<p class="y-chinh">🎯 Bản liên kết: mỗi nút là một đối tượng có một trường thông tin và hai trường tham chiếu <code>left</code> (trái) và <code>right</code> (phải) — dạng mà mọi chương trình cây của CSD201 dùng từ đây trở đi.</p>
<ul>
<li><strong>Phiên bản 1</strong> (lớp thứ nhất trên slide): <code>Node(int x)</code> gán <code>info = x</code> và <code>left = right = null</code>; các liên kết được gán sau, mỗi liên kết một lệnh.</li>
<li><strong>Phiên bản 2</strong> (lớp thứ hai trên slide): hàm khởi tạo (constructor) đầy đủ <code>Node(int x, Node p, Node q)</code> gán cả ba trường; constructor ngắn <code>Node(int x)</code> gọi nó bằng <code>this(x, null, null)</code> — gọi dây chuyền constructor (constructor chaining), nên đoạn khởi tạo chỉ viết một lần.</li>
<li>Các nhãn trên hình — key (data) (khoá / dữ liệu), left child (con trái), right child (con phải) — là tên ba trường; dòng "Different types of implementations of Binary tree node" trên slide nghĩa là "các kiểu cài đặt khác nhau của nút cây nhị phân".</li>
<li>Chữ của lớp thứ hai trên slide còn có một dòng <code>Node(int x) { }</code> bên cạnh bản <code>this(x,null,null)</code>. Trên hình dòng đó là gì cũng vậy, một lớp không thể khai báo hai constructor có cùng danh sách tham số — javac dừng với lỗi "constructor Node(int) is already defined". Chỉ giữ bản <code>this(x,null,null)</code>.</li>
</ul>
<pre><code class="language-java">class Node1 {                                        // phiên bản 1 của slide (đổi tên: một file không thể có hai lớp tên Node)
    int info;
    Node1 left, right;

    Node1(int x) { info = x; left = right = null; }
}

class Node2 {                                        // phiên bản 2: constructor đầy đủ + constructor ngắn gọi nó
    int info;
    Node2 left, right;

    Node2(int x, Node2 p, Node2 q) { info = x; left = p; right = q; }
    Node2(int x) { this(x, null, null); }            // this(...) = gọi constructor kia
}

public class NodeVersions {
    static String show1(Node1 p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show1(p.left) + "," + show1(p.right) + ")";
    }

    static String show2(Node2 p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show2(p.left) + "," + show2(p.right) + ")";
    }

    static int nullLinks(Node2 p) { return p == null ? 1 : nullLinks(p.left) + nullLinks(p.right); }

    public static void main(String[] args) {
        Node1 r1 = new Node1(8);                     // bản 1: tạo nút rồi nối, mỗi liên kết một lệnh
        r1.left = new Node1(3);
        r1.right = new Node1(10);
        r1.left.right = new Node1(6);
        Node2 r2 = new Node2(8, new Node2(3, null, new Node2(6)), new Node2(10));   // bản 2: một biểu thức
        System.out.println("version 1: " + show1(r1));
        System.out.println("version 2: " + show2(r2));
        System.out.println("4 nodes have 8 reference fields: 3 used, " + nullLinks(r2) + " null (always n + 1)");
    }
}</code></pre>
<div class="out">version 1: 8(3(-,6),10)<br>
version 2: 8(3(-,6),10)<br>
4 nodes have 8 reference fields: 3 used, 5 null (always n + 1)</div>
<p>Hai lớp được đổi tên thành <code>Node1</code> và <code>Node2</code> chỉ vì một file Java không thể chứa hai lớp cùng tên <code>Node</code>. Phiên bản 2 dựng cả cây 8(3(–, 6), 10) trong đúng một biểu thức.</p>
<p><strong>Chi phí:</strong> tạo một nút là O(1) và không có giới hạn sức chứa. Bộ nhớ: hai tham chiếu mỗi nút — và n nút luôn để lại đúng n + 1 trong số 2n trường tham chiếu mang giá trị <code>null</code> (5 với 4 nút ở trên).</p>
<div class="pitfall"><code>this(x, null, null)</code> phải là câu lệnh <em>đầu tiên</em> của constructor; viết <code>info = x;</code> trước nó là lỗi biên dịch. Và constructor không có kiểu trả về — viết <code>void Node(int x)</code> vẫn biên dịch được nhưng thành một phương thức thường, rồi <code>new Node(5)</code> sẽ báo lỗi.</div>`],
      [20, 'Breadth-First Traversal code',
        `<p class="y-chinh">🎯 The slide's <code>breadth()</code> is the queue algorithm of slide 10 in Java: put the root in a queue; while the queue is not empty, take a node out, put its non-null children in, and visit it.</p>
<ul>
<li><code>MyQueue</code> is the queue class of chapter 2; it stores <code>Object</code>s, so the result of <code>dequeue()</code> needs the cast <code>(Node)</code>.</li>
<li>The two <code>if</code>s keep <code>null</code> out of the queue — only real children are enqueued.</li>
<li><code>visit(p)</code> comes after the enqueues; the visiting order is still the order in which nodes leave the queue, so it is exactly top-down, left-to-right breadth-first.</li>
</ul>
<p>Below, the slide's method runs unchanged on the tree of slide 16; the only addition is a <code>MyQueue</code> that prints each operation:</p>
<pre><code class="language-java">import java.util.LinkedList;

class Node {
    char info;
    Node left, right;

    Node(char x) { info = x; left = right = null; }
    public String toString() { return "" + info; }
}

class MyQueue {                                      // a queue of Objects as in chapter 2; it prints each operation
    LinkedList&lt;Object&gt; t = new LinkedList&lt;Object&gt;();

    boolean isEmpty() { return t.isEmpty(); }
    void enqueue(Object x) { t.addLast(x); System.out.print("enqueue " + x + "   "); }
    Object dequeue() { Object x = t.removeFirst(); System.out.print("dequeue " + x + "   "); return x; }
}

class BinaryTree {
    Node root;

    void visit(Node p) { System.out.println("visit " + p.info); }

    void breadth() {                                 // the slide's code, unchanged
        if (root == null) return;
        MyQueue q = new MyQueue();
        q.enqueue(root);
        Node p;
        while (!q.isEmpty()) {
            p = (Node) q.dequeue();
            if (p.left != null)
                q.enqueue(p.left);
            if (p.right != null)
                q.enqueue(p.right);
            visit(p);
        }
    }
}

public class Breadth {
    public static void main(String[] args) {
        BinaryTree t = new BinaryTree();             // the tree of slide 16
        Node f = new Node('F'), b = new Node('B'), g = new Node('G'), d = new Node('D'), i = new Node('I');
        t.root = f;
        f.left = b;  f.right = g;
        b.left = new Node('A');  b.right = d;
        d.left = new Node('C');  d.right = new Node('E');
        g.right = i;
        i.left = new Node('H');
        t.breadth();
    }
}</code></pre>
<div class="out">enqueue F &nbsp;&nbsp;dequeue F &nbsp;&nbsp;enqueue B &nbsp;&nbsp;enqueue G &nbsp;&nbsp;visit F<br>
dequeue B &nbsp;&nbsp;enqueue A &nbsp;&nbsp;enqueue D &nbsp;&nbsp;visit B<br>
dequeue G &nbsp;&nbsp;enqueue I &nbsp;&nbsp;visit G<br>
dequeue A &nbsp;&nbsp;visit A<br>
dequeue D &nbsp;&nbsp;enqueue C &nbsp;&nbsp;enqueue E &nbsp;&nbsp;visit D<br>
dequeue I &nbsp;&nbsp;enqueue H &nbsp;&nbsp;visit I<br>
dequeue C &nbsp;&nbsp;visit C<br>
dequeue E &nbsp;&nbsp;visit E<br>
dequeue H &nbsp;&nbsp;visit H</div>
<p class="nhan">Step by step — the queue after each output line</p>
<table>
<thead><tr><th>Line</th><th>Dequeued</th><th>Enqueued</th><th>Queue after (front … back)</th><th>Visited</th></tr></thead>
<tbody>
<tr><td>1</td><td>F</td><td>F (before the loop), then B, G</td><td>B G</td><td>F</td></tr>
<tr><td>2</td><td>B</td><td>A, D</td><td>G A D</td><td>B</td></tr>
<tr><td>3</td><td>G</td><td>I</td><td>A D I</td><td>G</td></tr>
<tr><td>4</td><td>A</td><td>–</td><td>D I</td><td>A</td></tr>
<tr><td>5</td><td>D</td><td>C, E</td><td>I C E</td><td>D</td></tr>
<tr><td>6</td><td>I</td><td>H</td><td>C E H</td><td>I</td></tr>
<tr><td>7</td><td>C</td><td>–</td><td>E H</td><td>C</td></tr>
<tr><td>8</td><td>E</td><td>–</td><td>H</td><td>E</td></tr>
<tr><td>9</td><td>H</td><td>–</td><td>(empty)</td><td>H</td></tr>
</tbody>
</table>
<p>The visited column reads F B G A D I C E H — the level order printed on slide 16. <strong>Big-O:</strong> each node is enqueued and dequeued exactly once → O(n); the queue never holds much more than one level.</p>
<p>Without a home-made queue, <code>java.util.ArrayDeque&lt;Node&gt;</code> does the same job with <code>offer</code>, <code>poll</code> and <code>isEmpty</code> — and no cast.</p>
<div class="pitfall">Drop the <code>if (p.left != null)</code> tests and <code>null</code> enters the queue; a later <code>dequeue</code> returns <code>null</code> and <code>p.left</code> throws a <code>NullPointerException</code> (an <code>ArrayDeque</code> refuses <code>null</code> straight away with the same exception).</div>`,
        `<p class="y-chinh">🎯 <code>breadth()</code> trên slide chính là thuật toán dùng hàng đợi (queue) của slide 10 viết bằng Java: đưa gốc vào hàng đợi; chừng nào hàng đợi chưa rỗng thì lấy một nút ra, đưa các con khác null của nó vào, rồi thăm nó.</p>
<ul>
<li><code>MyQueue</code> là lớp hàng đợi của chương 2; nó chứa các <code>Object</code>, nên kết quả của <code>dequeue()</code> (lấy ra) phải ép kiểu (cast) <code>(Node)</code>.</li>
<li>Hai lệnh <code>if</code> giữ cho <code>null</code> không lọt vào hàng đợi — chỉ con thật mới được <code>enqueue</code> (xếp vào).</li>
<li><code>visit(p)</code> nằm sau các lệnh enqueue; thứ tự thăm vẫn là thứ tự các nút rời hàng đợi, nên đúng là duyệt theo chiều rộng (breadth-first) từ trên xuống, trái sang phải.</li>
</ul>
<p>Dưới đây, phương thức của slide chạy nguyên văn trên cây của slide 16; thứ duy nhất thêm vào là một <code>MyQueue</code> in ra mỗi thao tác:</p>
<pre><code class="language-java">import java.util.LinkedList;

class Node {
    char info;
    Node left, right;

    Node(char x) { info = x; left = right = null; }
    public String toString() { return "" + info; }
}

class MyQueue {                                      // hàng đợi chứa Object như chương 2; in ra mỗi thao tác
    LinkedList&lt;Object&gt; t = new LinkedList&lt;Object&gt;();

    boolean isEmpty() { return t.isEmpty(); }
    void enqueue(Object x) { t.addLast(x); System.out.print("enqueue " + x + "   "); }
    Object dequeue() { Object x = t.removeFirst(); System.out.print("dequeue " + x + "   "); return x; }
}

class BinaryTree {
    Node root;

    void visit(Node p) { System.out.println("visit " + p.info); }

    void breadth() {                                 // code của slide, giữ nguyên
        if (root == null) return;
        MyQueue q = new MyQueue();
        q.enqueue(root);
        Node p;
        while (!q.isEmpty()) {
            p = (Node) q.dequeue();
            if (p.left != null)
                q.enqueue(p.left);
            if (p.right != null)
                q.enqueue(p.right);
            visit(p);
        }
    }
}

public class Breadth {
    public static void main(String[] args) {
        BinaryTree t = new BinaryTree();             // cây của slide 16
        Node f = new Node('F'), b = new Node('B'), g = new Node('G'), d = new Node('D'), i = new Node('I');
        t.root = f;
        f.left = b;  f.right = g;
        b.left = new Node('A');  b.right = d;
        d.left = new Node('C');  d.right = new Node('E');
        g.right = i;
        i.left = new Node('H');
        t.breadth();
    }
}</code></pre>
<div class="out">enqueue F &nbsp;&nbsp;dequeue F &nbsp;&nbsp;enqueue B &nbsp;&nbsp;enqueue G &nbsp;&nbsp;visit F<br>
dequeue B &nbsp;&nbsp;enqueue A &nbsp;&nbsp;enqueue D &nbsp;&nbsp;visit B<br>
dequeue G &nbsp;&nbsp;enqueue I &nbsp;&nbsp;visit G<br>
dequeue A &nbsp;&nbsp;visit A<br>
dequeue D &nbsp;&nbsp;enqueue C &nbsp;&nbsp;enqueue E &nbsp;&nbsp;visit D<br>
dequeue I &nbsp;&nbsp;enqueue H &nbsp;&nbsp;visit I<br>
dequeue C &nbsp;&nbsp;visit C<br>
dequeue E &nbsp;&nbsp;visit E<br>
dequeue H &nbsp;&nbsp;visit H</div>
<p class="nhan">Từng bước — hàng đợi sau mỗi dòng đầu ra (output)</p>
<table>
<thead><tr><th>Dòng</th><th>Lấy ra</th><th>Xếp vào</th><th>Hàng đợi sau đó (đầu … cuối)</th><th>Được thăm</th></tr></thead>
<tbody>
<tr><td>1</td><td>F</td><td>F (trước vòng lặp), rồi B, G</td><td>B G</td><td>F</td></tr>
<tr><td>2</td><td>B</td><td>A, D</td><td>G A D</td><td>B</td></tr>
<tr><td>3</td><td>G</td><td>I</td><td>A D I</td><td>G</td></tr>
<tr><td>4</td><td>A</td><td>–</td><td>D I</td><td>A</td></tr>
<tr><td>5</td><td>D</td><td>C, E</td><td>I C E</td><td>D</td></tr>
<tr><td>6</td><td>I</td><td>H</td><td>C E H</td><td>I</td></tr>
<tr><td>7</td><td>C</td><td>–</td><td>E H</td><td>C</td></tr>
<tr><td>8</td><td>E</td><td>–</td><td>H</td><td>E</td></tr>
<tr><td>9</td><td>H</td><td>–</td><td>(rỗng)</td><td>H</td></tr>
</tbody>
</table>
<p>Cột "được thăm" đọc ra F B G A D I C E H — đúng thứ tự theo mức (level order) in trên slide 16. <strong>Big-O:</strong> mỗi nút được xếp vào và lấy ra đúng một lần → O(n); hàng đợi không bao giờ chứa nhiều hơn khoảng một mức.</p>
<p>Không muốn tự viết hàng đợi thì <code>java.util.ArrayDeque&lt;Node&gt;</code> làm y hệt với <code>offer</code>, <code>poll</code> và <code>isEmpty</code> — và không cần ép kiểu.</p>
<div class="pitfall">Bỏ các lệnh kiểm <code>if (p.left != null)</code> thì <code>null</code> lọt vào hàng đợi; một lần <code>dequeue</code> sau đó trả về <code>null</code> và <code>p.left</code> ném <code>NullPointerException</code> (còn <code>ArrayDeque</code> từ chối <code>null</code> ngay lập tức với cùng ngoại lệ đó).</div>`],
      [21, 'Depth-First Traversal code',
        `<p class="y-chinh">🎯 The three recursive methods are the NLR / LNR / LRN rules of slide 15 in Java: the same three lines — visit, go left, go right — in three orders, after the stop rule <code>if (p == null) return;</code>.</p>
<ul>
<li>The base case <code>p == null</code> ends the recursion: every leaf calls the method twice more, on its two empty children.</li>
<li>Call them from outside with the root: <code>t.preOrder(t.root)</code>.</li>
<li><code>visit(p)</code> decides what "visiting" means — here printing <code>p.info</code>; in a PE it usually prints the fields of the stored object in a required format.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

class BinaryTree {
    Node root;

    void visit(Node p) { System.out.print(p.info + " "); }

    void preOrder(Node p) {                          // the slide's three methods
        if (p == null) return;
        visit(p);
        preOrder(p.left);
        preOrder(p.right);
    }

    void inOrder(Node p) {
        if (p == null) return;
        inOrder(p.left);
        visit(p);
        inOrder(p.right);
    }

    void postOrder(Node p) {
        if (p == null) return;
        postOrder(p.left);
        postOrder(p.right);
        visit(p);
    }

    int calls = 0;
    void inOrderTrace(Node p, String pad) {          // inOrder again, printing every call (not on the slide)
        calls++;
        if (p == null) { System.out.println(pad + "inOrder(null): return"); return; }
        System.out.println(pad + "inOrder(" + p.info + ")");
        inOrderTrace(p.left, pad + "  ");
        System.out.println(pad + "  visit " + p.info);
        inOrderTrace(p.right, pad + "  ");
    }
}

public class DepthCode {
    public static void main(String[] args) {
        BinaryTree t = new BinaryTree();
        t.root = new Node(4);
        t.root.left = new Node(2);
        t.root.right = new Node(6);
        t.root.left.left = new Node(1);
        t.root.left.right = new Node(3);
        System.out.print("preOrder : "); t.preOrder(t.root);  System.out.println();
        System.out.print("inOrder  : "); t.inOrder(t.root);   System.out.println();
        System.out.print("postOrder: "); t.postOrder(t.root); System.out.println();
        t.inOrderTrace(t.root, "");
        System.out.println(t.calls + " calls for 5 nodes = 2n + 1 (n real nodes + n + 1 null links)");
    }
}</code></pre>
<div class="out">preOrder : 4 2 1 3 6<br>
inOrder &nbsp;: 1 2 3 4 6<br>
postOrder: 1 3 2 6 4<br>
inOrder(4)<br>
&nbsp;&nbsp;inOrder(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;inOrder(1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visit 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;&nbsp;&nbsp;visit 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;inOrder(3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visit 3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;visit 4<br>
&nbsp;&nbsp;inOrder(6)<br>
&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;&nbsp;&nbsp;visit 6<br>
&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
11 calls for 5 nodes = 2n + 1 (n real nodes + n + 1 null links)</div>
<p>The indented part is the call stack of <code>inOrder</code> on 4(2(1, 3), 6): a line is printed when a call starts, the indentation is the number of calls still open, and "visit" sits between the left call and the right call — L, N, R.</p>
<p><strong>Big-O:</strong> n nodes have n + 1 null links, so there are n + (n + 1) = 2n + 1 calls (11 for 5 nodes) → O(n) time. The stack depth equals the height: O(log n) for a balanced tree, O(n) for a stick — and tens of thousands of levels can exhaust the default stack (<code>StackOverflowError</code>).</p>
<p class="meo">🧠 <strong>Remember:</strong> move one line — <code>visit(p);</code> — and you switch between the three traversals.</p>
<div class="pitfall">Forget <code>if (p == null) return;</code> and the first leaf ends the program with a <code>NullPointerException</code>. After copy-pasting, check the recursive calls too: an <code>inOrder</code> that calls <code>preOrder(p.left)</code> prints something that looks almost right.</div>`,
        `<p class="y-chinh">🎯 Ba phương thức đệ quy chính là luật NLR / LNR / LRN của slide 15 viết bằng Java: cùng ba dòng — thăm, sang trái, sang phải — xếp theo ba thứ tự, sau điều kiện dừng <code>if (p == null) return;</code>.</p>
<ul>
<li>Trường hợp cơ sở (base case) <code>p == null</code> là thứ kết thúc đệ quy: mỗi lá còn gọi phương thức thêm hai lần nữa, trên hai con rỗng của nó.</li>
<li>Gọi từ bên ngoài bằng gốc: <code>t.preOrder(t.root)</code>.</li>
<li><code>visit(p)</code> quyết định "thăm" nghĩa là gì — ở đây là in <code>p.info</code>; trong PE thường là in các trường của đối tượng được lưu theo một định dạng bắt buộc.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

class BinaryTree {
    Node root;

    void visit(Node p) { System.out.print(p.info + " "); }

    void preOrder(Node p) {                          // ba phương thức của slide
        if (p == null) return;
        visit(p);
        preOrder(p.left);
        preOrder(p.right);
    }

    void inOrder(Node p) {
        if (p == null) return;
        inOrder(p.left);
        visit(p);
        inOrder(p.right);
    }

    void postOrder(Node p) {
        if (p == null) return;
        postOrder(p.left);
        postOrder(p.right);
        visit(p);
    }

    int calls = 0;
    void inOrderTrace(Node p, String pad) {          // lại inOrder, in mọi lời gọi (không có trên slide)
        calls++;
        if (p == null) { System.out.println(pad + "inOrder(null): return"); return; }
        System.out.println(pad + "inOrder(" + p.info + ")");
        inOrderTrace(p.left, pad + "  ");
        System.out.println(pad + "  visit " + p.info);
        inOrderTrace(p.right, pad + "  ");
    }
}

public class DepthCode {
    public static void main(String[] args) {
        BinaryTree t = new BinaryTree();
        t.root = new Node(4);
        t.root.left = new Node(2);
        t.root.right = new Node(6);
        t.root.left.left = new Node(1);
        t.root.left.right = new Node(3);
        System.out.print("preOrder : "); t.preOrder(t.root);  System.out.println();
        System.out.print("inOrder  : "); t.inOrder(t.root);   System.out.println();
        System.out.print("postOrder: "); t.postOrder(t.root); System.out.println();
        t.inOrderTrace(t.root, "");
        System.out.println(t.calls + " calls for 5 nodes = 2n + 1 (n real nodes + n + 1 null links)");
    }
}</code></pre>
<div class="out">preOrder : 4 2 1 3 6<br>
inOrder &nbsp;: 1 2 3 4 6<br>
postOrder: 1 3 2 6 4<br>
inOrder(4)<br>
&nbsp;&nbsp;inOrder(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;inOrder(1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visit 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;&nbsp;&nbsp;visit 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;inOrder(3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visit 3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;visit 4<br>
&nbsp;&nbsp;inOrder(6)<br>
&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
&nbsp;&nbsp;&nbsp;&nbsp;visit 6<br>
&nbsp;&nbsp;&nbsp;&nbsp;inOrder(null): return<br>
11 calls for 5 nodes = 2n + 1 (n real nodes + n + 1 null links)</div>
<p>Phần thụt lề là ngăn xếp lời gọi (call stack) của <code>inOrder</code> trên cây 4(2(1, 3), 6): mỗi lời gọi bắt đầu thì in một dòng, độ thụt lề là số lời gọi còn đang mở, và "visit" nằm giữa lời gọi bên trái và lời gọi bên phải — L, N, R.</p>
<p><strong>Big-O:</strong> n nút có n + 1 liên kết null, nên có n + (n + 1) = 2n + 1 lời gọi (11 lời gọi cho 5 nút) → O(n) thời gian. Độ sâu ngăn xếp bằng chiều cao cây: O(log n) với cây cân bằng, O(n) với cây "que" — và vài chục nghìn mức có thể làm cạn ngăn xếp mặc định (<code>StackOverflowError</code> — lỗi tràn ngăn xếp).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> dời đúng một dòng — <code>visit(p);</code> — là chuyển qua lại giữa ba phép duyệt.</p>
<div class="pitfall">Quên <code>if (p == null) return;</code> thì tới lá đầu tiên chương trình chết vì <code>NullPointerException</code>. Sau khi sao chép-dán (copy-paste), kiểm luôn các lời gọi đệ quy: một hàm <code>inOrder</code> lỡ gọi <code>preOrder(p.left)</code> in ra thứ trông gần như đúng.</div>`],
      [22, 'Binary Search Trees',
        `<p class="y-chinh">🎯 A binary search tree (BST) is a binary tree with an order rule: every key in a node's left subtree is smaller than the node's key, every key in its right subtree is larger, and both subtrees are BSTs too.</p>
<ul>
<li>The rule is about whole <strong>subtrees</strong>, not only the two children.</li>
<li>Consequence 1 (slide): every key is distinct — a duplicate could be neither smaller nor larger.</li>
<li>Consequence 2 (slide): an inorder traversal visits the keys in increasing order — at every node: the left part (all smaller), the node, the right part (all larger).</li>
<li>Why we want it: a search can throw away a whole subtree at every step — the tree version of binary search (slide 24).</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class IsBST {
    static boolean localCheck(Node p) {              // WRONG: compares a node only with its two children
        if (p == null) return true;
        if (p.left != null &amp;&amp; p.left.info &gt;= p.info) return false;
        if (p.right != null &amp;&amp; p.right.info &lt;= p.info) return false;
        return localCheck(p.left) &amp;&amp; localCheck(p.right);
    }

    static boolean isBST(Node p, long lo, long hi) { // RIGHT: every key must lie strictly between lo and hi
        if (p == null) return true;
        if (p.info &lt;= lo || p.info &gt;= hi) return false;
        return isBST(p.left, lo, p.info) &amp;&amp; isBST(p.right, p.info, hi);   // going left lowers hi, going right raises lo
    }

    static String inorder(Node p) { return p == null ? "" : inorder(p.left) + p.info + " " + inorder(p.right); }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        Node[] trees = {
            new Node(50, new Node(30, new Node(20), new Node(40)), new Node(70)),
            new Node(50, new Node(30, new Node(20), new Node(60)), new Node(70)),
            new Node(10, null, new Node(20, null, new Node(30, null, new Node(40)))),
        };
        System.out.println("tree                   local check  real BST?  inorder");
        for (Node t : trees)
            System.out.printf("%-22s %-12b %-10b %s%n", show(t), localCheck(t), isBST(t, Long.MIN_VALUE, Long.MAX_VALUE), inorder(t));
    }
}</code></pre>
<div class="out">tree &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;local check &nbsp;real BST? &nbsp;inorder<br>
50(30(20,40),70) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 30 40 50 70<br>
50(30(20,60),70) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 30 60 50 70<br>
10(-,20(-,30(-,40))) &nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 20 30 40</div>
<p>The program tests the lesson's three trees in two ways. The "local check" compares each node only with its own children and wrongly accepts 50(30(20, 60), 70): 60 sits in 50's <em>left</em> subtree although it is larger than 50. The correct check hands every node an allowed interval (lo, hi) inherited from all its ancestors — going left lowers hi, going right raises lo — and agrees with the inorder test (sorted or not). Both visit each node once: O(n).</p>
<p class="dap-an">✅ <strong>Syllabus question CQ5.1 — binary tree vs BST?</strong> Both allow at most two children per node; the BST adds the order rule on keys, which lets search, insertion and deletion follow one path (O(h)) instead of exploring the whole tree (O(n)).</p>
<div class="pitfall">"A binary tree is a BST if every node's left child is smaller and its right child larger" is false — the counter-example is right above. The third tree is a reminder that a "stick" is still a valid BST: correct, but slow.</div>`,
        `<p class="y-chinh">🎯 Cây nhị phân tìm kiếm (binary search tree — BST) là cây nhị phân có thêm luật thứ tự: mọi khoá (key) trong cây con trái của một nút nhỏ hơn khoá của nút đó, mọi khoá trong cây con phải lớn hơn, và cả hai cây con cũng là BST.</p>
<ul>
<li>Luật nói về toàn bộ <strong>cây con</strong> (subtree), không chỉ về hai đứa con.</li>
<li>Hệ quả 1 (slide): mọi khoá đều khác nhau — một khoá trùng thì chẳng nhỏ hơn cũng chẳng lớn hơn.</li>
<li>Hệ quả 2 (slide): duyệt trung thứ tự (inorder) thăm các khoá theo thứ tự tăng dần — tại mọi nút: phần trái (toàn nhỏ hơn), nút, phần phải (toàn lớn hơn).</li>
<li>Vì sao cần nó: mỗi bước tìm kiếm loại bỏ được cả một cây con — phiên bản trên cây của tìm kiếm nhị phân (binary search, slide 24).</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class IsBST {
    static boolean localCheck(Node p) {              // SAI: chỉ so một nút với hai con của nó
        if (p == null) return true;
        if (p.left != null &amp;&amp; p.left.info &gt;= p.info) return false;
        if (p.right != null &amp;&amp; p.right.info &lt;= p.info) return false;
        return localCheck(p.left) &amp;&amp; localCheck(p.right);
    }

    static boolean isBST(Node p, long lo, long hi) { // ĐÚNG: mọi khoá phải nằm hẳn giữa lo và hi
        if (p == null) return true;
        if (p.info &lt;= lo || p.info &gt;= hi) return false;
        return isBST(p.left, lo, p.info) &amp;&amp; isBST(p.right, p.info, hi);   // sang trái hạ hi, sang phải nâng lo
    }

    static String inorder(Node p) { return p == null ? "" : inorder(p.left) + p.info + " " + inorder(p.right); }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        Node[] trees = {
            new Node(50, new Node(30, new Node(20), new Node(40)), new Node(70)),
            new Node(50, new Node(30, new Node(20), new Node(60)), new Node(70)),
            new Node(10, null, new Node(20, null, new Node(30, null, new Node(40)))),
        };
        System.out.println("tree                   local check  real BST?  inorder");
        for (Node t : trees)
            System.out.printf("%-22s %-12b %-10b %s%n", show(t), localCheck(t), isBST(t, Long.MIN_VALUE, Long.MAX_VALUE), inorder(t));
    }
}</code></pre>
<div class="out">tree &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;local check &nbsp;real BST? &nbsp;inorder<br>
50(30(20,40),70) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 30 40 50 70<br>
50(30(20,60),70) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;false &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 30 60 50 70<br>
10(-,20(-,30(-,40))) &nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 20 30 40</div>
<p>Chương trình thử ba cây của bài theo hai cách. "Kiểm cục bộ" (local check) chỉ so mỗi nút với hai con của chính nó nên nhận nhầm 50(30(20, 60), 70): 60 nằm trong cây con <em>trái</em> của 50 dù lớn hơn 50. Cách kiểm đúng trao cho mỗi nút một khoảng cho phép (lo, hi) thừa hưởng từ mọi tổ tiên — rẽ trái thì hạ hi, rẽ phải thì nâng lo — và luôn khớp với phép thử inorder (có sắp xếp hay không). Cả hai cách đều thăm mỗi nút một lần: O(n).</p>
<p class="dap-an">✅ <strong>Câu hỏi CQ5.1 của syllabus (đề cương môn học) — cây nhị phân khác BST ở đâu?</strong> Cả hai đều cho mỗi nút tối đa hai con; BST thêm luật thứ tự trên khoá, nhờ đó tìm kiếm, chèn, xoá chỉ đi theo một con đường (O(h)) thay vì phải lục cả cây (O(n)).</p>
<div class="pitfall">"Cây nhị phân là BST nếu con trái của mọi nút nhỏ hơn nó và con phải lớn hơn nó" là SAI — phản ví dụ nằm ngay ở trên. Cây thứ ba nhắc rằng cây hình "que" vẫn là BST hợp lệ: đúng, nhưng chậm.</div>`],
      [23, 'Implementing Binary Search Trees',
        `<p class="y-chinh">🎯 The slide gives the skeleton of the <code>BSTree</code> class — a <code>Node</code> class and a tree holding <code>root</code>, with insert, the traversals, search and two deletions; PE tree questions typically hand out a skeleton like this and ask you to fill in some methods.</p>
<ul>
<li><code>Node</code>: <code>info</code> plus <code>left</code> and <code>right</code>; the constructor sets both links to <code>null</code> (slide 19, version 1).</li>
<li><code>BSTree</code>: a single field, <code>root</code>; <code>BSTree()</code> starts with an empty tree.</li>
<li>Methods listed on the slide: <code>insert(int x)</code>, <code>visit(Node p)</code>, <code>preOrder</code>, <code>inOrder</code>, <code>postOrder(Node p)</code>, <code>search(int x)</code>, <code>deleteByMerging(int x)</code>, <code>deleteByCopying(int x)</code>.</li>
<li>The recursive methods take a <code>Node</code>; the methods a user calls take a key and start from <code>root</code> — <code>search(int x)</code> simply returns <code>search(root, x)</code>.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

class BSTree {                                       // the skeleton of slide 23, filled in
    Node root;

    BSTree() { root = null; }

    void insert(int x) {                             // the iterative insert of slide 26
        if (root == null) { root = new Node(x); return; }
        Node f = null, p = root;
        while (p != null) {
            if (p.info == x) { System.out.println(" The key " + x + " already exists, no insertion"); return; }
            f = p;
            if (x &lt; p.info) p = p.left; else p = p.right;
        }
        if (x &lt; f.info) f.left = new Node(x); else f.right = new Node(x);
    }

    void visit(Node p) { System.out.print(p.info + " "); }
    void preOrder(Node p)  { if (p == null) return; visit(p); preOrder(p.left); preOrder(p.right); }
    void inOrder(Node p)   { if (p == null) return; inOrder(p.left); visit(p); inOrder(p.right); }
    void postOrder(Node p) { if (p == null) return; postOrder(p.left); postOrder(p.right); visit(p); }

    Node search(int x) { return search(root, x); }  // the public entry point starts at the root
    Node search(Node p, int x) {                     // slide 24
        if (p == null) return null;
        if (p.info == x) return p;
        if (x &lt; p.info) return search(p.left, x);
        else return search(p.right, x);
    }
    // deleteByMerging(int x) and deleteByCopying(int x): slides 29-32
}

public class BSTreeDemo {
    public static void main(String[] args) {
        BSTree t = new BSTree();
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80}) t.insert(x);
        System.out.print("preOrder : "); t.preOrder(t.root);  System.out.println();
        System.out.print("inOrder  : "); t.inOrder(t.root);   System.out.println();
        System.out.print("postOrder: "); t.postOrder(t.root); System.out.println();
        Node a = t.search(60), b = t.search(65);
        System.out.println("search(60) -&gt; " + (a == null ? "null" : "node " + a.info));
        System.out.println("search(65) -&gt; " + (b == null ? "null" : "node " + b.info));
    }
}</code></pre>
<div class="out">preOrder : 50 30 20 40 70 60 80<br>
inOrder &nbsp;: 20 30 40 50 60 70 80<br>
postOrder: 20 40 30 60 80 70 50<br>
search(60) -&gt; node 60<br>
search(65) -&gt; null</div>
<p>Here the skeleton is filled with the code of the next slides (search from slide 24, insert from slide 26); the two deletions are written out on slides 29–32. The inorder line comes out sorted — the BST rule at work.</p>
<p><strong>Cost of each method</strong>, with h the height: insert, search and both deletions O(h); the traversals O(n).</p>
<div class="pitfall">In the PE, keep the given signatures exactly — names, parameters, return types — because the provided test code calls them. Adding a helper such as <code>search(Node p, int x)</code> next to <code>search(int x)</code> is fine; changing <code>search(int x)</code> itself is not.</div>`,
        `<p class="y-chinh">🎯 Slide cho bộ khung (skeleton) của lớp <code>BSTree</code> — lớp <code>Node</code> và một cây giữ <code>root</code> (gốc), cùng các phương thức chèn, duyệt, tìm kiếm và hai cách xoá; câu hỏi cây trong PE thường phát sẵn một bộ khung như vậy và yêu cầu viết thân vài phương thức.</p>
<ul>
<li><code>Node</code>: <code>info</code> cùng <code>left</code> và <code>right</code>; hàm khởi tạo (constructor) gán cả hai liên kết bằng <code>null</code> (slide 19, phiên bản 1).</li>
<li><code>BSTree</code>: chỉ một trường là <code>root</code>; <code>BSTree()</code> bắt đầu với cây rỗng.</li>
<li>Các phương thức liệt kê trên slide: <code>insert(int x)</code> (chèn), <code>visit(Node p)</code> (thăm), <code>preOrder</code>, <code>inOrder</code>, <code>postOrder(Node p)</code> (ba phép duyệt), <code>search(int x)</code> (tìm), <code>deleteByMerging(int x)</code> (xoá bằng hợp nhất), <code>deleteByCopying(int x)</code> (xoá bằng sao chép).</li>
<li>Các phương thức đệ quy nhận một <code>Node</code>; các phương thức người dùng gọi thì nhận một khoá (key) và bắt đầu từ <code>root</code> — <code>search(int x)</code> chỉ việc trả về <code>search(root, x)</code>.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

class BSTree {                                       // bộ khung của slide 23, viết đầy đủ
    Node root;

    BSTree() { root = null; }

    void insert(int x) {                             // hàm chèn dùng vòng lặp của slide 26
        if (root == null) { root = new Node(x); return; }
        Node f = null, p = root;
        while (p != null) {
            if (p.info == x) { System.out.println(" The key " + x + " already exists, no insertion"); return; }
            f = p;
            if (x &lt; p.info) p = p.left; else p = p.right;
        }
        if (x &lt; f.info) f.left = new Node(x); else f.right = new Node(x);
    }

    void visit(Node p) { System.out.print(p.info + " "); }
    void preOrder(Node p)  { if (p == null) return; visit(p); preOrder(p.left); preOrder(p.right); }
    void inOrder(Node p)   { if (p == null) return; inOrder(p.left); visit(p); inOrder(p.right); }
    void postOrder(Node p) { if (p == null) return; postOrder(p.left); postOrder(p.right); visit(p); }

    Node search(int x) { return search(root, x); }  // hàm gọi từ ngoài bắt đầu ở gốc
    Node search(Node p, int x) {                     // slide 24
        if (p == null) return null;
        if (p.info == x) return p;
        if (x &lt; p.info) return search(p.left, x);
        else return search(p.right, x);
    }
    // deleteByMerging và deleteByCopying: slide 29-32
}

public class BSTreeDemo {
    public static void main(String[] args) {
        BSTree t = new BSTree();
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80}) t.insert(x);
        System.out.print("preOrder : "); t.preOrder(t.root);  System.out.println();
        System.out.print("inOrder  : "); t.inOrder(t.root);   System.out.println();
        System.out.print("postOrder: "); t.postOrder(t.root); System.out.println();
        Node a = t.search(60), b = t.search(65);
        System.out.println("search(60) -&gt; " + (a == null ? "null" : "node " + a.info));
        System.out.println("search(65) -&gt; " + (b == null ? "null" : "node " + b.info));
    }
}</code></pre>
<div class="out">preOrder : 50 30 20 40 70 60 80<br>
inOrder &nbsp;: 20 30 40 50 60 70 80<br>
postOrder: 20 40 30 60 80 70 50<br>
search(60) -&gt; node 60<br>
search(65) -&gt; null</div>
<p>Ở đây bộ khung được lấp bằng code của các slide sau (search của slide 24, insert của slide 26); hai cách xoá được viết đầy đủ ở slide 29–32. Dòng inorder (trung thứ tự) ra đã sắp xếp — luật BST đang làm việc.</p>
<p><strong>Chi phí từng phương thức</strong>, với h là chiều cao: chèn, tìm và cả hai cách xoá là O(h); các phép duyệt là O(n).</p>
<div class="pitfall">Trong PE, giữ nguyên chữ ký (signature) được cho — tên, tham số, kiểu trả về — vì code kiểm tra có sẵn sẽ gọi đúng các chữ ký đó. Thêm một hàm phụ như <code>search(Node p, int x)</code> bên cạnh <code>search(int x)</code> thì được; sửa chính <code>search(int x)</code> thì không.</div>`],
      [24, 'Searching on Binary Search Trees',
        `<p class="y-chinh">🎯 Search compares x with the current node and goes down one side only — found, not found, left or right — so it follows a single path from the root.</p>
<ol>
<li><code>p == null</code> → the path has fallen off the tree: x is not there, return <code>null</code>.</li>
<li><code>p.info == x</code> → found, return <code>p</code>.</li>
<li><code>x &lt; p.info</code> → x can only be in the left subtree: <code>return search(p.left, x)</code>.</li>
<li>Otherwise only the right subtree is possible: <code>return search(p.right, x)</code>.</li>
</ol>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class BstSearch {
    static StringBuilder path;                       // trace, not on the slide
    static int visited;

    static Node search(Node p, int x) {              // the slide's code + trace lines
        if (p == null) { path.append("null: not found"); return null; }
        visited++;
        if (p.info == x) { path.append(p.info).append(" found"); return p; }
        if (x &lt; p.info) {
            path.append(p.info).append(" go left -&gt; ");
            return search(p.left, x);
        } else {
            path.append(p.info).append(" go right -&gt; ");
            return search(p.right, x);
        }
    }

    static Node insert(Node p, int x) {
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x); else p.right = insert(p.right, x);
        return p;
    }

    static void find(Node root, int x) {
        path = new StringBuilder();
        visited = 0;
        search(root, x);
        System.out.println("search " + x + ": " + path + "   (" + visited + " nodes compared)");
    }

    public static void main(String[] args) {
        Node root = null;
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80}) root = insert(root, x);
        find(root, 60);
        find(root, 20);
        find(root, 65);
        Node stick = null;                           // keys inserted in sorted order -&gt; a "stick"
        for (int x = 10; x &lt;= 70; x += 10) stick = insert(stick, x);
        find(stick, 70);
    }
}</code></pre>
<div class="out">search 60: 50 go right -&gt; 70 go left -&gt; 60 found &nbsp;&nbsp;(3 nodes compared)<br>
search 20: 50 go left -&gt; 30 go left -&gt; 20 found &nbsp;&nbsp;(3 nodes compared)<br>
search 65: 50 go right -&gt; 70 go left -&gt; 60 go right -&gt; null: not found &nbsp;&nbsp;(3 nodes compared)<br>
search 70: 10 go right -&gt; 20 go right -&gt; 30 go right -&gt; 40 go right -&gt; 50 go right -&gt; 60 go right -&gt; 70 found &nbsp;&nbsp;(7 nodes compared)</div>
<p class="nhan">Step by step — search(65) in 50(30(20, 40), 70(60, 80))</p>
<table>
<thead><tr><th>Call</th><th>p</th><th>Comparison</th><th>Decision</th></tr></thead>
<tbody>
<tr><td>1</td><td>50</td><td>65 &gt; 50</td><td>go right</td></tr>
<tr><td>2</td><td>70</td><td>65 &lt; 70</td><td>go left</td></tr>
<tr><td>3</td><td>60</td><td>65 &gt; 60</td><td>go right</td></tr>
<tr><td>4</td><td>null</td><td>—</td><td>not found: return null</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> one comparison per level → at most h + 1 calls, O(h). A balanced tree has h ≈ log₂ n (3 comparisons for 7 keys, about 20 for a million); the stick built from sorted keys has h = n (last output line: 7 comparisons for 7 keys) → O(n).</p>
<p>The same search without recursion: <code>while (p != null &amp;&amp; p.info != x) p = x &lt; p.info ? p.left : p.right;</code> — no call stack at all.</p>
<div class="pitfall">"Searching a BST with n nodes takes O(log n) in the worst case" — false. The worst case is O(n), on a degenerate tree; O(log n) needs a balanced tree, which is what AVL trees (deck 4B-Trees2) guarantee.</div>`,
        `<p class="y-chinh">🎯 Tìm kiếm (search) so x với nút hiện tại rồi chỉ đi xuống một phía — thấy, không thấy, sang trái hoặc sang phải — nên nó đi theo đúng một con đường từ gốc.</p>
<ol>
<li><code>p == null</code> → con đường đã rơi khỏi cây: x không có trong cây, trả về <code>null</code>.</li>
<li><code>p.info == x</code> → tìm thấy, trả về <code>p</code>.</li>
<li><code>x &lt; p.info</code> → x chỉ có thể nằm trong cây con trái: <code>return search(p.left, x)</code>.</li>
<li>Ngược lại chỉ còn cây con phải: <code>return search(p.right, x)</code>.</li>
</ol>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class BstSearch {
    static StringBuilder path;                       // vết, không có trên slide
    static int visited;

    static Node search(Node p, int x) {              // code của slide + các dòng in vết
        if (p == null) { path.append("null: not found"); return null; }
        visited++;
        if (p.info == x) { path.append(p.info).append(" found"); return p; }
        if (x &lt; p.info) {
            path.append(p.info).append(" go left -&gt; ");
            return search(p.left, x);
        } else {
            path.append(p.info).append(" go right -&gt; ");
            return search(p.right, x);
        }
    }

    static Node insert(Node p, int x) {
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x); else p.right = insert(p.right, x);
        return p;
    }

    static void find(Node root, int x) {
        path = new StringBuilder();
        visited = 0;
        search(root, x);
        System.out.println("search " + x + ": " + path + "   (" + visited + " nodes compared)");
    }

    public static void main(String[] args) {
        Node root = null;
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80}) root = insert(root, x);
        find(root, 60);
        find(root, 20);
        find(root, 65);
        Node stick = null;                           // khoá chèn theo thứ tự tăng -&gt; cây "que"
        for (int x = 10; x &lt;= 70; x += 10) stick = insert(stick, x);
        find(stick, 70);
    }
}</code></pre>
<div class="out">search 60: 50 go right -&gt; 70 go left -&gt; 60 found &nbsp;&nbsp;(3 nodes compared)<br>
search 20: 50 go left -&gt; 30 go left -&gt; 20 found &nbsp;&nbsp;(3 nodes compared)<br>
search 65: 50 go right -&gt; 70 go left -&gt; 60 go right -&gt; null: not found &nbsp;&nbsp;(3 nodes compared)<br>
search 70: 10 go right -&gt; 20 go right -&gt; 30 go right -&gt; 40 go right -&gt; 50 go right -&gt; 60 go right -&gt; 70 found &nbsp;&nbsp;(7 nodes compared)</div>
<p class="nhan">Từng bước — search(65) trên cây 50(30(20, 40), 70(60, 80))</p>
<table>
<thead><tr><th>Lời gọi</th><th>p</th><th>So sánh</th><th>Quyết định</th></tr></thead>
<tbody>
<tr><td>1</td><td>50</td><td>65 &gt; 50</td><td>sang phải</td></tr>
<tr><td>2</td><td>70</td><td>65 &lt; 70</td><td>sang trái</td></tr>
<tr><td>3</td><td>60</td><td>65 &gt; 60</td><td>sang phải</td></tr>
<tr><td>4</td><td>null</td><td>—</td><td>không thấy: trả về null</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> mỗi mức một phép so sánh → tối đa h + 1 lời gọi, O(h). Cây cân bằng (balanced) có h ≈ log₂ n (3 phép so sánh cho 7 khoá, khoảng 20 cho một triệu khoá); cây "que" dựng từ khoá đã sắp xếp có h = n (dòng cuối của đầu ra — output: 7 phép so sánh cho 7 khoá) → O(n).</p>
<p>Cùng phép tìm đó không dùng đệ quy: <code>while (p != null &amp;&amp; p.info != x) p = x &lt; p.info ? p.left : p.right;</code> — không tốn ngăn xếp lời gọi nào.</p>
<div class="pitfall">"Tìm kiếm trên BST n nút tốn O(log n) trong trường hợp xấu nhất" — SAI. Trường hợp xấu nhất là O(n), trên cây suy biến (degenerate); O(log n) cần cây cân bằng, và đó chính là thứ cây AVL (bộ 4B-Trees2) bảo đảm.</div>`],
      [25, 'Insertion - 1',
        `<p class="y-chinh">🎯 To insert x, search for x: the place where the search falls off the tree (an empty link) is exactly where x belongs — so a new key always becomes a leaf.</p>
<p class="ghi-chu">This slide is a figure ("Inserting nodes into binary search trees"); its text is only that caption, so the walk-through below uses the lesson's own example — compare it with the pictures on the slide.</p>
<ul>
<li>Start at the root; smaller → go left, larger → go right, exactly as in search.</li>
<li>When the next link is empty, hang the new node there. Nothing above it moves.</li>
<li>Equal key → it is already in the tree; a BST keeps its keys distinct (slide 22), so there is nothing to insert.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class InsertTrace {
    static Node root;

    static void insert(int x) {                      // walk down like a search; the new node is always a LEAF
        if (root == null) {
            root = new Node(x);
            System.out.println("insert " + x + ": tree empty -&gt; " + x + " is the root");
            return;
        }
        StringBuilder path = new StringBuilder();
        Node p = root;
        while (true) {
            if (path.length() &gt; 0) path.append(", ");
            if (x &lt; p.info) {                        // smaller: go left
                path.append(p.info).append(" L");
                if (p.left == null) { p.left = new Node(x); break; }
                p = p.left;
            } else {                                 // larger: go right
                path.append(p.info).append(" R");
                if (p.right == null) { p.right = new Node(x); break; }
                p = p.right;
            }
        }
        System.out.println("insert " + x + ": " + path + " =&gt; new leaf, " + (x &lt; p.info ? "left" : "right") + " child of " + p.info);
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 35}) insert(x);
        System.out.println("tree = " + show(root) + "   height = " + height(root));
    }
}</code></pre>
<div class="out">insert 50: tree empty -&gt; 50 is the root<br>
insert 30: 50 L =&gt; new leaf, left child of 50<br>
insert 70: 50 R =&gt; new leaf, right child of 50<br>
insert 20: 50 L, 30 L =&gt; new leaf, left child of 30<br>
insert 40: 50 L, 30 R =&gt; new leaf, right child of 30<br>
insert 60: 50 R, 70 L =&gt; new leaf, left child of 70<br>
insert 80: 50 R, 70 R =&gt; new leaf, right child of 70<br>
insert 35: 50 L, 30 R, 40 L =&gt; new leaf, left child of 40<br>
tree = 50(30(20,40(35,-)),70(60,80)) &nbsp;&nbsp;height = 4</div>
<pre><code class="language-plaintext">        50
     /      \\
   30        70
  /  \\      /  \\
20    40   60   80
     /
   35</code></pre>
<p>Order matters: the same eight keys inserted as 20, 30, 35, 40, 50, 60, 70, 80 would give a stick of height 8 instead of this tree of height 4.</p>
<p><strong>Big-O:</strong> O(h) to find the spot + O(1) to link the node → O(h): O(log n) on a balanced tree, O(n) on a stick.</p>
<div class="pitfall">"Insert 35 — where does it go?" Follow the comparisons from the root (50 L, 30 R, 40 L); do not look for "a free place between 30 and 40". A new key never goes between existing nodes: it always ends up as a leaf.</div>`,
        `<p class="y-chinh">🎯 Muốn chèn x thì tìm x: chỗ mà phép tìm rơi khỏi cây (một liên kết rỗng) chính là chỗ của x — vì vậy khoá mới luôn trở thành một lá (leaf).</p>
<p class="ghi-chu">Slide này là hình ("Inserting nodes into binary search trees" — chèn nút vào cây nhị phân tìm kiếm); chữ chỉ có dòng chú thích đó, nên phần đi từng bước dưới đây dùng ví dụ của bài — hãy đối chiếu với các hình trên slide.</p>
<ul>
<li>Bắt đầu từ gốc; nhỏ hơn → sang trái, lớn hơn → sang phải, y như khi tìm kiếm.</li>
<li>Gặp liên kết kế tiếp rỗng thì treo nút mới vào đó. Không nút nào phía trên bị dời chỗ.</li>
<li>Khoá bằng nhau → khoá đã có trong cây; BST giữ các khoá khác nhau (slide 22), nên không có gì để chèn.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class InsertTrace {
    static Node root;

    static void insert(int x) {                      // đi xuống như khi tìm; nút mới luôn là một LÁ
        if (root == null) {
            root = new Node(x);
            System.out.println("insert " + x + ": tree empty -&gt; " + x + " is the root");
            return;
        }
        StringBuilder path = new StringBuilder();
        Node p = root;
        while (true) {
            if (path.length() &gt; 0) path.append(", ");
            if (x &lt; p.info) {                        // nhỏ hơn: sang trái
                path.append(p.info).append(" L");
                if (p.left == null) { p.left = new Node(x); break; }
                p = p.left;
            } else {                                 // lớn hơn: sang phải
                path.append(p.info).append(" R");
                if (p.right == null) { p.right = new Node(x); break; }
                p = p.right;
            }
        }
        System.out.println("insert " + x + ": " + path + " =&gt; new leaf, " + (x &lt; p.info ? "left" : "right") + " child of " + p.info);
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 35}) insert(x);
        System.out.println("tree = " + show(root) + "   height = " + height(root));
    }
}</code></pre>
<div class="out">insert 50: tree empty -&gt; 50 is the root<br>
insert 30: 50 L =&gt; new leaf, left child of 50<br>
insert 70: 50 R =&gt; new leaf, right child of 50<br>
insert 20: 50 L, 30 L =&gt; new leaf, left child of 30<br>
insert 40: 50 L, 30 R =&gt; new leaf, right child of 30<br>
insert 60: 50 R, 70 L =&gt; new leaf, left child of 70<br>
insert 80: 50 R, 70 R =&gt; new leaf, right child of 70<br>
insert 35: 50 L, 30 R, 40 L =&gt; new leaf, left child of 40<br>
tree = 50(30(20,40(35,-)),70(60,80)) &nbsp;&nbsp;height = 4</div>
<pre><code class="language-plaintext">        50
     /      \\
   30        70
  /  \\      /  \\
20    40   60   80
     /
   35</code></pre>
<p>Thứ tự chèn quan trọng: cũng tám khoá đó mà chèn theo thứ tự 20, 30, 35, 40, 50, 60, 70, 80 thì ra cây "que" cao 8 thay vì cây cao 4 như trên.</p>
<p><strong>Big-O:</strong> O(h) để tìm chỗ + O(1) để nối nút → O(h): O(log n) trên cây cân bằng, O(n) trên cây "que".</p>
<div class="pitfall">"Chèn 35 — nó nằm ở đâu?" Hãy đi theo các phép so sánh từ gốc (50 T, 30 P, 40 T); đừng đi tìm "một chỗ trống giữa 30 và 40". Khoá mới không bao giờ chen vào giữa các nút đã có: nó luôn thành một lá.</div>`],
      [26, 'Insertion - 2',
        `<p class="y-chinh">🎯 The slide's iterative <code>insert</code>: pointer <code>p</code> walks down as in search while <code>f</code> follows one step behind; when <code>p</code> becomes <code>null</code>, <code>f</code> is the parent of the new node.</p>
<ul>
<li>Empty tree → the new node becomes the root.</li>
<li>Loop while <code>p != null</code>: equal key → print " The key … already exists, no insertion" and stop; otherwise <code>f = p</code>, then move <code>p</code> left or right.</li>
<li>After the loop <code>p</code> is <code>null</code> and useless; the new node is linked to <code>f</code> — on the left if <code>x &lt; f.info</code>, otherwise on the right.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

class BSTree {
    Node root;
    boolean trace = false;                           // trace switch (not on the slide)

    void insert(int x) {                             // the slide's code (only re-indented)
        if (root == null) {
            root = new Node(x);
            return;
        }
        Node f, p;
        p = root; f = null;
        while (p != null) {
            if (trace) System.out.println("  p = " + p.info + ", f = " + (f == null ? "null" : "" + f.info));   // trace
            if (p.info == x) {
                System.out.println(" The key " + x + " already exists, no insertion");
                return;
            }
            f = p;
            if (x &lt; p.info)
                p = p.left;
            else
                p = p.right;
        }
        if (trace) System.out.println("  p = null, f = " + f.info + " -&gt; the new node hangs below f");   // trace
        if (x &lt; f.info)
            f.left = new Node(x);
        else
            f.right = new Node(x);
    }

    String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
}

public class InsertCode {
    public static void main(String[] args) {
        BSTree t = new BSTree();
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80}) t.insert(x);
        System.out.println("insert 35:");
        t.trace = true;
        t.insert(35);
        t.trace = false;
        System.out.println("tree = " + t.show(t.root));
        System.out.println("insert 40:");
        t.insert(40);
        BSTree s = new BSTree();
        for (int x = 10; x &lt;= 50; x += 10) s.insert(x);
        System.out.println("sorted input 10 20 30 40 50 -&gt; " + s.show(s.root));
    }
}</code></pre>
<div class="out">insert 35:<br>
&nbsp;&nbsp;p = 50, f = null<br>
&nbsp;&nbsp;p = 30, f = 50<br>
&nbsp;&nbsp;p = 40, f = 30<br>
&nbsp;&nbsp;p = null, f = 40 -&gt; the new node hangs below f<br>
tree = 50(30(20,40(35,-)),70(60,80))<br>
insert 40:<br>
&nbsp;The key 40 already exists, no insertion<br>
sorted input 10 20 30 40 50 -&gt; 10(-,20(-,30(-,40(-,50))))</div>
<p>The program is the slide's code (only re-indented) plus two trace lines, switched on while inserting 35. The trace, as a table:</p>
<table>
<thead><tr><th>Iteration</th><th>p</th><th>f</th><th>35 compared with p</th><th>Next</th></tr></thead>
<tbody>
<tr><td>1</td><td>50</td><td>null</td><td>35 &lt; 50</td><td>f = 50, p = 30</td></tr>
<tr><td>2</td><td>30</td><td>50</td><td>35 &gt; 30</td><td>f = 30, p = 40</td></tr>
<tr><td>3</td><td>40</td><td>30</td><td>35 &lt; 40</td><td>f = 40, p = null</td></tr>
<tr><td>after the loop</td><td>null</td><td>40</td><td>35 &lt; 40</td><td><code>f.left = new Node(35)</code></td></tr>
</tbody>
</table>
<p>Inserting 40 again stops at the second iteration with the slide's message; inserting 10, 20, 30, 40, 50 in increasing order builds the stick 10(–, 20(–, 30(–, 40(–, 50)))), every node a right child. <strong>Big-O:</strong> O(h) per insertion, so building a tree from n sorted keys costs 1 + 2 + … + n = O(n²).</p>
<p class="dap-an">✅ <strong>Syllabus question HCM_CQ6.1 — what happens if you insert an ordered array into a BST?</strong> The tree degenerates into a linked list (the stick above): height n, and search, insertion and deletion fall to O(n). Balanced trees such as AVL (deck 4B-Trees2) exist to prevent exactly this.</p>
<div class="pitfall">Writing <code>p = new Node(x);</code> after the loop compiles, yet inserts nothing: <code>p</code> is only a local variable, and no link of the tree points to the new node. The link must be set on the parent — that is the whole reason <code>f</code> exists.</div>`,
        `<p class="y-chinh">🎯 Hàm <code>insert</code> dùng vòng lặp của slide: con trỏ <code>p</code> đi xuống như khi tìm kiếm, còn <code>f</code> đi theo sau đúng một bước; khi <code>p</code> thành <code>null</code> thì <code>f</code> chính là cha của nút mới.</p>
<ul>
<li>Cây rỗng → nút mới trở thành gốc (root).</li>
<li>Lặp chừng nào <code>p != null</code>: gặp khoá bằng → in " The key … already exists, no insertion" (khoá đã có, không chèn) rồi dừng; ngược lại gán <code>f = p</code>, rồi dời <code>p</code> sang trái hoặc phải.</li>
<li>Sau vòng lặp <code>p</code> là <code>null</code> và không còn dùng được; nút mới được nối vào <code>f</code> — bên trái nếu <code>x &lt; f.info</code>, ngược lại bên phải.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

class BSTree {
    Node root;
    boolean trace = false;                           // công tắc in vết (không có trên slide)

    void insert(int x) {                             // code của slide (chỉ căn lề lại)
        if (root == null) {
            root = new Node(x);
            return;
        }
        Node f, p;
        p = root; f = null;
        while (p != null) {
            if (trace) System.out.println("  p = " + p.info + ", f = " + (f == null ? "null" : "" + f.info));   // in vết
            if (p.info == x) {
                System.out.println(" The key " + x + " already exists, no insertion");
                return;
            }
            f = p;
            if (x &lt; p.info)
                p = p.left;
            else
                p = p.right;
        }
        if (trace) System.out.println("  p = null, f = " + f.info + " -&gt; the new node hangs below f");   // in vết
        if (x &lt; f.info)
            f.left = new Node(x);
        else
            f.right = new Node(x);
    }

    String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
}

public class InsertCode {
    public static void main(String[] args) {
        BSTree t = new BSTree();
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80}) t.insert(x);
        System.out.println("insert 35:");
        t.trace = true;
        t.insert(35);
        t.trace = false;
        System.out.println("tree = " + t.show(t.root));
        System.out.println("insert 40:");
        t.insert(40);
        BSTree s = new BSTree();
        for (int x = 10; x &lt;= 50; x += 10) s.insert(x);
        System.out.println("sorted input 10 20 30 40 50 -&gt; " + s.show(s.root));
    }
}</code></pre>
<div class="out">insert 35:<br>
&nbsp;&nbsp;p = 50, f = null<br>
&nbsp;&nbsp;p = 30, f = 50<br>
&nbsp;&nbsp;p = 40, f = 30<br>
&nbsp;&nbsp;p = null, f = 40 -&gt; the new node hangs below f<br>
tree = 50(30(20,40(35,-)),70(60,80))<br>
insert 40:<br>
&nbsp;The key 40 already exists, no insertion<br>
sorted input 10 20 30 40 50 -&gt; 10(-,20(-,30(-,40(-,50))))</div>
<p>Chương trình là code của slide (chỉ căn lề lại) cộng thêm hai dòng in vết (trace), được bật khi chèn 35. Vết đó viết thành bảng:</p>
<table>
<thead><tr><th>Vòng lặp</th><th>p</th><th>f</th><th>So 35 với p</th><th>Tiếp theo</th></tr></thead>
<tbody>
<tr><td>1</td><td>50</td><td>null</td><td>35 &lt; 50</td><td>f = 50, p = 30</td></tr>
<tr><td>2</td><td>30</td><td>50</td><td>35 &gt; 30</td><td>f = 30, p = 40</td></tr>
<tr><td>3</td><td>40</td><td>30</td><td>35 &lt; 40</td><td>f = 40, p = null</td></tr>
<tr><td>sau vòng lặp</td><td>null</td><td>40</td><td>35 &lt; 40</td><td><code>f.left = new Node(35)</code></td></tr>
</tbody>
</table>
<p>Chèn lại 40 thì dừng ở vòng thứ hai với thông báo của slide; chèn 10, 20, 30, 40, 50 theo thứ tự tăng dần thì ra cây "que" 10(–, 20(–, 30(–, 40(–, 50)))), nút nào cũng là con phải. <strong>Big-O:</strong> mỗi lần chèn O(h), nên dựng cây từ n khoá đã sắp xếp tốn 1 + 2 + … + n = O(n²).</p>
<p class="dap-an">✅ <strong>Câu hỏi HCM_CQ6.1 của syllabus (đề cương môn học) — chèn một mảng đã sắp xếp vào BST thì sao?</strong> Cây suy biến (degenerate) thành một danh sách liên kết (cây "que" ở trên): cao n, và tìm kiếm, chèn, xoá đều tụt xuống O(n). Các cây cân bằng như AVL (bộ 4B-Trees2) sinh ra chính là để chặn chuyện này.</p>
<div class="pitfall">Viết <code>p = new Node(x);</code> sau vòng lặp vẫn biên dịch được nhưng không chèn gì cả: <code>p</code> chỉ là biến cục bộ, không liên kết nào của cây trỏ tới nút mới. Phải gán liên kết ở nút cha — đó chính là lý do tồn tại của <code>f</code>.</div>`],
      [27, 'Deletion - 1',
        `<p class="y-chinh">🎯 Deleting a key from a BST has three cases, decided by how many children its node has: none (a leaf), one, or two.</p>
<ol>
<li><strong>Leaf</strong> — cut it off: the parent's link becomes <code>null</code>.</li>
<li><strong>One child</strong> — the parent adopts that child, together with the child's whole subtree.</li>
<li><strong>Two children</strong> — the node cannot simply disappear; slides 29–32 give two methods, deletion by merging and deletion by copying.</li>
</ol>
<p>All three cases start the same way: find the node <code>p</code> <em>and its parent</em> <code>f</code> — the loop of the insert code, stopping when <code>p.info == x</code>. The program only classifies, on the tree built on slide 25:</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class DeleteCases {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void classify(int x) {                    // step 1 of EVERY deletion: find p and its parent f
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) { System.out.println("delete " + x + ": not in the tree -&gt; nothing to do"); return; }
        int kids = (p.left != null ? 1 : 0) + (p.right != null ? 1 : 0);
        String[] what = {"case 1 (leaf): the parent's link becomes null",
                         "case 2 (one child): the parent adopts that child",
                         "case 3 (two children): delete by merging or by copying"};
        String[] count = {"no child", "one child", "two children"};
        String parent = f == null ? "no parent (root)" : "parent " + f.info;
        System.out.println("delete " + x + ": " + count[kids] + ", " + parent + " -&gt; " + what[kids]);
    }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 35}) insert(x);
        for (int x : new int[] {20, 40, 30, 50, 99}) classify(x);
    }
}</code></pre>
<div class="out">delete 20: no child, parent 30 -&gt; case 1 (leaf): the parent's link becomes null<br>
delete 40: one child, parent 30 -&gt; case 2 (one child): the parent adopts that child<br>
delete 30: two children, parent 50 -&gt; case 3 (two children): delete by merging or by copying<br>
delete 50: two children, no parent (root) -&gt; case 3 (two children): delete by merging or by copying<br>
delete 99: not in the tree -&gt; nothing to do</div>
<table>
<thead><tr><th>Key</th><th>Children</th><th>Case</th><th>What will happen</th></tr></thead>
<tbody>
<tr><td>20</td><td>none</td><td>1</td><td><code>30.left = null</code></td></tr>
<tr><td>40</td><td>one (35)</td><td>2</td><td><code>30.right = 35</code></td></tr>
<tr><td>30</td><td>two (20, 40)</td><td>3</td><td>merging or copying</td></tr>
<tr><td>50</td><td>two, and it is the root</td><td>3</td><td>merging or copying; the root changes</td></tr>
<tr><td>99</td><td>—</td><td>—</td><td>not found, nothing to do</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> finding p and f is O(h); cases 1 and 2 then take O(1); case 3 adds one more walk down, O(h) again — so every deletion is O(h).</p>
<p class="meo">🧠 <strong>Remember:</strong> count the children first — 0, 1 or 2 — and the case, and the code, follow.</p>
<div class="pitfall">Keep the parent. Once you have walked down with <code>p</code> alone there is no way back up (the nodes have no parent link), so you can no longer change the link that points to <code>p</code>.</div>`,
        `<p class="y-chinh">🎯 Xoá một khoá khỏi BST có ba trường hợp, quyết định bởi số con của nút chứa khoá: không con (lá), một con, hoặc hai con.</p>
<ol>
<li><strong>Lá (leaf)</strong> — cắt nó đi: liên kết của cha thành <code>null</code>.</li>
<li><strong>Một con</strong> — cha nhận luôn đứa con đó, kèm cả cây con (subtree) của đứa con.</li>
<li><strong>Hai con</strong> — nút không thể biến mất đơn giản như vậy; slide 29–32 cho hai cách: xoá bằng hợp nhất (deletion by merging) và xoá bằng sao chép (deletion by copying).</li>
</ol>
<p>Cả ba trường hợp đều mở đầu giống nhau: tìm nút <code>p</code> <em>và cha của nó</em> <code>f</code> — chính vòng lặp của hàm chèn (insert), dừng khi <code>p.info == x</code>. Chương trình chỉ phân loại, trên cây đã dựng ở slide 25:</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class DeleteCases {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void classify(int x) {                    // bước 1 của MỌI phép xoá: tìm p và cha f của nó
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) { System.out.println("delete " + x + ": not in the tree -&gt; nothing to do"); return; }
        int kids = (p.left != null ? 1 : 0) + (p.right != null ? 1 : 0);
        String[] what = {"case 1 (leaf): the parent's link becomes null",
                         "case 2 (one child): the parent adopts that child",
                         "case 3 (two children): delete by merging or by copying"};
        String[] count = {"no child", "one child", "two children"};
        String parent = f == null ? "no parent (root)" : "parent " + f.info;
        System.out.println("delete " + x + ": " + count[kids] + ", " + parent + " -&gt; " + what[kids]);
    }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 35}) insert(x);
        for (int x : new int[] {20, 40, 30, 50, 99}) classify(x);
    }
}</code></pre>
<div class="out">delete 20: no child, parent 30 -&gt; case 1 (leaf): the parent's link becomes null<br>
delete 40: one child, parent 30 -&gt; case 2 (one child): the parent adopts that child<br>
delete 30: two children, parent 50 -&gt; case 3 (two children): delete by merging or by copying<br>
delete 50: two children, no parent (root) -&gt; case 3 (two children): delete by merging or by copying<br>
delete 99: not in the tree -&gt; nothing to do</div>
<table>
<thead><tr><th>Khoá</th><th>Số con</th><th>Trường hợp</th><th>Sẽ làm gì</th></tr></thead>
<tbody>
<tr><td>20</td><td>không</td><td>1</td><td><code>30.left = null</code></td></tr>
<tr><td>40</td><td>một (35)</td><td>2</td><td><code>30.right = 35</code></td></tr>
<tr><td>30</td><td>hai (20, 40)</td><td>3</td><td>merging hoặc copying</td></tr>
<tr><td>50</td><td>hai, và là gốc</td><td>3</td><td>merging hoặc copying; gốc sẽ đổi</td></tr>
<tr><td>99</td><td>—</td><td>—</td><td>không thấy, không làm gì</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> tìm p và f tốn O(h); trường hợp 1 và 2 sau đó chỉ O(1); trường hợp 3 phải đi xuống thêm một lượt nữa, lại O(h) — nên phép xoá nào cũng là O(h).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đếm số con trước — 0, 1 hay 2 — là biết trường hợp, biết luôn code.</p>
<div class="pitfall">Phải giữ nút cha. Một khi đã đi xuống chỉ với <code>p</code> thì không có đường quay lên (nút không có liên kết tới cha), nên bạn không còn sửa được liên kết đang trỏ tới <code>p</code>.</div>`],
      [28, 'Deletion - 2',
        `<p class="y-chinh">🎯 Cases 1 and 2 are pure relinking: a leaf is replaced by <code>null</code>, a node with one child by that child — either way the parent's link simply skips the deleted node.</p>
<p class="ghi-chu">The slide shows both cases as pictures (its only text is the captions "Deleting a leaf" and "Deleting a node with one child"); the example below is the lesson's own.</p>
<ul>
<li>Both cases fit in one line: <code>child = (p.left != null) ? p.left : p.right</code> — which is <code>null</code> for a leaf.</li>
<li>Then link the parent to <code>child</code> on the side where <code>p</code> was: <code>if (f.left == p) f.left = child; else f.right = child;</code>.</li>
<li>Deleting the root (<code>f == null</code>) just makes <code>child</code> the new root.</li>
<li>Why the BST rule survives: the child's subtree was already on the correct side of <code>f</code>, and it stays there.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class DeleteLeafOne {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void delete(int x) {                      // cases 1 and 2 only
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) return;                       // not found
        if (p.left != null &amp;&amp; p.right != null) return;   // two children: slides 29-32
        Node child = p.left != null ? p.left : p.right;  // null when p is a leaf
        if (f == null) root = child;                 // p is the root
        else if (f.left == p) f.left = child;        // p hangs on f's LEFT link
        else f.right = child;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 35}) insert(x);
        System.out.println("start                      : " + show(root));
        delete(20); System.out.println("delete 20 (leaf)           : " + show(root));
        delete(40); System.out.println("delete 40 (one child 35)   : " + show(root));
        delete(30); System.out.println("delete 30 (one child 35)   : " + show(root));
        root = null;
        for (int x : new int[] {10, 20, 15, 25}) insert(x);
        System.out.println("another tree               : " + show(root));
        delete(10); System.out.println("delete 10 (root, one child): " + show(root));
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 50(30(20,40(35,-)),70(60,80))<br>
delete 20 (leaf) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 50(30(-,40(35,-)),70(60,80))<br>
delete 40 (one child 35) &nbsp;&nbsp;: 50(30(-,35),70(60,80))<br>
delete 30 (one child 35) &nbsp;&nbsp;: 50(35,70(60,80))<br>
another tree &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 10(-,20(15,25))<br>
delete 10 (root, one child): 20(15,25)</div>
<table>
<thead><tr><th>Step</th><th>Delete</th><th>Case</th><th>Relinking</th><th>Tree afterwards</th></tr></thead>
<tbody>
<tr><td>1</td><td>20</td><td>leaf</td><td><code>30.left = null</code></td><td>50(30(–, 40(35, –)), 70(60, 80))</td></tr>
<tr><td>2</td><td>40</td><td>one child (35)</td><td><code>30.right = 35</code></td><td>50(30(–, 35), 70(60, 80))</td></tr>
<tr><td>3</td><td>30</td><td>one child (35)</td><td><code>50.left = 35</code></td><td>50(35, 70(60, 80))</td></tr>
<tr><td>4</td><td>10, the root</td><td>one child (20)</td><td><code>root = 20</code></td><td>20(15, 25)</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> O(h) for the search, O(1) for the relinking.</p>
<div class="pitfall">Test which side <code>p</code> hangs on with <code>f.left == p</code>; never assume it is a left child — deleting 40 above needs <code>f.right</code>. And handle the root (<code>f == null</code>), or deleting the root key throws a <code>NullPointerException</code>.</div>`,
        `<p class="y-chinh">🎯 Trường hợp 1 và 2 chỉ là nối lại liên kết: lá được thay bằng <code>null</code>, nút có một con được thay bằng chính đứa con đó — cách nào thì liên kết của cha cũng bỏ qua nút bị xoá.</p>
<p class="ghi-chu">Slide vẽ cả hai trường hợp bằng hình (chữ chỉ có hai chú thích "Deleting a leaf" — xoá một lá, và "Deleting a node with one child" — xoá nút có một con); ví dụ dưới đây là ví dụ của bài.</p>
<ul>
<li>Cả hai trường hợp gói trong một dòng: <code>child = (p.left != null) ? p.left : p.right</code> — bằng <code>null</code> khi p là lá.</li>
<li>Rồi nối cha với <code>child</code> ở đúng phía mà <code>p</code> từng đứng: <code>if (f.left == p) f.left = child; else f.right = child;</code>.</li>
<li>Xoá gốc (<code>f == null</code>) thì chỉ việc cho <code>child</code> làm gốc mới.</li>
<li>Vì sao luật BST vẫn đúng: cây con của đứa con vốn đã nằm đúng phía của <code>f</code>, và nó vẫn nằm ở đó.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class DeleteLeafOne {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void delete(int x) {                      // chỉ trường hợp 1 và 2
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) return;                       // không thấy
        if (p.left != null &amp;&amp; p.right != null) return;   // hai con: slide 29-32
        Node child = p.left != null ? p.left : p.right;  // bằng null khi p là lá
        if (f == null) root = child;                 // p là gốc
        else if (f.left == p) f.left = child;        // p treo ở liên kết TRÁI của f
        else f.right = child;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 35}) insert(x);
        System.out.println("start                      : " + show(root));
        delete(20); System.out.println("delete 20 (leaf)           : " + show(root));
        delete(40); System.out.println("delete 40 (one child 35)   : " + show(root));
        delete(30); System.out.println("delete 30 (one child 35)   : " + show(root));
        root = null;
        for (int x : new int[] {10, 20, 15, 25}) insert(x);
        System.out.println("another tree               : " + show(root));
        delete(10); System.out.println("delete 10 (root, one child): " + show(root));
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 50(30(20,40(35,-)),70(60,80))<br>
delete 20 (leaf) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 50(30(-,40(35,-)),70(60,80))<br>
delete 40 (one child 35) &nbsp;&nbsp;: 50(30(-,35),70(60,80))<br>
delete 30 (one child 35) &nbsp;&nbsp;: 50(35,70(60,80))<br>
another tree &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 10(-,20(15,25))<br>
delete 10 (root, one child): 20(15,25)</div>
<table>
<thead><tr><th>Bước</th><th>Xoá</th><th>Trường hợp</th><th>Nối lại</th><th>Cây sau đó</th></tr></thead>
<tbody>
<tr><td>1</td><td>20</td><td>lá</td><td><code>30.left = null</code></td><td>50(30(–, 40(35, –)), 70(60, 80))</td></tr>
<tr><td>2</td><td>40</td><td>một con (35)</td><td><code>30.right = 35</code></td><td>50(30(–, 35), 70(60, 80))</td></tr>
<tr><td>3</td><td>30</td><td>một con (35)</td><td><code>50.left = 35</code></td><td>50(35, 70(60, 80))</td></tr>
<tr><td>4</td><td>10, là gốc</td><td>một con (20)</td><td><code>root = 20</code></td><td>20(15, 25)</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> O(h) để tìm, O(1) để nối lại.</p>
<div class="pitfall">Kiểm <code>p</code> treo ở phía nào bằng <code>f.left == p</code>; đừng mặc định nó là con trái — xoá 40 ở trên phải dùng <code>f.right</code>. Và phải xử lý gốc (<code>f == null</code>), nếu không thì xoá đúng khoá ở gốc sẽ ném <code>NullPointerException</code>.</div>`],
      [29, 'Deletion by Merging - 1',
        `<p class="y-chinh">🎯 Deleting by merging makes one tree out of the two subtrees of the deleted node and attaches that tree to the node's parent.</p>
<p class="ghi-chu">Apart from this definition the slide is a figure; the steps and the example below are the lesson's own.</p>
<ul>
<li><strong>Why it works</strong>: every key of the right subtree is larger than every key of the left subtree, so the whole right subtree can hang below the <em>largest</em> node of the left subtree — its rightmost node, which has no right child.</li>
<li><strong>Step 1</strong>: in the left subtree, go right until there is no right child → <code>tmp</code>.</li>
<li><strong>Step 2</strong>: <code>tmp.right = p.right</code> — the right subtree now hangs below <code>tmp</code>.</li>
<li><strong>Step 3</strong>: the parent's link points to <code>p.left</code>, the root of the merged tree. (With at most one child there is nothing to merge: it is case 1 or 2.)</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class DeleteByMerging {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void deleteByMerging(int x) {
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) return;
        Node sub;                                    // the ONE tree that will take p's place
        if (p.right == null) sub = p.left;           // no right subtree: lift the left one
        else if (p.left == null) sub = p.right;      // no left subtree: lift the right one
        else {
            Node tmp = p.left;
            while (tmp.right != null) tmp = tmp.right;   // rightmost node of the left subtree
            System.out.println("  rightmost node of the left subtree of " + x + ": " + tmp.info);
            tmp.right = p.right;                     // hang the right subtree below it
            System.out.println("  " + tmp.info + ".right = " + p.right.info + " (the right subtree of " + x + ")");
            sub = p.left;                            // the merged tree starts at p.left
        }
        if (f == null) root = sub;
        else if (f.left == p) f.left = sub;
        else f.right = sub;
        System.out.println("  " + (f == null ? "root" : f.info + (f.left == sub ? ".left" : ".right")) + " = " + (sub == null ? "null" : "" + sub.info));
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }
    static String inorder(Node p) { return p == null ? "" : inorder(p.left) + p.info + " " + inorder(p.right); }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 10, 25}) insert(x);
        System.out.println("before: " + show(root) + "   height " + height(root));
        System.out.println("deleteByMerging(30):");
        deleteByMerging(30);
        System.out.println("after : " + show(root) + "   height " + height(root));
        System.out.println("inorder after: " + inorder(root));
    }
}</code></pre>
<div class="out">before: 50(30(20(10,25),40),70(60,80)) &nbsp;&nbsp;height 4<br>
deleteByMerging(30):<br>
&nbsp;&nbsp;rightmost node of the left subtree of 30: 25<br>
&nbsp;&nbsp;25.right = 40 (the right subtree of 30)<br>
&nbsp;&nbsp;50.left = 20<br>
after : 50(20(10,25(-,40)),70(60,80)) &nbsp;&nbsp;height 4<br>
inorder after: 10 20 25 40 50 60 70 80</div>
<pre><code class="language-plaintext">before                          after deleteByMerging(30)
         50                               50
       /    \\                           /    \\
     30      70                       20      70
    /  \\    /  \\                     /  \\    /  \\
  20    40 60   80                 10   25  60   80
 /  \\                                     \\
10   25                                    40</code></pre>
<p>The inorder after the deletion is still sorted (10 20 25 40 50 60 70 80): the BST rule holds. <strong>Big-O:</strong> finding p is O(h), finding the rightmost node is O(h) again, the relinking is O(1) → O(h).</p>
<div class="pitfall">"The rightmost node of the left subtree" means one step <em>left</em>, then <em>right</em> as far as possible (here 30 → 20 → 25). It is not "the right child of the left child": the walk may take many steps — or none, when the left child has no right child and is itself the rightmost node.</div>`,
        `<p class="y-chinh">🎯 Xoá bằng hợp nhất (deleting by merging) gộp hai cây con của nút bị xoá thành một cây, rồi gắn cây đó vào nút cha của nút bị xoá.</p>
<p class="ghi-chu">Ngoài câu định nghĩa này, slide là hình; các bước và ví dụ dưới đây là của bài.</p>
<ul>
<li><strong>Vì sao đúng</strong>: mọi khoá của cây con phải đều lớn hơn mọi khoá của cây con trái, nên cả cây con phải treo được xuống dưới nút <em>lớn nhất</em> của cây con trái — nút phải nhất (rightmost node) của nó, vốn không có con phải.</li>
<li><strong>Bước 1</strong>: trong cây con trái, đi sang phải tới khi không còn con phải → <code>tmp</code>.</li>
<li><strong>Bước 2</strong>: <code>tmp.right = p.right</code> — cây con phải giờ treo dưới <code>tmp</code>.</li>
<li><strong>Bước 3</strong>: liên kết của cha trỏ tới <code>p.left</code>, gốc của cây đã gộp. (Nếu p có tối đa một con thì chẳng có gì để gộp: đó là trường hợp 1 hoặc 2.)</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class DeleteByMerging {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void deleteByMerging(int x) {
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) return;
        Node sub;                                    // MỘT cây sẽ thế chỗ p
        if (p.right == null) sub = p.left;           // không có cây con phải: nâng cây con trái lên
        else if (p.left == null) sub = p.right;      // không có cây con trái: nâng cây con phải lên
        else {
            Node tmp = p.left;
            while (tmp.right != null) tmp = tmp.right;   // nút phải nhất của cây con trái
            System.out.println("  rightmost node of the left subtree of " + x + ": " + tmp.info);
            tmp.right = p.right;                     // treo cây con phải xuống dưới nó
            System.out.println("  " + tmp.info + ".right = " + p.right.info + " (the right subtree of " + x + ")");
            sub = p.left;                            // cây đã gộp bắt đầu từ p.left
        }
        if (f == null) root = sub;
        else if (f.left == p) f.left = sub;
        else f.right = sub;
        System.out.println("  " + (f == null ? "root" : f.info + (f.left == sub ? ".left" : ".right")) + " = " + (sub == null ? "null" : "" + sub.info));
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }
    static String inorder(Node p) { return p == null ? "" : inorder(p.left) + p.info + " " + inorder(p.right); }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 10, 25}) insert(x);
        System.out.println("before: " + show(root) + "   height " + height(root));
        System.out.println("deleteByMerging(30):");
        deleteByMerging(30);
        System.out.println("after : " + show(root) + "   height " + height(root));
        System.out.println("inorder after: " + inorder(root));
    }
}</code></pre>
<div class="out">before: 50(30(20(10,25),40),70(60,80)) &nbsp;&nbsp;height 4<br>
deleteByMerging(30):<br>
&nbsp;&nbsp;rightmost node of the left subtree of 30: 25<br>
&nbsp;&nbsp;25.right = 40 (the right subtree of 30)<br>
&nbsp;&nbsp;50.left = 20<br>
after : 50(20(10,25(-,40)),70(60,80)) &nbsp;&nbsp;height 4<br>
inorder after: 10 20 25 40 50 60 70 80</div>
<pre><code class="language-plaintext">trước                           sau deleteByMerging(30)
         50                               50
       /    \\                           /    \\
     30      70                       20      70
    /  \\    /  \\                     /  \\    /  \\
  20    40 60   80                 10   25  60   80
 /  \\                                     \\
10   25                                    40</code></pre>
<p>Duyệt trung thứ tự (inorder) sau khi xoá vẫn tăng dần (10 20 25 40 50 60 70 80): luật BST được giữ. <strong>Big-O:</strong> tìm p tốn O(h), tìm nút phải nhất lại O(h), nối lại O(1) → O(h).</p>
<div class="pitfall">"Nút phải nhất của cây con trái" nghĩa là sang <em>trái</em> một bước, rồi sang <em>phải</em> hết mức (ở đây 30 → 20 → 25). Không phải "con phải của con trái": đường đi có thể nhiều bước — hoặc không bước nào, khi con trái không có con phải và chính nó là nút phải nhất.</div>`],
      [30, 'Deletion by Merging - 2',
        `<p class="y-chinh">🎯 Merging keeps the BST valid but not its shape: after deleting by merging, the height of the tree can be (a) extended or (b) reduced.</p>
<p class="ghi-chu">The slide's two cases are pictures; the program reproduces both effects on the lesson's own trees.</p>
<ul>
<li><strong>(a) Extended</strong>: the whole right subtree is pushed below the rightmost node of the left subtree, which may already be deep — so the height can grow.</li>
<li><strong>(b) Reduced</strong>: when the left subtree was the tall one and the right subtree fits below its rightmost node without going deeper, the deleted level simply disappears — the height shrinks.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class MergeHeight {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void deleteByMerging(int x) {             // same method as slide 29 (without the trace)
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) return;
        Node sub;
        if (p.right == null) sub = p.left;
        else if (p.left == null) sub = p.right;
        else {
            Node tmp = p.left;
            while (tmp.right != null) tmp = tmp.right;
            tmp.right = p.right;
            sub = p.left;
        }
        if (f == null) root = sub;
        else if (f.left == p) f.left = sub;
        else f.right = sub;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    static void demo(String label, int[] keys, int x) {
        root = null;
        for (int k : keys) insert(k);
        String before = show(root);
        int h = height(root);
        deleteByMerging(x);
        System.out.println(label + " delete " + x + ": " + before + " (height " + h + ")  -&gt;  " + show(root) + " (height " + height(root) + ")");
    }

    public static void main(String[] args) {
        demo("(a) extended:", new int[] {50, 30, 70, 20, 40, 60, 80}, 50);
        demo("(b) reduced: ", new int[] {50, 30, 70, 20, 10}, 50);
    }
}</code></pre>
<div class="out">(a) extended: delete 50: 50(30(20,40),70(60,80)) (height 3) &nbsp;-&gt; &nbsp;30(20,40(-,70(60,80))) (height 4)<br>
(b) reduced: &nbsp;delete 50: 50(30(20(10,-),-),70) (height 4) &nbsp;-&gt; &nbsp;30(20(10,-),70) (height 3)</div>
<pre><code class="language-plaintext">(a) before: height 3          after deleting 50: height 4
        50                           30
      /    \\                        /  \\
    30      70                    20    40
   /  \\    /  \\                           \\
 20    40 60   80                          70
                                          /  \\
                                        60    80

(b) before: height 4          after deleting 50: height 3
        50                           30
       /  \\                         /  \\
     30    70                     20    70
    /                            /
  20                           10
  /
10</code></pre>
<p>Repeated merging can therefore unbalance a tree step by step, and every later operation pays for the extra height. Deletion by copying (next slide) never makes the tree taller. A single merging deletion is still O(h).</p>
<p>A mirror version is equally valid: hang the <em>left</em> subtree below the leftmost (smallest) node of the right subtree, and let the parent adopt <code>p.right</code>. Use the version the exam asks for; the slide's is "rightmost node of the left subtree".</p>
<p class="dap-an">✅ <strong>Does deleting by merging always make a tree shorter?</strong> No — case (a) shows it can make the tree one level taller (3 → 4), even though a node was removed.</p>
<div class="pitfall">When a question asks for "the height after deleting X by merging", redraw the tree. The quick reflex "one node fewer, so the height is the same or smaller" is exactly wrong here.</div>`,
        `<p class="y-chinh">🎯 Hợp nhất (merging) giữ cây vẫn là BST nhưng không giữ hình dạng: sau khi xoá bằng hợp nhất, chiều cao của cây có thể (a) tăng lên hoặc (b) giảm xuống.</p>
<p class="ghi-chu">Hai trường hợp trên slide là hình; chương trình tái hiện cả hai hiệu ứng trên các cây của bài.</p>
<ul>
<li><strong>(a) Tăng (extended)</strong>: cả cây con phải bị đẩy xuống dưới nút phải nhất của cây con trái, nút này có thể đã nằm sâu sẵn — nên chiều cao có thể tăng.</li>
<li><strong>(b) Giảm (reduced)</strong>: khi cây con trái là nhánh cao và cây con phải treo xuống dưới nút phải nhất của nó mà không sâu thêm, thì mức của nút bị xoá biến mất luôn — chiều cao giảm.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class MergeHeight {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void deleteByMerging(int x) {             // cùng hàm như slide 29 (bỏ phần in vết)
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) return;
        Node sub;
        if (p.right == null) sub = p.left;
        else if (p.left == null) sub = p.right;
        else {
            Node tmp = p.left;
            while (tmp.right != null) tmp = tmp.right;
            tmp.right = p.right;
            sub = p.left;
        }
        if (f == null) root = sub;
        else if (f.left == p) f.left = sub;
        else f.right = sub;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    static void demo(String label, int[] keys, int x) {
        root = null;
        for (int k : keys) insert(k);
        String before = show(root);
        int h = height(root);
        deleteByMerging(x);
        System.out.println(label + " delete " + x + ": " + before + " (height " + h + ")  -&gt;  " + show(root) + " (height " + height(root) + ")");
    }

    public static void main(String[] args) {
        demo("(a) extended:", new int[] {50, 30, 70, 20, 40, 60, 80}, 50);
        demo("(b) reduced: ", new int[] {50, 30, 70, 20, 10}, 50);
    }
}</code></pre>
<div class="out">(a) extended: delete 50: 50(30(20,40),70(60,80)) (height 3) &nbsp;-&gt; &nbsp;30(20,40(-,70(60,80))) (height 4)<br>
(b) reduced: &nbsp;delete 50: 50(30(20(10,-),-),70) (height 4) &nbsp;-&gt; &nbsp;30(20(10,-),70) (height 3)</div>
<pre><code class="language-plaintext">(a) trước: cao 3              sau khi xoá 50: cao 4
        50                           30
      /    \\                        /  \\
    30      70                    20    40
   /  \\    /  \\                           \\
 20    40 60   80                          70
                                          /  \\
                                        60    80

(b) trước: cao 4              sau khi xoá 50: cao 3
        50                           30
       /  \\                         /  \\
     30    70                     20    70
    /                            /
  20                           10
  /
10</code></pre>
<p>Vì vậy hợp nhất lặp đi lặp lại có thể làm cây lệch dần từng bước, và mọi thao tác về sau phải trả giá cho phần chiều cao dư. Xoá bằng sao chép (copying, slide sau) không bao giờ làm cây cao lên. Một lần xoá bằng hợp nhất vẫn là O(h).</p>
<p>Bản đối xứng cũng đúng y như vậy: treo cây con <em>trái</em> xuống dưới nút trái nhất (nhỏ nhất) của cây con phải, và cho cha nhận <code>p.right</code>. Đề yêu cầu bản nào thì dùng bản đó; bản của slide là "nút phải nhất của cây con trái".</p>
<p class="dap-an">✅ <strong>Xoá bằng hợp nhất có luôn làm cây thấp đi không?</strong> Không — trường hợp (a) cho thấy cây có thể cao thêm một mức (3 → 4), dù vừa mất một nút.</p>
<div class="pitfall">Đề hỏi "chiều cao sau khi xoá X bằng merging" thì hãy vẽ lại cây. Phản xạ nhanh "bớt một nút thì chiều cao giữ nguyên hoặc giảm" sai đúng ở chỗ này.</div>`],
      [31, 'Deletion by Copying - 1',
        `<p class="y-chinh">🎯 Deleting by copying turns the hard case into an easy one: copy the key of the node's immediate predecessor into it, then delete the predecessor's node — which has at most one child.</p>
<ul>
<li>If the node has two children, the problem can be reduced (slide) to "the node is a leaf" or "the node has only one non-empty child".</li>
<li><strong>Solution</strong> (slide): replace the key being deleted with its immediate predecessor (or successor).</li>
<li><strong>Predecessor</strong> (slide): the key in the rightmost node of the left subtree — the largest key smaller than x. That node has no right child, so removing it is case 1 or 2.</li>
<li>Only a key is copied: p keeps its place and its links, so the shape above and around p does not change.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class DeleteByCopying {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void deleteByCopying(int x) {
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) return;
        if (p.left != null &amp;&amp; p.right != null) {     // two children: reduce to case 1 or 2
            Node prev = p, tmp = p.left;
            while (tmp.right != null) { prev = tmp; tmp = tmp.right; }   // predecessor = rightmost of the left subtree
            System.out.println("  predecessor of " + x + ": " + tmp.info + " (its parent: " + prev.info + ")");
            p.info = tmp.info;                       // copy the key into p; p's links stay as they are
            if (prev == p) prev.left = tmp.left;     // tmp was p's own left child
            else prev.right = tmp.left;              // tmp has no right child: splice it out
            System.out.println("  copy " + tmp.info + " into the node of " + x + ", then unlink the old node " + tmp.info);
            return;
        }
        Node child = p.left != null ? p.left : p.right;   // 0 or 1 child: as on slide 28
        if (f == null) root = child;
        else if (f.left == p) f.left = child;
        else f.right = child;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 10, 25}) insert(x);
        System.out.println("before: " + show(root) + "   height " + height(root));
        for (int x : new int[] {30, 50}) {
            System.out.println("deleteByCopying(" + x + "):");
            deleteByCopying(x);
            System.out.println("after : " + show(root) + "   height " + height(root));
        }
    }
}</code></pre>
<div class="out">before: 50(30(20(10,25),40),70(60,80)) &nbsp;&nbsp;height 4<br>
deleteByCopying(30):<br>
&nbsp;&nbsp;predecessor of 30: 25 (its parent: 20)<br>
&nbsp;&nbsp;copy 25 into the node of 30, then unlink the old node 25<br>
after : 50(25(20(10,-),40),70(60,80)) &nbsp;&nbsp;height 4<br>
deleteByCopying(50):<br>
&nbsp;&nbsp;predecessor of 50: 40 (its parent: 25)<br>
&nbsp;&nbsp;copy 40 into the node of 50, then unlink the old node 40<br>
after : 40(25(20(10,-),-),70(60,80)) &nbsp;&nbsp;height 4</div>
<table>
<thead><tr><th>Delete</th><th>Predecessor tmp (its parent prev)</th><th>Copy</th><th>Unlink tmp</th><th>Tree afterwards</th></tr></thead>
<tbody>
<tr><td>30</td><td>25 (prev = 20)</td><td>the node of 30 gets 25</td><td><code>20.right = 25.left</code> (null)</td><td>50(25(20(10, –), 40), 70(60, 80))</td></tr>
<tr><td>50</td><td>40 (prev = 25)</td><td>the root gets 40</td><td><code>25.right = 40.left</code> (null)</td><td>40(25(20(10, –), –), 70(60, 80))</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> O(h) to find p, O(h) to find the predecessor, O(1) to copy and unlink → O(h). The height never increases (4 before and after both deletions above).</p>
<p>The successor works too: the leftmost node of the right subtree, the smallest key larger than x. The old lesson 4.5 uses the successor, this slide the predecessor — a PE task usually says which one it wants.</p>
<div class="pitfall">After copying, remove the <em>predecessor's</em> node, not p — and link around it through its <em>left</em> child (<code>prev.right = tmp.left</code>): tmp is a rightmost node, so its right link is always <code>null</code>, but its left subtree must not be lost.</div>`,
        `<p class="y-chinh">🎯 Xoá bằng sao chép (deleting by copying) biến trường hợp khó thành trường hợp dễ: chép khoá của nút liền trước (immediate predecessor) vào nút cần xoá, rồi xoá nút liền trước đó — nút này có nhiều nhất một con.</p>
<ul>
<li>Nếu nút có hai con, bài toán đưa được (slide) về "nút là lá" hoặc "nút chỉ có một con khác rỗng".</li>
<li><strong>Cách giải</strong> (slide): thay khoá cần xoá bằng khoá liền trước (predecessor) của nó (hoặc khoá liền sau — successor).</li>
<li><strong>Khoá liền trước</strong> (slide): khoá ở nút phải nhất (rightmost node) của cây con trái — khoá lớn nhất còn nhỏ hơn x. Nút đó không có con phải, nên xoá nó là trường hợp 1 hoặc 2.</li>
<li>Chỉ chép khoá: p giữ nguyên chỗ và các liên kết, nên hình dạng cây phía trên và xung quanh p không đổi.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class DeleteByCopying {
    static Node root;

    static void insert(int x) {
        Node f = null, p = root;
        while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (f == null) root = new Node(x);
        else if (x &lt; f.info) f.left = new Node(x);
        else f.right = new Node(x);
    }

    static void deleteByCopying(int x) {
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info != x) { f = p; p = x &lt; p.info ? p.left : p.right; }
        if (p == null) return;
        if (p.left != null &amp;&amp; p.right != null) {     // hai con: đưa về trường hợp 1 hoặc 2
            Node prev = p, tmp = p.left;
            while (tmp.right != null) { prev = tmp; tmp = tmp.right; }   // nút liền trước = nút phải nhất của cây con trái
            System.out.println("  predecessor of " + x + ": " + tmp.info + " (its parent: " + prev.info + ")");
            p.info = tmp.info;                       // chép khoá vào p; các liên kết của p giữ nguyên
            if (prev == p) prev.left = tmp.left;     // tmp chính là con trái của p
            else prev.right = tmp.left;              // tmp không có con phải: nối tắt qua nó
            System.out.println("  copy " + tmp.info + " into the node of " + x + ", then unlink the old node " + tmp.info);
            return;
        }
        Node child = p.left != null ? p.left : p.right;   // 0 hoặc 1 con: như slide 28
        if (f == null) root = child;
        else if (f.left == p) f.left = child;
        else f.right = child;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    public static void main(String[] args) {
        for (int x : new int[] {50, 30, 70, 20, 40, 60, 80, 10, 25}) insert(x);
        System.out.println("before: " + show(root) + "   height " + height(root));
        for (int x : new int[] {30, 50}) {
            System.out.println("deleteByCopying(" + x + "):");
            deleteByCopying(x);
            System.out.println("after : " + show(root) + "   height " + height(root));
        }
    }
}</code></pre>
<div class="out">before: 50(30(20(10,25),40),70(60,80)) &nbsp;&nbsp;height 4<br>
deleteByCopying(30):<br>
&nbsp;&nbsp;predecessor of 30: 25 (its parent: 20)<br>
&nbsp;&nbsp;copy 25 into the node of 30, then unlink the old node 25<br>
after : 50(25(20(10,-),40),70(60,80)) &nbsp;&nbsp;height 4<br>
deleteByCopying(50):<br>
&nbsp;&nbsp;predecessor of 50: 40 (its parent: 25)<br>
&nbsp;&nbsp;copy 40 into the node of 50, then unlink the old node 40<br>
after : 40(25(20(10,-),-),70(60,80)) &nbsp;&nbsp;height 4</div>
<table>
<thead><tr><th>Xoá</th><th>Nút liền trước tmp (cha của nó là prev)</th><th>Chép</th><th>Gỡ tmp</th><th>Cây sau đó</th></tr></thead>
<tbody>
<tr><td>30</td><td>25 (prev = 20)</td><td>nút của 30 nhận 25</td><td><code>20.right = 25.left</code> (null)</td><td>50(25(20(10, –), 40), 70(60, 80))</td></tr>
<tr><td>50</td><td>40 (prev = 25)</td><td>gốc nhận 40</td><td><code>25.right = 40.left</code> (null)</td><td>40(25(20(10, –), –), 70(60, 80))</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> O(h) để tìm p, O(h) để tìm nút liền trước, O(1) để chép và gỡ → O(h). Chiều cao không bao giờ tăng (trước và sau cả hai lần xoá ở trên đều là 4).</p>
<p>Dùng khoá liền sau (successor) cũng được: nút trái nhất của cây con phải, khoá nhỏ nhất còn lớn hơn x. Bài cũ 4.5 dùng successor, slide này dùng predecessor — đề PE thường nói rõ muốn cách nào.</p>
<div class="pitfall">Chép xong thì gỡ nút của <em>khoá liền trước</em>, không phải p — và nối vòng qua nó bằng con <em>trái</em> của nó (<code>prev.right = tmp.left</code>): tmp là nút phải nhất nên liên kết phải luôn là <code>null</code>, nhưng cây con trái của nó không được để mất.</div>`],
      [32, 'Deletion by Copying - 2',
        `<p class="y-chinh">🎯 Copying against merging on the same tree, and the one special case of copying: when the left child has no right child, it is itself the predecessor.</p>
<p class="ghi-chu">The slide is a figure captioned "Deleting by copying"; the comparison below is the lesson's own.</p>
<ul>
<li><strong>Tree A</strong>, delete 30: merging hangs 40(35, 45) below 25 and the height grows from 4 to 5; copying moves 25 up into the node of 30 and the height stays 4.</li>
<li><strong>Tree B</strong>, delete 30: the left child 20 has no right child, so the walk to the predecessor takes zero steps — <code>tmp = p.left</code> and <code>prev == p</code>. The unlink must then be <code>p.left = tmp.left</code>.</li>
<li>The buggy version always writes <code>prev.right = tmp.left</code>; with <code>prev == p</code> that overwrites p's right link — the subtree 40 is lost and 20 appears twice.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class CopyVsMerge {
    static Node build(int[] keys) {                  // plain BST insertion
        Node root = null;
        for (int x : keys) {
            Node f = null, p = root;
            while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
            if (f == null) root = new Node(x);
            else if (x &lt; f.info) f.left = new Node(x);
            else f.right = new Node(x);
        }
        return root;
    }

    // delete the LEFT child of parent (a node with two children)
    static void merge(Node parent) {
        Node p = parent.left, tmp = p.left;
        while (tmp.right != null) tmp = tmp.right;
        tmp.right = p.right;
        parent.left = p.left;
    }

    static void copy(Node parent, boolean buggy) {
        Node p = parent.left, prev = p, tmp = p.left;
        while (tmp.right != null) { prev = tmp; tmp = tmp.right; }
        p.info = tmp.info;
        if (prev == p &amp;&amp; !buggy) prev.left = tmp.left;    // the special case
        else prev.right = tmp.left;                  // the buggy version always takes this line
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    public static void main(String[] args) {
        int[] a = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
        Node t = build(a);
        System.out.println("tree A        : " + show(t) + "   height " + height(t));
        t = build(a); merge(t);
        System.out.println("merge  del 30 : " + show(t) + "   height " + height(t));
        t = build(a); copy(t, false);
        System.out.println("copy   del 30 : " + show(t) + "   height " + height(t));
        int[] b = {50, 30, 70, 20, 40, 10};
        t = build(b);
        System.out.println("tree B        : " + show(t) + "   (20 has no right child)");
        t = build(b); copy(t, false);
        System.out.println("copy   del 30 : " + show(t) + "   prev == p, so p.left = tmp.left");
        t = build(b); copy(t, true);
        System.out.println("buggy  del 30 : " + show(t) + "   40 is lost, 20 appears twice");
    }
}</code></pre>
<div class="out">tree A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 50(30(20(10,25),40(35,45)),70(60,80)) &nbsp;&nbsp;height 4<br>
merge &nbsp;del 30 : 50(20(10,25(-,40(35,45))),70(60,80)) &nbsp;&nbsp;height 5<br>
copy &nbsp;&nbsp;del 30 : 50(25(20(10,-),40(35,45)),70(60,80)) &nbsp;&nbsp;height 4<br>
tree B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 50(30(20(10,-),40),70) &nbsp;&nbsp;(20 has no right child)<br>
copy &nbsp;&nbsp;del 30 : 50(20(10,40),70) &nbsp;&nbsp;prev == p, so p.left = tmp.left<br>
buggy &nbsp;del 30 : 50(20(20(10,-),10),70) &nbsp;&nbsp;40 is lost, 20 appears twice</div>
<pre><code class="language-plaintext">tree B               copying, correct      buggy: prev.right = tmp.left
       50                   50                      50
      /  \\                 /  \\                    /  \\
    30    70             20    70                20    70
   /  \\                 /  \\                    /  \\
 20    40             10    40                20    10
 /                                           /
10                                         10</code></pre>
<p><strong>Big-O:</strong> both methods cost O(h) per deletion; the difference is the shape they leave. Copying never raises the height, which is why it is the usual choice.</p>
<p>A known side effect: always taking the predecessor keeps shrinking left subtrees, so after many deletions the tree leans to the right; some implementations alternate predecessor and successor.</p>
<div class="pitfall">The special case <code>prev == p</code> is a classic PE bug: the method works for most keys and silently corrupts the tree for the others. Always test your deletion on a node whose left child has no right child.</div>`,
        `<p class="y-chinh">🎯 Đặt sao chép (copying) cạnh hợp nhất (merging) trên cùng một cây, và trường hợp đặc biệt duy nhất của sao chép: khi con trái không có con phải thì chính nó là nút liền trước (predecessor).</p>
<p class="ghi-chu">Slide là hình có chú thích "Deleting by copying" (xoá bằng sao chép); phần so sánh dưới đây là ví dụ của bài.</p>
<ul>
<li><strong>Cây A</strong>, xoá 30: merging treo 40(35, 45) xuống dưới 25 và chiều cao tăng từ 4 lên 5; copying đưa 25 lên nút của 30 và chiều cao giữ nguyên 4.</li>
<li><strong>Cây B</strong>, xoá 30: con trái 20 không có con phải, nên đường tới nút liền trước dài 0 bước — <code>tmp = p.left</code> và <code>prev == p</code>. Khi đó phải gỡ bằng <code>p.left = tmp.left</code>.</li>
<li>Bản lỗi (buggy) luôn viết <code>prev.right = tmp.left</code>; với <code>prev == p</code> lệnh đó ghi đè liên kết phải của p — cây con 40 bị mất và 20 xuất hiện hai lần.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; left = right = null; }
}

public class CopyVsMerge {
    static Node build(int[] keys) {                  // chèn BST bình thường
        Node root = null;
        for (int x : keys) {
            Node f = null, p = root;
            while (p != null) { f = p; p = x &lt; p.info ? p.left : p.right; }
            if (f == null) root = new Node(x);
            else if (x &lt; f.info) f.left = new Node(x);
            else f.right = new Node(x);
        }
        return root;
    }

    // xoá con TRÁI của parent (nút có hai con)
    static void merge(Node parent) {
        Node p = parent.left, tmp = p.left;
        while (tmp.right != null) tmp = tmp.right;
        tmp.right = p.right;
        parent.left = p.left;
    }

    static void copy(Node parent, boolean buggy) {
        Node p = parent.left, prev = p, tmp = p.left;
        while (tmp.right != null) { prev = tmp; tmp = tmp.right; }
        p.info = tmp.info;
        if (prev == p &amp;&amp; !buggy) prev.left = tmp.left;    // trường hợp đặc biệt
        else prev.right = tmp.left;                  // bản lỗi luôn chạy dòng này
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    public static void main(String[] args) {
        int[] a = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
        Node t = build(a);
        System.out.println("tree A        : " + show(t) + "   height " + height(t));
        t = build(a); merge(t);
        System.out.println("merge  del 30 : " + show(t) + "   height " + height(t));
        t = build(a); copy(t, false);
        System.out.println("copy   del 30 : " + show(t) + "   height " + height(t));
        int[] b = {50, 30, 70, 20, 40, 10};
        t = build(b);
        System.out.println("tree B        : " + show(t) + "   (20 has no right child)");
        t = build(b); copy(t, false);
        System.out.println("copy   del 30 : " + show(t) + "   prev == p, so p.left = tmp.left");
        t = build(b); copy(t, true);
        System.out.println("buggy  del 30 : " + show(t) + "   40 is lost, 20 appears twice");
    }
}</code></pre>
<div class="out">tree A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 50(30(20(10,25),40(35,45)),70(60,80)) &nbsp;&nbsp;height 4<br>
merge &nbsp;del 30 : 50(20(10,25(-,40(35,45))),70(60,80)) &nbsp;&nbsp;height 5<br>
copy &nbsp;&nbsp;del 30 : 50(25(20(10,-),40(35,45)),70(60,80)) &nbsp;&nbsp;height 4<br>
tree B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 50(30(20(10,-),40),70) &nbsp;&nbsp;(20 has no right child)<br>
copy &nbsp;&nbsp;del 30 : 50(20(10,40),70) &nbsp;&nbsp;prev == p, so p.left = tmp.left<br>
buggy &nbsp;del 30 : 50(20(20(10,-),10),70) &nbsp;&nbsp;40 is lost, 20 appears twice</div>
<pre><code class="language-plaintext">cây B                copying, đúng         bản lỗi: prev.right = tmp.left
       50                   50                      50
      /  \\                 /  \\                    /  \\
    30    70             20    70                20    70
   /  \\                 /  \\                    /  \\
 20    40             10    40                20    10
 /                                           /
10                                         10</code></pre>
<p><strong>Big-O:</strong> cả hai cách đều tốn O(h) mỗi lần xoá; khác nhau ở hình dạng cây để lại. Sao chép không bao giờ làm cây cao lên, vì thế nó thường được chọn.</p>
<p>Một tác dụng phụ đã biết: lần nào cũng lấy khoá liền trước thì các cây con trái cứ nhỏ dần, sau nhiều lần xoá cây lệch về bên phải; một số cài đặt luân phiên dùng predecessor và successor (khoá liền sau).</p>
<div class="pitfall">Trường hợp đặc biệt <code>prev == p</code> là lỗi PE kinh điển: hàm chạy đúng với đa số khoá và âm thầm làm hỏng cây với số còn lại. Luôn thử hàm xoá trên một nút có con trái không có con phải.</div>`],
      [33, 'Summary',
        `<p class="y-chinh">🎯 The deck in one breath: a tree is a hierarchy; a binary tree gives every node two named places for children; a binary search tree adds the order rule that lets search, insertion and deletion follow a single path.</p>
<table>
<thead><tr><th>Topic on the slide</th><th>Keep in mind</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>What is a tree</td><td>root, parent and children, recursive definition</td><td>—</td></tr>
<tr><td>Terminology, examples</td><td>level and height: the slide counts from 1, the textbook from 0; path length = arcs</td><td>—</td></tr>
<tr><td>Ordered trees</td><td>the children have a first, second…</td><td>—</td></tr>
<tr><td>Tree traversals</td><td>preorder, postorder, breadth-first (queue); binary: NLR, LNR, LRN</td><td>O(n)</td></tr>
<tr><td>Binary trees</td><td>at most 2 children; proper; complete (slide) = every level full</td><td>—</td></tr>
<tr><td>Implementing binary trees</td><td>array with index fields (fixed size) or linked nodes</td><td>O(1) per node</td></tr>
<tr><td>Binary search tree</td><td>left &lt; node &lt; right for whole subtrees; inorder is sorted</td><td>search O(h)</td></tr>
<tr><td>Insertion</td><td>search for the empty link; the new key becomes a leaf; duplicates are rejected</td><td>O(h)</td></tr>
<tr><td>Deletion</td><td>leaf or one child: relink; two children: merging or copying</td><td>O(h)</td></tr>
</tbody>
</table>
<p>h is the height: about log₂ n when the tree is balanced, up to n when it degenerates — the problem that deck 4B-Trees2 solves.</p>
<p>The two deletion methods side by side: merging may change the height either way; copying never increases it.</p>
<p>For the PE, the minimum to type from memory: <code>Node</code>, <code>BSTree</code> with <code>insert</code> (slide 26), the three traversals (slide 21), <code>breadth</code> (slide 20), <code>search</code> (slide 24) and both deletions (slides 29 and 31).</p>
<p class="dap-an">✅ <strong>"What is a tree?" — the first line of the summary, answered in one sentence:</strong> either empty, or a root together with child trees, so that every node except the root has exactly one parent.</p>
<p class="meo">🧠 <strong>Remember:</strong> <strong>O(h), not O(log n)</strong> — every BST operation walks one root-to-leaf path, and only a balanced tree keeps that path short.</p>`,
        `<p class="y-chinh">🎯 Cả bộ slide trong một hơi: cây là một hệ phân cấp; cây nhị phân cho mỗi nút hai chỗ có tên cho con; cây nhị phân tìm kiếm thêm luật thứ tự để tìm kiếm, chèn, xoá chỉ đi theo một con đường.</p>
<table>
<thead><tr><th>Chủ đề trên slide</th><th>Cần nhớ</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>Cây là gì</td><td>gốc (root), cha và con, định nghĩa đệ quy</td><td>—</td></tr>
<tr><td>Thuật ngữ, ví dụ</td><td>mức (level) và chiều cao (height): slide đếm từ 1, sách đếm từ 0; độ dài đường đi = số cạnh</td><td>—</td></tr>
<tr><td>Cây có thứ tự (ordered tree)</td><td>các con có thứ nhất, thứ hai…</td><td>—</td></tr>
<tr><td>Duyệt cây (traversal)</td><td>tiền thứ tự, hậu thứ tự, theo chiều rộng (hàng đợi); cây nhị phân: NLR, LNR, LRN</td><td>O(n)</td></tr>
<tr><td>Cây nhị phân</td><td>tối đa 2 con; proper = mọi nút trong đủ 2 con; complete (theo slide) = mọi mức đều đầy</td><td>—</td></tr>
<tr><td>Cài đặt cây nhị phân</td><td>mảng có trường chỉ số (kích thước cố định) hoặc nút liên kết</td><td>O(1) mỗi nút</td></tr>
<tr><td>Cây nhị phân tìm kiếm (BST)</td><td>trái &lt; nút &lt; phải cho cả cây con; duyệt trung thứ tự (inorder) ra dãy tăng</td><td>tìm kiếm O(h)</td></tr>
<tr><td>Chèn (insertion)</td><td>tìm liên kết rỗng; khoá mới thành lá; khoá trùng bị từ chối</td><td>O(h)</td></tr>
<tr><td>Xoá (deletion)</td><td>lá hoặc một con: nối lại; hai con: merging hoặc copying</td><td>O(h)</td></tr>
</tbody>
</table>
<p>h là chiều cao: khoảng log₂ n khi cây cân bằng, tới n khi cây suy biến — vấn đề mà bộ 4B-Trees2 giải quyết.</p>
<p>Hai cách xoá đặt cạnh nhau: hợp nhất (merging) có thể làm chiều cao tăng hoặc giảm; sao chép (copying) không bao giờ làm tăng.</p>
<p>Cho PE, tối thiểu phải gõ được mà không nhìn: <code>Node</code>, <code>BSTree</code> với <code>insert</code> (slide 26), ba phép duyệt (slide 21), <code>breadth</code> (slide 20), <code>search</code> (slide 24) và cả hai cách xoá (slide 29 và 31).</p>
<p class="dap-an">✅ <strong>"Cây là gì?" — dòng đầu của phần tóm tắt, trả lời trong một câu:</strong> hoặc rỗng, hoặc là một gốc cùng các cây con, sao cho mọi nút trừ gốc có đúng một cha.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <strong>O(h), không phải O(log n)</strong> — mọi thao tác BST đi một con đường từ gốc xuống lá, và chỉ cây cân bằng mới giữ con đường đó ngắn.</p>`],
      [34, 'Reading at home',
        `<p class="y-chinh">🎯 Chapter 8 (Trees) and section 11.1 (Binary Search Trees) of the textbook cover this deck — read them after the slides, watching for the book's different conventions.</p>
<ul>
<li><strong>§8.1 General Trees (p.308)</strong> — §8.1.1 Tree Definitions and Properties (p.309), §8.1.2 The Tree Abstract Data Type (p.312): slides 3–7.</li>
<li><strong>§8.2 Binary Trees (p.317)</strong> — §8.2.1 The Binary Tree Abstract Data Type (p.319), §8.2.2 Properties of Binary Trees (p.321): slides 11–12.</li>
<li><strong>§8.3 Implementing Trees (p.323)</strong> — linked and array-based structures: slides 18–19.</li>
<li><strong>§8.4 Tree Traversal Algorithms (p.334)</strong> — preorder, postorder, breadth-first, inorder: slides 8–10 and 14–21.</li>
<li><strong>§11.1 Binary Search Trees (p.460)</strong> — §11.1.1 Searching Within a Binary Search Tree (p.461), §11.1.2 Insertions and Deletions (p.463): slides 22–32.</li>
</ul>
<p>Expect two differences: the book counts depth and height from 0 (slide 4), and its array-based representation numbers the positions level by level (root 0, children 2i + 1 and 2i + 2) instead of storing child indexes as slide 18 does. The book's classes are generic, with positions; the slides use plain <code>int</code> keys — the same algorithms in simpler packaging.</p>`,
        `<p class="y-chinh">🎯 Chương 8 (Trees) và mục 11.1 (Binary Search Trees) của sách giáo trình là phiên bản sách của bộ slide này — đọc sau khi học slide, để ý các quy ước khác của sách.</p>
<ul>
<li><strong>§8.1 General Trees (tr.308)</strong> — cây tổng quát: §8.1.1 định nghĩa và tính chất (tr.309), §8.1.2 kiểu dữ liệu trừu tượng cây — tree ADT (tr.312): ứng với slide 3–7.</li>
<li><strong>§8.2 Binary Trees (tr.317)</strong> — cây nhị phân: §8.2.1 ADT cây nhị phân (tr.319), §8.2.2 tính chất của cây nhị phân (tr.321): slide 11–12.</li>
<li><strong>§8.3 Implementing Trees (tr.323)</strong> — cài đặt cây bằng cấu trúc liên kết và bằng mảng: slide 18–19.</li>
<li><strong>§8.4 Tree Traversal Algorithms (tr.334)</strong> — các thuật toán duyệt cây: tiền thứ tự, hậu thứ tự, theo chiều rộng, trung thứ tự: slide 8–10 và 14–21.</li>
<li><strong>§11.1 Binary Search Trees (tr.460)</strong> — cây nhị phân tìm kiếm: §11.1.1 tìm kiếm trong BST (tr.461), §11.1.2 chèn và xoá (tr.463): slide 22–32.</li>
</ul>
<p>Hai chỗ khác nhau cần biết trước: sách đếm độ sâu (depth) và chiều cao (height) từ 0 (slide 4), và cách lưu cây bằng mảng của sách đánh số vị trí theo từng mức (gốc 0, hai con 2i + 1 và 2i + 2) thay vì lưu chỉ số của con như slide 18. Các lớp trong sách là kiểu tổng quát (generic) và dùng vị trí (position); slide dùng khoá <code>int</code> đơn giản — cùng thuật toán, gói gọn hơn.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Insert 40, 20, 60, 10, 30, 50, 70, 25 into an empty BST. Where does 25 end up?</li>
<li>In that tree, delete 40 by copying (predecessor). What is the tree now?</li>
<li>Starting again from the tree of question 1, delete 40 by merging instead. What is the new root?</li>
<li>Why does the slide's <code>insert</code> keep a second pointer <code>f</code>?</li>
<li>What is the worst-case time to search a BST with n nodes, and when does it happen?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 40 → 20 → 30, then it becomes the left child of 30: 40(20(10, 30(25, –)), 60(50, 70)). (2) The predecessor of 40 is 30, the rightmost node of the left subtree; copy it into the root and link 20.right to 25: 30(20(10, 25), 60(50, 70)). (3) 20, the root of the left subtree; 60(50, 70) hangs below 30, the rightmost node of the left subtree: 20(10, 30(25, 60(50, 70))). (4) When <code>p</code> becomes <code>null</code>, the new node must be linked to its parent — and <code>f</code> is that parent. (5) O(n), when the tree has degenerated into a stick, e.g. after inserting keys in sorted order.</p>
<p><strong>Next:</strong> the deep-dive lessons 4.4 Binary Search Trees and 4.5 BST insertion &amp; the three deletion cases below; then deck 4B-Trees2 — balancing, rotations, AVL trees and heaps, with the old lessons 4.6 AVL trees: the four rotations and 4.7 Building a heap: sift-up, sift-down, Floyd — and finally lesson 4.8 (practice, glossary, summary) before the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Chèn 40, 20, 60, 10, 30, 50, 70, 25 vào một BST rỗng. 25 nằm ở đâu?</li>
<li>Trên cây đó, xoá 40 bằng sao chép (copying, dùng khoá liền trước — predecessor). Cây bây giờ ra sao?</li>
<li>Bắt đầu lại từ cây của câu 1, xoá 40 bằng hợp nhất (merging). Gốc mới là nút nào?</li>
<li>Vì sao hàm <code>insert</code> của slide phải giữ thêm con trỏ <code>f</code>?</li>
<li>Thời gian tìm kiếm xấu nhất trên BST n nút là bao nhiêu, và xảy ra khi nào?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 40 → 20 → 30, rồi thành con trái của 30: 40(20(10, 30(25, –)), 60(50, 70)). (2) Khoá liền trước của 40 là 30, nút phải nhất của cây con trái; chép nó vào gốc rồi nối 20.right sang 25: 30(20(10, 25), 60(50, 70)). (3) 20, gốc của cây con trái; 60(50, 70) treo xuống dưới 30, nút phải nhất của cây con trái: 20(10, 30(25, 60(50, 70))). (4) Khi <code>p</code> thành <code>null</code>, nút mới phải được nối vào cha của nó — và <code>f</code> chính là nút cha đó. (5) O(n), khi cây đã suy biến thành cây "que", ví dụ sau khi chèn các khoá theo thứ tự đã sắp xếp.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu 4.4 Cây nhị phân tìm kiếm (BST) và 4.5 BST: chèn &amp; ba trường hợp xoá ngay bên dưới; rồi bộ 4B-Trees2 — cân bằng cây, phép xoay, cây AVL và đống (heap), cùng các bài cũ 4.6 Cây AVL: bốn phép xoay và 4.7 Dựng heap: sift-up, sift-down, Floyd (đẩy lên, đẩy xuống, cách dựng của Floyd) — và cuối cùng bài 4.8 (thực hành, thuật ngữ, tóm tắt) trước bài trắc nghiệm (quiz) của chương.</p>`),
    books([
      ['goodrich', 'Ch.8 Trees p.307 — §8.1 General Trees p.308 (§8.1.1 p.309, §8.1.2 p.312) · §8.2 Binary Trees p.317 (§8.2.1 p.319, §8.2.2 p.321) · §8.3 Implementing Trees p.323 · §8.4 Tree Traversal Algorithms p.334', 'Chương 8 Trees tr.307 — §8.1 General Trees tr.308 (§8.1.1 tr.309, §8.1.2 tr.312) · §8.2 Binary Trees tr.317 (§8.2.1 tr.319, §8.2.2 tr.321) · §8.3 Implementing Trees tr.323 · §8.4 Tree Traversal Algorithms tr.334'],
      ['goodrich', '§11.1 Binary Search Trees p.460 — §11.1.1 Searching Within a Binary Search Tree p.461 · §11.1.2 Insertions and Deletions p.463', '§11.1 Binary Search Trees tr.460 — §11.1.1 Searching Within a Binary Search Tree tr.461 · §11.1.2 Insertions and Deletions tr.463'],
    ]),
  ].join('\n'),
};

/* ───────── 4.C — 📑 Slide by slide · Trees, part 2a: balancing, rotations, AVL & heap basics (4B-Trees2, slides 1–16) ───────── */
const L_csd9_1 = {
  title: '4.C — 📑 Slide by slide · Trees, part 2a: balancing, rotations, AVL & heap basics (4B-Trees2, slides 1–16)|||4.C — 📑 Học theo từng slide · Cây, phần 2a: cân bằng, phép xoay, AVL & heap cơ bản (4B-Trees2, slide 1–16)',
  slug: 'csd201-slide-csd9-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–16 của bộ 4B-Trees2: cây cân bằng theo chiều cao và cân bằng hoàn hảo, vì sao BST phải cân bằng, thuật toán cân bằng đơn giản (bảng lời gọi đệ quy), phép xoay trái/phải, xoay đơn và xoay kép, cây AVL và hệ số cân bằng, chèn và xoá AVL (ví dụ khoá 54 và 32 vẽ lại từng bước), heap max/min và công thức chỉ số trên mảng — 14 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.C · 4B-Trees2, slides 1–16</span>
<h2>Trees, part 2a — balancing, rotations, AVL trees and heap basics</h2>
<p class="lead">Part 1 of the chapter (lessons 4.A–4.B) built the binary search tree; this deck asks what happens when a BST grows lopsided. Slides 1–16 answer with the tools of syllabus sessions 23–24: a simple rebuild algorithm, rotations, AVL trees, and the first two slides on heaps. Every slide comes with its meaning, runnable Java, the tree drawn before and after each rotation, the Big-O and the exam traps.</p>
<div class="callout"><strong>CLO4 in the syllabus:</strong> explain general trees, binary trees and binary search trees, and implement a BST with its basic operations. The syllabus's discussion questions on this part are all answered below: <em>What is an AVL tree? How is it different from a BST? What does searching it cost? How is the balance factor calculated?</em> and <em>What happens if you insert an ordered array into a BST?</em> FE questions often give a sequence of keys and ask for the tree after inserting and rebalancing — trace slides 11–14 until it becomes automatic.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Idea</th><th>Slides</th><th>Key fact</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Unbalanced BST</td><td>4</td><td>keys inserted in sorted order give a chain of height n</td><td>search O(n)</td></tr>
<tr><td>Height-balanced / perfectly balanced</td><td>3</td><td>at every node the children's heights differ by ≤ 1 / and all leaves lie on 1–2 levels</td><td>height O(log n)</td></tr>
<tr><td>Simple balance algorithm</td><td>5–6</td><td>copy to an array, sort, clear, re-insert middle-first</td><td>O(n log n), needs all keys + an array</td></tr>
<tr><td>Rotation (left / right)</td><td>7–9</td><td>three references change, the in-order sequence stays</td><td>O(1)</td></tr>
<tr><td>AVL tree</td><td>10</td><td>balance factor h(right) − h(left) ∈ {−1, 0, +1} at every node</td><td>height below 1.44·log₂(n+2)</td></tr>
<tr><td>AVL insertion</td><td>11–12</td><td>at most one rotation, single or double</td><td>O(log n)</td></tr>
<tr><td>AVL deletion</td><td>13–14</td><td>may rotate at several levels, up to the root</td><td>O(log n)</td></tr>
<tr><td>Heap (max / min)</td><td>15–16</td><td>parent ≥ children, nearly complete, stored in an array</td><td>read the max O(1)</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.C · 4B-Trees2, slide 1–16</span>
<h2>Cây, phần 2a — cân bằng, phép xoay, cây AVL và heap (đống) cơ bản</h2>
<p class="lead">Phần 1 của chương (bài 4.A–4.B) đã dựng cây nhị phân tìm kiếm (binary search tree — BST); bộ slide này hỏi tiếp: chuyện gì xảy ra khi BST mọc lệch hẳn về một phía? Slide 1–16 trả lời bằng các công cụ của buổi 23–24 trong syllabus: một thuật toán dựng lại cây đơn giản, phép xoay (rotation), cây AVL, và hai slide đầu về heap (đống). Slide nào cũng có ý nghĩa, Java chạy được, cây vẽ lại trước và sau mỗi phép xoay, độ phức tạp Big-O và các bẫy hay mất điểm.</p>
<div class="callout"><strong>CLO4 trong syllabus:</strong> giải thích cây tổng quát (general tree), cây nhị phân (binary tree) và cây nhị phân tìm kiếm, cài đặt được BST với các thao tác cơ bản. Các câu hỏi thảo luận (constructive question) của syllabus về phần này đều có lời đáp bên dưới: <em>Cây AVL là gì? Khác BST ở đâu? Tìm kiếm trên nó tốn bao nhiêu? Tính hệ số cân bằng (balance factor) thế nào?</em> và <em>Chèn một mảng đã sắp xếp vào BST thì chuyện gì xảy ra?</em> Đề FE (thi cuối kỳ) hay cho một dãy khoá rồi hỏi cây sau khi chèn và cân bằng lại — hãy lần theo slide 11–14 tới khi thành phản xạ.</div>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Ý</th><th>Slide</th><th>Điều cốt lõi</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>BST mất cân bằng</td><td>4</td><td>chèn khoá theo thứ tự đã sắp → một chuỗi cao n</td><td>tìm kiếm O(n)</td></tr>
<tr><td>Cân bằng theo chiều cao (height-balanced) / cân bằng hoàn hảo (perfectly balanced)</td><td>3</td><td>ở mọi nút, chiều cao hai con lệch ≤ 1 / thêm: mọi lá nằm trên 1–2 mức</td><td>chiều cao O(log n)</td></tr>
<tr><td>Thuật toán cân bằng đơn giản</td><td>5–6</td><td>chép ra mảng, sắp xếp, xoá cây, chèn lại phần tử giữa trước</td><td>O(n log n), cần đủ mọi khoá + một mảng</td></tr>
<tr><td>Phép xoay trái / phải</td><td>7–9</td><td>đổi ba tham chiếu, dãy trung thứ tự (in-order) giữ nguyên</td><td>O(1)</td></tr>
<tr><td>Cây AVL</td><td>10</td><td>hệ số cân bằng h(phải) − h(trái) ∈ {−1, 0, +1} ở mọi nút</td><td>chiều cao dưới 1,44·log₂(n+2)</td></tr>
<tr><td>Chèn vào cây AVL</td><td>11–12</td><td>nhiều nhất một lần xoay, đơn hoặc kép</td><td>O(log n)</td></tr>
<tr><td>Xoá khỏi cây AVL</td><td>13–14</td><td>có thể phải xoay ở nhiều mức, tới tận gốc</td><td>O(log n)</td></tr>
<tr><td>Heap (đống) max / min</td><td>15–16</td><td>cha ≥ con, cây gần đầy đủ, lưu trong mảng</td><td>đọc phần tử lớn nhất O(1)</td></tr>
</tbody>
</table>`),
    walkHead('csd9', 1, 16),
    walk('csd9', [
      [1, '4. Trees, Part 2',
        `<p class="y-chinh">🎯 Part 2 of the tree chapter: keeping a BST short (balancing, rotations, AVL trees) and a second kind of tree built for priorities — the heap.</p>
<p>Part 1 ended with BST insertion and deletion, whose cost is the height of the tree. Everything in this deck is about keeping that height near log₂n instead of letting it drift towards n.</p>`,
        `<p class="y-chinh">🎯 Phần 2 của chương cây: giữ cho cây nhị phân tìm kiếm (BST) luôn thấp — cân bằng (balancing), phép xoay (rotation), cây AVL — và một loại cây thứ hai sinh ra để xử lý độ ưu tiên: heap (đống).</p>
<p>Phần 1 kết thúc ở thao tác chèn và xoá trên BST, mà chi phí của chúng bằng chiều cao (height) của cây. Cả bộ slide này xoay quanh một việc: giữ chiều cao ở mức gần log₂n thay vì để nó trôi dần về n.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Nine objectives in two families: search trees kept short (balancing, rotations, AVL) and heaps (priority queues, arrays organized as heaps), plus Polish notation.</p>
<ol>
<li><strong>Balanced binary tree definitions</strong> and <strong>the simple balance algorithm</strong> — slides 3–6</li>
<li><strong>Rotations on a binary search tree</strong> — single and double, slides 7–9</li>
<li><strong>AVL tree</strong>, <strong>insertion</strong> and <strong>deletion in an AVL tree</strong> — slides 10–14</li>
<li><strong>Heaps</strong> — definition, array storage, heaps and non-heaps, slides 15–18</li>
<li><strong>Heaps as priority queues</strong> — enqueue and dequeue (slides 19–20), organizing an array as a heap and heap sort (slides 21–28)</li>
<li><strong>Polish notation and expression trees</strong> — slides 29–30</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> the first half keeps a <em>search</em> tree fast; the second half uses a tree for <em>priority</em>, where only the largest element matters.</p>`,
        `<p class="y-chinh">🎯 Chín mục tiêu chia hai nhóm: cây tìm kiếm được giữ thấp (cân bằng, phép xoay, cây AVL) và heap (đống) — hàng đợi ưu tiên, tổ chức mảng thành heap — cộng thêm ký pháp Ba Lan (Polish notation).</p>
<ol>
<li><strong>Định nghĩa cây nhị phân cân bằng (balanced binary tree)</strong> và <strong>thuật toán cân bằng đơn giản</strong> — slide 3–6</li>
<li><strong>Phép xoay (rotation) trên cây nhị phân tìm kiếm</strong> — xoay đơn và xoay kép, slide 7–9</li>
<li><strong>Cây AVL</strong>, <strong>chèn</strong> và <strong>xoá trên cây AVL</strong> — slide 10–14</li>
<li><strong>Heap (đống)</strong> — định nghĩa, cách lưu trên mảng, heap và không phải heap, slide 15–18</li>
<li><strong>Heap làm hàng đợi ưu tiên (priority queue)</strong> — thêm vào và lấy ra (enqueue/dequeue, slide 19–20), tổ chức mảng thành heap và sắp xếp vun đống (heap sort, slide 21–28)</li>
<li><strong>Ký pháp Ba Lan và cây biểu thức (expression tree)</strong> — slide 29–30</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nửa đầu giữ cho cây <em>tìm kiếm</em> luôn nhanh; nửa sau dùng cây cho <em>độ ưu tiên</em>, nơi chỉ phần tử lớn nhất là quan trọng.</p>`],
      [3, 'Balanced Binary Tree Definitions',
        `<p class="y-chinh">🎯 A tree is height-balanced when, at every internal node, the heights of the two children differ by at most 1; it is perfectly balanced when, in addition, all its leaves lie on one or two levels.</p>
<ul>
<li><strong>Why it matters</strong>: search, insert and delete in a BST walk one path from the root, so they cost O(height). Balanced means height O(log n) — about 20 levels for a million keys.</li>
<li><strong>Height-balanced</strong> (slide): for every internal node p, |height(left child) − height(right child)| ≤ 1. Heights follow part 1: a single node has height 1, an empty child height 0.</li>
<li><strong>Perfectly balanced</strong> (slide): height-balanced <em>and</em> every leaf on one level or on two levels.</li>
</ul>
<pre><code class="language-java">import java.util.TreeSet;

class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

class BSTree {
    Node root;

    void insert(int x) {                             // BST insertion from part 1 of the chapter
        if (root == null) { root = new Node(x); return; }
        Node f = null, p = root;
        while (p != null) {
            if (p.info == x) return;
            f = p;
            p = x &lt; p.info ? p.left : p.right;
        }
        if (x &lt; f.info) f.left = new Node(x); else f.right = new Node(x);
    }

    // Height as on the slides (empty = 0, one node = 1), or -1 if some node breaks the rule
    int checkHeight(Node p) {
        if (p == null) return 0;
        int hl = checkHeight(p.left), hr = checkHeight(p.right);
        if (hl &lt; 0 || hr &lt; 0 || Math.abs(hl - hr) &gt; 1) return -1;   // children differ by more than 1
        return 1 + Math.max(hl, hr);
    }

    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    void leafLevels(Node p, int level, TreeSet&lt;Integer&gt; set) {   // root is on level 1
        if (p == null) return;
        if (p.left == null &amp;&amp; p.right == null) set.add(level);
        leafLevels(p.left, level + 1, set);
        leafLevels(p.right, level + 1, set);
    }
}

public class BalanceCheck {
    public static void main(String[] args) {
        int[][] orders = { {1, 2, 3}, {4, 2, 6, 1}, {4, 2, 6, 1, 3, 5, 7}, {8, 5, 11, 3, 7, 10, 12, 2, 4, 6, 9, 1} };
        System.out.println("keys inserted                height  height-balanced  leaf levels  perfectly balanced");
        for (int[] order : orders) {
            BSTree t = new BSTree();
            StringBuilder keys = new StringBuilder();
            for (int x : order) { t.insert(x); keys.append(x).append(' '); }
            boolean hb = t.checkHeight(t.root) &gt;= 0;
            TreeSet&lt;Integer&gt; levels = new TreeSet&lt;Integer&gt;();
            t.leafLevels(t.root, 1, levels);
            boolean pb = hb &amp;&amp; levels.size() &lt;= 2;             // ... and leaves on one or two levels
            System.out.printf("%-29s%-8d%-17s%-13s%s%n", keys, t.height(t.root), hb ? "yes" : "no", levels, pb ? "yes" : "no");
        }
    }
}</code></pre>
<div class="out">keys inserted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height &nbsp;height-balanced &nbsp;leaf levels &nbsp;perfectly balanced<br>
1 2 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no<br>
4 2 6 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2, 3] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
4 2 6 1 3 5 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
8 5 11 3 7 10 12 2 4 6 9 1 &nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3, 4, 5] &nbsp;&nbsp;&nbsp;no</div>
<p>The chain 1 2 3 has a single leaf (one level) and still fails, because its root has children of heights 2 and 0 — that is why the definition needs both conditions. The 12-node tree passes the height test at every node, yet its leaves spread over levels 3, 4 and 5.</p>
<p><strong>Big-O:</strong> <code>checkHeight</code> visits every node once and passes its height up — O(n). Calling <code>height()</code> separately at every node would redo work: O(n log n) on a balanced tree, O(n²) on a chain.</p>
<p class="dap-an">✅ <strong>Answer — "What is a balanced tree in general?"</strong> There is no single definition (height-balanced, perfectly balanced, AVL, red-black…); what they share is the goal the slide states: keep the depth of every node O(log n).</p>
<div class="pitfall">Balanced is not the same as complete. In part 1 a complete binary tree has every level full; a height-balanced tree may have gaps (4 2 6 1 above is balanced but not full). Use the definition the question gives.</div>`,
        `<p class="y-chinh">🎯 Cây cân bằng theo chiều cao (height-balanced) khi ở mọi nút trong, chiều cao hai con lệch nhau nhiều nhất 1; cây cân bằng hoàn hảo (perfectly balanced) khi thêm điều kiện mọi lá nằm trên một hoặc hai mức (level).</p>
<ul>
<li><strong>Vì sao quan trọng</strong>: tìm, chèn, xoá trên cây nhị phân tìm kiếm (BST) đều đi một đường từ gốc (root) xuống, nên tốn O(chiều cao). Cân bằng nghĩa là chiều cao O(log n) — khoảng 20 mức cho một triệu khoá.</li>
<li><strong>Cân bằng theo chiều cao</strong> (slide): với mọi nút trong (internal node) p, |height(con trái) − height(con phải)| ≤ 1. Chiều cao tính như phần 1: một nút đứng riêng cao 1, con rỗng cao 0.</li>
<li><strong>Cân bằng hoàn hảo</strong> (slide): cân bằng theo chiều cao <em>và</em> mọi lá (leaf) nằm trên một mức hoặc hai mức.</li>
</ul>
<pre><code class="language-java">import java.util.TreeSet;

class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

class BSTree {
    Node root;

    void insert(int x) {                             // chèn BST như phần 1 của chương
        if (root == null) { root = new Node(x); return; }
        Node f = null, p = root;
        while (p != null) {
            if (p.info == x) return;
            f = p;
            p = x &lt; p.info ? p.left : p.right;
        }
        if (x &lt; f.info) f.left = new Node(x); else f.right = new Node(x);
    }

    // Chiều cao theo slide (rỗng = 0, một nút = 1), hoặc -1 nếu có nút vi phạm
    int checkHeight(Node p) {
        if (p == null) return 0;
        int hl = checkHeight(p.left), hr = checkHeight(p.right);
        if (hl &lt; 0 || hr &lt; 0 || Math.abs(hl - hr) &gt; 1) return -1;   // hai con lệch quá 1
        return 1 + Math.max(hl, hr);
    }

    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    void leafLevels(Node p, int level, TreeSet&lt;Integer&gt; set) {   // gốc ở mức 1
        if (p == null) return;
        if (p.left == null &amp;&amp; p.right == null) set.add(level);
        leafLevels(p.left, level + 1, set);
        leafLevels(p.right, level + 1, set);
    }
}

public class BalanceCheck {
    public static void main(String[] args) {
        int[][] orders = { {1, 2, 3}, {4, 2, 6, 1}, {4, 2, 6, 1, 3, 5, 7}, {8, 5, 11, 3, 7, 10, 12, 2, 4, 6, 9, 1} };
        System.out.println("keys inserted                height  height-balanced  leaf levels  perfectly balanced");
        for (int[] order : orders) {
            BSTree t = new BSTree();
            StringBuilder keys = new StringBuilder();
            for (int x : order) { t.insert(x); keys.append(x).append(' '); }
            boolean hb = t.checkHeight(t.root) &gt;= 0;
            TreeSet&lt;Integer&gt; levels = new TreeSet&lt;Integer&gt;();
            t.leafLevels(t.root, 1, levels);
            boolean pb = hb &amp;&amp; levels.size() &lt;= 2;             // ... và lá nằm trên một hoặc hai mức
            System.out.printf("%-29s%-8d%-17s%-13s%s%n", keys, t.height(t.root), hb ? "yes" : "no", levels, pb ? "yes" : "no");
        }
    }
}</code></pre>
<div class="out">keys inserted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height &nbsp;height-balanced &nbsp;leaf levels &nbsp;perfectly balanced<br>
1 2 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no<br>
4 2 6 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2, 3] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
4 2 6 1 3 5 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
8 5 11 3 7 10 12 2 4 6 9 1 &nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3, 4, 5] &nbsp;&nbsp;&nbsp;no</div>
<p>Chuỗi 1 2 3 chỉ có một lá (một mức) mà vẫn trượt, vì gốc của nó có hai con cao 2 và 0 — nên định nghĩa mới cần đủ cả hai điều kiện. Cây 12 nút qua được phép thử chiều cao ở mọi nút, nhưng lá của nó rải trên ba mức 3, 4, 5.</p>
<p><strong>Big-O:</strong> <code>checkHeight</code> thăm mỗi nút một lần và trả chiều cao ngược lên — O(n). Nếu gọi <code>height()</code> riêng ở từng nút thì làm lại việc cũ: O(n log n) trên cây cân bằng, O(n²) trên chuỗi.</p>
<p class="dap-an">✅ <strong>Đáp án — "Nói chung, thế nào là cây cân bằng?"</strong> Không có một định nghĩa duy nhất (cân bằng theo chiều cao, cân bằng hoàn hảo, AVL, đỏ-đen — red-black…); điểm chung là mục tiêu slide nêu: giữ độ sâu (depth) của mọi nút ở mức O(log n).</p>
<div class="pitfall">Cân bằng không đồng nghĩa với đầy đủ. Ở phần 1, cây nhị phân đầy đủ (complete binary tree) có mọi mức kín; cây cân bằng theo chiều cao vẫn có thể có chỗ trống (cây 4 2 6 1 ở trên cân bằng nhưng không kín). Hãy dùng đúng định nghĩa mà câu hỏi đưa ra.</div>`],
      [4, 'Why need to balance a Binary Search Tree?',
        `<p class="y-chinh">🎯 The same keys can form many different BSTs — the shape depends only on the order of insertion — and a bad order turns the tree into a linked list.</p>
<p class="ghi-chu">The slide shows, as a picture, different BSTs holding the same information; the three trees below are the lesson's own example.</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

class BSTree {
    Node root;

    void insert(int x) {                             // BST insertion from part 1 of the chapter
        if (root == null) { root = new Node(x); return; }
        Node f = null, p = root;
        while (p != null) {
            if (p.info == x) return;
            f = p;
            p = x &lt; p.info ? p.left : p.right;
        }
        if (x &lt; f.info) f.left = new Node(x); else f.right = new Node(x);
    }

    int visits(int x) {                              // nodes looked at while searching x
        int k = 0;
        for (Node p = root; p != null; p = x &lt; p.info ? p.left : p.right) {
            k++;
            if (p.info == x) break;
        }
        return k;
    }

    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    String show(Node p) {                            // 4(2,6) = root 4, left child 2, right child 6
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    String inorder(Node p) { return p == null ? "" : inorder(p.left) + p.info + " " + inorder(p.right); }
}

public class SameKeys {
    public static void main(String[] args) {
        int[][] orders = { {1, 2, 3, 4, 5, 6, 7}, {3, 1, 6, 2, 5, 7, 4}, {4, 2, 6, 1, 3, 5, 7} };
        for (int[] order : orders) {
            BSTree t = new BSTree();
            StringBuilder keys = new StringBuilder("insert");
            for (int x : order) { t.insert(x); keys.append(' ').append(x); }
            System.out.println(keys);
            System.out.println("   tree " + t.show(t.root) + "   height " + t.height(t.root) + ", search(7) visits " + t.visits(7) + " node(s)");
            System.out.println("   in-order " + t.inorder(t.root));
        }
    }
}</code></pre>
<div class="out">insert 1 2 3 4 5 6 7<br>
&nbsp;&nbsp;&nbsp;tree 1(-,2(-,3(-,4(-,5(-,6(-,7)))))) &nbsp;&nbsp;height 7, search(7) visits 7 node(s)<br>
&nbsp;&nbsp;&nbsp;in-order 1 2 3 4 5 6 7<br>
insert 3 1 6 2 5 7 4<br>
&nbsp;&nbsp;&nbsp;tree 3(1(-,2),6(5(4,-),7)) &nbsp;&nbsp;height 4, search(7) visits 3 node(s)<br>
&nbsp;&nbsp;&nbsp;in-order 1 2 3 4 5 6 7<br>
insert 4 2 6 1 3 5 7<br>
&nbsp;&nbsp;&nbsp;tree 4(2(1,3),6(5,7)) &nbsp;&nbsp;height 3, search(7) visits 3 node(s)<br>
&nbsp;&nbsp;&nbsp;in-order 1 2 3 4 5 6 7</div>
<ul>
<li>All three trees store 1…7 and print 1 2 3 4 5 6 7 in-order: same information, different shapes.</li>
<li>Keys arriving already sorted (IDs, dates, file names — very common) build the chain of height 7; searching 7 visits every node.</li>
<li>Inserting the middle first (4, then 2 and 6, …) gives height 3 = ⌈log₂(7+1)⌉, the smallest possible.</li>
</ul>
<p><strong>Big-O:</strong> a BST operation costs O(h). With n keys, h lies between ⌈log₂(n+1)⌉ and n, so the same code runs in O(log n) or in O(n) depending only on the shape.</p>
<p class="dap-an">✅ <strong>Answer — "Why need to balance a BST?"</strong> Without it, ordinary input (sorted or nearly sorted) degrades search, insert and delete to O(n) — a linked list with extra pointers. Balancing guarantees O(log n). This is also the syllabus question "What will happen if you insert an ordered array into a BST?"</p>
<p class="meo">🧠 <strong>Remember:</strong> a BST is only as good as its height — "sorted in, list out".</p>`,
        `<p class="y-chinh">🎯 Cùng một tập khoá có thể tạo ra rất nhiều cây nhị phân tìm kiếm (BST) khác nhau — hình dạng chỉ phụ thuộc thứ tự chèn — và một thứ tự tồi biến cây thành danh sách liên kết (linked list).</p>
<p class="ghi-chu">Slide vẽ bằng hình nhiều BST khác nhau chứa cùng thông tin; ba cây dưới đây là ví dụ của bài.</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

class BSTree {
    Node root;

    void insert(int x) {                             // chèn BST như phần 1 của chương
        if (root == null) { root = new Node(x); return; }
        Node f = null, p = root;
        while (p != null) {
            if (p.info == x) return;
            f = p;
            p = x &lt; p.info ? p.left : p.right;
        }
        if (x &lt; f.info) f.left = new Node(x); else f.right = new Node(x);
    }

    int visits(int x) {                              // số nút phải xem khi tìm x
        int k = 0;
        for (Node p = root; p != null; p = x &lt; p.info ? p.left : p.right) {
            k++;
            if (p.info == x) break;
        }
        return k;
    }

    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    String show(Node p) {                            // 4(2,6) = gốc 4, con trái 2, con phải 6
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    String inorder(Node p) { return p == null ? "" : inorder(p.left) + p.info + " " + inorder(p.right); }
}

public class SameKeys {
    public static void main(String[] args) {
        int[][] orders = { {1, 2, 3, 4, 5, 6, 7}, {3, 1, 6, 2, 5, 7, 4}, {4, 2, 6, 1, 3, 5, 7} };
        for (int[] order : orders) {
            BSTree t = new BSTree();
            StringBuilder keys = new StringBuilder("insert");
            for (int x : order) { t.insert(x); keys.append(' ').append(x); }
            System.out.println(keys);
            System.out.println("   tree " + t.show(t.root) + "   height " + t.height(t.root) + ", search(7) visits " + t.visits(7) + " node(s)");
            System.out.println("   in-order " + t.inorder(t.root));
        }
    }
}</code></pre>
<div class="out">insert 1 2 3 4 5 6 7<br>
&nbsp;&nbsp;&nbsp;tree 1(-,2(-,3(-,4(-,5(-,6(-,7)))))) &nbsp;&nbsp;height 7, search(7) visits 7 node(s)<br>
&nbsp;&nbsp;&nbsp;in-order 1 2 3 4 5 6 7<br>
insert 3 1 6 2 5 7 4<br>
&nbsp;&nbsp;&nbsp;tree 3(1(-,2),6(5(4,-),7)) &nbsp;&nbsp;height 4, search(7) visits 3 node(s)<br>
&nbsp;&nbsp;&nbsp;in-order 1 2 3 4 5 6 7<br>
insert 4 2 6 1 3 5 7<br>
&nbsp;&nbsp;&nbsp;tree 4(2(1,3),6(5,7)) &nbsp;&nbsp;height 3, search(7) visits 3 node(s)<br>
&nbsp;&nbsp;&nbsp;in-order 1 2 3 4 5 6 7</div>
<ul>
<li>Cả ba cây đều chứa 1…7 và in ra 1 2 3 4 5 6 7 khi duyệt trung thứ tự (in-order): cùng thông tin, khác hình dạng.</li>
<li>Khoá đến theo thứ tự đã sắp (mã số, ngày tháng, tên file — rất hay gặp) dựng nên chuỗi cao 7; tìm 7 phải thăm mọi nút.</li>
<li>Chèn phần tử giữa trước (4, rồi 2 và 6, …) cho chiều cao 3 = ⌈log₂(7+1)⌉, nhỏ nhất có thể.</li>
</ul>
<p><strong>Big-O:</strong> mỗi thao tác BST tốn O(h) với h là chiều cao. Với n khoá, h nằm giữa ⌈log₂(n+1)⌉ và n, nên cùng một đoạn code có thể chạy O(log n) hoặc O(n) chỉ vì hình dạng cây.</p>
<p class="dap-an">✅ <strong>Đáp án — "Vì sao cần cân bằng BST?"</strong> Không cân bằng thì dữ liệu rất bình thường (đã sắp hoặc gần sắp) kéo tìm, chèn, xoá xuống O(n) — thành một danh sách liên kết thừa con trỏ. Cân bằng bảo đảm O(log n). Đây cũng chính là câu hỏi của syllabus "Chèn một mảng đã sắp xếp vào BST thì chuyện gì xảy ra?"</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> BST tốt tới đâu là do chiều cao của nó — "vào đã sắp, ra thành danh sách".</p>`],
      [5, 'Balancing a Tree - Simple Balance Algorithm - 1',
        `<p class="y-chinh">🎯 The simplest way to balance a BST is to rebuild it: copy every key to an array, sort the array, clear the tree, and insert the keys back middle-first.</p>
<p>The slide's figure builds a BST from an ordered array; below, its four steps run on the lesson's own unbalanced tree:</p>
<ol>
<li><strong>Copy</strong> all tree nodes to an array — any traversal will do (here: preorder).</li>
<li><strong>Sort</strong> the array. Copying with an in-order traversal would give a sorted array straight away, making this step free.</li>
<li><strong>Clear</strong> the tree: <code>root = null</code>; the old nodes become garbage.</li>
<li><strong>balance()</strong> rebuilds it: insert the middle element as the root, then do the same with each half (slide 6).</li>
</ol>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Node&lt;T&gt; {
    T info;
    Node&lt;T&gt; left, right;

    Node(T x) { info = x; }
}

class BSTree&lt;T extends Comparable&lt;T&gt;&gt; {
    Node&lt;T&gt; root;

    void insert(T x) {                               // part 1 insertion, comparing with compareTo
        if (root == null) { root = new Node&lt;T&gt;(x); return; }
        Node&lt;T&gt; f = null, p = root;
        while (p != null) {
            if (x.compareTo(p.info) == 0) return;
            f = p;
            p = x.compareTo(p.info) &lt; 0 ? p.left : p.right;
        }
        if (x.compareTo(f.info) &lt; 0) f.left = new Node&lt;T&gt;(x); else f.right = new Node&lt;T&gt;(x);
    }

    void copy(Node&lt;T&gt; p, List&lt;T&gt; out) {              // step 1: preorder copy of every node
        if (p == null) return;
        out.add(p.info);
        copy(p.left, out);
        copy(p.right, out);
    }

    void clear() { root = null; }                    // step 3: the old nodes become garbage

    public void balance(T data[], int first, int last) {   // step 4: slide 6, unchanged
        if (first &lt;= last) {
            int middle = (first + last)/2;
            insert(data[middle]);
            balance(data,first,middle-1);
            balance(data,middle+1,last);
        }
    }
    public void balance(T data[]) {
        balance(data,0,data.length-1);
    }

    int height(Node&lt;T&gt; p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    String show(Node&lt;T&gt; p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
}

public class RebuildTree {
    public static void main(String[] args) {
        BSTree&lt;Integer&gt; t = new BSTree&lt;Integer&gt;();
        for (int x : new int[] {5, 1, 2, 3, 4, 7, 6}) t.insert(x);
        System.out.println("tree:            " + t.show(t.root) + "   height " + t.height(t.root));
        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        t.copy(t.root, list);
        Integer[] data = list.toArray(new Integer[0]);
        System.out.println("1. copy (pre):   " + Arrays.toString(data));
        Arrays.sort(data);                           // step 2
        System.out.println("2. sort:         " + Arrays.toString(data));
        t.clear();
        System.out.println("3. clear:        root = " + t.root);
        t.balance(data);
        System.out.println("4. balance():    " + t.show(t.root) + "   height " + t.height(t.root));
    }
}</code></pre>
<div class="out">tree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5(1(-,2(-,3(-,4))),7(6,-)) &nbsp;&nbsp;height 5<br>
1. copy (pre): &nbsp;&nbsp;[5, 1, 2, 3, 4, 7, 6]<br>
2. sort: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 2, 3, 4, 5, 6, 7]<br>
3. clear: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root = null<br>
4. balance(): &nbsp;&nbsp;&nbsp;4(2(1,3),6(5,7)) &nbsp;&nbsp;height 3</div>
<p><strong>Big-O:</strong> copy O(n) + sort O(n log n) + n insertions into a tree that never gets taller than ⌈log₂(n+1)⌉ → O(n log n) in total, plus O(n) extra memory for the array.</p>
<div class="pitfall">This algorithm needs <em>all</em> the keys at once. If keys keep arriving, the tree would have to be rebuilt after every insertion — O(n log n) each time. That weakness is why the deck moves on to rotations and AVL trees, which repair the tree locally.</div>`,
        `<p class="y-chinh">🎯 Cách đơn giản nhất để cân bằng một cây nhị phân tìm kiếm (BST) là dựng lại nó: chép mọi khoá ra mảng, sắp xếp mảng, xoá cây, rồi chèn lại các khoá theo kiểu "phần tử giữa trước".</p>
<p>Hình trên slide dựng BST từ một mảng đã sắp; dưới đây bốn bước của thuật toán chạy trên một cây lệch là ví dụ của bài:</p>
<ol>
<li><strong>Chép</strong> mọi nút của cây ra mảng — duyệt kiểu nào cũng được (ở đây: tiền thứ tự — preorder).</li>
<li><strong>Sắp xếp</strong> mảng. Nếu chép bằng duyệt trung thứ tự (in-order) thì mảng đã sắp sẵn, bước này coi như miễn phí.</li>
<li><strong>Xoá</strong> cây: <code>root = null</code>; các nút cũ thành rác (garbage).</li>
<li><strong>balance()</strong> dựng lại cây: chèn phần tử giữa làm gốc, rồi làm y như vậy với từng nửa (slide 6).</li>
</ol>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Node&lt;T&gt; {
    T info;
    Node&lt;T&gt; left, right;

    Node(T x) { info = x; }
}

class BSTree&lt;T extends Comparable&lt;T&gt;&gt; {
    Node&lt;T&gt; root;

    void insert(T x) {                               // chèn như phần 1, so sánh bằng compareTo
        if (root == null) { root = new Node&lt;T&gt;(x); return; }
        Node&lt;T&gt; f = null, p = root;
        while (p != null) {
            if (x.compareTo(p.info) == 0) return;
            f = p;
            p = x.compareTo(p.info) &lt; 0 ? p.left : p.right;
        }
        if (x.compareTo(f.info) &lt; 0) f.left = new Node&lt;T&gt;(x); else f.right = new Node&lt;T&gt;(x);
    }

    void copy(Node&lt;T&gt; p, List&lt;T&gt; out) {              // bước 1: chép mọi nút theo thứ tự trước
        if (p == null) return;
        out.add(p.info);
        copy(p.left, out);
        copy(p.right, out);
    }

    void clear() { root = null; }                    // bước 3: các nút cũ thành rác

    public void balance(T data[], int first, int last) {   // bước 4: slide 6, giữ nguyên
        if (first &lt;= last) {
            int middle = (first + last)/2;
            insert(data[middle]);
            balance(data,first,middle-1);
            balance(data,middle+1,last);
        }
    }
    public void balance(T data[]) {
        balance(data,0,data.length-1);
    }

    int height(Node&lt;T&gt; p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    String show(Node&lt;T&gt; p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
}

public class RebuildTree {
    public static void main(String[] args) {
        BSTree&lt;Integer&gt; t = new BSTree&lt;Integer&gt;();
        for (int x : new int[] {5, 1, 2, 3, 4, 7, 6}) t.insert(x);
        System.out.println("tree:            " + t.show(t.root) + "   height " + t.height(t.root));
        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        t.copy(t.root, list);
        Integer[] data = list.toArray(new Integer[0]);
        System.out.println("1. copy (pre):   " + Arrays.toString(data));
        Arrays.sort(data);                           // bước 2
        System.out.println("2. sort:         " + Arrays.toString(data));
        t.clear();
        System.out.println("3. clear:        root = " + t.root);
        t.balance(data);
        System.out.println("4. balance():    " + t.show(t.root) + "   height " + t.height(t.root));
    }
}</code></pre>
<div class="out">tree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5(1(-,2(-,3(-,4))),7(6,-)) &nbsp;&nbsp;height 5<br>
1. copy (pre): &nbsp;&nbsp;[5, 1, 2, 3, 4, 7, 6]<br>
2. sort: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 2, 3, 4, 5, 6, 7]<br>
3. clear: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root = null<br>
4. balance(): &nbsp;&nbsp;&nbsp;4(2(1,3),6(5,7)) &nbsp;&nbsp;height 3</div>
<p><strong>Big-O:</strong> chép O(n) + sắp xếp O(n log n) + n lần chèn vào một cây không bao giờ cao quá ⌈log₂(n+1)⌉ → tổng O(n log n), cộng O(n) bộ nhớ phụ cho mảng.</p>
<div class="pitfall">Thuật toán này cần có <em>đủ</em> mọi khoá cùng lúc. Nếu khoá cứ đến dần, cây phải dựng lại sau mỗi lần chèn — mỗi lần O(n log n). Chính điểm yếu đó khiến bộ slide chuyển sang phép xoay (rotation) và cây AVL, là những thứ sửa cây tại chỗ, cục bộ.</div>`],
      [6, 'Balancing a Tree - Simple Balance Algorithm - 2',
        `<p class="y-chinh">🎯 <code>balance(data, first, last)</code> inserts the middle element of the range, then balances the left half and the right half — a divide-and-conquer recursion over a sorted array.</p>
<p>The slide's two methods are copied unchanged below; only the two lines marked "added" print the recursion, and <code>insert</code> (the BST insertion of part 1, comparing with <code>compareTo</code>) records the order:</p>
<pre><code class="language-java">class Node&lt;T&gt; {
    T info;
    Node&lt;T&gt; left, right;

    Node(T x) { info = x; }
}

class BSTree&lt;T extends Comparable&lt;T&gt;&gt; {
    Node&lt;T&gt; root;
    int depth = 0;                                   // only for the printed trace
    String order = "";                               // keys in the order they were inserted

    void insert(T x) {
        System.out.println(" -&gt; insert " + x);       // trace
        order += x + " ";
        if (root == null) { root = new Node&lt;T&gt;(x); return; }
        Node&lt;T&gt; f = null, p = root;
        while (p != null) {
            if (x.compareTo(p.info) == 0) return;
            f = p;
            p = x.compareTo(p.info) &lt; 0 ? p.left : p.right;
        }
        if (x.compareTo(f.info) &lt; 0) f.left = new Node&lt;T&gt;(x); else f.right = new Node&lt;T&gt;(x);
    }

    void trace(int first, int last) {                // prints "balance(first,last)", indented by depth
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; depth; i++) s.append("   ");
        System.out.print(s + "balance(" + first + "," + last + ")");
        if (first &gt; last) System.out.println(" -&gt; empty range, stop");
        else System.out.print(" middle=" + (first + last) / 2);
        depth++;
    }

    public void balance(T data[], int first, int last) {
        trace(first, last);                          // added: trace
        if (first &lt;= last) {
            int middle = (first + last)/2;
            insert(data[middle]);
            balance(data,first,middle-1);
            balance(data,middle+1,last);
        }
        depth--;                                     // added: trace
    }
    public void balance(T data[]) {
        balance(data,0,data.length-1);
    }

    int height(Node&lt;T&gt; p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    String show(Node&lt;T&gt; p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
}

public class BalanceTrace {
    public static void main(String[] args) {
        Integer[] data = {1, 2, 3, 4, 5, 6, 7};      // sorted, indexes 0..6
        BSTree&lt;Integer&gt; t = new BSTree&lt;Integer&gt;();
        t.balance(data);
        System.out.println("insertion order: " + t.order + "  tree " + t.show(t.root) + "  height " + t.height(t.root));
    }
}</code></pre>
<div class="out">balance(0,6) middle=3 -&gt; insert 4<br>
&nbsp;&nbsp;&nbsp;balance(0,2) middle=1 -&gt; insert 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(0,0) middle=0 -&gt; insert 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(0,-1) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(1,0) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(2,2) middle=2 -&gt; insert 3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(2,1) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(3,2) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;balance(4,6) middle=5 -&gt; insert 6<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(4,4) middle=4 -&gt; insert 5<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(4,3) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(5,4) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(6,6) middle=6 -&gt; insert 7<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(6,5) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(7,6) -&gt; empty range, stop<br>
insertion order: 4 2 1 3 6 5 7 &nbsp;&nbsp;tree 4(2(1,3),6(5,7)) &nbsp;height 3</div>
<ul>
<li>Base case: <code>first &gt; last</code> — an empty range, nothing to insert.</li>
<li>Each non-empty call inserts exactly one key: n calls that insert plus n + 1 empty calls, 2n + 1 = 15 calls for n = 7. With each insertion O(log n), the rebuild is O(n log n).</li>
<li>The insertion order 4 2 1 3 6 5 7 is the <em>preorder</em> of the final tree: every key goes in before the keys below it, so it lands directly in its final place.</li>
<li><code>middle = (first + last)/2</code> rounds down: with an even number of keys the root is the lower of the two middle ones.</li>
</ul>
<p class="nhan">The call tree as a table (data = [1, 2, 3, 4, 5, 6, 7], indexes 0–6)</p>
<table>
<thead><tr><th>Call</th><th>Range</th><th><code>middle</code></th><th>Inserts <code>data[middle]</code></th><th>Then calls</th></tr></thead>
<tbody>
<tr><td>1</td><td>0–6</td><td>3</td><td>4</td><td>(0,2) and (4,6)</td></tr>
<tr><td>2</td><td>0–2</td><td>1</td><td>2</td><td>(0,0) and (2,2)</td></tr>
<tr><td>3</td><td>0–0</td><td>0</td><td>1</td><td>two empty ranges</td></tr>
<tr><td>4</td><td>2–2</td><td>2</td><td>3</td><td>two empty ranges</td></tr>
<tr><td>5</td><td>4–6</td><td>5</td><td>6</td><td>(4,4) and (6,6)</td></tr>
<tr><td>6</td><td>4–4</td><td>4</td><td>5</td><td>two empty ranges</td></tr>
<tr><td>7</td><td>6–6</td><td>6</td><td>7</td><td>two empty ranges</td></tr>
</tbody>
</table>
<div class="pitfall">The order of the three lines matters. Written as <code>balance(left); insert(middle); balance(right);</code> the method inserts the keys in increasing (in-order) order and rebuilds exactly the chain it was meant to remove.</div>`,
        `<p class="y-chinh">🎯 <code>balance(data, first, last)</code> chèn phần tử giữa của đoạn, rồi cân bằng nửa trái và nửa phải — một phép đệ quy (recursion) chia để trị (divide and conquer) trên mảng đã sắp.</p>
<p>Hai phương thức của slide được chép nguyên văn bên dưới; chỉ hai dòng ghi "thêm" để in vết đệ quy, còn <code>insert</code> (chèn vào cây nhị phân tìm kiếm — BST — như phần 1, so sánh bằng <code>compareTo</code>) ghi lại thứ tự chèn:</p>
<pre><code class="language-java">class Node&lt;T&gt; {
    T info;
    Node&lt;T&gt; left, right;

    Node(T x) { info = x; }
}

class BSTree&lt;T extends Comparable&lt;T&gt;&gt; {
    Node&lt;T&gt; root;
    int depth = 0;                                   // chỉ để in vết
    String order = "";                               // các khoá theo thứ tự được chèn

    void insert(T x) {
        System.out.println(" -&gt; insert " + x);       // in vết
        order += x + " ";
        if (root == null) { root = new Node&lt;T&gt;(x); return; }
        Node&lt;T&gt; f = null, p = root;
        while (p != null) {
            if (x.compareTo(p.info) == 0) return;
            f = p;
            p = x.compareTo(p.info) &lt; 0 ? p.left : p.right;
        }
        if (x.compareTo(f.info) &lt; 0) f.left = new Node&lt;T&gt;(x); else f.right = new Node&lt;T&gt;(x);
    }

    void trace(int first, int last) {                // in "balance(first,last)", thụt lề theo độ sâu
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; depth; i++) s.append("   ");
        System.out.print(s + "balance(" + first + "," + last + ")");
        if (first &gt; last) System.out.println(" -&gt; empty range, stop");
        else System.out.print(" middle=" + (first + last) / 2);
        depth++;
    }

    public void balance(T data[], int first, int last) {
        trace(first, last);                          // thêm: in vết
        if (first &lt;= last) {
            int middle = (first + last)/2;
            insert(data[middle]);
            balance(data,first,middle-1);
            balance(data,middle+1,last);
        }
        depth--;                                     // thêm: in vết
    }
    public void balance(T data[]) {
        balance(data,0,data.length-1);
    }

    int height(Node&lt;T&gt; p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    String show(Node&lt;T&gt; p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
}

public class BalanceTrace {
    public static void main(String[] args) {
        Integer[] data = {1, 2, 3, 4, 5, 6, 7};      // đã sắp, chỉ số 0..6
        BSTree&lt;Integer&gt; t = new BSTree&lt;Integer&gt;();
        t.balance(data);
        System.out.println("insertion order: " + t.order + "  tree " + t.show(t.root) + "  height " + t.height(t.root));
    }
}</code></pre>
<div class="out">balance(0,6) middle=3 -&gt; insert 4<br>
&nbsp;&nbsp;&nbsp;balance(0,2) middle=1 -&gt; insert 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(0,0) middle=0 -&gt; insert 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(0,-1) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(1,0) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(2,2) middle=2 -&gt; insert 3<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(2,1) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(3,2) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;balance(4,6) middle=5 -&gt; insert 6<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(4,4) middle=4 -&gt; insert 5<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(4,3) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(5,4) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(6,6) middle=6 -&gt; insert 7<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(6,5) -&gt; empty range, stop<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;balance(7,6) -&gt; empty range, stop<br>
insertion order: 4 2 1 3 6 5 7 &nbsp;&nbsp;tree 4(2(1,3),6(5,7)) &nbsp;height 3</div>
<ul>
<li>Trường hợp cơ sở (base case): <code>first &gt; last</code> — đoạn rỗng, không có gì để chèn.</li>
<li>Mỗi lời gọi có đoạn không rỗng chèn đúng một khoá: n lời gọi có chèn cộng n + 1 lời gọi rỗng, tức 2n + 1 = 15 lời gọi với n = 7. Mỗi lần chèn O(log n) nên cả việc dựng lại là O(n log n).</li>
<li>Thứ tự chèn 4 2 1 3 6 5 7 chính là thứ tự duyệt <em>tiền thứ tự</em> (preorder) của cây kết quả: khoá nào cũng được chèn trước các khoá nằm dưới nó, nên rơi thẳng vào chỗ cuối cùng của mình.</li>
<li><code>middle = (first + last)/2</code> làm tròn xuống: khi số khoá chẵn, gốc là khoá nhỏ hơn trong hai khoá ở giữa.</li>
</ul>
<p class="nhan">Cây lời gọi (call tree) viết thành bảng (data = [1, 2, 3, 4, 5, 6, 7], chỉ số 0–6)</p>
<table>
<thead><tr><th>Lời gọi</th><th>Đoạn</th><th><code>middle</code></th><th>Chèn <code>data[middle]</code></th><th>Rồi gọi tiếp</th></tr></thead>
<tbody>
<tr><td>1</td><td>0–6</td><td>3</td><td>4</td><td>(0,2) và (4,6)</td></tr>
<tr><td>2</td><td>0–2</td><td>1</td><td>2</td><td>(0,0) và (2,2)</td></tr>
<tr><td>3</td><td>0–0</td><td>0</td><td>1</td><td>hai đoạn rỗng</td></tr>
<tr><td>4</td><td>2–2</td><td>2</td><td>3</td><td>hai đoạn rỗng</td></tr>
<tr><td>5</td><td>4–6</td><td>5</td><td>6</td><td>(4,4) và (6,6)</td></tr>
<tr><td>6</td><td>4–4</td><td>4</td><td>5</td><td>hai đoạn rỗng</td></tr>
<tr><td>7</td><td>6–6</td><td>6</td><td>7</td><td>hai đoạn rỗng</td></tr>
</tbody>
</table>
<div class="pitfall">Thứ tự ba dòng rất quan trọng. Viết thành <code>balance(left); insert(middle); balance(right);</code> thì phương thức chèn khoá theo thứ tự tăng dần (trung thứ tự — in-order) và dựng lại đúng cái chuỗi mà nó định xoá bỏ.</div>`],
      [7, 'Rotations on Binary Search Tree',
        `<p class="y-chinh">🎯 A rotation lifts a child above its parent in O(1) and keeps the BST order — the basic repair tool of every balanced tree.</p>
<p>The slide's rule for <strong>rotateRight(Par)</strong>, where Ch is the left child of Par:</p>
<ol>
<li>Ch becomes the new root of the subtree;</li>
<li>the right subtree of Ch becomes the left subtree of Par;</li>
<li>Par, with its subtree, becomes the right child of Ch.</li>
</ol>
<pre><code class="language-plaintext">     Par                      Ch
    /   \\                    /  \\
  Ch     C      ==&gt;         A    Par
 /  \\                           /   \\
A    B                         B     C</code></pre>
<p>The left rotation is the mirror image: Ch is the right child, and "left" and "right" trade places everywhere. A, B and C are whole subtrees, possibly empty. In the program Par = 50, Ch = 30, A = 20, B = 40, C = 70, hanging under 80:</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class Rotations {
    // Rotate Par to the right about its left child Ch; returns Ch
    static Node rotateRight(Node par) {
        Node ch = par.left;
        par.left = ch.right;                         // right subtree of Ch becomes left subtree of Par
        ch.right = par;                              // Par becomes the right child of Ch
        return ch;                                   // Ch is the new root of this subtree
    }

    // The mirror image: left and right swapped
    static Node rotateLeft(Node par) {
        Node ch = par.right;
        par.right = ch.left;
        ch.left = par;
        return ch;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static String inorder(Node p) { return p == null ? "" : inorder(p.left) + p.info + " " + inorder(p.right); }

    public static void main(String[] args) {
        // Par = 50, Ch = 30, A = 20, B = 40, C = 70, hanging under the root 80
        Node root = new Node(80, new Node(50, new Node(30, new Node(20), new Node(40)), new Node(70)), new Node(90));
        System.out.println("start:                       " + show(root) + "   in-order " + inorder(root));
        root.left = rotateRight(root.left);          // the parent must point to the new subtree root
        System.out.println("root.left = rotateRight(50): " + show(root) + "   in-order " + inorder(root));
        root.left = rotateLeft(root.left);
        System.out.println("root.left = rotateLeft(30):  " + show(root) + "   in-order " + inorder(root));
        root = rotateRight(root);                    // rotating at the root: the root itself changes
        System.out.println("root = rotateRight(80):      " + show(root) + "   in-order " + inorder(root));
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80(50(30(20,40),70),90) &nbsp;&nbsp;in-order 20 30 40 50 70 80 90<br>
root.left = rotateRight(50): 80(30(20,50(40,70)),90) &nbsp;&nbsp;in-order 20 30 40 50 70 80 90<br>
root.left = rotateLeft(30): &nbsp;80(50(30(20,40),70),90) &nbsp;&nbsp;in-order 20 30 40 50 70 80 90<br>
root = rotateRight(80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50(30(20,40),80(70,90)) &nbsp;&nbsp;in-order 20 30 40 50 70 80 90</div>
<ul>
<li><strong>Why the order survives</strong>: the in-order sequence is A Ch B Par C before and after. Only B changes parent, and B's keys lie between Ch and Par, so it fits on either side.</li>
<li><strong>Big-O</strong>: exactly three references change — <code>par.left</code>, <code>ch.right</code> and the parent's link to the subtree — so O(1), whatever the size of the tree.</li>
</ul>
<div class="pitfall"><code>rotateRight</code> returns the new subtree root, and the caller must store it: <code>root.left = rotateRight(root.left)</code>, or <code>root = rotateRight(root)</code> at the root. Forget that assignment and the grandparent still points to Par: Ch and everything in A are lost.</div>`,
        `<p class="y-chinh">🎯 Phép xoay (rotation) nhấc một nút con lên trên nút cha của nó trong O(1) mà vẫn giữ thứ tự của cây nhị phân tìm kiếm (BST) — công cụ sửa cây cơ bản của mọi loại cây cân bằng.</p>
<p>Quy tắc trên slide cho <strong>rotateRight(Par)</strong> (xoay phải Par), với Ch là con trái của Par:</p>
<ol>
<li>Ch thành gốc mới của cây con (subtree);</li>
<li>cây con phải của Ch thành cây con trái của Par;</li>
<li>Par, cùng cây con của nó, thành con phải của Ch.</li>
</ol>
<pre><code class="language-plaintext">     Par                      Ch
    /   \\                    /  \\
  Ch     C      ==&gt;         A    Par
 /  \\                           /   \\
A    B                         B     C</code></pre>
<p>Xoay trái (left rotation) là ảnh qua gương: Ch là con phải, mọi chữ "trái" và "phải" đổi chỗ cho nhau. A, B, C là cả một cây con, có thể rỗng. Trong chương trình, Par = 50, Ch = 30, A = 20, B = 40, C = 70, treo dưới nút 80:</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class Rotations {
    // Xoay Par sang phải quanh con trái Ch; trả về Ch
    static Node rotateRight(Node par) {
        Node ch = par.left;
        par.left = ch.right;                         // cây con phải của Ch thành cây con trái của Par
        ch.right = par;                              // Par thành con phải của Ch
        return ch;                                   // Ch là gốc mới của cây con này
    }

    // Đối xứng gương: đổi trái và phải
    static Node rotateLeft(Node par) {
        Node ch = par.right;
        par.right = ch.left;
        ch.left = par;
        return ch;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static String inorder(Node p) { return p == null ? "" : inorder(p.left) + p.info + " " + inorder(p.right); }

    public static void main(String[] args) {
        // Par = 50, Ch = 30, A = 20, B = 40, C = 70, treo dưới gốc 80
        Node root = new Node(80, new Node(50, new Node(30, new Node(20), new Node(40)), new Node(70)), new Node(90));
        System.out.println("start:                       " + show(root) + "   in-order " + inorder(root));
        root.left = rotateRight(root.left);          // nút cha phải trỏ vào gốc mới của cây con
        System.out.println("root.left = rotateRight(50): " + show(root) + "   in-order " + inorder(root));
        root.left = rotateLeft(root.left);
        System.out.println("root.left = rotateLeft(30):  " + show(root) + "   in-order " + inorder(root));
        root = rotateRight(root);                    // xoay tại gốc: chính gốc đổi
        System.out.println("root = rotateRight(80):      " + show(root) + "   in-order " + inorder(root));
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80(50(30(20,40),70),90) &nbsp;&nbsp;in-order 20 30 40 50 70 80 90<br>
root.left = rotateRight(50): 80(30(20,50(40,70)),90) &nbsp;&nbsp;in-order 20 30 40 50 70 80 90<br>
root.left = rotateLeft(30): &nbsp;80(50(30(20,40),70),90) &nbsp;&nbsp;in-order 20 30 40 50 70 80 90<br>
root = rotateRight(80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50(30(20,40),80(70,90)) &nbsp;&nbsp;in-order 20 30 40 50 70 80 90</div>
<ul>
<li><strong>Vì sao thứ tự được giữ</strong>: dãy trung thứ tự (in-order) là A Ch B Par C cả trước lẫn sau. Chỉ B đổi cha, mà mọi khoá trong B nằm giữa Ch và Par, nên đặt bên nào cũng đúng.</li>
<li><strong>Big-O</strong>: đúng ba tham chiếu (reference) thay đổi — <code>par.left</code>, <code>ch.right</code> và liên kết của nút cha tới cây con — nên là O(1), cây lớn cỡ nào cũng vậy.</li>
</ul>
<div class="pitfall"><code>rotateRight</code> trả về gốc mới của cây con, và nơi gọi phải gán lại: <code>root.left = rotateRight(root.left)</code>, hoặc <code>root = rotateRight(root)</code> khi xoay tại gốc. Quên phép gán đó thì nút ông vẫn trỏ vào Par: Ch và toàn bộ cây A bị mất.</div>`],
      [8, 'Rotations on Binary Search Tree demo - 1: Single rotation',
        `<p class="y-chinh">🎯 When the extra height is on the outside — under the left child's left side, or the right child's right side — one rotation towards the short side fixes it.</p>
<p class="ghi-chu">The slide shows a single rotation as a picture; the example below is the lesson's own — compare its shapes with the figure.</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

public class SingleRotation {
    static Node insert(Node p, int x) {              // plain BST insertion (recursive form)
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x); else p.right = insert(p.right, x);
        return p;
    }

    static Node rotateRight(Node par) { Node ch = par.left; par.left = ch.right; ch.right = par; return ch; }
    static Node rotateLeft(Node par) { Node ch = par.right; par.right = ch.left; ch.left = par; return ch; }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static void print(String what, Node t) {         // left/right = heights of the two subtrees of the root
        System.out.printf("%-28s %-24s left %d, right %d%n", what, show(t), height(t.left), height(t.right));
    }

    public static void main(String[] args) {
        Node t = null;
        for (int x : new int[] {40, 20, 50, 10, 30, 5, 15}) t = insert(t, x);
        print("insert 40 20 50 10 30 5 15", t);
        t = rotateRight(t);                          // left side too tall: rotate right
        print("rotateRight(40)", t);

        Node u = null;
        for (int x : new int[] {10, 20, 30}) u = insert(u, x);
        print("insert 10 20 30", u);
        u = rotateLeft(u);                           // right side too tall: rotate left
        print("rotateLeft(10)", u);
    }
}</code></pre>
<div class="out">insert 40 20 50 10 30 5 15 &nbsp;&nbsp;40(20(10(5,15),30),50) &nbsp;&nbsp;left 3, right 1<br>
rotateRight(40) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20(10(5,15),40(30,50)) &nbsp;&nbsp;left 2, right 2<br>
insert 10 20 30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10(-,20(-,30)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left 0, right 2<br>
rotateLeft(10) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20(10,30) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left 1, right 1</div>
<pre><code class="language-plaintext">insert 40 20 50 10 30 5 15          after rotateRight(40)
            40                               20
          /    \\                           /    \\
        20      50                       10      40
       /  \\                             /  \\    /  \\
     10    30                          5   15  30   50
    /  \\
   5    15</code></pre>
<ul>
<li>Before: the left subtree of 40 has height 3, the right one height 1. The extra height sits on the outside, under 10, the left child of 20.</li>
<li><code>rotateRight(40)</code>: 20 goes up, 40 goes down to the right, and 30 (the subtree B of slide 7) moves from 20's right to 40's left. Both sides now have height 2.</li>
<li>Mirror case: 10 20 30 inserted in that order make a chain leaning right; <code>rotateLeft(10)</code> puts 20 on top.</li>
</ul>
<p><strong>Big-O:</strong> one rotation, three references — O(1). The subtree loses exactly one level (height 4 → 3), which was the excess.</p>
<p class="meo">🧠 <strong>Remember:</strong> heavy on the left → rotate right; heavy on the right → rotate left. You always rotate <em>away</em> from the heavy side.</p>`,
        `<p class="y-chinh">🎯 Khi phần cao thừa nằm ở phía ngoài — bên trái của con trái, hoặc bên phải của con phải — chỉ một phép xoay về phía thấp là sửa xong (xoay đơn — single rotation).</p>
<p class="ghi-chu">Slide minh hoạ phép xoay đơn bằng hình; ví dụ dưới đây là ví dụ của bài — hãy đối chiếu hình dạng các cây với hình trên slide.</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

public class SingleRotation {
    static Node insert(Node p, int x) {              // chèn BST thường (dạng đệ quy)
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x); else p.right = insert(p.right, x);
        return p;
    }

    static Node rotateRight(Node par) { Node ch = par.left; par.left = ch.right; ch.right = par; return ch; }
    static Node rotateLeft(Node par) { Node ch = par.right; par.right = ch.left; ch.left = par; return ch; }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static void print(String what, Node t) {         // left/right = chiều cao hai cây con của gốc
        System.out.printf("%-28s %-24s left %d, right %d%n", what, show(t), height(t.left), height(t.right));
    }

    public static void main(String[] args) {
        Node t = null;
        for (int x : new int[] {40, 20, 50, 10, 30, 5, 15}) t = insert(t, x);
        print("insert 40 20 50 10 30 5 15", t);
        t = rotateRight(t);                          // bên trái quá cao: xoay phải
        print("rotateRight(40)", t);

        Node u = null;
        for (int x : new int[] {10, 20, 30}) u = insert(u, x);
        print("insert 10 20 30", u);
        u = rotateLeft(u);                           // bên phải quá cao: xoay trái
        print("rotateLeft(10)", u);
    }
}</code></pre>
<div class="out">insert 40 20 50 10 30 5 15 &nbsp;&nbsp;40(20(10(5,15),30),50) &nbsp;&nbsp;left 3, right 1<br>
rotateRight(40) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20(10(5,15),40(30,50)) &nbsp;&nbsp;left 2, right 2<br>
insert 10 20 30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10(-,20(-,30)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left 0, right 2<br>
rotateLeft(10) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20(10,30) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left 1, right 1</div>
<pre><code class="language-plaintext">chèn 40 20 50 10 30 5 15            sau rotateRight(40)
            40                               20
          /    \\                           /    \\
        20      50                       10      40
       /  \\                             /  \\    /  \\
     10    30                          5   15  30   50
    /  \\
   5    15</code></pre>
<ul>
<li>Trước: cây con trái của 40 cao 3, cây con phải cao 1. Phần cao thừa nằm ở phía ngoài, dưới 10 — con trái của 20.</li>
<li><code>rotateRight(40)</code>: 20 đi lên, 40 xuống bên phải, và 30 (chính là cây con B ở slide 7) chuyển từ bên phải 20 sang bên trái 40. Hai bên giờ đều cao 2.</li>
<li>Trường hợp đối xứng: chèn 10 20 30 theo đúng thứ tự đó tạo một chuỗi nghiêng phải; <code>rotateLeft(10)</code> đưa 20 lên đỉnh.</li>
</ul>
<p><strong>Big-O:</strong> một phép xoay, ba tham chiếu — O(1). Cây con mất đúng một mức (cao 4 → 3), đúng bằng phần thừa.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nặng bên trái → xoay phải; nặng bên phải → xoay trái. Luôn xoay <em>ra xa</em> phía nặng.</p>`],
      [9, 'Rotations on Binary Search Tree demo - 2: Double rotation',
        `<p class="y-chinh">🎯 When the extra height is on the inside — the left child's right side, or the right child's left side — one rotation only moves the problem to the other side; two rotations are needed.</p>
<p class="ghi-chu">The slide shows a double rotation as a picture; the example below is the lesson's own. It reuses 40 20 50 10 30 from slide 8, but the two extra keys now hang under 30 (inside) instead of under 10 (outside).</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

public class DoubleRotation {
    static Node insert(Node p, int x) {
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x); else p.right = insert(p.right, x);
        return p;
    }

    static Node rotateRight(Node par) { Node ch = par.left; par.left = ch.right; ch.right = par; return ch; }
    static Node rotateLeft(Node par) { Node ch = par.right; par.right = ch.left; ch.left = par; return ch; }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static void print(String what, Node t) {
        System.out.printf("%-28s %-24s left %d, right %d%n", what, show(t), height(t.left), height(t.right));
    }

    static Node build() {
        Node t = null;
        for (int x : new int[] {40, 20, 50, 10, 30, 25, 35}) t = insert(t, x);
        return t;
    }

    public static void main(String[] args) {
        Node t = build();
        print("insert 40 20 50 10 30 25 35", t);
        print("single rotateRight(40)", rotateRight(t));     // does NOT help: the mirror problem

        t = build();
        t.left = rotateLeft(t.left);                 // step 1: rotate the son 20 left
        print("step 1: rotateLeft(20)", t);
        t = rotateRight(t);                          // step 2: rotate 40 right
        print("step 2: rotateRight(40)", t);
    }
}</code></pre>
<div class="out">insert 40 20 50 10 30 25 35 &nbsp;40(20(10,30(25,35)),50) &nbsp;left 3, right 1<br>
single rotateRight(40) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20(10,40(30(25,35),50)) &nbsp;left 1, right 3<br>
step 1: rotateLeft(20) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;40(30(20(10,25),35),50) &nbsp;left 3, right 1<br>
step 2: rotateRight(40) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30(20(10,25),40(35,50)) &nbsp;left 2, right 2</div>
<pre><code class="language-plaintext">start                        step 1: rotateLeft(20)
       40                             40
      /  \\                           /  \\
    20    50                       30    50
   /  \\                           /  \\
 10    30                       20    35
      /  \\                     /  \\
    25    35                 10    25

step 2: rotateRight(40)
          30
        /    \\
      20      40
     /  \\    /  \\
   10   25  35   50</code></pre>
<ol>
<li>First rotate the <em>child</em> so that the tall part moves to the outside: <code>rotateLeft(20)</code> makes 30 the left child of 40 — now a straight left-left line.</li>
<li>Then do the single rotation of slide 8: <code>rotateRight(40)</code> lifts 30 to the top.</li>
</ol>
<ul>
<li>The key that ends on top is the grandchild 30 — the middle value of 20, 30, 40.</li>
<li>The single <code>rotateRight(40)</code> in the output only produced the mirror image: left 1, right 3, still unbalanced.</li>
</ul>
<p><strong>Big-O:</strong> two rotations, six references — still O(1).</p>
<div class="pitfall">In FE questions look at the <em>path</em> from the unbalanced node down to the tall part: left-left or right-right → single rotation; left-right or right-left (a zig-zag) → double rotation. "Single rotation" for a zig-zag is the most common wrong option.</div>`,
        `<p class="y-chinh">🎯 Khi phần cao thừa nằm ở phía trong — bên phải của con trái, hoặc bên trái của con phải — một phép xoay chỉ đẩy vấn đề sang phía bên kia; cần hai phép xoay (xoay kép — double rotation).</p>
<p class="ghi-chu">Slide minh hoạ phép xoay kép bằng hình; ví dụ dưới đây là ví dụ của bài. Nó dùng lại 40 20 50 10 30 của slide 8, nhưng hai khoá thêm giờ treo dưới 30 (phía trong) thay vì dưới 10 (phía ngoài).</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

public class DoubleRotation {
    static Node insert(Node p, int x) {
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x); else p.right = insert(p.right, x);
        return p;
    }

    static Node rotateRight(Node par) { Node ch = par.left; par.left = ch.right; ch.right = par; return ch; }
    static Node rotateLeft(Node par) { Node ch = par.right; par.right = ch.left; ch.left = par; return ch; }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    static void print(String what, Node t) {
        System.out.printf("%-28s %-24s left %d, right %d%n", what, show(t), height(t.left), height(t.right));
    }

    static Node build() {
        Node t = null;
        for (int x : new int[] {40, 20, 50, 10, 30, 25, 35}) t = insert(t, x);
        return t;
    }

    public static void main(String[] args) {
        Node t = build();
        print("insert 40 20 50 10 30 25 35", t);
        print("single rotateRight(40)", rotateRight(t));     // KHÔNG ăn thua: lệch sang phía đối diện

        t = build();
        t.left = rotateLeft(t.left);                 // bước 1: xoay con 20 sang trái
        print("step 1: rotateLeft(20)", t);
        t = rotateRight(t);                          // bước 2: xoay 40 sang phải
        print("step 2: rotateRight(40)", t);
    }
}</code></pre>
<div class="out">insert 40 20 50 10 30 25 35 &nbsp;40(20(10,30(25,35)),50) &nbsp;left 3, right 1<br>
single rotateRight(40) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20(10,40(30(25,35),50)) &nbsp;left 1, right 3<br>
step 1: rotateLeft(20) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;40(30(20(10,25),35),50) &nbsp;left 3, right 1<br>
step 2: rotateRight(40) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30(20(10,25),40(35,50)) &nbsp;left 2, right 2</div>
<pre><code class="language-plaintext">ban đầu                      bước 1: rotateLeft(20)
       40                             40
      /  \\                           /  \\
    20    50                       30    50
   /  \\                           /  \\
 10    30                       20    35
      /  \\                     /  \\
    25    35                 10    25

bước 2: rotateRight(40)
          30
        /    \\
      20      40
     /  \\    /  \\
   10   25  35   50</code></pre>
<ol>
<li>Xoay <em>nút con</em> trước để phần cao chuyển ra phía ngoài: <code>rotateLeft(20)</code> đưa 30 thành con trái của 40 — giờ là một đường thẳng trái-trái.</li>
<li>Sau đó làm phép xoay đơn của slide 8: <code>rotateRight(40)</code> nhấc 30 lên đỉnh.</li>
</ol>
<ul>
<li>Khoá lên đỉnh là nút cháu 30 — giá trị ở giữa của bộ ba 20, 30, 40.</li>
<li>Phép <code>rotateRight(40)</code> đơn lẻ trong output chỉ tạo ra ảnh qua gương: trái 1, phải 3, vẫn mất cân bằng.</li>
</ul>
<p><strong>Big-O:</strong> hai phép xoay, sáu tham chiếu — vẫn là O(1).</p>
<div class="pitfall">Với câu hỏi FE (thi cuối kỳ), nhìn <em>đường đi</em> từ nút mất cân bằng xuống phần cao: trái-trái hoặc phải-phải → xoay đơn; trái-phải hoặc phải-trái (hình zic-zắc) → xoay kép. Chọn "xoay đơn" cho hình zic-zắc là phương án sai hay gặp nhất.</div>`],
      [10, 'AVL Trees',
        `<p class="y-chinh">🎯 An AVL tree (named after Adelson-Velskii and Landis) is a binary search tree that is height-balanced at every node: each node's balance factor must be −1, 0 or +1.</p>
<ul>
<li><strong>Balance factor</strong> (slide): <code>bf = height(right) - height(left)</code>. +1 = the right side is one level taller, −1 = the left side is, ±2 = broken.</li>
<li><strong>AVL = BST + the balance condition</strong>, checked at <em>every</em> node, not only at the root. Searching uses exactly the BST search code; the only difference is the guaranteed height.</li>
<li><strong>Why it is fast</strong>: the fewest nodes an AVL tree of height h can have is N(h) = N(h−1) + N(h−2) + 1 (1, 2, 4, 7, 12, 20…), a Fibonacci-like growth, so the height stays below 1.44·log₂(n+2) — search is O(log n) even in the worst case.</li>
</ul>
<p class="ghi-chu">The "Examples of AVL trees" part of the slide is a figure; trees A, B and C below are the lesson's own examples.</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

public class BalanceFactor {
    static boolean avl;

    static Node insert(Node p, int x) {              // plain BST insertion, no balancing
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x); else p.right = insert(p.right, x);
        return p;
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    static int bf(Node p) { return height(p.right) - height(p.left); }   // slide 10

    static String factors(Node p) {                  // "key:bf" of every node, in order; checks |bf| &lt;= 1
        if (p == null) return "";
        int b = bf(p);
        if (b &lt; -1 || b &gt; 1) avl = false;
        return factors(p.left) + p.info + ":" + (b &gt; 0 ? "+" : "") + b + " " + factors(p.right);
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        int[][] orders = { {44, 17, 78, 32, 50, 88, 48, 62}, {44, 17, 78, 32, 50, 88, 48, 62, 54}, {50, 30, 70, 20, 80, 10, 90} };
        Node b = null;
        for (int k = 0; k &lt; orders.length; k++) {
            Node t = null;
            for (int x : orders[k]) t = insert(t, x);
            if (k == 1) b = t;
            avl = true;
            String f = factors(t);
            System.out.println("ABC".charAt(k) + " = " + show(t));
            System.out.println("    " + f + " -&gt; " + (avl ? "AVL" : "not AVL"));
        }
        Node n78 = b.right;                          // node 78 of tree B
        int other = height(n78.left) - height(n78.right);
        System.out.println("node 78 of B: h(R)-h(L) = " + bf(n78) + " (slide), h(L)-h(R) = +" + other + " (other books)");
    }
}</code></pre>
<div class="out">A = 44(17(-,32),78(50(48,62),88))<br>
&nbsp;&nbsp;&nbsp;&nbsp;17:+1 32:0 44:+1 48:0 50:0 62:0 78:-1 88:0 &nbsp;-&gt; AVL<br>
B = 44(17(-,32),78(50(48,62(54,-)),88))<br>
&nbsp;&nbsp;&nbsp;&nbsp;17:+1 32:0 44:+2 48:0 50:+1 54:0 62:-1 78:-2 88:0 &nbsp;-&gt; not AVL<br>
C = 50(30(20(10,-),-),70(-,80(-,90)))<br>
&nbsp;&nbsp;&nbsp;&nbsp;10:0 20:-1 30:-2 50:0 70:+2 80:+1 90:0 &nbsp;-&gt; not AVL<br>
node 78 of B: h(R)-h(L) = -2 (slide), h(L)-h(R) = +2 (other books)</div>
<p>Tree A is an AVL tree. Tree B is A plus the key 54 inserted as in a plain BST: 44 (+2) and 78 (−2) break the rule — slide 12 repairs exactly this tree. Tree C has a perfect root (0) and is still not AVL: 30 is −2 and 70 is +2.</p>
<p class="meo">🧠 <strong>Remember:</strong> on the slides bf = right − left, so "+" leans right and "−" leans left.</p>
<div class="pitfall">The sign convention differs between sources: the slide uses right − left, while lesson 4.6 of this course (and many other books) uses left − right. It is the same tree with the sign flipped — 78 is −2 here, +2 there. In the exam use the formula the question gives, and read "±2" as "unbalanced".</div>`,
        `<p class="y-chinh">🎯 Cây AVL (đặt theo tên Adelson-Velskii và Landis) là cây nhị phân tìm kiếm (BST) cân bằng theo chiều cao (height-balanced) ở mọi nút: hệ số cân bằng (balance factor) của mỗi nút chỉ được là −1, 0 hoặc +1.</p>
<ul>
<li><strong>Hệ số cân bằng</strong> (slide): <code>bf = height(right) - height(left)</code> — chiều cao cây con phải trừ chiều cao cây con trái. +1 = bên phải cao hơn một mức, −1 = bên trái cao hơn một mức, ±2 = hỏng.</li>
<li><strong>AVL = BST + điều kiện cân bằng</strong>, kiểm ở <em>mọi</em> nút chứ không riêng gốc. Tìm kiếm dùng y nguyên code tìm của BST; khác biệt duy nhất là chiều cao được bảo đảm.</li>
<li><strong>Vì sao nhanh</strong>: số nút ít nhất mà một cây AVL cao h có thể có là N(h) = N(h−1) + N(h−2) + 1 (1, 2, 4, 7, 12, 20…), tăng kiểu dãy Fibonacci, nên chiều cao luôn dưới 1,44·log₂(n+2) — tìm kiếm O(log n) kể cả trong trường hợp xấu nhất.</li>
</ul>
<p class="ghi-chu">Phần "Examples of AVL trees" (các ví dụ cây AVL) của slide là hình; các cây A, B, C dưới đây là ví dụ riêng của bài.</p>
<pre><code class="language-java">class Node {
    int info;
    Node left, right;

    Node(int x) { info = x; }
}

public class BalanceFactor {
    static boolean avl;

    static Node insert(Node p, int x) {              // chèn BST thường, không cân bằng
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x); else p.right = insert(p.right, x);
        return p;
    }

    static int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    static int bf(Node p) { return height(p.right) - height(p.left); }   // đúng slide 10

    static String factors(Node p) {                  // "khoá:bf" của mọi nút theo trung thứ tự; kiểm |bf| &lt;= 1
        if (p == null) return "";
        int b = bf(p);
        if (b &lt; -1 || b &gt; 1) avl = false;
        return factors(p.left) + p.info + ":" + (b &gt; 0 ? "+" : "") + b + " " + factors(p.right);
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        int[][] orders = { {44, 17, 78, 32, 50, 88, 48, 62}, {44, 17, 78, 32, 50, 88, 48, 62, 54}, {50, 30, 70, 20, 80, 10, 90} };
        Node b = null;
        for (int k = 0; k &lt; orders.length; k++) {
            Node t = null;
            for (int x : orders[k]) t = insert(t, x);
            if (k == 1) b = t;
            avl = true;
            String f = factors(t);
            System.out.println("ABC".charAt(k) + " = " + show(t));
            System.out.println("    " + f + " -&gt; " + (avl ? "AVL" : "not AVL"));
        }
        Node n78 = b.right;                          // nút 78 của cây B
        int other = height(n78.left) - height(n78.right);
        System.out.println("node 78 of B: h(R)-h(L) = " + bf(n78) + " (slide), h(L)-h(R) = +" + other + " (other books)");
    }
}</code></pre>
<div class="out">A = 44(17(-,32),78(50(48,62),88))<br>
&nbsp;&nbsp;&nbsp;&nbsp;17:+1 32:0 44:+1 48:0 50:0 62:0 78:-1 88:0 &nbsp;-&gt; AVL<br>
B = 44(17(-,32),78(50(48,62(54,-)),88))<br>
&nbsp;&nbsp;&nbsp;&nbsp;17:+1 32:0 44:+2 48:0 50:+1 54:0 62:-1 78:-2 88:0 &nbsp;-&gt; not AVL<br>
C = 50(30(20(10,-),-),70(-,80(-,90)))<br>
&nbsp;&nbsp;&nbsp;&nbsp;10:0 20:-1 30:-2 50:0 70:+2 80:+1 90:0 &nbsp;-&gt; not AVL<br>
node 78 of B: h(R)-h(L) = -2 (slide), h(L)-h(R) = +2 (other books)</div>
<p>Cây A là cây AVL. Cây B là A chèn thêm khoá 54 theo kiểu BST thường: 44 (+2) và 78 (−2) phá luật — slide 12 sửa đúng cây này. Cây C có gốc "hoàn hảo" (0) mà vẫn không phải AVL: 30 là −2 và 70 là +2.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trên slide bf = phải − trái, nên dấu "+" là nghiêng phải, dấu "−" là nghiêng trái.</p>
<div class="pitfall">Quy ước dấu khác nhau giữa các tài liệu: slide dùng phải − trái, còn bài 4.6 của khoá này (và nhiều sách khác) dùng trái − phải. Cùng một cây, chỉ đổi dấu — 78 ở đây là −2, bên kia là +2. Đi thi hãy dùng đúng công thức đề cho, và hiểu "±2" là "mất cân bằng".</div>`],
      [11, 'Insertion algorithm in an AVL Tree',
        `<p class="y-chinh">🎯 Insert as in a BST, walk back up recalculating balance factors, and at the first node p that reaches ±2 do one single or double rotation — then stop.</p>
<ol>
<li>Insert the node as in a binary search tree.</li>
<li>Recalculate the balance factors from the new node back to the root. No factor is −2 or +2 → stop.</li>
<li>At the first node p with ±2, look at its son q on the taller side: same sign as p → single rotation of p; different signs → double rotation, first q, then p.</li>
<li>Direction rule: left unbalance (−2) → right rotation; right unbalance (+2) → left rotation.</li>
</ol>
<p>The program below does exactly this, recursively: <code>insert</code> goes down, and on the way back every node passes through <code>balance</code>, which is the "recalculate, and rotate if ±2" step. Its log names p, q and the rotations:</p>
<pre><code class="language-java">class Node {
    int info, height = 1;                            // a new node is a leaf: height 1 (slides' convention)
    Node left, right;

    Node(int x) { info = x; }
}

class AVLTree {
    Node root;
    String log = "";                                 // rotations done by the last operation

    int h(Node p) { return p == null ? 0 : p.height; }
    int bf(Node p) { return h(p.right) - h(p.left); }          // slide 10: height(right) - height(left)
    void fix(Node p) { p.height = 1 + Math.max(h(p.left), h(p.right)); }
    String sgn(int b) { return b &gt; 0 ? "+" + b : "" + b; }

    Node rotateRight(Node par) { Node ch = par.left; par.left = ch.right; ch.right = par; fix(par); fix(ch); return ch; }
    Node rotateLeft(Node par) { Node ch = par.right; par.right = ch.left; ch.left = par; fix(par); fix(ch); return ch; }

    Node balance(Node p) {                           // recalculate p; rotate if its factor is -2 or +2
        fix(p);
        int b = bf(p);
        if (b &gt; -2 &amp;&amp; b &lt; 2) return p;               // still balanced
        Node q = b &lt; 0 ? p.left : p.right;           // the son on the taller side
        int c = bf(q);
        String how;
        if (b &lt; 0 &amp;&amp; c &gt; 0) { p.left = rotateLeft(q); how = "signs differ: rotateLeft(" + q.info + "), rotateRight(" + p.info + ")"; }
        else if (b &gt; 0 &amp;&amp; c &lt; 0) { p.right = rotateRight(q); how = "signs differ: rotateRight(" + q.info + "), rotateLeft(" + p.info + ")"; }
        else how = (c == 0 ? "q is 0" : "same sign") + ": " + (b &lt; 0 ? "rotateRight(" : "rotateLeft(") + p.info + ")";
        log += "\\n   p=" + p.info + "(" + sgn(b) + ") q=" + q.info + "(" + sgn(c) + ") " + how;
        return b &lt; 0 ? rotateRight(p) : rotateLeft(p);   // left unbalance -&gt; right rotation, and vice versa
    }

    Node insert(Node p, int x) {                     // insert as in a BST ...
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x);
        else if (x &gt; p.info) p.right = insert(p.right, x);
        else return p;                               // the key is already there
        return balance(p);                           // ... then check every node on the way back to the root
    }

    void insert(int x) { log = ""; root = insert(root, x); }

    String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
}

public class AvlInsert {
    public static void main(String[] args) {
        AVLTree t = new AVLTree();
        for (int x : new int[] {10, 20, 30, 25, 28, 5, 3, 40, 35}) {
            t.insert(x);
            System.out.println("insert " + x + ": " + t.show(t.root) + t.log);
        }
    }
}</code></pre>
<div class="out">insert 10: 10<br>
insert 20: 10(-,20)<br>
insert 30: 20(10,30)<br>
&nbsp;&nbsp;&nbsp;p=10(+2) q=20(+1) same sign: rotateLeft(10)<br>
insert 25: 20(10,30(25,-))<br>
insert 28: 20(10,28(25,30))<br>
&nbsp;&nbsp;&nbsp;p=30(-2) q=25(+1) signs differ: rotateLeft(25), rotateRight(30)<br>
insert 5: 20(10(5,-),28(25,30))<br>
insert 3: 20(5(3,10),28(25,30))<br>
&nbsp;&nbsp;&nbsp;p=10(-2) q=5(-1) same sign: rotateRight(10)<br>
insert 40: 20(5(3,10),28(25,30(-,40)))<br>
insert 35: 20(5(3,10),28(25,35(30,40)))<br>
&nbsp;&nbsp;&nbsp;p=30(+2) q=40(-1) signs differ: rotateRight(40), rotateLeft(30)</div>
<p class="nhan">The four rotations of the run</p>
<table>
<thead><tr><th>Insert</th><th>p (bf)</th><th>son q (bf)</th><th>Signs</th><th>Rotation(s)</th><th>Subtree after</th></tr></thead>
<tbody>
<tr><td>30</td><td>10 (+2)</td><td>20 (+1)</td><td>same</td><td>rotateLeft(10)</td><td>20(10,30) — the whole tree</td></tr>
<tr><td>28</td><td>30 (-2)</td><td>25 (+1)</td><td>differ</td><td>rotateLeft(25), rotateRight(30)</td><td>28(25,30) under 20</td></tr>
<tr><td>3</td><td>10 (-2)</td><td>5 (-1)</td><td>same</td><td>rotateRight(10)</td><td>5(3,10) under 20</td></tr>
<tr><td>35</td><td>30 (+2)</td><td>40 (-1)</td><td>differ</td><td>rotateRight(40), rotateLeft(30)</td><td>35(30,40) under 28</td></tr>
</tbody>
</table>
<p>Why at most one rotation (the slide's last point): after the rotation the subtree has exactly the height it had <em>before</em> the insertion, so no ancestor of p sees any change. The run confirms it — never more than one rotation per insert.</p>
<p><strong>Big-O:</strong> O(log n) down + O(log n) back up + O(1) for the rotation = O(log n) per insertion.</p>
<div class="pitfall">p is the <em>first</em> unbalanced node on the way up from the new node — the lowest one, not the root. On slide 12 both 78 and 44 reach ±2, and only 78 is rotated.</div>`,
        `<p class="y-chinh">🎯 Chèn như cây nhị phân tìm kiếm (BST), đi ngược lên tính lại hệ số cân bằng (balance factor), và tại nút p đầu tiên chạm ±2 thì xoay một lần, đơn hoặc kép — rồi dừng.</p>
<ol>
<li>Chèn nút như trong BST.</li>
<li>Tính lại hệ số cân bằng từ nút mới ngược về gốc. Không nút nào là −2 hay +2 → dừng.</li>
<li>Tại nút p đầu tiên có ±2, xét con q của nó ở phía cao hơn: q cùng dấu với p → xoay đơn (single rotation) p; khác dấu → xoay kép (double rotation): xoay q trước, rồi xoay p.</li>
<li>Luật chiều xoay: lệch trái (−2) → xoay phải; lệch phải (+2) → xoay trái.</li>
</ol>
<p>Chương trình dưới làm đúng như vậy bằng đệ quy (recursion): <code>insert</code> đi xuống, và trên đường quay về mỗi nút đi qua <code>balance</code> — chính là bước "tính lại, gặp ±2 thì xoay". Dòng nhật ký ghi rõ p, q và các phép xoay:</p>
<pre><code class="language-java">class Node {
    int info, height = 1;                            // nút mới là lá: chiều cao 1 (quy ước slide)
    Node left, right;

    Node(int x) { info = x; }
}

class AVLTree {
    Node root;
    String log = "";                                 // các phép xoay của thao tác vừa rồi

    int h(Node p) { return p == null ? 0 : p.height; }
    int bf(Node p) { return h(p.right) - h(p.left); }          // slide 10: height(phải) - height(trái)
    void fix(Node p) { p.height = 1 + Math.max(h(p.left), h(p.right)); }
    String sgn(int b) { return b &gt; 0 ? "+" + b : "" + b; }

    Node rotateRight(Node par) { Node ch = par.left; par.left = ch.right; ch.right = par; fix(par); fix(ch); return ch; }
    Node rotateLeft(Node par) { Node ch = par.right; par.right = ch.left; ch.left = par; fix(par); fix(ch); return ch; }

    Node balance(Node p) {                           // tính lại p; xoay nếu hệ số là -2 hoặc +2
        fix(p);
        int b = bf(p);
        if (b &gt; -2 &amp;&amp; b &lt; 2) return p;               // vẫn cân bằng
        Node q = b &lt; 0 ? p.left : p.right;           // người con ở phía cao hơn
        int c = bf(q);
        String how;
        if (b &lt; 0 &amp;&amp; c &gt; 0) { p.left = rotateLeft(q); how = "signs differ: rotateLeft(" + q.info + "), rotateRight(" + p.info + ")"; }
        else if (b &gt; 0 &amp;&amp; c &lt; 0) { p.right = rotateRight(q); how = "signs differ: rotateRight(" + q.info + "), rotateLeft(" + p.info + ")"; }
        else how = (c == 0 ? "q is 0" : "same sign") + ": " + (b &lt; 0 ? "rotateRight(" : "rotateLeft(") + p.info + ")";
        log += "\\n   p=" + p.info + "(" + sgn(b) + ") q=" + q.info + "(" + sgn(c) + ") " + how;
        return b &lt; 0 ? rotateRight(p) : rotateLeft(p);   // lệch trái -&gt; xoay phải, và ngược lại
    }

    Node insert(Node p, int x) {                     // chèn như BST ...
        if (p == null) return new Node(x);
        if (x &lt; p.info) p.left = insert(p.left, x);
        else if (x &gt; p.info) p.right = insert(p.right, x);
        else return p;                               // khoá đã có
        return balance(p);                           // ... rồi kiểm từng nút trên đường quay về gốc
    }

    void insert(int x) { log = ""; root = insert(root, x); }

    String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }
}

public class AvlInsert {
    public static void main(String[] args) {
        AVLTree t = new AVLTree();
        for (int x : new int[] {10, 20, 30, 25, 28, 5, 3, 40, 35}) {
            t.insert(x);
            System.out.println("insert " + x + ": " + t.show(t.root) + t.log);
        }
    }
}</code></pre>
<div class="out">insert 10: 10<br>
insert 20: 10(-,20)<br>
insert 30: 20(10,30)<br>
&nbsp;&nbsp;&nbsp;p=10(+2) q=20(+1) same sign: rotateLeft(10)<br>
insert 25: 20(10,30(25,-))<br>
insert 28: 20(10,28(25,30))<br>
&nbsp;&nbsp;&nbsp;p=30(-2) q=25(+1) signs differ: rotateLeft(25), rotateRight(30)<br>
insert 5: 20(10(5,-),28(25,30))<br>
insert 3: 20(5(3,10),28(25,30))<br>
&nbsp;&nbsp;&nbsp;p=10(-2) q=5(-1) same sign: rotateRight(10)<br>
insert 40: 20(5(3,10),28(25,30(-,40)))<br>
insert 35: 20(5(3,10),28(25,35(30,40)))<br>
&nbsp;&nbsp;&nbsp;p=30(+2) q=40(-1) signs differ: rotateRight(40), rotateLeft(30)</div>
<p class="nhan">Bốn lần xoay trong lần chạy trên</p>
<table>
<thead><tr><th>Chèn</th><th>p (bf)</th><th>con q (bf)</th><th>Dấu</th><th>Phép xoay</th><th>Cây con sau đó</th></tr></thead>
<tbody>
<tr><td>30</td><td>10 (+2)</td><td>20 (+1)</td><td>cùng dấu</td><td>rotateLeft(10)</td><td>20(10,30) — cả cây</td></tr>
<tr><td>28</td><td>30 (-2)</td><td>25 (+1)</td><td>khác dấu</td><td>rotateLeft(25), rotateRight(30)</td><td>28(25,30) dưới 20</td></tr>
<tr><td>3</td><td>10 (-2)</td><td>5 (-1)</td><td>cùng dấu</td><td>rotateRight(10)</td><td>5(3,10) dưới 20</td></tr>
<tr><td>35</td><td>30 (+2)</td><td>40 (-1)</td><td>khác dấu</td><td>rotateRight(40), rotateLeft(30)</td><td>35(30,40) dưới 28</td></tr>
</tbody>
</table>
<p>Vì sao nhiều nhất một lần xoay (ý cuối của slide): sau khi xoay, cây con có đúng chiều cao nó có <em>trước</em> khi chèn, nên không tổ tiên (ancestor) nào của p thấy thay đổi. Lần chạy xác nhận điều đó — mỗi lần chèn không bao giờ quá một lần xoay.</p>
<p><strong>Big-O:</strong> O(log n) đi xuống + O(log n) quay lên + O(1) cho phép xoay = O(log n) mỗi lần chèn.</p>
<div class="pitfall">p là nút mất cân bằng <em>đầu tiên</em> tính từ nút mới đi lên — nút thấp nhất, không phải gốc. Ở slide 12 cả 78 lẫn 44 đều chạm ±2, nhưng chỉ 78 được xoay.</div>`],
      [12, 'Insertion in an AVL Tree demo',
        `<p class="y-chinh">🎯 Inserting 54 makes the first unbalanced node from the bottom, 78, lean left (−2) while its son 50 leans right (+1) — a zig-zag, fixed by one double rotation that lifts 62.</p>
<p class="ghi-chu">The slide is a figure titled "Balancing a tree after insertion the key 54". The same key 54 is the worked insertion example of Goodrich §11.3, the course textbook; that example is rebuilt below — compare it with the picture on the slide.</p>
<pre><code class="language-java">AVLTree t = new AVLTree(), u = new AVLTree();
for (int x : new int[] {44, 17, 78, 32, 50, 88, 48, 62}) { t.insert(x); u.insert(x); }   // no rotation needed
System.out.println("AVL tree:        " + t.show(t.root));
System.out.println("   bf " + t.bfs(t.root));
u.balancing = false;                         // plain BST insertion of 54, just to see the factors
u.insert(54);
System.out.println("BST insert 54:   " + u.show(u.root));
System.out.println("   bf " + u.bfs(u.root));
t.insert(54);                                // the real AVL insertion
System.out.println("AVL insert 54:   " + t.show(t.root) + t.log);
System.out.println("   bf " + t.bfs(t.root));</code></pre>
<p>Output — the AVL class is the one of slide 11, plus a switch that turns rebalancing off in the second tree, only to show the factors before the repair:</p>
<div class="out">AVL tree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;44(17(-,32),78(50(48,62),88))<br>
&nbsp;&nbsp;&nbsp;bf 17:+1 32:0 44:+1 48:0 50:0 62:0 78:-1 88:0<br>
BST insert 54: &nbsp;&nbsp;44(17(-,32),78(50(48,62(54,-)),88))<br>
&nbsp;&nbsp;&nbsp;bf 17:+1 32:0 44:+2 48:0 50:+1 54:0 62:-1 78:-2 88:0<br>
AVL insert 54: &nbsp;&nbsp;44(17(-,32),62(50(48,54),78(-,88)))<br>
&nbsp;&nbsp;&nbsp;p=78(-2) q=50(+1) signs differ: rotateLeft(50), rotateRight(78)<br>
&nbsp;&nbsp;&nbsp;bf 17:+1 32:0 44:+1 48:0 50:0 54:0 62:0 78:+1 88:0</div>
<pre><code class="language-plaintext">BST insertion of 54, before the repair
             44[+2]
           /        \\
     17[+1]          78[-2]  &lt;- p
           \\        /      \\
           32   50[+1]      88
               /      \\
             48        62[-1]
                      /
                    54

after rotateLeft(50), rotateRight(78)
             44[+1]
           /        \\
     17[+1]          62[0]
           \\        /     \\
           32   50[0]      78[+1]
               /    \\          \\
             48      54         88</code></pre>
<ol>
<li>54 goes right at 44, left at 78, right at 50, left at 62: a new leaf under 62. (Numbers in [ ] are balance factors; leaves are 0.)</li>
<li>Going up: 62 is −1, 50 is +1, 78 is −2 → p = 78; its taller son is q = 50, with +1.</li>
<li>Signs differ → double rotation: <code>rotateLeft(50)</code>, then <code>rotateRight(78)</code>. The middle key of 50, 62, 78 — that is 62 — becomes the root of the subtree.</li>
<li>The subtree is back to height 3, as before the insertion, so 44 returns to +1 on its own — no second rotation.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> in a double rotation the grandchild (here 62) always ends on top, with the other two as its children.</p>`,
        `<p class="y-chinh">🎯 Chèn 54 làm nút mất cân bằng đầu tiên tính từ dưới lên, 78, lệch trái (−2) trong khi con 50 của nó lệch phải (+1) — hình zic-zắc, sửa bằng một lần xoay kép (double rotation) đưa 62 lên.</p>
<p class="ghi-chu">Slide là một hình có tiêu đề "Balancing a tree after insertion the key 54" (cân bằng cây sau khi chèn khoá 54). Khoá 54 cũng chính là ví dụ chèn có lời giải trong Goodrich §11.3, giáo trình của môn; ví dụ đó được dựng lại dưới đây — hãy đối chiếu với hình trên slide.</p>
<pre><code class="language-java">AVLTree t = new AVLTree(), u = new AVLTree();
for (int x : new int[] {44, 17, 78, 32, 50, 88, 48, 62}) { t.insert(x); u.insert(x); }   // không cần xoay lần nào
System.out.println("AVL tree:        " + t.show(t.root));
System.out.println("   bf " + t.bfs(t.root));
u.balancing = false;                         // chèn 54 kiểu BST thường, chỉ để xem hệ số
u.insert(54);
System.out.println("BST insert 54:   " + u.show(u.root));
System.out.println("   bf " + u.bfs(u.root));
t.insert(54);                                // chèn AVL thật
System.out.println("AVL insert 54:   " + t.show(t.root) + t.log);
System.out.println("   bf " + t.bfs(t.root));</code></pre>
<p>Output — lớp AVL là lớp của slide 11, thêm một công tắc tắt việc cân bằng ở cây thứ hai, chỉ để xem hệ số trước khi sửa:</p>
<div class="out">AVL tree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;44(17(-,32),78(50(48,62),88))<br>
&nbsp;&nbsp;&nbsp;bf 17:+1 32:0 44:+1 48:0 50:0 62:0 78:-1 88:0<br>
BST insert 54: &nbsp;&nbsp;44(17(-,32),78(50(48,62(54,-)),88))<br>
&nbsp;&nbsp;&nbsp;bf 17:+1 32:0 44:+2 48:0 50:+1 54:0 62:-1 78:-2 88:0<br>
AVL insert 54: &nbsp;&nbsp;44(17(-,32),62(50(48,54),78(-,88)))<br>
&nbsp;&nbsp;&nbsp;p=78(-2) q=50(+1) signs differ: rotateLeft(50), rotateRight(78)<br>
&nbsp;&nbsp;&nbsp;bf 17:+1 32:0 44:+1 48:0 50:0 54:0 62:0 78:+1 88:0</div>
<pre><code class="language-plaintext">chèn 54 kiểu BST, trước khi sửa
             44[+2]
           /        \\
     17[+1]          78[-2]  &lt;- p
           \\        /      \\
           32   50[+1]      88
               /      \\
             48        62[-1]
                      /
                    54

sau rotateLeft(50), rotateRight(78)
             44[+1]
           /        \\
     17[+1]          62[0]
           \\        /     \\
           32   50[0]      78[+1]
               /    \\          \\
             48      54         88</code></pre>
<ol>
<li>54 rẽ phải ở 44, trái ở 78, phải ở 50, trái ở 62: thành một lá (leaf) mới dưới 62. (Số trong [ ] là hệ số cân bằng; lá có hệ số 0.)</li>
<li>Đi ngược lên: 62 là −1, 50 là +1, 78 là −2 → p = 78; con ở phía cao hơn là q = 50, hệ số +1.</li>
<li>Khác dấu → xoay kép: <code>rotateLeft(50)</code>, rồi <code>rotateRight(78)</code>. Khoá ở giữa của bộ ba 50, 62, 78 — tức 62 — thành gốc của cây con.</li>
<li>Cây con trở lại cao 3 như trước khi chèn, nên 44 tự về +1 — không cần lần xoay thứ hai.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trong phép xoay kép, nút cháu (ở đây là 62) luôn lên đỉnh, hai nút còn lại thành hai con của nó.</p>`],
      [13, 'Deletion algorithm in an AVL Tree',
        `<p class="y-chinh">🎯 Deletion follows the same steps as insertion with one difference: a rotation may leave the subtree one level shorter, so the check must continue upward — sometimes rotating again, as far as the root.</p>
<ol>
<li>Delete the node as in a BST; a node with two children gets the key of its predecessor (the rightmost node of its left subtree), as in part 1.</li>
<li>Recalculate the balance factors from the place of the deleted node back to the root.</li>
<li>At every node with −2 or +2, rotate by the rule of insertion: same sign → single, different signs → double.</li>
<li>Unlike insertion, do not stop after the first rotation — keep checking every ancestor.</li>
</ol>
<pre><code class="language-java">Node delete(Node p, int x) {                     // delete as in a BST ...
    if (p == null) return null;                  // x is not in the tree
    if (x &lt; p.info) p.left = delete(p.left, x);
    else if (x &gt; p.info) p.right = delete(p.right, x);
    else if (p.left == null) return p.right;     // a leaf, or only a right child
    else if (p.right == null) return p.left;     // only a left child
    else {                                       // two children: copy the predecessor (part 1)
        Node q = p.left;
        while (q.right != null) q = q.right;     // rightmost node of the left subtree
        p.info = q.info;
        p.left = delete(p.left, q.info);
    }
    return balance(p);                           // ... then check every node on the way back to the root
}

void delete(int x) { log = ""; root = delete(root, x); }</code></pre>
<p>Output of the full program — the AVL class of slide 11 plus this <code>delete</code> — on the lesson's own 12-node tree:</p>
<div class="out">AVL tree: &nbsp;8(5(3(2(1,-),4),7(6,-)),11(10(9,-),12)) &nbsp;&nbsp;height 5<br>
delete 12: 5(3(2(1,-),4),8(7(6,-),10(9,11))) &nbsp;&nbsp;height 4<br>
&nbsp;&nbsp;&nbsp;p=11(-2) q=10(-1) same sign: rotateRight(11)<br>
&nbsp;&nbsp;&nbsp;p=8(-2) q=5(-1) same sign: rotateRight(8)<br>
delete 5: &nbsp;4(2(1,3),8(7(6,-),10(9,11))) &nbsp;&nbsp;height 4<br>
&nbsp;&nbsp;&nbsp;p=3(-2) q=2(-1) same sign: rotateRight(3)</div>
<pre><code class="language-plaintext">before
                  8[-1]
              /          \\
         5[-1]            11[-1]
        /     \\          /      \\
    3[-1]     7[-1]   10[-1]     12
   /    \\     /       /
 2[-1]   4   6       9
  /
 1

after delete 12: rotateRight(11), then rotateRight(8)
               5[0]
            /        \\
        3[-1]          8[0]
       /     \\       /      \\
   2[-1]      4   7[-1]     10[0]
   /              /        /    \\
  1              6        9      11</code></pre>
<ul>
<li>Deleting 12 leaves 11 at −2 → <code>rotateRight(11)</code>. That subtree drops from height 3 to 2, so the root 8 becomes −2 → a second rotation, at the root.</li>
<li>Deleting 5 (two children): its predecessor 4 is copied up, and removing 4 below leaves 3 at −2 → one more rotation.</li>
</ul>
<p><strong>Big-O:</strong> O(log n) levels, at most one single or double rotation per level → O(log n) per deletion, even when it rotates all the way up.</p>
<div class="pitfall">In deletion the son q may have balance factor 0 (both of its subtrees equally tall), a case the slide's "same sign / different signs" rule does not mention. Treat 0 like "same sign": single rotation. A double rotation there can leave the tree unbalanced. Slide 14 has exactly this case.</div>`,
        `<p class="y-chinh">🎯 Xoá đi theo đúng các bước của chèn, chỉ khác một điểm: phép xoay có thể làm cây con thấp đi một mức, nên phải kiểm tiếp lên trên — đôi khi xoay thêm, tới tận gốc.</p>
<ol>
<li>Xoá nút như trong cây nhị phân tìm kiếm (BST); nút có hai con thì nhận khoá của nút liền trước (predecessor — nút phải nhất của cây con trái), như phần 1.</li>
<li>Tính lại hệ số cân bằng (balance factor) từ vị trí nút vừa xoá ngược về gốc.</li>
<li>Gặp nút nào có −2 hoặc +2 thì xoay theo luật của phép chèn: cùng dấu → xoay đơn, khác dấu → xoay kép.</li>
<li>Khác với chèn, không dừng sau lần xoay đầu tiên — phải kiểm tiếp mọi tổ tiên (ancestor).</li>
</ol>
<pre><code class="language-java">Node delete(Node p, int x) {                     // xoá như BST ...
    if (p == null) return null;                  // x không có trong cây
    if (x &lt; p.info) p.left = delete(p.left, x);
    else if (x &gt; p.info) p.right = delete(p.right, x);
    else if (p.left == null) return p.right;     // lá, hoặc chỉ có con phải
    else if (p.right == null) return p.left;     // chỉ có con trái
    else {                                       // hai con: chép khoá liền trước (phần 1)
        Node q = p.left;
        while (q.right != null) q = q.right;     // nút phải nhất của cây con trái
        p.info = q.info;
        p.left = delete(p.left, q.info);
    }
    return balance(p);                           // ... rồi kiểm từng nút trên đường quay về gốc
}

void delete(int x) { log = ""; root = delete(root, x); }</code></pre>
<p>Output của chương trình đầy đủ — lớp AVL của slide 11 cộng hàm <code>delete</code> này — trên cây 12 nút là ví dụ của bài:</p>
<div class="out">AVL tree: &nbsp;8(5(3(2(1,-),4),7(6,-)),11(10(9,-),12)) &nbsp;&nbsp;height 5<br>
delete 12: 5(3(2(1,-),4),8(7(6,-),10(9,11))) &nbsp;&nbsp;height 4<br>
&nbsp;&nbsp;&nbsp;p=11(-2) q=10(-1) same sign: rotateRight(11)<br>
&nbsp;&nbsp;&nbsp;p=8(-2) q=5(-1) same sign: rotateRight(8)<br>
delete 5: &nbsp;4(2(1,3),8(7(6,-),10(9,11))) &nbsp;&nbsp;height 4<br>
&nbsp;&nbsp;&nbsp;p=3(-2) q=2(-1) same sign: rotateRight(3)</div>
<pre><code class="language-plaintext">trước
                  8[-1]
              /          \\
         5[-1]            11[-1]
        /     \\          /      \\
    3[-1]     7[-1]   10[-1]     12
   /    \\     /       /
 2[-1]   4   6       9
  /
 1

sau khi xoá 12: rotateRight(11), rồi rotateRight(8)
               5[0]
            /        \\
        3[-1]          8[0]
       /     \\       /      \\
   2[-1]      4   7[-1]     10[0]
   /              /        /    \\
  1              6        9      11</code></pre>
<ul>
<li>Xoá 12 làm 11 thành −2 → <code>rotateRight(11)</code>. Cây con đó tụt từ cao 3 xuống 2, nên gốc 8 thành −2 → lần xoay thứ hai, ngay tại gốc.</li>
<li>Xoá 5 (có hai con): khoá liền trước 4 được chép lên, và việc gỡ 4 ở dưới làm 3 thành −2 → thêm một lần xoay.</li>
</ul>
<p><strong>Big-O:</strong> O(log n) mức, mỗi mức nhiều nhất một lần xoay đơn hoặc kép → O(log n) mỗi lần xoá, kể cả khi phải xoay suốt lên gốc.</p>
<div class="pitfall">Khi xoá, con q có thể có hệ số cân bằng 0 (hai cây con của nó cao bằng nhau) — trường hợp mà luật "cùng dấu / khác dấu" của slide không nhắc tới. Hãy coi 0 như "cùng dấu": xoay đơn. Xoay kép trong trường hợp đó có thể để lại cây mất cân bằng. Slide 14 rơi đúng vào trường hợp này.</div>`],
      [14, 'Deletion in an AVL Tree demo',
        `<p class="y-chinh">🎯 Deleting 32 makes the root 44 right-heavy (+2); its son 62 is perfectly balanced (0), so a single left rotation makes 62 the new root.</p>
<p class="ghi-chu">The slide is a figure titled "Rebalancing an AVL tree after deleting the key 32". Deleting 32 is the next worked example of Goodrich §11.3, continuing from the tree obtained after inserting 54; it is rebuilt below — compare it with the picture.</p>
<pre><code class="language-java">AVLTree t = new AVLTree();
for (int x : new int[] {44, 17, 78, 32, 50, 88, 48, 62, 54}) t.insert(x);   // the tree after slide 12
System.out.println("AVL tree:   " + t.show(t.root));
System.out.println("   bf " + t.bfs(t.root));
t.delete(32);
System.out.println("delete 32:  " + t.show(t.root) + t.log);
System.out.println("   bf " + t.bfs(t.root));</code></pre>
<p>Output (same AVL class, with <code>delete</code> from slide 13):</p>
<div class="out">AVL tree: &nbsp;&nbsp;44(17(-,32),62(50(48,54),78(-,88)))<br>
&nbsp;&nbsp;&nbsp;bf 17:+1 32:0 44:+1 48:0 50:0 54:0 62:0 78:+1 88:0<br>
delete 32: &nbsp;62(44(17,50(48,54)),78(-,88))<br>
&nbsp;&nbsp;&nbsp;p=44(+2) q=62(0) q is 0: rotateLeft(44)<br>
&nbsp;&nbsp;&nbsp;bf 17:0 44:+1 48:0 50:0 54:0 62:-1 78:+1 88:0</div>
<pre><code class="language-plaintext">the tree of slide 12; delete 32
             44[+1]
           /        \\
     17[+1]          62[0]  &lt;- q
           \\        /     \\
           32   50[0]      78[+1]
               /    \\          \\
             48      54         88

after rotateLeft(44)
                 62[-1]
               /        \\
          44[+1]         78[+1]
         /      \\            \\
       17      50[0]          88
              /    \\
            48      54</code></pre>
<ol>
<li>32 is a leaf: just remove it; 17 becomes a leaf too.</li>
<li>Going up: 44 now has a left side of height 1 and a right side of height 3 → +2, so p = 44.</li>
<li>Its taller son q = 62 is 0 → single rotation <code>rotateLeft(44)</code>: 62 goes up, and its left subtree (50 with 48 and 54) moves under 44.</li>
<li>62 is the root, so there is no ancestor left to check; the tree keeps height 4 and every factor is in {−1, 0, +1}.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> in a deletion think "the <em>other</em> side became too tall" — deleting on the left can force a left rotation.</p>`,
        `<p class="y-chinh">🎯 Xoá 32 làm gốc 44 lệch phải (+2); con 62 của nó cân bằng hoàn toàn (0), nên chỉ một phép xoay trái (xoay đơn) là đưa 62 thành gốc mới.</p>
<p class="ghi-chu">Slide là một hình có tiêu đề "Rebalancing an AVL tree after deleting the key 32" (cân bằng lại cây AVL sau khi xoá khoá 32). Xoá 32 là ví dụ có lời giải tiếp theo trong Goodrich §11.3, nối tiếp từ cây thu được sau khi chèn 54; ví dụ đó được dựng lại dưới đây — hãy đối chiếu với hình.</p>
<pre><code class="language-java">AVLTree t = new AVLTree();
for (int x : new int[] {44, 17, 78, 32, 50, 88, 48, 62, 54}) t.insert(x);   // cây sau slide 12
System.out.println("AVL tree:   " + t.show(t.root));
System.out.println("   bf " + t.bfs(t.root));
t.delete(32);
System.out.println("delete 32:  " + t.show(t.root) + t.log);
System.out.println("   bf " + t.bfs(t.root));</code></pre>
<p>Output (cùng lớp AVL, có thêm <code>delete</code> của slide 13):</p>
<div class="out">AVL tree: &nbsp;&nbsp;44(17(-,32),62(50(48,54),78(-,88)))<br>
&nbsp;&nbsp;&nbsp;bf 17:+1 32:0 44:+1 48:0 50:0 54:0 62:0 78:+1 88:0<br>
delete 32: &nbsp;62(44(17,50(48,54)),78(-,88))<br>
&nbsp;&nbsp;&nbsp;p=44(+2) q=62(0) q is 0: rotateLeft(44)<br>
&nbsp;&nbsp;&nbsp;bf 17:0 44:+1 48:0 50:0 54:0 62:-1 78:+1 88:0</div>
<pre><code class="language-plaintext">cây của slide 12; xoá 32
             44[+1]
           /        \\
     17[+1]          62[0]  &lt;- q
           \\        /     \\
           32   50[0]      78[+1]
               /    \\          \\
             48      54         88

sau rotateLeft(44)
                 62[-1]
               /        \\
          44[+1]         78[+1]
         /      \\            \\
       17      50[0]          88
              /    \\
            48      54</code></pre>
<ol>
<li>32 là lá (leaf): chỉ việc gỡ đi; 17 cũng thành lá.</li>
<li>Đi ngược lên: 44 giờ có bên trái cao 1, bên phải cao 3 → +2, vậy p = 44.</li>
<li>Con q = 62 ở phía cao hơn có hệ số 0 → xoay đơn <code>rotateLeft(44)</code>: 62 đi lên, cây con trái của nó (50 cùng 48 và 54) chuyển sang dưới 44.</li>
<li>62 là gốc nên không còn tổ tiên nào để kiểm; cây vẫn cao 4 và mọi hệ số đều thuộc {−1, 0, +1}.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khi xoá, hãy nghĩ "phía <em>bên kia</em> giờ quá cao" — xoá ở bên trái có thể buộc phải xoay trái.</p>`],
      [15, 'Heaps - 1',
        `<p class="y-chinh">🎯 A heap is a binary tree with two properties: every node is ≥ each of its children (max-heap), and the tree is nearly complete — all levels full except the last, whose leaves are packed to the left.</p>
<ul>
<li><strong>Order property</strong> (max-heap): value(node) ≥ value(each child), so the maximum is always at the root. Replace "greater" by "less" and you get a <strong>min-heap</strong>, with the minimum at the root.</li>
<li><strong>Shape property</strong>: nearly complete — in the slide's words, perfectly balanced with the leaves of the last level in the leftmost positions. A heap of n elements has ⌊log₂n⌋ + 1 levels.</li>
<li><strong>Not a BST</strong>: nothing orders a left child against a right child, so looking for an arbitrary key is O(n). A heap answers only one question fast: "what is the largest?"</li>
<li><strong>Uses</strong> (slide): priority queues (slides 19–20) and heap sort (slides 27–28).</li>
</ul>
<p>Java already ships a heap: <code>java.util.PriorityQueue</code> is a min-heap; <code>Collections.reverseOrder()</code> turns it into a max-heap. <code>peek()</code> is O(1), <code>add</code> and <code>poll</code> are O(log n).</p>
<pre><code class="language-java">import java.util.Collections;
import java.util.PriorityQueue;

public class HeapPQ {
    public static void main(String[] args) {
        int[] data = {5, 13, 3, 25, 8, 17};
        PriorityQueue&lt;Integer&gt; max = new PriorityQueue&lt;Integer&gt;(Collections.reverseOrder());   // max-heap
        PriorityQueue&lt;Integer&gt; min = new PriorityQueue&lt;Integer&gt;();                             // Java's default: min-heap
        for (int x : data) { max.add(x); min.add(x); }       // each add = insert at the end + sift up

        System.out.println("max-heap, array order: " + max + "   peek() = " + max.peek());
        System.out.println("min-heap, array order: " + min + "   peek() = " + min.peek());

        StringBuilder a = new StringBuilder(), b = new StringBuilder();
        while (!max.isEmpty()) a.append(max.poll()).append(' ');   // poll() = remove the root
        while (!min.isEmpty()) b.append(min.poll()).append(' ');
        System.out.println("poll() from max-heap:  " + a);
        System.out.println("poll() from min-heap:  " + b);
    }
}</code></pre>
<div class="out">max-heap, array order: [25, 13, 17, 5, 8, 3] &nbsp;&nbsp;peek() = 25<br>
min-heap, array order: [3, 8, 5, 25, 13, 17] &nbsp;&nbsp;peek() = 3<br>
poll() from max-heap: &nbsp;25 17 13 8 5 3<br>
poll() from min-heap: &nbsp;3 5 8 13 17 25</div>
<p>The max-heap's internal array is [25, 13, 17, 5, 8, 3] — exactly the array of the next slide. The printed arrays are heaps, not sorted lists; only repeated <code>poll()</code> gives sorted order.</p>
<div class="pitfall">A heap is not sorted. "[3, 8, 5, 25, 13, 17] is not a min-heap because it is not sorted" is a wrong argument: it <em>is</em> a min-heap — check that every parent is ≤ its children.</div>`,
        `<p class="y-chinh">🎯 Heap (đống) là cây nhị phân có hai tính chất: mọi nút ≥ từng con của nó (heap max — max-heap), và cây gần đầy đủ (nearly complete) — mọi mức đều kín, trừ mức cuối có các lá dồn hết về bên trái.</p>
<ul>
<li><strong>Tính chất thứ tự</strong> (heap max): giá trị(nút) ≥ giá trị(từng con), nên phần tử lớn nhất luôn ở gốc. Đổi "lớn hơn" thành "nhỏ hơn" ta được <strong>heap min (min-heap)</strong>, phần tử nhỏ nhất ở gốc.</li>
<li><strong>Tính chất hình dạng</strong>: gần đầy đủ — theo lời slide là cân bằng hoàn hảo (perfectly balanced) và các lá ở mức cuối nằm ở những vị trí trái nhất. Heap có n phần tử thì có ⌊log₂n⌋ + 1 mức.</li>
<li><strong>Không phải BST</strong> (cây nhị phân tìm kiếm): không có luật nào so con trái với con phải, nên tìm một khoá bất kỳ tốn O(n). Heap chỉ trả lời nhanh đúng một câu: "phần tử lớn nhất là gì?"</li>
<li><strong>Ứng dụng</strong> (slide): hàng đợi ưu tiên (priority queue, slide 19–20) và sắp xếp vun đống (heap sort, slide 27–28).</li>
</ul>
<p>Java có sẵn heap: <code>java.util.PriorityQueue</code> là heap min; truyền <code>Collections.reverseOrder()</code> thì thành heap max. <code>peek()</code> (xem gốc) là O(1), <code>add</code> và <code>poll</code> là O(log n).</p>
<pre><code class="language-java">import java.util.Collections;
import java.util.PriorityQueue;

public class HeapPQ {
    public static void main(String[] args) {
        int[] data = {5, 13, 3, 25, 8, 17};
        PriorityQueue&lt;Integer&gt; max = new PriorityQueue&lt;Integer&gt;(Collections.reverseOrder());   // heap max
        PriorityQueue&lt;Integer&gt; min = new PriorityQueue&lt;Integer&gt;();                             // mặc định của Java: heap min
        for (int x : data) { max.add(x); min.add(x); }       // mỗi add = thêm vào cuối + đẩy lên

        System.out.println("max-heap, array order: " + max + "   peek() = " + max.peek());
        System.out.println("min-heap, array order: " + min + "   peek() = " + min.peek());

        StringBuilder a = new StringBuilder(), b = new StringBuilder();
        while (!max.isEmpty()) a.append(max.poll()).append(' ');   // poll() = lấy gốc ra
        while (!min.isEmpty()) b.append(min.poll()).append(' ');
        System.out.println("poll() from max-heap:  " + a);
        System.out.println("poll() from min-heap:  " + b);
    }
}</code></pre>
<div class="out">max-heap, array order: [25, 13, 17, 5, 8, 3] &nbsp;&nbsp;peek() = 25<br>
min-heap, array order: [3, 8, 5, 25, 13, 17] &nbsp;&nbsp;peek() = 3<br>
poll() from max-heap: &nbsp;25 17 13 8 5 3<br>
poll() from min-heap: &nbsp;3 5 8 13 17 25</div>
<p>Mảng bên trong của heap max là [25, 13, 17, 5, 8, 3] — đúng mảng của slide kế tiếp. Các mảng in ra là heap, không phải danh sách đã sắp; chỉ gọi <code>poll()</code> liên tục mới cho thứ tự đã sắp.</p>
<div class="pitfall">Heap không phải mảng đã sắp xếp. Lập luận "[3, 8, 5, 25, 13, 17] không phải heap min vì nó chưa được sắp" là SAI: nó <em>là</em> heap min — hãy kiểm từng cha có ≤ các con hay không.</div>`],
      [16, 'Heaps - 2',
        `<p class="y-chinh">🎯 A heap is stored in an array in level order, left to right; with the root at A[0], the parent and the children of any node are found by arithmetic — no references needed.</p>
<ul>
<li>The slide's heap as an array: [25, 13, 17, 5, 8, 3] — 25 on level 1, then 13 17, then 5 8 3.</li>
<li>PARENT(i) = ⌊(i − 1)/2⌋, LEFT(i) = 2i + 1, RIGHT(i) = 2(i + 1) = 2i + 2; an index ≥ n means "no such child".</li>
<li>No holes: the shape property fills the array from index 0 without gaps — that is what makes the formulas valid.</li>
<li>Leaves are the indices ⌊n/2⌋ … n − 1; the last internal node is ⌊n/2⌋ − 1 (the bottom-up method of slide 24 starts there).</li>
</ul>
<pre><code class="language-plaintext">index:   0    1    2    3    4    5
value:  25   13   17    5    8    3

             25              level 1  (index 0)
           /    \\
         13      17          level 2  (indexes 1-2)
        /  \\    /
       5    8  3             level 3  (indexes 3-5)</code></pre>
<pre><code class="language-java">public class HeapIndex {
    static int parent(int i) { return (i - 1) / 2; } // slide: floor((i-1)/2) -- only for i &gt; 0
    static int left(int i) { return 2 * i + 1; }
    static int right(int i) { return 2 * (i + 1); }

    static String cell(int[] a, int j) {             // "index (value)", or "-" outside the heap
        return j &gt;= 0 &amp;&amp; j &lt; a.length ? j + " (" + a[j] + ")" : "-";
    }

    public static void main(String[] args) {
        int[] a = {25, 13, 17, 5, 8, 3};             // the array on slide 16
        boolean heap = true;
        System.out.println("i  a[i]  PARENT(i)  LEFT(i)  RIGHT(i)");
        for (int i = 0; i &lt; a.length; i++) {
            String p = i == 0 ? "-" : cell(a, parent(i));      // the root has no parent
            System.out.printf("%-3d%-6d%-11s%-9s%s%n", i, a[i], p, cell(a, left(i)), cell(a, right(i)));
            if (i &gt; 0 &amp;&amp; a[parent(i)] &lt; a[i]) heap = false;
        }
        System.out.println("a[PARENT(i)] &gt;= a[i] for every i &gt; 0: " + heap);
        System.out.println("careful: in Java (0-1)/2 = " + (0 - 1) / 2 + ", while floor(-1/2) = Math.floorDiv(-1, 2) = " + Math.floorDiv(-1, 2));
    }
}</code></pre>
<div class="out">i &nbsp;a[i] &nbsp;PARENT(i) &nbsp;LEFT(i) &nbsp;RIGHT(i)<br>
0 &nbsp;25 &nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 (13) &nbsp;&nbsp;2 (17)<br>
1 &nbsp;13 &nbsp;&nbsp;&nbsp;0 (25) &nbsp;&nbsp;&nbsp;&nbsp;3 (5) &nbsp;&nbsp;&nbsp;4 (8)<br>
2 &nbsp;17 &nbsp;&nbsp;&nbsp;0 (25) &nbsp;&nbsp;&nbsp;&nbsp;5 (3) &nbsp;&nbsp;&nbsp;-<br>
3 &nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;1 (13) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
4 &nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;1 (13) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
5 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;2 (17) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
a[PARENT(i)] &gt;= a[i] for every i &gt; 0: true<br>
careful: in Java (0-1)/2 = 0, while floor(-1/2) = Math.floorDiv(-1, 2) = -1</div>
<p><strong>Big-O:</strong> each formula is O(1), and going one level up or down is one division or multiplication — that is why heap operations cost O(height) = O(log n).</p>
<div class="pitfall">Two traps. (1) Java's <code>/</code> truncates toward zero: <code>(0-1)/2</code> is 0, not −1, so the root looks like its own parent — always test <code>i &gt; 0</code> first, as slide 27's loop does with <code>s&gt;0 &amp;&amp; …</code>. (2) Some books number the array from 1: then PARENT(i) = i/2, LEFT(i) = 2i, RIGHT(i) = 2i + 1. Check which base the question uses.</div>`,
        `<p class="y-chinh">🎯 Heap (đống) được lưu trong mảng theo thứ tự từng mức, từ trái sang phải; với gốc ở A[0], cha và các con của một nút bất kỳ tính ra được bằng số học — không cần tham chiếu (reference).</p>
<ul>
<li>Heap của slide viết thành mảng: [25, 13, 17, 5, 8, 3] — 25 ở mức 1, rồi 13 17, rồi 5 8 3.</li>
<li>PARENT(i) (cha) = ⌊(i − 1)/2⌋, LEFT(i) (con trái) = 2i + 1, RIGHT(i) (con phải) = 2(i + 1) = 2i + 2; chỉ số ≥ n nghĩa là "không có con đó".</li>
<li>Không có lỗ hổng: tính chất hình dạng lấp mảng liền từ chỉ số 0 — nhờ vậy các công thức mới đúng.</li>
<li>Lá (leaf) là các chỉ số ⌊n/2⌋ … n − 1; nút trong (internal node) cuối cùng là ⌊n/2⌋ − 1 (phương pháp từ dưới lên ở slide 24 bắt đầu tại đó).</li>
</ul>
<pre><code class="language-plaintext">chỉ số:   0    1    2    3    4    5
giá trị: 25   13   17    5    8    3

             25              mức 1  (chỉ số 0)
           /    \\
         13      17          mức 2  (chỉ số 1-2)
        /  \\    /
       5    8  3             mức 3  (chỉ số 3-5)</code></pre>
<pre><code class="language-java">public class HeapIndex {
    static int parent(int i) { return (i - 1) / 2; } // slide: floor((i-1)/2) -- chỉ dùng khi i &gt; 0
    static int left(int i) { return 2 * i + 1; }
    static int right(int i) { return 2 * (i + 1); }

    static String cell(int[] a, int j) {             // "chỉ số (giá trị)", hoặc "-" nếu ngoài heap
        return j &gt;= 0 &amp;&amp; j &lt; a.length ? j + " (" + a[j] + ")" : "-";
    }

    public static void main(String[] args) {
        int[] a = {25, 13, 17, 5, 8, 3};             // mảng trên slide 16
        boolean heap = true;
        System.out.println("i  a[i]  PARENT(i)  LEFT(i)  RIGHT(i)");
        for (int i = 0; i &lt; a.length; i++) {
            String p = i == 0 ? "-" : cell(a, parent(i));      // gốc không có cha
            System.out.printf("%-3d%-6d%-11s%-9s%s%n", i, a[i], p, cell(a, left(i)), cell(a, right(i)));
            if (i &gt; 0 &amp;&amp; a[parent(i)] &lt; a[i]) heap = false;
        }
        System.out.println("a[PARENT(i)] &gt;= a[i] for every i &gt; 0: " + heap);
        System.out.println("careful: in Java (0-1)/2 = " + (0 - 1) / 2 + ", while floor(-1/2) = Math.floorDiv(-1, 2) = " + Math.floorDiv(-1, 2));
    }
}</code></pre>
<div class="out">i &nbsp;a[i] &nbsp;PARENT(i) &nbsp;LEFT(i) &nbsp;RIGHT(i)<br>
0 &nbsp;25 &nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 (13) &nbsp;&nbsp;2 (17)<br>
1 &nbsp;13 &nbsp;&nbsp;&nbsp;0 (25) &nbsp;&nbsp;&nbsp;&nbsp;3 (5) &nbsp;&nbsp;&nbsp;4 (8)<br>
2 &nbsp;17 &nbsp;&nbsp;&nbsp;0 (25) &nbsp;&nbsp;&nbsp;&nbsp;5 (3) &nbsp;&nbsp;&nbsp;-<br>
3 &nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;1 (13) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
4 &nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;1 (13) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
5 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;2 (17) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
a[PARENT(i)] &gt;= a[i] for every i &gt; 0: true<br>
careful: in Java (0-1)/2 = 0, while floor(-1/2) = Math.floorDiv(-1, 2) = -1</div>
<p><strong>Big-O:</strong> mỗi công thức là O(1), và lên hay xuống một mức chỉ là một phép chia hoặc phép nhân — vì thế các thao tác trên heap tốn O(chiều cao) = O(log n).</p>
<div class="pitfall">Hai cái bẫy. (1) Phép <code>/</code> của Java cắt về phía 0: <code>(0-1)/2</code> bằng 0 chứ không phải −1, nên gốc trông như cha của chính nó — luôn kiểm <code>i &gt; 0</code> trước, như vòng lặp ở slide 27 làm với <code>s&gt;0 &amp;&amp; …</code>. (2) Có sách đánh số mảng từ 1: khi đó PARENT(i) = i/2, LEFT(i) = 2i, RIGHT(i) = 2i + 1. Xem kỹ đề dùng gốc chỉ số nào.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ol>
<li>Insert 1, 2, 3, 4, 5 into an empty BST. What is its height, and why is that bad?</li>
<li>A node has a left subtree of height 3 and a right subtree of height 1. What is its balance factor with the slide's formula, and which direction of rotation fixes it?</li>
<li>After an insertion, p is −2 and its taller son q is +1. Single or double rotation? Which nodes rotate, in which order?</li>
<li>Why can an AVL deletion need several rotations when an insertion needs at most one?</li>
<li>In the heap array [25, 13, 17, 5, 8, 3], what are the parent and the children of index 2?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 5 — a chain, so search is O(n). (2) 1 − 3 = −2, left-heavy → rotate right (single if the left son is −1 or 0, double if it is +1). (3) Signs differ → double: first rotate q to the left, then p to the right. (4) After an insertion's rotation the subtree gets back its old height, so the ancestors are unchanged; after a deletion's rotation the subtree may be one level shorter, so an ancestor can become unbalanced in turn. (5) Parent ⌊(2−1)/2⌋ = 0 (value 25); left child 5 (value 3); right child 6 — outside the array, so none.</p>
<p><strong>Next:</strong> lesson 4.D continues the deck (slides 17–33: heaps as priority queues, building a heap, heap sort, Polish notation). Then the deep dives below: 4.4 Binary Search Trees and 4.5 BST insertion &amp; the three deletion cases (the base of every balanced tree), 4.6 AVL trees: the four rotations — careful, 4.6 writes the balance factor as left − right — and 4.7 Building a heap: sift-up, sift-down, Floyd.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ol>
<li>Chèn 1, 2, 3, 4, 5 vào một cây nhị phân tìm kiếm (BST) rỗng. Cây cao bao nhiêu, và vì sao như vậy là tệ?</li>
<li>Một nút có cây con trái cao 3 và cây con phải cao 1. Theo công thức của slide, hệ số cân bằng (balance factor) của nó là bao nhiêu, và phải xoay về phía nào?</li>
<li>Sau một lần chèn, p là −2 và con q ở phía cao hơn là +1. Xoay đơn hay xoay kép? Những nút nào xoay, theo thứ tự nào?</li>
<li>Vì sao xoá trên cây AVL có thể cần nhiều lần xoay, trong khi chèn chỉ cần nhiều nhất một lần?</li>
<li>Trong mảng heap (đống) [25, 13, 17, 5, 8, 3], cha và các con của chỉ số 2 là gì?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Cao 5 — một chuỗi, nên tìm kiếm là O(n). (2) 1 − 3 = −2, lệch trái → xoay phải (xoay đơn nếu con trái là −1 hoặc 0, xoay kép nếu con trái là +1). (3) Khác dấu → xoay kép: xoay q sang trái trước, rồi xoay p sang phải. (4) Sau lần xoay của phép chèn, cây con lấy lại đúng chiều cao cũ nên các tổ tiên không đổi; sau lần xoay của phép xoá, cây con có thể thấp đi một mức nên đến lượt một tổ tiên bị mất cân bằng. (5) Cha ⌊(2−1)/2⌋ = 0 (giá trị 25); con trái 5 (giá trị 3); con phải 6 — nằm ngoài mảng, tức là không có.</p>
<p><strong>Học tiếp:</strong> bài 4.D đi tiếp bộ slide (slide 17–33: heap làm hàng đợi ưu tiên, dựng heap, heap sort, ký pháp Ba Lan). Sau đó là các bài đào sâu bên dưới: 4.4 Cây nhị phân tìm kiếm (BST) và 4.5 BST: chèn &amp; ba trường hợp xoá (nền của mọi cây cân bằng), 4.6 Cây AVL: bốn phép xoay — chú ý, bài 4.6 viết hệ số cân bằng là trái − phải — và 4.7 Dựng heap: sift-up, sift-down, Floyd (đẩy lên, đẩy xuống, cách dựng heap của Floyd).</p>`),
    books([
      ['goodrich', '§11.2 Balanced Search Trees p.472 (rotations, trinode restructuring) · §11.3 AVL Trees p.479 (height-balance property, insertion, deletion) · §9.3.1 The Heap Data Structure p.370', '§11.2 Balanced Search Trees tr.472 (phép xoay, tái cấu trúc bộ ba nút) · §11.3 AVL Trees tr.479 (tính chất cân bằng chiều cao, chèn, xoá) · §9.3.1 The Heap Data Structure tr.370'],
    ]),
  ].join('\n'),
};

/* ───────── 4.D — 📑 Slide by slide · Trees, part 2b: heaps, priority queues & Polish notation (4B-Trees2, slides 17–33) ───────── */
const L_csd9_2 = {
  title: '4.D — 📑 Slide by slide · Trees, part 2b: heaps, priority queues & Polish notation (4B-Trees2, slides 17–33)|||4.D — 📑 Học theo từng slide · Cây, phần 2b: heap, hàng đợi ưu tiên & ký pháp Ba Lan (4B-Trees2, slide 17–33)',
  slug: 'csd201-slide-csd9-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 17–33 của bộ 4B-Trees2: heap và không phải heap, nhiều heap cùng một tập phần tử, heap làm hàng đợi ưu tiên (enqueue đẩy lên, dequeue đẩy xuống), dựng heap từ trên xuống và từ dưới lên trên mảng [2 8 6 1 10 15 3 12 11] vẽ lại từng bước, heap sort chạy chính code của slide, ký pháp Ba Lan và cây biểu thức, tóm tắt và phần đọc thêm — 10 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.D · 4B-Trees2, slides 17–33</span>
<h2>Trees, part 2b — heaps, priority queues and Polish notation</h2>
<p class="lead">The second half of the deck puts the heap of slides 15–16 to work: as a priority queue (enqueue and dequeue in O(log n)), built from an unsorted array in two different ways, and as the engine of heap sort, run with the exact code of slides 27–28. It ends with Polish notation, where the traversals of part 1 turn into prefix and postfix expressions.</p>
<div class="callout"><strong>CLO4 in the syllabus</strong> (session 24: heaps), and <strong>CLO6</strong>, where heap sort comes back in chapter 6. The syllabus's discussion questions answered here: <em>What is a heap? What is the main difference between a min heap and a max heap?</em> — <em>What are the similarities and differences between binary tree, AVL tree and heap?</em> — <em>What is a priority queue?</em> (the syllabus's hint: an ambulance at a gate shared with other cars). FE questions often ask for the array after an enqueue, a dequeue or a heap construction: work through the step tables below until you can do them on paper.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Operation</th><th>Slides</th><th>How</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Check a heap</td><td>17</td><td>every parent ≥ its children, and no gap in the shape</td><td>O(n)</td></tr>
<tr><td>Enqueue</td><td>19</td><td>add at the end, sift up</td><td>O(log n)</td></tr>
<tr><td>Dequeue (the max)</td><td>20</td><td>take the root, move the last element to the root, sift down</td><td>O(log n)</td></tr>
<tr><td>Peek</td><td>15, 20</td><td>read a[0]</td><td>O(1)</td></tr>
<tr><td>Build top-down</td><td>21–23, 27</td><td>insert a[1], a[2], … one by one, sifting up</td><td>O(n log n) in the worst case</td></tr>
<tr><td>Build bottom-up</td><td>24–26</td><td>sift down from index n/2 − 1 back to 0</td><td>O(n)</td></tr>
<tr><td>Heap sort</td><td>27–28</td><td>build, then n − 1 times: root to the end, sift down</td><td>O(n log n), in place, not stable</td></tr>
<tr><td>Evaluate prefix / postfix</td><td>29</td><td>one stack, one pass</td><td>O(n)</td></tr>
<tr><td>Expression tree</td><td>30</td><td>preorder / inorder / postorder = prefix / infix / postfix</td><td>O(n)</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.D · 4B-Trees2, slide 17–33</span>
<h2>Cây, phần 2b — heap, hàng đợi ưu tiên và ký pháp Ba Lan</h2>
<p class="lead">Nửa sau của bộ slide đưa heap (đống) của slide 15–16 vào việc: làm hàng đợi ưu tiên (priority queue — thêm và lấy ra trong O(log n)), dựng từ một mảng chưa sắp theo hai cách khác nhau, và làm động cơ cho sắp xếp vun đống (heap sort), chạy bằng đúng code của slide 27–28. Bộ slide kết thúc với ký pháp Ba Lan (Polish notation), nơi các phép duyệt cây của phần 1 biến thành biểu thức tiền tố (prefix) và hậu tố (postfix).</p>
<div class="callout"><strong>CLO4 trong syllabus</strong> (buổi 24: heap), và <strong>CLO6</strong>, nơi heap sort quay lại ở chương 6. Các câu hỏi thảo luận (constructive question) của syllabus có lời đáp trong bài: <em>Heap là gì? Khác biệt chính giữa heap min và heap max?</em> — <em>Cây nhị phân, cây AVL và heap giống và khác nhau thế nào?</em> — <em>Hàng đợi ưu tiên là gì?</em> (gợi ý của syllabus: xe cứu thương đi chung cổng với các xe khác). Đề FE (thi cuối kỳ) hay hỏi mảng trông thế nào sau một lần thêm, một lần lấy ra hoặc sau khi dựng heap: hãy làm theo các bảng từng bước dưới đây tới khi tự làm được trên giấy.</div>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Thao tác</th><th>Slide</th><th>Cách làm</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>Kiểm một cây có phải heap</td><td>17</td><td>mọi cha ≥ các con, và hình dạng không có chỗ trống</td><td>O(n)</td></tr>
<tr><td>Thêm vào (enqueue)</td><td>19</td><td>đặt ở cuối, đẩy lên (sift up)</td><td>O(log n)</td></tr>
<tr><td>Lấy ra (dequeue) phần tử lớn nhất</td><td>20</td><td>lấy gốc, đưa phần tử cuối lên gốc, đẩy xuống (sift down)</td><td>O(log n)</td></tr>
<tr><td>Xem gốc (peek)</td><td>15, 20</td><td>đọc a[0]</td><td>O(1)</td></tr>
<tr><td>Dựng từ trên xuống (top-down)</td><td>21–23, 27</td><td>chèn lần lượt a[1], a[2], …, mỗi phần tử đẩy lên</td><td>O(n log n) trường hợp xấu nhất</td></tr>
<tr><td>Dựng từ dưới lên (bottom-up)</td><td>24–26</td><td>đẩy xuống từ chỉ số n/2 − 1 lùi về 0</td><td>O(n)</td></tr>
<tr><td>Heap sort</td><td>27–28</td><td>dựng heap, rồi n − 1 lần: đưa gốc về cuối, đẩy xuống</td><td>O(n log n), tại chỗ (in place), không ổn định (not stable)</td></tr>
<tr><td>Tính biểu thức tiền tố / hậu tố</td><td>29</td><td>một ngăn xếp (stack), một lượt đọc</td><td>O(n)</td></tr>
<tr><td>Cây biểu thức (expression tree)</td><td>30</td><td>tiền thứ tự / trung thứ tự / hậu thứ tự = tiền tố / trung tố / hậu tố</td><td>O(n)</td></tr>
</tbody>
</table>`),
    walkHead('csd9', 17, 33),
    walk('csd9', [
      [17, 'Heaps - 3: heaps and non-heaps',
        `<p class="y-chinh">🎯 To decide whether a tree is a heap, check both properties: every parent is ≥ its children, and the shape is nearly complete, with no gap before the last node.</p>
<p class="ghi-chu">The slide's figure shows (a) heaps and (b–c) non-heaps; the four trees below are the lesson's own.</p>
<pre><code class="language-java">import java.util.LinkedList;
import java.util.Queue;

class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class IsHeap {
    static boolean orderOk(Node p) {                 // property 1: every node &gt;= its children
        if (p == null) return true;
        if (p.left != null &amp;&amp; p.left.info &gt; p.info) return false;
        if (p.right != null &amp;&amp; p.right.info &gt; p.info) return false;
        return orderOk(p.left) &amp;&amp; orderOk(p.right);
    }

    static boolean shapeOk(Node root) {              // property 2: level by level, no node may come after a gap
        Queue&lt;Node&gt; q = new LinkedList&lt;Node&gt;();      // LinkedList accepts null
        q.add(root);
        boolean gap = false;
        while (!q.isEmpty()) {
            Node p = q.remove();
            if (p == null) { gap = true; continue; }
            if (gap) return false;
            q.add(p.left);
            q.add(p.right);
        }
        return true;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        Node[] trees = {
            new Node(25, new Node(13, new Node(5), new Node(8)), new Node(17, new Node(3), null)),
            new Node(25, new Node(13, new Node(5), new Node(8)), new Node(17, new Node(3), new Node(20))),
            new Node(25, new Node(13, null, new Node(8)), new Node(17, new Node(3), null)),
            new Node(25, new Node(13), new Node(17, new Node(3), new Node(5))),
        };
        for (Node t : trees) {
            boolean o = orderOk(t), s = shapeOk(t);
            System.out.printf("%-28s order %-4s shape %-4s -&gt; %s%n", show(t), o ? "ok" : "BAD", s ? "ok" : "BAD", o &amp;&amp; s ? "max-heap" : "not a heap");
        }
    }
}</code></pre>
<div class="out">25(13(5,8),17(3,-)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order ok &nbsp;&nbsp;shape ok &nbsp;&nbsp;-&gt; max-heap<br>
25(13(5,8),17(3,20)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order BAD &nbsp;shape ok &nbsp;&nbsp;-&gt; not a heap<br>
25(13(-,8),17(3,-)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order ok &nbsp;&nbsp;shape BAD &nbsp;-&gt; not a heap<br>
25(13,17(3,5)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order ok &nbsp;&nbsp;shape BAD &nbsp;-&gt; not a heap</div>
<ul>
<li>Tree 1 is the heap of slide 16.</li>
<li>Tree 2 breaks the order: 20 sits below 17.</li>
<li>Tree 3 breaks the shape: 13 has a right child but no left child — a gap before the last node.</li>
<li>Tree 4 breaks the shape another way: the last level is not packed to the left (13 has no child while 17 has two).</li>
</ul>
<p><code>shapeOk</code> walks the tree level by level, like the breadth-first traversal of part 1, and also queues the empty children; once an empty place has been seen, any further real node means a gap. <strong>Big-O:</strong> both checks visit each node once — O(n). On an array the shape is automatic and only the order loop is left: <code>a[(i-1)/2] &gt;= a[i]</code> for i = 1 … n − 1.</p>
<div class="pitfall">A tree with a correct order but a wrong shape is not a heap. FE options often show a tree where every parent is larger than its children but the last level has a hole — check the shape first, it is the quicker test.</div>`,
        `<p class="y-chinh">🎯 Muốn biết một cây có phải heap (đống) không, kiểm đủ hai tính chất: mọi cha ≥ các con, và hình dạng gần đầy đủ (nearly complete), không có chỗ trống nào đứng trước nút cuối.</p>
<p class="ghi-chu">Hình trên slide cho (a) các heap và (b–c) các cây không phải heap; bốn cây dưới đây là ví dụ của bài.</p>
<pre><code class="language-java">import java.util.LinkedList;
import java.util.Queue;

class Node {
    int info;
    Node left, right;

    Node(int x, Node p, Node q) { info = x; left = p; right = q; }
    Node(int x) { this(x, null, null); }
}

public class IsHeap {
    static boolean orderOk(Node p) {                 // tính chất 1: mọi nút &gt;= các con
        if (p == null) return true;
        if (p.left != null &amp;&amp; p.left.info &gt; p.info) return false;
        if (p.right != null &amp;&amp; p.right.info &gt; p.info) return false;
        return orderOk(p.left) &amp;&amp; orderOk(p.right);
    }

    static boolean shapeOk(Node root) {              // tính chất 2: duyệt theo mức, sau chỗ trống không được còn nút
        Queue&lt;Node&gt; q = new LinkedList&lt;Node&gt;();      // LinkedList cho phép phần tử null
        q.add(root);
        boolean gap = false;
        while (!q.isEmpty()) {
            Node p = q.remove();
            if (p == null) { gap = true; continue; }
            if (gap) return false;
            q.add(p.left);
            q.add(p.right);
        }
        return true;
    }

    static String show(Node p) {
        if (p == null) return "-";
        if (p.left == null &amp;&amp; p.right == null) return "" + p.info;
        return p.info + "(" + show(p.left) + "," + show(p.right) + ")";
    }

    public static void main(String[] args) {
        Node[] trees = {
            new Node(25, new Node(13, new Node(5), new Node(8)), new Node(17, new Node(3), null)),
            new Node(25, new Node(13, new Node(5), new Node(8)), new Node(17, new Node(3), new Node(20))),
            new Node(25, new Node(13, null, new Node(8)), new Node(17, new Node(3), null)),
            new Node(25, new Node(13), new Node(17, new Node(3), new Node(5))),
        };
        for (Node t : trees) {
            boolean o = orderOk(t), s = shapeOk(t);
            System.out.printf("%-28s order %-4s shape %-4s -&gt; %s%n", show(t), o ? "ok" : "BAD", s ? "ok" : "BAD", o &amp;&amp; s ? "max-heap" : "not a heap");
        }
    }
}</code></pre>
<div class="out">25(13(5,8),17(3,-)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order ok &nbsp;&nbsp;shape ok &nbsp;&nbsp;-&gt; max-heap<br>
25(13(5,8),17(3,20)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order BAD &nbsp;shape ok &nbsp;&nbsp;-&gt; not a heap<br>
25(13(-,8),17(3,-)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order ok &nbsp;&nbsp;shape BAD &nbsp;-&gt; not a heap<br>
25(13,17(3,5)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order ok &nbsp;&nbsp;shape BAD &nbsp;-&gt; not a heap</div>
<ul>
<li>Cây 1 là heap của slide 16.</li>
<li>Cây 2 sai thứ tự: 20 nằm dưới 17.</li>
<li>Cây 3 sai hình dạng: 13 có con phải mà không có con trái — một chỗ trống đứng trước nút cuối.</li>
<li>Cây 4 sai hình dạng theo kiểu khác: mức cuối không dồn về bên trái (13 không có con nào trong khi 17 có hai con).</li>
</ul>
<p><code>shapeOk</code> duyệt cây theo từng mức, giống phép duyệt theo chiều rộng (breadth-first traversal) của phần 1, và cho cả các con rỗng vào hàng đợi; một khi đã gặp chỗ trống mà sau đó còn nút thật thì hình dạng có lỗ. <strong>Big-O:</strong> cả hai phép kiểm thăm mỗi nút một lần — O(n). Trên mảng thì hình dạng đúng sẵn, chỉ còn vòng kiểm thứ tự: <code>a[(i-1)/2] &gt;= a[i]</code> với i = 1 … n − 1.</p>
<div class="pitfall">Cây đúng thứ tự mà sai hình dạng thì không phải heap. Phương án FE (thi cuối kỳ) hay vẽ một cây mà cha nào cũng lớn hơn con nhưng mức cuối bị thủng — hãy kiểm hình dạng trước, vì nó nhanh hơn.</div>`],
      [18, 'Heaps - 4: different heaps with the same elements',
        `<p class="y-chinh">🎯 One set of values can be arranged into many different heaps: the heap property fixes only the maximum at the root, not the rest.</p>
<p class="ghi-chu">The slide shows, as a figure, several heaps built from the same elements; the program below uses the lesson's own values 1–5.</p>
<pre><code class="language-java">import java.util.Arrays;

public class ManyHeaps {
    static int count;

    static boolean isMaxHeap(int[] a) {              // a[PARENT(i)] &gt;= a[i] for every i &gt; 0
        for (int i = 1; i &lt; a.length; i++) if (a[(i - 1) / 2] &lt; a[i]) return false;
        return true;
    }

    // Try every order of the values 1..n (largest first), count those that are max-heaps
    static void tryAll(int[] a, int k, boolean[] used, boolean print) {
        if (k == a.length) {
            if (isMaxHeap(a)) { count++; if (print) System.out.println("  " + Arrays.toString(a)); }
            return;
        }
        for (int v = a.length; v &gt;= 1; v--) {
            if (used[v]) continue;
            used[v] = true; a[k] = v;
            tryAll(a, k + 1, used, print);
            used[v] = false;
        }
    }

    public static void main(String[] args) {
        System.out.println("max-heaps made of 1 2 3 4 5:");
        count = 0;
        tryAll(new int[5], 0, new boolean[6], true);
        System.out.println("  -&gt; " + count + " different heaps out of 120 orders");
        for (int n = 6; n &lt;= 7; n++) {
            count = 0;
            tryAll(new int[n], 0, new boolean[n + 1], false);
            System.out.println("n = " + n + ": " + count + " different heaps");
        }
    }
}</code></pre>
<div class="out">max-heaps made of 1 2 3 4 5:<br>
&nbsp;&nbsp;[5, 4, 3, 2, 1]<br>
&nbsp;&nbsp;[5, 4, 3, 1, 2]<br>
&nbsp;&nbsp;[5, 4, 2, 3, 1]<br>
&nbsp;&nbsp;[5, 4, 2, 1, 3]<br>
&nbsp;&nbsp;[5, 4, 1, 3, 2]<br>
&nbsp;&nbsp;[5, 4, 1, 2, 3]<br>
&nbsp;&nbsp;[5, 3, 4, 2, 1]<br>
&nbsp;&nbsp;[5, 3, 4, 1, 2]<br>
&nbsp;&nbsp;-&gt; 8 different heaps out of 120 orders<br>
n = 6: 20 different heaps<br>
n = 7: 80 different heaps</div>
<ul>
<li>Of the 120 orders of 1 2 3 4 5, eight are max-heaps; with 6 values there are 20, with 7 values 80.</li>
<li>Always true: the largest value (5) is at the root, and the second largest (4) is a child of the root, since only 5 may stand above it.</li>
<li>The smallest value (1) is always a leaf — a child would have to be even smaller — but which leaf depends on the order of the input.</li>
</ul>
<p>Consequence: two correct programs can print different heaps for the same input. The top-down and the bottom-up constructions of slides 21–26 give two different heaps from one array.</p>
<p class="meo">🧠 <strong>Remember:</strong> a heap is only "partially ordered" — ordered along every path from the root down, unordered across a level.</p>
<div class="pitfall">When an FE question asks "which array is the heap after inserting 10, 20, … in this order", only one option is right: many heaps exist for the set, but a given algorithm on a given input builds exactly one. Simulate the algorithm step by step; do not just check the heap property.</div>`,
        `<p class="y-chinh">🎯 Một tập giá trị có thể xếp thành nhiều heap (đống) khác nhau: tính chất heap chỉ cố định phần tử lớn nhất ở gốc, phần còn lại thì không.</p>
<p class="ghi-chu">Slide vẽ bằng hình nhiều heap dựng từ cùng các phần tử; chương trình dưới dùng các giá trị 1–5 là ví dụ của bài.</p>
<pre><code class="language-java">import java.util.Arrays;

public class ManyHeaps {
    static int count;

    static boolean isMaxHeap(int[] a) {              // a[PARENT(i)] &gt;= a[i] với mọi i &gt; 0
        for (int i = 1; i &lt; a.length; i++) if (a[(i - 1) / 2] &lt; a[i]) return false;
        return true;
    }

    // Thử mọi thứ tự của 1..n (lớn trước), đếm các thứ tự là heap max
    static void tryAll(int[] a, int k, boolean[] used, boolean print) {
        if (k == a.length) {
            if (isMaxHeap(a)) { count++; if (print) System.out.println("  " + Arrays.toString(a)); }
            return;
        }
        for (int v = a.length; v &gt;= 1; v--) {
            if (used[v]) continue;
            used[v] = true; a[k] = v;
            tryAll(a, k + 1, used, print);
            used[v] = false;
        }
    }

    public static void main(String[] args) {
        System.out.println("max-heaps made of 1 2 3 4 5:");
        count = 0;
        tryAll(new int[5], 0, new boolean[6], true);
        System.out.println("  -&gt; " + count + " different heaps out of 120 orders");
        for (int n = 6; n &lt;= 7; n++) {
            count = 0;
            tryAll(new int[n], 0, new boolean[n + 1], false);
            System.out.println("n = " + n + ": " + count + " different heaps");
        }
    }
}</code></pre>
<div class="out">max-heaps made of 1 2 3 4 5:<br>
&nbsp;&nbsp;[5, 4, 3, 2, 1]<br>
&nbsp;&nbsp;[5, 4, 3, 1, 2]<br>
&nbsp;&nbsp;[5, 4, 2, 3, 1]<br>
&nbsp;&nbsp;[5, 4, 2, 1, 3]<br>
&nbsp;&nbsp;[5, 4, 1, 3, 2]<br>
&nbsp;&nbsp;[5, 4, 1, 2, 3]<br>
&nbsp;&nbsp;[5, 3, 4, 2, 1]<br>
&nbsp;&nbsp;[5, 3, 4, 1, 2]<br>
&nbsp;&nbsp;-&gt; 8 different heaps out of 120 orders<br>
n = 6: 20 different heaps<br>
n = 7: 80 different heaps</div>
<ul>
<li>Trong 120 thứ tự của 1 2 3 4 5, có tám thứ tự là heap max (max-heap); với 6 giá trị có 20 heap, với 7 giá trị có 80.</li>
<li>Luôn đúng: giá trị lớn nhất (5) nằm ở gốc, và giá trị lớn thứ hai (4) là con của gốc, vì chỉ 5 mới được đứng trên nó.</li>
<li>Giá trị nhỏ nhất (1) luôn là lá (leaf) — nếu có con thì con phải còn nhỏ hơn nó — nhưng là lá nào thì tuỳ thứ tự dữ liệu vào.</li>
</ul>
<p>Hệ quả: hai chương trình đều đúng vẫn có thể in ra hai heap khác nhau cho cùng dữ liệu. Cách dựng từ trên xuống (top-down) và từ dưới lên (bottom-up) ở slide 21–26 cho hai heap khác nhau từ cùng một mảng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> heap chỉ "có thứ tự một phần" (partially ordered) — có thứ tự dọc theo mọi đường đi từ gốc xuống, không có thứ tự theo chiều ngang của một mức.</p>
<div class="pitfall">Khi đề FE (thi cuối kỳ) hỏi "mảng nào là heap sau khi chèn 10, 20, … theo thứ tự này", chỉ một phương án đúng: có nhiều heap cho cùng một tập, nhưng một thuật toán cụ thể trên một dữ liệu vào cụ thể chỉ dựng ra đúng một heap. Hãy mô phỏng thuật toán từng bước; đừng chỉ kiểm tính chất heap.</div>`],
      [19, 'Heaps as Priority Queues - 1: enqueuing',
        `<p class="y-chinh">🎯 To enqueue into a heap, put the new element in the first free place of the last level — the end of the array — then move it up while it is larger than its father.</p>
<p class="ghi-chu">The slide shows enqueuing as a figure; the lesson's own example enqueues 20, then 30, into the heap of slide 16.</p>
<ol>
<li>n grows by one; the new cell is a[n − 1], so the shape stays nearly complete.</li>
<li>While the new value x is larger than its father a[(s−1)/2], move the father down into the empty cell s and go up: s = (s−1)/2.</li>
<li>Write x into the cell where the loop stopped.</li>
</ol>
<pre><code class="language-java">public class HeapEnqueue {
    static int[] a = new int[20];
    static int n = 0;

    static String show(int hole) {                   // the heap a[0..n-1]; "_" marks the empty cell
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; n; i++) s.append(i &gt; 0 ? ", " : "").append(i == hole ? "_" : "" + a[i]);
        return s.append("]").toString();
    }

    static void enqueue(int x) {
        int s = n++;                                 // a new cell at the end (last level, leftmost free place)
        System.out.println("enqueue " + x + ": empty cell at " + s + "  " + show(s));
        while (s &gt; 0 &amp;&amp; x &gt; a[(s - 1) / 2]) {        // bigger than the father: the father moves down
            int f = (s - 1) / 2;
            a[s] = a[f];
            System.out.println("   " + x + " &gt; " + a[s] + " (father at " + f + "): move " + a[s] + " down  " + show(f));
            s = f;
        }
        a[s] = x;                                    // x takes the empty cell
        String why = s == 0 ? "reached the root" : x + " &lt;= " + a[(s - 1) / 2] + " (father at " + (s - 1) / 2 + "): stop";
        System.out.println("   " + why + ", put " + x + " at " + s + "  " + show(-1));
    }

    public static void main(String[] args) {
        for (int x : new int[] {25, 13, 17, 5, 8, 3}) a[n++] = x;    // the max-heap of slide 16
        System.out.println("heap: " + show(-1));
        enqueue(20);
        enqueue(30);
    }
}</code></pre>
<div class="out">heap: [25, 13, 17, 5, 8, 3]<br>
enqueue 20: empty cell at 6 &nbsp;[25, 13, 17, 5, 8, 3, _]<br>
&nbsp;&nbsp;&nbsp;20 &gt; 17 (father at 2): move 17 down &nbsp;[25, 13, _, 5, 8, 3, 17]<br>
&nbsp;&nbsp;&nbsp;20 &lt;= 25 (father at 0): stop, put 20 at 2 &nbsp;[25, 13, 20, 5, 8, 3, 17]<br>
enqueue 30: empty cell at 7 &nbsp;[25, 13, 20, 5, 8, 3, 17, _]<br>
&nbsp;&nbsp;&nbsp;30 &gt; 5 (father at 3): move 5 down &nbsp;[25, 13, 20, _, 8, 3, 17, 5]<br>
&nbsp;&nbsp;&nbsp;30 &gt; 13 (father at 1): move 13 down &nbsp;[25, _, 20, 13, 8, 3, 17, 5]<br>
&nbsp;&nbsp;&nbsp;30 &gt; 25 (father at 0): move 25 down &nbsp;[_, 25, 20, 13, 8, 3, 17, 5]<br>
&nbsp;&nbsp;&nbsp;reached the root, put 30 at 0 &nbsp;[30, 25, 20, 13, 8, 3, 17, 5]</div>
<table>
<thead><tr><th>enqueue 30: step</th><th>Empty cell s</th><th>Father at (s−1)/2</th><th>30 > father?</th><th>Action</th></tr></thead>
<tbody>
<tr><td>1</td><td>7</td><td>index 3, value 5</td><td>yes</td><td>5 moves down to 7</td></tr>
<tr><td>2</td><td>3</td><td>index 1, value 13</td><td>yes</td><td>13 moves down to 3</td></tr>
<tr><td>3</td><td>1</td><td>index 0, value 25</td><td>yes</td><td>25 moves down to 1</td></tr>
<tr><td>4</td><td>0</td><td>none — the root</td><td>—</td><td>30 is written at 0</td></tr>
</tbody>
</table>
<p>This "move the father down, write x once" loop is exactly the inner loop of slide 27, <code>while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2]) { a[s]=a[(s-1)/2]; s=(s-1)/2; }</code> — one write per level instead of the three of a swap.</p>
<p><strong>Big-O:</strong> the new value climbs at most one level per step, at most ⌊log₂n⌋ steps — O(log n).</p>
<p class="meo">🧠 <strong>A priority queue in one sentence:</strong> the element with the highest priority leaves first, whenever it arrived — the ambulance passes the cars queuing at the gate (the syllabus's hint for "What is a priority queue?").</p>`,
        `<p class="y-chinh">🎯 Muốn thêm vào heap (đống) — thao tác enqueue, đưa vào hàng đợi — hãy đặt phần tử mới vào chỗ trống đầu tiên của mức cuối, tức cuối mảng, rồi đẩy nó lên chừng nào nó còn lớn hơn cha.</p>
<p class="ghi-chu">Slide minh hoạ phép thêm bằng hình; ví dụ của bài lần lượt thêm 20 rồi 30 vào heap của slide 16.</p>
<ol>
<li>n tăng thêm một; ô mới là a[n − 1], nên hình dạng vẫn gần đầy đủ (nearly complete).</li>
<li>Chừng nào giá trị mới x còn lớn hơn cha a[(s−1)/2], dời cha xuống ô trống s rồi đi lên: s = (s−1)/2.</li>
<li>Ghi x vào ô mà vòng lặp dừng lại.</li>
</ol>
<pre><code class="language-java">public class HeapEnqueue {
    static int[] a = new int[20];
    static int n = 0;

    static String show(int hole) {                   // heap a[0..n-1]; "_" là ô trống
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; n; i++) s.append(i &gt; 0 ? ", " : "").append(i == hole ? "_" : "" + a[i]);
        return s.append("]").toString();
    }

    static void enqueue(int x) {
        int s = n++;                                 // thêm một ô ở cuối (mức cuối, chỗ trống trái nhất)
        System.out.println("enqueue " + x + ": empty cell at " + s + "  " + show(s));
        while (s &gt; 0 &amp;&amp; x &gt; a[(s - 1) / 2]) {        // lớn hơn cha: cha dời xuống
            int f = (s - 1) / 2;
            a[s] = a[f];
            System.out.println("   " + x + " &gt; " + a[s] + " (father at " + f + "): move " + a[s] + " down  " + show(f));
            s = f;
        }
        a[s] = x;                                    // x vào ô trống
        String why = s == 0 ? "reached the root" : x + " &lt;= " + a[(s - 1) / 2] + " (father at " + (s - 1) / 2 + "): stop";
        System.out.println("   " + why + ", put " + x + " at " + s + "  " + show(-1));
    }

    public static void main(String[] args) {
        for (int x : new int[] {25, 13, 17, 5, 8, 3}) a[n++] = x;    // heap max của slide 16
        System.out.println("heap: " + show(-1));
        enqueue(20);
        enqueue(30);
    }
}</code></pre>
<div class="out">heap: [25, 13, 17, 5, 8, 3]<br>
enqueue 20: empty cell at 6 &nbsp;[25, 13, 17, 5, 8, 3, _]<br>
&nbsp;&nbsp;&nbsp;20 &gt; 17 (father at 2): move 17 down &nbsp;[25, 13, _, 5, 8, 3, 17]<br>
&nbsp;&nbsp;&nbsp;20 &lt;= 25 (father at 0): stop, put 20 at 2 &nbsp;[25, 13, 20, 5, 8, 3, 17]<br>
enqueue 30: empty cell at 7 &nbsp;[25, 13, 20, 5, 8, 3, 17, _]<br>
&nbsp;&nbsp;&nbsp;30 &gt; 5 (father at 3): move 5 down &nbsp;[25, 13, 20, _, 8, 3, 17, 5]<br>
&nbsp;&nbsp;&nbsp;30 &gt; 13 (father at 1): move 13 down &nbsp;[25, _, 20, 13, 8, 3, 17, 5]<br>
&nbsp;&nbsp;&nbsp;30 &gt; 25 (father at 0): move 25 down &nbsp;[_, 25, 20, 13, 8, 3, 17, 5]<br>
&nbsp;&nbsp;&nbsp;reached the root, put 30 at 0 &nbsp;[30, 25, 20, 13, 8, 3, 17, 5]</div>
<table>
<thead><tr><th>thêm 30: bước</th><th>Ô trống s</th><th>Cha ở (s−1)/2</th><th>30 > cha?</th><th>Việc làm</th></tr></thead>
<tbody>
<tr><td>1</td><td>7</td><td>chỉ số 3, giá trị 5</td><td>có</td><td>5 dời xuống ô 7</td></tr>
<tr><td>2</td><td>3</td><td>chỉ số 1, giá trị 13</td><td>có</td><td>13 dời xuống ô 3</td></tr>
<tr><td>3</td><td>1</td><td>chỉ số 0, giá trị 25</td><td>có</td><td>25 dời xuống ô 1</td></tr>
<tr><td>4</td><td>0</td><td>không có — đây là gốc</td><td>—</td><td>ghi 30 vào ô 0</td></tr>
</tbody>
</table>
<p>Vòng "dời cha xuống, ghi x một lần" này chính là vòng lặp trong của slide 27, <code>while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2]) { a[s]=a[(s-1)/2]; s=(s-1)/2; }</code> — mỗi mức chỉ một lần ghi thay vì ba lần của phép đổi chỗ (swap).</p>
<p><strong>Big-O:</strong> giá trị mới leo lên nhiều nhất một mức mỗi bước, tối đa ⌊log₂n⌋ bước — O(log n).</p>
<p class="meo">🧠 <strong>Hàng đợi ưu tiên (priority queue) trong một câu:</strong> phần tử có độ ưu tiên cao nhất được ra trước, bất kể đến lúc nào — xe cứu thương vượt qua hàng xe đang chờ ở cổng (gợi ý của syllabus cho câu "Hàng đợi ưu tiên là gì?").</p>`],
      [20, 'Heaps as Priority Queues - 2: dequeuing',
        `<p class="y-chinh">🎯 To dequeue, take the root (the maximum), move the last element into the root's place, and sift it down — always towards the larger son — until it is ≥ both sons.</p>
<p class="ghi-chu">The slide shows dequeuing as a figure; the lesson's own example dequeues twice from the heap that slide 19 ended with.</p>
<ol>
<li>Save a[0] — it is the answer. Take x = a[n − 1] and shrink n; the shape stays nearly complete.</li>
<li>The empty cell starts at the root. Pick the larger son; if it is larger than x, move it up and go down to its cell.</li>
<li>When no son is larger, or there is no son, write x into the empty cell.</li>
</ol>
<pre><code class="language-java">public class HeapDequeue {
    static int[] a = {30, 25, 20, 13, 8, 3, 17, 5};  // the heap after slide 19
    static int n = a.length;

    static String show(int hole) {
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; n; i++) s.append(i &gt; 0 ? ", " : "").append(i == hole ? "_" : "" + a[i]);
        return s.append("]").toString();
    }

    static int dequeue() {
        int top = a[0];                              // the largest element leaves
        int x = a[--n];                              // the last element must find a new place
        System.out.println("dequeue -&gt; " + top + "; last element " + x + " starts at the root  " + show(0));
        int f = 0, s = 1;                            // f: the empty cell, s: its left son
        if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1; // take the larger son
        while (s &lt; n &amp;&amp; x &lt; a[s]) {
            a[f] = a[s];                             // the larger son moves up
            System.out.println("   larger son " + a[s] + " &gt; " + x + ": move it up  " + show(s));
            f = s; s = 2 * f + 1;
            if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
        }
        a[f] = x;
        System.out.println("   " + (s &lt; n ? "larger son " + a[s] + " &lt;= " + x : "no son") + ": put " + x + " at " + f + "  " + show(-1));
        return top;
    }

    public static void main(String[] args) {
        System.out.println("heap: " + show(-1));
        dequeue();
        dequeue();
    }
}</code></pre>
<div class="out">heap: [30, 25, 20, 13, 8, 3, 17, 5]<br>
dequeue -&gt; 30; last element 5 starts at the root &nbsp;[_, 25, 20, 13, 8, 3, 17]<br>
&nbsp;&nbsp;&nbsp;larger son 25 &gt; 5: move it up &nbsp;[25, _, 20, 13, 8, 3, 17]<br>
&nbsp;&nbsp;&nbsp;larger son 13 &gt; 5: move it up &nbsp;[25, 13, 20, _, 8, 3, 17]<br>
&nbsp;&nbsp;&nbsp;no son: put 5 at 3 &nbsp;[25, 13, 20, 5, 8, 3, 17]<br>
dequeue -&gt; 25; last element 17 starts at the root &nbsp;[_, 13, 20, 5, 8, 3]<br>
&nbsp;&nbsp;&nbsp;larger son 20 &gt; 17: move it up &nbsp;[20, 13, _, 5, 8, 3]<br>
&nbsp;&nbsp;&nbsp;larger son 3 &lt;= 17: put 17 at 2 &nbsp;[20, 13, 17, 5, 8, 3]</div>
<table>
<thead><tr><th>dequeue #1 (x = 5): step</th><th>Empty cell f</th><th>Sons (index: value)</th><th>Larger son > 5?</th><th>Action</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>1: 25, 2: 20</td><td>25, yes</td><td>25 moves up to 0</td></tr>
<tr><td>2</td><td>1</td><td>3: 13, 4: 8</td><td>13, yes</td><td>13 moves up to 1</td></tr>
<tr><td>3</td><td>3</td><td>none — index 7 is outside n = 7</td><td>—</td><td>5 is written at 3</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> one level per step, ⌊log₂n⌋ levels → O(log n); <code>peek()</code>, reading a[0] without removing it, is O(1). Dequeuing again and again returns 30, 25, 20, … in decreasing order — the idea of heap sort (slide 28).</p>
<div class="pitfall">In a max-heap always move the <em>larger</em> son up (the smaller one in a min-heap). Moving the smaller son up puts a small value above its larger sibling: the heap is broken and later dequeues return wrong answers.</div>`,
        `<p class="y-chinh">🎯 Muốn lấy ra khỏi heap (đống) — thao tác dequeue — hãy lấy gốc (phần tử lớn nhất), đưa phần tử cuối vào chỗ của gốc, rồi đẩy nó xuống — luôn về phía con lớn hơn — tới khi nó ≥ cả hai con.</p>
<p class="ghi-chu">Slide minh hoạ phép lấy ra bằng hình; ví dụ của bài lấy ra hai lần từ heap mà slide 19 để lại.</p>
<ol>
<li>Cất a[0] — đó là kết quả trả về. Lấy x = a[n − 1] rồi giảm n; hình dạng vẫn gần đầy đủ.</li>
<li>Ô trống bắt đầu ở gốc. Chọn con lớn hơn; nếu nó lớn hơn x thì dời nó lên, rồi đi xuống ô của nó.</li>
<li>Khi không con nào lớn hơn, hoặc không còn con, ghi x vào ô trống.</li>
</ol>
<pre><code class="language-java">public class HeapDequeue {
    static int[] a = {30, 25, 20, 13, 8, 3, 17, 5};  // heap sau slide 19
    static int n = a.length;

    static String show(int hole) {
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; n; i++) s.append(i &gt; 0 ? ", " : "").append(i == hole ? "_" : "" + a[i]);
        return s.append("]").toString();
    }

    static int dequeue() {
        int top = a[0];                              // phần tử lớn nhất rời heap
        int x = a[--n];                              // phần tử cuối phải tìm chỗ mới
        System.out.println("dequeue -&gt; " + top + "; last element " + x + " starts at the root  " + show(0));
        int f = 0, s = 1;                            // f: ô trống, s: con trái của nó
        if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1; // chọn con lớn hơn
        while (s &lt; n &amp;&amp; x &lt; a[s]) {
            a[f] = a[s];                             // con lớn hơn dời lên
            System.out.println("   larger son " + a[s] + " &gt; " + x + ": move it up  " + show(s));
            f = s; s = 2 * f + 1;
            if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
        }
        a[f] = x;
        System.out.println("   " + (s &lt; n ? "larger son " + a[s] + " &lt;= " + x : "no son") + ": put " + x + " at " + f + "  " + show(-1));
        return top;
    }

    public static void main(String[] args) {
        System.out.println("heap: " + show(-1));
        dequeue();
        dequeue();
    }
}</code></pre>
<div class="out">heap: [30, 25, 20, 13, 8, 3, 17, 5]<br>
dequeue -&gt; 30; last element 5 starts at the root &nbsp;[_, 25, 20, 13, 8, 3, 17]<br>
&nbsp;&nbsp;&nbsp;larger son 25 &gt; 5: move it up &nbsp;[25, _, 20, 13, 8, 3, 17]<br>
&nbsp;&nbsp;&nbsp;larger son 13 &gt; 5: move it up &nbsp;[25, 13, 20, _, 8, 3, 17]<br>
&nbsp;&nbsp;&nbsp;no son: put 5 at 3 &nbsp;[25, 13, 20, 5, 8, 3, 17]<br>
dequeue -&gt; 25; last element 17 starts at the root &nbsp;[_, 13, 20, 5, 8, 3]<br>
&nbsp;&nbsp;&nbsp;larger son 20 &gt; 17: move it up &nbsp;[20, 13, _, 5, 8, 3]<br>
&nbsp;&nbsp;&nbsp;larger son 3 &lt;= 17: put 17 at 2 &nbsp;[20, 13, 17, 5, 8, 3]</div>
<table>
<thead><tr><th>lấy ra lần 1 (x = 5): bước</th><th>Ô trống f</th><th>Các con (chỉ số: giá trị)</th><th>Con lớn hơn > 5?</th><th>Việc làm</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>1: 25, 2: 20</td><td>25, có</td><td>25 dời lên ô 0</td></tr>
<tr><td>2</td><td>1</td><td>3: 13, 4: 8</td><td>13, có</td><td>13 dời lên ô 1</td></tr>
<tr><td>3</td><td>3</td><td>không có — chỉ số 7 nằm ngoài n = 7</td><td>—</td><td>ghi 5 vào ô 3</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> mỗi bước xuống một mức, có ⌊log₂n⌋ mức → O(log n); <code>peek()</code> — đọc a[0] mà không lấy ra — là O(1). Lấy ra liên tục sẽ được 30, 25, 20, … theo thứ tự giảm dần — chính là ý tưởng của heap sort (sắp xếp vun đống, slide 28).</p>
<div class="pitfall">Trong heap max luôn dời con <em>lớn hơn</em> lên (với heap min là con nhỏ hơn). Dời con nhỏ hơn lên sẽ đặt một giá trị nhỏ lên trên người anh em lớn hơn nó: heap hỏng và các lần lấy ra sau trả kết quả sai.</div>`],
      [21, 'Organizing Arrays as Heaps - 1: top-down method',
        `<p class="y-chinh">🎯 The top-down method turns an array into a heap by treating a[0] as a one-element heap and enqueuing a[1], a[2], …, a[n−1] one at a time — each new element sifts up.</p>
<p class="ghi-chu">Slides 21–23 draw the top-down steps as pictures. To trace them, the lesson runs the code of slide 27 on the array of slides 24–26, [2 8 6 1 10 15 3 12 11], chosen so that the two methods can be compared on the same input; its eight steps are split over slides 21, 22 and 23.</p>
<pre><code class="language-java">public class TopDownHeap {
    static String show(int[] a, int last) {          // a[0..last] is already a heap, "|" separates the rest
        StringBuilder s = new StringBuilder("[");
        for (int k = 0; k &lt; a.length; k++) s.append(k == 0 ? "" : k == last + 1 ? " | " : ", ").append(a[k]);
        return s.append("]").toString();
    }

    public static void main(String[] args) {
        int[] a = {2, 8, 6, 1, 10, 15, 3, 12, 11};   // the array of slides 24-26
        int n = a.length;
        System.out.println("start          " + show(a, 0));
        //Transform the array to HEAP
        int i,s,f;int x;
        for(i=1;i&lt;n;i++)
        { x=a[i]; s=i; // s  is a son, f=(s-1)/2 is father
          while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])
          { a[s]=a[(s-1)/2];   s=(s-1)/2;  };
          a[s]=x;
          System.out.printf("i=%d x=%-2d s=%d  %s%n", i, x, s, show(a, i));   // added: print
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2 | 8, 6, 1, 10, 15, 3, 12, 11]<br>
i=1 x=8 &nbsp;s=0 &nbsp;[8, 2 | 6, 1, 10, 15, 3, 12, 11]<br>
i=2 x=6 &nbsp;s=2 &nbsp;[8, 2, 6 | 1, 10, 15, 3, 12, 11]<br>
i=3 x=1 &nbsp;s=3 &nbsp;[8, 2, 6, 1 | 10, 15, 3, 12, 11]<br>
i=4 x=10 s=0 &nbsp;[10, 8, 6, 1, 2 | 15, 3, 12, 11]<br>
i=5 x=15 s=0 &nbsp;[15, 8, 10, 1, 2, 6 | 3, 12, 11]<br>
i=6 x=3 &nbsp;s=6 &nbsp;[15, 8, 10, 1, 2, 6, 3 | 12, 11]<br>
i=7 x=12 s=1 &nbsp;[15, 12, 10, 8, 2, 6, 3, 1 | 11]<br>
i=8 x=11 s=3 &nbsp;[15, 12, 10, 11, 2, 6, 3, 1, 8]</div>
<p>In the output, "|" separates the heap built so far (left) from the elements not yet inserted (right); <code>s</code> is the index where x stopped.</p>
<table>
<thead><tr><th>i</th><th>x</th><th>Fathers met on the way up</th><th>Stops at s</th><th>Array after the step</th></tr></thead>
<tbody>
<tr><td>1</td><td>8</td><td>8 > 2 (index 0): 2 moves down</td><td>0</td><td>[8, 2 | 6, 1, 10, 15, 3, 12, 11]</td></tr>
<tr><td>2</td><td>6</td><td>6 is not > 8 (index 0)</td><td>2</td><td>[8, 2, 6 | 1, 10, 15, 3, 12, 11]</td></tr>
<tr><td>3</td><td>1</td><td>1 is not > 2 (index 1)</td><td>3</td><td>[8, 2, 6, 1 | 10, 15, 3, 12, 11]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">after i = 3: a[0..3] = 8 2 6 1 is a heap
        8
      /   \\
     2     6
    /
   1</code></pre>
<ul>
<li>i = 1: 8 is larger than its father 2, so 2 moves down to index 1 and 8 becomes the root.</li>
<li>i = 2 and i = 3: 6 and 1 are not larger than their fathers (8 and 2) — they stay where they are, with no move at all.</li>
</ul>
<p><strong>Big-O:</strong> the element inserted at index i may climb ⌊log₂(i+1)⌋ levels; summed over the whole array that is O(n log n) in the worst case — slide 27 measures it.</p>`,
        `<p class="y-chinh">🎯 Phương pháp từ trên xuống (top-down) biến một mảng thành heap (đống) bằng cách coi a[0] là heap một phần tử rồi lần lượt thêm (enqueue) a[1], a[2], …, a[n−1] — mỗi phần tử mới được đẩy lên (sift up).</p>
<p class="ghi-chu">Slide 21–23 vẽ các bước top-down bằng hình. Để lần theo, bài chạy code của slide 27 trên mảng của slide 24–26, [2 8 6 1 10 15 3 12 11] — chọn mảng này để so sánh hai phương pháp trên cùng dữ liệu; tám bước của nó được chia ra slide 21, 22 và 23.</p>
<pre><code class="language-java">public class TopDownHeap {
    static String show(int[] a, int last) {          // a[0..last] đã là heap, "|" ngăn phần còn lại
        StringBuilder s = new StringBuilder("[");
        for (int k = 0; k &lt; a.length; k++) s.append(k == 0 ? "" : k == last + 1 ? " | " : ", ").append(a[k]);
        return s.append("]").toString();
    }

    public static void main(String[] args) {
        int[] a = {2, 8, 6, 1, 10, 15, 3, 12, 11};   // mảng của slide 24-26
        int n = a.length;
        System.out.println("start          " + show(a, 0));
        //Transform the array to HEAP
        int i,s,f;int x;
        for(i=1;i&lt;n;i++)
        { x=a[i]; s=i; // s là con, f=(s-1)/2 là cha
          while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])
          { a[s]=a[(s-1)/2];   s=(s-1)/2;  };
          a[s]=x;
          System.out.printf("i=%d x=%-2d s=%d  %s%n", i, x, s, show(a, i));   // thêm: in ra
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2 | 8, 6, 1, 10, 15, 3, 12, 11]<br>
i=1 x=8 &nbsp;s=0 &nbsp;[8, 2 | 6, 1, 10, 15, 3, 12, 11]<br>
i=2 x=6 &nbsp;s=2 &nbsp;[8, 2, 6 | 1, 10, 15, 3, 12, 11]<br>
i=3 x=1 &nbsp;s=3 &nbsp;[8, 2, 6, 1 | 10, 15, 3, 12, 11]<br>
i=4 x=10 s=0 &nbsp;[10, 8, 6, 1, 2 | 15, 3, 12, 11]<br>
i=5 x=15 s=0 &nbsp;[15, 8, 10, 1, 2, 6 | 3, 12, 11]<br>
i=6 x=3 &nbsp;s=6 &nbsp;[15, 8, 10, 1, 2, 6, 3 | 12, 11]<br>
i=7 x=12 s=1 &nbsp;[15, 12, 10, 8, 2, 6, 3, 1 | 11]<br>
i=8 x=11 s=3 &nbsp;[15, 12, 10, 11, 2, 6, 3, 1, 8]</div>
<p>Trong output, dấu "|" ngăn phần heap đã dựng (bên trái) với các phần tử chưa được chèn (bên phải); <code>s</code> là chỉ số nơi x dừng lại.</p>
<table>
<thead><tr><th>i</th><th>x</th><th>Các cha gặp trên đường đi lên</th><th>Dừng ở s</th><th>Mảng sau bước này</th></tr></thead>
<tbody>
<tr><td>1</td><td>8</td><td>8 > 2 (chỉ số 0): 2 dời xuống</td><td>0</td><td>[8, 2 | 6, 1, 10, 15, 3, 12, 11]</td></tr>
<tr><td>2</td><td>6</td><td>6 không > 8 (chỉ số 0)</td><td>2</td><td>[8, 2, 6 | 1, 10, 15, 3, 12, 11]</td></tr>
<tr><td>3</td><td>1</td><td>1 không > 2 (chỉ số 1)</td><td>3</td><td>[8, 2, 6, 1 | 10, 15, 3, 12, 11]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">sau i = 3: a[0..3] = 8 2 6 1 là một heap
        8
      /   \\
     2     6
    /
   1</code></pre>
<ul>
<li>i = 1: 8 lớn hơn cha của nó là 2, nên 2 dời xuống chỉ số 1 và 8 thành gốc.</li>
<li>i = 2 và i = 3: 6 và 1 không lớn hơn cha (8 và 2) — chúng đứng yên tại chỗ, không có lần dời nào.</li>
</ul>
<p><strong>Big-O:</strong> phần tử chèn ở chỉ số i có thể leo ⌊log₂(i+1)⌋ mức; cộng trên cả mảng là O(n log n) trong trường hợp xấu nhất — slide 27 sẽ đo điều này.</p>`],
      [22, 'Organizing Arrays as Heaps - 2: top-down method (continued)',
        `<p class="y-chinh">🎯 Steps i = 4, 5, 6 of the top-down run: the large values 10 and 15 climb all the way to the root, while 3 stays where it is.</p>
<p class="ghi-chu">The slide continues the top-down figure; these three steps come from the run printed on slide 21.</p>
<table>
<thead><tr><th>i</th><th>x</th><th>Fathers met on the way up</th><th>Stops at s</th><th>Array after the step</th></tr></thead>
<tbody>
<tr><td>4</td><td>10</td><td>10 > 2 (index 1), 10 > 8 (index 0)</td><td>0</td><td>[10, 8, 6, 1, 2 | 15, 3, 12, 11]</td></tr>
<tr><td>5</td><td>15</td><td>15 > 6 (index 2), 15 > 10 (index 0)</td><td>0</td><td>[15, 8, 10, 1, 2, 6 | 3, 12, 11]</td></tr>
<tr><td>6</td><td>3</td><td>3 is not > 10 (index 2)</td><td>6</td><td>[15, 8, 10, 1, 2, 6, 3 | 12, 11]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">after i = 6: a[0..6] is a heap
            15
          /    \\
         8      10
        / \\    /  \\
       1   2  6    3</code></pre>
<ul>
<li>i = 4: 10 enters at index 4, whose father is index 1 (value 2): 2 moves down; next father is index 0 (value 8): 8 moves down; 10 is written at the root.</li>
<li>i = 5: 15 enters at index 5 (father: index 2, value 6), passes 6 and then 10 — a new maximum always ends at the root.</li>
<li>i = 6: 3 enters at index 6; its father, index 2, now holds 10, so nothing moves.</li>
</ul>
<p>Each step moves at most as many elements as there are levels above the new cell: indexes 3–6 are on level 3, so at most two moves each.</p>
<p class="meo">🧠 <strong>Remember:</strong> in the top-down build a new element only climbs — it never goes down and never looks at its sibling.</p>`,
        `<p class="y-chinh">🎯 Các bước i = 4, 5, 6 của lần chạy top-down (từ trên xuống): hai giá trị lớn 10 và 15 leo tận lên gốc, còn 3 đứng yên.</p>
<p class="ghi-chu">Slide vẽ tiếp hình của cách top-down; ba bước dưới đây lấy từ lần chạy đã in ở slide 21.</p>
<table>
<thead><tr><th>i</th><th>x</th><th>Các cha gặp trên đường đi lên</th><th>Dừng ở s</th><th>Mảng sau bước này</th></tr></thead>
<tbody>
<tr><td>4</td><td>10</td><td>10 > 2 (chỉ số 1), 10 > 8 (chỉ số 0)</td><td>0</td><td>[10, 8, 6, 1, 2 | 15, 3, 12, 11]</td></tr>
<tr><td>5</td><td>15</td><td>15 > 6 (chỉ số 2), 15 > 10 (chỉ số 0)</td><td>0</td><td>[15, 8, 10, 1, 2, 6 | 3, 12, 11]</td></tr>
<tr><td>6</td><td>3</td><td>3 không > 10 (chỉ số 2)</td><td>6</td><td>[15, 8, 10, 1, 2, 6, 3 | 12, 11]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">sau i = 6: a[0..6] là một heap
            15
          /    \\
         8      10
        / \\    /  \\
       1   2  6    3</code></pre>
<ul>
<li>i = 4: 10 vào ở chỉ số 4, cha là chỉ số 1 (giá trị 2): 2 dời xuống; cha kế tiếp là chỉ số 0 (giá trị 8): 8 dời xuống; 10 được ghi vào gốc.</li>
<li>i = 5: 15 vào ở chỉ số 5 (cha: chỉ số 2, giá trị 6), vượt qua 6 rồi 10 — một giá trị lớn nhất mới luôn kết thúc ở gốc.</li>
<li>i = 6: 3 vào ở chỉ số 6; cha của nó, chỉ số 2, lúc này đang giữ 10, nên không có gì dời.</li>
</ul>
<p>Mỗi bước dời nhiều nhất bằng số mức nằm phía trên ô mới: các chỉ số 3–6 ở mức 3, nên mỗi bước dời tối đa hai lần.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trong cách dựng top-down, phần tử mới chỉ leo lên — không bao giờ đi xuống và không bao giờ nhìn sang người anh em (sibling) của nó.</p>`],
      [23, 'Organizing Arrays as Heaps - 3: top-down method (continued)',
        `<p class="y-chinh">🎯 The last two insertions, 12 and 11, finish the heap: [15, 12, 10, 11, 2, 6, 3, 1, 8].</p>
<p class="ghi-chu">The last figure of the top-down series; the two final steps of the slide-21 run are traced below.</p>
<table>
<thead><tr><th>i</th><th>x</th><th>Fathers met on the way up</th><th>Stops at s</th><th>Array after the step</th></tr></thead>
<tbody>
<tr><td>7</td><td>12</td><td>12 > 1 (index 3), 12 > 8 (index 1), 12 is not > 15 (index 0)</td><td>1</td><td>[15, 12, 10, 8, 2, 6, 3, 1 | 11]</td></tr>
<tr><td>8</td><td>11</td><td>11 > 8 (index 3), 11 is not > 12 (index 1)</td><td>3</td><td>[15, 12, 10, 11, 2, 6, 3, 1, 8]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">the heap built top-down
                15
             /      \\
           12        10
          /  \\      /  \\
        11    2    6    3
       /  \\
      1    8</code></pre>
<ul>
<li>i = 7: 12 enters at index 7, on level 4; 1 and then 8 move down one level each, and 12 stops just below 15.</li>
<li>i = 8: 11 enters at index 8; 8 moves down, and 11 stops just below 12.</li>
<li>Check: every father ≥ its sons — 15 ≥ 12, 10; 12 ≥ 11, 2; 10 ≥ 6, 3; 11 ≥ 1, 8.</li>
</ul>
<p>In total 8 elements moved for 8 insertions on this input. The next three slides build a heap from the same array bottom-up and obtain a <em>different</em> heap — both are correct (slide 18).</p>
<div class="pitfall">The loop bound is <code>i&lt;n</code>. Stopping one step early (<code>i&lt;n-1</code>) leaves 11 at index 8 under its father 8 — not a heap. An off-by-one in the loop bound is a classic PE mistake.</div>`,
        `<p class="y-chinh">🎯 Hai lần chèn cuối, 12 và 11, hoàn tất heap (đống): [15, 12, 10, 11, 2, 6, 3, 1, 8].</p>
<p class="ghi-chu">Hình cuối của loạt top-down; hai bước sau cùng của lần chạy ở slide 21 được lần theo dưới đây.</p>
<table>
<thead><tr><th>i</th><th>x</th><th>Các cha gặp trên đường đi lên</th><th>Dừng ở s</th><th>Mảng sau bước này</th></tr></thead>
<tbody>
<tr><td>7</td><td>12</td><td>12 > 1 (chỉ số 3), 12 > 8 (chỉ số 1), 12 không > 15 (chỉ số 0)</td><td>1</td><td>[15, 12, 10, 8, 2, 6, 3, 1 | 11]</td></tr>
<tr><td>8</td><td>11</td><td>11 > 8 (chỉ số 3), 11 không > 12 (chỉ số 1)</td><td>3</td><td>[15, 12, 10, 11, 2, 6, 3, 1, 8]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">heap dựng theo kiểu top-down
                15
             /      \\
           12        10
          /  \\      /  \\
        11    2    6    3
       /  \\
      1    8</code></pre>
<ul>
<li>i = 7: 12 vào ở chỉ số 7, thuộc mức 4; lần lượt 1 rồi 8 dời xuống một mức, và 12 dừng ngay dưới 15.</li>
<li>i = 8: 11 vào ở chỉ số 8; 8 dời xuống, và 11 dừng ngay dưới 12.</li>
<li>Kiểm lại: mọi cha ≥ các con — 15 ≥ 12, 10; 12 ≥ 11, 2; 10 ≥ 6, 3; 11 ≥ 1, 8.</li>
</ul>
<p>Tổng cộng có 8 lần dời phần tử cho 8 lần chèn trên dữ liệu này. Ba slide tiếp theo dựng heap từ cùng mảng theo kiểu từ dưới lên (bottom-up) và được một heap <em>khác</em> — cả hai đều đúng (slide 18).</p>
<div class="pitfall">Cận của vòng lặp là <code>i&lt;n</code>. Dừng sớm một bước (<code>i&lt;n-1</code>) thì 11 nằm lại ở chỉ số 8 dưới cha là 8 — không phải heap. Sai lệch một (off-by-one) ở cận vòng lặp là lỗi PE (thi thực hành) kinh điển.</div>`],
      [24, 'Organizing Arrays as Heaps - 4: bottom-up method',
        `<p class="y-chinh">🎯 The bottom-up method (Floyd's) takes the whole array as a tree and repairs it from the last internal node back to the root, sifting each node down.</p>
<p class="ghi-chu">The slide's figure transforms the array [2 8 6 1 10 15 3 12 11], written in its title, into a heap bottom-up; the lesson traces the same array below — compare each step with the figures of slides 24–26.</p>
<ul>
<li>The leaves, indexes 4 to 8 here, are already one-element heaps: nothing to do.</li>
<li>Start at the last internal node, n/2 − 1 = 9/2 − 1 = 3, and go backwards to 0.</li>
<li>When index i is processed, both subtrees below it are already heaps; sifting a[i] down, towards the larger son, makes the subtree rooted at i a heap.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class BottomUpHeap {
    // Move a[f] down inside a[0..n-1] until it is &gt;= both sons; returns where it stops
    static int siftDown(int[] a, int f, int n) {
        int x = a[f];
        int s = 2 * f + 1;                           // s is the left son
        if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1; // the right son is larger: take it
        while (s &lt; n &amp;&amp; x &lt; a[s]) {
            a[f] = a[s]; f = s; s = 2 * f + 1;       // the son moves up, the hole moves down
            if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
        }
        a[f] = x;
        return f;
    }

    public static void main(String[] args) {
        int[] a = {2, 8, 6, 1, 10, 15, 3, 12, 11};   // the array written on slides 24-26
        int n = a.length;
        System.out.println("start        " + Arrays.toString(a) + "   last internal node: n/2-1 = " + (n / 2 - 1));
        for (int i = n / 2 - 1; i &gt;= 0; i--) {       // from the last internal node back to the root
            int x = a[i];
            int stop = siftDown(a, i, n);
            System.out.printf("i=%d: %-2d sinks %d -&gt; %d  %s%n", i, x, i, stop, Arrays.toString(a));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2, 8, 6, 1, 10, 15, 3, 12, 11] &nbsp;&nbsp;last internal node: n/2-1 = 3<br>
i=3: 1 &nbsp;sinks 3 -&gt; 7 &nbsp;[2, 8, 6, 12, 10, 15, 3, 1, 11]<br>
i=2: 6 &nbsp;sinks 2 -&gt; 5 &nbsp;[2, 8, 15, 12, 10, 6, 3, 1, 11]<br>
i=1: 8 &nbsp;sinks 1 -&gt; 8 &nbsp;[2, 12, 15, 11, 10, 6, 3, 1, 8]<br>
i=0: 2 &nbsp;sinks 0 -&gt; 5 &nbsp;[15, 12, 6, 11, 10, 2, 3, 1, 8]</div>
<table>
<thead><tr><th>i</th><th>a[i]</th><th>Sons (index: value)</th><th>What happens</th><th>Array after</th></tr></thead>
<tbody>
<tr><td>3</td><td>1</td><td>7: 12, 8: 11</td><td>the larger son 12 moves up; 1 sinks to index 7, a leaf</td><td>[2, 8, 6, 12, 10, 15, 3, 1, 11]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">start: the array seen as a tree          after i = 3
            2                                  2
         /     \\                            /     \\
        8       6                          8       6
       / \\     / \\                        / \\     / \\
      1  10  15   3                     12  10  15   3
     / \\                                / \\
   12   11                             1   11</code></pre>
<p><code>siftDown</code> is the loop of slide 28: <code>s</code> is the larger son, the son moves up, the empty cell moves down.</p>
<div class="pitfall">Start at n/2 − 1 and go <em>down</em> to 0. Going the other way (0 upwards) fails: when the root is processed its subtrees are not heaps yet, and a large value deep in the tree never reaches the top — on this array the root would end as 8, with 15 stuck one level below it.</div>`,
        `<p class="y-chinh">🎯 Phương pháp từ dưới lên (bottom-up, của Floyd) coi cả mảng là một cây rồi sửa nó từ nút trong (internal node) cuối cùng lùi về gốc, đẩy xuống (sift down) từng nút.</p>
<p class="ghi-chu">Hình trên slide biến mảng [2 8 6 1 10 15 3 12 11] — ghi ngay trong tiêu đề slide — thành heap (đống) theo kiểu từ dưới lên; bài lần theo đúng mảng đó dưới đây — hãy đối chiếu từng bước với hình của slide 24–26.</p>
<ul>
<li>Các lá (leaf), ở đây là chỉ số 4 tới 8, vốn đã là heap một phần tử: không phải làm gì.</li>
<li>Bắt đầu ở nút trong cuối cùng, n/2 − 1 = 9/2 − 1 = 3, rồi lùi dần về 0.</li>
<li>Khi xử lý chỉ số i, hai cây con bên dưới nó đều đã là heap; đẩy a[i] xuống, về phía con lớn hơn, sẽ biến cây con gốc i thành heap.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class BottomUpHeap {
    // Đẩy a[f] xuống trong a[0..n-1] tới khi &gt;= cả hai con; trả về chỗ dừng
    static int siftDown(int[] a, int f, int n) {
        int x = a[f];
        int s = 2 * f + 1;                           // s là con trái
        if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1; // con phải lớn hơn: chọn nó
        while (s &lt; n &amp;&amp; x &lt; a[s]) {
            a[f] = a[s]; f = s; s = 2 * f + 1;       // con dời lên, ô trống đi xuống
            if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
        }
        a[f] = x;
        return f;
    }

    public static void main(String[] args) {
        int[] a = {2, 8, 6, 1, 10, 15, 3, 12, 11};   // mảng ghi trên slide 24-26
        int n = a.length;
        System.out.println("start        " + Arrays.toString(a) + "   last internal node: n/2-1 = " + (n / 2 - 1));
        for (int i = n / 2 - 1; i &gt;= 0; i--) {       // từ nút trong cuối cùng lùi về gốc
            int x = a[i];
            int stop = siftDown(a, i, n);
            System.out.printf("i=%d: %-2d sinks %d -&gt; %d  %s%n", i, x, i, stop, Arrays.toString(a));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2, 8, 6, 1, 10, 15, 3, 12, 11] &nbsp;&nbsp;last internal node: n/2-1 = 3<br>
i=3: 1 &nbsp;sinks 3 -&gt; 7 &nbsp;[2, 8, 6, 12, 10, 15, 3, 1, 11]<br>
i=2: 6 &nbsp;sinks 2 -&gt; 5 &nbsp;[2, 8, 15, 12, 10, 6, 3, 1, 11]<br>
i=1: 8 &nbsp;sinks 1 -&gt; 8 &nbsp;[2, 12, 15, 11, 10, 6, 3, 1, 8]<br>
i=0: 2 &nbsp;sinks 0 -&gt; 5 &nbsp;[15, 12, 6, 11, 10, 2, 3, 1, 8]</div>
<table>
<thead><tr><th>i</th><th>a[i]</th><th>Các con (chỉ số: giá trị)</th><th>Chuyện xảy ra</th><th>Mảng sau đó</th></tr></thead>
<tbody>
<tr><td>3</td><td>1</td><td>7: 12, 8: 11</td><td>con lớn hơn là 12 dời lên; 1 chìm xuống chỉ số 7, một lá</td><td>[2, 8, 6, 12, 10, 15, 3, 1, 11]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">ban đầu: mảng nhìn như một cây           sau i = 3
            2                                  2
         /     \\                            /     \\
        8       6                          8       6
       / \\     / \\                        / \\     / \\
      1  10  15   3                     12  10  15   3
     / \\                                / \\
   12   11                             1   11</code></pre>
<p><code>siftDown</code> chính là vòng lặp của slide 28: <code>s</code> là con lớn hơn, con dời lên, ô trống đi xuống.</p>
<div class="pitfall">Bắt đầu ở n/2 − 1 và đi <em>lùi</em> về 0. Đi theo chiều ngược lại (từ 0 đi lên) sẽ sai: khi xử lý gốc, các cây con của nó chưa phải heap, và một giá trị lớn nằm sâu trong cây không bao giờ lên được tới đỉnh — với mảng này gốc sẽ là 8, còn 15 kẹt lại ngay mức bên dưới.</div>`],
      [25, 'Organizing Arrays as Heaps - 5: bottom-up method (continued)',
        `<p class="y-chinh">🎯 Steps i = 2 and i = 1 of the bottom-up run: 6 sinks below 15, and 8 sinks two levels, passing 12 and then 11.</p>
<p class="ghi-chu">The slide continues the bottom-up figure; the two steps below come from the run printed on slide 24.</p>
<table>
<thead><tr><th>i</th><th>a[i]</th><th>Sons (index: value)</th><th>What happens</th><th>Array after</th></tr></thead>
<tbody>
<tr><td>2</td><td>6</td><td>5: 15, 6: 3</td><td>15 moves up; 6 sinks to index 5, a leaf</td><td>[2, 8, 15, 12, 10, 6, 3, 1, 11]</td></tr>
<tr><td>1</td><td>8</td><td>3: 12, 4: 10, then 7: 1, 8: 11</td><td>12 moves up, then 11 moves up; 8 sinks to index 8</td><td>[2, 12, 15, 11, 10, 6, 3, 1, 8]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">after i = 1: both subtrees of the root are heaps
            2
         /     \\
       12       15
       / \\     /  \\
     11   10  6    3
     / \\
    1   8</code></pre>
<ul>
<li>i = 2: the larger son of 6 is 15, at index 5; 15 moves up, and since index 5 is a leaf, 6 stops there.</li>
<li>i = 1: the larger son of 8 is 12 (index 3); 12 moves up. At index 3 the sons are 1 and 11; the larger, 11, is > 8, so 11 moves up and 8 lands on the leaf at index 8.</li>
<li>Only the root is left, and it holds the smallest value of the array, 2.</li>
</ul>
<p>The low levels are cheap: the nodes at indexes 3 and 2 moved one level each, the node at index 1 two levels.</p>
<p class="meo">🧠 <strong>Remember:</strong> sift-down compares with <em>both</em> sons and follows the larger one; sift-up compares with the father only.</p>`,
        `<p class="y-chinh">🎯 Các bước i = 2 và i = 1 của lần chạy bottom-up (từ dưới lên): 6 chìm xuống dưới 15, còn 8 chìm hai mức, lần lượt nhường chỗ cho 12 rồi 11.</p>
<p class="ghi-chu">Slide vẽ tiếp hình của cách bottom-up; hai bước dưới đây lấy từ lần chạy đã in ở slide 24.</p>
<table>
<thead><tr><th>i</th><th>a[i]</th><th>Các con (chỉ số: giá trị)</th><th>Chuyện xảy ra</th><th>Mảng sau đó</th></tr></thead>
<tbody>
<tr><td>2</td><td>6</td><td>5: 15, 6: 3</td><td>15 dời lên; 6 chìm xuống chỉ số 5, một lá</td><td>[2, 8, 15, 12, 10, 6, 3, 1, 11]</td></tr>
<tr><td>1</td><td>8</td><td>3: 12, 4: 10, rồi 7: 1, 8: 11</td><td>12 dời lên, rồi 11 dời lên; 8 chìm xuống chỉ số 8</td><td>[2, 12, 15, 11, 10, 6, 3, 1, 8]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">sau i = 1: hai cây con của gốc đều đã là heap
            2
         /     \\
       12       15
       / \\     /  \\
     11   10  6    3
     / \\
    1   8</code></pre>
<ul>
<li>i = 2: con lớn hơn của 6 là 15, ở chỉ số 5; 15 dời lên, và vì chỉ số 5 là lá (leaf) nên 6 dừng ở đó.</li>
<li>i = 1: con lớn hơn của 8 là 12 (chỉ số 3); 12 dời lên. Ở chỉ số 3 hai con là 1 và 11; con lớn hơn, 11, lớn hơn 8, nên 11 dời lên và 8 rơi xuống lá ở chỉ số 8.</li>
<li>Chỉ còn lại gốc, và nó đang giữ giá trị nhỏ nhất của mảng: 2.</li>
</ul>
<p>Các mức thấp rất rẻ: nút ở chỉ số 3 và 2 mỗi nút chỉ dời một mức, nút ở chỉ số 1 dời hai mức.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đẩy xuống (sift-down) so với <em>cả hai</em> con và đi theo con lớn hơn; đẩy lên (sift-up) chỉ so với cha.</p>`],
      [26, 'Organizing Arrays as Heaps - 6: bottom-up method (continued)',
        `<p class="y-chinh">🎯 The last step sifts 2 down from the root, past 15 and then 6, giving the heap [15, 12, 6, 11, 10, 2, 3, 1, 8] — with fewer moves than the top-down method.</p>
<p class="ghi-chu">The last figure of the bottom-up series; the final step of the slide-24 run is traced below.</p>
<table>
<thead><tr><th>i</th><th>a[i]</th><th>Sons (index: value)</th><th>What happens</th><th>Array after</th></tr></thead>
<tbody>
<tr><td>0</td><td>2</td><td>1: 12, 2: 15, then 5: 6, 6: 3</td><td>15 moves up, then 6 moves up; 2 sinks to index 5</td><td>[15, 12, 6, 11, 10, 2, 3, 1, 8]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">the heap built bottom-up
                15
             /      \\
           12         6
          /  \\       /  \\
        11    10    2    3
       /  \\
      1    8</code></pre>
<ul>
<li>Same array, two methods, two different heaps: top-down gave [15, 12, 10, 11, 2, 6, 3, 1, 8], bottom-up gives [15, 12, 6, 11, 10, 2, 3, 1, 8]. Both satisfy the heap property.</li>
<li><strong>Why bottom-up is O(n):</strong> half of the nodes are leaves and never move; a quarter can sink one level, an eighth two levels… The total n/4·1 + n/8·2 + n/16·3 + … stays below n.</li>
<li><strong>Why top-down is O(n log n):</strong> in the worst case each of the n/2 nodes of the bottom level climbs about log₂n levels. On 1..15 the program of slide 27 counts 34 moves top-down against 11 bottom-up.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> most nodes live near the bottom — bottom-up lets them move a little, top-down can make them travel far.</p>
<div class="pitfall">"The heap built from array X" has two different answers depending on the method. Read which method, or which code, the question uses before tracing.</div>`,
        `<p class="y-chinh">🎯 Bước cuối đẩy 2 từ gốc xuống, qua 15 rồi 6, cho heap (đống) [15, 12, 6, 11, 10, 2, 3, 1, 8] — với ít lần dời hơn cách từ trên xuống (top-down).</p>
<p class="ghi-chu">Hình cuối của loạt bottom-up; bước sau cùng của lần chạy ở slide 24 được lần theo dưới đây.</p>
<table>
<thead><tr><th>i</th><th>a[i]</th><th>Các con (chỉ số: giá trị)</th><th>Chuyện xảy ra</th><th>Mảng sau đó</th></tr></thead>
<tbody>
<tr><td>0</td><td>2</td><td>1: 12, 2: 15, rồi 5: 6, 6: 3</td><td>15 dời lên, rồi 6 dời lên; 2 chìm xuống chỉ số 5</td><td>[15, 12, 6, 11, 10, 2, 3, 1, 8]</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">heap dựng theo kiểu bottom-up
                15
             /      \\
           12         6
          /  \\       /  \\
        11    10    2    3
       /  \\
      1    8</code></pre>
<ul>
<li>Cùng một mảng, hai phương pháp, hai heap khác nhau: top-down cho [15, 12, 10, 11, 2, 6, 3, 1, 8], bottom-up (từ dưới lên) cho [15, 12, 6, 11, 10, 2, 3, 1, 8]. Cả hai đều thoả tính chất heap.</li>
<li><strong>Vì sao bottom-up là O(n):</strong> một nửa số nút là lá, không bao giờ dời; một phần tư chỉ có thể chìm một mức, một phần tám hai mức… Tổng n/4·1 + n/8·2 + n/16·3 + … luôn nhỏ hơn n.</li>
<li><strong>Vì sao top-down là O(n log n):</strong> trong trường hợp xấu nhất, mỗi nút trong số n/2 nút ở mức đáy phải leo khoảng log₂n mức. Trên dãy 1..15, chương trình ở slide 27 đếm được 34 lần dời với top-down, so với 11 lần với bottom-up.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> phần lớn các nút sống ở gần đáy — bottom-up chỉ bắt chúng dời một chút, top-down có thể bắt chúng đi rất xa.</p>
<div class="pitfall">"Heap dựng từ mảng X" có hai đáp án khác nhau tuỳ phương pháp. Đọc kỹ đề dùng phương pháp nào, hoặc đoạn code nào, trước khi lần theo.</div>`],
      [27, 'Organizing Arrays as Heaps - 7: transform the array to a heap',
        `<p class="y-chinh">🎯 The slide's code is the top-down method in a few lines: for each i from 1, keep x = a[i] aside, shift the fathers down while x is larger, then drop x into the empty cell.</p>
<ul>
<li><code>s</code> is the current cell of x (a son) and <code>(s-1)/2</code> its father; <code>s&gt;0</code> is tested first, so the loop stops at the root and never uses <code>(s-1)/2</code> with s = 0.</li>
<li>No swaps: each father moves down once (<code>a[s]=a[(s-1)/2]</code>), and x is written once, at the end (<code>a[s]=x</code>).</li>
<li><code>f</code> is declared here but used only on slide 28 — the two slides are one method, and the last <code>}</code> closes it.</li>
</ul>
<p>The program runs the slide's loop unchanged — only <code>moves++</code> is added, to count shifted elements — next to the bottom-up method of slides 24–26, on three inputs:</p>
<pre><code class="language-java">import java.util.Arrays;

public class HeapBuildCost {
    static int moves;                                // how many elements were shifted

    static void makeHeap(int[] a, int n) {           // slide 27, unchanged except the counter
        //Transform the array to HEAP
        int i,s,f;int x;
        for(i=1;i&lt;n;i++)
        { x=a[i]; s=i; // s  is a son, f=(s-1)/2 is father
          while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])
          { a[s]=a[(s-1)/2];   s=(s-1)/2;  moves++; };   // added: moves++
          a[s]=x;
        }
    }

    static void bottomUp(int[] a, int n) {           // slides 24-26: sift every internal node down
        for (int i = n / 2 - 1; i &gt;= 0; i--) {
            int f = i, x = a[f], s = 2 * f + 1;
            if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
            while (s &lt; n &amp;&amp; x &lt; a[s]) {
                a[f] = a[s]; f = s; s = 2 * f + 1; moves++;
                if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
            }
            a[f] = x;
        }
    }

    static void run(String name, int[] data) {
        int[] a = data.clone(), b = data.clone();
        moves = 0; makeHeap(a, a.length); int top = moves;
        moves = 0; bottomUp(b, b.length);
        System.out.printf("%-18s%-11s%-7d%s%n", name, "top-down", top, Arrays.toString(a));
        System.out.printf("%-18s%-11s%-7d%s%n", "", "bottom-up", moves, Arrays.toString(b));
    }

    public static void main(String[] args) {
        int[] up = new int[15], down = new int[15];
        for (int k = 0; k &lt; 15; k++) { up[k] = k + 1; down[k] = 15 - k; }
        System.out.println("input             method     moves  resulting heap");
        run("slide 24 array", new int[] {2, 8, 6, 1, 10, 15, 3, 12, 11});
        run("1..15 ascending", up);
        run("15..1 descending", down);
    }
}</code></pre>
<div class="out">input &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;method &nbsp;&nbsp;&nbsp;&nbsp;moves &nbsp;resulting heap<br>
slide 24 array &nbsp;&nbsp;&nbsp;top-down &nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 12, 10, 11, 2, 6, 3, 1, 8]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bottom-up &nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 12, 6, 11, 10, 2, 3, 1, 8]<br>
1..15 ascending &nbsp;&nbsp;top-down &nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;[15, 10, 14, 7, 9, 11, 13, 1, 4, 3, 8, 2, 6, 5, 12]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bottom-up &nbsp;11 &nbsp;&nbsp;&nbsp;&nbsp;[15, 11, 14, 9, 10, 13, 7, 8, 4, 2, 5, 12, 6, 3, 1]<br>
15..1 descending &nbsp;top-down &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bottom-up &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]</div>
<ul>
<li>Slide 24's array: 8 moves top-down, 6 bottom-up; both results are heaps, different ones.</li>
<li>1..15 ascending is the worst case for top-down: every new element is the largest so far and climbs to the root, 1+1+2+2+2+2+3+3+3+3+3+3+3+3 = 34 moves. Bottom-up needs 11.</li>
<li>An array that is already a heap (15..1): no move at all for either method — top-down's best case is O(n).</li>
</ul>
<div class="pitfall">Compare with x, not with a[s]. After the first <code>a[s]=a[(s-1)/2]</code>, a[s] holds the father's old value, so a condition like <code>a[s]&gt;a[(s-1)/2]</code> stops the climb too early. Mixing the swap style and this "empty cell" style is a classic PE bug.</div>`,
        `<p class="y-chinh">🎯 Code của slide là phương pháp từ trên xuống (top-down) gói trong vài dòng: với mỗi i từ 1, cất x = a[i] sang một bên, dời các cha xuống chừng nào x còn lớn hơn, rồi thả x vào ô trống.</p>
<ul>
<li><code>s</code> là ô hiện tại của x (vai trò con — son) và <code>(s-1)/2</code> là cha của nó; <code>s&gt;0</code> được kiểm trước, nên vòng lặp dừng ở gốc và không bao giờ dùng <code>(s-1)/2</code> khi s = 0.</li>
<li>Không đổi chỗ (swap): mỗi cha chỉ dời xuống một lần (<code>a[s]=a[(s-1)/2]</code>), và x chỉ được ghi một lần, ở cuối (<code>a[s]=x</code>).</li>
<li><code>f</code> được khai báo ở đây nhưng chỉ dùng ở slide 28 — hai slide là một phương thức, và dấu <code>}</code> cuối cùng đóng phương thức đó.</li>
</ul>
<p>Chương trình chạy nguyên văn vòng lặp của slide — chỉ thêm <code>moves++</code> để đếm số lần dời phần tử — cạnh phương pháp từ dưới lên (bottom-up) của slide 24–26, trên ba dữ liệu vào:</p>
<pre><code class="language-java">import java.util.Arrays;

public class HeapBuildCost {
    static int moves;                                // số lần dời một phần tử

    static void makeHeap(int[] a, int n) {           // slide 27, giữ nguyên trừ bộ đếm
        //Transform the array to HEAP
        int i,s,f;int x;
        for(i=1;i&lt;n;i++)
        { x=a[i]; s=i; // s là con, f=(s-1)/2 là cha
          while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])
          { a[s]=a[(s-1)/2];   s=(s-1)/2;  moves++; };   // thêm: moves++
          a[s]=x;
        }
    }

    static void bottomUp(int[] a, int n) {           // slide 24-26: đẩy xuống từng nút trong
        for (int i = n / 2 - 1; i &gt;= 0; i--) {
            int f = i, x = a[f], s = 2 * f + 1;
            if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
            while (s &lt; n &amp;&amp; x &lt; a[s]) {
                a[f] = a[s]; f = s; s = 2 * f + 1; moves++;
                if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
            }
            a[f] = x;
        }
    }

    static void run(String name, int[] data) {
        int[] a = data.clone(), b = data.clone();
        moves = 0; makeHeap(a, a.length); int top = moves;
        moves = 0; bottomUp(b, b.length);
        System.out.printf("%-18s%-11s%-7d%s%n", name, "top-down", top, Arrays.toString(a));
        System.out.printf("%-18s%-11s%-7d%s%n", "", "bottom-up", moves, Arrays.toString(b));
    }

    public static void main(String[] args) {
        int[] up = new int[15], down = new int[15];
        for (int k = 0; k &lt; 15; k++) { up[k] = k + 1; down[k] = 15 - k; }
        System.out.println("input             method     moves  resulting heap");
        run("slide 24 array", new int[] {2, 8, 6, 1, 10, 15, 3, 12, 11});
        run("1..15 ascending", up);
        run("15..1 descending", down);
    }
}</code></pre>
<div class="out">input &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;method &nbsp;&nbsp;&nbsp;&nbsp;moves &nbsp;resulting heap<br>
slide 24 array &nbsp;&nbsp;&nbsp;top-down &nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 12, 10, 11, 2, 6, 3, 1, 8]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bottom-up &nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 12, 6, 11, 10, 2, 3, 1, 8]<br>
1..15 ascending &nbsp;&nbsp;top-down &nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;[15, 10, 14, 7, 9, 11, 13, 1, 4, 3, 8, 2, 6, 5, 12]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bottom-up &nbsp;11 &nbsp;&nbsp;&nbsp;&nbsp;[15, 11, 14, 9, 10, 13, 7, 8, 4, 2, 5, 12, 6, 3, 1]<br>
15..1 descending &nbsp;top-down &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bottom-up &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]</div>
<ul>
<li>Mảng của slide 24: top-down dời 8 lần, bottom-up 6 lần; cả hai kết quả đều là heap (đống), nhưng khác nhau.</li>
<li>Dãy tăng dần 1..15 là trường hợp xấu nhất của top-down: phần tử mới nào cũng lớn nhất từ trước tới giờ nên leo tận gốc, 1+1+2+2+2+2+3+3+3+3+3+3+3+3 = 34 lần dời. Bottom-up chỉ cần 11.</li>
<li>Mảng vốn đã là heap (15..1): cả hai phương pháp không dời lần nào — trường hợp tốt nhất của top-down là O(n).</li>
</ul>
<div class="pitfall">Phải so sánh với x, không phải với a[s]. Sau lệnh <code>a[s]=a[(s-1)/2]</code> đầu tiên, a[s] đang giữ giá trị cũ của cha, nên điều kiện kiểu <code>a[s]&gt;a[(s-1)/2]</code> làm việc leo lên dừng quá sớm. Trộn kiểu đổi chỗ (swap) với kiểu "ô trống" này là lỗi PE (thi thực hành) kinh điển.</div>`],
      [28, 'Organizing Arrays as Heaps - 8: transform the heap to a sorted array',
        `<p class="y-chinh">🎯 The sorting phase of heap sort: n − 1 times, move the root (the maximum) to the end of the heap area, and sift the displaced last element down in the smaller heap.</p>
<ol>
<li><code>x=a[i];a[i]=a[0];</code> — the maximum goes to position i, its final place; x, the old a[i], must be put back into the heap.</li>
<li>The empty cell starts at f = 0; <code>s</code> is the larger son, but only among the indexes below i (<code>s+1&lt;i</code>, <code>s&lt;i</code>): the sorted tail no longer belongs to the heap.</li>
<li>While x is smaller than that son, move the son up and go down; finally <code>a[f]=x</code>.</li>
</ol>
<p>The program is the code of slides 27 and 28 together, unchanged, plus two lines that print; so it starts from the heap of slide 23:</p>
<pre><code class="language-java">import java.util.Arrays;

public class HeapSortFU {
    static String show(int[] a, int i) {             // a[0..i-1] is the heap, a[i..] is already sorted
        StringBuilder s = new StringBuilder("[");
        for (int k = 0; k &lt; a.length; k++) s.append(k == 0 ? "" : k == i ? " | " : ", ").append(a[k]);
        return s.append("]").toString();
    }

    static void heapSort(int[] a, int n) {           // the code of slides 27 and 28, unchanged
        //Transform the array to HEAP
        int i,s,f;int x;
        for(i=1;i&lt;n;i++)
        { x=a[i]; s=i; // s  is a son, f=(s-1)/2 is father
          while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])
          { a[s]=a[(s-1)/2];   s=(s-1)/2;  };
          a[s]=x;
        }
        System.out.println("heap          " + Arrays.toString(a));    // added: print
        // Transform heap to sorted array
        for(i=n-1;i&gt;0;i--)
        { x=a[i];a[i]=a[0];
          f=0; // f is father
          s=2*f+1; // s is a left son
          // if the right son is larger then it is selected
          if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;
          while(s&lt;i &amp;&amp; x&lt;a[s])
          { a[f]=a[s]; f=s; s=2*f+1;
            if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;
          };
          a[f]=x;
          System.out.printf("i=%d: %-2d out  %s%n", i, a[i], show(a, i));   // added: print
        };
    }

    public static void main(String[] args) {
        int[] a = {2, 8, 6, 1, 10, 15, 3, 12, 11};
        heapSort(a, a.length);
        System.out.println("sorted        " + Arrays.toString(a));
    }
}</code></pre>
<div class="out">heap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 12, 10, 11, 2, 6, 3, 1, 8]<br>
i=8: 15 out &nbsp;[12, 11, 10, 8, 2, 6, 3, 1 | 15]<br>
i=7: 12 out &nbsp;[11, 8, 10, 1, 2, 6, 3 | 12, 15]<br>
i=6: 11 out &nbsp;[10, 8, 6, 1, 2, 3 | 11, 12, 15]<br>
i=5: 10 out &nbsp;[8, 3, 6, 1, 2 | 10, 11, 12, 15]<br>
i=4: 8 &nbsp;out &nbsp;[6, 3, 2, 1 | 8, 10, 11, 12, 15]<br>
i=3: 6 &nbsp;out &nbsp;[3, 1, 2 | 6, 8, 10, 11, 12, 15]<br>
i=2: 3 &nbsp;out &nbsp;[2, 1 | 3, 6, 8, 10, 11, 12, 15]<br>
i=1: 2 &nbsp;out &nbsp;[1 | 2, 3, 6, 8, 10, 11, 12, 15]<br>
sorted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 2, 3, 6, 8, 10, 11, 12, 15]</div>
<p class="nhan">The first three passes (left of "|" is the heap, right of it the sorted part)</p>
<table>
<thead><tr><th>i</th><th>x = a[i]</th><th>Max moved to a[i]</th><th>Sift-down of x from the root</th><th>Heap part after</th></tr></thead>
<tbody>
<tr><td>8</td><td>8</td><td>15</td><td>12 up, 11 up, stop: son 1 is smaller</td><td>[12, 11, 10, 8, 2, 6, 3, 1]</td></tr>
<tr><td>7</td><td>1</td><td>12</td><td>11 up, 8 up, stop: index 7 is outside the heap</td><td>[11, 8, 10, 1, 2, 6, 3]</td></tr>
<tr><td>6</td><td>3</td><td>11</td><td>10 up, 6 up, stop: index 11 is outside</td><td>[10, 8, 6, 1, 2, 3]</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> building O(n log n) with this top-down code (O(n) bottom-up) + n − 1 sift-downs of O(log n) each = O(n log n) in every case. Extra memory O(1): everything happens inside the array (in place). Heap sort is not stable.</p>
<div class="pitfall">The bounds are <code>s&lt;i</code> and <code>s+1&lt;i</code>, not <code>s&lt;n</code>: the cells from i onwards are already sorted. With n, the sift-down would pull large values back out of the sorted tail and scramble the result.</div>`,
        `<p class="y-chinh">🎯 Pha sắp xếp của heap sort (sắp xếp vun đống): n − 1 lần, đưa gốc (phần tử lớn nhất) về cuối vùng heap, rồi đẩy xuống (sift down) phần tử cuối bị thay chỗ trong heap (đống) đã thu nhỏ.</p>
<ol>
<li><code>x=a[i];a[i]=a[0];</code> — phần tử lớn nhất về vị trí i, chỗ cuối cùng của nó; x, tức a[i] cũ, phải được đặt lại vào heap.</li>
<li>Ô trống bắt đầu ở f = 0; <code>s</code> là con lớn hơn, nhưng chỉ xét các chỉ số nhỏ hơn i (<code>s+1&lt;i</code>, <code>s&lt;i</code>): phần đuôi đã sắp không còn thuộc heap.</li>
<li>Chừng nào x còn nhỏ hơn người con đó, dời con lên rồi đi xuống; cuối cùng <code>a[f]=x</code>.</li>
</ol>
<p>Chương trình là code của slide 27 và 28 ghép lại, giữ nguyên, chỉ thêm hai dòng in; vì vậy nó xuất phát từ đúng heap của slide 23:</p>
<pre><code class="language-java">import java.util.Arrays;

public class HeapSortFU {
    static String show(int[] a, int i) {             // a[0..i-1] là heap, a[i..] đã xếp xong
        StringBuilder s = new StringBuilder("[");
        for (int k = 0; k &lt; a.length; k++) s.append(k == 0 ? "" : k == i ? " | " : ", ").append(a[k]);
        return s.append("]").toString();
    }

    static void heapSort(int[] a, int n) {           // code của slide 27 và 28, giữ nguyên
        //Transform the array to HEAP
        int i,s,f;int x;
        for(i=1;i&lt;n;i++)
        { x=a[i]; s=i; // s là con, f=(s-1)/2 là cha
          while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])
          { a[s]=a[(s-1)/2];   s=(s-1)/2;  };
          a[s]=x;
        }
        System.out.println("heap          " + Arrays.toString(a));    // thêm: in ra
        // Transform heap to sorted array
        for(i=n-1;i&gt;0;i--)
        { x=a[i];a[i]=a[0];
          f=0; // f là cha
          s=2*f+1; // s là con trái
          // nếu con phải lớn hơn thì chọn con phải
          if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;
          while(s&lt;i &amp;&amp; x&lt;a[s])
          { a[f]=a[s]; f=s; s=2*f+1;
            if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;
          };
          a[f]=x;
          System.out.printf("i=%d: %-2d out  %s%n", i, a[i], show(a, i));   // thêm: in ra
        };
    }

    public static void main(String[] args) {
        int[] a = {2, 8, 6, 1, 10, 15, 3, 12, 11};
        heapSort(a, a.length);
        System.out.println("sorted        " + Arrays.toString(a));
    }
}</code></pre>
<div class="out">heap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[15, 12, 10, 11, 2, 6, 3, 1, 8]<br>
i=8: 15 out &nbsp;[12, 11, 10, 8, 2, 6, 3, 1 | 15]<br>
i=7: 12 out &nbsp;[11, 8, 10, 1, 2, 6, 3 | 12, 15]<br>
i=6: 11 out &nbsp;[10, 8, 6, 1, 2, 3 | 11, 12, 15]<br>
i=5: 10 out &nbsp;[8, 3, 6, 1, 2 | 10, 11, 12, 15]<br>
i=4: 8 &nbsp;out &nbsp;[6, 3, 2, 1 | 8, 10, 11, 12, 15]<br>
i=3: 6 &nbsp;out &nbsp;[3, 1, 2 | 6, 8, 10, 11, 12, 15]<br>
i=2: 3 &nbsp;out &nbsp;[2, 1 | 3, 6, 8, 10, 11, 12, 15]<br>
i=1: 2 &nbsp;out &nbsp;[1 | 2, 3, 6, 8, 10, 11, 12, 15]<br>
sorted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 2, 3, 6, 8, 10, 11, 12, 15]</div>
<p class="nhan">Ba lượt đầu (bên trái "|" là heap, bên phải là phần đã sắp)</p>
<table>
<thead><tr><th>i</th><th>x = a[i]</th><th>Phần tử lớn nhất về a[i]</th><th>x được đẩy xuống từ gốc</th><th>Phần heap sau lượt</th></tr></thead>
<tbody>
<tr><td>8</td><td>8</td><td>15</td><td>12 lên, 11 lên, dừng: con 1 nhỏ hơn</td><td>[12, 11, 10, 8, 2, 6, 3, 1]</td></tr>
<tr><td>7</td><td>1</td><td>12</td><td>11 lên, 8 lên, dừng: chỉ số 7 nằm ngoài heap</td><td>[11, 8, 10, 1, 2, 6, 3]</td></tr>
<tr><td>6</td><td>3</td><td>11</td><td>10 lên, 6 lên, dừng: chỉ số 11 nằm ngoài</td><td>[10, 8, 6, 1, 2, 3]</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> dựng heap O(n log n) với code từ trên xuống (top-down) này (O(n) nếu dựng từ dưới lên — bottom-up) + n − 1 lần đẩy xuống, mỗi lần O(log n) = O(n log n) trong mọi trường hợp. Bộ nhớ phụ O(1): mọi việc diễn ra ngay trong mảng (tại chỗ — in place). Heap sort không ổn định (not stable).</p>
<div class="pitfall">Cận là <code>s&lt;i</code> và <code>s+1&lt;i</code>, không phải <code>s&lt;n</code>: các ô từ i trở đi đã sắp xong. Dùng n thì phép đẩy xuống sẽ kéo các giá trị lớn từ phần đuôi đã sắp quay lại và làm rối kết quả.</div>`],
      [29, 'Polish Notation and Expression Trees - 1',
        `<p class="y-chinh">🎯 Polish notation writes each operator before its operands — (5 − 6) * 7 becomes * − 5 6 7 — so parentheses are never needed.</p>
<ul>
<li><strong>Prefix</strong> (Polish, the slide's example): <code>* - 5 6 7</code>. <strong>Postfix</strong> (reverse Polish): <code>5 6 - 7 *</code>. <strong>Infix</strong> (the usual form): <code>(5 - 6) * 7</code>. All three are worth −7.</li>
<li>It was invented in the 1920s by the logician Jan Łukasiewicz for propositional logic — hence "Polish".</li>
<li>No parentheses and no precedence rules: the position of each operator already says what it applies to. That is the slide's "the compiler rejects everything that is not essential".</li>
<li>Evaluation is a single pass with a stack: postfix is read left to right, prefix right to left.</li>
</ul>
<pre><code class="language-java">import java.util.Stack;

public class PolishEval {
    static boolean isOp(String t) { return t.length() == 1 &amp;&amp; "+-*/".indexOf(t.charAt(0)) &gt;= 0; }

    static int apply(String op, int a, int b) {      // a op b
        switch (op.charAt(0)) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            default:  return a / b;
        }
    }

    static int postfix(String e) {                   // reverse Polish: read LEFT to right
        Stack&lt;Integer&gt; st = new Stack&lt;Integer&gt;();
        System.out.println("postfix  " + e + "   (read left to right)");
        for (String t : e.split(" ")) {
            String did = "push";
            if (isOp(t)) {
                int b = st.pop(), a = st.pop();      // first pop = RIGHT operand
                st.push(apply(t, a, b));
                did = a + " " + t + " " + b + " = " + st.peek();
            } else st.push(Integer.parseInt(t));
            System.out.printf("  %-3s %-14s stack %s%n", t, did, st);
        }
        return st.pop();
    }

    static int prefix(String e) {                    // Polish: read RIGHT to left
        Stack&lt;Integer&gt; st = new Stack&lt;Integer&gt;();
        System.out.println("prefix   " + e + "   (read right to left)");
        String[] tk = e.split(" ");
        for (int i = tk.length - 1; i &gt;= 0; i--) {
            String t = tk[i], did = "push";
            if (isOp(t)) {
                int a = st.pop(), b = st.pop();      // first pop = LEFT operand
                st.push(apply(t, a, b));
                did = a + " " + t + " " + b + " = " + st.peek();
            } else st.push(Integer.parseInt(t));
            System.out.printf("  %-3s %-14s stack %s%n", t, did, st);
        }
        return st.pop();
    }

    public static void main(String[] args) {
        int v1 = postfix("5 6 - 7 *");
        int v2 = prefix("* - 5 6 7");
        System.out.println("values: " + v1 + " and " + v2 + ";  infix (5 - 6) * 7 = " + (5 - 6) * 7);
    }
}</code></pre>
<div class="out">postfix &nbsp;5 6 - 7 * &nbsp;&nbsp;(read left to right)<br>
&nbsp;&nbsp;5 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [5]<br>
&nbsp;&nbsp;6 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [5, 6]<br>
&nbsp;&nbsp;- &nbsp;&nbsp;5 - 6 = -1 &nbsp;&nbsp;&nbsp;&nbsp;stack [-1]<br>
&nbsp;&nbsp;7 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [-1, 7]<br>
&nbsp;&nbsp;* &nbsp;&nbsp;-1 * 7 = -7 &nbsp;&nbsp;&nbsp;stack [-7]<br>
prefix &nbsp;&nbsp;* - 5 6 7 &nbsp;&nbsp;(read right to left)<br>
&nbsp;&nbsp;7 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [7]<br>
&nbsp;&nbsp;6 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [7, 6]<br>
&nbsp;&nbsp;5 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [7, 6, 5]<br>
&nbsp;&nbsp;- &nbsp;&nbsp;5 - 6 = -1 &nbsp;&nbsp;&nbsp;&nbsp;stack [7, -1]<br>
&nbsp;&nbsp;* &nbsp;&nbsp;-1 * 7 = -7 &nbsp;&nbsp;&nbsp;stack [-7]<br>
values: -7 and -7; &nbsp;infix (5 - 6) * 7 = -7</div>
<p><strong>Big-O:</strong> every token is pushed once and popped at most once → O(n) for n tokens.</p>
<p class="meo">🧠 <strong>Remember:</strong> postfix is how a stack machine computes — the JVM's bytecode, for example: push the operands, and each operator pops two values and pushes one.</p>
<div class="pitfall">The order of the two pops is opposite in the two notations. Postfix: the first pop is the <em>right</em> operand (<code>b = pop(); a = pop(); a - b</code>). Prefix read backwards: the first pop is the <em>left</em> operand. Swap them and 5 − 6 turns into 6 − 5 = 1 — FE questions love this with − and /.</div>`,
        `<p class="y-chinh">🎯 Ký pháp Ba Lan (Polish notation) viết mỗi toán tử (operator) trước các toán hạng (operand) của nó — (5 − 6) * 7 thành * − 5 6 7 — nên không bao giờ cần dấu ngoặc.</p>
<ul>
<li><strong>Tiền tố (prefix)</strong> — ký pháp Ba Lan, ví dụ của slide: <code>* - 5 6 7</code>. <strong>Hậu tố (postfix)</strong> — Ba Lan ngược (reverse Polish): <code>5 6 - 7 *</code>. <strong>Trung tố (infix)</strong> — cách viết thường ngày: <code>(5 - 6) * 7</code>. Cả ba đều bằng −7.</li>
<li>Do nhà logic học Jan Łukasiewicz nghĩ ra vào những năm 1920 cho logic mệnh đề (propositional logic) — vì thế mới gọi là "Ba Lan".</li>
<li>Không ngoặc, không luật ưu tiên toán tử: vị trí của mỗi toán tử đã cho biết nó áp dụng lên cái gì. Đó là ý câu trên slide "trình biên dịch (compiler) bỏ đi mọi thứ không thiết yếu".</li>
<li>Tính giá trị chỉ cần một lượt đọc với một ngăn xếp (stack): hậu tố đọc từ trái sang phải, tiền tố đọc từ phải sang trái.</li>
</ul>
<pre><code class="language-java">import java.util.Stack;

public class PolishEval {
    static boolean isOp(String t) { return t.length() == 1 &amp;&amp; "+-*/".indexOf(t.charAt(0)) &gt;= 0; }

    static int apply(String op, int a, int b) {      // a op b
        switch (op.charAt(0)) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            default:  return a / b;
        }
    }

    static int postfix(String e) {                   // Ba Lan ngược: đọc từ TRÁI sang phải
        Stack&lt;Integer&gt; st = new Stack&lt;Integer&gt;();
        System.out.println("postfix  " + e + "   (read left to right)");
        for (String t : e.split(" ")) {
            String did = "push";
            if (isOp(t)) {
                int b = st.pop(), a = st.pop();      // lần pop đầu = toán hạng PHẢI
                st.push(apply(t, a, b));
                did = a + " " + t + " " + b + " = " + st.peek();
            } else st.push(Integer.parseInt(t));
            System.out.printf("  %-3s %-14s stack %s%n", t, did, st);
        }
        return st.pop();
    }

    static int prefix(String e) {                    // Ba Lan: đọc từ PHẢI sang trái
        Stack&lt;Integer&gt; st = new Stack&lt;Integer&gt;();
        System.out.println("prefix   " + e + "   (read right to left)");
        String[] tk = e.split(" ");
        for (int i = tk.length - 1; i &gt;= 0; i--) {
            String t = tk[i], did = "push";
            if (isOp(t)) {
                int a = st.pop(), b = st.pop();      // lần pop đầu = toán hạng TRÁI
                st.push(apply(t, a, b));
                did = a + " " + t + " " + b + " = " + st.peek();
            } else st.push(Integer.parseInt(t));
            System.out.printf("  %-3s %-14s stack %s%n", t, did, st);
        }
        return st.pop();
    }

    public static void main(String[] args) {
        int v1 = postfix("5 6 - 7 *");
        int v2 = prefix("* - 5 6 7");
        System.out.println("values: " + v1 + " and " + v2 + ";  infix (5 - 6) * 7 = " + (5 - 6) * 7);
    }
}</code></pre>
<div class="out">postfix &nbsp;5 6 - 7 * &nbsp;&nbsp;(read left to right)<br>
&nbsp;&nbsp;5 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [5]<br>
&nbsp;&nbsp;6 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [5, 6]<br>
&nbsp;&nbsp;- &nbsp;&nbsp;5 - 6 = -1 &nbsp;&nbsp;&nbsp;&nbsp;stack [-1]<br>
&nbsp;&nbsp;7 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [-1, 7]<br>
&nbsp;&nbsp;* &nbsp;&nbsp;-1 * 7 = -7 &nbsp;&nbsp;&nbsp;stack [-7]<br>
prefix &nbsp;&nbsp;* - 5 6 7 &nbsp;&nbsp;(read right to left)<br>
&nbsp;&nbsp;7 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [7]<br>
&nbsp;&nbsp;6 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [7, 6]<br>
&nbsp;&nbsp;5 &nbsp;&nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack [7, 6, 5]<br>
&nbsp;&nbsp;- &nbsp;&nbsp;5 - 6 = -1 &nbsp;&nbsp;&nbsp;&nbsp;stack [7, -1]<br>
&nbsp;&nbsp;* &nbsp;&nbsp;-1 * 7 = -7 &nbsp;&nbsp;&nbsp;stack [-7]<br>
values: -7 and -7; &nbsp;infix (5 - 6) * 7 = -7</div>
<p><strong>Big-O:</strong> mỗi ký hiệu (token) được đẩy vào ngăn xếp (push) một lần và lấy ra (pop) nhiều nhất một lần → O(n) với n ký hiệu.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> hậu tố là cách một máy ngăn xếp (stack machine) tính toán — mã bytecode (mã máy ảo) của JVM chẳng hạn: đẩy các toán hạng vào, mỗi toán tử lấy ra hai giá trị rồi đẩy vào một.</p>
<div class="pitfall">Thứ tự hai lần lấy ra (pop) ngược nhau giữa hai ký pháp. Hậu tố: lần pop đầu là toán hạng <em>phải</em> (<code>b = pop(); a = pop(); a - b</code>). Tiền tố đọc ngược: lần pop đầu là toán hạng <em>trái</em>. Đảo nhầm thì 5 − 6 thành 6 − 5 = 1 — đề FE (thi cuối kỳ) rất thích bẫy này với − và /.</div>`],
      [30, 'Polish Notation and Expression Trees - 2',
        `<p class="y-chinh">🎯 In an expression tree the three traversals of part 1 read the expression in the three notations: preorder = prefix, inorder = infix, postorder = postfix.</p>
<p class="ghi-chu">The slide shows three expression trees and the results of their traversals as a figure; the lesson uses three expression trees of its own, below.</p>
<pre><code class="language-java">import java.util.Stack;

class Node {
    String info;                                     // an operator or a number
    Node left, right;

    Node(String x, Node p, Node q) { info = x; left = p; right = q; }
}

public class ExprTraversals {
    static boolean isOp(String t) { return t.length() == 1 &amp;&amp; "+-*/".indexOf(t.charAt(0)) &gt;= 0; }

    static Node build(String postfix) {              // a number becomes a leaf; an operator takes the two last subtrees
        Stack&lt;Node&gt; st = new Stack&lt;Node&gt;();
        for (String t : postfix.split(" ")) {
            if (isOp(t)) { Node r = st.pop(), l = st.pop(); st.push(new Node(t, l, r)); }
            else st.push(new Node(t, null, null));
        }
        return st.pop();
    }

    static String pre(Node p)  { return p == null ? "" : p.info + " " + pre(p.left) + pre(p.right); }    // NLR
    static String in(Node p)   { return p == null ? "" : in(p.left) + p.info + " " + in(p.right); }      // LNR
    static String post(Node p) { return p == null ? "" : post(p.left) + post(p.right) + p.info + " "; }  // LRN

    static String brackets(Node p) {                 // in-order, but every operator gets its own ( )
        if (p.left == null) return p.info;
        return "(" + brackets(p.left) + " " + p.info + " " + brackets(p.right) + ")";
    }

    static int eval(Node p) {                        // postorder: both operands first
        if (p.left == null) return Integer.parseInt(p.info);
        int a = eval(p.left), b = eval(p.right);
        switch (p.info.charAt(0)) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            default:  return a / b;
        }
    }

    public static void main(String[] args) {
        String[] exprs = {"5 6 - 7 *", "5 6 7 * -", "8 4 2 - * 1 +"};
        for (int k = 0; k &lt; exprs.length; k++) {
            Node t = build(exprs[k]);
            System.out.println("tree " + (k + 1) + "  value " + eval(t));
            System.out.println("   preorder  (prefix):  " + pre(t));
            System.out.println("   inorder   (infix):   " + in(t) + "  with brackets: " + brackets(t));
            System.out.println("   postorder (postfix): " + post(t));
        }
    }
}</code></pre>
<div class="out">tree 1 &nbsp;value -7<br>
&nbsp;&nbsp;&nbsp;preorder &nbsp;(prefix): &nbsp;* - 5 6 7<br>
&nbsp;&nbsp;&nbsp;inorder &nbsp;&nbsp;(infix): &nbsp;&nbsp;5 - 6 * 7 &nbsp;&nbsp;with brackets: ((5 - 6) * 7)<br>
&nbsp;&nbsp;&nbsp;postorder (postfix): 5 6 - 7 *<br>
tree 2 &nbsp;value -37<br>
&nbsp;&nbsp;&nbsp;preorder &nbsp;(prefix): &nbsp;- 5 * 6 7<br>
&nbsp;&nbsp;&nbsp;inorder &nbsp;&nbsp;(infix): &nbsp;&nbsp;5 - 6 * 7 &nbsp;&nbsp;with brackets: (5 - (6 * 7))<br>
&nbsp;&nbsp;&nbsp;postorder (postfix): 5 6 7 * -<br>
tree 3 &nbsp;value 17<br>
&nbsp;&nbsp;&nbsp;preorder &nbsp;(prefix): &nbsp;+ * 8 - 4 2 1<br>
&nbsp;&nbsp;&nbsp;inorder &nbsp;&nbsp;(infix): &nbsp;&nbsp;8 * 4 - 2 + 1 &nbsp;&nbsp;with brackets: ((8 * (4 - 2)) + 1)<br>
&nbsp;&nbsp;&nbsp;postorder (postfix): 8 4 2 - * 1 +</div>
<pre><code class="language-plaintext">tree 1: (5 - 6) * 7        tree 2: 5 - 6 * 7
        *                          -
       / \\                        / \\
      -   7                      5   *
     / \\                            / \\
    5   6                          6   7

tree 3: 8 * (4 - 2) + 1
          +
         / \\
        *   1
       / \\
      8   -
         / \\
        4   2</code></pre>
<ul>
<li>Leaves are operands, internal nodes are operators; the two subtrees of an operator are its two operands.</li>
<li>Trees 1 and 2 give the <em>same</em> inorder text <code>5 - 6 * 7</code> but different values (−7 and −37): infix needs the parentheses of the "with brackets" column, prefix and postfix never do.</li>
<li><code>build</code> reads the postfix text with a stack of trees: a number becomes a leaf; an operator pops two trees (right, then left) and becomes their parent — the stack idea of slide 29 again.</li>
<li>Evaluating the tree is a postorder traversal: both operands first, the operator last.</li>
</ul>
<p><strong>Big-O:</strong> building and every traversal visit each node once — O(n).</p>
<p class="meo">🧠 <strong>Remember:</strong> PRE-order = PRE-fix, POST-order = POST-fix, IN-order = IN-fix — the operator is written before, after, or in between.</p>`,
        `<p class="y-chinh">🎯 Trên cây biểu thức (expression tree), ba phép duyệt của phần 1 đọc biểu thức theo ba ký pháp: tiền thứ tự (preorder) = tiền tố (prefix), trung thứ tự (inorder) = trung tố (infix), hậu thứ tự (postorder) = hậu tố (postfix).</p>
<p class="ghi-chu">Slide vẽ bằng hình ba cây biểu thức cùng kết quả duyệt của chúng; bài dùng ba cây biểu thức của riêng mình (ví dụ của bài) ở dưới.</p>
<pre><code class="language-java">import java.util.Stack;

class Node {
    String info;                                     // toán tử hoặc một số
    Node left, right;

    Node(String x, Node p, Node q) { info = x; left = p; right = q; }
}

public class ExprTraversals {
    static boolean isOp(String t) { return t.length() == 1 &amp;&amp; "+-*/".indexOf(t.charAt(0)) &gt;= 0; }

    static Node build(String postfix) {              // số thành lá; toán tử nhận hai cây con gần nhất
        Stack&lt;Node&gt; st = new Stack&lt;Node&gt;();
        for (String t : postfix.split(" ")) {
            if (isOp(t)) { Node r = st.pop(), l = st.pop(); st.push(new Node(t, l, r)); }
            else st.push(new Node(t, null, null));
        }
        return st.pop();
    }

    static String pre(Node p)  { return p == null ? "" : p.info + " " + pre(p.left) + pre(p.right); }    // NLR
    static String in(Node p)   { return p == null ? "" : in(p.left) + p.info + " " + in(p.right); }      // LNR
    static String post(Node p) { return p == null ? "" : post(p.left) + post(p.right) + p.info + " "; }  // LRN

    static String brackets(Node p) {                 // trung thứ tự, mỗi toán tử có cặp ( ) riêng
        if (p.left == null) return p.info;
        return "(" + brackets(p.left) + " " + p.info + " " + brackets(p.right) + ")";
    }

    static int eval(Node p) {                        // hậu thứ tự: tính hai toán hạng trước
        if (p.left == null) return Integer.parseInt(p.info);
        int a = eval(p.left), b = eval(p.right);
        switch (p.info.charAt(0)) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            default:  return a / b;
        }
    }

    public static void main(String[] args) {
        String[] exprs = {"5 6 - 7 *", "5 6 7 * -", "8 4 2 - * 1 +"};
        for (int k = 0; k &lt; exprs.length; k++) {
            Node t = build(exprs[k]);
            System.out.println("tree " + (k + 1) + "  value " + eval(t));
            System.out.println("   preorder  (prefix):  " + pre(t));
            System.out.println("   inorder   (infix):   " + in(t) + "  with brackets: " + brackets(t));
            System.out.println("   postorder (postfix): " + post(t));
        }
    }
}</code></pre>
<div class="out">tree 1 &nbsp;value -7<br>
&nbsp;&nbsp;&nbsp;preorder &nbsp;(prefix): &nbsp;* - 5 6 7<br>
&nbsp;&nbsp;&nbsp;inorder &nbsp;&nbsp;(infix): &nbsp;&nbsp;5 - 6 * 7 &nbsp;&nbsp;with brackets: ((5 - 6) * 7)<br>
&nbsp;&nbsp;&nbsp;postorder (postfix): 5 6 - 7 *<br>
tree 2 &nbsp;value -37<br>
&nbsp;&nbsp;&nbsp;preorder &nbsp;(prefix): &nbsp;- 5 * 6 7<br>
&nbsp;&nbsp;&nbsp;inorder &nbsp;&nbsp;(infix): &nbsp;&nbsp;5 - 6 * 7 &nbsp;&nbsp;with brackets: (5 - (6 * 7))<br>
&nbsp;&nbsp;&nbsp;postorder (postfix): 5 6 7 * -<br>
tree 3 &nbsp;value 17<br>
&nbsp;&nbsp;&nbsp;preorder &nbsp;(prefix): &nbsp;+ * 8 - 4 2 1<br>
&nbsp;&nbsp;&nbsp;inorder &nbsp;&nbsp;(infix): &nbsp;&nbsp;8 * 4 - 2 + 1 &nbsp;&nbsp;with brackets: ((8 * (4 - 2)) + 1)<br>
&nbsp;&nbsp;&nbsp;postorder (postfix): 8 4 2 - * 1 +</div>
<pre><code class="language-plaintext">cây 1: (5 - 6) * 7         cây 2: 5 - 6 * 7
        *                          -
       / \\                        / \\
      -   7                      5   *
     / \\                            / \\
    5   6                          6   7

cây 3: 8 * (4 - 2) + 1
          +
         / \\
        *   1
       / \\
      8   -
         / \\
        4   2</code></pre>
<ul>
<li>Lá (leaf) là toán hạng (operand), nút trong là toán tử (operator); hai cây con của một toán tử chính là hai toán hạng của nó.</li>
<li>Cây 1 và cây 2 cho <em>cùng</em> một chuỗi trung thứ tự <code>5 - 6 * 7</code> nhưng khác giá trị (−7 và −37): trung tố cần dấu ngoặc như cột "with brackets" (có ngoặc), còn tiền tố và hậu tố thì không bao giờ cần.</li>
<li><code>build</code> đọc chuỗi hậu tố với một ngăn xếp (stack) chứa các cây: số thành một lá; toán tử lấy ra (pop) hai cây (phải trước, trái sau) rồi làm cha của chúng — lại là ý tưởng ngăn xếp của slide 29.</li>
<li>Tính giá trị cây là một phép duyệt hậu thứ tự: tính hai toán hạng trước, toán tử sau cùng.</li>
</ul>
<p><strong>Big-O:</strong> dựng cây và mỗi phép duyệt đều thăm mỗi nút một lần — O(n).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> PRE-order = PRE-fix, POST-order = POST-fix, IN-order = IN-fix — toán tử được viết trước, sau, hoặc ở giữa hai toán hạng.</p>`],
      [31, 'Summary - 1',
        `<p class="y-chinh">🎯 The first summary slide recalls the basic tree vocabulary of part 1 — everything in this deck is built on it.</p>
<table>
<thead><tr><th>Term (slide)</th><th>Meaning</th><th>Where it mattered in part 2</th></tr></thead>
<tbody>
<tr><td>Tree = nodes + arcs</td><td>a data type made of nodes joined by arcs (edges)</td><td>a rotation only changes which arcs exist</td></tr>
<tr><td>Root</td><td>the only node without a parent; it has only children</td><td>an AVL rotation or deletion can change the root (slide 14)</td></tr>
<tr><td>Path</td><td>the unique sequence of arcs from the root to a node</td><td>search and insert follow one path: cost O(height)</td></tr>
<tr><td>Orderly (ordered) tree</td><td>elements stored by a predetermined ordering criterion</td><td>BST: left &lt; node &lt; right; heap: parent ≥ children</td></tr>
<tr><td>Binary tree</td><td>two children per node, possibly empty, each marked left or right</td><td>AVL trees and heaps are both binary trees</td></tr>
</tbody>
</table>
<ul>
<li>The two ordering criteria are the key contrast of the chapter: a BST orders left against right, so it can search; a heap orders only parent against child, so it can give the maximum at once.</li>
<li>Because the path from the root is unique, "the depth of a node" is well defined — and depth is exactly what balancing keeps small.</li>
<li>Heights in this deck follow part 1: a single node has height 1, the empty tree 0. Books that count edges get one less; differences of heights, and therefore balance factors, are the same.</li>
</ul>
<p>The syllabus question "similarities and differences between binary tree, AVL tree and heap": all three are binary trees; an AVL tree is a BST that stays height-balanced (search O(log n)); a heap is nearly complete and ordered parent ≥ child (maximum in O(1), but no fast search).</p>
<p class="meo">🧠 <strong>Remember:</strong> BST = sorted from left to right, heap = sorted from top to bottom.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt đầu tiên nhắc lại bộ từ vựng cơ bản về cây của phần 1 — mọi thứ trong bộ slide này đều dựng trên đó.</p>
<table>
<thead><tr><th>Thuật ngữ (slide)</th><th>Nghĩa</th><th>Quan trọng ở đâu trong phần 2</th></tr></thead>
<tbody>
<tr><td>Cây (tree) = nút (node) + cung (arc)</td><td>kiểu dữ liệu gồm các nút nối với nhau bằng cung (cạnh — edge)</td><td>phép xoay chỉ thay đổi những cung nào tồn tại</td></tr>
<tr><td>Gốc (root)</td><td>nút duy nhất không có cha; nó chỉ có con</td><td>phép xoay hay phép xoá AVL có thể đổi gốc (slide 14)</td></tr>
<tr><td>Đường đi (path)</td><td>dãy cung duy nhất đi từ gốc tới một nút</td><td>tìm và chèn đi theo một đường: chi phí O(chiều cao)</td></tr>
<tr><td>Cây có thứ tự (orderly/ordered tree)</td><td>phần tử được lưu theo một tiêu chí thứ tự định trước</td><td>cây nhị phân tìm kiếm (BST): trái &lt; nút &lt; phải; heap (đống): cha ≥ con</td></tr>
<tr><td>Cây nhị phân (binary tree)</td><td>mỗi nút có hai con, có thể rỗng, mỗi con được gọi là trái hoặc phải</td><td>cây AVL và heap đều là cây nhị phân</td></tr>
</tbody>
</table>
<ul>
<li>Hai tiêu chí thứ tự là điểm đối lập chính của chương: cây nhị phân tìm kiếm (BST) sắp trái với phải, nên tìm kiếm được; heap (đống) chỉ sắp cha với con, nên trả ngay được phần tử lớn nhất.</li>
<li>Vì đường đi từ gốc là duy nhất, "độ sâu (depth) của một nút" mới xác định rõ ràng — và độ sâu chính là thứ mà việc cân bằng giữ cho nhỏ.</li>
<li>Chiều cao trong bộ slide này tính như phần 1: một nút đứng riêng cao 1, cây rỗng cao 0. Sách đếm theo cạnh thì được ít hơn một; hiệu hai chiều cao, và do đó hệ số cân bằng (balance factor), vẫn y như nhau.</li>
</ul>
<p>Câu hỏi của syllabus "cây nhị phân, cây AVL và heap giống và khác nhau thế nào": cả ba đều là cây nhị phân; cây AVL là BST luôn cân bằng theo chiều cao (tìm kiếm O(log n)); heap là cây gần đầy đủ (nearly complete) có thứ tự cha ≥ con (lấy phần tử lớn nhất trong O(1), nhưng không tìm kiếm nhanh được).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> BST = sắp từ trái sang phải, heap = sắp từ trên xuống dưới.</p>`],
      [32, 'Summary',
        `<p class="y-chinh">🎯 The deck in nine topics — each with its one-line takeaway and its cost.</p>
<table>
<thead><tr><th>Topic (slide)</th><th>Takeaway</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Balanced binary tree</td><td>the heights of the children differ by ≤ 1 at every node</td><td>height O(log n)</td></tr>
<tr><td>Simple balance algorithm</td><td>array + sort + rebuild middle-first</td><td>O(n log n), needs all keys</td></tr>
<tr><td>Rotations on a BST</td><td>lift a child, keep the in-order sequence</td><td>O(1)</td></tr>
<tr><td>AVL tree</td><td>a BST with bf ∈ {−1, 0, +1} at every node</td><td>search O(log n) guaranteed</td></tr>
<tr><td>Insertion in an AVL tree</td><td>first ±2 node from the bottom, at most one single or double rotation</td><td>O(log n)</td></tr>
<tr><td>Deletion in an AVL tree</td><td>may rotate at every level up to the root</td><td>O(log n)</td></tr>
<tr><td>Heaps</td><td>parent ≥ children, nearly complete, array a[0..n−1]</td><td>read the max O(1)</td></tr>
<tr><td>Heaps as priority queue</td><td>enqueue = sift up, dequeue = sift down; build bottom-up; heap sort</td><td>O(log n) per operation, build O(n), sort O(n log n)</td></tr>
<tr><td>Polish notation and expression trees</td><td>prefix and postfix need no parentheses; pre-, in-, post-order</td><td>O(n)</td></tr>
</tbody>
</table>
<ul>
<li>One picture per topic is enough to rebuild the rest: the chain (slide 4), Par and Ch (slide 7), the zig-zag (slide 9), the array under the heap (slide 16).</li>
<li>One number to remember: with a million keys, a heap has 20 levels, an AVL tree at most 28, a degenerate BST up to a million.</li>
</ul>
<p>Where the syllabus's discussion questions are answered: AVL tree, BST vs AVL, cost of an AVL search, balance factor formula — slides 4 and 10; heap, min vs max — slide 15; binary tree vs AVL vs heap — slide 31; priority queue — slide 19.</p>
<p>Two conventions to state in every written answer: the sign of the balance factor (slide 10) and the height of a single node — 1 on the slides, 0 in books that count edges.</p>
<p class="meo">🧠 <strong>Remember:</strong> search trees fight for a small height; heaps only care about the top.</p>`,
        `<p class="y-chinh">🎯 Cả bộ slide gói trong chín chủ đề — mỗi chủ đề một ý mang về và chi phí của nó.</p>
<table>
<thead><tr><th>Chủ đề (slide)</th><th>Ý mang về</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>Cây nhị phân cân bằng (balanced binary tree)</td><td>ở mọi nút, chiều cao hai con lệch ≤ 1</td><td>chiều cao O(log n)</td></tr>
<tr><td>Thuật toán cân bằng đơn giản</td><td>mảng + sắp xếp + dựng lại kiểu phần tử giữa trước</td><td>O(n log n), cần đủ mọi khoá</td></tr>
<tr><td>Phép xoay (rotation) trên cây nhị phân tìm kiếm (BST)</td><td>nhấc một nút con lên, giữ nguyên dãy trung thứ tự</td><td>O(1)</td></tr>
<tr><td>Cây AVL</td><td>BST có hệ số cân bằng (bf) ∈ {−1, 0, +1} ở mọi nút</td><td>tìm kiếm O(log n) được bảo đảm</td></tr>
<tr><td>Chèn vào cây AVL</td><td>nút ±2 đầu tiên tính từ dưới lên, nhiều nhất một lần xoay đơn hoặc kép</td><td>O(log n)</td></tr>
<tr><td>Xoá khỏi cây AVL</td><td>có thể xoay ở mọi mức tới tận gốc</td><td>O(log n)</td></tr>
<tr><td>Heap (đống)</td><td>cha ≥ con, gần đầy đủ, mảng a[0..n−1]</td><td>đọc phần tử lớn nhất O(1)</td></tr>
<tr><td>Heap làm hàng đợi ưu tiên (priority queue)</td><td>thêm = đẩy lên, lấy ra = đẩy xuống; dựng từ dưới lên (bottom-up); sắp xếp vun đống (heap sort)</td><td>O(log n) mỗi thao tác, dựng O(n), sắp O(n log n)</td></tr>
<tr><td>Ký pháp Ba Lan (Polish notation) và cây biểu thức</td><td>tiền tố, hậu tố không cần ngoặc; duyệt tiền/trung/hậu thứ tự</td><td>O(n)</td></tr>
</tbody>
</table>
<ul>
<li>Mỗi chủ đề nhớ một hình là đủ để dựng lại phần còn lại: cái chuỗi (slide 4), Par và Ch (slide 7), hình zic-zắc (slide 9), mảng nằm dưới heap (slide 16).</li>
<li>Một con số nên nhớ: với một triệu khoá, heap có 20 mức, cây AVL nhiều nhất 28 mức, còn BST suy biến (degenerate) có thể cao tới một triệu.</li>
</ul>
<p>Các câu hỏi thảo luận của syllabus được trả lời ở đâu: cây AVL, BST so với AVL, chi phí tìm kiếm trên AVL, công thức hệ số cân bằng — slide 4 và 10; heap, heap min so với heap max — slide 15; cây nhị phân so với AVL so với heap — slide 31; hàng đợi ưu tiên — slide 19.</p>
<p>Hai quy ước cần nói rõ trong mọi câu trả lời tự luận: dấu của hệ số cân bằng (slide 10) và chiều cao của một nút đứng riêng — bằng 1 trên slide, bằng 0 trong các sách đếm theo cạnh.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cây tìm kiếm thì vật lộn để giữ chiều cao nhỏ; heap thì chỉ quan tâm tới cái đỉnh.</p>`],
      [33, 'Reading at home',
        `<p class="y-chinh">🎯 The reading list points to Goodrich 6e: §11.2–11.3 for balanced search trees and AVL trees, §9.3 for heaps.</p>
<ul>
<li><strong>§11.2 Balanced Search Trees (p.472)</strong> — rotations and trinode restructuring, the operations drawn on slides 7–9.</li>
<li><strong>§11.3 AVL Trees (p.479)</strong> — the height-balance property, why the height is O(log n), insertion and deletion with rebalancing; its worked examples use the keys 54 and 32, rebuilt on slides 12 and 14 of lesson 4.C.</li>
<li><strong>§9.3 Heaps (p.370)</strong> and <strong>§9.3.1 The Heap Data Structure (p.370)</strong> — the heap-order property, the complete binary tree property, the height of a heap.</li>
<li><strong>§9.3.2 Implementing a Priority Queue with a Heap (p.372)</strong> — the array representation, up-heap bubbling after an insertion and down-heap bubbling after a removal (slides 19–20).</li>
</ul>
<p>Differences to expect: the book's priority queue is min-oriented (<code>min</code>, <code>removeMin</code>) where the slides use a max-heap — the same code with every comparison reversed. Bottom-up heap construction and heap-sort (slides 24–28) come later in the same chapter of the book.</p>
<p class="meo">🧠 <strong>How to read it:</strong> redo each figure of the book by hand first, then run this lesson's Java on the same keys and compare.</p>`,
        `<p class="y-chinh">🎯 Phần đọc ở nhà chỉ tới sách Goodrich bản 6: §11.2–11.3 cho cây tìm kiếm cân bằng và cây AVL, §9.3 cho heap (đống).</p>
<ul>
<li><strong>§11.2 Balanced Search Trees (tr.472)</strong> — phép xoay (rotation) và tái cấu trúc bộ ba nút (trinode restructuring), đúng các thao tác vẽ ở slide 7–9.</li>
<li><strong>§11.3 AVL Trees (tr.479)</strong> — tính chất cân bằng chiều cao (height-balance property), vì sao chiều cao là O(log n), chèn và xoá kèm cân bằng lại; các ví dụ có lời giải dùng khoá 54 và 32, được dựng lại ở slide 12 và 14 của bài 4.C.</li>
<li><strong>§9.3 Heaps (tr.370)</strong> và <strong>§9.3.1 The Heap Data Structure (tr.370)</strong> — tính chất thứ tự heap (heap-order property), tính chất cây nhị phân đầy đủ (complete binary tree property), chiều cao của heap.</li>
<li><strong>§9.3.2 Implementing a Priority Queue with a Heap (tr.372)</strong> — cách biểu diễn bằng mảng, nổi bọt lên (up-heap bubbling) sau khi chèn và chìm xuống (down-heap bubbling) sau khi lấy ra (slide 19–20).</li>
</ul>
<p>Khác biệt nên biết trước: hàng đợi ưu tiên (priority queue) của sách hướng về phần tử nhỏ nhất (<code>min</code>, <code>removeMin</code>), còn slide dùng heap max — cùng một đoạn code, chỉ đảo mọi phép so sánh. Dựng heap từ dưới lên (bottom-up heap construction) và sắp xếp vun đống (heap sort) — slide 24–28 — nằm ở phần sau của cùng chương trong sách.</p>
<p class="meo">🧠 <strong>Cách đọc:</strong> tự vẽ lại bằng tay từng hình của sách trước, rồi chạy Java của bài này trên đúng các khoá đó và so sánh.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ol>
<li>Enqueue 40 into the max-heap [30, 25, 20, 13, 8, 3, 17, 5]. Which elements move, and what is the array?</li>
<li>Dequeue once from [25, 13, 20, 5, 8, 3, 17]. What is returned, and what is the array?</li>
<li>Build a heap bottom-up from [1, 2, 3, 4, 5, 6, 7]. Where does the loop start, and what is the result?</li>
<li>Evaluate the postfix expression 8 2 / 3 −. Which of the two pops is the right operand?</li>
<li>Why is heap sort O(n log n) even when the heap is built bottom-up in O(n)?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 40 enters at index 8; its fathers 13, 25 and 30 each move down one level; the array is [40, 30, 20, 25, 8, 3, 17, 5, 13]. (2) It returns 25; 17 goes to the root, 20 (the larger son) moves up, 17 stops at index 2: [20, 13, 17, 5, 8, 3]. (3) At n/2 − 1 = 2, going down to 0; result [7, 5, 6, 4, 2, 1, 3]. (4) 8 / 2 = 4, then 4 − 3 = 1; the first pop (2, then 3) is the right operand. (5) The sorting phase still does n − 1 sift-downs of O(log n) each.</p>
<p><strong>Next:</strong> the deep dives below — 4.7 Building a heap: sift-up, sift-down, Floyd (the same algorithms on a min-heap, with the O(n) proof), 4.3 The four traversals &amp; expression trees; then, in other chapters, 2.5 Priority Queues &amp; Heaps (<code>java.util.PriorityQueue</code>), 2.3 Stack applications: brackets, RPN, undo, and 6.5 Heap-sort. Finish chapter 4 with its practice lesson and quiz.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ol>
<li>Thêm (enqueue) 40 vào heap max (đống cực đại) [30, 25, 20, 13, 8, 3, 17, 5]. Những phần tử nào phải dời, và mảng thành gì?</li>
<li>Lấy ra (dequeue) một lần từ [25, 13, 20, 5, 8, 3, 17]. Trả về gì, và mảng thành gì?</li>
<li>Dựng heap từ dưới lên (bottom-up) cho [1, 2, 3, 4, 5, 6, 7]. Vòng lặp bắt đầu ở đâu, và kết quả là gì?</li>
<li>Tính biểu thức hậu tố (postfix) 8 2 / 3 −. Trong hai lần lấy ra khỏi ngăn xếp (pop), lần nào là toán hạng (operand) phải?</li>
<li>Vì sao heap sort (sắp xếp vun đống) vẫn là O(n log n) dù heap được dựng bottom-up trong O(n)?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 40 vào ở chỉ số 8; các cha 13, 25 và 30 lần lượt dời xuống một mức; mảng thành [40, 30, 20, 25, 8, 3, 17, 5, 13]. (2) Trả về 25; 17 lên gốc, 20 (con lớn hơn) dời lên, 17 dừng ở chỉ số 2: [20, 13, 17, 5, 8, 3]. (3) Bắt đầu ở n/2 − 1 = 2, lùi về 0; kết quả [7, 5, 6, 4, 2, 1, 3]. (4) 8 / 2 = 4, rồi 4 − 3 = 1; lần pop đầu (2, rồi 3) là toán hạng phải. (5) Pha sắp xếp vẫn phải đẩy xuống n − 1 lần, mỗi lần O(log n).</p>
<p><strong>Học tiếp:</strong> các bài đào sâu bên dưới — 4.7 Dựng heap: sift-up, sift-down, Floyd (đẩy lên, đẩy xuống, cách dựng của Floyd — cùng các thuật toán này trên heap min, kèm chứng minh O(n)), 4.3 Bốn phép duyệt &amp; cây biểu thức; rồi ở các chương khác: 2.5 Hàng đợi ưu tiên &amp; Heap (<code>java.util.PriorityQueue</code>), 2.3 Ứng dụng ngăn xếp: dấu ngoặc, RPN, undo (RPN — ký pháp Ba Lan ngược; undo — hoàn tác), và 6.5 Heap-sort. Khép lại chương 4 bằng bài thực hành và quiz (bài trắc nghiệm) của chương.</p>`),
    books([
      ['goodrich', '§11.2 Balanced Search Trees p.472 · §11.3 AVL Trees p.479 · §9.3 Heaps p.370 — §9.3.1 The Heap Data Structure p.370 · §9.3.2 Implementing a Priority Queue with a Heap p.372', '§11.2 Balanced Search Trees tr.472 · §11.3 AVL Trees tr.479 · §9.3 Heaps tr.370 — §9.3.1 The Heap Data Structure tr.370 · §9.3.2 Implementing a Priority Queue with a Heap tr.372'],
    ]),
  ].join('\n'),
};

/* ───────── 4.8 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Trees, BST, AVL & heaps ───────── */
const L_on_ch4 = {
  title: '4.8 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Trees, BST, AVL & heaps|||4.8 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Cây, BST, AVL & heap',
  slug: 'csd201-on-ch4',
  type: 'VIDEO',
  description: '8 bài tập kiểu đề PE trên cây nhị phân tìm kiếm chứa xe Car(owner, price) — chèn bỏ trùng và bốn phép duyệt, đếm lá và chiều cao, xoá bằng sao chép, xoá bằng hợp nhất, xoay trái/phải, kiểm AVL và cân bằng lại, heap và heap sort, một đề mini kết hợp f1–f4 — có lời giải và test tự kiểm chạy thật; 26 thuật ngữ Anh–Việt; tóm tắt 8 ý và bảng độ phức tạp của chương 4.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.8 · Practice &amp; review</span>
<h2>Trees, BST, AVL &amp; heaps — practise like the PE, then review</h2>
<p class="lead">Eight exercises on a binary search tree of cars keyed by price — the shape tree questions typically take in the practical exam — from insertion and traversals to both deletions, rotations, an AVL check, a heap and a final mini exam. Every solution tests itself. Then the chapter's vocabulary in English and Vietnamese, a one-screen summary and the complexity table to revise from before the FE.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the method yourself in Eclipse, on top of the given <code>Car</code>, <code>Node</code> and <code>BSTree</code> classes.</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS.</li>
<li>Only then compare with the solution and read the trap under it.</li>
</ol>
<p>A typical CSD201 PE tree question gives the classes, an <code>insert</code>, a <code>main</code> with a menu and code that writes each answer to a file, and asks you to fill in <code>f1</code>, <code>f2</code>, … — often worded as "the first node in breadth-first order that …". Here every answer is printed on the screen instead. Exercises 1–4 and 8 use slides 18–32 of deck 4A-Trees1; exercises 5–7 use deck 4B-Trees2 (rotations, AVL trees, heaps).</p></div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.8 · Thực hành &amp; ôn tập</span>
<h2>Cây, BST, AVL &amp; heap — luyện như đề PE, rồi ôn lại</h2>
<p class="lead">Tám bài tập trên một cây nhị phân tìm kiếm (binary search tree — BST) chứa các xe, khoá (key) là giá (price) — đúng dạng mà câu hỏi về cây thường có trong đề thi thực hành (PE) — từ chèn và duyệt tới cả hai cách xoá, phép xoay, kiểm cây AVL, đống (heap) và một đề mini cuối cùng. Lời giải nào cũng tự kiểm tra được. Sau đó là thuật ngữ của chương bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình và bảng độ phức tạp để ôn trước FE.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết hàm trong Eclipse, dựa trên các lớp <code>Car</code>, <code>Node</code> và <code>BSTree</code> cho sẵn.</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt).</li>
<li>Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới.</li>
</ol>
<p>Câu hỏi về cây trong đề PE môn CSD201 thường cho sẵn các lớp, hàm <code>insert</code>, hàm <code>main</code> có menu và đoạn code ghi từng đáp án ra file, rồi yêu cầu viết thân các hàm <code>f1</code>, <code>f2</code>, … — hay được diễn đạt kiểu "nút đầu tiên theo thứ tự duyệt theo chiều rộng (breadth-first) mà …". Ở đây mọi kết quả được in ra màn hình thay vì ghi ra file. Bài 1–4 và bài 8 dùng slide 18–32 của bộ 4A-Trees1; bài 5–7 dùng bộ 4B-Trees2 (phép xoay, cây AVL, heap).</p></div>`),
    bi(`<h3>🧪 Exercise 1 — f1: insert without duplicates, then the four traversals (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Cars <code>Car(owner, price)</code> go into a BST keyed by price. Write <code>insert(owner, price)</code> that <strong>skips</strong> a car whose price is ≤ 0 or already in the tree, then <code>breadth()</code> and the three depth-first traversals, each printing the cars as (owner,price).</p>
<p class="nhan">Data → expected result</p>
<p>(A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) (H,40) (I,−5) → <strong>breadth-first:</strong> (A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) — H repeats the price 40 and I has a negative price, so both are skipped.</p>
<p class="nhan">Idea</p>
<p>the insert loop of slide 26 (pointer <code>p</code> going down, <code>f</code> one step behind) with the duplicate test returning silently; <code>breadth()</code> with a queue that never receives <code>null</code>; the three recursive traversals appending to a <code>StringBuilder</code>. Each insertion is O(h), each traversal O(n).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node left, right;

    Node(Car x) { info = x; left = right = null; }
}

class BSTree {
    Node root;

    // f1: insert by price; skip price &lt;= 0 and prices already in the tree
    void insert(String owner, int price) {
        if (price &lt;= 0) return;
        Node f = null, p = root;
        while (p != null) {
            if (p.info.price == price) return;       // duplicate key: no insertion
            f = p;
            p = price &lt; p.info.price ? p.left : p.right;
        }
        Node q = new Node(new Car(owner, price));
        if (f == null) root = q;
        else if (price &lt; f.info.price) f.left = q;
        else f.right = q;
    }

    void pre(Node p, StringBuilder s)  { if (p == null) return; s.append(p.info).append(' '); pre(p.left, s); pre(p.right, s); }
    void in(Node p, StringBuilder s)   { if (p == null) return; in(p.left, s); s.append(p.info).append(' '); in(p.right, s); }
    void post(Node p, StringBuilder s) { if (p == null) return; post(p.left, s); post(p.right, s); s.append(p.info).append(' '); }

    String order(char kind) {                        // 'p' = pre, 'i' = in, 'o' = post
        StringBuilder s = new StringBuilder();
        if (kind == 'p') pre(root, s); else if (kind == 'i') in(root, s); else post(root, s);
        return s.toString().trim();
    }

    String breadth() {
        StringBuilder s = new StringBuilder();
        if (root == null) return "";
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s.append(p.info).append(' ');
            if (p.left != null) q.add(p.left);       // never enqueue null
            if (p.right != null) q.add(p.right);
        }
        return s.toString().trim();
    }
}

public class Pe1InsertTraverse {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        BSTree t = new BSTree();
        check("empty tree: breadth prints nothing", t.breadth(), "");
        String[] o = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        int[] pr = {50, 30, 70, 20, 40, 60, 80, 40, -5};
        for (int i = 0; i &lt; o.length; i++) t.insert(o[i], pr[i]);
        check("breadth-first", t.breadth(), "(A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80)");
        check("preorder", t.order('p'), "(A,50) (B,30) (D,20) (E,40) (C,70) (F,60) (G,80)");
        check("inorder = sorted by price", t.order('i'), "(D,20) (B,30) (E,40) (A,50) (F,60) (C,70) (G,80)");
        check("postorder", t.order('o'), "(D,20) (E,40) (B,30) (F,60) (G,80) (C,70) (A,50)");
        check("H (40 again) and I (-5) were skipped", String.valueOf(t.breadth().contains("H") || t.breadth().contains("I")), "false");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS empty tree: breadth prints nothing<br>
PASS breadth-first<br>
PASS preorder<br>
PASS inorder = sorted by price<br>
PASS postorder<br>
PASS H (40 again) and I (-5) were skipped<br>
ALL TESTS PASSED</div>
<div class="pitfall">Compare the key field, <code>p.info.price == price</code>. Writing <code>p.info == price</code> does not compile (a <code>Car</code> against an <code>int</code>), and comparing two <code>Car</code> objects with <code>==</code> only tests whether they are the same object. Owners are <code>String</code>s: compare them with <code>equals</code>, never <code>==</code>.</div>`,
    `<h3>🧪 Bài 1 — f1: chèn bỏ trùng, rồi bốn phép duyệt (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Các xe <code>Car(owner, price)</code> được đưa vào một BST (cây nhị phân tìm kiếm) có khoá là price. Viết <code>insert(owner, price)</code> <strong>bỏ qua</strong> xe có price ≤ 0 hoặc price đã có trong cây, rồi viết <code>breadth()</code> (duyệt theo chiều rộng) và ba phép duyệt theo chiều sâu (tiền, trung, hậu thứ tự — preorder, inorder, postorder), mỗi phép in các xe dạng (owner,price).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>(A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) (H,40) (I,−5) → <strong>theo chiều rộng:</strong> (A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) — H lặp lại giá 40 còn I có giá âm, nên cả hai bị bỏ qua.</p>
<p class="nhan">Ý tưởng</p>
<p>dùng vòng lặp chèn của slide 26 (con trỏ <code>p</code> đi xuống, <code>f</code> theo sau một bước) với phép kiểm trùng khoá thì lặng lẽ <code>return</code>; <code>breadth()</code> dùng hàng đợi (queue) không bao giờ nhận <code>null</code>; ba phép duyệt đệ quy nối kết quả vào một <code>StringBuilder</code>. Mỗi lần chèn O(h), mỗi phép duyệt O(n).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node left, right;

    Node(Car x) { info = x; left = right = null; }
}

class BSTree {
    Node root;

    // f1: chèn theo price; bỏ qua price &lt;= 0 và price đã có trong cây
    void insert(String owner, int price) {
        if (price &lt;= 0) return;
        Node f = null, p = root;
        while (p != null) {
            if (p.info.price == price) return;       // trùng khoá: không chèn
            f = p;
            p = price &lt; p.info.price ? p.left : p.right;
        }
        Node q = new Node(new Car(owner, price));
        if (f == null) root = q;
        else if (price &lt; f.info.price) f.left = q;
        else f.right = q;
    }

    void pre(Node p, StringBuilder s)  { if (p == null) return; s.append(p.info).append(' '); pre(p.left, s); pre(p.right, s); }
    void in(Node p, StringBuilder s)   { if (p == null) return; in(p.left, s); s.append(p.info).append(' '); in(p.right, s); }
    void post(Node p, StringBuilder s) { if (p == null) return; post(p.left, s); post(p.right, s); s.append(p.info).append(' '); }

    String order(char kind) {                        // 'p' = tiền, 'i' = trung, 'o' = hậu thứ tự
        StringBuilder s = new StringBuilder();
        if (kind == 'p') pre(root, s); else if (kind == 'i') in(root, s); else post(root, s);
        return s.toString().trim();
    }

    String breadth() {
        StringBuilder s = new StringBuilder();
        if (root == null) return "";
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s.append(p.info).append(' ');
            if (p.left != null) q.add(p.left);       // không bao giờ xếp null vào hàng đợi
            if (p.right != null) q.add(p.right);
        }
        return s.toString().trim();
    }
}

public class Pe1InsertTraverse {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        BSTree t = new BSTree();
        check("empty tree: breadth prints nothing", t.breadth(), "");
        String[] o = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        int[] pr = {50, 30, 70, 20, 40, 60, 80, 40, -5};
        for (int i = 0; i &lt; o.length; i++) t.insert(o[i], pr[i]);
        check("breadth-first", t.breadth(), "(A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80)");
        check("preorder", t.order('p'), "(A,50) (B,30) (D,20) (E,40) (C,70) (F,60) (G,80)");
        check("inorder = sorted by price", t.order('i'), "(D,20) (B,30) (E,40) (A,50) (F,60) (C,70) (G,80)");
        check("postorder", t.order('o'), "(D,20) (E,40) (B,30) (F,60) (G,80) (C,70) (A,50)");
        check("H (40 again) and I (-5) were skipped", String.valueOf(t.breadth().contains("H") || t.breadth().contains("I")), "false");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS empty tree: breadth prints nothing<br>
PASS breadth-first<br>
PASS preorder<br>
PASS inorder = sorted by price<br>
PASS postorder<br>
PASS H (40 again) and I (-5) were skipped<br>
ALL TESTS PASSED</div>
<div class="pitfall">So sánh trường khoá: <code>p.info.price == price</code>. Viết <code>p.info == price</code> thì không biên dịch được (một <code>Car</code> so với một <code>int</code>), còn so hai đối tượng <code>Car</code> bằng <code>==</code> chỉ kiểm xem chúng có phải cùng một đối tượng hay không. Chủ xe (owner) là <code>String</code>: so bằng <code>equals</code>, không bao giờ dùng <code>==</code>.</div>`),
    bi(`<h3>🧪 Exercise 2 — f2: leaves, one-child nodes, height, a price range, the maximum (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>countLeaves</code>, <code>countOneChild</code> (nodes with exactly one child), <code>height</code> (slide convention: empty tree 0, one node 1), <code>countRange(a, b)</code> (cars with a ≤ price ≤ b) and <code>maxCar()</code>.</p>
<p class="nhan">Data → expected result</p>
<p>prices 50 30 70 20 40 60 80 35 → leaves 4 (20, 35, 60, 80), one-child nodes 1 (40), height 4, cars in [30, 60]: 5, most expensive: the car of 80. Empty tree → 0, 0 and <code>null</code>.</p>
<p class="nhan">Idea</p>
<p>every count is "my part + the left answer + the right answer" — think postorder. <code>countRange</code> skips a subtree that cannot hold keys in [a, b] (go left only if the key is &gt; a, right only if it is &lt; b). The maximum is the rightmost node: O(h), no full traversal needed.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node left, right;

    Node(Car x) { info = x; left = right = null; }
}

class BSTree {
    Node root;

    void insert(String owner, int price) {
        Node f = null, p = root;
        while (p != null) { if (p.info.price == price) return; f = p; p = price &lt; p.info.price ? p.left : p.right; }
        Node q = new Node(new Car(owner, price));
        if (f == null) root = q; else if (price &lt; f.info.price) f.left = q; else f.right = q;
    }

    int countLeaves(Node p) {
        if (p == null) return 0;
        if (p.left == null &amp;&amp; p.right == null) return 1;
        return countLeaves(p.left) + countLeaves(p.right);
    }

    int countOneChild(Node p) {                      // nodes with exactly one child
        if (p == null) return 0;
        int me = (p.left == null) != (p.right == null) ? 1 : 0;
        return me + countOneChild(p.left) + countOneChild(p.right);
    }

    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }   // slide: one node = 1

    int countRange(Node p, int a, int b) {           // cars with a &lt;= price &lt;= b
        if (p == null) return 0;
        int c = p.info.price &gt;= a &amp;&amp; p.info.price &lt;= b ? 1 : 0;
        if (p.info.price &gt; a) c += countRange(p.left, a, b);   // smaller keys can only be on the left
        if (p.info.price &lt; b) c += countRange(p.right, a, b);
        return c;
    }

    Car maxCar() {                                   // the rightmost node holds the largest key
        if (root == null) return null;
        Node p = root;
        while (p.right != null) p = p.right;
        return p.info;
    }
}

public class Pe2Count {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static BSTree make(int... prices) {
        BSTree t = new BSTree();
        for (int x : prices) t.insert("C" + x, x);
        return t;
    }

    public static void main(String[] args) {
        BSTree t = make(50, 30, 70, 20, 40, 60, 80, 35);
        String r = t.countLeaves(t.root) + " " + t.countOneChild(t.root) + " " + t.height(t.root);
        check("leaves / one-child nodes / height", r, "4 1 4");
        check("cars with 30 &lt;= price &lt;= 60", "" + t.countRange(t.root, 30, 60), "5");
        check("most expensive car", "" + t.maxCar(), "(C80,80)");
        BSTree e = make();
        check("empty tree", e.countLeaves(e.root) + " " + e.height(e.root) + " " + e.maxCar(), "0 0 null");
        BSTree s = make(10, 20, 30);
        check("stick 10-20-30", s.countLeaves(s.root) + " " + s.countOneChild(s.root) + " " + s.height(s.root), "1 2 3");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS leaves / one-child nodes / height<br>
PASS cars with 30 &lt;= price &lt;= 60<br>
PASS most expensive car<br>
PASS empty tree<br>
PASS stick 10-20-30<br>
ALL TESTS PASSED</div>
<div class="pitfall">Which height? The slide counts nodes (one node = 1); the textbook counts edges (one node = 0). A PE statement that says "the root has level 0" wants the second one — subtract 1. And <code>countLeaves(null)</code> must return 0: returning 1 counts every empty link as a leaf.</div>`,
    `<h3>🧪 Bài 2 — f2: lá, nút một con, chiều cao, khoảng giá, giá lớn nhất (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>countLeaves</code> (đếm lá — leaf), <code>countOneChild</code> (đếm nút có đúng một con), <code>height</code> (chiều cao theo quy ước của slide: cây rỗng 0, một nút 1), <code>countRange(a, b)</code> (số xe có a ≤ price ≤ b) và <code>maxCar()</code> (xe đắt nhất).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>các giá 50 30 70 20 40 60 80 35 → 4 lá (20, 35, 60, 80), 1 nút một con (40), chiều cao 4, số xe trong [30, 60]: 5, xe đắt nhất: xe giá 80. Cây rỗng → 0, 0 và <code>null</code>.</p>
<p class="nhan">Ý tưởng</p>
<p>mọi phép đếm đều là "phần của tôi + kết quả bên trái + kết quả bên phải" — nghĩ theo hậu thứ tự (postorder). <code>countRange</code> bỏ qua cây con không thể chứa khoá trong [a, b] (chỉ sang trái khi khoá &gt; a, chỉ sang phải khi khoá &lt; b). Giá lớn nhất nằm ở nút phải nhất (rightmost node): O(h), không cần duyệt cả cây.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node left, right;

    Node(Car x) { info = x; left = right = null; }
}

class BSTree {
    Node root;

    void insert(String owner, int price) {
        Node f = null, p = root;
        while (p != null) { if (p.info.price == price) return; f = p; p = price &lt; p.info.price ? p.left : p.right; }
        Node q = new Node(new Car(owner, price));
        if (f == null) root = q; else if (price &lt; f.info.price) f.left = q; else f.right = q;
    }

    int countLeaves(Node p) {
        if (p == null) return 0;
        if (p.left == null &amp;&amp; p.right == null) return 1;
        return countLeaves(p.left) + countLeaves(p.right);
    }

    int countOneChild(Node p) {                      // nút có đúng một con
        if (p == null) return 0;
        int me = (p.left == null) != (p.right == null) ? 1 : 0;
        return me + countOneChild(p.left) + countOneChild(p.right);
    }

    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }   // slide: một nút = 1

    int countRange(Node p, int a, int b) {           // số xe có a &lt;= price &lt;= b
        if (p == null) return 0;
        int c = p.info.price &gt;= a &amp;&amp; p.info.price &lt;= b ? 1 : 0;
        if (p.info.price &gt; a) c += countRange(p.left, a, b);   // khoá nhỏ hơn chỉ có thể ở bên trái
        if (p.info.price &lt; b) c += countRange(p.right, a, b);
        return c;
    }

    Car maxCar() {                                   // nút phải nhất giữ khoá lớn nhất
        if (root == null) return null;
        Node p = root;
        while (p.right != null) p = p.right;
        return p.info;
    }
}

public class Pe2Count {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static BSTree make(int... prices) {
        BSTree t = new BSTree();
        for (int x : prices) t.insert("C" + x, x);
        return t;
    }

    public static void main(String[] args) {
        BSTree t = make(50, 30, 70, 20, 40, 60, 80, 35);
        String r = t.countLeaves(t.root) + " " + t.countOneChild(t.root) + " " + t.height(t.root);
        check("leaves / one-child nodes / height", r, "4 1 4");
        check("cars with 30 &lt;= price &lt;= 60", "" + t.countRange(t.root, 30, 60), "5");
        check("most expensive car", "" + t.maxCar(), "(C80,80)");
        BSTree e = make();
        check("empty tree", e.countLeaves(e.root) + " " + e.height(e.root) + " " + e.maxCar(), "0 0 null");
        BSTree s = make(10, 20, 30);
        check("stick 10-20-30", s.countLeaves(s.root) + " " + s.countOneChild(s.root) + " " + s.height(s.root), "1 2 3");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS leaves / one-child nodes / height<br>
PASS cars with 30 &lt;= price &lt;= 60<br>
PASS most expensive car<br>
PASS empty tree<br>
PASS stick 10-20-30<br>
ALL TESTS PASSED</div>
<div class="pitfall">Chiều cao theo quy ước nào? Slide đếm số nút (một nút = 1); sách đếm số cạnh (một nút = 0). Đề PE ghi "gốc ở mức 0" là muốn cách thứ hai — trừ đi 1. Và <code>countLeaves(null)</code> phải trả về 0: trả 1 là đếm mọi liên kết rỗng thành lá.</div>`),
    bi(`<h3>🧪 Exercise 3 — f3: delete by copying (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>deleteByCopying(price)</code> as on slide 31 of deck 4A-Trees1: a node with two children takes the car of its predecessor (the rightmost node of its left subtree), which is then unlinked. Handle a leaf, one child, two children, the root, a missing key, and the special case where the predecessor is the node's own left child.</p>
<p class="nhan">Data → expected result</p>
<p>(A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) (H,35) (I,45) → the tree 50(30(20, 40(35, 45)), 70(60, 80)); every test starts again from this tree.</p>
<table>
<thead><tr><th>Delete</th><th>Case</th><th>Predecessor</th><th>Tree afterwards</th></tr></thead>
<tbody>
<tr><td>60</td><td>leaf</td><td>—</td><td>70 keeps only 80</td></tr>
<tr><td>50</td><td>two children, the root</td><td>(I,45), parent 40</td><td>45(30(20, 40(35, –)), 70(60, 80))</td></tr>
<tr><td>70</td><td>two children</td><td>(F,60) = 70's own left child</td><td>60 takes 70's place: 50(…, 60(–, 80))</td></tr>
<tr><td>40</td><td>two children</td><td>(H,35) = 40's own left child</td><td>35 takes 40's place: 35(–, 45)</td></tr>
<tr><td>99</td><td>not found</td><td>—</td><td>unchanged</td></tr>
</tbody>
</table>
<p class="nhan">Idea</p>
<p>find <code>p</code> and its parent <code>f</code>; with two children walk <code>tmp</code> to the rightmost node of <code>p.left</code>, keeping <code>prev</code>; copy the whole car; unlink <code>tmp</code> through its left child — <code>p.left = tmp.left</code> when <code>prev == p</code>, otherwise <code>prev.right = tmp.left</code>; with at most one child relink as on slide 28. O(h).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node left, right;

    Node(Car x) { info = x; left = right = null; }
}

class BSTree {
    Node root;

    void insert(String owner, int price) {
        Node f = null, p = root;
        while (p != null) { if (p.info.price == price) return; f = p; p = price &lt; p.info.price ? p.left : p.right; }
        Node q = new Node(new Car(owner, price));
        if (f == null) root = q; else if (price &lt; f.info.price) f.left = q; else f.right = q;
    }

    // f3: delete the car with this price by copying (predecessor, slide 31)
    void deleteByCopying(int price) {
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info.price != price) { f = p; p = price &lt; p.info.price ? p.left : p.right; }
        if (p == null) return;                       // not found
        if (p.left != null &amp;&amp; p.right != null) {
            Node prev = p, tmp = p.left;
            while (tmp.right != null) { prev = tmp; tmp = tmp.right; }
            p.info = tmp.info;                       // copy the WHOLE car, not just the price
            if (prev == p) prev.left = tmp.left;     // special case: tmp is p's left child
            else prev.right = tmp.left;
            return;
        }
        Node child = p.left != null ? p.left : p.right;
        if (f == null) root = child;
        else if (f.left == p) f.left = child;
        else f.right = child;
    }

    String breadth() {
        StringBuilder s = new StringBuilder();
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s.append(p.info).append(' ');
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
        return s.toString().trim();
    }
}

public class Pe3DeleteCopying {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String after(int x) {                     // fresh tree, delete x, breadth-first
        BSTree t = new BSTree();
        String[] o = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        int[] pr = {50, 30, 70, 20, 40, 60, 80, 35, 45};
        for (int i = 0; i &lt; o.length; i++) t.insert(o[i], pr[i]);
        t.deleteByCopying(x);
        return t.breadth();
    }

    public static void main(String[] args) {
        check("leaf 60", after(60), "(A,50) (B,30) (C,70) (D,20) (E,40) (G,80) (H,35) (I,45)");
        check("root 50: predecessor (I,45) moves up", after(50), "(I,45) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) (H,35)");
        check("70: predecessor is its left child", after(70), "(A,50) (B,30) (F,60) (D,20) (E,40) (G,80) (H,35) (I,45)");
        check("40: predecessor 35, prev == p", after(40), "(A,50) (B,30) (C,70) (D,20) (H,35) (F,60) (G,80) (I,45)");
        check("99 not in the tree: no change", after(99), "(A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) (H,35) (I,45)");
        BSTree t = new BSTree();
        t.insert("X", 10);
        t.insert("Y", 20);
        t.deleteByCopying(10);
        check("root with one child", t.breadth(), "(Y,20)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS leaf 60<br>
PASS root 50: predecessor (I,45) moves up<br>
PASS 70: predecessor is its left child<br>
PASS 40: predecessor 35, prev == p<br>
PASS 99 not in the tree: no change<br>
PASS root with one child<br>
ALL TESTS PASSED</div>
<div class="pitfall">Copy the whole car: <code>p.info = tmp.info</code>. Copying only the price (<code>p.info.price = tmp.info.price</code>) keeps the old owner with the new price — the inorder by price still looks sorted, but the second test prints (A,45) instead of (I,45). And without the <code>prev == p</code> branch, tests 3 and 4 destroy a subtree.</div>`,
    `<h3>🧪 Bài 3 — f3: xoá bằng sao chép (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>deleteByCopying(price)</code> như slide 31 của bộ 4A-Trees1: nút có hai con nhận chiếc xe của nút liền trước (predecessor — nút phải nhất của cây con trái), rồi nút liền trước đó bị gỡ ra. Phải xử lý: lá, một con, hai con, gốc, khoá không có trong cây, và trường hợp đặc biệt khi nút liền trước chính là con trái của nút cần xoá.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>(A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) (H,35) (I,45) → cây 50(30(20, 40(35, 45)), 70(60, 80)); mỗi test đều bắt đầu lại từ cây này.</p>
<table>
<thead><tr><th>Xoá</th><th>Trường hợp</th><th>Nút liền trước</th><th>Cây sau đó</th></tr></thead>
<tbody>
<tr><td>60</td><td>lá</td><td>—</td><td>70 chỉ còn con 80</td></tr>
<tr><td>50</td><td>hai con, là gốc</td><td>(I,45), cha là 40</td><td>45(30(20, 40(35, –)), 70(60, 80))</td></tr>
<tr><td>70</td><td>hai con</td><td>(F,60) = chính con trái của 70</td><td>60 thế chỗ 70: 50(…, 60(–, 80))</td></tr>
<tr><td>40</td><td>hai con</td><td>(H,35) = chính con trái của 40</td><td>35 thế chỗ 40: 35(–, 45)</td></tr>
<tr><td>99</td><td>không thấy</td><td>—</td><td>không đổi</td></tr>
</tbody>
</table>
<p class="nhan">Ý tưởng</p>
<p>tìm <code>p</code> và cha <code>f</code> của nó; nếu có hai con thì cho <code>tmp</code> đi tới nút phải nhất của <code>p.left</code>, giữ <code>prev</code> là cha của <code>tmp</code>; chép cả chiếc xe; gỡ <code>tmp</code> qua con trái của nó — <code>p.left = tmp.left</code> khi <code>prev == p</code>, ngược lại <code>prev.right = tmp.left</code>; nếu có tối đa một con thì nối lại như slide 28. O(h).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node left, right;

    Node(Car x) { info = x; left = right = null; }
}

class BSTree {
    Node root;

    void insert(String owner, int price) {
        Node f = null, p = root;
        while (p != null) { if (p.info.price == price) return; f = p; p = price &lt; p.info.price ? p.left : p.right; }
        Node q = new Node(new Car(owner, price));
        if (f == null) root = q; else if (price &lt; f.info.price) f.left = q; else f.right = q;
    }

    // f3: xoá xe có price này bằng sao chép (khoá liền trước, slide 31)
    void deleteByCopying(int price) {
        Node f = null, p = root;
        while (p != null &amp;&amp; p.info.price != price) { f = p; p = price &lt; p.info.price ? p.left : p.right; }
        if (p == null) return;                       // không thấy
        if (p.left != null &amp;&amp; p.right != null) {
            Node prev = p, tmp = p.left;
            while (tmp.right != null) { prev = tmp; tmp = tmp.right; }
            p.info = tmp.info;                       // chép CẢ chiếc xe, không chỉ price
            if (prev == p) prev.left = tmp.left;     // trường hợp đặc biệt: tmp là con trái của p
            else prev.right = tmp.left;
            return;
        }
        Node child = p.left != null ? p.left : p.right;
        if (f == null) root = child;
        else if (f.left == p) f.left = child;
        else f.right = child;
    }

    String breadth() {
        StringBuilder s = new StringBuilder();
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s.append(p.info).append(' ');
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
        return s.toString().trim();
    }
}

public class Pe3DeleteCopying {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String after(int x) {                     // cây mới, xoá x, duyệt theo chiều rộng
        BSTree t = new BSTree();
        String[] o = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        int[] pr = {50, 30, 70, 20, 40, 60, 80, 35, 45};
        for (int i = 0; i &lt; o.length; i++) t.insert(o[i], pr[i]);
        t.deleteByCopying(x);
        return t.breadth();
    }

    public static void main(String[] args) {
        check("leaf 60", after(60), "(A,50) (B,30) (C,70) (D,20) (E,40) (G,80) (H,35) (I,45)");
        check("root 50: predecessor (I,45) moves up", after(50), "(I,45) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) (H,35)");
        check("70: predecessor is its left child", after(70), "(A,50) (B,30) (F,60) (D,20) (E,40) (G,80) (H,35) (I,45)");
        check("40: predecessor 35, prev == p", after(40), "(A,50) (B,30) (C,70) (D,20) (H,35) (F,60) (G,80) (I,45)");
        check("99 not in the tree: no change", after(99), "(A,50) (B,30) (C,70) (D,20) (E,40) (F,60) (G,80) (H,35) (I,45)");
        BSTree t = new BSTree();
        t.insert("X", 10);
        t.insert("Y", 20);
        t.deleteByCopying(10);
        check("root with one child", t.breadth(), "(Y,20)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS leaf 60<br>
PASS root 50: predecessor (I,45) moves up<br>
PASS 70: predecessor is its left child<br>
PASS 40: predecessor 35, prev == p<br>
PASS 99 not in the tree: no change<br>
PASS root with one child<br>
ALL TESTS PASSED</div>
<div class="pitfall">Chép cả chiếc xe: <code>p.info = tmp.info</code>. Chỉ chép giá (<code>p.info.price = tmp.info.price</code>) thì giữ lại chủ cũ với giá mới — duyệt trung thứ tự theo giá vẫn trông như đã sắp xếp, nhưng test thứ hai in ra (A,45) thay vì (I,45). Còn thiếu nhánh <code>prev == p</code> thì test 3 và 4 làm mất một cây con.</div>`),
    bi(`<h3>🧪 Exercise 4 — f4: delete by merging (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>deleteByMerging(price)</code> as on slide 29: the right subtree of the deleted node hangs below the rightmost node of its left subtree, and the parent adopts the left subtree. A node with at most one child is simply replaced by that child.</p>
<p class="nhan">Data → expected result</p>
<p>keys 50 30 70 20 40 60 80 35 45 (height 4), each test from a fresh tree. Delete 30 → preorder 50 20 40 35 45 70 60 80, height 4. Delete the root 50 → 30 20 40 35 45 70 60 80, height <strong>5</strong>: the whole subtree 70(60, 80) went below 45. Delete 70 → 80 hangs below 60.</p>
<p class="nhan">Idea</p>
<p>the same search for <code>p</code> and <code>f</code> as in Exercise 3; build the replacing tree <code>sub</code> (<code>p.left</code>, <code>p.right</code>, or the merged one); then one relinking that also covers the root (<code>f == null</code>). O(h).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Node {
    int price;                                       // the key only: merging never moves the data
    Node left, right;

    Node(int x) { price = x; }
}

class BSTree {
    Node root;

    void insert(int x) {
        Node f = null, p = root;
        while (p != null) { if (p.price == x) return; f = p; p = x &lt; p.price ? p.left : p.right; }
        if (f == null) root = new Node(x); else if (x &lt; f.price) f.left = new Node(x); else f.right = new Node(x);
    }

    // f4: delete by merging (slide 29)
    void deleteByMerging(int x) {
        Node f = null, p = root;
        while (p != null &amp;&amp; p.price != x) { f = p; p = x &lt; p.price ? p.left : p.right; }
        if (p == null) return;
        Node sub;                                    // the one tree that replaces p
        if (p.right == null) sub = p.left;
        else if (p.left == null) sub = p.right;
        else {
            Node tmp = p.left;
            while (tmp.right != null) tmp = tmp.right;   // rightmost node of the left subtree
            tmp.right = p.right;
            sub = p.left;
        }
        if (f == null) root = sub;
        else if (f.left == p) f.left = sub;
        else f.right = sub;
    }

    String pre(Node p) { return p == null ? "" : p.price + " " + pre(p.left) + pre(p.right); }
    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }
}

public class Pe4DeleteMerging {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String after(int x) {                     // fresh tree, delete x: "preorder | height"
        BSTree t = new BSTree();
        for (int k : new int[] {50, 30, 70, 20, 40, 60, 80, 35, 45}) t.insert(k);
        t.deleteByMerging(x);
        return t.pre(t.root).trim() + " | h=" + t.height(t.root);
    }

    public static void main(String[] args) {
        check("before (nothing deleted)", after(99), "50 30 20 40 35 45 70 60 80 | h=4");
        check("30: 40-subtree hangs below 20", after(30), "50 20 40 35 45 70 60 80 | h=4");
        check("root 50: height grows to 5", after(50), "30 20 40 35 45 70 60 80 | h=5");
        check("70: 80 hangs below 60", after(70), "50 30 20 40 35 45 60 80 | h=4");
        check("leaf 35", after(35), "50 30 20 40 45 70 60 80 | h=4");
        BSTree t = new BSTree();
        t.insert(10);
        t.deleteByMerging(10);
        check("only node -&gt; empty tree", String.valueOf(t.root == null), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS before (nothing deleted)<br>
PASS 30: 40-subtree hangs below 20<br>
PASS root 50: height grows to 5<br>
PASS 70: 80 hangs below 60<br>
PASS leaf 35<br>
PASS only node -&gt; empty tree<br>
ALL TESTS PASSED</div>
<div class="pitfall">Merging may make the tree taller (4 → 5 above). That is correct — do not "repair" it; the PE compares the exact shape. And test the at-most-one-child cases first: the walk to the rightmost node starts from <code>p.left</code>, which may be <code>null</code>.</div>`,
    `<h3>🧪 Bài 4 — f4: xoá bằng hợp nhất (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>deleteByMerging(price)</code> như slide 29: cây con phải của nút bị xoá treo xuống dưới nút phải nhất của cây con trái, rồi nút cha nhận cây con trái. Nút có tối đa một con thì chỉ việc được thay bằng đứa con đó.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>các khoá 50 30 70 20 40 60 80 35 45 (cao 4), mỗi test dùng một cây mới. Xoá 30 → tiền thứ tự (preorder) 50 20 40 35 45 70 60 80, cao 4. Xoá gốc 50 → 30 20 40 35 45 70 60 80, cao <strong>5</strong>: cả cây con 70(60, 80) đã xuống dưới 45. Xoá 70 → 80 treo dưới 60.</p>
<p class="nhan">Ý tưởng</p>
<p>tìm <code>p</code> và <code>f</code> y như Bài 3; dựng cây thay thế <code>sub</code> (<code>p.left</code>, <code>p.right</code>, hoặc cây đã gộp); rồi nối lại một lần, tính cả trường hợp xoá gốc (<code>f == null</code>). O(h).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Node {
    int price;                                       // chỉ giữ khoá: hợp nhất không bao giờ dời dữ liệu
    Node left, right;

    Node(int x) { price = x; }
}

class BSTree {
    Node root;

    void insert(int x) {
        Node f = null, p = root;
        while (p != null) { if (p.price == x) return; f = p; p = x &lt; p.price ? p.left : p.right; }
        if (f == null) root = new Node(x); else if (x &lt; f.price) f.left = new Node(x); else f.right = new Node(x);
    }

    // f4: xoá bằng hợp nhất (slide 29)
    void deleteByMerging(int x) {
        Node f = null, p = root;
        while (p != null &amp;&amp; p.price != x) { f = p; p = x &lt; p.price ? p.left : p.right; }
        if (p == null) return;
        Node sub;                                    // cây duy nhất thế chỗ p
        if (p.right == null) sub = p.left;
        else if (p.left == null) sub = p.right;
        else {
            Node tmp = p.left;
            while (tmp.right != null) tmp = tmp.right;   // nút phải nhất của cây con trái
            tmp.right = p.right;
            sub = p.left;
        }
        if (f == null) root = sub;
        else if (f.left == p) f.left = sub;
        else f.right = sub;
    }

    String pre(Node p) { return p == null ? "" : p.price + " " + pre(p.left) + pre(p.right); }
    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }
}

public class Pe4DeleteMerging {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String after(int x) {                     // cây mới, xoá x: "preorder | chiều cao"
        BSTree t = new BSTree();
        for (int k : new int[] {50, 30, 70, 20, 40, 60, 80, 35, 45}) t.insert(k);
        t.deleteByMerging(x);
        return t.pre(t.root).trim() + " | h=" + t.height(t.root);
    }

    public static void main(String[] args) {
        check("before (nothing deleted)", after(99), "50 30 20 40 35 45 70 60 80 | h=4");
        check("30: 40-subtree hangs below 20", after(30), "50 20 40 35 45 70 60 80 | h=4");
        check("root 50: height grows to 5", after(50), "30 20 40 35 45 70 60 80 | h=5");
        check("70: 80 hangs below 60", after(70), "50 30 20 40 35 45 60 80 | h=4");
        check("leaf 35", after(35), "50 30 20 40 45 70 60 80 | h=4");
        BSTree t = new BSTree();
        t.insert(10);
        t.deleteByMerging(10);
        check("only node -&gt; empty tree", String.valueOf(t.root == null), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS before (nothing deleted)<br>
PASS 30: 40-subtree hangs below 20<br>
PASS root 50: height grows to 5<br>
PASS 70: 80 hangs below 60<br>
PASS leaf 35<br>
PASS only node -&gt; empty tree<br>
ALL TESTS PASSED</div>
<div class="pitfall">Hợp nhất (merging) có thể làm cây cao hơn (4 → 5 ở trên). Đó là kết quả đúng — đừng "sửa" nó; đề PE so đúng hình dạng cây. Và xét các trường hợp tối đa một con trước: vòng đi tới nút phải nhất bắt đầu từ <code>p.left</code>, mà <code>p.left</code> có thể là <code>null</code>.</div>`),
    bi(`<h3>🧪 Exercise 5 — rotate a node right or left (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>rotateRight(x)</code> and <code>rotateLeft(x)</code> for the node with price x, as on slide 7 of deck 4B-Trees2: rotating Par to the right about its left child Ch makes Ch the new root of the subtree, the right subtree of Ch becomes the left subtree of Par, and Par becomes the right subtree of Ch. If the needed child does not exist, do nothing.</p>
<p class="nhan">Data → expected result</p>
<p>50(30(20, 40), 70): <code>rotateRight(50)</code> → 30(20, 50(40, 70)), preorder 30 20 50 40 70, inorder unchanged; <code>rotateLeft(30)</code> brings the old tree back. The stick 30-20-10: <code>rotateRight(30)</code> → 20(10, 30), height 3 → 2.</p>
<pre><code class="language-plaintext">     50                        30
    /  \\     rotateRight(50)  /  \\
  30    70   -------------&gt;  20   50
 /  \\                            /  \\
20   40                         40   70</code></pre>
<p class="nhan">Idea</p>
<p>three assignments move the pointers (<code>par.left = ch.right; ch.right = par;</code>), then the link that pointed to Par — the parent's left or right link, or <code>root</code> — must point to Ch. A rotation is O(1) once the node is found and never changes the inorder, so the tree stays a BST.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Node {
    int price;
    Node left, right;

    Node(int x) { price = x; }
}

class BSTree {
    Node root;

    void insert(int x) {
        Node f = null, p = root;
        while (p != null) { if (p.price == x) return; f = p; p = x &lt; p.price ? p.left : p.right; }
        if (f == null) root = new Node(x); else if (x &lt; f.price) f.left = new Node(x); else f.right = new Node(x);
    }

    Node parentOf(Node c) {                          // null for the root
        Node f = null, p = root;
        while (p != c) { f = p; p = c.price &lt; p.price ? p.left : p.right; }
        return f;
    }

    void relink(Node f, Node oldTop, Node newTop) {  // the link that pointed to oldTop now points to newTop
        if (f == null) root = newTop; else if (f.left == oldTop) f.left = newTop; else f.right = newTop;
    }

    Node find(int x) { Node p = root; while (p != null &amp;&amp; p.price != x) p = x &lt; p.price ? p.left : p.right; return p; }

    // rotate Par (price x) to the right about its left child Ch (deck 4B-Trees2, slide 7)
    void rotateRight(int x) {
        Node par = find(x);
        if (par == null || par.left == null) return; // nothing to rotate
        Node f = parentOf(par), ch = par.left;
        par.left = ch.right;                         // right subtree of Ch becomes left subtree of Par
        ch.right = par;                              // Par becomes the right subtree of Ch
        relink(f, par, ch);                          // Ch is the new root of this subtree
    }

    void rotateLeft(int x) {                         // the mirror image
        Node par = find(x);
        if (par == null || par.right == null) return;
        Node f = parentOf(par), ch = par.right;
        par.right = ch.left;
        ch.left = par;
        relink(f, par, ch);
    }

    String pre(Node p) { return p == null ? "" : p.price + " " + pre(p.left) + pre(p.right); }
    String in(Node p)  { return p == null ? "" : in(p.left) + p.price + " " + in(p.right); }
    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }
}

public class Pe5Rotate {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static BSTree make(int... keys) { BSTree t = new BSTree(); for (int k : keys) t.insert(k); return t; }

    public static void main(String[] args) {
        BSTree t = make(50, 30, 70, 20, 40);
        t.rotateRight(50);
        check("rotateRight(50) at the root", t.pre(t.root).trim(), "30 20 50 40 70");
        check("inorder unchanged", t.in(t.root).trim(), "20 30 40 50 70");
        t.rotateLeft(30);
        check("rotateLeft(30) undoes it", t.pre(t.root).trim(), "50 30 20 40 70");
        t = make(50, 30, 70, 20, 40, 10);
        t.rotateRight(30);
        check("rotateRight(30): parent 50 relinked", t.pre(t.root).trim(), "50 20 10 30 40 70");
        t.rotateRight(70);
        check("70 has no left child: no change", t.pre(t.root).trim(), "50 20 10 30 40 70");
        t = make(30, 20, 10);
        t.rotateRight(30);
        check("stick 30-20-10: height 3 -&gt; 2", t.pre(t.root).trim() + " h=" + t.height(t.root), "20 10 30 h=2");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS rotateRight(50) at the root<br>
PASS inorder unchanged<br>
PASS rotateLeft(30) undoes it<br>
PASS rotateRight(30): parent 50 relinked<br>
PASS 70 has no left child: no change<br>
PASS stick 30-20-10: height 3 -&gt; 2<br>
ALL TESTS PASSED</div>
<div class="pitfall">Forgetting the relinking step is the classic mistake: the three assignments are right, but the parent still points to Par, so Ch and everything above it in the new subtree vanish from the tree (test 4 catches it). Rotating when <code>par.left == null</code> throws a <code>NullPointerException</code> (test 5).</div>`,
    `<h3>🧪 Bài 5 — xoay một nút sang phải hoặc sang trái (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>rotateRight(x)</code> và <code>rotateLeft(x)</code> (xoay phải, xoay trái) cho nút có price x, như slide 7 của bộ 4B-Trees2: xoay Par sang phải quanh con trái Ch thì Ch thành gốc mới của cây con, cây con phải của Ch thành cây con trái của Par, và Par thành cây con phải của Ch. Nếu không có đứa con cần thiết thì không làm gì.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>50(30(20, 40), 70): <code>rotateRight(50)</code> → 30(20, 50(40, 70)), tiền thứ tự 30 20 50 40 70, trung thứ tự (inorder) không đổi; <code>rotateLeft(30)</code> đưa cây cũ trở lại. Cây "que" 30-20-10: <code>rotateRight(30)</code> → 20(10, 30), chiều cao 3 → 2.</p>
<pre><code class="language-plaintext">     50                        30
    /  \\     rotateRight(50)  /  \\
  30    70   -------------&gt;  20   50
 /  \\                            /  \\
20   40                         40   70</code></pre>
<p class="nhan">Ý tưởng</p>
<p>ba phép gán đổi con trỏ (<code>par.left = ch.right; ch.right = par;</code>), rồi liên kết đang trỏ tới Par — liên kết trái hoặc phải của nút cha, hoặc <code>root</code> — phải trỏ sang Ch. Phép xoay (rotation) tốn O(1) khi đã tìm được nút và không bao giờ đổi thứ tự trung thứ tự, nên cây vẫn là BST.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Node {
    int price;
    Node left, right;

    Node(int x) { price = x; }
}

class BSTree {
    Node root;

    void insert(int x) {
        Node f = null, p = root;
        while (p != null) { if (p.price == x) return; f = p; p = x &lt; p.price ? p.left : p.right; }
        if (f == null) root = new Node(x); else if (x &lt; f.price) f.left = new Node(x); else f.right = new Node(x);
    }

    Node parentOf(Node c) {                          // gốc thì trả null
        Node f = null, p = root;
        while (p != c) { f = p; p = c.price &lt; p.price ? p.left : p.right; }
        return f;
    }

    void relink(Node f, Node oldTop, Node newTop) {  // liên kết đang trỏ oldTop giờ trỏ newTop
        if (f == null) root = newTop; else if (f.left == oldTop) f.left = newTop; else f.right = newTop;
    }

    Node find(int x) { Node p = root; while (p != null &amp;&amp; p.price != x) p = x &lt; p.price ? p.left : p.right; return p; }

    // xoay Par (price x) sang phải quanh con trái Ch (bộ 4B-Trees2, slide 7)
    void rotateRight(int x) {
        Node par = find(x);
        if (par == null || par.left == null) return; // không có gì để xoay
        Node f = parentOf(par), ch = par.left;
        par.left = ch.right;                         // cây con phải của Ch thành cây con trái của Par
        ch.right = par;                              // Par thành cây con phải của Ch
        relink(f, par, ch);                          // Ch là gốc mới của cây con này
    }

    void rotateLeft(int x) {                         // ảnh gương
        Node par = find(x);
        if (par == null || par.right == null) return;
        Node f = parentOf(par), ch = par.right;
        par.right = ch.left;
        ch.left = par;
        relink(f, par, ch);
    }

    String pre(Node p) { return p == null ? "" : p.price + " " + pre(p.left) + pre(p.right); }
    String in(Node p)  { return p == null ? "" : in(p.left) + p.price + " " + in(p.right); }
    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }
}

public class Pe5Rotate {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static BSTree make(int... keys) { BSTree t = new BSTree(); for (int k : keys) t.insert(k); return t; }

    public static void main(String[] args) {
        BSTree t = make(50, 30, 70, 20, 40);
        t.rotateRight(50);
        check("rotateRight(50) at the root", t.pre(t.root).trim(), "30 20 50 40 70");
        check("inorder unchanged", t.in(t.root).trim(), "20 30 40 50 70");
        t.rotateLeft(30);
        check("rotateLeft(30) undoes it", t.pre(t.root).trim(), "50 30 20 40 70");
        t = make(50, 30, 70, 20, 40, 10);
        t.rotateRight(30);
        check("rotateRight(30): parent 50 relinked", t.pre(t.root).trim(), "50 20 10 30 40 70");
        t.rotateRight(70);
        check("70 has no left child: no change", t.pre(t.root).trim(), "50 20 10 30 40 70");
        t = make(30, 20, 10);
        t.rotateRight(30);
        check("stick 30-20-10: height 3 -&gt; 2", t.pre(t.root).trim() + " h=" + t.height(t.root), "20 10 30 h=2");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS rotateRight(50) at the root<br>
PASS inorder unchanged<br>
PASS rotateLeft(30) undoes it<br>
PASS rotateRight(30): parent 50 relinked<br>
PASS 70 has no left child: no change<br>
PASS stick 30-20-10: height 3 -&gt; 2<br>
ALL TESTS PASSED</div>
<div class="pitfall">Quên bước nối lại liên kết của cha là lỗi kinh điển: ba phép gán đều đúng, nhưng cha vẫn trỏ vào Par, nên Ch biến mất khỏi cây (test 4 bắt lỗi này). Xoay khi <code>par.left == null</code> thì ném <code>NullPointerException</code> (test 5).</div>`),
    bi(`<h3>🧪 Exercise 6 — is it an AVL tree? If not, rebalance it (~25 min)</h3>
<p class="nhan">Task</p>
<p>(a) Write <code>bf(p)</code> = height(right) − height(left), the balance factor of deck 4B-Trees2, and <code>isAVL()</code>: every node has a balance factor of −1, 0 or 1. (b) Write <code>rebalance()</code> with the simple balance algorithm of slides 5–6: copy the keys into an array in inorder (so it is sorted), clear the tree, then insert the middle element and recurse on both halves.</p>
<p class="nhan">Data → expected result</p>
<p>50 30 70 20 → bf(50) = −1, bf(30) = −1, AVL. 50 30 20 → bf(50) = −2, not AVL. Keys 10…70 inserted in order → a stick of height 7; after <code>rebalance()</code> the breadth-first order is 40 20 60 10 30 50 70, height 3, AVL.</p>
<p class="nhan">Idea</p>
<p>computing <code>height</code> again at every node costs O(n log n) on a balanced tree and O(n²) on a stick; <code>avlHeight</code> returns the height and −1 as soon as one node is out of balance, so one postorder pass decides everything in O(n). <code>rebalance</code> is O(n) for the copy plus n insertions of O(log n) each.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.ArrayDeque;

class Node {
    int price;
    Node left, right;

    Node(int x) { price = x; }
}

class BSTree {
    Node root;

    void insert(int x) {
        Node f = null, p = root;
        while (p != null) { if (p.price == x) return; f = p; p = x &lt; p.price ? p.left : p.right; }
        if (f == null) root = new Node(x); else if (x &lt; f.price) f.left = new Node(x); else f.right = new Node(x);
    }

    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    int bf(Node p) { return height(p.right) - height(p.left); }   // balance factor as in deck 4B-Trees2

    // height of p's subtree, or -1 as soon as one node has |bf| &gt; 1: one pass, O(n)
    int avlHeight(Node p) {
        if (p == null) return 0;
        int hl = avlHeight(p.left), hr = avlHeight(p.right);
        if (hl &lt; 0 || hr &lt; 0 || Math.abs(hr - hl) &gt; 1) return -1;
        return 1 + Math.max(hl, hr);
    }

    boolean isAVL() { return avlHeight(root) &gt;= 0; }  // insert() keeps the BST rule, so only the balance is checked

    void inorder(Node p, ArrayList&lt;Integer&gt; a) { if (p == null) return; inorder(p.left, a); a.add(p.price); inorder(p.right, a); }

    void balance(ArrayList&lt;Integer&gt; data, int first, int last) {   // deck 4B-Trees2, slide 6
        if (first &lt;= last) {
            int middle = (first + last) / 2;
            insert(data.get(middle));
            balance(data, first, middle - 1);
            balance(data, middle + 1, last);
        }
    }

    void rebalance() {                               // copy to an array (sorted by inorder), clear, rebuild
        ArrayList&lt;Integer&gt; a = new ArrayList&lt;Integer&gt;();
        inorder(root, a);
        root = null;
        balance(a, 0, a.size() - 1);
    }

    String breadth() {
        StringBuilder s = new StringBuilder();
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s.append(p.price).append(' ');
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
        return s.toString().trim();
    }
}

public class Pe6AvlBalance {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static BSTree make(int... keys) { BSTree t = new BSTree(); for (int k : keys) t.insert(k); return t; }

    public static void main(String[] args) {
        BSTree a = make(50, 30, 70, 20);
        check("50 30 70 20: bf(50), bf(30), AVL?", a.bf(a.root) + " " + a.bf(a.root.left) + " " + a.isAVL(), "-1 -1 true");
        BSTree b = make(50, 30, 20);
        check("50 30 20: bf(50) = -2, not AVL", b.bf(b.root) + " " + b.isAVL(), "-2 false");
        BSTree s = make(10, 20, 30, 40, 50, 60, 70);
        check("sorted input: a stick of height 7", s.height(s.root) + " " + s.isAVL(), "7 false");
        s.rebalance();
        check("after rebalance: breadth-first", s.breadth(), "40 20 60 10 30 50 70");
        check("after rebalance: height 3, AVL", s.height(s.root) + " " + s.isAVL(), "3 true");
        BSTree e = make(1, 2, 3, 4, 5, 6);
        e.rebalance();
        check("6 keys: middle = (0+5)/2 = index 2", e.breadth(), "3 1 5 2 4 6");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 50 30 70 20: bf(50), bf(30), AVL?<br>
PASS 50 30 20: bf(50) = -2, not AVL<br>
PASS sorted input: a stick of height 7<br>
PASS after rebalance: breadth-first<br>
PASS after rebalance: height 3, AVL<br>
PASS 6 keys: middle = (0+5)/2 = index 2<br>
ALL TESTS PASSED</div>
<div class="pitfall">The sign: the slides define bf = h(right) − h(left), so a left-heavy node has bf −1; some books use left − right. And balance is required at <em>every</em> node — a root with bf 0 proves nothing: 50(30(20(10, –), –), 70(–, 80(–, 90))) has bf(50) = 0 but bf(30) = −2, so it is not an AVL tree.</div>`,
    `<h3>🧪 Bài 6 — có phải cây AVL không? Nếu không thì cân bằng lại (~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>(a) Viết <code>bf(p)</code> = chiều cao(phải) − chiều cao(trái), tức hệ số cân bằng (balance factor) của bộ 4B-Trees2, và <code>isAVL()</code>: mọi nút có hệ số cân bằng −1, 0 hoặc 1. (b) Viết <code>rebalance()</code> theo thuật toán cân bằng đơn giản (simple balance algorithm) của slide 5–6: chép các khoá ra mảng theo trung thứ tự (nên mảng đã sắp xếp), xoá cây, rồi chèn phần tử ở giữa và đệ quy trên hai nửa.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>50 30 70 20 → bf(50) = −1, bf(30) = −1, là AVL. 50 30 20 → bf(50) = −2, không phải AVL. Các khoá 10…70 chèn theo thứ tự tăng → cây "que" cao 7; sau <code>rebalance()</code> thứ tự theo chiều rộng là 40 20 60 10 30 50 70, cao 3, là AVL.</p>
<p class="nhan">Ý tưởng</p>
<p>tính lại <code>height</code> ở mọi nút tốn O(n log n) trên cây cân bằng và O(n²) trên cây "que"; <code>avlHeight</code> trả về chiều cao, và trả −1 ngay khi có một nút mất cân bằng, nên chỉ một lượt hậu thứ tự (postorder) là quyết định xong trong O(n). <code>rebalance</code> tốn O(n) để chép cộng n lần chèn, mỗi lần O(log n).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.ArrayDeque;

class Node {
    int price;
    Node left, right;

    Node(int x) { price = x; }
}

class BSTree {
    Node root;

    void insert(int x) {
        Node f = null, p = root;
        while (p != null) { if (p.price == x) return; f = p; p = x &lt; p.price ? p.left : p.right; }
        if (f == null) root = new Node(x); else if (x &lt; f.price) f.left = new Node(x); else f.right = new Node(x);
    }

    int height(Node p) { return p == null ? 0 : 1 + Math.max(height(p.left), height(p.right)); }

    int bf(Node p) { return height(p.right) - height(p.left); }   // hệ số cân bằng như bộ 4B-Trees2

    // chiều cao cây con, hoặc -1 ngay khi có nút |bf| &gt; 1: một lượt, O(n)
    int avlHeight(Node p) {
        if (p == null) return 0;
        int hl = avlHeight(p.left), hr = avlHeight(p.right);
        if (hl &lt; 0 || hr &lt; 0 || Math.abs(hr - hl) &gt; 1) return -1;
        return 1 + Math.max(hl, hr);
    }

    boolean isAVL() { return avlHeight(root) &gt;= 0; }  // insert() đã giữ luật BST nên chỉ cần kiểm cân bằng

    void inorder(Node p, ArrayList&lt;Integer&gt; a) { if (p == null) return; inorder(p.left, a); a.add(p.price); inorder(p.right, a); }

    void balance(ArrayList&lt;Integer&gt; data, int first, int last) {   // bộ 4B-Trees2, slide 6
        if (first &lt;= last) {
            int middle = (first + last) / 2;
            insert(data.get(middle));
            balance(data, first, middle - 1);
            balance(data, middle + 1, last);
        }
    }

    void rebalance() {                               // chép ra mảng (inorder đã sắp), xoá cây, dựng lại
        ArrayList&lt;Integer&gt; a = new ArrayList&lt;Integer&gt;();
        inorder(root, a);
        root = null;
        balance(a, 0, a.size() - 1);
    }

    String breadth() {
        StringBuilder s = new StringBuilder();
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s.append(p.price).append(' ');
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
        return s.toString().trim();
    }
}

public class Pe6AvlBalance {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static BSTree make(int... keys) { BSTree t = new BSTree(); for (int k : keys) t.insert(k); return t; }

    public static void main(String[] args) {
        BSTree a = make(50, 30, 70, 20);
        check("50 30 70 20: bf(50), bf(30), AVL?", a.bf(a.root) + " " + a.bf(a.root.left) + " " + a.isAVL(), "-1 -1 true");
        BSTree b = make(50, 30, 20);
        check("50 30 20: bf(50) = -2, not AVL", b.bf(b.root) + " " + b.isAVL(), "-2 false");
        BSTree s = make(10, 20, 30, 40, 50, 60, 70);
        check("sorted input: a stick of height 7", s.height(s.root) + " " + s.isAVL(), "7 false");
        s.rebalance();
        check("after rebalance: breadth-first", s.breadth(), "40 20 60 10 30 50 70");
        check("after rebalance: height 3, AVL", s.height(s.root) + " " + s.isAVL(), "3 true");
        BSTree e = make(1, 2, 3, 4, 5, 6);
        e.rebalance();
        check("6 keys: middle = (0+5)/2 = index 2", e.breadth(), "3 1 5 2 4 6");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 50 30 70 20: bf(50), bf(30), AVL?<br>
PASS 50 30 20: bf(50) = -2, not AVL<br>
PASS sorted input: a stick of height 7<br>
PASS after rebalance: breadth-first<br>
PASS after rebalance: height 3, AVL<br>
PASS 6 keys: middle = (0+5)/2 = index 2<br>
ALL TESTS PASSED</div>
<div class="pitfall">Dấu của hệ số: slide định nghĩa bf = h(phải) − h(trái), nên nút lệch trái có bf −1; có sách dùng trái − phải. Và điều kiện cân bằng phải đúng ở <em>mọi</em> nút — gốc có bf bằng 0 chưa chứng minh được gì: 50(30(20(10, –), –), 70(–, 80(–, 90))) có bf(50) = 0 nhưng bf(30) = −2, nên không phải cây AVL.</div>`),
    bi(`<h3>🧪 Exercise 7 — a heap in an array: build it two ways, sort, serve the maximum (~20 min)</h3>
<p class="nhan">Task</p>
<p>With the array of slides 24–26 of deck 4B-Trees2, [2 8 6 1 10 15 3 12 11]: (a) build a max-heap top-down (slide 27: every element climbs while it is larger than its father); (b) build one bottom-up (sift down from the last father back to the root); (c) heap sort (slides 27–28); (d) use the heap as a priority queue: dequeue the maximum three times.</p>
<p class="nhan">Data → expected result</p>
<p>top-down [15, 12, 10, 11, 2, 6, 3, 1, 8] · bottom-up [15, 12, 6, 11, 10, 2, 3, 1, 8] — two different heaps, both valid · heap sort [1, 2, 3, 6, 8, 10, 11, 12, 15] · served: 15 12 11.</p>
<p class="nhan">Idea</p>
<p>positions follow slide 16: the father of i is (i − 1)/2, its children 2i + 1 and 2i + 2. One <code>siftDown</code> (move a value down, always towards the larger child) serves the bottom-up build, the sort and the dequeue. The bottom-up build, step by step:</p>
<table>
<thead><tr><th>Father i</th><th>Value sifted down</th><th>Array afterwards</th></tr></thead>
<tbody>
<tr><td>3</td><td>1 swaps with 12</td><td>[2 8 6 12 10 15 3 1 11]</td></tr>
<tr><td>2</td><td>6 swaps with 15</td><td>[2 8 15 12 10 6 3 1 11]</td></tr>
<tr><td>1</td><td>8 swaps with 12, then with 11</td><td>[2 12 15 11 10 6 3 1 8]</td></tr>
<tr><td>0</td><td>2 swaps with 15, then with 6</td><td>[15 12 6 11 10 2 3 1 8]</td></tr>
</tbody>
</table>
<p>Costs: top-down O(n log n), bottom-up O(n), heap sort O(n log n) in place, each dequeue O(log n), reading the maximum O(1).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Arrays;

public class Pe7Heap {
    // deck 4B-Trees2, slide 27: top-down, every a[i] climbs while it beats its father
    static void heapTopDown(int[] a) {
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], s = i;                     // s is a son, (s-1)/2 its father
            while (s &gt; 0 &amp;&amp; x &gt; a[(s - 1) / 2]) { a[s] = a[(s - 1) / 2]; s = (s - 1) / 2; }
            a[s] = x;
        }
    }

    // move a[f] down inside a[0..n-1] until both children are smaller
    static void siftDown(int[] a, int f, int n) {
        int x = a[f], s = 2 * f + 1;
        while (s &lt; n) {
            if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s++;   // the larger son
            if (x &gt;= a[s]) break;
            a[f] = a[s]; f = s; s = 2 * f + 1;
        }
        a[f] = x;
    }

    static void heapBottomUp(int[] a) {              // slides 24-26: last father first, down to the root
        for (int i = a.length / 2 - 1; i &gt;= 0; i--) siftDown(a, i, a.length);
    }

    static void heapSort(int[] a) {                  // slides 27-28: build, then move the max to the back n-1 times
        heapTopDown(a);
        for (int i = a.length - 1; i &gt; 0; i--) {
            int x = a[i]; a[i] = a[0]; a[0] = x;
            siftDown(a, 0, i);
        }
    }

    static boolean isMaxHeap(int[] a) {
        for (int i = 1; i &lt; a.length; i++) if (a[(i - 1) / 2] &lt; a[i]) return false;
        return true;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] data = {2, 8, 6, 1, 10, 15, 3, 12, 11};   // the array of slides 24-26
        int[] a = data.clone();
        heapTopDown(a);
        check("top-down heap", Arrays.toString(a) + " " + isMaxHeap(a), "[15, 12, 10, 11, 2, 6, 3, 1, 8] true");
        int[] b = data.clone();
        heapBottomUp(b);
        check("bottom-up heap (another valid heap)", Arrays.toString(b) + " " + isMaxHeap(b), "[15, 12, 6, 11, 10, 2, 3, 1, 8] true");
        int[] c = data.clone();
        heapSort(c);
        check("heap sort, ascending", Arrays.toString(c), "[1, 2, 3, 6, 8, 10, 11, 12, 15]");
        int n = a.length;                            // priority queue: serve the 3 most expensive
        String served = "";
        for (int k = 0; k &lt; 3; k++) { served += a[0] + " "; a[0] = a[--n]; siftDown(a, 0, n); }
        check("dequeue 3 times from the top-down heap", served.trim(), "15 12 11");
        check("parent(8), left(1), right(1)", (8 - 1) / 2 + " " + (2 * 1 + 1) + " " + 2 * (1 + 1), "3 3 4");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS top-down heap<br>
PASS bottom-up heap (another valid heap)<br>
PASS heap sort, ascending<br>
PASS dequeue 3 times from the top-down heap<br>
PASS parent(8), left(1), right(1)<br>
ALL TESTS PASSED</div>
<div class="pitfall">A heap is not a sorted array: [15, 12, 10, 11, …] has 11 after 10, and that is fine — only father ≥ child is required. An FE question "the heap built from this array" must say which method; the two answers above are both correct heaps. And the index formulas change with a 1-based array (father i/2, children 2i and 2i + 1).</div>`,
    `<h3>🧪 Bài 7 — đống (heap) trên mảng: dựng theo hai cách, sắp xếp, phục vụ phần tử lớn nhất (~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Với mảng của slide 24–26 bộ 4B-Trees2, [2 8 6 1 10 15 3 12 11]: (a) dựng max-heap (đống cực đại) từ trên xuống (top-down, slide 27: mỗi phần tử leo lên chừng nào còn lớn hơn cha); (b) dựng từ dưới lên (bottom-up: đẩy xuống — sift down — từ người cha cuối cùng lùi về gốc); (c) sắp xếp vun đống (heap sort, slide 27–28); (d) dùng heap làm hàng đợi ưu tiên (priority queue): lấy ra phần tử lớn nhất ba lần.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>top-down [15, 12, 10, 11, 2, 6, 3, 1, 8] · bottom-up [15, 12, 6, 11, 10, 2, 3, 1, 8] — hai heap khác nhau, cả hai đều hợp lệ · heap sort [1, 2, 3, 6, 8, 10, 11, 12, 15] · lấy ra lần lượt: 15 12 11.</p>
<p class="nhan">Ý tưởng</p>
<p>vị trí theo slide 16: cha của i là (i − 1)/2, hai con là 2i + 1 và 2i + 2. Một hàm <code>siftDown</code> (đẩy một giá trị xuống, luôn đi về phía con lớn hơn) dùng chung cho dựng từ dưới lên, sắp xếp và lấy ra. Dựng từ dưới lên, từng bước:</p>
<table>
<thead><tr><th>Cha i</th><th>Giá trị bị đẩy xuống</th><th>Mảng sau đó</th></tr></thead>
<tbody>
<tr><td>3</td><td>1 đổi chỗ với 12</td><td>[2 8 6 12 10 15 3 1 11]</td></tr>
<tr><td>2</td><td>6 đổi chỗ với 15</td><td>[2 8 15 12 10 6 3 1 11]</td></tr>
<tr><td>1</td><td>8 đổi với 12, rồi với 11</td><td>[2 12 15 11 10 6 3 1 8]</td></tr>
<tr><td>0</td><td>2 đổi với 15, rồi với 6</td><td>[15 12 6 11 10 2 3 1 8]</td></tr>
</tbody>
</table>
<p>Chi phí: top-down O(n log n), bottom-up O(n), heap sort O(n log n) tại chỗ, mỗi lần lấy ra O(log n), đọc phần tử lớn nhất O(1).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Arrays;

public class Pe7Heap {
    // slide 27: từ trên xuống, mỗi a[i] leo lên khi còn lớn hơn cha
    static void heapTopDown(int[] a) {
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], s = i;                     // s là con, (s-1)/2 là cha
            while (s &gt; 0 &amp;&amp; x &gt; a[(s - 1) / 2]) { a[s] = a[(s - 1) / 2]; s = (s - 1) / 2; }
            a[s] = x;
        }
    }

    // đẩy a[f] xuống trong a[0..n-1] tới khi cả hai con đều nhỏ hơn
    static void siftDown(int[] a, int f, int n) {
        int x = a[f], s = 2 * f + 1;
        while (s &lt; n) {
            if (s + 1 &lt; n &amp;&amp; a[s] &lt; a[s + 1]) s++;   // đứa con lớn hơn
            if (x &gt;= a[s]) break;
            a[f] = a[s]; f = s; s = 2 * f + 1;
        }
        a[f] = x;
    }

    static void heapBottomUp(int[] a) {              // slide 24-26: từ người cha cuối cùng lùi về gốc
        for (int i = a.length / 2 - 1; i &gt;= 0; i--) siftDown(a, i, a.length);
    }

    static void heapSort(int[] a) {                  // slide 27-28: dựng heap, rồi n-1 lần đưa max về cuối
        heapTopDown(a);
        for (int i = a.length - 1; i &gt; 0; i--) {
            int x = a[i]; a[i] = a[0]; a[0] = x;
            siftDown(a, 0, i);
        }
    }

    static boolean isMaxHeap(int[] a) {
        for (int i = 1; i &lt; a.length; i++) if (a[(i - 1) / 2] &lt; a[i]) return false;
        return true;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] data = {2, 8, 6, 1, 10, 15, 3, 12, 11};   // mảng của slide 24-26
        int[] a = data.clone();
        heapTopDown(a);
        check("top-down heap", Arrays.toString(a) + " " + isMaxHeap(a), "[15, 12, 10, 11, 2, 6, 3, 1, 8] true");
        int[] b = data.clone();
        heapBottomUp(b);
        check("bottom-up heap (another valid heap)", Arrays.toString(b) + " " + isMaxHeap(b), "[15, 12, 6, 11, 10, 2, 3, 1, 8] true");
        int[] c = data.clone();
        heapSort(c);
        check("heap sort, ascending", Arrays.toString(c), "[1, 2, 3, 6, 8, 10, 11, 12, 15]");
        int n = a.length;                            // hàng đợi ưu tiên: phục vụ 3 giá cao nhất
        String served = "";
        for (int k = 0; k &lt; 3; k++) { served += a[0] + " "; a[0] = a[--n]; siftDown(a, 0, n); }
        check("dequeue 3 times from the top-down heap", served.trim(), "15 12 11");
        check("parent(8), left(1), right(1)", (8 - 1) / 2 + " " + (2 * 1 + 1) + " " + 2 * (1 + 1), "3 3 4");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS top-down heap<br>
PASS bottom-up heap (another valid heap)<br>
PASS heap sort, ascending<br>
PASS dequeue 3 times from the top-down heap<br>
PASS parent(8), left(1), right(1)<br>
ALL TESTS PASSED</div>
<div class="pitfall">Heap không phải mảng đã sắp xếp: [15, 12, 10, 11, …] có 11 đứng sau 10, và như thế vẫn đúng — heap chỉ đòi cha ≥ con. Câu FE "heap dựng từ mảng này" phải nói rõ dùng cách nào; hai đáp án ở trên đều là heap đúng. Và công thức chỉ số đổi khi mảng đánh số từ 1 (cha i/2, hai con 2i và 2i + 1).</div>`),
    bi(`<h3>🧪 Exercise 8 — mini exam: f1–f4 on one tree (close to a real PE · ~30 min)</h3>
<p class="nhan">Task</p>
<p>The <code>BSTree</code> of cars and its <code>insert</code> are given. <strong>f1</strong>: display the tree breadth-first. <strong>f2</strong>: preorder, displaying only the cars with 3 ≤ price ≤ 7. <strong>f3</strong>: find the first node, in breadth-first order, that has two children and price &lt; 5, and delete it by copying. <strong>f4</strong>: find the first node, in breadth-first order, that has a left child and price &gt; 5, and rotate it to the right.</p>
<p class="nhan">Data → expected result</p>
<p>(A,5) (B,3) (C,8) (D,1) (E,4) (F,7) (G,9) (H,2) (I,6):</p>
<table>
<thead><tr><th>Function</th><th>Expected output</th></tr></thead>
<tbody>
<tr><td>f1</td><td>(A,5) (B,3) (C,8) (D,1) (E,4) (F,7) (G,9) (H,2) (I,6)</td></tr>
<tr><td>f2</td><td>(A,5) (B,3) (E,4) (F,7) (I,6)</td></tr>
<tr><td>f3 — deletes (B,3); predecessor (H,2) moves up</td><td>(A,5) (H,2) (C,8) (D,1) (E,4) (F,7) (G,9) (I,6)</td></tr>
<tr><td>f4 — rotates (C,8) right; (F,7) takes its place</td><td>(A,5) (H,2) (F,7) (D,1) (E,4) (I,6) (C,8) (G,9)</td></tr>
</tbody>
</table>
<p class="nhan">Idea</p>
<p>one helper, <code>firstInBreadth(kind, bound)</code>: a breadth-first loop that returns the first node satisfying the condition. f3 then only needs the two-children branch of Exercise 3; f4 needs the parent of the node, found by searching its key from the root, to relink after the rotation (Exercise 5). Each function is O(n) because of the breadth-first search.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node left, right;

    Node(Car x) { info = x; left = right = null; }
}

class BSTree {
    Node root;

    void insert(String owner, int price) {           // f1
        Node f = null, p = root;
        while (p != null) { if (p.info.price == price) return; f = p; p = price &lt; p.info.price ? p.left : p.right; }
        Node q = new Node(new Car(owner, price));
        if (f == null) root = q; else if (price &lt; f.info.price) f.left = q; else f.right = q;
    }

    Node firstInBreadth(int kind, int bound) {       // kind 2: two children and price &lt; bound; kind 1: a left child and price &gt; bound
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            if (kind == 2 &amp;&amp; p.left != null &amp;&amp; p.right != null &amp;&amp; p.info.price &lt; bound) return p;
            if (kind == 1 &amp;&amp; p.left != null &amp;&amp; p.info.price &gt; bound) return p;
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
        return null;
    }

    Node parentOf(Node c) { Node f = null, p = root; while (p != c) { f = p; p = c.info.price &lt; p.info.price ? p.left : p.right; } return f; }

    void f3() {                                      // delete by copying the first node (breadth-first) with 2 children and price &lt; 5
        Node p = firstInBreadth(2, 5);
        if (p == null) return;                       // it has two children, so only the copying branch is needed
        Node prev = p, tmp = p.left;
        while (tmp.right != null) { prev = tmp; tmp = tmp.right; }
        p.info = tmp.info;
        if (prev == p) prev.left = tmp.left; else prev.right = tmp.left;
    }

    void f4() {                                      // rotate right the first node (breadth-first) with a left child and price &gt; 5
        Node par = firstInBreadth(1, 5);
        if (par == null) return;
        Node f = parentOf(par), ch = par.left;
        par.left = ch.right;
        ch.right = par;
        if (f == null) root = ch; else if (f.left == par) f.left = ch; else f.right = ch;
    }

    String breadth() {
        StringBuilder s = new StringBuilder();
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s.append(p.info).append(' ');
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
        return s.toString().trim();
    }

    void preRange(Node p, int a, int b, StringBuilder s) {   // f2: preorder, only cars with a &lt;= price &lt;= b
        if (p == null) return;
        if (p.info.price &gt;= a &amp;&amp; p.info.price &lt;= b) s.append(p.info).append(' ');
        preRange(p.left, a, b, s);
        preRange(p.right, a, b, s);
    }

    String in(Node p) { return p == null ? "" : in(p.left) + p.info.price + " " + in(p.right); }
}

public class Pe8MiniPE {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        BSTree t = new BSTree();
        String[] o = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        int[] pr = {5, 3, 8, 1, 4, 7, 9, 2, 6};
        for (int i = 0; i &lt; o.length; i++) t.insert(o[i], pr[i]);
        check("f1 breadth-first", t.breadth(), "(A,5) (B,3) (C,8) (D,1) (E,4) (F,7) (G,9) (H,2) (I,6)");
        StringBuilder s = new StringBuilder();
        t.preRange(t.root, 3, 7, s);
        check("f2 preorder, 3 &lt;= price &lt;= 7", s.toString().trim(), "(A,5) (B,3) (E,4) (F,7) (I,6)");
        t.f3();
        check("f3 copy-delete (B,3): (H,2) moves up", t.breadth(), "(A,5) (H,2) (C,8) (D,1) (E,4) (F,7) (G,9) (I,6)");
        t.f4();
        check("f4 rotate right at (C,8)", t.breadth(), "(A,5) (H,2) (F,7) (D,1) (E,4) (I,6) (C,8) (G,9)");
        check("inorder still sorted", t.in(t.root).trim(), "1 2 4 5 6 7 8 9");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1 breadth-first<br>
PASS f2 preorder, 3 &lt;= price &lt;= 7<br>
PASS f3 copy-delete (B,3): (H,2) moves up<br>
PASS f4 rotate right at (C,8)<br>
PASS inorder still sorted<br>
ALL TESTS PASSED</div>
<div class="pitfall">Read the order the task names: "the first node in breadth-first order" and "the first node in preorder" can be different nodes, and the check is strict. Build f3 and f4 from parts you have already tested (Exercises 3 and 5), and check the inorder at the end: if it is not sorted, a relinking is wrong.</div>`,
    `<h3>🧪 Bài 8 — đề mini: f1–f4 trên cùng một cây (gần mức đề PE thật · ~30 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Lớp <code>BSTree</code> chứa xe và hàm <code>insert</code> đã cho sẵn. <strong>f1</strong>: in cây theo chiều rộng (breadth-first). <strong>f2</strong>: duyệt tiền thứ tự (preorder), chỉ in các xe có 3 ≤ price ≤ 7. <strong>f3</strong>: tìm nút đầu tiên, theo thứ tự duyệt chiều rộng, có hai con và price &lt; 5, rồi xoá nó bằng sao chép (copying). <strong>f4</strong>: tìm nút đầu tiên, theo thứ tự duyệt chiều rộng, có con trái và price &gt; 5, rồi xoay nó sang phải.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>(A,5) (B,3) (C,8) (D,1) (E,4) (F,7) (G,9) (H,2) (I,6):</p>
<table>
<thead><tr><th>Hàm</th><th>Đầu ra (output) mong đợi</th></tr></thead>
<tbody>
<tr><td>f1</td><td>(A,5) (B,3) (C,8) (D,1) (E,4) (F,7) (G,9) (H,2) (I,6)</td></tr>
<tr><td>f2</td><td>(A,5) (B,3) (E,4) (F,7) (I,6)</td></tr>
<tr><td>f3 — xoá (B,3); nút liền trước (H,2) được đưa lên</td><td>(A,5) (H,2) (C,8) (D,1) (E,4) (F,7) (G,9) (I,6)</td></tr>
<tr><td>f4 — xoay phải (C,8); (F,7) thế chỗ nó</td><td>(A,5) (H,2) (F,7) (D,1) (E,4) (I,6) (C,8) (G,9)</td></tr>
</tbody>
</table>
<p class="nhan">Ý tưởng</p>
<p>một hàm phụ <code>firstInBreadth(kind, bound)</code>: vòng duyệt theo chiều rộng trả về nút đầu tiên thoả điều kiện. Khi đó f3 chỉ cần nhánh hai con của Bài 3; f4 cần nút cha của nút đó, tìm bằng cách dò khoá từ gốc, để nối lại sau phép xoay (Bài 5). Mỗi hàm là O(n) vì phải duyệt theo chiều rộng.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node left, right;

    Node(Car x) { info = x; left = right = null; }
}

class BSTree {
    Node root;

    void insert(String owner, int price) {           // f1
        Node f = null, p = root;
        while (p != null) { if (p.info.price == price) return; f = p; p = price &lt; p.info.price ? p.left : p.right; }
        Node q = new Node(new Car(owner, price));
        if (f == null) root = q; else if (price &lt; f.info.price) f.left = q; else f.right = q;
    }

    Node firstInBreadth(int kind, int bound) {       // kind 2: hai con và price &lt; bound; kind 1: có con trái và price &gt; bound
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            if (kind == 2 &amp;&amp; p.left != null &amp;&amp; p.right != null &amp;&amp; p.info.price &lt; bound) return p;
            if (kind == 1 &amp;&amp; p.left != null &amp;&amp; p.info.price &gt; bound) return p;
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
        return null;
    }

    Node parentOf(Node c) { Node f = null, p = root; while (p != c) { f = p; p = c.info.price &lt; p.info.price ? p.left : p.right; } return f; }

    void f3() {                                      // xoá bằng sao chép nút đầu tiên (theo chiều rộng) có 2 con và price &lt; 5
        Node p = firstInBreadth(2, 5);
        if (p == null) return;                       // nó có hai con nên chỉ cần nhánh sao chép
        Node prev = p, tmp = p.left;
        while (tmp.right != null) { prev = tmp; tmp = tmp.right; }
        p.info = tmp.info;
        if (prev == p) prev.left = tmp.left; else prev.right = tmp.left;
    }

    void f4() {                                      // xoay phải nút đầu tiên (theo chiều rộng) có con trái và price &gt; 5
        Node par = firstInBreadth(1, 5);
        if (par == null) return;
        Node f = parentOf(par), ch = par.left;
        par.left = ch.right;
        ch.right = par;
        if (f == null) root = ch; else if (f.left == par) f.left = ch; else f.right = ch;
    }

    String breadth() {
        StringBuilder s = new StringBuilder();
        ArrayDeque&lt;Node&gt; q = new ArrayDeque&lt;Node&gt;();
        if (root != null) q.add(root);
        while (!q.isEmpty()) {
            Node p = q.poll();
            s.append(p.info).append(' ');
            if (p.left != null) q.add(p.left);
            if (p.right != null) q.add(p.right);
        }
        return s.toString().trim();
    }

    void preRange(Node p, int a, int b, StringBuilder s) {   // f2: tiền thứ tự, chỉ in xe có a &lt;= price &lt;= b
        if (p == null) return;
        if (p.info.price &gt;= a &amp;&amp; p.info.price &lt;= b) s.append(p.info).append(' ');
        preRange(p.left, a, b, s);
        preRange(p.right, a, b, s);
    }

    String in(Node p) { return p == null ? "" : in(p.left) + p.info.price + " " + in(p.right); }
}

public class Pe8MiniPE {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        BSTree t = new BSTree();
        String[] o = {"A", "B", "C", "D", "E", "F", "G", "H", "I"};
        int[] pr = {5, 3, 8, 1, 4, 7, 9, 2, 6};
        for (int i = 0; i &lt; o.length; i++) t.insert(o[i], pr[i]);
        check("f1 breadth-first", t.breadth(), "(A,5) (B,3) (C,8) (D,1) (E,4) (F,7) (G,9) (H,2) (I,6)");
        StringBuilder s = new StringBuilder();
        t.preRange(t.root, 3, 7, s);
        check("f2 preorder, 3 &lt;= price &lt;= 7", s.toString().trim(), "(A,5) (B,3) (E,4) (F,7) (I,6)");
        t.f3();
        check("f3 copy-delete (B,3): (H,2) moves up", t.breadth(), "(A,5) (H,2) (C,8) (D,1) (E,4) (F,7) (G,9) (I,6)");
        t.f4();
        check("f4 rotate right at (C,8)", t.breadth(), "(A,5) (H,2) (F,7) (D,1) (E,4) (I,6) (C,8) (G,9)");
        check("inorder still sorted", t.in(t.root).trim(), "1 2 4 5 6 7 8 9");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1 breadth-first<br>
PASS f2 preorder, 3 &lt;= price &lt;= 7<br>
PASS f3 copy-delete (B,3): (H,2) moves up<br>
PASS f4 rotate right at (C,8)<br>
PASS inorder still sorted<br>
ALL TESTS PASSED</div>
<div class="pitfall">Đọc kỹ thứ tự mà đề nêu: "nút đầu tiên theo chiều rộng" và "nút đầu tiên theo tiền thứ tự" có thể là hai nút khác nhau, và bài chấm so khớp tuyệt đối. Ghép f3 và f4 từ những phần đã kiểm ở Bài 3 và Bài 5, và cuối cùng kiểm trung thứ tự (inorder): nếu không còn tăng dần thì có một chỗ nối liên kết bị sai.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>tree</strong></td><td>cây</td><td>A hierarchy of nodes in which every node except the root has exactly one parent.</td></tr>
<tr><td><strong>root</strong></td><td>gốc</td><td>The only node without a parent.</td></tr>
<tr><td><strong>leaf (external node)</strong></td><td>lá (nút ngoài)</td><td>A node with no children.</td></tr>
<tr><td><strong>internal node</strong></td><td>nút trong</td><td>A node with at least one child.</td></tr>
<tr><td><strong>ancestor / descendant</strong></td><td>tổ tiên / con cháu</td><td>Nodes on the path up to the root / all nodes below a node.</td></tr>
<tr><td><strong>subtree</strong></td><td>cây con</td><td>A node together with all its descendants.</td></tr>
<tr><td><strong>level (depth)</strong></td><td>mức (độ sâu)</td><td>The slides give the root level 1; the textbook gives it depth 0.</td></tr>
<tr><td><strong>height</strong></td><td>chiều cao</td><td>The slides count the nodes on the longest root-to-leaf path (one node = 1); the textbook counts edges (one node = 0).</td></tr>
<tr><td><strong>degree of a node</strong></td><td>bậc của nút</td><td>The number of its non-empty children.</td></tr>
<tr><td><strong>path length</strong></td><td>độ dài đường đi</td><td>The number of arcs (edges) on a path, not the number of nodes.</td></tr>
<tr><td><strong>binary tree</strong></td><td>cây nhị phân</td><td>Every node has at most two children, each designated left or right.</td></tr>
<tr><td><strong>proper (full) binary tree</strong></td><td>cây nhị phân proper (đủ hai con)</td><td>Every internal node has exactly two children; then leaves = internal nodes + 1.</td></tr>
<tr><td><strong>complete / nearly complete</strong></td><td>đầy đủ / gần đầy đủ</td><td>Deck 4A: every level full (many books say perfect); heap shape: all levels full except the last, filled from the left.</td></tr>
<tr><td><strong>traversal</strong></td><td>phép duyệt</td><td>Visiting every node exactly once.</td></tr>
<tr><td><strong>preorder / inorder / postorder</strong></td><td>tiền / trung / hậu thứ tự</td><td>NLR / LNR / LRN: the node before, between or after its left and right subtrees.</td></tr>
<tr><td><strong>breadth-first (level-order) traversal</strong></td><td>duyệt theo chiều rộng (theo mức)</td><td>Level by level with a queue.</td></tr>
<tr><td><strong>expression tree / Polish notation</strong></td><td>cây biểu thức / ký pháp Ba Lan</td><td>Operators inside, operands on leaves; preorder gives prefix (Polish) form, postorder the postfix form.</td></tr>
<tr><td><strong>binary search tree (BST)</strong></td><td>cây nhị phân tìm kiếm</td><td>Left subtree keys &lt; node key &lt; right subtree keys, at every node; the inorder is sorted.</td></tr>
<tr><td><strong>predecessor / successor</strong></td><td>khoá liền trước / liền sau</td><td>The rightmost node of the left subtree / the leftmost node of the right subtree.</td></tr>
<tr><td><strong>deletion by merging</strong></td><td>xoá bằng hợp nhất</td><td>The right subtree hangs below the rightmost node of the left subtree; the height may grow or shrink.</td></tr>
<tr><td><strong>deletion by copying</strong></td><td>xoá bằng sao chép</td><td>Copy the predecessor's data into the node, then delete the predecessor; the height never grows.</td></tr>
<tr><td><strong>degenerate tree</strong></td><td>cây suy biến</td><td>A "stick" in which every node has one child, e.g. after inserting sorted keys; height n.</td></tr>
<tr><td><strong>height-balanced / perfectly balanced</strong></td><td>cân bằng theo chiều cao / cân bằng hoàn hảo</td><td>Children's heights differ by at most 1 at every node / plus all leaves on one or two levels.</td></tr>
<tr><td><strong>rotation (left / right)</strong></td><td>phép xoay (trái / phải)</td><td>An O(1) relinking that lifts a child above its parent without changing the inorder.</td></tr>
<tr><td><strong>AVL tree / balance factor</strong></td><td>cây AVL / hệ số cân bằng</td><td>A height-balanced BST; on the slides the balance factor is height(right) − height(left) and must stay in {−1, 0, 1}.</td></tr>
<tr><td><strong>heap / priority queue</strong></td><td>đống / hàng đợi ưu tiên</td><td>A nearly complete binary tree with father ≥ children (max-heap), stored in an array; it serves the largest key first.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>tree</strong></td><td>cây</td><td>Hệ phân cấp các nút, trong đó mọi nút trừ gốc có đúng một cha.</td></tr>
<tr><td><strong>root</strong></td><td>gốc</td><td>Nút duy nhất không có cha.</td></tr>
<tr><td><strong>leaf (external node)</strong></td><td>lá (nút ngoài)</td><td>Nút không có con nào.</td></tr>
<tr><td><strong>internal node</strong></td><td>nút trong</td><td>Nút có ít nhất một con.</td></tr>
<tr><td><strong>ancestor / descendant</strong></td><td>tổ tiên / con cháu</td><td>Các nút trên đường đi lên gốc / mọi nút nằm bên dưới một nút.</td></tr>
<tr><td><strong>subtree</strong></td><td>cây con</td><td>Một nút cùng toàn bộ con cháu của nó.</td></tr>
<tr><td><strong>level (depth)</strong></td><td>mức (độ sâu)</td><td>Slide cho gốc ở mức 1; sách cho gốc độ sâu 0.</td></tr>
<tr><td><strong>height</strong></td><td>chiều cao</td><td>Slide đếm số nút trên đường dài nhất từ gốc xuống lá (một nút = 1); sách đếm số cạnh (một nút = 0).</td></tr>
<tr><td><strong>degree of a node</strong></td><td>bậc của nút</td><td>Số con khác rỗng của nút.</td></tr>
<tr><td><strong>path length</strong></td><td>độ dài đường đi</td><td>Số cạnh trên đường đi, không phải số nút.</td></tr>
<tr><td><strong>binary tree</strong></td><td>cây nhị phân</td><td>Mỗi nút có nhiều nhất hai con, mỗi con được chỉ định là trái hoặc phải.</td></tr>
<tr><td><strong>proper (full) binary tree</strong></td><td>cây nhị phân proper (đủ hai con)</td><td>Mọi nút trong có đúng hai con; khi đó số lá = số nút trong + 1.</td></tr>
<tr><td><strong>complete / nearly complete</strong></td><td>đầy đủ / gần đầy đủ</td><td>Bộ 4A: mọi mức đều đầy (nhiều sách gọi là perfect); hình dạng heap: mọi mức đầy trừ mức cuối, lấp từ trái sang.</td></tr>
<tr><td><strong>traversal</strong></td><td>phép duyệt</td><td>Thăm mỗi nút đúng một lần.</td></tr>
<tr><td><strong>preorder / inorder / postorder</strong></td><td>tiền / trung / hậu thứ tự</td><td>NLR / LNR / LRN: thăm nút trước, giữa hay sau hai cây con trái và phải.</td></tr>
<tr><td><strong>breadth-first (level-order) traversal</strong></td><td>duyệt theo chiều rộng (theo mức)</td><td>Lần lượt từng mức, dùng hàng đợi.</td></tr>
<tr><td><strong>expression tree / Polish notation</strong></td><td>cây biểu thức / ký pháp Ba Lan</td><td>Toán tử ở nút trong, toán hạng ở lá; tiền thứ tự cho dạng tiền tố (Ba Lan), hậu thứ tự cho dạng hậu tố.</td></tr>
<tr><td><strong>binary search tree (BST)</strong></td><td>cây nhị phân tìm kiếm</td><td>Khoá cây con trái &lt; khoá của nút &lt; khoá cây con phải, tại mọi nút; duyệt trung thứ tự ra dãy tăng.</td></tr>
<tr><td><strong>predecessor / successor</strong></td><td>khoá liền trước / liền sau</td><td>Nút phải nhất của cây con trái / nút trái nhất của cây con phải.</td></tr>
<tr><td><strong>deletion by merging</strong></td><td>xoá bằng hợp nhất</td><td>Cây con phải treo dưới nút phải nhất của cây con trái; chiều cao có thể tăng hoặc giảm.</td></tr>
<tr><td><strong>deletion by copying</strong></td><td>xoá bằng sao chép</td><td>Chép dữ liệu của nút liền trước vào nút cần xoá, rồi xoá nút liền trước; chiều cao không bao giờ tăng.</td></tr>
<tr><td><strong>degenerate tree</strong></td><td>cây suy biến</td><td>Cây hình "que", mỗi nút một con, ví dụ sau khi chèn khoá đã sắp xếp; cao n.</td></tr>
<tr><td><strong>height-balanced / perfectly balanced</strong></td><td>cân bằng theo chiều cao / cân bằng hoàn hảo</td><td>Chiều cao hai con lệch nhau tối đa 1 tại mọi nút / thêm vào đó mọi lá nằm trên một hoặc hai mức.</td></tr>
<tr><td><strong>rotation (left / right)</strong></td><td>phép xoay (trái / phải)</td><td>Phép nối lại O(1) đưa một con lên trên cha của nó mà không đổi thứ tự trung thứ tự.</td></tr>
<tr><td><strong>AVL tree / balance factor</strong></td><td>cây AVL / hệ số cân bằng</td><td>BST cân bằng theo chiều cao; theo slide, hệ số cân bằng là chiều cao(phải) − chiều cao(trái) và phải nằm trong {−1, 0, 1}.</td></tr>
<tr><td><strong>heap / priority queue</strong></td><td>đống / hàng đợi ưu tiên</td><td>Cây nhị phân gần đầy đủ có cha ≥ con (max-heap), lưu trong mảng; nó phục vụ khoá lớn nhất trước.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 4</h2>
<ol>
<li><strong>Two conventions</strong>: the slides put the root on level 1 and give a one-node tree height 1; the textbook starts both at 0. Every "height" or "level" answer depends on which one the question uses.</li>
<li><strong>Traversals</strong> visit each node once, O(n): preorder (node first — print a document), postorder (node last — folder sizes, evaluating an expression), breadth-first (a queue), inorder (binary trees; sorted on a BST). Inorder + preorder (or postorder) rebuild a binary tree; preorder + postorder do not.</li>
<li><strong>Binary tree shapes</strong>: at most two children; proper = 0 or 2 children; the slide's "complete" = every level full (perfect); a heap is "nearly complete" — last level filled from the left.</li>
<li><strong>BST</strong>: left subtree &lt; node &lt; right subtree for whole subtrees. Search, insertion (the new key becomes a leaf, duplicates are rejected) and deletion all walk one path: O(h), with log₂(n + 1) ≤ h ≤ n.</li>
<li><strong>Deletion</strong>: leaf → the parent's link becomes null; one child → the parent adopts it; two children → merging (the height may grow or shrink) or copying the predecessor (the height never grows; mind the case prev == p).</li>
<li><strong>Balancing</strong>: sorted input makes a stick (O(n) per operation). Fixes: rebuild from the sorted array by inserting middles; rotations (O(1), the inorder is unchanged); the AVL tree keeps |height(right) − height(left)| ≤ 1 everywhere — after an insertion at most one single or double rotation, after a deletion possibly rotations all the way up to the root.</li>
<li><strong>Heap</strong>: father ≥ children in a nearly complete tree, stored level by level in an array (father (i − 1)/2, children 2i + 1, 2i + 2). Enqueue and dequeue are O(log n), the maximum is a[0]; building is O(n log n) top-down or O(n) bottom-up; heap sort is O(n log n) and in place.</li>
<li><strong>Expression trees</strong>: operators inside, operands on leaves; preorder = prefix (Polish) notation, postorder = postfix, evaluated with a stack.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>In Exercise 3, which car is at the root after deleting 50 by copying, and why that one?</li>
<li>Why is the tree built by <code>rebalance()</code> in Exercise 6 always an AVL tree?</li>
<li>What is the balance factor of 30 in the tree 50(30(20, –), 70), using the slides' definition?</li>
<li>Why can the same array give two different heaps in Exercise 7?</li>
<li>Which data structure does "the first node in breadth-first order that …" (Exercise 8) need?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) (I,45) — the largest key in the left subtree, i.e. its rightmost node; it is larger than everything left of 50 and smaller than everything right of it. (2) Each middle element splits its part into halves whose sizes differ by at most one, at every node — so the heights of any two sibling subtrees differ by at most one. (3) −1: height(right) = 0, height(left) = 1. (4) Top-down and bottom-up move the elements in a different order; a heap only requires father ≥ children, so both results are valid. (5) A queue.</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Operation</th><th>BST, balanced / degenerate</th><th>AVL tree</th><th>Heap (array)</th></tr></thead>
<tbody>
<tr><td>Search a key</td><td>O(log n) / O(n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>Insert</td><td>O(log n) / O(n)</td><td>O(log n) + at most one single or double rotation</td><td>O(log n) — climb up</td></tr>
<tr><td>Delete a key / dequeue the maximum</td><td>O(log n) / O(n)</td><td>O(log n), rotations possibly up to the root</td><td>O(log n) — sift down</td></tr>
<tr><td>Find the maximum</td><td>O(log n) / O(n) — rightmost node</td><td>O(log n)</td><td>O(1) — a[0]</td></tr>
<tr><td>Traverse all n nodes</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Build from n keys</td><td>O(n log n) / O(n²) (sorted input)</td><td>O(n log n)</td><td>O(n) bottom-up · O(n log n) top-down</td></tr>
<tr><td>One rotation</td><td>O(1)</td><td>O(1)</td><td>—</td></tr>
<tr><td>Sort</td><td>inorder O(n) once built</td><td>inorder O(n)</td><td>heap sort O(n log n), in place</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 4</h2>
<ol>
<li><strong>Hai quy ước</strong>: slide đặt gốc ở mức (level) 1 và cho cây một nút cao (height) 1; sách bắt đầu cả hai từ 0. Mọi đáp án về "chiều cao" hay "mức" đều phụ thuộc đề dùng quy ước nào.</li>
<li><strong>Các phép duyệt (traversal)</strong> thăm mỗi nút một lần, O(n): tiền thứ tự (preorder — nút trước, dùng in tài liệu), hậu thứ tự (postorder — nút sau cùng, dùng tính dung lượng thư mục, tính giá trị biểu thức), theo chiều rộng (breadth-first — dùng hàng đợi), trung thứ tự (inorder — cho cây nhị phân; trên BST ra dãy tăng). Inorder + preorder (hoặc postorder) dựng lại được cây nhị phân; preorder + postorder thì không.</li>
<li><strong>Hình dạng cây nhị phân</strong>: tối đa hai con; proper (cây đủ hai con) = mỗi nút 0 hoặc 2 con; "complete" của slide = mọi mức đều đầy (perfect — hoàn hảo); heap là "nearly complete" (gần đầy đủ) — mức cuối lấp từ trái.</li>
<li><strong>BST (cây nhị phân tìm kiếm)</strong>: cây con trái &lt; nút &lt; cây con phải, cho cả cây con. Tìm kiếm, chèn (khoá mới thành lá, khoá trùng bị từ chối) và xoá đều đi một con đường: O(h), với log₂(n + 1) ≤ h ≤ n.</li>
<li><strong>Xoá</strong>: lá → liên kết của cha thành null; một con → cha nhận đứa con đó; hai con → hợp nhất (merging — chiều cao có thể tăng hoặc giảm) hoặc chép khoá liền trước (copying — chiều cao không bao giờ tăng; nhớ trường hợp prev == p).</li>
<li><strong>Cân bằng</strong>: dữ liệu vào đã sắp xếp tạo ra cây "que" (O(n) mỗi thao tác). Cách chữa: dựng lại từ mảng đã sắp bằng cách chèn phần tử giữa; phép xoay (rotation — O(1), thứ tự trung thứ tự không đổi); cây AVL giữ |chiều cao(phải) − chiều cao(trái)| ≤ 1 ở mọi nút — sau khi chèn chỉ cần tối đa một lần xoay đơn hoặc xoay kép (single / double rotation), sau khi xoá có thể phải xoay ngược lên tới tận gốc.</li>
<li><strong>Đống (heap)</strong>: cha ≥ các con trên một cây gần đầy đủ, lưu theo từng mức trong mảng (cha (i − 1)/2, con 2i + 1, 2i + 2). Thêm vào và lấy ra là O(log n), phần tử lớn nhất là a[0]; dựng heap tốn O(n log n) theo cách từ trên xuống hoặc O(n) theo cách từ dưới lên; sắp xếp vun đống (heap sort) là O(n log n) và tại chỗ.</li>
<li><strong>Cây biểu thức (expression tree)</strong>: toán tử ở nút trong, toán hạng ở lá; tiền thứ tự = ký pháp tiền tố (Ba Lan — Polish notation), hậu thứ tự = dạng hậu tố (postfix), tính bằng một ngăn xếp (stack).</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm bài trắc nghiệm (quiz)</h3>
<ol>
<li>Ở Bài 3, sau khi xoá 50 bằng sao chép thì xe nào nằm ở gốc, và vì sao lại là xe đó?</li>
<li>Vì sao cây do <code>rebalance()</code> ở Bài 6 dựng ra luôn là cây AVL?</li>
<li>Hệ số cân bằng (balance factor) của 30 trong cây 50(30(20, –), 70) là bao nhiêu, theo định nghĩa của slide?</li>
<li>Vì sao cùng một mảng lại cho ra hai heap khác nhau ở Bài 7?</li>
<li>"Nút đầu tiên theo thứ tự duyệt chiều rộng mà …" (Bài 8) cần cấu trúc dữ liệu nào?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) (I,45) — khoá lớn nhất của cây con trái, tức nút phải nhất của nó; nó lớn hơn mọi thứ bên trái 50 và nhỏ hơn mọi thứ bên phải. (2) Mỗi phần tử ở giữa chia đoạn của nó thành hai nửa có kích thước lệch nhau tối đa một, tại mọi nút — nên chiều cao hai cây con anh em lệch nhau tối đa một. (3) −1: chiều cao(phải) = 0, chiều cao(trái) = 1. (4) Cách từ trên xuống và cách từ dưới lên dời các phần tử theo thứ tự khác nhau; heap chỉ đòi cha ≥ con, nên cả hai kết quả đều hợp lệ. (5) Hàng đợi (queue).</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Thao tác</th><th>BST, cân bằng / suy biến</th><th>Cây AVL</th><th>Heap (mảng)</th></tr></thead>
<tbody>
<tr><td>Tìm một khoá</td><td>O(log n) / O(n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>Chèn</td><td>O(log n) / O(n)</td><td>O(log n) + tối đa một lần xoay đơn hoặc kép</td><td>O(log n) — leo lên</td></tr>
<tr><td>Xoá một khoá / lấy ra phần tử lớn nhất</td><td>O(log n) / O(n)</td><td>O(log n), có thể xoay ngược lên tới gốc</td><td>O(log n) — đẩy xuống</td></tr>
<tr><td>Tìm phần tử lớn nhất</td><td>O(log n) / O(n) — nút phải nhất</td><td>O(log n)</td><td>O(1) — a[0]</td></tr>
<tr><td>Duyệt cả n nút</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Dựng từ n khoá</td><td>O(n log n) / O(n²) (dữ liệu đã sắp)</td><td>O(n log n)</td><td>O(n) từ dưới lên · O(n log n) từ trên xuống</td></tr>
<tr><td>Một phép xoay</td><td>O(1)</td><td>O(1)</td><td>—</td></tr>
<tr><td>Sắp xếp</td><td>trung thứ tự O(n) khi đã dựng xong</td><td>trung thứ tự O(n)</td><td>heap sort O(n log n), tại chỗ</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (csd201-quiz-ch4) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'The keys 50, 30, 70, 20, 40, 60, 80 are inserted in this order into an empty BST. What is its preorder traversal?|||Các khoá 50, 30, 70, 20, 40, 60, 80 được chèn theo thứ tự đó vào một BST rỗng. Phép duyệt tiền tự (preorder) của cây là gì?',
      options: ['20 30 40 50 60 70 80|||20 30 40 50 60 70 80', '50 30 20 40 70 60 80|||50 30 20 40 70 60 80', '20 40 30 60 80 70 50|||20 40 30 60 80 70 50', '50 30 70 20 40 60 80|||50 30 70 20 40 60 80'],
      correctIndex: 1,
      points: 1,
      explanation: 'The tree is 50 with children 30 and 70; 30 has 20 and 40; 70 has 60 and 80. Preorder visits node, left subtree, right subtree: 50, then 30 20 40, then 70 60 80. Option D is the level-order (breadth-first) listing, A the inorder (always sorted for a BST) and C the postorder.|||Cây là 50 với hai con 30 và 70; 30 có 20 và 40; 70 có 60 và 80. Tiền tự thăm nút, rồi cây con trái, rồi cây con phải: 50, rồi 30 20 40, rồi 70 60 80. Phương án D là thứ tự theo mức (duyệt theo chiều rộng), A là trung tự (với BST luôn tăng dần), C là hậu tự.' },
    { id: 'q2',
      question: 'A BST is built by inserting 1, 2, 3, …, n in increasing order. What is the worst-case cost of a search in it?|||Một BST được dựng bằng cách chèn 1, 2, 3, …, n theo thứ tự tăng dần. Chi phí tìm kiếm trong trường hợp xấu nhất là bao nhiêu?',
      options: ['O(log n)|||O(log n)', 'O(1)|||O(1)', 'O(n)|||O(n)', 'O(n log n)|||O(n log n)'],
      correctIndex: 2,
      points: 1,
      explanation: 'Every new key is larger than all keys already in the tree, so it always goes to the right: the tree degenerates into a chain of height n and searching for n walks through every node. O(log n) is the tempting answer, but it holds only for a balanced tree — that is exactly why slides 3–6 of 4B-Trees2 balance the tree and why AVL trees exist.|||Mỗi khoá mới đều lớn hơn mọi khoá đã có nên luôn rẽ phải: cây suy biến thành một dây xích cao n, và tìm khoá n phải đi qua mọi nút. O(log n) là đáp án dễ nhầm, nhưng nó chỉ đúng với cây cân bằng — chính vì vậy slide 3–6 của 4B-Trees2 mới cân bằng cây và cây AVL mới ra đời.' },
    { id: 'q3',
      question: 'In the BST built from 50, 30, 70, 20, 40, 60, 80, the root 50 is deleted BY COPYING, replacing its key with the immediate predecessor (slide 31 of 4A-Trees1). What is the preorder traversal afterwards?|||Trong BST dựng từ 50, 30, 70, 20, 40, 60, 80, gốc 50 bị xoá BẰNG SAO CHÉP (deleteByCopying), thay khoá bằng phần tử đứng ngay trước (predecessor) như slide 31 của 4A-Trees1. Phép duyệt tiền tự sau đó là gì?',
      options: ['40 30 20 70 60 80|||40 30 20 70 60 80', '60 30 20 40 70 80|||60 30 20 40 70 80', '30 20 40 70 60 80|||30 20 40 70 60 80', '40 20 30 70 60 80|||40 20 30 70 60 80'],
      correctIndex: 0,
      points: 1,
      explanation: "The predecessor is the rightmost node of the left subtree: 40. Its key is copied into the root and the old leaf 40 is removed, so the root is 40 with left child 30 (which keeps 20) and the right subtree unchanged. B is what you get with the successor (60), the rule some other books use; C is the result of deleteByMerging, where 70's subtree is hung under 40 and 30 becomes the root.|||Phần tử đứng trước là nút phải nhất của cây con trái: 40. Khoá của nó được chép lên gốc và lá 40 cũ bị gỡ, nên gốc là 40 với con trái 30 (vẫn giữ 20) và cây con phải không đổi. B là kết quả khi dùng phần tử đứng sau (successor, 60) — quy tắc của một số sách khác; C là kết quả của deleteByMerging, khi cây con 70 được treo dưới 40 và 30 lên làm gốc." },
    { id: 'q4',
      question: 'A binary tree has preorder A B D E C F and inorder D B E A F C (the example on slide 17 of 4A-Trees1). What is its postorder?|||Một cây nhị phân có tiền tự A B D E C F và trung tự D B E A F C (ví dụ ở slide 17 của 4A-Trees1). Hậu tự của nó là gì?',
      options: ['D B E F C A|||D B E F C A', 'E D B F C A|||E D B F C A', 'D E B C F A|||D E B C F A', 'D E B F C A|||D E B F C A'],
      correctIndex: 3,
      points: 1,
      explanation: 'The first preorder letter, A, is the root; in the inorder it splits D B E (left) from F C (right). On the left, B is the root with children D and E. On the right, C comes first in preorder so it is the root, and F — before C in the inorder — is its LEFT child. Postorder is left, right, node: D E B, then F C, then A. Option C puts C before F, which would make F the parent — the usual slip when the side of F is guessed instead of read from the inorder.|||Chữ đầu của tiền tự, A, là gốc; trong trung tự nó tách D B E (bên trái) với F C (bên phải). Bên trái, B là gốc với hai con D và E. Bên phải, C xuất hiện trước trong tiền tự nên là gốc, còn F — đứng trước C trong trung tự — là con TRÁI của nó. Hậu tự là trái, phải, nút: D E B, rồi F C, rồi A. Phương án C đặt C trước F, tức coi F là cha — lỗi hay gặp khi đoán phía của F thay vì đọc từ trung tự.' },
    { id: 'q5',
      question: "With the slides' definition (the root is on level 1, so a single node has height 1), what is the height of the BST built by inserting 50, 30, 70, 20, 40, 60, 80, 10?|||Theo định nghĩa của slide (gốc ở mức 1, nên cây một nút có chiều cao 1), BST dựng bằng cách chèn 50, 30, 70, 20, 40, 60, 80, 10 có chiều cao bao nhiêu?",
      options: ['3|||3', '4|||4', '5|||5', '8|||8'],
      correctIndex: 1,
      points: 1,
      explanation: 'The longest root-to-leaf path is 50 → 30 → 20 → 10: four nodes, so the height is 4 when a lone node counts as 1 (slide 4 of 4A-Trees1). The textbook counts edges instead (a lone node has height 0), which gives 3 — the tempting option A. Always check which definition the question uses.|||Đường dài nhất từ gốc tới lá là 50 → 30 → 20 → 10: bốn nút, nên chiều cao là 4 khi một nút đơn tính là 1 (slide 4 của 4A-Trees1). Sách giáo trình lại đếm cạnh (một nút có chiều cao 0), sẽ ra 3 — chính phương án A dễ nhầm. Luôn kiểm đề dùng định nghĩa nào.' },
    { id: 'q6',
      question: 'The keys 10, 20, 30 are inserted in this order into an empty AVL tree. What does the tree look like afterwards?|||Các khoá 10, 20, 30 được chèn theo thứ tự đó vào một cây AVL rỗng. Sau đó cây trông thế nào?',
      options: ['20, with children 10 and 30|||20, với hai con 10 và 30', '10 at the root, 20 to its right, 30 below 20|||10 ở gốc, 20 bên phải, 30 dưới 20', '30 at the root, 20 to its left, 10 below 20|||30 ở gốc, 20 bên trái, 10 dưới 20', '10, with children 20 and 30|||10, với hai con 20 và 30'],
      correctIndex: 0,
      points: 1,
      explanation: 'After 30 is inserted, node 10 has balance factor +2 (right height − left height, slide 10 of 4B-Trees2) and its child 20 has +1: same sign, so one single LEFT rotation at 10 makes 20 the root with 10 and 30 below. Option B is the plain BST before rebalancing — a chain; D is not even a BST.|||Sau khi chèn 30, nút 10 có hệ số cân bằng +2 (chiều cao phải − chiều cao trái, slide 10 của 4B-Trees2) và con 20 có +1: cùng dấu, nên một phép xoay TRÁI đơn tại 10 đưa 20 lên gốc với 10 và 30 bên dưới. Phương án B là BST thường chưa cân bằng — một dây xích; D thậm chí không phải BST.' },
    { id: 'q7',
      question: 'The keys 30, 10, 20 are inserted in this order into an empty AVL tree. Which rebalancing happens after 20 is inserted?|||Các khoá 30, 10, 20 được chèn theo thứ tự đó vào một cây AVL rỗng. Sau khi chèn 20, cây được cân bằng lại thế nào?',
      options: ['A single right rotation at 30|||Một phép xoay phải đơn tại 30', 'A single left rotation at 10|||Một phép xoay trái đơn tại 10', 'A double rotation: left at 10, then right at 30|||Xoay kép: trái tại 10, rồi phải tại 30', 'No rotation: the tree is already balanced|||Không xoay: cây đã cân bằng'],
      correctIndex: 2,
      points: 1,
      explanation: '30 has balance factor −2 (left-heavy) while its left child 10 has +1: the signs differ, so slide 11 prescribes a double rotation — first rotate the child 10 to the left, then rotate 30 to the right — giving 20 at the root with 10 and 30. A single right rotation at 30 (option A) would make 10 the root with 30 on its right and 20 under 30: still unbalanced, just mirrored.|||30 có hệ số cân bằng −2 (lệch trái) trong khi con trái 10 có +1: khác dấu, nên slide 11 yêu cầu xoay kép — xoay con 10 sang trái trước, rồi xoay 30 sang phải — được 20 ở gốc với 10 và 30. Chỉ xoay phải đơn tại 30 (phương án A) sẽ đưa 10 lên gốc, 30 bên phải và 20 dưới 30: vẫn mất cân bằng, chỉ là lệch sang phía kia.' },
    { id: 'q8',
      question: 'In the max-heap stored as the array [25, 13, 17, 5, 8, 3] (slide 16 of 4B-Trees2), which elements are the children of 13?|||Trong max-heap lưu bằng mảng [25, 13, 17, 5, 8, 3] (slide 16 của 4B-Trees2), các con của phần tử 13 là những phần tử nào?',
      options: ['17 and 5|||17 và 5', '25 and 17|||25 và 17', '8 and 3|||8 và 3', '5 and 8|||5 và 8'],
      correctIndex: 3,
      points: 1,
      explanation: '13 sits at index 1, so LEFT(1) = 2·1 + 1 = 3 and RIGHT(1) = 2·(1 + 1) = 4: the elements 5 and 8. 17 and 5 are merely its neighbours in the array — a heap is read level by level, not left to right as a list. 25 is its parent: PARENT(1) = ⌊(1 − 1)/2⌋ = 0.|||13 nằm ở chỉ số 1, nên LEFT(1) = 2·1 + 1 = 3 và RIGHT(1) = 2·(1 + 1) = 4: hai phần tử 5 và 8. 17 và 5 chỉ là hàng xóm của nó trong mảng — heap được đọc theo từng mức, không phải như một danh sách trái sang phải. 25 là cha của nó: PARENT(1) = ⌊(1 − 1)/2⌋ = 0.' },
    { id: 'q9',
      question: '20 is inserted into the max-heap [25, 13, 17, 5, 8, 3] (placed at the end, then sifted up). What is the array afterwards?|||Chèn 20 vào max-heap [25, 13, 17, 5, 8, 3] (đặt ở cuối rồi đẩy lên — sift-up). Mảng sau đó là gì?',
      options: ['[25, 13, 17, 5, 8, 3, 20]|||[25, 13, 17, 5, 8, 3, 20]', '[25, 13, 20, 5, 8, 3, 17]|||[25, 13, 20, 5, 8, 3, 17]', '[25, 20, 17, 5, 8, 3, 13]|||[25, 20, 17, 5, 8, 3, 13]', '[20, 13, 25, 5, 8, 3, 17]|||[20, 13, 25, 5, 8, 3, 17]'],
      correctIndex: 1,
      points: 1,
      explanation: '20 lands at index 6; its parent is index (6 − 1)/2 = 2, holding 17 < 20, so they swap; the next parent is index 0 holding 25 > 20, so it stops. Option C compares with the wrong parent (index 1 is the parent of indexes 3 and 4 only); A forgets the sift-up and leaves 20 below the smaller 17.|||20 rơi vào chỉ số 6; cha của nó ở chỉ số (6 − 1)/2 = 2, giữ 17 < 20, nên đổi chỗ; cha tiếp theo ở chỉ số 0 giữ 25 > 20, nên dừng. Phương án C so với nhầm cha (chỉ số 1 chỉ là cha của chỉ số 3 và 4); A quên bước đẩy lên, để 20 nằm dưới 17 nhỏ hơn.' },
    { id: 'q10',
      question: 'The array [2, 8, 6, 1, 10, 15, 3, 12, 11] of slides 24–26 (4B-Trees2) is turned into a max-heap with the BOTTOM-UP method (sift down from the last internal node back to the root). What is the result?|||Mảng [2, 8, 6, 1, 10, 15, 3, 12, 11] ở slide 24–26 (4B-Trees2) được biến thành max-heap bằng phương pháp TỪ DƯỚI LÊN (bottom-up: đẩy xuống từ nút trong cuối cùng ngược về gốc). Kết quả là gì?',
      options: ['[15, 12, 10, 11, 2, 6, 3, 1, 8]|||[15, 12, 10, 11, 2, 6, 3, 1, 8]', '[15, 12, 11, 10, 8, 6, 3, 2, 1]|||[15, 12, 11, 10, 8, 6, 3, 2, 1]', '[15, 12, 6, 11, 10, 2, 3, 1, 8]|||[15, 12, 6, 11, 10, 2, 3, 1, 8]', '[15, 11, 12, 10, 8, 6, 3, 2, 1]|||[15, 11, 12, 10, 8, 6, 3, 2, 1]'],
      correctIndex: 2,
      points: 1,
      explanation: 'Bottom-up sifts down at i = 3, 2, 1, 0: 1 sinks under 12; 6 under 15; 8 under 12 and then under 11; finally 2 sinks under 15 and then under 6. Option A is the tempting one: it is what the TOP-DOWN method (inserting one element at a time with sift-up, the code of slide 27) builds — also a valid heap, but a different one, since the same elements can form several heaps (slide 18). B is simply sorted.|||Bottom-up đẩy xuống tại i = 3, 2, 1, 0: 1 chìm xuống dưới 12; 6 xuống dưới 15; 8 xuống dưới 12 rồi dưới 11; cuối cùng 2 chìm xuống dưới 15 rồi dưới 6. Phương án A là bẫy: đó là heap mà phương pháp TỪ TRÊN XUỐNG (chèn lần lượt từng phần tử rồi sift-up, code ở slide 27) tạo ra — cũng là heap hợp lệ nhưng là heap khác, vì cùng tập phần tử có thể tạo nhiều heap (slide 18). B chỉ là mảng đã sắp xếp.' },
  ],
};

export default {
  slides: [L_csd8_1, L_csd8_2, L_csd9_1, L_csd9_2],
  practice: L_on_ch4,
  quiz: QUIZ,
  quizDescription: '10 câu "sau khi chèn/xoá thì cây trông thế nào": duyệt BST, cây suy biến, xoá bằng copying, dựng cây từ hai phép duyệt, chiều cao theo định nghĩa của slide, xoay AVL đơn/kép, heap trong mảng, sift-up, dựng heap bottom-up — mỗi câu có giải thích.',
};
