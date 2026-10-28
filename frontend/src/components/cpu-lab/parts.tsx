'use client';
/** Mảnh dùng chung của CPU Lab: khung (dùng lại khung OS Lab), hàng bit bấm được, ô đọc số. */
import type { ReactNode } from 'react';
import { Frame, tx, type Lang } from '../os-lab/ui';
import { labSfx } from '../labs/sfx';
import c from './cpulab.module.css';

export { c as cc };

export function CpuFrame({ lang, title, sub, children }: { lang: Lang; title: string; sub?: string; children: ReactNode }) {
  return (
    <Frame badge={tx(lang, 'CPU lab · from zero', 'Phòng lab máy tính · từ số 0')} title={title} sub={sub}>
      <div className={c.root2}>{children}</div>
    </Frame>
  );
}

/**
 * Hàng w bit, bit cao bên trái. onToggle = null ⇒ chỉ xem. `mark(k)` tô viền một bit (vd. bit vừa đổi).
 * `signBit` tô đỏ bit cao nhất khi đọc có dấu.
 */
export function BitRow({ value, width, onToggle, showWeights, signBit, small, mark, label, tour }: {
  value: number; width: number; onToggle?: ((k: number) => void) | null; showWeights?: boolean | 'signed'; signBit?: boolean; small?: boolean;
  mark?: (k: number) => boolean; label?: string; tour?: string;
}) {
  const cells: ReactNode[] = [];
  for (let k = width - 1; k >= 0; k--) {
    const on = Math.floor(value / 2 ** k) % 2 === 1;
    // ≤ 8 bit: hiện trọng số (128 64 … 1); rộng hơn: hiện số thứ tự bit mỗi 4 bit cho đỡ chật
    const w = width > 8 ? (k % 4 === 0 ? `b${k}` : '') : showWeights === 'signed' && k === width - 1 ? `−${2 ** k}` : `${2 ** k}`;
    cells.push(
      <span key={k} className={c.bitCell}>
        <button type="button" disabled={!onToggle} aria-pressed={on} aria-label={`bit ${k}`} title={`bit ${k} · 2^${k} = ${2 ** k}`}
          className={cx(c.bitBtn, on && c.on, signBit && k === width - 1 && c.sign, small && c.small, mark?.(k) && c.hl)}
          onClick={() => { if (!onToggle) return; labSfx(on ? 'off' : 'on'); onToggle(k); }}>{on ? 1 : 0}</button>
        {showWeights && <span className={c.weight}>{w}</span>}
      </span>,
    );
    if (k > 0 && k % 8 === 0) cells.push(<span key={`g${k}`} className={c.byteGap} />);
  }
  return (
    <div data-tour={tour}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ol-muted)', marginBottom: 3 }}>{label}</div>}
      <div className={c.bits}>{cells}</div>
    </div>
  );
}

export function ReadItem({ k, v, title, tour }: { k: string; v: ReactNode; title?: string; tour?: string }) {
  return <div className={c.readItem} title={title} data-tour={tour}><div className={c.k}>{k}</div><div className={c.v}>{v}</div></div>;
}

/** Ký tự in được cho một byte, hoặc tên ký tự điều khiển. */
export function asciiName(b: number): string {
  const CTRL = ['NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'TAB', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI', 'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US'];
  if (b < 32) return CTRL[b];
  if (b === 32) return 'SPACE';
  if (b === 127) return 'DEL';
  if (b < 127) return `'${String.fromCharCode(b)}'`;
  return '—';
}

/** Hiện chữ có ký tự điều khiển (C0/C1) thành ký hiệu nhìn thấy được. */
export const visible = (t: string) => Array.from(t).map((ch) => {
  const cp = ch.codePointAt(0) ?? 0;
  if (cp < 32) return String.fromCodePoint(0x2400 + cp);
  if (cp >= 0x80 && cp <= 0x9f) return '¤';
  return ch;
}).join('');

/** như cx của os-lab nhưng nhận cả số (bitAt(...) && lớp) */
export const cx = (...a: Array<string | number | false | null | undefined>) => a.filter((x) => typeof x === 'string' && x).join(' ');
export { tx };
export type { Lang };
