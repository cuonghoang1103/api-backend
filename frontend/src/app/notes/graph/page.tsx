'use client';

/**
 * Đồ thị tri thức — mỗi trang là một đốm, mỗi `[[liên kết]]` là một sợi.
 *
 * Bố cục tính MỘT LẦN bằng một mô phỏng lực nhỏ chạy trong `useMemo`, không
 * có vòng lặp hoạt hình: đồ thị đứng yên thì đọc được, còn đồ thị cứ nhúc
 * nhích thì không ai bấm trúng cái gì. Vị trí ban đầu đặt trên một đường tròn
 * theo chỉ số nên bố cục ỔN ĐỊNH — mở lại vẫn thấy đúng hình cũ, thay vì mỗi
 * lần một kiểu như khi gieo ngẫu nhiên.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Network, Search } from 'lucide-react';
import { toast } from 'sonner';
import { notesApi, type NoteReferenceGraph } from '@/lib/api';

/** Trần số đốm vẽ ra. Mô phỏng là O(n²) mỗi vòng lặp. */
const MAX_NODES = 400;
const ITERATIONS = 260;
const WIDTH = 1000;
const HEIGHT = 700;

interface Placed {
  id: number;
  title: string;
  subjectId: number;
  x: number;
  y: number;
  degree: number;
}

const PALETTE = ['#0d9488', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#0891b2', '#4f46e5', '#65a30d'];
const colorOf = (subjectId: number) => PALETTE[Math.abs(subjectId) % PALETTE.length];

function layout(graph: NoteReferenceGraph): { nodes: Placed[]; edges: Array<[number, number]> } {
  // Ưu tiên giữ lại trang có nhiều liên kết nhất khi phải cắt bớt: một đồ thị
  // bị cắt ngẫu nhiên sẽ vứt mất đúng những nút trung tâm làm nên hình dạng.
  const degree = new Map<number, number>();
  for (const edge of graph.edges) {
    degree.set(edge.sourceNoteId, (degree.get(edge.sourceNoteId) ?? 0) + 1);
    degree.set(edge.targetNoteId, (degree.get(edge.targetNoteId) ?? 0) + 1);
  }
  const kept = graph.nodes
    .slice()
    .sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0))
    .slice(0, MAX_NODES);
  const index = new Map(kept.map((node, i) => [node.id, i]));

  const edges: Array<[number, number]> = [];
  for (const edge of graph.edges) {
    const a = index.get(edge.sourceNoteId);
    const b = index.get(edge.targetNoteId);
    if (a !== undefined && b !== undefined && a !== b) edges.push([a, b]);
  }

  const n = kept.length;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const radius = Math.min(WIDTH, HEIGHT) * 0.38;
  const xs = new Float64Array(n);
  const ys = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const angle = (i / Math.max(1, n)) * Math.PI * 2;
    xs[i] = cx + Math.cos(angle) * radius;
    ys[i] = cy + Math.sin(angle) * radius;
  }

  const repulsion = 9000;
  const spring = 0.012;
  const ideal = 90;
  for (let step = 0; step < ITERATIONS; step++) {
    // Nguội dần: bước đầu di chuyển mạnh để gỡ rối, bước cuối gần như đứng im.
    const cooling = 1 - step / ITERATIONS;
    const dx = new Float64Array(n);
    const dy = new Float64Array(n);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let vx = xs[i]! - xs[j]!;
        let vy = ys[i]! - ys[j]!;
        let d2 = vx * vx + vy * vy;
        if (d2 < 0.01) { vx = (i - j) * 0.01 + 0.01; vy = 0.01; d2 = 0.0002; }
        const force = repulsion / d2;
        const d = Math.sqrt(d2);
        dx[i]! += (vx / d) * force; dy[i]! += (vy / d) * force;
        dx[j]! -= (vx / d) * force; dy[j]! -= (vy / d) * force;
      }
    }
    for (const [a, b] of edges) {
      const vx = xs[b]! - xs[a]!;
      const vy = ys[b]! - ys[a]!;
      const d = Math.sqrt(vx * vx + vy * vy) || 1;
      const force = (d - ideal) * spring;
      dx[a]! += (vx / d) * force * 10; dy[a]! += (vy / d) * force * 10;
      dx[b]! -= (vx / d) * force * 10; dy[b]! -= (vy / d) * force * 10;
    }
    for (let i = 0; i < n; i++) {
      // Kéo nhẹ về tâm, nếu không các cụm rời rạc sẽ trôi ra vô cực.
      dx[i]! += (cx - xs[i]!) * 0.006;
      dy[i]! += (cy - ys[i]!) * 0.006;
      xs[i] = Math.max(24, Math.min(WIDTH - 24, xs[i]! + Math.max(-18, Math.min(18, dx[i]!)) * cooling));
      ys[i] = Math.max(24, Math.min(HEIGHT - 24, ys[i]! + Math.max(-18, Math.min(18, dy[i]!)) * cooling));
    }
  }

  return {
    nodes: kept.map((node, i) => ({
      id: node.id,
      title: node.title,
      subjectId: node.subjectId,
      x: xs[i]!,
      y: ys[i]!,
      degree: degree.get(node.id) ?? 0,
    })),
    edges,
  };
}

