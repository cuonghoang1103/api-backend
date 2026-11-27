'use client';

/**
 * dm5 G2 (27/11/2026) B18 — sơ đồ PlantUML: soạn nguồn `.puml` + xem SVG do MÁY RENDER TỰ HOST của máy chủ vẽ
 * (POST /diagrams/plantuml/render — không gửi ra plantuml.com). Chưa cấu hình máy render ⇒ chỉ hiện mã + lời giải thích.
 * SVG hiện bằng <img src="blob:"> ⇒ không chạy được script dù máy render trả gì (máy chủ cũng đã làm sạch).
 */

import { useEffect, useRef, useState } from 'react';
import { workError } from '@/lib/work-api';
import { workDm5bApi } from '@/lib/work-dm5b-api';
import { wt } from '@/components/work/i18n';
import { Spinner } from '../ui';

export default function PlantUmlEditor({ pid, source, readOnly, onChange, label, showCode }: {
  pid: number; source: string; readOnly: boolean; onChange: (v: string) => void; label: string; showCode: boolean;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);
  useEffect(() => {
    const my = ++seq.current;
    const h = setTimeout(async () => {
      if (!source.trim()) { setUrl(null); return; }
      setBusy(true);
      try {
        const svg = await workDm5bApi.renderPlantUml(pid, source);
        if (my !== seq.current) return;
        setUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })); });
        setErr(null);
      } catch (e) {
        if (my === seq.current) setErr(workError(e, wt('g2.pumlFailed')));
      } finally {
        if (my === seq.current) setBusy(false);
      }
    }, 700);
    return () => clearTimeout(h);
  }, [pid, source]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return (
    <div className="flex h-full min-h-[420px]" aria-label={label}>
      {showCode && (
        <div className="flex w-[44%] min-w-[260px] flex-col border-r border-[var(--w-border)]">
          <label htmlFor="puml-src" className="border-b border-[var(--w-border)] px-3 py-1.5 text-[12px] text-[var(--w-text-2)]">PlantUML</label>
          <textarea id="puml-src" spellCheck={false} readOnly={readOnly} value={source} onChange={(e) => onChange(e.target.value)}
            className="min-h-0 flex-1 resize-none bg-[var(--w-panel)] p-3 font-mono text-[12.5px] leading-[1.5] text-[var(--w-text)] outline-none" />
        </div>
      )}
      <div className="relative flex min-w-0 flex-1 items-start justify-center overflow-auto bg-[var(--w-canvas,var(--w-sunken))] p-4">
        {busy && <span className="absolute right-3 top-3"><Spinner size={14} /></span>}
        {err ? (
          <div className="max-w-[520px] rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3 text-[13px]">
            <p className="text-[var(--w-orange-text)]">{err}</p>
            {!showCode && <pre className="mt-2 max-h-[50vh] overflow-auto whitespace-pre-wrap font-mono text-[12px] text-[var(--w-text-2)]">{source}</pre>}
          </div>
        ) : url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="max-w-full rounded bg-white p-2" />
        ) : null}
      </div>
    </div>
  );
}
