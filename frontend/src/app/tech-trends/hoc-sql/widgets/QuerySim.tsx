'use client';

/**
 * Chạy một câu SELECT từng bước.
 *
 * Các chặng được TÍNH THẬT bằng JavaScript từ mảng dữ liệu bên dưới, không
 * chép tay kết quả — nếu sau này ai sửa dữ liệu mẫu thì mọi bước tự khớp lại,
 * không có nguy cơ hình minh hoạ nói một đằng còn con số một nẻo.
 */
import { useMemo, useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';

interface Row { id: number; name: string; category: string; price: number; stock: number }

const DATA: Row[] = [
  { id: 1, name: 'Bàn phím cơ', category: 'ban-phim', price: 1200000, stock: 14 },
  { id: 2, name: 'Chuột không dây', category: 'chuot', price: 350000, stock: 0 },
  { id: 3, name: 'Màn hình 27"', category: 'man-hinh', price: 5900000, stock: 3 },
  { id: 4, name: 'Tai nghe', category: 'tai-nghe', price: 890000, stock: 27 },
  { id: 5, name: 'Webcam', category: 'phu-kien', price: 1450000, stock: 8 },
  { id: 6, name: 'Bàn phím mini', category: 'ban-phim', price: 900000, stock: 5 },
  { id: 7, name: 'Chuột gaming', category: 'chuot', price: 750000, stock: 12 },
  { id: 8, name: 'Lót chuột', category: 'phu-kien', price: 120000, stock: 0 },
];

const vnd = (n: number) => n.toLocaleString('vi-VN');

interface Stage {
  clause: string;
  order: number;
  note: string;
  head: string[];
  rows: (string | number)[][];
  /** Chỉ số các dòng bị loại ở bước này (hiện mờ + gạch ngang). */
  dropped?: (string | number)[][];
}

/* ── Câu 1: lọc → sắp xếp → cắt ─────────────────────────────────── */
function buildFilterQuery(): Stage[] {
  const head = ['id', 'name', 'category', 'price', 'stock'];
  const toRow = (r: Row) => [r.id, r.name, r.category, vnd(r.price), r.stock];

  const kept = DATA.filter((r) => r.price > 500000);
  const dropped = DATA.filter((r) => !(r.price > 500000));
  const sorted = [...kept].sort((a, b) => b.price - a.price);
  const limited = sorted.slice(0, 3);

  return [
    {
      clause: 'FROM products', order: 1,
      note: `Lấy toàn bộ bảng ra: ${DATA.length} dòng. Chưa lọc gì cả.`,
      head, rows: DATA.map(toRow),
    },
    {
      clause: "WHERE price > 500000", order: 2,
      note: `Bỏ ${dropped.length} dòng không thoả điều kiện. Còn ${kept.length} dòng.`,
      head, rows: kept.map(toRow), dropped: dropped.map(toRow),
    },
    {
      clause: 'SELECT name, price', order: 5,
      note: 'Bây giờ mới chọn cột. Các cột khác bị bỏ đi — đây cũng là lúc alias được tạo ra.',
      head: ['name', 'price'], rows: kept.map((r) => [r.name, vnd(r.price)]),
    },
    {
      clause: 'ORDER BY price DESC', order: 7,
      note: 'Sắp xếp giá giảm dần. Tới bước này alias đã tồn tại nên dùng được.',
      head: ['name', 'price'], rows: sorted.map((r) => [r.name, vnd(r.price)]),
    },
    {
      clause: 'LIMIT 3', order: 8,
      note: `Cắt lấy 3 dòng đầu. ${sorted.length - 3} dòng còn lại bị vứt — nhưng chúng ĐÃ được sắp xếp rồi, công đó vẫn phải làm.`,
      head: ['name', 'price'], rows: limited.map((r) => [r.name, vnd(r.price)]),
      dropped: sorted.slice(3).map((r) => [r.name, vnd(r.price)]),
    },
  ];
}

/* ── Câu 2: lọc → gộp nhóm → lọc nhóm → sắp xếp ─────────────────── */
function buildGroupQuery(): Stage[] {
  const head = ['id', 'name', 'category', 'price', 'stock'];
  const toRow = (r: Row) => [r.id, r.name, r.category, vnd(r.price), r.stock];

  const kept = DATA.filter((r) => r.stock > 0);
  const dropped = DATA.filter((r) => !(r.stock > 0));

  const byCat = new Map<string, Row[]>();
  kept.forEach((r) => {
    const list = byCat.get(r.category) ?? [];
    list.push(r);
    byCat.set(r.category, list);
  });
  const groups = [...byCat.entries()].map(([category, rows]) => ({
    category,
    n: rows.length,
    sum: rows.reduce((s, r) => s + r.price, 0),
  }));
  const passed = groups.filter((g) => g.sum > 1000000);
  const failed = groups.filter((g) => !(g.sum > 1000000));
  const sorted = [...passed].sort((a, b) => b.sum - a.sum);

  const gRow = (g: { category: string; n: number; sum: number }) => [g.category, g.n, vnd(g.sum)];

  return [
    {
      clause: 'FROM products', order: 1,
      note: `Toàn bộ ${DATA.length} dòng.`,
      head, rows: DATA.map(toRow),
    },
    {
      clause: 'WHERE stock > 0', order: 2,
      note: `Bỏ ${dropped.length} sản phẩm hết hàng TRƯỚC khi gộp — lọc sớm thì có ít dòng để gộp hơn, nhanh hơn.`,
      head, rows: kept.map(toRow), dropped: dropped.map(toRow),
    },
    {
      clause: 'GROUP BY category', order: 3,
      note: `${kept.length} dòng gom thành ${groups.length} nhóm. Từ đây cột \`name\` không còn dùng được — mỗi nhóm có nhiều tên khác nhau.`,
      head: ['category', 'COUNT(*)', 'SUM(price)'], rows: groups.map(gRow),
    },
    {
      clause: 'HAVING SUM(price) > 1000000', order: 4,
      note: `Lọc NHÓM (không phải dòng). Bỏ ${failed.length} nhóm có tổng dưới 1 triệu.`,
      head: ['category', 'COUNT(*)', 'SUM(price)'], rows: passed.map(gRow), dropped: failed.map(gRow),
    },
    {
      clause: 'ORDER BY SUM(price) DESC', order: 7,
      note: 'Sắp xếp các nhóm còn lại theo tổng giảm dần.',
      head: ['category', 'COUNT(*)', 'SUM(price)'], rows: sorted.map(gRow),
    },
  ];
}

const QUERIES = [
  {
    id: 'filter',
    label: 'Lọc · sắp xếp · cắt',
    sql: `SELECT   name, price
FROM     products
WHERE    price > 500000
ORDER BY price DESC
LIMIT    3;`,
    stages: buildFilterQuery(),
  },
  {
    id: 'group',
    label: 'Gộp nhóm · HAVING',
    sql: `SELECT   category, COUNT(*), SUM(price)
FROM     products
WHERE    stock > 0
GROUP BY category
HAVING   SUM(price) > 1000000
ORDER BY SUM(price) DESC;`,
    stages: buildGroupQuery(),
  },
];

export default function QuerySim() {
  const [qi, setQi] = useState(0);
  const [step, setStep] = useState(0);
  const q = QUERIES[qi];
  const stage = q.stages[step];
  const last = step >= q.stages.length - 1;

  const pick = (i: number) => { setQi(i); setStep(0); };

  const sqlLines = useMemo(() => q.sql.split('\n'), [q.sql]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      {/* Chọn câu query */}
      <div className="mb-4 flex flex-wrap gap-2">
        {QUERIES.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => pick(i)}
            className={[
              'rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-95',
              i === qi
                ? 'border-violet-400/50 bg-violet-500/20 text-white'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        {/* Câu SQL, dòng đang chạy được tô */}
        <div className="rounded-xl border border-white/10 bg-[#0c0c14] p-3">
          <pre className="overflow-x-auto text-[12.5px] leading-relaxed">
            {sqlLines.map((line, i) => {
              const active = line.trim().toUpperCase().startsWith(
                stage.clause.split(' ')[0].toUpperCase(),
              );
              return (
                <div
                  key={`${line}-${i}`}
                  className={[
                    '-mx-2 rounded px-2 font-mono transition-colors',
                    active ? 'bg-violet-500/20 text-white' : 'text-slate-500',
                  ].join(' ')}
                >
                  {line || ' '}
                </div>
              );
            })}
          </pre>
          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/25 text-[10px] font-bold text-violet-300">
                {stage.order}
              </span>
              <span className="font-mono text-xs text-violet-300">{stage.clause}</span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-400">{stage.note}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(q.stages.length - 1, s + 1))}
              disabled={last}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-violet-400/40 bg-violet-500/20 px-3 py-2 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-30"
            >
              Bước tiếp <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition-all hover:border-white/20 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex gap-1">
            {q.stages.map((s, i) => (
              <button
                key={s.clause}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Bước ${i + 1}: ${s.clause}`}
                className={[
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i <= step ? 'bg-violet-400' : 'bg-white/10',
                ].join(' ')}
              />
            ))}
          </div>
        </div>

        {/* Bảng dữ liệu ở chặng hiện tại */}
        <div className="min-w-0">
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-white">{stage.rows.length}</span>
            <span className="text-xs text-slate-400">
              {stage.head[0] === 'category' && stage.head.includes('COUNT(*)') ? 'nhóm' : 'dòng'} còn lại
            </span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-white/[0.05]">
                  {stage.head.map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-mono text-[11px] font-semibold text-violet-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stage.rows.map((r, i) => (
                  <tr key={`k-${i}`} className="border-t border-white/[0.07]">
                    {r.map((c, j) => (
                      <td key={`k-${i}-${j}`} className="whitespace-nowrap px-3 py-1.5 text-slate-200">{c}</td>
                    ))}
                  </tr>
                ))}
                {stage.dropped?.map((r, i) => (
                  <tr key={`d-${i}`} className="border-t border-white/[0.07] bg-rose-500/[0.05]">
                    {r.map((c, j) => (
                      <td key={`d-${i}-${j}`} className="whitespace-nowrap px-3 py-1.5 text-slate-600 line-through">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stage.dropped && stage.dropped.length > 0 && (
            <p className="mt-2 text-[11px] text-slate-500">
              Dòng gạch ngang là phần vừa bị bước này loại bỏ.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