export default function NotesGraphPage() {
  const router = useRouter();
  const [graph, setGraph] = useState<NoteReferenceGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    notesApi.getGraph()
      .then((res) => setGraph(res.data.data))
      .catch(() => toast.error('Không tải được đồ thị'))
      .finally(() => setLoading(false));
  }, []);

  const placed = useMemo(() => (graph ? layout(graph) : null), [graph]);

  const neighbours = useMemo(() => {
    if (!placed || hovered === null) return null;
    const set = new Set<number>([hovered]);
    for (const [a, b] of placed.edges) {
      if (placed.nodes[a]!.id === hovered) set.add(placed.nodes[b]!.id);
      if (placed.nodes[b]!.id === hovered) set.add(placed.nodes[a]!.id);
    }
    return set;
  }, [placed, hovered]);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || !placed) return null;
    return new Set(placed.nodes.filter((n) => n.title.toLowerCase().includes(needle)).map((n) => n.id));
  }, [query, placed]);

  const linked = placed ? new Set(placed.edges.flatMap(([a, b]) => [placed.nodes[a]!.id, placed.nodes[b]!.id])) : null;
  const isolated = placed && linked ? placed.nodes.filter((n) => !linked.has(n.id)).length : 0;
  const truncated = graph ? graph.nodes.length - (placed?.nodes.length ?? 0) : 0;

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/notes"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-white/[0.06]"
            aria-label="Quay lại Ghi chú"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            <Network className="h-5 w-5" aria-hidden="true" /> Đồ thị tri thức
          </h1>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <label htmlFor="graph-search" className="sr-only">Tìm trang trong đồ thị</label>
          <input
            id="graph-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm trang…"
            className="min-h-10 w-56 rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-72 items-center justify-center text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
      ) : !placed || placed.nodes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 p-10 text-center dark:border-white/[0.08]">
          <Network className="mx-auto mb-3 h-9 w-9 text-slate-300" aria-hidden="true" />
          <p className="text-sm text-slate-600 dark:text-slate-300">Chưa có trang nào.</p>
          <p className="mt-1 text-xs text-slate-500">
            Gõ <code className="rounded bg-slate-100 px-1 dark:bg-white/[0.08]">[[Tên trang]]</code> trong một ghi chú để tạo liên kết.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-2 text-xs text-slate-500">
            {placed.nodes.length} trang · {placed.edges.length} liên kết
            {isolated > 0 && <> · {isolated} trang chưa nối với gì</>}
            {truncated > 0 && <> · đã ẩn {truncated} trang ít liên kết nhất</>}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0c0f14]">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="h-auto w-full min-w-[700px]"
              role="img"
              aria-label={`Đồ thị ${placed.nodes.length} trang và ${placed.edges.length} liên kết`}
            >
              {placed.edges.map(([a, b], i) => {
                const na = placed.nodes[a]!;
                const nb = placed.nodes[b]!;
                const active = neighbours ? (neighbours.has(na.id) && neighbours.has(nb.id)) : false;
                return (
                  <line
                    key={i}
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={active ? '#0d9488' : 'currentColor'}
                    className={active ? '' : 'text-slate-300 dark:text-white/[0.13]'}
                    strokeWidth={active ? 1.8 : 0.8}
                  />
                );
              })}
              {placed.nodes.map((node) => {
                const dim = (neighbours && !neighbours.has(node.id))
                  || (matches && !matches.has(node.id));
                const r = 5 + Math.min(9, node.degree * 1.4);
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x} ${node.y})`}
                    opacity={dim ? 0.2 : 1}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => router.push(`/notes?note=${node.id}`)}
                    className="cursor-pointer"
                  >
                    <circle r={r} fill={colorOf(node.subjectId)} />
                    <title>{node.title || 'Không có tiêu đề'} · {node.degree} liên kết</title>
                    {(node.degree > 1 || hovered === node.id || (matches?.has(node.id) ?? false)) && (
                      <text
                        y={-r - 5}
                        textAnchor="middle"
                        className="pointer-events-none fill-slate-700 text-[11px] dark:fill-slate-200"
                      >
                        {(node.title || 'Không có tiêu đề').slice(0, 24)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Bấm một đốm để mở trang. Rê chuột để làm nổi các trang nối với nó. Màu theo môn học,
            đốm to là trang được nhắc tới nhiều.
          </p>
        </>
      )}
    </main>
  );
}
