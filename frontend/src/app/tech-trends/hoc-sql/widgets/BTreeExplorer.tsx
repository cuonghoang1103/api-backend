'use client';

/**
 * Cây B+Tree bấm để tìm khoá.
 *
 * Người học chọn số muốn tìm, cây tô đường đi và giải thích TỪNG bước so sánh
 * ("39 < 57 nên đi tiếp; 83 ≥ 57 nên rẽ xuống đây"). Phần giải thích quan
 * trọng ngang phần hình: nhìn đường tô mà không biết vì sao rẽ hướng đó thì
 * vẫn chưa hiểu cây hoạt động thế nào.
 */
import { useMemo, useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';

/** Cây cố định — dựng tay để mọi ví dụ trong bài trích dẫn được cùng con số. */
const LEAVES: number[][] = [
  [11, 13, 18], [21, 27], [30, 35, 39],
  [46, 48], [51, 53, 57], [58, 62, 65],
  [70, 75, 83], [85, 90], [92, 95, 98],
];
/** Mỗi branch phụ trách 3 lá liên tiếp; khoá của branch là max của từng lá. */
const BRANCHES = [0, 1, 2].map((b) => ({
  idx: b,
  keys: [0, 1, 2].map((i) => Math.max(...LEAVES[b * 3 + i])),
}));
const ROOT_KEYS = BRANCHES.map((b) => b.keys[b.keys.length - 1]);
const ALL = LEAVES.flat();

type Step = { level: 'root' | 'branch' | 'leaf'; text: string };

export default function BTreeExplorer() {
  const [target, setTarget] = useState<number | null>(null);

  const path = useMemo(() => {
    if (target === null) return null;
    const steps: Step[] = [];

    // Tầng gốc: chọn branch đầu tiên có khoá >= target.
    let bi = ROOT_KEYS.findIndex((k) => target <= k);
    if (bi === -1) bi = ROOT_KEYS.length - 1;
    steps.push({
      level: 'root',
      text: `Root [${ROOT_KEYS.join(', ')}] — ${ROOT_KEYS
        .slice(0, bi)
        .map((k) => `${k} < ${target}`)
        .concat([`${ROOT_KEYS[bi]} ≥ ${target} → rẽ xuống nhánh ${bi + 1}`])
        .join(' · ')}`,
    });

    // Tầng branch: chọn lá đầu tiên có khoá >= target.
    const bkeys = BRANCHES[bi].keys;
    let li = bkeys.findIndex((k) => target <= k);
    if (li === -1) li = bkeys.length - 1;
    steps.push({
      level: 'branch',
      text: `Branch [${bkeys.join(', ')}] — ${bkeys
        .slice(0, li)
        .map((k) => `${k} < ${target}`)
        .concat([`${bkeys[li]} ≥ ${target} → rẽ xuống lá ${li + 1}`])
        .join(' · ')}`,
    });

    const leafIdx = bi * 3 + li;
    const leaf = LEAVES[leafIdx];
    const found = leaf.includes(target);
    steps.push({
      level: 'leaf',
      text: found
        ? `Leaf [${leaf.join(', ')}] — tìm thấy ${target}. Lấy con trỏ dòng rồi về bảng thật.`
        : `Leaf [${leaf.join(', ')}] — không có ${target}. Trả về 0 dòng.`,
    });

    return { bi, leafIdx, steps, found };
  }, [target]);

  const W = 900, H = 320;
  const leafW = 88, leafGap = 8;
  const leafY = 232, branchY = 128, rootY = 34;
  const leafX = (i: number) => 20 + i * (leafW + leafGap);
  const branchX = (i: number) => leafX(i * 3) + (leafW * 3 + leafGap * 2) / 2 - 70;
  const rootX = W / 2 - 90;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-4">
        <p className="mb-2 text-xs text-slate-400">Chọn một số để tìm trong cây:</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setTarget(n)}
              className={[
                'rounded-lg border px-2.5 py-1 font-mono text-xs transition-all active:scale-95',
                target === n
                  ? 'border-violet-400/60 bg-violet-500/25 text-white'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setTarget(44)}
            className={[
              'rounded-lg border px-2.5 py-1 font-mono text-xs transition-all active:scale-95',
              target === 44
                ? 'border-rose-400/60 bg-rose-500/25 text-white'
                : 'border-rose-400/25 bg-rose-500/[0.06] text-rose-300/80 hover:border-rose-400/50',
            ].join(' ')}
            title="Số không có trong cây — xem cây làm gì"
          >
            44 (không có)
          </button>
          {target !== null && (
            <button
              type="button"
              onClick={() => setTarget(null)}
              className="ml-1 inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-400 transition-all hover:text-white active:scale-95"
            >
              <RotateCcw className="h-3 w-3" /> Xoá
            </button>
          )}
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-1">
        <div className="min-w-[720px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
            {/* Cạnh root → branch */}
            {BRANCHES.map((b) => {
              const on = path?.bi === b.idx;
              return (
                <line
                  key={`rb-${b.idx}`}
                  x1={rootX + 90}
                  y1={rootY + 42}
                  x2={branchX(b.idx) + 70}
                  y2={branchY}
                  stroke={on ? '#a78bfa' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={on ? 2 : 1}
                />
              );
            })}
            {/* Cạnh branch → leaf */}
            {LEAVES.map((_, i) => {
              const bi = Math.floor(i / 3);
              const on = path?.leafIdx === i;
              return (
                <line
                  key={`bl-${i}`}
                  x1={branchX(bi) + 70}
                  y1={branchY + 42}
                  x2={leafX(i) + leafW / 2}
                  y2={leafY}
                  stroke={on ? '#a78bfa' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={on ? 2 : 1}
                />
              );
            })}
            {/* Liên kết đôi giữa các lá */}
            <line
              x1={leafX(0) + 8}
              y1={leafY + 62}
              x2={leafX(LEAVES.length - 1) + leafW - 8}
              y2={leafY + 62}
              stroke="rgba(56,189,248,0.35)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <text x={W / 2} y={leafY + 78} textAnchor="middle" fill="#64748b" fontSize="10">
              ← Doubly Linked List nối các lá: đây là thứ làm range query nhanh →
            </text>

            {/* Root */}
            <g>
              <rect
                x={rootX} y={rootY} width={180} height={42} rx={9}
                fill={path ? 'rgba(167,139,250,0.22)' : 'rgba(255,255,255,0.04)'}
                stroke={path ? '#a78bfa' : 'rgba(255,255,255,0.14)'}
              />
              <text x={rootX + 90} y={rootY + 26} textAnchor="middle" fill="#e2e8f0" fontSize="13" fontFamily="ui-monospace, monospace">
                {ROOT_KEYS.join('  ')}
              </text>
              <text x={rootX - 10} y={rootY + 26} textAnchor="end" fill="#64748b" fontSize="10">Root</text>
            </g>

            {/* Branch */}
            {BRANCHES.map((b) => {
              const on = path?.bi === b.idx;
              return (
                <g key={`b-${b.idx}`}>
                  <rect
                    x={branchX(b.idx)} y={branchY} width={140} height={42} rx={9}
                    fill={on ? 'rgba(167,139,250,0.22)' : 'rgba(255,255,255,0.04)'}
                    stroke={on ? '#a78bfa' : 'rgba(255,255,255,0.14)'}
                  />
                  <text x={branchX(b.idx) + 70} y={branchY + 26} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="ui-monospace, monospace">
                    {b.keys.join('  ')}
                  </text>
                </g>
              );
            })}
            <text x={10} y={branchY + 26} fill="#64748b" fontSize="10">Branch</text>

            {/* Leaf */}
            {LEAVES.map((leaf, i) => {
              const on = path?.leafIdx === i;
              return (
                <g key={`l-${i}`}>
                  <rect
                    x={leafX(i)} y={leafY} width={leafW} height={42} rx={9}
                    fill={on ? 'rgba(52,211,153,0.20)' : 'rgba(255,255,255,0.04)'}
                    stroke={on ? '#34d399' : 'rgba(255,255,255,0.14)'}
                  />
                  {leaf.map((k, j) => (
                    <text
                      key={k}
                      x={leafX(i) + 14 + j * 28}
                      y={leafY + 26}
                      fill={target === k && on ? '#34d399' : '#cbd5e1'}
                      fontSize="12"
                      fontWeight={target === k && on ? '800' : '400'}
                      fontFamily="ui-monospace, monospace"
                    >
                      {k}
                    </text>
                  ))}
                </g>
              );
            })}
            <text x={10} y={leafY + 26} fill="#64748b" fontSize="10">Leaf</text>
          </svg>
        </div>
      </div>

      {!path && (
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <Search className="h-4 w-4" /> Bấm một số ở trên để xem cây đi tìm nó thế nào.
        </p>
      )}

      {path && (
        <div className="mt-4 space-y-2">
          {path.steps.map((s, i) => (
            <div key={s.text} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/25 text-[10px] font-bold text-violet-300">
                {i + 1}
              </span>
              <p className="text-[13px] leading-relaxed text-slate-300">{s.text}</p>
            </div>
          ))}
          <p
            className={[
              'rounded-xl px-4 py-3 text-sm leading-relaxed',
              path.found
                ? 'border border-emerald-400/25 bg-emerald-500/10 text-slate-200'
                : 'border border-rose-400/25 bg-rose-500/10 text-slate-200',
            ].join(' ')}
          >
            {path.found ? (
              <>
                Tổng cộng <b className="text-emerald-300">3 lần đọc</b> (root + branch + leaf) rồi thêm 1 lần lấy dòng thật.
                Cây này chỉ có 24 khoá, nhưng cùng độ cao đó với mỗi node chứa 500 khoá thì phủ được{' '}
                <b className="text-white">125 triệu dòng</b>.
              </>
            ) : (
              <>
                Không tìm thấy — nhưng vẫn chỉ tốn <b className="text-rose-300">3 lần đọc</b> để KẾT LUẬN là không có.
                Đó cũng là một điểm mạnh: trả lời &quot;không tồn tại&quot; nhanh y như trả lời &quot;có&quot;.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
