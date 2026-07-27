'use client';

/**
 * Trình xem JSON tô màu, viết tay.
 *
 * Không dùng thư viện highlight có sẵn của repo (Prism/Shiki) vì ở đây chỉ
 * cần đúng một ngôn ngữ và một bảng màu — kéo cả bộ tô màu vào chỉ để in
 * vài chục dòng JSON là lãng phí. Bản này duyệt thẳng cấu trúc dữ liệu nên
 * không bao giờ tô nhầm và không cần làm sạch HTML.
 */

import { memo } from 'react';

const C = {
  key: '#7dd3fc',
  string: '#86efac',
  number: '#fcd34d',
  boolean: '#c4b5fd',
  null: '#94a3b8',
  punct: '#64748b',
};

function Value({ value, depth }: { value: unknown; depth: number }) {
  if (value === null) return <span style={{ color: C.null }}>null</span>;
  if (typeof value === 'string') return <span style={{ color: C.string }}>&quot;{value}&quot;</span>;
  if (typeof value === 'number') return <span style={{ color: C.number }}>{value}</span>;
  if (typeof value === 'boolean') return <span style={{ color: C.boolean }}>{String(value)}</span>;

  const pad = '  '.repeat(depth + 1);
  const padEnd = '  '.repeat(depth);

  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: C.punct }}>[]</span>;
    return (
      <>
        <span style={{ color: C.punct }}>[</span>
        {value.map((item, i) => (
          <span key={i}>
            {'\n'}
            {pad}
            <Value value={item} depth={depth + 1} />
            {i < value.length - 1 && <span style={{ color: C.punct }}>,</span>}
          </span>
        ))}
        {'\n'}
        {padEnd}
        <span style={{ color: C.punct }}>]</span>
      </>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return <span style={{ color: C.punct }}>{'{}'}</span>;
  return (
    <>
      <span style={{ color: C.punct }}>{'{'}</span>
      {entries.map(([k, v], i) => (
        <span key={k}>
          {'\n'}
          {pad}
          <span style={{ color: C.key }}>&quot;{k}&quot;</span>
          <span style={{ color: C.punct }}>: </span>
          <Value value={v} depth={depth + 1} />
          {i < entries.length - 1 && <span style={{ color: C.punct }}>,</span>}
        </span>
      ))}
      {'\n'}
      {padEnd}
      <span style={{ color: C.punct }}>{'}'}</span>
    </>
  );
}

function JsonViewImpl({ data }: { data: unknown }) {
  return (
    <pre className="overflow-x-auto whitespace-pre rounded-lg border border-[#1b2440] bg-[#070b16] p-3 font-mono text-[12.5px] leading-[1.7] text-[#cbd5e1]">
      <Value value={data} depth={0} />
    </pre>
  );
}

export const JsonView = memo(JsonViewImpl);
