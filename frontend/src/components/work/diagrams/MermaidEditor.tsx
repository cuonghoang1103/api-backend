'use client';

/**
 * CTW Diagram — trình soạn Mermaid: mã nguồn (có số dòng, tô dòng lỗi) + xem trước TRỰC TIẾP theo theme CT Work (chờ 350 ms
 * ngừng gõ) + báo lỗi cú pháp rõ (mermaid.parse thật: dòng nào, cần gì). Chế độ xem: Light / Dark / Print.
 * 17/10/2026: xem trước trong khung PHÓNG/KÉO (PanZoom — Ctrl/⌘+lăn, chụm, kéo nền, Vừa khung, 100%, bản đồ nhỏ, F = phóng to
 * toàn khung); ngăn mã đổi cỡ bằng vách kéo, gập được.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWT } from '@/components/work/i18n';
import { parseMermaid, renderDiagramSvg, type ParseResult, type Variant } from './render';
import PanZoom from './viewer/PanZoom';
import { LIMITS, Splitter, useMinWidth } from './viewer/panels';

const PAPER: Record<Variant, string> = { light: '#fbfaf7', dark: '#141416', print: '#ffffff' };

function useMermaidSvg(source: string, variant: Variant) {
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => {
      if (!source.trim()) { setSvg(null); setErr(null); return; }
      renderDiagramSvg(source, variant)
        .then((x) => { if (alive) { setSvg(x); setErr(null); } })
        .catch((e: unknown) => { if (alive) setErr(String((e as Error)?.message ?? e).split('\n')[0].slice(0, 200)); });
    }, 350);
    return () => { alive = false; clearTimeout(t); };
  }, [source, variant]);
  return { svg, err };
}

export function MermaidPreview({ source, variant, className, label }: { source: string; variant: Variant; className?: string; label: string }) {
  const { svg, err } = useMermaidSvg(source, variant);
  return (
    <div className={cn('ctw-dg-preview', `ctw-dg-${variant}`, className)} role="img" aria-label={label}>
      {/* SVG do mermaid sinh với securityLevel 'strict' (không HTML/script từ mã nguồn). */}
      {svg ? <div className="ctw-dg-svg" dangerouslySetInnerHTML={{ __html: svg }} /> : null}
      {!svg && err ? <p className="p-4 text-[12.5px] text-[var(--w-text-3)]">{err}</p> : null}
    </div>
  );
}

/** Xem trước trong khung phóng/kéo — lỗi cú pháp lúc đang gõ thì GIỮ hình tốt gần nhất. */
export function MermaidCanvas({ source, variant, label, fitKey, maximised, onToggleMaximise }: { source: string; variant: Variant; label: string; fitKey?: string | number; maximised?: boolean; onToggleMaximise?: () => void }) {
  const { svg, err } = useMermaidSvg(source, variant);
  const html = useMemo(() => (svg ? { __html: svg } : null), [svg]);
  return (
    <div className="relative h-full min-h-0">
      {html ? (
        <PanZoom fitKey={fitKey} label={label} background={PAPER[variant]} maximised={maximised} onToggleMaximise={onToggleMaximise}
          minimap={() => <div className="ctw-dg-svg" style={{ pointerEvents: 'none' }} dangerouslySetInnerHTML={html} />}>
          <div className={cn('ctw-dg-preview', `ctw-dg-${variant}`)} role="img" aria-label={label}><div className="ctw-dg-svg" dangerouslySetInnerHTML={html} /></div>
        </PanZoom>
      ) : (
        <div className="grid h-full place-items-center p-4 text-[12.5px] text-[var(--w-text-3)]" style={{ background: PAPER[variant] }}>{err ?? ''}</div>
      )}
      {html && err && <p className="pointer-events-none absolute left-2 top-2 max-w-[70%] rounded-[6px] border border-[var(--w-border)] bg-[var(--w-panel)] px-2 py-1 text-[11.5px] text-[var(--w-red-text)]">{err}</p>}
    </div>
  );
}

