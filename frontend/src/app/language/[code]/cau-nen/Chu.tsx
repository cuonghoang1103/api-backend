'use client';

/** Chữ có cú pháp nhỏ `**đậm**` · `~~sai~~` (gạch đỏ) · `==tô==`. */
import { Fragment, useState } from 'react';

const RE = /(\*\*[^*]+\*\*|~~[^~]+~~|==[^=]+==)/g;
export function Chu({ text }: { text: string }) {
  return (
    <>
      {text.split(RE).map((p, i) =>
        p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b>
          : p.startsWith('~~') ? <s key={i} style={{ color: 'var(--lh-bad)' }}>{p.slice(2, -2)}</s>
            : p.startsWith('==') ? <mark key={i} style={{ background: 'var(--lh-warn-soft)', color: 'inherit', padding: '0 2px', borderRadius: 4 }}>{p.slice(2, -2)}</mark>
              : <Fragment key={i}>{p}</Fragment>)}
    </>
  );
}

/** URL ảnh minh hoạ (Fluent Emoji / ai-*), giống `anhUrl` của sách-học. */
export const anhUrl = (anh: string) => (/^https?:\/\//.test(anh) ? anh : `https://media.cuongthai.com/hoc/hinh/${encodeURIComponent(anh)}.webp`);

/** Ảnh minh hoạ; ảnh chưa có trên CDN (ảnh `ai-*` chờ vẽ) ⇒ ô chữ cái đầu thay vì ảnh vỡ. */
export function Anh({ anh, alt, className, oChu }: { anh?: string; alt: string; className?: string; oChu?: string }) {
  const [loi, setLoi] = useState(false);
  if (!anh || loi) return <span className={oChu} aria-hidden>{alt.trim().charAt(0).toUpperCase()}</span>;
  // eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh nhỏ trên CDN
  return <img src={anhUrl(anh)} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setLoi(true)} />;
}
