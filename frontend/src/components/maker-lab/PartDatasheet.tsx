'use client';

/**
 * Maker Lab — tài liệu kỹ thuật một linh kiện.
 *
 * Gộp vào một chỗ những thứ bình thường nằm rải rác: PDF datasheet 80
 * trang, bốn thread diễn đàn, và một video 20 phút. Cấu trúc theo đúng
 * thứ tự câu hỏi người ta thực sự hỏi khi cầm linh kiện lên:
 * nó là gì → nó hoạt động ra sao → chân nào nối đâu → dùng thế nào →
 * cái gì sẽ làm hỏng việc.
 */

import { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  Copy,
  Cpu,
  ExternalLink,
  Lightbulb,
  Plug,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import { PartIcon } from './PartIcon';
import { PartSimulation } from './PartSimulation';
import type { MakerComponent } from '@/types/maker-lab';

export interface PinDoc {
  pin: string;
  name: string;
  type: 'power' | 'gnd' | 'in' | 'out' | 'io' | 'analog' | 'nc';
  desc: string;
  to?: string;
}

export interface PartDocsData {
  overview: string;
  howItWorks: string;
  pinout?: PinDoc[];
  usage: string;
  code?: { lang: string; caption: string; body: string };
  gotchas: string[];
  datasheetUrl?: string;
  sim?: string;
}

const PIN_STYLE: Record<PinDoc['type'], { bg: string; fg: string; label: string }> = {
  power: { bg: '#ef4444', fg: '#fff', label: 'Nguồn' },
  gnd: { bg: '#475569', fg: '#fff', label: 'Đất' },
  in: { bg: '#22d3ee', fg: '#04212a', label: 'Vào' },
  out: { bg: '#34d399', fg: '#052e1a', label: 'Ra' },
  io: { bg: '#a78bfa', fg: '#1e1042', label: 'Hai chiều' },
  analog: { bg: '#fbbf24', fg: '#2b1a00', label: 'Analog' },
  nc: { bg: '#94a3b8', fg: '#0f172a', label: 'Không dùng' },
};

export function PartDatasheet({ component }: { component: MakerComponent }) {
  const docs = component.docs;
  const [copied, setCopied] = useState(false);

  if (!docs) {
    return (
      <p className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        Chưa có tài liệu cho linh kiện này.
      </p>
    );
  }

  function copyCode() {
    if (!docs?.code) return;
    void navigator.clipboard.writeText(docs.code.body);
    setCopied(true);
    toast.success('Đã sao chép code');
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-5">
      {/* ── Đầu trang ── */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'var(--bg-surface)' }}
        >
          <PartIcon
            svgKey={component.svgKey}
            category={component.category}
            imageUrl={component.imageUrl}
            alt={component.name}
            size={68}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {component.name}
          </h3>
          {component.partNumber && (
            <p className="mt-0.5 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              {component.partNumber}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {docs.overview}
          </p>
          {docs.datasheetUrl && (
            <a
              href={docs.datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: 'var(--accent-color)' }}
            >
              <BookOpen size={12} /> Datasheet chính hãng <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* ── Thông số ── */}
      {component.specs && Object.keys(component.specs).length > 0 && (
        <div className="grid gap-x-6 gap-y-1.5 rounded-xl p-3 sm:grid-cols-2" style={{ background: 'var(--bg-surface)' }}>
          {Object.entries(component.specs).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 text-xs">
              <span style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span className="text-right font-medium" style={{ color: 'var(--text-primary)' }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Nguyên lý ── */}
      <Section icon={<Lightbulb size={15} />} title="Nó hoạt động thế nào">
        {docs.howItWorks.split('\n\n').map((p, i) => (
          <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {p}
          </p>
        ))}
      </Section>

      {/* ── Mô phỏng ── */}
      {docs.sim && <PartSimulation sim={docs.sim} />}

      {/* ── Bảng chân ── */}
      {docs.pinout?.length ? (
        <Section icon={<Plug size={15} />} title={`Bảng chân — ${docs.pinout.length} chân`}>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
            <table className="w-full min-w-[580px] text-sm">
              <thead>
                <tr className="text-left text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  <th className="px-3 py-2 font-medium">Chân</th>
                  <th className="px-2 py-2 font-medium">Tên</th>
                  <th className="px-2 py-2 font-medium">Loại</th>
                  <th className="px-2 py-2 font-medium">Mô tả</th>
                  <th className="px-3 py-2 font-medium">Nối vào</th>
                </tr>
              </thead>
              <tbody>
                {docs.pinout.map((p, i) => {
                  const st = PIN_STYLE[p.type];
                  return (
                    <tr key={i} className="border-t align-top" style={{ borderColor: 'var(--border-light)' }}>
                      <td className="px-3 py-2">
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[11px] font-bold"
                          style={{ background: st.bg, color: st.fg }}
                        >
                          {p.pin}
                        </span>
                      </td>
                      <td className="px-2 py-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {p.name}
                      </td>
                      <td className="px-2 py-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {st.label}
                      </td>
                      <td className="max-w-xs px-2 py-2 text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                        {p.desc}
                      </td>
                      <td className="px-3 py-2 text-xs" style={{ color: p.to?.startsWith('(') ? 'var(--text-muted)' : '#0891b2' }}>
                        {p.to ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
            {Object.entries(PIN_STYLE).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: v.bg }} />
                {v.label}
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ── Cách dùng ── */}
      <Section icon={<Wrench size={15} />} title="Dùng trong con robot này">
        {docs.usage.split('\n\n').map((p, i) => (
          <p key={i} className="whitespace-pre-line text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {p}
          </p>
        ))}
      </Section>

      {/* ── Code ── */}
      {docs.code && (
        <Section icon={<Cpu size={15} />} title="Code mẫu">
          <p className="mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {docs.code.caption}
          </p>
          <div className="relative">
            <button
              onClick={copyCode}
              className="absolute right-2 top-2 flex items-center gap-1 rounded-md px-2 py-1 text-[11px]"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#a5f3fc' }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Đã chép' : 'Chép'}
            </button>
            <pre
              className="overflow-x-auto rounded-xl p-4 text-[12px] leading-relaxed"
              style={{ background: '#0b0d10', color: '#c9d6e4' }}
            >
              <code>{docs.code.body}</code>
            </pre>
          </div>
        </Section>
      )}

      {/* ── Bẫy ── */}
      {docs.gotchas.length > 0 && (
        <section
          className="rounded-xl border p-4"
          style={{ borderColor: '#ef444455', background: 'rgba(239,68,68,0.05)' }}
        >
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: '#ef4444' }}>
            <AlertTriangle size={15} /> Chỗ dễ hỏng việc
          </h4>
          <ul className="space-y-2">
            {docs.gotchas.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <span className="shrink-0" style={{ color: '#ef4444' }}>
                  {i + 1}.
                </span>
                {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Vì sao chọn con này ── */}
      {component.whyThisPart && (
        <section
          className="rounded-xl border-l-2 py-1 pl-4"
          style={{ borderColor: 'var(--accent-color)' }}
        >
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent-color)' }}>
            Vì sao chọn con này
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {component.whyThisPart}
          </p>
        </section>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        <span style={{ color: 'var(--accent-color)' }}>{icon}</span>
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
