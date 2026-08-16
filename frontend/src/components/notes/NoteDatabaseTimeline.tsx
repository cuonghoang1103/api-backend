'use client';

/**
 * TimelineView — dòng thời gian kiểu Gantt, KÉO ĐƯỢC để đổi ngày.
 *
 * ─── Vì sao phải kéo được ───
 * Một Gantt chỉ để nhìn thì chỉ là cái biểu đồ: muốn dời một việc vẫn phải mở
 * dòng ra, tìm ô ngày, gõ lại. Thứ khiến dòng thời gian đáng dùng khi lập kế
 * hoạch là dời việc NGAY TRÊN CHỖ ĐANG NHÌN — thấy nó đè lên việc khác thì
 * kéo sang, không phải rời mắt đi tính ngày.
 *
 * ─── Chọn cột ngày ───
 * Cần một cột bắt đầu; cột kết thúc là tuỳ chọn. Không có cột kết thúc thì mỗi
 * việc là một thanh dài một ngày — vẫn xếp được lịch, chỉ là không có độ dài.
 * Người dùng chọn cột nào ở thanh trên; lựa chọn lưu vào `config` của khung
 * nhìn (xem NoteDatabaseTable).
 *
 * ─── Đơn vị là NGÀY, không phải mili giây ───
 * Mọi phép tính vị trí đều quy về số ngày kể từ mốc đầu. Giữ mili giây thì
 * một việc lưu lúc 23:30 sẽ vẽ lệch gần trọn một ô so với việc lưu lúc 00:30
 * của cùng ngày hôm đó, và người dùng thấy hai việc "cùng ngày" không thẳng
 * hàng nhau.
 */
import { useMemo, useRef, useState } from 'react';
import type { NoteDatabaseProperty, NoteDatabaseRow } from '@/lib/api';
import { rowTitle } from '@/lib/noteDatabaseValues';

const DAY_MS = 86_400_000;
/** Bề rộng một ngày, tính bằng px. */
const DAY_W = 26;
/** Số ngày đệm hai đầu để việc ở rìa không dính mép. */
const PAD_DAYS = 3;

export interface TimelineProps {
  properties: NoteDatabaseProperty[];
  rows: NoteDatabaseRow[];
  onOpenRow?: (rowId: number) => void;
  /** Cột ngày bắt đầu. Không có thì khung nhìn chỉ hiện lời nhắc chọn cột. */
  startPropertyId: number | null;
  /** Cột ngày kết thúc (tuỳ chọn). */
  endPropertyId: number | null;
  onPickProperties: (next: { startPropertyId: number | null; endPropertyId: number | null }) => void;
  /** Ghi ngày mới sau khi kéo. Vắng mặt = chỉ xem. */
  onMoveRow?: (rowId: number, next: { start: string; end: string | null }) => void;
}

/** Số ngày kể từ mốc 0 của lịch — bỏ hẳn phần giờ. */
function dayIndex(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const t = new Date(String(value)).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor(t / DAY_MS);
}

function dayToISO(day: number): string {
  return new Date(day * DAY_MS).toISOString();
}

