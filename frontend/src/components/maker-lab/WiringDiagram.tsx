'use client';

/**
 * Maker Lab — wiring.
 *
 * Two views of the same data, because they answer different questions:
 *   • The pin map answers "where does this wire go?" while you have a
 *     soldering iron in one hand. It is the one you actually use.
 *   • The board diagram answers "is GPIO 34 free?" — the question that
 *     costs an evening when you get it wrong, since ESP32-S3 pins
 *     26–37 are silently taken by flash and octal PSRAM.
 */

import { useState } from 'react';
import type { MakerWire } from '@/types/maker-lab';

// ─── ESP32-S3-DevKitC-1 pin availability ───────────────────
// Not decoration: this is the constraint that shapes the whole build.
type PinState = 'free' | 'used' | 'reserved' | 'strapping' | 'usb';

const RESERVED: Record<number, { state: PinState; why: string }> = {
  19: { state: 'usb', why: 'USB D− — dùng là mất cổng USB' },
  20: { state: 'usb', why: 'USB D+ — dùng là mất cổng USB' },
  0: { state: 'strapping', why: 'chân strapping, đọc lúc khởi động' },
  3: { state: 'strapping', why: 'chân strapping (dùng đọc ADC thì an toàn)' },
  45: { state: 'strapping', why: 'chân strapping, cần kéo xuống lúc boot' },
  46: { state: 'strapping', why: 'chân strapping, chỉ vào' },
};
for (let i = 26; i <= 32; i++) RESERVED[i] = { state: 'reserved', why: 'SPI flash — KHÔNG dùng được' };
for (let i = 33; i <= 37; i++)
  RESERVED[i] = { state: 'reserved', why: 'PSRAM octal trên bản R8 — KHÔNG dùng được' };

const STATE_STYLE: Record<PinState, { bg: string; fg: string; label: string }> = {
  free: { bg: 'rgba(148,163,184,0.18)', fg: 'var(--text-muted)', label: 'Còn trống' },
  used: { bg: '#22d3ee', fg: '#04212a', label: 'Đã dùng' },
  reserved: { bg: '#ef4444', fg: '#fff', label: 'Bị chiếm (flash/PSRAM)' },
  strapping: { bg: '#f59e0b', fg: '#2b1a00', label: 'Strapping — cẩn thận' },
  usb: { bg: '#a855f7', fg: '#fff', label: 'USB' },
};

/** Pull "GPIO12" out of a pin cell like "GPIO3 (ADC1_CH2)". */
function gpioOf(text: string): number | null {
  const m = /GPIO\s*(\d+)/i.exec(text);
  return m ? Number(m[1]) : null;
}

export function WiringDiagram({ wiring }: { wiring: MakerWire[] | null }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  if (!wiring?.length) return null;

  const used = new Map<number, MakerWire>();
  for (const w of wiring) {
    const g = gpioOf(w.toPin) ?? gpioOf(w.fromPin);
    if (g !== null) used.set(g, w);
  }

  const groups = Array.from(new Set(wiring.map((w) => w.group)));

  return (
    <div className="space-y-6">
      {/* ── Pin availability map ── */}
      <section
        className="rounded-xl border p-4"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
      >
        <h4 className="mb-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Bản đồ chân ESP32-S3-DevKitC-1 (N16R8)
        </h4>
        <p className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          Bản R8 dùng PSRAM octal, nên GPIO 33–37 <strong>bị chiếm</strong> — đây là cái bẫy hay gặp
          nhất, vì trên bản R2 quad-PSRAM thì mấy chân đó lại dùng được bình thường.
        </p>

        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-10 md:grid-cols-13">
          {Array.from({ length: 49 }, (_, gpio) => {
            const wire = used.get(gpio);
            const res = RESERVED[gpio];
            const state: PinState = wire ? 'used' : res ? res.state : 'free';
            const style = STATE_STYLE[state];
            const tip = wire
              ? `GPIO${gpio} → ${wire.from} ${wire.fromPin}`
              : res
                ? `GPIO${gpio} — ${res.why}`
                : `GPIO${gpio} — còn trống`;
            return (
              <div
                key={gpio}
                title={tip}
                className="flex h-9 cursor-help items-center justify-center rounded font-mono text-[11px] font-semibold transition-transform hover:scale-110"
                style={{ background: style.bg, color: style.fg }}
              >
                {gpio}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
          {(Object.keys(STATE_STYLE) as PinState[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <span className="h-3 w-3 rounded-sm" style={{ background: STATE_STYLE[s].bg }} />
              {STATE_STYLE[s].label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Pin map, grouped ── */}
      {groups.map((group) => {
        const rows = wiring.filter((w) => w.group === group);
        const open = openGroup === null || openGroup === group;
        return (
          <section
            key={group}
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <button
              onClick={() => setOpenGroup(open && openGroup === group ? '' : group)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors"
              style={{ background: 'var(--bg-surface)' }}
            >
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {group}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {rows.length} dây
              </span>
            </button>

            {open && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr style={{ color: 'var(--text-muted)' }} className="text-left text-xs">
                      <th className="px-4 py-2 font-medium">Linh kiện</th>
                      <th className="px-2 py-2 font-medium">Chân</th>
                      <th className="px-2 py-2 font-medium" />
                      <th className="px-2 py-2 font-medium">Nối tới</th>
                      <th className="px-2 py-2 font-medium">Chân</th>
                      <th className="px-4 py-2 font-medium">Màu dây</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((w, i) => (
                      <tr
                        key={i}
                        className="border-t align-top"
                        style={{ borderColor: 'var(--border-light)' }}
                      >
                        <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                          {w.from}
                        </td>
                        <td className="px-2 py-2 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {w.fromPin}
                        </td>
                        <td className="px-2 py-2" style={{ color: 'var(--text-muted)' }}>
                          →
                        </td>
                        <td className="px-2 py-2" style={{ color: 'var(--text-primary)' }}>
                          {w.to}
                        </td>
                        <td className="px-2 py-2">
                          <span
                            className="rounded px-1.5 py-0.5 font-mono text-xs font-semibold"
                            style={{
                              background: gpioOf(w.toPin) !== null ? 'rgba(34,211,238,0.18)' : 'transparent',
                              color: gpioOf(w.toPin) !== null ? '#0891b2' : 'var(--text-secondary)',
                            }}
                          >
                            {w.toPin}
                          </span>
                          {w.note && (
                            <p className="mt-1 max-w-md text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                              {w.note}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {w.wireColor ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
