/**
 * Exp Hub guide for MAD101 — discrete math tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content`. Academy MAD101 links "Công cụ" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'mad101-cong-cu-hoc-tap',
    title: 'MAD101 — Công cụ học tập: bảng chân trị, WolframAlpha & đồ thị (Python/networkx)',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Công cụ miễn phí cho MAD101: bộ tạo bảng chân trị (kiểm tương đương logic), WolframAlpha (mod/GCD/tổ hợp), và Python + networkx cho đồ thị/cây (dùng cho Programming Assignment).',
    referenceUrl: 'https://www.wolframalpha.com/',
    codeBlocks: [
      {
        name: 'Python + networkx — đồ thị & đường đi ngắn nhất (Dijkstra)',
        language: 'python',
        code: `import networkx as nx

G = nx.Graph()
G.add_weighted_edges_from([
    ("A","B",4), ("A","C",2), ("C","B",1), ("B","D",5), ("C","D",8)
])

# Duong di ngan nhat A -> D (Dijkstra):
print(nx.shortest_path(G, "A", "D", weight="weight"))         # ['A','C','B','D']
print(nx.shortest_path_length(G, "A", "D", weight="weight"))  # 8

# Cay khung nho nhat (MST):
mst = nx.minimum_spanning_tree(G)
print(list(mst.edges(data=True)))`,
      },
      {
        name: 'Số học mô-đun & tổ hợp trong Python',
        language: 'python',
        code: `import math
print(17 % 5)              # 2  (mod)
print(math.gcd(48, 18))    # 6  (uoc chung lon nhat)
print(math.comb(5, 3))     # 10 (to hop C(5,3))
print(math.perm(5, 3))     # 60 (chinh hop P(5,3))`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học tập · MAD101</span>
<h2>Công cụ cho Toán rời rạc</h2>
<p class="lead">Toán rời rạc phải <strong>làm tay</strong> mới thi được, nhưng công cụ giúp <em>kiểm</em> bảng chân trị, số học mô-đun, tổ hợp và <em>trực quan</em> đồ thị/cây — đặc biệt cho <strong>Programming Assignment</strong> (10% điểm). Tất cả miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ch 1</div><div class="lz-t">Bảng chân trị</div><div class="lz-d">kiểm tương đương logic</div></div>
  <div class="lz-step"><div class="lz-k">Ch 4, 6</div><div class="lz-t">WolframAlpha</div><div class="lz-d">mod, GCD, tổ hợp</div></div>
  <div class="lz-step"><div class="lz-k">Ch 7, 8</div><div class="lz-t">Python/networkx</div><div class="lz-d">đồ thị, Dijkstra, MST</div></div>
</div>

<h3>✅ 1 — Bộ tạo bảng chân trị (Chương 1)</h3>
<p>Nhập một biểu thức logic (dùng ∧ ∨ ¬ → ↔) và xem bảng chân trị đầy đủ để kiểm hai biểu thức có tương đương không.</p>
<a class="link-card dl" href="https://web.stanford.edu/class/cs103/tools/truth-table-tool/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Stanford Truth Table Tool</span><span class="lc-sub">web.stanford.edu/class/cs103 · sinh bảng chân trị trên web</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧮 2 — WolframAlpha (Chương 4, 6)</h3>
<p>Gõ trực tiếp: <code>17 mod 5</code>, <code>gcd(48,18)</code>, <code>C(5,3)</code>, <code>sum i, i=1 to 100</code> — WolframAlpha tính ngay để bạn đối chiếu bài làm tay.</p>
<a class="link-card dl" href="https://www.wolframalpha.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">WolframAlpha</span><span class="lc-sub">wolframalpha.com · số học mô-đun, GCD, tổ hợp, tổng</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🐍 3 — Python + networkx (Chương 7, 8 &amp; Programming Assignment)</h3>
<p>Thư viện <strong>networkx</strong> dựng đồ thị/cây và chạy sẵn Dijkstra, MST — hoàn hảo để hiểu và kiểm bài đồ thị. Xem 2 khối code mẫu ở trên. Cài Python rồi <code>pip install networkx</code>.</p>
<a class="link-card dl" href="https://www.python.org/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Python (python.org)</span><span class="lc-sub">python.org/downloads · rồi: pip install networkx</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://csacademy.com/app/graph_editor/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">CS Academy Graph Editor (vẽ đồ thị trên web)</span><span class="lc-sub">csacademy.com/app/graph_editor · trực quan đỉnh/cạnh nhanh</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Nhắc điều kiện qua môn: <strong>TB ≥ 5</strong> và <strong>thi cuối ≥ 4</strong>. 60% điểm là quá trình (3 Progress Test + Assignment). Dùng công cụ để KIỂM, không thay việc tự làm chứng minh và bài tập. Luyện thuật toán đồ thị trên Algorithm Visualizer + CodeLab track data-structures-algorithms.</div>
`,
  },
};
