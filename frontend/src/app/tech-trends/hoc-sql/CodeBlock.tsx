'use client';

/**
 * Khối code SQL có tô màu và nút chép.
 *
 * Tô màu bằng một bộ tách token nhỏ tự viết thay vì Prism/Shiki: chỉ có ba
 * ngôn ngữ cần dùng ở đây và SQL thì gần như chỉ cần tô từ khoá, chuỗi và ghi
 * chú. Đổi lại là không thêm ~40KB JavaScript vào một trang mà người học sẽ
 * mở lại rất nhiều lần trên điện thoại.
 */
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET',
  'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'RETURNING',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'CREATE INDEX', 'TRUNCATE',
  'ADD COLUMN', 'DROP COLUMN', 'RENAME COLUMN', 'ADD CONSTRAINT', 'ALTER COLUMN',
  'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'NOT NULL', 'UNIQUE', 'CHECK', 'DEFAULT',
  'GENERATED ALWAYS AS IDENTITY', 'ON DELETE', 'ON CONFLICT', 'DO UPDATE', 'DO NOTHING',
  'CASCADE', 'RESTRICT', 'SET NULL', 'EXCLUDED',
  'WITH RECURSIVE', 'WITH', 'AS', 'UNION ALL', 'UNION', 'INTERSECT', 'EXCEPT',
  'DISTINCT ON', 'DISTINCT', 'EXISTS', 'NOT EXISTS', 'IN', 'NOT IN', 'BETWEEN',
  'LIKE', 'ILIKE', 'IS NULL', 'IS NOT NULL', 'AND', 'OR', 'NOT', 'CASE', 'WHEN',
  'THEN', 'ELSE', 'END', 'FILTER', 'ASC', 'DESC', 'NULLS LAST', 'NULLS FIRST',
  'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT', 'FOR UPDATE', 'FOR SHARE',
  'EXPLAIN', 'ANALYZE', 'BUFFERS', 'INCLUDE', 'PARTITION BY', 'OVER',
];

const FUNCS = [
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'COALESCE', 'NULLIF', 'now',
  'STRING_AGG', 'string_agg', 'lower', 'upper', 'length', 'trim', 'repeat',
  'date_trunc', 'extract', 'to_char', 'unnest', 'gen_random_uuid', 'ROW_NUMBER',
];

const TYPES = [
  'bigint', 'integer', 'smallint', 'text', 'varchar', 'numeric', 'boolean',
  'timestamptz', 'timestamp', 'date', 'uuid', 'jsonb', 'json', 'bytea', 'interval',
  'float8', 'double precision', 'real', 'serial', 'bigserial',
];

/** Ghép thành một regex duy nhất; cụm dài đứng trước để khớp ưu tiên. */
const byLength = (a: string, b: string) => b.length - a.length;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE = new RegExp(
  [
    '(--[^\\n]*)',                                            // 1 ghi chú
    "('(?:[^']|'')*')",                                       // 2 chuỗi
    `\\b(${[...KEYWORDS].sort(byLength).map(esc).join('|')})\\b`, // 3 từ khoá
    `\\b(${[...TYPES].sort(byLength).map(esc).join('|')})\\b`,    // 4 kiểu
    `\\b(${[...FUNCS].sort(byLength).map(esc).join('|')})\\s*\\(`, // 5 hàm
    '(\\b\\d+(?:\\.\\d+)?\\b)',                                // 6 số
  ].join('|'),
  'gi',
);

function highlight(code: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  let key = 0;

  while ((m = RE.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index));
    if (m[1]) out.push(<span key={key++} className="text-slate-500 italic">{m[1]}</span>);
    else if (m[2]) out.push(<span key={key++} className="text-emerald-300">{m[2]}</span>);
    else if (m[3]) out.push(<span key={key++} className="font-semibold text-violet-400">{m[3]}</span>);
    else if (m[4]) out.push(<span key={key++} className="text-sky-300">{m[4]}</span>);
    else if (m[5]) { out.push(<span key={key++} className="text-amber-300">{m[5]}</span>); out.push('('); }
    else if (m[6]) out.push(<span key={key++} className="text-orange-300">{m[6]}</span>);
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export default function CodeBlock({
  code, lang = 'sql', caption,
}: { code: string; lang?: string; caption?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* trình duyệt chặn clipboard — im lặng bỏ qua, nút chỉ là tiện ích */
    }
  };

  return (
    <figure className="my-5">
      {caption && <figcaption className="mb-2 text-xs font-medium text-slate-400">{caption}</figcaption>}
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wide text-slate-600">{lang}</span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
          >
            {copied ? <><Check className="h-3 w-3 text-emerald-400" /> Đã chép</> : <><Copy className="h-3 w-3" /> Chép</>}
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-3.5">
          <code className="font-mono text-[13px] leading-[1.7] text-slate-300">
            {lang === 'sql' ? highlight(code) : code}
          </code>
        </pre>
      </div>
    </figure>
  );
}
