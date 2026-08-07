'use client';

/**
 * Maker Lab — firmware plan.
 *
 * Answers "what am I actually going to write?" before a single line
 * exists. Each module gets its purpose AND the trap that comes with
 * it — the `notes` field is where the hard-won parts live (pin the
 * audio task to core 1, put the safety stop in firmware not on the
 * server, verify the OTA hash).
 */

import { useState } from 'react';
import { CheckCircle2, ChevronRight, Circle, Clock, Download, FileCode2, Terminal } from 'lucide-react';
import type { MakerFirmwareBuild, MakerFirmwareModule } from '@/types/maker-lab';

const STATUS_META = {
  planned: { icon: Circle, color: 'var(--text-muted)', label: 'Chưa viết' },
  wip: { icon: Clock, color: '#fbbf24', label: 'Đang viết' },
  done: { icon: CheckCircle2, color: '#34d399', label: 'Xong' },
} as const;

export function FirmwarePlan({
  modules,
  builds,
  slug,
}: {
  modules: MakerFirmwareModule[] | null;
  builds: MakerFirmwareBuild[];
  slug: string;
}) {
  const [open, setOpen] = useState<string | null>(modules?.[0]?.name ?? null);

  if (!modules?.length) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        Chưa có lộ trình firmware.
      </p>
    );
  }

  const done = modules.filter((m) => m.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* ── Toolchain ── */}
      <section
        className="rounded-xl border p-4"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
      >
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          <Terminal size={15} /> Bắt đầu
        </h4>
        <p className="mb-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Firmware dùng <strong style={{ color: 'var(--text-primary)' }}>PlatformIO</strong> chứ
          không phải Arduino IDE: quản được thư viện theo phiên bản, cấu hình nằm trong một file
          nộp vào git được, và biên dịch nhanh hơn hẳn. Khung dự án đã có sẵn trong repo.
        </p>
        <pre
          className="overflow-x-auto rounded-lg p-3 text-[12px] leading-relaxed"
          style={{ background: '#0b0d10', color: '#a5f3fc' }}
        >
{`cd firmware/${slug}
cp src/secrets.example.h src/secrets.h   # dán khoá lấy từ tab Điều khiển
pio run -t upload                        # nạp qua USB
pio device monitor                       # xem log`}
        </pre>
      </section>

      {/* ── Module roadmap ── */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {modules.length} module
          </h4>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {done}/{modules.length} đã viết
          </span>
        </div>

        <div className="space-y-2">
          {modules.map((m, i) => {
            const meta = STATUS_META[m.status ?? 'planned'];
            const Icon = meta.icon;
            const isOpen = open === m.name;
            return (
              <div
                key={m.name}
                className="overflow-hidden rounded-xl border"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : m.name)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                  >
                    {i + 1}
                  </span>
                  <Icon size={15} style={{ color: meta.color }} className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {m.name}
                    </span>
                    <span className="ml-2 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {m.file}
                    </span>
                  </span>
                  <ChevronRight
                    size={15}
                    className="shrink-0 transition-transform"
                    style={{
                      color: 'var(--text-muted)',
                      transform: isOpen ? 'rotate(90deg)' : undefined,
                    }}
                  />
                </button>

                {isOpen && (
                  <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border-light)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {m.purpose}
                    </p>
                    {m.notes && (
                      <div
                        className="mt-3 rounded-lg border-l-2 px-3 py-2"
                        style={{ borderColor: '#fbbf24', background: 'rgba(251,191,36,0.06)' }}
                      >
                        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          <strong style={{ color: '#d97706' }}>Lưu ý:</strong> {m.notes}
                        </p>
                      </div>
                    )}
                    {m.code && (
                      <pre
                        className="mt-3 overflow-x-auto rounded-lg p-3 text-[11px] leading-relaxed"
                        style={{ background: '#0b0d10', color: '#a5f3fc' }}
                      >
                        {m.code}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── OTA builds ── */}
      <section
        className="rounded-xl border p-4"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
      >
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          <Download size={15} /> Bản firmware (cập nhật qua mạng)
        </h4>
        {builds.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Chưa có bản nào. Khi bạn đẩy bản build đầu tiên lên, robot sẽ tự tải về từ{' '}
            <code className="font-mono text-[11px]">/api/v1/maker-lab/firmware/{slug}/latest</code>{' '}
            mà không cần cắm cáp.
          </p>
        ) : (
          <ul className="space-y-2">
            {builds.map((b) => (
              <li key={b.id} className="flex items-center gap-3 text-sm">
                <FileCode2 size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                  v{b.version}
                </span>
                {b.isLatest && (
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ background: 'rgba(52,211,153,0.15)', color: '#059669' }}
                  >
                    mới nhất
                  </span>
                )}
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(b.sizeBytes / 1024).toFixed(0)} KB
                </span>
                <span className="ml-auto truncate font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {b.sha256.slice(0, 12)}…
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
