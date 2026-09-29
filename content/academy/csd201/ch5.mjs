/**
 * CSD201 · Chương 5 — đồ thị.
 * Bài 📑 học theo từng slide: csd10 (5A-Graphs1.ppt, 36 slide); csd11 (5B-Graphs2.ppt, 30 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch5.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-ch5).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 5.A — 📑 Slide by slide · Graphs, part 1a: definitions & terminology (5A-Graphs1, slides 1–17) ───────── */
const L_csd10_1 = {
  title: '5.A — 📑 Slide by slide · Graphs, part 1a: definitions & terminology (5A-Graphs1, slides 1–17)|||5.A — 📑 Học theo từng slide · Đồ thị, phần 1a: định nghĩa & thuật ngữ (5A-Graphs1, slide 1–17)',
  slug: 'csd201-slide-csd10-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–17 của bộ 5A-Graphs1: đồ thị là gì, có hướng/vô hướng/hỗn hợp, bậc và định lý bắt tay Σdeg = 2|E|, cạnh song song, khuyên, đơn đồ thị/đa đồ thị/giả đồ thị, đường đi, chu trình, liên thông mạnh/yếu, thành phần liên thông, rừng, cây, cây khung, đỉnh khớp, cầu, đồ thị đầy đủ Kn — 12 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.A · 5A-Graphs1, slides 1–17</span>
<h2>Graphs, part 1a — what a graph is, and the words to talk about it</h2>
<p class="lead">Chapter 5 opens the most general structure of the course: the graph — objects called vertices, joined in pairs by edges. Slides 1–17 are its vocabulary: directed or undirected, degree, parallel edges and loops, path and cycle, connected and strongly connected, subgraph, tree and spanning tree, cut-vertex and bridge, complete graph. Every term comes with a small graph of the lesson's own, drawn in text and checked by a Java program you can run. Lesson 5.B continues with slides 18–36: storing a graph, BFS and DFS, Dijkstra and Floyd.</p>
<div class="callout"><strong>CLO5 in the syllabus:</strong> discuss graphs and their applications; implement a graph with some basic operations (sessions 29–40). The class questions of this part are pure definitions: the relation between the number of edges and the sum of the degrees (CQ8.1), what a pseudo-graph, a connected graph and a complete graph are (CQ9.1–9.2), and the number of edges of a complete graph on n vertices (CQ9.3). In the FE they come back as short multiple-choice questions; in the PE you need them to read an adjacency matrix without mistakes.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Notion</th><th>In one line</th><th>Formula or fact</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Graph G = (V, E)</td><td>vertices + edges between pairs of them</td><td>n = |V|, m = |E|</td><td>3–4</td></tr>
<tr><td>Directed / undirected edge</td><td>ordered pair (u, v) / unordered pair {u, v}</td><td>one undirected edge = two directed edges</td><td>5</td></tr>
<tr><td>Degree</td><td>number of edges touching a vertex</td><td>Σ deg(v) = 2m; digraph: Σ indeg = Σ outdeg = m</td><td>7</td></tr>
<tr><td>Simple graph / multigraph / pseudograph</td><td>no loop and no parallel edge / parallel edges / loops allowed</td><td>a loop adds 2 to the degree</td><td>9</td></tr>
<tr><td>Path / cycle</td><td>walk along edges / walk that comes back to its start</td><td>simple = no repeated vertex; length = number of edges</td><td>10</td></tr>
<tr><td>Connected / strongly / weakly connected</td><td>a path between any two vertices / directed paths both ways / connected once directions are ignored</td><td>c components and no cycle ⇔ m = n − c</td><td>11</td></tr>
<tr><td>Forest / tree / spanning tree</td><td>no cycle / connected with no cycle / a tree through every vertex</td><td>a tree has m = n − 1</td><td>11, 13</td></tr>
<tr><td>Articulation point / bridge</td><td>a vertex / an edge whose removal disconnects the graph</td><td>found with DFS</td><td>12</td></tr>
<tr><td>Complete graph Kn</td><td>every pair of vertices joined</td><td>m = n(n − 1)/2</td><td>15</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.A · 5A-Graphs1, slide 1–17</span>
<h2>Đồ thị, phần 1a — đồ thị là gì, và bộ từ vựng để nói về nó</h2>
<p class="lead">Chương 5 mở ra cấu trúc tổng quát nhất của môn: đồ thị (graph) — các đối tượng gọi là đỉnh (vertex), nối với nhau từng cặp bằng cạnh (edge). Slide 1–17 là bộ từ vựng của nó: có hướng hay vô hướng, bậc, cạnh song song và khuyên, đường đi và chu trình, liên thông và liên thông mạnh, đồ thị con, cây và cây khung, đỉnh khớp và cầu, đồ thị đầy đủ. Thuật ngữ nào cũng kèm một đồ thị nhỏ của bài, vẽ bằng chữ và được kiểm bằng một chương trình Java chạy được. Bài 5.B đi tiếp slide 18–36: cách lưu đồ thị, duyệt BFS và DFS, thuật toán Dijkstra và Floyd.</p>
<div class="callout"><strong>CLO5 trong syllabus:</strong> trình bày về đồ thị và ứng dụng; cài đặt được đồ thị với một số thao tác cơ bản (buổi 29–40). Câu hỏi trên lớp (class question) của phần này toàn là định nghĩa: quan hệ giữa số cạnh và tổng bậc các đỉnh (CQ8.1), giả đồ thị (pseudo-graph), đồ thị liên thông, đồ thị đầy đủ là gì (CQ9.1–9.2), và đồ thị đầy đủ n đỉnh có bao nhiêu cạnh (CQ9.3). Ở FE (thi cuối kỳ) chúng quay lại thành câu trắc nghiệm ngắn; ở PE (thi thực hành) bạn cần chúng để đọc ma trận kề (adjacency matrix) không sai.</div>
<h3>Cả phần trong một bảng</h3>
<table>
<thead><tr><th>Khái niệm</th><th>Một dòng</th><th>Công thức / điều cần nhớ</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Đồ thị G = (V, E)</td><td>các đỉnh + các cạnh nối từng cặp đỉnh</td><td>n = |V|, m = |E|</td><td>3–4</td></tr>
<tr><td>Cạnh có hướng / vô hướng (directed / undirected edge)</td><td>cặp có thứ tự (u, v) / cặp không thứ tự {u, v}</td><td>một cạnh vô hướng = hai cạnh có hướng</td><td>5</td></tr>
<tr><td>Bậc (degree)</td><td>số cạnh chạm vào một đỉnh</td><td>Σ deg(v) = 2m; có hướng: Σ bậc vào = Σ bậc ra = m</td><td>7</td></tr>
<tr><td>Đơn đồ thị / đa đồ thị / giả đồ thị (simple graph / multigraph / pseudograph)</td><td>không khuyên, không cạnh song song / có cạnh song song / cho phép khuyên</td><td>một khuyên cộng 2 vào bậc</td><td>9</td></tr>
<tr><td>Đường đi / chu trình (path / cycle)</td><td>đi dọc các cạnh / đi rồi quay về điểm đầu</td><td>đơn = không lặp đỉnh; độ dài = số cạnh</td><td>10</td></tr>
<tr><td>Liên thông / liên thông mạnh / liên thông yếu (connected / strongly / weakly connected)</td><td>có đường giữa mọi cặp đỉnh / có đường có hướng cả hai chiều / liên thông khi bỏ chiều cạnh</td><td>c thành phần và không chu trình ⇔ m = n − c</td><td>11</td></tr>
<tr><td>Rừng / cây / cây khung (forest / tree / spanning tree)</td><td>không chu trình / liên thông, không chu trình / cây đi qua mọi đỉnh</td><td>cây có m = n − 1</td><td>11, 13</td></tr>
<tr><td>Đỉnh khớp / cầu (articulation point / bridge)</td><td>đỉnh / cạnh mà xoá đi thì đồ thị bị tách rời</td><td>tìm bằng DFS</td><td>12</td></tr>
<tr><td>Đồ thị đầy đủ Kn (complete graph)</td><td>mọi cặp đỉnh đều được nối</td><td>m = n(n − 1)/2</td><td>15</td></tr>
</tbody>
</table>`),
    walkHead('csd10', 1, 17),
    walk('csd10', [
      [1, '5. Graphs — Part 1',
        `<p class="y-chinh">🎯 Chapter 5 — Graphs, part 1: the deck that goes from "what is a graph" all the way to shortest paths.</p>
<p>After lists, stacks, queues and trees, the graph is the most general structure of CSD201: a tree is simply a connected graph with no cycle, and a linked list is the thinnest tree of all — a single path. Part 1 (this deck, 36 slides) covers the definitions, storing a graph, BFS/DFS, Dijkstra and Floyd; part 2 (deck 5B-Graphs2) covers spanning trees, Euler and Hamilton cycles, and graph colouring.</p>`,
        `<p class="y-chinh">🎯 Chương 5 — Đồ thị (graph), phần 1: bộ slide đi từ "đồ thị là gì" tới tận bài toán đường đi ngắn nhất.</p>
<p>Sau danh sách, ngăn xếp, hàng đợi và cây, đồ thị là cấu trúc tổng quát nhất của CSD201: cây (tree) chẳng qua là một đồ thị liên thông không có chu trình, còn danh sách liên kết là cái cây "gầy" nhất — chỉ một đường thẳng. Phần 1 (bộ này, 36 slide) gồm định nghĩa, cách lưu đồ thị, duyệt BFS/DFS, thuật toán Dijkstra và Floyd; phần 2 (bộ 5B-Graphs2) gồm cây khung (spanning tree), chu trình Euler và Hamilton, tô màu đồ thị (graph coloring).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Nine objectives: what a graph is and the words for it, how to store and traverse it, and how to find shortest paths.</p>
<ol>
<li><strong>Graph introduction, definition, terminology, applications</strong> — slides 3–17 (this lesson).</li>
<li><strong>Graph representation</strong> — adjacency list, adjacency matrix, incidence matrix (slides 18–20).</li>
<li><strong>Graph traversals</strong> — breadth-first search, BFS (slides 21–23), and depth-first search, DFS (slides 24–26).</li>
<li><strong>Shortest paths</strong> — the problem (slide 27), Dijkstra's algorithm (28–31), Floyd's algorithm (32–34).</li>
</ol>
<p>The first line is vocabulary for the FE; the other three are code you will be asked to write in the PE.</p>
<p class="meo">🧠 <strong>Remember:</strong> the slide spells "Dijsktra"; the name is <strong>Dijkstra</strong> (Edsger W. Dijkstra) — it hides the three loop variables in order: D-<strong>ijk</strong>-stra.</p>`,
        `<p class="y-chinh">🎯 Chín mục tiêu: đồ thị là gì cùng bộ thuật ngữ, cách lưu và duyệt đồ thị, và cách tìm đường đi ngắn nhất.</p>
<ol>
<li><strong>Giới thiệu, định nghĩa, thuật ngữ (terminology), ứng dụng của đồ thị</strong> — slide 3–17 (bài này).</li>
<li><strong>Biểu diễn đồ thị (graph representation)</strong> — danh sách kề (adjacency list), ma trận kề (adjacency matrix), ma trận liên thuộc (incidence matrix), slide 18–20.</li>
<li><strong>Duyệt đồ thị (graph traversal)</strong> — duyệt theo chiều rộng BFS (breadth-first search, slide 21–23) và theo chiều sâu DFS (depth-first search, slide 24–26).</li>
<li><strong>Đường đi ngắn nhất (shortest path)</strong> — bài toán (slide 27), thuật toán Dijkstra (28–31), thuật toán Floyd (32–34).</li>
</ol>
<p>Dòng thứ nhất là từ vựng cho FE; ba dòng còn lại là code bạn sẽ phải tự viết trong PE.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> slide gõ nhầm "Dijsktra"; tên đúng là <strong>Dijkstra</strong> (Edsger W. Dijkstra) — trong tên giấu đủ ba biến vòng lặp quen thuộc theo đúng thứ tự: D-<strong>ijk</strong>-stra.</p>`],
      [3, 'Graph Introduction',
        `<p class="y-chinh">🎯 A graph represents relationships between pairs of objects: a set of objects called vertices, together with a collection of pairwise connections between them called edges.</p>
<ul>
<li><strong>Vertex</strong> (plural <em>vertices</em>, also called a <em>node</em>) — one object: a city, a computer, a person, a web page.</li>
<li><strong>Edge</strong> — one connection between two vertices: a road, a cable, a friendship, a hyperlink.</li>
<li><strong>Domains named on the slide</strong>: mapping, transportation, computer networks, electrical engineering — anything made of "things" and "which thing is connected to which".</li>
<li><strong>Not a chart</strong>: the slide warns that this "graph" has nothing to do with bar charts or function plots.</li>
</ul>
<pre><code class="language-plaintext">the lesson's own example: 5 cities (vertices), 4 roads (edges)

   Hanoi ----- Haiphong
     |
   Vinh ------ Hue ------ Danang</code></pre>
<p><strong>Why it matters after school:</strong> route planning in map apps (shortest paths, slide 27), "people you may know" (friends of your friends = vertices two edges away), installing software dependencies in a valid order, routers choosing where to send packets — all graph problems of this chapter.</p>
<p class="meo">🧠 <strong>Remember:</strong> vertex = a "thing", edge = a "relationship between two things". When a problem talks about things and pairwise links, draw the graph first.</p>`,
        `<p class="y-chinh">🎯 Đồ thị (graph) biểu diễn quan hệ giữa các cặp đối tượng: một tập đối tượng gọi là đỉnh (vertex), cùng một tập các mối nối giữa từng cặp đỉnh gọi là cạnh (edge).</p>
<ul>
<li><strong>Đỉnh (vertex, số nhiều vertices; còn gọi là nút — node)</strong> — một đối tượng: thành phố, máy tính, con người, trang web.</li>
<li><strong>Cạnh (edge)</strong> — một mối nối giữa hai đỉnh: con đường, sợi cáp, quan hệ bạn bè, đường link.</li>
<li><strong>Các lĩnh vực slide nêu</strong>: bản đồ (mapping), giao thông vận tải (transportation), mạng máy tính (computer networks), kỹ thuật điện (electrical engineering) — mọi thứ gồm "các vật" và "vật nào nối với vật nào".</li>
<li><strong>Không phải biểu đồ</strong>: slide nhắc "graph" ở đây chẳng liên quan gì tới biểu đồ cột (bar chart) hay đồ thị hàm số (function plot) trong môn toán.</li>
</ul>
<pre><code class="language-plaintext">ví dụ của bài: 5 thành phố (đỉnh), 4 con đường (cạnh)

   Hanoi ----- Haiphong
     |
   Vinh ------ Hue ------ Danang</code></pre>
<p><strong>Vì sao đáng học kỹ:</strong> tìm đường trên app bản đồ (đường đi ngắn nhất, slide 27), gợi ý "những người bạn có thể biết" (bạn của bạn = đỉnh cách hai cạnh), cài các thư viện phụ thuộc (dependency) theo thứ tự hợp lệ, bộ định tuyến (router) chọn đường gửi gói tin — đều là bài toán đồ thị của chương này.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đỉnh = "vật", cạnh = "quan hệ giữa hai vật". Đề bài nói về các vật và mối nối từng cặp thì vẽ đồ thị ra trước đã.</p>`],
      [4, 'Graph definition',
        `<p class="y-chinh">🎯 Briefly: a graph is a collection of vertices and the connections between them — written G = (V, E).</p>
<ul>
<li><strong>V</strong> is the set of vertices; <strong>E</strong> holds the edges, each edge joining two vertices of V.</li>
<li>Notation for the rest of the chapter: <strong>n = |V|</strong> (number of vertices) and <strong>m = |E|</strong> (number of edges). The cost of graph algorithms is written with these two letters, e.g. O(n + m).</li>
<li>In Java the vertices are numbered 0 … n − 1 so that they can index arrays, and an array of labels (A, B, C…) is used only for printing — exactly what the course's <code>visit(i)</code> does with <code>v[i]</code> (slide 26).</li>
</ul>
<pre><code class="language-java">public class GraphDef {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E'};          // V: vertex i is printed as v[i]
        int[][] e = {{0, 1}, {0, 2}, {1, 2}, {2, 3}};   // E: each edge = a pair of vertex numbers

        System.out.print("V = {");
        for (int i = 0; i &lt; v.length; i++) System.out.print((i &gt; 0 ? ", " : "") + v[i]);
        System.out.println("}");
        System.out.print("E = {");
        for (int k = 0; k &lt; e.length; k++) System.out.print((k &gt; 0 ? ", " : "") + v[e[k][0]] + "-" + v[e[k][1]]);
        System.out.println("}");
        System.out.println("n = |V| = " + v.length + ", m = |E| = " + e.length);

        for (int i = 0; i &lt; v.length; i++) {            // who is joined to vertex i? scan all of E
            System.out.print("connected to " + v[i] + ":");
            for (int[] x : e) {
                if (x[0] == i) System.out.print(" " + v[x[1]]);
                if (x[1] == i) System.out.print(" " + v[x[0]]);
            }
            System.out.println();
        }
    }
}</code></pre>
<div class="out">V = {A, B, C, D, E}<br>
E = {A-B, A-C, B-C, C-D}<br>
n = |V| = 5, m = |E| = 4<br>
connected to A: B C<br>
connected to B: A C<br>
connected to C: A B D<br>
connected to D: C<br>
connected to E:</div>
<p>Finding who is connected to a vertex by scanning the whole list E costs O(m) per vertex — slides 18–19 show structures that answer it faster. Vertex E is in V but touches no edge: that is allowed (slide 7 calls it isolated).</p>
<div class="pitfall">Vertex number vs label: slide 30 writes A(1), B(2)… (numbered from 1) while a Java array starts at 0. In a PE, check which convention the statement uses before printing "vertex 1".</div>`,
        `<p class="y-chinh">🎯 Nói gọn: đồ thị là một tập các đỉnh cùng các mối nối giữa chúng — viết là G = (V, E).</p>
<ul>
<li><strong>V</strong> là tập đỉnh (vertex set); <strong>E</strong> chứa các cạnh (edge), mỗi cạnh nối hai đỉnh của V.</li>
<li>Ký hiệu dùng suốt chương: <strong>n = |V|</strong> (số đỉnh) và <strong>m = |E|</strong> (số cạnh). Chi phí các thuật toán đồ thị được viết bằng hai chữ này, ví dụ O(n + m).</li>
<li>Trong Java các đỉnh được đánh số hiệu (index) 0 … n − 1 để làm chỉ số mảng, còn một mảng nhãn (label) A, B, C… chỉ dùng khi in — đúng như hàm <code>visit(i)</code> của môn in ra <code>v[i]</code> (slide 26).</li>
</ul>
<pre><code class="language-java">public class GraphDef {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E'};          // V: đỉnh i được in ra là v[i]
        int[][] e = {{0, 1}, {0, 2}, {1, 2}, {2, 3}};   // E: mỗi cạnh = một cặp số hiệu đỉnh

        System.out.print("V = {");
        for (int i = 0; i &lt; v.length; i++) System.out.print((i &gt; 0 ? ", " : "") + v[i]);
        System.out.println("}");
        System.out.print("E = {");
        for (int k = 0; k &lt; e.length; k++) System.out.print((k &gt; 0 ? ", " : "") + v[e[k][0]] + "-" + v[e[k][1]]);
        System.out.println("}");
        System.out.println("n = |V| = " + v.length + ", m = |E| = " + e.length);

        for (int i = 0; i &lt; v.length; i++) {            // đỉnh nào nối với đỉnh i? quét cả tập E
            System.out.print("connected to " + v[i] + ":");
            for (int[] x : e) {
                if (x[0] == i) System.out.print(" " + v[x[1]]);
                if (x[1] == i) System.out.print(" " + v[x[0]]);
            }
            System.out.println();
        }
    }
}</code></pre>
<div class="out">V = {A, B, C, D, E}<br>
E = {A-B, A-C, B-C, C-D}<br>
n = |V| = 5, m = |E| = 4<br>
connected to A: B C<br>
connected to B: A C<br>
connected to C: A B D<br>
connected to D: C<br>
connected to E:</div>
<p>Tìm các đỉnh nối với một đỉnh bằng cách quét cả tập E tốn O(m) cho mỗi đỉnh — slide 18–19 sẽ cho những cấu trúc trả lời nhanh hơn. Đỉnh E có trong V nhưng không chạm cạnh nào: điều đó hợp lệ (slide 7 gọi là đỉnh cô lập — isolated vertex).</p>
<div class="pitfall">Số hiệu và nhãn: slide 30 viết A(1), B(2)… (đánh số từ 1) trong khi mảng Java bắt đầu từ 0. Làm PE, hãy xem đề dùng quy ước nào trước khi in "đỉnh 1".</div>`],
      [5, 'Graph Terminology - 1',
        `<p class="y-chinh">🎯 An edge is directed when its pair of endpoints is ordered — (u, v) goes from u to v — and undirected when it is not, written {u, v}; a graph is undirected, directed (a digraph) or mixed according to its edges.</p>
<ul>
<li><strong>Directed edge (u, v)</strong>: u precedes v — drawn as an arrow u → v. (u, v) and (v, u) are two different edges.</li>
<li><strong>Undirected edge {u, v}</strong>: no order, a two-way connection — drawn as a plain line u — v.</li>
<li><strong>Undirected graph</strong>: all edges undirected. <strong>Directed graph (digraph)</strong>: all edges directed. <strong>Mixed graph</strong>: both kinds.</li>
<li><strong>Conversion</strong>: replacing every undirected edge {u, v} by the pair (u, v), (v, u) turns any graph into a digraph. The slide adds that it is often useful to keep undirected and mixed graphs as they are.</li>
</ul>
<pre><code class="language-java">public class ToDirected {
    static char[] v = {'A', 'B', 'C', 'D'};

    // each edge {from, to, kind}: kind 1 = directed (one-way), 0 = undirected (two-way)
    static int[][] toMatrix(int[][] edges) {
        int[][] a = new int[v.length][v.length];
        for (int[] e : edges) {
            a[e[0]][e[1]] = 1;                           // the directed edge (u,v)
            if (e[2] == 0) a[e[1]][e[0]] = 1;            // undirected: also (v,u)
        }
        return a;
    }

    static boolean symmetric(int[][] a) {
        for (int i = 0; i &lt; a.length; i++)
            for (int j = 0; j &lt; a.length; j++)
                if (a[i][j] != a[j][i]) return false;
        return true;
    }

    static void show(String name, int[][] edges) {
        int[][] a = toMatrix(edges);
        System.out.print(name + ":");
        for (int[] e : edges) System.out.print("  " + v[e[0]] + (e[2] == 1 ? "-&gt;" : "-") + v[e[1]]);
        System.out.println();
        System.out.print("  as a digraph:");
        int m = 0;
        for (int i = 0; i &lt; a.length; i++)
            for (int j = 0; j &lt; a.length; j++)
                if (a[i][j] == 1) { System.out.print(" " + v[i] + "-&gt;" + v[j]); m++; }
        System.out.println();
        System.out.println("  " + m + " directed edges, symmetric matrix? " + symmetric(a));
    }

    public static void main(String[] args) {
        show("mixed graph", new int[][] {{0, 1, 0}, {1, 2, 1}, {2, 3, 0}, {3, 0, 1}});
        show("undirected graph", new int[][] {{0, 1, 0}, {1, 2, 0}, {2, 3, 0}});
    }
}</code></pre>
<div class="out">mixed graph: &nbsp;A-B &nbsp;B-&gt;C &nbsp;C-D &nbsp;D-&gt;A<br>
&nbsp;&nbsp;as a digraph: A-&gt;B B-&gt;A B-&gt;C C-&gt;D D-&gt;A D-&gt;C<br>
&nbsp;&nbsp;6 directed edges, symmetric matrix? false<br>
undirected graph: &nbsp;A-B &nbsp;B-C &nbsp;C-D<br>
&nbsp;&nbsp;as a digraph: A-&gt;B B-&gt;A B-&gt;C C-&gt;B C-&gt;D D-&gt;C<br>
&nbsp;&nbsp;6 directed edges, symmetric matrix? true</div>
<p>The conversion is visible in an adjacency matrix: an undirected graph always gives a <strong>symmetric</strong> matrix (<code>a[i][j] == a[j][i]</code>); one one-way street is enough to break the symmetry.</p>
<div class="pitfall">When a PE gives an undirected graph as a list of edges, set <em>both</em> <code>a[u][v]</code> and <code>a[v][u]</code>. Setting only one silently turns it into a digraph, and BFS/DFS then miss vertices.</div>`,
        `<p class="y-chinh">🎯 Cạnh là có hướng (directed) khi cặp đầu mút có thứ tự — (u, v) đi từ u tới v — và vô hướng (undirected) khi không có thứ tự, viết {u, v}; cả đồ thị được gọi là vô hướng, có hướng (digraph) hay hỗn hợp (mixed) tuỳ theo các cạnh của nó.</p>
<ul>
<li><strong>Cạnh có hướng (u, v)</strong>: u đứng trước v — vẽ bằng mũi tên u → v. (u, v) và (v, u) là hai cạnh khác nhau.</li>
<li><strong>Cạnh vô hướng {u, v}</strong>: không có thứ tự, nối hai chiều — vẽ bằng một đoạn thẳng u — v.</li>
<li><strong>Đồ thị vô hướng (undirected graph)</strong>: mọi cạnh đều vô hướng. <strong>Đồ thị có hướng (directed graph, digraph)</strong>: mọi cạnh đều có hướng. <strong>Đồ thị hỗn hợp (mixed graph)</strong>: có cả hai loại.</li>
<li><strong>Chuyển đổi</strong>: thay mỗi cạnh vô hướng {u, v} bằng cặp (u, v), (v, u) là biến mọi đồ thị thành đồ thị có hướng. Slide nói thêm: thường vẫn nên giữ nguyên đồ thị vô hướng và hỗn hợp như vốn có.</li>
</ul>
<pre><code class="language-java">public class ToDirected {
    static char[] v = {'A', 'B', 'C', 'D'};

    // mỗi cạnh {từ, tới, loại}: 1 = có hướng (một chiều), 0 = vô hướng (hai chiều)
    static int[][] toMatrix(int[][] edges) {
        int[][] a = new int[v.length][v.length];
        for (int[] e : edges) {
            a[e[0]][e[1]] = 1;                           // cạnh có hướng (u,v)
            if (e[2] == 0) a[e[1]][e[0]] = 1;            // vô hướng: thêm cả (v,u)
        }
        return a;
    }

    static boolean symmetric(int[][] a) {
        for (int i = 0; i &lt; a.length; i++)
            for (int j = 0; j &lt; a.length; j++)
                if (a[i][j] != a[j][i]) return false;
        return true;
    }

    static void show(String name, int[][] edges) {
        int[][] a = toMatrix(edges);
        System.out.print(name + ":");
        for (int[] e : edges) System.out.print("  " + v[e[0]] + (e[2] == 1 ? "-&gt;" : "-") + v[e[1]]);
        System.out.println();
        System.out.print("  as a digraph:");
        int m = 0;
        for (int i = 0; i &lt; a.length; i++)
            for (int j = 0; j &lt; a.length; j++)
                if (a[i][j] == 1) { System.out.print(" " + v[i] + "-&gt;" + v[j]); m++; }
        System.out.println();
        System.out.println("  " + m + " directed edges, symmetric matrix? " + symmetric(a));
    }

    public static void main(String[] args) {
        show("mixed graph", new int[][] {{0, 1, 0}, {1, 2, 1}, {2, 3, 0}, {3, 0, 1}});
        show("undirected graph", new int[][] {{0, 1, 0}, {1, 2, 0}, {2, 3, 0}});
    }
}</code></pre>
<div class="out">mixed graph: &nbsp;A-B &nbsp;B-&gt;C &nbsp;C-D &nbsp;D-&gt;A<br>
&nbsp;&nbsp;as a digraph: A-&gt;B B-&gt;A B-&gt;C C-&gt;D D-&gt;A D-&gt;C<br>
&nbsp;&nbsp;6 directed edges, symmetric matrix? false<br>
undirected graph: &nbsp;A-B &nbsp;B-C &nbsp;C-D<br>
&nbsp;&nbsp;as a digraph: A-&gt;B B-&gt;A B-&gt;C C-&gt;B C-&gt;D D-&gt;C<br>
&nbsp;&nbsp;6 directed edges, symmetric matrix? true</div>
<p>Phép chuyển đổi nhìn thấy ngay trên ma trận kề (adjacency matrix): đồ thị vô hướng luôn cho ma trận <strong>đối xứng (symmetric)</strong> (<code>a[i][j] == a[j][i]</code>); chỉ một con đường một chiều là đủ phá sự đối xứng.</p>
<div class="pitfall">Khi đề PE cho đồ thị vô hướng dưới dạng danh sách cạnh, phải gán <em>cả</em> <code>a[u][v]</code> lẫn <code>a[v][u]</code>. Chỉ gán một bên là âm thầm biến nó thành đồ thị có hướng, và BFS/DFS sẽ sót đỉnh.</div>`],
      [6, 'Graph Examples - 1',
        `<p class="y-chinh">🎯 Two real systems modelled as graphs: a city map, which is a mixed graph, and the wiring or plumbing network of a building.</p>
<table>
<thead><tr><th>System</th><th>Vertices</th><th>Edges</th><th>Kind of graph</th></tr></thead>
<tbody>
<tr><td>City map</td><td>intersections and dead ends</td><td>stretches of street with no intersection in between</td><td>mixed: two-way streets are undirected edges, one-way streets are directed edges</td></tr>
<tr><td>Electrical wiring, plumbing</td><td>connectors, fixtures, outlets</td><td>uninterrupted stretches of wire or pipe</td><td>undirected</td></tr>
</tbody>
</table>
<ul>
<li>The building's network is only a piece of a much larger graph — the local power or water distribution network.</li>
<li>A long street crossing three intersections is not one edge but several: one per stretch between two intersections.</li>
</ul>
<pre><code class="language-plaintext">the lesson's own mini city map (a mixed graph)

  X1 ------ X2 -----&gt; X3         ---   two-way street  = undirected edge
   |                   |         --&gt;   one-way street  = directed edge
   |                   v
  X4 &lt;----- X5 ------ X6</code></pre>
<p>Converted as on slide 5: 3 two-way streets give 6 directed edges, plus 3 one-way streets = 9 directed edges.</p>
<p class="meo">🧠 <strong>Remember:</strong> to model anything ask three questions — what are the things (vertices)? what connects two things (edges)? does the connection have a direction?</p>
<div class="pitfall">Before running any algorithm on a mixed graph, store it as a digraph: a two-way street goes into both <code>a[u][v]</code> and <code>a[v][u]</code>, a one-way street only into <code>a[u][v]</code>. Storing a one-way street in both cells lets a route drive the wrong way.</div>`,
        `<p class="y-chinh">🎯 Hai hệ thống thật được mô hình hoá bằng đồ thị: bản đồ thành phố (city map) — một đồ thị hỗn hợp, và mạng dây điện hoặc đường ống nước của một toà nhà.</p>
<table>
<thead><tr><th>Hệ thống</th><th>Đỉnh</th><th>Cạnh</th><th>Loại đồ thị</th></tr></thead>
<tbody>
<tr><td>Bản đồ thành phố</td><td>giao lộ (intersection) và ngõ cụt (dead end)</td><td>các đoạn phố không có giao lộ ở giữa (stretch of street)</td><td>hỗn hợp: phố hai chiều là cạnh vô hướng, phố một chiều là cạnh có hướng</td></tr>
<tr><td>Mạng điện, mạng nước (wiring, plumbing)</td><td>đầu nối (connector), thiết bị (fixture), ổ cắm (outlet)</td><td>các đoạn dây hoặc ống liền mạch</td><td>vô hướng</td></tr>
</tbody>
</table>
<ul>
<li>Mạng của toà nhà chỉ là một mảnh (đồ thị con — subgraph) của một đồ thị lớn hơn nhiều: mạng phân phối điện hoặc nước của khu vực.</li>
<li>Một con phố dài cắt qua ba giao lộ không phải một cạnh mà là nhiều cạnh: mỗi đoạn giữa hai giao lộ là một cạnh.</li>
</ul>
<pre><code class="language-plaintext">bản đồ thành phố mini của bài (một đồ thị hỗn hợp)

  X1 ------ X2 -----&gt; X3         ---   phố hai chiều  = cạnh vô hướng
   |                   |         --&gt;   phố một chiều  = cạnh có hướng
   |                   v
  X4 &lt;----- X5 ------ X6</code></pre>
<p>Chuyển đổi như slide 5: 3 phố hai chiều cho 6 cạnh có hướng, cộng 3 phố một chiều = 9 cạnh có hướng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mô hình hoá bất cứ thứ gì cũng hỏi ba câu — các "vật" là gì (đỉnh)? cái gì nối hai vật (cạnh)? mối nối có chiều không?</p>
<div class="pitfall">Trước khi chạy thuật toán nào trên đồ thị hỗn hợp, hãy lưu nó thành đồ thị có hướng: phố hai chiều ghi vào cả <code>a[u][v]</code> lẫn <code>a[v][u]</code>, phố một chiều chỉ ghi vào <code>a[u][v]</code>. Ghi phố một chiều vào cả hai ô là cho phép lộ trình đi ngược chiều.</div>`],
      [7, 'Graph Terminology - 2',
        `<p class="y-chinh">🎯 Words for the ends of an edge and the edges of a vertex: endpoints, origin and destination, adjacent, incident, outgoing and incoming edges, degree, in-degree and out-degree, isolated vertex.</p>
<ul>
<li><strong>End vertices (endpoints)</strong>: the two vertices joined by an edge; for a directed edge the first is the <strong>origin</strong>, the other the <strong>destination</strong>.</li>
<li><strong>Adjacent</strong> (vertex ↔ vertex): u and v are adjacent if an edge joins them. <strong>Incident</strong> (edge ↔ vertex): an edge is incident to a vertex that is one of its endpoints.</li>
<li><strong>Outgoing edges</strong> of v: directed edges whose origin is v; <strong>incoming edges</strong>: those whose destination is v.</li>
<li><strong>deg(v)</strong> = number of incident edges; <strong>indeg(v)</strong> / <strong>outdeg(v)</strong> = number of incoming / outgoing edges; deg(v) = 0 ⇒ v is <strong>isolated</strong>.</li>
</ul>
<p class="nhan">Handshake theorem — class question CQ8.1</p>
<p>Each edge has two ends, so adding up all the degrees counts every edge twice: <strong>Σ deg(v) = 2|E|</strong>. In a digraph each edge has exactly one origin and one destination: <strong>Σ indeg(v) = Σ outdeg(v) = |E|</strong>.</p>
<pre><code class="language-java">public class Degrees {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};
        int[][] a = {                                    // undirected: a[i][j] = a[j][i] = 1 for an edge i-j
            {0, 1, 1, 0, 0, 0},
            {1, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 0},
            {0, 0, 1, 0, 1, 0},
            {0, 0, 0, 1, 0, 0},
            {0, 0, 0, 0, 0, 0}};
        int n = v.length, sum = 0, m = 0;
        for (int i = 0; i &lt; n; i++) {
            int deg = 0;
            for (int j = 0; j &lt; n; j++) deg += a[i][j];  // deg(v) = sum of row v
            sum += deg;
            System.out.print(v[i] + ":" + deg + (deg == 0 ? " (isolated)" : "") + "  ");
        }
        for (int i = 0; i &lt; n; i++)
            for (int j = i + 1; j &lt; n; j++) m += a[i][j];  // each edge once: upper half only
        System.out.println();
        System.out.println("sum of degrees = " + sum + ", |E| = " + m + ", 2|E| = " + 2 * m);

        char[] w = {'A', 'B', 'C', 'D'};
        int[][] d = {                                    // directed: d[i][j] = 1 for an edge i -&gt; j
            {0, 1, 1, 0},
            {0, 0, 1, 0},
            {1, 0, 0, 1},
            {0, 0, 0, 0}};
        int so = 0, si = 0;
        for (int i = 0; i &lt; w.length; i++) {
            int out = 0, in = 0;
            for (int j = 0; j &lt; w.length; j++) {
                out += d[i][j];                          // row i: edges leaving i
                in += d[j][i];                           // column i: edges entering i
            }
            so += out;
            si += in;
            System.out.print(w[i] + ": out " + out + ", in " + in + "   ");
        }
        System.out.println();
        System.out.println("sum of out-degrees = " + so + ", sum of in-degrees = " + si + ", |E| = " + so);
    }
}</code></pre>
<div class="out">A:2 &nbsp;B:2 &nbsp;C:3 &nbsp;D:2 &nbsp;E:1 &nbsp;F:0 (isolated)<br>
sum of degrees = 10, |E| = 5, 2|E| = 10<br>
A: out 2, in 1 &nbsp;&nbsp;B: out 1, in 1 &nbsp;&nbsp;C: out 2, in 2 &nbsp;&nbsp;D: out 0, in 1<br>
sum of out-degrees = 5, sum of in-degrees = 5, |E| = 5</div>
<p><strong>Consequence:</strong> the sum of degrees is even, so the number of odd-degree vertices is always even (here C and E). "Degrees 3, 3, 2, 1 — possible?" → the sum is 9, odd ⇒ impossible. Computing every degree from a matrix costs O(n²): one full row per vertex.</p>
<div class="pitfall">In the matrix of an undirected graph the number of 1s is 2|E|, not |E| — each edge is stored as <code>a[u][v]</code> and <code>a[v][u]</code>; count only the upper half (<code>j &gt; i</code>) or divide by 2. In a digraph, out-degree = row sum, in-degree = <em>column</em> sum.</div>`,
        `<p class="y-chinh">🎯 Các từ gọi hai đầu của một cạnh và các cạnh của một đỉnh: đầu mút, gốc và đích, kề, liên thuộc, cạnh ra và cạnh vào, bậc, bậc vào và bậc ra, đỉnh cô lập.</p>
<ul>
<li><strong>Đầu mút (end vertices, endpoints)</strong>: hai đỉnh mà cạnh nối; với cạnh có hướng, đầu thứ nhất là <strong>gốc (origin)</strong>, đầu kia là <strong>đích (destination)</strong>.</li>
<li><strong>Kề (adjacent)</strong> (đỉnh ↔ đỉnh): u và v kề nhau nếu có một cạnh nối chúng. <strong>Liên thuộc (incident)</strong> (cạnh ↔ đỉnh): một cạnh liên thuộc với đỉnh là đầu mút của nó.</li>
<li><strong>Cạnh ra (outgoing edge)</strong> của v: các cạnh có hướng có gốc là v; <strong>cạnh vào (incoming edge)</strong>: các cạnh có đích là v.</li>
<li><strong>Bậc deg(v) (degree)</strong> = số cạnh liên thuộc; <strong>bậc vào indeg(v) (in-degree)</strong> / <strong>bậc ra outdeg(v) (out-degree)</strong> = số cạnh vào / số cạnh ra; deg(v) = 0 ⇒ v là <strong>đỉnh cô lập (isolated vertex)</strong>.</li>
</ul>
<p class="nhan">Định lý bắt tay (handshake theorem) — câu hỏi trên lớp CQ8.1</p>
<p>Mỗi cạnh có hai đầu, nên cộng bậc của mọi đỉnh là đếm mỗi cạnh hai lần: <strong>Σ deg(v) = 2|E|</strong>. Trong đồ thị có hướng mỗi cạnh có đúng một gốc và một đích: <strong>Σ indeg(v) = Σ outdeg(v) = |E|</strong>.</p>
<pre><code class="language-java">public class Degrees {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};
        int[][] a = {                                    // vô hướng: a[i][j] = a[j][i] = 1 nếu có cạnh i-j
            {0, 1, 1, 0, 0, 0},
            {1, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 0},
            {0, 0, 1, 0, 1, 0},
            {0, 0, 0, 1, 0, 0},
            {0, 0, 0, 0, 0, 0}};
        int n = v.length, sum = 0, m = 0;
        for (int i = 0; i &lt; n; i++) {
            int deg = 0;
            for (int j = 0; j &lt; n; j++) deg += a[i][j];  // deg(v) = tổng hàng v
            sum += deg;
            System.out.print(v[i] + ":" + deg + (deg == 0 ? " (isolated)" : "") + "  ");
        }
        for (int i = 0; i &lt; n; i++)
            for (int j = i + 1; j &lt; n; j++) m += a[i][j];  // mỗi cạnh một lần: chỉ nửa trên
        System.out.println();
        System.out.println("sum of degrees = " + sum + ", |E| = " + m + ", 2|E| = " + 2 * m);

        char[] w = {'A', 'B', 'C', 'D'};
        int[][] d = {                                    // có hướng: d[i][j] = 1 nếu có cạnh i -&gt; j
            {0, 1, 1, 0},
            {0, 0, 1, 0},
            {1, 0, 0, 1},
            {0, 0, 0, 0}};
        int so = 0, si = 0;
        for (int i = 0; i &lt; w.length; i++) {
            int out = 0, in = 0;
            for (int j = 0; j &lt; w.length; j++) {
                out += d[i][j];                          // hàng i: cạnh đi ra từ i
                in += d[j][i];                           // cột i: cạnh đi vào i
            }
            so += out;
            si += in;
            System.out.print(w[i] + ": out " + out + ", in " + in + "   ");
        }
        System.out.println();
        System.out.println("sum of out-degrees = " + so + ", sum of in-degrees = " + si + ", |E| = " + so);
    }
}</code></pre>
<div class="out">A:2 &nbsp;B:2 &nbsp;C:3 &nbsp;D:2 &nbsp;E:1 &nbsp;F:0 (isolated)<br>
sum of degrees = 10, |E| = 5, 2|E| = 10<br>
A: out 2, in 1 &nbsp;&nbsp;B: out 1, in 1 &nbsp;&nbsp;C: out 2, in 2 &nbsp;&nbsp;D: out 0, in 1<br>
sum of out-degrees = 5, sum of in-degrees = 5, |E| = 5</div>
<p><strong>Hệ quả:</strong> tổng bậc luôn chẵn, nên số đỉnh bậc lẻ luôn là số chẵn (ở đây là C và E). "Các bậc 3, 3, 2, 1 — có được không?" → tổng là 9, lẻ ⇒ không thể. Tính bậc mọi đỉnh trên ma trận tốn O(n²): mỗi đỉnh quét trọn một hàng.</p>
<div class="pitfall">Trong ma trận của đồ thị vô hướng, số con số 1 là 2|E| chứ không phải |E| — mỗi cạnh được lưu ở cả <code>a[u][v]</code> và <code>a[v][u]</code>; chỉ đếm nửa trên (<code>j &gt; i</code>) hoặc chia đôi. Với đồ thị có hướng: bậc ra = tổng <em>hàng</em>, bậc vào = tổng <em>cột</em>.</div>`],
      [8, 'Graph Examples - 2',
        `<p class="y-chinh">🎯 A flight network: airports are vertices and flights are directed edges — the words of slide 7 get a concrete meaning.</p>
<ul>
<li><strong>Directed</strong>: a flight has a travel direction; the endpoints of edge e are the origin and the destination airport of that flight.</li>
<li><strong>Adjacent airports</strong>: some flight flies between them. <strong>Incident</strong>: flight e is incident to airport v if e flies to or from v.</li>
<li><strong>out-degree</strong> = departures, <strong>in-degree</strong> = arrivals; two flights on the same route are parallel edges (slide 9).</li>
</ul>
<p>The lesson's own example: four airports and six invented flights F1–F6 (F1 and F6 both fly HAN → SGN).</p>
<pre><code class="language-java">public class FlightNetwork {
    static String[] ap = {"HAN", "DAD", "SGN", "PQC"};   // vertices = airports
    static String[] code = {"F1", "F2", "F3", "F4", "F5", "F6"};
    static int[][] f = {{0, 2}, {2, 0}, {0, 1}, {1, 2}, {2, 3}, {0, 2}};   // edge = flight: origin -&gt; destination

    static String adjacent(int u, int v) {               // a flight between u and v, either way?
        for (int k = 0; k &lt; f.length; k++)
            if ((f[k][0] == u &amp;&amp; f[k][1] == v) || (f[k][0] == v &amp;&amp; f[k][1] == u)) return "true (" + code[k] + ")";
        return "false";
    }

    public static void main(String[] args) {
        for (int v = 0; v &lt; ap.length; v++) {
            int out = 0, in = 0;
            String inc = "";
            for (int k = 0; k &lt; f.length; k++) {
                if (f[k][0] == v) out++;                 // outgoing edge of v
                if (f[k][1] == v) in++;                  // incoming edge of v
                if (f[k][0] == v || f[k][1] == v) inc += " " + code[k];   // incident to v
            }
            System.out.println(ap[v] + ": out " + out + ", in " + in + ", incident flights:" + inc);
        }
        System.out.println("HAN and PQC adjacent? " + adjacent(0, 3));
        System.out.println("DAD and SGN adjacent? " + adjacent(1, 2));
        String par = "";
        for (int k = 0; k &lt; f.length; k++)
            if (f[k][0] == 0 &amp;&amp; f[k][1] == 2) par += " " + code[k];
        System.out.println("parallel edges HAN -&gt; SGN:" + par);
    }
}</code></pre>
<div class="out">HAN: out 3, in 1, incident flights: F1 F2 F3 F6<br>
DAD: out 1, in 1, incident flights: F3 F4<br>
SGN: out 2, in 3, incident flights: F1 F2 F4 F5 F6<br>
PQC: out 0, in 1, incident flights: F5<br>
HAN and PQC adjacent? false<br>
DAD and SGN adjacent? true (F4)<br>
parallel edges HAN -&gt; SGN: F1 F6</div>
<p>Check with slide 7: Σ out = 3 + 1 + 2 + 0 = 6 and Σ in = 1 + 1 + 3 + 1 = 6 = the number of flights.</p>
<div class="pitfall">"Adjacent" only asks for a flight in either direction; "reachable" needs a directed path. PQC has in-degree 1 and out-degree 0: you can fly to PQC, but in this network never out of it — adjacency alone does not tell you that.</div>`,
        `<p class="y-chinh">🎯 Mạng các chuyến bay (flight network): sân bay là đỉnh, chuyến bay là cạnh có hướng — các từ của slide 7 có nghĩa cụ thể.</p>
<ul>
<li><strong>Có hướng (directed)</strong>: chuyến bay có chiều bay; hai đầu mút của cạnh e là sân bay đi (gốc — origin) và sân bay đến (đích — destination).</li>
<li><strong>Hai sân bay kề nhau (adjacent)</strong>: có chuyến bay giữa chúng. <strong>Liên thuộc (incident)</strong>: chuyến e liên thuộc với sân bay v nếu e bay tới hoặc bay từ v.</li>
<li><strong>Bậc ra (out-degree)</strong> = số chuyến cất cánh, <strong>bậc vào (in-degree)</strong> = số chuyến hạ cánh; hai chuyến cùng một tuyến là cạnh song song (parallel edges, slide 9).</li>
</ul>
<p>Ví dụ của bài: bốn sân bay và sáu chuyến bay tự đặt F1–F6 (F1 và F6 cùng bay HAN → SGN).</p>
<pre><code class="language-java">public class FlightNetwork {
    static String[] ap = {"HAN", "DAD", "SGN", "PQC"};   // đỉnh = sân bay
    static String[] code = {"F1", "F2", "F3", "F4", "F5", "F6"};
    static int[][] f = {{0, 2}, {2, 0}, {0, 1}, {1, 2}, {2, 3}, {0, 2}};   // cạnh = chuyến bay: nơi đi -&gt; nơi đến

    static String adjacent(int u, int v) {               // có chuyến bay giữa u và v, chiều nào cũng được?
        for (int k = 0; k &lt; f.length; k++)
            if ((f[k][0] == u &amp;&amp; f[k][1] == v) || (f[k][0] == v &amp;&amp; f[k][1] == u)) return "true (" + code[k] + ")";
        return "false";
    }

    public static void main(String[] args) {
        for (int v = 0; v &lt; ap.length; v++) {
            int out = 0, in = 0;
            String inc = "";
            for (int k = 0; k &lt; f.length; k++) {
                if (f[k][0] == v) out++;                 // cạnh đi ra khỏi v
                if (f[k][1] == v) in++;                  // cạnh đi vào v
                if (f[k][0] == v || f[k][1] == v) inc += " " + code[k];   // liên thuộc với v
            }
            System.out.println(ap[v] + ": out " + out + ", in " + in + ", incident flights:" + inc);
        }
        System.out.println("HAN and PQC adjacent? " + adjacent(0, 3));
        System.out.println("DAD and SGN adjacent? " + adjacent(1, 2));
        String par = "";
        for (int k = 0; k &lt; f.length; k++)
            if (f[k][0] == 0 &amp;&amp; f[k][1] == 2) par += " " + code[k];
        System.out.println("parallel edges HAN -&gt; SGN:" + par);
    }
}</code></pre>
<div class="out">HAN: out 3, in 1, incident flights: F1 F2 F3 F6<br>
DAD: out 1, in 1, incident flights: F3 F4<br>
SGN: out 2, in 3, incident flights: F1 F2 F4 F5 F6<br>
PQC: out 0, in 1, incident flights: F5<br>
HAN and PQC adjacent? false<br>
DAD and SGN adjacent? true (F4)<br>
parallel edges HAN -&gt; SGN: F1 F6</div>
<p>Kiểm lại với slide 7: Σ bậc ra = 3 + 1 + 2 + 0 = 6 và Σ bậc vào = 1 + 1 + 3 + 1 = 6 = số chuyến bay.</p>
<div class="pitfall">"Kề" chỉ cần có chuyến bay theo chiều nào đó; "đi tới được" (reachable) thì cần đường đi có hướng. PQC có bậc vào 1, bậc ra 0: bay tới PQC được, nhưng trong mạng này không bao giờ bay ra — chỉ nhìn quan hệ kề thì không thấy điều đó.</div>`],
      [9, 'Graph Terminology - 3',
        `<p class="y-chinh">🎯 Two special kinds of edge — parallel edges and self-loops — decide whether a graph is simple, a multigraph or a pseudograph.</p>
<ul>
<li><strong>Parallel (multiple) edges</strong>: two undirected edges with the same end vertices, or two directed edges with the same origin <em>and</em> the same destination. They exist because the definition calls E a <em>collection</em>, not a set; a flight network can contain them.</li>
<li><strong>Self-loop</strong>: an edge whose two endpoints coincide — on a city map, a street that curves back to where it started.</li>
<li><strong>Simple graph</strong>: no parallel edges and no self-loops, so E really is a set of vertex pairs. A graph is considered simple unless otherwise specified.</li>
<li><strong>Multigraph</strong> (the slide's definition): multiple edges but no loops. <strong>Pseudograph</strong> (class question CQ9.1): a graph in which self-loops are allowed as well — a multigraph that may also have loops.</li>
</ul>
<pre><code class="language-java">public class GraphKind {
    static char[] v = {'A', 'B', 'C'};

    // a[i][j] = number of edges between i and j; a[i][i] = number of loops at i
    static void classify(String name, int[][] a) {
        boolean loop = false, parallel = false;
        int m = 0, sum = 0;
        String degs = "";
        for (int i = 0; i &lt; a.length; i++) {
            if (a[i][i] &gt; 0) loop = true;
            int deg = a[i][i];                           // a loop adds 2: once in the row sum, once here
            for (int j = 0; j &lt; a.length; j++) {
                deg += a[i][j];
                if (j &gt; i &amp;&amp; a[i][j] &gt; 1) parallel = true;
                if (j &gt;= i) m += a[i][j];                // count every edge (and loop) once
            }
            sum += deg;
            degs += " " + v[i] + deg;
        }
        String kind = loop ? "pseudograph" : parallel ? "multigraph" : "simple graph";
        System.out.println(name + ": " + kind + "  degrees" + degs + "  sum " + sum + " = 2*" + m + " edges");
    }

    public static void main(String[] args) {
        classify("G1", new int[][] {{0, 1, 1}, {1, 0, 1}, {1, 1, 0}});   // triangle A-B-C
        classify("G2", new int[][] {{0, 2, 0}, {2, 0, 1}, {0, 1, 0}});   // A-B twice, B-C
        classify("G3", new int[][] {{0, 1, 0}, {1, 0, 1}, {0, 1, 1}});   // A-B, B-C, loop at C
    }
}</code></pre>
<div class="out">G1: simple graph &nbsp;degrees A2 B2 C2 &nbsp;sum 6 = 2*3 edges<br>
G2: multigraph &nbsp;degrees A2 B3 C1 &nbsp;sum 6 = 2*3 edges<br>
G3: pseudograph &nbsp;degrees A1 B2 C3 &nbsp;sum 6 = 2*3 edges</div>
<p>Here each cell holds a <em>count</em>: <code>a[i][j]</code> = number of edges between i and j, <code>a[i][i]</code> = number of loops at i. By convention a loop adds <strong>2</strong> to the degree of its vertex (you leave and come back), which keeps Σ deg = 2|E| true for G3.</p>
<div class="pitfall">In a digraph, A → B and B → A are <em>not</em> parallel edges (different origins), so a digraph containing both can still be simple. "Parallel" means the same origin and the same destination.</div>`,
        `<p class="y-chinh">🎯 Hai loại cạnh đặc biệt — cạnh song song và khuyên — quyết định đồ thị là đơn đồ thị, đa đồ thị hay giả đồ thị.</p>
<ul>
<li><strong>Cạnh song song hay cạnh bội (parallel / multiple edges)</strong>: hai cạnh vô hướng có cùng hai đầu mút, hoặc hai cạnh có hướng cùng gốc <em>và</em> cùng đích. Chúng có mặt được vì định nghĩa gọi E là một "bộ sưu tập" (collection, cho phép lặp) chứ không phải một tập hợp (set); mạng chuyến bay có thể có chúng.</li>
<li><strong>Khuyên (self-loop)</strong>: cạnh có hai đầu mút trùng nhau — trên bản đồ thành phố là một con phố vòng về đúng chỗ xuất phát.</li>
<li><strong>Đơn đồ thị (simple graph)</strong>: không cạnh song song, không khuyên, nên E đúng là một tập các cặp đỉnh. Nếu không nói gì thêm thì đồ thị được hiểu là đơn đồ thị.</li>
<li><strong>Đa đồ thị (multigraph)</strong> (theo slide): có cạnh bội nhưng không có khuyên. <strong>Giả đồ thị (pseudograph)</strong> (câu hỏi trên lớp CQ9.1): đồ thị được phép có cả khuyên — một đa đồ thị có thể có thêm khuyên.</li>
</ul>
<pre><code class="language-java">public class GraphKind {
    static char[] v = {'A', 'B', 'C'};

    // a[i][j] = số cạnh nối i và j; a[i][i] = số khuyên tại i
    static void classify(String name, int[][] a) {
        boolean loop = false, parallel = false;
        int m = 0, sum = 0;
        String degs = "";
        for (int i = 0; i &lt; a.length; i++) {
            if (a[i][i] &gt; 0) loop = true;
            int deg = a[i][i];                           // khuyên cộng 2: một lần trong tổng hàng, một lần ở đây
            for (int j = 0; j &lt; a.length; j++) {
                deg += a[i][j];
                if (j &gt; i &amp;&amp; a[i][j] &gt; 1) parallel = true;
                if (j &gt;= i) m += a[i][j];                // đếm mỗi cạnh (và khuyên) một lần
            }
            sum += deg;
            degs += " " + v[i] + deg;
        }
        String kind = loop ? "pseudograph" : parallel ? "multigraph" : "simple graph";
        System.out.println(name + ": " + kind + "  degrees" + degs + "  sum " + sum + " = 2*" + m + " edges");
    }

    public static void main(String[] args) {
        classify("G1", new int[][] {{0, 1, 1}, {1, 0, 1}, {1, 1, 0}});   // tam giác A-B-C
        classify("G2", new int[][] {{0, 2, 0}, {2, 0, 1}, {0, 1, 0}});   // A-B hai lần, B-C
        classify("G3", new int[][] {{0, 1, 0}, {1, 0, 1}, {0, 1, 1}});   // A-B, B-C, khuyên tại C
    }
}</code></pre>
<div class="out">G1: simple graph &nbsp;degrees A2 B2 C2 &nbsp;sum 6 = 2*3 edges<br>
G2: multigraph &nbsp;degrees A2 B3 C1 &nbsp;sum 6 = 2*3 edges<br>
G3: pseudograph &nbsp;degrees A1 B2 C3 &nbsp;sum 6 = 2*3 edges</div>
<p>Ở đây mỗi ô chứa một <em>số đếm</em>: <code>a[i][j]</code> = số cạnh nối i và j, <code>a[i][i]</code> = số khuyên tại i. Theo quy ước, một khuyên cộng <strong>2</strong> vào bậc của đỉnh (đi ra rồi quay về), nhờ vậy Σ deg = 2|E| vẫn đúng với G3.</p>
<div class="pitfall">Trong đồ thị có hướng, A → B và B → A <em>không</em> phải cạnh song song (khác gốc), nên đồ thị có hướng chứa cả hai vẫn có thể là đơn đồ thị. "Song song" nghĩa là cùng gốc và cùng đích.</div>`],
      [10, 'Graph Terminology - 4',
        `<p class="y-chinh">🎯 A path walks from vertex to vertex along edges; a cycle is a path that comes back to its start; "simple" means no vertex is repeated.</p>
<ul>
<li><strong>Path</strong>: a sequence of alternating vertices and edges, starting and ending at a vertex, each edge incident to the vertex before and after it. Its <strong>length</strong> is its number of edges.</li>
<li><strong>Cycle</strong>: a path that starts and ends at the same vertex and includes at least one edge.</li>
<li><strong>Simple path</strong>: every vertex distinct. <strong>Simple cycle</strong>: every vertex distinct except the first and the last.</li>
<li><strong>Directed path / directed cycle</strong>: all edges directed and traversed along their direction.</li>
<li>In a <strong>simple graph</strong> the edges can be left out: a path is just a list of adjacent vertices, e.g. A B D E.</li>
</ul>
<pre><code class="language-java">public class PathCheck {
    static int[][] a = new int[5][5];                     // vertices A..E

    static void edge(char x, char y) { a[x - 'A'][y - 'A'] = a[y - 'A'][x - 'A'] = 1; }

    static String kind(String s) {
        for (int i = 0; i + 1 &lt; s.length(); i++)          // every step must follow an edge
            if (a[s.charAt(i) - 'A'][s.charAt(i + 1) - 'A'] == 0)
                return "not a path: " + s.charAt(i) + "-" + s.charAt(i + 1) + " is not an edge";
        int len = s.length() - 1;                          // length = number of edges
        boolean closed = len &gt;= 1 &amp;&amp; s.charAt(0) == s.charAt(len);
        String body = closed ? s.substring(1) : s;         // a cycle may repeat its first vertex at the end
        boolean distinct = true;
        for (int i = 0; i &lt; body.length(); i++)
            if (body.indexOf(body.charAt(i)) != i) distinct = false;
        if (closed) return (distinct ? "simple cycle" : "cycle, not simple") + ", length " + len;
        return (distinct ? "simple path" : "path, not simple") + ", length " + len;
    }

    public static void main(String[] args) {
        edge('A', 'B'); edge('A', 'C'); edge('B', 'C'); edge('B', 'D'); edge('C', 'D'); edge('D', 'E');
        String[] tests = {"ABDE", "ABDCB", "ABCA", "BDCB", "ABDCBA", "ACE", "C"};
        for (String s : tests) System.out.println(s + ": " + kind(s));
    }
}</code></pre>
<div class="out">ABDE: simple path, length 3<br>
ABDCB: path, not simple, length 4<br>
ABCA: simple cycle, length 3<br>
BDCB: simple cycle, length 3<br>
ABDCBA: cycle, not simple, length 5<br>
ACE: not a path: C-E is not an edge<br>
C: simple path, length 0</div>
<p>The lesson's graph: A–B, A–C, B–C, B–D, C–D, D–E. Checking a list of k + 1 vertices costs O(k) with a matrix (one cell per step), plus a distinctness test for "simple".</p>
<div class="pitfall">Two classics: "length" counts edges, so A B D E has length 3, not 4. And walking A–B–A only goes back along the same edge; in a simple undirected graph a genuine simple cycle has at least 3 vertices, like A B C A.</div>`,
        `<p class="y-chinh">🎯 Đường đi (path) đi từ đỉnh này sang đỉnh khác dọc theo các cạnh; chu trình (cycle) là đường đi quay về điểm xuất phát; "đơn" (simple) nghĩa là không lặp lại đỉnh nào.</p>
<ul>
<li><strong>Đường đi (path)</strong>: dãy xen kẽ đỉnh và cạnh, bắt đầu và kết thúc ở một đỉnh, mỗi cạnh liên thuộc với đỉnh đứng trước và đứng sau nó. <strong>Độ dài (length)</strong> của nó là số cạnh.</li>
<li><strong>Chu trình (cycle)</strong>: đường đi bắt đầu và kết thúc tại cùng một đỉnh và có ít nhất một cạnh.</li>
<li><strong>Đường đi đơn (simple path)</strong>: mọi đỉnh khác nhau. <strong>Chu trình đơn (simple cycle)</strong>: mọi đỉnh khác nhau, trừ đỉnh đầu trùng đỉnh cuối.</li>
<li><strong>Đường đi / chu trình có hướng (directed path / cycle)</strong>: mọi cạnh đều có hướng và được đi đúng chiều.</li>
<li>Trong <strong>đơn đồ thị (simple graph)</strong> có thể bỏ các cạnh đi: đường đi chỉ còn là danh sách các đỉnh kề nhau, ví dụ A B D E.</li>
</ul>
<pre><code class="language-java">public class PathCheck {
    static int[][] a = new int[5][5];                     // các đỉnh A..E

    static void edge(char x, char y) { a[x - 'A'][y - 'A'] = a[y - 'A'][x - 'A'] = 1; }

    static String kind(String s) {
        for (int i = 0; i + 1 &lt; s.length(); i++)          // mỗi bước phải đi theo một cạnh
            if (a[s.charAt(i) - 'A'][s.charAt(i + 1) - 'A'] == 0)
                return "not a path: " + s.charAt(i) + "-" + s.charAt(i + 1) + " is not an edge";
        int len = s.length() - 1;                          // độ dài = số cạnh
        boolean closed = len &gt;= 1 &amp;&amp; s.charAt(0) == s.charAt(len);
        String body = closed ? s.substring(1) : s;         // chu trình được lặp đỉnh đầu ở cuối
        boolean distinct = true;
        for (int i = 0; i &lt; body.length(); i++)
            if (body.indexOf(body.charAt(i)) != i) distinct = false;
        if (closed) return (distinct ? "simple cycle" : "cycle, not simple") + ", length " + len;
        return (distinct ? "simple path" : "path, not simple") + ", length " + len;
    }

    public static void main(String[] args) {
        edge('A', 'B'); edge('A', 'C'); edge('B', 'C'); edge('B', 'D'); edge('C', 'D'); edge('D', 'E');
        String[] tests = {"ABDE", "ABDCB", "ABCA", "BDCB", "ABDCBA", "ACE", "C"};
        for (String s : tests) System.out.println(s + ": " + kind(s));
    }
}</code></pre>
<div class="out">ABDE: simple path, length 3<br>
ABDCB: path, not simple, length 4<br>
ABCA: simple cycle, length 3<br>
BDCB: simple cycle, length 3<br>
ABDCBA: cycle, not simple, length 5<br>
ACE: not a path: C-E is not an edge<br>
C: simple path, length 0</div>
<p>Đồ thị của bài: A–B, A–C, B–C, B–D, C–D, D–E. Kiểm một danh sách k + 1 đỉnh tốn O(k) trên ma trận (mỗi bước đọc một ô), cộng thêm phép kiểm "các đỉnh khác nhau" nếu hỏi tính đơn.</p>
<div class="pitfall">Hai bẫy kinh điển: "độ dài" đếm cạnh, nên A B D E có độ dài 3, không phải 4. Và đi A–B–A chỉ là quay lại theo đúng cạnh cũ; trong đơn đồ thị vô hướng, một chu trình đơn thật sự có ít nhất 3 đỉnh, như A B C A.</div>`],
      [11, 'Graph Terminology - 5',
        `<p class="y-chinh">🎯 Connectivity and the "pieces" of a graph: connected, strongly and weakly connected, subgraph, spanning subgraph, connected components, forest, tree and spanning tree.</p>
<ul>
<li><strong>Connected</strong> (undirected): there is a path between any two vertices. <strong>Strongly connected</strong> (directed): a directed path from u to v <em>and</em> from v to u for every pair. <strong>Weakly connected</strong>: connected once every directed edge is replaced by an undirected one.</li>
<li><strong>Subgraph</strong> H of G: the vertices and edges of H are subsets of those of G. <strong>Spanning subgraph</strong>: a subgraph that contains <em>all</em> the vertices of G.</li>
<li><strong>Connected components</strong>: the maximal connected subgraphs of a disconnected graph — its "islands".</li>
<li><strong>Forest</strong>: a graph without cycles. <strong>Tree</strong>: a connected forest. <strong>Spanning tree</strong>: a spanning subgraph that is a tree. Unlike chapter 4, such a tree has no designated root.</li>
</ul>
<pre><code class="language-java">public class Connectivity {
    static int n;
    static int[][] a;

    static void build(int size, String edges, boolean directed) {   // "AB AC" = edges A-B, A-C
        n = size;
        a = new int[n][n];
        for (String e : edges.split(" ")) {
            int u = e.charAt(0) - 'A', w = e.charAt(1) - 'A';
            a[u][w] = 1;
            if (!directed) a[w][u] = 1;
        }
    }

    static void dfs(int u, int[] comp, int c) {        // give number c to every vertex reachable from u
        comp[u] = c;
        for (int w = 0; w &lt; n; w++)
            if (a[u][w] &gt; 0 &amp;&amp; comp[w] == 0) dfs(w, comp, c);
    }

    static int components(int[] comp) {
        int c = 0;
        for (int u = 0; u &lt; n; u++)
            if (comp[u] == 0) dfs(u, comp, ++c);         // one new DFS = one new component
        return c;
    }

    static void undirected(String edges) {
        build(8, edges, false);
        int[] comp = new int[n];
        int c = components(comp), m = edges.split(" ").length;
        String s = "";
        for (int k = 1; k &lt;= c; k++) {
            s += " {";
            for (int u = 0; u &lt; n; u++) if (comp[u] == k) s += (char) ('A' + u);
            s += "}";
        }
        String kind = (m == n - c) ? (c == 1 ? "a tree" : "a forest") : "has a cycle";   // no cycle &lt;=&gt; m = n - c
        System.out.println(edges + " (n=8, m=" + m + "): " + c + " component(s)" + s + " -&gt; " + kind);
    }

    static void directed(String edges) {
        build(3, edges, true);
        boolean strong = true;
        for (int s = 0; s &lt; n; s++) {                    // every vertex must reach every other one
            int[] seen = new int[n];
            dfs(s, seen, 1);
            for (int x : seen) if (x == 0) strong = false;
        }
        build(3, edges, false);                          // same edges, directions forgotten
        boolean weak = components(new int[n]) == 1;
        System.out.println("digraph " + edges + ": strongly connected " + strong + ", weakly connected " + weak);
    }

    public static void main(String[] args) {
        undirected("AB AC DE FG");
        undirected("AB AC DE FG BD EF GH");
        undirected("AB AC DE FG BD EF GH CD");
        directed("AB BC CA");
        directed("AB BC AC");
    }
}</code></pre>
<div class="out">AB AC DE FG (n=8, m=4): 4 component(s) {ABC} {DE} {FG} {H} -&gt; a forest<br>
AB AC DE FG BD EF GH (n=8, m=7): 1 component(s) {ABCDEFGH} -&gt; a tree<br>
AB AC DE FG BD EF GH CD (n=8, m=8): 1 component(s) {ABCDEFGH} -&gt; has a cycle<br>
digraph AB BC CA: strongly connected true, weakly connected true<br>
digraph AB BC AC: strongly connected false, weakly connected true</div>
<p>"AB" means the edge A–B. One DFS from an unvisited vertex marks one whole component, so the number of DFS launches is the number of components: O(n²) on a matrix, O(n + m) on lists. And a graph with n vertices, m edges and c components has no cycle exactly when <strong>m = n − c</strong> — for a tree (c = 1), m = n − 1.</p>
<div class="pitfall">"Every strongly connected digraph is weakly connected" is true, the converse is false: A→B, B→C, A→C is weakly connected, yet nothing leads back to A. And "the root of a spanning tree" only makes sense once you choose a start vertex.</div>`,
        `<p class="y-chinh">🎯 Tính liên thông và các "mảnh" của đồ thị: liên thông, liên thông mạnh và yếu, đồ thị con, đồ thị con bao trùm, thành phần liên thông, rừng, cây và cây khung.</p>
<ul>
<li><strong>Liên thông (connected)</strong> (vô hướng): có đường đi giữa hai đỉnh bất kỳ. <strong>Liên thông mạnh (strongly connected)</strong> (có hướng): với mọi cặp u, v có đường đi có hướng từ u tới v <em>và</em> từ v tới u. <strong>Liên thông yếu (weakly connected)</strong>: liên thông sau khi thay mọi cạnh có hướng bằng cạnh vô hướng.</li>
<li><strong>Đồ thị con (subgraph)</strong> H của G: tập đỉnh và tập cạnh của H là tập con của G. <strong>Đồ thị con bao trùm (spanning subgraph)</strong>: đồ thị con chứa <em>mọi</em> đỉnh của G.</li>
<li><strong>Thành phần liên thông (connected component)</strong>: các đồ thị con liên thông tối đại (maximal) của một đồ thị không liên thông — các "hòn đảo" của nó.</li>
<li><strong>Rừng (forest)</strong>: đồ thị không có chu trình. <strong>Cây (tree)</strong>: rừng liên thông. <strong>Cây khung (spanning tree)</strong>: đồ thị con bao trùm và là một cây. Khác chương 4, cây ở đây không có gốc (root) định sẵn.</li>
</ul>
<pre><code class="language-java">public class Connectivity {
    static int n;
    static int[][] a;

    static void build(int size, String edges, boolean directed) {   // "AB AC" = các cạnh A-B, A-C
        n = size;
        a = new int[n][n];
        for (String e : edges.split(" ")) {
            int u = e.charAt(0) - 'A', w = e.charAt(1) - 'A';
            a[u][w] = 1;
            if (!directed) a[w][u] = 1;
        }
    }

    static void dfs(int u, int[] comp, int c) {        // gán số c cho mọi đỉnh đi tới được từ u
        comp[u] = c;
        for (int w = 0; w &lt; n; w++)
            if (a[u][w] &gt; 0 &amp;&amp; comp[w] == 0) dfs(w, comp, c);
    }

    static int components(int[] comp) {
        int c = 0;
        for (int u = 0; u &lt; n; u++)
            if (comp[u] == 0) dfs(u, comp, ++c);         // mỗi lần DFS mới = một thành phần mới
        return c;
    }

    static void undirected(String edges) {
        build(8, edges, false);
        int[] comp = new int[n];
        int c = components(comp), m = edges.split(" ").length;
        String s = "";
        for (int k = 1; k &lt;= c; k++) {
            s += " {";
            for (int u = 0; u &lt; n; u++) if (comp[u] == k) s += (char) ('A' + u);
            s += "}";
        }
        String kind = (m == n - c) ? (c == 1 ? "a tree" : "a forest") : "has a cycle";   // không có chu trình &lt;=&gt; m = n - c
        System.out.println(edges + " (n=8, m=" + m + "): " + c + " component(s)" + s + " -&gt; " + kind);
    }

    static void directed(String edges) {
        build(3, edges, true);
        boolean strong = true;
        for (int s = 0; s &lt; n; s++) {                    // đỉnh nào cũng phải tới được mọi đỉnh khác
            int[] seen = new int[n];
            dfs(s, seen, 1);
            for (int x : seen) if (x == 0) strong = false;
        }
        build(3, edges, false);                          // cùng các cạnh, bỏ chiều
        boolean weak = components(new int[n]) == 1;
        System.out.println("digraph " + edges + ": strongly connected " + strong + ", weakly connected " + weak);
    }

    public static void main(String[] args) {
        undirected("AB AC DE FG");
        undirected("AB AC DE FG BD EF GH");
        undirected("AB AC DE FG BD EF GH CD");
        directed("AB BC CA");
        directed("AB BC AC");
    }
}</code></pre>
<div class="out">AB AC DE FG (n=8, m=4): 4 component(s) {ABC} {DE} {FG} {H} -&gt; a forest<br>
AB AC DE FG BD EF GH (n=8, m=7): 1 component(s) {ABCDEFGH} -&gt; a tree<br>
AB AC DE FG BD EF GH CD (n=8, m=8): 1 component(s) {ABCDEFGH} -&gt; has a cycle<br>
digraph AB BC CA: strongly connected true, weakly connected true<br>
digraph AB BC AC: strongly connected false, weakly connected true</div>
<p>"AB" nghĩa là cạnh A–B. Một lần DFS (duyệt theo chiều sâu — depth-first search) từ một đỉnh chưa thăm đánh dấu trọn một thành phần, nên số lần khởi động DFS chính là số thành phần: O(n²) trên ma trận, O(n + m) trên danh sách kề. Và đồ thị n đỉnh, m cạnh, c thành phần không có chu trình khi và chỉ khi <strong>m = n − c</strong> — với cây (c = 1) là m = n − 1.</p>
<div class="pitfall">"Mọi đồ thị có hướng liên thông mạnh đều liên thông yếu" là ĐÚNG, chiều ngược lại SAI: A→B, B→C, A→C liên thông yếu nhưng không có đường nào quay về A. Còn "gốc của cây khung" chỉ có nghĩa sau khi bạn chọn một đỉnh xuất phát.</div>`],
      [12, 'Graph Terminology - 6',
        `<p class="y-chinh">🎯 The weak spots of a connected graph: a vertex (articulation point) or an edge (bridge) whose removal splits the graph; connected pieces with no articulation point are blocks — and a depth-first traversal checks connectivity.</p>
<ul>
<li><strong>Articulation point (cut-vertex)</strong>: a vertex whose removal, together with its incident edges, leaves two vertices a and b with no path between them.</li>
<li><strong>Bridge (cut-edge)</strong>: an edge whose removal splits the graph into two parts.</li>
<li><strong>Block</strong>: the slide says "connected subgraphs with no articulation points or bridges". The standard definition is a <em>maximal</em> connected subgraph with no articulation point of its own — a biconnected component; under it, a single bridge together with its two ends is also a block (the smallest kind).</li>
<li><strong>Tool</strong>: "we can use depth-first traverse to check the connectivity" — remove the candidate, run one DFS, see whether every remaining vertex is reached.</li>
</ul>
<pre><code class="language-plaintext">the lesson's own graph: 7 vertices, 8 edges

  A               E
  | \\           / |
  |  C ------- D  |
  | /           \\ |
  B               F ------- G</code></pre>
<pre><code class="language-java">public class CutVertices {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
    static int n = v.length;
    static int[][] a = new int[n][n];

    static void edge(int x, int y) { a[x][y] = a[y][x] = 1; }

    static void dfs(int u, boolean[] seen, int gone) {  // DFS that ignores the removed vertex
        seen[u] = true;
        for (int w = 0; w &lt; n; w++)
            if (w != gone &amp;&amp; a[u][w] &gt; 0 &amp;&amp; !seen[w]) dfs(w, seen, gone);
    }

    static int components(int gone) {                   // gone = removed vertex, or -1
        boolean[] seen = new boolean[n];
        int c = 0;
        for (int u = 0; u &lt; n; u++)
            if (u != gone &amp;&amp; !seen[u]) { c++; dfs(u, seen, gone); }
        return c;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {0, 2}, {1, 2}, {2, 3}, {3, 4}, {3, 5}, {4, 5}, {5, 6}};
        for (int[] e : edges) edge(e[0], e[1]);
        int base = components(-1);
        System.out.println("components of the whole graph: " + base);
        String counts = "", cut = "", bridges = "";
        for (int x = 0; x &lt; n; x++) {                   // remove each vertex in turn
            int c = components(x);
            counts += " " + v[x] + ":" + c;
            if (c &gt; base) cut += " " + v[x];
        }
        for (int[] e : edges) {                         // remove each edge in turn
            a[e[0]][e[1]] = a[e[1]][e[0]] = 0;
            if (components(-1) &gt; base) bridges += " " + v[e[0]] + "-" + v[e[1]];
            a[e[0]][e[1]] = a[e[1]][e[0]] = 1;          // put it back
        }
        System.out.println("components after removing a vertex:" + counts);
        System.out.println("articulation points (cut-vertices):" + cut);
        System.out.println("bridges (cut-edges):" + bridges);
    }
}</code></pre>
<div class="out">components of the whole graph: 1<br>
components after removing a vertex: A:1 B:1 C:2 D:2 E:1 F:2 G:1<br>
articulation points (cut-vertices): C D F<br>
bridges (cut-edges): C-D F-G</div>
<p>Blocks (read off by hand): {A, B, C}, {C, D}, {D, E, F}, {F, G}; two neighbouring blocks share exactly one vertex, an articulation point. <strong>Cost of this brute force:</strong> n removals × one O(n²) DFS on the matrix = O(n³); Tarjan's low-link method finds them all in a single DFS, O(n + m) — beyond the syllabus.</p>
<div class="pitfall">The slide's sentence reads as if the two separated subgraphs "are called articulation points". They are not: the <strong>vertex you removed</strong> is the articulation point (cut-vertex); the pieces are just the parts of the split graph. Likewise a bridge is an <strong>edge</strong>. FE options love to swap "vertex" and "edge" here.</div>`,
        `<p class="y-chinh">🎯 Những điểm yếu của một đồ thị liên thông: một đỉnh (đỉnh khớp) hoặc một cạnh (cầu) mà xoá đi thì đồ thị bị tách rời; các mảnh liên thông không có đỉnh khớp gọi là khối — và duyệt theo chiều sâu dùng để kiểm tính liên thông.</p>
<ul>
<li><strong>Đỉnh khớp (articulation point, cut-vertex)</strong>: đỉnh mà khi xoá nó cùng các cạnh liên thuộc, sẽ có hai đỉnh a và b không còn đường đi nào nối nhau.</li>
<li><strong>Cầu (bridge, cut-edge)</strong>: cạnh mà xoá đi thì đồ thị bị tách làm hai phần.</li>
<li><strong>Khối (block)</strong>: slide viết "các đồ thị con liên thông không có đỉnh khớp hay cầu". Định nghĩa chuẩn là đồ thị con liên thông <em>tối đại (maximal)</em> không có đỉnh khớp của riêng nó — tức một thành phần song liên thông (biconnected component); theo định nghĩa này, một cây cầu cùng hai đầu mút của nó cũng là một khối (loại nhỏ nhất).</li>
<li><strong>Công cụ</strong>: "dùng duyệt theo chiều sâu (depth-first traversal) để kiểm tính liên thông" — xoá thử phần tử nghi ngờ, chạy một lần DFS, xem mọi đỉnh còn lại có được thăm hết không.</li>
</ul>
<pre><code class="language-plaintext">đồ thị của bài: 7 đỉnh, 8 cạnh

  A               E
  | \\           / |
  |  C ------- D  |
  | /           \\ |
  B               F ------- G</code></pre>
<pre><code class="language-java">public class CutVertices {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
    static int n = v.length;
    static int[][] a = new int[n][n];

    static void edge(int x, int y) { a[x][y] = a[y][x] = 1; }

    static void dfs(int u, boolean[] seen, int gone) {  // DFS bỏ qua đỉnh đã bị xoá
        seen[u] = true;
        for (int w = 0; w &lt; n; w++)
            if (w != gone &amp;&amp; a[u][w] &gt; 0 &amp;&amp; !seen[w]) dfs(w, seen, gone);
    }

    static int components(int gone) {                   // gone = đỉnh bị xoá, hoặc -1
        boolean[] seen = new boolean[n];
        int c = 0;
        for (int u = 0; u &lt; n; u++)
            if (u != gone &amp;&amp; !seen[u]) { c++; dfs(u, seen, gone); }
        return c;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {0, 2}, {1, 2}, {2, 3}, {3, 4}, {3, 5}, {4, 5}, {5, 6}};
        for (int[] e : edges) edge(e[0], e[1]);
        int base = components(-1);
        System.out.println("components of the whole graph: " + base);
        String counts = "", cut = "", bridges = "";
        for (int x = 0; x &lt; n; x++) {                   // lần lượt xoá từng đỉnh
            int c = components(x);
            counts += " " + v[x] + ":" + c;
            if (c &gt; base) cut += " " + v[x];
        }
        for (int[] e : edges) {                         // lần lượt xoá từng cạnh
            a[e[0]][e[1]] = a[e[1]][e[0]] = 0;
            if (components(-1) &gt; base) bridges += " " + v[e[0]] + "-" + v[e[1]];
            a[e[0]][e[1]] = a[e[1]][e[0]] = 1;          // trả cạnh lại
        }
        System.out.println("components after removing a vertex:" + counts);
        System.out.println("articulation points (cut-vertices):" + cut);
        System.out.println("bridges (cut-edges):" + bridges);
    }
}</code></pre>
<div class="out">components of the whole graph: 1<br>
components after removing a vertex: A:1 B:1 C:2 D:2 E:1 F:2 G:1<br>
articulation points (cut-vertices): C D F<br>
bridges (cut-edges): C-D F-G</div>
<p>Các khối (đọc bằng tay): {A, B, C}, {C, D}, {D, E, F}, {F, G}; hai khối cạnh nhau chung đúng một đỉnh — chính là một đỉnh khớp. <strong>Chi phí của cách vét cạn (brute force) này:</strong> n lần xoá × một lần DFS O(n²) trên ma trận = O(n³); phương pháp low-link của Tarjan tìm tất cả chỉ trong một lần DFS, O(n + m) — ngoài giáo trình.</p>
<div class="pitfall">Câu trên slide đọc như thể hai đồ thị con bị tách ra "được gọi là các đỉnh khớp". KHÔNG phải: <strong>đỉnh bị xoá</strong> mới là đỉnh khớp (cut-vertex); các mảnh chỉ là những phần của đồ thị sau khi tách. Tương tự, cầu là một <strong>cạnh</strong>. Phương án FE rất hay đánh tráo "đỉnh" với "cạnh" ở chỗ này.</div>`],
      [13, 'Graph Examples - 3',
        `<p class="y-chinh">🎯 The Internet as a graph: computers are vertices and communication connections are undirected edges; one domain is a subgraph — and if its links form a spanning tree, a single broken cable disconnects it.</p>
<ul>
<li>A domain such as wiley.com — its computers and the connections between them — is a <strong>subgraph</strong> of the Internet.</li>
<li>If that subgraph is <strong>connected</strong>, two users inside the domain can email each other without their packets ever leaving the domain.</li>
<li>If its edges form a <strong>spanning tree</strong>, every edge is a bridge (slide 12): pulling out any one cable leaves the subgraph disconnected.</li>
</ul>
<pre><code class="language-java">public class TreeFragile {
    static char[] v = {'A', 'B', 'C', 'D', 'E'};        // 5 computers of one domain
    static int n = v.length;
    static int[][] a = new int[n][n];

    static int reach(int u, boolean[] seen) {           // DFS: how many computers can u reach?
        seen[u] = true;
        int cnt = 1;
        for (int w = 0; w &lt; n; w++)
            if (a[u][w] &gt; 0 &amp;&amp; !seen[w]) cnt += reach(w, seen);
        return cnt;
    }

    static void cutEach(int[][] cables) {
        for (int[] c : cables) {
            a[c[0]][c[1]] = a[c[1]][c[0]] = 0;          // pull the cable out
            boolean ok = reach(0, new boolean[n]) == n;
            System.out.println("  cut " + v[c[0]] + "-" + v[c[1]] + " -&gt; still connected? " + ok);
            a[c[0]][c[1]] = a[c[1]][c[0]] = 1;          // plug it back
        }
    }

    public static void main(String[] args) {
        int[][] tree = {{0, 1}, {0, 2}, {2, 3}, {2, 4}};   // 4 cables = n - 1: a spanning tree
        for (int[] c : tree) a[c[0]][c[1]] = a[c[1]][c[0]] = 1;
        System.out.println("spanning tree, " + tree.length + " cables for " + n + " computers:");
        cutEach(tree);
        a[1][3] = a[3][1] = 1;                          // one extra cable B-D closes the cycle A-B-D-C-A
        System.out.println("with one extra cable B-D:");
        cutEach(new int[][] {{0, 1}, {0, 2}, {2, 3}, {2, 4}, {1, 3}});
    }
}</code></pre>
<div class="out">spanning tree, 4 cables for 5 computers:<br>
&nbsp;&nbsp;cut A-B -&gt; still connected? false<br>
&nbsp;&nbsp;cut A-C -&gt; still connected? false<br>
&nbsp;&nbsp;cut C-D -&gt; still connected? false<br>
&nbsp;&nbsp;cut C-E -&gt; still connected? false<br>
with one extra cable B-D:<br>
&nbsp;&nbsp;cut A-B -&gt; still connected? true<br>
&nbsp;&nbsp;cut A-C -&gt; still connected? true<br>
&nbsp;&nbsp;cut C-D -&gt; still connected? true<br>
&nbsp;&nbsp;cut C-E -&gt; still connected? false<br>
&nbsp;&nbsp;cut B-D -&gt; still connected? true</div>
<p><strong>Why:</strong> a tree on n vertices has exactly n − 1 edges, the minimum needed to connect n vertices; remove one and n − 2 edges can never connect n vertices. One extra cable closes a cycle (A-B-D-C-A), and every edge on that cycle stops being a bridge — C-E, off the cycle, is still one. That is the idea behind redundant network links.</p>
<p class="meo">🧠 <strong>Remember:</strong> a tree is the cheapest way to connect everything (fewest cables) and has zero tolerance to failure; each extra edge on a cycle buys one spare route.</p>`,
        `<p class="y-chinh">🎯 Internet nhìn như một đồ thị: máy tính là đỉnh, kết nối truyền thông (communication connection) là cạnh vô hướng; một miền (domain) là một đồ thị con — và nếu các kết nối của nó tạo thành cây khung thì chỉ một sợi cáp đứt là mất liên thông.</p>
<ul>
<li>Một domain như wiley.com — các máy tính của nó cùng kết nối giữa chúng — là một <strong>đồ thị con (subgraph)</strong> của Internet.</li>
<li>Nếu đồ thị con đó <strong>liên thông (connected)</strong>, hai người dùng trong domain gửi email cho nhau mà các gói tin (packet) không bao giờ phải rời khỏi domain.</li>
<li>Nếu các cạnh của nó tạo thành một <strong>cây khung (spanning tree)</strong> thì mọi cạnh đều là cầu (bridge, slide 12): rút bất kỳ sợi cáp nào ra, đồ thị con cũng mất liên thông.</li>
</ul>
<pre><code class="language-java">public class TreeFragile {
    static char[] v = {'A', 'B', 'C', 'D', 'E'};        // 5 máy tính của một domain
    static int n = v.length;
    static int[][] a = new int[n][n];

    static int reach(int u, boolean[] seen) {           // DFS: từ u tới được bao nhiêu máy?
        seen[u] = true;
        int cnt = 1;
        for (int w = 0; w &lt; n; w++)
            if (a[u][w] &gt; 0 &amp;&amp; !seen[w]) cnt += reach(w, seen);
        return cnt;
    }

    static void cutEach(int[][] cables) {
        for (int[] c : cables) {
            a[c[0]][c[1]] = a[c[1]][c[0]] = 0;          // rút sợi cáp ra
            boolean ok = reach(0, new boolean[n]) == n;
            System.out.println("  cut " + v[c[0]] + "-" + v[c[1]] + " -&gt; still connected? " + ok);
            a[c[0]][c[1]] = a[c[1]][c[0]] = 1;          // cắm lại
        }
    }

    public static void main(String[] args) {
        int[][] tree = {{0, 1}, {0, 2}, {2, 3}, {2, 4}};   // 4 cáp = n - 1: một cây khung
        for (int[] c : tree) a[c[0]][c[1]] = a[c[1]][c[0]] = 1;
        System.out.println("spanning tree, " + tree.length + " cables for " + n + " computers:");
        cutEach(tree);
        a[1][3] = a[3][1] = 1;                          // thêm cáp B-D tạo chu trình A-B-D-C-A
        System.out.println("with one extra cable B-D:");
        cutEach(new int[][] {{0, 1}, {0, 2}, {2, 3}, {2, 4}, {1, 3}});
    }
}</code></pre>
<div class="out">spanning tree, 4 cables for 5 computers:<br>
&nbsp;&nbsp;cut A-B -&gt; still connected? false<br>
&nbsp;&nbsp;cut A-C -&gt; still connected? false<br>
&nbsp;&nbsp;cut C-D -&gt; still connected? false<br>
&nbsp;&nbsp;cut C-E -&gt; still connected? false<br>
with one extra cable B-D:<br>
&nbsp;&nbsp;cut A-B -&gt; still connected? true<br>
&nbsp;&nbsp;cut A-C -&gt; still connected? true<br>
&nbsp;&nbsp;cut C-D -&gt; still connected? true<br>
&nbsp;&nbsp;cut C-E -&gt; still connected? false<br>
&nbsp;&nbsp;cut B-D -&gt; still connected? true</div>
<p><strong>Vì sao:</strong> cây n đỉnh có đúng n − 1 cạnh, số cạnh tối thiểu để nối n đỉnh; bớt một cạnh thì n − 2 cạnh không bao giờ nối nổi n đỉnh. Thêm một sợi cáp là khép một chu trình (A-B-D-C-A), và mọi cạnh trên chu trình đó thôi là cầu — riêng C-E nằm ngoài chu trình vẫn là cầu. Đó là ý tưởng của đường truyền dự phòng (redundant link) trong mạng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cây là cách nối mọi thứ rẻ nhất (ít cáp nhất) nhưng không chịu nổi một sự cố nào; mỗi cạnh thêm vào nằm trên chu trình là mua thêm một đường dự phòng.</p>`],
      [14, 'Graph Examples - 4',
        `<p class="y-chinh">🎯 Six kinds of graph side by side — simple directed, simple undirected, weighted, undirected multigraph, directed multigraph and a graph with loops — so that you can name any graph you are shown.</p>
<p>The slide draws one small graph for each caption. Here each kind gets the lesson's own 3-vertex example (A, B, C), and the program turns it into an adjacency matrix (rows A, B, C):</p>
<table>
<thead><tr><th>Kind</th><th>The lesson's example</th><th>Directed?</th><th>Parallel edges?</th><th>Loops?</th><th>Simple?</th></tr></thead>
<tbody>
<tr><td>Simple directed graph</td><td>A→B, B→C, C→A</td><td>yes</td><td>no</td><td>no</td><td>yes</td></tr>
<tr><td>Simple undirected graph</td><td>A–B, B–C</td><td>no</td><td>no</td><td>no</td><td>yes</td></tr>
<tr><td>Weighted graph</td><td>A–B (4), B–C (7), A–C (2)</td><td>no</td><td>no</td><td>no</td><td>yes</td></tr>
<tr><td>Undirected multigraph</td><td>A–B twice, B–C</td><td>no</td><td>yes</td><td>no</td><td>no</td></tr>
<tr><td>Directed multigraph</td><td>A→B twice, B→A, B→C</td><td>yes</td><td>yes (A→B)</td><td>no</td><td>no</td></tr>
<tr><td>Undirected graph with a loop (pseudograph)</td><td>A–B, B–C, C–C</td><td>no</td><td>no</td><td>yes</td><td>no</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class GraphKinds {
    // edges {u, v, w} on vertices A=0, B=1, C=2; w = 1 when the graph has no weights
    static void show(String name, boolean directed, boolean weighted, int[][] edges) {
        int[][] a = new int[3][3];
        boolean loop = false, parallel = false;
        for (int[] e : edges) {
            if (e[0] == e[1]) loop = true;
            if (a[e[0]][e[1]] != 0) parallel = true;    // this ordered pair already has an edge
            a[e[0]][e[1]] += e[2];                      // weight, or +1 for every parallel edge
            if (!directed &amp;&amp; e[0] != e[1]) a[e[1]][e[0]] += e[2];
        }
        String m = "";
        for (int[] row : a) m += " [" + row[0] + " " + row[1] + " " + row[2] + "]";
        String kind = (directed ? "directed" : "undirected") + (weighted ? ", weighted" : "")
                + (loop ? ", self-loop" : "") + (parallel ? ", parallel edges" : "")
                + (loop || parallel ? "" : ", simple");
        System.out.println(String.format("%-18s%s  %s", name, m, kind));
    }

    public static void main(String[] args) {
        show("simple directed", true, false, new int[][] {{0, 1, 1}, {1, 2, 1}, {2, 0, 1}});
        show("simple undirected", false, false, new int[][] {{0, 1, 1}, {1, 2, 1}});
        show("weighted", false, true, new int[][] {{0, 1, 4}, {1, 2, 7}, {0, 2, 2}});
        show("undirected multi", false, false, new int[][] {{0, 1, 1}, {0, 1, 1}, {1, 2, 1}});
        show("directed multi", true, false, new int[][] {{0, 1, 1}, {0, 1, 1}, {1, 0, 1}, {1, 2, 1}});
        show("with a loop", false, false, new int[][] {{0, 1, 1}, {1, 2, 1}, {2, 2, 1}});
    }
}</code></pre>
<div class="out">simple directed &nbsp;&nbsp;&nbsp;[0 1 0] [0 0 1] [1 0 0] &nbsp;directed, simple<br>
simple undirected &nbsp;[0 1 0] [1 0 1] [0 1 0] &nbsp;undirected, simple<br>
weighted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0 4 2] [4 0 7] [2 7 0] &nbsp;undirected, weighted, simple<br>
undirected multi &nbsp;&nbsp;[0 2 0] [2 0 1] [0 1 0] &nbsp;undirected, parallel edges<br>
directed multi &nbsp;&nbsp;&nbsp;&nbsp;[0 2 0] [1 0 1] [0 0 0] &nbsp;directed, parallel edges<br>
with a loop &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0 1 0] [1 0 1] [0 1 1] &nbsp;undirected, self-loop</div>
<ul>
<li>The captions say "Single directed/undirected graph"; the textbook term is <strong>simple</strong> directed/undirected graph (no loops, no parallel edges).</li>
<li>One caption on the slide recalls the rule: no multiple edges and no loops ⇒ simple. Direction and weights do not change that — the weighted example above is simple.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> name any graph with three questions — arrows? (directed) numbers on the edges? (weighted) two edges between one pair, or an edge from a vertex to itself? (multigraph / pseudograph). "No" to the last question ⇒ simple.</p>
<div class="pitfall">The same cell means different things: in a weighted graph <code>a[A][C] = 2</code> is a weight, in a multigraph <code>a[A][B] = 2</code> means "two edges". A PE statement always says which one — read it before you add up a matrix. (For loops, some books write 2 on the diagonal of an undirected graph; here a cell counts loops.)</div>`,
        `<p class="y-chinh">🎯 Sáu loại đồ thị đặt cạnh nhau — đơn đồ thị có hướng, đơn đồ thị vô hướng, đồ thị có trọng số, đa đồ thị vô hướng, đa đồ thị có hướng và đồ thị có khuyên — để thấy đồ thị nào cũng gọi đúng tên được.</p>
<p>Slide vẽ mỗi chú thích một đồ thị nhỏ. Ở đây mỗi loại có một ví dụ riêng của bài với 3 đỉnh (A, B, C), và chương trình đổi nó thành ma trận kề (các hàng A, B, C):</p>
<table>
<thead><tr><th>Loại</th><th>Ví dụ của bài</th><th>Có hướng?</th><th>Cạnh song song?</th><th>Khuyên?</th><th>Đơn?</th></tr></thead>
<tbody>
<tr><td>Đơn đồ thị có hướng (simple directed graph)</td><td>A→B, B→C, C→A</td><td>có</td><td>không</td><td>không</td><td>có</td></tr>
<tr><td>Đơn đồ thị vô hướng (simple undirected graph)</td><td>A–B, B–C</td><td>không</td><td>không</td><td>không</td><td>có</td></tr>
<tr><td>Đồ thị có trọng số (weighted graph)</td><td>A–B (4), B–C (7), A–C (2)</td><td>không</td><td>không</td><td>không</td><td>có</td></tr>
<tr><td>Đa đồ thị vô hướng (undirected multigraph)</td><td>A–B hai lần, B–C</td><td>không</td><td>có</td><td>không</td><td>không</td></tr>
<tr><td>Đa đồ thị có hướng (directed multigraph)</td><td>A→B hai lần, B→A, B→C</td><td>có</td><td>có (A→B)</td><td>không</td><td>không</td></tr>
<tr><td>Đồ thị vô hướng có khuyên (giả đồ thị — pseudograph)</td><td>A–B, B–C, C–C</td><td>không</td><td>không</td><td>có</td><td>không</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class GraphKinds {
    // cạnh {u, v, w} trên các đỉnh A=0, B=1, C=2; w = 1 nếu đồ thị không có trọng số
    static void show(String name, boolean directed, boolean weighted, int[][] edges) {
        int[][] a = new int[3][3];
        boolean loop = false, parallel = false;
        for (int[] e : edges) {
            if (e[0] == e[1]) loop = true;
            if (a[e[0]][e[1]] != 0) parallel = true;    // cặp có thứ tự này đã có cạnh
            a[e[0]][e[1]] += e[2];                      // trọng số, hoặc +1 cho mỗi cạnh song song
            if (!directed &amp;&amp; e[0] != e[1]) a[e[1]][e[0]] += e[2];
        }
        String m = "";
        for (int[] row : a) m += " [" + row[0] + " " + row[1] + " " + row[2] + "]";
        String kind = (directed ? "directed" : "undirected") + (weighted ? ", weighted" : "")
                + (loop ? ", self-loop" : "") + (parallel ? ", parallel edges" : "")
                + (loop || parallel ? "" : ", simple");
        System.out.println(String.format("%-18s%s  %s", name, m, kind));
    }

    public static void main(String[] args) {
        show("simple directed", true, false, new int[][] {{0, 1, 1}, {1, 2, 1}, {2, 0, 1}});
        show("simple undirected", false, false, new int[][] {{0, 1, 1}, {1, 2, 1}});
        show("weighted", false, true, new int[][] {{0, 1, 4}, {1, 2, 7}, {0, 2, 2}});
        show("undirected multi", false, false, new int[][] {{0, 1, 1}, {0, 1, 1}, {1, 2, 1}});
        show("directed multi", true, false, new int[][] {{0, 1, 1}, {0, 1, 1}, {1, 0, 1}, {1, 2, 1}});
        show("with a loop", false, false, new int[][] {{0, 1, 1}, {1, 2, 1}, {2, 2, 1}});
    }
}</code></pre>
<div class="out">simple directed &nbsp;&nbsp;&nbsp;[0 1 0] [0 0 1] [1 0 0] &nbsp;directed, simple<br>
simple undirected &nbsp;[0 1 0] [1 0 1] [0 1 0] &nbsp;undirected, simple<br>
weighted &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0 4 2] [4 0 7] [2 7 0] &nbsp;undirected, weighted, simple<br>
undirected multi &nbsp;&nbsp;[0 2 0] [2 0 1] [0 1 0] &nbsp;undirected, parallel edges<br>
directed multi &nbsp;&nbsp;&nbsp;&nbsp;[0 2 0] [1 0 1] [0 0 0] &nbsp;directed, parallel edges<br>
with a loop &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0 1 0] [1 0 1] [0 1 1] &nbsp;undirected, self-loop</div>
<ul>
<li>Chú thích trên slide ghi "Single directed/undirected graph"; thuật ngữ chuẩn trong sách là <strong>simple</strong> — đơn đồ thị có hướng/vô hướng (không khuyên, không cạnh song song).</li>
<li>Một chú thích trên slide nhắc lại luật: không cạnh bội và không khuyên ⇒ đơn đồ thị. Có hướng hay có trọng số (weight) không làm thay đổi điều đó — ví dụ có trọng số ở trên vẫn là đơn đồ thị.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> gọi tên mọi đồ thị bằng ba câu hỏi — có mũi tên không? (có hướng) có số trên cạnh không? (có trọng số) có hai cạnh giữa một cặp đỉnh, hay cạnh từ một đỉnh về chính nó không? (đa đồ thị / giả đồ thị). Trả lời "không" cho câu cuối ⇒ đơn đồ thị.</p>
<div class="pitfall">Cùng một ô nhưng nghĩa khác nhau: ở đồ thị có trọng số <code>a[A][C] = 2</code> là trọng số, ở đa đồ thị <code>a[A][B] = 2</code> nghĩa là "hai cạnh". Đề PE luôn nói rõ là loại nào — đọc kỹ trước khi cộng các ô của ma trận. (Với khuyên, có sách ghi 2 trên đường chéo của đồ thị vô hướng; ở đây mỗi ô đếm số khuyên.)</div>`],
      [15, 'Graph Terminology - 7',
        `<p class="y-chinh">🎯 A complete graph joins every pair of vertices by an edge; the simple complete graph on n vertices, Kn, has n(n − 1)/2 edges. The slide also starts the formal definition of a subgraph: G' = (V', E') with V' ⊆ V and E' ⊆ E.</p>
<p class="nhan">Why n(n − 1)/2 — class question CQ9.3</p>
<ul>
<li>Each of the n vertices is joined to the other n − 1, which makes n(n − 1) edge-ends; every edge has two ends, so divide by 2 (the handshake theorem of slide 7).</li>
<li>Same number, counted another way: the ways to choose 2 vertices out of n, C(n, 2).</li>
<li>A complete <em>directed</em> graph (an edge each way for every pair) has n(n − 1) edges.</li>
</ul>
<pre><code class="language-java">public class CompleteGraph {
    public static void main(String[] args) {
        for (int n = 1; n &lt;= 6; n++) {
            int[][] a = new int[n][n];
            int edges = 0;
            for (int i = 0; i &lt; n; i++)
                for (int j = i + 1; j &lt; n; j++) {        // every pair i &lt; j gets exactly one edge
                    a[i][j] = a[j][i] = 1;
                    edges++;
                }
            int deg = 0;
            for (int j = 0; j &lt; n; j++) deg += a[0][j];  // any vertex: n - 1 neighbours
            System.out.println("K" + n + ": counted " + edges + " edges, n(n-1)/2 = " + n * (n - 1) / 2
                    + ", every degree = " + deg + ", sum of degrees = " + n * deg);
        }
    }
}</code></pre>
<div class="out">K1: counted 0 edges, n(n-1)/2 = 0, every degree = 0, sum of degrees = 0<br>
K2: counted 1 edges, n(n-1)/2 = 1, every degree = 1, sum of degrees = 2<br>
K3: counted 3 edges, n(n-1)/2 = 3, every degree = 2, sum of degrees = 6<br>
K4: counted 6 edges, n(n-1)/2 = 6, every degree = 3, sum of degrees = 12<br>
K5: counted 10 edges, n(n-1)/2 = 10, every degree = 4, sum of degrees = 20<br>
K6: counted 15 edges, n(n-1)/2 = 15, every degree = 5, sum of degrees = 30</div>
<p class="nhan">Subgraph — the full definition</p>
<p>The slide's sentence is cut after "iff V". The standard definition: G' = (V', E') is a subgraph of G = (V, E) iff <strong>V' ⊆ V</strong> and <strong>E' ⊆ E</strong> — and, because G' must itself be a graph, every edge of E' has both endpoints in V'. With V' = V it is a spanning subgraph (slide 11).</p>
<pre><code class="language-java">public class Subgraph {
    static String V = "ABCD";
    static String[] E = {"AB", "AC", "BC", "CD"};       // G = (V, E), undirected

    static boolean inE(String e) {                      // AB and BA are the same undirected edge
        for (String x : E)
            if (x.equals(e) || x.equals("" + e.charAt(1) + e.charAt(0))) return true;
        return false;
    }

    static String check(String v2, String[] e2) {
        for (char c : v2.toCharArray())                 // 1) V' is a subset of V
            if (V.indexOf(c) &lt; 0) return "no: vertex " + c + " is not in V";
        for (String e : e2) {
            if (!inE(e)) return "no: edge " + e + " is not in E";   // 2) E' is a subset of E
            if (v2.indexOf(e.charAt(0)) &lt; 0 || v2.indexOf(e.charAt(1)) &lt; 0)
                return "no: edge " + e + " has an end outside V'";  // 3) H must be a graph itself
        }
        return v2.length() == V.length() ? "yes, a spanning subgraph (V' = V)" : "yes, a subgraph";
    }

    static void test(String name, String v2, String... e2) {
        System.out.println(String.format("%s  V'=%-5s E'=%-12s -&gt; %s", name, v2, String.join(",", e2), check(v2, e2)));
    }

    public static void main(String[] args) {
        System.out.println("G: V = " + V + ", E = " + String.join(",", E));
        test("H1", "ABC", "AB", "BC");
        test("H2", "ABCD", "AB", "BC", "CD");
        test("H3", "AB", "AB", "BC");
        test("H4", "ABD", "AD");
        test("H5", "ABCE", "AB");
    }
}</code></pre>
<div class="out">G: V = ABCD, E = AB,AC,BC,CD<br>
H1 &nbsp;V'=ABC &nbsp;&nbsp;E'=AB,BC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; yes, a subgraph<br>
H2 &nbsp;V'=ABCD &nbsp;E'=AB,BC,CD &nbsp;&nbsp;&nbsp;&nbsp;-&gt; yes, a spanning subgraph (V' = V)<br>
H3 &nbsp;V'=AB &nbsp;&nbsp;&nbsp;E'=AB,BC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; no: edge BC has an end outside V'<br>
H4 &nbsp;V'=ABD &nbsp;&nbsp;E'=AD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; no: edge AD is not in E<br>
H5 &nbsp;V'=ABCE &nbsp;E'=AB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; no: vertex E is not in V</div>
<div class="pitfall">Kn grows like n²: K5 has 10 edges, K6 has 15, K10 has 45. A complete graph is the densest simple graph (m = n(n − 1)/2 = O(n²)) — the one case where an adjacency matrix (slide 19) wastes almost nothing.</div>`,
        `<p class="y-chinh">🎯 Đồ thị đầy đủ (complete graph) nối mọi cặp đỉnh bằng một cạnh; đơn đồ thị đầy đủ n đỉnh, ký hiệu Kn, có n(n − 1)/2 cạnh. Slide cũng mở đầu định nghĩa hình thức của đồ thị con: G' = (V', E') với V' ⊆ V và E' ⊆ E.</p>
<p class="nhan">Vì sao là n(n − 1)/2 — câu hỏi trên lớp CQ9.3</p>
<ul>
<li>Mỗi đỉnh trong n đỉnh nối với n − 1 đỉnh còn lại, được n(n − 1) đầu cạnh; mỗi cạnh có hai đầu nên chia 2 (định lý bắt tay — handshake theorem, slide 7).</li>
<li>Đếm cách khác ra cùng con số: số cách chọn 2 đỉnh trong n đỉnh, tổ hợp chập 2 C(n, 2).</li>
<li>Đồ thị đầy đủ <em>có hướng</em> (mỗi cặp có cạnh theo cả hai chiều) có n(n − 1) cạnh.</li>
</ul>
<pre><code class="language-java">public class CompleteGraph {
    public static void main(String[] args) {
        for (int n = 1; n &lt;= 6; n++) {
            int[][] a = new int[n][n];
            int edges = 0;
            for (int i = 0; i &lt; n; i++)
                for (int j = i + 1; j &lt; n; j++) {        // mỗi cặp i &lt; j có đúng một cạnh
                    a[i][j] = a[j][i] = 1;
                    edges++;
                }
            int deg = 0;
            for (int j = 0; j &lt; n; j++) deg += a[0][j];  // đỉnh nào cũng có n - 1 láng giềng
            System.out.println("K" + n + ": counted " + edges + " edges, n(n-1)/2 = " + n * (n - 1) / 2
                    + ", every degree = " + deg + ", sum of degrees = " + n * deg);
        }
    }
}</code></pre>
<div class="out">K1: counted 0 edges, n(n-1)/2 = 0, every degree = 0, sum of degrees = 0<br>
K2: counted 1 edges, n(n-1)/2 = 1, every degree = 1, sum of degrees = 2<br>
K3: counted 3 edges, n(n-1)/2 = 3, every degree = 2, sum of degrees = 6<br>
K4: counted 6 edges, n(n-1)/2 = 6, every degree = 3, sum of degrees = 12<br>
K5: counted 10 edges, n(n-1)/2 = 10, every degree = 4, sum of degrees = 20<br>
K6: counted 15 edges, n(n-1)/2 = 15, every degree = 5, sum of degrees = 30</div>
<p class="nhan">Đồ thị con — định nghĩa đầy đủ</p>
<p>Câu trên slide bị cắt sau chữ "iff V". Định nghĩa chuẩn: G' = (V', E') là đồ thị con (subgraph) của G = (V, E) khi và chỉ khi (iff) <strong>V' ⊆ V</strong> và <strong>E' ⊆ E</strong> — và vì G' phải tự là một đồ thị, mọi cạnh của E' đều có hai đầu mút nằm trong V'. Nếu V' = V thì đó là đồ thị con bao trùm (spanning subgraph, slide 11).</p>
<pre><code class="language-java">public class Subgraph {
    static String V = "ABCD";
    static String[] E = {"AB", "AC", "BC", "CD"};       // G = (V, E), vô hướng

    static boolean inE(String e) {                      // AB và BA là cùng một cạnh vô hướng
        for (String x : E)
            if (x.equals(e) || x.equals("" + e.charAt(1) + e.charAt(0))) return true;
        return false;
    }

    static String check(String v2, String[] e2) {
        for (char c : v2.toCharArray())                 // 1) V' là tập con của V
            if (V.indexOf(c) &lt; 0) return "no: vertex " + c + " is not in V";
        for (String e : e2) {
            if (!inE(e)) return "no: edge " + e + " is not in E";   // 2) E' là tập con của E
            if (v2.indexOf(e.charAt(0)) &lt; 0 || v2.indexOf(e.charAt(1)) &lt; 0)
                return "no: edge " + e + " has an end outside V'";  // 3) H phải tự là một đồ thị
        }
        return v2.length() == V.length() ? "yes, a spanning subgraph (V' = V)" : "yes, a subgraph";
    }

    static void test(String name, String v2, String... e2) {
        System.out.println(String.format("%s  V'=%-5s E'=%-12s -&gt; %s", name, v2, String.join(",", e2), check(v2, e2)));
    }

    public static void main(String[] args) {
        System.out.println("G: V = " + V + ", E = " + String.join(",", E));
        test("H1", "ABC", "AB", "BC");
        test("H2", "ABCD", "AB", "BC", "CD");
        test("H3", "AB", "AB", "BC");
        test("H4", "ABD", "AD");
        test("H5", "ABCE", "AB");
    }
}</code></pre>
<div class="out">G: V = ABCD, E = AB,AC,BC,CD<br>
H1 &nbsp;V'=ABC &nbsp;&nbsp;E'=AB,BC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; yes, a subgraph<br>
H2 &nbsp;V'=ABCD &nbsp;E'=AB,BC,CD &nbsp;&nbsp;&nbsp;&nbsp;-&gt; yes, a spanning subgraph (V' = V)<br>
H3 &nbsp;V'=AB &nbsp;&nbsp;&nbsp;E'=AB,BC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; no: edge BC has an end outside V'<br>
H4 &nbsp;V'=ABD &nbsp;&nbsp;E'=AD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; no: edge AD is not in E<br>
H5 &nbsp;V'=ABCE &nbsp;E'=AB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; no: vertex E is not in V</div>
<div class="pitfall">Kn tăng theo n²: K5 có 10 cạnh, K6 có 15, K10 có 45. Đồ thị đầy đủ là đơn đồ thị dày (dense) nhất (m = n(n − 1)/2 = O(n²)) — trường hợp duy nhất mà ma trận kề (slide 19) gần như không phí ô nào.</div>`],
      [16, 'Summary for Basic Notions on Graph',
        `<p class="y-chinh">🎯 The slide lists about thirty basic notions; this table puts each one next to its meaning and the slide that defines it — cover the middle column and test yourself.</p>
<table>
<thead><tr><th>Notion</th><th>Meaning in one line</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>vertex, edge</td><td>an object; a connection between two objects</td><td>3–4</td></tr>
<tr><td>directed / undirected edge</td><td>ordered pair (u, v) / unordered pair {u, v}</td><td>5</td></tr>
<tr><td>directed / undirected graph</td><td>all edges directed (digraph) / all undirected</td><td>5</td></tr>
<tr><td>adjacent vertices; incident edge</td><td>joined by an edge; an edge touching that vertex</td><td>7</td></tr>
<tr><td>degree; isolated vertex</td><td>number of incident edges; a vertex of degree 0</td><td>7</td></tr>
<tr><td>parallel (multiple) edges; loop</td><td>same ends (same origin and destination); an edge from a vertex to itself</td><td>9</td></tr>
<tr><td>simple graph; multigraph</td><td>no loop, no parallel edge; parallel edges, no loop</td><td>9</td></tr>
<tr><td>path; simple path; cycle</td><td>a walk along edges; no repeated vertex; a path back to its start</td><td>10</td></tr>
<tr><td>connected; strongly / weakly connected</td><td>a path between any two vertices; directed paths both ways / connected when directions are ignored</td><td>11</td></tr>
<tr><td>subgraph; spanning subgraph</td><td>V' ⊆ V and E' ⊆ E; a subgraph with V' = V</td><td>11, 15</td></tr>
<tr><td>forest; tree; spanning tree</td><td>no cycle; connected and no cycle; a spanning subgraph that is a tree</td><td>11</td></tr>
<tr><td>complete graph; simple complete graph Kn</td><td>every pair joined; n vertices and n(n − 1)/2 edges</td><td>15</td></tr>
<tr><td>cut-vertex (articulation point); bridge (cut-edge); block</td><td>a vertex / an edge whose removal disconnects; a piece without a cut-vertex</td><td>12</td></tr>
</tbody>
</table>
<ul>
<li><strong>Three pairs that FE options swap</strong>: adjacent (vertex–vertex) vs incident (edge–vertex); strongly vs weakly connected; articulation point (a vertex) vs bridge (an edge).</li>
<li><strong>Three numbers to know by heart</strong>: Σ deg = 2|E|; Kn has n(n − 1)/2 edges; a tree on n vertices has n − 1 edges.</li>
<li><strong>Study tip</strong>: learn each term with its opposite — connected / disconnected, simple / multigraph, forest / tree, adjacent / not adjacent; FE options are often built from these pairs.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> most of these words describe one thing only — ask "is it about a vertex, an edge, or the whole graph?" and half of the wrong options disappear.</p>
<div class="pitfall">The words answer different questions, so they combine: a graph can be simple, weighted and directed at the same time, and a tree is also a forest. An option such as "a weighted graph cannot be simple" is false.</div>`,
        `<p class="y-chinh">🎯 Slide liệt kê khoảng ba mươi khái niệm cơ bản; bảng dưới đặt mỗi khái niệm cạnh nghĩa của nó và slide định nghĩa nó — che cột giữa lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Khái niệm (EN)</th><th>Nghĩa tiếng Việt, một dòng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>vertex, edge</td><td>đỉnh: một đối tượng; cạnh: mối nối giữa hai đối tượng</td><td>3–4</td></tr>
<tr><td>directed / undirected edge</td><td>cạnh có hướng: cặp có thứ tự (u, v) / cạnh vô hướng: cặp không thứ tự {u, v}</td><td>5</td></tr>
<tr><td>directed / undirected graph</td><td>đồ thị có hướng (digraph): mọi cạnh có hướng / đồ thị vô hướng: mọi cạnh vô hướng</td><td>5</td></tr>
<tr><td>adjacent vertices; incident edge</td><td>hai đỉnh kề: có cạnh nối; cạnh liên thuộc: cạnh chạm vào đỉnh đó</td><td>7</td></tr>
<tr><td>degree; isolated vertex</td><td>bậc: số cạnh liên thuộc; đỉnh cô lập: đỉnh bậc 0</td><td>7</td></tr>
<tr><td>parallel (multiple) edges; loop</td><td>cạnh song song (cạnh bội): cùng hai đầu (cùng gốc và đích); khuyên: cạnh từ một đỉnh về chính nó</td><td>9</td></tr>
<tr><td>simple graph; multigraph</td><td>đơn đồ thị: không khuyên, không cạnh song song; đa đồ thị: có cạnh song song, không khuyên</td><td>9</td></tr>
<tr><td>path; simple path; cycle</td><td>đường đi: đi dọc các cạnh; đường đi đơn: không lặp đỉnh; chu trình: đường đi quay về điểm đầu</td><td>10</td></tr>
<tr><td>connected; strongly / weakly connected</td><td>liên thông: có đường giữa mọi cặp đỉnh; liên thông mạnh: đường có hướng cả hai chiều / liên thông yếu: liên thông khi bỏ chiều</td><td>11</td></tr>
<tr><td>subgraph; spanning subgraph</td><td>đồ thị con: V' ⊆ V và E' ⊆ E; đồ thị con bao trùm: đồ thị con có V' = V</td><td>11, 15</td></tr>
<tr><td>forest; tree; spanning tree</td><td>rừng: không chu trình; cây: liên thông và không chu trình; cây khung: đồ thị con bao trùm là một cây</td><td>11</td></tr>
<tr><td>complete graph; simple complete graph Kn</td><td>đồ thị đầy đủ: mọi cặp đỉnh đều nối; Kn: n đỉnh, n(n − 1)/2 cạnh</td><td>15</td></tr>
<tr><td>cut-vertex (articulation point); bridge (cut-edge); block</td><td>đỉnh khớp / cầu: đỉnh / cạnh mà xoá đi thì mất liên thông; khối: mảnh không có đỉnh khớp</td><td>12</td></tr>
</tbody>
</table>
<ul>
<li><strong>Ba cặp phương án FE hay đánh tráo</strong>: kề (adjacent, đỉnh–đỉnh) với liên thuộc (incident, cạnh–đỉnh); liên thông mạnh với liên thông yếu; đỉnh khớp (một đỉnh) với cầu (một cạnh).</li>
<li><strong>Ba con số phải thuộc lòng</strong>: Σ deg = 2|E|; Kn có n(n − 1)/2 cạnh; cây n đỉnh có n − 1 cạnh.</li>
<li><strong>Cách học</strong>: học mỗi thuật ngữ cùng với "cặp đối" của nó — liên thông / không liên thông, đơn đồ thị / đa đồ thị, rừng / cây, kề / không kề; phương án FE thường được dựng từ những cặp này.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> hầu hết các từ này chỉ mô tả đúng một loại đối tượng — tự hỏi "nó nói về một đỉnh, một cạnh, hay cả đồ thị?" là loại được một nửa phương án sai.</p>
<div class="pitfall">Các từ này trả lời những câu hỏi khác nhau nên có thể đi cùng nhau: một đồ thị có thể vừa đơn, vừa có trọng số, vừa có hướng, và một cây cũng là một rừng. Phương án kiểu "đồ thị có trọng số thì không thể là đơn đồ thị" là SAI.</div>`],
      [17, 'Graph applications',
        `<p class="y-chinh">🎯 The slide lists five application areas; in each one, deciding what the vertices and the edges are is step one, and the question you ask picks the algorithm.</p>
<table>
<thead><tr><th>Application</th><th>Vertices</th><th>Edges</th><th>Typical question → algorithm of this chapter</th></tr></thead>
<tbody>
<tr><td>Electronic circuits</td><td>components, junctions</td><td>wires, connections</td><td>is every part connected? (DFS); least total wiring (minimum spanning tree, part 2)</td></tr>
<tr><td>Transportation networks</td><td>cities, stations, intersections</td><td>roads, rail lines, flights — weighted by km or minutes</td><td>shortest route from here (Dijkstra); a table of all distances (Floyd)</td></tr>
<tr><td>Computer networks</td><td>computers, routers, switches</td><td>cables, links</td><td>fewest hops (BFS); a loop-free set of links (spanning tree)</td></tr>
<tr><td>Database</td><td>records, entities</td><td>the relationships between them</td><td>which records are linked, directly or not? (traversal)</td></tr>
<tr><td>Entity-relationship diagram</td><td>entities (Student, Course)</td><td>relationships (Student enrols in Course)</td><td>the design of a database drawn as a graph</td></tr>
</tbody>
</table>
<ul>
<li>Real examples: link-state routing protocols such as OSPF run Dijkstra's algorithm on the network graph; Ethernet switches run the Spanning Tree Protocol to switch off redundant links.</li>
<li>The ER diagram you draw in a database course (DBI202) is already a graph: entities are vertices, relationships are edges.</li>
<li>Closer to your OJT: a build tool or package manager refuses circular dependencies — finding one is cycle detection with DFS (lesson 5.3); "friends of friends" suggestions are the vertices at distance 2 in a BFS.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "fewest steps" → BFS; "cheapest from one place" → Dijkstra; "cheapest between every pair" → Floyd; "connect everything as cheaply as possible" → minimum spanning tree.</p>
<div class="pitfall">Shortest path ≠ minimum spanning tree: the spanning tree minimises the <em>total</em> weight of the edges that connect everything, not the distance between two given vertices. The path between two cities inside an MST can be far from the shortest one.</div>`,
        `<p class="y-chinh">🎯 Slide nêu năm lĩnh vực ứng dụng; ở lĩnh vực nào bước một cũng là xác định đỉnh là gì, cạnh là gì, và câu hỏi đặt ra sẽ chọn thuật toán.</p>
<table>
<thead><tr><th>Ứng dụng</th><th>Đỉnh</th><th>Cạnh</th><th>Câu hỏi điển hình → thuật toán của chương</th></tr></thead>
<tbody>
<tr><td>Mạch điện tử (electronic circuits)</td><td>linh kiện, điểm nối</td><td>dây dẫn, mối nối</td><td>mọi linh kiện có thông nhau không? (DFS); đi dây tổng ngắn nhất (cây khung nhỏ nhất — minimum spanning tree, phần 2)</td></tr>
<tr><td>Mạng giao thông (transportation networks)</td><td>thành phố, nhà ga, giao lộ</td><td>đường bộ, đường sắt, chuyến bay — trọng số là km hay số phút</td><td>đường ngắn nhất từ đây (Dijkstra); bảng khoảng cách mọi cặp (Floyd)</td></tr>
<tr><td>Mạng máy tính (computer networks)</td><td>máy tính, bộ định tuyến (router), bộ chuyển mạch (switch)</td><td>cáp, đường truyền</td><td>ít bước nhảy (hop) nhất (BFS); tập đường truyền không tạo vòng (cây khung)</td></tr>
<tr><td>Cơ sở dữ liệu (database)</td><td>bản ghi, thực thể</td><td>quan hệ giữa chúng</td><td>bản ghi nào liên quan với nhau, trực tiếp hay gián tiếp? (duyệt đồ thị)</td></tr>
<tr><td>Sơ đồ thực thể–liên kết (entity-relationship diagram, ERD)</td><td>thực thể (Student, Course)</td><td>liên kết (Student đăng ký Course)</td><td>bản thiết kế cơ sở dữ liệu vẽ thành đồ thị</td></tr>
</tbody>
</table>
<ul>
<li>Ví dụ thật: các giao thức định tuyến trạng thái liên kết (link-state routing) như OSPF chạy thuật toán Dijkstra trên đồ thị mạng; các switch Ethernet chạy giao thức cây khung (Spanning Tree Protocol) để tắt bớt các đường dự phòng tạo vòng.</li>
<li>Sơ đồ ERD bạn vẽ ở môn cơ sở dữ liệu (DBI202) vốn đã là một đồ thị: thực thể là đỉnh, liên kết là cạnh.</li>
<li>Gần với lúc đi thực tập (OJT) hơn: công cụ build hay trình quản lý gói từ chối các phụ thuộc vòng (circular dependency) — tìm ra chúng là bài toán phát hiện chu trình bằng DFS (bài 5.3); gợi ý "bạn của bạn" là các đỉnh ở khoảng cách 2 trong BFS.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "ít bước nhất" → BFS; "rẻ nhất từ một nơi" → Dijkstra; "rẻ nhất giữa mọi cặp" → Floyd; "nối tất cả với chi phí nhỏ nhất" → cây khung nhỏ nhất.</p>
<div class="pitfall">Đường đi ngắn nhất ≠ cây khung nhỏ nhất (MST): cây khung làm nhỏ nhất <em>tổng</em> trọng số các cạnh nối mọi đỉnh, chứ không phải khoảng cách giữa hai đỉnh cho trước. Đường nối hai thành phố bên trong MST có thể dài hơn đường ngắn nhất rất nhiều.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>A simple undirected graph has degrees 4, 3, 3, 2, 2. How many edges does it have?</li>
<li>What is a pseudograph, and how does it differ from a multigraph?</li>
<li>How many edges does K8 have?</li>
<li>A graph has 10 vertices, 7 edges and 3 connected components. Does it contain a cycle?</li>
<li>Removing vertex X disconnects a graph; removing edge X–Y also does. Name X and X–Y.</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) Σ deg = 14 = 2|E| ⇒ 7 edges. (2) a pseudograph may have self-loops (and parallel edges); a multigraph has parallel edges but no loops. (3) 8 · 7 / 2 = 28. (4) n − c = 10 − 3 = 7 = m ⇒ no cycle: it is a forest. (5) X is an articulation point (cut-vertex); X–Y is a bridge (cut-edge).</p>
<p><strong>Next:</strong> lesson 5.B (slides 18–36 of this deck: representations, BFS/DFS, Dijkstra, Floyd), then the deep-dive lessons 5.1 Graph representation &amp; traversal and 5.2 Three ways to store a graph below.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Một đơn đồ thị vô hướng có các bậc 4, 3, 3, 2, 2. Nó có bao nhiêu cạnh?</li>
<li>Giả đồ thị (pseudograph) là gì, khác đa đồ thị (multigraph) ở đâu?</li>
<li>K8 có bao nhiêu cạnh?</li>
<li>Một đồ thị có 10 đỉnh, 7 cạnh và 3 thành phần liên thông. Nó có chu trình không?</li>
<li>Xoá đỉnh X thì đồ thị mất liên thông; xoá cạnh X–Y cũng vậy. Gọi tên X và X–Y.</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Σ deg = 14 = 2|E| ⇒ 7 cạnh. (2) giả đồ thị được phép có khuyên (và cạnh song song); đa đồ thị có cạnh song song nhưng không có khuyên. (3) 8 · 7 / 2 = 28. (4) n − c = 10 − 3 = 7 = m ⇒ không có chu trình: đó là một rừng (forest). (5) X là đỉnh khớp (articulation point, cut-vertex); X–Y là cầu (bridge, cut-edge).</p>
<p><strong>Học tiếp:</strong> bài 5.B (slide 18–36 của bộ này: biểu diễn, BFS/DFS, Dijkstra, Floyd), rồi các bài đào sâu 5.1 Biểu diễn &amp; duyệt đồ thị và 5.2 Ba cách lưu một đồ thị bên dưới.</p>`),
    books([
      ['goodrich', 'Ch.14 Graph Algorithms p.611 — §14.1 Graphs p.612 (the terminology of slides 3–16) · §14.1.1 The Graph ADT p.618', 'Chương 14 Graph Algorithms tr.611 — §14.1 Graphs tr.612 (các thuật ngữ của slide 3–16) · §14.1.1 The Graph ADT tr.618'],
    ]),
  ].join('\n'),
};

/* ───────── 5.B — 📑 Slide by slide · Graphs, part 1b: representation, BFS/DFS, Dijkstra & Floyd (5A-Graphs1, slides 18–36) ───────── */
const L_csd10_2 = {
  title: '5.B — 📑 Slide by slide · Graphs, part 1b: representation, BFS/DFS, Dijkstra & Floyd (5A-Graphs1, slides 18–36)|||5.B — 📑 Học theo từng slide · Đồ thị, phần 1b: biểu diễn, BFS/DFS, Dijkstra & Floyd (5A-Graphs1, slide 18–36)',
  slug: 'csd201-slide-csd10-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 18–36 của bộ 5A-Graphs1: danh sách kề, ma trận kề, ma trận liên thuộc; BFS (hàng đợi, tô màu) và DFS (đệ quy) với bảng từng bước, chạy nguyên code của slide và chỉ ra hai bẫy (BFS không khởi động lại, DFS cấp cứng mảng 20); bài toán đường đi ngắn nhất, Dijkstra chạy đúng ma trận 6 đỉnh của slide, phản ví dụ trọng số âm; Floyd với dòng cập nhật P bị sai trên slide và cách sửa — 17 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.B · 5A-Graphs1, slides 18–36</span>
<h2>Graphs, part 1b — store it, walk it, find the shortest way</h2>
<p class="lead">The second half of the deck turns the vocabulary into code: three ways to store a graph (adjacency list, adjacency matrix, incidence matrix), the two traversals (BFS with a queue, DFS with recursion) and the two shortest-path algorithms (Dijkstra from one source, Floyd for every pair). One graph of the lesson's own runs through slides 18–26 so that you can compare every representation and every traversal on the same data; the slides' own BFS and DFS code is run as printed — with its two traps — Dijkstra is run on the slide's 6-vertex matrix, and one line of Floyd's pseudocode is corrected.</p>
<div class="callout"><strong>CLO5 in the syllabus:</strong> implement a graph with some basic operations — sessions 29–36 (Data Structures for Graphs, Graph Traversals, Shortest Paths, Dijkstra's Algorithm). Class questions: BFS (CQ8.2), DFS (CQ8.3), BFS vs DFS (CQ10.3), how to describe a graph in Java (CQ10.2), Dijkstra's key idea (CQ11.3), Dijkstra vs Floyd (CQ10.1, CQ12.1). A PE graph question is usually written on an adjacency matrix: print a traversal order, or a shortest path with its length — slides 23, 26 and 29–30 are the ones to be able to type from memory.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Topic</th><th>Key idea</th><th>Cost (n = |V|, m = |E|)</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Adjacency list</td><td>every vertex keeps the list of its neighbours</td><td>memory O(n + m); "is (u, v) an edge?" O(deg u)</td><td>18</td></tr>
<tr><td>Adjacency matrix</td><td>n × n table, a[i][j] ≠ 0 ⇔ edge i → j</td><td>memory O(n²); edge test O(1)</td><td>19</td></tr>
<tr><td>Incidence matrix</td><td>n × m table, vertex × edge</td><td>memory O(n·m)</td><td>20</td></tr>
<tr><td>BFS</td><td>queue, level by level, mark when enqueued</td><td>O(n + m) on lists, O(n²) on a matrix</td><td>21–23</td></tr>
<tr><td>DFS</td><td>recursion (a stack), go deep first, mark on entry</td><td>O(n + m) on lists, O(n²) on a matrix</td><td>24–26</td></tr>
<tr><td>Dijkstra</td><td>one source, weights ≥ 0, greedy "closest first"</td><td>O(n²) with a matrix</td><td>27–31</td></tr>
<tr><td>Floyd</td><td>every pair, negative edges allowed, no negative cycle</td><td>O(n³)</td><td>32–34</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.B · 5A-Graphs1, slide 18–36</span>
<h2>Đồ thị, phần 1b — lưu nó, duyệt nó, tìm đường ngắn nhất</h2>
<p class="lead">Nửa sau của bộ slide biến bộ từ vựng thành code: ba cách lưu đồ thị (danh sách kề — adjacency list, ma trận kề — adjacency matrix, ma trận liên thuộc — incidence matrix), hai phép duyệt (BFS dùng hàng đợi, DFS dùng đệ quy) và hai thuật toán đường đi ngắn nhất (Dijkstra từ một nguồn, Floyd cho mọi cặp đỉnh). Một đồ thị của bài chạy suốt slide 18–26 để bạn so sánh mọi cách biểu diễn và mọi phép duyệt trên cùng dữ liệu; code BFS và DFS của slide được chạy nguyên văn — kèm hai cái bẫy của nó — Dijkstra chạy đúng ma trận 6 đỉnh của slide, và một dòng trong mã giả Floyd được sửa lại.</p>
<div class="callout"><strong>CLO5 trong syllabus:</strong> cài đặt được đồ thị với một số thao tác cơ bản — buổi 29–36 (cấu trúc dữ liệu cho đồ thị, duyệt đồ thị, đường đi ngắn nhất, thuật toán Dijkstra). Câu hỏi trên lớp: BFS là gì (CQ8.2), DFS là gì (CQ8.3), so sánh BFS và DFS (CQ10.3), mô tả đồ thị trong Java thế nào (CQ10.2), ý chính của Dijkstra (CQ11.3), Dijkstra khác Floyd ở đâu (CQ10.1, CQ12.1). Câu đồ thị trong đề PE thường cho trên ma trận kề: in thứ tự duyệt, hoặc in đường đi ngắn nhất kèm độ dài — slide 23, 26 và 29–30 là phần phải gõ lại được mà không cần nhìn.</div>
<h3>Cả phần trong một bảng</h3>
<table>
<thead><tr><th>Chủ đề</th><th>Ý chính</th><th>Chi phí (n = |V|, m = |E|)</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Danh sách kề (adjacency list)</td><td>mỗi đỉnh giữ danh sách các láng giềng</td><td>bộ nhớ O(n + m); "(u, v) có phải cạnh?" O(deg u)</td><td>18</td></tr>
<tr><td>Ma trận kề (adjacency matrix)</td><td>bảng n × n, a[i][j] ≠ 0 ⇔ có cạnh i → j</td><td>bộ nhớ O(n²); kiểm cạnh O(1)</td><td>19</td></tr>
<tr><td>Ma trận liên thuộc (incidence matrix)</td><td>bảng n × m, đỉnh × cạnh</td><td>bộ nhớ O(n·m)</td><td>20</td></tr>
<tr><td>BFS (duyệt theo chiều rộng)</td><td>hàng đợi, từng tầng một, đánh dấu khi đưa vào hàng đợi</td><td>O(n + m) trên danh sách, O(n²) trên ma trận</td><td>21–23</td></tr>
<tr><td>DFS (duyệt theo chiều sâu)</td><td>đệ quy (một ngăn xếp), đi sâu trước, đánh dấu khi bước vào</td><td>O(n + m) trên danh sách, O(n²) trên ma trận</td><td>24–26</td></tr>
<tr><td>Dijkstra</td><td>một nguồn, trọng số ≥ 0, tham lam "gần nhất trước"</td><td>O(n²) với ma trận</td><td>27–31</td></tr>
<tr><td>Floyd</td><td>mọi cặp đỉnh, cho phép cạnh âm, cấm chu trình âm</td><td>O(n³)</td><td>32–34</td></tr>
</tbody>
</table>`),
    walkHead('csd10', 18, 36),
    walk('csd10', [
      [18, 'Graph Representation – 1 (adjacency list)',
        `<p class="y-chinh">🎯 An adjacency list keeps, for every vertex, the list of its neighbours — memory proportional to n + m, the natural choice for sparse graphs.</p>
<p>The slide labels its picture (a) for a graph and (b–c) for its adjacency list. Below is the lesson's own graph — the one used on every slide from 18 to 26 — and its adjacency list built by Java:</p>
<pre><code class="language-plaintext">the lesson's graph (slides 18-26): 8 vertices, 9 edges, 2 components

  A --- B --- C        G --- H
  | \\   |     |
  |   \\ |     |
  D --- E --- F</code></pre>
<pre><code class="language-java">import java.util.ArrayList;

public class AdjList {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        String[] edges = {"AB", "AD", "AE", "BC", "BE", "CF", "DE", "EF", "GH"};   // the lesson's graph
        int n = v.length;
        ArrayList&lt;ArrayList&lt;Integer&gt;&gt; adj = new ArrayList&lt;ArrayList&lt;Integer&gt;&gt;();
        for (int i = 0; i &lt; n; i++) adj.add(new ArrayList&lt;Integer&gt;());   // one (empty) list per vertex
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            adj.get(x).add(y);                          // undirected: store the edge at both ends
            adj.get(y).add(x);
        }
        int entries = 0;
        for (int i = 0; i &lt; n; i++) {
            System.out.print(v[i] + " -&gt;");
            for (int j : adj.get(i)) System.out.print(" " + v[j]);
            System.out.println("   (deg " + adj.get(i).size() + ")");
            entries += adj.get(i).size();
        }
        System.out.println("entries = " + entries + " = 2|E| with |E| = " + edges.length + ", plus " + n + " list heads");
        ArrayList&lt;Integer&gt; le = adj.get(4);             // "is E adjacent to C?" scans E's list only
        System.out.println("E adjacent to C? " + le.contains(2) + "  (" + le.size() + " entries scanned)");
    }
}</code></pre>
<div class="out">A -&gt; B D E &nbsp;&nbsp;(deg 3)<br>
B -&gt; A C E &nbsp;&nbsp;(deg 3)<br>
C -&gt; B F &nbsp;&nbsp;(deg 2)<br>
D -&gt; A E &nbsp;&nbsp;(deg 2)<br>
E -&gt; A B D F &nbsp;&nbsp;(deg 4)<br>
F -&gt; C E &nbsp;&nbsp;(deg 2)<br>
G -&gt; H &nbsp;&nbsp;(deg 1)<br>
H -&gt; G &nbsp;&nbsp;(deg 1)<br>
entries = 18 = 2|E| with |E| = 9, plus 8 list heads<br>
E adjacent to C? false &nbsp;(4 entries scanned)</div>
<ul>
<li><strong>Memory</strong>: n list heads + 2m entries for an undirected graph, because each edge is stored in both lists → O(n + m).</li>
<li><strong>Neighbours of v</strong>: O(deg(v)) — the operation BFS, DFS and Dijkstra repeat all the time.</li>
<li><strong>Is (u, v) an edge?</strong> Scan u's list: O(deg(u)) — slower than the matrix's O(1).</li>
</ul>
<div class="pitfall">In Java, <code>ArrayList&lt;Integer&gt;[] adj = new ArrayList[n]</code> gives n <em>null</em> slots: each one needs <code>adj[i] = new ArrayList&lt;Integer&gt;()</code> before the first <code>add</code>, or you get a NullPointerException. (The program uses a list of lists, which also avoids the generic-array warning.)</div>`,
        `<p class="y-chinh">🎯 Danh sách kề (adjacency list) giữ cho mỗi đỉnh danh sách các láng giềng (neighbour) của nó — bộ nhớ tỉ lệ với n + m, lựa chọn tự nhiên cho đồ thị thưa (sparse).</p>
<p>Slide đánh nhãn hình (a) cho một đồ thị và (b–c) cho danh sách kề của nó. Dưới đây là đồ thị của bài — dùng cho mọi slide từ 18 tới 26 — và danh sách kề do Java dựng:</p>
<pre><code class="language-plaintext">đồ thị của bài (slide 18-26): 8 đỉnh, 9 cạnh, 2 thành phần liên thông

  A --- B --- C        G --- H
  | \\   |     |
  |   \\ |     |
  D --- E --- F</code></pre>
<pre><code class="language-java">import java.util.ArrayList;

public class AdjList {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        String[] edges = {"AB", "AD", "AE", "BC", "BE", "CF", "DE", "EF", "GH"};   // đồ thị của bài
        int n = v.length;
        ArrayList&lt;ArrayList&lt;Integer&gt;&gt; adj = new ArrayList&lt;ArrayList&lt;Integer&gt;&gt;();
        for (int i = 0; i &lt; n; i++) adj.add(new ArrayList&lt;Integer&gt;());   // mỗi đỉnh một danh sách (rỗng)
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            adj.get(x).add(y);                          // vô hướng: lưu cạnh ở cả hai đầu
            adj.get(y).add(x);
        }
        int entries = 0;
        for (int i = 0; i &lt; n; i++) {
            System.out.print(v[i] + " -&gt;");
            for (int j : adj.get(i)) System.out.print(" " + v[j]);
            System.out.println("   (deg " + adj.get(i).size() + ")");
            entries += adj.get(i).size();
        }
        System.out.println("entries = " + entries + " = 2|E| with |E| = " + edges.length + ", plus " + n + " list heads");
        ArrayList&lt;Integer&gt; le = adj.get(4);             // "E có kề C không?" chỉ quét danh sách của E
        System.out.println("E adjacent to C? " + le.contains(2) + "  (" + le.size() + " entries scanned)");
    }
}</code></pre>
<div class="out">A -&gt; B D E &nbsp;&nbsp;(deg 3)<br>
B -&gt; A C E &nbsp;&nbsp;(deg 3)<br>
C -&gt; B F &nbsp;&nbsp;(deg 2)<br>
D -&gt; A E &nbsp;&nbsp;(deg 2)<br>
E -&gt; A B D F &nbsp;&nbsp;(deg 4)<br>
F -&gt; C E &nbsp;&nbsp;(deg 2)<br>
G -&gt; H &nbsp;&nbsp;(deg 1)<br>
H -&gt; G &nbsp;&nbsp;(deg 1)<br>
entries = 18 = 2|E| with |E| = 9, plus 8 list heads<br>
E adjacent to C? false &nbsp;(4 entries scanned)</div>
<ul>
<li><strong>Bộ nhớ</strong>: n đầu danh sách + 2m phần tử với đồ thị vô hướng, vì mỗi cạnh được lưu trong cả hai danh sách → O(n + m).</li>
<li><strong>Liệt kê láng giềng của v</strong>: O(deg(v)) — thao tác mà BFS, DFS và Dijkstra lặp đi lặp lại liên tục.</li>
<li><strong>(u, v) có phải cạnh không?</strong> Quét danh sách của u: O(deg(u)) — chậm hơn O(1) của ma trận.</li>
</ul>
<div class="pitfall">Trong Java, <code>ArrayList&lt;Integer&gt;[] adj = new ArrayList[n]</code> chỉ tạo n ô <em>null</em>: ô nào cũng phải gán <code>adj[i] = new ArrayList&lt;Integer&gt;()</code> trước lần <code>add</code> đầu tiên, nếu không sẽ văng NullPointerException. (Chương trình dùng danh sách của các danh sách, vừa tránh được cảnh báo về mảng kiểu tổng quát — generic array.)</div>`],
      [19, 'Graph Representation – 2 (adjacency matrix)',
        `<p class="y-chinh">🎯 An adjacency matrix is an n × n table: a[i][j] is 1 (or the weight) when there is an edge from i to j, 0 otherwise — O(1) to test an edge, O(n²) memory whatever the number of edges.</p>
<p>The slide shows the matrix of its graph as a picture; the program builds the matrix of the lesson's graph from slide 18:</p>
<pre><code class="language-java">public class AdjMatrix {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        String[] edges = {"AB", "AD", "AE", "BC", "BE", "CF", "DE", "EF", "GH"};   // the lesson's graph
        int n = v.length;
        int[][] a = new int[n][n];                      // n x n cells, all 0 at first
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;                      // undirected: keep it symmetric
        }
        System.out.print("  ");
        for (int j = 0; j &lt; n; j++) System.out.print(" " + v[j]);
        System.out.println("   deg");
        for (int i = 0; i &lt; n; i++) {
            System.out.print(" " + v[i]);
            int deg = 0;
            for (int j = 0; j &lt; n; j++) {
                System.out.print(" " + a[i][j]);
                deg += a[i][j];                         // degree = row sum
            }
            System.out.println("   " + deg);
        }
        System.out.println("cells = n*n = " + n * n + " for only " + edges.length + " edges");
        System.out.println("E adjacent to C? " + (a[4][2] == 1) + "  (one cell read: a[4][2])");
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;A B C D E F G H &nbsp;&nbsp;deg<br>
&nbsp;A 0 1 0 1 1 0 0 0 &nbsp;&nbsp;3<br>
&nbsp;B 1 0 1 0 1 0 0 0 &nbsp;&nbsp;3<br>
&nbsp;C 0 1 0 0 0 1 0 0 &nbsp;&nbsp;2<br>
&nbsp;D 1 0 0 0 1 0 0 0 &nbsp;&nbsp;2<br>
&nbsp;E 1 1 0 1 0 1 0 0 &nbsp;&nbsp;4<br>
&nbsp;F 0 0 1 0 1 0 0 0 &nbsp;&nbsp;2<br>
&nbsp;G 0 0 0 0 0 0 0 1 &nbsp;&nbsp;1<br>
&nbsp;H 0 0 0 0 0 0 1 0 &nbsp;&nbsp;1<br>
cells = n*n = 64 for only 9 edges<br>
E adjacent to C? false &nbsp;(one cell read: a[4][2])</div>
<ul>
<li>Undirected ⇒ symmetric (<code>a[i][j] == a[j][i]</code>); the diagonal is 0 in a simple graph.</li>
<li>Degree = row sum (last column). Neighbours of v = scan row v: O(n), even when v has a single neighbour.</li>
<li>64 cells for 9 edges: most cells are 0 — the price of a sparse graph in a matrix. For a dense graph (m of the order of n²) almost nothing is wasted.</li>
<li>This is the representation used by the slides' code (<code>a[h][i] &gt; 0</code> on slide 23, <code>a[i][j] &gt; 0</code> on slide 26) and by typical PE graph questions.</li>
</ul>
<div class="pitfall"><code>a[i][j] &gt; 0</code> means "edge" only when "no edge" is stored as 0. In a weight matrix with 99 (or ∞) for "no edge", as on slide 30, <code>99 &gt; 0</code> is true — BFS/DFS copied from slides 23/26 would walk along edges that do not exist. Test <code>a[i][j] &gt; 0 &amp;&amp; a[i][j] &lt; 99</code> instead.</div>`,
        `<p class="y-chinh">🎯 Ma trận kề (adjacency matrix) là bảng n × n: a[i][j] bằng 1 (hoặc bằng trọng số) khi có cạnh từ i tới j, bằng 0 nếu không — kiểm một cạnh O(1), tốn O(n²) bộ nhớ bất kể có bao nhiêu cạnh.</p>
<p>Slide vẽ ma trận của đồ thị bằng hình; chương trình dựng ma trận của đồ thị của bài ở slide 18:</p>
<pre><code class="language-java">public class AdjMatrix {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        String[] edges = {"AB", "AD", "AE", "BC", "BE", "CF", "DE", "EF", "GH"};   // đồ thị của bài
        int n = v.length;
        int[][] a = new int[n][n];                      // n x n ô, ban đầu toàn 0
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;                      // vô hướng: giữ đối xứng
        }
        System.out.print("  ");
        for (int j = 0; j &lt; n; j++) System.out.print(" " + v[j]);
        System.out.println("   deg");
        for (int i = 0; i &lt; n; i++) {
            System.out.print(" " + v[i]);
            int deg = 0;
            for (int j = 0; j &lt; n; j++) {
                System.out.print(" " + a[i][j]);
                deg += a[i][j];                         // bậc = tổng hàng
            }
            System.out.println("   " + deg);
        }
        System.out.println("cells = n*n = " + n * n + " for only " + edges.length + " edges");
        System.out.println("E adjacent to C? " + (a[4][2] == 1) + "  (one cell read: a[4][2])");
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;A B C D E F G H &nbsp;&nbsp;deg<br>
&nbsp;A 0 1 0 1 1 0 0 0 &nbsp;&nbsp;3<br>
&nbsp;B 1 0 1 0 1 0 0 0 &nbsp;&nbsp;3<br>
&nbsp;C 0 1 0 0 0 1 0 0 &nbsp;&nbsp;2<br>
&nbsp;D 1 0 0 0 1 0 0 0 &nbsp;&nbsp;2<br>
&nbsp;E 1 1 0 1 0 1 0 0 &nbsp;&nbsp;4<br>
&nbsp;F 0 0 1 0 1 0 0 0 &nbsp;&nbsp;2<br>
&nbsp;G 0 0 0 0 0 0 0 1 &nbsp;&nbsp;1<br>
&nbsp;H 0 0 0 0 0 0 1 0 &nbsp;&nbsp;1<br>
cells = n*n = 64 for only 9 edges<br>
E adjacent to C? false &nbsp;(one cell read: a[4][2])</div>
<ul>
<li>Vô hướng ⇒ đối xứng (symmetric, <code>a[i][j] == a[j][i]</code>); đường chéo bằng 0 với đơn đồ thị (simple graph).</li>
<li>Bậc = tổng hàng (cột cuối). Láng giềng của v = quét hàng v: O(n), kể cả khi v chỉ có một láng giềng.</li>
<li>64 ô cho 9 cạnh: đa số ô là 0 — cái giá khi lưu đồ thị thưa (sparse) bằng ma trận. Với đồ thị dày (dense, m cỡ n²) thì gần như không phí ô nào.</li>
<li>Đây là cách biểu diễn mà code của slide dùng (<code>a[h][i] &gt; 0</code> ở slide 23, <code>a[i][j] &gt; 0</code> ở slide 26) và cũng là dạng thường gặp trong câu đồ thị của đề PE.</li>
</ul>
<div class="pitfall"><code>a[i][j] &gt; 0</code> chỉ có nghĩa "có cạnh" khi "không có cạnh" được lưu là 0. Với ma trận trọng số dùng 99 (hoặc ∞) cho "không có cạnh" như slide 30, <code>99 &gt; 0</code> là đúng — BFS/DFS chép từ slide 23/26 sẽ đi theo những cạnh không hề tồn tại. Phải kiểm <code>a[i][j] &gt; 0 &amp;&amp; a[i][j] &lt; 99</code>.</div>`],
      [20, 'Graph Representation – 3 (incidence matrix)',
        `<p class="y-chinh">🎯 An incidence matrix has one row per vertex and one column per edge: cell (v, e) is 1 when vertex v is an end of edge e — "a vertex is said to be incident to an edge if the edge is connected to the vertex".</p>
<p>The slide (it writes "incident matrix"; the usual name is <em>incidence</em> matrix) shows it as a picture; here is the one of the lesson's graph, with the 9 edges as columns:</p>
<pre><code class="language-java">public class IncidenceMatrix {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        String[] edges = {"AB", "AD", "AE", "BC", "BE", "CF", "DE", "EF", "GH"};   // the lesson's graph
        int n = v.length, m = edges.length;
        int[][] b = new int[n][m];                      // one row per vertex, one column per edge
        for (int k = 0; k &lt; m; k++) {
            b[edges[k].charAt(0) - 'A'][k] = 1;         // both endpoints of edge k
            b[edges[k].charAt(1) - 'A'][k] = 1;
        }
        System.out.print("  ");
        for (String e : edges) System.out.print(" " + e);
        System.out.println("   deg");
        for (int i = 0; i &lt; n; i++) {
            System.out.print(v[i] + " ");
            int deg = 0;
            for (int k = 0; k &lt; m; k++) {
                System.out.print("  " + b[i][k]);
                deg += b[i][k];                         // row sum = degree
            }
            System.out.println("   " + deg);
        }
        System.out.print("column sums:");
        for (int k = 0; k &lt; m; k++) {
            int s = 0;
            for (int i = 0; i &lt; n; i++) s += b[i][k];   // always 2: an edge has two ends
            System.out.print(" " + s);
        }
        System.out.println();
        System.out.println("cells: incidence n*m = " + n * m + ", adjacency matrix n*n = " + n * n
                + ", adjacency list n + 2m = " + (n + 2 * m));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;AB AD AE BC BE CF DE EF GH &nbsp;&nbsp;deg<br>
A &nbsp;&nbsp;1 &nbsp;1 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;&nbsp;3<br>
B &nbsp;&nbsp;1 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;&nbsp;3<br>
C &nbsp;&nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;&nbsp;2<br>
D &nbsp;&nbsp;0 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;&nbsp;2<br>
E &nbsp;&nbsp;0 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;1 &nbsp;1 &nbsp;0 &nbsp;&nbsp;4<br>
F &nbsp;&nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;&nbsp;2<br>
G &nbsp;&nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;&nbsp;1<br>
H &nbsp;&nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;&nbsp;1<br>
column sums: 2 2 2 2 2 2 2 2 2<br>
cells: incidence n*m = 72, adjacency matrix n*n = 64, adjacency list n + 2m = 26</div>
<ul>
<li>Every column holds exactly two 1s — an edge has two ends. Row sum = degree, so the whole table sums to 2m: the handshake theorem once more.</li>
<li>For a digraph, a common convention writes 1 at the origin and −1 at the destination (books differ on the signs).</li>
<li>Rarely used for algorithms: n·m cells, and finding the neighbours of v means scanning row v, then each of its columns.</li>
</ul>
<table>
<thead><tr><th>Representation</th><th>Memory</th><th>Is (u, v) an edge?</th><th>Neighbours of v</th><th>Lesson's graph (n = 8, m = 9)</th></tr></thead>
<tbody>
<tr><td>Adjacency list</td><td>O(n + m)</td><td>O(deg u)</td><td>O(deg v)</td><td>8 heads + 18 entries</td></tr>
<tr><td>Adjacency matrix</td><td>O(n²)</td><td>O(1)</td><td>O(n)</td><td>64 cells</td></tr>
<tr><td>Incidence matrix</td><td>O(n·m)</td><td>O(m)</td><td>O(m + deg(v)·n)</td><td>72 cells</td></tr>
</tbody>
</table>
<div class="pitfall">FE vocabulary: <em>adjacency</em> relates two vertices, <em>incidence</em> relates a vertex and an edge. An n × n matrix is an adjacency matrix; an n × m matrix (vertices × edges) is an incidence matrix.</div>`,
        `<p class="y-chinh">🎯 Ma trận liên thuộc (incidence matrix) có mỗi đỉnh một hàng, mỗi cạnh một cột: ô (v, e) bằng 1 khi đỉnh v là một đầu của cạnh e — "đỉnh liên thuộc với cạnh nếu cạnh nối vào đỉnh đó".</p>
<p>Slide (ghi là "incident matrix"; tên thường dùng là <em>incidence</em> matrix) vẽ nó bằng hình; đây là ma trận của đồ thị của bài, 9 cạnh là 9 cột:</p>
<pre><code class="language-java">public class IncidenceMatrix {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        String[] edges = {"AB", "AD", "AE", "BC", "BE", "CF", "DE", "EF", "GH"};   // đồ thị của bài
        int n = v.length, m = edges.length;
        int[][] b = new int[n][m];                      // mỗi đỉnh một hàng, mỗi cạnh một cột
        for (int k = 0; k &lt; m; k++) {
            b[edges[k].charAt(0) - 'A'][k] = 1;         // hai đầu mút của cạnh k
            b[edges[k].charAt(1) - 'A'][k] = 1;
        }
        System.out.print("  ");
        for (String e : edges) System.out.print(" " + e);
        System.out.println("   deg");
        for (int i = 0; i &lt; n; i++) {
            System.out.print(v[i] + " ");
            int deg = 0;
            for (int k = 0; k &lt; m; k++) {
                System.out.print("  " + b[i][k]);
                deg += b[i][k];                         // tổng hàng = bậc
            }
            System.out.println("   " + deg);
        }
        System.out.print("column sums:");
        for (int k = 0; k &lt; m; k++) {
            int s = 0;
            for (int i = 0; i &lt; n; i++) s += b[i][k];   // luôn là 2: cạnh có hai đầu
            System.out.print(" " + s);
        }
        System.out.println();
        System.out.println("cells: incidence n*m = " + n * m + ", adjacency matrix n*n = " + n * n
                + ", adjacency list n + 2m = " + (n + 2 * m));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;AB AD AE BC BE CF DE EF GH &nbsp;&nbsp;deg<br>
A &nbsp;&nbsp;1 &nbsp;1 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;&nbsp;3<br>
B &nbsp;&nbsp;1 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;&nbsp;3<br>
C &nbsp;&nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;&nbsp;2<br>
D &nbsp;&nbsp;0 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;0 &nbsp;&nbsp;2<br>
E &nbsp;&nbsp;0 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;1 &nbsp;1 &nbsp;0 &nbsp;&nbsp;4<br>
F &nbsp;&nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;1 &nbsp;0 &nbsp;&nbsp;2<br>
G &nbsp;&nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;&nbsp;1<br>
H &nbsp;&nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;1 &nbsp;&nbsp;1<br>
column sums: 2 2 2 2 2 2 2 2 2<br>
cells: incidence n*m = 72, adjacency matrix n*n = 64, adjacency list n + 2m = 26</div>
<ul>
<li>Cột nào cũng có đúng hai số 1 — cạnh có hai đầu. Tổng hàng = bậc, nên cả bảng cộng lại bằng 2m: định lý bắt tay (handshake theorem) thêm một lần nữa.</li>
<li>Với đồ thị có hướng, một quy ước hay gặp ghi 1 ở đỉnh gốc (origin) và −1 ở đỉnh đích (destination) (mỗi sách chọn dấu một kiểu).</li>
<li>Ít dùng cho thuật toán: n·m ô, và muốn tìm láng giềng của v phải quét hàng v rồi quét từng cột của nó.</li>
</ul>
<table>
<thead><tr><th>Cách biểu diễn</th><th>Bộ nhớ</th><th>(u, v) có phải cạnh?</th><th>Láng giềng của v</th><th>Đồ thị của bài (n = 8, m = 9)</th></tr></thead>
<tbody>
<tr><td>Danh sách kề</td><td>O(n + m)</td><td>O(deg u)</td><td>O(deg v)</td><td>8 đầu danh sách + 18 phần tử</td></tr>
<tr><td>Ma trận kề</td><td>O(n²)</td><td>O(1)</td><td>O(n)</td><td>64 ô</td></tr>
<tr><td>Ma trận liên thuộc</td><td>O(n·m)</td><td>O(m)</td><td>O(m + deg(v)·n)</td><td>72 ô</td></tr>
</tbody>
</table>
<div class="pitfall">Từ vựng FE: <em>adjacency</em> (kề) nói về hai đỉnh, <em>incidence</em> (liên thuộc) nói về một đỉnh và một cạnh. Ma trận n × n là ma trận kề; ma trận n × m (đỉnh × cạnh) là ma trận liên thuộc.</div>`],
      [21, 'Graph Traversals - Breadth-first Search',
        `<p class="y-chinh">🎯 BFS visits the start vertex, then all of its unvisited neighbours, then all of theirs — level by level — and restarts from an unvisited vertex if some are left.</p>
<ul>
<li>Visit v; then each unvisited vertex adjacent to v — call them v1, v2, …, vk; then all unvisited neighbours of v1, then of v2, and so on.</li>
<li>A <strong>queue</strong> (first in, first out) produces exactly this order: vertices found first are expanded first (slide 22).</li>
<li>If unvisited vertices remain — another component — the traversal <strong>restarts</strong> from one of them.</li>
</ul>
<p class="nhan">Levels on the lesson's graph, from A (neighbours taken in alphabetical order)</p>
<table>
<thead><tr><th>Level = edges from the start</th><th>Vertices</th><th>Found from</th></tr></thead>
<tbody>
<tr><td>0</td><td>A</td><td>the start</td></tr>
<tr><td>1</td><td>B, D, E</td><td>A</td></tr>
<tr><td>2</td><td>C, F</td><td>C from B, F from E</td></tr>
<tr><td>restart, level 0</td><td>G</td><td>not reachable from A</td></tr>
<tr><td>restart, level 1</td><td>H</td><td>G</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;

public class BfsLevels {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    static int[][] a = {                                // the lesson's graph (slides 18-26)
        {0, 1, 0, 1, 1, 0, 0, 0},
        {1, 0, 1, 0, 1, 0, 0, 0},
        {0, 1, 0, 0, 0, 1, 0, 0},
        {1, 0, 0, 0, 1, 0, 0, 0},
        {1, 1, 0, 1, 0, 1, 0, 0},
        {0, 0, 1, 0, 1, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1},
        {0, 0, 0, 0, 0, 0, 1, 0}};
    static int n = v.length;
    static int[] level = new int[n];                    // number of edges from the start
    static boolean[] found = new boolean[n];

    static void bfs(int s) {
        ArrayDeque&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();
        q.add(s);
        found[s] = true;
        level[s] = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            System.out.print(" " + v[u] + "(" + level[u] + ")");
            for (int w = 0; w &lt; n; w++)                 // neighbours in alphabetical order
                if (a[u][w] &gt; 0 &amp;&amp; !found[w]) {
                    found[w] = true;
                    level[w] = level[u] + 1;            // one level further than u
                    q.add(w);
                }
        }
        System.out.println();
    }

    public static void main(String[] args) {
        System.out.print("BFS from A:    ");
        bfs(0);
        for (int s = 0; s &lt; n; s++)                     // restart from any vertex not found yet
            if (!found[s]) {
                System.out.print("restart at " + v[s] + ":");
                bfs(s);
            }
    }
}</code></pre>
<div class="out">BFS from A: &nbsp;&nbsp;&nbsp;&nbsp;A(0) B(1) D(1) E(1) C(2) F(2)<br>
restart at G: G(0) H(1)</div>
<p>Because a vertex two edges away can only be found after all vertices one edge away have left the queue, BFS reaches every vertex by a path with the <strong>fewest edges</strong> — the idea behind lesson 5.4.</p>
<div class="pitfall">A BFS order depends on the order in which neighbours are examined. Exam questions fix it ("in alphabetical order", "smaller index first"); with a matrix and <code>for (i = 0; i &lt; n; i++)</code> you get it for free — with an adjacency list, the list order decides.</div>`,
        `<p class="y-chinh">🎯 BFS (duyệt theo chiều rộng — breadth-first search) thăm đỉnh xuất phát, rồi mọi láng giềng chưa thăm của nó, rồi mọi láng giềng của những đỉnh đó — từng tầng một — và khởi động lại từ một đỉnh chưa thăm nếu còn sót.</p>
<ul>
<li>Thăm v; rồi từng đỉnh chưa thăm kề với v — gọi là v1, v2, …, vk; rồi mọi láng giềng chưa thăm của v1, rồi của v2, cứ thế.</li>
<li><strong>Hàng đợi (queue)</strong> — vào trước ra trước (FIFO) — tạo đúng thứ tự này: đỉnh được tìm thấy trước thì được mở rộng trước (slide 22).</li>
<li>Nếu còn đỉnh chưa thăm — ở một thành phần liên thông khác — phép duyệt <strong>khởi động lại (restart)</strong> từ một đỉnh trong số đó.</li>
</ul>
<p class="nhan">Các tầng trên đồ thị của bài, xuất phát từ A (láng giềng xét theo thứ tự chữ cái)</p>
<table>
<thead><tr><th>Tầng = số cạnh từ đỉnh xuất phát</th><th>Các đỉnh</th><th>Được tìm thấy từ</th></tr></thead>
<tbody>
<tr><td>0</td><td>A</td><td>điểm xuất phát</td></tr>
<tr><td>1</td><td>B, D, E</td><td>A</td></tr>
<tr><td>2</td><td>C, F</td><td>C từ B, F từ E</td></tr>
<tr><td>khởi động lại, tầng 0</td><td>G</td><td>không đi tới được từ A</td></tr>
<tr><td>khởi động lại, tầng 1</td><td>H</td><td>G</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;

public class BfsLevels {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    static int[][] a = {                                // đồ thị của bài (slide 18-26)
        {0, 1, 0, 1, 1, 0, 0, 0},
        {1, 0, 1, 0, 1, 0, 0, 0},
        {0, 1, 0, 0, 0, 1, 0, 0},
        {1, 0, 0, 0, 1, 0, 0, 0},
        {1, 1, 0, 1, 0, 1, 0, 0},
        {0, 0, 1, 0, 1, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1},
        {0, 0, 0, 0, 0, 0, 1, 0}};
    static int n = v.length;
    static int[] level = new int[n];                    // số cạnh tính từ đỉnh xuất phát
    static boolean[] found = new boolean[n];

    static void bfs(int s) {
        ArrayDeque&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();
        q.add(s);
        found[s] = true;
        level[s] = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            System.out.print(" " + v[u] + "(" + level[u] + ")");
            for (int w = 0; w &lt; n; w++)                 // láng giềng theo thứ tự chữ cái
                if (a[u][w] &gt; 0 &amp;&amp; !found[w]) {
                    found[w] = true;
                    level[w] = level[u] + 1;            // xa hơn u đúng một tầng
                    q.add(w);
                }
        }
        System.out.println();
    }

    public static void main(String[] args) {
        System.out.print("BFS from A:    ");
        bfs(0);
        for (int s = 0; s &lt; n; s++)                     // khởi động lại từ đỉnh chưa được tìm thấy
            if (!found[s]) {
                System.out.print("restart at " + v[s] + ":");
                bfs(s);
            }
    }
}</code></pre>
<div class="out">BFS from A: &nbsp;&nbsp;&nbsp;&nbsp;A(0) B(1) D(1) E(1) C(2) F(2)<br>
restart at G: G(0) H(1)</div>
<p>Vì một đỉnh cách hai cạnh chỉ được tìm thấy sau khi mọi đỉnh cách một cạnh đã rời hàng đợi, BFS tới mỗi đỉnh bằng đường đi <strong>ít cạnh nhất</strong> — ý tưởng của bài 5.4.</p>
<div class="pitfall">Thứ tự BFS phụ thuộc vào thứ tự xét láng giềng. Đề thi luôn chốt điều này ("theo thứ tự chữ cái", "chỉ số nhỏ trước"); với ma trận và vòng <code>for (i = 0; i &lt; n; i++)</code> là tự động đúng — với danh sách kề thì thứ tự trong danh sách quyết định.</div>`],
      [22, 'Breadth-first Search Algorithm',
        `<p class="y-chinh">🎯 The pseudocode searches a graph (directed or not) breadth first with a queue, and colours the vertices: white = not found yet, gray = found and waiting in the queue, black = finished.</p>
<ol>
<li>Paint every vertex white; paint the root gray and put it in the queue.</li>
<li>While the queue is not empty: remove a vertex u; paint each white successor v gray and add it to the queue; then paint u black.</li>
</ol>
<pre><code class="language-java">import java.util.ArrayDeque;

public class BfsColors {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        int[][] a = {                                   // the lesson's graph
            {0, 1, 0, 1, 1, 0, 0, 0},
            {1, 0, 1, 0, 1, 0, 0, 0},
            {0, 1, 0, 0, 0, 1, 0, 0},
            {1, 0, 0, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0},
            {0, 0, 1, 0, 1, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1},
            {0, 0, 0, 0, 0, 0, 1, 0}};
        int n = v.length;
        char[] color = new char[n];
        for (int i = 0; i &lt; n; i++) color[i] = 'W';     // all vertices white
        ArrayDeque&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();
        color[0] = 'G';                                 // the root A: gray, into the queue
        q.add(0);
        System.out.println(String.format("start   -&gt;  gray:%-7s  (root)   queue: A", " A"));
        while (!q.isEmpty()) {
            int u = q.poll();                           // remove u from the queue
            String grayed = "";
            for (int x = 0; x &lt; n; x++)
                if (a[u][x] &gt; 0 &amp;&amp; color[x] == 'W') {   // every white successor x of u
                    color[x] = 'G';
                    q.add(x);
                    grayed += " " + v[x];
                }
            color[u] = 'B';                             // u is finished: black
            String qs = "";
            for (int x : q) qs += " " + v[x];
            System.out.println(String.format("take %c  -&gt;  gray:%-7s %c black   queue:%s", v[u], grayed.isEmpty() ? " -" : grayed, v[u], qs.isEmpty() ? " (empty)" : qs));
        }
        String white = "";
        for (int i = 0; i &lt; n; i++) if (color[i] == 'W') white += " " + v[i];
        System.out.println("still white:" + white);
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;-&gt; &nbsp;gray: A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(root) &nbsp;&nbsp;queue: A<br>
take A &nbsp;-&gt; &nbsp;gray: B D E &nbsp;A black &nbsp;&nbsp;queue: B D E<br>
take B &nbsp;-&gt; &nbsp;gray: C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B black &nbsp;&nbsp;queue: D E C<br>
take D &nbsp;-&gt; &nbsp;gray: - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D black &nbsp;&nbsp;queue: E C<br>
take E &nbsp;-&gt; &nbsp;gray: F &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E black &nbsp;&nbsp;queue: C F<br>
take C &nbsp;-&gt; &nbsp;gray: - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C black &nbsp;&nbsp;queue: F<br>
take F &nbsp;-&gt; &nbsp;gray: - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;F black &nbsp;&nbsp;queue: (empty)<br>
still white: G H</div>
<table>
<thead><tr><th>Colour</th><th>Meaning</th><th>In the code of slide 23</th></tr></thead>
<tbody>
<tr><td>white</td><td>not found yet</td><td><code>enqueued[i] == false</code></td></tr>
<tr><td>gray</td><td>found, waiting in the queue</td><td><code>enqueued[i] == true</code>, not yet dequeued</td></tr>
<tr><td>black</td><td>taken out, all successors examined</td><td>dequeued and visited</td></tr>
</tbody>
</table>
<p>At every moment the queue holds exactly the gray vertices, and BFS ends when no vertex is gray any more — here G and H stay white because the root is A and the pseudocode never restarts.</p>
<p><strong>Big-O:</strong> a vertex is enqueued only while white, so at most once; each adjacency list is scanned once → O(n + m) with lists. On a matrix every dequeued vertex scans a whole row of n cells → O(n²).</p>
<div class="pitfall">Paint gray (mark) when you <strong>enqueue</strong>, not when you dequeue. Marking late lets a vertex enter the queue twice — in the trace, E would be added again when B is taken out — giving a wrong order and wasted work.</div>
<p class="dap-an">✅ <strong>Class question CQ8.2 — what is BFS?</strong> A traversal that visits a start vertex, then every vertex one edge away, then two edges away, and so on, using a queue; each vertex is visited once, the cost is O(n + m) with adjacency lists, and every vertex is reached by a path with the fewest edges.</p>`,
        `<p class="y-chinh">🎯 Mã giả (pseudocode) duyệt đồ thị (có hướng hay không) theo chiều rộng bằng một hàng đợi và tô màu các đỉnh: trắng = chưa được tìm thấy, xám = đã tìm thấy và đang chờ trong hàng đợi, đen = đã xong.</p>
<ol>
<li>Tô trắng (white) mọi đỉnh; tô xám (gray) đỉnh gốc (root) rồi cho vào hàng đợi.</li>
<li>Khi hàng đợi còn phần tử: lấy ra một đỉnh u; tô xám từng đỉnh kề (successor) v còn trắng và cho v vào hàng đợi; xong thì tô đen (black) u.</li>
</ol>
<pre><code class="language-java">import java.util.ArrayDeque;

public class BfsColors {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        int[][] a = {                                   // đồ thị của bài
            {0, 1, 0, 1, 1, 0, 0, 0},
            {1, 0, 1, 0, 1, 0, 0, 0},
            {0, 1, 0, 0, 0, 1, 0, 0},
            {1, 0, 0, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0},
            {0, 0, 1, 0, 1, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1},
            {0, 0, 0, 0, 0, 0, 1, 0}};
        int n = v.length;
        char[] color = new char[n];
        for (int i = 0; i &lt; n; i++) color[i] = 'W';     // mọi đỉnh tô trắng
        ArrayDeque&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();
        color[0] = 'G';                                 // gốc A: tô xám, vào hàng đợi
        q.add(0);
        System.out.println(String.format("start   -&gt;  gray:%-7s  (root)   queue: A", " A"));
        while (!q.isEmpty()) {
            int u = q.poll();                           // lấy u ra khỏi hàng đợi
            String grayed = "";
            for (int x = 0; x &lt; n; x++)
                if (a[u][x] &gt; 0 &amp;&amp; color[x] == 'W') {   // mọi đỉnh kề trắng x của u
                    color[x] = 'G';
                    q.add(x);
                    grayed += " " + v[x];
                }
            color[u] = 'B';                             // u đã xong: tô đen
            String qs = "";
            for (int x : q) qs += " " + v[x];
            System.out.println(String.format("take %c  -&gt;  gray:%-7s %c black   queue:%s", v[u], grayed.isEmpty() ? " -" : grayed, v[u], qs.isEmpty() ? " (empty)" : qs));
        }
        String white = "";
        for (int i = 0; i &lt; n; i++) if (color[i] == 'W') white += " " + v[i];
        System.out.println("still white:" + white);
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;-&gt; &nbsp;gray: A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(root) &nbsp;&nbsp;queue: A<br>
take A &nbsp;-&gt; &nbsp;gray: B D E &nbsp;A black &nbsp;&nbsp;queue: B D E<br>
take B &nbsp;-&gt; &nbsp;gray: C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B black &nbsp;&nbsp;queue: D E C<br>
take D &nbsp;-&gt; &nbsp;gray: - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D black &nbsp;&nbsp;queue: E C<br>
take E &nbsp;-&gt; &nbsp;gray: F &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E black &nbsp;&nbsp;queue: C F<br>
take C &nbsp;-&gt; &nbsp;gray: - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C black &nbsp;&nbsp;queue: F<br>
take F &nbsp;-&gt; &nbsp;gray: - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;F black &nbsp;&nbsp;queue: (empty)<br>
still white: G H</div>
<table>
<thead><tr><th>Màu</th><th>Ý nghĩa</th><th>Trong code của slide 23</th></tr></thead>
<tbody>
<tr><td>trắng</td><td>chưa được tìm thấy</td><td><code>enqueued[i] == false</code></td></tr>
<tr><td>xám</td><td>đã tìm thấy, đang chờ trong hàng đợi</td><td><code>enqueued[i] == true</code>, chưa được lấy ra</td></tr>
<tr><td>đen</td><td>đã lấy ra, đã xét hết các đỉnh kề</td><td>đã lấy ra và đã thăm</td></tr>
</tbody>
</table>
<p>Ở mọi thời điểm, hàng đợi chứa đúng các đỉnh xám, và BFS kết thúc khi không còn đỉnh xám nào — ở đây G và H vẫn trắng vì gốc là A và mã giả không khởi động lại.</p>
<p><strong>Big-O:</strong> một đỉnh chỉ vào hàng đợi khi còn trắng, nên nhiều nhất một lần; mỗi danh sách kề được quét một lần → O(n + m) với danh sách kề. Trên ma trận, mỗi đỉnh lấy ra quét trọn một hàng n ô → O(n²).</p>
<div class="pitfall">Tô xám (đánh dấu) lúc <strong>đưa vào</strong> hàng đợi, không phải lúc lấy ra. Đánh dấu muộn thì một đỉnh vào hàng đợi hai lần — trong bảng trên, E sẽ bị thêm lần nữa khi lấy B ra — sai thứ tự và tốn công vô ích.</div>
<p class="dap-an">✅ <strong>Câu hỏi trên lớp CQ8.2 — BFS là gì?</strong> Là phép duyệt thăm đỉnh xuất phát, rồi mọi đỉnh cách một cạnh, rồi cách hai cạnh, cứ thế, bằng một hàng đợi (queue); mỗi đỉnh được thăm đúng một lần, chi phí O(n + m) với danh sách kề, và mỗi đỉnh được tới bằng đường đi ít cạnh nhất.</p>`],
      [23, 'Breadth-first Search code',
        `<p class="y-chinh">🎯 The course's BFS on an adjacency matrix: a boolean array <code>enqueued[]</code> replaces the colours, and <code>a[h][i] &gt; 0</code> means "i is a neighbour of h".</p>
<p>The program runs the slide's method unchanged (only re-indented) inside a small <code>Graph</code> class, with a minimal <code>MyQueue</code> of <code>Object</code>s standing in for the course's queue class:</p>
<pre><code class="language-java">import java.util.LinkedList;

class MyQueue {                                          // minimal queue of Objects, standing in for the course's MyQueue
    LinkedList&lt;Object&gt; t = new LinkedList&lt;Object&gt;();
    boolean isEmpty() { return t.isEmpty(); }
    void enqueue(Object x) { t.addLast(x); }
    Object dequeue() { return t.removeFirst(); }
}

class Graph {
    int[][] a;
    int n;
    char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};

    Graph(int[][] b) { a = b; n = b.length; }

    void visit(int i) { System.out.print(" " + v[i]); }

    // bread first traverse from vertex k   (the slide's code, re-indented only)
    void breadthFirst(int k) {
        MyQueue q = new MyQueue(); int i, h;
        boolean [] enqueued = new boolean[n];
        for (i = 0; i &lt; n; i++) enqueued[i] = false;
        q.enqueue(new Integer(k)); enqueued[k] = true;
        while (!q.isEmpty()) {
            h = Integer.parseInt((q.dequeue()).toString().trim());
            visit(h);
            for (i = 0; i &lt; n; i++)
                if ((!enqueued[i]) &amp;&amp; a[h][i] &gt; 0) {
                    q.enqueue(new Integer(i));
                    enqueued[i] = true;
                }
        }
        System.out.println();
    }

    void breadthFirstAll() {                             // added: restart from every vertex never enqueued
        boolean[] enqueued = new boolean[n];
        for (int s = 0; s &lt; n; s++) {
            if (enqueued[s]) continue;
            MyQueue q = new MyQueue();
            q.enqueue(s); enqueued[s] = true;            // autoboxing instead of new Integer(s)
            while (!q.isEmpty()) {
                int h = (Integer) q.dequeue();
                visit(h);
                for (int i = 0; i &lt; n; i++)
                    if (!enqueued[i] &amp;&amp; a[h][i] &gt; 0) { q.enqueue(i); enqueued[i] = true; }
            }
        }
        System.out.println();
    }
}

public class BreadthFirst {
    public static void main(String[] args) {
        int[][] b = {                                    // the lesson's graph
            {0, 1, 0, 1, 1, 0, 0, 0},
            {1, 0, 1, 0, 1, 0, 0, 0},
            {0, 1, 0, 0, 0, 1, 0, 0},
            {1, 0, 0, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0},
            {0, 0, 1, 0, 1, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1},
            {0, 0, 0, 0, 0, 0, 1, 0}};
        Graph g = new Graph(b);
        System.out.print("breadthFirst(0):  "); g.breadthFirst(0);
        System.out.print("breadthFirst(6):  "); g.breadthFirst(6);
        System.out.print("with restart:     "); g.breadthFirstAll();
    }
}</code></pre>
<div class="out">breadthFirst(0): &nbsp;&nbsp;A B D E C F<br>
breadthFirst(6): &nbsp;&nbsp;G H<br>
with restart: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A B D E C F G H</div>
<ul>
<li>Mark the start as enqueued, then for each dequeued h: visit it, and enqueue every i with <code>a[h][i] &gt; 0</code> that was never enqueued.</li>
<li><code>breadthFirst(0)</code> stops after A B D E C F: G and H lie in another component and the method has <strong>no restart loop</strong>, although slide 21 describes one. <code>breadthFirstAll()</code> adds it.</li>
<li><code>new Integer(k)</code> is deprecated since Java 9 — write <code>q.enqueue(k)</code> (autoboxing); and <code>(Integer) q.dequeue()</code> replaces the detour <code>Integer.parseInt(….toString().trim())</code>. The loop setting <code>enqueued[i] = false</code> is harmless but useless: a new boolean array is already all false.</li>
</ul>
<div class="pitfall">If a PE asks to "traverse all vertices" and you copy <code>breadthFirst(k)</code> from the slide, a disconnected test graph costs you the marks. Wrap it: one shared <code>enqueued[]</code>, and <code>for (s = 0; s &lt; n; s++) if (!enqueued[s]) …BFS from s…</code>.</div>`,
        `<p class="y-chinh">🎯 BFS của môn trên ma trận kề: mảng boolean <code>enqueued[]</code> (đã vào hàng đợi) thay cho các màu, và <code>a[h][i] &gt; 0</code> nghĩa là "i là láng giềng của h".</p>
<p>Chương trình chạy nguyên hàm của slide (chỉ canh lề lại) bên trong một lớp <code>Graph</code> nhỏ, với lớp <code>MyQueue</code> tối giản chứa <code>Object</code> đứng thay cho lớp hàng đợi của môn:</p>
<pre><code class="language-java">import java.util.LinkedList;

class MyQueue {                                          // hàng đợi Object tối giản, thay cho lớp MyQueue của môn
    LinkedList&lt;Object&gt; t = new LinkedList&lt;Object&gt;();
    boolean isEmpty() { return t.isEmpty(); }
    void enqueue(Object x) { t.addLast(x); }
    Object dequeue() { return t.removeFirst(); }
}

class Graph {
    int[][] a;
    int n;
    char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};

    Graph(int[][] b) { a = b; n = b.length; }

    void visit(int i) { System.out.print(" " + v[i]); }

    // bread first traverse from vertex k   (code của slide, chỉ canh lề lại)
    void breadthFirst(int k) {
        MyQueue q = new MyQueue(); int i, h;
        boolean [] enqueued = new boolean[n];
        for (i = 0; i &lt; n; i++) enqueued[i] = false;
        q.enqueue(new Integer(k)); enqueued[k] = true;
        while (!q.isEmpty()) {
            h = Integer.parseInt((q.dequeue()).toString().trim());
            visit(h);
            for (i = 0; i &lt; n; i++)
                if ((!enqueued[i]) &amp;&amp; a[h][i] &gt; 0) {
                    q.enqueue(new Integer(i));
                    enqueued[i] = true;
                }
        }
        System.out.println();
    }

    void breadthFirstAll() {                             // thêm: khởi động lại từ mọi đỉnh chưa từng vào hàng đợi
        boolean[] enqueued = new boolean[n];
        for (int s = 0; s &lt; n; s++) {
            if (enqueued[s]) continue;
            MyQueue q = new MyQueue();
            q.enqueue(s); enqueued[s] = true;            // tự đóng hộp thay cho new Integer(s)
            while (!q.isEmpty()) {
                int h = (Integer) q.dequeue();
                visit(h);
                for (int i = 0; i &lt; n; i++)
                    if (!enqueued[i] &amp;&amp; a[h][i] &gt; 0) { q.enqueue(i); enqueued[i] = true; }
            }
        }
        System.out.println();
    }
}

public class BreadthFirst {
    public static void main(String[] args) {
        int[][] b = {                                    // đồ thị của bài
            {0, 1, 0, 1, 1, 0, 0, 0},
            {1, 0, 1, 0, 1, 0, 0, 0},
            {0, 1, 0, 0, 0, 1, 0, 0},
            {1, 0, 0, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0},
            {0, 0, 1, 0, 1, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1},
            {0, 0, 0, 0, 0, 0, 1, 0}};
        Graph g = new Graph(b);
        System.out.print("breadthFirst(0):  "); g.breadthFirst(0);
        System.out.print("breadthFirst(6):  "); g.breadthFirst(6);
        System.out.print("with restart:     "); g.breadthFirstAll();
    }
}</code></pre>
<div class="out">breadthFirst(0): &nbsp;&nbsp;A B D E C F<br>
breadthFirst(6): &nbsp;&nbsp;G H<br>
with restart: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A B D E C F G H</div>
<ul>
<li>Đánh dấu đỉnh xuất phát đã vào hàng đợi, rồi với mỗi h lấy ra: thăm nó, và cho vào hàng đợi mọi i có <code>a[h][i] &gt; 0</code> mà chưa từng vào.</li>
<li><code>breadthFirst(0)</code> dừng sau A B D E C F: G và H nằm ở thành phần khác và hàm <strong>không có vòng khởi động lại</strong>, dù slide 21 có mô tả. <code>breadthFirstAll()</code> bổ sung vòng đó.</li>
<li><code>new Integer(k)</code> đã lỗi thời (deprecated) từ Java 9 — viết <code>q.enqueue(k)</code> (tự đóng hộp — autoboxing); và <code>(Integer) q.dequeue()</code> thay cho đường vòng <code>Integer.parseInt(….toString().trim())</code>. Vòng gán <code>enqueued[i] = false</code> vô hại nhưng thừa: mảng boolean mới tạo đã toàn false.</li>
</ul>
<div class="pitfall">Nếu đề PE bảo "duyệt mọi đỉnh" mà bạn chép <code>breadthFirst(k)</code> của slide, bộ test có đồ thị không liên thông sẽ làm bạn mất điểm. Bọc lại: dùng chung một mảng <code>enqueued[]</code>, và <code>for (s = 0; s &lt; n; s++) if (!enqueued[s]) …BFS từ s…</code>.</div>`],
      [24, 'Depth-first Traversal',
        `<p class="y-chinh">🎯 DFS visits the start vertex, then explores each unvisited neighbour completely — by DFS again — before trying the next one; vertices left unvisited cause a restart.</p>
<p>The slide shows depthFirstSearch() applied to a graph as a picture. Here is the same algorithm on the lesson's graph, printing every call (enter) and every return (leave):</p>
<pre><code class="language-java">public class DfsTrace {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    static int[][] a = {                                // the lesson's graph
        {0, 1, 0, 1, 1, 0, 0, 0},
        {1, 0, 1, 0, 1, 0, 0, 0},
        {0, 1, 0, 0, 0, 1, 0, 0},
        {1, 0, 0, 0, 1, 0, 0, 0},
        {1, 1, 0, 1, 0, 1, 0, 0},
        {0, 0, 1, 0, 1, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1},
        {0, 0, 0, 0, 0, 0, 1, 0}};
    static int n = v.length;
    static boolean[] visited = new boolean[n];
    static String stack = "";                           // the recursion (call) stack, bottom -&gt; top
    static String order = "";

    static void dfs(int u) {
        visited[u] = true;
        stack += " " + v[u];
        order += " " + v[u];
        System.out.println("enter " + v[u] + "   stack:" + stack);
        for (int w = 0; w &lt; n; w++)                     // first unvisited neighbour, in alphabetical order
            if (a[u][w] &gt; 0 &amp;&amp; !visited[w]) dfs(w);
        stack = stack.substring(0, stack.length() - 2);
        System.out.println("leave " + v[u] + "   stack:" + (stack.isEmpty() ? " (empty)" : stack));
    }

    public static void main(String[] args) {
        dfs(0);
        for (int s = 0; s &lt; n; s++)                     // restart from any vertex still unvisited
            if (!visited[s]) {
                System.out.println("restart at " + v[s]);
                dfs(s);
            }
        System.out.println("DFS order:" + order);
    }
}</code></pre>
<div class="out">enter A &nbsp;&nbsp;stack: A<br>
enter B &nbsp;&nbsp;stack: A B<br>
enter C &nbsp;&nbsp;stack: A B C<br>
enter F &nbsp;&nbsp;stack: A B C F<br>
enter E &nbsp;&nbsp;stack: A B C F E<br>
enter D &nbsp;&nbsp;stack: A B C F E D<br>
leave D &nbsp;&nbsp;stack: A B C F E<br>
leave E &nbsp;&nbsp;stack: A B C F<br>
leave F &nbsp;&nbsp;stack: A B C<br>
leave C &nbsp;&nbsp;stack: A B<br>
leave B &nbsp;&nbsp;stack: A<br>
leave A &nbsp;&nbsp;stack: (empty)<br>
restart at G<br>
enter G &nbsp;&nbsp;stack: G<br>
enter H &nbsp;&nbsp;stack: G H<br>
leave H &nbsp;&nbsp;stack: G<br>
leave G &nbsp;&nbsp;stack: (empty)<br>
DFS order: A B C F E D G H</div>
<table>
<thead><tr><th>Call</th><th>Why this vertex</th><th>Call stack after entering</th></tr></thead>
<tbody>
<tr><td>dfs(A)</td><td>the start</td><td>A</td></tr>
<tr><td>dfs(B)</td><td>first unvisited neighbour of A</td><td>A B</td></tr>
<tr><td>dfs(C)</td><td>B: A visited → C</td><td>A B C</td></tr>
<tr><td>dfs(F)</td><td>C: B visited → F</td><td>A B C F</td></tr>
<tr><td>dfs(E)</td><td>F: C visited → E</td><td>A B C F E</td></tr>
<tr><td>dfs(D)</td><td>E: A, B visited → D</td><td>A B C F E D</td></tr>
<tr><td>leave D, E, F, C, B, A</td><td>none of them has an unvisited neighbour left</td><td>shrinks back to (empty)</td></tr>
<tr><td>dfs(G)</td><td>restart: first unvisited vertex</td><td>G</td></tr>
<tr><td>dfs(H)</td><td>G's neighbour</td><td>G H</td></tr>
</tbody>
</table>
<p>DFS order A B C F E D G H versus BFS order A B D E C F G H on the same graph: DFS runs down the long route A–B–C–F–E–D before it ever looks at A's other neighbours D and E.</p>
<p class="meo">🧠 <strong>Remember:</strong> BFS = ripples on water, circle by circle; DFS = a maze walker who follows one corridor to its end, then backs up to the last junction.</p>
<div class="pitfall">Tracing DFS by hand, the classic slip is to list all of A's neighbours first — that is BFS. DFS enters B at once and comes back to A's next neighbour only when B's whole branch is finished; by then D and E are already visited.</div>
<p class="dap-an">✅ <strong>Class question CQ10.3 — BFS vs DFS:</strong> BFS uses a queue and spreads level by level (fewest-edge paths; memory for a whole level); DFS uses a stack or recursion and follows one branch to the end (cycles, components, topological order; memory for one path). Both visit every vertex once, O(n + m) with adjacency lists.</p>`,
        `<p class="y-chinh">🎯 DFS (duyệt theo chiều sâu — depth-first search) thăm đỉnh xuất phát, rồi khám phá trọn vẹn từng láng giềng chưa thăm — lại bằng DFS — trước khi thử láng giềng kế tiếp; còn đỉnh chưa thăm thì khởi động lại.</p>
<p>Slide minh hoạ depthFirstSearch() trên một đồ thị bằng hình. Dưới đây là cùng thuật toán trên đồ thị của bài, in ra mỗi lần gọi (enter — vào) và mỗi lần trả về (leave — rời):</p>
<pre><code class="language-java">public class DfsTrace {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    static int[][] a = {                                // đồ thị của bài
        {0, 1, 0, 1, 1, 0, 0, 0},
        {1, 0, 1, 0, 1, 0, 0, 0},
        {0, 1, 0, 0, 0, 1, 0, 0},
        {1, 0, 0, 0, 1, 0, 0, 0},
        {1, 1, 0, 1, 0, 1, 0, 0},
        {0, 0, 1, 0, 1, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 1},
        {0, 0, 0, 0, 0, 0, 1, 0}};
    static int n = v.length;
    static boolean[] visited = new boolean[n];
    static String stack = "";                           // ngăn xếp lời gọi đệ quy, đáy -&gt; đỉnh
    static String order = "";

    static void dfs(int u) {
        visited[u] = true;
        stack += " " + v[u];
        order += " " + v[u];
        System.out.println("enter " + v[u] + "   stack:" + stack);
        for (int w = 0; w &lt; n; w++)                     // láng giềng chưa thăm đầu tiên, theo thứ tự chữ cái
            if (a[u][w] &gt; 0 &amp;&amp; !visited[w]) dfs(w);
        stack = stack.substring(0, stack.length() - 2);
        System.out.println("leave " + v[u] + "   stack:" + (stack.isEmpty() ? " (empty)" : stack));
    }

    public static void main(String[] args) {
        dfs(0);
        for (int s = 0; s &lt; n; s++)                     // khởi động lại từ đỉnh còn chưa thăm
            if (!visited[s]) {
                System.out.println("restart at " + v[s]);
                dfs(s);
            }
        System.out.println("DFS order:" + order);
    }
}</code></pre>
<div class="out">enter A &nbsp;&nbsp;stack: A<br>
enter B &nbsp;&nbsp;stack: A B<br>
enter C &nbsp;&nbsp;stack: A B C<br>
enter F &nbsp;&nbsp;stack: A B C F<br>
enter E &nbsp;&nbsp;stack: A B C F E<br>
enter D &nbsp;&nbsp;stack: A B C F E D<br>
leave D &nbsp;&nbsp;stack: A B C F E<br>
leave E &nbsp;&nbsp;stack: A B C F<br>
leave F &nbsp;&nbsp;stack: A B C<br>
leave C &nbsp;&nbsp;stack: A B<br>
leave B &nbsp;&nbsp;stack: A<br>
leave A &nbsp;&nbsp;stack: (empty)<br>
restart at G<br>
enter G &nbsp;&nbsp;stack: G<br>
enter H &nbsp;&nbsp;stack: G H<br>
leave H &nbsp;&nbsp;stack: G<br>
leave G &nbsp;&nbsp;stack: (empty)<br>
DFS order: A B C F E D G H</div>
<table>
<thead><tr><th>Lời gọi</th><th>Vì sao chọn đỉnh này</th><th>Ngăn xếp lời gọi (call stack) sau khi vào</th></tr></thead>
<tbody>
<tr><td>dfs(A)</td><td>điểm xuất phát</td><td>A</td></tr>
<tr><td>dfs(B)</td><td>láng giềng chưa thăm đầu tiên của A</td><td>A B</td></tr>
<tr><td>dfs(C)</td><td>B: A đã thăm → C</td><td>A B C</td></tr>
<tr><td>dfs(F)</td><td>C: B đã thăm → F</td><td>A B C F</td></tr>
<tr><td>dfs(E)</td><td>F: C đã thăm → E</td><td>A B C F E</td></tr>
<tr><td>dfs(D)</td><td>E: A, B đã thăm → D</td><td>A B C F E D</td></tr>
<tr><td>rời D, E, F, C, B, A</td><td>không đỉnh nào còn láng giềng chưa thăm</td><td>co dần về rỗng (empty)</td></tr>
<tr><td>dfs(G)</td><td>khởi động lại: đỉnh chưa thăm đầu tiên</td><td>G</td></tr>
<tr><td>dfs(H)</td><td>láng giềng của G</td><td>G H</td></tr>
</tbody>
</table>
<p>Thứ tự DFS A B C F E D G H so với thứ tự BFS A B D E C F G H trên cùng đồ thị: DFS lao theo đường dài A–B–C–F–E–D trước khi kịp nhìn tới hai láng giềng còn lại của A là D và E.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> BFS = gợn sóng trên mặt nước, lan từng vòng; DFS = người đi mê cung, theo một hành lang tới tận cùng rồi mới lùi về ngã rẽ gần nhất.</p>
<div class="pitfall">Chạy tay DFS, lỗi kinh điển là liệt kê hết láng giềng của A trước — đó là BFS. DFS bước ngay vào B và chỉ quay lại láng giềng kế tiếp của A khi cả nhánh của B đã xong; lúc đó D và E đều đã được thăm.</div>
<p class="dap-an">✅ <strong>Câu hỏi trên lớp CQ10.3 — BFS khác DFS thế nào:</strong> BFS dùng hàng đợi và lan theo từng tầng (đường ít cạnh nhất; tốn bộ nhớ cho cả một tầng); DFS dùng ngăn xếp hoặc đệ quy và đi hết một nhánh (tìm chu trình, thành phần liên thông, thứ tự tô-pô — topological order; bộ nhớ cho một đường đi). Cả hai thăm mỗi đỉnh một lần, O(n + m) với danh sách kề.</p>`],
      [25, 'Depth-First Search algorithm',
        `<p class="y-chinh">🎯 DFS is the same idea as BFS with a stack instead of a queue — written recursively, Java's call stack does the stacking — and on n vertices and m edges it takes O(n + m) time.</p>
<ul>
<li><strong>DFS-visit(G, u)</strong>: paint u gray; for every white successor v, DFS-visit(G, v); paint u black.</li>
<li><strong>DFS(G)</strong>: paint all vertices white, then DFS-visit(G, root). As written it starts once, from the root; the restart loop appears in the code of slide 26.</li>
<li>Gray = on the call stack right now (entered, not finished); black = finished — the "leave" lines of slide 24.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

public class DfsCost {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    static String[] edges = {"AB", "AD", "AE", "BC", "BE", "CF", "DE", "EF", "GH"};   // the lesson's graph
    static int n = v.length;
    static int[][] a = new int[n][n];
    static ArrayList&lt;ArrayList&lt;Integer&gt;&gt; adj = new ArrayList&lt;ArrayList&lt;Integer&gt;&gt;();
    static boolean[] seen;
    static int calls, checks;
    static String order;

    static void dfsList(int u) {                        // adjacency list: scan only u's neighbours
        seen[u] = true; calls++; order += " " + v[u];
        for (int w : adj.get(u)) {
            checks++;
            if (!seen[w]) dfsList(w);
        }
    }

    static void dfsMatrix(int u) {                      // adjacency matrix: scan the whole row u
        seen[u] = true; calls++; order += " " + v[u];
        for (int w = 0; w &lt; n; w++) {
            checks++;
            if (a[u][w] &gt; 0 &amp;&amp; !seen[w]) dfsMatrix(w);
        }
    }

    static void run(String name, boolean list) {
        seen = new boolean[n]; calls = 0; checks = 0; order = "";
        for (int s = 0; s &lt; n; s++)
            if (!seen[s]) { if (list) dfsList(s); else dfsMatrix(s); }
        System.out.println(name + order + "   calls " + calls + ", checks " + checks);
    }

    public static void main(String[] args) {
        for (int i = 0; i &lt; n; i++) adj.add(new ArrayList&lt;Integer&gt;());
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;
            adj.get(x).add(y);
            adj.get(y).add(x);
        }
        int m = edges.length;
        run("adjacency list:  ", true);
        run("adjacency matrix:", false);
        System.out.println("n = " + n + ", m = " + m + ": list checks = 2m = " + 2 * m + ", matrix checks = n*n = " + n * n);
    }
}</code></pre>
<div class="out">adjacency list: &nbsp;&nbsp;A B C F E D G H &nbsp;&nbsp;calls 8, checks 18<br>
adjacency matrix: A B C F E D G H &nbsp;&nbsp;calls 8, checks 64<br>
n = 8, m = 9: list checks = 2m = 18, matrix checks = n*n = 64</div>
<p><strong>Why O(n + m):</strong> DFS-visit runs once per vertex (n calls) and each call scans its own list once; all lists together hold 2m entries (Σ deg = 2m). On a matrix each call scans a full row of n cells: n × n = O(n²) — 64 checks instead of 18 for our graph.</p>
<div class="pitfall">"DFS is O(n + m)" holds for adjacency lists only; the course code (slide 26) uses a matrix, so it is O(n²). Recursion depth can reach n: a path of 100 000 vertices overflows Java's stack (StackOverflowError) — an explicit stack avoids that.</div>
<p class="dap-an">✅ <strong>Class question CQ8.3 — what is DFS?</strong> A traversal that goes from the start vertex to an unvisited neighbour, from there to one of its unvisited neighbours, and so on as deep as possible, backing up (with a stack or recursion) when a vertex has no unvisited neighbour left; O(n + m) with adjacency lists.</p>`,
        `<p class="y-chinh">🎯 DFS cùng ý tưởng với BFS nhưng dùng ngăn xếp (stack) thay cho hàng đợi — viết bằng đệ quy thì ngăn xếp lời gọi của Java lo phần đó — và trên đồ thị n đỉnh, m cạnh nó tốn thời gian O(n + m).</p>
<ul>
<li><strong>DFS-visit(G, u)</strong>: tô xám u; với mọi đỉnh kề v còn trắng, gọi DFS-visit(G, v); xong tô đen u.</li>
<li><strong>DFS(G)</strong>: tô trắng mọi đỉnh, rồi gọi DFS-visit(G, root) — gốc (root). Viết như vậy thì chỉ chạy một lần từ gốc; vòng khởi động lại nằm trong code của slide 26.</li>
<li>Xám = đang nằm trên ngăn xếp lời gọi (đã vào, chưa xong); đen = đã xong — chính là các dòng "leave" ở slide 24.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

public class DfsCost {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    static String[] edges = {"AB", "AD", "AE", "BC", "BE", "CF", "DE", "EF", "GH"};   // đồ thị của bài
    static int n = v.length;
    static int[][] a = new int[n][n];
    static ArrayList&lt;ArrayList&lt;Integer&gt;&gt; adj = new ArrayList&lt;ArrayList&lt;Integer&gt;&gt;();
    static boolean[] seen;
    static int calls, checks;
    static String order;

    static void dfsList(int u) {                        // danh sách kề: chỉ quét láng giềng của u
        seen[u] = true; calls++; order += " " + v[u];
        for (int w : adj.get(u)) {
            checks++;
            if (!seen[w]) dfsList(w);
        }
    }

    static void dfsMatrix(int u) {                      // ma trận kề: quét cả hàng u
        seen[u] = true; calls++; order += " " + v[u];
        for (int w = 0; w &lt; n; w++) {
            checks++;
            if (a[u][w] &gt; 0 &amp;&amp; !seen[w]) dfsMatrix(w);
        }
    }

    static void run(String name, boolean list) {
        seen = new boolean[n]; calls = 0; checks = 0; order = "";
        for (int s = 0; s &lt; n; s++)
            if (!seen[s]) { if (list) dfsList(s); else dfsMatrix(s); }
        System.out.println(name + order + "   calls " + calls + ", checks " + checks);
    }

    public static void main(String[] args) {
        for (int i = 0; i &lt; n; i++) adj.add(new ArrayList&lt;Integer&gt;());
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;
            adj.get(x).add(y);
            adj.get(y).add(x);
        }
        int m = edges.length;
        run("adjacency list:  ", true);
        run("adjacency matrix:", false);
        System.out.println("n = " + n + ", m = " + m + ": list checks = 2m = " + 2 * m + ", matrix checks = n*n = " + n * n);
    }
}</code></pre>
<div class="out">adjacency list: &nbsp;&nbsp;A B C F E D G H &nbsp;&nbsp;calls 8, checks 18<br>
adjacency matrix: A B C F E D G H &nbsp;&nbsp;calls 8, checks 64<br>
n = 8, m = 9: list checks = 2m = 18, matrix checks = n*n = 64</div>
<p><strong>Vì sao O(n + m):</strong> DFS-visit chạy đúng một lần cho mỗi đỉnh (n lời gọi) và mỗi lời gọi quét danh sách của riêng nó một lần; tất cả danh sách cộng lại có 2m phần tử (Σ deg = 2m). Trên ma trận, mỗi lời gọi quét trọn một hàng n ô: n × n = O(n²) — 64 lần kiểm thay vì 18 với đồ thị của bài.</p>
<div class="pitfall">"DFS là O(n + m)" chỉ đúng với danh sách kề; code của môn (slide 26) dùng ma trận nên là O(n²). Độ sâu đệ quy có thể tới n: một đường thẳng 100 000 đỉnh làm tràn ngăn xếp của Java (StackOverflowError) — dùng ngăn xếp tự quản lý (explicit stack) thì tránh được.</div>
<p class="dap-an">✅ <strong>Câu hỏi trên lớp CQ8.3 — DFS là gì?</strong> Là phép duyệt đi từ đỉnh xuất phát sang một láng giềng chưa thăm, từ đó sang một láng giềng chưa thăm của nó, cứ thế càng sâu càng tốt, và lùi lại (nhờ ngăn xếp hoặc đệ quy) khi một đỉnh không còn láng giềng chưa thăm; O(n + m) với danh sách kề.</p>`],
      [26, 'Depth-First Traverse code',
        `<p class="y-chinh">🎯 The course's DFS: <code>depthFirst(visited, i)</code> visits i, marks it, and recurses into every unvisited j with <code>a[i][j] &gt; 0</code>; <code>depthFirst(k)</code> starts at k, then restarts from every vertex still unvisited.</p>
<p>The program runs the slide's three methods unchanged (re-indented, plus one comment on the bug), then a fixed version:</p>
<pre><code class="language-java">class Graph {
    int[][] a;
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    // ---- the slide's code, re-indented only
    void visit(int i) {
        System.out.print(" " + v[i]);
    }

    void depthFirst(boolean visited[], int i) {
        visit(i); visited[i] = true;
        int j;
        for (j = 0; j &lt; n; j++)
            if (a[i][j] &gt; 0 &amp;&amp; (!visited[j]))
                depthFirst(visited, j);
    }

    void depthFirst(int k) {
        int i; boolean [] visited = new boolean[20];     // BUG: 20 is hard-coded
        for (i = 0; i &lt; n; i++) visited[i] = false;
        depthFirst(visited, k);
        for (i = 0; i &lt; n; i++)
            if (!visited[i])
                depthFirst(visited, i);
        System.out.println();
    }
    // ---- end of the slide's code

    void depthFirstFixed(int k) {                        // the fix: size the array with n
        boolean[] visited = new boolean[n];              // a new boolean[] is already all false
        depthFirst(visited, k);
        for (int i = 0; i &lt; n; i++)
            if (!visited[i]) depthFirst(visited, i);
        System.out.println();
    }
}

public class DepthFirst {
    public static void main(String[] args) {
        int[][] b = {                                    // the lesson's graph
            {0, 1, 0, 1, 1, 0, 0, 0},
            {1, 0, 1, 0, 1, 0, 0, 0},
            {0, 1, 0, 0, 0, 1, 0, 0},
            {1, 0, 0, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0},
            {0, 0, 1, 0, 1, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1},
            {0, 0, 0, 0, 0, 0, 1, 0}};
        Graph g = new Graph(b);
        System.out.print("depthFirst(0):"); g.depthFirst(0);
        System.out.print("depthFirst(6):"); g.depthFirst(6);
        int[][] p = new int[21][21];                     // a path A-B-C-...-U: 21 vertices
        for (int i = 0; i + 1 &lt; 21; i++) p[i][i + 1] = p[i + 1][i] = 1;
        Graph big = new Graph(p);
        try {
            big.depthFirst(0);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("n = 21, slide code: " + e.getClass().getSimpleName());
        }
        System.out.print("n = 21, fixed code:"); big.depthFirstFixed(0);
    }
}</code></pre>
<div class="out">depthFirst(0): A B C F E D G H<br>
depthFirst(6): G H A B C F E D<br>
n = 21, slide code: ArrayIndexOutOfBoundsException<br>
n = 21, fixed code: A B C D E F G H I J K L M N O P Q R S T U</div>
<ul>
<li><code>depthFirst(0)</code> gives A B C F E D, then the restart loop adds G H — the same order as the trace of slide 24.</li>
<li><code>depthFirst(6)</code> starts at G: G H first, then the loop scans from index 0, finds A unvisited and continues — G H A B C F E D.</li>
<li><strong>Bug</strong>: <code>new boolean[20]</code> is hard-coded. With n = 21 the initialising loop writes <code>visited[20]</code> and throws ArrayIndexOutOfBoundsException before anything is printed. Size it with <code>n</code>.</li>
</ul>
<div class="pitfall">The slide's <code>depthFirst(int k)</code> passes the small test graphs and crashes on any graph with more than 20 vertices — a PE test set may well contain one. Always write <code>new boolean[n]</code> (the <code>= false</code> loop can go: a new boolean array is already all false).</div>
<p class="meo">🧠 <strong>Remember:</strong> BFS marks a vertex when it enters the queue; DFS marks it when the call enters it (<code>visited[i] = true</code> right next to <code>visit(i)</code>).</p>`,
        `<p class="y-chinh">🎯 DFS của môn: <code>depthFirst(visited, i)</code> thăm i, đánh dấu, rồi gọi đệ quy vào mọi j chưa thăm có <code>a[i][j] &gt; 0</code>; <code>depthFirst(k)</code> bắt đầu từ k, rồi khởi động lại từ mọi đỉnh còn chưa thăm.</p>
<p>Chương trình chạy nguyên ba hàm của slide (chỉ canh lề lại, thêm một dòng chú thích chỗ lỗi), sau đó là bản đã sửa:</p>
<pre><code class="language-java">class Graph {
    int[][] a;
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    // ---- code của slide, chỉ canh lề lại
    void visit(int i) {
        System.out.print(" " + v[i]);
    }

    void depthFirst(boolean visited[], int i) {
        visit(i); visited[i] = true;
        int j;
        for (j = 0; j &lt; n; j++)
            if (a[i][j] &gt; 0 &amp;&amp; (!visited[j]))
                depthFirst(visited, j);
    }

    void depthFirst(int k) {
        int i; boolean [] visited = new boolean[20];     // LỖI: số 20 viết cứng
        for (i = 0; i &lt; n; i++) visited[i] = false;
        depthFirst(visited, k);
        for (i = 0; i &lt; n; i++)
            if (!visited[i])
                depthFirst(visited, i);
        System.out.println();
    }
    // ---- hết code của slide

    void depthFirstFixed(int k) {                        // sửa: cấp mảng theo n
        boolean[] visited = new boolean[n];              // mảng boolean mới đã toàn false
        depthFirst(visited, k);
        for (int i = 0; i &lt; n; i++)
            if (!visited[i]) depthFirst(visited, i);
        System.out.println();
    }
}

public class DepthFirst {
    public static void main(String[] args) {
        int[][] b = {                                    // đồ thị của bài
            {0, 1, 0, 1, 1, 0, 0, 0},
            {1, 0, 1, 0, 1, 0, 0, 0},
            {0, 1, 0, 0, 0, 1, 0, 0},
            {1, 0, 0, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0},
            {0, 0, 1, 0, 1, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 1},
            {0, 0, 0, 0, 0, 0, 1, 0}};
        Graph g = new Graph(b);
        System.out.print("depthFirst(0):"); g.depthFirst(0);
        System.out.print("depthFirst(6):"); g.depthFirst(6);
        int[][] p = new int[21][21];                     // đường đi A-B-C-...-U: 21 đỉnh
        for (int i = 0; i + 1 &lt; 21; i++) p[i][i + 1] = p[i + 1][i] = 1;
        Graph big = new Graph(p);
        try {
            big.depthFirst(0);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("n = 21, slide code: " + e.getClass().getSimpleName());
        }
        System.out.print("n = 21, fixed code:"); big.depthFirstFixed(0);
    }
}</code></pre>
<div class="out">depthFirst(0): A B C F E D G H<br>
depthFirst(6): G H A B C F E D<br>
n = 21, slide code: ArrayIndexOutOfBoundsException<br>
n = 21, fixed code: A B C D E F G H I J K L M N O P Q R S T U</div>
<ul>
<li><code>depthFirst(0)</code> cho A B C F E D, rồi vòng khởi động lại thêm G H — trùng thứ tự với bảng lần theo ở slide 24.</li>
<li><code>depthFirst(6)</code> bắt đầu ở G: G H trước, rồi vòng lặp quét từ chỉ số 0, gặp A chưa thăm và đi tiếp — G H A B C F E D.</li>
<li><strong>Lỗi (bug)</strong>: <code>new boolean[20]</code> viết cứng số 20. Với n = 21, vòng khởi tạo ghi vào <code>visited[20]</code> và văng ArrayIndexOutOfBoundsException trước khi in được gì. Phải cấp mảng theo <code>n</code>.</li>
</ul>
<div class="pitfall">Hàm <code>depthFirst(int k)</code> của slide qua được các đồ thị test nhỏ và sập với mọi đồ thị trên 20 đỉnh — bộ test PE hoàn toàn có thể có một đồ thị như vậy. Luôn viết <code>new boolean[n]</code> (bỏ luôn vòng gán <code>= false</code>: mảng boolean mới đã toàn false).</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> BFS đánh dấu đỉnh lúc nó vào hàng đợi; DFS đánh dấu lúc lời gọi bước vào đỉnh (<code>visited[i] = true</code> ngay cạnh <code>visit(i)</code>).</p>`],
      [27, 'Shortest Path problem',
        `<p class="y-chinh">🎯 The shortest path problem asks for a path of minimum total weight between a pair of vertices; the graph is given as a weight matrix W with W(i, i) = 0, W(i, j) = ∞ when there is no edge, and the weight of edge (i, j) otherwise.</p>
<ul>
<li><strong>Weight</strong> of an edge = its cost: kilometres, minutes, money. <strong>Length of a path</strong> = the sum of its weights — no longer the number of edges, as in BFS.</li>
<li>The slide allows <strong>negative edges but no negative cycles</strong>: going round a cycle of negative total weight makes a path shorter every lap, so no shortest path would exist.</li>
<li>∞ in code is a large constant. The slide's example (slide 30) uses 99; <code>Integer.MAX_VALUE</code> is a trap because adding anything to it overflows.</li>
</ul>
<pre><code class="language-java">public class WeightMatrix {
    static final int INF = Integer.MAX_VALUE / 2;       // big, yet INF + INF still fits in an int

    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D'};
        int n = v.length;
        int[][] w = new int[n][n];
        for (int i = 0; i &lt; n; i++)
            for (int j = 0; j &lt; n; j++)
                w[i][j] = (i == j) ? 0 : INF;           // W(i,i) = 0; no edge = infinity
        w[0][1] = 4; w[0][2] = 1; w[2][1] = 2; w[1][3] = 5; w[2][3] = 8;   // W(i,j) = weight of the edge i -&gt; j
        System.out.println("      A    B    C    D");
        for (int i = 0; i &lt; n; i++) {
            System.out.print(v[i] + " ");
            for (int j = 0; j &lt; n; j++) System.out.print(w[i][j] == INF ? "  INF" : String.format("%5d", w[i][j]));
            System.out.println();
        }
        System.out.println("A-&gt;C-&gt;B = " + (w[0][2] + w[2][1]) + "  is shorter than the direct edge A-&gt;B = " + w[0][1]);

        int big = Integer.MAX_VALUE;
        System.out.println("Integer.MAX_VALUE + 5 = " + (big + 5) + "   &lt;- overflow: 'infinity' turned negative");
        System.out.println("INF + INF = " + (INF + INF) + "   &lt;- MAX_VALUE / 2 stays positive");

        // another graph with a negative cycle X -&gt; Y -&gt; X (weights 1 and -3)
        for (int laps = 0; laps &lt;= 3; laps++)
            System.out.println("S-&gt;X (5) plus " + laps + " lap(s) of X-&gt;Y-&gt;X: length " + (5 + laps * (1 - 3)));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;D<br>
A &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;1 &nbsp;INF<br>
B &nbsp;&nbsp;INF &nbsp;&nbsp;&nbsp;0 &nbsp;INF &nbsp;&nbsp;&nbsp;5<br>
C &nbsp;&nbsp;INF &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;8<br>
D &nbsp;&nbsp;INF &nbsp;INF &nbsp;INF &nbsp;&nbsp;&nbsp;0<br>
A-&gt;C-&gt;B = 3 &nbsp;is shorter than the direct edge A-&gt;B = 4<br>
Integer.MAX_VALUE + 5 = -2147483644 &nbsp;&nbsp;&lt;- overflow: 'infinity' turned negative<br>
INF + INF = 2147483646 &nbsp;&nbsp;&lt;- MAX_VALUE / 2 stays positive<br>
S-&gt;X (5) plus 0 lap(s) of X-&gt;Y-&gt;X: length 5<br>
S-&gt;X (5) plus 1 lap(s) of X-&gt;Y-&gt;X: length 3<br>
S-&gt;X (5) plus 2 lap(s) of X-&gt;Y-&gt;X: length 1<br>
S-&gt;X (5) plus 3 lap(s) of X-&gt;Y-&gt;X: length -1</div>
<p>Read the output from the top: the shortest way from A to B is not the edge A→B (4) but A→C→B (1 + 2 = 3); <code>Integer.MAX_VALUE + 5</code> wraps round to a negative number; and each lap of the negative cycle X→Y→X (1 − 3 = −2) makes the path 2 shorter, without end.</p>
<p>Two versions of the question, two algorithms: <strong>Dijkstra</strong> (slides 28–31) — from one source to every vertex, weights ≥ 0; <strong>Floyd</strong> (slides 32–34) — between every pair, negative edges allowed.</p>
<div class="pitfall">With <code>INF = Integer.MAX_VALUE</code>, the test <code>d[u] + w &lt; d[v]</code> compares an overflowed negative number and "improves" distances that do not exist. Take <code>Integer.MAX_VALUE / 2</code>, or a small sentinel like 99 only when every real path is shorter — and never add through a "no edge" cell.</div>`,
        `<p class="y-chinh">🎯 Bài toán đường đi ngắn nhất (shortest path) tìm đường đi có tổng trọng số nhỏ nhất giữa một cặp đỉnh; đồ thị cho bằng ma trận trọng số (weight matrix) W với W(i, i) = 0, W(i, j) = ∞ khi không có cạnh, còn lại là trọng số của cạnh (i, j).</p>
<ul>
<li><strong>Trọng số (weight)</strong> của cạnh = chi phí của nó: số km, số phút, số tiền. <strong>Độ dài đường đi</strong> = tổng các trọng số — không còn là số cạnh như ở BFS.</li>
<li>Slide cho phép <strong>cạnh âm (negative edge) nhưng cấm chu trình âm (negative cycle)</strong>: đi vòng quanh một chu trình có tổng trọng số âm thì mỗi vòng đường đi lại ngắn thêm, nên không tồn tại đường ngắn nhất.</li>
<li>∞ trong code là một hằng số lớn. Ví dụ ở slide 30 dùng 99; <code>Integer.MAX_VALUE</code> là một cái bẫy vì cộng thêm bất cứ số nào cũng bị tràn số (overflow).</li>
</ul>
<pre><code class="language-java">public class WeightMatrix {
    static final int INF = Integer.MAX_VALUE / 2;       // đủ lớn, mà INF + INF vẫn vừa kiểu int

    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D'};
        int n = v.length;
        int[][] w = new int[n][n];
        for (int i = 0; i &lt; n; i++)
            for (int j = 0; j &lt; n; j++)
                w[i][j] = (i == j) ? 0 : INF;           // W(i,i) = 0; không có cạnh = vô cực
        w[0][1] = 4; w[0][2] = 1; w[2][1] = 2; w[1][3] = 5; w[2][3] = 8;   // W(i,j) = trọng số cạnh i -&gt; j
        System.out.println("      A    B    C    D");
        for (int i = 0; i &lt; n; i++) {
            System.out.print(v[i] + " ");
            for (int j = 0; j &lt; n; j++) System.out.print(w[i][j] == INF ? "  INF" : String.format("%5d", w[i][j]));
            System.out.println();
        }
        System.out.println("A-&gt;C-&gt;B = " + (w[0][2] + w[2][1]) + "  is shorter than the direct edge A-&gt;B = " + w[0][1]);

        int big = Integer.MAX_VALUE;
        System.out.println("Integer.MAX_VALUE + 5 = " + (big + 5) + "   &lt;- overflow: 'infinity' turned negative");
        System.out.println("INF + INF = " + (INF + INF) + "   &lt;- MAX_VALUE / 2 stays positive");

        // một đồ thị khác có chu trình âm X -&gt; Y -&gt; X (trọng số 1 và -3)
        for (int laps = 0; laps &lt;= 3; laps++)
            System.out.println("S-&gt;X (5) plus " + laps + " lap(s) of X-&gt;Y-&gt;X: length " + (5 + laps * (1 - 3)));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;D<br>
A &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;1 &nbsp;INF<br>
B &nbsp;&nbsp;INF &nbsp;&nbsp;&nbsp;0 &nbsp;INF &nbsp;&nbsp;&nbsp;5<br>
C &nbsp;&nbsp;INF &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;8<br>
D &nbsp;&nbsp;INF &nbsp;INF &nbsp;INF &nbsp;&nbsp;&nbsp;0<br>
A-&gt;C-&gt;B = 3 &nbsp;is shorter than the direct edge A-&gt;B = 4<br>
Integer.MAX_VALUE + 5 = -2147483644 &nbsp;&nbsp;&lt;- overflow: 'infinity' turned negative<br>
INF + INF = 2147483646 &nbsp;&nbsp;&lt;- MAX_VALUE / 2 stays positive<br>
S-&gt;X (5) plus 0 lap(s) of X-&gt;Y-&gt;X: length 5<br>
S-&gt;X (5) plus 1 lap(s) of X-&gt;Y-&gt;X: length 3<br>
S-&gt;X (5) plus 2 lap(s) of X-&gt;Y-&gt;X: length 1<br>
S-&gt;X (5) plus 3 lap(s) of X-&gt;Y-&gt;X: length -1</div>
<p>Đọc kết quả in ra (output) từ trên xuống: đường ngắn nhất từ A tới B không phải cạnh A→B (4) mà là A→C→B (1 + 2 = 3); <code>Integer.MAX_VALUE + 5</code> quay vòng thành số âm; và mỗi vòng quanh chu trình âm X→Y→X (1 − 3 = −2) làm đường đi ngắn thêm 2, không có điểm dừng.</p>
<p>Hai phiên bản của câu hỏi, hai thuật toán: <strong>Dijkstra</strong> (slide 28–31) — từ một nguồn (source) tới mọi đỉnh, trọng số ≥ 0; <strong>Floyd</strong> (slide 32–34) — giữa mọi cặp đỉnh, cho phép cạnh âm.</p>
<div class="pitfall">Với <code>INF = Integer.MAX_VALUE</code>, phép thử <code>d[u] + w &lt; d[v]</code> đem so một số âm do tràn số và "cải thiện" những khoảng cách không có thật. Hãy lấy <code>Integer.MAX_VALUE / 2</code>, hoặc giá trị canh (sentinel) nhỏ như 99 chỉ khi mọi đường đi thật đều ngắn hơn — và không bao giờ cộng qua một ô "không có cạnh".</div>`],
      [28, "Dijkstra's Algorithm - 1",
        `<p class="y-chinh">🎯 Dijkstra's algorithm applies the greedy method to the single-source problem: a "weighted" BFS from s that grows a cloud of vertices around s, always adding the outside vertex closest to s.</p>
<ul>
<li><strong>Cloud</strong> = the vertices whose shortest distance from s is final. Each iteration adds the vertex outside the cloud with the smallest current distance, then updates the distances of its neighbours.</li>
<li>Vertices enter the cloud in order of their distance from s. It stops when nothing is left outside, or when what is left is not connected to the cloud (unreachable).</li>
<li><strong>Greedy</strong>: each step takes the locally best choice and never revisits it. It is right only because weights are non-negative: any other route to that vertex must leave the cloud through a vertex that is at least as far, and extra edges can only add length.</li>
</ul>
<p>Why "weighted"? BFS minimises the number of edges, which is not the total weight. On the graph of slide 30 (vertices A–F):</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Arrays;

public class FewestVsCheapest {
    static int[][] b = {                                // the matrix of slide 30; 99 = no edge
        {0, 7, 9, 99, 99, 14},
        {7, 0, 10, 15, 99, 99},
        {9, 10, 0, 11, 99, 2},
        {99, 15, 11, 0, 6, 99},
        {99, 99, 99, 6, 0, 9},
        {14, 99, 2, 99, 9, 0}};
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};
    static int n = 6;

    static boolean edge(int i, int j) { return i != j &amp;&amp; b[i][j] &lt; 99; }

    static String path(int[] p, int t) { return p[t] &lt; 0 ? "" + v[t] : path(p, p[t]) + "-" + v[t]; }

    static int cost(int[] p, int t) { return p[t] &lt; 0 ? 0 : cost(p, p[t]) + b[p[t]][t]; }

    public static void main(String[] args) {
        int[] bp = new int[n], dp = new int[n], d = new int[n];
        boolean[] seen = new boolean[n], done = new boolean[n];
        Arrays.fill(bp, -1);
        Arrays.fill(dp, -1);
        ArrayDeque&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();   // BFS: fewest edges, weights ignored
        q.add(0);
        seen[0] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int w = 0; w &lt; n; w++)
                if (edge(u, w) &amp;&amp; !seen[w]) { seen[w] = true; bp[w] = u; q.add(w); }
        }
        Arrays.fill(d, 99);                              // Dijkstra: smallest total weight
        d[0] = 0;
        for (int r = 0; r &lt; n; r++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++) if (!done[i] &amp;&amp; (u &lt; 0 || d[i] &lt; d[u])) u = i;
            done[u] = true;
            for (int w = 0; w &lt; n; w++)
                if (!done[w] &amp;&amp; edge(u, w) &amp;&amp; d[u] + b[u][w] &lt; d[w]) { d[w] = d[u] + b[u][w]; dp[w] = u; }
        }
        System.out.println("to  fewest edges (BFS)  cost | cheapest (Dijkstra)  cost");
        for (int t = 1; t &lt; n; t++)
            System.out.println(String.format("%c   %-18s %5d | %-18s %5d", v[t], path(bp, t), cost(bp, t), path(dp, t), cost(dp, t)));
    }
}</code></pre>
<div class="out">to &nbsp;fewest edges (BFS) &nbsp;cost | cheapest (Dijkstra) &nbsp;cost<br>
B &nbsp;&nbsp;A-B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 | A-B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7<br>
C &nbsp;&nbsp;A-C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 | A-C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9<br>
D &nbsp;&nbsp;A-B-D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 | A-C-D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20<br>
E &nbsp;&nbsp;A-F-E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 | A-C-F-E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20<br>
F &nbsp;&nbsp;A-F &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 | A-C-F &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11</div>
<p>To reach E, BFS takes the 2-edge path A–F–E (14 + 9 = 23); Dijkstra finds A–C–F–E, one edge longer but cheaper (9 + 2 + 9 = 20). Weighted shortest paths are exactly what a map app computes when you ask for a route from A to B (class question HCM_CQ10.3).</p>
<p class="meo">🧠 <strong>Remember:</strong> Dijkstra = BFS whose queue is ordered by distance instead of by arrival time.</p>`,
        `<p class="y-chinh">🎯 Thuật toán Dijkstra áp dụng phương pháp tham lam (greedy) cho bài toán một nguồn (single-source): một BFS "có trọng số" từ s, nuôi lớn một "đám mây" (cloud) đỉnh quanh s, mỗi lần thêm đỉnh ở ngoài gần s nhất.</p>
<ul>
<li><strong>Đám mây (cloud)</strong> = các đỉnh đã chốt khoảng cách ngắn nhất từ s. Mỗi vòng lặp thêm đỉnh ngoài đám mây có khoảng cách hiện tại nhỏ nhất, rồi cập nhật khoảng cách các láng giềng của nó.</li>
<li>Các đỉnh vào đám mây theo thứ tự khoảng cách tăng dần tính từ s. Thuật toán dừng khi bên ngoài hết đỉnh, hoặc các đỉnh còn lại không nối với đám mây (không tới được).</li>
<li><strong>Tham lam (greedy)</strong>: mỗi bước chọn cái tốt nhất trước mắt và không bao giờ xét lại. Điều đó đúng chỉ vì trọng số không âm: mọi đường khác tới đỉnh đó phải rời đám mây qua một đỉnh xa ít nhất bằng, và đi thêm cạnh chỉ làm dài thêm.</li>
</ul>
<p>Vì sao gọi là BFS "có trọng số"? BFS làm nhỏ nhất số cạnh, mà số cạnh không phải tổng trọng số. Trên đồ thị của slide 30 (các đỉnh A–F):</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Arrays;

public class FewestVsCheapest {
    static int[][] b = {                                // ma trận của slide 30; 99 = không có cạnh
        {0, 7, 9, 99, 99, 14},
        {7, 0, 10, 15, 99, 99},
        {9, 10, 0, 11, 99, 2},
        {99, 15, 11, 0, 6, 99},
        {99, 99, 99, 6, 0, 9},
        {14, 99, 2, 99, 9, 0}};
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};
    static int n = 6;

    static boolean edge(int i, int j) { return i != j &amp;&amp; b[i][j] &lt; 99; }

    static String path(int[] p, int t) { return p[t] &lt; 0 ? "" + v[t] : path(p, p[t]) + "-" + v[t]; }

    static int cost(int[] p, int t) { return p[t] &lt; 0 ? 0 : cost(p, p[t]) + b[p[t]][t]; }

    public static void main(String[] args) {
        int[] bp = new int[n], dp = new int[n], d = new int[n];
        boolean[] seen = new boolean[n], done = new boolean[n];
        Arrays.fill(bp, -1);
        Arrays.fill(dp, -1);
        ArrayDeque&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();   // BFS: ít cạnh nhất, bỏ qua trọng số
        q.add(0);
        seen[0] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int w = 0; w &lt; n; w++)
                if (edge(u, w) &amp;&amp; !seen[w]) { seen[w] = true; bp[w] = u; q.add(w); }
        }
        Arrays.fill(d, 99);                              // Dijkstra: tổng trọng số nhỏ nhất
        d[0] = 0;
        for (int r = 0; r &lt; n; r++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++) if (!done[i] &amp;&amp; (u &lt; 0 || d[i] &lt; d[u])) u = i;
            done[u] = true;
            for (int w = 0; w &lt; n; w++)
                if (!done[w] &amp;&amp; edge(u, w) &amp;&amp; d[u] + b[u][w] &lt; d[w]) { d[w] = d[u] + b[u][w]; dp[w] = u; }
        }
        System.out.println("to  fewest edges (BFS)  cost | cheapest (Dijkstra)  cost");
        for (int t = 1; t &lt; n; t++)
            System.out.println(String.format("%c   %-18s %5d | %-18s %5d", v[t], path(bp, t), cost(bp, t), path(dp, t), cost(dp, t)));
    }
}</code></pre>
<div class="out">to &nbsp;fewest edges (BFS) &nbsp;cost | cheapest (Dijkstra) &nbsp;cost<br>
B &nbsp;&nbsp;A-B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 | A-B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7<br>
C &nbsp;&nbsp;A-C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 | A-C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9<br>
D &nbsp;&nbsp;A-B-D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 | A-C-D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20<br>
E &nbsp;&nbsp;A-F-E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;23 | A-C-F-E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20<br>
F &nbsp;&nbsp;A-F &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 | A-C-F &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11</div>
<p>Để tới E, BFS chọn đường 2 cạnh A–F–E (14 + 9 = 23); Dijkstra tìm ra A–C–F–E, dài hơn một cạnh nhưng rẻ hơn (9 + 2 + 9 = 20). Đường đi ngắn nhất có trọng số chính là thứ app bản đồ tính khi bạn tìm đường từ A tới B (câu hỏi trên lớp HCM_CQ10.3).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Dijkstra = BFS mà hàng đợi xếp theo khoảng cách thay vì theo thứ tự đến.</p>`],
      [29, "Dijkstra's Algorithm - 2",
        `<p class="y-chinh">🎯 The pseudocode keeps currDist(v), the best distance found so far; toBeChecked, the vertices not final yet; and predecessor(v), the vertex before v on the best path — which is how the path itself is rebuilt.</p>
<ol>
<li>currDist(first) = 0 and currDist(v) = ∞ for every v ≠ first (the slide writes "v # first"); toBeChecked = V; checked = empty.</li>
<li>While toBeChecked is not empty: u = the vertex of toBeChecked with the minimum currDist; move u from toBeChecked to checked.</li>
<li>For every v adjacent to u and still in toBeChecked: if currDist(v) &gt; currDist(u) + weight(edge(uv)), set currDist(v) to that sum and predecessor(v) = u — this update is called <em>relaxing</em> the edge.</li>
</ol>
<p>The program follows the pseudocode line by line, with the same names, on the lesson's small digraph A→B 1, A→C 4, B→C 2, B→D 6, C→D 3:</p>
<pre><code class="language-java">public class DijkstraCode {
    static final int INF = 1000000;

    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D'};
        int n = 4, first = 0;
        int[][] w = new int[n][n];                       // 0 = no edge (all real weights are &gt; 0 here)
        w[0][1] = 1; w[0][2] = 4; w[1][2] = 2; w[1][3] = 6; w[2][3] = 3;   // a digraph: w[i][j] for i -&gt; j
        int[] currDist = new int[n], predecessor = new int[n];
        boolean[] toBeChecked = new boolean[n];
        for (int x = 0; x &lt; n; x++) {                    // currDist(v) = infinity; toBeChecked = V
            currDist[x] = INF;
            predecessor[x] = -1;
            toBeChecked[x] = true;
        }
        currDist[first] = 0;
        for (int round = 1; round &lt;= n; round++) {       // while toBeChecked is not empty
            int u = -1;
            for (int x = 0; x &lt; n; x++)                  // u = the vertex of toBeChecked with min currDist
                if (toBeChecked[x] &amp;&amp; (u &lt; 0 || currDist[x] &lt; currDist[u])) u = x;
            toBeChecked[u] = false;                      // remove u from toBeChecked, add it to checked
            System.out.print("round " + round + ": u = " + v[u] + " (" + currDist[u] + ")");
            for (int x = 0; x &lt; n; x++)                  // v adjacent to u and still in toBeChecked
                if (w[u][x] &gt; 0 &amp;&amp; toBeChecked[x] &amp;&amp; currDist[x] &gt; currDist[u] + w[u][x]) {
                    System.out.print(", " + v[x] + " " + (currDist[x] == INF ? "inf" : "" + currDist[x]) + " -&gt; " + (currDist[u] + w[u][x]));
                    currDist[x] = currDist[u] + w[u][x];
                    predecessor[x] = u;
                }
            System.out.println();
        }
        for (int x = 0; x &lt; n; x++) {
            String p = "" + v[x];
            for (int y = predecessor[x]; y &gt;= 0; y = predecessor[y]) p = v[y] + " " + p;   // walk back through predecessor
            System.out.println(v[x] + ": currDist " + currDist[x] + ", path " + p);
        }
    }
}</code></pre>
<div class="out">round 1: u = A (0), B inf -&gt; 1, C inf -&gt; 4<br>
round 2: u = B (1), C 4 -&gt; 3, D inf -&gt; 7<br>
round 3: u = C (3), D 7 -&gt; 6<br>
round 4: u = D (6)<br>
A: currDist 0, path A<br>
B: currDist 1, path A B<br>
C: currDist 3, path A B C<br>
D: currDist 6, path A B C D</div>
<p>Round 2: C already had 4 (A→C), but through B it costs 1 + 2 = 3 — an improvement. Round 3 improves D from 7 to 6 the same way. The path to D is read backwards through predecessor: D ← C ← B ← A.</p>
<div class="pitfall">The header says "non-negative weighted simple digraph" (typed "non-gegative"): non-negative is a requirement, not a detail (slide 31). And keep <code>predecessor</code>: a PE usually asks for the path, not only its length.</div>`,
        `<p class="y-chinh">🎯 Mã giả giữ currDist(v) — khoảng cách tốt nhất tìm được tới lúc này; toBeChecked — các đỉnh chưa chốt; và predecessor(v) — đỉnh đứng ngay trước v trên đường tốt nhất, nhờ nó mà dựng lại được chính đường đi.</p>
<ol>
<li>currDist(first) = 0 và currDist(v) = ∞ với mọi v ≠ first (slide viết "v # first"); toBeChecked = V; checked = rỗng.</li>
<li>Khi toBeChecked chưa rỗng: u = đỉnh của toBeChecked có currDist nhỏ nhất; chuyển u từ toBeChecked sang checked.</li>
<li>Với mọi v kề u và còn trong toBeChecked: nếu currDist(v) &gt; currDist(u) + weight(edge(uv)) thì gán currDist(v) bằng tổng đó và predecessor(v) = u — bước cập nhật này gọi là <em>nới lỏng (relax)</em> cạnh.</li>
</ol>
<p>Chương trình đi theo mã giả từng dòng, giữ nguyên tên biến, trên đồ thị có hướng nhỏ của bài A→B 1, A→C 4, B→C 2, B→D 6, C→D 3:</p>
<pre><code class="language-java">public class DijkstraCode {
    static final int INF = 1000000;

    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D'};
        int n = 4, first = 0;
        int[][] w = new int[n][n];                       // 0 = không có cạnh (mọi trọng số thật ở đây đều &gt; 0)
        w[0][1] = 1; w[0][2] = 4; w[1][2] = 2; w[1][3] = 6; w[2][3] = 3;   // đồ thị có hướng: w[i][j] cho i -&gt; j
        int[] currDist = new int[n], predecessor = new int[n];
        boolean[] toBeChecked = new boolean[n];
        for (int x = 0; x &lt; n; x++) {                    // currDist(v) = vô cực; toBeChecked = V
            currDist[x] = INF;
            predecessor[x] = -1;
            toBeChecked[x] = true;
        }
        currDist[first] = 0;
        for (int round = 1; round &lt;= n; round++) {       // trong khi toBeChecked còn đỉnh
            int u = -1;
            for (int x = 0; x &lt; n; x++)                  // u = đỉnh của toBeChecked có currDist nhỏ nhất
                if (toBeChecked[x] &amp;&amp; (u &lt; 0 || currDist[x] &lt; currDist[u])) u = x;
            toBeChecked[u] = false;                      // gỡ u khỏi toBeChecked, cho vào checked
            System.out.print("round " + round + ": u = " + v[u] + " (" + currDist[u] + ")");
            for (int x = 0; x &lt; n; x++)                  // v kề u và còn trong toBeChecked
                if (w[u][x] &gt; 0 &amp;&amp; toBeChecked[x] &amp;&amp; currDist[x] &gt; currDist[u] + w[u][x]) {
                    System.out.print(", " + v[x] + " " + (currDist[x] == INF ? "inf" : "" + currDist[x]) + " -&gt; " + (currDist[u] + w[u][x]));
                    currDist[x] = currDist[u] + w[u][x];
                    predecessor[x] = u;
                }
            System.out.println();
        }
        for (int x = 0; x &lt; n; x++) {
            String p = "" + v[x];
            for (int y = predecessor[x]; y &gt;= 0; y = predecessor[y]) p = v[y] + " " + p;   // lần ngược theo predecessor
            System.out.println(v[x] + ": currDist " + currDist[x] + ", path " + p);
        }
    }
}</code></pre>
<div class="out">round 1: u = A (0), B inf -&gt; 1, C inf -&gt; 4<br>
round 2: u = B (1), C 4 -&gt; 3, D inf -&gt; 7<br>
round 3: u = C (3), D 7 -&gt; 6<br>
round 4: u = D (6)<br>
A: currDist 0, path A<br>
B: currDist 1, path A B<br>
C: currDist 3, path A B C<br>
D: currDist 6, path A B C D</div>
<p>Vòng 2: C đang có 4 (A→C), nhưng đi qua B chỉ tốn 1 + 2 = 3 — được cải thiện. Vòng 3 cải thiện D từ 7 xuống 6 theo cách tương tự. Đường tới D đọc ngược theo predecessor: D ← C ← B ← A.</p>
<div class="pitfall">Dòng đầu mã giả ghi "non-negative weighted simple digraph" — đơn đồ thị có hướng, trọng số không âm (slide gõ nhầm "non-gegative") — không âm là điều kiện bắt buộc, không phải chi tiết phụ (slide 31). Và nhớ giữ <code>predecessor</code>: đề PE thường hỏi đường đi, không chỉ độ dài.</div>`],
      [30, "Dijkstra's Algorithm example - 1",
        `<p class="y-chinh">🎯 The slide's example: six vertices A(1)…F(6) given as the weight matrix b, with 99 for "no edge"; Dijkstra keeps S (vertices whose shortest paths are already determined), V − S (the rest), d (best estimates) and p (predecessors).</p>
<p>The program runs Dijkstra from A on exactly the slide's matrix (A(1) is index 0; a tie goes to the smaller index):</p>
<pre><code class="language-java">public class DijkstraExample {
    public static void main(String[] args) {
        int [][] b = {                                   // the slide's matrix; 99 = no edge (infinity)
            {  0,   7,   9, 99, 99, 14},
            {  7,   0, 10, 15, 99, 99},
            {  9, 10,   0, 11, 99,   2},
            {99, 15, 11,   0,   6, 99},
            {99, 99, 99,   6,   0,   9},
            {14, 99,   2, 99,   9,   0}
        };
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};       // A(1)..F(6) on the slide = index 0..5 here
        int n = 6, s = 0;
        int[] d = new int[n], p = new int[n];
        boolean[] inS = new boolean[n];                  // S = vertices whose shortest path is known
        for (int i = 0; i &lt; n; i++) { d[i] = 99; p[i] = -1; }
        d[s] = 0;
        String order = "";
        System.out.println("round  pick   d:  A  B  C  D  E  F   S");
        for (int r = 1; r &lt;= n; r++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++)                  // closest vertex outside S; a tie goes to the smaller index
                if (!inS[i] &amp;&amp; (u &lt; 0 || d[i] &lt; d[u])) u = i;
            inS[u] = true;
            order += v[u];
            for (int x = 0; x &lt; n; x++)                  // relax the edges of u
                if (!inS[x] &amp;&amp; b[u][x] &lt; 99 &amp;&amp; d[u] + b[u][x] &lt; d[x]) {
                    d[x] = d[u] + b[u][x];
                    p[x] = u;
                }
            String row = String.format("%4d   %c(%2d)    ", r, v[u], d[u]);
            for (int x = 0; x &lt; n; x++) row += String.format("%3d", d[x]);
            System.out.println(row + "   " + order);
        }
        for (int x = 0; x &lt; n; x++) {
            String path = "" + v[x];
            for (int y = p[x]; y &gt;= 0; y = p[y]) path = v[y] + "-" + path;
            System.out.println(v[x] + ": d = " + d[x] + ", p = " + (p[x] &lt; 0 ? "-" : "" + v[p[x]]) + ", path " + path);
        }
    }
}</code></pre>
<div class="out">round &nbsp;pick &nbsp;&nbsp;d: &nbsp;A &nbsp;B &nbsp;C &nbsp;D &nbsp;E &nbsp;F &nbsp;&nbsp;S<br>
&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;A( 0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 99 99 14 &nbsp;&nbsp;A<br>
&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;B( 7) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 22 99 14 &nbsp;&nbsp;AB<br>
&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;C( 9) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 20 99 11 &nbsp;&nbsp;ABC<br>
&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;F(11) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 20 20 11 &nbsp;&nbsp;ABCF<br>
&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;D(20) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 20 20 11 &nbsp;&nbsp;ABCFD<br>
&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;E(20) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 20 20 11 &nbsp;&nbsp;ABCFDE<br>
A: d = 0, p = -, path A<br>
B: d = 7, p = A, path A-B<br>
C: d = 9, p = A, path A-C<br>
D: d = 20, p = C, path A-C-D<br>
E: d = 20, p = F, path A-C-F-E<br>
F: d = 11, p = C, path A-C-F</div>
<table>
<thead><tr><th>Round</th><th>Vertex moved into S</th><th>What changed when its edges were relaxed</th></tr></thead>
<tbody>
<tr><td>1</td><td>A (0)</td><td>B = 7, C = 9, F = 14</td></tr>
<tr><td>2</td><td>B (7)</td><td>D = 7 + 15 = 22; C stays 9 (7 + 10 = 17 is worse)</td></tr>
<tr><td>3</td><td>C (9)</td><td>D: 22 → 20 (9 + 11); F: 14 → 11 (9 + 2)</td></tr>
<tr><td>4</td><td>F (11)</td><td>E = 11 + 9 = 20</td></tr>
<tr><td>5</td><td>D (20)</td><td>E stays 20 (20 + 6 = 26 is worse); D and E tie at 20, D has the smaller index</td></tr>
<tr><td>6</td><td>E (20)</td><td>nothing left outside S</td></tr>
</tbody>
</table>
<ul>
<li>Result: A 0, B 7, C 9, D 20, E 20, F 11; predecessors B←A, C←A, F←C, D←C, E←F.</li>
<li>Path to E: follow p backwards E ← F ← C ← A, then reverse: A → C → F → E = 9 + 2 + 9 = 20.</li>
<li>S grows in the order A, B, C, F, D, E — by increasing distance, the "cloud" of slide 28.</li>
</ul>
<div class="pitfall">99 means ∞ here only because every real distance is below 99. In your own code never relax through a "no edge" cell (test <code>b[u][x] &lt; 99</code>), and pick ∞ larger than any possible path.</div>`,
        `<p class="y-chinh">🎯 Ví dụ của slide: sáu đỉnh A(1)…F(6) cho bằng ma trận trọng số b, 99 nghĩa là "không có cạnh"; Dijkstra giữ S (các đỉnh đã xác định đường đi ngắn nhất), V − S (phần còn lại), d (ước lượng tốt nhất — best estimate) và p (đỉnh đứng trước — predecessor).</p>
<p>Chương trình chạy Dijkstra từ A trên đúng ma trận của slide (A(1) là chỉ số 0; hoà thì lấy chỉ số nhỏ hơn):</p>
<pre><code class="language-java">public class DijkstraExample {
    public static void main(String[] args) {
        int [][] b = {                                   // ma trận của slide; 99 = không có cạnh (vô cực)
            {  0,   7,   9, 99, 99, 14},
            {  7,   0, 10, 15, 99, 99},
            {  9, 10,   0, 11, 99,   2},
            {99, 15, 11,   0,   6, 99},
            {99, 99, 99,   6,   0,   9},
            {14, 99,   2, 99,   9,   0}
        };
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};       // A(1)..F(6) trên slide = chỉ số 0..5 ở đây
        int n = 6, s = 0;
        int[] d = new int[n], p = new int[n];
        boolean[] inS = new boolean[n];                  // S = các đỉnh đã biết đường đi ngắn nhất
        for (int i = 0; i &lt; n; i++) { d[i] = 99; p[i] = -1; }
        d[s] = 0;
        String order = "";
        System.out.println("round  pick   d:  A  B  C  D  E  F   S");
        for (int r = 1; r &lt;= n; r++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++)                  // đỉnh ngoài S gần nhất; hoà thì lấy chỉ số nhỏ hơn
                if (!inS[i] &amp;&amp; (u &lt; 0 || d[i] &lt; d[u])) u = i;
            inS[u] = true;
            order += v[u];
            for (int x = 0; x &lt; n; x++)                  // nới lỏng các cạnh của u
                if (!inS[x] &amp;&amp; b[u][x] &lt; 99 &amp;&amp; d[u] + b[u][x] &lt; d[x]) {
                    d[x] = d[u] + b[u][x];
                    p[x] = u;
                }
            String row = String.format("%4d   %c(%2d)    ", r, v[u], d[u]);
            for (int x = 0; x &lt; n; x++) row += String.format("%3d", d[x]);
            System.out.println(row + "   " + order);
        }
        for (int x = 0; x &lt; n; x++) {
            String path = "" + v[x];
            for (int y = p[x]; y &gt;= 0; y = p[y]) path = v[y] + "-" + path;
            System.out.println(v[x] + ": d = " + d[x] + ", p = " + (p[x] &lt; 0 ? "-" : "" + v[p[x]]) + ", path " + path);
        }
    }
}</code></pre>
<div class="out">round &nbsp;pick &nbsp;&nbsp;d: &nbsp;A &nbsp;B &nbsp;C &nbsp;D &nbsp;E &nbsp;F &nbsp;&nbsp;S<br>
&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;A( 0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 99 99 14 &nbsp;&nbsp;A<br>
&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;B( 7) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 22 99 14 &nbsp;&nbsp;AB<br>
&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;C( 9) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 20 99 11 &nbsp;&nbsp;ABC<br>
&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;F(11) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 20 20 11 &nbsp;&nbsp;ABCF<br>
&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;D(20) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 20 20 11 &nbsp;&nbsp;ABCFD<br>
&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;E(20) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;7 &nbsp;9 20 20 11 &nbsp;&nbsp;ABCFDE<br>
A: d = 0, p = -, path A<br>
B: d = 7, p = A, path A-B<br>
C: d = 9, p = A, path A-C<br>
D: d = 20, p = C, path A-C-D<br>
E: d = 20, p = F, path A-C-F-E<br>
F: d = 11, p = C, path A-C-F</div>
<table>
<thead><tr><th>Vòng</th><th>Đỉnh được đưa vào S</th><th>Thay đổi khi nới lỏng các cạnh của nó</th></tr></thead>
<tbody>
<tr><td>1</td><td>A (0)</td><td>B = 7, C = 9, F = 14</td></tr>
<tr><td>2</td><td>B (7)</td><td>D = 7 + 15 = 22; C giữ 9 (7 + 10 = 17 tệ hơn)</td></tr>
<tr><td>3</td><td>C (9)</td><td>D: 22 → 20 (9 + 11); F: 14 → 11 (9 + 2)</td></tr>
<tr><td>4</td><td>F (11)</td><td>E = 11 + 9 = 20</td></tr>
<tr><td>5</td><td>D (20)</td><td>E giữ 20 (20 + 6 = 26 tệ hơn); D và E hoà ở 20, D có chỉ số nhỏ hơn</td></tr>
<tr><td>6</td><td>E (20)</td><td>bên ngoài S không còn đỉnh nào</td></tr>
</tbody>
</table>
<ul>
<li>Kết quả: A 0, B 7, C 9, D 20, E 20, F 11; đỉnh đứng trước: B←A, C←A, F←C, D←C, E←F.</li>
<li>Đường tới E: lần ngược theo p E ← F ← C ← A, rồi đảo lại: A → C → F → E = 9 + 2 + 9 = 20.</li>
<li>S lớn dần theo thứ tự A, B, C, F, D, E — khoảng cách tăng dần, đúng "đám mây" (cloud) của slide 28.</li>
</ul>
<div class="pitfall">99 được coi là ∞ ở đây chỉ vì mọi khoảng cách thật đều nhỏ hơn 99. Trong code của bạn, đừng bao giờ nới lỏng qua ô "không có cạnh" (kiểm <code>b[u][x] &lt; 99</code>), và chọn ∞ lớn hơn mọi đường đi có thể có.</div>`],
      [31, "Dijkstra's Algorithm example - 2",
        `<p class="y-chinh">🎯 Dijkstra with an array costs O(|V|²), and it is not general enough: it may fail when some weights are negative.</p>
<p>The title marks this slide as part 2 of the example of slide 30, drawn as pictures — compare them with the round table above. Its text makes two points:</p>
<p class="nhan">Why O(|V|²)</p>
<ul>
<li>n rounds; each round scans all n vertices to find the minimum, then u's row (n cells) to relax → about 2n² steps = O(n²).</li>
<li>With adjacency lists and a priority queue (a min-heap), the minimum costs O(log n): O((n + m) log n) in total, faster on sparse graphs (Goodrich §14.6.2 — beyond the slides).</li>
</ul>
<p class="nhan">Why negative weights break it — the lesson's counterexample A→B 2, A→C 3, C→B −2</p>
<pre><code class="language-java">public class DijkstraNegative {
    static final int INF = 1000;

    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C'};
        int n = 3;
        int[][] w = {{0, 2, 3}, {INF, 0, INF}, {INF, -2, 0}};   // A-&gt;B 2, A-&gt;C 3, C-&gt;B -2
        int[] d = {0, INF, INF};
        boolean[] done = new boolean[n];
        for (int r = 1; r &lt;= n; r++) {                   // the slide's Dijkstra, from A
            int u = -1;
            for (int i = 0; i &lt; n; i++) if (!done[i] &amp;&amp; (u &lt; 0 || d[i] &lt; d[u])) u = i;
            done[u] = true;                              // u is final from now on
            System.out.print("round " + r + ": take " + v[u] + " (" + d[u] + ")");
            for (int x = 0; x &lt; n; x++) {
                if (x == u || w[u][x] == INF) continue;
                if (done[x]) {
                    if (d[u] + w[u][x] &lt; d[x])
                        System.out.print(", edge " + v[u] + "-&gt;" + v[x] + " (" + w[u][x] + ") would give " + (d[u] + w[u][x]) + " but " + v[x] + " is already final");
                } else if (d[u] + w[u][x] &lt; d[x]) {
                    System.out.print(", " + v[x] + " " + (d[x] == INF ? "inf" : "" + d[x]) + " -&gt; " + (d[u] + w[u][x]));
                    d[x] = d[u] + w[u][x];
                }
            }
            System.out.println();
        }
        System.out.println("Dijkstra: A " + d[0] + ", B " + d[1] + ", C " + d[2]);
        int[][] f = new int[n][n];                       // Floyd (slide 32) on the same graph
        for (int i = 0; i &lt; n; i++) f[i] = w[i].clone();
        for (int k = 0; k &lt; n; k++)
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++)
                    if (f[i][k] != INF &amp;&amp; f[k][j] != INF &amp;&amp; f[i][k] + f[k][j] &lt; f[i][j]) f[i][j] = f[i][k] + f[k][j];
        System.out.println("Floyd:    A " + f[0][0] + ", B " + f[0][1] + ", C " + f[0][2] + "   (A-&gt;C-&gt;B = 3 + (-2) = 1)");
    }
}</code></pre>
<div class="out">round 1: take A (0), B inf -&gt; 2, C inf -&gt; 3<br>
round 2: take B (2)<br>
round 3: take C (3), edge C-&gt;B (-2) would give 1 but B is already final<br>
Dijkstra: A 0, B 2, C 3<br>
Floyd: &nbsp;&nbsp;&nbsp;A 0, B 1, C 3 &nbsp;&nbsp;(A-&gt;C-&gt;B = 3 + (-2) = 1)</div>
<p>B is made final at 2 in round 2; only in round 3 is C taken, and its edge C→B (−2) would give 3 − 2 = 1 — too late. The greedy rule "the closest outside vertex is final" assumed that no later edge can shorten a path. Floyd (slide 32) makes no such assumption and finds 1.</p>
<div class="pitfall">"Add a constant to every weight so they become positive, then run Dijkstra" does <em>not</em> repair it: a path with more edges receives the constant more times. Here +2 on every edge makes A→B = 4 but A→C→B = 5 + 0 = 5, so the true shortest path is lost.</div>`,
        `<p class="y-chinh">🎯 Dijkstra cài bằng mảng tốn O(|V|²), và nó chưa đủ tổng quát: có thể cho kết quả sai khi đồ thị có trọng số âm.</p>
<p>Tiêu đề cho biết đây là phần 2 của ví dụ ở slide 30, vẽ bằng hình — hãy đối chiếu với bảng từng vòng ở trên. Phần chữ của slide nêu hai ý:</p>
<p class="nhan">Vì sao O(|V|²)</p>
<ul>
<li>n vòng; mỗi vòng quét n đỉnh để tìm đỉnh nhỏ nhất, rồi quét hàng của u (n ô) để nới lỏng → khoảng 2n² bước = O(n²).</li>
<li>Với danh sách kề và hàng đợi ưu tiên (priority queue — một min-heap), tìm đỉnh nhỏ nhất chỉ tốn O(log n): tổng O((n + m) log n), nhanh hơn trên đồ thị thưa (Goodrich §14.6.2 — ngoài slide).</li>
</ul>
<p class="nhan">Vì sao trọng số âm làm nó sai — phản ví dụ (counterexample) của bài A→B 2, A→C 3, C→B −2</p>
<pre><code class="language-java">public class DijkstraNegative {
    static final int INF = 1000;

    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C'};
        int n = 3;
        int[][] w = {{0, 2, 3}, {INF, 0, INF}, {INF, -2, 0}};   // A-&gt;B 2, A-&gt;C 3, C-&gt;B -2
        int[] d = {0, INF, INF};
        boolean[] done = new boolean[n];
        for (int r = 1; r &lt;= n; r++) {                   // Dijkstra của slide, từ A
            int u = -1;
            for (int i = 0; i &lt; n; i++) if (!done[i] &amp;&amp; (u &lt; 0 || d[i] &lt; d[u])) u = i;
            done[u] = true;                              // từ đây u được chốt
            System.out.print("round " + r + ": take " + v[u] + " (" + d[u] + ")");
            for (int x = 0; x &lt; n; x++) {
                if (x == u || w[u][x] == INF) continue;
                if (done[x]) {
                    if (d[u] + w[u][x] &lt; d[x])
                        System.out.print(", edge " + v[u] + "-&gt;" + v[x] + " (" + w[u][x] + ") would give " + (d[u] + w[u][x]) + " but " + v[x] + " is already final");
                } else if (d[u] + w[u][x] &lt; d[x]) {
                    System.out.print(", " + v[x] + " " + (d[x] == INF ? "inf" : "" + d[x]) + " -&gt; " + (d[u] + w[u][x]));
                    d[x] = d[u] + w[u][x];
                }
            }
            System.out.println();
        }
        System.out.println("Dijkstra: A " + d[0] + ", B " + d[1] + ", C " + d[2]);
        int[][] f = new int[n][n];                       // Floyd (slide 32) trên cùng đồ thị
        for (int i = 0; i &lt; n; i++) f[i] = w[i].clone();
        for (int k = 0; k &lt; n; k++)
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++)
                    if (f[i][k] != INF &amp;&amp; f[k][j] != INF &amp;&amp; f[i][k] + f[k][j] &lt; f[i][j]) f[i][j] = f[i][k] + f[k][j];
        System.out.println("Floyd:    A " + f[0][0] + ", B " + f[0][1] + ", C " + f[0][2] + "   (A-&gt;C-&gt;B = 3 + (-2) = 1)");
    }
}</code></pre>
<div class="out">round 1: take A (0), B inf -&gt; 2, C inf -&gt; 3<br>
round 2: take B (2)<br>
round 3: take C (3), edge C-&gt;B (-2) would give 1 but B is already final<br>
Dijkstra: A 0, B 2, C 3<br>
Floyd: &nbsp;&nbsp;&nbsp;A 0, B 1, C 3 &nbsp;&nbsp;(A-&gt;C-&gt;B = 3 + (-2) = 1)</div>
<p>B bị chốt ở 2 ngay vòng 2; tới vòng 3 mới lấy C, và cạnh C→B (−2) lẽ ra cho 3 − 2 = 1 — nhưng đã quá muộn. Luật tham lam "đỉnh ngoài gần nhất thì chốt luôn" ngầm giả định không cạnh nào về sau làm đường đi ngắn lại. Floyd (slide 32) không giả định như vậy và tìm ra 1.</p>
<div class="pitfall">"Cộng một hằng số vào mọi trọng số cho hết âm rồi chạy Dijkstra" <em>không</em> sửa được: đường nhiều cạnh bị cộng hằng số nhiều lần hơn. Ở đây +2 cho mọi cạnh làm A→B = 4 còn A→C→B = 5 + 0 = 5, thế là mất luôn đường ngắn nhất thật.</div>`],
      [32, 'Floyd Algorithm',
        `<p class="y-chinh">🎯 Floyd's algorithm finds the shortest path between every pair of vertices at once with three nested loops over n — O(|V|³); negative edges are allowed, negative cycles are not.</p>
<ul>
<li>D starts as the weight matrix W; P starts all 0.</li>
<li>For k = 1…n (k = the vertex allowed as a stop), for every i and j: if D[i, j] &gt; D[i, k] + D[k, j], the route i → k → j is shorter, so D[i, j] takes that sum.</li>
<li>After round k, D[i, j] is the shortest length using stops among vertices 1…k only; after k = n no restriction is left. k must be the <strong>outermost</strong> loop.</li>
<li><strong>Big-O</strong>: n × n × n comparisons (64 for n = 4), whatever the number of edges; memory n² for D and P.</li>
</ul>
<p>The program runs Floyd twice on the lesson's 4-vertex digraph of slide 33 — once with line 8 as printed, once corrected:</p>
<pre><code class="language-java">public class FloydP {
    static final int INF = 1000;                         // "no edge"; never added (see the test below)
    static int n = 4, count;
    static int[][] W = {                                 // the lesson's digraph A..D
        {0, 3, 8, INF},
        {INF, 0, INF, 1},
        {INF, 5, 0, INF},
        {2, INF, -5, 0}};

    static String show(int[][] m) {
        String s = "";
        for (int i = 0; i &lt; n; i++) {
            s += (i &gt; 0 ? " /" : "");
            for (int j = 0; j &lt; n; j++) s += " " + m[i][j];
        }
        return s;
    }

    static int[][] floyd(boolean asPrinted, int[][] P) {
        int[][] D = new int[n][n];
        for (int i = 0; i &lt; n; i++) D[i] = W[i].clone();   // 1. D = W
        count = 0;                                       // 2. P = 0 (a new int[][] is all 0)
        for (int k = 0; k &lt; n; k++)                      // 3. for k
            for (int i = 0; i &lt; n; i++)                  // 4. for i
                for (int j = 0; j &lt; n; j++) {            // 5. for j
                    count++;
                    if (D[i][k] == INF || D[k][j] == INF) continue;
                    if (D[i][j] &gt; D[i][k] + D[k][j]) {   // 6.
                        D[i][j] = D[i][k] + D[k][j];     // 7.
                        P[i][j] = asPrinted ? P[k][j] : k + 1;   // 8. as printed / fixed (vertex number 1..n)
                    }
                }
        return D;
    }

    public static void main(String[] args) {
        int[][] P1 = new int[n][n], P2 = new int[n][n];
        int[][] D1 = floyd(true, P1);
        System.out.println("line 8 as printed, P[i][j] = P[k][j]:  P =" + show(P1));
        int[][] D2 = floyd(false, P2);
        System.out.println("line 8 fixed,      P[i][j] = k:        P =" + show(P2));
        System.out.println("D, identical in both runs:  D =" + show(D2) + "   same? " + show(D1).equals(show(D2)));
        System.out.println("comparisons: " + count + " = n^3 for n = " + n);
    }
}</code></pre>
<div class="out">line 8 as printed, P[i][j] = P[k][j]: &nbsp;P = 0 0 0 0 / 0 0 0 0 / 0 0 0 0 / 0 0 0 0<br>
line 8 fixed, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;P[i][j] = k: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;P = 0 0 4 2 / 4 0 4 0 / 4 0 0 2 / 0 3 0 0<br>
D, identical in both runs: &nbsp;D = 0 3 -1 4 / 3 0 -4 1 / 8 5 0 6 / 2 0 -5 0 &nbsp;&nbsp;same? true<br>
comparisons: 64 = n^3 for n = 4</div>
<p>In the second line P holds vertex numbers counted from 1, as the slide's loops do (1 = A … 4 = D): P[A][C] = 4 means "go through D". D is identical in both runs — only the path information is lost.</p>
<div class="pitfall"><strong>A bug on the slide:</strong> line 2 sets P = 0 and line 8 reads <code>P[i, j] = P[k, j]</code>. Copying from an all-zero P can only give 0, so P stays all 0 (first line above) and no path can ever be rebuilt; D itself is not affected. With P starting at 0 the standard line is <strong><code>P[i, j] = k</code></strong> — the stop vertex, 0 meaning "direct edge" — which fits slide 34's "non zero P values". <code>P[i, j] = P[k, j]</code> belongs to the other convention, where P[i, j] starts as i for each edge (i, j) and means "the vertex just before j".</div>`,
        `<p class="y-chinh">🎯 Thuật toán Floyd tìm đường đi ngắn nhất giữa mọi cặp đỉnh cùng lúc bằng ba vòng lặp lồng nhau theo n — O(|V|³); cho phép cạnh âm, cấm chu trình âm.</p>
<ul>
<li>D khởi tạo bằng ma trận trọng số W; P khởi tạo toàn 0.</li>
<li>Với k = 1…n (k = đỉnh được phép ghé qua), với mọi i và j: nếu D[i, j] &gt; D[i, k] + D[k, j] thì lộ trình i → k → j ngắn hơn, nên D[i, j] nhận tổng đó.</li>
<li>Sau vòng k, D[i, j] là độ dài ngắn nhất khi chỉ được ghé các đỉnh 1…k; sau k = n thì không còn hạn chế nào. k phải là vòng lặp <strong>ngoài cùng</strong>.</li>
<li><strong>Big-O</strong>: n × n × n phép so sánh (64 với n = 4), bất kể số cạnh; bộ nhớ n² cho D và P.</li>
</ul>
<p>Chương trình chạy Floyd hai lần trên đồ thị có hướng 4 đỉnh của bài ở slide 33 — một lần với dòng 8 đúng như slide in, một lần đã sửa:</p>
<pre><code class="language-java">public class FloydP {
    static final int INF = 1000;                         // "không có cạnh"; không bao giờ đem cộng (xem phép thử bên dưới)
    static int n = 4, count;
    static int[][] W = {                                 // đồ thị có hướng của bài A..D
        {0, 3, 8, INF},
        {INF, 0, INF, 1},
        {INF, 5, 0, INF},
        {2, INF, -5, 0}};

    static String show(int[][] m) {
        String s = "";
        for (int i = 0; i &lt; n; i++) {
            s += (i &gt; 0 ? " /" : "");
            for (int j = 0; j &lt; n; j++) s += " " + m[i][j];
        }
        return s;
    }

    static int[][] floyd(boolean asPrinted, int[][] P) {
        int[][] D = new int[n][n];
        for (int i = 0; i &lt; n; i++) D[i] = W[i].clone();   // 1. D = W
        count = 0;                                       // 2. P = 0 (int[][] mới toàn 0)
        for (int k = 0; k &lt; n; k++)                      // 3. for k
            for (int i = 0; i &lt; n; i++)                  // 4. for i
                for (int j = 0; j &lt; n; j++) {            // 5. for j
                    count++;
                    if (D[i][k] == INF || D[k][j] == INF) continue;
                    if (D[i][j] &gt; D[i][k] + D[k][j]) {   // 6.
                        D[i][j] = D[i][k] + D[k][j];     // 7.
                        P[i][j] = asPrinted ? P[k][j] : k + 1;   // 8. như slide in / đã sửa (số hiệu đỉnh 1..n)
                    }
                }
        return D;
    }

    public static void main(String[] args) {
        int[][] P1 = new int[n][n], P2 = new int[n][n];
        int[][] D1 = floyd(true, P1);
        System.out.println("line 8 as printed, P[i][j] = P[k][j]:  P =" + show(P1));
        int[][] D2 = floyd(false, P2);
        System.out.println("line 8 fixed,      P[i][j] = k:        P =" + show(P2));
        System.out.println("D, identical in both runs:  D =" + show(D2) + "   same? " + show(D1).equals(show(D2)));
        System.out.println("comparisons: " + count + " = n^3 for n = " + n);
    }
}</code></pre>
<div class="out">line 8 as printed, P[i][j] = P[k][j]: &nbsp;P = 0 0 0 0 / 0 0 0 0 / 0 0 0 0 / 0 0 0 0<br>
line 8 fixed, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;P[i][j] = k: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;P = 0 0 4 2 / 4 0 4 0 / 4 0 0 2 / 0 3 0 0<br>
D, identical in both runs: &nbsp;D = 0 3 -1 4 / 3 0 -4 1 / 8 5 0 6 / 2 0 -5 0 &nbsp;&nbsp;same? true<br>
comparisons: 64 = n^3 for n = 4</div>
<p>Ở dòng thứ hai, P chứa số hiệu đỉnh đếm từ 1 như các vòng lặp của slide (1 = A … 4 = D): P[A][C] = 4 nghĩa là "đi qua D". Ma trận D giống hệt nhau ở cả hai lần chạy — chỉ thông tin để dựng đường đi là bị mất.</p>
<div class="pitfall"><strong>Lỗi trên slide:</strong> dòng 2 gán P = 0 còn dòng 8 ghi <code>P[i, j] = P[k, j]</code>. Chép từ một ma trận P toàn 0 thì chỉ ra 0, nên P mãi toàn 0 (dòng đầu của kết quả in ra — output) và không bao giờ dựng lại được đường đi; riêng D thì không bị ảnh hưởng. Với P khởi tạo bằng 0, dòng chuẩn là <strong><code>P[i, j] = k</code></strong> — đỉnh ghé qua, 0 nghĩa là "cạnh trực tiếp" — khớp với câu "non zero P values" (các giá trị P khác 0) của slide 34. Còn <code>P[i, j] = P[k, j]</code> thuộc quy ước khác, trong đó P[i, j] khởi tạo bằng i cho mỗi cạnh (i, j) và mang nghĩa "đỉnh đứng ngay trước j".</div>`],
      [33, 'Floyd Algorithm example (figure)',
        `<p class="ghi-chu">This slide is a picture (the Floyd example); apart from its title, no text could be extracted. The explanation below teaches the same thing on the lesson's own example.</p>
<p class="y-chinh">🎯 Floyd by hand: take k = A, B, C, D in turn and, for every pair (i, j), check whether stopping at k makes the route shorter.</p>
<pre><code class="language-plaintext">the lesson's digraph: 4 vertices, one negative edge, no negative cycle
  A -&gt; B   3        B -&gt; D   1        D -&gt; A   2
  A -&gt; C   8        C -&gt; B   5        D -&gt; C  -5</code></pre>
<pre><code class="language-java">public class FloydExample {
    static final int INF = 1000;
    static char[] v = {'A', 'B', 'C', 'D'};
    static int n = 4;

    static String cell(int x) { return x == INF ? "INF" : "" + x; }

    static void print(String title, int[][] D) {
        System.out.println(title);
        System.out.println("        A    B    C    D");
        for (int i = 0; i &lt; n; i++) {
            String row = "  " + v[i] + " ";
            for (int j = 0; j &lt; n; j++) row += String.format("%5s", cell(D[i][j]));
            System.out.println(row);
        }
    }

    public static void main(String[] args) {
        int[][] D = {                                    // D = W: A-&gt;B 3, A-&gt;C 8, B-&gt;D 1, C-&gt;B 5, D-&gt;A 2, D-&gt;C -5
            {0, 3, 8, INF},
            {INF, 0, INF, 1},
            {INF, 5, 0, INF},
            {2, INF, -5, 0}};
        print("W (INF = no edge):", D);
        for (int k = 0; k &lt; n; k++) {                    // now vertex k may be used as a stop
            String changes = "";
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++) {
                    if (D[i][k] == INF || D[k][j] == INF) continue;   // never add infinity
                    if (D[i][j] &gt; D[i][k] + D[k][j]) {
                        changes += "  " + v[i] + "-&gt;" + v[j] + " " + cell(D[i][j]) + " -&gt; " + (D[i][k] + D[k][j]);
                        D[i][j] = D[i][k] + D[k][j];
                    }
                }
            System.out.println("k = " + v[k] + ":" + changes);
        }
        print("final D:", D);
    }
}</code></pre>
<div class="out">W (INF = no edge):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;D<br>
&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;8 &nbsp;INF<br>
&nbsp;&nbsp;B &nbsp;&nbsp;INF &nbsp;&nbsp;&nbsp;0 &nbsp;INF &nbsp;&nbsp;&nbsp;1<br>
&nbsp;&nbsp;C &nbsp;&nbsp;INF &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;0 &nbsp;INF<br>
&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;INF &nbsp;&nbsp;-5 &nbsp;&nbsp;&nbsp;0<br>
k = A: &nbsp;D-&gt;B INF -&gt; 5<br>
k = B: &nbsp;A-&gt;D INF -&gt; 4 &nbsp;C-&gt;D INF -&gt; 6<br>
k = C: &nbsp;D-&gt;B 5 -&gt; 0<br>
k = D: &nbsp;A-&gt;C 8 -&gt; -1 &nbsp;B-&gt;A INF -&gt; 3 &nbsp;B-&gt;C INF -&gt; -4 &nbsp;C-&gt;A INF -&gt; 8<br>
final D:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;D<br>
&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;-1 &nbsp;&nbsp;&nbsp;4<br>
&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;-4 &nbsp;&nbsp;&nbsp;1<br>
&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;6<br>
&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;-5 &nbsp;&nbsp;&nbsp;0</div>
<table>
<thead><tr><th>k (allowed stop)</th><th>Entries improved</th><th>Because</th></tr></thead>
<tbody>
<tr><td>A</td><td>D→B: ∞ → 5</td><td>D→A→B = 2 + 3</td></tr>
<tr><td>B</td><td>A→D: ∞ → 4; C→D: ∞ → 6</td><td>A→B→D = 3 + 1; C→B→D = 5 + 1</td></tr>
<tr><td>C</td><td>D→B: 5 → 0</td><td>D→C→B = −5 + 5 — an entry that was already finite gets better</td></tr>
<tr><td>D</td><td>A→C: 8 → −1; B→A: ∞ → 3; B→C: ∞ → −4; C→A: ∞ → 8</td><td>every route through D, using D→C (−5) and D→A (2)</td></tr>
</tbody>
</table>
<p>The negative edge D→C is used by the final shortest paths A→C, B→C and D→B, and nothing goes wrong: Floyd never freezes a vertex the way Dijkstra does, it simply keeps improving entries.</p>
<p><strong>How to trace it on paper:</strong> for each k, copy row k and column k unchanged — in round k they cannot improve, because D[k][k] = 0 — then compare every other cell D[i][j] with D[i][k] + D[k][j] and keep the smaller.</p>
<p class="meo">🧠 <strong>Remember:</strong> "stop at k, go on from k": the candidate for cell (i, j) is always row i's entry in column k plus row k's entry in column j.</p>
<div class="pitfall">With a negative edge, a large number standing for ∞ is not safe either: ∞ + (−5) is "a bit less than ∞" and would be written into D as if it were a real distance. The program skips the pair when D[i][k] or D[k][j] is ∞ — do the same in a PE.</div>`,
        `<p class="ghi-chu">Slide này là hình (ví dụ chạy Floyd); ngoài tiêu đề, chữ không trích ra được. Phần giảng dưới đây dạy đúng ý đó bằng ví dụ của bài.</p>
<p class="y-chinh">🎯 Chạy tay Floyd: lần lượt lấy k = A, B, C, D và với mọi cặp (i, j), xét xem ghé qua k có làm đường ngắn lại không.</p>
<pre><code class="language-plaintext">đồ thị có hướng của bài: 4 đỉnh, một cạnh âm, không có chu trình âm
  A -&gt; B   3        B -&gt; D   1        D -&gt; A   2
  A -&gt; C   8        C -&gt; B   5        D -&gt; C  -5</code></pre>
<pre><code class="language-java">public class FloydExample {
    static final int INF = 1000;
    static char[] v = {'A', 'B', 'C', 'D'};
    static int n = 4;

    static String cell(int x) { return x == INF ? "INF" : "" + x; }

    static void print(String title, int[][] D) {
        System.out.println(title);
        System.out.println("        A    B    C    D");
        for (int i = 0; i &lt; n; i++) {
            String row = "  " + v[i] + " ";
            for (int j = 0; j &lt; n; j++) row += String.format("%5s", cell(D[i][j]));
            System.out.println(row);
        }
    }

    public static void main(String[] args) {
        int[][] D = {                                    // D = W: A-&gt;B 3, A-&gt;C 8, B-&gt;D 1, C-&gt;B 5, D-&gt;A 2, D-&gt;C -5
            {0, 3, 8, INF},
            {INF, 0, INF, 1},
            {INF, 5, 0, INF},
            {2, INF, -5, 0}};
        print("W (INF = no edge):", D);
        for (int k = 0; k &lt; n; k++) {                    // từ giờ được phép ghé đỉnh k
            String changes = "";
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++) {
                    if (D[i][k] == INF || D[k][j] == INF) continue;   // không bao giờ cộng vô cực
                    if (D[i][j] &gt; D[i][k] + D[k][j]) {
                        changes += "  " + v[i] + "-&gt;" + v[j] + " " + cell(D[i][j]) + " -&gt; " + (D[i][k] + D[k][j]);
                        D[i][j] = D[i][k] + D[k][j];
                    }
                }
            System.out.println("k = " + v[k] + ":" + changes);
        }
        print("final D:", D);
    }
}</code></pre>
<div class="out">W (INF = no edge):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;D<br>
&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;8 &nbsp;INF<br>
&nbsp;&nbsp;B &nbsp;&nbsp;INF &nbsp;&nbsp;&nbsp;0 &nbsp;INF &nbsp;&nbsp;&nbsp;1<br>
&nbsp;&nbsp;C &nbsp;&nbsp;INF &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;0 &nbsp;INF<br>
&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;INF &nbsp;&nbsp;-5 &nbsp;&nbsp;&nbsp;0<br>
k = A: &nbsp;D-&gt;B INF -&gt; 5<br>
k = B: &nbsp;A-&gt;D INF -&gt; 4 &nbsp;C-&gt;D INF -&gt; 6<br>
k = C: &nbsp;D-&gt;B 5 -&gt; 0<br>
k = D: &nbsp;A-&gt;C 8 -&gt; -1 &nbsp;B-&gt;A INF -&gt; 3 &nbsp;B-&gt;C INF -&gt; -4 &nbsp;C-&gt;A INF -&gt; 8<br>
final D:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;D<br>
&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;-1 &nbsp;&nbsp;&nbsp;4<br>
&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;-4 &nbsp;&nbsp;&nbsp;1<br>
&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;6<br>
&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;-5 &nbsp;&nbsp;&nbsp;0</div>
<table>
<thead><tr><th>k (đỉnh được ghé)</th><th>Các ô được cải thiện</th><th>Vì</th></tr></thead>
<tbody>
<tr><td>A</td><td>D→B: ∞ → 5</td><td>D→A→B = 2 + 3</td></tr>
<tr><td>B</td><td>A→D: ∞ → 4; C→D: ∞ → 6</td><td>A→B→D = 3 + 1; C→B→D = 5 + 1</td></tr>
<tr><td>C</td><td>D→B: 5 → 0</td><td>D→C→B = −5 + 5 — một ô vốn đã hữu hạn được làm tốt hơn</td></tr>
<tr><td>D</td><td>A→C: 8 → −1; B→A: ∞ → 3; B→C: ∞ → −4; C→A: ∞ → 8</td><td>mọi lộ trình qua D, dùng D→C (−5) và D→A (2)</td></tr>
</tbody>
</table>
<p>Cạnh âm D→C được dùng trong các đường đi ngắn nhất cuối cùng A→C, B→C và D→B, và không có gì sai cả: Floyd không bao giờ "chốt" một đỉnh như Dijkstra, nó chỉ liên tục cải thiện các ô.</p>
<p><strong>Cách chạy tay trên giấy:</strong> với mỗi k, chép nguyên hàng k và cột k — ở vòng k chúng không thể được cải thiện, vì D[k][k] = 0 — rồi so từng ô còn lại D[i][j] với D[i][k] + D[k][j] và giữ số nhỏ hơn.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "ghé k, đi tiếp từ k": ứng viên cho ô (i, j) luôn là ô của hàng i ở cột k cộng ô của hàng k ở cột j.</p>
<div class="pitfall">Khi có cạnh âm, một số lớn đóng vai ∞ cũng không an toàn: ∞ + (−5) là "nhỏ hơn ∞ một chút" và sẽ bị ghi vào D như thể là khoảng cách thật. Chương trình bỏ qua cặp đó khi D[i][k] hoặc D[k][j] là ∞ — làm PE cũng phải như vậy.</div>`],
      [34, 'Floyd Algorithm example (cont.)',
        `<p class="y-chinh">🎯 The final D holds every shortest distance, and the non-zero values of P — written in parentheses — tell which vertex to pass through, so every path can be rebuilt.</p>
<p>The slide shows the final distance matrix and P of its example, "the values in parenthesis are the non zero P values". The lesson's example in the same style (P printed as a letter, no parenthesis = direct edge):</p>
<pre><code class="language-java">public class FloydPaths {
    static final int INF = 1000;
    static char[] v = {'A', 'B', 'C', 'D'};
    static int n = 4;
    static int[][] D = {                                 // the lesson's digraph, as on slide 33
        {0, 3, 8, INF},
        {INF, 0, INF, 1},
        {INF, 5, 0, INF},
        {2, INF, -5, 0}};
    static int[][] P = new int[n][n];                    // 0 = direct edge; k = go through vertex k (1..n)

    static String path(int q, int r) {                   // the vertices strictly between q and r
        if (P[q][r] == 0) return "";
        int k = P[q][r] - 1;
        return path(q, k) + " " + v[k] + path(k, r);
    }

    public static void main(String[] args) {
        for (int k = 0; k &lt; n; k++)
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++)
                    if (D[i][k] != INF &amp;&amp; D[k][j] != INF &amp;&amp; D[i][j] &gt; D[i][k] + D[k][j]) {
                        D[i][j] = D[i][k] + D[k][j];
                        P[i][j] = k + 1;
                    }
        System.out.println("final D, non-zero P in parentheses:");
        System.out.println("           A       B       C       D");
        for (int i = 0; i &lt; n; i++) {
            String row = "  " + v[i] + " ";
            for (int j = 0; j &lt; n; j++)
                row += String.format("%8s", D[i][j] + (P[i][j] == 0 ? "" : "(" + v[P[i][j] - 1] + ")"));
            System.out.println(row);
        }
        int[][] ask = {{0, 2}, {1, 0}, {2, 0}, {3, 1}, {1, 2}};
        for (int[] q : ask)
            System.out.println("path " + v[q[0]] + "-&gt;" + v[q[1]] + ": " + v[q[0]] + path(q[0], q[1]) + " " + v[q[1]] + "   length " + D[q[0]][q[1]]);
        boolean neg = false;
        for (int i = 0; i &lt; n; i++) if (D[i][i] &lt; 0) neg = true;   // D[i][i] &lt; 0 &lt;=&gt; a negative cycle through i
        System.out.println("negative cycle? " + neg);
    }
}</code></pre>
<div class="out">final D, non-zero P in parentheses:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D<br>
&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;-1(D) &nbsp;&nbsp;&nbsp;4(B)<br>
&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;&nbsp;3(D) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;-4(D) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;&nbsp;8(D) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;6(B)<br>
&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;0(C) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
path A-&gt;C: A B D C &nbsp;&nbsp;length -1<br>
path B-&gt;A: B D A &nbsp;&nbsp;length 3<br>
path C-&gt;A: C B D A &nbsp;&nbsp;length 8<br>
path D-&gt;B: D C B &nbsp;&nbsp;length 0<br>
path B-&gt;C: B D C &nbsp;&nbsp;length -4<br>
negative cycle? false</div>
<ul>
<li><strong>Rebuild i → j</strong>: if P[i][j] = 0 the edge is direct; otherwise k = P[i][j] and the path is (i → k) followed by (k → j), each half rebuilt the same way. A→C: P = D, then A→D: P = B ⇒ A B D C.</li>
<li><strong>Negative-cycle test</strong>: after Floyd, some D[i][i] &lt; 0 ⇔ a negative cycle goes through i. Here the diagonal stays 0.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> P gives the middle of a path, not its next step: P[i][j] = k splits i → j into i → k and k → j; keep splitting until P = 0.</p>
<table>
<thead><tr><th></th><th>Dijkstra</th><th>Floyd</th></tr></thead>
<tbody>
<tr><td>Question answered</td><td>one source → every vertex</td><td>every pair of vertices</td></tr>
<tr><td>Weights</td><td>must be ≥ 0</td><td>negative edges allowed, no negative cycle</td></tr>
<tr><td>Method</td><td>greedy: grow a cloud, freeze the closest vertex</td><td>dynamic programming: allow stops 1, 2, …, k</td></tr>
<tr><td>Cost on a matrix</td><td>O(n²)</td><td>O(n³)</td></tr>
<tr><td>Output</td><td>d[] and predecessor p[]</td><td>matrices D and P</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Class questions CQ10.1 / CQ12.1 — Dijkstra vs Floyd:</strong> see the table. <strong>"Is Floyd n runs of Dijkstra?"</strong> No: running Dijkstra from each of the n vertices also gives all pairs, n × O(n²) = O(n³) — but only when every weight is ≥ 0; Floyd is a different method (dynamic programming on the allowed stops) that also accepts negative edges.</p>`,
        `<p class="y-chinh">🎯 Ma trận D cuối cùng chứa mọi khoảng cách ngắn nhất, còn các giá trị khác 0 của P — ghi trong ngoặc — cho biết phải đi qua đỉnh nào, nhờ vậy dựng lại được mọi đường đi.</p>
<p>Slide đưa ra ma trận khoảng cách cuối cùng và P của ví dụ, "giá trị trong ngoặc là các giá trị P khác 0". Ví dụ của bài theo cùng kiểu (P in thành chữ cái, không có ngoặc = cạnh trực tiếp):</p>
<pre><code class="language-java">public class FloydPaths {
    static final int INF = 1000;
    static char[] v = {'A', 'B', 'C', 'D'};
    static int n = 4;
    static int[][] D = {                                 // đồ thị có hướng của bài, như ở slide 33
        {0, 3, 8, INF},
        {INF, 0, INF, 1},
        {INF, 5, 0, INF},
        {2, INF, -5, 0}};
    static int[][] P = new int[n][n];                    // 0 = cạnh trực tiếp; k = đi qua đỉnh k (1..n)

    static String path(int q, int r) {                   // các đỉnh nằm giữa q và r
        if (P[q][r] == 0) return "";
        int k = P[q][r] - 1;
        return path(q, k) + " " + v[k] + path(k, r);
    }

    public static void main(String[] args) {
        for (int k = 0; k &lt; n; k++)
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++)
                    if (D[i][k] != INF &amp;&amp; D[k][j] != INF &amp;&amp; D[i][j] &gt; D[i][k] + D[k][j]) {
                        D[i][j] = D[i][k] + D[k][j];
                        P[i][j] = k + 1;
                    }
        System.out.println("final D, non-zero P in parentheses:");
        System.out.println("           A       B       C       D");
        for (int i = 0; i &lt; n; i++) {
            String row = "  " + v[i] + " ";
            for (int j = 0; j &lt; n; j++)
                row += String.format("%8s", D[i][j] + (P[i][j] == 0 ? "" : "(" + v[P[i][j] - 1] + ")"));
            System.out.println(row);
        }
        int[][] ask = {{0, 2}, {1, 0}, {2, 0}, {3, 1}, {1, 2}};
        for (int[] q : ask)
            System.out.println("path " + v[q[0]] + "-&gt;" + v[q[1]] + ": " + v[q[0]] + path(q[0], q[1]) + " " + v[q[1]] + "   length " + D[q[0]][q[1]]);
        boolean neg = false;
        for (int i = 0; i &lt; n; i++) if (D[i][i] &lt; 0) neg = true;   // D[i][i] &lt; 0 &lt;=&gt; có chu trình âm qua i
        System.out.println("negative cycle? " + neg);
    }
}</code></pre>
<div class="out">final D, non-zero P in parentheses:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D<br>
&nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;-1(D) &nbsp;&nbsp;&nbsp;4(B)<br>
&nbsp;&nbsp;B &nbsp;&nbsp;&nbsp;&nbsp;3(D) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;-4(D) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;&nbsp;C &nbsp;&nbsp;&nbsp;&nbsp;8(D) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;6(B)<br>
&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;0(C) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
path A-&gt;C: A B D C &nbsp;&nbsp;length -1<br>
path B-&gt;A: B D A &nbsp;&nbsp;length 3<br>
path C-&gt;A: C B D A &nbsp;&nbsp;length 8<br>
path D-&gt;B: D C B &nbsp;&nbsp;length 0<br>
path B-&gt;C: B D C &nbsp;&nbsp;length -4<br>
negative cycle? false</div>
<ul>
<li><strong>Dựng lại i → j</strong>: nếu P[i][j] = 0 thì đi thẳng bằng một cạnh; ngược lại k = P[i][j] và đường đi là (i → k) nối với (k → j), mỗi nửa lại dựng theo cùng cách. A→C: P = D, rồi A→D: P = B ⇒ A B D C.</li>
<li><strong>Kiểm chu trình âm</strong>: sau khi chạy Floyd, có D[i][i] &lt; 0 ⇔ có chu trình âm đi qua i. Ở đây đường chéo vẫn là 0.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> P cho biết điểm giữa của đường đi, không phải bước kế tiếp: P[i][j] = k tách i → j thành i → k và k → j; cứ tách tiếp cho tới khi P = 0.</p>
<table>
<thead><tr><th></th><th>Dijkstra</th><th>Floyd</th></tr></thead>
<tbody>
<tr><td>Trả lời câu hỏi</td><td>một nguồn → mọi đỉnh</td><td>mọi cặp đỉnh</td></tr>
<tr><td>Trọng số</td><td>bắt buộc ≥ 0</td><td>cho phép cạnh âm, cấm chu trình âm</td></tr>
<tr><td>Phương pháp</td><td>tham lam (greedy): nuôi đám mây, chốt đỉnh gần nhất</td><td>quy hoạch động (dynamic programming): lần lượt cho phép ghé 1, 2, …, k</td></tr>
<tr><td>Chi phí trên ma trận</td><td>O(n²)</td><td>O(n³)</td></tr>
<tr><td>Kết quả</td><td>mảng d[] và mảng đỉnh đứng trước p[]</td><td>hai ma trận D và P</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Câu hỏi trên lớp CQ10.1 / CQ12.1 — Dijkstra khác Floyd thế nào:</strong> xem bảng. <strong>"Floyd có phải là chạy Dijkstra n lần không?"</strong> Không: chạy Dijkstra từ mỗi đỉnh trong n đỉnh cũng cho được mọi cặp, n × O(n²) = O(n³) — nhưng chỉ khi mọi trọng số ≥ 0; Floyd là một phương pháp khác (quy hoạch động theo tập đỉnh được ghé) và chấp nhận cả cạnh âm.</p>`],
      [35, 'Summary',
        `<p class="y-chinh">🎯 Part 1 on one screen: the vocabulary, three representations, two traversals and two shortest-path algorithms — the nine objectives of slide 2.</p>
<table>
<thead><tr><th>Topic</th><th>What to remember</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Terminology (slides 3–17)</td><td>Σ deg = 2m; Kn has n(n − 1)/2 edges; a tree has m = n − 1</td><td>—</td></tr>
<tr><td>Representation (18–20)</td><td>list for sparse graphs, matrix for dense ones; incidence matrix n × m</td><td>O(n + m) / O(n²) / O(n·m) memory</td></tr>
<tr><td>BFS (21–23)</td><td>queue, mark when enqueued, fewest edges; add a restart loop</td><td>O(n + m) lists, O(n²) matrix</td></tr>
<tr><td>DFS (24–26)</td><td>recursion, mark on entry, restart loop; <code>new boolean[n]</code>, not 20</td><td>O(n + m) lists, O(n²) matrix</td></tr>
<tr><td>Dijkstra (27–31)</td><td>one source, weights ≥ 0, take the closest, relax, keep predecessors</td><td>O(n²) with a matrix</td></tr>
<tr><td>Floyd (32–34)</td><td>all pairs, <code>D[i][j] = min(D[i][j], D[i][k] + D[k][j])</code>, k outermost, <code>P[i][j] = k</code></td><td>O(n³)</td></tr>
</tbody>
</table>
<ul>
<li>Every algorithm here starts the same way: know what "no edge" looks like in your matrix (0, 99 or ∞) before you test <code>a[i][j] &gt; 0</code>.</li>
<li>The class questions of this deck and where they are answered: CQ8.1 (slide 7), CQ8.2 (22), CQ8.3 (25), CQ9.1 pseudo-graph (9) and connected graph (11), CQ9.2 and CQ9.3 complete graph (15), CQ10.1 / CQ12.1 (34), CQ10.2 (18–19), CQ10.3 (24), CQ11.2 (27–34), CQ11.3 (28).</li>
<li>The two slide bugs worth remembering: BFS of slide 23 has no restart; DFS of slide 26 allocates 20 cells. And line 8 of Floyd on slide 32 should read <code>P[i, j] = k</code>.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> queue → BFS → fewest edges; stack/recursion → DFS → go deep; closest-first → Dijkstra → one source, no negatives; triple loop → Floyd → every pair.</p>
<div class="pitfall">Two classic FE questions: "which algorithm may fail with negative weights?" — Dijkstra; "which one accepts negative edges?" — Floyd, as long as there is no negative cycle. And "DFS is O(n + m)" holds only with adjacency lists.</div>`,
        `<p class="y-chinh">🎯 Cả phần 1 trong một màn hình: bộ từ vựng, ba cách biểu diễn, hai phép duyệt và hai thuật toán đường đi ngắn nhất — đúng chín mục tiêu của slide 2.</p>
<table>
<thead><tr><th>Chủ đề</th><th>Điều cần nhớ</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>Thuật ngữ (slide 3–17)</td><td>Σ deg = 2m; Kn có n(n − 1)/2 cạnh; cây có m = n − 1</td><td>—</td></tr>
<tr><td>Biểu diễn (18–20)</td><td>danh sách kề cho đồ thị thưa, ma trận kề cho đồ thị dày; ma trận liên thuộc n × m</td><td>bộ nhớ O(n + m) / O(n²) / O(n·m)</td></tr>
<tr><td>BFS (21–23)</td><td>hàng đợi, đánh dấu khi đưa vào, ít cạnh nhất; thêm vòng khởi động lại</td><td>O(n + m) danh sách, O(n²) ma trận</td></tr>
<tr><td>DFS (24–26)</td><td>đệ quy, đánh dấu khi bước vào, vòng khởi động lại; <code>new boolean[n]</code> chứ không phải 20</td><td>O(n + m) danh sách, O(n²) ma trận</td></tr>
<tr><td>Dijkstra (27–31)</td><td>một nguồn, trọng số ≥ 0, lấy đỉnh gần nhất, nới lỏng, giữ predecessor</td><td>O(n²) với ma trận</td></tr>
<tr><td>Floyd (32–34)</td><td>mọi cặp, <code>D[i][j] = min(D[i][j], D[i][k] + D[k][j])</code>, k ở vòng ngoài cùng, <code>P[i][j] = k</code></td><td>O(n³)</td></tr>
</tbody>
</table>
<ul>
<li>Thuật toán nào ở đây cũng bắt đầu giống nhau: biết rõ "không có cạnh" trong ma trận của bạn trông thế nào (0, 99 hay ∞) trước khi viết <code>a[i][j] &gt; 0</code>.</li>
<li>Các câu hỏi trên lớp của bộ slide và chỗ trả lời: CQ8.1 (slide 7), CQ8.2 (22), CQ8.3 (25), CQ9.1 giả đồ thị (9) và đồ thị liên thông (11), CQ9.2 và CQ9.3 đồ thị đầy đủ (15), CQ10.1 / CQ12.1 (34), CQ10.2 (18–19), CQ10.3 (24), CQ11.2 (27–34), CQ11.3 (28).</li>
<li>Hai lỗi của slide đáng nhớ: BFS ở slide 23 không khởi động lại; DFS ở slide 26 cấp mảng cứng 20 ô. Và dòng 8 của Floyd ở slide 32 phải là <code>P[i, j] = k</code>.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> hàng đợi → BFS → ít cạnh nhất; ngăn xếp/đệ quy → DFS → đi sâu; gần nhất trước → Dijkstra → một nguồn, không âm; ba vòng lặp → Floyd → mọi cặp.</p>
<div class="pitfall">Hai kiểu câu FE kinh điển: "thuật toán nào có thể sai khi có trọng số âm?" — Dijkstra; "thuật toán nào chấp nhận cạnh âm?" — Floyd, miễn là không có chu trình âm. Và "DFS là O(n + m)" chỉ đúng với danh sách kề.</div>`],
      [36, 'Reading at home',
        `<p class="y-chinh">🎯 Chapter 14 of Goodrich 6e, Graph Algorithms (p.611), is the textbook version of this deck — the sections below match the slides.</p>
<ul>
<li><strong>§14.1 Graphs (p.612)</strong> and <strong>§14.1.1 The Graph ADT (p.618)</strong> — the definitions of slides 3–16, and the methods a graph class offers (numVertices, numEdges, getEdge(u, v), outDegree(v), insertVertex, insertEdge…).</li>
<li><strong>§14.2 Data Structures for Graphs (p.619)</strong> — edge list (§14.2.1, p.620), adjacency list (§14.2.2, p.622), adjacency matrix (§14.2.4, p.625): slides 18–20, with the book's table of costs.</li>
<li><strong>§14.3 Graph Traversals (p.630)</strong> — depth-first search (§14.3.1, p.631) and breadth-first search (§14.3.3, p.640): slides 21–26.</li>
<li><strong>§14.6 Shortest Paths (p.651)</strong> — weighted graphs (§14.6.1, p.651) and Dijkstra's algorithm (§14.6.2, p.653): slides 27–31.</li>
</ul>
<p>The reading list has no Floyd section: the book shows the same triple loop as the Floyd–Warshall algorithm in §14.4 (Transitive Closure), in its yes/no "can i reach j?" form.</p>`,
        `<p class="y-chinh">🎯 Chương 14 sách Goodrich bản 6, Graph Algorithms (tr.611), là phiên bản giáo trình của bộ slide này — các mục dưới đây khớp với từng nhóm slide.</p>
<ul>
<li><strong>§14.1 Graphs (tr.612)</strong> và <strong>§14.1.1 The Graph ADT (tr.618)</strong> — các định nghĩa của slide 3–16, và các phương thức một lớp đồ thị cung cấp (ADT — kiểu dữ liệu trừu tượng: numVertices, numEdges, getEdge(u, v), outDegree(v), insertVertex, insertEdge…).</li>
<li><strong>§14.2 Data Structures for Graphs (tr.619)</strong> — danh sách cạnh (edge list, §14.2.1, tr.620), danh sách kề (§14.2.2, tr.622), ma trận kề (§14.2.4, tr.625): slide 18–20, kèm bảng chi phí của sách.</li>
<li><strong>§14.3 Graph Traversals (tr.630)</strong> — duyệt theo chiều sâu (§14.3.1, tr.631) và theo chiều rộng (§14.3.3, tr.640): slide 21–26.</li>
<li><strong>§14.6 Shortest Paths (tr.651)</strong> — đồ thị có trọng số (weighted graph, §14.6.1, tr.651) và thuật toán Dijkstra (§14.6.2, tr.653): slide 27–31.</li>
</ul>
<p>Danh sách đọc không có mục nào về Floyd: sách trình bày cùng ba vòng lặp đó dưới tên thuật toán Floyd–Warshall ở §14.4 (Transitive Closure — bao đóng bắc cầu), ở dạng có/không "i có đi tới được j không?".</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>You run the BFS of slide 23 on a weight matrix that uses 99 for "no edge". What goes wrong, and what is the fix?</li>
<li>On the lesson's graph, BFS from A visits A B D E C F. Why does D come before C?</li>
<li>What does <code>depthFirst(k)</code> of slide 26 do on a graph with 25 vertices?</li>
<li>In the Dijkstra example of slide 30, why is D final at 20 and not 22?</li>
<li>Dijkstra or Floyd: (a) a table of distances between all 50 cities; (b) one source, one edge of weight −3?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) <code>99 &gt; 0</code> is true, so BFS walks along non-existing edges; test <code>a[h][i] &gt; 0 &amp;&amp; a[h][i] &lt; 99</code>. (2) D is a neighbour of A (level 1), C is two edges away (level 2). (3) it throws ArrayIndexOutOfBoundsException — the array has 20 cells; use <code>new boolean[n]</code>. (4) C (9) enters S before D and relaxes D to 9 + 11 = 20 &lt; 22. (5) (a) Floyd — every pair, O(n³); (b) not Dijkstra (negative weight) — Floyd works as long as there is no negative cycle.</p>
<p><strong>Next:</strong> the deep-dive lessons below — 5.2 Three ways to store a graph, 5.3 DFS: cycles, components, topological order, 5.4 BFS &amp; shortest paths in unweighted graphs, 5.5 Dijkstra step by step — then the slide-by-slide lesson of deck 5B-Graphs2 (spanning trees, Euler, Hamilton, colouring) with 5.6–5.7, and lesson 5.8 to practise the whole chapter.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Bạn chạy BFS của slide 23 trên ma trận trọng số dùng 99 cho "không có cạnh". Sai ở đâu, sửa thế nào?</li>
<li>Trên đồ thị của bài, BFS từ A thăm A B D E C F. Vì sao D đứng trước C?</li>
<li><code>depthFirst(k)</code> của slide 26 làm gì với đồ thị 25 đỉnh?</li>
<li>Trong ví dụ Dijkstra ở slide 30, vì sao D được chốt ở 20 chứ không phải 22?</li>
<li>Dijkstra hay Floyd: (a) bảng khoảng cách giữa mọi cặp trong 50 thành phố; (b) một nguồn, có một cạnh trọng số −3?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) <code>99 &gt; 0</code> là đúng nên BFS đi theo cả những cạnh không tồn tại; kiểm <code>a[h][i] &gt; 0 &amp;&amp; a[h][i] &lt; 99</code>. (2) D là láng giềng của A (tầng 1), C cách A hai cạnh (tầng 2). (3) văng ArrayIndexOutOfBoundsException — mảng chỉ có 20 ô; dùng <code>new boolean[n]</code>. (4) C (9) vào S trước D và nới lỏng D thành 9 + 11 = 20 &lt; 22. (5) (a) Floyd — mọi cặp, O(n³); (b) không dùng Dijkstra (có trọng số âm) — Floyd chạy đúng miễn là không có chu trình âm.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu bên dưới — 5.2 Ba cách lưu một đồ thị, 5.3 DFS: chu trình, thành phần liên thông, sắp xếp tô-pô, 5.4 BFS &amp; đường đi ngắn nhất trên đồ thị không trọng số, 5.5 Dijkstra từng bước — rồi bài học theo slide của bộ 5B-Graphs2 (cây khung, Euler, Hamilton, tô màu) cùng 5.6–5.7, và bài 5.8 để luyện cả chương.</p>`),
    books([
      ['goodrich', '§14.2 Data Structures for Graphs p.619 (§14.2.1 Edge List p.620 · §14.2.2 Adjacency List p.622 · §14.2.4 Adjacency Matrix p.625) · §14.3 Graph Traversals p.630 (§14.3.1 Depth-First Search p.631 · §14.3.3 Breadth-First Search p.640) · §14.6 Shortest Paths p.651 (§14.6.1 Weighted Graphs p.651 · §14.6.2 Dijkstra’s Algorithm p.653)', '§14.2 Data Structures for Graphs tr.619 (§14.2.1 Edge List tr.620 · §14.2.2 Adjacency List tr.622 · §14.2.4 Adjacency Matrix tr.625) · §14.3 Graph Traversals tr.630 (§14.3.1 Depth-First Search tr.631 · §14.3.3 Breadth-First Search tr.640) · §14.6 Shortest Paths tr.651 (§14.6.1 Weighted Graphs tr.651 · §14.6.2 Dijkstra’s Algorithm tr.653)'],
    ]),
  ].join('\n'),
};

/* ───────── 5.C — 📑 Slide by slide · Graphs, part 2a: spanning trees, Prim, Kruskal & Euler (5B-Graphs2, slides 1–15) ───────── */
const L_csd11_1 = {
  title: '5.C — 📑 Slide by slide · Graphs, part 2a: spanning trees, Prim, Kruskal & Euler (5B-Graphs2, slides 1–15)|||5.C — 📑 Học theo từng slide · Đồ thị, phần 2a: cây khung, Prim, Kruskal & Euler (5B-Graphs2, slide 1–15)',
  slug: 'csd201-slide-csd11-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–15 của bộ 5B-Graphs2: cây khung và cây khung nhỏ nhất (MST), Prim-Jarník và Kruskal chạy tay từng bước trên cùng một đồ thị (kèm bản heap và union-find), so sánh Prim với Kruskal, đường đi/chu trình Euler, bảy cây cầu Königsberg, Định lý 1 và phần chứng minh điều kiện cần — 8 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.C · 5B-Graphs2, slides 1–15</span>
<h2>Graphs, part 2a — spanning trees, Prim, Kruskal and the road to Euler</h2>
<p class="lead">5B-Graphs2 is the second graph deck, taught in syllabus sessions 37–38 (CLO5) after Dijkstra and Floyd in 5A-Graphs1. This lesson walks through its first 15 slides: the minimum spanning tree (MST) problem, Prim-Jarník and Kruskal traced step by step on one office network of the lesson's own, then Euler paths and cycles up to the first half of the proof of Theorem 1. Every algorithm has a runnable Java program, and every trace table matches the program's real output.</p>
<div class="callout"><strong>CLO5 in the syllabus:</strong> discuss graphs and their applications; implement a graph with some basic operations. For these slides that means: say which edge Prim or Kruskal picks at each step and the total weight (a common FE question), code both on an adjacency matrix for the PE, and decide from the degrees alone whether an Euler cycle or path exists. The syllabus discussion questions CQ12.3 (what is an MST?), CQ13.1 (Prim vs Kruskal) and CQ12.2 (how do you know a graph has an Euler cycle?) are answered on slides 4, 11 and 14.</div>
<h3>The whole lesson in one table</h3>
<table>
<thead><tr><th>Idea</th><th>What it is</th><th>Rule / cost</th></tr></thead>
<tbody>
<tr><td>Spanning tree</td><td>a tree (connected, no cycle) that contains every vertex of a connected graph</td><td>always |V| − 1 edges; a graph can have a great many of them</td></tr>
<tr><td>Minimum spanning tree (MST)</td><td>the spanning tree with the smallest total weight</td><td>the total is unique; the tree is unique when all weights differ</td></tr>
<tr><td>Prim-Jarník</td><td>grows one tree from a start vertex, adding the cheapest edge that leaves it</td><td>O(|V|²) with a matrix, O(|E| log |V|) with a heap</td></tr>
<tr><td>Kruskal</td><td>takes edges from the cheapest up, skipping any edge that would close a cycle</td><td>O(|E| log |E|), the sort dominates; union-find detects cycles</td></tr>
<tr><td>Euler path / Euler cycle</td><td>a walk that uses every edge exactly once; a cycle also ends where it started</td><td>connected + every degree even ⇔ Euler cycle (Theorem 1)</td></tr>
<tr><td>Königsberg bridges</td><td>4 land masses, 7 bridges, degrees 5, 3, 3, 3</td><td>4 odd vertices ⇒ no Euler cycle and no Euler path</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.C · 5B-Graphs2, slide 1–15</span>
<h2>Đồ thị, phần 2a — cây khung, Prim, Kruskal và bước đầu vào Euler</h2>
<p class="lead">5B-Graphs2 là bộ slide đồ thị thứ hai, dạy ở buổi 37–38 theo syllabus (CLO5), ngay sau Dijkstra và Floyd của bộ 5A-Graphs1. Bài này đi qua 15 slide đầu: bài toán cây khung nhỏ nhất (minimum spanning tree — MST), thuật toán Prim-Jarník và Kruskal chạy tay từng bước trên cùng một mạng máy tính văn phòng (ví dụ của bài), rồi đường đi và chu trình Euler cho tới nửa đầu chứng minh Định lý 1. Thuật toán nào cũng có chương trình Java chạy được, và bảng từng bước nào cũng khớp với output thật của chương trình.</p>
<div class="callout"><strong>CLO5 trong syllabus:</strong> trình bày về đồ thị và ứng dụng; cài đặt đồ thị với một số thao tác cơ bản. Với các slide này nghĩa là: nói được Prim hay Kruskal chọn cạnh nào ở mỗi bước và tổng trọng số (dạng câu hỏi hay gặp ở FE — thi cuối kỳ), code được cả hai trên ma trận kề (adjacency matrix) cho PE (thi thực hành), và chỉ nhìn bậc của các đỉnh là biết có chu trình hay đường đi Euler không. Các câu hỏi thảo luận CQ12.3 (MST là gì?), CQ13.1 (Prim khác Kruskal thế nào?) và CQ12.2 (làm sao biết đồ thị có chu trình Euler?) được trả lời ở slide 4, 11 và 14.</div>
<h3>Cả bài trong một bảng</h3>
<table>
<thead><tr><th>Ý</th><th>Là gì</th><th>Quy tắc / chi phí</th></tr></thead>
<tbody>
<tr><td>Cây khung (spanning tree)</td><td>cây (liên thông, không chu trình) chứa mọi đỉnh của một đồ thị liên thông</td><td>luôn có |V| − 1 cạnh; một đồ thị có thể có rất nhiều cây khung</td></tr>
<tr><td>Cây khung nhỏ nhất (MST)</td><td>cây khung có tổng trọng số nhỏ nhất</td><td>tổng là duy nhất; cây là duy nhất khi mọi trọng số khác nhau</td></tr>
<tr><td>Prim-Jarník</td><td>nuôi một cây từ đỉnh xuất phát, mỗi bước thêm cạnh rẻ nhất đi ra khỏi cây</td><td>O(|V|²) với ma trận, O(|E| log |V|) với heap (đống)</td></tr>
<tr><td>Kruskal</td><td>lấy cạnh từ rẻ tới đắt, bỏ qua cạnh nào sẽ khép thành chu trình</td><td>O(|E| log |E|), phần sắp xếp chiếm chủ yếu; union-find (hợp–tìm) phát hiện chu trình</td></tr>
<tr><td>Đường đi / chu trình Euler</td><td>hành trình đi qua mọi cạnh đúng một lần; chu trình thì kết thúc tại chính chỗ xuất phát</td><td>liên thông + mọi bậc chẵn ⇔ có chu trình Euler (Định lý 1)</td></tr>
<tr><td>Bảy cây cầu Königsberg</td><td>4 vùng đất, 7 cây cầu, bậc 5, 3, 3, 3</td><td>4 đỉnh bậc lẻ ⇒ không có chu trình, cũng không có đường đi Euler</td></tr>
</tbody>
</table>`),
    walkHead('csd11', 1, 15),
    walk('csd11', [
      [1, '5. Graphs - Part 2',
        `<p class="y-chinh">🎯 Chapter 5, part 2: after storing, traversing and finding shortest paths in graphs (part 1), this deck asks questions about the whole graph at once.</p>
<p>Four new questions: what is the cheapest way to connect every vertex (spanning trees, slides 3–11)? Can a walk use every edge exactly once (Euler, slides 12–22)? Can a cycle visit every vertex exactly once (Hamilton, slides 23–25)? How few colours are enough so that neighbours always differ (colouring, slides 26–28)?</p>
<p>The vocabulary of part 1 (5A-Graphs1) is used throughout: degree, path, cycle, connected, multigraph, tree, spanning tree, adjacency matrix.</p>`,
        `<p class="y-chinh">🎯 Chương 5, phần 2: sau khi đã biết lưu, duyệt và tìm đường đi ngắn nhất trên đồ thị (phần 1), bộ slide này đặt câu hỏi về cả đồ thị cùng một lúc.</p>
<p>Bốn câu hỏi mới: nối mọi đỉnh sao cho rẻ nhất (cây khung — spanning tree, slide 3–11)? Có hành trình nào đi qua mọi cạnh đúng một lần không (Euler, slide 12–22)? Có chu trình nào qua mọi đỉnh đúng một lần không (Hamilton, slide 23–25)? Cần ít nhất bao nhiêu màu để hai đỉnh kề nhau luôn khác màu (tô màu đồ thị — graph coloring, slide 26–28)?</p>
<p>Từ vựng của phần 1 (5A-Graphs1) được dùng suốt bộ này: bậc (degree), đường đi (path), chu trình (cycle), liên thông (connected), đa đồ thị (multigraph), cây (tree), cây khung, ma trận kề (adjacency matrix).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 The slide lists four objectives — spanning trees, Prim's algorithm, Kruskal's algorithm, Eulerian graphs — and the deck goes further than the list.</p>
<ol>
<li><strong>Spanning trees</strong> — slides 3–7: the MST problem, what a spanning tree is, where it is used, why both algorithms are greedy.</li>
<li><strong>Prim algorithm</strong> — slides 8–9: grow one tree, vertex by vertex.</li>
<li><strong>Kruskal algorithm</strong> — slides 10–11: take the cheapest safe edges, wherever they are.</li>
<li><strong>Eulerian graphs</strong> — slides 12–22: Euler paths and cycles, Königsberg, Theorems 1 and 2, two algorithms that build an Euler cycle.</li>
</ol>
<p>The list stops there, but slides 23–28 also teach Hamilton cycles and graph colouring, and the Summary (slide 29) includes them — study them as part of the chapter.</p>
<p class="meo">🧠 <strong>Remember:</strong> MST = connect everything cheaply · Euler = every <em>edge</em> once · Hamilton = every <em>vertex</em> once · colouring = neighbours differ.</p>`,
        `<p class="y-chinh">🎯 Slide nêu bốn mục tiêu — cây khung, thuật toán Prim, thuật toán Kruskal, đồ thị Euler — và bộ slide còn đi xa hơn danh sách này.</p>
<ol>
<li><strong>Cây khung (spanning tree)</strong> — slide 3–7: bài toán MST (cây khung nhỏ nhất), cây khung là gì, dùng vào đâu, vì sao cả hai thuật toán đều là tham lam (greedy).</li>
<li><strong>Thuật toán Prim</strong> — slide 8–9: nuôi một cây lớn dần, từng đỉnh một.</li>
<li><strong>Thuật toán Kruskal</strong> — slide 10–11: lấy các cạnh rẻ nhất mà an toàn, nằm ở đâu cũng được.</li>
<li><strong>Đồ thị Euler (Eulerian graph)</strong> — slide 12–22: đường đi và chu trình Euler, bài toán Königsberg, Định lý 1 và 2, hai thuật toán dựng chu trình Euler.</li>
</ol>
<p>Danh sách dừng ở đó, nhưng slide 23–28 còn dạy chu trình Hamilton và tô màu đồ thị (graph coloring), và slide Tóm tắt (slide 29) có liệt kê chúng — hãy học như một phần của chương.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> MST = nối hết với chi phí ít nhất · Euler = mỗi <em>cạnh</em> một lần · Hamilton = mỗi <em>đỉnh</em> một lần · tô màu = hai đỉnh kề khác màu.</p>`],
      [3, 'Minimum Spanning Tree (MST) - Introduction',
        `<p class="y-chinh">🎯 Wiring every computer of an office with the least cable is a graph problem: find a tree that reaches every vertex with the smallest total edge weight.</p>
<ul>
<li><strong>Model</strong> (from the slide): an undirected, weighted graph G — the vertices are the computers, an edge (u,v) is a cable that could be laid between u and v, and its weight w(u,v) is the amount of cable it needs.</li>
<li><strong>Why a tree?</strong> Every cable has a positive length. If the chosen cables contained a cycle, removing any one cable of that cycle would keep every computer connected and save cable. So the cheapest network never has a cycle — it is a tree.</li>
<li><strong>Not Dijkstra's problem:</strong> the slide stresses that we do not want a shortest-path tree from one particular vertex v (5A-Graphs1); we want the minimum <em>total</em> weight over all trees that contain every vertex.</li>
</ul>
<p class="nhan">The lesson's own example — an office with 7 computers A–G and 11 possible cable runs (metres)</p>
<pre><code class="language-plaintext">A ------ 6 ------ B ------ 3 ------ C
|             /   |                 |
2       4 /       5                 7
|    /            |                 |
D ------ 8 ------ E ------ 1 ------ F
    \\             |             /
       9 \\        11       / 10
             \\    |    /
                  G</code></pre>
<p>Edge list: A-B 6, A-D 2, B-C 3, B-D 4, B-E 5, C-F 7, D-E 8, D-G 9, E-F 1, E-G 11, F-G 10. Slides 8–11 build its MST twice, with Prim and with Kruskal; both end at 24 m of cable.</p>
<p class="meo">🧠 <strong>Remember:</strong> spanning = touches every vertex, tree = no cycle, minimum = smallest total weight.</p>`,
        `<p class="y-chinh">🎯 Đi dây mạng cho mọi máy tính trong văn phòng mà tốn ít cáp nhất là một bài toán đồ thị: tìm một cây đi tới mọi đỉnh với tổng trọng số các cạnh nhỏ nhất.</p>
<ul>
<li><strong>Mô hình</strong> (theo slide): đồ thị vô hướng có trọng số (undirected, weighted graph) G — đỉnh (vertex) là các máy tính, cạnh (edge) (u,v) là một đoạn cáp có thể kéo giữa u và v, trọng số (weight) w(u,v) là lượng cáp cần dùng.</li>
<li><strong>Vì sao là cây (tree)?</strong> Đoạn cáp nào cũng có độ dài dương. Nếu các đoạn cáp được chọn tạo thành một chu trình (cycle), bỏ bớt một đoạn bất kỳ trên chu trình đó thì mọi máy vẫn nối với nhau mà lại đỡ tốn cáp. Vậy mạng rẻ nhất không bao giờ có chu trình — nó là một cây.</li>
<li><strong>Không phải bài của Dijkstra:</strong> slide nhấn mạnh ta không tìm cây đường đi ngắn nhất (shortest-path tree) từ một đỉnh v cụ thể (bộ 5A-Graphs1); ta tìm, trong mọi cây chứa đủ các đỉnh, cây có <em>tổng</em> trọng số nhỏ nhất.</li>
</ul>
<p class="nhan">Ví dụ của bài — văn phòng có 7 máy A–G và 11 đường cáp có thể kéo (đơn vị mét)</p>
<pre><code class="language-plaintext">A ------ 6 ------ B ------ 3 ------ C
|             /   |                 |
2       4 /       5                 7
|    /            |                 |
D ------ 8 ------ E ------ 1 ------ F
    \\             |             /
       9 \\        11       / 10
             \\    |    /
                  G</code></pre>
<p>Danh sách cạnh: A-B 6, A-D 2, B-C 3, B-D 4, B-E 5, C-F 7, D-E 8, D-G 9, E-F 1, E-G 11, F-G 10. Slide 8–11 sẽ dựng cây khung nhỏ nhất (MST) của đồ thị này hai lần, bằng Prim và bằng Kruskal; cả hai đều ra 24 m cáp.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khung (spanning) = chạm mọi đỉnh, cây = không có chu trình, nhỏ nhất (minimum) = tổng trọng số bé nhất.</p>`],
      [4, 'MST - Problem Definition',
        `<p class="y-chinh">🎯 Given an undirected weighted graph G, find a tree T that contains every vertex of G and minimises the sum of its edge weights, w(T) = Σ w(u,v) over the edges (u,v) of T.</p>
<ul>
<li><strong>Spanning tree</strong> (the slide's definition): a tree that contains every vertex of a connected graph G.</li>
<li><strong>The MST problem</strong>: among all spanning trees, compute one with the smallest total weight.</li>
<li>Every spanning tree of a graph with n vertices has exactly <strong>n − 1 edges</strong> — so "minimum" is about weight, never about the number of edges.</li>
<li>Only a <strong>connected</strong> graph has a spanning tree; a disconnected graph can at best get one tree per component (a spanning forest).</li>
</ul>
<p class="nhan">Two spanning trees of the office graph (slide 3) — same number of edges, very different cost</p>
<table>
<thead><tr><th>Tree</th><th>Its 6 edges</th><th>w(T)</th></tr></thead>
<tbody>
<tr><td>T1</td><td>A-D 2, B-D 4, B-C 3, B-E 5, E-F 1, D-G 9</td><td>24 (the MST, built on slides 8–11)</td></tr>
<tr><td>T2</td><td>A-B 6, B-C 3, C-F 7, F-G 10, G-E 11, E-D 8</td><td>45</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>CQ12.3 — What is a minimum spanning tree?</strong> A set of edges of a connected, weighted, undirected graph that connects all the vertices without any cycle and whose total weight is as small as possible.</p>
<div class="pitfall">FE trap: "the MST is the spanning tree with the fewest edges" — false, all spanning trees have the same n − 1 edges. Another trap: "the MST is unique" — only guaranteed when all edge weights are different; with equal weights there may be several MSTs, all with the same total (slide 11).</div>`,
        `<p class="y-chinh">🎯 Cho đồ thị vô hướng có trọng số G, tìm một cây T chứa mọi đỉnh của G và có tổng trọng số các cạnh nhỏ nhất: w(T) = Σ w(u,v) lấy trên các cạnh (u,v) của T.</p>
<ul>
<li><strong>Cây khung (spanning tree)</strong> (định nghĩa trên slide): một cây chứa mọi đỉnh của đồ thị liên thông G.</li>
<li><strong>Bài toán cây khung nhỏ nhất (MST)</strong>: trong mọi cây khung, tìm một cây có tổng trọng số nhỏ nhất.</li>
<li>Mọi cây khung của đồ thị n đỉnh đều có đúng <strong>n − 1 cạnh</strong> — nên "nhỏ nhất" là nói về trọng số, không bao giờ là số cạnh.</li>
<li>Chỉ đồ thị <strong>liên thông (connected)</strong> mới có cây khung; đồ thị không liên thông thì tốt nhất mỗi thành phần được một cây (gọi là rừng khung — spanning forest).</li>
</ul>
<p class="nhan">Hai cây khung của đồ thị văn phòng (slide 3) — cùng số cạnh, chi phí khác hẳn nhau</p>
<table>
<thead><tr><th>Cây</th><th>6 cạnh của nó</th><th>w(T)</th></tr></thead>
<tbody>
<tr><td>T1</td><td>A-D 2, B-D 4, B-C 3, B-E 5, E-F 1, D-G 9</td><td>24 (chính là MST, dựng ở slide 8–11)</td></tr>
<tr><td>T2</td><td>A-B 6, B-C 3, C-F 7, F-G 10, G-E 11, E-D 8</td><td>45</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>CQ12.3 — Cây khung nhỏ nhất là gì?</strong> Là một tập cạnh của đồ thị vô hướng, liên thông, có trọng số, nối được mọi đỉnh mà không tạo chu trình, và có tổng trọng số nhỏ nhất có thể.</p>
<div class="pitfall">Bẫy FE (thi cuối kỳ): "MST là cây khung có ít cạnh nhất" — SAI, mọi cây khung đều có n − 1 cạnh như nhau. Bẫy khác: "MST là duy nhất" — chỉ chắc chắn khi mọi trọng số khác nhau; khi có trọng số bằng nhau có thể có nhiều MST, nhưng tổng trọng số của chúng luôn bằng nhau (slide 11).</div>`],
      [5, 'Spanning Tree example',
        `<p class="y-chinh">🎯 A tree is an undirected, connected graph without simple cycles; a spanning tree is a tree that includes all vertices of the original graph — and one graph usually has many of them.</p>
<p>The slide illustrates this with pictures: a graph of the airline connections between seven cities, and two spanning trees of it. The same idea on the lesson's own small graph, small enough for a program to list <em>every</em> spanning tree:</p>
<pre><code class="language-plaintext">P ---- 1 ---- Q
|  \\          |
4      5      2
|          \\  |
S ---- 3 ---- R</code></pre>
<pre><code class="language-java">public class SpanningTrees {
    static char[] v = {'P', 'Q', 'R', 'S'};
    // {end, end, weight}: P-Q 1, Q-R 2, R-S 3, S-P 4, P-R 5
    static int[][] e = {{0, 1, 1}, {1, 2, 2}, {2, 3, 3}, {3, 0, 4}, {0, 2, 5}};
    static int[] parent = new int[4];

    static int find(int x) {                  // root of x's group
        while (parent[x] != x) x = parent[x];
        return x;
    }

    public static void main(String[] args) {
        int n = v.length, m = e.length, trees = 0, best = Integer.MAX_VALUE;
        String bestTree = "";
        for (int mask = 0; mask &lt; (1 &lt;&lt; m); mask++) {           // every subset of the 5 edges
            if (Integer.bitCount(mask) != n - 1) continue;       // a spanning tree has exactly n-1 edges
            for (int i = 0; i &lt; n; i++) parent[i] = i;
            boolean cycle = false;
            int w = 0;
            StringBuilder s = new StringBuilder();
            for (int k = 0; k &lt; m; k++) {
                if ((mask &gt;&gt; k &amp; 1) == 0) continue;
                int ru = find(e[k][0]), rv = find(e[k][1]);
                if (ru == rv) cycle = true;                      // both ends already joined
                else parent[ru] = rv;
                w += e[k][2];
                s.append(v[e[k][0]]).append(v[e[k][1]]).append(' ');
            }
            if (cycle) {
                System.out.println("    " + s + "-&gt; has a cycle: not a tree");
                continue;
            }
            trees++;
            System.out.println("T" + trees + ": " + s + "-&gt; weight " + w);
            if (w &lt; best) { best = w; bestTree = "T" + trees; }
        }
        System.out.println(trees + " spanning trees; minimum = " + bestTree + " with weight " + best);
    }
}</code></pre>
<div class="out">T1: PQ QR RS -&gt; weight 6<br>
T2: PQ QR SP -&gt; weight 7<br>
T3: PQ RS SP -&gt; weight 8<br>
T4: QR RS SP -&gt; weight 9<br>
&nbsp;&nbsp;&nbsp;&nbsp;PQ QR PR -&gt; has a cycle: not a tree<br>
T5: PQ RS PR -&gt; weight 9<br>
T6: QR RS PR -&gt; weight 10<br>
T7: PQ SP PR -&gt; weight 10<br>
T8: QR SP PR -&gt; weight 11<br>
&nbsp;&nbsp;&nbsp;&nbsp;RS SP PR -&gt; has a cycle: not a tree<br>
8 spanning trees; minimum = T1 with weight 6</div>
<ul>
<li>With n = 4 vertices a spanning tree needs n − 1 = 3 edges. Of the C(5,3) = 10 ways to pick 3 edges, 2 close a cycle (P-Q-R and P-R-S), so the graph has 8 spanning trees; the cheapest, T1, is its MST.</li>
<li>Three facts to know: a tree with n vertices has n − 1 edges; removing any edge of a tree disconnects it; adding any edge to it creates exactly one cycle.</li>
<li>This tree has no root, unlike the rooted trees of chapter 4 — 5A-Graphs1 (slide 11) points this out too.</li>
</ul>
<p><strong>Big-O:</strong> listing all spanning trees does not scale — the complete graph K<sub>n</sub> has n<sup>n−2</sup> of them (Cayley's formula), already 10<sup>8</sup> for 10 vertices. That is why the next slides use greedy algorithms that build the MST directly.</p>
<div class="pitfall">"n − 1 edges" alone does not make a spanning tree: PQ QR PR has 3 edges, yet it closes a cycle and leaves S out. A spanning tree = n − 1 edges <em>and</em> no cycle (equivalently: n − 1 edges and connected).</div>`,
        `<p class="y-chinh">🎯 Cây (tree) là đồ thị vô hướng, liên thông, không có chu trình đơn (simple cycle); cây khung (spanning tree) là cây chứa tất cả các đỉnh của đồ thị ban đầu — và một đồ thị thường có rất nhiều cây khung.</p>
<p>Slide minh hoạ bằng hình: một đồ thị các đường bay giữa bảy thành phố, và hai cây khung của nó. Cùng ý đó trên một đồ thị nhỏ (ví dụ của bài), nhỏ đến mức chương trình liệt kê được <em>mọi</em> cây khung:</p>
<pre><code class="language-plaintext">P ---- 1 ---- Q
|  \\          |
4      5      2
|          \\  |
S ---- 3 ---- R</code></pre>
<pre><code class="language-java">public class SpanningTrees {
    static char[] v = {'P', 'Q', 'R', 'S'};
    // {đầu, đầu, trọng số}: P-Q 1, Q-R 2, R-S 3, S-P 4, P-R 5
    static int[][] e = {{0, 1, 1}, {1, 2, 2}, {2, 3, 3}, {3, 0, 4}, {0, 2, 5}};
    static int[] parent = new int[4];

    static int find(int x) {                  // gốc của nhóm chứa x
        while (parent[x] != x) x = parent[x];
        return x;
    }

    public static void main(String[] args) {
        int n = v.length, m = e.length, trees = 0, best = Integer.MAX_VALUE;
        String bestTree = "";
        for (int mask = 0; mask &lt; (1 &lt;&lt; m); mask++) {           // mọi tập con của 5 cạnh
            if (Integer.bitCount(mask) != n - 1) continue;       // cây khung có đúng n-1 cạnh
            for (int i = 0; i &lt; n; i++) parent[i] = i;
            boolean cycle = false;
            int w = 0;
            StringBuilder s = new StringBuilder();
            for (int k = 0; k &lt; m; k++) {
                if ((mask &gt;&gt; k &amp; 1) == 0) continue;
                int ru = find(e[k][0]), rv = find(e[k][1]);
                if (ru == rv) cycle = true;                      // hai đầu đã nối với nhau rồi
                else parent[ru] = rv;
                w += e[k][2];
                s.append(v[e[k][0]]).append(v[e[k][1]]).append(' ');
            }
            if (cycle) {
                System.out.println("    " + s + "-&gt; has a cycle: not a tree");
                continue;
            }
            trees++;
            System.out.println("T" + trees + ": " + s + "-&gt; weight " + w);
            if (w &lt; best) { best = w; bestTree = "T" + trees; }
        }
        System.out.println(trees + " spanning trees; minimum = " + bestTree + " with weight " + best);
    }
}</code></pre>
<div class="out">T1: PQ QR RS -&gt; weight 6<br>
T2: PQ QR SP -&gt; weight 7<br>
T3: PQ RS SP -&gt; weight 8<br>
T4: QR RS SP -&gt; weight 9<br>
&nbsp;&nbsp;&nbsp;&nbsp;PQ QR PR -&gt; has a cycle: not a tree<br>
T5: PQ RS PR -&gt; weight 9<br>
T6: QR RS PR -&gt; weight 10<br>
T7: PQ SP PR -&gt; weight 10<br>
T8: QR SP PR -&gt; weight 11<br>
&nbsp;&nbsp;&nbsp;&nbsp;RS SP PR -&gt; has a cycle: not a tree<br>
8 spanning trees; minimum = T1 with weight 6</div>
<ul>
<li>Với n = 4 đỉnh, cây khung cần n − 1 = 3 cạnh. Trong C(5,3) = 10 cách chọn 3 cạnh, có 2 cách khép thành chu trình (P-Q-R và P-R-S), nên đồ thị có 8 cây khung; cây rẻ nhất, T1, là MST (cây khung nhỏ nhất) của nó.</li>
<li>Ba tính chất cần thuộc: cây n đỉnh có n − 1 cạnh; bỏ bất kỳ cạnh nào của cây thì cây bị tách rời; thêm bất kỳ cạnh nào vào cây thì tạo ra đúng một chu trình.</li>
<li>Cây ở đây không có gốc (root), khác với cây có gốc của chương 4 — bộ 5A-Graphs1 (slide 11) cũng lưu ý điều này.</li>
</ul>
<p><strong>Big-O:</strong> liệt kê mọi cây khung thì không chạy nổi khi đồ thị lớn — đồ thị đầy đủ (complete graph) K<sub>n</sub> có n<sup>n−2</sup> cây khung (công thức Cayley), đã là 10<sup>8</sup> với 10 đỉnh. Vì vậy các slide sau dùng thuật toán tham lam (greedy) để dựng thẳng MST.</p>
<div class="pitfall">Chỉ "có n − 1 cạnh" thì chưa đủ là cây khung: PQ QR PR có 3 cạnh nhưng khép thành chu trình và bỏ sót S. Cây khung = n − 1 cạnh <em>và</em> không có chu trình (tương đương: n − 1 cạnh và liên thông).</div>`],
      [6, 'Spanning Tree Application',
        `<p class="y-chinh">🎯 MSTs answer "connect everything at the lowest total cost" questions — cable, pipes, roads, networks — and the deck solves them with two algorithms: Prim-Jarník and Kruskal.</p>
<ul>
<li><strong>The slide's example</strong>: running cable to nodes that represent cities while minimising the cable cost — the MST is the viable option.</li>
<li><strong>Same shape, other domains</strong>: vertices = sites, edge weight = cost of linking two sites. Power lines between substations, water pipes between buildings, fibre between towns, roads that connect villages.</li>
<li>The key word in the slide's "shortest total connections" is <em>total</em>: an MST does not promise a short route between any particular pair of vertices.</li>
</ul>
<p class="nhan">MST ≠ shortest paths — on the office graph of slide 3</p>
<table>
<thead><tr><th>From A to E</th><th>Route</th><th>Length</th></tr></thead>
<tbody>
<tr><td>inside the MST (A-D, D-B, B-E)</td><td>A → D → B → E</td><td>2 + 4 + 5 = 11</td></tr>
<tr><td>shortest path in the graph (Dijkstra)</td><td>A → D → E</td><td>2 + 8 = 10</td></tr>
</tbody>
</table>
<div class="pitfall">Do not answer a routing question ("fastest way from A to E") with an MST, and do not answer a wiring question ("cheapest way to connect all sites") with Dijkstra. The MST minimises the sum of all chosen edges; Dijkstra minimises the distance from one source to each vertex.</div>`,
        `<p class="y-chinh">🎯 MST (cây khung nhỏ nhất) trả lời các câu hỏi dạng "nối hết mọi nơi với tổng chi phí thấp nhất" — cáp, ống nước, đường sá, mạng máy tính — và bộ slide giải bằng hai thuật toán: Prim-Jarník và Kruskal.</p>
<ul>
<li><strong>Ví dụ của slide</strong>: kéo cáp tới các nút đại diện cho thành phố sao cho chi phí cáp nhỏ nhất — MST là lựa chọn phù hợp.</li>
<li><strong>Cùng một dạng, nhiều lĩnh vực</strong>: đỉnh = các địa điểm, trọng số cạnh = chi phí nối hai địa điểm. Đường dây điện giữa các trạm biến áp, ống nước giữa các toà nhà, cáp quang giữa các thị trấn, đường nối các làng.</li>
<li>Trong cụm "shortest total connections" (tổng kết nối ngắn nhất) của slide, từ khoá là <em>tổng</em>: MST không hứa đường đi giữa một cặp đỉnh cụ thể nào là ngắn.</li>
</ul>
<p class="nhan">MST ≠ đường đi ngắn nhất — trên đồ thị văn phòng của slide 3</p>
<table>
<thead><tr><th>Từ A tới E</th><th>Lộ trình</th><th>Độ dài</th></tr></thead>
<tbody>
<tr><td>đi trong MST (A-D, D-B, B-E)</td><td>A → D → B → E</td><td>2 + 4 + 5 = 11</td></tr>
<tr><td>đường đi ngắn nhất trong đồ thị (Dijkstra)</td><td>A → D → E</td><td>2 + 8 = 10</td></tr>
</tbody>
</table>
<div class="pitfall">Đừng trả lời câu hỏi tìm đường ("đi từ A tới E nhanh nhất") bằng MST, và đừng trả lời câu hỏi đi dây ("nối mọi điểm rẻ nhất") bằng Dijkstra. MST làm nhỏ nhất tổng mọi cạnh được chọn; Dijkstra làm nhỏ nhất khoảng cách từ một đỉnh nguồn (source) tới từng đỉnh.</div>`],
      [7, 'MST algorithms',
        `<p class="y-chinh">🎯 Prim-Jarník and Kruskal are both greedy: each step makes the cheapest choice available and never undoes it — Prim grows one tree from a root, Kruskal grows clusters by taking edges in nondecreasing order of weight.</p>
<ul>
<li><strong>Greedy method</strong> (slide): repeatedly pick the object that minimises some cost function and join it to a growing collection.</li>
<li><strong>Prim-Jarník</strong>: grows the MST from a single root vertex, "much in the same way as Dijkstra's shortest-path algorithm" — one cloud of vertices that gets bigger.</li>
<li><strong>Kruskal</strong>: grows the MST in <em>clusters</em> — several small trees (a forest) that merge — by considering edges in nondecreasing order of weight. The slide's "ondecreasing" is a typo for "nondecreasing": light to heavy, ties allowed.</li>
<li><strong>Assumption</strong>: G is undirected and simple — no self-loops, no parallel edges — so an edge is an unordered pair (u,v). A loop can never be part of a tree, and of several parallel edges only the lightest could ever be chosen.</li>
</ul>
<table>
<thead><tr><th>Algorithm</th><th>Greedy choice at each step</th><th>What grows</th></tr></thead>
<tbody>
<tr><td>Dijkstra (5A-Graphs1)</td><td>the vertex closest to the <em>source</em></td><td>one cloud around the source</td></tr>
<tr><td>Prim-Jarník</td><td>the cheapest edge leaving the <em>tree</em></td><td>one tree from a root</td></tr>
<tr><td>Kruskal</td><td>the cheapest edge <em>anywhere</em> that closes no cycle</td><td>a forest of clusters that merge</td></tr>
</tbody>
</table>
<p><strong>Why greedy is right here (the cut property):</strong> split the vertices into any two groups; the cheapest edge crossing between the groups belongs to some MST. Prim uses the split "tree / the rest", Kruskal the split "one cluster / the rest" — so every edge they take is safe.</p>
<div class="pitfall">Greedy is not always optimal. For the MST it is proven correct; for graph colouring (slides 27–28) the greedy method only gives an upper bound, and the result depends on the order.</div>`,
        `<p class="y-chinh">🎯 Prim-Jarník và Kruskal đều là thuật toán tham lam (greedy): mỗi bước chọn phương án rẻ nhất đang có và không bao giờ quay lại sửa — Prim nuôi một cây từ một gốc, Kruskal nuôi nhiều cụm bằng cách xét các cạnh theo thứ tự trọng số không giảm.</p>
<ul>
<li><strong>Phương pháp tham lam (greedy method)</strong> (slide): lặp lại việc chọn đối tượng làm hàm chi phí nhỏ nhất rồi ghép nó vào tập đang lớn dần.</li>
<li><strong>Prim-Jarník</strong>: nuôi MST (cây khung nhỏ nhất) từ một đỉnh gốc (root) duy nhất, "rất giống thuật toán đường đi ngắn nhất của Dijkstra" — một đám đỉnh (cloud) cứ thế to dần.</li>
<li><strong>Kruskal</strong>: nuôi MST theo <em>cụm</em> (cluster) — nhiều cây nhỏ (một rừng — forest) dần gộp lại — bằng cách xét các cạnh theo thứ tự trọng số không giảm. Chữ "ondecreasing" trên slide là gõ nhầm của "nondecreasing": từ nhẹ tới nặng, cho phép bằng nhau.</li>
<li><strong>Giả thiết</strong>: G vô hướng và đơn (simple) — không có khuyên (self-loop), không có cạnh song song (parallel edge) — nên mỗi cạnh là một cặp không thứ tự (u,v). Khuyên không bao giờ nằm trong cây được, còn trong các cạnh song song chỉ cạnh nhẹ nhất mới có thể được chọn.</li>
</ul>
<table>
<thead><tr><th>Thuật toán</th><th>Lựa chọn tham lam ở mỗi bước</th><th>Cái lớn dần</th></tr></thead>
<tbody>
<tr><td>Dijkstra (5A-Graphs1)</td><td>đỉnh gần <em>nguồn</em> (source) nhất</td><td>một đám đỉnh quanh nguồn</td></tr>
<tr><td>Prim-Jarník</td><td>cạnh rẻ nhất đi ra khỏi <em>cây</em></td><td>một cây từ gốc</td></tr>
<tr><td>Kruskal</td><td>cạnh rẻ nhất <em>ở bất cứ đâu</em> mà không khép chu trình</td><td>một rừng các cụm dần gộp lại</td></tr>
</tbody>
</table>
<p><strong>Vì sao tham lam lại đúng ở đây (tính chất lát cắt — cut property):</strong> chia tập đỉnh thành hai nhóm bất kỳ; cạnh rẻ nhất nối giữa hai nhóm luôn thuộc một MST nào đó. Prim dùng lát cắt "cây / phần còn lại", Kruskal dùng lát cắt "một cụm / phần còn lại" — nên cạnh nào chúng lấy cũng an toàn.</p>
<div class="pitfall">Tham lam không phải lúc nào cũng tối ưu. Với MST nó đã được chứng minh là đúng; với tô màu đồ thị (graph coloring, slide 27–28) cách tham lam chỉ cho một cận trên, và kết quả phụ thuộc vào thứ tự xét đỉnh.</div>`],
      [8, 'MST Prim-Jarnik Algorithm',
        `<p class="y-chinh">🎯 Prim-Jarník in three steps: start the tree with one vertex, repeatedly move the cheapest edge that joins the tree to a vertex outside it into the tree, stop when every vertex is in.</p>
<ol>
<li>Initialize a tree with a single vertex, chosen arbitrarily (here A, index 0).</li>
<li>Among the edges that connect the tree to vertices not yet in the tree, find the minimum-weight edge and transfer it to the tree.</li>
<li>Repeat step 2 until all vertices are in the tree — n − 1 edges for n vertices.</li>
</ol>
<p>The program is the PE-style version on an adjacency matrix: <code>d[i]</code> holds the weight of the cheapest edge joining vertex i to the tree, <code>p[i]</code> the tree end of that edge. After each step it prints d[i](p[i]) for the vertices still outside the tree that already touch it.</p>
<pre><code class="language-java">public class Prim {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
        int[][] a = {                          // 0 = no cable between the two computers
            {0, 6, 0, 2, 0, 0, 0},
            {6, 0, 3, 4, 5, 0, 0},
            {0, 3, 0, 0, 0, 7, 0},
            {2, 4, 0, 0, 8, 0, 9},
            {0, 5, 0, 8, 0, 1, 11},
            {0, 0, 7, 0, 1, 0, 10},
            {0, 0, 0, 9, 11, 10, 0}};
        int n = v.length;
        final int INF = 999;
        boolean[] inTree = new boolean[n];
        int[] d = new int[n];                  // d[i] = cheapest edge joining i to the tree
        int[] p = new int[n];                  // p[i] = tree end of that edge
        for (int i = 0; i &lt; n; i++) { d[i] = INF; p[i] = -1; }
        d[0] = 0;                              // step 1: the tree starts as vertex A alone
        int total = 0;
        for (int step = 1; step &lt;= n; step++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++)        // step 2: cheapest vertex outside the tree
                if (!inTree[i] &amp;&amp; (u == -1 || d[i] &lt; d[u])) u = i;
            inTree[u] = true;
            total += d[u];
            for (int w = 0; w &lt; n; w++)        // edges from the new vertex may be cheaper
                if (a[u][w] &gt; 0 &amp;&amp; !inTree[w] &amp;&amp; a[u][w] &lt; d[w]) { d[w] = a[u][w]; p[w] = u; }
            String what = p[u] == -1 ? "start at " + v[u]
                    : "add " + v[u] + " by " + v[p[u]] + "-" + v[u] + " (" + d[u] + "), total " + total;
            String s = "";                     // d[i](p[i]) of the vertices still outside
            for (int i = 0; i &lt; n; i++)
                if (!inTree[i] &amp;&amp; d[i] &lt; INF) s += " " + v[i] + "=" + d[i] + "(" + v[p[i]] + ")";
            System.out.printf("step %d: %-28s d:%s%n", step, what, s.isEmpty() ? " (every vertex is in the tree)" : s);
        }
        System.out.println("MST weight = " + total);
    }
}</code></pre>
<div class="out">step 1: start at A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d: B=6(A) D=2(A)<br>
step 2: add D by A-D (2), total 2 &nbsp;&nbsp;&nbsp;d: B=4(D) E=8(D) G=9(D)<br>
step 3: add B by D-B (4), total 6 &nbsp;&nbsp;&nbsp;d: C=3(B) E=5(B) G=9(D)<br>
step 4: add C by B-C (3), total 9 &nbsp;&nbsp;&nbsp;d: E=5(B) F=7(C) G=9(D)<br>
step 5: add E by B-E (5), total 14 &nbsp;&nbsp;d: F=1(E) G=9(D)<br>
step 6: add F by E-F (1), total 15 &nbsp;&nbsp;d: G=9(D)<br>
step 7: add G by D-G (9), total 24 &nbsp;&nbsp;d: (every vertex is in the tree)<br>
MST weight = 24</div>
<p class="nhan">The same arrays as a table (✓ = in the tree, ∞ = no edge to the tree yet, other cells = d[i] (p[i])) — compare with the "d:" part of each output line</p>
<table>
<thead><tr><th>Step, vertex added</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th></tr></thead>
<tbody>
<tr><td>1, A (start)</td><td>✓</td><td>6 (A)</td><td>∞</td><td>2 (A)</td><td>∞</td><td>∞</td><td>∞</td></tr>
<tr><td>2, D by A-D 2</td><td>✓</td><td>4 (D)</td><td>∞</td><td>✓</td><td>8 (D)</td><td>∞</td><td>9 (D)</td></tr>
<tr><td>3, B by D-B 4</td><td>✓</td><td>✓</td><td>3 (B)</td><td>✓</td><td>5 (B)</td><td>∞</td><td>9 (D)</td></tr>
<tr><td>4, C by B-C 3</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>5 (B)</td><td>7 (C)</td><td>9 (D)</td></tr>
<tr><td>5, E by B-E 5</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>1 (E)</td><td>9 (D)</td></tr>
<tr><td>6, F by E-F 1</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>9 (D)</td></tr>
<tr><td>7, G by D-G 9</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> n rounds; each round scans all n vertices for the smallest d and one matrix row of n entries to update d → O(n²) = O(|V|²). Slide 9 shows the heap version, O(|E| log |V|).</p>
<div class="pitfall">In the matrix, 0 means "no edge". Updating with <code>if (a[u][w] &lt; d[w])</code> but without <code>a[u][w] &gt; 0</code> sets d[w] = 0 for non-neighbours and builds a wrong tree. Also skip vertices already in the tree (<code>!inTree[w]</code>), or a vertex can be added twice.</div>`,
        `<p class="y-chinh">🎯 Prim-Jarník gồm ba bước: khởi tạo cây bằng một đỉnh, lặp lại việc chuyển cạnh rẻ nhất nối cây với một đỉnh ngoài cây vào cây, dừng khi mọi đỉnh đã vào cây.</p>
<ol>
<li>Khởi tạo cây gồm một đỉnh chọn tuỳ ý (ở đây là A, chỉ số 0).</li>
<li>Trong các cạnh nối cây với những đỉnh chưa thuộc cây, tìm cạnh có trọng số nhỏ nhất và chuyển nó vào cây.</li>
<li>Lặp lại bước 2 tới khi mọi đỉnh đều trong cây — n − 1 cạnh cho n đỉnh.</li>
</ol>
<p>Chương trình là bản kiểu PE (thi thực hành) trên ma trận kề (adjacency matrix): <code>d[i]</code> giữ trọng số của cạnh rẻ nhất nối đỉnh i vào cây, <code>p[i]</code> là đầu nằm trong cây của cạnh đó. Sau mỗi bước, nó in d[i](p[i]) của các đỉnh còn ở ngoài cây mà đã có cạnh chạm tới cây.</p>
<pre><code class="language-java">public class Prim {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
        int[][] a = {                          // 0 = không có cáp giữa hai máy
            {0, 6, 0, 2, 0, 0, 0},
            {6, 0, 3, 4, 5, 0, 0},
            {0, 3, 0, 0, 0, 7, 0},
            {2, 4, 0, 0, 8, 0, 9},
            {0, 5, 0, 8, 0, 1, 11},
            {0, 0, 7, 0, 1, 0, 10},
            {0, 0, 0, 9, 11, 10, 0}};
        int n = v.length;
        final int INF = 999;
        boolean[] inTree = new boolean[n];
        int[] d = new int[n];                  // d[i] = cạnh rẻ nhất nối i vào cây
        int[] p = new int[n];                  // p[i] = đầu nằm trong cây của cạnh đó
        for (int i = 0; i &lt; n; i++) { d[i] = INF; p[i] = -1; }
        d[0] = 0;                              // bước 1: cây ban đầu chỉ có đỉnh A
        int total = 0;
        for (int step = 1; step &lt;= n; step++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++)        // bước 2: đỉnh ngoài cây có cạnh nối rẻ nhất
                if (!inTree[i] &amp;&amp; (u == -1 || d[i] &lt; d[u])) u = i;
            inTree[u] = true;
            total += d[u];
            for (int w = 0; w &lt; n; w++)        // cạnh đi ra từ đỉnh mới có thể rẻ hơn
                if (a[u][w] &gt; 0 &amp;&amp; !inTree[w] &amp;&amp; a[u][w] &lt; d[w]) { d[w] = a[u][w]; p[w] = u; }
            String what = p[u] == -1 ? "start at " + v[u]
                    : "add " + v[u] + " by " + v[p[u]] + "-" + v[u] + " (" + d[u] + "), total " + total;
            String s = "";                     // d[i](p[i]) của các đỉnh còn ở ngoài cây
            for (int i = 0; i &lt; n; i++)
                if (!inTree[i] &amp;&amp; d[i] &lt; INF) s += " " + v[i] + "=" + d[i] + "(" + v[p[i]] + ")";
            System.out.printf("step %d: %-28s d:%s%n", step, what, s.isEmpty() ? " (every vertex is in the tree)" : s);
        }
        System.out.println("MST weight = " + total);
    }
}</code></pre>
<div class="out">step 1: start at A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d: B=6(A) D=2(A)<br>
step 2: add D by A-D (2), total 2 &nbsp;&nbsp;&nbsp;d: B=4(D) E=8(D) G=9(D)<br>
step 3: add B by D-B (4), total 6 &nbsp;&nbsp;&nbsp;d: C=3(B) E=5(B) G=9(D)<br>
step 4: add C by B-C (3), total 9 &nbsp;&nbsp;&nbsp;d: E=5(B) F=7(C) G=9(D)<br>
step 5: add E by B-E (5), total 14 &nbsp;&nbsp;d: F=1(E) G=9(D)<br>
step 6: add F by E-F (1), total 15 &nbsp;&nbsp;d: G=9(D)<br>
step 7: add G by D-G (9), total 24 &nbsp;&nbsp;d: (every vertex is in the tree)<br>
MST weight = 24</div>
<p class="nhan">Cũng hai mảng đó dưới dạng bảng (✓ = đã trong cây, ∞ = chưa có cạnh nối tới cây, các ô khác = d[i] (p[i])) — so với phần "d:" trên mỗi dòng output</p>
<table>
<thead><tr><th>Bước, đỉnh được thêm</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th></tr></thead>
<tbody>
<tr><td>1, A (xuất phát)</td><td>✓</td><td>6 (A)</td><td>∞</td><td>2 (A)</td><td>∞</td><td>∞</td><td>∞</td></tr>
<tr><td>2, D qua A-D 2</td><td>✓</td><td>4 (D)</td><td>∞</td><td>✓</td><td>8 (D)</td><td>∞</td><td>9 (D)</td></tr>
<tr><td>3, B qua D-B 4</td><td>✓</td><td>✓</td><td>3 (B)</td><td>✓</td><td>5 (B)</td><td>∞</td><td>9 (D)</td></tr>
<tr><td>4, C qua B-C 3</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>5 (B)</td><td>7 (C)</td><td>9 (D)</td></tr>
<tr><td>5, E qua B-E 5</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>1 (E)</td><td>9 (D)</td></tr>
<tr><td>6, F qua E-F 1</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>9 (D)</td></tr>
<tr><td>7, G qua D-G 9</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> n vòng; mỗi vòng quét n đỉnh để tìm d nhỏ nhất và quét một hàng ma trận gồm n ô để cập nhật d → O(n²) = O(|V|²). Slide 9 có bản dùng heap (đống), O(|E| log |V|).</p>
<div class="pitfall">Trong ma trận, 0 nghĩa là "không có cạnh". Cập nhật bằng <code>if (a[u][w] &lt; d[w])</code> mà thiếu <code>a[u][w] &gt; 0</code> sẽ gán d[w] = 0 cho các đỉnh không kề và dựng ra cây sai. Cũng phải bỏ qua đỉnh đã nằm trong cây (<code>!inTree[w]</code>), nếu không một đỉnh có thể bị thêm hai lần.</div>`],
      [9, 'Prim-Jarnik Algorithm demo',
        `<p class="y-chinh">🎯 Prim's demo is read as a sequence of vertices: each step adds exactly one new vertex — the one reached by the cheapest edge that leaves the current tree.</p>
<p>The slide shows its demo as a picture — graph (a) and the spanning tree Prim builds from vertex 0 — and the text gives the order in which the vertices are selected: <strong>0, 1, 7, 6, 5, 2, 8, 3, 9</strong>. Compare the picture with the method below, done on the office graph of slide 3 (the lesson's own example):</p>
<table>
<thead><tr><th>Edge #</th><th>Tree before the step</th><th>Edges leaving the tree (candidates)</th><th>Chosen</th><th>Total</th></tr></thead>
<tbody>
<tr><td>1</td><td>{A}</td><td>A-B 6, A-D 2</td><td>A-D 2</td><td>2</td></tr>
<tr><td>2</td><td>{A, D}</td><td>A-B 6, D-B 4, D-E 8, D-G 9</td><td>D-B 4</td><td>6</td></tr>
<tr><td>3</td><td>{A, B, D}</td><td>B-C 3, B-E 5, D-E 8, D-G 9</td><td>B-C 3</td><td>9</td></tr>
<tr><td>4</td><td>{A, B, C, D}</td><td>B-E 5, C-F 7, D-E 8, D-G 9</td><td>B-E 5</td><td>14</td></tr>
<tr><td>5</td><td>{A, B, C, D, E}</td><td>E-F 1, C-F 7, D-G 9, E-G 11</td><td>E-F 1</td><td>15</td></tr>
<tr><td>6</td><td>{A, B, C, D, E, F}</td><td>D-G 9, F-G 10, E-G 11</td><td>D-G 9</td><td>24</td></tr>
</tbody>
</table>
<p>Order of the vertices: A, D, B, C, E, F, G. Goodrich §14.7.1 uses a priority queue instead of scanning an array. The simplest Java version is a <code>PriorityQueue</code> of edges that skips "stale" edges whose far end is already in the tree; the order is the same:</p>
<pre><code class="language-java">import java.util.PriorityQueue;

public class PrimPQ {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
    static int[][] a = {
        {0, 6, 0, 2, 0, 0, 0},
        {6, 0, 3, 4, 5, 0, 0},
        {0, 3, 0, 0, 0, 7, 0},
        {2, 4, 0, 0, 8, 0, 9},
        {0, 5, 0, 8, 0, 1, 11},
        {0, 0, 7, 0, 1, 0, 10},
        {0, 0, 0, 9, 11, 10, 0}};
    static boolean[] inTree = new boolean[7];
    // min-heap of edges {from, to, weight}, cheapest on top
    static PriorityQueue&lt;int[]&gt; pq = new PriorityQueue&lt;int[]&gt;((x, y) -&gt; x[2] - y[2]);

    static String add(int u) {                // put u in the tree, push its edges that leave the tree
        inTree[u] = true;
        StringBuilder s = new StringBuilder();
        for (int w = 0; w &lt; v.length; w++)
            if (a[u][w] &gt; 0 &amp;&amp; !inTree[w]) {
                pq.add(new int[] {u, w, a[u][w]});
                s.append(' ').append(v[u]).append('-').append(v[w]).append('(').append(a[u][w]).append(')');
            }
        return s.length() == 0 ? "" : ", push" + s;
    }

    public static void main(String[] args) {
        System.out.println("start at A" + add(0));
        int count = 1, total = 0;
        String order = "A";
        while (count &lt; v.length) {
            int[] e = pq.poll();                   // cheapest edge seen so far
            String name = v[e[0]] + "-" + v[e[1]] + "(" + e[2] + ")";
            if (inTree[e[1]]) {                    // both ends inside: stale edge
                System.out.println("pop " + name + ": skip, " + v[e[1]] + " is already in the tree");
                continue;
            }
            total += e[2];
            count++;
            order += " " + v[e[1]];
            System.out.println("pop " + name + ": add " + v[e[1]] + add(e[1]));
        }
        System.out.println("order: " + order + ", MST weight = " + total);
    }
}</code></pre>
<div class="out">start at A, push A-B(6) A-D(2)<br>
pop A-D(2): add D, push D-B(4) D-E(8) D-G(9)<br>
pop D-B(4): add B, push B-C(3) B-E(5)<br>
pop B-C(3): add C, push C-F(7)<br>
pop B-E(5): add E, push E-F(1) E-G(11)<br>
pop E-F(1): add F, push F-G(10)<br>
pop A-B(6): skip, B is already in the tree<br>
pop C-F(7): skip, F is already in the tree<br>
pop D-E(8): skip, E is already in the tree<br>
pop D-G(9): add G<br>
order: A D B C E F G, MST weight = 24</div>
<ul>
<li><strong>Self-check any Prim order</strong>: it starts with the start vertex, contains every vertex exactly once (|V| entries), and each vertex is joined to an <em>earlier</em> one by the cheapest edge leaving the tree at that moment.</li>
<li>The slide's list has 9 entries and the label 4 does not appear in it. Count the vertices of graph (a) on the picture: if (a) has a vertex 4, it must appear somewhere in the order.</li>
<li><strong>Big-O</strong> of the heap version: every edge enters the heap at most once and leaves once, each heap operation O(log |E|) → O(|E| log |E|) = O(|E| log |V|).</li>
</ul>
<div class="pitfall">E-F (1) is the cheapest edge of the whole graph, yet Prim takes it only as its 5th edge, because F is not next to the tree before E joins. An FE option in which Prim "starts with the cheapest edge of the graph" describes Kruskal, not Prim.</div>`,
        `<p class="y-chinh">🎯 Phần minh hoạ (demo) của Prim được đọc như một dãy đỉnh: mỗi bước thêm đúng một đỉnh mới — đỉnh được nối bằng cạnh rẻ nhất đi ra khỏi cây hiện tại.</p>
<p>Slide trình bày demo bằng hình — đồ thị (a) và cây khung Prim dựng từ đỉnh 0 — còn phần chữ cho thứ tự các đỉnh được chọn: <strong>0, 1, 7, 6, 5, 2, 8, 3, 9</strong>. Hãy đối chiếu hình với cách làm dưới đây, thực hiện trên đồ thị văn phòng của slide 3 (ví dụ của bài):</p>
<table>
<thead><tr><th>Cạnh thứ</th><th>Cây trước bước</th><th>Các cạnh đi ra khỏi cây (ứng viên)</th><th>Được chọn</th><th>Tổng</th></tr></thead>
<tbody>
<tr><td>1</td><td>{A}</td><td>A-B 6, A-D 2</td><td>A-D 2</td><td>2</td></tr>
<tr><td>2</td><td>{A, D}</td><td>A-B 6, D-B 4, D-E 8, D-G 9</td><td>D-B 4</td><td>6</td></tr>
<tr><td>3</td><td>{A, B, D}</td><td>B-C 3, B-E 5, D-E 8, D-G 9</td><td>B-C 3</td><td>9</td></tr>
<tr><td>4</td><td>{A, B, C, D}</td><td>B-E 5, C-F 7, D-E 8, D-G 9</td><td>B-E 5</td><td>14</td></tr>
<tr><td>5</td><td>{A, B, C, D, E}</td><td>E-F 1, C-F 7, D-G 9, E-G 11</td><td>E-F 1</td><td>15</td></tr>
<tr><td>6</td><td>{A, B, C, D, E, F}</td><td>D-G 9, F-G 10, E-G 11</td><td>D-G 9</td><td>24</td></tr>
</tbody>
</table>
<p>Thứ tự các đỉnh: A, D, B, C, E, F, G. Sách Goodrich §14.7.1 dùng hàng đợi ưu tiên (priority queue) thay cho việc quét mảng. Cách viết đơn giản nhất trong Java là một <code>PriorityQueue</code> chứa các cạnh, gặp cạnh "cũ" (đầu kia đã nằm trong cây) thì bỏ qua; thứ tự ra vẫn y hệt:</p>
<pre><code class="language-java">import java.util.PriorityQueue;

public class PrimPQ {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
    static int[][] a = {
        {0, 6, 0, 2, 0, 0, 0},
        {6, 0, 3, 4, 5, 0, 0},
        {0, 3, 0, 0, 0, 7, 0},
        {2, 4, 0, 0, 8, 0, 9},
        {0, 5, 0, 8, 0, 1, 11},
        {0, 0, 7, 0, 1, 0, 10},
        {0, 0, 0, 9, 11, 10, 0}};
    static boolean[] inTree = new boolean[7];
    // heap nhỏ nhất chứa cạnh {từ, tới, trọng số}, rẻ nhất ở đỉnh heap
    static PriorityQueue&lt;int[]&gt; pq = new PriorityQueue&lt;int[]&gt;((x, y) -&gt; x[2] - y[2]);

    static String add(int u) {                // đưa u vào cây, đẩy các cạnh của nó đi ra ngoài cây
        inTree[u] = true;
        StringBuilder s = new StringBuilder();
        for (int w = 0; w &lt; v.length; w++)
            if (a[u][w] &gt; 0 &amp;&amp; !inTree[w]) {
                pq.add(new int[] {u, w, a[u][w]});
                s.append(' ').append(v[u]).append('-').append(v[w]).append('(').append(a[u][w]).append(')');
            }
        return s.length() == 0 ? "" : ", push" + s;
    }

    public static void main(String[] args) {
        System.out.println("start at A" + add(0));
        int count = 1, total = 0;
        String order = "A";
        while (count &lt; v.length) {
            int[] e = pq.poll();                   // cạnh rẻ nhất đang có
            String name = v[e[0]] + "-" + v[e[1]] + "(" + e[2] + ")";
            if (inTree[e[1]]) {                    // cả hai đầu đã trong cây: cạnh cũ, bỏ qua
                System.out.println("pop " + name + ": skip, " + v[e[1]] + " is already in the tree");
                continue;
            }
            total += e[2];
            count++;
            order += " " + v[e[1]];
            System.out.println("pop " + name + ": add " + v[e[1]] + add(e[1]));
        }
        System.out.println("order: " + order + ", MST weight = " + total);
    }
}</code></pre>
<div class="out">start at A, push A-B(6) A-D(2)<br>
pop A-D(2): add D, push D-B(4) D-E(8) D-G(9)<br>
pop D-B(4): add B, push B-C(3) B-E(5)<br>
pop B-C(3): add C, push C-F(7)<br>
pop B-E(5): add E, push E-F(1) E-G(11)<br>
pop E-F(1): add F, push F-G(10)<br>
pop A-B(6): skip, B is already in the tree<br>
pop C-F(7): skip, F is already in the tree<br>
pop D-E(8): skip, E is already in the tree<br>
pop D-G(9): add G<br>
order: A D B C E F G, MST weight = 24</div>
<ul>
<li><strong>Tự kiểm một thứ tự Prim bất kỳ</strong>: dãy bắt đầu bằng đỉnh xuất phát, chứa mọi đỉnh đúng một lần (đủ |V| phần tử), và mỗi đỉnh được nối với một đỉnh đứng <em>trước</em> nó bằng cạnh rẻ nhất đi ra khỏi cây ở thời điểm đó.</li>
<li>Dãy trên slide có 9 phần tử và không có nhãn 4. Hãy đếm số đỉnh của đồ thị (a) trên hình: nếu (a) có đỉnh 4 thì đỉnh đó phải xuất hiện đâu đó trong dãy.</li>
<li><strong>Big-O</strong> của bản heap (đống): mỗi cạnh vào heap nhiều nhất một lần và ra một lần, mỗi thao tác heap tốn O(log |E|) → O(|E| log |E|) = O(|E| log |V|).</li>
</ul>
<div class="pitfall">E-F (1) là cạnh rẻ nhất của cả đồ thị, vậy mà Prim chỉ lấy nó làm cạnh thứ 5, vì trước khi E vào cây thì F chưa kề với cây. Phương án FE (thi cuối kỳ) nói Prim "bắt đầu bằng cạnh rẻ nhất của đồ thị" là đang mô tả Kruskal, không phải Prim.</div>`],
      [10, 'Kruskal Algorithm',
        `<p class="y-chinh">🎯 Kruskal sorts all edges by weight and walks through them from the lightest, adding an edge to the tree only if it forms no cycle with the edges already chosen; it stops at |V| − 1 edges.</p>
<ul>
<li><code>tree = null</code> — start with no edges: every vertex is a cluster of its own.</li>
<li><code>edges</code> = all edges, sorted by weight (nondecreasing).</li>
<li><code>for (i = 1; i &lt;= |E| and |tree| &lt; |V| - 1; i++)</code> — the second condition stops the loop as soon as the tree is complete, so the heaviest edges at the end are never looked at.</li>
<li>"does not form a cycle" ⇔ the two ends of e<sub>i</sub> are in <strong>different</strong> clusters. A union-find structure answers that: <code>find(x)</code> returns the root of x's cluster, and a union hangs one root under the other.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class Kruskal {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
    static int[] parent = new int[7];         // union-find: parent[x] == x means x is a root

    static int find(int x) {                  // root of x's component
        while (parent[x] != x) x = parent[x];
        return x;
    }

    static String components() {              // e.g. {A,D} {B,C} {E,F} {G}
        StringBuilder s = new StringBuilder();
        boolean[] done = new boolean[v.length];
        for (int i = 0; i &lt; v.length; i++) {
            if (done[i]) continue;
            s.append(s.length() == 0 ? "{" : " {");
            for (int j = i; j &lt; v.length; j++)
                if (find(j) == find(i)) {
                    if (j != i) s.append(',');
                    s.append(v[j]);
                    done[j] = true;
                }
            s.append('}');
        }
        return s.toString();
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 6}, {0, 3, 2}, {1, 2, 3}, {1, 3, 4}, {1, 4, 5}, {2, 5, 7},
                         {3, 4, 8}, {3, 6, 9}, {4, 5, 1}, {4, 6, 11}, {5, 6, 10}};
        Arrays.sort(edges, (x, y) -&gt; x[2] - y[2]);      // edges = all edges sorted by weight
        for (int i = 0; i &lt; v.length; i++) parent[i] = i;
        int taken = 0, total = 0;
        for (int i = 0; i &lt; edges.length &amp;&amp; taken &lt; v.length - 1; i++) {   // the slide's loop
            int u = edges[i][0], w = edges[i][1];
            int ru = find(u), rw = find(w);
            String e = v[u] + "-" + v[w] + " (" + edges[i][2] + ")";
            if (ru == rw) {                             // same component: the edge would close a cycle
                System.out.println(e + ": reject, " + v[u] + " and " + v[w] + " are already connected");
            } else {
                parent[ru] = rw;                        // union: merge the two components
                taken++;
                total += edges[i][2];
                System.out.println(e + ": take    " + components());
            }
        }
        System.out.println(taken + " edges = |V| - 1, MST weight = " + total);
    }
}</code></pre>
<div class="out">E-F (1): take &nbsp;&nbsp;&nbsp;{A} {B} {C} {D} {E,F} {G}<br>
A-D (2): take &nbsp;&nbsp;&nbsp;{A,D} {B} {C} {E,F} {G}<br>
B-C (3): take &nbsp;&nbsp;&nbsp;{A,D} {B,C} {E,F} {G}<br>
B-D (4): take &nbsp;&nbsp;&nbsp;{A,B,C,D} {E,F} {G}<br>
B-E (5): take &nbsp;&nbsp;&nbsp;{A,B,C,D,E,F} {G}<br>
A-B (6): reject, A and B are already connected<br>
C-F (7): reject, C and F are already connected<br>
D-E (8): reject, D and E are already connected<br>
D-G (9): take &nbsp;&nbsp;&nbsp;{A,B,C,D,E,F,G}<br>
6 edges = |V| - 1, MST weight = 24</div>
<p><strong>Big-O:</strong> sorting |E| edges costs O(|E| log |E|); the loop makes at most 2|E| finds and |V| − 1 unions. With union by size (or rank) and path compression each find is almost O(1), so the sort dominates: O(|E| log |E|) = O(|E| log |V|). The simple <code>find</code> above (no balancing) is fine for exam-size graphs.</p>
<div class="pitfall">Classic mistake: rejecting an edge because "both of its ends are already in the tree". In Kruskal the chosen edges form a <em>forest</em>: B-D (4) is taken although B and D both touch chosen edges, because B's cluster {B,C} and D's cluster {A,D} are different. Reject only when <code>find(u) == find(v)</code>.</div>`,
        `<p class="y-chinh">🎯 Kruskal sắp mọi cạnh theo trọng số rồi duyệt từ cạnh nhẹ nhất, chỉ thêm một cạnh vào cây nếu nó không tạo chu trình với các cạnh đã chọn; dừng khi đủ |V| − 1 cạnh.</p>
<ul>
<li><code>tree = null</code> — bắt đầu chưa có cạnh nào: mỗi đỉnh là một cụm (cluster) riêng.</li>
<li><code>edges</code> = mọi cạnh, đã sắp theo trọng số không giảm.</li>
<li><code>for (i = 1; i &lt;= |E| and |tree| &lt; |V| - 1; i++)</code> — điều kiện thứ hai dừng vòng lặp ngay khi cây đã đủ cạnh, nên các cạnh nặng nhất ở cuối không bao giờ bị xét tới.</li>
<li>"không tạo chu trình" ⇔ hai đầu của e<sub>i</sub> nằm ở hai cụm <strong>khác nhau</strong>. Cấu trúc hợp–tìm (union-find) trả lời câu này: <code>find(x)</code> trả về gốc của cụm chứa x, còn phép hợp (union) treo gốc này vào dưới gốc kia.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class Kruskal {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
    static int[] parent = new int[7];         // union-find: parent[x] == x nghĩa là x là gốc

    static int find(int x) {                  // gốc của thành phần chứa x
        while (parent[x] != x) x = parent[x];
        return x;
    }

    static String components() {              // ví dụ {A,D} {B,C} {E,F} {G}
        StringBuilder s = new StringBuilder();
        boolean[] done = new boolean[v.length];
        for (int i = 0; i &lt; v.length; i++) {
            if (done[i]) continue;
            s.append(s.length() == 0 ? "{" : " {");
            for (int j = i; j &lt; v.length; j++)
                if (find(j) == find(i)) {
                    if (j != i) s.append(',');
                    s.append(v[j]);
                    done[j] = true;
                }
            s.append('}');
        }
        return s.toString();
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 6}, {0, 3, 2}, {1, 2, 3}, {1, 3, 4}, {1, 4, 5}, {2, 5, 7},
                         {3, 4, 8}, {3, 6, 9}, {4, 5, 1}, {4, 6, 11}, {5, 6, 10}};
        Arrays.sort(edges, (x, y) -&gt; x[2] - y[2]);      // edges = mọi cạnh đã sắp theo trọng số
        for (int i = 0; i &lt; v.length; i++) parent[i] = i;
        int taken = 0, total = 0;
        for (int i = 0; i &lt; edges.length &amp;&amp; taken &lt; v.length - 1; i++) {   // đúng vòng for của slide
            int u = edges[i][0], w = edges[i][1];
            int ru = find(u), rw = find(w);
            String e = v[u] + "-" + v[w] + " (" + edges[i][2] + ")";
            if (ru == rw) {                             // cùng thành phần: cạnh sẽ khép chu trình
                System.out.println(e + ": reject, " + v[u] + " and " + v[w] + " are already connected");
            } else {
                parent[ru] = rw;                        // hợp: gộp hai thành phần
                taken++;
                total += edges[i][2];
                System.out.println(e + ": take    " + components());
            }
        }
        System.out.println(taken + " edges = |V| - 1, MST weight = " + total);
    }
}</code></pre>
<div class="out">E-F (1): take &nbsp;&nbsp;&nbsp;{A} {B} {C} {D} {E,F} {G}<br>
A-D (2): take &nbsp;&nbsp;&nbsp;{A,D} {B} {C} {E,F} {G}<br>
B-C (3): take &nbsp;&nbsp;&nbsp;{A,D} {B,C} {E,F} {G}<br>
B-D (4): take &nbsp;&nbsp;&nbsp;{A,B,C,D} {E,F} {G}<br>
B-E (5): take &nbsp;&nbsp;&nbsp;{A,B,C,D,E,F} {G}<br>
A-B (6): reject, A and B are already connected<br>
C-F (7): reject, C and F are already connected<br>
D-E (8): reject, D and E are already connected<br>
D-G (9): take &nbsp;&nbsp;&nbsp;{A,B,C,D,E,F,G}<br>
6 edges = |V| - 1, MST weight = 24</div>
<p><strong>Big-O:</strong> sắp xếp |E| cạnh tốn O(|E| log |E|); vòng lặp gọi tối đa 2|E| lần find và |V| − 1 lần union. Có hợp theo kích thước (union by size/rank) và nén đường đi (path compression) thì mỗi lần find gần như O(1), nên phần sắp xếp chiếm chủ yếu: O(|E| log |E|) = O(|E| log |V|). Hàm <code>find</code> đơn giản ở trên (không cân bằng) vẫn đủ dùng cho đồ thị cỡ bài thi.</p>
<div class="pitfall">Lỗi kinh điển: loại một cạnh vì "hai đầu của nó đều đã có trong cây". Với Kruskal, các cạnh đã chọn tạo thành một <em>rừng</em> (forest): B-D (4) vẫn được lấy dù B và D đều đã dính vào cạnh được chọn, vì cụm của B là {B,C} còn cụm của D là {A,D} — hai cụm khác nhau. Chỉ loại khi <code>find(u) == find(v)</code>.</div>`],
      [11, 'Kruskal Algorithm - demo',
        `<p class="y-chinh">🎯 Kruskal's demo is read edge by edge in weight order: take the edge if it joins two different clusters, reject it if its two ends are already connected.</p>
<p>The slide's demo is a picture of graph (a) and the tree Kruskal builds, with the list <strong>1, 2, 2, 3, 3, 4, 7, 8, 8</strong> in the text. That list is nondecreasing — exactly what Kruskal produces if the numbers are the weights of the accepted edges in the order they are taken — but the slide calls them "vertices", so check against the picture. If they are weights, 9 accepted edges would mean graph (a) has 10 vertices.</p>
<p class="nhan">Trace on the office graph of slide 3 (the lesson's own example) — the output of slide 10, line by line</p>
<table>
<thead><tr><th>#</th><th>Edge (weight)</th><th>Ends already connected?</th><th>Decision</th><th>Clusters after the step</th></tr></thead>
<tbody>
<tr><td>1</td><td>E-F (1)</td><td>no</td><td>take</td><td>{A} {B} {C} {D} {E,F} {G}</td></tr>
<tr><td>2</td><td>A-D (2)</td><td>no</td><td>take</td><td>{A,D} {B} {C} {E,F} {G}</td></tr>
<tr><td>3</td><td>B-C (3)</td><td>no</td><td>take</td><td>{A,D} {B,C} {E,F} {G}</td></tr>
<tr><td>4</td><td>B-D (4)</td><td>no — {B,C} and {A,D}</td><td>take</td><td>{A,B,C,D} {E,F} {G}</td></tr>
<tr><td>5</td><td>B-E (5)</td><td>no</td><td>take</td><td>{A,B,C,D,E,F} {G}</td></tr>
<tr><td>6</td><td>A-B (6)</td><td>yes (A-D-B)</td><td>reject</td><td>unchanged</td></tr>
<tr><td>7</td><td>C-F (7)</td><td>yes (C-B-E-F)</td><td>reject</td><td>unchanged</td></tr>
<tr><td>8</td><td>D-E (8)</td><td>yes (D-B-E)</td><td>reject</td><td>unchanged</td></tr>
<tr><td>9</td><td>D-G (9)</td><td>no</td><td>take — 6 edges = |V| − 1, stop</td><td>{A,B,C,D,E,F,G}</td></tr>
</tbody>
</table>
<p>F-G (10) and E-G (11) are never examined. Prim (slide 9) found the same 6 edges and the same total, 24 — in a different order.</p>
<p class="nhan">CQ13.1 — Prim vs Kruskal, run side by side on two graphs</p>
<pre><code class="language-java">import java.util.Arrays;

public class PrimVsKruskal {
    static String name(char[] v, int u, int w, int wt) { return v[u] + "-" + v[w] + "(" + wt + ") "; }

    static void prim(char[] v, int[][] edges) {
        int n = v.length;
        int[][] a = new int[n][n];
        for (int[] e : edges) { a[e[0]][e[1]] = e[2]; a[e[1]][e[0]] = e[2]; }
        boolean[] in = new boolean[n];
        int[] d = new int[n], p = new int[n];
        Arrays.fill(d, 999);
        d[0] = 0;
        p[0] = -1;
        int total = 0;
        StringBuilder s = new StringBuilder();
        for (int step = 0; step &lt; n; step++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++) if (!in[i] &amp;&amp; (u == -1 || d[i] &lt; d[u])) u = i;   // ties: smaller index
            in[u] = true;
            if (p[u] &gt;= 0) { s.append(name(v, p[u], u, d[u])); total += d[u]; }
            for (int w = 0; w &lt; n; w++) if (a[u][w] &gt; 0 &amp;&amp; !in[w] &amp;&amp; a[u][w] &lt; d[w]) { d[w] = a[u][w]; p[w] = u; }
        }
        System.out.println("  Prim from " + v[0] + ": " + s + " total " + total);
    }

    static int find(int[] parent, int x) { while (parent[x] != x) x = parent[x]; return x; }

    static void kruskal(char[] v, int[][] edges) {
        int[][] e = edges.clone();
        Arrays.sort(e, (x, y) -&gt; x[2] - y[2]);          // stable: equal weights keep input order
        int[] parent = new int[v.length];
        for (int i = 0; i &lt; v.length; i++) parent[i] = i;
        int taken = 0, total = 0;
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; e.length &amp;&amp; taken &lt; v.length - 1; i++) {
            int ru = find(parent, e[i][0]), rw = find(parent, e[i][1]);
            if (ru == rw) continue;
            parent[ru] = rw;
            taken++;
            total += e[i][2];
            s.append(name(v, e[i][0], e[i][1], e[i][2]));
        }
        System.out.println("  Kruskal  : " + s + " total " + total);
    }

    public static void main(String[] args) {
        char[] office = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
        int[][] oe = {{0, 1, 6}, {0, 3, 2}, {1, 2, 3}, {1, 3, 4}, {1, 4, 5}, {2, 5, 7},
                      {3, 4, 8}, {3, 6, 9}, {4, 5, 1}, {4, 6, 11}, {5, 6, 10}};
        System.out.println("office graph, all weights different:");
        prim(office, oe);
        kruskal(office, oe);
        char[] sq = {'P', 'Q', 'R', 'S'};              // square P-Q-R-S, sides 1, diagonal P-R 2
        int[][] se = {{0, 1, 1}, {1, 2, 1}, {2, 3, 1}, {0, 3, 1}, {0, 2, 2}};
        System.out.println("square, four edges of weight 1:");
        prim(sq, se);
        kruskal(sq, se);
    }
}</code></pre>
<div class="out">office graph, all weights different:<br>
&nbsp;&nbsp;Prim from A: A-D(2) D-B(4) B-C(3) B-E(5) E-F(1) D-G(9) &nbsp;total 24<br>
&nbsp;&nbsp;Kruskal &nbsp;: E-F(1) A-D(2) B-C(3) B-D(4) B-E(5) D-G(9) &nbsp;total 24<br>
square, four edges of weight 1:<br>
&nbsp;&nbsp;Prim from P: P-Q(1) Q-R(1) P-S(1) &nbsp;total 3<br>
&nbsp;&nbsp;Kruskal &nbsp;: P-Q(1) Q-R(1) R-S(1) &nbsp;total 3</div>
<table>
<thead><tr><th></th><th>Prim-Jarník</th><th>Kruskal</th></tr></thead>
<tbody>
<tr><td>In common</td><td>greedy, always correct, same minimum total weight</td><td>greedy, always correct, same minimum total weight</td></tr>
<tr><td>Grows</td><td>one tree, connected at every step</td><td>a forest whose clusters merge</td></tr>
<tr><td>Needs</td><td>a start vertex; array O(|V|²) or heap O(|E| log |V|)</td><td>the sorted edge list + union-find; O(|E| log |E|)</td></tr>
<tr><td>Suits</td><td>dense graphs stored as an adjacency matrix</td><td>sparse graphs given as a list of edges</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Same tree or not?</strong> With all weights different the MST is unique, so both return the same edges (office graph). With ties they may return different trees — P-S versus R-S in the square — but always with the same minimum total, 3.</p>`,
        `<p class="y-chinh">🎯 Phần minh hoạ (demo) của Kruskal được đọc từng cạnh theo thứ tự trọng số: lấy cạnh nếu nó nối hai cụm khác nhau, loại nếu hai đầu của nó đã được nối với nhau rồi.</p>
<p>Phần minh hoạ của slide là hình đồ thị (a) và cây Kruskal dựng được, kèm dãy <strong>1, 2, 2, 3, 3, 4, 7, 8, 8</strong> trong phần chữ. Dãy này không giảm — đúng thứ Kruskal tạo ra nếu các số là trọng số của các cạnh được nhận, theo thứ tự được lấy — nhưng slide gọi chúng là "vertices" (đỉnh), nên hãy đối chiếu với hình. Nếu đó là trọng số thì 9 cạnh được nhận nghĩa là đồ thị (a) có 10 đỉnh.</p>
<p class="nhan">Lần theo trên đồ thị văn phòng của slide 3 (ví dụ của bài) — đúng output của slide 10, từng dòng</p>
<table>
<thead><tr><th>#</th><th>Cạnh (trọng số)</th><th>Hai đầu đã nối với nhau?</th><th>Quyết định</th><th>Các cụm sau bước</th></tr></thead>
<tbody>
<tr><td>1</td><td>E-F (1)</td><td>chưa</td><td>lấy</td><td>{A} {B} {C} {D} {E,F} {G}</td></tr>
<tr><td>2</td><td>A-D (2)</td><td>chưa</td><td>lấy</td><td>{A,D} {B} {C} {E,F} {G}</td></tr>
<tr><td>3</td><td>B-C (3)</td><td>chưa</td><td>lấy</td><td>{A,D} {B,C} {E,F} {G}</td></tr>
<tr><td>4</td><td>B-D (4)</td><td>chưa — {B,C} và {A,D}</td><td>lấy</td><td>{A,B,C,D} {E,F} {G}</td></tr>
<tr><td>5</td><td>B-E (5)</td><td>chưa</td><td>lấy</td><td>{A,B,C,D,E,F} {G}</td></tr>
<tr><td>6</td><td>A-B (6)</td><td>rồi (A-D-B)</td><td>loại</td><td>không đổi</td></tr>
<tr><td>7</td><td>C-F (7)</td><td>rồi (C-B-E-F)</td><td>loại</td><td>không đổi</td></tr>
<tr><td>8</td><td>D-E (8)</td><td>rồi (D-B-E)</td><td>loại</td><td>không đổi</td></tr>
<tr><td>9</td><td>D-G (9)</td><td>chưa</td><td>lấy — 6 cạnh = |V| − 1, dừng</td><td>{A,B,C,D,E,F,G}</td></tr>
</tbody>
</table>
<p>F-G (10) và E-G (11) không bao giờ được xét. Prim (slide 9) tìm ra đúng 6 cạnh này với cùng tổng 24 — chỉ khác thứ tự.</p>
<p class="nhan">CQ13.1 — Prim và Kruskal chạy song song trên hai đồ thị</p>
<pre><code class="language-java">import java.util.Arrays;

public class PrimVsKruskal {
    static String name(char[] v, int u, int w, int wt) { return v[u] + "-" + v[w] + "(" + wt + ") "; }

    static void prim(char[] v, int[][] edges) {
        int n = v.length;
        int[][] a = new int[n][n];
        for (int[] e : edges) { a[e[0]][e[1]] = e[2]; a[e[1]][e[0]] = e[2]; }
        boolean[] in = new boolean[n];
        int[] d = new int[n], p = new int[n];
        Arrays.fill(d, 999);
        d[0] = 0;
        p[0] = -1;
        int total = 0;
        StringBuilder s = new StringBuilder();
        for (int step = 0; step &lt; n; step++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++) if (!in[i] &amp;&amp; (u == -1 || d[i] &lt; d[u])) u = i;   // hoà: chọn chỉ số nhỏ hơn
            in[u] = true;
            if (p[u] &gt;= 0) { s.append(name(v, p[u], u, d[u])); total += d[u]; }
            for (int w = 0; w &lt; n; w++) if (a[u][w] &gt; 0 &amp;&amp; !in[w] &amp;&amp; a[u][w] &lt; d[w]) { d[w] = a[u][w]; p[w] = u; }
        }
        System.out.println("  Prim from " + v[0] + ": " + s + " total " + total);
    }

    static int find(int[] parent, int x) { while (parent[x] != x) x = parent[x]; return x; }

    static void kruskal(char[] v, int[][] edges) {
        int[][] e = edges.clone();
        Arrays.sort(e, (x, y) -&gt; x[2] - y[2]);          // ổn định: cạnh cùng trọng số giữ thứ tự nhập
        int[] parent = new int[v.length];
        for (int i = 0; i &lt; v.length; i++) parent[i] = i;
        int taken = 0, total = 0;
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; e.length &amp;&amp; taken &lt; v.length - 1; i++) {
            int ru = find(parent, e[i][0]), rw = find(parent, e[i][1]);
            if (ru == rw) continue;
            parent[ru] = rw;
            taken++;
            total += e[i][2];
            s.append(name(v, e[i][0], e[i][1], e[i][2]));
        }
        System.out.println("  Kruskal  : " + s + " total " + total);
    }

    public static void main(String[] args) {
        char[] office = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
        int[][] oe = {{0, 1, 6}, {0, 3, 2}, {1, 2, 3}, {1, 3, 4}, {1, 4, 5}, {2, 5, 7},
                      {3, 4, 8}, {3, 6, 9}, {4, 5, 1}, {4, 6, 11}, {5, 6, 10}};
        System.out.println("office graph, all weights different:");
        prim(office, oe);
        kruskal(office, oe);
        char[] sq = {'P', 'Q', 'R', 'S'};              // hình vuông P-Q-R-S, cạnh 1, đường chéo P-R 2
        int[][] se = {{0, 1, 1}, {1, 2, 1}, {2, 3, 1}, {0, 3, 1}, {0, 2, 2}};
        System.out.println("square, four edges of weight 1:");
        prim(sq, se);
        kruskal(sq, se);
    }
}</code></pre>
<div class="out">office graph, all weights different:<br>
&nbsp;&nbsp;Prim from A: A-D(2) D-B(4) B-C(3) B-E(5) E-F(1) D-G(9) &nbsp;total 24<br>
&nbsp;&nbsp;Kruskal &nbsp;: E-F(1) A-D(2) B-C(3) B-D(4) B-E(5) D-G(9) &nbsp;total 24<br>
square, four edges of weight 1:<br>
&nbsp;&nbsp;Prim from P: P-Q(1) Q-R(1) P-S(1) &nbsp;total 3<br>
&nbsp;&nbsp;Kruskal &nbsp;: P-Q(1) Q-R(1) R-S(1) &nbsp;total 3</div>
<table>
<thead><tr><th></th><th>Prim-Jarník</th><th>Kruskal</th></tr></thead>
<tbody>
<tr><td>Giống nhau</td><td>tham lam (greedy), luôn đúng, cùng tổng trọng số nhỏ nhất</td><td>tham lam, luôn đúng, cùng tổng trọng số nhỏ nhất</td></tr>
<tr><td>Cái lớn dần</td><td>một cây, liên thông ở mọi bước</td><td>một rừng (forest) các cụm dần gộp lại</td></tr>
<tr><td>Cần gì</td><td>một đỉnh xuất phát; mảng O(|V|²) hoặc heap (đống) O(|E| log |V|)</td><td>danh sách cạnh đã sắp + union-find (hợp–tìm); O(|E| log |E|)</td></tr>
<tr><td>Hợp với</td><td>đồ thị dày (dense), lưu bằng ma trận kề</td><td>đồ thị thưa (sparse), cho dưới dạng danh sách cạnh</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Có ra cùng một cây không?</strong> Khi mọi trọng số khác nhau thì MST (cây khung nhỏ nhất) là duy nhất, nên cả hai trả về cùng các cạnh (đồ thị văn phòng). Khi có trọng số bằng nhau, hai thuật toán có thể ra hai cây khác nhau — P-S so với R-S trong hình vuông — nhưng tổng nhỏ nhất luôn như nhau, bằng 3.</p>`],
      [12, 'Euler cycle and paths',
        `<p class="y-chinh">🎯 An Euler path traverses every edge of the graph exactly once; an Euler cycle does the same and ends at the vertex where it started.</p>
<ul>
<li><strong>Edges</strong> are what is counted: each one must be used once — not zero times, not twice.</li>
<li><strong>Vertices may repeat</strong>: a vertex of degree 4 is passed twice. "Cycle" is meant as in 5A-Graphs1 (a path that starts and ends at the same vertex), not a simple cycle.</li>
<li>The slide shows three example graphs as pictures: one with an Euler cycle, one with an Euler path but no Euler cycle, one with neither. The lesson's own examples of the three kinds:</li>
</ul>
<pre><code class="language-plaintext">bowtie: Euler cycle     tail: Euler path only    K4: neither
A           D           A                        A ------- B
| \\       / |           | \\                      | \\     / |
|   \\   /   |           |   \\                    |   \\ /   |
|     C     |           |     C ----- D          |   / \\   |
|   /   \\   |           |   /                    | /     \\ |
| /       \\ |           | /                      C ------- D
B           E           B</code></pre>
<pre><code class="language-java">public class EulerWalkCheck {
    // Is the walk an Euler cycle, an Euler path, or neither?
    static String check(int n, int[][] edges, String walk) {
        int[][] left = new int[n][n];                   // copies of each edge not used yet
        for (int[] e : edges) { left[e[0]][e[1]]++; left[e[1]][e[0]]++; }
        for (int i = 0; i + 1 &lt; walk.length(); i++) {
            int u = walk.charAt(i) - 'A', w = walk.charAt(i + 1) - 'A';
            String e = walk.charAt(i) + "-" + walk.charAt(i + 1);
            if (left[u][w] == 0) {
                boolean isEdge = false;
                for (int[] x : edges) if ((x[0] == u &amp;&amp; x[1] == w) || (x[0] == w &amp;&amp; x[1] == u)) isEdge = true;
                return isEdge ? "not Euler: edge " + e + " used twice" : "not Euler: " + e + " is not an edge";
            }
            left[u][w]--;
            left[w][u]--;
        }
        for (int[] e : edges)
            if (left[e[0]][e[1]] &gt; 0) return "not Euler: edge " + (char) ('A' + e[0]) + "-" + (char) ('A' + e[1]) + " never used";
        boolean closed = walk.charAt(0) == walk.charAt(walk.length() - 1);
        return (closed ? "Euler cycle" : "Euler path") + " (all " + edges.length + " edges once"
                + (closed ? ", back at the start)" : ", ends away from the start)");
    }

    public static void main(String[] args) {
        int[][] bowtie = {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 2}};   // A-B-C and C-D-E
        int[][] tail = {{0, 1}, {1, 2}, {2, 0}, {2, 3}};                    // triangle A-B-C + edge C-D
        int[][] k4 = {{0, 1}, {0, 2}, {0, 3}, {1, 2}, {1, 3}, {2, 3}};       // every pair joined
        System.out.println("bowtie ABCDECA: " + check(5, bowtie, "ABCDECA"));
        System.out.println("tail   DCABC  : " + check(4, tail, "DCABC"));
        System.out.println("tail   ABCACD : " + check(4, tail, "ABCACD"));
        System.out.println("K4     ABCADB : " + check(4, k4, "ABCADB"));
    }
}</code></pre>
<div class="out">bowtie ABCDECA: Euler cycle (all 6 edges once, back at the start)<br>
tail &nbsp;&nbsp;DCABC &nbsp;: Euler path (all 4 edges once, ends away from the start)<br>
tail &nbsp;&nbsp;ABCACD : not Euler: edge A-C used twice<br>
K4 &nbsp;&nbsp;&nbsp;&nbsp;ABCADB : not Euler: edge C-D never used</div>
<p>The checker only tests a <em>given</em> walk. On K4 every attempt leaves an edge unused; proving that no walk can ever succeed needs the degree argument of slides 14–15 and 22.</p>
<p class="meo">🧠 <strong>Remember:</strong> <strong>E</strong>uler ↔ <strong>E</strong>dges. Hamilton (slide 23) is the one about vertices.</p>`,
        `<p class="y-chinh">🎯 Đường đi Euler (Euler path) đi qua mọi cạnh của đồ thị đúng một lần; chu trình Euler (Euler cycle) cũng vậy và kết thúc tại chính đỉnh xuất phát.</p>
<ul>
<li>Thứ được đếm là <strong>cạnh</strong> (edge): mỗi cạnh phải dùng đúng một lần — không được bỏ sót, không được đi hai lần.</li>
<li><strong>Đỉnh thì được lặp lại</strong>: một đỉnh bậc 4 sẽ được đi qua hai lần. "Chu trình" (cycle) hiểu theo nghĩa của bộ 5A-Graphs1 (đường đi bắt đầu và kết thúc ở cùng một đỉnh), không phải chu trình đơn (simple cycle).</li>
<li>Slide minh hoạ bằng hình ba đồ thị: một đồ thị có chu trình Euler, một có đường đi Euler nhưng không có chu trình Euler, một không có cả hai. Ví dụ của bài cho ba loại đó: (1) có chu trình Euler, (2) chỉ có đường đi Euler, (3) không có cả hai:</li>
</ul>
<pre><code class="language-plaintext">(1) hình nơ (bowtie)    (2) tam giác có đuôi     (3) K4
A           D           A                        A ------- B
| \\       / |           | \\                      | \\     / |
|   \\   /   |           |   \\                    |   \\ /   |
|     C     |           |     C ----- D          |   / \\   |
|   /   \\   |           |   /                    | /     \\ |
| /       \\ |           | /                      C ------- D
B           E           B</code></pre>
<pre><code class="language-java">public class EulerWalkCheck {
    // Hành trình là chu trình Euler, đường đi Euler, hay không phải?
    static String check(int n, int[][] edges, String walk) {
        int[][] left = new int[n][n];                   // số bản của mỗi cạnh chưa dùng
        for (int[] e : edges) { left[e[0]][e[1]]++; left[e[1]][e[0]]++; }
        for (int i = 0; i + 1 &lt; walk.length(); i++) {
            int u = walk.charAt(i) - 'A', w = walk.charAt(i + 1) - 'A';
            String e = walk.charAt(i) + "-" + walk.charAt(i + 1);
            if (left[u][w] == 0) {
                boolean isEdge = false;
                for (int[] x : edges) if ((x[0] == u &amp;&amp; x[1] == w) || (x[0] == w &amp;&amp; x[1] == u)) isEdge = true;
                return isEdge ? "not Euler: edge " + e + " used twice" : "not Euler: " + e + " is not an edge";
            }
            left[u][w]--;
            left[w][u]--;
        }
        for (int[] e : edges)
            if (left[e[0]][e[1]] &gt; 0) return "not Euler: edge " + (char) ('A' + e[0]) + "-" + (char) ('A' + e[1]) + " never used";
        boolean closed = walk.charAt(0) == walk.charAt(walk.length() - 1);
        return (closed ? "Euler cycle" : "Euler path") + " (all " + edges.length + " edges once"
                + (closed ? ", back at the start)" : ", ends away from the start)");
    }

    public static void main(String[] args) {
        int[][] bowtie = {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 2}};   // hai tam giác A-B-C và C-D-E
        int[][] tail = {{0, 1}, {1, 2}, {2, 0}, {2, 3}};                    // tam giác A-B-C + cạnh C-D
        int[][] k4 = {{0, 1}, {0, 2}, {0, 3}, {1, 2}, {1, 3}, {2, 3}};       // mọi cặp đều nối
        System.out.println("bowtie ABCDECA: " + check(5, bowtie, "ABCDECA"));
        System.out.println("tail   DCABC  : " + check(4, tail, "DCABC"));
        System.out.println("tail   ABCACD : " + check(4, tail, "ABCACD"));
        System.out.println("K4     ABCADB : " + check(4, k4, "ABCADB"));
    }
}</code></pre>
<div class="out">bowtie ABCDECA: Euler cycle (all 6 edges once, back at the start)<br>
tail &nbsp;&nbsp;DCABC &nbsp;: Euler path (all 4 edges once, ends away from the start)<br>
tail &nbsp;&nbsp;ABCACD : not Euler: edge A-C used twice<br>
K4 &nbsp;&nbsp;&nbsp;&nbsp;ABCADB : not Euler: edge C-D never used</div>
<p>Chương trình chỉ kiểm một hành trình <em>cho sẵn</em>. Trên K4 (đồ thị đầy đủ 4 đỉnh) cách thử nào cũng bỏ sót một cạnh; muốn chứng minh không bao giờ có hành trình nào thành công thì cần lập luận về bậc (degree) ở slide 14–15 và 22.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <strong>E</strong>uler ↔ <strong>E</strong>dge (cạnh) — cùng mở đầu bằng chữ E. Hamilton (slide 23) mới là chuyện về đỉnh.</p>`],
      [13, 'The Bridges of Königsberg',
        `<p class="y-chinh">🎯 Königsberg's seven bridges become a multigraph — land masses are vertices, bridges are edges — so "a walk over every bridge exactly once, back to the start" becomes "does this multigraph have an Euler cycle?".</p>
<ul>
<li><strong>The story</strong> (slide): the town of Königsberg (today Kaliningrad) on the Pregel river, with the island Kneiphof, and its 7 bridges in the 18th century. Is it possible to start somewhere, cross all the bridges without crossing any bridge twice, and return to the starting point?</li>
<li><strong>The model</strong>: 4 land masses (labelled A, B, C, D on the slide's map and on its multigraph) → 4 vertices; 7 bridges → 7 edges. Two land masses joined by two bridges get two parallel edges, so the result is a multigraph (5A-Graphs1, slide 9).</li>
<li><strong>The degrees</strong>: the island Kneiphof is touched by 5 bridges, each of the other three land masses by 3.</li>
</ul>
<table>
<thead><tr><th>Bridges between</th><th>Number</th></tr></thead>
<tbody>
<tr><td>the island Kneiphof and the north bank</td><td>2</td></tr>
<tr><td>the island and the south bank</td><td>2</td></tr>
<tr><td>the island and the land to the east, between the two branches of the river</td><td>1</td></tr>
<tr><td>the north bank and the east land</td><td>1</td></tr>
<tr><td>the south bank and the east land</td><td>1</td></tr>
</tbody>
</table>
<p>The program uses these names instead of letters, so it does not guess which letter is which on the picture. It computes the degrees, then tries <em>every</em> walk that never crosses a bridge twice:</p>
<pre><code class="language-java">public class Konigsberg {
    static String[] name = {"Island", "North", "South", "East"};
    static int[][] a = new int[4][4];          // a[i][j] = number of bridges between i and j
    static int best = 0, walks = 0;
    static String bestWalk = "";

    static void bridge(int i, int j, int k) { a[i][j] += k; a[j][i] += k; }

    static void explore(int u, int used, String walk) {   // try every way to continue
        walks++;
        if (used &gt; best) { best = used; bestWalk = walk; }
        for (int w = 0; w &lt; 4; w++)
            if (a[u][w] &gt; 0) {
                a[u][w]--; a[w][u]--;                      // cross one bridge
                explore(w, used + 1, walk + "-" + name[w]);
                a[u][w]++; a[w][u]++;                      // undo: try another bridge
            }
    }

    public static void main(String[] args) {
        bridge(0, 1, 2);                                   // island - north bank: 2 bridges
        bridge(0, 2, 2);                                   // island - south bank: 2 bridges
        bridge(0, 3, 1);
        bridge(1, 3, 1);
        bridge(2, 3, 1);
        for (int i = 0; i &lt; 4; i++) {
            int deg = 0;
            for (int j = 0; j &lt; 4; j++) deg += a[i][j];
            System.out.println(name[i] + ": " + deg + " bridges" + (deg % 2 == 1 ? " (odd)" : ""));
        }
        for (int s = 0; s &lt; 4; s++) explore(s, 0, name[s]);
        System.out.println("walks tried (no bridge crossed twice): " + walks);
        System.out.println("longest: " + best + " of 7 bridges, " + bestWalk);
    }
}</code></pre>
<div class="out">Island: 5 bridges (odd)<br>
North: 3 bridges (odd)<br>
South: 3 bridges (odd)<br>
East: 3 bridges (odd)<br>
walks tried (no bridge crossed twice): 254<br>
longest: 6 of 7 bridges, Island-North-Island-South-Island-East-North</div>
<p class="dap-an">✅ <strong>Answer to the slide's question:</strong> no. Every walk gets stuck after at most 6 of the 7 bridges. Euler proved it in 1736 without trying a single route: a walk must leave every land mass it enters, so each land mass in the middle of the walk needs an even number of bridges — and here all four have an odd number, while a walk has only two ends (slides 14–15).</p>`,
        `<p class="y-chinh">🎯 Bảy cây cầu Königsberg được biến thành một đa đồ thị (multigraph) — vùng đất là đỉnh, cây cầu là cạnh — nên câu hỏi "đi qua mỗi cầu đúng một lần rồi về chỗ cũ" trở thành "đa đồ thị này có chu trình Euler không?".</p>
<ul>
<li><strong>Câu chuyện</strong> (slide): thị trấn Königsberg (nay là Kaliningrad) bên sông Pregel, có đảo Kneiphof, và 7 cây cầu vào thế kỷ 18. Có thể xuất phát từ một nơi, đi qua mọi cây cầu mà không cầu nào phải đi hai lần, rồi quay về đúng chỗ xuất phát không?</li>
<li><strong>Mô hình</strong>: 4 vùng đất (được đặt tên A, B, C, D trên bản đồ và trên đa đồ thị của slide) → 4 đỉnh; 7 cây cầu → 7 cạnh. Hai vùng đất nối với nhau bằng hai cây cầu thì có hai cạnh song song (parallel edge), nên kết quả là một đa đồ thị (5A-Graphs1, slide 9).</li>
<li><strong>Bậc (degree)</strong>: đảo Kneiphof có 5 cây cầu chạm tới, mỗi vùng đất còn lại có 3.</li>
</ul>
<table>
<thead><tr><th>Cầu nối giữa</th><th>Số cầu</th></tr></thead>
<tbody>
<tr><td>đảo Kneiphof và bờ bắc</td><td>2</td></tr>
<tr><td>đảo và bờ nam</td><td>2</td></tr>
<tr><td>đảo và vùng đất phía đông, nằm giữa hai nhánh sông</td><td>1</td></tr>
<tr><td>bờ bắc và vùng đất phía đông</td><td>1</td></tr>
<tr><td>bờ nam và vùng đất phía đông</td><td>1</td></tr>
</tbody>
</table>
<p>Chương trình dùng các tên này thay cho chữ cái, để không phải đoán chữ cái nào ứng với vùng nào trên hình. Nó tính bậc, rồi thử <em>mọi</em> hành trình không đi qua cầu nào hai lần:</p>
<pre><code class="language-java">public class Konigsberg {
    static String[] name = {"Island", "North", "South", "East"};
    static int[][] a = new int[4][4];          // a[i][j] = số cầu nối i và j
    static int best = 0, walks = 0;
    static String bestWalk = "";

    static void bridge(int i, int j, int k) { a[i][j] += k; a[j][i] += k; }

    static void explore(int u, int used, String walk) {   // thử mọi cách đi tiếp
        walks++;
        if (used &gt; best) { best = used; bestWalk = walk; }
        for (int w = 0; w &lt; 4; w++)
            if (a[u][w] &gt; 0) {
                a[u][w]--; a[w][u]--;                      // đi qua một cây cầu
                explore(w, used + 1, walk + "-" + name[w]);
                a[u][w]++; a[w][u]++;                      // hoàn tác để thử cầu khác
            }
    }

    public static void main(String[] args) {
        bridge(0, 1, 2);                                   // đảo - bờ bắc: 2 cầu
        bridge(0, 2, 2);                                   // đảo - bờ nam: 2 cầu
        bridge(0, 3, 1);
        bridge(1, 3, 1);
        bridge(2, 3, 1);
        for (int i = 0; i &lt; 4; i++) {
            int deg = 0;
            for (int j = 0; j &lt; 4; j++) deg += a[i][j];
            System.out.println(name[i] + ": " + deg + " bridges" + (deg % 2 == 1 ? " (odd)" : ""));
        }
        for (int s = 0; s &lt; 4; s++) explore(s, 0, name[s]);
        System.out.println("walks tried (no bridge crossed twice): " + walks);
        System.out.println("longest: " + best + " of 7 bridges, " + bestWalk);
    }
}</code></pre>
<div class="out">Island: 5 bridges (odd)<br>
North: 3 bridges (odd)<br>
South: 3 bridges (odd)<br>
East: 3 bridges (odd)<br>
walks tried (no bridge crossed twice): 254<br>
longest: 6 of 7 bridges, Island-North-Island-South-Island-East-North</div>
<p class="dap-an">✅ <strong>Đáp án cho câu hỏi của slide:</strong> không thể. Hành trình nào cũng bị kẹt sau tối đa 6 trong 7 cây cầu. Euler đã chứng minh điều này năm 1736 mà không cần thử lộ trình nào: đi vào một vùng đất thì phải đi ra, nên mỗi vùng đất nằm giữa hành trình cần số cầu chẵn — mà ở đây cả bốn vùng đều có số cầu lẻ, trong khi một hành trình chỉ có hai đầu (slide 14–15).</p>`],
      [14, 'Necessary and sufficient conditions for Euler cycles',
        `<p class="y-chinh">🎯 Theorem 1: a connected multigraph has an Euler cycle if and only if every vertex has even degree — so an Euler cycle is ruled in or out just by counting degrees.</p>
<ul>
<li><strong>"If and only if"</strong> = two statements: <em>necessary</em> (Euler cycle ⇒ all degrees even, proved on slide 15) and <em>sufficient</em> (all degrees even ⇒ an Euler cycle exists, proved by an algorithm on slides 16–18).</li>
<li><strong>Connected</strong> is part of the theorem: vertices with no edges at all do not matter, but all the edges must lie in one piece.</li>
<li><strong>Multigraph</strong>: parallel edges are allowed and each one counts in the degree — so Königsberg is covered.</li>
<li>Next to the theorem the slide shows again, as pictures, the three labelled kinds of example graph (as on slide 12) and the Königsberg multigraph; the program applies the theorem to the lesson's three graphs of slide 12, to Königsberg and to a disconnected graph.</li>
</ul>
<pre><code class="language-java">public class EulerTest {
    static void test(String name, String labels, int[][] edges) {
        int n = labels.length();
        int[][] a = new int[n][n];                 // multigraph: a[i][j] = number of edges
        int[] deg = new int[n];
        for (int[] e : edges) { a[e[0]][e[1]]++; a[e[1]][e[0]]++; deg[e[0]]++; deg[e[1]]++; }
        boolean[] seen = new boolean[n];           // connected? DFS from vertex 0
        int[] stack = new int[n * n + 1];
        int top = 0;
        stack[top++] = 0;
        seen[0] = true;
        while (top &gt; 0) {
            int u = stack[--top];
            for (int w = 0; w &lt; n; w++) if (a[u][w] &gt; 0 &amp;&amp; !seen[w]) { seen[w] = true; stack[top++] = w; }
        }
        boolean connected = true;
        String odd = "", degs = "";
        for (int i = 0; i &lt; n; i++) {
            if (!seen[i] &amp;&amp; deg[i] &gt; 0) connected = false;
            if (deg[i] % 2 == 1) odd += labels.charAt(i);
            degs += deg[i] + " ";
        }
        String verdict;
        if (!connected) verdict = "not connected: no Euler cycle, no Euler path";
        else if (odd.length() == 0) verdict = "all even: Euler cycle";
        else if (odd.length() == 2) verdict = "odd " + odd + ": Euler path " + odd.charAt(0) + "..." + odd.charAt(1) + ", no cycle";
        else verdict = odd.length() + " odd vertices: no cycle, no path";
        System.out.printf("%-11s degrees %s-&gt; %s%n", name, degs, verdict);
    }

    public static void main(String[] args) {
        test("bowtie", "ABCDE", new int[][] {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 2}});
        test("tail", "ABCD", new int[][] {{0, 1}, {1, 2}, {2, 0}, {2, 3}});
        test("K4", "ABCD", new int[][] {{0, 1}, {0, 2}, {0, 3}, {1, 2}, {1, 3}, {2, 3}});
        test("Konigsberg", "INSE", new int[][] {{0, 1}, {0, 1}, {0, 2}, {0, 2}, {0, 3}, {1, 3}, {2, 3}});
        test("2 triangles", "ABCDEF", new int[][] {{0, 1}, {1, 2}, {2, 0}, {3, 4}, {4, 5}, {5, 3}});
    }
}</code></pre>
<div class="out">bowtie &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;degrees 2 2 4 2 2 -&gt; all even: Euler cycle<br>
tail &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;degrees 2 2 3 1 -&gt; odd CD: Euler path C...D, no cycle<br>
K4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;degrees 3 3 3 3 -&gt; 4 odd vertices: no cycle, no path<br>
Konigsberg &nbsp;degrees 5 3 3 3 -&gt; 4 odd vertices: no cycle, no path<br>
2 triangles degrees 2 2 2 2 2 2 -&gt; not connected: no Euler cycle, no Euler path</div>
<p><strong>Big-O:</strong> the degrees take one pass over the adjacency matrix, O(|V|²) (O(|V| + |E|) with adjacency lists), and connectivity is one DFS — the whole test is linear in the size of the graph.</p>
<p class="dap-an">✅ <strong>"Euler cycle??? path???" for the Königsberg multigraph:</strong> no Euler cycle, because its degrees 5, 3, 3, 3 are odd; no Euler path either, because a connected multigraph with an Euler path but no Euler cycle has exactly two odd vertices (Theorem 2, slide 22) — here there are four.</p>
<p class="dap-an">✅ <strong>CQ12.2 — How do you know if a graph has an Euler cycle?</strong> Check that it is connected (ignoring isolated vertices) and that every vertex has even degree.</p>
<div class="pitfall">"All degrees even ⇒ Euler cycle" is false without connectivity: two separate triangles (last line of the output) have all degrees even and no Euler cycle. In an FE question, check both conditions.</div>`,
        `<p class="y-chinh">🎯 Định lý 1: một đa đồ thị (multigraph) liên thông có chu trình Euler khi và chỉ khi mọi đỉnh đều có bậc chẵn — nên chỉ cần đếm bậc là biết có hay không có chu trình Euler.</p>
<ul>
<li><strong>"Khi và chỉ khi" (if and only if)</strong> = hai mệnh đề: điều kiện <em>cần</em> (necessary — có chu trình Euler ⇒ mọi bậc chẵn, chứng minh ở slide 15) và điều kiện <em>đủ</em> (sufficient — mọi bậc chẵn ⇒ có chu trình Euler, chứng minh bằng thuật toán ở slide 16–18).</li>
<li><strong>Liên thông (connected)</strong> là một phần của định lý: đỉnh không có cạnh nào thì không ảnh hưởng, nhưng mọi cạnh phải nằm trong cùng một mảnh.</li>
<li><strong>Đa đồ thị</strong>: cho phép cạnh song song (parallel edge) và mỗi cạnh đều được tính vào bậc — nên bài Königsberg cũng áp dụng được.</li>
<li>Cạnh định lý, slide nhắc lại bằng hình ba loại đồ thị ví dụ có ghi nhãn (như slide 12) và đa đồ thị Königsberg; chương trình áp định lý cho ba đồ thị của bài ở slide 12, cho Königsberg và cho một đồ thị không liên thông.</li>
</ul>
<pre><code class="language-java">public class EulerTest {
    static void test(String name, String labels, int[][] edges) {
        int n = labels.length();
        int[][] a = new int[n][n];                 // đa đồ thị: a[i][j] = số cạnh
        int[] deg = new int[n];
        for (int[] e : edges) { a[e[0]][e[1]]++; a[e[1]][e[0]]++; deg[e[0]]++; deg[e[1]]++; }
        boolean[] seen = new boolean[n];           // liên thông? DFS từ đỉnh 0
        int[] stack = new int[n * n + 1];
        int top = 0;
        stack[top++] = 0;
        seen[0] = true;
        while (top &gt; 0) {
            int u = stack[--top];
            for (int w = 0; w &lt; n; w++) if (a[u][w] &gt; 0 &amp;&amp; !seen[w]) { seen[w] = true; stack[top++] = w; }
        }
        boolean connected = true;
        String odd = "", degs = "";
        for (int i = 0; i &lt; n; i++) {
            if (!seen[i] &amp;&amp; deg[i] &gt; 0) connected = false;
            if (deg[i] % 2 == 1) odd += labels.charAt(i);
            degs += deg[i] + " ";
        }
        String verdict;
        if (!connected) verdict = "not connected: no Euler cycle, no Euler path";
        else if (odd.length() == 0) verdict = "all even: Euler cycle";
        else if (odd.length() == 2) verdict = "odd " + odd + ": Euler path " + odd.charAt(0) + "..." + odd.charAt(1) + ", no cycle";
        else verdict = odd.length() + " odd vertices: no cycle, no path";
        System.out.printf("%-11s degrees %s-&gt; %s%n", name, degs, verdict);
    }

    public static void main(String[] args) {
        test("bowtie", "ABCDE", new int[][] {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 2}});
        test("tail", "ABCD", new int[][] {{0, 1}, {1, 2}, {2, 0}, {2, 3}});
        test("K4", "ABCD", new int[][] {{0, 1}, {0, 2}, {0, 3}, {1, 2}, {1, 3}, {2, 3}});
        test("Konigsberg", "INSE", new int[][] {{0, 1}, {0, 1}, {0, 2}, {0, 2}, {0, 3}, {1, 3}, {2, 3}});
        test("2 triangles", "ABCDEF", new int[][] {{0, 1}, {1, 2}, {2, 0}, {3, 4}, {4, 5}, {5, 3}});
    }
}</code></pre>
<div class="out">bowtie &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;degrees 2 2 4 2 2 -&gt; all even: Euler cycle<br>
tail &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;degrees 2 2 3 1 -&gt; odd CD: Euler path C...D, no cycle<br>
K4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;degrees 3 3 3 3 -&gt; 4 odd vertices: no cycle, no path<br>
Konigsberg &nbsp;degrees 5 3 3 3 -&gt; 4 odd vertices: no cycle, no path<br>
2 triangles degrees 2 2 2 2 2 2 -&gt; not connected: no Euler cycle, no Euler path</div>
<p><strong>Big-O:</strong> tính bậc là một lượt quét ma trận kề, O(|V|²) (O(|V| + |E|) nếu dùng danh sách kề — adjacency list), còn kiểm liên thông là một lần DFS (duyệt theo chiều sâu) — cả phép kiểm tuyến tính theo kích thước đồ thị.</p>
<p class="dap-an">✅ <strong>"Euler cycle??? path???" (chu trình Euler??? đường đi???) với đa đồ thị Königsberg:</strong> không có chu trình Euler, vì các bậc 5, 3, 3, 3 đều lẻ; cũng không có đường đi Euler, vì đa đồ thị liên thông có đường đi Euler mà không có chu trình Euler thì phải có đúng hai đỉnh bậc lẻ (Định lý 2, slide 22) — ở đây có tới bốn.</p>
<p class="dap-an">✅ <strong>CQ12.2 — Làm sao biết đồ thị có chu trình Euler?</strong> Kiểm đồ thị liên thông (bỏ qua các đỉnh cô lập — isolated vertex) và mọi đỉnh có bậc chẵn.</p>
<div class="pitfall">"Mọi bậc chẵn ⇒ có chu trình Euler" là SAI nếu thiếu liên thông: hai tam giác rời nhau (dòng cuối của output) có mọi bậc chẵn mà không có chu trình Euler. Gặp câu FE (thi cuối kỳ), hãy kiểm đủ cả hai điều kiện.</div>`],
      [15, 'Necessary condition for Euler cycle',
        `<p class="y-chinh">🎯 Part 1 of the proof: if a graph has an Euler cycle, every vertex has even degree, because each time the cycle passes through a vertex it uses two of its edges — one to enter, one to leave.</p>
<ol>
<li>Assume the graph has an Euler cycle.</li>
<li>Every pass through a vertex contributes 2 to that vertex's degree: the cycle enters by one incident edge and leaves by another.</li>
<li>The start vertex too: the first edge leaves it and the last edge comes back to it — one more pair.</li>
<li>The cycle uses every edge exactly once, so these pairs account for all the edges at each vertex: deg(v) = 2 × (number of passes through v), which is even.</li>
</ol>
<p class="nhan">Check it on the Euler cycle that slide 20 obtains: 1-2-3-4-6-7-8-6-5-3-1</p>
<table>
<thead><tr><th>Vertex</th><th>Where it appears in the cycle</th><th>Edges used there</th><th>Degree</th></tr></thead>
<tbody>
<tr><td>1</td><td>start and end</td><td>1-2 (leave), 3-1 (come back)</td><td>2</td></tr>
<tr><td>2</td><td>once, in the middle</td><td>1-2, 2-3</td><td>2</td></tr>
<tr><td>3</td><td>twice</td><td>2-3, 3-4 · 5-3, 3-1</td><td>4</td></tr>
<tr><td>4</td><td>once</td><td>3-4, 4-6</td><td>2</td></tr>
<tr><td>5</td><td>once</td><td>6-5, 5-3</td><td>2</td></tr>
<tr><td>6</td><td>twice</td><td>4-6, 6-7 · 8-6, 6-5</td><td>4</td></tr>
<tr><td>7</td><td>once</td><td>6-7, 7-8</td><td>2</td></tr>
<tr><td>8</td><td>once</td><td>7-8, 8-6</td><td>2</td></tr>
</tbody>
</table>
<p>Read backwards, this is the quick exam test: <strong>a single odd vertex is enough to rule out an Euler cycle.</strong></p>
<p class="meo">🧠 <strong>Remember:</strong> every door you walk in through, you walk out through another — doors come in pairs.</p>
<div class="pitfall">This part proves only the "⇒" direction (necessary). "All degrees even ⇒ an Euler cycle exists" is the other half (sufficient); it also needs connectivity and is proved on slides 16–18.</div>`,
        `<p class="y-chinh">🎯 Phần 1 của chứng minh: nếu đồ thị có chu trình Euler thì mọi đỉnh có bậc chẵn, vì mỗi lần chu trình đi qua một đỉnh nó dùng hai cạnh của đỉnh đó — một cạnh để vào, một cạnh để ra.</p>
<ol>
<li>Giả sử đồ thị có chu trình Euler.</li>
<li>Mỗi lần đi qua một đỉnh đóng góp 2 vào bậc (degree) của đỉnh đó: chu trình vào bằng một cạnh liên thuộc (incident edge) và ra bằng một cạnh khác.</li>
<li>Đỉnh xuất phát cũng vậy: cạnh đầu tiên rời khỏi nó và cạnh cuối cùng quay về nó — thêm một cặp.</li>
<li>Chu trình dùng mỗi cạnh đúng một lần, nên các cặp này phủ hết mọi cạnh tại mỗi đỉnh: deg(v) = 2 × (số lần đi qua v), tức là số chẵn.</li>
</ol>
<p class="nhan">Kiểm lại trên chu trình Euler mà slide 20 thu được: 1-2-3-4-6-7-8-6-5-3-1</p>
<table>
<thead><tr><th>Đỉnh</th><th>Xuất hiện ở đâu trong chu trình</th><th>Các cạnh dùng tại đó</th><th>Bậc</th></tr></thead>
<tbody>
<tr><td>1</td><td>đầu và cuối</td><td>1-2 (rời đi), 3-1 (quay về)</td><td>2</td></tr>
<tr><td>2</td><td>một lần, ở giữa</td><td>1-2, 2-3</td><td>2</td></tr>
<tr><td>3</td><td>hai lần</td><td>2-3, 3-4 · 5-3, 3-1</td><td>4</td></tr>
<tr><td>4</td><td>một lần</td><td>3-4, 4-6</td><td>2</td></tr>
<tr><td>5</td><td>một lần</td><td>6-5, 5-3</td><td>2</td></tr>
<tr><td>6</td><td>hai lần</td><td>4-6, 6-7 · 8-6, 6-5</td><td>4</td></tr>
<tr><td>7</td><td>một lần</td><td>6-7, 7-8</td><td>2</td></tr>
<tr><td>8</td><td>một lần</td><td>7-8, 8-6</td><td>2</td></tr>
</tbody>
</table>
<p>Đọc theo chiều ngược lại, đây là phép thử nhanh khi đi thi: <strong>chỉ cần một đỉnh bậc lẻ là đủ kết luận không có chu trình Euler.</strong></p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> vào bằng cửa nào thì phải ra bằng một cửa khác — cửa luôn đi theo cặp.</p>
<div class="pitfall">Phần này chỉ chứng minh chiều "⇒" (điều kiện cần — necessary). "Mọi bậc chẵn ⇒ có chu trình Euler" là nửa còn lại (điều kiện đủ — sufficient); nó còn cần thêm liên thông và được chứng minh ở slide 16–18.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ol>
<li>A connected graph has 12 vertices. How many edges does each of its spanning trees have?</li>
<li>On the office graph Kruskal takes E-F (1) first. As which edge does Prim, started at A, take it — and why so late?</li>
<li>Kruskal accepts B-D (4) although B and D both already touch chosen edges. Why is that not a cycle?</li>
<li>A connected graph has degrees 4, 2, 2, 3, 3. Euler cycle? Euler path?</li>
<li>Why is there no walk over all seven Königsberg bridges, not even one that ends somewhere else?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 11 = |V| − 1. (2) As its 5th edge: F becomes reachable only after E joins the tree, and Prim looks only at edges leaving the tree. (3) B is in cluster {B,C} and D in {A,D} — different clusters, so no cycle. (4) No Euler cycle (two odd vertices), but an Euler path from one odd vertex to the other. (5) All four land masses have odd degree; an Euler path allows exactly two.</p>
<p><strong>Next:</strong> lesson 5.D continues with slides 16–30 (building Euler cycles, Theorem 2, Hamilton cycles, graph colouring). For more depth on this part, read lesson 5.6 (minimum spanning trees: Prim and Kruskal, the cut property, union-find with path compression) and lesson 5.7 (Euler tours, Euler cycles and Hamilton).</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ol>
<li>Một đồ thị liên thông có 12 đỉnh. Mỗi cây khung của nó có bao nhiêu cạnh?</li>
<li>Trên đồ thị văn phòng, Kruskal lấy E-F (1) đầu tiên. Prim, xuất phát từ A, lấy nó làm cạnh thứ mấy — và vì sao muộn vậy?</li>
<li>Kruskal nhận B-D (4) dù B và D đều đã dính vào các cạnh được chọn. Vì sao như vậy không tạo chu trình?</li>
<li>Một đồ thị liên thông có các bậc 4, 2, 2, 3, 3. Có chu trình Euler không? Có đường đi Euler không?</li>
<li>Vì sao không có hành trình nào qua đủ bảy cây cầu Königsberg, kể cả hành trình kết thúc ở nơi khác?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 11 = |V| − 1. (2) Cạnh thứ 5: F chỉ đi tới được sau khi E vào cây, mà Prim chỉ xét các cạnh đi ra khỏi cây. (3) B thuộc cụm {B,C}, D thuộc cụm {A,D} — hai cụm khác nhau nên không có chu trình. (4) Không có chu trình Euler (có hai đỉnh bậc lẻ), nhưng có đường đi Euler từ đỉnh lẻ này tới đỉnh lẻ kia. (5) Cả bốn vùng đất đều có bậc lẻ; đường đi Euler chỉ cho phép đúng hai đỉnh lẻ.</p>
<p><strong>Học tiếp:</strong> bài 5.D đi tiếp slide 16–30 (dựng chu trình Euler, Định lý 2, chu trình Hamilton, tô màu đồ thị). Muốn đào sâu phần này, đọc bài 5.6 (cây khung nhỏ nhất: Prim và Kruskal, tính chất lát cắt, union-find (hợp–tìm) có nén đường đi) và bài 5.7 (đường đi, chu trình Euler và Hamilton).</p>`),
    books([
      ['goodrich', "Ch.14 Graph Algorithms — §14.7 Minimum Spanning Trees p.662 · §14.7.1 Prim-Jarník Algorithm p.664 · §14.7.2 Kruskal's Algorithm p.667", "Chương 14 Graph Algorithms — §14.7 Minimum Spanning Trees tr.662 · §14.7.1 Prim-Jarník Algorithm tr.664 · §14.7.2 Kruskal's Algorithm tr.667"],
    ]),
  ].join('\n'),
};

/* ───────── 5.D — 📑 Slide by slide · Graphs, part 2b: Euler cycles, Hamilton & graph colouring (5B-Graphs2, slides 16–30) ───────── */
const L_csd11_2 = {
  title: '5.D — 📑 Slide by slide · Graphs, part 2b: Euler cycles, Hamilton & graph colouring (5B-Graphs2, slides 16–30)|||5.D — 📑 Học theo từng slide · Đồ thị, phần 2b: chu trình Euler, Hamilton & tô màu đồ thị (5B-Graphs2, slide 16–30)',
  slug: 'csd201-slide-csd11-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 16–30 của bộ 5B-Graphs2: chứng minh Định lý 1 bằng thuật toán, ghép chu trình con trên đúng ví dụ 8 đỉnh của slide (1231 → 12346531 → 12346786531), thuật toán tìm chu trình Euler bằng stack vẽ lại đủ 21 bước, Định lý 2 và đường đi Euler, chu trình Hamilton bằng quay lui (tìm một và liệt kê tất cả), tô màu đồ thị (sắc số, tô tuần tự, largest-first, Brélaz) — 12 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.D · 5B-Graphs2, slides 16–30</span>
<h2>Graphs, part 2b — building Euler cycles, Hamilton cycles by backtracking, graph colouring</h2>
<p class="lead">The second half of 5B-Graphs2 (syllabus sessions 37–38, CLO5). It finishes the proof of Theorem 1 with an algorithm, runs the deck's two Euler-cycle algorithms — splicing cycles, then the stack version — on the slides' own 8-vertex example, states Theorem 2 for Euler paths, searches for Hamilton cycles by backtracking and ends with graph colouring. Every algorithm has a Java program whose real output matches the step tables.</p>
<div class="callout"><strong>CLO5:</strong> discuss graphs and their applications; implement a graph with some basic operations. What exams commonly ask about these slides: in the FE, the Euler cycle the stack algorithm produces from a given vertex, whether an Euler path exists and where it must start, Euler versus Hamilton, χ of K<sub>n</sub> and of cycles, the colours given by sequential colouring in a stated order; in the PE, a <code>Graph</code> class with an adjacency matrix in which you write one algorithm, such as the Euler cycle with a stack (slide 21). Discussion questions answered here: CQ13.2 and CQ13.3 (Euler vs Hamilton, what a Hamilton cycle is) and CQ11.1 (colouring with the fewest colours).</div>
<h3>The whole lesson in one table</h3>
<table>
<thead><tr><th>Topic</th><th>Condition / definition</th><th>Algorithm on the slides</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Euler cycle</td><td>connected, every degree even (Theorem 1)</td><td>splice cycles (slide 18) or use a stack (slide 21)</td><td>O(|V| + |E|) with adjacency lists; O(|V|·|E|) when each step scans a matrix row (slide 21's program)</td></tr>
<tr><td>Euler path, no cycle</td><td>connected, exactly two odd vertices (Theorem 2)</td><td>the same algorithm, started at an odd vertex</td><td>the same</td></tr>
<tr><td>Hamilton cycle</td><td>a cycle through every vertex exactly once</td><td>backtracking (slides 24–25)</td><td>exponential in the worst case, up to (n − 1)! orders; NP-complete</td></tr>
<tr><td>Graph colouring</td><td>adjacent vertices get different colours; χ(G) = the fewest colours</td><td>sequential colouring in a chosen order (slides 27–28)</td><td>O(|V|²); the exact χ is NP-complete</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.D · 5B-Graphs2, slide 16–30</span>
<h2>Đồ thị, phần 2b — dựng chu trình Euler, tìm chu trình Hamilton bằng quay lui, tô màu đồ thị</h2>
<p class="lead">Nửa sau của bộ 5B-Graphs2 (buổi 37–38 theo syllabus, CLO5). Bài này hoàn tất chứng minh Định lý 1 bằng một thuật toán, chạy hai thuật toán dựng chu trình Euler của bộ slide — ghép chu trình (splice), rồi bản dùng ngăn xếp (stack) — trên chính ví dụ 8 đỉnh của slide, phát biểu Định lý 2 cho đường đi Euler, tìm chu trình Hamilton bằng quay lui (backtracking) và kết thúc với tô màu đồ thị (graph coloring). Thuật toán nào cũng có chương trình Java, output thật khớp với các bảng từng bước.</p>
<div class="callout"><strong>CLO5:</strong> trình bày về đồ thị và ứng dụng; cài đặt đồ thị với một số thao tác cơ bản. Đề thi hay hỏi gì ở các slide này: FE (thi cuối kỳ) hỏi chu trình Euler mà thuật toán stack cho ra khi xuất phát từ một đỉnh cho trước, có đường đi Euler không và phải bắt đầu ở đâu, Euler khác Hamilton thế nào, χ (sắc số) của K<sub>n</sub> và của chu trình, màu mà thuật toán tô tuần tự gán theo một thứ tự cho trước; PE (thi thực hành) cho sẵn lớp <code>Graph</code> với ma trận kề (adjacency matrix) để bạn viết một thuật toán, chẳng hạn chu trình Euler dùng stack (slide 21). Câu hỏi thảo luận được trả lời ở đây: CQ13.2 và CQ13.3 (Euler khác Hamilton, chu trình Hamilton là gì) và CQ11.1 (tô màu với ít màu nhất).</div>
<h3>Cả bài trong một bảng</h3>
<table>
<thead><tr><th>Chủ đề</th><th>Điều kiện / định nghĩa</th><th>Thuật toán trên slide</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>Chu trình Euler (Euler cycle)</td><td>liên thông, mọi bậc chẵn (Định lý 1)</td><td>ghép chu trình (slide 18) hoặc dùng stack (slide 21)</td><td>O(|V| + |E|) với danh sách kề; O(|V|·|E|) khi mỗi bước quét một hàng ma trận (chương trình của slide 21)</td></tr>
<tr><td>Đường đi Euler, không có chu trình</td><td>liên thông, đúng hai đỉnh bậc lẻ (Định lý 2)</td><td>cùng thuật toán, xuất phát từ một đỉnh lẻ</td><td>như trên</td></tr>
<tr><td>Chu trình Hamilton (Hamilton cycle)</td><td>chu trình qua mọi đỉnh đúng một lần</td><td>quay lui (backtracking, slide 24–25)</td><td>hàm mũ trong trường hợp xấu nhất, tới (n − 1)! thứ tự; NP-đầy đủ (NP-complete)</td></tr>
<tr><td>Tô màu đồ thị (graph coloring)</td><td>hai đỉnh kề khác màu; χ(G) = số màu ít nhất</td><td>tô tuần tự theo một thứ tự chọn trước (slide 27–28)</td><td>O(|V|²); tìm χ chính xác là NP-đầy đủ</td></tr>
</tbody>
</table>`),
    walkHead('csd11', 16, 30),
    walk('csd11', [
      [16, 'Sufficient condition for Euler cycle',
        `<p class="y-chinh">🎯 Part 2 of the proof is an algorithm: if every degree is even, walk along unused edges from any vertex v0 until you are stuck — you are back at v0 with a cycle; if edges remain, build another cycle from a vertex on it and splice the two together.</p>
<ol>
<li>Start at an arbitrary non-isolated vertex v0 and take any edge (v0, v1).</li>
<li>From v1 take any unused edge, and so on. Each step uses a new edge, so the walk stops after at most |E| steps.</li>
<li>It stops at v0 (slide 17 explains why), which gives a cycle with distinct edges.</li>
<li>If the cycle contains every edge, it is an Euler cycle. If not, start again from a vertex of this cycle that still has unused edges and splice the new cycle into the old one; continue until all edges are used.</li>
</ol>
<p>Run on the slides' own example graph (slide 19, vertices 1–8), always taking the unused edge to the smallest vertex:</p>
<pre><code class="language-java">public class WalkUntilStuck {
    public static void main(String[] args) {
        int n = 8;
        int[][] edges = {{1, 2}, {2, 3}, {3, 1}, {3, 4}, {4, 6}, {6, 5}, {5, 3}, {6, 7}, {7, 8}, {8, 6}};
        int[][] a = new int[n + 1][n + 1];           // vertices 1..8; a[u][w] = 1 while edge u-w is unused
        int[] deg = new int[n + 1], used = new int[n + 1];
        for (int[] e : edges) { a[e[0]][e[1]] = a[e[1]][e[0]] = 1; deg[e[0]]++; deg[e[1]]++; }
        int v0 = 1, u = v0, count = 0;
        String walk = "" + v0;
        System.out.println("start at v0 = " + v0);
        while (true) {
            int w = 1;
            while (w &lt;= n &amp;&amp; a[u][w] == 0) w++;       // an unused edge at u (smallest end first)
            if (w &gt; n) break;                          // none left: stuck
            a[u][w] = a[w][u] = 0;                     // an edge is walked only once
            used[u]++;
            used[w]++;
            count++;
            walk += " " + w;
            System.out.println("walk " + u + "-" + w + ", at " + w + ": " + used[w] + " of " + deg[w]
                    + " edges used" + (used[w] &lt; deg[w] ? " -&gt; can leave" : " -&gt; stuck"));
            u = w;
        }
        System.out.println("stuck at " + u + (u == v0 ? " = v0" : "") + ": closed walk " + walk
                + ", " + count + " of " + edges.length + " edges");
    }
}</code></pre>
<div class="out">start at v0 = 1<br>
walk 1-2, at 2: 1 of 2 edges used -&gt; can leave<br>
walk 2-3, at 3: 1 of 4 edges used -&gt; can leave<br>
walk 3-1, at 1: 2 of 2 edges used -&gt; stuck<br>
stuck at 1 = v0: closed walk 1 2 3 1, 3 of 10 edges</div>
<p>The first walk closes after 3 of the 10 edges — a cycle, but not yet an Euler cycle. Splicing in the rest is the subject of slides 18–20.</p>
<p class="meo">🧠 <strong>Remember:</strong> in an all-even graph, "walk until stuck" always produces a closed walk; the only question is whether it used every edge.</p>`,
        `<p class="y-chinh">🎯 Phần 2 của chứng minh là một thuật toán: nếu mọi bậc đều chẵn, cứ đi theo các cạnh chưa dùng từ một đỉnh v0 bất kỳ cho tới khi bị kẹt — lúc đó ta đã về lại v0 và có một chu trình; nếu còn cạnh chưa dùng, dựng thêm một chu trình từ một đỉnh nằm trên nó rồi ghép (splice) hai chu trình lại.</p>
<ol>
<li>Xuất phát tại một đỉnh không cô lập (non-isolated) v0 tuỳ ý, đi theo một cạnh (v0, v1) bất kỳ.</li>
<li>Từ v1 đi theo một cạnh chưa dùng bất kỳ, cứ thế tiếp tục. Mỗi bước dùng một cạnh mới, nên hành trình phải dừng sau nhiều nhất |E| bước.</li>
<li>Nó dừng tại v0 (slide 17 giải thích vì sao), cho ta một chu trình (cycle) gồm các cạnh khác nhau.</li>
<li>Nếu chu trình chứa mọi cạnh, đó là chu trình Euler. Nếu chưa, lặp lại thủ tục từ một đỉnh thuộc chu trình mà vẫn còn cạnh chưa dùng, rồi ghép chu trình mới vào chu trình cũ; tiếp tục cho tới khi dùng hết mọi cạnh.</li>
</ol>
<p>Chạy trên chính đồ thị ví dụ của slide (slide 19, đỉnh 1–8), luôn chọn cạnh chưa dùng dẫn tới đỉnh nhỏ nhất:</p>
<pre><code class="language-java">public class WalkUntilStuck {
    public static void main(String[] args) {
        int n = 8;
        int[][] edges = {{1, 2}, {2, 3}, {3, 1}, {3, 4}, {4, 6}, {6, 5}, {5, 3}, {6, 7}, {7, 8}, {8, 6}};
        int[][] a = new int[n + 1][n + 1];           // đỉnh 1..8; a[u][w] = 1 khi cạnh u-w chưa dùng
        int[] deg = new int[n + 1], used = new int[n + 1];
        for (int[] e : edges) { a[e[0]][e[1]] = a[e[1]][e[0]] = 1; deg[e[0]]++; deg[e[1]]++; }
        int v0 = 1, u = v0, count = 0;
        String walk = "" + v0;
        System.out.println("start at v0 = " + v0);
        while (true) {
            int w = 1;
            while (w &lt;= n &amp;&amp; a[u][w] == 0) w++;       // một cạnh chưa dùng tại u (đầu nhỏ nhất trước)
            if (w &gt; n) break;                          // hết cạnh: bị kẹt
            a[u][w] = a[w][u] = 0;                     // mỗi cạnh chỉ đi một lần
            used[u]++;
            used[w]++;
            count++;
            walk += " " + w;
            System.out.println("walk " + u + "-" + w + ", at " + w + ": " + used[w] + " of " + deg[w]
                    + " edges used" + (used[w] &lt; deg[w] ? " -&gt; can leave" : " -&gt; stuck"));
            u = w;
        }
        System.out.println("stuck at " + u + (u == v0 ? " = v0" : "") + ": closed walk " + walk
                + ", " + count + " of " + edges.length + " edges");
    }
}</code></pre>
<div class="out">start at v0 = 1<br>
walk 1-2, at 2: 1 of 2 edges used -&gt; can leave<br>
walk 2-3, at 3: 1 of 4 edges used -&gt; can leave<br>
walk 3-1, at 1: 2 of 2 edges used -&gt; stuck<br>
stuck at 1 = v0: closed walk 1 2 3 1, 3 of 10 edges</div>
<p>Lượt đi đầu tiên khép lại sau 3 trong 10 cạnh — là một chu trình, nhưng chưa phải chu trình Euler. Việc ghép phần còn lại vào là nội dung của slide 18–20.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trong đồ thị mọi bậc chẵn, "cứ đi tới khi kẹt" luôn cho một hành trình khép kín; câu hỏi duy nhất là nó đã dùng hết cạnh hay chưa.</p>`],
      [17, 'Note',
        `<p class="y-chinh">🎯 Why the walk of slide 16 can only get stuck at v0: whenever it enters another vertex, an odd number of that vertex's edges has been used, and since its degree is even at least one edge is still free to leave by.</p>
<ul>
<li><strong>At a vertex v ≠ v0</strong>: each earlier visit used 2 of its edges (in and out), and entering now uses 1 more — an odd count. Even degree minus an odd count leaves at least 1 unused edge: you can always leave.</li>
<li><strong>At v0</strong>: the very first step used 1 edge without entering, so after entering v0 the count is even — possibly all of its edges. Getting stuck is possible only here, and then the walk is already a closed cycle.</li>
<li>In the output of slide 16: "1 of 2" at vertex 2 and "1 of 4" at vertex 3 (odd, can leave); "2 of 2" at vertex 1 = v0 (stuck).</li>
</ul>
<pre><code class="language-java">public class StuckWhere {
    // Walk from s, always along the unused edge to the smallest vertex, until stuck
    static String walkFrom(String label, int[][] edges, int s) {
        int n = label.length();
        int[][] b = new int[n][n];
        for (int[] e : edges) { b[e[0]][e[1]]++; b[e[1]][e[0]]++; }
        int u = s, k = 0;
        while (true) {
            int w = 0;
            while (w &lt; n &amp;&amp; b[u][w] == 0) w++;
            if (w == n) break;
            b[u][w]--;
            b[w][u]--;
            u = w;
            k++;
        }
        return "  start " + label.charAt(s) + " -&gt; stuck at " + label.charAt(u) + " after " + k + " edges"
                + (u == s ? "" : "   &lt;- not the start");
    }

    public static void main(String[] args) {
        int[][] g = {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 5}, {5, 4}, {4, 2}, {5, 6}, {6, 7}, {7, 5}};  // slide 19
        System.out.println("slide 19 graph, every degree even:");
        for (int s = 0; s &lt; 8; s++) System.out.println(walkFrom("12345678", g, s));
        int[][] t = {{0, 1}, {1, 2}, {2, 0}, {2, 3}};                                            // C and D odd
        System.out.println("triangle A-B-C plus edge C-D (C, D odd):");
        System.out.println(walkFrom("ABCD", t, 0));
        System.out.println(walkFrom("ABCD", t, 2));
        System.out.println(walkFrom("ABCD", t, 3));
    }
}</code></pre>
<div class="out">slide 19 graph, every degree even:<br>
&nbsp;&nbsp;start 1 -&gt; stuck at 1 after 3 edges<br>
&nbsp;&nbsp;start 2 -&gt; stuck at 2 after 3 edges<br>
&nbsp;&nbsp;start 3 -&gt; stuck at 3 after 7 edges<br>
&nbsp;&nbsp;start 4 -&gt; stuck at 4 after 7 edges<br>
&nbsp;&nbsp;start 5 -&gt; stuck at 5 after 7 edges<br>
&nbsp;&nbsp;start 6 -&gt; stuck at 6 after 10 edges<br>
&nbsp;&nbsp;start 7 -&gt; stuck at 7 after 10 edges<br>
&nbsp;&nbsp;start 8 -&gt; stuck at 8 after 10 edges<br>
triangle A-B-C plus edge C-D (C, D odd):<br>
&nbsp;&nbsp;start A -&gt; stuck at A after 3 edges<br>
&nbsp;&nbsp;start C -&gt; stuck at D after 4 edges &nbsp;&nbsp;&lt;- not the start<br>
&nbsp;&nbsp;start D -&gt; stuck at C after 4 edges &nbsp;&nbsp;&lt;- not the start</div>
<p>With all degrees even, every start gets stuck exactly where it began (after 3, 7 or 10 edges, depending on the start). In the triangle with a tail, C and D have odd degree, and starting at C the walk gets stuck at D — the even-degree condition is what makes the argument work.</p>
<div class="pitfall">The proof needs every degree even. With two odd vertices the walk may end at the other odd vertex — not a failure, but the Euler path of Theorem 2 (slide 22), which must start at an odd vertex.</div>`,
        `<p class="y-chinh">🎯 Vì sao hành trình ở slide 16 chỉ có thể kẹt tại v0: mỗi khi đi vào một đỉnh khác, số cạnh đã dùng của đỉnh đó là số lẻ, mà bậc của nó chẵn, nên luôn còn ít nhất một cạnh để đi ra.</p>
<ul>
<li><strong>Tại đỉnh v ≠ v0</strong>: mỗi lần ghé trước đó dùng 2 cạnh của nó (vào và ra), lần đi vào lúc này dùng thêm 1 — tổng là số lẻ. Bậc chẵn trừ đi số lẻ thì còn ít nhất 1 cạnh chưa dùng: luôn đi ra được.</li>
<li><strong>Tại v0</strong>: bước đầu tiên đã dùng 1 cạnh mà không cần đi vào, nên sau khi đi vào v0 số cạnh đã dùng là số chẵn — có thể là tất cả. Chỉ ở đây mới có thể bị kẹt, và khi đó hành trình đã là một chu trình khép kín.</li>
<li>Trong output của slide 16: "1 of 2" tại đỉnh 2 và "1 of 4" tại đỉnh 3 (số lẻ, đi ra được); "2 of 2" tại đỉnh 1 = v0 (kẹt).</li>
</ul>
<pre><code class="language-java">public class StuckWhere {
    // Đi từ s, luôn theo cạnh chưa dùng tới đỉnh nhỏ nhất, tới khi kẹt
    static String walkFrom(String label, int[][] edges, int s) {
        int n = label.length();
        int[][] b = new int[n][n];
        for (int[] e : edges) { b[e[0]][e[1]]++; b[e[1]][e[0]]++; }
        int u = s, k = 0;
        while (true) {
            int w = 0;
            while (w &lt; n &amp;&amp; b[u][w] == 0) w++;
            if (w == n) break;
            b[u][w]--;
            b[w][u]--;
            u = w;
            k++;
        }
        return "  start " + label.charAt(s) + " -&gt; stuck at " + label.charAt(u) + " after " + k + " edges"
                + (u == s ? "" : "   &lt;- not the start");
    }

    public static void main(String[] args) {
        int[][] g = {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 5}, {5, 4}, {4, 2}, {5, 6}, {6, 7}, {7, 5}};  // đồ thị slide 19
        System.out.println("slide 19 graph, every degree even:");
        for (int s = 0; s &lt; 8; s++) System.out.println(walkFrom("12345678", g, s));
        int[][] t = {{0, 1}, {1, 2}, {2, 0}, {2, 3}};                                            // C và D bậc lẻ
        System.out.println("triangle A-B-C plus edge C-D (C, D odd):");
        System.out.println(walkFrom("ABCD", t, 0));
        System.out.println(walkFrom("ABCD", t, 2));
        System.out.println(walkFrom("ABCD", t, 3));
    }
}</code></pre>
<div class="out">slide 19 graph, every degree even:<br>
&nbsp;&nbsp;start 1 -&gt; stuck at 1 after 3 edges<br>
&nbsp;&nbsp;start 2 -&gt; stuck at 2 after 3 edges<br>
&nbsp;&nbsp;start 3 -&gt; stuck at 3 after 7 edges<br>
&nbsp;&nbsp;start 4 -&gt; stuck at 4 after 7 edges<br>
&nbsp;&nbsp;start 5 -&gt; stuck at 5 after 7 edges<br>
&nbsp;&nbsp;start 6 -&gt; stuck at 6 after 10 edges<br>
&nbsp;&nbsp;start 7 -&gt; stuck at 7 after 10 edges<br>
&nbsp;&nbsp;start 8 -&gt; stuck at 8 after 10 edges<br>
triangle A-B-C plus edge C-D (C, D odd):<br>
&nbsp;&nbsp;start A -&gt; stuck at A after 3 edges<br>
&nbsp;&nbsp;start C -&gt; stuck at D after 4 edges &nbsp;&nbsp;&lt;- not the start<br>
&nbsp;&nbsp;start D -&gt; stuck at C after 4 edges &nbsp;&nbsp;&lt;- not the start</div>
<p>Khi mọi bậc (degree) đều chẵn, xuất phát ở đâu cũng bị kẹt đúng tại chỗ xuất phát (sau 3, 7 hoặc 10 cạnh tuỳ đỉnh đầu). Trong tam giác có đuôi, C và D có bậc lẻ, và xuất phát từ C thì kẹt ở D — chính điều kiện bậc chẵn làm cho lập luận trên đúng.</p>
<div class="pitfall">Chứng minh cần mọi bậc đều chẵn. Khi có hai đỉnh lẻ, hành trình có thể dừng ở đỉnh lẻ còn lại — đó không phải thất bại mà chính là đường đi Euler (Euler path) của Định lý 2 (slide 22), vốn phải xuất phát từ một đỉnh lẻ.</div>`],
      [18, 'A procedure for constructing an Euler cycle',
        `<p class="y-chinh">🎯 Euler(G) builds one cycle, deletes its edges to get the subgraph H, then repeatedly takes a vertex that lies on the cycle and still has edges in H, builds a subcycle there and splices it in — until H has no edges left.</p>
<ol>
<li><strong>Input</strong>: a connected graph whose vertices all have even degree. <strong>Output</strong>: an Euler cycle.</li>
<li>Construct a cycle in G (walk until stuck, slide 16) and remove its edges → subgraph H.</li>
<li>While H has edges: find a non-isolated vertex v that is both in the cycle and in H — the slide notes that the connectivity of G guarantees one exists.</li>
<li>Construct a subcycle in H starting at v, splice it into the cycle at v, and remove its edges from H.</li>
<li>Return the cycle.</li>
</ol>
<pre><code class="language-java">import java.util.ArrayList;

public class EulerSplice {
    static int n = 8;
    static int[][] h = new int[n + 1][n + 1];        // H = edges not used yet (starts as all of G)

    static ArrayList&lt;Integer&gt; closedWalk(int v0) {   // walk unused edges from v0 until stuck: back at v0
        ArrayList&lt;Integer&gt; c = new ArrayList&lt;Integer&gt;();
        c.add(v0);
        int u = v0;
        while (true) {
            int w = 1;
            while (w &lt;= n &amp;&amp; h[u][w] == 0) w++;
            if (w &gt; n) return c;
            h[u][w] = h[w][u] = 0;                   // remove the edge from H
            c.add(w);
            u = w;
        }
    }

    static boolean inH(int v) { for (int w = 1; w &lt;= n; w++) if (h[v][w] &gt; 0) return true; return false; }

    static int edgesLeft() {
        int k = 0;
        for (int u = 1; u &lt;= n; u++) for (int w = u + 1; w &lt;= n; w++) k += h[u][w];
        return k;
    }

    static String show(ArrayList&lt;Integer&gt; c) {       // 1231 = the slide's notation
        StringBuilder s = new StringBuilder();
        for (int x : c) s.append(x);
        return s.toString();
    }

    public static void main(String[] args) {
        int[][] edges = {{1, 2}, {2, 3}, {3, 1}, {3, 4}, {4, 6}, {6, 5}, {5, 3}, {6, 7}, {7, 8}, {8, 6}};
        for (int[] e : edges) h[e[0]][e[1]] = h[e[1]][e[0]] = 1;
        ArrayList&lt;Integer&gt; cycle = closedWalk(1);
        System.out.println("cycle " + show(cycle) + ", H has " + edgesLeft() + " edges left");
        while (edgesLeft() &gt; 0) {
            int pos = 0;
            while (!inH(cycle.get(pos))) pos++;       // first vertex of the cycle that still has edges in H
            int v = cycle.get(pos);
            ArrayList&lt;Integer&gt; sub = closedWalk(v);
            cycle.remove(pos);                        // splice: v is replaced by the whole subcycle
            cycle.addAll(pos, sub);
            System.out.println("subcycle " + show(sub) + " spliced in at " + v + " -&gt; " + show(cycle)
                    + ", H has " + edgesLeft() + " edges left");
        }
        System.out.println("Euler cycle: " + show(cycle));
    }
}</code></pre>
<div class="out">cycle 1231, H has 7 edges left<br>
subcycle 34653 spliced in at 3 -&gt; 12346531, H has 3 edges left<br>
subcycle 6786 spliced in at 6 -&gt; 12346786531, H has 0 edges left<br>
Euler cycle: 12346786531</div>
<p>The output reproduces the slide's own example exactly: 1231, then 34653 spliced at 3 → 12346531, then 6786 spliced at 6 → 12346786531 (slides 19–20).</p>
<p><strong>Big-O:</strong> every edge is walked exactly once. With adjacency lists and a linked list for the cycle, a splice is O(1) and the whole procedure is O(|V| + |E|) — this is Hierholzer's algorithm (lesson 5.7). The simple version above rescans matrix rows and shifts an ArrayList, which is slower but more than enough for small graphs.</p>
<div class="pitfall">Why must v lie on the current cycle? A subcycle that shares no vertex with the cycle has no place to be spliced in. The slide's comment "guaranteed by G's connectivity" is exactly why the theorem needs a connected graph.</div>`,
        `<p class="y-chinh">🎯 Euler(G) dựng một chu trình, xoá các cạnh của nó để được đồ thị con (subgraph) H, rồi lặp: lấy một đỉnh vừa nằm trên chu trình vừa còn cạnh trong H, dựng một chu trình con (subcycle) tại đó và ghép (splice) vào — cho tới khi H hết cạnh.</p>
<ol>
<li><strong>Đầu vào</strong>: đồ thị liên thông, mọi đỉnh có bậc chẵn. <strong>Đầu ra</strong>: một chu trình Euler.</li>
<li>Dựng một chu trình trong G (đi tới khi kẹt, slide 16) và xoá các cạnh của nó → đồ thị con H.</li>
<li>Khi H còn cạnh: tìm một đỉnh không cô lập (non-isolated) v vừa thuộc chu trình vừa thuộc H — slide ghi chú rằng tính liên thông của G bảo đảm luôn có đỉnh như vậy.</li>
<li>Dựng một chu trình con trong H bắt đầu từ v, ghép nó vào chu trình tại v, rồi xoá các cạnh của nó khỏi H.</li>
<li>Trả về chu trình.</li>
</ol>
<pre><code class="language-java">import java.util.ArrayList;

public class EulerSplice {
    static int n = 8;
    static int[][] h = new int[n + 1][n + 1];        // H = các cạnh chưa dùng (ban đầu là cả G)

    static ArrayList&lt;Integer&gt; closedWalk(int v0) {   // đi các cạnh chưa dùng từ v0 tới khi kẹt: về lại v0
        ArrayList&lt;Integer&gt; c = new ArrayList&lt;Integer&gt;();
        c.add(v0);
        int u = v0;
        while (true) {
            int w = 1;
            while (w &lt;= n &amp;&amp; h[u][w] == 0) w++;
            if (w &gt; n) return c;
            h[u][w] = h[w][u] = 0;                   // xoá cạnh khỏi H
            c.add(w);
            u = w;
        }
    }

    static boolean inH(int v) { for (int w = 1; w &lt;= n; w++) if (h[v][w] &gt; 0) return true; return false; }

    static int edgesLeft() {
        int k = 0;
        for (int u = 1; u &lt;= n; u++) for (int w = u + 1; w &lt;= n; w++) k += h[u][w];
        return k;
    }

    static String show(ArrayList&lt;Integer&gt; c) {       // 1231 = cách viết của slide
        StringBuilder s = new StringBuilder();
        for (int x : c) s.append(x);
        return s.toString();
    }

    public static void main(String[] args) {
        int[][] edges = {{1, 2}, {2, 3}, {3, 1}, {3, 4}, {4, 6}, {6, 5}, {5, 3}, {6, 7}, {7, 8}, {8, 6}};
        for (int[] e : edges) h[e[0]][e[1]] = h[e[1]][e[0]] = 1;
        ArrayList&lt;Integer&gt; cycle = closedWalk(1);
        System.out.println("cycle " + show(cycle) + ", H has " + edgesLeft() + " edges left");
        while (edgesLeft() &gt; 0) {
            int pos = 0;
            while (!inH(cycle.get(pos))) pos++;       // đỉnh đầu tiên của chu trình còn cạnh trong H
            int v = cycle.get(pos);
            ArrayList&lt;Integer&gt; sub = closedWalk(v);
            cycle.remove(pos);                        // ghép: thay v bằng cả chu trình con
            cycle.addAll(pos, sub);
            System.out.println("subcycle " + show(sub) + " spliced in at " + v + " -&gt; " + show(cycle)
                    + ", H has " + edgesLeft() + " edges left");
        }
        System.out.println("Euler cycle: " + show(cycle));
    }
}</code></pre>
<div class="out">cycle 1231, H has 7 edges left<br>
subcycle 34653 spliced in at 3 -&gt; 12346531, H has 3 edges left<br>
subcycle 6786 spliced in at 6 -&gt; 12346786531, H has 0 edges left<br>
Euler cycle: 12346786531</div>
<p>Output tái hiện đúng ví dụ của chính slide: 1231, rồi 34653 ghép tại 3 → 12346531, rồi 6786 ghép tại 6 → 12346786531 (slide 19–20).</p>
<p><strong>Big-O:</strong> mỗi cạnh được đi đúng một lần. Dùng danh sách kề (adjacency list) và danh sách liên kết (linked list) cho chu trình thì mỗi lần ghép là O(1) và cả thủ tục là O(|V| + |E|) — đây chính là thuật toán Hierholzer (bài 5.7). Bản đơn giản ở trên quét lại hàng ma trận và dời phần tử trong ArrayList nên chậm hơn, nhưng thừa đủ cho đồ thị nhỏ.</p>
<div class="pitfall">Vì sao v bắt buộc phải nằm trên chu trình hiện tại? Một chu trình con không có đỉnh chung nào với chu trình thì không có chỗ để ghép vào. Lời chú thích "guaranteed by G's connectivity" (được bảo đảm nhờ G liên thông) của slide chính là lý do định lý cần đồ thị liên thông.</div>`],
      [19, 'Example',
        `<p class="y-chinh">🎯 The slide's example on vertices 1–8: a first cycle 1231, the remaining subgraph H, a subcycle 34653 found at vertex 3, and the splice that gives 12346531.</p>
<p>The graph G drawn from the slide's text — the vertex rows 1 3 5 7 over 2 4 6 8, and the 10 edges used by the cycles of slides 19–20 (the final Euler cycle uses every edge, so these are all of G's edges). Compare it with the picture on the slide:</p>
<pre><code class="language-plaintext">1 ------- 3 ------- 5         7
|       / |         |       / |
|    /    |         |    /    |
| /       |         | /       |
2         4 ------- 6 ------- 8</code></pre>
<table>
<thead><tr><th>Stage</th><th>Cycle so far</th><th>Edges left in H</th><th>What happens</th></tr></thead>
<tbody>
<tr><td>1</td><td>1231</td><td>3-4, 4-6, 6-5, 5-3, 6-7, 7-8, 8-6 (7 edges)</td><td>the walk from 1 gets stuck back at 1</td></tr>
<tr><td>2</td><td>1231</td><td>the same 7</td><td>1 and 2 have no edges left in H; 3 has → v = 3</td></tr>
<tr><td>3</td><td>subcycle 34653</td><td>6-7, 7-8, 8-6 (3 edges)</td><td>walk in H from 3: 3 → 4 → 6 → 5 → 3 (at 6, the smallest of 5, 7, 8)</td></tr>
<tr><td>4</td><td>12346531</td><td>the same 3</td><td>splice: the one 3 of 1231 is replaced by 34653</td></tr>
</tbody>
</table>
<p class="nhan">H after stage 1 (the edges of 1231 removed)</p>
<pre><code class="language-plaintext">1         3 ------- 5         7
          |         |       / |
          |         |    /    |
          |         | /       |
2         4 ------- 6 ------- 8</code></pre>
<p>Degrees in G: vertices 3 and 6 have degree 4, all the others degree 2 — all even, so Euler(G) applies.</p>
<p>Why the subcycle always closes: removing a cycle takes an even number of edges from every vertex on it (2 per pass), so every degree in H is still even — the argument of slide 17 works again inside H.</p>
<div class="pitfall">Any vertex that is on the cycle and still has edges in H may be chosen, and any unused edge may be followed; other choices give a different but equally valid Euler cycle. When an FE question fixes a rule (for example "smallest vertex first", as here), follow it exactly.</div>
<p class="meo">🧠 <strong>Remember:</strong> splicing replaces <em>one</em> occurrence of v by the whole subcycle, which starts and ends with v: 12[3]1 → 12[34653]1.</p>`,
        `<p class="y-chinh">🎯 Ví dụ của slide trên các đỉnh 1–8: chu trình đầu tiên 1231, đồ thị con H còn lại, chu trình con 34653 tìm được tại đỉnh 3, và phép ghép cho ra 12346531.</p>
<p>Đồ thị G vẽ lại từ phần chữ của slide — hai hàng đỉnh 1 3 5 7 ở trên, 2 4 6 8 ở dưới — với 10 cạnh mà các chu trình ở slide 19–20 dùng tới (chu trình Euler cuối cùng dùng mọi cạnh, nên đây là toàn bộ cạnh của G). Hãy đối chiếu với hình trên slide:</p>
<pre><code class="language-plaintext">1 ------- 3 ------- 5         7
|       / |         |       / |
|    /    |         |    /    |
| /       |         | /       |
2         4 ------- 6 ------- 8</code></pre>
<table>
<thead><tr><th>Giai đoạn</th><th>Chu trình hiện có</th><th>Các cạnh còn trong H</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>1</td><td>1231</td><td>3-4, 4-6, 6-5, 5-3, 6-7, 7-8, 8-6 (7 cạnh)</td><td>đi từ 1 và bị kẹt khi quay về 1</td></tr>
<tr><td>2</td><td>1231</td><td>vẫn 7 cạnh đó</td><td>1 và 2 không còn cạnh nào trong H; 3 còn → v = 3</td></tr>
<tr><td>3</td><td>chu trình con 34653</td><td>6-7, 7-8, 8-6 (3 cạnh)</td><td>đi trong H từ 3: 3 → 4 → 6 → 5 → 3 (tại 6 chọn đỉnh nhỏ nhất trong 5, 7, 8)</td></tr>
<tr><td>4</td><td>12346531</td><td>vẫn 3 cạnh đó</td><td>ghép (splice): số 3 duy nhất của 1231 được thay bằng 34653</td></tr>
</tbody>
</table>
<p class="nhan">H sau giai đoạn 1 (đã xoá các cạnh của 1231)</p>
<pre><code class="language-plaintext">1         3 ------- 5         7
          |         |       / |
          |         |    /    |
          |         | /       |
2         4 ------- 6 ------- 8</code></pre>
<p>Bậc (degree) trong G: đỉnh 3 và 6 có bậc 4, mọi đỉnh khác bậc 2 — tất cả đều chẵn, nên Euler(G) áp dụng được.</p>
<p>Vì sao chu trình con luôn khép lại được: bỏ đi một chu trình thì mỗi đỉnh trên nó mất một số chẵn cạnh (2 cạnh cho mỗi lần đi qua), nên mọi bậc trong H vẫn chẵn — lập luận của slide 17 lại đúng ngay bên trong H.</p>
<div class="pitfall">Đỉnh nào vừa nằm trên chu trình vừa còn cạnh trong H đều được chọn, và đi theo cạnh chưa dùng nào cũng được; chọn khác thì ra một chu trình Euler khác nhưng vẫn đúng. Khi câu FE (thi cuối kỳ) đã cho quy tắc (ví dụ "đỉnh nhỏ nhất trước", như ở đây) thì phải theo đúng quy tắc đó.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ghép là thay <em>một</em> lần xuất hiện của v bằng cả chu trình con, vốn bắt đầu và kết thúc bằng v: 12[3]1 → 12[34653]1.</p>`],
      [20, 'Example (cont.)',
        `<p class="y-chinh">🎯 The last round: H now holds only the triangle 6-7-8; the subcycle 6786 is spliced into 12346531 at vertex 6, H becomes empty, and the Euler cycle is 12346786531.</p>
<table>
<thead><tr><th>Stage</th><th>Cycle so far</th><th>Edges left in H</th><th>What happens</th></tr></thead>
<tbody>
<tr><td>5</td><td>12346531</td><td>6-7, 7-8, 8-6 (3 edges)</td><td>scan the cycle: 1, 2, 3, 4 have no edges in H; 6 has → v = 6</td></tr>
<tr><td>6</td><td>subcycle 6786</td><td>none</td><td>walk in H from 6: 6 → 7 → 8 → 6</td></tr>
<tr><td>7</td><td>12346786531</td><td>none</td><td>splice at 6: 1234[6786]531; H is empty → stop</td></tr>
</tbody>
</table>
<p class="nhan">H before stage 6 — only the triangle 6-7-8 is left</p>
<pre><code class="language-plaintext">1         3         5         7
                            / |
                         /    |
                      /       |
2         4         6 ------- 8</code></pre>
<pre><code class="language-java">public class CheckEulerCycle {
    static int[][] edges = {{1, 2}, {2, 3}, {3, 1}, {3, 4}, {4, 6}, {6, 5}, {5, 3}, {6, 7}, {7, 8}, {8, 6}};

    static String check(String c) {
        int[][] left = new int[9][9];
        for (int[] e : edges) { left[e[0]][e[1]]++; left[e[1]][e[0]]++; }
        for (int i = 0; i + 1 &lt; c.length(); i++) {
            int u = c.charAt(i) - '0', w = c.charAt(i + 1) - '0';
            if (left[u][w] == 0) return "NO, " + u + "-" + w + " is not an edge (or is used twice)";
            left[u][w]--;
            left[w][u]--;
        }
        int walked = c.length() - 1;
        if (walked &lt; edges.length) return "NO, only " + walked + " of " + edges.length + " edges";
        if (c.charAt(0) != c.charAt(walked)) return "NO, it does not return to " + c.charAt(0);
        return "YES, all " + walked + " edges once, back at " + c.charAt(0);
    }

    public static void main(String[] args) {
        int[] deg = new int[9];
        for (int[] e : edges) { deg[e[0]]++; deg[e[1]]++; }
        StringBuilder s = new StringBuilder("degrees:");
        for (int v = 1; v &lt;= 8; v++) s.append(' ').append(v).append('=').append(deg[v]);
        System.out.println(s);
        System.out.println("12346786531  (slide 20)     : " + check("12346786531"));
        System.out.println("13568764321  (reversed)     : " + check("13568764321"));
        System.out.println("12346531     (before splice): " + check("12346531"));
        System.out.println("123466786531 (6 written 2x) : " + check("123466786531"));
    }
}</code></pre>
<div class="out">degrees: 1=2 2=2 3=4 4=2 5=2 6=4 7=2 8=2<br>
12346786531 &nbsp;(slide 20) &nbsp;&nbsp;&nbsp;&nbsp;: YES, all 10 edges once, back at 1<br>
13568764321 &nbsp;(reversed) &nbsp;&nbsp;&nbsp;&nbsp;: YES, all 10 edges once, back at 1<br>
12346531 &nbsp;&nbsp;&nbsp;&nbsp;(before splice): NO, only 7 of 10 edges<br>
123466786531 (6 written 2x) : NO, 6-6 is not an edge (or is used twice)</div>
<ul>
<li>The result uses all 10 edges once and returns to 1. Vertices 3 and 6 (degree 4) appear twice, the others once — as slide 15 predicts.</li>
<li>The reversed sequence 13568764321 is also an Euler cycle: in an undirected graph a cycle can be read both ways. It is exactly what the stack algorithm of slide 21 produces.</li>
<li>The check also rejects what is not an Euler cycle: 12346531 has only 7 of the 10 edges.</li>
</ul>
<div class="pitfall">Splicing by <em>inserting</em> the subcycle next to v writes v twice: 1234 6 6786 531 contains "6-6", which is not an edge (last line of the output). Replace the single 6 by 6786; do not add 6786 beside it.</div>`,
        `<p class="y-chinh">🎯 Vòng cuối: H lúc này chỉ còn tam giác 6-7-8; chu trình con 6786 được ghép vào 12346531 tại đỉnh 6, H hết cạnh, và chu trình Euler là 12346786531.</p>
<table>
<thead><tr><th>Giai đoạn</th><th>Chu trình hiện có</th><th>Các cạnh còn trong H</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>5</td><td>12346531</td><td>6-7, 7-8, 8-6 (3 cạnh)</td><td>dò theo chu trình: 1, 2, 3, 4 không còn cạnh trong H; 6 còn → v = 6</td></tr>
<tr><td>6</td><td>chu trình con 6786</td><td>không còn</td><td>đi trong H từ 6: 6 → 7 → 8 → 6</td></tr>
<tr><td>7</td><td>12346786531</td><td>không còn</td><td>ghép tại 6: 1234[6786]531; H rỗng → dừng</td></tr>
</tbody>
</table>
<p class="nhan">H trước giai đoạn 6 — chỉ còn tam giác 6-7-8</p>
<pre><code class="language-plaintext">1         3         5         7
                            / |
                         /    |
                      /       |
2         4         6 ------- 8</code></pre>
<pre><code class="language-java">public class CheckEulerCycle {
    static int[][] edges = {{1, 2}, {2, 3}, {3, 1}, {3, 4}, {4, 6}, {6, 5}, {5, 3}, {6, 7}, {7, 8}, {8, 6}};

    static String check(String c) {
        int[][] left = new int[9][9];
        for (int[] e : edges) { left[e[0]][e[1]]++; left[e[1]][e[0]]++; }
        for (int i = 0; i + 1 &lt; c.length(); i++) {
            int u = c.charAt(i) - '0', w = c.charAt(i + 1) - '0';
            if (left[u][w] == 0) return "NO, " + u + "-" + w + " is not an edge (or is used twice)";
            left[u][w]--;
            left[w][u]--;
        }
        int walked = c.length() - 1;
        if (walked &lt; edges.length) return "NO, only " + walked + " of " + edges.length + " edges";
        if (c.charAt(0) != c.charAt(walked)) return "NO, it does not return to " + c.charAt(0);
        return "YES, all " + walked + " edges once, back at " + c.charAt(0);
    }

    public static void main(String[] args) {
        int[] deg = new int[9];
        for (int[] e : edges) { deg[e[0]]++; deg[e[1]]++; }
        StringBuilder s = new StringBuilder("degrees:");
        for (int v = 1; v &lt;= 8; v++) s.append(' ').append(v).append('=').append(deg[v]);
        System.out.println(s);
        System.out.println("12346786531  (slide 20)     : " + check("12346786531"));
        System.out.println("13568764321  (reversed)     : " + check("13568764321"));
        System.out.println("12346531     (before splice): " + check("12346531"));
        System.out.println("123466786531 (6 written 2x) : " + check("123466786531"));
    }
}</code></pre>
<div class="out">degrees: 1=2 2=2 3=4 4=2 5=2 6=4 7=2 8=2<br>
12346786531 &nbsp;(slide 20) &nbsp;&nbsp;&nbsp;&nbsp;: YES, all 10 edges once, back at 1<br>
13568764321 &nbsp;(reversed) &nbsp;&nbsp;&nbsp;&nbsp;: YES, all 10 edges once, back at 1<br>
12346531 &nbsp;&nbsp;&nbsp;&nbsp;(before splice): NO, only 7 of 10 edges<br>
123466786531 (6 written 2x) : NO, 6-6 is not an edge (or is used twice)</div>
<ul>
<li>Kết quả dùng đủ 10 cạnh, mỗi cạnh một lần, và quay về 1. Đỉnh 3 và 6 (bậc 4) xuất hiện hai lần, các đỉnh khác một lần — đúng như slide 15 dự đoán.</li>
<li>Dãy đảo ngược 13568764321 cũng là một chu trình Euler: trong đồ thị vô hướng (undirected graph), chu trình đọc chiều nào cũng được. Đó chính là thứ thuật toán dùng ngăn xếp (stack) ở slide 21 cho ra.</li>
<li>Phép kiểm cũng loại được thứ không phải chu trình Euler: 12346531 mới dùng 7 trong 10 cạnh.</li>
</ul>
<div class="pitfall">Ghép bằng cách <em>chèn</em> chu trình con vào cạnh v sẽ viết v hai lần: 1234 6 6786 531 chứa "6-6", mà đó không phải là cạnh (dòng cuối của output). Hãy thay số 6 duy nhất bằng 6786, đừng đặt 6786 bên cạnh nó.</div>`],
      [21, 'Algorithm for finding an Euler cycle from the vertex X using stack',
        `<p class="y-chinh">🎯 The stack version needs no explicit splicing: push X; repeatedly look at the top vertex — if it still has an edge, push its first neighbour and delete that edge; if it has none, pop it into E. When the stack is empty, E is an Euler cycle.</p>
<ul>
<li>"A stack of characters" because the slide names vertices by letters; "the first vertex Y by alphabet order" means the smallest label — here 1 &lt; 2 &lt; … &lt; 8.</li>
<li>"ch is isolated" means ch has no edges left in the <em>shrinking</em> graph — not that it was isolated in the original graph.</li>
<li>The algorithm deletes edges as it runs, so the PE-style <code>Graph</code> class below works on a copy of its adjacency matrix.</li>
</ul>
<p class="nhan">Step by step from X = 1 on the graph of slide 19 — the same 21 steps as the output below</p>
<table>
<thead><tr><th>#</th><th>ch = top of S</th><th>Action</th><th>S after (bottom → top)</th><th>E after</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>push 2, delete edge 1-2</td><td>1 2</td><td>—</td></tr>
<tr><td>2</td><td>2</td><td>push 3, delete edge 2-3</td><td>1 2 3</td><td>—</td></tr>
<tr><td>3</td><td>3</td><td>push 1, delete edge 3-1</td><td>1 2 3 1</td><td>—</td></tr>
<tr><td>4</td><td>1</td><td>no edge left → pop 1 into E</td><td>1 2 3</td><td>1</td></tr>
<tr><td>5</td><td>3</td><td>push 4, delete edge 3-4</td><td>1 2 3 4</td><td>1</td></tr>
<tr><td>6</td><td>4</td><td>push 6, delete edge 4-6</td><td>1 2 3 4 6</td><td>1</td></tr>
<tr><td>7</td><td>6</td><td>push 5, delete edge 6-5</td><td>1 2 3 4 6 5</td><td>1</td></tr>
<tr><td>8</td><td>5</td><td>push 3, delete edge 5-3</td><td>1 2 3 4 6 5 3</td><td>1</td></tr>
<tr><td>9</td><td>3</td><td>no edge left → pop 3</td><td>1 2 3 4 6 5</td><td>1 3</td></tr>
<tr><td>10</td><td>5</td><td>no edge left → pop 5</td><td>1 2 3 4 6</td><td>1 3 5</td></tr>
<tr><td>11</td><td>6</td><td>push 7, delete edge 6-7</td><td>1 2 3 4 6 7</td><td>1 3 5</td></tr>
<tr><td>12</td><td>7</td><td>push 8, delete edge 7-8</td><td>1 2 3 4 6 7 8</td><td>1 3 5</td></tr>
<tr><td>13</td><td>8</td><td>push 6, delete edge 8-6</td><td>1 2 3 4 6 7 8 6</td><td>1 3 5</td></tr>
<tr><td>14–21</td><td>6, 8, 7, 6, 4, 3, 2, 1</td><td>no edges left anywhere → pop one by one</td><td>(empty)</td><td>1 3 5 6 8 7 6 4 3 2 1</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Stack;

class Graph {
    int[][] a;
    int n;
    char[] v;

    Graph(char[] v, int[][] a) { this.v = v; this.a = a; n = v.length; }

    String show(Stack&lt;Integer&gt; s) {                  // bottom ... top
        StringBuilder r = new StringBuilder();
        for (int k : s) r.append(v[k]).append(' ');
        return s.isEmpty() ? "(empty)" : r.toString().trim();
    }

    String eulerCycle(int x) {
        int[][] b = new int[n][n];                   // copy: the algorithm deletes edges
        for (int i = 0; i &lt; n; i++) b[i] = a[i].clone();
        Stack&lt;Integer&gt; s = new Stack&lt;Integer&gt;();
        String e = "";                               // array E of the slide
        s.push(x);
        int step = 0;
        System.out.printf("%2s %-16s %-22s %s%n", "#", "action", "stack S (bottom..top)", "E");
        while (!s.isEmpty()) {
            int ch = s.peek();                       // top element of S
            int y = 0;
            while (y &lt; n &amp;&amp; b[ch][y] == 0) y++;      // first vertex adjacent to ch
            String act;
            if (y == n) {                            // ch is isolated: pop it into E
                s.pop();
                e += (e.isEmpty() ? "" : " ") + v[ch];
                act = "pop " + v[ch] + " -&gt; E";
            } else {
                s.push(y);
                b[ch][y] = b[y][ch] = 0;             // remove edge (ch, Y)
                act = "push " + v[y] + ", del " + v[ch] + "-" + v[y];
            }
            System.out.printf("%2d %-16s %-22s %s%n", ++step, act, show(s), e);
        }
        return e;
    }
}

public class EulerStack {
    public static void main(String[] args) {
        char[] v = {'1', '2', '3', '4', '5', '6', '7', '8'};
        int[][] a = new int[8][8];
        int[][] edges = {{1, 2}, {2, 3}, {3, 1}, {3, 4}, {4, 6}, {6, 5}, {5, 3}, {6, 7}, {7, 8}, {8, 6}};
        for (int[] e : edges) a[e[0] - 1][e[1] - 1] = a[e[1] - 1][e[0] - 1] = 1;
        Graph g = new Graph(v, a);
        System.out.println("Euler cycle E = " + g.eulerCycle(0));
    }
}</code></pre>
<div class="out">&nbsp;# action &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack S (bottom..top) &nbsp;E<br>
&nbsp;1 push 2, del 1-2 &nbsp;1 2<br>
&nbsp;2 push 3, del 2-3 &nbsp;1 2 3<br>
&nbsp;3 push 1, del 3-1 &nbsp;1 2 3 1<br>
&nbsp;4 pop 1 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;5 push 4, del 3-4 &nbsp;1 2 3 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;6 push 6, del 4-6 &nbsp;1 2 3 4 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;7 push 5, del 6-5 &nbsp;1 2 3 4 6 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;8 push 3, del 5-3 &nbsp;1 2 3 4 6 5 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;9 pop 3 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3<br>
10 pop 5 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5<br>
11 push 7, del 6-7 &nbsp;1 2 3 4 6 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5<br>
12 push 8, del 7-8 &nbsp;1 2 3 4 6 7 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5<br>
13 push 6, del 8-6 &nbsp;1 2 3 4 6 7 8 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5<br>
14 pop 6 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 7 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6<br>
15 pop 8 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8<br>
16 pop 7 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7<br>
17 pop 6 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6<br>
18 pop 4 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6 4<br>
19 pop 3 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6 4 3<br>
20 pop 2 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6 4 3 2<br>
21 pop 1 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(empty) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6 4 3 2 1<br>
Euler cycle E = 1 3 5 6 8 7 6 4 3 2 1</div>
<ul>
<li>Steps 1–3 walk 1 → 2 → 3 → 1 (the cycle 1231 of slide 19); at step 4 vertex 1 has no edge left and is popped — the first element of E.</li>
<li>Steps 5–8 walk the detour 3 → 4 → 6 → 5 → 3 on top of the stack, steps 11–13 the detour 6 → 7 → 8 → 6. Popping unwinds these detours in place: it is the splicing of slide 18, done automatically.</li>
<li>Every edge causes one push (10 pushes) and every stack entry one pop (11 pops): 21 steps = 2|E| + 1.</li>
</ul>
<p><strong>Big-O:</strong> 2|E| + 1 iterations; finding "the first vertex adjacent to ch" scans one matrix row, O(|V|) → O(|V|·|E|) as written, O(|V| + |E|) with adjacency lists and a pointer per vertex.</p>
<div class="pitfall">E is filled in the order vertices are popped: 1 3 5 6 8 7 6 4 3 2 1 is 1 2 3 4 6 7 8 6 5 3 1 read backwards. For an undirected graph both are correct, and an FE option may show either direction — trace the algorithm exactly (smallest neighbour first) and compare both readings. Check the input first, too: connected and every degree even, or E is meaningless.</div>`,
        `<p class="y-chinh">🎯 Bản dùng ngăn xếp (stack) không cần ghép chu trình một cách tường minh: đẩy X vào; lặp lại việc nhìn đỉnh trên cùng — nếu nó còn cạnh thì đẩy đỉnh kề đầu tiên vào và xoá cạnh đó; nếu hết cạnh thì lấy nó ra, đưa vào E. Khi stack rỗng, E là một chu trình Euler.</p>
<ul>
<li>"Stack of characters" (ngăn xếp ký tự) vì slide đặt tên đỉnh bằng chữ cái; "the first vertex Y by alphabet order" (đỉnh Y đầu tiên theo thứ tự chữ cái) nghĩa là nhãn nhỏ nhất — ở đây 1 &lt; 2 &lt; … &lt; 8.</li>
<li>"ch is isolated" (ch cô lập) nghĩa là ch không còn cạnh nào trong đồ thị <em>đang bị xoá dần</em> — không phải ch cô lập trong đồ thị ban đầu.</li>
<li>Thuật toán xoá cạnh trong lúc chạy, nên lớp <code>Graph</code> kiểu PE (thi thực hành) dưới đây làm việc trên một bản sao của ma trận kề (adjacency matrix).</li>
</ul>
<p class="nhan">Từng bước với X = 1 trên đồ thị của slide 19 — đúng 21 bước như output bên dưới</p>
<table>
<thead><tr><th>#</th><th>ch = đỉnh của S</th><th>Việc làm</th><th>S sau bước (đáy → đỉnh)</th><th>E sau bước</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>đẩy 2, xoá cạnh 1-2</td><td>1 2</td><td>—</td></tr>
<tr><td>2</td><td>2</td><td>đẩy 3, xoá cạnh 2-3</td><td>1 2 3</td><td>—</td></tr>
<tr><td>3</td><td>3</td><td>đẩy 1, xoá cạnh 3-1</td><td>1 2 3 1</td><td>—</td></tr>
<tr><td>4</td><td>1</td><td>hết cạnh → lấy 1 ra, đưa vào E</td><td>1 2 3</td><td>1</td></tr>
<tr><td>5</td><td>3</td><td>đẩy 4, xoá cạnh 3-4</td><td>1 2 3 4</td><td>1</td></tr>
<tr><td>6</td><td>4</td><td>đẩy 6, xoá cạnh 4-6</td><td>1 2 3 4 6</td><td>1</td></tr>
<tr><td>7</td><td>6</td><td>đẩy 5, xoá cạnh 6-5</td><td>1 2 3 4 6 5</td><td>1</td></tr>
<tr><td>8</td><td>5</td><td>đẩy 3, xoá cạnh 5-3</td><td>1 2 3 4 6 5 3</td><td>1</td></tr>
<tr><td>9</td><td>3</td><td>hết cạnh → lấy 3 ra</td><td>1 2 3 4 6 5</td><td>1 3</td></tr>
<tr><td>10</td><td>5</td><td>hết cạnh → lấy 5 ra</td><td>1 2 3 4 6</td><td>1 3 5</td></tr>
<tr><td>11</td><td>6</td><td>đẩy 7, xoá cạnh 6-7</td><td>1 2 3 4 6 7</td><td>1 3 5</td></tr>
<tr><td>12</td><td>7</td><td>đẩy 8, xoá cạnh 7-8</td><td>1 2 3 4 6 7 8</td><td>1 3 5</td></tr>
<tr><td>13</td><td>8</td><td>đẩy 6, xoá cạnh 8-6</td><td>1 2 3 4 6 7 8 6</td><td>1 3 5</td></tr>
<tr><td>14–21</td><td>6, 8, 7, 6, 4, 3, 2, 1</td><td>không đỉnh nào còn cạnh → lấy ra lần lượt</td><td>(rỗng)</td><td>1 3 5 6 8 7 6 4 3 2 1</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Stack;

class Graph {
    int[][] a;
    int n;
    char[] v;

    Graph(char[] v, int[][] a) { this.v = v; this.a = a; n = v.length; }

    String show(Stack&lt;Integer&gt; s) {                  // đáy ... đỉnh
        StringBuilder r = new StringBuilder();
        for (int k : s) r.append(v[k]).append(' ');
        return s.isEmpty() ? "(empty)" : r.toString().trim();
    }

    String eulerCycle(int x) {
        int[][] b = new int[n][n];                   // bản sao: thuật toán xoá cạnh
        for (int i = 0; i &lt; n; i++) b[i] = a[i].clone();
        Stack&lt;Integer&gt; s = new Stack&lt;Integer&gt;();
        String e = "";                               // mảng E của slide
        s.push(x);
        int step = 0;
        System.out.printf("%2s %-16s %-22s %s%n", "#", "action", "stack S (bottom..top)", "E");
        while (!s.isEmpty()) {
            int ch = s.peek();                       // phần tử ở đỉnh S
            int y = 0;
            while (y &lt; n &amp;&amp; b[ch][y] == 0) y++;      // đỉnh kề ch đầu tiên theo thứ tự
            String act;
            if (y == n) {                            // ch cô lập: lấy ra, đưa vào E
                s.pop();
                e += (e.isEmpty() ? "" : " ") + v[ch];
                act = "pop " + v[ch] + " -&gt; E";
            } else {
                s.push(y);
                b[ch][y] = b[y][ch] = 0;             // xoá cạnh (ch, Y)
                act = "push " + v[y] + ", del " + v[ch] + "-" + v[y];
            }
            System.out.printf("%2d %-16s %-22s %s%n", ++step, act, show(s), e);
        }
        return e;
    }
}

public class EulerStack {
    public static void main(String[] args) {
        char[] v = {'1', '2', '3', '4', '5', '6', '7', '8'};
        int[][] a = new int[8][8];
        int[][] edges = {{1, 2}, {2, 3}, {3, 1}, {3, 4}, {4, 6}, {6, 5}, {5, 3}, {6, 7}, {7, 8}, {8, 6}};
        for (int[] e : edges) a[e[0] - 1][e[1] - 1] = a[e[1] - 1][e[0] - 1] = 1;
        Graph g = new Graph(v, a);
        System.out.println("Euler cycle E = " + g.eulerCycle(0));
    }
}</code></pre>
<div class="out">&nbsp;# action &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack S (bottom..top) &nbsp;E<br>
&nbsp;1 push 2, del 1-2 &nbsp;1 2<br>
&nbsp;2 push 3, del 2-3 &nbsp;1 2 3<br>
&nbsp;3 push 1, del 3-1 &nbsp;1 2 3 1<br>
&nbsp;4 pop 1 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;5 push 4, del 3-4 &nbsp;1 2 3 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;6 push 6, del 4-6 &nbsp;1 2 3 4 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;7 push 5, del 6-5 &nbsp;1 2 3 4 6 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;8 push 3, del 5-3 &nbsp;1 2 3 4 6 5 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;9 pop 3 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3<br>
10 pop 5 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5<br>
11 push 7, del 6-7 &nbsp;1 2 3 4 6 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5<br>
12 push 8, del 7-8 &nbsp;1 2 3 4 6 7 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5<br>
13 push 6, del 8-6 &nbsp;1 2 3 4 6 7 8 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5<br>
14 pop 6 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 7 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6<br>
15 pop 8 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8<br>
16 pop 7 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7<br>
17 pop 6 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6<br>
18 pop 4 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6 4<br>
19 pop 3 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6 4 3<br>
20 pop 2 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6 4 3 2<br>
21 pop 1 -&gt; E &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(empty) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 3 5 6 8 7 6 4 3 2 1<br>
Euler cycle E = 1 3 5 6 8 7 6 4 3 2 1</div>
<ul>
<li>Bước 1–3 đi 1 → 2 → 3 → 1 (chu trình 1231 của slide 19); tới bước 4, đỉnh 1 hết cạnh nên bị lấy ra — phần tử đầu tiên của E.</li>
<li>Bước 5–8 đi đường vòng 3 → 4 → 6 → 5 → 3 ngay trên đỉnh stack, bước 11–13 đi đường vòng 6 → 7 → 8 → 6. Việc lấy ra (pop) tháo các đường vòng này đúng tại chỗ: đó chính là phép ghép của slide 18, được làm tự động.</li>
<li>Mỗi cạnh gây ra một lần đẩy vào (push — 10 lần) và mỗi phần tử của stack bị lấy ra một lần (pop — 11 lần): 21 bước = 2|E| + 1.</li>
</ul>
<p><strong>Big-O:</strong> 2|E| + 1 vòng lặp; tìm "đỉnh đầu tiên kề với ch" phải quét một hàng ma trận, O(|V|) → O(|V|·|E|) như code ở trên, còn O(|V| + |E|) nếu dùng danh sách kề (adjacency list) kèm một con trỏ cho mỗi đỉnh.</p>
<div class="pitfall">E được điền theo thứ tự các đỉnh bị lấy ra: 1 3 5 6 8 7 6 4 3 2 1 chính là 1 2 3 4 6 7 8 6 5 3 1 đọc ngược. Với đồ thị vô hướng cả hai đều đúng, và phương án FE (thi cuối kỳ) có thể ghi theo chiều nào cũng được — hãy chạy tay đúng thuật toán (đỉnh kề nhỏ nhất trước) rồi so cả hai chiều đọc. Cũng phải kiểm đầu vào trước: liên thông và mọi bậc chẵn, nếu không E chẳng có nghĩa gì.</div>`],
      [22, 'Necessary and sufficient conditions for Euler paths',
        `<p class="y-chinh">🎯 Theorem 2: a connected multigraph has an Euler path but no Euler cycle if and only if it has exactly two vertices of odd degree — and the path must start at one of them and end at the other.</p>
<ul>
<li><strong>Why two</strong>: in the middle of a walk every vertex is entered and left in pairs (slide 15); only the first and the last vertex keep one unpaired edge, so they are the odd ones.</li>
<li><strong>Proof idea for "⇐"</strong>: add a temporary edge between the two odd vertices → all degrees even → Theorem 1 gives an Euler cycle → delete the temporary edge from it → an Euler path from one odd vertex to the other.</li>
<li><strong>Odd vertices come in pairs</strong>: the sum of all degrees is 2|E| (each edge adds 1 to two degrees — syllabus question CQ8.1), so the number of odd vertices is even: 0, 2, 4, …</li>
</ul>
<table>
<thead><tr><th>Odd-degree vertices (connected graph)</th><th>Euler cycle</th><th>Euler path</th></tr></thead>
<tbody>
<tr><td>0</td><td>yes (Theorem 1)</td><td>yes — the cycle itself, from any vertex</td></tr>
<tr><td>2</td><td>no</td><td>yes, from one odd vertex to the other (Theorem 2)</td></tr>
<tr><td>4, 6, …</td><td>no</td><td>no</td></tr>
</tbody>
</table>
<p class="nhan">"Draw the house in one stroke" — the lesson's own example: square A-B-C-D with both diagonals and a roof E on top</p>
<pre><code class="language-plaintext">    E
  /   \\
D ------- C
| \\     / |
|   \\ /   |
|   / \\   |
| /     \\ |
A ------- B</code></pre>
<pre><code class="language-java">import java.util.Stack;

public class EulerPath {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E'};        // A, B bottom corners; C, D top corners; E roof
        int n = v.length;
        int[][] a = new int[n][n];
        String[] edges = {"AB", "BC", "CD", "DA", "AC", "BD", "CE", "DE"};
        int[] deg = new int[n];
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;
            deg[x]++;
            deg[y]++;
        }
        String degs = "", odd = "";
        for (int i = 0; i &lt; n; i++) {
            degs += " " + v[i] + "=" + deg[i];
            if (deg[i] % 2 == 1) odd += v[i];
        }
        System.out.println("degrees:" + degs + ", odd: " + odd);
        int x = odd.charAt(0) - 'A';                 // Theorem 2: start at an odd vertex
        Stack&lt;Integer&gt; s = new Stack&lt;Integer&gt;();     // the stack algorithm of slide 21
        String e = "";
        s.push(x);
        while (!s.isEmpty()) {
            int ch = s.peek(), y = 0;
            while (y &lt; n &amp;&amp; a[ch][y] == 0) y++;
            if (y == n) e += (e.isEmpty() ? "" : " ") + v[s.pop()];
            else { s.push(y); a[ch][y] = a[y][ch] = 0; }
        }
        System.out.println("E (pop order)  : " + e);
        System.out.println("Euler path     : " + new StringBuilder(e).reverse() + "  (" + e.length() / 2 + " edges, "
                + v[x] + " to " + odd.charAt(1) + ")");
    }
}</code></pre>
<div class="out">degrees: A=3 B=3 C=4 D=4 E=2, odd: AB<br>
E (pop order) &nbsp;: B D E C D A C B A<br>
Euler path &nbsp;&nbsp;&nbsp;&nbsp;: A B C A D C E D B &nbsp;(8 edges, A to B)</div>
<p>The stack algorithm of slide 21, started at the odd vertex A, draws the house with its 8 edges and finishes at B, the other odd vertex.</p>
<div class="pitfall">Start at an odd vertex: with exactly two odd vertices, every Euler path runs from one of them to the other, so from C, D or E (all even) there is none. And two odd vertices mean no Euler cycle at all — "Euler path" allows 0 or 2 odd vertices, "Euler cycle" only 0.</div>`,
        `<p class="y-chinh">🎯 Định lý 2: một đa đồ thị (multigraph) liên thông có đường đi Euler nhưng không có chu trình Euler khi và chỉ khi nó có đúng hai đỉnh bậc lẻ — và đường đi phải bắt đầu ở một trong hai đỉnh đó, kết thúc ở đỉnh còn lại.</p>
<ul>
<li><strong>Vì sao là hai</strong>: ở giữa hành trình, mỗi đỉnh được vào và ra theo từng cặp (slide 15); chỉ đỉnh đầu và đỉnh cuối còn một cạnh không có cặp, nên chúng là hai đỉnh lẻ.</li>
<li><strong>Ý chứng minh chiều "⇐"</strong>: thêm tạm một cạnh nối hai đỉnh lẻ → mọi bậc chẵn → Định lý 1 cho một chu trình Euler → xoá cạnh tạm khỏi chu trình → được đường đi Euler từ đỉnh lẻ này tới đỉnh lẻ kia.</li>
<li><strong>Đỉnh lẻ luôn đi theo cặp</strong>: tổng mọi bậc bằng 2|E| (mỗi cạnh cộng 1 vào hai bậc — câu hỏi CQ8.1 của syllabus), nên số đỉnh bậc lẻ luôn chẵn: 0, 2, 4, …</li>
</ul>
<table>
<thead><tr><th>Số đỉnh bậc lẻ (đồ thị liên thông)</th><th>Chu trình Euler</th><th>Đường đi Euler</th></tr></thead>
<tbody>
<tr><td>0</td><td>có (Định lý 1)</td><td>có — chính chu trình đó, từ đỉnh nào cũng được</td></tr>
<tr><td>2</td><td>không</td><td>có, từ đỉnh lẻ này tới đỉnh lẻ kia (Định lý 2)</td></tr>
<tr><td>4, 6, …</td><td>không</td><td>không</td></tr>
</tbody>
</table>
<p class="nhan">"Vẽ ngôi nhà một nét" — ví dụ của bài: hình vuông A-B-C-D có hai đường chéo và mái nhà E ở trên</p>
<pre><code class="language-plaintext">    E
  /   \\
D ------- C
| \\     / |
|   \\ /   |
|   / \\   |
| /     \\ |
A ------- B</code></pre>
<pre><code class="language-java">import java.util.Stack;

public class EulerPath {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E'};        // A, B góc dưới; C, D góc trên; E nóc nhà
        int n = v.length;
        int[][] a = new int[n][n];
        String[] edges = {"AB", "BC", "CD", "DA", "AC", "BD", "CE", "DE"};
        int[] deg = new int[n];
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;
            deg[x]++;
            deg[y]++;
        }
        String degs = "", odd = "";
        for (int i = 0; i &lt; n; i++) {
            degs += " " + v[i] + "=" + deg[i];
            if (deg[i] % 2 == 1) odd += v[i];
        }
        System.out.println("degrees:" + degs + ", odd: " + odd);
        int x = odd.charAt(0) - 'A';                 // Định lý 2: xuất phát ở một đỉnh bậc lẻ
        Stack&lt;Integer&gt; s = new Stack&lt;Integer&gt;();     // thuật toán dùng stack của slide 21
        String e = "";
        s.push(x);
        while (!s.isEmpty()) {
            int ch = s.peek(), y = 0;
            while (y &lt; n &amp;&amp; a[ch][y] == 0) y++;
            if (y == n) e += (e.isEmpty() ? "" : " ") + v[s.pop()];
            else { s.push(y); a[ch][y] = a[y][ch] = 0; }
        }
        System.out.println("E (pop order)  : " + e);
        System.out.println("Euler path     : " + new StringBuilder(e).reverse() + "  (" + e.length() / 2 + " edges, "
                + v[x] + " to " + odd.charAt(1) + ")");
    }
}</code></pre>
<div class="out">degrees: A=3 B=3 C=4 D=4 E=2, odd: AB<br>
E (pop order) &nbsp;: B D E C D A C B A<br>
Euler path &nbsp;&nbsp;&nbsp;&nbsp;: A B C A D C E D B &nbsp;(8 edges, A to B)</div>
<p>Thuật toán dùng ngăn xếp (stack) của slide 21, xuất phát từ đỉnh lẻ A, vẽ xong ngôi nhà với đủ 8 cạnh và kết thúc ở B, đỉnh lẻ còn lại.</p>
<div class="pitfall">Phải xuất phát từ đỉnh lẻ: khi có đúng hai đỉnh lẻ, mọi đường đi Euler đều chạy từ đỉnh lẻ này tới đỉnh lẻ kia, nên từ C, D hay E (đều bậc chẵn) thì không có đường nào. Và có hai đỉnh lẻ nghĩa là chắc chắn không có chu trình Euler — "đường đi Euler" cho phép 0 hoặc 2 đỉnh lẻ, còn "chu trình Euler" chỉ cho phép 0.</div>`],
      [23, 'Hamilton paths and cycles - 1',
        `<p class="y-chinh">🎯 A Hamilton cycle visits every vertex of the graph exactly once and, as its last step, returns to the start; a Hamilton path visits every vertex exactly once and need not return.</p>
<ul>
<li>The unit is now the <strong>vertex</strong>: edges may be left unused, but no vertex may be skipped or visited twice.</li>
<li>A Hamilton cycle on n vertices has exactly n edges; dropping its last edge leaves a Hamilton path.</li>
<li>The slide's examples are pictures; the lesson's own example is the graph below, used again on slides 24–25.</li>
</ul>
<pre><code class="language-plaintext">      A
    / | \\
  /   |   \\
B --- D --- C
|           |
|           |
E ----------- F</code></pre>
<pre><code class="language-java">public class HamiltonCheck {
    static int n = 6;
    static int[][] a = new int[n][n];

    static boolean edge(char x, char y) { return a[x - 'A'][y - 'A'] &gt; 0; }

    // Checking a proposed answer is easy: O(n)
    static String check(String s) {
        boolean closed = s.length() &gt; 1 &amp;&amp; s.charAt(0) == s.charAt(s.length() - 1);
        String body = closed ? s.substring(0, s.length() - 1) : s;
        boolean[] seen = new boolean[n];
        for (int i = 0; i &lt; body.length(); i++) {
            int c = body.charAt(i) - 'A';
            if (seen[c]) return "not Hamilton - " + body.charAt(i) + " is visited twice";
            seen[c] = true;
        }
        for (int i = 0; i + 1 &lt; s.length(); i++)
            if (!edge(s.charAt(i), s.charAt(i + 1))) return "not a walk - " + s.charAt(i) + "-" + s.charAt(i + 1) + " is not an edge";
        for (int i = 0; i &lt; n; i++) if (!seen[i]) return "not Hamilton - " + (char) ('A' + i) + " is never visited";
        if (closed) return "Hamilton cycle";
        char last = s.charAt(s.length() - 1), first = s.charAt(0);
        return "Hamilton path" + (edge(last, first) ? "" : " (" + last + "-" + first + " is not an edge: it cannot close)");
    }

    public static void main(String[] args) {
        String[] edges = {"AB", "AC", "AD", "BD", "BE", "CD", "CF", "EF"};
        int[] deg = new int[n];
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;
            deg[x]++;
            deg[y]++;
        }
        for (String s : new String[] {"ABEFCDA", "ABDCFE", "ABEFCA", "ADBACFE"})
            System.out.printf("%-8s: %s%n", s, check(s));
        int odd = 0;
        String d = "";
        for (int i = 0; i &lt; n; i++) { d += " " + (char) ('A' + i) + "=" + deg[i]; if (deg[i] % 2 == 1) odd++; }
        System.out.println("degrees" + d + ": " + odd + " odd -&gt; no Euler cycle, no Euler path");
    }
}</code></pre>
<div class="out">ABEFCDA : Hamilton cycle<br>
ABDCFE &nbsp;: Hamilton path (E-A is not an edge: it cannot close)<br>
ABEFCA &nbsp;: not Hamilton - D is never visited<br>
ADBACFE : not Hamilton - A is visited twice<br>
degrees A=3 B=3 C=3 D=3 E=2 F=2: 4 odd -&gt; no Euler cycle, no Euler path</div>
<p class="nhan">CQ13.2 — Euler vs Hamilton</p>
<table>
<thead><tr><th></th><th>Euler</th><th>Hamilton</th></tr></thead>
<tbody>
<tr><td>Uses every…</td><td>edge exactly once</td><td>vertex exactly once</td></tr>
<tr><td>Exists when…</td><td>connected + all degrees even (cycle) / exactly 2 odd (path)</td><td>no simple test is known — the problem is NP-complete</td></tr>
<tr><td>Found by…</td><td>slides 16–21, linear time with adjacency lists</td><td>backtracking (slides 24–25), exponential in the worst case</td></tr>
<tr><td>Example</td><td>bowtie of slide 12: Euler cycle, no Hamilton cycle (C would be visited twice)</td><td>the graph above: Hamilton cycle, no Euler path (4 odd vertices)</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>CQ13.3 — Is there a method to decide whether a graph has a Hamilton cycle?</strong> No efficient one is known: in general you search (backtracking, slide 24). Some sufficient conditions exist — Dirac's theorem: a simple graph with n ≥ 3 vertices in which every vertex has degree ≥ n/2 has a Hamilton cycle — but a graph can fail such a condition and still have one (the graph above does).</p>
<div class="pitfall">Checking and finding are different: checking a proposed sequence is O(n) (the program above), finding one may take exponential time. An FE statement such as "Hamilton cycles can be found in O(|V| + |E|) like Euler cycles" is false.</div>`,
        `<p class="y-chinh">🎯 Chu trình Hamilton (Hamilton cycle) đi qua mọi đỉnh của đồ thị đúng một lần và, ở bước cuối cùng, quay về đỉnh xuất phát; đường đi Hamilton (Hamilton path) đi qua mọi đỉnh đúng một lần và không cần quay về.</p>
<ul>
<li>Đơn vị được đếm giờ là <strong>đỉnh</strong> (vertex): cạnh thì được phép bỏ không dùng, nhưng không đỉnh nào được bỏ sót hay ghé hai lần.</li>
<li>Chu trình Hamilton trên n đỉnh có đúng n cạnh; bỏ cạnh cuối của nó thì còn lại một đường đi Hamilton.</li>
<li>Các ví dụ của slide là hình vẽ; ví dụ của bài là đồ thị dưới đây, được dùng lại ở slide 24–25.</li>
</ul>
<pre><code class="language-plaintext">      A
    / | \\
  /   |   \\
B --- D --- C
|           |
|           |
E ----------- F</code></pre>
<pre><code class="language-java">public class HamiltonCheck {
    static int n = 6;
    static int[][] a = new int[n][n];

    static boolean edge(char x, char y) { return a[x - 'A'][y - 'A'] &gt; 0; }

    // Kiểm một đáp án cho sẵn thì dễ: O(n)
    static String check(String s) {
        boolean closed = s.length() &gt; 1 &amp;&amp; s.charAt(0) == s.charAt(s.length() - 1);
        String body = closed ? s.substring(0, s.length() - 1) : s;
        boolean[] seen = new boolean[n];
        for (int i = 0; i &lt; body.length(); i++) {
            int c = body.charAt(i) - 'A';
            if (seen[c]) return "not Hamilton - " + body.charAt(i) + " is visited twice";
            seen[c] = true;
        }
        for (int i = 0; i + 1 &lt; s.length(); i++)
            if (!edge(s.charAt(i), s.charAt(i + 1))) return "not a walk - " + s.charAt(i) + "-" + s.charAt(i + 1) + " is not an edge";
        for (int i = 0; i &lt; n; i++) if (!seen[i]) return "not Hamilton - " + (char) ('A' + i) + " is never visited";
        if (closed) return "Hamilton cycle";
        char last = s.charAt(s.length() - 1), first = s.charAt(0);
        return "Hamilton path" + (edge(last, first) ? "" : " (" + last + "-" + first + " is not an edge: it cannot close)");
    }

    public static void main(String[] args) {
        String[] edges = {"AB", "AC", "AD", "BD", "BE", "CD", "CF", "EF"};
        int[] deg = new int[n];
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;
            deg[x]++;
            deg[y]++;
        }
        for (String s : new String[] {"ABEFCDA", "ABDCFE", "ABEFCA", "ADBACFE"})
            System.out.printf("%-8s: %s%n", s, check(s));
        int odd = 0;
        String d = "";
        for (int i = 0; i &lt; n; i++) { d += " " + (char) ('A' + i) + "=" + deg[i]; if (deg[i] % 2 == 1) odd++; }
        System.out.println("degrees" + d + ": " + odd + " odd -&gt; no Euler cycle, no Euler path");
    }
}</code></pre>
<div class="out">ABEFCDA : Hamilton cycle<br>
ABDCFE &nbsp;: Hamilton path (E-A is not an edge: it cannot close)<br>
ABEFCA &nbsp;: not Hamilton - D is never visited<br>
ADBACFE : not Hamilton - A is visited twice<br>
degrees A=3 B=3 C=3 D=3 E=2 F=2: 4 odd -&gt; no Euler cycle, no Euler path</div>
<p class="nhan">CQ13.2 — Euler khác Hamilton thế nào</p>
<table>
<thead><tr><th></th><th>Euler</th><th>Hamilton</th></tr></thead>
<tbody>
<tr><td>Đi qua mọi…</td><td>cạnh đúng một lần</td><td>đỉnh đúng một lần</td></tr>
<tr><td>Tồn tại khi…</td><td>liên thông + mọi bậc chẵn (chu trình) / đúng 2 đỉnh lẻ (đường đi)</td><td>chưa biết phép kiểm đơn giản nào — bài toán là NP-đầy đủ (NP-complete)</td></tr>
<tr><td>Tìm bằng…</td><td>slide 16–21, thời gian tuyến tính với danh sách kề (adjacency list)</td><td>quay lui (backtracking, slide 24–25), hàm mũ trong trường hợp xấu nhất</td></tr>
<tr><td>Ví dụ</td><td>đồ thị hình nơ (bowtie) của slide 12: có chu trình Euler, không có chu trình Hamilton (C sẽ phải ghé hai lần)</td><td>đồ thị ở trên: có chu trình Hamilton, không có đường đi Euler (4 đỉnh lẻ)</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>CQ13.3 — Có cách nào xác định đồ thị có chu trình Hamilton không?</strong> Chưa biết cách nào hiệu quả: nói chung phải tìm kiếm (quay lui, slide 24). Có vài điều kiện đủ (sufficient condition) — định lý Dirac: đơn đồ thị (simple graph) n ≥ 3 đỉnh mà đỉnh nào cũng có bậc ≥ n/2 thì có chu trình Hamilton — nhưng đồ thị không thoả điều kiện kiểu này vẫn có thể có chu trình Hamilton (đồ thị ở trên là ví dụ).</p>
<div class="pitfall">Kiểm tra và tìm kiếm là hai chuyện khác nhau: kiểm một dãy cho sẵn chỉ tốn O(n) (chương trình ở trên), còn tìm ra một chu trình có thể tốn thời gian hàm mũ. Câu FE (thi cuối kỳ) kiểu "chu trình Hamilton tìm được trong O(|V| + |E|) giống chu trình Euler" là SAI.</div>`],
      [24, 'Finding Hamilton’s cycles using Backtracking',
        `<p class="y-chinh">🎯 Backtracking builds the cycle one vertex at a time: extend H with a neighbour of its last vertex that is not in H yet; at a dead end remove the last vertex and try the next choice; stop when H holds every vertex and its last vertex is adjacent to X.</p>
<ol>
<li>Put the vertex X in H (the slide assumes at least one Hamilton cycle exists).</li>
<li>If H is a Hamilton cycle — all n vertices, the last one adjacent to X — stop; otherwise go to (3).</li>
<li>Let Y be the last vertex of H. If some vertex Z adjacent to Y is not in H and not yet tried at this position, put Z in H. If there is none, remove Y from H and mark it as a bad selection, so the same choice is not made again from the same prefix. Go to (2).</li>
</ol>
<pre><code class="language-java">public class HamiltonBacktrack {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};
    static int n = v.length;
    static int[][] a = new int[n][n];
    static int[] h = new int[n];                    // array H: the path built so far
    static boolean[] inH = new boolean[n];
    static int len = 0;

    static String show() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; len; i++) s.append(v[h[i]]).append(' ');
        return s.toString().trim();
    }

    static boolean extend() {
        if (len == n) {                             // (2) is H a Hamilton cycle?
            if (a[h[n - 1]][h[0]] &gt; 0) return true;
            System.out.println("  all " + n + " vertices, but " + v[h[n - 1]] + "-" + v[h[0]] + " is not an edge");
            return false;
        }
        int y = h[len - 1];                         // (3) the last vertex Y of H
        for (int z = 0; z &lt; n; z++)
            if (a[y][z] &gt; 0 &amp;&amp; !inH[z]) {           // Z adjacent to Y and not in H yet
                h[len++] = z;
                inH[z] = true;
                System.out.println("add " + v[z] + "     H = " + show());
                if (extend()) return true;
                len--;                              // dead end: take Z out, try the next choice
                inH[z] = false;
                System.out.println("remove " + v[z] + "  H = " + show());
            }
        return false;
    }

    public static void main(String[] args) {
        String[] edges = {"AB", "AC", "AD", "BD", "BE", "CD", "CF", "EF"};
        for (String e : edges) a[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = a[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        h[len++] = 0;                               // (1) put X = A into H
        inH[0] = true;
        System.out.println("put A     H = A");
        if (extend()) System.out.println("Hamilton cycle: " + show() + " A");
        else System.out.println("no Hamilton cycle from A");
    }
}</code></pre>
<div class="out">put A &nbsp;&nbsp;&nbsp;&nbsp;H = A<br>
add B &nbsp;&nbsp;&nbsp;&nbsp;H = A B<br>
add D &nbsp;&nbsp;&nbsp;&nbsp;H = A B D<br>
add C &nbsp;&nbsp;&nbsp;&nbsp;H = A B D C<br>
add F &nbsp;&nbsp;&nbsp;&nbsp;H = A B D C F<br>
add E &nbsp;&nbsp;&nbsp;&nbsp;H = A B D C F E<br>
&nbsp;&nbsp;all 6 vertices, but E-A is not an edge<br>
remove E &nbsp;H = A B D C F<br>
remove F &nbsp;H = A B D C<br>
remove C &nbsp;H = A B D<br>
remove D &nbsp;H = A B<br>
add E &nbsp;&nbsp;&nbsp;&nbsp;H = A B E<br>
add F &nbsp;&nbsp;&nbsp;&nbsp;H = A B E F<br>
add C &nbsp;&nbsp;&nbsp;&nbsp;H = A B E F C<br>
add D &nbsp;&nbsp;&nbsp;&nbsp;H = A B E F C D<br>
Hamilton cycle: A B E F C D A</div>
<p class="nhan">The part of the search tree explored before the first cycle is found (the whole tree is on slide 25)</p>
<pre><code class="language-plaintext">A
└── B
    ├── D ── C ── F ── E    all 6 vertices, but no edge E-A: remove E, F, C, D
    └── E ── F ── C ── D    edge D-A exists: Hamilton cycle A B E F C D A</code></pre>
<ul>
<li>The first attempt A B D C F E contains all 6 vertices — a Hamilton <em>path</em> — but E-A is not an edge, so test (2) fails.</li>
<li>E, F, C and D are then removed one by one: each has no untried choice left. Back at B the next untried neighbour is E, and A B E F C D closes with the edge D-A.</li>
<li>In the recursive program, "mark as a bad selection" is simply the <code>for</code> loop moving on to the next z; a removed vertex is tried again only after an earlier vertex of H has changed.</li>
</ul>
<p><strong>Big-O:</strong> in the worst case the search tries every order of the other n − 1 vertices — up to (n − 1)! paths, each checked in O(n): exponential. Deciding whether a Hamilton cycle exists is NP-complete, so no polynomial algorithm is known.</p>
<div class="pitfall">Two classic bugs: (1) stopping as soon as H has n vertices without checking the closing edge back to X — that finds a Hamilton path, not a cycle; (2) forgetting <code>inH[z] = false</code> when backtracking, so a removed vertex stays "used" and solutions are missed.</div>`,
        `<p class="y-chinh">🎯 Quay lui (backtracking) dựng chu trình từng đỉnh một: nối vào H một đỉnh kề với đỉnh cuối mà chưa có trong H; gặp ngõ cụt thì bỏ đỉnh cuối ra và thử lựa chọn kế tiếp; dừng khi H chứa đủ mọi đỉnh và đỉnh cuối kề với X.</p>
<ol>
<li>Đưa đỉnh X vào H (slide giả sử đồ thị có ít nhất một chu trình Hamilton).</li>
<li>Nếu H là chu trình Hamilton — đủ n đỉnh, đỉnh cuối kề với X — thì dừng; ngược lại sang (3).</li>
<li>Gọi Y là đỉnh cuối của H. Nếu có đỉnh Z kề với Y, chưa có trong H và chưa được thử ở vị trí này, đưa Z vào H. Nếu không có, bỏ Y ra khỏi H và đánh dấu nó là lựa chọn tồi (bad selection), để không chọn lại đúng cách đó từ cùng phần đầu của H. Quay lại (2).</li>
</ol>
<pre><code class="language-java">public class HamiltonBacktrack {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};
    static int n = v.length;
    static int[][] a = new int[n][n];
    static int[] h = new int[n];                    // mảng H: đường đang dựng
    static boolean[] inH = new boolean[n];
    static int len = 0;

    static String show() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; len; i++) s.append(v[h[i]]).append(' ');
        return s.toString().trim();
    }

    static boolean extend() {
        if (len == n) {                             // (2) H đã là chu trình Hamilton chưa?
            if (a[h[n - 1]][h[0]] &gt; 0) return true;
            System.out.println("  all " + n + " vertices, but " + v[h[n - 1]] + "-" + v[h[0]] + " is not an edge");
            return false;
        }
        int y = h[len - 1];                         // (3) đỉnh cuối Y của H
        for (int z = 0; z &lt; n; z++)
            if (a[y][z] &gt; 0 &amp;&amp; !inH[z]) {           // Z kề Y và chưa có trong H
                h[len++] = z;
                inH[z] = true;
                System.out.println("add " + v[z] + "     H = " + show());
                if (extend()) return true;
                len--;                              // ngõ cụt: bỏ Z ra, thử lựa chọn kế tiếp
                inH[z] = false;
                System.out.println("remove " + v[z] + "  H = " + show());
            }
        return false;
    }

    public static void main(String[] args) {
        String[] edges = {"AB", "AC", "AD", "BD", "BE", "CD", "CF", "EF"};
        for (String e : edges) a[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = a[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        h[len++] = 0;                               // (1) đưa X = A vào H
        inH[0] = true;
        System.out.println("put A     H = A");
        if (extend()) System.out.println("Hamilton cycle: " + show() + " A");
        else System.out.println("no Hamilton cycle from A");
    }
}</code></pre>
<div class="out">put A &nbsp;&nbsp;&nbsp;&nbsp;H = A<br>
add B &nbsp;&nbsp;&nbsp;&nbsp;H = A B<br>
add D &nbsp;&nbsp;&nbsp;&nbsp;H = A B D<br>
add C &nbsp;&nbsp;&nbsp;&nbsp;H = A B D C<br>
add F &nbsp;&nbsp;&nbsp;&nbsp;H = A B D C F<br>
add E &nbsp;&nbsp;&nbsp;&nbsp;H = A B D C F E<br>
&nbsp;&nbsp;all 6 vertices, but E-A is not an edge<br>
remove E &nbsp;H = A B D C F<br>
remove F &nbsp;H = A B D C<br>
remove C &nbsp;H = A B D<br>
remove D &nbsp;H = A B<br>
add E &nbsp;&nbsp;&nbsp;&nbsp;H = A B E<br>
add F &nbsp;&nbsp;&nbsp;&nbsp;H = A B E F<br>
add C &nbsp;&nbsp;&nbsp;&nbsp;H = A B E F C<br>
add D &nbsp;&nbsp;&nbsp;&nbsp;H = A B E F C D<br>
Hamilton cycle: A B E F C D A</div>
<p class="nhan">Phần cây tìm kiếm (search tree) đã duyệt trước khi gặp chu trình đầu tiên (cả cây ở slide 25)</p>
<pre><code class="language-plaintext">A
└── B
    ├── D ── C ── F ── E    đủ 6 đỉnh nhưng không có cạnh E-A: bỏ E, F, C, D ra
    └── E ── F ── C ── D    có cạnh D-A: chu trình Hamilton A B E F C D A</code></pre>
<ul>
<li>Lần thử đầu A B D C F E chứa đủ 6 đỉnh — một <em>đường đi</em> Hamilton — nhưng E-A không phải là cạnh, nên phép kiểm (2) thất bại.</li>
<li>Sau đó E, F, C, D lần lượt bị bỏ ra: đỉnh nào cũng hết lựa chọn chưa thử. Lùi về tới B, đỉnh kề chưa thử tiếp theo là E, và A B E F C D khép lại được nhờ cạnh D-A.</li>
<li>Trong chương trình đệ quy (recursive), "đánh dấu lựa chọn tồi" đơn giản là vòng <code>for</code> chuyển sang z kế tiếp; một đỉnh đã bị bỏ ra chỉ được thử lại sau khi một đỉnh đứng trước nó trong H thay đổi.</li>
</ul>
<p><strong>Big-O:</strong> trường hợp xấu nhất, phép tìm thử mọi thứ tự của n − 1 đỉnh còn lại — tới (n − 1)! đường đi, mỗi đường kiểm trong O(n): hàm mũ. Bài toán quyết định đồ thị có chu trình Hamilton hay không là NP-đầy đủ (NP-complete), nên chưa ai biết thuật toán đa thức nào.</p>
<div class="pitfall">Hai lỗi kinh điển: (1) dừng ngay khi H đủ n đỉnh mà quên kiểm cạnh khép về X — như vậy mới tìm được đường đi Hamilton, chưa phải chu trình; (2) quên <code>inH[z] = false</code> khi quay lui, khiến đỉnh đã bỏ ra vẫn bị coi là "đã dùng" và bỏ lỡ lời giải.</div>`],
      [25, 'List all Hamilton’s cycles using Backtracking',
        `<p class="ghi-chu">Only the title of this slide could be extracted as text; whatever is shown below the title is not available here. The lesson teaches the idea of the title with its own example (the graph of slide 23).</p>
<p class="y-chinh">🎯 To list all Hamilton cycles, run the same backtracking but do not stop at the first cycle: record it, backtrack, and keep searching until every branch of the search tree has been explored.</p>
<pre><code class="language-java">public class AllHamiltonCycles {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};
    static int n = v.length;
    static int[][] a = new int[n][n];
    static int[] h = new int[n];
    static boolean[] inH = new boolean[n];
    static int len = 0, found = 0, deadEnds = 0;

    static String show() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; len; i++) s.append(v[h[i]]).append(' ');
        return s.toString();
    }

    static void extend() {
        if (len == n) {
            if (a[h[n - 1]][h[0]] &gt; 0) System.out.println("cycle " + (++found) + ":  " + show() + "A");
            else { deadEnds++; System.out.println("dead end: " + show() + "(" + v[h[n - 1]] + "-A is not an edge)"); }
            return;                                  // do NOT stop: go back and keep searching
        }
        for (int z = 0; z &lt; n; z++)
            if (a[h[len - 1]][z] &gt; 0 &amp;&amp; !inH[z]) {
                h[len++] = z;
                inH[z] = true;
                extend();
                len--;
                inH[z] = false;
            }
    }

    public static void main(String[] args) {
        String[] edges = {"AB", "AC", "AD", "BD", "BE", "CD", "CF", "EF"};
        for (String e : edges) a[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = a[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        h[len++] = 0;
        inH[0] = true;
        extend();
        System.out.println(found + " cycles listed, " + deadEnds + " dead ends");
        System.out.println("each cycle is listed twice (once per direction): " + found / 2 + " different cycles");
    }
}</code></pre>
<div class="out">dead end: A B D C F E (E-A is not an edge)<br>
cycle 1: &nbsp;A B E F C D A<br>
dead end: A C D B E F (F-A is not an edge)<br>
cycle 2: &nbsp;A C F E B D A<br>
cycle 3: &nbsp;A D B E F C A<br>
cycle 4: &nbsp;A D C F E B A<br>
4 cycles listed, 2 dead ends<br>
each cycle is listed twice (once per direction): 2 different cycles</div>
<p class="nhan">The whole search tree from A</p>
<pre><code class="language-plaintext">A
├── B
│   ├── D ── C ── F ── E    no edge E-A: dead end
│   └── E ── F ── C ── D    edge D-A: cycle 1
├── C
│   ├── D ── B ── E ── F    no edge F-A: dead end
│   └── F ── E ── B ── D    edge D-A: cycle 2
└── D
    ├── B ── E ── F ── C    edge C-A: cycle 3
    └── C ── F ── E ── B    edge B-A: cycle 4</code></pre>
<ul>
<li>6 complete orders are reached: 2 dead ends (the last vertex is not adjacent to A) and 4 cycles.</li>
<li>Cycle 4 is cycle 1 read backwards, cycle 3 is cycle 2 backwards: an undirected graph yields each Hamilton cycle twice, once per direction. Distinct cycles = 4 / 2 = 2.</li>
<li>To print each cycle only once, keep the orders whose second vertex is smaller than their last vertex (A B … D is kept, A D … B is dropped).</li>
</ul>
<p><strong>Big-O:</strong> listing everything explores the whole tree, which can have (n − 1)! leaves — the complete graph K<sub>n</sub> has (n − 1)!/2 distinct Hamilton cycles, already 181 440 for n = 10.</p>
<div class="pitfall">"How many Hamilton cycles does this graph have?" — the search from a fixed start lists 4 here, but the answer is 2: the same cycle traversed in the opposite direction, or started at another vertex, is not a different cycle.</div>`,
        `<p class="ghi-chu">Slide này chỉ trích được phần tiêu đề thành chữ; nội dung bên dưới tiêu đề không có ở đây. Bài giảng đúng ý của tiêu đề bằng ví dụ của bài (đồ thị ở slide 23).</p>
<p class="y-chinh">🎯 Muốn liệt kê mọi chu trình Hamilton, chạy đúng phép quay lui (backtracking) đó nhưng không dừng ở chu trình đầu tiên: ghi nhận nó, lùi lại, và tìm tiếp cho tới khi mọi nhánh của cây tìm kiếm (search tree) đều đã được duyệt.</p>
<pre><code class="language-java">public class AllHamiltonCycles {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F'};
    static int n = v.length;
    static int[][] a = new int[n][n];
    static int[] h = new int[n];
    static boolean[] inH = new boolean[n];
    static int len = 0, found = 0, deadEnds = 0;

    static String show() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; len; i++) s.append(v[h[i]]).append(' ');
        return s.toString();
    }

    static void extend() {
        if (len == n) {
            if (a[h[n - 1]][h[0]] &gt; 0) System.out.println("cycle " + (++found) + ":  " + show() + "A");
            else { deadEnds++; System.out.println("dead end: " + show() + "(" + v[h[n - 1]] + "-A is not an edge)"); }
            return;                                  // KHÔNG dừng: lùi lại và tìm tiếp
        }
        for (int z = 0; z &lt; n; z++)
            if (a[h[len - 1]][z] &gt; 0 &amp;&amp; !inH[z]) {
                h[len++] = z;
                inH[z] = true;
                extend();
                len--;
                inH[z] = false;
            }
    }

    public static void main(String[] args) {
        String[] edges = {"AB", "AC", "AD", "BD", "BE", "CD", "CF", "EF"};
        for (String e : edges) a[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = a[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        h[len++] = 0;
        inH[0] = true;
        extend();
        System.out.println(found + " cycles listed, " + deadEnds + " dead ends");
        System.out.println("each cycle is listed twice (once per direction): " + found / 2 + " different cycles");
    }
}</code></pre>
<div class="out">dead end: A B D C F E (E-A is not an edge)<br>
cycle 1: &nbsp;A B E F C D A<br>
dead end: A C D B E F (F-A is not an edge)<br>
cycle 2: &nbsp;A C F E B D A<br>
cycle 3: &nbsp;A D B E F C A<br>
cycle 4: &nbsp;A D C F E B A<br>
4 cycles listed, 2 dead ends<br>
each cycle is listed twice (once per direction): 2 different cycles</div>
<p class="nhan">Toàn bộ cây tìm kiếm từ A</p>
<pre><code class="language-plaintext">A
├── B
│   ├── D ── C ── F ── E    không có cạnh E-A: ngõ cụt
│   └── E ── F ── C ── D    có cạnh D-A: chu trình 1
├── C
│   ├── D ── B ── E ── F    không có cạnh F-A: ngõ cụt
│   └── F ── E ── B ── D    có cạnh D-A: chu trình 2
└── D
    ├── B ── E ── F ── C    có cạnh C-A: chu trình 3
    └── C ── F ── E ── B    có cạnh B-A: chu trình 4</code></pre>
<ul>
<li>Có 6 thứ tự đi đủ 6 đỉnh: 2 ngõ cụt (dead end — đỉnh cuối không kề A) và 4 chu trình.</li>
<li>Chu trình 4 là chu trình 1 đọc ngược, chu trình 3 là chu trình 2 đọc ngược: đồ thị vô hướng cho mỗi chu trình Hamilton hai lần, mỗi chiều một lần. Số chu trình khác nhau = 4 / 2 = 2.</li>
<li>Muốn in mỗi chu trình đúng một lần, chỉ giữ các thứ tự có đỉnh thứ hai nhỏ hơn đỉnh cuối (giữ A B … D, bỏ A D … B).</li>
</ul>
<p><strong>Big-O:</strong> liệt kê tất cả nghĩa là duyệt cả cây, mà cây có thể có tới (n − 1)! lá — đồ thị đầy đủ (complete graph) K<sub>n</sub> có (n − 1)!/2 chu trình Hamilton khác nhau, đã là 181 440 với n = 10.</p>
<div class="pitfall">"Đồ thị này có bao nhiêu chu trình Hamilton?" — tìm từ một đỉnh cố định thì liệt kê được 4, nhưng đáp án là 2: cùng một chu trình đi theo chiều ngược lại, hay bắt đầu từ đỉnh khác, không phải là một chu trình mới.</div>`],
      [26, 'Graph coloring - 1',
        `<p class="y-chinh">🎯 Colouring a graph gives each vertex a colour so that no two adjacent vertices share one; the chromatic number χ(G) is the fewest colours that make this possible, and determining it is NP-complete.</p>
<ul>
<li><strong>Chromatic number χ(G)</strong>: the minimum number of colours with which adjacent vertices always differ.</li>
<li>The slide calls a graph with k = χ(G) "k-colorable". Many textbooks say "k-colorable" for "can be coloured with k colours" (χ(G) ≤ k) and "k-chromatic" for χ(G) = k — know both readings.</li>
<li><strong>Formulas on the slide</strong>: χ(K<sub>n</sub>) = n (every pair is adjacent); χ(C<sub>2n</sub>) = 2 (even cycle: alternate two colours); χ(C<sub>2n+1</sub>) = 3 (odd cycle: alternating fails at the last vertex); bipartite graph: χ(G) ≤ 2 (one colour per side).</li>
<li><strong>Uses</strong>: exam timetabling (subjects = vertices, an edge when some student takes both, colours = time slots), register allocation in compilers, radio frequency assignment.</li>
</ul>
<pre><code class="language-java">public class Chromatic {
    static int n;
    static int[][] a;
    static int[] col;

    static boolean color(int i, int k) {            // give vertex i a colour from 1..k, then go on
        if (i == n) return true;
        for (int c = 1; c &lt;= k; c++) {
            boolean ok = true;
            for (int j = 0; j &lt; i; j++) if (a[i][j] &gt; 0 &amp;&amp; col[j] == c) ok = false;
            if (ok) {
                col[i] = c;
                if (color(i + 1, k)) return true;
            }
        }
        col[i] = 0;                                  // no colour fits: backtrack
        return false;
    }

    static void chi(String name, int size, int[][] edges) {
        n = size;
        a = new int[n][n];
        col = new int[n];
        for (int[] e : edges) a[e[0]][e[1]] = a[e[1]][e[0]] = 1;
        int k = 1;
        while (!color(0, k)) k++;                    // try 1 colour, 2 colours, ... (exponential)
        StringBuilder s = new StringBuilder();
        for (int c : col) s.append(' ').append(c);
        System.out.printf("%-18s chi = %d, colours%s%n", name, k, s);
    }

    public static void main(String[] args) {
        chi("K4 (complete)", 4, new int[][] {{0, 1}, {0, 2}, {0, 3}, {1, 2}, {1, 3}, {2, 3}});
        chi("C6 (even cycle)", 6, new int[][] {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 5}, {5, 0}});
        chi("C5 (odd cycle)", 5, new int[][] {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 0}});
        chi("K2,3 (bipartite)", 5, new int[][] {{0, 2}, {0, 3}, {0, 4}, {1, 2}, {1, 3}, {1, 4}});
    }
}</code></pre>
<div class="out">K4 (complete) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;chi = 4, colours 1 2 3 4<br>
C6 (even cycle) &nbsp;&nbsp;&nbsp;chi = 2, colours 1 2 1 2 1 2<br>
C5 (odd cycle) &nbsp;&nbsp;&nbsp;&nbsp;chi = 3, colours 1 2 1 2 3<br>
K2,3 (bipartite) &nbsp;&nbsp;chi = 2, colours 1 1 2 2 2</div>
<p>The program finds χ by brute force: try 1 colour, then 2, then 3 … and backtrack over the colourings — up to k<sup>n</sup> of them. That exponential search is what "NP-complete" means in practice (strictly, the NP-complete problem is the yes/no question "can G be coloured with k colours?"): no fast exact method is known, so slides 27–28 use fast heuristics.</p>
<p class="dap-an">✅ <strong>CQ11.1 — How do you colour a graph with the least number of colours?</strong> Exactly: only by an exponential search such as backtracking, feasible for small graphs. In practice: a heuristic such as sequential colouring in a good order (largest first, Brélaz) — fast, but it only guarantees an upper bound on χ(G).</p>
<div class="pitfall">"Bipartite ⇒ χ = 2" is not quite right: a bipartite graph with no edges has χ = 1 — hence the slide's "≤ 2". And C<sub>2n+1</sub> is a cycle with an odd number of vertices (C3, C5, …), not "any graph with an odd number of vertices".</div>`,
        `<p class="y-chinh">🎯 Tô màu đồ thị (graph coloring) là gán cho mỗi đỉnh một màu sao cho không có hai đỉnh kề nhau nào cùng màu; sắc số (chromatic number) χ(G) là số màu ít nhất làm được việc đó, và xác định nó là bài toán NP-đầy đủ (NP-complete).</p>
<ul>
<li><strong>Sắc số χ(G)</strong>: số màu nhỏ nhất mà với nó hai đỉnh kề nhau luôn khác màu.</li>
<li>Slide gọi đồ thị có k = χ(G) là "k-colorable" (tô được bằng k màu). Nhiều giáo trình dùng "k-colorable" với nghĩa "tô được bằng k màu" (χ(G) ≤ k) và "k-chromatic" (k-sắc) cho χ(G) = k — nên biết cả hai cách hiểu.</li>
<li><strong>Công thức trên slide</strong>: χ(K<sub>n</sub>) = n (mọi cặp đỉnh đều kề nhau); χ(C<sub>2n</sub>) = 2 (chu trình chẵn: tô xen kẽ hai màu); χ(C<sub>2n+1</sub>) = 3 (chu trình lẻ: tô xen kẽ bị hỏng ở đỉnh cuối); đồ thị hai phía (bipartite graph): χ(G) ≤ 2 (mỗi phía một màu).</li>
<li><strong>Ứng dụng</strong>: xếp lịch thi (môn học = đỉnh, nối cạnh khi có sinh viên học cả hai môn, màu = ca thi), cấp phát thanh ghi (register allocation) trong trình biên dịch, phân tần số vô tuyến.</li>
</ul>
<pre><code class="language-java">public class Chromatic {
    static int n;
    static int[][] a;
    static int[] col;

    static boolean color(int i, int k) {            // cho đỉnh i một màu trong 1..k, rồi làm tiếp
        if (i == n) return true;
        for (int c = 1; c &lt;= k; c++) {
            boolean ok = true;
            for (int j = 0; j &lt; i; j++) if (a[i][j] &gt; 0 &amp;&amp; col[j] == c) ok = false;
            if (ok) {
                col[i] = c;
                if (color(i + 1, k)) return true;
            }
        }
        col[i] = 0;                                  // không màu nào hợp: quay lui
        return false;
    }

    static void chi(String name, int size, int[][] edges) {
        n = size;
        a = new int[n][n];
        col = new int[n];
        for (int[] e : edges) a[e[0]][e[1]] = a[e[1]][e[0]] = 1;
        int k = 1;
        while (!color(0, k)) k++;                    // thử 1 màu, 2 màu, ... (hàm mũ)
        StringBuilder s = new StringBuilder();
        for (int c : col) s.append(' ').append(c);
        System.out.printf("%-18s chi = %d, colours%s%n", name, k, s);
    }

    public static void main(String[] args) {
        chi("K4 (complete)", 4, new int[][] {{0, 1}, {0, 2}, {0, 3}, {1, 2}, {1, 3}, {2, 3}});
        chi("C6 (even cycle)", 6, new int[][] {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 5}, {5, 0}});
        chi("C5 (odd cycle)", 5, new int[][] {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 0}});
        chi("K2,3 (bipartite)", 5, new int[][] {{0, 2}, {0, 3}, {0, 4}, {1, 2}, {1, 3}, {1, 4}});
    }
}</code></pre>
<div class="out">K4 (complete) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;chi = 4, colours 1 2 3 4<br>
C6 (even cycle) &nbsp;&nbsp;&nbsp;chi = 2, colours 1 2 1 2 1 2<br>
C5 (odd cycle) &nbsp;&nbsp;&nbsp;&nbsp;chi = 3, colours 1 2 1 2 3<br>
K2,3 (bipartite) &nbsp;&nbsp;chi = 2, colours 1 1 2 2 2</div>
<p>Chương trình tìm χ bằng vét cạn (brute force): thử 1 màu, rồi 2, rồi 3 … và quay lui qua các cách tô — có thể tới k<sup>n</sup> cách. Phép tìm kiếm hàm mũ đó chính là ý nghĩa thực tế của "NP-đầy đủ" (nói chặt chẽ, bài toán NP-đầy đủ là câu hỏi có/không "G có tô được bằng k màu không?"): chưa biết cách chính xác nào nhanh, nên slide 27–28 dùng các phương pháp gần đúng nhanh (heuristic).</p>
<p class="dap-an">✅ <strong>CQ11.1 — Làm sao tô màu đồ thị với số màu ít nhất?</strong> Muốn chính xác: chỉ có cách tìm kiếm hàm mũ như quay lui (backtracking), làm được với đồ thị nhỏ. Trong thực tế: dùng heuristic như tô tuần tự theo một thứ tự tốt (largest first — bậc lớn trước, Brélaz) — nhanh, nhưng chỉ bảo đảm một cận trên của χ(G).</p>
<div class="pitfall">"Hai phía ⇒ χ = 2" chưa hẳn đúng: đồ thị hai phía không có cạnh nào có χ = 1 — vì thế slide ghi "≤ 2". Và C<sub>2n+1</sub> là chu trình có số đỉnh lẻ (C3, C5, …), không phải "đồ thị bất kỳ có số đỉnh lẻ".</div>`],
      [27, 'Graph coloring - 2',
        `<p class="y-chinh">🎯 Sequential colouring fixes an order of the vertices and of the colours, then gives each vertex in turn the lowest-numbered colour that none of its already-coloured neighbours has — O(|V|²), but the result depends on the order.</p>
<ol>
<li>Put the vertices in some order v<sub>P1</sub>, v<sub>P2</sub>, …, v<sub>P|V|</sub>.</li>
<li>Put the colours in an order c<sub>1</sub>, c<sub>2</sub>, … (here simply 1, 2, 3, …).</li>
<li>For i = 1 to |V|: j = the smallest index of a colour that does not appear on any neighbour of v<sub>Pi</sub>; colour v<sub>Pi</sub> with c<sub>j</sub>.</li>
</ol>
<p class="nhan">The lesson's own graph (bipartite, so χ = 2), coloured in index order A, B, …, H</p>
<pre><code class="language-plaintext">E --- A --- C --- H --- B
                  |     |
                  G --- F
                  |
                  D</code></pre>
<pre><code class="language-java">public class SequentialColoring {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        int n = v.length;
        int[][] a = new int[n][n];
        String[] edges = {"AC", "AE", "BF", "BH", "CH", "DG", "FG", "GH"};
        for (String e : edges) a[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = a[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        int[] color = new int[n];                    // 0 = not coloured yet; colours are 1, 2, 3, ...
        int used = 0;
        for (int i = 0; i &lt; n; i++) {                // vertices in the order A, B, ..., H (by index)
            boolean[] taken = new boolean[n + 2];
            String nb = "";
            for (int w = 0; w &lt; n; w++)              // colours already on the neighbours: O(|V|)
                if (a[i][w] &gt; 0 &amp;&amp; color[w] &gt; 0) { taken[color[w]] = true; nb += v[w] + "=" + color[w] + " "; }
            int j = 1;
            while (taken[j]) j++;                    // smallest colour no neighbour has
            color[i] = j;
            used = Math.max(used, j);
            System.out.printf("%c: coloured neighbours %-12s-&gt; colour %d%n", v[i], nb.isEmpty() ? "none" : nb, j);
        }
        System.out.println("colours used: " + used);
    }
}</code></pre>
<div class="out">A: coloured neighbours none &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 1<br>
B: coloured neighbours none &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 1<br>
C: coloured neighbours A=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 2<br>
D: coloured neighbours none &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 1<br>
E: coloured neighbours A=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 2<br>
F: coloured neighbours B=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 2<br>
G: coloured neighbours D=1 F=2 &nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 3<br>
H: coloured neighbours B=1 C=2 G=3 -&gt; colour 4<br>
colours used: 4</div>
<p>H comes last, and its three neighbours B, C and G already carry three different colours, so it needs a 4th — twice the optimum. A different order (slide 28) avoids this.</p>
<p><strong>Big-O:</strong> |V| vertices × one scan of a matrix row (up to |V| neighbours) to see which colours are taken → O(|V|²), as the slide says. Greedy colouring never needs more than Δ + 1 colours (Δ = the largest degree): here Δ = 3, and 4 colours is exactly that worst case.</p>
<div class="pitfall">Sequential colouring gives <em>a</em> valid colouring, not the minimum. "The sequential algorithm computes χ(G)" is false — it gives an upper bound: this graph has χ = 2, yet index order uses 4.</div>`,
        `<p class="y-chinh">🎯 Tô màu tuần tự (sequential coloring) cố định trước một thứ tự đỉnh và một thứ tự màu, rồi lần lượt gán cho mỗi đỉnh màu có số nhỏ nhất mà chưa đỉnh kề nào đã tô mang — O(|V|²), nhưng kết quả phụ thuộc vào thứ tự.</p>
<ol>
<li>Xếp các đỉnh theo một thứ tự v<sub>P1</sub>, v<sub>P2</sub>, …, v<sub>P|V|</sub>.</li>
<li>Xếp các màu theo thứ tự c<sub>1</sub>, c<sub>2</sub>, … (ở đây đơn giản là 1, 2, 3, …).</li>
<li>Với i = 1 tới |V|: j = chỉ số nhỏ nhất của màu không xuất hiện ở đỉnh kề nào của v<sub>Pi</sub>; tô v<sub>Pi</sub> bằng c<sub>j</sub>.</li>
</ol>
<p class="nhan">Đồ thị của bài (hai phía — bipartite, nên χ = 2), tô theo thứ tự chỉ số A, B, …, H</p>
<pre><code class="language-plaintext">E --- A --- C --- H --- B
                  |     |
                  G --- F
                  |
                  D</code></pre>
<pre><code class="language-java">public class SequentialColoring {
    public static void main(String[] args) {
        char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        int n = v.length;
        int[][] a = new int[n][n];
        String[] edges = {"AC", "AE", "BF", "BH", "CH", "DG", "FG", "GH"};
        for (String e : edges) a[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = a[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        int[] color = new int[n];                    // 0 = chưa tô; các màu là 1, 2, 3, ...
        int used = 0;
        for (int i = 0; i &lt; n; i++) {                // các đỉnh theo thứ tự A, B, ..., H (theo chỉ số)
            boolean[] taken = new boolean[n + 2];
            String nb = "";
            for (int w = 0; w &lt; n; w++)              // màu đã có trên các đỉnh kề: O(|V|)
                if (a[i][w] &gt; 0 &amp;&amp; color[w] &gt; 0) { taken[color[w]] = true; nb += v[w] + "=" + color[w] + " "; }
            int j = 1;
            while (taken[j]) j++;                    // màu nhỏ nhất chưa đỉnh kề nào có
            color[i] = j;
            used = Math.max(used, j);
            System.out.printf("%c: coloured neighbours %-12s-&gt; colour %d%n", v[i], nb.isEmpty() ? "none" : nb, j);
        }
        System.out.println("colours used: " + used);
    }
}</code></pre>
<div class="out">A: coloured neighbours none &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 1<br>
B: coloured neighbours none &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 1<br>
C: coloured neighbours A=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 2<br>
D: coloured neighbours none &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 1<br>
E: coloured neighbours A=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 2<br>
F: coloured neighbours B=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 2<br>
G: coloured neighbours D=1 F=2 &nbsp;&nbsp;&nbsp;&nbsp;-&gt; colour 3<br>
H: coloured neighbours B=1 C=2 G=3 -&gt; colour 4<br>
colours used: 4</div>
<p>H đứng cuối, và ba đỉnh kề B, C, G của nó đã mang ba màu khác nhau, nên nó cần màu thứ 4 — gấp đôi tối ưu. Đổi thứ tự khác (slide 28) sẽ tránh được chuyện này.</p>
<p><strong>Big-O:</strong> |V| đỉnh × một lượt quét hàng ma trận (tới |V| đỉnh kề) để biết màu nào đã bị chiếm → O(|V|²), đúng như slide ghi. Tô màu tham lam (greedy) không bao giờ cần quá Δ + 1 màu (Δ = bậc lớn nhất): ở đây Δ = 3, và 4 màu đúng là trường hợp xấu nhất đó.</p>
<div class="pitfall">Tô tuần tự cho <em>một</em> cách tô hợp lệ, không phải cách tô ít màu nhất. Câu "thuật toán tuần tự tính ra χ(G)" là SAI — nó chỉ cho một cận trên: đồ thị này có χ = 2, vậy mà thứ tự chỉ số dùng tới 4 màu.</div>`],
      [28, 'Graph Coloring - 3',
        `<p class="y-chinh">🎯 The same sequential rule with three different vertex orders — by index, largest degree first, and Brélaz's order chosen on the fly — can give three different numbers of colours.</p>
<p>The slide shows this with a picture: (a) a graph used for colouring, (b) the colours assigned by the sequential algorithm with the vertices ordered by index number, (c) with the vertices in largest-first sequence, (d) the colouring obtained with the Brélaz algorithm. Compare it with the same three strategies on the lesson's graph of slide 27:</p>
<ul>
<li><strong>(b) By index</strong>: A, B, C, … — the order of slide 27.</li>
<li><strong>(c) Largest first</strong>: sort by degree, largest first (ties: smaller index) — high-degree vertices are the hardest to colour, so colour them while many colours are still free.</li>
<li><strong>(d) Brélaz (DSATUR)</strong>: no fixed order; each time pick the uncoloured vertex whose neighbours already show the most different colours (its saturation degree), ties broken by the most uncoloured neighbours, then by the smaller index.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class ColoringOrders {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    static int n = v.length;
    static int[][] a = new int[n][n];
    static int[] deg = new int[n];

    static int smallestFree(int[] color, int u) {
        boolean[] taken = new boolean[n + 2];
        for (int w = 0; w &lt; n; w++) if (a[u][w] &gt; 0) taken[color[w]] = true;
        int c = 1;
        while (taken[c]) c++;
        return c;
    }

    static void report(String name, Integer[] order, int[] color) {
        StringBuilder o = new StringBuilder(), c = new StringBuilder();
        int max = 0;
        for (int u : order) o.append(v[u]);
        for (int u = 0; u &lt; n; u++) { c.append(v[u]).append(color[u]).append(' '); max = Math.max(max, color[u]); }
        System.out.printf("%-17s order %s  %s-&gt; %d colours%n", name, o, c, max);
    }

    public static void main(String[] args) {
        String[] edges = {"AC", "AE", "BF", "BH", "CH", "DG", "FG", "GH"};
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;
            deg[x]++;
            deg[y]++;
        }
        Integer[] byIndex = new Integer[n], largest = new Integer[n], brelaz = new Integer[n];
        for (int i = 0; i &lt; n; i++) byIndex[i] = largest[i] = i;
        // (c) largest degree first; equal degrees keep index order
        Arrays.sort(largest, (x, y) -&gt; deg[y] - deg[x]);
        for (Integer[] order : new Integer[][] {byIndex, largest}) {
            int[] color = new int[n];
            for (int u : order) color[u] = smallestFree(color, u);     // the sequential algorithm of slide 27
            report(order == byIndex ? "(b) by index" : "(c) largest first", order, color);
        }
        int[] color = new int[n];                    // (d) Brelaz: order decided while colouring
        for (int step = 0; step &lt; n; step++) {
            int best = -1, bestSat = -1, bestDeg = -1;
            for (int u = 0; u &lt; n; u++) {
                if (color[u] &gt; 0) continue;
                boolean[] seen = new boolean[n + 2];
                int sat = 0, unc = 0;                // saturation = distinct colours next to u
                for (int w = 0; w &lt; n; w++)
                    if (a[u][w] &gt; 0) {
                        if (color[w] == 0) unc++;
                        else if (!seen[color[w]]) { seen[color[w]] = true; sat++; }
                    }
                if (sat &gt; bestSat || (sat == bestSat &amp;&amp; unc &gt; bestDeg)) { best = u; bestSat = sat; bestDeg = unc; }
            }
            color[best] = smallestFree(color, best);
            brelaz[step] = best;
        }
        report("(d) Brelaz", brelaz, color);
    }
}</code></pre>
<div class="out">(b) by index &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order ABCDEFGH &nbsp;A1 B1 C2 D1 E2 F2 G3 H4 -&gt; 4 colours<br>
(c) largest first order GHABCFDE &nbsp;A1 B1 C3 D2 E2 F2 G1 H2 -&gt; 3 colours<br>
(d) Brelaz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order GHBCADEF &nbsp;A2 B1 C1 D2 E1 F2 G1 H2 -&gt; 2 colours</div>
<table>
<thead><tr><th>Vertex</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th></tr></thead>
<tbody>
<tr><td>Degree</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td><td>3</td><td>3</td></tr>
<tr><td>(b) by index</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>(c) largest first</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>(d) Brélaz</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<p>Brélaz reaches χ = 2 here: after G = 1 and H = 2, every next vertex is forced by an already-coloured neighbour, so the colours follow the two sides of the bipartite graph. <strong>Big-O:</strong> largest-first adds a sort, O(|V| log |V|); Brélaz with the saturation kept in arrays finds the next vertex in O(|V|) per step → O(|V|²) (the short program recomputes saturations each step, O(|V|³), fine for 8 vertices).</p>
<div class="pitfall">These are heuristics: largest-first and Brélaz usually use fewer colours than index order, but none of them guarantees χ(G) on every graph. In an FE question apply the stated order exactly — including how ties are broken.</div>`,
        `<p class="y-chinh">🎯 Cùng một quy tắc tô tuần tự với ba thứ tự đỉnh khác nhau — theo chỉ số, bậc lớn trước, và thứ tự Brélaz chọn dần trong lúc tô — có thể cho ra ba số màu khác nhau.</p>
<p>Slide minh hoạ bằng hình: (a) một đồ thị cần tô, (b) màu do thuật toán tuần tự gán khi xếp đỉnh theo chỉ số, (c) khi xếp đỉnh theo thứ tự bậc lớn trước (largest first), (d) cách tô thu được bằng thuật toán Brélaz. Hãy đối chiếu với cùng ba chiến lược trên đồ thị của bài ở slide 27:</p>
<ul>
<li><strong>(b) Theo chỉ số (by index)</strong>: A, B, C, … — đúng thứ tự của slide 27.</li>
<li><strong>(c) Bậc lớn trước (largest first)</strong>: sắp theo bậc giảm dần (bằng nhau thì chỉ số nhỏ trước) — đỉnh bậc cao là đỉnh khó tô nhất, nên tô chúng khi còn nhiều màu trống.</li>
<li><strong>(d) Brélaz (DSATUR)</strong>: không có thứ tự cố định; mỗi lần chọn đỉnh chưa tô mà các đỉnh kề đã mang nhiều màu khác nhau nhất (độ bão hoà — saturation degree), hoà thì chọn đỉnh có nhiều đỉnh kề chưa tô nhất, rồi tới chỉ số nhỏ hơn.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class ColoringOrders {
    static char[] v = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
    static int n = v.length;
    static int[][] a = new int[n][n];
    static int[] deg = new int[n];

    static int smallestFree(int[] color, int u) {
        boolean[] taken = new boolean[n + 2];
        for (int w = 0; w &lt; n; w++) if (a[u][w] &gt; 0) taken[color[w]] = true;
        int c = 1;
        while (taken[c]) c++;
        return c;
    }

    static void report(String name, Integer[] order, int[] color) {
        StringBuilder o = new StringBuilder(), c = new StringBuilder();
        int max = 0;
        for (int u : order) o.append(v[u]);
        for (int u = 0; u &lt; n; u++) { c.append(v[u]).append(color[u]).append(' '); max = Math.max(max, color[u]); }
        System.out.printf("%-17s order %s  %s-&gt; %d colours%n", name, o, c, max);
    }

    public static void main(String[] args) {
        String[] edges = {"AC", "AE", "BF", "BH", "CH", "DG", "FG", "GH"};
        for (String e : edges) {
            int x = e.charAt(0) - 'A', y = e.charAt(1) - 'A';
            a[x][y] = a[y][x] = 1;
            deg[x]++;
            deg[y]++;
        }
        Integer[] byIndex = new Integer[n], largest = new Integer[n], brelaz = new Integer[n];
        for (int i = 0; i &lt; n; i++) byIndex[i] = largest[i] = i;
        // (c) bậc lớn trước; bậc bằng nhau giữ thứ tự chỉ số
        Arrays.sort(largest, (x, y) -&gt; deg[y] - deg[x]);
        for (Integer[] order : new Integer[][] {byIndex, largest}) {
            int[] color = new int[n];
            for (int u : order) color[u] = smallestFree(color, u);     // thuật toán tuần tự của slide 27
            report(order == byIndex ? "(b) by index" : "(c) largest first", order, color);
        }
        int[] color = new int[n];                    // (d) Brélaz: thứ tự quyết định trong lúc tô
        for (int step = 0; step &lt; n; step++) {
            int best = -1, bestSat = -1, bestDeg = -1;
            for (int u = 0; u &lt; n; u++) {
                if (color[u] &gt; 0) continue;
                boolean[] seen = new boolean[n + 2];
                int sat = 0, unc = 0;                // độ bão hoà = số màu khác nhau quanh u
                for (int w = 0; w &lt; n; w++)
                    if (a[u][w] &gt; 0) {
                        if (color[w] == 0) unc++;
                        else if (!seen[color[w]]) { seen[color[w]] = true; sat++; }
                    }
                if (sat &gt; bestSat || (sat == bestSat &amp;&amp; unc &gt; bestDeg)) { best = u; bestSat = sat; bestDeg = unc; }
            }
            color[best] = smallestFree(color, best);
            brelaz[step] = best;
        }
        report("(d) Brelaz", brelaz, color);
    }
}</code></pre>
<div class="out">(b) by index &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order ABCDEFGH &nbsp;A1 B1 C2 D1 E2 F2 G3 H4 -&gt; 4 colours<br>
(c) largest first order GHABCFDE &nbsp;A1 B1 C3 D2 E2 F2 G1 H2 -&gt; 3 colours<br>
(d) Brelaz &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;order GHBCADEF &nbsp;A2 B1 C1 D2 E1 F2 G1 H2 -&gt; 2 colours</div>
<table>
<thead><tr><th>Đỉnh</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th></tr></thead>
<tbody>
<tr><td>Bậc</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td><td>3</td><td>3</td></tr>
<tr><td>(b) theo chỉ số</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>(c) bậc lớn trước</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>(d) Brélaz</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<p>Ở đây Brélaz đạt đúng χ = 2: sau G = 1 và H = 2, mỗi đỉnh tiếp theo đều bị ép màu bởi một đỉnh kề đã tô, nên màu đi theo đúng hai phía của đồ thị hai phía (bipartite graph). <strong>Big-O:</strong> bậc lớn trước thêm một lần sắp xếp, O(|V| log |V|); Brélaz lưu độ bão hoà trong mảng thì tìm đỉnh kế tiếp mất O(|V|) mỗi bước → O(|V|²) (chương trình ngắn ở trên tính lại độ bão hoà ở mỗi bước, O(|V|³), vẫn ổn với 8 đỉnh).</p>
<div class="pitfall">Đây đều là heuristic (phương pháp gần đúng): bậc lớn trước và Brélaz thường dùng ít màu hơn thứ tự chỉ số, nhưng không cách nào bảo đảm ra đúng χ(G) trên mọi đồ thị. Gặp câu FE (thi cuối kỳ), hãy áp đúng thứ tự đề cho — kể cả cách phá thế hoà.</div>`],
      [29, 'Summary',
        `<p class="y-chinh">🎯 Five topics — spanning trees, Prim, Kruskal, Eulerian and Hamilton graphs, graph colouring — each with one rule to remember and one cost.</p>
<table>
<thead><tr><th>Topic</th><th>The rule to remember</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Spanning tree / MST</td><td>a tree through every vertex, |V| − 1 edges; MST = smallest total weight</td><td>brute force is exponential (K<sub>n</sub> has n<sup>n−2</sup> spanning trees)</td></tr>
<tr><td>Prim</td><td>grow one tree: add the cheapest edge leaving it</td><td>O(|V|²) with a matrix · O(|E| log |V|) with a heap</td></tr>
<tr><td>Kruskal</td><td>cheapest edges first, skip those that close a cycle (union-find)</td><td>O(|E| log |E|)</td></tr>
<tr><td>Euler cycle / path</td><td>every edge once; connected + 0 odd vertices ⇒ cycle, exactly 2 odd ⇒ path</td><td>O(|V| + |E|) to test and to build (adjacency lists)</td></tr>
<tr><td>Hamilton cycle / path</td><td>every vertex once; no simple test</td><td>backtracking, exponential; NP-complete</td></tr>
<tr><td>Graph colouring</td><td>adjacent vertices differ; χ(K<sub>n</sub>) = n, χ(C<sub>2n</sub>) = 2, χ(C<sub>2n+1</sub>) = 3, bipartite ≤ 2</td><td>sequential O(|V|²); the exact χ is NP-complete</td></tr>
</tbody>
</table>
<p class="nhan">Before the exam, be able to…</p>
<ol>
<li>trace Prim from a given start vertex and Kruskal on the same graph, edge by edge, with the running total;</li>
<li>decide from the degrees whether a graph has an Euler cycle, only an Euler path, or neither;</li>
<li>run the stack algorithm of slide 21 by hand and write down E;</li>
<li>explain why a Hamilton cycle needs backtracking while an Euler cycle does not;</li>
<li>colour a graph sequentially in a given order, and state χ for K<sub>n</sub>, even and odd cycles and bipartite graphs.</li>
</ol>
<div class="pitfall">The three mix-ups that cost the most marks in this deck: MST versus shortest path (slide 6), Euler (edges) versus Hamilton (vertices) (slide 23), and "sequential colouring gives χ(G)" — false (slide 27).</div>
<p class="meo">🧠 <strong>Remember the pairs:</strong> Prim ↔ one tree, Kruskal ↔ many clusters; Euler ↔ edges and degrees, Hamilton ↔ vertices and backtracking; colouring ↔ the order matters.</p>`,
        `<p class="y-chinh">🎯 Năm chủ đề — cây khung, Prim, Kruskal, đồ thị Euler và Hamilton, tô màu đồ thị — mỗi chủ đề một quy tắc cần nhớ và một chi phí.</p>
<table>
<thead><tr><th>Chủ đề</th><th>Quy tắc cần nhớ</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>Cây khung (spanning tree) / cây khung nhỏ nhất (MST)</td><td>cây đi qua mọi đỉnh, |V| − 1 cạnh; MST = tổng trọng số nhỏ nhất</td><td>vét cạn là hàm mũ (K<sub>n</sub> có n<sup>n−2</sup> cây khung)</td></tr>
<tr><td>Prim</td><td>nuôi một cây: thêm cạnh rẻ nhất đi ra khỏi cây</td><td>O(|V|²) với ma trận · O(|E| log |V|) với heap (đống)</td></tr>
<tr><td>Kruskal</td><td>cạnh rẻ trước, bỏ cạnh khép chu trình (union-find — hợp–tìm)</td><td>O(|E| log |E|)</td></tr>
<tr><td>Chu trình / đường đi Euler</td><td>mỗi cạnh một lần; liên thông + 0 đỉnh lẻ ⇒ chu trình, đúng 2 đỉnh lẻ ⇒ đường đi</td><td>O(|V| + |E|) để kiểm và để dựng (danh sách kề)</td></tr>
<tr><td>Chu trình / đường đi Hamilton</td><td>mỗi đỉnh một lần; không có phép kiểm đơn giản</td><td>quay lui (backtracking), hàm mũ; NP-đầy đủ (NP-complete)</td></tr>
<tr><td>Tô màu đồ thị (graph coloring)</td><td>hai đỉnh kề khác màu; χ(K<sub>n</sub>) = n, χ(C<sub>2n</sub>) = 2, χ(C<sub>2n+1</sub>) = 3, hai phía ≤ 2</td><td>tô tuần tự O(|V|²); tìm χ chính xác là NP-đầy đủ</td></tr>
</tbody>
</table>
<p class="nhan">Trước khi thi, hãy làm được…</p>
<ol>
<li>chạy tay Prim từ một đỉnh cho trước và Kruskal trên cùng đồ thị, từng cạnh một, kèm tổng trọng số cộng dồn;</li>
<li>chỉ nhìn bậc mà quyết định đồ thị có chu trình Euler, chỉ có đường đi Euler, hay không có gì;</li>
<li>chạy tay thuật toán dùng ngăn xếp (stack) của slide 21 và ghi ra E;</li>
<li>giải thích vì sao chu trình Hamilton cần quay lui (backtracking) còn chu trình Euler thì không;</li>
<li>tô màu tuần tự theo một thứ tự cho trước, và nói được χ của K<sub>n</sub>, của chu trình chẵn, chu trình lẻ và đồ thị hai phía.</li>
</ol>
<div class="pitfall">Ba chỗ nhầm mất điểm nhiều nhất của bộ slide này: MST so với đường đi ngắn nhất (slide 6), Euler (cạnh) so với Hamilton (đỉnh) (slide 23), và "tô tuần tự cho ra χ(G)" — SAI (slide 27).</div>
<p class="meo">🧠 <strong>Mẹo nhớ theo cặp:</strong> Prim ↔ một cây, Kruskal ↔ nhiều cụm; Euler ↔ cạnh và bậc, Hamilton ↔ đỉnh và quay lui; tô màu ↔ thứ tự quyết định kết quả.</p>`],
      [30, 'Reading at home',
        `<p class="y-chinh">🎯 The textbook reading for this deck is Goodrich §14.7 on minimum spanning trees, plus the Euler tour exercise the slide cites.</p>
<ul>
<li><strong>§14.7 Minimum Spanning Trees (p.662)</strong> — the problem of slides 3–7 and the fact that makes the greedy choice safe (the cheapest edge across a split of the vertices belongs to some MST).</li>
<li><strong>§14.7.1 Prim-Jarník Algorithm (p.664)</strong> — slides 8–9, written with a priority queue.</li>
<li><strong>§14.7.2 Kruskal's Algorithm (p.667)</strong> — slides 10–11, with the clusters kept in a union-find (partition) structure.</li>
<li><strong>Euler tour and Euler cycle</strong> — the slide points to an exercise it writes as "C.14.5.2"; look for the Euler tour exercise among the Creativity (C-) exercises at the end of Chapter 14.</li>
</ul>
<p>The slide lists no textbook section for Hamilton cycles and graph colouring; for those, slides 23–28 and this lesson are the reference.</p>`,
        `<p class="y-chinh">🎯 Phần đọc thêm trong giáo trình cho bộ slide này là Goodrich §14.7 về cây khung nhỏ nhất, cộng với bài tập về Euler tour (hành trình Euler) mà slide dẫn ra.</p>
<ul>
<li><strong>§14.7 Minimum Spanning Trees (tr.662)</strong> — bài toán của slide 3–7 và tính chất khiến lựa chọn tham lam (greedy) là an toàn (cạnh rẻ nhất bắc qua một cách chia tập đỉnh thành hai phần luôn thuộc một MST nào đó).</li>
<li><strong>§14.7.1 Prim-Jarník Algorithm (tr.664)</strong> — slide 8–9, viết bằng hàng đợi ưu tiên (priority queue).</li>
<li><strong>§14.7.2 Kruskal's Algorithm (tr.667)</strong> — slide 10–11, các cụm được giữ trong cấu trúc hợp–tìm (union-find, còn gọi là cấu trúc phân hoạch — partition).</li>
<li><strong>Euler tour và Euler cycle</strong> (hành trình Euler, chu trình Euler) — slide trỏ tới một bài tập mà nó ghi là "C.14.5.2"; hãy tìm bài tập về Euler tour trong nhóm bài tập Creativity (C-, bài tập sáng tạo) ở cuối Chương 14.</li>
</ul>
<p>Slide không ghi mục sách nào cho chu trình Hamilton và tô màu đồ thị; với hai phần đó, slide 23–28 và bài học này là tài liệu tham khảo.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ol>
<li>You walk along unused edges in a connected graph whose degrees are all even. Where can you get stuck?</li>
<li>Splice the subcycle 6786 into the cycle 12346531 at vertex 6.</li>
<li>Run the stack algorithm of slide 21 on the triangle 1-2-3 from vertex 1 (smallest neighbour first). What is E?</li>
<li>Why is "does this graph have a Hamilton cycle?" so much harder than "does it have an Euler cycle?"</li>
<li>C5 is coloured sequentially, going once around the cycle. How many colours are used, and is that χ(C5)?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) Only at the start vertex v0 (slide 17). (2) 12346786531. (3) Push 2 (delete 1-2), push 3 (delete 2-3), push 1 (delete 3-1), then pop 1, 3, 2, 1 → E = 1 3 2 1. (4) Euler has a degree test that runs in linear time; for Hamilton no efficient test is known (NP-complete), so one has to search. (5) Colours 1, 2, 1, 2, 3 → 3 colours = χ(C5), because an odd cycle needs 3.</p>
<p><strong>Next:</strong> the deep-dive lessons 5.6 (minimum spanning trees: Prim and Kruskal, union-find) and 5.7 (Euler tours, Euler cycles and Hamilton — Hierholzer's algorithm), then lesson 5.8 to practise the whole chapter and the Chapter 5 quiz.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ol>
<li>Bạn đi theo các cạnh chưa dùng trong một đồ thị liên thông có mọi bậc chẵn. Bạn có thể bị kẹt ở đâu?</li>
<li>Ghép chu trình con 6786 vào chu trình 12346531 tại đỉnh 6.</li>
<li>Chạy thuật toán dùng ngăn xếp (stack) của slide 21 trên tam giác 1-2-3, xuất phát từ đỉnh 1 (đỉnh kề nhỏ nhất trước). E là gì?</li>
<li>Vì sao câu hỏi "đồ thị có chu trình Hamilton không?" khó hơn hẳn "đồ thị có chu trình Euler không?"</li>
<li>Tô tuần tự C5, đi một vòng quanh chu trình. Dùng bao nhiêu màu, và đó có phải χ(C5) không?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Chỉ ở đỉnh xuất phát v0 (slide 17). (2) 12346786531. (3) Đẩy 2 (xoá 1-2), đẩy 3 (xoá 2-3), đẩy 1 (xoá 3-1), rồi lấy ra 1, 3, 2, 1 → E = 1 3 2 1. (4) Euler có phép kiểm bằng bậc chạy trong thời gian tuyến tính; với Hamilton chưa có phép kiểm hiệu quả nào (NP-đầy đủ — NP-complete), nên phải tìm kiếm. (5) Màu 1, 2, 1, 2, 3 → 3 màu = χ(C5), vì chu trình lẻ cần 3 màu.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu 5.6 (cây khung nhỏ nhất: Prim và Kruskal, union-find — hợp–tìm) và 5.7 (đường đi, chu trình Euler và Hamilton — thuật toán Hierholzer), rồi bài 5.8 để luyện cả chương và quiz Chương 5.</p>`),
    books([
      ['goodrich', "Ch.14 Graph Algorithms — §14.7 Minimum Spanning Trees p.662 · §14.7.1 Prim-Jarník Algorithm p.664 · §14.7.2 Kruskal's Algorithm p.667 · Euler tour and Euler cycle: the exercise written \"C.14.5.2\" on the slide (Creativity exercises at the end of Ch.14)", "Chương 14 Graph Algorithms — §14.7 Minimum Spanning Trees tr.662 · §14.7.1 Prim-Jarník Algorithm tr.664 · §14.7.2 Kruskal's Algorithm tr.667 · Euler tour và Euler cycle: bài tập slide ghi là \"C.14.5.2\" (nhóm bài tập Creativity ở cuối Chương 14)"],
    ]),
  ].join('\n'),
};

/* ───────── 5.8 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Graphs ───────── */
const L_on_ch5 = {
  title: '5.8 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Graphs|||5.8 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Đồ thị',
  slug: 'csd201-on-ch5',
  type: 'VIDEO',
  description: '8 bài tập kiểu đề PE trên đồ thị cho bằng ma trận kề (bậc và định lý bắt tay, BFS/DFS có khởi động lại, thành phần liên thông và kiểm cây, tô màu tuần tự, Dijkstra in đường đi, Floyd có cạnh âm, cây khung nhỏ nhất Prim/Kruskal, chu trình Euler bằng ngăn xếp) có lời giải và test tự kiểm chạy thật; 35 thuật ngữ Anh–Việt; tóm tắt 8 ý và bảng độ phức tạp của chương 5.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.8 · Practice &amp; review</span>
<h2>Graphs — practise like the PE, then review</h2>
<p class="lead">Eight exercises in the shape of the practical exam, covering both graph decks — degrees, BFS/DFS, components, colouring, Dijkstra, Floyd, minimum spanning trees and Euler cycles — each with a solution that tests itself. Then the chapter's vocabulary in English and Vietnamese, a one-screen summary and the complexity table to revise from before the FE.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the methods yourself in Eclipse, inside the <code>Graph</code> class below.</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS.</li>
<li>Only then compare with the solution and read the trap under it.</li>
</ol>
<p>A CSD201 PE graph question usually gives a <code>Graph</code> class holding the matrix <code>a</code>, the number of vertices <code>n</code> and the labels <code>v[]</code> (A, B, C…), code that loads the matrix from a data file, and a <code>main</code> that calls <code>f1</code>, <code>f2</code>, … and writes each answer to a file; you fill in the bodies. Here the matrices are typed into <code>main</code> and every answer is printed. Every solution starts from this skeleton:</p></div>
<pre><code class="language-plaintext">class Graph {
    int[][] a;       // adjacency (or weight) matrix
    int n;           // number of vertices
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();   // vertex i is printed as v[i]
    Graph(int[][] b) { a = b; n = b.length; }
    // f1, f2, ... : your methods
}</code></pre>`,
    `<span class="eyebrow">Chương 5 · Bài 5.8 · Thực hành &amp; ôn tập</span>
<h2>Đồ thị — luyện như đề PE, rồi ôn lại</h2>
<p class="lead">Tám bài tập theo dạng đề thi thực hành (PE), phủ cả hai bộ slide đồ thị — bậc, BFS/DFS, thành phần liên thông, tô màu, Dijkstra, Floyd, cây khung nhỏ nhất và chu trình Euler — bài nào cũng có lời giải tự kiểm tra được. Sau đó là thuật ngữ của chương bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình và bảng độ phức tạp để ôn trước FE.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết các hàm trong Eclipse, bên trong lớp <code>Graph</code> dưới đây.</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt).</li>
<li>Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới.</li>
</ol>
<p>Câu đồ thị trong đề PE môn CSD201 thường cho sẵn lớp <code>Graph</code> giữ ma trận <code>a</code>, số đỉnh <code>n</code> và mảng nhãn <code>v[]</code> (A, B, C…), đoạn code nạp ma trận từ file dữ liệu, và hàm <code>main</code> gọi <code>f1</code>, <code>f2</code>, … rồi ghi từng đáp án ra file; bạn viết thân các hàm. Ở đây ma trận được gõ thẳng trong <code>main</code> và mọi kết quả được in ra màn hình. Lời giải nào cũng xuất phát từ bộ khung này:</p></div>
<pre><code class="language-plaintext">class Graph {
    int[][] a;       // ma trận kề (hoặc ma trận trọng số)
    int n;           // số đỉnh
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();   // đỉnh i được in ra là v[i]
    Graph(int[][] b) { a = b; n = b.length; }
    // f1, f2, ... : các hàm bạn viết
}</code></pre>`),
    bi(`<h3>🧪 Exercise 1 — f1: degrees, edges, isolated and odd vertices (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>The undirected graph is an adjacency matrix <code>a</code> (1 = edge). Write <code>deg(i)</code>, <code>degrees()</code> returning "A(2) B(3) …", <code>edges()</code> returning the number of edges, and <code>select(isolated)</code> listing the isolated vertices (degree 0) — or, with <code>false</code>, the vertices of odd degree. Check the handshake theorem Σ deg = 2|E|.</p>
<p class="nhan">Data → expected result</p>
<p>Edges A-B, A-D, B-C, B-D, C-D, D-E, and F alone → A(2) B(3) C(2) D(4) E(1) F(0); 6 edges; 12 = 12; isolated: F; odd: B E.</p>
<p class="nhan">Idea</p>
<p>Degree = row sum; the number of edges = the number of 1s in the upper half (<code>j &gt; i</code>). Both are O(n²) on a matrix.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Graph {
    int[][] a;                                            // adjacency matrix, 1 = edge
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    int deg(int i) {                                      // degree = sum of row i
        int d = 0;
        for (int j = 0; j &lt; n; j++) d += a[i][j];
        return d;
    }

    String degrees() {
        String s = "";
        for (int i = 0; i &lt; n; i++) s += v[i] + "(" + deg(i) + ") ";
        return s.trim();
    }

    int edges() {                                         // each edge once: upper half only
        int m = 0;
        for (int i = 0; i &lt; n; i++)
            for (int j = i + 1; j &lt; n; j++) m += a[i][j];
        return m;
    }

    String select(boolean isolated) {                     // degree 0, or odd degree
        String s = "";
        for (int i = 0; i &lt; n; i++)
            if (isolated ? deg(i) == 0 : deg(i) % 2 == 1) s += v[i] + " ";
        return s.trim();
    }
}

public class Pe1Degrees {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {                 // A-B A-D B-C B-D C-D D-E, F isolated
            {0, 1, 0, 1, 0, 0}, {1, 0, 1, 1, 0, 0}, {0, 1, 0, 1, 0, 0},
            {1, 1, 1, 0, 1, 0}, {0, 0, 0, 1, 0, 0}, {0, 0, 0, 0, 0, 0}});
        check("degrees", g.degrees(), "A(2) B(3) C(2) D(4) E(1) F(0)");
        check("number of edges", "" + g.edges(), "6");
        int sum = 0;
        for (int i = 0; i &lt; g.n; i++) sum += g.deg(i);
        check("handshake: sum of degrees = 2|E|", sum + " = " + 2 * g.edges(), "12 = 12");
        check("isolated vertices", g.select(true), "F");
        check("odd-degree vertices (an even number of them)", g.select(false), "B E");
        Graph k4 = new Graph(new int[][] {{0, 1, 1, 1}, {1, 0, 1, 1}, {1, 1, 0, 1}, {1, 1, 1, 0}});
        check("K4: every degree 3, 4*3/2 edges", k4.degrees() + " | " + k4.edges(), "A(3) B(3) C(3) D(3) | 6");
        Graph none = new Graph(new int[3][3]);
        check("no edge at all", none.edges() + " | " + none.select(true), "0 | A B C");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS degrees<br>
PASS number of edges<br>
PASS handshake: sum of degrees = 2|E|<br>
PASS isolated vertices<br>
PASS odd-degree vertices (an even number of them)<br>
PASS K4: every degree 3, 4*3/2 edges<br>
PASS no edge at all<br>
ALL TESTS PASSED</div>
<div class="pitfall">Counting every 1 of the matrix gives 12 = 2|E|, not 6. And the list of odd-degree vertices always has an <em>even</em> length: if your program prints an odd number of them, the matrix is not symmetric — a typo in the data or a one-sided <code>a[u][v] = 1</code>.</div>`,
    `<h3>🧪 Bài 1 — f1: bậc, số cạnh, đỉnh cô lập và đỉnh bậc lẻ (kiểu PE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Đồ thị vô hướng cho bằng ma trận kề (adjacency matrix) <code>a</code> (1 = có cạnh). Viết <code>deg(i)</code>, <code>degrees()</code> trả về "A(2) B(3) …", <code>edges()</code> trả về số cạnh, và <code>select(isolated)</code> liệt kê các đỉnh cô lập (isolated, bậc 0) — hoặc, với <code>false</code>, các đỉnh bậc lẻ. Kiểm định lý bắt tay (handshake theorem) Σ deg = 2|E|.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Các cạnh A-B, A-D, B-C, B-D, C-D, D-E, và F đứng riêng → A(2) B(3) C(2) D(4) E(1) F(0); 6 cạnh; 12 = 12; cô lập: F; bậc lẻ: B E.</p>
<p class="nhan">Ý tưởng</p>
<p>Bậc (degree) = tổng hàng; số cạnh = số con số 1 ở nửa trên (<code>j &gt; i</code>). Cả hai đều O(n²) trên ma trận.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Graph {
    int[][] a;                                            // ma trận kề, 1 = có cạnh
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    int deg(int i) {                                      // bậc = tổng hàng i
        int d = 0;
        for (int j = 0; j &lt; n; j++) d += a[i][j];
        return d;
    }

    String degrees() {
        String s = "";
        for (int i = 0; i &lt; n; i++) s += v[i] + "(" + deg(i) + ") ";
        return s.trim();
    }

    int edges() {                                         // mỗi cạnh một lần: chỉ nửa trên
        int m = 0;
        for (int i = 0; i &lt; n; i++)
            for (int j = i + 1; j &lt; n; j++) m += a[i][j];
        return m;
    }

    String select(boolean isolated) {                     // bậc 0, hoặc bậc lẻ
        String s = "";
        for (int i = 0; i &lt; n; i++)
            if (isolated ? deg(i) == 0 : deg(i) % 2 == 1) s += v[i] + " ";
        return s.trim();
    }
}

public class Pe1Degrees {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {                 // A-B A-D B-C B-D C-D D-E, F cô lập
            {0, 1, 0, 1, 0, 0}, {1, 0, 1, 1, 0, 0}, {0, 1, 0, 1, 0, 0},
            {1, 1, 1, 0, 1, 0}, {0, 0, 0, 1, 0, 0}, {0, 0, 0, 0, 0, 0}});
        check("degrees", g.degrees(), "A(2) B(3) C(2) D(4) E(1) F(0)");
        check("number of edges", "" + g.edges(), "6");
        int sum = 0;
        for (int i = 0; i &lt; g.n; i++) sum += g.deg(i);
        check("handshake: sum of degrees = 2|E|", sum + " = " + 2 * g.edges(), "12 = 12");
        check("isolated vertices", g.select(true), "F");
        check("odd-degree vertices (an even number of them)", g.select(false), "B E");
        Graph k4 = new Graph(new int[][] {{0, 1, 1, 1}, {1, 0, 1, 1}, {1, 1, 0, 1}, {1, 1, 1, 0}});
        check("K4: every degree 3, 4*3/2 edges", k4.degrees() + " | " + k4.edges(), "A(3) B(3) C(3) D(3) | 6");
        Graph none = new Graph(new int[3][3]);
        check("no edge at all", none.edges() + " | " + none.select(true), "0 | A B C");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS degrees<br>
PASS number of edges<br>
PASS handshake: sum of degrees = 2|E|<br>
PASS isolated vertices<br>
PASS odd-degree vertices (an even number of them)<br>
PASS K4: every degree 3, 4*3/2 edges<br>
PASS no edge at all<br>
ALL TESTS PASSED</div>
<div class="pitfall">Đếm mọi số 1 trong ma trận ra 12 = 2|E| chứ không phải 6. Và danh sách đỉnh bậc lẻ luôn có số phần tử <em>chẵn</em>: nếu chương trình in ra một số lẻ đỉnh bậc lẻ thì ma trận không đối xứng — gõ nhầm dữ liệu hoặc chỉ gán một phía <code>a[u][v] = 1</code>.</div>`),
    bi(`<h3>🧪 Exercise 2 — f2: BFS and DFS over all vertices (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>bfs(k)</code> and <code>dfs(k)</code> returning the visit order as "A B D …": start at vertex k, examine neighbours in increasing index (alphabetical) order, and when nothing more is reachable, restart from the first unvisited vertex (index 0 upwards) until every vertex is visited. It must also work on a directed matrix.</p>
<p class="nhan">Data → expected result</p>
<p>The graph of lesson 5.B (A..H, edges AB AD AE BC BE CF DE EF GH): bfs(A) = A B D E C F G H, dfs(A) = A B C F E D G H; from G: G H A B D E C F and G H A B C F E D.</p>
<p class="nhan">Idea</p>
<p>BFS = queue + <code>enq[]</code>, marked when a vertex is enqueued; DFS = recursion + <code>vis[]</code>, marked when a call enters the vertex; an outer loop over the vertices does the restart. O(n²) on a matrix.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Graph {
    int[][] a;
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    String bfs(int k) {                                   // start at k, then restart from index 0 upwards
        boolean[] enq = new boolean[n];
        StringBuilder s = new StringBuilder();
        for (int t = -1; t &lt; n; t++) {
            int st = (t &lt; 0) ? k : t;
            if (enq[st]) continue;
            ArrayDeque&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();
            q.add(st);
            enq[st] = true;                               // mark when enqueued
            while (!q.isEmpty()) {
                int h = q.poll();
                s.append(v[h]).append(' ');
                for (int i = 0; i &lt; n; i++)
                    if (a[h][i] &gt; 0 &amp;&amp; !enq[i]) { q.add(i); enq[i] = true; }
            }
        }
        return s.toString().trim();
    }

    void dfs(int i, boolean[] vis, StringBuilder s) {
        vis[i] = true;                                    // mark on entry
        s.append(v[i]).append(' ');
        for (int j = 0; j &lt; n; j++)
            if (a[i][j] &gt; 0 &amp;&amp; !vis[j]) dfs(j, vis, s);
    }

    String dfs(int k) {
        boolean[] vis = new boolean[n];                   // n, never a fixed 20
        StringBuilder s = new StringBuilder();
        dfs(k, vis, s);
        for (int i = 0; i &lt; n; i++)
            if (!vis[i]) dfs(i, vis, s);
        return s.toString().trim();
    }
}

public class Pe2Traversal {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {                 // the graph of lesson 5.B: AB AD AE BC BE CF DE EF GH
            {0, 1, 0, 1, 1, 0, 0, 0}, {1, 0, 1, 0, 1, 0, 0, 0}, {0, 1, 0, 0, 0, 1, 0, 0}, {1, 0, 0, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0}, {0, 0, 1, 0, 1, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 1}, {0, 0, 0, 0, 0, 0, 1, 0}});
        check("bfs from A", g.bfs(0), "A B D E C F G H");
        check("dfs from A", g.dfs(0), "A B C F E D G H");
        check("bfs from G, then restart at A", g.bfs(6), "G H A B D E C F");
        check("dfs from G, then restart at A", g.dfs(6), "G H A B C F E D");
        Graph d = new Graph(new int[][] {{0, 1, 0, 0}, {0, 0, 1, 0}, {1, 0, 0, 0}, {1, 0, 0, 0}});   // A-&gt;B-&gt;C-&gt;A, D-&gt;A
        check("digraph: D is reached only by the restart", d.bfs(0), "A B C D");
        check("digraph: dfs from D", d.dfs(3), "D A B C");
        int[][] p = new int[22][22];                      // a path of 22 vertices A-B-...-V
        for (int i = 0; i + 1 &lt; 22; i++) p[i][i + 1] = p[i + 1][i] = 1;
        check("22 vertices (the slide's boolean[20] would crash)", new Graph(p).dfs(0).replace(" ", ""), "ABCDEFGHIJKLMNOPQRSTUV");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS bfs from A<br>
PASS dfs from A<br>
PASS bfs from G, then restart at A<br>
PASS dfs from G, then restart at A<br>
PASS digraph: D is reached only by the restart<br>
PASS digraph: dfs from D<br>
PASS 22 vertices (the slide's boolean[20] would crash)<br>
ALL TESTS PASSED</div>
<div class="pitfall">The last test uses 22 vertices on purpose: <code>new boolean[20]</code> copied from slide 26 crashes there, and <code>breadthFirst(k)</code> copied from slide 23 never restarts, so it would print only one component. Size every array with <code>n</code> and keep the restart loop.</div>`,
    `<h3>🧪 Bài 2 — f2: BFS và DFS qua mọi đỉnh (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>bfs(k)</code> và <code>dfs(k)</code> trả về thứ tự thăm dạng "A B D …": bắt đầu ở đỉnh k, xét láng giềng theo chỉ số tăng dần (thứ tự chữ cái), và khi không còn đi tới được đỉnh nào nữa thì khởi động lại (restart) từ đỉnh chưa thăm đầu tiên (chỉ số 0 trở lên) cho tới khi mọi đỉnh đều được thăm. Hàm phải chạy đúng cả trên ma trận có hướng.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Đồ thị của bài 5.B (A..H, cạnh AB AD AE BC BE CF DE EF GH): bfs(A) = A B D E C F G H, dfs(A) = A B C F E D G H; từ G: G H A B D E C F và G H A B C F E D.</p>
<p class="nhan">Ý tưởng</p>
<p>BFS (duyệt theo chiều rộng) = hàng đợi + <code>enq[]</code>, đánh dấu khi đỉnh vào hàng đợi; DFS (duyệt theo chiều sâu) = đệ quy + <code>vis[]</code>, đánh dấu khi lời gọi bước vào đỉnh; một vòng lặp ngoài qua các đỉnh lo việc khởi động lại. O(n²) trên ma trận.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Graph {
    int[][] a;
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    String bfs(int k) {                                   // bắt đầu ở k, rồi khởi động lại từ chỉ số 0 trở lên
        boolean[] enq = new boolean[n];
        StringBuilder s = new StringBuilder();
        for (int t = -1; t &lt; n; t++) {
            int st = (t &lt; 0) ? k : t;
            if (enq[st]) continue;
            ArrayDeque&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();
            q.add(st);
            enq[st] = true;                               // đánh dấu khi đưa vào hàng đợi
            while (!q.isEmpty()) {
                int h = q.poll();
                s.append(v[h]).append(' ');
                for (int i = 0; i &lt; n; i++)
                    if (a[h][i] &gt; 0 &amp;&amp; !enq[i]) { q.add(i); enq[i] = true; }
            }
        }
        return s.toString().trim();
    }

    void dfs(int i, boolean[] vis, StringBuilder s) {
        vis[i] = true;                                    // đánh dấu khi bước vào
        s.append(v[i]).append(' ');
        for (int j = 0; j &lt; n; j++)
            if (a[i][j] &gt; 0 &amp;&amp; !vis[j]) dfs(j, vis, s);
    }

    String dfs(int k) {
        boolean[] vis = new boolean[n];                   // n, không bao giờ là 20 cố định
        StringBuilder s = new StringBuilder();
        dfs(k, vis, s);
        for (int i = 0; i &lt; n; i++)
            if (!vis[i]) dfs(i, vis, s);
        return s.toString().trim();
    }
}

public class Pe2Traversal {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {                 // đồ thị của bài 5.B
            {0, 1, 0, 1, 1, 0, 0, 0}, {1, 0, 1, 0, 1, 0, 0, 0}, {0, 1, 0, 0, 0, 1, 0, 0}, {1, 0, 0, 0, 1, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0}, {0, 0, 1, 0, 1, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 1}, {0, 0, 0, 0, 0, 0, 1, 0}});
        check("bfs from A", g.bfs(0), "A B D E C F G H");
        check("dfs from A", g.dfs(0), "A B C F E D G H");
        check("bfs from G, then restart at A", g.bfs(6), "G H A B D E C F");
        check("dfs from G, then restart at A", g.dfs(6), "G H A B C F E D");
        Graph d = new Graph(new int[][] {{0, 1, 0, 0}, {0, 0, 1, 0}, {1, 0, 0, 0}, {1, 0, 0, 0}});   // A-&gt;B-&gt;C-&gt;A, D-&gt;A
        check("digraph: D is reached only by the restart", d.bfs(0), "A B C D");
        check("digraph: dfs from D", d.dfs(3), "D A B C");
        int[][] p = new int[22][22];                      // đường thẳng 22 đỉnh A-B-...-V
        for (int i = 0; i + 1 &lt; 22; i++) p[i][i + 1] = p[i + 1][i] = 1;
        check("22 vertices (the slide's boolean[20] would crash)", new Graph(p).dfs(0).replace(" ", ""), "ABCDEFGHIJKLMNOPQRSTUV");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS bfs from A<br>
PASS dfs from A<br>
PASS bfs from G, then restart at A<br>
PASS dfs from G, then restart at A<br>
PASS digraph: D is reached only by the restart<br>
PASS digraph: dfs from D<br>
PASS 22 vertices (the slide's boolean[20] would crash)<br>
ALL TESTS PASSED</div>
<div class="pitfall">Test cuối cố ý dùng 22 đỉnh: <code>new boolean[20]</code> chép từ slide 26 sẽ sập ở đây, còn <code>breadthFirst(k)</code> chép từ slide 23 không khởi động lại nên chỉ in được một thành phần. Cấp mọi mảng theo <code>n</code> và giữ vòng khởi động lại.</div>`),
    bi(`<h3>🧪 Exercise 3 — f3: connected components, cycle test, tree test (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>count()</code> — the number of connected components; <code>list()</code> — the components as "{A,B,C} {D,E} {F}"; <code>hasCycle()</code>; and <code>isTree()</code>.</p>
<p class="nhan">Data → expected result</p>
<p>Lesson 5.B's graph → 2 components {A,B,C,D,E,F} {G,H}, has a cycle, not a tree. Edges AB AC DE with F alone → 3 components, no cycle. Edges AB AC CD CE → a tree. A single vertex → a tree.</p>
<p class="nhan">Idea</p>
<p>One DFS from each still-unlabelled vertex labels its whole component with a new number c. Then compare m with n − c: <strong>m = n − c ⇔ no cycle</strong> (a forest); a tree is connected (c = 1) with m = n − 1. O(n²) on a matrix.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Graph {
    int[][] a;
    int n;
    int[] comp;                                           // component number of each vertex, 1..c
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    void mark(int u, int c) {                             // DFS: give number c to u's whole component
        comp[u] = c;
        for (int w = 0; w &lt; n; w++)
            if (a[u][w] &gt; 0 &amp;&amp; comp[w] == 0) mark(w, c);
    }

    int count() {
        comp = new int[n];
        int c = 0;
        for (int u = 0; u &lt; n; u++)
            if (comp[u] == 0) mark(u, ++c);               // one new DFS = one new component
        return c;
    }

    String list() {
        int c = count();
        String s = "";
        for (int k = 1; k &lt;= c; k++) {
            String part = "";
            for (int u = 0; u &lt; n; u++) if (comp[u] == k) part += (part.isEmpty() ? "" : ",") + v[u];
            s += "{" + part + "} ";
        }
        return s.trim();
    }

    int edges() {
        int m = 0;
        for (int i = 0; i &lt; n; i++)
            for (int j = i + 1; j &lt; n; j++) m += a[i][j];
        return m;
    }

    boolean hasCycle() { return edges() &gt; n - count(); }  // a forest has exactly n - c edges

    boolean isTree() { return count() == 1 &amp;&amp; edges() == n - 1; }
}

public class Pe3Components {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static Graph build(int n, String edges) {             // "AB CD" = edges A-B, C-D
        int[][] b = new int[n][n];
        if (!edges.isEmpty())
            for (String e : edges.split(" ")) b[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = b[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        return new Graph(b);
    }

    public static void main(String[] args) {
        Graph g = build(8, "AB AD AE BC BE CF DE EF GH");   // the graph of lesson 5.B
        check("lesson graph: components", g.count() + " " + g.list(), "2 {A,B,C,D,E,F} {G,H}");
        check("lesson graph: cycle? tree?", g.hasCycle() + " " + g.isTree(), "true false");
        Graph f = build(6, "AB AC DE");
        check("forest: components", f.list(), "{A,B,C} {D,E} {F}");
        check("forest: m = n - c, so no cycle", f.edges() + " " + f.hasCycle(), "3 false");
        Graph t = build(5, "AB AC CD CE");
        check("tree: connected with n - 1 edges", t.count() + " " + t.isTree(), "1 true");
        check("one vertex is a tree", build(1, "").isTree() + "", "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS lesson graph: components<br>
PASS lesson graph: cycle? tree?<br>
PASS forest: components<br>
PASS forest: m = n - c, so no cycle<br>
PASS tree: connected with n - 1 edges<br>
PASS one vertex is a tree<br>
ALL TESTS PASSED</div>
<div class="pitfall">"m = n − 1" alone does not make a tree: a triangle plus one isolated vertex has n = 4 and m = 3, yet it is disconnected and has a cycle. A tree needs both conditions — connected <em>and</em> m = n − 1.</div>`,
    `<h3>🧪 Bài 3 — f3: thành phần liên thông, kiểm chu trình, kiểm cây (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>count()</code> — số thành phần liên thông (connected component); <code>list()</code> — các thành phần dạng "{A,B,C} {D,E} {F}"; <code>hasCycle()</code> — có chu trình không; và <code>isTree()</code> — có phải cây không.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Đồ thị của bài 5.B → 2 thành phần {A,B,C,D,E,F} {G,H}, có chu trình, không phải cây. Các cạnh AB AC DE và F đứng riêng → 3 thành phần, không chu trình. Các cạnh AB AC CD CE → một cây. Một đỉnh duy nhất → một cây.</p>
<p class="nhan">Ý tưởng</p>
<p>Một lần DFS từ mỗi đỉnh chưa được gán nhãn sẽ gán cho cả thành phần của nó một số hiệu mới c. Rồi so m với n − c: <strong>m = n − c ⇔ không có chu trình</strong> (một rừng — forest); cây (tree) là liên thông (c = 1) với m = n − 1. O(n²) trên ma trận.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Graph {
    int[][] a;
    int n;
    int[] comp;                                           // số hiệu thành phần của mỗi đỉnh, 1..c
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    void mark(int u, int c) {                             // DFS: gán số c cho cả thành phần của u
        comp[u] = c;
        for (int w = 0; w &lt; n; w++)
            if (a[u][w] &gt; 0 &amp;&amp; comp[w] == 0) mark(w, c);
    }

    int count() {
        comp = new int[n];
        int c = 0;
        for (int u = 0; u &lt; n; u++)
            if (comp[u] == 0) mark(u, ++c);               // mỗi lần DFS mới = một thành phần mới
        return c;
    }

    String list() {
        int c = count();
        String s = "";
        for (int k = 1; k &lt;= c; k++) {
            String part = "";
            for (int u = 0; u &lt; n; u++) if (comp[u] == k) part += (part.isEmpty() ? "" : ",") + v[u];
            s += "{" + part + "} ";
        }
        return s.trim();
    }

    int edges() {
        int m = 0;
        for (int i = 0; i &lt; n; i++)
            for (int j = i + 1; j &lt; n; j++) m += a[i][j];
        return m;
    }

    boolean hasCycle() { return edges() &gt; n - count(); }  // rừng có đúng n - c cạnh

    boolean isTree() { return count() == 1 &amp;&amp; edges() == n - 1; }
}

public class Pe3Components {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static Graph build(int n, String edges) {             // "AB CD" = các cạnh A-B, C-D
        int[][] b = new int[n][n];
        if (!edges.isEmpty())
            for (String e : edges.split(" ")) b[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = b[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        return new Graph(b);
    }

    public static void main(String[] args) {
        Graph g = build(8, "AB AD AE BC BE CF DE EF GH");   // đồ thị của bài 5.B
        check("lesson graph: components", g.count() + " " + g.list(), "2 {A,B,C,D,E,F} {G,H}");
        check("lesson graph: cycle? tree?", g.hasCycle() + " " + g.isTree(), "true false");
        Graph f = build(6, "AB AC DE");
        check("forest: components", f.list(), "{A,B,C} {D,E} {F}");
        check("forest: m = n - c, so no cycle", f.edges() + " " + f.hasCycle(), "3 false");
        Graph t = build(5, "AB AC CD CE");
        check("tree: connected with n - 1 edges", t.count() + " " + t.isTree(), "1 true");
        check("one vertex is a tree", build(1, "").isTree() + "", "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS lesson graph: components<br>
PASS lesson graph: cycle? tree?<br>
PASS forest: components<br>
PASS forest: m = n - c, so no cycle<br>
PASS tree: connected with n - 1 edges<br>
PASS one vertex is a tree<br>
ALL TESTS PASSED</div>
<div class="pitfall">Chỉ "m = n − 1" thôi chưa đủ là cây: một tam giác cộng một đỉnh cô lập có n = 4 và m = 3, nhưng nó không liên thông và có chu trình. Cây cần cả hai điều kiện — liên thông <em>và</em> m = n − 1.</div>`),
    bi(`<h3>🧪 Exercise 4 — f4: sequential colouring (deck 5B-Graphs2, slides 26–28 · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Colour the vertices in a given order: each vertex receives the smallest colour number 1, 2, 3, … that none of its already-coloured neighbours has. Return the colours and the number of colours used, and check that no edge joins two vertices of the same colour.</p>
<p class="nhan">Data → expected result</p>
<p>The even cycle C6 → 2 colours; the odd cycle C5 → 3; the complete graph K4 → 4 (as slide 26 states: χ(C2n) = 2, χ(C2n+1) = 3, χ(Kn) = n). A bipartite graph with parts {A,C,E} and {B,D,F} (edges AD AF CB CF EB ED): in the order A…F it takes 3 colours, in the order A C E B D F only 2.</p>
<p class="nhan">Idea</p>
<p>For each vertex in the order, mark the colours of its coloured neighbours in a boolean array, then take the first free number. n vertices × one row of n cells = O(n²), the complexity given on slide 27.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Graph {
    int[][] a;
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    int[] color(int[] order) {                            // sequential colouring, vertices taken in this order
        int[] c = new int[n];                             // 0 = not coloured yet; colours are 1, 2, 3...
        for (int u : order) {
            boolean[] used = new boolean[n + 2];
            for (int w = 0; w &lt; n; w++)
                if (a[u][w] &gt; 0 &amp;&amp; c[w] &gt; 0) used[c[w]] = true;   // colours of coloured neighbours
            int k = 1;
            while (used[k]) k++;                          // the smallest colour still free
            c[u] = k;
        }
        return c;
    }

    int[] byIndex() {
        int[] o = new int[n];
        for (int i = 0; i &lt; n; i++) o[i] = i;
        return o;
    }

    String show(int[] c) {
        int max = 0;
        String s = "";
        for (int i = 0; i &lt; n; i++) { s += v[i] + "" + c[i] + " "; max = Math.max(max, c[i]); }
        boolean proper = true;                            // no edge joins two vertices of the same colour
        for (int i = 0; i &lt; n; i++)
            for (int j = 0; j &lt; n; j++) if (a[i][j] &gt; 0 &amp;&amp; c[i] == c[j]) proper = false;
        return s + "| " + max + " colours" + (proper ? "" : " NOT PROPER");
    }
}

public class Pe4Coloring {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static Graph build(int n, String edges) {
        int[][] b = new int[n][n];
        for (String e : edges.split(" ")) b[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = b[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        return new Graph(b);
    }

    public static void main(String[] args) {
        Graph c6 = build(6, "AB BC CD DE EF FA");
        check("even cycle C6: 2 colours", c6.show(c6.color(c6.byIndex())), "A1 B2 C1 D2 E1 F2 | 2 colours");
        Graph c5 = build(5, "AB BC CD DE EA");
        check("odd cycle C5: 3 colours", c5.show(c5.color(c5.byIndex())), "A1 B2 C1 D2 E3 | 3 colours");
        Graph k4 = build(4, "AB AC AD BC BD CD");
        check("complete K4: 4 colours", k4.show(k4.color(k4.byIndex())), "A1 B2 C3 D4 | 4 colours");
        Graph cr = build(6, "AD AF CB CF EB ED");        // bipartite: {A,C,E} vs {B,D,F}
        check("bipartite, order A..F: greedy wastes a colour", cr.show(cr.color(cr.byIndex())), "A1 B1 C2 D2 E3 F3 | 3 colours");
        check("same graph, order A C E B D F", cr.show(cr.color(new int[] {0, 2, 4, 1, 3, 5})), "A1 B2 C1 D2 E1 F2 | 2 colours");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS even cycle C6: 2 colours<br>
PASS odd cycle C5: 3 colours<br>
PASS complete K4: 4 colours<br>
PASS bipartite, order A..F: greedy wastes a colour<br>
PASS same graph, order A C E B D F<br>
ALL TESTS PASSED</div>
<div class="pitfall">Sequential colouring is not optimal: its result depends on the order — the bipartite graph above has χ = 2, yet the order A…F uses 3 colours. Computing χ(G) is NP-complete (slide 26), so a PE asks for the greedy result in a <em>stated</em> order: follow that order exactly, or your colours will not match.</div>`,
    `<h3>🧪 Bài 4 — f4: tô màu tuần tự (bộ 5B-Graphs2, slide 26–28 · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Tô màu các đỉnh theo một thứ tự cho trước: mỗi đỉnh nhận số màu nhỏ nhất 1, 2, 3, … mà chưa láng giềng nào (đã tô) mang. Trả về màu từng đỉnh và số màu đã dùng, rồi kiểm không cạnh nào nối hai đỉnh cùng màu (tô màu hợp lệ — proper colouring).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Chu trình chẵn C6 → 2 màu; chu trình lẻ C5 → 3; đồ thị đầy đủ K4 → 4 (đúng như slide 26: sắc số (chromatic number) χ(C2n) = 2, χ(C2n+1) = 3, χ(Kn) = n). Một đồ thị hai phía (bipartite) với hai nhóm {A,C,E} và {B,D,F} (cạnh AD AF CB CF EB ED): theo thứ tự A…F tốn 3 màu, theo thứ tự A C E B D F chỉ cần 2.</p>
<p class="nhan">Ý tưởng</p>
<p>Với mỗi đỉnh theo thứ tự, đánh dấu màu của các láng giềng đã tô vào một mảng boolean, rồi lấy số đầu tiên còn trống. n đỉnh × một hàng n ô = O(n²), đúng độ phức tạp slide 27 nêu.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Graph {
    int[][] a;
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    int[] color(int[] order) {                            // tô màu tuần tự, lấy đỉnh theo thứ tự này
        int[] c = new int[n];                             // 0 = chưa tô; các màu là 1, 2, 3...
        for (int u : order) {
            boolean[] used = new boolean[n + 2];
            for (int w = 0; w &lt; n; w++)
                if (a[u][w] &gt; 0 &amp;&amp; c[w] &gt; 0) used[c[w]] = true;   // màu của các láng giềng đã tô
            int k = 1;
            while (used[k]) k++;                          // màu nhỏ nhất còn trống
            c[u] = k;
        }
        return c;
    }

    int[] byIndex() {
        int[] o = new int[n];
        for (int i = 0; i &lt; n; i++) o[i] = i;
        return o;
    }

    String show(int[] c) {
        int max = 0;
        String s = "";
        for (int i = 0; i &lt; n; i++) { s += v[i] + "" + c[i] + " "; max = Math.max(max, c[i]); }
        boolean proper = true;                            // không cạnh nào nối hai đỉnh cùng màu
        for (int i = 0; i &lt; n; i++)
            for (int j = 0; j &lt; n; j++) if (a[i][j] &gt; 0 &amp;&amp; c[i] == c[j]) proper = false;
        return s + "| " + max + " colours" + (proper ? "" : " NOT PROPER");
    }
}

public class Pe4Coloring {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static Graph build(int n, String edges) {
        int[][] b = new int[n][n];
        for (String e : edges.split(" ")) b[e.charAt(0) - 'A'][e.charAt(1) - 'A'] = b[e.charAt(1) - 'A'][e.charAt(0) - 'A'] = 1;
        return new Graph(b);
    }

    public static void main(String[] args) {
        Graph c6 = build(6, "AB BC CD DE EF FA");
        check("even cycle C6: 2 colours", c6.show(c6.color(c6.byIndex())), "A1 B2 C1 D2 E1 F2 | 2 colours");
        Graph c5 = build(5, "AB BC CD DE EA");
        check("odd cycle C5: 3 colours", c5.show(c5.color(c5.byIndex())), "A1 B2 C1 D2 E3 | 3 colours");
        Graph k4 = build(4, "AB AC AD BC BD CD");
        check("complete K4: 4 colours", k4.show(k4.color(k4.byIndex())), "A1 B2 C3 D4 | 4 colours");
        Graph cr = build(6, "AD AF CB CF EB ED");        // hai phía: {A,C,E} và {B,D,F}
        check("bipartite, order A..F: greedy wastes a colour", cr.show(cr.color(cr.byIndex())), "A1 B1 C2 D2 E3 F3 | 3 colours");
        check("same graph, order A C E B D F", cr.show(cr.color(new int[] {0, 2, 4, 1, 3, 5})), "A1 B2 C1 D2 E1 F2 | 2 colours");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS even cycle C6: 2 colours<br>
PASS odd cycle C5: 3 colours<br>
PASS complete K4: 4 colours<br>
PASS bipartite, order A..F: greedy wastes a colour<br>
PASS same graph, order A C E B D F<br>
ALL TESTS PASSED</div>
<div class="pitfall">Tô màu tuần tự (sequential colouring) không tối ưu: kết quả phụ thuộc thứ tự — đồ thị hai phía ở trên có χ = 2, vậy mà thứ tự A…F dùng tới 3 màu. Tìm χ(G) là bài toán NP-đầy đủ (NP-complete, slide 26), nên đề PE luôn hỏi kết quả tham lam theo một thứ tự <em>cho sẵn</em>: làm đúng thứ tự đó, nếu không màu sẽ lệch đáp án.</div>`),
    bi(`<h3>🧪 Exercise 5 — f5: Dijkstra, the path and its length (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>The weight matrix uses 99 for "no edge", as on slide 30 of 5A-Graphs1. Write <code>path(s, t)</code> returning the vertices of a shortest path from s to t followed by its length — "A C F E: 20" — or "no path".</p>
<p class="nhan">Data → expected result</p>
<p>Slide 30's matrix plus an isolated vertex G: A→E "A C F E: 20", A→D "A C D: 20", B→F "B C F: 12", E→A "E F C A: 20", A→A "A: 0", A→G "no path".</p>
<p class="nhan">Idea</p>
<p><code>d[]</code> = best known distance, <code>p[]</code> = predecessor, <code>done[]</code> = final. n rounds: take the closest vertex not done — stop if its distance is still ∞ — then relax its edges, skipping 99 cells. Finally walk <code>p[]</code> back from t, adding each vertex in front. O(n²).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Graph {
    static final int NO = 99;                             // "no edge" in the given matrix (as on slide 30)
    static final int INF = Integer.MAX_VALUE / 2;         // distance not known yet: far above any real path
    int[][] a;
    int n;
    int[] d, p;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    void dijkstra(int s) {
        d = new int[n];
        p = new int[n];
        boolean[] done = new boolean[n];
        for (int i = 0; i &lt; n; i++) { d[i] = INF; p[i] = -1; }
        d[s] = 0;
        for (int r = 0; r &lt; n; r++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++)                   // closest vertex not final yet
                if (!done[i] &amp;&amp; (u &lt; 0 || d[i] &lt; d[u])) u = i;
            if (d[u] == INF) break;                       // the rest cannot be reached
            done[u] = true;
            for (int x = 0; x &lt; n; x++)                   // relax u's edges, never through a NO cell
                if (!done[x] &amp;&amp; a[u][x] != NO &amp;&amp; d[u] + a[u][x] &lt; d[x]) { d[x] = d[u] + a[u][x]; p[x] = u; }
        }
    }

    String path(int s, int t) {                           // "A C F E: 20" or "no path"
        dijkstra(s);
        if (d[t] == INF) return "no path";
        String r = "" + v[t];
        for (int y = p[t]; y &gt;= 0; y = p[y]) r = v[y] + " " + r;   // walk back, build the path from the front
        return r + ": " + d[t];
    }
}

public class Pe5Dijkstra {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {                 // slide 30's matrix + an isolated vertex G
            {0, 7, 9, 99, 99, 14, 99}, {7, 0, 10, 15, 99, 99, 99}, {9, 10, 0, 11, 99, 2, 99}, {99, 15, 11, 0, 6, 99, 99},
            {99, 99, 99, 6, 0, 9, 99}, {14, 99, 2, 99, 9, 0, 99}, {99, 99, 99, 99, 99, 99, 0}});
        check("A to E", g.path(0, 4), "A C F E: 20");
        check("A to D", g.path(0, 3), "A C D: 20");
        check("B to F", g.path(1, 5), "B C F: 12");
        check("E to A (another source)", g.path(4, 0), "E F C A: 20");
        check("A to A", g.path(0, 0), "A: 0");
        check("A to G: unreachable", g.path(0, 6), "no path");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS A to E<br>
PASS A to D<br>
PASS B to F<br>
PASS E to A (another source)<br>
PASS A to A<br>
PASS A to G: unreachable<br>
ALL TESTS PASSED</div>
<div class="pitfall">There are two different "infinities". 99 in the matrix only means "no edge"; an unknown distance must start above every real path — here <code>Integer.MAX_VALUE / 2</code>. Using 99 for both silently breaks as soon as a real distance passes 99. And when you walk <code>p[]</code> backwards, add each vertex at the <em>front</em>, or the path prints reversed.</div>`,
    `<h3>🧪 Bài 5 — f5: Dijkstra, in đường đi và độ dài (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Ma trận trọng số (weight matrix) dùng 99 cho "không có cạnh", như slide 30 của 5A-Graphs1. Viết <code>path(s, t)</code> trả về các đỉnh của một đường đi ngắn nhất từ s tới t kèm độ dài — "A C F E: 20" — hoặc "no path" (không có đường).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Ma trận slide 30 thêm một đỉnh cô lập G: A→E "A C F E: 20", A→D "A C D: 20", B→F "B C F: 12", E→A "E F C A: 20", A→A "A: 0", A→G "no path".</p>
<p class="nhan">Ý tưởng</p>
<p><code>d[]</code> = khoảng cách tốt nhất đã biết, <code>p[]</code> = đỉnh đứng trước (predecessor), <code>done[]</code> = đã chốt. n vòng: lấy đỉnh chưa chốt gần nhất — dừng nếu khoảng cách của nó vẫn là ∞ — rồi nới lỏng (relax) các cạnh của nó, bỏ qua ô 99. Cuối cùng lần ngược <code>p[]</code> từ t, mỗi đỉnh gắn vào phía trước. O(n²).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Graph {
    static final int NO = 99;                             // "không có cạnh" trong ma trận đề cho (như slide 30)
    static final int INF = Integer.MAX_VALUE / 2;         // khoảng cách chưa biết: lớn hơn hẳn mọi đường thật
    int[][] a;
    int n;
    int[] d, p;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    void dijkstra(int s) {
        d = new int[n];
        p = new int[n];
        boolean[] done = new boolean[n];
        for (int i = 0; i &lt; n; i++) { d[i] = INF; p[i] = -1; }
        d[s] = 0;
        for (int r = 0; r &lt; n; r++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++)                   // đỉnh chưa chốt gần nhất
                if (!done[i] &amp;&amp; (u &lt; 0 || d[i] &lt; d[u])) u = i;
            if (d[u] == INF) break;                       // phần còn lại không tới được
            done[u] = true;
            for (int x = 0; x &lt; n; x++)                   // nới lỏng cạnh của u, không bao giờ qua ô NO
                if (!done[x] &amp;&amp; a[u][x] != NO &amp;&amp; d[u] + a[u][x] &lt; d[x]) { d[x] = d[u] + a[u][x]; p[x] = u; }
        }
    }

    String path(int s, int t) {                           // "A C F E: 20" hoặc "no path"
        dijkstra(s);
        if (d[t] == INF) return "no path";
        String r = "" + v[t];
        for (int y = p[t]; y &gt;= 0; y = p[y]) r = v[y] + " " + r;   // lần ngược, dựng đường từ phía trước
        return r + ": " + d[t];
    }
}

public class Pe5Dijkstra {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {                 // ma trận slide 30 + đỉnh cô lập G
            {0, 7, 9, 99, 99, 14, 99}, {7, 0, 10, 15, 99, 99, 99}, {9, 10, 0, 11, 99, 2, 99}, {99, 15, 11, 0, 6, 99, 99},
            {99, 99, 99, 6, 0, 9, 99}, {14, 99, 2, 99, 9, 0, 99}, {99, 99, 99, 99, 99, 99, 0}});
        check("A to E", g.path(0, 4), "A C F E: 20");
        check("A to D", g.path(0, 3), "A C D: 20");
        check("B to F", g.path(1, 5), "B C F: 12");
        check("E to A (another source)", g.path(4, 0), "E F C A: 20");
        check("A to A", g.path(0, 0), "A: 0");
        check("A to G: unreachable", g.path(0, 6), "no path");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS A to E<br>
PASS A to D<br>
PASS B to F<br>
PASS E to A (another source)<br>
PASS A to A<br>
PASS A to G: unreachable<br>
ALL TESTS PASSED</div>
<div class="pitfall">Có hai thứ "vô cực" khác nhau. Số 99 trong ma trận chỉ có nghĩa "không có cạnh"; khoảng cách chưa biết phải khởi tạo lớn hơn mọi đường đi thật — ở đây là <code>Integer.MAX_VALUE / 2</code>. Dùng 99 cho cả hai thì sẽ âm thầm sai ngay khi một khoảng cách thật vượt 99. Và khi lần ngược <code>p[]</code>, phải gắn mỗi đỉnh vào <em>phía trước</em>, nếu không đường đi in ra bị ngược.</div>`),
    bi(`<h3>🧪 Exercise 6 — f6: Floyd, every pair, with a negative edge (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>floyd()</code> computing D and P (P[i][j] = k + 1 when the best route i → j stops at vertex k, 0 for a direct edge), <code>path(i, j)</code> returning "A B D C: -1" or "no path", and <code>negativeCycle()</code>.</p>
<p class="nhan">Data → expected result</p>
<p>Lesson 5.B's digraph (A→B 3, A→C 8, B→D 1, C→B 5, D→A 2, D→C −5): A→C "A B D C: -1", C→A "C B D A: 8", D→B "D C B: 0", no negative cycle. Slide 30's graph: A→E "A C F E: 20" — the same as Dijkstra — and B→F "B C F: 12". Only the edge A→B: B→A "no path". A→B 1, B→C −3, C→A 1: a negative cycle.</p>
<p class="nhan">Idea</p>
<p>The triple loop with <strong>k outermost</strong>; skip a pair when D[i][k] or D[k][j] is ∞; on an improvement set P[i][j] = k + 1. Rebuild recursively: path(i, k) + k + path(k, j). Some D[i][i] &lt; 0 ⇔ a negative cycle. O(n³).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Graph {
    static final int INF = 1000000;                       // "no edge / no path"
    int[][] D, P;                                         // P[i][j] = k + 1 (stop at k), 0 = direct edge
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] w) {
        n = w.length;
        D = new int[n][n];
        P = new int[n][n];
        for (int i = 0; i &lt; n; i++) D[i] = w[i].clone();
    }

    void floyd() {
        for (int k = 0; k &lt; n; k++)                       // k is the OUTER loop
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++)
                    if (D[i][k] != INF &amp;&amp; D[k][j] != INF &amp;&amp; D[i][k] + D[k][j] &lt; D[i][j]) {
                        D[i][j] = D[i][k] + D[k][j];
                        P[i][j] = k + 1;
                    }
    }

    String mid(int i, int j) {                            // vertices strictly between i and j
        if (P[i][j] == 0) return "";
        int k = P[i][j] - 1;
        return mid(i, k) + " " + v[k] + mid(k, j);
    }

    String path(int i, int j) {
        return D[i][j] == INF ? "no path" : v[i] + mid(i, j) + " " + v[j] + ": " + D[i][j];
    }

    boolean negativeCycle() {
        for (int i = 0; i &lt; n; i++) if (D[i][i] &lt; 0) return true;
        return false;
    }
}

public class Pe6Floyd {
    static final int X = Graph.INF;
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {{0, 3, 8, X}, {X, 0, X, 1}, {X, 5, 0, X}, {2, X, -5, 0}});   // lesson 5.B, slide 33
        g.floyd();
        check("A to C uses the negative edge", g.path(0, 2), "A B D C: -1");
        check("C to A", g.path(2, 0), "C B D A: 8");
        check("D to B", g.path(3, 1), "D C B: 0");
        check("no negative cycle", "" + g.negativeCycle(), "false");
        Graph s = new Graph(new int[][] {                 // slide 30's graph, 99 replaced by X
            {0, 7, 9, X, X, 14}, {7, 0, 10, 15, X, X}, {9, 10, 0, 11, X, 2}, {X, 15, 11, 0, 6, X}, {X, X, X, 6, 0, 9}, {14, X, 2, X, 9, 0}});
        s.floyd();
        check("slide 30 graph, A to E (same as Dijkstra)", s.path(0, 4), "A C F E: 20");
        check("slide 30 graph, B to F", s.path(1, 5), "B C F: 12");
        Graph one = new Graph(new int[][] {{0, 4}, {X, 0}});
        one.floyd();
        check("B to A with only the edge A-&gt;B", one.path(1, 0), "no path");
        Graph neg = new Graph(new int[][] {{0, 1, X}, {X, 0, -3}, {1, X, 0}});   // A-&gt;B 1, B-&gt;C -3, C-&gt;A 1
        neg.floyd();
        check("cycle A-&gt;B-&gt;C-&gt;A weighs -1", "" + neg.negativeCycle(), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS A to C uses the negative edge<br>
PASS C to A<br>
PASS D to B<br>
PASS no negative cycle<br>
PASS slide 30 graph, A to E (same as Dijkstra)<br>
PASS slide 30 graph, B to F<br>
PASS B to A with only the edge A-&gt;B<br>
PASS cycle A-&gt;B-&gt;C-&gt;A weighs -1<br>
ALL TESTS PASSED</div>
<div class="pitfall">Two traps from lesson 5.B: slide 32's line <code>P[i, j] = P[k, j]</code>, used with P = 0, leaves P all zeros and no path can be rebuilt — write <code>P[i][j] = k + 1</code>. And with a negative edge, forgetting the ∞ test writes "∞ − 5" into D as if it were a real distance.</div>`,
    `<h3>🧪 Bài 6 — f6: Floyd, mọi cặp đỉnh, có cạnh âm (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>floyd()</code> tính D và P (P[i][j] = k + 1 khi lộ trình tốt nhất i → j ghé đỉnh k, 0 nếu là cạnh trực tiếp), <code>path(i, j)</code> trả về "A B D C: -1" hoặc "no path", và <code>negativeCycle()</code> — có chu trình âm (negative cycle) không.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Đồ thị có hướng của bài 5.B (A→B 3, A→C 8, B→D 1, C→B 5, D→A 2, D→C −5): A→C "A B D C: -1", C→A "C B D A: 8", D→B "D C B: 0", không có chu trình âm. Đồ thị slide 30: A→E "A C F E: 20" — trùng kết quả Dijkstra — và B→F "B C F: 12". Chỉ có cạnh A→B: B→A "no path". A→B 1, B→C −3, C→A 1: có chu trình âm.</p>
<p class="nhan">Ý tưởng</p>
<p>Ba vòng lặp với <strong>k ở ngoài cùng</strong>; bỏ qua cặp khi D[i][k] hoặc D[k][j] là ∞; khi cải thiện được thì gán P[i][j] = k + 1. Dựng đường đệ quy: path(i, k) + k + path(k, j). Có D[i][i] &lt; 0 ⇔ có chu trình âm. O(n³).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Graph {
    static final int INF = 1000000;                       // "không có cạnh / không có đường"
    int[][] D, P;                                         // P[i][j] = k + 1 (ghé k), 0 = cạnh trực tiếp
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] w) {
        n = w.length;
        D = new int[n][n];
        P = new int[n][n];
        for (int i = 0; i &lt; n; i++) D[i] = w[i].clone();
    }

    void floyd() {
        for (int k = 0; k &lt; n; k++)                       // k là vòng lặp NGOÀI CÙNG
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++)
                    if (D[i][k] != INF &amp;&amp; D[k][j] != INF &amp;&amp; D[i][k] + D[k][j] &lt; D[i][j]) {
                        D[i][j] = D[i][k] + D[k][j];
                        P[i][j] = k + 1;
                    }
    }

    String mid(int i, int j) {                            // các đỉnh nằm giữa i và j
        if (P[i][j] == 0) return "";
        int k = P[i][j] - 1;
        return mid(i, k) + " " + v[k] + mid(k, j);
    }

    String path(int i, int j) {
        return D[i][j] == INF ? "no path" : v[i] + mid(i, j) + " " + v[j] + ": " + D[i][j];
    }

    boolean negativeCycle() {
        for (int i = 0; i &lt; n; i++) if (D[i][i] &lt; 0) return true;
        return false;
    }
}

public class Pe6Floyd {
    static final int X = Graph.INF;
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {{0, 3, 8, X}, {X, 0, X, 1}, {X, 5, 0, X}, {2, X, -5, 0}});   // lesson 5.B, slide 33
        g.floyd();
        check("A to C uses the negative edge", g.path(0, 2), "A B D C: -1");
        check("C to A", g.path(2, 0), "C B D A: 8");
        check("D to B", g.path(3, 1), "D C B: 0");
        check("no negative cycle", "" + g.negativeCycle(), "false");
        Graph s = new Graph(new int[][] {                 // đồ thị slide 30, thay 99 bằng X
            {0, 7, 9, X, X, 14}, {7, 0, 10, 15, X, X}, {9, 10, 0, 11, X, 2}, {X, 15, 11, 0, 6, X}, {X, X, X, 6, 0, 9}, {14, X, 2, X, 9, 0}});
        s.floyd();
        check("slide 30 graph, A to E (same as Dijkstra)", s.path(0, 4), "A C F E: 20");
        check("slide 30 graph, B to F", s.path(1, 5), "B C F: 12");
        Graph one = new Graph(new int[][] {{0, 4}, {X, 0}});
        one.floyd();
        check("B to A with only the edge A-&gt;B", one.path(1, 0), "no path");
        Graph neg = new Graph(new int[][] {{0, 1, X}, {X, 0, -3}, {1, X, 0}});   // A-&gt;B 1, B-&gt;C -3, C-&gt;A 1
        neg.floyd();
        check("cycle A-&gt;B-&gt;C-&gt;A weighs -1", "" + neg.negativeCycle(), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS A to C uses the negative edge<br>
PASS C to A<br>
PASS D to B<br>
PASS no negative cycle<br>
PASS slide 30 graph, A to E (same as Dijkstra)<br>
PASS slide 30 graph, B to F<br>
PASS B to A with only the edge A-&gt;B<br>
PASS cycle A-&gt;B-&gt;C-&gt;A weighs -1<br>
ALL TESTS PASSED</div>
<div class="pitfall">Hai cái bẫy từ bài 5.B: dòng <code>P[i, j] = P[k, j]</code> của slide 32 dùng với P = 0 làm P toàn 0 mãi và không dựng lại được đường đi — hãy viết <code>P[i][j] = k + 1</code>. Và khi có cạnh âm, quên kiểm ∞ là ghi "∞ − 5" vào D như thể đó là một khoảng cách thật.</div>`),
    bi(`<h3>🧪 Exercise 7 — f7: minimum spanning tree with Prim and Kruskal (deck 5B-Graphs2, slides 7–11 · ~20 min)</h3>
<p class="nhan">Task</p>
<p>The graph is weighted and undirected (0 = no edge). Write <code>prim(s)</code> returning the total weight of a minimum spanning tree grown from s, and <code>kruskal()</code> returning the same total by taking edges in increasing weight; both record the tree edges in the order they are taken, and both return −1 when the graph is not connected.</p>
<p class="nhan">Data → expected result</p>
<p>Edges AB 6, AC 1, AD 5, BC 5, BE 3, CD 5, CE 6, CF 4, DF 2, EF 6 → total 15. Prim from A: A-C(1) C-F(4) F-D(2) C-B(5) B-E(3). Kruskal: A-C(1) D-F(2) B-E(3) C-F(4) B-C(5) — A-D(5) is skipped because A and D are already connected.</p>
<p class="nhan">Idea</p>
<p><strong>Prim</strong> = Dijkstra's loop where key[v] is the cheapest edge from the tree to v — not the distance from s. <strong>Kruskal</strong> = sort the edges; keep one only if its two ends are in different clusters, tracked by a small union–find array <code>root[]</code>. Both are greedy and reach the same total.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Arrays;

class Graph {
    int[][] a;                                            // weights, 0 = no edge (undirected)
    int n;
    String chosen;                                        // the tree edges, in the order they were taken
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    int prim(int s) {                                     // grow ONE tree from s, like Dijkstra
        int inf = Integer.MAX_VALUE, total = 0;
        int[] key = new int[n], from = new int[n];        // key = cheapest edge from the tree to this vertex
        boolean[] in = new boolean[n];
        Arrays.fill(key, inf);
        Arrays.fill(from, -1);
        key[s] = 0;
        chosen = "";
        for (int r = 0; r &lt; n; r++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++) if (!in[i] &amp;&amp; key[i] &lt; inf &amp;&amp; (u &lt; 0 || key[i] &lt; key[u])) u = i;
            if (u &lt; 0) return -1;                         // some vertex cannot be reached: not connected
            in[u] = true;
            total += key[u];
            if (from[u] &gt;= 0) chosen += v[from[u]] + "-" + v[u] + "(" + key[u] + ") ";
            for (int w = 0; w &lt; n; w++)
                if (!in[w] &amp;&amp; a[u][w] &gt; 0 &amp;&amp; a[u][w] &lt; key[w]) { key[w] = a[u][w]; from[w] = u; }
        }
        return total;
    }

    int find(int[] root, int x) { while (root[x] != x) x = root[x]; return x; }

    int kruskal() {                                       // edges by weight; skip any edge that closes a cycle
        int[][] e = new int[n * n][];
        int m = 0, total = 0, taken = 0;
        for (int i = 0; i &lt; n; i++)
            for (int j = i + 1; j &lt; n; j++) if (a[i][j] &gt; 0) e[m++] = new int[] {i, j, a[i][j]};
        e = Arrays.copyOf(e, m);
        Arrays.sort(e, (x, y) -&gt; x[2] - y[2]);            // stable sort by weight
        int[] root = new int[n];
        for (int i = 0; i &lt; n; i++) root[i] = i;          // every vertex is its own cluster
        chosen = "";
        for (int k = 0; k &lt; m &amp;&amp; taken &lt; n - 1; k++) {
            int ru = find(root, e[k][0]), rv = find(root, e[k][1]);
            if (ru == rv) continue;                       // same cluster: this edge would make a cycle
            root[ru] = rv;                                // merge the two clusters
            total += e[k][2];
            taken++;
            chosen += v[e[k][0]] + "-" + v[e[k][1]] + "(" + e[k][2] + ") ";
        }
        return taken == n - 1 ? total : -1;
    }
}

public class Pe7Mst {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {                 // AB 6, AC 1, AD 5, BC 5, BE 3, CD 5, CE 6, CF 4, DF 2, EF 6
            {0, 6, 1, 5, 0, 0}, {6, 0, 5, 0, 3, 0}, {1, 5, 0, 5, 6, 4},
            {5, 0, 5, 0, 0, 2}, {0, 3, 6, 0, 0, 6}, {0, 0, 4, 2, 6, 0}});
        check("Prim from A: total", "" + g.prim(0), "15");
        check("Prim: edges in the order taken", g.chosen.trim(), "A-C(1) C-F(4) F-D(2) C-B(5) B-E(3)");
        check("Kruskal: total", "" + g.kruskal(), "15");
        check("Kruskal: edges in the order taken", g.chosen.trim(), "A-C(1) D-F(2) B-E(3) C-F(4) B-C(5)");
        check("Prim from E: same total", "" + g.prim(4), "15");
        Graph two = new Graph(new int[][] {{0, 1, 0, 0}, {1, 0, 0, 0}, {0, 0, 0, 2}, {0, 0, 2, 0}});
        check("not connected: no spanning tree", two.prim(0) + " " + two.kruskal(), "-1 -1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS Prim from A: total<br>
PASS Prim: edges in the order taken<br>
PASS Kruskal: total<br>
PASS Kruskal: edges in the order taken<br>
PASS Prim from E: same total<br>
PASS not connected: no spanning tree<br>
ALL TESTS PASSED</div>
<div class="pitfall">In Prim write <code>key[w] = a[u][w]</code>, never <code>key[u] + a[u][w]</code> — that is Dijkstra and builds a shortest-path tree, not a minimum spanning tree. In Kruskal an edge whose ends are already in one cluster would close a cycle: skip it, and stop after n − 1 edges.</div>`,
    `<h3>🧪 Bài 7 — f7: cây khung nhỏ nhất bằng Prim và Kruskal (bộ 5B-Graphs2, slide 7–11 · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Đồ thị vô hướng có trọng số (0 = không có cạnh). Viết <code>prim(s)</code> trả về tổng trọng số của một cây khung nhỏ nhất (minimum spanning tree — MST) mọc từ s, và <code>kruskal()</code> trả về cùng tổng đó bằng cách lấy cạnh theo trọng số tăng dần; cả hai ghi lại các cạnh của cây theo thứ tự được chọn, và cả hai trả về −1 khi đồ thị không liên thông.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Các cạnh AB 6, AC 1, AD 5, BC 5, BE 3, CD 5, CE 6, CF 4, DF 2, EF 6 → tổng 15. Prim từ A: A-C(1) C-F(4) F-D(2) C-B(5) B-E(3). Kruskal: A-C(1) D-F(2) B-E(3) C-F(4) B-C(5) — cạnh A-D(5) bị bỏ vì A và D đã nối với nhau rồi.</p>
<p class="nhan">Ý tưởng</p>
<p><strong>Prim</strong> = vòng lặp của Dijkstra, nhưng key[v] là cạnh rẻ nhất nối cây với v — không phải khoảng cách từ s. <strong>Kruskal</strong> = sắp các cạnh; chỉ giữ một cạnh khi hai đầu của nó thuộc hai cụm (cluster) khác nhau, theo dõi bằng một mảng hợp–tìm (union–find) nhỏ <code>root[]</code>. Cả hai đều tham lam (greedy) và cho cùng một tổng.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Arrays;

class Graph {
    int[][] a;                                            // trọng số, 0 = không có cạnh (vô hướng)
    int n;
    String chosen;                                        // các cạnh của cây, theo thứ tự được chọn
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    int prim(int s) {                                     // nuôi MỘT cây từ s, giống Dijkstra
        int inf = Integer.MAX_VALUE, total = 0;
        int[] key = new int[n], from = new int[n];        // key = cạnh rẻ nhất nối cây tới đỉnh này
        boolean[] in = new boolean[n];
        Arrays.fill(key, inf);
        Arrays.fill(from, -1);
        key[s] = 0;
        chosen = "";
        for (int r = 0; r &lt; n; r++) {
            int u = -1;
            for (int i = 0; i &lt; n; i++) if (!in[i] &amp;&amp; key[i] &lt; inf &amp;&amp; (u &lt; 0 || key[i] &lt; key[u])) u = i;
            if (u &lt; 0) return -1;                         // có đỉnh không tới được: không liên thông
            in[u] = true;
            total += key[u];
            if (from[u] &gt;= 0) chosen += v[from[u]] + "-" + v[u] + "(" + key[u] + ") ";
            for (int w = 0; w &lt; n; w++)
                if (!in[w] &amp;&amp; a[u][w] &gt; 0 &amp;&amp; a[u][w] &lt; key[w]) { key[w] = a[u][w]; from[w] = u; }
        }
        return total;
    }

    int find(int[] root, int x) { while (root[x] != x) x = root[x]; return x; }

    int kruskal() {                                       // cạnh theo trọng số; bỏ cạnh nào khép chu trình
        int[][] e = new int[n * n][];
        int m = 0, total = 0, taken = 0;
        for (int i = 0; i &lt; n; i++)
            for (int j = i + 1; j &lt; n; j++) if (a[i][j] &gt; 0) e[m++] = new int[] {i, j, a[i][j]};
        e = Arrays.copyOf(e, m);
        Arrays.sort(e, (x, y) -&gt; x[2] - y[2]);            // sắp ổn định theo trọng số
        int[] root = new int[n];
        for (int i = 0; i &lt; n; i++) root[i] = i;          // mỗi đỉnh là một cụm riêng
        chosen = "";
        for (int k = 0; k &lt; m &amp;&amp; taken &lt; n - 1; k++) {
            int ru = find(root, e[k][0]), rv = find(root, e[k][1]);
            if (ru == rv) continue;                       // cùng cụm: cạnh này tạo chu trình
            root[ru] = rv;                                // gộp hai cụm
            total += e[k][2];
            taken++;
            chosen += v[e[k][0]] + "-" + v[e[k][1]] + "(" + e[k][2] + ") ";
        }
        return taken == n - 1 ? total : -1;
    }
}

public class Pe7Mst {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Graph g = new Graph(new int[][] {                 // AB 6, AC 1, AD 5, BC 5, BE 3, CD 5, CE 6, CF 4, DF 2, EF 6
            {0, 6, 1, 5, 0, 0}, {6, 0, 5, 0, 3, 0}, {1, 5, 0, 5, 6, 4},
            {5, 0, 5, 0, 0, 2}, {0, 3, 6, 0, 0, 6}, {0, 0, 4, 2, 6, 0}});
        check("Prim from A: total", "" + g.prim(0), "15");
        check("Prim: edges in the order taken", g.chosen.trim(), "A-C(1) C-F(4) F-D(2) C-B(5) B-E(3)");
        check("Kruskal: total", "" + g.kruskal(), "15");
        check("Kruskal: edges in the order taken", g.chosen.trim(), "A-C(1) D-F(2) B-E(3) C-F(4) B-C(5)");
        check("Prim from E: same total", "" + g.prim(4), "15");
        Graph two = new Graph(new int[][] {{0, 1, 0, 0}, {1, 0, 0, 0}, {0, 0, 0, 2}, {0, 0, 2, 0}});
        check("not connected: no spanning tree", two.prim(0) + " " + two.kruskal(), "-1 -1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS Prim from A: total<br>
PASS Prim: edges in the order taken<br>
PASS Kruskal: total<br>
PASS Kruskal: edges in the order taken<br>
PASS Prim from E: same total<br>
PASS not connected: no spanning tree<br>
ALL TESTS PASSED</div>
<div class="pitfall">Trong Prim phải viết <code>key[w] = a[u][w]</code>, không bao giờ <code>key[u] + a[u][w]</code> — đó là Dijkstra và cho cây đường đi ngắn nhất, không phải cây khung nhỏ nhất. Trong Kruskal, cạnh có hai đầu đã cùng một cụm sẽ khép một chu trình: bỏ qua nó, và dừng khi đủ n − 1 cạnh.</div>`),
    bi(`<h3>🧪 Exercise 8 — f1…f4 on one graph: Euler cycles (PE-like combination · ~25 min)</h3>
<p class="nhan">Task</p>
<p>The graph may have parallel edges, so <code>a[i][j]</code> counts the edges between i and j. f1 <code>odd()</code> — the odd-degree vertices; f2 <code>connected()</code> — are all non-isolated vertices in one piece? (DFS); f3 <code>kind()</code> — "Euler cycle", "Euler path, no Euler cycle", "no Euler cycle, no Euler path", or "not connected…"; f4 <code>cycle(x)</code> — the stack algorithm of 5B-Graphs2 slide 21 from vertex x, always taking the first neighbour in alphabetical order.</p>
<p class="nhan">Data → expected result</p>
<ul>
<li>The graph of 5B-Graphs2 slides 19–20 (vertices 1…8 renamed A…H; edges 12, 23, 31, 34, 46, 65, 53, 67, 78, 86): all degrees even → Euler cycle; cycle(A) = A C E F H G F D C B A.</li>
<li>Königsberg (A = the island, with 5 bridges; B, C, D = the other land areas, 3 bridges each): four odd vertices → neither.</li>
<li>The "house" (a square with both diagonals and a roof): exactly A and B odd → Euler path only.</li>
<li>Two separate triangles: every degree even, but not connected → neither.</li>
</ul>
<p class="nhan">Idea</p>
<p>Theorem 1: a connected multigraph has an Euler cycle ⇔ every degree is even. Theorem 2: an Euler path but no Euler cycle ⇔ exactly two odd vertices. The stack algorithm looks at the top ch: no edge left → pop it into E; otherwise push its first neighbour y and delete the edge ch–y. Each step scans one row: O(n·m) on a matrix.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Graph {
    int[][] a;                                            // a[i][j] = number of edges i-j (a multigraph is allowed)
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    int deg(int i) { int d = 0; for (int j = 0; j &lt; n; j++) d += a[i][j]; return d; }

    String odd() {                                        // f1: vertices of odd degree
        String s = "";
        for (int i = 0; i &lt; n; i++) if (deg(i) % 2 == 1) s += v[i] + " ";
        return s.trim();
    }

    void dfs(int u, boolean[] vis) {
        vis[u] = true;
        for (int w = 0; w &lt; n; w++) if (a[u][w] &gt; 0 &amp;&amp; !vis[w]) dfs(w, vis);
    }

    boolean connected() {                                 // f2: all non-isolated vertices in one piece
        boolean[] vis = new boolean[n];
        int s = 0;
        while (s &lt; n &amp;&amp; deg(s) == 0) s++;
        if (s == n) return true;
        dfs(s, vis);
        for (int i = 0; i &lt; n; i++) if (deg(i) &gt; 0 &amp;&amp; !vis[i]) return false;
        return true;
    }

    String kind() {                                       // f3: theorems 1 and 2 of 5B-Graphs2
        int k = odd().isEmpty() ? 0 : odd().split(" ").length;
        if (!connected()) return "not connected: no Euler cycle, no Euler path";
        return k == 0 ? "Euler cycle" : k == 2 ? "Euler path, no Euler cycle" : "no Euler cycle, no Euler path";
    }

    String cycle(int x) {                                 // f4: the stack algorithm of 5B-Graphs2 slide 21
        int[][] g = new int[n][];
        for (int i = 0; i &lt; n; i++) g[i] = a[i].clone();  // work on a copy: edges get removed
        ArrayDeque&lt;Integer&gt; st = new ArrayDeque&lt;Integer&gt;();
        StringBuilder e = new StringBuilder();
        st.push(x);
        while (!st.isEmpty()) {
            int ch = st.peek(), y = 0;
            while (y &lt; n &amp;&amp; g[ch][y] == 0) y++;           // first neighbour in alphabetical order
            if (y == n) { st.pop(); e.append(v[ch]).append(' '); }   // ch is isolated: move it to E
            else { st.push(y); g[ch][y]--; g[y][ch]--; }             // push y, remove the edge ch-y
        }
        return e.toString().trim();
    }
}

public class Pe8Euler {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static Graph build(int n, String edges) {             // "AB AB" = two parallel edges A-B
        int[][] b = new int[n][n];
        for (String e : edges.split(" ")) { b[e.charAt(0) - 'A'][e.charAt(1) - 'A']++; b[e.charAt(1) - 'A'][e.charAt(0) - 'A']++; }
        return new Graph(b);
    }

    public static void main(String[] args) {
        Graph g = build(8, "AB BC CA CD DF FE EC FG GH HF");   // 5B-Graphs2 slides 19-20, vertices 1..8 = A..H
        check("slides 19-20 graph: all degrees even", g.odd().isEmpty() + " " + g.kind(), "true Euler cycle");
        check("stack algorithm from A", g.cycle(0), "A C E F H G F D C B A");
        Graph k = build(4, "AB AB AC AC AD BD CD");       // Koenigsberg: 4 land areas, 7 bridges
        check("Koenigsberg: four odd vertices", k.odd() + " | " + k.kind(), "A B C D | no Euler cycle, no Euler path");
        Graph h = build(5, "AB BC CD DA AC BD DE EC");    // the house: a square with both diagonals and a roof
        check("house: exactly two odd vertices", h.odd() + " | " + h.kind(), "A B | Euler path, no Euler cycle");
        Graph t = build(6, "AB BC CA DE EF FD");          // two separate triangles
        check("all even but not connected", t.kind(), "not connected: no Euler cycle, no Euler path");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slides 19-20 graph: all degrees even<br>
PASS stack algorithm from A<br>
PASS Koenigsberg: four odd vertices<br>
PASS house: exactly two odd vertices<br>
PASS all even but not connected<br>
ALL TESTS PASSED</div>
<p>Read E backwards: A B C D F G H F E C A = 1 2 3 4 6 7 8 6 5 3 1 — exactly the Euler cycle that slide 20 obtains by splicing subcycles. Both methods build the same cycle here; the stack version just records it from the end.</p>
<div class="pitfall">Run the algorithm on a <em>copy</em> of the matrix (it deletes edges), and delete both <code>g[ch][y]</code> and <code>g[y][ch]</code>. Do not forget the connectivity condition: the two triangles have only even degrees and still no Euler cycle.</div>`,
    `<h3>🧪 Bài 8 — f1…f4 trên một đồ thị: chu trình Euler (tổ hợp gần đề PE · ~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Đồ thị có thể có cạnh song song (parallel edges), nên <code>a[i][j]</code> đếm số cạnh giữa i và j. f1 <code>odd()</code> — các đỉnh bậc lẻ; f2 <code>connected()</code> — mọi đỉnh không cô lập có nằm chung một mảng liên thông không? (DFS); f3 <code>kind()</code> — "Euler cycle" (có chu trình Euler), "Euler path, no Euler cycle" (có đường đi Euler, không có chu trình), "no Euler cycle, no Euler path" (không có cả hai), hoặc "not connected…"; f4 <code>cycle(x)</code> — thuật toán ngăn xếp (stack) ở slide 21 bộ 5B-Graphs2, xuất phát từ đỉnh x, luôn chọn láng giềng đầu tiên theo thứ tự chữ cái.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<ul>
<li>Đồ thị ở slide 19–20 bộ 5B-Graphs2 (đỉnh 1…8 đổi tên thành A…H; cạnh 12, 23, 31, 34, 46, 65, 53, 67, 78, 86): mọi bậc đều chẵn → có chu trình Euler; cycle(A) = A C E F H G F D C B A.</li>
<li>Königsberg (A = hòn đảo, có 5 cây cầu; B, C, D = ba vùng đất còn lại, mỗi vùng 3 cầu): bốn đỉnh bậc lẻ → không có cả hai.</li>
<li>"Ngôi nhà" (hình vuông có hai đường chéo và cái mái): đúng hai đỉnh A và B bậc lẻ → chỉ có đường đi Euler.</li>
<li>Hai tam giác rời nhau: mọi bậc đều chẵn nhưng không liên thông → không có cả hai.</li>
</ul>
<p class="nhan">Ý tưởng</p>
<p>Định lý 1: đa đồ thị (multigraph) liên thông có chu trình Euler ⇔ mọi đỉnh đều bậc chẵn. Định lý 2: có đường đi Euler nhưng không có chu trình Euler ⇔ có đúng hai đỉnh bậc lẻ. Thuật toán ngăn xếp nhìn đỉnh trên cùng ch: hết cạnh → lấy ra, cho vào E; còn cạnh → đẩy láng giềng đầu tiên y vào và xoá cạnh ch–y. Mỗi bước quét một hàng: O(n·m) trên ma trận.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;

class Graph {
    int[][] a;                                            // a[i][j] = số cạnh i-j (cho phép đa đồ thị)
    int n;
    char[] v = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    Graph(int[][] b) { a = b; n = b.length; }

    int deg(int i) { int d = 0; for (int j = 0; j &lt; n; j++) d += a[i][j]; return d; }

    String odd() {                                        // f1: các đỉnh bậc lẻ
        String s = "";
        for (int i = 0; i &lt; n; i++) if (deg(i) % 2 == 1) s += v[i] + " ";
        return s.trim();
    }

    void dfs(int u, boolean[] vis) {
        vis[u] = true;
        for (int w = 0; w &lt; n; w++) if (a[u][w] &gt; 0 &amp;&amp; !vis[w]) dfs(w, vis);
    }

    boolean connected() {                                 // f2: mọi đỉnh không cô lập nằm trong một mảnh
        boolean[] vis = new boolean[n];
        int s = 0;
        while (s &lt; n &amp;&amp; deg(s) == 0) s++;
        if (s == n) return true;
        dfs(s, vis);
        for (int i = 0; i &lt; n; i++) if (deg(i) &gt; 0 &amp;&amp; !vis[i]) return false;
        return true;
    }

    String kind() {                                       // f3: định lý 1 và 2 của 5B-Graphs2
        int k = odd().isEmpty() ? 0 : odd().split(" ").length;
        if (!connected()) return "not connected: no Euler cycle, no Euler path";
        return k == 0 ? "Euler cycle" : k == 2 ? "Euler path, no Euler cycle" : "no Euler cycle, no Euler path";
    }

    String cycle(int x) {                                 // f4: thuật toán ngăn xếp ở slide 21 bộ 5B-Graphs2
        int[][] g = new int[n][];
        for (int i = 0; i &lt; n; i++) g[i] = a[i].clone();  // làm trên bản sao: cạnh sẽ bị xoá
        ArrayDeque&lt;Integer&gt; st = new ArrayDeque&lt;Integer&gt;();
        StringBuilder e = new StringBuilder();
        st.push(x);
        while (!st.isEmpty()) {
            int ch = st.peek(), y = 0;
            while (y &lt; n &amp;&amp; g[ch][y] == 0) y++;           // láng giềng đầu tiên theo thứ tự chữ cái
            if (y == n) { st.pop(); e.append(v[ch]).append(' '); }   // ch đã cô lập: chuyển sang E
            else { st.push(y); g[ch][y]--; g[y][ch]--; }             // đẩy y, xoá cạnh ch-y
        }
        return e.toString().trim();
    }
}

public class Pe8Euler {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static Graph build(int n, String edges) {             // "AB AB" = hai cạnh song song A-B
        int[][] b = new int[n][n];
        for (String e : edges.split(" ")) { b[e.charAt(0) - 'A'][e.charAt(1) - 'A']++; b[e.charAt(1) - 'A'][e.charAt(0) - 'A']++; }
        return new Graph(b);
    }

    public static void main(String[] args) {
        Graph g = build(8, "AB BC CA CD DF FE EC FG GH HF");   // 5B-Graphs2 slides 19-20, vertices 1..8 = A..H
        check("slides 19-20 graph: all degrees even", g.odd().isEmpty() + " " + g.kind(), "true Euler cycle");
        check("stack algorithm from A", g.cycle(0), "A C E F H G F D C B A");
        Graph k = build(4, "AB AB AC AC AD BD CD");       // Königsberg: 4 vùng đất, 7 cây cầu
        check("Koenigsberg: four odd vertices", k.odd() + " | " + k.kind(), "A B C D | no Euler cycle, no Euler path");
        Graph h = build(5, "AB BC CD DA AC BD DE EC");    // ngôi nhà: hình vuông, hai đường chéo và mái
        check("house: exactly two odd vertices", h.odd() + " | " + h.kind(), "A B | Euler path, no Euler cycle");
        Graph t = build(6, "AB BC CA DE EF FD");          // hai tam giác rời nhau
        check("all even but not connected", t.kind(), "not connected: no Euler cycle, no Euler path");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slides 19-20 graph: all degrees even<br>
PASS stack algorithm from A<br>
PASS Koenigsberg: four odd vertices<br>
PASS house: exactly two odd vertices<br>
PASS all even but not connected<br>
ALL TESTS PASSED</div>
<p>Đọc E từ cuối về đầu: A B C D F G H F E C A = 1 2 3 4 6 7 8 6 5 3 1 — đúng chu trình Euler mà slide 20 thu được bằng cách ghép (splice) các chu trình con. Ở đây hai cách cho cùng một chu trình; bản dùng ngăn xếp chỉ ghi nó từ cuối lên.</p>
<div class="pitfall">Chạy thuật toán trên <em>bản sao</em> của ma trận (vì nó xoá cạnh), và xoá cả <code>g[ch][y]</code> lẫn <code>g[y][ch]</code>. Đừng quên điều kiện liên thông: hai tam giác rời nhau chỉ có bậc chẵn mà vẫn không có chu trình Euler.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>graph G = (V, E)</strong></td><td>đồ thị</td><td>A set of vertices V together with a collection E of edges, each joining a pair of vertices.</td></tr>
<tr><td><strong>vertex / edge</strong></td><td>đỉnh / cạnh</td><td>A vertex is one object; an edge is one connection between two objects.</td></tr>
<tr><td><strong>directed graph (digraph)</strong></td><td>đồ thị có hướng</td><td>A graph whose edges are ordered pairs (u, v), drawn as arrows.</td></tr>
<tr><td><strong>adjacent / incident</strong></td><td>kề / liên thuộc</td><td>Two vertices joined by an edge are adjacent; an edge is incident to each of its endpoints.</td></tr>
<tr><td><strong>degree, in-degree, out-degree</strong></td><td>bậc, bậc vào, bậc ra</td><td>The number of edges touching a vertex; in a digraph, the numbers of edges coming in and going out.</td></tr>
<tr><td><strong>handshake theorem</strong></td><td>định lý bắt tay</td><td>The degrees add up to twice the number of edges, because every edge has two ends.</td></tr>
<tr><td><strong>isolated vertex</strong></td><td>đỉnh cô lập</td><td>A vertex of degree 0.</td></tr>
<tr><td><strong>simple graph / multigraph / pseudograph</strong></td><td>đơn đồ thị / đa đồ thị / giả đồ thị</td><td>No loops and no parallel edges / parallel edges allowed / loops allowed as well.</td></tr>
<tr><td><strong>parallel edges / self-loop</strong></td><td>cạnh song song / khuyên</td><td>Two edges with the same ends; an edge from a vertex to itself.</td></tr>
<tr><td><strong>path / cycle</strong></td><td>đường đi / chu trình</td><td>A walk along edges; a walk that comes back to where it started.</td></tr>
<tr><td><strong>connected / strongly connected</strong></td><td>liên thông / liên thông mạnh</td><td>A path joins every pair of vertices; in a digraph, directed paths exist in both directions.</td></tr>
<tr><td><strong>connected component</strong></td><td>thành phần liên thông</td><td>A maximal connected piece of a graph.</td></tr>
<tr><td><strong>tree / forest / spanning tree</strong></td><td>cây / rừng / cây khung</td><td>A connected graph without cycles / a graph without cycles / a tree that contains every vertex of the graph.</td></tr>
<tr><td><strong>articulation point / bridge</strong></td><td>đỉnh khớp / cầu</td><td>A vertex / an edge whose removal disconnects the graph.</td></tr>
<tr><td><strong>complete graph Kn</strong></td><td>đồ thị đầy đủ</td><td>Every pair of its n vertices is joined, which gives n(n − 1)/2 edges.</td></tr>
<tr><td><strong>adjacency matrix</strong></td><td>ma trận kề</td><td>An n × n table whose cell (i, j) holds 1 or the weight when i and j are joined.</td></tr>
<tr><td><strong>adjacency list</strong></td><td>danh sách kề</td><td>For every vertex, the list of its neighbours; memory O(n + m).</td></tr>
<tr><td><strong>incidence matrix</strong></td><td>ma trận liên thuộc</td><td>An n × m table, vertices by edges, with 1 where a vertex is an end of an edge.</td></tr>
<tr><td><strong>breadth-first search (BFS)</strong></td><td>duyệt theo chiều rộng</td><td>Visit vertices level by level with a queue; it finds paths with the fewest edges.</td></tr>
<tr><td><strong>depth-first search (DFS)</strong></td><td>duyệt theo chiều sâu</td><td>Follow one route as deep as possible with recursion (a stack), then back up.</td></tr>
<tr><td><strong>weighted graph / weight</strong></td><td>đồ thị có trọng số / trọng số</td><td>Each edge carries a cost; the length of a path is the sum of its weights.</td></tr>
<tr><td><strong>relax an edge</strong></td><td>nới lỏng một cạnh</td><td>Replace d[v] by d[u] + w(u, v) when that is smaller, and remember u as the predecessor of v.</td></tr>
<tr><td><strong>Dijkstra's algorithm</strong></td><td>thuật toán Dijkstra</td><td>Shortest paths from one source when every weight is at least 0, by repeatedly finalising the closest vertex.</td></tr>
<tr><td><strong>Floyd's algorithm</strong></td><td>thuật toán Floyd</td><td>Shortest paths between every pair, O(n³), allowing negative edges but no negative cycle.</td></tr>
<tr><td><strong>negative cycle</strong></td><td>chu trình âm</td><td>A cycle whose weights add up to less than 0, so going round it shortens a path forever.</td></tr>
<tr><td><strong>greedy method</strong></td><td>phương pháp tham lam</td><td>Build the answer step by step, always taking the choice that looks best now and never undoing it.</td></tr>
<tr><td><strong>minimum spanning tree (MST)</strong></td><td>cây khung nhỏ nhất</td><td>A spanning tree whose total edge weight is as small as possible.</td></tr>
<tr><td><strong>Prim–Jarník / Kruskal</strong></td><td>thuật toán Prim / Kruskal</td><td>Prim grows one tree from a start vertex; Kruskal adds the cheapest edges that do not close a cycle.</td></tr>
<tr><td><strong>union–find</strong></td><td>hợp–tìm (tập rời nhau)</td><td>A structure that tells whether two vertices are already in the same cluster and merges clusters.</td></tr>
<tr><td><strong>Euler path / Euler cycle</strong></td><td>đường đi Euler / chu trình Euler</td><td>A path / a cycle that uses every edge exactly once.</td></tr>
<tr><td><strong>Hamilton path / Hamilton cycle</strong></td><td>đường đi Hamilton / chu trình Hamilton</td><td>A path / a cycle that visits every vertex exactly once.</td></tr>
<tr><td><strong>backtracking</strong></td><td>quay lui</td><td>Try a choice, go on, and undo it when it leads to a dead end — used to search for Hamilton cycles.</td></tr>
<tr><td><strong>graph colouring / chromatic number χ(G)</strong></td><td>tô màu đồ thị / sắc số</td><td>Colour the vertices so that adjacent vertices differ; χ(G) is the fewest colours that suffice.</td></tr>
<tr><td><strong>sequential colouring</strong></td><td>tô màu tuần tự</td><td>Take the vertices in a fixed order and give each the smallest colour not used by its neighbours.</td></tr>
<tr><td><strong>bipartite graph</strong></td><td>đồ thị hai phía</td><td>The vertices split into two groups and every edge goes between the groups, so two colours suffice.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>graph G = (V, E)</strong></td><td>đồ thị</td><td>Một tập đỉnh V cùng một tập cạnh E, mỗi cạnh nối một cặp đỉnh.</td></tr>
<tr><td><strong>vertex / edge</strong></td><td>đỉnh / cạnh</td><td>Đỉnh là một đối tượng; cạnh là một mối nối giữa hai đối tượng.</td></tr>
<tr><td><strong>directed graph (digraph)</strong></td><td>đồ thị có hướng</td><td>Đồ thị có các cạnh là cặp có thứ tự (u, v), vẽ bằng mũi tên.</td></tr>
<tr><td><strong>adjacent / incident</strong></td><td>kề / liên thuộc</td><td>Hai đỉnh được nối bằng một cạnh thì kề nhau; một cạnh liên thuộc với mỗi đầu mút của nó.</td></tr>
<tr><td><strong>degree, in-degree, out-degree</strong></td><td>bậc, bậc vào, bậc ra</td><td>Số cạnh chạm vào một đỉnh; trong đồ thị có hướng là số cạnh đi vào và số cạnh đi ra.</td></tr>
<tr><td><strong>handshake theorem</strong></td><td>định lý bắt tay</td><td>Tổng các bậc bằng hai lần số cạnh, vì mỗi cạnh có hai đầu.</td></tr>
<tr><td><strong>isolated vertex</strong></td><td>đỉnh cô lập</td><td>Đỉnh có bậc bằng 0.</td></tr>
<tr><td><strong>simple graph / multigraph / pseudograph</strong></td><td>đơn đồ thị / đa đồ thị / giả đồ thị</td><td>Không khuyên, không cạnh song song / cho phép cạnh song song / cho phép cả khuyên.</td></tr>
<tr><td><strong>parallel edges / self-loop</strong></td><td>cạnh song song / khuyên</td><td>Hai cạnh có cùng hai đầu; một cạnh đi từ một đỉnh về chính nó.</td></tr>
<tr><td><strong>path / cycle</strong></td><td>đường đi / chu trình</td><td>Một lối đi dọc các cạnh; một lối đi quay về chỗ xuất phát.</td></tr>
<tr><td><strong>connected / strongly connected</strong></td><td>liên thông / liên thông mạnh</td><td>Mọi cặp đỉnh đều có đường nối; trong đồ thị có hướng thì có đường đi có hướng theo cả hai chiều.</td></tr>
<tr><td><strong>connected component</strong></td><td>thành phần liên thông</td><td>Một mảnh liên thông tối đại của đồ thị.</td></tr>
<tr><td><strong>tree / forest / spanning tree</strong></td><td>cây / rừng / cây khung</td><td>Đồ thị liên thông không chu trình / đồ thị không chu trình / cây chứa mọi đỉnh của đồ thị.</td></tr>
<tr><td><strong>articulation point / bridge</strong></td><td>đỉnh khớp / cầu</td><td>Một đỉnh / một cạnh mà xoá đi thì đồ thị mất liên thông.</td></tr>
<tr><td><strong>complete graph Kn</strong></td><td>đồ thị đầy đủ</td><td>Mọi cặp trong n đỉnh đều được nối, tổng cộng n(n − 1)/2 cạnh.</td></tr>
<tr><td><strong>adjacency matrix</strong></td><td>ma trận kề</td><td>Bảng n × n có ô (i, j) chứa 1 hoặc trọng số khi i và j được nối.</td></tr>
<tr><td><strong>adjacency list</strong></td><td>danh sách kề</td><td>Mỗi đỉnh giữ danh sách các láng giềng của nó; bộ nhớ O(n + m).</td></tr>
<tr><td><strong>incidence matrix</strong></td><td>ma trận liên thuộc</td><td>Bảng n × m, đỉnh theo cạnh, ghi 1 ở ô mà đỉnh là một đầu của cạnh.</td></tr>
<tr><td><strong>breadth-first search (BFS)</strong></td><td>duyệt theo chiều rộng</td><td>Thăm các đỉnh theo từng tầng bằng hàng đợi; nó tìm ra đường đi ít cạnh nhất.</td></tr>
<tr><td><strong>depth-first search (DFS)</strong></td><td>duyệt theo chiều sâu</td><td>Đi theo một lối càng sâu càng tốt bằng đệ quy (một ngăn xếp), rồi mới lùi lại.</td></tr>
<tr><td><strong>weighted graph / weight</strong></td><td>đồ thị có trọng số / trọng số</td><td>Mỗi cạnh mang một chi phí; độ dài đường đi là tổng các trọng số.</td></tr>
<tr><td><strong>relax an edge</strong></td><td>nới lỏng một cạnh</td><td>Thay d[v] bằng d[u] + w(u, v) khi tổng đó nhỏ hơn, và nhớ u là đỉnh đứng trước v.</td></tr>
<tr><td><strong>Dijkstra's algorithm</strong></td><td>thuật toán Dijkstra</td><td>Đường đi ngắn nhất từ một nguồn khi mọi trọng số không âm, bằng cách lần lượt chốt đỉnh gần nhất.</td></tr>
<tr><td><strong>Floyd's algorithm</strong></td><td>thuật toán Floyd</td><td>Đường đi ngắn nhất giữa mọi cặp đỉnh, O(n³), cho phép cạnh âm nhưng cấm chu trình âm.</td></tr>
<tr><td><strong>negative cycle</strong></td><td>chu trình âm</td><td>Chu trình có tổng trọng số nhỏ hơn 0, nên đi vòng quanh nó làm đường đi ngắn mãi không dừng.</td></tr>
<tr><td><strong>greedy method</strong></td><td>phương pháp tham lam</td><td>Dựng lời giải từng bước, luôn chọn cái trông tốt nhất lúc này và không bao giờ quay lại sửa.</td></tr>
<tr><td><strong>minimum spanning tree (MST)</strong></td><td>cây khung nhỏ nhất</td><td>Cây khung có tổng trọng số các cạnh nhỏ nhất có thể.</td></tr>
<tr><td><strong>Prim–Jarník / Kruskal</strong></td><td>thuật toán Prim / Kruskal</td><td>Prim nuôi một cây từ một đỉnh xuất phát; Kruskal thêm các cạnh rẻ nhất mà không khép chu trình.</td></tr>
<tr><td><strong>union–find</strong></td><td>hợp–tìm (tập rời nhau)</td><td>Cấu trúc cho biết hai đỉnh đã cùng một cụm chưa và gộp các cụm lại.</td></tr>
<tr><td><strong>Euler path / Euler cycle</strong></td><td>đường đi Euler / chu trình Euler</td><td>Đường đi / chu trình đi qua mỗi cạnh đúng một lần.</td></tr>
<tr><td><strong>Hamilton path / Hamilton cycle</strong></td><td>đường đi Hamilton / chu trình Hamilton</td><td>Đường đi / chu trình ghé mỗi đỉnh đúng một lần.</td></tr>
<tr><td><strong>backtracking</strong></td><td>quay lui</td><td>Thử một lựa chọn, đi tiếp, và gỡ bỏ nó khi dẫn vào ngõ cụt — dùng để tìm chu trình Hamilton.</td></tr>
<tr><td><strong>graph colouring / chromatic number χ(G)</strong></td><td>tô màu đồ thị / sắc số</td><td>Tô màu các đỉnh sao cho hai đỉnh kề nhau khác màu; χ(G) là số màu ít nhất đủ dùng.</td></tr>
<tr><td><strong>sequential colouring</strong></td><td>tô màu tuần tự</td><td>Lấy các đỉnh theo một thứ tự cố định và cho mỗi đỉnh màu nhỏ nhất mà láng giềng chưa dùng.</td></tr>
<tr><td><strong>bipartite graph</strong></td><td>đồ thị hai phía</td><td>Các đỉnh chia thành hai nhóm và mọi cạnh đều nối hai nhóm, nên hai màu là đủ.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 5</h2>
<ol>
<li><strong>Vocabulary</strong>: G = (V, E); directed or undirected; Σ deg = 2m; Kn has n(n − 1)/2 edges; a tree on n vertices has n − 1 edges; articulation point = a vertex, bridge = an edge.</li>
<li><strong>Storage</strong>: adjacency matrix (O(n²) memory, O(1) edge test — the usual PE format) or adjacency list (O(n + m), for sparse graphs). Before testing <code>a[i][j] &gt; 0</code>, know what "no edge" looks like: 0, 99 or ∞.</li>
<li><strong>BFS</strong> = queue, mark when enqueued, fewest edges; <strong>DFS</strong> = recursion, mark on entry. Both need a restart loop to reach every component; O(n + m) with lists, O(n²) with a matrix.</li>
<li><strong>Connectivity</strong>: one DFS per component; a graph with c components has no cycle ⇔ m = n − c; articulation points and bridges: remove one, check with a DFS.</li>
<li><strong>Dijkstra</strong>: one source, weights ≥ 0, greedy "take the closest, relax its edges", keep predecessors for the path; O(n²) with a matrix. Negative weights break it.</li>
<li><strong>Floyd</strong>: every pair in O(n³); k is the outer loop; negative edges allowed, negative cycles detected by D[i][i] &lt; 0; with P = 0 the update is P[i][j] = k.</li>
<li><strong>Minimum spanning tree</strong>: Prim grows one tree (Dijkstra's loop with key = edge weight), Kruskal adds the cheapest edges that close no cycle; both greedy, same total. An MST is not a shortest-path tree.</li>
<li><strong>Euler, Hamilton, colouring</strong>: Euler cycle ⇔ connected and all degrees even; Euler path only ⇔ exactly two odd vertices. A Hamilton cycle visits every <em>vertex</em> once and has no such simple test (backtracking). Sequential colouring is O(n²) and depends on the order; χ(G) is NP-complete.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>A weight matrix uses 99 for "no edge". Which line of the slides' BFS/DFS goes wrong on it?</li>
<li>Prim's loop looks like Dijkstra's. What is the one line that differs?</li>
<li>A connected graph has degrees 2, 4, 3, 3, 2. Euler cycle, Euler path, or neither?</li>
<li>Sequential colouring used 3 colours on a bipartite graph. Is the program wrong?</li>
<li>You need all shortest distances in a graph that has one edge of weight −4 and no negative cycle. Which algorithm?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) <code>a[h][i] &gt; 0</code> / <code>a[i][j] &gt; 0</code> — 99 is also &gt; 0, so non-edges are followed; test <code>&lt; 99</code> too. (2) The update: Prim sets <code>key[w] = a[u][w]</code>, Dijkstra sets <code>d[w] = d[u] + a[u][w]</code>. (3) Exactly two odd vertices (the two 3s) ⇒ an Euler path, no Euler cycle. (4) Not necessarily: the greedy result depends on the vertex order (Exercise 4); χ = 2 needs a lucky or clever order. (5) Floyd — Dijkstra requires weights ≥ 0.</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Operation / algorithm</th><th>Adjacency matrix (n × n)</th><th>Adjacency lists</th><th>Remember</th></tr></thead>
<tbody>
<tr><td>memory</td><td>O(n²)</td><td>O(n + m)</td><td>sparse → lists, dense → matrix</td></tr>
<tr><td>is (u, v) an edge?</td><td>O(1)</td><td>O(deg u)</td><td>the matrix's strength</td></tr>
<tr><td>all degrees, number of edges</td><td>O(n²)</td><td>O(n + m)</td><td>Σ deg = 2m</td></tr>
<tr><td>BFS, DFS, connected components</td><td>O(n²)</td><td>O(n + m)</td><td>restart loop for every component</td></tr>
<tr><td>Dijkstra (one source, weights ≥ 0)</td><td>O(n²)</td><td>O((n + m) log n) with a heap</td><td>keep predecessors for the path</td></tr>
<tr><td>Floyd (every pair)</td><td>O(n³)</td><td>O(n³)</td><td>negative edges OK, no negative cycle</td></tr>
<tr><td>Prim (MST)</td><td>O(n²)</td><td>O((n + m) log n) with a heap</td><td>grows one tree</td></tr>
<tr><td>Kruskal (MST)</td><td>O(n² + m log m)</td><td>O(m log m)</td><td>sorting the edges dominates</td></tr>
<tr><td>Euler cycle, stack algorithm</td><td>O(n·m)</td><td>O(n + m)</td><td>connected + all degrees even</td></tr>
<tr><td>sequential colouring</td><td>O(n²)</td><td>O(n + m)</td><td>not optimal; χ(G) is NP-complete</td></tr>
<tr><td>Hamilton cycle, backtracking</td><td>exponential in the worst case</td><td>exponential in the worst case</td><td>no simple degree test</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 5</h2>
<ol>
<li><strong>Từ vựng</strong>: G = (V, E); có hướng hay vô hướng; Σ deg = 2m; Kn có n(n − 1)/2 cạnh; cây n đỉnh có n − 1 cạnh; đỉnh khớp (articulation point) là một đỉnh, cầu (bridge) là một cạnh.</li>
<li><strong>Cách lưu</strong>: ma trận kề (adjacency matrix — bộ nhớ O(n²), kiểm cạnh O(1), dạng thường gặp trong đề PE) hoặc danh sách kề (adjacency list — O(n + m), cho đồ thị thưa). Trước khi viết <code>a[i][j] &gt; 0</code>, phải biết "không có cạnh" trông thế nào: 0, 99 hay ∞.</li>
<li><strong>BFS</strong> (duyệt theo chiều rộng) = hàng đợi, đánh dấu khi đưa vào, ít cạnh nhất; <strong>DFS</strong> (duyệt theo chiều sâu) = đệ quy, đánh dấu khi bước vào. Cả hai cần vòng khởi động lại để tới mọi thành phần; O(n + m) với danh sách kề, O(n²) với ma trận.</li>
<li><strong>Tính liên thông</strong>: mỗi thành phần một lần DFS; đồ thị có c thành phần thì không có chu trình ⇔ m = n − c; đỉnh khớp và cầu: xoá thử một phần tử, kiểm lại bằng DFS.</li>
<li><strong>Dijkstra</strong>: một nguồn, trọng số ≥ 0, tham lam "lấy đỉnh gần nhất, nới lỏng (relax) các cạnh của nó", giữ đỉnh đứng trước (predecessor) để in đường đi; O(n²) với ma trận. Trọng số âm làm nó sai.</li>
<li><strong>Floyd</strong>: mọi cặp đỉnh trong O(n³); k là vòng lặp ngoài cùng; cho phép cạnh âm, phát hiện chu trình âm bằng D[i][i] &lt; 0; với P khởi tạo 0 thì cập nhật là P[i][j] = k.</li>
<li><strong>Cây khung nhỏ nhất (MST)</strong>: Prim nuôi một cây (vòng lặp của Dijkstra với key = trọng số cạnh), Kruskal thêm các cạnh rẻ nhất không khép chu trình; cả hai đều tham lam và cho cùng tổng. MST không phải cây đường đi ngắn nhất.</li>
<li><strong>Euler, Hamilton, tô màu</strong>: có chu trình Euler ⇔ liên thông và mọi bậc chẵn; chỉ có đường đi Euler ⇔ đúng hai đỉnh bậc lẻ. Chu trình Hamilton ghé mỗi <em>đỉnh</em> một lần và không có phép thử đơn giản như vậy (phải quay lui — backtracking). Tô màu tuần tự tốn O(n²) và phụ thuộc thứ tự; tìm sắc số χ(G) là bài toán NP-đầy đủ (NP-complete).</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm quiz</h3>
<ol>
<li>Ma trận trọng số dùng 99 cho "không có cạnh". Dòng nào trong BFS/DFS của slide chạy sai trên nó?</li>
<li>Vòng lặp của Prim trông giống Dijkstra. Dòng duy nhất khác nhau là dòng nào?</li>
<li>Một đồ thị liên thông có các bậc 2, 4, 3, 3, 2. Có chu trình Euler, đường đi Euler, hay không có gì?</li>
<li>Tô màu tuần tự dùng 3 màu cho một đồ thị hai phía (bipartite). Chương trình có sai không?</li>
<li>Cần mọi khoảng cách ngắn nhất trong một đồ thị có một cạnh trọng số −4 và không có chu trình âm. Dùng thuật toán nào?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) <code>a[h][i] &gt; 0</code> / <code>a[i][j] &gt; 0</code> — 99 cũng &gt; 0 nên đi theo cả những cạnh không tồn tại; phải kiểm thêm <code>&lt; 99</code>. (2) Dòng cập nhật: Prim gán <code>key[w] = a[u][w]</code>, Dijkstra gán <code>d[w] = d[u] + a[u][w]</code>. (3) Đúng hai đỉnh bậc lẻ (hai số 3) ⇒ có đường đi Euler, không có chu trình Euler. (4) Chưa chắc: kết quả tham lam phụ thuộc thứ tự đỉnh (Bài 4); muốn đạt χ = 2 cần một thứ tự may mắn hoặc khéo chọn. (5) Floyd — Dijkstra đòi mọi trọng số ≥ 0.</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Thao tác / thuật toán</th><th>Ma trận kề (n × n)</th><th>Danh sách kề</th><th>Ghi nhớ</th></tr></thead>
<tbody>
<tr><td>bộ nhớ</td><td>O(n²)</td><td>O(n + m)</td><td>thưa → danh sách, dày → ma trận</td></tr>
<tr><td>(u, v) có phải cạnh?</td><td>O(1)</td><td>O(deg u)</td><td>thế mạnh của ma trận</td></tr>
<tr><td>bậc mọi đỉnh, số cạnh</td><td>O(n²)</td><td>O(n + m)</td><td>Σ deg = 2m</td></tr>
<tr><td>BFS, DFS, thành phần liên thông</td><td>O(n²)</td><td>O(n + m)</td><td>vòng khởi động lại cho mọi thành phần</td></tr>
<tr><td>Dijkstra (một nguồn, trọng số ≥ 0)</td><td>O(n²)</td><td>O((n + m) log n) với heap</td><td>giữ predecessor để in đường đi</td></tr>
<tr><td>Floyd (mọi cặp)</td><td>O(n³)</td><td>O(n³)</td><td>cho phép cạnh âm, cấm chu trình âm</td></tr>
<tr><td>Prim (MST)</td><td>O(n²)</td><td>O((n + m) log n) với heap</td><td>nuôi một cây</td></tr>
<tr><td>Kruskal (MST)</td><td>O(n² + m log m)</td><td>O(m log m)</td><td>khâu sắp xếp cạnh là chính</td></tr>
<tr><td>chu trình Euler, thuật toán ngăn xếp</td><td>O(n·m)</td><td>O(n + m)</td><td>liên thông + mọi bậc chẵn</td></tr>
<tr><td>tô màu tuần tự</td><td>O(n²)</td><td>O(n + m)</td><td>không tối ưu; tìm χ(G) là NP-đầy đủ</td></tr>
<tr><td>chu trình Hamilton, quay lui</td><td>hàm mũ trong trường hợp xấu nhất</td><td>hàm mũ trong trường hợp xấu nhất</td><td>không có phép thử theo bậc đơn giản</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (csd201-quiz-ch5) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'A simple undirected graph has five vertices with degrees 3, 3, 2, 2, 2. How many edges does it have?|||Một đơn đồ thị vô hướng có năm đỉnh với bậc 3, 3, 2, 2, 2. Đồ thị có bao nhiêu cạnh?',
      options: ['6|||6', '12|||12', '5|||5', '4|||4'],
      correctIndex: 0,
      points: 1,
      explanation: 'Every edge adds 1 to the degree of each of its two endpoints, so the sum of the degrees is 2|E| (the handshake lemma, syllabus CQ8.1): 3 + 3 + 2 + 2 + 2 = 12 = 2|E|, hence |E| = 6. 12 is the tempting answer — it forgets that each edge is counted twice. One such graph: a 5-cycle plus one chord.|||Mỗi cạnh cộng 1 vào bậc của cả hai đầu mút, nên tổng các bậc bằng 2|E| (định lý bắt tay, câu hỏi CQ8.1 của syllabus): 3 + 3 + 2 + 2 + 2 = 12 = 2|E|, suy ra |E| = 6. 12 là đáp án dễ nhầm — quên rằng mỗi cạnh được đếm hai lần. Một đồ thị như vậy: chu trình 5 đỉnh cộng thêm một dây cung.' },
    { id: 'q2',
      question: 'How many edges does the simple complete graph K6 have?|||Đồ thị đầy đủ đơn K6 có bao nhiêu cạnh?',
      options: ['30|||30', '36|||36', '15|||15', '12|||12'],
      correctIndex: 2,
      points: 1,
      explanation: 'Every pair of distinct vertices is joined once: n(n − 1)/2 = 6 · 5 / 2 = 15 (slide 15 of 5A-Graphs1). 30 = 6 · 5 counts each edge twice — once from each endpoint — and 36 = 6² also counts the non-existent self-loops.|||Mỗi cặp đỉnh khác nhau được nối đúng một lần: n(n − 1)/2 = 6 · 5 / 2 = 15 (slide 15 của 5A-Graphs1). 30 = 6 · 5 là đếm mỗi cạnh hai lần — một lần từ mỗi đầu mút — còn 36 = 6² đếm cả các khuyên không hề tồn tại.' },
    { id: 'q3',
      question: 'An undirected graph has the edges A–B, A–C, B–D, C–D, C–E, D–F. The depthFirst code of slide 26 (adjacency matrix, neighbours tried in alphabetical order) starts at A. In which order are the vertices visited?|||Một đồ thị vô hướng có các cạnh A–B, A–C, B–D, C–D, C–E, D–F. Hàm depthFirst ở slide 26 (ma trận kề, thử láng giềng theo thứ tự bảng chữ cái) bắt đầu từ A. Các đỉnh được thăm theo thứ tự nào?',
      options: ['A B C D E F|||A B C D E F', 'A B D C E F|||A B D C E F', 'A B D F C E|||A B D F C E', 'A C E D B F|||A C E D B F'],
      correctIndex: 1,
      points: 1,
      explanation: 'DFS goes as deep as it can before backing up: A → B → D; at D the first unvisited neighbour in alphabetical order is C, so C comes before F; from C it reaches E; then it backs up to D and finally visits F. "A B C D E F" is the breadth-first order (all neighbours of A first) — the classic mix-up. C would be right only if D tried F before C.|||DFS đi sâu hết mức rồi mới lùi: A → B → D; tại D, láng giềng chưa thăm đầu tiên theo thứ tự chữ cái là C, nên C đứng trước F; từ C tới E; rồi lùi về D và cuối cùng thăm F. "A B C D E F" là thứ tự duyệt theo chiều rộng (BFS — mọi láng giềng của A trước) — nhầm lẫn kinh điển. C chỉ đúng nếu D thử F trước C.' },
    { id: 'q4',
      question: "Dijkstra's algorithm runs from A on the weight matrix of slide 30 (5A-Graphs1): A–B 7, A–C 9, A–F 14, B–C 10, B–D 15, C–D 11, C–F 2, D–E 6, E–F 9. What is the shortest distance from A to E, and along which path?|||Chạy Dijkstra từ A trên ma trận trọng số ở slide 30 (5A-Graphs1): A–B 7, A–C 9, A–F 14, B–C 10, B–D 15, C–D 11, C–F 2, D–E 6, E–F 9. Khoảng cách ngắn nhất từ A tới E là bao nhiêu, theo đường nào?",
      options: ['23 via A-F-E|||23 theo A-F-E', '26 via A-C-D-E|||26 theo A-C-D-E', '28 via A-B-D-E|||28 theo A-B-D-E', '20 via A-C-F-E|||20 theo A-C-F-E'],
      correctIndex: 3,
      points: 1,
      explanation: 'Dijkstra settles B (7) and C (9) first; through C, F drops from 14 to 9 + 2 = 11, and D becomes 9 + 11 = 20; settling F gives E = 11 + 9 = 20. A–F–E (23) is the tempting answer because it has the fewest edges, but the direct edge A–F (14) is longer than the detour A–C–F (11).|||Dijkstra chốt B (7) và C (9) trước; qua C, F giảm từ 14 xuống 9 + 2 = 11, còn D thành 9 + 11 = 20; chốt F cho E = 11 + 9 = 20. A–F–E (23) là đáp án dễ nhầm vì ít cạnh nhất, nhưng cạnh thẳng A–F (14) lại dài hơn đường vòng A–C–F (11).' },
    { id: 'q5',
      question: "Why may Dijkstra's algorithm return a wrong answer when some edge weights are negative?|||Vì sao Dijkstra có thể cho kết quả sai khi có cạnh trọng số âm?",
      options: ['A vertex is finalized too early; a later negative edge could still shorten its path|||Một đỉnh bị chốt quá sớm; cạnh âm phía sau vẫn có thể rút ngắn đường tới nó', 'Negative weights make the priority queue throw an exception|||Trọng số âm làm hàng đợi ưu tiên ném ngoại lệ', 'It loops forever whenever the graph contains any negative edge|||Nó lặp vô hạn hễ đồ thị có một cạnh âm nào', 'The weight matrix cannot store negative numbers|||Ma trận trọng số không lưu được số âm'],
      correctIndex: 0,
      points: 1,
      explanation: 'Dijkstra is greedy: once the closest unsettled vertex is moved into the "cloud" (slide 28), its distance is never revised. That is only safe if every path leaving the cloud gets longer — true when all weights are ≥ 0. With a negative edge, a path found later can be shorter than the settled distance. The algorithm does not loop forever (C): it simply stops with a wrong value. Floyd handles negative edges as long as there is no negative cycle.|||Dijkstra là thuật toán tham lam: đỉnh gần nhất chưa chốt một khi được đưa vào "đám mây" (slide 28) thì khoảng cách không bao giờ được xét lại. Điều đó chỉ an toàn khi mọi đường đi ra khỏi đám mây đều dài thêm — đúng khi mọi trọng số ≥ 0. Có cạnh âm thì một đường tìm thấy sau có thể ngắn hơn khoảng cách đã chốt. Thuật toán không lặp vô hạn (C): nó chỉ dừng với giá trị sai. Floyd xử lý được cạnh âm miễn là không có chu trình âm.' },
    { id: 'q6',
      question: 'A connected multigraph has exactly two vertices of odd degree, u and v. Which statement is true?|||Một đa đồ thị liên thông có đúng hai đỉnh bậc lẻ là u và v. Phát biểu nào đúng?',
      options: ['It has an Euler cycle|||Nó có chu trình Euler', 'It has neither an Euler cycle nor an Euler path|||Nó không có cả chu trình lẫn đường đi Euler', 'It has an Euler path from u to v, but no Euler cycle|||Nó có đường đi Euler từ u tới v, nhưng không có chu trình Euler', 'It has an Euler path that may start at any vertex|||Nó có đường đi Euler có thể bắt đầu ở bất kỳ đỉnh nào'],
      correctIndex: 2,
      points: 1,
      explanation: 'Theorem 2 (slide 22 of 5B-Graphs2): exactly two odd vertices ⇔ an Euler path but no Euler cycle, and the path must start at one odd vertex and end at the other — every time the path passes through a vertex it uses two edges, so only its two ends can have odd degree. An Euler cycle (A) needs ALL degrees even (Theorem 1); D is wrong because a path starting at an even vertex would leave two odd vertices unpaired.|||Định lý 2 (slide 22 của 5B-Graphs2): đúng hai đỉnh lẻ ⇔ có đường đi Euler nhưng không có chu trình Euler, và đường đi phải bắt đầu ở một đỉnh lẻ và kết thúc ở đỉnh lẻ còn lại — mỗi lần đi qua một đỉnh, đường đi dùng hai cạnh, nên chỉ hai đầu mút mới có thể có bậc lẻ. Chu trình Euler (A) cần MỌI bậc đều chẵn (Định lý 1); D sai vì bắt đầu ở một đỉnh chẵn thì hai đỉnh lẻ không được "ghép cặp".' },
    { id: 'q7',
      question: "Kruskal's algorithm runs on the edges (A,B,1), (B,C,2), (A,C,3), (C,D,4), (B,D,5). Which edges form the minimum spanning tree?|||Chạy Kruskal trên các cạnh (A,B,1), (B,C,2), (A,C,3), (C,D,4), (B,D,5). Những cạnh nào tạo nên cây khung nhỏ nhất?",
      options: ['AB, BC, AC (total 6)|||AB, BC, AC (tổng 6)', 'AB, BC, CD (total 7)|||AB, BC, CD (tổng 7)', 'AB, AC, CD (total 8)|||AB, AC, CD (tổng 8)', 'AB, BC, BD (total 8)|||AB, BC, BD (tổng 8)'],
      correctIndex: 1,
      points: 1,
      explanation: 'Edges are taken in increasing weight: AB (1) and BC (2) are accepted; AC (3) is rejected because A and C are already connected — it would close the cycle A–B–C; CD (4) is accepted and the tree now has |V| − 1 = 3 edges, so the algorithm stops. Option A has the smallest total but contains a cycle and never reaches D, so it is not a spanning tree at all.|||Các cạnh được xét theo trọng số tăng dần: nhận AB (1) và BC (2); loại AC (3) vì A và C đã liên thông — thêm vào sẽ khép chu trình A–B–C; nhận CD (4) và cây đã đủ |V| − 1 = 3 cạnh nên thuật toán dừng. Phương án A có tổng nhỏ nhất nhưng chứa chu trình và không chạm tới D, nên hoàn toàn không phải cây khung.' },
    { id: 'q8',
      question: 'A road map has 100 000 intersections and 250 000 two-way roads. Which representation should a navigation program store?|||Một bản đồ đường có 100 000 giao lộ và 250 000 con đường hai chiều. Chương trình dẫn đường nên lưu bằng cách biểu diễn nào?',
      options: ['An adjacency matrix, because edge lookups are O(1)|||Ma trận kề, vì tra một cạnh là O(1)', 'An incidence matrix of vertices × edges|||Ma trận liên thuộc đỉnh × cạnh', 'A list of all pairs of intersections|||Danh sách mọi cặp giao lộ', 'Adjacency lists, one list of neighbours per vertex|||Danh sách kề, mỗi đỉnh một danh sách láng giềng'],
      correctIndex: 3,
      points: 1,
      explanation: 'The graph is sparse: each intersection has only a few roads. Adjacency lists need O(V + E), about 600 000 entries (each road appears in two lists), and BFS/DFS/Dijkstra only ever walk the neighbours of a vertex. The matrix is the tempting answer for its O(1) lookup, but it needs V² = 10¹⁰ cells, almost all of them empty; the incidence matrix is even larger, V × E.|||Đồ thị thưa: mỗi giao lộ chỉ có vài con đường. Danh sách kề cần O(V + E), khoảng 600 000 mục (mỗi con đường xuất hiện trong hai danh sách), và BFS/DFS/Dijkstra chỉ cần duyệt láng giềng của một đỉnh. Ma trận kề là đáp án dễ nhầm vì tra cứu O(1), nhưng cần V² = 10¹⁰ ô, gần như toàn ô trống; ma trận liên thuộc còn lớn hơn, V × E.' },
    { id: 'q9',
      question: "What does Floyd's algorithm (slide 32 of 5A-Graphs1) compute, and at what cost?|||Thuật toán Floyd (slide 32 của 5A-Graphs1) tính gì, và tốn bao nhiêu?",
      options: ['Shortest paths between ALL pairs of vertices, in O(V³)|||Đường đi ngắn nhất giữa MỌI cặp đỉnh, trong O(V³)', 'Shortest paths from ONE source vertex, in O(V²)|||Đường đi ngắn nhất từ MỘT đỉnh nguồn, trong O(V²)', 'A minimum spanning tree, in O(E log E)|||Cây khung nhỏ nhất, trong O(E log E)', 'An Euler cycle, in O(V + E)|||Chu trình Euler, trong O(V + E)'],
      correctIndex: 0,
      points: 1,
      explanation: 'Three nested loops over k, i, j relax D[i][j] through every intermediate vertex k: all-pairs shortest paths in O(V³), and negative edges are allowed as long as there is no negative cycle. Option B describes Dijkstra (single source, O(V²) with a matrix) — the pair of algorithms the syllabus asks you to compare (CQ10.1).|||Ba vòng lặp lồng nhau theo k, i, j làm giảm D[i][j] qua từng đỉnh trung gian k: đường đi ngắn nhất cho mọi cặp đỉnh trong O(V³), cho phép cạnh âm miễn không có chu trình âm. Phương án B là Dijkstra (một nguồn, O(V²) với ma trận) — cặp thuật toán syllabus yêu cầu so sánh (CQ10.1).' },
    { id: 'q10',
      question: 'What is the chromatic number χ of the cycle with five vertices, C5?|||Sắc số χ của chu trình năm đỉnh C5 là bao nhiêu?',
      options: ['2|||2', '3|||3', '4|||4', '5|||5'],
      correctIndex: 1,
      points: 1,
      explanation: 'Alternate two colours around the cycle: with an odd number of vertices the fifth vertex touches both colours, so a third colour is needed — χ(C2n+1) = 3, while χ(C2n) = 2 (slide 26 of 5B-Graphs2). 2 is the tempting answer for anyone who remembers "cycles are 2-colourable" without the even/odd condition.|||Tô xen kẽ hai màu quanh chu trình: với số đỉnh lẻ, đỉnh thứ năm kề cả hai màu nên cần màu thứ ba — χ(C2n+1) = 3, còn χ(C2n) = 2 (slide 26 của 5B-Graphs2). 2 là đáp án dễ nhầm với người chỉ nhớ "chu trình tô được bằng 2 màu" mà quên điều kiện chẵn/lẻ.' },
  ],
};

export default {
  slides: [L_csd10_1, L_csd10_2, L_csd11_1, L_csd11_2],
  practice: L_on_ch5,
  quiz: QUIZ,
  quizDescription: '10 câu về đồ thị: định lý bắt tay, số cạnh Kn, thứ tự DFS theo code của slide, Dijkstra trên ma trận của slide, trọng số âm, điều kiện Euler, Kruskal, chọn cách biểu diễn, Floyd, sắc số của chu trình — mỗi câu có giải thích.',
};