function shortLabel(day: number): string {
  return new Date(day * DAY_MS).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export default function TimelineView({
  properties, rows, onOpenRow, startPropertyId, endPropertyId, onPickProperties, onMoveRow,
}: TimelineProps) {
  const dateProperties = properties.filter(
    (p) => p.type === 'DATE' || p.type === 'CREATED_TIME' || p.type === 'LAST_EDITED_TIME',
  );

  /** Kéo đang diễn ra: dòng nào, lệch bao nhiêu ngày, kéo cả thanh hay kéo mép. */
  const [drag, setDrag] = useState<{ rowId: number; deltaDays: number; mode: 'move' | 'resize' } | null>(null);
  const dragStartX = useRef(0);

  const bars = useMemo(() => {
    if (startPropertyId === null) return [];
    return rows.flatMap((row) => {
      const start = dayIndex(row.values[startPropertyId] ?? null);
      if (start === null) return [];
      const rawEnd = endPropertyId === null ? null : dayIndex(row.values[endPropertyId] ?? null);
      // Ngày kết thúc TRƯỚC ngày bắt đầu là dữ liệu người dùng gõ nhầm. Kẹp về
      // ngày bắt đầu thay vì vẽ thanh âm — thanh âm sẽ tràn ngược ra ngoài
      // khung và che mất các việc khác.
      const end = rawEnd === null ? start : Math.max(rawEnd, start);
      return [{ row, start, end }];
    });
  }, [rows, startPropertyId, endPropertyId]);

  const range = useMemo(() => {
    if (bars.length === 0) {
      const today = Math.floor(Date.now() / DAY_MS);
      return { from: today - 7, to: today + 21 };
    }
    const from = Math.min(...bars.map((b) => b.start)) - PAD_DAYS;
    const to = Math.max(...bars.map((b) => b.end)) + PAD_DAYS;
    // Trần 400 ngày: một dòng lỡ có ngày năm 1970 hoặc 2999 sẽ kéo dải rộng ra
    // hàng trăm nghìn ô và trình duyệt đứng hình khi dựng chúng.
    return { from, to: Math.min(to, from + 400) };
  }, [bars]);

  const totalDays = range.to - range.from + 1;
  const today = Math.floor(Date.now() / DAY_MS);

  if (dateProperties.length === 0) {
    return (
      <p className="px-3 py-6 text-center text-[13px] text-slate-500">
        Cần ít nhất một cột kiểu Ngày để dựng dòng thời gian.
      </p>
    );
  }

  const beginDrag = (event: React.PointerEvent, rowId: number, mode: 'move' | 'resize') => {
    if (!onMoveRow) return;
    event.preventDefault();
    event.stopPropagation();
    // Bắt con trỏ vào chính phần tử này: thiếu bước đó, kéo nhanh ra ngoài
    // thanh là mất luôn `pointermove` và thanh kẹt lại giữa chừng.
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragStartX.current = event.clientX;
    setDrag({ rowId, deltaDays: 0, mode });
  };

  const onDragMove = (event: React.PointerEvent) => {
    if (!drag) return;
    setDrag({ ...drag, deltaDays: Math.round((event.clientX - dragStartX.current) / DAY_W) });
  };

  const endDrag = () => {
    if (!drag) return;
    const bar = bars.find((b) => b.row.id === drag.rowId);
    if (bar && drag.deltaDays !== 0 && onMoveRow) {
      if (drag.mode === 'move') {
        onMoveRow(bar.row.id, {
          start: dayToISO(bar.start + drag.deltaDays),
          end: endPropertyId === null ? null : dayToISO(bar.end + drag.deltaDays),
        });
      } else {
        // Kéo mép phải chỉ đổi ngày kết thúc, và không cho ngắn hơn một ngày.
        const nextEnd = Math.max(bar.end + drag.deltaDays, bar.start);
        onMoveRow(bar.row.id, { start: dayToISO(bar.start), end: dayToISO(nextEnd) });
      }
    }
    setDrag(null);
  };

  return (
    <div className="space-y-2 px-3 py-2">
      <div className="flex flex-wrap items-center gap-1 text-[11.5px] text-slate-500">
        <span>Bắt đầu</span>
        <select
          value={startPropertyId ?? ''}
          aria-label="Cột ngày bắt đầu"
          onChange={(e) => onPickProperties({
            startPropertyId: e.target.value === '' ? null : Number(e.target.value),
            endPropertyId,
          })}
          className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11.5px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
        >
          <option value="">— chọn cột —</option>
          {dateProperties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <span className="ml-2">Kết thúc</span>
        <select
          value={endPropertyId ?? ''}
          aria-label="Cột ngày kết thúc"
          onChange={(e) => onPickProperties({
            startPropertyId,
            endPropertyId: e.target.value === '' ? null : Number(e.target.value),
          })}
          className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[11.5px] dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
        >
          <option value="">— không có —</option>
          {dateProperties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {onMoveRow && startPropertyId !== null && (
          <span className="ml-auto text-slate-400">Kéo thanh để dời, kéo mép phải để đổi độ dài</span>
        )}
      </div>

      {startPropertyId === null ? (
        <p className="py-6 text-center text-[13px] text-slate-500">Chọn cột ngày bắt đầu để xem dòng thời gian.</p>
      ) : bars.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-slate-500">Chưa dòng nào có ngày bắt đầu.</p>
      ) : (
        <div className="overflow-x-auto" onPointerMove={onDragMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <div style={{ width: totalDays * DAY_W, minWidth: '100%' }}>
            {/* Thước ngày. Chỉ ghi chữ mỗi 3 ngày — ghi hết thì nhãn đè lên
                nhau ở bề rộng 26px và không đọc được cái nào. */}
            <div className="relative mb-1 h-5 border-b border-slate-200 dark:border-white/[0.08]">
              {Array.from({ length: totalDays }, (_, i) => range.from + i).map((day, i) => (
                <span
                  key={day}
                  style={{ left: i * DAY_W, width: DAY_W }}
                  className={`absolute top-0 text-center text-[9.5px] ${
                    day === today ? 'font-bold text-teal-600 dark:text-teal-300' : 'text-slate-400'
                  }`}
                >
                  {i % 3 === 0 ? shortLabel(day) : ''}
                </span>
              ))}
            </div>

            <div className="relative space-y-1">
              {/* Vạch HÔM NAY chạy suốt chiều cao — mốc để đọc "việc này trễ
                  chưa" mà không phải dò lên thước. */}
              {today >= range.from && today <= range.to && (
                <div
                  aria-hidden
                  style={{ left: (today - range.from) * DAY_W }}
                  className="pointer-events-none absolute top-0 bottom-0 w-px bg-teal-500/50"
                />
              )}

              {bars.map(({ row, start, end }) => {
                const moving = drag?.rowId === row.id;
                const shift = moving && drag.mode === 'move' ? drag.deltaDays : 0;
                const stretch = moving && drag.mode === 'resize' ? drag.deltaDays : 0;
                const left = (start - range.from + shift) * DAY_W;
                const width = Math.max(end - start + 1 + stretch, 1) * DAY_W;
                return (
                  <div key={row.id} className="relative h-7">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => { if (!drag) onOpenRow?.(row.id); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenRow?.(row.id); } }}
                      onPointerDown={(e) => beginDrag(e, row.id, 'move')}
                      style={{ left, width }}
                      title={`${rowTitle(properties, row.values)} · ${shortLabel(start + shift)} → ${shortLabel(end + shift + stretch)}`}
                      className={`absolute top-0 flex h-7 items-center rounded-md border border-teal-500/40 bg-teal-100 px-2 text-[11.5px] text-teal-900 dark:bg-teal-500/25 dark:text-teal-100 ${
                        onMoveRow ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                      } ${moving ? 'opacity-80 ring-2 ring-teal-500' : ''}`}
                    >
                      <span className="truncate">{rowTitle(properties, row.values)}</span>
                      {onMoveRow && endPropertyId !== null && (
                        <span
                          onPointerDown={(e) => beginDrag(e, row.id, 'resize')}
                          role="presentation"
                          className="absolute right-0 top-0 h-full w-2 cursor-ew-resize rounded-r-md hover:bg-teal-500/40"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