export default function MermaidEditor({ source, onChange, readOnly, variant, onParsed, label, showCode = true, codeW = 460, onCodeW, onToggleCode, fitKey, maximised, onToggleMaximise }: {
  source: string; onChange: (v: string) => void; readOnly: boolean; variant: Variant; onParsed?: (r: ParseResult) => void; label: string; showCode?: boolean;
  codeW?: number; onCodeW?: (w: number) => void; onToggleCode?: () => void; fitKey?: string | number; maximised?: boolean; onToggleMaximise?: () => void;
}) {
  const { t } = useWT();
  const wide = useMinWidth(900);
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => Math.max(1, source.split('\n').length), [source]);
  useEffect(() => {
    let alive = true;
    const h = setTimeout(() => parseMermaid(source).then((r) => { if (alive) { setParsed(r); onParsed?.(r); } }), 300);
    return () => { alive = false; clearTimeout(h); };
    // onParsed là callback của cha — chỉ chạy lại khi nguồn đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);
  const showPreview = wide || !showCode;
  return (
    <div className="flex h-full min-h-0">
      <div className={cn('flex min-h-[260px] min-w-0 flex-col', !showCode && 'hidden', wide ? 'shrink-0' : 'flex-1')} style={wide ? { width: codeW } : undefined}>
        <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[var(--w-sunken)]">
          <div ref={gutterRef} aria-hidden="true" className="w-10 shrink-0 select-none overflow-hidden py-3 pr-2 text-right font-mono text-[12px] leading-[20px] text-[var(--w-text-3)]">
            {Array.from({ length: lines }, (_, i) => (
              <div key={i} className={cn(parsed && !parsed.ok && parsed.line === i + 1 && 'rounded-sm bg-[var(--w-red-soft,rgba(207,52,47,0.14))] text-[var(--w-red-text)]')}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={taRef}
            value={source}
            readOnly={readOnly}
            spellCheck={false}
            aria-label={t('diagram.sourceLabel')}
            aria-invalid={parsed ? !parsed.ok : undefined}
            onScroll={(e) => { if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop; }}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Tab' && !readOnly) {
                e.preventDefault();
                const el = e.currentTarget;
                const s = el.selectionStart;
                const next = `${source.slice(0, s)}  ${source.slice(el.selectionEnd)}`;
                onChange(next);
                requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
              }
            }}
            className="min-h-0 flex-1 resize-none bg-transparent py-3 pr-3 font-mono text-[12.5px] leading-[20px] text-[var(--w-text)] outline-none"
            wrap="off"
          />
        </div>
        <div className={cn('flex items-start gap-1.5 border-t border-[var(--w-border)] px-3 py-2 text-[12px]', parsed?.ok ? 'text-[var(--w-green-text)]' : 'text-[var(--w-red-text)]')} role="status" aria-live="polite">
          {parsed === null ? <span className="text-[var(--w-text-3)]">{t('diagram.checking')}</span> : parsed.ok ? (
            <><CheckCircle2 size={14} className="mt-px shrink-0" aria-hidden="true" /> {t('diagram.syntaxOk')}</>
          ) : (
            <><AlertTriangle size={14} className="mt-px shrink-0" aria-hidden="true" /> <span>{parsed.line ? t('diagram.syntaxErrorLine', { line: parsed.line }) : t('diagram.syntaxError')} {parsed.message}</span></>
          )}
        </div>
      </div>
      {showCode && wide && onCodeW && <Splitter value={codeW} min={LIMITS.codeW[0]} max={LIMITS.codeW[1]} onChange={onCodeW} side="left" onToggle={onToggleCode} label={t('dbd.resizeCode')} />}
      {showPreview && (
        <div className="min-h-[300px] min-w-0 flex-1 border-l border-[var(--w-border)]">
          <MermaidCanvas source={source} variant={variant} label={label} fitKey={fitKey} maximised={maximised} onToggleMaximise={onToggleMaximise} />
        </div>
      )}
    </div>
  );
}
