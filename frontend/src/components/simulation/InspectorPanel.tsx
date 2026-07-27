'use client';

/**
 * Bảng soi — "DevTools" của studio.
 *
 * Đây là nơi giảng viên chỉ vào khi nói "các bạn nhìn header này": thân
 * JSON, header, tham số truy vấn, mã trạng thái, độ trễ mô phỏng và nhật ký
 * kiểu terminal. Bảng này KHÔNG nằm trong video (video chỉ có canvas) — nó
 * dành cho màn hình của người dạy và cho người tự học đọc trên web.
 */

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, ChevronRight, Clipboard, Gauge, Terminal } from 'lucide-react';
import { JsonView } from './JsonView';
import { FLOW_STYLES, statusColor } from './theme';
import type { Lang, SimStep } from './types';
import { tr } from './types';

interface Props {
  steps: SimStep[];
  stepIndex: number;
  lang: Lang;
}

function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(ms >= 10000 ? 0 : 2)} s`;
  if (ms < 1) return `${ms.toFixed(2)} ms`;
  return `${ms.toFixed(ms < 10 ? 1 : 0)} ms`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5d6d8c]">
        <ChevronRight className="h-3 w-3" />
        {title}
      </div>
      {children}
    </div>
  );
}

function KeyValues({ data }: { data: Record<string, string> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#1b2440] bg-[#070b16]">
      {Object.entries(data).map(([k, v], i) => (
        <div
          key={k}
          className={`flex gap-3 px-3 py-1.5 font-mono text-[12px] leading-relaxed ${i > 0 ? 'border-t border-[#141c31]' : ''}`}
        >
          <span className="shrink-0 text-[#7dd3fc]">{k}</span>
          <span className="min-w-0 break-all text-[#b6c4dd]">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function InspectorPanel({ steps, stepIndex, lang }: Props) {
  const step = steps[stepIndex];
  const [copied, setCopied] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // Nhật ký cuộn theo bước đang chạy, giống console của DevTools.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [stepIndex]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  if (!step) return null;
  const flow = FLOW_STYLES[step.kind];

  const copyPayload = async () => {
    if (step.payload === undefined) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(step.payload, null, 2));
      setCopied(true);
    } catch {
      /* Clipboard bị chặn (thường do không phải HTTPS) — bỏ qua im lặng. */
    }
  };

  const visibleLogs = steps.slice(0, stepIndex + 1).filter((s) => s.log);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      {/* Thẻ tóm tắt bước */}
      <div className="rounded-xl border border-[#1d2740] bg-[#0a0f1e] p-3.5">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-md px-2 py-0.5 font-mono text-[11px] font-bold"
            style={{ background: `${flow.color}22`, color: flow.color, border: `1px solid ${flow.color}55` }}
          >
            {flow.legend}
          </span>
          {step.status ? (
            <span
              className="rounded-md px-2 py-0.5 font-mono text-[11px] font-bold"
              style={{ background: `${statusColor(step.status)}22`, color: statusColor(step.status), border: `1px solid ${statusColor(step.status)}55` }}
            >
              {step.status}
            </span>
          ) : null}
          {step.latencyMs != null ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-[#1e3a5f] bg-[#0d1a2e] px-2 py-0.5 font-mono text-[11px] font-bold text-[#38bdf8]">
              <Gauge className="h-3 w-3" />
              {formatLatency(step.latencyMs)}
            </span>
          ) : null}
        </div>
        <h3 className="text-[15px] font-bold leading-snug text-[#e8eefc]">{tr(step.title, lang)}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#93a4c4]">{tr(step.detail, lang)}</p>
      </div>

      {/* Gợi ý điểm dừng cho giảng viên */}
      {step.teachingNote ? (
        <div className="flex gap-2.5 rounded-xl border border-[#3f3410] bg-[#1a1503] p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#fbbf24]" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#fbbf24]">
              {lang === 'vi' ? 'Điểm dừng để giảng' : 'Pause point'}
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#e2cf9a]">{tr(step.teachingNote, lang)}</p>
          </div>
        </div>
      ) : null}

      {step.query ? (
        <Section title={lang === 'vi' ? 'Tham số truy vấn' : 'Query params'}>
          <KeyValues data={step.query} />
        </Section>
      ) : null}

      {step.headers ? (
        <Section title="Headers">
          <KeyValues data={step.headers} />
        </Section>
      ) : null}

      {step.payload !== undefined ? (
        <Section title={lang === 'vi' ? 'Thân dữ liệu' : 'Payload'}>
          <div className="relative">
            <button
              type="button"
              onClick={copyPayload}
              className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border border-[#243050] bg-[#0d1426] px-2 py-1 text-[10.5px] font-semibold text-[#93a4c4] transition-colors hover:border-[#3a4d7a] hover:text-[#e8eefc]"
            >
              {copied ? <Check className="h-3 w-3 text-[#4ade80]" /> : <Clipboard className="h-3 w-3" />}
              {copied ? (lang === 'vi' ? 'Đã chép' : 'Copied') : (lang === 'vi' ? 'Chép' : 'Copy')}
            </button>
            <JsonView data={step.payload} />
          </div>
        </Section>
      ) : null}

      {/* Nhật ký tích luỹ tới bước hiện tại */}
      {visibleLogs.length > 0 ? (
        <Section title={lang === 'vi' ? 'Nhật ký' : 'Log'}>
          <div
            ref={logRef}
            className="max-h-48 overflow-y-auto rounded-lg border border-[#1b2440] bg-[#070b16] p-2.5 font-mono text-[11.5px] leading-relaxed"
          >
            {visibleLogs.map((s, i) => (
              <div key={s.id} className="flex gap-2">
                <Terminal className="mt-[3px] h-3 w-3 shrink-0" style={{ color: FLOW_STYLES[s.kind].color }} />
                <span className={i === visibleLogs.length - 1 ? 'text-[#e8eefc]' : 'text-[#6b7c9b]'}>
                  {tr(s.log, lang)}
                </span>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
