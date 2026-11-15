// @java: CloneGraph.java
// LC 133 · Clone Graph — BFS over the original, a Map original → copy doubles as the visited set.
class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val: number) { this.val = val; this.neighbors = []; }
}

// #region giai
function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const copy = new Map<GraphNode, GraphNode>();
  copy.set(node, new GraphNode(node.val));
  const q = [node];
  for (let head = 0; head < q.length; head++) {
    const u = q[head];
    for (const v of u.neighbors) {
      if (!copy.has(v)) { copy.set(v, new GraphNode(v.val)); q.push(v); }   // first time seen: create + enqueue
      copy.get(u)!.neighbors.push(copy.get(v)!);                             // wire the COPY to the COPY
    }
  }
  return copy.get(node)!;
}
// #endregion

function build(adj: number[][]): GraphNode {          // LC format: node i+1 has neighbours adj[i]
  const nodes = adj.map((_, i) => new GraphNode(i + 1));
  adj.forEach((ns, i) => { for (const j of ns) nodes[i].neighbors.push(nodes[j - 1]); });
  return nodes[0];
}
function dump(start: GraphNode): { adj: number[][]; nodes: Set<GraphNode> } {
  const seen = new Set<GraphNode>([start]);
  const q = [start];
  for (let h = 0; h < q.length; h++) for (const v of q[h].neighbors) if (!seen.has(v)) { seen.add(v); q.push(v); }
  const sorted = [...seen].sort((a, b) => a.val - b.val);
  return { adj: sorted.map((n) => n.neighbors.map((v) => v.val)), nodes: seen };
}
const original = build([[2, 4], [1, 3], [2, 4], [1, 3]]);
const cloned = cloneGraph(original)!;
const a = dump(original), b = dump(cloned);
console.log('original adj:', JSON.stringify(a.adj));
console.log('clone adj   :', JSON.stringify(b.adj));
console.log('nodes shared between original and clone:', [...b.nodes].filter((x) => a.nodes.has(x)).length);
